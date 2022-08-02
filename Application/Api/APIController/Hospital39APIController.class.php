<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2019/4/2 14:17                                               |
 * +----------------------------------------------------------------------+
 */

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\Hospital39API;

class Hospital39APIController extends BaseController
{

    public function config()
    {
    }

    /**
     * 获取首页模块轮播视频
     */
    function getHomeVideoAction()
    {
        $ret = Hospital39API::getHomeVideo();
        $this->ajaxReturn($ret, "EVAL");
    }

    /**
     * 获取顶级专家信息
     */
    function getTopExpertAction()
    {
        $topExpertInfo = Hospital39API::getTopExpertInfo();
        $tempArr = json_decode($topExpertInfo, true);
        foreach ($tempArr["list"] as $key => $val) {
            $tempArr["list"][$key]["doc_class"] = $val["class"];
        }
        $this->ajaxReturn(json_encode($tempArr), "EVAL");
    }

    /**
     * 获取病例资料信息
     */
    function getCaseAction()
    {
        $caseInfo = Hospital39API::getCase();
        $this->ajaxReturn($caseInfo, "EVAL");
    }

}