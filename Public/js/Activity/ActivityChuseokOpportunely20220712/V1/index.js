(function (w, e, r, a) {
        var Activity = {
            playStatus: false,
            brightnessList: [
                LMActivity.makeImageUrl('bright1.png'),
                LMActivity.makeImageUrl('bright2.png'),
                LMActivity.makeImageUrl('bright3.png'),
                LMActivity.makeImageUrl('bright4.png'),
                LMActivity.makeImageUrl('lightsWentOut.png')
            ],
            brightnessNum: 0,
            brightnessTime: '',

            init: function () {
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                Activity.renderBrightnessList();
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
                if (RenderParam.lmcid == '520092' || RenderParam.lmcid == '520094' ||
                    RenderParam.lmcid == '520095') {
                    a.prizeImage = {
                        "1": regionalImagePath + '/icon_gift_1.png',
                        "2": regionalImagePath + '/icon_gift_2.png',
                        "3": regionalImagePath + '/icon_gift_3.png',
                        "4": regionalImagePath + '/icon_gift_4.png'
                    };
                }else {
                    a.prizeImage = {
                        "1": regionalImagePath + '/icon_gift_1.png',
                        "2": regionalImagePath + '/icon_gift_2.png',
                        "3": regionalImagePath + '/icon_gift_3.png'
                    };
                }

            },

            initGameData: function () {
                LMActivity.playStatus = false;
            },

            /**
             * 点击事件
             * */
            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack();
                        break;
                    case 'btn_order_submit': //订购按钮
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close':
                    case 'btn_game_fail_sure':
                    case 'btn_game_over_sure':
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'btn_start':
                        console.log(Activity.playStatus);
                        if (Activity.playStatus == true) {
                            return
                        }
                        if (a.hasLeftTime()) {
                            a.AjaxHandler.uploadPlayRecord(function () {
                                Activity.playStatus = true;
                                G("activityTimes").innerHTML = (--r.leftTimes).toString();
                                LMActivity.triggerModalButton = btn.id;
                                Activity.playGames();
                            });
                        } else {
                            LMActivity.triggerModalButton = 'btn_start';
                            LMActivity.triggerModalButton = btn.id;
                            a.showGameStatus('btn_game_over_sure');
                        }
                        break;
                    case 'do_lottery':
                        a.doLottery();
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'do_cancel':
                    case 'btn_game_back':
                        LMActivity.Router.reload();
                        break;
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },

            onInputFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(RenderParam.platformType === 'hd' ? 95 : 215, RenderParam.platformType === 'hd' ? 420 : 190, btn.id, btn.backFocusId, true);
                }
            },

            renderBrightnessList:function () {
                Activity.brightnessTime = setInterval(function (){
                    if (Activity.brightnessNum>3) {
                        for (var i = 1;i<5;i++) {
                            G('bright'+i).src = Activity.brightnessList[4];
                        }
                        Activity.brightnessNum=0;
                    }else {
                        G('bright'+(Activity.brightnessNum+1)).src = Activity.brightnessList[Activity.brightnessNum];
                        Activity.brightnessNum++;
                    }
                },1000)
            },

            playGames: function () {
                clearInterval(Activity.brightnessTime);
                if (Activity.brightnessNum===2) {
                    G('btn_default').src = LMActivity.makeImageUrl('float.gif');
                    G('btn_default').style.left = '455px';
                    setTimeout(function (){
                        LMActivity.triggerModalButton = 'btn_start';
                        G('btn_default').style.left = '';
                        G('btn_default').src = LMActivity.makeImageUrl('default.png');
                        LMActivity.showModal({
                            id: 'game_success',
                            focusId: 'do_lottery'
                        });
                    },3500)
                }else {
                    G('btn_default').src = LMActivity.makeImageUrl('disappear.gif');
                    G('btn_default').style.left = '455px';
                    setTimeout(function (){
                        a.showModal({
                            id: 'game_fail',
                            focusId: 'btn_game_fail_sure',
                            onDismissListener: function () {
                                G('btn_default').style.left = '';
                                G('btn_default').src = LMActivity.makeImageUrl('default.png');
                                a.Router.reload();
                            }
                        });
                    },5000)
                }
            },

        };

        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusDown: 'btn_activity_rule',
                nextFocusLeft: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_winner_list',
                nextFocusLeft: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusUp: 'btn_activity_rule',
                nextFocusLeft: 'btn_start',
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            }, {
                id: 'btn_start',
                name: '选巧劲',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
                nextFocusRight: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler,
                num: 1
            },  {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusUp: 'reset_tel',
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
                id: 'btn_game_fail_sure',
                name: '按钮-游戏失败确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
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
                nextFocusUp: 'lottery_tel',
                nextFocusLeft: 'btn_lottery_submit',
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
            }, {
                id: 'btn_lottery_fail',
                name: '按钮-抽奖失败-确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
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
                click: a.eventHandler
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
                id: 'do_lottery',
                name: '游戏-抽奖',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'do_cancel',
                backgroundImage: a.makeImageUrl('btn_draw.png'),
                focusImage: a.makeImageUrl('btn_draw_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'do_cancel',
                name: '游戏-放弃',
                type: 'img',
                nextFocusLeft: 'do_lottery',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_close_rule',
                name: '活动规则-关闭',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: a.eventHandler
            }
        ];

        w.Activity = Activity;
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['10220094', '10220095', '410092'];

function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}