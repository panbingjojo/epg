var AllParam = {
    onFocusSuffix: 'gif',
    moveFocusFromStart: 'jump-exchange',
    moveFocusToStart: 'jump-start',
    moveFocusFromWinner: 'jump-exchange'
};


LMUtils.o_mix(AllParam, RenderParam);

var Activity = new SuperActivity(AllParam);
var onBack = Activity.jumpBack;

Activity.eventHandler = function (btn, hasFocus) {

    switch (btn.id) {
        // 退出活动
        case 'jump-back':
            Activity.jumpBack();
            break;
        // 模板消失

        case 'btn-rule-close':
        case 'knowledge-back':
        case 'btn-list-cancel':
        case 'btn-uncompleted-sure':
        case 'btn-accomplish-cancel':
            Activity.modal.hide();
            break;
        case 'btn-one':
        case 'btn-one0':
        case 'btn-one1':
            Activity.jumpBack();
            break;
        case 'jump-knowledge':
            Activity.beClickId = 'jump-knowledge';
            Activity.modal.show('modal-knowledge', 'knowledge-next', Activity.knowledge);
            break;
        case 'knowledge-next':
            Activity.knowledge();
            break;
        // 支付确认
        case 'btn-pay-sure':
            Activity.jumpBuyVip();
            break;
        // 校验游戏资格
        case 'jump-start':
            Activity.beClickId = btn.id;
            Activity.checkGameQualification(btn);
            break;
        case 'btn-list-submit':
        case 'btn-accomplish-submit':
            Activity.setTelephone(btn, true);
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
            Activity.render.winnerListUI();
            break;
        // 显示兑换奖品界面
        case 'jump-exchange':
            Activity.beClickId = btn.id;
            Activity.render.exchangeUI();
            break;
        // 执行兑换
        case 'btn-exchange-0':
        case 'btn-exchange-1':
        case 'btn-exchange-2':
            Activity.getExchangePrize(btn);
            break;
        // 启动数字小键盘
        case 'rewrite-tel':
        case 'accomplish-tel':
            if (hasFocus) Activity.showKeypad(btn, '150px');
            break;
    }
};

/*校验游戏资格*/
Activity.checkGameQualification = function (btn) {
    var me = this;
    if (me.verify.isPlayAllow()) {
        // 同步进行
        G('times-count').innerText = Math.max(0, --me.leftTimes);
        LMUtils.dialog.showWaiting();
        me.uploadUserPlayGame(function () {
            me.game();
            LMUtils.dialog.hide();
        });
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

    function resultIsGetHealthValue(data) {
        if (data.result === 1) {
            // 获得健康值
            var scoreEl = G('score-count');
            var prevSoreCount = parseInt(scoreEl.innerText);
            var totalScore = prevSoreCount + 5;

            me.ajax.storeUserScore(5, function () {
                me.modal.show('modal-add-score', 'btn-one');
                me.score = totalScore;
                scoreEl.innerText = totalScore;
                LMUtils.dialog.hide();
            });
        } else {
            // 未获得健康值
            me.modal.show('modal-lose-score', 'btn-one0');
            LMUtils.dialog.hide();
        }
    }

    return function () {

        Activity.ajax.lottery(function (data) {
            console.log(data);
            resultIsGetHealthValue(data);
        });
    };
}());

Activity.knowledge = (function () {
    var me = Activity;
    var count = 0;
    var updatePic = function () {
        H('knowledge-back');
        S('knowledge-next');
        G('knowledge-pic').src = me.activityImg + 'txt' + count + '.png';
    };

    return function () {
        updatePic();
        Math.min(2, count += 1);
        if (count === 3) {
            H('knowledge-next');
            S('knowledge-back');
            LMEPG.BM.requestFocus('knowledge-back');
            count = 0;
        }
    };
}());

Activity.init = function () {
    this.initButtons();
    this.addButtons();
    this.checkPayState();
    this.render['times-count']().render['score-count']();
    LMEPG.BM.init(this.beClickId, this.buttons, true);
};

Activity.addButtons = function () {
    this.buttons.push({
        id: 'jump-knowledge',
        name: '按钮-冬季保健备忘录',
        type: 'img',
        nextFocusDown: 'jump-start',
        nextFocusRight: 'jump-back',
        backgroundImage: this.activityImg + 'jump_knowledge.png',
        focusImage: this.activityImg + 'jump_knowledge_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-rule-close',
        name: '按钮-返回主界面',
        type: 'div',
        backgroundImage: this.activityImg + 'btn_close.png',
        focusImage: this.activityImg + 'btn_close_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-list-submit',
        name: '按钮-提交电话号码',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusLeft: '',
        nextFocusRight: 'btn-list-cancel',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        isAction: 'isListSubmit',
        click: this.eventHandler
    }, {
        id: 'btn-list-cancel',
        name: '按钮-取消提交电话/关闭中奖名单',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusLeft: 'btn-list-submit',
        backgroundImage: this.activityImg + 'btn_cancel.png',
        focusImage: this.activityImg + 'btn_cancel_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-uncompleted-sure',
        name: '按钮-没有完成游戏“确认”',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-accomplish-submit',
        name: '按钮-完成游戏提交',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusRight: 'btn-accomplish-cancel',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        isAction: '',
        click: this.eventHandler
    }, {
        id: 'btn-accomplish-cancel',
        name: '按钮-完成游戏取消',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusLeft: 'btn-accomplish-submit',
        backgroundImage: this.activityImg + 'btn_cancel.png',
        focusImage: this.activityImg + 'btn_cancel_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-exchange-0',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-2',
        nextFocusRight: 'btn-exchange-1',
        backgroundImage: this.activityImg + 'btn_exchange.png',
        focusImage: this.activityImg + 'btn_exchange_f.' + this.onFocusSuffix,
        goods_id: this.getExchangeList[0].goods_id,
        click: this.eventHandler
    }, {
        id: 'btn-exchange-1',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-0',
        nextFocusRight: 'btn-exchange-2',
        backgroundImage: this.activityImg + 'btn_exchange.png',
        focusImage: this.activityImg + 'btn_exchange_f.' + this.onFocusSuffix,
        goods_id: this.getExchangeList[1].goods_id,
        click: Activity.eventHandler
    }, {
        id: 'btn-exchange-2',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-1',
        nextFocusRight: 'btn-exchange-0',
        backgroundImage: this.activityImg + 'btn_exchange.png',
        focusImage: this.activityImg + 'btn_exchange_f.' + this.onFocusSuffix,
        goods_id: this.getExchangeList[2].goods_id,
        click: this.eventHandler
    }, {
        id: 'option-A',
        name: '',
        type: 'div',
        nextFocusDown: 'option-B',
        backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
        focusImage: this.activityImg + 'option_f.' + this.onFocusSuffix,
        click: this.eventHandler,
        option: 'A'
    }, {
        id: 'option-B',
        name: '',
        type: 'div',
        nextFocusUp: 'option-A',
        nextFocusDown: 'option-C',
        backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
        focusImage: this.activityImg + 'option_f.' + this.onFocusSuffix,
        click: this.eventHandler,
        option: 'B'
    }, {
        id: 'option-C',
        name: '',
        type: 'div',
        nextFocusUp: 'option-B',
        backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
        focusImage: this.activityImg + 'option_f.' + this.onFocusSuffix,
        click: this.eventHandler,
        option: 'C'
    }, {
        id: 'knowledge-next',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_next.png',
        focusImage: this.activityImg + 'btn_next_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-one',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-one0',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-one1',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'knowledge-back',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'knowledge_back.png',
        focusImage: this.activityImg + 'knowledge_back_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: '',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: '',
        nextFocusRight: '',
        backgroundImage: this.activityImg + '',
        focusImage: this.activityImg + '',
        click: this.eventHandler
    });
};
