var buttons = [];
var returnUrl = '';                //订购返回地址
var PAY_TYPE_ANDROID = 1;
var PAY_TYPE_WEB = 2;
var PAY_TYPE_HTTP = 3;
var payType = PAY_TYPE_ANDROID;//是否需要android才能跳转到局方订购页
var payAccount = "-1";             //订购账号
var regionCode = "";
var queryOrderTime = 20;         //查询订单最大次数
var tradeNo = '';                //订单号
var domShowDialog;
var indexOfUserAgreementPicture;

function jumpAuthOrder() {
    var objDst = LMEPG.Intent.createIntent("authOrder");
    LMEPG.Intent.jump(objDst);
}

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
                onBackDelay();
            }
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();
        },function (){
            LMEPG.UI.showToast("请求异常，请稍后重试！", 3);
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        if (RenderParam.orderItems.length <= btn.cIndex) {
            LMEPG.ui.showToast("没有该订购项!");
            return;
        }
        var PayInfo = {
            "vip_id": RenderParam.orderItems[btn.cIndex].vip_id,
            "vip_type": RenderParam.orderItems[btn.cIndex].vip_type,
            "selectedProductNum": btn.cIndex ,
            "userId": RenderParam.accountId,
            "isPlaying": RenderParam.isPlaying,
            "orderReason": RenderParam.orderReason,
            "remark": RenderParam.remark,
            "amount":  +RenderParam.orderItems[btn.cIndex].price,
            "description": RenderParam.orderItems[btn.cIndex].price == 2500?"25元续包月产品":"270元包年产品",
            "contentId":'',
            'contentName':'39健康'

        };
        LMEPG.Log.info("78790:"+JSON.stringify(PayInfo));
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons.push({
                id: 'select_item_first',
                name: "选择套餐,续包月",
                type: "img",
                nextFocusRight: 'select_item_year',
                backgroundImage: ROOT + '/Public/img/'+RenderParam.platformType+'/Pay/V440001/monthly_renewal.png',
                focusImage: ROOT + '/Public/img/'+RenderParam.platformType+'/Pay/V440001/monthly_renewal_f.png',
                click: Pay.onPayItemClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange:  '',
                cIndex: 0,
            });
        buttons.push({
                id: 'select_item_year',
                name: "年包",
                type: "img",
                nextFocusLeft: 'select_item_first',
                backgroundImage: ROOT + '/Public/img/'+RenderParam.platformType+'/Pay/V440001/year_renewal.png',
                focusImage: ROOT + '/Public/img/'+RenderParam.platformType+'/Pay/V440001/year_renewal_f.png',
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
        if (typeof(RenderParam.orderItems) === "undefined" || RenderParam.orderItems == "") {
            LMEPG.UI.showToast("没有套餐",100);
            onBackDelay();
            return;
        }
        Pay.initButton();
        //domShowDialog = G("showDialog");
        LMEPG.ButtonManager.init(["select_item_first"], buttons, '', true);
        //Pay.showBuyDialogOne();
    },

    /**
     * 显示第一次确认弹窗
     */
    showBuyDialogOne:function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src='+ ROOT +'/Public/img/'+RenderParam.platformType+'/Pay/V440001/bg.png>';//背景图
        _html += '<img id="select_item_first" src='+ ROOT +'/Public/img/'+RenderParam.platformType+'/Pay/V440001/monthly_renewal_f.png>';
        _html += '<img id="select_item_year" src='+ ROOT +'/Public/img/'+RenderParam.platformType+'/Pay/V440001/year_renewal.png>';
        domShowDialog.innerHTML = _html;
        LMEPG.ButtonManager.requestFocus("select_item_first");
    },

    /**
     *
     */
    toPay: function (data) {
        var params=[
            "appid",//提供商标识，由南传扣费平台统一分配
            "timestamp",//请求时间戳，格式yyyyMMddHHmmssSSS
            "tranid",//由提供商生成一个32位长度的请求流水号
            "userId",//用户电视账号
            "productId",//商品标识；由移动统一分配
            "productName",//商品名称；CP申请计费点时向移动提供
            "amount",//商品价格 ；CP申请计费点时向移动提供
            "description",//商品信息；由CP自定义
            "contentId",//内容编码；由CP自定义
            "contentName",//内容名称；由CP自定义
            "orderType",//购买方式
            "commit",//移动计费标识；分2类：
             "backUrl",//支付成功跳转地址；邮件e提供该地址及appid、appkey给移动进行配置
            "validTime",//用户产品包生效时间
             "expireTime",//用户产品包失效时间
            "autoSub",//是否连续包月配
            "sign",//请求签名
        ];
        // 生成表单并跳转到局方支付界面
        var domShowForm = G('showForm');
        var html;
        if(LMEPG.Func.isEmpty(domShowForm)){
            LMEPG.ui.showToast("节点不存在，无法创建表单！",3);
            onBackDelay();
        } else {


            html  = '<form action="'+ data.orderUrl +'" method="post">';
            for (var key in data) {
                for (var i = 0; i < params.length; i++) {
                    if (key==params[i]){
                        html  += '<input type="text" name="'+key+'" value="'+ data[key] +'" >';
                    }
                }

            }
            html  += '<input type="submit" value="" id="goPay">';
            html  += '</form>';
            LMEPG.Log.info("html:"+html);
            domShowForm.innerHTML = html;
            // 提交
            document.getElementById("goPay").click();
        }
    }
};

/**
 * 返回处理
 */
function onBack() {
    if(RenderParam.accountId == "59900708604"){
        jumpAuthOrder();
    }else{
        LMEPG.Intent.back();
    }
    //jumpAuthOrder();
    //LMEPG.Intent.back();
}

/**
 * 返回（延时）
 */
function onBackDelay() {
    setTimeout(function () {
        onBack();
    }, 3000);
}
