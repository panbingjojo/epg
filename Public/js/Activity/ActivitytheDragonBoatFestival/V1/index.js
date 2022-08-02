(function (w, e, r, a) {
    var Activity = {
        currentPosition: {},
        AyTsao1Index: -1,
        AyTsao2Index: -1,
        init: function () {
            if (G('default_link')) G('default_link').focus();
            a.showOrderResult();
            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
            a.setPageSize();
            Activity.currentPosition = coordinate.position19;
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            a.prizeImage = {
                "1": regionalImagePath + '/icon_prize_1.png',
                "2": regionalImagePath + '/icon_prize_2.png',
                "3": regionalImagePath + '/icon_prize_3.png'
            };
        },

        initGameData: function () {
            Activity.INTERVAL_TIME = 500;
            Activity.lastClickTime = Date.now();
            Activity.gameOverFlag = false;  //本局游戏结束标志
            Activity.hitsNum = 0;           //碰到次数
            Activity.gameCountDown;         //单局游戏倒计时
            Activity.towCountDown;          //2s倒计时
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        //改变粽子位置
        zongziFocusChange: function (dir) {
               switch (dir){
                   case "up":
                       var nextUpId = Activity.currentPosition.nextUpId;

                       if(nextUpId){
                           Activity.currentPosition = coordinate[nextUpId];
                           G("zongzi").style.left= coordinate[nextUpId].left + "px";
                           G("zongzi").style.top= coordinate[nextUpId].top+'px';
                       }
                       break;
                   case "left":
                       var nextLeftId = Activity.currentPosition.nextLeftId;
                       if(nextLeftId){
                           Activity.currentPosition = coordinate[nextLeftId];
                           G("zongzi").style.left= coordinate[nextLeftId].left + "px";
                           G("zongzi").style.top= coordinate[nextLeftId].top+'px';
                       }
                       break;
                   case "right":
                       var nextRightId = Activity.currentPosition.nextRightId;
                       if(nextRightId){
                           Activity.currentPosition = coordinate[nextRightId];
                           G("zongzi").style.left=coordinate[nextRightId].left + "px";
                           G("zongzi").style.top= coordinate[nextRightId].top+'px';
                       }
                       break;
                   case "down":
                       var nextDownId = Activity.currentPosition.nextDownId;
                       if(nextDownId){
                           Activity.currentPosition = coordinate[nextDownId];
                           G("zongzi").style.left= coordinate[nextDownId].left + "px";
                           G("zongzi").style.top= coordinate[nextDownId].top+'px';
                       }
                       break;
               }

            if ((G("zongzi").offsetLeft===G("AyTsao_1").offsetLeft&&G("zongzi").offsetTop===G("AyTsao_1").offsetTop)||(G("zongzi").offsetLeft===G("AyTsao_2").offsetLeft&&G("zongzi").offsetTop===G("AyTsao_2").offsetTop))
            {
                LMEPG.UI.showToast('艾草+1', 1);
                Activity.hitsNum++;
                G("AyTsaoTimes").innerHTML=Activity.hitsNum;
            }
        },
        getAyTsaoPos:function () {
            var randomIndex1 = parseInt(Math.random() * (18 - 1 + 1) + 1);
            var randomIndex2 = parseInt(Math.random() * (18 - 1 + 1) + 1);
            while (randomIndex1 == randomIndex2 && Activity.AyTsao1Index == randomIndex1 && Activity.AyTsao2Index == randomIndex2) {
                randomIndex1 = parseInt(Math.random() * (18 - 1 + 1) + 1);
                randomIndex2 = parseInt(Math.random() * (18 - 1 + 1) + 1);
            }
            Activity.AyTsao1Index = randomIndex1;
            Activity.AyTsao2Index = randomIndex2;
            var AyTsao1 ="position" +  Activity.AyTsao1Index;
            var AyTsao2 = "position" + Activity.AyTsao2Index;
            G("AyTsao_1").style.left=coordinate[AyTsao1].left+"px";
            G("AyTsao_1").style.top=coordinate[AyTsao1].top+"px";
            G("AyTsao_2").style.left=coordinate[AyTsao2].left+"px";
            G("AyTsao_2").style.top=coordinate[AyTsao2].top+"px";
        },

        checkGameResult: function () {
            if (Activity.hitsNum >= 5) {
                a.showModal({
                    id: 'game_success',
                    focusId: 'btn_lottery_sure',
                    onDismissListener: function () {
                        if (a.currentClickedId !== 'btn_lottery_sure') {
                            a.Router.reload();
                        }
                    }
                })
            } else {
                a.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail_sure',
                    onDismissListener: function () {
                        if(a.currentClickedId !== 'btn_game_fail_sure'){
                            a.Router.reload();
                        }
                    }
                })
            }
        },

        /**设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity');
        },
        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    G("game_countdown").innerHTML =RenderParam.gameTimeSingle;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            G("left_times").innerHTML = "剩余次数："+ (r.leftTimes - 1);
                            Activity.startGame();
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_order_submit':
                        LMActivity.Router.jumpBuyVip();
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_lottery_fail':
                case 'btn_lottery_canc':

                    Activity.defaultFocusId = "btn_start";
                    LMEPG.ButtonManager.init(Activity.defaultFocusId, Activity.buttons, "", true);
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    Activity.hitsNum = 0;
                    break;
            }
        },
        //活动总倒计时处理
        ActivityCountDown: function () {
            var gameTime = parseInt(G("game_countdown").innerHTML);
            if (gameTime <= 0) {
                Activity.gameOverFlag = true;
            } else {
                G("game_countdown").innerHTML = gameTime - 1;
            }
        },
        //艾草存在2秒倒计时
        SingleCountDown: function () {
            if (Activity.gameOverFlag) {
                // 如果游戏结束清除倒计时
                clearInterval(Activity.gameCountDown);
                clearInterval(Activity.towCountDown);
                //本局结束，重置游戏参数
                G("game_countdown").innerHTML = RenderParam.gameTimeSingle;
                Activity.gameOverFlag = false;
                Activity.checkGameResult();
            } else {
                Activity.getAyTsaoPos();
            }
        },
        startGame: function () {
            LMActivity.showModal({
                id: 'game_container',
                focusId: 'zongzi',
                onShowListener: function () {
                    Activity.gameCountDown = setInterval(Activity.ActivityCountDown, 1000);
                    Activity.towCountDown = setInterval(Activity.SingleCountDown, 2000);
                }
            });
            LMActivity.playStatus = true;
        }
    };
    if (RenderParam.platformType==="hd"){
        var coordinate = {
            "position1" : {
                top: "111",
                left: "85",
                nextLeftId:"",
                nextRightId:"position2",
                nextUpId:"",
                nextDownId:"position7"
            },  "position2" : {
                top: "111",
                left: "278",
                nextLeftId:"position1",
                nextRightId:"position3",
                nextUpId:"",
                nextDownId:"position8"
            },  "position3" : {
                top: "111",
                left: "471",
                nextLeftId:"position2",
                nextRightId:"position4",
                nextUpId:"",
                nextDownId:"position9"
            },  "position4" : {
                top: "111",
                left: "664",
                nextLeftId:"position3",
                nextRightId:"position5",
                nextUpId:"",
                nextDownId:"position10"
            },  "position5" : {
                top: "111",
                left: "857",
                nextLeftId:"position4",
                nextRightId:"position6",
                nextUpId:"",
                nextDownId:"position11"
            },  "position6" : {
                top: "111",
                left: "1050",
                nextLeftId:"position5",
                nextRightId:"",
                nextUpId:"",
                nextDownId:"position12"
            },  "position7" : {
                top: "222",
                left: "85",
                nextLeftId:"",
                nextRightId:"position8",
                nextUpId:"position1",
                nextDownId:"position13"
            },  "position8" : {
                top: "222",
                left: "278",
                nextLeftId:"position7",
                nextRightId:"position9",
                nextUpId:"position2",
                nextDownId:"position14"
            },  "position9" : {
                top: "222",
                left: "471",
                nextLeftId:"position8",
                nextRightId:"position10",
                nextUpId:"position3",
                nextDownId:"position19"
            },  "position10" : {
                top: "222",
                left: "664",
                nextLeftId:"position9",
                nextRightId:"position11",
                nextUpId:"position4",
                nextDownId:"position19"
            },  "position11" : {
                top: "222",
                left: "857",
                nextLeftId:"position10",
                nextRightId:"position12",
                nextUpId:"position5",
                nextDownId:"position15"
            },  "position12" : {
                top: "222",
                left: "1050",
                nextLeftId:"position11",
                nextRightId:"",
                nextUpId:"position6",
                nextDownId:"position16"
            },  "position13" : {
                top: "333",
                left: "85",
                nextLeftId:"",
                nextRightId:"position14",
                nextUpId:"position7",
                nextDownId:"position17"
            },  "position14" : {
                top: "333",
                left: "278",
                nextLeftId:"position13",
                nextRightId:"position19",
                nextUpId:"position8",
                nextDownId:""
            },  "position15" : {
                top: "333",
                left: "857",
                nextLeftId:"position19",
                nextRightId:"position16",
                nextUpId:"position11",
                nextDownId:""
            },  "position16" : {
                top: "333",
                left: "1050",
                nextLeftId:"position15",
                nextRightId:"",
                nextUpId:"position12",
                nextDownId:"position18"
            },
            "position17" : {
                top: "444",
                left: "85",
                nextLeftId:"",
                nextRightId:"position19",
                nextUpId:"position13",
                nextDownId:""
            } ,"position18" : {
                top: "444",
                left: "1050",
                nextLeftId:"position19",
                nextRightId:"",
                nextUpId:"position16",
                nextDownId:""
            },"position19" : {
                top: "381",
                left: "572",
                nextLeftId:"position14",
                nextRightId:"position15",
                nextUpId:"position9",
                nextDownId:""
            }
        };
    }else if(RenderParam.platformType==="sd"){
        var coordinate = {
            "position1" : {
                top: "179",
                left: "36",
                nextLeftId:"",
                nextRightId:"position2",
                nextUpId:"",
                nextDownId:"position7"
            },  "position2" : {
                top: "179",
                left: "137",
                nextLeftId:"position1",
                nextRightId:"position3",
                nextUpId:"",
                nextDownId:"position8"
            },  "position3" : {
                top: "179",
                left: "237",
                nextLeftId:"position2",
                nextRightId:"position4",
                nextUpId:"",
                nextDownId:"position9"
            },  "position4" : {
                top: "179",
                left: "338",
                nextLeftId:"position3",
                nextRightId:"position5",
                nextUpId:"",
                nextDownId:"position10"
            },  "position5" : {
                top: "179",
                left: "439",
                nextLeftId:"position4",
                nextRightId:"position6",
                nextUpId:"",
                nextDownId:"position11"
            },  "position6" : {
                top: "179",
                left: "540",
                nextLeftId:"position5",
                nextRightId:"",
                nextUpId:"",
                nextDownId:"position12"
            },  "position7" : {
                top: "237",
                left: "36",
                nextLeftId:"",
                nextRightId:"position8",
                nextUpId:"position1",
                nextDownId:"position13"
            },  "position8" : {
                top: "237",
                left: "137",
                nextLeftId:"position7",
                nextRightId:"position9",
                nextUpId:"position2",
                nextDownId:"position14"
            },  "position9" : {
                top: "237",
                left: "237",
                nextLeftId:"position8",
                nextRightId:"position10",
                nextUpId:"position3",
                nextDownId:"position19"
            },  "position10" : {
                top: "237",
                left: "338",
                nextLeftId:"position9",
                nextRightId:"position11",
                nextUpId:"position4",
                nextDownId:"position19"
            },  "position11" : {
                top: "237",
                left: "439",
                nextLeftId:"position10",
                nextRightId:"position12",
                nextUpId:"position5",
                nextDownId:"position15"
            },  "position12" : {
                top: "237",
                left: "540",
                nextLeftId:"position11",
                nextRightId:"",
                nextUpId:"position6",
                nextDownId:"position16"
            },  "position13" : {
                top: "295",
                left: "36",
                nextLeftId:"",
                nextRightId:"position14",
                nextUpId:"position7",
                nextDownId:"position17"
            },  "position14" : {
                top: "295",
                left: "137",
                nextLeftId:"position13",
                nextRightId:"position19",
                nextUpId:"position8",
                nextDownId:""
            },  "position15" : {
                top: "295",
                left: "439",
                nextLeftId:"position19",
                nextRightId:"position16",
                nextUpId:"position11",
                nextDownId:""
            },  "position16" : {
                top: "295",
                left: "540",
                nextLeftId:"position15",
                nextRightId:"",
                nextUpId:"position12",
                nextDownId:"position18"
            },
            "position17" : {
                top: "353",
                left: "36",
                nextLeftId:"",
                nextRightId:"position19",
                nextUpId:"position13",
                nextDownId:""
            } ,"position18" : {
                top: "353",
                left: "540",
                nextLeftId:"position19",
                nextRightId:"",
                nextUpId:"position16",
                nextDownId:""
            },"position19" : {
                top: "339",
                left: "287",
                nextLeftId:"position14",
                nextRightId:"position15",
                nextUpId:"position9",
                nextDownId:""
            }
        };
    }

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_activity_rule',
            nextFocusLeft: 'btn_start',
            nextFocusRight: '',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusLeft: 'btn_start',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_start',
            backgroundImage:  a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusRight: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            listType: 'exchange',
            click: Activity.eventHandler
        },{
            id: 'zongzi',
            name: '粽子小人',
            type: 'gif',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            beforeMoveChange: Activity.zongziFocusChange

        }, {
            id: 'btn_close_rule',
            name: '按钮-关闭活动规则',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
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
            nextFocusUp: RenderParam.platformType == 'sd' ? 'reset_tel' : '',
            nextFocusLeft: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            listType: 'lottery',
            nextFocusDown: 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_sure',
            name: '按钮-我要抽奖btn_lottery_canc',
            type: 'img',
            nextFocusRight: 'btn_lottery_canc',
            backgroundImage: a.makeImageUrl('open_sachet.png'),
            focusImage: a.makeImageUrl('open_sachet_f.png'),
            click: a.eventHandler,
        }, {
            id: 'btn_lottery_canc',
            name: '按钮-我要抽奖btn_lottery_canc',
            type: 'img',
            nextFocusLeft: 'btn_lottery_sure',
            backgroundImage: a.makeImageUrl('btn_back1.png'),
            focusImage: a.makeImageUrl('btn_back1_f.png'),
            click: Activity.eventHandler
        },
        {
            id: 'btn_lottery_exit',
            name: '按钮-取消抽奖',
            type: 'img',
            nextFocusLeft: 'btn_lottery_sure',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_submit',
            name: '按钮-中奖-确定',
            type: 'img',
            nextFocusUp: 'lottery_tel' ,
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp: RenderParam.platformType == 'sd' ? 'lottery_tel' : '',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler,
            //backFocusId: 'btn_start'
        }, {
            id: 'lottery_tel',
            name: '输入框-中奖-电话号码',
            type: 'div',
            nextFocusRight: 'btn_lottery_submit',
            backFocusId: 'btn_lottery_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-抽奖失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler,
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
            click: RenderParam.lmcid === '450092' ? Activity.eventHandler : a.eventHandler,
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);
var specialBackArea = ['220094','220095'];
function outBack() {
    if (RenderParam.lmcid == '220094'||RenderParam.lmcid == '220095') {
        var objSrc = LMActivity.Router.getCurrentPage();
        var objHome = LMEPG.Intent.createIntent('home');
        LMEPG.Intent.jump(objHome, objSrc);
    }
}
