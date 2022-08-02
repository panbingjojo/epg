// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | Splash <-> Android 交互通信接口定义
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/11/6 9:26
// +----------------------------------------------------------------------

// Android端返回键
function keyDownInvoke(keyCode) {
    if (keyCode == 4) {
        LMEPG.Framework.onEvent(KEY_BACK_ANDROID);
    }
}

/**
 * 用户android webview判断是否有返回按键方法
 */
function isWebDealWithKeyBack() {
    console.info('isWebDealWithKeyBack:' + typeof (onBack));
    if (typeof (onBack) === 'function') {
        android.invoke('hasOnBackFunction', '1', "");
    } else {
        android.invoke('hasOnBackFunction', '-1', "");
    }
}

/**
 * 对Android的ShowWaitingDialog超时并自动关闭后，通知监听：↓
 * 1. 恢复web端的按键响应：LMEPG.KeyEventManager.setAllowFlag
 * 2. 移除 LMEPG.UI.showWaitingDialog 时设置的超时器等资源
 * @param msgFromAndroid
 * @param notifyAndroidCallback
 */
function androidShowWaitingDialogTimeout(msgFromAndroid, notifyAndroidCallback) {
    if (LMEPG.UI) LMEPG.UI.dismissWaitingDialog();
}

// 调试开头，如果是在本机浏览器调试，关闭为false，则不与Android交互。上线记得打开！！！
if (typeof isRunOnPC === 'undefined') {
    window.isRunOnPC = !(typeof android === "object");
}

(function (w) {

    var _callbackUIMap = [];
    // JS <---> Android 相互调用内部的接口及传参封装。
    w.LMAndroid = {
        // 声明回调
        onGetDeviceNameCallbackUI: null,                // 回调：获取设备信息
        onGetDeviceInfoCallbackUI: null,                // 回调：获取设备信息
        onGetNewGuidanceInfoCallbackUI: null,          // 回调：获取新手指导使用记录
        onP2PInquiryCallbackUI: null,                   // 回调：1-1视频问诊结束
        onPayCallbackUI: null,                          // 回调：获取新手指导使用记录
        onTVPayCallbackUI: null,                         // 回调：中兴支付回调
        onUserTypeAuthUI:null,                           // 回调：用户鉴权
        onHttpPost: null,                                // 回调：http post请求
        onAESBack: null,                                 // 回调：AES加密回调
        onWebViewGetFocsCallback: null,                //获取焦点回调
        //大窗播放回调
        onFullPlayerStartCallbackUI: null,
        onFullPlayerPauseCallback: null,
        onFullPlayerResumeCallback: null,
        onFullPlayerCompleteCallback: null,
        onFullPlayerPositionChangeCallback: null,      //播放进度改变
        //小窗播放回调
        onSmallPlayerCompleteCallback: null,

        //http请求错误码
        HTTP_RESULT_CODE_FAIL: "-1",                     //请求失败
        HTTP_RESULT_CODE_EXECPTION: "-2",               //请求异常
        HTTP_RESULT_CODE_URL_EMPTY: "-3",               //请求地址为空
        // 健康检测结果页跳转
        doLoadMeasureResultUI: null,
        // 查询订单状态
        doQueryOrderStateUI: null,
        isRunOnPc: function () {
            return typeof android !== 'object';
        },

        /**
         * JS -> Android
         * @param androidFuncName       JS回调Android端的方法名，string类型。例如：'pleaseAndroidDoIt'
         * @param param                 JS回调Android端的方法传参，string类型。例如：'{"name":"张三","age":26}'
         * @param notifyJSCallback      Android处理完毕后回调JS的函数名字符串，string类型。例如：'androidAlreadyReceived'
         */
        jsCallAndroid: function (androidFuncName, param, notifyJSCallback) {
            if (typeof androidFuncName !== 'string' || androidFuncName == null || androidFuncName === "") return;
            if (typeof param === 'object' && param != null) param = JSON.stringify(param);
            if (typeof param !== 'string' || param == null || param === '') param = '';
            if (typeof notifyJSCallback !== 'string' || notifyJSCallback == null || notifyJSCallback === '') notifyJSCallback = '';
            if (!LMAndroid.isRunOnPc()) {
                android.invoke(androidFuncName, param, notifyJSCallback);
            }
        },


        /**
         * Android -> JS
         * @param jsFuncName                Android回调JS端的函数名，function类型。例如：function pleaseJSDoIt(param, callback){...}
         * @param param                     Android回调JS端的函数传参，string类型。例如：'{"name":"张三","age":26}'
         * @param notifyAndroidCallback     JS收到后回调Android的方法名字符串，string类型。例如：'jsAlreadyReceived'
         */
        androidCallJS: function (jsFuncName, param, notifyAndroidCallback) {
            // if(LMEPG.Log) LMEPG.Log.debug("android,js androidCallJS start >>> " + param);
            if (typeof jsFuncName !== 'function' || jsFuncName == null || jsFuncName === "") return;
            if (typeof param !== 'string' || param == null || param === '') param = '';
            if (typeof notifyAndroidCallback !== 'string' || notifyAndroidCallback == null || notifyAndroidCallback === '') notifyAndroidCallback = '';
            var base = new Base64();
            var finalParam = base.decode(param);
            // if(LMEPG.Log) LMEPG.Log.debug("android,js androidCallJS end >>> funcName," + jsFuncName + ", finalParam," + finalParam);
            LMEPG.call(jsFuncName, [finalParam, notifyAndroidCallback]);
        },

        /**
         * 注册播放器回调事件
         * @param notifyFullPlayerStartCallbackUI        播放开始回调
         * @param notifyFullPlayerPauseCallback          播放暂停回调
         * @param notifyFullPlayerResumeCallback         继续播放回调
         * @param notifyFullPlayerCompleteCallback       播放完成回调
         */
        registPlayUICallback: function (onFullPlayerStartCallbackUI, onFullPlayerPauseCallback, onFullPlayerResumeCallback, onFullPlayerCompleteCallback, onFullPlayerSeekCallback) {
            LMAndroid.onFullPlayerStartCallbackUI = onFullPlayerStartCallbackUI;
            LMAndroid.onFullPlayerPauseCallback = onFullPlayerPauseCallback;
            LMAndroid.onFullPlayerResumeCallback = onFullPlayerResumeCallback;
            LMAndroid.onFullPlayerCompleteCallback = onFullPlayerCompleteCallback;
            LMAndroid.onFullPlayerSeekCallback = onFullPlayerSeekCallback;
        },

        /**
         * 注册小窗播放器回调事件
         * @param onSmallPlayerCompleteCallback       播放完成回调
         */
        registSmallPlayUICallback: function (onSmallPlayerCompleteCallback) {
            LMAndroid.onSmallPlayerCompleteCallback = onSmallPlayerCompleteCallback;
        },


        /**
         * 开始小窗播放
         * @param videoInfo
         */
        startSmallPlay: function (videoInfo) {
            if (!isRunOnPC) {
                try {
                    LMAndroid.jsCallAndroid('playSmallVideo', JSON.stringify(videoInfo), '');
                } catch (e) {
                    LMAndroid.jsCallAndroid('doShowToast', e.toString(), '');
                }
            }
        },
        /**
         * 点击小窗播放
         */
        clickSmallVideo: function (encodeParam) {
            if (!isRunOnPC) {
                try {
                    LMAndroid.jsCallAndroid('clickSmallVideo', encodeParam, '');
                } catch (e) {
                    LMAndroid.jsCallAndroid('doShowToast', e.toString(), '');
                }
            }
        },

        /**
         * 隐藏并关闭小窗口播放器
         */
        hideSmallVideo: function () {
            LMAndroid.jsCallAndroid('hideSmallVideo', '', '');
        },

        // 具体业务：JS调用Android接口（JS -> Android）
        JSCallAndroid: {
            /***************************************界面相关*****************************************************/
            // 显示菊花进度对话框
            doShowWaitingDialog: function (showMessage) {
                LMAndroid.jsCallAndroid('doShowWaitingDialog', typeof showMessage === 'string' ? showMessage : '', '');
            },

            // 关闭菊花进度对话框
            doDismissWaitingDialog: function () {
                LMAndroid.jsCallAndroid('doDismissWaitingDialog', '', '');
            },

            // 弹出toast
            doShowToast: function (showMessage) {
                LMAndroid.jsCallAndroid('doShowToast', typeof showMessage === 'string' ? showMessage : '', '');
            },

            //web容器获取焦点
            doWebViewGetFocus: function (notifyJSCallback) {
                LMAndroid.onWebViewGetFocsCallback = notifyJSCallback;
                LMAndroid.jsCallAndroid('doWebViewGetFocus', '', 'LMAndroid.AndroidCallJS.onWebViewGetFocsCallback');
            },

            /***************************************设备信息相关*****************************************************/
            // 获取Android设备信息
            doGetDeviceName: function (notifyJSCallback) {
                LMAndroid.onGetDeviceNameCallbackUI = notifyJSCallback;
                LMAndroid.jsCallAndroid('doGetDeviceName', '', 'LMAndroid.AndroidCallJS.onGetDeviceNameCallback');
            },

            // 获取Android设备的全局信息
            doGetDeviceInfo: function (notifyJSCallback) {
                LMAndroid.onGetDeviceInfoCallbackUI = notifyJSCallback;
                LMAndroid.jsCallAndroid('doGetDeviceInfo', '', 'LMAndroid.AndroidCallJS.onGetDeviceInfoCallback');
            },

            // 通知Android端保存用户登录信息
            doSaveUserInfo: function (param) {
                LMAndroid.jsCallAndroid('doSaveUserInfo', param, '');
            },
            //通知Android端更新用户登录信息
            doUpdateUserInfo: function (param) {
                LMAndroid.jsCallAndroid('doUpdateUserInfo', param, '');
            },

            // 缓存新手指导蒙层使用过的记录
            doSaveNewGuidanceInfo: function (param) {
                LMAndroid.jsCallAndroid('doSaveNewGuidanceInfo', param, '');
            },

            // 获取新手指导蒙层使用过的记录
            // NOTICE: 从Android端取缓存新手指导session格式必须遵循：{"data": ["key1","key2","key3", ...]}
            // Android端处理完毕后以提供相同节点名结构的json串：{"data":{"key1":"value1","key2":"value2","key3":"value3", ...}}
            // Author：Songhui 2018-11-9 16:28:51
            //
            // [参数param格式]：{ "data": ["classify_tab_0","classify_tab_1"] }
            // [含义]：获取指定导航栏目1，2页面的新手指导记录
            doGetNewGuidanceInfo: function (param, notifyJSCallback) {
                LMAndroid.onGetNewGuidanceInfoCallbackUI = notifyJSCallback;
                LMAndroid.jsCallAndroid('doGetNewGuidanceInfo', param, 'LMAndroid.AndroidCallJS.onGetNewGuidanceCallback');
            },

            // http post
            doHttpPost: function (param, notifyJSCallback) {
                LMAndroid.onHttpPost = notifyJSCallback;
                LMAndroid.jsCallAndroid('doHttpPost', param, 'LMAndroid.AndroidCallJS.onHttpPostCallback');
            },

            // http get
            doHttpGet: function (param, notifyJSCallback) {
                LMAndroid.onHttpPost = notifyJSCallback;
                LMAndroid.jsCallAndroid('doHttpGet', param, 'LMAndroid.AndroidCallJS.onHttpPostCallback');
            },

            // AES加密
            doAES: function (param, notifyJSCallback) {
                LMAndroid.onAESBack = notifyJSCallback;
                LMAndroid.jsCallAndroid('doAES', param, 'LMAndroid.AndroidCallJS.onAESCallback');
            },

            /***************************************退出APP应用*****************************************************/
            doExitApp: function (param) {
                LMAndroid.jsCallAndroid('doExitApp', param, '');
            },
            // 检查设备是否有可用摄像头
            doCheckHasCamera: function (param, notifyJSCallback) {
                _callbackUIMap['onCheckHasCameraNameCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doCheckHasCamera', param, 'LMAndroid.AndroidCallJS.onCheckHasCameraNameCallback');
            },

            /***************************************问诊相关*****************************************************/
            // 1-1视频问诊
            doP2PInquiry: function (param, notifyJSCallback) {
                LMAndroid.onP2PInquiryCallbackUI = notifyJSCallback;
                LMAndroid.jsCallAndroid('doP2PInquiry', param, 'LMAndroid.AndroidCallJS.onP2PInquiryCallback');
            },

            // 大专家问诊（候诊室）视频问诊
            doExpertWaitingRoom: function (param) {
                LMAndroid.jsCallAndroid('doExpertWaitingRoom', param, '');
            },

            /***************************************订购相关*****************************************************/
            // 订购
            doPay: function (param, notifyJSCallback) {
                LMAndroid.onPayCallbackUI = notifyJSCallback;
                LMAndroid.jsCallAndroid('doPay', param, 'LMAndroid.AndroidCallJS.onPayCallback');
            },

            /***************************************播控数据日志上报*****************************************************/
            // 播控数据日志上报
            traceLogPlayer: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('traceLogPlayer', param, '');
            },

            // 到局方鉴权
            doUserTypeAuth: function (param, notifyJSCallback) {
                LMAndroid.onUserTypeAuthUI = notifyJSCallback;
                LMAndroid.jsCallAndroid('doUserTypeAuth', param, 'LMAndroid.AndroidCallJS.onUserTypeAuth');
            },

            // 跳转设备商城
            doJumpGoodsThirdParty: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doJumpGoodsThirdParty', param, '');
            },

            // 中兴支付订购
            doTVPay: function (param, notifyJSCallback) {
                LMAndroid.onTVPayCallbackUI = notifyJSCallback;
                LMAndroid.jsCallAndroid('doTVPay', param, 'LMAndroid.AndroidCallJS.onTVPayCallback');
            },
            /***************************************播放器相关*****************************************************/
            //开始播放
            doPlayVideo: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doPlayVideo', param, '');
            },

            //停止播放
            doStopVideo: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doStopVideo', param, '');
            },

            //隐藏播放器
            doHideVideo: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doHideVideo', param, '');
                setTimeout(function () {
                    LMAndroid.JSCallAndroid.doWebViewGetFocus(function (param, notifyAndroidCallback) {
                        console.log("doHideVideo after doWebViewGetFocus,result:" + param);
                    })
                }, 500);
            },

            /**
             * js处理了positionchange，回调给android
             * @param param
             * @param notifyJSCallback
             */
            doOnSeekVideo: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doOnSeekVideo', param, '');
            },

            /**
             * 广西广电鉴权接口
             */
            doAuthAndGetMedia: function (param, notifyJSCallback) {
                _callbackUIMap['doAuthAndGetMedia'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doAuthAndGetMedia', param, 'LMAndroid.AndroidCallJS.onAuthAndGetMediaCallback');
            },
            /**
             * 广东移动鉴权接口
             */
            doAuthAndIsVip: function (param, notifyJSCallback) {
                _callbackUIMap['doAuthAndIsVip'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doAuthAndIsVip', param, 'LMAndroid.AndroidCallJS.onAuthAndIsVipCallback');
            },

            /**
             * 中国联通鉴权接口
             */
            doAuth: function (param, notifyJSCallback) {
                _callbackUIMap['doAuth'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doAuth', param, 'LMAndroid.AndroidCallJS.onAuthCallback');
            },

            /**
             * 山东电信海看上报数据接口 -- 页面路由跳转
             */
            doSendData: function (param, notifyJSCallback) {
                _callbackUIMap['doSendData'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doSendData', param, 'LMAndroid.AndroidCallJS.onSendDataCallback');
            },
            /**
             * 山东电信海看上报数据接口 -- 收藏数据上报
             */
            doSendCollectData: function (param, notifyJSCallback) {
                _callbackUIMap['doSendCollectData'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doSendCollectData', param, 'LMAndroid.AndroidCallJS.onSendCollectDataCallback');
            },
            /**
             * 山东电信海看上报数据接口 -- 订购数据上报
             */
            doSendOrdertData: function (param, notifyJSCallback) {
                _callbackUIMap['doSendCollectData'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doSendCollectData', param, 'LMAndroid.AndroidCallJS.onSendOrderDataCallback');
            },

            // 订购
            quitPay: function (param, notifyJSCallback) {
                _callbackUIMap['quitPay'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('quitPay', param, 'LMAndroid.AndroidCallJS.onQuitPayCallback');
            },

            /* 主要用于获取各地区系统内置属性值：如广东广电
            * @param param
            * @param notifyJSCallback
            */
            doGetSystemProperties: function (param, notifyJSCallback) {
                _callbackUIMap['onGetSystemPropertiesCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doGetSystemProperties', param, 'LMAndroid.AndroidCallJS.onGetSystemPropertiesCallback');
            },
            /**
             * 页面加载完毕以后，设备背景颜色为黑色。
             */
            doUpdateDefaultBackground: function (notifyJSCallback) {
                _callbackUIMap['onUpdateDefaultBackgroundCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doUpdateDefaultBackground', '', '');
            },

            /**  自更新接口实现  **/
            doDownloadApk: function (param, notifyJSCallback) {
                _callbackUIMap['onDownloadApkCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doDownloadApk', param, 'LMAndroid.AndroidCallJS.onDownloadApkCallback');
            },

            doInstallApk: function (param, notifyJSCallback) {
                LMEPG.Log.info('执行js--doInstallApk方法成功');
                _callbackUIMap['onInstallApkCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doInstallApk', param, 'LMAndroid.AndroidCallJS.onInstallApkCallback');
            },

            getVideoRealUrl: function (param, notifyJSCallback) {
                LMEPG.Log.info('执行js--getVideoRealUrl方法成功');
                _callbackUIMap['onGetVideoRealUrlCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('getVideoRealUrl', param, 'LMAndroid.AndroidCallJS.onGetVideoRealUrlCallback');
            },

            getSetTopBoxInfo: function (param, notifyJSCallback) {
                LMEPG.Log.info('执行js--onGetSetTopBoxInfoCallback方法成功');
                _callbackUIMap['onGetSetTopBoxInfoCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('getSetTopBoxInfo', param, 'LMAndroid.AndroidCallJS.onGetSetTopBoxInfoCallback');
            },

            //apk2.0版本的自动更新，目前只存在必须升级，否则不做处理
            doUpdateAndInstallApk: function (param, notifyJSCallback) {
                _callbackUIMap['doUpdateAndInstallApk'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doUpdateAndInstallApk', param, '');
            },

            // 初始化易视腾SDK
            doInitYstenSdk: function (param, notifyJSCallback) {
                _callbackUIMap['onInitYstenSdkCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doInitYstenSdk', param, 'LMAndroid.AndroidCallJS.onInitYstenSdkCallback');
            },

            // 易视腾鉴权接口
            doAuthOrize: function (param, notifyJSCallback) {
                _callbackUIMap['onAuthOrizeCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doAuthOrize', param, 'LMAndroid.AndroidCallJS.onAuthOrizeCallback');
            },
            // 跳转易视腾订购页面
            doGoOrder: function (param, notifyJSCallback) {
                _callbackUIMap['onGoOrderCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doGoOrder', param, 'LMAndroid.AndroidCallJS.onGoOrderCallback');
            },
            // 易视腾SDK 三方内容时长上报
            doExportContentDetail: function (param, notifyJSCallback) {
                _callbackUIMap['onExportContentDetailCallback'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doExportContentDetail', param, 'LMAndroid.AndroidCallJS.onExportContentDetailCallback');
            },
            // ----------------------------------------------------------------------
            // JS -> Android ：背景音乐（播放、暂停、恢复暂停、停止）↓
            //
            // 【1、注意】：
            //      第3个参数isNeedJSCallBack(boolean)用于控制完成音频对应操作后，是
            // 否需要通知给WebJS端。
            //      isNeedJSCallBack[false]：调用Android时，不传递回调JS的方法！！！
            //      isNeedJSCallBack[true]：调用Android时，传递回调JS的方法。
            //
            // 【2、增加isNeedJSCallBack参数理由】：
            //      如果何时何地调用时，都提供给Android调用JS的方法名，那么Android端
            // 完成对应操作后，也会WebView.loadUrl(jsFuncName)。比较频繁的话，该操作
            // 会严重占用CPU资源，导致web页面（存在于Activity[WebView]主线程中）。故，
            // 只需要在具体的场景下才需要调用通知。例如：新手指导页面（播放完上一个
            // 音频后，再显示下一个高亮控制及播放下一个语音）
            // Added by Songhui
            // ----------------------------------------------------------------------
            doPlayBackgroundMusic: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onPlayBackgroundMusicCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doPlayBackgroundMusic', param, 'LMAndroid.AndroidCallJS.onPlayBackgroundMusicCallback');
                } else {
                    LMAndroid.jsCallAndroid('doPlayBackgroundMusic', param, '');
                }
            },

            doPauseBackgroundMusic: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onPauseBackgroundMusicCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doPauseBackgroundMusic', param, 'LMAndroid.AndroidCallJS.onPauseBackgroundMusicCallback');
                } else {
                    LMAndroid.jsCallAndroid('doPauseBackgroundMusic', param, '');
                }
            },

            doResumeBackgroundMusic: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onResumeBackgroundMusicCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doResumeBackgroundMusic', param, 'LMAndroid.AndroidCallJS.onResumeBackgroundMusicCallback');
                } else {
                    LMAndroid.jsCallAndroid('doResumeBackgroundMusic', param, '');
                }
            },

            doStopBackgroundMusic: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onStopBackgroundMusicCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doStopBackgroundMusic', param, 'LMAndroid.AndroidCallJS.onStopBackgroundMusicCallback');
                } else {
                    LMAndroid.jsCallAndroid('doStopBackgroundMusic', param, '');
                }
            },

            // ----------------------------------------------------------------------
            // JS -> Android ：语音提示(即非背景音乐)（播放、暂停、恢复暂停、停止）↓
            //
            // 【1、注意】：
            //      第3个参数isNeedJSCallBack(boolean)用于控制完成音频对应操作后，是
            // 否需要通知给WebJS端。
            //      isNeedJSCallBack[false]：调用Android时，不传递回调JS的方法！！！
            //      isNeedJSCallBack[true]：调用Android时，传递回调JS的方法。
            //
            // 【2、增加isNeedJSCallBack参数理由】：
            //      如果何时何地调用时，都提供给Android调用JS的方法名，那么Android端
            // 完成对应操作后，也会WebView.loadUrl(jsFuncName)。比较频繁的话，该操作
            // 会严重占用CPU资源，导致web页面（存在于Activity[WebView]主线程中）。故，
            // 只需要在具体的场景下才需要调用通知。例如：新手指导页面（播放完上一个
            // 音频后，再显示下一个高亮控制及播放下一个语音）
            // Added by Songhui
            // ----------------------------------------------------------------------
            doPlaySoundMusic: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onPlaySoundMusicCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doPlaySoundMusic', param, 'LMAndroid.AndroidCallJS.onPlaySoundMusicCallback');
                } else {
                    LMAndroid.jsCallAndroid('doPlaySoundMusic', param, '');
                }
            },

            doPlaySoundMusicOffline: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onPlaySoundMusicOfflineCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doPlaySoundMusicOffline', param, 'LMAndroid.AndroidCallJS.onPlaySoundMusicOfflineCallback');
                } else {
                    LMAndroid.jsCallAndroid('doPlaySoundMusicOffline', param, '');
                }
            },

            doPauseSoundMusic: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onPauseSoundMusicCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doPauseSoundMusic', param, 'LMAndroid.AndroidCallJS.onPauseSoundMusicCallback');
                } else {
                    LMAndroid.jsCallAndroid('doPauseSoundMusic', param, '');
                }
            },

            doResumeSoundMusic: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onResumeSoundMusicCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doResumeSoundMusic', param, 'LMAndroid.AndroidCallJS.onResumeSoundMusicCallback');
                } else {
                    LMAndroid.jsCallAndroid('doResumeSoundMusic', param, '');
                }
            },

            doStopSoundMusic: function (param, notifyJSCallback, isNeedJSCallBack) {
                _callbackUIMap['onStopSoundMusicCallback'] = notifyJSCallback;
                if (typeof isNeedJSCallBack === 'boolean' && isNeedJSCallBack) {
                    LMAndroid.jsCallAndroid('doStopSoundMusic', param, 'LMAndroid.AndroidCallJS.onStopSoundMusicCallback');
                } else {
                    LMAndroid.jsCallAndroid('doStopSoundMusic', param, '');
                }
            },

            /*
             * ********************************************************
             * 请求第三方（未来电视）规范调用！
             * ********************************************************
             * JS->Android：web端请求android端相关“未来电视相关的SDK”任务（包括：获取广告、上报广告日志、上报用户行为日志），不同任务根据taskType区分。
             * <pre>
             *     《一》、Web端传递下来的param参数，定义规范格式如：
             *          {
             *              "taskType": 2001,     //任务类型。（1000-获取广告，2000-上报广告日志 2001-上报用户行为日志）
             *              "taskInfo": {         //具体任务请求信息json对象，不同的taskType数据结构不一样。详见《二》参数定义。
             *                  ...
             *              }
             *          }
             *
             *     《二》、不同taskType对应的taskInfo定义规范：
             *          - taskType = 1000，请求“广告信息”。调用广告AdSDK，接口所需参数定义规范格式，即taskInfo：
             *              {
             *                  "ad_type": "open", //请求广告类型。例如："open"表示开屏广告
             *              }
             *              e.g. {"taskType":1000,"taskInfo":{"ad_type": "open"}}
             *
             *          - taskType = 2000，上报“广告日志”。调用广告AdSDK，接口所需参数定义规范格式，即taskInfo：
             *              {
             *                  "mid":"",               //投放 ID
             *                  "aid":"",               //广告位 ID
             *                  "mtid":"",              //素材 ID，即 materials 中的 id
             *                  "seriesID":"",          //节目集 ID，播放器广告需要传此参数
             *                  "programID":"",         //节目 ID，播放器广告需要传此参数
             *                  "location":"",          //视频广告实际播放时长，单位秒，播放器广告需要传此参数
             *                  "extend":"",            //用于传递扩展参数，形式为key1=value1&key2=value2&key3=value3各参数间用&分隔
             *              }
             *              e.g. {"taskType":2000,"taskInfo":{"mid":549,"aid":"25","mtid":"549","seriesID":"","programID":"","location":"","extend":""}}
             *
             *          - taskType = 2001，上报“用户行为日志”。调用日志logSDK，接口所需参数定义规范格式，即taskInfo：
             *              {
             *                  "type":"",               //日志节点类型（int型）
             *                  "contents":["16",...],   //日志具体信息（string型，约定以集合列表返回）
             *              }
             *              e.g. {"taskType":2001,"taskInfo":{"type":4,"contents":["16","","hv_14729_630001","0","0","",""]}}
             * </pre>
             *
             * @author Songhui on 2019-11-15
             */
            doTaskWeilaiTV: function (param, notifyJSCallback) {
                _callbackUIMap['onTaskWeilaiTV'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doTaskWeilaiTV', param, 'LMAndroid.AndroidCallJS.onTaskWeilaiTV');
            },


            // 第三方：获取广告AD信息
            // TODO 注：暂不处理，保留兼容（因为目前有“魔方-黑龙江移动”上线在使用！），下一迭代版本更新，可替换为doTaskWeilaiTV。
            doGetADInfo: function (param, notifyJSCallback) {
                _callbackUIMap['onGetADInfo'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doGetADInfo', param, 'LMAndroid.AndroidCallJS.onGetADInfo');
            },
            doReportADLog: function (param, notifyJSCallback) {
                _callbackUIMap['onReportADLog'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doReportADLog', param, 'LMAndroid.AndroidCallJS.onReportADLog');
            },


            /*
             * ********************************************************
             * 检查是否安装、下载、安装、启动APK：请求
             * ********************************************************
             * JS->Android：web端请求android端相关接口及传递Android端数据规范：
             * <pre>
             *     所有操作统一定义规范（若后期迭代，则追加）：
             *       {
             *           apk_name: '幸福健身团',
             *           pkg_name: 'com.lutongnet.ott.health',
             *           cls_name: 'com.lutongnet.ott.health.activity.WelcomeActivity',
             *           download_url: 'https://cdn-qinghai-ziyuan.vas.lutongnet.com/d5/qinghai/cm/health/OTT_APP_HEALTH_500_mobile_qinghai_200114_001_signed_signed.apk',
             *           downloading_tips: '正在下载“幸福健身团”...',
             *           install_apk_path: '',
             *       }
             * </pre>
             *
             * @author Songhui on 2020-3-17
             */
            doCheckAppIsInstall: function (param, notifyJSCallback) {
                _callbackUIMap['onCheckAppIsInstall'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doCheckAppIsInstall', param, 'LMAndroid.AndroidCallJS.onCheckAppIsInstall');
            },
            doInstallApkFile: function (param, notifyJSCallback) {
                _callbackUIMap['onInstallApkFile'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doInstallApkFile', param, 'LMAndroid.AndroidCallJS.onInstallApkFile');
            },
            doDownloadApkFile: function (param, notifyJSCallback) {
                _callbackUIMap['onDownloadApkFile'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doDownloadApkFile', param, 'LMAndroid.AndroidCallJS.onDownloadApkFile');
            },
            doLaunchApk: function (param, notifyJSCallback) {
                _callbackUIMap['onLaunchApk'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doLaunchApk', param, 'LMAndroid.AndroidCallJS.onLaunchApk');
            },

            // 上报访问轨迹事件（通过SDK方式）
            doReportTrace: function (param, notifyJSCallback) {
                _callbackUIMap['doReportTrace'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('doReportTrace', param, '');
            },

            /***************************************业务逻辑相关*****************************************************/
            // 跳转第三方应用
            doJumpThirdParty: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doJumpThirdParty', param, '');
            },

            // 跳转U点健康APP
            doJumpUHealthApp: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doJumpUHealthApp', param, '');
            },

            // 跳转U点健康APP H5
            doJumpUHealthAppH5: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doJumpUHealthAppH5', param, '');
            },

            // 跳转广东广电 H5
            doJumpGDGDH5: function (param, notifyJSCallback) {
                LMAndroid.jsCallAndroid('doJumpGDGDH5', param, '');
            },

            // 吉林移动获取播放器地址
            getPlayUrl:function (param,notifyJSCallback) {
                _callbackUIMap['onGetPlayUrl'] = notifyJSCallback;
                LMAndroid.jsCallAndroid('getPlayUrl', param, 'LMAndroid.AndroidCallJS.onGetPlayUrl');
            }
        },

        // 具体业务：Android调用JS接口（Android -> JS）
        AndroidCallJS: {


            // 获取Android设备信息回调
            onGetDeviceNameCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onGetDeviceNameCallbackUI, param, notifyAndroidCallback);
            },

            // 获取Android设备信息回调
            onGetDeviceInfoCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onGetDeviceInfoCallbackUI, param, notifyAndroidCallback);
            },

            // 获取Android端缓存的新手指导使用记录
            onGetNewGuidanceCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onGetNewGuidanceInfoCallbackUI, param, notifyAndroidCallback);
            },

            // 获取Android端http post请求结果
            onHttpPostCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onHttpPost, param, notifyAndroidCallback);
            },

            // 获取Android端AES请求结果
            onAESCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onAESBack, param, notifyAndroidCallback);
            },

            //webview获取焦点结果
            onWebViewGetFocsCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onWebViewGetFocsCallback, param, notifyAndroidCallback);
            },

            // 1-1视频问诊结束回调
            onP2PInquiryCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onP2PInquiryCallbackUI, param, notifyAndroidCallback);
            },

            // 获取Android端订购结果
            onPayCallback: function (param, notifyAndroidCallback) {
                if(LMEPG.Log) LMEPG.Log.debug("android,js onPayCallback >>> " + param);
                LMAndroid.androidCallJS(LMAndroid.onPayCallbackUI, param, notifyAndroidCallback);
            },
            // 获取Android端订购结果
            onQuitPayCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onPayCallbackUI, param, notifyAndroidCallback);
            },

            // 获取Android端中兴支付订购结果
            onTVPayCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onTVPayCallbackUI, param, notifyAndroidCallback);
            },
            // 获取Android端从局方鉴权结果通知
            onUserTypeAuth: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onUserTypeAuthUI, param, notifyAndroidCallback);
            },

            // 加载健康检测结果页
            doLoadMeasureResult: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.doLoadMeasureResultUI, param, notifyAndroidCallback);
            },

            // 查询订单状态
            doQueryOrderState: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.doQueryOrderStateUI, param, notifyAndroidCallback);
            },

            /***************************************播放器相关通知*****************************************************/
            //开始播放通知
            onFullPlayerStartCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onFullPlayerStartCallbackUI, param, notifyAndroidCallback);
            },

            // 返回设备是否有可用摄像头结果
            onCheckHasCameraNameCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onCheckHasCameraNameCallback'], param, notifyAndroidCallback);
            },

            //暂停播放通知
            onFullPlayerPauseCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onFullPlayerPauseCallback, param, notifyAndroidCallback);
            },

            //继续播放通知
            onFullPlayerResumeCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onFullPlayerResumeCallback, param, notifyAndroidCallback);
            },

            //播放结束通知
            onFullPlayerCompleteCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onFullPlayerCompleteCallback, param, notifyAndroidCallback);
            },

            //播放进度改变通知
            onFullPlayerSeekCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onFullPlayerSeekCallback, param, notifyAndroidCallback);
            },

            //小窗播放结束通知
            onSmallPlayerCompleteCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(LMAndroid.onSmallPlayerCompleteCallback, param, notifyAndroidCallback);
            },

            //广西广电鉴权视频
            onAuthAndGetMediaCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['doAuthAndGetMedia'], param, notifyAndroidCallback);
            },
            //广东移动鉴权vip
            onAuthAndIsVipCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['doAuthAndIsVip'], param, notifyAndroidCallback);
            },


            // 中国联通vip鉴权
            onAuthCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['doAuth'], param, notifyAndroidCallback);
            },

            // 山东电信海看数据上报回调
            onSendDataCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['doSendData'], param, notifyAndroidCallback);
            },

            // 山东电信海看收藏数据上报回调
            onSendCollectDataCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onSendCollectDataCallback'], param, notifyAndroidCallback);
            },

            // 山东电信海看订购数据上报回调
            onSendOrderDataCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onSendOrderDataCallback'], param, notifyAndroidCallback);
            },

            //获取各地区机顶盒内置属性值
            onGetSystemPropertiesCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onGetSystemPropertiesCallback'], param, notifyAndroidCallback);
            },
            onUpdateDefaultBackgroundCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onUpdateDefaultBackgroundCallback'], param, notifyAndroidCallback);
            },

            // 自更新APK 下载结果回调
            onDownloadApkCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onDownloadApkCallback'], param, notifyAndroidCallback);
            },

            //
            onInstallApkCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onInstallApkCallback'], param, notifyAndroidCallback);
            },

            //获取盒子信息
            onGetVideoRealUrlCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onGetVideoRealUrlCallback'], param, notifyAndroidCallback);
            },

            //获取盒子信息
            onGetSetTopBoxInfoCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onGetSetTopBoxInfoCallback'], param, notifyAndroidCallback);
            },
            //初始化易视腾融合包SDK
            onInitYstenSdkCallback:function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onInitYstenSdkCallback'], param, notifyAndroidCallback);
            },
            //易视腾融合包SDK鉴权
            onAuthOrizeCallback:function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onAuthOrizeCallback'], param, notifyAndroidCallback);
            },
            //易视腾融合包订购页
            onGoOrderCallback:function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onGoOrderCallback'], param, notifyAndroidCallback);
            },
            //易视腾融合包第三方内容时长上报
            onExportContentDetailCallback:function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onExportContentDetailCallback'], param, notifyAndroidCallback);
            },

            //用于android显示日志
            log: function (param, notifyAndroidCallback) {
                LMEPG.Log.error(param);
            },

            // 第三方：获取广告AD信息回调通知。
            onGetADInfo: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onGetADInfo'], param, notifyAndroidCallback);
            },

            /*************************************** 第三方（未来电视）相关 ***************************************/
            // 第三方：请求未来电视SDK回调结果通知
            onTaskWeilaiTV: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onTaskWeilaiTV'], param, notifyAndroidCallback);
            },

            // ----------------------------------------------------------------------
            // Android -> JS ：背景音乐-各个操作回调↓
            //            播放、暂停、恢复暂停、停止
            // ----------------------------------------------------------------------

            onPlayBackgroundMusicCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onPlayBackgroundMusicCallback'], param, notifyAndroidCallback);
            },

            onPauseBackgroundMusicCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onPauseBackgroundMusicCallback'], param, notifyAndroidCallback);
            },

            onResumeBackgroundMusicCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onResumeBackgroundMusicCallback'], param, notifyAndroidCallback);
            },

            onStopBackgroundMusicCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onStopBackgroundMusicCallback'], param, notifyAndroidCallback);
            },

            // ----------------------------------------------------------------------
            // Android -> JS ：语音提示(即非背景音乐)-各个操作回调↓
            //            播放、暂停、恢复暂停、停止
            // ----------------------------------------------------------------------

            onPlaySoundMusicCallback: function (param, notifyAndroidCallback) { // 播放在线音频
                LMAndroid.androidCallJS(_callbackUIMap['onPlaySoundMusicCallback'], param, notifyAndroidCallback);
            },

            onPlaySoundMusicOfflineCallback: function (param, notifyAndroidCallback) { // 播放离线音频
                LMAndroid.androidCallJS(_callbackUIMap['onPlaySoundMusicOfflineCallback'], param, notifyAndroidCallback);
            },

            onPauseSoundMusicCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onPauseSoundMusicCallback'], param, notifyAndroidCallback);
            },

            onResumeSoundMusicCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onResumeSoundMusicCallback'], param, notifyAndroidCallback);
            },

            onStopSoundMusicCallback: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onStopSoundMusicCallback'], param, notifyAndroidCallback);
            },

            /*
             * ********************************************************
             * 检查是否安装、下载、安装、启动APK：通知
             * ********************************************************
             * @author Songhui on 2020-3-17
             */
            onCheckAppIsInstall: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onCheckAppIsInstall'], param, notifyAndroidCallback);
            },
            onInstallApkFile: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onInstallApkFile'], param, notifyAndroidCallback);
            },
            onDownloadApkFile: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onDownloadApkFile'], param, notifyAndroidCallback);
            },
            onLaunchApk: function (param, notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onLaunchApk'], param, notifyAndroidCallback);
            },

            /*
            * ********************************************************
            * 业务逻辑相关 -- 各个地区需要借助Android平台获取播放器地址
            * ********************************************************
            * @author RenJiaFen on 2020-11-23
            */
            onGetPlayUrl:function (param,notifyAndroidCallback) {
                LMAndroid.androidCallJS(_callbackUIMap['onGetPlayUrl'], param, notifyAndroidCallback);
            }
        }
    };

})(window);