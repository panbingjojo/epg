var timeOut;
/********************************************************
 *  常量定义区
 * ******************************************************/
var LMSplashConstant = {
    HD_PLATFORM: "hd", // 高清平台
    SD_PLATFORM: "sd", // 标清平台

    SHOW_TOAST_SECOND_3: 3, // toast显示时间3秒
    SHOW_TOAST_MILLISECOND_3000: 3000, // toast显示时间3000毫秒
    LIMIT_PERMISSION_TIPS: "您已受限使用该业务，暂时不能进入！", // 登录时用户受限
    LIMIT_PERMISSION_CODE: -10, // 登录时用户受限编码

    ENTRY_HOME_FLAG: "0",              // 跳转首页标识
    ENTRY_ALBUM_FLAG: "1",             // 跳转专辑标识
    ENTRY_ACTIVITY_FLAG: "2",          // 跳转活动标识
    REQUEST_ROUTER_INFO_FLAG: "3",     // 请求获取
    ENTRY_VIDEO_INTRO_FLAG: "4",       // 跳转视频简介标识
    ENTRY_HOSPITAL_FLAG: "5",          // 跳转医院模块标识
    ENTRY_TELETEXT_ALBUM_FLAG: "6",    // 跳转图文专辑详情模块标识
    ENTRY_ASSIGN_MODULE_FLAG: "1000",  // 跳转模块标识
    ENTRY_RECOMMEND_ALBUM_FLAG: 1,     // 跳转推荐专辑标识
    ENTRY_RECOMMEND_ACTIVITY_FLAG: 2,  // 跳转推荐活动标识
    ENTRY_RECOMMEND_PLAYER_FLAG: 3,    // 跳转推荐视频标识
    ENTRY_RECOMMEND_VIDEO_SET_FLAG: 4, // 跳转推荐视频集标识


    ROUTE_AREA_MODULE_FLAG: 1, // 指定模块 -- 路由地区模块
    ROUTE_EPIDEMIC_FLAG: 2, // 指定模块 -- 路由疫情模块
    ROUTE_HOSPITAL_FLAG: 3, // TODO 指定模块 -- 路由医院模块
    ROUTE_CUSTOMIZE_FLAG: 4, // 振兴乡村模块


    PLAYER_ENTRY_TYPE: 1,// 播放器进入类型
    PLAYER_ENTRY_TYPE_NAME: "epg-home",// 播放器进入类型名称，EPG大厅

    EPG_HALL_ENTRY_FLAG: 0, // 局方大厅进入标识 0 -- 局方大厅推荐位进入（为解决局方提出大厅进入指定模块，从指定模块需要返回局方大厅设置改标志位）
};

/********************************************************
 *  视图层
 * ******************************************************/
var LMSplashView = {
    //  设置背景图片
    setBackground: function () {
        var platformType = RenderParam.platformType
        platformType === "" && (platformType = "hd")

        var splashBg = g_appRootPath + '/Public/img/' + platformType + '/Splash/V1/bg_splash.jpg';

        // var customStaticBgCarriers = ['371092', '440004', '520095', '10220094', '10640092'];
        if (RenderParam.epgSplashPictureUrl) {
            var splashBgTemp = LMSplashController.getConfigBackground();
            if (LMEPG.Func.isObject(splashBgTemp)) { // 宁夏移动apk，前景需要一张动态的gif图
                splashBg = RenderParam.fsUrl + splashBgTemp.bottom;
                if (splashBgTemp.top && G('splash_icon')) {
                    Show('splash_icon');
                    G('splash_icon').src = RenderParam.fsUrl + splashBgTemp.top;
                }
            } else {
                splashBg = RenderParam.fsUrl + splashBgTemp;
            }
        } /*else if (customStaticBgCarriers.indexOf(RenderParam.carrierId) > -1) { // 需要自定义静态页面的地区列表
            splashBg = g_appRootPath + '/Public/img/' + platformType + '/Splash/V1/bg_splash' + RenderParam.carrierId + '.jpg';
        }*/
        G('splash').src = splashBg;
    },

}

/********************************************************
 *  数据层
 * ******************************************************/
var LMSplashModel = {

    EMPTY_OBJECT: {}, // 空对象

    /**
     * 获取管理后台配置展示的进入应用的推荐模块
     * @param entryData   入口参数信息
     * @param successFunc 接口成功回调
     * @param failFunc    接口失败回调
     */
    getRecommendEntryType: function (entryData, successFunc, failFunc) {
        LMSplashModel.ajaxPost({
            urlPath: "User/getEntryRecommendInfo",
            funcName: "getRecommendEntryType",
            postData: entryData,
            successFunc: successFunc,
            failFunc: failFunc
        });
    },

    /**
     * 通用网络请求
     * @param ajaxPostParams 请求参数，其中
     * urlPath: 请求路径
     * funcName: 出发请求的方法
     * postData: 请求的参数
     * successFunc: 接口成功的回调函数
     * failFunc: 接口失败的回调参数
     */
    ajaxPost: function (ajaxPostParams) {
        var urlPath = ajaxPostParams.urlPath;
        var funcName = ajaxPostParams.funcName;
        var postData = ajaxPostParams.postData;
        var successFunc = ajaxPostParams.successFunc;
        var failFunc = ajaxPostParams.failFunc;
        LMEPG.Log.debug("LMSplashModel->" + funcName + "->postData->" + JSON.stringify(postData));
        LMEPG.Log.debug("LMSplashModel->" + funcName + "->urlPath->" + JSON.stringify(urlPath));
        LMEPG.ajax.postAPI(urlPath, postData, function (respData) {
            successFunc(respData);
        }, function (errorData) {
            LMEPG.Log.error("LMSplashModel->" + funcName + "->error->" + errorData);
            failFunc(errorData);
        })
    },
};

/********************************************************
 *  逻辑控制层
 * ******************************************************/
var LMSplashController = {

    /**
     * 初始化接口，提供外部调用
     */
    init: function () {
        // 初始化之前的操作
        LMSplashController.beforeStart(function () {
            // 1、初始化背景页，检测管理后台是否配置，否则使用本地图片
            LMSplashView.setBackground();
            // 2、存取初始化数据
            if (RenderParam.isRunOnAndroid === '1') {
                // 运行android平台
                LMSplashController.auth4Android();
            } else {
                // 运行EPG平台
                LMEPG.AuthUser.authUser(LMSplashController.authUserSuccess, LMSplashController.authUserFail, LMEPG.AuthUser.authNodeSplash);
            }
        });
    },

    getConfigBackground: function () {
        var copy = RenderParam.epgSplashPictureUrl;
        try {
            var urlObj = eval("(" + copy + ")");
            return LMEPG.Func.isObject(urlObj) ? urlObj : copy;
        } catch (e) {
            LMEPG.Log.info("[splash.js]--splashUrl erro:" + e.toString());
            return copy;
        }
    },

    /**
     * android平台的鉴权逻辑
     */
    auth4Android: function () {
        // 组装参数，进行后台鉴权
        var authData = {
            accountInfo: RenderParam.accountId,       // 用户的账号信息
            authNode: LMEPG.AuthUser.authNodeSplash,  // 当前鉴权的模块，此处为启动页鉴权
            isRunOnPC: isRunOnPC ? "1" : "-1",        // 是否使用浏览器运行程序
        }
        if (isRunOnPC) {
            LMEPG.AuthUser.authByNetwork(authData, LMSplashController.authUserSuccess, LMSplashController.authUserFail);
        } else {
            // 运行Android平台,需要获取
            LMAndroid.JSCallAndroid.doGetDeviceInfo(function (jsonData) {
                LMEPG.Log.info("[lmSplash.js]--[doGetDeviceInfo]----> jsonData: " + jsonData);
                authData.deviceInfo = jsonData;
                if (RenderParam.isAuthByAndroidSDK == '1') {
                    LMEPG.AuthUser.authUser4Android(authData, LMSplashController.authUserSuccess, LMSplashController.authUserFail);
                } else {
                    LMEPG.AuthUser.authByNetwork(authData, LMSplashController.authUserSuccess, LMSplashController.authUserFail);
                }
            });
        }
    },

    /**
     * 存取初始化数据之前的操作
     * @param callback 初始化前操作执行完成后的回调函数 -- 强制必须设置
     * */
    beforeStart: function (callback) {
        // 为兼容apk未来平台调整为回调函数状态
        if (RenderParam.isNewTVPlatform === '1') {
            // 运行在未来电视平台需要
        } else {
            callback();
        }

    },

    /** 调用后台用户鉴权成功回调 */
    authUserSuccess: function (data) {
        if (data.result == 0) {
            // 判断后台处理逻辑是否成功
            LMEPG.Log.debug("LMSplashController->authUserSuccess->success->" + JSON.stringify(data));
            if (RenderParam.isRunOnAndroid === '1') { // 判断如果运行在apk平台
                LMAndroid.JSCallAndroid.doSaveUserInfo(JSON.stringify(data)); // 同步相关信息，用于apk请求接口时封装头部信息
            }
            if (data.isRouteUpdatePage) {
                // 1、检测是否跳转系统升级页面
                LMSplashRouter.routeSystemUpdate();
            } else if (data.hasOwnProperty('activityName') && data.activityName && data.activityName !== '') { // 推荐配置活动，强制跳转活动
                LMSplashRouter.routeActivity(data.activityName);
            } else {
                // 2、根据路由信息进行跳转
                LMSplashController.handleRoute(data);
            }
        } else {
            LMEPG.Log.error("LMSplashController->authUserSuccess->fail->" + JSON.stringify(data));
            LMSplashController.exitApp();
        }
    },

    /** 调用后台用户鉴权失败回调 */
    authUserFail: function (data) {
        LMEPG.Log.error("LMSplashController->authUserSuccess->error->" + JSON.stringify(data));
        LMSplashController.exitApp();
    },

    /** 未易于各地区功能模块默写，提供当前函数，主要处理加载用户信息之后根据不同的跳转类型路由其他模块
     *  可做差异化处理
     * */
    handleRoute: function (infoData) {
        LMSplashController.routeByEntryType(RenderParam.userfromType, infoData);
    },

    /**
     * 根据不同的路由类型跳转不同的功能模块
     * @param entryType 跳转类型标识
     * @param infoData 跳转类型所需数据 -- 主要是loadUserInfo接口返回数据
     */
    routeByEntryType: function (entryType, infoData) {
        // 湖北电信EPG，临时调整链接跳转
        if (RenderParam.carrierId == "420092") {
            if (RenderParam.lmp == "19") {
                // 预约挂号
                var objGuaHao = LMEPG.Intent.createIntent("appointmentRegister");
                objGuaHao.setParam("focusIndex", "");
                LMEPG.Intent.jump(objGuaHao, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.iptvPortalIntent());
                return;
            }else if (RenderParam.lmp == "39") {
                // 在线问诊
                var doctorListIntent = LMEPG.Intent.createIntent('doctorIndex');
                // 直接返回局方大厅
                doctorListIntent.setParam("isExitApp", 1); // 问诊返回局方大厅

                LMEPG.Intent.jump(doctorListIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
                return;
            } else if (RenderParam.lmp == "42") {
                // 药品配送
                var moduleId = "plate1";
                var modelId = '';
                var customizeModuleIntent = LMEPG.Intent.createIntent("customizeModule");
                customizeModuleIntent.setParam("moduleId", moduleId);
                customizeModuleIntent.setParam("modelId", modelId);
                LMEPG.Intent.jump(customizeModuleIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT,  LMSplashRouter.iptvPortalIntent());
                return;
            } else if (RenderParam.lmp == "43") {
                // 本地服务
                var moduleId = "plate2";
                var modelId = '';
                var customizeModuleIntent = LMEPG.Intent.createIntent("customizeModule");
                customizeModuleIntent.setParam("moduleId", moduleId);
                customizeModuleIntent.setParam("modelId", modelId);
                LMEPG.Intent.jump(customizeModuleIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT,  LMSplashRouter.iptvPortalIntent());
                return;
            }
        }

        if(RenderParam.carrierId == "04630092"){
            if(infoData.isNewUser == '1'){
                LMSplashRouter.routeLogin();
                return;
            }
        }

        switch (entryType) {
            case LMSplashConstant.ENTRY_HOME_FLAG:
                LMSplashRouter.routeHome();
                break;
            case LMSplashConstant.ENTRY_ALBUM_FLAG:
                var albumAliasName = RenderParam.subId;
                LMSplashRouter.routeAlbum(albumAliasName);
                break;
            case LMSplashConstant.ENTRY_ACTIVITY_FLAG:
                var activityAliasName = RenderParam.subId == "-1" ? infoData.activityName : RenderParam.subId;
                LMSplashRouter.routeActivity(activityAliasName);
                break;
            case LMSplashConstant.ENTRY_VIDEO_INTRO_FLAG:
                var videoCode = RenderParam.subId;
                LMSplashRouter.routeVideoIntro(videoCode);
                break;
            case LMSplashConstant.ENTRY_HOSPITAL_FLAG:
                var hospitalName = RenderParam.subId;
                LMSplashRouter.routeHospital(hospitalName);
                break;
            case LMSplashConstant.ENTRY_TELETEXT_ALBUM_FLAG:
                var teletextCode = RenderParam.subId;
                LMSplashRouter.routeTeletextAlbum(teletextCode);
                break;
            case LMSplashConstant.ENTRY_ASSIGN_MODULE_FLAG:
                LMSplashRouter.routeAssignModule();
                break;
            case LMSplashConstant.REQUEST_ROUTER_INFO_FLAG:
                // 3 -- 需要根据管理后台配置的跳转类型来做跳转
                LMSplashController.routeRecommendEntryType();
                break;
            default:
                LMSplashRouter.routeHome();
                break;
        }
    },

    /** 请求管理后台确认启动页之后路由的页面 */
    routeRecommendEntryType: function () {
        LMSplashModel.getRecommendEntryType(LMSplashModel.EMPTY_OBJECT, LMSplashController.getRecommendEntryTypeSuccess, LMSplashController.getRecommendEntryTypeFail);
    },

    /** 请求路由配置成功回调，跳转对应模块 */
    getRecommendEntryTypeSuccess: function (respData) {
        if (respData.result == 0) { //  请求成功
            var recommendData = respData.data;
            LMSplashController.routeByRecommendEntryType(recommendData);
        } else { // 请求失败
            LMSplashRouter.routeHome();
        }
    },

    /** 请求路由配置失败回调，默认跳转首页 */
    getRecommendEntryTypeFail: function () {
        LMSplashRouter.routeHome();
    },

    /**
     * 根据管理后台配置的路由信息，做不同的功能模块路由
     * @param recommendData 管理后台配置的路由信息
     */
    routeByRecommendEntryType: function (recommendData) {
        var recommendEntryType = recommendData.type;
        switch (recommendEntryType) {
            case LMSplashConstant.ENTRY_RECOMMEND_ALBUM_FLAG:
                var albumAliasName = recommendData.alias_name;
                LMSplashRouter.routeAlbum(albumAliasName);
                break;
            case LMSplashConstant.ENTRY_RECOMMEND_ACTIVITY_FLAG:
                var activityAliasName = recommendData.alias_name;
                LMSplashRouter.routeActivity(activityAliasName);
                break;
            case LMSplashConstant.ENTRY_RECOMMEND_PLAYER_FLAG:
                var videoData = recommendData.video_info;
                LMSplashRouter.routePlayer(LMSplashController.assembleVideoInfo(videoData));
                break;
            case LMSplashConstant.ENTRY_RECOMMEND_VIDEO_SET_FLAG:
                var setId = recommendData.id;
                LMSplashRouter.routeVideoSet(setId);
                break;
            default:
                LMSplashRouter.routeHome();
                break;
        }
    },

    /**
     * 管理后台配置跳转具体视频时，需要组装视频信息到播放器模块
     * @param videoData 管理后台配置的视频信息
     * @param playOffsetPosition 视频的偏移时移值
     * @returns {string} 组装好跳转播放器的JSON数据
     */
    assembleVideoInfo: function (videoData, playOffsetPosition) {
        var videoUrlObj = videoData.ftp_url instanceof Object ? videoData.ftp_url : JSON.parse(videoData.ftp_url);
        var playUrl = videoUrlObj.gq_ftp_url; // 默认高清播放地址
        if (RenderParam.platformType == LMSplashConstant.SD_PLATFORM) {
            playUrl = videoUrlObj.bq_ftp_url; // 设置为标清播放地址
        }
        var videoInfo = {
            "sourceId": videoData.source_id,
            "videoUrl": playUrl,
            "title": videoData.title,
            "type": videoData.model_type,
            "userType": videoData.user_type,
            "freeSeconds": videoData.free_seconds,
            "entryType": LMSplashConstant.PLAYER_ENTRY_TYPE,
            "entryTypeName": LMSplashConstant.PLAYER_ENTRY_TYPE_NAME,
            "unionCode": videoData.union_code
        };
        if (typeof (playOffsetPosition) !== "undefined" && playOffsetPosition != 0) {
            videoInfo.currentPlayIndex = playOffsetPosition;
        }
        return JSON.stringify(videoInfo);
    },

    /** 退出当前应用到局方大厅 */
    exitApp: function () {
        if(RenderParam.carrierId == '500092'){
            clearTimeout(timeOut);
        }
        LMEPG.Intent.back('IPTVPortal'); // 返回epg大厅
    },

    /** 注册监听特殊按键 */
    registerSpecialKeys: function () {
        LMEPG.KeyEventManager.init();
        LMEPG.KeyEventManager.addKeyEvent(
            {
                KEY_BACK: 'LMSplashController.exitApp()',                                   // 返回
                KEY_ENTER: 'LMSplashRouter.routeJumpHome()',                        // 确定
                KEY_MUTE: 'LMSplashRouter.routeJumpHome()',                         // 静音
                KEY_VIRTUAL_EVENT: 'LMSplashRouter.routeJumpHome()',                      // 虚拟按键
                EVENT_MEDIA_END: 'LMSplashRouter.routeJumpHome()',                      // 虚拟按键
                EVENT_MEDIA_ERROR: 'LMSplashRouter.routeJumpHome()',                      // 虚拟按键
                KEY_VOL_UP: 'LMSplashRouter.routeJumpHome()',        // 音量+
                KEY_VOL_DOWN: 'LMSplashRouter.routeJumpHome()',      // 音量+
                KEY_DELETE: 'LMSplashController.exitApp()',                                   // 兼容辽宁华为EC2108V3H的删除键（返回键）
                KEY_FAST_FORWARD: 'LMSplashRouter.routeJumpHome()',      // 快进>>
                KEY_FAST_REWIND: 'LMSplashRouter.routeJumpHome()',       // 快退<<
                KEY_UP: 'LMSplashRouter.routeJumpHome()',    // 上键
                KEY_DOWN: 'LMSplashRouter.routeJumpHome()',  // 下键
                KEY_LEFT: 'LMSplashRouter.routeJumpHome()',  // 左键
                KEY_RIGHT: 'LMSplashRouter.routeJumpHome()', // 右键
                KEY_EXIT: 'LMSplashController.exitApp()'                                  // 退出按键
            }
        );
    },
};

/********************************************************
 *  路由
 *      -- 需要跳转时，建议到该模块搜索是否已经存在，避免重复定义
 *      -- 子地区模块如果需要修改某个函数，建议不要使用if/else,
 *          直接子地区模块修改
 * ******************************************************/
var LMSplashRouter = {

    /** 当前页面的路由信息 -- 提供返回路由 */
    splashIntent: function () {
        return LMEPG.Intent.createIntent("splash");
    },

    /** 首页路由信息 -- 跳转指定模块需要返回首页 */
    homeIntent: function () {
        return LMEPG.Intent.createIntent("home");
    },

    /** 登录路由信息 -- 跳转指定模块需要返回首页 */
    loginIntent: function () {
        return LMEPG.Intent.createIntent("login");
    },

    /** 返回局方大厅路由信息 */
    iptvPortalIntent: function () {
        return LMEPG.Intent.createIntent("IPTVPortal");
    },

    /** 路由提示系统升级页面 */
    routeSystemUpdate: function () {
        var systemUpdateIntent = LMEPG.Intent.createIntent("update");
        systemUpdateIntent.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(systemUpdateIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /** 路由首页 */
    routeHome: function () {
        //重庆电信直接进入首页的入口等待10秒，可通过按键直接进入
        if(RenderParam.carrierId == "500092" && (RenderParam.lmp == '9' || RenderParam.lmp == '1')){
            LMSplashController.registerSpecialKeys();
            timeOut = setTimeout(function () {LMEPG.Intent.jump(LMSplashRouter.homeIntent(), LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);},10000);
        } else{
            LMEPG.Intent.jump(LMSplashRouter.homeIntent(), LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
        }
    },

    /** 路由登录页面 */
    routeLogin: function () {
        LMEPG.Intent.jump(LMSplashRouter.loginIntent(), LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /** 按键路由首页 */
    routeJumpHome: function () {
        clearTimeout(timeOut);
        LMEPG.Intent.jump(LMSplashRouter.homeIntent(), LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * V7模式路由二级导航页面
     * @param tabIndex
     */
    routeMenuTabV7: function (tabIndex) {
        var menuTabIntent = LMEPG.Intent.createIntent("menuTab");
        menuTabIntent.setParam("pageIndex", tabIndex);
        LMEPG.Intent.jump(menuTabIntent, LMSplashRouter.splashIntent(), RenderParam.intentType, LMSplashRouter.homeIntent());
    },

    /**
     * 路由专辑
     * @param albumAliasName 专辑别名
     */
    routeAlbum: function (albumAliasName) {
        var albumIntent = LMEPG.Intent.createIntent("album");
        albumIntent.setParam("albumName", albumAliasName);
        albumIntent.setParam("inner", 0);
        LMEPG.Intent.jump(albumIntent, LMSplashRouter.splashIntent(), RenderParam.intentType, LMSplashRouter.homeIntent());
    },

    /**
     * 路由图文专辑
     * @param teletextCode 图文资源编码
     */
    routeTeletextAlbum: function (teletextCode) {
        var albumIntent = LMEPG.Intent.createIntent("album");
        albumIntent.setParam("albumName", "TemplateAlbum");
        albumIntent.setParam('graphicCode', teletextCode);
        albumIntent.setParam("inner", 0);
        LMEPG.Intent.jump(albumIntent, LMSplashRouter.splashIntent(), RenderParam.intentType, LMSplashRouter.homeIntent());
    },

    /**
     * 路由活动
     * @param activityAliasName 活动别名
     */
    routeActivity: function (activityAliasName) {
        var activityIntent = LMEPG.Intent.createIntent("activity");
        activityIntent.setParam("activityName", activityAliasName);
        activityIntent.setParam("inner", 0);
        LMEPG.Intent.jump(activityIntent, LMSplashRouter.splashIntent(), RenderParam.intentType, LMSplashRouter.homeIntent());
    },

    /**
     * 路由播放器
     * @param videoInfo 即将播放的视频信息
     */
    routePlayer: function (videoInfo) {
        var playerIntent = LMEPG.Intent.createIntent("player");
        playerIntent.setParam("inner", 0);
        playerIntent.setParam("videoInfo", videoInfo);
        // 联通陕西自定义链接返回大厅处理
        if (((RenderParam.carrierId == "10000051") || (RenderParam.carrierId == "10000006"))  && RenderParam.areaCode == "207") {
            var backEpg = LMEPG.Intent.createIntent("IPTVPortal");
            LMEPG.Intent.jump(playerIntent, backEpg, LMEPG.Intent.INTENT_FLAG_NOT_STACK, backEpg);
        } else {
            LMEPG.Intent.jump(playerIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
        }
    },

    /**
     * 路由视频简介模块
     * @param videoCode 视频编码
     */
    routeVideoIntro: function (videoCode) {
        var videoIntroIntent = LMEPG.Intent.createIntent("introVideo-detail");
        videoIntroIntent.setParam("unionCode", videoCode);
        LMEPG.Intent.jump(videoIntroIntent, LMSplashRouter.homeIntent());
    },

    /** 路由视频集 */
    routeVideoSet: function () {
        LMSplashRouter.routeHome(); // 默认跳转首页，目前只有中国联通、贵州广电、贵州电信跳转视频集
    },


    /** 路由视频集 */
    routeVideoSetV13: function (subjectId) {
        var videoSetIntent = LMEPG.Intent.createIntent("channelList");
        videoSetIntent.setParam("subject_id", subjectId);
        LMEPG.Intent.jump(videoSetIntent, LMSplashRouter.homeIntent());
    },

    /**
     * 路由医院模块
     * @param hospitalName 医院名称
     * @param hospitalId 医院ID
     */
    routeHospital: function (hospitalName, hospitalId) {
        var hospitalIntent = LMEPG.Intent.createIntent("hospital-index");
        hospitalIntent.setParam("hospitalName", hospitalName);
        hospitalIntent.setParam("hospitalId", hospitalId);
        hospitalIntent.setParam("inner", 0);
        LMEPG.Intent.jump(hospitalIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
    /**
     * 路由医院模块-带版本控制
     * @param outerParam  链接参数
     */
    routeHospitalVersion: function (outerParam) {
        var hospitalIntent = LMEPG.Intent.createIntent("hospital-index-version");
        hospitalIntent.setParam("hospitalName", outerParam.hospitalName ? outerParam.hospitalName : "");
        hospitalIntent.setParam("hospitalId", outerParam.hospitalId ? outerParam.hospitalId : "");
        hospitalIntent.setParam("version", outerParam.version);
        hospitalIntent.setParam("function", outerParam['function'].toString());
        hospitalIntent.setParam("inner", 0);
        LMEPG.Intent.jump(hospitalIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
    routeCustomizeModule: function (moduleId, modelId) {
        var customizeModuleIntent = LMEPG.Intent.createIntent("customizeModule");
        customizeModuleIntent.setParam("moduleId", moduleId);
        customizeModuleIntent.setParam("modelId", modelId);
        customizeModuleIntent.setParam("inner", 0);
        LMEPG.Intent.jump(customizeModuleIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /** 路由疫情模块 */
    routeEpidemic: function () {
        var epidemicIntent = LMEPG.Intent.createIntent('report-index');
        var areaModule = ['620007','450001','440004']; // 路由的地区编码
        if (areaModule.indexOf(RenderParam.carrierId) > -1) {
            epidemicIntent.setParam("isExitApp", 1); // 问诊返回局方大厅
        }

        LMEPG.Intent.jump(epidemicIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 核酸检测模块 */
    routeNucleicAcidTesting: function () {
        var nucleicAcidDetect = LMEPG.Intent.createIntent("nucleicAcidDetect");

        LMEPG.Intent.jump(nucleicAcidDetect, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 乐心血压计页面*/
    routerEquipmentInspection: function () {
        var leIntent = LMEPG.Intent.createIntent('sg-blood');
        leIntent.setParam('focusIndex', '');
        LMEPG.ajax.postAPI('NewHealthDevice/getDeviceList', {},function (data) {
            leIntent.setParam('remind',LMSplashRouter.translateText( data.data[0].reminder));
            data.data[0].reminder = '';
            leIntent.setParam('testDevice',JSON.stringify(data.data[0]));
            LMEPG.Intent.jump(leIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
        });
    },

    /** 跳转V13首页-发现模块*/
    routerJumpHomeTab: function (tabId) {
        var objCurrent = LMEPG.Intent.createIntent('home');
        objCurrent.setParam('focusId', 'tab1-link');
        objCurrent.setParam('tabId', tabId);
        LMEPG.Intent.jump(objCurrent);
    },

    translateText: function (text) {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, "\"")
    },


    /**
     * 路由视频栏目
     * @param columnTitle 栏目标题
     * @param columnType  栏目类型标识 -- 用于获取管理后台配置数据
     * @param defaultPage 分页标识 -- 默认获取第一页
     */
    routeVideoColumn: function (columnTitle, columnType, defaultPage) {
        defaultPage = typeof defaultPage == 'undefined' ? 1 : defaultPage;
        var columnIntent = LMEPG.Intent.createIntent("channel");
        columnIntent.setParam("modeTitle", columnTitle);
        columnIntent.setParam("modeType", columnType);
        columnIntent.setParam("page", defaultPage);
        LMEPG.Intent.jump(columnIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /**
     * 路由健康视频栏目
     * @param columnTitle 栏目标题
     * @param columnType  栏目类型标识 -- 用于获取管理后台配置数据
     * @param defaultPage 分页标识 -- 默认获取第一页
     */
    routeHealthVideo: function (columnTitle, columnType, defaultPage) {
        defaultPage = typeof defaultPage == 'undefined' ? 1 : defaultPage;
        var columnIntent = LMEPG.Intent.createIntent("healthVideoList");
        columnIntent.setParam("modeTitle", columnTitle);
        columnIntent.setParam("modeType", columnType);
        columnIntent.setParam("page", defaultPage);
        LMEPG.Intent.jump(columnIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /**
     * 跳转 - 社区医院
     * areaName: 哪个社区
     */
    routeCommunityHospital: function (areaName) {
        var obj = LMEPG.Intent.createIntent("community-index");
        obj.setParam("userId", RenderParam.userId);
        obj.setParam("areaName", areaName);
        obj.setParam("inner", 0);
        LMEPG.Intent.jump(obj, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 路由医生列表 */
    routeDoctorList: function () {
        var doctorListIntent = LMEPG.Intent.createIntent('doctorList');
        doctorListIntent.setParam("inner", 0); // 问诊返回局方大厅

        LMEPG.Intent.jump(doctorListIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 路由医生列表 */
    routeDoctorListV13: function () {
        var doctorListIntent = LMEPG.Intent.createIntent('doctorIndex');

        // 直接返回局方大厅
        var areaModuleV13 = ['440001','440004','620007', '10000051', '10000006']; // V13模式路由的地区编码
        if (areaModuleV13.indexOf(RenderParam.carrierId) > -1) {
            doctorListIntent.setParam("isExitApp", 1); // 问诊返回局方大厅
        }

        LMEPG.Intent.jump(doctorListIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 路由大专家医生列表 */
    routeExpertList: function () {
        var doctorListIntent = LMEPG.Intent.createIntent('expertIndex');
        doctorListIntent.setParam("inner", 0); // 问诊返回局方大厅

        LMEPG.Intent.jump(doctorListIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 路由健康检测模块 -- 输入设备IMEI号页面 */
    routeHealthDetection: function () {
        var detectionIntent = LMEPG.Intent.createIntent("healthTestIMEIInput");
        LMEPG.Intent.jump(detectionIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /**
     * 跳转 - 健康检测外部页面
     */
    routeHealthTestIndex: function () {
        var obj = LMEPG.Intent.createIntent('outIndex');
        LMEPG.Intent.jump(obj, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /**
     * 跳转 - 健康检测外部页面
     */
    routeHealthTestIndexV13: function () {
        var obj = LMEPG.Intent.createIntent('testIndex');
        LMEPG.Intent.jump(obj, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 路由我的家模块 */
    routeMyFamily: function () {
        var myFamilyIntent = LMEPG.Intent.createIntent("familyHome");
        LMEPG.Intent.jump(myFamilyIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /**
     * 路由导航栏页面
     * @param navId 导航栏路由标识
     * @param defaultFocusId 默认的焦点ID
     */
    routeNavPage: function (navId, defaultFocusId) {
        defaultFocusId = typeof defaultFocusId == 'undefined' ? "" : defaultFocusId;
        var navIntent = LMEPG.Intent.createIntent(navId);
        navIntent.setParam("focusIndex", defaultFocusId);
        LMEPG.Intent.jump(navIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 路由订购页面 */
    routerOrderPage: function () {
        var orderIntent = LMEPG.Intent.createIntent("orderHome");
        orderIntent.setParam("isPlaying", "0");
        orderIntent.setParam("remark", "推荐位订购");

        LMEPG.Intent.jump(orderIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 预约挂号页面*/
    routerGuaHaoPage: function () {
        var guaHaoIntent = LMEPG.Intent.createIntent("appointmentRegister");
        guaHaoIntent.setParam('focusIndex', '');
        var areaModuleV13 = ['440001','440004']; // V13模式路由的地区编码
        if (areaModuleV13.indexOf(RenderParam.carrierId) > -1) {
            guaHaoIntent.setParam("isExitApp", 1); // 问诊返回局方大厅
        }

        LMEPG.Intent.jump(guaHaoIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /** 预约挂号页面*/
    routerGuaHaoStaticPage: function () {
        var guaHaoIntent = LMEPG.Intent.createIntent("indexStatic");
        guaHaoIntent.setParam('focusIndex', '');
        // 直接返回局方大厅
        var areaModuleV13 = ['440001','440004']; // V13模式路由的地区编码
        if (areaModuleV13.indexOf(RenderParam.carrierId) > -1) {
            guaHaoIntent.setParam("isExitApp", 1); // 问诊返回局方大厅
        }

        LMEPG.Intent.jump(guaHaoIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    /**
     * 路由医生评价页面
     * @param inquiryData Android段回调JS端问诊数据
     */
    routeDoctorEvaluation: function (inquiryData) {
        var evaluationPageIntent = LMEPG.Intent.createIntent("doctorEvaluation");
        evaluationPageIntent.setParam("InquiryData", inquiryData);
        LMEPG.Intent.jump(evaluationPageIntent, LMSplashRouter.splashIntent(), LMEPG.Intent.INTENT_FLAG_DEFAULT, LMSplashRouter.homeIntent());
    },

    routeV13VideoSet: function(routeParams) {

    },

    /** 外部功能模块路由跳转 -- 1000 */
    routeAssignModule: function () {
        var outerParam = {};
        if (RenderParam.isRunOnAndroid === '1') {
            outerParam = typeof RenderParam.subId == 'string' ? JSON.parse(RenderParam.subId) : RenderParam.subId;
        } else {
            var base64 = new Base64();
            var decodeStr = base64.decode(RenderParam.subId);
            outerParam = JSON.parse(decodeStr);
        }

        if (typeof outerParam !== 'undefined') {
            switch (parseInt(outerParam.jump_type)) {
                case LMSplashConstant.ROUTE_AREA_MODULE_FLAG:
                    LMSplashRouter.routeAreaModule(outerParam.module_type, outerParam.module_param, outerParam.areaName);
                    break;
                case LMSplashConstant.ROUTE_EPIDEMIC_FLAG:
                    LMSplashRouter.routeEpidemic();
                    break;
                case LMSplashConstant.ROUTE_HOSPITAL_FLAG:
                    var hospitalName = outerParam.hospitalName;
                    var hospitalId = outerParam.hospitalId ? outerParam.hospitalId : "";
                    var version = outerParam.version ? outerParam.version : "";
                    if (version === "") {
                        LMSplashRouter.routeHospital(hospitalName, hospitalId);
                    } else {
                        LMSplashRouter.routeHospitalVersion(outerParam);
                    }
                    break;
                case LMSplashConstant.ROUTE_CUSTOMIZE_FLAG:
                    var moduleId = outerParam.moduleId;
                    var modelId = outerParam.modelId || '';
                    LMSplashRouter.routeCustomizeModule(moduleId,modelId);
                    break;
                default:
                    LMEPG.Log.error('不支持的页面跳转类型' + outerParam.module_type);
                    LMEPG.UI.showToast('暂时不支持跳转类型：' + RenderParam.userfromType);
                    LMSplashRouter.routeHome(); // 路由到首页
                    break;
            }
        }
    },

    /**
     * 外部功能模块跳转时，jump_type为1时，根据解析的跳转参数路由不同模块
     *  -- 默认不作处理，交由子地区模块实现
     * @param routeFlag 路由标识 -- 交由子地区模块定义
     * @param routeParams 路由参数
     * @param areaName 地区名
     */
    routeAreaModule: function (routeFlag, routeParams, areaName) {
        var areaModuleV7 = ['540001', '620007', '630001']; // V7模式路由的地区编码
        var areaModuleV13 = ['430002', '220001', '320013', '440001', '01230001', '000709', '440004', '10000051', '371002',
            '640001','450001','10000006']; // V13模式路由的地区编码
        if (areaModuleV13.indexOf(RenderParam.carrierId) > -1) {
            LMSplashRouter.routeV13Module(routeFlag, routeParams, areaName);
        } else if (areaModuleV7.indexOf(RenderParam.carrierId) > -1) {
            LMSplashRouter.routeV7Module(routeFlag, routeParams, areaName);
        } else if (RenderParam.carrierId === '370002') { // 山东电信

        }
    },

    /**
     * apk合并时，甘肃移动、青海移动、西藏移动所用页面的子模块路由跳转
     *  -- 默认不作处理，交由子地区模块实现
     * @param routeFlag 路由标识 -- 交由子地区模块定义
     * @param routeParams 路由参数
     * @param areaName 地区名
     */
    routeV7Module: function (routeFlag, routeParams, areaName) {
        switch (routeFlag) {
            case 100: //首页推荐
                LMSplashRouter.routeHome();
                break;
            case 101: // 首页导航-老年健康
                LMSplashRouter.routeMenuTabV7(1); // 1 -- 老年健康的二级路由导航下标
                break;
            case 102: // 所有专辑入口（通过module_param区分不同专辑）
                LMSplashRouter.routeAlbum(routeParams);
                break;
            case 113: // vip问诊
                LMSplashRouter.routeDoctorListV13();
                break;
            case 114: // 一键问诊功能
                var backPageIntent = LMSplashRouter.homeIntent();
                LMEPG.Inquiry.p2p.inquiryAdvisoryDoctor(function () {
                    LMEPG.UI.showToast('当前医生不在线');
                }, {
                    inquiryType: LMEPG.Inquiry.p2p.InquiryType.video, // 电视视频问诊方式
                    isUseInquiryPlugin: '0',                          // 是否需要使用插件进行问诊
                    dialogConfig: {                                   // 无摄像头是输入电话号码小键盘的相关配置
                        showKeyBoardType: '1',
                        keyBoardLeft: 695,
                        keyBoardTop: 330,
                        onDialogHideListener: function () {            // 对话框消失监听器
                            LMSplashRouter.routeHome();
                        }
                    },
                    inquiryEndCallback: function (jsonFromAndroid) {  // 问诊结束之后的处理逻辑
                        LMEPG.Log.info("inquiryAdvisoryDoctor-->end");
                        LMSplashRouter.routeDoctorEvaluation(jsonFromAndroid)
                    },
                    focusIdOnDialogHide: btnId,                       // 无摄像头是输入电话号码弹窗消失之后页面的回复焦点
                    backPageIntent: backPageIntent,                   // 页面返回
                });
                break;
            case 118: // 局方推荐位配置跳转单视频，eg：{"lmuf":1000,"lmsid":{"jump_type":1,"module_type":118,"module_param":"gylm180"}}
            case 121: // 兼容甘肃移动apk
                var postData1 = {"union_code": routeParams};
                LMEPG.ajax.postAPI('Video/getVideoListByUnionCode', postData1, function (data) {
                    LMEPG.Log.info('[lmSplash.js]--[routeAreaModule]----> response:' + data);
                    LMSplashRouter.routePlayer(LMSplashController.assembleVideoInfo(JSON.parse(data).data, 0));
                });
                break;
            case 119: // 局方推荐位配置跳转单视频
                var paramObj = JSON.parse(routeParams);
                var postData2 = {"union_code": paramObj.union_code};
                LMEPG.ajax.postAPI('Video/getVideoListByUnionCode', postData2, function (data) {
                    LMEPG.Log.info('[lmSplash.js]--[routeAreaModule]----> response:' + data);
                    LMSplashRouter.routePlayer(LMSplashController.assembleVideoInfo(JSON.parse(data).data, paramObj.offset_time));
                });
                break;
        }
    },

    /**
     * 蓝色版本外部路由跳转方式
     *  -- 默认不作处理，交由子地区模块实现
     * @param routeFlag 路由标识 -- 交由子地区模块定义
     * @param routeParams 路由参数
     * @param areaName 地区名
     */
    routeV13Module: function (routeFlag, routeParams, areaName) {
        switch (routeFlag) {
            case 100: // 在线问医
                LMSplashRouter.routeDoctorListV13();
                break;
            case 101: // 预约挂号
                if (RenderParam.carrierId=='440001') {
                    LMSplashRouter.routerGuaHaoPage();
                }else {
                    LMSplashRouter.routerGuaHaoStaticPage();
                }
                break;
            case 102: //单视频
                // 局方推荐位配置跳转单视频
                var postData = {"union_code": routeParams};
                LMEPG.ajax.postAPI('Video/getVideoListByUnionCode', postData, function (data) {
                    LMEPG.Log.info('[kmSplash.js]--[routeAreaModule]----> response:' + data);
                    LMSplashRouter.routePlayer(LMSplashController.assembleVideoInfo(JSON.parse(data).data, 0));
                });
                break;
            case 103: //视频集
                LMSplashRouter.routeVideoSetV13(routeParams);
                break;
            case 104: // 健康检测
                LMSplashRouter.routeHealthTestIndexV13();
                break;
            case 105: // 大专家约诊
                LMSplashRouter.routeExpertList();
                break;
            case 106: // 设备检测
                LMSplashRouter.routerEquipmentInspection();
                break;
            case 107: // 核酸检测模块
                LMSplashRouter.routeNucleicAcidTesting();
                break;
            case 111:
                LMSplashRouter.routeV13VideoSet(routeParams);
                break;
        }
    },

}