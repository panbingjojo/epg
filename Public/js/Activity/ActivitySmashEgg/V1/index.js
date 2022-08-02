(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 10,
            timerId: "",
            gameData: {
                currentIndex: 0,
                size:4,
                isPlay:false,//每次进入都只能砸一次
            },

            init: function () {
                // Activity.initGameData();
                Activity.initHomePage();
                Activity.initButtons();
                a.showOrderResult();
            },

            initHomePage: function () {
                $('btn_back').src = a.makeImageUrl('btn_back.png')
                $('btn_activity_rule').src = a.makeImageUrl('btn_activity_rule.png')
                $('btn_winner_list').src = a.makeImageUrl('btn_winner_list.png')
                $('btn_start').src = a.makeImageUrl('btn_start.png')
            },
            initRulePage: function () {
                $('btn_close_rule').src = a.makeImageUrl('btn_back.png')
                $('bg_activity_rule').src = a.makeImageUrl('bg_activity_rule.png')
            },

            initWinnerListPage: function () {
                $('bg_winner_list').src = a.makeImageUrl('bg_winner_list.png')
                $('btn_lottery_submit').src = a.makeImageUrl('btn_common_sure.png')
                $('btn_list_cancel').src = a.makeImageUrl('btn_common_cancel.png')
            },
            initLotteryPage: function () {
                $('bg_lottery_fail').src = a.makeImageUrl('bg_lottery_fail.png')
                $('bg_lottery_success').src = a.makeImageUrl('bg_lottery_success.png')
                $('btn_lottery_submit').src = a.makeImageUrl('btn_common_sure.png')
                $('btn_lottery_cancel').src = a.makeImageUrl('btn_common_cancel.png')
                LMActivity.prizeImage = [
                    a.makeImageUrl('prize_image0.png'),
                    a.makeImageUrl('prize_image0.png'),
                    a.makeImageUrl('prize_image1.png'),
                    a.makeImageUrl('prize_image2.png'),
                    a.makeImageUrl('prize_image3.png'),
                    a.makeImageUrl('prize_image4.png')
                ]
            },
            initGamePage: function () {
                $('bg_game_container').src = a.makeImageUrl('bg_game_container.png')
                $('egg-0').src = a.makeImageUrl('egg_normal.png')
                $('egg-1').src = a.makeImageUrl('egg_normal.png')
                $('egg-2').src = a.makeImageUrl('egg_normal.png')
                $('egg-3').src = a.makeImageUrl('egg_normal.png')
                $('hammer').src = a.makeImageUrl('hammer.png')
                Activity.gameData.currentIndex = Math.floor((Math.random()*4));
                $('hammer').style.left = (313*Activity.gameData.currentIndex+123)+'px';
            },
            initGameOverPage: function () {
                $('order_vip_bg').src = a.makeImageUrl('bg_order_vip.png')
                $('bg_game_over').src = a.makeImageUrl('bg_game_over.png')
                $('btn_game_over_sure').src = a.makeImageUrl('btn_common_sure.png')
                $('btn_order_submit').src = a.makeImageUrl('btn_common_sure.png')
                $('btn_order_cancel').src = a.makeImageUrl('btn_common_cancel.png')
            },
            createGameMap: function () {
                var btn = {
                    id: 'hammer',
                    name: '锤子',
                    type: 'img',
                    nextFocusLeft: '',
                    nextFocusUp: '',
                    nextFocusDown: '',
                    beforeMoveChange: Activity.beforeMoveChange,
                    click: Activity.eventHandler
                };
                Activity.buttons.push(btn);
                LMEPG.ButtonManager.init( 'hammer', Activity.buttons, '', true);
            },
            isEmpt: function (id) {
                var temId = parseInt(id.substring(6, 7));
                if (unLightId.indexOf(temId) >= 0) {
                    return true;
                } else {
                    return false;
                }
            },

            initGameData: function () {
                LMActivity.playStatus = false;
            },
            beforeMoveChange: function (dir, cur) {
                if (!Activity.gameData.isPlay && cur.id == 'hammer' && dir == "left" && Activity.gameData.currentIndex > 0) {
                    Activity.gameData.currentIndex--;
                    $('hammer').style.left = (313*Activity.gameData.currentIndex+123)+'px';
                    return false
                } else if (!Activity.gameData.isPlay && cur.id == 'hammer' && dir == "right" && Activity.gameData.currentIndex < Activity.gameData.size - 1) {
                    Activity.gameData.currentIndex++;
                    $('hammer').style.left = (313*Activity.gameData.currentIndex+123)+'px';
                    return false
                }
            },

            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_start':
                        if (a.hasLeftTime()) {
                            Activity.startBtn();
                        } else {
                            LMActivity.triggerModalButton = btn.id;
                            Activity.initGameOverPage();
                            a.showGameStatus('btn_game_over_sure');
                        }
                        break;
                    case 'btn_game_confirm':
                        // 扣除次数成功直接去抽奖
                        a.doLottery();
                        break
                    case 'btn_activity_rule':
                        Activity.initRulePage();
                        a.eventHandler(btn)
                        break
                    case 'btn_winner_list':
                        Activity.initWinnerListPage();
                        a.eventHandler(btn)
                        break
                    case 'btn_order_submit':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                                LMActivity.Router.jumpBuyVip();
                        }

                        break;
                    case 'hammer':
                        if(Activity.gameData.isPlay){
                            return;
                        }
                        Activity.gameData.isPlay = true;
                        $('egg-'+Activity.gameData.currentIndex).src = a.makeImageUrl('egg_selected.png')
                        setTimeout(new function () {
                            // 扣除次数成功直接去抽奖
                            Activity.initLotteryPage();
                            a.doLottery();
                        },1500);
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close_exchange':
                    case 'btn_close':
                        LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                        LMActivity.Router.reload();
                }
            },

            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },

            startBtn: function (btn) {
                LMActivity.triggerModalButton = 'btn_start';
                if (LMActivity.playStatus) {
                    return;
                }
                LMActivity.playStatus = true;
                LMActivity.AjaxHandler.uploadPlayRecord(function () {
                    Activity.initGamePage();
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: 'skin-btn-0'
                    });
                    Activity.createGameMap();
                    r.leftTimes = r.leftTimes - 1;
                    G("left_times").innerHTML = "剩余次数: "+r.leftTimes;
                }, function () {
                    LMEPG.UI.showToast('扣除游戏次数出错', 3);
                });
            },

            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },

        };

        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: '',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_close_rule',
                name: '按钮-活动规则-关闭',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: Activity.eventHandler
            }, {
                id: 'btn_start',
                name: '按钮-开始',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
                nextFocusLeft: '',
                nextFocusRight: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusUp: 'reset_tel',
                nextFocusLeft: '',
                nextFocusRight: 'btn_list_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                listType: 'lottery',
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
                id: 'btn_lottery_submit',
                name: '按钮-中奖-确定',
                type: 'img',
                nextFocusUp: 'lottery_tel',
                nextFocusRight: 'btn_lottery_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_lottery_cancel',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: 'btn_lottery_submit',
                nextFocusUp: 'lottery_tel',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'lottery_tel',
                name: '输入框-抽奖-电话号码',
                type: 'div',
                nextFocusDown: 'btn_lottery_submit',
                backFocusId: 'btn_lottery_submit',
                focusChange: a.onInputFocus
            }, {
                id: 'btn_lottery_fail',
                name: '按钮-抽奖失败-确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_close_exchange',
                name: '按钮-兑换页-返回',
                type: 'img',
                nextFocusDown: 'exchange_prize_1',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'exchange_prize_1',
                name: '按钮-兑换1',
                type: 'img',
                order: 0,
                nextFocusUp: 'btn_close_exchange',
                nextFocusRight: 'exchange_prize_2',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler
            }, {
                id: 'exchange_prize_2',
                name: '按钮-兑换2',
                type: 'img',
                order: 1,
                nextFocusUp: 'btn_close_exchange',
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
                nextFocusUp: 'btn_close_exchange',
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
                click: Activity.eventHandler
            }, {
                id: 'btn_order_cancel',
                name: '按钮-取消订购VIP',
                type: 'img',
                nextFocusLeft: 'btn_order_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_game_confirm',
                name: '按钮-中奖-确定',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn_game_cancel',
                backgroundImage: a.makeImageUrl('btn_lotter.png'),
                focusImage: a.makeImageUrl('btn_lotter_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_game_cancel',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: 'btn_game_confirm',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_no_score',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'play',
                name: '按钮-换装',
                type: 'img',
                nextFocusUp: 'skin-btn-0',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('play.png'),
                focusImage: a.makeImageUrl('play_f.png'),
                click: Activity.eventHandler
            }
        ];
        w.Activity = Activity;
    }
)
(window, LMEPG, RenderParam, LMActivity);