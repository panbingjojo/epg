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
            default_steps: 1,
            exchangeLv: 0,
            flag: false,
            exchangeFocusId: '',

            init: function () {
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                a.showOrderResult();

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
            },

            initRegional: function () {
                // 活动规则图片片路径
                var regionalImagePath = r.imagePath;
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

            startAnswer: function () {
                if (true == LMActivity.playStatus) {
                    return;
                }
                LMActivity.playStatus = true;
                if (a.hasLeftTime()) {
                    a.AjaxHandler.uploadPlayRecord(function () {
                        G("left_times").innerHTML = (r.leftTimes - 1).toString();
                        a.showModal({
                            id: 'big-turntable',
                            focusId: 'bg_answer_option_A'
                        });

                        G("count_down").innerHTML = Activity.cutTime;
                        Activity.countDown = setInterval(function () {
                            if (Activity.cutTime === 1) {
                                G("count_down").innerHTML = (-- Activity.cutTime).toString();
                                Activity.referenceAnswer('');
                                if (Activity.count === Activity.default_items - 1) {
                                    clearInterval(Activity.countDown);
                                }
                            } else {
                                G("count_down").innerHTML = (-- Activity.cutTime).toString();
                            }
                            if (Activity.cutTime === 5) {
                                G('count_down').style.top = '44px';
                                G('count_down').style.fontSize = '65px';
                                G('count_down').style.color = '#e9cb25';
                            }
                            if (Activity.cutTime === Activity.default_time) {
                                G('count_down').style.top = '43px';
                                G('count_down').style.fontSize = '62px';
                                G('count_down').style.color = '#ffffff';
                            }
                        }, 1000);

                        Activity.myArrQus();
                        Activity.getQuestion();
                    }, function () {
                        LMEPG.UI.showToast('扣除游戏次数出错', 3);
                    });
                } else {
                    LMActivity.playStatus = false;
                    a.showGameStatus('btn_game_over_sure');
                }
            },

            referenceAnswer: function (option) {
                if (Activity.count < Activity.default_items) {
                    Activity.cutTime = Activity.default_time + 1;
                    if (option === questions.simple[Activity.pos[Activity.count]].answer) {
                        G('bg_answer').src = a.makeImageUrl('bg_answer_true.png');
                        G('answer_true_option').innerHTML = '';
                        Activity.score += Activity.default_steps;
                    } else {
                        G('bg_answer').src = a.makeImageUrl('bg_answer_false.png');
                        G('answer_true_option').innerHTML = questions.simple[Activity.pos[Activity.count]].answer;
                    }

                    if (option !== '') {
                        G('answer_state').style.display = 'block';
                    }

                    a.exFailTimer = setTimeout(function () {
                        // 隐藏模板
                        G('answer_state').style.display = 'none';
                        Activity.count++;
                        if (Activity.count < Activity.default_items) {
                            Activity.getQuestion();
                        }
                        if (Activity.count === Activity.default_items) {
                            G('answer_nums').innerHTML = (Activity.score / Activity.default_steps).toString();
                            G('answer_integral').innerHTML = Activity.score;

                            G('game_score').innerHTML = parseInt(RenderParam.score) + Activity.score;
                            RenderParam.score = parseInt(RenderParam.score) + Activity.score;

                            a.AjaxHandler.addScore(Activity.score);
                            Activity.flag = true;
                            /*LMActivity.playStatus = false;
                            LMActivity.triggerModalButton = 'btn_start';*/
                            a.showModal({
                                id: 'answer_result',
                                focusId: 'btn_exchange_immediately',
                            });
                        }
                    }, 1000);
                }
            },

            getQuestion: function () {
                G('question_content').innerHTML = '问题' + (Activity.count + 1) + '：' +
                    questions.simple[Activity.pos[Activity.count]].content;
                G('option_A').innerHTML = 'A.' + questions.simple[Activity.pos[Activity.count]].optionA;
                G('option_B').innerHTML = 'B.' + questions.simple[Activity.pos[Activity.count]].optionB;
                G('option_C').innerHTML = 'C.' + questions.simple[Activity.pos[Activity.count]].optionC;
                G('bg_answer_' + (Activity.count + 1)).src = a.makeImageUrl('bg_answer_f.png');
                LMEPG.BM.requestFocus('bg_answer_option_A');
                G('bg_answer_option_A').src = a.makeImageUrl('bg_answer_option.png');
                G('bg_answer_option_B').src = Activity.nullBGImg();
                G('bg_answer_option_C').src = Activity.nullBGImg();
            },

            myArrQus: function () {
                if (RenderParam.score < 21) {
                    Activity.myRandom(0, 30, Activity.default_items);
                    // Activity.difficulty = 'simple';
                } else if (RenderParam.score < 51) {
                    Activity.myRandom(31, 80, Activity.default_items);
                    // Activity.difficulty = 'medium';
                } else if (RenderParam.score > 50) {
                    Activity.myRandom(81, 100, Activity.default_items);
                    // Activity.difficulty = 'difficult';
                }
            },

            myRandom: function (x, y, n) {
                for (var i = 0; i < n; i++) {
                    var r = Math.round(Math.random() * (y - x) + x);
                    if (Activity.pos.indexOf(r) === -1) {
                        Activity.pos.push(r);
                    } else {
                        i --;
                    }
                }
            },

            exchangeCommon: function (select) {
                if (LMActivity.isCashingPrize())
                    return;
                if (RenderParam.score < parseInt(G(select).innerHTML)) {
                    LMEPG.UI.showToast("积分不足");
                    return;
                }
                LMActivity.triggerModalButton = 'btn_start';
                LMActivity.showModal({
                    id: 'bg_is_exchange',
                    focusId: 'btn_is_exchange_cancel',
                });
            },

            /**
             * 交换奖品
             * @param prizeIndex
             */
            exchangePrize: function (prizeIndex) {
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
                        e.Intent.back()
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
                        Activity.startAnswer();
                        break;
                    case 'bg_answer_option_A':
                        Activity.referenceAnswer('A');
                        break;
                    case 'bg_answer_option_B':
                        Activity.referenceAnswer('B');
                        break;
                    case 'bg_answer_option_C':
                        Activity.referenceAnswer('C');
                        break;
                    case 'exchange_prize_1':
                        Activity.exchangeFocusId = 'exchange_prize_1';
                        Activity.exchangeCommon('exchange_point_1');
                        LMActivity.exchangeLv = 0;
                        break;
                    case 'exchange_prize_2':
                        Activity.exchangeFocusId = 'exchange_prize_2';
                        Activity.exchangeCommon('exchange_point_2');
                        LMActivity.exchangeLv = 1;
                        break;
                    case 'exchange_prize_3':
                        Activity.exchangeFocusId = 'exchange_prize_3';
                        Activity.exchangeCommon('exchange_point_3');
                        LMActivity.exchangeLv = 2;
                        break;
                    case 'btn_is_exchange_submit':
                        Activity.exchangePrize(LMActivity.exchangeLv);
                        break;
                    case 'btn_is_exchange_cancel':
                        a.showModal({
                            id: 'exchange_prize',
                            focusId: Activity.exchangeFocusId
                        })
                        break;
                    case 'btn_exchange_submit_fail':
                    case 'btn_game_over_sure':
                        LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        break;
                    case 'btn_exchange_immediately':
                        LMActivity.triggerModalButton = 'btn_start';
                        var focusId = LMActivity.renderExchangePrize(r.exchangePrizeList.data, btn.exchangePrizeButtons,
                            btn.exchangeFocusId, btn.moveType);
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
            nullBGImg: function () {
                return " ";
            }
        };
        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: Activity.eventHandler
            },{
                id: 'btn_close_rule',
                name: '按钮-活动规则伪关闭',
                type: 'span',
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusDown: 'btn_exchange_prize',
                nextFocusUp: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'exchange',
                click: a.eventHandler
            },{
                id: 'btn_exchange_prize',
                name: '按钮-兑换礼品',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_exchange_gift.png'),
                focusImage: a.makeImageUrl('btn_exchange_gift_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_start',
                name: '我要答题',
                type: 'img',
                nextFocusUp: 'btn_exchange_prize',
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
                nextFocusRight: 'btn_list_submit',
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
                id: 'btn_is_exchange_submit',
                name: '按钮-兑换-确认',
                type: 'img',
                nextFocusRight: 'btn_is_exchange_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_is_exchange_cancel',
                name: '按钮-兑换-取消',
                type: 'img',
                nextFocusLeft: 'btn_is_exchange_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click:Activity.eventHandler
            }, {
                id: 'btn_exchange_immediately',
                name: '按钮-立即兑换',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_exchange_immediately.png'),
                focusImage: a.makeImageUrl('btn_exchange_immediately_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'bg_answer_option_A',
                name: '选项-A',
                type: 'img',
                nextFocusDown: 'bg_answer_option_B',
                backgroundImage: Activity.nullBGImg(),
                focusImage: a.makeImageUrl('bg_answer_option.png'),
                click: Activity.eventHandler
            }, {
                id: 'bg_answer_option_B',
                name: '选项-B',
                type: 'img',
                nextFocusUp: 'bg_answer_option_A',
                nextFocusDown: 'bg_answer_option_C',
                backgroundImage: Activity.nullBGImg(),
                focusImage: a.makeImageUrl('bg_answer_option.png'),
                click: Activity.eventHandler
            }, {
                id: 'bg_answer_option_C',
                name: '选项-C',
                type: 'img',
                nextFocusUp: 'bg_answer_option_B',
                backgroundImage: Activity.nullBGImg(),
                focusImage: a.makeImageUrl('bg_answer_option.png'),
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
                console.log("kug")
                if (G('big-turntable').style.display === 'block'){
                    return;
                }
                if (G('answer_result').style.display === 'block' ||
                    G('exchange_prize').style.display === 'block' && Activity.flag) {
                    LMActivity.Router.reload();
                }
                if (G('order_vip').style.display === 'block') {
                    LMEPG.BM.requestFocus('btn_start');
                }
                LMActivity.hideModal(LMActivity.shownModal);
            } else {
                LMActivity.innerBack()
            }
        }
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094','220095'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);
}
