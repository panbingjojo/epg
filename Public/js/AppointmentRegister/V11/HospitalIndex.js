/***********************首页导航栏js控制***************************/
// 定义全局按钮
var buttons = [];

// 医院页数
var hospitalPageCount = 0;
// 当前选择的区域id，""表示默认
var areaId = "";
// 当前区域数组下标
var region = -1;

// 返回按键
function onBack() {
    Page.onBack();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("appointmentRegister");
        if (!LMEPG.ButtonManager.getCurrentButton().id.startWith('nav_') || LMEPG.ButtonManager.getCurrentButton().id === 'record') {
            currentPage.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        } else {
            currentPage.setParam('focusIndex', Home.defaultFocusId);
        }
        // 当前页码
        currentPage.setParam("page", DataList.hospitalPage);
        // 当前区域下标
        LMEPG.UI.Marquee.stop();
        currentPage.setParam("region", region);
        // 当前区域id
        currentPage.setParam("areaId", areaId);
        return currentPage;
    },

    /**
     * 返回事件
     */
    onBack: function () {
        if (RenderParam.carrierId=="520095" && RenderParam.lmp === '51') {
            LMEPG.Intent.back("IPTVPortal")
        } else {
            LMEPG.Intent.back();
        }
    }
};

//页面显示控制
var Home = {

    // 当前页默认有焦点的按钮ID
    defaultFocusId: 'recommended-1',
    defaultUrl: g_appRootPath + "/Public/img/hd/Home/V10/",

    navImgs: [],                            //导航栏图片数组

    //页面初始化操作
    init: function () {
        Home.initRenderAll();                //渲染页面
        Home.initButtons();                 // 初始化焦点按钮
    },

    /**
     * 初始化渲染页面,将后台活动的数据和前端dom绑定
     */
    initRenderAll: function () {
        DataList.regionData = Home.formatRegionData(RenderParam.areaList);
        DataList.createRegion(DataList.regionData);//渲染区域选择
        DataList.hospitalData.list = Home.formatHospitalData(RenderParam.hospitalList);
        DataList.createHospital(DataList.hospitalData.list)//渲染医院列表
    },

    /**
     * 渲染推荐位
     */
    renderRecommendPosition: function () {
        // 遍历推荐列表， 注意二号不是推荐位，是观看历史
        for (var i = 0; i < RenderParam.pageInfo.data.length; i++) {
            var data = RenderParam.pageInfo.data[i];
            switch (data.position) {
                case "21":
                    // 第一个位置
                    G("recommend_1_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_1_vip_icon");
                    break;
                case "22":
                    // 第一个位置
                    G("recommend_2_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_2_vip_icon");
                    break;
                case "23":
                    // 第三个位置
                    G("recommend_3_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_3_vip_icon");
                    break;
                case "24": // 第四个位置
                    G("recommend_4_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_4_vip_icon");
                    break;
                case "25": // 第五个位置
                    G("recommend_5_bg").src = addFsUrl(data.image_url);
                    updateVipIcon(data, "recommend_5_vip_icon");
                    break;
                case "26": // 第六个位置
                    G("recommend_6_bg").src = addFsUrl(data.image_url);
                    break;
            }
        }
    },

    /**
     * 初始化焦点按钮。应当在页面渲染完毕后，最后一步再调用设置焦点按钮。
     */
    initButtons: function () {
        Home.initRegionBtn();               // 初始化[区域按钮]

        // 焦点和页面恢复
        G("btn-region").innerHTML = RenderParam.region == -1 ? "请选择" : DataList.regionData[RenderParam.region].city_name;
        LMEPG.UI.Marquee.stop();
        LMEPG.UI.Marquee.start("btn-region", 4, 5, 50, "left", "scroll");

        areaId = RenderParam.areaId;
        region = RenderParam.region;
        for (var i = 1; i < RenderParam.page; i++) {
            DataList.nextRecommendedPage();
        }
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        if (lastFocusId == "btn-order" && (RenderParam.isVip == "1" || RenderParam.isVip == 1)) {
            lastFocusId = Home.defaultFocusId;
        }
        LMEPG.ButtonManager.init(lastFocusId, buttons, "", true);
    },
    //导航栏焦点效果
    navFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).src = Home.navImgs[btn.cPosition].focus_in;
        } else {
            G(btn.id).src = Home.navImgs[btn.cPosition].focus_out;
        }
    },

// 初始化区域选择按钮
    initRegionBtn: function () {
        buttons.push({
            id: 'btn-region',
            name: '区域选择',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'region-btn-1',
            nextFocusUp: 'record',
            nextFocusDown: 'recommended-1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_2.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_2.png",
            click: Home.onClickNavigation,
            focusChange: Home.regionFocus,
            beforeMoveChange: DataList.onRecommendBeforeMoveChange,
            cType: "region",
        });

        for (var i = 0; i < DataList.hospitalCut; i++) {
            buttons.push({
                id: 'recommended-' + (i + 1),
                name: '推荐位',
                type: 'img',
                nextFocusLeft: 'recommended-' + i,
                nextFocusRight: 'recommended-' + (i + 2),
                nextFocusUp: 'recommended-' + (i - 2),
                nextFocusDown: 'recommended-' + (i + 4),
                backgroundImage: "",
                focusImage: "",
                cIconBox: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/box_tab1_1.png",
                click: Home.onJumpDepartment,
                focusChange: Home.recommendedFocus,
                beforeMoveChange: DataList.onRecommendBeforeMoveChange,
                // cPosition: (j * 3) + i, // 列表下标
            });
        }
        for (var i = 0; i < DataList.regionCut; i++) {
            buttons.push({
                id: 'region-btn-' + (i + 1),
                name: '区域选择',
                type: 'div',
                nextFocusLeft: 'region-btn-' + i,
                nextFocusRight: 'region-btn-' + (i + 2),
                nextFocusUp: 'record',
                nextFocusDown: 'recommended-1',
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_null.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_2.png",
                click: Home.onClickRegion,
                focusChange: Home.regionFocus,
                beforeMoveChange:'',
                cType: "region",
            });
        }

        buttons.push({
            id: 'record',
            name: '挂号记录',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '' ,
            nextFocusUp: '',
            nextFocusDown: 'btn-region',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_null.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_2.png",
            click: Home.toRecordPage,
            focusChange: '',
            cType: "region",
        })

    },

    toRecordPage:function(){
        var objCurrent = Page.getCurrentPage()
        var objDst = LMEPG.Intent.createIntent("registeredRecord");
        LMEPG.Intent.jump(objDst, objCurrent ,LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    regionFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.UI.Marquee.stop();
            LMEPG.UI.Marquee.start(btn.id, 4, 5, 50, "left", "scroll");
            if (btn.cType = "region") {
                G("region-content").style.display = "block";
            }
        } else {
            // LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            if (btn.cType = "region") {
                G("region-content").style.display = "none";
            }
        }
    },
    // 加边框焦点效果
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommended-hover");
            LMEPG.UI.Marquee.start(btn.id + "-title", 13, 5, 50, "left", "scroll");
            EpgClass.epgFocus(btn, hasFocus);
            LMEPG.CssManager.addClass(btn.id + "-title", "titleClass");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "recommended-hover");
            LMEPG.UI.Marquee.stop();
            EpgClass.epgFocus(btn, hasFocus);
            LMEPG.CssManager.removeClass(btn.id + "-title", "titleClass");
        }
    },

    onClickRegion: function (btn) {
        var pos = G(btn.id).getAttribute("pos");
        console.log(DataList.regionData[pos].city_id);
        // 获取指定区域的医院列表
        var postData = {
            "areaId": DataList.regionData[pos].city_id,
        };
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("GuaHao/getAppointmentHospitalList", postData, function (data) {
            var data = JSON.parse(data);
            DataList.hospitalData.list = Home.formatHospitalData(data);
            DataList.createHospital(DataList.hospitalData.list); // 渲染医院列表
            LMEPG.UI.dismissWaitingDialog();

            areaId = postData.areaId;
            RenderParam.areaId = areaId;
            console.log("areaId post:" + areaId);
            region = parseInt(G(btn.id).getAttribute("pos"));
            G("btn-region").innerHTML = G(btn.id).innerHTML;
        });
    },
    // 导航栏目点击
    onClickNavigation: function (btn) {
        LMEPG.ButtonManager.setSelected(btn.id, true);
        Home.currNavId = btn.cNavId;
        switch (btn.id) {
            case "nav-btn-1":
                Page.jumpHomeTab("home");
                break;
            case "nav-btn-2":
                Page.jumpHomeTab("homeTab1");
                break;
            case "nav-btn-3":
                Page.jumpHomeTab("homeTab2");
                break;
            case "nav-btn-4":
                Page.jumpHomeTab("homeTab3");
                break;
            case "nav-btn-5":
                Page.jumpHomeTab("homeTab4");
                break;
            case "nav-btn-6":
                Page.jumpHomeTab("homeTab5");
                break;
            // case "search-btn":
            //     Page.jumpSearchPage();
            //     break;
        }
    },
    // 推荐位点击
    onClickRecommendPosition: function (btn) {
        if (btn.id == 'btn-renew' || btn.id == 'btn-order') {
            Page.jumpBuyVip("首页订购", null);
        } else {
            var data = getRecommendDataByPosition(btn.cPosition);
            switch (data.entryType) {
                case "5":
                    // 视频播放
                    var videoObj = data.play_url instanceof Object ? data.play_url : JSON.parse(data.play_url);
                    var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

                    // 创建视频信息
                    var videoInfo = {
                        "sourceId": data.source_id,
                        "videoUrl": videoUrl,
                        "title": data.title,
                        "type": data.model_type,
                        "userType": data.user_type,
                        "freeSeconds": data.freeSeconds,
                        "entryType": 1,
                        "entryTypeName": "home",
                        "focusIdx": btn.id,
                    };

                    if (isAllowPlay(videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        Page.jumpBuyVip(videoInfo.title, videoInfo);
                    }
                    break;
                case "4":
                    // 更多视频
                    Page.jumpHealthVideoHome(data.title, data.source_id, "1");
                    break;
                case "13":
                    // 专辑
                    Page.jumpAlbumPage(data.source_id);
                    break;
                case "3":
                    // 活动
                    Page.jumpActivityPage(data.source_id);
                    break;
                case "14":
                    //预约挂号首页
                    Page.jumpGuaHaoPage();
                    break;
                case "22":
                    // 具体地址跳转
                    LMEPG.UI.showToast("具体地址跳转");
                    break;
                case "10":
                    Page.jump39Hospital();
                    break;
            }
        }
    },

    // 格式化区域数据
    formatRegionData: function (areaList) {
        var regionData = [];
        if (areaList.result == 0) {
            if (areaList.list != null && areaList.list.length > 0) {
                for (var i = 0; i < areaList.list[0].city.length; i++) {
                    var item = {};
                    item.city_id = areaList.list[0].city[i].city_id;
                    item.city_name = areaList.list[0].city[i].city_name;
                    regionData.push(item);
                }
            }
        } else {
            LMEPG.UI.showToast("获取区域列表失败");
            Home.defaultFocusId = "nav-btn-2";
        }
        return regionData;
    },

    // 格式化医院数据
    formatHospitalData: function (hospitalList) {
        var hospitalData = [];
        if (hospitalList.result == 0) {
            DataList.hospitalPage = 1;
            if (hospitalList.list != null && hospitalList.list.length > 0) {
                for (var i = 0; i < hospitalList.list.length; i++) {
                    var item = {};
                    item.hospital_id = hospitalList.list[i].hosl_id;
                    item.hospital_name = hospitalList.list[i].hosl_name;
                    item.is_province = hospitalList.list[i].is_province;
                    item.img_url = RenderParam.guahaoUrl + hospitalList.list[i].hosl_pic;
                    item.is_vip = "0";
                    item.produce = hospitalList.list[i].hosl_name;
                    hospitalData.push(item);
                }
            }
        } else {
            LMEPG.UI.showToast("获取医院列表失败");
            Home.defaultFocusId = "nav-btn-2";
        }
        return hospitalData;
    },

    // 跳转到医院首页或扫码页面（扫码页面的医院不支持在电视端挂号）
    onJumpDepartment: function (btn) {
        var pos = G(btn.id).getAttribute("pos");
        console.log(pos);
        console.log(DataList.hospitalData.list[pos].hospital_id);
        var hospital_id = DataList.hospitalData.list[pos].hospital_id;
        var is_province = DataList.hospitalData.list[pos].is_province;
        var objCurrent = Page.getCurrentPage();
        if (is_province == 0) {
            var objDst = LMEPG.Intent.createIntent("departmentDetail");
        } else {
            var objDst = LMEPG.Intent.createIntent("createCode");
        }
        objDst.setParam("hospital_id", hospital_id);
        objDst.setParam("is_province", is_province);
        LMEPG.Intent.jump(objDst, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    }
};

var DataList = {
    regionData: [
        {"city_id": 1, "city_name": "贵阳市"}, //区域数据
        {"city_id": 1, "city_name": "黔东南市"},
        {"city_id": 1, "city_name": "凯里市"},
        {"city_id": 1, "city_name": "六盘水市"},
        {"city_id": 1, "city_name": "毕节市"},
        {"city_id": 1, "city_name": "遵义市"}
    ],
    hospitalCut: 6,
    regionCut: 5,
    page: 0,
    hospitalPage: 1,
    hospitalData: {
        "list": [{
            "hospital_name": "1",
            "img_url": Home.defaultUrl + "text_2.png",
            "is_vip": "0",
            "produce": "今天很开心，我要做一个成功的人是"
        },
            {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "1",
                "produce": "今天很开心"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "0",
                "produce": "今天很开心，我要做一个成功的人是"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "0",
                "produce": "今天很开心"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "1",
                "produce": "今天很开心，我要做一个成功的人是"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "0",
                "produce": "今天很开心"
            }, {
                "hospital_name": "1",
                "img_url": Home.defaultUrl + "text_2.png",
                "is_vip": "1",
                "produce": "今天很开心，我要做一个成功的人是"
            },]
    },
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    // 创建区域
    createRegion: function (arr) {
        LMEPG.UI.Marquee.stop();
        var sHtml = "";
        var regionDataInfo = DataList.cut(arr, DataList.page, this.regionCut);
        console.log(regionDataInfo)
        for (var i = 0; i < regionDataInfo.length; i++) {
            sHtml += '<div id="region-btn-' + (i + 1) + '" class="region-btn" pos="' + (i + DataList.page) + '">' + regionDataInfo[i].city_name + '</div>';
        }
        G("region-list").innerHTML = sHtml;
        DataList.upDateArrow();
    },

    // 创建医院
    createHospital: function (arr) {
        G("table-list").innerHTML = "";
        var sHtml = "";
        var defaultImg = "'/Public/img/hd/Home/V10/default.png'";
        var hospitalDataInfo = DataList.cut(arr, this.hospitalCut * (this.hospitalPage - 1), this.hospitalCut);
        for (var i = 0; i < hospitalDataInfo.length; i++) {
            sHtml += '<div id="recommended-' + (i + 1) + '" pos="' + (i + DataList.hospitalCut * (DataList.hospitalPage - 1)) + '" class="recommended">';
            sHtml += '<img id="recommended-' + (i + 1) + '-bg" class="recommended-bg" src="' + hospitalDataInfo[i].img_url + '" onerror="this.src=' + defaultImg + '" />';
            if (hospitalDataInfo[i].is_vip == "1") {
                sHtml += '<img id="recommend-' + (i + 1) + '-vip-icon" class="vip-icon" src="__ROOT__/Public/img/hd/Home/V10/icon_vip.png"/>';
            }
            sHtml += '<div id="recommended-' + (i + 1) + '-title" class="recommended-title">' + hospitalDataInfo[i].produce + '</div>';
            sHtml += '</div>';
        }
        G("table-list").innerHTML = sHtml;
        G("pages").innerHTML = "" + this.hospitalPage + " / " + Math.ceil(arr.length / this.hospitalCut);
        hospitalPageCount = Math.ceil(arr.length / this.hospitalCut);
        // EpgClass.updatePosition();
        DataList.upDateRecommendedArrow();
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                switch (current.id) {
                    case 'recommended-1':
                    case 'recommended-2':
                    case 'recommended-3':
                        if (DataList.hospitalPage == 1)
                            LMEPG.ButtonManager.requestFocus("btn-region");
                        else {
                            // 上一页
                            var nextFocusId;
                            if (current.id == 'recommended-1')
                                nextFocusId = 'recommended-4';
                            else if (current.id == 'recommended-2')
                                nextFocusId = 'recommended-5';
                            else
                                nextFocusId = 'recommended-6';
                            var isGoNext = DataList.prevRecommendedPage();
                            if (isGoNext)
                                LMEPG.ButtonManager.requestFocus(nextFocusId);
                        }
                        return false;
                        break;
                }
                break;
            case 'down':
                switch (current.id) {
                    case 'recommended-4':
                    case 'recommended-5':
                    case 'recommended-6':
                        // 下一页
                        LMEPG.UI.Marquee.stop();
                        var nextFocusId;
                        if (current.id == 'recommended-4') {
                            nextFocusId = 'recommended-1';
                        } else if (current.id == 'recommended-5') {
                            nextFocusId = 'recommended-2';
                            if (Math.ceil(DataList.hospitalData.list.length / DataList.hospitalCut) == DataList.hospitalPage + 1) {
                                if (DataList.hospitalData.list.length % DataList.hospitalCut < 2) {
                                    nextFocusId = 'recommended-1';
                                }
                            }
                        } else {
                            nextFocusId = 'recommended-3';
                            if (Math.ceil(DataList.hospitalData.list.length / DataList.hospitalCut) == DataList.hospitalPage + 1) {
                                if (DataList.hospitalData.list.length % DataList.hospitalCut < 2) {
                                    nextFocusId = 'recommended-1';
                                } else if (DataList.hospitalData.list.length % DataList.hospitalCut < 3) {
                                    nextFocusId = 'recommended-2';
                                }
                            }
                        }
                        var isGoNext = DataList.nextRecommendedPage();
                        if (isGoNext)
                            LMEPG.ButtonManager.requestFocus(nextFocusId);
                        return false;
                        break;
                }
                break;
            case 'left':
                switch (current.id) {
                    case 'region-btn-1':
                        DataList.prevPage();
                        break;
                    case 'recommended-1':
                    case 'recommended-4':
                        return false;
                        break;
                }
                break;
            case 'right':
                switch (current.id) {
                    case 'region-btn-5':
                        console.log('right.....')
                        DataList.nextPage();
                        break;
                    case 'recommended-3':
                    case 'recommended-6':
                        return false;
                        break;
                }
                break;
        }
    },

    prevPage: function () {
        if (DataList.page > 0) {
            DataList.page--;
            DataList.createRegion(DataList.regionData);
            LMEPG.ButtonManager.requestFocus("region-btn-1");
        } else {
            LMEPG.ButtonManager.requestFocus("btn-region");
            return false;
        }
    },

    nextPage: function () {
        console.log('nextPage： ' + DataList.page)
        if ((DataList.regionData.length - DataList.page) > DataList.regionCut) {
            DataList.page++;
            console.log('nextPage...if： ' + DataList.page)
            DataList.createRegion(DataList.regionData);
            LMEPG.ButtonManager.requestFocus("region-btn-5");
        } else {

        }
    },

    upDateArrow: function () {
        G("arrow-pre").style.display = "none";
        G("arrow-next").style.display = "none";
        if (DataList.page > 0) {
            G("arrow-pre").style.display = "block";
        } else {
            G("arrow-pre").style.display = "none";
        }
        if ((DataList.regionData.length - DataList.page) > DataList.regionCut) {
            G("arrow-next").style.display = "block";
        } else {
            G("arrow-next").style.display = "none";
        }
    },

    upDateRecommendedArrow: function () {
        G("m-pre").style.display = "none";
        G("m-next").style.display = "none";
        if (DataList.hospitalPage > 1) {
            // G("m-pre").style.display = "block";
        } else {
            G("m-pre").style.display = "none";
        }
        if (Math.ceil(DataList.hospitalData.list.length / DataList.hospitalCut) > DataList.hospitalPage) {
            G("m-next").style.display = "block";
        } else {
            G("m-next").style.display = "none";
        }
    },


    prevRecommendedPage: function () {
        if (DataList.hospitalPage > 1) {
            DataList.hospitalPage--;
            DataList.createHospital(DataList.hospitalData.list)//渲染医院列表
            return true;
        }
        return false;
    },

    nextRecommendedPage: function () {
        if (Math.ceil(DataList.hospitalData.list.length / DataList.hospitalCut) > DataList.hospitalPage) {
            DataList.hospitalPage++;
            DataList.createHospital(DataList.hospitalData.list)//渲染医院列表
            return true;
        }
        return false;
    },


}

var EpgClass = {
    START_TOP: "",//初始高度
    START_LEFT: "",//初始横坐标
    START_WIDTH: "",//初始宽度
    START_HEIGHT: "",//初始高度
    ZOOM: 1.1,//放大倍数
    PADDING: 42,
    DRAG: 10,//抖动值
    //epg标清盒子放大效果
    epgFocus: function (btn, hasFocus) {
        if (hasFocus) {
            EpgClass.START_HEIGHT = parseInt(getPropertyValue(btn.id, "height")) + "px";
            EpgClass.START_WIDTH = parseInt(getPropertyValue(btn.id, "width")) + "px";
            EpgClass.START_TOP = parseInt(getPropertyValue(btn.id, "top")) + "px";
            EpgClass.START_LEFT = parseInt(getPropertyValue(btn.id, "left")) + "px";
            var boxUrl = btn.cIconBox;
            G(btn.id + "-bg").style.background = 'url("' + boxUrl + '")  no-repeat';
            G(btn.id + "-bg").style.backgroundPosition = 'center';
            G(btn.id).style.width = parseInt(getPropertyValue(btn.id, "width")) * EpgClass.ZOOM + "px";
            G(btn.id).style.height = parseInt(getPropertyValue(btn.id, "height")) * EpgClass.ZOOM + "px";
            G(btn.id).style.top = parseInt(getPropertyValue(btn.id, "top")) - EpgClass.DRAG + "px";
            G(btn.id).style.left = parseInt(getPropertyValue(btn.id, "left")) - EpgClass.DRAG + "px";

        } else {
            G(btn.id + "-bg").style.background = 'url("")  no-repeat';
            G(btn.id).style.width = EpgClass.START_WIDTH;
            G(btn.id).style.height = EpgClass.START_HEIGHT;
            G(btn.id).style.top = EpgClass.START_TOP;
            G(btn.id).style.left = EpgClass.START_LEFT;

        }
    },
//界面渲染调整;
    updatePosition: function () {
        for (var i = 1; i < 7; i++) {
            // if (i != 2) {
            if (LMEPG.Func.isEmpty(G("recommended-" + i + "-bg")))
                continue;
            G("recommended-" + i + "-bg").style.padding = EpgClass.PADDING + "px";
            G("recommended-" + i).style.top = parseInt(getPropertyValue("recommended-" + i, "top")) - EpgClass.PADDING + "px";
            G("recommended-" + i).style.left = parseInt(getPropertyValue("recommended-" + i, "left")) - EpgClass.PADDING + "px";
            // }
        }
    },
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
    if(RenderParam.carrierId =="520092" || RenderParam.carrierId =="520095"){
        lmInitGo();
    }
};
