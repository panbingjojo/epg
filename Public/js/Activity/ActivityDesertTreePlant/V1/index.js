(function (w, e, r, a) {
    var Activity = {
        init: function () {
            Activity.initRegional();
            Activity.initGameData();
            Activity.initButtons();
            Activity.initDiffImg();
            a.showOrderResult();
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            a.prizeImage = {
                "1": regionalImagePath + '/icon_prize_1.png',
                "2": regionalImagePath + '/icon_prize_2.png',
                "3": regionalImagePath + '/icon_prize_3.png',
            };

            //背景图片渲染
            if((r.score >= 3) && (r.score <= 9)){
                document.body.style.backgroundImage = 'url(' + r.imagePath + 'bg_home_2.png)';
            }else if(r.score > 9){
                document.body.style.backgroundImage = 'url(' + r.imagePath + 'bg_home_3.png)';
            }else {
                document.body.style.backgroundImage = 'url(' + r.imagePath + 'bg_home_1.png)';
            }
        },

        initGameData: function () {
            if (r.platformType === 'hd') {

            } else {

            }
            Activity.treeImagIndex = 2; //数按钮获取焦点时图片切换索引
            Activity.isShowGameStatus = false; //订购页是否显示
        },

        initButtons: function () {
            e.BM.init('btn_tree_2', Activity.buttons, true);
            Activity.gameCountDown = setInterval(Activity.replaceTreeBtnImg, 500);
        },

        //树按钮聚焦背景图动态切换
        replaceTreeBtnImg: function() {
            var currentBtnId = LMEPG.BM.getCurrentButton().id;
            if(currentBtnId.slice(0,9) == 'btn_tree_'){
                if(Activity.treeImagIndex == 1){
                    G(currentBtnId).src = a.makeImageUrl(currentBtnId + '_f1.png')
                    Activity.treeImagIndex = 2;
                }else if(Activity.treeImagIndex == 2){
                    Activity.treeImagIndex = 1;
                    G(currentBtnId).src = a.makeImageUrl(currentBtnId + '_f2.png')
                }
            }
        },

        initDiffImg: function(){

        },

        /**设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity-common-guide');
        },

        //种树
        plantingTree: function(btn){
            if((btn.id != 'btn_tree_1') && (btn.id != 'btn_tree_2')){
                //种活一棵树，积分加1
                a.AjaxHandler.addScore(1, function () {
                    LMActivity.showModal({
                        id: 'game_success',
                        focusId: 'btn_lottery_sure'
                    });
                },
                function () {
                    LMEPG.UI.showToast('添加种活树失败',1);
                });
            }else{
                LMActivity.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail_sure'
                });
            }
        },
        //种树事件处理
        plantingTreeClick: function(btn){
            a.triggerModalButton = btn.id;
            if (a.hasLeftTime()) {
                a.AjaxHandler.uploadPlayRecord(function () {
                    r.leftTimes = r.leftTimes - 1;
                    G("left_times").innerHTML = r.leftTimes;
                    Activity.plantingTree(btn);
                }, function () {
                    LMEPG.UI.showToast('扣除游戏次数出错', 3);
                });

            } else {
                Activity.isShowGameStatus = true;
                a.showGameStatus('btn_game_over_sure');
            }
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_back':
                    LMActivity.exitActivity();
                    break;
                case 'btn_order_submit':
                    LMActivity.Router.jumpBuyVip();
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_lottery_fail':
                    Activity.defaultFocusId = "btn_tree_2";
                    LMEPG.ButtonManager.init(Activity.defaultFocusId, Activity.buttons, "", true);
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
            }
        },
    };//end Activity =

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage:  a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_tree_3',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.gif'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_tree_1',
            name: '按钮-树',
            type: 'img',
            nextFocusRight: 'btn_tree_2',
            nextFocusLeft: 'btn_tree_3',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'btn_tree_4',
            backgroundImage: a.makeImageUrl('btn_tree_1.png'),
            focusImage: a.makeImageUrl('btn_tree_1_f1.png'),
            click: Activity.plantingTreeClick
        },{
            id: 'btn_tree_2',
            name: '按钮-树',
            type: 'img',
            nextFocusRight: 'btn_tree_3',
            nextFocusLeft: 'btn_tree_1',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'btn_tree_5',
            backgroundImage: a.makeImageUrl('btn_tree_2.png'),
            focusImage: a.makeImageUrl('btn_tree_2_f1.png'),
            click: Activity.plantingTreeClick
        },{
            id: 'btn_tree_3',
            name: '按钮-树',
            type: 'img',
            nextFocusRight: 'btn_tree_1',
            nextFocusLeft: 'btn_tree_2',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'btn_tree_6',
            backgroundImage: a.makeImageUrl('btn_tree_3.png'),
            focusImage: a.makeImageUrl('btn_tree_3_f1.png'),
            click: Activity.plantingTreeClick
        },{
            id: 'btn_tree_4',
            name: '按钮-树',
            type: 'img',
            nextFocusRight: 'btn_tree_5',
            nextFocusLeft: 'btn_tree_6',
            nextFocusUp: 'btn_tree_1',
            backgroundImage: a.makeImageUrl('btn_tree_4.png'),
            focusImage: a.makeImageUrl('btn_tree_4_f1.png'),
            click: Activity.plantingTreeClick
        },{
            id: 'btn_tree_5',
            name: '按钮-树',
            type: 'img',
            nextFocusRight: 'btn_tree_6',
            nextFocusLeft: 'btn_tree_4',
            nextFocusUp: 'btn_tree_2',
            backgroundImage: a.makeImageUrl('btn_tree_5.png'),
            focusImage: a.makeImageUrl('btn_tree_5_f1.png'),
            click: Activity.plantingTreeClick
        },{
            id: 'btn_tree_6',
            name: '按钮-树',
            type: 'img',
            nextFocusRight: 'btn_tree_4',
            nextFocusLeft: 'btn_tree_5',
            nextFocusUp: 'btn_tree_3',
            backgroundImage: a.makeImageUrl('btn_tree_6.png'),
            focusImage: a.makeImageUrl('btn_tree_6_f1.png'),
            click: Activity.plantingTreeClick
        }, {
            id: 'btn_close_rule',
            name: '按钮-关闭活动规则',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_close_rule.gif'),
            focusImage: a.makeImageUrl('btn_close_rule.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            listType: 'lottery',
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusUp: 'reset_tel',
            nextFocusLeft: 'btn_list_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            listType: 'lottery',
            nextFocusDown: 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_sure',
            name: '按钮-我要抽奖',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_lottery.png'),
            focusImage: a.makeImageUrl('btn_lottery_f.gif'),
            click: a.eventHandler,
        }, {
            id: 'btn_lottery_exit',
            name: '按钮-取消抽奖',
            type: 'img',
            nextFocusLeft: 'btn_lottery_sure',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: Activity.eventHandler
        }, {
            id: 'btn_lottery_submit',
            name: '按钮-中奖-确定',
            type: 'img',
            nextFocusUp: 'lottery_tel',
            nextFocusRight: 'btn_lottery_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_lottery_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_lottery_submit',
            nextFocusUp:'lottery_tel',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler,
            //backFocusId: 'btn_start'
        }, {
            id: 'lottery_tel',
            name: '输入框-中奖-电话号码',
            type: 'div',
            nextFocusRight: 'btn_lottery_submit',
            backFocusId: 'btn_lottery_submit',
            focusChange: a.onInputFocus
        }, {
            id: 'btn_lottery_fail',
            name: '按钮-抽奖失败',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler,
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-结束游戏',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler
        }, {
            id: 'btn_order_submit',
            name: '按钮-订购VIP',
            type: 'img',
            nextFocusRight: 'btn_order_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.gif'),
            click: a.eventHandler,
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.gif'),
            click: a.eventHandler
        }
    ];


    w.onBack = function () {
        if (LMActivity.shownModal) {
            if (r.isVip === '0' && r.valueCountdown.showDialog === '1' && $("order_vip").style.display == 'block') {
                LMActivity.showModal({
                    id: 'countdown',
                    onShowListener: function () {
                        LMActivity.startCountdown();
                    },
                })
            } else if(LMActivity.shownModal.id == 'countdown'){
                clearInterval(LMActivity.countInterval);
                if(LMActivity.playStatus == true) {//order_vip模块直接返回后倒计时页返回键处理
                    LMActivity.Router.reload();
                }else if(Activity.isShowGameStatus == true){//order_vip模块直接返回后倒计时页返回键处理
                    LMActivity.hideModal(LMActivity.shownModal);
                    Activity.isShowGameStatus = false;
                }else{
                    LMActivity.hideModal(LMActivity.shownModal);
                    e.Intent.back();
                }
            }else {
                if (LMActivity.playStatus) {
                    LMActivity.Router.reload();
                } else {
                    LMActivity.hideModal(LMActivity.shownModal);
                }
            }
        } else {
            LMActivity.exitActivity();
        }
    };

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);