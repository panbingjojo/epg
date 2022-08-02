// 推荐位点击
//页面跳转控制
var Page = {
    /**
     * 跳转菜单选中页
     * @param btn
     * @param classifyId
     * @param modelType
     */
    jumpMenuPage: function (btn) {

        var objCurrent = Pages.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("menuTab");
        objHomeTab.setParam("userId", RenderParam.userId);
        // objHomeTab.setParam("pageIndex", btn.cIdx);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    // 退出应用。
    exitAppHome: function () {
        switch (RenderParam.carrierId) {
            case '340092':
                // 安徽电信EPG
                if (typeof Utility !== "undefined") {
                    Utility.setValueByName("exitIptvApp");
                } else {
                    LMEPG.Intent.back();
                }
                break;
            default:
                LMEPG.Intent.back("IPTVPortal");
                break;
        }
    },

    /**
     * 跳转->home主页面
     */
    jumpHomeUI: function () {
        Page.jumpHomeTab("home");
    },
    /**
     * 校验视频是否允许播放
     * @param videoInfo
     */
    isAllowPlay: function (videoInfo) {
        if (RenderParam.isVip == 1) {
            // vip用户可以观看
            return true;
        }

        if (videoInfo.userType == 0 || videoInfo.userType == 1) {
            // 视频允许免费用户观看
            return true;
        }

        if (parseInt(videoInfo.freeSeconds) > 0) {
            // 视频有免费观看时长
            return true;
        }

        return false;
    },
    /**
     * 跳转->挂号
     */
    jumpGuaHaoPage: function () {
        var objCurrent = Pages.getCurrentPage();
        var objGuaHao;
        var jumpV13CarrierIdArray = ['320005'];
        if(jumpV13CarrierIdArray.indexOf(RenderParam.carrierId) >= 0){
            objGuaHao = LMEPG.Intent.createIntent('indexStatic');
        }else{
            objGuaHao = LMEPG.Intent.createIntent("appointmentRegister");
        }
        objGuaHao.setParam("focusIndex", "");
        // alert(objGuaHao);

        LMEPG.Intent.jump(objGuaHao, objCurrent);
    },
    /**
     * 跳转->核酸检测
     */
    jumpNucleatOrder: function () {
        var objCurrent = Pages.getCurrentPage();
        var objGuaHao = LMEPG.Intent.createIntent("nucleicAcidDetect");
        LMEPG.Intent.jump(objGuaHao, objCurrent);
    },
    /**
     * 跳转->定制模块
     */
    jumpCustomModule: function (param) {
        var objCurrent = Pages.getCurrentPage();
        var objCustomModule = LMEPG.Intent.createIntent("customizeModule");
        objCustomModule.setParam("moduleId", param);
        LMEPG.Intent.jump(objCustomModule, objCurrent);
    },
    /**
     * 跳转到夜间药房
     */
    jumpNightMedicine: function () {
        var objCurrent = Pages.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam("fromId", "1");
        objCurrent.setParam("page", "0");

        var objCollect = LMEPG.Intent.createIntent("nightMedicine");
        objCollect.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objCollect, objCurrent);
    },
    /**
     * 跳转到3983测试页
     */
    jumpTestPage: function () {
        var objCurrent = Pages.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent("testEntrySet");
        objHomeTab.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    /**
     * 跳转 - 订购页
     */
    jumpBuyVipInfo: function (btn) {
        if (RenderParam.carrierId == "10000051" || RenderParam.carrierId == "000409" || RenderParam.carrierId == "10000006") {
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
                modal.commonDialog({
                    beClickBtnId: btn.id,
                    onClick: modal.hide
                }, '<span style="color: #ef6188">您已是VIP会员，不能重复订购</span>', '海量健康资讯', '为您的家人健康保驾护航');
                return;
            } else {

                // --------上报局方使用模块数据 start--------
                if (RenderParam.carrierId === "10000051" || RenderParam.carrierId === "10000006") {
                    var clickTime = new Date().getTime();
                    var deltaTime = Math.round((clickTime - initTime) / 1000);
                    var postData = {
                        "type": 7,
                        "operateResult": "应用首页",
                        "stayTime": deltaTime
                    };
                    LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", postData, LMEPG.emptyFunc, LMEPG.emptyFunc);
                }
                // --------上报局方使用模块数据 end--------

                var currentObj = Pages.getCurrentPage();
                var objOrderHome = LMEPG.Intent.createIntent("orderHome");
                objOrderHome.setParam('userId', RenderParam.userId);
                objOrderHome.setParam('isPlaying', '0');
                objOrderHome.setParam('remark', '主动订购');
            }
            LMEPG.Intent.jump(objOrderHome, currentObj);
        } else if (RenderParam.carrierId == "07430093") {
            if (RenderParam.isVip == 1) {
                LMEPG.UI.showToastV3("小主，您已经是VIP会员！");
            } else {
                // 订购首页
                var objCurrent = Pages.getCurrentPage();
                var objOrderHome = LMEPG.Intent.createIntent("orderHome");
                objOrderHome.setParam("remark", "VIP订购");
                objOrderHome.setParam("isPlaying", 1);
                objOrderHome.setParam("singlePayItem", 1);
                LMEPG.Intent.jump(objOrderHome, objCurrent);
            }
        } else {
            if (RenderParam.carrierId == '630092') {
                //按钮、推荐位点击 数据探针上报
                Page.dataUpLoad(btn);
            }
            var textStr = "您已是VIP会员，不能重复订购";
            if (RenderParam.freeExperience == 1) {
                textStr = "限时免费中，无需订购即可享受39健康会员权益";
            }
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
                modal.commonDialog({
                    beClickBtnId: btn.id,
                    onClick: modal.hide
                }, '<span style="color: #ef6188">' + textStr + '</span>', '海量健康资讯', '为您的家人健康保驾护航');
                return;
            }else{
                if(RenderParam.carrierId === '370092'){
                    var objCurrent = Pages.getCurrentPage();
                    var jumpAgreementObj = LMEPG.Intent.createIntent('orderHome');
                    jumpAgreementObj.setParam('userId', RenderParam.userId);
                    jumpAgreementObj.setParam('isPlaying', '0');
                    jumpAgreementObj.setParam('remark', '主动订购');
                    LMEPG.Intent.jump(jumpAgreementObj, objCurrent);
                    return;
                }

                var objCurrent = Pages.getCurrentPage();
                var objMyFamily = LMEPG.Intent.createIntent("payInfo");
                objMyFamily.setParam("focusIndex", "");
                LMEPG.Intent.jump(objMyFamily, objCurrent);
            }
        }
    },
    /**
     * 跳转->我的家页面
     */
    jumpMyFamilyUI: function () {

        if (RenderParam.carrierId == "640092") {
            var objBack = Pages.getCurrentPage();
            var objAbout = LMEPG.Intent.createIntent('familyEdit');
            LMEPG.Intent.jump(objAbout, objBack);
        } else {
            var objCurrent = Pages.getCurrentPage();
            var objMyFamily = LMEPG.Intent.createIntent("familyIndex");
            objMyFamily.setParam("focusIndex", "");

            LMEPG.Intent.jump(objMyFamily, objCurrent);
        }

    },

    /**
     * 视频问诊主页
     */
    jumpVideoVisitHome: function () {
        // if (RenderParam.carrierId == '520092') {
        //     LMEPG.UI.showToast("本功能暂未开放");
        //     return;
        // }
        var objCurrent = Pages.getCurrentPage();

        var objDoctorP2P = LMEPG.Intent.createIntent("doctorIndex");
        objDoctorP2P.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objDoctorP2P, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    toDoctorDetail:function(btn){
        var currentObj = Pages.getCurrentPage();
        var jumpAgreementObj = LMEPG.Intent.createIntent('doctorDetails');
        jumpAgreementObj.setParam('doctorIndex', btn.docId); // 传递点击具体那个医生的索引
        LMEPG.Intent.jump(jumpAgreementObj, currentObj, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->39互联网医院模块
     */
    jump39Hospital: function () {
        var objCurrent = Pages.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent("new39hospital");
        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->视频问诊-科室
     */
    jumpVideoVisitByDepart: function () {

    },

    /**
     * 跳转->健身房
     */
    jumpGym: function () {
        var objCurrent = Pages.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent("gym");
        LMEPG.Intent.jump(objHome, objCurrent);
    },

    /**
     * 跳转->健身房
     */
    jumpfifHospital: function () {
        var objCurrent = Pages.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent("fifthHospital");
        LMEPG.Intent.jump(objHome, objCurrent);
    },

    /**
     * 跳转->健身房
     */
    jumpNCOVPage: function () {
        var objCurrent = Pages.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent("report-index");
        LMEPG.Intent.jump(objHome, objCurrent);
    },
    /**
     * 跳转->献血模块
     */
    jumpDonateBloodPage: function () {
        var objCurrent = Pages.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent("commonweal");
        LMEPG.Intent.jump(objHome, objCurrent);
    },


    /**
     * 跳转->设备商城首页
     */
    jumpDeviceStore: function () {
        var objHome = Pages.getCurrentPage();

        var objDst = LMEPG.Intent.createIntent('payOnline');
        LMEPG.Intent.jump(objDst, objHome);
    },

    /**
     * 跳转->设备商城，商品详情页
     */
    jumpDeviceStoreById: function () {

    },

    /**
     * 跳转->挂号-医院详情页
     */
    jumpGuaHaoByHospital: function (hospitalId) {
        var objCurrent = Pages.getCurrentPage();

        var objDst = LMEPG.Intent.createIntent("department");
        objDst.setParam("hospital_id", hospitalId);
        objDst.setParam("is_province", 0);
        LMEPG.Intent.jump(objDst, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },


    /**
     * 跳转->心里咨询医院首页
     */
    jumpExpertList: function () {
        var objCurrent = Pages.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("experts-introduce");
        objDst.setParam("userId", "{$userId}");
        objDst.setParam("inner", "{$inner}");
        objDst.setParam("channel", 4);
        LMEPG.Intent.jump(objDst, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->用户指南
     */
    jumpUserGuide: function () {

    },

    /**
     * 跳转->健康检测
     */
    jumpHealthMeasure: function () {
        var objSrc = Pages.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("testIndex");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->数据归档
     */
    jumpDataArchiving: function () {
        var objSrc = Pages.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
        objDst.setParam('showAskDoctorTab', 2); // 是否显示归档页面的问医记录Tab
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转->检测记录详情
     */
    jumpTestRecordDetail: function (memberId, typeId) {
        LMEPG.ajax.postAPI('/Family/queryMember', {
            member_id: memberId,
        }, function (data) {
            if (data.result === 0 && data.list.length > 0) {
                var objSrc = Pages.getCurrentPage();
                var objDst = LMEPG.Intent.createIntent('testList');
                var keepFocusId = 'tab-0';
                if (typeId === '10003') {
                    keepFocusId = 'tab-2';
                } else if (typeId === '10004') {
                    keepFocusId = 'tab-1';
                }
                objDst.setParam('member_id', data.list[0].member_id);
                objDst.setParam('member_name', data.list[0].member_name);
                objDst.setParam('member_image_id', data.list[0].member_image_id);
                objDst.setParam('member_gender', data.list[0].member_gender);
                objDst.setParam('testType', '');
                objDst.setParam('keepFocusId', keepFocusId);

                objDst.setParam('unusualItems', JSON.stringify(data.list[0]));
                LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
            }
        });
    },

    /**
     *  跳转->专家约诊首页
     */
    jumpExpertConsultation: function () {
        var objCurrent = Pages.getCurrentPage();
        if (RenderParam.carrierId == '10000051' || RenderParam.carrierId == '000409') {
            var jumpObj = LMEPG.Intent.createIntent("expertIndex");
        } else {
            var jumpObj = LMEPG.Intent.createIntent("expertHome");
        }
        jumpObj.setParam("channel", "1");
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转->专家约诊消息提醒
     */
    jumpExpertConsultationRemind: function () {

    },

    /**
     * 跳转->视频问诊-医生
     */
    jumpVideoVisitByDoctor: function () {

    },

    /**
     * 跳转->home页面
     * @param tabName 将要跳转的栏目路由名称
     * @param focusIndex 跳转到指定栏目页时让其默认焦点保持在哪个按钮上
     */
    jumpHomeTab: function (tabName, focusIndex) {
        var objCurrent = Pages.getCurrentPage();

        var objHome = LMEPG.Intent.createIntent(tabName);
        objHome.setParam("focusIndex", focusIndex);

        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 跳转 - 搜索页
     * */
    jumpSearchPage: function (btn) {
        if (RenderParam.carrierId == '630092') {
            //按钮、推荐位点击 数据探针上报
            Page.dataUpLoad(btn);
        }

        var objHome = Pages.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "1");
        objHome.setParam("focusIndex", LMEPG.ButtonManager.getCurrentButton().id);
        objHome.setParam("page", "0");

        var objSearch = LMEPG.Intent.createIntent("search");
        objSearch.setParam("userId", RenderParam.userId);
        objSearch.setParam("position", "tab1");


        LMEPG.Intent.jump(objSearch, objHome);
    },
    /**
     * 跳转到订购信息页
     */
    jumpPayInfo: function () {
        var objHome = Pages.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "1");
        objHome.setParam("focusIndex", LMEPG.ButtonManager.getCurrentButton().id);
        objHome.setParam("page", "0");

        var objSearch = LMEPG.Intent.createIntent("payInfo");
        objSearch.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objSearch, objHome);
    },
    // 跳转到收藏
    jumpCollection: function (btn) {
        if (RenderParam.carrierId == '630092') {
            //按钮、推荐位点击 数据探针上报
            Page.dataUpLoad(btn);
        }

        var objSrc = Pages.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("collect");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },
    // 跳转到历史
    jumpHistory: function (btn) {
        if (RenderParam.carrierId == '630092') {
            //按钮、推荐位点击 数据探针上报
            Page.dataUpLoad(btn);
        }

        var objSrc = Pages.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("historyPlay");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转 -- 更多视频页
     */
    jumpHealthVideoHome: function (modeTitle, modeType, page) {
        var objHome = Pages.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objChannel = LMEPG.Intent.createIntent("healthVideoList");
        objChannel.setParam("userId", RenderParam.userId);
        objChannel.setParam("page", typeof (page) === "undefined" ? "1" : page);
        objChannel.setParam("modeTitle", modeTitle);
        objChannel.setParam("modelType", modeType);
        LMEPG.Intent.jump(objChannel, objHome);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = Pages.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objAlbum = LMEPG.Intent.createIntent("album");
        objAlbum.setParam("userId", RenderParam.userId);
        objAlbum.setParam("albumName", albumName);
        objAlbum.setParam("inner", 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转第三方网页
     * @param url 网页地址
     */
    jumpThirdPartyUrl: function (url) {
        window.location.href = url;
    },

    /**
     * 跳转 -- 图文栏目
     * @param classifyId 栏目ID
     */
    jumpGraphicColumn: function (classifyId) {
        var objCurrent = Pages.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam("fromId", "1");
        objCurrent.setParam("page", "0");

        var objGraphicClass = LMEPG.Intent.createIntent("graphicColumn");
        objGraphicClass.setParam('modelType', classifyId);
        LMEPG.Intent.jump(objGraphicClass, objCurrent);
    },

    /**
     * 跳转 -- 图文详情
     * @param graphicId 图文ID
     */
    jumpGraphicDetail: function (graphicId) {
        var objCurrent = Pages.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam("fromId", "1");

        var objGraphic = LMEPG.Intent.createIntent("album");
        objGraphic.setParam('albumName', 'TemplateAlbum');
        objGraphic.setParam('graphicId', graphicId);

        LMEPG.Intent.jump(objGraphic, objCurrent);
    },

    /**
     * 跳转 -- 视频集
     * @param videoSetId 视频集ID
     */
    jumpVideoSet: function (videoSetId) {
        var objCurrent = Pages.getCurrentPage();
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam("fromId", "1");

        var objVideoSet = LMEPG.Intent.createIntent("healthVideoSet");

        objVideoSet.setParam('subject_id', videoSetId);

        if (RenderParam.carrierId == "440004") {
            objVideoSet.setParam('subject_id', "1549");
        }
        LMEPG.Intent.jump(objVideoSet, objCurrent);
    },

    /**
     * 跳转 -- 活动页面
     * @param activityName
     */
    jumpActivityPage: function (activityName) {
        var objHome = Pages.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objActivity = LMEPG.Intent.createIntent("activity");
        objActivity.setParam("userId", RenderParam.userId);
        objActivity.setParam("activityName", activityName);
        objActivity.setParam("inner", 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        var objHome = Pages.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("userId", RenderParam.userId);
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
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
        var objHome = Pages.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "1");
        objHome.setParam("page", "0");

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("userId", RenderParam.userId);
        objOrderHome.setParam("remark", remark);
        if (LMEPG.Func.isExist(videoInfo)) {
            objOrderHome.setParam("isPlaying", 1);
        } else {
            objOrderHome.setParam("isPlaying", -1);
        }
        objOrderHome.setParam("singlePayItem", typeof (singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objHome);
    },

    /**
     * 跳转魔方插件
     */
    jumpMofangPlugin: function () {
        LMEPG.ApkMofang.func.launch();
    },

    /**
     * 跳转 - 健康检测IMEI号输入页面
     */
    jumpHealthTestIMEI: function (type) {
        var objCurrent = Pages.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent(type);
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    /**
     * 跳转到挽留页
     */
    jumpHoldPage: function () {
        var objHome = Pages.getCurrentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "1");

        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 数据探针上报
     */
    dataUpLoad: function (btn) {
        if (RenderParam.carrierId != '630092') return;
        var tabName = '';
        if (btn.id.indexOf('recommend') >= 0) {
            tabName = '首页'
        } else if (btn.id.indexOf('activity') >= 0) {
            tabName = '活动专区'
        } else if (btn.id.indexOf('three-part') >= 0) {
            tabName = '心理咨询'
        } else if (btn.id.indexOf('four-part') >= 0) {
            tabName = '健康科教'
        } else if (btn.id.indexOf('five-part') >= 0) {
            tabName = '健康科教'
        } else {
            tabName = '首页'
        }
        ;

        var dataRP = {
            userId: RenderParam.userId,
            pageKey: window.location.pathname,
            pageType: 'portal',
            btnArea: btn.id,
            btnName: btn.cIdx.description || btn.id,
            tabName: tabName,
        }
        DataReport.getValue(2, dataRP);
    },

    onClickRecommendPosition: function (btn) {
        if (RenderParam.carrierId == '630092') {
            //按钮、推荐位点击 数据探针上报
            Page.dataUpLoad(btn);
        }

        var dataSource = "";
        if (btn.id == "carousel-link") {
            dataSource = btn.cIdx[parseInt(G('current-container').getAttribute('data-link'))];
        } else if (btn.id == "btn_three-part-6-img") {
            Page.jumpVideoVisitHome();
            return;
        } else if (btn.cType == "carousel") {
            dataSource = btn.cIdx[parseInt(G(btn.id).getAttribute('data-link'))];
        } else if (btn.cType == "doctor-detail") {
            Page.toDoctorDetail(btn);
            return;
        } else if (btn.id == "recommend-9-img"&& RenderParam.carrierId =='630092') {
            Page.jumpfifHospital();
            return;
        } else if (btn.id == "recommend-3-img" && RenderParam.carrierId == '630092') {
            Page.jumpMofangPlugin();
            return;
        } else if (btn.id == "three-part-6-img" && RenderParam.carrierId == '630092') {
            Page.jumpExpertList();
            return;
        } else if (btn.id == "recommend-6-img" && (RenderParam.carrierId == '630092' || RenderParam.carrierId == '640092')) {
            //RenderParam.carrierId =='07430093' 走视频集
            Page.jumpMenuPage();
            return;
        } else {
            dataSource = btn.cIdx;
        }
        // alert(dataSource.entry_type);
        switch (parseInt(dataSource.entry_type)) {

            case HomeEntryType.NCOV_PAGE:
                // 新冠肺炎界面
                Page.jumpNCOVPage();
                break;
            case HomeEntryType.DONATE_BLOOD_PAGE:
                // 献血模块
                Page.jumpDonateBloodPage();
                break;
            case HomeEntryType.THIRD_PARTY_URL: //跳转第三方网页
                Page.jumpThirdPartyUrl(JSON.parse(dataSource.parameters)[0].param);
                break;
            case HomeEntryType.VIDEO_VISIT_BY_DEPART:
                //视频问诊-科室
                Page.jumpVideoVisitByDepart();
                break;
            case HomeEntryType.VIDEO_VISIT_BY_DOCTOR:
                //视频问诊-医生
                Page.jumpVideoVisitByDoctor();
                break;
            case HomeEntryType.ACTIVITYS:
                // 活动
                var params = JSON.parse(dataSource.parameters);
                Page.jumpActivityPage(params[0].param);
                break;
            case HomeEntryType.HEALTH_VIDEO_BY_TYPES:
                // 更多视频
                var innerParams = JSON.parse(dataSource.inner_parameters);
                var params = JSON.parse(dataSource.parameters);
                var modeTitle = innerParams.title;
                var modeType = params[0].param;
                Page.jumpHealthVideoHome(modeTitle, modeType, "1");
                break;
            case HomeEntryType.HEALTH_VIDEO:
                var nameTemp = dataSource && dataSource.inner_parameters;
                if (nameTemp === "") {
                    LMEPG.UI.showToast('播放该视频数据丢失或未配置！', 2);
                    return;
                }
                // 视频播放
                try {
                    var videoObj = nameTemp instanceof Object ? nameTemp : JSON.parse(nameTemp);
                    var videoUrl = RenderParam.platformType == "hd" ? videoObj.ftp_url.gq_ftp_url : videoObj.ftp_url.bq_ftp_url;
                    var sourceId = JSON.parse(dataSource.parameters)[0].param;
                    // 创建视频信息
                    var videoInfo = {
                        "sourceId": sourceId,
                        "videoUrl": encodeURIComponent(videoUrl),
                        "title": videoObj.title,
                        "type": videoObj.model_type,
                        "userType": videoObj.user_type,
                        "freeSeconds": videoObj.free_seconds,
                        "entryType": 1,
                        "entryTypeName": "home",
                        "focusIdx": btn.id,
                        'show_status': videoObj.showStatus,
                    };
                    //视频专辑下线处理
                    if(videoInfo.show_status == "3") {
                        LMEPG.UI.showToast('该节目已下线');
                        return;
                    }
                    if (Page.isAllowPlay(videoInfo)) {
                        Page.jumpPlayVideo(videoInfo);
                    } else {
                        Page.jumpBuyVip(videoInfo.title, videoInfo);
                    }
                } catch (e) {
                    LMEPG.UI.showToast("视频解析异常" + e.toString());
                }

                break;
            case HomeEntryType.GOODS:
                //设备商城
                Page.jumpDeviceStore();
                break;
            case HomeEntryType.GOODS_BY_ID:
                //设备商城商品
                Page.jumpDeviceStoreById();
                break;
            case HomeEntryType.HOME_PAGE:
                Page.jumpHomeUI();
                //首页
                break;
            case HomeEntryType.JIANKANGQINGHAI:
                Page.jumpMenuPage();
                //健康青海
                break;
            case HomeEntryType.VIDEO_VISIT_HOME:
                Page.jumpVideoVisitHome();
                //视频问诊
                break;
            // case HomeEntryType.DOCTOR_CONSULTATION_HOME:
            //     Page.jump39Hospital();
            //     break;
            case HomeEntryType.MY_FIMILY_HOME:
                Page.jumpMyFamilyUI();
                //我的家
                break;
            case HomeEntryType.HEALTH_VIDEO_HOME:
                //健康视频首页
                var innerParams = JSON.parse(dataSource.inner_parameters);
                var params = JSON.parse(dataSource.parameters);
                var modeTitle = innerParams.title;
                var modeType = params[0].param;
                Page.jumpHealthVideoHome(modeTitle, modeType, "1");
                break;
            case HomeEntryType.HEALTH_VIDEO_SUBJECT:
            case HomeEntryType.ALBUM_UI:
            case HomeEntryType.ALBUM_GRAPHIC:
            case HomeEntryType.ALBUM_GRAPHIC1:
                // 专辑
                // if (HomeEntryType.FREE_ALBUM) {
                //     // 绝对地址
                //     Page.jumpAlbumPage(btn.albumName);
                // } else {
                //     // 配置地址
                //     Page.jumpAlbumPage(data.source_id);
                // }
                var params = JSON.parse(dataSource.parameters);
                Page.jumpAlbumPage(params[0].param);
                break;
            case HomeEntryType.ALBUM_VIDEO_SET:
                var videoSetJson = JSON.parse(dataSource.parameters);
                var videoSetId = videoSetJson[0]['param'];
                Network.getAlbumIdByAlias(videoSetId, function (subject_id) {
                    Page.jumpVideoSet(subject_id);
                });
                break;
            case HomeEntryType.GRAPHIC_CLASS:
                var classifyJson = JSON.parse(dataSource.parameters);
                var classifyId = classifyJson[0]['param'];
                Page.jumpGraphicColumn(classifyId);
                break;
            case HomeEntryType.GRAPHIC_DETAIL:
                var graphicJson = JSON.parse(dataSource.parameters);
                var graphicId = graphicJson[0]['param'];
                Page.jumpGraphicDetail(graphicId);
                break;
            case HomeEntryType.GUAHAO_HOME:
                // 挂号主页
                Page.jumpGuaHaoPage();
                break;
            case HomeEntryType.GUAHAO_BY_HOSP:
                //挂号-医院
                Page.jumpGuaHaoByHospital(data.source_id);
                break;
            case HomeEntryType.USER_GUIDE:
                //用户指南
                Page.jumpUserGuide();
                break;
            case HomeEntryType.HEALTH_MEASURE:
                var typeId = JSON.parse(dataSource.parameters)[0].param;
                if (typeId === '1' || typeId === '') {
                    //健康检测
                    Page.jumpHealthMeasure();
                } else {
                    // if (RenderParam.carrierId === '420092') {
                    //     if (dataSource.hasOwnProperty('archive') && dataSource.archive) {
                    //         Page.jumpTestRecordDetail(dataSource.memberId, typeId);
                    //     } else {
                    //         Page.jumpDataArchiving();
                    //     }
                    // } else {
                    var objCurrent = Pages.getCurrentPage();
                    var objHomeTab = LMEPG.Intent.createIntent('sg-blood');
                    if (typeId === '10006' || typeId === '10003') {
                        objHomeTab = LMEPG.Intent.createIntent('test-weight');
                    }
                    objHomeTab.setParam("deviceModelId", typeId);

                    LMEPG.Intent.jump(objHomeTab, objCurrent);
                    // }
                }
                break;
            case HomeEntryType.EXPERT_CONSULTATION:
                Page.jumpExpertConsultation();
                //专家约诊
                break;
            case HomeEntryType.EXPERT_CONSULTATION_REMIND:
                //专家约诊消息提醒
                Page.jumpExpertConsultationRemind();
                break;
            case HomeEntryType.SEARCH:
                //搜索
                Page.jumpSearchPage();
                break;
            case HomeEntryType.YEJIANYAOFANG:
                //夜间药房
                Page.jumpNightMedicine();
                break;
            case HomeEntryType.FREE_ALBUM:
                Page.jumpAlbumPage(btn.albumName);
                break;
            case HomeEntryType.HEALTH_SELF_TEST: // 健康自测
            case HomeEntryType.PSYCHOLOGY_TEST:  // 心理测试
                Page.jumpMofangPlugin();
                break;
            case HomeEntryType.NUCLEATORDER:
                // 核酸检测模块
                Page.jumpNucleatOrder();
                break;
            case HomeEntryType.ONE_CLICK_INQUIRY:
                // 一键问诊，获取问诊医生
                InquiryDoc.inquiryDoctor(btn.id);
                break;
            case HomeEntryType.Custom_Module:
                //跳转定制模块
                Page.jumpCustomModule(JSON.parse(dataSource.parameters)[0].param);
                break;
            default:
                LMEPG.UI.showToast('入口地址解析不正确，请联系管理员！', 2);
                break;
        }
    },
    childrenLock: function () {
        if (RenderParam.payLockStatus == "0") {
            // 童锁未开启，开启童锁
            var postData = {
                'flag': 1,
                'focusIndex': 'lock',
                'returnPageName': "home"
            };
            LMEPG.ajax.postAPI("Pay/getPayLockSetUrl", postData, function (data) {
                if (data.result == 0) {
                    window.location.href = data.url;
                }
            });
        } else if (RenderParam.payLockStatus == "1") {
            var postData = {
                'flag': 0,
                'focusIndex': 'lock',
                'returnPageName': "home"
            };
            LMEPG.ajax.postAPI("Pay/getPayLockSetUrl", postData, function (data) {
                if (data.result == 0) {
                    window.location.href = data.url;
                }
            });
        }
    },
    /**
     * 退订
     * @param btn
     */
    cancelOrderProduct: function (btn) {
        modal.commonDialog({
            beClickBtnId: btn.id,
            onClick: function () {
                LMEPG.UI.showWaitingDialog();
                LMEPG.ajax.postAPI('Pay/cancelOrderProduct', null, function (data) {
                    // 把data转成json对象
                    data = data instanceof Object ? data : JSON.parse(data);
                    // 退订成功
                    if (data.result == 0 ) {
                        RenderParam.isVip=0;
                        var tips1 = '恭喜您退订健康魔方成功!';
                    } else if(data.result == 10030102) {
                        RenderParam.isVip=0;
                        var tips1 = '未订购该产品，退订失败!';
                    } else {
                        var tips1 = '退订失败，请重试！';
                    }
                    modal.textDialogWithSure({beClickBtnId: btn.id, onClick: Pages.init()}, "", tips1);
                    LMEPG.UI.dismissWaitingDialog();
                });
            }
        }, '', '您确定要终止续订健康魔方吗？', '');
    },
};
/**
 * 页面跳转类型
 * @type {{}}
 */
var HomeEntryType = {
    VIDEO_VISIT_BY_DEPART: 1,       // 视频问诊-科室
    NCOV_PAGE: 48,                  // 新冠肺炎界面
    VIDEO_VISIT_BY_DOCTOR: 2,       // 视频问诊-医生
    ACTIVITYS: 3,                   // 活动
    HEALTH_VIDEO_BY_TYPES: 4,       // 健康视频分类
    HEALTH_VIDEO: 5,                // 健康视频
    GOODS: 6,                       // 设备商城
    GOODS_BY_ID: 7,                 // 设备商城商品
    HOME_PAGE: 8,                   // 首页
    VIDEO_VISIT_HOME: 9,            // 视频问诊
    DOCTOR_CONSULTATION_HOME: 10,   // 名医会诊
    MY_FIMILY_HOME: 45,             // 我的家
    HEALTH_VIDEO_HOME: 12,          // 健康视频首页
    HEALTH_VIDEO_SUBJECT: 13,       // 健康视频专题
    GUAHAO_HOME: 14,                // 预约挂号
    GUAHAO_BY_HOSP: 15,             // 预约挂号-医院
    USER_GUIDE: 16,                 // 使用指南
    HEALTH_MEASURE: 17,             // 健康检测
    SEARCH: 18,                     // 搜索
    EXPERT_CONSULTATION: 19,        // 专家约诊
    FREE_ALBUM: 21,                 // 免费专区
    EXPERT_CONSULTATION_REMIND: 20, // 专家约诊消息提醒
    THIRD_PARTY_URL: 22,            // 跳转第三方应用

    YEJIANYAOFANG: 24,

    ALBUM_UI: 33,                   // UI专辑
    ALBUM_VIDEO_SET: 34,            // 专辑 - 视频集

    GOODS_RECORD: 38,               // 设备购买记录

    ALBUM_GRAPHIC: 39,              // 专辑 - 图文
    ALBUM_GRAPHIC1: 49,             // 专辑 - 图文

    HEALTH_SELF_TEST: 40,           // 健康自测
    PSYCHOLOGY_TEST: 41,            // 心理测试

    GRAPHIC_CLASS: 42,              // 图文栏目
    GRAPHIC_DETAIL: 43,             // 图文
    EXPERTS_INTRODUCE: 48,
    DONATE_BLOOD_PAGE: 53,          // 献血模块
    NUCLEATORDER: 59,               // 核酸检测
    ONE_CLICK_INQUIRY: 60,          // 一键问医
    HEALTH_TESTING: 61,             // 健康检测
    Custom_Module: 62,              // 定制模块
};

/**
 * ***************************************处理网络请求*******************************************
 */
var Network = {
    getAlbumIdByAlias: function (aliasName, callback) {
        LMEPG.UI.showWaitingDialog();
        var reqData = {
            'aliasName': aliasName
        };
        LMEPG.ajax.postAPI('Album/getAlbumIdByAlias', reqData, function (rsp) {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.result == 0) {
                callback(data.album_id);
            } else {
                LMEPG.UI.showToast('获取视频集id失败!');
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },


};

/**
 * ***************************************处理问诊相关*******************************************
 */
var InquiryDoc = {

    /**
     * 获取当前在线的医生
     */
    inquiryDoctor: function (buttonId) {
        var requestInfo = {
            deptId: RenderParam.departmentId,       // 医院科室ID
            deptIndex: RenderParam.departmentIndex, // 医院科室编号
            page: 1,                                // 医生列表分页所在分页
            pageSize: 1                             // 医生列表单页显示医生数量
        }
        // 默认获取在线医生第一位
        LMEPG.Inquiry.p2pApi.getDoctorList(true, requestInfo, function (doctorListData) {
            var doctorList = doctorListData.list;
            var doctorInfo = InquiryDoc.doctorInfo = doctorList[0];
            var inquiryInfo = {
                userInfo: {
                    isVip: RenderParam.isVip,                                    // 用户身份信息标识
                    accountId: RenderParam.userAccount,                          // IPTV业务账号
                },
                memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
                moduleInfo: {
                    moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                    moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                    moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                    focusId: buttonId,                                           // 当前页面的焦点Id
                    intent: Pages.getCurrentPage(),                              // 当前模块页面路由标识
                },
                doctorInfo: doctorInfo,
                serverInfo: {
                    cwsHlwyyUrl: RenderParam.cwsHlwyyUrl,                        // cws互联网医院模块链接地址
                    teletextInquiryUrl: RenderParam.teletextInquiryUrl,          // 微信图文问诊服务器链接地址
                },
                blacklistHandler: InquiryDoc.showBlacklistUserTips,              // 校验用户黑名单时处理函数
                noTimesHandler: InquiryDoc.showNoInquiryTimesTips,               // 检验普通用户无问诊次数处理函数
                doctorOfflineHandler: InquiryDoc.showDoctorOfflineTips,          // 检验医生离线状态时处理函数
                inquiryEndHandler: InquiryDoc.inquiryEndHandler,                 // 检测医生问诊结束之后，android端回调JS端的回调函数
                inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
            }
            // 判断当前医生问诊在线状态方式
            if (doctorInfo.is_video_inquiry == 1) { // 视频在线
                // 启动视频问诊
                inquiryInfo.inquiryType = LMEPG.Inquiry.p2p.InquiryType.VIDEO;
                LMEPG.Inquiry.p2p.startInquiry(inquiryInfo);
            } else if (doctorInfo.is_im_inquiry == 1) { // 微信在线
                // 启动图文问诊（弹窗二维码，微信扫码问诊）
                LMEPG.Inquiry.p2p.startWeChatTeletextInquiry(RenderParam.teletextInquiryUrl, RenderParam.cwsHlwyyUrl, buttonId);
            } else { // 所有问诊方式都不在线
                LMEPG.UI.showToast("当前医生不在线！");
            }
        }, function (errorData) {
            LMEPG.UI.showToast("获取问诊医生失败！");
        });
    },

    /**
     * 问诊用户黑名单提示
     */
    showBlacklistUserTips: function () {
        LMEPG.UI.showToast("当前功能被限制");
    },

    /**
     * 问诊次数为0提示
     */
    showNoInquiryTimesTips: function () {
        var noTimeTips = '您的免费问诊次数已用完，成为VIP即可不限问诊次数。';
        LMEPG.UI.commonDialog.show(noTimeTips, ["确定", "取消"], function (index) {
            if (index === 0) {
                BtnOnClick.jumpBuyVip();
            }
        });
    },

    /**
     * 问诊时医生离线提示
     */
    showDoctorOfflineTips: function () {
        LMEPG.UI.showToast('当前医生不在线');
    },

    /**
     * 检测问诊结束以后android端回调JS端的处理函数
     * @param inquiryEndData 回调时携带的参数
     */
    inquiryEndHandler: function (inquiryEndData) {
        console.log("inquiryEndHandler - data - " + inquiryEndData);
    },

}