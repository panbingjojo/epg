/** 获取盒子相关参数 */
LMEPG.AuthUser.getEPGParams = function () {
    var tvHelperVersion = '';
    if (typeof STBAppManager != 'undefined') { // 中国联通需要采集盒子TV助手的版本号
        var version = STBAppManager.getAppVersion("com.chinaunicom.duer.apps.xtv");
        LMEPG.Log.info("STBAppManager version ... " + version);
        tvHelperVersion = version;
    }
    return {
        stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
        stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
        epgDomain: LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
        stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
        epgUserId: LMEPG.STBUtil.getUserId(),    // 盒子绑定的用户ID
        fromId: RenderParam.fromId,              // 当前用户进入是否局方鉴权
        helperVersion: tvHelperVersion,          // 盒子内置的TV助手版本号，局方统计需要
        areaCode: RenderParam.areaCode,          // 当前省份ID
    };
}