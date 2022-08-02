(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score: 1,
        plantBallList: [
            'plant_ball_0.png',
            'plant_ball_1.png',
            'plant_ball_2.png',
            'plant_ball_3.png',
            'plant_ball_4.png',
            'plant_ball_5.png',
            'plant_ball_6.png',
            'plant_ball_7.png',
            'plant_ball_8.png',
            'plant_ball_9.png',
            'plant_ball_10.png',
            'plant_ball_11.png',
            'plant_ball_12.png',
            'plant_ball_13.png',
        ],
        plantList: [
            'plant_willow.png',
            'plant_maple.png',
            'plant_camphorLeaves.png',
            'plant_huangYang.png',
            'plant_pomegranate.png',
            'plant_hibiscus.png',
            'plant_waterLily.png',
            'plant_wisteria.png',
            'plant_grapes.png',
            'plant_roses.png',
            'plant_peony.png',
            'plant_crabapple.png',
            'plant_gardenia.png',
            'plant_lotus.png',
        ],
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();

            RenderParam.lmcid == "410092" && Activity.onBack410092();

            var nowTime = new Date().getTime();
            var startDate = RenderParam.endDt;
            startDate = startDate.replace(new RegExp("-", "gm"), "/");
            var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
            if (nowTime >= endDateM) { /*活动结束*/
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
        },

        /**
         * 检查游戏状态
         * */
        gameResult: function () {
            G('count').innerHTML = '1';
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
        },

        /**
         * 渲染植物列表
         * */
        plantListR: function () {
            for (var i = 0; i < 7; i++) {
                G('plant_ball_' + i).src = LMActivity.makeImageUrl(Activity.plantBallList[i]);
            }
        },

        initButtons: function () {
            e.BM.init('plant_ball_3', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_back': //返回按钮
                    LMActivity.innerBack();
                    break;
                case 'btn_order_submit': //订购按钮
                    if (RenderParam.isVip == 1) {
                        LMEPG.UI.showToast('你已经订购过，不用再订购！');
                    } else {
                        LMActivity.Router.jumpBuyVip();
                    }
                    break;
                case 'plant_ball_3':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            if (LMActivity.playStatus = 'false') {
                                Activity.gameResult();
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
                case 'btn_exchange_fail_sure':
                    a.hideModal(a.shownModal);
                    LMActivity.playStatus = false;
                    break;
            }
        },

        /**
         * 字符串指定位置添加字符串
         * */
        getIndex: function () {
            var str = Activity.plantBallList[3];
            if (str.length > 16) {
                var newmonth = Activity.insertStr(str, 13, '_f');
                return newmonth;
            } else {
                var newmonth = Activity.insertStr(str, 12, '_f');
                return newmonth;
            }
        },

        insertStr: function (soure, start, newStr) {
            return soure.slice(0, start) + newStr + soure.slice(start);
        },

        /**
         * 控制植物焦点的移动
         * */
        directionChange: function (dir) {
            if (dir === 'left') {
                Activity.plantListLeftChange();
                e.BM.getCurrentButton().focusImage = LMActivity.makeImageUrl(Activity.getIndex());
                e.BM.getCurrentButton().backgroundImage = LMActivity.makeImageUrl(
                    Activity.plantBallList[3]
                );
                e.BM.requestFocus('plant_ball_3');
            } else if (dir === 'right') {
                Activity.plantListRightChange();
                e.BM.getCurrentButton().focusImage = LMActivity.makeImageUrl(Activity.getIndex());
                e.BM.getCurrentButton().backgroundImage = LMActivity.makeImageUrl(
                    Activity.plantBallList[3]
                );
                e.BM.requestFocus('plant_ball_3');
            }
        },

        /**
         * 控制向左按键移动后植物列表发生改变
         * */
        plantListLeftChange: function () {
            var ele = Activity.plantBallList.pop();
            var ele1 = Activity.plantList.pop();
            Activity.plantBallList.unshift(ele);
            Activity.plantList.unshift(ele1);
            G('information').src = LMActivity.makeImageUrl(Activity.plantList[3]);
            Activity.plantListR();
        },

        /**
         * 控制向左按键移动后植物列表发生改变
         * */
        plantListRightChange: function () {
            var ele = Activity.plantBallList.shift();
            var ele1 = Activity.plantList.shift();
            Activity.plantBallList.push(ele);
            Activity.plantList.push(ele1);
            G('information').src = LMActivity.makeImageUrl(Activity.plantList[3]);
            Activity.plantListR();
        },

        //用户隐私政策滚动条代码
        turnDepPage: function(dir, current) {
            switch (dir) {
                case 'up':
                    if (Math.abs(G('textList').offsetTop - 370) > 370) {
                        G('textList').style.marginTop = G('textList').offsetTop + 370 + 'px';
                        G(current.id).style.top = G(current.id).offsetTop - parseInt(430 / 30) + 'px';
                        if (Math.abs(G(current.id).offsetTop) < 15) {
                            G(current.id).style.top = 14 + 'px';
                        }
                    }else {
                        LMEPG.BM.requestFocus('btn_close_authorization');
                    }
                    break;
                case 'down':
                    debugger
                    //先判断是否可以向下进行移动
                    if (Math.abs((G('textList').offsetTop - 370) + G('textList').offsetHeight) > 112 ) {
                        G('textList').style.marginTop = G('textList').offsetTop  - 370 + 'px';
                        G(current.id).style.top = G(current.id).offsetTop + parseInt(430 / 30) + 'px';
                        if (Math.abs(G(current.id).offsetTop) > 377) {
                            G(current.id).style.top = 378 + 'px';
                        }
                    }
                    break;
            }
        },

        turnDepPage1: function(dir, current) {
            switch (dir) {
                case 'up':
                    if (Math.abs(G('textList_gx').offsetTop - 370) > 370) {
                        G('textList_gx').style.marginTop = G('textList_gx').offsetTop + 370 + 'px';
                        G(current.id).style.top = G(current.id).offsetTop - parseInt(430 / 30) + 'px';
                        if (Math.abs(G(current.id).offsetTop) < 15) {
                            G(current.id).style.top = 14 + 'px';
                        }
                    }else {
                        LMEPG.BM.requestFocus('btn_close_authorization_gx');
                    }
                    break;
                case 'down':
                    debugger
                    //先判断是否可以向下进行移动
                    if (Math.abs((G('textList_gx').offsetTop - 370) + G('textList_gx').offsetHeight) > 112 ) {
                        G('textList_gx').style.marginTop = G('textList_gx').offsetTop  - 370 + 'px';
                        G(current.id).style.top = G(current.id).offsetTop + parseInt(430 / 30) + 'px';
                        if (Math.abs(G(current.id).offsetTop) > 377) {
                            G(current.id).style.top = 378 + 'px';
                        }
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
            nextFocusLeft: 'btn_winner_list',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler,
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'plant_ball_3',
            nextFocusLeft: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler,
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则-返回',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler,
        },
        {
            id: 'btn_exchange_prize',
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'plant_ball_3',
            nextFocusRight: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'plant_ball_3',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('plant_ball_3.png'),
            focusImage: a.makeImageUrl('plant_ball_3_f.png'),
            beforeMoveChange: Activity.directionChange,
            click: Activity.eventHandler,
        },
        {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusLeft: 'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            listType: 'exchange',
            click: a.eventHandler,
        },
        {
            id: 'btn_list_submit_gx',
            name: '广西电信-按钮-中奖名单-确定',
            type: 'img',
            nextFocusLeft: 'reset_tel_gx',
            nextFocusRight: 'btn_list_cancel_gx',
            nextFocusDown: 'check',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        },
        {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_list_cancel_gx',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit_gx',
            nextFocusUp: 'reset_tel_gx',
            nextFocusDown: 'check',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        },
        {
            id: 'check',
            name: '按钮-勾选',
            type: 'img',
            nextFocusRight: 'user_privacy_policy',
            nextFocusUp: 'btn_list_submit_gx',
            backgroundImage: a.makeImageUrl('btn_uncheck.png'),
            focusImage: a.makeImageUrl('btn_uncheck_f.png'),
            click: a.eventHandler
        },
        {
            id: 'user_privacy_policy',
            name: '用户隐私政策',
            type: 'img',
            nextFocusUp: 'btn_list_submit_gx',
            nextFocusLeft: 'check',
            backgroundImage: a.makeImageUrl('btn_user_privacy_policy.png'),
            focusImage: a.makeImageUrl('btn_user_privacy_policy_f.png'),
            click: a.eventHandler
        },
        {
            id: 'exchangeCheck',
            name: '按钮-勾选',
            type: 'img',
            nextFocusRight: 'user_privacy_policy_gx',
            nextFocusUp: 'btn_exchange_submit_gx',
            backgroundImage: a.makeImageUrl('btn_uncheck.png'),
            focusImage: a.makeImageUrl('btn_uncheck_f.png'),
            click: a.eventHandler
        },
        {
            id: 'user_privacy_policy_gx',
            name: '用户隐私政策',
            type: 'img',
            nextFocusUp: 'btn_exchange_submit_gx',
            nextFocusLeft: 'exchangeCheck',
            backgroundImage: a.makeImageUrl('btn_user_privacy_policy.png'),
            focusImage: a.makeImageUrl('btn_user_privacy_policy_f.png'),
            click: a.eventHandler
        },
        {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusDown: 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus,
        },
        {
            id: 'reset_tel_gx',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusDown: 'btn_list_submit_gx',
            backFocusId: 'btn_list_submit_gx',
            focusChange: a.onInputFocus,
        },
        {
            id: 'btn_game_sure',
            name: '按钮-游戏成功确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler,
        },
        {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler,
        },
        {
            id: 'btn_close_authorization',
            name: '按钮-用户隐私政策-关闭',
            type: 'img',
            nextFocusDown: 'scroll_bar_f',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_close_authorization_gx',
            name: '按钮-用户隐私政策-关闭',
            type: 'img',
            nextFocusDown: 'scroll_bar_gx_f',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'scroll_bar_f',
            name: '滚动条',
            type: 'img',
            beforeMoveChange: Activity.turnDepPage,
        },
        {
            id: 'scroll_bar_gx_f',
            name: '滚动条-兑换成功页面',
            type: 'img',
            beforeMoveChange: Activity.turnDepPage1,
        },
        {
            id: 'btn_exchange_fail_sure',
            name: '兑换失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler,
        },
        {
            id: 'btn_close_exchange',
            name: '按钮-兑换-返回',
            type: 'img',
            nextFocusDown: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: Activity.eventHandler,
        },
        {
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusUp: 'btn_close_exchange',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusUp: 'btn_close_exchange',
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusUp: 'btn_close_exchange',
            nextFocusLeft: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp: 'exchange_tel',
            nextFocusRight: 'btn_exchange_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_exchange_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit',
            nextFocusUp: 'exchange_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'exchange_tel',
            name: '输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit',
            backFocusId: 'btn_exchange_submit',
            focusChange: a.onInputFocus,
        },
        {
            id: 'exchange_tel_gx',
            name: '广西电信-输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit_gx',
            backFocusId: 'btn_exchange_submit_gx',
            focusChange: a.onInputFocus,
        },
        {
            id: 'btn_exchange_submit_gx',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp: 'exchange_tel_gx',
            nextFocusRight: 'btn_exchange_cancel_gx',
            nextFocusDown: 'exchangeCheck',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_exchange_cancel_gx',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit_gx',
            nextFocusUp: 'exchange_tel_gx',
            nextFocusDown: 'exchangeCheck',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_game_over_sure',
            name: '按钮-结束游戏',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_order_submit',
            name: '按钮-订购VIP',
            type: 'img',
            nextFocusRight: 'btn_order_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler,
        },
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['460092', '410092', '10220094', '10220095', '630092'];

/**
 * 退出，返回
 */
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);
}