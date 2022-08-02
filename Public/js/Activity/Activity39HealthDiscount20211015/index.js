(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 20,
            timerId: "",
            currentSkin: 1,
            wheelTimer:"",


            init: function () {
                Activity.initButtons();
                Activity.showOrderResult();

                RenderParam.lmcid == "410092" && Activity.onBack410092()

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

            showOrderResult: function () {
                if (r.isOrderBack === '1') { // 从订购页面跳转回活动页面
                    if (r.cOrderResult === '1') { // 订购成功
                        $('order_status').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_order_success.png') + ')'
                    } else { // 订购失败
                        $('order_status').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_order_fail.png') + ')'
                    }
                    LMActivity.showModal({ //展示模板页面
                        id: 'order_status',
                        onDismissListener: function () {
                            if (LMActivity.orderTimer && LMActivity.orderTimer !== null) {
                                if (r.cOrderResult === '1') {
                                    LMEPG.Intent.back();
                                } else {
                                    // 关闭倒计时
                                    clearTimeout(LMActivity.orderTimer);
                                }
                            }
                        }
                    });
                    LMActivity.orderTimer = setTimeout(function () {// 设置倒计时关闭模板页面
                        LMActivity.hideModal(LMActivity.shownModal);
                    }, 3000);
                }
            },

            onBack410092: function () {
                try {
                    HybirdCallBackInterface.setCallFunction(function (param) {
                        LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                        if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                            window.onBack();
                        }
                    });
                } catch (e) {
                    LMEPG.UI.logPanel.show("e");
                }
            },

            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack();
                        break;
                    case 'btn_start':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },
            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },
            onInputFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(850, 475, btn.id, btn.backFocusId, true);
                }
            },
        };
        Activity.buttons = [
            {
                id: 'btn_start',
                name: '开始订购',
                type: 'img',
                nextFocusUp: 'btn_back',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }
        ];

        w.Activity = Activity;
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094', '220095', '410092', '10220094'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);
}
