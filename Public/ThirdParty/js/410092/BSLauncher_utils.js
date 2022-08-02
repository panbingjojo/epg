/**
 * Created by zhangwei on 9/21/16.
 */


var HybirdCallBackInterface = {

    TAG_WEB_showPage: "tag_web_showpage",
    TAG_WEB_showErrorInfo: "tag_web_showErrorInfo",
    TAG_WEB_jumpWebUrl: "tag_web_jumpWebUrl",
    TAG_WEB_openLocalActiviy: "tag_web_openLocalActivit",
    TAG_WEB_quitActivity: "tag_web_quitActivity",
    TAG_WEB_appOpenOrDownload: "tag_web_appOpenOrDownload",
    TAG_WEB_openBST: "tag_web_openBST",
    TAG_OEPN_URL_TYPE_VOD: "vod",
    TAG_OEPN_URL_TYPE_WEB: "web",
    TAG_OEPN_URL_TYPE_OTHER_PAGE: "other_web_page",

    TAG_WEB_test: "tag_web_test",

    isAndroid: null,
    callFunc: null,

    setCallFunction: function (_callFunc) {
        this.callFunc = _callFunc;
    },

    callByJava: function (params) {
        if (this.callFunc != null) {
            this.callFunc(JSON.parse(params));
        }
    },

    //jsCallJava方法  浏览器相关方法
    jumpLocalActivity: function (packetName) {
        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_openLocalActiviy;
            item.param = {};
            item.param.packName = packetName;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        } else {
            console.log("不是移动终端，不支持跳转本地包名应用packetName:" + packetName)
        }
    },

    jumpTest: function () {
        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_test;
            item.param = {};
//            item.param.dramaId = dramaId;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        } else {
            console.log("不是移动终端，不支持getTotalTime方法");
        }
    },


    /**
     *  nextPage:为了华数而加
     */
    jumpWebActivity: function (url, isNeedKeyCode, nextPage) {
        console.log("pageLoad_start:" + TimeUtil.getMH());

        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_jumpWebUrl;
            item.param = {};
            item.param.url = url;
            item.param.isNeedKeyCode = isNeedKeyCode;
            item.param.openType = this.TAG_OEPN_URL_TYPE_WEB;
            item.param.nextPage = nextPage;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
            shwoDebugTime("jumpWebActivity");
        } else {
            console.log("不是移动终端，直接打开url:" + url);
            window.location.href = url;
            shwoDebugTime("jumpWebActivity");
        }
    },

    /**
     *  跳转到带有多媒体的页面
     *  nextPage:为了华数而加
     */
    jumpMediaActivity: function (url, isNeedKeyCode, nextPage) {
        console.log("pageLoad_start:" + TimeUtil.getMH());

        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_jumpWebUrl;
            item.param = {};
            item.param.url = url;
            item.param.isNeedKeyCode = isNeedKeyCode;
            item.param.openType = this.TAG_OEPN_URL_TYPE_OTHER_PAGE;
            item.param.nextPage = nextPage;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
            shwoDebugTime("jumpWebActivity");
        } else {
            console.log("不是移动终端，直接打开url:" + url);
            window.location.href = url;
            shwoDebugTime("jumpWebActivity");
        }
    },

    jumpWebUrlWithVod: function (url, isNeedKeyCode, playUrl, dramaId, dramaPid, isQuene, provider) {
        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_jumpWebUrl;
            item.param = {};
            item.param.url = url;
            item.param.isNeedKeyCode = isNeedKeyCode;
            item.param.openType = this.TAG_OEPN_URL_TYPE_VOD;
            item.param.playUrl = playUrl;
            item.param.dramaId = dramaId;
            item.param.dramaPid = dramaPid;
            item.param.isQuene = isQuene;
            item.param.provider = provider;
            //item.param.playUrl = "http://115.28.143.175/sjiptv/mp4/wangyinyang01.MP4"; ////////
            //console.log(">>>>>>>测试 写死播放地址: " + item.param.playUrl);
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        } else {
            console.log("不是移动终端，直接打开url:" + url);
            window.location.href = url;
        }
    },

    saveDataInLocal: function (key, value) {
        if (window.bfWebCallBack) {
            window.bfWebCallBack.saveLocalData(key, value);
            console.log("====已经保存数据,key:" + key + ", value:" + this.getDataInLocal(key));
        }
    },

    getDataInLocal: function (key) {
        if (window.bfWebCallBack) {
            console.log("====获取保存数据,key:" + key);
            return window.bfWebCallBack.getLocalData(key);
        }
        return ""
    },

    //合并href链接和参数, arguments为object对象, combineURLAndParameters("www.baidu.com", {id:3,title:"list"}) 返回www.baidu.com?id=3&title=list
    combineURLAndParameters: function (href, arguments) {

        var returnURL = href;
        var argumentStr = "";
        for (var key in arguments) {
            argumentStr = argumentStr + "&" + key + "=" + arguments[key];
        }
        if (returnURL.indexOf("?") == -1) {
            argumentStr = argumentStr.substr(1, argumentStr.length - 1);
            argumentStr = "?" + argumentStr;
        }

        return returnURL + argumentStr;

    },

    getRequestParam: function (url) {
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substring(url.indexOf("?") + 1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },

    quitActivity: function (info) {

        //info = "{'respCode':'0','respMsg':'成功'}";
        //
        //if(info !== undefined){
        //    var obj = eval("(" + info + ")")
        //    console.log(obj.respCode);
        //}


        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_quitActivity;

            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        } else {
            console.log("不是移动终端，quitActivity方法");
        }
    },

    showErrorInfo: function (info) {
        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_showErrorInfo;
            item.info = info;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        } else {
            Toast.show(info);
            console.log("不是移动终端，showErrorInfo方法");
        }
    },

    showPage: function () {

        console.log("pageLoad_end:" + TimeUtil.getMH());
        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_showPage;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
            shwoDebugTime("showPage");
        } else {
            console.log("不是移动终端，不支持showPage方法");
        }
    },

    appOpenOrDownload: function (downUrl, packName, appName) {
        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_appOpenOrDownload;
            item.param = {};
            item.param.downUrl = downUrl;
            item.param.packName = packName;
            item.param.appName = appName;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        } else {
            console.log("不是移动终端，appOpenOrDownload");
        }
    },
    appOpenOrDownloadWidthParam: function (downUrl, packName, appName, linkParam) {
        if (this.isAndroidDevice()) {
            var item = {};
            item.tag = this.TAG_WEB_appOpenOrDownload;
            item.param = {};
            item.param.downUrl = downUrl;
            item.param.packName = packName;
            item.param.appName = appName;
            item.param.linkParam = linkParam
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        } else {
            console.log("不是移动终端，appOpenOrDownload");
        }
    },

    isAndroidDevice: function () {
        if (this.isAndroid == null) {
            this.isAndroid = browser.versions.android;
        }

        console.log("xxxxdevice is android:" + this.isAndroid)
        return this.isAndroid;
    }
};


var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),

    //获得工程路径
    getProjectUrl: function () {

        var pathName = window.location.pathname;
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 2);
        var urlPre = window.location.host;
        if (urlPre.substring(0, 4) != "http") {
            urlPre = "http://" + urlPre;
        }

        var jumpUrl = urlPre + projectName;

        console.log("jumpUrl:" + jumpUrl);

        //return "file:///Users/aijun/Documents/BSLaunchSub/";
        return jumpUrl;
    },


    getJumpUrl: function (path, privider) {
        var jumpUrl = "";
        var preUrl = this.getProjectUrl();
        var theRequest = ajaxAsyncReq.getRequestParam(location.search);
        mac = theRequest.mac;
        groupId = theRequest.groupId;
        itvAcount = theRequest.itvAcount;
        if (privider != "") {
            providerId = privider;
        } else {
            providerId = theRequest.providerId;
        }
        operators = theRequest.operators;

        jumpUrl = preUrl + path + "?mac=" + mac + "&groupId=" + groupId + "&itvAcount=" + itvAcount + "&providerId=" + providerId + "&operators=" + operators;

        console.log("jumpUrl:" + jumpUrl)

        return jumpUrl;
    },

    //跳转支付页面
    jumpPayOrder: function (subParam) {
        var href = null;
        href = this.getJumpUrl("htmls/vod/PayOrder.html", "");
        if (subParam != undefined || subParam != null) {
            href = href + subParam;
        }
        HybirdCallBackInterface.jumpWebActivity(href, false);
    },
    //跳转支付页面
    jumpPayOrderCP: function (subParam, cprivider) {
        var href = null;
        href = this.getJumpUrl("htmls/vod/PayOrderCP.html", cprivider);
        if (subParam != undefined || subParam != null) {
            href = href + subParam;
        }
        HybirdCallBackInterface.jumpWebActivity(href, false);
    },
};

var TimeUtil = {

    changeSecondToHMS: function (argSecond) {
        console.log("argSecond=" + argSecond);

        var hour = Math.floor(argSecond / (60 * 60));
        var minute = Math.floor((argSecond - hour * (60 * 60)) / (60));
        var second = (argSecond - hour * (60 * 60) - minute * 60);

        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
        console.log(hour);
        console.log(minute);
        console.log(second);

        var hms = hour + ":" + minute + ":" + second;
        console.log(hms);
        return hms;
    },

    getSecond: function () {
        var today = new Date();
        return today.getSeconds();
    },

    getMH: function () {
        var today = new Date();
        return today.getMinutes() + ":" + today.getSeconds();
    }
};

String.prototype.textWidth = function (font) {
    var f = font || '12px arial',
        o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
        w = o.width();

    o.remove();
    return w;
};

/**
 * 日期格式化工具
 * @param fmt {string} : 字符串格式化样式,类似yyyy-MM-dd
 * @returns {string} : 返回date格式化后的字符串
 * @constructor
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};





