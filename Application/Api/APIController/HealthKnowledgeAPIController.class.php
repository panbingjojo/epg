<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [健康知识] 模块交互API
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/11/26 14:54
// +----------------------------------------------------------------------


namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\HealthKnowledgeApi;

class HealthKnowledgeAPIController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     * 拉取分类下的 [健康知识] 列表
     */
    public function getKnowledgeListAction()
    {
        $classId = isset($_REQUEST['class_id']) ? $_REQUEST['class_id'] : -1;
        $currentPage = isset($_REQUEST['current_page']) ? $_REQUEST['current_page'] : 1;
        $pageNum = isset($_REQUEST['page_num']) ? $_REQUEST['page_num'] : 6;
        $result = HealthKnowledgeApi::getListByClassId($classId, $currentPage, $pageNum);
        $this->ajaxReturn($result, 'EVAL');
    }

}