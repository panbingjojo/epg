(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score:0,
        boxList: [
            LMActivity.makeImageUrl('camel_box.png'),
            LMActivity.makeImageUrl('yellow_box.png')
        ],
        clickTimes: false,

        init: function () {
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
            a.prizeImage = {
                "1": regionalImagePath + '/icon_gift_1.png',
                "2": regionalImagePath + '/icon_gift_2.png',
                "3": regionalImagePath + '/icon_gift_3.png'
            };

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
                                    focusId: 'crane',
                                });
                                Activity.startCountdown();
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
            }
        },

        startCountdown:function () {
            var countDown = 30;
            G('game_countdown').innerHTML = countDown
            var countDownTimer = setInterval(function () {
                countDown--
                G('game_countdown').innerHTML = countDown
                if(countDown === 0){
                    clearInterval(countDownTimer)
                    Activity.checkGameResult();
                }
            },1000)
        },

        /**
         * 游戏开始
         * */
        startGame: function (btn) {
            if (Activity.clickTimes == false) {
                Activity.clickTimes = !Activity.clickTimes;
                var leftOffset = 40;
                var eleMaxLeft = 861;
                var moveTimer = setInterval(function () {
                    G(btn.id).style.top = -20 + 'px';
                    G('box').style.top = 411 + 'px';
                    if (G(btn.id) !== null) {
                        var eleLeft = G(btn.id).offsetLeft + leftOffset;
                        var eleLeft1 = G('box').offsetLeft + leftOffset;
                        if (eleLeft >= eleMaxLeft) {
                            clearInterval(moveTimer);
                            Activity.boxDrop();
                        } else {
                            G(btn.id).style.left = eleLeft + 'px';
                            G('box').style.left = eleLeft1 + 'px';
                        }
                    }
                }, 200);
            }
        },

        /**
         * 箱子货物随机生成并渲染
         * */
        randomGeneration: function () {
            var boxEle = getRandom(0,Activity.boxList.length - 1);
            var ele = Activity.boxList[boxEle]
            if (boxEle == 1) {
                var area = '<img src="' + ele + '" id="box" style="top: 431px;left: 480px;">'
            }else {
                var area = '<img src="' + ele + '" id="box" style="top: 431px;left: 475px;">'
            }
            G('game_container').innerHTML += area;
        },

        /**
         * 箱子下坠操作
         * */
        boxDrop: function () {
            var eleMaxTop = 556;
            var topOffset = 144;
            var moveTimer1 = setTimeout(function () {
                if (G('box') !== null) {
                    var eleTop = G('box').offsetTop + topOffset;
                    if (eleTop >= eleMaxTop) {
                        clearInterval(moveTimer1)
                        G('crane').style.left = 460 + 'px';
                    } else {
                        G('box').style.top = eleTop + 'px';
                    }
                }
                setTimeout(function () {
                    G('crane').style.left = 460 + 'px';
                    G('crane').style.top = 0 + 'px';
                    // 消除下坠到叉车上的箱子，在传送带上生成新的箱子
                    Activity.removeElement(G('box'));
                    Activity.score++;
                    Activity.randomGeneration();
                    Activity.clickTimes = !Activity.clickTimes;
                },500)
            },500)
        },

        /**
         * 判斷游戏是否完成
         * */
        checkGameResult: function () {
            var score = Math.floor(Activity.score/3);
            console.log(score)
            if (score > 0) {
                $('shot_count').innerHTML = String(score);
                a.AjaxHandler.addScore(parseInt(score), function () {
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

        /**
         * 删除不符合要求的元素
         * */
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
            nextFocusLeft: 'btn_winner_list',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_start',
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
            nextFocusDown: 'btn_exchange_prize',
            nextFocusRight: 'btn_back',
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
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_activity_rule',
            nextFocusLeft: 'btn_exchange_prize',
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
            click: a.eventHandler
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
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusUp: 'btn_close_exchange',
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: (r.exchangePrizeList.data.length>3)?'exchange_prize_4':'',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_4',
            name: '按钮-兑换4',
            type: 'img',
            order: 3,
            nextFocusUp: 'btn_close_exchange',
            nextFocusLeft: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
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
        }, {
            id: 'crane',
            name: '吊机',
            type: 'img',
            click: Activity.startGame,
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

var specialBackArea = ['460092', "410092",'220094','220095'];

/**
 * 退出，返回
 */
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}
