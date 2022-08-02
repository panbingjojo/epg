
LMSplashRouter.routeHome = function () {
    if (RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002") {
        var turnPageInfo = {
            currentPage: location.href,
            turnPage: location.origin + "/index/Home/Main/homeV13",
            turnPageName: "首页",
            turnPageId: "",
            clickId: ""
        };
        ShanDongHaiKan.sendReportData('6', turnPageInfo);
    }
    LMEPG.Intent.jump(LMSplashRouter.homeIntent(), LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
};

LMSplashRouter.routeDoctorList = function () {
    /** 路由医生列表 */
    var doctorListIntent = LMEPG.Intent.createIntent('doctorIndex');
    doctorListIntent.setParam("inner", 0); // 问诊返回局方大厅
    LMEPG.Intent.jump(doctorListIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
};