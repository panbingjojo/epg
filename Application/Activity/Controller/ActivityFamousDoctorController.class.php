<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2018/10/17 15:55                                               |
 * +----------------------------------------------------------------------+
 */

namespace Activity\Controller;

use Home\Controller\BaseController;
use Home\Model\Resource\ResManager;

class ActivityFamousDoctorController extends BaseController
{

    private $currIndex = 0;//选中的医生
    private $focusIndex = "order";//默认焦点在规则按钮上

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array(
            "indexUI" => "FamousDoctor/index",
        );
    }

    public function indexUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $this->focusIndex = parent::getFilter("focusId", $this->focusIndex);
        $this->currIndex = parent::getFilter("currIndex", $this->currIndex);

        $marqueeText = ResManager::getConstString("GLOBAL_MARQUEE_TEXT");
        $this->assign("focusId", $this->focusIndex);
        $this->assign("currIndex", $this->currIndex);
        $this->assign("marqueeText", "$marqueeText");

        $this->displayEx(__FUNCTION__);
    }


}