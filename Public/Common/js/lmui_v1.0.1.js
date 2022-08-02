/**
 * 自定义的UI界面库
 * Created by caijun on 2018/03/29.
 */
/**
 * 简短方法名，判断元素是否为空
 * @param obj
 * @return {*|boolean}
 */

/****************************************************************
 * 定义区域码
 ***************************************************************/
var CARRIER_ID_GUO_AN_GUANG_SHI = "02000011";       // 国安广视（康乐养生堂）
var CARRIER_ID_GUANGDONGGD = "440004";              // 广东广电
var CARRIER_ID_JIUAIHEALTH = "03000011";            // 玖爱健康
var CARRIER_ID_DEMO4 = "000409";                    // 展示版本-4（广东广电）
var CARRIER_ID_DEMO5 = "00000509";                  // 展示版本-5（基于青海移动）
var CARRIER_ID_DEMO6 = "000609";                    // 展示版本-6（基于贵州广电）
var CARRIER_ID_DEMO7 = "000709";                    // 展示版本-7（基于中国联通APK2.0）
var CARRIER_ID_GUIZHOUGD = "520004";                // 贵州广电
var CARRIER_ID_GANSUYD = "620007";                  // 甘肃移动
var CARRIER_ID_GUANGXIGD = "450004";                // 广西广电
var CARRIER_ID_QINGHAIYD = "630001";                // 青海移动
var CARRIER_ID_NINGXIAYD = "640001";                // 宁夏移动
var CARRIER_ID_SHANDONGDX = "370002";               // 山东电信
var CARRIER_ID_CHINAUNICOM = "000006";              // 中国联通
var CARRIER_ID_XIZANGYD = "540001";                 // 西藏移动
var CARRIER_ID_HUNANYX = "430012";                  // 湖南有线
var CARRIER_ID_WEILAITV_TOUCH_DEVICE = "05001110";  // 未来电视触摸屏设备
var CARRIER_ID_JIANGXIYD = "360001";                // 江西移动
var CARRIER_ID_JIANGSUYD = "320001";                // 江苏移动
var CARRIER_ID_JIANGSUDX_YUEME = "000005";          // 江苏电信悦me
var CARRIER_ID_SHANXIYD = "610001";                 // 陕西移动
var CARRIER_ID_YB_HEALTH_UNIFIED = "09000001";      // 未来电视怡伴健康统一接口
var CARRIER_ID_YBHEALTH = "09000006";               // 怡伴健康
var CARRIER_ID_GUANGDONGYD = "440001";              // 广东移动
var CARRIER_ID_GUANGXIYDYIBAN = "09450001";         // 广西移动怡伴
var CARRIER_ID_GUANGXIYD = "450001";                // 广西移动
var CARRIER_ID_SHIJICIHAI = "110052";                // 世纪慈海在线问诊APK
/***************************************************************/

function is_empty(obj) {
    return LMEPG.Func.isEmpty(obj);
}

LMEPG.UI = LMEPG.ui = (function () {
    var ROOT = typeof ROOT === "undefined" ? g_appRootPath : ROOT;//兼容处理页面未手动添加ROOT时，直接用已全局定义在基js里的
    return {
        /** 使用Android端提供的进度对话框 */
        _isUsedWaitingDialogFromAndroid: true,
        _forbidClickDoubleTime: Date.now(), //禁用两次点击按键的时间记录
        forbidDoubleClickBtn: function (callback) {
            console.log("forbidDoubleClickBtn:------>");
            var tempForbidDuration = 1000;//按钮禁用时长，一秒之内禁止重复点击
            var now = Date.now();

            var du = now - LMEPG.ui._forbidClickDoubleTime;
            if (du > tempForbidDuration) {
                LMEPG.ui._forbidClickDoubleTime = now;
                callback();
            } else {
                console.log("forbidDoubleClickBtn:------>禁用成功：" + du);
                return;
            }

        },
        /**
         * 校验是否是电话号码
         * @param telNum
         * @returns {boolean}
         */
        isTelNum: function (telNum) {
            var telReg = /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147)|(145))\d{8}$/;
            return telReg.test(telNum);
        },

        /**
         * 弹出Android端toast
         * @param msg
         */
        showAndroidToast: function (msg) {
            if (LMAndroid) {
                LMAndroid.JSCallAndroid.doShowToast(typeof msg === 'string' ? msg : '')
            }
        },

        /**
         * 通用的消息提示框
         * @param msg
         * @param second
         */
        showToast: function (msg, second, callback) {
            if (RenderParam.carrierId == CARRIER_ID_GUIZHOUGD || RenderParam.carrierId == CARRIER_ID_DEMO6) {
                return LMEPG.ui.showToastV1(msg, second, callback);
            } else if (RenderParam.carrierId == CARRIER_ID_GUANGXIGD || RenderParam.carrierId == CARRIER_ID_CHINAUNICOM
                || RenderParam.carrierId == CARRIER_ID_DEMO7
                || RenderParam.carrierId == CARRIER_ID_GUANGDONGGD
                || RenderParam.carrierId == CARRIER_ID_NINGXIAYD
                || RenderParam.carrierId == CARRIER_ID_HUNANYX
                || RenderParam.carrierId == CARRIER_ID_QINGHAIYD
                || RenderParam.carrierId == CARRIER_ID_JIANGSUDX_YUEME
                || RenderParam.carrierId == CARRIER_ID_WEILAITV_TOUCH_DEVICE) {
                if (!LMAndroid.isRunOnPc()) {
                    LMAndroid.JSCallAndroid.doShowToast(msg);
                    LMEPG.call(callback);
                    return;
                }
            }
            mCallback = callback;
            if (msg === undefined || msg === '') {
                //数据未空时，不产生任何效果
                return;
            }
            second = second === undefined ? 3 : second; //没有传递second 默认3秒
            if (second > 0) {
                if (!LMEPG.toastUI) {
                    var toastDiv = document.createElement("div");  //创建显示控件
                    var toastTitle = document.createElement("div");
                    toastDiv.id = "id_toast";
                    toastTitle.id = "g_title";
                    LMEPG.CssManager.addClass(toastDiv, "g_toast");
                    // toastDiv.style.backgroundImage = "url('" + ROOT + "/Public/img/Common/bg_toast.png')";
                    toastDiv.style.backgroundImage = "url('" + ROOT + "/Public/img/Common/bg_common_dialog.png')";
                    LMEPG.CssManager.addClass(toastTitle, "g_title");
                    //将toast控件增加到body中并显示
                    var body = document.body;
                    body.appendChild(toastDiv);
                    toastDiv.appendChild(toastTitle);
                    LMEPG.toastUI = toastDiv;
                }
                G('g_title').innerHTML = msg;
                S('id_toast');
                if (LMEPG.toastTimer) {
                    //如果已经执行了setTimeOut,强制停止
                    clearTimeout(LMEPG.toastTimer);
                }
                LMEPG.toastTimer = setTimeout(function () {
                    H("id_toast");
                    LMEPG.call(mCallback);
                }, second * 1000);
            }
        },

        /**
         * 通用的消息提示框
         * @param msg
         * @param second
         */
        showToastV1: function (msg, second, callback) {
            mCallback = callback;
            if (msg === undefined || msg === '') {
                //数据未空时，不产生任何效果
                return;
            }
            second = second === undefined ? 3 : second; //没有传递second 默认3秒
            if (second > 0) {
                if (!LMEPG.toastUI) {
                    var toastDiv = document.createElement("div");  //创建显示控件
                    var toastTitle = document.createElement("div");
                    toastDiv.id = "id_toast";
                    toastTitle.id = "g_title";
                    LMEPG.CssManager.addClass(toastDiv, "g_toast");
                    toastDiv.style.backgroundImage = "url('" + ROOT + "/Public/img/Common/V3/bg_toast.png')";
                    LMEPG.CssManager.addClass(toastTitle, "g_title");
                    //将toast控件增加到body中并显示
                    var body = document.body;
                    body.appendChild(toastDiv);
                    toastDiv.appendChild(toastTitle);
                    LMEPG.toastUI = toastDiv;
                }
                G('g_title').innerHTML = msg;
                S('id_toast');
                if (LMEPG.toastTimer) {
                    //如果已经执行了setTimeOut,强制停止
                    clearTimeout(LMEPG.toastTimer);
                }
                LMEPG.toastTimer = setTimeout(function () {
                    H("id_toast");
                    LMEPG.call(mCallback);
                }, second * 1000);
            }
        },

        showToastCustom: function(toastParams,callbackFunc){
            var content = toastParams.content;
            if (content === undefined || content === "") {
                //数据未空时，不产生任何效果
                return;
            }
            var showStyle = (toastParams.showStyle === undefined ? "g_toast" : toastParams.showStyle);
            var textStyle = (toastParams.textStyle === undefined ? "g_title" : toastParams.textStyle);
            var bgImage = (toastParams.bgImage === undefined ? "bg_toast_v1.png" : toastParams.bgImage);
            var showTime = (toastParams.showTime === undefined ? 3 : toastParams.showTime); //没有传递second 默认3秒
            if (showTime > 0) {
                if (!LMEPG.toastContainer) {
                    var toastDiv = document.createElement("div");  //创建显示控件
                    var toastTitle = document.createElement("div");
                    toastDiv.id = "toast_container";
                    toastTitle.id = "toast_content";
                    LMEPG.CssManager.addClass(toastDiv, showStyle);
                    toastDiv.style.backgroundImage = "url('" + ROOT + "/Public/img/Common/" + bgImage +"')";
                    LMEPG.CssManager.addClass(toastTitle, textStyle);
                    //将toast控件增加到body中并显示
                    var body = document.body;
                    body.appendChild(toastDiv);
                    toastDiv.appendChild(toastTitle);
                    LMEPG.toastContainer = toastDiv;
                }
                G('toast_content').innerHTML = content;
                S('toast_container');
                if (LMEPG.showToastTimeer) {
                    //如果已经执行了setTimeOut,强制停止
                    clearTimeout(LMEPG.showToastTimeer);
                }
                LMEPG.showToastTimeer = setTimeout(function () {
                    H("toast_container");
                    LMEPG.call(callbackFunc);
                }, showTime * 1000);
            }
        },

        showToastBig: function (second, url) {
            second = second === undefined ? 3 : second; //没有传递second 默认3秒
            if (second > 0) {
                if (!LMEPG.toastUI) {
                    var toastDiv = document.createElement("div");  //创建显示控件
                    toastDiv.id = "g_toast_big";
                    LMEPG.CssManager.addClass(toastDiv, "g_toast_big");
                    //将toast控件增加到body中并显示
                    var body = document.body;
                    body.appendChild(toastDiv);
                    LMEPG.toastUI = toastDiv;
                }
                S('g_toast_big');
                G("g_toast_big").style.background = "url(" + url + ") no-repeat";
                if (LMEPG.toastTimer) {
                    //如果已经执行了setTimeOut,强制停止
                    clearTimeout(LMEPG.toastTimer);
                }
                LMEPG.toastTimer = setTimeout('H("g_toast_big")', second * 1000);
            }
        },
        /**
         * 滚动位置
         * @param id 滚动焦点的id
         * @param scroll 界面滚动区域的id
         * @param direct 滚动方向
         * * @param margin 是否存在空隙，默认为空
         */
        showScrollTop: function (id, direct, margin) {
            if (margin == "") {
                var marginTop = parseInt(getComputedStyle(document.getElementById(id), null).getPropertyValue("margin-top")) * 2;//获取文件类的样式属性值
            } else {
                var marginTop = margin;//获取文件类的样式属性值
            }
            if (direct == "up") {
                G(scroll).scrollTop = G(scroll).scrollTop - G(id).clientHeight + marginTop;
            } else {
                G(scroll).scrollTop = G(scroll).scrollTop + G(id).clientHeight - marginTop;
            }
        },
        /**
         * 滚动位置
         * @param id 滚动焦点的id
         * @param scroll 界面滚动区域的id
         * @param direct 滚动方向
         * * @param margin 是否存在空隙，默认为空
         */
        showScrollTop2: function (id, scroll, direct, margin) {
            if (margin == "") {
                var marginTop = parseInt(getComputedStyle(document.getElementById(id), null).getPropertyValue("margin-top")) * 2;//获取文件类的样式属性值
            } else {
                var marginTop = margin;//获取文件类的样式属性值
            }
            if (direct == "up") {
                G(scroll).scrollTop = G(scroll).scrollTop - G(id).clientHeight + marginTop;
            } else {
                G(scroll).scrollTop = G(scroll).scrollTop + G(id).clientHeight - marginTop;
            }
        },
        /**
         * 初始化滚动位置
         * @param top 滚动位置
         */
        initScrollTop: function (top) {
            G(scroll).scrollTop = top;
        },

        autoScrollTop: function () {
            G(scroll).style.overflow = "auto";
        },

        hiddenScrollTop: function () {
            G(scroll).style.overflow = "hidden";
        },

        /**
         * 显示加载框
         * @param msg
         * @param second
         * @param timeOutCallback
         */
        showWaitingDialog: function (msg, second, timeOutCallback) {
            msg = (msg !== undefined ? msg : ''); // 没有传递msg 默认空
            second = (second === undefined ? 30 : second); // 没有传递second  默认0表示不超时

            if (LMEPG.UI._isUsedWaitingDialogFromAndroid) {
                // 使用Android端实现的进度框
                if (LMAndroid) LMAndroid.JSCallAndroid.doShowWaitingDialog(msg);
            } else {
                // 使用js端端实现的进度框
                if (!LMEPG.waitingDialog) {
                    var toastDiv = document.createElement("div");  //创建显示控件
                    toastDiv.id = "id_waiting_dialog";
                    LMEPG.CssManager.addClass(toastDiv, "g_waiting_dialog");
                    //将toast控件增加到body中并显示
                    var body = document.body;
                    body.appendChild(toastDiv);
                    LMEPG.waitingDialog = toastDiv;
                }
                G('id_waiting_dialog').innerHTML = msg;
                S('id_waiting_dialog');
            }

            // LMEPG.KeyEventManager.setAllowFlag(false);
            if (second > 0) {
                if (LMEPG.waitingDialogTimer) { //如果已经执行了setTimeOut,强制停止
                    clearTimeout(LMEPG.waitingDialogTimer);
                }
                LMEPG.waitingDialogTimer = setTimeout(function () {
                    if (LMEPG.UI._isUsedWaitingDialogFromAndroid) {
                        if (LMAndroid) LMAndroid.JSCallAndroid.doDismissWaitingDialog();
                    } else {
                        H("id_waiting_dialog");
                    }

                    LMEPG.KeyEventManager.setAllowFlag(true);
                    if (timeOutCallback !== "undefined" && timeOutCallback != '') {
                        LMEPG.call(timeOutCallback, []);
                    }
                }, second * 1000);
            }
        },

        /**
         * 取消加载等待框
         */
        dismissWaitingDialog: function () {
            if (LMEPG.waitingDialogTimer) { //如果已经执行了setTimeOut,强制停止
                clearTimeout(LMEPG.waitingDialogTimer);
            }

            this._closeWaitingDialogInner();
        },

        /**
         * 关闭加载等待框内部统一处理
         */
        _closeWaitingDialogInner: function () {
            if (LMEPG.UI._isUsedWaitingDialogFromAndroid) {
                // 使用Android端实现的进度框
                if (LMAndroid) LMAndroid.JSCallAndroid.doDismissWaitingDialog();
            } else {
                // 使用JS端实现的进度框
                if (LMEPG.waitingDialog) {
                    H("id_waiting_dialog");
                }
            }

            // 恢复按键响应
            LMEPG.KeyEventManager.setAllowFlag(true);
        },

        /**
         * 显示确认对话框
         */
        PromptDialog: {
            isShow: false,//弹框是否显示
            currentFocusID: "promptConfirm",//当前获取焦点的确认框
            confirmID: "promptConfirm",//确认的id名称
            cancelID: "promptCancel",//取消的id名称

            show: function (msg) {
                var body = document.body;
                var bgDiv = document.createElement("div");
                var fontDiv = document.createElement("div");
                var confirmDiv = document.createElement("div");
                var cancelDiv = document.createElement("div");

                //背景图设置
                bgDiv.id = "prompt";
                bgDiv.style.position = "absolute";
                bgDiv.style.left = "0px";
                bgDiv.style.top = "0px";
                bgDiv.style.width = "1280px";
                bgDiv.style.height = "720px";
                bgDiv.style.backgroundImage = 'url("/' + ROOT + 'Public/img/dialog/bg_dialog.png")';
                bgDiv.style.zIndex = "8000";

                //提示文字设置
                fontDiv.style.position = "absolute";
                fontDiv.style.left = "400px";
                fontDiv.style.top = "340px";
                fontDiv.style.width = "480px";
                fontDiv.style.height = "87px";
                fontDiv.style.zIndex = "2000";
                fontDiv.style.fontSize = "32px";
                fontDiv.style.color = "#474747";
                fontDiv.style.textAlign = "center";
                fontDiv.style.overflow = "hidden";
                fontDiv.style.textOverflow = "ellipsis";
                fontDiv.innerHTML = msg.toString();

                //确定按钮设置
                confirmDiv.style.position = "absolute";
                confirmDiv.id = "promptConfirm";
                confirmDiv.style.left = "429px";
                confirmDiv.style.top = "470px";
                confirmDiv.style.width = "203px";
                confirmDiv.style.height = "83px";
                confirmDiv.style.zIndex = "2000";
                confirmDiv.style.fontSize = "36px";
                confirmDiv.style.textAlign = "center";
                confirmDiv.style.color = "white";
                confirmDiv.style.lineHeight = "94px";
                confirmDiv.style.backgroundImage = 'url("' + ROOT + '/Public/img/dialog/btn_select.png")';
                confirmDiv.innerHTML = "确定";

                //取消按钮设置
                cancelDiv.style.position = "absolute";
                cancelDiv.id = "promptCancel";
                cancelDiv.style.left = "647px";
                cancelDiv.style.top = "470px";
                cancelDiv.style.width = "203px";
                cancelDiv.style.height = "83px";
                cancelDiv.style.zIndex = "2000";
                cancelDiv.style.fontSize = "36px";
                cancelDiv.style.textAlign = "center";
                cancelDiv.style.color = "white";
                cancelDiv.style.lineHeight = "94px";
                cancelDiv.style.backgroundImage = 'url("/' + ROOT + 'Public/img/dialog/btn_unselected.png")';
                cancelDiv.innerHTML = "取消";

                bgDiv.appendChild(fontDiv);
                bgDiv.appendChild(cancelDiv);
                bgDiv.appendChild(confirmDiv);
                body.insertBefore(bgDiv, body.firstElementChild);
                LMEPG.UI.PromptDialog.isShow = true;
                LMEPG.UI.PromptDialog.currentFocusID = "promptConfirm";
            },
            dismiss: function () {
                var elePrompt = document.getElementById("prompt");
                if (elePrompt != undefined) {
                    elePrompt.style.display = "none";
                    LMEPG.UI.PromptDialog.isShow = false;
                }
            },
            moveLeft: function () {
                var eleConfirm = document.getElementById("promptConfirm");
                var eleCancel = document.getElementById("promptCancel");
                switch (LMEPG.UI.PromptDialog.currentFocusID) {
                    case "promptCancel":
                        eleConfirm.style.backgroundImage = 'url("/' + ROOT + 'Public/img/dialog/btn_select.png")';
                        eleCancel.style.backgroundImage = 'url("/' + ROOT + 'Public/img/dialog/btn_unselected.png")';
                        LMEPG.UI.PromptDialog.currentFocusID = "promptConfirm";
                        break;
                }
            },
            moveRight: function () {
                var eleConfirm = document.getElementById("promptConfirm");
                var eleCancel = document.getElementById("promptCancel");
                switch (LMEPG.UI.PromptDialog.currentFocusID) {
                    case "promptConfirm":
                        eleConfirm.style.backgroundImage = 'url("/' + ROOT + 'Public/img/dialog/btn_unselected.png")';
                        eleCancel.style.backgroundImage = 'url("' + ROOT + '/Public/img/dialog/btn_select.png")';
                        LMEPG.UI.PromptDialog.currentFocusID = "promptCancel";
                        break;
                }
            }
        },

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
        setCorner: function (parentDivElement, left, top, width, height, isShow, id, zIndex) {
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

            var cornerImgUrl = ROOT + "/Public/img/Common/spacer.gif";
            if (isShow) {
                cornerImgUrl = ROOT + "/Public/img/Common/corner.png";
            }

            corner.style.position = "absolute";
            corner.style.left = left + "px";
            corner.style.top = top + "px";
            corner.style.zIndex = zIndex;
            corner.style.width = width + "px";
            corner.style.height = height + "px";
            corner.setAttribute("src", cornerImgUrl);
            parentDivElement.appendChild(corner);
        },
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
        setCornerMore: function (parentDivElement, left, top, width, height, isShow, showType, id, zIndex) {
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

            var cornerImgUrl = ROOT + "/Public/img/Common/spacer.gif";
            if (isShow) {
                if (showType == "2") {
                    cornerImgUrl = ROOT + "/Public/img/Common/corner.png";
                } else if (showType == "3") {
                    cornerImgUrl = ROOT + "/Public/img/Common/corner_pay.png";
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
        },


        /**
         * 通用对话框
         * 通过show方式进行调用，
         * 列入：show("是否退出",['是'，'否'],function(id){}）
         */
        commonDialog: {
            MAX_BUTTON_NUM: 2,
            buttonIds: [],
            mainButton: null,
            _clickCallBack: LMEPG.emptyFunc,
            dialog: null,
            _isShowing: false,

            /**
             * 显示通用对话框
             */
            show: function (message, buttonText, onCallback, focusId) {
                if (this._isShowing) {
                    return;
                }

                if (RenderParam.carrierId == CARRIER_ID_GUIZHOUGD || RenderParam.carrierId == "450004" || RenderParam.carrierId == CARRIER_ID_DEMO6) {
                    return LMEPG.UI.commonDialog.showV1(message, buttonText, onCallback);
                }

                this.mainButton = LMEPG.BM.getCurrentButton();
                this._clickCallBack = onCallback;
                if (typeof(buttonText) === "string")
                    buttonText = [buttonText];
                if (!LMEPG.func.isArray(buttonText) && buttonText.length < 1) {
                    // 参数出错
                    return;
                }

                var html = "";
                //增加背景图
                html += '<img id="g_common_dialog_img_bg" src="' + ROOT + '/Public/img/Common/bg_common_dialog.png" class="g_common_dialog_img_bg"/>';
                //增加消息提示
                html += '<div id="gid_common_dialog_message" class="g_common_dialog_message_text">';
                html += '</div>';
                //增加button容器
                html += '<div class="g_common_button_container">';
                var buttons = [];
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  //目前只支持两个按钮
                    if (i == 0)
                        html += '<div class="g_common_button_border">';
                    else
                        html += '<div class="g_common_button_border g_common_button_interval">';

                    html += '<img id="gid_common_button_' + i + '"' + ' src="' + ROOT + '/Public/img/Common/bg_common_button.png" class="g_common_button_img"/>';
                    html += '<div id="gid_common_button_' + i + '_text"' + ' class="g_common_button_text">';
                    html += buttonText[i];
                    html += '</div>';
                    html += '</div>';
                    var buttonId = 'gid_common_button_' + i;
                    buttons.push({
                        id: buttonId,
                        name: '通知',
                        type: 'img',
                        nextFocusLeft: i > 0 ? 'gid_common_button_' + (i - 1) : '',
                        nextFocusRight: (i < this.MAX_BUTTON_NUM - 1 && i < buttonText.length - 1) ? 'gid_common_button_' + (i + 1) : '',
                        nextFocusUp: '',
                        nextFocusDown: '',
                        backgroundImage: ROOT + '/Public/img/Common/bg_common_button.png',
                        focusImage: ROOT + '/Public/img/Common/f_common_button.png',
                        click: LMEPG.ui.commonDialog.onClick,
                        focusChange: '',
                        beforeMoveChange: '',
                        cIndex: i,
                    });
                    this.buttonIds.push(buttonId);
                }
                html += "</div>";

                this.dialog = document.createElement("div");  //创建显示控件
                this.dialog.id = "gid_common_dialog";
                this.dialog.innerHTML = html;
                LMEPG.CssManager.addClass(this.dialog, "g_common_dialog");
                var body = document.body;
                body.appendChild(this.dialog);

                g_common_dialog_img_bg.onload = function () {
                    G("gid_common_dialog_message").innerHTML = message;
                    if (LMEPG.func.isExist(LMEPG.BM.getButtons()) && LMEPG.BM.getButtons().length > 0) {
                        LMEPG.BM.addButtons(buttons);
                    } else {
                        LMEPG.ButtonManager.init("gid_common_button_0", buttons, "", true);
                    }
                    if (focusId === 'undefined') {
                        if (buttonText.length > 0) {
                            LMEPG.BM.requestFocus("gid_common_button_0");
                        }
                    } else {
                        LMEPG.BM.requestFocus(focusId);
                    }
                    LMEPG.KEM.addKeyEvent('KEY_BACK', LMEPG.UI.commonDialog.onInnerBack);

                    LMEPG.UI.commonDialog._isShowing = true;
                };

            },

            showV1: function (message, buttonText, onCallback) {
                if (this._isShowing) {
                    return;
                }

                this.mainButton = LMEPG.BM.getCurrentButton();
                this._clickCallBack = onCallback;
                if (typeof(buttonText) === "string")
                    buttonText = [buttonText];
                if (!LMEPG.func.isArray(buttonText) && buttonText.length < 1) {
                    // 参数出错
                    return;
                }

                var html = "";
                //增加背景图
                html += '<img id="g_common_dialog_img_bg" src="' + ROOT + '/Public/img/Common/V3/bg_toast.png" class="g_common_dialog_img_bg"/>';
                //增加消息提示
                html += '<div id="gid_common_dialog_message" class="g_common_dialog_message_text">';
                html += '</div>';
                //增加button容器
                html += '<div class="g_common_button_container">';
                var buttons = [];
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  //目前只支持两个按钮
                    if (i == 0)
                        html += '<div class="g_common_button_border">';
                    else
                        html += '<div class="g_common_button_border g_common_button_interval">';

                    html += '<img id="gid_common_button_' + i + '"' + ' src="' + ROOT + '/Public/img/Common/V3/bg_key.png" class="g_common_button_img"/>';
                    html += '<div id="gid_common_button_' + i + '_text"' + ' class="g_common_button_text">';
                    html += buttonText[i];
                    html += '</div>';
                    html += '</div>';
                    var buttonId = 'gid_common_button_' + i;
                    buttons.push({
                        id: buttonId,
                        name: '通知',
                        type: 'img',
                        nextFocusLeft: i > 0 ? 'gid_common_button_' + (i - 1) : '',
                        nextFocusRight: (i < this.MAX_BUTTON_NUM - 1 && i < buttonText.length - 1) ? 'gid_common_button_' + (i + 1) : '',
                        nextFocusUp: '',
                        nextFocusDown: '',
                        backgroundImage: ROOT + '/Public/img/Common/V3/bg_key.png',
                        focusImage: ROOT + '/Public/img/Common/V3/f_key.png',
                        click: LMEPG.ui.commonDialog.onClick,
                        focusChange: '',
                        beforeMoveChange: '',
                        cIndex: i,
                    });
                    this.buttonIds.push(buttonId);
                }
                html += "</div>";

                this.dialog = document.createElement("div");  //创建显示控件
                this.dialog.id = "gid_common_dialog";
                this.dialog.innerHTML = html;
                LMEPG.CssManager.addClass(this.dialog, "g_common_dialog");
                var body = document.body;
                body.appendChild(this.dialog);

                g_common_dialog_img_bg.onload = function () {
                    G("gid_common_dialog_message").innerHTML = message;
                    if (LMEPG.func.isExist(LMEPG.BM.getButtons()) && LMEPG.BM.getButtons().length > 0) {
                        LMEPG.BM.addButtons(buttons);
                        LMEPG.BM.requestFocus("gid_common_button_0");
                    } else {
                        LMEPG.ButtonManager.init("gid_common_button_0", buttons, "", true);
                    }
                    LMEPG.KEM.addKeyEvent('KEY_BACK', LMEPG.ui.commonDialog.onInnerBack);

                    LMEPG.UI.commonDialog._isShowing = true;
                };
            },

            close: function () {
                LMEPG.BM.deleteButtons(LMEPG.ui.commonDialog.buttonIds);
                if (LMEPG.ui.commonDialog.mainButton)
                    LMEPG.BM.requestFocus(LMEPG.ui.commonDialog.mainButton.id);
                LMEPG.ui.commonDialog.dialog.innerHTML = "";
                H('gid_common_dialog');
                LMEPG.UI.commonDialog._isShowing = false;
            },

            onClick: function (btn) {
                var handled = LMEPG.call(LMEPG.ui.commonDialog._clickCallBack, [btn.cIndex]);
                if (typeof handled === 'undefined' || !handled) {
                    LMEPG.ui.commonDialog.close();
                    LMEPG.KEM.addKeyEvent('KEY_BACK', 'onBack()');
                }
            },

            onInnerBack: function () {
                var handled = LMEPG.call(LMEPG.ui.commonDialog._clickCallBack, [-1]);
                if (typeof handled === 'undefined' || !handled) {
                    // this.close();
                    LMEPG.ui.commonDialog.close();
                    LMEPG.KEM.addKeyEvent('KEY_BACK', 'onBack()');
                }
            },
        },
        /**
         * 通用输入对话框
         * 通过show方式进行调用，
         * 列入：show("未检测到摄像头，请插入摄像头后问医，或者留下您的联系方式，通过电话问医。", ['是', '否'], function(id){})
         */
        commonEditDialog: {
            MAX_BUTTON_NUM: 2,
            buttonIds: [],
            mainButton: null,
            dialog: null,
            _clickCallBack: LMEPG.emptyFunc,
            _isShowing: false,

            /**
             * 显示通用输入对话框。
             *
             * <pre>使用示例：
             *      LMEPG.UI.commonEditDialog(
             *              '未检测到摄像头，请插入摄像头后问医，或者留下您的联系方式，通过电话问医。',
             *              ['是', '否'],
             *              function(btnIndex, inputValue) {},
             *              ['输入label提示：', '默认输入框文本', '输入框hint文本', '限制类型[tel|text|password|...]'],
             *              false
             *     );
             * </pre>
             */
            show: function (message, buttonText, onCallback, extraInputMessages,isShowInput) {
                var imgVersion = "";
                switch (RenderParam.carrierId) {
                    case CARRIER_ID_GANSUYD:
                    case CARRIER_ID_QINGHAIYD:
                    case CARRIER_ID_SHANDONGDX:
                        imgVersion = "V2";
                        break;
                    default:
                        imgVersion = "V1";
                        break;
                }
                console.log("removeChild:show");
                this._isShowing = true;
                if (!this._isShowing) {
                    console.log("removeChild:_isShowing");
                    return;
                }
                if (document.getElementById("gid_common_edit_dialog")) {
                    document.body.removeChild(document.getElementById("gid_common_edit_dialog"));
                }

                this.mainButton = LMEPG.BM.getCurrentButton();
                this._clickCallBack = onCallback;

                if (typeof(buttonText) === "string") buttonText = [buttonText];
                if (!LMEPG.Func.isArray(buttonText)) return; // 参数出错

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
                html += '<img id="gid_bg_common_edit_dialog" src="' + ROOT + '/Public/img/Common/input/' + imgVersion + '/bg.png" class="g_common_input_dialog_img_bg_v1"/>';
                html += '<div id="gid_common_edit_dialog_message" class="g_common_input_dialog_message_text_v1">' + "" + '</div>';
                html += '<input style="display: none" id="gid_common_edit_dialog_input" class="g_common_input_dialog_message_v1"' +
                    ' type="' + inputType + '"' +
                    ' value="' + inputDefault + '"' +
                    ' placeholder="' + inputHint + '"' +
                    ' oninput="LMEPG.UI.commonEditDialog.onInputContentChanged(this);"/>';
                html += '<div class="g_common_input_btn_v1">';
                var buttons = [];
                buttons.push({
                    id: "gid_common_edit_dialog_input",
                    name: "输入模式",
                    type: "img",
                    nextFocusDown: "gid_common_edit_dialog_button_0",
                    focusChange: LMEPG.UI.commonEditDialog.onFocusChanged,
                });
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  //目前只支持两个按钮
                    if (i === 0) html += '<div class="g_common_input_btn_border_v1">';
                    else html += '<div class="g_common_input_btn_border_v1 g_common_input_btn_interval_v1">';

                    html += '<img id="gid_common_edit_dialog_button_' + i + '"' + ' src="' + ROOT + '/Public/img/Common/input/' + imgVersion + '/f_r_btn.png" class="g_common_input_btn_img_v1"/>';
                    html += '<div id="gid_common_edit_dialog_button_' + i + '_text"' + ' class="g_common_input_text_v1">';

                    html += '</div>';
                    html += '</div>';
                    var buttonId = 'gid_common_edit_dialog_button_' + i;
                    buttons.push({
                        id: buttonId,
                        name: "按钮" + i,
                        type: "img",
                        nextFocusLeft: i > 0 ? "gid_common_edit_dialog_button_" + (i - 1) : "",
                        nextFocusRight: (i < this.MAX_BUTTON_NUM - 1 && i < buttonText.length - 1) ? "gid_common_edit_dialog_button_" + (i + 1) : "",
                        nextFocusUp: "gid_common_edit_dialog_input",
                        backgroundImage: ROOT + "/Public/img/Common/input/" + imgVersion + "/f_r_btn.png",
                        focusImage: ROOT + "/Public/img/Common/input/" + imgVersion + "/f_btn.png",
                        click: LMEPG.UI.commonEditDialog.onClick,
                        beforeMoveChange: LMEPG.UI.commonEditDialog.onBeforeMoveChange,
                        cIndex: i,
                    });
                    this.buttonIds.push(buttonId);
                }
                html += "</div>";

                this.dialog = document.createElement("div");  //创建显示控件
                this.dialog.id = "gid_common_edit_dialog";
                this.dialog.innerHTML = html;
                LMEPG.CssManager.addClass(this.dialog, "g_common_input_dialog_v1");
                var body = document.body;
                body.appendChild(this.dialog);

                LMEPG.KEM.setAllowFlag(false);
                gid_bg_common_edit_dialog.onload = function () {
                    console.log("removeChild:imgLoad......");
                    for (var i = 0; i < buttonText.length; i++) {
                        var tempTextId = "gid_common_edit_dialog_button_" + i + "_text";
                        document.getElementById(tempTextId).innerHTML = buttonText[i];
                    }
                    document.getElementById("gid_common_edit_dialog_message").innerHTML = message;
                    document.getElementById("gid_common_edit_dialog_input").style.display = "inline";
                    setTimeout(function () {
                        LMEPG.KEM.setAllowFlag(true);
                        LMEPG.BM.addButtons(buttons);
                        if(isShowInput){
                            LMEPG.BM.requestFocus("gid_common_edit_dialog_input");
                            LMEPG.BM.performClick();
                        }else if (buttonText.length > 0) {
                            LMEPG.BM.requestFocus(is_empty(inputDefault) ? "gid_common_edit_dialog_input" : "gid_common_edit_dialog_button_0");
                        }
                        LMEPG.KEM.addKeyEvent("KEY_BACK", LMEPG.UI.commonEditDialog.onInnerBack);
                    }, 1000);
                }


                // this._isShowing = false;
            },
            remove: function () {
                this._isShowing = false;
                console.log("removeChild:start");
                if (this.dialog) {
                    document.body.removeChild(document.getElementById("gid_common_edit_dialog"));
                    console.log("removeChild:" + this.dialog);
                }
            },
            onBeforeMoveChange: function (dir, btn) {
                if (btn.id !== "gid_common_edit_dialog_input") {
                    // 修复问题：当从“按钮1”右移到“按钮2”，<input/>标签会自动显示光标！
                    if ((dir === "left" && !is_empty(btn.nextFocusLeft))
                        || (dir === "right" && !is_empty(btn.nextFocusRight))) {
                        var domInput = G("gid_common_edit_dialog_input");
                        domInput.disabled = true;
                        domInput.blur();
                    }
                }
            },

            onFocusChanged: function (btn, hasFocus) {
                var imgVersion = "";
                switch (RenderParam.carrierId) {
                    case CARRIER_ID_GANSUYD:
                    case CARRIER_ID_QINGHAIYD:
                        imgVersion = "v2";
                        break;
                    default:
                        imgVersion = "v1";
                        break;
                }
                if (btn.id === "gid_common_edit_dialog_input" || btn.id === "gid_common_verify_dialog_input") {
                    var domInput = G(btn.id);
                    if (hasFocus) {
                        LMEPG.CssManager.removeClass(domInput, "g_common_input_dialog_message_border_unfocus_v1");
                        LMEPG.CssManager.addClass(domInput, "g_common_input_message_border_focus_" + imgVersion);
                        domInput.disabled = false;
                        // domInput.focus(); // TODO，注意：focus()放在moveCursorTo方法中，否则光标会默认先到开头位置，有移动的差体验
                        setTimeout(function () {
                            LMEPG.UI.commonEditDialog.moveCursorTo(domInput, domInput.value.length);
                        });
                    } else {
                        LMEPG.CssManager.removeClass(domInput, "g_common_input_message_border_focus_" + imgVersion);
                        LMEPG.CssManager.addClass(domInput, "g_common_input_dialog_message_border_unfocus_v1");
                        domInput.disabled = true;
                        domInput.blur();
                    }
                }
            },

            // 设置光标位置并捕获焦点
            moveCursorTo: function (inputDom, pos) {
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

            // 获取光标位置
            getCursorPosition: function (inputDom) {
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

            onInputContentChanged: function (inputDom) {
                var value = inputDom.value;
                var cursorPos = LMEPG.UI.commonEditDialog.getCursorPosition(inputDom);
                var charAheadOfCursorPos = cursorPos - 1; // 光标前紧相邻的字符位置
                var charAheadOfCursor = value.substr(charAheadOfCursorPos, 1); // 光标前紧相邻的字符

                if (inputDom.type === "tel") {
                    var isNumber = /^[0-9]*$/.test(charAheadOfCursor);
                    var isExceedLength = value.length > 11;
                    if (!isNumber || isExceedLength) {
                        if (isExceedLength) LMEPG.UI.showAndroidToast("手机号长度限制11位");
                        else LMEPG.UI.showAndroidToast("请输入数字：0-9");

                        var strPart1 = value.substring(0, charAheadOfCursorPos);
                        var strPart2 = value.substring(charAheadOfCursorPos + 1);
                        inputDom.value = strPart1 + strPart2; //删除不合法的字符
                        LMEPG.UI.commonEditDialog.moveCursorTo(inputDom, cursorPos - 1);
                    }
                }
            },

            close: function () {
                LMEPG.BM.deleteButtons(LMEPG.UI.commonEditDialog.buttonIds);
                if (LMEPG.UI.commonEditDialog.mainButton)
                    LMEPG.BM.requestFocus(LMEPG.UI.commonEditDialog.mainButton.id);
                LMEPG.UI.commonEditDialog.dialog.innerHTML = "";
                H('gid_common_edit_dialog');
                this._isShowing = false;
                console.log("removeChild:close:");
            },

            onClick: function (btn) {
                console.log("removeChild:onClick");
                var inputValue = G('gid_common_edit_dialog_input').value;
                var handled = LMEPG.call(LMEPG.UI.commonEditDialog._clickCallBack, [btn.cIndex, inputValue]);
                if (typeof handled === 'undefined' || !handled) {
                    LMEPG.UI.commonEditDialog.close();
                    LMEPG.KEM.addKeyEvent('KEY_BACK', 'onBack()');
                }
            },

            onInnerBack: function () {
                var handled = LMEPG.call(LMEPG.UI.commonEditDialog._clickCallBack, [-1]);
                if (typeof handled === 'undefined' || !handled) {
                    LMEPG.UI.commonEditDialog.close();
                    LMEPG.KEM.addKeyEvent('KEY_BACK', 'onBack()');
                }
            },
        },


        /**
         * 通用输入短信验证框
         * 通过show方式进行调用，
         * 列入：show("未检测到摄像头，请插入摄像头后问医，或者留下您的联系方式，通过电话问医。", ['是', '否'], function(id){})
         */
        commonVerifyDialog: {
            MAX_BUTTON_NUM: 2,
            buttonIds: [],
            mainButton: null,
            dialog: null,
            _clickCallBack: LMEPG.emptyFunc,
            _isShowing: false,
            MAX_TIMES: 60,
            count: 0,
            timer1: "",

            /**
             * 显示通用输入对话框。
             *
             * <pre>使用示例：
             *      LMEPG.UI.commonEditDialog(
             *              '未检测到摄像头，请插入摄像头后问医，或者留下您的联系方式，通过电话问医。',
             *              ['是', '否'],
             *              function(btnIndex, inputValue) {},
             *              ['输入label提示：', '默认输入框文本', '输入框hint文本', '限制类型[tel|text|password|...]']
             *     );
             * </pre>
             */
            show: function (message, buttonText, onCallback, extraInputMessages) {
                var imgVersion = "";
                switch (RenderParam.carrierId) {
                    case "620007":
                        imgVersion = "V2";
                        break;
                    default:
                        imgVersion = "V1";
                        break;
                }
                console.log("removeChild:show");
                this._isShowing = true;
                if (!this._isShowing) {
                    console.log("removeChild:_isShowing");
                    return;
                }
                if (document.getElementById("gid_common_edit_dialog")) {
                    document.body.removeChild(document.getElementById("gid_common_edit_dialog"));
                }

                this.mainButton = LMEPG.BM.getCurrentButton();
                this._clickCallBack = onCallback;

                if (typeof(buttonText) === "string") buttonText = [buttonText];
                if (!LMEPG.Func.isArray(buttonText)) return; // 参数出错

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
                html += '<img id="gid_bg_common_edit_dialog" src="' + ROOT + '/Public/img/Common/V8/g_common_Verify_img_bg_v1.png" class="g_common_Verify_img_bg_v1"/>';
                html += '<div id="gid_common_edit_dialog_message" class="g_common_input_verify_message_text_v1">' + "" + '</div>';
                html += '<div id="gid_common_edit_dialog_label" class="gid_common_edit_dialog_label">手机号码</div>';
                html += '<input style="display: none" id="gid_common_edit_dialog_input" class="g_common_input_dialog_verify_v1"' +
                    ' type="' + inputType + '"' +
                    ' value="' + inputDefault + '"' +
                    'disabled="true"' +
                    ' placeholder="' + inputHint + '"' +
                    ' oninput="LMEPG.UI.commonEditDialog.onInputContentChanged(this);"/>';
                html += '<div id="gid_common_verify_dialog_label" class="gid_common_verify_dialog_label">验证码</div>';
                html += '<input id="gid_common_verify_dialog_input" class="gid_common_verify_dialog_input"' +
                    ' type="text"' +
                    ' value="' + inputDefault + '"' +
                    'disabled="true"' +
                    ' placeholder="获取验证码"/>';
                html += '<div class="g_common_input_btn_v1">';
                var buttons = [];
                buttons.push({
                    id: "gid_common_edit_dialog_input",
                    name: "输入模式",
                    type: "img",
                    nextFocusDown: "gid_common_verify_dialog_input",
                    focusChange: LMEPG.UI.commonEditDialog.onFocusChanged,
                });
                buttons.push({
                    id: "gid_common_verify_dialog_input",
                    name: "输入模式",
                    type: "img",
                    nextFocusUp: "gid_common_edit_dialog_input",
                    nextFocusDown: "gid_common_verify_dialog_button_1",
                    nextFocusRight: "gid_common_verify_dialog_button_0",
                    focusChange: LMEPG.UI.commonEditDialog.onFocusChanged,
                });
                for (var i = 0; i < buttonText.length; i++) {
                    if (i > 1) break;  //目前只支持两个按钮
                    if (i === 0) html += '<div class="g_common_input_btn_border_v1">';
                    else html += '<div class="g_common_input_btn_border_v1 g_common_input_btn_interval_v1">';

                    html += '<img id="gid_common_verify_dialog_button_' + i + '"' + ' src="' + ROOT + '/Public/img/Common/input/' + imgVersion + '/f_r_btn.png" class="g_common_input_btn_img_v1"/>';
                    html += '<div id="gid_common_verify_dialog_button_' + i + '_text"' + ' class="g_common_input_text_v1">';

                    html += '</div>';
                    html += '</div>';
                }
                var buttonId = 'gid_common_verify_dialog_button_';
                buttons.push({
                    id: buttonId + "0",
                    name: "按钮" + 1,
                    type: "img",
                    nextFocusLeft: "gid_common_verify_dialog_input",
                    nextFocusRight: "",
                    nextFocusUp: "gid_common_edit_dialog_input",
                    nextFocusDown: buttonId + "1",
                    backgroundImage: "",
                    focusImage: ROOT + "/Public/img/Common/input/" + imgVersion + "/f_btn.png",
                    click: LMEPG.UI.commonVerifyDialog.onClick,
                    beforeMoveChange: LMEPG.UI.commonVerifyDialog.onBeforeMoveChange,
                    cIndex: 0,
                });
                buttons.push({
                    id: buttonId + "1",
                    name: "按钮" + i,
                    type: "img",
                    nextFocusUp: "gid_common_verify_dialog_input",
                    backgroundImage: ROOT + "/Public/img/Common/input/" + imgVersion + "/f_r_btn.png",
                    focusImage: ROOT + "/Public/img/Common/input/" + imgVersion + "/f_btn.png",
                    click: LMEPG.UI.commonVerifyDialog.onClick,
                    beforeMoveChange: LMEPG.UI.commonVerifyDialog.onBeforeMoveChange,
                    cIndex: 1,
                });
                this.buttonIds.push(buttonId);
                html += "</div>";

                this.dialog = document.createElement("div");  //创建显示控件
                this.dialog.id = "gid_common_edit_dialog";
                this.dialog.innerHTML = html;
                LMEPG.CssManager.addClass(this.dialog, "g_common_input_dialog_v1");
                var body = document.body;
                body.appendChild(this.dialog);

                LMEPG.KEM.setAllowFlag(false);
                gid_bg_common_edit_dialog.onload = function () {
                    console.log("removeChild:imgLoad......");
                    for (var i = 0; i < buttonText.length; i++) {
                        var tempTextId = "gid_common_verify_dialog_button_" + i + "_text";
                        document.getElementById(tempTextId).innerHTML = buttonText[i];
                    }
                    document.getElementById("gid_common_edit_dialog_message").innerHTML = message;
                    document.getElementById("gid_common_edit_dialog_input").style.display = "inline";
                    setTimeout(function () {
                        LMEPG.KEM.setAllowFlag(true);
                        LMEPG.BM.addButtons(buttons);
                        if (buttonText.length > 0) {
                            LMEPG.BM.requestFocus(is_empty(inputDefault) ? "gid_common_edit_dialog_input" : "gid_common_edit_dialog_button_0");
                        }
                        LMEPG.KEM.addKeyEvent("KEY_BACK", LMEPG.UI.commonVerifyDialog.onInnerBack);
                    }, 1000);
                }


                // this._isShowing = false;
            },

            timer: function () {
                if (LMEPG.UI.commonVerifyDialog.count === -1) {
                    G("gid_common_verify_dialog_button_0_text").innerHTML = "获取验证码";
                    clearTimeout(LMEPG.UI.commonVerifyDialog.timer1);
                    LMEPG.ButtonManager.getButtonById("gid_common_verify_dialog_button_0").focusable = true;

                } else {
                    LMEPG.ButtonManager.getButtonById("gid_common_verify_dialog_button_0").focusable = false;
                    G("gid_common_verify_dialog_button_0_text").innerHTML = LMEPG.UI.commonVerifyDialog.count + '';
                    LMEPG.UI.commonVerifyDialog.count--;
                    LMEPG.UI.commonVerifyDialog.timer1 = setTimeout(function () {
                        LMEPG.UI.commonVerifyDialog.timer();
                    }, 1000)
                }
            },
            remove: function () {
                this._isShowing = false;
                console.log("removeChild:start");
                if (this.dialog) {
                    document.body.removeChild(document.getElementById("gid_common_edit_dialog"));
                    console.log("removeChild:" + this.dialog);
                }
            },
            onBeforeMoveChange: function (dir, btn) {
                if (btn.id !== "gid_common_edit_dialog_input") {
                    // 修复问题：当从“按钮1”右移到“按钮2”，<input/>标签会自动显示光标！
                    if ((dir === "left" && !is_empty(btn.nextFocusLeft))
                        || (dir === "right" && !is_empty(btn.nextFocusRight))) {
                        var domInput = G("gid_common_edit_dialog_input");
                        domInput.disabled = true;
                        domInput.blur();
                    }
                }
            },

            onFocusChanged: function (btn, hasFocus) {
                var imgVersion = "";
                switch (RenderParam.carrierId) {
                    case "620007":
                        imgVersion = "v2";
                        break;
                    default:
                        imgVersion = "v1";
                        break;
                }
                if (btn.id === "gid_common_edit_dialog_input") {
                    var domInput = G(btn.id);
                    if (hasFocus) {
                        LMEPG.CssManager.removeClass(domInput, "g_common_input_dialog_message_border_unfocus_v1");
                        LMEPG.CssManager.addClass(domInput, "g_common_input_message_border_focus_" + imgVersion);
                        domInput.disabled = false;
                        // domInput.focus(); // TODO，注意：focus()放在moveCursorTo方法中，否则光标会默认先到开头位置，有移动的差体验
                        setTimeout(function () {
                            LMEPG.UI.commonEditDialog.moveCursorTo(domInput, domInput.value.length);
                        });
                    } else {
                        LMEPG.CssManager.removeClass(domInput, "g_common_input_message_border_focus_" + imgVersion);
                        LMEPG.CssManager.addClass(domInput, "g_common_input_dialog_message_border_unfocus_v1");
                        domInput.disabled = true;
                        domInput.blur();
                    }
                }
            },

            // 设置光标位置并捕获焦点
            moveCursorTo: function (inputDom, pos) {
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

            // 获取光标位置
            getCursorPosition: function (inputDom) {
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

            onInputContentChanged: function (inputDom) {
                var value = inputDom.value;
                var cursorPos = LMEPG.UI.commonVerifyDialog.getCursorPosition(inputDom);
                var charAheadOfCursorPos = cursorPos - 1; // 光标前紧相邻的字符位置
                var charAheadOfCursor = value.substr(charAheadOfCursorPos, 1); // 光标前紧相邻的字符

                if (inputDom.type === "tel") {
                    var isNumber = /^[0-9]*$/.test(charAheadOfCursor);
                    var isExceedLength = value.length > 11;
                    if (!isNumber || isExceedLength) {
                        if (isExceedLength) LMEPG.UI.showAndroidToast("手机号长度限制11位");
                        else LMEPG.UI.showAndroidToast("请输入数字：0-9");

                        var strPart1 = value.substring(0, charAheadOfCursorPos);
                        var strPart2 = value.substring(charAheadOfCursorPos + 1);
                        inputDom.value = strPart1 + strPart2; //删除不合法的字符
                        LMEPG.UI.commonVerifyDialog.moveCursorTo(inputDom, cursorPos - 1);
                    }
                }
            },

            close: function () {
                LMEPG.BM.deleteButtons(LMEPG.UI.commonEditDialog.buttonIds);
                if (LMEPG.UI.commonEditDialog.mainButton)
                    LMEPG.BM.requestFocus(LMEPG.UI.commonEditDialog.mainButton.id);
                LMEPG.UI.commonVerifyDialog.dialog.innerHTML = "";
                H('gid_common_edit_dialog');
                this._isShowing = false;
                console.log("removeChild:close:");
            },

            onClick: function (btn) {
                console.log("removeChild:onClick");
                var inputValue = G('gid_common_edit_dialog_input').value;
                if (btn.id == "gid_common_verify_dialog_button_0") {
                    LMEPG.UI.commonVerifyDialog.count = LMEPG.UI.commonVerifyDialog.MAX_TIMES;
                    LMEPG.ButtonManager.requestFocus("gid_common_verify_dialog_input");
                } else if (btn.id == "gid_common_verify_dialog_button_1") {
                    var isNumber = /^[0-9]*$/.test(G("gid_common_verify_dialog_input").value);
                    if (!isNumber) {
                        if (isExceedLength) LMEPG.UI.showAndroidToast("验证码格式错误");
                        return;
                    }
                }
                var handled = LMEPG.call(LMEPG.UI.commonVerifyDialog._clickCallBack, [btn.cIndex, inputValue]);
                if (typeof handled === 'undefined' || !handled) {
                    LMEPG.UI.commonVerifyDialog.close();
                    LMEPG.KEM.addKeyEvent('KEY_BACK', 'onBack()');
                }
            },

            onInnerBack: function () {
                var handled = LMEPG.call(LMEPG.UI.commonEditDialog._clickCallBack, [-1]);
                if (typeof handled === 'undefined' || !handled) {
                    LMEPG.UI.commonVerifyDialog.close();
                    LMEPG.KEM.addKeyEvent('KEY_BACK', 'onBack()');
                }
            },
        },


        // 设置光标位置并捕获焦点
        moveCursorTo: function (inputDom, pos) {
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

        // 获取光标位置
        getCursorPosition: function (inputDom) {
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
         * 显示系统消息
         */
        showMessage: function (msg, second) {
            second = !second ? 5000 : second;
            var messageBox = G('gid_message');
            if (!messageBox) {
                messageBox = document.createElement("div");  //创建显示控件
                messageBox.id = "gid_message";
                LMEPG.CssManager.addClass(messageBox, "g_message");
                var body = document.body;
                body.appendChild(messageBox);
            }
            messageBox.innerHTML = msg;

            var top = -60;
            //LMEPG.Marquee.stop();
            //LMEPG.Marquee.start(messageBox.id, 4, 5, 50, "left", "scroll");
            function _showMessage() {
                if (top <= 0) {
                    messageBox.style.top = top + "px";
                    top = (top + 5);
                } else {
                    return;
                }
                setTimeout(_showMessage, 30);
            }

            function _hideMessage() {
                if (top >= -80) {
                    messageBox.style.top = top + "px";
                    top = top - 5;
                } else {
                    //LMEPG.Marquee.stop();
                    return;
                }
                setTimeout(_hideMessage, 30);
            }

            _showMessage();
            setTimeout(_hideMessage, second);
        }
    }


})();
