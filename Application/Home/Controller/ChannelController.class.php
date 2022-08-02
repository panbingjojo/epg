<?php
// 本类由系统自动生成，仅供测试用途
namespace Home\Controller;

use Home\Model\Activity\ActivityManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\CollectAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Common\SystemManager;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\Stats\StatManager;


class ChannelController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    /**
     * 更多视频页 视图1
     */
    public function indexV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $userId = parent::getFilter('userId', MasterManager::getUserId());   // 用户Id
        $focusIndex = parent::getFilter("focusIndex", "focus-1-1-border");
        $fromId = parent::getFilter('fromId', 0);
        $page = parent::getFilter('page', 1);
        $modeType = parent::getFilter('modeType');
        $modeTitle = parent::getFilter('modeTitle');
        $position = parent::getFilter('position', "left");
        $currentPage = parent::getFilter('page', 0);

        $modeType = is_numeric($modeType) ? $modeType : 1;
        LogUtils::info("ChannelController ---> modeTitle :" . $modeTitle);

        if ($userId != "" || empty($userId)) {
            $userId = MasterManager::getUserId();
        }

        $isVip = MasterManager::getUserIsVip();
        // 滚动消息字幕
        $marqueeText = SystemManager::getMarqueeText();

        // 上报用户数据
        StatManager::uploadAccessModule($userId);

        $this->assign("currentPage", $currentPage);
        $this->assign("focusIndex", $focusIndex);
        $this->assign("fromId", $fromId);
        $this->assign('isVip', $isVip);
        $this->assign('page', $page);
        $this->assign('position', $position);
        $this->assign('modeType', $modeType);
        $this->assign("modeTitle", $modeTitle);
        $this->assign('marqueeText', $marqueeText);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 视频集一级栏目
     */
    public function channelIndexV13UI()
    {
        $renderParamsArray = $this->initCommonRender();  // 初始化通用渲染
        $areaCode = $renderParamsArray['areaCode'];
        $platformType = $renderParamsArray['platformType'];
        $enterPosition = $renderParamsArray['enterPosition'];

        $pageConfigObj = MainHomeManager::getPageDataForModelV13($areaCode, 'hd', $enterPosition);
        // 加载首页推荐配置信息
        $bgImageArray = $pageConfigObj->bgImageArray;
        $this->assign('themePicture', $bgImageArray[CLASSIFY_TAB_1]);

        $isNew = 0;
        $modelType = $_GET['modelType'];
        $modelName = $_GET['modelName'];

        $pageConfig = MainHomeManager::loadHomePageConfig(MainHomeManager::$CONFIG_MODEL_V7,0);
        $this->assign('background', $pageConfig->bgImage);

        $isExitApp = $_GET['isExitApp'];
        $this->assign('isExitApp', $isExitApp);

        //贵州电信--健康专区使用新栏目
        if(CARRIER_ID==CARRIER_ID_GUIZHOUDX){
            $isNew = 1;
        }
        // 获取二级视频分类
        $secondClass = VideoAPI::getVideoClass($modelType,$isNew);

        $all = new \stdClass();
        $all->model_type = $modelType;
        $all->model_name = "全部";
        if ($secondClass->result != 0) {
            $secondClass->data = array($all);
        } else {
            array_unshift($secondClass->data, $all);
        }

        $this->assign("firstModelType", $modelType);
        $this->assign("modelName", $modelName);
        $this->assign("secondClass", json_encode($secondClass));

        // 焦点保持
        $keepNavFocusId = parent::requestFilter('keepNavFocusId', 'nav-0');
        $focusId = parent::requestFilter('focusId');
        $page = parent::requestFilter('page', 0);
        $navPage = parent::requestFilter('navPage', 0);
        $navIndex = parent::requestFilter('navIndex', 0);
        $navGroup = parent::requestFilter('navGroup', '');

        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('keepNavFocusId', $keepNavFocusId);
        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('navPage', $navPage);
        $this->assign('navIndex', $navIndex);
        $this->assign('navGroup', $navGroup);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 视频集二级栏目
     */
    public function secondChannelIndexV13UI()
    {
        $renderParamsArray = $this->initCommonRender();  // 初始化通用渲染
        $areaCode = $renderParamsArray['areaCode'];
        $enterPosition = $renderParamsArray['enterPosition'];

        $pageConfigObj = MainHomeManager::getPageDataForModelV13($areaCode, 'hd', $enterPosition);
        // 加载首页推荐配置信息
        $bgImageArray = $pageConfigObj->bgImageArray;
        $this->assign('themePicture', $bgImageArray[CLASSIFY_TAB_1]);

        $pageConfig = MainHomeManager::loadHomePageConfig(MainHomeManager::$CONFIG_MODEL_V7,0);
        $this->assign('background', $pageConfig->bgImage);

        $modelType = $_GET['modelType'];
        $modelName = $_GET['modelName'];
        $aliasName = parent::requestFilter('alias_name', 0);
        StatManager::uploadAccessModule(MasterManager::getUserId(), $aliasName);

        $this->assign("firstModelType", $modelType);
        $this->assign("modelName", $modelName);

        $isExitApp = $_GET['isExitApp'];
        $this->assign('isExitApp', $isExitApp);

        // 焦点保持
        $focusId = parent::requestFilter('focusId');
        $page = parent::requestFilter('page', 0);

        $this->assign('focusId', $focusId);
        $this->assign('page', $page);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 视频集
     * 注意：视频集里面不要配置一样的视频，如果sourceId相同，可能会影响上一集/下一集切换，记录播放历史等功能
     *       因为使用了sourceId进行了不同视频的比较
     */
    public function videoListV13UI()
    {
        $renderParamsArray = $this->initCommonRender();  // 初始化通用渲染
        $areaCode = $renderParamsArray['areaCode'];
        $platformType = $renderParamsArray['platformType'];
        $enterPosition = $renderParamsArray['enterPosition'];

        $pageConfigObj = MainHomeManager::getPageDataForModelV13($areaCode, 'hd', $enterPosition);
        // 加载首页推荐配置信息
        $bgImageArray = $pageConfigObj->bgImageArray;
        $this->assign('themePicture', $bgImageArray[CLASSIFY_TAB_1]);

        $pageConfig = MainHomeManager::loadHomePageConfig(MainHomeManager::$CONFIG_MODEL_V7,0);
        if(CARRIER_ID == CARRIER_ID_LDLEGEND){
            $bgImage = SystemManager::getEpgThemePicture(2);
            $pageConfig->bgImage = $bgImage;
        }
        $this->assign('background', $pageConfig->bgImage);

        $isExitApp = $_GET['isExitApp'];
        $this->assign('isExitApp', $isExitApp);
        
        // 获取视频集的详情
        $detail = VideoAPI::getAlbumDetail($_GET['subject_id']);
        // 获取收藏列表（专辑）
        $collectList = CollectAPI::getCollectListNew(2);
        $aliasName = parent::requestFilter('alias_name', 0);
        StatManager::uploadAccessModule(MasterManager::getUserId(), $aliasName);
        $isCollect = 0;
        if ($collectList['result'] == 0) {
            for ($i = 0; $i < count($collectList['list']); $i++) {
                if ($collectList['list'][$i]['subject_id'] == $_GET['subject_id']) {
                    $isCollect = 1;
                    break;
                }
            }
        }
        // 获取这个视频集用户最后播放的历史进度
        $latestVideoInfo = ActivityManager::queryStoreData('EPG-LWS-LATEST-VIDEOINFO-VIDEOSET-' .
            $_GET['subject_id'] . '-' . MasterManager::getCarrierId() . '-' . MasterManager::getUserId());
        // 最近播放的视频信息
        $this->assign("latestVideoInfo", $latestVideoInfo);

        $this->assign("isCollect", $isCollect);

        $this->assign("detail", $detail);

        // 第三方播放器地址（江苏电信，使用局方播放器）
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $playUrl = $epgInfoMap["VAStoEPG"];
        $this->assign("domainUrl", $playUrl);

        // 焦点保持
        $focusId = parent::requestFilter('focusId');
        $listPage = parent::requestFilter('listPage', 0);
        $tabPage = parent::requestFilter('tabPage', 0);
        $keepFocusId = parent::requestFilter('keepFocusId', 'tab-0');

        $prePointer = parent::requestFilter('prePointer', 0);
        $curPointer = parent::requestFilter('curPointer', 0);


        $this->assign('prePointer', $prePointer);
        $this->assign('curPointer', $curPointer);
        $this->assign('focusId', $focusId);
        $this->assign('listPage', $listPage);
        $this->assign('tabPage', $tabPage);
        $this->assign('keepFocusId', $keepFocusId);


        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('cwsWXServerUrl', CWS_WXSERVER_URL_OUT);

        // 是否配置小窗口播放
        $noSmallVideo = 0;
        $noSmallVideoCarriers = [CARRIER_ID_LIAONINGDX/* 辽宁电信 */,CARRIER_ID_HENANDX/* 河南电信 */,CARRIER_ID_GUANGDONGYD/* 广东移动 */,
            CARRIER_ID_GUANGDONGGD_NEW/* 广东广电 - 新版 */, CARRIER_ID_SHANXIDX/* 陕西电信 */,CARRIER_ID_JILIN_YD/* 吉林移动 */,
            CARRIER_ID_NEIMENGGU_DX/* 内蒙电信apk */,CARRIER_ID_GUANGXI_YD/* 广西移动 */,CARRIER_ID_NINGXIA_YD/* 宁夏移动 */];
        if(in_array(CARRIER_ID,$noSmallVideoCarriers)) {
            $noSmallVideo = 1;
        }
        $this->assign('noSmallVideo', $noSmallVideo);

        // 是否隐视频集中藏【一键问医】按钮
        $isShowAskDoctor = true;
        $hideAskDoctorArr = [CARRIER_ID_JIANGSUDX/* 江苏电信EPG */, CARRIER_ID_NINGXIAGD/* 宁夏广电EPG */,
            CARRIER_ID_GANSUDX/* 甘肃电信EPG */, CARRIER_ID_GUANGXIGD/* 广西广电EPG */];
        if (in_array(MasterManager::getCarrierId(), $hideAskDoctorArr)) {
            $isShowAskDoctor = false;
        }
        $this->assign('isShowAskDoctor', $isShowAskDoctor);

        $this->displayEx(__FUNCTION__);
    }
}