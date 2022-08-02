var buttons = [];
var DEBUG = false;
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
                PayPage.onBackDelay();
            }
            LMEPG.UI.dismissWaitingDialog();
        },function (){
            LMEPG.UI.showToast("请求异常，请稍后重试！", 3);
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        if(btn.cIndex === 0){
            if (RenderParam.orderItems.length < 1) {
                LMEPG.UI.showToast("没有该订购项!");
                return;
            }
            var itemIndex = 0;
            var PayInfo = {
                "vip_id": RenderParam.orderItems[itemIndex].vip_id,
                "vip_type": RenderParam.orderItems[itemIndex].vip_type,
                "selectedProductNum": itemIndex,
                "userId": RenderParam.accountId,
                "isPlaying": RenderParam.isPlaying,
                "orderReason": RenderParam.orderReason,
                "remark": RenderParam.remark,
                "price":  + RenderParam.orderItems[itemIndex].price,
                "description": "39健康-包月产品",
                "contentId":'',
                'contentName':'39健康'
            };

            Pay.buildPayInfo(PayInfo);
        }else{
            //返回
            PayPage.onBack();
        }
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons.push({
                id: 'select_item_first',
                name: "确定购买",
                type: "img",
                nextFocusRight: 'select_item_year',
                backgroundImage: ROOT + '/Public/img/'+RenderParam.platformType+'/Pay/V440001/sure_btn.png',
                focusImage: ROOT + '/Public/img/'+RenderParam.platformType+'/Pay/V440001/sure_btn_f.png',
                click: Pay.onPayItemClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange:  '',
                cIndex: 0,
            });
        buttons.push({
                id: 'select_item_year',
                name: "返回",
                type: "img",
                nextFocusLeft: 'select_item_first',
                backgroundImage: ROOT + '/Public/img/'+RenderParam.platformType+'/Pay/V440001/back_btn.png',
                focusImage: ROOT + '/Public/img/'+RenderParam.platformType+'/Pay/V440001/back_btn_f.png',
                click: Pay.onPayItemClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange:  '',
                cIndex: 1,
            });
    },

    /**
     * 初始化订购页
     */
    init: function () {
        Pay.initButton();
        LMEPG.ButtonManager.init(["select_item_first"], buttons, '', true);
    },

    /**
     * 到局方去订购
     */
    toPay: function (data) {

        //确定
        LMEPG.Log.info('pay.js--toPay-->' + JSON.stringify(RenderParam.videoInfo));
        LMEPG.Log.info('pay.js--toPay--data.backUrl:' + data.backUrl);
        if(DEBUG){
            //返回
            PayPage.onBack();
        }else{
            LMAndroid.JSCallAndroid.doShowWaitingDialog();
            var param = {
                accountId: RenderParam.accountId,
                areaCode: RenderParam.areaCode,
                appId: data.appId,
                productId: data.productId,
                serviceId: data.serviceId,
                contentId: data.contentId,
                price: data.price
            };
            LMAndroid.JSCallAndroid.doGoOrder(JSON.stringify(param), function (res, notifyAndroidCallback) {
                LMEPG.Log.info('pay.js--doGoOrder--result:' + res);
                LMAndroid.JSCallAndroid.doDismissWaitingDialog();
                //返回
                PayPage.onBack();
            });
        }
    }
};

var PayPage = {
    /**
     * 返回处理
     */
    onBack: function () {
        console.log('pay.js--onBack');
        LMEPG.Intent.back();
    },

    /**
     * 返回（延时）
     */
    onBackDelay: function () {
        setTimeout(function () {
            PayPage.onBack();
        }, 3000);
    }

}