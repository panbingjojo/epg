(function (w, e, r, a) {
    var result = 0;
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
            firLotter: 0,
            result: 0,
            prize_idx: 0,
            imageFont: [
                a.makeImageUrl('font_1.png'),
                a.makeImageUrl('font_2.png'),
                a.makeImageUrl('font_3.png'),
                a.makeImageUrl('font_4.png')
            ],
            imageFont1: [
                a.makeImageUrl('font_1.gif'),
                a.makeImageUrl('font_2.gif'),
                a.makeImageUrl('font_3.gif'),
                a.makeImageUrl('font_4.gif'),
                0
            ],
            imageFont2: [
                a.makeImageUrl('font_2.gif'),
                a.makeImageUrl('font_3.gif'),
                a.makeImageUrl('font_4.gif'),
                a.makeImageUrl('font_1.gif'),
                1
            ],
            imageFont3: [
                a.makeImageUrl('font_3.gif'),
                a.makeImageUrl('font_4.gif'),
                a.makeImageUrl('font_1.gif'),
                a.makeImageUrl('font_2.gif'),
                2
            ],
            imageFont4: [
                a.makeImageUrl('font_4.gif'),
                a.makeImageUrl('font_1.gif'),
                a.makeImageUrl('font_2.gif'),
                a.makeImageUrl('font_3.gif'),
                3
            ],


            init: function () {
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                Activity.initGamePic()
                a.showOrderResult();

                RenderParam.lmcid == "410092" && Activity.onBack410092();

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
            initGamePic:function(){
                for(var i=1; i<=4; i++){
                    var img = new Image()
                    img.src= a.makeImageUrl('font_'+i+'.gif');
                }
            },


            initRegional: function () {
                // 活动规则图片片路径
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_gift_1.png',
                    "2": regionalImagePath + '/icon_gift_2.png',
                    "3": regionalImagePath + '/icon_gift_3.png',
                    "4": regionalImagePath + '/icon_gift_4.png'
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
                    case 'btn_back':  //返回按钮
                        LMActivity.innerBack();
                        break;
                    case 'btn_order_submit': //订购按钮
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_start':
                        if (Activity.playStatus == true){
                            return
                        }
                            Activity.start();
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close':
                    case 'game_over_sure':
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        Activity.game.stopAllTimer();
                        break;
                    case 'btn_activity_rule':
                        LMActivity.triggerModalButton = 'btn_activity_rule';
                        LMActivity.showModal({
                            id: 'activity_rule',
                        });
                        break;
                    case 'do-lottery':
                        a.doLottery();
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'do-cancel':
                    case 'btn_lottery_fail':
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
                    LMEPG.UI.keyboard.show(RenderParam.platformType==='hd'?1000:215, RenderParam.platformType==='hd'?420:190, btn.id, btn.backFocusId, true);
                }

            },
            start:function () {
                if (a.hasLeftTime()) {
                    a.AjaxHandler.uploadPlayRecord(function () {
                        Activity.playStatus = true;
                        r.leftTimes = r.leftTimes - 1;
                        G("activityTimes").innerHTML = r.leftTimes;
                //中奖（我们需要在中奖的时候通过动画给程序设计为’元旦快乐‘）
                        a.AjaxHandler.lottery(function (data) {
                            result = data.result || 0
                            Activity.prize_idx = data.prize_idx
                            Activity.roll(result)
                //未中奖（随意设置，不为‘元旦快乐’即可）
                        },function () {
                            result = 0
                            Activity.roll(result)
                        })
                //防止前端死掉
                    }, function () {
                        result = 0
                        Activity.roll(result)
                    })
                }
                else {
                    LMActivity.triggerModalButton = 'btn_start';
                    a.showGameStatus('btn_game_over_sure');
                }
            },

            flagArr : [],

            imageChange: function (times,ele,i,random,imageArray,result) {
                var randomImage1 = setInterval(function () {
                    G(ele).src = imageArray[i]
                    i++
                    if (i >= imageArray.length-1) {
                        i = 0;
                    }
                    times++
                    if (times == random){
                        clearInterval(randomImage1)
                        if (result == 1) {
                            G(ele).src = Activity.imageFont[imageArray[4]]
                            Activity.flagArr.push(true)

                        }else {
                            var random5 = getRandom(1,3)
                            G(ele).src = Activity.imageFont[random5]
                            Activity.flagArr.push(false)
                        }

                    }
                },900)
            },

            roll: function (result) {
                G('btn_start').src = a.makeImageUrl('btn_start.png')
                //调用接口 如果中奖，给一个动画过程，让他的结果变为元旦快乐，如果没有就不变

                var i1 = 0;
                var times1 = 1;
                var random1 = getRandom(5,8)
                var i2 = 0
                var times2 = 1;
                var random2 = getRandom(5,8)
                var i3 = 0
                var times3 = 1;
                var random3 = getRandom(5,8)
                var i4 = 0
                var times4 = 1;
                var random4 = getRandom(5,8)
                Activity.imageChange(times1,'font1',i1,random1,Activity.imageFont1,result)
                Activity.imageChange(times2,'font2',i2,random2,Activity.imageFont2,result)
                Activity.imageChange(times3,'font3',i3,random3,Activity.imageFont3,result)
                Activity.imageChange(times4,'font4',i4,random4,Activity.imageFont4,result)

                var ra = setInterval(function () {
                    if (Activity.flagArr.length == 4) {
                        clearInterval(ra)
                        Activity.playStatus = false
                        if (Activity.flagArr[0] == false) {
                            setTimeout(function () {
                                LMActivity.triggerModalButton = 'btn_start';
                                LMActivity.showModal({
                                    id: 'lottery_fail',
                                    focusId: 'btn_lottery_fail',
                                    onDismissListener: function () {
                                        LMActivity.Router.reload();
                                    }
                                })
                            },1500)
                        }else {
                            setTimeout(function () {
                                LMActivity.lotteryPrizeId = Activity.prize_idx;
                                LMActivity.triggerModalButton = 'btn_start';
                                $('prize_image').src = LMActivity.prizeImage[Activity.prize_idx];
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
                },500)

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
                nextFocusDown: 'btn_start',
                nextFocusLeft: 'btn_start',
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
            },{
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusDown: 'btn_start',
                nextFocusRight: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            },{
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
                id: 'btn_start',
                name: '开启幸运',
                type: 'img',
                nextFocusUp: 'btn_activity_rule',
                nextFocusRight: 'btn_activity_rule',
                nextFocusLeft: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl("btn_start1.gif"),
                click: Activity.eventHandler
            },{
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
            },
        ];

        w.Activity = Activity;
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094', '220095', '410092','460092', '10220094'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}
