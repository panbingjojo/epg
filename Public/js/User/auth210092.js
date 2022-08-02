LMEPG.AuthUser.getEPGParams = function () {
    // 测试参数
    var EPGParams;
    if (typeof (jsObj) !== 'undefined') { // JS调用Android获取账号(CS平台)
        var paramJson = JSON.stringify({
            type: 3,
            data: {},
            spid: RenderParam.spid
        });
        LMEPG.Log.info('辽宁电信获取用户账号 jsObj 调用参数: ' + paramJson);
        var userId = jsObj.eventFromJS(paramJson);
        LMEPG.Log.info('辽宁电信获取用户账号: ' + userId);
        EPGParams = {
            stbModel: '',       // 盒子型号，包括厂商和具体系列
            stbMac: '',         // 盒子MAC地址
            stbId: '',          // 盒子的设备ID
            EPGDomain: '',      // 局方大厅的地址，用于应用程序返回局方大厅
            userToken: '',      // 盒子的设备ID
            userAccount: userId,// 盒子绑定的用户ID
        };
    } else if (typeof (Authentication) !== 'undefined') { // BS平台
        EPGParams = {
            stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
            stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
            stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
            EPGDomain: LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
            userToken: LMEPG.STBUtil.getUserToken(), // 盒子的设备ID
            userAccount: LMEPG.STBUtil.getUserId(),  // 盒子绑定的用户ID
        };
        LMEPG.Log.info('BS platform postData:' + JSON.stringify(EPGParams));
    } else {
        EPGParams = {
            EPGDomain: '',                           // 局方大厅的地址，用于应用程序返回局方大厅
            userToken: 'xxxx-xxxx-xxxx',             // 盒子的设备ID
            userAccount: 'lmtest-anhuidx-twz',       // 盒子绑定的用户ID
        }
    }
    return EPGParams;
}