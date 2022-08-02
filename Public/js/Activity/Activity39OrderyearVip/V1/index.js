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
                isPlay:false
            },
            init: function () {
                Activity.initHomePage();
                Activity.initButtons();
                Activity.showOrderResult();
                Activity.initLotteryPage();
            },
            initHomePage: function () {
                $('btn_back').src = a.makeImageUrl('btn_back.png');
                $('btn_activity_rule').src = a.makeImageUrl('btn_activity_rule.png');

                $('btn_start').src = a.makeImageUrl('btn_start.png');
            },
            initLotteryPage: function () {
                $('bg_lottery_success').src = a.makeImageUrl('bg_lottery_success.png');
                $('btn_lottery_submit').src = a.makeImageUrl('btn_common_sure.png');
                $('btn_lottery_cancel').src = a.makeImageUrl('btn_common_cancel.png');
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
            showOrderResult: function () {
                if (r.isOrderBack === '1') { // 从订购页面跳转回活动页面
                    if (r.cOrderResult === '1') { // 订购成功
                        Activity.getInquiryTimes(function (data) {
                            if(data==='45'){
                                $('bg_lottery_success').src = a.makeImageUrl('bg_lottery_success.png');
                                LMActivity.showModal({
                                    id: 'lottery_success',
                                    focusId:'btn_lottery_submit',
                                    onDismissListener: function () {
                                        LMActivity.Router.reload();
                                    }
                                })
                            }
                            else {
                                $('order_status').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_order_success.png') + ')'
                            }
                        });
                    } else { // 订购失败
                        $('order_status').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_order_fail.png') + ')'
                    }
                    LMActivity.showModal({ //展示模板页面
                        id: 'order_status',
                        onDismissListener: function () {
                            if (LMActivity.orderTimer && LMActivity.orderTimer !== null) {
                                // 关闭倒计时
                                clearTimeout(LMActivity.orderTimer);
                            }
                        }
                    });
                    LMActivity.orderTimer = setTimeout(function () {// 设置倒计时关闭模板页面
                        LMActivity.hideModal(LMActivity.shownModal);
                    }, 3000);
                }
            },
            setLotteryPhone: function (input, isReset) {
                var userTel = $(input).innerText;
                //判断手机号是否正确
                if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                    LMEPG.UI.showToast('请输入有效的电话', 1);
                    return;
                }
                var postData = {
                    key :RenderParam.userId,
                    val :userTel
                };
                LMEPG.ajax.postAPI('Activity/saveStoreData',postData, function (rsp) {
                    LMEPG.UI.showToast('设置电话号码成功', 3, function () {
                        LMActivity.Router.reload();
                    })

                }, function () {
                    LMEPG.UI.showToast('设置电话号码出错', 3, function () {
                        LMActivity.Router.reload();
                    })
                });
            },
            eventHandler: function (btn) {
                switch (btn.id) {
                    case  'btn_back':
                        var objCurrent = LMActivity.Router.getCurrentPage();
                        var objOrderHome = e.Intent.createIntent('home');
                        e.Intent.jump(objOrderHome, objCurrent, e.Intent.INTENT_FLAG_DEFAULT);
                        break;
                    case 'btn_start':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_activity_rule':
                        var homeIntent = LMEPG.Intent.createIntent("doctorIndex");
                        homeIntent.setParam("tabId", "tab-0" );
                        homeIntent.setParam("focusId", "tab-0" );
                        LMEPG.Intent.jump(homeIntent, LMActivity.Router.getCurrentPage());
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close':
                        LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'btn_lottery_submit':
                        Activity. setLotteryPhone('lottery_tel', false);
                        break;
                    case 'btn_game_cancel':
                        LMActivity.Router.reload();
                }
            },

            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },

            getInquiryTimes: function (callback) {
                var postData = {};
                LMEPG.ajax.postAPI('Activity/queryVipInfo',postData, function (rsp) {
                    var xyz= rsp.vip_id;
                    callback(xyz);
                }, function (rsp) {
                });
            },

            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },
            onInputFocus:function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(100, 88, btn.id, btn.backFocusId, true);
                }
            }
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
                click:Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: 'btn_start',
                nextFocusUp: 'btn_back',
                nextFocusDown: '',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_close_rule',
                name: '按钮-活动规则-关闭',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_start',
                name: '按钮-开始',
                type: 'img',
                nextFocusUp: 'btn_back',
                nextFocusLeft: '',
                nextFocusRight: 'btn_activity_rule',
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
                click: Activity.eventHandler
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
            },
           {
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
            }
        ];
        w.Activity = Activity;
    }
)
(window, LMEPG, RenderParam, LMActivity);

function onBack() {
    LMAndroid.JSCallAndroid.doExitApp()
}