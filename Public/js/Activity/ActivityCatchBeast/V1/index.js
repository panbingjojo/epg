(function (w, e, r, a) {
    var Activity = {
        init: function () {
            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
            Activity.initDiffImg();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            //湖北电信有4中奖品
            if(r.lmcid == '320092'){
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_prize_1.png',
                    "2": regionalImagePath + '/icon_prize_2.png',
                    "3": regionalImagePath + '/icon_prize_3.png',
                    "4": regionalImagePath + '/icon_prize_4.png',
                    "5": regionalImagePath + '/icon_prize_5.png'
                };
            } else if(r.lmcid == '420092'){
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_prize_1.png',
                    "2": regionalImagePath + '/icon_prize_2.png',
                    "3": regionalImagePath + '/icon_prize_3.png',
                    "4": regionalImagePath + '/icon_prize_4.png'
                };
            } else {
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_prize_1.png',
                    "2": regionalImagePath + '/icon_prize_2.png',
                    "3": regionalImagePath + '/icon_prize_3.png'
                };
            }
        },

        initGameData: function () {
            Activity.INTERVAL_TIME = 500;
            Activity.lastClickTime = Date.now();
            if (r.platformType === 'hd') {

            } else {

            }

            Activity.gameOverFlag = false;  //本局游戏结束标志
            Activity.currenBurrow;          //当前年兽位置
            Activity.currenFirecracker;     //当前年兽位置
            Activity.hitsNum = 0;           //打中年兽次数
            Activity.gameCountDown;         //单局游戏倒计时
            Activity.towCountDown;          //2s倒计时
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        initDiffImg: function(){
            //广西电信VIP订购弹窗
            if(RenderParam.lmcid == '450092'){
                G('order_vip').src = a.makeImageUrl('bg_order_vip_gxdx.png');
                G('btn_winner_list').src = a.makeImageUrl('btn_winner_list_gxdx.png');
                G('btn_back').src = a.makeImageUrl('btn_back_gxdx.png');
                G('btn_activity_rule').src = a.makeImageUrl('btn_activity_rule_gxdx.png');
            }
            if(RenderParam.lmcid == '420092'){
               document.body.style.backgroundImage = 'url(' + r.imagePath + 'bg_home_hubei.jpg)';
               G('game_container').style.backgroundImage = 'url(' + r.imagePath + 'bg_game_container_hubei.jpg)';
            }

            if(RenderParam.lmcid == '320092'){
                G('btn_back').src = a.makeImageUrl('btn_back_jiangsudx.png');
                G('btn_winner_list').src = a.makeImageUrl('btn_winner_list_jiangsudx.png');
                G('btn_activity_rule').src = a.makeImageUrl('btn_activity_rule_jiangsudx.png');
                G('btn_start').src = a.makeImageUrl('btn_start_jiangsudx_f.png');
            }

            if(r.lmcid != '320092'){
                H('move_cursor');
                H('first_page_winner');
            }
        },
        //地洞焦点改变
        burrowFocusChange: function (btn, hasFocus) {
            if (hasFocus) {
                var firecrackerId = "icon_firecracker_" + btn.id.slice(11);
                G(firecrackerId).style.visibility = "visible";
                //判断是否打中年兽
                if (Activity.currenBurrow.id.slice(11) == btn.id.slice(11)) {
                    Activity.currenBurrow.src = RenderParam.imagePath + "beast_7.png";
                    Activity.hitsNum++;
                }
                Activity.currenFirecracker = G(firecrackerId);
            } else {
                var firecrackerId = "icon_firecracker_" + btn.id.slice(11);
                G(firecrackerId).style.visibility = "hidden";
            }
        },

        checkGameResult: function () {
            if (Activity.hitsNum >= 2) {
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

        /**
         * 跳转到视频播放页，播放结束时返回到首页
         * @param data 视频信息
         */
        jumpPlayVideo: function () {
            // 创建视频信息
            var videoInfo = {
                'videoUrl': RenderParam.platformType == 'hd' ? '99100000012019122711314806850706' : '99100000012019122711455806855998',
                'sourceId': '889',
                'title': '哪些生活习惯有助于孩子长高？',
                'type': 4,
                'userType': RenderParam.isVip != 1 ? 2 : 1,
                'freeSeconds': 0,
                'entryType': 1,
                'entryTypeName': 'epg-home',
                'unionCode': 'd5yy001',
                'showStatus': 1
            };

            LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo" : JSON.stringify(videoInfo)}, function () {
                var objCurrent = Activity.getCurrentPage(); //得到当前页
                var objPlayer = LMEPG.Intent.createIntent('player');
                objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

                LMEPG.Intent.jump(objPlayer, objCurrent);
            }, function () {
                LMEPG.UI.showToast("视频参数错误");
            });
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    G("game_countdown").innerHTML = RenderParam.gameTimeSingle;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            G("left_times").innerHTML = r.leftTimes - 1;
                            G("game_times_count").innerHTML = r.leftTimes - 1;
                            Activity.startGame();
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_order_submit':
                    if (RenderParam.lmcid === '450092') {
                        Activity.jumpPlayVideo();
                    } else {
                        LMActivity.Router.jumpBuyVip();
                    }
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_lottery_fail':
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
        //年兽存在2秒倒计时
        SingleCountDown: function () {
            if (Activity.gameOverFlag) {
                clearInterval(Activity.gameCountDown);
                clearInterval(Activity.towCountDown);
                Activity.currenBurrow.src = "";

                G("icon_firecracker_" + LMEPG.BM.getCurrentButton().id.slice(11)).style.visibility = "hidden";
                //本局结束，重置游戏参数
                G("game_countdown").innerHTML = RenderParam.gameTimeSingle;
                Activity.gameOverFlag = false;
                Activity.checkGameResult();

            } else {
                var burrowRandNum = parseInt(Math.random() * (6 - 1 + 1) + 1);
                var beastRandNum = parseInt(Math.random() * (6 - 1 + 1) + 1);
                Activity.currenBurrow.src = RenderParam.imagePath + "btn_burrow.png";
                Activity.currenBurrow = G("btn_burrow_" + burrowRandNum);
                Activity.currenBurrow.src = RenderParam.imagePath + "beast_" + beastRandNum + ".png";

                //年兽直接出现在爆竹下的情况
                if(parseInt(Activity.currenFirecracker.id.slice(17)) === burrowRandNum){
                    setTimeout("","200");
                    Activity.currenBurrow.src = RenderParam.imagePath + "beast_7.png";
                    Activity.hitsNum++;
                }
            }
        },
        startGame: function () {

            LMActivity.showModal({
                id: 'game_container',
                focusId: 'btn_burrow_2',
                onShowListener: function () {
                    Activity.gameCountDown = setInterval(Activity.ActivityCountDown, 1000);
                    Activity.towCountDown = setInterval(Activity.SingleCountDown, 2000);
                    var burrowRandNum = parseInt(Math.random() * (6 - 1 + 1) + 1);
                    var beastRandNum = parseInt(Math.random() * (6 - 1 + 1) + 1);
                    Activity.currenBurrow = G("btn_burrow_" + burrowRandNum);
                    Activity.currenBurrow.src = RenderParam.imagePath + "beast_" + beastRandNum + ".png";
                    Activity.defaultFocusId = "btn_burrow_2";
                    LMEPG.ButtonManager.init(Activity.defaultFocusId, Activity.buttons, "", true);
                    Activity.currenFirecracker = G("icon_firecracker_2");
                }
            });
            LMActivity.playStatus = true;
        }
    };//end Activity =

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_start',
            nextFocusRight: 'btn_activity_rule',
            backgroundImage: RenderParam.lmcid === '450092' ? a.makeImageUrl('btn_back_gxdx.png') :
                r.lmcid === '320092'? a.makeImageUrl('btn_back_jiangsudx.png'): a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusLeft: 'btn_back',
            nextFocusRight: 'btn_winner_list',
            backgroundImage:  RenderParam.lmcid === '450092' ? a.makeImageUrl('btn_activity_rule_gxdx.png') :
                r.lmcid === '320092'? a.makeImageUrl('btn_activity_rule_jiangsudx.png') : a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusLeft: 'btn_activity_rule',
            nextFocusRight: 'btn_start',
            backgroundImage:  RenderParam.lmcid === '450092' ? a.makeImageUrl('btn_winner_list_gxdx.png') :
                r.lmcid === '320092'? a.makeImageUrl('btn_winner_list_jiangsudx.png') : a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusLeft: 'btn_winner_list',
            nextFocusRight: 'btn_back',
            backgroundImage: r.lmcid === '320092'? a.makeImageUrl('btn_start_jiangsudx.png') : a.makeImageUrl('btn_start.png'),
            focusImage: r.lmcid === '320092'? a.makeImageUrl('btn_start_jiangsudx_f.png') : a.makeImageUrl('btn_start_f.png'),
            listType: 'exchange',
            click: Activity.eventHandler
        }, {
            id: 'btn_burrow_1',
            name: '按钮-地洞1',
            type: 'img',
            nextFocusLeft: 'btn_burrow_3',
            nextFocusRight: 'btn_burrow_2',
            nextFocusUp: '',
            nextFocusDown: 'btn_burrow_4',
            // backgroundImage: a.makeImageUrl(''),
            // focusImage: a.makeImageUrl(''),
            listType: 'exchange',
            click: Activity.eventHandler,
            focusChange: Activity.burrowFocusChange,
        }, {
            id: 'btn_burrow_2',
            name: '按钮-地洞2',
            type: 'img',
            nextFocusLeft: 'btn_burrow_1',
            nextFocusRight: 'btn_burrow_3',
            nextFocusUp: '',
            nextFocusDown: 'btn_burrow_5',
            // backgroundImage: a.makeImageUrl(''),
            // focusImage: a.makeImageUrl(''),
            listType: 'exchange',
            click: Activity.eventHandler,
            focusChange: Activity.burrowFocusChange,
        }, {
            id: 'btn_burrow_3',
            name: '按钮-地洞3',
            type: 'img',
            nextFocusLeft: 'btn_burrow_2',
            nextFocusRight: 'btn_burrow_1',
            nextFocusUp: '',
            nextFocusDown: 'btn_burrow_6',
            // backgroundImage: a.makeImageUrl(''),
            // focusImage: a.makeImageUrl(''),
            listType: 'exchange',
            click: Activity.eventHandler,
            focusChange: Activity.burrowFocusChange,
        }, {
            id: 'btn_burrow_4',
            name: '按钮-地洞4',
            type: 'img',
            nextFocusLeft: 'btn_burrow_6',
            nextFocusRight: 'btn_burrow_5',
            nextFocusUp: 'btn_burrow_1',
            nextFocusDown: '',
            // backgroundImage: a.makeImageUrl(''),
            // focusImage: a.makeImageUrl(''),
            listType: 'exchange',
            click: Activity.eventHandler,
            focusChange: Activity.burrowFocusChange,
        }, {
            id: 'btn_burrow_5',
            name: '按钮-地洞5',
            type: 'img',
            nextFocusLeft: 'btn_burrow_4',
            nextFocusRight: 'btn_burrow_6',
            nextFocusUp: 'btn_burrow_2',
            nextFocusDown: '',
            // backgroundImage: a.makeImageUrl(''),
            // focusImage: a.makeImageUrl(''),
            listType: 'exchange',
            click: Activity.eventHandler,
            focusChange: Activity.burrowFocusChange,
        }, {
            id: 'btn_burrow_6',
            name: '按钮-地洞6',
            type: 'img',
            nextFocusLeft: 'btn_burrow_5',
            nextFocusRight: 'btn_burrow_4',
            nextFocusUp: 'btn_burrow_3',
            nextFocusDown: '',
            // backgroundImage: a.makeImageUrl(''),
            // focusImage: a.makeImageUrl(''),
            listType: 'exchange',
            click: Activity.eventHandler,
            focusChange: Activity.burrowFocusChange,
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
            nextFocusUp: RenderParam.platformType == 'sd' ? 'reset_tel' : '',
            nextFocusLeft: RenderParam.platformType == 'hd' ? 'reset_tel' : '',
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
            name: '按钮-我要抽奖',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_lottery.png'),
            focusImage: a.makeImageUrl('btn_lottery_f.png'),
            click: a.eventHandler,
        }, {
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
            nextFocusLeft: RenderParam.platformType == 'hd' ? 'lottery_tel' : '',
            nextFocusUp: RenderParam.platformType == 'sd' ? 'lottery_tel' : '',
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