(function (w, e, r, a) {
    var Activity = {
        keyCookie : r.activityName+r.userId,    //cookie键值，用于判断用户是否1分钟内反复点击产品订购
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            Activity.initLotteryList();
            Activity.renderHtml();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
        },

        initLotteryList:function(){
            if (r.myLotteryRecord.list.length > 0){
                Activity.score = r.myLotteryRecord.list[0].prize_count;
            }else {
                Activity.score = 0;
            }
            r.score = Activity.score;
        },

        doMyLottery: function () {
            LMActivity.triggerModalButton = 'btn_start';
            LMActivity.AjaxHandler.lottery(function (data) {
                Activity.score = parseInt(Activity.score) + 1;
                r.score = Activity.score;
                LMActivity.showModal({
                    id: 'lottery_success',
                    focusId: 'btn_lottery_success',
                });
                LMActivity.playStatus = false;
                Activity.renderHtml();
            }, function () {
                LMActivity.showModal({
                    id: 'lottery_fail',
                    focusId: 'btn_lottery_fail',
                });
                LMActivity.playStatus = false;
                Activity.renderHtml();
            });
        },

        playGame: function () {
            r.leftTimes--;
            // G('grab_action').src = r.imagePath+'/grab_action.gif';
            G('grab_action').style.visibility = 'visible';
            //等放完抓的动动作后再开始加分
            setTimeout(function () {
                Activity.doMyLottery();
                G('grab_action').style.visibility = 'hidden';
            },2000);
        },

        renderHtml: function(){
            // G('score').innerHTML = Activity.score;//测试用
            G('left_times').innerHTML = r.leftTimes;
            G('score').innerHTML= Activity.score;
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_lottery_success':
                case 'btn_lottery_fail':
                    // 关闭当前对话框
                    LMActivity.hideModal(LMActivity.shownModal);
                    break;
                case 'btn_exchange_close':
                    LMActivity.hideModal(LMActivity.shownModal);
                    LMEPG.ButtonManager.init('btn_exchange_prize', Activity.buttons, "", true);
                    break;
                case 'btn_game_success':
                case 'btn_fail':
                    a.Router.reload(); // 重新加载
                    break;
                case 'btn_order_sure':
                    LMActivity.hideModal(LMActivity.shownModal);
                    break;
                case 'btn_start':
                    LMActivity.triggerModalButton = 'btn_start';
                    if (a.hasLeftTime()) {
                        if(!LMActivity.playStatus){
                            LMActivity.playStatus = true;
                            a.AjaxHandler.uploadPlayRecord(function () {
                                Activity.playGame();
                            }, function () {
                                LMEPG.UI.showToast('扣除游戏次数失败', 2);
                            });
                        }
                    }else{
                        LMActivity.triggerModalButton = btn.id;
                        a.showGameStatus('btn_game_over_sure');
                    };
                    break;

                case 'btn_order_submit':
                    if (RenderParam.lmcid === '640094') {
                        Activity.jumpPlayVideo();
                    } else {
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                    }
                    break;
            }
        }
    };

    Activity.exchangePrizeButtons = [
        {
            id: 'btn_exchange_close',
            name: '按钮-兑换一关闭',
            type: 'img',
            nextFocusLeft: 'exchange_prize_3',
            nextFocusDown: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            order: 0,
            click: Activity.eventHandler
        },  {
            id: 'exchange_prize_1',
            name: '按钮-兑换一等奖',
            type: 'img',
            nextFocusUp: 'btn_exchange_close',
            nextFocusLeft: 'exchange_prize_3',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_unable.png'),
            focusImage: a.makeImageUrl('btn_exchange_unable_f.png'),
            order: 0,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换二等奖',
            type: 'img',
            nextFocusUp: 'btn_exchange_close',
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_unable.png'),
            focusImage: a.makeImageUrl('btn_exchange_unable_f.png'),
            order: 1,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换三等奖',
            type: 'img',
            nextFocusUp: 'btn_exchange_close',
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
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: '',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则-返回',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: '',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换奖品',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusUp: 'btn_winner_list',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            exchangePrizeButtons: Activity.exchangePrizeButtons,
            exchangeFocusId: '',
            moveType: 1,
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '开始游戏按钮',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: "btn_exchange_prize",
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start.gif'),
            click: Activity.eventHandler
        },{
            id: 'btn_lottery_success',
            name: '按钮-抓到年兽-确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-抓取失败-确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: "reset_tel",
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
            type: 'img',
            nextFocusRight: r.platformType === 'hd' ? 'btn_list_submit' : '',
            nextFocusDown: r.platformType === 'hd' ? '' : 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('tel_frame.png'),
            focusImage: a.makeImageUrl('tel_frame_f.png'),
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
            name: '按钮-订购VIP-确定',
            type: 'img',
            nextFocusRight: 'btn_order_cancel',
            backgroundImage: a.makeImageUrl('btn_yes.png'),
            focusImage: a.makeImageUrl('btn_yes_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_no.png'),
            focusImage: a.makeImageUrl('btn_no_f.png'),
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
            name: '按钮-游戏结束-确定',
            type: 'img',
            nextFocusLeft: 'btn-play',
            nextFocusDown: 'btn-play',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);