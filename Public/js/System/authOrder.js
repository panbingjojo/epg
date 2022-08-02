// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 计费回调前端鉴权
// +----------------------------------------------------------------------

function sendAuthResult(isvip) {
    var postData = {
        "accountId": RenderParam.accountId,
        "orderId": RenderParam.orderId,
        "payDt": RenderParam.payDt,
        "payState": RenderParam.payState,
        "isvip": isvip,
    };
    // 获取目标地址
    LMEPG.ajax.postAPI("System/sendBillAuthRes", postData, function (data) {
        LMEPG.Intent.back();
    });
}

//****************************************重庆电信500092***********************************************//
var AuthParamsConstants = {
    SP_ID: "spa00042",
    PRODUCT_IDS: ["a3100000000000000000536", "a3100000000000000000537", "a3100000000000000000538", "a3100000000000000000539", "a3100000000000000000578"],
    AUTH_PATH: "service/AuthInfoProduct.jsp",
    AUTH_SUCCESS_CALLBACK_FUNC: "callBackAuthResult"
}

function callBackAuthResult(respData) {
    LMEPG.Log.info('计费回调鉴权结果:' + JSON.stringify(respData));
    if (typeof respData == 'string') {
        respData = JSON.parse(respData);
    }
    var authResult = respData.result;
    var isVip = 0;
    if (authResult == "0" || authResult == "9304" || authResult == 0 || authResult == 9304) {
        isVip = 1;
    }
    LMEPG.Cookie.setCookie('isVip', isVip);
    sendAuthResult(isVip);
}

function auth500092() {
    var iframe = '<iframe id="hidden_frame" name="hidden_frame" style="width: 0;height: 0;" src=""></iframe>';
    var div = document.createElement("div");
    document.body.appendChild(div);
    div.innerHTML = iframe;
    var productIds = AuthParamsConstants.PRODUCT_IDS.join(",");
    var URL = RenderParam.serverPath + AuthParamsConstants.AUTH_PATH
        + "?spID=" + AuthParamsConstants.SP_ID
        + "&productID=" + productIds
        + "&onSuccess=" + AuthParamsConstants.AUTH_SUCCESS_CALLBACK_FUNC + "&inIFrame=1&onError=0";
    LMEPG.Log.info('计费回调开始鉴权:' + URL);
    G("hidden_frame").src = URL;
}
//****************************************重庆电信500092***********************************************//


//****************************************广西广电450094***********************************************//
function auth450094() {
    starcorCom.apply_play({
            nns_cp_id: '39JK',
            nns_cp_video_id: '39JK0000000000000package10000557',
            nns_video_type: '0'
        }, function (resp) {
            var vipState = resp.result.state;
            sendAuthResult(vipState);
        }
    );
}
//****************************************广西广电450094***********************************************//


//****************************************贵州广电520094***********************************************//
var isStaReady = false;

function checkStaReady() {
    setTimeout(function () {
        if (!isStaReady) {
            LMEPG.UI.showToast('视达科js 正在初始化', 3 * 1000);
        }
    }, 10000);
}

//贵州广电计费回调鉴权
function auth520094() {
    isStaReady = false;
    // 1、调用初始化函数
    starcorCom.ready(function () {
        isStaReady = true;
        // 2、读取封装在js程序里的用户参数信息
        gzgdPay.authVip(function (isAuthVip) { // 封装文件进行第三方支付
            var vipState = isAuthVip?1:0;
            sendAuthResult(vipState);
        });
    });
    checkStaReady();
}
//****************************************贵州广电520094***********************************************//

//****************************************山东海看371092***********************************************//
function auth371092() {
    var authCode = RenderParam.authCode;
    hkAuth({code: authCode},
        function (resp) {
            if (resp == '1') {
                // console.log('鉴权通过！');
                var vipState = '1';
            } else if (resp == '0') {
                // console.log('鉴权不通过！');
                var vipState = '0';
            }
            sendAuthResult(vipState);
            haiKanHoleStat(vipState);
        },
        function (resp) {
            LMEPG.Log.error('计费回调鉴权流程失败！错误提示：' + resp);
            var vipState = '-1';
            sendAuthResult(vipState);
        });
}
//****************************************山东海看371092***********************************************//

//****************************************吉林广电联通220094***********************************************//
function auth220094() {
    var jk39ProductId = RenderParam.productId; //39健康计费套餐id，用于鉴权等操作
    LMEPG.Log.info('[auth220094]--->[doAuth]--->计费回调鉴权产品id: ' + jk39ProductId);
    window.top.jk39.auth({
            package: [jk39ProductId], //套餐id
            callback: function (result) {
                LMEPG.Log.info('[auth220094]--->[doAuth][result]--->计费回调鉴权结果: ' + result);
                var vipState = result ? 1 : 0;
                sendAuthResult(vipState);
            }
        }
    );
}
//****************************************吉林广电联通220094***********************************************//

//****************************************吉林广电联通魔方10220094***********************************************//
function auth10220094() {
    var jk39ProductId = RenderParam.productId; //39健康计费套餐id，用于鉴权等操作
    LMEPG.Log.info('[auth10220094]--->[doAuth]--->计费回调鉴权产品id: ' + jk39ProductId);
    window.top.jk39.auth({
            package: [jk39ProductId], //套餐id
            callback: function (result) {
                LMEPG.Log.info('[auth10220094]--->[doAuth][result]--->计费回调鉴权结果: ' + result);
                var vipState = result ? 1 : 0;
                sendAuthResult(vipState);
            }
        }
    );
}
//****************************************吉林广电联通魔方10220094***********************************************//



//****************************************内蒙电信150002***********************************************//
function auth150002() {
    var param = {
        //这是剧头contentId
        contentID:"39JKCODE000000101000000300001113",
    };
    var isVip = 0;
    LMEPG.Log.info('[150002] doAuth : params = '+JSON.stringify(param));
    LMAndroid.JSCallAndroid.doAuth(param, function (resParam) {
        var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
        LMEPG.Log.info('[150002] doAuth result:' + JSON.stringify(resParamObj));
        if (resParamObj.code == "0") {
            isVip = 1;
        } else {
            isVip = 0;
        }

        sendAuthResult(isVip);
    });
}
//****************************************内蒙电信150002***********************************************//

//****************************************山东海看371002***********************************************//
function auth371002() {
    var reqData = {
        programId: RenderParam.authCode
    };
    LMAndroid.JSCallAndroid.doAuth(JSON.stringify(reqData), function (resParam, notifyAndroidCallback) {
        var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
        sendAuthResult(resParamObj.vipState);
        haiKanHoleStat(resParamObj.vipState);
    });
}
//****************************************山东海看371002***********************************************//

//****************************************广东移动440001***********************************************//
function auth4GUANG_DONG() {
    LMAndroid.JSCallAndroid.doAuthAndIsVip({vodCode:"02000642000000012020062999423142"}, function (res, notifyAndroidCallback) {
        if (typeof res == 'string') {
            var data= JSON.parse(res);
        }else{
            var data=res;
        }
        LMEPG.Log.info('auth440001 doAuth result:' + JSON.stringify(data));
        var isVip = 0;
        if(data.result=="0"){  // 鉴权成功，并且该用户是vip
            isVip = data.isVip;
            sendAuthResult(isVip);
        }else {
            sendAuthResult("-2");
        }
    });
}

function auth440001() {
    auth4GUANG_DONG();
}
//****************************************广东移动440001***********************************************//

//****************************************广西移动450001***********************************************//
function auth450001() {
    var isVip = "0";
    LMEPG.ajax.postAPI("Pay/getUserTypeAuthParams", null, function (reqAuthParams) {
        LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(reqAuthParams), function (jsonFromAndroid, notifyAndroidCallback) {
            LMEPG.Log.info("计费回调结果页鉴权结果:" + jsonFromAndroid);
            PaySdk.handleAuthResultFromAndroid(reqAuthParams, jsonFromAndroid, function (resultCode, resultMsg, isAuthSuccess, paySdkResultCode, authProductList) {
                LMEPG.Log.info("resultCode结果:" + resultCode + "---->isAuthSuccess结果:" + isAuthSuccess);
                if (resultCode === 1 && isAuthSuccess) {
                    isVip = "1";//sdk鉴权结果（1：鉴权成功 -1：鉴权失败）
                }
                sendAuthResult(isVip);
            });
        });
    });
}
//****************************************广西移动450001***********************************************//


//****************************************宁夏移动640001***********************************************//
function auth640001() {
    var isVip = "0";
    LMEPG.ajax.postAPI("Pay/getUserTypeAuthParams", null, function (reqAuthParams) {
        LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(reqAuthParams), function (jsonFromAndroid, notifyAndroidCallback) {
            LMEPG.Log.info("计费回调结果页鉴权结果:" + jsonFromAndroid);
            PaySdk.handleAuthResultFromAndroid(reqAuthParams, jsonFromAndroid, function (resultCode, resultMsg, isAuthSuccess, paySdkResultCode, authProductList) {
                if (resultCode === 1 && isAuthSuccess) {
                    isVip = "1";//sdk鉴权结果（1：鉴权成功 -1：鉴权失败）
                }
                sendAuthResult(isVip);
            });
        });
    });
}
//****************************************宁夏移动640001***********************************************//

//****************************************甘肃移动620007***********************************************//
function auth620007() {
    var isVip = "0";
    LMEPG.ajax.postAPI("Pay/getUserTypeAuthParams", null, function (reqAuthParams) {
        LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(reqAuthParams), function (jsonFromAndroid, notifyAndroidCallback) {
            LMEPG.Log.info("计费回调结果页鉴权结果:" + jsonFromAndroid);
            PaySdk.handleAuthResultFromAndroid(reqAuthParams, jsonFromAndroid, function (resultCode, resultMsg, isAuthSuccess, paySdkResultCode, authProductList) {
                if (resultCode === 1 && isAuthSuccess) {
                    isVip = "1";//sdk鉴权结果（1：鉴权成功 -1：鉴权失败）
                }
                sendAuthResult(isVip);
            });
        });
    });
}
//****************************************宁夏移动640001***********************************************//


//****************************************广西广电450004***********************************************//
function auth450004() {
    var isVip = "0";
    var reqParam = {
        "serviceType": "ipqam",
        "cpId": "GDYZHYL",
        "videoType": "0",
        "videoIndex": "0",
        "cdnFlag": "gxcatv_playurl",
        "cpVideoId": "ZHYL0000000000000000000010000003",
        "userAgent": "nn_player",
        "playStyle": "http",
        "isHttp": true
    };
    LMAndroid.JSCallAndroid.doAuthAndGetMedia(JSON.stringify(reqParam), function (resParam, notifyAndroidCallback) {
        var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
        if (resParamObj.result == "0") {
            if(resParamObj.state == '0'){
                isVip = '1';
            }else{
                isVip = '0';
            }
        } else {
            isVip = "-1";
        }
        sendAuthResult(isVip);
    });
}
//****************************************广西广电450004***********************************************//



var authOrder = {
    init: function () {
        switch(RenderParam.carrierId){
            case "500092":
                auth500092();
                break;
            case "371092":
                auth371092();
                break;
            case "450094":
                auth450094();
                break;
            case "520094":
                auth520094();
                break;
            case "220094":
                setTimeout(function () {auth220094();},3000);
                //auth220094();
                break;
            case "10220094":
                setTimeout(function () {auth10220094();},3000);
                //auth10220094();
                break;
            case "150002":
                auth150002();
                break;
            case "371002":
                auth371002();
                break;
            case "440001":
                auth440001();
                break;
            case "450001":
                auth450001();
                break;
            case "640001":
                auth640001();
                break;
            case "450004":
                auth450004();
                break;
            case "620007":
                auth620007();
                break;
            default:
                LMEPG.Intent.back();
                break;
        }
    }
};

// 海看订购结果数据探针
function haiKanHoleStat (isVip) {
    var turnPageInfo = {
        "ProductType":'0',// 可空：产品类型（0：产品包[包月]，1：内容[按次]）
        "ProductID": '240001315', // 产品包id
        "ProductName": '寻医问诊20元/月',// 可空：产品包名称
        "OperatorID": 'spa00003',// 产品提供商ID
        "EndTime": '',// 可空：过期时间
        "Action": '1',// 可空：订购动作，1订购；0退订；
        "OrderStatus": isVip == "1" ? "1" : "0",// 订购状态 1成功；0失败；
        "Fail": '0', // 可空：失败描述
        "OrderUrl": '',// 可空：产生订购的页面，
        "Confirmation": '0',// 可空：确认标识 0一次确认；1二次确认；
        "UrlName": '',// 可空：产生订购的页面标题
        "reserve1": null,
        "reserve2":null,
        "from": 'jz3.0' // 采集来源（jz3.0）
    };
    ShanDongHaiKan.sendReportData('7', turnPageInfo);
}

window.onload = function () {
    authOrder.init();
};




