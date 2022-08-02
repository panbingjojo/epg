(function (w, e, r, a) {
        var Activity = {
            playStatus: false,
            questions: {
                poem: [{
                    content: '借问酒家何处有',
                    optionA: '牧童遥指杏花村',
                    optionB: '牧童遥指桃花村',
                    answer: 'A'
                }, {
                    content: '忽如一夜春风来',
                    optionA: '不如高卧且加餐',
                    optionB: '千树万树梨花开',
                    answer: 'B'
                }, {
                    content: '随风潜入夜',
                    optionA: '润物细无声',
                    optionB: '一岁一枯荣',
                    answer: 'A'
                }, {
                    content: '小荷才露尖尖角',
                    optionA: '万紫千红总是春',
                    optionB: '早有蜻蜓立上头',
                    answer: 'B'
                }, {
                    content: '好雨知时节',
                    optionA: '当春乃发生',
                    optionB: '风景旧曾谙',
                    answer: 'A'
                }, {
                    content: '春色满园关不住',
                    optionA: '无边光景一时新',
                    optionB: '一枝红杏出墙来',
                    answer: 'B'
                }, {
                    content: '不知细叶谁裁出',
                    optionA: '二月春风似剪刀',
                    optionB: '月移花影上栏杆',
                    answer: 'A'
                }, {
                    content: '天街小雨润如酥',
                    optionA: '绿柳才黄半未匀',
                    optionB: '草色遥看近却无',
                    answer: 'B'
                }, {
                    content: '小楼一夜听春雨',
                    optionA: '深巷明朝卖杏花',
                    optionB: '水面初平云脚低',
                    answer: 'A'
                }, {
                    content: '明月松间照',
                    optionA: '夜静春山空',
                    optionB: '清泉石上流',
                    answer: 'B'
                }]
            },
            temp: '',

            init: function () {
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                Activity.getQuestion();
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
                        if (a.hasLeftTime()) {
                            a.AjaxHandler.uploadPlayRecord(function () {
                                G("activityTimes").innerHTML = (--r.leftTimes).toString();
                                LMActivity.triggerModalButton = btn.id;
                                LMActivity.showModal({
                                    id: 'game_area',
                                    focusId: 'btn_answer_left',
                                });
                            });
                        } else {
                            LMActivity.triggerModalButton = 'btn_start';
                            LMActivity.triggerModalButton = btn.id;
                            a.showGameStatus('btn_game_over_sure');
                        }
                        break;
                    case 'btn_answer_left':
                        Activity.resultsJudgment('A');
                        break;
                    case 'btn_answer_right':
                        Activity.resultsJudgment('B');
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

            /**
             * 通过按钮焦点的选中来控制小男孩的朝向
             * */
            focusChange: function (btn) {
                switch (btn.id) {
                    case 'btn_answer_left':
                        G('figure').src = LMActivity.makeImageUrl('boy_left.png');
                        G('answer_A').style.color = '#a63008';
                        G('answer_B').style.color = '#fff';
                        break;
                    case 'btn_answer_right':
                        G('figure').src = LMActivity.makeImageUrl('boy_right.png');
                        G('answer_A').style.color = '#fff';
                        G('answer_B').style.color = '#a63008';
                        break;
                    case 'btn_game_back':
                        G('answer_A').style.color = '#fff';
                        G('answer_B').style.color = '#fff';
                        break;
                }
            },

            /**
             * 获取问题及答案
             * */
            getQuestion: function () {
                Activity.temp = Activity.questions.poem[Math.floor(Math.random() * Activity.questions.poem.length)];
                G('problem').innerHTML = Activity.temp.content;
                G('answer_A').innerHTML = Activity.temp.optionA;
                G('answer_B').innerHTML = Activity.temp.optionB;
            },

            /**
             * 判断诗句对应是否正确
             * */
            resultsJudgment: function (answer) {
                if (answer === Activity.temp.answer) {
                    LMActivity.triggerModalButton = 'btn_start';
                    LMActivity.showModal({
                        id: 'game_success',
                        focusId: 'do_lottery',
                    });
                } else {
                    a.showModal({
                        id: 'game_fail',
                        focusId: 'btn_game_fail_sure',
                        onDismissListener: function () {
                            a.Router.reload();
                        }
                    });
                }
            },
        };

        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusDown: 'btn_start',
                nextFocusLeft: 'btn_activity_rule',
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
                click: a.eventHandler
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
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'btn_start',
                nextFocusRight: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            }, {
                id: 'btn_start',
                name: '开始冒险',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
                nextFocusRight: 'btn_back',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_answer_left',
                name: '左边答案按钮',
                type: 'img',
                nextFocusRight: 'btn_answer_right',
                nextFocusUp: 'btn_game_back',
                backgroundImage: a.makeImageUrl('btn_answer.png'),
                focusImage: a.makeImageUrl('btn_answer_f.png'),
                direction: 'left',
                focusChange: Activity.focusChange,
                click: Activity.eventHandler
            }, {
                id: 'btn_answer_right',
                name: '右边答案按钮',
                type: 'img',
                nextFocusLeft: 'btn_answer_left',
                nextFocusUp: 'btn_game_back',
                backgroundImage: a.makeImageUrl('btn_answer.png'),
                focusImage: a.makeImageUrl('btn_answer_f.png'),
                direction: 'right',
                focusChange: Activity.focusChange,
                click: Activity.eventHandler
            }, {
                id: 'btn_game_back',
                name: '游戏页面返回按钮',
                type: 'img',
                nextFocusDown: 'btn_answer_right',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                focusChange: Activity.focusChange,
                click: Activity.eventHandler,
            }, {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusLeft: 'reset_tel',
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
                nextFocusLeft: 'lottery_tel',
                nextFocusRight: 'btn_lottery_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_lottery_cancel',
                name: '按钮-中奖-取消',
                type: 'img',
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
            }
        ];

        w.Activity = Activity;
        w.onBack = function () {
            if (LMActivity.shownModal) {
                if (G('game_area').style.display === 'block') {
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