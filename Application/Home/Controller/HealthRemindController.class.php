<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |健康提醒相关相关页面控制器
 * +----------------------------------------------------------------------+
 * | Author: lxh                                                         |
 * | Date:2022/01/05 18:43                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Controller;

use Home\Model\Common\ServerAPI\UserAPI;

class HealthRemindController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array(
            "healthRemindV1UI" => "HealthRemind/V1/HealthRemind",
        );
    }

    public function healthRemindV1UI()
    {
        // 初始化通用渲染
        $this->initCommonRender();
        $result = UserAPI::getCheckedPhone();
        $this->assign('checkedPhone', $result);
        $this->displayEx(__FUNCTION__);
    }
}