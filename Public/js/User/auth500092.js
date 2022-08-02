/** 鉴权成功回调 */
var authSuccessFunc = function () {
};
/** 鉴权失败回调 */
var authFailFunc = function () {
};
/** 当前鉴权节点 */
var authNode = '';

var AuthParamsConstants = {
    SP_ID: "spa00042",
    PRODUCT_IDS: ["a3100000000000000000536", "a3100000000000000000537", "a3100000000000000000538", "a3100000000000000000539", "a3100000000000000000578"],
    AUTH_PATH: "service/AuthInfoProduct.jsp",
    AUTH_SUCCESS_CALLBACK_FUNC: "callBackAuthResult"
}

/** CWS后台的鉴权方法，区别于到局方鉴权 */
function auth(isVip) {
    // 组装参数请求后台
    var EPGParams = {
        stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
        stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
        epgDomain: LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
        stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
        userAccount: RenderParam.userAccount,    // 当前用户账号
        vipState: isVip,                         // 局方鉴权的结果
        authNode: authNode                       // 当前鉴权节点
    }
    LMEPG.AuthUser.authByNetwork(EPGParams, authSuccessFunc, authFailFunc);
}

/** 局方鉴权回调函数 */
function callBackAuthResult(respData) {
    LMEPG.Log.info('鉴权结果:' + JSON.stringify(respData));
    if (typeof respData == 'string') {
        respData = JSON.parse(respData);
    }
    var authResult = respData.result;
    var isVip = 0;
    if (authResult == "0" || authResult == "9304" || authResult == 0 || authResult == 9304) {
        isVip = 1;
    }
    LMEPG.Cookie.setCookie('isVip', isVip);
    auth(isVip);
}

LMEPG.AuthUser.authUser = function (successFunc, failFunc,authNodeParams) {
    authSuccessFunc = successFunc;
    authFailFunc = failFunc;
    authNode = authNodeParams;
    if (RenderParam.debug != "0") {
        auth(0);
    } else {
        var iframe = '<iframe id="hidden_frame" name="hidden_frame" style="width: 0;height: 0;" src=""></iframe>';
        var div = document.createElement("div");
        document.body.appendChild(div);
        div.innerHTML = iframe;
        var productIds = AuthParamsConstants.PRODUCT_IDS.join(",");
        var URL = RenderParam.serverPath + AuthParamsConstants.AUTH_PATH
            + "?spID=" + AuthParamsConstants.SP_ID
            + "&productID=" + productIds
            + "&onSuccess=" + AuthParamsConstants.AUTH_SUCCESS_CALLBACK_FUNC + "&inIFrame=1&onError=0";
        LMEPG.Log.info('开始鉴权:' + URL);
        G("hidden_frame").src = URL;
    }
}