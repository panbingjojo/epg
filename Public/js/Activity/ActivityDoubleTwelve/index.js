var AllParam = {
    onFocusSuffix: 'png',
    moveFocusToStart: 'jump-start'
};

LMUtils.o_mix(AllParam, RenderParam);

var Activity = new SuperActivity(AllParam);
var onBack = Activity.jumpBack;

/*校验游戏资格*/
Activity.checkGameQualification = function (btn) {
    var me = this;
    if (me.verify.isPlayAllow()) {
        // 同步进行
        G('times-count').innerText = Math.max(0, --me.leftTimes);
        LMEPG.BM.requestFocus('hole-focus-0');
        me.uploadUserPlayGame();
        me.game.start();
    } else {
        if (me.verify.isVip) {
            me.modal.show('modal-vip-notimes', 'btn-one1');
        } else {
            me.isPayModal = true;
            me.modal.show('modal-pay-notimes', 'btn-pay-sure');
        }
    }
};

/*健康知识预览*/
Activity.knowledge = (function () {
    var me = Activity;
    var page = 1; // 初始话起始页数
    var maxPage = me.platformType === 'hd' ? 2 : 4; // 设置最大页数
    var updatePic = function () {
        G('knowledge-pic').src = me.activityImg + 'txt' + 0 + '.png';
        // page++;
    };
    var isMaxPage = function () {
        if (page === maxPage) {
            page = 0;
            H('knowledge-next');
            S('knowledge-back');
            // LMEPG.BM.requestFocus('knowledge-back');
        }
    };

    return {

        nextPage: function () {
            updatePic();
            isMaxPage();
            console.log(page);
        },

        hideKnowledge: function () {
            updatePic();
        },

        showKnowledgePage: function () {
            S('knowledge-back');
            me.modal.show('modal-knowledge', 'knowledge-back');
        }
    };
}());

/*游戏机制处理对象*/
Activity.game = (function () {
    var me = Activity;
    var cd = 15;
    var outTimer = null;
    var mouse = {offsetY: 238, offsetYMax: 1904};
    var stateTime = 1500; // 停留两秒；
    var fs = 1000 / 5; // 帧率
    var prevHole = G('hole-0');
    var score = 0;
    var randNum;
    var btnIndexNumber = 0; // 按钮的索引值

    function setAnimateOffsetY(element, num) {
        element.style.backgroundPositionY = num + 'px';
    }

    function mouseOutHole() {
        randNum = LMUtils.getRandom(0, 5);
        var elementHole = G('hole-' + randNum);
        var count = 0; // 偏移变量
        prevHole.removeAttribute('class');
        setAnimateOffsetY(prevHole, 0);
        elementHole.className = 'active';
        prevHole = elementHole;

        (function animate() {
            var nFs = 60; // 正常频率
            setAnimateOffsetY(elementHole, -count);
            count = Math.min(mouse.offsetYMax, count += mouse.offsetY);
            outTimer = setTimeout(animate, fs);

            // 出来显示2秒龟缩回去^_^
            if (count / mouse.offsetY === 4) {
                // 清除不必要的计时器
                clearTimeout(outTimer);
                nFs = btnIndexNumber === randNum ? nFs : stateTime;

                console.log(nFs, btnIndexNumber, randNum);
                outTimer = setTimeout(animate, nFs);
                // 悬停时候模拟获得焦点事件触发
                isCrash(btnIndexNumber);
            }

            // 一个流程结束循环进行
            if (count / mouse.offsetY === 8) {
                // 清除不必要的计时器
                clearTimeout(outTimer);
                mouseOutHole();
            }
        }());

    }

    function clearTimer() {
        clearTimeout(outTimer);
        clearInterval(me.cdTimer);
    }

    function isCrash(count) {
        if (randNum === count) {
            score += 1;
            LMEPG.UI.showToast('+1',1)
            console.log('score==>', score);
            G('hole-' + randNum).className = 'success';
        }
    }

    /**
     * 确认去抽奖
     */
    function isSureToLottery() {
        if (score >= 3) { // 成功砸中3个以上的鼠洞
            G('game-success-score').innerHTML = score;
            me.modal.show('modal-game-success', 'btn-game-success');
        } else {
            G('game-lose-score').innerHTML = score;
            me.modal.show('modal-game-lose', 'btn-game-lose');
            me.modal.isReload = 1;
        }

        // 还原游戏数据
        G('game-cd').innerHTML = '15s';
        // G(prevHole).style.backgroundImage = 'url(' + me.activityImg + 'transparent.png)';
        score = 0;
        cd = 15;
    }

    /*游戏cd*/
    function gameCd() {
        var gameCdEl = G('game-cd');
        var countDown = function () {
            cd--;
            gameCdEl.innerHTML = cd + 's';
            if (cd < 0) {
                clearTimer();
                isSureToLottery();
            }
        };

        me.cdTimer = setInterval(countDown, 1000);
    }

    return {
        start: function () {
            gameCd();
            mouseOutHole();
        },

        lottery: function () {
            LMUtils.dialog.showWaiting();
            me.ajax.lottery(function (data) {
                console.log(data);
                // 抽中了奖品
                if (data.result === 1) {
                    // 设置奖品图片
                    G('accomplish-prize').src = me.activityImg + 'V' + me.lmcid + '/prize' + data.prize_idx + '.png';
                    me.modal.show('modal-lottery-success', 'btn-accomplish-submit');
                    me.modal.isReload = 1;
                    LMUtils.dialog.hide();
                }
                // 没有抽中奖品
                else if (data.result === 0) {
                    me.modal.show('modal-lottery-lose', 'btn-lottery-lose');
                    me.modal.isReload = 1;
                    LMUtils.dialog.hide();
                }
            });
        },

        // 地鼠洞获得焦点事件
        holeOnfocus: function (btn, hasFocus) {
            if (hasFocus) {
                btnIndexNumber = parseInt(btn.id.slice(-1));
                isCrash(btnIndexNumber);
            }
        },
    };


}());

Activity.init = function () {
    this.initButtons();
    this.addButtons();
    this.checkPayState();
    this.render['times-count']();
    LMEPG.BM.init(this.beClickId, this.buttons, true);
    LMEPG.BM.getButtonById('jump-back').nextFocusLeft = 'jump-start';
    LMEPG.BM.getButtonById('jump-winner').nextFocusLeft = 'jump-start';
    LMEPG.BM.getButtonById('jump-winner').nextFocusDown = 'jump-start';
    LMEPG.BM.getButtonById('jump-rule').nextFocusLeft = 'jump-start';
    G(this.beClickId).src = this.activityImg + 'jump_start_f.gif';
    LMEPG.BM.getButtonById('jump-start').focusImage = this.activityImg + 'jump_start_f.gif';
};

/**
 * 所有事件集合处理程序
 * @param btn
 * @param hasFocus
 */
Activity.eventHandler = function (btn, hasFocus) {

    switch (btn.id) {
        // 退出活动
        case 'jump-back':
            Activity.jumpBack();
            break;
        // 模板消失
        case 'btn-game-lose':
        case 'btn-rule-close':
        case 'btn-list-cancel':
        case 'btn-lottery-lose':
        case 'btn-uncompleted-sure':
        case 'btn-accomplish-cancel':
            Activity.modal.hide();
            break;
        case 'btn-one':
        case 'btn-one1':
            Activity.jumpBack();
            break;
        // 退订
        case 'jump-debook':
            Activity.jumpUnBookPage();
            break;
        // 完成游戏用户获得抽奖机会
        case 'btn-game-success':
            Activity.game.lottery();
            break;
        // 支付确认
        case 'btn-pay-sure':
            Activity.jumpBuyVip();
            break;
        // 支付取消
        case 'btn-pay-cancel':
            Activity.modal.hide();
            break;
        // 校验游戏资格
        case 'jump-start':
            Activity.beClickId = btn.id;
            Activity.modal.isReload = 1;
            Activity.checkGameQualification(btn);
            break;
        //  提交用户电话号码
        case 'btn-list-submit':
        case 'btn-accomplish-submit':
            Activity.setTelephone(btn);
            break;
        // 显示兑换奖品界面
        case 'jump-exchange':
            Activity.beClickId = btn.id;
            Activity.render.exchangeUI(false);
            break;
        // 执行兑换
        case 'btn-exchange-0':
        case 'btn-exchange-1':
        case 'btn-exchange-2':
            Activity.getExchangePrize(btn);
            break;
        // 显示活动规则
        case 'jump-rule':
            Activity.beClickId = btn.id;
            Activity.modal.show('modal-rule', 'btn-rule-close');
            break;
        // 显示中奖名单
        case 'jump-winner':
            Activity.beClickId = btn.id;
            Activity.render.winnerListUI(true);
            break;
        // 启动数字小键盘
        case 'rewrite-tel':
        case 'accomplish-tel':
            if (hasFocus) {
                LMEPG.UI.keyboard.show(RenderParam.platformType==='hd'?235:215, RenderParam.platformType==='hd'?420:190, btn.id, btn.backFocusId, true);
            }
            break;
        case 'jump-knowledge':
            Activity.beClickId = 'jump-knowledge';
            Activity.knowledge.showKnowledgePage();
            break;
        case 'knowledge-next':
            Activity.knowledge.nextPage();
            break;
        case 'knowledge-back':
            Activity.modal.hide();
            Activity.knowledge.hideKnowledge();
            break;
        default:
            // LMUtils.dialog.showToast('按钮ID不正确！', 2);
            break;
    }
};

/**
 * 当前活动自定义的按钮
 */
Activity.addButtons = function () {

    this.buttons.push({
        id: 'btn-game-success',
        type: 'img',
        focusImage: this.activityImg + 'btn_lottery_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-game-lose',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-lottery-lose',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-rule-close',
        name: '按钮-返回主界面',
        type: 'img',
        // backgroundImage: this.activityImg + 'btn_close.png',
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
        id: 'jump-knowledge',
        name: '退订按钮',
        type: 'img',
        nextFocusDown: 'jump-start',
        nextFocusRight: 'jump-start',
        backgroundImage: this.activityImg + 'jump_knowledge.png',
        focusImage: this.activityImg + 'jump_knowledge_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'knowledge-next',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_next.png',
        // focusImage: this.activityImg + 'btn_next_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'knowledge-back',
        type: 'img',
        // backgroundImage: this.activityImg + 'knowledge_back.png',
        focusImage: this.activityImg + 'btn_close_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-start',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_start.png',
        focusImage: this.activityImg + 'btn_start_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'hole-focus-0',
        name: '',
        type: 'img',
        nextFocusDown: 'hole-focus-3',
        nextFocusRight: 'hole-focus-1',
        backgroundImage: this.activityImg + 'transparent.png',
        focusImage: this.activityImg + 'hammer.gif',
        focusChange: this.game.holeOnfocus,
        click: this.eventHandler
    }, {
        id: 'hole-focus-1',
        name: '',
        type: 'img',
        nextFocusDown: 'hole-focus-4',
        nextFocusLeft: 'hole-focus-0',
        nextFocusRight: 'hole-focus-2',
        backgroundImage: this.activityImg + 'transparent.png',
        focusImage: this.activityImg + 'hammer.gif',
        focusChange: this.game.holeOnfocus,
        click: this.eventHandler
    }, {
        id: 'hole-focus-2',
        name: '',
        type: 'img',
        nextFocusDown: 'hole-focus-5',
        nextFocusLeft: 'hole-focus-1',
        nextFocusRight: 'hole-focus-3',
        backgroundImage: this.activityImg + 'transparent.png',
        focusImage: this.activityImg + 'hammer.gif',
        focusChange: this.game.holeOnfocus,
        click: this.eventHandler
    }, {
        id: 'hole-focus-3',
        name: '',
        type: 'img',
        nextFocusUp: 'hole-focus-0',
        nextFocusLeft: 'hole-focus-2',
        nextFocusRight: 'hole-focus-4',
        backgroundImage: this.activityImg + 'transparent.png',
        focusImage: this.activityImg + 'hammer.gif',
        focusChange: this.game.holeOnfocus,
        click: this.eventHandler
    }, {
        id: 'hole-focus-4',
        name: '',
        type: 'img',
        nextFocusUp: 'hole-focus-1',
        nextFocusLeft: 'hole-focus-3',
        nextFocusRight: 'hole-focus-5',
        backgroundImage: this.activityImg + 'transparent.png',
        focusImage: this.activityImg + 'hammer.gif',
        focusChange: this.game.holeOnfocus,
        click: this.eventHandler
    }, {
        id: 'hole-focus-5',
        name: '',
        type: 'img',
        nextFocusUp: 'hole-focus-2',
        nextFocusLeft: 'hole-focus-4',
        backgroundImage: this.activityImg + 'transparent.png',
        focusImage: this.activityImg + 'hammer.gif',
        focusChange: this.game.holeOnfocus,
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
