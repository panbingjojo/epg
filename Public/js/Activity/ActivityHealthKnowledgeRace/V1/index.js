var AllParam = {
    onFocusSuffix: 'png',
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
        // 上传电话号码
        case 'option-A':
        case 'option-B':
        case 'option-C':
            Activity.game(btn.option);
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
            if (hasFocus) Activity.showKeypad(btn);
            break;
    }
};

/*校验游戏资格*/
Activity.checkGameQualification = function (btn) {
    var me = this;
    if (me.verify.isPlayAllow()) {
        // 同步进行
        G('times-count').innerText = Math.max(0, --me.leftTimes);
        me.uploadUserPlayGame(function () {
            me.modal.show('modal-game', 'option-A', Activity.game());
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

Activity.addButtons = function () {
    this.buttons.push({
        id: 'jump-knowledge',
        name: '按钮-冬季保健备忘录',
        type: 'img',
        nextFocusDown: 'jump-start',
        nextFocusRight: 'jump-back',
        backgroundImage: this.activityImg + 'jump_knowledge.png',
        focusImage: this.activityImg + 'jump_knowledge_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-rule-close',
        name: '按钮-返回主界面',
        type: 'div',
        backgroundImage: this.activityImg + 'btn_close.png',
        focusImage: this.activityImg + 'btn_close_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-list-submit',
        name: '按钮-提交电话号码',
        type: 'img',
        nextFocusUp: this.platformType === 'sd' ? 'rewrite-tel' : '',
        nextFocusLeft: this.platformType === 'hd' ? 'rewrite-tel' : '',
        nextFocusRight: 'btn-list-cancel',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.png',
        isAction: 'isListSubmit',
        click: this.eventHandler
    }, {
        id: 'btn-list-cancel',
        name: '按钮-取消提交电话/关闭中奖名单',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusLeft: 'btn-list-submit',
        backgroundImage: this.activityImg + 'btn_cancel.png',
        focusImage: this.activityImg + 'btn_cancel_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-uncompleted-sure',
        name: '按钮-没有完成游戏“确认”',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-accomplish-submit',
        name: '按钮-完成游戏提交',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusRight: 'btn-accomplish-cancel',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.png',
        isAction: '',
        click: this.eventHandler
    }, {
        id: 'btn-accomplish-cancel',
        name: '按钮-完成游戏取消',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusLeft: 'btn-accomplish-submit',
        backgroundImage: this.activityImg + 'btn_cancel.png',
        focusImage: this.activityImg + 'btn_cancel_f.png',
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
        focusImage: this.activityImg + 'btn_exchange_f.png',
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
        focusImage: this.activityImg + 'btn_exchange_f.png',
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
        focusImage: this.activityImg + 'btn_exchange_f.png',
        goods_id: this.getExchangeList[2].goods_id,
        click: this.eventHandler
    }, {
        id: 'option-A',
        name: '',
        type: 'div',
        nextFocusDown: 'option-B',
        backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
        focusImage: this.activityImg + 'option_f.png',
        click: this.eventHandler,
        option: 'A'
    }, {
        id: 'option-B',
        name: '',
        type: 'div',
        nextFocusUp: 'option-A',
        nextFocusDown: 'option-C',
        backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
        focusImage: this.activityImg + 'option_f.png',
        click: this.eventHandler,
        option: 'B'
    }, {
        id: 'option-C',
        name: '',
        type: 'div',
        nextFocusUp: 'option-B',
        backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
        focusImage: this.activityImg + 'option_f.png',
        click: this.eventHandler,
        option: 'C'
    }, {
        id: 'knowledge-next',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_next.png',
        focusImage: this.activityImg + 'btn_next_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-one',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-one0',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.png',
        click: this.eventHandler
    }, {
        id: 'btn-one1',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.png',
        click: this.eventHandler
    }, {
        id: 'knowledge-back',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'knowledge_back.png',
        focusImage: this.activityImg + 'knowledge_back_f.png',
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

Activity.game = (function () {
    var me = Activity;
    var count = 0;
    var answerResult = [];
    var useData;
    var data = [
        {subjectTitle: '流行性感冒的传播途径是什么？', subjectA: 'A、空气飞沫', subjectB: ' B、饮水', subjectC: 'C、苍蝇', rightAnswer: 'A'},
        {subjectTitle: '冬天到了，应该多吃：', subjectA: 'A、性温热食物', subjectB: 'B、性寒凉食物', subjectC: 'C、随便吃，我的身体棒棒的', rightAnswer: 'A'},
        {subjectTitle: '冬季健身运动应选：', subjectA: 'A、快走', subjectB: 'B、快跑', subjectC: 'C、我不喜欢运动', rightAnswer: 'A'},
        {subjectTitle: '冬季运动时间应在（）为宜', subjectA: 'A、08:00~09:00', subjectB: 'B、10:00~11:00', subjectC: 'C、18:00~19:00', rightAnswer: 'C'},
        {subjectTitle: '冬天到了，为了防止静电，我要选：', subjectA: 'A、化纤材质的衣服', subjectB: 'B、纯棉材质的衣服 ', subjectC: 'C、呢绒材质的衣服', rightAnswer: 'B'},
        {subjectTitle: '冬天长了冻疮，我可以：', subjectA: 'A、多烤火', subjectB: 'B、柚子皮煮水擦洗', subjectC: 'C、在雪里搓一搓', rightAnswer: 'B'},
        {subjectTitle: '冬天到了要重点保护：', subjectA: 'A、头', subjectB: 'B、腿 ', subjectC: 'C、脚', rightAnswer: 'C'},
        {subjectTitle: '冬天的晚上你打算冲一杯蜂蜜水，这时你要用：', subjectA: 'A、热水冲', subjectB: 'B、温水冲', subjectC: ' C、冷水冲', rightAnswer: 'B'},
        {subjectTitle: '冬天的低温下，维持我们身体热量的最大供给源是：', subjectA: 'A、脂肪', subjectB: 'B、糖', subjectC: 'C、蛋白质', rightAnswer: 'B'},
        {subjectTitle: '下列属于御寒食物的是：', subjectA: 'A、冬笋', subjectB: 'B、萝卜', subjectC: 'C、姜', rightAnswer: 'C'}
    ];

    // 更新题目数据
    var updateSubjectData = function () {
        var rN = LMUtils.getRandom(0, 7);
        useData = LMUtils.shuffle(data).slice(rN, rN + 3);
    };

    // 获得正确答题个数
    var getRightCount = function () {
        var ret = 0;
        var i = answerResult.length;
        while (i--) {
            if (answerResult[i]) ret++;
        }
        return ret;
    };

    // 增加积分
    var addUserScore = function (num) {
        G('p-add-score').innerText = num * 6;
        me.ajax.storeUserScore(num * 6, function () {
            me.score = +me.score + num * 6;
            G('score-count').innerText = me.score;
            LMUtils.dialog.hide();
        });
    };

    // 重新设置题目
    var resetSubject = function () {
        var rightCount = getRightCount();
        var showModalId = rightCount > 0 ? 'modal-add-score' : 'modal-lose-score';
        var focusId = showModalId === 'modal-add-score' ? 'btn-one' : 'btn-one0';

        addUserScore(rightCount);
        me.modal.show(showModalId, focusId);
        count = 0;
        answerResult = [];
        updateSubjectData();
        // me.reloadPage();
    };

    // 存储回答的结果
    var storeAnswerResult = function (optin, callback) {
        var rightAnswer = useData[count].rightAnswer;
        var ret = optin === rightAnswer;
        var nextQuestion = function () {
            count === 2 ? resetSubject() : callback(count++);
        };

        // 记录答题结果
        answerResult.push(ret);
        if (ret) {
            LMUtils.dialog.showToast('恭喜答对了！', 1, nextQuestion);
        } else {
            LMUtils.dialog.showToast('答错了哦！正确答案为：' + rightAnswer, 1, nextQuestion);
        }
    };

    // 展示题目
    var showQuestion = function () {
        var i = 0;
        var navhtm = '<ul id="subject-nav">';
        var htm = '<p id="subject-count">' + (count + 1) + '</p>';
        var processIcon;

        htm += '<div id="subject-wrap">';
        htm += '<p id="subject-title">' + useData[count].subjectTitle + '</p>';
        htm += '<ul id="subject-options">';
        htm += '<li id="option-A">' + useData[count].subjectA;
        htm += '<li id="option-B">' + useData[count].subjectB;
        htm += '<li id="option-C">' + useData[count].subjectC;
        htm += '</ul><p id="subject-desc">做出选择后自动转入下一个</p>';

        while (i < useData.length) {
            navhtm += '<li class="subject-' + i + '">';
            processIcon = 'icon_process';
            if (i <= answerResult.length) {
                processIcon = 'icon_process_f';
            }
            navhtm += '<img   id="subject-' + i + '" src="' + me.activityImg + processIcon + '.png">';
            i++;
        }

        G('modal-game').innerHTML = (htm + navhtm);
        LMEPG.BM.requestFocus('option-A');
    };

    // 首次加载执行一次题目更新
    updateSubjectData();
    showQuestion();
    // 更新题目
    return function (optin) {
        // 保存回答的结果
        Activity.gameStart = true;
        optin && storeAnswerResult(optin, showQuestion);
    };
}());


Activity.init = function () {
    this.initButtons();
    this.addButtons();
    this.checkPayState();
    this.render['times-count']().render['score-count']();
    LMEPG.BM.init(this.beClickId, this.buttons, true);
};
