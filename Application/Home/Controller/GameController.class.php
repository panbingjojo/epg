<?php

namespace Home\Controller;

use Home\Model\Display\DisplayManager;

class GameController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function gameDetailsUI()
    {
        $this->initCommonRender();

        $gameId = parent::requestFilter("gameId");
        $this->assign("gameId", $gameId);

        $this->displayEx(__FUNCTION__);
    }


}