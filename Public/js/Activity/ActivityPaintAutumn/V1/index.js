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
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';

            // console.log('url(' + regionalImagePath + '/bg_exchange_prize.png)');
        },

        initGameData:function () {
            // 可抽中材料
            a.prizeImage = {
                "1": r.imagePath + '/get_color_1.png',
                "2": r.imagePath + '/get_color_2.png',
                "3": r.imagePath + '/get_color_3.png',
                "4": r.imagePath + '/get_color_4.png',
            };

            Activity.initLotteryList();
        },

        initLotteryList:function(){
            var prizeArray = r.myLotteryRecord.list;
            for (i = 0; i < prizeArray.length; i++) {
                prizeName = prizeArray[i].prize_name;
                prizeCount = prizeArray[i].prize_count;
                if (prizeName == '枫红') {
                    $('gm_color_1').src = r.imagePath + "gm_color_1_f.png";
                } else if (prizeName == '果实') {
                    $('gm_color_2').src = r.imagePath + "gm_color_2_f.png";
                } else if (prizeName == '苍翠') {
                    $('gm_color_3').src = r.imagePath + "gm_color_3_f.png";
                } else if (prizeName == '天青') {
                    $('gm_color_4').src = r.imagePath + "gm_color_4_f.png";
                }
            }
            if(prizeArray.length >=4 ){
                $('bg_autumn').src = r.imagePath + "bg_autumn_light.png";
                $('gm_color_plate').src = r.imagePath + "gm_color_plate_f.png";
            }
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    if (a.hasLeftTime()) {
                        Activity.startBtn();
                    }else{
                        LMActivity.triggerModalButton = btn.id;
                        a.showGameStatus('btn_game_over_sure');
                    };
                    break;

                // case 'btn_net':
                //     if (Activity.gameRunning){
                //         // 1s 最多网两次
                //         if(Date.now() - Activity.lastClickTime > 500 ){
                //             Activity.catchcolor();
                //             Activity.lastClickTime = Date.now();
                //         }
                //     }
                //     break;

                case 'btn_back':
                    LMActivity.showModal({
                        id: 'tips_2',
                        focusId: 'btn_prev'
                    });
                    break;

                case 'btn_paradise_1':
                case 'btn_paradise_2':
                case 'btn_paradise_3':
                case 'btn_paradise_4':
                    LMActivity.prizeId = btn.order;
                    LMActivity.doLottery();
                    Activity.initLotteryList();
                    break;

                case 'btn_order_submit':
                    if (RenderParam.lmcid === '450092') {
                        Activity.jumpPlayVideo();
                    } else {
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                    }
                    break;
                case 'btn_exchange_prize':
                    // if(r.myLotteryRecord.list.length < 4 ){
                    //     LMEPG.UI.showToast("未到丰收季，请收获所有物品再兑奖！", 3);
                    // }else{
                        LMActivity.triggerModalButton = 'btn_start';
                        LMActivity.showModal({
                            id: 'exchange_prize',
                            focusId: 'exchange_prize_1'
                        });
                    // }
                    break;
                case 'exchange_prize_1':
                case 'exchange_prize_2':
                case 'exchange_prize_3':
                    if(r.myLotteryRecord.list.length < 4 ){
                        LMEPG.UI.showToast("未到丰收季，请收获所有物品再兑奖！", 3);
                    }else{
                        LMActivity.exchangePrize(btn.order);
                    }
                    break;
                case 'btn_order_cancel':
                    LMActivity.triggerModalButton = 'btn_start';
                case 'btn_lottery_fail':
                case 'btn_lottery_submit':
                case 'btn_exchange_back':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
            }
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        startBtn: function (){
            Hide('btn_start');
            a.AjaxHandler.uploadPlayRecord(function () {
                if (LMActivity.playStatus = 'false') {
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: "btn_paradise_1",
                        onDismissListener: function () {
                            // 清除游戏状态
                            Activity.gameRunning = false;
                            $('game_container').innerHTML = '';
                        }
                    });
                    // Activity.startGame();
                }
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
                'videoUrl': RenderParam.platformType == 'hd' ? '99100000012019122711240906847832' : '99100000012019122711381406853118',
                'sourceId': '38',
                'title':  RenderParam.platformType == '同是头痛发热,为何用药不同？',
                'type': 4,
                'userType': RenderParam.isVip != 1 ? 2 : 1,
                'freeSeconds': 0,
                'entryType': 1,
                'entryTypeName': 'epg-home',
                'unionCode': 'gylm406',
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
            click: a.eventHandler
        },  {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        },
        // {
        //     id: 'btn_close_rule',
        //     name: '按钮-活动规则-返回',
        //     type: 'img',
        //     backgroundImage: a.makeImageUrl('btn_back_1.png'),
        //     focusImage: a.makeImageUrl('btn_back_1_f.png'),
        //     click: a.eventHandler
        // },
        {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
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
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
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
            listType: 'exchange',
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
            id: 'btn_lottery_submit',
            name: '按钮-游戏成功确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_paradise_1',
            name: '图片-秋乐园-1',
            type: 'img',
            nextFocusRight: 'btn_paradise_2',
            nextFocusDown: 'btn_paradise_3',
            order: 1,
            backgroundImage: a.makeImageUrl('btn_paradise_1.png'),
            focusImage: a.makeImageUrl('btn_paradise_1_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_paradise_2',
            name: '图片-秋乐园-2',
            type: 'img',
            nextFocusDown: 'btn_paradise_4',
            nextFocusLeft: 'btn_paradise_1',
            order: 2,
            backgroundImage: a.makeImageUrl('btn_paradise_2.png'),
            focusImage: a.makeImageUrl('btn_paradise_2_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_paradise_3',
            name: '图片-秋乐园-3',
            type: 'img',
            nextFocusUp: 'btn_paradise_1',
            nextFocusRight: 'btn_paradise_4',
            order: 3,
            backgroundImage: a.makeImageUrl('btn_paradise_3.png'),
            focusImage: a.makeImageUrl('btn_paradise_3_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_paradise_4',
            name: '图片-秋乐园-4',
            type: 'img',
            nextFocusUp: 'btn_paradise_2',
            nextFocusLeft: 'btn_paradise_3',
            order: 4,
            backgroundImage: a.makeImageUrl('btn_paradise_4.png'),
            focusImage: a.makeImageUrl('btn_paradise_4_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_exchange_back',
            name: '按钮-兑换礼品-返回',
            type: 'img',
            nextFocusDown: 'exchange_prize_1',
            // nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_exchange_back.png'),
            focusImage: a.makeImageUrl('btn_exchange_back_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusUp: 'btn_exchange_back',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusUp: 'btn_exchange_back',
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusUp: 'btn_exchange_back',
            nextFocusLeft: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp: 'exchange_tel',
            nextFocusRight: 'btn_exchange_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit',
            nextFocusUp: 'exchange_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        },{
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
            click: Activity.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);