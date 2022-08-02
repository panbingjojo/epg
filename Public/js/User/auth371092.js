// 鉴权方法
LMEPG.AuthUser.authUser = function(successFunc, failFunc, authNode)
{
    var authCode = RenderParam.authCode;
    var EPGParams = LMEPG.AuthUser.getEPGParams(authNode);
    if (typeof Utility != 'undefined') {
        LMEPG.Log.info("auth Real!!!");
        hkAuth({code: authCode},
            function (resp) {
                if (resp == '1') {
                    // console.log('鉴权通过！');
                    EPGParams.vipState = '1';
                } else if (resp == '0') {
                    // console.log('鉴权不通过！');
                    EPGParams.vipState = '0';
                }
                EPGParams.userAccount = RenderParam.accountId;
                LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
            },
            function (resp) {
                LMEPG.Log.error('鉴权流程失败！错误提示：' + resp);
                EPGParams.vipState = '0';
                EPGParams.userAccount = RenderParam.accountId;
                LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
            });
    } else {
        LMEPG.Log.info("auth Fake!!!");
        EPGParams.vipState = '0';
        EPGParams.userAccount = RenderParam.accountId;
        LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
    }
}