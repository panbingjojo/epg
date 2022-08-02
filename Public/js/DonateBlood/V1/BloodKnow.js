var DonateBlood = {
    maxPage: 0,
    videoList: RenderParam.carrierId == '640094' ? [671, 670, 669, 668, 667, 666]
        : [309, 310, 311, 312, 313, 314],//正式服图文ID
    // videoList:[3487,3488,3487,3488,3487,3488],        //测试服图文ID

    init: function () {
        DonateBlood.createBtns();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },

    // 框选中效果
    focusChangeEvent: function (btn, hasFocus) {
        if (hasFocus) {
            G('video_f_' + btn.cIdx).style.display = 'block';
        } else {
            G('video_f_' + btn.cIdx).style.display = 'none';
        }
    },

    getCurrentPage: function () {
        var obj = LMEPG.Intent.createIntent('bloodKnow');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        return obj;
    },
    // 在线问医
    onClickBloodAsk: function () {
        var currObj = this.getCurrentPage();
        var addrObj = {};
        if (RenderParam.carrierId == '640094') { // 跳转单条图文
            addrObj = LMEPG.Intent.createIntent('album');
            addrObj.setParam("albumName", "TemplateAlbum");
            addrObj.setParam("graphicId", '655'); // 图文ID << 	银川市各献血点开放如下 >>
        } else {
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
                // DonateBlood.onClickBloodKnow();
                break;
            case 'btn_xxlc':
                DonateBlood.onClickBloodStep();
                break;
            case 'btn_bxzy':
                DonateBlood.onClickNav();
                break;
            case 'btn_yyxx':
                DonateBlood.onClickBloodOrder();
                break;
        }
    },
    // 图文点击
    onClickTuWen: function (btn) {
        var index = btn.cIdx - 1;
        var objSrc = DonateBlood.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('album');
        objDst.setParam("albumName", "TemplateAlbum");
        objDst.setParam("graphicId", DonateBlood.videoList[index]);
        LMEPG.Intent.jump(objDst, objSrc);
    },

    createBtns: function () {
        var buttons = [];
        var imageName = RenderParam.carrierId == '640094' ? 'btn_counsel' : 'btn_zxwy';
        buttons.push({
            id: 'video_1',
            type: 'img',
            nextFocusLeft: 'btn_yyxx',
            nextFocusRight: 'video_2',
            nextFocusDown: 'video_4',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.onClickTuWen,
            cIdx: 1
        }, {
            id: 'video_2',
            type: 'img',
            nextFocusLeft: 'video_1',
            nextFocusRight: 'video_3',
            nextFocusDown: 'video_5',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.onClickTuWen,
            cIdx: 2
        }, {
            id: 'video_3',
            type: 'img',
            nextFocusLeft: 'video_2',
            nextFocusRight: 'video_4',
            nextFocusDown: 'video_6',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.onClickTuWen,
            cIdx: 3
        }, {
            id: 'video_4',
            type: 'img',
            nextFocusLeft: 'video_3',
            nextFocusRight: 'video_5',
            nextFocusUp: 'video_1',
            nextFocusDown: 'btn_zxwy',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.onClickTuWen,
            cIdx: 4
        }, {
            id: 'video_5',
            type: 'img',
            nextFocusLeft: 'video_4',
            nextFocusRight: 'video_6',
            nextFocusUp: 'video_2',
            nextFocusDown: 'btn_xxxz',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.onClickTuWen,
            cIdx: 5
        }, {
            id: 'video_6',
            type: 'img',
            nextFocusLeft: 'video_5',
            nextFocusRight: 'btn_zxwy',
            nextFocusUp: 'video_3',
            nextFocusDown: 'btn_yyxx',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.onClickTuWen,
            cIdx: 6
        }, {
            id: 'btn_zxwy',
            type: 'img',
            nextFocusLeft: 'video_6',
            nextFocusRight: 'btn_xxxz',
            nextFocusUp: 'video_4',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/' + imageName + '.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/' + imageName + '_f.png',
            click: this.jumpPage,
        }, {
            id: 'btn_xxxz',
            type: 'img',
            nextFocusLeft: 'btn_zxwy',
            nextFocusRight: 'btn_xxlc',
            nextFocusUp: 'video_5',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_xxxz.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_xxxz_f.png',
            click: this.jumpPage,
        }, {
            id: 'btn_xxlc',
            type: 'img',
            nextFocusLeft: 'btn_xxxz',
            nextFocusRight: 'btn_bxzy',
            nextFocusUp: 'video_5',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_xxlc.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_xxlc_f.png',
            click: this.jumpPage,
        }, {
            id: 'btn_bxzy',
            type: 'img',
            nextFocusLeft: 'btn_xxlc',
            nextFocusRight: 'btn_yyxx',
            nextFocusUp: 'video_5',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_bxzy.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_bxzy_f.png',
            click: this.jumpPage,
        }, {
            id: 'btn_yyxx',
            type: 'img',
            nextFocusLeft: 'btn_bxzy',
            nextFocusRight: 'video_1',
            nextFocusUp: 'video_6',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_yyxx.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_yyxx_f.png',
            click: this.jumpPage,
        });

        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'btn_xxxz', buttons, true);
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