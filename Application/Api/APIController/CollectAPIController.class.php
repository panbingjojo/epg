<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/1
 * Time: 上午9:46
 */

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\CollectAPI;


class CollectAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /** 获取收藏列表 */
    public function getCollectListAction()
    {
        $data = CollectAPI::getCollectList();
        $this->ajaxReturn(json_encode($data),"EVAL");
    }

    /** 获取收藏列表 */
    public function getCollectListNewAction()
    {
        $data = CollectAPI::getCollectListNew($_REQUEST['item_type'],$_REQUEST['parent_model_type']);
        $this->ajaxReturn(json_encode($data),"EVAL");
    }

    /** 设置收藏状态
 * @throws \Think\Exception
 */
    public function setCollectStatusAction()
    {
        $returnStr = array(
            "result" => "-1"
        );
        $sourceID = $_REQUEST['source_id'];
        if (isset($_REQUEST['status'])) {
            $webData = CollectAPI::setCollectStatus($sourceID, $_REQUEST['status']);
            $returnStr["result"] = $webData["result"];
        }else{
            $itemId = isset($_REQUEST['itemId']) ? $_REQUEST['itemId'] : '';
            $collected = isset($_REQUEST['collectStatus']) ? $_REQUEST['collectStatus'] : '';
            $itemType = isset($_REQUEST['itemType']) ? $_REQUEST['itemType'] : '';
            $returnStr = CollectAPI::setCollectStatus($itemId, $collected, $itemType);
        }
        $this->ajaxReturn($returnStr);
    }

    /** 清空收藏记录
     * @throws \Think\Exception
     */
    public function clearCollectRecordAction()
    {
        $returnStr = array(
            "result" => "-1"
        );
        $webData = CollectAPI::setCollectStatus("-1", "1");
        $returnStr["result"] = $webData["result"];
        $this->ajaxReturn($returnStr);
    }

    /**
     * 视频/专辑的收藏和取消收藏
     */
    public function setCollectStatusNewAction()
    {
        $returnStr = array(
            "result" => "-1"
        );
        $webData = CollectAPI::setCollectStatusNew($_REQUEST['type'], $_REQUEST['item_type'], $_REQUEST['item_id']);
        $returnStr["result"] = $webData["result"];
        $this->ajaxReturn(json_encode($returnStr),"EVAL");
    }
}
