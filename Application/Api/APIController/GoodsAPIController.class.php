<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * | 设备商城相关接口
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2019/5/8 14:39                                               |
 * +----------------------------------------------------------------------+
 */

namespace Api\APIController;


use Home\Model\Common\ServerAPI\GoodsAPI;
use Think\Controller;

class GoodsAPIController extends Controller
{


    /**
     * 获取设备信息
     */
    public function getGoodsInfoAction()
    {
        $pageCurrent = $_REQUEST["pageCurrent"];
        $pageNum = $_REQUEST["pageNum"];
        $res = GoodsAPI::getGoodsInfo($pageCurrent, $pageNum);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    /**
     * 获取设备跳转信息
     */
    public function getGoodsJumpInfoAction()
    {
        $goodsId = $_REQUEST["goodsId"];
        $res = GoodsAPI::getGoodsJumpInfo($goodsId);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    //获取订单信息
    public function getOrderIdAction()
    {
        $goodsId = $_REQUEST["goodsId"];
        $userTel = $_REQUEST["userTel"];
        $res = GoodsAPI::getOrderID($goodsId, $userTel);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    //获取订购结果
    public function getOrderResultAction()
    {
        $orderId = $_REQUEST["orderId"];
        $goodsType = $_REQUEST["goodsType"];
        $res = GoodsAPI::getOrderResult($orderId, $goodsType);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    //获取订单记录
    public function getRecordInfoAction()
    {
        $pageCurrent = $_REQUEST["pageCurrent"];
        $orderState = $_REQUEST["orderState"];
        $pageNum = $_REQUEST["pageNum"];
        $res = GoodsAPI::getGoodsRecordInfo($orderState, $pageCurrent, $pageNum);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    //删除订单记录
    public function delOrderAction()
    {
        $orderId = $_REQUEST["orderId"];
        $res = GoodsAPI::delOrder($orderId);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    //取消订单
    public function cancelOrderAction()
    {
        $orderId = $_REQUEST["orderId"];
        $res = GoodsAPI::cancelOrder($orderId);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    //获取问题列表
    public function getGoodsProblemInfoAction()
    {
        $pageCurrent = $_REQUEST["pageCurrent"];
        $orderId = $_REQUEST["orderId"];
        $pageNum = $_REQUEST["pageNum"];
        $res = GoodsAPI::getGoodsProblemInfoAction($orderId, $pageCurrent, $pageNum);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    //获取提醒状态
    public function getWarnStateAction()
    {
        $orderId = $_REQUEST["orderId"];
        $res = GoodsAPI::getWarnState($orderId);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }

    //获取物流信息
    public function getGoodsLogisticsInfoAction()
    {
        $orderId = $_REQUEST["orderId"];
        $res = GoodsAPI::getGoodsLogisticsInfo($orderId);
        $this->ajaxReturn(json_encode($res), "EVAL");
    }


}