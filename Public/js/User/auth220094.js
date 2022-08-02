var SplashController220094 = {

    getEPGParams: function () {
        if (typeof Authentication !== 'undefined') {
            return  {
                stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
                stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
                stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
                epgDomain: LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
                userToken: LMEPG.STBUtil.getUserToken(), // 盒子的设备ID
                userAccount: LMEPG.STBUtil.getUserId(),  // 盒子绑定的用户ID
                UpgradeDomain: Authentication.CUGetConfig('UpgradeDomain'),
                Channel: Authentication.CUGetConfig('Channel'),
                BTVEPGUrl: Authentication.CUGetConfig('BTVEPGUrl'),
                VODEPGUrl: Authentication.CUGetConfig('VODEPGUrl'),
                SelfServiceEPGURL: Authentication.CUGetConfig('SelfServiceEPGURL'),
                UserSpaceURL: Authentication.CUGetConfig('UserSpaceURL'),
                InfoEPGUrl: Authentication.CUGetConfig('InfoEPGUrl'),
            };
        }
    }

}

/** 吉林广电联通版本需通过js页面发起鉴权，覆盖重写通用方法 */
LMEPG.AuthUser.authUser = function (successFunc, failFunc, authNode) {
    try {
        if (typeof window.top != 'undefined' && typeof window.top.jk39 != 'undefined') {
            var jk39ProductId = RenderParam.productId; //39健康计费套餐id，用于鉴权等操作
            LMEPG.Log.info('[auth10220094]--->[doAuth]--->鉴权产品id: ' + jk39ProductId);
            window.top.jk39.auth({
                    package: [jk39ProductId], //套餐id
                    callback: function (result) {
                        LMEPG.Log.info('[auth10220094]--->[doAuth][result]--->鉴权结果: ' + result);
                        var EPGParams = SplashController220094.getEPGParams();
                        EPGParams.vipState = result ? 1 : 0;
                        EPGParams.authNode = authNode;
                        LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
                    }
                }
            );
        } else {
            //本机浏览器测试放开这段代码
            var EPGParams = {
                vipState: 0,
                userAccount: 'lmtest-jilingd-20190319',
                userToken: 'xxxx-xxxx-xxxx',
                epgDomain: 'http://www.baidu.com',
                authNode: authNode
            };
            LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
        }

    } catch (e) {
        LMEPG.Log.error('[auth10220094]--->JLPaySDKV2.doAuth()--->[failed!]--->-->鉴权发生异常：' + e.toString());
    }
}