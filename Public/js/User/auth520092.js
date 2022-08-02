/** 读取应用相关的业务参数 */
LMEPG.AuthUser.getEPGParams = function(){
    var EPGParams = {};
    if (LMEPG.STBUtil.getUserId() != '') {
        EPGParams = {
            'stbModel': LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
            'stbMac': LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
            'stbId': LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
            'EPGDomain': LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
            'UserToken': LMEPG.STBUtil.getUserToken(), // 盒子的设备ID
            'userAccount': LMEPG.STBUtil.getUserId(),  // 盒子绑定的用户ID
            'UserGroupNMB': Authentication.CTCGetConfig("UserGroupNMB") || '',
            'EpgGroupID': Authentication.CTCGetConfig("AreaNode") || '',
            'STBType': Authentication.CTCGetConfig("STBType") || 'Browser',
            'TerminalType': Authentication.CTCGetConfig("TerminalType") || '',
            'AreaNode': Authentication.CTCGetConfig("AreaNode") || '',
            'IP': Authentication.CTCGetConfig("IP") || '',
            'MAC': Authentication.CTCGetConfig("MAC") || '',
            'CountyID': Authentication.CTCGetConfig("CountyID") || ''
        };
    }else {
        EPGParams = {
            'userAccount': '18786000051_1',
            'UserToken': 'xxxx-xxxx-xxxx',
            'EPGDomain': 'http://www.baidu.com'
        };
    }
    return EPGParams;
}