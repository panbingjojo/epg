
var SplashRoute500094 = {
    ROUTE_DOCTOR_LIST: 101, // 首页

    /** 路由医生列表 */
    routeDoctorList: function(){
        var doctorListIntent = LMEPG.Intent.createIntent('doctorIndex');
        doctorListIntent.setParam("inner", 0); // 问诊返回局方大厅

        LMEPG.Intent.jump(doctorListIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
}

LMSplashRouter.routeAreaModule = function (routeFlag) {
    switch (routeFlag) {
        case SplashRoute500094.ROUTE_DOCTOR_LIST:
            SplashRoute500094.routeDoctorList();
            break;
    }
}

