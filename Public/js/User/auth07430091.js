/** 获取盒子相关信息 */
LMEPG.AuthUser.getEPGParams = function () {
    var EPGParams;
    if (typeof (window.starcorExt) === "undefined"/*无实际环境*/ || typeof (mangoTV) === "undefined"/*未引入js*/) {
        // 本机测试环境
        EPGParams = {
            stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
            stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
            epgDomain: LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
            stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
            userToken: LMEPG.STBUtil.getUserToken(), // 用户当前的token值
            userId: "lmtest-mangotv-user1",          // 用户账号
            extrasInfo: "",
        };
    } else {
        var tvInfo = mangoTV.get_all_info();
        EPGParams = {
            stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
            stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
            epgDomain: LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
            stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
            userToken: LMEPG.STBUtil.getUserToken(), // 用户当前的token值
            userId: tvInfo.userId,                   // 用户账号
            extrasInfo: JSON.stringify(tvInfo),
        };
    }

    return EPGParams;
}