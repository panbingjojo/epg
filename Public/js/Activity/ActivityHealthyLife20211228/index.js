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
                RenderParam.lmcid == "410092" && Activity.onBack410092()
                LMEPG.BM.requestFocus('health_39');
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
                    case 'health_39':
                        LMEPG.Intent.jump(LMEPG.Intent.createIntent("home"), LMActivity.Router.getCurrentPage(), LMEPG.Intent.INTENT_FLAG_DEFAULT);
                        break;
                    case 'leisure_fishing':
                    case 'qq_music':
                    case 'home_health':
                        var objThirdPartySP = LMEPG.Intent.createIntent("activity-common-thirdPartySP");
                        objThirdPartySP.setParam("contentId", btn.id);
                        objThirdPartySP.setParam("isChangeReturnUrl", 1);
                        LMEPG.Intent.jump(objThirdPartySP, LMActivity.Router.getCurrentPage(), LMEPG.Intent.INTENT_FLAG_DEFAULT);
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
                id: 'health_39',
                name: '按钮-39健康',
                type: 'img',
                nextFocusRight: 'leisure_fishing',
                backgroundImage: a.makeImageUrl('39_health.png'),
                focusImage: a.makeImageUrl('39_health_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'leisure_fishing',
                name: '按钮-休闲钓鱼',
                type: 'img',
                nextFocusLeft: 'health_39',
                nextFocusRight: 'qq_music',
                backgroundImage: a.makeImageUrl('leisure_fishing.png'),
                focusImage: a.makeImageUrl('leisure_fishing_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'qq_music',
                name: '按钮-QQ音乐',
                type: 'img',
                nextFocusLeft: 'leisure_fishing',
                nextFocusRight: 'home_health',
                backgroundImage: a.makeImageUrl('qq_music.png'),
                focusImage: a.makeImageUrl('qq_music_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'home_health',
                name: '按钮-爱家健康',
                type: 'img',
                nextFocusLeft: 'qq_music',
                backgroundImage: a.makeImageUrl('home_health.png'),
                focusImage: a.makeImageUrl('home_health_f.png'),
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
