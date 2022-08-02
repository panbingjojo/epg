/**
 * 第三方集成处理：例如未来电视NewTV广告
 * @author Songhui 2019-8-26 Modified RenJiaFen 2020-7-27
 */
var ThirdParty = {

    /**
     * 显示未来TV集成广告
     * @param completedCallback 显示完成后的回调，在此继续做其它操作
     */
    getAndShowWeilaiTVAds: function (completedCallback) {
        if (isRunOnPC) { //保护兼容，在PC浏览器上可以正常继续调试
            LMEPG.call(completedCallback);
        } else { //向Android端获取广告信息再来展示
            // 展示开屏广告
            LMAndroid.JSCallAndroid.doTaskWeilaiTV(JSON.stringify({
                    taskType: 1000, //任务类型（1000-获取广告，2000-上报广告日志 2001-上报用户行为日志）
                    taskInfo: {
                        ad_type: "open"
                    }
                }), function (jsonFromAndroid) {
                    try {
                        console.log("render3rdPartyUIFirst-->jsonFromAndroid: ", jsonFromAndroid);
                        var result = JSON.parse(jsonFromAndroid);
                        if (result.status == 1 && LMEPG.Func.isObject(result.adspaces)
                            && LMEPG.Func.isArray(result.adspaces.open) && result.adspaces.open.length > 0) { //ad_sdk获取广告信息成功
                            ThirdParty.__renderWeilaiTVAdImagesUI(result.adspaces.open, completedCallback);
                        } else {
                            console.log("render3rdPartyUIFirst-->failed: judge condition is not satisfied!");
                            LMEPG.Log.warn("render3rdPartyUIFirst-->failed: judge condition is not satisfied!");
                            LMEPG.call(completedCallback);
                        }
                    } catch (e) {
                        LMEPG.Log.error("render3rdPartyUIFirst-->exception: " + e.toLocaleString());
                        LMEPG.call(completedCallback);
                    }
                }
            );
        }
    },

    /**
     * 展示广告图片。adMaterialsArray[{"file_path":"http://image.adott.ottcn.com/images/icntvad/201902/1549177146_0c0144113ecc1f478a835051c71bbd33.jpeg","event_content":"","event_type":"null","file_inject":"public","file_md5":"92755305e75edd0052acc5fc69bcb9e5","file_name":"皮皮搞笑开屏广告.jpg","name":"皮皮搞笑app-开屏","file_source":"network","id":"549","type":"image","file_size":295475,"play_time":10}]
     */
    __renderWeilaiTVAdImagesUI: function (adspacesAny, completedCallback) {
        if (!LMEPG.Func.isArray(adspacesAny) || adspacesAny.length === 0) {
            LMEPG.call(completedCallback);
            return;
        }

        var adspaces_0 = adspacesAny[0];
        var adMaterialsArray = adspaces_0.materials;
        if (LMEPG.Func.isArray(adMaterialsArray) && adMaterialsArray.length > 0) {
            var totalShowTimeInSec = 0;
            var validAdMaterials = [];
            for (var i = 0, len = adMaterialsArray.length; i < len; i++) {
                var item = adMaterialsArray[i];
                if (LMEPG.Func.isObject(item) && !isNaN(parseInt(item.play_time))) {
                    totalShowTimeInSec += parseInt(item.play_time);
                    validAdMaterials.push(item);
                }
            }

            var showingADIndex = 0; //正在显示第几张广告
            var showingADTimes = 1; //正在显示广告已耗时长（一开始就显示，然后再延迟1s定时，故初始为1s）
            var countdown = totalShowTimeInSec; //显示总倒计时长(s)

            function __show_ad_with_time() {
                G("ad_showTime").innerHTML = countdown + "";
                if (showingADIndex < validAdMaterials.length) G("ad_image").src = validAdMaterials[showingADIndex].file_path;
            }

            function __report_showing_ad_log() {
                var showingMaterial = showingADIndex < validAdMaterials.length ? validAdMaterials[showingADIndex] : null;
                if (is_exist(showingMaterial)) {
                    LMAndroid.JSCallAndroid.doTaskWeilaiTV(JSON.stringify({
                        taskType: 2000, //任务类型（1000-获取广告，2000-上报广告日志 2001-上报用户行为日志）
                        taskInfo: {
                            mid: adspaces_0.mid,
                            aid: adspaces_0.aid,
                            mtid: showingMaterial.id,
                            seriesID: "",
                            programID: "",
                            location: "",
                            extend: ""
                        }
                    }));
                }
            }

            function __fade_in_out(offsetAlpha, completedCallback) {
                var curAlpha = offsetAlpha > 0 ? 1 : 0;
                var fadeOutTimer = setInterval(function () {
                    curAlpha += offsetAlpha;
                    G("ad_container_div").style.opacity = curAlpha;
                    if ((offsetAlpha < 0 && curAlpha <= 0) || (offsetAlpha > 0 && curAlpha >= 1)) {
                        clearInterval(fadeOutTimer);
                        setTimeout(function () { //保证淡出效果
                            LMEPG.call(completedCallback);
                        }, 200);
                    }
                }, 200);
            }

            Show("ad_container_div");
            __show_ad_with_time();
            __report_showing_ad_log();
            var countdownTimer = setInterval(function () {
                countdown--;
                showingADTimes++;
                if (countdown > 0) {
                    __show_ad_with_time();
                    if (showingADTimes >= validAdMaterials[showingADIndex].play_time) {
                        // 第N张广告图显示时长完毕
                        showingADIndex++;//即将切换下一张
                        showingADTimes = 0;//即将重新记录下一张已耗时长（再次切换初始为0s开始）
                        __report_showing_ad_log();//上报即将切换下一张广告的日志
                    }
                } else {
                    window.clearInterval(countdownTimer);
                    __fade_in_out(-0.01, function () {
                        Hide("ad_container_div");
                        LMEPG.call(completedCallback);
                    });
                }
            }, 1000);

        } else {
            LMEPG.call(completedCallback);
            LMEPG.Log.error("__renderWeilaiTVAdImagesUI::no ad-open!");
        }
    },

    /**
     * 用于显示调试广告展示数据，debug观看作用。
     */
    showTestDataForDebugUse: function (completedCallback) {
        this.__renderWeilaiTVAdImagesUI(null/*this.__testAdData.adspaces.open*/, completedCallback);
    },

    // TODO Test AD info....
    __testAdData: {
        "adspaces": {
            "open": [
                {
                    "ext": "",
                    "pos": "",
                    "materials": [
                        {
                            "file_path": "http://image.adott.ottcn.com/images/icntvad/201902/1549177146_0c0144113ecc1f478a835051c71bbd33.jpeg",
                            "event_content": "",
                            "event_type": "null",
                            "file_inject": "public",
                            "file_md5": "92755305e75edd0052acc5fc69bcb9e5",
                            "file_name": "皮皮搞笑开屏广告.jpg",
                            "name": "皮皮搞笑app-开屏",
                            "file_source": "network",
                            "id": "549",
                            "type": "image",
                            "file_size": 295475,
                            "play_time": 10
                        },
                        {
                            "file_path": "http://image.adott.ottcn.com/images/icntvad/201801/1517392876_ca3f2805927fc342c541da15752a7b7b.jpeg",
                            "event_content": "",
                            "event_type": "null",
                            "file_inject": "public",
                            "file_md5": "1ba76f5b61d0d2b74ea2555568dcb6a5",
                            "file_name": "1920x1080开屏.jpg",
                            "name": "春晚快手-开屏",
                            "file_source": "network",
                            "id": "179",
                            "type": "image",
                            "file_size": 486117,
                            "play_time": 5
                        }
                    ],
                    "mid": 549,
                    "aid": "25"
                }
            ]
        },
        "status": 1
    }
};

LMSplashController.beforeStart = function(callbackFunc){
    if (isRunOnPC) {
        // PC浏览器调试
        ThirdParty.showTestDataForDebugUse(callbackFunc);
    } else {
        // 向APK获取显示
        ThirdParty.getAndShowWeilaiTVAds(callbackFunc);
    }
}