(function (w, e, r, a, u) {
    var Activity = {
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            Activity.initGameData();
            Activity.initDifferentData();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
            //积分数
            $('game_score_sum').innerHTML = RenderParam.score;

            H('position_left_1');
            H('position_left_2');
            H('position_left_3');
            H('position_right_1');
            H('position_right_2');
            H('position_right_3');
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
        },

        initGameData: function () {
            Activity.gameOverFlag = false;  //本局游戏结束标志
            Activity.gameCountDown;         //单局游戏倒计时
            Activity.roadSurfaceCnt = 1;    //路面动画计数器
            Activity.personCountDown;       //骑车计时器
            Activity.personCnt = 1;         //骑车计数器
            Activity.persation = 'left';     //小车位置
            Activity.gameScore = 0;          //游戏积分
            Activity.orderCancelStatus = false;

            Activity.roadIdx = 0;               //路障动画计数器
            Activity.position3Direction = ""    //路障位置3的方向
        },

        initDifferentData: function () {
            //联通平台不弹倒计时
            if (r.lmcid == '000051') {
                r.valueCountdown.showDialog = '0';
            }
            //广西电信VIP订购弹窗
            if (RenderParam.lmcid == '450092') {
                // G('order_vip').src = a.makeImageUrl('bg_order_vip_guangxi.png');
                G('order_vip').style.backgroundImage = "url(" + RenderParam.imagePath + "bg_order_vip_guangxi.png)"
            }
        },

        resultGame: function () {
            Activity.gameOverFlag = true;
            clearInterval(Activity.gameCountDown);
            clearInterval(Activity.personCountDown);
            clearInterval(Activity.roadblocDown);

            e.BM.init('btn_go', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
            S('btn_go');

            Activity.gameScore -= 3;
            if (Activity.gameScore > 0) {
                //本局结束，保存积分
                a.AjaxHandler.addScore(Activity.gameScore, function () {
                    //LMActivity.Router.reload();
                });
            }

            if (Activity.gameScore > 0) {
                G("single_game_score").innerHTML = Activity.gameScore;
                LMActivity.showModal({
                    id: 'game_success',
                    focusId: 'btn_game_success',
                });
            } else {
                LMActivity.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail',
                });
            }
            Activity.goldArrowNum = 0;
        },

        //活动总倒计时处理
        ActivityCountDown: function () {
            var gameTime = parseInt(G("game_countdown").innerHTML);
            if (gameTime <= 0) {
                //游戏结束，游戏结果处理
                Activity.resultGame();
            } else {
                G("game_countdown").innerHTML = gameTime - 1;
            }

            //遇到路障游戏结束
            if (Activity.persation == Activity.position3Direction) {
                Activity.resultGame();
            } else {
                Activity.gameScore++;
            }
        },

        readyGoGamePage: function () {
            H('car_left');
            H('car_right');
            LMActivity.showModal({
                id: 'activity_page',
                focusId: 'btn_go',
            });
            LMActivity.triggerModalButton = 'btn_start';
        },

        //行车动画
        personAnimation: function () {
            if (Activity.persation == 'left') {
                H('car_right');
                S('car_left');
            } else {
                H('car_left');
                S('car_right');
            }
            Activity.personCnt++;
            if (Activity.personCnt > 2)
                Activity.personCnt = 1;
        },

        //路面/路障动画
        RoadblocAnimation: function () {
            //路面动画
            G('road_surface').src = RenderParam.imagePath + 'road_surface_' + Activity.roadSurfaceCnt + '.png';
            Activity.roadSurfaceCnt++;
            if (Activity.roadSurfaceCnt > 3)
                Activity.roadSurfaceCnt = 1;

            //路障动画
            var hiddend = 'left';
            var Roadbloc = Activity.RoadblocList[Activity.roadIdx];
            for (var i = 0; i < 3; i++) {
                if(i == 0) {
                    hiddend = Roadbloc.position1.direction == 'left' ? 'right' : 'left';
                    G(Roadbloc.position1.id).src = Roadbloc.position1.img;
                    S(Roadbloc.position1.id);
                    if(Activity.roadIdx == 0){
                        Activity.roadIdx++;
                        H('position_' + hiddend + '_' + (i + 1));
                        return;
                    }
                }
                else if(i == 1) {
                    hiddend = Roadbloc.position2.direction == 'left' ? 'right' : 'left';
                    G(Roadbloc.position2.id).src = Roadbloc.position2.img;
                    S(Roadbloc.position2.id);
                    if(Activity.roadIdx == 1){
                        Activity.roadIdx++;
                        H('position_' + hiddend + '_' + (i + 1));
                        return;
                    }
                }
                else if(i == 2) {
                    hiddend = Roadbloc.position3.direction == 'left' ? 'right' : 'left';
                    G(Roadbloc.position3.id).src = Roadbloc.position3.img;
                    S(Roadbloc.position3.id);
                }
                H('position_' + hiddend + '_' + (i + 1));
            }

            Activity.position3Direction = Roadbloc.position3.direction;
            Activity.roadIdx++;
            if (Activity.roadIdx >= 8)
                Activity.roadIdx = 2;
        },

        startGame: function () {
            e.BM.init('btn_left', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
            H('btn_go');
            H('btn_game_close');
            Activity.personCountDown = setInterval(Activity.personAnimation, 500);
            Activity.gameCountDown = setInterval(Activity.ActivityCountDown, 1000);
            Activity.roadblocDown = setInterval(Activity.RoadblocAnimation, 1000);

            r.playStatus = true;    //当前正处于活动中
        },

        //游戏小车左右移动控制
        focusChangeFunction: function (btn, hasFocus) {
            if (hasFocus) {
                if (btn.id == 'btn_left') {
                    Activity.persation = 'left';
                } else if (btn.id == 'btn_right') {
                    Activity.persation = 'right';
                }
            }
        },

        renderExchangePrize: function (exchangePrizeList, exchangePrizeButtons, exchangeFocusId, moveType) {
            $('game_score').innerHTML = r.score; // 当前游戏积分
            $('exchange_point_1').innerHTML = exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_2').innerHTML = exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_3').innerHTML = exchangePrizeList[2].consume_list[0].consume_count;

            var focusId = 'exchange_prize_1';
            return focusId;
        },

        //兑换按钮焦点切换处理
        onFocusChange: function (btn, hasFocus) {
            if (hasFocus) {
                G(btn.id).src = a.makeImageUrl('btn_exchange_enable_f.png');
            } else {
                G(btn.id).src = a.makeImageUrl('btn_exchange_enable.png');
            }
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
            LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
                var objCurrent = Activity.getCurrentPage(); //得到当前页
                var objPlayer = LMEPG.Intent.createIntent('player');
                objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

                LMEPG.Intent.jump(objPlayer, objCurrent);
            }, function () {
                LMEPG.UI.showToast("视频参数错误");
            });
        },

        /**设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity');
        },

        jumpAlbum: function () {
            var objCurrent = Activity.getCurrentPage();
            var objAlbum = LMEPG.Intent.createIntent('album');
            objAlbum.setParam('albumName', RenderParam.albumName);
            objAlbum.setParam('inner', 1);
            LMEPG.Intent.jump(objAlbum, objCurrent);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_exchange_close':
                    LMActivity.hideModal(LMActivity.shownModal);
                    LMEPG.BM.requestFocus('btn_exchange_prize');
                    break;
                case 'btn_game_fail':
                case 'btn_game_success':
                    LMActivity.hideModal(LMActivity.shownModal);
                    LMActivity.Router.reload();
                    break;
                case 'btn_game_close':
                case 'btn_game_over_cancel':
                    LMActivity.hideModal(LMActivity.shownModal);
                    LMEPG.BM.requestFocus('btn_start');
                    break;
                case 'btn_go':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            LMActivity.showModal({
                                id: 'activity_page',
                                focusId: 'btn_go',
                            });
                            Activity.startGame();
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_start':
                    if (a.hasLeftTime()) {
                        Activity.readyGoGamePage();
                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_left':
                    Activity.persation = 'left';
                    break;
                case 'btn_right':
                    Activity.persation = 'right';
                    break;
                case 'btn_exchange_prize':
                    LMActivity.triggerModalButton = btn.id;
                    var focusId = Activity.renderExchangePrize(r.exchangePrizeList.data, btn.exchangePrizeButtons,
                        btn.exchangeFocusId, btn.moveType);
                    LMActivity.showModal({
                        id: 'exchange_prize',
                        focusId: focusId
                    });
                    break;
                case 'exchange_prize_1':
                case 'exchange_prize_2':
                case 'exchange_prize_3':
                    LMActivity.exchangePrize(btn.order);
                    break;
                case 'btn_order_cancel':
                    if (r.isVip === '0' && r.valueCountdown.showDialog === '1') {
                        LMActivity.showModal({
                            id: 'countdown',
                            onShowListener: function () {
                                Activity.orderCancelStatus = true;
                                LMActivity.startCountdown();
                            },
                            onDismissListener: function () {
                                if (LMActivity.countInterval !== null) {
                                    clearInterval(LMActivity.countInterval);
                                }
                            }
                        })
                        LMActivity.playStatus = true;
                    } else {
                        LMActivity.hideModal(LMActivity.shownModal);
                        LMEPG.BM.requestFocus('btn_start');
                    }
                    break;
                case 'btn_order_submit':
                    if (RenderParam.lmcid === '450092') {
                        Activity.jumpPlayVideo();
                    } else {
                        LMActivity.Router.jumpBuyVip();
                    }
                    break;
                case 'btn_game_over_sure':  //跳转专辑
                case 'btn_game_fail_sure':
                    Activity.jumpAlbum();
                    break;
            }
        }
    };

    Activity.exchangePrizeButtons = [
        {
            id: 'exchange_prize_1',
            name: '按钮-兑换一等奖',
            type: 'img',
            nextFocusLeft: 'exchange_prize_3',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            focusChange: Activity.onFocusChange,
            order: 0,
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换二等奖',
            type: 'img',
            nextFocusRight: 'exchange_prize_3',
            nextFocusLeft: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            focusChange: Activity.onFocusChange,
            order: 1,
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换三等奖',
            type: 'img',
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            focusChange: Activity.onFocusChange,
            order: 2,
            click: Activity.eventHandler
        }
    ];

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
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换奖品',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusUp: 'btn_winner_list',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_prize_exchange.png'),
            focusImage: a.makeImageUrl('btn_prize_exchange_f.png'),
            exchangePrizeButtons: Activity.exchangePrizeButtons,
            exchangeFocusId: '',
            moveType: 1,
            click: Activity.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_exchange_prize',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            listType: 'exchange',
            click: Activity.eventHandler
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
            nextFocusUp:  'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusLeft: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusRight: r.platformType === 'hd' ? 'btn_list_submit' : '',
            nextFocusDown: r.platformType === 'hd' ? '' : 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_game_success',
            name: '按钮-游戏成功',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_fail',
            name: '按钮-游戏失败-不想知道',
            type: 'img',
            nextFocusRight: 'btn_game_fail_sure',
            backgroundImage: a.makeImageUrl('btn_game_over_cancel.png'),
            focusImage: a.makeImageUrl('btn_game_over_cancel_f.png'),
            click: Activity.eventHandler
        },{
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败-想知道',
            type: 'img',
            nextFocusLeft: 'btn_game_fail',
            backgroundImage: a.makeImageUrl('btn_game_over_sure.png'),
            focusImage: a.makeImageUrl('btn_game_over_sure_f.png'),
            click: Activity.eventHandler
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
        }, {
            id: 'exchange_tel',
            name: '输入框-兑换成功-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit',
            backFocusId: 'btn_exchange_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusRight: 'btn_exchange_cancel',
            nextFocusUp: 'exchange_tel',
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
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-机会用完-确认',
            type: 'img',
            nextFocusRight: 'btn_game_over_cancel',
            backgroundImage: a.makeImageUrl('btn_game_over_sure.png'),
            focusImage: a.makeImageUrl('btn_game_over_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_over_cancel',
            name: '按钮-机会用完-取消',
            type: 'img',
            nextFocusLeft: 'btn_game_over_sure',
            backgroundImage: a.makeImageUrl('btn_game_over_cancel.png'),
            focusImage: a.makeImageUrl('btn_game_over_cancel_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_single_game_over',
            name: '按钮-活动结束-关闭',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_close',
            name: '按钮-活动页关闭',
            type: 'img',
            nextFocusDown: 'btn_go',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_go',
            name: '按钮-活动开始',
            type: 'img',
            nextFocusUp: 'btn_game_close',
            backgroundImage: a.makeImageUrl('btn_go.png'),
            focusImage: a.makeImageUrl('btn_go_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_left',
            name: '按钮-活动页左按钮',
            type: 'img',
            nextFocusRight: 'btn_right',
            backgroundImage: a.makeImageUrl('btn_left.png'),
            focusImage: a.makeImageUrl('btn_left_f.png'),
            click: Activity.eventHandler,
            focusChange: Activity.focusChangeFunction,
        }, {
            id: 'btn_right',
            name: '按钮-活动页右按钮',
            type: 'img',
            nextFocusLeft: 'btn_left',
            backgroundImage: a.makeImageUrl('btn_right.png'),
            focusImage: a.makeImageUrl('btn_right_f.png'),
            click: Activity.eventHandler,
            focusChange: Activity.focusChangeFunction,
        }

    ];

    Activity.RoadblocList = [
        {
            index: 1,
            position1:{id: 'position_right_1',direction: 'right', img: RenderParam.imagePath + 'roadblock_1_1.png'},
            position2:{id: 'position_left_2',direction: 'left', img: ''},
            position3:{id: 'position_right_3',direction: 'right', img: ''},
        },{
            index: 2,
            position1:{id: 'position_left_1',direction: 'left', img: RenderParam.imagePath + 'roadblock_2_1.png'},
            position2:{id: 'position_right_2',direction: 'right', img: RenderParam.imagePath + 'roadblock_1_2.png'},
            position3:{id: 'position_left_3',direction: 'left', img: ''},
        },{
            index: 3,
            position1:{id: 'position_right_1',direction: 'right', img: RenderParam.imagePath + 'roadblock_3_1.png'},
            position2:{id: 'position_left_2',direction: 'left', img: RenderParam.imagePath + 'roadblock_2_2.png'},
            position3:{id: 'position_right_3',direction: 'right', img: RenderParam.imagePath + 'roadblock_1_3.png'},
        },{
            index: 4,
            position1:{id: 'position_left_1',direction: 'left', img: RenderParam.imagePath + 'roadblock_1_1.png'},
            position2:{id: 'position_right_2',direction: 'right', img: RenderParam.imagePath + 'roadblock_3_2.png'},
            position3:{id: 'position_left_3',direction: 'left', img: RenderParam.imagePath + 'roadblock_2_3.png'},
        },{
            index: 5,
            position1:{id: 'position_right_1',direction: 'right', img: RenderParam.imagePath + 'roadblock_2_1.png'},
            position2:{id: 'position_left_2',direction: 'left', img: RenderParam.imagePath + 'roadblock_1_2.png'},
            position3:{id: 'position_right_3',direction: 'right', img: RenderParam.imagePath + 'roadblock_3_3.png'},
        },{
            index: 6,
            position1:{id: 'position_left_1',direction: 'left', img: RenderParam.imagePath + 'roadblock_3_1.png'},
            position2:{id: 'position_right_2',direction: 'right', img: RenderParam.imagePath + 'roadblock_2_2.png'},
            position3:{id: 'position_left_3',direction: 'left', img: RenderParam.imagePath + 'roadblock_1_3.png'},
        },{
            index: 7,
            position1:{id: 'position_right_1',direction: 'right', img: RenderParam.imagePath + 'roadblock_1_1.png'},
            position2:{id: 'position_left_2',direction: 'left', img: RenderParam.imagePath + 'roadblock_3_2.png'},
            position3:{id: 'position_right_3',direction: 'right', img: RenderParam.imagePath + 'roadblock_2_3.png'},
        },{
            index: 8,
            position1:{id: 'position_left_1',direction: 'left', img: RenderParam.imagePath + 'roadblock_2_1.png'},
            position2:{id: 'position_right_2',direction: 'right', img: RenderParam.imagePath + 'roadblock_1_2.png'},
            position3:{id: 'position_left_3',direction: 'left', img: RenderParam.imagePath + 'roadblock_3_3.png'},
        },
    ];

    w.Activity = Activity;
    w.onBack = function () {
        if (LMActivity.shownModal) {
            if (r.isVip === '0' && r.valueCountdown.showDialog === '1' && $("order_vip").style.display == 'block') {
                LMActivity.showModal({
                    id: 'countdown',
                    onShowListener: function () {
                        LMActivity.startCountdown();
                    },
                })
            } else {
                if (r.playStatus) {
                    // LMActivity.Router.reload();
                    Activity.resultGame();
                    r.playStatus = false;
                } else {
                    if (Activity.orderCancelStatus == true) {
                        Activity.orderCancelStatus = false;
                        LMActivity.hideModal(LMActivity.shownModal);
                        LMEPG.BM.requestFocus('btn_start');
                    } else {
                        if (LMActivity.shownModal.id == 'activity_page') {
                            LMEPG.BM.requestFocus('btn_start');
                        }
                        if (LMActivity.shownModal.id == 'exchange_prize') {
                            LMEPG.BM.requestFocus('btn_exchange_prize');
                        }
                        if (LMActivity.shownModal.id == 'countdown') {
                            LMActivity.hideModal(LMActivity.shownModal);
                            e.Intent.back();
                        }
                        if(LMActivity.shownModal.id == 'exchange_fail'){
                            LMActivity.Router.reload();
                        }
                        LMActivity.hideModal(LMActivity.shownModal);
                    }
                }
            }
        } else {
            LMActivity.exitActivity();
        }
    }
})(window, LMEPG, RenderParam, LMActivity, LMUtils);