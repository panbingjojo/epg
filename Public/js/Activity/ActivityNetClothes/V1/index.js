(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score:0,

        init: function () {
            // LMEPG.UI.logPanel.show('Activity.init start');
            //中国联通活动不再弹窗倒计时
            if (r.lmcid == '000051') {
                r.valueCountdown.showDialog = '0';
            }

            //宁夏广电EPG VIP订购弹窗
            if (r.lmcid == '640094') {
                G('order_vip').style.backgroundImage = "url(" + r.imagePath + "bg_order_vip_ningxia.png)";
                G('btn_order_submit').style.top = '430px';
                G('btn_order_submit').style.left = '555px';
                H('btn_order_cancel');
            }

            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
            a.showOrderResult();
            // LMEPG.UI.logPanel.show('Activity.init end');
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';

            // console.log('url(' + regionalImagePath + '/bg_exchange_prize.png)');
        },

        initGameData:function () {
            if (RenderParam.platformType == 'hd') {
                Activity.netLeft = 20; // 网距离左边初始距离
                Activity.netBottom = 250;
                Activity.netHalfWidth = 125;  //网半宽
                Activity.clotheHeight = 65;  //衣服高
                Activity.clotheHalfWidth = 16;  //衣服半宽
                Activity.clotheTop = 400 ;  //衣服初始高度
                Activity.gameLeft = 20; // 网距离左边最小距离
                Activity.gameTop = 50; //目标最大掉落高度
                // Activity.mindPositionArray = [100, 395, 690, 980]; // 目标掉落位置
                Activity.mindWidthDiff = 80;
                Activity.mindHeightDiff = 150;
                Activity.mindMoveDistence = -20;
                Activity.netMoveDistence = 30; // 网移动距离
            }else{
                Activity.netLeft = 15; // 网距离左边初始距离
                Activity.netBottom = 170;
                Activity.netHalfWidth = 85;  //网半宽
                Activity.clotheHeight = 65;  //衣服高
                Activity.clotheHalfWidth = 16;  //衣服半宽
                Activity.clotheTop = 400 ;  //衣服初始高度
                Activity.gameLeft = 15; // 网距离左边最小距离
                Activity.gameTop = 50; //目标最大掉落高度
                // Activity.mindPositionArray = [60, 250, 480]; // 目标掉落位置
                Activity.mindWidthDiff = 50;
                Activity.mindHeightDiff = 100;
                Activity.mindMoveDistence = -10;
                Activity.netMoveDistence = 15; // 网移动距离
            }

            Activity.prizeIndex = '';
            Activity.tmpCount = 0;
            Activity.clotheTimeSpan = 2000;     //每多少毫秒出一件衣服

            Activity.mindArray = [
                LMActivity.makeImageUrl('not_neted_0.png'),
                LMActivity.makeImageUrl('not_neted_1.png'),
                LMActivity.makeImageUrl('not_neted_2.png'),
                LMActivity.makeImageUrl('not_neted_3.png'),
            ];

            Activity.netedMindArray = [
                LMActivity.makeImageUrl('neted_0.png'),
                LMActivity.makeImageUrl('neted_1.png'),
                LMActivity.makeImageUrl('neted_2.png'),
                LMActivity.makeImageUrl('neted_3.png'),
            ];

            // 可抽中材料
            a.prizeImage = {
                "1": r.imagePath + '/get_clothe_0.png',
                "2": r.imagePath + '/get_clothe_1.png',
                "3": r.imagePath + '/get_clothe_2.png',
                "4": r.imagePath + '/get_clothe_3.png',
            };

            Activity.initLotteryList();
            // Activity.tmpMindPositionArray = Activity.mindPositionArray.slice();
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    if (a.hasLeftTime()) {
                        Activity.startBtn();
                    }else{
                        LMActivity.triggerModalButton = btn.id;
                        a.showGameStatus('btn_game_over_sure');
                    };
                    break;

                // case 'btn_net':
                //     if (Activity.gameRunning){
                //         // 1s 最多网两次
                //         if(Date.now() - Activity.lastClickTime > 500 ){
                //             Activity.catchClothe();
                //             Activity.lastClickTime = Date.now();
                //         }
                //     }
                //     break;

                case 'btn_back':
                    LMActivity.showModal({
                        id: 'tips_2',
                        focusId: 'btn_prev'
                    });
                    break;

                case 'btn_order_submit':
                    if (RenderParam.lmcid === '640094') {
                        Activity.jumpPlayVideo();
                    } else {
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                    }
                    break;
                case 'btn_exchange_prize':
                    LMActivity.triggerModalButton = 'btn_start';
                    Activity.renderExchangePrize(r.exchangePrizeList.data, btn.exchangePrizeButtons,
                        btn.exchangeFocusId, btn.moveType);
                    LMActivity.showModal({
                        id: 'exchange_prize',
                        focusId: 'exchange_prize_1'
                    });
                    break;
                case 'exchange_prize_1':
                case 'exchange_prize_2':
                case 'exchange_prize_3':
                    var exchangeScore = parseInt(G("exchange_point_" + (btn.order + 1)).innerHTML);
                    if ($('exchange_clothe_cnt_1').innerHTML < exchangeScore
                        || $('exchange_clothe_cnt_2').innerHTML < exchangeScore
                        || $('exchange_clothe_cnt_3').innerHTML < exchangeScore) {
                        LMEPG.UI.showToast("衣服不够，请网到后再来兑换！", 3);
                    }else{
                        LMActivity.exchangePrize(btn.order);
                    }
                    break;
                case 'btn_order_cancel':
                    LMActivity.triggerModalButton = 'btn_start';
                case 'btn_lottery_fail':
                case 'btn_lottery_submit':
                case 'btn_exchange_back':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
            }
        },

        initLotteryList:function(){
            var prizeArray = r.myLotteryRecord.list;
            for (i = 0; i < prizeArray.length; i++) {
                prizeName = prizeArray[i].prize_name;
                prizeCount = prizeArray[i].prize_count;
                if (prizeName == '上衣') {
                    $('bg_clothe_cnt_1').innerHTML = 'X '+ prizeCount;
                    $('exchange_clothe_cnt_1').innerHTML = 'X '+prizeCount;
                } else if (prizeName == '下裳') {
                    $('bg_clothe_cnt_2').innerHTML = 'X '+ prizeCount;
                    $('exchange_clothe_cnt_2').innerHTML = 'X '+prizeCount;
                } else if (prizeName == '腰带') {
                    $('bg_clothe_cnt_3').innerHTML = 'X '+ prizeCount;
                    $('exchange_clothe_cnt_3').innerHTML = 'X '+prizeCount;
                } else if (prizeName == '披帛') {
                    $('bg_clothe_cnt_4').innerHTML = 'X '+prizeCount;
                    $('exchange_clothe_cnt_4').innerHTML = 'X '+prizeCount;
                }
            }
        },

        renderExchangePrize: function (exchangePrizeList) {
            Activity.initLotteryList();
            $('exchange_point_1').innerHTML = 'X '+ exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_12').innerHTML = 'X '+ exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_13').innerHTML = 'X '+ exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_14').innerHTML = 'X '+ exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_2').innerHTML = 'X '+ exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_22').innerHTML = 'X '+ exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_23').innerHTML = 'X '+ exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_24').innerHTML = 'X '+ exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_3').innerHTML = 'X '+ exchangePrizeList[2].consume_list[0].consume_count;
            $('exchange_point_32').innerHTML = 'X '+ exchangePrizeList[2].consume_list[0].consume_count;
            $('exchange_point_33').innerHTML = 'X '+ exchangePrizeList[2].consume_list[0].consume_count;
            $('exchange_point_34').innerHTML = 'X '+ exchangePrizeList[2].consume_list[0].consume_count;
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        startBtn: function (){
            Hide('btn_start');
            a.AjaxHandler.uploadPlayRecord(function () {
                if (LMActivity.playStatus = 'false') {
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: "btn_net",
                        onDismissListener: function () {
                            // 清除游戏状态
                            Activity.gameRunning = false;
                            $('game_container').innerHTML = '';
                            clearInterval(Activity.makeInterval);
                            clearInterval(Activity.gameInterval);
                        }
                    });
                    Activity.startGame();
                }
            }, function () {
                LMEPG.UI.showToast('扣除游戏次数出错', 3);
            });
        },

        startGame: function () {
            LMActivity.playStatus = true;
            G('btn_net').style.left = Activity.netLeft + 'px';

            Activity.mindElementArray = [];
            Activity.createGameMind();
            // 每2s出现一件衣服
            Activity.mindInterval = setInterval(function () {Activity.createGameMind();},Activity.clotheTimeSpan);
            var gameCountdown = $('game_countdown');
            // gameCountdown.innerHTML = String(Activity.gameCount);
            Activity.gameRunning = true;
            // 启动游戏定时器
            Activity.gameInterval = setInterval(function () {
                if (!Activity.gameRunning) {
                    // if (Activity.gameCount == 0)
                    //     LMEPG.UI.logPanel.show('倒计时为0！！！');
                    Activity.gameRunning = false;
                    // Activity.gameCount = 0;
                    clearInterval(Activity.mindInterval)
                    clearInterval(Activity.gameInterval);
                    clearInterval(Activity.mindMoveIntervel);
                    // Activity.checkGameResult();
                    if (Activity.prizeIndex != '') {
                        // console.log('Activity.prizeIndex=',Activity.prizeIndex, 'typeof Activity.prizeIndex:',typeof Activity.prizeIndex);
                        LMActivity.prizeId = parseInt(Activity.prizeIndex) + 1;
                        LMActivity.doLottery();
                    }else{
                        LMActivity.showModal({
                            id: 'lottery_fail',
                            focusId: 'btn_lottery_fail',
                            onDismissListener: function () {
                                LMActivity.Router.reload();
                            }
                        })
                    }
                }
            }, 1000);
        },

        createGameMind: function () {
            var mindIndex = getRandom(0, Activity.mindArray.length - 1);
            var mindElement = document.createElement('img');
            var gameContainer = document.getElementById('game_container');
            mindElement.src = Activity.mindArray[mindIndex];
            var mindRandLeft = getRandom(20, RenderParam.platformType == 'hd' ? 1000 : 400);
            // console.log('Activity.tmpCount=',++Activity.tmpCount, ' mindRandLeft =',mindRandLeft);
            mindElement.style.left = mindRandLeft + 'px';
            // console.log('Activity.mindArray[',mindIndex,'] ', mindElement.style.left, mindElement.src);
            mindElement.style.top =  RenderParam.platformType == 'hd' ? '720px': '530px';
            gameContainer.appendChild(mindElement);
            Activity.mindElementArray.push(mindElement);
            Activity.mindMoveIntervel = setInterval(function () {
                if (Activity.gameRunning) {
                    var mindTop = parseInt(mindElement.style.top) + Activity.mindMoveDistence;
                    if (mindTop < Activity.gameTop && Activity.prizeIndex == '') {
                        // console.log('222 mindElement.style.left',mindElement.style.left);
                        Activity.removeElement(mindElement);
                    } else {
                        // console.log('111 mindElement.style.left',mindElement.style.left);
                        mindElement.style.top = mindTop + 'px';
                        Activity.catchClothe(mindElement, Activity.mindElementArray.length - 1);
                    }
                }
            }, 200);
        },

        catchClothe: function (mindElement, index) {
            var net = G('btn_net');
            var netLeft = parseInt(net.style.left);
            var netBottom = Activity.netBottom;
            var mindElementLeft = parseInt(mindElement.offsetLeft);
            var mindElementTop = parseInt(mindElement.offsetTop);

            // console.log('mindElement', '[',mindElementLeft,',',mindElementTop,'] leftDiff,topDiff',
            //     Math.abs(netLeft - mindElementLeft),Math.abs(netBottom - mindElementTop),
            //     'left,top',Activity.mindWidthDiff, Activity.mindHeightDiff,mindElement.src);

            if ((Math.abs(netLeft - mindElementLeft) < Activity.mindWidthDiff) &&  netBottom - mindElementTop > Activity.mindHeightDiff) {
                Activity.prizeIndex = mindElement.src.substr(-5,1);
                var src = mindElement.src;
                mindElement.src = Activity.netedMindArray[Activity.prizeIndex];
                // console.log(555, ' src',src,'Activity.mindElementArray[].src',Activity.mindElementArray[index].src);
                // Activity.removeElement(mindElement);
                // mindElement = null;
                // Activity.mindElementArray.splice(index, 1);
                Activity.gameRunning = false;
                return Activity.prizeIndex;
            }
        },

        netMove: function (direction, button) {
            // console.log(button.id);
            if (!Activity.gameRunning)
                return;
            var net = G(button.id);
            var netLeft = parseInt(net.style.left);
            switch (direction) {
                case 'left':
                    if (netLeft - Activity.netMoveDistence >= Activity.gameLeft) {
                        net.style.left = (netLeft - Activity.netMoveDistence) + 'px';
                    }
                    break;
                case 'right':
                    if ((netLeft + Activity.netMoveDistence) < (RenderParam.platformType == 'hd' ? 1100 : 480 )) {
                        net.style.left = (netLeft + Activity.netMoveDistence) + 'px';
                    }
                    break;
                // case  'down':
                //     Activity.catchClothe();
            }
        },

        removeElement: function (_element) {
            var _parentElement = _element.parentNode;
            if (_parentElement) {
                _parentElement.removeChild(_element);
            }
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
                'videoUrl': RenderParam.platformType == 'hd' ? '03110300000000010000000000000392' : '03110300000000010000000000000386',
                'sourceId': '889',
                'title':  RenderParam.platformType == 'hd' ? '华佗为关羽刮骨疗毒？': '扁鹊给齐王治怪病',
                'type': 4,
                'userType': RenderParam.isVip != 1 ? 2 : 1,
                'freeSeconds': 0,
                'entryType': 1,
                'entryTypeName': 'epg-home',
                'unionCode': 'd5yy001',
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
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_activity_rule',
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
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
        },
        // {
        //     id: 'btn_close_rule',
        //     name: '按钮-活动规则-返回',
        //     type: 'img',
        //     backgroundImage: a.makeImageUrl('btn_back_1.png'),
        //     focusImage: a.makeImageUrl('btn_back_1_f.png'),
        //     click: a.eventHandler
        // },
        {
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
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            listType: 'exchange',
            click: Activity.eventHandler
        },{
            id: 'btn_start',
            name: '按钮-开始',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_exchange_prize',
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
        },  {
            id: 'btn_lottery_submit',
            name: '按钮-游戏成功确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        },{
            id: 'btn_net',
            name: '图片-网',
            type: 'img',
            beforeMoveChange: Activity.netMove,
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        },
        // {
        //     id: 'btn_exchange_back',
        //     name: '按钮-兑换礼品-返回',
        //     type: 'img',
        //     nextFocusDown: 'exchange_prize_1',
        //     backgroundImage: a.makeImageUrl('btn_back_1.png'),
        //     focusImage: a.makeImageUrl('btn_back_1_f.png'),
        //     click: Activity.eventHandler
        // },
        {
            id: 'exchange_prize_1',
            name: '按钮-兑换2',
            type: 'img',
            order: 0,
            nextFocusUp: 'btn_exchange_back',
            nextFocusDown: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换1',
            type: 'img',
            order: 1,
            nextFocusUp: 'exchange_prize_1',
            nextFocusDown: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusUp: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
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