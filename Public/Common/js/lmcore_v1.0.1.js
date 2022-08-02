/**
 * 事件监听框架
 * Created by caijun on 2018/2/28.
 */

/**
 * 通过该类，注册事件监听
 * @type {{eventHandler, eventLooper, onEvent, onVirtualEvent}}
 */
LMEPG.Framework = (function () {
    return {
        looper: function () {
            LMEPG.Framework.eventLooper();   // 启动事件监听
            LMEPG.Framework.statLooper();    // 启动统计
        },

        //事件处理
        eventHandler: function (event) {
            event = event || window.event;
            var keyCode = event.which || event.keyCode;
            if (keyCode === KEY_VIRTUAL_EVENT) {
                LMEPG.call(LMEPG.Framework.onVirtualEvent, [keyCode]);
            } else {
                LMEPG.call(LMEPG.Framework.onEvent, [keyCode]);
            }
        },

        onEvent: function (keyCode) {
            //判断是否设置按键监听暂停
            if (LMEPG.BM._isKeyEventPause == true) {
                return;
            }

            //判断是否设置按键监听拦截
            if (typeof LMEPG.BM._isKeyEventInterceptCallback === "function") {
                var isIntercept = LMEPG.BM._isKeyEventInterceptCallback(keyCode);
                if (isIntercept) {
                    return;
                }
            }

            //两次响应的间隔，不能小于100毫秒，排除掉虚拟按键
            if (!LMEPG.Func.checkClickValid()) {
                return;
            }

            //android的特殊返回键
            if (keyCode === KEY_BACK_ANDROID || keyCode === KEY_EXIT || keyCode === KEY_287) {
                keyCode = KEY_BACK;
                if (event) {
                    event.preventDefault();
                }
            }


            if (typeof LMEPG.onEvent !== "undefined" && LMEPG.onEvent !== null)
                LMEPG.onEvent(keyCode);
        },

        onVirtualEvent: function () {
            //虚拟按键事件
            eval("oEvent = " + Utility.getEvent());
            if (typeof LMEPG.onEvent !== "undefined" && LMEPG.onEvent !== null)
                LMEPG.onEvent(oEvent.type, true)
        },

        /**
         * 启动事件循环
         */
        eventLooper: function () {
            if (debug) {
                document.onkeydown = LMEPG.Framework.eventHandler;
            } else {
                document.onkeypress = LMEPG.Framework.eventHandler;
            }
        },

        /**
         * 启动统计循环
         */
        statLooper: function () {
            (function sendHeartbeat() {
                LMEPG.call('LMEPG.StatManager.sendHeartbeat()', []);
                setTimeout(sendHeartbeat, 60000);
            })();  //1分钟上报一次心跳。

            (function loopPayResult() {
                LMEPG.call('LMEPG.StatManager.loopPayResult()', []);
                setTimeout(loopPayResult, 2000);
            })();  //相隔1秒钟轮询一次支付的结果。
        }
    }
})();

LMEPG.Framework.looper();
