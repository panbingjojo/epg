// 全局变量
var buttons = [];

/**
 * 健康提醒模块
 */
var HealthRemind = {
    isShowCheckCode: false, // 显示获取验证码
    phone_list: [], //健康检测短信提示电话
    isShowSure: true,
    phoneLinePage: 1,
    LINE_MAX_PAGE: 2,

    countdownTimer: null, // 获取短信验证码倒计时定时器
    isGetCheckCode: false, // 是否点击获取短信验证码
    SMSCountDown: 60, // 倒计时时间，常规定义60秒

    initButtons: function () {
        buttons.push({
            id: 'btn_select',
            name: "按钮-选择",
            type: 'img',
            nextFocusLeft: 'tel_num',
            nextFocusDown: 'btn_sure',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_select.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_select_f.png',
            beforeMoveChange: '',
            click: HealthRemind.inputCheckCodeEventHandler,
        }, {
            id: 'tel_num',
            name: "号码输入",
            type: 'div',
            backFocusId: 'btn_select',
            focusChange: HealthRemind.onInputFocus,
        }, {
            id: 'btn_sure',
            name: "按钮-确定",
            type: 'img',
            nextFocusUp: 'btn_select',
            nextFocusRight: 'btn_back',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_sure.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_sure_f.png',
            beforeMoveChange: '',
            click: HealthRemind.inputCheckCodeEventHandler,
        }, {
            id: 'btn_back',
            name: "按钮-返回",
            type: 'img',
            nextFocusUp: 'btn_select',
            nextFocusLeft: 'btn_sure',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_back.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_back_f.png',
            beforeMoveChange: '',
            click: HealthRemind.inputCheckCodeEventHandler,
        }, {
            id: 'tel_code',
            name: "验证码输入",
            type: 'div',
            backFocusId: 'btn_code',
            focusChange: HealthRemind.onInputFocus,
        }, {
            id: 'btn_code',
            name: "按钮-获取验证码",
            type: 'img',
            nextFocusLeft: 'tel_code',
            nextFocusUp: 'btn_select',
            nextFocusDown: 'btn_sure',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_code_none.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_code_none_f.png',
            beforeMoveChange: '',
            click: HealthRemind.inputCheckCodeEventHandler,
        }, {
            id: 'btn_update',
            name: "按钮-更改",
            type: 'img',
            nextFocusRight: 'btn_back',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_update.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthRemind/btn_update_f.png',
            beforeMoveChange: '',
            click: HealthRemind.inputCheckCodeEventHandler,
        });
    },


    // 按钮点击
    inputCheckCodeEventHandler: function (btn) {
        switch (btn.id) {
            case 'btn_back':
                // 返回
                LMEPG.Intent.back();
                break;
            case 'btn_sure':
                // 获取输入的电话号码
                var inputNum = G('tel_num').innerHTML;
                if (!LMEPG.Func.isTelPhoneMatched(inputNum)) {
                    LMEPG.UI.showToast('请输入有效手机号');
                    return;
                }

                if ((HealthRemind.phone_list === null || HealthRemind.phone_list.indexOf(inputNum) === -1) && !HealthRemind.isShowCheckCode) {
                    // 显示获取验证码
                    var html = '<div id="tel_code"></div>' +
                        '            <div><img id="btn_code" src="'+ g_appRootPath +'/Public/img/hd/HealthRemind/btn_code_none.png"><p id="code_text">获取验证码</p></div>';
                    G('get_code').innerHTML += html;
                    G('tel_code').style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/HealthRemind/bg_code.png)';
                    buttons[0].nextFocusDown = 'btn_code';
                    buttons[5].nextFocusUp = '';
                    buttons[2].nextFocusUp = 'btn_code';
                    buttons[3].nextFocusUp = 'btn_code';
                    LMEPG.BM.init(btn.id, buttons, '', true);
                    HealthRemind.isShowCheckCode = true;
                    return;
                }

                if (HealthRemind.isShowCheckCode) {
                    var inputCode = G('tel_code').innerHTML;
                    if (inputCode === '') {
                        LMEPG.UI.showToast('请输入验证码');
                        return;
                    } else {
                        HealthRemind.verificationCode(inputNum, inputCode);
                        return;
                    }
                }

                if (HealthRemind.phone_list !== null && HealthRemind.phone_list.indexOf(inputNum) >= -1) {
                    var data = {
                        phone: '',
                        measureNotifyPhone: inputNum
                    };
                    LMEPG.ajax.postAPI('User/setCheckedPhone', data, function (result) {
                        var res = result instanceof Object ? result : JSON.parse(result);
                        if (res.result === 0) {
                            HealthRemind.updateSuccess(inputNum);
                            HealthRemind.isShowCheckCode = false;
                            LMEPG.UI.showToast("设置成功");
                        }
                    });
                }
                break;
            case 'btn_code':
                if (!HealthRemind.isGetCheckCode) { // 当前未处于获取倒计时状态
                    // 调用接口校验手机号码
                    HealthRemind.verifyPhoneNumber(G('tel_num').innerHTML, "1", function () {
                        HealthRemind.isGetCheckCode = true;
                        // 启动定时器，开启倒计时
                        HealthRemind.countdownTimer = setInterval(HealthRemind.updateCountdown, 1000);
                    });
                }
                break;
            case 'btn_update':
                G('btn_update').style.display = 'none';
                G('btn_sure').style.display = 'block';
                G('update_context').innerHTML = '<div>' +
                    '                <img id="btn_select" src="'+ g_appRootPath +'/Public/img/hd/HealthRemind/btn_select.png">' +
                    '                <div id="tel_num"></div>' +
                    '            </div>' +
                    '            <div id="get_code"></div>';
                G('tel_num').style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/HealthRemind/bg_number.png)';
                buttons[0].nextFocusDown = 'btn_sure';
                buttons[2].nextFocusUp = 'btn_select';
                buttons[3].nextFocusUp = 'btn_select';
                buttons[3].nextFocusLeft = 'btn_sure';
                LMEPG.BM.init('tel_num', buttons, '', true);
                break;
            case 'btn_select':
                if (HealthRemind.phone_list !== null) {
                    if (HealthRemind.phone_list.length !== 0 && HealthRemind.phone_list.length > 1) {
                        for (var i = 0; i < HealthRemind.LINE_MAX_PAGE; i++) {
                            G('phone_context').innerHTML += '<div id="phone_line_'+ i +'" class="phone_line"></div>';
                            G('phone_line_' + i).style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/HealthRemind/bg_phone1.png)';
                            buttons.push({
                                id: "phone_line_" + i,
                                name: "按钮-下拉框" + i,
                                type: 'div',
                                backgroundImage: g_appRootPath + '/Public/img/hd/HealthRemind/bg_phone1.png',
                                focusImage: g_appRootPath + '/Public/img/hd/HealthRemind/bg_phone_f.png',
                                beforeMoveChange: HealthRemind.beforeMoveChange,
                                click: HealthRemind.inputCheckCodeEventHandler,
                            });
                            G("phone_line_" + i).style.visibility = 'visible';
                            G("phone_line_" + i).innerHTML = HealthRemind.phone_list[i];
                        }
                    } else {
                        G('phone_context').innerHTML += '<div id="phone_line_0" class="phone_line"></div>';
                        G('phone_line_0').style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/HealthRemind/bg_phone1.png)';
                        buttons.push({
                            id: "phone_line_0",
                            name: "按钮-下拉框0",
                            type: 'div',
                            backgroundImage: g_appRootPath + '/Public/img/hd/HealthRemind/bg_phone1.png',
                            focusImage: g_appRootPath + '/Public/img/hd/HealthRemind/bg_phone_f.png',
                            click: HealthRemind.inputCheckCodeEventHandler,
                        });
                        G("phone_line_0").style.visibility = 'visible';
                        G("phone_line_0").innerHTML = HealthRemind.phone_list[0];
                    }
                    LMEPG.BM.init('phone_line_0', buttons, '', true);
                }
                break;
            case 'phone_line_0':
            case 'phone_line_1':
                G('phone_line_0').style.visibility = 'hidden';
                if (G('phone_line_1') !== null) {
                    G('phone_line_1').style.visibility = 'hidden';
                }
                G('tel_num').innerHTML = G(btn.id).innerHTML;
                HealthRemind.phoneLinePage = 1;
                LMEPG.BM.requestFocus('btn_select');
                break;
        }
    },

    onInputFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if (btn.id === 'tel_num') {
                LMEPG.UI.keyboard.show(692, 424, btn.id, btn.backFocusId, true);
            }
            if (btn.id === 'tel_code') {
                LMEPG.UI.keyboard.show(692, 424, btn.id, 4, 'btn_code');
            }
        }
    },

    beforeMoveChange: function (dir, current) {
        switch (dir) {
            case "up":
                switch (current.id) {
                    case "phone_line_0":
                        if (HealthRemind.phoneLinePage === 1) {
                            break;
                        } else {
                            G('phone_line_0').innerHTML = HealthRemind.phone_list[HealthRemind.LINE_MAX_PAGE * (HealthRemind.phoneLinePage - 1) - 2];
                            G('phone_line_1').style.visibility = 'visible';
                            G('phone_line_1').innerHTML = HealthRemind.phone_list[HealthRemind.LINE_MAX_PAGE * (HealthRemind.phoneLinePage - 1) - 1];
                        }
                        HealthRemind.phoneLinePage --;
                        LMEPG.BM.requestFocus('phone_line_1');
                        break;
                    case "phone_line_1":
                        LMEPG.BM.requestFocus('phone_line_0');
                        break;
                }
                break;
            case "down":
                switch (current.id) {
                    case "phone_line_0":
                        if (HealthRemind.phoneLinePage * HealthRemind.LINE_MAX_PAGE - 1 === HealthRemind.phone_list.length) {
                            break;
                        }
                        LMEPG.BM.requestFocus('phone_line_1');
                        break;
                    case "phone_line_1":
                        if (HealthRemind.phoneLinePage === Math.ceil(HealthRemind.phone_list.length / HealthRemind.LINE_MAX_PAGE)) {
                            break;
                        } else {
                            G('phone_line_0').innerHTML = HealthRemind.phone_list[HealthRemind.LINE_MAX_PAGE * HealthRemind.phoneLinePage];
                            if (HealthRemind.LINE_MAX_PAGE * HealthRemind.phoneLinePage + 1 > HealthRemind.phone_list.length - 1) {
                                G('phone_line_1').style.visibility = 'hidden';
                            } else {
                                G('phone_line_1').innerHTML = HealthRemind.phone_list[HealthRemind.LINE_MAX_PAGE * HealthRemind.phoneLinePage + 1];
                            }
                            LMEPG.BM.requestFocus('phone_line_0');
                            HealthRemind.phoneLinePage ++;
                        }
                        break;
                }
                break;
        }
    },

    verificationCode: function (inputNum, inputCode) {
        // 调用后台接口校验短信验证码
        var postData = {
            phone: inputNum,
            sms_code: inputCode,
        };
        LMEPG.ajax.postAPI("Doctor/verifyTelCode", postData, function (result) {
            var res = result instanceof Object ? result : JSON.parse(result);
            if (res.result === 0) {
                var data = {
                    phone: inputNum,
                    measureNotifyPhone: inputNum
                };
                LMEPG.ajax.postAPI('User/setCheckedPhone', data, function (result) {
                    var res = result instanceof Object ? result : JSON.parse(result);
                    if (res.result === 0) {
                        G('phone_context').innerHTML = '';
                        HealthRemind.updateSuccess(inputNum);
                        HealthRemind.isShowCheckCode = false;
                        clearInterval(HealthRemind.countdownTimer);
                        LMEPG.UI.showToast("设置成功");
                    }
                });
            } else {
                LMEPG.UI.showToast("短信验证校验失败！");
            }
        });
    },

    updateSuccess: function (inputNum) {
        var ht = '<div id="tel_title">您设置的手机号：</div>' +
            '            <div id="tel_context">'+ inputNum +'</div>';
        G('update_context').innerHTML = ht;
        buttons[3].nextFocusLeft = 'btn_update';
        buttons[3].nextFocusUp = '';
        LMEPG.BM.init('btn_update', buttons, '', true);
        G('btn_update').style.display = 'block';
        G('btn_sure').style.display = 'none';
        LMEPG.ajax.postAPI('User/getCheckedPhone', null, function (result) {
            var res = result instanceof Object ? result : JSON.parse(result);
            if (res.result === 0 && res.data.phone_list !== null) {
                HealthRemind.phone_list = res.data.phone_list.split(',');
            }
        });
    },

    /** 更新倒计时 */
    updateCountdown: function () {
        G('code_text').innerHTML = '获取验证码（' + (--HealthRemind.SMSCountDown) + "S）";
        if (HealthRemind.SMSCountDown <= 0) { // 倒计时完成，恢复对应的变量状态
            clearInterval(HealthRemind.countdownTimer);
            G('code_text').innerHTML = "获取验证码";
            HealthRemind.SMSCountDown = 60;
            HealthRemind.isGetCheckCode = false;
        }
    },

    /**
     * 电话问诊时校验电话号码
     * @param phoneNum 电话号码
     * @param isCheckSMSCode 是否需要检测手机短信验证码
     * @param callback 校验成功回调
     */
    verifyPhoneNumber: function (phoneNum, isCheckSMSCode, callback) {
        var postData = {
            'phone': phoneNum,
            'send_sms': isCheckSMSCode
        };

        LMEPG.UI.showWaitingDialog("", 10);
        LMEPG.ajax.postAPI("Doctor/verifyPhoneNumber", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data.result == 0) {
                    callback(data);
                } else {
                    LMEPG.UI.showToast('校验问诊号码错误');
                }
                LMEPG.UI.dismissWaitingDialog();
            } catch (e) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast('校验问诊号码据解析异常');
            }
        }, function () {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast('获取验证码失败');
        });
    },

    // 初始化内部参数
    _initParam: function () {
        G('title_context').innerHTML = '<div id="head_title">健康提醒设置</div>' +
            '        <div id="head_context">请输入您的手机号，您家人的血压检测数据会发送到该手机号码中。</div>';
        G('fool_context').innerHTML = '<img id="btn_sure" src="'+ g_appRootPath +'/Public/img/hd/HealthRemind/btn_sure.png">' +
            '            <img id="btn_update" src="'+ g_appRootPath +'/Public/img/hd/HealthRemind/btn_update.png" style="display: none">' +
            '            <img id="btn_back" src="'+ g_appRootPath +'/Public/img/hd/HealthRemind/btn_back.png">';

        var res = RenderParam.checkedPhone;
        if (res.result === 0) {
            if (res.data !== null) {
                if (res.data.phone_list !== null) {
                    HealthRemind.phone_list = res.data.phone_list.split(',');
                }
                if (res.data.measure_notify_phone !== null) {
                    HealthRemind.updateSuccess(res.data.measure_notify_phone);
                }
            } else {
                G('phone_context').innerHTML = '<img id="btn_select" src="'+ g_appRootPath +'/Public/img/hd/HealthRemind/btn_select.png">' +
                    '                <div id="tel_num"></div>';
                G('tel_num').style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/HealthRemind/bg_number.png)';
                LMEPG.BM.init('tel_num', buttons, '', true);
            }
        }
    },

    /**
     * 初始化页面
     */
    init: function () {
        this.initButtons();
        this._initParam();
    }
};

function onBack() {
    if (G('phone_line_0') !== null && G('phone_line_0').style.visibility === 'visible') {
        G('phone_line_0').style.visibility = 'hidden';
        if (G('phone_line_1') !== null) {
            G('phone_line_1').style.visibility = 'hidden';
        }
        LMEPG.BM.requestFocus('btn_select');
    } else {
        LMEPG.Intent.back();
    }
}
