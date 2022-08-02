var LMActivity = {
    buttons: [],
    dialogConfig: null,

    init: function () {
        window.onBack = LMActivity.back;
    },

    // ------  公共函数处理 start ------
    createImageUrl: function (imageFile) {
        // 图片公用路径
        return RenderParam.imagePath + imageFile;
    },

    createRegionImageUrl: function (imageFile) {
        // 图片差异化路径，LMActivity.imageRegionPath在不同活动内部设置
        return LMActivity.imageRegionPath + imageFile;
    },

    showDialog: function (dialogConfig) {
        // 1、记录当前正在显示页面的配置信息
        this.dialogConfig = dialogConfig;
        // 2、显示页面
        S(dialogConfig.id);
        if (dialogConfig.onShowListener) {
            // 3、检测页面是否设置显示监听器，如果设置则调用
            dialogConfig.onShowListener();
        }
        // 4、控制当前显示的焦点
        LMEPG.ButtonManager.requestFocus(dialogConfig.focusId);
    },

    hideDialog: function (dialogConfig) {
        if (dialogConfig != null) {
            // 1、清除之前显示的页面信息
            this.dialogConfig = null;
            // 2、隐藏页面
            H(dialogConfig.id);
            if (dialogConfig.onDismissListener) {
                // 3、检测页面是否设置隐藏监听器，如果设置则调用
                dialogConfig.onDismissListener();
            }
            // 4、控制当前显示的焦点
            LMEPG.ButtonManager.requestFocus(dialogConfig.hideFocusId);
        }
    },

    exit: function () {
        if (RenderParam.isVip == '0' && LMActivity.countdownConfig &&
            RenderParam.valueCountdown.showDialog == '1') {
            // 检测当前用户是否VIP，如果是普通用户，弹窗倒计时
            LMActivity.countdownConfig.isExit = true; // 标识在倒计时弹窗页面返回时需要退出当前活动
            LMActivity.showDialog(LMActivity.countdownConfig);
        } else {
            // 检测当前用户是否VIP，如果是VIP用户，退出当前活动
            LMActivity.intent.goBack();
        }
    },

    back: function () {
        var isShowKeyboard = Boolean(G('key-table'));
        if (isShowKeyboard) {
            // 1、检测当前页面是否弹出软键盘，如果弹出则关闭
            JJKye.hideKeyPad();
        } else if (LMActivity.dialogConfig) {
            // 2、检测当前活动是否显示页面组件，如果显示则关闭
            LMActivity.hideDialog(LMActivity.dialogConfig)
        } else {
            // 3、在活动首页，逻辑同首页返回按钮
            LMActivity.exit();
        }
    },
    // ------  公共函数处理 end ------

    // ------  公共页面组件活动规则 start ------
    initActivityRuleButton: function () {
        LMActivity.buttons.push({
            id: 'btn-exit-rule',
            name: '退出活动规则',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: LMActivity.createImageUrl('btn_close.png'),
            focusImage: LMActivity.createImageUrl('btn_close_f.gif'),
            click: LMActivity.exitActivityRule,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: ""
        })
    },
    activityRuleConfig: {
        id: 'activity-rule',
        focusId: 'btn-exit-rule',
        hideFocusId: 'btn-rules'
    },
    showActivityRule: function () {
        LMActivity.showDialog(LMActivity.activityRuleConfig);
    },
    exitActivityRule: function () {
        LMActivity.hideDialog(LMActivity.activityRuleConfig);
    },
    // ------  公共页面组件活动规则 end ------

    // ------  公共页面组件兑换奖品 start ------
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
        if (LMActivity.exchangeConfig.canExchange()) {
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
    onExPhoneFocus: function (btn, hasFocus) {
        if (hasFocus) {
            JJKye.init({
                top: btn.keyboardTop,
                action: 'tel',
                input: 'exchange-phone-container', //  输入框ID
                backFocus: 'btn-exchange-phone', // 返回ID
                resolution: RenderParam.platformType || 'hd' // 盒子分辨率
            });
        }
    },
    exitExchange: function () {
        LMActivity.hideDialog(LMActivity.exchangeConfig);
    },
    // ------  公共页面组件兑换奖品 end ------

    // ------  公共页面组件中奖名单 end ------
    WinnerListType: {
        Exchange: 1, //中奖名单类型为兑换奖品
        Lottery: 2   //中奖名单类型为抽奖奖品
    },
    winnerListConfig: {
        id: 'winner-list',
        focusId: 'btn-update-phone',
        hideFocusId: 'btn-winner-list'
    },
    initWinnerListButton: function (keyBoardTop) {
        LMActivity.buttons.push({
            id: 'btn-update-phone',
            name: '修改获奖电话',
            type: 'img',
            nextFocusLeft: 'btn-reset-phone',
            nextFocusRight: 'btn-reset-phone',
            nextFocusUp: 'list-phone-container',
            nextFocusDown: '',
            backgroundImage: LMActivity.createImageUrl('btn_sure.png'),
            focusImage: LMActivity.createImageUrl('btn_sure_f.png'),
            click: LMActivity.updatePrizePhone,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: ""
        }, {
            id: 'btn-reset-phone',
            name: '退出中奖名单',
            type: 'img',
            nextFocusLeft: 'btn-update-phone',
            nextFocusRight: 'btn-update-phone',
            nextFocusUp: 'list-phone-container',
            nextFocusDown: '',
            backgroundImage: LMActivity.createImageUrl('btn_cancel.png'),
            focusImage: LMActivity.createImageUrl('btn_cancel_f.png'),
            click: LMActivity.exitWinnerList,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: ""
        }, {
            id: 'list-phone-container',
            name: '中奖电话',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'btn-update-phone',
            backgroundImage: '',
            focusImage: '',
            click: '',
            focusChange: LMActivity.onPrizePhoneFocus,
            beforeMoveChange: "",
            moveChange: "",
            keyboardTop: keyBoardTop
        })
    },
    initWinnerList: function (listType) {
        LMActivity.winnerListType = listType;
        switch (listType) {
            case LMActivity.WinnerListType.Exchange:
                LMActivity.winnerListInfo = {
                    allListInfo: RenderParam.exchangeRecords.data['all_list'],
                    mineInfo: RenderParam.exchangeRecords.data['list'],
                    dateFiled: 'log_dt',
                    prizeFiled: 'goods_name',
                    prizeIdFiled: 'goods_id'
                };
                break;
            case LMActivity.WinnerListType.Lottery:
                LMActivity.winnerListInfo = {
                    allListInfo: RenderParam.allLotteryList.list,
                    mineInfo: RenderParam.myLotteryInfo.list,
                    dateFiled: 'prize_dt',
                    prizeFiled: 'prize_name',
                    prizeIdFiled: 'prize_idx'
                };
                break;
        }
    },
    showWinnerList: function () {
        var allWinnerInfo = LMActivity.winnerListInfo.allListInfo;
        var mineInfo = LMActivity.winnerListInfo.mineInfo;
        var dateFiled = LMActivity.winnerListInfo.dateFiled;
        var prizeFiled = LMActivity.winnerListInfo.prizeFiled;
        var allWinnerHtml = '<table >';
        var col = 1;
        var exPrizeDate = '';
        for (var index = 0; index < allWinnerInfo.length; index++) {
            allWinnerHtml += '<tr>';
            allWinnerHtml += '<td class="col-1" colspan=' + col + '>' + LMActivity.func.formatWinnerUser(allWinnerInfo[index]['user_account']) + '</td>';
            allWinnerHtml += '<td class="col-2" colspan=' + col + '>' + LMActivity.func.formatWinnerDate(allWinnerInfo[index][dateFiled]) + '</td>';
            allWinnerHtml += '<td class="col-3" colspan=' + col + '>' + allWinnerInfo[index][prizeFiled] + '</td>';
            allWinnerHtml += '</tr>';

            if (LMActivity.winnerListType == LMActivity.WinnerListType.Exchange &&
                RenderParam.userAccount === allWinnerInfo[index]['user_account']) {
                // 兑换奖品类型需要手动获取自己奖品信息的日期
                exPrizeDate = LMActivity.func.formatWinnerDate(allWinnerInfo[index][prizeFiled]);
            }
        }
        allWinnerHtml += '</table>';
        G('all-winner').innerHTML = allWinnerHtml;

        var mineHtml = '';
        mineHtml += '<table id="mine-info">';
        if (mineInfo.length) {
            LMActivity.myPrize = mineInfo[0];
            mineHtml += '<tr>';
            mineHtml += '<td class="col-1" colspan=' + col + '>' + LMActivity.func.formatWinnerUser(RenderParam.userAccount);
            if (LMActivity.winnerListType == LMActivity.WinnerListType.Exchange) {
                mineHtml += '<td class="col-2" colspan=' + col + '>' + exPrizeDate;
            } else {
                mineHtml += '<td class="col-2" colspan=' + col + '>' + LMActivity.myPrize['insert_dt'];
            }
            mineHtml += '<td class="col-3" colspan=' + col + '>' + LMActivity.myPrize[prizeFiled];
            if (LMActivity.myPrize["user_tel"]) {
                G('list-phone-container').innerHTML = LMActivity.myPrize["user_tel"];
            }
            // 获取奖品ID
            var prizeIdFiled = LMActivity.winnerListInfo.prizeIdFiled;
            LMActivity.myPrizeId = LMActivity.myPrize[prizeIdFiled];
        } else {
            mineHtml += '<tr>';
            mineHtml += '<td class="col-1" colspan=' + col + '>';
            mineHtml += '<td class="col-2" colspan=' + col + '>暂无中奖纪录';
            mineHtml += '<td class="col-3" colspan=' + col + '>';
        }
        mineHtml += '</table>';
        G('mine-container').innerHTML = mineHtml;

        LMActivity.showDialog(LMActivity.winnerListConfig);
    },
    exitWinnerList: function () {
        LMActivity.hideDialog(LMActivity.winnerListConfig);
    },
    onPrizePhoneFocus: function (btn, hasFocus) {
        if (hasFocus) {
            JJKye.init({
                top: btn.keyboardTop,
                action: 'tel',
                input: 'list-phone-container', //  输入框ID
                backFocus: 'btn-update-phone', // 返回ID
                resolution: RenderParam.platformType || 'hd' // 盒子分辨率
            });
        }
    },
    // ------  公共页面组件中奖名单 end ------

    // ------  公共页面组件订购VIP start ------
    purchaseConfig: {
        id: "purchase",
        focusId: 'btn-purchase',
        hideFocusId: 'btn-start',
        onDismissListener: function () {
            LMActivity.cancelPurchase();
        }
    },
    initPurchaseVIPButton: function () {
        LMActivity.buttons.push(
            {
                id: 'btn-purchase',
                name: '订购VIP',
                type: 'img',
                nextFocusLeft: 'btn-cancel-purchase',
                nextFocusRight: 'btn-cancel-purchase',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: LMActivity.createImageUrl('btn_sure.png'),
                focusImage: LMActivity.createImageUrl('btn_sure_f.png'),
                click: LMActivity.intent.jumpBuyVip,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'btn-cancel-purchase',
                name: '取消订购VIP',
                type: 'img',
                nextFocusLeft: 'btn-purchase',
                nextFocusRight: 'btn-purchase',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: LMActivity.createImageUrl('btn_cancel.png'),
                focusImage: LMActivity.createImageUrl('btn_cancel_f.png'),
                click: LMActivity.exitPurchase,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }
        )
    },
    cancelPurchase: function () {
        // 判断是否需要显示倒计时
        if (RenderParam.isVip == '0' && RenderParam.valueCountdown.showDialog == '1') {
            // 弹窗倒计时
            LMActivity.countdownConfig.isExit = false;
            LMActivity.showDialog(LMActivity.countdownConfig);

        }
    },
    exitPurchase: function () {
        LMActivity.hideDialog(LMActivity.purchaseConfig);
    },
    // ------  公共页面组件订购VIP end ------

    // ------  公共页面组件游戏结束 start ------
    gameOverConfig: {
        id: "game-over",
        focusId: 'btn-game-over',
        hideFocusId: 'btn-start'
    },
    initGameOverButton: function () {
        LMActivity.buttons.push(
            {
                id: 'btn-game-over',
                name: '游结束',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: LMActivity.createImageUrl('btn_sure.png'),
                focusImage: LMActivity.createImageUrl('btn_sure_f.png'),
                click: LMActivity.exitGameOver,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }
        )
    },
    exitGameOver: function () {
        LMActivity.hideDialog(LMActivity.gameOverConfig);
    },
    // ------  公共页面组件游戏结束 end ------

    // ------  公共页面组件订购弹窗状态 start ------
    purchaseSuccessConfig: {
        id: 'purchase-success',
        focusId: 'purchase-success',
        hideFocusId: 'btn-start'
    },
    purchaseFailConfig: {
        id: 'purchase-fail',
        focusId: 'purchase-fail',
        hideFocusId: 'btn-start'
    },
    showOrderResult: function () {
        if (RenderParam.isOrderBack == "1") {
            if (RenderParam.cOrderResult == "1") {
                LMActivity.showTimeoutDialog(LMActivity.purchaseSuccessConfig);
            } else {
                LMActivity.showTimeoutDialog(LMActivity.purchaseFailConfig);
            }
        }
    },
    // ------  公共页面组件订购弹窗状态 end ------

    // ------  公共页面组件返回倒计时 start ------
    countdownConfig: {
        id: 'countdown',
        focusId: 'countdown',
        onShowListener: function () {
            LMActivity.startCountdown();
        },
        onDismissListener: function () {
            clearInterval(LMActivity.countInterval);
            if (LMActivity.countdownConfig.isExit){
                LMActivity.intent.goBack();
            }
        },
        hideFocusId: 'btn-start'
    },
    startCountdown: function () {
        LMActivity.count = 8;
        G('countdown-count').innerText = String(LMActivity.count);
        LMActivity.countInterval = setInterval(function () {
            G('countdown-count').innerText = String(--LMActivity.count);
            if (LMActivity.count == 0) {
                clearTimeout(LMActivity.countInterval);
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
    // ------  公共页面组件返回倒计时 end ------

    // ------  公共页面组件抽奖成功页面 start ------
    initLotterySuccessButtons: function () {
        LMActivity.buttons.push({
            id: 'lottery-phone-container',
            name: '中奖电话',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'btn-lottery-phone',
            backgroundImage: '',
            focusImage: '',
            click: '',
            focusChange: LMActivity.onLotteryPhoneFocus,
            beforeMoveChange: "",
            moveChange: "",
            keyboardTop: '198px'
        }, {
            id: 'btn-lottery-phone',
            name: '设置获奖电话',
            type: 'img',
            nextFocusLeft: 'btn-exit-lottery-success',
            nextFocusRight: 'btn-exit-lottery-success',
            nextFocusUp: 'lottery-phone-container',
            nextFocusDown: '',
            backgroundImage: LMActivity.createImageUrl('btn_sure.png'),
            focusImage: LMActivity.createImageUrl('btn_sure_f.png'),
            click: LMActivity.setLotteryPhone,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: ""
        }, {
            id: 'btn-exit-lottery-success',
            name: '退出中奖成功页面',
            type: 'img',
            nextFocusLeft: 'btn-lottery-phone',
            nextFocusRight: 'btn-lottery-phone',
            nextFocusUp: 'lottery-phone-container',
            nextFocusDown: '',
            backgroundImage: LMActivity.createImageUrl('btn_cancel.png'),
            focusImage: LMActivity.createImageUrl('btn_cancel_f.png'),
            click: LMActivity.exitLotterySuccess,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: ""
        })
    },
    lotterySuccessConfig: {
        id: 'lottery-success',
        focusId: 'btn-lottery-phone',
        hideFocusId: 'btn-start',
        onShowListener: function () {
            if (LMActivity.imageRegionPath){
                G('lottery-prize').src = LMActivity.createRegionImageUrl('icon_prize_' + LMActivity.prizeId + '.png');
            }else {
                G('lottery-prize').src = LMActivity.createImageUrl('icon_prize_' + LMActivity.prizeId + '.png');
            }
        },
        onDismissListener: function () {
            LMActivity.intent.reload();
        }
    },
    onLotteryPhoneFocus: function (btn, hasFocus) {
        if (hasFocus) {
            JJKye.init({
                top: btn.keyboardTop,
                action: 'tel',
                input: 'lottery-phone-container', //  输入框ID
                backFocus: 'btn-lottery-phone', // 返回ID
                resolution: RenderParam.platformType || 'hd' // 盒子分辨率
            });
        }
    },
    exitLotterySuccess: function () {
        LMActivity.hideDialog(LMActivity.lotterySuccessConfig);
    },
    setLotteryPhone: function () {
        LMActivity.setPrizePhone('lottery-phone-container');
    },
    // ------  公共页面组件抽奖成功页面 end ------

    // ------  公共页面组件抽奖失败页面 start ------
    initLotteryFailButton: function () {
        LMActivity.buttons.push({
            id: 'btn-exit-lottery-fail',
            name: '退出中奖失败页面',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: LMActivity.createImageUrl('btn_sure.png'),
            focusImage: LMActivity.createImageUrl('btn_sure_f.png'),
            click: LMActivity.exitLotteryFail,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: ""
        })
    },
    lotteryFailConfig: {
        id: 'lottery-fail',
        focusId: 'btn-exit-lottery-fail',
        hideFocusId: 'btn-start',
        onDismissListener: function () {
            LMActivity.intent.reload();
        }
    },
    exitLotteryFail: function () {
        LMActivity.hideDialog(LMActivity.lotteryFailConfig);
    },
    // ------  公共页面组件抽奖失败页面 start ------


    showTimeoutDialog: function (dialogConfig) {
        LMActivity.showDialog(dialogConfig);
        LMActivity.timeoutId = setTimeout(function () {
            LMActivity.hideDialog(dialogConfig);
            clearTimeout(LMActivity.timeoutId);
        }, 3000);
    },

    // ------  页面网络请求相关 start ------
    // 奖品兑换
    exchangePrize: function (btn) {
        LMActivity.exchangeConfig.exchangeId = btn.id;
        var order = btn.order;
        // 请求后台接口
        LMActivity.ajaxHelper.exchangePrize(LMActivity.exchangeConfig.exchangePoint[order].prizeId,
            LMActivity.exchangeSuccess, LMActivity.exchangeFail);
    },
    exchangeSuccess: function () {
        LMActivity.showDialog(LMActivity.exSuccessConfig);
    },
    exchangeFail: function (errorCode) {
        if (errorCode == -101) {
            // 显示库存不足页面
            LMActivity.showTimeoutDialog(LMActivity.underStockConfig);
        } else {
            // 显示奖品失效页面
            LMActivity.showTimeoutDialog(LMActivity.loseEfficacyConfig);
        }
    },

    // 中奖名单页修改电话
    updatePrizePhone: function () {
        var userTel = G("list-phone-container").innerHTML;
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
        // 修改获奖电话
        if (LMActivity.winnerListType === LMActivity.WinnerListType.Exchange) {
            LMActivity.ajaxHelper.updatePrizePhone(userTel, LMActivity.myPrizeId, true,
                LMActivity.updatePhoneSuccess, LMActivity.updatePhoneFailed);
        } else {
            LMActivity.ajaxHelper.updatePrizePhone(userTel, LMActivity.myPrizeId, false,
                LMActivity.updatePhoneSuccess, LMActivity.updatePhoneFailed);
        }
    },
    updatePhoneSuccess: function () {
        LMEPG.UI.showToast('电话更改成功', 1, function () {
            LMActivity.intent.reload();
        });
    },
    updatePhoneFailed: function () {
        LMEPG.UI.showToast('电话更改失败', 1);
    },

    setPrizePhone: function (phoneId) {
        var phoneTex = G(phoneId);
        var userTel = phoneTex.innerHTML;
        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast("请输入有效的手机号码");
            return;
        }
        LMActivity.ajaxHelper.updatePrizePhone(userTel,  LMActivity.prizeId, false, LMActivity.setLotteryPhoneSuccess, LMActivity.setLotteryPhoneFail);
    },
    /**
     *  保存抽奖电话号码成功
     */
    setLotteryPhoneSuccess: function () {
        // 弹出提示，保存电话成功
        LMEPG.UI.showToast("保存电话成功", 1, function () {
            // 刷新当前页面
            LMActivity.intent.reload();
        });
    },

    /**
     *  保存抽奖电话号码失败
     */
    setLotteryPhoneFail: function () {
        // 弹出提示，保存电话失败
        LMEPG.UI.showToast("保存电话失败", 1, function () {
            // 刷新当前页面
            LMActivity.intent.reload();
        });
    },
    // ------  页面网络请求相关 end ------

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
        updateScore: function (score, successCallback, errorCallback) {
            var params = {
                postData: {
                    'score': score,
                    'remark': '用户积分'
                },
                path: 'Activity/addUserScore'
            };
            params.successCallback = successCallback;
            params.errorCallback = errorCallback;
            LMActivity.ajaxPost(params);
        },
        uploadPlayRecord: function (successCallback, errorCallback) {
            var params = {
                postData: {'extraTimes': RenderParam.extraTimes},
                path: 'Activity/uploadPlayedRecord'
            };
            params.successCallback = successCallback;
            params.errorCallback = errorCallback;
            LMActivity.ajaxPost(params);
        },
        updatePrizePhone: function (userTel, prizeIndex, isExchange, successCallback, errorCallback) {
            var url = 'Activity/setPhoneNumber';
            if (isExchange) {
                url = 'Activity/setPhoneNumberForExchange'
            }
            var params = {
                postData: {
                    "phoneNumber": userTel,
                    "prizeIdx": prizeIndex
                },
                path: url
            };
            params.successCallback = successCallback;
            params.errorCallback = errorCallback;
            LMActivity.ajaxPost(params);
        },
        lottery: function (successCallback, errorCallback, isShowWaiting) {
            var params = {
                postData: {},
                path: 'Activity/participateActivity'
            };
            params.successCode = 1;
            params.successCallback = successCallback;
            params.errorCallback = errorCallback;
            LMActivity.ajaxPost(params);
        },
        saveData: function (key, value, successCallback, errorCallback) {
            var params = {
                postData: {
                    "key": key,
                    "value": value
                },
                path: 'Common/saveData'
            };
            params.successCallback = successCallback;
            params.errorCallback = errorCallback;
            LMActivity.ajaxPost(params);
        },
        addExtraTimes: function (successCallback, errCallback) {
            var params = {
                postData: {},
                path: 'Activity/addExtraTimes'
            };
            params.successCallback = successCallback;
            params.errorCallback = errCallback;
            LMActivity.ajaxPost(params);
        },
        subExtraTimes: function (successCallback, errCallback) {
            var params = {
                postData: {},
                path: 'Activity/subExtraTimes'
            };
            params.successCallback = successCallback;
            params.errorCallback = errCallback;
            LMActivity.ajaxPost(params);
        },
        exchangePrize: function (id, successCallback, errorCallback) {
            var params = {
                postData: {
                    action: "bgExchange",
                    goodsId: id,
                    score: 0
                },
                path: 'Activity/commonAjax'
            };
            params.successCallback = successCallback;
            params.errorCallback = errorCallback;
            LMActivity.ajaxPost(params);
        }
    },

    ajaxPost: function (params) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ButtonManager.setKeyEventPause(true);
        // 处理抽奖接口成功码的判断
        var successCode = 0;
        if (params.successCode) {
            successCode = params.successCode;
        }
        LMEPG.ajax.postAPI(params.path, params.postData,
            function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : rsp ? JSON.parse(rsp) : rsp;
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.ButtonManager.setKeyEventPause(false);
                    if (data.result == successCode) {
                        params.successCallback(data);
                    } else {
                        params.errorCallback(data.result);
                    }
                } catch (e) {
                    LMEPG.UI.showToast("服务器参数解析异常！", 3);
                    LMEPG.Log.error(params.path + "，解析异常---" + e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("服务器请求失败！", 3);
                LMEPG.Log.error(params.path + "，请求失败---" + e.toString());
            }
        );
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