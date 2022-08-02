(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score:0,
        init: function () {
            // 中国联通活动不再弹窗倒计时
            if (r.lmcid == '000051') {
                r.valueCountdown.showDialog = '0';
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
        initGameData:function () {
            if(r.platformType == 'hd'){
                Activity.boyLeft = 484; // 男孩距离左边初始距离
                Activity.boyHalfWidth = 138;  //男孩半宽
                Activity.boyMoveDistence = 180; // 男孩移动距离
                Activity.gameLeft = 124; // 男孩距离左边最小距离
                Activity.gameMaxleft = 1200; //男孩距离左边最大距离
                Activity.gameTop = 520; //心情目标最大掉落高度
                Activity.mindPositionArray = [180, 360, 540, 720, 900, 1080]; // 心情目标掉落位置
                Activity.mindHalfWidth = 82;
                Activity.mindHeight = 148;
                Activity.mindMoveDistence = 14;
                Activity.mindIntersect = 350;   //dom 相交
            }else{
                Activity.boyLeft = 215; // 男孩距离左边初始距离
                Activity.boyHalfWidth = 105;  //男孩半宽
                Activity.boyMoveDistence = 130; // 男孩移动距离
                Activity.gameLeft = 85; // 男孩距离左边最小距离
                Activity.gameMaxleft = 500; //男孩距离左边最大距离
                Activity.gameTop = 380; //心情目标最大掉落高度
                Activity.mindPositionArray = [130, 260, 390, 520]; // 心情目标掉落位置
                Activity.mindHalfWidth = 60;
                Activity.mindHeight = 109;
                Activity.mindMoveDistence = 10;
                Activity.mindIntersect = 256;   //dom 相交
            };

            Activity.mindArray = [
                LMActivity.makeImageUrl('icon_lazy.png'),   // 下标为0 懒惰 减分
                LMActivity.makeImageUrl('icon_diligent.png'),
                LMActivity.makeImageUrl('icon_ground.png'),
                LMActivity.makeImageUrl('icon_hardwork.png'),
                LMActivity.makeImageUrl('icon_insist.png'),
                LMActivity.makeImageUrl('icon_plain.png'),
                LMActivity.makeImageUrl('icon_soul.png')
            ];
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_tips':
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.showModal({
                        id: 'tips',
                        focusId: 'btn_close_tips'
                    });
                    break;
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            if (LMActivity.playStatus = 'false') {
                                LMActivity.showModal({
                                    id: 'game_container',
                                    focusId: 'btn_boy',
                                    onDismissListener: function () {
                                        // 清除游戏状态
                                        Activity.gameRunning = false;
                                        $('game_container').innerHTML = '';
                                        if (Activity.gameCount > 0) {
                                            clearInterval(Activity.gameInterval);
                                            clearInterval(Activity.mindInterval);
                                            clearInterval(Activity.mindMoveIntervel);
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
            G('btn_boy').style.left = Activity.boyLeft + 'px';

            Activity.shotMindCount = 0;
            Activity.mindElementArray = [];

            Activity.createGameMind();
            // 每1s创建一个表情
            Activity.mindInterval = setInterval(function () {
                Activity.createGameMind();
            },1000);

            var gameCountdown = $('game_countdown');
            Activity.gameCount = 15;
            gameCountdown.innerHTML = '倒计时：'+String(Activity.gameCount)+'S';
            Activity.gameRunning = true;
            // 启动游戏定时器
            Activity.gameInterval = setInterval(function () {
                if (Activity.gameRunning) {
                    Activity.gameCount = Activity.gameCount - 1;
                    gameCountdown.innerHTML = '倒计时：'+ String(Activity.gameCount)+'S';
                    // 倒计时为0 弹窗游戏结果
                    if (Activity.gameCount == 0) {
                        Activity.gameRunning = false;
                        Activity.gameCount = 0;
                        clearInterval(Activity.gameInterval);
                        clearInterval(Activity.mindInterval);
                        clearInterval(Activity.mindMoveIntervel);

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
            mindElement.id = mindIndex;
            mindElement.style.left = Activity.mindPositionArray[mindPositionIndex] + 'px';
            // console.log(mindElement.style.left);
            mindElement.style.top =  '0px';
            gameContainer.appendChild(mindElement);
            Activity.mindElementArray.push(mindElement);
            Activity.mindMoveIntervel = setInterval(function () {
                if (Activity.gameRunning && mindElement != null) {
                    var mindTop = parseInt(mindElement.style.top) + Activity.mindMoveDistence;
                    if (mindTop > Activity.gameTop) {
                        Activity.removeElement(mindElement);
                    } else {
                        mindElement.style.top = mindTop + 'px';

                        var boy = G('btn_boy');
                        boyLeft = parseInt(boy.offsetLeft) +Activity.boyHalfWidth;
                        boyTop = parseInt(boy.offsetTop);
                        //遍历查找掉落元素 并判断是否接到
                        for(var index = 0;index < Activity.mindElementArray.length;index ++){
                            var mindElementDom = Activity.mindElementArray[index];
                            var mindElementDomLeft = parseInt(mindElementDom.offsetLeft)+Activity.mindHalfWidth;
                            var mindElementDomTop = parseInt(mindElementDom.offsetTop);

                            if ((Math.abs(boyLeft - mindElementDomLeft) <=2) && (Math.abs(Activity.mindIntersect - mindElementDomTop) <= 5 )) {
                                // dom相交,计算得分且清除dom  碰到懒得减1分其他加1分
                                mindElementDom.id == '0' ? Activity.shotMindCount--:Activity.shotMindCount++;
                                console.log(Activity.shotMindCount);
                                // G('curr_score').innerHTML = '得分：'+Activity.shotMindCount;
                                Activity.removeElement(mindElement);
                                mindElement = null;
                                Activity.mindElementArray.splice(index, 1);
                                break;
                            }
                        }
                    }
                }
            }, 100);
        },

        boyMove: function (direction, button) {
            var boy = G(button.id);
            var boyLeft = parseInt(boy.style.left);
            switch (direction) {
                case 'left':
                    if (boyLeft - Activity.boyMoveDistence >= Activity.gameLeft) {
                        boy.src = r.imagePath + '/btn_people_l.png';
                        boy.style.left = (boyLeft - Activity.boyMoveDistence) + 'px';
                    }
                    break;
                case 'right':
                    if (boyLeft + Activity.boyMoveDistence < Activity.gameMaxleft ) {
                        boy.src = r.imagePath + '/btn_people_r.png';
                        boy.style.left = (boyLeft + Activity.boyMoveDistence) + 'px';
                    }
                    break;
            }
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
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: 'btn_back',
            nextFocusLeft: 'btn_start',
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
        }, {
            id: 'btn_close_tips',
            name: '按钮-活动小贴士-返回',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        }, {
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
            // listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-ready',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_tips',
            nextFocusRight: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_tips',
            name: '按钮-小贴士',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusRight: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_tips.png'),
            focusImage: a.makeImageUrl('btn_tips_f.png'),
            click: Activity.eventHandler
        },{
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
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
        }, {
            id: 'btn_boy',
            name: '图片-小人',
            type: 'img',
            beforeMoveChange: Activity.boyMove,
            // click: Activity.eventHandler
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
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusLeft: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
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
})(window, LMEPG, RenderParam, LMActivity);