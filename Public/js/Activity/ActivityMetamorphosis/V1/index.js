(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score: 0,
        grade: 1,
        playerInfo: [
            {"name": "fly", "vote": 0},
        ],
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            Activity.getVote();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            G('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';

        },

        doVote: function (btn) {
            if (Activity.grade > 4) {
                Activity.grade = 0;
            }
            LMActivity.AjaxHandler.saveData("grade", parseInt(Activity.grade) + 1,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        if (data.result == 0) {
                            LMEPG.UI.showToast("花露+1!");
                            Activity.checkGameResult(1)
                        } else {
                            LMEPG.UI.showToast("花露添加失败！");
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
                            Activity.showStatus();
                        } else {
                            Activity.grade = 1;
                        }
                        if (parseInt(Activity.grade) > 5) {
                            Activity.grade = 5;
                        }
                        Activity.showStatus(1);
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
                a.Router.reload(); // 重新加载
            }, function () {
                LMEPG.UI.showToast('添加积分失败', 2);
            });
        },
        showStatus: function () {
            G("role").src = parseInt(Activity.grade) > 3 ? a.makeImageUrl('role_' + Activity.grade + '.gif') : a.makeImageUrl('role_' + Activity.grade + '.png');
        },

        initButtons: function () {
            e.BM.init('btn_start_1', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start_1':
                    a.triggerModalButton = btn.id;
                    LMActivity.playStatus = true;
                    // LMEPG.BM.setKeyEventPause(true);
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            Activity.doVote(btn);
                            // if (LMActivity.playStatus = 'false') {
                            //
                            // }
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        a.showGameStatus('btn_game_over_sure');
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
            }
        },


    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_start_1',
            nextFocusDown: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusRight: 'btn_start_1',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则-返回',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusRight: 'btn_start_1',
            nextFocusDown: 'btn_start_1',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_start_1',
            nextFocusLeft: 'btn_start_1',
            backgroundImage: a.makeImageUrl('btn_change_gift.png'),
            focusImage: a.makeImageUrl('btn_change_gift_f.png'),
            // listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start_1',
            name: '按钮-ready',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_winner_list',
            nextFocusRight: 'btn_exchange_prize',
            nextFocusDown: '',
            backgroundImage: a.makeImageUrl('start.png'),
            focusImage: a.makeImageUrl('start_f.png'),
            click: Activity.eventHandler,
            playerId: 1,
            exScore: 1,
        }, {
            id: 'btn_tips',
            name: '按钮-小贴士',
            type: 'img',
            nextFocusDown: 'btn_start_1',
            nextFocusUp: 'btn_back',
            nextFocusLeft: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_tips.png'),
            focusImage: a.makeImageUrl('btn_tips_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusLeft: r.platformType == "hd" ? 'reset_tel' : '',
            nextFocusRight: 'btn_list_cancel',
            nextFocusUp: r.platformType == "sd" ? "reset_tel" : "",
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            nextFocusUp: r.platformType == "sd" ? "reset_tel" : "",
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
            id: 'btn_cannon',
            name: '图片-针管',
            type: 'img',
            beforeMoveChange: Activity.cannonMove,
            click: Activity.eventHandler
        }, {
            id: 'btn_game_sure',
            name: '按钮-游戏成功确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
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
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp: 'exchange_tel',
            nextFocusLeft: '',
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
            id: 'btn_game_over_sure',
            name: '按钮-结束游戏',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
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
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);
