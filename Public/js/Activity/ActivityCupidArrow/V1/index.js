(function (w, e, r, a, u) {
    var Activity = {
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            Activity.initGameData();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
            //积分数
            $('golden_arrow_num').innerHTML = RenderParam.score;
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
        },

        initGameData: function(){
            Activity.gameOverFlag = false;  //本局游戏结束标志
            Activity.gameCountDown;         //单局游戏倒计时
            Activity.exchangeCupidDown;     //丘比特动画计时器
            Activity.heartRoateCnt = 0;
            Activity.exchangeCupidCnt = 0;
            Activity.isCupidAnimation = false;  //丘比特动画标志
            Activity.goldArrowNum = 0;      //本局获取金箭数
            //箭的显示与隐藏数组
            Activity.arrowIsShowArray = new Array(12);
            var length =  Activity.arrowIsShowArray.length;
            while (length--){
                Activity.arrowIsShowArray[length] = 0;
            }
            Activity.currentFrame = 1;      //当前所处的帧

            length = 1;
            while (length <= 12){
                H('arrow_' + length);   //隐藏心上之箭
                length++;
            }
            H('arrow_list_1');
            H('arrow_list_2');
            H('arrow_list_3');
            H('arrow_list_4');
        },

        //丘比特动画效果
        ExchangeCupid: function() {
            if(Activity.isCupidAnimation == true) {
                Activity.exchangeCupidCnt++;
                if(Activity.exchangeCupidCnt == 1){
                    G('activity_page_cupid').src = a.makeImageUrl('cupid_1.png');
                }else if(Activity.exchangeCupidCnt == 2){
                    S('arrow_list_1');
                    G('activity_page_cupid').src = a.makeImageUrl('cupid_2.png');
                }else if(Activity.exchangeCupidCnt == 3){
                    H('arrow_list_1');
                    S('arrow_list_2');
                    G('activity_page_cupid').src = a.makeImageUrl('cupid_3.png');
                }else if(Activity.exchangeCupidCnt == 4){
                    H('arrow_list_2');
                    S('arrow_list_3');
                    G('activity_page_cupid').src = a.makeImageUrl('cupid_1.png');
                }else if (Activity.exchangeCupidCnt == 5) {
                    H('arrow_list_3');
                    S('arrow_list_4');
                } else if(Activity.exchangeCupidCnt == 6){
                    H('arrow_list_4');
                    Activity.isCupidAnimation = false;
                    Activity.exchangeCupidCnt = 0;
                    if (Activity.arrowIsShowArray[Activity.currentFrame - 1] == 0) {
                        Activity.arrowIsShowArray[Activity.currentFrame - 1] = 1;
                        Activity.goldArrowNum = Activity.goldArrowNum + 1;
                        G('activity_golden_arrow_num').innerHTML = Activity.goldArrowNum;
                    }
                }
            }
        },

        //活动总倒计时处理
        ActivityCountDown: function () {
            var gameTime = parseInt(G("activity_page_count_down").innerHTML);
            if (gameTime <= 0) {
                Activity.gameOverFlag = true;
                clearInterval(Activity.gameCountDown);
                clearInterval(Activity.heartRoateTime);
                clearInterval(Activity.exchangeCupidDown);

                H('arrow_list_1');
                H('arrow_list_2');
                H('arrow_list_3');
                H('arrow_list_4');
                //本局结束，保存积分
                a.AjaxHandler.addScore(Activity.goldArrowNum, function () {
                    Activity.goldArrowNum = 0;
                    //LMActivity.Router.reload();
                });

                G("single_game_arrow_num").innerHTML = Activity.goldArrowNum;
                LMActivity.showModal({
                    id: 'single_game_over',
                    focusId: 'btn_single_game_over',
                });

            } else {
                G("activity_page_count_down").innerHTML = gameTime - 1;
            }
        },
        // 旋转心
        ActivityHeartRotate: function() {
            if(Activity.heartRoateCnt%6 == 0) {
                var cnt = 0;
                while (true) {
                    var indexArrow = (cnt + Activity.currentFrame) % 12 + 1;
                    if (Activity.arrowIsShowArray[cnt] == 0) {
                        H('arrow_' + indexArrow);
                    } else {
                        S('arrow_' + indexArrow);
                    }
                    cnt++;
                    if (cnt >= 12) {
                        break;
                    }
                }
                var heartImg = document.getElementById('activity_page_heart');
                heartImg.src = a.makeImageUrl('heartArrow/heart_' + Activity.currentFrame + '.png');
                Activity.currentFrame++;
                if (Activity.currentFrame > 12) {
                    Activity.currentFrame = 1;
                }
            }
            Activity.heartRoateCnt++;
        },
        startGame: function () {
            LMActivity.showModal({
                id: 'activity_page',
                focusId: 'btn_shoot_arrow_1',
                onShowListener: function () {
                    //活动倒计时计时器
                    Activity.gameCountDown = setInterval(Activity.ActivityCountDown, 1000);
                    //心形旋转计时器
                    Activity.heartRoateTime = setInterval(Activity.ActivityHeartRotate, 40);
                    //丘比特动画倒计时
                    Activity.exchangeCupidDown =  setInterval(Activity.ExchangeCupid,40);
                }
            });
            LMActivity.playStatus = true;
        },
        
        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    //Activity.startGame();
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            LMActivity.showModal({
                                id: 'activity_page',
                                focusId: 'btn_shoot_arrow_1',
                            });
                            Activity.startGame();
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                //射箭按钮事件处理
                case 'btn_shoot_arrow_1':
                    if(Activity.isCupidAnimation == false){
                        Activity.isCupidAnimation = true;
                    }
                    break;
                case 'btn_exchange_close':
                    LMActivity.hideModal(LMActivity.shownModal);
                    LMEPG.ButtonManager.init('btn_exchange_prize', Activity.buttons, "", true);
                    break;
                case 'btn_single_game_over':
                    LMActivity.hideModal(LMActivity.shownModal);
                    LMActivity.Router.reload();
                    break;
            }
        }
    };

    Activity.exchangePrizeButtons = [
        {
            id: 'exchange_prize_1',
            name: '按钮-兑换一等奖',
            type: 'img',
            nextFocusUp: 'btn_exchange_close',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.gif'),
            order: 0,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换二等奖',
            type: 'img',
            nextFocusUp: 'btn_exchange_close',
            nextFocusRight: 'exchange_prize_3',
            nextFocusLeft: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.gif'),
            order: 1,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换三等奖',
            type: 'img',
            nextFocusUp: 'btn_exchange_close',
            nextFocusLeft: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.gif'),
            order: 2,
            click: a.eventHandler
        }, {
            id: 'btn_exchange_close',
            name: '按钮-奖品兑换关闭',
            type: 'img',
            nextFocusDown: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_close_rule.png'),
            focusImage: a.makeImageUrl('btn_close_rule_f.gif'),
            click: Activity.eventHandler
        }
    ];

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_activity_rule',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: 'btn_back',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.gif'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换奖品',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusUp: 'btn_winner_list',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_prize_exchange.png'),
            focusImage: a.makeImageUrl('btn_prize_exchange_f.gif'),
            exchangePrizeButtons: Activity.exchangePrizeButtons,
            exchangeFocusId:'',
            moveType: 1,
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.gif'),
            listType: 'exchange',
            click: Activity.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-关闭活动规则',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_close_rule_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_shoot_arrow_1',
            name: '按钮-射箭1',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_shoot_arrow_1.gif'),
            focusImage: a.makeImageUrl('btn_shoot_arrow_1.gif'),
            click: Activity.eventHandler
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
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit',
            nextFocusUp: 'exchange_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler
        },{
            id: 'btn_game_over_sure',
            name: '按钮-兑换成功-取消',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        },{
            id: 'btn_single_game_over',
            name: '按钮-活动结束-关闭',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: Activity.eventHandler
        }

    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity, LMUtils);