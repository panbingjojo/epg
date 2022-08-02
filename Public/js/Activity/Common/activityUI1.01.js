(function () {
    // 活动规则
    function RuleDialog(options) {
        this.buttons = [];
        // 默认参数初始化
        var dialogHtml = '';
        dialogHtml += '<img id="default_focus" src="' + options.bgRules + '"/>';
        if (options.btnBack) {
            dialogHtml += '<img id="btn_close_rule" class="common_back_position" src="' + options.btnBack + '"/>';
            this.buttons.push(
                {
                    id: 'btn_close_rule',
                    name: '返回',
                    type: 'img',
                    nextFocusLeft: '',
                    nextFocusRight: '',
                    nextFocusUp: '',
                    nextFocusDown: '',
                    backgroundImage: options.btnBack,
                    focusImage: options.btnBackFocus,
                    click: this.onClickListener,
                    focusChange: "",
                    beforeMoveChange: "",
                    moveChange: "",
                    obj: this
                }
            )
        }
        this.dialogHtml = dialogHtml;

        this.el = 'dialog_wrap';
        this.focusId = 'btn_close_rule';
        this.dismissFocusId = 'btn_rule';

        LMActivity.LMActivityDialog.call(this, options);
    }

    RuleDialog.prototype = new LMActivity.LMActivityDialog();
    RuleDialog.prototype.constructor = RuleDialog;

    RuleDialog.prototype.onClickListener = function (btn) {
        var self = btn.obj;
        self.dismissDialog();
    };

    LMActivity.RuleDialog = RuleDialog;
})();

(function () {
    // 活动规则
    function ExchangeDialog(options) {
        this.buttons = [];
        // 默认参数初始化
        var dialogHtml = '';
        dialogHtml += '<img id="bg_exchange" src="' + options.bgExchange + '"/>';
        dialogHtml += '<img id="btn_exchange_1" src="' + options.btnExchange + '"/>';
        dialogHtml += '<img id="btn_exchange_2" src="' + options.btnExchange + '"/>';
        dialogHtml += '<img id="btn_exchange_3" src="' + options.btnExchange + '"/>';
        dialogHtml += '<img id="btn_exit_exchange" src="' + options.btnBack + '"/>';
        dialogHtml += '<div id="exchange_point_1">' + options.exchangePoint[0].prizeConsume + '</div>';
        dialogHtml += '<div id="exchange_point_2">' + options.exchangePoint[1].prizeConsume + '</div>';
        dialogHtml += '<div id="exchange_point_3">' + options.exchangePoint[2].prizeConsume + '</div>';
        dialogHtml += '<div id="exchange_own_point">' + options.exchangeOwnPoint + '</div>';
        dialogHtml += '<div id="exchange_dialog_wrap"></div>';

        this.dialogHtml = dialogHtml;
        this.el = 'dialog_wrap';
        this.focusId = 'btn_exit_exchange';
        this.dismissFocusId = 'btn_exchange';

        this.buttons.push(
            {
                id: 'btn_exchange_1',
                name: '兑换奖品1',
                type: 'img',
                nextFocusLeft: 'btn_exchange_2',
                nextFocusRight: 'btn_exchange_3',
                nextFocusUp: 'btn_exit_exchange',
                nextFocusDown: '',
                backgroundImage: options.btnExchange,
                focusImage: options.btnExchangeFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                order: 0,
                obj: this
            }, {
                id: 'btn_exchange_2',
                name: '兑换奖品2',
                type: 'img',
                nextFocusLeft: 'btn_exchange_3',
                nextFocusRight: 'btn_exchange_1',
                nextFocusUp: 'btn_exchange_1',
                nextFocusDown: '',
                backgroundImage: options.btnExchange,
                focusImage: options.btnExchangeFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                order: 1,
                obj: this
            }, {
                id: 'btn_exchange_3',
                name: '兑换奖品3',
                type: 'img',
                nextFocusLeft: 'btn_exchange_1',
                nextFocusRight: 'btn_exchange_2',
                nextFocusUp: 'btn_exit_exchange',
                nextFocusDown: '',
                backgroundImage: options.btnExchange,
                focusImage: options.btnExchangeFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                order: 2,
                obj: this
            }, {
                id: 'btn_exit_exchange',
                name: '退出退换',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'btn_exchange_1',
                backgroundImage: options.btnBack,
                focusImage: options.btnBackFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }

        );

        LMActivity.LMActivityDialog.call(this, options);
    }

    ExchangeDialog.prototype = new LMActivity.LMActivityDialog();
    ExchangeDialog.prototype.constructor = ExchangeDialog;

    ExchangeDialog.prototype.onClickListener = function (btn) {
        var self = btn.obj;
        switch (btn.id) {
            case 'btn_exchange_1':
            case 'btn_exchange_2':
            case 'btn_exchange_3':
                self.exchange(btn.order);
                break;
            case 'btn_exit_exchange':
                self.dismissDialog();
                break;
        }
    };

    ExchangeDialog.prototype.exchange = function (order) {
        if (parseInt(this.exchangeOwnPoint) < parseInt(this.exchangePoint[order].prizeConsume)) {
            // 验证分数未通过
            LMEPG.UI.showToast("积分不足！");
        }else if (this.isExchanged){
            // 验证分数未通过
            LMEPG.UI.showToast("您已经兑换过奖品！");
        }else {
            // 请求后台接口
            LMActivity.ajaxHelper.exchangePrize(this.exchangePoint[order].prizeId, this.exchangeSuccess, this.exchangeFail);
        }
    };

    LMActivity.ExchangeDialog = ExchangeDialog;
})();

(function () {
    // 活动规则
    function ExchangeSuccessDialog(options) {
        this.buttons = [];
        // 默认参数初始化
        var dialogHtml = '';
        dialogHtml += '<img src="' + options.bgExchangeSuccess + '"/>';
        dialogHtml += '<div id="exchange_user_phone">请输入有效的手机号码</div>';
        dialogHtml += '<img id="btn_exchange_sure" src="' + options.btnSureFocus + '" />';
        dialogHtml += '<img id="btn_exchange_cancel" src="' + options.btnCancel + '" />';
        this.buttons.push(
            {
                id: 'btn_exchange_sure',
                name: '确定兑换',
                type: 'img',
                nextFocusLeft: 'c',
                nextFocusRight: 'btn_exchange_cancel',
                nextFocusUp: 'exchange_user_phone',
                nextFocusDown: '',
                backgroundImage: options.btnSure,
                focusImage: options.btnSureFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'btn_exchange_cancel',
                name: '取消兑换',
                type: 'img',
                nextFocusLeft: 'btn_exchange_sure',
                nextFocusRight: 'btn_exchange_sure',
                nextFocusUp: 'exchange_user_phone',
                nextFocusDown: '',
                backgroundImage: options.btnCancel,
                focusImage: options.btnCancelFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'exchange_user_phone',
                name: '取消兑换',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'btn_exchange_sure',
                backgroundImage: '',
                focusImage: '',
                click: '',
                focusChange: this.onPhoneNumberFocus,
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }
        );
        this.dialogHtml = dialogHtml;

        this.el = 'exchange_dialog_wrap';
        this.focusId = 'btn_exchange_sure';
        this.dismissFocusId = 'btn_exchange';

        LMActivity.LMActivityDialog.call(this, options);
    }

    ExchangeSuccessDialog.prototype = new LMActivity.LMActivityDialog();
    ExchangeSuccessDialog.prototype.constructor = ExchangeSuccessDialog;

    ExchangeSuccessDialog.prototype.onClickListener = function (btn) {
        var self = btn.obj;
        switch (btn.id) {
            case 'btn_exchange_sure':
                // 提交电话号码到后台
                //获取用户填写的手机号
                var phoneTex = G("exchange_user_phone");
                var userTel = phoneTex.innerHTML;
                if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                    LMEPG.UI.showToast("请输入有效的手机号码");
                    return;
                }
                LMActivity.ajaxHelper.setPrizePhone(userTel, self.prizeId, self.setPhoneSuccess, self.setPhoneFail);
                break;
            case 'btn_exchange_cancel':
                // 取消，直接刷新页面
                self.dismissDialog();
                break;
        }
    };
    ExchangeSuccessDialog.prototype.dismissDialog = function () {
        LMActivity.intent.reload(this.userId,this.inner);
    };

    ExchangeSuccessDialog.prototype.onPhoneNumberFocus = function (btn, hasFocus) {
        var self = btn.obj;
        if (hasFocus) {
            JJKye.init({
                top: self.keyBroadTop,
                action: 'tel',
                input: 'exchange_user_phone', //  输入框ID
                backFocus: 'btn_exchange_sure', // 返回ID
                resolution: self.platformType // 盒子分辨率
            });
        }
    };

    LMActivity.ExchangeSuccessDialog = ExchangeSuccessDialog;
})();

(function () {
    // 活动规则
    function SingleConfirmDialog(options) {
        this.buttons = [];
        // 默认参数初始化
        var dialogHtml = '';
        dialogHtml += '<img src="' + options.bgConfirm + '"/>';
        dialogHtml += '<img id="btn_confirm" src="' + options.btnSureFocus + '"/>';
        this.buttons.push(
            {
                id: 'btn_confirm',
                name: '返回',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: options.btnSure,
                focusImage: options.btnSureFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }
        );

        this.dialogHtml = dialogHtml;

        this.el = 'dialog_wrap';
        this.focusId = 'btn_confirm';
        this.dismissFocusId = 'btn_start';

        LMActivity.LMActivityDialog.call(this, options);
    }

    SingleConfirmDialog.prototype = new LMActivity.LMActivityDialog();
    SingleConfirmDialog.prototype.constructor = SingleConfirmDialog;

    SingleConfirmDialog.prototype.onClickListener = function (btn) {
        var self = btn.obj;
        self.onConfirmClick();
    };

    LMActivity.SingleConfirmDialog = SingleConfirmDialog;
})();

(function () {
    // 活动规则
    function DoubleConfirmDialog(options) {
        this.buttons = [];
        // 默认参数初始化
        var dialogHtml = '';
        dialogHtml += '<img src="' + options.bgConfirm + '"/>';
        dialogHtml += '<img id="btn_sure" src="' + options.btnSureFocus + '"/>';
        dialogHtml += '<img id="btn_confirm_cancel" src="' + options.btnCancel + '"/>';
        this.buttons.push(
            {
                id: 'btn_sure',
                name: '确定',
                type: 'img',
                nextFocusLeft: 'btn_confirm_cancel',
                nextFocusRight: 'btn_confirm_cancel',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: options.btnSure,
                focusImage: options.btnSureFocus,
                click: options.onConfirmClick,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'btn_confirm_cancel',
                name: '取消',
                type: 'img',
                nextFocusLeft: 'btn_sure',
                nextFocusRight: 'btn_sure',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: options.btnCancel,
                focusImage: options.btnCancelFocus,
                click: options.onConfirmCancelClick,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }
        );

        this.dialogHtml = dialogHtml;

        this.el = 'dialog_wrap';
        this.focusId = 'btn_sure';
        this.dismissFocusId = 'btn_start';

        LMActivity.LMActivityDialog.call(this, options);
    }

    DoubleConfirmDialog.prototype = new LMActivity.LMActivityDialog();
    DoubleConfirmDialog.prototype.constructor = DoubleConfirmDialog;

    LMActivity.DoubleConfirmDialog = DoubleConfirmDialog;
})();

(function () {
    // 活动规则
    function WinnerListDialog(options) {
        this.buttons = [];
        // 默认参数初始化
        var dialogHtml = '';
        dialogHtml += '<img src="' + options.bgList + '"/>';
        dialogHtml += '<img id="btn_list_sure"  src="' + options.btnSureFocus + '"/>';
        dialogHtml += '<img id="btn_list_cancel"  src="' + options.btnCancel + '"/>';


        dialogHtml += '<marquee id="all_prizes" behavior="" direction="up">';
        dialogHtml += '<table >';
        var col = 1;
        var mineRecordDate;
        var recordPrizeList = options.prizeHistoryInfo;
        for (var index = 0; index < recordPrizeList.length; index++) {
            dialogHtml += '<tr>';
            dialogHtml += '<td class="col_1" colspan=' + col + '>' + LMActivity.func.formatWinnerUser(recordPrizeList[index]['user_account']) + '</td>';
            dialogHtml += '<td class="col_2" colspan=' + col + '>' + LMActivity.func.formatWinnerDate(recordPrizeList[index]['log_dt']) + '</td>';
            dialogHtml += '<td class="col_3" colspan=' + col + '>' + recordPrizeList[index]['goods_name'] + '</td>';
            dialogHtml += '</tr>';

            if (RenderParam.userAccount === recordPrizeList[index].user_account) {
                mineRecordDate = LMActivity.func.formatWinnerDate(recordPrizeList[index].log_dt);
            }
        }
        dialogHtml += '</table></marquee>';

        var userTel = '请输入有效的手机号码';
        var mineHistoryInfo = options.minePrizeInfo;
        if (mineHistoryInfo.length) {
            // dialogHtml += '<marquee id="my_prizes" behavior="" direction="up"  scrollamount="1">';
            dialogHtml += '<table id="my_prizes">';
            this.prizeInfo = mineHistoryInfo[0];
            dialogHtml += '<tr>';
            dialogHtml += '<td class="col_1" colspan=' + col + '>' + LMActivity.func.formatWinnerUser(options.userAccount);
            dialogHtml += '<td class="col_2" colspan=' + col + '>' + mineRecordDate;
            dialogHtml += '<td class="col_3" colspan=' + col + '>' + this.prizeInfo.goods_name;
            if (this.prizeInfo["user_tel"]) {
                userTel = this.prizeInfo["user_tel"];
            }
            dialogHtml += '</table>';
        } else {
            dialogHtml += '<div class="my-noPrize">暂无中奖记录</div>';
        }
        dialogHtml += '<div id="list_user_phone" >'+ userTel +'</div>';

        this.buttons.push(
            {
                id: 'btn_list_sure',
                name: '确定兑换',
                type: 'img',
                nextFocusLeft: 'list_user_phone',
                nextFocusRight: 'btn_list_cancel',
                nextFocusUp: 'list_user_phone',
                nextFocusDown: '',
                backgroundImage: options.btnSure,
                focusImage: options.btnSureFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'btn_list_cancel',
                name: '取消兑换',
                type: 'img',
                nextFocusLeft: 'btn_list_sure',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: options.btnCancel,
                focusImage: options.btnCancelFocus,
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'list_user_phone',
                name: '取消兑换',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: 'btn_list_sure',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: '',
                focusImage: '',
                click: '',
                focusChange: this.onPhoneNumberFocus,
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }
        );

        this.dialogHtml = dialogHtml;

        this.el = 'dialog_wrap';
        this.focusId = 'btn_list_sure';
        this.dismissFocusId = 'btn_list';

        this.updatePhoneSuccess = function () {

        };

        this.updatePhoneFailed = function () {

        };

        LMActivity.LMActivityDialog.call(this, options);
    }

    WinnerListDialog.prototype = new LMActivity.LMActivityDialog();
    WinnerListDialog.prototype.constructor = WinnerListDialog;

    WinnerListDialog.prototype.onClickListener = function (btn) {
        var self = btn.obj;
        switch (btn.id) {
            case 'btn_list_sure':
                var userTel = G("list_user_phone").innerHTML;
                //判断手机号是否正确
                if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                    LMEPG.UI.showToast("请填写正确的手机号！", 3);
                    return;
                }
                // 判断获奖信息是否在空
                if (!self.prizeInfo) {
                    LMEPG.UI.showToast("您尚未中奖！", 3);
                    return;
                }
                // 提取中奖奖品id
                if (!self.prizeInfo.goods_id) {
                    LMEPG.UI.showToast("中奖编号为空！", 3);
                    return;
                }
                // 修改获奖电话
                LMActivity.ajaxHelper.updatePrizePhone(userTel, self.prizeInfo.goods_id,true, self.updatePhoneSuccess, self.updatePhoneFailed);
                break;
            case 'btn_list_cancel':
                // 关闭弹窗
                self.dismissDialog();
                break;
        }
    };

    WinnerListDialog.prototype.onPhoneNumberFocus = function (btn, hasFocus) {
        var self = btn.obj;
        if (hasFocus) {
            JJKye.init({
                top: self.keyBroadTop,
                action: 'tel',
                input: 'list_user_phone', //  输入框ID
                backFocus: 'btn_list_sure', // 返回ID
                resolution: self.platformType // 盒子分辨率
            });
        }
    };

    LMActivity.WinnerListDialog = WinnerListDialog;
})();

(function () {
    function CountDownDialog(options) {
        this.count = 8;
        this.countTimer = null;
        var dialogHtml = "";
        // 创建背景蒙层
        dialogHtml += '<img  src="' + options.bgCountdown + '"/>';
        dialogHtml += '<div id="count">' + this.count + '</div>';
        dialogHtml += '</div>';
        this.dialogHtml = dialogHtml;

        this.buttons = [];
        this.el = 'dialog_wrap';
        this.focusId = '';
        this.dismissFocusId = 'btn_start';

        LMActivity.LMActivityDialog.call(this, options);
    }

    CountDownDialog.prototype = new LMActivity.LMActivityDialog();
    CountDownDialog.prototype.constructor = CountDownDialog;

    CountDownDialog.prototype.show = function () {
        this.showDialog();
        this.countdown();
    };

    CountDownDialog.prototype.dismissDialog = function () {
        if (this.isExitActivity && this.count > 0) {
            // 清除倒计时，直接退出整个活动
            clearTimeout(this.countTimer);
            LMActivity.intent.goBack();
        } else {
            LMActivity.intent.reload(this.userId, this.inner);
        }
    };

    CountDownDialog.prototype.countdown = function () {
        var self = this;
        this.countTimer = setTimeout(function () {
            G('count').innerText = String(--self.count);
            if (self.count == 0) {
                clearTimeout(self.countTimer);
                // ajax请求保存数据，并且增加额外游戏机会
                var countdownValue = {
                    showDialog: "0"
                };
                LMActivity.ajaxHelper.saveData(RenderParam.keyCountdown, JSON.stringify(countdownValue), function () {
                    // 增加额外机会
                    LMActivity.ajaxHelper.addExtraTimes(function () {
                        // 刷新当前页面
                        LMActivity.intent.reload(this.userId, this.inner);
                    }, function () {
                        LMEPG.UI.showToast("游戏机会增加失败", 3);
                        // 刷新当前页面
                        LMActivity.intent.reload(this.userId, this.inner);
                    });
                })
            } else {
                self.countdown();
            }
        }, 1000);
    };

    LMActivity.CountDownDialog = CountDownDialog;
})();
