/**
 * 跳转 - 订购页
 */
function jumpBuyVip(btn) {
    var PayInfo = {
        'vip_id': RenderParam.orderItems[0].vip_id,
        'product_id': 1,
        'userId': RenderParam.userId,
        'isPlaying': RenderParam.isPlaying,
        'orderReason': RenderParam.orderReason,
        'remark': RenderParam.remark,
        'returnUrl': '',
        'returnPageName': RenderParam.returnPageName
    };
    buildPayUrlAndJump(PayInfo);
}

/**
 * 构建支付地址
 * @param payInfo
 */
function buildPayUrlAndJump(payInfo) {
    LMEPG.UI.showWaitingDialog('');
    // 生成地址后，就认为订购成功;
    LMEPG.ajax.postAPI('Pay/buildPayUrlAndPay', payInfo, function (data) {
        LMEPG.UI.dismissWaitingDialog('');
        if (data.result == 0) {
            RenderParam.payResult = 0; // 记录订购成功状态
            showPayResultToast('success');
            LMEPG.ButtonManager.requestFocus('success-btn');
        } else {
            RenderParam.payResult = -1;
            RenderParam.payResultDesc = data.message;
            showPayResultToast('failed');
            LMEPG.ButtonManager.requestFocus('failed-btn');
        }
    });
}

/**
 * 显示订购结果
 * @param type 是否订购成功
 */
function showPayResultToast(type) {
    var _html = '';
    if (type == 'success') {
        _html = '<img id="default_focus" src="' + RenderParam.toastPicUrl + 'toast.png"/>';
        _html += '<div id="toast_message_text">订购成功</div>'; // 提示内容
        _html += '<div id="toast_message_submit">确认</div>'; // 确定按钮
    } else {
        _html = '<img id="default_focus" src="' + RenderParam.toastPicUrl + 'toast.png"/>';
        _html += '<div id="toast_message_text">订购失败</div>'; // 提示内容
        _html += '<div id="pay_result_description"> ' + RenderParam.payResultDesc + '</div>'; // 提示内容
        _html += '<div id="toast_message_submit">确认</div>'; // 确定按钮
    }

    G('toast').innerHTML = _html;
}

var buttons = [
    {
        id: 'order_vip',
        name: '订购按钮',
        type: 'img',
        nextFocusLeft: '',
//            nextFocusRight: 'back',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_sure_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_sure_btn_focus.png',
        click: onClick,
        focusChange: LMEPG.emptyFunc,
        beforeMoveChange: LMEPG.emptyFunc,
        moveChange: LMEPG.emptyFunc
    }, {
        id: 'back',
        name: '返回按钮',
        type: 'img',
        nextFocusLeft: 'order_vip',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_cancle_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_cancle_btn_focus.png',
        click: onClick,
        focusChange: LMEPG.emptyFunc,
        beforeMoveChange: LMEPG.emptyFunc,
        moveChange: LMEPG.emptyFunc
    }, {
        id: 'second-sure',
        name: '确认订购',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'second-cancle',
        nextFocusUp: 'verify_code_label',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_sure_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_sure_btn_focus.png',
        click: onClick,
        focusChange: LMEPG.emptyFunc,
        beforeMoveChange: LMEPG.emptyFunc,
        moveChange: LMEPG.emptyFunc
    }, {
        id: 'second-cancle',
        name: '取消订购',
        type: 'img',
        nextFocusLeft: 'second-sure',
        nextFocusRight: '',
        nextFocusUp: 'verify_code_clean',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_cancle_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_cancle_btn_focus.png',
        click: onClick,
        focusChange: LMEPG.emptyFunc,
        beforeMoveChange: LMEPG.emptyFunc,
        moveChange: LMEPG.emptyFunc
    }, {
        id: 'success-btn',
        name: '成功',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_sure_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_sure_btn_focus.png',
        click: onClick,
        focusChange: LMEPG.emptyFunc,
        beforeMoveChange: LMEPG.emptyFunc,
        moveChange: LMEPG.emptyFunc
    }, {
        id: 'failed-btn',
        name: '失败',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_sure_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/first_sure_btn_focus.png',
        click: onClick,
        focusChange: LMEPG.emptyFunc,
        beforeMoveChange: LMEPG.emptyFunc,
        moveChange: LMEPG.emptyFunc
    }, {
        id: 'verify_code_label',
        name: '验证码输入框',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'verify_code_clean',
        nextFocusUp: '',
        nextFocusDown: 'second-sure',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/verify_code_label.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/verify_code_label_focus.png',
        click: '',
        focusChange: LMEPG.emptyFunc,
        beforeMoveChange: LMEPG.emptyFunc,
        moveChange: LMEPG.emptyFunc
    }, {
        id: 'verify_code_clean',
        name: '清空验证码',
        type: 'img',
        nextFocusLeft: 'verify_code_label',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: 'second-sure',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/verify_code_clean.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/verify_code_clean_focus.png',
        click: onClick,
        focusChange: LMEPG.emptyFunc,
        beforeMoveChange: LMEPG.emptyFunc,
        moveChange: LMEPG.emptyFunc
    }
];

LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_0: 'writteNum(0)',
        KEY_1: 'writteNum(1)',
        KEY_2: 'writteNum(2)',
        KEY_3: 'writteNum(3)',
        KEY_4: 'writteNum(4)',
        KEY_5: 'writteNum(5)',
        KEY_6: 'writteNum(6)',
        KEY_7: 'writteNum(7)',
        KEY_8: 'writteNum(8)',
        KEY_9: 'writteNum(9)'
    });

if (RenderParam.firstPayFocusPosition == 0) {
    LMEPG.ButtonManager.init('order_vip', buttons, '', true);
    showPrice(RenderParam.payPrice, RenderParam.payMessage);
    H('order_vip');
    H('back');
} else {
//        LMEPG.ButtonManager.init('back', buttons, '', true);
    showPrice(RenderParam.payPrice, RenderParam.payMessage);
    H('order_vip');
    H('back');
}

function showPrice(price, info) {
    G('price-info').innerHTML = '-' + info;
    G('price-head').innerHTML = '￥' + price;
    G('price-right').innerHTML = '海量健康资讯，足不出户访名医，39健康，您的家庭健康顾问!';
    G('price-center').innerHTML = '￥' + price;
}

/**
 * 处理订购完成回来的操作，如果是播放视频引起，就跳转播放视频，
 * 如果不是播放视频引起，就直接返回。
 */
function doProcess() {
    if (RenderParam.isPlaying) {
        jumpPlayVideo(RenderParam.videoInfo);
    } else {
        onBack();
    }
}

/**
 * 返回键
 */
function onBack() {
    var judge = getComputedStyle(G('second-model'), null).display;
    if (judge == 'none') {
        LMEPG.Intent.back();
    } else {
        // 如果当弹出框时，按返回，就把弹出框隐藏掉
        G('product_price').innerHTML = '';
        G('content').innerHTML = '';
        Hide('second-model');
        if (RenderParam.firstPayFocusPosition == 1) {
            LMEPG.ButtonManager.requestFocus('order_vip');
        } else {
            LMEPG.ButtonManager.requestFocus('back');
        }
    }
}

/**
 * 点击事件
 * @param btn
 */
var status = 0; // 1成功订购、0失败订购
function onClick(btn) {
    switch (btn.id) {
        case 'order_vip':
            if (RenderParam.isPayUnifyAuth == 1) {
                Pay.jumpUnifiedAuthUrl();
            } else {
                jumpOrderToast(); // 弹二次订购
            }
            break;
        case 'back':
            onBack();
            break;
        case 'second-sure':
            if (checkVerifyCode()) {
                jumpBuyVip(btn); // 掉局方计费--
                Hide('second-model');
            }
            break;
        case 'second-cancle':
            G('product_price').innerHTML = '';
            G('content').innerHTML = '';
            Hide('second-model');
            if (RenderParam.firstPayFocusPosition == 0) {
                LMEPG.ButtonManager.requestFocus('order_vip');
            } else {
                LMEPG.ButtonManager.requestFocus('back');
            }
            break;
        case 'success-btn':
            Hide('success');
            doProcess();
            break;
        case 'failed-btn':
            Hide('failed');
            onBack();
            break;
        case 'verify_code_clean':
            onCleanVerifyCode();
            break;
    }
}

// 弹出二次确认页
function jumpOrderToast() {
    Show('second-model');
    G('product_price').innerHTML = '<img src="__ROOT__/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/25_yuan.png" />'; // 资费信息

    // 如果是要输入验证码，则显示验证码
    if (RenderParam.hasVerifyCode == 1) {
        // 当弹出验证码输入框时，重新刷新系统验证码与用户输入的验证码
        RenderParam.verifyCode = buildVerifyCode();

        G('content').innerHTML += '<img id="verify_code_label" src="__ROOT__/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/verify_code_label.png" />';
        G('content').innerHTML += '<img id="verify_code_clean" src="__ROOT__/Public/img/' + RenderParam.platformType + '/Pay/V000051/V4/verify_code_clean.png" />';

        // 验证码
        G('content').innerHTML += '<div id="verify_code_system_text">' + RenderParam.verifyCode + '</div>'; // 系统生成
        G('content').innerHTML += '<div id="verify_code_input_text"></div>'; // 系统生成
        G('verify_code_input_text').innerHTML = '';
        RenderParam.userInputVerifyCode = '';
    }
    // 根据参数来判断默认焦点的位置
    if (RenderParam.secondPayFocusPosition == 0) {
        LMEPG.ButtonManager.requestFocus('second-sure');
    } else if (RenderParam.secondPayFocusPosition == 1) {
        LMEPG.ButtonManager.requestFocus('second-cancle');
    } else if (RenderParam.secondPayFocusPosition == 2 && RenderParam.hasVerifyCode == 1) {
        LMEPG.ButtonManager.requestFocus('verify_code_label');
    } else {
        LMEPG.ButtonManager.requestFocus('second-cancle');
    }
}

// 生成4位数验证码
function buildVerifyCode() {
    var num = '';
    for (var i = 0; i < 4; i++) {
        num += Math.floor(Math.random() * 10);
    }

    return num;
}

// 清除验证码
function onCleanVerifyCode() {
    G('verify_code_input_text').innerHTML = '';
    RenderParam.userInputVerifyCode = '';
    LMEPG.ButtonManager.requestFocus('verify_code_label');
}

// 用户输入验证码
function writteNum(keyNum) {
    // 如果焦点在验证码输入框上，才能输入验证码
    var focusId = LMEPG.ButtonManager.getCurrentButton().id;
    if (focusId != 'verify_code_label') {
        return;
    }

    if (RenderParam.userInputVerifyCode.length < 4) {
        RenderParam.userInputVerifyCode += keyNum;
        G('verify_code_input_text').innerHTML = RenderParam.userInputVerifyCode;
    }
}

// 判断用户输入是否正确
function checkVerifyCode() {
    // 如果没有验证码，则不需要判断验证码
    if (RenderParam.hasVerifyCode == 1) {
        // 判断验证码是否正确，如果不正确再让用户进行输入
        if (RenderParam.userInputVerifyCode != RenderParam.verifyCode) {
            LMEPG.UI.showToast('验证码输入有误，请重新输入！');
            return false;
        }
    }

    return true;
}

/* 订购成功后，如果是播放视频，就跳入播放器*/
/**
 * 跳转 - 播放器
 */
function jumpPlayVideo(videoInfo) {

    // 更多视频，按分类进入
    var objPlayer = LMEPG.Intent.createIntent('player');
    objPlayer.setParam('userId', RenderParam.userId);
    objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

    LMEPG.Intent.jump(objPlayer, null);
}

