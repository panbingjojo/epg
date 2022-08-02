(function (w, e, r, a) {
    var Activity = {
        pressTime: true,
        playStatus: false,
        stepCount:0,
        score:0,
        kiteMove1:[],
        kiteMove2:[],
        init: function () {
            if(RenderParam.platformType == 'sd'){
                G('body').innerHTML='';
                LMEPG.UI.showToast('活动暂不支持标清模式！', 2);
                var val =setTimeout(function () {
                    LMActivity.exitActivity();
                },2000);
            };
            // 中国联通活动不再弹窗倒计时
            RenderParam.lmcid == '000051' ? RenderParam.valueCountdown.showDialog = 0 :'';

            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
        },
        initGameData:function () {
            // 游戏页 风筝初始位置top:600,left:0; 结束位置 top:0,left:400;
            var kiteTop = 600;
            var kiteLeft = 0;

            for (i = 0; i < 10; i++) {
                Activity.kiteMove1[i] = {"top": kiteTop - 60 * (i + 1), "left": kiteLeft + 40 * (i + 1)};
            }
            for (j = 10; j < 30; j++) {
                Activity.kiteMove2[j] = {"top": kiteTop - 30 * (j-10 + 1), "left": kiteLeft + 20 * (j-10 + 1)};
            }
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_tips':
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.showModal({
                        id: 'tips',
                        focusId: 'btn_close_tips'
                    });
                    break;
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                            LMActivity.showModal({
                                id: 'game_container',
                                focusId: 'btn_fly_more'
                            });
                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_fly_more':
                    a.triggerModalButton = btn.id;
                    a.AjaxHandler.uploadPlayRecord(function () {
                        if (LMActivity.playStatus = 'false') {
                            LMEPG.BM.requestFocus('kite_1');
                            //初始化风筝飞行数据，
                            Activity.initGameData();
                            Activity.startGame();
                        }
                    }, function () {
                        LMEPG.UI.showToast('扣除游戏次数出错', 3);
                    });
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

        startGame: function () {
            LMActivity.playStatus = true;

            // 启动定时器
            var gameCountdown = $('game_countdown');
            var gameCountdown2 = $('game_countdown_2');
            Activity.gameCount = 10;
            gameCountdown.innerHTML = '倒计时：'+String(Activity.gameCount)+'S';;
            gameCountdown2.innerHTML = '倒计时：'+String(Activity.gameCount)+'S';;
            Activity.gameRunning = true;
            Activity.gameInterval = setInterval(function () {
                if (Activity.gameRunning) {
                    Activity.gameCount = Activity.gameCount - 1;

                    gameCountdown.innerHTML = '倒计时：'+String(Activity.gameCount)+'S';
                    gameCountdown2.innerHTML = '倒计时：'+String(Activity.gameCount)+'S';
                    // 倒计时为0 或者游戏界面关闭 弹窗游戏结果
                    if (Activity.gameCount == 0) {
                        Activity.gameCount = 0;
                        Activity.gameRunning = false;
                        Activity.checkGameResult();
                    }
                }
            }, 1000);
        },

        checkGameResult: function () {
            if (Activity.stepCount > 0) {
                if(Activity.stepCount>=30){
                    Activity.score=Activity.stepCount+3;
                }else if(Activity.stepCount>=20){
                    Activity.score=Activity.stepCount+2;
                }else if(Activity.stepCount>=10){
                    Activity.score=Activity.stepCount+1;
                }else {
                    Activity.score=Activity.stepCount;
                }
                $('step_count').innerHTML = String(Activity.score);
                a.AjaxHandler.addScore(parseInt(Activity.score), function () {
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
            } else {
                a.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail_sure',
                    onDismissListener: function () {
                        a.Router.reload();
                    }
                })
            }
        },

        openPress: function () {
            Activity.pressTime = true;
        },

        kiteMove: function (direction, button) {
            console.log(button.id);
            var kiteMove = [];
            if (button.id == 'kite_1') {
                kiteMove = Activity.kiteMove1;
            } else if (button.id == 'kite_2') {
                kiteMove = Activity.kiteMove2;
            }
            var kiteFly = $(button.id);
            // 设置按键间隔
            switch (direction) {
                case 'up':
                    if (Activity.pressTime) {
                        Activity.stepCount++;
                        Activity.pressTime = false;
                        setTimeout("Activity.openPress()", 333.34);
                    }
                    console.log(Activity.stepCount);
                    // 第10步换背景
                    if ((Activity.stepCount+1) % 10 == 0 && Activity.stepCount != 19) {
                        a.showModal({
                            id: 'game_container_2',
                            focusId: 'kite_2'
                        })
                    }
                    // 最多30步结束
                    if (Activity.stepCount >= 30) {
                        Activity.stepCount =30;
                        return;
                    }

                    kiteFly.style.top = kiteMove[Activity.stepCount].top + 'px';
                    kiteFly.style.left = kiteMove[Activity.stepCount].left + 'px';
                    break;
            }
        }
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: 'btn_back',
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
            id: 'btn_close_tips',
            name: '按钮-活动小贴士-返回',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusLeft: '',
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
            backgroundImage: a.makeImageUrl('btn_change_gift.png'),
            focusImage: a.makeImageUrl('btn_change_gift_f.png'),
            // listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-开始跨年',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_exchange_prize',
            nextFocusLeft: 'btn_tips',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            // listType: 'exchange',
            click: Activity.eventHandler
        },  {
            id: 'btn_tips',
            name: '按钮-小贴士',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusRight: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_tips.png'),
            focusImage: a.makeImageUrl('btn_tips_f.png'),
            click: Activity.eventHandler
        },{
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            listType: 'exchange',
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
        },{
            id: 'btn_fly_more',
            name: '图片-飞更高',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_fly_more.png'),
            focusImage: a.makeImageUrl('btn_fly_more_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'kite_1',
            name: '图片-风筝1',
            type: 'img',
            beforeMoveChange: Activity.kiteMove,
            click: Activity.eventHandler
        }, {
            id: 'kite_2',
            name: '图片-风筝2',
            type: 'img',
            beforeMoveChange: Activity.kiteMove,
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
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusLeft: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp: 'exchange_tel',
            nextFocusRight: 'btn_exchange_cancel',
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