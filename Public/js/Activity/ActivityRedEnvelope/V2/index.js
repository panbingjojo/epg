window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
(function (win, LMEPG, RenderParam) {


    /**
     * 按back键默认返回实现（为兼容页面遗漏或者通用定义冗余）。
     * 注：若存在其它业务逻辑，请具体页面定义覆写！
     */
    function onBack() {
        // Activity.jumpHome();
        LMEPG.Intent.back("IPTVPortal");
    }

    var Activity = {
        countdown: 10, //倒计时10s
        timer: '',   // 清除倒计时
        init: function () {
            Activity.createBtns();
            LMEPG.BM.init('btn_start', Activity.buttons, '', true);
            Activity.timer = setInterval(function () {
                // 做居中处理
                G("count_down").innerHTML = Activity.countdown;
                Activity.countdown--;
                if (Activity.countdown == 0) {
                    Activity.jumpHome();
                    clearInterval(Activity.timer);
                }
            }, 1000);

            // // 监听焦点移动
            // Activity.time1 = setInterval(function () {
            //     if (LMEPG.BM.getCurrentButton().id != 'btn_sure') {
            //         clearInterval(Activity.timer);
            //         clearInterval(Activity.time1);
            //     }
            // }, 500);

        },
        /*设置当前页参数*/
        getCurrentPage: function () {
            var objCurrent = LMEPG.Intent.createIntent('activity-common-guide');
            return objCurrent;
        },

        onInputFocus: function (btn, hasFocus) {
            if (hasFocus) {
                LMEPG.UI.keyboard.show(300, 300, btn.id, btn.backFocusId, true);
            }
        },

        /**
         * 跳转到home页面
         */
        jumpHome: function () {
            var objCurrent = Activity.getCurrentPage();
            var objHome = LMEPG.Intent.createIntent("home");

            LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
        },

        /**
         * 跳转 -- 专辑页面
         * @param albumName
         */
        jumpAlbumPage: function (albumName) {
            var home = LMEPG.Intent.createIntent("home");
            var objHome = Activity.getCurrentPage();
            var objAlbum = LMEPG.Intent.createIntent('album');
            objAlbum.setParam('albumName', albumName);
            objAlbum.setParam('userId', RenderParam.userId);
            objAlbum.setParam('inner', 1);
            LMEPG.Intent.jump(objAlbum, objHome, LMEPG.Intent.INTENT_FLAG_DEFAULT, home);
        },

        onClickSure: function () {
            var userTel = G('reset_tel').innerText;

            //判断手机号是否正确
            if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                LMEPG.UI.showToast('请输入有效的电话', 1);
                return;
            }

            var postData =  {
                "key": 'ActivityRedEnvelope20201109',
                "value": userTel
            };
            LMEPG.UI.showWaitingDialog("");

            // 保存用户电话号码
            LMEPG.ajax.postAPI('Common/saveData', postData,
                function (rsp) { // 网络请求成功
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.BM.setKeyEventPause(false);
                    if (rsp.result == 0) {// 接口调用成功
                        console.log('号码保存成功 '+rsp.result);
                        Hide(btn_container);
                        Show('btn_notice');
                        LMEPG.BM.requestFocus('btn_notice_sure');
                    } else { // 接口调用失败
                        console.log('号码保存失败 '+rsp.result);
                    }
                }, function () { // 网络请求失败
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.BM.setKeyEventPause(false);
                }
            );

        },



        /*事件综合处理（返回到首页）*/
        eventHandler: function (btn) {
            switch (btn.id){
                case 'btn_close':
                case 'btn_notice_sure':
                    Activity.jumpHome();
                    break;
                case 'btn_sure':
                    Activity.onClickSure();
                    break;
                case 'btn_cancel':
                    G('reset_tel').innerHTML = '';
                    break;
                case 'btn_start':
                    G('start_bg').style.display = 'none';
                    LMEPG.BM.requestFocus("btn_sure");
                    clearInterval(Activity.timer);
                    break;
            }

        },


        buttons: [],
        createBtns: function () {
            var self = Activity;
            var imgPrefix = RenderParam.imgPathPrefix;
            this.buttons = [
                {
                    id: 'btn_close',
                    name: '退出活动',
                    type: 'img',
                    nextFocusDown: 'btn_cancel',
                    nextFocusLeft: 'btn_cancel',
                    backgroundImage: imgPrefix + 'btn_close.png',
                    focusImage: imgPrefix + 'btn_close_f.png',
                    click: self.eventHandler
                },{
                    id: 'btn_sure',
                    name: '确定',
                    type: 'img',
                    nextFocusUp: 'reset_tel',
                    nextFocusRight: 'btn_cancel',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.png',
                    click: self.eventHandler
                },{
                    id: 'btn_start',
                    name: '活动开始',
                    type: 'img',
                    nextFocusUp: '',
                    nextFocusRight: '',
                    backgroundImage: imgPrefix + 'start.png',
                    focusImage: imgPrefix + 'start_f.png',
                    click: self.eventHandler
                },{
                    id: 'btn_cancel',
                    name: '取消',
                    type: 'img',
                    nextFocusUp: 'reset_tel',
                    nextFocusLeft: 'btn_sure',
                    nextFocusRight: 'btn_close',
                    backgroundImage: imgPrefix + 'btn_cancel.png',
                    focusImage: imgPrefix + 'btn_cancel_f.png',
                    click: self.eventHandler
                },{
                    id: 'reset_tel',
                    name: '号码',
                    type: 'div',
                    backFocusId: 'btn_sure',
                    focusChange: self.onInputFocus
                },{
                    id: 'btn_notice_sure',
                    name: '弹窗-确定',
                    type: 'img',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.png',
                    click: self.eventHandler
                }
            ];
        }
    };
    win.Activity = Activity;
    win.onBack = onBack;
}(window, LMEPG, RenderParam));
