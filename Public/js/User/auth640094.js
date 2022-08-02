
LMEPG.AuthUser.getEPGParams = function () {
    var EPGParams = {
        userAccount: "lmtest-ningxiagd-20191211",
        userToken: "xxxx-xxxx-xxxx",
        EPGServerURL: "http://what.f.com"
    };
    if (typeof (ottService) != "undefined") {
        EPGParams = {
            stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
            stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
            stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
            userAccount: ottService.getUserId(),
            userToken: ottService.getUserToken(),
            userArea: ottService.getUserArea(),
            userGroup: ottService.getUserGroup(),
            userPlatform: ottService.getPlatform(),
            userSystemInfo: ottService.getSystemInfo(),
            EPGServerURL: ottService.getSystemInfo().EPGServerURL,
        };
    }
    return EPGParams;
}