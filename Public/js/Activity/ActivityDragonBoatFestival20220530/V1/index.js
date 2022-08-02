(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score:0,
        boxList: [
            LMActivity.makeImageUrl('camel_box.png'),
            LMActivity.makeImageUrl('yellow_box.png')
        ],
        clickTimes: false,

        pigPositionNum:'0',
        coverPositionNum:'0',
        pigPosition:{
            '1':[120, 250],
            '2':[30, 395],
            '3':[30, 670],
            '4':[120, 810],
            '5':[205, 670],
            '6':[205, 390],
            '7':[120, 530]
        },

        pigMoveLine: {
            '1': {
                right: '7',
                up: '2',
                down: '6'
            },
            '2': {
                left: '1',
                right: '3',
                down: '7'
            },
            '3':{
                left: '2',
                right: '4',
                down: '7'
            },
            '4':{
                up: '3',
                down: '5',
                left: '7'
            },
            '5':{
                up:'7',
                left: '6',
                right: '4'
            },
            '6':{
                up:'7',
                left: '1',
                right: '5'
            },
            '7':{
                up:'2',
                down: '6',
                right: '4',
                left:'1'
            }
        },

        hasOpenList:[],

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
                                    focusId: 'pig',
                                });
                                Activity.startCountdown();
                                Activity.initZongziPosition()
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
        countDownTimer:null,
        startCountdown:function () {
            var countDown = 20;
            G('game_countdown').innerHTML = countDown
            Activity.countDownTimer = setInterval(function () {
                countDown--
                G('game_countdown').innerHTML = countDown
                if(countDown === 0){
                    clearInterval(Activity.countDownTimer)
                    Activity.checkGameResult();
                }
            },1000)
        },

        initZongziPosition:function(){
            var positionObj = {
                '1':[200, 270],
                '2':[110, 410],
                '3':[110, 690],
                '4':[200, 830],
                '5':[285, 690],
                '6':[285, 410],
                '7':[200, 550]
            }

            var positionNum = Activity.randomNum(1,7)
            Activity.coverPositionNum = positionNum
            console.log(positionNum,positionObj[positionNum])
            G('zongZi').style.top = positionObj[positionNum][0] + 'px'
            G('zongZi').style.left = positionObj[positionNum][1] + 'px'

            Activity.pigPositionNum = Activity.randomNum(1,7)

            while (positionNum === Activity.pigPositionNum){
                Activity.pigPositionNum = Activity.randomNum(1,7)
            }

            G('pig').style.top = Activity.pigPosition[Activity.pigPositionNum][0] + 'px'
            G('pig').style.left = Activity.pigPosition[Activity.pigPositionNum][1] + 'px'

        },

        randomNum:function(lower,upper){
            return Math.floor(Math.random() * (upper - lower + 1)) + lower
        },



        movePig:function(dir){
            var t =  Activity.pigMoveLine[Activity.pigPositionNum][dir]

            if(t){
                var positionArr = Activity.pigPosition[t]

                G('pig').style.top = positionArr[0] + 'px'
                G('pig').style.left = positionArr[1] + 'px'

                Activity.pigPositionNum = t
            }
        },

        openCover:function(){
            if(Activity.hasOpenList.indexOf(Activity.pigPositionNum.toString()) === -1){
                var coverEle =  G('cover-'+ Activity.pigPositionNum)
                var pigEle =  G('pig')
                coverEle.style.top = (coverEle.offsetTop - 60) + 'px'
                pigEle.style.top = (pigEle.offsetTop - 60) + 'px'

                setTimeout(function () {
                    coverEle.style.display = 'none'
                    if(Activity.pigPositionNum == Activity.coverPositionNum){
                        clearInterval(Activity.countDownTimer)
                        Activity.score = 1
                        Activity.checkGameResult()
                    }
                },500)


                Activity.hasOpenList.push(Activity.pigPositionNum.toString())
            }

        },

        /**
         * 判斷游戏是否完成
         * */
        checkGameResult: function () {
            if (Activity.score > 0) {
                a.AjaxHandler.addScore(Activity.score, function () {
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
            click: Activity.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusRight: 'btn_back',
            nextFocusDown: 'btn_winner_list',
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
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_exchange_prize',
            nextFocusLeft: 'btn_winner_list',
            nextFocusDown: 'app-1',
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
        },{
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            nextFocusUp: '',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel_gx',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit_gx',
            nextFocusUp: 'reset_tel_gx',
            nextFocusDown: 'check',
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
            left:740,
            top:420
        }, {
            id: 'reset_tel_gx',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusDown: 'btn_list_submit_gx',
            backFocusId: 'btn_list_submit_gx',
            focusChange: a.onInputFocus,
            left:740,
            top:420
        },{
            id: 'check',
            name: '按钮-勾选',
            type: 'img',
            nextFocusRight: 'user_privacy_policy',
            nextFocusUp: 'btn_list_submit_gx',
            backgroundImage: a.makeImageUrl('btn_uncheck.png'),
            focusImage: a.makeImageUrl('btn_uncheck_f.png'),
            click: a.eventHandler
        }, {
            id: 'user_privacy_policy',
            name: '用户隐私政策',
            type: 'img',
            nextFocusUp: 'btn_list_submit_gx',
            nextFocusLeft: 'check',
            backgroundImage: a.makeImageUrl('btn_user_privacy_policy.png'),
            focusImage: a.makeImageUrl('btn_user_privacy_policy_f.png'),
            click: a.eventHandler
        },{
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
            id: 'btn_exchange_submit_gx',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusUp: 'exchange_tel_gx',
            nextFocusRight: 'btn_exchange_cancel_gx',
            nextFocusDown: 'exchangeCheck',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler,
        },{
            id: 'btn_exchange_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit',
            nextFocusUp:'exchange_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_exchange_cancel_gx',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_exchange_submit_gx',
            nextFocusUp: 'exchange_tel_gx',
            nextFocusDown: 'exchangeCheck',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler,
        },  {
            id: 'exchangeCheck',
            name: '按钮-勾选',
            type: 'img',
            nextFocusRight: 'user_privacy_policy_gx',
            nextFocusUp: 'btn_exchange_submit_gx',
            backgroundImage: a.makeImageUrl('btn_uncheck.png'),
            focusImage: a.makeImageUrl('btn_uncheck_f.png'),
            click: a.eventHandler
        }, {
            id: 'user_privacy_policy_gx',
            name: '用户隐私政策',
            type: 'img',
            nextFocusUp: 'btn_exchange_submit_gx',
            nextFocusLeft: 'exchangeCheck',
            backgroundImage: a.makeImageUrl('btn_user_privacy_policy.png'),
            focusImage: a.makeImageUrl('btn_user_privacy_policy_f.png'),
            click: a.eventHandler
        },{
            id: 'exchange_tel',
            name: '输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit',
            backFocusId: 'btn_exchange_submit',
            focusChange: a.onInputFocus,
            left:895,
            top:385
        },  {
            id: 'exchange_tel_gx',
            name: '广西电信-输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit_gx',
            backFocusId: 'btn_exchange_submit_gx',
            focusChange: a.onInputFocus,
            left:895,
            top:385
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
            id: 'pig',
            name: '吊机',
            type: 'img',
            beforeMoveChange: Activity.movePig,
            click: Activity.openCover
        },{
            id: 'scroll_bar_f',
            name: '滚动条',
            type: 'img',
            beforeMoveChange: Activity.turnDepPage,
        },{
            id: 'btn_close_authorization',
            name: '按钮-用户隐私政策-关闭',
            type: 'img',
            nextFocusDown: 'scroll_bar_f',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler,
        },{
            id: 'app-1',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_start',
            nextFocusRight: 'app-2',
            nextFocusLeft: '',
            backgroundImage: a.makeImageUrl('app-icon-1.png'),
            focusImage: a.makeImageUrl('app-icon-1-f.png'),
            click: ''
        },{
            id: 'app-2',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_start',
            nextFocusRight: 'app-3',
            nextFocusLeft: 'app-1',
            backgroundImage: a.makeImageUrl('app-icon-2.png'),
            focusImage: a.makeImageUrl('app-icon-2-f.png'),
            click: ''
        },{
            id: 'app-3',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_start',
            nextFocusRight: 'app-4',
            nextFocusLeft: 'app-2',
            backgroundImage: a.makeImageUrl('app-icon-3.png'),
            focusImage: a.makeImageUrl('app-icon-3-f.png'),
            click: ''
        },{
            id: 'app-4',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_start',
            nextFocusRight: '',
            nextFocusLeft: 'app-3',
            backgroundImage: a.makeImageUrl('app-icon-4.png'),
            focusImage: a.makeImageUrl('app-icon-4-f.png'),
            click: ''
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
