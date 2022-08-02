<?php

namespace Home\Model\User;

use Api\APIController\SystemAPIController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

class AuthUser440094 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        if(CARRIER_ID == CARRIER_ID_GUANGDONGGD){
            $this->_setEPGParams440094();
            // 上报用户数据
            $this->_uploadUserInfo();
        }

        if(CARRIER_ID == CARRIER_ID_GUANGDONGGD_NEW){
            $this->_setEPGParams440004();
        }

        // 返回数据到前端
        return $this->getCommonAJAXResult();
    }

    /** 广东广电APK转EPG保存参数 */
    private function _setEPGParams440004()
    {
        $requestKeys = array(
            'account' => '',
            'deviceId' => '',
            'client' => '',
            'caRegionCode' => '',
            'userType' => '',
            'customerGroup' => '',
            'areaCode' => '',
            'portalAddress' => '',
            'networkId' => '',
            'IPAddress' => '',
            'serviceType' => '',
            'devNo' => '',
            'serviceTypeFlag' => '',
            'isIPTransplantation' => false,
        );
        LogUtils::info("user INFO====> " . json_encode($_POST)); // 打印日志
        $EPGInfoMap = URLUtils::parseURLInfo($requestKeys, URLUtils::POST_REQUEST_TYPE);
        $areaCode = $this->_getAreaCode($EPGInfoMap['client'], $EPGInfoMap['caRegionCode'], $EPGInfoMap['deviceId']);
        LogUtils::info("_setEPGParams areaCode ====> " . $areaCode);

        MasterManager::setAccountId($EPGInfoMap['account']);
        MasterManager::setSTBId($EPGInfoMap['deviceId']);
        MasterManager::setAreaCode($areaCode);
        MasterManager::setEPGInfoMap($EPGInfoMap);
    }

    /** 广东广电EPG保存参数 */
    private function _setEPGParams440094(){
        LogUtils::info("user INFO====> " . json_encode($_POST)); // 把INFO信息写入文档
        LogUtils::info("====> client _SERVER INFO: " . json_encode($_SERVER));

        //将存储cookie内容-->存储到sisson中
        MasterManager::setEPGInfo(json_encode($_POST));

        $initParams = array(
            "userAccount" => "",
            "userToken" => "",
            "version" => "",
            "areaCode" => "",
            "stbModel" => "",
            "stbId" => "",
            "cardId" => "",
            "portalAddress" => "",
            "portalPort" => "",
        );
        $EPGInfoMap = URLUtils::parseURLInfo($initParams, URLUtils::POST_REQUEST_TYPE);
        $EPGInfoMap['userId'] = $EPGInfoMap['userAccount'];
        $EPGInfoMap['stbVersion'] = $EPGInfoMap['version'];
        $EPGInfoMap['portalURL'] = $EPGInfoMap['portalAddress'] . ":" . $_POST['portalPort'];

        $areaCode = $this->_getAreaCode($EPGInfoMap['cardId'], $EPGInfoMap['areaCode'], $EPGInfoMap['stbId']);
        LogUtils::info("user areaCode ====> ". $areaCode);
        MasterManager::setAreaCode($areaCode);
        //设备号作为业务账号
        MasterManager::setAccountId($EPGInfoMap['userAccount']);
        // 保存设备型号
        MasterManager::setSTBModel($EPGInfoMap['stbModel']);
        MasterManager::setSTBVersion($EPGInfoMap['stbVersion']);
        MasterManager::setSTBId($EPGInfoMap['stbId']);
        //保存EPG首页（局方）
        if (CARRIER_ID_GUANGDONGGD_NEW) { // 广东广电（网关版本440004）如果从局方大厅跳转功能模块传入返回大厅地址
            $backUrl = MasterManager::getIPTVPortalUrl();
            if (empty($backUrl)) {
                MasterManager::setIPTVPortalUrl(IPTV_PORTAL_URL);
            }
        } else {
            MasterManager::setIPTVPortalUrl(IPTV_PORTAL_URL);
        }

        // 把INFO信息写入缓存
        MasterManager::setEPGInfoMap($EPGInfoMap);
    }

    /**
     * 查询用户信息
     * @param string $deviceCode 智能卡号
     * @param string $regionCode 区域码
     * @param string $stbInfo 盒子信息
     * @return mixed
     * 查询用户信息接口返回示例：
     * {"result":0,"message":"success","data":{"id":1932779,"deviceCode":"8769002382683035","userNotes":0,
     * "userType":0,"voucher":0,"balance":0,"integral":0,"platformId":101,"bossId":100,"trackId":100,"curTrackId":100,
     * "status":0,"stbId":"0x160562EA","regionCode":"4409","remark":"","password":"","ipAddr":"203.132.32.92",
     * "addTime":1595652275000,"modifyTime":1601441582226,"custid":"1209059","servid":"1233895","servstatus":"2",
     * "stoplock":"","userName":"陈见全","catvid":"","areaid":"202","branchno":"DG","custtype":"0","isinarr":"",
     * "supModifyTime":1601441582226}}
     */
    private function _getAreaCode($deviceCode, $regionCode, $stbInfo)
    {
        // 1、查询用户信息接口
        $postData = array(
            "deviceCode" => $deviceCode,
            "regionCode" => $regionCode,
            "stbInfo" => $stbInfo,
            "platformId" => 101,
            "bossId" => 100,
            "trackId" => 100
        );
        $header = array(
            'Content-type: application/json',
        );
        $postData = json_encode($postData);
        LogUtils::info("_getAreaCode ---> request url: " . QUERY_USER_INFO_URL .
            " ---> postData: " . $postData);
        /**
         * curl http://172.31.135.88:8081/PlatformService/iptv/queryUserInfo -X POST -d '{"deviceCode":"8769002447913104","regionCode":"4443","stbInfo":"8769002447913104","platformId":101,"bossId":100,"trackId":100}' --header "Content-Type: application/json"
         */
        if(DEBUG==0)
            $result = HttpManager::httpRequestByHeader("post", QUERY_USER_INFO_URL, $header, $postData);
        else
            $result = '{}';
        LogUtils::info("_getAreaCode ---> result: " . $result);

        // 2、根据查询得到的地区名称进行编码
        $areaCode = "";
        if (defined("GUANGDONGGD_AREACODE_MAP")) {
            $array = eval(GUANGDONGGD_AREACODE_MAP);
            $result = json_decode($result);
            $provinceName = $result->data->branchno;
            $areaCode = $array[$provinceName];
            LogUtils::debug("getUserProvince: areaCode[$areaCode] ---> provinceId[$provinceName]");
        } else {
            LogUtils::debug("GUANGDONGGD_AREACODE_MAP  undefined");
        }

        return $areaCode;
    }

    /** 查询用户的身份状态 */
    public function checkVIPState()
    {
        $EPGInfoMap = MasterManager::getEPGInfoMap();

        $payInfo = new \stdClass();
        $payInfo->authUrl = USER_ORDER_URL . QUERY_ORDER_FUNC;//鉴权地址
        $payInfo->providerId = providerId;
        if(CARRIER_ID == CARRIER_ID_GUANGDONGGD_NEW){
            $payInfo->devNo = $EPGInfoMap["client"];
        }else{
            $payInfo->devNo = $EPGInfoMap["cardId"];
        }
        $payInfo->productId = productId_month;
        $payInfo->timeStamp = date("YmdHis");
        $payInfo->key = key;
        $text = "devNo=" . $payInfo->devNo . "&providerId=" . $payInfo->providerId . "&productId=" . $payInfo->productId . "&timeStamp=" . $payInfo->timeStamp . "&key=" . $payInfo->key;
        LogUtils::info("_buildPayUrl ---> sign text : " . $text);
        $payInfo->sign = strtoupper(md5($text));

        return $this->orderManager->authentication($payInfo);
    }

    /** 广东广电上报用户数据到弘智增值平台 */
    private function _uploadUserInfo(){
        $serverUrl = "http://172.16.147.186:8081/PlatformService/iptv/androidLogin?";
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $param = array("deviceCode" => $epgInfoMap["client"],
            "appId" => "1201080002",//appId,
            "platformId" => 100,
            "bossId" => 100,
            "trackId" => 100,
            "stbInfo" => "",
            "regionCode" => $epgInfoMap["caRegionCode"],
        );

        $url = $serverUrl . http_build_query($param);
        LogUtils::info("_uploadUserInfo ---> url: " . $url);
        $result = HttpManager::httpRequest("GET", $url, null);
        LogUtils::info("_uploadUserInfo ---> result: " . json_encode($result));
        if($result->result == 0){
            LogUtils::info("_uploadUserInfo ---> 上报盒子账号成功: " . json_encode($result));
        }
    }
}