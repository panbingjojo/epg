var buttons = [];
var Data = {
    videoInfo: [
        {
            "sourceId": "8126",
            "videoUrl": "Program1006156",
            "title": "因你珍稀 所以珍惜丨国际罕见病日",
            "unionCode": "d5yy005",

        }
    ],
};
var Page = {
    defaultFocusId: RenderParam.focusIndex,
    flag: true,
    //页面初始化操作
    init: function () {
        //Page.renderView();
        Page.renderRealTimeData();
        Page.initButtons();                 // 初始化焦点按钮
        LMEPG.BM.init(Page.defaultFocusId === 'btn-box-video' ? 'btn-video' : Page.defaultFocusId, buttons, "", true);
        Page.switchImg();
        if(RenderParam.carrierId === '630092'){
            G('btn-1').src = '/Public/img/hd/OutbreakReport/V2/activity-pic.png'
        }
    },
    switchImg: function () {
        var img1 = Page.buildMapAvatarUrl(RenderParam.CWS_HLWYY_URL, RenderParam.mapTime, RenderParam.epidemicDetails.map_url, RenderParam.lmcid);
        var img2 = Page.buildMapAvatarUrl(RenderParam.CWS_HLWYY_URL, RenderParam.overSeaMapTime + 1, RenderParam.epidemicDetails.overseas_url, RenderParam.lmcid);
        setInterval(function () {
            var data = RenderParam.epidemicDetails.main[0];
            var overseasData = RenderParam.epidemicDetails.overseas[0];
            if (Page.flag) {
                G("data-link-title").innerHTML = "国内疫情";
                G("data-link-1").innerHTML = "现存确诊：" + ((+data.confirm) - (+data.died) - (+data.cure));
                G("data-link-2").innerHTML = "累计确诊：" + data.confirm;
                G("data-link-3").innerHTML = "累计死亡：" + data.died;
            } else {
                G("data-link-title").innerHTML = "国外疫情";
                G("data-link-1").innerHTML = "现存确诊：" + ((+overseasData.confirm) - (+overseasData.died) - (+overseasData.cure));
                G("data-link-2").innerHTML = "累计确诊：" + overseasData.confirm;
                G("data-link-3").innerHTML = "累计死亡：" + overseasData.died;
            }
            G('map').src = Page.flag ? img1 : img2;
            G('sw-2').style.background = Page.flag ? "#898F94" : "#ea5858";
            G('sw-1').style.background = Page.flag ? "#ea5858" : "#898F94";
            Page.flag = !Page.flag;

        }, 6000)
    },
    initButtons: function () {
        buttons.push({
            id: 'btn-video',
            name: '视频',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'btn-1',
            focusChange: Page.areaFocus,
            click: Page.onClickJump,
            backgroundImage: ROOT + '/Public/img/hd/Common/transparent.png',
            focusImage: ROOT + '/Public/img/hd/OutbreakReport/V2/small.box.png'
        });

        var num = 6; // 页面最下端按钮的个数
        while (--num >= 1) {
            buttons.push({
                id: 'btn-' + num,
                name: '按钮',
                type: 'div',
                nextFocusLeft: 'btn-' + (num - 1),
                nextFocusRight: 'btn-' + (num + 1),
                nextFocusUp: 'btn-video',
                nextFocusDown: "",
                click: Page.onClickJump,
                backgroundImage: ROOT + '/Public/img/hd/Common/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/V2/btn_f.png'
            })
        }
    },
    renderRealTimeData: function () {

        var data = RenderParam.epidemicDetails.main[0];
        var htm = '<p id="intro-title" style="border-bottom:none;">截止：' + data.last_msg_dt + ' 数据来源： 各地区卫健委</p>';
        htm += '<p id="data-link-title" class="p2" style="border-bottom:none;font-size: 20px;font-weight: bold;text-align: center;margin-top: 15px">国内疫情</p>';
        htm += '<p id="data-link-1" class="p2" style="font-size: 18px">现存确诊：' + ((+data.confirm) - (+data.died) - (+data.cure)) + '</p>';
        htm += '<p id="data-link-2" class="p2" style="font-size: 18px">累计确诊：' + data.confirm + '</p>';
        htm += '<p id="data-link-3" class="p2" style="font-size: 18px">累计死亡：' + data.died + '</p>';

        G('real-time-data').innerHTML = htm;
        G('map').src = Page.buildMapAvatarUrl(RenderParam.CWS_HLWYY_URL, RenderParam.mapTime, RenderParam.epidemicDetails.map_url, RenderParam.lmcid);
    },

    // 渲染详情页面数据
    renderView: function () {
        if (RenderParam.epidemicDetails.code == 0) {
            var epidemicDetails = RenderParam.epidemicDetails.data;
            var item = "";
            var detailTitle = "";

            // 填充地图
            G('map').src = Page.buildMapAvatarUrl(RenderParam.CWS_HLWYY_URL, RenderParam.mapTime, RenderParam.epidemicDetails.map_url, RenderParam.lmcid);
            // var date = new Date();
            // var d = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +date.getHours()+ ":" + date.getMinutes();
            // G('date').innerHTML =d;
            for (var i = 0; i < epidemicDetails.length; i++) {
                item = epidemicDetails[i];
                detailTitle = item.content;
                if (item.color == 0) {
                    // 总标题
                    G('data').innerHTML = detailTitle;
                    break;
                }
            }
        } else {
            // 拉取数据失败
            LMEPG.UI.showToastV1("获取数据失败！");
        }
    },

    areaFocus: function (btn, has) {
        if (has) {
            // G(btn.id).style.display = "block";
        } else {
            // G(btn.id).style.display = "none";
        }
    },


    onClickJump: function (btn) {
        switch (btn.id) {
            case "btn-video":
                Page.parseVideoInfo();
                break;
            case "btn-1":
                // Page.jumpTimeLine();
                Page.jumpRetrograde();
                break;
            case "btn-2":
                Page.jumpDataPrev();
                break;
            case "btn-3":
                Page.jumpTimeLine2();
                //Page.jumpLiveChannelH();
                break;
            case "btn-4":
                // Page.jumpTreatment();
                Page.jumpNucleatOrder();
                break;
            case "btn-5":
                // Page.jumpNucleatOrder();
                Page.jumpBtn7(btn);
                break;
            case "btn-6":
                Page.jumpBtn6(btn);
                break;
            case "btn-7":
                Page.jumpBtn7(btn);
                break;
            case "btn-8":
                if(RenderParam.carrierId === '630092'){
                    LMEPG.Intent.back();
                }else{
                    Page.jumpInquiry();
                }
                break;
            case "btn-9":
            case "btn-10":
                Page.jumpDepartment(btn);
                break;

        }
    },

    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("report-index");
        currentPage.setParam("focusIndex2", LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },
    //跳转->疫情播报
    jumpTimeLine2: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("report-time-line");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    //跳转->疫情播报
    jumpTimeLine: function () {
        var platFormInfo = Page.platFormDifferentiate();

        var param = "";
        LMEPG.Log.info("## RenderParam.backUrl : " + RenderParam.backUrl);
        var backUrl = encodeURIComponent(RenderParam.backUrl);
        if (platFormInfo.lmpf == "huawei") {//华为端口
            param = "/EPG/jsp/bestv3/en/linkPortal.jsp?linkValue=http://118.213.207.152:8080/vasroot/viscore/portal/biz_hq_11747024_hd/category/category_hq_11992467&backUrl=" + backUrl;
        } else {
            param = "/iptvepg/frame48/epgFengTao.jsp?goToPage=xxgzbdzt&backurl=" + backUrl;
        }

        var goBestvUrl = platFormInfo.domainUrl + param;

        // 延时进入，方便查看日志
        LMEPG.Log.info("## goBestvUrl : " + goBestvUrl);
        setTimeout(function () {
            window.location.href = goBestvUrl;
        }, 1000)
    },

    //跳转->数据统计
    jumpData: function () {
        var txt = '截止：' + RenderParam.epidemicDetails.main[0].last_msg_dt + '数据统计：' + RenderParam.epidemicDetails.data[0].content;
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("area-data");
        objDst.setParam('detailTitle', txt);
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    //跳转->数据统计
    jumpDataPrev: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("area-data-prev");
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    //跳转->数据统计
    jumpRetrograde: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst
        if(RenderParam.carrierId === '630092'){
            objDst = LMEPG.Intent.createIntent('activity');
            objDst.setParam('userId', RenderParam.userId);
            objDst.setParam('activityName', 'ActivityGiveWarm20211108');
            objDst.setParam('inner', 1);
        }else {
            objDst = LMEPG.Intent.createIntent("retrograde");
        }

        LMEPG.Intent.jump(objDst, objCurrent);
    },

    //跳转->疫情知识
    jumpKnowledge: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("knowledge");
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    /**
     * 跳转->核酸检测
     */
    jumpNucleatOrder: function () {
        var objCurrent = Page.getCurrentPage();
        var objGuaHao = LMEPG.Intent.createIntent("nucleicAcidDetect");
        LMEPG.Intent.jump(objGuaHao, objCurrent);
    },

    //跳转->疑似感染自测
    jumpBtn6: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("nCoV-test");
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    //跳转->确诊小区
    jumpBtn7: function () {
        var objCurrent = Page.getCurrentPage();
        // var objDst = LMEPG.Intent.createIntent("epidemic-Area");
        var objDst = LMEPG.Intent.createIntent("go-home-isolation");
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    //跳转->科室
    jumpDepartment: function (btn) {
        var department = btn.id === 'btn-9' ? 'urine' : 'heart';
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("nCoV-hospital-department");
        objDst.setParam('department', department);
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    //跳转->治疗
    jumpTreatment: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("treatment");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    //跳转->火山医院
    jumpLiveChannelH: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("liveChannelH");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    //跳转->雷神医院
    jumpLiveChannelL: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("liveChannelL");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    // 点击视频问诊按钮
    jumpInquiry: function () {
        var objCurrent = Page.getCurrentPage();

        var objDoctorP2P = LMEPG.Intent.createIntent('doctorIndex');
        objDoctorP2P.setParam('userId', RenderParam.userId);
        objDoctorP2P.setParam('s_demo_id', "demo");

        LMEPG.Intent.jump(objDoctorP2P, objCurrent);
    },

    parseVideoInfo: function (btn) {
        Page.playVideo(RenderParam.channelVideo);
    },

    playVideo: function (videoParams) {
        var objCurrent = Page.getCurrentPage();
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoParams));
        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    /**
     * 构建地图图片地址
     * @param urlPrefix
     * @param doctorId
     * @param avatarUrl
     * @param carrierID
     * @returns {string}
     */
    buildMapAvatarUrl: function (urlPrefix, doctorId, avatarUrl, carrierID) {
        var head = {
            func: "getDoctorHeadImage",
            carrierId: carrierID,
            areaCode: RenderParam.areaCode,
        };
        var json = {
            doctorId: doctorId,
            avatarUrl: avatarUrl
        };
        return urlPrefix + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
    },

    playChannel: function () {
        var left = RenderParam.playPosition[0];
        var top = RenderParam.playPosition[1];
        var width = RenderParam.playPosition[2];
        var height = RenderParam.playPosition[3];
        var channelNo = 18; // cctv13 频道
        var smallChannelUrl = "";

        var platFormInfo = Page.platFormDifferentiate();
        if (platFormInfo.lmpf == "huawei") {
            smallChannelUrl = platFormInfo.domainUrl + "/EPG/jsp/defaultnew/en/smallCh.jsp?left=" + left + "&top=" + top + "&width=" + width + "&height=" + height + "&channelNo=" + channelNo;
        } else {
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
    if (RenderParam.fromLaunch == '1') {
        Utility.setValueByName("exitIptvApp");
    } else {
        LMEPG.Intent.back('IPTVPortal');
    }
}