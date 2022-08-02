(function (w, e, r, a) {
    var Activity = {
        isVip: RenderParam.isVip,

        init: function () {
            Activity.initButtons();
            Activity.showOrderResult();

            var nowTime = new Date().getTime();
            var startDate = RenderParam.endDt;
            startDate = startDate.replace(new RegExp("-", "gm"), "/");
            var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
            if (nowTime >= endDateM) { /*活动结束*/
                LMActivity.showModal({
                    id: 'bg_game_over',
                    onDismissListener: function () {
                        LMEPG.Intent.back();
                    }
                });
            }
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        showOrderResult: function () {
            if (RenderParam.isOrderBack == "1") {
                if (RenderParam.cOrderResult == "1") {
                    Activity.showTimeoutDialog('订购成功');
                } else {
                    Activity.showTimeoutDialog('订购失败');
                }
            }
        },

        showTimeoutDialog: function (statements) {
            LMEPG.UI.showToast(statements, 2);
        },

        JudgeConditions: function () {
            if (Activity.isVip == '1') {
                Activity.jumpActivity();
            }else {
                LMActivity.Router.jumpBuyVip();
            }
        },

        jumpActivity: function () {
            var objCurrent = LMActivity.Router.getCurrentPage(); //得到当前页

            var objHome = LMEPG.Intent.createIntent("home");
            objHome.setParam("userId", RenderParam.userId);

            var objActivity = LMEPG.Intent.createIntent("activity");
            objActivity.setParam("userId", RenderParam.userId);
            objActivity.setParam("activityName", 'ActivityConsultationNew20200603');
            objActivity.setParam("inner", 1);

            LMEPG.Intent.jump(objActivity, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objHome);
        },
    };

    Activity.buttons = [
        {
            id: 'btn_start',
            name: '按钮-确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            click: Activity.JudgeConditions,
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['460092', '410092', '10220094', '10220095', '630092'];

/**
 * 退出，返回
 */
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);
}