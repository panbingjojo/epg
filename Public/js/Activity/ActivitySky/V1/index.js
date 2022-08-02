(function (w, e, r, a) {
    var Activity = {
        lotteryStatus: false,
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
            Activity.showStar();
        }
        ,

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            // 兑换奖品
            a.prizeImage = {
                "1": regionalImagePath + '/icon_prize_1.png',
                "2": regionalImagePath + '/icon_prize_2.png',
                "3": regionalImagePath + '/icon_prize_3.png',
            }

        }
        ,

        initButtons: function () {
            e.BM.init('btn-start', Activity.buttons, true);
        }
        ,
        playGame: function () {
            LMEPG.ButtonManager.setKeyEventPause(true);
        }
        ,

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_knowledge':
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.showModal({
                        id: 'modal-knowledge',
                        focusId: ''
                    });
                    break;
                case 'btn_game_success':
                case 'btn_fail':
                    a.Router.reload(); // 重新加载
                    break;
                case 'btn-start':
                    if (Activity.lotteryStatus) {
                        // 集满可抽奖
                        a.doLottery();
                        // 清空星星
                        var starArr = {"starArr": ["0", "0", "0", "0", "0", "0", "0"]};
                        Activity.saveLight(starArr, 2);
                    } else {
                        if (a.hasLeftTime()) {
                            // 扣除游戏次数
                            Activity.doLight();
                        } else {
                            LMActivity.triggerModalButton = btn.id;
                            a.showGameStatus();
                        }
                    }
                    break;
                case 'btn-play':
                    Activity.playGame();
                    break;
            }
        },

        doLight: function () {
            a.AjaxHandler.uploadPlayRecord(function () {
                // 改变点亮状态值
                var starArr = r.valueStar.starArr;
                // 返回没有被点亮的星星随机序号
                var starIndex = Activity.getRandomLightIndex(starArr);
                if (starIndex != -1) {
                    for (var i = 0; i < starArr.length; i++) {
                        if (i == starIndex) {
                            starArr[i] = "1";
                        }
                    }
                    var starLight = {"starArr": starArr};
                    Activity.saveLight(starLight, 1);
                }
            }, function () {
                LMEPG.UI.showToast('扣除游戏次数失败', 2);
            });
        }
        ,

        // 返回没有被点亮的星星序号
        getRandomLightIndex: function (starArr) {
            // 返回没有被点亮的星星序号
            var isNoLightIndex = [];
            for (var i = 0; i < starArr.length; i++) {
                if (starArr[i] == "0") {
                    isNoLightIndex.push(i);
                }
            }
            if (isNoLightIndex.length == 0) {
                return -1;
            } else {
                var index = Math.floor((Math.random() * isNoLightIndex.length));
                return isNoLightIndex[index];
            }
        },
        saveLight: function (arr, type) {
            a.AjaxHandler.saveData(r.keyStar, JSON.stringify(arr), function () {
                if (type == 1) {
                    LMEPG.UI.showToast('点亮星星成功', 2);
                    LMActivity.Router.reload();
                }
            }, function () {
                LMEPG.UI.showToast('点亮星星失败', 2);
            });
        },
        showStar: function () {
            // 改变点亮状态值
            var starArr = r.valueStar.starArr;
            var roleCount = [];
            // 返回没有被点亮的星星随机序号
            for (var i = 0; i < starArr.length; i++) {
                if (starArr[i] == "1") {
                    G("star-" + (i + 1)).style.display = "block";
                    roleCount.push(i);
                }
            }
            if (roleCount.length == 7) {
                G("role").style.display = "block";
                Activity.lotteryStatus = true;
                G("btn-start").src = a.makeImageUrl('lotter_f.png');
                LMEPG.BM.getButtonById("btn-start").backgroundImage = a.makeImageUrl('lotter.png');
                LMEPG.BM.getButtonById("btn-start").focusImage = a.makeImageUrl('lotter_f.png');
            }
        }

    }


    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn-start',
            nextFocusLeft: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn-start',
            nextFocusRight: 'btn_back',
            nextFocusUp: '',
            nextFocusLeft: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: '',
            nextFocusLeft: '',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: '',
            nextFocusRight: 'btn_activity_rule',
            nextFocusDown: 'btn-start',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn-start',
            name: '开始游戏按钮',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusRight: '',
            nextFocusLeft: '',
            backgroundImage: a.makeImageUrl('play.png'),
            focusImage: a.makeImageUrl('play_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: "",
            nextFocusLeft: 'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            listType: 'lottery',
            click: a.eventHandler,
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            nextFocusUp: "",
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
            id: 'btn_fail',
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
            id: 'exchange_tel',
            name: '输入框-兑换成功-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit',
            backFocusId: 'btn_exchange_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        },
        {
            id: 'btn-play',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusRight: 'btn_game_over_sure',
            nextFocusUp: 'btn_game_over_sure',
            backgroundImage: a.makeImageUrl('btn_play.png'),
            focusImage: a.makeImageUrl('btn_play_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn-play',
            nextFocusDown: 'btn-play',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler
        }, {
            id: 'lottery_tel',
            name: '输入框-中奖-电话号码',
            type: 'div',
            nextFocusRight: 'btn_lottery_submit',
            backFocusId: 'btn_lottery_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-抽奖失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler,
        }, {
            id: 'btn_lottery_submit',
            name: '按钮-中奖-确定',
            type: 'img',
            nextFocusLeft: RenderParam.platformType == 'hd' ? 'lottery_tel' : '',
            nextFocusUp: RenderParam.platformType == 'sd' ? 'lottery_tel' : '',
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp: RenderParam.platformType == 'sd' ? 'lottery_tel' : '',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler,
            //backFocusId: 'btn_start'
        },
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);