/**
 * 启动魔方APK
 */
LMEPG.ApkMofang = (function () {
    var APKParam = {
        getAPKName: function () {
            var ret = "";
            switch (RenderParam.carrierId) {
                case "630092":
                    ret = "com.longmaster.iptv.health.mofang.qinghaidx";
                    break;
                default:
                    break;
            }
            return ret;
        },
        buildLauncherParam: function () {
            var ret = "";
            switch (RenderParam.carrierId) {
                case "630092":
                    var retObj = {
                        intentType: 1,
                        appName: "com.amt.appstore",
                        action: "com.amt.appstore.action.LAUNCHER",
                        extra: [
                            {
                                name: "extraKey",
                                value: "jumpId=8&appPkg=com.longmaster.iptv.health.mofang.qinghaidx&appId=408"
                            }
                        ]
                    };
                    ret = JSON.stringify(retObj);
                    break;
                default:
                    break;
            }
            return ret;
        }
    };

    var APKManager = {
        // 通用的启动apk
        _launcherCommon: function () {
            // 判断插件是否安装
            if (APKManager.isInstalledAPK()) {
                LMEPG.ApkPlugin.startAppByName(APKParam.getAPKName());
            } else {
                var intentMessage = APKParam.buildLauncherParam();
                LMEPG.ApkPlugin.startAppByIntent(intentMessage); // 启动商城并跳转到下载页
            }
            return "";
        },

        // 判断应用商城是否已经安装
        isInstalledAPK: function () {
            var retFlag = false;
            switch (RenderParam.carrierId) {
                case '630092':
                    retFlag = LMEPG.ApkPlugin.isAppInstall(APKParam.getAPKName());
                    break;
            }
            return retFlag;
        },
        init: function () {
            switch (RenderParam.carrierId) {
                default:
                    APKManager._launcherCommon();
                    break;
            }
        }
    };

    /**
     * 通用函数
     */
    var CommonFunc = {
        /**
         * 启动魔方APK
         */
        launch: function () {
            APKManager.init();
        },
    };

    return {
        func: CommonFunc
    }
})();