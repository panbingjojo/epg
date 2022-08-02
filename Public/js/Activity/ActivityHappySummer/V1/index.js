(function (w, e, r, a) {
    var Activity = {
        isYearUser: 0,               // 0:未订购年包 1：非活动期订购年包 2：订购年包 3:vip 但非年包用户
        yearVipType: 0,
        gameStaus: false,
        activityDate: r.lmcid == '520094' ? '2020-04-01' : '2020-04-13',      //贵州广电2020-04-01，贵州电信2020-04-13

        init: function () {
            r.valueCountdown.showDialog = '0';
            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
        },

        initRegional: function () {
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + r.imagePath + '/bg_activity_rule.png)';

            $('lottery_success').style.backgroundImage = 'url(' + r.imagePath + '/bg_dialog.png)';
            $('lottery_fail').style.backgroundImage = 'url(' + r.imagePath + '/bg_dialog.png)';
            $('game_over').style.backgroundImage = 'url(' + r.imagePath + '/bg_dialog.png)';
            $('order_vip').style.backgroundImage = 'url(' + r.imagePath + '/bg_dialog.png)';

        },

        initGameData: function () {
            LMEPG.UI.showWaitingDialog('', 2);
            Activity.delayedCountDown = 0;      //延时计时器
            Activity.lotteryTimes = 0;


            // 处理拉取结果为“再接再厉”的数据 - 移除
            for (var i = 0; i < r.lotteryRecordList.list.length; i++) {
                if (r.lotteryRecordList.list[i].prize_name == '再接再厉') {
                    r.lotteryRecordList.list.splice(i, 1);
                    i--;
                }
            }
            for (var j = 0; j < r.myLotteryRecord.list.length; j++) {
                if (r.myLotteryRecord.list[j].prize_name == '再接再厉') {
                    r.myLotteryRecord.list.splice(j, 1);
                    j--;
                }
            }
        },

        initButtons: function () {
            e.BM.init('btn_order', Activity.buttons, true);
        },

        startGame: function () {
            G('btn_start').src = r.imagePath + 'starting.gif';
            e.BM.setKeyEventPause(true);    //禁用焦点事件

            // 去抽奖
            LMActivity.AjaxHandler.lottery(function (data) {
                e.BM.setKeyEventPause(true);    //禁用焦点事件
                LMActivity.lotteryPrizeId = data.prize_idx;     //保存中奖信息
                var prizeId = data.prize_idx;
                Activity.delayedCountDown = setTimeout(function () {
                    Activity.checkGameResult(prizeId);
                }, 3000);
            }, function () {
                e.BM.setKeyEventPause(true);    //禁用焦点事件
                //接口调用失败
                console.log('抽奖接口调用失败');
                // 未抽中 或抽奖失败 显示再接再厉额
                var noPrize = [3, 5, 7];
                var i = parseInt(Math.random() * 3);

                Activity.delayedCountDown = setTimeout(function () {
                    Activity.checkGameResult(noPrize[i]);
                }, 3000);
            });
        },

        checkGameResult: function (prizeId) {
            clearInterval(Activity.delayedCountDown);
            prizeId = prizeId > 7 ? 7 : prizeId;
            var prize_id = prizeId || 7;
            G('btn_start').src = r.imagePath + 'jump_start_arrow' + prize_id + '.png';
            var getPrize = [1, 2, 4, 6]; // 配置的中奖ID 分别对应1,2,3 等奖
            if (getPrize.indexOf(prize_id) !== -1) {
                var imgId = 0;
                switch (prizeId) {
                    case 1:
                        imgId = 1;
                        break;
                    case 2:
                        imgId = 6;
                        break;
                    case 4:
                        imgId = 3;
                        break;
                    case 6:
                        imgId = 6;
                        break;
                }
                $('prize_image').src = r.imagePath + 'prize' + imgId + '.png';
                setTimeout(function () {
                    LMActivity.triggerModalButton = 'btn_go_lottery';
                    LMActivity.showModal({
                        id: 'lottery_success',
                        focusId: 'btn_lottery_submit',
                    })
                }, 1500);

            } else {
                setTimeout(function () {
                    LMActivity.triggerModalButton = 'btn_go_lottery';
                    LMActivity.showModal({
                        id: 'lottery_fail',
                        focusId: 'btn_lottery_fail',
                    })
                }, 1500);
            }
            Activity.gameStaus = false;
            e.BM.setKeyEventPause(false);   // 恢复焦点事件
        },

        /**设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity');
        },

        setLotteryPhone: function (input, isReset) {
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
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: 'btn_start'
                    });
                })
            }, function () {
                LMEPG.UI.showToast('设置电话号码出错', 3, function () {
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: 'btn_start'
                    });
                })
            })
        },
        OnClickBtnLeft: function () {
            if (r.payInfo.result == '0') {
                // 遍历包月类型 取年包vip_id
                for (var i = 0; i < r.packageInfo.length; i++) {
                    if (r.packageInfo[i].expire == 365) {
                        Activity.yearVipType = r.packageInfo[i].vip_id;
                    }
                }
                ;

                if (r.payInfo.vip_id == Activity.yearVipType) {
                    if (r.payInfo.pay_dt >= Activity.activityDate) {
                        Activity.isYearUser = 2;
                    } else {
                        Activity.isYearUser = 1;
                    }
                } else {
                    Activity.isYearUser = 3;
                }
            }

            //   0:未订购年包 1：非活动期订购年包 2：已订购年包 3:vip 但非年包用户
            switch (Activity.isYearUser) {
                case 0:
                    a.showModal({
                        id: 'bg_no_order',
                        focusId: 'btn_order_vip',
                    })
                    break;
                case 1:
                    LMEPG.UI.showToast("活动期内订购年包才能领取大礼哦~", 3)
                    break;
                case 2:
                    a.showModal({
                        id: 'bg_order_id',
                        focusId: 'btn_order_id_sure',
                    })
                    break;
                case 3:
                    LMEPG.UI.showToast("已经是会员的您，无法参与年包活动哦~", 3)
                    break;
            }
        },
        checkGift: function () {
            // 用户未领取大礼包，则上传领取记录，并提示领取成功；否则已领过    0表示未领取 电话号码表示已领取
            if (r.valueHasGift == 0) {
                // 上传一条领取礼包成功记录 valueHasGift = 手机号;
                var orderTel = G('order_tel').innerText;

                //判断手机号是否正确
                if (!LMEPG.Func.isTelPhoneMatched(orderTel)) {
                    LMEPG.UI.showToast('请输入有效的电话', 1);
                    return;
                }

                LMActivity.AjaxHandler.saveData(r.keyHasGift, orderTel, function () {
                    a.showModal({
                        id: 'bg_get_success',
                        focusId: 'btn_lottery',
                    })
                });
            } else {
                a.showModal({
                    id: 'bg_get_fail',
                    focusId: 'btn_fail_iknow',
                })
            }
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_go_lottery':
                    LMActivity.triggerModalButton = btn.id;
                    a.showModal({
                        id: 'game_container',
                        focusId: 'btn_start',
                    })
                    break;
                case 'btn_back':
                    LMActivity.Router.reload();
                    break;
                case 'btn_start':
                    a.triggerModalButton = btn.id;

                    if (Activity.gameStaus == false) {
                        if (r.leftTimes - Activity.lotteryTimes > 0) {
                            Activity.gameStaus = true;
                            a.AjaxHandler.uploadPlayRecord(function () {
                                Activity.lotteryTimes++;
                                G('left_times').innerHTML = '剩余抽奖次数：' + (r.leftTimes - Activity.lotteryTimes);
                                Activity.startGame();
                            }, function () {
                                LMEPG.UI.showToast('扣除游戏次数出错', 3);
                            });
                        } else {
                            LMActivity.triggerModalButton = 'btn_order';
                            a.showGameStatus('btn_game_over_sure');
                        }
                    }

                    break;
                case 'btn_order':
                case 'btn_order_submit':
                    if (RenderParam.isVip == 1) {
                        LMEPG.UI.showToast("你已经订购过，不用再订购！");
                    } else {
                        LMActivity.Router.jumpBuyVip();
                    }
                    break;
                case 'btn_order_tel_sure':
                    Activity.checkGift();
                    break;
                case 'btn_fail_iknow':
                case 'btn_game_over_sure':
                case 'btn_lottery_cancel':
                    LMActivity.Router.reload();
                    break;
                case 'btn_list_cancel':
                    LMActivity.hideModal(LMActivity.shownModal);
                    e.BM.requestFocus('btn_winner_list');
                    break;
                case 'btn_game_back':
                case 'btn_lottery_fail':
                    LMActivity.hideModal(LMActivity.shownModal);
                    e.BM.requestFocus('btn_go_lottery');
                    break;
                case 'btn_order_cancel':
                    LMActivity.hideModal(LMActivity.shownModal);
                    e.BM.requestFocus('btn_order');
                    break;
                case 'btn_list_submit':
                    Activity.setLotteryPhone('reset_tel', true);
                    // LMActivity.showModal({
                    //     id: 'game_container',
                    //     focusId: 'btn_start'
                    // });
                    break;
            }
        }
    };

    Activity.buttons = [
        {
            id: 'btn_order',
            name: '按钮-一键订购',
            type: 'img',
            nextFocusRight: 'btn_go_lottery',
            nextFocusUp: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('buy_btn.png'),
            focusImage: a.makeImageUrl('buy_btn_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_go_lottery',
            name: '按钮-点我抽奖',
            type: 'img',
            nextFocusLeft: 'btn_order',
            nextFocusRight: 'btn_winner_list',
            nextFocusUp: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('lottery_btn.png'),
            focusImage: a.makeImageUrl('lottery_btn_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_order_id_sure',
            name: '按钮-订购账号确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_fail_iknow',
            name: '按钮-领礼包失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_iknow.png'),
            focusImage: a.makeImageUrl('btn_iknow.png'),
            click: Activity.eventHandler
        }, {
            id: 'order_tel',
            name: '领礼包手机号',
            type: 'div',
            nextFocusDown: 'btn_order_tel_sure',
            backgroundImage: a.makeImageUrl('bg_select_input.png'),
            focusImage: a.makeImageUrl('bg_select_input_f.png'),
            click: Activity.eventHandler,
            backFocusId: 'btn_order_tel_sure',
        }, {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_go_lottery',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            nextFocusLeft: 'btn_go_lottery',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_go_lottery',
            nextFocusLeft: 'btn_go_lottery',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_game_back',
            nextFocusRight: 'btn_game_back',
            backgroundImage: a.makeImageUrl('jump_start.png'),
            focusImage: a.makeImageUrl('jump_start_f.png'),
            listType: 'exchange',
            click: Activity.eventHandler
        }, {
            id: 'btn_game_back',
            name: '按钮-游戏返回',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            listType: 'exchange',
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
            nextFocusUp: 'reset_tel',
            nextFocusLeft: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            listType: 'lottery',
            nextFocusDown: 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('bg_select_input.png'),
            focusImage: a.makeImageUrl('bg_select_input_f.png'),
            focusChange: a.onInputFocus
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_exit',
            name: '按钮-取消抽奖',
            type: 'img',
            nextFocusLeft: 'btn_lottery_sure',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
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
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp: 'lottery_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler,
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
            backgroundImage: a.makeImageUrl('btn_iknow.png'),
            focusImage: a.makeImageUrl('btn_iknow.png'),
            click: Activity.eventHandler,
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-结束游戏',
            type: 'img',
            nextFocusRight: 'btn_game_over_cancel',
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
            click: Activity.eventHandler,
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler
        }
    ];

    w.Activity = Activity;

})(window, LMEPG, RenderParam, LMActivity);