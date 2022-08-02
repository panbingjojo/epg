var gzgdPay = {
    cpId: 10072,
    vipVideoId: 'OTHE8220180606000551',
    successCallback: null,
    closeCallback: null,
    errorCallback: null,

    /**
     * 开启订购流程
     *   先通过VIP视频获取可以订购的产品id，然后通过产品id获取产品详情，最后通过产品详情去订购
     */
    start: function (successCallback, closeCallback, errorCallback, configPayInfo) {
        gzgdPay.successCallback = successCallback;
        gzgdPay.closeCallback = closeCallback;
        gzgdPay.errorCallback = errorCallback;
        gzgdPay.getPayVideoId(function (videoId) {
            gzgdPay.auth_play(videoId, function (state, productList) {
                if (state == "0") {
                    //鉴权成功，已经是vip
                    // LMEPG.UI.showToast("已经是vip", 5);
                    gzgdPay.errorCallback();
                } else if (state == "1") {
                    //鉴权失败，不是vip，可以去订购
                    if (productList == null || productList.length < 1) {
                        LMEPG.UI.showToast("没有获取到任何产品信息", 5);
                        gzgdPay.errorCallback();
                    } else {
                        gzgdPay.getProductInfo(productList[0].id, configPayInfo);
                    }
                } else if (state == "6") {
                    //免费的影片，
                    LMEPG.UI.showToast("用于鉴权的视频已经变成了非VIP视频", 5);
                    gzgdPay.errorCallback();
                } else {
                    LMEPG.UI.showToast("视频鉴权未知错误", 5);
                    gzgdPay.errorCallback();
                }
            });
        });
    },

    /**
     * 开启鉴权流程
     */
    authVip: function (successCallback) {
        gzgdPay.successCallback = successCallback;
        gzgdPay.getPayVideoId(function (videoId) {
            gzgdPay.auth_play(videoId, function (state, productList) {
                var isVip = false;
                if (state == "0") {
                    //鉴权成功，已经是vip
                    // LMEPG.UI.showToast("已经是vip", 5);
                    isVip = true;
                } else if (state == "1") {
                    //鉴权失败，不是vip
                    isVip = false;
                } else if (state == "6") {
                    //免费的影片，
                    LMEPG.UI.showToast("用于鉴权的视频已经变成了非VIP视频", 5);
                    isVip = false;
                } else {
                    LMEPG.UI.showToast("视频鉴权未知错误", 5);
                    isVip = false;
                }
                gzgdPay.successCallback(isVip);
            });
        });
    },

    /**
     * 获取播放视频的id（外键id转內键id）
     */
    getPayVideoId: function (callback) {
        var thisCallBack = callback;
        var getVideoIdParams = {
            "nns_ids": gzgdPay.vipVideoId,
            'nns_mode': 0,
            'nns_type': 'video'
        };
        starcorCom.transformat_keys(getVideoIdParams, function (data) {
            var videoId = data.l.il[0].id;
            LMEPG.Log.error("guizhougd player--------transformat_keys videoId:" + videoId);
            if (typeof videoId == "undefined" || videoId == null || videoId == "") {
                LMEPG.UI.showToast("该视频没有内键ID!", 5);
                gzgdPay.errorCallback();
            } else {
                thisCallBack(videoId);
            }
        });
    },

    /**
     * 视频鉴权
     * @param videoId
     */
    auth_play: function (videoId, callback) {
        var thisCallBack = callback;
        var auth_params = {
            nns_video_id: videoId,
            nns_video_type: "0",
        }
        starcorCom.auth_play(auth_params, function (resp) {
            //TODO : 页面鉴权回调处理
            var result = resp.result;
            var productList = resp.product_list;
            var videoInfo = resp.video;
            var state = result.state;
            thisCallBack(state, productList);
        });
    },

    /**
     * 获取产品策略信息、比如：包月、包年、半年等信息
     * @param productId 通过鉴权返回的产品id
     * @param configPayInfo 配置在我发管理后台的订单信息
     */
    getProductInfo: function (productId, configPayInfo) {
        starcorCom.get_buy_product_list({
            nns_product_id: productId,
            nns_cp_id: gzgdPay.cpId,
            has_jfcl: true           //是否获取产品下的资费策略（产品有促销包时传入true），默认为false
        }, function (p_resp) {
            var state_ = p_resp.result.state;
            //获取产品包成功
            if (state_ == 300000) {
                var tempIndex = null;
                for (var i = 0; i < p_resp.product.length; i++) {
                    var tempMoney = p_resp.product[i].money * 100;
                    if (tempMoney == configPayInfo.price) {
                        tempIndex = i;
                        break;
                    }
                }
                if (tempIndex != null) {
                    gzgdPay.goPay(p_resp.product[tempIndex]);
                } else {
                    LMEPG.UI.showToast("获取计费策略失败！", 5);
                }
            } else {
                LMEPG.UI.showToast("获取订购的产品详情失败！", 5);
                gzgdPay.errorCallback();
            }
        });
    },

    /**
     * 去订购界面
     */
    goPay: function (productInfo) {
        var params = {
            pay_type: 1,//1支付 2还款
            product: productInfo,
            success_callback: function (res) {
                //订购成功后显示界面按钮点击后处理
                gzgdPay.successCallback(res, 2);
            },
            pay_success_event: function (res) {
                //订购成功返回
                gzgdPay.successCallback(res, 1);
            },
            close_event: function (res) {
                //关闭订购界面
                gzgdPay.closeCallback(res);
            }
        };
        starcorCom.product_order(params);
    }

}