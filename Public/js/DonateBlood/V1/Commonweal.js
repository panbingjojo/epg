var DonateBlood = {
    // page: LMEPG.Func.getLocationString('page') || 1,
    index: 0,
    flag:true,
    times:0,
    imgPath:g_appRootPath+ '/Public/img/hd/DonateBlood/V1/commonwealImg_',
    imgNum:5,
    
    init: function () {
        DonateBlood.createBtns();
        DonateBlood.initImgbar();
        //图片轮播
        DonateBlood.intervalCount = setInterval(DonateBlood.imgChange,2000);
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
    initImgbar:function () {
        // 创建轮播图圆点
        var html1 = '';
        var html2 = '';

        for(var i=0;i<DonateBlood.imgNum;i++){
            html1 +='<div id="bar_'+(i+1)+'" class="bar_hide"></div>'
            html2 +='<img id="photo_'+(i+1)+'" class="photo" src="'+DonateBlood.imgPath+(i+1)+'.jpg"></img>'
        }
        G('bar_list').innerHTML=html1;
        G('img_list').innerHTML=html2;
    },

    imgChange:function () {
            if(DonateBlood.index >= 5){
                DonateBlood.index=0;
            };
            for(var i=1;i<=DonateBlood.imgNum;i++){
                H('photo_'+i);
                G('bar_'+i).className="bar_hide";
            }

            S('photo_' + (DonateBlood.index+1));
            G('bar_'+(DonateBlood.index+1)).className="bar_show";

            DonateBlood.index++;

    },

    getCurrentPage: function () {
        var obj = LMEPG.Intent.createIntent('commonweal');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        return obj;
    },
    // 献血咨询
    onClickBloodAsk: function () {
        var currObj = this.getCurrentPage();
        var addrObj = {};
        if (RenderParam.carrierId == '640094'){ // 跳转单条图文
            addrObj = LMEPG.Intent.createIntent('album');
            addrObj.setParam("albumName", "TemplateAlbum");
            addrObj.setParam("graphicId", '655'); // 图文ID << 	银川市各献血点开放如下 >>
        } else {
            addrObj = LMEPG.Intent.createIntent('doctorList');
            addrObj.setParam('userId', RenderParam.userId);
        }

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 献血流程
    onClickBloodStep: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('bloodStep');
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
    // 个人中心
    onClickPersonal: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('personal');
        addrObj.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(addrObj, currObj);
    },

    jumpPage: function (btn) {
        switch (btn.id) {
            case 'btn_blood_ask':
                DonateBlood.onClickBloodAsk();
                break;
            case 'btn_blood_step':
                DonateBlood.onClickBloodStep();
                break;
            case 'btn_blood_order':
                DonateBlood.onClickBloodOrder();
                break;
            case 'btn_personal':
                DonateBlood.onClickPersonal();
                break;
        }
    },

    createBtns: function () {
        var buttons = [];
        buttons.push({
            id: 'btn_blood_ask',
            type: 'img',
            nextFocusLeft: 'btn_personal',
            nextFocusRight: 'btn_blood_step',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:1
            },{
            id: 'btn_blood_step',
            type: 'img',
            nextFocusLeft: 'btn_blood_ask',
            nextFocusRight: 'btn_blood_order',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:2
        },{
            id: 'btn_blood_order',
            type: 'img',
            nextFocusLeft: 'btn_blood_step',
            nextFocusRight: 'btn_personal',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:3
        },{
            id: 'btn_personal',
            type: 'img',
            nextFocusLeft: 'btn_blood_order',
            nextFocusRight: 'btn_blood_ask',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:4
        });


        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'btn_blood_ask', buttons, true);
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