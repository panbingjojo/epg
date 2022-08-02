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
            //高清参数
            if(r.platformType == 'hd') {
                //游戏初始化
                Activity.materialTop = 95;                               //传送材料顶部距离
                Activity.materialWidth = 130;                            //材料宽度
                Activity.materialHeight = 130;                           //材料高度
                Activity.midLeft = 575;                                  //传送带中间材料左边距 (1280 / 2) - (130 / 2)
                Activity.materialSpace = 77;                              //传送带材料间距
                Activity.materialFirstLeft = -253;                        //传送带材料首位置 575 - (130 + 77) * 4
                Activity.makeTop = 267;                                   //制作区顶部距离
                //标清参数
            }else{

            }

            //公用参数设置
            Activity.gameCount = 30;                                       //倒计时
            Activity.moveInternal = 600;                                  //移动速度，多少毫秒移动一个位置
            Activity.mixTime = 2000;                                       //搅拌时间
            Activity.mixSpeed = 300;                                       //搅拌速度
            Activity.probability = 0.3;                                    //制作成功概率

            Activity.randomArr = [];                                       //随机材料序列
            //材料备注
            Activity.materialArr = {
                0:"纯牛奶",
                1: "蛋黄",
                2: "蓝莓",
                3: "奶油",
                4: "柠檬",
                5: "沙冰",
                6: "酸奶",
                7: "糖",
                8: "盐",
            };

            //冷饮配方
            Activity.formulation = [
                ["2","5","6","7"],                                      //蓝莓奶昔 [蓝莓，糖，沙冰，酸奶]
                ["0","3","5","7"],                                      //冰激凌   [奶油，纯牛奶，糖，沙冰]
                ["4","5","7","8"],                                      //鲜宁乐   [柠檬，盐，糖，沙冰]
            ]

            Activity.currentMaterialId = null;                           //当前材料id
            Activity.currentDrinkId = null;                             //当前制作的饮料id
            Activity.selectedMaterial = [];                              //已选材料组
            Activity.mixId = 1;                                          //搅拌机状态id
            Activity.isLotterying = false;

            // 可抽中材料
            a.prizeImage = {
                "1": r.imagePath + '/finish_drink_0.png',
                "2": r.imagePath + '/finish_drink_1.png',
                "3": r.imagePath + '/finish_drink_2.png',
            };

            Activity.initLotteryList();
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_drink_1':
                case 'btn_drink_2':
                case 'btn_drink_3':
                    if (a.hasLeftTime()) {
                        Activity.selDrinkId = parseInt(btn.id.charAt(btn.id.length - 1)) - 1;
                        Activity.startBtn();
                    }else{
                        LMActivity.triggerModalButton = btn.id;
                        a.showGameStatus('btn_game_over_sure');
                    };
                    break;
                case 'gm_material_5':
                    Activity.selectMaterial();
                    break;

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
                    LMActivity.triggerModalButton = 'btn_drink_2';
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
                    if ($('exchange_drink_cnt_1').innerHTML < exchangeScore
                        || $('exchange_drink_cnt_2').innerHTML < exchangeScore
                        || $('exchange_drink_cnt_3').innerHTML < exchangeScore) {
                        LMEPG.UI.showToast("饮料不够，请制作后再来兑换！", 3);
                    }else{
                        LMActivity.exchangePrize(btn.order);
                    }
                    break;
                case 'btn_order_cancel':
                    LMActivity.triggerModalButton = 'btn_drink_2';
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
                if (prizeName == '蓝莓奶昔') {
                    $('bg_drink_cnt_1').innerHTML = prizeCount;
                    $('exchange_drink_cnt_1').innerHTML = prizeCount;
                } else if (prizeName == '冰激凌') {
                    $('bg_drink_cnt_2').innerHTML = prizeCount;
                    $('exchange_drink_cnt_2').innerHTML = prizeCount;
                } else if (prizeName == '鲜柠乐') {
                    $('bg_drink_cnt_3').innerHTML = prizeCount;
                    $('exchange_drink_cnt_3').innerHTML = prizeCount;
                }
            }
        },

        renderExchangePrize: function (exchangePrizeList) {
            Activity.initLotteryList();
            $('exchange_point_1').innerHTML = exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_12').innerHTML = exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_13').innerHTML = exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_2').innerHTML = exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_22').innerHTML = exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_23').innerHTML = exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_3').innerHTML = exchangePrizeList[2].consume_list[0].consume_count;
            $('exchange_point_32').innerHTML = exchangePrizeList[2].consume_list[0].consume_count;
            $('exchange_point_33').innerHTML = exchangePrizeList[2].consume_list[0].consume_count;
            // focusId = 'btn_exchange_1';
            // return focusId;
        },

        initMaterial: function () {
            var s = "0,1,2,3,4,5,6,7,8";
            var arr = s.split(",");
            Activity.randomArr= arr.sort(function(){ return 0.5 - Math.random() });
            for (var i = 0; i < Activity.randomArr.length; i++) {
                $("gm_material_"+ i).src = r.imagePath + "/gm_material_"+ Activity.randomArr[i] +".png";
            }
        },

        initFormulation: function() {
            $("gm_make_drink").src = r.imagePath + "/make_drink_"+ Activity.selDrinkId + ".png";
            for (var i = 0; i < Activity.formulation[Activity.selDrinkId].length; i++) {
                $("gm_select_material_"+ i).src = r.imagePath + "/gm_material_"+ Activity.formulation[Activity.selDrinkId][i] +".png";
            }
        },

        moveMaterial:function(){
            Activity.isMove = true;
            // for (var i = 0; i < Activity.randomArr.length; i++) {
            //     $("gm_material_"+ i).src = "";
            // }

            Activity.randomArr.push(Activity.randomArr.shift());
            for (var i = 0; i < Activity.randomArr.length; i++) {
                if (i == 4){
                    $("gm_material_"+ i).src = r.imagePath + "/gm_material_"+ Activity.randomArr[i]  +"_f.png";
                    Activity.currentMaterialId = Activity.randomArr[i];
                } else{
                    $("gm_material_"+ i).src = r.imagePath + "/gm_material_"+ Activity.randomArr[i]  +".png";
                }
            }
            Activity.isMove = false;
        },

        //选择材料
        selectMaterial:function(){
            if (Activity.isMove || Activity.isLotterying){
                return;
            }

            if (Activity.selectedMaterial.length > 0){
                var selectedId = Activity.selectedMaterial.indexOf(Activity.currentMaterialId);
                if (selectedId >= 0){
                    return;
                }
            }

            //是否选中配方材料
            var selId = Activity.formulation[Activity.selDrinkId].indexOf(Activity.currentMaterialId);
            if(selId < 0){
                return;
            }
            Activity.selectedMaterial.push(Activity.formulation[Activity.selDrinkId][selId]);
            //选中后，显示配方材料
            $("gm_select_material_"+ selId).src = r.imagePath + "/gm_material_"+ Activity.formulation[Activity.selDrinkId][selId] +"_f.png";

            //是否选完配方材料
            if (Activity.selectedMaterial.length == Activity.formulation[Activity.selDrinkId].length){
                //选完后，启动搅拌机
                $("gm_make_drink").src = r.imagePath + "/make_drink_"+ Activity.selDrinkId + "_f.png";
                clearInterval(Activity.makeInterval);
                Activity.startMix();
            }
        },

        startMix:function(){
            Activity.mixInterval = setInterval(function () {
                Activity.isLotterying = true;
                Activity.mixId = Activity.mixId >= 3 ? 1 : Activity.mixId + 1;
                $("gm_mixer").src = r.imagePath + "/gm_mixer_" + Activity.mixId + ".png";
                Activity.mixTime = Activity.mixTime - Activity.mixSpeed;
                if (Activity.mixTime <= 0 || Activity.gameCount <= 0){
                    clearInterval(Activity.mixInterval);
                    clearInterval(Activity.gameInterval);
                    LMActivity.prizeId = Activity.selDrinkId + 1;
                    LMActivity.doLottery();
                }
                Activity.isLotterying = false;
            }, Activity.mixSpeed);
        },


        getMixResult:function(){
            var rand = Math.random();
            if(rand < Activity.probability){
                return true;
            }else {
                return false;
            }
        },

        initButtons: function () {
            e.BM.init('btn_drink_2', Activity.buttons, true);
        },

        startBtn: function (){
            // Hide('btn_start');
            Activity.initMaterial();
            Activity.initFormulation();
            a.AjaxHandler.uploadPlayRecord(function () {
                if (LMActivity.playStatus = 'false') {
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: "gm_material_5",
                        onDismissListener: function () {
                            // 清除游戏状态
                            Activity.gameRunning = false;
                            $('game_container').innerHTML = '';
                            if (Activity.gameCount > 0) {
                                clearInterval(Activity.makeInterval);
                                clearInterval(Activity.gameInterval);
                            }
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
            Activity.startMake();
            var gameCountdown = $('game_countdown');
            gameCountdown.innerHTML = String(Activity.gameCount);
            Activity.gameRunning = true;
            // Activity.gameOver = false;
            // 启动游戏定时器
            Activity.gameInterval = setInterval(function () {
                if (Activity.gameRunning) {
                    Activity.gameCount = Activity.gameCount - 1;
                    gameCountdown.innerHTML = String(Activity.gameCount);
                    // 倒计时为0 弹窗游戏结果
                    // if (Activity.gameCount <= 0 || Activity.gameOver) {
                    if (Activity.gameCount <= 0) {
                        // if (Activity.gameCount == 0)
                        //     LMEPG.UI.logPanel.show('倒计时为0！！！');
                        Activity.gameRunning = false;
                        Activity.gameCount = 0;
                        clearInterval(Activity.gameInterval);
                        clearInterval(Activity.makeInterval);
                        // Activity.checkGameResult();
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

        checkGameResult: function () {
            if (Activity.score > 0) {
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
                });
                Show('btn_start');
            }
        },

        startMake: function(){
            if(Activity.makeInterval){
                clearInterval(Activity.makeInterval);
            }
            Activity.makeInterval = setInterval(Activity.moveMaterial, Activity.moveInternal);
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
            nextFocusLeft: 'btn_activity_rule',
            nextFocusDown: 'btn_drink_3',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则-返回',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back_1.png'),
            focusImage: a.makeImageUrl('btn_back_1_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_drink_1',
            name: '按钮-蓝莓奶昔',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusRight: 'btn_drink_2',
            backgroundImage: a.makeImageUrl('btn_drink_1.png'),
            focusImage: a.makeImageUrl('btn_drink_1_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_drink_2',
            name: '按钮-冰激凌',
            type: 'img',
            nextFocusLeft: 'btn_drink_1',
            nextFocusRight: 'btn_drink_3',
            backgroundImage: a.makeImageUrl('btn_drink_2.png'),
            focusImage: a.makeImageUrl('btn_drink_2_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_drink_3',
            name: '按钮-鲜宁乐',
            type: 'img',
            nextFocusUp:'btn_back',
            nextFocusLeft: 'btn_drink_2',
            backgroundImage: a.makeImageUrl('btn_drink_3.png'),
            focusImage: a.makeImageUrl('btn_drink_3_f.png'),
            click: Activity.eventHandler
        },  {
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
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'btn_drink_1',
            nextFocusRight: 'btn_drink_1',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            listType: 'exchange',
            click: Activity.eventHandler
        },{
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
            id: 'gm_material_5',
            name: '按钮-选择材料',
            type: 'img',
            backgroundImage: a.makeImageUrl('gm_material_5.png'),
            focusImage: a.makeImageUrl('gm_material_5_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_exchange_back',
            name: '按钮-兑换礼品-返回',
            type: 'img',
            nextFocusDown: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_back_1.png'),
            focusImage: a.makeImageUrl('btn_back_1_f.png'),
            click: Activity.eventHandler
        }, {
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