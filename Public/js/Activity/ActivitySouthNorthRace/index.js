var AllParam = {
    onFocusSuffix: 'gif',
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
        me.modal.show('modal-game', 'bowl');
        me.modal.isReload = 1;
        me.game.start(btn);
        G('times-count').innerText = Math.max(0, --me.leftTimes);
        // LMUtils.dialog.showWaiting();
        me.uploadUserPlayGame(function () {
            // LMUtils.dialog.hide();
        });
    } else {
        if (me.verify.isVip) {
            LMUtils.dialog.showToast('今天的次数已用完，记得明天再来哦 ~', 2);
        } else {
            me.isPayModal = true;
            me.modal.show('modal-pay-notimes', 'btn-pay-sure');
        }
    }
};

/**
 * 健康知识预览
 * @type {{nextPage: SuperActivity.knowledge.nextPage, showKnowledgePage: SuperActivity.knowledge.showKnowledgePage}}
 */
Activity.knowledge = (function () {
    var me = Activity;
    var page = 1; // 初始话起始页数
    var maxPage = me.platformType === 'hd' ? 2 : 4; // 设置最大页数
    var updatePic = function () {
        G('knowledge-pic').src = me.activityImg + 'txt' + page + '.png';
        page++;
    };
    var isMaxPage = function () {
        if (page === maxPage) {
            page = 0;
            H('knowledge-next');
            S('knowledge-back');
            LMEPG.BM.requestFocus('knowledge-back');
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
            S('knowledge-next');
            H('knowledge-back');
            me.modal.show('modal-knowledge', 'knowledge-next', me.knowledge);
        }
    };
}());

/**
 * 游戏机制处理对象
 */
Activity.game = (function () {
    var me = Activity;
    var cd = 20;
    var rand = LMUtils.getRandom;
    var imgPrefix = me.activityImg;
    var foodsWrapEl = G('foods-wrapper');
    var bowlEl = G('bowl');
    var jiaoziEl = G('jiaozi');
    var tangyuanEl = G('tangyuan');
    var bowl = me.platformType === 'hd'
        ? {maxLeft: 880, top: 443, left: 420, width: 404, ljTop: 120, ljLeft: 20, ljRight: 100}
        : {maxLeft: 350, top: 333, left: 200, width: 300, ljTop: 46, ljLeft: 10, ljRight: 50};
    var foodMaxTop = me.platformType === 'hd' ? 720 : 530;
    var foodleftMax = me.platformType === 'hd' ? 1000 : 500;
    var addScoreFood = 0;
    var disScoreFood = 0;
    var foodIdIndex = 0;
    var btnIdx = null;
    var createTimer = null;
    var fallTimer = null;

    /**
     * 显示游戏结果
     */
    function showResult(code, score) {
        if (code === 1) {
            // 获得积分
            me.ajax.storeUserScore(score, function () {
                me.modal.show('modal-add-score', 'btn-one-add');
                me.modal.isReload = 1;
                me.score = parseInt(me.score) + score;
                G('score-count').innerText = me.score;
                G('p-add-score').innerText = score;
                LMUtils.dialog.hide();
            });
        } else {
            // 未获得积分
            me.modal.show('modal-lose-score', 'btn-one0');
            me.modal.isReload = 1;
            LMUtils.dialog.hide();
        }
    }

    /**
     * 释放定时器
     */
    function clearTimer() {
        clearInterval(me.cdTimer);
        clearTimeout(createTimer);
        clearTimeout(fallTimer);
    }

    /**
     * 游戏cd
     */
    function gameCd() {
        var gameCdEl = G('game-cd');
        var countDown = function () {
            cd--;
            gameCdEl.innerHTML = cd + 's';
            if (cd === 0) {
                clearTimer();
                setTimeout(isAddScore, 1000);
            }
        };

        me.cdTimer = setInterval(countDown, 1000);
    }

    /**
     * 是否增加了积分
     * 积分规则
     * 首页按下的按钮进入：
     *  1.南-->汤圆(m)
     *  2.北-->饺子(n)
     *  每接对一个食材 +3分
     *  每接错一个拭擦 -1分
     *  最终积分为--> 3m - n;
     */
    function isAddScore() {
        // 计算差值
        var totalScore = 2 * addScoreFood - disScoreFood;
        if (totalScore > 0) {
            showResult(1, totalScore);
        } else {
            showResult();
        }
    }

    /**
     *  创建食材下落对象
     */
    function createFood() {
        var imgName = Math.random() > 0.5 ? 'tangyuan' : 'jiaozi';
        var imgLeft = parseInt(rand(0, foodleftMax));
        var img = document.createElement('img');

        img.id = 'food-' + foodIdIndex++;
        img.src = imgPrefix + imgName + '.png';
        img.style.top = '0px';
        img.style.left = imgLeft + 'px';
        img.setAttribute('data-name', imgName);
        foodsWrapEl.appendChild(img);
        easeFallFoods(img, imgLeft);
    }

    /**
     * 由慢向快增加食材下落速度
     * ease-out
     */
    function easeFallFoods(element, randLeft) {
        var imgIdxTimer = null;
        (function ease() {
            var num = cd || 1;
            var fs = (1000 / 16) * (num / 10);
            imgIdxTimer = setTimeout(ease, fs);
            fallDown(element, randLeft, imgIdxTimer);
            // console.log(imgIdxTimer);
        }());
    }

    /**
     * 食材下落
     */

    function fallDown(element, randLeft, imgIdxTimer) {
        var isLjBowlTop;
        var isLjBowlBottom;
        var isLjBowlLeft;
        var isLjBowlRight;
        var momentTop = parseInt(element.style.top);

        if (momentTop > foodMaxTop) {
            remove(element);
            clearTimeout(imgIdxTimer);
            // console.log(imgIdxTimer+'abc')
        } else {
            // 叠加下落距离单位/10px
            momentTop += 10;
            // 超过碗口上沿
            isLjBowlTop = momentTop >= bowl.top;
            // 超过碗口下沿
            isLjBowlBottom = momentTop <= bowl.top + bowl.ljTop;
            // 超过碗口左沿
            isLjBowlLeft = randLeft > bowl.left + bowl.ljLeft;
            // 超过碗口右沿
            isLjBowlRight = randLeft < bowl.left + bowl.width - bowl.ljRight;
            // 达到以上临界条件则执行装碗否则继续下落
            isLjBowlTop && isLjBowlBottom && isLjBowlLeft && isLjBowlRight ? collectFoods(element, imgIdxTimer) : draw(element, 'top', momentTop);
        }
    }

    /**
     * 是否被碗收集到了
     */
    function collectFoods(el, imgIdxTimer) {
        var foodName = el.getAttribute('data-name');
        var addEl = btnIdx === 'tangyuan' ? tangyuanEl : jiaoziEl;
        var disEl = btnIdx === 'tangyuan' ? jiaoziEl : tangyuanEl;
        // 释放掉当前个别食材
        remove(el);
        // 释放掉不必要的定时器
        clearTimeout(imgIdxTimer);

        if (foodName === btnIdx) {
            addScoreFood += 1;
            addEl.innerText = addScoreFood;
            // console.log('加分！');
        } else {
            disScoreFood += 1;
            disEl.innerText = disScoreFood;
            // console.log('减分！');
        }
    }

    /**
     * 更新渲染
     */
    function draw(element, attr, num) {
        element.style[attr] = num + 'px';
    }

    /**
     * 清除渲染
     */
    function remove(el) {
        el.parentNode.removeChild(el);
    }

    /**
     * 碗移动
     */
    function bowlMove(direction, btn) {
        // 碗向左最小移动距离
        var leftMin = 0;
        // 碗向右最大移动距离
        var leftMax = bowl.maxLeft;
        // 生效方向键为左右
        if (direction === 'left' || direction === 'right') {
            bowl.left = LMUtils.getStyle(bowlEl, 'left');
            bowl.left = direction === 'left' ? Math.max(leftMin, bowl.left -= 100) : Math.min(leftMax, bowl.left += 100);
            draw(bowlEl, 'left', bowl.left);
        }
    }

    /**
     * 由少向多增加食材数量
     * ease-out
     */
    function easeOutFoods() {
        (function ease() {
            var num = cd || 1;
            var fs = 1000;
            createFood();
            // console.log(fs);
            createTimer = setTimeout(ease, fs);
        }());
    }

    return {
        start: function (btn) {
            btnIdx = btn.btnIdx;
            clearInterval(fallTimer);
            easeOutFoods();
            gameCd();
        },

        move: function (direction, btn) {
            bowlMove(direction, btn);
        },

        over: function () {
            clearTimer();
        }
    };
}());

Activity.init = function () {
    this.initButtons();
    this.addButtons();
    this.checkPayState();
    this.render['times-count']().render['score-count']();
    LMEPG.BM.init(this.beClickId, this.buttons,"", true);
    LMEPG.BM.getButtonById('jump-back').nextFocusLeft = 'jump-start2';
    LMEPG.BM.getButtonById('jump-winner').nextFocusLeft = 'jump-start2';
    LMEPG.BM.getButtonById('jump-rule').nextFocusLeft = 'jump-start2';
    LMEPG.BM.getButtonById('jump-exchange').nextFocusLeft = 'jump-start2';
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
        case 'btn-accomplish-cancel':
            Activity.modal.hide();
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
        case 'jump-start1':
        case 'jump-start2':
            Activity.beClickId = btn.id;
            Activity.checkGameQualification(btn);
            break;
        // 校验游戏资格
        case 'btn-start':
            break;
        case 'btn-list-submit':
        case 'btn-accomplish-submit':
            Activity.setTelephone(btn, true);
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
            // LMUtils.dialog.showToast('按钮ID不正确！', 2);
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
        nextFocusDown: 'jump-start1',
        nextFocusRight: 'jump-start1',
        backgroundImage: this.activityImg + 'jump_knowledge.png',
        focusImage: this.activityImg + 'jump_knowledge_f.gif',
        click: this.eventHandler
    }, {
        id: 'knowledge-next',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_next.png',
        focusImage: this.activityImg + 'btn_next_f.gif',
        click: this.eventHandler
    }, {
        id: 'knowledge-back',
        type: 'img',
        backgroundImage: this.activityImg + 'knowledge_back.png',
        focusImage: this.activityImg + 'knowledge_back_f.gif',
        click: this.eventHandler
    }, {
        id: 'btn-start',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_start.png',
        focusImage: this.activityImg + 'btn_start_f.gif',
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
        focusImage: this.activityImg + 'btn_exchange_f.gif',
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
        focusImage: this.activityImg + 'btn_exchange_f.gif',
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
        focusImage: this.activityImg + 'btn_exchange_f.gif',
        goods_id: this.getExchangeList[2].goods_id,
        click: this.eventHandler
    }, {
        id: 'jump-start1',
        name: '',
        type: 'img',
        nextFocusUp: 'jump-knowledge',
        nextFocusLeft: 'jump-knowledge',
        nextFocusRight: 'jump-start2',
        backgroundImage: this.activityImg + 'jump_start1.png',
        focusImage: this.activityImg + 'jump_start1_f.gif',
        btnIdx: 'tangyuan',
        click: this.eventHandler
    }, {
        id: 'jump-start2',
        name: '',
        type: 'img',
        nextFocusUp: 'jump-knowledge',
        nextFocusLeft: 'jump-start1',
        nextFocusRight: 'jump-exchange',
        backgroundImage: this.activityImg + 'jump_start2.png',
        focusImage: this.activityImg + 'jump_start2_f.gif',
        btnIdx: 'jiaozi',
        click: this.eventHandler
    }, {
        id: 'bowl',
        name: 'other',
        type: 'img',
        nextFocusUp: '',
        beforeMoveChange: this.game.move,
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
