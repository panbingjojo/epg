var DonateBlood = {

    
    init: function () {
        DonateBlood.createBtns();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },

    // 框选中效果
    focusChangeEvent: function (btn, hasFocus) {
        if (hasFocus) {
            G('btn_order_f_' + btn.cIdx).style.display = 'block';
        } else {
            G('btn_order_f_' + btn.cIdx).style.display = 'none';
        }
    },

    getCurrentPage: function () {
        var obj = LMEPG.Intent.createIntent('personal');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        return obj;
    },
    // 献血报告
    onClickBloodReport: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('qrCode');
        addrObj.setParam('userId', RenderParam.userId);

        addrObj.setParam('qrTitle', '个人血检报告');
        addrObj.setParam('qrText1', '请用微信扫描屏幕二维码，查看个人血检报告。');
        addrObj.setParam('qrText2', '已献血用户可扫描二维码领取血液检测结果，需填写');
        addrObj.setParam('qrText3', '姓名、身份证号、最近一次献血预留的手机号码。');
        addrObj.setParam('qrCode', 'personalReportQrcode.png');

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 献血记录
    onClickBloodRecord: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('qrCode');
        addrObj.setParam('userId', RenderParam.userId);
        addrObj.setParam('qrTitle', '献血记录查询');
        addrObj.setParam('qrText1', '请用微信扫描二维码，查询献血记录。');
        addrObj.setParam('qrCode', 'personalRecordQrcode.png');

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 献血登记
    onClickBloodRegister: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('qrCode');
        addrObj.setParam('userId', RenderParam.userId);

        addrObj.setParam('qrTitle', '献血登记表');
        addrObj.setParam('qrText1', '请用微信扫描屏幕二维码');
        addrObj.setParam('qrText2', '填写信息领取献血登记表。');
        addrObj.setParam('qrCode', 'bloodRegisterQrcode.png');

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 预约献血
    onClickBloodOrder: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('bloodOrder');
        addrObj.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 申请志愿者
    onClickApplyVolunteer: function () {
        var currObj = this.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('qrCode');
        addrObj.setParam('userId', RenderParam.userId);

        addrObj.setParam('qrTitle', '申请志愿者');
        addrObj.setParam('qrText1', '请用微信扫描屏幕二维码');
        addrObj.setParam('qrText2', '申请志愿者，为社会做贡献。');
        addrObj.setParam('qrCode', 'applyVolunteerQrcode.png');

        LMEPG.Intent.jump(addrObj, currObj);
    },

    jumpPage: function (btn) {
        switch (btn.id) {
            case 'blood_report':
                DonateBlood.onClickBloodReport();
                break;
            case 'blood_record':
                DonateBlood.onClickBloodRecord();
                break;
            case 'blood_register':
                DonateBlood.onClickBloodRegister();
                break;
            case 'apply_volunteer':
                DonateBlood.onClickApplyVolunteer();
                break;
            case 'blood_order':
                DonateBlood.onClickBloodOrder();
                break;
        }
    },

    createBtns: function () {
        var buttons = [];
        buttons.push({
            id: 'blood_report',
            type: 'img',
            nextFocusLeft: 'blood_order',
            nextFocusRight: 'blood_record',
            nextFocusDown: 'blood_register',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:1
            },{
            id: 'blood_record',
            type: 'img',
            nextFocusLeft: 'blood_report',
            nextFocusRight: 'blood_register',
            nextFocusDown: 'blood_order',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:2
        },{
            id: 'blood_register',
            type: 'img',
            nextFocusLeft: 'blood_record',
            nextFocusRight: 'apply_volunteer',
            nextFocusUp: 'blood_report',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:3
        },{
            id: 'apply_volunteer',
            type: 'img',
            nextFocusLeft: 'blood_register',
            nextFocusRight: 'blood_order',
            nextFocusUp: 'blood_report',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:4
        },{
            id: 'blood_order',
            type: 'img',
            nextFocusLeft: 'apply_volunteer',
            nextFocusRight: 'blood_report',
            nextFocusUp: 'blood_record',
            focusChange: DonateBlood.focusChangeEvent,
            click: this.jumpPage,
            cIdx:5
        });


        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'blood_report', buttons, true);
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