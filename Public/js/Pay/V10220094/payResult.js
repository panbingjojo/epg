function onBack() {
    try {
        var orderParam = RenderParam.orderParam instanceof Object ? RenderParam.orderParam : JSON.parse(RenderParam.orderParam);
        if (orderParam.lmReason == 2) {
            return;
        }
    } catch (e) {
    }
    LMEPG.Intent.back();
}

function log(tag, msg, errorLevel) {
    if (errorLevel === true) console.error('[10220094][payResult.html]--->[' + tag + ']--->' + msg);
    else console.log('[10220094][payResult.html]--->[' + tag + ']--->' + msg);
    LMEPG.Log.info('[10220094][payResult.html]--->[' + tag + ']--->' + msg);
}

// 4.查询订购信息，购买成功后调用
function doQueryOrders(successCallback, failCallback) {
    if (LMEPG.Func.isEmpty(RenderParam.jk39ProductId)) {
        log('doQueryOrders()', '计费套餐id为空', true);
        LMEPG.call(failCallback, [-1001, '计费套餐id为空']);
        return;
    }

    try {
        if (typeof window.top.jk39 !== 'undefined' && window.top.jk39 !== null && window.top.jk39.orders !== undefined) {
            // 向局方请求查询当前用户的订购信息
            window.top.jk39.orders({
                package: [RenderParam.jk39ProductId],
                /*
                    结果和传入的套餐ID没有对应关系
                    result = [{
                        contentName:"套餐名称",
                        payTime:"支付时间",
                        endTime:"结束时间",
                        renew:"续订状态",//0：单月；1:连续包月；2:连续包月（已经取消续订）
                        price:"价格（分）",
                        payType:"支付类型"//1:移动话费2:联通话费3:电信话费4:支付宝5:微信6:未知7:宽带支付8:零元支付
                    }, ...]
                 */
                /**
                 * result示例：[{"contentName":"39健康","payTime":"2019-05-27 15:15:26","endTime":"2019-05-28 23:59:00","renew":0,"price":1,"payType":11}]
                 * @param result 注意得到的result类型为“object”
                 */
                callback: function (result) {
                    log('window.top.jk39.orders()', LMEPG.Func.string.format('result(type={0}): {1}', [typeof result, JSON.stringify(result)]));
                    if (result.length > 0) {
                        LMEPG.call(successCallback, result[0]);
                    } else {
                        LMEPG.call(failCallback, [0, '未查询到订购信息']);
                    }
                }
            });
        } else {
            log('doQueryOrders()', 'No "window.top.jk39.orders" function!', true);
            LMEPG.call(failCallback, [-1002, 'No "window.top.jk39.orders" function!']);
        }
    } catch (e) {
        log('doQueryOrders()', '[window.top.jk39.orders][orders failed!]-->查询订购信息异常：' + e.toString(), true);
        LMEPG.call(failCallback, [-1003, '查询订购信息异常' + e.toString()]);
    }
}

// 页面载完执行
window.onload = function () {
    log("window.onload()", "RenderParam: " + JSON.stringify(RenderParam));

    LMEPG.BM.init("", [], "", true);
    try {
        var orderParam = RenderParam.orderParam instanceof Object ? RenderParam.orderParam : JSON.parse(RenderParam.orderParam);
        if (!LMEPG.Func.isObject(orderParam)) orderParam = {};
    } catch (e) {
        var orderParam = {};
        log("window.onload()", "parse(RenderParam.orderParam) exception: " + e.toString(), true);
    }

    if (RenderParam.isSuccess == "1") {
        LMEPG.UI.showWaitingDialog();
        setTimeout(function () {
            doQueryOrders(function (orderObj) {
                /*-orderObj:
                    {
                        contentName:"套餐名称",
                        payTime:"支付时间",
                        endTime:"结束时间",
                        renew:"续订状态",//0：单月；1:连续包月；2:连续包月（已经取消续订）
                        price:"价格（分）",
                        payType:"支付类型"//1:移动话费2:联通话费3:电信话费4:支付宝5:微信6:未知7:宽带支付8:零元支付
                    }
                 */
                var uploadInfo = orderParam;
                uploadInfo.contentName = orderObj.contentName;//套餐名称
                uploadInfo.payTime = orderObj.payTime;//支付时间
                uploadInfo.endTime = orderObj.endTime;//结束时间
                uploadInfo.renew = orderObj.renew;//续订状态: 0-单月 1-连续包月 2-连续包月（已经取消续订）
                uploadInfo.price = orderObj.price;//价格（分）
                uploadInfo.payType = orderObj.payType;//支付类型 1:移动话费2:联通话费3:电信话费4:支付宝5:微信6:未知7:宽带支付8:零元支付
                LMEPG.ajax.postAPI("Pay/uploadPayResult", uploadInfo, function (data) {
                    log("doQueryOrders()", "上报订购结果成功--->uploadInfo: " + JSON.stringify(uploadInfo));
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("订购成功", 3, "onBack()");
                });
            }, function (code, msg) {
                log("doQueryOrders()", "订购成功[" + code + "," + msg + "]！但未查询到订购信息，无法上报。");
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("订购成功[" + code + "," + msg + "]", 3, "onBack()");//订购成功，但是未查询到订购信息，无法上报！
            });
        }, 500);
    } else if (RenderParam.isSuccess == "2") {
        log("window.onload()", "您已经订购了,请勿重复订购：[" + orderParam.result + "]", true);
        LMEPG.UI.showToast("您已是VIP,请勿重复订购", 3, "onBack()");
    } else {
        log("window.onload()", "订购失败：[" + orderParam.result + "]", true);
        LMEPG.UI.showToast("订购失败", 3, "onBack()");
    }
};

// 页面错误
window.onerror = function (message, filename, lineno) {
    var errorLog = '[V210220094-payResult.js]::error --->' + '\nmessage:' + message + '\nfile_name:' + filename + '\nline_NO:' + lineno;
    log('window.onerror()', errorLog, true);
    LMEPG.UI.showToast(errorLog);
    onBack();
};

