/**
 * 用户订购记录查询
 */
function queryUserOrders(customerId) {
    sdk.doListUserOrders(customerId, function (resultCode, resultMsg) {
        console.log('resultCode:' + resultCode + ';resultMsg:' + resultMsg);
        LMEPG.Log.info('doListUserOrders370093::resultCode:' + resultCode + ';resultMsg:' + resultMsg);
        if (resultCode == 1) {
            var jsonObj = JSON.parse(resultMsg);
            if (jsonObj.result == 1) {
                for (var index in jsonObj.list) {
                    if (RenderParam.contentId == jsonObj.list[index].productIdThird && RenderParam.productId == jsonObj.list[index].productId) {
                        //找到本次订购的产品 上传订购结果
                        var data = {};
                        data.userId = RenderParam.userId;
                        data.customerId = RenderParam.customerId;
                        data.tradeNo = RenderParam.tradeNo;
                        data.result = jsonObj.list[index].result;
                        data.errCode = jsonObj.list[index].errCode;
                        data.orderId = jsonObj.list[index].orderId;
                        data.productId = jsonObj.list[index].productId;
                        data.productIdThird = jsonObj.list[index].productIdThird;
                        data.productName = jsonObj.list[index].productName;
                        data.contentId = jsonObj.list[index].contentId;
                        data.contentName = jsonObj.list[index].contentName;
                        data.price = jsonObj.list[index].price;
                        data.status = jsonObj.list[index].status;
                        data.payTime = jsonObj.list[index].payTime;
                        data.endTime = jsonObj.list[index].endTime;
                        data.payType = jsonObj.list[index].payType;
                        data.renew = jsonObj.list[index].renew;
                        uploadOrderResult(data);
                        return;
                    }
                }
            }
        }
        //TODO  错误处理 暂时直接返回
        window.location.href = returnUrl;
    });
}

/** 上报订购结果 */
function uploadOrderResult(data) {
    LMEPG.ajax.postAPI('Pay/uploadOrderResult370093', data, function (rsp) {
        window.location.href = returnUrl;
    }, function (rsp) {
        //错误页面或者回到门户地址
        window.location.href = returnUrl;
    });
}

window.onload = function () {
    if (RenderParam.result == "success") {
        //TODO 查询订单，上报结果，再次鉴权
        queryUserOrders(RenderParam.customerId);
    } else {
        window.location.href = RenderParam.returnUrl;
    }
};
