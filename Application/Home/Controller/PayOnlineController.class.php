<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS2.0
// +----------------------------------------------------------------------
// | [在线商城]-控制器
// +----------------------------------------------------------------------


namespace Home\Controller;

use Home\Model\Display\DisplayManager;

class PayOnlineController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function payOnlineV1UI()
    {
        $page = parent::getFilter('page', 0);

        $this->assign("focusId", $_GET['focusId']);
        $this->assign("page", $page);
        $this->initCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

    public function productDetailV1UI()
    {
        $this->assign("focusId", $_GET['focusId']);
        $this->initCommonRender();

        // 解析传递参数

        $this->displayEx(__FUNCTION__);
    }

}