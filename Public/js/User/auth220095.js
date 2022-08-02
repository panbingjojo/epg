LMEPG.AuthUser.getEPGParams = function () {
    var EPGParams = null; // 初始化默认值
    if (typeof Authentication === 'undefined') {
        //本机浏览器测试放开这段代码
        EPGParams = {
            userAccount: 'lmtest-jilingd-20210129',
            userToken: 'xxxx-xxxx-xxxx',
            epgDomain: 'http://www.baidu.com'
        };
    } else {
        EPGParams = {
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
    return EPGParams;
}