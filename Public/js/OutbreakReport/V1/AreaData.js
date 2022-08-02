var buttons = [];
var Page = {
    defaultFocusId: "scroll",
    num: 20,
    topKey: 0,
    isDiffArea : null,
    //页面初始化操作
    init: function () {
        Page.isDiffArea = RenderParam.carrierId === '450094' || RenderParam.carrierId === '450092' || RenderParam.carrierId === '450001';
        buttons.push({
            id: "scroll",
            name: '按钮',
            type: 'img',
            beforeMoveChange: Page.switchPage,
            click: ""
        });
        Page.renderView();
        LMEPG.BM.init(Page.defaultFocusId, buttons, "", true);
        if( RenderParam.scrollIndex === '1'){
            Page.topKey = -1580
            G("scroll").style.top = -1580+'px'

            G('icon-title-1').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_1.png'
            G('icon-title-2').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_2.png'
            G('icon-title-3').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_3.png'
            G('icon-title-4').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_4.png'
        }

    },

    areaMap: [
        {"areaID": "320092", "areaName": "江苏"},
        {"areaID": "320005", "areaName": "江苏"},
        {"areaID": "000051", "areaName": "联通"},
        {"areaID": "640092", "areaName": "宁夏"},
        {"areaID": "630092", "areaName": "青海"},
        {"areaID": "630001", "areaName": "青海"},
        {"areaID": "650092", "areaName": "新疆"},
        {"areaID": "420092", "areaName": "湖北"},
        {"areaID": "430002", "areaName": "湖南"},
        {"areaID": "460092", "areaName": "海南"},
        {"areaID": "370092", "areaName": "山东"},
        {"areaID": "370002", "areaName": "山东"},
        {"areaID": "371092", "areaName": "山东"},
        {"areaID": "371002", "areaName": "山东"},
        {"areaID": "210092", "areaName": "辽宁"},
        {"areaID": "220095", "areaName": "吉林"},
        {"areaID": "220094", "areaName": "吉林"},
        {"areaID": "440094", "areaName": "广东"},
        {"areaID": "440004", "areaName": "广东"},
        {"areaID": "440001", "areaName": "广东"},
        {"areaID": "450094", "areaName": "广西"},
        {"areaID": "450092", "areaName": "广西"},
        {"areaID": "450001", "areaName": "广西"},
        {"areaID": "520094", "areaName": "贵州"},
        {"areaID": "520092", "areaName": "贵州"},
        {"areaID": "350092", "areaName": "福建"},
        {"areaID": "410092", "areaName": "河南"},
        {"areaID": "210092", "areaName": "辽宁"},
        {"areaID": "610092", "areaName": "陕西"},
        {"areaID": "510094", "areaName": "四川"},
        {"areaID": "620007", "areaName": "甘肃"},
        {"areaID": "10000051", "areaName": "山东"},
        {"areaID": "10220094", "areaName": "吉林"},
    ],

    // 把指定省份放在前面
    changeFirstPre:function(provinceData) {
        var list = provinceData;
        var item = "";
        var areaName = "";

        // 通过carrierId，转换成省份名称
        for (var i = 0; i < Page.areaMap.length; i++) {
            if (Page.areaMap[i].areaID == RenderParam.lmcid) {
                areaName = Page.areaMap[i].areaName;
                break;
            }
        }

        // 如果找不到这个省份的定义，则返回原数据
        if (areaName == "") {
            return provinceData;
        }

        // 通过省份名称，调整数据顺序，把指定省份调整到第一个位置
        for (var j = 0; j < provinceData.length; j++) {
            if (areaName == provinceData[j].pname) {
                item = provinceData[j];
                provinceData.splice(j, 1);
                provinceData.unshift(item);
                break;
            }
        }

        return provinceData;
    },

    // 渲染详情页面数据
    renderView: function () {
        // 填写统计数据
        // G('total').innerHTML = RenderParam.detailTitle;
        if (RenderParam.epidemicStats.code == 0) {
            var provinceData = RenderParam.epidemicStats.province_data;
            var item = "";

            var strHtml = "";
            strHtml += '<div id="scroll" style="position: absolute;top: 0px">';

            if(!Page.isDiffArea){
                // 国内数据table
                strHtml += '<table cellspacing="0" border="0">';

                // 把指定省份放在前面
                provinceData = Page.changeFirstPre(provinceData);

                // 各省份数据内容
                for (var i = 0; i < provinceData.length; i++) {
                    item = provinceData[i];

                    strHtml += '<tr>'
                        + '<td><img class="icon-box" src= ' + g_appRootPath + '/Public/img/hd/OutbreakReport/V1/blue_box.png>'
                        + '<div class="info">' + item.pname + '</div></td>'
                        + '<td><div class="info-2">' + item.confirm + '</div></td>'
                        + '<td><div class="info-2">' + item.cure + '</div></td>'
                        + '<td><div class="info-2">' + item.died + '</div></td>'
                        + '</tr>';
                }
                strHtml += '</table>';
            }

            if(Page.isDiffArea){
                G('icon-title-1').src =  g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_1.png';
                G('icon-title-2').src =  g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_2.png';
                G('icon-title-3').src =  g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_3.png';
                G('icon-title-4').src =  g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_4.png';
            }


            var internationData = RenderParam.epidemicStats.internation_data;
            // 国际数据table
            strHtml += '<table cellspacing="0" border="0" style="margin-top:'+(Page.isDiffArea?-120 : -30)+'px">';

            // 标题信息
            strHtml += '<tr>'
                + '<th><img class="icon-title" src=' + g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_1.png></th>'
                + '<th><img class="icon-title" src=' + g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_2.png></th>'
                + '<th><img class="icon-title" src=' + g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_3.png></th>'
                + '<th><img class="icon-title" src=' + g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_4.png></th>'
                + '</tr>';

            // 各国家数据内容
            for (var i = 0; i < internationData.length; i++) {
                item = internationData[i];

                strHtml += '<tr>'
                    + '<td><img class="icon-box" src= ' + g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_box.png>'
                    + '<div class="info-3">' + item.pname + '</div></td>'
                    + '<td><div class="info-2">' + item.confirm + '</div></td>'
                    + '<td><div class="info-2">' + item.cure + '</div></td>'
                    + '<td><div class="info-2">' + item.died + '</div></td>'
                    + '</tr>';
            }

            strHtml += '</table>';
            strHtml += '</div>';


            var dom = G("list");
            dom.innerHTML = strHtml;

        } else {
            // 拉取数据失败
            console.log("获取数据失败");
            LMEPG.UI.showToastV1("获取数据失败！");
        }
    },


    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("report-index");
        currentPage.setParam("focusId", LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },
    switchPage: function (dir, current) {
        switch (dir) {
            case "up":
                if(!Page.isDiffArea){
                    if (parseInt(G("scroll").style.top) < 0) {
                        Page.topKey = Page.topKey + Page.num;
                        G("scroll").style.top = Page.topKey + "px"
                        if(parseInt(G("scroll").style.top) >= -1480){
                            G('icon-title-1').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/blue_1.png'
                            G('icon-title-2').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/blue_2.png'
                            G('icon-title-3').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/blue_3.png'
                            G('icon-title-4').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/blue_4.png'
                        }
                    }else {
                        onBack();
                    }
                }else {
                    if (parseInt(G("scroll").style.top) < 0) {
                        Page.topKey = Page.topKey + Page.num;
                        G("scroll").style.top = Page.topKey + "px"
                    }else {
                        onBack();
                    }
                }
                break;

            case "down":
                if(!Page.isDiffArea){
                    if (parseInt(G("scroll").style.top) > -11935) {
                        Page.topKey = Page.topKey - Page.num;
                        G("scroll").style.top = Page.topKey + "px";
                        if(parseInt(G("scroll").style.top) <= -1580){
                            G('icon-title-1').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_1.png'
                            G('icon-title-2').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_2.png'
                            G('icon-title-3').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_3.png'
                            G('icon-title-4').src = g_appRootPath + '/Public/img/hd/OutbreakReport/V1/red_4.png'
                        }
                    }
                }else {
                    if (parseInt(G("scroll").style.top) > - 9740) {
                        Page.topKey = Page.topKey - Page.num;
                        G("scroll").style.top = Page.topKey + "px";
                    }
                }
                break;
        }
    }

}

function onBack() {
    LMEPG.Intent.back()

    //回到活动界面
}