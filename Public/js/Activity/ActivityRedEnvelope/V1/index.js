window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
(function (win, LMEPG, RenderParam) {


    /**
     * 按back键默认返回实现（为兼容页面遗漏或者通用定义冗余）。
     * 注：若存在其它业务逻辑，请具体页面定义覆写！
     */
    function onBack() {
        Activity.jumpAlbumPage("album277");
    }

    var Activity = {
        countdown: 10, //倒计时10s
        timer: '',   // 清除倒计时
        init: function () {
            Activity.createBtns();
            LMEPG.BM.init('exit', Activity.buttons, '', true);
            Activity.timer = setInterval(function () {
                // 做居中处理
                G("count_down").innerHTML = Activity.countdown < 10 ? "&nbsp;" + Activity.countdown : Activity.countdown;
                Activity.countdown--;
                if (Activity.countdown == 0) {
                    Activity.jumpAlbumPage("album277");
                    clearInterval(Activity.timer);
                }
            }, 1000);

        },
        /*设置当前页参数*/
        getCurrentPage: function () {
            var objCurrent = LMEPG.Intent.createIntent('activity-common-guide');
            return objCurrent;
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

        /*事件综合处理（返回到首页）*/
        eventHandler: function (btn) {
            Activity.jumpAlbumPage("album277");
        },

        buttons: [],
        createBtns: function () {
            var self = Activity;
            var imgPrefix = RenderParam.imgPathPrefix;
            this.buttons = [
                {
                    id: 'exit',
                    name: '退出活动',
                    type: 'div',
                    backgroundImage: imgPrefix + 'exit.png',
                    focusImage: imgPrefix + 'exit_f.png',
                    click: self.eventHandler
                }
            ];
        }
    }
    win.Activity = Activity;
    win.onBack = onBack;
}(window, LMEPG, RenderParam));
