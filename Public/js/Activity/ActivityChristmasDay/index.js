var AllParam = {
    onFocusSuffix: 'png',
    moveFocusToStart: 'btn-start'
};

LMUtils.o_mix(AllParam, RenderParam);

var Activity = new SuperActivity(AllParam);
var onBack = Activity.jumpBack;

/*校验游戏资格*/
Activity.checkGameQualification = function (btn) {
    var me = this;
    if (me.verify.isPlayAllow()) {
        // 同步进行
        me.game.shootGift();
        G('times-count').innerText = Math.max(0, --me.leftTimes);
        me.uploadUserPlayGame();
    } else {
        if (me.verify.isVip) {
            LMUtils.dialog.showToast('今天的次数已用完，记得明天再来哦 ~', 2);
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

/**
 * 游戏机制处理对象
 */
Activity.game = (function () {
    var me = Activity;
    var dartsElement = G('darts-img');
    // 击中临界值min,max
    var ljVal = me.platformType === 'hd'?[120, 200]:[90, 150];
    var giftAry = [1, 2, 3, 4, 5, 6];
    var flyTimer = null;
    var shootTimer = null;
    var hideElementIndex;

    /*TURNONFLICKERMODE ^l^*/
    function ghost() {
        var i = 7; // 礼物个数6，上浮一个数到7
        var count = 0;
        while (i > 1 && i--) {
            var item = me['flyValue' + i];
            if (item === 1) {
                count++;
            }
        }

        return count;
    }

    function giftFly() {
        var tempTimer = null;
        var currentIndex = giftAry[0];
        var currentGift = G('gift-fly-' + currentIndex);

        /*飞行礼物对象数据*/
        var gift = me.platformType === 'hd' ? {minX: -80, maxX: 420, moveX: 420} : {minX: -60, maxX: 284, moveX: 284};

        /*更新飞行礼物数据*/
        var update = function () {
            var num = ghost(); // 获取完成的个数
            var min = num;
            var max = num + 5;
            var randN = LMUtils.getRandom(min, max);
            // var randN = 1;
            gift.moveX = Math.max(gift.minX, gift.moveX -= randN);
        };

        /*画飞行礼物轨迹*/
        var draw = function () {
            currentGift.style.left = gift.moveX + 'px';
        };

        /*显示当前礼物*/
        S(currentGift);

        /*循环执行*/
        (function loop() {
            update();
            draw();
            gift.moveX <= gift.minX ? clearTimeout(tempTimer) : tempTimer = setTimeout(loop, 1000 / 60);
        }());

        // 更新飞行元素索引数组
        currentIndex === (2 || 4 || 6) ? LMUtils.shuffle(giftAry) : giftAry.push(giftAry.shift());
    }

    /**
     * 发射飞镖处理对象
     */
    function shootGift() {
        var dartsImgCount = 1;

        /*更新参量*/
        var update = function () {
            dartsImgCount = Math.min(6, dartsImgCount += 1);
        };

        /*画飞镖飞行轨迹*/
        var draw = function (arg) {
            arg = arg || dartsImgCount;
            dartsElement.src = me.activityImg + 'darts' + arg + '.png';
        };

        /*判断飞镖是否刺中飞行礼物*/
        var filterIsSureShoot = function () {
            var flyEls = G('fly-inner').children;
            var len = flyEls.length;
            var item;

            for (var i = 0; i < len; i++) {
                item = parseInt(flyEls[i].style.left);
                // 飞镖击中气球，返回对应礼物序列
                if (item > ljVal[0] && item < ljVal[1]) return (++i) + '';
            }

            return false;
        };

        /*飞镖动画*/
        (function shoot() {
            var count;
            var hideElement;

            update();
            draw();
            if (dartsImgCount === 6) {
                clearTimeout(shootTimer);
                count = filterIsSureShoot();
                // 飞镖到达气球临界值且击中气球
                if (count) {
                    hideElement = G('gift-fly-' + count);
                    draw('_f');
                    H(hideElement);
                    hideElementIndex = count;
                    me['flyValue' + count] = 1; // 标记点亮
                    var key = me.activityInfo.list.unique_name + me.userId + 'fly' + count;
                    me.ajax.saveData(key, 1, function (data) {
                        console.log('存储结果==>' + data);
                    });
                }

                // 还原初始值
                dartsImgCount = 1;
                setTimeout(function () {
                    draw(1);
                    setTreeGiftLighting('ghost');
                    LMEPG.BM.setKeyEventPause(false);
                }, 1000);
            } else {
                shootTimer = setTimeout(shoot, 100);
            }
        }());
    }

    /*点亮圣诞树上的礼物*/
    function setTreeGiftLighting() {
        var i = 7; // 礼物个数6，上浮一个数到7
        while (i > 1 && i--) {
            var item = me['flyValue' + i];
            if (item === 1) { // 1为射中过的气球
                G('gift' + i).src = me.activityImg + 'gift' + i + '_h.png';
            }
        }
    }

    return {
        start: function () {
            // 速率-->个/1.314s
            flyTimer = setInterval(giftFly, 1314);
        },
        shootGift: function () {
            LMEPG.BM.setKeyEventPause(true);
            shootGift();
        },
        treeGiftLighting: function () {
            setTreeGiftLighting();
        },
        getLightingCount: function () {
            return ghost();
        }
    };

}());

Activity.init = function () {
    this.initButtons();
    this.addButtons();
    this.checkPayState();
    this.render['times-count']();
    this.game.start();
    this.game.treeGiftLighting();
    LMEPG.BM.init(this.beClickId, this.buttons, true);
    LMEPG.BM.getButtonById('jump-exchange').nextFocusDown = 'jump-knowledge';
    LMEPG.BM.getButtonById('jump-exchange').nextFocusLeft = 'btn-start';
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
        case 'btn-one-add':
        case 'btn-rule-close':
        case 'btn-list-cancel':
        case 'btn-uncompleted-sure':
            Activity.modal.hide();
            break;
        case 'btn-accomplish-cancel':
            Activity.modal.hide(true);
            break;
        case 'btn-one':
        case 'btn-one0':
        case 'btn-one1':
            Activity.jumpBack();
            break;
        // 退订
        case 'jump-debook':
            Activity.jumpUnBookPage();
            break;
        // 支付确认
        case 'btn-pay-sure':
            Activity.jumpBuyVip();
            break;
        // 支付取消
        case 'btn-pay-cancel':
            clearTimeout(Activity.cdTimer);
            Activity.isSureAddExtraTimes() && Activity.modal.hide(true);
            break;
        // 校验游戏资格
        case 'btn-start':
            Activity.beClickId = btn.id;
            Activity.checkGameQualification(btn);
            break;
        case 'btn-list-submit':
        case 'btn-accomplish-submit':
            Activity.setTelephone(btn, true);
            break;
        // 显示兑换奖品界面
        case 'jump-exchange':
            Activity.beClickId = btn.id;
            Activity.render.exchangeUI(false, '', true);
            H('exchange-total-score');
            break;
        // 执行兑换
        case 'btn-exchange-0':
        case 'btn-exchange-1':
        case 'btn-exchange-2':
        case 'btn-exchange-3':
            if (Activity.game.getLightingCount() === 6) {
                Activity.getExchangePrize(btn);
            } else {
                LMUtils.dialog.showToast('点亮圣诞树上全部礼物灯才能兑换哦~', 2);
            }
            break;
        // 显示活动规则
        case 'jump-rule':
            Activity.beClickId = btn.id;
            Activity.modal.show('modal-rule', 'btn-rule-close');
            break;
        // 显示中奖名单
        case 'jump-winner':
            Activity.beClickId = btn.id;
            Activity.render.winnerListUI();
            break;
        // 启动数字小键盘
        case 'rewrite-tel':
        case 'accomplish-tel':
            if (hasFocus) Activity.showKeypad(btn, '150px');
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
            LMUtils.dialog.showToast('按钮ID不正确！', 2);
            break;
    }
};

/**
 * 当前活动自定义的按钮
 */
Activity.addButtons = function () {

    this.buttons.push({
        id: 'btn-one-add',
        name: '',
        type: 'img',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: Activity.eventHandler
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
        nextFocusUp: this.platformType === 'hd' ? '' : 'rewrite-tel',
        nextFocusLeft: 'rewrite-tel',
        nextFocusRight: 'btn-list-cancel',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        isAction: 'isListSubmit',
        click: this.eventHandler
    }, {
        id: 'btn-list-cancel',
        name: '按钮-取消提交电话/关闭中奖名单',
        type: 'img',
        nextFocusUp:  this.platformType === 'hd' ? '' : 'rewrite-tel',
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
        id: 'jump-knowledge',
        name: '退订按钮',
        type: 'img',
        nextFocusLeft: 'btn-start',
        nextFocusUp: 'jump-exchange',
        backgroundImage: this.activityImg + 'jump_knowledge.png',
        focusImage: this.activityImg + 'jump_knowledge_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'knowledge-next',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_next.png',
        focusImage: this.activityImg + 'btn_next_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'knowledge-back',
        type: 'img',
        // backgroundImage: this.activityImg + 'knowledge_back.png',
        // focusImage: this.activityImg + 'knowledge_back_f.' + this.onFocusSuffix,
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
        nextFocusRight: this.lmcid === '420092' ? 'btn-exchange-3' : 'btn-exchange-0',
        backgroundImage: this.activityImg + 'btn_exchange.png',
        focusImage: this.activityImg + 'btn_exchange_f.' + this.onFocusSuffix,
        goods_id: this.getExchangeList[2].goods_id,
        click: this.eventHandler
    }, {
        id: 'btn-exchange-3',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-2',
        nextFocusRight: 'btn-exchange-0',
        backgroundImage: this.activityImg + 'btn_exchange.png',
        focusImage: this.activityImg + 'btn_exchange_f.' + this.onFocusSuffix,
        // 湖北电信有4个兑换按钮
        goods_id: this.lmcid === '420092' ? this.getExchangeList[3].goods_id : '',
        click: this.eventHandler
    }, {
        id: 'btn-start',
        name: '',
        type: 'img',
        nextFocusUp: 'jump-exchange',
        nextFocusRight: 'jump-knowledge',
        backgroundImage: this.activityImg + 'jump_start.png',
        focusImage: this.activityImg + 'jump_start_f.' + this.onFocusSuffix,
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
