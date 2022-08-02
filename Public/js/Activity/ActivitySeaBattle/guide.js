(function () {
    // 活动规则
    function RuleDialog() {
        // 创建背景蒙层
        var dialogHtml = '';
        dialogHtml += '<div class="commonDialog"><div class="marker"></div>';
        dialogHtml += '<img id="mb_box" class="dialogContext"  src="' + RenderParam.imgPath + RenderParam.bgIndex + '/bg_rule.png"/>';
        dialogHtml += '</div>';

        var options = {
            el: 'modal',
            focusId: '',
            buttons: [],
            dismissFocusId: 'rules',
            dialogHtml: dialogHtml
        };

        LMActivityDialog.call(this, options);
    }

    RuleDialog.prototype = new LMActivityDialog();
    RuleDialog.prototype.constructor = RuleDialog;

    window.RuleDialog = RuleDialog;
})();

(function () {
    // 中奖名单
    function WinnerListDialog(recordData, myInfo) {
        var _html = ""
        // 创建背景蒙层
        _html += '<div class="commonDialog"><div class="marker"></div>';
        _html += '<img id="mb_box" class="dialogContext" src="' + RenderParam.imgPathPrefix + 'bg_win_list.png" alt="">';
        _html += '<img id="btn-submit" class="abs list-submit sure" src="' + RenderParam.imgPathPrefix + 'btn_sure.png" alt="">';
        _html += '<img id="btn-cancel" class="abs list-cancel cancel" src="' + RenderParam.imgPathPrefix + 'btn_cancel.png" alt="">';
        _html += '<marquee id="win-table" class="abs" behavior="" direction="up">';
        _html += '<table >';
        var col = 1;
        for (var index = 0; index < recordData.length; index++) {
            _html += '<tr>';
            _html += '<td class="col_1"  colspan=' + col + '>' + LMActivity.func.formatWinnerUser(recordData[index]['user_account']) + '</td>';
            _html += '<td class="col_2"  colspan=' + col + '>' + LMActivity.func.formatWinnerDate(recordData[index]['prize_dt']) + '</td>';
            _html += '<td class="col_3"  colspan=' + col + '>' + recordData[index]['prize_name'] + '</td>';
            _html += '</tr>';
        }
        _html += '</table></marquee>';

        var myPrize = '';
        if (myInfo.length) {
            //myPrize += '<marquee  class="abs single-table"  behavior="" direction="up"  scrollamount="1">';
            myPrize += '<table class="abs single-table">';
            var prizeInfo = myInfo[0];
            myPrize += '<tr>';
            myPrize += '<td class="col_1"  colspan=' + col + '>' + LMActivity.func.formatWinnerUser(RenderParam.userAccount);
            myPrize += '<td class="col_2"  colspan=' + col + '>' + LMActivity.func.formatWinnerDate(prizeInfo.insert_dt);
            myPrize += '<td class="col_3"  colspan=' + col + '>' + prizeInfo.prize_name;
            myPrize += '</tr></table>';
        } else {
            myPrize += '<div class="abs my-noPrize">暂无中奖记录</div>';
        }
        _html += myPrize;
        _html += '<div class="tel-wrap tel-list"><img src="' + RenderParam.imgPathPrefix + 'bg_search_text.png"><span id="searchText">' + (RenderParam.userTel || "请输入手机号码");

        var options = {
            el: 'modal',
            focusId: 'btn-submit',
            buttons: [{
                id: 'searchText',
                name: '号码框',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'bg_search_text.png',
                focusImage: RenderParam.imgPathPrefix + 'bg_search_text_f.png',
                click: "",
                focusChange: this.onPhoneNumberFocus,
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'btn-submit',
                name: '中奖名单-确认',
                type: 'img',
                nextFocusLeft: 'searchText',
                nextFocusRight: 'btn-cancel',
                nextFocusUp: 'searchText',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_sure.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_sure_f.png',
                click: this.setPhoneNumber,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'btn-cancel',
                name: '中奖名单-取消',
                type: 'img',
                nextFocusLeft: "btn-submit",
                nextFocusRight: 'btn-submit',
                nextFocusUp: 'searchText',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_cancel.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_cancel_f.png',
                click: this.dismiss,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }],
            dismissFocusId: 'winners',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);
    }

    WinnerListDialog.prototype = new LMActivityDialog();
    WinnerListDialog.prototype.constructor = WinnerListDialog;

    WinnerListDialog.prototype.setPhoneNumber = function () {
        var userTel = G("searchText").innerHTML;
        // 判断是否抽到过奖品
        // 当前页只有一个设置电话号码事件机制（不需要条件A.beClickBtnId == "rankList"）
        if (!+RenderParam.myPrizeList.list.length) {
            LMEPG.UI.showToast("您尚未中奖！", 1);
            return;
        }

        //判断手机号是否正确
        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast("请输入有效电话号码!", 1);
            return;
        }

        LMActivity.ajaxHelper.updatePrizerPhone(userTel, RenderParam.myPrizeList.list[0].prize_idx, function () {
            LMActivity.page.reload();
        })
    };

    WinnerListDialog.prototype.onPhoneNumberFocus = function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.UI.keyboard.show(100, 88, btn.id, 'btn-submit', true);
        }
    };

    WinnerListDialog.prototype.dismiss = function (button) {
        var self = button.obj;
        self.dismissDialog();
    };

    window.WinnerListDialog = WinnerListDialog;
})();

(function () {
    function LotterySuccessDialog(prizeIndex) {
        this.prizeIdx = prizeIndex;
        var goodImg = '/prize' + prizeIndex;
        var _html = "";
        // 创建背景蒙层
        _html += '<div class="commonDialog"><div class="marker"></div>';
        _html += '<img id="mb_box" class="dialogContext" src=' + RenderParam.imgPathPrefix + 'lucky_prize.png>';
        _html += '<div class="prize-intro"><span>获得海洋的馈赠</span></div>';
        _html += '<img id="win-prize" class="abs" src="' + RenderParam.imgPath + RenderParam.bgIndex + goodImg + '.png">';
        _html += '<div class="tel-wrap tel-complete"><img src="' + RenderParam.imgPathPrefix + 'bg_search_text_f.png"><span id="prizePhone">' + (RenderParam.userTel || "请输入您的电话号码") + '</span></div>';
        _html += '<img id="btn-submit" class="abs complete-submit sure" src="' + RenderParam.imgPathPrefix + 'btn_sure.png" >';
        _html += '<img id="btn-cancel" class="abs complete-cancel cancel" style="" src="' + RenderParam.imgPathPrefix + 'btn_cancel.png">';

        var options = {
            el: 'modal',
            focusId: 'btn-submit',
            buttons: [{
                id: 'prizePhone',
                name: '号码框',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: '',
                focusImage: '',
                click: "",
                focusChange: this.onPhoneNumberFocus,
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'btn-submit',
                name: '中奖名单-确认',
                type: 'img',
                nextFocusLeft: 'prizePhone',
                nextFocusRight: 'btn-cancel',
                nextFocusUp: 'prizePhone',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_sure.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_sure_f.png',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'btn-cancel',
                name: '中奖名单-取消',
                type: 'img',
                nextFocusLeft: "btn-submit",
                nextFocusRight: 'btn-submit',
                nextFocusUp: 'searchText',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_cancel.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_cancel_f.png',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }],
            dismissFocusId: 'go-gamePage',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);
    }

    LotterySuccessDialog.prototype = new LMActivityDialog();
    LotterySuccessDialog.prototype.constructor = LotterySuccessDialog;

    LotterySuccessDialog.prototype.onClickListener = function (button) {
        var self = button.obj;
        switch (button.id) {
            case 'btn-submit':
                var userTel = G("prizePhone").innerHTML;
                //判断手机号是否正确
                if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                    LMEPG.UI.showToast("请输入有效电话号码!");
                    return;
                }

                LMActivity.ajaxHelper.updatePrizerPhone(userTel, self.prizeIdx, function () {
                    LMActivity.page.reload();
                });
                break;
            case 'btn-cancel':
                self.dismissDialog();
                break;
        }
    };

    LotterySuccessDialog.prototype.dismissDialog = function () {
        LMActivity.page.reload();
    };

    LotterySuccessDialog.prototype.onPhoneNumberFocus = function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.UI.keyboard.show(100, 88, btn.id, 'btn-submit', true);
        }
    };

    window.LotterySuccessDialog = LotterySuccessDialog;
})();

(function () {
    function LotteryFailDialog() {
        var _html = "";
        // 创建背景蒙层
        _html += '<div class="commonDialog"><div class="marker"></div>';
        _html += '<img id="mb_box" class="dialogContext" src="' + RenderParam.imgPathPrefix + 'lose_prize.png"/>';
        _html += '<img id="btn-one"  src="' + RenderParam.imgPathPrefix + 'btn_sure_f.png">';
        _html += '</div>';

        var options = {
            el: 'modal',
            focusId: 'btn-one',
            buttons: [{
                id: 'btn-one',
                name: '弹框单个按钮-关闭',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: '',
                focusImage: '',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }],
            dismissFocusId: 'go-gamePage',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);
    }

    LotteryFailDialog.prototype = new LMActivityDialog();
    LotteryFailDialog.prototype.constructor = LotteryFailDialog;

    LotteryFailDialog.prototype.dismissDialog = function () {
        LMActivity.page.reload();
    };

    LotteryFailDialog.prototype.onClickListener = function (button) {
        var self = button.obj;
        switch (button.id) {
            case 'btn-one':
                self.dismissDialog();
                break;
        }
    };

    window.LotteryFailDialog = LotteryFailDialog;
})();


(function () {
    function ActionElement(options) {
        this.timeSlot = 100;
        options = options || {};
        this.element = G(options.elementId);
        if (this.element) {
            this.element.style.top = options.originalTop + 'px';
            this.element.style.left = options.originalLeft + 'px';
        }
        this.moveTime = 0;
        this.moveX = options.originalLeft;
        this.moveY = options.originalTop;
        this.moveSpeedX = options.speedX;
        this.moveSpeedY = options.speedY;
        this.moveMinY = options.moveMinY;
        this.moveMaxY = options.moveMaxY;
        this.moveAction = options.moveAction;
        this.action = function () {
            var self = this;
            this.actionTimer = setTimeout(function () {
                self.moveAction();
                self.moveX += self.moveSpeedX;
                self.moveY += self.moveSpeedY;
                self.element.style.top = self.moveY + 'px';
                self.element.style.left = self.moveX + 'px';

                self.moveTime += self.timeSlot;
                if (self.moveTime >= 3000) {
                    activiy.game.gameOver();
                } else {
                    self.action();
                }
            }, self.timeSlot);
        }
    }

    function Game() {

        var _html = '';
        _html += '<img src="' + RenderParam.imgPathPrefix + 'bg_dialog.png" alt="">';
        _html += '<img id="water_drop" class="abs" src="' + RenderParam.imgPathPrefix + 'water_drop.png" alt="">';
        _html += '<img id="germ" class="abs" src="' + RenderParam.imgPathPrefix + 'germ.png" alt="">';
        _html += '<img id="fishing_net" class="abs" src="' + RenderParam.imgPathPrefix + 'fishing_net.png" alt="">';
        _html += '<img id="theme" class="abs" src="' + RenderParam.imgPathPrefix + 'game_theme.png" alt="">';
        var options = {
            el: 'modal',
            focusId: '',
            buttons: [],
            dismissFocusId: 'go-gamePage',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);

        this.showDialog();

        // 渔网
        var fishingNetOptions = {
            "originalLeft": RenderParam.platformType === 'hd' ? 0 : -100,
            "originalTop": RenderParam.platformType === 'hd' ? 0 : -100,
            "elementId": 'fishing_net',
            "speedX": RenderParam.platformType === 'hd' ? 5 : 3,
            "speedY": RenderParam.platformType === 'hd' ? 5 : 3,
            "moveAction": function () {

            }
        };
        this.fishingNet = new ActionElement(fishingNetOptions);

        // 细菌
        var germOptions = {
            "originalLeft": RenderParam.platformType === 'hd' ? 581 : 400,
            "originalTop": RenderParam.platformType === 'hd' ? 483 : 368,
            "elementId": 'germ',
            "speedX": RenderParam.platformType === 'hd' ? 5 : 3,
            "speedY": RenderParam.platformType === 'hd' ? 5 : 3,
            "moveMinY": RenderParam.platformType === 'hd' ? 436 : 338,
            "moveMaxY": RenderParam.platformType === 'hd' ? 483 : 368,
            "moveAction": function () {
                if (this.moveY <= this.moveMinY || this.moveY >= this.moveMaxY) {
                    this.moveSpeedX = -this.moveSpeedX;
                    this.moveSpeedY = -this.moveSpeedY;
                }
            }
        };
        this.germ = new ActionElement(germOptions);

        // 水滴
        var waterOptions = {
            "originalLeft": RenderParam.platformType === 'hd' ? 209 : 65,
            "originalTop": RenderParam.platformType === 'hd' ? 333 : 184,
            "elementId": 'water_drop',
            "speedX": RenderParam.platformType === 'hd' ? 5 : 3,
            "speedY": RenderParam.platformType === 'hd' ? 5 : 3,
            "moveMinY": RenderParam.platformType === 'hd' ? 318 : 164,
            "moveMaxY": RenderParam.platformType === 'hd' ? 353 : 204,
            "moveAction": function () {
                if (this.moveY <= this.moveMinY || this.moveY >= this.moveMaxY) {
                    this.moveSpeedY = -this.moveSpeedY;
                }
            }
        };
        this.waterDrop = new ActionElement(waterOptions);
    }

    Game.prototype = new LMActivityDialog();
    Game.prototype.constructor = Game;

    Game.prototype.gameStart = function () {
        // 正常扣除游戏次数
        LMEPG.ButtonManager.setKeyEventPause(true);
        this.fishingNet.action();
        this.germ.action();
        this.waterDrop.action();
    };

    Game.prototype.gameOver = function () {
        LMEPG.ButtonManager.setKeyEventPause(false);
        clearTimeout(this.fishingNet.actionTimer);
        clearTimeout(this.germ.actionTimer);
        clearTimeout(this.waterDrop.actionTimer);

        LMActivity.ajaxHelper.lottery(RenderParam.extraTimes,function (resultStatus, prizeId) {
            switch (resultStatus) {
                //没有抽中奖品
                case 0:
                    activiy.currentDialog = new LotteryFailDialog();
                    activiy.currentDialog.showDialog();
                    break;
                //抽中奖品
                case 1:
                    activiy.currentDialog = new LotterySuccessDialog(prizeId);
                    activiy.currentDialog.showDialog();
                    break;
                //其它
                default:
                    LMEPG.UI.showToast('抽奖结果出错[' + resultStatus + ']', 1);
                    LMActivity.page.reload();
                    break;
            }
        })
    };

    window.Game = Game;
})();

(function () {
    function PurchaseVIPDialog() {
        var _html = "";
        // 创建蒙层
        _html += '<div class="commonDialog"><div class="marker"></div>'
        _html += '<img id="mb_box" class="dialogContext" src="' + RenderParam.imgPathPrefix + 'pay_vip.png"/>';
        _html += '<img id="btn-sure-pay" class="abs sure" src="' + RenderParam.imgPathPrefix + 'btn_sure.png"/>';
        _html += '<img id="btn-cancel"  class="abs btn-cancel-pay" src="' + RenderParam.imgPathPrefix + 'btn_cancel.png"/>';
        _html += '</div>';

        var options = {
            el: 'modal',
            focusId: 'btn-sure-pay',
            buttons: [{
                id: 'btn-cancel',
                name: '中奖名单-取消',
                type: 'img',
                nextFocusLeft: "btn-sure-pay",
                nextFocusRight: 'btn-sure-pay',
                nextFocusUp: 'searchText',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_cancel.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_cancel_f.png',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'btn-sure-pay',
                name: '次数玩-订购',
                type: 'img',
                nextFocusLeft: 'btn-cancel',
                nextFocusRight: 'btn-cancel',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_sure.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_sure_f.png',
                click: this.onClickListener,//  支付接口
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }],
            dismissFocusId: 'go-gamePage',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);
    }

    PurchaseVIPDialog.prototype = new LMActivityDialog();
    PurchaseVIPDialog.prototype.constructor = PurchaseVIPDialog;

    PurchaseVIPDialog.prototype.onClickListener = function (button) {
        var self = button.obj;
        switch (button.id) {
            case 'btn-sure-pay':
                // 跳转订购VIP
                LMActivity.page.jumpBuyVip();
                break;
            case 'btn-cancel':
                self.dismissDialog();
                if (RenderParam.valueCountdown.showDialog == "1") {
                    // 倒计时弹窗
                    activiy.currentDialog = new CountDownDialog(false);
                    activiy.currentDialog.show();
                }
                break;
        }
    };

    window.PurchaseVIPDialog = PurchaseVIPDialog;
})();

(function () {
    function GameOverDialog() {
        var _html = "";
        // 创建背景蒙层
        _html += '<div class="commonDialog"><div class="marker"></div>';
        _html += '<img id="mb_box" class="dialogContext" src="' + RenderParam.imgPathPrefix + 'no_times.png"/>';
        _html += '<img id="btn-one"  src="' + RenderParam.imgPathPrefix + 'btn_sure_f.png">';
        _html += '</div>';

        var options = {
            el: 'modal',
            focusId: 'btn-one',
            buttons: [{
                id: 'btn-one',
                name: '弹框单个按钮-关闭',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_sure.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_sure_f.png',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }],
            dismissFocusId: 'go-gamePage',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);
    }

    GameOverDialog.prototype = new LMActivityDialog();
    GameOverDialog.prototype.constructor = GameOverDialog;

    GameOverDialog.prototype.onClickListener = function (button) {
        var self = button.obj;
        switch (button.id) {
            case 'btn-one':
                self.dismissDialog();
                break;
        }
    }

    window.GameOverDialog = GameOverDialog;
})();

(function () {
    function PurchaseStatusDialog(isSuccess) {
        var statusImg = '';
        if (isSuccess) {
            statusImg = 'pay_success.png';
        } else {
            statusImg = 'pay_failed.png';
        }
        var _html = "";
        // 创建背景蒙层
        _html += '<div class="commonDialog"><div class="marker"></div>';
        _html += '<img id="mb_box" class="dialogContext" src="' + RenderParam.imgPathPrefix + statusImg + '"/>';
        _html += '</div>';

        var options = {
            el: 'modal',
            focusId: '',
            buttons: [],
            dismissFocusId: 'go-gamePage',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);
    }

    PurchaseStatusDialog.prototype = new LMActivityDialog();
    PurchaseStatusDialog.prototype.constructor = PurchaseStatusDialog;

    window.PurchaseStatusDialog = PurchaseStatusDialog;
})();

(function () {
    function CountDownDialog(isExitActivity) {
        this.isExitActivity = isExitActivity;
        this.count = 8;
        this.countTimer = null;
        var _html = "";
        // 创建背景蒙层
        _html += '<div class="commonDialog"><div class="marker"></div>';
        _html += '<img id="mb_box" class="dialogContext" src="' + RenderParam.imgPathPrefix + 'dialog_countdown.png"/>';
        _html += '<div id="count">' + this.count + 'S</div>';
        _html += '</div>';

        var options = {
            el: 'modal',
            focusId: '',
            buttons: [],
            dismissFocusId: 'go-gamePage',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);
    }

    CountDownDialog.prototype = new LMActivityDialog();
    CountDownDialog.prototype.constructor = CountDownDialog;

    CountDownDialog.prototype.show = function () {
        this.showDialog();
        this.countdown();
    };

    CountDownDialog.prototype.dismissDialog = function () {
        // 清除倒计时，直接退出整个活动
        clearTimeout(this.countTimer);
        if (this.isExitActivity && this.count > 0) {
            LMActivity.page.goBack();
        } else {
            G(this.el).innerHTML = '';
            LMEPG.ButtonManager.requestFocus(this.dismissFocusId);
        }
    };

    CountDownDialog.prototype.countdown = function () {
        var self = this;
        this.countTimer = setTimeout(function () {
            G('count').innerText = ( --self.count) + 'S';
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
                        LMActivity.page.reload();
                    },function () {
                        LMEPG.UI.showToast("游戏机会增加失败", 3);
                        // 刷新当前页面
                        LMActivity.page.reload();
                    });
                })
            } else {
                self.countdown();
            }
        }, 1000);
    };

    window.CountDownDialog = CountDownDialog;
})();

(function () {
    function Activity() {
        this.buttons = [];
        this.currentDialog = null;

        this.winnerListDialog = new WinnerListDialog(RenderParam.AllUserPrizeLis.list, RenderParam.myPrizeList.list);
        this.purchaseVipDialog = new PurchaseVIPDialog();
        this.gameOverDialog = new GameOverDialog();
        this.paySuccessDialog = new PurchaseStatusDialog(true);
        this.payFailDialog = new PurchaseStatusDialog(false);
        this.game = null;
        // switch (RenderParam.lmcid) {
        //     case "640092":
        //         RenderParam.bgIndex = "V2";
        //         break;
        //     default:
        //         RenderParam.bgIndex = "V1";
        //         break;
        // }
        RenderParam.bgIndex = "V" + lmcid;

        for (var index = 1; index <= 3; index ++){
            var prizeImgIndex = 'image_prize_' + index;
            G(prizeImgIndex).src = RenderParam.imgPath + RenderParam.bgIndex + '/prize' + index + '.png';
        }

        if (RenderParam.answeredTimes > 0 && RenderParam.answeredTimes % 3 === 0) {
            // 当参与活动的次数每等于3次，超级细菌可以点击
            this.showSuperGerm = true;
            S('lottery-dialog');
            this.buttons.push(
                {
                    id: 'goLottery',
                    name: '抽奖',
                    type: 'img',
                    nextFocusLeft: 'go-gamePage',
                    nextFocusRight: 'winners',
                    nextFocusUp: 'winners',
                    nextFocusDown: '',
                    backgroundImage: RenderParam.imgPathPrefix + 'btn_germ.gif',
                    focusImage: RenderParam.imgPathPrefix + 'btn_germ_f.gif',
                    click: this.onClickListener,
                    focusChange: '',
                    beforeMoveChange: "",
                    moveChange: "",
                    obj: this
                }
            )
        } else {
            this.showSuperGerm = false;
            H('lottery-dialog');
        }

        // 显示背景图片
        G('bg').src = RenderParam.imgPathPrefix + '/bg_home.png';
        // 显示剩余次数
        G('go-gamePage-count').innerText = "剩余次数：" + RenderParam.leftTimes;

        this.buttons.push(
            {
                id: 'go-gamePage',
                name: '抽奖',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: this.showSuperGerm ? 'goLottery' : 'winners',
                nextFocusUp: this.showSuperGerm ? 'goLottery' : "winners",
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_go.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_go_f.png',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'back',
                name: '返回',
                type: 'img',
                nextFocusLeft: 'go-gamePage',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'rules',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_back.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_back_f.png',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'rules',
                name: '活动详情',
                type: 'img',
                nextFocusLeft: 'go-gamePage',
                nextFocusRight: '',
                nextFocusUp: 'back',
                nextFocusDown: 'winners',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_rule.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_rule_f.png',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }, {
                id: 'winners',
                name: '中奖名单',
                type: 'img',
                nextFocusLeft: this.showSuperGerm ? 'goLottery' : 'go-gamePage',
                nextFocusRight: '',
                nextFocusUp: 'rules',
                nextFocusDown: this.showSuperGerm ? 'goLottery' : "go-gamePage",
                backgroundImage: RenderParam.imgPathPrefix + 'btn_prize.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_prize_f.png',
                click: this.onClickListener,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }
        );

        this.initButtons();
    }

    /**
     * 初始化当前页面按钮
     */
    Activity.prototype.initButtons = function () {
        var focusIdName = this.showSuperGerm ? 'goLottery' : 'go-gamePage';
        LMEPG.ButtonManager.init(focusIdName, this.buttons, '', true);
    };

    Activity.prototype.onClickListener = function (button) {
        var self = button.obj;
        switch (button.id) {
            case 'back':
                self.goBack();
                break;
            case 'rules':
                self.currentDialog = new RuleDialog();
                self.currentDialog.showDialog();
                break;
            case 'winners':
                self.currentDialog = self.winnerListDialog;
                self.currentDialog.showDialog();
                break;
            case 'go-gamePage':
                // 检测当前活动次数
                if (RenderParam.leftTimes) {
                    self.currentDialog = self.game = new Game();
                    self.game.gameStart();
                } else {
                    // 用户抽奖次数用完
                    if (!+RenderParam.isVip) {
                        // 查询是否获得额外游戏机会，有的话，直接进入游戏

                        //不是vip，弹出订购弹窗
                        self.currentDialog = self.purchaseVipDialog;
                        self.currentDialog.showDialog();
                    } else {
                        //是vip，提示用户今天次数用尽，明天再来
                        self.currentDialog = self.gameOverDialog;
                        self.currentDialog.showDialog();
                    }
                }
                break;
            case 'goLottery':
                self.currentDialog = self.game = new Game();
                self.game.gameStart();
                break;
        }
    };

    Activity.prototype.back = function () {
        var isShowKeyPad = Boolean(G('key-table'));
        var isShowDialog = Boolean(activiy.currentDialog);
        if (isShowKeyPad) {
            // 关闭软键盘
            G('key-table').parentNode.removeChild(keyPad);
            LMEPG.ButtonManager.requestFocus("btn-submit");
        } else if (isShowDialog) {
            // 关闭对话框
            activiy.currentDialog.dismissDialog();
            activiy.currentDialog = null;
        } else {
            // 首页返回
            activiy.goBack();
        }
    };

    Activity.prototype.goBack = function () {
        if (!+RenderParam.isVip) {
            // 判断是否需要弹窗
            if (RenderParam.valueCountdown.showDialog == "1") {
                this.currentDialog = new CountDownDialog(true);
                this.currentDialog.show();
            } else {
                LMActivity.page.goBack();
            }
        } else {
            LMActivity.page.goBack();
        }
    };

    Activity.prototype.showOrderResult = function () {
        if (RenderParam.isOrderBack == "1") {
            if (RenderParam.cOrderResult == "1") {
                this.currentDialog = this.paySuccessDialog;
            } else {
                this.currentDialog = this.payFailDialog;
            }
            this.currentDialog.showDialog();
            setTimeout(function () {
                G('modal').innerHTML = '';
                LMEPG.ButtonManager.requestFocus(this.dismissFocusId);
            },3000)
        }
    };

    window.Activity = Activity;
})();

(function () {
    var activity = new Activity();

    // 解决返回按键的this指向
    window.activiy = activity;
    window.onBack = activity.back;
    activity.showOrderResult();
    lmInitGo();
})();

