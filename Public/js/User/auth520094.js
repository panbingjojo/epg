/** 判断是否正在初始化 */
var isStaReady = false;

/**
 * 检查视达科是否初始化成功
 */
function checkStaReady() {
    setTimeout(function () {
        if (!isStaReady) {
            LMEPG.UI.showToast('视达科js 正在初始化', 3 * 1000);
        }
    }, 10000);
}

/**
 *  异步获取参数
 * */
function getEPGParamsAsync(authSuccessFunc, authFailFunc,authNode) {
    //正式盒子使用,有些参数是通过异步获取到的
    var userAccount = starcorCom.get_device_id();     // 获取账号(使用设备ID,也就是智能卡号作为账号)
    var areaCode = '';
    //获取地区码（通过CMS接口获取,若需使用同洲盒子地区码请使用get_ipqam_area_code方法）
    starcorCom.get_area_code(function (area_code) {
        areaCode = area_code;
    });
    setTimeout(function () {
        if (userAccount == null || userAccount == '' || userAccount == undefined) {
            LMEPG.UI.showToast('账号获取失败', 3 * 1000);
        }
        var MacId;
        try {
            MacId = baseFunc.base_params.mac_id;
        } catch (e) {
            MacId = "";
            LMEPG.Log.error("MacId ---> exception(" + e.toString() + ")");
        }

        var EPGParams = {
            'userAccount': userAccount,                       //获取账号(使用设备ID作为账号)
            'userToken': starcorCom.get_token(),
            'cpId': '10072',                                  //CpId
            'version': starcorCom.get_version(),              //版本
            'env': starcorCom.get_env(),                      //获取当前环境
            'tag': starcorCom.get_tag(),                      //获取tag分组
            'userId': starcorCom.get_user_id(),               //获取用户id
            'epgHost': starcorCom.get_epg_host(),             //获取starcorCom平台接口域名地
            'serviceType': starcorCom.get_service_type(),     //获取设备服务类型
            'areaCode': areaCode,
            'MacId': MacId,
            'qpqamAreaCode': starcorCom.get_ipqam_area_code(), //获取地区码（同洲父母乐时为盒子地区码）
            'authNode':authNode                                //当前鉴权节点
        };

        LMEPG.Log.info('getEPGParamsAsync:' + JSON.stringify(EPGParams));
        gzgdPay.authVip(function (isAuthVip) { // 封装文件进行第三方支付
            EPGParams.vipState = isAuthVip;
            LMEPG.AuthUser.authByNetwork(EPGParams, authSuccessFunc, authFailFunc);
        });
    }, 200);
}

LMEPG.AuthUser.authUser = function (successFunc, failFunc,authNode) {
    if (typeof (starcorCom) === 'undefined' || RenderParam.debug != '0') {
        var EPGParams = {
            'userAccount': 'lmtest-guangzhougd-epg', // 获取账号(使用设备ID作为账号)
            'userToken': 'xxxx-xxxx-xxxx',
            'cpId': '10072',                         //CpId
            'version': '',                           //版本
            'env': '',                               //获取当前环境
            'tag': '',                               //获取tag分组
            'userId': '',                            //获取用户id
            'epgHost': '',                           //获取starcorCom平台接口域名地
            'serviceType': '',                       //获取设备服务类型
            'areaCode': '',
            'qpqamAreaCode': '',                     //获取地区码（同洲父母乐时为盒子地区码）
            'authNode':authNode                      //当前鉴权节点
        };
        LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
    } else {
        isStaReady = false;
        // 1、调用初始化函数
        starcorCom.ready(function () {
            isStaReady = true;
            // 2、读取封装在js程序里的用户参数信息
            getEPGParamsAsync(successFunc, failFunc,authNode);
        });
        checkStaReady();
    }
}