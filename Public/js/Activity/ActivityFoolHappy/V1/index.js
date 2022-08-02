(function (w, e, r, a) {
    var Activity = {
        init: function () {
            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
            Activity.initDiffImg();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            a.prizeImage = {
                "1": regionalImagePath + '/icon_prize_1.png',
                "2": regionalImagePath + '/icon_prize_2.png',
                "3": regionalImagePath + '/icon_prize_3.png'
            };
        },

        initGameData: function () {
            H('position_1');
            H('position_2');
            H('position_3');

            Activity.hatMoveCnt = 0;            //帽子移动计数器
            Activity.foodRandNum = 0;           //随机抓取食物
            Activity.delayedCountDown = 0;      //延时计时器
            Activity.graspFlag = 0;             //抓取状态

            Activity.hatCountDown = setInterval(Activity.hatMoveCountDown, 500);
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        initDiffImg: function(){

        },

        hatMoveCountDown: function(){
            if(Activity.hatMoveCnt == 0){
                G('hat_1').src = r.imagePath + 'hat_1.png';
                G('hat_2').src = r.imagePath + 'hat_2.png';
                G('hat_3').src = r.imagePath + 'hat_3.png';
                Activity.hatMoveCnt++;
            }else if(Activity.hatMoveCnt == 1){
                G('hat_1').src = r.imagePath + 'hat_3.png';
                G('hat_2').src = r.imagePath + 'hat_1.png';
                G('hat_3').src = r.imagePath + 'hat_2.png';
                Activity.hatMoveCnt++;
            }else if(Activity.hatMoveCnt == 2){
                G('hat_1').src = r.imagePath + 'hat_2.png';
                G('hat_2').src = r.imagePath + 'hat_3.png';
                G('hat_3').src = r.imagePath + 'hat_1.png';
                Activity.hatMoveCnt = 0;
            }
        },

        checkGameResult: function () {
            clearInterval(Activity.delayedCountDown);

            if (Activity.foodRandNum != 2) {
                G('success_lottery_img').src = r.imagePath + 'food_' + Activity.foodRandNum + '.png';
                a.showModal({
                    id: 'game_success',
                    focusId: 'btn_lottery_sure',
                    onDismissListener: function () {
                        if (a.currentClickedId !== 'btn_lottery_sure') {
                            a.Router.reload();
                        }
                    }
                })
            } else {
                G('fail_lottery_img').src = r.imagePath + 'food_' + Activity.foodRandNum + '.png';
                a.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail_sure',
                    onDismissListener: function () {
                        if(a.currentClickedId !== 'btn_game_fail_sure'){
                            a.Router.reload();
                        }
                    }
                })
            }
        },

        /**设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity');
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        if(Activity.graspFlag == 1){
                            return;
                        }
                        Activity.graspFlag = 1;
                        a.AjaxHandler.uploadPlayRecord(function () {
                            Activity.startGame();
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_order_submit':
                    LMActivity.Router.jumpBuyVip();
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_lottery_fail':
                    Activity.defaultFocusId = "btn_start";
                    LMEPG.ButtonManager.init(Activity.defaultFocusId, Activity.buttons, "", true);
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    Activity.hitsNum = 0;
                    break;
            }
        },

        startGame: function () {
            Activity.foodRandNum = parseInt(Math.random() * (3 - 1 + 1) + 1);
            clearInterval(Activity.hatCountDown);
            H('hat_2');
            G('position_2').src = r.imagePath + 'home_food_' + Activity.foodRandNum + '.png';
            S('position_2');
            G('fail_lottery_img').src = r.imagePath + 'food_' + Activity.foodRandNum + '.png';
            G('btn_start').src = r.imagePath + 'btn_start_fist.png';

            Activity.delayedCountDown = setTimeout(Activity.checkGameResult, 2000);
        }
    };//end Activity =

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_start',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            nextFocusLeft: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_start',
            backgroundImage:  a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.gif'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusRight: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.gif'),
            listType: 'exchange',
            click: Activity.eventHandler
        },  {
            id: 'btn_close_rule',
            name: '按钮-关闭活动规则',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_close_rule.png'),
            focusImage: a.makeImageUrl('btn_close_rule_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusLeft: '',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusLeft: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            listType: 'lottery',
            nextFocusDown: 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_sure',
            name: '按钮-我要抽奖',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_lottery.png'),
            focusImage: a.makeImageUrl('btn_lottery_f.gif'),
            click: a.eventHandler,
        }, {
            id: 'btn_lottery_exit',
            name: '按钮-取消抽奖',
            type: 'img',
            nextFocusLeft: 'btn_lottery_sure',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_submit',
            name: '按钮-中奖-确定',
            type: 'img',
            nextFocusUp: 'lottery_tel',
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp: 'lottery_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler,
            //backFocusId: 'btn_start'
        }, {
            id: 'lottery_tel',
            name: '输入框-中奖-电话号码',
            type: 'div',
            nextFocusRight: 'btn_lottery_submit',
            backFocusId: 'btn_lottery_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-抽奖失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler,
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-结束游戏',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_order_submit',
            name: '按钮-订购VIP',
            type: 'img',
            nextFocusRight: 'btn_order_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler,
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);