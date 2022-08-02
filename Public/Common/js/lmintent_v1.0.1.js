/**
 * 页面跳转控制器
 * Created by caijun on 2018/5/09.
 */

LMEPG.Intent = (function () {
    return {
        // 入栈参数
        INTENT_FLAG_DEFAULT: 0,   // 正常入栈
        INTENT_FLAG_CLEAR_TOP: 1,  // 清空栈，入栈元素为栈顶
        INTENT_FLAG_NOT_STACK: 2,  // 元素不入栈

        INTENT_JUMP_URL: "/index.php/Base/Intent/index",
        INTENT_BACK_URL: "/index.php/Base/Intent/back",

        /**
         * 页面跳转：返回生成的跳转地址URL。
         *
         * 根据intentFlag判断入栈方式，intentFlag可选值：
         * <ul>
         *  <li>INTENT_FLAG_DEFAULT：如果backPage存在，backPage入栈。否则srcPage（非空时）入栈</li>
         *  <li>INTENT_FLAG_CLEAR_TOP：清空栈中元素，如果backPage存在，backPage入栈。否则srcPage（非空时）入栈</li>
         *  <li>INTENT_FLAG_NOT_STACK：不需要入栈。当前页只是作为中间页</li>
         * </ul>
         *
         * @param dst [object] 需要跳转的目标页面“路由名称”
         * @param src [object] 当前页面“路由名称”
         * @param intentFlag [number] 入栈标志（详见LMEPG.Intent.INTENT_FLAG_{DEFAULT|CLEAR_TOP|NOT_STACK}）
         * @param backPage [object] 入栈页面，如果为空的话，src作为入栈页面（针对的是目标页面返回跳转页面不是当前页面时使用）
         * @see {@link LMEPG.Intent.INTENT_FLAG_DEFAULT}
         * @see {@link LMEPG.Intent.INTENT_FLAG_CLEAR_TOP}
         * @see {@link LMEPG.Intent.INTENT_FLAG_NOT_STACK}
         */
        getJumpUrl: function (dst, src, intentFlag, backPage) {
            if (typeof intentFlag === "undefined" || intentFlag == null || intentFlag === "") {
                intentFlag = this.INTENT_FLAG_DEFAULT;
            }
            var goUrl = this.getAppRootPath() + this.INTENT_JUMP_URL
                + "?dst=" + encodeURI(JSON.stringify(dst))
                + "&src=" + encodeURI(JSON.stringify(src))
                + "&backPage=" + encodeURI(JSON.stringify(backPage))
                + "&intentFlag=" + intentFlag;

            return goUrl;
        },

        /**
         * 页面跳转, 根据intentFlag判断入栈方式
         *         intentFlag：INTENT_FLAG_DEFAULT。如果backPage存在，backPage入栈。否则srcPage（非空时）入栈
         *                     INTENT_FLAG_CLEAR_TOP。清空栈中元素，如果backPage存在，backPage入栈。否则srcPage（非空时）入栈
         *                     INTENT_FLAG_NOT_STACK。 不需要入栈。当前页只是作为中间页
         * @param dst         需要跳转的目标页面
         * @param src         当前页面
         * @param intentFlag  入栈标志
         * @param backPage    入栈页面，如果为空的话，src作为入栈页面（针对的是目标页面返回跳转页面不是当前页面时使用）
         */
        jump: function (dst, src, intentFlag, backPage) {
            if (intentFlag == undefined || intentFlag == null) {
                intentFlag = this.INTENT_FLAG_DEFAULT;
            }
            var goUrl = LMEPG.Intent.getJumpUrl(dst, src, intentFlag, backPage);
            if(get_carrier_id()=="520095" && goUrl.indexOf("lmzhjkpic") == -1 && !window.local_debug){
                goUrl='/lmzhjkpic'+goUrl;
            }
            LMEPG.Log.info("task:goUrl:"+goUrl);
            window.location.href = goUrl;
        },

        /**
         * 返回上一页
         */
        back: function (pageName) {
            if (window.IS_PRESS_BACK && IS_PRESS_BACK()) return;
            window.location.href = this.getAppRootPath() + this.INTENT_BACK_URL
                + "?pageName=" + pageName;
        },

        /**
         * 创建意图对象
         * @param pageName
         */
        createIntent: function (pageName, pageParam) {
            var name = "";
            var param = {};
            if (pageName != undefined && pageName != null) {
                name = pageName;
            }
            if (pageParam != undefined && pageParam != null) {
                param = pageParam;
            }
            return {
                name: name,
                param: param,
                setPageName: function (name) {
                    this.name = name;
                },
                setParam: function (name, value) {
                    this.param[name] = value;
                }
            }
        },

        getAppRootPath: function () {
            var appRootPath = this.getCookie('c_app_root_path');
            if (appRootPath === undefined || appRootPath === null) {
                appRootPath = "";
            }
            return appRootPath;
        },

        /**
         * 得到缓存
         *
         * @param c_name
         * @returns {*}
         */
        getCookie: function (c_name) {
            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    var c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) {
                        c_end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        }
    }
})();