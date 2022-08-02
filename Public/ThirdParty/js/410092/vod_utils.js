/**
 * Created by zhangwei on 9/21/16.
 */


var HybirdCallBackInterface = {

    TAG_WEB_showPage : "tag_web_showpage",
    TAG_WEB_showErrorInfo : "tag_web_showErrorInfo",
    TAG_WEB_openLocalActiviy : "tag_web_openLocalActivit",
    TAG_WEB_appOpenOrDownload : "tag_web_appOpenOrDownload",
    TAG_WEB_jumpWebUrl : "tag_web_jumpWebUrl",
    TAG_WEB_quitActivity : "tag_web_quitActivity",
    TAG_WEB_getSaveLiveChannelData : "tag_web_getSaveLiveChannelData",
    TAG_WEB_getMainMarquee : "tag_web_getMainMarquee",
    TAG_WEB_openBST : "tag_web_openBST",
    TAG_OEPN_URL_TYPE_VOD : "vod",
    TAG_OEPN_URL_TYPE_WEB : "web",
    TAG_OEPN_URL_TYPE_OTHER_PAGE:"other_web_page",
    //点播播放数据发送给C端
    TAG_SEND_VOD_PLAY_DATA : "tag_send_vod_play_data",

    TAG_WEB_test : "tag_web_test",

    ACTION_PLAY_HISTORY_FUN: "ACTION_PLAY_HISTORY_FUN",
    ACTION_PLAY_HISTORY_EDUCATION: "ACTION_PLAY_HISTORY_EDUCATION",

    EVENT_PLAY_PRE: "vodPreprePlay",
    EVENT_PLAY_ERROR: "playError",
    EVENT_PLAY_END: "playEnd",
    EVENT_KEYBOARD_BACK: "keybackEvent",
    EVENT_PAGE_APPEAR: "refresh",

    isAndroid:null,
    callFunc:null,

    setCallFunction : function(_callFunc){
        this.callFunc = _callFunc;
    },

    callByJava : function(params)
    {
        if(this.callFunc != null){
            this.callFunc(JSON.parse(params));
        } 
        var tags = JSON.parse(params).tag;
        console.log("****"+tags);
        if(tags=="playEnd"){
        	console.log("******");
        	closeVideo();
        	//quitActivity();
        }
    },

    /**
     * 跳转到本地的界面
     * @param packetName 本地界面的代号
     */
    jumpLocalActivity:function(packetName){
        if(this.isAndroidDevice()){
            var item = {};
            item.tag = this.TAG_WEB_openLocalActiviy;
            item.param = {};
            item.param.packName = packetName;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        }else{
            console.log("不是移动终端，不支持跳转本地包名应用packetName:" + packetName);
        }
    },

    /**
     * APK的下载或者安装方法
     * @param downUrl apk下载地址
     * @param packName  apk包名
     * @param appName   apk的名称
     */
    appOpenOrDownload:function(downUrl, packName, appName)
    {
        if(this.isAndroidDevice()){
            var item = {};
            item.tag = this.TAG_WEB_appOpenOrDownload;
            item.param = {};
            item.param.downUrl = downUrl;
            item.param.packName = packName;
            item.param.appName = appName;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        }else {
            console.log("不是移动终端，appOpenOrDownload");
        }
    },

    //通知机顶盒发送广播，打开百视通点播内容
    sendOpenBSTBroadcast:function(contentID){
        if(this.isAndroidDevice()){
            var item = {};
            item.tag = this.TAG_WEB_openBST;
            item.param = {};
            item.param.contentID = contentID;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        }else{
            console.log("不是移动终端，不支持跳转本地包名应用packetName:" + packetName);
        }
    },
    /**
     *  nextPage:为了华数而加
     */
    jumpWebActivity:function(url,isNeedKeyCode,nextPage){
        console.log("pageLoad_start:" + TimeUtil.getMH());

        if(this.isAndroidDevice()){
            var item = {};
            item.tag = this.TAG_WEB_jumpWebUrl;
            item.param = {};
            item.param.url = url;
            item.param.isNeedKeyCode = isNeedKeyCode;
            item.param.openType = this.TAG_OEPN_URL_TYPE_WEB;
            item.param.nextPage = nextPage;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
            shwoDebugTime("jumpWebActivity");
        }else{
            console.log("不是移动终端，直接打开url:" + url);
            window.location.href = url;
            shwoDebugTime("jumpWebActivity");
        }
    },

    /**
     *  跳转到带有多媒体的页面
     *  nextPage:为了华数而加
     */
    jumpMediaActivity:function(url,isNeedKeyCode,nextPage){
        console.log("pageLoad_start:" + TimeUtil.getMH());

        if(this.isAndroidDevice()){
            var item = {};
            item.tag = this.TAG_WEB_jumpWebUrl;
            item.param = {};
            item.param.url = url;
            item.param.isNeedKeyCode = isNeedKeyCode;
            item.param.openType = this.TAG_OEPN_URL_TYPE_OTHER_PAGE;
            item.param.nextPage = nextPage;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
            shwoDebugTime("jumpWebActivity");
        }else{
            console.log("不是移动终端，直接打开url:" + url);
            window.location.href = url;
            shwoDebugTime("jumpWebActivity");
        }
    },

    quitActivity:function(info){
        if(this.isAndroidDevice()){
            var item = {};
            item.tag = this.TAG_WEB_quitActivity;

            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        }else{
            console.log("不是移动终端，quitActivity方法");
        }
    },

    showErrorInfo:function(info){
        if(this.isAndroidDevice()){
            var item = {};
            item.tag = this.TAG_WEB_showErrorInfo;
            item.info = info;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
        }else{
            Toast.show(info);
            console.log("不是移动终端，showErrorInfo方法");
        }
    },

    showPage:function(){

        console.log("pageLoad_end:" + TimeUtil.getMH());
        if(this.isAndroidDevice()){
            var item = {};
            item.tag = this.TAG_WEB_showPage;
            window.bfWebCallBack.recvWebPlay(JSON.stringify(item));
            shwoDebugTime("showPage");
        }else {
            console.log("不是移动终端，不支持showPage方法");
        }
    },

    //call播放器相关方法
    getTotalTime:function(){
        if(this.isAndroidDevice()){
            return window.bsVideoCallBack.getTotalTime();
        }else {
            console.log("不是移动终端，不支持getTotalTime方法");
        }
    },

    getCurrentTime:function(){
        if(this.isAndroidDevice()){
            return window.bsVideoCallBack.getCurrentTime();
        }else {
            console.log("不是移动终端，不支持getCurrentTime方法");
        }
    },

    seek:function(sec){
        if(this.isAndroidDevice()){
            window.bsVideoCallBack.seek(sec);
        }else {
            console.log("不是移动终端，不支持seek方法");
        }
    },

    pause:function(){
        if(this.isAndroidDevice()){
            window.bsVideoCallBack.pause();
        }else {
            console.log("不是移动终端，不支持pause方法");
        }
    },

    play:function(){
        if(this.isAndroidDevice()){
            window.bsVideoCallBack.play();
        }else {
            console.log("不是移动终端，不支持play方法");
        }
    },

    isPlaying:function(){
        if(this.isAndroidDevice()){
            return window.bsVideoCallBack.isPlaying();
        }else {
            console.log("不是移动终端，不支持isPlaying方法");
        }
    },

    closeVideo:function(){
        if(this.isAndroidDevice()){
            window.bsVideoCallBack.closeVideo();
        }else {
            console.log("不是移动终端，不支持closeVideo方法");
        }
    },

    /**
     * 播放视频
     * @param url   播放视频的远程地址
     */
    playUrlVideo:function(url){
        if(this.isAndroidDevice()){
            ///
            //var url = "http://115.28.143.175/sjiptv/mp4/wangyinyang01.MP4";
            //console.log(">>>>>>>测试 写死播放地址: " + url);
            ///
            window.bsVideoCallBack.playUrlVideo(url);
            // if(left === undefined){
            //     window.bsVideoCallBack.playUrlVideo(url)
            // }else{
            //     window.bsVideoCallBack.playUrlVideo(url,left,top,width,  height, isLoop)
            // }
        }else {
            console.log("不是移动终端，不支持playUrlVideo方法");
        }
    },

    playUrlVideoInFrame:function(url,left, top, width, height, isLoop){
        if(this.isAndroidDevice()){
            ///
            //var url = "http://115.28.143.175/sjiptv/mp4/wangyinyang01.MP4";
            //console.log(">>>>>>>测试 写死播放地址: " + url);
            ///
            // window.bsVideoCallBack.playUrlVideo(url)
            if(left === undefined){
                window.bsVideoCallBack.playUrlVideo(url);
            }else{
                window.bsVideoCallBack.playUrlVideo(url,left,top,width,  height, isLoop);
            }
        }else {
            console.log("不是移动终端，不支持playUrlVideoInFrame方法");
        }
    },

    setPlayPosition: function(left, top, width, height) {
        if (window.bsVideoCallBack) {
            window.bsVideoCallBack.setPosition(left,top,width,  height);
        }
    },

    playFullScreen: function () {
        if (window.bsVideoCallBack) {
            window.bsVideoCallBack.playFullScreen();
        }
    },

    saveDataInLocal:function (key, value) {
        if (window.bfWebCallBack) {
            window.bfWebCallBack.saveLocalData(key, value);
        }
    },

    getDataInLocal: function (key) {
        if (window.bfWebCallBack) {
            window.bfWebCallBack.getLocalData(key);
        }
        return null;
    },

    /**
     * 保存观看记录
     * @param url     播放地址，或者播放页面的路径， 或者资产的详情页面
     * @param title   播放资源的标题
     * @param coverImg  播放资源的封面图片地址
     * @param type    播放资源的分类， 1为娱乐， 2为教育
     */
    savePlayHistory:function (url,title, coverImg, type) {
        if (window.bfWebCallBack) {
            var playKey = "";
            if (type == 1) {
                //保存娱乐类型的观看记录
                playKey = this.ACTION_PLAY_HISTORY_FUN;
            }else if (type == 2) {
                playKey = this.ACTION_PLAY_HISTORY_EDUCATION;
            }
            if (playKey.length > 0) {
                var playItem = {
                    url:url,
                    title:title,
                    coverImg:coverImg
                };
                var playValue = window.bfWebCallBack.getLocalData(playKey);
                if (playValue && playValue.length > 0) {
                    var items = JSON.parse(playValue);
                    if (items) {
                        //首先检查历史记录中的url中是否包含当前播放的url， 如果有的话， 则删除
                        var tempItems = [];
                        for (var i = 0; i <items.length; i++) {
                            var dict = items[i];
                            if (dict["url"] != url) {
                                tempItems.push(dict);
                            }
                        }
                        items = tempItems;
                        if (items.length < 20) {
                            items.push(playItem);
                        }else {
                            items = items.slice(1);
                            items.push(playItem);
                        }
                        window.bfWebCallBack.saveLocalData(playKey, JSON.stringify(items));
                    }
                }else {
                    window.bfWebCallBack.saveLocalData(playKey, JSON.stringify([playItem]));
                }
            }
        }
    },

    getPlayHistory:function (type) {
        if (window.bfWebCallBack) {
            var playKey = "";
            if (type == 1) {
                //保存娱乐类型的观看记录
                playKey = this.ACTION_PLAY_HISTORY_FUN;
            }else if (type == 2) {
                playKey = this.ACTION_PLAY_HISTORY_EDUCATION;
            }
            if (playKey.length > 0) {
                var playData = window.bfWebCallBack.getLocalData(playKey);
                var items = JSON.parse(playData);
                if (items) {
                    return items;
                }
            }
        }
        return [];
    },

    playFullScreen:function(){
        if(this.isAndroidDevice()){
            window.bsVideoCallBack.playFullScreen();
        }else {
            console.log("不是移动终端，不支持playFullScreen方法");
        }
    },

    isAndroidDevice:function(){
        if(this.isAndroid == null){
            this.isAndroid = browser.versions.android;
        }
        return this.isAndroid;
    },


};


var browser={
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase(),

};


var TimeUtil = {

    changeSecondToHMS :function(argSecond){
        console.log("argSecond=" + argSecond);

        var hour = Math.floor(argSecond / (60 * 60));
        var minute = Math.floor((argSecond - hour * (60 * 60)) / (60));
        var second = (argSecond - hour * (60 * 60) - minute * 60);

        if(hour < 10){hour = "0" + hour;}
        if(minute < 10){minute = '0' + minute;}
        if(second < 10){second = '0' + second;}
        console.log(hour);
        console.log(minute);
        console.log(second);

        var hms = hour + ":" + minute + ":" + second;
        console.log(hms);
        return hms;
    },

    getSecond:function(){
        var today = new Date();
        return today.getSeconds();
    },

    getMH:function(){
        var today = new Date();
        return today.getMinutes() + ":" + today.getSeconds();
    }
};

String.prototype.textWidth = function(font) {
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





