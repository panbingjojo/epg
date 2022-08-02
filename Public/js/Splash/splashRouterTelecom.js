var SplashRouteConstants = {
    ROUTE_HOME: 100, // 首页
    ROUTE_NAV_PAGE_1: 101, // 导航页1
    ROUTE_NAV_PAGE_2: 102, // 导航页2
    ROUTE_NAV_PAGE_3: 103, // 导航页3
    ROUTE_NAV_PAGE_4: 104, // 导航页4
    ROUTE_AGED_COLUMN: 105, // 老年保健栏目
    ROUTE_BABY_COLUMN: 106, // 宝贝指南栏目
    ROUTE_WOMAN_COLUMN: 107, // 女性宝典栏目
    ROUTE_HEALTH_COLUMN: 108, // 健康百科栏目
    ROUTE_ALBUM_COLUMN: 109, // 精选专辑栏目
    ROUTE_DOCTOR_LIST: 110, // 医生列表页
    ROUTE_ORDER_PAGE: 111, // 订购页
    ROUTE_HOME_TAB: 112, //V13首页-发现模块

    NAV_PAGE_1: "homeTab1", // 导航页1路由标识
    NAV_PAGE_2: "homeTab2", // 导航页2路由标识
    NAV_PAGE_3: "homeTab3", // 导航页3路由标识
    NAV_PAGE_4: "homeTab4", // 导航页4路由标识

    BABY_COLUMN_TITLE: "宝贝指南", // 宝贝指南栏目
    AGED_COLUMN_TITLE: "老年保健", // 老年保健栏目
    WOMAN_COLUMN_TITLE: "女性宝典", // 女性宝典栏目
    HEALTH_COLUMN_TITLE: "健康百科", // 健康百科栏目
    ALBUM_COLUMN_TITLE: "精选专辑", // 精选专辑栏目

    HEALTH_COLUMN_TYPE: "1", // 健康百科类型
    WOMAN_COLUMN_TYPE: "2", // 女性宝典类型
    AGED_COLUMN_TYPE: "3", // 老年保健类型
    BABY_COLUMN_TYPE: "4", // 宝贝天地类型
    ALBUM_COLUMN_TYPE: "5", // 精选专辑类型
}

LMSplashRouter.routeAreaModule = function (routeFlag,routeParams) {
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
        case SplashRouteConstants.ROUTE_ALBUM_COLUMN:
            LMSplashRouter.routeVideoColumn(SplashRouteConstants.ALBUM_COLUMN_TITLE, SplashRouteConstants.ALBUM_COLUMN_TYPE);
            break;
        case SplashRouteConstants.ROUTE_DOCTOR_LIST:
            LMSplashRouter.routeDoctorList();
            break;
        case SplashRouteConstants.ROUTE_ORDER_PAGE:
            LMSplashRouter.routerOrderPage();
            break;
        case SplashRouteConstants.ROUTE_HOME_TAB:
            LMSplashRouter.routerJumpHomeTab(routeParams);
            break
    }
}