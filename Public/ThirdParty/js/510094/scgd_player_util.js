// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | 四川广电EPG播放器处理，相关接口实现方法。通常情况下勿随意改动！！！
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019-8-23 16:34
// +----------------------------------------------------------------------

(function (w) {

    var SCGDPlayUtil = function () {

        var isScreenDebug = false; //TODO 上线去掉屏显调试
        var DataType = {           //JS数据类型：用于内部解析具体参数使用
            STRING: "string",
            NUMBER: "number",
            BOOLEAN: "boolean",
        };

        var __printLog = function (funcName, msg, isLogOnScreen) {
            if (isScreenDebug) console.log("[SCGDPlayUtil]--->[" + funcName + "]--->" + msg);
            if (isScreenDebug && isLogOnScreen) LMEPG.UI.logPanel.show(msg, true, funcName + "-->");
            LMEPG.Log.info("[SCGDPlayUtil]--->[" + funcName + "]--->" + msg);
        };

        /**
         * 解析后台配置的视频信息到对象里，用于后面的业务操作。
         * @param playVideoIdConfigByLM 朗玛后台配置的视频配置串
         * @return {*}
         */
        var __getVideoConfigObj = function (playVideoIdConfigByLM) {
            __printLog("__getVideoConfigObj()", "视频配置信息：" + playVideoIdConfigByLM, true);
            if (!LMEPG.Func.isEmpty(playVideoIdConfigByLM)) {
                var strs = playVideoIdConfigByLM.split("|");//{productId}|{providerId}|{providerAssetId}|{huid}|{parentHUID}
                if (strs.length > 3) { //如果后台配置不规范，则拒绝后续操作！
                    return {
                        productId: strs[0],
                        providerId: strs[1],
                        providerAssetId: strs[2],
                    }
                }
            }
            return null;
        };

        /**
         * 获取四川广电机顶盒内置对象键值
         */
        var __getGlobalVar = function (key) {
            var value = undefined;
            // TODO GlobalVarManager.getItemValue(XXX)获取不到。使用GlobalVarManager.getItemStr替代！
            try {
                value = window.GlobalVarManager.getItemStr(key);
            } catch (e) {
                value = undefined;
                __printLog("__getGlobalVar()", "异常：" + e.toString(), true);
            }
            __printLog("__getGlobalVar()", " [" + key + ", " + value + "]", true);
            return value;
        };

        /**
         * 获取服务器接口ip+port
         */
        var __getApiServerUrl = function () {
            var ismpurl = __getGlobalVar("ISMPURL");
            __printLog("__getApiServerUrl()", "获取服务器接口地址ISMPURL：" + ismpurl, true);

            // TODO --->start 用于指定地市媒资服务器测试
            //ismpurl = "http://10.102.0.46:9500";//TODO （仁寿10.102.0.46:9500 | 成都10.102.0.47:9500）
            //__printLog("__getApiServerUrl()", "当前地使用的ISMPURL：" + ismpurl, true);
            // TODO end<--- 用于指定地市媒资服务器测试

            return ismpurl;
        };

        /**
         * 获取智能卡号
         */
        var __getSmartId = function () {
            var smartId = typeof (CAManager) === "object" ? CAManager.cardSerialNumber : "";
            __printLog("__getSmartId()", "获取机顶盒智能卡号：" + smartId, true);
            return smartId;
        };

        /**
         * 获取媒资详情。通过assetID请求媒资详情，得到data.playurl。
         *
         * @param assetId [string] 媒资id
         * @param successCallback [function] 成功回调（参数1：playurl，媒资详情里返回的data.playurl）
         * @param failCallback [function] 失败回调（参数1：描述信息）
         */
        var __getVideoAssetDetailBy = function (assetId, successCallback, failCallback) {
            var smartId = __getSmartId();
            if (LMEPG.Func.isEmpty(smartId)) {
                LMEPG.call(failCallback, ["未获取到机顶盒智能卡号"]);
                return;
            }

            var apiServerUrl = __getApiServerUrl();
            if (LMEPG.Func.isEmpty(apiServerUrl)) {
                LMEPG.call(failCallback, ["未获取到播放服务器地址"]);
                return;
            }

            // videoDetail-api:（http://ip:port/spis/asgapi/v1/rtres/1/{smart_card_id}/{assetId}/details）
            var detailUrl = apiServerUrl + "/spis/asgapi/v1/rtres/1/" + smartId + "/" + assetId + "/details";
            __printLog("getRealPlayUrl(" + assetId + ")", "获取媒资详情URL：" + detailUrl, true);
            LMEPG.ajax.post({
                url: detailUrl,
                requestType: "GET",
                success: function (xmlhttp, rsp) {
                    __printLog("__getVideoAssetDetailBy(" + assetId + ")", "获取媒资详情返回结果：" + JSON.stringify(rsp));
                    try {
                        if (rsp.errorCode === 0) {
                            LMEPG.call(successCallback, [rsp.data.playurl]);
                        } else {
                            LMEPG.call(failCallback, ["获取媒资详情失败：[" + rsp.errorCode + "," + rsp.errorMsg + "]"]);
                        }
                    } catch (e) {
                        LMEPG.call(failCallback, ["获取媒资详情结果解析异常：" + e.toString()]);
                    }
                },
                error: function (xmlhttp, rsp) {
                    LMEPG.call(failCallback, ["__getVideoAssetDetailBy(" + assetId + ")获取媒资详情出错！" + rsp]);
                },
            });
        };

        /**
         * 获取媒资播放地址url。通过媒资详情返回的playurl去请求，得到data.url。
         * @param playurl 媒资详情里的data.playurl
         * @param successCallback 成功回调
         *      callback[
         *          参数1->playurl请求结果data.url,
         *          参数2-playurl请求结果data.playurl，
         *          参数3-媒资详情数据对象data(即playurl请求得到的data对象)
         *      ]
         *      <pre>
         *      示例：
         *      successCallback(
         *          "/html/play.htm?home_id=112102011825&device_id=8510010615354730&entry_uid=1008791707&purchase_id=T764B195BE752CC9D15665454041&duration=59&application_uid=60010001&position=0&device_type=&entry_name=39%u5065%u5eb7-gylm134&assetID=RA378742_A1008791707&description=39%u5065%u5eb7-gylm134",
         *          "rtsp://10.80.232.13:554/;purchaseToken=;serverID=?AppPath=60010001&assetUID=3c20f09b&smartcard-id=8510010615354730&device-id=8510010615354730&home-id=112102011825&purchase-id=T764B195BE752CC9D15665454041&mediatime=0&streamtransportmode=ip&ipvodservicegroupid=102",
         *          {...}
         *      )
         *      </pre>
         * @param failCallback 失败回调（参数1：描述信息）
         */
        var __get_video_play_url = function (playurl, successCallback, failCallback) {
            // playurl示例：http://10.102.0.47:9500//spis/asgapi/v1/play/1/8510010615354730/sotv/339/0/0?pid=wailai&paid=190522120543603qs000&rtasset=1
            __printLog("__get_video_play_url", "获取媒资播放地址URL：" + playurl, true);
            LMEPG.ajax.post({
                url: playurl,
                requestType: "GET",
                success: function (xmlhttp, rsp) {
                    // rsp示例：{"errorCode":0,"errorMsg":"","data":{"entry_name":"39健康-gylm178","device_id":"8510010615354730","purchase_id":"TDCFAFAA91E0E6D5515681928541","description":"39健康-gylm178","device_type":"","asset_id":"RA374153_A1008784368","application_uid":"60010001","url":"/html/play.htm?home_id=112102011825&device_id=8510010615354730&entry_uid=1008784368&purchase_id=TDCFAFAA91E0E6D5515681928541&duration=79&application_uid=60010001&position=0&device_type=&entry_name=39%u5065%u5eb7-gylm178&assetID=RA374153_A1008784368&description=39%u5065%u5eb7-gylm178","token":"TDCFAFAA91E0E6D5515681928541","duration":"79","entry_uid":"1008784368","home_id":"112102011825","position":"0","playurl":"rtsp://10.80.232.17:554/;purchaseToken=;serverID=?AppPath=60010001&assetUID=3c20d3f0&smartcard-id=8510010615354730&device-id=8510010615354730&home-id=112102011825&purchase-id=TDCFAFAA91E0E6D5515681928541&mediatime=0&streamtransportmode=ip&ipvodservicegroupid=102"},"errorDetail":"","pageInfo":null}
                    __printLog("__get_video_play_url(" + playurl + ")", "获取媒资播放地址返回结果：" + JSON.stringify(rsp));
                    try {
                        if (rsp.errorCode === 0) {
                            LMEPG.call(successCallback, [rsp.data.url, rsp.data.playurl, rsp.data]);
                        } else {
                            LMEPG.call(failCallback, ["获取媒资播放地址失败：[" + rsp.errorCode + "," + rsp.errorMsg + "]"]);
                        }
                    } catch (e) {
                        LMEPG.call(failCallback, ["获取媒资播放地址返回结果解析异常：" + e.toString()]);
                    }
                },
                error: function (xmlhttp, rsp) {
                    LMEPG.call(failCallback, ["获取媒资播放地址URL出错！" + rsp]);
                },
            });
        };

        /**
         * 通过“产品id，提供商id，提供商定义的媒资id”获取系列播放串信息。
         * @param videoConfObj 注入的视频配置信息json对象 obj={productId:"",providerId:"",providerAssetId:""}
         * @param successCallback 获取播放串成功后的回调
         *          （   参数1：url-相对串，用于跳转到局方播放器页面，
         *               参数2：playurl-绝对MediaPlayer播放串，
         *               参数3：媒资详情数据对象data
         *           ）
         * @param failCallback 获取播放器串失败后的回调
         *      <pre>
         *      示例：failCallback("这里是具体的错误描述信息")
         *      </pre>
         */
        var __getVideoPlayUrls = function (videoConfObj, successCallback, failCallback) {
            if (typeof videoConfObj !== "object" || videoConfObj == null) {
                LMEPG.call(failCallback, ["无效的视频资源"]);
                return;
            }

            var smartId = __getSmartId();
            if (LMEPG.Func.isEmpty(smartId)) {
                LMEPG.call(failCallback, ["未获取到机顶盒智能卡号"]);
                return;
            }

            var apiServerUrl = __getApiServerUrl();
            if (LMEPG.Func.isEmpty(apiServerUrl)) {
                LMEPG.call(failCallback, ["未获取到播放服务器地址"]);
                return;
            }

            // playurl-api:（http://ip:port/spis/asgapi/v1/play/1/{smart_card_id}/sotv/{productId}/0/0?pid={providerId}&paid={providerAssetId}&rtasset=1）
            var playurl = apiServerUrl +
                "/spis/asgapi/v1/play/1/" + smartId +
                "/sotv/" + videoConfObj.productId +
                "/0/0?pid=" + videoConfObj.providerId +
                "&paid=" + videoConfObj.providerAssetId +
                "&rtasset=1";
            __printLog("startPlayV2()", "构建playurl地址：" + playurl, true);
            __get_video_play_url(playurl, function (url, playurl, data) {
                LMEPG.call(successCallback, [url, playurl, data]);
            }, failCallback);
        };

        /**
         * 通过最终得到的播放相对地址后，加上服务器地址端口组装绝对地址。
         * @param url 最终跳转到广电播放器的相对播放地址
         * @param successCallback 最终成功后的回调通知
         *      <pre>
         *      示例：failCallback("这里是具体的错误描述信息")
         *      </pre>
         */
        var __getSCGDFinalPlayerPageUrl = function (url, successCallback) {
            var finalPlayUrl = __getApiServerUrl() + url;
            __printLog("jumpSCGGPlayVideoPage()", "播放地址URL：" + url, true);
            __printLog("jumpSCGGPlayVideoPage()", "最终跳转播放器地址URL：" + finalPlayUrl, true);
            LMEPG.call(successCallback, [finalPlayUrl]);
        };

        /**
         * 播放方式（方式一）：跳转到四川广电局方播放器页面入口！--> 通过“注入到局方媒资id”启动局方播放器页面
         * <pre>调用示例：
         *      SCGDPlayer.startJumpSCGDPlayPageV1(RenderParam.videoUrl, function (scgdVideoPlayPageUrl) {
         *          // START JUMPING FROM HERE...
         *          // e.g. window.location.href = scgdVideoPlayPageUrl;
         *      }, function (errorMsg) {
         *          // DO SOMETHING HERE...
         *      });
         * </pre>
         *
         * @param assetId 媒资id
         * @param successCallback 获取播放串成功后的回调（参数1：finalPlayUrl，最终跳转到局方播放器的绝对地址url）
         *      <pre>
         *      示例：
         *       successCallback(
         *          "http://10.102.0.47:9500//html/play.htm?home_id=112102011825&device_id=8510010615354730&entry_uid=1008791707&purchase_id=T764B195BE752CC9D15665454041&duration=59&application_uid=60010001&position=0&device_type=&entry_name=39%u5065%u5eb7-gylm134&assetID=RA378742_A1008791707&description=39%u5065%u5eb7-gylm134"
         *       )
         *      </pre>
         * @param failCallback 获取播放器串失败后的回调
         *      <pre>
         *      示例：failCallback("这里是具体的错误描述信息")
         *      </pre>
         */
        this.startJumpSCGDPlayPageV1 = function (assetId, successCallback, failCallback) {
            __getVideoAssetDetailBy(assetId, function (playurl) {
                __get_video_play_url(playurl, function (url, playurl, data) {
                    __getSCGDFinalPlayerPageUrl(url, successCallback);
                }, failCallback);
            }, failCallback);
        };

        /**
         * 播放方式（方式二）：跳转到四川广电局方播放器页面入口！--> 通过“{productId}|{providerId}|{providerAssetId}|{huid}|{parentHUID}”启动局方播放器页面
         *
         * <pre>调用示例：
         *      SCGDPlayer.startJumpSCGDPlayPageV2(RenderParam.videoUrl, function (scgdVideoPlayPageUrl) {
         *          // START JUMPING FROM HERE...
         *          // e.g. window.location.href = scgdVideoPlayPageUrl;
         *      }, function (errorMsg) {
         *          // DO SOMETHING HERE...
         *      });
         * </pre>
         *
         * @param playVideoId 我们管理后台配置的视频信息id（约定，四川广电配置格式用|分隔："{productId}|{providerId}|{providerAssetId}|{huid}|{parentHUID}"）
         * @param successCallback 获取播放串成功的回调，回调参数为跳转到局方播放器页面的绝对地址。
         *      <pre>
         *      示例：
         *      successCallback(
         *          "http://10.102.0.47:9500//html/play.htm?home_id=112102011825&device_id=8510010615354730&entry_uid=1008791707&purchase_id=T764B195BE752CC9D15665454041&duration=59&application_uid=60010001&position=0&device_type=&entry_name=39%u5065%u5eb7-gylm134&assetID=RA378742_A1008791707&description=39%u5065%u5eb7-gylm134"
         *      )
         *      </pre>
         * @param failCallback 获取播放串失败的回调，回调参数有描述信息
         *      <pre>
         *      示例：failCallback("这里是具体的错误描述信息")
         *      </pre>
         */
        this.startJumpSCGDPlayPageV2 = function (playVideoId, successCallback, failCallback) {
            var videoConfigObj = __getVideoConfigObj(playVideoId);
            __getVideoPlayUrls(videoConfigObj, function (url, playurl, data) {
                __getSCGDFinalPlayerPageUrl(url, successCallback); // finalPlayUrl，最终跳转到局方播放器页面的绝对地址url
            }, failCallback);
        };

        /**
         * 播放方式之一：获取视频播放串地址唯一入口！！！
         *
         * <pre>调用示例：
         *      SCGDPlayer.getMediaPlayUrl(videoId, function (playMediaUrl, data) {
         *          // DO SOMETHING HERE...
         *          LMEPG.mp.initPlayerMode1();
         *          LMEPG.mp.playOfFullscreen(playUrl);
         *      }, function (errorMsg) {
         *          // DO SOMETHING HERE...
         *      });
         * </pre>
         *
         * @param playVideoId 我们管理后台配置的视频信息id（约定，四川广电配置格式用|分隔："{productId}|{providerId}|{providerAssetId}|{huid}|{parentHUID}"）
         * @param successCallback 获取播放串成功的回调，回调参数为真实的MediaPlayUrl。callback(mediaPlayUrl-用于MediaPlayer的播放串)
         *      <pre>
         *      示例：
         *      successCallback(
         *          "rtsp://10.80.232.13:554/;purchaseToken=;serverID=?AppPath=60010001&assetUID=3c20f09b&smartcard-id=8510010615354730&device-id=8510010615354730&home-id=112102011825&purchase-id=T764B195BE752CC9D15665454041&mediatime=0&streamtransportmode=ip&ipvodservicegroupid=102"
         *          {返回二次解析封闭媒资详情信息对象}
         *      )
         *      </pre>
         * @param failCallback 获取播放串失败的回调，回调参数有描述信息
         *      <pre>
         *      示例：failCallback("这里是具体的错误描述信息")
         *      </pre>
         */
        this.getMediaPlayUrl = function (playVideoId, successCallback, failCallback) {
            var videoConfigObj = __getVideoConfigObj(playVideoId);
            __getVideoPlayUrls(videoConfigObj, function (url, playurl, data) {
                var toOutData = __parseAssetDetailData(data);
                LMEPG.call(successCallback, [playurl, toOutData]);
            }, failCallback);
        };

        /**
         * 解析媒资详情返回的具体数据里的某些字段信息，以供上层调用直接获取使用。避免直接在应用层解析，减少冗余，以加强抽象封装。
         *
         * @param data 媒资详情data的json对象。
         *      <pre>
         *          例如data节点的json值：
         *              {
         *                  "errorCode":0,
         *                  "errorMsg":"",
         *                  "data":{"entry_name":"39健康-gylm178","device_id":"8510010615354730","purchase_id":"TDCFAFAA91E0E6D5515681928541","description":"39健康-gylm178","device_type":"","asset_id":"RA374153_A1008784368","application_uid":"60010001","url":"/html/play.htm?home_id=112102011825&device_id=8510010615354730&entry_uid=1008784368&purchase_id=TDCFAFAA91E0E6D5515681928541&duration=79&application_uid=60010001&position=0&device_type=&entry_name=39%u5065%u5eb7-gylm178&assetID=RA374153_A1008784368&description=39%u5065%u5eb7-gylm178","token":"TDCFAFAA91E0E6D5515681928541","duration":"79","entry_uid":"1008784368","home_id":"112102011825","position":"0","playurl":"rtsp://10.80.232.17:554/;purchaseToken=;serverID=?AppPath=60010001&assetUID=3c20d3f0&smartcard-id=8510010615354730&device-id=8510010615354730&home-id=112102011825&purchase-id=TDCFAFAA91E0E6D5515681928541&mediatime=0&streamtransportmode=ip&ipvodservicegroupid=102"},
         *                  "errorDetail":"",
         *                  "pageInfo":null
         *              }
         *      </pre>
         * @return JSON object
         */
        var __parseAssetDetailData = function (data) {
            // 说明：请根据需要在此解析需要字段，并添加进入返回json里
            var result = {};
            if (!LMEPG.Func.isObject(data)) {
                return result;
            }

            result.duration = __basicValueOf(data, "duration", DataType.NUMBER, 0);//视频总时长：number

            return result;
        };

        /**
         * 解析媒资详情返回的data里的指定字段值对应的基本数据类型，注意：仅为基本数据类型！请认真使用
         * @param dataObj 媒资详情data
         * @param jsonNodeName 指定字段名
         * @param expectedDataType 期望返回（转换）的具体数值类型
         * @param defaultValue 当解析失败，使用默认值
         * @return any 指定json“节点名jsonNodeName和返回的具体期望数据类型expectedDataType”对应的期望值
         */
        var __basicValueOf = function (dataObj, jsonNodeName, expectedDataType, defaultValue) {
            var originalValue = null;
            try {
                originalValue = eval("dataObj." + jsonNodeName);
            } catch (e) {
                originalValue = null;
                __printLog("__basicValueOf()", "异常：" + e.toString(), true);
            }

            var finalValue = null;

            switch (expectedDataType) {
                case DataType.STRING:
                    finalValue = LMEPG.Func.isEmpty(originalValue) ? "" : String(originalValue);
                    break;
                case DataType.NUMBER:
                    finalValue = isNaN(Number(originalValue)) ? 0 : Number(originalValue);
                    break;
                case DataType.BOOLEAN:
                    finalValue = Boolean(originalValue);
                    break;
            }

            if (null == finalValue) {
                finalValue = defaultValue;
            }

            return finalValue;
        }

    };

    w.SCGDPlayer = new SCGDPlayUtil();
})(window);