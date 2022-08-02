(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score: 1,
        count: 1,
        startTimes: '',
        clickObj: {},
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
        app: [
            'btn_application_1',
            'btn_application_2',
            'btn_application_3',
            'btn_application_4',
            'btn_application_5',
        ],

        today: new Date(),

        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            Activity.renderBackground();
            a.showOrderResult();
            /** 调用getData接口获取是否预览应用数据*/
            var key = 'btn_' + RenderParam.userId;
            LMActivity.AjaxHandler.getData(key, function (data) {
                if (data.val) {
                    Activity.clickObj = JSON.parse(data.val);
                    /** 如果其中有数据并且数据日期不跟当天日期相符，删除该条记录，之后重新添加当天数据*/
                    for (var item in Activity.clickObj){
                        console.log(Activity.clickObj[item])
                        if (Activity.clickObj[item][1] != Activity.today.getDate()){
                            delete Activity.clickObj[item]
                        }
                    }
                    console.log(Activity.clickObj, "clickObj");
                    Activity.judgeBrowse();
                }
            }, function () {});

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

        renderBackground: function () {
            var url1 = LMActivity.makeImageUrl('bg_home1.png');
            var url2 = LMActivity.makeImageUrl('bg_home2.png');
            if (RenderParam.score >= 5){
                G('body').style.backgroundImage = 'url(' + url2 + ')';
            }else if (RenderParam.score >= 2) {
                G('body').style.backgroundImage = 'url(' + url1 + ')';
            }
        },

        hasLeftTime: function () {
            return r.extraTimes > 0;
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_back': //返回按钮
                    LMActivity.innerBack();
                    break;
                case 'plant_ball_3':
                    console.log(Activity.startTimes,'startTimes')
                    a.triggerModalButton = btn.id;
                    if (Activity.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            if (LMActivity.playStatus = 'false') {
                                Activity.gameResult();
                            }
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else {
                        Activity.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_game_sure':
                case 'btn_close_exchange':
                case 'btn_exchange_fail_sure':
                case 'btn_order_submit':
                    a.hideModal(a.shownModal);
                    LMActivity.playStatus = false;
                    break;

                // 跳转39健康
                case 'btn_application_2':
                    Activity.getPlayTimes(btn.id,function () {
                        var objHome = LMEPG.Intent.createIntent("home");
                        objHome.setParam("isJoinActivit", 1);
                        LMEPG.Intent.jump(objHome, LMActivity.Router.getCurrentPage(), LMEPG.Intent.INTENT_FLAG_DEFAULT);                    });
                    break
                //QQ音乐
                case 'btn_application_1':
                //wake健身
                case 'btn_application_3':
                //天天有礼
                case 'btn_application_4':
                //体考帮
                case 'btn_application_5':
                    Activity.getPlayTimes(btn.id,function (){
                        Activity.jumpThirdPartySP(btn.contentId);
                    });
                    break;
            }
        },

        /**
         * 跳转应用页面
         * */
        jumpThirdPartySP:function (contentId) {
            var objCurrent = LMActivity.Router.getCurrentPage();
            var objThirdPartySP = LMEPG.Intent.createIntent("third-party-sp");
            objThirdPartySP.setParam("userId", RenderParam.userId);
            objThirdPartySP.setParam("contentId", contentId);
            LMEPG.Intent.jump(objThirdPartySP, objCurrent);
        },

        /**
         * 判断是否增加游戏次数
         * */
        getPlayTimes: function (btn,cb) {
            // 将存入的clickObj对象用作判断是否满足条件
            var obj = Activity.clickObj;
            var date = new Date();
            LMEPG.Log.info('obj123'+JSON.stringify(obj))
            /** 如果满足条件就说明不是每天第一次进入，就直接跳转页面不增加次数，否则就增加次数并且将这次的点击计入*/
            if (!(obj[btn]) || obj[btn][1] != date.getDate()) {
                obj[btn] = [date.getMonth() + 1, date.getDate()]
                // 如果没有预览过，调用接口增加游戏次数
                LMActivity.AjaxHandler.addExtraTimes(function () {
                    //将应用的btn使用saveData传入后端
                    var key = 'btn_' + RenderParam.userId;
                    LMActivity.AjaxHandler.saveData(key, JSON.stringify(obj), function (data) {
                        console.log(btn, '添加成功');
                        cb&&cb();
                    })
                }, function () {
                    LMEPG.UI.showToast("游戏机会增加失败", 3, function () {
                    });
                });
            }else {
                cb&&cb();
            }
        },

        /**
         * 替换应用浏览过后的图片
         * */
        judgeBrowse: function () {
            var appList = [LMActivity.makeImageUrl('btn_application_music_end.png'),
                LMActivity.makeImageUrl('btn_application_39_end.png'),
                LMActivity.makeImageUrl('btn_application_wake_end.png'),
                LMActivity.makeImageUrl('btn_application_gift_end.png'),
                LMActivity.makeImageUrl('btn_application_body_end.png')
            ]
            var date = new Date();
            var res = Activity.clickObj;
            Activity.startTimes = (Object.keys(res)).length;
            console.log(res, 'res');
            for (var i = 0; i < Activity.app.length; i++) {
                if ((Activity.app[i] in res) && res[Activity.app[i]][1] == date.getDate()) {
                    var btn = LMEPG.BM.getButtonById(Activity.app[i]);
                    btn.focusImage = appList[i];
                }
            }
        },

        /**
         * 判断浏览次数是否用尽--显示没有次数弹窗
         * */
        showGameStatus: function (gameOverFocusId) {
            if (Activity.startTimes < 5) {
                LMActivity.showModal({
                    id: 'browse_products',
                    focusId: 'btn_order_submit'
                });
            } else {
                // 浏览次数用尽提示活动结束
                LMActivity.showModal({
                    id: 'game_over',
                    focusId: gameOverFocusId
                });
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

    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_application_5',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler,
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            nextFocusLeft: 'btn_application_4',
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
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusLeft: 'btn_application_3',
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
            nextFocusLeft: 'btn_application_1',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            click: a.eventHandler,
        },
        {
            id: 'plant_ball_3',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_application_2',
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
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler,
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
            click: Activity.eventHandler,
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
        {
            id: 'btn_application_1',
            name: '应用1/QQ音乐',
            type: 'img',
            nextFocusUp: 'btn_application_3',
            nextFocusDown: 'btn_application_2',
            nextFocusRight: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_application_music.png'),
            focusImage: a.makeImageUrl('btn_application_music_f.png'),
            click: Activity.eventHandler,
            contentId:"qq"
        }, {
            id: 'btn_application_2',
            name: '应用2/39健康',
            type: 'img',
            nextFocusUp: 'btn_application_1',
            nextFocusDown: 'plant_ball_3',
            nextFocusRight: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_application_39.png'),
            focusImage: a.makeImageUrl('btn_application_39_f.png'),
            click: Activity.eventHandler,
            contentId:"39jk"
        }, {
            id: 'btn_application_3',
            name: '应用3/wake健身',
            type: 'img',
            nextFocusUp: 'btn_application_4',
            nextFocusDown: 'btn_application_1',
            nextFocusRight: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_application_wake.png'),
            focusImage: a.makeImageUrl('btn_application_wake_f.png'),
            click: Activity.eventHandler,
            contentId:"wake"
        }, {
            id: 'btn_application_4',
            name: '应用4/天天有礼',
            type: 'img',
            nextFocusDown: 'btn_application_3',
            nextFocusUp: 'btn_application_5',
            nextFocusRight: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_application_gift.png'),
            focusImage: a.makeImageUrl('btn_application_gift_f.png'),
            click: Activity.eventHandler,
            contentId:"gift"
        }, {
            id: 'btn_application_5',
            name: '应用5/体考帮',
            type: 'img',
            nextFocusDown: 'btn_application_4',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_application_body.png'),
            focusImage: a.makeImageUrl('btn_application_body_f.png'),
            click: Activity.eventHandler,
            contentId:"body"
        }
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