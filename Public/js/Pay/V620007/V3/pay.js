var Page = {

    init: function(){
        // 订购流程说明，1、创建CWS订单信息 > 2、构建底层安卓创建信息 > 3、调用android底层支付方法
        //                > 4、对返回的结果判断，成功调动LWS结果并同步修改用户当前状态
        // 调用后台管理接口，创建订单号
        // 套餐订购的信息由局方通过接口调用通知，所以这边默认使用第一项作为CWS创建订单项
        var orderItem = RenderParam.orderItems[0];
        var orderData = {
            "orderItemId": orderItem['vip_id'],
            "orderReason": RenderParam.orderReason,
            "orderRemark": RenderParam.remark,
            "contentId": (JSON.parse(RenderParam.videoInfo)).videoUrl != undefined ? (JSON.parse(RenderParam.videoInfo)).videoUrl : ""
        };
        // 弹出等待对话框
        LMEPG.UI.showWaitingDialog("正在创建订单中，请等待...");
        LMEPG.ajax.postAPI("Pay/getOrderTradeNo",orderData,function (response) {
            LMEPG.UI.dismissWaitingDialog();
            if (response.result == 0) {
                // 请求后台接口构建支付的数据
                LMEPG.UI.showWaitingDialog("正在创建支付信息中，请等待...");
                LMEPG.ajax.postAPI("Pay/getPayData", orderData, function (data) {
                    // 调用Android底层方法，跳转局方订购页面
                    LMEPG.UI.showWaitingDialog("正在跳转支付页面，请等待...");
                    LMAndroid.JSCallAndroid.doPay(JSON.stringify(data), function (payResult) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.Log.info("LMAndroid.JSCallAndroid.doPay result is " + payResult);
                        payResult = payResult instanceof Object ? payResult : JSON.parse(payResult);
                        if (payResult.result == "1") {
                            // 标识订购成功，并将数据传回CWS修改当前vip状态
                            LMEPG.UI.showWaitingDialog("支付成功，信息数据同步中，请等待...");
                            LMEPG.ajax.postAPI("Pay/asyncUserStatus", {}, function () {
                                LMEPG.UI.dismissWaitingDialog();
                                LMEPG.UI.showToast("恭喜您，订购成功", 3, function () {
                                    LMEPG.Intent.back();
                                });
                            }, function () {
                                LMEPG.UI.dismissWaitingDialog();
                                LMEPG.UI.showToast("同步数据失败，请重新登录重试", 3, function () {
                                    if (RenderParam.inner == "0"){
                                        // 外部统一搜索模块进入的页面，返回搜索模块页面
                                        LMAndroid.JSCallAndroid.doExitApp();
                                    }else {
                                        LMEPG.Intent.back();
                                    }
                                });
                            })
                        } else {
                            LMEPG.UI.dismissWaitingDialog();
                            // 弹窗提示支付失败，并返回上一页
                            LMEPG.UI.showToast("订购失败，请稍后重试", 3, function () {
                                if (RenderParam.inner == "0"){
                                    // 外部统一搜索模块进入的页面，返回搜索模块页面
                                    LMAndroid.JSCallAndroid.doExitApp();
                                }else {
                                    LMEPG.Intent.back();
                                }
                            });
                        }
                    });
                }, function () {
                    LMEPG.UI.dismissWaitingDialog();
                    // 弹窗提示创建支付信息失败，并返回上一页
                    LMEPG.UI.showToast("创建支付信息失败，请稍后重试", 3, function () {
                        if (RenderParam.inner == "0"){
                            // 外部统一搜索模块进入的页面，返回搜索模块页面
                            LMAndroid.JSCallAndroid.doExitApp();
                        }else {
                            LMEPG.Intent.back();
                        }
                    });
                })
            }else {
                LMEPG.UI.showToast("创建订单失败，请稍后重试", 3,function () {
                    if (RenderParam.inner == "0"){
                        // 外部统一搜索模块进入的页面，返回搜索模块页面
                        LMAndroid.JSCallAndroid.doExitApp();
                    }else {
                        LMEPG.Intent.back();
                    }
                });
            }
        },function (error,rsp) {
            LMEPG.UI.dismissWaitingDialog();
            // 弹窗提示创建订单失败,并返回上一页
            LMEPG.UI.showToast("请求服务器失败，请稍后重试", 3,function () {
                if (RenderParam.inner == "0"){
                    // 外部统一搜索模块进入的页面，返回搜索模块页面
                    LMAndroid.JSCallAndroid.doExitApp();
                }else {
                    LMEPG.Intent.back();
                }
            });
        })
    }
};