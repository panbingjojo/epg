var SplashRouteConstants = {
    ROUTE_GUAHAO_HOME: 100, // 预约挂号首页
    ROUTE_GUAHAO_RECORD: 101, // 预约挂号记录
    ROUTE_FAMILY_MEMBER: 102, // 家庭成员(家庭档案)
    ROUTE_INQUIRY_RECORD: 103, // 问诊记录
    ROUTE_HEALTH_TEST_RECORD: 104, // 健康检测记录
    ROUTE_COLLECTION_HOME: 105, // 我的收藏
    ROUTE_HEALTH_TEST_HOME: 106, // 健康检测
    ROUTE_HEALTH_VIDEO_BY_TYPES: 107, // 更多视频
    ROUTE_DOCTORINDEX_PAGE: 108, // 在线问诊
    ROUTE_ABOUT_US_PAGE: 109, // 关于我们
    ROUTE_ACTIVITY_HOME: 110, // 问诊、预约活动首页
    ROUTE_NEW_VIDEO_BY_TYPES: 111, // 更多视频
    ROUTE_NEW_VIDEO_BY_SET: 112, // 更多视频
};

LMSplashRouter.routeAreaModule = function (routeFlag, moduleParam) {
    switch (routeFlag) {
        case SplashRouteConstants.ROUTE_GUAHAO_HOME:
            // 预约挂号首页
            SplashRoute520092.routerGuaHaoPage();
            break;
        case SplashRouteConstants.ROUTE_GUAHAO_RECORD:
            // 预约挂号记录
            SplashRoute520092.routerGuaHaoRecordPage();
            break;
        case SplashRouteConstants.ROUTE_FAMILY_MEMBER:
            // 家庭成员
            SplashRoute520092.routerFamilyMember();
            break;
        case SplashRouteConstants.ROUTE_INQUIRY_RECORD:
            // 问诊记录
            SplashRoute520092.routerP2PRecordHome();
            break;
        case SplashRouteConstants.ROUTE_HEALTH_TEST_RECORD:
            // 健康检测记录
            SplashRoute520092.routerHealthTestRecord();
            break;
        case SplashRouteConstants.ROUTE_COLLECTION_HOME:
            // 我的收藏
            SplashRoute520092.routerCollection();
            break;
        case SplashRouteConstants.ROUTE_HEALTH_TEST_HOME:
            // 健康检测
            SplashRoute520092.routerHealthTest();
            break;
        case SplashRouteConstants.ROUTE_HEALTH_VIDEO_BY_TYPES:
            // 更多视频
            SplashRoute520092.routerHealthVideoByTypes(moduleParam);
            break;
        case SplashRouteConstants.ROUTE_DOCTORINDEX_PAGE:
            //在线问诊
            SplashRoute520092.routerDoctorIndex();
            break;
        case SplashRouteConstants.ROUTE_ABOUT_US_PAGE:
            //关于我们
            SplashRoute520092.routerAboutUs();
            break;
        // 问诊、预约活动首页
        case SplashRouteConstants.ROUTE_ACTIVITY_HOME:
            SplashRoute520092.routerActivityPage(moduleParam);
            break;
        case SplashRouteConstants.ROUTE_NEW_VIDEO_BY_TYPES:
            var base64 = new Base64();
            var decodeStr = base64.decode(moduleParam);
            var model = JSON.parse(decodeStr);
            SplashRoute520092.routeVideoSetNewV13(model.modelType,model.modelName);
            break;
        case SplashRouteConstants.ROUTE_NEW_VIDEO_BY_SET:
            SplashRoute520092.routeVideoSetV13(moduleParam);
            break;
    }
};

var SplashRoute520092 = {
    /** 预约挂号页面*/
    routerGuaHaoPage: function () {
        var guaHaoIntent = LMEPG.Intent.createIntent("appointmentRegister");
        guaHaoIntent.setParam('focusIndex', '');

        LMEPG.Intent.jump(guaHaoIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    /** 跳转挂号记录 */
    routerGuaHaoRecordPage: function(){
        var guaHaoRecordIntent = LMEPG.Intent.createIntent("registeredRecord");
        // guaHaoRecordIntent.setParam('isFromMyFamilyPage', 1);

        LMEPG.Intent.jump(guaHaoRecordIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    // 跳转到家庭成员
    routerFamilyMember: function () {
        var familyMemberIntent = LMEPG.Intent.createIntent("familyHome");

        LMEPG.Intent.jump(familyMemberIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    // 跳转到收藏
    routerCollection: function () {
        var collectionIntent = LMEPG.Intent.createIntent("collect");

        LMEPG.Intent.jump(collectionIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    // 跳转到问诊记录
    routerP2PRecordHome: function () {
        var inquiryRecordIntent = LMEPG.Intent.createIntent("doctorRecordHome");
        LMEPG.Intent.jump(inquiryRecordIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    // 跳转健康检测
    routerHealthTest: function () {
        var HealthTestIntent = LMEPG.Intent.createIntent("testIndex");

        LMEPG.Intent.jump(HealthTestIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    // 跳转检测记录
    routerHealthTestRecord: function () {
        var HealthTestRecordIntent = LMEPG.Intent.createIntent("recordList");

        LMEPG.Intent.jump(HealthTestRecordIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    // 跳转视频问诊
    routerDoctorIndex: function () {
        var HealthTestRecordIntent = LMEPG.Intent.createIntent("doctorIndex");

        LMEPG.Intent.jump(HealthTestRecordIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    // 跳转视频问诊
    routerAboutUs: function () {
        var routerAboutUsIntent = LMEPG.Intent.createIntent("familyAbout");

        LMEPG.Intent.jump(routerAboutUsIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    // 跳转更多视频列表
    routerHealthVideoByTypes: function (moduleParam) {
        var videoMaps = [{},{"modeTitle": "预防疾病"}, {"modeTitle": "老年健康"},
            {"modeTitle": "宝贝指南"},{"modeTitle": "女性健康"},{"modeTitle": "健康百科"},
            {"modeTitle": "名医访谈"},{"modeTitle": "保健养生"},{"modeTitle": "走进医学"}];

        var modeTitle = videoMaps[moduleParam].modeTitle;
        var HealthVideoByTypesIntent = LMEPG.Intent.createIntent("healthVideoList");
        HealthVideoByTypesIntent.setParam('modeTitle', modeTitle);
        HealthVideoByTypesIntent.setParam('modelType', moduleParam);
        LMEPG.Intent.jump(HealthVideoByTypesIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    /** 问诊、预约活动首页*/
    routerActivityPage: function (moduleParam) {
        var activityIntent = LMEPG.Intent.createIntent("activity");
        activityIntent.setParam("activityName", 'ActivityConsultationAppointment20211018');
        activityIntent.setParam("inner", 0);

        if (moduleParam === 'inquiry') {
            var backPage = LMEPG.Intent.createIntent("doctorIndex");
        } else if (moduleParam === 'register') {
            var backPage = LMEPG.Intent.createIntent("appointmentRegister");
        } else {
            var backPage = LMSplashRouter.iptvPortalIntent();
        }

        LMEPG.Intent.jump(activityIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, backPage);
    },

    /** 路由新视频集 */
    routeVideoSetNewV13: function (modelType,modelName) {
        var videoSetIntent = LMEPG.Intent.createIntent("channelIndex");
        videoSetIntent.setParam("modelType", modelType);
        videoSetIntent.setParam("modelName", modelName);
        LMEPG.Intent.jump(videoSetIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },

    /** 路由视频集 */
    routeVideoSetV13: function (subjectId) {
        var videoSetIntent = LMEPG.Intent.createIntent("channelList");
        videoSetIntent.setParam("subject_id", subjectId);
        LMEPG.Intent.jump(videoSetIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },
};