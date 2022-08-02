//挽留页按钮
var HOLD_BUTTONS = ['video-1', 'video-2', 'video-3', 'continue_btn', 'close_btn'];

function inquiryBlacklistHandler (focusIdOnHideDialog) {
    var forbiddenAskTips = '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。';
    LMEPG.UI.commonDialog.show(forbiddenAskTips, ["确定"], function (index) {
        LMEPG.ButtonManager.requestFocus(focusIdOnHideDialog);
    });
}

function noInquiryTimesHandler (focusIdOnHideDialog){
    var noInquiryTimesTips = '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊'
    LMEPG.UI.commonDialog.show(noInquiryTimesTips, ["确定"], function (index) {
        JumpPage.jumpBuyVip();
    });
}

/**
 * 医生不在线处理函数
 */
function showDoctorOfflineTips () {
    LMEPG.UI.showToast('当前医生不在线');
}

/**
 * 医生问诊结束处理函数
 */
function inquiryEndHandler() {

}

/**
 * 页面跳转
 * @type {{}}
 */
var JumpPage = {

    getCurrentPage: function () {
        var current = LMEPG.ButtonManager.getCurrentButton();
        var objCurrent = LMEPG.Intent.createIntent("home");
        var focusIndex = current.id;
        if (HOLD_BUTTONS.indexOf(focusIndex) >= 0) {
            focusIndex = "carousel-link";
        }
        objCurrent.setParam("focusIndex", focusIndex);
        return objCurrent;
    },

    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function (remark, videoInfo, singlePayItem) {
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }
        var objcurrent = JumpPage.getCurrentPage();

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("remark", remark);
        objOrderHome.setParam("isPlaying", 1);
        objOrderHome.setParam("singlePayItem", typeof (singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objcurrent);
    },

    /**
     * 跳转菜单选中页
     * @param btn
     * @param classifyId
     * @param modelType
     */
    jumpMenuPage: function (btn, classifyId, modelType) {

        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("menuTab");
        objHomeTab.setParam("userId", RenderParam.userId);
        objHomeTab.setParam("pageIndex", btn.cIdx);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    /**
     * 跳转保健页
     * @param btn
     * @param classifyId
     * @param modelType
     */
    jumpHealthCarePage: function (btn, classifyId, modelType) {

        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("healthCare");
        objHomeTab.setParam("userId", RenderParam.userId);
        objHomeTab.setParam("pageIndex", btn.cIdx);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    /**
     * 跳转 - 搜索页
     * */
    jumpSearchPage: function (btn) {
        var objCurrent = JumpPage.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        // objCurrent.setParam("classifyId", RenderParam.classifyId);
        // objCurrent.setParam("fromId", "1");
        objCurrent.setParam("focusIndex", btn.id);
        objCurrent.setParam("page", "0");

        var objSearch = LMEPG.Intent.createIntent("search");
        objSearch.setParam("userId", RenderParam.userId);
        objSearch.setParam("position", "tab1");


        LMEPG.Intent.jump(objSearch, objCurrent);
    },
    /**
     * 跳转 - 收藏页
     */
    jumpCollectPage: function () {
        var objCurrent = JumpPage.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        // objCurrent.setParam("classifyId", RenderParam.classifyId);
        objCurrent.setParam("position", "collect");
        objCurrent.setParam("fromId", "1");
        objCurrent.setParam("page", "0");

        var objCollect = LMEPG.Intent.createIntent("collect");
        objCollect.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objCollect, objCurrent);
    },
    /**
     * 跳转到预约挂号页
     */
    jumpGuaHaoPage: function () {
        //预约挂号首页
        var objCurrent = JumpPage.getCurrentPage();

        var objHospitalList = LMEPG.Intent.createIntent("orderRegister");
        LMEPG.Intent.jump(objHospitalList, objCurrent);
    },

    videoMore: function () {
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("classifyId", 1);
        objHome.setParam("fromId", "2");

        var objAlbum = LMEPG.Intent.createIntent("album");
        objAlbum.setParam("userId", RenderParam.userId);
        objAlbum.setParam("albumName", "QHfreeAlbum");
        objAlbum.setParam("inner", 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转 - 我的家
     */
    jumpMyHome: function () {
        // 上一级页面 --- 主页
        // var objCurrent = JumpPage.getCurrentPage();
        var objHome = JumpPage.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        objHome.setParam("fromId", "1");
        objHome.setParam("page", "0");

        // 目标页面 -- 我的家
        var objFamilyHome = LMEPG.Intent.createIntent("familyMemberHome");
        LMEPG.Intent.jump(objFamilyHome, objHome);
    },
    /**
     * 调整到在线问诊界面
     */
    jumpDoctorHome: function () {
        var objHome = JumpPage.getCurrentPage();
        var objFamilyHome = LMEPG.Intent.createIntent("doctorIndex");
        LMEPG.Intent.jump(objFamilyHome, objHome);
    },
    jumpDoctorEvaluation: function (str) {
        var objCurrent = JumpPage.getCurrentPage();
        var objDepartment = LMEPG.Intent.createIntent("doctorEvaluation");
        objDepartment.setParam("InquiryData", str);
        LMEPG.Intent.jump(objDepartment, objCurrent);
    },

    inquiryAdvisoryDoctor: function (btnId) {
        var inquiryInfo = {
            userInfo: {
                isVip: RenderParam.isVip,                                    // 用户身份信息标识
                accountId: RenderParam.accountId,                            // IPTV业务账号
            },
            memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
            moduleInfo: {
                moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                focusId: btnId,                                              // 当前页面的焦点Id
                intent: JumpPage.getCurrentPage(),                           // 当前模块页面路由标识
            },
            serverInfo: {
                fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                cwsHlwyyUrl: RenderParam.cwsHlwyyUrl,                 // cws互联网医院模块链接地址
                teletextInquiryUrl: RenderParam.teletextInquiryUrl,    // 微信图文问诊服务器链接地址
            },
            blacklistHandler: inquiryBlacklistHandler,            // 校验用户黑名单时处理函数
            noTimesHandler: noInquiryTimesHandler,                // 检验普通用户无问诊次数处理函数
            doctorOfflineHandler: showDoctorOfflineTips,          // 检验医生离线状态时处理函数
            inquiryEndHandler: inquiryEndHandler,                 // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        }

        LMEPG.Inquiry.p2p.oneKeyInquiry(inquiryInfo); // 启动一键问诊
    },

    /**
     * 跳转健康检测
     * @param btn 触发事件的按键对象
     */
    jumpHealthMeasure: function (btn) {
        var objSrc = JumpPage.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('testIndex');
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    doctorOfflineHandler:  function () {
        LMEPG.UI.commonEditDialog.show("当前助理医生不在线，您可留下您的电话号码，我们将尽快与您联系。", ["确&nbsp;&nbsp;定", "取&nbsp;&nbsp;消"], function (btnIndex, inputValue) {
            if (btnIndex === 0) {
                if (LMEPG.ui.isTelNum(inputValue)) {
                    LMEPG.Inquiry.expertApi.postUserTel(inputValue, function (data) {
                        if (data.result == "0") {
                            LMEPG.ui.commonEditDialog.close();
                            LMEPG.ui.showToast("提交成功");
                        } else {
                            LMEPG.ui.showToast("提交失败，请重新提交");
                        }
                    });
                    return true;
                } else {
                    LMEPG.ui.showToast("请输入正确的电话号码");
                    return true;
                }

            } else {
                console.log("取消");
            }
        }, ['联系方式：', "", '在此输入手机号码...', 'tel']);

    },

    /**
     * 调整到大专家界面
     */
    jumpExpertHome: function () {
        var objHome = JumpPage.getCurrentPage();
        var objFamilyHome = LMEPG.Intent.createIntent("expertIndex");
        LMEPG.Intent.jump(objFamilyHome, objHome);
    },

    /**
     * 疫情模块接口
     */
    jumpEpidemic: function () {
        var objHome = JumpPage.getCurrentPage();

        var objEpidemic = LMEPG.Intent.createIntent('report-index');
        objEpidemic.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objEpidemic, objHome);
    },

    /**
     * 推荐位被点击
     * @param btn
     */
    onRecommendClick: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var idx = btn.cIndex;

        // 第一号推荐位
        var data = JumpPage.getRecommendDataByPosition(position, idx);
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(position, data.order);
        switch (data.entryType) {
            case "5":
                // 视频播放
                var videoData = JSON.parse(data.inner_parameters);
                if (RenderParam.carrierId == '540001' && videoData.show_status == 3) {
                    LMAndroid.JSCallAndroid.doShowToast("该条视频已经下线");
                    return;
                }

                var videoUrl = "";
                try {
                    var videoObj = data.play_url instanceof Object ? data.play_url : JSON.parse(data.play_url);
                    videoUrl = RenderParam.platformType === "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
                } catch (e) {
                    console.warn(JSON.stringify(data), e);
                }



                if (LMEPG.Func.isEmpty(videoUrl)) {
                    console.error("无效的播放url");
                    switch (RenderParam.carrierId) {
                        case CARRIER_ID_QINGHAIYD://青海移动：若后台未配置有效视频或者被未来电视（第三方内容审核）下线后，暂统一提示为“下线”
                            LMEPG.UI.showToast("该节目已下线");//注：集成未来电视播控要求鉴权失败统一提示“该节目已下线”
                            break;
                        default:
                            LMEPG.UI.showAndroidToast("无效的视频地址！");
                            break;
                    }
                    return;
                }

                var focusIndex = btn.id;
                if (HOLD_BUTTONS.indexOf(focusIndex) >= 0) {
                    focusIndex = "carousel-link";
                }

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
                    "focusIdx": focusIndex,
                    "unionCode": data.union_code
                };

                LMEPG.ExtService.checkUserFuncLimit(RenderParam.isVip, function (isVipUser, msg) {
                    if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        Page.jumpBuyVip(videoInfo.title, videoInfo);
                    }
                }, function (isVipUser, msg, vipUserLimitFuncIDs) {
                    LMEPG.UI.showToast(LMEPG.Tips.VIP_NOT_SUPPORT);
                }, LMEPG.ExtService.FuncID.FUNC_PLAY_VIDEO);
                break;
            case "4":
                // 更多视频
                Page.jumpChannelPage(data.title, data.source_id, "1");
                break;
            case "13":
            case '33':
            case '39':
                // 专辑
                // 免费专区
                // 图文专辑
                Page.jumpAlbumPage(data.source_id);
                break;
            case "3":
                // 活动
                Page.jumpActivityPage(data.source_id);
                break;
            case "14":
                //预约挂号首页
                if (RenderParam.carrierId === '540001') {
                    // 西藏移动
                    LMEPG.UI.showToast("该功能暂未开放", 3);
                } else {
                    Page.jumpGuaHaoPage();
                }
                break;
            case "22":
                // 具体地址跳转
                LMEPG.ui.showToast("具体地址跳转");
                break;
            case "24":
                //夜间药房
                if (RenderParam.carrierId === '540001') {
                    // 西藏移动
                    LMEPG.UI.showToast("该功能暂未开放", 3);
                } else {
                    Page.jumpnightMedicine();
                }
                break;
            case "11":
                //我的家
                JumpPage.jumpMyHome();
                break;
            case "10":
                Page.jump39Hospital();
                break;
            case "26": //免费问诊
                JumpPage.inquiryAdvisoryDoctor(btn.id);
                break;
            //VIP问诊
            case "27":
                LMEPG.ExtService.checkUserFuncLimit(RenderParam.isVip, function (isVipUser, msg) {
                    if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
                        JumpPage.jumpDoctorHome();
                    } else {
                        if (RenderParam.carrierId == "540001"){
                            // 西藏移动
                            // LMEPG.UI.showToast("该功能暂未开放", 3);
                            JumpPage.jumpDoctorHome();
                            return;
                        }
                        JumpPage.jumpBuyVip("VIP问诊订购", null);
                    }
                }, function (isVipUser, msg, vipUserLimitFuncIDs) {
                    LMEPG.UI.showToast(LMEPG.Tips.VIP_NOT_SUPPORT);
                }, LMEPG.ExtService.FuncID.FUNC_ASK_DOCTOR);
                break;
            //大专家问诊
            case "19":
                LMEPG.ExtService.checkUserFuncLimit(RenderParam.isVip, function (isVipUser, msg) {
                    switch (RenderParam.carrierId) {
                        case '630001':
                            isVipUser ? JumpPage.jumpExpertHome() : JumpPage.jumpBuyVip("大专家问诊订购");
                            break;
                        default:
                            JumpPage.jumpExpertHome();
                            break;
                    }
                }, function (isVipUser, msg, vipUserLimitFuncIDs) {
                    LMEPG.UI.showToast(LMEPG.Tips.VIP_NOT_SUPPORT);
                }, LMEPG.ExtService.FuncID.FUNC_ASK_EXPERT);
                break;

            // 疫情专区
            case "48":
                JumpPage.jumpEpidemic();
                break;
            case "17": // 健康检测
                JumpPage.jumpHealthMeasure(btn);
                break;
        }
    },

    // 2号推荐位，小窗口视频播放
    onRecommendPollVideoClick: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var data = JumpPage.getRecommendPollVideoDataByPosition(position);
        if (data == "") {
            LMEPG.ui.showToast("小窗口视频信息有误！", 3);
            return;
        }


        // 创建视频信息
        var videoInfo = {
            "sourceId": data.sourceId,
            "videoUrl": data.videoUrl,
            "title": data.title,
            "type": data.modelType,
            "userType": data.userType,
            "freeSeconds": data.freeSeconds,
            "entryType": 1,
            "entryTypeName": "home",
            "focusIdx": btn.id,
            "unionCode": data.unionCode
        };

        LMEPG.ExtService.checkUserFuncLimit(RenderParam.isVip, function (isVipUser, msg) {
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                Page.jumpPlayVideo(videoInfo);
            } else {
                Page.jumpBuyVip(videoInfo.title, videoInfo);
            }
        }, function (isVipUser, msg, vipUserLimitFuncIDs) {
            LMEPG.UI.showToast(LMEPG.Tips.VIP_NOT_SUPPORT);
        }, LMEPG.ExtService.FuncID.FUNC_PLAY_VIDEO);
    },
    /**
     * 通过推荐位编号得到推荐位数据
     * @param: position 推荐位编号（比如1 号推荐位 --11 ）
     * @param: idx 此推荐位的推荐个数索引，比如一个推荐位有3个内容，引索引为（0，1，2）
     * @param position
     */
    getRecommendDataByPosition: function (position, idx) {
        var tmpData = "";
        var dataList = RenderParam.recommendDataList;
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            if (data.position == position) {
                if (typeof idx != "undefined" && idx != "") {
                    tmpData = data.item_data[idx];
                } else {
                    tmpData = data.item_data[0];
                }
                break;
            }
        }

        // 重新组装数据
        var data = {};
        if (tmpData != "") {
            data.image_url = tmpData.img_url;
            data.entryType = tmpData.entry_type;
            data.order = tmpData.order;

            //解析视频ID
            var paramArr = JSON.parse(tmpData.parameters);
            data.source_id = paramArr[0].param;

            // 解析视频内部参数
            if (tmpData.inner_parameters != "") {
                var innerParams = JSON.parse(tmpData.inner_parameters);
                data.title = innerParams.title;
                data.model_type = innerParams.model_type;
                data.user_type = innerParams.user_type;
                data.play_url = innerParams.ftp_url;
                data.freeSeconds = innerParams.free_seconds;
                data.union_code = innerParams.union_code;
                data.inner_parameters=tmpData.inner_parameters;
            }
        }

        return data;
    },

    /**
     * 针对推荐位2 进行数据处理（主要是视频轮播）
     * @param: position 此推荐位的推荐个数索引，比如一个推荐位有3个内容，引索引为（0，1，2）
     */
    getRecommendPollVideoDataByPosition: function (position) {
        var data = "";
        if (position == "-1") { // 表示点击正在播放的视频位置
            data = Play.getCurrentPollVideoData();
        } else {
            var dataList = RenderParam.homePollVideoList;
            if (dataList.count > 0) {
                data = dataList.list[position];
            }
        }
        return data;
    },
};

var buttons = [
    {
        id: 'vip',
        name: '',
        type: 'img',
        nextFocusLeft: RenderParam.carrierId == '630001' ? "collection" : 'help',
        nextFocusRight: 'search',
        nextFocusUp: '',
        nextFocusDown: 'nav-5',
        backgroundImage:  g_appRootPath + "/Public/img/hd/Home/V27/tab0/vip.png",
        focusImage:  g_appRootPath + "/Public/img/hd/Home/V27/tab0/vip_f.png",
        click: topBtnClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    }, {
        id: 'search',
        name: '',
        type: 'img',
        nextFocusLeft: RenderParam.carrierId == '000509' ? 'collection' : 'vip',
        nextFocusRight: 'collection',
        nextFocusUp: '',
        nextFocusDown: 'nav-5',
        backgroundImage: ROOT + "/Public/img/hd/Home/V27/tab0/search.png",
        focusImage: ROOT + "/Public/img/hd/Home/V27/tab0/search_f.png",
        click: topBtnClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    }, {
        id: 'collection',
        name: '',
        type: 'img',
        nextFocusLeft: 'search',
        nextFocusRight: RenderParam.carrierId == '630001' ? 'vip' : RenderParam.carrierId == '000509' ? 'search' : 'help',
        nextFocusUp: '',
        nextFocusDown: 'nav-5',
        backgroundImage: ROOT + "/Public/img/hd/Home/V27/tab0/collection.png",
        focusImage: ROOT + "/Public/img/hd/Home/V27/tab0/collection_f.png",
        click: topBtnClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    },
    {
        id: 'help',
        name: '',
        type: 'img',
        nextFocusLeft: 'collection',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: 'nav-5',
        backgroundImage: ROOT + "/Public/img/hd/Home/V27/tab0/help.png",
        focusImage: ROOT + "/Public/img/hd/Home/V27/tab0/help_f.png",
        click: topBtnClick,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    },
    /**
     * 导航菜单------
     */
    {
        id: 'nav-1',
        name: '推荐',
        type: 'img',
        nextFocusLeft: 'nav-5',
        nextFocusRight: 'nav-2',
        nextFocusUp: RenderParam.carrierId == '000509' ? 'search' : 'vip',
        nextFocusDown: 'left-btn-1',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[0].img_url).focus_out,
        click: "",
        focusChange: nav1hasFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    }, {
        id: 'nav-2',
        name: '老年',
        type: 'img',
        nextFocusLeft: 'nav-1',
        nextFocusRight: 'nav-3',
        nextFocusUp: RenderParam.carrierId == '000509' ? 'search' : 'vip',
        nextFocusDown: 'carousel-link',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[1].img_url).focus_out,
        click: JumpPage.jumpMenuPage,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 1,
    }, {
        id: 'nav-3',
        name: '育儿',
        type: 'img',
        nextFocusLeft: 'nav-2',
        nextFocusRight: 'nav-4',
        nextFocusUp: RenderParam.carrierId == '000509' ? 'search' : 'vip',
        nextFocusDown: 'book-registration',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[2].img_url).focus_out,
        click: JumpPage.jumpMenuPage,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 2,
    }, {
        id: 'nav-4',
        name: '女性',
        type: 'img',
        nextFocusLeft: 'nav-3',
        nextFocusRight: 'nav-5',
        nextFocusUp: RenderParam.carrierId == '000509' ? 'search' : 'vip',
        nextFocusDown: 'end-inner',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[3].img_url).focus_out,
        click: JumpPage.jumpMenuPage,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 3,
    }, {
        id: 'nav-5',
        name: '保健',
        type: 'img',
        nextFocusLeft: 'nav-4',
        nextFocusRight: 'nav-1',
        nextFocusUp: RenderParam.carrierId == '000509' ? 'search' : 'vip',
        nextFocusDown: 'end-inner',
        backgroundImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).normal,
        focusImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_in,
        selectedImage: RenderParam.fsUrl + JSON.parse(RenderParam.navConfig[4].img_url).focus_out,
        click: JumpPage.jumpMenuPage,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: 4,
    },
    /**
     * 左边四个---
     */
    {
        id: 'left-btn-1',
        name: '推荐位6',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'carousel-link',
        nextFocusUp: 'nav-1',
        nextFocusDown: 'left-btn-2',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[0].position,
        cIndex: 0
    },
    {
        id: 'left-btn-2',
        name: '推荐位6',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'carousel-link',
        nextFocusUp: 'left-btn-1',
        nextFocusDown: 'left-btn-3',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[0].position,
        cIndex: 1
    },
    {
        id: 'left-btn-3',
        name: '推荐位6',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'carousel-link',
        nextFocusUp: 'left-btn-2',
        nextFocusDown: 'left-btn-4',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[0].position,
        cIndex: 2
    },
    {
        id: 'left-btn-4',
        name: '推荐位6',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'carousel-link',
        nextFocusUp: 'left-btn-3',
        nextFocusDown: 'left-btn-5',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[0].position,
        cIndex: 3
    },
    {
        id: 'left-btn-5',
        name: '推荐位6',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'carousel-link',
        nextFocusUp: 'left-btn-4',
        nextFocusDown: 'left-btn-6',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[0].position,
        cIndex: 4
    },
    {
        id: 'left-btn-6',
        name: '推荐位6',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'carousel-link',
        nextFocusUp: 'left-btn-5',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[0].position,
        cIndex: 5
    },
    /**
     * 中间三个---
     */
    {
        id: 'carousel-link',
        name: '推荐位1',
        type: 'img',
        nextFocusLeft: 'left-btn-1',
        nextFocusRight: 'book-registration',
        nextFocusUp: 'nav-2',
        nextFocusDown: '',
        backgroundImage: ROOT + "/Public/img/hd/Home/V27/spacer.gif",
        focusImage: ROOT + "/Public/img/hd/Home/V27/tab0/carousel_f.png",
        click: JumpPage.onRecommendClick,
        focusChange: carouselFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[1].position,
    }, {
        id: 'book-registration',
        name: '推荐位5',
        type: 'img',
        nextFocusLeft: 'carousel-link',
        nextFocusRight: 'album-inner',
        nextFocusUp: 'nav-3',
        nextFocusDown: 'do-smile-people',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[2].position,
    }, {
        id: 'do-smile-people',
        name: '推荐位4',
        type: 'img',
        nextFocusLeft: 'carousel-link',
        nextFocusRight: 'album-inner-1',
        nextFocusUp: 'book-registration',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[3].position,
    },
    /**
     * 右边3个-----
     */
    {
        id: 'album-inner',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'book-registration',
        nextFocusRight: 'end-inner',
        nextFocusUp: 'nav-4',
        nextFocusDown: 'album-inner-1',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[4].position,
    },
    {
        id: 'album-inner-1',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'book-registration',
        nextFocusRight: 'end-inner-1',
        nextFocusUp: 'album-inner',
        nextFocusDown: 'album-inner-2',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[5].position,
    },
    {
        id: 'album-inner-2',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'do-smile-people',
        nextFocusRight: 'end-inner-2',
        nextFocusUp: 'album-inner-1',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[6].position,
    },


    /**
     * 最后右3个-----
     */
    {
        id: 'end-inner',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'album-inner',
        nextFocusRight: '',
        nextFocusUp: 'nav-4',
        nextFocusDown: 'end-inner-1',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[7].position,
        cIndex: 0
    },
    {
        id: 'end-inner-1',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'album-inner-1',
        nextFocusRight: '',
        nextFocusUp: 'end-inner',
        nextFocusDown: 'end-inner-2',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[7].position,
        cIndex: 1
    },
    {
        id: 'end-inner-2',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'album-inner-2',
        nextFocusRight: '',
        nextFocusUp: 'end-inner-1',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: linkOnFocus,
        beforeMoveChange: "",
        moveChange: "",
        cIdx: RenderParam.recommendDataList[7].position,
        cIndex: 2
    },
    /**
     * 脚手架ID
     */
    {
        id: 'debug',
        name: '',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: "",
        focusImage: "",
        click: onBack,
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
        cIdx: "",
    },];

/**
 * 顶部菜单按钮点击事件
 * @param btn
 */
function topBtnClick(btn) {
    switch (btn.id) {
        case "vip":
            if (RenderParam.carrierId == "540001") {
                // 西藏移动
                //LMEPG.UI.showToast("该功能暂未开放", 3);
                //return;
            }
            if ((RenderParam.isVip === '1' || RenderParam.isVip == 1)) {
                if (RenderParam.vipInfo.auto_order == "1") {
                    if (RenderParam.carrierId == "630001" || RenderParam.carrierId == "540001") {
                        // 青海移動沒有退訂
                        //是vip且没有退订的
                        LMEPG.UI.commonDialog.show("您已订购VIP，请勿重复订购！", ["取消"], function (index) {
                        });
                        return;
                    }
                    //是vip且没有退订的
                    LMEPG.UI.commonDialog.show("您已订购VIP，请勿重复订购！", ["退订VIP", "取消"], function (index) {
                        if (index == 0) {
                            //退订流程
                            var postData = {
                                orderId: '',
                                orderType: 1,
                            };
                            LMEPG.UI.showToast("退订中，请稍等！", 3, function () {
                                LMEPG.UI.showToast("等待超时，退订失败！");
                            });
                            LMEPG.ajax.postAPI("Pay/OrderForGansuYd", postData, function (data) {
                                LMEPG.Log.error("gansuyd---UnOrderForGansuYd: " + data);
                                var resultDataJson = JSON.parse(data);
                                if (resultDataJson.result == 0) {
                                    if (resultDataJson.result_code === "1000" || resultDataJson.result_code === 1000) {
                                        //退订成功
                                        RenderParam.vipInfo.auto_order = '0';
                                        LMEPG.UI.showToast("退订成功:" + resultDataJson.result_desp);
                                    } else {
                                        //局方服务器返回的错误
                                        LMEPG.UI.showToast("退订失败:" + resultDataJson.result_desp);
                                    }
                                } else {
                                    //我方服务返回的错误
                                    LMEPG.UI.showToast("退订失败,result:" + resultDataJson.result);
                                }
                            });
                        }

                    });
                } else {
                    //是vip,但是已经退订的 您订购的VIP已经退订
                    LMEPG.UI.commonDialog.show("您已订购VIP，请勿重复订购！", ["确定"], function (index) {

                    });
                }
            } else {
                //不是vip
                JumpPage.jumpBuyVip("首页订购", null);
            }
            break;
        case "search":
            JumpPage.jumpSearchPage(btn);
            break;
        case "collection":
            JumpPage.jumpCollectPage(btn);
            break;
        case "help":
            showHelpIntroduce();
            break;
    }
}

/**
 * 轮播获得失去焦点事件
 * @param btn
 * @param hasFocus
 */
function carouselFocus(btn, hasFocus) {
    if (hasFocus) {
        clearInterval(carouselTimer);
    } else {
        clearInterval(carouselTimer);
        carouselTimer = setInterval(renderHomePage.loop, 2000);
    }
}


function nav1hasFocus(btn, hasFocus) {
    var currentId = LMEPG.ButtonManager.getButtonById("nav-1");
    G("nav-1").src = currentId.selectedImage;
    if (hasFocus) {
        G("nav-1").src = btn.focusImage;
    } else {
    }
}

function linkOnFocus(btn, hasFocus) {
    if (hasFocus) {
        G(btn.id).className = "focus";
    } else {
        G(btn.id).removeAttribute("class");
    }
}

function showHelpIntroduce() {
    Show("help-introduce");
    LMEPG.ButtonManager.requestFocus("debug");
    LMEPG.BM.setKeyEventInterceptCallback(keyEventInterceptCallback);
}

/**
 * 按键拦截回调函数
 */
function keyEventInterceptCallback(keyCode) {
    Hide("help-introduce");
    LMEPG.ButtonManager.requestFocus("help");
    LMEPG.BM.removeKeyEventInterceptCallback();
    return true;
};

/**
 * 当在首页按返回时，如果已经弹出新手指导信息，则关闭新手指导信息
 * 如果没有弹出新手指导，则退出应用
 */
function onBack() {
    if (LMEPG.UI.commonDialog._isShowing) {
        LMEPG.UI.commonDialog.close();
    } else if (G("help-introduce").style.display == "block") {
        Hide("help-introduce");
        LMEPG.ButtonManager.requestFocus("help");
    } else {
        /**
         * 返回事件
         */
        if (Hold.isShowHold()) {
            Hold.appExit();
        } else {
            Hold.open();
        }
        // Page.exitAppHome();
    }
}

