// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | 吉林广电EPG订购逻辑
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/3/28 15:02
// +----------------------------------------------------------------------

//调试模式，上线改为false
var debug = true;

// 页面按钮
var buttons = [];

function onBack() {
    LMEPG.Intent.back();
}

function log(tag, msg, errorLevel) {
    if (errorLevel === true) console.error('[220094][pay.js]--->[' + tag + ']--->' + msg);
    else console.info('[220094][pay.js]--->[' + tag + ']--->' + msg);
    LMEPG.Log.info('[220094][pay.js]--->[' + tag + ']--->' + msg);
}

//////////////////////////////
//   吉林广电支付接口整理   //
//////////////////////////////
var JLPaySDK = (function () {
    // 朗玛39健康订购
    var LongMasterSDK = function () {
        // 套餐id
        this.jk39ProductId = RenderParam.productId; //39健康计费套餐id，用于鉴权等操作

        // 1.鉴权
        this.doAuth = function (productId/*套餐id*/, payInfoObj/*组织的订购参数*/) {
            if (LMEPG.Func.isEmpty(productId)) {
                LMEPG.UI.showToast('无效的套餐id');
                return;
            }

            try {
                if (typeof window.top.jk39 !== 'undefined' && window.top.jk39 !== null && window.top.jk39.auth !== undefined) {
                    LMEPG.UI.showWaitingDialog();
                    var self = this;
                    window.top.jk39.auth({
                            package: [productId], //套餐id
                            callback: function (result) {
                                log('JLPaySDK.doAuth()', '[doAuth][result]--->鉴权结果: ' + result);
                                if (result == true) {
                                    //鉴权成功：已订购
                                    LMEPG.UI.dismissWaitingDialog();
                                    LMEPG.UI.showToast('已经订购过了');
                                } else {
                                    //鉴权失败：未订购
                                    self.doCreateTradeNo(payInfoObj);
                                }
                            }
                        }
                    );
                } else {
                    log('JLPaySDK.doAuth()', '[doAuth][failed!]--->No "window.top.jk39.buy" function!', true);
                    LMEPG.UI.showToast('No "window.top.jk39.buy" function!');
                    LMEPG.UI.dismissWaitingDialog();
                }
            } catch (e) {
                log('JLPaySDK.doAuth()', '[auth][auth failed!]-->鉴权发生异常：' + e.toString(), true);
                LMEPG.UI.showToast('鉴权发生异常');
            }
        };

        // 2.在我方请求cws生成订单号
        this.doCreateTradeNo = function (payInfoObj) {
            var self = this;
            LMEPG.ajax.postAPI('Pay/getOrderTradeNo', {
                'orderItemId': payInfoObj.lmVipId,
                'orderReason': payInfoObj.orderReason,
                'orderRemark': payInfoObj.lmRemark,
                'orderType': payInfoObj.orderType,
                'lmReason': payInfoObj.lmReason
            }, function (data) {
                if (data.result == 0 && data.tradeNo !== '') {
                    payInfoObj.lmTradeNo = data.tradeNo;//把从我方cws生成的订单号附加到payInfoObj对象参数里，用于构建返回地址
                    self.doBuy(payInfoObj);
                } else {
                    log('JLPaySDK.doCreateTradeNo()', '[createPayTradeNo][failed!]-->我方生成支付订单失败！' + JSON.stringify(data), true);
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast('生成订单失败[' + data.result + ']');
                }
            });
        };

        // 3.请求局方订购
        this.doBuy = function (payInfoObj) {
            function _buyInner(backUrl) {
                try {
                    if (typeof window.top.jk39 !== 'undefined' && window.top.jk39 !== null && window.top.jk39.buy !== undefined) {
                        // 向局方请求订购
                        window.top.jk39.buy(backUrl);
                    } else {
                        log('JLPaySDK.doBuy()', 'No "window.top.jk39.buy" function!', true);
                        LMEPG.UI.dismissWaitingDialog();
                    }
                } catch (e) {
                    log('JLPaySDK.doBuy()', '[buy][buy failed!]-->购买发生异常：' + e.toString(), true);
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast('购买发生异常');
                }
            }

            var reqData = payInfoObj;
            LMEPG.ajax.postAPI('Pay/buildPayCallbackUrl', reqData, function (data) {
                if (data.result == 0 && data.url !== '') {
                    _buyInner(data.url);
                } else {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast('构建返回地址失败！');
                }
            });
        };

        // 4.查询订购信息，购买成功后调用
        this.doQueryOrders = function () {
            if (LMEPG.Func.isEmpty(this.jk39ProductId)) {
                log('JLPaySDK.doQueryOrders()', '计费套餐id为空', true);
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast('查询订购失败！无效的计费套餐id');
                return;
            }

            try {
                if (typeof window.top.jk39 !== 'undefined' && window.top.jk39 !== null && window.top.jk39.orders !== undefined) {
                    // 向局方请求查询当前用户的订购信息
                    window.top.jk39.orders({
                        package: [this.jk39ProductId],
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
                            log('JLPaySDK.doQueryOrders()', LMEPG.Func.string.format('[window.top.jk39.orders]--->result(type={0}): {1}', [typeof result, JSON.stringify(result)]));
                            LMEPG.UI.showToast('length:' + result.length + '-->' + JSON.stringify(result));
                        }
                    });
                } else {
                    log('JLPaySDK.doQueryOrders()', 'No "window.top.jk39.orders" function!', true);
                    LMEPG.UI.dismissWaitingDialog();
                }
            } catch (e) {
                log('JLPaySDK.doQueryOrders()', '[orders][orders failed!]-->查询订购信息异常：' + e.toString(), true);
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast('查询订购信息异常');
            }
        };
    }, lmsdk = new LongMasterSDK;
    return lmsdk;
})();

/**
 *  支付入口类
 */
var Pay = {

    initButtons: function () {
        buttons.push({
            id: 'focus-1-1',
            name: '返回',
            type: 'img',
            nextFocusLeft: 'focus-2-1',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220094/payback0.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220094/payback1.png',
            click: onBack,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            cIndex: 0
        });
        buttons.push({
            id: 'focus-2-1',
            name: '包月',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'focus-1-1',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220094/paymonth0.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V220094/paymonth1.png',
            click: Pay.onPayItemClick,
            focusChange: '',
            beforeMoveChange: '',
            moveChange: '',
            cIndex: 1
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        // 加强校验，用于复用于“直接跳转局方订购页”直接调用当前方法。
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            LMEPG.UI.showToast('后台运营未配置订购项！');
            onBack();
            return;
        }

        var payInfo = {
            'lmVipId': RenderParam.orderItems[0].vip_id,
            'lmVipType': RenderParam.orderItems[0].vip_type,
            'lmTradeNo': '',//我方生成的订单号，后面某个阶段会去cws请求它，先占位所有参数定义
            'lmIsPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'lmRemark': RenderParam.remark,
            'lmReturnPageName': RenderParam.returnPageName,
            'lmReason': RenderParam.lmReason,
            'orderType': RenderParam.orderType
        };
        JLPaySDK.doAuth(JLPaySDK.jk39ProductId, payInfo);
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            LMEPG.UI.showToast('后台运营未配置订购项！');
            onBack();
            return;
        }
        this.initButtons();
        LMEPG.BM.init('focus-2-1', buttons, '', true);
        // JLPaySDK.doQueryOrders();//TODO 用于调试查询用户订购信息
    }
};

// 页面载完执行
window.onload = function () {
    if (RenderParam.isDirectPay) {
        // 直接跳转局方订购页
        Pay.onPayItemClick();
    } else {
        // 展示我方订购页
        Pay.init();
    }
};

// 页面错误
window.onerror = function (message, filename, lineno) {
    var errorLog = '[V2220094-pay.js]::error --->' + '\nmessage:' + message + '\nfile_name:' + filename + '\nline_NO:' + lineno;
    if (debug) {
        LMEPG.UI.showToast(errorLog);
        LMEPG.BM.init('', buttons, '', true);
    }

    log('window.onerror()', errorLog, true);
    onBack();
};