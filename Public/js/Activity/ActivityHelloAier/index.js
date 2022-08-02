(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 10,
            timerId: "",
            currentSkin: 1,
            wheelTimer:"",

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
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_prize_1.png',
                    "2": regionalImagePath + '/icon_prize_2.png',
                    "3": regionalImagePath + '/icon_prize_3.png',
                    "4": regionalImagePath + '/icon_prize_4.png',
                    "5": regionalImagePath + '/icon_prize_5.png'
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
                        e.Intent.back()
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
                        LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);

                        break;
                    case 'lipstick1':
                        LMActivity.triggerModalButton = 'lipstick1';
                        LMActivity.showModal({
                            id: 'big-turntable',
                            focusId: 'turntable',
                            onDismissListener: function () {
                                clearTimeout(Activity.wheelTimer);
                                Activity.playStatus = false;
                            }
                        });
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                        LMActivity.Router.reload();
                        break
                    case 'enroll':
                        LMActivity.triggerModalButton = 'enroll';
                        LMActivity.showModal({
                            id: 'enroll-modal',
                            focusId: 'enroll_tel'
                        });
                        LMActivity.AjaxHandler.getData('ActivityHelloAier20210716',function (data) {
                            if(data.val){
                                G('enroll_tel').innerHTML = data.val
                            }
                        })
                        break;
                    case 'enroll_cancel':
                    case 'turntable_back':
                        a.hideModal(a.shownModal);
                        break
                    case 'turntable':
                        if (!Activity.playStatus) {
                            Activity.game.start()
                        }
                        break
                    case 'btn_lottery_fail':
                        a.hideModal(a.shownModal);
                        LMActivity.triggerModalButton = 'lipstick1';
                        LMActivity.showModal({
                            id: 'big-turntable',
                            focusId: 'turntable',
                            onDismissListener:null
                        });
                        break
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('enroll', Activity.buttons, true);
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
            toEnroll:function () {
                var phone =  G('enroll_tel').innerHTML
                if(!/^[0-9]*$/.test(phone) ){
                    LMEPG.UI.showToast('请输入电话号码！')
                    return
                }

                if(phone.length < 11){
                    LMEPG.UI.showToast('请输入有效的电话')
                    return;
                }

                LMActivity.AjaxHandler.saveData('ActivityHelloAier20210716',G('enroll_tel').innerHTML,function () {
                    LMEPG.UI.showToast('报名成功！')
                    setTimeout(function () {
                        a.hideModal(a.shownModal);
                    },1000)

                },function () {
                    LMEPG.UI.showToast('不好意思，报名失败了！')
                })
            }
        };
        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: '',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: '',
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
                nextFocusLeft: 'lipstick1',
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
                nextFocusLeft: 'enroll',
                nextFocusUp: 'btn_winner_list',
                nextFocusDown: 'btn_winner_list',
                nextFocusRight:"btn_winner_list",
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'enroll',
                name: '报名',
                type: 'img',
                nextFocusLeft: 'btn_winner_list',
                nextFocusUp: 'btn_winner_list',
                nextFocusDown: 'btn_winner_list',
                nextFocusRight:"lipstick1",
                backgroundImage: a.makeImageUrl('btn_enroll.png'),
                focusImage: a.makeImageUrl('btn_enroll_f.png'),
                click: Activity.eventHandler
            },{
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
                nextFocusLeft: '',
                nextFocusRight: 'btn_lottery_cancel',
                nextFocusUp: 'lottery_tel',
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
                nextFocusUp: 'close-lottery',
                backFocusId: 'btn_lottery_submit',
                focusChange: Activity.onInputFocus
            }, {
                id: 'btn_lottery_fail',
                name: '按钮-抽奖失败-确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
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
                id: 'enroll_submit',
                name: '按钮-报名-确定',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'enroll_cancel',
                nextFocusUp: 'enroll_tel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.toEnroll
            },{
                id: 'enroll_cancel',
                name: '按钮-报名-取消',
                type: 'img',
                nextFocusLeft: 'enroll_submit',
                nextFocusRight: '',
                nextFocusUp: 'enroll_tel',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click:Activity.eventHandler
            },{
                id: 'enroll_tel',
                name: '输入框-报名-电话号码',
                type: 'div',
                nextFocusDown: 'enroll_submit',
                nextFocusUp: '',
                backFocusId: 'enroll_submit',
                focusChange: Activity.onInputFocus
            },{
                id: 'turntable',
                name: '转盘',
                type: 'img',
                nextFocusDown: '',
                nextFocusUp: 'turntable_back',
                backgroundImage: a.makeImageUrl('turntable.png'),
                focusImage: a.makeImageUrl('turntable_f.gif'),
                backFocusId: 'lipstick1',
                click:Activity.eventHandler
            },{
                id: 'turntable_back',
                name: '转盘退出',
                type: 'img',
                nextFocusDown: 'turntable',
                nextFocusUp: '',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click:Activity.eventHandler
            }
        ];

        Activity.game=(function () {
            var result = 0

            function roll() {
                var num = 1; // 起始
                var maxNum = 21; // 最大
                var slowC = 100; // 缓动变量
                var slowN = Math.PI / 10; // 缓动常量
                var rollN = 0; // 圈数
                var imageEl = G('turntable');
                var rollCircle = parseInt(Math.random()*(63-21+1)+21,10);
                rollCircle = getFillCircle(rollCircle);

                (function animate() {
                    slowC += 20;
                    rollN += 1
                    num === maxNum ? num = 1 : num += 1;

                    if(rollN === rollCircle){
                        setRollResult()
                        return
                    }
                    imageEl.src = a.makeImageUrl('wheel_'+num+'.png');
                    Activity.wheelTimer = setTimeout(animate, slowC * slowN);

                }());

            }
            
            function getFillCircle(rollCircle) {
                var restCircle = rollCircle % 21;
                if(result === 0){
                    if(restCircle < 13){
                        return rollCircle+(13-restCircle)
                    }else if(restCircle > 15){
                        return rollCircle-(restCircle-15)
                    }
                }else if(result === 1){
                    if(restCircle < 3){
                        return rollCircle+(3-restCircle)
                    }else if(restCircle > 5){
                        return rollCircle-(restCircle-5)
                    }
                }else if(result === 2){
                    if(restCircle < 20){
                        return rollCircle+(20-restCircle)
                    }else if(restCircle > 20 ){
                        return rollCircle
                    }
                }else if(result === 3){
                    if(restCircle < 7){
                        return rollCircle+(7-restCircle)
                    }else if(restCircle > 9){
                        return rollCircle-(restCircle-9)
                    }
                }else if(result === 4 ){
                    if(restCircle < 17){
                        return rollCircle+(17-restCircle)
                    }else if(restCircle > 19){
                        return rollCircle-(restCircle-19)
                    }
                }else if(result === 5){
                    if(restCircle < 10){
                        return rollCircle+(10-restCircle)
                    }else if(restCircle > 12){
                        return rollCircle-(restCircle-12)
                    }
                }

                return rollCircle
            }
            
            function setRollResult() {
                clearTimeout(Activity.wheelTimer);
                Activity.playStatus = false;
                if(result === 0 ){
                    setTimeout(function () {
                        LMActivity.showModal({
                            id: 'lottery_fail',
                            focusId: 'btn_lottery_fail',
                        })
                    },1500)
                }else {
                    setTimeout(function () {
                        LMActivity.lotteryPrizeId = result;
                        $('prize_image').src = LMActivity.prizeImage[result];
                        LMActivity.showModal({
                            id: 'lottery_success',
                            focusId: 'btn_lottery_submit',
                            onDismissListener: function () {
                                LMActivity.Router.reload();
                            }
                        })
                    },1500)
                }
            }

            return {
                start:function () {
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            Activity.playStatus = true;
                            r.leftTimes = r.leftTimes - 1;
                            G("left_times").innerHTML = r.leftTimes;
                            a.AjaxHandler.lottery(function (data) {
                                result = data.prize_idx || 0
                                roll()
                            },function () {
                                result = 0
                                roll()
                            })
                        }, function () {
                            result = 0
                            roll()
                        })
                    } else {
                        LMActivity.triggerModalButton = 'lipstick1';
                        a.showGameStatus('btn_game_over_sure');
                    }
                }
            }
        })();

        w.Activity = Activity;
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094','220095'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}