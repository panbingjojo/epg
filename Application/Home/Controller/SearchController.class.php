<?php
/**
 * Breif: 搜索控制器类，用于实现搜索功能的业务处理
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017-10-20
 * Time: 13:35
 */

namespace Home\Controller;

use Home\Model\Common\SystemManager;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\Stats\StatManager;

class SearchController extends BaseController
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
     * 搜索页面。
     * V1-其它：搜索键盘全部显示在页面
     * V2：搜索键盘为 九宫格
     */
    public function searchUI()
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
        $this->assign('background', $pageConfig->bgImage);

        $userId = MasterManager::getUserId();


        //上报模块访问界面
        StatManager::uploadAccessModule($userId);

        $fromId = parent::requestFilter('fromId', 0); //进入来源
        $keyWords = parent::requestFilter('keyWords');
        $searchText = parent::requestFilter('searchText');
        $currentPage = parent::requestFilter('currentPage', 1); // 当前页码，默认为1页
        $pageCurrent = parent::requestFilter('pageCurrent', 1); // 当前页码，默认为1页
        $focusIndex = parent::requestFilter('focusIndex');//进入播放器前的焦点

        $focusId = parent::requestFilter('focusId');
        $page = parent::requestFilter('page', 0);
        $searchWord = parent::requestFilter('searchWord');
        $curSelectedTabId = parent::requestFilter('curSelectedTabId');

        $focusNav = parent::requestFilter('focusNav');
        // 滚动字幕
        $marqueeText = SystemManager::getMarqueeText();

        $this->assign("keyWords", $keyWords);
        $this->assign('fromId', $fromId);
        $this->assign('isReturn', $fromId);
        $this->assign('focusIndex', $focusIndex);
        $this->assign('currentPage', $currentPage);
        $this->assign('marqueeText', $marqueeText);
        $this->assign('marqueeText', $marqueeText);
        $this->assign('pageCurrent', $pageCurrent);
        $this->assign('searchText', $searchText);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('cws39HospitalUrl', CWS_EXPERT_URL_OUT);

        $this->assign('focusId', $focusId);
        $this->assign('page', $page);
        $this->assign('searchWord', $searchWord);
        $this->assign('curSelectedTabId', $curSelectedTabId);
        $this->assign('focusNav', $focusNav);

        // 搜索页面是否显示【专家】按钮
        $isShowExpert = true;
        $hideExpertArr = [CARRIER_ID_XINJIANGDX/* 新疆电信EPG */, CARRIER_ID_NINGXIA_YD/* 宁夏移动apk */,
            CARRIER_ID_GUANGXIGD/* 广西广电EPG */];
        if (in_array(MasterManager::getCarrierId(), $hideExpertArr)) {
            $isShowExpert = false;
        }
        $this->assign('isShowExpert', $isShowExpert);

        $this->displayEx(__FUNCTION__);
    }
}