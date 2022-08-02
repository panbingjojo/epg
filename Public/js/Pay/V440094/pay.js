var buttons = [];
var domShowDialog;
var indexOfUserAgreementPicture;
var picPath = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Pay/V440094";

var page = {
    /**
     * 跳转到弹框页
     */
    jumpDirectPay: function (payInfo) {
        console.log(JSON.stringify(payInfo));
        var objDirectPay = LMEPG.Intent.createIntent('directPay');
        objDirectPay.setParam('orderParam', JSON.stringify(payInfo));

        LMEPG.Intent.jump(objDirectPay, null);
    }
};

var Pay = {

    orderItem: {},

    /**
     * 构建支付信息
     * @param payInfo
     */
    buildPayInfo: function (payInfo) {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Pay/buildPayUrl', payInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog('');
            if (data.result == 0) {
                //获取订购参数成功，跳转到直接订购界面
                page.jumpDirectPay(data.payInfo);
                //window.location.href = data.payUrl;
            } else {
                //获取订购参数失败
                LMEPG.UI.showToast('获取订购参数失败!', 3);
                onBackDelay();
            }
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        if (RenderParam.orderItems.length <= btn.cIndex) {
            LMEPG.Log.error('订购项不匹配!');
            return;
        }
        var PayInfo = {
            'vip_id': RenderParam.orderItems[btn.cIndex].vip_id,
            'vip_type': RenderParam.orderItems[btn.cIndex].vip_type,
            'price': RenderParam.orderItems[btn.cIndex].price,
            'product_id': btn.cIndex + 1,
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'remark': RenderParam.remark,
            'returnUrl': '',
            'returnPageName': RenderParam.returnPageName,
            'devNo': RenderParam.devNo
        };
        Pay.buildPayInfo(PayInfo);
    },

    /**
     * 初始化订购项
     */
    initButton: function () {
        buttons.push(
            {
                id: 'btn-ok-one',
                name: '一次确定按键',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-cancle-one',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: picPath + '/btn_ok_one_out.png',
                focusImage: picPath + '/btn_ok_one_in.png',
                click: 'showBuyDialogTwo()',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
        buttons.push(
            {
                id: 'btn-cancle-one',
                name: '一次取消按键',
                type: 'img',
                nextFocusLeft: 'btn-ok-one',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: picPath + '/btn_cancle_one_out.png',
                focusImage: picPath + '/btn_cancle_one_in.png',
                click: 'onBack()',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
        buttons.push(
            {
                id: 'btn-ok-two',
                name: '二次确定按键',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-cancle-two',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: picPath + '/btn_ok_one_out.png',
                focusImage: picPath + '/btn_ok_one_in.png',
                click: 'showUserAgreement()',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
        buttons.push(
            {
                id: 'btn-cancle-two',
                name: '二次取消按键',
                type: 'img',
                nextFocusLeft: 'btn-ok-two',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: picPath + '/btn_cancle_one_out.png',
                focusImage: picPath + '/btn_cancle_one_in.png',
                click: 'showBuyDialogOne()',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
        buttons.push(
            {
                id: 'btn-ok-agreement',
                name: '用户协议确定按键',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-cancle-agreement',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: picPath + '/btn_ok_agreement_out.png',
                focusImage: picPath + '/btn_ok_agreement_in.png',
                click: Pay.onPayItemClick,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
        buttons.push(
            {
                id: 'btn-cancle-agreement',
                name: '用户协议取消按键',
                type: 'img',
                nextFocusLeft: 'btn-ok-agreement',
                nextFocusRight: 'btn-upPage-agreement',
                nextFocusUp: 'btn-upPage-agreement',
                nextFocusDown: '',
                backgroundImage: picPath + '/btn_cancle_one_out.png',
                focusImage: picPath + '/btn_cancle_one_in.png',
                click: 'showBuyDialogTwo()',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
        buttons.push(
            {
                id: 'btn-upPage-agreement',
                name: '上一页',
                type: 'img',
                nextFocusLeft: 'btn-cancle-agreement',
                nextFocusRight: 'btn-downPage-agreement',
                nextFocusUp: '',
                nextFocusDown: 'btn-cancle-agreement',
                backgroundImage: picPath + '/btn_upPage_agreement_out.png',
                focusImage: picPath + '/btn_upPage_agreement_in.png',
                click: 'onPagerTurn(-1)',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
        buttons.push(
            {
                id: 'btn-downPage-agreement',
                name: '下一页',
                type: 'img',
                nextFocusLeft: 'btn-upPage-agreement',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'btn-cancle-agreement',
                backgroundImage: picPath + '/btn_downPage_agreement_out.png',
                focusImage: picPath + '/btn_downPage_agreement_in.png',
                click: 'onPagerTurn(1)',
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
                cIndex: 0
            }
        );
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            LMEPG.UI.showToast('没有套餐', 3000);
            onBackDelay();
            return;
        }
        /*var btn = {cIndex: 0};
        Pay.onPayItemClick(btn);*/

        domShowDialog = G("showDialog");
        this.initButton();
        //初始化焦点
        LMEPG.ButtonManager.init("btn-ok-one", buttons, '', true);
        //显示第一次确认弹框
        showBuyDialogOne();
    }
};

/**
 * 显示第一次确认弹窗
 */
function showBuyDialogOne() {
    var _html = '';
    _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/' + RenderParam.platformType + '/Pay/V440094/bg.png"/>';//背景图
    _html += '<div id="btn-text-one">海量视频随心看，首月订购' + (RenderParam.orderItems[0].price / 100) + '元。<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;是否确认订购?<br/></div>';
    _html += '<img id="btn-ok-one" src="__ROOT__/Public/img/' + RenderParam.platformType + '/Pay/V440094/btn_ok_one_out.png"/>';
    _html += '<img id="btn-cancle-one" src="__ROOT__/Public/img/' + RenderParam.platformType + '/Pay/V440094/btn_cancle_one_out.png"/>';
    domShowDialog.innerHTML = _html;
    LMEPG.ButtonManager.requestFocus('btn-ok-one');
}

/**
 * 显示第二次确认弹窗
 */
function showBuyDialogTwo() {
    var _html = '';
    _html += '<div ><img id="default_focus" src="' + picPath + '/bg.png"/>';//背景图
    _html += '<div id="btn-text-two">产品名称：' + RenderParam.orderItems[0].goods_name + '<br/>' +
        '价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格：' + (RenderParam.orderItems[0].price / 100) + '元/月<br/>' +
        // '说&nbsp;&nbsp;明:&nbsp;' + (RenderParam.orderItems[0].description) + '<br/>' +
        '说&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;明：' + 'U点健康会员可观看完整视频' + '<br/>' +
        '</div>';
    _html += '<img id="btn-ok-two" src="' + picPath + '/btn_ok_one_out.png"/>';
    _html += '<img id="btn-cancle-two" src="' + picPath + '/btn_cancle_one_out.png"/>';
    domShowDialog.innerHTML = _html;
    LMEPG.ButtonManager.requestFocus('btn-ok-two');
}

/**
 * 显示用户协议
 */
function showUserAgreement() {
    indexOfUserAgreementPicture = 1;
    var _html = '';
    _html += '<div ><img id="default_focus" src="' + picPath + '/user_agreement_bg1.png"/>';//背景图
    // _html += '<div id="btn-text-agreement">协议内容<br/></div>';
    _html += '<img id="btn-check-agreement" src="' + picPath + '/btn_check_agreement_out.png"/>';
    _html += '<img id="btn-ok-agreement" src="' + picPath + '/btn_ok_agreement_out.png"/>';
    _html += '<img id="btn-cancle-agreement" src="' + picPath + '/btn_cancle_agreement_out.png"/>';
    _html += '<img id="btn-upPage-agreement" src="' + picPath + '/btn_upPage_agreement_out.png"/>';
    _html += '<img id="btn-downPage-agreement" src="' + picPath + '/btn_downPage_agreement_out.png"/>';
    domShowDialog.innerHTML = _html;
    LMEPG.ButtonManager.requestFocus('btn-ok-agreement');
}

/**
 * 用户协议文字翻页（替换图片）
 */
function onPagerTurn(offset) {
    indexOfUserAgreementPicture += offset;
    if (indexOfUserAgreementPicture > 5) {
        indexOfUserAgreementPicture = 5;
    } else if (indexOfUserAgreementPicture < 1) {
        indexOfUserAgreementPicture = 1;
    }
    G('default_focus').src = picPath + '/user_agreement_bg' + indexOfUserAgreementPicture + '.png';
}

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 返回（延时）
 */
function onBackDelay() {
    setTimeout(function () {
        onBack();
    }, 3000);
}

window.onload = function () {
    Pay.init();
};
