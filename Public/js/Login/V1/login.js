var Page = {
    init:function () {
        this.initButton()
        G('account').innerHTML  = RenderParam.accountId
        this.exchangeUserInfo({exchangeType:0})
        LMEPG.BM.init('sure-btn',[])
    },

    initButton:function () {
        var btnArr = [{
            id: 'qr-btn',
            type: 'img',
            nextFocusDown:'ex-avatar',
            nextFocusUp:'',
            backgroundImage: "/Public/img/hd/Home/V32/qr-btn.png",
            focusImage: "/Public/img/hd/Home/V32/qr-btn-f.png",
            click:Page.showQR,
            focusChange: '',
            beforeMoveChange: ''
        },{
            id: 'ex-avatar',
            type: 'img',
            nextFocusDown:'ex-name',
            nextFocusUp:'qr-btn',
            backgroundImage: "/Public/img/hd/Home/V32/exchange.png",
            focusImage: "/Public/img/hd/Home/V32/exchange-f.png",
            click: Page.exchangeUserInfo,
            focusChange: '',
            beforeMoveChange: '',
            exchangeType:2,
        },{
            id: 'ex-name',
            type: 'img',
            nextFocusDown:'sure-btn',
            nextFocusUp:'ex-avatar',
            backgroundImage: "/Public/img/hd/Home/V32/exchange.png",
            focusImage: "/Public/img/hd/Home/V32/exchange-f.png",
            click: Page.exchangeUserInfo,
            focusChange: '',
            beforeMoveChange: '',
            exchangeType:1
        },{
            id: 'sure-btn',
            type: 'img',
            nextFocusDown:'',
            nextFocusUp:'ex-name',
            backgroundImage: "/Public/img/hd/Home/V32/sure.png",
            focusImage: "/Public/img/hd/Home/V32/sure-f.png",
            click: Page.login,
            focusChange: '',
            beforeMoveChange: ''
        }]

        LMEPG.BM.addButtons(btnArr)
    },

    exchangeUserInfo:function (btn) {
        LMEPG.ajax.postAPI("Notify/modifyHandNickName", {"type":btn.exchangeType}, function (data) {
          if(btn.exchangeType === 1){
              G('nickname').innerHTML = data.data.result.nick_name
          }else if(btn.exchangeType === 2){
              G('avatar').src =RenderParam.fsUrl +  data.data.result.hand_url
          }else {
              G('nickname').innerHTML = data.data.result.nick_name
              G('avatar').src =RenderParam.fsUrl +  data.data.result.hand_url
          }
        })
    },

    login:function () {
        var target = LMEPG.Intent.createIntent('home')
        LMEPG.Intent.jump(target,'',LMEPG.Intent.INTENT_FLAG_NOT_STACK)
    },

    showQR:function () {
        LMEPG.ajax.postAPI("Notify/getGameHandQRCode", {}, function (data) {
            Hide('login-area')
            Show('qr-area')

            G('qr-pic').src = data.imgUrl

            LMEPG.BM.addButtons([{
                id: 'qr-direct-btn',
                type: 'img',
                nextFocusDown:'',
                nextFocusUp:'',
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Home/V32/qr-direct-btn.png",
                click: Page.closeQrArea,
                focusChange: '',
                beforeMoveChange: ''
            }])

            LMEPG.BM.requestFocus('qr-direct-btn')
        })
    },

    closeQrArea:function () {
        Show('login-area')
        Hide('qr-area')
        Page.exchangeUserInfo({exchangeType:0})
        LMEPG.BM.requestFocus('sure-btn')

    }

}

function onBack() {
    if(G('qr-area').style.display === 'block'){
        Show('login-area')
        Hide('qr-area')
        Page.exchangeUserInfo({exchangeType:0})
        LMEPG.BM.requestFocus('sure-btn')
    }else {
        LMEPG.Intent.back()
    }
}