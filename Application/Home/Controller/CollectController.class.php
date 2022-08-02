<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |  我的收藏功能
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2017/11/29 13:42                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Controller;

use Home\Model\Common\SystemManager;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\Stats\StatManager;


class CollectController extends BaseController
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
     * 收藏页面 -- 视图1
     */
    public function indexV1UI()
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

        $fromId = parent::getFilter('fromId', 0); //进入来源
        $page = parent::getFilter('page', 1);
        $pageCurrent = parent::getFilter('pageCurrent', 1);
        $focusId = parent::getFilter('focusId');
        $currentTab = parent::getFilter('currentTab');
        $navIndex = parent::getFilter('navIndex', 0);

        // 滚动字幕
        $marqueeText = SystemManager::getMarqueeText();

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('fromId', $fromId);
        $this->assign('marqueeText', $marqueeText);
        $this->assign('page', $page);
        $this->assign('pageCurrent', $pageCurrent);
        $this->assign('focusId', $focusId);
        $this->assign('currentTab', $currentTab);
        $this->assign('navIndex', $navIndex);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('cws39HospitalUrl', CWS_EXPERT_URL_OUT);

        // 搜索页面是否显示【专家】按钮
        $isShowExpert = true;
        $hideExpertArr = [CARRIER_ID_GUANGXIGD/* 广西广电EPG */, CARRIER_ID_JIANGSUDX /* 江苏电信EPG */];
        if (in_array(MasterManager::getCarrierId(), $hideExpertArr)) {
            $isShowExpert = false;
        }
        $this->assign('isShowExpert', $isShowExpert);

        $this->displayEx(__FUNCTION__);
    }

    public function indexV21UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $fromId = parent::getFilter('fromId', 0); //进入来源
        $page = parent::getFilter('page', 1);
        $pageCurrent = parent::getFilter('pageCurrent', 1);
        $focusId = parent::getFilter('focusId');
        $navIndex = parent::getFilter('navIndex', 0);

        // 滚动字幕
        $marqueeText = SystemManager::getMarqueeText();

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('fromId', $fromId);
        $this->assign('marqueeText', $marqueeText);
        $this->assign('page', $page);
        $this->assign('pageCurrent', $pageCurrent);
        $this->assign('focusId', $focusId);
        $this->assign('navIndex', $navIndex);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('cws39HospitalUrl', CWS_EXPERT_URL_OUT);

        $this->displayEx(__FUNCTION__);
    }

}