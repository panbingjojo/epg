// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 全局扩展通用方法及变量，在lmcommon.js中LMEPG声明后引入该js！
// +----------------------------------------------------------------------
// | 说明：
// |    涉及到某些业务逻辑，但又不想每个页面都创建引入，则使用该统一公共业务逻
// | 辑管理全局调用、控制。此全局扩展文件应当只做如下事情：
// |    1. 定义需要的“业务层全局变量”。
// |    2. 定义需要的“业务层逻辑方法”。
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/12/27
// +----------------------------------------------------------------------

// 统一导航扩展
try {
    document.writeln('<script type="text/javascript" src="' + g_appRootPath + '/Public/js/Utils/UserReport.js?t=' + new Date().getTime() + '"></script>');
} catch (e) {
    console.error('lmcommonExt.js includes JS-Files error:' + e.toString());
}

/**
 * 提示文字，部分业务层提示，可能多个页面都提示一样。
 */
LMEPG.Tips = {
    VIP_NOT_SUPPORT: "您订购的套餐暂不支持该功能",
};

/**
 * 扩展业务服务 - 暂时避免那些频繁用到，从后端传递到前端的中间变量数据。通过此定义获取，解决每个页面挨个去声明php-assign的数据，
 * 避免页面太多不好兼顾全部。
 * 但是，请注意：尽量不要把任何数据都往此加。慎用~
 */
LMEPG.ExtService = (function () {
    var clazz = function () {

        // 当前实例
        var self = this;

        /**
         * 功能代号（提供外部调用），务必与后端Constants->FUNC_XXX协商一致！
         */
        this.FuncID = {
            FUNC_PLAY_VIDEO: 101,               //视频点播
            FUNC_ASK_DOCTOR: 102,               //问诊医生
            FUNC_ASK_EXPERT: 103,               //问诊大专家
        };

        /**
         * 获取用户限制访问列表，当且仅当为vip用户时才需要调用此判断。
         * @return {null|*} {"price":800,"productId":"xxx","allowLimit":1,"limitFuncIDs":[101,102,103],"desc":"8元-健康体验包：限制视频点播、VIP问诊、大专家问诊功能。"}
         */
        this.getUserFuncLimit = function () {
            try {
                var cUFL = LMEPG.Cookie.getCookie("c_user_func_limit");
                console.log("[JS-getUserFuncLimit]--cUFL:" + decodeURIComponent(cUFL));
                if (LMEPG.Log) LMEPG.Log.info("[JS-getUserFuncLimit]--cUFL:" + decodeURIComponent(cUFL));
                return eval('(' + decodeURIComponent(cUFL) + ')');
            } catch (e) {
                console.warn(e);
                if (LMEPG.Log) LMEPG.Log.error("[JS-getUserFuncLimit]--error:" + e.toString());
                return null;
            }
        };

        /**
         * 校验当前“仅VIP用户”点击行为是否有功能限制。若无限制，则默认执行第1个回调。若有限制，执行第2上回调。
         * <pre>
         *     调用示例：
         *     LMEPG.ExtService.checkUserFuncLimit(isVip, function(isVipUser, msg) {
         *         // 无任何限制，走默认逻辑
         *         if (!isVipUser) {
         *             // 非vip用户，禁止执行。例如，跳转到订购页...
         *         } else {
         *             // 其它放行逻辑...
         *         }
         *     }, function(isVipUser, msg, vipUserLimitFuncIDs) {
         *         // VIP用户存在功能限制，自定义拦截或提示
         *         LMEPG.UI.showToast(LMEPG.Tips.VIP_NOT_SUPPORT);
         *     });
         * </pre>
         * @param isVip [boolean] true/1-vip false/0-非vip
         * @param defaultCallback [function] 默认回调，附带参数。
         *      例如：noLimitUseCallback(
         *              isVipUser,              //boolean：是否vip用户。true-是 false-不是
         *              msg,                    //string: 描述信息
         *           )
         * @param limitVipUseCallback [function] vip用户被限制使用回调，附带参数。
         *      例如：limitUseCallback(
         *              isVipUser,              //boolean：是否vip用户。true-是 false-不是
         *              msg,                    //string: 仅针对vip用户被限制的描述信息，由后台返回
         *              vipUserLimitFuncIDs,    //number-array: 仅针对vip用户根据其订购套餐限制功能数组编号（详见 {@link LMEPG.ExtService.FuncID}）。若空，表示该vip无限制。
         *           )
         * @param whichFuncID [number] 要判断的具体功能编号（详见 {@link LMEPG.ExtService.FuncID}）。若传递无效，则默认取决于后台配置开关。
         */
        this.checkUserFuncLimit = function (isVip, defaultCallback, limitVipUseCallback, whichFuncID) {
            var isVipUser = (typeof isVip === "boolean" && isVip) || parseInt(isVip) === 1;
            if (isVipUser) {
                var limitInfo = self.getUserFuncLimit(); //e.g. {"price":800,"productId":"8802000190","allowLimit":1,"limitFuncIDs":[101,102,103],"desc":"8元-健康体验包：限制视频点播、VIP问诊、大专家问诊功能。"}
                console.debug("[JS-checkUserFuncLimit]--limitInfo[" + (typeof limitInfo) + "]:" + JSON.stringify(limitInfo));
                if (LMEPG.Log) LMEPG.Log.info("[JS-checkUserFuncLimit]--limitInfo[" + (typeof limitInfo) + "]:" + JSON.stringify(limitInfo));
                if ((Object.prototype.toString.call(limitInfo) !== "[object Object]") || limitInfo.allowLimit !== 1 /*1开启限制 0关闭限制*/ ||
                    (Object.prototype.toString.call(limitInfo.limitFuncIDs) !== "[object Array]" || limitInfo.limitFuncIDs.length === 0)) {
                    LMEPG.call(defaultCallback, [isVipUser, "当前vip用户享有全部功能"]);
                } else {
                    console.debug("whichFuncID: " + whichFuncID);
                    if (typeof whichFuncID !== "undefined" && LMEPG.Func.array.contains(whichFuncID, limitInfo.limitFuncIDs)) {
                        LMEPG.call(limitVipUseCallback, [isVipUser, limitInfo.desc, limitInfo.limitFuncIDs/*an-array*/]);// 仅VIP有限制时才会回调！
                    } else {
                        LMEPG.call(defaultCallback, [isVipUser, "当前vip无限制此功能[" + whichFuncID + "]"]); // 仅VIP有限制时才会回调！
                    }
                }
            } else {
                LMEPG.call(defaultCallback, [isVipUser, "当前非vip用户"]);
            }
        };

    };
    return new clazz();
})();
