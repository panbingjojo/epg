(function (w, e, r, a) {
    var Activity = {
        moveStatus: false,
        score:0,

        init: function () {
            // LMEPG.UI.logPanel.show('Activity.init start');
            //中国联通活动不再弹窗倒计时
            if (r.lmcid == '000051' || r.lmcid == '12650092') {
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
            Activity.initGameButtons();
            Activity.initButtons();

            a.showOrderResult();
            // LMEPG.UI.logPanel.show('Activity.init end');
        },

        initGameData:function () {
            Activity.gameCount = 60;                                       //倒计时
            Activity.gameSucc = false;
            LMActivity.playStatus = false;
            // 可抽中材料
            a.prizeImage = {
                "1": r.imagePath + 'V' + r.lmcid + '/prize_no_1.png',
                "2": r.imagePath + 'V' + r.lmcid + '/prize_no_2.png',
                "3": r.imagePath + 'V' + r.lmcid + '/prize_no_3.png',
            };
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
        },

        getLevel:function(){
            var level = 0;
            for (i = 0; i < 6 ; i++) {
                if ( Activity.randPicArr[i] != i){
                    level++;
                }
            }
            return level;
        },

        initGamePic:function(){
            Activity.currPos = 0;
            Activity.picArr = [1,2,3,4,5,6];
            //显示拼图原型
            for (i = 1; i <= 6; i++) {
                $("small_pic_" + i).src = r.imagePath + '/small_pic_'+ Activity.picArr[i - 1] +'.png';
            }
            setTimeout(
                function () {
                    //打乱拼图
                    do {
                        Activity.randPicArr = Activity.picArr.sort(function(){ return 0.5 - Math.random() });
                    }while (Activity.getLevel() < 5);

                    for (i = 1; i <= 6; i++) {
                        $("small_pic_" + i).src = r.imagePath + '/small_pic_'+ Activity.randPicArr[i - 1] +'.png';
                    }
                    LMActivity.playStatus = true;
                    Activity.startGame();
                },
                2000
            );
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

                case 'btn_lottery_submit_1':
                    if(Date.now() - Activity.lastClickTime > 1000 ){
                        // H('game_container');
                        LMActivity.doLottery();
                        Activity.lastClickTime = Date.now();
                    }
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

                case 'btn_lottery_cancel_1':
                case 'btn_order_cancel':
                case 'btn_exchange_back':
                case 'btn_close':
                case 'btn_lottery_fail_1':
                case 'btn_lottery_fail':
                    LMActivity.triggerModalButton = 'btn_start';
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
            }
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        startBtn: function (){
            LMActivity.triggerModalButton = 'btn_start';

            a.AjaxHandler.uploadPlayRecord(function () {
                LMActivity.showModal({
                    id: 'game_container',
                    focusId: "btn_pic_1"
                });
                Activity.initGamePic();
                // Activity.startGame();
                r.leftTimes = r.leftTimes - 1;
                G("left_times").innerHTML = r.leftTimes;
                Activity.lastClickTime = Date.now();

            }, function () {
                LMEPG.UI.showToast('扣除游戏次数出错', 3);
            });
        },

        startGame: function () {
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
                    if (Activity.gameCount <= 0) {
                    // if (Activity.gameCount <= 0) {
                        // if (Activity.gameCount == 0)
                        //     LMEPG.UI.logPanel.show('倒计时为0！！！');
                        Activity.gameRunning = false;
                        Activity.gameCount = 0;
                        clearInterval(Activity.gameInterval);

                        if (!Activity.gameSucc){
                            LMActivity.showModal({
                                id: 'lottery_fail_1',
                                focusId: 'btn_lottery_fail_1',
                                onDismissListener: function () {
                                    LMActivity.Router.reload();
                                }
                            })
                        }
                    }
                }
            }, 1000);
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

        btnCloseMove:function(direction){
            if(direction != 'up'){
                S('card_selected');
            }
        },

        initGameButtons: function(){
            var PIC_COUNT = 6;
            for (i = 1; i <= PIC_COUNT; i++) {
                Activity.buttons.push({
                    id: 'btn_pic_' + i,
                    name: '图片按钮'+ i,
                    type: 'img',
                    nextFocusLeft: i != 1 && i != 4 ? 'btn_pic_' + (i - 1):'',
                    nextFocusRight: i != 3 && i != 6 ? 'btn_pic_' + (i + 1) :'',
                    nextFocusUp: i > 3 ? 'btn_pic_' + (i - 3) :'',
                    nextFocusDown: i < 4 ? 'btn_pic_' + (i + 3) :'',
                    backgroundImage: r.imagePath + 'transparent.png',
                    focusImage: Activity.moveStatus ? r.imagePath + '/confirm_box_f.png' : r.imagePath + '/box_f.png',
                    click: Activity.onClickBtnPic,
                    focusChange: Activity.onFocus,
                    beforeMoveChange: Activity.onMoveChange,
                    orderId: i,
                });
            }
        },

        onFocus:function(btn, hasFocus){
            if(hasFocus){
                $('btn_pic_' + btn.orderId).style.display = 'block';
            }else{
                $('btn_pic_' + btn.orderId).style.display = 'none';
            }

            if (Activity.moveStatus){
                $('btn_pic_' + btn.orderId).src = r.imagePath + '/confirm_box_f.png';
            }else{
                $('btn_pic_' + btn.orderId).src = r.imagePath + '/box_f.png';
            }
        },

        onClickBtnPic:function(btn){
            if(!LMActivity.playStatus){
                return;
            }

            Activity.moveStatus = !Activity.moveStatus;
            if (Activity.moveStatus){
                $('btn_pic_' + btn.orderId).src = r.imagePath + '/confirm_box_f.png';
            }else{
                $('btn_pic_' + btn.orderId).src = r.imagePath + '/box_f.png';
                Activity.checkGameResult();
            }
        },

        changePic:function(currentId, changeId){
            currentSrc = $('small_pic_' + currentId).src;
            changeSrc = $('small_pic_' + changeId).src;

            $('small_pic_' + currentId).src = changeSrc;
            $('small_pic_' + changeId).src = currentSrc;
        },

        onMoveChange: function (key, btn) {
            if (!Activity.gameRunning){
                return;
            }

            if (Activity.moveStatus){
                currentId = btn.orderId;
                if (key == 'up' && currentId > 3){
                    changeId = currentId - 3;
                } else if (key == 'down' && currentId <= 3){
                    changeId = currentId + 3;
                }  else if (key == 'left' && currentId != 1 && currentId != 4){
                    changeId = currentId - 1;
                }  else if (key == 'right' && currentId != 3 && currentId != 6){
                    changeId = currentId + 1;
                }
                Activity.changePic(currentId, changeId);
            }
        },
        
        checkGameResult:function () {
            var tmpSrc;
            for (i = 1; i <=6; i++) {
                tmpSrc = $('small_pic_' + i).src;
                if ( parseInt(tmpSrc.substr(-5,1)) != i){
                    return;
                }
            }

            clearInterval(Activity.gameInterval);
            Activity.gameRunning = false;
            Activity.gameSucc = true;
            setTimeout(
                function(){
                    LMActivity.showModal({
                        id: 'lottery_success_1',
                        focusId: 'btn_lottery_submit_1'
                    })
                    LMActivity.playStatus = false;
                }
                , 1000);
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
        },  {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusRight: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        },  {
            id: 'btn_close',
            name: '按钮-游戏返回',
            type: 'img',
            nextFocusDown: 'card_selected',
            nextFocusLeft: 'card_selected',
            nextFocusRight: 'card_selected',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.gif'),
            beforeMoveChange: Activity.btnCloseMove,
            click: Activity.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_start',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'lottery',
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
            nextFocusUp: 'btn_winner_list',
            nextFocusLeft: 'btn_winner_list',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.gif'),
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
            listType: 'lottery',
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
            id: 'btn_lottery_submit_1',
            name: '按钮-游戏成功确定',
            type: 'img',
            nextFocusRight: 'btn_lottery_cancel_1',
            backgroundImage: a.makeImageUrl('btn_lottery_submit_1.png'),
            focusImage: a.makeImageUrl('btn_lottery_submit_1_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_lottery_cancel_1',
            name: '按钮-游戏成功取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit_1',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_lottery_fail_1',
            name: '按钮-第一轮未中奖确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-第二轮未中奖确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_submit',
            name: '按钮-第二轮中奖-确定',
            type: 'img',
            nextFocusUp: 'lottery_tel',
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
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
            id: 'lottery_tel',
            name: '输入框-兑换-电话号码',
            type: 'div',
            nextFocusDown: 'btn_lottery_submit',
            backFocusId: 'btn_lottery_submit',
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