(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score: 0,
        init: function () {
            r.valueCountdown.showDialog = '0';
            Activity.initButtons();
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },
        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start':
                    a.Router.jumpBuyVip();
                    break;
            }
        }
    };

    Activity.buttons = [
        {
            id: 'btn_start',
            name: '按钮-ready',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_buy.png'),
            focusImage: a.makeImageUrl('btn_buy.png'),
            click: Activity.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);