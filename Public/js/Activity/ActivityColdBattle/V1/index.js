(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score:0,
        init: function () {
            // if(RenderParam.platformType == 'sd'){
            //     G('body').innerHTML='';
            //     LMEPG.UI.showToast('活动暂不支持标清模式！', 2);
            //     setTimeout(function () {
            //         LMActivity.exitActivity();
            //     },2000);
            // };

            Activity.initGameData();
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            G('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';

            Activity.changeImg();

        },


        initGameData:function () {
            if(r.platformType == 'hd'){
                Activity.cannonLeft = 520; // 炮台距离左边初始距离
                Activity.cannonIndex = 2 ;  // 默认90度，即目标数组下标2
                Activity.snowBallHalfWidth = 30;  //雪球半宽
                Activity.gameTop = 500;        // 目标掉落最大高度
                Activity.mindPositionArray = [230,410,590,770,950]; // 目标初始掉落位置left
                Activity.mindHalfWidth = 50;
                Activity.mindHalfHeight = 50;
                Activity.mindMoveDistence = 10;     //目标偏移量
                Activity.waterMoveDistence = 14;    //雪球偏移量
                Activity.shortDistence = Activity.waterMoveDistence / 2;
                Activity.longDistence = Math.round(Activity.shortDistence * 1.732 * 10) / 10;     //保留一位小数


                // 小球的横纵坐标与小球的偏移量比例为 1:1.732:2；对应关系随角度变化儿变化
                Activity.cannonArray = [
                    {
                        cannonAngle :30,        //角度
                        snowBallX : 490 ,       // 雪球当前角度横坐标
                        snowBallY : 620 ,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : Activity.longDistence,           // 偏移量X
                        snowBallYMoveDistence : Activity.shortDistence           // 偏移量Y
                    }, {
                        cannonAngle :60,        //角度
                        snowBallX : 540,        // 雪球当前角度横坐标
                        snowBallY : 570,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : Activity.shortDistence,           // 偏移量Y
                        snowBallYMoveDistence : Activity.longDistence           // 偏移量X
                    },{
                        cannonAngle :90,        //角度
                        snowBallX : 610,        // 雪球当前角度横坐标
                        snowBallY : 550,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : 0,
                        snowBallYMoveDistence : Activity.waterMoveDistence
                    },{
                        cannonAngle :120,       //角度
                        snowBallX : 680,        // 雪球当前角度横坐标
                        snowBallY : 570,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : -Activity.shortDistence,           // 偏移量Y
                        snowBallYMoveDistence : Activity.longDistence           // 偏移量X
                    },{
                        cannonAngle :150,       //角度
                        snowBallX : 730,        // 雪球当前角度横坐标
                        snowBallY : 620,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : -Activity.longDistence,           // 偏移量X
                        snowBallYMoveDistence : Activity.shortDistence           // 偏移量Y
                    }
                ]
            }else{
                Activity.cannonLeft = 240; // 炮台距离左边初始距离    322-82
                Activity.cannonIndex = 2 ;  // 默认90度，即目标数组下标2
                Activity.snowBallHalfWidth = 22;  //雪球半宽
                Activity.gameTop = 360;        // 目标掉落最大高度
                Activity.mindPositionArray = [20,150,280,410,540]; // 目标初始掉落位置left
                Activity.mindHalfWidth = 42;
                Activity.mindHalfHeight = 42;
                Activity.mindMoveDistence = 10;     //目标偏移量
                Activity.waterMoveDistence = 10;    //雪球偏移量
                Activity.shortDistence = Activity.waterMoveDistence / 2;
                Activity.longDistence = Math.round(Activity.shortDistence * 1.732 * 10) / 10;     //保留一位小数

                //保证小球每次偏移量为10；故X、Y 对应为 8.7、 5（跟对应角度不同有关）
                Activity.cannonArray = [
                    {
                        cannonAngle :30,        //角度
                        snowBallX : 220 ,       // 雪球当前角度横坐标
                        snowBallY : 460 ,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : Activity.longDistence,           // 偏移量X
                        snowBallYMoveDistence : Activity.shortDistence           // 偏移量Y
                    }, {
                        cannonAngle :60,        //角度
                        snowBallX : 250,        // 雪球当前角度横坐标
                        snowBallY : 430,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : Activity.shortDistence,           // 偏移量Y
                        snowBallYMoveDistence : Activity.longDistence           // 偏移量X
                    },{
                        cannonAngle :90,        //角度
                        snowBallX : 300,        // 雪球当前角度横坐标
                        snowBallY : 415,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : 0,
                        snowBallYMoveDistence : Activity.mindMoveDistence
                    },{
                        cannonAngle :120,       //角度
                        snowBallX : 350,        // 雪球当前角度横坐标
                        snowBallY : 430,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : -Activity.shortDistence,           // 偏移量Y
                        snowBallYMoveDistence : Activity.longDistence          // 偏移量X
                    },{
                        cannonAngle :150,       //角度
                        snowBallX : 380,        // 雪球当前角度横坐标
                        snowBallY : 460,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : -Activity.longDistence,           // 偏移量X
                        snowBallYMoveDistence : Activity.shortDistence           // 偏移量Y
                    }
                ]
            }



            Activity.mindArray = [
                LMActivity.makeImageUrl('icon_virus_1.png'),
                LMActivity.makeImageUrl('icon_virus_2.png'),
                LMActivity.makeImageUrl('icon_virus_3.png'),
                LMActivity.makeImageUrl('icon_virus_4.png'),
            ];

            Activity.waterImgSrc = LMActivity.makeImageUrl('icon_snowball.png');
        },


        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            if (LMActivity.playStatus = 'false') {
                                LMActivity.showModal({
                                    id: 'game_container',
                                    focusId: 'btn_cannon',
                                    onDismissListener: function () {
                                        // 清除游戏状态
                                        Activity.gameRunning = false;
                                        $('game_container').innerHTML = '';
                                        if (Activity.gameCount > 0) {
                                            clearInterval(Activity.gameInterval);
                                            clearInterval(Activity.mindInterval);
                                            clearInterval(Activity.mindMoveIntervel);
                                            clearInterval(Activity.waterInterval);
                                        }
                                    }
                                });
                                Activity.startGame();
                            }
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_cannon':
                    if (Activity.gameRunning){
                        // 1s 最多发射2滴液体
                        if(Date.now() - Activity.lastClickTime > 500 ){
                            Activity.shot();
                            Activity.lastClickTime = Date.now();
                        }
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
            }
        },

        startGame: function () {
            LMActivity.playStatus = true;
            Activity.lastClickTime = Date.now();
            G('btn_cannon').style.left = Activity.cannonLeft + 'px';

            Activity.shotMindCount = 0;
            Activity.mindElementArray = [];

            Activity.createGameMind();
            // 每1s创建一个表情
            Activity.mindInterval = setInterval(function () {
                Activity.createGameMind();
            },1000);

            var gameCountdown = $('game_countdown');
            Activity.gameCount = 20;
            gameCountdown.innerHTML = String(Activity.gameCount)+'S';
            Activity.gameRunning = true;
            // 启动游戏定时器
            Activity.gameInterval = setInterval(function () {
                if (Activity.gameRunning) {
                    Activity.gameCount = Activity.gameCount - 1;
                    gameCountdown.innerHTML = String(Activity.gameCount)+'S';
                    // 倒计时为0 弹窗游戏结果
                    if (Activity.gameCount == 0) {
                        Activity.gameRunning = false;
                        Activity.gameCount = 0;
                        clearInterval(Activity.gameInterval);
                        clearInterval(Activity.mindInterval);
                        clearInterval(Activity.mindMoveIntervel);
                        clearInterval(Activity.waterInterval);

                        Activity.checkGameResult();
                    }
                }
            }, 1000);
        },

        checkGameResult: function () {
            console.log(Activity.shotMindCount);
            if (Activity.shotMindCount > 0) {
                Activity.score=Activity.shotMindCount;

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
                    LMEPG.UI.showToast('添加积分失败', 2);
                });
            } else {
                a.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail_sure',
                    onDismissListener: function () {
                        a.Router.reload();
                    }
                })
            }
        },

        createGameMind: function () {
            var mindIndex = getRandom(0, Activity.mindArray.length - 1);
            var mindPositionIndex = getRandom(0, Activity.mindPositionArray.length - 1);
            var mindElement = document.createElement('img');
            var gameContainer = document.getElementById('game_container');
            mindElement.src = Activity.mindArray[mindIndex];
            // 设置目标初始掉落位置
            mindElement.style.left = Activity.mindPositionArray[mindPositionIndex] + 'px';
            mindElement.style.top =  '0px';
            gameContainer.appendChild(mindElement);
            Activity.mindElementArray.push(mindElement);
            Activity.mindMoveIntervel = setInterval(function () {
                if (Activity.gameRunning) {
                    var mindTop = parseInt(mindElement.style.top) + Activity.mindMoveDistence;
                    if (mindTop > Activity.gameTop) {
                        Activity.removeElement(mindElement);
                    } else {
                        mindElement.style.top = mindTop + 'px';
                    }
                }
            }, 100);
        },

        shot: function () {
            var waterElement = document.createElement('img');
            var gameContainer = document.getElementById('game_container');
            waterElement.src = Activity.waterImgSrc;
            var currObj = Activity.cannonArray[Activity.cannonIndex];   //当前数组元素

            waterElement.style.left = currObj.snowBallX + 'px';
            waterElement.style.top = currObj.snowBallY + 'px';
            gameContainer.appendChild(waterElement);
            Activity.waterInterval = setInterval(function () {
                if (Activity.gameRunning && waterElement !== null) {

                    var waterLeft = parseInt(waterElement.style.left) - currObj.snowBallXMoveDistence;
                    var waterTop = parseInt(waterElement.style.top) - currObj.snowBallYMoveDistence;
                    // 雪球越界时 移除雪球
                    if (waterTop < 0 || waterLeft < 0 || waterLeft > 1280 - Activity.snowBallHalfWidth) {
                        Activity.removeElement(waterElement);
                    } else {
                            waterElement.style.left = waterLeft + 'px';
                            waterElement.style.top = waterTop + 'px';

                        for(var index = 0;index < Activity.mindElementArray.length;index ++){
                            var mindElement = Activity.mindElementArray[index];
                            var mindElementLeft = parseInt(mindElement.offsetLeft);
                            var mindElementTop = parseInt(mindElement.offsetTop);

                            if ((Math.abs(waterLeft - mindElementLeft) < Activity.mindHalfWidth) &&
                                (Math.abs(waterTop - mindElementTop) < Activity.mindHalfHeight)) {
                                // dom相交,加分且清除dom
                                Activity.shotMindCount++;
                                Activity.removeElement(waterElement);
                                waterElement = null;
                                mindElement.src = r.imagePath +'/icon_bomb.png';
                                setTimeout(function () {
                                    Activity.removeElement(mindElement);
                                    mindElement = null;
                                },200);
                                Activity.mindElementArray.splice(index, 1);
                                break;
                            }
                        }
                    }
                }
            }, 100);
        },

        cannonMove: function (direction, button) {
            switch (direction) {
                case 'left':
                    if (Activity.cannonIndex > 0) {
                        Activity.cannonIndex --;
                        Activity.changeImg();
                    }
                    break;
                case 'right':
                    if (Activity.cannonIndex < Activity.cannonArray.length-1 ) {
                        Activity.cannonIndex ++;
                        Activity.changeImg();
                    }
                    break;
            }
        },

        changeImg:function () {
            G('btn_cannon').src = r.imagePath + 'icon_cannon_'+Activity.cannonArray[Activity.cannonIndex].cannonAngle+'.png';
            G('water').style.left = Activity.cannonArray[Activity.cannonIndex].snowBallX + 'px';
            G('water').style.top = Activity.cannonArray[Activity.cannonIndex].snowBallY + 'px';
        },


        removeElement: function (_element) {
            var _parentElement = _element.parentNode;
            if (_parentElement) {
                _parentElement.removeChild(_element);
            }
        },
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
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
            id: 'btn_close_rule',
            name: '按钮-活动规则-返回',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        },{
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusRight: 'btn_exchange_prize',
            nextFocusDown: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_change_gift.png'),
            focusImage: a.makeImageUrl('btn_change_gift_f.png'),
            // listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-ready',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_winner_list',
            nextFocusRight: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_tips',
            name: '按钮-小贴士',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusUp: 'btn_back',
            nextFocusLeft: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_tips.png'),
            focusImage: a.makeImageUrl('btn_tips_f.png'),
            click: Activity.eventHandler
        },{
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
            nextFocusUp: '',
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
        }, {
            id: 'btn_cannon',
            name: '图片-针管',
            type: 'img',
            beforeMoveChange: Activity.cannonMove,
            click: Activity.eventHandler
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
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusLeft: 'exchange_prize_3',
            nextFocusRight: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp: r.platformType == 'sd' ? 'exchange_tel': '',
            nextFocusLeft: 'exchange_tel',
            nextFocusRight: 'btn_exchange_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit',
            nextFocusUp: r.platformType == 'sd' ? 'exchange_tel':'',
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
            click: a.eventHandler
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
    w.onBack = function () {
        if (LMActivity.shownModal) {
            if (G('game_container').style.display === 'block') {
                LMActivity.Router.reload();
            }
            LMActivity.hideModal(LMActivity.shownModal);
        } else {
            LMActivity.innerBack()
        }
    }
})(window, LMEPG, RenderParam, LMActivity);
