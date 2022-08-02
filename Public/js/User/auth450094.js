LMEPG.AuthUser.authUser = function (successFunc, failFunc, authNode) {
    var userId = '';
    var deviceId = '';
    var areaCode = '';
    if (typeof iPanel == 'object') {
        userId = iPanel.getGlobalVar('USER_ID');
        areaCode = iPanel.getGlobalVar('GET_MEDIA_REGION_ID');
    }
    if (typeof guangxi == 'object') {
        deviceId = guangxi.getStbNum();
    }
    var EPGParams = {
        stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
        stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
        userAccount: userId,
        deviceId: deviceId,
        areaCode: areaCode,
        historyLength: history.length,
        authNode: authNode
    }
    if (typeof (starcorCom) === 'undefined' || RenderParam.debug != '0') {
        EPGParams.vipState = 0;
        LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
    } else {
        starcorCom.apply_play({
                nns_cp_id: '39JK',
                nns_cp_video_id: '39JK0000000000000package10000557',
                nns_video_type: '0'
            }, function (resp) {
                EPGParams.vipState = resp.result.state;
                LMEPG.AuthUser.authByNetwork(EPGParams, successFunc, failFunc);
            }
        );
    }
}