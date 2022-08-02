var SplashRouteConstants = {
    ROUTE_HOME: 100, // 首页
    ROUTE_AGED_PAGE: 101, // 老年页：老年健康
    ROUTE_BABY_PAGE: 102, // 育儿页：宝贝指南
    ROUTE_WOMAN_PAGE: 103, // 女性页：女性健康
    ROUTE_MAN_PAGE: 104, // 男性页：名医访谈
    ROUTE_ANTI_CANCER_PAGE: 105, // 防癌页：疾病预防
    ROUTE_HEALTH_PAGE: 106, // 保健页：保健养生
    ROUTE_AGED_COLUMN: 107, // 老年保健栏目
    ROUTE_BABY_COLUMN: 108, // 宝贝天地栏目
    ROUTE_WOMAN_COLUMN: 109, // 女性宝典栏目
    ROUTE_HEALTH_COLUMN: 110, // 健康百科栏目：健康百科
    ROUTE_FEATURED_ALBUM: 111, // 精选栏目
    ROUTE_FREE_ALBUM: 112, // 免费专区页
    ROUTE_PHARMACY_PAGE: 113, // 便民药房页
    ROUTE_PUBLIC_BENEFIT: 114, // 爱心公益页
    ROUTE_HOSPITAL_PAGE: 115, // 医院
    ROUTE_EPIDEMIC_PAGE: 116, // 疫情
    ROUTE_DOCTORS_PAGE: 117, // 在线问诊
    ROUTE_INTOMEDIC_COLUMN: 118, // 走进医学
    ROUTE_NUCLEATORDER_COLUMN: 119, // 核酸检测
}

var SplashRouter640092 = {
    routerVideoSet: function (classifyId, modelType,modeTitle) {
        var videoSetIntent = LMEPG.Intent.createIntent('healthVideoList');
        videoSetIntent.setParam("classifyId", classifyId);
        videoSetIntent.setParam("modelType", modelType);

        videoSetIntent.setParam("userId", RenderParam.userId);
        videoSetIntent.setParam("page", typeof (page) === "undefined" ? "1" : page);
        videoSetIntent.setParam("modeTitle", modeTitle);

        LMEPG.Intent.jump(videoSetIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    //路由核酸检测
    routerNucleatOrder: function () {
        var NucleatOrderIntent = LMEPG.Intent.createIntent('nucleicAcidDetect');
        NucleatOrderIntent.setParam("focusIndex", "");

        LMEPG.Intent.jump(NucleatOrderIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    routePharmacyPage: function () {
        var pharmacyIntent = LMEPG.Intent.createIntent("nightMedicine");

        LMEPG.Intent.jump(pharmacyIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    routePublicBenefit: function () {
        var publicBenefitIntent = LMEPG.Intent.createIntent("commonweal");

        LMEPG.Intent.jump(publicBenefitIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    routeRegistration: function () {
        var registrationIntent = LMEPG.Intent.createIntent("appointmentRegister");

        LMEPG.Intent.jump(registrationIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    routeEpidemic: function () {
        var epidemicIntent = LMEPG.Intent.createIntent("nCoV-hospital-department");
        epidemicIntent.setParam("department", "nCoV");

        LMEPG.Intent.jump(epidemicIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    routeDoctors: function () {
        var doctorsIntent = LMEPG.Intent.createIntent('doctorIndex');
        doctorsIntent.setParam("inner", 0); // 问诊返回局方大厅

        LMEPG.Intent.jump(doctorsIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    }
}

LMSplashRouter.routeHome = function(){
    if(RenderParam.lmp == 15){
        SplashRouter640092.routeDoctors();
    }else {
        LMEPG.Intent.jump(LMSplashRouter.homeIntent(), LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
}

LMSplashRouter.routeAreaModule = function (routeFlag) {
    switch (routeFlag) {
        case SplashRouteConstants.ROUTE_HOME:
            LMSplashRouter.routeHome();
            break;
        case SplashRouteConstants.ROUTE_AGED_PAGE:
            SplashRouter640092.routerVideoSet("2", "30","老年健康");
            break;
        case SplashRouteConstants.ROUTE_BABY_PAGE:
            SplashRouter640092.routerVideoSet("3", "29","宝贝指南");
            break;
        case SplashRouteConstants.ROUTE_WOMAN_PAGE:
            SplashRouter640092.routerVideoSet("4", "28","女性健康");
            break;
        case SplashRouteConstants.ROUTE_MAN_PAGE:
            SplashRouter640092.routerVideoSet("5", "27","名医访谈");
            break;
        case SplashRouteConstants.ROUTE_ANTI_CANCER_PAGE:
            SplashRouter640092.routerVideoSet("6", "31","疾病预防");
            break;
        case SplashRouteConstants.ROUTE_HEALTH_PAGE:
            SplashRouter640092.routerVideoSet("5", "26","保健养生");
            break;
        case SplashRouteConstants.ROUTE_INTOMEDIC_COLUMN:
            SplashRouter640092.routerVideoSet("5", "25","走进医学");
            break;
        case SplashRouteConstants.ROUTE_AGED_COLUMN:
            SplashRouter640092.routerVideoSet("1", "4");
            break;
        case SplashRouteConstants.ROUTE_BABY_COLUMN:
            SplashRouter640092.routerVideoSet("1", "3");
            break;
        case SplashRouteConstants.ROUTE_WOMAN_COLUMN:
            SplashRouter640092.routerVideoSet("1", "2");
            break;
        case SplashRouteConstants.ROUTE_HEALTH_COLUMN:
            SplashRouter640092.routerVideoSet("1", "32","健康百科");
            break;
        case SplashRouteConstants.ROUTE_FEATURED_ALBUM:
            LMSplashRouter.routeAlbum("39Featured");
            break;
        case SplashRouteConstants.ROUTE_FREE_ALBUM:
            LMSplashRouter.routeAlbum("FreeAlbum");
            break;
        case SplashRouteConstants.ROUTE_PHARMACY_PAGE:
            SplashRouter640092.routePharmacyPage();
            break;
        case SplashRouteConstants.ROUTE_PUBLIC_BENEFIT:
            SplashRouter640092.routePublicBenefit();
            break;
        case SplashRouteConstants.ROUTE_HOSPITAL_PAGE:
            SplashRouter640092.routeRegistration();
            break;
        case SplashRouteConstants.ROUTE_EPIDEMIC_PAGE:
            SplashRouter640092.routeEpidemic();
            break;
        case SplashRouteConstants.ROUTE_DOCTORS_PAGE:
            SplashRouter640092.routeDoctors();
            break;
        case SplashRouteConstants.ROUTE_NUCLEATORDER_COLUMN:
            SplashRouter640092.routerNucleatOrder();
            break;
    }
}