// 启动之前操作
LMSplashController.beforeStart = function (callback) {
    // 设置时间到cookie，用于解决中国联通EPG 展厅那里有个盒子，操作一次遥控，响应两次onkeydown的问题
    LMEPG.Cookie.setCookie('lastTime', new Date().getTime());
    callback();
};

LMSplashController.handleRoute = function (infoData) {
    LMSplashController.routeByEntryType(RenderParam.userfromType, infoData);
};

LMSplashRouter.routeDoctorList = function () {
    /** 路由医生列表 */
    var doctorListIntent = LMEPG.Intent.createIntent('doctorIndex');
    doctorListIntent.setParam("inner", 0); // 问诊返回局方大厅
    LMEPG.Intent.jump(doctorListIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
};

