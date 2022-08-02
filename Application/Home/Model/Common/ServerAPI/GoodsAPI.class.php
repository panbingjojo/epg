<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * |
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2019/5/8 14:44                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;

class GoodsAPI
{
    /**
     * 获取设备信息
     * @param $pageCurrent
     * @param $pageNum
     * @return mixed
     */
    public static function getGoodsInfo($pageCurrent, $pageNum)
    {
        $reqJson = array(
            "current_page" => $pageCurrent,
            "page_num" => $pageNum
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_INFO);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 获取设备跳转信息
     * @param $goodsId
     * @return mixed
     */
    public static function getGoodsJumpInfo($goodsId)
    {
        $reqJson = array(
            "goods_id" => $goodsId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_GET_THIRD_PARTY_PARA);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 获取我方订单信息
     * @param $goodsID  商品id
     * @param $userTel 用户电话号码
     * @return mixed  返回订单信息
     */
    public static function getOrderID($goodsID, $userTel)
    {
        $reqJson = array(
            "goods_id" => $goodsID,
            "user_tel" => $userTel
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_GET_ORDER_ID);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 获取订购结果
     * @param $orderId 订单id
     * @param $goodsType 商品类型
     * @return mixed
     */
    public static function getOrderResult($orderId, $goodsType)
    {
        $reqJson = array(
            "order_id" => $orderId,
            "goods_type" => $goodsType
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_IS_PAY);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 获取设备购买记录
     * @param $orderState 0全部订单 1--已完成 2--未完成
     * @param $pageCurrent
     * @param $pageNum
     * @return mixed
     */
    public static function getGoodsRecordInfo($orderState, $pageCurrent, $pageNum)
    {
        $reqJson = array(
            "order_state" => $orderState,
            "current_page" => $pageCurrent,
            "page_num" => $pageNum
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_RECORD_INFO);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 删除订单信息
     * @param $orderId
     * @return mixed
     */
    public static function delOrder($orderId)
    {
        $reqJson = array(
            "order_id" => $orderId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_DELETE_ORDER);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 获取问题列表
     * @param $orderId 订单id
     * @param $pageCurrent
     * @param $pageNum
     * @return mixed
     */
    public static function getGoodsProblemInfoAction($orderId, $pageCurrent, $pageNum)
    {
        $reqJson = array(
            "order_id" => $orderId,
            "current_page" => $pageCurrent,
            "page_num" => $pageNum
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_PROBLEM);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 取消订单
     * @param $orderId
     * @return mixed
     */
    public static function cancelOrder($orderId)
    {
        $reqJson = array(
            "order_id" => $orderId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_CANCEL_ORDER);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 获取提醒状态
     * @param $orderId
     * @return mixed
     */
    public static function getWarnState($orderId)
    {
        $reqJson = array(
            "order_id" => $orderId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_WARN_STATE);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }

    /**
     * 物流查询
     * @param $orderId
     * @return mixed
     */
    public static function getGoodsLogisticsInfo($orderId)
    {
        $reqJson = array(
            "order_id" => $orderId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GOODS_LOGISTICS_INFO);
        $result = $httpManager->requestPost($reqJson);
        return json_decode($result, true);
    }


}