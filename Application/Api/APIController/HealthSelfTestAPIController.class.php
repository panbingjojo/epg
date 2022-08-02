<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2018/11/26 13:48                                               |
 * +----------------------------------------------------------------------+
 */

namespace Api\APIController;


use Home\Model\Common\ServerAPI\HealthSelfTestApi;
use Think\Controller;

class HealthSelfTestAPIController extends Controller
{
    function getClassifyListAction()
    {
        $classId = $_REQUEST["classId"];
        $ret = HealthSelfTestApi::getClassifyList($classId);
        $this->ajaxReturn($ret);
    }

    function getTopicListAction()
    {
        $classId = isset($_REQUEST["classId"]) ? $_REQUEST["classId"] : "";
        $pageCurrent = isset($_REQUEST["pageCurrent"]) ? $_REQUEST["pageCurrent"] : "";
        $pageTotal = isset($_REQUEST["pageTotal"]) ? $_REQUEST["pageTotal"] : "";
        $ret = HealthSelfTestApi::getTopicList($classId, $pageCurrent, $pageTotal);
        $this->ajaxReturn($ret);
    }

    function getThemeListAction()
    {
        $topicId = $_REQUEST["topicId"] ? $_REQUEST["topicId"] : "";
        $themeId = $_REQUEST["themeId"] ? $_REQUEST["themeId"] : "";
        $ret = HealthSelfTestApi::getThemeList($topicId, $themeId);
        $this->ajaxReturn($ret);
    }

    function getHealthResultAction()
    {
        $topicId = $_REQUEST["topicId"] ? $_REQUEST["topicId"] : "";
        $classId = isset($_REQUEST["classId"]) ? $_REQUEST["classId"] : "";
        $score = isset($_REQUEST["score"]) ? $_REQUEST["score"] : "";
        $ret = HealthSelfTestApi::getHealthResult($topicId, $classId, $score);
        $this->ajaxReturn($ret);
    }

}