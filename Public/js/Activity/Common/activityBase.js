function SuperActivity(opts) {
    var me = this;
    // 浅复制一份传递参数为自用参数
    LMUtils.o_mix(me, opts);
    /**
     * 返回按钮函数功能
     */
    me.jumpBack = function () {
        clearInterval(me.cdTimer);
        //  游戏开始设置为ture则返回立即重载（已弃用，可使用弹框组件参数外部实现）
        if (me.gameStart) me.reloadPage();
        // 弹框存在，不是提示订购弹框
        if (me.modal.isModal) {
            me.modal.hide();
        } else {
            LMEPG.Intent.back(me.isUnion ? 'IPTVPortal' : '');
        }
    };

    /**
     * 模态框组件--实现显示、隐藏模态框功能
     * @type {{prevModal: string, hide: SuperActivity.modal.hide, show: SuperActivity.modal.show, isModal: boolean}}
     */
    me.modal = {
        prevModal: '',
        isModal: false,
        show: function (currModal, focusId, callback) {
            var prevModal = me.modal.prevModal;
            var BM = LMEPG.BM;
            var Id = focusId;
            // 更新弹框UI
            Hide(prevModal);
            Show(currModal);
            // 标记弹框存在
            me.modal.isModal = true;
            // 存储为上一个弹框组件
            me.modal.prevModal = currModal;
            // 当传递1的时候则隐藏的时候重载
            me.modal.isReload = Id;
            // 焦点传送、请求重载、禁止事件触发
            Id ? Id === 'useReload' ? me.reloadPage() : BM.requestFocus(Id) : BM.setKeyEventPause(true);
            // 执行回调
            typeof callback === 'function' && callback();
        },

        hide: function (bol, callback) {
            var modalId = me.modal.prevModal;
            var BM = LMEPG.BM;
            // 执行隐藏
            Hide(modalId);
            // 还原默认状态
            me.modal.isModal = false;
            // 请求焦点事件许可
            BM.setKeyEventPause(false);
            // 送回焦点到触发该弹框的Id
            BM.requestFocus(me.beClickId);
            // 传入true\显示时候标记了1-->重载
            if (bol || me.modal.isReload === 1) {
                BM.setKeyEventPause(true);
                me.reloadPage();
            }
            // 执行回调
            typeof callback === 'function' && callback();
        }
    };

    /**
     * 前端调用ajax映射函数
     * @type {{fn-->callback}},
     */
    me.ajax = {

        /*查询sp信息*/
        getSpInfo: function (callback) {
            LMUtils.dialog.showWaiting();
            LMEPG.ajax.postAPI('Activity/canAnswer', null, callback);
        },

        /*消耗额外游戏次数*/
        subExtraTimes: function (callback) {
            LMEPG.ajax.postAPI('Activity/subExtraActivityTimes', null, callback);
        },

        /*消耗通用游戏次数*/
        subCommonTimes: function (callback) {
            LMEPG.ajax.postAPI('Activity/uploadUserJoin', null, callback);
        },

        /*执行抽奖行为*/
        lottery: function (callback) {
            LMEPG.ajax.postAPI('Activity/lottery', null, callback);
        },

        /*保存弹框提示鉴别参数*/
        storeCDToVerify: function (num, callBack) {
            LMUtils.dialog.showWaiting();
            var postData = {key: me.activityInfo.list['unique_name'] + me.userId, value: num};
            LMEPG.ajax.postAPI('Activity/saveStoreData', postData, callBack);
        },

        /*自定义键==>值保存数据*/
        saveData: function (key, val, callback) {
            var postData = {key: key, value: val};
            LMEPG.ajax.postAPI('Activity/saveStoreData', postData, callback);
        },

        /*自定义键获取数据*/
        getData: function (key, callback) {
            var postData = {key: key};
            LMEPG.ajax.postAPI('Activity/queryStoreData', postData, callback);
        },

        /*增加游戏次数*/
        addUserTimesUpdate: function (callBack) {
            LMUtils.dialog.showWaiting();
            LMEPG.ajax.postAPI('Activity/addUserLotteryTimes', null, callBack);
        },

        /*保存用户电话号码*/
        submitUserTel: function (tel, isexchange, callback) {
            LMUtils.dialog.showWaiting();
            LMEPG.ajax.postAPI('Activity/setPhoneNumber', {'phoneNumber': tel, 'exchange': isexchange}, callback);
        },

        /*保存用户获得的积分*/
        storeUserScore: function (score, callback) {
            LMUtils.dialog.showWaiting();
            LMEPG.ajax.postAPI('Activity/addUserScore', {score: score}, callback);
        },

        /*获取保存的积分数据*/
        getUserScore: function (callback) {
            LMUtils.dialog.showWaiting();
            LMEPG.ajax.postAPI('Activity/getUserScore', null, callback);
        },

        /*请求兑换奖品*/
        requestExchangeAction: function (btn, callback) {
            LMUtils.dialog.showWaiting();
            LMEPG.ajax.postAPI('Activity/exchangePrize', {'goodsId': btn.goods_id}, callback);
        },

        /*获取所有兑换奖品列表*/
        getExchangePrizeListRecord: function (callback) {
            LMUtils.dialog.showWaiting();
            LMEPG.ajax.postAPI('Activity/getExchangePrizeListRecord', null, callback);
        },

        /*请求错误*/
        errorNetwork: function () {
            LMUtils.dialog.showToast('网络请求发生错误了!', 3);
        }
    };

    /**
     * 活动验证工具函数
     * @type {{isPlayAllow: (function(): boolean), isPaySuccess: boolean, isAddExtraTimes: boolean, isVip: boolean}}
     */
    me.verify = {

        // 验证是否VIP
        isVip: me.isVip === '1',
        // 验证是否添加了额外次数
        isAddExtraTimes: me.cdCount !== '-1',
        // 验证是否支付成功
        isPaySuccess: me.cOrderResult === '1',

        // 验证进入游戏资格
        isPlayAllow: function () {
            return me.leftTimes > 0;
        }
    };

    me.getLeftTimes = function (count) {
        G('times-count').innerText = count;
    };

    /**
     * 渲染活动固有的数据
     * @type {{arg*mix}}
     */
    me.render = {
        'times-count': function (txt) {
            txt = txt || '';
            G('times-count').innerText = txt + me.leftTimes;
            return me;
        },
        'score-count': function (txt) {
            txt = txt || '';
            G('score-count').innerText = txt + me.score;
            return me;
        },
        /**
         * 渲染中奖名单UI
         * @param param：传递参数为true 则表示抽奖活动 不传则为积分兑换活动
         */
        'winnerListUI': function (param) {
            // 所有参与该活动的用户的中奖信息
            var winnerData = {
                data: param ? me.AllUserPrizeList.list : [],
                timeStr: param ? 'prize_dt' : 'log_dt',
                prizeName: param ? 'prize_name' : 'goods_name'
            };
            var allUserData;

            me.ajax.getExchangePrizeListRecord(function (data) {
                allUserData = data['data']['all_list'];
                // 抽奖活动的数据从外面拿
                if (param) allUserData = winnerData.data;
                allUserData = filterNoPrize(allUserData);
                renderAllList(allUserData);
                renderMyList(allUserData);
                renderTelphone(me.userTel);
                me.modal.show('modal-list', 'btn-list-submit', LMUtils.dialog.hide);
            });

            // 过滤无效奖品
            function filterNoPrize(data) {
                var arr = [];
                var i = data.length;
                var filterArr = ['未中奖', '谢谢参与', '再接再厉'];
                while (i--) {
                    var prize = data[i];
                    if (filterArr.indexOf(prize[winnerData.prizeName]) === -1) {
                        arr.push(prize);
                    }
                }
                return arr;
            }

            function renderAllList(data) {
                var htm = '<marquee  id="all-marquee" scrollamount="5"  direction="up"><table id="all-table" class="marquee-table">';
                for (var i = 0; i < data.length; i++) {
                    htm += '<tr>'
                        + '<td class="winner-account">'
                        + me.formatAccount(data[i]['user_account'])
                        + '<td class="winner-time">'
                        + me.formatDate(data[i][winnerData.timeStr])
                        + '<td class="winner-prize">' + data[i][winnerData.prizeName];
                }
                htm += '</table></marquee>';
                G('total-list').innerHTML = htm;
            }

            function renderMyList(data) {
                // 当前登录用户中奖信息
                var myData = data;
                var myHtm = '<marquee  id="my-marquee" scrollamount="5"  direction="up"><table id="my-table" class="marquee-table">';
                for (var j = 0; j < myData.length; j++) {
                    if (myData[j]['user_account'] === me.loginUserAccount) {
                        me.hasOwnPrized = true;
                        myHtm += '<tr>'
                            + '<td class="winner-account">'
                            + me.formatAccount(myData[j]['user_account'])
                            + '<td class="winner-time">'
                            + me.formatDate(myData[j][winnerData.timeStr])
                            + '<td class="winner-prize">' + myData[j][winnerData.prizeName];
                    }
                }
                G('my-list').innerHTML = myHtm;
            }

            function renderTelphone(tel) {
                G('rewrite-tel').innerHTML = tel || '请输入有效的电话';
            }
        },

        // 渲染兑换界面
        'exchangeUI': function (hasImg, txt, noScore) {
            var htm = '<ul class="prize-list">';
            var len = me.getExchangeList.length;
            for (var i = 0; i < len; i++) {
                htm += '<li id="exchange-' + i + '" class="prize-item">';
                htm += hasImg ? '<img src= "' + me.activityImg + 'V' + me.lmcid + '/prize' + (i + 1) + '.png">' : '';
                htm += '<p>' + (txt || '') + (noScore ? '' : me.getExchangeList[i]['consume_list'][0]['consume_count']) + '</p>';
                htm += '<img id="btn-exchange-' + i + '" src="' + me.activityImg + '/btn_exchange.png">';
                htm += '</li>';
            }

            htm += '</ul><p id="exchange-total-score">' + (txt || '') + me.score + '</p>';
            G('modal-exchange').innerHTML = htm;
            me.modal.show('modal-exchange', 'btn-exchange-0');
        }
    };
}

/**
 * 共享按钮应用
 * @type {Array}
 */
SuperActivity.prototype.buttons = [];

/**
 * 初始化公用的按钮套件
 */
SuperActivity.prototype.initButtons = function () {
    var me = this;
    var moveFocusFromStart = me.moveFocusFromStart || 'jump-winner';
    var moveFocusToStart = me.moveFocusToStart || 'jump-knowledge';
    var moveFocusFromWinner = me.moveFocusFromWinner || 'jump-exchange';

    me.buttons = [
        {
            id: 'debug',
            name: '脚手架ID',
            type: 'other',
            click: me.eventHandler
        }, {
            id: 'rewrite-tel',
            name: '输入框-重新输入电话号码',
            type: 'other',
            focusChange: me.eventHandler,
            backFocusId: 'btn-list-submit'
        }, {
            id: 'accomplish-tel',
            name: '输入框-完成游戏输入电话号码',
            type: 'other',
            focusChange: me.eventHandler,
            backFocusId: 'btn-accomplish-submit'
        }, {
            id: 'jump-start',
            name: '按钮-开始',
            type: 'img',
            nextFocusLeft: 'jump-knowledge',
            nextFocusUp: moveFocusFromStart,
            nextFocusRight: moveFocusFromStart,
            backgroundImage: me.activityImg + 'jump_start.png',
            focusImage: me.activityImg + 'jump_start_f.' + me.onFocusSuffix,
            click: me.eventHandler
        }, {
            id: 'jump-back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'jump-rule',
            nextFocusLeft: moveFocusToStart,
            backgroundImage: me.activityImg + 'jump_back.png',
            focusImage: me.activityImg + 'jump_back_f.' + me.onFocusSuffix,
            click: me.eventHandler
        }, {
            id: 'jump-rule',
            name: '按钮-显示活动规则',
            type: 'img',
            nextFocusUp: 'jump-back',
            nextFocusDown: 'jump-winner',
            nextFocusLeft: moveFocusToStart,
            backgroundImage: me.activityImg + 'jump_rule.png',
            focusImage: me.activityImg + 'jump_rule_f.' + me.onFocusSuffix,
            click: me.eventHandler
        }, {
            id: 'jump-winner',
            name: '按钮-显示中奖名单',
            type: 'img',
            nextFocusUp: 'jump-rule',
            nextFocusDown: moveFocusFromWinner,
            nextFocusLeft: moveFocusToStart,
            backgroundImage: me.activityImg + 'jump_winner.png',
            focusImage: me.activityImg + 'jump_winner_f.' + me.onFocusSuffix,
            click: me.eventHandler
        }, {
            id: 'jump-exchange',
            name: '按钮-显示兑奖界面',
            type: 'img',
            nextFocusUp: 'jump-winner',
            nextFocusLeft: 'jump-start',
            nextFocusDown: 'jump-start',
            backgroundImage: me.activityImg + 'jump_exchange.png',
            focusImage: me.activityImg + 'jump_exchange_f.' + me.onFocusSuffix,
            click: me.eventHandler
        }, {
            id: 'btn-pay-sure',
            name: '按钮-确认支付',
            type: 'img',
            nextFocusRight: 'btn-pay-cancel',
            backgroundImage: me.activityImg + 'btn_sure.png',
            focusImage: me.activityImg + 'btn_sure_f.' + me.onFocusSuffix,
            click: me.eventHandler
        }, {
            id: 'btn-pay-cancel',
            name: '按钮-取消支付',
            type: 'img',
            nextFocusLeft: 'btn-pay-sure',
            backgroundImage: me.activityImg + 'btn_cancel.png',
            focusImage: me.activityImg + 'btn_cancel_f.' + me.onFocusSuffix,
            click: me.eventHandler
        }
    ];
};

/**
 * 8秒倒计时后增加额外的游戏次数功能
 * @returns {boolean}
 */
SuperActivity.prototype.isSureAddExtraTimes = function () {
    var me = this;
    var cdCount = 8; // 倒计时8秒
    var cdElement;
    var cdFn;
    if (me.cdCount === '-1' || +me.isVip || me.backState) return true;
    this.modal.show('modal-cd', '');
    cdElement = G('count-down');
    me.modal.isModal = false;
    cdFn = function () {
        if (cdCount >= 0) {
            me.backState = true;
            me.cdCount = cdCount;
            cdElement.innerHTML = cdCount--;
        } else {
            clearInterval(me.cdTimer);
            me.ajax.storeCDToVerify(cdCount, function () {
                    me.ajax.addUserTimesUpdate(function () {
                            me.reloadPage();
                        }
                    );
                }
            );
        }
    };

    me.cdTimer = setInterval(cdFn, 1000);
    return false;
};

/**
 * 检查支付返回状态
 * @param fn
 * @param imgFix
 * @returns {SuperActivity}
 */
SuperActivity.prototype.checkPayState = function (fn, imgFix) {
    var me = this;
    if (this.isOrderBack === '1') {
        var showPayTip = this.cOrderResult === '1' ? 'm_pay_success' : 'm_pay_failed';
        me.modal.show('modal-pay', '', function () {
            G('modal-pay').style.backgroundImage = 'url("' + me.activityImg + showPayTip + '.' + (imgFix || 'png') + '")';
            setTimeout(function () {
                me.modal.hide();
            }, 3000);
        });
    } else {
        typeof fn === 'function' && fn();
    }
    return me;
};

/**
 * 重载界面
 */
SuperActivity.prototype.reloadPage = function () {
    var me = this;
    LMUtils.dialog.showWaiting(0.2, '', function () {
        LMEPG.Intent.jump(me.getCurrentPage());
    });
};

/**
 * 当前界面栈内对象
 * @returns {*|{param, setPageName, name, setParam}}
 */
SuperActivity.prototype.getCurrentPage = function () {
    return LMEPG.Intent.createIntent('activity-common-guide');
};

/**
 * 上报参数游戏（消除游戏次数）
 * @param fn
 */
SuperActivity.prototype.uploadUserPlayGame = function (fn) {
    // 存在额外的游戏次数优先消耗额外的游戏次数
    if (+this.extraTimes) {
        this.ajax.subExtraTimes(fn);
    } else {
        this.ajax.subCommonTimes(fn);
    }
};

/**
 * 跳转局方订购模块
 */
SuperActivity.prototype.jumpBuyVip = function () {
    var currentPage = this.getCurrentPage();

    var orderPage = LMEPG.Intent.createIntent('orderHome');
    orderPage.setParam('directPay', '1');
    orderPage.setParam('orderReason', '101');
    orderPage.setParam('hasVerifyCode', '1');

    var backPage = this.getCurrentPage();
    backPage.setParam('isOrderBack', '1'); // 表示订购回来

    LMEPG.Intent.jump(orderPage, currentPage, LMEPG.Intent.INTENT_FLAG_DEFAULT, backPage);
};

/**
 * 设置用户中奖电话号码
 * @param btn
 * @param isexchange
 * @returns {SuperActivity}
 */
SuperActivity.prototype.setTelephone = function (btn, isexchange) {
    var me = this;
    var isAction = btn.isAction;// 表明单页应用提交的按钮功能
    var inputId = isAction === 'isListSubmit' ? 'rewrite-tel' : 'accomplish-tel';
    var userTel = G(inputId).innerText;
    var noPrize = null;

    //判断手机号是否正确
    if (!LMUtils.verify.isValidTel(userTel)) {
        LMUtils.dialog.showToast('请输入有效的电话 ~', 1);
        return me;
    }

    // 判断是得到过奖品：每个活动只能获得一个奖品（抽中或兑换）
    if (isAction === 'isListSubmit') {
        noPrize = {
            lottery: !isexchange && !me.myPrizeList.list.length,
            exchange: isexchange && !me.exchangeRecords.data.list.length
        };

        if (noPrize.lottery || noPrize.exchange) {
            LMUtils.dialog.showToast('您尚未获得奖品 ~', 1);
            return me;
        }
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

/**
 * 兑换奖品成功
 */
SuperActivity.prototype.successExchange = function () {
    G('accomplish-tel').innerHTML = this.userTel || '请输入有效的电话';
    this.modal.show('modal-accomplish', 'btn-accomplish-submit', LMUtils.dialog.hide);
};

/**
 * 请求兑换奖品接口
 * @param btn
 * @param fn
 * @returns {SuperActivity}
 */
SuperActivity.prototype.getExchangePrize = function (btn, fn) {
    var me = this;
    if (this.exchangeRecords.data.list.length || this.hasOwnPrize) {
        LMUtils.dialog.showToast('你已经兑换过奖品了', 1);
    } else {
        me.ajax.requestExchangeAction(btn, function (ret) {
            me.setModalTipsByExchange(ret, fn);
        });
    }
    return this;
};

/**
 * 设置请求兑换返回提示
 * @param ret
 * @param fn
 */
SuperActivity.prototype.setModalTipsByExchange = function (ret, fn) {
    switch (parseInt(ret.result)) {
        // 成功兑换
        case 0:
            this.successExchange();
            this.hasOwnPrize = true;
            break;
        // 材料不足
        case -102 :
            LMUtils.dialog.showToast('积分不足，还不能兑换哦~', 1.5);
            break;
        // 超出可兑换数量
        case -100:
            LMUtils.dialog.showToast('超出可兑换数量了，不能兑换哦~', 1.5);
            break;
        // 库存不足/其他情况
        default:
            LMUtils.dialog.showToast('真遗憾，奖品库存不足了~', 2);
            break;
    }
};

/**
 * 工具：以特定空格分割的字符串
 * @param str
 */
SuperActivity.prototype.formatDate = function (str) {
    return str.slice(0, str.indexOf(' '));
};

/**
 * 设置字符拼接形式abc***123
 * @param str
 * @returns {string}
 */
SuperActivity.prototype.formatAccount = function (str) {
    return str.slice(0, 3) + '***' + str.slice(str.length - 3);
};

/**
 * 工具：显示小键盘UI
 * @param btn
 * @param top
 * @param left
 */
SuperActivity.prototype.showKeypad = function (btn, top, left) {
    var plat = this.platformType;
    top = top || (plat === 'hd' ? '200px' : '150px');
    left = left || '300px';
    LMKey.init({
            action: 'tel',
            top: top,
            left: left,
            input: btn.id,
            resolution: plat,
            backFocus: btn.backFocusId
        }
    );
};
