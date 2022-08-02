<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/10
 * Time: 0:43
 */

namespace Home\Controller;

use Home\Model\Common\LogUtils;
use Home\Model\Common\SystemManager;
use Home\Model\Display\DisplayManager;


/**
 * 主页控制器
 * Class CustomizeModuleController
 * @package CustomizeModule\Controller
 */
class CustomizeModuleController extends BaseController
{

    const DEFAULT_FROM_ID = 0; // 默认进入来源标识
    const DEFAULT_FOCUS_ID = ""; // 默认焦点

    private $moduleId; //定制模块id

    /**
     * 页面配置
     * @return array
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array($this->moduleId));
    }
    /**************************************页面渲染区域 customizemoduleV1**************************************************/
    /**
     * 首页导航栏【模式1】
     * 普遍模式
     * 导航栏位置：0
     */


    public function customizeModuleV1UI()
    {
        $this->moduleId = parent::getFilter('moduleId', 'default');
        $moduleConfig = SystemManager::getCustomizeModuleConfig($this->moduleId);
        // 初始化通用渲染
        $this->initCommonRender();
        $modelId = parent::getFilter('modelId', "0");
        $page =  parent::getFilter('page', 0);
        $focusIndex = isset($_REQUEST['focusIndex']) ? $_REQUEST['focusIndex'] : "recommended-1";

        $this->assign("focusIndex", $focusIndex);
        $this->assign('moduleConfig', json_encode($moduleConfig));
        $this->assign("modelId", $modelId);
        $this->assign("page", $page);

        $this->displayEx(__FUNCTION__);
    }
}
