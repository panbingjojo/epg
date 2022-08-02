var buttons = [];
/**
 * 用户VIP信息
 * @type {{mFeeAccount: number, mFeeAccountType: number, mItemId: number, mItemType: number, mItemName: string, mItemNameTitle: string, mDescription: string, mDescriptionTitle: string, mConsumeFee: number, mImgUrl: string, mBuyDescs: string, mTradeNo: string, mDiscount: string, mVipId: string, mVipType: string, mVipName: string, mActivityId: string, mReason: number, mExpire: number, mExpireDt: string, mFeeExpireDt: string, mAutoOrder: string, mGoodType: string, mProductId: string, mContentId: string, init: UserVipInfo.init}}
 */
var UserVipInfo = {
    mFeeAccount: 0,             // 付费账号
    mFeeAccountType: 0,         // 付费账号的类型
    mItemId: 1,                 // 商品ID
    mItemType: 1,               // 商品类型
    mItemName: "",               // 商品名称
    mItemNameTitle: "",         // 自定义名称
    mDescription: "",           // 商品描述
    mDescriptionTitle: "",      // 自定义描述
    mConsumeFee: 1,             // 价格（分）
    mImgUrl: "",                // 订购页面图片的地址
    mBuyDescs: "",              // 订购描述
    mTradeNo: "",               // 订单id
    mDiscount: "",              // 折扣
    mVipId: "",                 // VipId
    mVipType: "",               // vip类型
    mVipName: "",               // vip名称
    mActivityId: "",            // 活动id
    mReason: 100,               // 订购来源（100 开通vip  101 活动购买 102播放视频购买 103视频问诊购买 104问诊记录购买 105健康检测记录购买 106续费vip）
    mExpire: 0,                 // 会员天数
    mExpireDt: "",              // 会员到期时间，eg："2018-03-31 23:59:59"
    mFeeExpireDt: "",           // 包月到期时间
    mAutoOrder: "",             // 退订标志: 0 已退订 1 续订
    mGoodType: "",
    mProductId: "",             // 局方的订购产品Id.
    mContentId: "",             // 局方的订购内容id.

    init: function () {
        LMEPG.Log.error("payInfo.html ---> RenderParam: " + JSON.stringify(RenderParam));


        if (RenderParam.vipInfo.hasOwnProperty("result") && RenderParam.vipInfo.result == 0 && RenderParam.isVip == "1") {
            if (RenderParam.vipInfo.hasOwnProperty("expire_dt")) {
                // 是否需要格式化处理
                this.mExpireDt = RenderParam.vipInfo.expire_dt;
            }
            if (RenderParam.vipInfo.hasOwnProperty("last_order_trade_no")) {
                this.mTradeNo = RenderParam.vipInfo.last_order_trade_no;
            }
            if (RenderParam.vipInfo.hasOwnProperty("auto_order") && RenderParam.vipInfo.auto_order != null) {
                this.mAutoOrder = RenderParam.vipInfo.auto_order;
            }
            if (RenderParam.vipInfo.hasOwnProperty("pay_type") && RenderParam.vipInfo.pay_type != null) {
                this.mFeeAccountType = RenderParam.vipInfo.pay_type;
            }
        }
    }
};
var view = {
    updateView: function () {
        LMEPG.Log.error("payInfo.html ---> updateView RenderParam.isVip：" + RenderParam.isVip);
        if (RenderParam.isVip != "1") {
            LMEPG.Log.error("payInfo.html ---> updateView not vip!");

            G('vip-icon').src = g_appRootPath+"/Public/img/"+RenderParam.platformType+"/Pay/V520092/no_vip.png";
            G('user-account').innerHTML = "";//RenderParam.accountId;
            G('pay-notice').innerHTML = "暂未订购39健康业务，订购后尽享所有功能";

            buttons.push({
                id: 'btn-pay',
                name: 'itv支付',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: g_appRootPath+'/Public/img/'+RenderParam.platformType+'/Pay/V520092/btn_order.png',
                backgroundImage: g_appRootPath+'/Public/img/'+RenderParam.platformType+'/Pay/V520092/btn_order.png',
                click: Pay.onClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: "",
                cOrderType: 1,    // 订购
            });
            LMEPG.BM.init(['btn-pay'], buttons, false, true);
        }
        else {
            H("btn-pay");
            buttons.push({
                id: 'btn-pay',
                name: 'itv退订',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                focusImage: g_appRootPath+'/Public/img/'+RenderParam.platformType+'/Pay/V520092/btn_un_order.png',
                backgroundImage: g_appRootPath+'/Public/img/'+RenderParam.platformType+'/Pay/V520092/btn_un_order.png',
                click: Pay.onClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: "",
                product_id: "39JK_ITV", // 退订只能退订续包月产品
                cIndex: 0,
                cOrderType: 2,    // 退订
            });
        }
    },
};

var Pay = {
    buildUnPayUrlAndJump: function (payInfo) { //构建退订并得到结果
        LMEPG.UI.commonDialog.show("确定退订吗？", ['确定', '取消'], function (btnId) {
            if (btnId == 0) {
                LMEPG.UI.showWaitingDialog("");
                LMEPG.ajax.postAPI("Pay/buildUnPayUrl", payInfo, function (data) {
                    LMEPG.UI.dismissWaitingDialog("");
                    if (data.result == 1) {
                        LMEPG.UI.showToast("退订成功");
                        var expiredTime = data.data.ExpiredTime;
                        expiredTime = Pay.insertStr(expiredTime, 4, "-");
                        expiredTime = Pay.insertStr(expiredTime, 7, "-");
                        expiredTime = Pay.insertStr(expiredTime, 10, " ");
                        expiredTime = Pay.insertStr(expiredTime, 13, ":");
                        expiredTime = Pay.insertStr(expiredTime, 16, ":");
                        G('user-account').innerHTML = "ITV账号续包月" + "(" + "已退订," + expiredTime + "到期" + ")";
                        H('btn-pay');
                        LMEPG.BM.init([''], [], false, true);
                    } else {
                        LMEPG.UI.showToast("退订失败[" + data.result + "]");
                    }
                });
            }
            ;
        });
    },

    onClick: function (btn) {
        if (btn.cOrderType == 1) {
            // 订购
            Page.jumpBuyVip();
        } else if (btn.cOrderType == 2) {
            onBack();
        }
    },
    /**
     * 插入字符
     * @param soure
     * @param start
     * @param newStr
     * @returns {*}
     */
    insertStr: function (soure, start, newStr) {
        return soure.slice(0, start) + newStr + soure.slice(start);
    }
};

var Page = {
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent("payInfo");
        return objCurrent;
    },

    jumpBuyVip: function () {
        var objCurrent = Page.getCurrentPage();
        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("userId", RenderParam.userId);
        objOrderHome.setParam("remark", "payInfo");
        objOrderHome.setParam("isPlaying", 0);
        objOrderHome.setParam("singlePayItem", 1);

        LMEPG.Intent.jump(objOrderHome, objCurrent);
    }
}
/**
 * 返回
 */
function onBack() {
    LMEPG.Log.error("payInfo ----> is press onBack ");
    LMEPG.Intent.back();
}

window.onerror = function (message, filename, lineno) {
    var errorLog = "payInfo.html error>>> " +
        "\nmessage:" + message +
        "\nfile_name:" + filename +
        "\nline_NO:" + lineno;
    //LMEPG.UI.showToast(errorLog);
    LMEPG.Log.error(errorLog);
}