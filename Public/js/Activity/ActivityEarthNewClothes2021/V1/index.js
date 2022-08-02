(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score: 0,
        playerInfo: [
            {"name": 222, "vote": 0, "img": "earth_six_bg.png"},
        ],
        grade: 1,
        init: function () {

            Activity.initGameData();
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            G('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
        },


        initGameData: function () {
            // LMEPG.UI.showWaitingDialog();
            Activity.getVote();

        },
        showExchangeClear: function (exchange_bg_id) {
            var regionalImagePath = r.imagePath + '/earth_exchange_bg';
            if (exchange_bg_id <= 6) {
                G('vote-img-1').src = regionalImagePath + exchange_bg_id + '.gif';
            } else {
                G('vote-img-1').src = regionalImagePath + 7 + '.gif';
            }

        },
        showClear: function (exchange_bg_id) {
            var regionalImagePath = r.imagePath + '/earth_six_bg';
            if (exchange_bg_id <= 6) {
                G('vote-img-1').src = regionalImagePath + exchange_bg_id + '.png';
            } else {
                G('vote-img-1').src = regionalImagePath + 7 + '.png';
            }

        },


        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    console.log(r.lmcid)
                    a.triggerModalButton = btn.id;
                    LMActivity.playStatus = true;
                    // LMEPG.BM.setKeyEventPause(true);
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            Activity.grade++;
                            Activity.doVote(btn);
                            Activity.showExchangeClear(Activity.grade)
                            // if (LMActivity.playStatus = 'false') {
                            //
                            // }
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        if (r.isVip === "0") {
                            if (r.lmcid == '12650092') {
                                LMActivity.Router.jumpBuyVip();
                            } else {
                                a.showGameStatus('btn_game_over_sure');

                            }
                        } else {
                            if (r.lmcid == '12650092') {
                                LMActivity.showModal({
                                    id: 'game_over',
                                    focusId: 'btn_game_over_sure'
                                });
                            } else {
                                a.showGameStatus('btn_game_over_sure');

                            }
                        }

                    }
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_game_sure':
                case 'btn_close_tips':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
                case 'exchange_close_prize':
                    // 关闭当前对话框
                    LMActivity.hideModal(LMActivity.shownModal);
                    break;
            }
        },

        startGame: function () {
            // LMActivity.playStatus = true;
        },
        doVote: function (btn) {
            LMActivity.AjaxHandler.saveData("grade", Activity.grade,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.grade;

                        if (result != 0) {
                            LMEPG.UI.showToast("清理成功!");
                            Activity.checkGameResult(btn.playerId + 1)
                        } else {
                            LMEPG.UI.showToast("清理失败！");
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("清理异常，解析异常！");
                        LMEPG.Log.error(e.toString());
                        LMEPG.UI.logPanel.show("投票异常，解析异常！ " + e);
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("服务器异常");
                })
        },
        getVote: function () {
            var reqJsonObj2 = {
                "key": "grade",
            };
            LMEPG.ajax.postAPI("Common/queryData", reqJsonObj2,
                function (rsp) {
                    console.log(rsp)
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (data.result == 0) {
                            Activity.grade = data.val;
                        } else {
                            Activity.grade = 1;
                        }
                        console.log(data.grade)
                        Activity.showClear(Activity.grade);
                    } catch (e) {
                        LMEPG.UI.showToast("获取数据异常，解析异常！");
                        LMEPG.Log.error(e.toString());
                        LMEPG.UI.logPanel.show("获取数据异常，解析异常！ " + e);
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("服务器异常");
                }
            );
        },
        checkGameResult: function (score) {
            a.AjaxHandler.addScore(parseInt(score), function () {
                $('add_count').innerHTML = String(score);
                a.showModal({
                    id: 'game_success',
                    focusId: 'btn_game_sure',
                    onDismissListener: function () {
                        a.Router.reload(); // 重新加载
                    }
                });
            }, function () {
                LMEPG.UI.showToast('添加积分失败', 2);
            });
        },

    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusRight: 'btn_start',
            nextFocusDown: 'btn_activity_rule',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusRight: 'btn_start',
            nextFocusLeft: 'btn_start',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close',
            name: '按钮-游戏返回',
            type: 'img',
            nextFocusDown: 'card_selected',
            nextFocusLeft: 'card_selected',
            nextFocusRight: 'card_selected',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.gif'),
            beforeMoveChange: Activity.btnCloseMove,
            click: Activity.eventHandler
        }
        , {
            id: 'btn_close_rule',
            name: '按钮-游戏返回',
            type: 'img',
            nextFocusDown: 'card_selected',
            nextFocusLeft: 'card_selected',
            nextFocusRight: 'card_selected',
            backgroundImage: a.makeImageUrl('rhombus_back_bg.png'),
            focusImage: a.makeImageUrl('rhombus_back_bg_f.png'),
            click: a.eventHandler
        }
        , {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusLeft: 'btn_start',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusRight: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_start',
            nextFocusRight: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        },
        {
            id: 'btn_start',
            name: '按钮-ready',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_exchange_prize',
            nextFocusRight: 'btn_exchange_prize',
            nextFocusDown: '',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            click: Activity.eventHandler,
            playerId: 0,
            exScore: 1,
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusLeft: 'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            nextFocusUp: 'reset_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusDown: 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_game_sure',
            name: '按钮-游戏成功确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-结束游戏',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_submit_1',
            name: '按钮-游戏成功确定',
            type: 'img',
            nextFocusRight: 'btn_lottery_cancel_1',
            backgroundImage: a.makeImageUrl('btn_lottery_submit_1.png'),
            focusImage: a.makeImageUrl('btn_lottery_submit_1_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_cancel_1',
            name: '按钮-游戏成功取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit_1',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail_1',
            name: '按钮-第一轮未中奖确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-第二轮未中奖确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_submit',
            name: '按钮-第二轮中奖-确定',
            type: 'img',
            nextFocusUp: 'lottery_tel',
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp: 'lottery_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'lottery_tel',
            name: '输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_lottery_submit',
            backFocusId: 'btn_lottery_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp: '',
            nextFocusLeft: 'exchange_tel',
            nextFocusRight: 'btn_exchange_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusUp: 'exchange_tel',
            nextFocusLeft: 'btn_exchange_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_tel',
            name: '输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit',
            backFocusId: 'btn_exchange_submit',
            focusChange: a.onInputFocus
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
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusUp: 'exchange_close_prize',
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusLeft: 'exchange_prize_3',
            nextFocusRight: 'exchange_prize_1',
            nextFocusUp: 'exchange_close_prize',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_2',
            nextFocusUp: 'exchange_close_prize',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        },
        {
            id: 'exchange_close_prize',
            name: '按钮-游戏返回',
            type: 'img',
            nextFocusDown: 'exchange_prize_1',
            nextFocusLeft: 'card_selected',
            nextFocusRight: 'card_selected',
            backgroundImage: a.makeImageUrl('rhombus_back_bg.png'),
            focusImage: a.makeImageUrl('rhombus_back_bg_f.png'),
            click: Activity.eventHandler
        },
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);

// 活动特殊返回处理
var specialBackArea = ['220095'];
function outBack() {
    if (RenderParam.lmcid == '220095') {
        var objSrc = LMActivity.Router.getCurrentPage();
        var objHome = LMEPG.Intent.createIntent('home');
        LMEPG.Intent.jump(objHome, objSrc);
    }
}