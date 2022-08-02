var buttons = [];   // 定义全局按钮
var imgUrl = ROOT + "/Public/img/Pay/V630001/V1";
var formula = "";
var left_select = "";

// 是否是单订购项（true-单个套餐包 false-多套餐包选项）
// 通过前端参数传递区分，以暂时兼容不同模式（单订购/多订购）的html对应的js逻辑！
var isSinglePay = !!RenderParam.isSinglePay;

// 是否增加了新一项活动配置项——“幸福家庭体验中心”
var hasHappyExperience = (function () {
    try {
        var tempItems = RenderParam.orderItems;
        if (Object.prototype.toString.call(tempItems) === "[object Array]" && tempItems.length > 0) {
            for (var i = 0; i < tempItems.length; i++) {
                var item = tempItems[i];
                if (item.price == 2000) {
                    // 暂时硬编码，以兼容后期方便快速下线。通过查找价格2000为“幸福家庭包”的体验包，决定是否显示替换29元的。
                    return true;//找到！
                }
            }
        }
    } catch (e) {
        console.error(e);
        LMEPG.Log.error('处理特殊订购包异常：' + e.toString());
    }
    return false;//未找到！
})();

/**
 * 是否有隐藏按钮（注：仅限隐藏！以兼容原有逻辑不变，保证少改代码）（Added by songhui on 2020-3-15）
 * @returns {{hide: *, show: *}} 返回显示和隐藏的，没有则返回空
 */
function hasRenderSpecialPkgBtns() {
    // 有20元幸福家庭包时，隐藏29元包（即第4个）
    return {
        showBtns: hasHappyExperience ? ['btn-product-4'] : ['btn-product-3'],
        hideBtns: hasHappyExperience ? [] : ['btn-product-4'],
    }
}

// 返回按键
function onBack() {
    LMEPG.Intent.back();
}

// 延迟退出该页面
function onDelayBack() {
    setTimeout(function () {
        LMEPG.Intent.back();
    }, 1500);
}

// 页面跳转控制
var Jump = {
    /**
     * 跳转 -- 规则
     */
    jumpRule: function () {
        var objCurr = Jump.getCurrentPage();
        var objRule = LMEPG.Intent.createIntent("goodsRule");
        LMEPG.Intent.jump(objRule, objCurr);
    },

    /**
     * 跳转 -- 付款
     */
    jumpPay: function (orderId, payUrl) {
        var objCurr = Jump.getCurrentPage();
        var objPay = LMEPG.Intent.createIntent("goodsPay");
        objPay.setParam("goodInfo", DataHandle.InitData.goodInfo);
        objPay.setParam("orderId", orderId);
        objPay.setParam("payUrl", payUrl);
        LMEPG.Intent.jump(objPay, objCurr);
    },

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("goodsBuy");
        currentPage.setParam("goodInfo", DataHandle.InitData.goodInfo);
        return currentPage;
    },

};

var Pay = {
    isClickPaying: false,       // 是否已经点击了支付按钮，表示正在支付中（此过程不该允许重复操作，避免逻辑错误影响）
    loopPayResultMaxSec: 5,     // 轮询支付结果最大超时允许值（秒）（注：5s对用户已经很长，再大体验就不好了！）
    loopPayResultTimes: 0,      // 轮询支付结果超时时刻（秒）（当>最大超时限制，则结果并给予相关提示、释放某些控制变量以进行再次订购）
    lastProductPkgIndex: 0,     // 展示页1 - 当前套餐索引序号（0开始）（仅UI上呈现的顺序）
    lastProductPkgFocusedId: isSinglePay ? "cancel" : hasHappyExperience ? "btn-product-4" : "btn-product-1",       // 展示页1 - 最后选中的产品包焦点元素id
    payingData: {               // 当前正在触发订购的相关数据存储，用于支付成功后轮询结果过程需要（中间存储，避免业务逻辑控制不好切换选择新的未订购信息轮询）
        payParamInfo: null,     // 下单结果存储
        orderItem: null,        // 套餐选项 - UI上对应我方后台配置项
        authProduct: null,      // 套餐选项 - 匹配对应局方鉴权返回的那个可订购产品包
        reset: function () {    // 重置存储数据，在二次确认弹窗前重置旧数据
            Pay.payingData.payParamInfo = null;
            Pay.payingData.orderItem = null;
            Pay.payingData.authProduct = null;
        },
    },

    // 重置轮询支付结果查询相关控制变量。当支付失败或查询超时，则重置相关控制变量，以便用户可进行再次订购点击操作。
    resetLoopPayResultFlags: function (isNeedCancelPaying) {
        Pay.isClickPaying = typeof isNeedCancelPaying !== "boolean" ? false/*默认取消*/ : isNeedCancelPaying;
        Pay.loopPayResultTimes = 0;
    },

    initUIFirst: function () {
        if (isSinglePay) return;
        var handleBtns = hasRenderSpecialPkgBtns();
        for (var key in handleBtns) {
            if (key === 'hideBtns') for (var i = 0; i < handleBtns['hideBtns'].length; i++) G(handleBtns['hideBtns'][i]).style.display = 'none';
            if (key === 'showBtns') for (var i = 0; i < handleBtns['showBtns'].length; i++) G(handleBtns['showBtns'][i]).style.display = 'inline-block';
        }
    },

    initStaticButton: function () {
        /* 首次展示页 - 按钮 */
        if (isSinglePay) {
            buttons.push({
                id: "confirm",
                name: "确认",
                type: "img",
                nextFocusUp: isSinglePay ? "" : Pay.lastProductPkgFocusedId,
                nextFocusRight: "cancel",
                backgroundImage: imgUrl + "bg_confirm.png",
                focusImage: imgUrl + "f_confirm.png",
                click: Pay.onClick,
                beforeMoveChange: Pay.onBeforeMoveChange,
            });
            buttons.push({
                id: "cancel",
                name: "取消",
                type: "img",
                nextFocusUp: isSinglePay ? "" : Pay.lastProductPkgFocusedId,
                nextFocusLeft: "confirm",
                backgroundImage: imgUrl + "bg_cancel.png",
                focusImage: imgUrl + "f_cancel.png",
                click: onBack,
                beforeMoveChange: Pay.onBeforeMoveChange,
            });
        }

        /* 二次确认页 - 按钮 */
        buttons.push({
            id: "textPhone-text",
            name: "取消",
            type: "div",
            nextFocusDown: "second-confirm",
            backgroundImage: imgUrl + "bg_text.png",
            focusImage: imgUrl + "f_text.png",
            focusChange: SecondToast.onTextPhoneFocusChanged,
            beforeMoveChange: "",
        });
        buttons.push({
            id: "second-confirm",
            name: "确认",
            type: "img",
            nextFocusRight: "second-cancel",
            nextFocusUp: "textPhone-text",
            backgroundImage: imgUrl + "bg_confirm.png",
            focusImage: imgUrl + "f_confirm.png",
            click: SecondToast.toSubmit,
        });
        buttons.push({
            id: "second-cancel",
            name: "取消",
            type: "img",
            nextFocusLeft: "second-confirm",
            nextFocusUp: "textPhone-text",
            backgroundImage: imgUrl + "bg_cancel.png",
            focusImage: imgUrl + "f_cancel.png",
            click: onBack,
        });

    },

    initData: function () {
        formula = SecondToast.randomNumber();
        document.getElementById("formula-p").innerHTML = formula+" =";
        document.getElementById("tel-p").innerHTML= RenderParam.authProductInfo.accountIdentify;
        document.getElementById("tel-p-1").innerHTML= RenderParam.authProductInfo.accountIdentify;
        if (RenderParam.authProductInfo.result == "0") {
            //LMEPG.UI.showToast("用户已经订购产品！");
            LMEPG.UI.showToast('<div id="g_title" class=" g_title">'+"用户已经订购产品！"+'</div>');
            onDelayBack();
            return;
        }

        if (!RenderParam.orderItems || RenderParam.orderItems.length <= 0) {
            // 获取订购项失败
            //LMEPG.UI.showToast("获取订购套餐失败！");
            LMEPG.UI.showToast('<div id="g_title" class=" g_title">'+"获取订购套餐失败！"+'</div>');
            onDelayBack();
            return;
        }

            for (var i = 0, len = 4; i < len; i++) {
                buttons.push({
                    id: "btn-product-" + (i + 1),
                    name: "套餐包-" + (i + 1),
                    type: "div",
                    nextFocusLeft: "",
                    nextFocusRight: "btn-back",
                    nextFocusUp:(i===0?"":"btn-product-"+ i),
                    nextFocusDown: (i===3?"":"btn-product-"+ (i + 2)),
                    click: Pay.onProductPkgClicked,
                    focusChange: Pay.onProductPkgFocusChanged,
                    beforeMoveChange: Pay.onProductPkgBeforeMoveChanged,
                    cIndex: i, //订购项下标索引（0开始）
             });
            }

        buttons.push({
            id: "btn-count",
            name: "统计" ,
            type: "div",
            nextFocusLeft: "btn-product-1",
            nextFocusDown: "btn-back",
            click: Pay.onProductPkgClicked,
            focusChange: Pay.onProductPkgFocusChanged,
            beforeMoveChange: Pay.onProductPkgBeforeMoveChanged,
        });

        buttons.push({
            id: "btn-click",
            name: "确认" ,
            type: "div",
            nextFocusLeft: "btn-product-1",
            nextFocusRight: "btn-back",
            nextFocusUp:"btn-count",
            nextFocusDown: "btn-agreement",
            click: Pay.onClicked,
            focusChange: Pay.onProductPkgFocusChanged,
            beforeMoveChange: Pay.onProductPkgBeforeMoveChanged,
        });

        buttons.push({
            id: "btn-back",
            name: "取消" ,
            type: "div",
            nextFocusLeft: "btn-click",
            nextFocusUp:"btn-count",
            nextFocusDown: "btn-agreement",
            click: onBack,
            focusChange: Pay.onProductPkgFocusChanged,
            beforeMoveChange: Pay.onProductPkgBeforeMoveChanged,
        });

        buttons.push({
            id: "btn-agreement",
            name: "协议" ,
            type: "div",
            nextFocusLeft: "btn-product-1",
            nextFocusUp:"btn-back",
            click: Pay.onClicked,
            focusChange: Pay.onProductPkgFocusChanged,
            beforeMoveChange: Pay.onProductPkgBeforeMoveChanged,
        });
    },

    /**
     * 套餐包选项 - 焦点切换
     *         if (hasFocus) {
            Pay.lastProductPkgFocusedId = btn.id;
            Pay.lastProductPkgIndex = btn.cIndex;
        }
     */
    onProductPkgFocusChanged: function (btn, hasFocus) {
        if (hasFocus) {
            if(btn.id.search("product") != -1) {
                document.getElementById("btn-product-1").getElementsByTagName("img")[0].src = imgUrl+"/select-nofee.png";
                document.getElementById("btn-product-2").getElementsByTagName("img")[0].src = imgUrl+"/select-nofee.png";
                document.getElementById("btn-product-3").getElementsByTagName("img")[0].src = imgUrl+"/select-nofee.png";
                document.getElementById("btn-product-4").getElementsByTagName("img")[0].src = imgUrl+"/select-nofee.png";
                document.getElementById(btn.id).getElementsByTagName("img")[0].src = imgUrl+"/select-fee.png";
            }
            if(btn.id == "btn-agreement") {
                document.getElementById(btn.id).getElementsByTagName("img")[0].src = imgUrl+"/select-agreement.png";
            }
            if(btn.id == "btn-click" || btn.id == "btn-back") {
                document.getElementById(btn.id).getElementsByTagName("img")[0].src = imgUrl+"/select-confirm.png";
            }
            if(btn.id == "btn-count") {
                LMEPG.UI.keyboard.setHintText("_");
                LMEPG.UI.keyboard.show(900, 288,"count-p","btn-click",false);
            }

            if (btn.id == "btn-product-1"){
                G('fee-tel').style.display = 'none';
                G('computeId').style.display = 'none';
                G('big-fee-tel').style.display = 'inline-block';
            }else{
                if(btn.id.search("product") == -1 && left_select == "btn-product-1"){
                    G('fee-tel').style.display = 'none';
                    G('computeId').style.display = 'none';
                    G('big-fee-tel').style.display = 'inline-block';
                }else{
                    G('fee-tel').style.display = 'inline-block';
                    G('computeId').style.display = 'inline-block';
                    G('big-fee-tel').style.display = 'none';
                    Pay.onIconChanges(btn.id);
                }
            }
        }
        else {
            if(btn.id.search("product") != -1 && btn.id != left_select) {
                document.getElementById(btn.id).getElementsByTagName("img")[0].src = imgUrl+"/select-nofee.png";
            }
            if(btn.id == "btn-agreement") {
                document.getElementById(btn.id).getElementsByTagName("img")[0].src = imgUrl+"/no-select-agreement.png";
            }
            if(btn.id == "btn-click" || btn.id == "btn-back") {
                document.getElementById(btn.id).getElementsByTagName("img")[0].src = imgUrl+"/no-select-confirm.png";
            }

        }
    },


    /**
     * 套餐包选项 - 点击
     */
    onIconChanges: function (id) {
        if(id.search("product") != -1){
            formula = SecondToast.randomNumber();
            document.getElementById("formula-p").innerHTML = formula+" =";
            if(id == "btn-product-4"){
                G('expertId').style.display = 'none';
                G('homeDoctorId').style.display = 'inline-block';
                G('vipId').style.display = 'inline-block';
                G('videoId').style.display = 'inline-block';
                G('iconDoctorId').style.top = '330px';
                G('textDoctorId').style.top = '330px';
            } else if(id == "btn-product-3"){
                G('expertId').style.display = 'none';
                G('homeDoctorId').style.display = 'inline-block';
                G('vipId').style.display = 'none';
                G('videoId').style.display = 'none';
                G('iconDoctorId').style.top = '270px';
                G('textDoctorId').style.top = '270px';
            } else {
                G('expertId').style.display = 'inline-block';
                G('homeDoctorId').style.display = 'inline-block';
                G('vipId').style.display = 'inline-block';
                G('videoId').style.display = 'inline-block';
                G('iconDoctorId').style.top = '330px';
                G('textDoctorId').style.top = '330px';
            }
        }
    },
    /**
     * 套餐包选项 - 点击
     */
    onProductPkgClicked: function (btn) {
        //SecondToast.init();
        left_select = btn.id;
        LMEPG.BM.requestFocus("btn-click");
    },

    /**
     * 套餐包选项 - 点击计费
     */
    onClicked: function (btn) {
        if(btn.id=="btn-agreement"){
            //window.location.href = "./agreement.html";
            var objOrderHome = LMEPG.Intent.createIntent("agreement");
            var objHome =  LMEPG.Intent.createIntent("orderHome");
            LMEPG.Intent.jump(objOrderHome,objHome);
        }else {
            var count = eval(formula);
            var count_p = document.getElementById("count-p").innerHTML;
            if(count == count_p || left_select == "btn-product-1"){
                Pay._ADVPay(); // 执行订购操作
            }else{
                //LMEPG.UI.showAndroidToast("计算错误");
                LMEPG.UI.showToast('<div id="g_title" class=" g_title">计算错误！</div>');
                formula = SecondToast.randomNumber();
                document.getElementById("formula-p").innerHTML = formula+" =";
            }
        }
    },

    /**
     * 套餐包选项 - 移动
     */
    onProductPkgBeforeMoveChanged: function (dir, current) {
        if (dir == 'up' || dir == 'down') {
            if(current.id.search("product") != -1){
                left_select = current.id;
            }
            return;
        }

        if (dir == 'right' ) {
            if(current.id.search("product") != -1){
                left_select = current.id;
            }

            if(left_select == "btn-product-1"){
                buttons[5].nextFocusUp = "";
                buttons[6].nextFocusUp = "";
            }else{
                buttons[5].nextFocusUp = "btn-count";
                buttons[6].nextFocusUp = "btn-count";
            }
        }
        if (dir == 'left' ) {
            if((current.id.search("product") == -1) && current.id != "btn-back"){
                LMEPG.BM.requestFocus(left_select);
                return false;
            }
        }

        // 注：处理屏蔽某些平台隐藏的按钮功能，但用户体验上仍可继续移动。即，不触动原有的定死按钮间相互移动逻辑代码的基础上，
        // 直接进行中间拦截处理。（Added by songhui on 2020-3-18）
        window.hiddenPkgBtns = window.hiddenPkgBtns || hasRenderSpecialPkgBtns().hideBtns;
        if (window.hiddenPkgBtns.length > 0) {
            try {
                var getNextShownBtnIdInDirChain = function (dir, target) {
                    try {
                        var dirUpperLetter = dir.substring(0, 1).toUpperCase() + dir.substring(1);
                        var nextFocusingId = eval('target.nextFocus' + dirUpperLetter);
                        // console.debug('nextFocusingId:' + nextFocusingId);
                        return nextFocusingId;
                    } catch (e) {
                        console.error(e);
                    }
                };
                var dirUpperLetter = dir.substring(0, 1).toUpperCase() + dir.substring(1);
                var nextFocusingId = eval('current.nextFocus' + dirUpperLetter);
                if (LMEPG.Func.array.contains(nextFocusingId, window.hiddenPkgBtns)) {
                    console.warn('[' + window.lmcid + '] not support focus to "' + nextFocusingId + '"!');
                    var nextFocusingBtn = LMEPG.BM.getButtonById(nextFocusingId);
                    (function findNextInDirChain(next) {
                        if (!next) return;
                        var nextNextId = getNextShownBtnIdInDirChain(dir, next);
                        if (!is_empty(nextNextId)) {
                            var nextNextBtn = LMEPG.BM.getButtonById(nextNextId);
                            if (nextNextBtn) {
                                if (is_element_exist(nextNextId)
                                    && (typeof isShow === "function" && isShow(nextNextId) || typeof isS === "function" && isS(nextNextId))) {
                                    console.debug('Found next nearby focusable btn: ' + nextNextId);
                                    LMEPG.BM.requestFocus(nextNextId);
                                    return false;
                                } else {
                                    console.error('"' + nextNextId + '" is not exist or already hidden!');
                                    findNextInDirChain(nextNextBtn);
                                }
                            }
                        }
                    })(nextFocusingBtn);
                    return false;
                }
            } catch (e) {
                console.error(e);
            }
        }
    },

    /**
     * 焦点移动前改变
     */
    onBeforeMoveChange: function (direction, current) {
        switch (direction) {
            case "up":
                if (current.id === "confirm" || current.id === "cancel") {
                    var tabId = "btn-product-" + (Pay.lastProductPkgIndex + 1);
                    LMEPG.BM.requestFocus(tabId);
                    return false;
                }
        }
        return true;
    },

    /**
     * 按钮点击
     */
    onClick: function (btn) {
        switch (btn.id) {
            case "confirm":
                SecondToast.init();
                break;
        }
    },

    init: function () {
        Pay.initData();
        //Pay.initStaticButton();
        //Pay.initUIFirst();
        LMEPG.BM.init("btn-product-1", buttons, "", true);
    },

    /**
     * 说明：手动查找匹配，因为我方“后台配置套餐项返回顺序(例：29元->15元->8元)”与“UI展示顺序(例：8元->15元->29元)”
     * 和“从局方鉴权返可订购套餐产品列表数组顺序(可能和绑定定价先后时序有关，例：29元->8元->15元)”可能非同等索引对应。
     * 所以，基于该情景，我们需要手动通过其中的关键信息【价格（authProductObj.productInfos[i].price）】去查找匹配对应，这样更为准确些！
     * <pre>authProductObj示例：
     *      {
     *          "result": "20",
     *          "resultDesc": "用户家庭计费标识为非移动号或未验证，需下发短信进行验证",
     *          "authorizationNum": "",
     *          "productCode": "",
     *          "accountIdentifyPhone": "130000000000",
     *          "noproductInfo": "",
     *          "accountIdentifyNonMobile": "130000000000",
     *          "accountIdentify": "130000000000",
     *          "productInfos": [
     *              {
     *                  "productCode": "xxx",
     *                  "productInfo": "xxxx包月29元",
     *                  "orderContentId": "xxxx",
     *                  "productPrice": "xxx",
     *                  "unit": "2",
     *                  "cycle": "1",
     *                  "validstarttime": "",
     *                  "validendtime": "",
     *                  "price": "2900",
     *                  "displayPrority": "0",
     *                  "paymentType": "xxx",
     *                  "isSalesStrategy": "0",
     *                  "combineProduct": "1"
     *             }
     *          ]
     *      }
     * </pre>
     *
     * 注意：订购成功或失败后轮询最终结果过程中，控制好UI层以禁止用户任何操作，以可保证Pay.lastProductPkgIndex值不变（正在支付->查询中）
     * @param authProductObj [object] 局方鉴权返回的产品信息（包含可订购产品列表）
     * @return {{payOrderItem: {}, payAuthProduct: {}}} 返回匹配可订购产品包信息。可能不存在null或undefined，请上层做好处理（例如：提示“该套餐包申请中，敬请关注...”）。
     * @author Songhui on 2019-12-25
     */
    findMatchAuthProduct: function (authProductObj) {
        LMEPG.Log.info("鉴权返回整个productInfoObj:" + JSON.stringify(authProductObj));
        // 返回数据
        var retData = {
            payOrderItem: null,
            payAuthProduct: null,
        };

        if ((Object.prototype.toString.call(authProductObj) !== "[object Object]") ||
            (Object.prototype.toString.call(authProductObj.productInfos) !== "[object Array]" || authProductObj.productInfos.length === 0)) {
            console.debug("WARING: 无可订购产品包~");
            return retData;
        }

        // 硬编码定义映射顺序，以兼容线上套餐（key: UI上展示套餐包索引号 value：对应的定价，务必与局方申请、后台配置一样的）
        var priceRenderMapping = {
            0: 800,     //体验包
            1: 1500,    //基础包
            2: 2900,    //尊享包
            3: 2000,    //幸福家庭包
            4: 2000,    //爱家健康会员
            5: 5,    //爱家健康会员测试
        };
        console.debug('pkgIndex:' + Pay.lastProductPkgIndex);
        var selectUIPrice = priceRenderMapping[Pay.lastProductPkgIndex];
        if (isSinglePay) selectUIPrice = priceRenderMapping[2];//TODO 暂时兼容线上单套餐，后期上线会完全删除之

        // 通过找到产品id精准找到订购哪个产品
        //var selectProductId = (function (productPrice) {
        //    var payPackageObj = RenderParam.payPackages[productPrice];
        //    return payPackageObj ? payPackageObj.productId : "";
        //})(selectUIPrice);
        if(left_select == "btn-product-1"){
            var selectProductId = "8802001110";
            selectUIPrice = 2000;
        }else if(left_select == "btn-product-2"){
            var selectProductId = "8802000018";
            selectUIPrice = 2900;
        }else if(left_select == "btn-product-3"){
            var selectProductId = "8802000629";
            selectUIPrice = 800;
        }else if(left_select == "btn-product-4"){
            var selectProductId = "8802000630";
            selectUIPrice = 1500;
        }
        console.debug("待订购[" + selectUIPrice + "分]产品id：" + selectProductId);
        LMEPG.Log.info("待订购[" + selectUIPrice + "分]产品id：" + selectProductId);

        var configOrderItems = RenderParam.orderItems;//我方套餐配置项列表
        var purchasableProductList = authProductObj.productInfos;//可订购产品列表

        /*
         * 1、通过 price 匹配查找对应产品（TODO 不太准确：若对应的测试产品id为0.02元，但我方展示的对应套餐为8元）
         * 2、通过局方分发 productId(唯一) 匹配查找对应产品（TODO 更为准确：用它！）
         */
        var isFindByProductId = true;//通过产品id查找
        for (var i = 0, lenI = configOrderItems.length; i < lenI; i++) {
            var item = configOrderItems[i];
            if (item.price == selectUIPrice) {
                retData.payOrderItem = item;
                for (var j = 0, lenJ = purchasableProductList.length; j < lenJ; j++) {
                    var tempProduct = purchasableProductList[j];
                    if (isFindByProductId) {
                        if (tempProduct.productCode/*maybe string*/ == selectProductId) {
                            retData.payAuthProduct = tempProduct;
                            break;
                        }
                    } else {
                        if (tempProduct.price/*maybe string*/ == selectUIPrice) {
                            retData.payAuthProduct = tempProduct;
                            break;
                        }
                    }
                }
                break;
            } else {
                retData.payOrderItem = null;//clear
                retData.payAuthProduct = null;//clear
            }
        }

        console.debug("订购信息：" + JSON.stringify(retData));
        LMEPG.Log.info("订购信息：" + JSON.stringify(retData));

        return retData;
    },

    /**
     * 下单接口
     */
    _ADVPay: function () {
        if (Pay.isClickPaying) {
            console.debug("正在支付中，无需重复操作...");
            return;
        }

        // 查找到匹配对应的“我方配置项”及“对应局方订购包”，我方展示（及后台配置项）顺序与局方订购产品包顺序一致了！
        var payParam = Pay.findMatchAuthProduct(RenderParam.authProductInfo);
        if (payParam.payOrderItem == null || payParam.payAuthProduct == null) {
            LMEPG.UI.showToast('<div id="g_title" class=" g_title">该套餐包申请中，敬请关注...</div>');
            return;
        }

        // 查找到匹配对应的“我方配置项”及“对应局方订购包”后，本地保存起来。支付和查询需要用到！
        Pay.payingData.orderItem = payParam.payOrderItem;
        Pay.payingData.authProduct = payParam.payAuthProduct;

        var postData = {
            orderReason: RenderParam.orderReason,
            remark: RenderParam.remark,
            accountIdentify: RenderParam.authProductInfo.accountIdentify,
            orderItem: JSON.stringify(Pay.payingData.orderItem),
            productInfo: JSON.stringify(Pay.payingData.authProduct),
        };

        LMEPG.UI.showWaitingDialog("正在下单,请等待...");
        LMEPG.ajax.postAPI("Pay/ADVPay", postData, function (data) {
            if (data.result == "0") {
                // 下单成功
                Pay.isClickPaying = true;
                Pay.payingData.payParamInfo = data; // 保存起来
                var payData = {
                    apkInfo: RenderParam.apkInfo,
                    orderItem: Pay.payingData.orderItem,
                    productInfo: Pay.payingData.authProduct,
                    payParamInfo: Pay.payingData.payParamInfo
                };
                LMEPG.UI.showWaitingDialog("下单成功,正在准备订购...");
                LMAndroid.JSCallAndroid.doPay(JSON.stringify(payData), function (param, notifyAndroidCallback) {
                    // 订购结束
                    LMEPG.Log.info("订购SDK返回结果：" + param);
                    LMEPG.UI.showWaitingDialog("SDK订购完成,查询结果...", 30);
                    Pay.loopPayResult();
                });
            } else {
                // 下单失败
                LMEPG.UI.dismissWaitingDialog();
                //LMEPG.UI.showToast(data.resultDesc);
                LMEPG.UI.showToast('<div id="g_title" class=" g_title">'+data.resultDesc+'</div>');
            }
        });
    },

    /**
     * 轮询支付结果
     */
    loopPayResult: function () {
        LMEPG.Log.info("pay.js loopPayResult start ...... ");

        // 统一关闭轮询加载dialog及相关释放提示
        var dismissDialogWithToast = function (msg, isUpdateVerifyCode, isNeedCancelPaying) {
            Pay.resetLoopPayResultFlags(isNeedCancelPaying);
            LMEPG.UI.dismissWaitingDialog();
            //LMEPG.UI.showToast(msg);
            LMEPG.UI.showToast('<div id="g_title" class=" g_title">'+msg+'</div>');
            !!isUpdateVerifyCode && SecondToast.randomNumber();//更新随机码
        };

        var queryData = {
            externalSeqNum: Pay.payingData.payParamInfo.externalSeqNum,
            payNum: Pay.payingData.payParamInfo.payParam.PayNum
        };
        LMEPG.ajax.postAPI("Pay/ADVPayResult", queryData, function (data) {
            if (data && data.result == "0") {
                console.debug("pay.js ADVPayResult data: " + JSON.stringify(data));
                LMEPG.Log.info("pay.js ADVPayResult data: " + JSON.stringify(data));
                if (data.payResult == "0") {
                    // SDK支付成功，调用最终的支付接口
                    LMEPG.UI.dismissWaitingDialog();
                    var payData = {
                        apkInfo: encodeURIComponent(JSON.stringify(RenderParam.apkInfo)),
                        orderItem: JSON.stringify(Pay.payingData.orderItem),
                        productInfo: JSON.stringify(Pay.payingData.authProduct),
                        payParamInfo: JSON.stringify(Pay.payingData.payParamInfo),
                    };
                    LMEPG.UI.showWaitingDialog("SDK订购完成,查询结果完成，准备支付...");
                    LMEPG.ajax.postAPI("Pay/ADVOrder", payData, function (data) {
                        LMEPG.UI.dismissWaitingDialog();
                        if (data && data.result == "0") {
                            dismissDialogWithToast("支付成功！", false, false);
                        } else {
                            dismissDialogWithToast("支付失败！", false, false);
                        }
                        onDelayBack();
                    });
                } else {
                    // SDK支付最终结果暂时未知（可能延时、或可能正在受理中、或可能等待支付、或最终受理失败）
                    // 注：查询结果与局方计费系统入库可能存在时延。故在指定时长段内多次轮询，以达到超时的最终结果为评判标准~（Songhui on 2020-1-7）
                    if (Pay.loopPayResultTimes > Pay.loopPayResultMaxSec) {
                        // 轮询超时！
                        switch (parseInt(data.payResult)) {
                            case 2://支付正在受理中（2）
                                dismissDialogWithToast("支付受理超时，请重试！", true);
                                break;
                            case 3://等待支付（3）
                                dismissDialogWithToast("用户未支付！", true);
                                break;
                            case 1://支付失败（1）
                                dismissDialogWithToast("支付失败！", true);
                                break;
                            default://支付失败（其他状态码）
                                dismissDialogWithToast("支付失败[" + data.payResult + "]！", true);
                                break;
                        }
                    } else {
                        // 继续轮询中...
                        Pay.loopPayResultTimes++;//轮询超时自增1秒
                        setTimeout(Pay.loopPayResult, 1000);
                    }
                }
            } else {
                dismissDialogWithToast("查询订购结果失败！", true);
            }
        });
    }
};

var SecondToast = {

    check_code: '',

    // 多套餐包选项下，切换不同的背景图
    updateVerifyBg: function () {
        var bgUrl = "";
        if (isSinglePay) {
            bgUrl = imgUrl + "/bg_3.png";
        } else {
            bgUrl = imgUrl + "/page2_bg_product" + (Pay.lastProductPkgIndex + 1) + ".png";
        }
        G("second-order-toast").style.backgroundImage = 'url("' + bgUrl + '")';
    },

    init: function () {
        Pay.payingData.reset();
        SecondToast.updateVerifyBg();
        setTimeout(function () {
            Show("second-order-toast");
            LMEPG.BM.requestFocus("second-cancel");
            G("textPhone-text").value = "";
            SecondToast.randomNumber();
        }, 500);//稍微迟延，等切换完不同套餐包背景图再全部显示。
    },

    randomNumber: function () {
        // 根据随机数和运算符显示表达式
        var renderUIExpr = VCAlgorithmTool.getOptimalData(function (expresion, result) {
            return result >= 0 && result < 10;
        }, VCAlgorithmTool.genRules.rule2);
        return renderUIExpr;
        //G("verify").innerHTML = SecondToast.check_code = '' + VCAlgorithmTool.getRandomNumber(1000, 9999);
    },

    /**
     * 输入框焦点变动事件
     */
    onTextPhoneFocusChanged: function (btn, hasFocus) {
        var dom = G(btn.id);
        if (hasFocus) {
            dom.disabled = false;
            dom.focus();
        } else {
            dom.disabled = true;
            dom.blur();
        }
    },

    /**
     * 提交订购
     */
    toSubmit: function () {
        var inputVal = G("textPhone-text").value;
        if (inputVal.trim() === "") {
            console.error("验证码不能为空，请重试~");
            LMEPG.UI.showAndroidToast("验证码不能为空，请重试~");
        } else {
            if (inputVal/*string*/ ==  SecondToast.check_code/* VCAlgorithmTool.calRandomResult().displayResult*/) {
                console.log("验证码正确");
                Pay._ADVPay(); // 执行订购操作
            } else {
                console.error("验证码输入错误");
                LMEPG.UI.showAndroidToast("验证码输入错误");
                SecondToast.randomNumber();
            }
        }
    },
};

/**
 * 简易验证码算法表达式生成工具。VC(Verify-Code)
 * 注：按要求，目前仅支持产生 0~9 的随机个位数，不支持10及其以上的随机数！
 * @author Songhui on 2020-1-19
 */
var VCAlgorithmTool = (function () {
    // 验证码表达式个数（例1（3位混合）：3*5+1。例2（4位混合）：1+2+3+4）
    var VERIFY_CODE_NUMS = 4;

    /** 算法规则-1：（局方要求：1位数混合运算）
     *      1. 取值2-9，不许出现0和1。
     *      2. 乘/除 与 加减 混合。例如：2*3+1、9/3-2
     *      3. 结果非负。
     * @return {Array[]} [随机数,随机符]
     * @author Songhui
     */
    var genRule1 = function () {
        // 获取随机数及运算符
        var numbers = [];
        var symbols = [];
        VERIFY_CODE_NUMS = 3; //（3位混合）：3*5+1

        // （一）生成随机数
        // 规则要求：
        //     1. 取值2-9，不许出现0和1。
        //     2. 乘/除 与 加减 混合。例如：2*3+1、9/3-2
        for (var i = 0; i < VERIFY_CODE_NUMS; i++) {
            var val = Math.floor(Math.random() * 10);
            for (; val === 0 || val === 1;) {
                val = Math.floor(Math.random() * 10);
                if (val !== 0 && val !== 1) {
                    break;
                }
            }
            numbers.push(val);
        }

        //（二）生成随机运算符号
        var canDividePos = [];//查找能“相除”的相邻两个数（前一个必须能整除后一个！）的位置
        for (var i = 0, len = numbers.length; i < len - 1; i++) {
            var a = numbers[i];
            var b = numbers[i + 1];
            if ((a >= b && b !== 0) && (a % b === 0)) {
                canDividePos.push(i); //记录相邻2个数之间，可相除的位置
            }
        }

        // 2.1 动态随机“乘除”（选择其一）
        var isNeedDivSign = canDividePos.length > 0 && (Math.floor(Math.random() * 10) % 2 === 0);
        if (isNeedDivSign) {
            symbols[canDividePos[Math.floor(Math.random() * canDividePos.length)]] = "/"; //在可相除的位置，插入“/”
        } else {
            symbols[Math.floor(Math.random() * (numbers.length - 1))] = "*"; //随机位置插入，“*”
        }

        // 2.2 动态随机“加减”（选择其一）
        var symbolOptions = ["+", "-"]; //允许符号
        var symbolRepeated = false;//符号是否可重用还是只能用一个
        for (var i = 0, len = numbers.length; i < len - 1/*最后一位不需要符号*/; i++) {
            if (typeof symbols[i] === "undefined") {
                var symbolPos = Math.floor(Math.random() * symbolOptions.length); //随机用符号-位置
                var symbolVal = symbolOptions[symbolPos]; //随机用符号-值
                symbols[i] = symbolRepeated ? symbolVal : symbolOptions.splice(symbolOptions.indexOf(symbolVal), 1);//插入并决定是否仅允许一次
            } else {
                // 该位置已经有“乘号”或“除号”了！
            }
        }

        console.debug("[rule-1]->random-numbers：", numbers);
        console.debug("[rule-1]->random-symbols：", symbols);

        // 返回随机数据
        return [numbers, symbols];
    };

    /** 算法规则-2：（局方要求：1位数混合运算）
     *      1. 取值1-9，不许出现0。
     *      2. 一个算式内数字不能重复。例如：2+3-4+5、1+2-2+3
     *      3. 结果非负。
     * @return {Array[]} [随机数,随机符]
     * @author Songhui
     */
    var genRule2 = function () {
        // 获取随机数及运算符
        var numbers = [];
        var symbols = [];
        VERIFY_CODE_NUMS = 4;

        //（一）生成随机数
        // 是否过滤（true-不符合规则条件，需过滤并重新随机；false-符合规则，计入）
        var is_filter = function (val, extraFilterCondition/*额外条件*/) {
            return val === 0 || (typeof extraFilterCondition === "boolean" && extraFilterCondition);
        };
        for (var i = 0; i < VERIFY_CODE_NUMS; i++) {
            var val = Math.floor(Math.random() * 10);
            for (; is_filter(val, (numbers.indexOf(val) !== -1/*已重复*/));) {
                val = Math.floor(Math.random() * 10);
                if (!is_filter(val, (numbers.indexOf(val) !== -1/*已重复*/))) {
                    break;
                }
            }
            numbers.push(val);
        }

        // //（二）生成随机运算符号
        // var canDividePos = [];//查找能“相除”的相邻两个数（前一个必须能整除后一个！）的位置
        // for (var i = 0, len = numbers.length; i < len - 1; i++) {
        //     var a = numbers[i];
        //     var b = numbers[i + 1];
        //     if ((a >= b && b !== 0) && (a % b === 0)) {
        //         canDividePos.push(i); //记录相邻2个数之间，可相除的位置
        //     }
        // }
        //
        // // 2.1 动态随机“乘除”（选择其一）
        // var isNeedDivSign = canDividePos.length > 0 && (Math.floor(Math.random() * 10) % 2 === 0);
        // if (isNeedDivSign) {
        //     symbols[canDividePos[Math.floor(Math.random() * canDividePos.length)]] = "/"; //在可相除的位置，插入“/”
        // } else {
        //     symbols[Math.floor(Math.random() * (numbers.length - 1))] = "*"; //随机位置插入，“*”
        // }

        // 2.2 动态随机“加减”（选择其一）
        var symbolOptions = ["+", "-"]; //允许符号
        var symbolRepeated = true; //符号是否可重用还是只能用一个
        for (var i = 0, len = numbers.length; i < len - 1/*最后一位不需要符号*/; i++) {
            if (typeof symbols[i] === "undefined") {
                var symbolPos = Math.floor(Math.random() * symbolOptions.length); //随机用符号-位置
                var symbolVal = symbolOptions[symbolPos]; //随机用符号-值
                symbols[i] = symbolRepeated ? symbolVal : symbolOptions.splice(symbolOptions.indexOf(symbolVal), 1); //插入并决定是否仅允许一次
            } else {
                // 该位置已经有“乘号”或“除号”了！
            }
        }

        console.debug("[rule-2]->random-numbers：", numbers);
        console.debug("[rule-2]->random-symbols：", symbols);

        // 返回随机数据
        return [numbers, symbols];
    };

    var clazz = function () {
        var self = this;

        // 随机数结构
        var randomData = {
            numbers: [],    //随机数，例如：1 2 3 4
            symbols: [],    //随机运算符号，根据随机数字来决定（长度=随机数长度-1），例如：2+3*2-1
        };

        /**
         * 生成规则
         */
        this.genRules = {
            rule1: genRule1,
            rule2: genRule2,
        };

        /**
         * 生成随机数和随机运算符
         * @param genRuleCallback [function] 生成规则
         * @return {{numbers: Array, symbols: Array}}
         */
        this.genRandomData = function (genRuleCallback) {
            var data = typeof genRuleCallback === "function" ? genRuleCallback() : self.genRules.rule1();
            randomData.numbers = data[0];
            randomData.symbols = data[1];
            return randomData;
        };

        /**
         * 计算返回随机表达式及结果
         * @return {{displayResult: int, displayExpr: string}}
         * @author Songhui
         */
        this.calRandomResult = function () {
            var numbers = randomData.numbers;
            var symbols = randomData.symbols;
            var expr = "";
            for (var i = 0, len = numbers.length; i < len; i++) {
                expr += numbers[i] + "" + (i < len - 1 ? symbols[i] : "")/*最后一个符号不需要*/;
            }
            try {
                var displayResult = eval(expr); //UI显示结果
                var displayExpr = expr.replace("/", "÷"); //UI上显示表达式：把“/”转换为“÷”，给用户展示
            } catch (e) {
                displayResult = -1; //加强eval异常（但一般不会，万一上层调用传入不合法运算符和数字就会产生）
            }
            console.debug(displayExpr + "=" + displayResult);
            return {
                displayExpr: displayExpr,
                displayResult: displayResult,
            };
        };

        /**
         * 随机最优验证表达式及结果。
         * <pre>调用示例：
         *      getOptimalData(function(expresion, result) {
         *          // FILTER THE BEST DATA BY YOURSELF...
         *          return true;//判断条件必须可能存在true情况。约定：千万不能固定返回false，否则造成死循环！！！
         *      }, function() {
         *          // GENERATE RANDOM DATA BY YOURSELF...
         *          return [numbers, symbols];
         *      });
         * </pre>
         * @param resultHandler [function] 结果处理器，用于控制符合提供条件的最优结果，返回bool。[match_condition] resultHandler(expresion, result)
         * @param genRuleCallback [function] 生成规则，用于随机数字及运算符，返回array。[numbers, symbols] genRuleCallback()
         * @author Songhui
         */
        this.getOptimalData = function (resultHandler, genRuleCallback) {
            var isMatched = function (expresion, result) {
                if (typeof resultHandler !== "function") return result >= 0; //默认条件：随机表达式结果非负
                else {
                    var handled = resultHandler(expresion, result);
                    if (typeof handled !== "boolean") return result >= 0; //默认条件：随机表达式结果非负
                    else return handled;
                }
            };

            var renderUIExpr = "";
            for (; ;) {
                VCAlgorithmTool.genRandomData(genRuleCallback);
                var calData = VCAlgorithmTool.calRandomResult();
                if (isMatched(calData.displayExpr, calData.displayResult)) {
                    renderUIExpr = calData.displayExpr;
                    break;
                }
            }
            return renderUIExpr;
        };

        /**
         * 获取随机的4位数
         */
        this.getRandomNumber = function (min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    };
    return new clazz();
})();

function onInputChange(event) {
    if (G("textPhone-text").value.length > 4) {
        G("textPhone-text").value = G("textPhone-text").value.substring(0, 4);
    }
}
