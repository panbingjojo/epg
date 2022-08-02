(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 20,
            timerId: "",
            currentSkin: 1,
            wheelTimer:"",

            count: 0,
            difficulty: '',
            default_time: 20,
            default_items: 3,

            countDown: 30,
            dispatchNum: 10,
            countNum: 0,
            myDispatchNum: 0,
            goodsId: 1,
            countDownTimer: null,


            init: function () {
                Activity.initRegional();
                Activity.initButtons();
                a.showOrderResult();

                RenderParam.lmcid == "410092" && Activity.onBack410092()

                var nowTime= new Date().getTime();
                var startDate =RenderParam.endDt;
                startDate= startDate.replace(new RegExp("-","gm"),"/");
                var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
                if(nowTime>=endDateM){
                    LMActivity.showModal({
                        id: 'bg_game_over',
                        onDismissListener: function () {
                            LMEPG.Intent.back()
                        }
                    });
                }

                G('game_score_index').innerHTML = RenderParam.score;
            },

            onBack410092: function () {
                try {
                    HybirdCallBackInterface.setCallFunction(function (param) {
                        LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                        if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                            window.onBack();
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
                G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
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
                Activity.countDown = 30;
                Activity.dispatchNum = 10;
                Activity.myDispatchNum = 0;
                Activity.countNum = 0;
                Activity.goodsId = 1;
                Activity.playStatus = false;
                Activity.updateGoodsImg();
            },

            startGame: function () {
                if (a.hasLeftTime()) {
                    a.AjaxHandler.uploadPlayRecord(function () {
                        if (LMActivity.playStatus) {
                            return;
                        }
                        Activity.initGameData();
                        LMActivity.playStatus = true;
                        LMActivity.triggerModalButton = 'btn_start';
                        a.showModal({
                            id: 'big-turntable',
                            focusId: 'btn_dispatch',
                            onDismissListener: function () {
                                LMActivity.playStatus = false;
                                Activity.stopAllTimer();
                                G("activityTimes").innerHTML = (--r.leftTimes).toString();
                            }
                        });

                        G('count_down').innerHTML = Activity.countDown;
                        G('dispatch_num').innerHTML = Activity.dispatchNum;

                        Activity.countDownTimer = setInterval(function () {
                            Activity.countDown--
                            Activity.dispatchNum += 3;
                            G('count_down').innerHTML = Activity.countDown
                            G('dispatch_num').innerHTML = Activity.dispatchNum
                            Activity.countNum = 0;
                            if(Activity.countDown === 0){
                                Activity.stopAllTimer();
                                Activity.checkResult();
                            }
                        }, 1000);
                    }, function () {
                        LMEPG.UI.showToast('扣除游戏次数出错', 3);
                    });
                } else {
                    LMActivity.triggerModalButton = 'btn_start';
                    LMActivity.playStatus = false;
                    a.showGameStatus('btn_game_over_sure');
                }
            },

            exchangeCommon: function (select) {
                if (LMActivity.isCashingPrize())
                    return false;
                if (RenderParam.score < parseInt(G(select).innerHTML)) {
                    LMEPG.UI.showToast("营养液不足");
                    return false;
                }
                return true;
            },

            checkResult: function() {
                if (Activity.myDispatchNum >= 1) {
                    var score = Math.round(Activity.myDispatchNum / 10);
                    a.AjaxHandler.addScore(score);
                    G('my_dispatch_num').innerHTML = Activity.myDispatchNum;
                    G('score_result').innerHTML = score.toString();
                    LMActivity.triggerModalButton ='btn_start';
                    LMActivity.showModal({
                        id: 'game_result',
                        focusId: 'btn_result_submit',
                    });
                } else {
                    LMActivity.triggerModalButton ='btn_start';
                    LMActivity.showModal({
                        id: 'game_fail',
                        focusId: 'game_over_sure',
                    });
                }
            },

            dispatch: function () {
                if (Activity.countNum < 2) {
                    Activity.dispatchNum--;
                    Activity.myDispatchNum++;
                    Activity.countNum++;

                    Activity.updateGoodsImg();
                    if (++Activity.goodsId > 15) {
                        Activity.goodsId = 1;
                    }

                    G('btn_dispatch').src = a.makeImageUrl('btn_dispatch_down.png');
                    setTimeout(function () {
                        G('btn_dispatch').src = a.makeImageUrl('btn_dispatch_f.png');
                    }, 50);
                }
            },

            updateGoodsImg: function () {
                G('before_pack_goods_big').src = a.makeImageUrl('befor_pack_goods_' +
                    Activity.goodsNum(Activity.goodsId + 1) + '.png');
                G('before_pack_goods_small').src = a.makeImageUrl('befor_pack_goods_' +
                    Activity.goodsNum(Activity.goodsId + 2) + '.png');
                G('after_pack_goods').src = a.makeImageUrl('after_pack_goods_' +
                    Activity.goodsNum(Activity.goodsId) + '.png');
            },

            goodsNum: function (id) {
                if (id > 15) {
                    return id - 15;
                } else {
                    return id;
                }
            },

            stopAllTimer: function () {
                clearInterval(Activity.countDownTimer);
            },

            /**
             * 交换奖品
             * @param prizeIndex
             */
            exchangePrize: function (prizeIndex, src) {
                var prizeId = (r.exchangePrizeList.data)[prizeIndex].goods_id;
                LMActivity.AjaxHandler.exchangePrize(prizeId, function () {
                    LMActivity.exchangePrizeSuccess(prizeId);
                }, function (errCode) {
                    Activity.exchangePrizeFail(errCode);
                });
            },

            /**
             * 兑奖失败，或发生错误
             */
            exchangePrizeFail: function (errCode) {
                // 兑换失败
                if (errCode === -101) {
                    Activity.cashingFailed101()
                } else if (errCode === -102) {
                    LMActivity.cashingFailed102()
                } else {
                    LMEPG.UI.showToast("兑换出错" + errCode, 3);
                }
            },

            /**
             * 兑奖错误 -101
             */
            cashingFailed101: function () {
                $('exchange_fail').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_no_prize.png') + ')';
                LMActivity.showModal({
                    id: 'exchange_fail',
                    focusId: 'btn_exchange_submit_fail',
                    onDismissListener: function () {
                        LMActivity.Router.reload();
                    }
                });
            },

            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack();
                        break;
                    case 'btn_order_submit':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_activity_rule':
                        LMActivity.triggerModalButton = 'btn_activity_rule';
                        LMActivity.showModal({
                            id: 'activity_rule',
                            focusId: "btn_close_rule"
                        });
                        break;
                    case 'btn_start':
                        Activity.startGame();
                        break;
                    case 'btn_close_exchange':
                        // 关闭当前对话框
                        LMActivity.hideModal(LMActivity.shownModal);
                        break;
                    case 'exchange_prize_1':
                        if (Activity.exchangeCommon('exchange_point_1')) {
                            Activity.exchangePrize(0, r.imagePath + 'V' + r.lmcid + '/icon_gift_1.png');
                        }
                        break;
                    case 'exchange_prize_2':
                        if (Activity.exchangeCommon('exchange_point_2')) {
                            Activity.exchangePrize(1, r.imagePath + 'V' + r.lmcid + '/icon_gift_2.png');
                        }
                        break;
                    case 'exchange_prize_3':
                        if (Activity.exchangeCommon('exchange_point_3')) {
                            Activity.exchangePrize(2, r.imagePath + 'V' + r.lmcid + '/icon_gift_3.png');
                        }
                        break;
                    case 'btn_dispatch':
                        Activity.dispatch();
                        break;
                    case 'btn_result_submit':
                        LMActivity.Router.reload();
                        break;
                    case 'btn_exchange_submit_fail':
                    case 'btn_game_over_sure':
                    case 'game_over_sure':
                        LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        break;
                    case 'btn_exchange_prize':
                        LMActivity.triggerModalButton = 'btn_exchange_prize';
                        var focusId = LMActivity.renderExchangePrize(r.exchangePrizeList.data, btn.exchangePrizeButtons,
                            btn.exchangeFocusId, btn.moveType);
                        G('game_score').innerHTML = RenderParam.score;
                        LMActivity.showModal({
                            id: 'exchange_prize',
                            focusId: focusId,
                        });
                        break;
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },
            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },
            onInputFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(850, 475, btn.id, btn.backFocusId, true);
                }
            },
        };
        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: 'btn_winner_list',
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusDown: 'btn_start',
                nextFocusRight: 'btn_exchange_prize',
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
                id: 'btn_close_exchange',
                name: '按钮-兑换礼品-关闭',
                type: 'img',
                nextFocusDown: 'exchange_prize_1',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusDown: 'btn_start',
                nextFocusLeft: 'btn_exchange_prize',
                nextFocusRight: 'btn_back',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'exchange',
                click: a.eventHandler
            },{
                id: 'btn_exchange_prize',
                name: '按钮-兑换礼品',
                type: 'img',
                nextFocusRight: 'btn_winner_list',
                nextFocusLeft: 'btn_activity_rule',
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_exchange_gift.png'),
                focusImage: a.makeImageUrl('btn_exchange_gift_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_start',
                name: '开始游戏',
                type: 'img',
                nextFocusUp: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            },{
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusLeft: 'reset_tel',
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
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'reset_tel',
                name: '输入框-中奖名单-重置电话号码',
                type: 'div',
                nextFocusDown: 'btn_list_submit',
                backFocusId: 'btn_list_submit',
                focusChange: Activity.onInputFocus,
                click: Activity.eventHandler
            }, {
                id: 'btn_exchange_submit',
                name: '按钮-兑换成功-确定',
                type: 'img',
                nextFocusRight: 'btn_exchange_cancel',
                nextFocusLeft: 'exchange_tel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_exchange_cancel',
                name: '按钮-兑换成功-取消',
                type: 'img',
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
                id: 'exchange_prize_1',
                name: '按钮-兑换1',
                type: 'img',
                order: 0,
                nextFocusUp: 'btn_close_exchange',
                nextFocusRight: 'exchange_prize_2',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: Activity.eventHandler
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
                click: Activity.eventHandler
            }, {
                id: 'exchange_prize_3',
                name: '按钮-兑换3',
                type: 'img',
                order: 2,
                nextFocusUp: 'btn_close_exchange',
                nextFocusLeft: 'exchange_prize_2',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_dispatch',
                name: '派件',
                type: 'img',
                backgroundImage: '',
                focusImage: a.makeImageUrl('btn_dispatch_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_result_submit',
                name: '按钮-游戏结果-确认',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_exchange_submit_fail',
                name: '按钮-兑换失败-确认',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_game_over_sure',
                name: '按钮-次数已用完-确认',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'game_over_sure',
                name: '按钮-次数已用完-确认',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }
        ];

        w.Activity = Activity;
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094', '220095', '410092', '10220094'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);
}
