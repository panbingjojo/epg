<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/7
 * Time: 18:56
 */

namespace Home\Model\Entry;

use Home\Model\Common\CookieManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Think\Exception;

class MasterManager {
    /**
     * 初始化缓存数据
     */
    public static function init() {}

    // -------Session相关-------

    /**
     * 获取用户是否上传过用户操作轨迹（中国联通食乐汇、健康魔方等业务需要上报局方数据，为避免漏报数据，添加session记录已操作）
     * @return mixed|null 用户是否上传过用户操作轨迹
     */
    public static function isReportOperateTrace(){
        return SessionManager::getUserSession(SessionManager::$S_IS_REPORT_OPERATE_TRACE);
    }

    /**
     * 保存用户是否上传过用户操作轨迹（中国联通食乐汇、健康魔方等业务需要上报局方数据，为避免漏报数据，添加session记录已操作）
     * @param $isReport int|null 0 - 未上报；1 - 已上报
     * @throws Exception 存储过程中的异常
     */
    public static function setReportOperateTrace($isReport){
        SessionManager::setUserSession(SessionManager::$S_IS_REPORT_OPERATE_TRACE, $isReport);
    }

    /**
     * 设置鉴权方式,广西移动新版鉴权兼容老版鉴权
     * @param $authType
     */
    public static function setAuthType($authType)
    {
        try {
            SessionManager::setUserSession(SessionManager::$S_AUTH_TYPE, $authType);
        } catch (Exception $e) {
        }
    }

    public static function getAuthType()
    {
        return SessionManager::getUserSession(SessionManager::$S_AUTH_TYPE);
    }

    public static function getLoopPayResult()
    {
        $isLoopPayResult = SessionManager::getUserSession(SessionManager::$S_LOOP_PAY_RESULT);
        return empty($isLoopPayResult) ? 0 : $isLoopPayResult;
    }

    // @Brief:此函数用于设置用户的userToken
    public static function setLoopPayResult($isLoopPayResult)
    {
        SessionManager::setUserSession(SessionManager::$S_LOOP_PAY_RESULT, $isLoopPayResult);
    }

    public static function getQueryInfo()
    {
        $queryInfo = SessionManager::getUserSession(SessionManager::$S_QUERY_INFO);
        return $queryInfo;
    }

    // @Brief:此函数用于设置用户的userToken
    public static function setQueryInfo($queryInfo)
    {
        SessionManager::setUserSession(SessionManager::$S_QUERY_INFO, $queryInfo);
    }

    public static function getOrderItem()
    {
        $orderItem = SessionManager::getUserSession(SessionManager::$S_ORDER_ITEM);
        return $orderItem;
    }

    // @Brief:此函数用于设置用户的userToken
    public static function setOrderItem($orderItem)
    {
        SessionManager::setUserSession(SessionManager::$S_ORDER_ITEM, $orderItem);
    }

    public static function getProductInfo()
    {
        $productInfo = SessionManager::getUserSession(SessionManager::$S_PRODUCT_INFO);
        return $productInfo;
    }

    // @Brief:此函数用于设置用户的userToken
    public static function setProductInfo($productInfo)
    {
        SessionManager::setUserSession(SessionManager::$S_PRODUCT_INFO, $productInfo);
    }

    public static function getPayParamInfo()
    {
        $payParamInfo = SessionManager::getUserSession(SessionManager::$S_PAY_PARAM_INFO);
        return $payParamInfo;
    }

    public static function setUserOrderId($orderId)
    {
        SessionManager::setUserSession(SessionManager::$S_USER_ORDER_ID, $orderId);
    }

    public static function getUserOrderId()
    {
        return SessionManager::getUserSession(SessionManager::$S_USER_ORDER_ID);
    }

    // @Brief:此函数用于设置用户的userToken
    public static function setPayParamInfo($payParamInfo)
    {
        SessionManager::setUserSession(SessionManager::$S_PAY_PARAM_INFO, $payParamInfo);
    }

    public static function getPayType()
    {
        $payType = SessionManager::getUserSession(SessionManager::$S_PAY_TYPE);
        return $payType;
    }

    // @Brief:此函数用于设置用户的userToken
    public static function setPayType($payType)
    {
        SessionManager::setUserSession(SessionManager::$S_PAY_TYPE, $payType);
    }


    /**
     * 缓存 - 设置安徽移动怡伴鉴权回调参数
     * @param $authCallbackParam //回调参数
     */
    public static function setAnhuiAuthCallbackParam($authCallbackParam)
    {
        SessionManager::setUserSession(SessionManager::$S_ANHUI_AUTH_CALLBACK_PARAM, $authCallbackParam);
    }

    /**
     * 获取安徽移动怡伴鉴权回调参数。
     */
    public static function getAnhuiAuthCallbackParam()
    {
        return SessionManager::getUserSession(SessionManager::$S_ANHUI_AUTH_CALLBACK_PARAM);
    }

    /**
     * 获取 - 用户功能限制配置
     * @return mixed|\stdClass 非空对象返回！
     */
    public static function getUserFuncLimit()
    {
        $limit = SessionManager::getUserSession(SessionManager::$S_USER_FUNC_LIMIT);
        if (null == $limit || !is_object($limit)) {
            $limit = new \stdClass();
            $limit->isVip = MasterManager::isVIPUser();
            $limit->desc = "当前用户，无功能限制";
            $limit->limits = [];//默认空未限制，享有全部功能
        }
        CookieManager::setCookie(CookieManager::$C_USER_FUNC_LIMIT, json_encode($limit)); //缓存，前端统一获取使用得了
        return $limit;
    }

    /**
     * 缓存 - 用户功能限制配置
     * @param $userLimitInfoObj //用户功能限制对象
     */
    public static function setUserFuncLimit($userLimitInfoObj)
    {
        SessionManager::setUserSession(SessionManager::$S_USER_FUNC_LIMIT, $userLimitInfoObj);
        CookieManager::setCookie(CookieManager::$C_USER_FUNC_LIMIT, is_object($userLimitInfoObj) ? json_encode($userLimitInfoObj) : ""); //缓存，前端统一获取使用（前端必须decodeURIComponent!）
    }

    // 宁夏移动，是否已经鉴权
    public static function getUserTypeAuth()
    {
        return SessionManager::getUserSession(SessionManager::$S_USER_TYPE_AUTH);
    }

    // 宁夏移动，保存鉴权结果
    public static function setUserTypeAuth($userTypeAuth)
    {
        SessionManager::setUserSession(SessionManager::$S_USER_TYPE_AUTH, $userTypeAuth);
    }

    // 山东电信 -- 设置订购的套餐类型，详情查看Application/Config/Order/Conf370092中CONTENT_ID_CONFIG常量定义
    public static function setOrderPacketType($packetType) {
        SessionManager::setUserSession(SessionManager::$S_ORDER_PACKET_TYPE, $packetType);
    }

    // 山东电信 -- 获取订购的套餐类型
    public static function getOrderPacketType() {
        $defaultPacketTypeArray = "[]"; // 默认类型，未订购
        $packetType = SessionManager::getUserSession(SessionManager::$S_ORDER_PACKET_TYPE);
        $packetType = $packetType != null && !empty($packetType) ? $packetType : $defaultPacketTypeArray;
        return $packetType;
    }

    // 清空当前已订购的小包类型
    public static function clearOrderPacketType() {
        $defaultPacketTypeArray = "[]"; // 默认类型，未订购
        SessionManager::setUserSession(SessionManager::$S_ORDER_PACKET_TYPE, $defaultPacketTypeArray);
    }

    // 获取跑马灯信息
    public static function setMarqueeInfo($marqueeInfo) {
        SessionManager::setUserSession(SessionManager::$S_MARQUEE_INFO, $marqueeInfo);
    }

    public static function setApkInfo($apkInfo) {
        SessionManager::setUserSession(SessionManager::$S_APK_INFO, $apkInfo);
    }

    public static function getApkInfo() {
        $apkInfo = SessionManager::getUserSession(SessionManager::$S_APK_INFO);
        return $apkInfo;
    }

    // 获取区域ID
    public static function getCarrierId() {
        $carrierId = SessionManager::getUserSession(SessionManager::$S_CARRIER_ID);
        $carrierId = $carrierId != null && !empty($carrierId) ? $carrierId : CARRIER_ID;
        return $carrierId;
    }

    // 设置区域ID
    public static function setCarrierId($carrierId) {
        SessionManager::setUserSession(SessionManager::$S_CARRIER_ID, $carrierId);
        CookieManager::setCookie(CookieManager::$C_CARRIER_ID, $carrierId); //必须！前端播放器场景用到！！！
    }

    // 获取区域码（区域码的意思：如中国联通epg，会上到其他省份地区，区域码是针对局方而言）
    public static function getAreaCode() {
        return SessionManager::getUserSession(SessionManager::$S_AREA_CODE);
    }

    // 设置区域码
    public static function setAreaCode($areaCode) {
        SessionManager::setUserSession(SessionManager::$S_AREA_CODE, $areaCode);
        CookieManager::setCookie(CookieManager::$C_AREA_CODE, $areaCode); //必须！前端播放器场景用到！！！
    }


    /**
     * 判断是否是测试账号
     * @return mixed
     */
    public static function isTestAccount() {
        return SessionManager::getUserSession(SessionManager::$S_IS_TEST_USER);
    }

    // 缓存是否是测试账号
    public static function setTestAccount($isTest) {
        SessionManager::setUserSession(SessionManager::$S_IS_TEST_USER, $isTest);
    }

    /**
     * 判断当前用户是否为VIP用户
     * @return mixed 1-VIP用户 0-非VIP用户
     */
    public static function isVIPUser() {
        $isVIP = SessionManager::getUserSession(SessionManager::$S_IS_VIP_USER);
        $isVIP = empty($isVIP) ? 0 : $isVIP;
        return $isVIP;
    }

    // 判断当前用户是否为VIP用户
    public static function setVIPUser($isVIP) {
        SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, $isVIP);
    }

    // 获取用户的业务账号
    public static function getAccountId() {
        return SessionManager::getUserSession(SessionManager::$S_ACCOUNT_ID);
    }

    // 设置用户的业务账号
    public static function setAccountId($accountId) {
        SessionManager::setUserSession(SessionManager::$S_ACCOUNT_ID, $accountId);
        CookieManager::setCookie(CookieManager::$C_ACCOUNT_ID, $accountId);
    }

    // 获取用户登录平台
    public static function getPlatformType() {
        return SessionManager::getUserSession(SessionManager::$S_PLATFORM_TYPE);
    }

    // 设置用户登录平台
    public static function setPlatformType($platformType) {
        LogUtils::info("setPlatformType :" . $platformType);
        CookieManager::setCookie(CookieManager::$C_PLATFORM_TYPE, $platformType); //必须！前端播放器场景用到！！！
        SessionManager::setUserSession(SessionManager::$S_PLATFORM_TYPE, $platformType);
    }

    // 获取用户登录平台扩展
    public static function getPlatformTypeExt() {
        return SessionManager::getUserSession(SessionManager::$S_PLATFORM_TYPE_EXT);
    }

    // 设置用户登录平台扩展
    public static function setPlatformTypeExt($platformTypeExt) {
        SessionManager::setUserSession(SessionManager::$S_PLATFORM_TYPE_EXT, $platformTypeExt);
    }

    // 得到用户来源
    public static function getUserFromType() {
        return SessionManager::getUserSession(SessionManager::$S_USERFROM_TYPE);
    }

    // 设置用户来源
    public static function setUserFromType($userfromType) {
        SessionManager::setUserSession(SessionManager::$S_USERFROM_TYPE, $userfromType);
    }

    // 得到进入子类型Id
    public static function getSubId() {
        return SessionManager::getUserSession(SessionManager::$S_SUB_ID);
    }

    // 设置进入子类型Id
    public static function setSubId($subId) {
        SessionManager::setUserSession(SessionManager::$S_SUB_ID, $subId);
    }


    // 获取设备ID
    public static function getSTBId($userId = 0) {
        return SessionManager::getUserSession(SessionManager::$S_STB_ID);
    }

    // 设置设备ID
    public static function setSTBId($stbId) {
        return SessionManager::setUserSession(SessionManager::$S_STB_ID, $stbId);
    }

    // 获取设备EPG Domain
    public static function getEpgDomain() {
        return SessionManager::getUserSession(SessionManager::$S_EPG_DOMAIN);
    }

    // 设置设备EPG Domain
    public static function setEpgDomain($epgDomain) {
        SessionManager::setUserSession(SessionManager::$S_EPG_DOMAIN, $epgDomain);
    }

    // 获取设备MAC
    public static function getSTBMac() {
        return SessionManager::getUserSession(SessionManager::$S_STB_MAC);
    }

    // 设置设备mac
    public static function setSTBMac($stbMac) {
        return SessionManager::setUserSession(SessionManager::$S_STB_MAC, $stbMac);
    }

    // 获取设备版本号
    public static function getSTBVersion() {
        return SessionManager::getUserSession(SessionManager::$S_STB_VERSION);
    }

    // 设置设备型号
    public static function setSTBVersion($stbVersion) {
        return SessionManager::setUserSession(SessionManager::$S_STB_VERSION, $stbVersion);
    }

    /**
     * 获取设备型号
     * @return mixed
     */
    public static function getSTBModel() {
        return SessionManager::getUserSession(SessionManager::$S_STB_MODEL);

    }

    // 设置设备型号
    public static function setSTBModel($stbModel) {
        return SessionManager::setUserSession(SessionManager::$S_STB_MODEL, $stbModel);
    }

    // 获取IPTV的门户地址（返回EPG的地址）
    public static function getIPTVPortalUrl() {
        return SessionManager::getUserSession(SessionManager::$S_IPTV_PORTAL_URL);
    }

    // 设置IPTV的门户地址（返回EPG的地址）
    public static function setIPTVPortalUrl($backUrl) {
        return SessionManager::setUserSession(SessionManager::$S_IPTV_PORTAL_URL, $backUrl);
    }

    // 得到登录ID
    public static function getLoginId() {
        return SessionManager::getUserSession(SessionManager::$S_LOGIN_ID);
    }

    // 设置登录ID
    public static function setLoginId($loginId) {
        return SessionManager::setUserSession(SessionManager::$S_LOGIN_ID, $loginId);
    }

    // 得到sessionId
    public static function getCwsSessionId() {
        return SessionManager::getUserSession(SessionManager::$S_CWS_SESSION_ID);
    }

    // 设置sessionId
    public static function setCwsSessionId($sessionId) {
        return SessionManager::setUserSession(SessionManager::$S_CWS_SESSION_ID, $sessionId);
    }

    // 获取用户ID
    public static function getUserId() {
        $userId = SessionManager::getUserSession(SessionManager::$S_USER_ID) ? SessionManager::getUserSession(SessionManager::$S_USER_ID) : 0;
        return $userId;
    }

    // 設置用戶ID
    public static function setUserId($userId) {
        SessionManager::setUserSession(SessionManager::$S_USER_ID, $userId);
    }

    // 获取上报等待时长
    public static function getWaitTime() {
        $userId = SessionManager::getUserSession(SessionManager::$S_WAIT_TIME) ? SessionManager::getUserSession(SessionManager::$S_WAIT_TIME) : 0;
        return $userId;
    }

    // 設置上报等待时长
    public static function setWaitTime($duration) {
        SessionManager::setUserSession(SessionManager::$S_WAIT_TIME, $duration);
    }

    // 获取用户ID
    public static function getAccessModule() {
        return SessionManager::getUserSession(SessionManager::$S_ACCESS_MODULE);
    }

    // 设置访问模块
    public static function setAccessModule($accessModule) {
        SessionManager::setUserSession(SessionManager::$S_ACCESS_MODULE, $accessModule);
    }

    // 获取播放器播放参数
    public static function getPlayParams() {
        return SessionManager::getUserSession(SessionManager::$S_PLAY_PARAM);
    }

    // 設置播放器播放参数
    public static function setPlayParams($playParams) {
        SessionManager::setUserSession(SessionManager::$S_PLAY_PARAM, $playParams);
    }

    // 获取支付订购选项
    public static function getOrderItems() {
        return SessionManager::getUserSession(SessionManager::$S_ORDER_ITEM);
    }

    // 設置支付订购选项
    public static function setOrderItems($orderItems) {
        SessionManager::setUserSession(SessionManager::$S_ORDER_ITEM, $orderItems);
    }

    // 获取应用入口位置
    public static function getEnterPosition() {
        return SessionManager::getUserSession(SessionManager::$S_ENTER_POSITION);
    }

    // 設置应用入口位置
    public static function setEnterPosition($enterPosition) {
        SessionManager::setUserSession(SessionManager::$S_ENTER_POSITION, $enterPosition);
    }

    //获取应用是否从使用易视腾鉴权计费接口的入口进入
    public static function getEnterFromYsten() {
        return SessionManager::getUserSession(SessionManager::$S_ENTER_FROM_YSTEN);
    }

    //设置应用是否从使用易视腾鉴权计费接口的入口进入
    public static function setEnterFromYsten($extraEntryFromYsten) {
        SessionManager::setUserSession(SessionManager::$S_ENTER_FROM_YSTEN, $extraEntryFromYsten);
    }

    // 获取答题题目信息
    public static function getAnswerInfo() {
        return SessionManager::getUserSession(SessionManager::$S_ANSWER_INFO);
    }

    // 設置答题题目信息
    public static function setAnswerInfo($answerInfo) {
        SessionManager::setUserSession(SessionManager::$S_ANSWER_INFO, $answerInfo);
    }

    // 获取免费体检信息
    public static function getFreeExperience() {
        return SessionManager::getUserSession(SessionManager::$S_FREE_EXPERIENCE);
    }

    // 設置免费体检信息
    public static function setFreeExperience($freeExperience) {
        SessionManager::setUserSession(SessionManager::$S_FREE_EXPERIENCE, $freeExperience);
    }

    // 設置客户端版本号
    public static function setClientVersion($clientVersion) {
        SessionManager::setUserSession(SessionManager::$S_CLIENT_VERSION, $clientVersion);
    }

    // 获取是否显示童锁
    public static function isShowPayLock() {
        return SessionManager::getUserSession(SessionManager::$S_SHOW_PAY_LOCK);
    }

    // 設置是否显示童锁
    public static function setShowPayLock($showPayLock) {
        SessionManager::setUserSession(SessionManager::$S_SHOW_PAY_LOCK, $showPayLock);
    }

    // 获取是否统一认证
    public static function isPayUnifyAuth() {
        return SessionManager::getUserSession(SessionManager::$S_IS_PAY_UNIFY_AUTH);
    }

    // 設置是否统一认证
    public static function setPayUnifyAuth($payUnifyAuth) {
        SessionManager::setUserSession(SessionManager::$S_IS_PAY_UNIFY_AUTH, $payUnifyAuth);
    }

    // 获取计费页规则
    public static function getPayPageRule() {
        return SessionManager::getUserSession(SessionManager::$S_SHOW_PAY_PAGE_RULE);
    }

    // 設置计费页规则
    public static function setPayPageRule($payPageRule) {
        SessionManager::setUserSession(SessionManager::$S_SHOW_PAY_PAGE_RULE, $payPageRule);
    }

    // 获取活动标识ID
    public static function getActivityId() {
        return SessionManager::getUserSession(SessionManager::$S_ACTIVITY_ID);
    }

    // 設置活动标识ID
    public static function setActivityId($activityId) {
        SessionManager::setUserSession(SessionManager::$S_ACTIVITY_ID, $activityId);
    }

    // 获取活动名称
    public static function getActivityName() {
        return SessionManager::getUserSession(SessionManager::$S_ACTIVITY_NAME);
    }

    // 設置活动名称
    public static function setActivityName($activityName) {
        SessionManager::setUserSession(SessionManager::$S_ACTIVITY_NAME, $activityName);
    }

    // 联合活动，已经订购vip的sp厂商
    public static function getActivityOrderSPMap() {
        return SessionManager::getUserSession(SessionManager::$S_ACTIVITY_ORDER_SP_MAP);
    }

    // 联合活动，已经订购vip的sp厂商
    public static function setActivityOrderSPMap($activityOrderSPMap) {
        SessionManager::setUserSession(SessionManager::$S_ACTIVITY_ORDER_SP_MAP, $activityOrderSPMap);
    }

    // 获取订购回调参数
    public static function getPayCallbackParams() {
        return SessionManager::getUserSession(SessionManager::$S_PAY_CALLBACK_PARAM);
    }

    // 设置订购回调参数
    public static function setPayCallbackParams($payCallbackParams) {
        SessionManager::setUserSession(SessionManager::$S_PAY_CALLBACK_PARAM, $payCallbackParams);
    }

    // 获取应用入口链接
    public static function getIndexURL() {
        return SessionManager::getUserSession(SessionManager::$S_INDEX_URL);
    }

    // 设置应用入口链接
    public static function setIndexURL($indexURL) {
        SessionManager::setUserSession(SessionManager::$S_INDEX_URL, $indexURL);
    }

    // 获取EPG信息
    public static function getEPGInfo() {
        return SessionManager::getUserSession(SessionManager::$S_EPG_INFO);
    }

    // 设置EPG信息
    public static function setEPGInfo($EPGInfo) {
        SessionManager::setUserSession(SessionManager::$S_EPG_INFO, $EPGInfo);
    }

    // 设置EPG来源信息
    public static function setFromPage($fromPage) {
        SessionManager::setUserSession(SessionManager::$FROM_PAGE, $fromPage);
    }

    // 获取EPG来源信息
    public static function getFromPage() {
        return SessionManager::getUserSession(SessionManager::$FROM_PAGE);
    }

    // 保存是否使用本地医疗平台
    public static function setLocalInquiry($localInquiry) {
        SessionManager::setUserSession(SessionManager::$S_EPG_LOCAL_INQUIRY, $localInquiry);
    }

    // 获取存是否使用本地医疗平台
    public static function getLocalInquiry() {
        return SessionManager::getUserSession(SessionManager::$S_EPG_LOCAL_INQUIRY);
    }

    // 获取EPG容器信息
    public static function getEPGInfoMap() {
        return SessionManager::getUserSession(SessionManager::$S_EPG_INFO_MAP);
    }

    // 设置EPG容器信息
    public static function setEPGInfoMap($EPGInfoMap) {
        SessionManager::setUserSession(SessionManager::$S_EPG_INFO_MAP, $EPGInfoMap);
    }

    // 获取路由堆栈信息
    public static function getRouterStack() {
        return SessionManager::getUserSession(SessionManager::$S_ROUTER_STACK);
    }


    // 设置路由堆栈信息
    public static function setRouterStack($routerStack) {
        SessionManager::setUserSession(SessionManager::$S_ROUTER_STACK, $routerStack);
    }

    // 获取当前页面信息
    public static function getCurrentPage() {
        return SessionManager::getUserSession(SessionManager::$S_CURRENT_PAGE);
    }

    // 设置当前页面信息
    public static function setCurrentPage($currentPage) {
        SessionManager::setUserSession(SessionManager::$S_CURRENT_PAGE, $currentPage);
    }

    // 获取计费页配置信息
    public static function getPayPageConfig() {
        return SessionManager::getUserSession(SessionManager::$S_PAY_PAGE_CONFIG);
    }

    // 设置计费页配置信息
    public static function setPayPageConfig($payPageConfig) {
        SessionManager::setUserSession(SessionManager::$S_PAY_PAGE_CONFIG, $payPageConfig);
    }

    // 获取拉雅设备ID
    public static function getLYDeviceId() {
        return SessionManager::getUserSession(SessionManager::$S_LAYA_DEVICE_ID);
    }

    // 设置拉雅设备ID
    public static function setLYDeviceId($LYDeviceId) {
        SessionManager::setUserSession(SessionManager::$S_LAYA_DEVICE_ID, $LYDeviceId);
    }

    // 获取视频问诊电话号码
    public static function getP2PPhone() {
        return SessionManager::getUserSession(SessionManager::$S_P2P_PHONE);
    }

    // 设置视频问诊电话号码
    public static function setP2PPhone($P2PPhone) {
        SessionManager::setUserSession(SessionManager::$S_P2P_PHONE, $P2PPhone);
    }

    // 获取是否上报用户信息
    public static function isReportUserInfo() {
        return SessionManager::getUserSession(SessionManager::$S_IS_REPORT_USER_INFO);
    }

    // 设置是否上报用户信息
    public static function setIsReportUserInfo($isReportUserInfo) {
        SessionManager::setUserSession(SessionManager::$S_IS_REPORT_USER_INFO, $isReportUserInfo);
    }

    // 设置播放器播放平台类型
    public static function setPlayerPlatform($playerPlatform) {
        SessionManager::setUserSession(SessionManager::$S_PLAYER_PLATFORM, $playerPlatform);
    }

    // 获取播放器播放平台类型
    public static function getPlayerPlatform() {
        return SessionManager::getUserSession(SessionManager::$S_PLAYER_PLATFORM);
    }

    // 获取用户皮肤信息
    public static function getUserSkinInfo() {
        return SessionManager::getUserSession(SessionManager::$S_EPG_USER_SKIN_INFO);
    }

    // 设置用户皮肤信息
    public static function setUserSkinInfo($userSkinInfo) {
        SessionManager::setUserSession(SessionManager::$S_EPG_USER_SKIN_INFO, $userSkinInfo);
    }

    // 设置EPG主题信息
    public static function setEpgThemeInfo($epgThemeInfo) {
        SessionManager::setUserSession(SessionManager::$S_EPG_THEME_INFO, $epgThemeInfo);
    }

    public static function getEpgThemeInfo() {
        return SessionManager::getUserSession(SessionManager::$S_EPG_THEME_INFO);
    }

    // 得到用户自动续订标志
    public static function getAutoOrderFlag() {
        return SessionManager::getUserSession(SessionManager::$S_AUTO_ORDER_FLAG);
    }

    // 设置用户自动续订标志
    public static function setAutoOrderFlag($autoOrderFlag) {
        SessionManager::setUserSession(SessionManager::$S_AUTO_ORDER_FLAG, $autoOrderFlag);
    }

    // 获取首页二号位配置情况
    public static function getPositionTwoConfig() {
        return SessionManager::getUserSession(SessionManager::$S_POSITON_TWO_CONFIG);
    }

    // 设置首页二号位配置
    public static function setPositionTwoConfig($config) {
        SessionManager::setUserSession(SessionManager::$S_POSITON_TWO_CONFIG, $config);
    }

    /**
     * @Brief:此函数用于获取某个运营商下某个省份的某个地区
     */
    public static function getSubAreaCode() {
        return SessionManager::getUserSession(SessionManager::$S_SUB_AREA_CODE);
    }

    // @Brief:此函数用于设置某个运营商下某个省份的某个地区
    public static function setSubAreaCode($subAreaCode) {
        SessionManager::setUserSession(SessionManager::$S_SUB_AREA_CODE, $subAreaCode);
        CookieManager::setCookie(CookieManager::$C_SUB_AREA_CODE, $subAreaCode); //必须！前端播放器场景用到！！！
    }

    // 获取贵健康user_id
    public static function getGJKUID() {
        return SessionManager::getUserSession(SessionManager::$S_GJK_UID);
    }

    // 设置贵健康user_id
    public static function setGJKUID($user_id) {
        SessionManager::setUserSession(SessionManager::$S_GJK_UID, $user_id);
    }

    /**
     * @Brief:此函数用于获取用户的userToken
     */
    public static function getUserToken() {
        $userToken = SessionManager::getUserSession(SessionManager::$S_USER_TOKEN);
        return $userToken ? $userToken : "";
    }

    // @Brief:此函数用于设置用户的userToken
    public static function setUserToken($userToken) {
        SessionManager::setUserSession(SessionManager::$S_USER_TOKEN, $userToken);
    }

    // @Brief:此函数用于设置vip状态 1、是vip 0、不是vip @param: $isVip （1--是vip, 0--不是vip）/
    public static function setUserIsVip($isVip) {
        SessionManager::setUserSession(SessionManager::$S_IS_VIP_USER, $isVip);
    }

    // @Brief:此函数用于获取vip状态 @return: $isVip （1--是vip, 0--不是vip）
    public static function getUserIsVip() {
        // vip状态 1、是vip 0、不是vip
        $isVip = SessionManager::getUserSession(SessionManager::$S_IS_VIP_USER) ? 1 : 0;
        return $isVip;
    }

    // 获取积分兑换状态
    public static function getJifenStatus() {
        return SessionManager::getUserSession(SessionManager::$S_IS_JIFEN_EXCHANGE);
    }

    // 设置积分兑换状态
    public static function setJifenStatus($JifenStatus) {
        SessionManager::setUserSession(SessionManager::$S_IS_JIFEN_EXCHANGE, $JifenStatus);
    }

    // @Brief:此函数用于设置用户是测试帐号用户  @param $isTestUser (1--测试用户，0--正常用户)
    public static function setIsTestUser($isTestUser) {
        SessionManager::setUserSession(SessionManager::$S_IS_TEST_USER, $isTestUser);
    }

    // @Brief:此函数用于获取用户是测试帐号用户  @return $isTestUser (1--测试用户，0--正常用户)
    public static function getIsTestUser() {
        $isTestUser = SessionManager::getUserSession(SessionManager::$S_IS_TEST_USER) ? 1 : 0;
        return $isTestUser;
    }

    // @Brief:此函数用于设置用户新注册用户  @param $isNewUser (1--新注册用户，0--正常用户)
    public static function setIsNewUser($isNewUser) {
        SessionManager::setUserSession(SessionManager::$S_IS_NEW_USER, $isNewUser);
    }

    // @Brief:此函数用于获取用户新注册号用户  @return $isNewUser (1--新注册用户，0--正常用户)
    public static function getIsNewUser() {
        $isNewUser = SessionManager::getUserSession(SessionManager::$S_IS_NEW_USER) ? 1 : 0;
        return $isNewUser;
    }

    // @Brief:此函数用于设置用户的订购页配置方式
    public static function setPayMethod($method) {
        SessionManager::setUserSession(SessionManager::$S_QUREY_PAY_METHOD, $method);
    }

    // @Brief:此函数用于获取用户的订购页配置方式
    public static function getPayMethod() {
        $method = SessionManager::getUserSession(SessionManager::$S_QUREY_PAY_METHOD);
        return $method;
    }

    // @Brief:此函数用于增加用户显示促订次数
    public static function addInspireOrderTimes() {
        $orderTimes = MasterManager::getInspireOrderTimes();
        $orderTimes++;
        SessionManager::setUserSession(SessionManager::$S_INSPIRE_ORDER_TIMES, $orderTimes);
    }

    public static function clearInspireOrderTimes() {
        SessionManager::setUserSession(SessionManager::$S_INSPIRE_ORDER_TIMES, null);
    }

    public static function clearOrderParams() {
        SessionManager::setUserSession(SessionManager::$S_SHOW_ORDER_TIMES, null);
    }

    // @Brief:此函数用于获取用户显示促订次数
    public static function getInspireOrderTimes() {
        $orderTimes = SessionManager::getUserSession(SessionManager::$S_INSPIRE_ORDER_TIMES) ?
            SessionManager::getUserSession(SessionManager::$S_INSPIRE_ORDER_TIMES) : 0;
        return $orderTimes;
    }

    // @Brief:此函数用于调协是否向平台方注册
    public static function setLoginToSP($loginToSp) {
        SessionManager::setUserSession(SessionManager::$S_LOGIN_TO_SP, $loginToSp);
    }

    public static function getLoginToSP() {
        $loginToSp = SessionManager::getUserSession(SessionManager::$S_LOGIN_TO_SP) ?
            SessionManager::getUserSession(SessionManager::$S_LOGIN_TO_SP) : 0;
        return $loginToSp;
    }

    public static function setLoginContentId($loginContentId) {
        SessionManager::setUserSession(SessionManager::$S_LOGIN_CONTENT_ID, $loginContentId);
    }

    public static function getLoginContentId() {
        $loginContentId = SessionManager::getUserSession(SessionManager::$S_LOGIN_CONTENT_ID) ?
            SessionManager::getUserSession(SessionManager::$S_LOGIN_CONTENT_ID) : "";
        return $loginContentId;
    }

    public static function getEnterAppTime() {
        $orderTimes = SessionManager::getUserSession(SessionManager::$S_ENTER_APP_TIME) ?
            SessionManager::getUserSession(SessionManager::$S_ENTER_APP_TIME) : 0;
        return $orderTimes;
    }

    public static function setEnterAppTime($enterAppTime) {
        SessionManager::setUserSession(SessionManager::$S_ENTER_APP_TIME, $enterAppTime);
    }

    public static function getShowOrderTimes() {
        $orderTimes = SessionManager::getUserSession(SessionManager::$S_SHOW_ORDER_TIMES) ?
            SessionManager::getUserSession(SessionManager::$S_SHOW_ORDER_TIMES) : 0;
        return $orderTimes;
    }

    public static function setShowOrderTimes($showOrderTimes) {
        SessionManager::setUserSession(SessionManager::$S_SHOW_ORDER_TIMES, $showOrderTimes);
    }

    public static function isEnterHospitalModule() { // 设置进入区医院模块
        $orderTimes = SessionManager::getUserSession(SessionManager::$S_ENTER_HOSPITAL_MODULE) ?
            SessionManager::getUserSession(SessionManager::$S_ENTER_HOSPITAL_MODULE) : 0;
        return $orderTimes;
    }

    public static function setEnterHospitalModule($isEnter) { // 设置已经进入区医院模块
        SessionManager::setUserSession(SessionManager::$S_ENTER_HOSPITAL_MODULE, $isEnter);
    }

    public static function getUserGroupType() { // 获取用户分组
        $groupType = SessionManager::getUserSession(SessionManager::$S_USER_GROUP_TYPE) ?
            SessionManager::getUserSession(SessionManager::$S_USER_GROUP_TYPE) : 0;
        return $groupType;
    }

    public static function setUserGroupType($groupType) { // 设置用户分组
        SessionManager::setUserSession(SessionManager::$S_USER_GROUP_TYPE, $groupType);
    }

    public static function getUserGroupFourFirstEnter() { // 获取用户分组4是否可第一次进入，1，第一次进入，其他为多次进入
        $isFirstFlag = SessionManager::getUserSession(SessionManager::$S_USER_GROUP_FOUR_FIRST_ENTRY) ?
            SessionManager::getUserSession(SessionManager::$S_USER_GROUP_FOUR_FIRST_ENTRY) : 0;
        return $isFirstFlag;
    }

    public static function setUserGroupFourFirstEnter($flag) { //  设置用户分组4是否可第一次进入，1，第一次进入，其他为多次进入
        SessionManager::setUserSession(SessionManager::$S_USER_GROUP_FOUR_FIRST_ENTRY, $flag);
    }

    /**
     * 设置订购黑名单状态
     * @param integer $state 是否黑名单用户状态
     * @throws Exception
     */
    public static function setOrderBlacklistUserState($state)
    {
        SessionManager::setUserSession(SessionManager::$S_IS_ORDER_BLACKLIST_USER, $state);
    }

    /**
     * 获取缓存中用户黑名单状态
     * @return int|mixed
     */
    public static function isOrderBlacklistUser()
    {
        $state = SessionManager::getUserSession(SessionManager::$S_IS_ORDER_BLACKLIST_USER);
        $state = empty($state) ? 0 : $state;
        return $state;
    }

    public static function setUserAgentInfo($userAgentInfo) {
        SessionManager::setUserSession(SessionManager::$S_USER_AGENT_INFO, $userAgentInfo);
    }

    public static function getUserAgentInfo() {
        return SessionManager::getUserSession(SessionManager::$S_USER_AGENT_INFO);
    }

    public static function setXRequestedWith($XRequestedWith) {
        SessionManager::setUserSession(SessionManager::$S_X_REQUESTED_WITH, $XRequestedWith);
    }

    public static function getXRequestedWith() {
        return SessionManager::getUserSession(SessionManager::$S_X_REQUESTED_WITH);
    }

    public static function setEPGHomeURL($EPGHomeURL) {
        SessionManager::setUserSession(SessionManager::$S_EPG_HOME_URL, $EPGHomeURL);
    }

    public static function getEPGHomeURL() {
        return SessionManager::getUserSession(SessionManager::$S_EPG_HOME_URL);
    }

    // 设置局方EPG服务器URL
    public static function setEPGServerURL($EPGServerURL) {
        SessionManager::setUserSession(SessionManager::$S_EPG_SERVER_URL, $EPGServerURL);
    }

    // 获取局方EPG服务器URL
    public static function getEPGServerURL() {
        return SessionManager::getUserSession(SessionManager::$S_EPG_SERVER_URL);
    }

    // -------Cookie相关-------
    public static function setOrderResult($orderResult) {
        CookieManager::setCookie(CookieManager::$C_ORDER_RESULT, $orderResult);
    }

    public static function getOrderResult() {
        return CookieManager::getCookie(CookieManager::$C_ORDER_RESULT);
    }

    public static function setAppRootPath($appRootPath) {
        CookieManager::setCookie(CookieManager::$C_APP_ROOT_PATH, $appRootPath);
    }

    public static function getAppRootPath() {
        return CookieManager::getCookie(CookieManager::$C_APP_ROOT_PATH);
    }

    public static function setSplashHistoryLength($splashHistoryLength) {
        CookieManager::setCookie(CookieManager::$C_HISTORY_LENGTH, $splashHistoryLength);
    }

    public static function getSplashHistoryLength() {
        return CookieManager::getCookie(CookieManager::$C_HISTORY_LENGTH);
    }

    public static function setIsForbiddenOrder($isForbiddenOrder) {
        CookieManager::setCookie(CookieManager::$C_IS_FORBIDDEN_ORDER, $isForbiddenOrder);
    }

    public static function isForbiddenOrder() {
        return CookieManager::getCookie(CookieManager::$C_IS_FORBIDDEN_ORDER);
    }

    public static function getCookieCarrierId() {
        return CookieManager::getCookie(CookieManager::$C_CARRIER_ID);
    }

    public static function setCookieFromLaunch($frameLaunch) {
        CookieManager::setCookie(CookieManager::$C_FROM_LAUNCH, $frameLaunch);
    }

    public static function getCookieFromLaunch() {
        return CookieManager::getCookie(CookieManager::$C_FROM_LAUNCH);
    }

    public static function setCookieInner($innerValue) {
        CookieManager::setCookie(CookieManager::$C_INNER_VALUE, $innerValue);
    }
}