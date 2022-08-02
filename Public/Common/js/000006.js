    /**
     * 页面标题与操作功能映射表
     */
    var titleFunctionMap = new Array();
    titleFunctionMap["支付方式选择页面"] = '_returnValue=commonKeyDealProcess.getPositionDomObj(keyDealData.currentPosition).id;_returnValue;';
    titleFunctionMap["CAP"] = 'if (typeof goOk !== "undefined") {goLeft.apply();setTimeout(function(){document.onkeydown({"keyCode":37});goOk.apply();' +
        'if (typeof elementClick !== "undefined") {setTimeout(function(){var btn = {"id": "btn_ok_focus"};elementClick(btn);}, 1000);}}, 500);}' +
        ' else {setTimeout(function(){document.onkeydown({"keyCode":37});}, 500);setTimeout(function(){document.onkeydown({"keyCode":13});}, 1000);};';

    titleFunctionMap["订购结果"] = 'if (typeof elementClick !== "undefined") {setTimeout(function(){var btn = {"id": "btn_ok_focus"};elementClick(btn);}, 5000);} ';
    titleFunctionMap["Insert title here"] = 'if (typeof showFirstOrderPage !== "undefined") {showFirstOrderPage = "0";}if (init !== "undefined") {init.apply();} ';

    /*
     * 页面内元素id与操作功能映射表
     */
    var pageStates = new Array();
    pageStates["verCode"] = 'var verCode = document.getElementById("verCodeImg");var firstImg = verCode.children[0].children[0].src;' +
        'var secondImg = verCode.children[1].children[0].src;var thirdImg = verCode.children[2].children[0].src;' +
        'var fourImg = verCode.children[3].children[0].src;var firstImgNum = firstImg.substring(firstImg.lastIndexOf("/")+1).substring(0,1);' +
        'inputBox(parseInt(firstImgNum));var secondImgNum = secondImg.substring(secondImg.lastIndexOf("/")+1).substring(0,1);' +
        'inputBox(parseInt(secondImgNum));var thirdImgNum = thirdImg.substring(thirdImg.lastIndexOf("/")+1).substring(0,1);inputBox(parseInt(thirdImgNum));' +
        'var fourImgNum = fourImg.substring(fourImg.lastIndexOf("/")+1).substring(0,1);inputBox(parseInt(fourImgNum));' +
        'commonKeyDealProcess.keyPressNameHandler("KEY_DOWN");commonKeyDealProcess.keyPressNameHandler("KEY_ENTER");';

    pageStates["refreshPayCodeImg"] = 'commonKeyDealProcess.keyPressNameHandler("KEY_LEFT");_returnValue=commonKeyDealProcess.getPositionDomObj(keyDealData.currentPosition).id;_returnValue;';

    pageStates["payCodeImgBg"] = 'commonKeyDealProcess.keyPressNameHandler("KEY_LEFT");setTimeout(function(){commonKeyDealProcess.keyPressNameHandler("KEY_DOWN");}, 1000);' +
        '_returnValue=commonKeyDealProcess.getPositionDomObj(keyDealData.currentPosition).id;_returnValue;';
    pageStates["cancle"] = 'commonKeyDealProcess.keyPressNameHandler("KEY_ENTER");';
    pageStates["broadbandPay"] = 'commonKeyDealProcess.keyPressNameHandler("KEY_ENTER");';
    pageStates["buttonBack"] = 'commonKeyDealProcess.keyPressNameHandler("KEY_ENTER");';
    pageStates["verificationCodePay"] = 'commonKeyDealProcess.keyPressNameHandler("KEY_ENTER");';


    var icnt = 1;
    titleFunctionMap["wait页面"] = "";
    var pageCount = 0; // 当前页面出现几次
	
    !(function (win) {
        function runTask() {
            LMEPG.Log.info("JumpToPay---> runTask::runTask ---> start");
            //doInsideWebShow  doInsideWebHide
            LMAndroid.jsCallAndroid("doInsideWebHide", "", null);
            LMEPG.ajax.postAPI("Pay/buildDirectPayUrlForPage", null, function (data) {
                try {
                    var data = data instanceof Object ? data : JSON.parse(data);
                    if (data.result == 0) {
                        // 获取订购url成功
						var process = {"url":data.payUrl};
                        LMAndroid.jsCallAndroid("doInsideWebLoadUrl", process, null);
                    } else {
                        LMEPG.Log.error("build pay url failed，code: " + data.result);
                    }
                } catch (e) {
                    LMEPG.Log.error("build pay failed, exception: " + e.toString());
                }
            });
        }
		
		function onPageFinishedByInside(resq) {
            LMEPG.Log.info("JumpToPay---> runTask::runTask ---> onPageFinishedByInside ");
            var base = new Base64();
            var finalParam = base.decode(resq);
            LMEPG.Log.info("onPageFinishedByInside finalParam: " + finalParam);
            var objData = JSON.parse(finalParam);
            var _temp = objData.url;
            if (_temp.indexOf("payCallback") == 0) {
                LMEPG.Log.info("############onPageFinishedByInside return: " + _temp);
                setTimeout(function () {
                    LMEPG.Intent.back();
                },1000);
                return;
            }

            // 业务过程
            doProcess();
        }
		
		// 执行过程
        function doProcess() {
            LMEPG.Log.info("doProcess ---->");
            doGetTitle();
        }
		
		// 获取页面标题
        function doGetTitle() {
            var jsStr="_returnValue = document.title;_returnValue;";
            LMEPG.Log.info("doGetTitle: " + jsStr);
            LMAndroid.jsCallAndroid("doInsideWebLoadJS",{"javascript":jsStr}, "onGetTitle");
        }

		// 获取页面标题的回调
        function onGetTitle(resp) {
            var base = new Base64();
            var finalParam = base.decode(resp);
            LMEPG.Log.info("onGetTitle: " + finalParam);
            var objData = JSON.parse(finalParam);
            var title = objData.result;
			
			if (title == "wait页面") {
				LMEPG.Log.info("当前是wait页面,return");
				return;
			}
			
			// 作延时操作
			if (title == "支付方式选择页面") {
				setTimeout(function(){
					LMEPG.Log.info("setTimeOut 2s do: " + title);
					doFun(titleFunctionMap[title]);
				}, 2000);
			} else if (title == "CAP") {
                setTimeout(function(){
                    LMEPG.Log.info("setTimeOut 1s do: " + title);
                    doFun(titleFunctionMap[title]);
                }, 1000);
            } else if (title == "订购结果") {
                setTimeout(function(){
                    LMEPG.Log.info("setTimeOut 1s do: " + title);
                    doFun(titleFunctionMap[title]);
                }, 1000);
            }
        }

        function onCallback(resp) {
            LMEPG.Log.info("onCallback:----> ");
            var base = new Base64();
            var finalParam = base.decode(resp);
            LMEPG.Log.info("onCallback: " + finalParam);
            var objData = JSON.parse(finalParam);
            var result = objData.result;
            LMEPG.Log.info("case: " + result);

            // 根据页面元素，操作页面
            doFun(pageStates[result]);
        }

        function doFun(jsStr) {
            LMEPG.Log.info("doFun: " + jsStr);
            LMAndroid.jsCallAndroid("doInsideWebLoadJS",{"javascript":jsStr}, "onCallback");
        }


		// 注册方法
		win.onPageFinishedByInside = onPageFinishedByInside;
		win.doGetTitle = doGetTitle;
		win.onGetTitle = onGetTitle;
		win.onCallback = onCallback;
        win.initInjectTask = runTask;
        win.initInjectTask(); // 加载后立即执行
    })(window);