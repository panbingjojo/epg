var tradeNo = '';                //订单号

// 鉴权代码
var DEF_ORDER_VOD_CODE = "02000642000000012020062999532820";
var DEF_ORDER_VOD_NAME = "尿毒症的发病率,患病人数";
var Pay = {

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Pay/buildPayUrl", payInfo, function (data) {
            if (data.result == 0) {
                Pay.toPay(data.payInfo);
            } else {
                //获取订购参数失败
                if(LMEPG.func.isExist(data.message)){
                    LMEPG.ui.showToast(data.message, 3);
                } else {
                    LMEPG.ui.showToast("获取订购参数失败!", 3);
                }
                YstenPayPage.onBackDelay();
            }
            LMEPG.UI.dismissWaitingDialog();
        },function (){
            LMEPG.UI.showToast("请求异常，请稍后重试！", 3);
            YstenPayPage.onBack();
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function () {
        if (RenderParam.orderItems.length <= 3) {
            LMEPG.UI.showToast("没有该订购项!");
            YstenPayPage.onBackDelay()
            return;
        }
        var itemIndex = 3;
        var PayInfo = {
            "vip_id": RenderParam.orderItems[itemIndex].vip_id,
            "vip_type": RenderParam.orderItems[itemIndex].vip_type,
            "selectedProductNum": itemIndex,
            "userId": RenderParam.accountId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "amount":  +RenderParam.orderItems[itemIndex].price,
            "description": "融合包续包月产品",
            "contentId":'',
            'contentName':'39健康'
        };
        LMEPG.Log.info("78790:"+JSON.stringify(PayInfo));
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 到局方去订购
     */
    toPay: function (data) {
        //CWS 订单号
        tradeNo = data.tradeNo;
        //确定
        LMEPG.Log.info('PayYsten1.js--payYsten-->' + JSON.stringify(RenderParam.videoInfo));

        var contentId = is_empty(RenderParam.videoInfo.videoUrl) ? DEF_ORDER_VOD_CODE : RenderParam.videoInfo.videoUrl;
        var contentName = is_empty(RenderParam.videoInfo.title) ? DEF_ORDER_VOD_NAME : RenderParam.videoInfo.title;
        var payData = {
            userId:RenderParam.accountId,
            contentId:contentId,
            contentName:contentName,
            productId:data.productId,
            productType:"1",
            //payPhone:"13641906126",
        };
        LMAndroid.JSCallAndroid.doShowWaitingDialog();
        LMAndroid.JSCallAndroid.doGoOrder(JSON.stringify(payData), function (res, notifyAndroidCallback) {
            LMEPG.Log.info('PayYsten.js--doGoOrder--result:' + res);
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
            var result = JSON.parse(res);
            Pay.parsePayResult(data,result);
        });
    },
    /**
     * 解析支付结果
     * @param data
     * @param result
     */
    parsePayResult: function(data,result){
        console.log('PayYsten.js--parsePayResult--result:' + JSON.stringify(result));
        if(result.result == "0"){
            var url = data.backUrl;
            var params = [
                "tranid",
                "productId",
                "productName",
                "amount",
                "contentId",
                "autoSub",
                "validTime",
                "expireTime",
                "tranid",
            ];
            for (var i = 0; i < params.length; i++) {
                var key = params[i]
                url  += "/" + key + "/" + encodeURI(data[key]);
            }
            url  += "/orderId/" + result.data.outSequenceId;
            url  += "/payType/" + data['orderType'];
            url  += "/payResult/0";
            // if(RenderParam.isPlaying != '1'){
            //     url  += "/returnPageName/home";
            // }
            // url = url.replace("http://test-healthiptv.langma.cn:8100","http://10.254.59.80:8081");
            // url = url.replace("http://183.234.214.54:10013","http://10.254.59.80:8081");

            console.log('PayYsten.js--doGoOrder--GETAPI-url:' + url);
            window.location.href = url;
        }else{
            YstenPayPage.onBack();
        }
    },

    /**
     * 初始化订购页
     */
    init: function () {
        Pay.onPayItemClick();
        //Pay.pay4Ysten();
    }
};

var YstenPayPage = {
    /**
     * 返回处理
     */
    onBack: function () {
        console.log('PayYsten.js--onBack');
        LMEPG.Intent.back();
    },

    /**
     * 返回（延时）
     */
    onBackDelay: function () {
        setTimeout(function () {
            YstenPayPage.onBack();
        }, 3000);
    }

}