/**
 * 用于定义与设备商城相关的API接口
 * Created by yzq on 2019/5/8
 */

GoodsAPI = (function () {
    return {
        /**
         * 获取商品信息
         * @param pageCurr 当前页码
         * @param pageNum  拉取多少条数据
         * @param asyncCallback
         */
        getGoodsInfo: function (pageCurr, pageNum, asyncCallback) {
            var postData = {
                "pageCurrent": pageCurr,
                "pageNum": pageNum
            };
            LMEPG.ajax.postAPI("Goods/getGoodsInfo", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },
        /**
         * 获取订单信息：同一个商品，在两小时之内重复购买，但又没有支付的话，拉取的订单信息一致。所以有可能在订购记录
         * 中，连续下单，但看不到多条记录情况。
         * @param goodsId 商品id
         * @param userTel 用户电话
         * @param asyncCallback
         */
        getOrderId: function (goodsId, userTel, asyncCallback) {
            var postData = {
                "goodsId": goodsId,
                "userTel": userTel
            };
            LMEPG.ajax.postAPI("Goods/getOrderId", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },
        /**
         * 获取订购状态
         * @param orderId 订单id
         * @param goodsType 商品类型
         * @param asyncCallback
         */
        getOrderResult: function (orderId, goodsType, asyncCallback) {
            var postData = {
                "orderId": orderId,
                "goodsType": goodsType
            };
            LMEPG.ajax.postAPI("Goods/getOrderResult", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },
        /**
         * 获取设备购买记录
         * @param orderState 0全部订单 1--已完成 2--未完成
         * @param pageCurrent
         * @param pageNum
         * @param asyncCallback
         */
        getRecordInfo: function (orderState, pageCurrent, pageNum, asyncCallback) {
            var postData = {
                "orderState": orderState,
                "pageCurrent": pageCurrent,
                "pageNum": pageNum
            };
            LMEPG.ajax.postAPI("Goods/getRecordInfo", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },
        /**
         * 删除订单
         * @param orderId 订单号
         * @param asyncCallback
         */
        delOrder: function (orderId, asyncCallback) {
            var postData = {
                "orderId": orderId,
            };
            LMEPG.ajax.postAPI("Goods/delOrder", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },
        /**
         * 取消订单
         * @param orderId 订单号
         * @param asyncCallback
         */
        cancelOrder: function (orderId, asyncCallback) {
            var postData = {
                "orderId": orderId,
            };
            LMEPG.ajax.postAPI("Goods/cancelOrder", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },
        /**
         * 获取问题列表
         * @param orderId
         * @param pageCurrent
         * @param pageNum
         * @param asyncCallback
         */
        getGoodsProblemInfo: function (orderId, pageCurrent, pageNum, asyncCallback) {
            var postData = {
                "orderId": orderId,
                "pageCurrent": pageCurrent,
                "pageNum": pageNum
            };
            LMEPG.ajax.postAPI("Goods/getGoodsProblemInfo", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },
        /**
         * 获取提醒状态
         * @param orderId
         * @param asyncCallback
         */
        getWarnState: function (orderId, asyncCallback) {
            var postData = {
                "orderId": orderId,
            };
            LMEPG.ajax.postAPI("Goods/getWarnState", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },
        /**
         * 获取物流提示信息
         * @param orderId 订单号
         * @param asyncCallback
         */
        getGoodsLogisticsInfo: function (orderId, asyncCallback) {
            var postData = {
                "orderId": orderId,
            };
            LMEPG.ajax.postAPI("Goods/getGoodsLogisticsInfo", postData, function (rsp) {
                asyncCallback(rsp);
            });
        }

    }
})();