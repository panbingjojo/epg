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
        },

        initGameData:function () {
            //高清参数
            if(r.platformType == 'hd') {
                //平台初始化
                Activity.screenHeight = 720;                             //屏幕高度
                Activity.platformIdHeight = 500;                         //每个平台的高度
                Activity.platformIdWidth = 240;                          //每个平台的宽度
                Activity.platformInitTop = -500;                         //平台重置位置
                Activity.platformMovePostion = -500;                     //平台下一贞移动到的位置
                Activity.platformIdTopSpace = 0;                         //平台Top间距

                //角色初始化
                Activity.jumpDirection = 'left';                        //跳跃方向
                Activity.jumperHeight = 240;                             //每个角色的高度
                Activity.jumperWidth = 160;                              //每个角色的宽度

                //左右各两组jumper，[left,top]
                Activity.jumperA = [
                    [LMActivity.makeImageUrl('gm_left_ready.png'),  [330, 1000]],
                    [LMActivity.makeImageUrl('gm_left_start.png'),  [460, 890]],
                    [LMActivity.makeImageUrl('gm_left_top.png'),    [590, 750]],
                    [LMActivity.makeImageUrl('gm_left_down.png'),   [730, 750]],
                    [LMActivity.makeImageUrl('gm_left_stop.png'),   [830, 750]],

                    [LMActivity.makeImageUrl('gm_right_ready.png'), [830, 750]],
                    [LMActivity.makeImageUrl('gm_right_start.png'), [740, 640]],
                    [LMActivity.makeImageUrl('gm_right_top.png'),   [620, 500]],
                    [LMActivity.makeImageUrl('gm_right_down.png'),  [480, 500]],
                    [LMActivity.makeImageUrl('gm_right_stop.png'),  [330, 500]],

                    [LMActivity.makeImageUrl('gm_left_ready.png'),  [330, 500]],
                    [LMActivity.makeImageUrl('gm_left_start.png'),  [460, 390]],
                    [LMActivity.makeImageUrl('gm_left_top.png'),    [590, 250]],
                    [LMActivity.makeImageUrl('gm_left_down.png'),   [730, 250]],
                    [LMActivity.makeImageUrl('gm_left_stop.png'),   [830, 250]],

                    [LMActivity.makeImageUrl('gm_right_ready.png'),[830, 250]],
                    [LMActivity.makeImageUrl('gm_right_start.png'),[740, 140]],
                    [LMActivity.makeImageUrl('gm_right_top.png'),   [620, 0]],
                    [LMActivity.makeImageUrl('gm_right_down.png'),  [480, 0]],
                    [LMActivity.makeImageUrl('gm_right_stop.png'),  [330, 0]],
                ];
            //标清参数
            }else{
                //平台初始化
                Activity.screenHeight = 530;                             //屏幕高度
                Activity.platformIdHeight = 300;                         //每个平台的高度
                Activity.platformIdWidth = 144;                          //每个平台的宽度
                Activity.platformInitTop = -300;                         //平台重置位置
                Activity.platformMovePostion = -300;                     //平台下一贞移动到的位置
                Activity.platformIdTopSpace = 0;                         //平台Top间距

                //角色初始化
                Activity.jumpDirection = 'left';                        //跳跃方向
                Activity.jumperHeight = 140;                             //每个角色的高度
                Activity.jumperWidth = 104;                              //每个角色的宽度
                //左右各两组jumper，[left,top]
                Activity.jumperA = [
                    [LMActivity.makeImageUrl('gm_left_ready.png'),  [140, 600]],
                    [LMActivity.makeImageUrl('gm_left_start.png'),  [210, 540]],
                    [LMActivity.makeImageUrl('gm_left_top.png'),    [280, 450]],
                    [LMActivity.makeImageUrl('gm_left_down.png'),   [350, 450]],
                    [LMActivity.makeImageUrl('gm_left_stop.png'),   [420, 450]],

                    [LMActivity.makeImageUrl('gm_right_ready.png'), [420, 450]],
                    [LMActivity.makeImageUrl('gm_right_start.png'), [350, 390]],
                    [LMActivity.makeImageUrl('gm_right_top.png'),   [260, 300]],
                    [LMActivity.makeImageUrl('gm_right_down.png'),  [180, 300]],
                    [LMActivity.makeImageUrl('gm_right_stop.png'),  [140, 300]],

                    [LMActivity.makeImageUrl('gm_left_ready.png'),  [140, 300]],
                    [LMActivity.makeImageUrl('gm_left_start.png'),  [210, 240]],
                    [LMActivity.makeImageUrl('gm_left_top.png'),    [280, 150]],
                    [LMActivity.makeImageUrl('gm_left_down.png'),   [350, 150]],
                    [LMActivity.makeImageUrl('gm_left_stop.png'),   [420, 150]],

                    [LMActivity.makeImageUrl('gm_right_ready.png'),[420, 150]],
                    [LMActivity.makeImageUrl('gm_right_start.png'),[350, 60]],
                    [LMActivity.makeImageUrl('gm_right_top.png'),   [260, -30]],
                    [LMActivity.makeImageUrl('gm_right_down.png'),  [180, -30]],
                    [LMActivity.makeImageUrl('gm_right_stop.png'),  [140, -30]],
                ];
            }

            //公用参数设置
            //===========可调控参数============
            Activity.platformIntervalTime = 30;                     //平台移动速度，每多少毫秒移动一次
            Activity.platformMoveDistance = 20;                     //平台每次移动多少个px
            Activity.jumpIntervalTime = 2;                         //角色跳跃速度，角色显示时间步长,多长时间显示一个位置
            Activity.gameCount = 15;                                //游戏倒计时X秒
            Activity.notMovePlatformTime =  3;                      //3秒倒计时计时,游戏开始3秒内不移动平台
            //===========可调控参数============

            Activity.getScorcePerJump = 1                            //每一跳得分
            Activity.jumperId = 0;                                   //当前角色ID
            Activity.jumperNumber = 5;                               //角色数目
            Activity.isStartJump = false;                             //是否已开始跳,控制3秒未跳结束游戏
            Activity.finishJumpLevel = true;                         //是否跳完一层，控制向上跳的按键,未落地不允许起跳。
            Activity.isJump = false;                                //是否在跳，控制每一个跳的动作
            Activity.currentMovePlatform = 'gm_platform';           //当前移动平台
            Activity.gmElementA = [];
            Activity.createJumper();
            Activity.visibleJumper = Activity.gmElementA[0];        //当前显示的角色
        },

        createJumper: function () {
            var gmPlatform = document.getElementById('gm_platform');
            for (var i = 0; i < Activity.jumperA.length; i++) {
                var gmElement = document.createElement('img');
                gmElement.style.position = 'absolute';
                gmElement.src = Activity.jumperA[i][0];
                gmElement.style.left = Activity.jumperA[i][1][0] + 'px';
                gmElement.style.top =  Activity.jumperA[i][1][1] + 'px';
                gmElement.id = gmElement.name = 'gm_' + i;

                //var n = i % Activity.jumperNumber;
                //LMEPG.UI.logPanel.show('createJumper', i,'Activity.jumperNumber', Activity.jumperNumber, 'i % Activity.jumperNumber=', n);
                //一组设置一个jumper起跳
                if(i % Activity.jumperNumber == 0){
                    gmElement.beforeMoveChange = Activity.startJump;
                    //LMEPG.UI.logPanel.show('gmElement', i ,gmElement);
                }

                gmElement.style.visibility = i == 0 ? 'visible' : 'hidden';
                gmPlatform.appendChild(gmElement);
                Activity.gmElementA.push(gmElement);
                Activity.buttons.push(gmElement);
            }
        },

        initButtons: function () {
            e.BM.init('btn_ready', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_tips':
                case 'btn_prev':
                    // LMActivity.triggerModalButton = btn.id;
                    LMActivity.triggerModalButton = 'btn_tips';
                    LMActivity.showModal({
                        id: 'tips',
                        focusId: 'btn_next'
                    });
                    break;
                case 'btn_next':
                    // LMActivity.triggerModalButton = btn.id;
                    LMActivity.triggerModalButton = 'btn_tips';
                    LMActivity.showModal({
                        id: 'tips_2',
                        focusId: 'btn_prev'
                    });
                    break;

                case 'btn_back_home':
                    //江苏电信EPG，用户点击“返回优品生活首页”按钮，即回到局方提供的链接
                    if (r.lmcid == '320092') {
                        window.location.href="http://180.100.135.12:8296/life/superior/login";
                    } else {
                        LMActivity.exitActivity();
                    }
                    break;

                case 'btn_ready':
                    LMActivity.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        // Activity.initGameData();
                        LMActivity.showModal({
                            id: 'game_container',
                            focusId: 'btn_start'
                        });
                    }else{
                        a.showGameStatus('btn_game_over_sure');
                    };
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
                case 'exchange_prize_1':
                case 'exchange_prize_2':
                case 'exchange_prize_3':
                    var exchangeScore = parseInt(G("exchange_point_" + (btn.order + 1)).innerHTML);
                    if (r.score < exchangeScore) {
                        LMEPG.UI.showToast("积分不足", 3);
                    }else{
                        LMActivity.exchangePrize(btn.order);
                    }
                    break;
                case 'btn_order_cancel':
                    LMActivity.triggerModalButton = 'btn_ready';
                case 'btn_game_fail_sure':
                case 'btn_game_sure':
                case 'btn_close_tips':
                case 'btn_close_tips_2':
                case 'btn_exchange_back':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
            }
        },

        startBtn: function (){
            Hide('btn_start');
            a.AjaxHandler.uploadPlayRecord(function () {
                if (LMActivity.playStatus = 'false') {
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: Activity.gmElementA[0].id,
                        onDismissListener: function () {
                            // 清除游戏状态
                            Activity.gameRunning = false;
                            $('game_container').innerHTML = '';
                            if (Activity.gameCount > 0) {
                                clearInterval(Activity.platformInterval);
                                clearInterval(Activity.gameInterval);
                                clearInterval(Activity.mindInterval);
                                clearInterval(Activity.mindMoveIntervel);
                                clearInterval(Activity.showInteval);
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
            // LMEPG.UI.logPanel.show('%c start game!', 'color:#f00');
            LMActivity.playStatus = true;
            //初始化一次Top
            G(Activity.currentMovePlatform).style.top = Activity.platformInitTop + 'px';
            Activity.startMovePlatform();
            var gameCountdown = $('game_countdown');
            gameCountdown.innerHTML = String(Activity.gameCount);
            Activity.gameRunning = true;
            Activity.gameOver = false;
            // 启动游戏定时器
            Activity.gameInterval = setInterval(function () {
                if (Activity.gameRunning) {
                    Activity.notMovePlatformTime--;
                    if(Activity.notMovePlatformTime <= 0 && !Activity.isStartJump){
                        Activity.gameOver = true;
                    }

                    Activity.gameCount = Activity.gameCount - 1;
                    gameCountdown.innerHTML = String(Activity.gameCount);
                    // 倒计时为0 弹窗游戏结果
                    if (Activity.gameCount <= 0 || Activity.gameOver) {
                        // if (Activity.gameCount == 0)
                        //     LMEPG.UI.logPanel.show('倒计时为0！！！');
                        Activity.gameRunning = false;
                        Activity.gameCount = 0;
                        clearInterval(Activity.gameInterval);
                        clearInterval(Activity.mindInterval);
                        clearInterval(Activity.mindMoveIntervel);
                        clearInterval(Activity.platformInterval);

                        Activity.checkGameResult();
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

        //重置角色位置
        resetJumper:function(){
            //前两组都在初始化屏中，不用重置
            if (Activity.jumperId >= Activity.jumperNumber * 2) {
                // LMEPG.UI.logPanel.show('1 resetCount' + Activity.resetCount,' jumperId', Activity.jumperId,Activity.visibleJumper);

                G('gm_' +  Activity.jumperId).style.visibility = 'hidden';
                Activity.jumperId -= Activity.jumperNumber * 2;//两组一屏
                Activity.visibleJumper = G('gm_' +  Activity.jumperId);
                Activity.visibleJumper.style.visibility = 'visible';

                // LMEPG.UI.logPanel.show('2 resetCount' + Activity.resetCount,'jumperId', Activity.jumperId,Activity.visibleJumper);
            }
        },

        platformMove: function () {
            if(Activity.gameRunning && !Activity.gameOver && !Activity.isJump && (Activity.notMovePlatformTime <= 0 || Activity.isStartJump)) {
                var platform = G(Activity.currentMovePlatform);
                var platformTop = isNaN(parseInt(platform.style.top)) ? 0 : parseInt(platform.style.top);
                ///////////////////////////////
                // var jumper = Activity.visibleJumper;
                // var jumperTop = isNaN(parseInt(jumper.style.top)) ? 0 : parseInt(jumper.style.top);
                //
                // LMEPG.UI.logPanel.show('111 pfTop:'+platformTop+' pfOffsetTop:'+ platform.offsetTop+ ' pfY:'+ platform.y + Activity.visibleJumper.id+
                //     ' screenHeight'+ Activity+' 111 jumperTop:'+jumperTop+' jumperOffsetTop:'+jumper.offsetTop+ ' jumperY:'+ jumper.y);
                ///////////////////////////////
                //当平台顶端下降到和浏览器顶端平齐,并且等跳的角色到起跳位置时再重置
                if(platformTop >= 0 && Activity.jumperId % Activity.jumperNumber == 0 && Activity.jumperId != 0)
                {
                    // LMEPG.UI.logPanel.show('reset top 1 jumperid='+ Activity.jumperId +
                    //     ' G(Activity.currentMovePlatform).style.top'+ G(Activity.currentMovePlatform).style.top +
                    //     ' platformTop'+ platformTop + ' platform: ' + platform);
                    Activity.resetJumper();
                    Activity.platformMovePostion = Activity.platformInitTop;
                    G(Activity.currentMovePlatform).style.top = Activity.platformInitTop + 'px';
                    // LMEPG.UI.logPanel.show('reset top 2 jumperid='+ Activity.jumperId, G(Activity.currentMovePlatform).style.top+
                    //     ' platformTop'+ platformTop+' platform: '+platform);
                }
                else
                {
                    Activity.platformMovePostion += Activity.platformMoveDistance;
                    G(Activity.currentMovePlatform).style.top = Activity.platformMovePostion  + 'px';
                }
                //////////////////////////////////////
                // platformTop = isNaN(parseInt(platform.style.top)) ? 0 : parseInt(platform.style.top);
                // jumper = Activity.visibleJumper;
                // jumperTop = isNaN(parseInt(jumper.style.top)) ? 0 : parseInt(jumper.style.top);
                // LMEPG.UI.logPanel.show('222 pfTop:'+platformTop+' pfOffsetTop:'+ platform.offsetTop+ ' pfY:'+ platform.y + Activity.visibleJumper.id+
                //     ' screenHeight'+ Activity+' 222 jumperTop:'+jumperTop+' jumperOffsetTop:'+jumper.offsetTop+ ' jumperY:'+ jumper.y);
                /////////////////////////////////////


                //判断当前显示角色是否掉出屏幕,半高超过顶或过底，视为游戏结束
                Activity.judgeJumperOverScreen();
            }
        },

        startMovePlatform: function(){
            if(Activity.platformInterval){
                clearInterval(Activity.platformInterval);
            }
            Activity.platformInterval = setInterval(Activity.platformMove, Activity.platformIntervalTime);
        },

        //判断当前显示角色是否掉出屏幕,半高超过顶或底触屏底，视为游戏结束
        judgeJumperOverScreen: function(){
            var platform = G(Activity.currentMovePlatform);
            var platformTop = isNaN(parseInt(platform.style.top)) ? 0 : parseInt(platform.style.top);
            var jumperTop = isNaN(parseInt(Activity.visibleJumper.style.top)) ? 0 : parseInt(Activity.visibleJumper.style.top);
            var jumperHalfTop = jumperTop + platformTop + Activity.jumperHeight / 2 ;
            var jumperFullTop = jumperTop + platformTop;
            // var jumperFullTop = jumperTop + platformTop + Activity.jumperHeight;

            // LMEPG.UI.logPanel.show(' judgeJumperOverScreen!'+ Activity.visibleJumper +
            //     ' visibleJumper.id'+Activity.visibleJumper.id+
            //     ' jumperHalfTop: '+ jumperHalfTop+
            //     ' jumperFullTop: '+ jumperFullTop+
            //     ' Activity.visibleJumper.y: '+ Activity.visibleJumper.y +
            //     ' Activity.visibleJumper.offsetTop'+Activity.visibleJumper.offsetTop+
            //     ' visibleJumper.style.top'+Activity.visibleJumper.style.top+
            //     ' screenHeight:'+Activity.screenHeight);

            if (jumperHalfTop < 0 || jumperFullTop > Activity.screenHeight) {
                // LMEPG.UI.logPanel.show(' gameover! visibleJumper.id'+Activity.visibleJumper.id+
                //     ' platformTop：'+platformTop+ ' jumperTop: '+jumperTop+
                //     ' visibleJumper.style.top'+Activity.visibleJumper.style.top+
                //     ' jumperHalfTop: '+ jumperHalfTop+
                //     ' jumperFullTop: '+ jumperFullTop+
                //     ' Activity.visibleJumper.y: '+ Activity.visibleJumper.y +
                //     ' Activity.visibleJumper.offsetTop'+Activity.visibleJumper.offsetTop+
                //     ' screenHeight:'+Activity.screenHeight);
                //结束游戏；
                Activity.gameOver = true;
            }
        },

        //起跳
        startJump: function(direction, button){
            //不满足跳跃条件
            if(!Activity.gameRunning || Activity.gameOver || !Activity.finishJumpLevel || Activity.isJump || direction != 'up'){
                return;
            }

            Activity.isStartJump = true;
            Activity.finishJumpLevel = false;
            Activity.showInteval = setInterval(function(){
                if (Activity.gameCount == 0 || Activity.gameOver)
                    return;

                Activity.isJump = true;
                //隐藏前一个角色
                if (Activity.jumperId > 0){
                    var gmHideId = 'gm_'+ (Activity.jumperId - 1) ;
                    G(gmHideId).style.visibility = "hidden";
                }

                //显示当前角色
                var gmShowId = 'gm_' +  Activity.jumperId;
                G(gmShowId).style.visibility = "visible";
                Activity.visibleJumper = G(gmShowId);

                //跳完最后一步，改变跳转方向，计算结果，等待按键
                if ((Activity.jumperId + 1) % (Activity.jumperNumber) == 0)
                {
                    // Activity.startMovePlatform();
                    clearInterval(Activity.showInteval);
                    Activity.score += Activity.getScorcePerJump;

                    //显示下一跳的准备
                    G(gmShowId).style.visibility = "hidden";
                    var gmShowId = 'gm_' +  ((Activity.jumperId + 1) == Activity.jumperA.length ? 0 : (Activity.jumperId + 1));
                    G(gmShowId).style.visibility = "visible";
                    Activity.visibleJumper = G(gmShowId);
                    Activity.finishJumpLevel = true;
                }

                // console.log('%c startJump',' color:#0f0;','Activity.jumperId : ', Activity.jumperId , 'visibleJumper.y: ', Activity.visibleJumper.y,
                //     'platform.top:', G(Activity.currentMovePlatform).style.top);

                if(++Activity.jumperId == Activity.jumperA.length)
                    Activity.jumperId =  0;

                Activity.isJump = false;


                if(Activity.notMovePlatformTime >= 0){
                    Activity.judgeJumperOverScreen();
                }
            } , Activity.jumpIntervalTime);
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
            id: r.lmcid == '320092' ? 'btn_back_home' :  'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_activity_rule',
            nextFocusDown: 'btn_tips',
            backgroundImage: a.makeImageUrl(r.lmcid == '320092' ? 'btn_back_home.png' :  'btn_back.png'),
            focusImage: a.makeImageUrl(r.lmcid == '320092' ? 'btn_back_home_f.png' :  'btn_back_f.png'),
            click: r.lmcid == '320092' ?  Activity.eventHandler : a.eventHandler
        }, {
            id: 'btn_tips',
            name: '按钮-贪凉指南-返回',
            type: 'img',
            nextFocusUp: r.lmcid == '320092' ? 'btn_back_home' :  'btn_back',
            nextFocusLeft: 'btn_ready',
            backgroundImage: a.makeImageUrl('btn_tips.png'),
            focusImage: a.makeImageUrl('btn_tips_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_ready',
            name: '按钮-准备',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_exchange_prize',
            nextFocusRight: 'btn_tips',
            backgroundImage: a.makeImageUrl('btn_ready.png'),
            focusImage: a.makeImageUrl('btn_ready_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusRight: r.lmcid == '320092' ? 'btn_back_home' :  'btn_back',
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
            id: 'btn_close_tips',
            name: '按钮-活动小贴士1-返回',
            type: 'img',
            nextFocusDown: 'btn_next',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_next',
            name: '按钮-贪凉指南-下一页',
            type: 'img',
            nextFocusUp: 'btn_close_tips',
            backgroundImage: a.makeImageUrl('btn_next.png'),
            focusImage: a.makeImageUrl('btn_next_f.png'),
            click: Activity.eventHandler
        },  {
            id: 'btn_close_tips_2',
            name: '按钮-活动小贴士2-返回',
            type: 'img',
            nextFocusDown: 'btn_prev',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_prev',
            name: '按钮-贪凉指南-上一页',
            type: 'img',
            nextFocusUp: 'btn_close_tips_2',
            backgroundImage: a.makeImageUrl('btn_prev.png'),
            focusImage: a.makeImageUrl('btn_prev_f.png'),
            click: Activity.eventHandler
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
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'btn_ready',
            nextFocusRight: 'btn_ready',
            backgroundImage: a.makeImageUrl('btn_change_gift.png'),
            focusImage: a.makeImageUrl('btn_change_gift_f.png'),
            // listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-start',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            beforeMoveChange: Activity.startBtn
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
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusRight: 'exchange_prize_1',
            nextFocusUp: 'btn_exchange_back',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusUp: 'btn_exchange_back',
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusUp: 'btn_exchange_back',
            nextFocusLeft: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: Activity.eventHandler
        },
        {
            id: 'btn_exchange_back',
            name: '按钮-兑换礼品-返回',
            type: 'img',
            nextFocusDown: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        },
        {
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