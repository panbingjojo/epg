var SplashRouteConstants = {
    ROUTE_NAV_PAGE_1: 100, // 导航页1
    ROUTE_NAV_PAGE_3: 101, // 导航页2
    ROUTE_EDU_COLUMN: 102, // 健康教育

    NAV_PAGE_1: "homeTab1", // 导航页1路由标识
    NAV_PAGE_3: "homeTab3", // 导航页3路由标识

    EDU_COLUMN_TITLE: "", // 健康教育栏目

    EDU_COLUMN_TYPE: "1", // 健康教育类型
}

LMSplashRouter.routeAreaModule = function (routeFlag) {
    switch (routeFlag) {
        case SplashRouteConstants.ROUTE_NAV_PAGE_1:
            LMSplashRouter.routeNavPage(SplashRouteConstants.NAV_PAGE_1);
            break;
        case SplashRouteConstants.ROUTE_NAV_PAGE_3:
            LMSplashRouter.routeNavPage(SplashRouteConstants.NAV_PAGE_3);
            break;
        case SplashRouteConstants.ROUTE_EDU_COLUMN:
            LMSplashRouter.routeHealthVideo(SplashRouteConstants.EDU_COLUMN_TITLE, SplashRouteConstants.EDU_COLUMN_TYPE);
            break;
    }
}