var SplashRouteConstants = {
    ROUTE_GAME_DETAILS: 100, // 游戏详情页
};

LMSplashRouter.routeAreaModule = function (routeFlag, moduleParam) {
    switch (routeFlag) {
        case SplashRouteConstants.ROUTE_GAME_DETAILS:
            // 游戏详情页
            SplashRoute.routerGameDetails(moduleParam);
            break;
        default:
            LMSplashRouter.routeHome();
            break;
    }
};

var SplashRoute = {
    /** 预约挂号页面*/
    routerGameDetails: function (gameId) {
        var gameIntent = LMEPG.Intent.createIntent("gameDetails");
        gameIntent.setParam('gameId', gameId);

        LMEPG.Intent.jump(gameIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },
};