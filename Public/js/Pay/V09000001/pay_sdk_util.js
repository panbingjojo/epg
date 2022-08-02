// +----------------------------------------------------------------------
// | MoFang-EPG-LWS
// +----------------------------------------------------------------------
// | [计费页逻辑-未来电视怡伴健康统一接口版] 通用处理AndroidSDK计费接口回调结果
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2020-10-19 10:06
// +----------------------------------------------------------------------

(function (w) {
    var HLJSdkUtil = function () {

        //TODO 开发假数据
        this.__debugUseTestData = false;
        this.__testAuthRes = (function () {
            var resultJson = {
                "result": "1",
                "data": {
                    "contentId": "xxx"
                }
            };
            return JSON.stringify(resultJson);
        })();
        this.__testPayRes = (function () {
            var resultJson = {
                "result": "1",
                "data": {
                    "contentId": "xxx"
                }
            };
            return JSON.stringify(resultJson);
        })();

        this.__localLog = function (msg) {
            if (LMEPG.Log) LMEPG.Log.info(msg);
        };

        /**
         * 解析SDK鉴权结果：统一解析与Android端定制的input/output协议参数/结果
         *
         * @param authReq 由Web向Android请求SDK鉴权的输入参数json串。
         * @param authRes 由Android向Web返回SDK鉴权结果及原始输入参数json串。json格式如：
         *                  {
         *                      "result":"1",
         *                      "data":"{\"contentId\":\"xxx\"}" // contentId：表示鉴权内容的ID，result：1表示已经付费，其他为未付费
         *                   }
         * @param callback 处理结果回调。
         *                  参数列表：
         *                  [
         *                      handledRC(1-解析处理数据成功,0或其它解析异常失败),
         *                      handledMsg(解析处理数据的描述信息),
         *                      isAuthSuccess(是否鉴权成功：false未订购/true已订购),
         *                      paySdkResultCode(透传sdk返回的result码),
         *                      paySdkResultMsg(透传sdk返回的鉴权结果描述信息message),
         *                      paySdkAuthProductList(为null)
         *                  ]
         * @private
         */
        this.handleAuthResultFromAndroid = function (authReq, authRes, callback) {
            // 自定义：仅表解析处理数据的结果描述
            var funcHandledRC = -1;
            var funcHandledMsg = "Failed: Unknown!";

            // 透传SDK参数：方便上层提示可用，透传SDK原始返回信息
            var funcIsAuthSuccess = false;
            var funcPaySdkResultCode = -999;
            var funcPaySdkResultMsg = "Unknown!";
            var funcPayAuthProductList = null;

            try {
                if (this.__debugUseTestData) authRes = this.__testAuthRes;//TODO 模拟假数据
                var rootJson = JSON.parse(authRes);//{"data":"{\"contentId\":\"CONFIG_39_PSID\"}","result":"1"}

                ////////////////////////////// 解析“鉴权接口”返回的信息字段 //////////////////////////////
                var sdkResult = rootJson.result;
                //////////////////////////////////////////////////////////////////////////////////////////

                // handled //
                funcIsAuthSuccess = sdkResult === "1";//接口文档《怡伴鉴权和支付API-0118》-二鉴权注明： "1"-表示已付费，其它-未付费
                funcPaySdkResultCode = sdkResult;
                if(funcIsAuthSuccess){
                    funcHandledMsg = "付费用户";
                }else{
                    funcHandledMsg = "非付费用户";
                }
                funcHandledRC = 1; //自定义，仅仅表示解析数据无错，可达这个地方
            } catch (e) {
                this.__localLog("parseAuthResultFromAndroid-->error: " + e.toLocaleString());
                funcHandledRC = -999;
                funcHandledMsg = e.toLocaleString();
            }
            LMEPG.call(callback, [funcHandledRC, funcHandledMsg, funcIsAuthSuccess, funcPaySdkResultCode, funcPaySdkResultMsg, funcPayAuthProductList]);
        };

        /**
         * 解析SDK订购结果：统一解析与Android端定制的input/output协议参数/结果
         *
         * @param payReq 由Web向Android请求SDK订购的输入参数json串。
         * @param payRes 由Android向Web返回SDK订购结果及原始输入参数json串。json格式如：
         *                  {
         *                      "result":"1",
         *                      "data":"{\"contentId\":\"xxx\"}" // contentId：表示支付内容的ID，result：1表示已经支付成功，其他为未支付
         *                   }
         * @param callback 处理结果回调。
         *                  参数列表：
         *                  [
         *                      handledRC(1-解析处理数据成功,0或其它解析异常失败),
         *                      handledMsg(解析处理数据的描述信息),
         *                      isPaySuccess(是否支付成功：false未订购/true已订购),
         *                      paySdkResultCode(透传sdk返回的result码),
         *                      paySdkResultMsg(透传sdk返回的支付结果描述信息message),
         *                  ]
         * @private
         */
        this.handlePayResultFromAndroid = function (payReq, payRes, callback) {
            // 自定义：仅表解析处理数据的结果描述
            var funcHandledRC = -1;
            var funcHandledMsg = "Failed: Unknown!";

            // 透传SDK参数：方便上层提示可用，透传SDK原始返回信息
            var funcIsPaySuccess = false;
            var funcPaySdkResultCode = -999;
            var funcPaySdkResultMsg = "Unknown!";

            try {
                if (this.__debugUseTestData) payRes = this.__testPayRes;//TODO 模拟假数据
                var rootJson = JSON.parse(payRes);//{"data":"{\"contentId\":\"CONFIG_39_PSID\"}","result":"1"}

                ////////////////////////////// 解析“支付接口”返回的信息字段 //////////////////////////////
                var sdkResult = rootJson.result;
                //////////////////////////////////////////////////////////////////////////////////////////

                // handled //
                funcIsPaySuccess = sdkResult === "1";//接口文档《怡伴鉴权和支付API-0118》-二鉴权注明： "1"-表示已支付，其它-未支付
                funcPaySdkResultCode = sdkResult;
                if(funcIsPaySuccess){
                    funcHandledMsg = "支付成功";
                }else{
                    funcHandledMsg = "未支付";
                }
                funcHandledRC = 1; //自定义，仅仅表示解析数据无错，可达这个地方
            } catch (e) {
                this.__localLog("parsePayResultFromAndroid-->error: " + e.toLocaleString());
                funcHandledRC = -999;
                funcHandledMsg = e.toLocaleString();
            }
            LMEPG.call(callback, [funcHandledRC, funcHandledMsg, funcIsPaySuccess, funcPaySdkResultCode, funcPaySdkResultMsg]);
        };
    };

    w.PaySdk = new HLJSdkUtil();
})(window);