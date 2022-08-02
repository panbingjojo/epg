window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
(function (win, LMEPG, RenderParam) {

    /**
     * 根据不同的用户类型进入的活动的背景不同
      分组1：进入产品（提醒送券），此组用户的弹窗只在开机启动弹出，其余位置不弹出。
     分组2：订购失败，返回送券，此组用户的弹窗只在订购失败或取消订购弹出，其余位置不弹出。
     分组3：观看内容-此组用户只针对观看单集视频推荐位，直接触发弹窗。
     分组4：退出无订购-此组用户只在用户退出应用时未订购，以退出挽留的形式，弹出该弹窗。
     * @type {{"1": string, "2": string, "3": string, "4": string}}
     */
    var bgTypeMap = {
        '1': 'bg_enter_product.png',
        '2': 'bg_order_fail.png',
        '3': 'bg_watch_content.png',
        '4': 'bg_exit_no_order.png'
    }

    /**
     * 按back键默认返回实现（为兼容页面遗漏或者通用定义冗余）。
     * 注：若存在其它业务逻辑，请具体页面定义覆写！
     */
    function onBack() {
        Activity.jumpHome();
    }

    var Activity = {

        init: function () {
            G('body_id').style.backgroundImage = "url(" + RenderParam.imgPathPrefix + bgTypeMap[RenderParam.userGroupType] + ")";
            Activity.createBtns();
            LMEPG.BM.init('btn_1', Activity.buttons,'',true);
        },
        /*设置当前页参数*/
        getCurrentPage: function () {
            var objCurrent = LMEPG.Intent.createIntent('activity-common-guide');
            return objCurrent;
        },

        /*进行订购跳转操作*/
        jumpBuyVip: function () {
            var objCurrent = Activity.getCurrentPage();

            var objOrderHome = LMEPG.Intent.createIntent('orderHome');
            objOrderHome.setParam('userId', RenderParam.userId);
            objOrderHome.setParam('directPay', '1');
            objOrderHome.setParam('orderReason', '101');
            objOrderHome.setParam('hasVerifyCode', '1');
            objOrderHome.setParam('remark', RenderParam.activityName);

            var objActivity = LMEPG.Intent.createIntent("activity");
            objActivity.setParam("userId", RenderParam.userId);
            objActivity.setParam("activityName", "ActivityCoupon20200722");
            objActivity.setParam("inner", 0);

            LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivity);
        },

        /**
         * 跳转到home页面
         */
        jumpHome: function () {
            var objCurrent = Activity.getCurrentPage();

            var objHome = LMEPG.Intent.createIntent("home");

            LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
        },

        /*事件综合处理（模拟事件，键盘事件）*/
        eventHandler: function (btn) {
            switch (btn.id) {
                // 退出活动
                case 'btn_2':
                    Activity.jumpHome();
                    break;
                // 进入优惠订购
                case 'btn_1':
                    Activity.jumpBuyVip();
                    break;
                default:
                    break;

            }
        },

        buttons: [],
        createBtns: function () {
            var self = Activity;
            var imgPrefix = RenderParam.imgPathPrefix;
            this.buttons = [
                {
                    id: 'btn_1',
                    name: '优惠订购',
                    type: 'img',
                    nextFocusRight: 'btn_2',
                    backgroundImage: imgPrefix + 'discounts_order.png',
                    focusImage: imgPrefix + 'discounts_order_f.png',
                    click: self.eventHandler
                }, {
                    id: 'btn_2',
                    name: '知道了',
                    type: 'img',
                    nextFocusLeft: 'btn_1',
                    backgroundImage: imgPrefix + 'know.png',
                    focusImage: imgPrefix + 'know_f.png',
                    click: self.eventHandler
                }
            ];
        }
    }
    win.Activity = Activity;
    win.onBack=onBack;
}(window, LMEPG, RenderParam));
