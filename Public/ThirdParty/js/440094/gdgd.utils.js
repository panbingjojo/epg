(function () {
    var LOG_DEBUG = false;

    var gdgd = {

        /**
         * 获取播放串
         * @param videoId 注入视频媒资id
         * @param asynCallback 回调函数
         */
        getPlayUrl: function (videoId, asynCallback) {
            var titleAssetId = videoId;
            var callback = asynCallback;

            if (callback == null || typeof callback == "undefined") {
                LMEPG.Log.error("[广东广电][getPlayUrl] ---- no callback given!");
                return;
            }
            if (RenderParam.portalURL == null || RenderParam.portalURL == "undefined:undefined" || RenderParam.portalURL.length == 0) {
                callback(false, "请求地址为空!");
                return;
            }

            setTimeout(function () {
                var ajaxUrl = "http://172.16.241.29/u1/SelectionStart?serviceId=gd_mf&client=" + RenderParam.cardId + "&account=" + RenderParam.accountId + "&titleAssetId=" + titleAssetId + "&titleProviderId=11052";

                LMEPG.Log.info("[广东广电][getPlayUrl] 请求url->" + ajaxUrl);
                if (LOG_DEBUG) LMEPG.UI.logPanel.i("[广东广电][getPlayUrl] 请求url->" + ajaxUrl);

                var xmlHttpReq = new XMLHttpRequest();
                xmlHttpReq.open("GET", ajaxUrl, true);
                xmlHttpReq.onreadystatechange = function () {
                    if (xmlHttpReq.readyState == 4) { //接受数据完毕且返回码正确
                        if (xmlHttpReq.status == 200) { //请求成功,根据返回的 responseText 取得令牌
                            var respText = xmlHttpReq.responseText;

                            LMEPG.Log.info("[广东广电][getPlayUrl] 响应结果->" + respText);
                            if (LOG_DEBUG) LMEPG.UI.logPanel.i("[广东广电][getPlayUrl] 响应结果->" + respText);

                            var rtspUrl = gdgd._getPlayUrlByXmlStr(respText);
                            callback(true, rtspUrl);

                            // LMEPG.Log.error("getPlayUrl440094 ---- 请求成功:" + respText);
                            // var reg = /purchaseToken="\S*"/;
                            // var s = reg.exec(xmlHttpReq.responseText).toString();
                            // var purchaseToken = s.substring(15, 47);
                            // if (purchaseToken == null || purchaseToken == 'undefined' || purchaseToken.length == 0) {
                            //     //purchaseToken为空
                            //     var regMsg = /message=".*"/;
                            //     var msg = regMsg.exec(xmlHttpReq.responseText).toString();
                            //     msg = msg.substring(9, msg.length - 1);
                            //     if (msg == null || msg == 'undefined' || msg.length == 0) {
                            //         msg = "请求视频url失败";
                            //     } else {
                            //         msg = "失败:" + msg
                            //     }
                            //     callback(false, msg);
                            // } else {
                            //     //成功获取purchaseToken，去获取视频信息（主要是视频总时长）
                            //     if (typeof (config) === undefined) {
                            //         callback(false, "内置对象config不存在");
                            //     } else {
                            //         //组装视频url
                            //         var serverId = config.VODServerId;
                            //         var host = config.BOServer.ip + ':' + config.BOServer.port
                            //         if (host == null || host == 'undefined' || host.length == 0) {
                            //             callback(false, "视频host为空");
                            //             return;
                            //         }
                            //         var rtspUrl = "rtsp://" + host + "/;purchaseToken=" + purchaseToken + ";serverId=" + serverId;
                            //         LMEPG.Log.error("getPlayUrl440094 ---- rtspUrl:" + rtspUrl);
                            //         callback(true, rtspUrl);
                            //     }
                            // }

                        } else {
                            //请求异常
                            callback(false, "请求视频url异常");
                        }
                    }
                };
                xmlHttpReq.send(null);
            }, 500);
        },

        //通过xml文件获取播放地址
        _getPlayUrlByXmlStr: function (xmlStr) {
            LMEPG.Log.info("[广东广电][_getPlayUrlByXmlStr] ----> xmlStr:" + xmlStr);
            if (LOG_DEBUG) LMEPG.UI.logPanel.v("[广东广电][_getPlayUrlByXmlStr] ----> xmlStr:" + xmlStr);

            var retPlayUrl = "";
            xmlStr = xmlStr.replace(/(^\s*)|(\s*$)/g, "");
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlStr, "text/xml");
            var domVideoAuthResult = xmlDoc.getElementsByTagName("StartResponse");

            if (LMEPG.Func.isEmpty(domVideoAuthResult)) {
                LMEPG.Log.error("[广东广电][_getPlayUrlByXmlStr][failed] ----> domVideoAuthResult is empty！");
            }
            if (domVideoAuthResult.length < 1) {
                LMEPG.Log.error("[广东广电][_getPlayUrlByXmlStr][failed] ----> 视频鉴权，返回结果没有StartResponse！");
                LMEPG.UI.showToast("视频鉴权，返回结果没有StartResponse");
            } else {
                retPlayUrl = domVideoAuthResult[0].getAttribute("playUrls");
                LMEPG.Log.info("[广东广电][_getPlayUrlByXmlStr][success] ----> getPlayUrl:" + retPlayUrl);
            }

            if (LOG_DEBUG) LMEPG.UI.logPanel.e("[广东广电][_getPlayUrlByXmlStr] ----> getPlayUrl:" + retPlayUrl);

            return retPlayUrl;
        },

        /**
         * 获取视频信息详情
         * @param videoId 注入视频媒资id
         * @param asynCallback 回调函数
         */
        getVideoInfo: function (videoId, asynCallback) {
            var mediaInfo = {
                progTimeLength: 0,
            };

            var titleAssetId = videoId;
            var callback = asynCallback;

            if (callback == null || typeof callback == "undefined") {
                LMEPG.Log.error("[广东广电][getVideoInfo] ---- no callback given!");
                return;
            }

            setTimeout(function () {
                var ajaxUrl = "http://" + RenderParam.portalURL + "/GetItemData?client=" + RenderParam.cardId + "&account=" + RenderParam.accountId + "&titleAssetId=" + titleAssetId;
                LMEPG.Log.info("[广东广电][getVideoInfo] 请求url->" + ajaxUrl);
                if (LOG_DEBUG) LMEPG.UI.logPanel.v("[广东广电][getVideoInfo] 请求url->" + ajaxUrl);

                var xmlHttpReq = new XMLHttpRequest();
                xmlHttpReq.open("GET", ajaxUrl, true);
                xmlHttpReq.onreadystatechange = function () {
                    if (xmlHttpReq.readyState == 4) { //接受数据完毕且返回码正确
                        if (xmlHttpReq.status == 200) { //根据返回的 responseText 取得令牌
                            var respText = xmlHttpReq.responseText;

                            LMEPG.Log.info("[广东广电][getVideoInfo]获取视频信息：" + respText);
                            if (LOG_DEBUG) LMEPG.UI.logPanel.i("[广东广电][getVideoInfo]获取视频信息：" + respText);

                            var regProgTimeLength = /progTimeLength="\S*"/;
                            var progTimeLength = regProgTimeLength.exec(respText).toString(); //获取总时长字段
                            mediaInfo.progTimeLength = progTimeLength = progTimeLength.substring(16, progTimeLength.length - 1); //解析出总时长

                            if (LOG_DEBUG) LMEPG.UI.logPanel.v("[广东广电][getVideoInfo]获取视频信息-总时长：" + progTimeLength);

                            if (progTimeLength == null || typeof progTimeLength === "undefined" || progTimeLength == 'undefined' || progTimeLength.length == 0) {
                                callback(false, "无法解析出视频总时长");
                            } else {
                                callback(true, mediaInfo);
                            }
                        } else {
                            callback(false, "请求视频信息异常");
                        }
                    }
                };
                xmlHttpReq.send(null);
            }, 500);
        },
    };

    window.UtilsWithGDGD = gdgd;
})();
