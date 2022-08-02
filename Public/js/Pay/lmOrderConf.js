var carrierId = get_carrier_id();
//var carrierId=RenderParam.carrierId || RenderParam.lmcid;
// 定义对象LMOrderConf
var LmOrderConf = {
    /**
     * 配置促订的地区数组，如果某个地区需要添加功能，需要在数组内部添加值
     * 针对首页，由于同一套页面样式会被多个不同的地区使用，所以在模块内部，需要针对地区再过滤一次
     * 针对具体功能模块，例如专辑，直接调用，具体的地区过滤操作防止模块内部
     */
    orderConfArea: ['000051', '450092', '650091', '10000051'],
    /**
     * 管理后台配置信息
     */
    orderConfList: [],

    /**
     * 当前促订配置，目前取配置列表的第一项
     */
    orderConf: null,

    /**
     * 页面停留检测定时器
     */
    idleTimer: null,

    /**
     * 页面停留时长
     */
    idleTime: -1,

    /** 测试账号管理列表 */
    testAccounts: 'cutv201711272160171',

    /** 跳转视频播放器促顶模板标识 */
    routePlayerFlag: 'InspireOrderTemplate20210207',

    /**
     * 获取当前页面参数方法
     */
    getCurrentPage: function () {

    },
    /**
     * 对象初始化
     */
    init: function (initParams) {
        if (!initParams.getCurrentPage) {
            LmOrderConf.log("LMOrderConf init getCurrentPage empty!")
        } else if (LmOrderConf.orderConfArea.indexOf(carrierId) == -1) {
            LmOrderConf.log("LMOrderConf init not in orderConfArea!")
        } else if (RenderParam.isVip == 1) {
            LmOrderConf.log("LMOrderConf init isVip true!")
        } else if ( LmOrderConf.isTestAccountId()) {
            LmOrderConf.log("LMOrderConf init test UserAccount true!")
        } else {
            // 设置跳转方法
            LmOrderConf.getCurrentPage = initParams.getCurrentPage;
            // 获取管理后台配置订购相关模板信息
            LmOrderConf.getOrderConf();
        }
    },

    /**
     * 中国联通需要屏蔽测试账号
     */
    isTestAccountId: function(){
        // 测试时某些账号不需要屏蔽
        if(typeof RenderParam.accountId != 'undefined' && RenderParam.accountId == LmOrderConf.testAccounts){
            return false;
        }

        // 是否需要检测的地区
        var isCheckArea = carrierId == "000051" || carrierId == "10000051";
        // 是否测试账号类型
        var isTestAccountType = typeof RenderParam.accountId != 'undefined' && RenderParam.accountId.indexOf("cutv") > -1;

        return isCheckArea && isTestAccountType;
    },

    /**
     * 获取订购控制相关信息
     */
    getOrderConf: function () {
        LMEPG.ajax.postAPI("Common/getOrderConf", {}, function (data) {
            LmOrderConf.checkOrderParams(data);
        }, function () {
            // 日志记录
            if (LMEPG.Log) LMEPG.Log.error("getOrderCtrlInfo error");
        })
    },
    /**
     * 启动页面停留时长检测
     */
    startIdleCheck: function () {
        // 设置按键拦截事件
        //LMEPG.BM.setKeyEventInterceptCallback(LMOrderConf.onKeyEventIntercept);
        // 设置页面停留时长
        LmOrderConf.idleTime = parseInt(LmOrderConf.orderConf.idle_time);
        // 管理后台有配置项，才启动定时器
        LmOrderConf.checkIdleTime();
    },

    /**
     * 焦点活动触发拦截事件
     */
    onKeyEventIntercept: function () {
        // 重新赋值空闲时间检测定时器
        LmOrderConf.idleTime = parseInt(LmOrderConf.orderConf.idle_time);
    },
    /**
     * 定时器轮询当前页面停留时长是否达到
     */
    checkIdleTime: function () {
        // 定时器延时1秒执行，所以值提前减1
        LmOrderConf.idleTime -= 1;
        LmOrderConf.idleTimer = setInterval(function () {
            if (LmOrderConf.idleTime <= 0) {
                // 清除定时器
                clearInterval(LmOrderConf.idleTimer);
                // 获取模板标识 -- 根据不同的模板标识对应不同的逻辑操作，InspireOrderTemplate20210207 （跳转视频播放），其他跳转局方订购页面
                var templateAliasName = LmOrderConf.orderConf.template_info.alias_name;
                if (templateAliasName == LmOrderConf.routePlayerFlag){
                    // 跳转视频播放器
                    LmOrderConf.routerPlayer();
                    // LmOrderConf.showFakeOrderPage();
                }else {
                    // 跳转订购页面
                    LmOrderConf.gotoOrderHome();
                }
            } else {
                LmOrderConf.idleTime -= 1;
            }
        }, 1000);
    },

    /** 显示订购页图片 */
    showFakeOrderPage:function(){
        var homeIntent = LmOrderConf.getCurrentPage();
        var fakeOrderIntent = LMEPG.Intent.createIntent('orderFake');
        var routeUrl = LMEPG.Intent.getJumpUrl(fakeOrderIntent, homeIntent);
        if(G('fakeOrder')){
            G('fakeOrder').src = routeUrl;
            setTimeout(function () {
                Hide('fakeOrder');
            }, 10 * 1000);
        }
    },

    /**
     * 定时器：跳转促订页面
     */
    checkOrderHome: function () {
        //定时器等待2秒后跳转到促订页
        setTimeout(function () {
            clearInterval(LmOrderConf.idleTimer);
            LmOrderConf.gotoOrderHome();
        }, 2000);
    },
    /**
     * 跳转 -- 订购页面
     */
    gotoOrderHome: function () {
        LMEPG.ajax.postAPI("Common/addShowOrderTimes", {}, function () {
            var objCurrent = LmOrderConf.getCurrentPage();
            var objOrder = LMEPG.Intent.createIntent('orderHome');
            objOrder.setParam("remark", "促订订购");
            LMEPG.Intent.jump(objOrder, objCurrent);
        }, function () {
            LmOrderConf.log("gotoOrderHome addShowOrderTimes error!");
        });
    },

    /**
     * 跳转到视频播放页，播放结束时返回到首页
     * @param data 视频信息
     */
    routerPlayer: function () {
        //var carrierId = /*RenderParam.carrierId || RenderParam.lmcid;*/get_carrier_id();
        LMEPG.ajax.postAPI("Common/addShowOrderTimes", {}, function () {
           // 获取随机播放视频，跳转播放器播放
            LmOrderConf.routerPlayerWithRandomVideo();
        }, function (errorData) {
            LmOrderConf.log("跳转播放视频，添加已订购次数出错 -- " + JSON.stringify(errorData));
        });
    },

    /** 跳转播放器，通过接口获取随机播放的视频内容 */
    routerPlayerWithRandomVideo: function () {
        var requestData = {
            // 'userId': RenderParam.userId, -- 不传递UserId，接口从Session处获取，避免不同地区的兼容性
            "videoUserType": 2 // (0--不限，1--普通用户，2--vip，3--付费
        }
        LMEPG.ajax.postAPI("Player/getRecommendVideoInfo", requestData, function (responseData) {
            // 请求成功
            try {

                var recommendData = responseData instanceof Object ? responseData : JSON.parse(responseData);
                LmOrderConf.log("recommendData---->:" + recommendData);
                if (LMEPG.Func.isObject(recommendData)) {
                    if (!LMEPG.Func.isArray(recommendData.data) || recommendData.data.length <= 0) {
                        return;
                    }
                    var videoInfoList = recommendData.data;
                    var videoInfo = videoInfoList[0];
                    var HDVideoUrl = eval('(' + videoInfo.ftp_url + ')').gq_ftp_url;
                    var SDVideoUrl = eval('(' + videoInfo.ftp_url + ')').bq_ftp_url;
                    var playerParams = {
                        'videoUrl': RenderParam.platformType == 'hd' ? HDVideoUrl : SDVideoUrl,
                        'sourceId': videoInfo.source_id,
                        'title': videoInfo.title,
                        'type': '',
                        'userType': '2',
                        'freeSeconds': '15',
                        'entryType': 9,
                        'entryTypeName': 'order',
                        'unionCode': videoInfo.union_code,
                        'show_status': videoInfo.show_status,
                        'duration': videoInfo.duration,
                    }
                    var playerIntent = LMEPG.Intent.createIntent('player');
                    // routerFlag标识从哪里路由到播放器，此前未定义，1标识从促订模块体哦啊转
                    playerIntent.setParam('routeFlag','1');
                    playerIntent.setParam("videoInfo", JSON.stringify(playerParams));
                    LMEPG.Intent.jump(playerIntent, LmOrderConf.getCurrentPage());
                }
            } catch (exception) {
                LmOrderConf.log('推荐视频数据处理异常：' + exception.toString());
            }
        }, function (errorData) {
            LmOrderConf.log("获取随机播放视频出错 -- " + JSON.stringify(errorData));
        })
    },

    /**
     * 检测订购页面跳转参数
     */
    checkOrderParams: function (orderParams) {

        // 检测当前弹窗次数是否满足
        if (orderParams.showOrderTimes >= 1) {
            LmOrderConf.log("checkOrderParams showOrderTimes true!");
            return;
        }
        // 检测是否已经上报用户信息
        /*if (orderParams.isReportUserInfo == 0) {
            LmOrderConf.log("checkOrderParams isReportUserInfo false!");
            return;
        }*/
        var orderConfig = orderParams.orderConf;
        // 检测后台返回数据
        if (orderConfig.result != 0) {
            LmOrderConf.log("checkOrderParams payMethod error!");
            return;
        }
        // 检测是否配置模板
        LmOrderConf.orderConfList = orderConfig.data.list;
        if (LmOrderConf.orderConfList.length == 0) {
            LmOrderConf.log("checkOrderParams orderConfList empty!");
            return;
        }
        // 检测转化率是否到达
        LmOrderConf.orderConf = (LmOrderConf.orderConfList)[0];
        /* if (LmOrderConf.orderConf.reach_rate == 0) {
            LmOrderConf.log("checkOrderParams reach_rate false!");
            return;
        }*/
        var idleTime = parseInt(LmOrderConf.orderConf.idle_time);
        var stayAppTime = orderParams.showTimeStamp - orderParams.enterAppTime;
        if (stayAppTime >= idleTime) {
            //LmOrderConf.gotoOrderHome();
            LmOrderConf.checkIdleTime();
        } else {
            LmOrderConf.idleTime = idleTime - stayAppTime;
            LmOrderConf.checkIdleTime();
        }
    },
    log: function (message) {
        if (LMEPG.Log) LMEPG.Log.error("getOrderCtrlInfo result >>> " + message);
    }
};