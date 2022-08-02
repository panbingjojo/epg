<?php

namespace Home\Model\User;

use Api\APIController\DebugAPIController;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Order\OrderManager;

class AuthUser000051 extends BaseAuthUser
{
    public function auth()
    {
        $this->orderManager = OrderManager::getInstance(CARRIER_ID);
        $fromId = $_REQUEST['fromId']; // 标识用户是否局方校验
        $this->_setEPGParams();
        if ($fromId == 0) { // 未初始化完成参数
            // 保存EPG相关参数

            // 调用API获取局方鉴权地址
            $authUrl = $this->_getAuthUrl();
            $result = array(
                'result' => -10,
                'msg' => 'should route authUrl',
                'authUrl' => $authUrl,
            );
        } else {
            $result = $this->getCommonAJAXResult();
            if($result['result'] == 0) {
                // 设置订购续订状态
                MasterManager::setAutoOrderFlag("0");
                // 查询童锁状态
                $showPayLock = UserAPI::queryShowPayLockStatus();
                MasterManager::setShowPayLock($showPayLock);
                // 联合活动校验
                $this->_checkJointActivity($result['userId']);
                // 获取活动信息
                $activityInfo = ActivityManager::getActivityInfo();
                // 上报用户行为 -- 登录，tv助手版本号
                DebugAPIController::sendUserBehaviour000051(DebugAPIController::CHINAUNICOM_REPORT_DATA_TYPE["enter"]);
                if($_POST['helperVersion']) DebugAPIController::reportTVHelperInfo();
                $result["activityId"] = $activityInfo['activity_id'];
                $result["activityName"] = $activityInfo['unique_name'];
                $groupType = MasterManager::getUserGroupType();
                $result["userGroupType"] = $groupType ? $groupType : 0;

                $res = $this->getAreaCodeAndPosition();
                if(!MasterManager::getUserIsVip() &&
                    in_array(MasterManager::getAreaCode(), $res['areaCode']) &&
                    in_array(MasterManager::getEnterPosition(), $res['position'])){
                        $this->setDirectPayUrl();
                }
            }
        }
        return $result;
    }

    public function getAreaCodeAndPosition(){
        switch (CARRIER_ID) {
            case CARRIER_ID_CHINAUNICOM:
                $result = array(
                    "areaCode" => array(/*201,*/204,208,209,216,217),//天津要求30秒计费
                    "position" => array(89,191,251,285,304,332,356,367,389,391,399,403,410)
                );
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG:
                $result = array(
                    "areaCode" => array(201,204,209),
                    "position" => array(259,237,260,235,265,266,290,303,346,410)
                );
                break;
            case CARRIER_ID_LDLEGEND:
                $result = array(
                    "areaCode" => array(201),
                    "position" => array(3,4)
                );
                break;
            default:
                $result = array(
                    "areaCode" => array(),
                    "position" => array()
                );
                break;
        }
        return $result;
    }

    public function setDirectPayUrl(){
        if(MasterManager::isReportUserInfo() == 1){
            $result = UserManager::queryReportUserInfo(2);
            LogUtils::info("setDirectPayUrl result:" . json_encode($result));
            if(MasterManager::getAreaCode() == '204' && preg_match('/[a-zA-Z]/',MasterManager::getAccountId())){
                return;
            }
            if (!empty($result) && $result->result == 0) {
                OrderManager::getInstance()->buildDirectPayUrl();
            }
        }
    }

    /** 联合活动局方校验用户信息
     * @param $userId String 管理后台返回的用户标识
     */
    private function _checkJointActivity($userId)
    {
        $userFromType = MasterManager::getUserFromType();
        $isRouteActivity = $userFromType == 2 || $userFromType == 3;
        if ($isRouteActivity && Utils::isJointActivity(MasterManager::getAreaCode(), MasterManager::getSubId())) {
            // 校验用户信息
            $this->orderManager->jointActivityAuthUserInfo($userId);
        }
    }

    /** 查询当前用户身份 */
    public function checkVIPState()
    {
        // 如果是从指定链接进入，则免费体验
        //    -- 链接地址：http://202.99.114.152:30214/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=000051&lmp=110
        if (MasterManager::getEnterPosition() == '110') {
            LogUtils::info("user from lmp[110], set vip");
            $authVip = 1;
        } else {
            // 从OrderManager中鉴权是否Vip
            $authInfo = $this->orderManager->authentication();
            if (CARRIER_ID == CARRIER_ID_CHINAUNICOM) { // 食乐汇
                $authVip = $this->_parseAuthInfo000051($authInfo);
            } else {
                $authVip = $authInfo && $authInfo->result == 0;
            }
        }

        return $authVip;
    }

    /** 解析局方鉴权返回结果
     * @param $authInfo
     * @return bool|int
     */
    private function _parseAuthInfo000051($authInfo)
    {
        if (!$authInfo) return 0; // 鉴权失败

        $result = 0;
        switch ($authInfo->result) {
            case 0:
                $result = 1;
                break;
            case 10000010:
                $authInfoByIntegrate = $this->orderManager->authenticationJiFen();
                $result = $authInfoByIntegrate && $authInfoByIntegrate->result == 0;
                break;
            case 10020001:
                $areaCode = MasterManager::getAreaCode();
                $areaCodeTable = eval(CHINAUNICOM_AREA_CODE_TABLE);
                if ($areaCode == $areaCodeTable["TIANJIN"] && Utils::isTianJinSpecialEntry() != 1) {
                    $authInfoForTIANJIN = $this->orderManager->authenticationTJ();
                    $result = $authInfoForTIANJIN && $authInfoForTIANJIN->result == 0;
                }
                break;
        }
        return $result;
    }

    /** 路由中国联通校验用户地址链接 */
    private function _getAuthUrl()
    {
        // 构建返回地址链接
        $splashIntent = IntentManager::createIntent('splash');
        $splashIntent->setParam("fromId", 1);
        $splashUrl = IntentManager::intentToURL($splashIntent);

        if (substr($splashUrl, 0, strlen("http://")) === "http://") {
            $returnUrl = $splashUrl;
        } else {
            $returnUrl = rawurlencode("http://" . $_SERVER['HTTP_HOST'] . $splashUrl);
        }

        // 路由地址
        return $this->orderManager->buildVerifyUserUrl($returnUrl);
    }

    /**
     * 中国联通初始化数据存储
     */
    private function _setEPGParams()
    {
        $stbModel = $_POST['stbModel'];   // 设备型号
        $stbMac = $_POST['stbMac'];       // 设备MAC地址
        $epgUserId = $_POST['epgUserId']; // 设备绑定用户账号
        $epgDomain = $_POST['epgDomain']; // 设备地址
        $stbId = $_POST['stbId'];         // 设备序列编号

        $epgInfoMap = MasterManager::getEPGInfoMap();

        // 获取中国联通读取映射表
        $areaCodeTable = eval(CHINAUNICOM_AREA_CODE_TABLE);
        // 获取地区
        $areaCode = $epgInfoMap['areaCode'];

        // 用户账号
        $accountId = $epgInfoMap['UserID'];
        $tail = "_" . $areaCode;
        switch ($areaCode) {
            case $areaCodeTable["TIANJIN"]:
            case $areaCodeTable["HEILONGJIANG"]:
            case $areaCodeTable["SHANXI"]:
                if (!$accountId && $epgUserId) { // 大厅跳转应用未携带参数且盒子携带有账号信息
                    if (substr_compare($epgUserId, $tail, -strlen($tail)) !== 0) { //判断$epgUserId 不是以_201结尾的，给他添加结尾
                        $epgUserId = $epgUserId . $tail;
                    }
                    $epgInfoMap['UserID'] = $accountId = $epgUserId;
                    MasterManager::setAccountId($epgUserId);
                    MasterManager::setIPTVPortalUrl($epgDomain);
                }
                break;
            case $areaCodeTable["SHANDONG"]: // 山东
                if (!$accountId) {
                    $backUrl = $epgInfoMap['backurl'] ? $epgInfoMap['backurl'] : $epgDomain;
                    $userAccount = $epgInfoMap['iptv'] ? $epgInfoMap['iptv'] : $epgUserId;
                    if (substr_compare($userAccount, $tail, -strlen($tail)) !== 0) {
                        $userAccount = $userAccount . $tail;
                    }
                    $epgInfoMap['UserID'] = $accountId = $userAccount;
                    MasterManager::setAccountId($userAccount);
                    MasterManager::setIPTVPortalUrl($backUrl);
                }
                break;
            case $areaCodeTable["HENAN"]: // 河南
                if (Utils::isIndependenceEntry()) {
                    LogUtils::info("_setEPGParams HENAN: isIndependenceEntry!!!");

                    $backUrl = $epgInfoMap['backurl'] ? $epgInfoMap["backurl"] : "";
                    if (!$backUrl) {
                        LogUtils::info("_setEPGParams HENAN: backEPGUrl ----> " . $backUrl);
                        MasterManager::setIPTVPortalUrl(urldecode($backUrl));
                    }
                }
                //判断$UserID 不是以_204结尾的，给他添加结尾
                LogUtils::info("SplashAPIController ---> epgInfoMap:" . json_encode($epgInfoMap));
                if(empty($epgInfoMap['UserID']) || $epgInfoMap['UserID'] == $tail){
                    $epgInfoMap['UserID'] = $epgUserId.$tail;
                    $epgInfoMap['stbModel'] = $stbModel;
                    $epgInfoMap['stbMac'] = $stbMac;
                    $epgInfoMap['stbId'] = $stbId;
                    MasterManager::setAccountId($epgInfoMap['UserID']);
                    MasterManager::setEPGInfoMap($epgInfoMap);
                    LogUtils::info("_setEPGParams epgInfoMap:".json_encode($epgInfoMap));
                }
                if (substr_compare($accountId, $tail, -strlen($tail)) !== 0) { //判断$UserID 不是以_204结尾的，给他添加结尾
                    $accountId .= $tail;
                    $epgInfoMap['UserID'] = $accountId;
                    MasterManager::setAccountId($accountId);
                }
                break;
        }

        Utils::setAreaCode($accountId);
        MasterManager::setSTBModel($stbModel);
        MasterManager::setSTBMac($stbMac);
        MasterManager::setSTBId($stbId);

        $epgInfoMap['epgDomain'] = $epgDomain;
        MasterManager::setEPGInfoMap($epgInfoMap);
    }

}