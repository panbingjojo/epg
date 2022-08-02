<?php

namespace Home\Model\User;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;
use Home\Model\Stats\StatManager;

class BaseAuthUser
{

    public $orderManager;

    const AUTH_NODE_ACTIVITY = "auth_node";

    public $isSyncVipState = 1; // 是否需要同步鉴权的vip状态，因某些地区的vip状态值需要在我方平台进行，局方不提供鉴权方法

    /** 返回通用的前端请求数据 */
    public function getCommonAJAXResult()
    {
        //定义返回的结果变量
        $this->orderManager = $this->orderManager ? $this->orderManager : OrderManager::getInstance(CARRIER_ID);
        //LogUtils::info(__FUNCTION__ . "," . __LINE__ . "," . "this->orderManager： " );
        if(DEBUG == 0) {
            $vipState = $this->checkVIPState();
        } else {
            $vipState = 0;
        }
        $userAccount = MasterManager::getAccountId();
        // 调用CWS接口校验用户
        $authResultJson = UserAPI::authUser($userAccount, $vipState, $this->isSyncVipState);
        LogUtils::info(__FUNCTION__ . "," . __LINE__ . "," . "authUser Result . " . $authResultJson." vipState:$vipState");
        $authResult = json_decode($authResultJson);
        if ($authResult->result == 0) { // 后台接口调用返回成功
            $userId = $authResult->user_id;
            MasterManager::setIsNewUser($authResult->isNewUser);
            MasterManager::setUserId($authResult->user_id);
            MasterManager::setLoginId($authResult->login_id);
            MasterManager::setCwsSessionId($authResult->session_id);

            // 检测是否上报用户信息
            $isReportUserInfo = $this->isReportUserInfo($userId);
            MasterManager::setIsReportUserInfo($isReportUserInfo);

            $isTestUser = $authResult->isTestUser;
            MasterManager::setIsTestUser($isTestUser);
            // 查询当前产品是否免费使用
            $heartPackage = SystemAPI::sendHeart();
            $isFree = $heartPackage['free_flag'];

            // 校验用户身份 -- 免费体验版本不进行局方鉴权，默认VIP进入；否则局方鉴权
            if ($isFree && $isFree == 1) {
                $vipState = 1;
                MasterManager::setFreeExperience(1);
            } else if ($isTestUser || $this->isSyncVipState == 0) {
                // 测试用户 或者 局方不提供鉴权方法，需要在我方平台进行VIP状态鉴权的地区，同步管理后台VIP状态
                $vipState = $authResult->isVip;
            }
            LogUtils::info(__FUNCTION__ . "," . __LINE__ . "," . "Test --- vipState = $vipState"." authResult->isVip = $authResult->isVip"." heartPackage:".json_encode($heartPackage));


            MasterManager::setUserIsVip($vipState); // 保存VIP状态信息

            if($authResult->isBlackUser){ // 如果用户是黑名单用户，设置禁止订购
                MasterManager::setIsForbiddenOrder(1);
            }

             $authNode = $_REQUEST['authNode'];
            if($authNode == self::AUTH_NODE_ACTIVITY) {
                StatManager::uploadAccessModule($userId, 'activity-proxy');
            }

            $isRouteUpdatePage = defined("SYSTEM_IS_UPDATE") && SYSTEM_IS_UPDATE == 1 && !$isTestUser ? 1 : 0;
            // apk版本合并之后，android端需要请求参数时携带的头部参数
            $result = array(
                'result' => 0,
                'userId' => $userId,
                'sessionId' => $authResult->session_id,
                'loginId' => $authResult->login_id,
                'accountId' => $userAccount,
                'isVip' => $vipState,
                'isRouteUpdatePage' => $isRouteUpdatePage,
                'reportData' => $isReportUserInfo,
                'isNewUser' => $authResult->isNewUser
            );
        } else { // 后台接口调用失败
            $result = array(
                'result' => -1,
                'msg' => 'authUser failed',
            );
        }
        return $result;
    }

    /** 检测当前用户身份状态 */
    public function checkVIPState()
    {
        return $this->orderManager->authentication();
    }

    /** 是否上报用户信息 -- 注：宁夏广电不与要上报当前用户
     * @param $userId String 当前用户身份标识
     * @return int 1 -- 已上报用户信息 0 -- 未上报用户信息
     */
    public function isReportUserInfo($userId)
    {
        $http = new HttpManager("");
        $headerInfo = $http->packageHeader();
        $userInfo = OrderManager::getInstance(CARRIER_ID)->buildUserInfo();

        $info = array(
            'header' => $headerInfo,
            'userInfo' => $userInfo,
            'isUnicomActivity' => 0
        );
        UserManager::uploadUserInfo($userId, $info);

        LogUtils::info("UserAPIController::loadUserInfo" . CARRIER_ID . " ---> queryReportUserInfo() ");
        $result = UserManager::queryReportUserInfo(1);
        return $result && $result->result == 0 ? 1 : 0;
    }

}