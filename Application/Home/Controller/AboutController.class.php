<?php
/**
 * Created by PhpStorm.
 * User: mcc
 * Date: 2018/10/17
 * Time: 下午4:12
 */

namespace Home\Controller;


use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class AboutController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__,array());
    }

    public function aboutV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }

    public function agreementV1UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }
}