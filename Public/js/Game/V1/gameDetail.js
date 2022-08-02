var Page = {
    init:function () {
        LMEPG.BM.init('',[])
        this.getGameDetail(RenderParam.gameId || '472',function (data) {
            var div = document.createElement('div')
            div.className = 'game-detail'
            div.id = 'game-detail'

            div.innerHTML =
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/detail-logo.png" class="detail-logo"/>' +
                '<img src="' + RenderParam.fsUrl + data.data.img_url + '" class="detail-game-pic"/>' +
                '<div class="detail-game-name">' + data.data.game_name + '</div>' +
                '<div class="detail-game-size">游戏大小：' + data.version.game_size + '</div>' +
                '<div class="detail-game-v">游戏版本：' + data.version.game_version + '</div>' +
                '<div class="detail-info">游戏简介：' + data.data.remark + '</div>' +
                '<img class="detail-start" src="' + g_appRootPath + '/Public/img/hd/Home/V32/start-game-btn.png" id="detail-start"/>'

            LMEPG.BM.addButtons([{
                id: 'detail-start',
                type: 'img',
                nextFocusDown: '',
                nextFocusUp: '',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: " ",
                focusImage: g_appRootPath + '/Public/img/hd/Home/V32/start-game-btn.png',
                click:Page.startGame,
                focusChange: '',
                beforeMoveChange: '',
                signInfo: '',
                data: data
            }])

            G('app').appendChild(div)
            LMEPG.BM.requestFocus('detail-start')
        })
    },

    startGame:function(btn){
        var gameData = btn.data

        var STBType = LMEPG.STBUtil.getSTBModel(); // 设备型号
        LMEPG.Log.info("STBType:"+STBType);
        if((STBType === "B860AV1.1-T2" && false) && (gameData.version.package_name !== "com.yzkj.wuziqi" && gameData.version.package_name !== "com.yzkj.zhongguoxiangqi")){
            InterFaceEvent.specialInstallApp(gameData.version.package_name,gameData.version.apk_url);
            return;
        }

        if ((gameData.version.is_appstore == '1' && gameData.version.in_path == '1')
            || gameData.version.package_name == "com.yzkj.wuziqi"
            || gameData.version.package_name == "com.yzkj.zhongguoxiangqi") {
            InterFaceEvent.startAppGame(gameData.version.package_name, gameData.version.game_id);
        } else {
            InterFaceEvent.startPluginGame(gameData.version.package_name, 1, gameData.version.game_id);
        }
    },

    getGameDetail:function (gameId, cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI("Notify/getGameCodeDetails", {
            gameId: gameId
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog()
            console.log(data)
            cb && cb(data)
        })
    }
}

var InterFaceEvent = {
    startAppGame: function (packageName, appId) {
        var install = LMEPG.ApkPlugin.isAppInstall(packageName);
        if (install && install != "undefined") {
            LMEPG.ApkPlugin.startAppByName(packageName);
        } else {
            InterFaceEvent.installAppGame(packageName, appId);
        }
    },

    startPluginGame: function (packageName, action, gameId) {
        LMEPG.ajax.postAPI("Notify/gameInstallReport", {
            gameId: gameId,
            action: action
        }, function (data) {
            var appName = "com.visionall.LMGameActivity";
            var install = LMEPG.ApkPlugin.isAppInstall(appName);
            if (install && install != "undefined") {
                var version = LMEPG.ApkPlugin.getAppVersion(appName);
                LMEPG.Log.error("startAppShop version:" + version);
                if(!LMEPG.Func.isEmpty(version)){
                    Network.getGameDetail('7', function (data) {
                        if(data.result === 0 && version !== data.version.game_version){
                            InterFaceEvent.startAppShop("com.visionall.LMGameActivity", "478");
                            return 0;
                        }
                    });
                }
                LMEPG.ApkPlugin.startAppByName(appName);
            } else {
                InterFaceEvent.startAppShop("com.visionall.LMGameActivity", "478");
            }
        })
    },

    installAppGame: function (packageName, gameId) {
        LMEPG.ajax.postAPI("Notify/gameInstallReport", {
            gameId: gameId,
            action: 1
        }, function (data) {
            console.log(data)
            if (packageName == "com.yzkj.wuziqi") {
                gameId = "476";
            }
            if (packageName == "com.yzkj.zhongguoxiangqi") {
                gameId = "477";
            }
            InterFaceEvent.startAppShop(packageName, gameId);
        })
    },

    startAppShop: function (packageName, appId) {
        var appName = "com.amt.appstore"; // 商城包名，根据具体版本而定，不一定是 “com.amt.appstore”
        var extraString = "jumpId=8&appPkg=" + packageName + "&appId=" + appId;
        var intentMessage = '{"intentType":1,' +
            '"appName":"' + appName + '",' +
            '"action":"' + "com.amt.appstore.action.LAUNCHER" + '",' +
            '"extra":[{"name":"extraKey","value":"' + extraString + '"}]}';

        LMEPG.Log.error("startAppShop intentMessage:" + intentMessage);
        console.log(intentMessage);
        STBAppManager.startAppByIntent(intentMessage);
    },
}

function onBack() {
    if (RenderParam.fromLaunch == 1) { // 卓影平台退出局方大厅
        LMEPG.Log.error("exitIptvApp:" + RenderParam.exitIptvApp);
        Utility.setValueByName("exitIptvApp");
    } else { // 正常返回逻辑
        LMEPG.Intent.back('IPTVPortal');
    }
}