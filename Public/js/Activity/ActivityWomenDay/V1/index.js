(function (w, e, r, a) {
    var Activity = {
        starIndex: 0,
        positionHd: [0, 90, 180, 270, 360, 450, 620],
        positionSd: [0, 50, 110, 170, 230, 290, 380],
        positionX: [],
        scoreY: [0, 3, 6, 9, 12, 15, 18],
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
            w.carRun = new animal("switch", {
                id: "animal-bg",
                end: 4,
                speed: 500,
                imgUrl: LMActivity.makeImageUrl('animal_bg_')
            }, "")
            w.cuntDown = new animal("cuntDown", {
                id: "animal-timer",
                end: 15,
                speed: 1000
            }, function (self) {
                cuntDown.clearTimer("switch");
                if (Activity.starIndex > 0) {
                    Activity.doAddScore(Activity.scoreY[Activity.starIndex]);
                } else {
                    LMActivity.showModal({
                        id: 'game_fail',
                        focusId: 'btn_fail',
                    });
                }
            })
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
        },

        initButtons: function () {
            e.BM.init('btn-start', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
        },
        playGame: function () {
            carRun.init();
            Activity.addStart();
        },
        addStart: function () {
            if (RenderParam.platformType == "hd") {
                Activity.positionX = Activity.positionHd;
            } else {
                Activity.positionX = Activity.positionSd;
            }
            if (Activity.starIndex < 6) {
                Activity.starIndex++;
                if (Activity.starIndex > 1) {
                    G("start-" + (Activity.starIndex - 1)).src = a.makeImageUrl('icon_yes.png')
                }
                G("start-" + Activity.starIndex).src = a.makeImageUrl('status_' + Activity.starIndex + '.png');
                G("bar-box").style.width = Activity.positionX[Activity.starIndex] + "px";
                G("bar-man").style.left = Activity.positionX[Activity.starIndex] + "px";
                // alert(G("bar-man").style.left);
            }
        },

        doAddScore: function (score) {
            // 保存积分
            a.AjaxHandler.addScore(score, function () {
                a.showModal({
                    id: 'game_success',
                    focusId: 'btn_game_success',
                    onDismissListener: function () {
                        a.Router.reload(); // 重新加载
                    }
                });
                G("add_score").innerHTML = score;

            }, function () {
                LMEPG.UI.showToast('添加助力值失败', 2);
            });
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_knowledge':
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.showModal({
                        id: 'modal-knowledge',
                        focusId: ''
                    });
                    break;
                case 'btn_game_success':
                case 'btn_fail':
                    a.Router.reload(); // 重新加载
                    break;
                case 'btn-start':
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.playStatus = true;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            LMActivity.showModal({
                                id: 'play_game',
                                focusId: 'btn-play',
                            });
                            cuntDown.clearTimer("cuntDown");
                            cuntDown.init();
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数失败', 2);
                        });

                    } else {
                        a.showGameStatus();
                    }
                    break;
                case 'btn-play':
                    Activity.playGame();
                    break;
            }
        }
    };


    Activity.exchangePrizeButtons = [
        {
            id: 'exchange_prize_1',
            name: '按钮-兑换一等奖',
            type: 'img',
            nextFocusLeft: 'exchange_prize_3',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_unable.png'),
            focusImage: a.makeImageUrl('btn_exchange_unable_f.png'),
            order: 1,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换二等奖',
            type: 'img',
            nextFocusRight: 'exchange_prize_3',
            nextFocusLeft: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_unable.png'),
            focusImage: a.makeImageUrl('btn_exchange_unable_f.png'),
            order: 0,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换三等奖',
            type: 'img',
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_unable.png'),
            focusImage: a.makeImageUrl('btn_exchange_unable_f.png'),
            order: 2,
            click: a.eventHandler
        }
    ];

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_knowledge',
            nextFocusLeft: 'btn-start',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: '',
            nextFocusRight: 'btn-start',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: '',
            nextFocusRight: '',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusRight: 'btn-start',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换奖品',
            type: 'img',
            nextFocusDown: 'btn-start',
            nextFocusUp: 'btn_winner_list',
            nextFocusRight: 'btn-start',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            exchangePrizeButtons: Activity.exchangePrizeButtons,
            exchangeFocusId: '',
            moveType: 1,
            click: a.eventHandler
        }, {
            id: 'btn_knowledge',
            name: '按钮-美景汇',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'btn_back',
            nextFocusRight: '',
            nextFocusLeft: 'btn-start',
            backgroundImage: a.makeImageUrl('jump_knowledge.png'),
            focusImage: a.makeImageUrl('jump_knowledge_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn-start',
            name: '开始游戏按钮',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_knowledge',
            nextFocusLeft: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: r.platformType === 'sd' ? "reset_tel" : "",
            nextFocusLeft: r.platformType === 'hd' ? "reset_tel" : "",
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            nextFocusUp: r.platformType === 'sd' ? "reset_tel" : "",
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusRight: r.platformType === 'hd' ? 'btn_list_submit' : '',
            nextFocusDown: r.platformType === 'hd' ? '' : 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_game_success',
            name: '按钮-游戏成功',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_fail',
            name: '按钮-游戏成功',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_order_submit',
            name: '按钮-订购VIP',
            type: 'img',
            nextFocusRight: 'btn_order_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_tel',
            name: '输入框-兑换成功-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit',
            backFocusId: 'btn_exchange_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusRight: 'btn_exchange_cancel',
            nextFocusUp: 'exchange_tel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit',
            nextFocusUp: 'exchange_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        },
        {
            id: 'btn-play',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusRight: 'btn_game_over_sure',
            nextFocusUp: 'btn_game_over_sure',
            backgroundImage: a.makeImageUrl('btn_play.png'),
            focusImage: a.makeImageUrl('btn_play_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn-play',
            nextFocusDown: 'btn-play',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler
        }
    ];

    w.Activity = Activity;

    function Animals(type, element, callBack) {
        this.element = element;//动画参数数组，第一个为id，第二个为动画累加参数;三个为回调
        this.callBack = callBack;
        this.type = type;
        this.index = 0;
        this.SwitchImgTimer = null;
        this.cuntDowntimer = null;
    }

    Animals.prototype.init = function () {
        var that = this;
        switch (that.type) {
            case "switch":
                this.switchImg();
                break;
            case "cuntDown":
                this.cuntDown();
                break;
            default:
                break;
        }
    };
    Animals.prototype.clearTimer = function (type) {
//            var that = this;
        switch (type) {
            case "switch":
                clearInterval(this.SwitchImgTimer);
                break;
            case "cuntDown":
                clearInterval(this.cuntDowntimer);
                break;
            default:
                break;
        }
    };
    //    图片切换动画
    Animals.prototype.switchImg = function () {
        LMEPG.ButtonManager.setKeyEventPause(true);
        var that = this;
        that.SwitchImgTimer = setInterval(function () {
            that.index++;
            if (that.element instanceof Object) {
                G(that.element.id).src = that.element.imgUrl + that.index + ".png";
            }
            if (that.index == that.element.end) {
                that.index = 0;
                that.clearTimer("switch");
                LMEPG.ButtonManager.setKeyEventPause(false);
            }
        }, that.element.speed);
    };
    //   倒计时
    Animals.prototype.cuntDown = function () {
        var that = this;
        that.index = that.element.end;
        that.cuntDowntimer = setInterval(function () {
            that.index--;
            if (that.element instanceof Object) {
                G(that.element.id).innerHTML = that.index;
            }
            if (that.index == 0) {
                that.index = 0;
                G(that.element.id).innerHTML = that.index
                that.clearTimer("cuntDown");
                LMEPG.call(that.callBack, that);
            }
        }, that.element.speed);
    };

    w.animal = Animals;
})(window, LMEPG, RenderParam, LMActivity);