/**
 * 获取江苏电信视频第三方视频播放的后缀地址
 * @param left
 * @param top
 * @param width
 * @param height
 * @param mediaCode mediaCode 注入局方的视频ID
 * @param returnUrl 返回URL
 * @returns {string}
 */
function getUrlWith320092(left, top, width, height, mediaCode, returnUrl) {
    var playArea = left + ':' + top + ':' + width + ':' + height;
    var date = new Date();
    var month = date.getMonth() + 1; // 月
    var strDate = date.getDate(); // 日
    var hours = date.getHours(); // 时
    var minutes = date.getMinutes(); // 分
    var seconds = date.getHours(); // 秒

    if (month >= 1 && month <= 9) {
        month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
    }
    if (hours >= 0 && hours <= 9) {
        hours = '0' + hours;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = '0' + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = '0' + seconds;
    }
    var currentDate = date.getFullYear() + ':' + month + ':' + strDate + ':' + hours + ':' + minutes + ':' + seconds;

    var url = '<play_action>vod</play_action><play_id>' + mediaCode + '</play_id>' +
        '<play_time>' + currentDate + '</play_time><play_mode>full</play_mode>' +
        '<play_area>' + playArea + '</play_area>' +
        '<back_vas_url>' + returnUrl + '</back_vas_url ><add_info>play time:' + currentDate + '</add_info>';
    return '?THIRD_INFO=' + encodeURIComponent(url);
}

/**
 * 获取海南电信第三方视频播放的后缀
 * @param mediaCode 注入局方的视频ID
 * @param returnUrl 返回URL
 * @param lmpf 平台参数
 * @returns {string}
 */
function mkUrlInfo460092(mediaCode, returnUrl, lmpf) {
    var url = 'MediaService/FullScreen';
    if (lmpf == 'huawei') {
        url += '.jsp?Type=ad&';
    } else {
        url += '?';
    }
    url += 'ContentID=' + mediaCode.toString();
    url += '&ReturnURL=' + returnUrl;
    var ret = encodeURI(url);
    return ret;
}

/**
 * 获取海南电信第三方视频播放的后缀
 * @param mediaCode 注入局方的视频ID
 * @param returnUrl 返回URL
 * @param lmpf 平台参数
 * @returns {string}
 */
function mkUrlInfo460092HN(mediaCode, returnUrl) {
    // CODE=xxx&PARENTCODE=&USERID=&PLAYTYPE=1& &ISPLAYNEXT =0&BOOKMARK=0&ISAUTHORIZATION=0&PREVIEWENABLE =0&BACKURL=$BA
    var param = '?CODE=' + mediaCode.toString() + '&PARENTCODE=' + mediaCode.toString() + '&USERID=' + RenderParam.accountId + '&PLAYTYPE=2&SPID=JYPT&ISPLAYNEXT=0&BOOKMARK=0'
        + '&ISAUTHORIZATION=0&PREVIEWENABLE=0&BACKURL=' + encodeURI(returnUrl);
    return param;
}

/**
 * 生成海南电信EPG的播放器参数
 * @param left
 * @param top
 * @param width
 * @param height
 * @param mediaCode mediaCode 注入局方的视频ID
 * @param returnUrl 返回URL
 * @returns {string}
 */
function getUrlWith460092(left, top, width, height, mediaCode, returnUrl) {
    var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
    if (thirdPlayerUrl == '') {
        LMEPG.Log.error('domainUrl is empty!!!');
        return;
    }
    LMEPG.Log.error('thirdPlayerUrl is : ' + thirdPlayerUrl);
    thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
    var port_index = thirdPlayerUrl.indexOf(':');
    var path_index = thirdPlayerUrl.indexOf('/');
    var result = thirdPlayerUrl.substring(port_index, path_index);
    thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
    var lmpf;
    if (result == ':33200') {
        lmpf = 'huawei';
        var index = thirdPlayerUrl.indexOf('/EPG/');
        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
    } else {
        lmpf = 'zte';
        var index = thirdPlayerUrl.lastIndexOf('/');
        thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
    }

    var info = mkUrlInfo460092(mediaCode, returnUrl, lmpf);
    var thirdPlayerFullUrl = thirdPlayerUrl + info;

    LMEPG.Log.error('PlayerUrl is : ' + thirdPlayerFullUrl);
    return thirdPlayerFullUrl;
}

/**
 * 生成海南电信EPG的播放器参数
 * @param mediaCode mediaCode 注入局方的视频ID
 * @param returnUrl 返回URL
 * @returns {string}
 */
function getUrlWith460092HN(mediaCode, returnUrl) {
    var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
    if (thirdPlayerUrl == '') {
        LMEPG.Log.error('domainUrl is empty!!!');
        return;
    }

    // Authentication.CTCGetConfig("EPGDomain") 中截取IPURL= http://ip:port
    thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
    var port_index = thirdPlayerUrl.indexOf(':');
    var path_index = thirdPlayerUrl.indexOf('/');
    var result = thirdPlayerUrl.substring(port_index, path_index);
    var preUrl = thirdPlayerUrl.substring(0, path_index);
    thirdPlayerUrl = preUrl.replace('+++', '://');
    LMEPG.Log.error('thirdPlayerUrl 111 is : ' + thirdPlayerUrl);
    var lmpf;
    if (result == ':33200') {
        // 现网模板： Url =IPURL+“/EPG/jsp/zhuoying/en/play/play_auth.jsp”
        lmpf = 'huawei';
        thirdPlayerUrl = thirdPlayerUrl + '/EPG/jsp/zhuoying/en/play/play_auth.jsp';
    } else {
        // 现网模板：Url =IPURL+“/iptvepg/frame80/play/play_auth.jsp”
        lmpf = 'zte';
        thirdPlayerUrl = thirdPlayerUrl + '/iptvepg/frame80/play/play_auth.jsp';
    }

    var info = mkUrlInfo460092HN(mediaCode, returnUrl);
    var thirdPlayerFullUrl = thirdPlayerUrl + info;

    // http://10.255.8.36:8080/iptvepg/frame80/play/play_auth.jsp?CODE=99100000012019070516382105482988&PARENTCODE=99100000012019070516382105482988&USERID=1162937225&PLAYTYPE=2&SPID=JYPT&ISPLAYNEXT=0&BOOKMARK=0&ISAUTHORIZATION=0&PREVIEWENABLE=0&BACKURL=http://10.255.6.22:10302/index.php/Home/Player/playerCallback/
    // http://XX?CODE=xxx&PARENTCODE=&USERID=&PLAYTYPE=1& &ISPLAYNEXT =0&BOOKMARK =0&ISAUTHORIZATION=0&PREVIEWENABLE =0&BACKURL=$BACKURL
    LMEPG.Log.error('PlayerUrl is : ' + thirdPlayerFullUrl);
    return thirdPlayerFullUrl;
}

function mkUrlInfo630092(mediaCode, returnUrl) {
    var info = "AUTHCODE=" + mediaCode + "&CODE=" + mediaCode + "&PARENTCODE=" + mediaCode + "&USERID=" + RenderParam.accountId
        + "&PLAYTYPE=2&ISPLAYNEXT=0&BOOKMARK=0&ISAUTHORIZATION=0&BACKURL=" + escape(returnUrl) + "&PICURL=";

    return info;
}

function mkUrlInfo640092(mediaCode, returnUrl) {
    var param = '?CODE=' + mediaCode.toString() +
        '&USERTOKEN='+Authentication.CTCGetConfig('UserToken')+
        '&USERID='+RenderParam.accountId+
        '&PARENTCODE=' + mediaCode.toString() +
        '&PLAYTYPE=1' +
        '&BACKURL=' +encodeURI(returnUrl)+
        '&SPID=spaj0080' +
        '&ISAUTHORIZATION=0' +
        '&PREVIEWTIME=0' +
        '&FREEALBUM=0' +
        '&AUTHURL=';
    return param;
}

function mkUrlInfo610092(mediaCode, returnUrl) {
    var param = 'CODE=' + mediaCode.toString() +
        '&USERTOKEN='+Authentication.CTCGetConfig('UserToken')+
        '&USERID='+Authentication.CTCGetConfig('UserID')+
        '&PARENTCODE=' + mediaCode.toString() +
        '&PLAYTYPE=2' +
        '&ISPLAYNEXT=0' +
        '&SPID=cpaj0038' +
        '&ISAUTHORIZATION=1' +
        '&PREVIEWTIME=0' +
        '&PREVIEWFLAG=0' +
        '&TYPEID=' +
        '&BOOKMARK=0' +
        '&BACKURL=' +encodeURIComponent(returnUrl);
    return param;
}

// 甘肃电信EPG
function mkUrlInfo620092(mediaCode, returnUrl) {
    var url =
        "<vas_action>fullscreen</vas_action>" +
        "<mediacode>" + mediaCode + "</mediacode>" +
        "<mediatype>VOD</mediatype>" +
        "<vas_back_url>" + returnUrl + "</vas_back_url>"
    return "?vas_info=" + encodeURI(url);
}

function getUrlWith630092(mediaCode, returnUrl) {
    var playUrl = "";
    var domainUrl = LMEPG.STBUtil.getEPGDomain();
    // Authentication.CTCGetConfig("EPGDomain") 中截取IPURL= http://ip:port
    var ipUrl = domainUrl.replace('://', '+++');
    var portIndex = ipUrl.indexOf(':');
    var pathIndex = ipUrl.indexOf('/');
    var result = ipUrl.substring(portIndex, pathIndex);
    var preUrl = ipUrl.substring(0, pathIndex);
    ipUrl = preUrl.replace("+++", "://");
    if (result === ':33200') {
        //华为端口
        // lmpf = 'huawei';
        playUrl = ipUrl + "/EPG/jsp/zhihuiyunying/en/pubPlay/play_auth.jsp?";
    } else{
        // lmpf = 'zte';
        playUrl = ipUrl + "/iptvepg/frame71/pubPlay/play_auth.jsp?";
    }

    var info = mkUrlInfo630092(mediaCode, returnUrl);

    playUrl = playUrl + info;

    return playUrl;
}

/**
 *
 * 生成陕西电信EPG的播放器参数
 * @param mediaCode mediaCode 注入局方的视频ID
 * @param returnUrl 返回URL
 * @returns {string}
 */
function getUrlWith610092(mediaCode, returnUrl) {
    var playUrl = "";
    var domainUrl = LMEPG.STBUtil.getEPGDomain(); // 中截取IPURL= http://ip:port
    LMEPG.Log.info("domainUrl>>>"+domainUrl);
    //LMEPG.UI.logPanel.show("domainUrl>>>"+domainUrl);
    var ipUrl = domainUrl.replace('://', '+++');
    var portIndex = ipUrl.indexOf(':');
    var pathIndex = ipUrl.indexOf('/');
    var result = ipUrl.substring(portIndex, pathIndex);
    var preUrl = ipUrl.substring(0, pathIndex);

    ipUrl = preUrl.replace("+++", "://");
    LMEPG.Log.info("ipUrl>>>"+ipUrl);
    //LMEPG.UI.logPanel.show("ipUrl>>>"+ipUrl);
    if (result === ':33200') {
        LMEPG.UI.logPanel.show("华为>>>"+result);
        //华为端口
        // lmpf = 'huawei';
        playUrl = ipUrl + "/EPG/jsp/zyfz/en/play/play_auth.jsp?";
        //playUrl = ipUrl + "/EPG/jsp/zyfz/en/test/play/play_auth.jsp?";
    } else{
        LMEPG.UI.logPanel.show("中兴>>>"+result);
        // lmpf = 'zte';
        playUrl = ipUrl + "/iptvepg/frame223/zteplay/play_auth.jsp?";
        //playUrl = ipUrl + "/iptvepg/frame223/test/zteplay/play_control.jsp?";
    }

    var info = mkUrlInfo610092(mediaCode, returnUrl);
    LMEPG.Log.info("info>>>"+info);
    //LMEPG.UI.logPanel.show("info>>>"+info);
    playUrl = playUrl + info;
    LMEPG.Log.info("playUrl>>>"+playUrl);
    //LMEPG.UI.logPanel.show("playUrl>>>"+playUrl);


    return playUrl;
}

/**
 *
 * 生成甘肃电信EPG的播放器参数
 * @param mediaCode mediaCode 注入局方的视频ID
 * @param returnUrl 返回URL
 * @returns {string}
 */
function getUrlWith620092(mediaCode, returnUrl) {
    // var lmpf = '';
    // var thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
    // // thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
    // // thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
    // var last = RenderParam.domainUrl.indexOf("/jsp/");
    // LMEPG.Log.info('thirdPlayerUrl_objurl>>>' + thirdPlayerUrl);
    // if (last >= 0) {
    //     lmpf = 'huawei';
    //     var index = thirdPlayerUrl.indexOf('/EPG/');
    //     thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
    // } else {
    //     lmpf = 'zte';
    //     var index = thirdPlayerUrl.lastIndexOf('/');
    //     thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
    // }

    var info = mkUrlInfo620092(mediaCode, returnUrl);

    playUrl = RenderParam.domainUrl + info;
    LMEPG.Log.info('playUrl_620092---->>>' + playUrl);

    return playUrl;
}

/**
 *
 * 生成宁夏电信EPG的播放器参数
 * @param mediaCode mediaCode 注入局方的视频ID
 * @param returnUrl 返回URL
 * @returns {string}
 */
function getUrlWith640092(mediaCode, returnUrl) {
    var url = LMEPG.STBUtil.getEPGDomain();
    var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(url);
    if(!LMEPG.Func.isEmpty(url) && url.indexOf(":") != -1){
        var playurl = url.split(':')[0]+":"+url.split(':')[1]+':'+url.split(':')[2].split('/')[0];
        if(prefixObj.isHW){
            playurl = playurl + '/EPG/jsp/zy2q/en/play/play_auth.jsp';
        }else{
            playurl = playurl + '/iptvepg/frame1092/play/play_auth.jsp';
        }
    }
    var info = mkUrlInfo640092(mediaCode, returnUrl);

    playurl = playurl + info;
    LMEPG.Log.info('playUrl_640092---->>>' + playurl);

    return playurl;
}