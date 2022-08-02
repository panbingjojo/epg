var LMActivity = {
    activityImagePath: '',
    areaImagePath: '',
    backgroundImage: '',
    startId: 'btn-start',
    startImage: '',
    startFocusImage: '',
    buttons: [],
    dialogConfig: null,

    init: function (activityConfig) {
        for (var attr in activityConfig) {
            if (activityConfig.hasOwnProperty(attr)) {
                this[attr] = activityConfig[attr];
            }
        }

        // 初始化背景图片
        G('background').src = this.createImageUrl('bg_home.png');

        window.onBack = this.back;
    },

    createImageUrl: function (imageFile) {
        return this.activityImagePath + imageFile;
    },

    showDialog: function (dialogConfig) {
        this.dialogConfig = dialogConfig;
        S(dialogConfig.id);
        LMEPG.ButtonManager.requestFocus(dialogConfig.focusId);
    },

    hideDialog: function (dialogConfig) {
        if (dialogConfig != null){
            this.dialogConfig = null;
            H(dialogConfig.id);
            if (dialogConfig.onDismissListener) {
                dialogConfig.onDismissListener();
            }
            LMEPG.ButtonManager.requestFocus(dialogConfig.hideFocusId);
        }
    },

    parseConfigParams: function (defaultConfig, config) {
        if (config) {
            for (var attr in config) {
                if (config.hasOwnProperty(attr)) {
                    defaultConfig[attr] = config[attr];
                }
            }
        }
    },

    addButtons: function (buttons) {
        for (var index = 0; index < buttons.length; index++) {
            this.buttons.push(buttons[index]);
        }
    },

    createDialog: function (defaultConfig, defaultHtml, defaultButtons) {
        if (defaultConfig.dialogHtml) {
            G(defaultConfig.el).innerHTML += defaultConfig.dialogHtml;
        } else {
            G(defaultConfig.el).innerHTML += defaultHtml;
        }

        if (defaultConfig.buttons) {
            this.addButtons(defaultConfig.buttons);
        } else {
            this.addButtons(defaultButtons);
        }

        H(defaultConfig.id);
    },

    exit: function () {
        // 判断是否需要显示倒计时
        if (RenderParam.isVip == '0' && LMActivity.countdownConfig && RenderParam.valueCountdown.showDialog == '1') {
            // 弹窗倒计时
            LMActivity.countdownConfig.isExit = true;
            LMActivity.showDialog(LMActivity.countdownConfig);
            LMActivity.startCountdown();
        } else {
            // 关闭当前显示对话框
            LMActivity.intent.goBack();
        }
    },

    back: function () {
        var isShowKeyboard = Boolean(G('key-table'));
        if (isShowKeyboard) {
            JJKye.hideKeyPad();
        } else if (LMActivity.dialogConfig) {
            LMActivity.hideDialog(LMActivity.dialogConfig)
        } else {
            LMActivity.exit();
        }
    },

    createActivityRule: function (ruleConfig) {
        var defaultConfig = {
            el: 'body',
            bgRules: this.createImageUrl('bg_rules.png'),
            id: 'activity-rule',
            btnExitRule: this.createImageUrl('btn_back.png'),
            btnExitRuleF: this.createImageUrl('btn_back_f.png'),
            exitRule: {
                up: '',
                down: '',
                left: '',
                right: ''
            },
            focusId: 'activity-rule',
            hideFocusId: 'btn-rules'
        };
        this.parseConfigParams(defaultConfig, ruleConfig);

        var aRuleHtml = '<div id="activity-rule">';
        aRuleHtml += '<img src="' + defaultConfig.bgRules + '"/>';
        var defaultButtons = [];
        if (defaultConfig.btnExitRule) {
            aRuleHtml += '<img id="btn-exit-rule" src="' + defaultConfig.btnExitRule + '"/>';
            defaultConfig.focusId = 'btn-exit-rule';
            defaultButtons.push(
                {
                    id: 'btn-exit-rule',
                    name: '关闭',
                    type: 'img',
                    nextFocusLeft: defaultConfig.exitRule.left,
                    nextFocusRight: defaultConfig.exitRule.right,
                    nextFocusUp: defaultConfig.exitRule.up,
                    nextFocusDown: defaultConfig.exitRule.down,
                    backgroundImage: defaultConfig.btnExitRule,
                    focusImage: defaultConfig.btnExitRuleF,
                    click: LMActivity.exitRule,
                    focusChange: "",
                    beforeMoveChange: "",
                    moveChange: "",
                    order: 0,
                    Obj: LMActivity
                }
            )
        }
        aRuleHtml += '</div>';
        this.createDialog(defaultConfig, aRuleHtml, defaultButtons);
        this.ruleConfig = defaultConfig;
    },

    showRule: function (btn) {
        LMActivity.showDialog(LMActivity.ruleConfig);
    },

    exitRule: function (btn) {
        LMActivity.hideDialog(LMActivity.ruleConfig);
    },

    createExchangePrize: function (exchangeConfig) {
        var defaultConfig = {
            el: 'body',
            bgExchange: this.createImageUrl('bg_exchange_prize.png'),
            exchangeUnable: this.createImageUrl('exchange_unable.png'),
            btnExchange: this.createImageUrl('btn_exchange_prize.png'),
            btnExchangeF: this.createImageUrl('btn_exchange_prize_f.gif'),
            btnExitExchange: this.createImageUrl('btn_back.png'),
            btnExitExchangeF: this.createImageUrl('btn_back_f.png'),
            onDismissListener: function () {
                if (LMActivity.exchangeConfig.exConfigButtons) {
                    LMEPG.ButtonManager.deleteButtons(LMActivity.exchangeConfig.exConfigButtons);
                }
            },
            exchange1: {
                up: '',
                down: '',
                left: '',
                right: 'btn-exchange-2'
            }, exchange2: {
                up: '',
                down: '',
                left: 'btn-exchange-1',
                right: 'btn-exchange-3'
            }, exchange3: {
                up: 'btn-exit-exchange',
                down: '',
                left: 'btn-exchange-2',
                right: ''
            }, exitExchange: {
                up: '',
                down: 'btn-exchange-3',
                left: '',
                right: ''
            },
            exchangePoint: [],
            myPoint: 0,
            id: 'exchange-prize',
            myPointId: 'exchange-own-point',
            dialogWrapId: 'exchange-dialog-wrap',
            focusId: 'btn-exchange-1',
            hideFocusId: 'btn-exchange'
        };
        this.parseConfigParams(defaultConfig, exchangeConfig);

        var exPrizeHtml = '<div id="exchange-prize">';
        exPrizeHtml += '<img src="' + defaultConfig.bgExchange + '"/>';
        exPrizeHtml += '<img id="btn-exchange-1" src="' + defaultConfig.exchangeUnable + '"/>';
        exPrizeHtml += '<img id="btn-exchange-2" src="' + defaultConfig.exchangeUnable + '"/>';
        exPrizeHtml += '<img id="btn-exchange-3" src="' + defaultConfig.exchangeUnable + '"/>';
        exPrizeHtml += '<img id="btn-exit-exchange" src="' + defaultConfig.btnExitExchange + '"/>';
        exPrizeHtml += '<div id="exchange-point-1">' + defaultConfig.exchangePoint[0].prizeConsume + '</div>';
        exPrizeHtml += '<div id="exchange-point-2">' + defaultConfig.exchangePoint[1].prizeConsume + '</div>';
        exPrizeHtml += '<div id="exchange-point-3">' + defaultConfig.exchangePoint[2].prizeConsume + '</div>';
        exPrizeHtml += '<div id="' + defaultConfig.myPointId + '">' + defaultConfig.myPoint + '</div>';
        exPrizeHtml += '<div id="' + defaultConfig.dialogWrapId + '"></div></div>';
        defaultConfig.innerHTML = exPrizeHtml;
        var defaultButtons = [];
        this.createDialog(defaultConfig, exPrizeHtml, defaultButtons);
        this.exchangeConfig = defaultConfig;
    },

    exchangePrize: function (btn) {
        var self = btn.Obj;
        LMActivity.exchangeConfig.exchangeId = btn.id;
        var order = btn.order;
        // 请求后台接口
        LMActivity.ajaxHelper.exchangePrize(LMActivity.exchangeConfig.exchangePoint[order].prizeId, LMActivity.exchangeSuccess, LMActivity.exchangeFail);
    },

    exitExchange: function (btn) {
        LMActivity.hideDialog(LMActivity.exchangeConfig);
    },

    showExchangePrize: function (showExchangeConfig) {
        var exchangeConfig = LMActivity.exchangeConfig;
        G(exchangeConfig.myPointId).innerHTML = RenderParam.score;
        var exConfigButtons = [];
        exConfigButtons.push({
            id: 'btn-exit-exchange',
            name: '退出退换',
            type: 'img',
            nextFocusLeft: showExchangeConfig.exitExchange.left,
            nextFocusRight: showExchangeConfig.exitExchange.right,
            nextFocusUp: showExchangeConfig.exitExchange.up,
            nextFocusDown: showExchangeConfig.exitExchange.down,
            backgroundImage: exchangeConfig.btnExitExchange,
            focusImage: exchangeConfig.btnExitExchangeF,
            click: LMActivity.exitExchange,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            Obj: LMActivity
        });
        if (LMActivity.exchangeConfig.canExchange()){
            if (showExchangeConfig.enableExchange1) {
                exConfigButtons.push({
                    id: 'btn-exchange-1',
                    name: '兑换奖品1',
                    type: 'img',
                    nextFocusLeft: showExchangeConfig.exchange1.left,
                    nextFocusRight: showExchangeConfig.exchange1.right,
                    nextFocusUp: showExchangeConfig.exchange1.up,
                    nextFocusDown: showExchangeConfig.exchange1.down,
                    backgroundImage: exchangeConfig.btnExchange,
                    focusImage: exchangeConfig.btnExchangeF,
                    click: LMActivity.exchangePrize,
                    focusChange: "",
                    beforeMoveChange: "",
                    moveChange: "",
                    order: 0,
                    Obj: LMActivity
                });
                G('btn-exchange-1').src = exchangeConfig.btnExchange;
            }
            if (showExchangeConfig.enableExchange2) {
                exConfigButtons.push({
                    id: 'btn-exchange-2',
                    name: '兑换奖品2',
                    type: 'img',
                    nextFocusLeft: showExchangeConfig.exchange2.left,
                    nextFocusRight: showExchangeConfig.exchange2.right,
                    nextFocusUp: showExchangeConfig.exchange2.up,
                    nextFocusDown: showExchangeConfig.exchange2.down,
                    backgroundImage: exchangeConfig.btnExchange,
                    focusImage: exchangeConfig.btnExchangeF,
                    click: LMActivity.exchangePrize,
                    focusChange: "",
                    beforeMoveChange: "",
                    moveChange: "",
                    order: 1,
                    Obj: LMActivity
                });
                G('btn-exchange-2').src = exchangeConfig.btnExchange;
            }
            if (showExchangeConfig.enableExchange3) {
                exConfigButtons.push({
                    id: 'btn-exchange-3',
                    name: '兑换奖品3',
                    type: 'img',
                    nextFocusLeft: showExchangeConfig.exchange3.left,
                    nextFocusRight: showExchangeConfig.exchange3.right,
                    nextFocusUp: showExchangeConfig.exchange3.up,
                    nextFocusDown: showExchangeConfig.exchange3.down,
                    backgroundImage: exchangeConfig.btnExchange,
                    focusImage: exchangeConfig.btnExchangeF,
                    click: LMActivity.exchangePrize,
                    focusChange: "",
                    beforeMoveChange: "",
                    moveChange: "",
                    order: 2,
                    Obj: LMActivity
                });
                G('btn-exchange-3').src = exchangeConfig.btnExchange;
            }
        }
        LMEPG.ButtonManager.addButtons(exConfigButtons);
        exchangeConfig.exConfigButtons = exConfigButtons;
        LMActivity.showDialog(LMActivity.exchangeConfig);
    },

    exchangeSuccess: function () {
        LMActivity.showDialog(LMActivity.exSuccessConfig);
    },

    exchangeFail: function (errorCode) {
        if (errorCode == -101) {
            // 显示库存不足页面
            LMActivity.underStockConfig.hideFocusId = LMActivity.exchangeConfig.exchangeId;
            LMActivity.showTimeoutDialog(LMActivity.underStockConfig);
        } else {
            // 显示奖品失效页面
            LMActivity.loseEfficacyConfig.hideFocusId = LMActivity.exchangeConfig.exchangeId;
            LMActivity.showTimeoutDialog(LMActivity.loseEfficacyConfig);
        }
    },

    createExSuccessDialog: function (successConfig) {
        var defaultConfig = {
            el: LMActivity.exchangeConfig.dialogWrapId,
            bgExSuccess: this.createImageUrl('bg_exchange_success.png'),
            btnSure: this.createImageUrl('btn_sure.png'),
            btnSureF: this.createImageUrl('btn_sure_f.png'),
            btnCancel: this.createImageUrl('btn_cancel.png'),
            btnCancelF: this.createImageUrl('btn_cancel_f.png'),
            exchangeSure: {
                up: 'exchange-phone',
                left: 'btn-exchange-cancel',
                right: 'btn-exchange-cancel',
                down: ''
            },
            exchangeCancel: {
                up: 'exchange-phone',
                left: 'btn-exchange-sure',
                right: 'btn-exchange-sure',
                down: ''
            },
            exchangePhone: {
                up: '',
                left: '',
                right: '',
                down: 'btn-exchange-sure'
            },
            id: 'exchange-prize-success',
            focusId: 'btn-exchange-sure',
            onDismissListener: function () {
                LMActivity.intent.reload();
            }
        };
        this.parseConfigParams(defaultConfig, successConfig);
        var exSuccessHtml = '<div id="exchange-prize-success">';
        exSuccessHtml += '<img src="' + defaultConfig.bgExSuccess + '"/>';
        exSuccessHtml += '<div id="exchange-phone">请输入有效的手机号码</div>';
        exSuccessHtml += '<img id="btn-exchange-sure" src="' + defaultConfig.btnSure + '" />';
        exSuccessHtml += '<img id="btn-exchange-cancel" src="' + defaultConfig.btnCancel + '" />';
        var defaultButtons = [
            {
                id: 'btn-exchange-sure',
                name: '确定兑换',
                type: 'img',
                nextFocusLeft: defaultConfig.exchangeSure.left,
                nextFocusRight: defaultConfig.exchangeSure.right,
                nextFocusUp: defaultConfig.exchangeSure.up,
                nextFocusDown: defaultConfig.exchangeSure.down,
                backgroundImage: defaultConfig.btnSure,
                focusImage: defaultConfig.btnSureF,
                click: LMActivity.setExchangePhone,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                Obj: LMActivity
            }, {
                id: 'btn-exchange-cancel',
                name: '取消兑换',
                type: 'img',
                nextFocusLeft: defaultConfig.exchangeCancel.left,
                nextFocusRight: defaultConfig.exchangeCancel.right,
                nextFocusUp: defaultConfig.exchangeCancel.up,
                nextFocusDown: defaultConfig.exchangeCancel.down,
                backgroundImage: defaultConfig.btnCancel,
                focusImage: defaultConfig.btnCancelF,
                click: LMActivity.cancelExchange,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                Obj: LMActivity
            }, {
                id: 'exchange-phone',
                name: '取消兑换',
                type: 'div',
                nextFocusLeft: defaultConfig.exchangePhone.left,
                nextFocusRight: defaultConfig.exchangePhone.right,
                nextFocusUp: defaultConfig.exchangePhone.up,
                nextFocusDown: defaultConfig.exchangePhone.down,
                backgroundImage: '',
                focusImage: '',
                click: '',
                focusChange: LMActivity.onExPhoneFocus,
                beforeMoveChange: "",
                moveChange: "",
                keyboardTop: defaultConfig.keyboardTop,
                Obj: LMActivity
            }
        ];
        this.createDialog(defaultConfig, exSuccessHtml, defaultButtons);
        this.exSuccessConfig = defaultConfig;
    },

    onExPhoneFocus: function (btn, hasFocus) {
        var self = btn.obj;
        if (hasFocus) {
            JJKye.init({
                top: btn.keyboardTop,
                action: 'tel',
                input: 'exchange-phone', //  输入框ID
                backFocus: 'btn-exchange-sure', // 返回ID
                resolution: RenderParam.platformType || 'hd' // 盒子分辨率
            });
        }
    },

    setExchangePhone: function (btn) {
        var phoneTex = G("exchange-phone");
        var userTel = phoneTex.innerHTML;
        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast("请输入有效的手机号码");
            return;
        }
        LMActivity.ajaxHelper.setPrizePhone(userTel, self.prizeId, LMActivity.setExPhoneSuccess, LMActivity.setExPhoneFail);
    },

    cancelExchange: function () {
        LMActivity.intent.reload();
    },

    setExPhoneSuccess: function () {
        LMActivity.intent.reload();
    },

    setExPhoneFail: function () {

    },

    createWinnerList: function (winnerListConfig) {
        var defaultConfig = {
            el: 'body',
            bgWinnerList: this.createImageUrl('bg_winner_list.png'),
            btnSure: this.createImageUrl('btn_sure.png'),
            btnSureF: this.createImageUrl('btn_sure_f.png'),
            btnCancel: this.createImageUrl('btn_cancel.png'),
            btnCancelF: this.createImageUrl('btn_cancel_f.png'),
            listSure: {
                up: 'prize-phone',
                left: 'btn-list-cancel',
                right: 'btn-list-cancel',
                down: ''
            },
            listCancel: {
                up: 'prize-phone',
                left: 'btn-list-sure',
                right: 'btn-list-sure',
                down: ''
            },
            listPhone: {
                up: '',
                left: '',
                right: '',
                down: 'btn-list-sure'
            },
            prizePhone: '请输入正确的手机号码',
            id: 'winner-list',
            focusId: 'btn-list-sure',
            hideFocusId: 'btn-winner-list'
        };
        this.parseConfigParams(defaultConfig, winnerListConfig);

        var winnerListHtml = '<div id="' + defaultConfig.id + '">';
        winnerListHtml += '<img src="' + defaultConfig.bgWinnerList + '"/>';
        winnerListHtml += '<img id="btn-list-sure"  src="' + defaultConfig.btnSure + '"/>';
        winnerListHtml += '<img id="btn-list-cancel"  src="' + defaultConfig.btnCancel + '"/>';
        winnerListHtml += '<div id="prize-phone" >' + defaultConfig.prizePhone + '</div>';
        winnerListHtml += '<marquee id="all-prizes" behavior="" direction="up"></marquee>';
        winnerListHtml += '<div id="my-prize-wrap"></div>';

        var defaultButtons = [{
            id: 'btn-list-sure',
            name: '确定',
            type: 'img',
            nextFocusLeft: defaultConfig.listSure.left,
            nextFocusRight: defaultConfig.listSure.right,
            nextFocusUp: defaultConfig.listSure.up,
            nextFocusDown: defaultConfig.listSure.down,
            backgroundImage: defaultConfig.btnSure,
            focusImage: defaultConfig.btnSureF,
            click: LMActivity.updatePrizePhone,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            Obj: LMActivity
        }, {
            id: 'btn-list-cancel',
            name: '取消',
            type: 'img',
            nextFocusLeft: defaultConfig.listCancel.left,
            nextFocusRight: defaultConfig.listCancel.right,
            nextFocusUp: defaultConfig.listCancel.up,
            nextFocusDown: defaultConfig.listCancel.down,
            backgroundImage: defaultConfig.btnCancel,
            focusImage: defaultConfig.btnCancelF,
            click: LMActivity.exitWinnerList,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            Obj: LMActivity
        }, {
            id: 'prize-phone',
            name: '中奖电话',
            type: 'div',
            nextFocusLeft: defaultConfig.listPhone.left,
            nextFocusRight: defaultConfig.listPhone.right,
            nextFocusUp: defaultConfig.listPhone.up,
            nextFocusDown: defaultConfig.listPhone.down,
            backgroundImage: '',
            focusImage: '',
            click: '',
            focusChange: LMActivity.onPrizePhoneFocus,
            beforeMoveChange: "",
            moveChange: "",
            keyboardTop: defaultConfig.keyboardTop,
            Obj: LMActivity
        }];
        this.createDialog(defaultConfig, winnerListHtml, defaultButtons);
        this.winnerListConfig = defaultConfig;
    },

    exitWinnerList: function () {
        LMActivity.hideDialog(LMActivity.winnerListConfig);
    },

    updatePrizePhone: function (btn) {
        var self = btn.Obj;
        var userTel = G("prize-phone").innerHTML;
        //判断手机号是否正确
        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast("请填写正确的手机号！", 3);
            return;
        }
        // 判断获奖信息是否在空
        if (!LMActivity.myPrize) {
            LMEPG.UI.showToast("您尚未中奖！", 3);
            return;
        }
        // 提取中奖奖品id
        if (!LMActivity.myPrize['goods_id']) {
            LMEPG.UI.showToast("中奖编号为空！", 3);
            return;
        }
        // 修改获奖电话
        LMActivity.ajaxHelper.updatePrizePhone(userTel, LMActivity.myPrize['goods_id'], true, LMActivity.updatePhoneSuccess, LMActivity.updatePhoneFailed);
    },

    onPrizePhoneFocus: function (btn, hasFocus) {
        var self = btn.obj;
        if (hasFocus) {
            JJKye.init({
                top: btn.keyboardTop,
                action: 'tel',
                input: 'prize-phone', //  输入框ID
                backFocus: 'btn-list-sure', // 返回ID
                resolution: RenderParam.platformType || 'hd' // 盒子分辨率
            });
        }
    },

    updatePhoneSuccess: function () {
        LMActivity.intent.reload();
    },

    updatePhoneFailed: function () {

    },

    showWinnerList: function (allPrizeInfo, myPrizeInfo, prizePhone) {
        var allPrizeHtml = '<table >';
        var col = 1;
        var exPrizeDate = '';
        for (var index = 0; index < allPrizeInfo.length; index++) {
            allPrizeHtml += '<tr>';
            allPrizeHtml += '<td class="col-1" colspan=' + col + '>' + LMActivity.func.formatWinnerUser(allPrizeInfo[index]['user_account']) + '</td>';
            allPrizeHtml += '<td class="col-2" colspan=' + col + '>' + LMActivity.func.formatWinnerDate(allPrizeInfo[index]['log_dt']) + '</td>';
            allPrizeHtml += '<td class="col-3" colspan=' + col + '>' + allPrizeInfo[index]['goods_name'] + '</td>';
            allPrizeHtml += '</tr>';

            if (RenderParam.userAccount === allPrizeInfo[index]['user_account']) {
                exPrizeDate = LMActivity.func.formatWinnerDate(allPrizeInfo[index]['log_dt']);
            }
        }
        allPrizeHtml += '</table>';
        G('all-prizes').innerHTML = allPrizeHtml;

        var myPrizeHtml = '';

        // dialogHtml += '<marquee id="my_prizes" behavior="" direction="up"  scrollamount="1">';
        myPrizeHtml += '<table id="my-prize">';
        if (myPrizeInfo.length) {
            LMActivity.myPrize = myPrizeInfo[0];
            myPrizeHtml += '<tr>';
            myPrizeHtml += '<td class="col-1" colspan=' + col + '>' + LMActivity.func.formatWinnerUser(RenderParam.userAccount);
            myPrizeHtml += '<td class="col-2" colspan=' + col + '>' + exPrizeDate;
            myPrizeHtml += '<td class="col-3" colspan=' + col + '>' + this.myPrize['goods_name'];
            if (LMActivity.myPrize["user_tel"]) {
                G('prize-phone').innerHTML = LMActivity.myPrize["user_tel"];
            }
        } else {
            myPrizeHtml += '<tr>';
            myPrizeHtml += '<td class="col-1" colspan=' + col + '>';
            myPrizeHtml += '<td class="col-2" colspan=' + col + '>暂无中奖纪录';
            myPrizeHtml += '<td class="col-3" colspan=' + col + '>';
            G('prize-phone').innerHTML = "请输入正确的手机号码";
        }
        myPrizeHtml += '</table>';
        G('my-prize-wrap').innerHTML = myPrizeHtml;

        this.showDialog(this.winnerListConfig);
    },

    createCountdownDialog: function (countdownConfig) {
        var defaultConfig = {
            el: 'body',
            count: 8,
            bgCountdown: this.createImageUrl('bg_countdown.png'),
            onDismissListener: function () {
                // 倒计时退出逻辑
                if (LMActivity.countdownConfig.isExit) {
                    LMActivity.intent.goBack();
                }
                clearInterval(LMActivity.countInterval);
            },
            id: 'countdown-dialog'
        };
        this.parseConfigParams(defaultConfig, countdownConfig);

        var countdownHtml = '<div id="'+ defaultConfig.id +'">';
        countdownHtml += '<img  src="' + defaultConfig.bgCountdown + '"/>';
        countdownHtml += '<div id="count">' + defaultConfig.count + '</div>';
        countdownHtml += '</div>';

        var defaultButtons = [];
        this.createDialog(defaultConfig, countdownHtml, defaultButtons);
        this.countdownConfig = defaultConfig
    },

    startCountdown: function () {
        LMActivity.count = 8;
        G('count').innerText = String(LMActivity.count);
        this.countInterval = setInterval(function () {
            G('count').innerText = String(--LMActivity.count);
            if (LMActivity.count == 0) {
                clearTimeout(LMActivity.countTimer);
                // ajax请求保存数据，并且增加额外游戏机会
                var countdownValue = {
                    showDialog: "0"
                };
                LMActivity.ajaxHelper.saveData(RenderParam.keyCountdown, JSON.stringify(countdownValue), function () {
                    // 增加额外机会
                    LMActivity.ajaxHelper.addExtraTimes(function () {
                        // 刷新当前页面
                        LMActivity.intent.reload();
                    }, function () {
                        LMEPG.UI.showToast("游戏机会增加失败", 3);
                        // 刷新当前页面
                        LMActivity.intent.reload();
                    });
                })
            }
        }, 1000);
    },

    createCommonDialog: function (dialogConfig) {
        var defaultButtons = [];
        var dialogHtml = '<div id="' + dialogConfig.id + '">';
        dialogHtml += '<img src="' + dialogConfig.bgDialog + '">';
        if (dialogConfig.btnSure) {
            dialogHtml += '<img id="' + dialogConfig.sureId + '" src="' + dialogConfig.btnSure + '">';
            defaultButtons.push(
                {
                    id: dialogConfig.sureId,
                    name: '确定',
                    type: 'img',
                    nextFocusLeft: dialogConfig.sure.left,
                    nextFocusRight: dialogConfig.sure.right,
                    nextFocusUp: dialogConfig.sure.up,
                    nextFocusDown: dialogConfig.sure.down,
                    backgroundImage: dialogConfig.btnSure,
                    focusImage: dialogConfig.btnSureF,
                    click: dialogConfig.onClickSureListener,
                    focusChange: "",
                    beforeMoveChange: "",
                    moveChange: "",
                    Obj: this
                }
            )
        }
        if (dialogConfig.btnCancel) {
            dialogHtml += '<img id="' + dialogConfig.cancelId + '" src="' + dialogConfig.btnCancel + '">';
            defaultButtons.push(
                {
                    id: dialogConfig.cancelId,
                    name: '确定',
                    type: 'img',
                    nextFocusLeft: dialogConfig.cancel.left,
                    nextFocusRight: dialogConfig.cancel.right,
                    nextFocusUp: dialogConfig.cancel.up,
                    nextFocusDown: dialogConfig.cancel.down,
                    backgroundImage: dialogConfig.btnCancel,
                    focusImage: dialogConfig.btnCancelF,
                    click: dialogConfig.onClickCancelListener,
                    focusChange: "",
                    beforeMoveChange: "",
                    moveChange: "",
                    Obj: this
                }
            )
        }
        this.createDialog(dialogConfig, dialogHtml, defaultButtons);
    },

    createPurchaseDialog: function (purchaseConfig) {
        var defaultConfig = {
            el: 'body',
            id: 'purchase-dialog',
            sureId: 'btn-purchase-sure',
            cancelId: 'btn-purchase-cancel',
            focusId: 'btn-purchase-sure',
            bgDialog: this.createImageUrl('bg_purchase.png'),
            btnSure: this.createImageUrl('btn_sure.png'),
            btnSureF: this.createImageUrl('btn_sure_f.png'),
            btnCancel: this.createImageUrl('btn_cancel.png'),
            btnCancelF: this.createImageUrl('btn_cancel_f.png'),
            sure: {
                up: '',
                down: '',
                left: 'btn-purchase-cancel',
                right: 'btn-purchase-cancel'
            },
            cancel: {
                up: '',
                down: '',
                left: 'btn-purchase-sure',
                right: 'btn-purchase-sure'
            },
            onClickSureListener: LMActivity.intent.jumpBuyVip,
            onClickCancelListener: LMActivity.cancelPurchase
        };

        this.parseConfigParams(defaultConfig, purchaseConfig);
        this.createCommonDialog(defaultConfig);
        this.purchaseConfig = defaultConfig;
    },

    cancelPurchase: function () {
        // 判断是否需要显示倒计时
        if (RenderParam.valueCountdown.showDialog == '1') {
            // 弹窗倒计时
            LMActivity.countdownConfig.isExit = false;
            LMActivity.hideDialog(LMActivity.purchaseConfig);
            LMActivity.showDialog(LMActivity.countdownConfig);
            LMActivity.startCountdown();
        } else {
            // 关闭当前显示对话框
            LMActivity.hideDialog(LMActivity.purchaseConfig);
        }
    },

    createPaySuccess: function (paySuccessConfig) {
        var defaultConfig = {
            el: 'body',
            id: 'pay-success-dialog',
            focusId: 'pay-success-dialog',
            bgDialog: this.createImageUrl('bg_pay_success.png')
        };
        this.parseConfigParams(defaultConfig, paySuccessConfig);
        this.createCommonDialog(defaultConfig);
        this.paySuccessConfig = defaultConfig;
    },

    createPayFail: function (payFailConfig) {
        var defaultConfig = {
            el: 'body',
            id: 'pay-fail-dialog',
            focusId: 'pay-fail-dialog',
            bgDialog: this.createImageUrl('bg_pay_fail.png')
        };
        this.parseConfigParams(defaultConfig, payFailConfig);
        this.createCommonDialog(defaultConfig);
        this.payFailConfig = defaultConfig;
    },

    createUnderStock: function (underStockConfig) {
        var defaultConfig = {
            el: LMActivity.exchangeConfig.dialogWrapId,
            id: 'under-stock-dialog',
            focusId: 'under-stock-dialog',
            bgDialog: this.createImageUrl('bg_understock.png'),
            onDismissListener: function () {
                this.dialogConfig = LMActivity.exchangeConfig;
            }
        };
        this.parseConfigParams(defaultConfig, underStockConfig);
        this.createCommonDialog(defaultConfig);
        this.underStockConfig = defaultConfig;
    },

    createLoseEfficacy: function (loseEfficacyConfig) {
        var defaultConfig = {
            el: LMActivity.exchangeConfig.dialogWrapId,
            id: 'lose-efficacy-dialog',
            focusId: 'lose-efficacy-dialog',
            bgDialog: this.createImageUrl('bg_lose_efficacy.png'),
            onDismissListener: function () {
                this.dialogConfig = LMActivity.exchangeConfig;
            }
        };
        this.parseConfigParams(defaultConfig, loseEfficacyConfig);
        this.createCommonDialog(defaultConfig);
        this.loseEfficacyConfig = defaultConfig;
    },

    showOrderResult: function () {
        if (RenderParam.isOrderBack == "1") {
            if (RenderParam.cOrderResult == "1") {
                LMActivity.showTimeoutDialog(LMActivity.paySuccessConfig);
            } else {
                LMActivity.showTimeoutDialog(LMActivity.payFailConfig);
            }
        }
    },

    showTimeoutDialog: function (dialogConfig) {
        LMActivity.showDialog(dialogConfig);
        LMActivity.timeoutId = setTimeout(function () {
            LMActivity.hideDialog(dialogConfig);
            clearTimeout(LMActivity.timeoutId);
        },3000);
    },

    intent: {
        /**
         * 获取当前页对象
         */
        getCurrentPage: function getCurrentPage() {
            var objCurrent = LMEPG.Intent.createIntent("activity-common-guide");
            objCurrent.setParam("userId", RenderParam.userId);
            objCurrent.setParam("inner", RenderParam.inner);
            return objCurrent;
        },

        /**
         * @func 进行购买操作
         * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
         * @returns {boolean}
         */
        jumpBuyVip: function () {
            var objCurrent = LMActivity.intent.getCurrentPage(RenderParam.userId, RenderParam.inner);

            var objOrderHome = LMEPG.Intent.createIntent("orderHome");
            objOrderHome.setParam("userId", RenderParam.userId);
            objOrderHome.setParam("directPay", "1");
            objOrderHome.setParam("orderReason", "101");
            objOrderHome.setParam("remark", RenderParam.activityName);

            var objActivityGuide = LMActivity.intent.getCurrentPage();
            objActivityGuide.setParam("isOrderBack", "1"); // 表示订购回来

            LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
        },

        reload: function () {
            LMEPG.ButtonManager.setKeyEventPause(true);
            LMEPG.UI.showWaitingDialog('', 0.4, function () {
                LMEPG.Intent.jump(LMActivity.intent.getCurrentPage());
            });
        },

        goBack: function () {
            LMEPG.Intent.back(); // 应用内活动，直接返回上一级页面
        }
    },

    ajaxHelper: {
        updateScore: function (score, successCallback,failCallback) {
            // 未清扫、剩余次数大于0
            var reqData = {
                'score': score,
                'remark': '用户积分'
            };
            LMEPG.ajax.postAPI('Activity/addUserScore', reqData,
                function (data) {
                    try {
                        if (data.result != 0) {
                            LMEPG.UI.showToast("上传积分失败!");
                            failCallback();
                        }else {
                            successCallback();
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("上传积分解析异常!" + e);
                    }
                },
                function (data) {
                    LMEPG.UI.showToast("上传积分请求失败!");
                }
            );
        },
        uploadPlayRecord: function (callback) {
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Activity/uploadPlayedRecord', null,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        callback();
                        LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录' + (result == 0 ? '成功！' : '失败！'));
                    } catch (e) {
                        LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录解析异常！error:' + e.toString());
                    }
                },
                function (rsp) {
                    LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录发生错误！rsp:' + rsp.toString());
                }
            );
        },
        setPrizePhone: function (userTel, prizeIdx, successCallback, errorCallback) {
            var reqData = {
                "action": "phone",
                "number": userTel,
                "prizeIdx": prizeIdx
            };
            LMEPG.ajax.postAPI('Activity/commonAjax', reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            LMEPG.UI.showToast("提交电话成功！");
                            successCallback();
                        } else {
                            LMEPG.UI.showToast("提交失败，请重试！");
                            errorCallback();
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("保存手机号结果处理异常！");
                        LMEPG.Log.error(e.toString());
                        console.log(e.toString())
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("请求保存手机号发生错误！");
                });
        },
        updatePrizePhone: function (userTel, prizeIndex, isExchange, successCallback, errorCallback) {
            var reqData = {
                "phoneNumber": userTel,
                "prizeIdx": prizeIndex
            };
            var url = 'Activity/setPhoneNumber';
            if (isExchange) {
                url = 'Activity/setPhoneNumberForExchange'
            }
            LMEPG.ajax.postAPI(url, reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            LMEPG.UI.showToast("提交电话成功！");
                            successCallback();
                        } else {
                            LMEPG.UI.showToast("提交失败，请重试！");
                            errorCallback();
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("保存手机号结果处理异常！");
                        LMEPG.Log.error(e.toString());
                        console.log(e.toString())
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("请求保存手机号发生错误！");
                });
        },
        lottery: function (successCallback, errorCallback, isShowWaiting) {
            var postData = {
                "action": "lottery",
                "lottery": 1
            };
            if (isShowWaiting) {
                LMEPG.UI.showWaitingDialog();
            }
            LMEPG.ajax.postAPI('Activity/commonAjax', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (data.result == 1) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        console.log(e)
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        },
        saveData: function (key, value, successCallback, errorCallback) {
            var postData = {
                "key": key,
                "value": value
            };
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Common/saveData', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (data.result == 0) {
                            successCallback();
                        } else {
                            errorCallback(data.result);
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        errorCallback(e);
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                    errorCallback(rsp);
                }
            );
        },
        addExtraTimes: function (successCallback, errCallback) {
            var postData = {};
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Activity/addExtraTimes', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (data.result == 0) {
                            successCallback();
                        } else {
                            errCallback();
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        console.log(e)
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        },
        subExtraTimes: function (successCallback, errCallback) {
            var postData = {};
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Activity/subExtraTimes', postData,
                function (rsp) {
                    LMEPG.UI.dismissWaitingDialog();
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (data.result == 0) {
                            successCallback();
                        } else {
                            errCallback();
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        console.log(e)
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        },
        exchangePrize: function (id, successCallback, errorCallback) {
            var postData = {
                action: "bgExchange",
                goodsId: id,
                score: 0
            };
            LMEPG.UI.showWaitingDialog();
            LMEPG.ButtonManager.setKeyEventPause(true);
            LMEPG.ajax.postAPI('Activity/commonAjax', postData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : rsp ? JSON.parse(rsp) : rsp;
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.ButtonManager.setKeyEventPause(false);
                        if (data.result == 0) {
                            successCallback(id);
                        } else {
                            errorCallback(data.result);
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        LMEPG.Log.error(e.toString());
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        }
    },

    func: {
        getParams: function (param) {
            // 判空操作
            return param ? param : "";
        },

        getRandomInt: function (max) {
            return Math.floor(Math.random() * Math.floor(max));
        },

        formatWinnerUser: function (str) {
            if (str) {
                return str.substring(0, 3) + "***" + str.substring(str.length - 3);
            }
        },

        formatWinnerDate: function (dateStr) {
            if (dateStr) {
                return new Date(LMActivity.func.getStandardDate(dateStr)).format("yyyy-MM-dd");
            }
        },

        getStandardDate: function (dt) {
            var time = dt.replace(/-/g, ':').replace(' ', ':');
            time = time.split(':');
            return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
        }
    }
};