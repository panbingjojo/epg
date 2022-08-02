var buttons = [];
var channelNo = 18; // cctv13 频道
var Page = {
    defaultFocusId: "btn-box-video",
    //页面初始化操作
    init: function () {
        Page.initButtons();                 // 初始化焦点按钮
        LMEPG.BM.init(Page.defaultFocusId, buttons, "", true);
    },
    initButtons: function () {
        buttons.push({
            id: 'btn-box-video',
            name: '视频',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'btn-box-1',
            focusChange: Page.areaFocus,
            click: Page.onClickJump,
        });

    },

    areaFocus: function (btn, has) {
        if (has) {
            G(btn.id).style.display = "block";
        } else {
            G(btn.id).style.display = "none";
        }
    },


    onClickJump: function (btn) {
        switch (btn.id) {
            case "btn-box-video":
                Page.parseVideoInfo();
                break;
        }
    },

    parseVideoInfo: function (btn) {
        // 调整频道号
        RenderParam.channelVideo.videoUrl = channelNo;
        Page.playVideo(RenderParam.channelVideo);
    },

    playVideo: function (videoParams) {
        var objCurrent = Page.getCurrentPage();
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoParams));
        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    playChannel: function () {
        var left = RenderParam.playPosition[0];
        var top = RenderParam.playPosition[1];
        var width = RenderParam.playPosition[2];
        var height = RenderParam.playPosition[3];
        var smallChannelUrl = "";

        var platFormInfo = Page.platFormDifferentiate();
        if (platFormInfo.lmpf == "huawei") {
            channelNo = 135; // 雷神山 频道
            smallChannelUrl = platFormInfo.domainUrl + "/EPG/jsp/defaultnew/en/smallCh.jsp?left=" + left + "&top=" + top + "&width=" + width + "&height=" + height + "&channelNo=" + channelNo;
        } else {
            channelNo = 141; // 雷神山 频道
            smallChannelUrl = platFormInfo.domainUrl + "/iptvepg/frame51/smallCh.jsp?left=" + left + "&top=" + top + "&width=" + width + "&height=" + height + "&channelNo=" + channelNo;
        }
        LMEPG.Log.info("## Channel smallChannelUrl : " + smallChannelUrl);

        G('iframe_small_screen').setAttribute("src", smallChannelUrl);
        // LMEPG.mp.initPlayerByBind(); // 不用这个，避免天邑、创维盒子不兼容问题，无法播放频道
    },

    // 区分中兴平台、华为平台
    platFormDifferentiate: function () {
        var epgDomainUrl = LMEPG.STBUtil.getEPGDomain();
        LMEPG.Log.info("epgDomainUrl is : " + epgDomainUrl);
        epgDomainUrl = epgDomainUrl.replace('://', '+++');
        var port_index = epgDomainUrl.indexOf(':');
        var path_index = epgDomainUrl.indexOf('/');
        var port = epgDomainUrl.substring(port_index, path_index);
        epgDomainUrl = epgDomainUrl.replace("+++", "://");
        var domainUrl = epgDomainUrl.substring(0, path_index);
        var lmpf = "";

        if (port === ":33200") {//华为端口
            lmpf = "huawei";
        } else {
            lmpf = "zte";
        }

        return {"lmpf": lmpf, "domainUrl": domainUrl};
    }
}


function onBack() {
    //回到局方
    LMEPG.Intent.back();
}