<?php
/**
 * Created by PhpStorm.
 * User: mcc
 * Date: 2018/10/17
 * Time: 下午4:12
 */

namespace Home\Controller;


use Home\Model\Display\DisplayManager;
use Home\Model\MainHome\MainHomeManager;

class HistoryPlayController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function historyPlayV1UI()
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

        $focusId = parent::requestFilter("focusId");
        $page = parent::requestFilter("page", 1);

        $this->assign("focusId", $focusId);
        $this->assign("page", $page);

        $this->displayEx(__FUNCTION__);
    }
}