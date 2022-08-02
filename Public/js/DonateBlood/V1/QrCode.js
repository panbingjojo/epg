var DonateBlood = {
    init: function () {
        DonateBlood.initBack();
        //初始二维码页面信息
        DonateBlood.initQrInfo();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },
    getCurrentPage: function () {
        var obj = LMEPG.Intent.createIntent('qrCode');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        return obj;
    },

    initQrInfo:function () {

        var qrTitle = LMEPG.Func.getLocationString('qrTitle') || '' ;
        var qrCode = '/Public/img/hd/DonateBlood/V1/'+LMEPG.Func.getLocationString('qrCode') || '' ;
        var qrText1 = LMEPG.Func.getLocationString('qrText1') || '' ;
        var qrText2 = LMEPG.Func.getLocationString('qrText2') || '' ;
        var qrText3 = LMEPG.Func.getLocationString('qrText3') || '' ;

        G('qr_title').innerHTML=qrTitle;
        G('pic_qr_code').src=qrCode;
        G('qr_text1').innerHTML=qrText1;
        G('qr_text2').innerHTML=qrText2;
        G('qr_text3').innerHTML=qrText3;
    },

    initBack:function () {
        var buttons = [];
        LMEPG.BM.init('', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: DonateBlood.goBack});
    }
};

