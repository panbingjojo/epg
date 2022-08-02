
LMSplashRouter.routeVideoIntro = function (packageId) {
    var videoIntroIntent = MEPG.Intent.createIntent("introVideo-detail");
    videoIntroIntent.setParam("packageId", packageId);
    LMEPG.Intent.jump(videoIntroIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
}

LMSplashController.handleRoute = function (respData) {
    if (RenderParam.userfromType == LMSplashConstant.ENTRY_HOME_FLAG && respData.packageId) {
        LMSplashRouter.routeVideoIntro(respData.packageId)
    } else {
        LMSplashController.routeByEntryType(RenderParam.userfromType, respData);
    }
}

var SplashRouteConstants = {
    ROUTE_DOCTORS_PAGE: 100, // 医院
}

LMSplashRouter.routeAreaModule = function (routeFlag) {
    LMEPG.Log.debug("splash450094.js-->routeAreaModule->routeFlag-->" + routeFlag);
    if (routeFlag == SplashRouteConstants.ROUTE_DOCTORS_PAGE) {
        LMSplashRouter.routeDoctorList();
    }
}