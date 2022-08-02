
var SplashRouteConstants = {
    ROUTE_HOME: 100, // 首页
    ROUTE_NAV_PAGE_1: 101, // 导航页1
    ROUTE_NAV_PAGE_2: 102, // 导航页2
    ROUTE_NAV_PAGE_3: 103, // 导航页3
    ROUTE_NAV_PAGE_4: 104, // 导航页4
    ROUTE_BABY_COLUMN: 105, // 宝贝天地栏目
    ROUTE_AGED_COLUMN: 106, // 老年保健栏目
    ROUTE_WOMAN_COLUMN: 107, // 女性宝典栏目
    ROUTE_HEALTH_COLUMN: 108, // 健康百科栏目
    ROUTE_DOCTOR_LIST: 109, // 医生列表页
    ROUTE_HEALTH_DETECTION: 112, // 健康检测页
    COMMUNITY_HOSPITAL: 111, // 社区医院
    HOSPITAL_LIST: 113, // 天翼问诊

    NAV_PAGE_1: "homeTab1", // 导航页1路由标识
    NAV_PAGE_2: "homeTab2", // 导航页2路由标识
    NAV_PAGE_3: "homeTab3", // 导航页3路由标识
    NAV_PAGE_4: "homeTab4", // 导航页4路由标识

    BABY_COLUMN_TITLE: "宝贝天地", // 宝贝天地栏目
    AGED_COLUMN_TITLE: "老年保健", // 老年保健栏目
    WOMAN_COLUMN_TITLE: "女性宝典", // 女性宝典栏目
    HEALTH_COLUMN_TITLE: "健康百科", // 健康百科栏目

    WOMAN_COLUMN_TYPE: "1", // 女性宝典类型
    BABY_COLUMN_TYPE: "2", // 宝贝天地类型
    AGED_COLUMN_TYPE: "3", // 老年保健类型
    HEALTH_COLUMN_TYPE: "4", // 健康百科类型
}

var SpecialJump={
    routeHospitalList:function () {
        var current = LMEPG.Intent.createIntent('home');
        var obj = LMEPG.Intent.createIntent('doctor-entrance');
        LMEPG.Intent.jump(obj, current, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    }
}

LMSplashRouter.routeAreaModule = function (routeFlag,params, areaName) {
    switch (routeFlag) {
        case SplashRouteConstants.ROUTE_HOME:
            LMSplashRouter.routeHome();
            break;
        case SplashRouteConstants.ROUTE_NAV_PAGE_1:
            LMSplashRouter.routeNavPage(SplashRouteConstants.NAV_PAGE_1);
            break;
        case SplashRouteConstants.ROUTE_NAV_PAGE_2:
            LMSplashRouter.routeNavPage(SplashRouteConstants.NAV_PAGE_2);
            break;
        case SplashRouteConstants.ROUTE_NAV_PAGE_3:
            LMSplashRouter.routeNavPage(SplashRouteConstants.NAV_PAGE_3);
            break;
        case SplashRouteConstants.ROUTE_NAV_PAGE_4:
            LMSplashRouter.routeNavPage(SplashRouteConstants.NAV_PAGE_4);
            break;
        case SplashRouteConstants.ROUTE_BABY_COLUMN:
            LMSplashRouter.routeVideoColumn(SplashRouteConstants.BABY_COLUMN_TITLE, SplashRouteConstants.BABY_COLUMN_TYPE);
            break;
        case SplashRouteConstants.ROUTE_AGED_COLUMN:
            LMSplashRouter.routeVideoColumn(SplashRouteConstants.AGED_COLUMN_TITLE, SplashRouteConstants.AGED_COLUMN_TYPE);
            break;
        case SplashRouteConstants.ROUTE_WOMAN_COLUMN:
            LMSplashRouter.routeVideoColumn(SplashRouteConstants.WOMAN_COLUMN_TITLE, SplashRouteConstants.WOMAN_COLUMN_TYPE);
            break;
        case SplashRouteConstants.ROUTE_HEALTH_COLUMN:
            LMSplashRouter.routeVideoColumn(SplashRouteConstants.HEALTH_COLUMN_TITLE, SplashRouteConstants.HEALTH_COLUMN_TYPE);
            break;
        case SplashRouteConstants.ROUTE_DOCTOR_LIST:
            LMSplashRouter.routeDoctorList();
            break;
        case SplashRouteConstants.ROUTE_HEALTH_DETECTION:
            LMSplashRouter.routeHealthTestIndex();
            break;
        case SplashRouteConstants.COMMUNITY_HOSPITAL:
            LMSplashRouter.routeCommunityHospital(areaName);
            break;
        case SplashRouteConstants.HOSPITAL_LIST:
            SpecialJump.routeHospitalList();
            break;
    }
}


