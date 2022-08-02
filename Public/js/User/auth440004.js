
/** 鉴权成功回调 */
var authSuccessFunc = function () {};
/** 鉴权失败回调 */
var authFailFunc = function () {};
/** 当前鉴权节点 */
var authNode = '';
/**
 * 统一的WebViewJavascriptBridge调用入口
 * @param tag 方法名
 * @param params  参数
 * @param callback 回调
 * @constructor
 */
function Bridge(tag, params, callback) {
    if (window.WebViewJavascriptBridge) {
        LMEPG.Log.info('[splash440004]--->[bridge]--->tag:' + tag + '  params:' + JSON.stringify(params));
        WebViewJavascriptBridge.callHandler(
            tag,
            params,
            callback
        );
    } else {
        LMEPG.Log.info('[splash440004]--->[bridge1111]--->tag:' + tag + '  params:' + JSON.stringify(params));
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function () {
                WebViewJavascriptBridge.callHandler(
                    tag,
                    params,
                    callback
                );
            },
            false
        );
    }
}

/** 调用局方接口成功回调 */
function getEPGParamsCallback(respData){
    LMEPG.Log.info('[SplashController440004]--->[getIPTVParamsSuccess]--->盒子信息: ' + respData);
    /**
     * {"-customerGroup":"1",
     * "-client":"3072679965",
     * "-caRegionCode":"101",
     * "-portalAddress":"172.16.241.29:80",
     * "-networkId":"223",
     * "-IPAddress":"192.168.1.22",
     * "-account":"760021587490",
     * "-deviceId":"3072679965",
     * "-serviceType":"1",
     * "-userType":"0",
     * "-areaCode":"101"}
     */
    try {
        console.log('getIPTVParamsSuccess callback data:' + respData);
        var config = JSON.parse(respData);
        if (typeof (config) != "undefined" && typeof (config) != null) {
            // 2. 把EPG配置信息异步请求送给控制器保存，然后再进行login操作
            var EPGParams = {
                'userAccount': config['-account'],
                'account': config['-account'],
                'client': config['-client'],
                'areaCode': config['-areaCode'],
                'caRegionCode': config['-caRegionCode'],
                'deviceId': config['-deviceId'],
                'networkId': config['-networkId'],
                'IPAddress': config['-IPAddress'],
                'customerGroup': config['-customerGroup'],
                'portalAddress': config['-portalAddress'],
                'serviceType': config['-serviceType'],
                'userType': config['-userType'],
                'vipState': 0, // 调用接口后台鉴权
                'authNode':authNode
            };
            LMEPG.AuthUser.authByNetwork(EPGParams, authSuccessFunc, authFailFunc);
        }

    } catch (exception) {
        console.log(exception);
    }
}

/** 广东广电EPG(APK转EPG)需异步获取用户相关信息 */
LMEPG.AuthUser.authUser = function (successFunc,failFunc,authNodeParams) {
    var EPGParams;
    if(RenderParam.debug === '1') {
        EPGParams = {
            "customerGroup": "1",
            "client": "3072679965",
            "caRegionCode": "101",
            "portalAddress": "172.16.241.29:80",
            "networkId": "223",
            "IPAddress": "192.168.1.9",
            "deviceId": "3072679965",
            "serviceType": "1",
            "userType": "0",
            "areaCode": "101",
            "userAccount": "760021587490",
            "account": "760021587490",
            "vipState": 0,
            "authNode": authNodeParams
        };
        LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
    }else {
        authSuccessFunc = successFunc;
        authFailFunc = failFunc;
        authNode =  authNodeParams
        Bridge("GetConfig", {'param': ""}, getEPGParamsCallback);
    }
}

