<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;

class InitActionAPK implements InitAction{

    private $_isSetUserAccount = false; // 是否已经设置过用户账号

    private $epgInfoMap = array();      // 存储相关的信息集合

    public function getEPGInfoMap()
    {
        // 从链接忠获取相关参数
        // 获取extraData的数据,apk携带额外参数数据
        $extraData = $_GET['extraData'];
        // 获取deviceInfo，设备相关信息
        $deviceInfo = $_GET['deviceInfo'];
        // 获取accountId，用户信息
        $accountId = $_GET['accountId'];
        // 获取LMApkInfo，业务相关参数
        $apkInfo = $_GET['lmApkInfo'];
        // 获取userType，用户状态，会员或非会员
        $userType = $_GET['userType'];

        // 保存参数，并设置相关的默认值
        $EPGInfoMap = array();
        $EPGInfoMap['deviceInfo'] = isset($deviceInfo) ? $deviceInfo : '';
        $EPGInfoMap['extraData'] = isset($extraData) ? $extraData : '';
        $EPGInfoMap['accountId'] = isset($accountId) ? $accountId : '';
        $EPGInfoMap['LMApkInfo'] = isset($apkInfo) ? $apkInfo : '';
        $EPGInfoMap['userType'] = isset($userType) ? $userType : '';

        // 广东移动APK，判断是否是从融合包入口进入，如果是从融合包入口进入则需要使用易视腾鉴权计费接口
        if(CARRIER_ID == CARRIER_ID_GUANGDONGYD){
            $ysten = $_GET['ysten'];
            $EPGInfoMap['ysten'] = isset($ysten) ? $ysten : '';
        }

        return $EPGInfoMap;
    }

    public function handleEPGInfoMap($EPGInfoMap)
    {
        $this->epgInfoMap = $EPGInfoMap;
        $extraData = $EPGInfoMap['extraData'];
        if(!empty($extraData)){ // extraData传入真实的json数据
            $extraDataObj = json_decode($extraData);
            $extraRouteFlag = $extraDataObj->lmuf; // 路由标识
            if (isset($extraRouteFlag)) {
                MasterManager::setUserFromType($extraRouteFlag);
            }
            $extraRouteParam = $extraDataObj->lmsid; // 路由参数
            if (isset($extraRouteParam)) {
                MasterManager::setSubId($extraRouteParam);
            }
            $extraEntryPosition = $extraDataObj->lmp; // 路由跳转标识
            if (isset($extraEntryPosition)) {
                MasterManager::setEnterPosition($extraEntryPosition);
            }
        }

        $deviceInfo = $EPGInfoMap['deviceInfo'];
        if (!empty($deviceInfo)) {
            $deviceInfoObj = json_decode($deviceInfo);
            $area_code = isset($deviceInfoObj->area_code) ? $deviceInfoObj->area_code : '';
            if($area_code != ':') {
                MasterManager::setAreaCode($area_code);
            }
            $client_version = isset($deviceInfoObj->client_version) ? $deviceInfoObj->client_version : '';
            MasterManager::setSTBVersion($client_version);
            $model = isset($deviceInfoObj->model) ? $deviceInfoObj->model : '';
            MasterManager::setSTBModel($model);
        }

        // 解析链接传递的信息，部分地区用于获取用户账号或者计费相关信息
        $this->_parseAPKInfo($EPGInfoMap['LMApkInfo']);

        // 解析链接传递的账号信息，部分地区用于获取用户账号或者计费相关信息
        $this->_parseAccountInfo($EPGInfoMap['accountId']);

        if(!$this->_isSetUserAccount) { // 未设置过用户账号，存取链接中提取的账号值
            MasterManager::setAccountId($EPGInfoMap['accountId']);
        }

        // 是否使用广东移动融合包易视腾鉴权计费接口
        if(CARRIER_ID == CARRIER_ID_GUANGDONGYD){
            $extraEnterFromYsten = $EPGInfoMap['ysten'];
            if (isset($extraEnterFromYsten) && $extraEnterFromYsten == '1') {
                MasterManager::setEnterFromYsten($extraEnterFromYsten);
            }else{
                MasterManager::setEnterFromYsten('0');
            }
        }

        // 当为Demo7时，可以支持从业务帐号里读取areaCode，编码按中国联通的规范来
        if (CARRIER_ID == CARRIER_ID_DEMO7 || CARRIER_ID == CARRIER_ID_CHINAUNICOM_APK) {
            $accountId = $EPGInfoMap['accountId'];
            $idx = strripos($EPGInfoMap['accountId'], '_');
            if ($idx && ($idx > 0)) {  // 判断能读到业务帐号后面的内容
                $areaCode = substr($accountId, $idx + 1, 3);
                LogUtils::info("=====> get areaCode[ $areaCode ] from account= $accountId");
                MasterManager::setAreaCode($areaCode);
            }
        }

        MasterManager::setApkInfo($EPGInfoMap['LMApkInfo']);

        return $this->epgInfoMap;
    }

    /**
     * 对传递的应用相关信息进行解析
     * @param string $apkInfoJson apk信息
     */
    private function _parseAPKInfo($apkInfoJson){
        $apkInfoObj = json_decode($apkInfoJson); // 解析获得JSON对象
        switch (CARRIER_ID) {
            case CARRIER_ID_HAIKAN_APK:     // 山东电信海看APK
            case CARRIER_ID_SHANDONGDX_APK: // 山东电信APK
                $accountId371002 = $apkInfoObj->stbUserId;
                if($accountId371002) {
                    MasterManager::setAccountId($accountId371002);
                    MasterManager::setUserToken($apkInfoObj->stbToken);
                    // 更新areaCode和subAreaCode
                    $stbAreaId = $apkInfoObj->stbAreaId;
                    if (strlen($stbAreaId) == 3) { // 部分用户会使用T开头的账号，这部分用户的areaCode是从盒子端获取的
                        MasterManager::setAreaCode("0" . $stbAreaId);
                    } else {
                        $areaCode = "0" . substr($accountId371002, 0, 3); // 山东地区编码从账号截取，字符串"0" + 账号前三位
                        MasterManager::setAreaCode($areaCode);
                        // 二级地区使用盒子端获取信息
                        MasterManager::setSubAreaCode($stbAreaId);
                    }
                    $this->_isSetUserAccount = true;
                }
                break;
            case CARRIER_ID_JILIN_YD: // 吉林移动
                $accountId220001 = $apkInfoObj->account;
                if($accountId220001) {
                    MasterManager::setAccountId($accountId220001);
                    $this->_isSetUserAccount = true;
                }
                break;
            case CARRIER_ID_GANSUYD: // 甘肃移动，解析用户账号，设备ID，用户token和地区编码
                if(empty($apkInfoObj)){
                    $apkInfoObj = json_decode(urldecode($apkInfoJson));
                }
                $accountId620007 = $apkInfoObj->accountIdentity;
                if(empty($accountId620007)){
                    $accountId620007 = $apkInfoObj->userId;
                }
                $deviceId = $apkInfoObj->deviceId;
                $areaCode = $apkInfoObj->areaCode;
                $userToken = $apkInfoObj->token;
                $cpId = $apkInfoObj->cpid;
                if($cpId == 'BESTVOTT'){
                    MasterManager::setPlatformTypeExt("hd-3");
                    MasterManager::setEnterFromYsten('0');//百事通平台
                }else{
                    MasterManager::setPlatformTypeExt("hd-4");
                    MasterManager::setEnterFromYsten('1');//未来易视腾平台
                }
                if($accountId620007) {
                    MasterManager::setAccountId($accountId620007);
                    $this->epgInfoMap['accountId'] = $accountId620007;
                    MasterManager::setSTBId($deviceId);
                    $this->epgInfoMap['deviceId'] = $deviceId;
                    if($areaCode != ':') {
                        $this->epgInfoMap['areaCode'] = $areaCode;
                    }
                    MasterManager::setUserToken($userToken);
                    $this->epgInfoMap['token'] = $userToken;
                    $this->_isSetUserAccount = true;
                }
                break;
            case CARRIER_ID_NINGXIA_YD: //宁夏移动
                $accountId640001 = $apkInfoObj->account;
                if($accountId640001) {
                    MasterManager::setAccountId($accountId640001);
                    $this->epgInfoMap["userIP"] = get_client_ip(); // 由于客户端没有传ip过来，所以只能读取
                    $this->_isSetUserAccount = true;
                }
                break;
            case CARRIER_ID_QINGHAI_YD: // 青海移动
                $accountId630001 = $apkInfoObj->loginAccount;
                if($accountId630001) {
                    MasterManager::setAccountId($accountId630001);
                    MasterManager::setSTBId($apkInfoObj->snNum);
                    $this->_isSetUserAccount = true;
                    MasterManager::setUserToken($apkInfoObj->epgToken);
                }
                break;
            case CARRIER_ID_XIZANG_YD: // 西藏移动
                $accountId540001 = $apkInfoObj->loginAccount;
                if($accountId540001) {
                    MasterManager::setAccountId($accountId540001);
                    $this->_isSetUserAccount = true;
                }
                break;
            case CARRIER_ID_HUNANYX: // 湖南有线
                $accountId430012 = $apkInfoObj->cardId;
                if($accountId430012) {
                    MasterManager::setAccountId($accountId430012);
                    $this->_isSetUserAccount = true;
                }
                break;
        }
    }


    /**
     * 针对账号信息进行解析
     * @param string $accountInfoJson 用户信息的json字符串
     */
    private function _parseAccountInfo($accountInfoJson){
        $accountInfoObj = json_decode($accountInfoJson);
        switch (CARRIER_ID) {
            case CARRIER_ID_GUANGXIGD_APK: // 广西广电apk
                $accountId450004 = $accountInfoObj->userId;
                $areaCode450004 = $accountInfoObj->domain;
                $deviceId = $accountInfoObj->sn;
                // 保存参数
                MasterManager::setAccountId($accountId450004);
                MasterManager::setAreaCode($areaCode450004);
                if($deviceId) {
                    MasterManager::setSTBId($deviceId);
                }
                $this->epgInfoMap['accountId'] = $accountId450004;
                $this->epgInfoMap['areaCode'] = $areaCode450004;
                $this->epgInfoMap['deviceId'] = $deviceId;
                $this->epgInfoMap['stbId'] = $deviceId;
                $this->_isSetUserAccount = true;
                break;
            case CARRIER_ID_YB_HEALTH_UNIFIED:     // 未来电视怡伴健康统一接口
            case CARRIER_ID_GUANGXI_YD_YIBAN: // 广西移动apk -- 怡伴
                $accountIdPrefix = substr($accountInfoJson,0,4);
                if(isset($accountIdPrefix) && 'new-' === $accountIdPrefix){
                    $accountId09450001 = substr($accountInfoJson,4,strlen($accountInfoJson));
                    MasterManager::setAuthType(1);
                    MasterManager::setAccountId($accountId09450001);
                    $this->_isSetUserAccount = true;
                }else{
                    MasterManager::setAuthType(0);
                }
                break;
        }
    }
}