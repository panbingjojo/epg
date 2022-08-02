var DonateBlood = {
    marquee:marquee(),
    arrIndex:LMEPG.Func.getLocationString('arrIndex') || 0 ,

    init: function () {
        DonateBlood.createBtns();
        //初始化献血屋信息
        DonateBlood.initRoomInfo();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },

    initRoomInfo:function () {

        var arrIndex = DonateBlood.arrIndex;
        var hosName = CommonData.hospitalArray[arrIndex].hospitalName;
        var hosAddr = CommonData.hospitalArray[arrIndex].hospitalAddr;
        var hosTime = CommonData.hospitalArray[arrIndex].hospitalWorkTime;
        var hosTel = CommonData.hospitalArray[arrIndex].hospitalTel;
        var hosPicUrl = '/Public/img/hd/DonateBlood/V1/'+CommonData.hospitalArray[arrIndex].hospitalImg;

        // 如果文字超边界滚动显示
        hosName.length > 15 ? DonateBlood.marquee.start({
            el: G('blood_room_name'),
            len: 11,
            txt: hosAddr
        }, true) : G('blood_room_name').innerHTML = hosName;

        hosAddr.length > 18 ? DonateBlood.marquee.start({
            el: G('blood_room_addr'),
            len: 11,
            txt: hosAddr
        }, true) : G('blood_room_addr').innerHTML = hosAddr;

        G('blood_room_time').innerHTML=hosTime;
        G('blood_room_tel').innerHTML=hosTel;
        G('bg_room_pic').src=hosPicUrl;
    },


    getCurrentPage: function () {
        var obj = LMEPG.Intent.createIntent('bloodRoomInfo');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        obj.setParam('arrIndex', DonateBlood.arrIndex);
        return obj;
    },
    // 咨询医生
    onClickBloodAsk: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('doctorList');
        addrObj.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 提前预约
    onClickBloodOrder: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('qrCode');
        addrObj.setParam('userId', RenderParam.userId);
        addrObj.setParam('qrTitle', '立即预约');
        addrObj.setParam('qrText1', '请用微信扫描屏幕二维码预约献血');
        addrObj.setParam('qrText2', '并补充献血登记材料');
        addrObj.setParam('qrCode', CommonData.hospitalArray[DonateBlood.arrIndex].appointmentQrcodeImg);

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 导航
    onClickBloodNav: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('qrCode');
        addrObj.setParam('userId', RenderParam.userId);
        addrObj.setParam('qrTitle', '马上导航');
        addrObj.setParam('qrText1', '请用微信扫描屏幕二维码');
        addrObj.setParam('qrText2', ('导航至'+CommonData.hospitalArray[DonateBlood.arrIndex].hospitalAddr));
        addrObj.setParam('qrCode', CommonData.hospitalArray[DonateBlood.arrIndex].hospitalQrCodeImg);

        LMEPG.Intent.jump(addrObj, currObj);
    },

    jumpPage: function (btn) {
        switch (btn.id) {
            case 'btn_ask_doctor':
                DonateBlood.onClickBloodAsk();
                break;
            case 'btn_order_advance':
                DonateBlood.onClickBloodOrder();
                break;
            case 'btn_nav':
                DonateBlood.onClickBloodNav();
                break;
        }
    },

    createBtns: function () {
        var buttons = [];
        buttons.push({
            id: 'btn_ask_doctor',
            type: 'img',
            nextFocusLeft: 'btn_nav',
            nextFocusRight: 'btn_order_advance',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_ask_doctor.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_ask_doctor_f.png',
            click: this.jumpPage,
            cIdx:1
            },{
            id: 'btn_order_advance',
            type: 'img',
            nextFocusLeft: 'btn_ask_doctor',
            nextFocusRight: 'btn_nav',
            backgroundImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_order_advance.png',
            focusImage: g_appRootPath + '/Public/img/hd/DonateBlood/V1/btn_order_advance_f.png',
            click: this.jumpPage,
            cIdx:2
        },{
            id: 'btn_nav',
            type: 'img',
            nextFocusLeft: 'btn_order_advance',
            nextFocusRight: 'btn_ask_doctor',
            backgroundImage: g_appRootPath+'/Public/img/hd/DonateBlood/V1/btn_nav.png',
            focusImage: g_appRootPath+'/Public/img/hd/DonateBlood/V1/btn_nav_f.png',
            click: this.jumpPage,
            cIdx:3
        });


        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'btn_order_advance', buttons, true);
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