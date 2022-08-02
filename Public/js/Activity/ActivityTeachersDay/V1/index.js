(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score:0,

        init: function () {
            // LMEPG.UI.logPanel.show('Activity.init start');
            //中国联通活动不再弹窗倒计时
            if (r.lmcid == '000051') {
                r.valueCountdown.showDialog = '0';
            }

            //宁夏广电EPG VIP订购弹窗
            if (r.lmcid == '640094') {
                G('order_vip').style.backgroundImage = "url(" + r.imagePath + "bg_order_vip_ningxia.png)";
                G('btn_order_submit').style.top = '430px';
                G('btn_order_submit').style.left = '555px';
                H('btn_order_cancel');
            }

            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
            a.showOrderResult();
            // LMEPG.UI.logPanel.show('Activity.init end');
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
        },

        initGameData:function () {
            if(r.platformType == 'hd') {
                //选择按钮位置
                Activity.selectPosition = [223, 482, 742, 1000];
            }else{
                //选择按钮位置
                Activity.selectPosition = [100, 240, 380, 520];
            }
            // 可抽中材料
            a.prizeImage = {
                "1": r.imagePath + 'V' + r.lmcid + '/prize_no_1.png',
                "2": r.imagePath + 'V' + r.lmcid + '/prize_no_2.png',
                "3": r.imagePath + 'V' + r.lmcid + '/prize_no_3.png',
            };
            Activity.initCard();
            Activity.lastClickTime = Date.now();
            LMActivity.playStatus = false;
        },

        initCard:function(){
            Activity.currPos = 0;
            for (i = 0; i < 4; i++) {
                $("card_" + (i + 1)).src = r.imagePath + '/card_back.png';
            }
            G("card_selected").style.left = Activity.selectPosition[0] + "px";
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    if (a.hasLeftTime()) {
                        // setTimeout("Activity.startBtn()", 1500);
                        Activity.startBtn();
                    }else{
                        LMActivity.triggerModalButton = btn.id;
                        a.showGameStatus('btn_game_over_sure');
                    };
                    break;

                case 'card_selected':
                    if(Date.now() - Activity.lastClickTime > 1000 ){
                        H('card_selected');
                        var prizeId = 1;
                        LMActivity.prizeId = prizeId;
                        LMActivity.doLotteryRound1("card_" + (Activity.currPos + 1), r.imagePath + '/card_face_cake.png', r.imagePath + '/card_face_thanks.png');
                        Activity.lastClickTime = Date.now();
                    }
                    break;

                case 'btn_lottery_submit_1':
                    if(Date.now() - Activity.lastClickTime > 1000 ){
                        H('game_container');
                        LMActivity.doLotteryRound2();
                        Activity.lastClickTime = Date.now();
                    }
                    break;

                case 'btn_order_submit':
                    if (RenderParam.lmcid === '640094') {
                        Activity.jumpPlayVideo();
                    } else {
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                    }
                    break;

                case 'btn_lottery_cancel_1':
                case 'btn_order_cancel':
                case 'btn_exchange_back':
                case 'btn_close':
                case 'btn_lottery_fail_1':
                case 'btn_lottery_fail':
                    LMActivity.triggerModalButton = 'btn_start';
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    LMActivity.playStatus = false;
                    break;
            }
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        startBtn: function (){
            S('card_selected');
            LMActivity.triggerModalButton = 'btn_start';
            Activity.initCard();
            // Hide('btn_start');
            if (LMActivity.playStatus) {
                return;
            }
            LMActivity.playStatus = true;
            a.AjaxHandler.uploadPlayRecord(function () {
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: "card_selected"
                    });
                    // Activity.startGame();
                    r.leftTimes = r.leftTimes - 1;
                    G("left_times").innerHTML = r.leftTimes;
            }, function () {
                LMEPG.UI.showToast('扣除游戏次数出错', 3);
            });
        },

        /**设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity');
        },

        /**
         * 跳转到视频播放页，播放结束时返回到首页
         * @param data 视频信息
         */
        jumpPlayVideo: function () {
            // 创建视频信息
            var videoInfo = {
                'videoUrl': RenderParam.platformType == 'hd' ? '03110300000000010000000000000392' : '03110300000000010000000000000386',
                'sourceId': '889',
                'title':  RenderParam.platformType == 'hd' ? '华佗为关羽刮骨疗毒？': '扁鹊给齐王治怪病',
                'type': 4,
                'userType': RenderParam.isVip != 1 ? 2 : 1,
                'freeSeconds': 0,
                'entryType': 1,
                'entryTypeName': 'epg-home',
                'unionCode': 'd5yy001',
                'showStatus': 1
            };

            LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
                var objCurrent = Activity.getCurrentPage(); //得到当前页
                var objPlayer = LMEPG.Intent.createIntent('player');
                objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

                LMEPG.Intent.jump(objPlayer, objCurrent);
            }, function () {
                LMEPG.UI.showToast("视频参数错误");
            });
        },

        btnCloseMove:function(direction){
            if(direction != 'up'){
                S('card_selected');
            }
        },

        selectCard: function (direction, btn) {
            if(direction == "left"){
                Activity.currPos = Activity.currPos <= 0 ? Activity.currPos : Activity.currPos - 1;
                G("card_selected").style.left = Activity.selectPosition[Activity.currPos] + "px";
            }else if (direction == "right") {
                Activity.currPos = Activity.currPos >= 3 ? Activity.currPos : Activity.currPos + 1;
                G("card_selected").style.left = Activity.selectPosition[Activity.currPos] + "px";
            }else if(direction == 'up'){
                H('card_selected');
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
            click: a.eventHandler
        },  {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusRight: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        },  {
            id: 'btn_close',
            name: '按钮-游戏返回',
            type: 'img',
            nextFocusDown: 'card_selected',
            nextFocusLeft: 'card_selected',
            nextFocusRight: 'card_selected',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.gif'),
            beforeMoveChange: Activity.btnCloseMove,
            click: Activity.eventHandler
        }, {
            id: 'card_selected',
            name: '按钮-选中卡片',
            type: 'img',
            nextFocusUp: 'btn_close',
            backgroundImage: a.makeImageUrl('card_selected.gif'),
            focusImage: a.makeImageUrl('card_selected.gif'),
            beforeMoveChange: Activity.selectCard,
            click: Activity.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_start',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            listType: 'exchange',
            click: Activity.eventHandler
        },{
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusLeft: 'btn_winner_list',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
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
            nextFocusUp: 'reset_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusDown: 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        },  {
            id: 'btn_lottery_submit_1',
            name: '按钮-游戏成功确定',
            type: 'img',
            nextFocusRight: 'btn_lottery_cancel_1',
            backgroundImage: a.makeImageUrl('btn_lottery_submit_1.png'),
            focusImage: a.makeImageUrl('btn_lottery_submit_1_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_lottery_cancel_1',
            name: '按钮-游戏成功取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit_1',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_lottery_fail_1',
            name: '按钮-第一轮未中奖确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-第二轮未中奖确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_submit',
            name: '按钮-第二轮中奖-确定',
            type: 'img',
            nextFocusUp: 'lottery_tel',
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp: 'lottery_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        },{
            id: 'lottery_tel',
            name: '输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_lottery_submit',
            backFocusId: 'btn_lottery_submit',
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
            click: Activity.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);