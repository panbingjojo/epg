
// 启动之前操作
LMSplashController.beforeStart = function (callback) {
    // 设置时间到cookie，用于解决中国联通EPG 展厅那里有个盒子，操作一次遥控，响应两次onkeydown的问题
    LMEPG.Cookie.setCookie('lastTime', new Date().getTime());
    callback();
}

// 修改loadUserInfo成功之后路由跳转逻辑，区别于中国联通检测活动特殊跳转
LMSplashController.handleRoute = function (infoData) {
    LMSplashController.routeByEntryType(RenderParam.userfromType, infoData);
}
