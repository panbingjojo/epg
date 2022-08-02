(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score: 0,
        init: function () {
            // 中国联通活动不再弹窗倒计时
            if (r.lmcid == '000051') {
                r.valueCountdown.showDialog = '0';
            }
            //宁夏广电EPG VIP订购弹窗
            if (r.lmcid == '640094') {
                G('order_vip').style.backgroundImage = "url(" + r.imagePath + "bg_order_vip_ningxia.png)";
                G('btn_order_submit').style.top = '467px';
                G('btn_order_submit').style.left = '555px';
                H('btn_order_cancel');
            }

            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
        },
        initGameData: function () {
            Activity.shotMindCount = 0;
            //路面默认背景
            Activity.bgRoadImgDef = a.makeImageUrl('bg_road.png');
            //游戏左按钮默认背景
            Activity.btnGameLeftImgDef = a.makeImageUrl('btn_click_left.png');
            //游戏右按钮默认背景
            Activity.btnGameRightImgDef = a.makeImageUrl('btn_click_right.png');

            //路面动态图片集
            Activity.bgRoadImgArr = [
                a.makeImageUrl('bg_road_1.png'),
                a.makeImageUrl('bg_road_2.png'),
                a.makeImageUrl('bg_road_3.png'),
                a.makeImageUrl('bg_road_4.png'),
                a.makeImageUrl('bg_road_5.png')
            ];

            //铁环滚动图片集
            Activity.toyRollImgArr = [
                a.makeImageUrl('toy_roll_1.png'),
                a.makeImageUrl('toy_roll_2.png'),
                a.makeImageUrl('toy_roll_3.png')
            ];

            //铁环游戏中图片集
            Activity.toyImgs = {
                'toy_roll_1': {
                    'id': 'toy_roll_1',
                    'img': Activity.toyRollImgArr[0],
                    'last': null,
                    'next': 'toy_roll_2'
                },
                'toy_roll_2': {
                    'id': 'toy_roll_2',
                    'img': Activity.toyRollImgArr[1],
                    'last': null,
                    'next': 'toy_roll_3'
                },
                'toy_roll_3': {
                    'id': 'toy_roll_3',
                    'img': Activity.toyRollImgArr[2],
                    'last': null,
                    'next': null
                },
                'toy_left_1': {
                    'id': 'toy_left_1',
                    'img': a.makeImageUrl('toy_left_1.png'),
                    'last': 'toy_roll_1',
                    'next': 'toy_left_2'
                },
                'toy_left_2': {
                    'id': 'toy_left_2',
                    'img': a.makeImageUrl('toy_left_2.png'),
                    'last': 'toy_left_1',
                    'next': 'toy_left_3'
                },
                'toy_left_3': {
                    'id': 'toy_left_3',
                    'img': a.makeImageUrl('toy_left_3.png'),
                    'last': 'toy_left_2',
                    'next': null
                },
                'toy_right_1': {
                    'id': 'toy_right_1',
                    'img': a.makeImageUrl('toy_right_1.png'),
                    'last': 'toy_roll_1',
                    'next': 'toy_right_2'
                },
                'toy_right_2': {
                    'id': 'toy_right_2',
                    'img': a.makeImageUrl('toy_right_2.png'),
                    'last': 'toy_right_1',
                    'next': 'toy_right_3'
                },
                'toy_right_3': {
                    'id': 'toy_right_3',
                    'img': a.makeImageUrl('toy_right_3.png'),
                    'last': 'toy_right_2',
                    'next': null
                }
            };
            //铁环下一个状态
            Activity.rollStatus = null;
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },
        beforeMoveChangeHandler: function (direction, btn) {
            var id = Activity.rollStatus['id'];
            if (id.indexOf('roll') > -1)
                return;

            var isRight = direction === 'right';
            if ((isRight && id.indexOf('right') > -1) || (!isRight && id.indexOf('left') > -1))
                Activity.setRollStatus('next', false);
            else
                Activity.setRollStatus('last');
        },
        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        a.showModal({
                            id: 'game_container',
                            focusId: 'btn_game_start',
                            onDismissListener: function () {
                                // 清除游戏状态
                                Activity.gameRunning = false;
                                if (Activity.gameCount > 0) {
                                    clearInterval(Activity.rollInterval);
                                    clearInterval(Activity.gameInterval);
                                }
                            }
                        });
                        Activity.initGame();
                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_order_submit':
                    if (RenderParam.lmcid === '640094') {
                        Activity.jumpPlayVideo();
                    } else {
                        LMActivity.Router.jumpBuyVip();
                    }
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_game_sure':
                case 'btn_close_tips':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
                case 'btn_game_back':
                    a.Router.reload();
                    break;
                case 'btn_game_start':
                    a.AjaxHandler.uploadPlayRecord(function () {
                        if (a.playStatus = 'false') {
                            a.showModal({
                                id: 'game_container',
                                focusId: 'btn_game_start',
                                onDismissListener: function () {
                                    // 清除游戏状态
                                    Activity.gameRunning = false;
                                    if (Activity.gameCount > 0) {
                                        clearInterval(Activity.rollInterval);
                                        clearInterval(Activity.gameInterval);
                                    }
                                }
                            });
                            Activity.startGame();
                        }
                    }, function () {
                        e.UI.showToast('扣除游戏次数出错', 3);
                    });
                    break;
                case 'exchange_prize_1':
                case 'exchange_prize_2':
                case 'exchange_prize_3':
                    Activity.exchangePrize(btn.order);
                    break;
            }
        },
        initGame: function () {
            var gameCountdown = $('game_countdown');
            Activity.gameCount = 10;
            gameCountdown.innerHTML = '倒计时：' + String(Activity.gameCount) + 'S';
            $('btn_click_right').src = Activity.btnGameRightImgDef;
            $('btn_click_left').src = Activity.btnGameLeftImgDef;

            //路面切换效果
            Activity.roadBgIndex = 0;
            Activity.roadInterval = setInterval(function () {
                if (Activity.roadBgIndex === 5)
                    Activity.roadBgIndex = 0;
                $('bg_road').src = Activity.bgRoadImgArr[Activity.roadBgIndex];
                Activity.roadBgIndex++;
            }, 100);

            //铁环默认滚动效果，游戏未开始前
            Activity.toyBgIndex = 0;
            Activity.toyIntervalDef = setInterval(function () {
                if (Activity.toyBgIndex === 3)
                    Activity.toyBgIndex = 0;
                $('toy').src = Activity.toyRollImgArr[Activity.toyBgIndex];
                Activity.toyBgIndex++;
            }, 100);
        },
        startGame: function () {
            a.playStatus = true;
            $('btn_game_back').style.display = 'none';
            var gameCountdown = $('game_countdown');
            Activity.gameRunning = true;

            Activity.isRight = Math.floor(Math.random() * 10) > 4 ? true : false;
            e.BM.requestFocus(Activity.isRight ? 'btn_click_right' : 'btn_click_left');

            clearInterval(Activity.toyIntervalDef);
            Activity.rollStatus = Activity.toyImgs['toy_roll_1'];
            Activity.rollInterval = setInterval(function () {
                $('toy').src = Activity.rollStatus['img'];
                Activity.setRollStatus('next');
            }, 350);

            // 启动游戏定时器
            Activity.gameInterval = setInterval(function () {
                if (Activity.gameRunning) {
                    Activity.shotMindCount++;
                    Activity.gameCount = Activity.gameCount - 1;
                    gameCountdown.innerHTML = '倒计时：' + String(Activity.gameCount) + 'S';
                    // 倒计时为0 弹窗游戏结果
                    if (Activity.gameCount === 0) {
                        Activity.gameRunning = false;
                        Activity.gameCount = 0;
                        clearInterval(Activity.rollInterval);
                        clearInterval(Activity.gameInterval);
                        Activity.checkGameResult();
                    }
                }
            }, 1000);
        },
        setRollStatus: function (type, auto) {
            switch (type) {
                case 'next':
                    if (Activity.rollStatus['next'] !== null)
                        Activity.rollStatus = Activity.toyImgs[Activity.rollStatus['next']];
                    else if (Activity.rollStatus['id'] === 'toy_roll_3') {
                        if (Activity.isRight === null)
                            Activity.isRight = Math.floor(Math.random() * 10) > 4 ? true : false;
                        Activity.rollStatus = Activity.isRight ? Activity.toyImgs['toy_right_1'] : Activity.toyImgs['toy_left_1'];
                        Activity.isRight = null;
                    } else {
                        if (auto !== false) {
                            Activity.gameCount = 0;
                            clearInterval(Activity.rollInterval);
                            clearInterval(Activity.gameInterval);
                            Activity.checkGameResult();
                        }
                    }
                    break;
                case 'last':
                    if (Activity.rollStatus['last'] !== null) {
                        var last = Activity.toyImgs[Activity.rollStatus['last']];
                        if (last['last'] !== null)
                            Activity.rollStatus = Activity.toyImgs[last['last']];
                        else
                            Activity.rollStatus = Activity.toyImgs[Activity.rollStatus['last']];
                    }
                    break;
            }
        },
        checkGameResult: function () {
            console.log(Activity.shotMindCount);
            if (Activity.shotMindCount > 0) {
                Activity.score = Activity.shotMindCount;

                $('shot_count').innerHTML = String(Activity.score);
                a.AjaxHandler.addScore(parseInt(Activity.score), function () {
                    a.showModal({
                        id: 'game_success',
                        focusId: 'btn_game_sure',
                        onDismissListener: function () {
                            a.Router.reload(); // 重新加载
                        }
                    });
                }, function () {
                    e.UI.showToast('添加积分失败', 2);
                });
            } else {
                a.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail_sure',
                    onDismissListener: function () {
                        a.Router.reload();
                    }
                });
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
                'title': RenderParam.platformType == 'hd' ? '居家马甲线系列' : '扁鹊三兄弟',
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
        removeElement: function (_element) {
            var _parentElement = _element.parentNode;
            if (_parentElement) {
                _parentElement.removeChild(_element);
            }
        },
        exchangePrize: function (prizeIndex) {
            if (r.exchangeRecordList.data.list.length > 0) {
                LMEPG.UI.showToast("您已经兑换过奖品")
                return;
            }
            var prizeId = (r.exchangePrizeList.data)[prizeIndex].goods_id;
            if (prizeId == 1 || prizeId == 2) {
                if (parseInt(RenderParam.score) < parseInt(G('exchange_point_' + prizeId).innerHTML)) {
                    LMEPG.UI.showToast("积分不足", 3);
                }
                return;
            }
            LMActivity.AjaxHandler.exchangePrize(prizeId, function () {
                // 显示兑换成功
                LMActivity.exchangePrizeId = prizeId;
                LMActivity.showModal({
                    id: 'exchange_success',
                    focusId: 'btn_exchange_submit',
                    onDismissListener: function () {
                        LMActivity.Router.reload();
                    }
                })
            }, function (errCode) {
                // 兑换失败
                if (errCode === -101) {
                    $('exchange_fail').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_no_prize.png') + ')';
                    LMActivity.showModal({
                        id: 'exchange_fail',
                        onDismissListener: function () {
                            LMActivity.Router.reload();
                        }
                    });
                    LMActivity.exFailTimer = setTimeout(function () {
                        LMActivity.hideModal(LMActivity.shownModal);
                    }, 3000);
                } else if (errCode === -102) {
                    LMEPG.UI.showToast("积分不足", 3);
                } else {
                    LMEPG.UI.showToast("兑换出错" + errCode, 3);
                }
            });
        },
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusUp: 'btn_start',
            nextFocusRight: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusRight: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusRight: 'btn_start',
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
            nextFocusRight: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_change_gift.png'),
            focusImage: a.makeImageUrl('btn_change_gift_f.png'),
            // listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-ready',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusDown: 'btn_back',
            nextFocusLeft: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.gif'),
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
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_boy',
            name: '图片-小人',
            type: 'img'
        }, {
            id: 'btn_game_back',
            name: '按钮-游戏界面-返回',
            type: 'img',
            nextFocusRight: 'btn_game_start',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_start',
            name: '按钮-游戏界面-开始',
            type: 'img',
            nextFocusLeft: 'btn_game_back',
            backgroundImage: a.makeImageUrl('btn_game_start.png'),
            focusImage: a.makeImageUrl('btn_game_start_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_click_right',
            name: '按钮-游戏界面-右',
            type: 'img',
            nextFocusLeft: 'btn_click_left',
            backgroundImage: a.makeImageUrl('btn_click_right.png'),
            focusImage: a.makeImageUrl('btn_click_right_f.png'),
            beforeMoveChange: Activity.beforeMoveChangeHandler
        }, {
            id: 'btn_click_left',
            name: '按钮-游戏界面-左',
            type: 'img',
            nextFocusRight: 'btn_click_right',
            backgroundImage: a.makeImageUrl('btn_click_left.png'),
            focusImage: a.makeImageUrl('btn_click_left_f.png'),
            beforeMoveChange: Activity.beforeMoveChangeHandler
        }, {
            id: 'btn_game_sure',
            name: '按钮-游戏成功确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
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
        }, {
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
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);