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
            fun : false,

            init: function () {
                if(RenderParam.lmcid === '000051'){
                    a.setPageSize()
                }
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                a.showOrderResult();

                RenderParam.carrierId == "410092" && Activity.onBack410092();

                var nowTime= new Date().getTime();
                var startDate =RenderParam.endDt;
                startDate= startDate.replace(new RegExp("-","gm"),"/");
                var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
                if(nowTime>=endDateM){ /*活动结束*/
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
                // debugger;
                switch (btn.id) {
                    case 'btn_back':  //返回按钮
                        LMActivity.innerBack();
                        break;
                    case 'btn_order_submit': //订购按钮
                    case 'btn_winner_list':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close':
                    case 'game_over_sure':
                        //LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        Activity.game.stopAllTimer();
                        // LMActivity.Router.reload();
                        break;
                    case 'btn_start':
                        if (a.hasLeftTime()){
                            Activity.game.stopAllTimer();
                            a.AjaxHandler.uploadPlayRecord(function (){
                                G("activityTimes").innerHTML = (--r.leftTimes).toString();
                                LMActivity.triggerModalButton = btn.id;
                                LMActivity.showModal({
                                    id: 'game-area',
                                    focusId: 'game-basket',
                                });
                                Activity.game.start()
                            });

                        }else {
                            LMActivity.triggerModalButton = 'btn_start';
                            LMActivity.triggerModalButton = btn.id;
                            a.showGameStatus('btn_game_over_sure');
                        }
                        break;
                    case 'do-lottery':
                        a.doLottery();
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'do-cancel':
                        LMActivity.Router.reload();
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
                    LMEPG.UI.keyboard.show(RenderParam.platformType==='hd'?235:215, RenderParam.platformType==='hd'?420:190, btn.id, btn.backFocusId, true);
                }

            },

        };

        Activity.game=(function () {
            var propList = a.makeImageUrl('bg_game_container3.png')
            var eleMinLeft;
            var eleList = [];
            var eleTimer = null;
            var game_timer_id = null;
            var countOutTimer = null;
            var moveTimerList = []
            var topOffset;
            var countDown = 30;
            var score = 0;
            var basketStep;
            var randomArr = [];
            var moveTimes = null;

            // var timeRandom;


            function initGameData() {
                countDown = 30;
                score = 0;
                moveTimerList = [];
                basketStep = 10;
                if(r.platformType === 'hd'){
                    eleMinLeft = -200 //设置的最小值为了让小女孩在屏幕之外消失
                    topOffset = 80; //小女孩每次移动的距离
                    randomArr = [0, 400, 800];
                    // timeRandom = getRandom(1, 25);
                }
            }

            function createGameEle() {
                // var propTimer = setInterval(function () {
                    var element = document.createElement('img');
                    var gameContainer = document.getElementById('game-area');

                    element.src = propList
                    element.style.left = 1260 + 'px'; //控制小人从最右边生成，1260隐藏生成点
                    element.style.top = '300px' //控制小人与顶部的高度
                    element.setAttribute('data-type',propList)
                    element.className = 'ele'
                    gameContainer.appendChild(element);
                    eleList.push(element)
                    // clearInterval(propTimer)
                    moveEle(element)
                // }, 1000)
                // moveTimerList.push(propTimer)

            }

            //定时器
            function moveEle(ele) {
                var moveTimer = setInterval(function () {
                    if(ele!==null){
                        var eleTop = ele.offsetLeft - topOffset;
                        if(eleTop<=eleMinLeft){
                            removeElement(ele)
                            clearInterval(moveTimer)

                        }else {
                            ele.style.left = eleTop + 'px';
                            // var basket = G('game-basket') + 260
                            for(var i = 0; i < eleList.length; i++){
                                var dom = eleList[i] //小女孩
                                var domLeft = dom.offsetLeft //小女孩的左边界
                                //对物体进行逻辑判断，当左边界值相等时，即basket的边界值+basket的宽度+半径<=小人的边界值，
                                // 判负，否则持续运行,我们不需要去判断小人的边框，我们固定小人的边框 所以只需要判断小女孩的左边距与像素之间的距离
                                if (domLeft >= 660 && domLeft <= 780){
                                    LMEPG.UI.showToast('危险',0.5)
                                }
                                else if(domLeft >= 40 && domLeft <= 520 && !Activity.fun) { //这里的判断条件660为小女孩的左边距+-120
                                    LMActivity.triggerModalButton = 'btn_start';
                                    LMActivity.showModal({
                                        id: 'game-fail',
                                        focusId: 'game_over_sure'
                                    });
                                    clearInterval(moveTimer);
                                    Activity.game.stopAllTimer();
                                    break;
                                }


                            }
                        }
                    }
                },400);

                moveTimerList.push(moveTimer);
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
            return{ //小女孩每隔四秒刷新一次
                start: function () {
                    initGameData()
                    createGameEle()
                    G('pumpkin').style.display = 'none';
                    eleTimer = setInterval(function () {

                        ran = getRandom(0, randomArr.length - 1);

                        while (ran === pro) {
                            ran = getRandom(0, randomArr.length - 1);
                        }

                        difference += randomArr[pro];

                        countOutTimer = setTimeout(function () {
                            createGameEle();
                        }, randomArr[ran] + difference);

                        pro = ran;
                    }, 5000);

                    //倒计时结束自动退出游戏
                    G('count-down-text').innerHTML = countDown;
                    game_timer_id = setInterval(function () {
                        countDown--
                        G('count-down-text').innerHTML = countDown
                        if(countDown === 0){
                            Activity.game.stopAllTimer()
                            LMActivity.triggerModalButton ='btn_start';  //在游戏结束之后的默认焦点
                            LMActivity.showModal({
                                id: 'game-success',
                                focusId: 'do-lottery',     //游戏结束界面的默认焦点位置
                            });
                        }

                    },1000)

                },


                stopAllTimer: function () {
                    moveTimerList.forEach(function (e) {
                        clearInterval(e)
                    })

                    clearInterval(game_timer_id)
                    clearInterval(eleTimer)
                    clearTimeout(countOutTimer)

                    var ele = document.body.getElementsByClassName('ele')
                    for (var i = ele.length - 1; i >= 0; i--) {
                        ele[i].parentNode.removeChild(ele[i])
                    }
                },

                pumpkinMove: function (direction) {
                    function change() {
                        G('game-basket').style.display = 'none';
                        G('pumpkin').style.display = 'block';
                        Activity.fun = !Activity.fun;
                        var moveTimes = setTimeout(function () {
                            G('pumpkin').style.display = 'none';
                            G('game-basket').style.display = 'block';
                            Activity.fun = !Activity.fun;
                            clearTimeout(moveTimes)
                        } ,4000);
                    }
                    if (direction === 'down' && !Activity.fun){
                        change();
                    }

                },
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
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            }, {
                id: 'btn_start',
                name: '开始冒险',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'game-basket',
                name: '图片-小人',
                type: 'img',
                // focusChange: onFocus,
                // click: keyDownPlay,
                beforeMoveChange: Activity.game.pumpkinMove,
                // moveChange: ""

            },{
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
            },

            {
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
                backgroundImage: a.makeImageUrl('btn_draw.png'),
                focusImage: a.makeImageUrl('btn_draw_f.png'),
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

var specialBackArea = ['220094', '220095', '410092','460092', '10220094'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}
