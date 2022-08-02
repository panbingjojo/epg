<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/10
 * Time: 0:43
 */

namespace Home\Controller;

use Home\Model\Activity\ActivityManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\ServerAPI\StoreAPI;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Common\SystemManager;
use Home\Model\Common\Utils;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\Order\OrderManager;
use Home\Model\Stats\StatManager;
use Home\Model\User\FirstManager;
use Home\Model\User\UserManager;
use Home\Model\Video\VideoManager;


/**
 * 主页控制器
 * Class MainController
 * @package Home\Controller
 */
class MainController extends BaseController
{

    const DEFAULT_FROM_ID = 0; // 默认进入来源标识
    const DEFAULT_FOCUS_ID = ""; // 默认焦点

    /**
     * 页面配置
     * @return array
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function _before_homeV20UI()
    {
//        $diffTime = time()-MasterManager::getEnterAppTime();
//        LogUtils::info("IndexController begin _before_homeV20UI entry! GO,GO,GO,GO......".$diffTime.'(秒)');
    }
    /**************************************页面渲染区域 V1**************************************************/
    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：0
     */
    public function homeV1UI()
    {
        LogUtils::info("YLP - homeV1UI entry");

        // 配置首页信息
        $this->renderHome(0);

        //渲染页面参数
        $scrollTop = parent::getFilter('scrollTop', 0);
        $loadIndex = parent::getFilter('loadIndex', 1);
        $this->assign("scrollTop", $scrollTop);
        $this->assign("loadIndex", $loadIndex);

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $this->assign('portalURL', $epgInfoMap["portalURL"]);
        $this->assign('cardId', $epgInfoMap["cardId"]);
        $this->assign('lmp', MasterManager::getEnterPosition());
        // 第二个推荐位配置
        $this->assign('positionTwoConfig', MasterManager::getPositionTwoConfig());
        // 进入启动页浏览器的历史步长
        $this->assign("historyLength", MasterManager::getSplashHistoryLength());
        // 第三方标识
        $this->assign("spid", SPID);
        // 渲染stbId
        $this->assign("stbId", MasterManager::getSTBId());

        LogUtils::info("MainController display homeV1UI! GO,GO,GO,GO......" . time());

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：1
     */
    public function homeTab1V1UI()
    {
        LogUtils::info("MainController homeTab1V1UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(1);
        LogUtils::info("MainController display homeTab1V1UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }


    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：2
     */
    public function homeTab2V1UI()
    {
        LogUtils::info("MainController homeTab2V1UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(2);
        LogUtils::info("MainController display homeTab2V1UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }


    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：3
     */
    public function homeTab3V1UI()
    {
        LogUtils::info("MainController homeTab3V1UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(3);
        LogUtils::info("MainController display homeTab3V1UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：4
     */
    public function homeTab4V1UI()
    {
        LogUtils::info("MainController homeTab4V1UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(4);
        LogUtils::info("MainController display homeTab4V1UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式2】
     * 支持视频问诊插件
     * 导航栏位置：0
     */
    public function homeV2UI()
    {
        LogUtils::info("MainController homeV2UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(0);

        LogUtils::info("MainController display homeV2UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式2】
     * 支持视频问诊插件
     * 导航栏位置：1
     */
    public function homeTab1V2UI()
    {
        LogUtils::info("MainController homeTab1V2UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(1);
        LogUtils::info("MainController display homeTab1V2UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式2】
     * 支持视频问诊插件
     * 导航栏位置：2
     */
    public function homeTab2V2UI()
    {
        LogUtils::info("MainController homeTab2V2UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(2);
        LogUtils::info("MainController display homeTab2V2UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式2】
     * 支持视频问诊插件
     * 导航栏位置：3
     */
    public function homeTab3V2UI()
    {
        LogUtils::info("MainController homeTab3V2UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(3);
        LogUtils::info("MainController display homeTab3V2UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式2】
     * 支持视频问诊插件
     * 导航栏位置：4
     */
    public function homeTab4V2UI()
    {
        LogUtils::info("MainController homeTab4V2UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(4);
        LogUtils::info("MainController display homeTab4V2UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式3】
     * 支持二级菜单
     * 导航栏位置：0
     */
    public function homeV3UI()
    {
        LogUtils::info("MainController homeV3UI begin entry! GO,GO,GO,GO......");
        // 使用V1的渲染方式
        $this->renderHome(0);
        // 第二个推荐位配置
        $this->assign('positionTwoConfig', MasterManager::getPositionTwoConfig());
        // 初始化特殊代码
        $this->initSpecialCode();
        LogUtils::info("MainController display homeV3UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式3】
     * 支持二级菜单
     * 导航栏位置：1
     */
    public function homeTab1V3UI()
    {
        LogUtils::info("MainController homeTab1V3UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(1, '', MainHomeManager::$CONFIG_MODEL_V3);
        LogUtils::info("MainController display homeTab1V3UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式3】
     * 支持二级菜单
     * 导航栏位置：2
     */
    public function homeTab2V3UI()
    {
        LogUtils::info("MainController homeTab2V3UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(2, '', MainHomeManager::$CONFIG_MODEL_V3);
        LogUtils::info("MainController display homeTab2V3UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式3】
     * 支持二级菜单
     * 导航栏位置：3
     */
    public function homeTab3V3UI()
    {
        LogUtils::info("MainController homeTab3V3UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(3, '', MainHomeManager::$CONFIG_MODEL_V3);
        LogUtils::info("MainController display homeTab3V3UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式3】
     * 支持二级菜单
     * 导航栏位置：4
     */
    public function homeTab4V3UI()
    {
        LogUtils::info("MainController homeTab4V3UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(4, '', MainHomeManager::$CONFIG_MODEL_V3);
        LogUtils::info("MainController display homeTab4V3UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式3】
     * 支持二级菜单
     * 导航栏位置：5
     */
    public function tabMoreV3UI()
    {
        LogUtils::info("MainController tabMoreV3UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(-1, '', MainHomeManager::$CONFIG_MODEL_V3);

        // 重新渲染一下背景图
        $epgThemePicture = SystemManager::getEpgThemePicture(5);
        $this->assign('themePicture', $epgThemePicture);

        $modelType = parent::getFilter('modelType', 0);
        $pageCurrent = parent::getFilter('pageCurrent', 1);
        $this->assign('modelType', $modelType);
        $this->assign('pageCurrent', $pageCurrent);
        LogUtils::info("MainController display tabMoreV3UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 进入应用的首页推荐页
     * GET参数： userId        用户Id
     *           position      焦点位置
     * @brief: 首页 1）获取导航栏信息
     *               2）获取首页推荐的视频
     */
    public function homeV7UI()
    {

        $renderParamsArray = $this->initCommonRender();
        $accountId = $renderParamsArray['accountId'];
        $areaCode = $renderParamsArray['areaCode'];

        LogUtils::info("MainController homeV7UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(0, 'night-medicine', MainHomeManager::$CONFIG_MODEL_V7);

        $scrollTop = parent::getFilter('scrollTop', 0);
        $footer = parent::getFilter('footer', true);
        $focusId = parent::getFilter('focusId', '');
        $deptID = parent::requestFilter("departmentId", "");
        $deptIndex = parent::requestFilter("departmentIndex", "0");

        $secondClass = VideoAPI::getVideoClass(0);
        $this->assign("videoClass", json_encode($secondClass));
        $this->assign("scrollTop", $scrollTop);
        $this->assign("footer", $footer);
        $this->assign("focusId", $focusId);

        // 用户设置的皮肤信息
        $skin = SystemManager::loadUserSkin();
        $this->assign("skin", json_encode($skin));

        $placeholderObj = SystemManager::getPlaceholderConfig();
        $placeholderPath = $placeholderObj->pathUrl;
        $placeholderImgUrl = $placeholderObj->imgUrl;//默认placeholder

        $this->assign('placeholderPath', $placeholderPath);
        $this->assign('placeholderImgUrl', $placeholderImgUrl);
        $this->assign("payLockStatus", self::setSafeLockStatus($accountId, $areaCode));
        // $this->assign('placeholderImgUrl','');

        //获取缓存数据
        $this->assign('backEPGUrl', MasterManager::getIPTVPortalUrl());
        $this->assign('positionTwoConfig', MasterManager::getPositionTwoConfig());
        $this->assign("historyLength", MasterManager::getSplashHistoryLength());

        // 常量获取
        $this->assign('password', PASSWORD);
        $this->assign("pluginMofangAppName", PLUGIN_MOFANG_APP_NAME);
        LogUtils::info("MainController display homeV7UI! GO,GO,GO,GO......");

        $this->assign("departmentId", $deptID);
        $this->assign("departmentIndex", $deptIndex);

        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);

        $this->assign('mapTime', Date("YmdHi"));
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

        $vipInfo = UserManager::queryVipInfo(MasterManager::getUserId());
        $this->assign("vipInfo", $vipInfo);

        $this->displayEx(__FUNCTION__);
    }


    /**
     * 进入应用的首页推荐页
     * GET参数： userId        用户Id
     *           position      焦点位置
     * @brief: 首页 1）获取导航栏信息
     *               2）获取首页推荐的视频
     */
    public function homeV20UI()
    {
        $diffTime = time() - MasterManager::getEnterAppTime();
        LogUtils::info("IndexController begin _before_homeV20UI entry! GO,GO,GO,GO......" . $diffTime . '(秒)');
        $isCanOrder = 0;
        $this->renderHome(0, 'night-medicine', MainHomeManager::$CONFIG_MODEL_V7);
        $isCanOrder = MasterManager::isReportUserInfo();
        $deptID = parent::requestFilter("departmentId", "");
        $deptIndex = parent::requestFilter("departmentIndex", "0");
        $deptName = parent::requestFilter("departmentName", "请选择科室");
        $scrollTop = parent::requestFilter("scrollTop", "0");
        $P2PScrollTop = parent::requestFilter("P2PScrollTop", "0");
        $pageCurrent = parent::requestFilter("pageCurrent", "1");
        $this->assign("scrollTop", $scrollTop);
        $this->assign("P2PScrollTop", $P2PScrollTop);
        $this->assign("pageCurrent", $pageCurrent);
        $this->assign("departmentId", $deptID);
        $this->assign("departmentIndex", $deptIndex);
        $this->assign("departmentName", $deptName);
        $this->assign("lmp", MasterManager::getEnterPosition());

        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign("pluginMofangAppName", PLUGIN_VIDEO_APP_NAME);
        $this->assign('isCanOrder', $isCanOrder);
        LogUtils::info("MainController display homeV20UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 进入应用的首页推荐页
     * GET参数： userId        用户Id
     *           position      焦点位置
     * @brief: 首页 1）获取导航栏信息
     *               2）获取首页推荐的视频
     */
    public function homeV21UI()
    {
        LogUtils::info("MainController homeV21UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(0, 'night-medicine', MainHomeManager::$CONFIG_MODEL_V7);

        $deptID = parent::requestFilter("departmentId", "");
        $deptName = parent::requestFilter("departmentName", "请选择科室");
        $scrollTop = parent::requestFilter("scrollTop", "0");
        $P2PScrollTop = parent::requestFilter("P2PScrollTop", "0");
        $pageCurrent = parent::requestFilter("pageCurrent", "1");
        $this->assign("scrollTop", $scrollTop);
        $this->assign("P2PScrollTop", $P2PScrollTop);
        $this->assign("pageCurrent", $pageCurrent);
        $this->assign("departmentId", $deptID);
        $this->assign("departmentName", $deptName);

        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        LogUtils::info("MainController display homeV21UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 进入应用的首页推荐页
     * GET参数： userId        用户Id
     *           position      焦点位置
     * @brief: 首页 1）获取导航栏信息
     *               2）获取首页推荐的视频
     */
    public function homeV22UI()
    {
        $renderParamsArray = $this->initCommonRender();

        LogUtils::info("MainController homeV22UI begin entry! GO,GO,GO,GO......");
        $this->renderHome(0, 'night-medicine', MainHomeManager::$CONFIG_MODEL_V7);

        $areaCode = $renderParamsArray['areaCode'];
        $enterPosition = $renderParamsArray['enterPosition'];

        $pageConfigObj = MainHomeManager::getPageDataForModelV13($areaCode, 'hd', $enterPosition);
        $bgImageArray = $pageConfigObj->bgImageArray;
        $this->assign('themePicture', json_encode($bgImageArray));

        $deptID = parent::requestFilter("departmentId", "");
        $deptIndex = parent::requestFilter("departmentIndex", "0");
        $deptName = parent::requestFilter("departmentName", "请选择科室");
        $tabScroll = parent::requestFilter("tabScroll", "100");
        $pageCurrent = parent::requestFilter("pageCurrent", "1");
        $this->assign("tabScroll", $tabScroll);
        $this->assign("pageCurrent", $pageCurrent);
        $this->assign("departmentId", $deptID);
        $this->assign("departmentIndex", $deptIndex);
        $this->assign("departmentName", $deptName);

        //获取专辑列表
        $allAlbum = AlbumAPI::getAllAlbum(AlbumAPI::$UI_ALBUM_TYPE, AlbumAPI::$ALL_VIDEO_PROGRAM_TYPE, FIRST_PAGE, PHP_INT_MAX, AlbumAPI::$ALBUM_ORDER_RULE_BY_TIME);
        $this->assign("albumList", json_encode($allAlbum));

        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

        LogUtils::info("MainController display homeV22UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 导航跳转
     */
    public function menuTabV7UI()
    {
        LogUtils::info("MainController menuTabV7UI begin entry! GO,GO,GO,GO......");
        // 跳转页面索引
        $pageIndex = parent::getFilter('pageIndex', 1);
        $this->renderHome($pageIndex, 'bottom-left-link1', MainHomeManager::$CONFIG_MODEL_V7, 2);

        $this->assign('pageIndex', $pageIndex);
        LogUtils::info("MainController display menuTabV7UI! GO,GO,GO,GO......");
        $navigateInfo = SystemAPI::getNavigationInfo();
        $tabName = [];
        if ($navigateInfo != null && is_object($navigateInfo) && is_array($navigateInfo->data)) {
            foreach ($navigateInfo->data as $item) $tabName[] = $item->navigate_name;
        }

        $this->assign('tabName', json_encode($tabName));

        $this->displayEx(__FUNCTION__);

    }

    /**
     * @Brief:此函数用于处理保健模块
     */
    public function healthCareV7UI()
    {
        LogUtils::info("MainController healthCareV7UI begin entry! GO,GO,GO,GO......");
        $pageIndex = parent::getFilter('pageIndex', 5);
        $this->renderHome($pageIndex, 'videoTv', MainHomeManager::$CONFIG_MODEL_V7, 2);
        LogUtils::info("MainController display healthCareV7UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 夜间药房跳转
     */
    public function nightMedicineV7UI()
    {
        LogUtils::info("MainController nightMedicineV7UI begin entry! GO,GO,GO,GO......");
        //上报模块访问界面
        StatManager::uploadAccessModule();
        $this->initCommonRender();
        // 获取区域列表
        $areaList = MainHomeManager::loadAreaList();
        $this->assign('areaList', json_encode($areaList));
        LogUtils::info("MainController display nightMedicineV7UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 预约挂号
     */
    public function orderRegisterV7UI()
    {
        LogUtils::info("MainController orderRegisterV7UI begin entry! GO,GO,GO,GO......");
        //上报模块访问界面
        StatManager::uploadAccessModule();
        $this->initCommonRender();
        LogUtils::info("MainController display orderRegisterV7UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }


    /**
     * 三级页面跳转
     */
    public function MenuTabLevelThreeV7UI()
    {
        LogUtils::info("MainController MenuTabLevelThreeV7UI begin entry! GO,GO,GO,GO......");
        $classifyId = parent::getFilter('classifyId', 5);
        $this->renderHome($classifyId, 'video-link-0', MainHomeManager::$CONFIG_MODEL_V7, 3);

        $homeTabIndex = parent::getFilter('homeTabIndex', 1);
        $currentTabIndex = parent::getFilter('currentTabIndex', 0);
        $modelType = parent::getFilter('modelType', 0);
        $modelTitle = parent::getFilter('modelTitle');
        $pageCurrent = parent::getFilter('pageCurrent', 1);
        $this->assign('homeTabIndex', $homeTabIndex);
        $this->assign('currentTabIndex', $currentTabIndex);
        $this->assign('pageCurrent', $pageCurrent);
        $this->assign('modelType', $modelType);
        $this->assign('modelTitle', $modelTitle);
        LogUtils::info("MainController display MenuTabLevelThreeV7UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 贵州广电首页
     */
    public function homeV10UI()
    {
        LogUtils::info("MainController homeV10UI begin entry! GO,GO,GO,GO......");
        // 初始化 [首页] 公共渲染
        $classifyId = parent::getFilter('classifyId', CLASSIFY_DEFAULT);
        $this->renderHome($classifyId, '', MainHomeManager::$CONFIG_MODEL_V10);
        // 判断是否第一次进入页面
        $firstHandle = FirstManager::getFHandle(FirstManager::$F_HOME);
        // 获取vip信息
        $vipInfo = UserManager::getVipInfo();

        $this->assign("firstHandle", $firstHandle);
        $this->assign("vipInfo", $vipInfo);

        $this->assign('epgInfoMap', json_encode(MasterManager::getEPGInfoMap()));
        LogUtils::info("MainController display homeV10UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：1
     */
    public function homeTab1V10UI()
    {
        LogUtils::info("MainController homeTab1V10UI begin entry! GO,GO,GO,GO......");
        $this->renderHomeTabV10(CLASSIFY_VIDEO_1, FirstManager::$F_APPOINTMENT);

        $scrollTop = parent::getFilter('scrollTop', 0);
        $page = parent::getFilter('page', 1);
        $region = parent::getFilter('region', -1);
        // 获取默认预约挂号医院列表
        $areaId = parent::getFilter('areaId');

        $this->assign("scrollTop", $scrollTop);
        $this->assign("page", $page);
        $this->assign("region", $region);
        $this->assign("areaId", $areaId);
        $this->assign("guahaoUrl", SERVER_GUAHAO);
        LogUtils::info("MainController display homeTab1V10UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：2
     */
    public function homeTab2V10UI()
    {
        LogUtils::info("MainController homeTab2V10UI begin entry! GO,GO,GO,GO......");
        $this->renderHomeTabV10(CLASSIFY_TAB_2, FirstManager::$F_HEALTH_VIDEO);
        LogUtils::info("MainController display homeTab2V10UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：3
     */
    public function homeTab3V10UI()
    {
        LogUtils::info("MainController homeTab3V10UI begin entry! GO,GO,GO,GO......");
        // 初始化首页公共渲染
        $this->renderHomeTabV10(CLASSIFY_TAB_3, FirstManager::$F_P2P);

        $deptID = parent::requestFilter("departmentId", "");
        $deptIndex = parent::requestFilter("departmentIndex", "0");
        $deptName = parent::requestFilter("departmentName", "请选择科室");
        $scrollTop = parent::requestFilter("scrollTop", "0");
        $P2PScrollTop = parent::requestFilter("P2PScrollTop", "0");
        $pageCurrent = parent::requestFilter("pageCurrent", "1");
        $focusIndex = parent::requestFilter("focusIndex", "nav-btn-4");
        $this->assign("scrollTop", $scrollTop);
        $this->assign("P2PScrollTop", $P2PScrollTop);
        $this->assign("pageCurrent", $pageCurrent);
        $this->assign("focusIndex", $focusIndex);
        $this->assign("departmentId", $deptID);
        $this->assign("departmentIndex", $deptIndex);
        $this->assign("departmentName", $deptName);

        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        LogUtils::info("MainController display homeTab3V10UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：4
     */
    public function homeTab4V10UI()
    {
        LogUtils::info("MainController homeTab4V10UI begin entry! GO,GO,GO,GO......");
        // 初始化导航页通用参数
        $this->renderHomeTabV10(CLASSIFY_TAB_4, FirstManager::$F_FAMILY);
        LogUtils::info("MainController display homeTab4V10UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 首页导航栏【模式13】
     * 支持视频问诊插件
     * 导航栏位置：0
     */
    public function homeV13UI()
    {
        LogUtils::info("MainController homeV13UI begin entry! GO,GO,GO,GO......");
        // 上报用户访问记录
        StatManager::uploadAccessModule();
        // 公共参数获取
        $renderParamsArray = $this->initCommonRender();
        $accountId = $renderParamsArray['accountId'];
        $userId = $renderParamsArray['userId'];
        $areaCode = $renderParamsArray['areaCode'];
        $platformType = $renderParamsArray['platformType'];
        $enterPosition = $renderParamsArray['enterPosition'];
        $stbModel = $renderParamsArray['stbModel'];
        $carrierId = CARRIER_ID;
        $isCanOrder = 0;

        // 进入来源
        $fromId = parent::getFilter('fromId', self::DEFAULT_FROM_ID);
        $this->assign('fromId', $fromId);
        $this->assign('classifyId', CLASSIFY_DEFAULT);

        $scrollDis = parent::getFilter('scrollDis', '');
        $this->assign('scrollDis', $scrollDis);

        $position = parent::getFilter('position', '');
        $this->assign('position', $position);

        // 默认焦点
        $focusId = parent::getFilter('focusId', self::DEFAULT_FOCUS_ID);
        $this->assign('focusId', $focusId);

        //是否是联合活动进入
        $isJoinActivit = parent::getFilter('isJoinActivit',0);
        if($isJoinActivit == 1){
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $epgInfoMap['isJoinActivit'] = $isJoinActivit;
            MasterManager::setEPGInfoMap($epgInfoMap);
        }
        if($isJoinActivit == 0 || $isJoinActivit == ""){
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $isJoinActivit = $epgInfoMap['isJoinActivit'];
        }
        $this->assign('isJoinActivit', $isJoinActivit);


        // 获取配置相关数据
        $pageConfigObj = MainHomeManager::getPageDataForModelV13($areaCode, 'hd', $enterPosition);
        // 加载首页推荐配置信息
        $homePageConfig = $pageConfigObj->homePageConfig;
        $this->assign('homeConfigInfo', json_encode($pageConfigObj->pageConfig));

        // 首页背景图
        $bgImageArray = $pageConfigObj->bgImageArray;
        $this->assign('themePicture', $bgImageArray[CLASSIFY_TAB_1]);
        // 各导航页的图片背景
        $this->assign("tabBg", json_encode(self::getTabInfo($bgImageArray, $carrierId, $userId)));
        // 导航栏配置信息
        $this->assign('navigateInfo', json_encode($pageConfigObj->navigationBar->navigationImgs));
        // 推荐位视频信息
        $this->assign('dataList', $homePageConfig->recommendVideoList);
        // 轮播视频信息
        $this->assign('homePollVideoList', json_encode($homePageConfig->videoCarouseObj));
        // 首页1号推荐位参数信息
        $this->assign("positionList", json_encode($homePageConfig->dataOfPosition1));
        // 所有推荐位数据
        $this->assign('entryList', json_encode($homePageConfig->recommendPositionList));
        // 跑马灯内容信息
//         $this->assign('marqueeText',$pageConfigObj->marqueeContent);

        // 导航页是否显示新手引导信息
        if (CARRIER_ID == CARRIER_ID_CHINAUNICOM) { // 中国联通暂时屏蔽新手指导，为减少网络接口请求，故构造静态数据
            $noviceGuideInfo = ['tab0' => 0, 'tab1' => 0, 'tab2' => 0, 'tab3' => 0, 'tab4' => 0,];
            $this->assign("helpTabInfo", json_encode($noviceGuideInfo));
            $isCanOrder = MasterManager::isReportUserInfo();
        } else {
            $this->assign("helpTabInfo", json_encode(self::getHelpTabInfo($userId)));
        }
        // 用户设置的皮肤信息
        $skin = SystemManager::loadUserSkin();
        $this->assign("skin", json_encode($skin));

        // 视频点击播放排行榜
        $this->assign("videoPlayRank", json_encode($pageConfigObj->videoPlayRank));
        // 视频栏目
        $this->assign("videoClass", json_encode($pageConfigObj->firstLevelClassVideo));
        // 获取专辑列表
        $this->assign("albumList", json_encode($pageConfigObj->allAlbum));
        // 获取最近观看的图文专辑
        $latestAlbumInfo = ActivityManager::queryStoreData('EPG-LWS-LATEST-AlBUMINFO-' . $carrierId . '-' . $userId);
        $this->assign("latestAlbumInfo", $latestAlbumInfo);
        // 获取最近播放的视频
        $latestVideoInfo = ActivityManager::queryStoreData('EPG-LWS-LATEST-VIDEOINFO-' . $carrierId . '-' . $userId);
        $this->assign("latestVideoInfo", $latestVideoInfo);

        /************************* 问诊相关参数 - 开始 ****************************/
        // 互联网医院访问接口地址
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        // 科室Id
        $deptId = parent::getFilter('deptId', "");
        $this->assign("deptId", $deptId);
        // 医生列表页数
        $page = parent::getFilter('page', FIRST_PAGE);
        $this->assign("page", $page);
        // 视频问诊，需要配置参数
        $this->assign("checkTime", date("Y-m-d H:i:s"));
        // 是否可以使用问诊功能
        $this->assign("accessInquiryInfo11", json_encode(Utils::canAccessInquiry($stbModel)));
        /************************* 问诊相关参数 - 结束 ****************************/

        // 登录ID
        $this->assign("loginId", MasterManager::getLoginId());
        // 最近播放的图文专辑
        $this->assign("latestAlbumInfo", $latestAlbumInfo);
        // 最近播放的视频信息
        $this->assign("latestVideoInfo", $latestVideoInfo);
        $skin = SystemManager::getUserSkin();
        $this->assign("skin", json_encode($skin));
        if (MasterManager::getCarrierId() == CARRIER_ID_CHONGQINGDX) {
            $EPGInfoMap = MasterManager::getEPGInfoMap();
            $this->assign("partner", $EPGInfoMap['partner']);
            $this->assign("serverPath", $EPGInfoMap['serverPath']);
        } else if (MasterManager::getCarrierId() == CARRIER_ID_GUANGDONGGD_NEW) {
            $EPGInfoMap = MasterManager::getEPGInfoMap();
            $this->assign("client", $EPGInfoMap['client']);
            $this->assign("regionCode", $EPGInfoMap['caRegionCode']);
            $this->assign("userType", $EPGInfoMap['userType']);
            $this->assign('VIDEO_AUTH_URL', VIDEO_AUTH_URL);
            $this->assign('REQUEST_PLAY', REQUEST_PLAY);
            $this->assign('GET_VIDEO_INFO', GET_VIDEO_INFO);
            $this->assign('START_PLAY', START_PLAY);
            $this->assign('PAUSE_PLAY', PAUSE_PLAY);
        }
        // 用户是否是自动订购用户
        $this->assign('autoOrder', MasterManager::getAutoOrderFlag());
        // 促订规则
        $promoteOrderConfig = $this->getPromoteOrderConfig();
        $this->assign("payMethod", json_encode($promoteOrderConfig));

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $playUrl = isset($epgInfoMap["VAStoEPG"]) ? $epgInfoMap["VAStoEPG"] : "";
        LogUtils::info("homeV13UI playUrl:" . $playUrl);
        $this->assign("domainUrl", $playUrl);
        if (CARRIER_ID == CARRIER_ID_CHONGQINGDX) { // 重庆电信
            $this->assign("partner", $epgInfoMap['partner']);
            $this->assign("serverPath", $epgInfoMap['serverPath']);
        }
        // 中国联通河南地区童锁配置
        $this->assign("payLockStatus", self::setSafeLockStatus($accountId, $areaCode));
        $this->assign("isCanOrder", $isCanOrder);

        $setPageSizeState = 0; // 前端是否需要动态设置页面大小属性，中国联通比较特殊，需要设置page-view-size来控制显示高标清
        $ChinaUnicomCarriers = [CARRIER_ID_CHINAUNICOM/* 食乐汇epg */, CARRIER_ID_CHINAUNICOM_MOFANG/* 启生魔方epg */, CARRIER_ID_CHINAUNICOM_MEETLIFE/* 遇见生活epg */,
            CARRIER_ID_LDLEGEND/* 乐动创奇epg */];
        if (in_array(CARRIER_ID, $ChinaUnicomCarriers)) { // 运行在中国联通盒子
            $setPageSizeState = 1;
        }
        $this->assign("setPageSizeState", $setPageSizeState);

        // 是否从使用易视腾鉴权计费接口的入口进入（广东移动APK融合包）
        $this->assign("isEnterFromYsten", MasterManager::getEnterFromYsten());

        LogUtils::info("MainController display homeV13UI! GO,GO,GO,GO......");
        $this->displayEx(__FUNCTION__);
    }

    /**************************************通用渲染区域**************************************************/
    /**
     * 主页通用 -- 模式1
     * @param $defaultClassifyId
     * @param $defaultFocusId
     * @param string $configModel
     * @param int $pageLevel
     */
    private function renderHome($defaultClassifyId, $defaultFocusId = '', $configModel = '', $pageLevel = 1)
    {
        // 导航栏位置标识
        $classifyId = (int)parent::getFilter('classifyId', (int)$defaultClassifyId);
        // 进入来源
        $fromId = parent::getFilter('fromId', 0);
        // 默认焦点
        $focusIndex = parent::getFilter('focusIndex', $defaultFocusId);

        // 预先加载公共信息
        $navigationId = $classifyId + 1;
        if ($configModel == MainHomeManager::$CONFIG_MODEL_V7) {
            $pageConfig = MainHomeManager::loadHomePageConfig($configModel, $classifyId);
        } else {
            $pageConfig = MainHomeManager::loadHomePageConfig($configModel);
        }

        // 加载首页推荐配置信息
        $configInfo = $pageConfig->recommend;

        $this->assign('navigateInfo', $pageConfig->navigationBar);

        // 传递参数到页面前需要的特殊处理
        $this->handleRecommendDiff($pageConfig, $navigationId, $configModel);

        $isLoadHomePage = $navigationId == 1
            || ($configModel == MainHomeManager::$CONFIG_MODEL_V13) /* V13的加载模式 */
            || ($configModel == MainHomeManager::$CONFIG_MODEL_V7 /* V7的加载模式 */ && (($pageLevel == 2 && $navigationId == 6) /* 二级页面保健模块 */ || $pageLevel == 3 /*三级页面*/));

        if ($isLoadHomePage) { // 首页模式加载,瀑布流模式都需要使用首页模式
            // 推荐位视频信息
            $this->assign('dataList', $configInfo->data);
            // 轮播视频信息
            $this->assign('homePollVideoList', json_encode($configInfo->homePollVideoList));
            // 视频问诊，需要配置参数
            $this->assign("positionList", json_encode($configInfo->homeConfigInfo));
            // 所有推荐位数据
            $this->assign('entryList', json_encode($configInfo->entryList));
            // 首页背景图
            $this->assign('themePicture', $pageConfig->bgImage);
            $this->assign('themeNoPlay', SystemManager::getEpgThemePicture(3));

            if ($configModel == MainHomeManager::$CONFIG_MODEL_V7 && $pageLevel == 3) { // V7模式三级页面
                if ($classifyId == 5) {
                    $this->assign('navData', $configInfo->data[7]);
                } else {
                    $this->assign('navData', $configInfo->data[5]);
                }
            }
        } else { // 导航页模式加载
            // 加载导航页
            $navRecommendConfig = MainHomeManager::loadNavRecommendConfig($classifyId, $configInfo->entryList, $configModel);
            $configInfo->data = $navRecommendConfig;

            $bgImage = SystemManager::getEpgThemePicture($navigationId);
            // 推荐位视频信息
            $this->assign('dataList', $navRecommendConfig);
            // 导航页背景图
            $this->assign('themePicture', $bgImage);
            // 导航栏名称
            $this->assign('homeTabNames', $pageConfig->navigationNames);

            if ($configModel == MainHomeManager::$CONFIG_MODEL_V3) {
                $navigateModelInfo = MainHomeManager::loadNavigationModelInfo($navigationId); //加载导航栏信息
                //渲染页面
                $this->assign("navigateModelInfo", $navigateModelInfo);
                $this->assign("classifyTitle", $pageConfig->navigationNames[$classifyId]);
            }
        }

        // TODO 待前端配合修改
        $this->assign('homeConfigInfo', json_encode($pageConfig->originalRecommend));

        // 上报用户信息模块
        if ($configModel == MainHomeManager::$CONFIG_MODEL_V7 && $pageLevel == 2) {
            StatManager::uploadAccessModule('', $classifyId);
        } else {
            StatManager::uploadAccessModule();
        }

        $this->initCommonRender();  // 初始化通用渲染
        $this->assign('fromId', $fromId);
        $this->assign('classifyId', $classifyId);
        $this->assign('marqueeText', $pageConfig->marquee);

        $this->assign('focusIndex', $focusIndex);

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $playUrl = isset($epgInfoMap["VAStoEPG"]) ? $epgInfoMap["VAStoEPG"] : "";
        $this->assign("domainUrl", $playUrl);
        $this->assign('autoOrder', MasterManager::getAutoOrderFlag());  // 用户是否是自动订购用户
    }

    private function handleRecommendDiff($pageConfig, $navigationId, $configModel)
    {
        $configInfo = $pageConfig->recommend;
        switch ($configModel) {
            case MainHomeManager::$CONFIG_MODEL_V7:
                if ($navigationId == 6) { // 保健模块
                    $configInfo->homePollVideoList = VideoManager::sliceVideoList($configInfo->homePollVideoList, 2, 2);
                } else {
                    switch (MasterManager::getCarrierId()) {
                        case CARRIER_ID_QINGHAIDX:
                            $configInfo->homePollVideoList = VideoManager::sliceVideoList($configInfo->homePollVideoList, 0, 2);
                            break;
                        case CARRIER_ID_SICHUANGD:
                        case CARRIER_ID_NINGXIADX:
                            $configInfo->homePollVideoList = VideoManager::sliceVideoList($configInfo->homePollVideoList, 0, 1);
                            break;
                    }
                }
                break;
            case MainHomeManager::$CONFIG_MODEL_V10:
                $this->assign("pageInfo", $configInfo);
                break;
            case MainHomeManager::$CONFIG_MODEL_V13:
                $this->assign('navigateInfo', json_encode($pageConfig->navigationImgs));
                break;
        }
    }

    /**
     * 渲染导航栏
     * @param $defaultClassifyId
     * @param $defaultFirstId
     */
    private function renderHomeTabV10($defaultClassifyId, $defaultFirstId)
    {
        $classifyId = parent::getFilter('classifyId', $defaultClassifyId);
        // 初始化首页公共渲染
        $this->renderHome($classifyId, '', MainHomeManager::$CONFIG_MODEL_V10);
        //获取vip信息
        $vipInfo = UserManager::getVipInfo();
        //渲染页面参数
        $this->assign("vipInfo", $vipInfo);
        // 是否第一次访问
        $firstHandle = FirstManager::getFHandle($defaultFirstId);
        $this->assign("firstHandle", $firstHandle);
    }

    /**************************************功能模块区域**************************************************/

    /**设置童锁状态
     * @param $accountId
     * @param $areaCode
     * @return int|mixed
     */
    private function setSafeLockStatus($accountId, $areaCode)
    {
        // 显示童锁机制 - 需要查询童锁状态
        $payLockStatus = 0;
        if ((CARRIER_ID == CARRIER_ID_CHINAUNICOM || CARRIER_ID == CARRIER_ID_CHINAUNICOM_MOFANG) && $areaCode == "204") {
            $instance = OrderManager::getInstance();
            $payLockStatus = $instance->querySafeLockStatus($accountId, PRODUCT_ID . "@" . $areaCode);
        }
        return $payLockStatus;
    }

    /**
     * 获取各导航内容区的帮助图文参量
     * @param $userId
     * @return array
     */
    private function getHelpTabInfo($userId)
    {
        $noviceGuideInfo = json_decode(StoreAPI::queryStoreData(StoreAPI::$DATA_NOVICE_GUIDE . "_$userId"));
        $noviceGuideObj = json_decode($noviceGuideInfo->val, true);
        // 帮助图文参量
        return [
            'tab0' => $noviceGuideObj['tab-0'],
            'tab1' => $noviceGuideObj['tab-1'],
            'tab2' => $noviceGuideObj['tab-2'],
            'tab3' => $noviceGuideObj['tab-3'],
            'tab4' => $noviceGuideObj['tab-4'],
        ];
    }

    /**
     * 获取各导航内容区的背景图片
     * @param: $bgImageArray 各导航栏目下背景图
     * @param $carrierId
     * @param $userId
     * @return array
     */
    private function getTabInfo($themeImageArray, $carrierId, $userId)
    {
        // 查询用户的自动更新背景状态
        $storeData = ActivityManager::queryStoreData('EPG-LWS-AUTO-UPDATE-BG-' . $carrierId . '-' . $userId);
        $storeData = json_decode($storeData);
        $tabBg = array('tab1', 'tab2', 'tab3', 'tab4', 'tab5');
        if ($storeData->result != 0 && $storeData->val != 1 && !empty($themeImageArray)) {
            $tabBg = [
                'tab1' => $themeImageArray[0],
                'tab2' => $themeImageArray[1],
                'tab3' => $themeImageArray[2],
                'tab4' => $themeImageArray[3],
                'tab5' => $themeImageArray[4],
            ];
        }
        return $tabBg;
    }


    public function healthDetectV7UI()
    {

        //解析参数
        $userId = $_GET['userId'] ? $_GET['userId'] : MasterManager::getUserId();                                                              //用户Id
        $position = $_GET['position'];                                                          //位置信息
        $fromId = isset($_GET['fromId']) ? $_GET['fromId'] : 0;                                //进入来源
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "recommended-1";

        //$epgThemePicture = SystemManager::getEpgThemePictureOf(1); // 导航栏1（首页）的背景图片

        //获取缓存数据
        //$backEPGUrl = MasterManager::getIPTVPortalUrl();
        //LogUtils::info("#############> backEPGUrl : " . $backEPGUrl);

        //CWS获取配置信息
        $navigateInfo = MainHomeManager::loadNavigationInfo();                     //加载导航栏信息
        $configInfo = MainHomeManager::loadHomePageInfoV7(8);                          //加载首页推荐配置信息

        // 青海电信EPG，由于首页与保健页都有轮播视频，但管理后台只能配置一处轮播（就是说，配置了轮播视频，
        // 首页与保健页拿到的轮播视频信息是一样的），所以就要进行拆分（一部分给首页、一部分给保健）。
//        $homePollVideoList = VideoManager::sliceVideoList($configInfo->homePollVideoList, 0, 2);

        $isVip = MasterManager::isVIPUser() ? MasterManager::isVIPUser() : 0; //获取是否退订 $epgVip==0为未退订
        LogUtils::info(">>>>>>>>>>>>>>>>>>>>>>>>>>##user [" . $userId . "] isVip= " . $isVip);

        $epgInfoMap = MasterManager::getEPGInfoMap();         //获取返回EPG地址
        $playUrl = $epgInfoMap["VAStoEPG"];

        // 滚动消息字幕
        //$marqueeText = SystemManager::getMarqueeText();

        //上报模块访问界面
        StatManager::uploadAccessModule($userId);

        //获取vip信息
        $vipInfo = UserManager::queryVipInfo(MasterManager::getUserId());

        //渲染页面参数
        $this->initCommonRender();
        $this->assign("domainUrl", $playUrl);
        $this->assign('navigateInfo', $navigateInfo);
        $this->assign('isVip', $isVip);
        $this->assign('fromId', $fromId);
        //$this->assign('backEPGUrl', $backEPGUrl);
        $this->assign('dataList', $configInfo->data);
        $this->assign('classifyId', 1); // 表示首页
        $this->assign('focusIndex', $focusIndex);
        $this->assign('position', $position);
        //$this->assign('marqueeText', $marqueeText);
        $this->assign('positionTwoConfig', MasterManager::getPositionTwoConfig());
        $this->assign('password', PASSWORD);
        //$this->assign('themePicture', $epgThemePicture);
        $this->assign('autoOrder', MasterManager::getAutoOrderFlag());
        $this->assign("vipInfo", $vipInfo);

        $this->displayEx(__FUNCTION__);
    }
}





