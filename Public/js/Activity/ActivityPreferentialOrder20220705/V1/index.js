(function (w, e, r, a) {
        var Activity = {
            playStatus: false,

            init: function () {
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                a.showOrderResult();

                var nowTime= new Date().getTime();
                var startDate =RenderParam.endDt;
                startDate= startDate.replace(new RegExp("-","gm"),"/");
                var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
                if(nowTime>=endDateM){
                    LMActivity.showModal({
                        id: 'bg_game_over',
                        onDismissListener: function () {
                            LMEPG.Intent.back()
                        }
                    });
                }
            },

            initRegional: function () {
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                // 活动规则
                G('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                // 兑换奖品
            },

            initGameData: function () {
                LMActivity.playStatus = false;
            },
            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack()
                        break;
                    case 'btn_order_submit':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_order_cancel':
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'btn_start':
                        Activity.showGameStatus();
                        break;
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },
            showGameStatus: function () {
                if (r.isVip === 0 || r.isVip === '0') {
                    // 普通用户提示VIP订购
                    LMActivity.showModal({
                        id: 'order_vip',
                        focusId: 'btn_order_submit'
                    });
                } else {
                    // VIP用户提示活动结束
                    LMEPG.UI.showToast("你已经订购过，不用再订购！");
                }
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
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusDown: 'btn_start',
                nextFocusUp: 'btn_back',
                nextFocusLeft: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_start',
                name: '开始',
                type: 'img',
                nextFocusUp: 'btn_activity_rule',
                nextFocusRight: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_order_submit',
                name: '按钮-订购VIP',
                type: 'img',
                nextFocusRight: 'btn_order_cancel',
                backgroundImage: a.makeImageUrl('btn_order_submit.png'),
                focusImage: a.makeImageUrl('btn_order_submit_f.png'),
                click: Activity.eventHandler
            },{
                id: 'btn_order_cancel',
                name: '按钮-取消订购VIP',
                type: 'img',
                nextFocusLeft: 'btn_order_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            },
        ];

        w.Activity = Activity;
        w.onBack = function () {
            if (LMActivity.shownModal) {
                if (LMActivity.shownModal.id === 'order_vip') {
                    LMActivity.hideModal(LMActivity.shownModal);
                    LMEPG.BM.requestFocus('btn_start');
                }else {
                    LMActivity.hideModal(LMActivity.shownModal);
                }
            } else {
                LMActivity.innerBack()
            }
        }
    }

)
(window, LMEPG, RenderParam, LMActivity);