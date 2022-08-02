/**
 * 在欢迎页上启动跳转局方计费页
 */

var SplashPay = {

    /**
     * 跳转 -- 订购页 -- 回首页
     * @param remark        订购来源（标示）
     */
    jumpBuyVipReturnHome: function () {
        var objHome = LMEPG.Intent.createIntent('home');

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('remark', "splash");

        LMEPG.Intent.jump(objOrderHome, objHome);
    },

    /**
     * 跳转 -- 订购页 -- 回专辑
     * @param remark 订购来源（标示）
     * @param albumName 专辑别名
     */
    jumpBuyVipReturnAlbum: function (albumName) {
        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam("userId", RenderParam.userId);
        objAlbum.setParam("albumName", albumName);
        objAlbum.setParam("inner", 0);

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('remark', "splash");
        LMEPG.Intent.jump(objOrderHome, objAlbum);
    },

    /**
     * 跳转 -- 订购页 -- 回活动
     * @param remark 订购来源（标示）
     * @param activityName 活动别名
     */
    jumpBuyVipReturnActivity: function (activityName) {
        var objActivity = LMEPG.Intent.createIntent("activity");
        objActivity.setParam("userId", RenderParam.userId);
        objActivity.setParam("activityName", activityName);
        objActivity.setParam("inner", 0);

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('remark', "splash");

        LMEPG.Intent.jump(objOrderHome, objActivity);
    },

    jumpSplashPay: function (userFromType, subId) {
        if (Page.isJumpHome(userFromType)) {
            //进入主页
            SplashPay.jumpBuyVipReturnHome();
            return;
        }

        if (userFromType != 0 && (subId == "undefined" || subId == "")) {
            //进入主页
            SplashPay.jumpBuyVipReturnHome();
            return;
        }

        switch (parseInt(userFromType)) {
            case 0:
                //进入主页
                SplashPay.jumpBuyVipReturnHome();
                break;
            case 1:
                //进入专辑
                SplashPay.jumpBuyVipReturnAlbum(subId);
                break;
            case 2:
                SplashPay.jumpBuyVipReturnActivity(subId);
                break;
            default:
                //进入主页
                SplashPay.jumpBuyVipReturnHome();
                break;
        }


    },

    // 判断是否要进行跳转订购
    checkGoPay: function (userFromType) {
        if(RenderParam.carrierId == '220094'){ // 吉林广电不弹出
            return false;
        }
        // 先判断开关条件
        var payMethod = RenderParam.payMethod;
        LMEPG.Log.info("checkGoPay---> payMethod = " + JSON.stringify(payMethod));
        if (payMethod && payMethod.result != 0) {
            LMEPG.Log.info("checkGoPay---> payMethod.result = " + payMethod.result);
            return false;
        }

        if (!payMethod) return false;

        var item = payMethod.data.list[0];
        if (item) {
            // 转化率达到时（0--停止、1--弹出）
            if (item.reach_rate == 0) {
                LMEPG.Log.info("checkGoPay---> payMethod.reach_rate = " + item.reach_rate);
                return false;
            }
        } else {
            LMEPG.Log.info("checkGoPay---> payMethod.data.list is null!!");
            return false;
        }

        // 如果query接口返回数据不允许，则返回
        if (RenderParam.reportData == 0) {
            LMEPG.Log.info("checkGoPay---> reportData = " + RenderParam.reportData);
            return false;
        }

        var deltaTime = RenderParam.enterSplashTime - RenderParam.enterAppTime;
        var idleTime = item.idle_time;
        if (idleTime > deltaTime){
            LMEPG.Log.info("checkGoPay---> deltaTime = " + deltaTime);
            return false;
        }

        // 如果不是进去首页、专辑、活动3个模块，则不进行跳订购
        if (userFromType == 0 || userFromType == 1 || userFromType == 2) {
            LMEPG.Log.info("checkGoPay---> userFromType = " + userFromType);
            return true;
        }

        return false;
    }
};

