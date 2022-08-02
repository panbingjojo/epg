<?php
/**
 * 进入导航页
 *
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/7
 * Time: 14:44
 */

namespace Home\Controller;

use Home\Model\Common\LogUtils;
use Home\Model\Common\SystemManager;
use Home\Model\Common\VersionManager;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;


class SplashController extends BaseController
{

    private $fromId = 0; // 设置默认的入口来源
    private $epgInfoMap = null; // 盒子信息

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    /**
     * 导航页入口
     */
    public function indexV1UI()
    {
        $this->renderCommonSplash(); // 渲染splash公共属性
        $this->renderPrivateSplash(); // 渲染splash私有属性

        LogUtils::info("SplashController display indexV1UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 渲染公共属性
     */
    private function renderCommonSplash()
    {
        $this->assign('isRunOnAndroid', IS_RUN_ON_ANDROID); // apk版本合并回epg版本时，配置是否运行在android
        // 文件服务器路径
        $this->assign("resourcesUrl", RESOURCES_URL);
        // 是否调试模式
        $this->assign("debug", DEBUG);
        // 地区编码 -- 一级
        $this->assign("carrierId", CARRIER_ID);
        // 地区编码 -- 二级
        $this->assign("areaCode", MasterManager::getAreaCode());
        // 地区编码 -- 三级
        $this->assign("subAreaCode", MasterManager::getSubAreaCode());
        // 平台类型 -- 区分高标清
        $platformType = MasterManager::getPlatformType();
        $this->assign("platformType", $platformType);
        // 页面尺寸,需要封装一个页面尺寸管理器
        $pageSize = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;
        $this->assign("size", $pageSize);
        // 盒子参数
        $this->assign("stbModel", MasterManager::getSTBModel());
        //入口
        $this->assign("lmp", MasterManager::getEnterPosition());//访问入口地址的位置
        // 用户账号
        $this->assign("accountId", MasterManager::getAccountId());

        // 盒子信息参数
        $this->epgInfoMap = MasterManager::getEPGInfoMap();

        // 跳转类型，是否入栈
        $intentType = defined('COMMON_SPLASH_INTENT_TYPE') ? COMMON_SPLASH_INTENT_TYPE : 0;
        $this->assign("intentType", $intentType);
        // 跳转页面类型
        $this->assign("userfromType", MasterManager::getUserFromType());
        // 跳转页面参数
        $this->assign("subId", json_encode(MasterManager::getSubId()));

        // 入口来源
        $fromId = parent::getFilter("fromId");
        $this->fromId = $fromId ? $fromId : 0;
        $this->assign("fromId", $this->fromId);

        // 背景图片
        $_list = [CARRIER_ID_CHINAUNICOM, CARRIER_ID_CHINAUNICOM_MOFANG, CARRIER_ID_DEMO7];
        $this->assign("epgSplashPictureUrl", SystemManager::getEpgThemePicture(CLASSIFY_SPLASH,  in_array(CARRIER_ID, $_list)? MasterManager::getAreaCode() : null));

        // 记录进入应用的时间戳
        $this->assign("enterAppTime", MasterManager::getEnterAppTime());
        // 启动启动的时间戳
        $this->assign("time", time());
        // 第三方标识
        $this->assign("spid", SPID);
        // 服务器路径
        $this->assign("serverPath", "");
        // 标识是否局方入口进入
        MasterManager::setCookieInner(1);

        // 区域ID映射表
        $carrierIdTable = eval(CARRIER_ID_TABLE);
        $this->assign("carrierIdTable", json_encode($carrierIdTable));

        // 欢迎页JS文件后缀
        $this->assign("scriptFileSuffix", $this->_getSplashJSFileSuffix());
        // 鉴权JS文件后缀
        $this->assign("authFileSuffix", $this->getAuthJSFileSuffix());

        // --------------------APK平台相关配置参数----------------------------
        // 是否运行在未来电视平台
        $this->assign("isNewTVPlatform", 0);
        // 是否需要使用android的鉴权SDK进行鉴权，该常量值在各平台配置文件的Config文件中定义，Application/Order/Conf[CarrierId].php
        $this->assign("isAuthByAndroidSDK", defined('AUTH_BY_ANDROID_SDK') ? AUTH_BY_ANDROID_SDK : 0);
        // 是否需要问诊相关功能，甘肃移动apk在局方配置有一键问诊的功能
        $this->assign("isNeedInquiry", CARRIER_ID == CARRIER_ID_GANSUYD ? 1 : 0);
        // 是否从使用易视腾鉴权计费接口的入口进入（广东移动APK融合包）
        $this->assign("isEnterFromYsten", MasterManager::getEnterFromYsten());
    }

    /**
     * 因部分地区的JS处理逻辑是一致的，通过函数来进一步处理
     * @return string
     */
    private function _getSplashJSFileSuffix()
    {
        switch (CARRIER_ID) {
            case CARRIER_ID_CHINAUNICOM_MEETLIFE:
                $suffix = CARRIER_ID_CHINAUNICOM_MOFANG;
                break;
            case CARRIER_ID_JILINGDDX:
                $suffix = CARRIER_ID_JILINGD;
                break;
            case CARRIER_ID_JILINGD_MOFANG:
                $suffix = CARRIER_ID_JILINGD_MOFANG;
                break;
            case CARRIER_ID_GUIZHOUGD_XMT:
                $suffix = CARRIER_ID_GUIZHOUDX;
                break;
            case CARRIER_ID_SHANDONGDX_HAIKAN:
                $suffix = CARRIER_ID_SHANDONGDX;
                break;
            default :
                $suffix = CARRIER_ID;
        }

        return $suffix;
    }

    /**
     * 渲染私有属性
     */
    private function renderPrivateSplash()
    {
        switch (CARRIER_ID) {
            case CARRIER_ID_JILINGD_MOFANG:
                if (defined("PRODUCT_ID")) $this->assign("productId", PRODUCT_ID); // 传递计费套餐id，用于前端鉴权。例如：吉林广电
                break;
            case CARRIER_ID_JILINGD:
                if (defined("PRODUCT_ID")) $this->assign("productId", PRODUCT_ID); // 传递计费套餐id，用于前端鉴权。例如：吉林广电
                break;
            case CARRIER_ID_CHINAUNICOM:
                $userToken = parent::getFilter("UserToken");
                $userToken = $userToken ? $userToken : "";
                // 更新userToken
                if ($this->fromId == 1 && $userToken && empty($epgInfoMap['UserToken'])) {
                    $this->epgInfoMap['UserToken'] = $userToken;
                    MasterManager::setUserToken($userToken);
                    MasterManager::setEPGInfoMap($this->epgInfoMap);
                }
                break;
            case CARRIER_ID_CHONGQINGDX:
                $serverPath = $this->epgInfoMap['serverPath'];
                $this->assign("serverPath", $serverPath);
                break;
            case CARRIER_ID_GUANGDONGYD:
                if (MasterManager::getEnterFromYsten() == "1") {
                    $productId = PRODUCT_ID_FOR_YST;
                    $this->assign("productId", $productId);
                }
                break;
            case CARRIER_ID_GUANGDONGGD_NEW:
                $this->assign('QUERY_ORDER_URL', USER_ORDER_URL . QUERY_ORDER_FUNC);    //鉴权的请求地址
                $this->assign('GET_USER_CONFIG', USER_ORDER_URL . GET_USER_CONFIG);                        //获取登录用户信息请求地址
                //鉴权参数
                $authData = array(
                    "providerId" => providerId,
                    "devNo" => '',
                    "productId" => productId_month,
                    "timeStamp" => date("YmdHis"),
                    "sign" => '',
                );
                $this->assign('QUERY_ORDER_DATA', json_encode($authData));    //鉴权的请求参数
                $this->assign('KEY', key);                               //鉴权的请求参数
                $this->assign('appId', appId);                          //获取登录用户信息的请求参数
                break;
            case CARRIER_ID_MANGOTV_LT:
                $this->assign('providerId', "");
                $this->assign('lmp', "-1");
                break;
            case CARRIER_ID_SHANDONGDX_HAIKAN:
                $this->assign('authCode', CONTENT_CODE);
                break;
            case CARRIER_ID_GUANGXIGD_APK:    // 广西广电apk
            case CARRIER_ID_NINGXIADX_MOFANG: // 内蒙古电信apk
                // 获取版本更新信息
                $version = VersionManager::getVersion();
                // 渲染参数到前端页面
                $this->assign('version', $version);
                break;
            default:
                break;
        }
    }
}