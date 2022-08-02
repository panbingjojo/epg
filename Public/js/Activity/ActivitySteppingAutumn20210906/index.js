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

            countDown:"",
            count: 0,
            difficulty: '',
            default_time: 20,
            default_items: 3,


            init: function () {
                Activity.initRegional();
                Activity.initGameData();
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
                this.loadImg();

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
                LMActivity.playStatus = false;
            },

            startGame: function () {
                if (a.hasLeftTime()) {
                    a.AjaxHandler.uploadPlayRecord(function () {
                        G("activityTimes").innerHTML = (r.leftTimes --).toString();
                        if (LMActivity.playStatus) {
                            return;
                        }
                        LMActivity.playStatus = true;
                        LMActivity.triggerModalButton = 'btn_start';
                        a.showModal({
                            id: 'big-turntable',
                            focusId: 'scenic_spot_1',
                            onDismissListener: function () {
                                LMActivity.playStatus = false;
                            }
                        });
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
                    LMEPG.UI.showToast("心宜值不足");
                    return false;
                }
                return true;
            },

            addScoreCommon: function (score) {
                G('score_result').innerHTML = score;
                RenderParam.score = parseInt(RenderParam.score) + score;
                a.AjaxHandler.addScore(score);
                LMActivity.triggerModalButton = 'btn_start';
                a.showModal({
                    id: 'game_result',
                    focusId: 'btn_result_submit',
                    onDismissListener: function () {
                        LMActivity.Router.reload();
                    }
                });
            },

            loadImg:function() {
                var list =[]
                for (var i = 1; i < 6; i++) {
                    list[i] = a.makeImageUrl('scenic_spot_' + i + '_f.png');
                }
                for(var i = 0; i < list.length; i ++){
                    var img = new Image();
                    img.src = list[i];
                }
            },

            spotFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    if (RenderParam.platformType === 'hd') {
                        G(btn.id).style.cssText = 'top: ' + (G(btn.id).offsetTop - 25) + 'px;' +
                            'left: ' + (G(btn.id).offsetLeft - 12) + 'px;' +
                        'content: url('+ a.makeImageUrl(btn.id + '_f.png') + ');';
                    }
                    if (RenderParam.platformType === 'sd') {
                        G(btn.id).style.cssText = 'top: ' + (G(btn.id).offsetTop - 13) + 'px;' +
                            'left: ' + (G(btn.id).offsetLeft - 6) + 'px;' +
                            'content: url('+ a.makeImageUrl(btn.id + '_f.png') + ');';
                    }
                } else {
                    if (RenderParam.platformType === 'hd') {
                        G(btn.id).style.cssText = 'top: ' + (G(btn.id).offsetTop + 25) + 'px;' +
                            'left: ' + (G(btn.id).offsetLeft + 12) + 'px;' +
                        'content: url('+ a.makeImageUrl(btn.id + '.png') + ');';
                    }
                    if (RenderParam.platformType === 'sd') {
                        G(btn.id).style.cssText = 'top: ' + (G(btn.id).offsetTop + 13) + 'px;' +
                            'left: ' + (G(btn.id).offsetLeft + 6) + 'px;' +
                            'content: url('+ a.makeImageUrl(btn.id + '.png') + ');';
                    }
                }
            },

            /**
             * 交换奖品
             * @param prizeIndex
             */
            exchangePrize: function (prizeIndex, src) {
                var prizeId = (r.exchangePrizeList.data)[prizeIndex].goods_id;
                LMActivity.AjaxHandler.exchangePrize(prizeId, function () {
                    LMActivity.exchangePrizeSuccess(prizeId);
                    G('bg_exchange_gift').src = src;
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
                    case 'exchange_prize_1':
                        if (Activity.exchangeCommon('exchange_point_1'))
                            Activity.exchangePrize(0, r.imagePath + 'V' + r.lmcid + '/icon_gift_1.png');
                        break;
                    case 'exchange_prize_2':
                        if (Activity.exchangeCommon('exchange_point_2'))
                            Activity.exchangePrize(1, r.imagePath + 'V' + r.lmcid + '/icon_gift_2.png');
                        break;
                    case 'exchange_prize_3':
                        if (Activity.exchangeCommon('exchange_point_3'))
                            Activity.exchangePrize(2, r.imagePath + 'V' + r.lmcid + '/icon_gift_3.png');
                        break;
                    case 'scenic_spot_1':
                    case 'scenic_spot_5':
                        Activity.addScoreCommon(1);
                        break;
                    case 'scenic_spot_2':
                    case 'scenic_spot_4':
                        Activity.addScoreCommon(2);
                        break;
                    case 'scenic_spot_3':
                        Activity.addScoreCommon(3);
                        break;
                    case 'btn_result_submit':
                        G('game_score_index').innerHTML = RenderParam.score;
                    case 'btn_exchange_submit_fail':
                    case 'btn_game_over_sure':
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
                nextFocusLeft: 'btn_activity_rule',
                nextFocusDown: 'btn_exchange_prize',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusDown: 'btn_winner_list',
                nextFocusRight: 'btn_back',
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
                nextFocusDown: 'btn_start',
                nextFocusUp: 'btn_activity_rule',
                nextFocusRight: 'btn_exchange_prize',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'exchange',
                click: a.eventHandler
            },{
                id: 'btn_exchange_prize',
                name: '按钮-兑换礼品',
                type: 'img',
                nextFocusUp: 'btn_back',
                nextFocusLeft: 'btn_winner_list',
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_exchange_gift.png'),
                focusImage: a.makeImageUrl('btn_exchange_gift_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_start',
                name: '开始游戏',
                type: 'img',
                nextFocusUp: 'btn_exchange_prize',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
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
                nextFocusUp: 'reset_tel',
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
                nextFocusRight: 'exchange_prize_2',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'exchange_prize_2',
                name: '按钮-兑换2',
                type: 'img',
                order: 1,
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
                nextFocusLeft: 'exchange_prize_2',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'scenic_spot_1',
                name: '旅游景点-1',
                type: 'img',
                nextFocusRight: 'scenic_spot_2',
                backgroundImage: a.makeImageUrl('scenic_spot_1.png'),
                focusImage: a.makeImageUrl('scenic_spot_1_f.png'),
                focusChange: Activity.spotFocus,
                click: Activity.eventHandler
            }, {
                id: 'scenic_spot_2',
                name: '旅游景点-2',
                type: 'img',
                nextFocusRight: 'scenic_spot_3',
                nextFocusLeft: 'scenic_spot_1',
                backgroundImage: a.makeImageUrl('scenic_spot_2.png'),
                focusImage: a.makeImageUrl('scenic_spot_2_f.png'),
                focusChange: Activity.spotFocus,
                click: Activity.eventHandler
            }, {
                id: 'scenic_spot_3',
                name: '旅游景点-3',
                type: 'img',
                nextFocusRight: 'scenic_spot_4',
                nextFocusLeft: 'scenic_spot_2',
                backgroundImage: a.makeImageUrl('scenic_spot_3.png'),
                focusImage: a.makeImageUrl('scenic_spot_3_f.png'),
                focusChange: Activity.spotFocus,
                click: Activity.eventHandler
            }, {
                id: 'scenic_spot_4',
                name: '旅游景点-4',
                type: 'img',
                nextFocusRight: 'scenic_spot_5',
                nextFocusLeft: 'scenic_spot_3',
                backgroundImage: a.makeImageUrl('scenic_spot_4.png'),
                focusImage: a.makeImageUrl('scenic_spot_4_f.png'),
                focusChange: Activity.spotFocus,
                click: Activity.eventHandler
            }, {
                id: 'scenic_spot_5',
                name: '旅游景点-5',
                type: 'img',
                nextFocusLeft: 'scenic_spot_4',
                backgroundImage: a.makeImageUrl('scenic_spot_5.png'),
                focusImage: a.makeImageUrl('scenic_spot_5_f.png'),
                focusChange: Activity.spotFocus,
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
            }
        ];

        w.Activity = Activity;
        w.onBack = function () {
            if (LMActivity.shownModal) {
                if (G('big-turntable').style.display === 'block') {
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

var specialBackArea = ['220094', '220095', '410092', '10220094'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);
}
