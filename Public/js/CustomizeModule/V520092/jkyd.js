var Page = {
    data: {
        // 页面所有焦点
        pageButtons: {},
        //    当前焦点
        currentFocus: "1-0"
    },
    init: function () {
        Page.setPageBackgroundImage();
        Page.createHtml();
        Page.initPageButtons();
        Page.initPageFocus();
        Page.addPageKeyListen();
    },
    /**
     * 添加页面监听函数
     */
    addPageKeyListen: function () {
        window.onkeydown = function () {
            Page.onKeyDownFun();
        }
    },
    /**
     * 按键按下抬起事件
     */
    onKeyDownFun: function () {
        var keyCodeStr = Page.getKeyCodeStr(window.event.keyCode);
        LMEPG.Log.error("columnHome keyCodeStr:"+keyCodeStr);
        ["upper", "lower", "left", "right"].indexOf(keyCodeStr) >= 0 && Page.updateFocusCss(keyCodeStr);
        ["enter"].indexOf(keyCodeStr) >= 0 && Page.focusClickFun();
        ["backspace"].indexOf(keyCodeStr) >= 0 && Page.navigationBack();
    },
    /**
     * TODO:页面返回
     */
    navigationBack:function (){
        var item = Page.data.currentFocus;
        if (parseInt(item.split('-')[0]) > 1) {
            Page.data.currentFocus = "1-0";
            document.getElementById("P" + Page.data.currentFocus) ? Page.initPageFocusAfter() : Page.initPageFocus();
            return;
        }
        LMEPG.Intent.back('IPTVPortal');
    },
    /**
     * 焦点点击事件
     */
    focusClickFun: function () {
        var position = "P" + Page.data.currentFocus.split("-")[0];
        var index = Page.data.currentFocus.split("-")[1];
        var item = RenderParam.moduleConfig.entry_list[position].item_data[index];
        Page.jumpPage(item);
    },
    /**
     * TODO:页面跳转
     * @param url
     */
    jumpPage:function (res){
        res.entry_type == moduleCommon.EntryType.HEALTH_VIDEO && moduleCommon.jumpPlayVideo(moduleCommon.ModuleId.JKYD,res);
        res.entry_type == moduleCommon.EntryType.HEALTH_VIDEO_BY_TYPES && moduleCommon.jumpVideoList(moduleCommon.ModuleId.JKYD,res);
        res.entry_type == moduleCommon.EntryType.HEALTH_VIDEO_SET && moduleCommon.jumpVideoSet(moduleCommon.ModuleId.JKYD,res);
    },
    /**
     * TODO:构建跳转链接
     * @param res
     * @returns {string}
     */
    buildJumpPageUrl:function (res){
        console.log("构建跳转链接 -- item",res)
        return "";
    },
    /**
     * 获取按键对应str字符
     * @param keyCode
     * @returns {string}
     */
    getKeyCodeStr: function (keyCode) {
        return {
            "38": "upper",
            "40": "lower",
            "37": "left",
            "39": "right",
            "13": "enter",
            "8": "backspace"
        }["" + keyCode] || "";
    },
    /**
     * 更新焦点css
     * @param keyStr
     */
    updateFocusCss: function (keyStr) {
        var nextFocus = Page.data.pageButtons["P" + Page.data.currentFocus][keyStr];
        if (nextFocus) {
            document.getElementById("P" + nextFocus).classList.add("focus");
            document.getElementById("P" + Page.data.currentFocus).classList.remove("focus");
            Page.containerMarginTop(nextFocus);
            Page.data.currentFocus = nextFocus;
        }
    },
    /**
     * 计算页面焦点到顶部距离
     * @param nextFocus
     * @returns {number}
     */
    containerMarginTop: function (nextFocus) {
        var result = 0;
        /^(1)-\d+$/gi.test(nextFocus) && (result = -360 * 0);
        /^(2)-\d+$/gi.test(nextFocus) && (result = -360 * 1.9);
        /^(3)-\d+$/gi.test(nextFocus) && (result = -360 * 3.4);
        document.getElementById("container").style.marginTop = result + "px";
    },
    /**
     * 初始化页面焦点
     */
    initPageFocus: function () {
        setTimeout(function () {
            var focusId = moduleCommon.getFocusIdFromUrl();
            Page.data.currentFocus = focusId ? focusId : "1-0";
            document.getElementById("P" + Page.data.currentFocus) ? Page.initPageFocusAfter() : Page.initPageFocus();
        }, 500);
    },
    /**
     * 初始化页面焦点 - after 处理数据
     */
    initPageFocusAfter:function (){
        document.getElementById("P" + Page.data.currentFocus).classList.add("focus");
        Page.containerMarginTop(Page.data.currentFocus);
    },
    /**
     * 初始化页面焦点
     */
    initPageButtons: function () {
        Page.data.pageButtons = {
            "P1-0": Page.buildButtonItem("P1-0", "", "1-3", "", "1-1"),
            "P1-1": Page.buildButtonItem("P1-1", "", "1-4", "1-0", "1-2"),
            "P1-2": Page.buildButtonItem("P1-2", "", "1-5", "1-1", "1-3"),
            "P1-3": Page.buildButtonItem("P1-3", "1-0", "2-0", "1-2", "1-4"),
            "P1-4": Page.buildButtonItem("P1-4", "1-1", "2-0", "1-3", "1-5"),
            "P1-5": Page.buildButtonItem("P1-5", "1-2", "2-0", "1-4", "2-0"),

            "P2-0": Page.buildButtonItem("P2-0", "1-3", "2-2", "1-5", "2-1"),
            "P2-1": Page.buildButtonItem("P2-1", "1-3", "2-4", "2-0", "2-2"),
            "P2-2": Page.buildButtonItem("P2-2", "2-0", "3-0", "2-1", "2-3"),
            "P2-3": Page.buildButtonItem("P2-3", "2-0", "3-0", "2-2", "2-4"),
            "P2-4": Page.buildButtonItem("P2-4", "2-1", "3-0", "2-3", "2-5"),
            "P2-5": Page.buildButtonItem("P2-5", "2-1", "3-0", "2-4", "2-6"),
            "P2-6": Page.buildButtonItem("P2-6", "2-1", "3-0", "2-5", "3-0"),

            "P3-0": Page.buildButtonItem("P3-0", "2-2", "", "2-5", "3-1"),
            "P3-1": Page.buildButtonItem("P3-1", "2-2", "", "3-0", "3-2"),
            "P3-2": Page.buildButtonItem("P3-2", "2-2", "", "3-1", ""),
        }
    },
    /**
     * 构建焦点
     * @param id
     * @param upper
     * @param lower
     * @param left
     * @param right
     * @returns {{left, upper, lower, id, right}}
     */
    buildButtonItem: function (id, upper, lower, left, right) {
        return {
            "id": id,
            "upper": upper,
            "lower": lower,
            "left": left,
            "right": right
        }
    },
    /**
     * 创建页面元素
     */
    createHtml: function () {
        for (var key in RenderParam.moduleConfig.entry_list) {
            document.getElementById(key).innerHTML = Page.buildPostionHtml(key, RenderParam.moduleConfig.entry_list[key].item_data);
        }
    },
    /**
     * 构建推荐位元素
     * @param key
     * @param list
     * @returns {string}
     */
    buildPostionHtml: function (key, list) {
        var result = "";
        for (var i = 0; i < list.length; i++) {
            result += Page.buildElHtmlImage(key, i, list[i]);
        }
        return result;
    },
    /**
     * 构建页面元素image
     * @param position
     * @param index
     * @param res
     * @returns {string}
     */
    buildElHtmlImage: function (key, index, res) {
        var id = key + "-" + index;
        var src = RenderParam.fsUrl + JSON.parse(res.img_url).normal;
        return '<img class="item" id="' + id + '" src="' + src + '" alt="' + src + '">';
    },
    /**
     * 设置页面背景图片
     */
    setPageBackgroundImage: function () {
        document.body.style.backgroundImage = 'url(' + RenderParam.fsUrl + RenderParam.moduleConfig.bg_img.gq_img_url + ')';
    },
}