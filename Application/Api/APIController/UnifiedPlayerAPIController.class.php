<?php

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\UnifiedPlayerAPI;

class UnifiedPlayerAPIController extends BaseController
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
     * 播放记录获取（青海地区）
     */
    public function getPlayRecordsAction()
    {
        $pageNumber = $_REQUEST['pageNumber'];
        $pageSize = $_REQUEST['pageSize'];
        $resultData = UnifiedPlayerAPI::getPlayRecords($pageNumber, $pageSize);
        $this->ajaxReturn($resultData);
    }

    /**
     * 新增收藏（青海地区）
     */
    public function addCollectionAction()
    {
        $contentCode = $_REQUEST['contentCode'];
        $resultData = UnifiedPlayerAPI::addCollection($contentCode);
        $this->ajaxReturn($resultData);
    }

    /**
     * 获取收藏列表（青海地区）
     */
    public function getCollectionsAction()
    {
        $pageNumber = $_REQUEST['pageNumber'];
//        $pageSize = isset($_REQUEST['pageSize']) ? $_REQUEST['pageSize'] : PHP_INT_MAX;
        $pageSize = isset($_REQUEST['pageSize']) ? $_REQUEST['pageSize'] : 2147483647;
        $resultData = UnifiedPlayerAPI::getCollections($pageNumber, $pageSize);
        $this->ajaxReturn($resultData);
    }

    /**
     * 删除收藏（青海地区）
     */
    public function deleteCollectionsAction()
    {
        $contentCodes = $_REQUEST['contentCodes'];
        $resultData = UnifiedPlayerAPI::deleteCollections($contentCodes);
        $this->ajaxReturn($resultData);
    }

    /**
     * 查询收藏状态（青海地区）
     */
    public function queryCollectionStatusAction()
    {
        $contentCode = $_REQUEST['contentCode'];
        $resultData = UnifiedPlayerAPI::queryCollectionStatus($contentCode);
        $this->ajaxReturn($resultData);
    }
}
