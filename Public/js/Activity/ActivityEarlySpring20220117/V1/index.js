(function (w, e, r, a) {
        var Activity = {
            playStatus: false,
            score: 0,
            game_timer_id: '',
            action_time: '',
            pressButton: false,
            lock: false,
            actionList: [
                LMActivity.makeImageUrl('figure_up.png'),
                LMActivity.makeImageUrl('figure_down.png'),
                LMActivity.makeImageUrl('figure_left.png'),
                LMActivity.makeImageUrl('figure_right.png'),
            ],
            directionList: [
                LMActivity.makeImageUrl('up.png'),
                LMActivity.makeImageUrl('down.png'),
                LMActivity.makeImageUrl('left.png'),
                LMActivity.makeImageUrl('right.png'),
            ],
            completeList: [
                LMActivity.makeImageUrl('up_complete.png'),
                LMActivity.makeImageUrl('down_complete.png'),
                LMActivity.makeImageUrl('left_complete.png'),
                LMActivity.makeImageUrl('right_complete.png'),
            ],
            missList: [
                LMActivity.makeImageUrl('up_miss.png'),
                LMActivity.makeImageUrl('down_miss.png'),
                LMActivity.makeImageUrl('left_miss.png'),
                LMActivity.makeImageUrl('right_miss.png')
            ],
            eleList: [],
            element: '',
            actionIndex: '',

            init: function () {
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
                        //LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        // LMActivity.Router.reload();
                        break;
                    case 'btn_start':
                        if (a.hasLeftTime()) {
                            a.AjaxHandler.uploadPlayRecord(function () {
                                G("activityTimes").innerHTML = (--r.leftTimes).toString();
                                LMActivity.triggerModalButton = btn.id;
                                LMActivity.showModal({
                                    id: 'game_area',
                                    focusId: 'figure',
                                });
                                Activity.startGame()
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
                LMEPG.UI.keyboard.show(RenderParam.platformType === 'hd' ? 150 : 215, RenderParam.platformType === 'hd' ? 420 : 190, btn.id, btn.backFocusId, true);
            }

        },

        /**
         * 开始游戏
         * */
        startGame: function () {
            var countDown = 30
            Activity.dancing()
            Activity.actionChange()
            G('count_down_text').innerHTML = countDown;
            Activity.game_timer_id = setInterval(function () {
                countDown--
                G('count_down_text').innerHTML = countDown
                if (countDown === 0) {
                    Activity.stopAllTimer();
                    Activity.checkGameResult()
                }
            }, 1000)
        },

        /**
         * 定义女孩动作变化函数
         * */
        dancing: function () {
            var action = getRandom(0, Activity.actionList.length - 1)
            G('figure').src = Activity.actionList[action]
            Activity.createGameEle(action)
        },

        /**
         * 小人动作定时2s变化一次
         * */
        actionChange: function () {
            Activity.action_time = setInterval(function () {
                Activity.lock = false
                //   重置data-index的值，防止按下按键之后data-index的值保持不变
                Activity.actionIndex = Activity.element.getAttribute('data-index')
                if (!Activity.pressButton) {
                    Activity.element.src = Activity.missList[Activity.actionIndex]
                    Activity.eleList[0] = Activity.missList[Activity.actionIndex]
                }
                Activity.dancing()
                Activity.pressButton = false
            }, 2000)
        },

        /**
         * 判断按键是否与当前动作相符
         * */
        directionButton: function (dir) {
            //如果按下按键将变量置为true
            Activity.pressButton = true
            if (Activity.lock) {
                return
            }
            var dirEle = Activity.element.getAttribute('data-dir')
            Activity.actionIndex = Activity.element.getAttribute('data-index')
            if (dir === dirEle) {
                Activity.element.src = Activity.completeList[Activity.actionIndex]
                Activity.eleList[0] = Activity.completeList[Activity.actionIndex]
                Activity.score++
            } else {
                Activity.pressButton = false
                Activity.element.src = Activity.missList[Activity.actionIndex];
                Activity.eleList[0] = Activity.missList[Activity.actionIndex];
            }
            Activity.lock = true
        },

        /**
         * 返回按键相应的标识
         * */
        eleDirection: function (elePic) {
            switch (elePic) {
                case 0:
                    return 'up'
                case 1:
                    return 'down'
                case 2:
                    return 'left'
                case 3:
                    return 'right'
            }
        },

        /**
         * 通过人物的动作生成方向键
         * */
        createGameEle: function (ele) {
            Activity.element = document.createElement('img');
            var gameContainer = document.getElementById('game_area');

            Activity.element.src = Activity.directionList[ele]
            Activity.element.style.left = 1150 + 'px';
            Activity.element.style.top = '50px'
            Activity.element.setAttribute('data-dir', Activity.eleDirection(ele))
            Activity.element.setAttribute('data-index', ele)
            Activity.element.className = 'ele'
            gameContainer.appendChild(Activity.element);
            Activity.eleList.push(Activity.element)

            Activity.moveEle(Activity.element)
        },

        /**
         * 控制方向键的移动，每0.4秒移动一次，一次移动80像素
         * */
        moveEle: function (ele) {
            var topOffset = 80
            var eleMinLeft = 0
            var moveTimer = setInterval(function () {
                if (ele !== null) {
                    var eleLeft = ele.offsetLeft - topOffset;
                    if (eleLeft <= eleMinLeft) {
                        Activity.removeElement(ele)
                        clearInterval(moveTimer)
                    } else {
                        ele.style.left = eleLeft + 'px';
                    }
                }
            }, 400);
        },

        /**
         * 删除不符合要求的元素
         * */
        removeElement: function (_element) {
            var _parentElement = _element.parentNode;
            if (_parentElement) {
                _parentElement.removeChild(_element);
            }
        },

        /**
         * 停止所有定时器
         * */
        stopAllTimer: function () {
            clearInterval(Activity.game_timer_id)
            clearInterval(Activity.action_time)
        },

        /**
         * 检查时间停止后游戏状态
         **/
        checkGameResult: function () {
            if (Activity.score >= 5) {
                LMActivity.triggerModalButton = 'btn_start';//在游戏结束之后的默认焦点
                Activity.stopAllTimer()
                LMActivity.showModal({
                    id: 'game_success',
                    focusId: 'do_lottery',
                });
            } else {
                Activity.stopAllTimer()
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
                nextFocusLeft: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            }, {
                id: 'btn_start',
                name: '开始冒险',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
                nextFocusRight: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
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
                id: 'figure',
                name: '小人',
                type: 'img',
                beforeMoveChange: Activity.directionButton,
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
                    Activity.stopAllTimer()
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

var Page = {
    jumpTestPage: function () {
        var objCurrent = LMActivity.Router.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent('testEntrySet');
        objHomeTab.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    onKeyDown: function (code) {
        switch (code) {
            case KEY_3:
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                if (keys.length >= 4) {
                    if (keys[keys.length - 1] == KEY_3
                        && keys[keys.length - 2] == KEY_8
                        && keys[keys.length - 3] == KEY_9
                        && keys[keys.length - 4] == KEY_3) {
                        // 进入测试服
                        Page.jumpTestPage();
                    }
                }
                break;
        }
    }
};

LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_3: Page.onKeyDown
    }
);