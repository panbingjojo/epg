// 传递参数
var AllParam = RenderParam;
AllParam.onFocusSuffix = 'png';
AllParam.moveFocusFromStart = 'jump-winner';
AllParam.moveFocusToStart = 'jump-start';
AllParam.moveFocusFromWinner = 'jump-start';

var Activity = new SuperActivity(AllParam);
var onBack = null;

Activity.eventHandler = function (btn, hasFocus) {

    switch (btn.id) {
        // 退出活动
        case 'btn-one':
        case 'btn-one0':
        case 'btn-one1':
        case 'jump-back':
            Activity.jumpBack();
            break;
        // 模板消失
        case 'btn-rule-close':
        case 'knowledge-back':
        case 'btn-list-cancel':
        case 'btn-uncompleted-sure':
        case 'btn-accomplish-cancel':
            Activity.modal.hide(1);
            break;
        // 支付确认
        case 'btn-pay-sure':
            Activity.jumpBuyVip();
            break;
        // 校验游戏资格
        case 'jump-start':
            Activity.beClickId = btn.id;
            Activity.checkGameQualification(btn);
            Activity.diff(1);
            break;
        case 'btn-list-submit':
        case 'btn-accomplish-submit':
            Activity.setTelephone(btn);
            break;
        // 支付失败
        case 'pay-failed':
            Activity.setPayImageSrc('m_pay_failed');
            break;
        // 支付成功
        case 'pay-success':
            Activity.setPayImageSrc('m_pay_success');
            break;
        // 显示活动规则
        case 'jump-rule':
            Activity.beClickId = btn.id;
            Activity.modal.show('modal-rule', 'btn-rule-close');
            break;
        // 支付取消
        case 'btn-pay-cancel':
            clearTimeout(Activity.cdTimer);
            Activity.isSureAddExtraTimes() && Activity.modal.hide(true);
            break;
        // 显示中奖名单
        case 'jump-winner':
            Activity.beClickId = btn.id;
            Activity.render.winnerListUI(true);
            break;
        // 启动数字小键盘
        case 'rewrite-tel':
        case 'accomplish-tel':
            if (hasFocus) Activity.showKeypad(btn);
            break;
    }
};


Activity.setTelephone = function (btn, isexchange) {
    var me = Activity;
    var isAction = btn.isAction;
    var inputId = isAction === 'isListSubmit' ? 'rewrite-tel' : 'accomplish-tel';
    var userTel = G(inputId).innerText;

    //判断手机号是否正确
    if (!LMUtils.verify.isValidTel(userTel)) {
        LMUtils.dialog.showToast('请输入有效的电话', 1);
        return me;
    }

    // 判断是兑换过奖品
    if (isAction === 'isListSubmit' && !me.myPrizeList.list.length) {
        LMUtils.dialog.showToast('您尚未中奖', 1);
        return me;
    }

    // ajax提交电话号码
    me.ajax.submitUserTel(userTel, isexchange, function () {
        me.userTel = userTel;
        LMUtils.dialog.showToast('提交电话成功！', 2, function () {
            me.reloadPage();
        });
    });
    return me;
};

// 校验游戏资格
Activity.checkGameQualification = function (btn) {
    var me = this;
    if (me.verify.isPlayAllow()) {

        Activity.diff(2);

    } else {
        if (me.verify.isVip) {
            me.modal.show('modal-vip-notimes', 'btn-one1');
        } else {
            me.isPayModal = true;
            me.modal.show('modal-pay-notimes', 'btn-pay-sure');
        }
    }
};

Activity.game = (function () {
    var me = Activity;
    var startEl = G('jump-start');

    function over(data) {
        var prize_id = data.prize_idx || 7;
        startEl.src = me.activityImg + 'jump_start_arrow' + prize_id + '.png';
        var getPrize = [1, 3, 6]; // 配置的中奖ID
        if (getPrize.indexOf(prize_id) !== -1) {
            G('accomplish-tel').innerHTML = me.userTel || '请输入有效的电话';
            G('accomplish-prize').src = me.activityImg + 'V' + me.lmcid + '/prize' + prize_id + '.png';
            setTimeout(function () {
                me.modal.show('modal-accomplish', 'btn-accomplish-submit');
                me.modal.isReload = 1; // 重载当前页面
            }, 1500);
        } else {
            setTimeout(function () {
                LMUtils.dialog.showToast('很抱歉，未获得奖品，下次继续努力！',1,function () {
                    me.reloadPage();
                });
            }, 2000);
        }
    }

    return function () {
        startEl.src = me.activityImg + 'jump_start_active.gif';
        me.ajax.lottery(function (data) {
            console.log(data);
            LMUtils.dialog.hide();
            setTimeout(function () {
                over(data);
            }, 3000);
        });
    };
}());

/*区域差异化处理逻辑函数*/
Activity.diff = function (num) {
    var me = Activity;

    // 该活动新疆地区产品搞了个奇葩需求^_-
    if (me.lmcid !== '650092') {

        // 正常渲染次数
        if (num === 0) {
            me.render['times-count']('剩余抽奖次数：');
        }

        if (num === 2) {
            G('times-count').innerText = '剩余抽奖次数：' + Math.max(0, --me.leftTimes);
            me.uploadUserPlayGame(function () {
                me.game();
            });
        }

        // 除新疆外正常地区走以上流程
        return;
    }

    switch (num) {
        case 0:
            // 新疆-->活动只允许抽奖一次
            me.leftTimes = 1;
            // 重载返回函数
            me.jumpBack = function () {
                // 弹框存在，不是提示订购弹框
                if (me.modal.isModal || me.isPayModal) {
                    me.modal.hide();
                } else {
                    LMEPG.Intent.back();
                }
            };

            // 异步上传参量
            me.ajax.storeUserPlayRecord = function () {
                LMEPG.ajax.postAPI('Activity/saveStoreData', {
                    'key': me.activityInfo.list.unique_name + me.userId,
                    'value': 1
                });
            };

            // UI展示次数情况
            G('times-count').innerText = this.privateUserValue === '1' ? '剩余抽奖次数：0' : '剩余抽奖次数：1';
            break;
        case 1:
            // 新疆电信该活动只允许抽奖一次，故设置一个异步参量
            Activity.ajax.storeUserPlayRecord();
            break;
        case 2:
            if (me.privateUserValue !== '1') {
                G('times-count').innerText = '剩余抽奖次数：' + Math.max(0, --me.leftTimes);
                me.uploadUserPlayGame(function () {
                    me.game();
                });
            } else {
                LMUtils.dialog.showToast('你已经参与过该活动了哦！', 2);
            }
            break;
    }
};

Activity.init = function () {
    this.diff(0);
    this.initButtons();
    this.addButtons();
    this.checkPayState();

    onBack = this.jumpBack;
    LMEPG.BM.init(this.beClickId, this.buttons,"", true);
};

// 注册按钮
Activity.addButtons = function () {
    var imgPrefix = this.activityImg;

    this.buttons.push({
        id: 'btn-rule-close',
        name: '按钮-返回主界面',
        type: 'div',
        backgroundImage: imgPrefix + 'btn_close.png',
        focusImage: imgPrefix + 'btn_close_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-list-submit',
        name: '按钮-提交电话号码',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusRight: 'btn-list-cancel',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        isAction: 'isListSubmit',
        click: this.eventHandler
    }, {
        id: 'btn-list-cancel',
        name: '按钮-取消提交电话/关闭中奖名单',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusLeft: 'btn-list-submit',
        backgroundImage: imgPrefix + 'btn_cancel.png',
        focusImage: imgPrefix + 'btn_cancel_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-uncompleted-sure',
        name: '按钮-没有完成游戏“确认”',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-accomplish-submit',
        name: '按钮-完成游戏提交',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusRight: 'btn-accomplish-cancel',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        isAction: '',
        click: this.eventHandler
    }, {
        id: 'btn-accomplish-cancel',
        name: '按钮-完成游戏取消',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusLeft: 'btn-accomplish-submit',
        backgroundImage: imgPrefix + 'btn_cancel.png',
        focusImage: imgPrefix + 'btn_cancel_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-one',
        name: '',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-one0',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-one1',
        name: '',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        click: this.eventHandler
    }, {
        id: '',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: '',
        nextFocusRight: '',
        backgroundImage: imgPrefix + '',
        focusImage: imgPrefix + '',
        click: this.eventHandler
    });
};