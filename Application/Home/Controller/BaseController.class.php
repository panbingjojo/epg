<?php
/**
 * 公共控制器
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/5/9
 * Time: 下午3:02
 */

namespace Home\Controller;


use Home\Model\Common\LogUtils;
use Home\Model\Common\SystemManager;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\User\UserManager;
use Think\Controller;

header('Access-Control-Allow-Origin:*');
// 响应类型
header('Access-Control-Allow-Methods:*');
// 响应头设置
header('Access-Control-Allow-Headers:x-requested-with,content-type');

abstract class BaseController extends Controller {
    /**
     * 初始化通用渲染
     */
    public function initCommonRender() {
        /** 平台相关参数 */
        $carrierId = MasterManager::getCarrierId();                             // 平台编码
        $areaCode = MasterManager::getAreaCode();                               // 平台地区码 - 局方定义
        $subAreaCode = MasterManager::getSubAreaCode();                         // 子ID
        $platformType = MasterManager::getPlatformType();
        $platformType === null || $platformType === "" ? ($platformType = STB_TYPE_HD) : "";
        $stbModel = MasterManager::getSTBModel();
        $lmp = MasterManager::getEnterPosition();    // 访问入口地址的位置
        $debug = DEBUG;                                                         // 调试模式
        /** 页面相关参数 */
        $pageSize = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;    // 页面尺寸,需要封装一个页面尺寸管理器
        $styleName = ($platformType == STB_TYPE_HD) ? 720 : 644;                    // 样式名 （后续优化代码后可以去掉）
        LogUtils::info("BaseController ---> carrierId :" . $carrierId);
        LogUtils::info("BaseController ---> platformType :" . $platformType);
        LogUtils::info("BaseController ---> pageSize :" . $pageSize);
        /** 资源地址 */
        $resourcesUrl = RESOURCES_URL;    // 文件系统地址

        /** 用户信息 */
        $userId = $this->getFilter('userId') != "" ? $this->getFilter('userId') : MasterManager::getUserId();
        $accountId = MasterManager::getAccountId();                                // 用户帐号

        /** 当前时间，如：20181208 */
//        $time = date('Ymd');
        $time = time();

        /** 默认焦点保持按钮id */
        $focusIndex = isset($_REQUEST['focusIndex']) ? $_REQUEST['focusIndex'] : '';

        /** 是否显示免费角标 */
        $showCornerFree = (defined("SHOW_CORNER_FREE") && SHOW_CORNER_FREE == 1) ? 1 : 0;
        /** 是否显示付费角标 */
        $showCornerPay = (defined("SHOW_CORNER_PAY") && SHOW_CORNER_PAY == 1) ? 1 : 0;

        /** 能否访问视频问诊，1表示能访问 0-不能访问 */
        $accessInquiryInfo = Utils::canAccessInquiry(MasterManager::getSTBModel());
        // vip状态 1、是vip 0、不是vip
        $isVip = MasterManager::getUserIsVip();

        // 显示定购童锁 0-- 不显示童锁，1-- 显示童锁
        $showPayLock = MasterManager::isShowPayLock() ? MasterManager::isShowPayLock() : 0;

        /** 计费说明信息*/
        $payMessage = Utils::getPayMessage();

        /** cws挂号服务器图片地址 */
        $cwsGuaHaoUrl = defined('SERVER_GUAHAO_CWS_FS') ? SERVER_GUAHAO_CWS_FS : "";

        /** 图文问诊地址 */
        $teletextInquiryUrl = defined('TELETEXT_INQUIRY_URL') ? TELETEXT_INQUIRY_URL : "";

        /** 获取用户自定义皮肤 */
        $skin = SystemManager::getUserSkin();

        // 获取订购方式配置
        // $payMethod = MasterManager::getPayMethod();

        // 获取免费体验状态值
        $freeExperience = MasterManager::getFreeExperience();
        $this->assign('freeExperience', $freeExperience);

        $fromLaunch = MasterManager::getCookieFromLaunch();

        $this->assign('carrierId', $carrierId);
        $this->assign('areaCode', $areaCode);
        $this->assign('subAreaCode', $subAreaCode);
        $this->assign('platformType', $platformType);

        $this->assign('stbModel', $stbModel);
        $this->assign('debug', $debug);
        $this->assign('size', $pageSize);
        $this->assign("commonImgsView", COMMON_IMGS_VIEW);    // 公用图片模式
        $this->assign('styleName', $styleName);
        $this->assign('resourcesUrl', $resourcesUrl);               // fs地址
        $this->assign('userId', $userId);                           // 用户Id
        $this->assign('accountId', $accountId);                     // 用户帐号
        $this->assign('time', $time);                               // 当前时间
        $this->assign('focusIndex', $focusIndex);                   // 默认页面焦点按钮id
        $this->assign('showCornerFree', $showCornerFree);
        $this->assign('showCornerPay', $showCornerPay);
        $this->assign('accessInquiryInfo', $accessInquiryInfo);
        $this->assign("payMessage", $payMessage);
        $this->assign("isVip", $isVip);
        $this->assign('cwsGuaHaoUrl', $cwsGuaHaoUrl);               // cws挂号代理服务器图片地址
        $this->assign('teletextInquiryUrl', $teletextInquiryUrl);   // 图文问诊地址
        $this->assign("showPayLock", $showPayLock);
        $this->assign("skin", json_encode($skin));
        // $this->assign("payMethod", json_encode($payMethod));
        $this->assign("fromLaunch", $fromLaunch);
        $this->assign("lmp", $lmp);//访问入口地址的位置
        $this->assign("inspireTimes",/*MasterManager::getInspireOrderTimes()*/ "");

        $isOrderBack = $this->requestFilter('isOrderBack', 0);
        $orderType = $this->requestFilter('orderType', 0);
        $this->assign('isOrderBack', $isOrderBack); // 是否订购返回
        $this->assign('orderType', $orderType); // 是否订购返回

        $this->assign('isRunOnAndroid', IS_RUN_ON_ANDROID); // apk版本合并回epg版本时，配置是否运行在android

        $render['carrierId'] = $carrierId;
        $render['areaCode'] = $areaCode;
        $render['platformType'] = $platformType;
        $render['stbModel'] = $stbModel;
        $render['debug'] = $debug;
        $render['size'] = $pageSize;
        $render['commonImgsView'] = COMMON_IMGS_VIEW;
        $render['styleName'] = $styleName;
        $render['fsUrl'] = $resourcesUrl;
        $render['userId'] = $userId;
        $render['accountId'] = $accountId;
        $render['time'] = $time;
        $render['focusIndex'] = $focusIndex;
        $render['enterPosition'] = $lmp;
        $render['isVip'] = $isVip;
        return $render;
    }

    /**
     * 初始化时的特殊代码
     */
    public function initSpecialCode() {
        // 条件：当首次进入查询成功后，后续操作才再次查询状态
        $specialCode = "";
        if (MasterManager::isReportUserInfo() == 1) {
            $result = UserManager::queryReportUserInfo(2);
            if (!empty($result) && $result->result == 0) {
                LogUtils::info("BaseController::homeV3UI ---> start");
                $instance = \Home\Model\System\SystemManager::getInstance();
                if ($instance) {
                    $specialCode = $instance->getSpecialCodeFragment();
                }
            }
        }
        $this->assign("specialCode", $specialCode);
    }

    /**
     * 渲染页面，通过配置的页面名
     * @param $name // 配置的页面名称
     */
    public function displayEx($name) {
        $config = $this->config();
        $page = $config != null && is_array($config) ? $config[$name] : "";     // 如果$page为空，将走ThinkPHP默认的View路径
        LogUtils::info("BaseController::displayEx() ---> display page: " . $page);
        $this->display($page);
    }

    /**
     * @Brief:此函数用于显示具体省份地区的计费页
     * @param: $areaCode 地区码
     * @param: $subAreaCode 子地区码
     */
    public function displayEx2($name, $areaCode, $subAreaCode) {
        $config = $this->config();
        $page = "";         // 如果$page为空，将走ThinkPHP默认的View路径
        if ($config != null && is_array($config)) {
            $page = $config[$name];
        }
        $page = $page . $areaCode . $subAreaCode;
        LogUtils::info("BaseController::displayEx() ---> display page: " . $page);
        $this->display($page);
    }

    /**
     * 对request参数进行特殊字符过滤，防止js跨站攻击
     * @param $str
     * @param $defaultStr (请求参数不存在时的默认值)
     * @param $isFilter (true对请求的参数过滤，false:不过滤)
     * @return string
     */
    public function requestFilter($str, $defaultStr = "", $isFilter = true) {
        if (!$isFilter) {
            return isset($_REQUEST[$str]) ? $_REQUEST[$str] : $defaultStr;
        }
        return isset($_REQUEST[$str]) ? htmlspecialchars($_REQUEST[$str]) : $defaultStr;
    }

    /**
     * 对GET参数进行特殊字符过滤，防止js跨站攻击
     * @param string $str
     * @param $defaultStr (请求参数不存在时的默认值)
     * @param $isFilter (true对请求的参数过滤，false:不过滤)
     * @return mixed|string
     */
    public function getFilter($str, $defaultStr = "", $isFilter = true) {
        if (!$isFilter) {
            return isset($_GET[$str]) ? $_GET[$str] : $defaultStr;
        }
        return isset($_GET[$str]) && !empty($_GET[$str]) ? htmlspecialchars($_GET[$str]) : $defaultStr;
    }

    /**
     * 对POOST参数进行特殊字符过滤，防止js跨站攻击
     * @param $str
     * @param $defaultStr (请求参数不存在时的默认值)
     * @param $isFilter (true对请求的参数过滤，false:不过滤)
     * @return string
     */
    public function postFilter($str, $defaultStr = "", $isFilter = true) {
        if (!$isFilter) {
            return isset($_POST[$str]) ? $_POST[$str] : $defaultStr;
        }
        return isset($_POST[$str]) ? htmlspecialchars($_POST[$str]) : $defaultStr;
    }

    /**
     * 输入到页面的js过滤器
     * @param $str
     * @return string
     */
    public function jsFilter($str) {
        return htmlspecialchars($str);
    }

    /**
     * 构建静态的促订配置信息
     */
    public function getPromoteOrderConfig() {
        $promoteOrderConfig = new \stdClass();
        $promoteOrderConfigData = new \stdClass();
        $promoteOrderConfigData->list = [];
        $promoteOrderConfig->data = $promoteOrderConfigData;
        return $promoteOrderConfig;
    }

    /**
     * 因部分地区的鉴权JS处理逻辑是一致的，通过函数来进一步处理
     * @return string js文件的后缀
     */
    public function getAuthJSFileSuffix() {
        switch (CARRIER_ID) {
            case CARRIER_ID_CHINAUNICOM_MOFANG:
            case CARRIER_ID_CHINAUNICOM_MEETLIFE:
            case CARRIER_ID_LDLEGEND:
                $suffix = CARRIER_ID_CHINAUNICOM;
                break;
            case CARRIER_ID_GUIZHOUGD_XMT:
                $suffix = CARRIER_ID_GUIZHOUDX;
                break;
            case CARRIER_ID_JILINGD_MOFANG:
                $suffix = CARRIER_ID_JILINGD_MOFANG;
                break;
            default:
                $suffix = CARRIER_ID;
                break;
        }
        return $suffix;
    }

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public abstract function config();
}