// +----------------------------------------------------------------------
// | MoFang-EPG-LWS
// +----------------------------------------------------------------------
// | [计费页逻辑-黑龙江移动] 通用处理AndroidSDK计费接口回调结果
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019-8-8 18:51
// +----------------------------------------------------------------------

(function (w) {
    var HLJSdkUtil = function () {

        //TODO 开发假数据
        this.__debugUseTestData = false;
        this.__testAuthRes = (function () {
            var input = {};
            var output = {
                "result": "-111",
                "message": "invalid",
                "data": {
                    "productList": [
                        {
                            "productId": "xxxxx",
                            "productName": "xxxx",
                            "productType": "xxxx",
                            "price": "2900",
                            "payPrice": "2900",
                            "promDesc": "",
                            "imageAddr": "",
                            "renewStatus": "1",
                            "vendorCode": "",
                            "vendorName": "",
                            "payInfo": {
                                "payType": "",
                                "payPrice": "2900",
                                "payDesc": "xxxx",
                                "imageAddr": "",
                                "confirmType": "QUESTION"
                            },
                            "promInfo": ""
                        }
                    ]
                }
            };
            var testjson = {
                "result": "1/-1或其它",
                "data": JSON.stringify({
                    "input": JSON.stringify(input),
                    "output": JSON.stringify(output)
                })
            };
            return JSON.stringify(testjson);
        })();
        this.__testPayRes = (function () {
            var input = {};
            var output = {"result": "-111", "message": "invalid", "detailMessage": ""};
            var testjson = {
                "result": "1/-1或其它",
                "data": JSON.stringify({
                    "input": JSON.stringify(input),
                    "output": JSON.stringify(output)
                })
            };
            return JSON.stringify(testjson);
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
         *                      "result":"1/-1或其它",//注意：与sdk端具体实现协议约定，这里1仅仅表示sdk端处理成功，有结果（具体业务结果判断请根据data.output.xxx）
         *                      "data":"{\"input\":\"\",\"output\":\"\"}"
         *                   }
         * @param callback 处理结果回调。
         *                  参数列表：
         *                  [
         *                      handledRC(1-解析处理数据成功,0或其它解析异常失败),
         *                      handledMsg(解析处理数据的描述信息),
         *                      isAuthSuccess(是否鉴权成功：false未订购/true已订购),
         *                      paySdkResultCode(透传sdk返回的result码),
         *                      paySdkResultMsg(透传sdk返回的鉴权结果描述信息message),
         *                      paySdkAuthProductList(内部解析，若未订购，返回产品包列表。否则，为null)
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
                var rootJson = JSON.parse(authRes);//{"result":"1/-1或其它","data":"{\"input\":\"\",\"output\":\"\"}"}
                var dataJson = JSON.parse(rootJson.data);//sdk返回的原始信息:{"input":"","output":""}
                var outputJson = JSON.parse(dataJson.output);

                ////////////////////////////// 解析“鉴权接口”返回的信息字段 //////////////////////////////
                var sdkResult = outputJson.result;
                var sdkMsg = outputJson.message;
                var sdkDetailMsg = outputJson.detailMessage;
                var sdkData = outputJson.data;
                //////////////////////////////////////////////////////////////////////////////////////////

                // handled //
                funcIsAuthSuccess = sdkResult === "ORD-000";//接口文档-附录1注明： "ORD-000"-一定成功，其它-一定失败（具体以sdkMsg（message）描述为准）
                funcHandledRC = 1; //自定义，仅仅表示解析数据无错，可达这个地方
                funcPaySdkResultCode = sdkResult;
                if (!is_empty(sdkMsg)) {
                    funcHandledMsg = sdkMsg;
                    funcPaySdkResultMsg = sdkMsg;
                }
                if (!is_empty(sdkData)) funcPayAuthProductList = sdkData;

                try {
                    var sdkProductList = sdkData.productList;
                    if (is_array(sdkProductList)) {
                        funcPayAuthProductList = sdkProductList;
                    } else {
                        var parsedProductList = JSON.parse(sdkProductList);
                        if (is_array(parsedProductList)) funcPayAuthProductList = parsedProductList;
                    }
                } catch (e) {
                    this.__localLog("parsed sdkData.productList: " + e.toLocaleString());
                }
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
         *                      "result":"1/-1或其它",//注意：与sdk端具体实现协议约定，这里1仅仅表示sdk端处理成功，有结果（具体业务结果判断请根据data.output.xxx）
         *                      "data":"{\"input\":\"\",\"output\":\"\"}"
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
            function __handleBadDataTemp(dataJson, outputJson) {
                // TODO 进入订购页，不点击订购，就按返回后，支付接口返回的callbackResult的字符串就是一个“1”。非规范的json串，后期局方的人给新包会处理。我们联调阶段先对这种情况做一下硬性处理，方便上层给用户弹出友好提示：
                if ((typeof dataJson === "object" && dataJson.output == "1")
                    || (typeof outputJson !== "object" && outputJson == "1")) { //用"=="判断，因为：JSON.parse("1")得到number类型的1
                    funcPaySdkResultCode = -1;
                    funcPaySdkResultMsg = "用户取消";
                    PaySdk.__localLog("parsePayResultFromAndroid-->__handleBadDataTemp--->Invalid data and outputJson: " + JSON.stringify(outputJson));
                }
            }

            // 自定义：仅表解析处理数据的结果描述
            var funcHandledRC = -1;
            var funcHandledMsg = "Failed: Unknown!";

            // 透传SDK参数：方便上层提示可用，透传SDK原始返回信息
            var funcIsPaySuccess = false;
            var funcPaySdkResultCode = -999;
            var funcPaySdkResultMsg = "Unknown!";

            try {
                if (this.__debugUseTestData) payRes = this.__testPayRes;//TODO 模拟假数据
                var rootJson = JSON.parse(payRes);//{"result":"1/-1或其它","data":"{\"input\":\"\",\"output\":\"\"}"}
                var dataJson = JSON.parse(rootJson.data);//sdk返回的原始信息:{"input":"","output":""}
                var outputJson = JSON.parse(dataJson.output);

                ////////////////////////////// 解析“支付接口”返回的信息字段 //////////////////////////////
                var sdkResult = outputJson.result; //官方提示：请注意这个支付结果只是临时支付结果，集成方必须严格使用authorize接口查询真正支付结果，切记！
                var sdkMsg = outputJson.message; //支付接口描述：message-支付结果描述
                //////////////////////////////////////////////////////////////////////////////////////////

                // handled //
                funcIsPaySuccess = sdkResult === "ORD-000";//接口文档-附录1注明： "ORD-000"-一定成功，其它-一定失败（具体以sdkMsg（message）描述为准）
                funcHandledRC = 1; //自定义，仅仅表示解析数据无错，可达这个地方
                funcPaySdkResultCode = sdkResult;
                if (!is_empty(sdkMsg)) {
                    funcHandledMsg = sdkMsg;
                    funcPaySdkResultMsg = sdkMsg;
                }
            } catch (e) {
                this.__localLog("parsePayResultFromAndroid-->error: " + e.toLocaleString());
                funcHandledRC = -999;
                funcHandledMsg = e.toLocaleString();
            }

            // TODO 临时处理计费SDK接口回调数据不规范
            __handleBadDataTemp(dataJson, outputJson);

            LMEPG.call(callback, [funcHandledRC, funcHandledMsg, funcIsPaySuccess, funcPaySdkResultCode, funcPaySdkResultMsg]);
        };
    };

    w.PaySdk = new HLJSdkUtil();
})(window);