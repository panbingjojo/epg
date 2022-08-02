var buttons = [];
var supportInquiry = ['440004', '10220094', '650092', '640092', '630092', '000051', 'V520094', '450094', '370092', '220094', '220095',
    '460092', '410092', 'V520094', '450092', '10000051']; // 支持视频问诊的地区
var Page = {
    flag: true,
    isDiff:false,
    defaultFocusId: RenderParam.focusIndex,
    //页面初始化操作
    init: function () {
        Page.isDiff = RenderParam.lmcid === '10000051' ||  RenderParam.lmcid === '450094' || RenderParam.lmcid === '450092' || RenderParam.lmcid === '450001'
        //Page.renderView();
        Page.renderRealTimeData();
        // Page.diffView();
        Page.initButtons();                 // 初始化焦点按钮
        LMEPG.BM.init( Page.isDiff?'btn-2':Page.defaultFocusId, buttons, "", true);
        // Page.switchImg();
        if (RenderParam.carrierId == "V520094") {
            G("o-title").style.top = '180px';

        }
        Page.difArea()
    },
    difArea:function(){
        if(RenderParam.carrierId === '450094' || RenderParam.carrierId === '450092' || RenderParam.carrierId === '450001'){
            delNode('btn-3')
            delNode('btn-4')
            delNode('btn-1')
        }
    },

    switchImg: function (htm1, htm) {
        console.log(htm, htm1);
        var htmA = htm1;
        var htmB = htm;
        var img1 = Page.buildMapAvatarUrl(RenderParam.CWS_HLWYY_URL, RenderParam.mapTime, RenderParam.epidemicDetails.map_url, RenderParam.lmcid);
        var img2 = Page.buildMapAvatarUrl(RenderParam.CWS_HLWYY_URL, RenderParam.overSeaMapTime + 1, RenderParam.epidemicDetails.overseas_url, RenderParam.lmcid);
        setInterval(function () {
            G('map').src = Page.flag ? img1 : img2;
            G('sw-2').style.background = Page.flag ? "#898F94" : "#ea5858";
            G('sw-1').style.background = Page.flag ? "#ea5858" : "#898F94";
            G("real-time-data").innerHTML = Page.flag ? htmA : htmB;
            Page.flag = !Page.flag;
        }, 6000);
    },

    calcTime:function(){
        var date = new Date()
        return date.getFullYear()+'-'+(date.getMonth()+1)+ '-' + date.getDate() + ' 00:00:00 '
    },

    renderRealTimeData: function () {
        if (RenderParam.epidemicDetails.code != 0) return;
        var data = RenderParam.epidemicDetails.main[0];
        var internalData = ((+data.confirm_add) - (+data.died_add) - (+data.cure_add)) > 0 ? "+" + ((+data.confirm_add) - (+data.died_add) - (+data.cure_add)) : ((+data.confirm_add) - (+data.died_add) - (+data.cure_add));
        var overseasData = RenderParam.epidemicDetails.overseas[0];
        var oversesData = (overseasData.confirm_add - overseasData.died_add - overseasData.cure_add) > 0 ? "+" + (overseasData.confirm_add - overseasData.died_add - overseasData.cure_add) : (overseasData.confirm_add - overseasData.died_add - overseasData.cure_add);
        //国内疫情新版
        var time = Page.isDiff? Page.calcTime() : data.last_msg_dt
        var htm1 = '<table><div id="intro-title"'+(Page.isDiff?' style="top:270px"':'')+'><p>截止：' + time + '</p><p style="display:'+(Page.isDiff?'block':'none')+'">更新频率：每天一次</p><p>数据来源： 各地区卫健委</p></div>';
        htm1 += '<div class="g-title">国内疫情</div>';
        htm1 += '<div class="left"></div>';
        htm1 += '<div class="right"></div>';
        htm1 += '<tr class="row-1">';
        htm1 += '<td class="col-1">';
        htm1 += '<p class="p3">现存确诊</p>';
        htm1 += '<p class="p2">' + ((+data.confirm) - (+data.died) - (+data.cure)-(Page.isDiff? internalData : 0)) + '</p>';
        !Page.isDiff? htm1 += '<p class="p1"> 较昨日<span>' + internalData + '</span></p>' : '';
        htm1 += '<td class="col-2">';
        htm1 += '<p class="p3">境外输入确诊</p>';
        htm1 += '<p class="p2">' + (data.overseas - (Page.isDiff? data.overseas_add : 0) )+ '</p>';
        !Page.isDiff? htm1 += '<p class="p1"> 较昨日<span>+' + data.overseas_add + '</span></p>' : '';
        htm1 += '<tr class="row-1-1">';
        htm1 += '<td class="col-3">';
        htm1 += '<p class="p3">累计确诊</p>';
        htm1 += '<p class="p2">' + (data.confirm - (Page.isDiff? data.confirm_add : 0))+ '</p>';
        !Page.isDiff? htm1 += '<p class="p1"> 较昨日<span>+' + data.confirm_add + '</span></p>' : '';
        htm1 += '<td class="col-4">';
        htm1 += '<p class="p3">累计治愈</p>';
        htm1 += '<p class="p2">' + (data.cure - (Page.isDiff? data.cure_add : 0)) + '</p>';
        !Page.isDiff? htm1 += '<p class="p1"> 较昨日<span>+' + data.cure_add + '</span></p>' : '';

        var htm = '<table><div id="intro-title"'+(Page.isDiff?' style="top:270px"':'')+'><p>截止：' + time + '</p><p style="display:'+(Page.isDiff?'block':'none')+'">更新频率：每天一次</p><p>数据来源： 各地区卫健委</p></div>';
        htm += '<div class="g-title">海外疫情</div>';
        htm += '<div class="left"></div>';
        htm += '<div class="right"></div>';
        htm += '<tr class="row-1">';
        htm += '<td class="col-1">';
        htm += '<p class="p3">现存确诊</p>';
        htm += '<p class="p2-1">' + ((+overseasData.confirm) - (+overseasData.died) - (+overseasData.cure) - (Page.isDiff? oversesData : 0)) + '</p>';
        !Page.isDiff? htm += '<p class="p1"> 较昨日<span>' + oversesData + '</span></p>' : '';
        htm += '<td class="col-2">';
        htm += '<p class="p3">累计确诊</p>';
        htm += '<p class="p2-1">' + (overseasData.confirm - (Page.isDiff? overseasData.confirm_add : 0) ) + '</p>';
        !Page.isDiff? htm += '<p class="p1"> 较昨日<span>+' + overseasData.confirm_add + '</span></p>' : '';
        htm += '<tr class="row-1-1">';
        htm += '<td class="col-3">';
        htm += '<p class="p3">累计死亡</p>';
        htm += '<p class="p2-1">' + (overseasData.died - (Page.isDiff? overseasData.died_add : 0))+ '</p>';
        !Page.isDiff? htm += '<p class="p1"> 较昨日<span>+' + overseasData.died_add + '</span></p>' : '';
        htm += '<td class="col-4">';
        htm += '<p class="p3">累计治愈</p>';
        htm += '<p class="p2-1">' + (overseasData.cure - (Page.isDiff? overseasData.cure_add : 0)) + '</p>';
        !Page.isDiff? htm += '<p class="p1"> 较昨日<span>+' + overseasData.cure_add + '</span></p>' : '';

        G('map').src = Page.buildMapAvatarUrl(RenderParam.CWS_HLWYY_URL, RenderParam.mapTime, RenderParam.epidemicDetails.map_url, RenderParam.lmcid);
        G("real-time-data").innerHTML = htm1;
        Page.switchImg(htm1, htm);
    },
    initButtons: function () {
        var len = 8;// 页面入口按钮数
        for (var i = 0; i < len; i++) {
            buttons.push({
                id: 'btn-' + (i + 1),
                name: '按钮',
                type: 'img',
                nextFocusLeft: 'btn-' + i,
                nextFocusRight: 'btn-' + (i + 2),
                nextFocusUp: 'btn-' + (i - 3),
                nextFocusDown: 'btn-' + (i + 5),
                backgroundImage:((RenderParam.carrierId == '220094' || RenderParam.carrierId=='220095') && i==3)
                        ?Root + "/Public/img/hd/OutbreakReport/V1/bg_btn_11.png"
                    :Root + "/Public/img/hd/OutbreakReport/V1/bg_btn_" + (i + 1) + ".png",
                focusImage: ((RenderParam.carrierId == '220094' || RenderParam.carrierId=='220095') && i==3)?
                     Root + "/Public/img/hd/OutbreakReport/V1/f_btn_11.png"
                    :Root + "/Public/img/hd/OutbreakReport/V1/f_btn_" + (i + 1) + ".png",
                click: Page.onClickJump
            });
        }
    },

    // 页面不同之处
    // diffView: function () {
    //     if (RenderParam.lmcid == '000051') {
    //         // 更换背景图
    //         G('indexBg').src = '/Public/img/hd/OutbreakReport/V1/bg_000051.jpg';
    //     } else if (RenderParam.lmcid == '220094' || RenderParam.lmcid == '220095') {
    //         G('indexBg').src = '/Public/img/hd/OutbreakReport/V1/bg_dsjtys.jpg';
    //     } else if (RenderParam.lmcid == '10000051') {
    //         G('indexBg').src = '/Public/img/hd/OutbreakReport/V1/bg_normal.png';
    //     }
    // },

    // 渲染详情页面数据
    renderView: function () {
        if (RenderParam.epidemicDetails.code == 0) {
            var epidemicDetails = RenderParam.epidemicDetails.data;
            var item = "";
            var detailTitle = "";
            // 填充地图
            // G('map').src = RenderParam.epidemicDetails.map_url;
            G('map').src = Page.buildMapAvatarUrl(RenderParam.CWS_HLWYY_URL, RenderParam.mapTime, RenderParam.epidemicDetails.map_url, RenderParam.lmcid);
            var strHtml = "";
            strHtml += '<ul>';
            var isOdd = true; // 奇数
            for (var i = 0; i < epidemicDetails.length; i++) {
                item = epidemicDetails[i];
                detailTitle = item.content;
                if (item.color == 0) {
                    // 总标题
                    G('detailTitle').innerHTML = detailTitle;
                } else {
                    if (isOdd) { // 是奇数
                        strHtml += "<li>";
                        strHtml += '<img class="status" src=' + Root + '"/Public/img/hd/OutbreakReport/V1/icon_red.png" alt="状态">';
                        strHtml += detailTitle;
                        strHtml += "</li>";
                        isOdd = false;
                    } else { // 不是奇数
                        strHtml += "<li>";
                        strHtml += '<img class="status" src=' + Root + '"/Public/img/hd/OutbreakReport/V1/icon_oringe.png" alt="状态">';
                        strHtml += detailTitle;
                        strHtml += "</li>";
                        isOdd = true;
                    }
                }
            }
            strHtml += '</ul>';
            var dom = G("list_id");
            dom.innerHTML = strHtml;

        } else {
            // 拉取数据失败
            console.log("获取数据失败");
            LMEPG.UI.showToastV1("获取数据失败！");
        }
    },

    onClickJump: function (btn) {
        switch (btn.id) {
            case "btn-1":
                Page.jumpTimeLine();
                break;
            case "btn-2":
                Page.jumpDataPrev();
                break;
            case "btn-3":
                Page.jumpBtn7();
                // Page.jumpKnowledge();
                // Page.jumpNucleatOrder();
                break;
            case "btn-4":
                //预防及治疗
                // Page.jumpTreatment();
                //核酸检测
                Page.jumpNucleatOrder();
                break;
            case "btn-5":
                Page.jumpBtn6();
                break;
            case "btn-6":
                Page.jumpBtn7();
                break;
            case "btn-7":
                if (supportInquiry.indexOf(RenderParam.lmcid) != -1) {
                    Page.jumpInquiry();
                } else {
                    // 不支持视频问诊，就走向一个提示页
                    Show('second-model');
                }
                break;
            case "btn-8":
            case "btn-9":
            case "btn-10":
                Page.jumpDepartment(btn);
                break;
        }
    },
    //跳转->核酸检测
    jumpNucleatOrder: function () {
        var objCurrent = Page.getCurrentPage();
        var objGuaHao = LMEPG.Intent.createIntent("nucleicAcidDetect");
        LMEPG.Intent.jump(objGuaHao, objCurrent);
    },
    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("report-index");
        currentPage.setParam("focusIndex2", LMEPG.BM.getCurrentButton().id);
        currentPage.setParam("isExitApp", RenderParam.isExitApp);
        return currentPage;
    },

    //跳转->疫情播报
    jumpTimeLine: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("report-time-line");
        LMEPG.Intent.jump(objDst, objCurrent);
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

    //跳转->疫情知识
    jumpKnowledge: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("knowledge");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    //跳转->治疗
    jumpTreatment: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("treatment");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    // 点击视频问诊按钮
    jumpInquiry: function () {
        var objCurrent = Page.getCurrentPage();
        var P2PIntent = "doctorList";
        if (RenderParam.carrierId == "440004" || RenderParam.carrierId == "10220094" || RenderParam.carrierId == "10000051" || RenderParam.carrierId == "000051" || RenderParam.carrierId == "370092"
            || RenderParam.carrierId == "410092" || RenderParam.carrierId == "420092" || RenderParam.carrierId == "450092") {
            P2PIntent = "doctorIndex";
        }
        if (RenderParam.carrierId == "V520094") {
            P2PIntent = "homeTab3";
        }
        var objDoctorP2P = LMEPG.Intent.createIntent(P2PIntent);
        objDoctorP2P.setParam('userId', RenderParam.userId);
        objDoctorP2P.setParam('s_demo_id', "demo");
        objDoctorP2P.setParam('tabId', "tab-4");

        if (RenderParam.carrierId == "10000051") {
            objDoctorP2P.setParam('isBack', 1);
        }
        LMEPG.Intent.jump(objDoctorP2P, objCurrent);

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
    //跳转->确诊小区
    jumpDepartment: function (btn) {
        var department = btn.id === 'btn-8' ? 'nCoV' : btn.id === "btn-9" ? 'heart' : 'urine';
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("nCoV-hospital-department");
        objDst.setParam('department', department);
        LMEPG.Intent.jump(objDst, objCurrent);
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
            areaCode: RenderParam.areaCode
        };
        var json = {
            doctorId: doctorId,
            avatarUrl: avatarUrl
        };
        return urlPrefix + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
    }
}

function onBack() {
    if (RenderParam.carrierId === '440004' && RenderParam.isExitApp === '1') {
        if(window.WebViewJavascriptBridge) {
            WebViewJavascriptBridge.callHandler("QuitBrowser", {'param':""}, function (_ret) {});
            return;
        }
    }

    if (RenderParam.isExitApp === '1') { // apk2.0平台，且需要直接退出应用，只有问诊功能模块
        LMEPG.Intent.back('IPTVPortal');
    }

    if (RenderParam.carrierId == "430002") {
        var industryLmp = [-1];
        if (industryLmp.indexOf(parseInt(RenderParam.lmp)) > -1) {
            LMAndroid.JSCallAndroid.doExitApp(); // 直接退出应用
            return;
        }
    }
    if (RenderParam.carrierId == "V520094") {
        LMEPG.Intent.back();
        return;
    }
    if ((RenderParam.carrierId == '520092' || RenderParam.carrierId == '520095') && RenderParam.fromLaunch == '1') {
        LMEPG.Intent.back('IPTVPortal');
        return;
    }
    if (RenderParam.carrierId == '10000051' && RenderParam.areaCode == '216') {
        if (RenderParam.lmp == '190' || RenderParam.lmp == '191') {
            LMEPG.Intent.back("IPTVPortal");
            return
        }
    }
    //回到活动界面
    var judge = getComputedStyle(G('second-model'), null).display;
    if (judge == 'none') {
        LMEPG.Intent.back()
    } else {
        // 如果当弹出框时，按返回，就把弹出框隐藏掉
        Hide('second-model');
    }

}