<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

class AuthUser520092 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        $result = $this->getCommonAJAXResult();

        if(!MasterManager::getUserIsVip()){
            $this->setDirectPayUrl();
        }

        //C1注入模板解析返回地址
        if(gettype($_POST) == "array" && $_POST['isV3'] == 1){
            $epgInfo = MasterManager::getEPGInfoMap();
            $result['returnUrl'] = $epgInfo['IPTVPortalUrl'];
            if(isset($_POST['boxId']) && !empty($_POST['boxId'])){
                $result['boxId'] = $_POST['boxId'];
             }else{
                $boxId = date('YmdHis').mt_rand(100000, 999999);
                $result['boxId'] = $boxId;
                UserAPI::boxInterDataCollect(1,$boxId,MasterManager::getAccountId(), MasterManager::getUserToken(),$result['isVip'],urlencode($epgInfo['IPTVPortalUrl']),urlencode($epgInfo['askPriceUrl']));
            }
            if(!$result['isVip']){
                $result['payUrl'] = OrderManager::getInstance()->buildZonePayUrl($boxId);
            }
        }

        return $result;
    }

    /**
     * 贵州电信应用业务参数保存
     */
    private function _setEPGParams()
    {
        if(gettype($_POST) == "array" && $_POST['isV3'] == 1){
            $this->setEPGParamsV3();
            return;
        }

        $requestKeys = array(
            "userAccount" => "",
            "UserToken" => "",
            "env" => "",
            "UserGroupNMB" => "",
            "EpgGroupID" => "",
            "STBType" => "",
            "TerminalType" => "",
            "AreaNode" => "",
            "IP" => "",
            "MAC" => "",
            "CountyID" => "",
            "STBID" => "",
        );
        $epgInfoMap = URLUtils::parseURLInfo($requestKeys, URLUtils::POST_REQUEST_TYPE);
        $epgInfo = json_encode($_POST);
        if ($epgInfoMap['userAccount'] == null) {
            throw new \Exception("参数异常！" . $epgInfo);
        }

        LogUtils::info("user INFO====> " . $epgInfo); // 把INFO信息写入文档
        //将存储cookie内容-->存储到sisson中
        MasterManager::setEPGInfo($epgInfo);


        //解析参数
        $epgInfoMap["userId"] = $epgInfoMap['userAccount'];
        MasterManager::setEPGInfoMap($epgInfoMap);

        MasterManager::setAccountId($epgInfoMap['userAccount']);
        MasterManager::setUserToken($epgInfoMap['UserToken']);
        if ($epgInfoMap['env'] == "other" || $epgInfoMap['env'] == "") {
            //设置首页二号位置配置为普通推荐位
            MasterManager::setPositionTwoConfig("1");
        }
        $areaCode = "";
        $accountPrefix = substr($epgInfoMap['userAccount'], 0, 1);
        if ($accountPrefix == "0") {
            $areaCode = substr($epgInfoMap['userAccount'], 0, 4);
            LogUtils::info("=====> get areaCode[ $areaCode ] from account= {$epgInfoMap['userAccount']}");
        }
        MasterManager::setAreaCode($areaCode); //设置区域码
    }

    public function setDirectPayUrl(){
        if(MasterManager::isReportUserInfo() == 1){
            $result = UserManager::queryReportUserInfo(2);
            LogUtils::info("setDirectPayUrl result:" . json_encode($result));
            if (!empty($result) && $result->result == 0) {
                OrderManager::getInstance()->buildDirectPayUrl();
            }
        }
    }

    public function setEPGParamsV3(){
        LogUtils::info("=====> get setEPGParamsV3:".json_encode($_POST));
        $epgInfo = $this->getInfoByXML($_POST['epgInfo']);

        MasterManager::setSTBModel($_POST['stbModel']); // 设备型号
        MasterManager::setSTBMac($_POST['stbMac']);     // 设备地址
        MasterManager::setSTBId($_POST['stbId']);       // 设备序列编号
        MasterManager::setAccountId($_POST['userAccount']);
        MasterManager::setUserToken($_POST['UserToken']);

        $areaCode = "";
        $accountPrefix = substr($_POST['userAccount'], 0, 1);
        if ($accountPrefix == "0") {
            $areaCode = substr($_POST['userAccount'], 0, 4);
            LogUtils::info("=====> get areaCode[ $areaCode ] from account= {$_POST['userAccount']}");
        }
        MasterManager::setAreaCode($areaCode); //设置区域码
        MasterManager::setEPGInfoMap($epgInfo);
    }

    protected function getInfoByXML($xmlObj) {
        $infoValue = str_replace('&', "&amp;", $xmlObj);
        $xmlStr = "<?xml version='1.0'?><document>" . $infoValue . "</document>";
        $xmlJsonObj = simplexml_load_string($xmlStr);
        $xmlJsonStr = json_encode($xmlJsonObj);
        $xmlObj = json_decode($xmlJsonStr);
        LogUtils::info("=====> get setEPGParamsV3 epgInfo:".json_encode($xmlObj));
        //解析参数
        $epgInfo = array();
        $epgInfo["serverIp"] = $xmlObj->server_ip;
        $epgInfo["userToken"] = $xmlObj->userToken;
        $epgInfo["TokenExpiretime"] = $xmlObj->TokenExpiretime;
        $epgInfo["areaCode"] = $xmlObj->areaCode;
        $epgInfo["groupName"] = $xmlObj->group_name;
        $epgInfo["group_path"] = $xmlObj->group_path;
        $epgInfo["stbId"] = !empty($xmlObj->stbId) ? $xmlObj->stbId : "";
        $epgInfo["partner"] = $xmlObj->partner;
        $epgInfo["stbType"] = $xmlObj->stbType;
        $epgInfo["back_epg_url"] = $xmlObj->return_url;
        $epgInfo["IPTVPortalUrl"] = $xmlObj->return_url && is_string($xmlObj->return_url) ? $xmlObj->return_url : $xmlObj->page_url;

        return $epgInfo;
    }

}