(function (w, e, r, a) {
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
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
            // 可抽中材料
            a.prizeImage = {
                "1": regionalImagePath + '/icon_prize_1.png',
                "2": regionalImagePath + '/icon_prize_2.png',
                "3": regionalImagePath + '/icon_prize_3.png',
                "4": regionalImagePath + '/icon_prize_4.png',
                "5": regionalImagePath + '/icon_prize_5.png'
            };
            if(r.lmcid == '420092'){
                // 加载第4个礼物灯笼数量
                $('exchange_point_4').innerHTML = r.exchangePrizeList.data[3].consume_list[0].consume_count;

                // 灯笼数位置
                $('exchange_point_1').style.left = '395px';
                $('exchange_point_2').style.left = '660px';
                $('exchange_point_3').style.left = '925px';
                $('exchange_point_4').style.left = '1165px';
                $('exchange_point_4').style.display = 'block';
                // 兑换按钮位置
                $('exchange_prize_1').style.left = '280px';
                $('exchange_prize_2').style.left = '550px';
                $('exchange_prize_3').style.left = '800px';
                $('exchange_prize_4').style.left = '1040px';
                $('exchange_prize_4').style.display = 'block';
            };
        },

        initGameData: function () {
            enterDay = Activity.getCurrentDate();
            if(r.valueEnterDay !== enterDay){
                Activity.startGame();
                $('lottery_success').style.backgroundImage = 'url('+ r.imagePath + '/bg_first_enter.png)';
                // 存入游戏日期
                r.valueEnterDay = enterDay;
                LMActivity.AjaxHandler.saveData(r.enterDay, r.valueEnterDay, function () {
                    //等待页面刷新
                })
            }

            // 默认灯笼数
            var lanternNum = 0;
            // 用户材料
            var prizeArray = r.myLotteryRecord.list;
            // 循环取出当前用户材料信息渲染到页面
            if (prizeArray.length < 5) {
                // 未集齐灯笼数为0
                $('lantern').innerHTML = lanternNum;
                $('exchange_lantern').innerHTML = lanternNum;
                // 未集齐显示当前材料数
                for (i = 0; i < prizeArray.length; i++) {
                    prizeName = prizeArray[i].prize_name;
                    prizeCount = prizeArray[i].prize_count;

                    if (prizeName == '浆糊') {
                        $('num_1').innerHTML = prizeCount;
                        $('exchange_num_1').innerHTML = prizeCount;
                    } else if (prizeName == '蜡烛') {
                        $('num_2').innerHTML = prizeCount;
                        $('exchange_num_2').innerHTML = prizeCount;
                    } else if (prizeName == '纸张') {
                        $('num_3').innerHTML = prizeCount;
                        $('exchange_num_3').innerHTML = prizeCount;
                    } else if (prizeName == '颜料') {
                        $('num_4').innerHTML = prizeCount;
                        $('exchange_num_4').innerHTML = prizeCount;
                    } else if (prizeName == '竹子') {
                        $('num_5').innerHTML = prizeCount;
                        $('exchange_num_5').innerHTML = prizeCount;
                    }
                }
            } else if (prizeArray.length == 5) {
                // 集齐材料显示灯笼数
                var minIndex = 0;
                prizeArray.forEach(function (v, k, data) {
                    if (parseInt(v.prize_count) < parseInt(data[minIndex].prize_count)) {
                        minIndex = k;
                    }
                });
                lanternNum = parseInt(prizeArray[minIndex].prize_count);

                $('lantern').innerHTML = lanternNum;
                $('exchange_lantern').innerHTML = lanternNum;

                for (i = 0; i < prizeArray.length; i++) {
                    prizeName = prizeArray[i].prize_name;
                    // 显示扣除灯笼后的材料数
                    prizeCount = parseInt(prizeArray[i].prize_count) - lanternNum;

                    if (prizeName == '浆糊') {
                        $('num_1').innerHTML = prizeCount;
                        $('exchange_num_1').innerHTML = prizeCount;
                    } else if (prizeName == '蜡烛') {
                        $('num_2').innerHTML = prizeCount;
                        $('exchange_num_2').innerHTML = prizeCount;
                    } else if (prizeName == '纸张') {
                        $('num_3').innerHTML = prizeCount;
                        $('exchange_num_3').innerHTML = prizeCount;
                    } else if (prizeName == '颜料') {
                        $('num_4').innerHTML = prizeCount;
                        $('exchange_num_4').innerHTML = prizeCount;
                    } else if (prizeName == '竹子') {
                        $('num_5').innerHTML = prizeCount;
                        $('exchange_num_5').innerHTML = prizeCount;
                    }
                }
            }

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
                                Activity.startGame();
                            }, function () {
                                LMEPG.UI.showToast('扣除游戏次数出错', 3);
                            });
                        } else {
                            a.showGameStatus('btn_game_over_sure');
                        }
                        break;
                    // 4个礼物兑换按钮增加兑换响应事件
                    case 'exchange_prize_4':
                        LMActivity.exchangePrize(btn.order);
                        break;
                    case 'btn_lottery_cancel':
                    case 'btn_lottery_exit':
                    case 'btn_game_fail_sure':
                    case 'btn_lottery_submit':
                    case 'btn_order_cancel':
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        break;
                }
            },
            startGame: function () {
                LMActivity.doLottery();
            },

            getCurrentDate:function () {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                if(month < 10){
                    month+='0';
                }
                if(day < 10){
                    day+='0';
                }
                strData = year+'-'+month+'-'+day;
                return strData;
            }
        };


    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
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
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusLeft: '',
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
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_start.gif'),
            focusImage: a.makeImageUrl('btn_start_f.gif'),
            // listType: 'exchange',
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusLeft:'reset_tel',
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
            // nextFocusDown: 'btn_list_submit',
            nextFocusRight: 'btn_list_cancel',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        },{
            id: 'btn_lottery_submit',
            name: '按钮-游戏成功确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        },{
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange.png'),
            focusImage: a.makeImageUrl('btn_exchange_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange.png'),
            focusImage: a.makeImageUrl('btn_exchange_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight:r.lmcid == '420092' ? 'exchange_prize_4':'',
            backgroundImage: a.makeImageUrl('btn_exchange.png'),
            focusImage: a.makeImageUrl('btn_exchange_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_4',
            name: '按钮-兑换4',
            type: 'img',
            order: 3,
            nextFocusLeft: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange.png'),
            focusImage: a.makeImageUrl('btn_exchange_f.png'),
            click: Activity.eventHandler
        },{
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