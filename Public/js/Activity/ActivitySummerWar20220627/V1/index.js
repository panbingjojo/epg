(function (w, e, r, a) {
        var Activity = {
            score: 0,
            playStatus: false,
            countDown: 30,
            actionList: [
                LMActivity.makeImageUrl('capture1.png'),
                LMActivity.makeImageUrl('capture2.png'),
                LMActivity.makeImageUrl('capture3.png'),
                LMActivity.makeImageUrl('capture4.png'),
                LMActivity.makeImageUrl('capture5.png')
            ],
            action: 0,
            eleList: [],
            gameTimer: '',
            isCapture: false,
            isClick: false,

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
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                // 活动规则
                G('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                // 兑换奖品
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
            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack()
                        break;
                    case 'btn_order_submit':
                    case 'btn_order_preferential':
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
                    case 'btn_game_fail_sure':
                    case 'btn_game_sure':
                        //LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'btn_start':
                        a.triggerModalButton = btn.id;
                        if (a.hasLeftTime()) {
                            a.AjaxHandler.uploadPlayRecord(function () {
                                if (LMActivity.playStatus = 'false') {
                                    LMActivity.showModal({
                                        id: 'game_area',
                                        focusId: 'game_basket',
                                    });
                                    Activity.startCountdown();
                                    Activity.gameStart();
                                    Activity.butterflyGenerate();
                                }
                            }, function () {
                                LMEPG.UI.showToast('扣除游戏次数出错', 3);
                            });

                        } else {
                            a.showGameStatus('btn_game_over_sure');
                        }
                        break;
                    case 'do_lottery':
                        a.doLottery();
                        break
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'do_cancel':
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
                    LMEPG.UI.keyboard.show(RenderParam.platformType==='hd'?60:215, RenderParam.platformType==='hd'?420:190, btn.id, btn.backFocusId, true);
                }
            },
            startCountdown:function () {
                G('count_down_text').innerHTML = Activity.countDown + 's';
                var countDownTimer = setInterval(function () {
                    Activity.countDown--;
                    G('count_down_text').innerHTML = Activity.countDown + 's';
                    if(Activity.countDown === 0){
                        clearInterval(countDownTimer);
                        Activity.checkGameResult();
                    }
                },1000)
            },
            checkGameResult: function () {
                var score = Math.floor(Activity.score/3);
                if (score > 0) {
                    $('shot_count').innerHTML = String(score);
                    a.AjaxHandler.addScore(parseInt(score), function () {
                        a.showModal({
                            id: 'game_success',
                            focusId: 'btn_game_sure',
                            onDismissListener: function () {
                                a.Router.reload(); // 重新加载
                            }
                        });
                    }, function () {
                        LMEPG.UI.showToast('添加积分失败', 2);
                    });
                } else {
                    a.showModal({
                        id: 'game_fail',
                        focusId: 'btn_game_fail_sure',
                        onDismissListener: function () {
                            a.Router.reload();
                        }
                    })
                }
            },
            butterflyGenerate: function () {
                var element = document.createElement('img');
                var gameContainer = document.getElementById('game_area');

                element.src = LMActivity.makeImageUrl('butterfly1.gif');
                element.style.left = 0 + 'px';
                element.style.top = '150px';
                element.setAttribute('data-type','elePic');
                element.className = 'ele';
                gameContainer.appendChild(element);
                Activity.eleList.push(element);

                Activity.butterflyMove(element);
            },
            catchButterfly: function () {
                function isClick() {
                    Activity.isClick = !Activity.isClick;
                    var butterfly = setInterval(function () {
                        Activity.isCapture = true;
                        Activity.action++;
                        G('game_basket').src = Activity.actionList[Activity.action];
                        if (Activity.action > 4) {
                            Activity.action = 0;
                            Activity.isCapture = false;
                            Activity.isClick = !Activity.isClick;
                            clearInterval(butterfly)
                            G('game_basket').src = Activity.actionList[Activity.action];
                        }
                    },200);
                }
                if (!Activity.isClick){
                    isClick();
                }
            },
            removeElement: function (_element) {
                var _parentElement = _element.parentNode;
                if (_parentElement) {
                    _parentElement.removeChild(_element);
                }
            },
            gameStart: function () {
                Activity.gameTimer = setInterval(function () {
                    Activity.butterflyGenerate();
                },4000);
            },
            butterflyMove: function (ele) {
                var eleMaxLeft = 1200;
                var moveTimer = setInterval(function () {
                    if (ele!==null){
                        var eleLeft = ele.offsetLeft + 30;
                        if (eleLeft>=eleMaxLeft){
                            Activity.removeElement(ele);
                            clearInterval(moveTimer);
                        }else {
                            ele.style.left = eleLeft + 'px';
                            for(var i = 0; i < Activity.eleList.length; i++){
                                var dom = Activity.eleList[i];
                                var domLeft = dom.offsetLeft;
                                if(domLeft >= 460 && domLeft <= 750 && Activity.isCapture && dom === ele) {
                                    Activity.removeElement(ele);
                                    ele = null;
                                    Activity.eleList.splice(i, 1);
                                    Activity.score++;
                                    clearInterval(moveTimer);
                                    break;
                                }
                            }
                        }
                    }
                },500);
            }
        };

        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusDown: 'btn_activity_rule',
                nextFocusLeft: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_exchange_prize',
                name: '按钮-兑换礼品',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
                nextFocusDown: 'btn_start',
                nextFocusRight: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
                focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
                click: a.eventHandler,
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusDown: (RenderParam.lmcid==='520095'?'btn_order_preferential':'btn_start'),
                nextFocusUp: 'btn_back',
                nextFocusLeft: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_close_rule',
                name: '按钮-活动规则-关闭',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: a.eventHandler
            },{
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusDown: 'btn_exchange_prize',
                nextFocusRight: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'exchange',
                click: a.eventHandler
            },{
                id: 'btn_start',
                name: '开始',
                type: 'img',
                nextFocusUp: 'btn_exchange_prize',
                nextFocusLeft: 'btn_exchange_prize',
                nextFocusRight: (RenderParam.lmcid==='520095'?'btn_order_preferential':'btn_activity_rule'),
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
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
                id: 'btn_close_exchange',
                name: '按钮-兑换页-返回',
                type: 'img',
                nextFocusDown: 'exchange_prize_1',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: Activity.eventHandler
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
            },
            {
                id: 'btn_order_preferential',
                name: '按钮-订购享受五折优惠',
                type: 'img',
                nextFocusLeft: 'btn_start',
                nextFocusDown: 'btn_start',
                nextFocusUp: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_order_preferential.png'),
                focusImage: a.makeImageUrl('btn_order_preferential_f.png'),
                click: Activity.eventHandler
            },{
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
                id: 'game_basket',
                name: '小动物',
                type: 'img',
                click: Activity.catchButterfly,
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
                id: 'exchange_prize_1',
                name: '按钮-兑换1',
                type: 'img',
                order: 0,
                nextFocusUp: 'btn_close_exchange',
                nextFocusRight: 'exchange_prize_2',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler,
            },
            {
                id: 'exchange_prize_2',
                name: '按钮-兑换2',
                type: 'img',
                order: 1,
                nextFocusUp: 'btn_close_exchange',
                nextFocusLeft: 'exchange_prize_1',
                nextFocusRight: 'exchange_prize_3',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler,
            },
            {
                id: 'exchange_prize_3',
                name: '按钮-兑换3',
                type: 'img',
                order: 2,
                nextFocusUp: 'btn_close_exchange',
                nextFocusLeft: 'exchange_prize_2',
                nextFocusRight: 'exchange_prize_4',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler,
            },
            {
                id: 'exchange_prize_4',
                name: '按钮-兑换4',
                type: 'img',
                order: 3,
                nextFocusUp: 'btn_close_exchange',
                nextFocusLeft: 'exchange_prize_3',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler,
            },
            {
                id: 'btn_exchange_submit',
                name: '按钮-兑换成功-确定',
                type: 'img',
                nextFocusLeft: 'exchange_tel',
                nextFocusRight: 'btn_exchange_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler,
            },
            {
                id: 'btn_exchange_cancel',
                name: '按钮-兑换成功-取消',
                type: 'img',
                nextFocusLeft: 'btn_exchange_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler,
            },{
                id: 'btn_game_fail_sure',
                name: '按钮-游戏失败确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            },
            {
                id: 'btn_game_sure',
                name: '按钮-游戏成功确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            },
            {
                id: 'exchange_tel',
                name: '输入框-兑换-电话号码',
                type: 'div',
                nextFocusRight: 'btn_exchange_submit',
                backFocusId: 'btn_exchange_submit',
                focusChange: Activity.onInputFocus,
            },
        ];

        w.Activity = Activity;
        w.onBack = function () {
            if (LMActivity.shownModal) {
                if (G('game_area').style.display === 'block') {
                    LMActivity.Router.reload();
                }
                LMActivity.hideModal(LMActivity.shownModal);
            } else {
                LMActivity.innerBack();
            }
        }
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['460092','10220094','10220095'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}