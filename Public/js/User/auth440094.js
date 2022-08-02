
/** 获取盒子内部相关参数信息 */
LMEPG.AuthUser.getEPGParams = function(){
    var userAccount = 'lmtest-guangzhougd-epg';     // 获取账号(使用设备ID作为账号)
    var userToken = 'xxxx-xxxx-xxxx';
    if (typeof (CA) !== 'undefined') {
        userAccount = DataAccess.getInfo('UserInfo', 'account');              // 获取账号(作为账号)
        userToken = 'xxxx-xxxx-xxxx';
        var version = CA.version;              //版本
        var areaCode = CA.regionCode;           //获取地区码
        var stbModel = SysInfo.STBModel;         //盒子型号
        var stbId = SysInfo.STBSerialNumber;     //盒子序列号
        var cardId = CA.icNo;                   //智能卡号
        var portalAddress = DataAccess.getInfo('VodApp', 'PortalAddress');
        var portalPort = DataAccess.getInfo('VodApp', 'PortalPort');
    }
    if (userAccount) {
        return {
            'userAccount': userAccount,
            'userToken': userToken,
            'version': version,
            'areaCode': areaCode,
            'stbModel': stbModel,
            'stbId': stbId,
            'cardId': cardId,
            'portalAddress': portalAddress,
            'portalPort': portalPort
        };
    } else {
        LMEPG.UI.showToast('账号获取失败', LMSplashConstant.SHOW_TOAST_SECOND_3);
        return null;
    }
}
