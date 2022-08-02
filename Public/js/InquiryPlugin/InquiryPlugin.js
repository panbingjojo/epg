var CARRIER_ID_HENAN = '410092';             // 河南电信
var CARRIER_ID_CHINA_UNICOM = '000051';      // 中国联通--食乐汇
var CARRIER_ID_QS_CUBE = '000051';           // 中国联通--启生魔方
var CARRIER_ID_JILIN_TELECOM = '220095';     // 吉林广电--电信
var CARRIER_ID_JILIN_UNICOM = '220094';      // 吉林广电--联通
var CARRIER_ID_JILIN_CUBE = '220094';        // 吉林广电--健康魔方
var CARRIER_ID_XINJIANG = '650092';          // 新疆电信
var CARRIER_ID_XINJIANG_HOT_LINE = '651092'; // 新疆电信--民生热线
var CARRIER_ID_QINGHAI = '630092';           // 青海电信
var CARRIER_ID_SHANDONG = '370092';          // 山东电信
var CARRIER_ID_GUIZHOU_TELECOM = '520092';   // 贵州电信
var CARRIER_ID_CHONGQING_TV = '500094';      // 重庆广电

var HENAN_PLUGIN_NAME = "39健康-视频问诊";

var NOT_SUPPORT_APK_TIPS = '机顶盒不支持此插件,请升级后再使用!';

var BUILD_INQUIRY_PARAMS_FAIL_TIPS = '生成问诊参数失败';

var START_DOWNLOAD_TIPS = '开始启动下载，请稍等...';

var START_INSTALL_TIPS = '正在下载安装，请稍等...';

var INSTALL_FINISH_TIPS = '安装完成！即将进入问诊...';

var SHOW_TOAST_LENGTH_5 = 5;

var SHOW_TOAST_LENGTH_1 = 1.5;

var INSTALL_STEP_TIME = 3 * 1000;            // 定时器校验插件是否安装完成。（如果需要）

var currentCarrier = get_carrier_id();

var pluginPackageName = RenderParam.PLUGIN_APP_NAME;

var downloadPluginUrl = RenderParam.appDownLoadUrl;

var LMPluginView = {}

var LMPluginModel = {

    /**
     * 构建传递问诊插件的参数信息
     * @param requestData 请求参数
     * @param callback    回调函数
     */
    buildInquiryParam: function (requestData, callback) {
        LMEPG.ajax.postAPI("Expert/buildInquiryParam", requestData, function (data) {
            LMEPG.call(callback, [data]);
        }, function (error) {
        });
    },

    /**
     * 查询当前插件服务器保存的最新版本号
     * @param requestData 请求参数
     * @param callback    回调函数
     */
    getLatestPluginVersion: function (requestData, callback) {
        LMEPG.ajax.postAPI("ApkPlugin/queryApkPluginVersion", requestData, function (data) {
            LMEPG.call(callback, [data]);
        }, function (error) {
        });
    },

    /**
     * 查询当前插件服务器保存的最新版本号
     * @param requestData 请求参数
     * @param callback    回调函数
     */
    saveInquiryParam: function (requestData, callback) {
        LMEPG.ajax.postAPI("Expert/saveInquiryParam", requestData, function (data) {
            LMEPG.call(callback, [data]);
        }, function (error) {
        });
    }

};

var EPGAppStoreInfo = {

    XINJIANG: {
        appName: "com.amt.appstore.tianyi",                                    // 商城包名
        className: "com.amt.appstore.tianyi.activity.InitActivity"             // 应用详情页
    },

    XINJIANG_HOT_LINE: {
        contentId: 428
    },

    QINGHAI: {
        appName: "com.amt.appstore"                                            // 商城包名
    },

    GUIZHOU_TELECOM: {
        appName: "com.dcyx.applicationstore",                                  // 商城包名
        className: "com.dcyx.applicationstore.activity.ApplicationActivity"    // 应用详情页
    },

    SHANDONG: {
        actionName: "com.staryea.action.TripartiteApp",                        // 商城活动 -- 隐式跳转
        className: "com.dcyx.applicationstore.activity.ApplicationActivity"    // 应用详情页
    },

    QS_CUBE: { // 启生魔方跳转商城的应用名同中国联通食乐汇
        pluginVideoAppId: "jkmfcj1",
        pluginVideoContentId: "jkmfcj1",
    },

    CHINA_UNICOM: {
        MAX_DELAY_DURATION: 1000,

        appName: "com.huawei.dsm",                                      // 商城包名
        className: "com.huawei.dsm.activity.AppDetailActivity",         // 应用详情页
        classNameEx: "com.huawei.dsm.activity.HomeActivity",            // 应用商城主页，通过主页进行跳转

        // 中国联通EPG项目 ，appId以及contentId使用的是同一个参数，就是appId
        // 视频问诊插件在商城中的参数
        pluginVideoAppId: "sjjkcj",
        pluginVideoContentId: "sjjkcj"
    },

    getStoreInfoByCarrierId: function () {
        var storeInfo;
        switch (currentCarrier) {
            case CARRIER_ID_CHINA_UNICOM:
                storeInfo = EPGAppStoreInfo.CHINA_UNICOM;
                break;
            case CARRIER_ID_QS_CUBE:
                storeInfo = EPGAppStoreInfo.QS_CUBE;
                break;
            case CARRIER_ID_XINJIANG:
            case CARRIER_ID_XINJIANG_HOT_LINE:
                storeInfo = EPGAppStoreInfo.XINJIANG;
                break;
            case CARRIER_ID_QINGHAI:
                storeInfo = EPGAppStoreInfo.QINGHAI;
                break;
            case CARRIER_ID_GUIZHOU_TELECOM:
                storeInfo = EPGAppStoreInfo.GUIZHOU_TELECOM;
                break;
        }
        return storeInfo;
    },

    getStoreIntentByCarrierId: function () {
        var intent = null;
        switch (currentCarrier) {
            case CARRIER_ID_CHINA_UNICOM:
                intent = EPGAppStoreInfo.getIntentForChinaUnicom(EPGAppStoreInfo.CHINA_UNICOM.pluginVideoAppId, EPGAppStoreInfo.CHINA_UNICOM.pluginVideoContentId);
                break;
            case CARRIER_ID_QS_CUBE:
                intent = EPGAppStoreInfo.getIntentForChinaUnicom(EPGAppStoreInfo.QS_CUBE.pluginVideoAppId, EPGAppStoreInfo.QS_CUBE.pluginVideoContentId);
                break;
            case CARRIER_ID_XINJIANG_HOT_LINE:
                intent = EPGAppStoreInfo.getIntentForXINJIANGHotLine(EPGAppStoreInfo.XINJIANG_HOT_LINE.contentId);
                break;
            case CARRIER_ID_QINGHAI:
                intent = EPGAppStoreInfo.getIntentForQINHAI();
                break;
            case CARRIER_ID_GUIZHOU_TELECOM:
                intent = EPGAppStoreInfo.getIntentForGUIZHOUTelecom();
                break;
            case CARRIER_ID_SHANDONG:
                intent = EPGAppStoreInfo.getIntentForSHANDONG();
                break;
        }
        return intent;
    },

    getIntentForChinaUnicom: function(pluginId,contentId){
        // 跳转到商城进行安装
        var intentMessage = {};
        intentMessage.intentType = 0;
        intentMessage.appName = EPGAppStoreInfo.CHINA_UNICOM.appName;
        intentMessage.className = EPGAppStoreInfo.CHINA_UNICOM.classNameEx;

        var data = {
            "showType": 2,
            "isFromLauncher": true,
            "appId": pluginId,
            "contentId": contentId
        };

        var param1 = {
            "name": "data",
            "value": data
        };

        intentMessage.extra = [
            param1
        ];

        return JSON.stringify(intentMessage);
    },

    getIntentForXINJIANGHotLine:function (contentId) {
        var intentMsg = {
            appName: EPGAppStoreInfo.XINJIANG.appName,
            className: EPGAppStoreInfo.XINJIANG.className,
            extra: [
                {
                    name: "extraKey",
                    value: "abc=" + RenderParam.accountId + "&jumpId=8&contentId=" + contentId
                }
            ]
        };
        return JSON.stringify(intentMsg);
    },

    getIntentForQINHAI: function () {
        var appName = "com.amt.appstore"; // 商城包名，根据具体版本而定，不一定是 “com.amt.appstore”
        var extraString = "jumpId=8&appPkg=" + "com.longmaster.iptv.healthplugin.video.qinghaidx" + "&appId=" + "408";
        return '{"intentType":1,' +
            '"appName":"' + appName + '",' +
            '"action":"' + "com.amt.appstore.action.LAUNCHER" + '",' +
            '"extra":[{"name":"extraKey","value":"' + extraString + '"}]}';
    },

    getIntentForGUIZHOUTelecom:function () {
        var intentMsg = {
            intentType: 0,
            appName: EPGAppStoreInfo.GUIZHOU_TELECOM.appName,
            className: EPGAppStoreInfo.GUIZHOU_TELECOM.className,
            extra: [
                {
                    name: "packageName",
                    value: pluginPackageName
                }
            ]
        };
        return JSON.stringify(intentMsg);
    },

    getIntentForSHANDONG: function () {
        var intentMsg = {
            "intentType": 1,
            "action": EPGAppStoreInfo.SHANDONG.actionName,
            "extra": [
                {
                    "name": "TripartiteAppPackageName",
                    "value": pluginPackageName
                }
            ]
        };
        return JSON.stringify(intentMsg);
    }
}

var LMPluginController = {

    INQUIRY_EXPERT_FLAG: '10003',

    inquiryDoctorInfo: null,          // 暂存医生信息

    inquiryParam: null,               // 暂存问诊信息 -- 通过后端接口获取

    currentCarrier: '',               // 当前地区编码

    isNeedInstall: true,              // 插件是否需要安装

    installTime: 0,                   // 安装时间计时

    installTimer: null,               // 安装插件计时器

    installWaitTime: 60,              // 安装等待时长

    /**
     * 启动插件问诊
     * @param moduleInfo 当前启动插件的模块
     * @param doctorInfo 问诊医生的相关信息
     * @param memberInfo 问诊人的成员信息
     */
    startInquiry: function (moduleInfo, doctorInfo, memberInfo) {
        if (LMPluginUtils.isSupportApk()) {
            // 保存参数
            LMPluginController.inquiryDoctorInfo = doctorInfo;
            var inquiryParams;
            if (moduleInfo.moduleId == LMPluginController.INQUIRY_EXPERT_FLAG) {
                inquiryParams = LMPluginController.getExpertInquiryParams(moduleInfo, doctorInfo, memberInfo);
            } else {
                inquiryParams = LMPluginController.getDoctorInquiryParams(moduleInfo, doctorInfo, memberInfo);
            }
            // 构建问诊参数
            LMPluginModel.buildInquiryParam(inquiryParams, LMPluginController.buildInquiryParamSuccess);
        } else {
            LMEPG.UI.showToast(NOT_SUPPORT_APK_TIPS);
        }
    },

    /**
     * 构造医生问诊参数
     * @param moduleInfo 当前启动插件的模块
     * @param doctorInfo 问诊医生的相关信息
     * @param memberInfo 问诊人的成员信息
     */
    getDoctorInquiryParams: function (moduleInfo, doctorInfo, memberInfo) {
        return {
            "account_id": doctorInfo.account_id,
            "appointment_id": doctorInfo.appointment_id,
            "begin_dt": doctorInfo.begin_dt,
            "clinic_hospital_id": doctorInfo.clinic_hospital_id,
            "clinic_id": doctorInfo.clinic_id,
            "clinic_is_pay": doctorInfo.clinic_is_pay,
            "clinic_is_refund": doctorInfo.clinic_is_refund,
            "clinic_serial": doctorInfo.clinic_serial,
            "clinic_state": doctorInfo.clinic_state,
            "department_name": doctorInfo.department_name,
            "doctor_avatar": doctorInfo.doctor_avatar,
            "doctor_introduce": doctorInfo.doctor_introduce,
            "doctor_level": doctorInfo.doctor_level,
            "doctor_name": doctorInfo.doctor_name,
            "doctor_skill": doctorInfo.doctor_skill,
            "doctor_user_id": doctorInfo.doctor_user_id,
            "end_dt": doctorInfo.end_dt,
            "hospital_abbr": doctorInfo.hospital_abbr,
            "hospital_name": doctorInfo.hospital_name,
            "insert_dt": doctorInfo.insert_dt,
            "medical_url": doctorInfo.medical_url,
            "patient_name": doctorInfo.patient_name,
            "pay_dt": doctorInfo.pay_dt,
            "pay_link_dt": doctorInfo.pay_link_dt,
            "pay_value": doctorInfo.pay_value,
            "phone_num": doctorInfo.phone_num,
            "prepare_state": doctorInfo.prepare_state,
            "realImageUrl": encodeURIComponent(Expert.createDoctorUrl(RenderParam.expertUrl, doctorInfo.doctor_user_id, doctorInfo.doctor_avatar, RenderParam.carrierId)),
            "user_id": doctorInfo.user_id,
            "module_id": moduleInfo.moduleId,
            "module_name": moduleInfo.moduleName,
            "entry_type": moduleInfo.entryType,
            "is_user_phone_inquiry": typeof moduleInfo.isUserPhoneInquiry == 'undefined' ? false : moduleInfo.isUserPhoneInquiry,

        };
    },

    /**
     * 构造大专家问诊参数
     * @param moduleInfo 当前启动插件的模块
     * @param doctorInfo 问诊医生的相关信息
     * @param memberInfo 问诊人的成员信息
     */
    getExpertInquiryParams: function (moduleInfo, doctorInfo, memberInfo) {
        return {
            "account_id": doctorInfo.account_id,
            "appointment_id": doctorInfo.appointment_id,
            "begin_dt": doctorInfo.begin_dt,
            "clinic_hospital_id": doctorInfo.clinic_hospital_id,
            "clinic_id": doctorInfo.clinic_id,
            "clinic_is_pay": doctorInfo.clinic_is_pay,
            "clinic_is_refund": doctorInfo.clinic_is_refund,
            "clinic_serial": doctorInfo.clinic_serial,
            "clinic_state": doctorInfo.clinic_state,
            "department_name": doctorInfo.department_name,
            "doctor_avatar": doctorInfo.doctor_avatar,
            "doctor_introduce": doctorInfo.doctor_introduce,
            "doctor_level": doctorInfo.doctor_level,
            "doctor_name": doctorInfo.doctor_name,
            "doctor_skill": doctorInfo.doctor_skill,
            "doctor_user_id": doctorInfo.doctor_user_id,
            "end_dt": doctorInfo.end_dt,
            "hospital_abbr": doctorInfo.hospital_abbr,
            "hospital_name": doctorInfo.hospital_name,
            "insert_dt": doctorInfo.insert_dt,
            "medical_url": doctorInfo.medical_url,
            "patient_name": doctorInfo.patient_name,
            "pay_dt": doctorInfo.pay_dt,
            "pay_link_dt": doctorInfo.pay_link_dt,
            "pay_value": doctorInfo.pay_value,
            "phone_num": doctorInfo.phone_num,
            "prepare_state": doctorInfo.prepare_state,
            "realImageUrl": encodeURIComponent(Expert.createDoctorUrl(RenderParam.expertUrl, doctorInfo.doctor_user_id, doctorInfo.doctor_avatar, RenderParam.carrierId)),
            "user_id": doctorInfo.user_id,
            "module_id": moduleInfo.moduleId,
            "module_name": moduleInfo.moduleName,
            "entry_type": moduleInfo.entryType,
            "is_user_phone_inquiry": typeof moduleInfo.isUserPhoneInquiry == 'undefined' ? false : moduleInfo.isUserPhoneInquiry,
        };
    },

    buildInquiryParamSuccess: function (inquiryData) {
        if (typeof (inquiryData.param_info) !== "undefined" && inquiryData.param_info != null && inquiryData.param_info != "") {
            LMPluginController.inquiryParam = inquiryData.param_info;

            if (LMPluginUtils.isAppInstall(pluginPackageName)) { // 当前盒子已经安装插件
                var needCheckVersionCarrier = [CARRIER_ID_CHINA_UNICOM, CARRIER_ID_QS_CUBE];
                if (needCheckVersionCarrier.indexOf(currentCarrier) > -1) { // 部分地区需要检测当前版本是否最新
                    var requestData = {
                        appName: pluginPackageName,
                        currentVersion: LMEPG.ApkPlugin.getAppVersion(pluginPackageName)
                    }
                    LMPluginModel.getLatestPluginVersion(requestData, LMPluginController.getLatestVersionSuccess);
                } else {
                    // 启动插件之前保存问诊参数到CWS
                    LMPluginController.saveInquiryParam(false);
                }
            } else { // 当前版本未安装，需要安装插件
                // 安装插件之前保存问诊参数到CWS
                LMPluginController.saveInquiryParam(true);
            }
        } else {
            LMEPG.UI.showToast(BUILD_INQUIRY_PARAMS_FAIL_TIPS);
        }
    },

    getLatestVersionSuccess: function (respData) {
        var isNeedUpdate;
        var versionObj = respData.data;
        if (respData.result != 0 || !versionObj) { // 获取不到服务器保存信息
            isNeedUpdate = true;
        } else {
            var currentVersion = respData.last_version;
            var latestVersion = versionObj.lastest_version;
            if (!currentVersion) {
                currentVersion = LMEPG.ApkPlugin.getAppVersion(pluginPackageName);
            }
            isNeedUpdate = latestVersion > currentVersion;
        }
        if (isNeedUpdate) {
            LMPluginController.saveInquiryParam(true);
        } else {
            LMPluginController.launchPlugin();
        }
    },

    saveInquiryParam: function (isNeedInstall) {
        // 保存参数，确定问诊参数之后的行为逻辑
        LMPluginController.isNeedInstall = isNeedInstall;
        var MACAddr = currentCarrier == CARRIER_ID_HENAN ? get_user_account_id() : LMEPG.STBUtil.getSTBMac();
        LMEPG.Log.info("saveInquiryParam ---> macAddr： " + MACAddr);
        MACAddr.replace(":", "");
        MACAddr.replace("-", "");
        var requestData = {
            'mac_addr': MACAddr,
            'param_info': LMPluginController.inquiryParam
        }
        LMPluginModel.saveInquiryParam(requestData, LMPluginController.saveInquiryParamSuccess);
    },

    saveInquiryParamSuccess: function (respData) {
        // 上传成功，失败都下载插件
        if (respData == null || respData.result != 0) {
            LMEPG.Log.error("saveInquiryParam 保存问诊参数到服务器失败!");
        }
        if (LMPluginController.isNeedInstall) {
            LMPluginController.installPlugin();
        } else {
            LMPluginController.launchPlugin();
        }
    },

    installPlugin: function () {
        var appStoreInstallCarrier = [CARRIER_ID_CHINA_UNICOM, CARRIER_ID_QS_CUBE, CARRIER_ID_SHANDONG,
            CARRIER_ID_QINGHAI, CARRIER_ID_XINJIANG, CARRIER_ID_XINJIANG_HOT_LINE];
        if (appStoreInstallCarrier.indexOf(currentCarrier) > -1) {
            if(LMPluginController.isInstallByStore()) {
                LMPluginController.installByStore();
            }else {
                LMEPG.UI.showToast(NOT_SUPPORT_APK_TIPS);
            }
        } else {
            LMEPG.UI.showToast(START_DOWNLOAD_TIPS, SHOW_TOAST_LENGTH_5);
            if (LMPluginController.isInstallBySilence()) {
                LMPluginController.installBySilence();
            }
        }
    },

    isInstallByStore: function () {
        var isInstall;
        if (currentCarrier == CARRIER_ID_SHANDONG) {
            isInstall = true; // 山东电信默认安装
        } else {
            var storeInfo = EPGAppStoreInfo.getStoreInfoByCarrierId();
            isInstall = LMEPG.ApkPlugin.isAppInstall(storeInfo.appName);
        }
        return isInstall;
    },

    isInstallBySilence: function () {
        var isSilenceInstall = false;
        if (currentCarrier == CARRIER_ID_CHONGQING_TV) {
            isSilenceInstall = true
        } else if (currentCarrier == CARRIER_ID_JILIN_UNICOM
            || currentCarrier == CARRIER_ID_JILIN_TELECOM
            || currentCarrier == CARRIER_ID_JILIN_CUBE) {
            var silenceInstallModels = ['EC6109_pub_jljlt',
                'EC6109_pub_jljdx',
                'EC6108V9_pub_jljlt',
                'EC6108V9_pub_jljdx',
                'EC6108V9A_pub_jljlt',
                'EC6108V9A_pub_jljdx',
                'EC6108V9E_pub_jljlt',
                'EC6108V9E_pub_jljdx',
                'EC6108V9U_pub_jljlt',
                'EC6108V9U_pub_jljdx',
                'EC6108V9I_pub_jljlt',
                'EC6108V9I_pub_jljdx',];
            var stbModel = LMEPG.STBUtil.getSTBModel();
            if (silenceInstallModels.indexOf(stbModel) > -1) {
                isSilenceInstall = true;
            }
        }
        return isSilenceInstall;
    },

    installBySilence: function () {
        LMPluginController.installTime = 0;
        LMEPG.ApkPlugin.installApp(downloadPluginUrl);
        // 判断应用是否安装完成
        LMPluginController.installTimer = setInterval(function () {
            if (!LMEPG.ApkPlugin.isAppInstall(pluginPackageName)) {
                LMEPG.UI.showToast(START_INSTALL_TIPS, SHOW_TOAST_LENGTH_5);
                if (LMPluginController.installTime < LMPluginController.installWaitTime) {
                    LMPluginController.installTime++;
                } else {
                    clearInterval(LMPluginController.installTimer);
                }
            }else {
                clearInterval(LMPluginController.installTimer);
                LMEPG.UI.showToast(INSTALL_FINISH_TIPS, SHOW_TOAST_LENGTH_1, function () {

                });
            }
        }, INSTALL_STEP_TIME);
    },

    installByStore: function () {
        var intent = EPGAppStoreInfo.getStoreIntentByCarrierId();
        //启动商城并跳转到插件下载页
        LMEPG.ApkPlugin.startAppByIntent(intent);
    },

    launchPlugin: function () {
        if(currentCarrier == CARRIER_ID_HENAN) {
            HybirdCallBackInterface.appOpenOrDownload(downloadPluginUrl, pluginPackageName, HENAN_PLUGIN_NAME);
        }else {
            LMEPG.ApkPlugin.startAppByName(pluginPackageName);
        }
    },
};

/** 插件使用的工具包 */
var LMPluginUtils = {

    /**
     * 判断盒子是否支持APK插件
     * @return {boolean} true-支持。false-不支持
     */
    isSupportApk: function () {
        var isSupportAPK;
        if (currentCarrier == CARRIER_ID_HENAN) {
            isSupportAPK = typeof HybirdCallBackInterface != "undefined";
        } else {
            isSupportAPK = typeof STBAppManager !== "undefined" && STBAppManager != null;
        }
        return isSupportAPK;
    },

    /**
     * 判断插件APK是否安装
     * @param appName [string] APK应用程序唯一包名
     * @returns {*|undefined} 若不支持，返回undefined！
     */
    isAppInstall: function (appName) {
        var isInstall;
        if (currentCarrier == CARRIER_ID_HENAN) {
            isInstall = true;
        } else {
            isInstall = typeof STBAppManager !== "undefined" && STBAppManager.isAppInstalled(appName);
        }
        return isInstall;
    },

    /**
     * 通过包名启动app插件
     * @param appName [string] APK应用程序唯一包名
     * @return {*|undefined} 若不支持，返回undefined！
     */
    startAppByName: function (appName) {
        return this.isSupportApk() ? STBAppManager.startAppByName(appName) : undefined;
    },

    /**
     * 通过Intent方式启动插件应用
     * @param intentMessage [object] 标准规范的启动APK程序所需参数
     * @return {*|undefined} 若不支持，返回undefined！
     */
    startAppByIntent: function (intentMessage) {
        return this.isSupportApk() ? STBAppManager.startAppByIntent(intentMessage) : undefined;
    },

    /**
     * 通过包名重启app
     * @param appName [string] APK应用程序唯一包名
     * @return {*|undefined} 若不支持，返回undefined！
     */
    resetAppByName: function (appName) {
        return this.isSupportApk() ? STBAppManager.restartAppByName(appName) : undefined;
    },

    /**
     * 提供APK下载地址下载并自动安装
     * @param appDownloadUrl [string] 下载APK程序的URL地址
     * @returns {*|undefined} 若不支持，返回undefined！
     */
    installApp: function (appDownloadUrl) {
        return this.isSupportApk() ? STBAppManager.installApp(appDownloadUrl) : undefined;
    },

    /**
     * 查询 Android 系统已安装应用的版本号
     * @param appName [string] APK应用程序唯一包名
     * @returns {*|string} 返回查询到系统已安装该APP的版本号。若不支持，返回空字符串！
     */
    getAppVersion: function (appName) {
        return this.isSupportApk() ? STBAppManager.getAppVersion(appName) : "";
    }

}