
/** 路由外部模块常量 */
var SplashRouteConstants = {
    ROUTE_HOME: 100, // 首页

    ROUTE_DOCTOR_HOME: 107,// 在线问诊
}

/** 配置外部路由模块 */
LMSplashRouter.routeAreaModule = function (routeFlag, routeParams, areaName) {
    switch (routeParams) {
        case SplashRouteConstants.ROUTE_DOCTOR_HOME:
            // 路由到在线问诊模块
            var doctorListIntent = LMEPG.Intent.createIntent('doctorIndex');
            doctorListIntent.setParam("inner", 0); // 问诊返回局方大厅
            LMEPG.Intent.jump(doctorListIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
            break;
    }
}
