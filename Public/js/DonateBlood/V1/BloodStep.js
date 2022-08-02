var DonateBlood = {
    maxPage: 0,

    init: function () {
        DonateBlood.createBtns();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },

    // 框选中效果
    focusChangeEvent: function (btn, hasFocus) {
        if (hasFocus) {
            G('btn_f_' + btn.cIdx).style.display = 'block';
        } else {
            G('btn_f_' + btn.cIdx).style.display = 'none';
        }
    },

    getCurrentPage: function () {
        var obj = LMEPG.Intent.createIntent('bloodStep');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        return obj;
    },
    // 在线问医
    onClickBloodAsk: function () {
        var currObj = this.getCurrentPage();
        var addrObj = {};
        if (RenderParam.carrierId == '640094'){ // 跳转单条图文
            addrObj = LMEPG.Intent.createIntent('album');
            addrObj.setParam("albumName", "TemplateAlbum");
            addrObj.setParam("graphicId", '655'); // 图文ID << 	银川市各献血点开放如下 >>
        }else {
            addrObj = LMEPG.Intent.createIntent('doctorList');
            addrObj.setParam('userId', RenderParam.userId);
        }

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 献血须知
    onClickBloodKnow: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('bloodKnow');
        addrObj.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 献血流程
    onClickBloodStep: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('bloodStep');
        addrObj.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 报销指引
    onClickNav: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('bloodNav');
        addrObj.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 预约献血
    onClickBloodOrder: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('bloodOrder');
        addrObj.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(addrObj, currObj);
    },


    jumpPage: function (btn) {
        switch (btn.id) {
            case 'btn_zxwy':
                DonateBlood.onClickBloodAsk();
                break;
            case 'btn_xxxz':
                DonateBlood.onClickBloodKnow();
                break;
            case 'btn_xxlc':
                // DonateBlood.onClickBloodStep();
                break;
            case 'btn_bxzy':
                DonateBlood.onClickNav();
                break;
            case 'btn_yyxx':
                DonateBlood.onClickBloodOrder();
                break;
        }
    },

    createBtns: function () {
        var buttons = [];
        var imageName = RenderParam.carrierId == '640094' ? 'btn_counsel' : 'btn_zxwy';
        buttons.push({
            id: 'btn_zxwy',
            type: 'img',
            nextFocusLeft: 'btn_yyxx',
            nextFocusRight: 'btn_xxxz',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/' + imageName + '.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/' + imageName + '_f.png',
            // focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx: 1
        }, {
            id: 'btn_xxxz',
            type: 'img',
            nextFocusLeft: 'btn_zxwy',
            nextFocusRight: 'btn_xxlc',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_xxxz.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_xxxz_f.png',
            // focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx: 2
        }, {
            id: 'btn_xxlc',
            type: 'img',
            nextFocusLeft: 'btn_xxxz',
            nextFocusRight: 'btn_bxzy',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_xxlc.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_xxlc_f.png',
            // focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx: 3
        }, {
            id: 'btn_bxzy',
            type: 'img',
            nextFocusLeft: 'btn_xxlc',
            nextFocusRight: 'btn_yyxx',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_bxzy.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_bxzy_f.png',
            // focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx: 4
        }, {
            id: 'btn_yyxx',
            type: 'img',
            nextFocusLeft: 'btn_bxzy',
            nextFocusRight: 'btn_zxwy',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_yyxx.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_yyxx_f.png',
            // focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx: 5
        });


        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'btn_xxlc', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: DonateBlood.goBack});
    }
};

function marquee() {
    var _option = {};
    return {
        start: function (obj, bol) {
            _option = obj;
            _option.bol = bol;
            // 得到焦点或失去焦点没有达到限制长度直接返回
            if (obj.txt.length < obj.len) return obj.txt;
            var htm = '<marquee ' +
                'style="float:left;width:100%;height:100%" ' +
                // 滚动速度
                'scrollamount="' + obj.vel + '" ' +
                // 滚动方式（如来回滚动、从左至右滚动）
                'behavior="' + obj.way + '" ' +
                // 滚动方向
                'direction="' + obj.dir + '">' +
                obj.txt +
                '</marquee>';
            if (bol) {
                obj.el.innerHTML = htm;
            } else {
                // 返回没有事件驱动文本滚动
                return htm;
            }
        },
        stop: function (fn) {
            if (!_option.el) return;
            _option.el.innerHTML = _option.bol ? LMEPG.Func.substrByOmit(_option.txt, _option.len) : _option.txt;
            fn && fn.apply(null, arguments);
        }
    };
}