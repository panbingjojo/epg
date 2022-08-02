<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/10
 * Time: 0:43
 */

namespace Home\Controller;

use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;


/**
 * 主页控制器
 * Class MainController
 * @package Home\Controller
 */
class UnclassfieldController extends BaseController
{

    /**
     * 页面配置
     * @return array
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__,array());
    }



    /**
     * 夜间药房跳转
     */
    public function nightPharmacyV13UI()
    {
        $userId = $_GET['userId'] ? $_GET['userId'] : MasterManager::getUserId();                                                               //用户Id

        //上报模块访问界面
        StatManager::uploadAccessModule($userId);

        $this->initCommonRender();

        $this->assign('userId', $userId);

        $this->displayEx(__FUNCTION__);

    }
}


