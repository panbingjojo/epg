var buttons = [];
var Page = {
    selfData: [],
    province: "",
    canTurnPage: false,
    isDiff: null,
//页面初始化操作
    init: function () {
        Page.isDiff = RenderParam.lmcid === '450001'
        if (Page.isDiff) {
            G('is-show').style.display = 'inline'
            var date = new Date()
            var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            G('update-time').innerHTML = time

           // RenderParam.epidemicDetails.overseas = RenderParam.epidemicDetails.data_foreign
            // RenderParam.epidemicDetails.main = RenderParam.epidemicDetails.data_inland_all
        }
        buttons.push({
            id: "total-data",
            name: '按钮',
            type: 'img',
            beforeMoveChange: Page.switchPage,
            click: ""
        });
        Page.getProvinceById();
        Page.getDataById();
        Page.getDetailData(Page.province, function (res) {
            Page.renderView();
            Page.renderLocalView(res);
            LMEPG.BM.init("total-data", buttons, "", true);
        })

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

    areaCode: [
        {"areaID": "208", "areaName": "内蒙古"},
        {"areaID": "205", "areaName": "北京"},
        {"areaID": "201", "areaName": "天津"},
        {"areaID": "216", "areaName": "山东"},
        {"areaID": "206", "areaName": "河北"},
        {"areaID": "207", "areaName": "山西"},
        {"areaID": "213", "areaName": "安徽"},
        {"areaID": "232", "areaName": "上海"},
        {"areaID": "212", "areaName": "江苏"},
        {"areaID": "202", "areaName": "浙江"},
        {"areaID": "214", "areaName": "福建"},
        {"areaID": "220", "areaName": "海南"},
        {"areaID": "218", "areaName": "广东"},
        {"areaID": "219", "areaName": "广西"},
        {"areaID": "228", "areaName": "青海"},
        {"areaID": "217", "areaName": "广西"},
        {"areaID": "219", "areaName": "湖北"},
        {"areaID": "231", "areaName": "湖南"},
        {"areaID": "215", "areaName": "江西"},
        {"areaID": "204", "areaName": "河南"},
        {"areaID": "225", "areaName": "西藏"},
        {"areaID": "222", "areaName": "四川"},
        {"areaID": "221", "areaName": "重庆"},
        {"areaID": "226", "areaName": "陕西"},
        {"areaID": "223", "areaName": "贵州"},
        {"areaID": "224", "areaName": "云南"},
        {"areaID": "227", "areaName": "甘肃"},
        {"areaID": "229", "areaName": "宁夏"},
        {"areaID": "230", "areaName": "新疆"},
        {"areaID": "210", "areaName": "吉林"},
        {"areaID": "209", "areaName": "辽宁"},
        {"areaID": "211", "areaName": "黑龙江"},
    ],

    getProvinceById: function () {
        if (RenderParam.lmcid == "000051" || RenderParam.lmcid == "10000051") {
            for (var i = 0; i < Page.areaCode.length; i++) {
                if (Page.areaCode[i].areaID == RenderParam.areaCode) {
                    Page.province = Page.areaCode[i].areaName;
                    break;
                }
            }
        } else {
            for (var i = 0; i < Page.areaMap.length; i++) {
                if (Page.areaMap[i].areaID == RenderParam.lmcid) {
                    Page.province = Page.areaMap[i].areaName;
                    break;
                }
            }
        }
    },
    getDataById: function () {
        var provinceData = RenderParam.epidemicStats.province_data;
        for (var i = 0; i < provinceData.length; i++) {
            if (provinceData[i].pname == Page.province) {
                Page.selfData = provinceData[i];
                break;
            }
        }
    }
    ,

    renderLocalView: function (data) {
        var html = ''

        html += '<div class="local-head">' + Page.province + '</div>'

        html += '<table id="data-td-2" class="data-td data-td-0" >';
        html += '<tr class="row-1"> <td class="col-1">';
        html += '<p class="p-1">新增确诊</p>';
        html += '<p class="p-2 cols-1">' + data.confirm_add + ' </p></td>';

        html += '<td class="col-2"><p class="p-1">';
        html += '新增本土</p>';
        html += ' <p class="p-2 cols-2">' + data.confirm_local + '</p></td>';

        html += ' <td class="col-3"><p class="p-1">新增境外</p>';
        html += '  <p class="p-2 cols-7">' + data.confirm_overseas + ' </p></td>';

        html += '</tr>';

        html += '<tr class="row-1"> <td class="col-1">';
        html += '<p class="p-1">现有确诊</p>';
        html += '<p class="p-2 cols-1">' + data.confirm_now + ' </p></td>';

        html += '<td class="col-2"><p class="p-1">';
        html += '累计确诊</p>';
        html += ' <p class="p-2 cols-2">' + data.confirm + '</p></td>';

        html += ' <td class="col-3"><p class="p-1">累计治愈</p>';
        html += '  <p class="p-2 cols-4">' + data.cure + ' </p></td>';

        html += '</tr></table>';

        G('local-data').innerHTML = html
    },

// 渲染详情页面数据
    renderView: function () {
        // 填写统计数据
        //if (RenderParam.epidemicDetails.code != 0) return;

        var data = RenderParam.epidemicDetails.main[0];
        var overseasData = RenderParam.epidemicDetails.overseas[0];

        var oversesData = (overseasData.confirm_add - overseasData.died_add - overseasData.cure_add) > 0 ? "+" + (overseasData.confirm_add - overseasData.died_add - overseasData.cure_add) : (overseasData.confirm_add - overseasData.died_add - overseasData.cure_add);
        var htm = '';

        if (typeof (Page.selfData.confirm_add) == "undefined") {
            Page.selfData.confirm_add = '+0';
        }

        htm += '<div class="g-title">国内疫情</div>'
        htm += '<table class="data-td">';

        htm += '<tr class="row-1"><td class="col-2"><p class="p-1">';
        !Page.isDiff ? htm += '较昨日<span class="cols-2">' + (data.confirm_add >= 0 ? "+" + data.confirm_add : data.confirm_add) + '</span></p>' : '';
        htm += ' <p class="p-2 cols-2">' + (data.confirm - (Page.isDiff ? data.confirm_add : 0)) + '</p>';
        htm += ' <p class="p-3">累计确诊</p></td>';

        var diffValue = (((+data.confirm_add) - (+data.died_add) - (+data.cure_add)) >= 0 ? "+" + ((+data.confirm_add) - (+data.died_add) - (+data.cure_add)) : ((+data.confirm_add) - (+data.died_add) - (+data.cure_add)));
        htm += ' <td class="col-3"><p class="p-1">' + (!Page.isDiff ? '较昨日<span class="cols-3">' + diffValue + '</span>' : '') + '</p>';
        htm += '  <p class="p-2 cols-3">' + ((+data.confirm) - (+data.died) - (+data.cure) - (Page.isDiff ? diffValue : 0)) + ' </p>';
        htm += '  <p class="p-3">现存确诊 </p></td>';

        htm += '  <td class="col-4"> <p class="p-1">' + (!Page.isDiff ? ('较昨日<span class="cols-4">' + (data.overseas_add >= 0 ? "+" + data.overseas_add : data.overseas_add) + '</span>') : '') + '</p>';
        htm += ' <p class="p-2 cols-4">' + (data.overseas - (Page.isDiff ? data.overseas_add : 0)) + '</p>';
        htm += ' <p class="p-3"> 境外输入 </p></td>';

        htm += '<td class="col-1">';
        htm += '<p class="p-1">' + (!Page.isDiff ? ('较昨日<span class="cols-1">' + (data.asymptomatic_add >= 0 ? "+" + data.asymptomatic_add : data.asymptomatic_add) + '</span>') : '') + '</p>';
        htm += '<p class="p-2 cols-1">' + (data.asymptomatic - (Page.isDiff ? data.asymptomatic_add : 0)) + '</p>';
        htm += '<p class="p-3">无症状</p> </td></tr>';


        if (!this.isDiff) {
            htm += '<tr class="row-2"> <td class="col-1">';
            htm += '<p class="p-1">' + (!Page.isDiff ? ('较昨日<span class="cols-5">' + (data.severe_add >= 0 ? "+" + data.severe_add : data.severe_add) + '</span>') : '') + '</p>';
            htm += '<p class="p-2 cols-5">' + (data.severe - (Page.isDiff ? data.severe_add : 0)) + ' </p>';
            htm += '<p class="p-3">现存重症</p> </td>';

            htm += '<td class="col-2"><p class="p-1">';
            !Page.isDiff ? htm += '较昨日<span class="cols-6">' + (data.suspect_add >= 0 ? "+" + data.suspect_add : data.suspect_add) + '</span></p>' : '';
            htm += ' <p class="p-2 cols-6">' + (data.suspect - (Page.isDiff ? 0 : 0) < 0 ? 0 : data.suspect - (Page.isDiff ? data.suspect_add : 0)) + '</p>';
            htm += ' <p class="p-3">现存疑似</p></td>';
        }

        htm += ' <td class="col-3"><p class="p-1">' + (!Page.isDiff ? ('较昨日<span class="cols-7">' + (data.died_add >= 0 ? "+" + data.died_add : data.died_add) + '</span>') : '') + '</p>';
        htm += '  <p class="p-2 cols-7">' + (data.died - (Page.isDiff ? data.died_add : 0)) + ' </p>';
        htm += '  <p class="p-3">累计死亡 </p></td>';

        if (!this.isDiff) {
            htm += ' <td class="col-4"> <p class="p-1">' + (!Page.isDiff ? ('较昨日<span class="cols-8">' + (data.cure_add >= 0 ? "+" + data.cure_add : data.cure_add) + '</span>') : '') + '</p>';
            htm += ' <p class="p-2 cols-8">' + (data.cure - (Page.isDiff ? data.cure_add : 0)) + '</p>';
            htm += ' <p class="p-3"> 累计治愈 </p></td>';
        }

        htm += '</tr></table>'

        htm += '<div class="g-title">海外疫情</div>'
        htm += '<table id="data-td-2" class="data-td" style="margin-top: 20px;margin-left: 15px">';
        htm += '<tr class="row-1"> <td class="col-1">';
        htm += '<p class="p-1">' + (!Page.isDiff ? ('较昨日<span class="cols-1">' + oversesData + '</span>') : '') + '</p>';
        htm += '<p class="p-2 cols-1">' + ((+overseasData.confirm) - (+overseasData.died) - (+overseasData.cure) - (Page.isDiff ? oversesData : 0)) + ' </p>';
        htm += '<p class="p-3">现存确诊</p> </td>';

        htm += '<td class="col-2"><p class="p-1">';
        !Page.isDiff ? (htm += '较昨日<span class="cols-2">' + (overseasData.confirm_add >= 0 ? "+" + overseasData.confirm_add : overseasData.confirm_add) + '</span></p>') : '';
        htm += ' <p class="p-2 cols-2">' + (overseasData.confirm - (Page.isDiff ?overseasData.confirm_add : 0)) + '</p>';
        htm += ' <p class="p-3">累计确诊</p></td>';

        htm += ' <td class="col-3"><p class="p-1">' + (!Page.isDiff ? ('较昨日<span class="cols-7">' + (overseasData.died_add >= 0 ? "+" + overseasData.died_add : overseasData.died_add) + '</span>') : '') + '</p>';
        htm += '  <p class="p-2 cols-7">' + (overseasData.died - (Page.isDiff ? overseasData.died_add : 0)) + ' </p>';
        htm += '  <p class="p-3">累计死亡 </p></td>';

        htm += '  <td class="col-4"> <p class="p-1">' + (!Page.isDiff ? ('较昨日<span class="cols-8">' + (overseasData.cure_add >= 0 ? "+" + overseasData.cure_add : overseasData.cure_add) + '</span>') : '') + '</p>';
        htm += ' <p class="p-2 cols-8">' + (overseasData.cure - (Page.isDiff ? overseasData.cure_add : 0)) + '</p>';
        htm += ' <p class="p-3"> 累计治愈 </p></td></tr></table>';

        G("total-data").innerHTML = htm;
    }
    ,


// 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("area-data-prev");
        currentPage.setParam("focusId", LMEPG.BM.getCurrentButton().id);
        return currentPage;
    }
    ,
//跳转->数据统计
    jumpData: function () {
        var txt = '截止：' + RenderParam.epidemicDetails.main[0].last_msg_dt + '数据统计：' + RenderParam.epidemicDetails.data[0].content;
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("area-data");
        objDst.setParam('detailTitle', txt);
        LMEPG.Intent.jump(objDst, objCurrent);
    }
    ,
    //跳转->疫情播报
    jumpIndex: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("report-index");
        objDst.setParam('focusIndex2', "btn-2");
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    switchPage: function (dir, current) {
        switch (dir) {
            case "up":
                G('scroll').style.marginTop = '0px'
                Page.canTurnPage = false
                G('down').style.display = 'block'
                break;
            case "down":
                var isDiffArea = RenderParam.lmcid === '450094' || RenderParam.lmcid === '450092' || RenderParam.lmcid === '450001';
                if (!Page.canTurnPage) {
                    G('scroll').style.marginTop = -320 + 'px'
                    Page.canTurnPage = true
                    if (isDiffArea) {
                        G('down').style.display = 'none'
                    }
                } else {
                    if (isDiffArea) {
                        return;
                    }
                    Page.jumpData();
                }

                break;
        }
    },

    getDetailData: function (province, cb) {
        LMEPG.ajax.postAPI('Epidemic/getDetailData', {
            'province': province
        }, function (res) {
            cb(JSON.parse(res))
        })
    }

}

function onBack() {
    // LMEPG.Intent.back()
    Page.jumpIndex()

    //回到活动界面
}