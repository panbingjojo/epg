var imgUrl = g_appRootPath + "/Public/img/hd/Home/V15/Home/";
var buttons = [];

var cutDown = 5;
var timer = null
var tempId = ''

var Buttons = {
    SCROLL: [500, 450, 530, 150],//每屏幕滚动参数
    FOOTER: true,
//        导航按钮
    navInit: function () {
        buttons.push({
            id: 'search',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'collection',
            nextFocusUp: '',
            nextFocusDown: 'recommend-1-img',
            backgroundImage: imgUrl + "bg_search.png",
            focusImage: imgUrl + "f_search.png",
            click: Page.jumpSearchPage,
            focusChange: "",
            moveChange: "",
            cIdx: ""
        }, {
            id: 'collection',
            name: '',
            type: 'img',
            nextFocusLeft: 'search',
            nextFocusRight: 'history',
            // nextFocusRight: 'vip',
            nextFocusUp: '',
            nextFocusDown: 'recommend-1-img',
            backgroundImage: imgUrl + "bg_collection.png",
            focusImage: imgUrl + "f_collection.png",
            click: Page.jumpCollection,       //宁夏电信跳转我的家模块
            focusChange: "",
            moveChange: "",
            cIdx: ""
        }, {
            id: 'history',
            name: '',
            type: 'img',
            nextFocusLeft: 'collection',
            nextFocusRight: 'vip',
            nextFocusUp: '',
            nextFocusDown: 'recommend-1-img',
            backgroundImage: imgUrl + "bg_history.png",
            focusImage: imgUrl + "f_history.png",
            click: Page.jumpHistory,
            focusChange: "",
            moveChange: "",
            cIdx: ""
        }, {
            id: 'vip',
            name: '',
            type: 'img',
            nextFocusLeft: 'history',
            // nextFocusLeft: 'collection',
            nextFocusRight: 'lock',
            nextFocusUp: '',
            nextFocusDown: 'recommend-1-img',
            backgroundImage: imgUrl + "bg_vip.png",
            focusImage: imgUrl + "f_vip.png",
            click: Page.jumpBuyVipInfo,
            focusChange: "",
            moveChange: "",
            cIdx: ""
        }, {
            id: 'lock',
            name: '',
            type: 'img',
            nextFocusLeft: 'vip',
            // nextFocusLeft: 'collection',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'recommend-1-img',
            backgroundImage: imgUrl + "child-lock.png",
            focusImage: imgUrl + "child-lock-f.png",
            click: Page.childrenLock,
            focusChange: "",
            moveChange: "",
            cIdx: ""
        }, {
            id: 'pop-back',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'pop-continue',
            nextFocusUp: '',
            backgroundImage: "/Public/img/hd/Home/V25/back.png",
            focusImage: "/Public/img/hd/Home/V25/back-choose.png",
            click: function () {
                LMEPG.Intent.back('IPTVPortal')
            },
            focusChange: '',
            beforeMoveChange: '',
            moveChange: "",
        }, {
            id: 'pop-continue',
            type: 'img',
            nextFocusLeft: 'pop-back',
            nextFocusRight: '',
            nextFocusUp: '',
            backgroundImage: "/Public/img/hd/Home/V25/continue.png",
            focusImage: "/Public/img/hd/Home/V25/continue-choose.png",
            click: function () {
                H('pop')
                clearInterval(timer)
                cutDown = 5
                LMEPG.BM.requestFocus(tempId)
            },
            focusChange: '',
            beforeMoveChange: '',
            moveChange: "",
        });
    },
    /**
     * 第一屏按钮
     */
    firstPartInit: function () {
        buttons.push({
                id: 'recommend-1-img',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend-2-img',
                nextFocusUp: 'search',
                nextFocusDown: 'recommend-6-img',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: "",
                moveChange: "",
                cIdx: Data.dataListInfo[2].item_data,
                cType: "carousel"
            }, {
                id: 'recommend-2-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommend-1-img',
                nextFocusRight: 'recommend-3-img',
                nextFocusUp: 'search',
                nextFocusDown: 'recommend-4-img',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: "",
                moveChange: "",
                cIdx: Data.firstRecommendImg[0].dataType,
                cType: ""
            }
            , {
                id: 'recommend-3-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommend-2-img',
                nextFocusRight: '',
                nextFocusUp: 'search',
                nextFocusDown: 'recommend-5-img',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: "",
                moveChange: "",
                cIdx: Data.firstRecommendImg[1].dataType,
                cType: ""
            }, {
                id: 'recommend-4-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommend-1-img',
                nextFocusRight: 'recommend-5-img',
                nextFocusUp: 'recommend-2-img',
                nextFocusDown: 'recommend-9-img',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: "",
                moveChange: "",
                cIdx: Data.firstRecommendImg[2].dataType,
                cType: ""
            }, {
                id: 'recommend-5-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommend-4-img',
                nextFocusRight: '',
                nextFocusUp: 'recommend-3-img',
                nextFocusDown: 'recommend-10-img',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: "",
                moveChange: "",
                cIdx: Data.firstRecommendImg[3].dataType,
                cType: ""
            }, {
                id: 'recommend-6-img',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'recommend-7-img',
                nextFocusUp: 'recommend-1-img',
                nextFocusDown: 'activity-2-img',
                backgroundImage: Data.firstRecommendImg[4].normal,
                focusImage: Data.firstRecommendImg[4].focus_in,
                click: Page.onClickRecommendPosition,//Page.jumpMenuPage,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: Data.firstRecommendImg[4].dataType,
                scroll: Buttons.SCROLL[0],
                cType: ""

            }, {
                id: 'recommend-7-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommend-6-img',
                nextFocusRight: 'recommend-8-img',
                nextFocusUp: 'recommend-1-img',
                nextFocusDown: 'activity-2-img',
                backgroundImage: Data.firstRecommendImg[5].normal,
                focusImage: Data.firstRecommendImg[5].focus_in,
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: Data.firstRecommendImg[5].dataType,
                scroll: Buttons.SCROLL[0],
                cType: ""

            }, {
                id: 'recommend-8-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommend-7-img',
                nextFocusRight: 'recommend-9-img',
                nextFocusUp: 'recommend-4-img',
                nextFocusDown: 'activity-2-img',
                backgroundImage: Data.firstRecommendImg[6].normal,
                focusImage: Data.firstRecommendImg[6].focus_in,
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: Data.firstRecommendImg[6].dataType,
                scroll: Buttons.SCROLL[0],
                albumName: "commonFreeVideo",
                cType: ""
            }, {
                id: 'recommend-9-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommend-8-img',
                nextFocusRight: 'recommend-10-img',
                nextFocusUp: 'recommend-4-img',
                nextFocusDown: 'activity-2-img',
                backgroundImage: Data.firstRecommendImg[7].normal,
                focusImage: Data.firstRecommendImg[7].focus_in,
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: Data.firstRecommendImg[7].dataType,
                scroll: Buttons.SCROLL[0],
                cType: ""
            }, {
                id: 'recommend-10-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'recommend-9-img',
                nextFocusRight: '',
                nextFocusUp: 'recommend-5-img',
                nextFocusDown: 'activity-2-img',
                backgroundImage: Data.firstRecommendImg[8].normal,
                focusImage: Data.firstRecommendImg[8].focus_in,
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: Data.firstRecommendImg[8].dataType,
                scroll: Buttons.SCROLL[0],
                cType: ""
            }, {
                id: 'activity-2-img',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: 'recommend-8-img',
                nextFocusDown: 'three-part-1-img',
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: Data.dataListInfo[3].item_data,
                scroll: Buttons.SCROLL[1],
                cType: "carousel"
            }
        );
    },

    /**
     * 第三屏按钮
     */

    fourInit: function () {
        for (var i = 1; i < 9; i++) {
            buttons.push({
                id: 'four-part-' + i + '-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'four-part-' + (i - 1) + '-img',
                nextFocusRight: 'four-part-' + (i + 1) + '-img',
                nextFocusUp: 'four-part-' + (i - 4) + '-img',
                nextFocusDown: 'four-part-' + (i + 4) + '-img',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendFocus,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: i <= Data.fourRecommendImg.length ? Data.fourRecommendImg[i - 1].dataType : '',
                scroll: Buttons.SCROLL[2],
                cType: ""
            });
        }
    },
    /**
     * 第四屏按钮
     */
    fiveInit: function () {
        for (var i = 1; i < 9; i++) {
            buttons.push({
                id: 'five-part-' + i + '-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'five-part-' + (i - 1) + '-img',
                nextFocusRight: 'five-part-' + (i + 1) + '-img',
                nextFocusUp: 'five-part-' + (i - 4) + '-img',
                nextFocusDown: 'five-part-' + (i + 4) + '-img',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Focus.recommendRole,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: i <= Data.fiveRecommendImg.length ? Data.fiveRecommendImg[i - 1].dataType : '',
                scroll: Buttons.SCROLL[3],
                cType: "",
                index: i,
            });
        }
    },
    /**
     * 第五屏按钮
     */
    initButton: function () {
        Buttons.navInit();
        Buttons.firstPartInit();
        Buttons.fourInit();
        Buttons.fiveInit();
    }
};
/**
 * 焦点选中
 */
var Focus = {
    beforeMoveChange: function (dir, current) {
        switch (dir) {
            case "up":
                switch (current.id) {
                    case "activity-2-img":
                        Focus.scrollTop(Buttons.SCROLL[0]);
                        break;
                    case "btn_three-part-6-img":
                        Focus.scrollTop(Buttons.SCROLL[1]);
                        break;
                    case "four-part-1-img":
                    case "four-part-2-img":
                    case "four-part-3-img":
                    case "four-part-4-img":
                        Focus.scrollTop(Buttons.SCROLL[1]);
                        LMEPG.BM.requestFocus("three-part-1-img");
                        return false;
                        break;
                    case "five-part-1-img":
                    case "five-part-2-img":
                    case "five-part-3-img":
                    case "five-part-4-img":
                        Focus.scrollTop(Buttons.SCROLL[2]);
                        LMEPG.BM.requestFocus("four-part-5-img");
                        return false;
                        break;
                    case "five-part-5-img":
                    case "five-part-6-img":
                    case "five-part-7-img":
                    case "five-part-8-img":
                        if (G("scroll").style.top == "-2080px") {
                            Buttons.FOOTER = false;
                        }
                        if (Buttons.FOOTER == false) {
                            Focus.scrollTop(current.scroll);
                            Buttons.FOOTER = true;
                            return false;
                        }
                        break;
                }
                break;
            case "down":
                switch (current.id) {
                    case "four-part-5-img":
                    case "four-part-6-img":
                    case "four-part-7-img":
                    case "four-part-8-img":
                        Focus.scrollTop(-current.scroll);
                        LMEPG.BM.requestFocus("five-part-1-img");
                        return false;
                        break;

                    case "five-part-5-img":
                    case "five-part-6-img":
                    case "five-part-7-img":
                    case "five-part-8-img":
                        // alert(Buttons.FOOTER);
                        if (G("scroll").style.top == "-2080px" && Buttons.FOOTER) {
                            Buttons.FOOTER = false;
                        }
                        if (Buttons.FOOTER) {
                            Focus.scrollTop(-current.scroll);
                            Buttons.FOOTER = false;
                            return false;
                        }
                        break;
                    case "activity-2-img":
                    case "recommend-6-img":
                    case "recommend-7-img":
                    case "recommend-8-img":
                    case "recommend-9-img":
                    case "recommend-10-img":
                    case "three-part-1-img":
                    case "three-part-2-img":
                    case "three-part-3-img":
                    case "three-part-4-img":
                    case "three-part-5-img":
                        LMEPG.BM.getButtonById('activity-2-img').focusImage = RenderParam.fsUrl + Data.allData[1].pic
                        Focus.scrollTop(-current.scroll);
                        break;
                }
                break;

            case "left":
                if (current.id == "activity-2-img") {
                    animal2.prePages();
                    G("activity-2-img").setAttribute("data-link", animal2.index);
                    // return false;
                }
                break;
            case "right":
                if (current.id == "activity-2-img") {
                    animal2.nextPages();
                    G("activity-2-img").setAttribute("data-link", animal2.index);
                    // return false;
                }
                break;
        }
    },
    recommendFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "recommendHover");
            if (btn.id === 'recommend-1-img') {
                G('bottom').style.width = '552px';
            }
        } else {
            G('bottom').style.width = '528px';
            LMEPG.CssManager.removeClass(btn.id, "recommendHover");
        }
    },

    recommendDoctorFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id.slice(0, 13) + 'bg', "recommendHoverNew");
            G(btn.id).style.width = 205 + 'px';
            G(btn.id.slice(0, 13) + 'state').style.width = 205 + 'px';
            G(btn.id).style.height = 205 + 'px';
            G(btn.id.slice(0, 13) + 'state').style.height = 205 + 'px';
            G(btn.id).style.marginTop = 5 + 'px';
            G(btn.id.slice(0, 13) + 'state').style.top = 5 + 'px';
            G(btn.id).style.marginLeft = 5 + 'px';
            G(btn.id.slice(0, 13) + 'state').style.left = 5 + 'px';
            G(btn.id).style.zIndex = 997 + '';
            G(btn.id.slice(0, 13) + 'state').style.zIndex = 998 + '';
        } else {
            LMEPG.CssManager.removeClass(btn.id.slice(0, 13) + 'bg', "recommendHoverNew");
            G(btn.id).style.width = 180 + 'px';
            G(btn.id.slice(0, 13) + 'state').style.width = 180 + 'px';
            G(btn.id).style.height = 180 + 'px';
            G(btn.id.slice(0, 13) + 'state').style.height = 180 + 'px';
            G(btn.id).style.marginTop = 18 + 'px';
            G(btn.id.slice(0, 13) + 'state').style.top = 18 + 'px';
            G(btn.id).style.marginLeft = 18 + 'px';
            G(btn.id.slice(0, 13) + 'state').style.left = 18 + 'px';
        }
    },

    btnAllDoctorFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).src = g_appRootPath + '/Public/img/Common/btn_all_doctor_list_f.png';
        } else {
            G(btn.id).src = g_appRootPath + '/Public/img/Common/btn_all_doctor_list.png';
        }
    },

    recommendRole: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass('five-part-' + btn.index, "five-part-index");
            LMEPG.CssManager.addClass(btn.id, "recommendRole");
            LMEPG.CssManager.addClass(btn.id + "-role", "box-4");
        } else {
            LMEPG.CssManager.removeClass('five-part-' + btn.index, "five-part-index");
            LMEPG.CssManager.removeClass(btn.id, "recommendRole");
            LMEPG.CssManager.removeClass(btn.id + "-role", "box-4");
        }
    },

    scrollTop: function (distance) {
        G("scroll").style.top = parseInt(G("scroll").style.top) + distance + "px";
    },
    /**
     * 按键事件回调
     * @param code
     */
    onKeyDown: function (code) {
        switch (code) {
            case KEY_3:
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                if (keys.length >= 4) {
                    if (keys[keys.length - 1] == KEY_3
                        && keys[keys.length - 2] == KEY_9
                        && keys[keys.length - 3] == KEY_8
                        && keys[keys.length - 4] == KEY_3) {
                        // 进入测试服，青海改成了3893
                        Page.jumpTestPage();
                    } else if (keys[keys.length - 1] == KEY_3
                        && keys[keys.length - 2] == KEY_8
                        && keys[keys.length - 2] == KEY_8
                        && keys[keys.length - 1] == KEY_3) {
                        // 进入视频问诊，青海改成了2886
                        Page.jumpVideoVisitHome();
                    }
                }
        }
    }

};

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_3: Focus.onKeyDown
    }
);


/**
 * 数据部分
 */
var Data = {
    navImgs: [],                            //导航栏图片数组
    firstRecommendImg: [],
//        twoRecommendImg: [],
    threeRecommendImg: [],
    fourRecommendImg: [],
    fiveRecommendImg: [],
    dataListInfo: RenderParam.homeConfigInfo.data.entry_list,
    allData: [],

    /**
     * 导航栏标题
     */
    renderNav: function () {
        G("two-part").innerHTML = RenderParam.navConfig[1].navigate_name;
        if (RenderParam.carrierId === '10000051' && RenderParam.areaCode === '204') {
            G("three-part").innerHTML = "心理咨询";
        } else {
            G("three-part").innerHTML = RenderParam.navConfig[2].navigate_name;
        }
        G("four-part").innerHTML = RenderParam.navConfig[3].navigate_name;
        G("five-part").innerHTML = RenderParam.navConfig[4].navigate_name;
        //G("notice").innerHTML = RenderParam.marqueeText;
    },
    /**
     * 渲染第一屏数据
     */
    firstRecommend: function () {
        /**
         * 下面五个规则推荐位
         */
        if (RenderParam.homeConfigInfo.result == 0) {
            var recommentData1 = Data.dataListInfo[0].item_data;
            var recommentData3 = Data.dataListInfo[1].item_data;
            var recommentData4 = Data.dataListInfo[2].item_data;
            for (var i = 0; i < recommentData1.length; i++) {

                G("recommend-" + (2 + i) + "-img").src = addFsUrl(recommentData1[i].img_url);
                Data.firstRecommendImg.push(
                    {
                        "normal": addFsUrl(recommentData1[i].img_url),
                        "dataType": recommentData1[i]
                    });
            }
            for (var i = 0; i < recommentData3.length; i++) {
                G("recommend-" + (6 + i) + "-img").src = addFsUrl(recommentData3[i].img_url);
                Data.firstRecommendImg.push({
                    "normal": addFsUrl(recommentData3[i].img_url),
                    "focus_in": addFsUrl(recommentData3[i].img_url),
                    "dataType": recommentData3[i]
                });
            }

            G("recommend-1-img").src = addFsUrl(recommentData4[0].img_url);
        }

    },

    /**
     * 将首次拉取到的图片链接放入allData数组中，用于之后的第二屏左右翻页逻辑
     * */
    addPageData: function () {
        Data.dataListInfo[3].item_data.forEach(function (item) {
            Data.allData.push({
                pic: item.img_url,
            })
        })
    },

    /**
     * 渲染第二屏数据
     */
    towRecommendData: function (cb) {
        /**
         * 下面五个规则推荐位
         */
        if (RenderParam.homeConfigInfo.result == 0) {
//                alert(Data.dataListInfo);
            var recommentData1 = Data.dataListInfo[3].item_data;

            var deviceModelId = [];
            for (var i = 0; i < recommentData1.length; i++) {
                deviceModelId[i] = parseInt(JSON.parse(recommentData1[i].parameters)[0].param);
                if (!deviceModelId[i]) {
                    deviceModelId.pop(i)
                }
            }
        }

        //调用方法，为第二屏翻页逻辑做准备
        Data.addPageData();

        for (var i = 0; i < deviceModelId.length; i++) {
            G('activity-' + (i + 1) + '-img').src = addFsUrl(recommentData1[i].img_url);
            G('activity-' + (i + 1) + '-img').style.left = i === 1 ? '-18px' : '0px';
            G('activity-' + (i + 1) + '-img').style.top = '0px';
            G('activity-' + (i + 1) + '-img').style.width = '103%';
            G('activity-' + (i + 1) + '-img').style.height = '103%';
        }
        cb();
    },

    /**
     * 渲染第三屏数据
     */
    threeRecommend: function (cb) {

        var requestInfo = {
            deptId: '',       // 医院科室ID
            deptIndex: 0,     // 医院科室编号
            page: 1,          // 医生列表分页所在分页
            pageSize: 5       // 医生列表单页显示医生数量
        }
        LMEPG.Inquiry.p2pApi.getDoctorList(true, requestInfo, function (data) {
            var html = '<div id="three-part" class="title">在线问医</div>' +
                '<img class="line" src="/Public/img/hd/Home/V15/Home/line.png"/>';
            for (var i = 0; i < data.list.length; i++) {
                var tempImgUrl = Pages.getDocAvatar(data.list[i].doc_id, data.list[i].avatar_url,
                    RenderParam.carrierId);
                /*var tempImgUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl,
                    data.result.list[i].doc_id, data.result.list[i].avatar_url, RenderParam.carrierId);*/
                var stateImgUrl = Pages.transformStatus({
                    onlineState: data.list[i].online_state,
                    isFakeBusy: data.list[i].is_fake_busy,
                    isIMInquiry: data.list[i].is_im_inquiry,
                });
                html += '<div id="three-part-' + (i + 1) + '">' +
                    '<img id="three-part-' + (i + 1) + '-bg" class="recommend box-6"' +
                    '    src="' + g_appRootPath + '/Public/img/Common/bg_doctor_list.png">' +
                    '<img id="three-part-' + (i + 1) + '-img" class="recommend box-6"' +
                    ' src=' + tempImgUrl + ' onerror="this.src=\'' + g_appRootPath + '/Public/img/Common/default.png\'"' +
                    'style="width: 180px;height: 180px;border-radius: 50%;margin-top: 18px;margin-left: 18px;position: relative;">' +
                    '<img id="three-part-' + (i + 1) + '-state" src= ' + g_appRootPath + stateImgUrl.img + ' ' +
                    'style="width: 180px; height: 180px; top: 18px; left: 18px; position: absolute">' +
                    '<p id="doc_name_' + (i + 1) + '" class="doc_name">' + data.list[i].doc_name + '</p>' +
                    '<p id="job_title_' + (i + 1) + '" class="job_title">' + data.list[i].job_title + '</p>' +
                    '<p id="department_' + (i + 1) + '" class="department">' + data.list[i].department + '</p>' +
                    '<p class="inquiry">问诊量：<span id="inquiry_num_' + (i + 1) + '">' + LMEPG.Inquiry.p2pApi.switchInquiryNumStr(data.list[i].inquiry_num) + '</span></p>' +
                    '</div>';

                buttons.push({
                    id: 'three-part-' + (i + 1) + '-img',
                    name: '',
                    type: 'img',
                    nextFocusLeft: 'three-part-' + i + '-img',
                    nextFocusRight: 'three-part-' + (i + 2) + '-img',
                    nextFocusUp: 'btn_three-part-6-img',
                    nextFocusDown: 'four-part-1-img',
                    backgroundImage: "",
                    focusImage: "",
                    click: Page.onClickRecommendPosition,
                    focusChange: Focus.recommendDoctorFocus,
                    beforeMoveChange: Focus.beforeMoveChange,
                    moveChange: "",
                    cIdx: '',
                    scroll: Buttons.SCROLL[1],
                    cType: "doctor-detail",
                    docId: data.list[i].doc_id
                });
            }

            html += '<div id="three-part-6">' +
                '                    <img id="btn_three-part-6-img" class="recommend box-6"\n' +
                '                         src="' + g_appRootPath + '/Public/img/Common/btn_all_doctor_list.png">' +
                '                </div>';

            buttons.push({
                id: 'btn_three-part-6-img',
                name: '',
                type: 'img',
                nextFocusLeft: 'three-part-1-img',
                nextFocusRight: '',
                nextFocusUp: 'activity-2-img',
                nextFocusDown: 'three-part-5-img',
                backgroundImage: "",
                focusImage: "",
                click: Page.onClickRecommendPosition,
                focusChange: Focus.btnAllDoctorFocus,
                beforeMoveChange: Focus.beforeMoveChange,
                moveChange: "",
                cIdx: '',
                cType: "",
            });

            LMEPG.BM.addButtons(buttons);
            G('doctor-list').innerHTML = html;
            cb();
        }, function (error) {
            LMEPG.Log.error("getDoctorList fail：" + error);
            cb();
        })
    },

    /**
     * 渲染第四屏数据
     */
    fourRecommend: function () {
        /**
         * 下面8个规则推荐位
         */
        if (RenderParam.homeConfigInfo.result == 0) {
            var recommentData1 = Data.dataListInfo[5].item_data;
            for (var i = 0; i < recommentData1.length; i++) {
                G("four-part-" + (1 + i) + "-img").src = addFsUrl(recommentData1[i].img_url);
                Data.fourRecommendImg.push({
                    "normal": addFsUrl(recommentData1[i].img_url),
                    "focus_in": addFsUrl(recommentData1[i].img_url),
                    "dataType": recommentData1[i]
                });
            }
        }

    },

    /**
     * 渲染第五屏数据
     */
    fiveRecommend: function () {
        /**
         * 下面8个规则推荐位
         */
        if (RenderParam.homeConfigInfo.result == 0) {
            var recommentData1 = Data.dataListInfo[6].item_data;
            for (var i = 0; i < recommentData1.length; i++) {
                G("five-part-" + (1 + i) + "-img").src = addFsUrl(recommentData1[i].img_url);
                G("five-part-" + (1 + i) + "-img-role").src = addFsUrl(recommentData1[i].img_url);
                Data.fiveRecommendImg.push({
                    "normal": addFsUrl(recommentData1[i].img_url),
                    "focus_in": addFsUrl(recommentData1[i].img_url),
                    "dataType": recommentData1[i]
                });
            }
        }
    },
};

/**
 * 界面渲染
 */
var Pages = {
    defaultFocusId: RenderParam.areaCode === '207' ? "recommend-10-img" : "recommend-1-img",
    /**
     * 初始化渲染页面,将后台活动的数据和前端dom绑定
     */
    initRenderAll: function () {
        Data.renderNav();
        Data.firstRecommend();       //第一屏数据
        Data.towRecommendData(function () {
        });//第二屏数据
        Data.threeRecommend(function () {
            var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) || RenderParam.focusIndex == "night-medicine" ? Pages.defaultFocusId : RenderParam.focusIndex;
            LMEPG.ButtonManager.init(lastFocusId, buttons, "", true);
        });//第三屏数据
        Data.fourRecommend();//第四屏数据
        Data.fiveRecommend();//第五屏数据
    },
    /**
     * 渲染主题背景
     */
    renderThemeUI: function () {
        if (LMEPG.Func.isExist(RenderParam.themeImage) && RenderParam.themeImage !== "") {
            var themeImage = RenderParam.fsUrl + RenderParam.themeImage;
            G("body").src = themeImage;
        }
    },

    /** 跑马灯信息初始化 */
    initMarquee: function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('notice-wrapper').innerHTML = '<marquee id="notice" scrollamount="5">' + data.content + '</marquee>';
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo);
        })
    },

    init: function () {
        if (RenderParam.carrierId != '640092') {
            document.querySelector('.logo').style.setProperty('width', '54px');
            document.querySelector('.logo').style.setProperty('top', '26px');
            document.querySelector('.logo').style.setProperty('left', '80px');
            document.querySelector('.logo').style.setProperty('height', '54px');
        }
        if (RenderParam.carrierId == '440004') {
            document.querySelector('.notice').style.setProperty('top', '28px');
            document.querySelector('.notice').style.setProperty('width', '440px');
            document.querySelector('.notice').style.setProperty('left', '215px');
            document.querySelector('.logo').style.setProperty('width', '134px');
            document.querySelector('.logo').style.setProperty('top', '24px');
            document.querySelector('.logo').style.setProperty('height', '45px');
        }
        if (RenderParam.carrierId == '11000051') {
            document.querySelector('.logo').style.setProperty('width', '96px');
            document.querySelector('.logo').style.setProperty('top', '30px');
            document.querySelector('.logo').style.setProperty('left', '67px');
            document.querySelector('.logo').style.setProperty('height', '34px');
        }
        document.querySelector('.notice').style.setProperty('display', 'block');
        if (RenderParam.carrierId == '630092') {
            //数据探针上报
            var dataRP = {
                userId: RenderParam.userId,
                pageKey: window.location.pathname,
                pageType: 'portal',
            }
            DataReport.getValue(1, dataRP);
        }

        LMEPG.UI.setBackGround('sy');
        Pages.setBodyBg();
        Pages.initRenderAll();
        Buttons.initButton();
        animal1.init();
        // animal3.init();
        animal2.init2();
        G("scroll").style.top = RenderParam.scrollTop;
        Buttons.FOOTER = RenderParam.footer;
        // albumFocus(getSearchString("order"));
        Pages.initMarquee();
    },

    setBodyBg: function () {
        if (RenderParam.themeImage) {
            document.body.style.backgroundImage = "url(" + RenderParam.fsUrl + RenderParam.themeImage + ")";
        }
    },
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("home");
        currentPage.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        currentPage.setParam('scrollTop', G("scroll").style.top);
        currentPage.setParam('footer', Buttons.FOOTER ? '1' : '2');   // 1:未到页面底部、2:页面底部
        // currentPage.setParam('loadIndex',  Home.loadIndex);


        if (LMEPG.ButtonManager.getCurrentButton().id == "activity-2-img") {
            var i = 0;
            if (RenderParam.carrierId == '440004') {
                var inx = parseInt(G('activity-2-img').dataset.link);
                currentPage.setParam('order', LMEPG.ButtonManager.getCurrentButton().cIdx[inx].order);
            } else {
                while (i < buttons.length) {
                    if (buttons[i].id == "activity-2-img") {
                        var k = 0;
                        while (k < buttons[i].cIdx.length) {
                            if (JSON.parse(buttons[i].cIdx[k].parameters)[0].param) {
                                currentPage.setParam('order', buttons[i].cIdx[k].order);
                                break;
                            }
                            k = k + 1;
                        }
                        break;
                    }
                    i = i + 1;
                }
            }
        }

        return currentPage;
    },
    /**
     * Logo添加文字
     */
    setLogoRende: function () {
        document.querySelector('.btn').style.setProperty('width', '125px');
        document.querySelector('.logo').style.setProperty('width', '154px');
        document.querySelector('.logo').style.setProperty('top', '20px');
        document.querySelector('.logo').style.removeProperty('left');
        document.querySelector('.logo').style.removeProperty('height');
        document.querySelector('.notice').style.setProperty('left', '234px');
        document.querySelector('.notice').style.setProperty('width', '38%');
        document.querySelector('#notice').style.setProperty('width', '387px');
        document.querySelector('#search').style.setProperty('left', '707px');
        document.querySelector('#collection').style.setProperty('left', '825px');
        document.querySelector('#history').style.setProperty('left', '955px');
        document.querySelector('#vip').style.setProperty('left', '1085px');

    },

    getDocAvatar: function (doctorId, avatarUrl, carrierID, type) {
        var head = {
            func: "getDoctorHeadImage",
            carrierId: carrierID,
            areaCode: "",
        };
        var json = {
            doctorId: doctorId,
            avatarUrl: avatarUrl
        };
        return (type ? RenderParam.expertUrl : RenderParam.cwsHlwyyUrl) + '?head=' + JSON.stringify(head) + '&json=' + JSON.stringify(json);
    },

    transformStatus: function (type) {
        var tempOnlineFlag = {
            img: '/Public/img/Common/state_off_line.png',
        };//默认离线状态

        if (typeof type.isFakeBusy != 'undefined' && type.isFakeBusy === '1') {

            tempOnlineFlag.img = '/Public/img/Common/state_be_busy.png';
        } else {
            if (type.onlineState === "3" || (type.onlineState === "0" && type.isIMInquiry === "1")) { //在线
                tempOnlineFlag.img = '/Public/img/Common/state_on_line.png';

            } else if (type.onlineState === "2" || type.onlineState === "-1" || type.onlineState === "-2") {  //忙碌
                tempOnlineFlag.img = '/Public/img/Common/state_be_busy.png';

            } else if (type.onlineState === "0" || type.onlineState === "1") {  //离线
                tempOnlineFlag.img = '/Public/img/Common/state_off_line.png';
            }
        }
        return tempOnlineFlag;
    },

    changePage: function () {
        var page = Data.allData.length
        for (var i = 1; i < page; i++) {
            G('activity-' + i + '-img').style.left = i === 2 ? '-18px' : '0px';
            G('activity-' + i + '-img').style.top = '0px';
            G('activity-' + i + '-img').style.width = '103%';
            G('activity-' + i + '-img').style.height = '103%';
            G('activity-' + i + '-img').src = RenderParam.fsUrl + Data.allData[i - 1].pic;
        }
    }
};

function albumFocus(order) {
    if (order == "1") {
        animal2.prePages();
        G("activity-2-img").setAttribute("data-link", animal2.index);
    }

    if (order == "3") {
        animal2.nextPages();
        G("activity-2-img").setAttribute("data-link", animal2.index);
    }
    if (order == "4") {
        animal2.nextPages();
        animal2.nextPages();
        G("activity-2-img").setAttribute("data-link", animal2.index);
    }
    if (order == "5") {
        animal2.nextPages();
        animal2.nextPages();
        animal2.nextPages();
        G("activity-2-img").setAttribute("data-link", animal2.index);
    }
}

//获取连接中的值
function getSearchString(key) {
    var str = location.search;
    str = str.substring(1, str.length);

    var arr = str.split("&");
    var obj = new Object();

    for (var i = 0; i < arr.length; i++) {
        var tmp_arr = arr[i].split("=");
        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
}

/**
 * 返回事件
 */
function onBack() {
    //使用挽留页弹窗的都需要增加下面的判断逻辑
    if (Buttons.FOOTER == false || Buttons.FOOTER == '2') {
        //Buttons.FOOTER:  1 or true:未到页面底部; 2 or false:页面底部
        G("scroll").style.top = 0 + "px";
        LMEPG.BM.requestFocus("recommend-1-img");
        Buttons.FOOTER = true;
        // alert(Buttons.FOOTER);
    } else {
        if (RenderParam.fromLaunch == '1') {
            Utility.setValueByName("exitIptvApp");
        } else {
            if (RenderParam.carrierId == '420092') {
                LMEPG.Intent.back("IPTVPortal");
            } else {
                Page.jumpHoldPage();
            }
            // LMEPG.Intent.back("IPTVPortal");
        }
    }
}

/**
 * 轮播模块
 */
(function (w) {
    function Animal(id, radius, bottom, index, data) {
        this.id = id;
        this.radius = radius;
        this.bottom = bottom;
        this.index = index;
        this.timer = null;
        this.timerID = null;
        this.data = data;
    }

    Animal.prototype.init = function () {
        for (var i = 0; i < this.data.length; i++) {
            if (i == 0) {
                G(this.bottom).innerHTML += '<img id="' + this.radius + i + '" class="radius" src="' + imgUrl + 'f_radius.png"/>';
            } else {
                G(this.bottom).innerHTML += '<img id="' + this.radius + i + '" class="radius" src="' + imgUrl + 'bg_radius.png"/>';
            }
        }
        this.time1();
    };

    Animal.prototype.init2 = function () {
        for (var i = 0; i < this.data.length; i++) {
            if (i == 1) {
                G(this.bottom).innerHTML += '<img id="' + this.radius + i + '" class="radius" src="' + imgUrl + 'f_radius.png"/>';
            } else {
                G(this.bottom).innerHTML += '<img id="' + this.radius + i + '" class="radius" src="' + imgUrl + 'bg_radius.png"/>';
            }
        }
//            this.time2();
    };
    Animal.prototype.time1 = function () {
        var that = this;
        this.timer = setInterval(function () {
            if (that.index < that.data.length && that.data[that.index].img_url != "") {
                G(that.id).src = addFsUrl(that.data[that.index].img_url);
                LMEPG.BM.getButtonById(that.id).backgroundImage = addFsUrl(that.data[that.index].img_url);
                G(that.id).setAttribute("data-link", that.index);
                for (var i = 0; i < that.data.length; i++) {
                    G(that.radius + i).src = imgUrl + "bg_radius.png";
                }
                G(that.radius + that.index).src = imgUrl + "f_radius.png";
                that.index++;
                if (that.index == that.data.length) {
                    that.index = 0;
                }
            }

        }, 2000);
    };

    Animal.prototype.stop = function () {
        clearInterval(this.timer);
    };
    Animal.prototype.prePages = function () {
        this.index--;
        if (this.index < 0) {
            this.index = this.data.length - 1;
        }
        Data.allData.unshift(Data.allData.pop())
        Pages.changePage()


        // LMEPG.BM.getButtonById("activity-2-img").backgroundImage = G("activity-1-img").src;
        for (var i = 0; i < this.data.length; i++) {
            G(this.radius + i).src = imgUrl + "bg_radius.png";
        }
        G(this.radius + this.index).src = imgUrl + "f_radius.png";
    };
    Animal.prototype.nextPages = function () {
        this.index++;
        if (this.index == this.data.length) {
            this.index = 0;
        }
        Data.allData.push(Data.allData.shift())
        Pages.changePage()

        // LMEPG.BM.getButtonById("activity-2-img").backgroundImage = G("activity-3-img").src;
        for (var i = 0; i < this.data.length; i++) {
            G(this.radius + i).src = imgUrl + "bg_radius.png";
        }
        G(this.radius + this.index).src = imgUrl + "f_radius.png";
    };
    w.animal1 = new Animal("recommend-1-img", "radius-", "bottom", 1, Data.dataListInfo[2].item_data);
    w.animal2 = new Animal("activity-2-img", "radius-2-", "bottom-2", 1, Data.dataListInfo[3].item_data);
    // w.animal3 = new Animal("three-part-2-img", "radius-3-", "bottom-3", 1, Data.dataListInfo[5].item_data);
}(window));

LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_1: ' keyClick()',
        KEY_2: 'keyClick()',
        KEY_4: 'keyClick()',
        KEY_5: 'keyClick()',
        KEY_6: 'keyClick()',
        KEY_7: 'keyClick()',
        KEY_8: 'keyClick()',
        KEY_9: 'keyClick()',
        KEY_0: 'keyClick()',
    });

function keyClick() {
    if (RenderParam.areaCode === '201') {
        S('pop')
        G('cut-down').innerHTML = cutDown
        tempId = LMEPG.BM.getCurrentButton().id
        LMEPG.BM.requestFocus('pop-back')

        timer = setInterval(function () {
            cutDown--
            G('cut-down').innerHTML = cutDown;
            if (cutDown < 0) {
                H('pop')
                clearInterval(timer)
                LMEPG.Intent.back('IPTVPortal')
            }

        }, 1000)
    }
}

window.onunload = function (ev) {
    LMEPG.mp.destroy();  //释放播放器
};