(function (w, e, r, a, u) {
    var Activity = {
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
        },

        initButtons: function () {
            e.BM.init('traffic_rail', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
        },

        onTrafficFocus: function (btn, hasFocus) {
            if (hasFocus) {
                //$(btn.id).src = a.makeImageUrl('icon_tag.png');
                $(btn.id).style.visibility = 'visible';
            } else {
                //$(btn.id).src = "";
                $(btn.id).style.visibility = 'hidden';
            }
        },

        renderGameSuccess: function (trafficObj) {
            $('traffic_photo').src = a.makeImageUrl(trafficObj.photo);
            $('traffic_score').innerHTML = trafficObj.traffic_score;
        },

        doLightPhoto: function (index) {
            var trafficArr = r.valueTraffic.trafficArr;
            var lightStatus = trafficArr[index];
            switch (lightStatus) {
                case '0':
                    u.dialog.showToast('您还没有获取到这张图片~', 2);
                    break;
                case '2':
                    u.dialog.showToast('您已经点亮过这张图片了~', 2);
                    break;
                case '1':
                    trafficArr[index] = "2";
                    var trafficJson = {
                        "trafficArr": trafficArr
                    };
                    a.AjaxHandler.saveData(r.keyTraffic, JSON.stringify(trafficJson),function () {
                        var photo = 'light_photo_' + index;
                        $(photo).src = a.makeImageUrl('enable_photo_' + index + '.png');
                    },function () {

                    });
                    break;
            }
        },

        renderSceneryPhoto: function () {
            var trafficArr = r.valueTraffic.trafficArr;
            for (var index = 0;index < trafficArr.length;index ++){
                var lightStatus = trafficArr[index];
                var photo = 'light_photo_' + index;
                if (lightStatus === '2'){
                    $(photo).src = a.makeImageUrl('enable_photo_' + index + '.png');
                }else {
                    $(photo).src = a.makeImageUrl('unable_photo_' + index + '.png');
                }
            }
        },

        doTravel: function (travelId) {
            a.AjaxHandler.uploadPlayRecord(function () {
                // 保存积分
                var trafficObj = Activity.traffic[travelId];
                a.AjaxHandler.addScore(trafficObj.traffic_score,function () {
                    // 改变点亮状态值
                    var trafficArr = r.valueTraffic.trafficArr;
                    if (trafficArr[trafficObj.light_index] === '0'){
                        trafficArr[trafficObj.light_index] = "1";
                        var trafficJson = {
                            "trafficArr": trafficArr
                        };
                        a.AjaxHandler.saveData(r.keyTraffic, JSON.stringify(trafficJson),function () {
                            Activity.renderGameSuccess(trafficObj);
                            a.showModal({
                                id: 'game_success',
                                focusId: 'btn_game_success'
                            });
                        },function () {
                            u.dialog.showToast('保存出游美景照片失败',2);
                        });
                    }else {
                        Activity.renderGameSuccess(trafficObj);
                        a.showModal({
                            id: 'game_success',
                            focusId: 'btn_game_success'
                        });
                    }
                },function () {
                    u.dialog.showToast('添加游乐值失败',2);
                });

            },function () {
                u.dialog.showToast('扣除游戏次数失败',2);
            });
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_scenery_photo':
                    Activity.renderSceneryPhoto();
                    a.triggerModalButton = btn.id;
                    a.showModal({
                        id: 'scenery_photo',
                        focusId: 'btn_light_0'
                    });
                    break;
                case 'traffic_rail':
                case 'traffic_bus':
                case 'traffic_plane':
                case 'traffic_bicycle':
                case 'traffic_ship':
                case 'traffic_car':
                    a.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        // 扣除游戏次数
                        Activity.doTravel(btn.id);
                    } else {
                        a.showGameStatus();
                    }
                    break;
                case 'btn_light_0':
                case 'btn_light_1':
                case 'btn_light_2':
                case 'btn_light_3':
                case 'btn_light_4':
                case 'btn_light_5':
                    Activity.doLightPhoto(btn.index);
                    break;
                case 'btn_game_success':
                    a.Router.reload(); // 重新加载
                    break;
            }
        }
    };

    Activity.traffic = {
        traffic_rail: {
            light_index: 0,
            photo: 'enable_photo_0.png',
            traffic_score: '5'
        }, traffic_bus: {
            light_index: 1,
            photo: 'enable_photo_1.png',
            traffic_score: '4'
        }, traffic_plane: {
            light_index: 2,
            photo: 'enable_photo_2.png',
            traffic_score: '4'
        }, traffic_bicycle: {
            light_index: 3,
            photo: 'enable_photo_3.png',
            traffic_score: '5'
        }, traffic_ship: {
            light_index: 4,
            photo: 'enable_photo_4.png',
            traffic_score: '3'
        }, traffic_car: {
            light_index: 5,
            photo: 'enable_photo_5.png',
            traffic_score: '3'
        }
    };

    Activity.exchangePrizeButtons = [
        {
            id: 'exchange_prize_1',
            name: '按钮-兑换一等奖',
            type: 'img',
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            order: 0,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换二等奖',
            type: 'img',
            nextFocusRight: 'exchange_prize_1',
            nextFocusLeft: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            order: 1,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换三等奖',
            type: 'img',
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            order: 2,
            click: a.eventHandler
        }
    ];

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换奖品',
            type: 'img',
            nextFocusDown: 'traffic_ship',
            nextFocusUp: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            exchangePrizeButtons: Activity.exchangePrizeButtons,
            exchangeFocusId:'',
            moveType: 1,
            click: a.eventHandler
        }, {
            id: 'btn_scenery_photo',
            name: '按钮-美景汇',
            type: 'img',
            nextFocusDown: 'traffic_plane',
            nextFocusRight: 'traffic_plane',
            backgroundImage: a.makeImageUrl('btn_scenery_photo.png'),
            focusImage: a.makeImageUrl('btn_scenery_photo_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'traffic_rail',
            name: '按钮-高铁',
            type: 'img',
            nextFocusUp: 'traffic_plane',
            nextFocusRight: 'traffic_car',
            focusChange: Activity.onTrafficFocus,
            click: Activity.eventHandler
        }, {
            id: 'traffic_plane',
            name: '按钮-飞机',
            type: 'img',
            nextFocusUp: 'btn_scenery_photo',
            nextFocusDown: 'traffic_car',
            focusChange: Activity.onTrafficFocus,
            click: Activity.eventHandler
        }, {
            id: 'traffic_car',
            name: '按钮-共享汽车',
            type: 'img',
            nextFocusUp: 'traffic_plane',
            nextFocusLeft: 'traffic_rail',
            nextFocusRight: 'traffic_bus',
            focusChange: Activity.onTrafficFocus,
            click: Activity.eventHandler
        }, {
            id: 'traffic_bus',
            name: '按钮-公交',
            type: 'img',
            nextFocusLeft: 'traffic_car',
            nextFocusRight: 'traffic_bicycle',
            focusChange: Activity.onTrafficFocus,
            click: Activity.eventHandler
        }, {
            id: 'traffic_bicycle',
            name: '按钮-自行车',
            type: 'img',
            nextFocusLeft: 'traffic_bus',
            nextFocusRight: 'traffic_ship',
            focusChange: Activity.onTrafficFocus,
            click: Activity.eventHandler
        }, {
            id: 'traffic_ship',
            name: '按钮-自行车',
            type: 'img',
            nextFocusLeft: 'traffic_bicycle',
            nextFocusUp: 'btn_exchange_prize',
            focusChange: Activity.onTrafficFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusLeft: 'reset_tel',
            nextFocusUp: r.platformType === 'hd' ? '' : 'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            nextFocusUp: r.platformType === 'hd' ? '' : 'reset_tel',
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
            id: 'btn_light_0',
            name: '按钮-点亮',
            type: 'img',
            index: 0,
            nextFocusRight: 'btn_light_1',
            nextFocusDown: 'btn_light_3',
            backgroundImage: a.makeImageUrl('btn_light.png'),
            focusImage: a.makeImageUrl('btn_light_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_light_1',
            name: '按钮-点亮',
            type: 'img',
            index: 1,
            nextFocusRight: 'btn_light_2',
            nextFocusLeft: 'btn_light_0',
            nextFocusDown: 'btn_light_4',
            backgroundImage: a.makeImageUrl('btn_light.png'),
            focusImage: a.makeImageUrl('btn_light_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_light_2',
            name: '按钮-点亮',
            type: 'img',
            index: 2,
            nextFocusLeft: 'btn_light_1',
            nextFocusDown: 'btn_light_5',
            backgroundImage: a.makeImageUrl('btn_light.png'),
            focusImage: a.makeImageUrl('btn_light_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_light_3',
            name: '按钮-点亮',
            type: 'img',
            index: 3,
            nextFocusRight: 'btn_light_4',
            nextFocusUp: 'btn_light_0',
            backgroundImage: a.makeImageUrl('btn_light.png'),
            focusImage: a.makeImageUrl('btn_light_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_light_4',
            name: '按钮-点亮',
            type: 'img',
            index: 4,
            nextFocusLeft: 'btn_light_3',
            nextFocusRight: 'btn_light_5',
            nextFocusUp: 'btn_light_1',
            backgroundImage: a.makeImageUrl('btn_light.png'),
            focusImage: a.makeImageUrl('btn_light_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_light_5',
            name: '按钮-点亮',
            type: 'img',
            index: 5,
            nextFocusLeft: 'btn_light_4',
            nextFocusUp: 'btn_light_2',
            backgroundImage: a.makeImageUrl('btn_light.png'),
            focusImage: a.makeImageUrl('btn_light_f.png'),
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
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_cancel',
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
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity, LMUtils);