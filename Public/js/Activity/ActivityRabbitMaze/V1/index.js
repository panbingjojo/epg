(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        kmLantern:0,    //孔明灯数量，默认为0

        init: function () {
            //广西电信EPG VIP订购弹窗
            if (r.lmcid == '450092') {
                G('order_vip').style.backgroundImage = "url(" + r.imagePath + "V450092/bg_order_vip.png)";
                G('btn_order_submit').style.left = r.platformType == 'hd' ? '555px' : '270px';
                H('btn_order_cancel');
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
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
        },

        initGameData:function () {
            if(r.platformType == 'hd') {
                //月兔初始位置 ，left 和 top 的偏移量、偏移次数，右上+1，左下-1；
                Activity.initRabbitTop = 510;
                Activity.initRabbitLeft = 43;
                Activity.offsetX = 123;
                Activity.offsetY = 80;
                Activity.offsetXCnt = 0;
                Activity.offsetYCnt = 0;
            }else{
                Activity.initRabbitTop = 310;
                Activity.initRabbitLeft = 21;
                Activity.offsetX = 62;
                Activity.offsetY = 40;
                Activity.offsetXCnt = 0;
                Activity.offsetYCnt = 0;
            }
            // 可中奖奖品
            a.prizeImage = {
                "1": r.imagePath + '/icon_lyjz.png',
                "2": r.imagePath + '/icon_fwjt.png',
                "3": r.imagePath + '/icon_szfy.png',
                "4": r.imagePath + '/icon_yhct.png',
            };

            G('icon_rabbit').style.top = Activity.initRabbitTop +'px';
            G('icon_rabbit').style.left = Activity.initRabbitLeft +'px';

            Activity.lastClickTime = Date.now();
            LMActivity.playStatus = false;
        },

        renderExchangePrize: function () {
            // 用户当前中奖材料 数量
            var prizeArray = r.myLotteryRecord.list;
            for (i = 0; i < prizeArray.length; i++) {
                prizeName = prizeArray[i].prize_name;
                prizeCount = prizeArray[i].prize_count;
                if (prizeName == '凤舞九天') {
                    $('fwjt').innerHTML =  prizeCount;
                } else if (prizeName == '龙跃甲子') {
                    $('lyjz').innerHTML =  prizeCount;
                } else if (prizeName == '神州放眼') {
                    $('szfy').innerHTML =  prizeCount;
                } else if (prizeName == '一鹤冲天') {
                    $('yhct').innerHTML =  prizeCount;
                }
            }

            //兑换奖品 各材料数量(按后台配置顺序依次填充)
            var exchangeList = r.exchangePrizeList.data;
            for (i = 0; i < exchangeList.length; i++) {
                for (j = 0; j < exchangeList[i].consume_list.length; j++) {
                    G('exchange_point_'+(i+1)+'_'+(j+1)).innerHTML = exchangeList[i].consume_list[j].consume_count;
                }
            };

        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    if (a.hasLeftTime()) {
                        // setTimeout("Activity.startBtn()", 1500);
                        Activity.startBtn();
                    }else{
                        LMActivity.triggerModalButton = btn.id;
                        a.showGameStatus('btn_game_over_sure');
                    };
                    break;
                case 'btn_exchange_prize':
                    LMActivity.triggerModalButton = btn.id;
                    Activity.renderExchangePrize();
                    LMActivity.showModal({
                        id: 'exchange_prize',
                        focusId: 'exchange_prize_1'
                    });
                    break;
                case 'btn_order_submit':
                    if (RenderParam.lmcid === '450092') {
                        Activity.jumpPlayVideo();
                    } else {
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                    }
                    break;

                case 'btn_order_cancel':
                case 'btn_exchange_back':
                case 'btn_close':
                case 'btn_lottery_fail':
                    LMActivity.triggerModalButton = 'btn_start';
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    LMActivity.playStatus = false;
                    break;
                case 'btn_lottery_submit':
                    // a.hideModal(a.shownModal);
                    LMActivity.Router.reload();
            }
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        startBtn: function (){
            LMActivity.triggerModalButton = 'btn_start';
            if (LMActivity.playStatus) {
                return;
            }
            LMActivity.playStatus = true;
            a.AjaxHandler.uploadPlayRecord(function () {
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: "icon_rabbit"
                    });
                    r.leftTimes = r.leftTimes - 1;
                    G("left_times").innerHTML = r.leftTimes;
            }, function () {
                LMEPG.UI.showToast('扣除游戏次数出错', 3);
            });
        },

        /**设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity');
        },

        /**
         * 跳转到视频播放页，播放结束时返回到首页
         * @param data 视频信息
         */
        jumpPlayVideo: function () {
            // 创建视频信息
            var videoInfo = {
                'videoUrl': RenderParam.platformType == 'hd' ? '99100000012019122711312406850550' : '99100000012019122711452806855842',
                'sourceId': '24382',
                'title': '为什么体检前需要空腹？',
                'type': 4,
                'userType': '2',
                'freeSeconds': '30',
                'entryType': 2,
                'entryTypeName': '嗨翻双节，月兔迷宫乐不停',
                'unionCode': 'gylm863',
                'showStatus': 1
            };

            LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
                var objCurrent = Activity.getCurrentPage(); //得到当前页
                var objPlayer = LMEPG.Intent.createIntent('player');
                objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

                LMEPG.Intent.jump(objPlayer, objCurrent);
            }, function () {
                LMEPG.UI.showToast("视频参数错误");
            });
        },

        boxStatusChange:function (boxId) {
            box = G('icon_box_'+boxId);
            if( box.getAttribute('icon_box') != 1) {
                if(Activity.kmLantern == 0){
                    LMActivity.AjaxHandler.lottery(function (data) {
                        // console.log(data);
                        LMEPG.UI.showToast("恭喜，您捡到了孔明灯");
                        Activity.kmLantern = 1; //表示获得1个灯笼
                        box.setAttribute('icon_box',1); //表示宝箱已开启
                        box.src = r.imagePath +'icon_box_open.png';
                    },function () {
                        LMEPG.UI.showToast("您捡到了石头");
                        box.setAttribute('icon_box',1); //表示宝箱已开启
                        box.src = r.imagePath +'icon_box_open.png';
                    });
                }else{
                    LMEPG.UI.showWaitingDialog('',1);
                    setTimeout(function () {
                        LMEPG.UI.showToast("您捡到了石头");
                        box.setAttribute('icon_box', 1); //表示宝箱已开启
                        box.src = r.imagePath + 'icon_box_open.png';
                    },1000);
                }
            }
        },

        onRabbitMove: function (direction, btn) {
            // 设置按键间隔0.5s
            LMEPG.KeyEventManager.setAllowFlag(false);
            setTimeout("LMEPG.KeyEventManager.setAllowFlag(true)", 500);
            var rabbit = G(btn.id);
            switch (direction){
                case 'left':
                    if(Activity.offsetXCnt > 0){
                        if((Activity.offsetXCnt == 2 && [1,2,3,4].indexOf(Activity.offsetYCnt) == -1)
                            || (Activity.offsetXCnt == 4 && [5,6].indexOf(Activity.offsetYCnt) == -1)
                            || (Activity.offsetXCnt == 9 && [2,3].indexOf(Activity.offsetYCnt) == -1)
                            || [2,4,9].indexOf(Activity.offsetXCnt) == -1
                        ){
                            Activity.offsetXCnt--;
                            rabbit.style.left = Activity.initRabbitLeft + Activity.offsetX*Activity.offsetXCnt + 'px';
                        }
                    }
                    break;
                case 'right':
                    if(Activity.offsetXCnt < 9){
                        if((Activity.offsetXCnt == 2 && [0,2,3].indexOf(Activity.offsetYCnt) == -1)
                            ||(Activity.offsetXCnt == 4 && Activity.offsetYCnt != 5)
                            || [2,4].indexOf(Activity.offsetXCnt) == -1
                        ){
                            Activity.offsetXCnt++;
                            rabbit.style.left = Activity.initRabbitLeft + Activity.offsetX*Activity.offsetXCnt + 'px';
                        }
                    }
                    break;
                case 'up':
                    if(Activity.offsetYCnt < 6){
                        if((Activity.offsetYCnt == 0 && Activity.offsetXCnt == 2)
                            || (Activity.offsetYCnt == 1 && [2,9].indexOf(Activity.offsetXCnt) > -1)
                            ||(Activity.offsetYCnt == 4 && Activity.offsetXCnt == 4)
                            || [0,1,4].indexOf(Activity.offsetYCnt) == -1
                        ){
                            Activity.offsetYCnt++;
                            rabbit.style.top = Activity.initRabbitTop -  Activity.offsetY*Activity.offsetYCnt + 'px';
                        }
                    }
                    break;
                case 'down':
                    if(Activity.offsetYCnt > 0){
                        if((Activity.offsetYCnt == 1 && Activity.offsetXCnt ==2)
                            || (Activity.offsetYCnt == 4 && [2,9].indexOf(Activity.offsetXCnt) > -1)
                            || (Activity.offsetYCnt == 6 && Activity.offsetXCnt == 4)
                            ||  [1,4 ,6].indexOf(Activity.offsetYCnt) == -1
                        ){
                            Activity.offsetYCnt--;
                            rabbit.style.top = Activity.initRabbitTop -  Activity.offsetY*Activity.offsetYCnt + 'px';
                        }
                    }
                    break;
            }
            // 开启宝箱和到达终点判断
            if(Activity.offsetXCnt ==3 && Activity.offsetYCnt == 1){
                Activity.boxStatusChange(1);    //碰到第1个宝箱
            }else if(Activity.offsetXCnt ==9 && Activity.offsetYCnt == 4){
                Activity.boxStatusChange(2);    //碰到第2个宝箱
            }else if(Activity.offsetXCnt == 5 && Activity.offsetYCnt == 6){
                Activity.boxStatusChange(3);    //碰到第3个宝箱
            }else if(Activity.offsetXCnt == 8 && Activity.offsetYCnt == 6){
                //到达终点
                if(Activity.kmLantern == 1){
                    LMActivity.doLotteryRound2();
                }else{
                    LMEPG.UI.showWaitingDialog('',1);
                    setTimeout(function () {
                        LMActivity.showModal({
                            id: 'lottery_fail',
                            focusId: 'btn_lottery_fail',
                            onDismissListener: function () {
                                LMActivity.Router.reload();
                            }
                        });
                    },1000);
                }
            }
        },
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusLeft: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        },{
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusRight: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        },{
            id: 'btn_close_rule',
            name: '按钮-活动规则-关闭',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.gif'),
            click: a.eventHandler
        },{
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
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
            listType: 'exchange',
            click: Activity.eventHandler
        },{
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_exchange_prize',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
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
            id: 'icon_rabbit',
            name: '月兔',
            type: 'img',
            nextFocusRight:'',
            backgroundImage: a.makeImageUrl('icon_rabbit.gif'),
            focusImage: a.makeImageUrl('icon_rabbit.gif'),
            click: Activity.eventHandler,
            beforeMoveChange:Activity.onRabbitMove
        },{
            id: 'btn_lottery_submit',
            name: '按钮-第二轮中奖-确定',
            type: 'img',
            nextFocusUp: 'lottery_tel',
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        },{
            id: 'btn_lottery_fail',
            name: '按钮-第二轮抽奖失败-确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_cancel',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp: 'lottery_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        },{
            id: 'btn_exchange_back',
            name: '按钮-兑换页-返回',
            type: 'img',
            nextFocusDown: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.gif'),
            click: Activity.eventHandler
        },{
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusUp: 'btn_exchange_back',
            nextFocusDown: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusUp: 'exchange_prize_1',
            nextFocusDown: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusUp: 'exchange_prize_2',
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
        },{
            id: 'exchange_tel',
            name: '输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit',
            backFocusId: 'btn_exchange_submit',
            focusChange: a.onInputFocus
        },{
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
            click: Activity.eventHandler
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);