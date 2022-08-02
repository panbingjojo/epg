(function (w, e, r, a) {
        var Activity = {
            playStatus: false,
            openCardList: [
                LMActivity.makeImageUrl('open_card1.png'),
                LMActivity.makeImageUrl('open_card2.png'),
                LMActivity.makeImageUrl('open_card3.png'),
                LMActivity.makeImageUrl('open_card4.png')
            ],
            clickTimes: false,

            init: function () {
                if (RenderParam.lmcid === '000051') {
                    a.setPageSize()
                }
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                a.showOrderResult();

                RenderParam.lmcid == "410092" && Activity.onBack410092();

                var nowTime = new Date().getTime();
                var startDate = RenderParam.endDt;
                startDate = startDate.replace(new RegExp("-", "gm"), "/");
                var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
                if (nowTime >= endDateM) { /*活动结束*/
                    LMActivity.showModal({
                        id: 'bg_game_over',
                        onDismissListener: function () {
                            LMEPG.Intent.back();
                        }
                    });
                }
            },

            onBack410092: function () {
                try {
                    HybirdCallBackInterface.setCallFunction(function (param) {
                        LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                        if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                            w.onBack();
                        }
                    });
                } catch (e) {
                    LMEPG.UI.logPanel.show("e");
                }
            },


            initRegional: function () {
                // 活动规则图片片路径
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_gift_1.png',
                    "2": regionalImagePath + '/icon_gift_2.png',
                    "3": regionalImagePath + '/icon_gift_3.png'
                };
            },

            initGameData: function () {
                LMActivity.playStatus = false;
            },

            eventHandler: function (btn) {
                // debugger;
                switch (btn.id) {
                    case 'btn_back':  //返回按钮
                        LMActivity.innerBack();
                        break;
                    case 'btn_order_submit': //订购按钮
                    case 'btn_order_immediately':
                    case 'btn_order':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_close':
                    case 'game_over_sure':
                    case 'btn_list_back':
                    case 'btn_activity_rule_back':
                    case 'btn_list_back_no':
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'btn_activity_rule':
                        LMActivity.triggerModalButton = 'btn_activity_rule';
                        LMActivity.showModal({
                            id: 'activity_rule',
                            focusId: 'btn_activity_rule_back',
                        });
                        break;
                    case 'prize1':
                    case 'prize2':
                    case 'prize3':
                    case 'prize4':
                        if (Activity.playStatus == true){
                            return
                        }
                        G('card_'+btn.num).src = Activity.openCardList[btn.num]
                        Activity.playStatus = true;
                        setTimeout(function () {
                            if (a.hasLeftTime()) {
                                a.AjaxHandler.uploadPlayRecord(function () {
                                    G("activityTimes").innerHTML = (--r.leftTimes).toString();
                                    LMActivity.triggerModalButton = btn.id;
                                    LMActivity.specialDoLottery();
                                });
                            } else {
                                LMActivity.triggerModalButton = 'prize1';
                                LMActivity.triggerModalButton = btn.id;
                                a.showGameStatus('btn_game_over_sure');
                            }
                        },1000)
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'do-cancel':
                    case 'btn_lottery_fail':
                    case 'btn_order_cancel':
                    case 'btn_game_over_sure':
                        LMActivity.Router.reload();
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('prize1', Activity.buttons, true);
            },
            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },
            onInputFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(RenderParam.platformType === 'hd' ? 235 : 215, RenderParam.platformType === 'hd' ? 420 : 190, btn.id, btn.backFocusId, true);
                }
            },

            nowFocusChange: function (Btn, Boolean) {
                if (Boolean) {
                    G('btn_open').style.display = 'block';
                    switch (Btn.id) {
                        case 'prize1':
                            G('btn_open').style.left = 220 + 'px';
                            break;
                        case 'prize2':
                            G('btn_open').style.left = 470 + 'px';
                            break;
                        case 'prize3':
                            G('btn_open').style.left = 695 + 'px';
                            break;
                        case 'prize4':
                            G('btn_open').style.left = 930 + 'px';
                            break;
                    }
                } else {
                    G('btn_open').style.display = 'none';
                }
            },

        };


        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusDown: 'btn_activity_rule',
                nextFocusLeft: 'prize1',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_winner_list_special',
                nextFocusLeft: 'prize1',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule_back',
                name: '按钮-活动规则-返回',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_back_1.png'),
                focusImage: a.makeImageUrl('btn_back_1_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_winner_list_special',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'prize4',
                nextFocusLeft: 'prize4',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_list_back_no',
                name: '按钮-未中奖名单-返回',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_back_1.png'),
                focusImage: a.makeImageUrl('btn_back_1_f.png'),
                click: Activity.eventHandler
            },{
                id: 'btn_list_back',
                name: '按钮-中奖名单-返回',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_back_1.png'),
                focusImage: a.makeImageUrl('btn_back_1_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'reset_tel',
                name: '输入框-中奖名单-重置电话号码',
                type: 'div',
                nextFocusRight: 'btn_list_submit',
                backFocusId: 'btn_list_submit',
                focusChange: Activity.onInputFocus,
                click: Activity.eventHandler
            }, {
                id: 'btn_order_immediately',
                name: '立即订购',
                type: 'img',
                nextFocusUp: 'prize1',
                backgroundImage: a.makeImageUrl('btn_order_immediately.png'),
                focusImage: a.makeImageUrl('btn_order_immediately_f.png'),
                click: Activity.eventHandler,
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
                nextFocusDown: 'btn_lottery_cancel',
                backFocusId: 'btn_lottery_submit',
                focusChange: Activity.onInputFocus
            },{
                id: 'btn_order',
                name: '按钮-抽奖失败-订购',
                type: 'img',
                nextFocusRight: 'btn_lottery_fail',
                backgroundImage: a.makeImageUrl('btn_order.png'),
                focusImage: a.makeImageUrl('btn_order_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_lottery_fail',
                name: '按钮-抽奖失败-返回',
                type: 'img',
                nextFocusLeft: 'btn_order',
                backgroundImage: a.makeImageUrl('btn_back_1.png'),
                focusImage: a.makeImageUrl('btn_back_1_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_game_over_sure',
                name: '按钮-结束游戏',
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
                click: Activity.eventHandler
            }, {
                id: 'btn_order_cancel',
                name: '按钮-取消订购VIP',
                type: 'img',
                nextFocusLeft: 'btn_order_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
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
                id: 'game_over_sure',
                name: '游戏-失败',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'do-lottery',
                name: '游戏-抽奖',
                type: 'img',
                nextFocusRight: 'do-cancel',
                backgroundImage: a.makeImageUrl('btn_draw.png'),
                focusImage: a.makeImageUrl('btn_draw_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'do-cancel',
                name: '游戏-放弃',
                type: 'img',
                nextFocusLeft: 'do-lottery',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'prize1',
                name: '礼物1',
                type: 'div',
                nextFocusRight: 'prize2',
                nextFocusUp: 'btn_winner_list_special',
                nextFocusDown: 'btn_order_immediately',
                backgroundImage: a.makeImageUrl('card1.png'),
                focusChange: Activity.nowFocusChange,
                click: Activity.eventHandler,
                num: 0
            }, {
                id: 'prize2',
                name: '礼物2',
                type: 'div',
                nextFocusLeft: 'prize1',
                nextFocusRight: 'prize3',
                nextFocusUp: 'btn_winner_list_special',
                nextFocusDown: 'btn_order_immediately',
                backgroundImage: a.makeImageUrl('card2.png'),
                focusChange: Activity.nowFocusChange,
                click: Activity.eventHandler,
                num: 1
            }, {
                id: 'prize3',
                name: '礼物3',
                type: 'div',
                nextFocusLeft: 'prize2',
                nextFocusRight: 'prize4',
                nextFocusUp: 'btn_winner_list_special',
                nextFocusDown: 'btn_order_immediately',
                backgroundImage: a.makeImageUrl('card3.png'),
                focusChange: Activity.nowFocusChange,
                click: Activity.eventHandler,
                num: 2
            },
            {
                id: 'prize4',
                name: '礼物4',
                type: 'div',
                nextFocusLeft: 'prize3',
                nextFocusRight: 'btn_winner_list_special',
                nextFocusUp: 'btn_winner_list_special',
                nextFocusDown: 'btn_order_immediately',
                backgroundImage: a.makeImageUrl('card4.png'),
                focusChange: Activity.nowFocusChange,
                click: Activity.eventHandler,
                num: 3
            },
        ];

        w.Activity = Activity;
        w.onBack = function () {
            if (LMActivity.shownModal) {
                if (G('order_vip').style.display === 'block' || G('game_over').style.display === 'block') {
                    LMActivity.Router.reload();
                }
                LMActivity.hideModal(LMActivity.shownModal);
            } else {
                LMActivity.innerBack()
            }
        }
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094', '220095', '410092', '460092', '10220094'];

function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}
