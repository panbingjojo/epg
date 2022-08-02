//返回按键
function onBack() {
    LMEPG.Intent.back();
}

//订购-跳转局方订购页
function startPay() {
    if (getProducts(customerId, productId, contentId, '', '') == 1) {
        //TODO 说明产品已经订购, 需要做特殊处理
        onBack();
    } else {
        //还没有订购，发起订购
        onBuyVip(focusIdName);
    }
}

var tradeNo = '';     //订单号
var productId = '1000000080';
var contentId = '2417005800';
var contentName = '39健康';
var customerId = RenderParam.customerId;
var price = 1500;
var productIdThirds = [];
productIdThirds[0] = '2417005800';//合作方产品ID  15元包月
//productIdThirds[1] = "2417005801";//合作方产品ID  10元包月
//productIdThirds[2] = "2417005802";//合作方产品ID} 5元包月
//productIdThirds[2] = "2417005803";//合作方产品ID} 3元包月

//TODO 订购项和按钮的映射关系配置 ，如果服务器上的配置项修改，需要做对应的映射
var orderButtonMap = [];
//orderButtonMap["focus-2-1"] = 18;        //山东联通订购id 测试
orderButtonMap["focus-2-1"] = 1;        //山东联通订购id 现网

//触发订购
function onBuyVip(id) {
    if (!isClickBuy) {
        var orderItemId = orderButtonMap[id];      //对应订购项的ID

        //查找订购项
        var orderItem = undefined;
        for (var index = 0; index < RenderParam.orderItems.length; index++) {
            if (RenderParam.orderItems[index].vip_id == orderItemId) {
                orderItem = RenderParam.orderItems[index];
                price = orderItem.price;
                break;
            }
        }

        // 判断订购项是否存在
        if (typeof orderItem != 'undefined') {
            //拉取订单号订购
            var reqData = {
                'orderItemId': orderItem.vip_id
            };
            getOrderTradeNo(reqData);
        } else {
            LMEPG.UI.showToast('订购项不存在', 3);
            //TODO 如果没有找到的订购项，返回对应的页面，这儿默认返回上一页
            onBack();
        }
    }
}

/** 获取订单号 */
function getOrderTradeNo(reqData) {
    LMEPG.ajax.postAPI('Pay/getOrderTradeNo', reqData, function (data) {
        if (data.result == 0) {
            //获取订购地址并发起订购
            tradeNo = data.tradeNo;
            orderProduct(customerId, productId, contentId, contentName, price);
        } else {
            LMEPG.UI.showToast('生成订购信息失败[code=' + data.result + ']', 3);
            //错误页面或者回到门户地址
            isClickBuy = false;
            onBack();
        }
    }, function (data) {
        LMEPG.UI.showToast('生成订购信息异常[code=' + data.toString() + ']', 3);
        isClickBuy = false;
        onBack();
    });
}

/** 山东联通鉴权接口 */
function getProducts(contentId, customerId, productId, userCode, productIdThirds) {
    var result = 0;
    sdk.doGetProducts(contentId, customerId, productId, userCode, productIdThirds, function (resultCode, resultMsg) {
        if (resultCode == 1) {
            var jsonResult = JSON.parse(resultMsg);
            result = goAuth(jsonResult, productIdThirds);
            //doAuthResult(authResult);
        } else if (resultCode == 0) {
            result = 0;
        }
    });
    return result;
}

/** 山东联通处理鉴权json */
function goAuth(jsonObj, productIdThirds) {
    var authType = 0;
    for (var i in productIdThirds) {
        for (var j in jsonObj.list) {
            if (productIdThirds[i] == jsonObj.list[j].productIdThird) {
                var sauthResult = jsonObj.list[i].status;
                if (sauthResult == 1) {
                    authType++;
                }
            }
        }
    }
    if (authType > 0) {
        return 1;
    } else {
        return 0;
    }
}

/**  产品订购 */
function orderProduct(customerId, productId, contentId, contentName, price) {
    var boxId = '';
    LMEPG.ajax.getBasePagePath('orderCallback', function (pageName, data) {
        if (data != '') {
            var redirectUrl = 'http://' + '<?php echo $_SERVER[\'HTTP_HOST\'] ?>'
                + data + '/'
                + '?userId=' + userId
                + '*customerId=' + customerId
                + '*productId=' + productId
                + '*contentId=' + contentId
                + '*contentName=' + contentName
                + '*price=' + price
                + '*tradeNo=' + tradeNo
                + '*result=' + 'success'
                + '*returnUrl=' + encodeURIComponent(RenderParam.returnUrl);
            var failUrl = 'http://' + '<?php echo $_SERVER[\'HTTP_HOST\'] ?>'
                + data + '/'
                + '?userId=' + userId
                + '*customerId=' + customerId
                + '*productId=' + productId
                + '*contentId=' + contentId
                + '*contentName=' + contentName
                + '*price=' + price
                + '*tradeNo=' + tradeNo
                + '*result=' + 'fail'
                + '*returnUrl=' + encodeURIComponent(RenderParam.returnUrl);
            var broadbandid = customerId;
            var param2 = '';
            var param3 = '';
            var param4 = '{\'spId\':\'16860\',\'productId\':\'' + contentId + '\'}';
            var param5 = '';
            var userCode = '16860';//企业代码

            var productIdThird = contentId;
            var platform = '';
            sdk.doOrderProduct(boxId, productId, customerId, contentId, contentName, price,
                redirectUrl, failUrl, broadbandid, param2, param3, param4, param5, userCode,
                productIdThird, platform, function (resultCode, resultMsg) {
                    LMEPG.Log.info('doOrderProduct370093::resultCode:' + resultCode + ';resultMsg:' + resultMsg);
                    if (resultCode == 1) {
                        //TODO 调用成功
                    } else {
                        //TODO 调用失败
                    }
                }
            );
        }
    });
}

var isClickBuy = false;      //是否已经点击了购买，
var userId = '$userId';

var buttons = [
    {
        id: 'focus-1-1',
        type: 'img',
        name: '返回按钮',
        focusable: true,
        nextFocusLeft: 'focus-2-1',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: 'focus-2-1',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V370093/payback1.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V370093/payback0.png',
        click: onBack,
        focusChange: '',
        beforeMoveChange: '',
        moveChange: ''
    },
    {
        id: 'focus-2-1',
        type: 'img',
        name: '订购按钮-包月',
        focusable: true,
        nextFocusLeft: '',
        nextFocusRight: 'focus-1-1',
        nextFocusUp: 'focus-1-1',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V370093/paymonth0.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V370093/paymonth1.png',
        click: startPay,
        focusChange: '',
        beforeMoveChange: '',
        moveChange: ''
    }
];

//页面加载完成
window.onload = function () {
    if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
        //TODO 订购项为空，需要做出错处理，暂时使用返回上一页的方式
        onBack();
    } else {
        LMEPG.ButtonManager.init('focus-2-1', buttons, '', true);//默认选中包月会员
    }
};
