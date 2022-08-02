<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Intent\IntentManager;
use Home\Model\Intent\IntentStack;

class Application {

    // 进入epg的地址信息
    const USER_FORM_TYPE = "lmuf";
    const RESOLUTION_TYPE = "lmsl";
    const ROUTER_TYPE = "lmsid";
    const ENTER_POSITION = "lmp";

    // 进入活动标识
    const ROUTE_ACTIVITY_FLAG = 5;
    const ROUTE_ACTIVITY_NAME = 'ActivityConsultationNew20200603';

    // 初始化相关动作
    public $initAction = null;

    // 初始化完成监听器
    private $onInfoInitListener = null;

    // EPG信息参数
    protected $epgInfoMap = null;

    public function __construct($initAction) {
        // 赋值初始化变量
        $this->initAction = $initAction;
    }

    /**
     * 初始化函数
     */
    public function init() {
        // 1、系统信息初始化
        $this->initSystemInfo();
        // 2、通用参数初始化
        $this->initCommonInfo();
        // 3、平台私有参数初始化
        $this->initEPGInfo();
        // 4、如果设置监听器，执行监听函数
        $this->initListenerInfo();
        // 5. 控制器路由跳转
        $this->forwardCondition() ? $this->toHuBeiDxActivity() : $this->routerSplash();
    }

    /**
     * 跳转湖北电信活动
     * 其他未说明
     * @throws \Think\Exception
     */
    private function toHuBeiDxActivity() {
        $isBackHome = true;
        if ($isBackHome) {
            $homeIntent = array(
                'name' => 'home',
            );
            IntentStack::push('home', $homeIntent);
        }
        $routeUrl = "/index.php/Activity/ActivityConsultationNew/guide/?activityName=" . self::ROUTE_ACTIVITY_NAME . "&inner=0";
        header("Location:" . $routeUrl);
    }

    /**
     * 判断路由跳转条件
     * @return bool
     */
    private function forwardCondition() {
        $routeParams = $_GET[self::ROUTER_TYPE];
        return CARRIER_ID == CARRIER_ID_XINJIANGDX && $routeParams == self::ROUTE_ACTIVITY_NAME;
    }

    /**
     * 判断是否设置监听器，如果设置监听器，执行监听函数
     */
    private function initListenerInfo() {
        if ($this->onInfoInitListener && $this->onInfoInitListener instanceof OnApplicationInitListener) {
            $this->onInfoInitListener->onApplicationInit();
        }
    }

    /**
     * 设置初始化完成监听器
     * @param Object $listener 监听器
     */
    public function setOnInfoIoInitListener($listener) {
        $this->onInfoInitListener = $listener;
    }

    /**
     * 外部链接进入的时候初始化相关信息
     */
    public function initEPGInfo() {
        if ($this->initAction && $this->initAction instanceof InitAction) {
            // 1、通过跳转EPG参数，获取EPG初始化相关信息
            $this->epgInfoMap = $this->initAction->getEPGInfoMap();
            if (!empty($this->epgInfoMap)) {
                // 2、通过获取到的参数进一步解析参数
                $this->epgInfoMap = $this->initAction->handleEPGInfoMap($this->epgInfoMap);
            }
            LogUtils::debug("Application-->initEPGInfo-->EPGInfoMap-->" . json_encode($this->epgInfoMap));
            // 3、将解析后的参数保存到缓存中，提供后续业务使用
            MasterManager::setEPGInfoMap($this->epgInfoMap);
        }
    }

    /**
     * 系统参数相关初始化
     */
    public function initSystemInfo() {
        if (defined('APP_ROOT_PATH')) {
            MasterManager::setAppRootPath(APP_ROOT_PATH);
        } elseif (defined('APK_ROOT_PATH')) {
            MasterManager::setAppRootPath(APK_ROOT_PATH);
        } else {
            MasterManager::setAppRootPath(null);
        }

        //记录进入参数日志
        LogUtils::info("IndexController ---> indexUI _GET : " . json_encode($_GET));
        $indexUrlParams = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        LogUtils::info("IndexController ---> indexUI url : " . $indexUrlParams);
        MasterManager::setIndexURL($indexUrlParams);
        LogUtils::info("User Agent ----->: " . $_SERVER['HTTP_USER_AGENT']);
        LogUtils::info("clientIP ----->: " . get_client_ip());

        // 对ua进行保护，避免出现ua里有双引号
        $ua = $_SERVER['HTTP_USER_AGENT'];
        if (strstr($ua, '"')) {
            $ua = str_replace('"', '', $ua);
        }
        // 保存user agent到cookie
        MasterManager::setUserAgentInfo($ua);

        // 保存客户端的x-requested-with
        if (isset($_SERVER["HTTP_X_REQUESTED_WITH"])) {
            LogUtils::info("HTTP_X_REQUESTED_WITH ----->: " . $_SERVER["HTTP_X_REQUESTED_WITH"]);
            $xrw = isset($_SERVER["HTTP_X_REQUESTED_WITH"]) ? $_SERVER["HTTP_X_REQUESTED_WITH"] : "";
            MasterManager::setXRequestedWith($xrw);
        }
    }

    /**
     * 管理后台生成局方推荐位入口信息参数，跳转时会将url链接传入，
     * 当前函数用于从提供的URL提取公共的参数信息
     * 包含路由信息，分辨率类型（区分高标清），指定欢迎页后跳转的模块，局方大厅的推荐位
     */
    public function initCommonInfo() {
        $filterParams = array(
            self::USER_FORM_TYPE => UF_TYPE_HOME, // 路由类型，默认首页
            self::RESOLUTION_TYPE => SL_TYPE_SD, // 分辨率类型，默认标清
            self::ROUTER_TYPE => DEFAULT_ROUTER_TYPE, // 推荐位指定跳转类型
            self::ENTER_POSITION => DEFAULT_ENTER_POSITION // 局方大厅推荐位置
        );
        $infos = URLUtils::parseURLInfo($filterParams);

        $lmSubId = htmlspecialchars_decode($infos[self::ROUTER_TYPE]);
        // 提取字符串前面两位，得到（sd、hd）
        $resType = substr($infos[self::RESOLUTION_TYPE], 0, 2);
        MasterManager::setPlatformType($resType);
        MasterManager::setPlatformTypeExt($infos[self::RESOLUTION_TYPE]);
        //防止注入攻击
        if (!is_numeric($infos[self::ENTER_POSITION])) {
            $infos[self::ENTER_POSITION] = "0";
        }
        MasterManager::setEnterPosition($infos[self::ENTER_POSITION]);
        // 用新定义的lmsid作为类型
        MasterManager::setSubId($lmSubId);
        // ActivityController里面也会修改该值
        MasterManager::setUserFromType($infos[self::USER_FORM_TYPE]);
    }

    /**
     * 跳转到Splash页面
     */
    public function routerSplash() {
        // 1、路由的模块
        $splashIntent = IntentManager::createIntent("splash");

        // 2、缓存页面，使用门户大厅的地址。将门户大厅地址放在栈顶
        $IPTVPortalIntent = IntentManager::createIntent();
        $IPTVPortalIntent->setPageName("IPTVPortal");

        IntentManager::jump($splashIntent, $IPTVPortalIntent);
    }

    private function _routeActivity() {
        $activityParams = new \stdClass();
        $activityParams->activityName = $_GET[self::ROUTER_TYPE];
        $activityParams->inner = 0;
        $activityIntent = IntentManager::createIntent("activity-common-proxy", $activityParams);

        $IPTVPortalIntent = IntentManager::createIntent();
        $IPTVPortalIntent->setPageName("IPTVPortal");

        $homeIntent = IntentManager::createIntent('home');

        IntentManager::jump($activityIntent, $IPTVPortalIntent, IntentManager::$INTENT_FLAG_DEFAULT, $homeIntent);
    }


}