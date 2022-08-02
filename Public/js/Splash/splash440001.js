LMSplashRouter.routeV13VideoSet = function (routeParams) {
    debugger
    var base64 = new Base64();
    var decodeStr = base64.decode(routeParams);
    var model = JSON.parse(decodeStr);
    if (model.navPage){
        /** 跳转二级目录*/
        splashRoute440001.routeVideoSetNewV13Secondary(model.modelType,model.modelName
            ,model.navPage,model.keepNavFocusId,model.page,model.navIndex);
    }else {
        splashRoute440001.routeVideoSetNewV13(model.modelType,model.modelName);
    }
}

var splashRoute440001 = {
    /** 路由新视频集--二级目录 */
    routeVideoSetNewV13Secondary: function (modelType,modelName,navPage,keepNavFocusId,page,navIndex) {
        var videoSetIntent = LMEPG.Intent.createIntent("channelIndex");
        videoSetIntent.setParam("modelType", modelType);
        videoSetIntent.setParam("modelName", modelName);
        videoSetIntent.setParam('focusId', 'focus-0');
        videoSetIntent.setParam('navPage', navPage);
        videoSetIntent.setParam('keepNavFocusId', keepNavFocusId);
        videoSetIntent.setParam('page',page );
        videoSetIntent.setParam('navIndex', navIndex);
        LMEPG.Intent.jump(videoSetIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },
    /** 路由新视频集 */
    routeVideoSetNewV13: function (modelType,modelName) {
        var videoSetIntent = LMEPG.Intent.createIntent("channelIndex");
        videoSetIntent.setParam("modelType", modelType);
        videoSetIntent.setParam("modelName", modelName);
        videoSetIntent.setParam("isExitApp", 1);
        LMEPG.Intent.jump(videoSetIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
    },
}