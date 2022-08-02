(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        picture:[],     //图片及点亮所需次数
        pic_index:1,    //景点图片默认第一张
        score:0,
        leftTime:RenderParam.leftTimes,       //当前剩余游戏次数 页面未重载时记录
        picLeftArray:[0,0,0,0,0,0,0],         //记录每张图片被点次数  页面未重载时记录

        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
        },
        initGameData:function () {
            // 游戏页 每张图片点亮所需次数;
            if(RenderParam.lmcid =='000051'||RenderParam.lmcid =='630092'){
                Activity.picture =[
                    {   picClickTime:400,
                        picVideoUrl:"Program725",
                        picVideoTitle:"孩子上火能不能喝凉茶？"
                    },{ picClickTime:450,
                        picVideoUrl:"Program405",
                        picVideoTitle:"咳嗽吃什么好得快？"
                    },{ picClickTime:550,
                        picVideoUrl:"Program1003035",
                        picVideoTitle:"哪些原因导致的失眠"
                    }]
            }else if(RenderParam.lmcid =='220094'||RenderParam.lmcid =='220095'){
                Activity.picture =[
                    {   picClickTime:100,
                        picVideoUrl:"10001110000000000000000000384506",
                        picVideoTitle:"如何才能预防儿童肥胖？"
                    },{ picClickTime:150,
                        picVideoUrl:"10001110000000000000000000374049",
                        picVideoTitle:"声音嘶哑吃什么好得快"
                    },{ picClickTime:200,
                        picVideoUrl:"10001110000000000000000000525092",
                        picVideoTitle:"笑尿了其实是一种病"
                    },{ picClickTime:250,
                        picVideoUrl:"10001110000000000000000000525083",
                        picVideoTitle:"食物减压真的有用吗"
                    },{ picClickTime:300,
                        picVideoUrl:"10001110000000000000000000525080",
                        picVideoTitle:"喝酒那些事"
                    },{ picClickTime:350,
                        picVideoUrl:"10001110000000000000000000525087",
                        picVideoTitle:"幼儿进补时节表"
                    },{ picClickTime:400,
                        picVideoUrl:"10001110000000000000000000524663",
                        picVideoTitle:"瘦腿运动"
                    }]
            }
            Activity.picLeftTimes();
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    a.triggerModalButton = btn.id;
                            LMActivity.showModal({
                                id: 'game_container',
                                focusId: 'btn_click'
                            });
                        //初始化图片数据，
                        Activity.initGameData();
                    LMActivity.playStatus = true;
                    break;
                case 'btn_click':
                    if (Activity.leftTime>0) {
                        a.triggerModalButton = btn.id;
                        a.AjaxHandler.uploadPlayRecord(function () {
                            if (LMActivity.playStatus = 'false') {
                                // LMEPG.BM.requestFocus('btn_click');
                                //记录扣除后游戏次数
                                Activity.leftTime--;
                                Activity.picLeftArray[Activity.pic_index-1]++;
                                Activity.startGame();
                            }
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        })
                    }else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
                case 'btn_game_sure':
                case 'btn_game_cancel':
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: 'btn_click'
                    });
            }
        },

        startGame: function () {
            //随机获得1-10根柳枝
            Activity.score=Math.floor(Math.random()*10)+1;
            // 当前图片剩余点击次数
            var times = Activity.picture[Activity.pic_index-1].picClickTime - RenderParam.valuePicture[Activity.pic_index-1] - Activity.picLeftArray[Activity.pic_index-1] ;

            //activity_id: 10281  图片编号为：10281000+图片编号， 当前景点点亮次数+1,如果图片已被点亮，则不在记点亮次数
            if(times >= 0){
                Activity.savePicData(10281000+Activity.pic_index);
            }
            Activity.checkGameResult();
        },
        savePicData: function (picName, successFn, errorFn) {
            var params = {
                postData: {
                    "playerId": picName,
                },
                path: 'NewActivity/doRote'
            };
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
        },
        checkGameResult: function () {
            if (Activity.score > 0) {
                $('willow_count').innerHTML = String(Activity.score);
                a.AjaxHandler.addScore(parseInt(Activity.score), function () {
                    a.showModal({
                        id: 'game_success',
                        focusId: 'btn_game_sure',
                        onDismissListener: function () {
                            Activity.picLeftTimes();
                            // a.Router.reload(); // 重新加载
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
        picLeftTimes:function () {
            // 变更图片剩余次数
            var leftTimes = Activity.picture[Activity.pic_index-1].picClickTime - RenderParam.valuePicture[Activity.pic_index-1] - Activity.picLeftArray[Activity.pic_index-1];
            if(leftTimes<=0){
                leftTimes=0;
                G('picture_recover').style.display='none';
            }else{
                G('picture_recover').style.display='block';
            }
            G('pic_left_times').innerHTML=leftTimes;
        },
        picChange: function (direction) {
            // console.log(button.id);
            switch (direction) {
                case 'left':
                    if(Activity.pic_index == 1){
                        // console.log('已经是第一张图片了');
                    }else if(Activity.pic_index > 1){
                        Activity.pic_index--;
                        if(Activity.pic_index == 1){
                            Hide('btn_prev');
                        }else if(Activity.pic_index == Object.keys(Activity.picture).length -1){
                            Show('btn_next');
                        }
                        G('picture').src = r.imagePath + 'V' + r.lmcid+ '/pic_' + Activity.pic_index + '.png';
                        Activity.picLeftTimes();
                    }
                    break;
                case 'right':
                    if(Activity.pic_index == Object.keys(Activity.picture).length){
                        // console.log('已经是最后一张图片了');
                    }else if(Activity.pic_index < Object.keys(Activity.picture).length){
                        Activity.pic_index++;
                        if(Activity.pic_index > 1){
                            Show('btn_prev');
                        };
                        if(Activity.pic_index == Object.keys(Activity.picture).length){
                            Hide('btn_next');
                        };
                        G('picture').src = r.imagePath + 'V' + r.lmcid+ '/pic_' + Activity.pic_index + '.png';
                        Activity.picLeftTimes();
                    }
                    break;

            }
        },
        picClick: function (button) {
            //如果图片未被点亮，点击无效；点亮后，弹播放器播放指定视频
            var leftTimes = Activity.picture[Activity.pic_index-1].picClickTime - RenderParam.valuePicture[Activity.pic_index-1] -Activity.picLeftArray[Activity.pic_index-1];
            if(leftTimes > 0){
                LMEPG.UI.showToast('暂未点亮',2);
            }else{
                Activity.parseVideoInfo();
            }
        },
        parseVideoInfo: function () {
            var videoParams = {
                'sourceId': Activity.pic_index,
                'videoUrl': Activity.picture[Activity.pic_index-1].picVideoUrl,
                'title': Activity.picture[Activity.pic_index-1].picVideoTitle,
                'type': 2,
                'entryType': 4,
                'entryTypeName': '',
                'userType': 0,
                'freeSeconds': 0,
                'focusIdx': LMEPG.BM.getCurrentButton().id,
                'unionCode': '',
                'showStatus': 1
            };
            Activity.playVideo(videoParams);
        },

        playVideo: function (videoParams) {
            var objCurrent = LMActivity.Router.getCurrentPage();
            var objPlayer = LMEPG.Intent.createIntent('player');
            objPlayer.setParam('videoInfo', JSON.stringify(videoParams));
            LMEPG.Intent.jump(objPlayer, objCurrent);
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
            nextFocusLeft: 'btn_start',
            backgroundImage: a.makeImageUrl('btn_change_gift.png'),
            focusImage: a.makeImageUrl('btn_change_gift_f.png'),
            // listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '按钮-出发',
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
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusRight: 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        },{
            id: 'btn_click',
            name: '按钮-点亮',
            type: 'img',
            nextFocusUp:'bg_pic',
            backgroundImage: a.makeImageUrl('btn_click.png'),
            focusImage: a.makeImageUrl('btn_click_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'bg_pic',
            name: '图片-风景',
            type: 'img',
            nextFocusDown: 'btn_click',
            backgroundImage: a.makeImageUrl('bg_pic.png'),
            focusImage: a.makeImageUrl('bg_pic_f.png'),
            beforeMoveChange: Activity.picChange,
            click: Activity.picClick
        }, {
            id: 'btn_game_sure',
            name: '按钮-游戏成功确定',
            type: 'img',
            // nextFocusRight: 'btn_game_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_cancel',
            name: '按钮-游戏成功取消',
            type: 'img',
            nextFocusLeft: 'btn_game_sure',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
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
            nextFocusLeft: 'exchange_prize_2',
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