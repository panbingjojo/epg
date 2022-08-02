var SplashRouteConstants = {
    ROUTE_GUAHAO_HOME: 100, // 预约挂号首页
}

LMSplashRouter.routeAreaModule = function (routeFlag) {
    switch (routeFlag) {
        case SplashRouteConstants.ROUTE_GUAHAO_HOME:
            LMSplashRouter.routerGuaHaoPage();
            break;
    }
}