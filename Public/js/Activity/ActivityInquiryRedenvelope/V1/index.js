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
                Activity.initInquiryPage();
                Activity.initGameOverPage();
                Activity.initLotteryPage();
            },
            initInquiryPage:function () {
                $('bg_inquiry').src = a.makeImageUrl('bg_inquiry.png')
            },
            initHomePage: function () {
                $('btn_back').src = a.makeImageUrl('btn_back.png');
                $('btn_activity_rule').src = a.makeImageUrl('btn_activity_rule.png');
                $('btn_winner_list').src = a.makeImageUrl('btn_winner_list.png');
                $('btn_start').src = a.makeImageUrl('btn_start.png');
            },
            initRulePage: function () {
                $('btn_close_rule').src = a.makeImageUrl('btn_close_f');
                $('bg_activity_rule').src = a.makeImageUrl('bg_activity_rule.png')
            },
            initWinnerListPage: function () {
                $('bg_winner_list').src = a.makeImageUrl('bg_winner_list.png');
                $('btn_lottery_submit').src = a.makeImageUrl('btn_common_sure.png');
                $('btn_list_cancel').src = a.makeImageUrl('btn_common_cancel.png');
            },
            initLotteryPage: function () {
                $('bg_lottery_success').src = a.makeImageUrl('bg_lottery_success.png');
                $('lottery_tel').style.backgroundImage="url("+a.makeImageUrl('btn_input.png')+")";
                $('btn_lottery_submit').src = a.makeImageUrl('btn_common_sure.png');
                $('btn_lottery_cancel').src = a.makeImageUrl('btn_common_cancel.png');
                LMActivity.prizeImage = [
                    a.makeImageUrl('prize_image0.png'),
                    a.makeImageUrl('prize_image0.png'),
                    a.makeImageUrl('prize_image1.png'),
                    a.makeImageUrl('prize_image2.png'),
                    a.makeImageUrl('prize_image3.png'),
                    a.makeImageUrl('prize_image4.png'),
                    a.makeImageUrl('prize_image5.png'),
                    a.makeImageUrl('prize_image6.png')
                ]
            },
            initGameOverPage: function () {
                $('order_vip_bg').src = a.makeImageUrl('bg_order_vip.png');
                $('bg_game_over').src = a.makeImageUrl('bg_no_times.png');
                $('btn_game_over_sure').src = a.makeImageUrl('btn_common_sure.png');
                $('btn_order_submit').src = a.makeImageUrl('btn_common_sure.png');
                $('btn_order_cancel').src = a.makeImageUrl('btn_common_cancel.png');
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
           initMyListPage: function (lotteryRecordList, myLotteryRecordList) {
               $('reset_tel').style.backgroundImage="url("+a.makeImageUrl('btn_input.png')+")";
               var str=RenderParam.userAccount;
               $('my_account').innerHTML=str.slice(0, 3) + '***' + str.slice(str.length - 3);
               var money=0;
               for (var i = 0; i < myLotteryRecordList.length; i++) {
                    money += parseInt(myLotteryRecordList[i].prize_name)*parseInt(myLotteryRecordList[i].prize_count)
               }
               $('total_money').innerHTML=money;
               if (myLotteryRecordList &&
                   myLotteryRecordList.length > 0
                   && myLotteryRecordList[0]['user_tel']) {
                   $('reset_tel').innerHTML = myLotteryRecordList[myLotteryRecordList.length - 1]['user_tel'];
               } else {
                   $('reset_tel').innerHTML = "请输入有效的电话";
               }
           },
            eventHandler: function (btn) {
                switch (btn.id) {
                    case  'btn_back':
                        LMActivity.exitActivity();
                        break;
                    case 'btn_start':
                        Activity.getInquiryTimes(-1,function (data) {
                            var data1 = parseInt(data);
                            if (data1!==0) {
                                Activity.startBtn(data1);
                            } else {
                                LMActivity.triggerModalButton = btn.id;
                                Activity.showGameStatus('btn_game_over_sure',data1);
                            }
                        });
                        break;
                    case 'btn_inquiry':
                        // 点击跳转到问诊
                        var homeIntent = LMEPG.Intent.createIntent("home");
                        homeIntent.setParam("tabId", "tab-4" );
                        homeIntent.setParam("focusId", "tab-4" );
                        LMEPG.Intent.jump(homeIntent, LMActivity.Router.getCurrentPage());
                        break;
                    case 'btn_activity_rule':
                        Activity.initRulePage();
                        a.eventHandler(btn);
                        break;
                    case 'btn_winner_list':
                        Activity.initWinnerListPage();
                        Activity.initMyListPage(r.lotteryRecordList.list,r.myLotteryRecord.list);
                        LMActivity.triggerModalButton = btn.id;
                        LMActivity.showModal({
                            id: 'winner_list',
                            focusId: 'btn_list_submit'
                        });
                        break
                    case 'btn_order_submit':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                                LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_list_submit':
                        Activity.setLotteryPhone('reset_tel', true);
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close_exchange':
                    case 'btn_close':
                        LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'btn_game_cancel':
                        LMActivity.Router.reload();
                }
            },
            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },
            startBtn: function (btn) {
                LMActivity.AjaxHandler.getActivityTimes(r.activityName, function () {
                    if (a.hasLeftTime()) {
                        if (LMActivity.playStatus) {
                            return;
                        }
                        LMActivity.playStatus = true;
                        a.AjaxHandler.uploadPlayRecord(function () {
                            r.leftTimes = r.leftTimes - 1;
                            Activity.doLottery();
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });
                    } else {
                        LMActivity.triggerModalButton = btn.id;
                        a.showGameStatus('btn_game_over_sure');
                    }
                })
            },
            doLottery: function () {
                LMActivity.AjaxHandler.lottery(function (data) {
                    LMActivity.lotteryPrizeId = data.prize_idx;
                    $('prize_image').src = LMActivity.prizeImage[data.unique_name];
                    LMActivity.showModal({
                        id: 'lottery_success',
                        focusId: 'btn_lottery_submit',
                        onDismissListener: function () {
                            LMActivity.Router.reload();
                        }
                    });
                    LMActivity.playStatus = false;
                }, function () {
                    LMActivity.showModal({
                        id: 'game_over',
                        focusId: 'gameOverFocusId',
                        onDismissListener: function () {
                            LMActivity.Router.reload();
                        }
                    });
                    LMActivity.playStatus = false;
                });
            },
            setLotteryPhone: function (input, isReset) {
                LMActivity.lotteryPrizeId = RenderParam.myLotteryRecord.list[0].prize_idx;
                var userTel = $(input).innerText;
                //判断手机号是否正确
                if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                    LMEPG.UI.showToast('请输入有效的电话', 1);
                    return;
                }

                if (isReset && !LMActivity.lotteryPrizeId) {
                    LMEPG.UI.showToast('您尚未中奖', 1);
                    return;
                }

                LMActivity.AjaxHandler.setPhoneForLottery(userTel, LMActivity.lotteryPrizeId, function () {
                    LMEPG.UI.showToast('设置电话号码成功', 3, function () {
                        LMActivity.Router.reload();
                    })
                }, function () {
                    LMEPG.UI.showToast('设置电话号码出错', 3, function () {
                        LMActivity.Router.reload();
                    })
                })
            },

            showGameStatus: function (gameOverFocusId,data1) {
                if (r.isVip === 0 || r.isVip === '0') {
                    // 普通用户提示VIP订购
                    LMActivity.showModal({
                        id: 'order_vip',
                        focusId: 'btn_order_submit'
                    });
                } else {
                    // 如果是vip未问诊，去问诊否则显示明天再来
                    if(data1=== 0){
                        // 去问诊
                        LMActivity.showModal({
                            id: 'inquiry',
                            focusId: 'btn_inquiry'
                        });
                    }else{
                        // VIP用户提示活动结束
                        LMActivity.showModal({
                            id: 'game_over',
                            focusId: gameOverFocusId
                        });
                    }

                }
            },
            getInquiryTimes: function (page, callback) {
                var reqData = {
                    'member_id': RenderParam.memberID,
                    'page_current': page
                };
                LMEPG.ajax.postAPI('Doctor/getInquiryTimes', reqData, function (rsp) {
                    var xyz= rsp.res123.count;
                    callback(xyz);
                }, function (rsp) {
                });
            },

            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },
            onInputFocus:function (btn, hasFocus) {
                $('lottery_tel').style.backgroundImage="url("+a.makeImageUrl('btn_input_f.png')+")";
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(100, 88, btn.id, btn.backFocusId, true);
                }
            }
        };

        Activity.buttons = [
            {
                id: 'btn_inquiry',
                name: '立即问诊',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: a.makeImageUrl('btn_inquiry.png'),
                focusImage: a.makeImageUrl('btn_inquiry_f.png'),
                click:Activity.eventHandler
            },
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
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
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
                click: Activity.eventHandler
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
                backgroundImage: a.makeImageUrl('btn_input.png'),
                focusImage: a.makeImageUrl('btn_input.png'),
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
                backgroundImage: a.makeImageUrl('btn_input.png'),
                focusChange: Activity.onInputFocus
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