(function (w, e, r, a, u, d) {
    var Activity = {
        init: function () {
            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
            a.showOrderResult();
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
            if (r.platformType === 'hd') {
                Activity.gameGirlTop = 151; // 小女孩距离顶部高度
                Activity.gameGirlHalfHeight = 154;
                Activity.ballHalfHeight = 29;
                Activity.girlMoveDistence = 86; // 小女孩移动距离
                Activity.gameBottom = 720 - 330 + 50; // 330表示自身高度，50表示图片底部距离容器底部高度
                Activity.gameRight = 1280; //
                Activity.gameLeft = 234; //
                Activity.ghostPositionArray = [116, 146, 244, 416, 436]; // 击打目标高度
                Activity.pumpkinHalfHeight = 194;
                Activity.pumpkinShadowHeight = 142;
                Activity.ghostHalfHeight = 132;
                Activity.ghostShadowHeight = 90;
                Activity.pumpkinWidth = 175;
                Activity.ghostWidth = 140;
                Activity.ghostMoveDistence = 14;
                Activity.ballMoveDistence = 10;
            } else {
                Activity.gameGirlTop = 182; // 小女孩距离顶部高度
                Activity.gameGirlHalfHeight = 118;
                Activity.ballHalfHeight = 21;
                Activity.girlMoveDistence = 74; // 小女孩移动距离
                Activity.gameBottom = 530 - 226 + 44; // 330表示自身高度，50表示图片底部距离容器底部高度
                Activity.gameRight = 644; //
                Activity.gameLeft = 190; //
                Activity.ghostPositionArray = [74, 104, 196, 306, 322]; // 击打目标高度
                Activity.pumpkinHalfHeight = 142;
                Activity.pumpkinShadowHeight = 128;
                Activity.ghostHalfHeight = 98;
                Activity.ghostShadowHeight = 86;
                Activity.pumpkinWidth = 128;
                Activity.ghostWidth = 104;
                Activity.ghostMoveDistence = 10;
                Activity.ballMoveDistence = 8;
            }

            Activity.ghostArray = [
                {
                    imageSrc: LMActivity.makeImageUrl('icon_game_pumpkin.png'),
                    width: Activity.pumpkinWidth,
                    height: Activity.pumpkinHalfHeight * 2,
                    shadowHeight: Activity.pumpkinShadowHeight,
                    halfHeight: Activity.pumpkinHalfHeight
                }, {
                    imageSrc: LMActivity.makeImageUrl('icon_game_ghost.png'),
                    width: Activity.ghostWidth,
                    height: Activity.ghostHalfHeight * 2,
                    shadowHeight: Activity.ghostShadowHeight,
                    halfHeight: Activity.ghostHalfHeight
                }
            ];

            Activity.ballArray = [
                LMActivity.makeImageUrl('icon_green_ball.png'),
                LMActivity.makeImageUrl('icon_blue_ball.png'),
                LMActivity.makeImageUrl('icon_yellow_ball.png')
            ];
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()){
                        a.AjaxHandler.uploadPlayRecord(function () {
                            Activity.startGame();
                        }, function () {
                            u.dialog.showToast('扣除游戏次数出错', 3);
                        });
                    }else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'game_girl':
                    if (Activity.gameRunning){
                        if(Date.now() - Activity.lastClickTime > Activity.INTERVAL_TIME){
                            Activity.shot();
                            Activity.lastClickTime = Date.now();
                        }
                    }
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
            }
        },



        startGame: function () {
            var gameGirl = $('game_girl');
            Activity.shotGhostCount = 0;
            Activity.ghostElementArray = [];
            gameGirl.style.top = Activity.gameGirlTop + 'px';

            LMActivity.showModal({
                id: 'game_container',
                focusId: 'game_girl',
                onShowListener: function () {
                    // 启动定时器
                    var gameCountdown = $('game_countdown');
                    Activity.gameCount = 10;
                    gameCountdown.innerHTML = String(Activity.gameCount);
                    Activity.gameRunning = true;
                    Activity.gameInterval = setInterval(function () {
                        Activity.gameCount = Activity.gameCount - 1;
                        if (Activity.gameCount >= 0) {
                            gameCountdown.innerHTML = String(Activity.gameCount);
                        } else {
                            Activity.gameRunning = false;
                            clearInterval(Activity.gameInterval);
                            clearInterval(Activity.ghostIntervel);
                            clearInterval(Activity.ballInterval);
                            clearInterval(Activity.ghostMoveIntervel);
                            Activity.checkGameResult();
                        }
                    }, 1000);

                    // 创建击打目标
                    Activity.createGameGhost();
                    Activity.ghostIntervel = setInterval(function () {
                        if (Activity.gameRunning) {
                            Activity.createGameGhost();
                        }
                    }, 2000);
                },
                onDismissListener: function () {
                    // 清除游戏状态
                    Activity.gameRunning = false;
                    $('game_container').innerHTML = '';
                    if (Activity.gameCount > 0) {
                        clearInterval(Activity.gameInterval);
                        clearInterval(Activity.ghostIntervel);
                        clearInterval(Activity.ballInterval);
                        clearInterval(Activity.ghostMoveIntervel);
                    }
                }
            });
        },

        shot: function () {
            var ballIndex = u.getRandom(0, Activity.ballArray.length - 1);
            var ballElement = d.createElement('img');
            var gameContainer = d.getElementById('game_container');
            var gameGirl = d.getElementById('game_girl');
            ballElement.src = Activity.ballArray[ballIndex];
            var ballTop = parseInt(gameGirl.style.top) +
                Activity.gameGirlHalfHeight /*- Activity.ballHalfHeight*/ ;
            ballElement.style.top = ballTop + 'px';
            ballElement.style.left = Activity.gameLeft + 'px';
            gameContainer.appendChild(ballElement);
            Activity.ballInterval = setInterval(function () {
                if (Activity.gameRunning && ballElement !== null) {
                    var ballLeft = parseInt(ballElement.style.left) + Activity.ballMoveDistence;
                    if (ballLeft >= Activity.gameRight) {
                        u.dom.removeElement(ballElement);
                    } else {
                        ballElement.style.left = ballLeft + 'px';
                        for(var index = 0;index < Activity.ghostElementArray.length;index ++){
                            var ghostElement = Activity.ghostElementArray[index];
                            var ghostElementWidth = parseInt(ghostElement.style.width);
                            var ghostElementHeight = parseInt(ghostElement.style.height) - ghostElement.shadowHeight;
                            var ghostElementRight = parseInt(ghostElement.style.left) + ghostElementWidth;
                            var ghostElementBottom = parseInt(ghostElement.style.top) + ghostElementHeight;
                            var ballSide = Activity.ballHalfHeight * 2;

                            if((ghostElementRight - ballLeft < ghostElementWidth + ballSide)&&
                                (ghostElementBottom - ballTop < ghostElementHeight + ballSide)){
                                // 矩形相交
                                Activity.shotGhostCount++;
                                u.dom.removeElement(ballElement);
                                ballElement = null;
                                u.dom.removeElement(ghostElement);
                                ghostElement = null;
                                Activity.ghostElementArray.splice(index, 1);
                                break;
                            }
                        }
                    }
                }
            }, 100);
        },

        createGameGhost: function () {
            var ghostIndex = u.getRandom(0, Activity.ghostArray.length - 1);
            var ghostPositionIndex = u.getRandom(0, Activity.ghostPositionArray.length - 1);
            var ghost = Activity.ghostArray[ghostIndex];
            var ghostElement = d.createElement('img');
            var gameContainer = d.getElementById('game_container');
            ghostElement.src = ghost.imageSrc;
            ghostElement.shadowHeight = ghost.shadowHeight;
            ghostElement.style.width = ghost.width + 'px';
            ghostElement.style.height = ghost.height + 'px';
            ghostElement.style.top = Activity.ghostPositionArray[ghostPositionIndex] + 'px';
            ghostElement.style.left = Activity.gameRight - ghost.width + 'px';
            gameContainer.appendChild(ghostElement);
            Activity.ghostElementArray.push(ghostElement);
            Activity.ghostMoveIntervel = setInterval(function () {
                if (Activity.gameRunning) {
                    var ghostLeft = parseInt(ghostElement.style.left) - Activity.ghostMoveDistence;
                    if (ghostLeft < Activity.gameLeft) {
                        u.dom.removeElement(ghostElement);
                    } else {
                        ghostElement.style.left = ghostLeft + 'px';
                    }
                }
            }, 100);
        },

        checkGameResult: function () {
            if (Activity.shotGhostCount > 3){
                $('shot_ghost_count').innerHTML = Activity.shotGhostCount < 10 ?
                    '0' + Activity.shotGhostCount : String(Activity.shotGhostCount);
                a.showModal({
                    id: 'game_success',
                    focusId: 'btn_lottery_sure',
                    onDismissListener: function () {
                        if (a.currentClickedId !== 'btn_lottery_sure'){
                            a.Router.reload();
                        }
                    }
                })
            }else {
                a.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail_sure',
                    onDismissListener: function () {
                        a.Router.reload();
                    }
                })
            }
        },

        gameGirlMove: function (direction, button) {
            var gameGirl = $(button.id);
            var gameGirlTop = parseInt(gameGirl.style.top);
            switch (direction) {
                case 'up':
                    if (gameGirlTop - Activity.girlMoveDistence > 0) {
                        gameGirl.style.top = (gameGirlTop - Activity.girlMoveDistence) + 'px';
                    }
                    break;
                case 'down':
                    if (gameGirlTop + Activity.girlMoveDistence < Activity.gameBottom) {
                        gameGirl.style.top = (gameGirlTop + Activity.girlMoveDistence) + 'px';
                    }
                    break;
            }
        }
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.gif'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusRight: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.gif'),
            listType: 'exchange',
            click: Activity.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-关闭活动规则',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            nextFocusUp: 'reset_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
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
            id: 'game_girl',
            name: '图片-游戏小女孩',
            type: 'img',
            beforeMoveChange: Activity.gameGirlMove,
            click: Activity.eventHandler
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_sure',
            name: '按钮-我要抽奖',
            type: 'img',
            nextFocusRight: 'btn_lottery_exit',
            backgroundImage: a.makeImageUrl('btn_lottery.png'),
            focusImage: a.makeImageUrl('btn_lottery_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_exit',
            name: '按钮-取消抽奖',
            type: 'img',
            nextFocusLeft: 'btn_lottery_sure',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_submit',
            name: '按钮-中奖-确定',
            type: 'img',
            nextFocusUp: 'lottery_tel',
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp: 'lottery_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler
        }, {
            id: 'lottery_tel',
            name: '输入框-中奖-电话号码',
            type: 'div',
            nextFocusDown: 'btn_lottery_submit',
            backFocusId: 'btn_lottery_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-抽奖失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-结束游戏',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_order_submit',
            name: '按钮-订购VIP',
            type: 'img',
            nextFocusRight: 'btn_order_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity, LMUtils, document);