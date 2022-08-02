(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score:0,
        score1:0,
        init: function () {
            Activity.initGameData();
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();

            RenderParam.lmcid == "410092" && Activity.onBack410092();

            var nowTime= new Date().getTime();
            var startDate =RenderParam.endDt;
            startDate= startDate.replace(new RegExp("-","gm"),"/");
            var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
            if(nowTime>=endDateM){ /*活动结束*/
                LMActivity.showModal({
                    id: 'bg_game_over',
                    onDismissListener: function () {
                        LMEPG.Intent.back();
                    }
                });
            }
        },
        onBack410092: function () {
            try {
                HybirdCallBackInterface.setCallFunction(function (param) {
                    LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                    if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                        w.onBack();
                    }
                });
            } catch (e) {
                LMEPG.UI.logPanel.show("e");
            }
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            G('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
            Activity.changeImg();
            a.prizeImage = {
                "1": regionalImagePath + '/icon_gift_1.png',
                "2": regionalImagePath + '/icon_gift_2.png',
                "3": regionalImagePath + '/icon_gift_3.png'
            };

        },

        //飞机和子弹的移动
        initGameData:function () {
            if(r.platformType == 'hd'){
                Activity.cannonLeft = 356; // 炮台距离左边初始距离
                Activity.cannonIndex = 2 ;  // 默认356的初始距离度，即目标数组下标2
                Activity.snowBallHalfWidth = 30;  //雪球半宽
                Activity.gameTop = 0;        // 目标升起最大高度
                Activity.mindPositionArray = [100,228,356,484,612,740,868,996]; // 目标初始掉落位置left
                Activity.mindHalfWidth = 50;
                Activity.mindHalfHeight = 50;
                Activity.mindMoveDistence = -10;     //目标偏移量
                Activity.waterMoveDistence = 40;    //雪球偏移量
                Activity.shortDistence = Activity.waterMoveDistence / 2;
                Activity.cannonArray = [];

                Activity.mindPositionArray.forEach(function (item,index) {
                    Activity.cannonArray.push({
                        cannonAngle :index,        //飞机移动的偏移值数组
                        snowBallX : item ,       // 雪球当前角度横坐标
                        snowBallY : 556 ,         // 雪球当前角度纵坐标
                        snowBallXMoveDistence : 0,          // 偏移量X
                        snowBallYMoveDistence : Activity.shortDistence           // 偏移量Y
                    })
                })
            }


            Activity.mindArray = [
                LMActivity.makeImageUrl('icon_balloon.png'),
            ];

            Activity.waterImgSrc = LMActivity.makeImageUrl('icon_bullet.png');

        },


        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_back':  //返回按钮
                    LMActivity.innerBack();
                    break;
                case 'btn_order_submit': //订购按钮
                    if (RenderParam.isVip == 1) {
                        LMEPG.UI.showToast("你已经订购过，不用再订购！");
                    } else {
                        LMActivity.Router.jumpBuyVip();
                    }
                    break;
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            if (LMActivity.playStatus = 'false') {
                                LMActivity.showModal({
                                    id: 'game_container',
                                    focusId: 'btn_plane',
                                });
                                Activity.startGame();
                                Activity.shot();
                            }
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_game_sure':
                case 'btn_close_exchange':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    LMActivity.playStatus = false;
                    break;
                case 'exchange_prize_1':
                case 'exchange_prize_2':
                case 'exchange_prize_3':
                    Activity.exchangePrize(btn.order);
                    break;
            }
        },

        exchangePrize: function (prizeIndex) {
            if (LMActivity.isCashingPrize()) return;
            var prizeId = (r.exchangePrizeList.data)[prizeIndex].goods_id;
            LMActivity.AjaxHandler.exchangePrize(prizeId, function () {
                Activity.exchangePrizeSuccess(prizeId)
            }, function (errCode) {
                LMActivity.exchangePrizeFail(errCode);
            });
            // Activity.exchangePrizeSuccess(1); 不用使用积分，直接让兑换成功
        },

        exchangePrizeSuccess: function (prizeId) {
            LMActivity.exchangePrizeId = prizeId;
            G('prize_image').src = a.prizeImage[prizeId + ''];
                LMActivity.showModal({
                id: 'exchange_success',
                focusId: 'btn_exchange_submit',
                onDismissListener: function () {
                    LMActivity.Router.reload();
                }
            })
        },

        bullet: function() {
            Activity.move1 = setInterval(function () {
                Activity.shot();
            },2000)
        },

        startGame: function () {
            LMActivity.playStatus = true;
            Activity.lastClickTime = Date.now();
            G('btn_plane').style.left = Activity.cannonLeft + 'px';

            Activity.shotMindCount = 0;
            Activity.shotMindCount2 = 0;
            Activity.mindElementArray = [];
            Activity.bullet();
            Activity.createGameMind();
            // 每1s出现一个气球
            Activity.mindInterval = setInterval(function () {
                Activity.createGameMind();
            },2000);

            var gameCountdown = $('game_countdown');
            Activity.gameCount = 30;
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
                        clearInterval(Activity.move1);

                        Activity.checkGameResult();
                    }
                }
            }, 1000);
        },

        checkGameResult: function () {
            if (Activity.shotMindCount2 >= 5) {
                Activity.score=Math.floor(Activity.shotMindCount2/5);
                Activity.score1=Activity.shotMindCount2;
                $('shot_count2').innerHTML = String(Activity.score1)
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

        //应该是这里用来进行设置气球的运动位置
        createGameMind: function () {
            var mindIndex = getRandom(0, Activity.mindArray.length - 1); //从列表中随机生成气球，但是我们没有列表就只能生成同一个气球
            var mindPositionIndex = getRandom(0, Activity.mindPositionArray.length - 1); //这是我们定义的偏移值的列表，随机取个点生成气球
            var mindElement = document.createElement('img'); //通过指定名称创建一个元素
            var gameContainer = document.getElementById('game_container'); //通过id引用对象
            mindElement.src = Activity.mindArray[mindIndex];
            // 设置目标初始掉落位置
            mindElement.style.left = Activity.mindPositionArray[mindPositionIndex] + 'px';
            mindElement.style.top =  '321px';
            gameContainer.appendChild(mindElement);
            Activity.mindElementArray.push(mindElement);
            Activity.mindMoveIntervel = setInterval(function () {
                if (Activity.gameRunning) {
                    var mindTop = parseInt(mindElement.style.top) + Activity.mindMoveDistence;
                    if (mindTop < Activity.gameTop) {
                        Activity.removeElement(mindElement);
                    } else {
                        mindElement.style.top = mindTop + 'px';
                    }
                }
            }, 200);
        },

        //控制子弹的发射
        shot: function () {
            var waterElement = document.createElement('img');
            var gameContainer = document.getElementById('game_container');
            waterElement.src = Activity.waterImgSrc;
            var currObj = Activity.cannonArray[Activity.cannonIndex];   //当前数组元素

            waterElement.style.left = currObj.snowBallX + 'px';
            waterElement.style.top = currObj.snowBallY - 100 + 'px'; //发射的子弹的初始位置
            gameContainer.appendChild(waterElement);
            Activity.waterInterval = setInterval(function () {
                if (Activity.gameRunning && waterElement !== null) {

                    var waterLeft = parseInt(waterElement.style.left) - currObj.snowBallXMoveDistence;
                    var waterTop = parseInt(waterElement.style.top) - currObj.snowBallYMoveDistence;
                    // 子弹越界时 移除子弹
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
                                Activity.shotMindCount2++;
                                Activity.removeElement(waterElement);
                                waterElement = null;
                                mindElement.src = r.imagePath +'/icon_bomb.png';
                                setTimeout(function () {
                                    Activity.removeElement(mindElement);
                                    mindElement = null;
                                },100);
                                Activity.mindElementArray.splice(index, 1);
                                break;
                            }
                        }
                    }
                }
            }, 200);
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
            G('btn_plane').style.left = Activity.cannonArray[Activity.cannonIndex].snowBallX + 'px';
            G('btn_plane').style.top = Activity.cannonArray[Activity.cannonIndex].snowBallY + 'px';
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
            nextFocusLeft: 'btn_start',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则-返回',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler
        },{
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
            backgroundImage: a.makeImageUrl('btn_change_gift.png'),
            focusImage: a.makeImageUrl('btn_change_gift_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
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
            id: 'btn_plane',
            name: '飞机',
            type: 'img',
            beforeMoveChange: Activity.cannonMove,
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
        },{
            id: 'btn_close_exchange',
            name: '按钮-兑换-返回',
            type: 'img',
            nextFocusDown: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusUp: 'btn_close_exchange',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusUp: 'btn_close_exchange',
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
            nextFocusUp: 'btn_close_exchange',
            nextFocusLeft: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp:'exchange_tel',
            nextFocusRight: 'btn_exchange_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit',
            nextFocusUp:'exchange_tel',
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

var specialBackArea = ['460092', "410092",'10220094'];

/**
 * 退出，返回
 */
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}
