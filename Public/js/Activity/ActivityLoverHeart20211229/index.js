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
                Activity.initButtons();

                a.showOrderResult();
                RenderParam.carrierId == "410092" && Activity.onBack410092();

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

            /**
             * 处理河南地区返回
             */
            onBack410092: function () {
                try {
                    HybirdCallBackInterface.setCallFunction(function (param) {
                        if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                            Activity.onBack();
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
                    "3": regionalImagePath + '/icon_prize_3.png',
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

            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack();
                        break;
                    case 'lipstick1':
                    case 'lipstick2':
                        LMActivity.triggerModalButton = btn.id;
                        if (a.hasLeftTime()) {
                            a.AjaxHandler.uploadPlayRecord(function (){
                                r.leftTimes = r.leftTimes - 1;
                                G("left_times").innerHTML = r.leftTimes;
                                LMActivity.playStatus = true;
                                a.doLottery();
                            })
                        } else if (RenderParam.isVip != 1) {
                            LMActivity.triggerModalButton = btn.id;
                            a.showGameStatus('btn_game_over_sure');
                        } else {
                            LMActivity.triggerModalButton = btn.id;
                            LMActivity.showModal({ //展示模板页面
                                id: 'tomorrow',
                                focusId: 'btn_tomorrow_fail'
                            });
                        }
                        break;
                    case 'btn_tomorrow_fail':
                        LMActivity.hideModal(LMActivity.shownModal);
                        break;
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('lipstick2', Activity.buttons, true);
            },

            onInputFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(RenderParam.platformType === 'hd' ? 370 : 215, RenderParam.platformType === 'hd' ? 300 : 190, btn.id, btn.backFocusId, true);
                }
            },
            canDown:function (dir) {
                if (G('card-content').src.lastIndexOf('.png') != -1 &&
                    G('blessing-content').src.lastIndexOf('.png') != -1 &&
                    dir === 'down') {
                    LMEPG.BM.requestFocus('btn_send');
                }
            },

            focusChange: function (btn, focus) {
                if (btn.id === 'lipstick1' && focus) {
                    G('bg_1').src = a.makeImageUrl('bg_home.png');
                }

                if (btn.id === 'lipstick2' && focus) {
                    G('bg_1').src = a.makeImageUrl('bg_home1.png');
                }
            }
        };


        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: 'lipstick2',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: 'lipstick2',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_winner_list',
                nextFocusRight:'',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_close_rule',
                name: '按钮-活动规则关闭',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusLeft: 'lipstick2',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'lipstick2',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                listType: 'lottery',
                click: a.eventHandler
            }, {
                id: 'lipstick1',
                name: '立即抽奖',
                type: 'img',
                nextFocusRight:"lipstick2",
                nextFocusUp:"btn_winner_list",
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                focusChange: Activity.focusChange,
                click: Activity.eventHandler
            }, {
                id: 'lipstick2',
                name: '立即抽奖',
                type: 'img',
                nextFocusLeft: "lipstick1",
                nextFocusRight:"btn_winner_list",
                nextFocusUp:"btn_winner_list",
                backgroundImage: a.makeImageUrl('btn_start1.png'),
                focusImage: a.makeImageUrl('btn_start1_f.png'),
                focusChange: Activity.focusChange,
                click: Activity.eventHandler
            }, {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusRight: 'btn_list_cancel',
                nextFocusLeft: 'reset_tel',
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
                backFocusId: 'btn_list_submit',
                nextFocusRight: 'btn_list_submit',
                focusChange: Activity.onInputFocus,
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
                nextFocusUp: 'lottery_tel',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_order_submit',
                name: '按钮-订购VIP',
                type: 'img',
                nextFocusRight: 'btn_order_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_order_cancel',
                name: '按钮-取消订购VIP',
                type: 'img',
                nextFocusLeft: 'btn_order_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'lottery_tel',
                name: '输入框-抽奖-电话号码',
                type: 'div',
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
                id: 'btn_tomorrow_fail',
                name: '按钮-次数用完-确定',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }
        ];

        w.Activity = Activity;

        w.onBack = function () {
            if (LMActivity.shownModal) {
                LMActivity.hideModal(LMActivity.shownModal);
            } else {
                LMActivity.innerBack();
            }
        }
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['10220094', '10220095', '410092'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);
}
