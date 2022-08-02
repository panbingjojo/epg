<?php
/**
 * Breif: 预约挂号控制器类，用于实现预约挂号的业务处理
 * Created by PhpStorm.
 * User: czy
 * Date: 2018-5-14
 * Time: 13:35
 */

namespace Home\Controller;

use Home\Model\Common\ServerAPI\Hospital39API;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class Hospital39Controller extends BaseController
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
     * 预约挂号界面
     */
    public function indexUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        // 第三方播放器地址
        $epgInfoMap = MasterManager::getEPGInfoMap();

        $this->assign('portalURL', $epgInfoMap["portalURL"]);
        $this->assign('cardId', $epgInfoMap["cardId"]);

        $this->displayEx(__FUNCTION__);
    }

    public function indexV10UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $homeVideoInfo = Hospital39API::getHomeVideo();
        $topExpertInfo = Hospital39API::getTopExpertInfo();
        $caseInfo = Hospital39API::getCase();

        $this->assign("homeVideoInfo", $homeVideoInfo);
        $this->assign("topExpertInfo", $topExpertInfo);
        $this->assign("caseInfo", json_decode($caseInfo));

        $this->displayEx(__FUNCTION__);
    }

    public function homeV10UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    public function consultV10UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    public function expertV10UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    public function guideV10UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    public function caseV10UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }


}