// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | LongMaster IPTV EPG 用户界面（User Interface）js：包含系列通用UI操作！
// +----------------------------------------------------------------------
// | 说明：
// |    1.  全局通用的交互式UI组件封装。
// +----------------------------------------------------------------------
// | 使用：
// |    1. js引用
// |        e.g. <head>...<script type="text/javascript" src="__ROOT__/Public/Common/js/lmui.js?t={$time}"></script>...</head>
// +----------------------------------------------------------------------
// | 修改规则：
// |    1. 定义Object类名时，请按照“大驼峰命名法”；若为简短类名缩写，请按照“首字母”大写。
// |        e.g. LMEPG.UI
// |    2. 请统一按照功能及相关性，定义类/方法所在合适区域位置！！！
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/10/11
// +----------------------------------------------------------------------

LMEPG.UI = (function () {

    var LMUISdk = function () {
        var self = this;
        /**
         * 设置背景图片
         */
        this.setBackGround = function (postion) {
            if (postion == 'sy' && !LMEPG.Func.isEmpty(RenderParam.skin.sy)) {
                var bgImg = RenderParam.fsUrl + RenderParam.skin.sy;
                document.body.style.backgroundImage = 'url(' + bgImg + ')';
            } else if (postion == 'spj' && !LMEPG.Func.isEmpty(RenderParam.skin.spj)) {
                var bgImg = RenderParam.fsUrl + RenderParam.skin.spj;
                document.body.style.backgroundImage = 'url(' + bgImg + ')';
            } else if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
                var bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
                document.body.style.backgroundImage = 'url(' + bgImg + ')';
            } else {
                document.body.style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/Home/V13/Home/bg.png)';
            }
        };

        // 最近一次按键点击的时间戳（milli-seconds）。用于记录以避免（禁用）快速连续按键执行，导致不正常的交互体验！
        this.__lastKeyClickedInMilliSec = 0; //默认为0，表示未曾使用过

        /**
         * 禁止页面在一秒之内连续点击多次
         * @param callback [function] 允许执行的事件回调。必须为function！
         */
        this.forbidDoubleClickBtn = function (callback, duration) {
            var MAX_FORBID_INTERVAL = duration ? duration : 1000; //按钮禁用时长，1秒内禁止重复点击
            var now = new Date().getTime();
            if (self.__lastKeyClickedInMilliSec === 0) {
                self.__lastKeyClickedInMilliSec = now;
                callback();
            } else {
                var diffInterval = now - self.__lastKeyClickedInMilliSec;
                if (diffInterval > MAX_FORBID_INTERVAL) {
                    self.__lastKeyClickedInMilliSec = now;
                    callback();
                } else {
                    console.log("禁用快速按键");
                }
            }
        };

        /**
         * 校验是否是电话号码
         * @param telNum
         * @returns {boolean}
         */
        this.isTelNum = function (telNum) {
            var telReg = /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147)|(145))\d{8}$/;
            return telReg.test(telNum);
        };

        this.isEmptyAddTip = function (dataIsNull, wrap, callback) {
            if (dataIsNull && wrap) {
                wrap.innerHTML = '<span class="null-data">还没有数据 ~</span>';
                typeof callback === 'function' && callback();
            }
        };

        /**
         * 通用的消息提示框
         * @param msg [string] 弹窗显示消息
         * @param second [number] 弹窗显示时长（秒）
         * @param callback [function] 弹窗关闭后，回调
         */
        this.showToast = function (msg, second, callback) {
            if (typeof msg !== "string") { //数据未空时，不产生任何效果
                return;
            }

            second = typeof second !== "number" ? 3 : second; //没有传递second 默认3秒
            if (second > 0) {
                if (!LMEPG.UI.showToastUI) {
                    var toastDiv = document.createElement("div");
                    toastDiv.id = "id_toast";
                    LMEPG.CssManager.addClass(toastDiv, "g_toast");
                    document.body.appendChild(toastDiv);
                    LMEPG.UI.showToastUI = toastDiv;
                }

                G("id_toast").innerHTML = msg;
                S("id_toast");

                // 如果已经执行了setTimeOut,强制停止
                if (LMEPG.UI.showToastUITimer) clearTimeout(LMEPG.UI.showToastUITimer);
                LMEPG.UI.showToastUITimer = setTimeout(function () {
                    H("id_toast");
                    LMEPG.call(callback);
                }, second * 1000);
            }
        };

        /**
         * 通用的消息提示框
         * @param msg [string] 弹窗显示消息
         * @param second [number] 弹窗显示时长（秒）
         * @param callback [function] 弹窗关闭后，回调
         */
        this.showToastV1 = function (msg, second, callback) {
            if (typeof msg !== "string") { //数据未空时，不产生任何效果
                return;
            }

            second = typeof second !== "number" ? 3 : second; //没有传递second 默认3秒
            if (second > 0) {
                if (!LMEPG.UI.showToastUI) {
                    var toastDiv = document.createElement("div");
                    var toastTitle = document.createElement("div");
                    toastDiv.id = "id_toast";
                    toastTitle.id = "g_title";
                    LMEPG.CssManager.addClass(toastDiv, "g_toast");
                    toastDiv.style.backgroundImage = "url('" + LMEPG.App.getAppRootPath() + "/Public/img/hd/Home/V10/bg_toast.png')";
                    LMEPG.CssManager.addClass(toastTitle, "g_title");
                    toastTitle.innerText = "标题标题";
                    document.body.appendChild(toastDiv);
                    toastDiv.appendChild(toastTitle);
                    LMEPG.UI.showToastUI = toastDiv;
                }

                G("g_title").innerHTML = msg;
                S("id_toast");

                // 如果已经执行了setTimeOut,强制停止
                if (LMEPG.UI.showToastUITimer) clearTimeout(LMEPG.UI.showToastUITimer);
                LMEPG.UI.showToastUITimer = setTimeout(function () {
                    H("id_toast");
                    LMEPG.call(callback);
                }, second * 1000);
            }
        };

        /**
         * 通用的消息提示框
         * @param msg [string] 弹窗显示消息
         * @param second [number] 弹窗显示时长（秒）
         * @param callback [function] 弹窗关闭后，回调
         */
        this.showToastV2 = function (msg, second, callback) {
            if (typeof msg !== "string") { //数据未空时，不产生任何效果
                return;
            }

            second = typeof second !== "number" ? 3 : second; //没有传递second 默认3秒
            if (second > 0) {
                if (!LMEPG.UI.showToastUI) {
                    var toastDiv = document.createElement("div");
                    var toastTitle = document.createElement("div");
                    toastDiv.id = "id_toast_v_2";
                    toastTitle.id = "id_title_v_2";
                    LMEPG.CssManager.addClass(toastDiv, "g_toast_v_2");
                    LMEPG.CssManager.addClass(toastTitle, "g_title_v_2");
                    toastDiv.appendChild(toastTitle);
                    document.body.appendChild(toastDiv);
                    var lmcid = typeof RenderParam === "object" && typeof RenderParam.carrierId === "string" ? RenderParam.carrierId : "";
                    if (lmcid == "10000051") {
                        var tempBg = LMEPG.App.getAppRootPath() + "/Public/img/hd/Home/V20/bg_toast.png"
                        G("id_toast_v_2").style.background = "url(" + tempBg + ")";
                    }
                    LMEPG.UI.showToastUI = toastDiv;
                }

                G("id_title_v_2").innerHTML = msg;
                S("id_toast_v_2");

                // 如果已经执行了setTimeOut,强制停止
                if (LMEPG.UI.showToastUITimer) clearTimeout(LMEPG.UI.showToastUITimer);
                LMEPG.UI.showToastUITimer = setTimeout(function () {
                    H("id_toast_v_2");
                    LMEPG.call(callback);
                }, second * 1000);
            }
        };

        /**
         * 通用的消息提示框
         * @param msg [string] 弹窗显示消息
         * @param second [number] 弹窗显示时长（秒）
         * @param callback [function] 弹窗关闭后，回调
         */
        this.showToastV3 = function (msg, second, callback) {
            if (typeof msg !== "string") { //数据未空时，不产生任何效果
                return;
            }

            second = typeof second !== "number" ? 3 : second; //没有传递second 默认3秒
            if (second > 0) {
                if (!LMEPG.UI.showToastUI) {
                    var toastDiv = document.createElement("div");
                    var toastTitle = document.createElement("div");
                    toastDiv.id = "id_toast_v_3";
                    toastTitle.id = "id_title_v_3";
                    LMEPG.CssManager.addClass(toastDiv, "g_toast_v_3");
                    LMEPG.CssManager.addClass(toastTitle, "g_title_v_3");
                    toastDiv.appendChild(toastTitle);
                    document.body.appendChild(toastDiv);
                    LMEPG.UI.showToastUI = toastDiv;
                }
                G("id_title_v_3").innerHTML = msg;
                S("id_toast_v_3");

                // 如果已经执行了setTimeOut,强制停止
                if (LMEPG.UI.showToastUITimer) clearTimeout(LMEPG.UI.showToastUITimer);
                LMEPG.UI.showToastUITimer = setTimeout(function () {
                    H("id_toast_v_3");
                    LMEPG.call(callback);
                }, second * 1000);
            }
        };

        //TODO 需要再进一步调整，
        this.showToastV4 = function (toastConfig) {
            if (!toastConfig.message) { //数据未空时，不产生任何效果
                return;
            }

            var defaultConfig = {
                time: 3,
                toastBg: LMEPG.App.getAppRootPath() + "/Public/img/hd/Common/bg_toast.png",
                toastWidth: 551,
                toastHeight: 126,
                toastStyle: "g_toast_4"
            };

            if (toastConfig.time) {
                defaultConfig.time = toastConfig.time;
            }
            if (toastConfig.toastBg) {
                defaultConfig.toastBg = toastConfig.toastBg;
            }
            if (toastConfig.toastWidth) {
                defaultConfig.toastWidth = toastConfig.toastWidth;
            }
            if (toastConfig.toastStyle) {
                defaultConfig.toastStyle = toastConfig.toastStyle;
            }
            if (toastConfig.bgStyle) {
                defaultConfig.bgStyle = toastConfig.bgStyle;
            }
            if (toastConfig.messageStyle) {
                defaultConfig.messageStyle = toastConfig.messageStyle;
            }
            if (defaultConfig.time > 0) {
                if (!LMEPG.UI.toastContainerUI) {
                    LMEPG.UI.toastContainerUI = LMEPG.UI.__createToast(defaultConfig);
                }
                G("toast-message").innerHTML = toastConfig.message;
                S("toast-container");

                // 如果已经执行了setTimeOut,强制停止
                if (LMEPG.UI.showToastUITimer) clearTimeout(LMEPG.UI.showToastUITimer);
                LMEPG.UI.showToastUITimer = setTimeout(function () {
                    H("toast-container");
                    LMEPG.call(toastConfig.callback);
                }, defaultConfig.time * 1000);
            }
        };

        /**
         *  创建通用提示框
         */
        this.__createToast = function (toastConfig) {
            var toastContainer = document.createElement("div");  //创建显示控件
            var toastBackground = document.createElement("img");  //创建显示控件
            toastBackground.src = toastConfig.toastBg;
            var toastMessage = document.createElement("div");
            toastContainer.id = "toast-container";
            toastBackground.id = "toast-bg";
            toastMessage.id = "toast-message";
            LMEPG.CssManager.addClass(toastContainer, toastConfig.toastStyle);
            if (toastConfig.messageStyle) {
                LMEPG.CssManager.addClass(toastMessage, toastConfig.messageStyle);
            }
            if (toastConfig.bgStyle) {
                LMEPG.CssManager.addClass(toastBackground, toastConfig.bgStyle);
            }
            toastContainer.appendChild(toastBackground);
            toastContainer.appendChild(toastMessage);
            document.body.appendChild(toastContainer);
            return toastContainer;
        };

        /**
         * 顶部下拉显示系统消息
         * @param msg [string] 弹窗显示消息
         * @param second [number] 弹窗显示时长（秒）
         */
        this.showMessage = function (msg, second) {
            second = typeof second !== "number" ? 5 : second;

            var messageBox = G("gid_message");
            if (!messageBox) {
                messageBox = document.createElement("div");  //创建显示控件
                messageBox.id = "gid_message";
                LMEPG.CssManager.addClass(messageBox, "g_message");
                document.body.appendChild(messageBox);
            }
            messageBox.innerHTML = msg;

            var top = -60;
            //LMEPG.UI.Marquee.stop();
            //LMEPG.UI.Marquee.start(messageBox.id, 28, 5, 50, "left", "scroll");

            function _showMessage() {
                if (top <= 0) {
                    messageBox.style.top = top + "px";
                    top = (top + 5);
                    setTimeout(_showMessage, 30); //若未完全显示，则继续渐变下拉
                } else {
                    // DO SOMETHING HERE ...
                }
            }

            function _hideMessage() {
                if (top >= -80) {
                    messageBox.style.top = top + "px";
                    top = top - 5;
                    setTimeout(_hideMessage, 30); //若未完毕关闭，则继续渐变上拉
                } else {
                    // DO SOMETHING HERE ...
                    // LMEPG.UI.Marquee.stop();
                }
            }

            _showMessage();

            // 如果已经执行了setTimeOut,强制停止
            if (LMEPG.UI.showMessageUITimer) clearTimeout(LMEPG.UI.showMessageUITimer);
            LMEPG.UI.showMessageUITimer = setTimeout(_hideMessage, second * 1000);
        };

        /**
         * 通用的图片提示框
         * @param second [number] 弹窗显示时长（秒）
         * @param url [string] 弹窗图片地址
         */
        this.showToastBig = function (second, url) {
            second = typeof second !== "number" ? 3 : second; //没有传递second 默认3秒
            if (second > 0) {
                if (!LMEPG.UI.showToastBigUI) {
                    var toastDiv = document.createElement("div");
                    toastDiv.id = "g_toast_big";
                    LMEPG.CssManager.addClass(toastDiv, "g_toast_big");
                    document.body.appendChild(toastDiv);
                    LMEPG.UI.showToastBigUI = toastDiv;
                }

                S("g_toast_big");
                G("g_toast_big").style.background = "url(" + url + ") no-repeat";

                // 如果已经执行了setTimeOut,强制停止
                if (LMEPG.UI.showToastBigUITimer) clearTimeout(LMEPG.UI.showToastBigUITimer);
                LMEPG.UI.showToastBigUITimer = setTimeout('H("g_toast_big")', second * 1000);
            }
        };

        /**
         * 上下滚动位置
         * @param focusId [string] 滚动焦点的id
         * @param scrollPanelId [string] 界面滚动区域的id
         * @param direction [string] 滚动方向 ["up"|"down"]
         * @param margin [number] 是否存在空隙，默认不传为空。必须是一个number类型数值
         */
        this.scrollVertically = function (focusId, scrollPanelId, direction, margin) {
            try {
                var marginTop = 0;
                if (typeof margin !== "number") {
                    marginTop = parseInt(getComputedStyle(G(focusId), null).getPropertyValue("margin-top")) * 2;//获取文件类的样式属性值
                } else {
                    marginTop = margin;//获取文件类的样式属性值
                }

                if (direction === "up") {
                    G(scrollPanelId).scrollTop = G(scrollPanelId).scrollTop - G(focusId).clientHeight + marginTop;
                } else {
                    G(scrollPanelId).scrollTop = G(scrollPanelId).scrollTop + G(focusId).clientHeight - marginTop;
                }
            } catch (e) {
                console.error(e);
            }
        };

        /**
         * 显示加载框
         * @param msg [string] 显示文本
         * @param second [number] 超时秒数
         * @param timeOutCallback [function] 达到指定或默认超时后，关闭dialog后的回调函数
         */
        this.showWaitingDialog = function (msg, second, timeOutCallback) {
            var loadingImg = LMEPG.App.getAppRootPath() + "/Public/img/hd/Common/bg_waiting_dialog.gif";
            var configOptions = {
                msg: msg,
                delay: second,
                callback: timeOutCallback,
                loadingImg: loadingImg,
                /*// 示范示例：动态创建整个dialog的HTMLElement。不设置有效的HTMLElement，则内部会使用默认实现
                 msgEleId: "id_waiting_dialog_msg", //需要在replacedDefaultHtmlDom有效才会生效
                 replacedDefaultHtmlDom: (function () {
                 var waitingDialogDiv = document.createElement("div");
                 /!*var waitingDialogMsgDiv = document.createElement("div");
                 waitingDialogMsgDiv.id = "id_waiting_dialog_msg";
                 waitingDialogMsgDiv.style.color = "red";
                 waitingDialogDiv.appendChild(waitingDialogMsgDiv);*!/
                 waitingDialogDiv.style.background = 'url("' + loadingImg + '") no-repeat';
                 LMEPG.CssManager.addClass(waitingDialogDiv, "g_waiting_dialog");
                 return waitingDialogDiv;
                 })(),*/
            };
            LMEPG.UI.buildAndShowWaitingDialogBy(configOptions);
        };

        /**
         * 构建并显示加载框
         * @param options [object] 构建配置对象。示例：
         *      <pre>
         *          {
         *              msg: "", //消息文本，默认为空
         *              delay: 30, //显示时长（秒），默认配置30秒
         *              callback: null, //关闭回调函数（function或string函数脚本），默认为空
         *              loadingImg: LMEPG.App.getAppRootPath() + "/Public/img/hd/Common/bg_waiting_dialog.gif", //加载图片地址
         *              msgEleId: "id_waiting_dialog", //显示文本的元素id，默认为空。若自定义另外的div，则需和replacedDefaultHtmlDom里面的显示文本的HTML元素id一致！
         *              replacedDefaultHtmlDom: undefined, //完全自定义的HTMLElement元素整体dom（该根id无需外部设置），不采用默认的构建。若设置该项，则使用之！！
         *          }
         *      </pre>
         */
        this.buildAndShowWaitingDialogBy = function (options) {
            // 构建配置信息
            var config = {
                msg: "", //消息文本，默认为空
                delay: 30, //显示时长（秒），默认配置30秒
                callback: null, //关闭回调函数（function或string函数脚本），默认为空
                loadingImg: LMEPG.App.getAppRootPath() + "/Public/img/hd/Common/bg_waiting_dialog.gif", //加载图片地址
                dialogCss: "g_waiting_dialog", //dialog的css，默认为g_waiting_dialog
                msgEleId: "id_waiting_dialog", //显示文本的元素id，默认为空。若自定义另外的div，则需和replacedDefaultHtmlDom里面的显示文本的HTML元素id一致！
                replacedDefaultHtmlDom: undefined, //完全自定义的HTMLElement元素整体dom（该根id无需外部设置），不采用默认的构建。若设置该项，则使用之！！
            };

            if (Object.prototype.toString.call(options) === "[object Object]") {
                if (typeof options.msg !== "undefined") config.msg = options.msg;
                if (typeof options.delay === "number") config.delay = options.delay;
                if (typeof options.loadingImg === "string" && options.loadingImg !== "") config.loadingImg = options.loadingImg;
                if (typeof options.dialogCss === "string" && options.dialogCss !== "") config.dialogCss = options.dialogCss;
                if (typeof options.callback !== "undefined") config.callback = options.callback;
                if (options.replacedDefaultHtmlDom instanceof HTMLElement) {
                    // 当且仅当replacedDefaultHtmlDom有效提供，才使用msgEleId！
                    if (typeof options.msgEleId === "string" && options.msgEleId !== "") config.msgEleId = options.msgEleId;
                    config.replacedDefaultHtmlDom = options.replacedDefaultHtmlDom;
                }
            }

            if (!LMEPG.UI.showWaitingDialogUI) {
                var toastDiv;
                if (config.replacedDefaultHtmlDom instanceof HTMLElement) {
                    // 使用外部自定义
                    toastDiv = config.replacedDefaultHtmlDom;
                } else {
                    // 内部通用默认构建
                    toastDiv = document.createElement("div");
                    toastDiv.style.background = 'url("' + config.loadingImg + '") no-repeat';
                    LMEPG.CssManager.addClass(toastDiv, config.dialogCss);
                }

                toastDiv.id = "id_waiting_dialog"; //内部统一设定整个dialog的元素id
                document.body.appendChild(toastDiv);
                LMEPG.UI.showWaitingDialogUI = toastDiv;
            } else {
                toastDiv = document.getElementById("id_waiting_dialog");
                toastDiv.style.background = 'url("' + config.loadingImg + '") no-repeat';
                LMEPG.CssManager.addClass(toastDiv, config.dialogCss);
            }

            if (G(config.msgEleId)) G(config.msgEleId).innerHTML = config.msg; // 设置显示文本
            S("id_waiting_dialog"); //内部统一设定整个dialog的元素id

            // 加载该进度框，禁止用户按键响应
            LMEPG.KeyEventManager.setAllowFlag(false);

            if (config.delay > 0) {
                if (LMEPG.UI.showWaitingDialogUITimer) clearTimeout(LMEPG.UI.showWaitingDialogUITimer); // 如果已经执行了setTimeOut,强制停止
                LMEPG.UI.showWaitingDialogUITimer = setTimeout(function () {
                    H("id_waiting_dialog");
                    LMEPG.KeyEventManager.setAllowFlag(true); //关闭进度框，恢复用户按键响应
                    LMEPG.call(config.callback);
                    // LMEPG.UI.showWaitingDialogUI = null; // 适配促订模板等待弹窗
                }, config.delay * 1000);
            }
        };

        /**
         * 取消加载等待框
         */
        this.dismissWaitingDialog = function () {
            if (LMEPG.UI.showWaitingDialogUI) {
                if (LMEPG.UI.showWaitingDialogUITimer) clearTimeout(LMEPG.UI.showWaitingDialogUITimer); // 如果已经执行了setTimeOut,强制停止
                H("id_waiting_dialog");
                LMEPG.KeyEventManager.setAllowFlag(true); //关闭进度框，恢复用户按键响应
                // LMEPG.UI.showWaitingDialogUI = null; // 适配促订模板等待弹窗
            }
        };

        /**
         * 设置角标
         * @param parentDivElement 父容器
         * @param left  距离左边位置
         * @param top   距离顶部位置
         * @param width 角标宽度
         * @param height 角标高度
         * @param isShow 是否显示角标
         * @param id     可选参数：角标的id，主要为了放大时删除之前的角标，设置新角标位置
         * @param zIndex 可选参数：y轴方向 默认9000
         */
        this.setCorner = function (parentDivElement, left, top, width, height, isShow, id, zIndex) {
            var corner = document.createElement("img");

            if (id !== undefined && id !== null && id !== "") {
                corner.setAttribute("id", id);
                var eleCurrCorner = document.getElementById(id);
                if (eleCurrCorner !== undefined && eleCurrCorner !== null) {
                    eleCurrCorner.parentElement.removeChild(eleCurrCorner);
                }
            }

            if (zIndex === undefined || zIndex === null || zIndex === "") {
                zIndex = 9000;
            }

            var cornerImgUrl = LMEPG.App.getAppRootPath() + "/Public/img/Common/spacer.gif";
            if (isShow) {
                cornerImgUrl = LMEPG.App.getAppRootPath() + "/Public/img/Common/corner.png";
            }

            corner.style.position = "absolute";
            corner.style.left = left + "px";
            corner.style.top = top + "px";
            corner.style.zIndex = zIndex;
            corner.style.width = width + "px";
            corner.style.height = height + "px";
            corner.setAttribute("src", cornerImgUrl);
            parentDivElement.appendChild(corner);
        };

        /**
         * 设置角标
         * @param parentDivElement 父容器
         * @param left  距离左边位置
         * @param top   距离顶部位置
         * @param width 角标宽度
         * @param height 角标高度
         * @param isShow 是否显示角标
         * @param showType 显示角标类型
         * @param id     可选参数：角标的id，主要为了放大时删除之前的角标，设置新角标位置
         * @param zIndex 可选参数：y轴方向 默认9000
         */
        this.setCornerMore = function (parentDivElement, left, top, width, height, isShow, showType, id, zIndex) {
            var corner = document.createElement("img");

            if (id !== undefined && id !== null && id !== "") {
                corner.setAttribute("id", id);
                var eleCurrCorner = document.getElementById(id);
                if (eleCurrCorner !== undefined && eleCurrCorner !== null) {
                    eleCurrCorner.parentElement.removeChild(eleCurrCorner);
                }
            }

            if (zIndex === undefined || zIndex === null || zIndex === "") {
                zIndex = 9000;
            }

            var cornerImgUrl = g_appRootPath + "/Public/img/Common/spacer.gif";
            if (isShow) {
                if (showType === 2 || showType === "2") {
                    cornerImgUrl = g_appRootPath + "/Public/img/Common/corner.png";
                } else if (showType === 3 || showType === "3") {
                    cornerImgUrl = g_appRootPath + "/Public/img/Common/corner_pay.png";
                }
            }

            corner.style.position = "absolute";
            corner.style.left = left + "px";
            corner.style.top = top + "px";
            corner.style.zIndex = zIndex;
            corner.style.width = width + "px";
            corner.style.height = height + "px";
            corner.setAttribute("src", cornerImgUrl);
            parentDivElement.appendChild(corner);
        };

        /**
         * 通用对话框，通过show方式进行调用。
         */
        this.commonDialog = {
            MAX_BUTTON_NUM: 2, //最大可支持按钮数目
            buttonIds: [], //存储按钮对象数组
            mainButton: null, //弹窗前临时存储当前业务逻辑页面的焦点按钮
            dialog: null, //弹窗dom元素
            _clickCallBack: LMEPG.emptyFunc, //点击按钮后的回调事件函数
            _isShowing: false, //标记当前是否正在显示弹窗，用于互斥某些交互操作

            /**
             * 显示通用对话框
             * <pre>使用示例：
             *      LMEPG.UI.commonDialog.show(
             *              '您确定要提交吗？',
             *              ['确定', '取消'],
             *              function(btnIndex) {
             *                  alert('点击了第几个按钮：'+btnIndex);
             *                  boolean ret = false;
             *                  if (ret) console.log("对话框不会自动关闭，需要手动调用LMEPG.UI.commondialog.dismiss()");
             *                  else console.log("对话框自动关闭");
             *              },
             *              '弹框后默认焦点的按钮序号（与第2个参数对应）'
             *     );
             * </pre>
             * @param message [string] 显示文本
             * @param buttonText [string|array] 提供显示的按钮文本（最多支持3个）
             * @param onCallback [function] 点击按钮回调，附带1个参数即按键序号，及一个可选返回值boolean，若为无效返回或不提供，则默认关闭。
             *  否则，不会自动关闭，需要用户手动调用LMEPG.UI.commondialog.dismiss();
             * @param requestFocusBtnIndex [number] 指定弹窗dialog后期望落定焦点的button索引号（从0开始！）（可选）
             */
            show: function (message, buttonText, onCallback, reqFocusBtnIndex, hint) {
                if (self.commonDialog._isShowing) {
                    return;
                }

                if (typeof buttonText === "string") buttonText = [buttonText];
                if (!LMEPG.Func.isArray(buttonText)) {
                    // 无效参数
                    console.warn("LMEPG.UI.commonDialog.show()-->提供无效的按钮！");
                    return;
                }

                self.commonDialog.mainButton = LMEPG.BM.getCurrentButton();
                self.commonDialog._clickCallBack = onCallback;

                var platformType = typeof RenderParam === "object" && typeof RenderParam.platformType === "string" ? RenderParam.platformType : "hd";
                var dialogPicDir = LMEPG.App.getAppRootPath() + "/Public/img/" + platformType + "/Dialog";//当前弹窗所用图片目录
                var html = '';

                //增加背景图
                var temp_dialogBgImgUrl = "'" + dialogPicDir + "/bg_dialog.png'";
                html += '<div id="gid_common_dialog" class="g_common_dialog_img_bg" style="background-image: url(' + temp_dialogBgImgUrl + ')">';

                //增加消息提示
                html += '<div id="gid_common_dialog_message" class="g_common_dialog_message_text">' + message + '</div>';

                //增加button容器
                html += '<div class="g_common_button_container">';
                var buttons = [];
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  //目前只支持两个按钮
                    if (i === 0) html += '<div class="g_common_button_border">';
                    else html += '<div class="g_common_button_border g_common_button_interval">';

                    var temp_btnUnselectBgImgUrl = "'" + dialogPicDir + "/btn_unselected.png'";
                    html += '<div id="gid_common_button_' + i + '"' + ' class="g_common_button_text" ' +
                        ' style="background-image: url(' + temp_btnUnselectBgImgUrl + ')">';
                    html += buttonText[i]; //按钮文本内容填充
                    html += '</div>';
                    html += '</div>';

                    var buttonId = "gid_common_button_" + i;
                    buttons.push({
                        id: buttonId,
                        name: "按钮" + i,
                        type: "div",
                        focusable: true,
                        nextFocusLeft: i > 0 ? "gid_common_button_" + (i - 1) : "",
                        nextFocusRight: (i < self.commonDialog.MAX_BUTTON_NUM - 1 && i < buttonText.length - 1) ? "gid_common_button_" + (i + 1) : "",
                        nextFocusUp: "",
                        nextFocusDown: "",
                        backgroundImage: dialogPicDir + "/btn_unselected.png",
                        focusImage: dialogPicDir + "/btn_select.png",
                        click: self.commonDialog.__onClick,
                        beforeMoveChange: "",
                        cIndex: i,
                    });
                    self.commonDialog.buttonIds.push(buttonId);
                }
                if (!!hint == true)
                    html += hint;
                html += '</div>';
                html += '</div>';

                self.commonDialog.dialog = document.createElement("div");  //创建显示控件
                self.commonDialog.dialog.id = "gid_common_dialog";
                self.commonDialog.dialog.innerHTML = html;
                document.body.appendChild(self.commonDialog.dialog);

                LMEPG.BM.addButtons(buttons);

                // 匹配寻找弹出就立即指定默认焦点按钮的序号
                var defaultNeedFocusIndex = typeof reqFocusBtnIndex === "number" ? parseInt(reqFocusBtnIndex) : 0;
                if (buttons.length > 0) {
                    // 再次加强校验！若外部提供不规范，则强制修改顺序指针为就近！
                    if (defaultNeedFocusIndex < 0) defaultNeedFocusIndex = 0;
                    if (defaultNeedFocusIndex >= buttons.length) defaultNeedFocusIndex = buttons.length - 1;
                    var whichBtnId = buttons[defaultNeedFocusIndex] && buttons[defaultNeedFocusIndex].id;
                    if (whichBtnId) LMEPG.BM.requestFocus(whichBtnId);
                }

                // 设置默认按back键关闭对话框操作
                LMEPG.KEM.addKeyEvent("KEY_BACK", self.commonDialog.__onInnerBack);
                self.commonDialog._isShowing = true; //标记为正在显示
            },

            /**
             * 显示通用对话框
             * <pre>使用示例：
             *      LMEPG.UI.commonDialog.show(
             *              '您确定要提交吗？',
             *              ['确定', '取消'],
             *              function(btnIndex) {
             *                  alert('点击了第几个按钮：'+btnIndex);
             *                  boolean ret = false;
             *                  if (ret) console.log("对话框不会自动关闭，需要手动调用LMEPG.UI.commondialog.dismiss()");
             *                  else console.log("对话框自动关闭");
             *              },
             *              '弹框后默认焦点的按钮序号（与第2个参数对应）'
             *     );
             * </pre>
             * @param message [string] 显示文本
             * @param buttonText [string|array] 提供显示的按钮文本（最多支持3个）
             * @param onCallback [function] 点击按钮回调，附带1个参数即按键序号，及一个可选返回值boolean，若为无效返回或不提供，则默认关闭。
             *  否则，不会自动关闭，需要用户手动调用LMEPG.UI.commondialog.dismiss();
             */
            showV1: function (message, buttonText, onCallback, hint) {
                if (self.commonDialog._isShowing) {
                    return;
                }

                if (typeof (buttonText) === "string") buttonText = [buttonText];
                if (!LMEPG.Func.isArray(buttonText) && buttonText.length < 1) {
                    // 参数出错
                    return;
                }

                self.commonDialog.mainButton = LMEPG.BM.getCurrentButton();
                self.commonDialog._clickCallBack = onCallback;

                var platformType = typeof RenderParam === "object" && typeof RenderParam.platformType === "string" ? RenderParam.platformType : "hd";
                var dialogPicDir = LMEPG.App.getAppRootPath() + "/Public/img/" + platformType + "/Home/V10";//当前弹窗所用图片目录
                var html = "";

                // 增加背景图
                html += '<img id="g_common_dialog_img_bg"  class="g_common_dialog_img_bg_v1" alt=""' +
                    ' src="' + dialogPicDir + '/bg_toast.png"/>';

                // 增加消息提示
                html += '<div id="gid_common_dialog_message" class="g_common_dialog_message_text_v1">';
                html += '</div>';

                // 增加button容器
                html += '<div class="g_common_button_container_v1">';
                var buttons = [];
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  // 目前只支持两个按钮
                    if (i === 0) html += '<div class="g_common_button_border">';
                    else html += '<div class="g_common_button_border_v1 g_common_button_interval_v1">';

                    html += '<img id="gid_common_button_' + i + '"' + ' src="' + dialogPicDir + '/bg_key.png" class="g_common_button_img_v1" alt=""/>';
                    html += '<div id="gid_common_button_' + i + '_text"' + ' class="g_common_button_text_v1">';
                    html += buttonText[i]; //按钮文本内容填充
                    html += '</div>';
                    html += '</div>';

                    var buttonId = "gid_common_button_" + i;
                    buttons.push({
                        id: buttonId,
                        name: "通知",
                        type: "img",
                        nextFocusLeft: i > 0 ? "gid_common_button_" + (i - 1) : "",
                        nextFocusRight: (i < self.commonDialog.MAX_BUTTON_NUM - 1 && i < buttonText.length - 1) ? "gid_common_button_" + (i + 1) : "",
                        nextFocusUp: "",
                        nextFocusDown: "",
                        backgroundImage: dialogPicDir + "/bg_key.png",
                        focusImage: dialogPicDir + "/f_key.png",
                        click: self.commonDialog.__onClick,
                        focusChange: "",
                        beforeMoveChange: "",
                        cIndex: i,
                    });
                    self.commonDialog.buttonIds.push(buttonId);
                }
                if (!!hint == true)
                    html += hint;
                html += "</div>";

                self.commonDialog.dialog = document.createElement("div");  //创建显示控件
                self.commonDialog.dialog.id = "gid_common_dialog";
                self.commonDialog.dialog.innerHTML = html;
                LMEPG.CssManager.addClass(self.commonDialog.dialog, "g_common_dialog_v1");
                document.body.appendChild(self.commonDialog.dialog);

                g_common_dialog_img_bg.onload = function () {
                    G("gid_common_dialog_message").innerHTML = message;
                    if (LMEPG.Func.isExist(LMEPG.BM.getButtons()) && LMEPG.BM.getButtons().length > 0) {
                        LMEPG.BM.addButtons(buttons);
                        LMEPG.BM.requestFocus("gid_common_button_0");
                    } else {
                        LMEPG.BM.init("gid_common_button_0", buttons, "", true);
                    }

                    // 设置默认按back键关闭对话框操作
                    LMEPG.KEM.addKeyEvent("KEY_BACK", self.commonDialog.__onInnerBack);
                    self.commonDialog._isShowing = true; //标记为正在显示
                };
            },

            showV2: function (message, buttonText, onCallback, hint) {
                if (self.commonDialog._isShowing) {
                    return;
                }

                if (typeof (buttonText) === "string") buttonText = [buttonText];
                if (!LMEPG.Func.isArray(buttonText) && buttonText.length < 1) {
                    // 参数出错
                    return;
                }

                self.commonDialog.mainButton = LMEPG.BM.getCurrentButton();
                self.commonDialog._clickCallBack = onCallback;

                var platformType = typeof RenderParam === "object" && typeof RenderParam.platformType === "string" ? RenderParam.platformType : "hd";
                var dialogPicDir = LMEPG.App.getAppRootPath() + "/Public/img/" + platformType + "/Home/V20";//当前弹窗所用图片目录
                var html = "";

                // 增加背景图
                html += '<img id="g_common_dialog_img_bg"  class="g_common_dialog_img_bg_v1" alt=""' +
                    ' src="' + dialogPicDir + '/bg_toast.png"/>';

                // 增加消息提示
                html += '<div id="gid_common_dialog_message" class="g_common_dialog_message_text_v1">';
                html += '</div>';

                // 增加button容器
                html += '<div class="g_common_button_container_v1">';
                var buttons = [];
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  // 目前只支持两个按钮
                    if (i === 0) html += '<div class="g_common_button_border">';
                    else html += '<div class="g_common_button_border_v1 g_common_button_interval_v1">';

                    html += '<img id="gid_common_button_' + i + '"' + ' src="' + dialogPicDir + '/bg_key' + i + '.png" class="" alt=""/>';
                    html += '<div id="gid_common_button_' + i + '_text"' + ' class="g_common_button_text_v1">';
                    html += ""; //按钮文本内容填充
                    html += '</div>';
                    html += '</div>';

                    var buttonId = "gid_common_button_" + i;
                    buttons.push({
                        id: buttonId,
                        name: "通知",
                        type: "img",
                        nextFocusLeft: i > 0 ? "gid_common_button_" + (i - 1) : "",
                        nextFocusRight: (i < self.commonDialog.MAX_BUTTON_NUM - 1 && i < buttonText.length - 1) ? "gid_common_button_" + (i + 1) : "",
                        nextFocusUp: "",
                        nextFocusDown: "",
                        backgroundImage: dialogPicDir + "/bg_key" + i + ".png",
                        focusImage: dialogPicDir + "/f_key" + i + ".png",
                        click: self.commonDialog.__onClick,
                        focusChange: "",
                        beforeMoveChange: "",
                        cIndex: i,
                    });
                    self.commonDialog.buttonIds.push(buttonId);
                }
                if (!!hint == true)
                    html += hint;
                html += "</div>";

                self.commonDialog.dialog = document.createElement("div");  //创建显示控件
                self.commonDialog.dialog.id = "gid_common_dialog";
                self.commonDialog.dialog.innerHTML = html;
                LMEPG.CssManager.addClass(self.commonDialog.dialog, "g_common_dialog_v1");
                document.body.appendChild(self.commonDialog.dialog);

                g_common_dialog_img_bg.onload = function () {
                    G("gid_common_dialog_message").innerHTML = message;
                    if (LMEPG.Func.isExist(LMEPG.BM.getButtons()) && LMEPG.BM.getButtons().length > 0) {
                        LMEPG.BM.addButtons(buttons);
                        LMEPG.BM.requestFocus("gid_common_button_0");
                    } else {
                        LMEPG.BM.init("gid_common_button_0", buttons, "", true);
                    }

                    // 设置默认按back键关闭对话框操作
                    LMEPG.KEM.addKeyEvent("KEY_BACK", self.commonDialog.__onInnerBack);
                    self.commonDialog._isShowing = true; //标记为正在显示
                };
            },

            /**
             * 关闭当前对话框并恢复数据状态
             */
            dismiss: function () {
                // 恢复业务逻辑页面按钮操作
                LMEPG.BM.deleteButtons(self.commonDialog.buttonIds);
                if (self.commonDialog.mainButton) LMEPG.BM.requestFocus(self.commonDialog.mainButton.id);

                // 清空弹窗UI
                H("gid_common_dialog");
                self.commonDialog.dialog.innerHTML = "";
                self.commonDialog.buttonIds = [];
                self.commonDialog.mainButton = null;
                self.commonDialog._clickCallBack = LMEPG.emptyFunc;
                self.commonDialog._isShowing = false;

                // 恢复业务逻辑页面的返回事件。必须！！！否则，页面无法正常返回！
                LMEPG.KEM.addKeyEvent("KEY_BACK", "onBack()");
            },

            /**
             * 当前弹窗按钮点击事件
             */
            __onClick: function (btn) {
                var handled = LMEPG.call(self.commonDialog._clickCallBack, [btn.cIndex]);
                if (typeof handled === "undefined" || !handled) {
                    self.commonDialog.dismiss();
                }
            },

            /**
             * 处理当前弹窗中，用户按back键，则关闭当前弹窗并恢复原先焦点行为。
             */
            __onInnerBack: function () {
                var handled = LMEPG.call(self.commonDialog._clickCallBack, [-1]);
                if (typeof handled === "undefined" || !handled) {
                    self.commonDialog.dismiss();
                }
            },
        }; //#End of LMEPG.UI$commonDialog

        /**
         * 通用输入对话框
         * 通过show方式进行调用，
         * 列入：show("未检测到摄像头，请插入摄像头后问医，或者留下您的联系方式，通过电话问医。", ['是', '否'], function(id){})
         */
        this.commonEditDialog = {
            MAX_BUTTON_NUM: 2, //最大可支持按钮数目
            buttonIds: [], //存储按钮对象数组
            mainButton: null, //弹窗前临时存储当前业务逻辑页面的焦点按钮
            dialog: null, //弹窗dom元素
            _clickCallBack: LMEPG.emptyFunc, //点击按钮后的回调事件函数
            _isShowing: false, //标记当前是否正在显示弹窗，用于互斥某些交互操作

            /**
             * 显示通用输入对话框。
             *
             * <pre>使用示例：
             *      LMEPG.UI.commonEditDialog(
             *              '未检测到摄像头，请插入摄像头后问医，或者留下您的联系方式，通过电话问医。',
             *              ['是', '否'],
             *              function(btnIndex, inputValue) {},
             *              ['输入label提示：', '默认输入框文本', '输入框hint文本', '限制类型[tel|text|password|...]']
             *              450,
             *              150,
             *              true
             *     );
             * </pre>
             */
            show: function (message, buttonText, onCallback, extraInputMessages, keyPadX, keyPadY, isShowInput) {
                if (self.commonEditDialog._isShowing) {
                    return;
                }

                if (typeof (buttonText) === "string") buttonText = [buttonText];
                if (!LMEPG.Func.isArray(buttonText)) {
                    // 参数出错
                    return;
                }

                self.commonEditDialog.mainButton = LMEPG.BM.getCurrentButton();
                self.commonEditDialog._clickCallBack = onCallback;

                //var platformType = typeof RenderParam === "object" && typeof RenderParam.platformType === "string" ? RenderParam.platformType : "hd";
                var dialogPicDir = LMEPG.App.getAppRootPath() + "/Public/img/Common/Input/V1";//当前弹窗所用图片目录

                // 解析提供的默认输入框文本信息等：文本框提示、文本框默认内容、文本框占位内容
                var inputLabel = "";
                var inputDefault = "";
                var inputHint = "";
                var inputType = "text";
                if (LMEPG.Func.isArray(extraInputMessages)) {
                    if (extraInputMessages.length > 0) inputLabel = extraInputMessages[0];
                    if (extraInputMessages.length > 1) inputDefault = extraInputMessages[1];
                    if (extraInputMessages.length > 2) inputHint = extraInputMessages[2];
                    if (extraInputMessages.length > 3) inputType = extraInputMessages[3];
                }

                var html = '';
                html += '<img id="gid_bg_common_edit_dialog" src="' + dialogPicDir + '/bg.png" class="g_common_input_dialog_img_bg_v1" alt=""/>';
                html += '<div id="gid_common_edit_dialog_message" class="g_common_input_dialog_message_text_v1">' + "请输入手机号" + '</div>';
                html += "<div class='g_common_input_dialog_tel_v1'>手机号：</div>";
                html += '<div  id="gid_common_edit_dialog_input" class="g_common_input_dialog_message_v1">' + inputDefault + '</div>';
                html += '<div class="g_common_input_btn_v1">';

                var buttons = [];
                buttons.push({
                    id: "gid_common_edit_dialog_input",
                    name: "输入模式",
                    type: "div",
                    focusable: true,
                    backgroundImage: LMEPG.App.getAppRootPath() + "/Public/img/hd/DataArchiving/V10/bg_text.png",
                    focusImage: LMEPG.App.getAppRootPath() + "/Public/img/hd/DataArchiving/V10/f_text.png",
                    nextFocusDown: "gid_common_edit_dialog_button_0",
                    focusChange: LMEPG.emptyFunc(),
                    click: "LMEPG.UI.keyboard.show(" + (keyPadX ? keyPadX : 450) + ", " + (keyPadY ? keyPadY : 150) + ", 'gid_common_edit_dialog_input', 'gid_common_edit_dialog_input', true)",
                });
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  //目前只支持两个按钮
                    if (i === 0) html += '<div class="g_common_input_btn_border_v1">';
                    else html += '<div class="g_common_input_btn_border_v1 g_common_input_btn_interval_v1">';

                    html += '<img id="gid_common_edit_dialog_button_' + i + '"' + ' src="' + dialogPicDir + '/f_r_btn.png" class="g_common_input_btn_img_v1" alt=""/>';
                    html += '<div id="gid_common_edit_dialog_button_' + i + '_text"' + ' class="g_common_input_text_v1">';
                    html += buttonText[i]; //按钮文本内容填充
                    html += '</div>';
                    html += '</div>';

                    var buttonId = "gid_common_edit_dialog_button_" + i;
                    buttons.push({
                        id: buttonId,
                        name: "按钮" + i,
                        type: "img",
                        nextFocusLeft: i > 0 ? "gid_common_edit_dialog_button_" + (i - 1) : "",
                        nextFocusRight: (i < self.commonEditDialog.MAX_BUTTON_NUM - 1 && i < buttonText.length - 1) ? "gid_common_edit_dialog_button_" + (i + 1) : "",
                        nextFocusUp: "gid_common_edit_dialog_input",
                        backgroundImage: dialogPicDir + "/f_r_btn.png",
                        focusImage: dialogPicDir + "/f_btn.png",
                        click: self.commonEditDialog.__onClick,
                        beforeMoveChange: self.commonEditDialog.__onBeforeMoveChange,
                        focusable: true,
                        cIndex: i,
                    });
                    self.commonEditDialog.buttonIds.push(buttonId);
                }
                html += "</div>";

                self.commonEditDialog.dialog = document.createElement("div");  //创建显示控件
                self.commonEditDialog.dialog.id = "gid_common_edit_dialog";
                self.commonEditDialog.dialog.innerHTML = html;
                LMEPG.CssManager.addClass(self.commonEditDialog.dialog, "g_common_input_dialog_v1");
                document.body.appendChild(self.commonEditDialog.dialog);

                G("gid_common_edit_dialog_message").innerHTML = message;
                G("gid_common_edit_dialog_input").style.display = "inline";

                // 加载该进度框，禁止用户按键响应
                LMEPG.KEM.setAllowFlag(false);
                setTimeout(function () {
                    LMEPG.KEM.setAllowFlag(true); //恢复用户按键响应
                    LMEPG.KEM.addKeyEvent("KEY_BACK", self.commonEditDialog.__onInnerBack);
                    LMEPG.BM.addButtons(buttons);
                    if (isShowInput) {
                        LMEPG.BM.requestFocus("gid_common_edit_dialog_input");
                        LMEPG.BM.performClick();
                    } else if (buttonText.length > 0) {
                        LMEPG.BM.requestFocus(LMEPG.Func.isEmpty(inputDefault) ? "gid_common_edit_dialog_input" : "gid_common_edit_dialog_button_0");
                    }
                }, 50);
            },

            showV2: function (message, buttonText, onCallback, extraInputMessages, keyPadX, keyPadY) {
                if (self.commonEditDialog._isShowing) {
                    return;
                }

                if (typeof (buttonText) === "string") buttonText = [buttonText];
                if (!LMEPG.Func.isArray(buttonText)) {
                    // 参数出错
                    return;
                }

                self.commonEditDialog.mainButton = LMEPG.BM.getCurrentButton();
                self.commonEditDialog._clickCallBack = onCallback;

                //var platformType = typeof RenderParam === "object" && typeof RenderParam.platformType === "string" ? RenderParam.platformType : "hd";
                var dialogPicDir = LMEPG.App.getAppRootPath() + "/Public/img/hd/Home/V20";
                ;//当前弹窗所用图片目录

                // 解析提供的默认输入框文本信息等：文本框提示、文本框默认内容、文本框占位内容
                var inputLabel = "";
                var inputDefault = "";
                var inputHint = "";
                var inputType = "text";
                if (LMEPG.Func.isArray(extraInputMessages)) {
                    if (extraInputMessages.length > 0) inputLabel = extraInputMessages[0];
                    if (extraInputMessages.length > 1) inputDefault = extraInputMessages[1];
                    if (extraInputMessages.length > 2) inputHint = extraInputMessages[2];
                    if (extraInputMessages.length > 3) inputType = extraInputMessages[3];
                }

                var html = '';
                html += '<img id="gid_bg_common_edit_dialog" src="' + dialogPicDir + '/bg.png" class="g_common_input_dialog_img_bg_v1" alt=""/>';
                html += '<div id="gid_common_edit_dialog_message" class="g_common_input_dialog_message_text_v1">' + "请输入手机号" + '</div>';
                html += "<div class='g_common_input_dialog_tel_v1'>手机号：</div>";
                html += '<div  id="gid_common_edit_dialog_input" class="g_common_input_dialog_message_v1" style="background-repeat: no-repeat">' + inputDefault + '</div>';
                html += '<div class="g_common_input_btn_v1">';

                var buttons = [];
                buttons.push({
                    id: "gid_common_edit_dialog_input",
                    name: "输入模式",
                    type: "div",
                    focusable: true,
                    backgroundImage: LMEPG.App.getAppRootPath() + "/Public/img/hd/DataArchiving/V10/bg_text.png",
                    focusImage: LMEPG.App.getAppRootPath() + "/Public/img/hd/Home/V20/f_text.png",
                    nextFocusDown: "gid_common_edit_dialog_button_0",
                    focusChange: LMEPG.emptyFunc(),
                    click: "LMEPG.UI.keyboard.show(" + (keyPadX ? keyPadX : 450) + ", " + (keyPadY ? keyPadY : 150) + ", 'gid_common_edit_dialog_input', 'gid_common_edit_dialog_input', true)",
                });
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  //目前只支持两个按钮
                    if (i === 0) html += '<div class="g_common_input_btn_border_v1">';
                    else html += '<div class="g_common_input_btn_border_v1 g_common_input_btn_interval_v1">';

                    html += '<img id="gid_common_edit_dialog_button_' + i + '"' + ' src="' + dialogPicDir + '/bg_key' + i + '.png" class="" alt=""/>';
                    html += '<div id="gid_common_edit_dialog_button_' + i + '_text"' + ' class="g_common_input_text_v1">';
                    html += ""; //按钮文本内容填充
                    html += '</div>';
                    html += '</div>';

                    var buttonId = "gid_common_edit_dialog_button_" + i;
                    buttons.push({
                        id: buttonId,
                        name: "按钮" + i,
                        type: "img",
                        nextFocusLeft: i > 0 ? "gid_common_edit_dialog_button_" + (i - 1) : "",
                        nextFocusRight: (i < self.commonEditDialog.MAX_BUTTON_NUM - 1 && i < buttonText.length - 1) ? "gid_common_edit_dialog_button_" + (i + 1) : "",
                        nextFocusUp: "gid_common_edit_dialog_input",
                        backgroundImage: dialogPicDir + "/bg_key" + i + ".png",
                        focusImage: dialogPicDir + "/f_key" + i + ".png",
                        click: self.commonEditDialog.__onClick,
                        beforeMoveChange: self.commonEditDialog.__onBeforeMoveChange,
                        focusable: true,
                        cIndex: i,
                    });
                    self.commonEditDialog.buttonIds.push(buttonId);
                }
                html += "</div>";

                self.commonEditDialog.dialog = document.createElement("div");  //创建显示控件
                self.commonEditDialog.dialog.id = "gid_common_edit_dialog";
                self.commonEditDialog.dialog.innerHTML = html;
                LMEPG.CssManager.addClass(self.commonEditDialog.dialog, "g_common_input_dialog_v1");
                document.body.appendChild(self.commonEditDialog.dialog);

                G("gid_common_edit_dialog_message").innerHTML = message;
                G("gid_common_edit_dialog_input").style.display = "inline";

                // 加载该进度框，禁止用户按键响应
                LMEPG.KEM.setAllowFlag(false);
                setTimeout(function () {
                    LMEPG.KEM.setAllowFlag(true); //恢复用户按键响应
                    LMEPG.KEM.addKeyEvent("KEY_BACK", self.commonEditDialog.__onInnerBack);
                    LMEPG.BM.addButtons(buttons);
                    if (buttonText.length > 0) {
                        LMEPG.BM.requestFocus(LMEPG.Func.isEmpty(inputDefault) ? "gid_common_edit_dialog_input" : "gid_common_edit_dialog_button_0");
                    }
                }, 50);
            },

            // 按钮焦点移动事件
            __onBeforeMoveChange: function (dir, btn) {
                if (btn.id !== "gid_common_edit_dialog_input") {
                    // 修复问题：当从“按钮1”右移到“按钮2”，<input/>标签会自动显示光标！
                    if ((dir === "left" && !LMEPG.Func.isEmpty(btn.nextFocusLeft))
                        || (dir === "right" && !LMEPG.Func.isEmpty(btn.nextFocusRight))) {
                        var domInput = G("gid_common_edit_dialog_input");
                        domInput.disabled = true;
                        domInput.blur();
                    }
                }
            },

            onInputContentChanged: function (inputDom) {
                LMEPG.UI.Style.input_onContentChanged(inputDom, function (errorCode) {
                    switch (errorCode) {
                        case LMEPG.UI.Style.ErrorCode.NOT_NUMBER:
                            LMEPG.UI.showToast("请输入数字：0-9");
                            break;
                        case LMEPG.UI.Style.ErrorCode.EXCEED_TEL_COUNT:
                            LMEPG.UI.showToast("手机号长度限制11位");
                            break;
                    }
                });
            },

            /**
             * 关闭当前对话框并恢复数据状态
             */
            dismiss: function () {
                // 恢复业务逻辑页面按钮操作
                LMEPG.BM.deleteButtons(self.commonEditDialog.buttonIds);
                if (self.commonEditDialog.mainButton) LMEPG.BM.requestFocus(self.commonEditDialog.mainButton.id);

                // 清空弹窗UI
                H("gid_common_edit_dialog");
                self.commonEditDialog.dialog.innerHTML = "";
                self.commonEditDialog.mainButton = null;
                self.commonEditDialog._clickCallBack = LMEPG.emptyFunc;
                self.commonEditDialog._isShowing = false;
                document.body.removeChild(self.commonEditDialog.dialog); //从dom树清除干净

                // 恢复业务逻辑页面的返回事件。必须！！！否则，页面无法正常返回！
                LMEPG.KEM.addKeyEvent("KEY_BACK", "onBack()");
            },

            /**
             * 当前弹窗按钮点击事件
             */
            __onClick: function (btn) {
                var inputValue = G('gid_common_edit_dialog_input').innerHTML;
                var handled = LMEPG.call(self.commonEditDialog._clickCallBack, [btn.cIndex, inputValue, btn]);
                if (typeof handled === "undefined" || !handled) {
                    self.commonEditDialog.dismiss();
                }
            },

            /**
             * 处理当前弹窗中，用户按back键，则关闭当前弹窗并恢复原先焦点行为。
             */
            __onInnerBack: function () {
                var handled = LMEPG.call(self.commonEditDialog._clickCallBack, [-1]);
                if (typeof handled === "undefined" || !handled) {
                    self.commonEditDialog.dismiss();
                }
            },
        }; // #End of LMEPG.UI$commonEditDialog

        /**
         * 屏幕日志面板跟踪
         * @author Songhui
         * @date 2020-1-2 17:10:32
         */
        this.logPanel = {
            /**
             * 当前页面debug信息打印查看。
             * <pre style='color:yellow;'>
             *     使用示例：
             *          LMEPG.UI.logPanel.log("这是一条log信息！");
             *          LMEPG.UI.logPanel.log("这是一条log信息！（直接替换之前已显示信息）", false);
             *          LMEPG.UI.logPanel.log("这是一条log信息！（追加在已显示信息后，且该行自定义头指示器☞）", true, "☞");
             *          LMEPG.UI.logPanel.log("这是一条log信息！（追加在已显示信息后，且该行自定义头指示器-->，且白色字体）", true, "-->", "#FFFFFF");
             *
             *     建议直接使用：
             *          LMEPG.UI.logPanel.i("这是一条log信息！");
             *          LMEPG.UI.logPanel.i("这是一条log信息！（追加在已显示信息后，且该行自定义头指示器☞）", "☞");
             *          LMEPG.UI.logPanel.i("这是一条log信息！（直接替换之前已显示信息，且该行自定义头指示器-->）", "-->", true);
             *
             * </pre>
             * @param msg [string] 打印当前行信息。
             * @param appendMode [boolean] 是否追加模式（boolean：true或者不提供-追加，false-覆盖）
             * @param lineIndicator [string] 行指示器，用于醒目显示当前行。例如：“-->”“==>”
             * @param lineColor [string|color] 行内容，用于醒目显示当前行。例如：“#FFFFFF”
             */
            show: function (msg, appendMode, lineIndicator, lineColor) {
                // 数据未空时，不产生任何效果
                if (msg === undefined || msg === '') return;
                if (!LMEPG.UI.debugUI) {
                    var debugDiv = document.createElement("div");  //创建显示控件
                    debugDiv.id = "id_debug";
                    LMEPG.CssManager.addClass(debugDiv, "g_debug");
                    document.body.appendChild(debugDiv);
                    LMEPG.UI.debugUI = debugDiv;
                }

                // 默认设置校验
                lineIndicator = LMEPG.Func.isEmpty(lineIndicator) ? "->" : lineIndicator;
                lineColor = LMEPG.Func.isEmpty(lineColor) ? "#ff0000" : lineColor;
                appendMode = typeof appendMode !== 'boolean' ? true : appendMode;

                var domDebug = G("id_debug");
                var newLineCss = "color: " + lineColor;

                if (appendMode) {
                    var history = domDebug.innerHTML ? domDebug.innerHTML + "<br/>" : "";
                    var allLines = history;
                    allLines += '<pre class="g_debug_pre"><span style="' + newLineCss + '">' + (lineIndicator + ' ' + msg) + '</span></pre>';
                    domDebug.innerHTML = allLines;
                } else {
                    var newLine = '<pre class="g_debug_pre"><span style="' + newLineCss + '">' + (lineIndicator + ' ' + msg) + '</span></pre>';
                    domDebug.innerHTML = newLine;
                }
                domDebug.scrollTop = domDebug.scrollHeight;
                Show("id_debug");
            },

            /**
             * 关闭显示
             */
            dismiss: function () {
                Hide("id_debug");
            },

            v: function (msg, lineIndicator, appendMode) {
                self.logPanel.show(msg, appendMode, lineIndicator, "#BBBBBB")
            },
            d: function (msg, lineIndicator, appendMode) {
                self.logPanel.show(msg, appendMode, lineIndicator, "#0070BB")
            },
            i: function (msg, lineIndicator, appendMode) {
                self.logPanel.show(msg, appendMode, lineIndicator, "#48BB31")
            },
            w: function (msg, lineIndicator, appendMode) {
                self.logPanel.show(msg, appendMode, lineIndicator, "#BBBB23")
            },
            e: function (msg, lineIndicator, appendMode) {
                self.logPanel.show(msg, appendMode, lineIndicator, "#FF0006")
            },
            a: function (msg, lineIndicator, appendMode) {
                self.logPanel.show(msg, appendMode, lineIndicator, "#8F0005")
            },
        }; // #End of LMEPG.UI$logPanel

        /**
         * 通用UI效果设置
         * @author Songhui 2019-10-16
         */
        this.Style = {
            /**
             * <input>标签：设置光标位置并捕获焦点
             *
             * @param inputDom <input>标签dom元素
             * @param pos 移动光标的位置，number整数
             */
            input_moveCursorTo: function (inputDom, pos) {
                if (inputDom.setSelectionRange) {
                    inputDom.focus();
                    inputDom.setSelectionRange(pos, pos);
                } else if (inputDom.createTextRange) {
                    inputDom.focus();
                    var range = inputDom.createTextRange();
                    range.collapse(true);
                    range.moveEnd("character", pos);
                    range.moveStart("character", pos);
                    range.select();
                } else {
                    inputDom.focus();
                }
                inputDom.scrollLeft = inputDom.scrollWidth;
            },

            /**
             * <input>标签：获取光标位置
             *
             * @param inputDom <input>标签dom元素
             * @return {number} 返回光标位置，number类型数字
             */
            input_getCursorPosition: function (inputDom) {
                var pos = 0;
                if (document.selection) {// IE Support
                    inputDom.focus();
                    var range = document.selection.createRange();
                    range.moveStart("character", -inputDom.value.length);
                    pos = range.text.length;
                } else if (inputDom.selectionStart || inputDom.selectionStart == 0) { // Firefox support
                    pos = inputDom.selectionStart;
                }
                return pos;
            },

            /**
             * <input>标签：输入内容改变时，动态检测
             *
             * @param inputDom <input>标签dom元素
             * @param warningCallback 通过添加不同策略校验内容，若非法内容，则进行警告通知回调，交给上一层自定义使用何种UI形式提示。
             */
            input_onContentChanged: function (inputDom, warningCallback) {
                var value = inputDom.value;//勿删必需：当前<input>内容
                var cursorPos = LMEPG.UI.Style.input_getCursorPosition(inputDom);//勿删必需：当前光标位置
                var charAheadOfCursorPos = cursorPos - 1; //勿删必需：光标前紧相邻的字符位置
                var charAheadOfCursor = value.substr(charAheadOfCursorPos, 1); //勿删必需：光标前紧相邻的字符

                //方法名及参数太长了，用eval来处理：
                var funcP1 = "LMEPG.UI.Style.Strategy.input_onContentChanged_";
                var funcP2 = "(inputDom, value, cursorPos, charAheadOfCursorPos, charAheadOfCursor, warningCallback);";

                // 以下 input 类型是 HTML5 中的新类型：color、date、datetime、datetime-local、month、week、time、email、number、range、search、tel 和 url。
                // 为了兼容大多数浏览器且满足需要判断，手动加入一个自定义属性"cType"来过滤判断输入内容！
                var cType = inputDom.getAttribute("cType");
                var domType = inputDom.type;
                if (typeof cType === "string" && cType !== "") {
                    domType = cType;
                }

                switch (domType) {
                    // 电话号码类型
                    case "tel":
                        eval(funcP1 + "tel" + funcP2);
                        break;
                    // 数字类型
                    case "number":
                        eval(funcP1 + "number" + funcP2);
                        break;
                    // 其它类型
                    default:
                        break;
                }
            },

            /**
             * 实时校验<input>标签内容的错误码
             */
            ErrorCode: {
                NOT_NUMBER: -1,             //非数字0-9
                EXCEED_TEL_COUNT: -2,       //超过手机号限制长度11位
            },

            Strategy: {
                /**
                 * 验证<input>类型为手机号码类型"tel"的校验规则。
                 *
                 * @param inputDom <input>标签dom元素
                 * @param value input当前值
                 * @param cursorPos 当前光标所有位置
                 * @param charAheadOfCursorPos 当前光标前一个位置
                 * @param charAheadOfCursor 当前渔光标前一个位置对应的字符
                 * @param warningCallback 校验失败回调，以错误码{@link LMEPG#UI#Style#ErrorCode}为参数回调，例如：warningCallback(errorCode)
                 */
                input_onContentChanged_tel: function (inputDom, value, cursorPos, charAheadOfCursorPos, charAheadOfCursor, warningCallback) {
                    var isNumber = /^[0-9]*$/.test(charAheadOfCursor);
                    var isExceedLength = value.length > 11;
                    if (!isNumber || isExceedLength) {
                        var errorCode = isExceedLength ? LMEPG.UI.Style.ErrorCode.EXCEED_TEL_COUNT : LMEPG.UI.Style.ErrorCode.NOT_NUMBER;
                        var strPart1 = value.substring(0, charAheadOfCursorPos);
                        var strPart2 = value.substring(charAheadOfCursorPos + 1);

                        inputDom.value = strPart1 + strPart2; //删除不合法的字符
                        LMEPG.UI.Style.input_moveCursorTo(inputDom, cursorPos - 1);//光标前移

                        // 回调通知应用层警告文字
                        LMEPG.call(warningCallback, [errorCode]);
                    }
                },

                /**
                 * 验证<input>类型为手机号码类型"tel"的校验规则。
                 *
                 * @param inputDom <input>标签dom元素
                 * @param value input当前值
                 * @param cursorPos 当前光标所有位置
                 * @param charAheadOfCursorPos 当前光标前一个位置
                 * @param charAheadOfCursor 当前渔光标前一个位置对应的字符
                 * @param warningCallback 校验失败回调，以提示文本为参数回调，例如：warningCallback(waringMsg)
                 */
                input_onContentChanged_number: function (inputDom, value, cursorPos, charAheadOfCursorPos, charAheadOfCursor, warningCallback) {
                    var isNumber = /^[0-9]*$/.test(charAheadOfCursor);
                    if (!isNumber) {
                        var errorCode = LMEPG.UI.Style.ErrorCode.NOT_NUMBER;
                        var strPart1 = value.substring(0, charAheadOfCursorPos);
                        var strPart2 = value.substring(charAheadOfCursorPos + 1);

                        inputDom.value = strPart1 + strPart2; //删除不合法的字符
                        LMEPG.UI.Style.input_moveCursorTo(inputDom, cursorPos - 1);//光标前移

                        // 回调通知应用层警告文字
                        LMEPG.call(warningCallback, [errorCode]);
                    }
                },

            }
        }; // #End of LMEPG.UI$Style

        /**
         * 滚动字幕方法
         */
        this.Marquee = {
            /**
             * 将div里面的某段静态文字变成滚动字幕。
             * <pre>
             *     调用示例-1：//常用，向左循环滚动，可只传递2或3/4个参数
             *          LMEPG.UI.Marquee.start(yourScrollTextDomId, 28); //使用默认滚动速度和默认延时
             *          LMEPG.UI.Marquee.start(yourScrollTextDomId, 28, 5); //仅设置滚动速度为5
             *          LMEPG.UI.Marquee.start(yourScrollTextDomId, 28, 5, 50);//设置滚动速度为5和延时50
             *     调用示例-2：//不常用，根据具体需求全部传递
             *          LMEPG.UI.Marquee.start(yourScrollTextDomId, 28, 5, 50, "left", "scroll");
             * </pre>
             * @param id [string] （必选）滚动字幕显示的控件（元素）id。常见为div。
             * @param maxLength [number] （必选）达到滚动条件的最长文字个数，这里忽略英文、数字和中文之间的差别，统一按个数来算。建议设置，不传默认为7。
             * @param scrollAmount [number] （可选）时间（决定滚动速度）。建议设置，不传则默认为5。
             * @param scrollDelay [number] （可选）延时。建议设置，不传则默认为50。
             * @param direction [string] （可选）方向。不传，默认left。可选值：[left(左) | right(右) | up(上) | down(下) ]
             * @param behavior [string] （可选）滚动方式。不会，默认scroll。可选值：[alternate(左右来回滚动) | scroll(循环滚动) | slide(只滚动一次)]
             */
            start: function (id, maxLength, scrollAmount, scrollDelay, direction, behavior) {
                maxLength = maxLength || 7;
                id = id || LMEPG.BM.getCurrentButton().id + "_text";
                scrollAmount = scrollAmount || 5;
                scrollDelay = scrollDelay || 50;
                direction = direction || "left";
                behavior = behavior || "scroll";

                if (!LMEPG.UI.Marquee.rollId) {
                    var scrollElement = G(id);
                    if (!scrollElement) {
                        // 参数无效
                        return;
                    }

                    var html = LMEPG.Func.string.trim(scrollElement.innerHTML);
                    if (!LMEPG.Func.isEmpty(html) && !LMEPG.Func.isEmpty(maxLength) && html.length > maxLength) {
                        LMEPG.UI.Marquee.rollId = id;
                        LMEPG.UI.Marquee.innerHTML = html;
                        scrollElement.innerHTML = '<marquee ' +
                            ' id="' + id + '_marquee' + '"' +
                            ' behavior="' + behavior + '"' +
                            ' direction="' + direction + '"' +
                            ' scrollamount="' + scrollAmount + '"' +
                            ' scrolldelay="' + scrollDelay + '">' + html +
                            '</marquee>';
                    }
                }
            },
            /**
             * 停止滚动字幕
             */
            stop: function () {
                if (LMEPG.UI.Marquee.rollId) {
                    if (G(LMEPG.UI.Marquee.rollId)) {
                        G(LMEPG.UI.Marquee.rollId).innerHTML = LMEPG.UI.Marquee.innerHTML;
                    }
                    LMEPG.UI.Marquee.rollId = undefined;
                }
            }
        }; // #End of LMEEPG.UI$Marquee

        /**
         * 输入键盘。
         * <pre>
         *     调用示例：
         *          // 1. 添加关闭键盘后，回调给上层的处理事件！不传，则默认关闭且回归弹键盘前的焦点元素
         *          LMEPG.UI.keyboard.addCloseCallBack(function);
         *          // 2. 设置默认的hintText！不传，则默认取当前input_element元素的当前值！
         *          LMEPG.UI.keyboard.setHintText(hintText);
         *          // 3. 弹窗显示
         *          LMEPG.UI.keyboard.show(
         *              100, //左上角X坐标像素（即left）。必须！
         *              200, //左上角Y坐标像素（即top）。必须！
         *              'id_input_tel_div', //文本输入框元素id。一般为div，必须有效传递！
         *              'id_requestFocusId_after_close_keyboard' //默认关闭键盘后指定焦点显示在页面元素id。可选，不传默认为上一页面焦点按钮！
         *          );
         * </pre>
         * @author Songhui 2019-10-16
         */
        this.keyboard = {
            __keyValList: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "back", "0", "delete"], //键盘值
            __inputElementId: "", //文本输入框元素id。一般为div，必须有效传递！
            __inputElementDom: "", //文本输入框元素id对应的HTMLElement对象，内部获取使用！
            __hintText: "请输入电话号码", //文本输入框默认值，不传默认空undefined！注意，若外部提供为空字符串""，亦认为有效！
            __tipsText: "", //文本输入框默认值，不传默认空undefined！注意，若外部提供为空字符串""，亦认为有效！
            __tipsTextColor: "", //文本输入框提示文案颜色默认值，不传默认空undefined！注意，若外部提供为空字符串""，亦认为有效！
            __inputTextColor: "", //文本输入框正常输入文案颜色默认值，不传默认空undefined！注意，若外部提供为空字符串""，亦认为有效！
            __focusEleIdAfterClose: "", //默认关闭键盘后指定焦点显示在页面元素id。可选，不传默认为上一页面焦点按钮！
            __closeCallback: null, //用户关闭键盘后，需要回调的接口方法。可选，默认无。
            __keysPathDir: LMEPG.App.getAppRootPath() + "/Public/img/hd/KeyBoard", // 键值图片目录，只计算一次，避免在forEach里声明以减小不必要消耗！
            __lengthLimit: false,// 默认关闭，开起后电话号码只能输入11位！
            __firstKey: "",//第一次加载的渲染值
            __isOpen: false,//是否打开过键盘;

            //带英文键盘
            __EnKeysPathDir: LMEPG.App.getAppRootPath() + "/Public/img/hd/KeyBoard/EnKey",
            __EnInputEle: null,
            __keyHasOpen: false,
            __placeholder: '',
            __shouldShowPlaceholder: true,
            __keyEnValue: {
                key_2: {up: '2', left: 'A', enter: 'B', right: 'C', down: ''},
                key_3: {up: '3', left: 'D', enter: 'E', right: 'F', down: ''},
                key_4: {up: '4', left: 'G', enter: 'H', right: 'I', down: ''},
                key_5: {up: '5', left: 'J', enter: 'K', right: 'L', down: ''},
                key_6: {up: '6', left: 'M', enter: 'N', right: 'O', down: ''},
                key_7: {up: '7', left: 'P', enter: 'Q', right: 'R', down: 'S'},
                key_8: {up: '8', left: 'T', enter: 'U', right: 'V', down: ''},
                key_9: {up: '9', left: 'W', enter: 'X', right: 'Y', down: 'Z'},

            },
            __backId: '',
            __maxLength: 11,
            __maxInputLength: -1,
            __maxInputTips: '',
            __textIsNull: '',
            __openID: [],

            /**
             * 输入键盘弹出。
             * <pre>
             *     调用示例：
             *          LMEPG.UI.keyboard.show(
             *              100, //左上角X坐标像素（即left）。必须！
             *              200, //左上角Y坐标像素（即top）。必须！
             *              'id_input_tel_div', //文本输入框元素id（一般为div）。必须！
             *              'id_requestFocusId_after_close_keyboard' //默认关闭键盘后指定焦点显示在页面元素id。可选，不传默认为上一页面焦点按钮！
             *          );
             * </pre>
             * @param y [number] 左上角Y坐标像素（即top）。必须！
             * @param x [number] 左上角X坐标像素（即left）。必须！
             * @param inputElementId [string] （必选）文本输入框元素id（一般为div）。
             * @param lengthLimit [int] （可选）限制文本输入长度。
             * @param focusEleIdAfterCloseKeyboard [string|undefined] （可选）
             */
            show: function (x, y, inputElementId, lengthLimit, focusEleIdAfterCloseKeyboard) {
                this.__firstKey = G(inputElementId).innerHTML;
                if (typeof focusEleIdAfterCloseKeyboard == "undefined" || focusEleIdAfterCloseKeyboard) {
                    if (lengthLimit && typeof lengthLimit == 'string') {
                        focusEleIdAfterCloseKeyboard = lengthLimit;
                    }
                }

                self.keyboard.__initParamsBeforeShow(inputElementId, lengthLimit, focusEleIdAfterCloseKeyboard);

                if (G("gid_keyboard_container")) {
                    Show("gid_keyboard_container");
                    LMEPG.BM.requestFocus("key-1");
                } else {
                    self.keyboard.__createRenderUI(x, y);
                    self.keyboard.__initButtons();
                    self.keyboard.__checkInitVal();
                    LMEPG.BM.requestFocus("key-1");
                }

                LMEPG.KeyEventManager.addKeyEvent(
                    {
                        KEY_0: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "0", "id": "key-11"})',
                        KEY_1: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "1", "id": "key-1"})',
                        KEY_2: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "2", "id": "key-2"})',
                        KEY_3: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "3", "id": "key-3"})',
                        KEY_4: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "4", "id": "key-4"})',
                        KEY_5: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "5", "id": "key-5"})',
                        KEY_6: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "6", "id": "key-6"})',
                        KEY_7: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "7", "id": "key-7"})',
                        KEY_8: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "8", "id": "key-8"})',
                        KEY_9: 'LMEPG.UI.keyboard.onKeyboardItemClicked({"keyVal": "9", "id": "key-9"})',
                        KEY_BACK: LMEPG.UI.keyboard.dismiss, //临时覆写接管新的back事件，关闭后需还原
                        KEY_BACK_640: LMEPG.UI.keyboard.dismiss //临时覆写接管新的back事件，关闭后需还原
                    });


                if(G('input-cursor') && G('input-cursor').style.display === 'none' && !LMEPG.UI.keyboard.cursorAnimationTimer){
                    G('input-cursor').style.display = 'inline-block'
                    LMEPG.UI.keyboard.beganCursorAnimation()
                }
            },

            // 初始化键盘按钮
            __initButtons: function () {
                var keysButtons = [];
                var keysCount = self.keyboard.__keyValList.length;
                self.keyboard.__keyValList.forEach(function (item, i) {
                    keysButtons.push({
                        id: "key-" + (i + 1),
                        name: "按键" + i,
                        type: "img",
                        nextFocusLeft: "key-" + (i + 1 - 1),
                        nextFocusRight: "key-" + (i + 1 + 1),
                        nextFocusUp: "key-" + (i + 1 - 3),
                        nextFocusDown: "key-" + (i + 1 + 3),
                        backgroundImage: self.keyboard.__keysPathDir + "/key_out_" + (i + 1) + ".png",
                        focusImage: self.keyboard.__keysPathDir + "/key_in_" + (i + 1) + ".png",
                        click: LMEPG.UI.keyboard.onKeyboardItemClicked,
                        beforeMoveChange: LMEPG.UI.keyboard.__beforeMoveChanged, //默认焦点移动拦截操作，主要用于加强按键循环变化体验
                        keyVal: item, //该按钮对应键值
                        cIndex: i + 1, //序号（1开始~键值数组长度）
                    });
                });
                LMEPG.BM.addButtons(keysButtons);
            },

            // 创建键盘UI
            __createRenderUI: function (left, top) {
                var eleKeyboardContainer = document.createElement("div");

                eleKeyboardContainer.id = "gid_keyboard_container";
                eleKeyboardContainer.style.position = "absolute";
                eleKeyboardContainer.style.left = left + "px";
                eleKeyboardContainer.style.top = top + "px";
                eleKeyboardContainer.style.width = "168px";
                eleKeyboardContainer.style.height = "224px";
                eleKeyboardContainer.style.zIndex = "9999";

                var strHtml = '';
                for (var i = 0; i < self.keyboard.__keyValList.length; i++) {
                    strHtml += '<img id="key-' + (i + 1) + '" style="width:55px;height:55px;position: absolute;left:' + (i % 3 === 0 ? 0 : i % 3 * 56) + 'px;top:' + parseInt(i / 3) * 56 + 'px" alt="" ' +
                        ' src="' + self.keyboard.__keysPathDir + '/key_out_' + (i + 1) + '.png" >';
                }
                eleKeyboardContainer.innerHTML = strHtml;

                window.document.body.appendChild(eleKeyboardContainer);
            },

            /**
             * 初始化必须参数
             * @param inputElementId [string] （必选）文本输入框元素id（一般为div）。
             * @param lengthLimit [int] （可选）限制文本输入的长度。
             * @param focusEleIdAfterCloseKeyboard [string|undefined] （可选）
             * @private
             */
            __initParamsBeforeShow: function (inputElementId, lengthLimit, focusEleIdAfterCloseKeyboard) {
                self.keyboard.__inputElementId = inputElementId;
                self.keyboard.__focusEleIdAfterClose = focusEleIdAfterCloseKeyboard;
                self.keyboard.__inputElementDom = G(self.keyboard.__inputElementId);
                self.keyboard.__lengthLimit = lengthLimit;

                // 第一次弹出，获取保存默认hint文本
                self.keyboard.__hintText = "";// 处理当有验证码框删除文字不正常的显示问题
                if (self.keyboard.__hintText === ""/*即检测不为默认的undefined即可，即使外部传入空""也算有效！*/) {
                    var currentText = self.keyboard.__inputElementDom && self.keyboard.__inputElementDom.innerHTML;
                    if (currentText) self.keyboard.__hintText = currentText;
                }

                // 加强校验！兼容调用者未提供 inputElementId 参数时，尝试获取当前有焦点的按钮，以避免关闭键盘后无法聚焦！
                if (LMEPG.Func.isEmpty(focusEleIdAfterCloseKeyboard) || !LMEPG.Func.isElementExist(focusEleIdAfterCloseKeyboard)) {
                    var focusBtn = LMEPG.BM.getCurrentButton();
                    self.keyboard.__focusEleIdAfterClose = focusBtn && focusBtn.id;
                }
            },

            // 校验初始化键盘值
            __checkInitVal: function () {
                var currentText = self.keyboard.__inputElementDom && self.keyboard.__inputElementDom.innerHTML;
                if (typeof currentText === "undefined" || currentText == null || currentText === "") {
                    return true;
                } else {
                    if (typeof callFn === "function") {
                        if (currentText == self.keyboard.__firstKey && !self.keyboard.__isOpen) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return !!self.keyboard.__isNumber(currentText);
                    }
                }
            },

            // 是否为数字
            __isNumber: function (val) {
                var regPos = /^\d+(\.\d+)?$/; //非负浮点数
                var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
                return regPos.test(val) || regNeg.test(val);
            },

            // 按钮拦截处理
            __beforeMoveChanged: function (dir, current) {
                // 仅处理长按上下键循环切换的用户场景
                // if (LMEPG.Func.array.contains(dir, [G_CONST.up, G_CONST.down])) {
                //     var MAX_COLS_PER_ROW = 6; //一行最大列数
                //     var rowNO = Math.floor((current.cIndex - 1) / MAX_COLS_PER_ROW);
                //
                //     var nextUpOrDownId = "";
                //     if (rowNO === 0 /*第1行*/) nextUpOrDownId = "key-" + (current.cIndex + MAX_COLS_PER_ROW);
                //     else if (rowNO === 1 /*第2行*/) nextUpOrDownId = "key-" + (current.cIndex - MAX_COLS_PER_ROW);
                //
                //     if (LMEPG.Func.isElementExist(nextUpOrDownId)) {
                //         LMEPG.BM.requestFocus(nextUpOrDownId);
                //         return false;
                //     }
                // }
            },

            showWithEn: function (opt) {
                this.__EnInputEle = G(opt.inputEle)
                this.__placeholder = opt.placeholder
                this.__backId = opt.backId
                this.__maxLength = opt.maxLength || 11

                this.__textIsNull = ''

                if (this.__shouldShowPlaceholder) {
                    this.__EnInputEle.innerHTML = this.__placeholder
                }

                this.__creatKeyEle(opt.x, opt.y)
                this.__initEnButtons()

                LMEPG.BM.requestFocus("key-1");

                LMEPG.KeyEventManager.addKeyEvent(
                    {
                        KEY_BACK: LMEPG.UI.keyboard.closeEnKeyboard, //临时覆写接管新的back事件，关闭后需还原
                        KEY_BACK_640: LMEPG.UI.keyboard.closeEnKeyboard //临时覆写接管新的back事件，关闭后需还原
                    });

                LMEPG.KeyEventManager.addKeyEvent(
                    {
                        KEY_0: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "0", "id": "key-11"})',
                        KEY_1: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "1", "id": "key-1"})',
                        KEY_2: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "2", "id": "key-2"})',
                        KEY_3: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "3", "id": "key-3"})',
                        KEY_4: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "4", "id": "key-4"})',
                        KEY_5: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "5", "id": "key-5"})',
                        KEY_6: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "6", "id": "key-6"})',
                        KEY_7: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "7", "id": "key-7"})',
                        KEY_8: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "8", "id": "key-8"})',
                        KEY_9: 'LMEPG.UI.keyboard.pressByControl({"keyVal": "9", "id": "key-9"})',
                        KEY_BACK: LMEPG.UI.keyboard.closeEnKeyboard, //临时覆写接管新的back事件，关闭后需还原
                        KEY_BACK_640: LMEPG.UI.keyboard.closeEnKeyboard //临时覆写接管新的back事件，关闭后需还原
                    });
            },

            __creatKeyEle: function (x, y) {
                var eleKeyboardContainer = document.createElement("div");

                eleKeyboardContainer.id = "gid_keyboard_container";
                eleKeyboardContainer.style.position = "absolute";
                eleKeyboardContainer.style.left = x + "px";
                eleKeyboardContainer.style.top = y + "px";
                eleKeyboardContainer.style.width = "168px";
                eleKeyboardContainer.style.height = "224px";
                eleKeyboardContainer.style.zIndex = "9999";

                var html = ''

                for (var i = 0; i < 12; i++) {
                    html += '<img id="key-' + (i + 1) + '" style="width:55px;height:55px;position: absolute;left:' + (i % 3 === 0 ? 0 : i % 3 * 56) + 'px;top:' + parseInt(i / 3) * 56 + 'px" alt="" ' +
                        ' src="' + self.keyboard.__EnKeysPathDir + '/key_out_' + (i + 1) + '.png" >';
                }
                eleKeyboardContainer.innerHTML = html;

                document.body.appendChild(eleKeyboardContainer);
            },

            __initEnButtons: function () {
                var buttons = []

                for (var i = 0; i < 12; i++) {
                    buttons.push({
                        id: "key-" + (i + 1),
                        name: "按键" + i,
                        type: "img",
                        nextFocusLeft: "key-" + (i + 1 - 1),
                        nextFocusRight: "key-" + (i + 1 + 1),
                        nextFocusUp: "key-" + (i + 1 - 3),
                        nextFocusDown: "key-" + (i + 1 + 3),
                        backgroundImage: self.keyboard.__EnKeysPathDir + "/key_out_" + (i + 1) + ".png",
                        focusImage: self.keyboard.__EnKeysPathDir + "/key_in_" + (i + 1) + ".png",
                        click: self.keyboard.openEnKey,
                        beforeMoveChange: self.keyboard.worldChoose,
                        cIndex: i + 1, //序号（1开始~键值数组长度）
                    });
                }

                LMEPG.BM.addButtons(buttons)
            },

            openEnKey: function (btn) {
                if (self.keyboard.__keyHasOpen) {
                    self.keyboard.worldChoose("enter", btn)

                } else if (btn.cIndex >= 2 && btn.cIndex <= 9) {
                    G(btn.id).src = self.keyboard.__EnKeysPathDir + '/key_open_' + btn.cIndex + '.png'
                    self.keyboard.__keyHasOpen = true
                    self.keyboard.__openID = [btn.id, btn.cIndex]

                } else if (btn.cIndex === 1 || btn.cIndex === 11) {
                    self.keyboard.addText(btn.cIndex === 1 ? '1' : '0')

                } else if (btn.cIndex === 10) {
                    self.keyboard.closeEnKeyboard()

                } else if (btn.cIndex === 12) {
                    self.keyboard.deleteWord()
                }
            },

            pressByControl: function (obj) {
                LMEPG.BM.requestFocus(obj.id)
                self.keyboard.addText(obj.keyVal)
            },

            worldChoose: function (dir, btn) {
                if (self.keyboard.__keyHasOpen) {
                    self.keyboard.addText(self.keyboard.__keyEnValue['key_' + btn.cIndex][dir])
                    G(btn.id).src = self.keyboard.__EnKeysPathDir + '/key_in_' + btn.cIndex + '.png'
                    self.keyboard.__keyHasOpen = false

                    return false
                } else {

                    return true
                }

            },

            addText: function (text) {
                if (self.keyboard.__shouldShowPlaceholder) {
                    self.keyboard.__shouldShowPlaceholder = false
                    self.keyboard.__EnInputEle.innerHTML = ''
                }

                var world = self.keyboard.__EnInputEle.innerHTML

                if ((world + text).length > self.keyboard.__maxLength) {
                    LMEPG.UI.showToast('输入已达到最大长度！')
                    return
                }

                world += text
                self.keyboard.__textIsNull = world
                self.keyboard.__EnInputEle.innerHTML = world
            },

            closeEnKeyboard: function () {
                if (self.keyboard.__keyHasOpen) {
                    self.keyboard.__keyHasOpen = false
                    G(self.keyboard.__openID[0]).src = self.keyboard.__EnKeysPathDir + '/key_in_' + self.keyboard.__openID[1] + '.png'
                    return
                }

                LMEPG.KeyEventManager.delKeyEvent([KEY_BACK, KEY_BACK_640]);
                LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: "onBack()", KEY_BACK_640: "onBack()"});

                self.keyboard.__keyHasOpen = false
                self.keyboard.__shouldShowPlaceholder = true
                delNode("gid_keyboard_container");
                LMEPG.BM.requestFocus(self.keyboard.__backId)
            },

            deleteWord: function () {
                var word = self.keyboard.__EnInputEle.innerHTML
                word = word.substring(0, word.length - 1);
                self.keyboard.__textIsNull = word

                if (word && !self.keyboard.__shouldShowPlaceholder) {
                    self.keyboard.__EnInputEle.innerHTML = word
                } else {
                    self.keyboard.__EnInputEle.innerHTML = self.keyboard.__placeholder
                    self.keyboard.__shouldShowPlaceholder = true;
                }

            },

            inputIsNull: function () {
                return !self.keyboard.__textIsNull
            },

            /**
             * 某一键盘按钮被点击
             * @param btn [object] 按键对象
             */
            onKeyboardItemClicked: function (btn) {
                // 弹出键盘时，铵遥控器键值时需要及时响应键盘焦点变化
                if (isShow("gid_keyboard_container") && LMEPG.Func.isElementExist(btn.id)) {
                    LMEPG.BM.requestFocus(btn.id);
                }

                var domInputElement = G(self.keyboard.__inputElementId);
                var currentText = domInputElement ? domInputElement.innerHTML : "";
                var lastText = "";

                if (!LMEPG.Func.array.contains(btn.keyVal, ["delete", "back"])) {
                    // 非delete、非clear按键处理
                    if (self.keyboard.__checkInitVal()) {
                        if (!self.keyboard.__isNumber(currentText.replace(/\s+/g, ""))) {
                            currentText = ''
                            domInputElement.innerHTML = ''
                        }
                        var lengthLimit = self.keyboard.__lengthLimit;
                        if (lengthLimit && currentText.length == 11) {
                            LMEPG.UI.showToast("手机号只能为11位！");
                            return;
                        } else if (self.keyboard.__maxInputLength === currentText.length && self.keyboard.__maxInputTips !== '') {
                            LMEPG.UI.showToast(self.keyboard.__maxInputTips);
                            return;
                        } else {
                            lastText = currentText + btn.keyVal;
                        }
                    } else {
                        currentText = "";
                        lastText = currentText + btn.keyVal;

                    }
                    if (self.keyboard.__inputTextColor !== '') domInputElement.style.color = self.keyboard.__inputTextColor; // 设置键盘影响的输入框的文字颜色值
                    typeof callFn === "function" ? lastText = callFn(lastText) : false;
                    if (domInputElement) domInputElement.innerHTML = lastText;
                    self.keyboard.__isOpen = true
                } else if (btn.keyVal === "delete") {

                    if (self.keyboard.__tipsText === currentText) return;

                    if (currentText) {
                        currentText = currentText.substring(0, currentText.length - 1);
                        if (!currentText) { // 当删除到最后一个内容时
                            currentText = ''; // 显示为默认文案
                        }
                    }
                    if (domInputElement) {
                        domInputElement.innerHTML = currentText;
                        if (currentText === '' && self.keyboard.__tipsText !== "") {
                            domInputElement.innerHTML = self.keyboard.__tipsText;
                            domInputElement.style.color = self.keyboard.__tipsTextColor;
                        }
                    }

                } else if (btn.keyVal === "back") {
                    // back按键处理
                    if (!currentText) {
                        domInputElement.innerText = self.keyboard.__firstKey;
                    }
                    self.keyboard.dismiss();
                }
            },
            cursorAnimationTimer:null,
            beganCursorAnimation:function(){
                LMEPG.UI.keyboard.cursorAnimationTimer = setInterval(function () {
                    var nowStatus = G('input-cursor').style.display
                    G('input-cursor').style.display = (nowStatus ==='none'? 'inline-block' : 'none')
                },300)
            },

            /**
             * 自定义关闭键盘后回调接口。若不设置有效function，则默认按键back（键或按钮）则仅仅关闭操作！
             * @param callback [function] 关闭回调事件。
             * @return {LMEPG.UI.keyboard}
             */
            addCloseCallBack: function (callback) {
                self.keyboard.__closeCallback = callback;
                return this;
            },

            /**
             * 显示默认提示文案
             * @param tipsText [string] 默认显示文字，若未有效提供，则默认取当前input_element元素的值
             * @param tipsTextColor [string] 默认提示文字颜色值，
             * @return {LMEPG.UI.keyboard}
             */
            showTipsText: function (tipsText, tipsTextColor) {
                self.keyboard.__tipsText = typeof tipsText === "string" ? tipsText : "";
                self.keyboard.__tipsTextColor = typeof tipsTextColor === "string" ? tipsTextColor : "";
                var domInputElement = G(self.keyboard.__inputElementId);
                var contentText = domInputElement.innerHTML;
                if (contentText === "") {
                    domInputElement.innerHTML = tipsText;
                    domInputElement.style.color = tipsTextColor;
                }
                return this;
            },

            /**
             * 设置文本输入限制
             * @param maxInputLength [int] 文本输入长度限制
             * @param maxInputTips [string] 文本输入长度超出限制提示文案
             * @return {LMEPG.UI.keyboard}
             */
            setInputLimit: function (maxInputLength, maxInputTips) {
                self.keyboard.__maxInputLength = typeof maxInputLength === "number" ? maxInputLength : -1;
                self.keyboard.__maxInputTips = typeof maxInputTips === "string" ? maxInputTips : '';
                return this;
            },

            /**
             * 设置默认的hint值
             * @param inputTextColor [string] 默认显示文字颜色值
             * @return {LMEPG.UI.keyboard}
             */
            setInputTextColor: function (inputTextColor) {
                self.keyboard.__inputTextColor = typeof inputTextColor === "string" ? inputTextColor : "";
                return this;
            },

            /**
             * 关闭键盘并恢复数据状态
             */
            dismiss: function () {
                Hide("gid_keyboard_container");

                if(G('input-cursor')){
                    G('input-cursor').style.display = 'none'
                    clearInterval(LMEPG.UI.keyboard.cursorAnimationTimer)
                    LMEPG.UI.keyboard.cursorAnimationTimer = null
                }
                // 释放键盘临时接管的back按键事件监听，归还业务逻辑页面！
                LMEPG.KeyEventManager.delKeyEvent([KEY_BACK, KEY_BACK_640]);
                LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: "onBack()", KEY_BACK_640: "onBack()"});

                // 清除相关信息
                self.keyboard.__maxInputLength = -1;
                self.keyboard.__maxInputTips = "";
                self.keyboard.__tipsText = "";
                self.keyboard.__tipsTextColor = "";

                // 回调或默认焦点归还
                if (typeof self.keyboard.__closeCallback === "function") { //执行自定义回调
                    LMEPG.call(self.keyboard.__closeCallback);
                } else { //默认焦点归还
                    // self.keyboard.__inputElementId = "";
                    LMEPG.BM.requestFocus(self.keyboard.__focusEleIdAfterClose);
                }
            },

        }; // #End of LMEEPG.UI$keyboard
    };

    return new LMUISdk();
})();

/******************************************************************
 * 添加扩展UI-JS
 *****************************************************************/
(function __loadExtUIJS() {
    try {
        document.write('<script type="text/javascript" src="' + appRootPath + '/Public/Common/js/lmuiEx.js"></script>');
    } catch (e) {
        console.error(e);
    }


})();