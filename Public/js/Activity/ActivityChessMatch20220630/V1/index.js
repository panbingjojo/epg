(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score:0,
        boxList: [
            LMActivity.makeImageUrl('camel_box.png'),
            LMActivity.makeImageUrl('yellow_box.png')
        ],
        clickTimes: false,

        init: function () {

            Activity.initButtons();
            a.showOrderResult();

            RenderParam.lmcid == "410092" && Activity.onBack410092();

            var nowTime= new Date().getTime();
            var startDate =RenderParam.endDt;
            startDate= startDate.replace(new RegExp("-","gm"),"/");
            var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
            if(nowTime>=endDateM){ /*活动结束*/
                LMActivity.showModal({
                    id: 'bg_game_over',
                    onDismissListener: function () {
                        LMEPG.Intent.back();
                    }
                });
            }
        },
        onBack410092: function () {
            try {
                HybirdCallBackInterface.setCallFunction(function (param) {
                    LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                    if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                        w.onBack();
                    }
                });
            } catch (e) {
                LMEPG.UI.logPanel.show("e");
            }
        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_back':  //返回按钮
/*
                    if (RenderParam.fromLaunch == 1) { // 卓影平台退出局方大厅
                        LMEPG.Log.error("exitIptvApp:" + RenderParam.exitIptvApp);
                        Utility.setValueByName("exitIptvApp");
                    } else { // 正常返回逻辑
                        LMEPG.Intent.back('IPTVPortal');
                    }
 */
                    outBack();
                    break;
                case 'btn_winner_list':
                    InterFaceEvent.startPluginGame("com.runmo.mrone",10,"472")
                    break;
                case 'btn_exchange_prize':
                    InterFaceEvent.startPluginGame("com.runmo.mrone",6,"472")
                    break;
                case 'btn_activity_rule':
                    InterFaceEvent.startPluginGame("com.runmo.mrone",9,"472")
                    break;
                case 'btn_start':
                    LMEPG.UI.showWaitingDialog()
                    LMEPG.ajax.postAPI('Notify/getGoldCoinData', {}, function (rsp) {
                        LMEPG.UI.dismissWaitingDialog()
                        if (rsp.result === 0 ) {
                            if(rsp.goldData.data.wangCards > 0){
                                InterFaceEvent.startPluginGame("com.runmo.mrone",10,"472")
                            }else{
                                var objCurrent = LMActivity.Router.getCurrentPage();
                                var jumpObj = LMEPG.Intent.createIntent('orderHome');
                                jumpObj.setParam("userId", RenderParam.userId);
                                jumpObj.setParam("type", 2);//订购类型 1 包月订购，2 充值乐卡
                                LMEPG.Intent.jump(jumpObj,objCurrent);
                            }
                        } else {
                            LMEPG.UI.showToast('数据请求失败');
                        }
                    })
                    break;
            }
        }
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_exchange_prize',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusDown: 'btn_start',
            nextFocusRight: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusDown: 'btn_activity_rule',
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            click: Activity.eventHandler
        },{
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusDown: 'btn_start',
            nextFocusLeft:'btn_activity_rule',
            nextFocusUp: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: Activity.eventHandler
        }, {
            id: 'btn_start',
            name: '开始游戏',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusRight: 'btn_activity_rule',
            nextFocusLeft: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            click: Activity.eventHandler
        }
    ];

    w.Activity = Activity;
    w.onBack = function () {
        outBack();
    }
})(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['460092', "410092",'220094','220095'];


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
/**
 * 退出，返回
 */
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}
