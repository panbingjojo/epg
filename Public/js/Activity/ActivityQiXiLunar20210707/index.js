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

                RenderParam.carrierId == "410092" && Activity.onBack410092()

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
                                r.leftTimes = r.leftTimes - 1;
                                G("left_times").innerHTML = r.leftTimes;
                                LMActivity.triggerModalButton = btn.id;
                                LMActivity.showModal({
                                    id: 'game-area',
                                    focusId: 'game-basket',
                                    onDismissListener:function () {
                                        Activity.game.stopAllTimer()
                                    }
                                });
                                Activity.game.start()
                            })

                        }else {
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
                a.makeImageUrl('prop_love.png'),
                a.makeImageUrl('prop_ice_cream.png'),
                a.makeImageUrl('prop_jelly.png'),
                a.makeImageUrl('prop_flower.png'),
                a.makeImageUrl('prop_gift.png'),
                a.makeImageUrl('prop_mushroom.png'),
                a.makeImageUrl('prop_grass.png'),
                a.makeImageUrl('prop_candy.png'),
                a.makeImageUrl('prop_bomb.png')
            ]
            var basketLeft;
            var basketMinLeft;
            var basketMaxLeft;
            var basketMoveDistance;
            var positionList;
            var eleMaxTop;
            var eleList = [];

            var eleTimer = null;
            var countDownTimer = null;
            var moveTimerList = []
            var countDown;
            var score = 0;
            var topOffset;
            var judgeTop;
            var judgeLeft



            function initGameData() {
                countDown = 20;
                score = 0;
                moveTimerList = [];
                if(r.platformType === 'hd'){
                    basketMinLeft = 125;
                    basketMaxLeft = 900;
                    basketLeft = 460;
                    basketMoveDistance = 100;
                    eleMaxTop = 680
                    positionList = [280,380,480,580,680,780,880];
                    topOffset = 80;
                    judgeTop = 590;
                    judgeLeft = 120;
                }else {
                    basketLeft = 220;
                    basketMinLeft = 70;
                    basketMaxLeft = 430;
                    basketMoveDistance = 50;
                    eleMaxTop = 530;
                    positionList = [140,190,240,290,340,390,440,490];
                    topOffset = 60
                    judgeTop = 450;
                    judgeLeft = 70;
                }
            }
            
            function createGameEle() {
                var elePic = getRandom(0, propList.length - 1);
                var elePosition = getRandom(0, positionList.length - 1);
                var element = document.createElement('img');
                var gameContainer = document.getElementById('game-area');

                element.src = propList[elePic]
                element.style.left = positionList[elePosition] +'px'
                element.style.top = '30px'
                element.setAttribute('data-type',elePic)
                element.className = 'ele'
                gameContainer.appendChild(element);
                eleList.push(element)

                moveEle(element)

            }

            function moveEle(ele) {
                var moveTimer = setInterval(function () {
                    if(ele!==null){
                        var eleTop = ele.offsetTop + topOffset
                        if(eleTop>=eleMaxTop){
                            removeElement(ele)
                            clearInterval(moveTimer)
                        }else {
                            ele.style.top = eleTop + 'px';
                            var basket = G('game-basket')
                            for(var i=0;i<eleList.length;i++){
                                var dom = eleList[i]
                                var domLeft = dom.offsetLeft
                                var domTop = dom.offsetTop
                                //console.log(domTop,ele.style.top)

                                if(Math.abs(domLeft-basket.offsetLeft) === judgeLeft && domTop === judgeTop){
                                    var type = ele.getAttribute('data-type')
                                    if(type === '8'){
                                        stopAllTimer()
                                        LMActivity.triggerModalButton ='lipstick1';
                                        LMActivity.showModal({
                                            id: 'game-fail',
                                            focusId: 'game_over_sure',
                                        });
                                        return
                                    }

                                    removeElement(ele)
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
                },350)

                moveTimerList.push(moveTimer)
            }

            function checkResult() {
                if(score>=1){
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

            function stopAllTimer() {
                moveTimerList.forEach(function (e) {
                    clearInterval(e)
                })

                clearInterval(countDownTimer)
                clearInterval(eleTimer)

                var ele = document.body.getElementsByClassName('ele')
                for (var i = ele.length - 1; i >= 0; i--) {
                    ele[i].parentNode.removeChild(ele[i])
                }
            }

            function removeElement (_element) {
                var _parentElement = _element.parentNode;
                if (_parentElement) {
                    _parentElement.removeChild(_element);
                }
            }

            return{
                start:function () {
                    initGameData()
                    createGameEle()

                    eleTimer = setInterval(function () {
                        createGameEle()
                    },1000)

                    G('count-down-text').innerHTML = countDown
                    countDownTimer = setInterval(function () {
                        countDown--
                        G('count-down-text').innerHTML = countDown
                        if(countDown === 0){
                            stopAllTimer()
                            checkResult()
                        }

                    },1000)

                },

                stopAllTimer:stopAllTimer,

                basketMove:function (dir,btn) {
                    var basket = G(btn.id)
                    var basketLeft = parseInt(basket.offsetLeft);
                    switch (dir) {
                        case 'left':
                            if(basketLeft - basketMoveDistance >= basketMinLeft){
                                basket.style.left = (basketLeft - basketMoveDistance) + 'px';
                            }
                            break;
                        case 'right':
                            if(basketLeft + basketMoveDistance < basketMaxLeft){
                                basket.style.left = (basketLeft + basketMoveDistance) + 'px';
                            }
                            break;
                    }
                }
            }
        })();

        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: 'btn_activity_rule',
                nextFocusUp: '',
                nextFocusDown: 'lipstick1',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: '',
                nextFocusDown: 'btn_winner_list',
                nextFocusRight:'btn_back',
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
                nextFocusLeft: '',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'lipstick1',
                nextFocusRight:'btn_back',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: RenderParam.lmcid == '520095' ? Activity.eventHandler : a.eventHandler
            },{
                id: 'lipstick1',
                name: '点燃烟花',
                type: 'img',
                nextFocusLeft: 'btn_winner_list',
                nextFocusUp: 'btn_winner_list',
                nextFocusDown: '',
                nextFocusRight:"btn_back",
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusUp: '',
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
                nextFocusUp: '',
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
                nextFocusDown: 'btn_lottery_submit',
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
                beforeMoveChange:Activity.game.basketMove,
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
                backgroundImage: a.makeImageUrl('btn_abandon.png'),
                focusImage: a.makeImageUrl('btn_abandon_f.png'),
                click: Activity.eventHandler
            }
        ];



        w.Activity = Activity;
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094','220095','410092'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}