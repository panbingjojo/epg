(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 10,
            timerId: "",
            currentSkin: 1,
            clearTimer:"",

            init: function () {
                if(RenderParam.lmcid === '000051'){
                    a.setPageSize()
                }
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
            },

            onBack410092: function () {
                try {
                    HybirdCallBackInterface.setCallFunction(function (param) {
                        LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                        if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                            w.onBack()
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
                    "1": regionalImagePath + '/icon_prize_1.png',
                    "2": regionalImagePath + '/icon_prize_2.png',
                    "3": regionalImagePath + '/icon_prize_3.png'
                };
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
            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack()
                        break;
                    case 'btn_order_submit':
                    case 'btn_winner_list':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close_exchange':
                    case 'btn_close':
                    case 'game_over_sure':
                        //LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'lipstick1':
                        if (a.hasLeftTime()){
                            a.AjaxHandler.uploadPlayRecord(function (){
                                G("activityTimes").innerHTML = (r.leftTimes --).toString();
                                LMActivity.triggerModalButton = btn.id;
                                LMActivity.showModal({
                                    id: 'game-area',
                                    focusId: 'game-basket',
                                    onDismissListener:function () {
                                        Activity.game.stopAllTimer();
                                    }
                                });
                                Activity.game.start()
                            });
                        }else {
                            LMActivity.triggerModalButton = 'lipstick1';
                            LMActivity.triggerModalButton = btn.id;
                            a.showGameStatus('btn_game_over_sure');
                        }
                        break;
                    case 'do-lottery':
                        a.doLottery();
                        break
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'do-cancel':
                        LMActivity.Router.reload();
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('lipstick1', Activity.buttons, true);
            },
            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },
            onInputFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(RenderParam.platformType==='hd'?235:215, RenderParam.platformType==='hd'?420:190, btn.id, btn.backFocusId, true);
                }
            }
        };

        Activity.game=(function () {
            var propList = [
                a.makeImageUrl('musical_note_1.png'),
                a.makeImageUrl('musical_note_2.png'),
                a.makeImageUrl('musical_note_3.png'),
                a.makeImageUrl('musical_note_4.png'),
                a.makeImageUrl('musical_note_5.png'),
                a.makeImageUrl('musical_note_6.png'),
            ]
            var eleMinLeft;
            var eleList = [];
            //
            var eleTimer = null;
            var countDownTimer = null;
            var countOutTimer = null;
            var moveTimerList = []
            var topOffset;
            var countDown = 30;
            var score = 0;
            var enterState = false;
            var moveState = false;
            var countDownUp;
            var basketTop_D = 363;
            var basketTop_T = 163;
            var basketTop = 363;
            var basketStep;
            var randomArr = [];
            // var timeRandom;


            function initGameData() {
                countDown = 30;
                score = 0;
                moveTimerList = [];
                basketStep = 20;
                if(r.platformType === 'hd'){
                    eleMinLeft = -120
                    topOffset = 80;
                    randomArr = [0, 400, 800];
                    // timeRandom = getRandom(1, 25);
                }
            }

            function createGameEle() {
                var elePic = getRandom(0, propList.length - 1);
                var element = document.createElement('img');
                var gameContainer = document.getElementById('game-area');

                element.src = propList[elePic]
                element.style.left = 1260 + 'px';
                element.style.top = '100px'
                element.setAttribute('data-type',elePic)
                element.className = 'ele'
                gameContainer.appendChild(element);
                eleList.push(element)

                moveEle(element)

            }

            function moveEle(ele) {
                var moveTimer = setInterval(function () {
                    if(ele!==null){
                        var eleTop = ele.offsetLeft - topOffset;
                        if(eleTop<=eleMinLeft){
                            removeElement(ele)
                            clearInterval(moveTimer)
                        }else {
                            ele.style.left = eleTop + 'px';
                            var basket = G('game-basket')
                            for(var i = 0; i < eleList.length; i++){
                                var dom = eleList[i]
                                var domLeft = dom.offsetLeft

                                if(domLeft >= 460 && domLeft <= 540 && basket.offsetTop <= 244 && dom === ele) {
                                    removeElement(ele);
                                    ele = null
                                    eleList.splice(i, 1)
                                    score++
                                    LMEPG.UI.showToast('+1',0.5)
                                    clearInterval(moveTimer)
                                    break
                                }

                            }
                        }
                    }
                },400);

                moveTimerList.push(moveTimer)
            }

            function checkResult() {
                if(score>=1){
                    G('game_score').innerHTML = '+' + score;
                    LMActivity.triggerModalButton ='lipstick1';
                    LMActivity.showModal({
                        id: 'game-success',
                        focusId: 'do-lottery',
                    });
                }else {
                    LMActivity.triggerModalButton ='lipstick1';
                    LMActivity.showModal({
                        id: 'game-fail',
                        focusId: 'game_over_sure',
                    });
                }
            }

            function removeElement (_element) {
                var _parentElement = _element.parentNode;
                if (_parentElement) {
                    _parentElement.removeChild(_element);
                }
            }

            // var s = 10
            var pro = 0;
            var ran;
            var difference = 0;
            return{
                start: function () {
                    initGameData()
                    createGameEle()
                    eleTimer = setInterval(function () {
                        /*timeRandom = getRandom(10, 20);
                        while (Math.abs(timeRandom - s) >= 3){
                            timeRandom = getRandom(10, 20);
                        }

                        s = timeRandom
                        countOutTimer = setTimeout(function () {
                            createGameEle(timeRandom);
                        }, timeRandom * 100);*/

                        ran = getRandom(0, randomArr.length - 1);

                        while (ran === pro) {
                            ran = getRandom(0, randomArr.length - 1);
                        }

                        difference += randomArr[pro];

                        countOutTimer = setTimeout(function () {
                            createGameEle();
                        }, randomArr[ran] + difference);

                        pro = ran;
                    }, 1200);


                    G('count-down-text').innerHTML = countDown
                    countDownTimer = setInterval(function () {
                        countDown--
                        G('count-down-text').innerHTML = countDown
                        if(countDown === 0){
                            Activity.game.stopAllTimer()
                            checkResult()
                        }

                    },1000)

                },

                stopAllTimer: function () {
                    moveTimerList.forEach(function (e) {
                        clearInterval(e)
                    })

                    clearInterval(countDownTimer)
                    clearInterval(eleTimer)
                    clearInterval(countOutTimer)

                    var ele = document.body.getElementsByClassName('ele')
                    for (var i = ele.length - 1; i >= 0; i--) {
                        ele[i].parentNode.removeChild(ele[i])
                    }
                },

                basketMove: function () {
                    if (!enterState) {
                        enterState = true;
                        countDownUp = setInterval(function () {
                            if (basketTop >= basketTop_T && !moveState) {
                                basketTop -= basketStep;
                            }
                            if (basketTop === basketTop_T) {
                                moveState = true;
                            }
                            if (basketTop <= basketTop_D && moveState) {
                                basketTop += basketStep;
                            }
                            G('game-basket').style.top = basketTop + "px";
                            if (basketTop === basketTop_D) {
                                moveState = false;
                                enterState = false;
                                clearInterval(countDownUp);
                            }
                        }, 40);
                    }
                }
            }
        })();

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
            },{
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'lipstick1',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            },{
                id: 'lipstick1',
                name: '点燃烟花',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
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
                id: 'btn_close_exchange',
                name: '按钮-兑换页-返回',
                type: 'img',
                nextFocusDown: 'exchange_prize_1',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: Activity.eventHandler
            },  {
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
            },{
                id: 'game-basket',
                name: '图片-小人',
                type: 'img',
                click:Activity.game.basketMove,
            },{
                id: 'game_over_sure',
                name: '游戏-失败',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            },{
                id: 'do-lottery',
                name: '游戏-抽奖',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'do-cancel',
                backgroundImage: a.makeImageUrl('btn_lottery.png'),
                focusImage: a.makeImageUrl('btn_lottery_f.png'),
                click: Activity.eventHandler
            },{
                id: 'do-cancel',
                name: '游戏-放弃',
                type: 'img',
                nextFocusLeft: 'do-lottery',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
            }
        ];

        w.Activity = Activity;
        w.onBack = function () {
            if (LMActivity.shownModal) {
                if (G('game-area').style.display === 'block') {
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

var specialBackArea = ['220094','220095','410092'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}