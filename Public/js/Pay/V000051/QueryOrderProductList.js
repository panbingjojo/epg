var rootUrl = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Pay/V000051/queryOrderProductList/";
var toastPicUrl = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Common/";
var pageCurrent = RenderParam.pageCurrent;   //当前页数
var lastFocusId = RenderParam.lastFocusId;   //在当前页的位置
var productId;//产品ID;
var focusId;
var myProductList = []; // 39健康的商品信息
var sumPageCurrent = 0;
var isShowToast = false; // 是否已经弹出提示框 true--表示已经弹出

var buttons = [
    {
        id: 'hos-1-1',
        name: '产品1',
        type: 'img',
        titleId: 'hos-title-1',
        nextFocusLeft: '',
        nextFocusRight: 'hos-1-2',
        nextFocusUp: 'area_btn',
        nextFocusDown: 'hos-2-1',
        click: isRenew,
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: 'hos-1-2',
        name: '产品2',
        type: 'img',
        titleId: 'hos-title-2',
        nextFocusLeft: 'hos-1-1',
        nextFocusRight: 'hos-1-3',
        nextFocusUp: 'area_btn',
        nextFocusDown: 'hos-2-2',
        click: isRenew,
        focusChange: onFocus,
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'hos-1-3',
        name: '产品3',
        type: 'img',
        titleId: 'hos-title-3',
        nextFocusLeft: 'hos-1-2',
        nextFocusRight: '',
        nextFocusUp: 'area_btn',
        nextFocusDown: 'hos-2-3',
        click: isRenew,
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: 'hos-2-1',
        name: '产品4',
        type: 'img',
        titleId: 'hos-title-4',
        nextFocusLeft: '',
        nextFocusRight: 'hos-2-2',
        nextFocusUp: 'hos-1-1',
        nextFocusDown: '',
        click: isRenew,
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: 'hos-2-2',
        name: '产品5',
        type: 'img',
        titleId: 'hos-title-5',
        nextFocusLeft: 'hos-2-1',
        nextFocusRight: 'hos-2-3',
        nextFocusUp: 'hos-1-2',
        nextFocusDown: '',
        click: isRenew,
        focusChange: onFocus,
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'hos-2-3',
        name: '产品6',
        type: 'img',
        titleId: 'hos-title-6',
        nextFocusLeft: 'hos-2-2',
        nextFocusRight: '',
        nextFocusUp: 'hos-1-3',
        nextFocusDown: '',
        click: isRenew,
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: 'book_stop',
        name: '取消续订',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'cancel',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: rootUrl + 'bg_book_stop.png',
        focusImage: rootUrl + 'f_book_stop.png',
        click: updateStatus,
        moveChange: "",
    },
    {
        id: 'cancel',
        name: '关闭',
        type: 'img',
        nextFocusLeft: 'book_stop',
        nextFocusRight: 'cancel',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: rootUrl + 'bg_cancel.png',
        focusImage: rootUrl + 'f_cancel.png',
        click: closeToast,
        moveChange: "",
    },
    {
        id: 'default_focus',
        name: '关闭',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        click: closeToast,
        moveChange: "",
    }
    ,
    {
        id: 'success_focus',
        name: '关闭',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        click: updateHtml,
        moveChange: "",
    }
]

window.onload = function (ev) {
    // 先隐藏掉左、右箭头
    var top_pages = document.getElementById("left_page");
    var bottom_pages = document.getElementById("right_page");
    top_pages.style.display = "none";
    bottom_pages.style.display = "none";

    if (pageCurrent == null || pageCurrent == "") {
        pageCurrent = 1;
    }
    if (lastFocusId == null || lastFocusId == "") {
        lastFocusId = 'hos-1-1';
    }
    // 加载数据
    getData();
};

/**
 * 加载界面数据
 */
function getData() {
    var postData = {"page": pageCurrent};
    LMEPG.ajax.postAPI("Products/queryOrderProductList", postData, function (data) {
        // 把data转成json对象
        data = data instanceof Object ? data : JSON.parse(data);
        if (data.result == 0) {
            var productList = data.orders;

            // 过滤出39健康的数据
            var count = 0;
            for (var item = 0; item < productList.length; item++) {
                var productId = productList[item].productId.substr(0, 4);
                // domain 产品域 1：Linux 2：Android
                if ((productId == '39jk' || productId == "sjjk") && (productList[item].domain == 1)) {
                    myProductList[count++] = productList[item];
                }
            }

            sumPageCurrent = Math.ceil(myProductList.length / 6);
            createHtml();
            LMEPG.ButtonManager.init(lastFocusId, buttons, '', true);
        } else {
            G("tabConent").innerHTML = '<div class="record_null">没有订购记录！</div>';
            LMEPG.ButtonManager.init("default_focus", buttons, '', true);
        }
    });

}

/**
 * 焦点移动前事件回调
 */
function onBeforeMoveChange(dir, current) {
    //实现翻页
    if ((dir == 'left') && (current.id == "hos-1-1" || current.id == "hos-2-1")) {
        if (current.id == "hos-1-1") {
            lastFocusId = "hos-1-3";
        } else if (current.id == "hos-2-1") {
            lastFocusId = "hos-2-3";
        }
        turnUp();
        return false;
    }
    if (dir == 'right' && (current.id == "hos-1-3" || current.id == "hos-2-3")) {
        if (current.id == "hos-1-3") {
            lastFocusId = "hos-1-1";
        } else if (current.id == "hos-2-3") {
            lastFocusId = "hos-1-1";
        }
        turnDown();
        return false;
    }
}

/**
 * 向前翻页
 */
function turnUp() {
    if (pageCurrent <= 1) {
        return;
    }
    pageCurrent--;
    getData();
    LMEPG.ButtonManager.requestFocus(lastFocusId);
}

/**
 * 向后翻页
 */
function turnDown() {
    if (pageCurrent >= sumPageCurrent) {
        return;
    }
    pageCurrent++;
    getData();
    LMEPG.ButtonManager.requestFocus(lastFocusId);
}

/**
 * 医院列表获得焦点
 */
function onFocus(btn, hasFocus) {
    if (hasFocus == true) {
        var focusImg = G(btn.id).getAttribute("selectImg");
        G(btn.id).src = focusImg;
    } else {
        var rootImg = G(btn.id).getAttribute("rootImg");
        G(btn.id).src = rootImg;
    }
}


/**
 * 创建医生列表显示的内容
 */
function createHtml() {
    var start = (pageCurrent - 1) * 6;//数组截取起始位置
    var end = pageCurrent * 6;//数组截取终止位置
    var tabConent = document.getElementById("tabConent");//医院列表的父布局

    var strtable = ''; //保存6个医院的html代码
    tabConent.innerHTML = "";
    var initCol = 0;
    var initCol2 = 0;
    var newArr = myProductList.slice(start, end);
    for (var i = 0; i < newArr.length; i++) {
        updateArrows();
        if (i <= 2) {
            initCol++;
            strtable += '<div class="hos_focus' + initCol + '">';
            // cancelOrderFlag退订标识 1：未退订 2：已退订  3：不可退订（比如营业厅订购，不允许在电视上退订，或者单次产品，不允许退订）
            if (newArr[i].cancelOrderFlag == "1") {
                strtable += '<img id="hos-1-' + initCol + '" isRenew=' + newArr[i].cancelOrderFlag + ' productId = ' + newArr[i].productId + ' class="hos-img" src="' + rootUrl + 'already_order_s.png" selectImg="' + rootUrl + 'already_order_b.png" rootImg="' + rootUrl + 'already_order_s.png"/>';
                strtable += '<div class="go_price">续订价格：￥' + newArr[i].fee / 100 + '/月' + '</div>';
            } else {
                strtable += '<img id="hos-1-' + initCol + '" isRenew=' + newArr[i].cancelOrderFlag + ' productId = ' + newArr[i].productId + ' class="hos-img" src="' + rootUrl + 'no_order_s.png" selectImg="' + rootUrl + 'no_order_b.png" rootImg="' + rootUrl + 'no_order_s.png"/>';
            }

            // 把商品名称由 “39健康10元” 转成 “39健康”
            strtable += '<div class="product_name">' + newArr[i].productName.substr(0, 4) + '</div>';
            // 把时间 20171224163415 转成 2017.12.24
            strtable += '<div class="book_time">订购时间：' + newArr[i].startTime.substr(0, 4) + '.' + newArr[i].startTime.substr(4, 2) + '.' + newArr[i].startTime.substr(6, 2) + '</div>';
            // 把格式 1000分转成10元
            strtable += '<div class="book_price">订购价格：￥' + newArr[i].fee / 100 + '/月' + '</div>';
            strtable += '</div>';
        } else {
            initCol++;
            initCol2++;
            strtable += '<div class="hos_focus' + initCol + '">';
            if (newArr[i].order_status == "0") {
                strtable += '<img id="hos-2-' + initCol2 + '" isRenew=' + newArr[i].cancelOrderFlag + ' productId = ' + newArr[i].productId + ' class="hos-img" src="' + rootUrl + 'already_order_s.png" selectImg="' + rootUrl + 'already_order_b.png" rootImg="' + rootUrl + 'already_order_s.png"/>';
                strtable += '<div class="go_price">续订价格：￥' + newArr[i].fee / 100 + '/月' + '</div>';
            } else {
                strtable += '<img id="hos-2-' + initCol2 + '" isRenew=' + newArr[i].cancelOrderFlag + ' productId = ' + newArr[i].productId + ' class="hos-img" src="' + rootUrl + 'no_order_s.png" selectImg="' + rootUrl + 'no_order_b.png" rootImg="' + rootUrl + 'no_order_s.png"/>';
            }
            // 把商品名称由 “39健康10元” 转成 “39健康”
            strtable += '<div class="product_name">' + newArr[i].productName.substr(0, 4) + '</div>';
            // 把时间 20171224163415 转成 2017.12.24
            strtable += '<div class="book_time">订购时间：' + newArr[i].startTime.substr(0, 4) + '.' + newArr[i].startTime.substr(4, 2) + '.' + newArr[i].startTime.substr(6, 2) + '</div>';
            // 把格式 1000分转成10元
            strtable += '<div class="book_price">订购价格：￥' + newArr[i].fee / 100 + '/月' + '</div>';
            strtable += '</div>';
        }
    }
    tabConent.innerHTML = strtable;
}

/**
 * 更新指示箭头
 */
function updateArrows() {
    var top_pages = document.getElementById("left_page");
    var bottom_pages = document.getElementById("right_page");
    if (sumPageCurrent == 0 || sumPageCurrent == 1) {
        top_pages.style.display = "none";
        bottom_pages.style.display = "none";
        return;
    }
    if (pageCurrent == sumPageCurrent) {
        //判断已经到最后面一页
        top_pages.style.display = "block";
        bottom_pages.style.display = "none";
    } else if (pageCurrent == 1) {
        top_pages.style.display = "none";
        bottom_pages.style.display = "block";
    } else {
        top_pages.style.display = "block";
        bottom_pages.style.display = "block";
    }
}

/**
 * 判断是否为续订
 */
function isRenew(btn) {
    var isRenew = G(btn.id).getAttribute("isRenew");
    //如果是续订状态，弹出退订窗口
    // isRenew 退订标识 1：未退订 2：已退订  3：不可退订（比如营业厅订购，不允许在电视上退订，或者单次产品，不允许退订）
    if (isRenew == "1") {
        var sHtml = "";
        sHtml += '<div class="toast_bg">';
        sHtml += '<img id="book_stop" src="' + rootUrl + 'bg_book_stop.png"/>';
        sHtml += '<img id="cancel" src="' + rootUrl + 'bg_cancel.png"/>';
        sHtml += '</div>';
        G("toast").innerHTML = sHtml;
        isShowToast = true;
        LMEPG.ButtonManager.requestFocus("book_stop");
        productId = G(btn.id).getAttribute("productId");//产品的ID
        focusId = btn.id;

    } else {
        focusId = btn.id;
        var _html = '<img id="default_focus" src="' + toastPicUrl + 'toast.png"/>';
        _html += '<div id="toast_message_text">已退订，不可操作</div>'; // 提示内容
        _html += '<div id="toast_message_submit">确认</div>'; // 确定按钮
        G("toast").innerHTML = _html;
        isShowToast = true;
        LMEPG.ButtonManager.requestFocus("default_focus");
    }
}

/**
 * 改变订购状态
 */
function updateStatus(btn) {
    // 调用 取消续订的接口
    cancelOrderProduct(btn);
}

/**
 * 取消订购商品
 */
function cancelOrderProduct(btn) {
    var postData = {"productId": productId};
    LMEPG.ajax.postAPI("Products/cancelOrderProduct", postData, function (data) {
        closeToast();
        // 把data转成json对象
        data = data instanceof Object ? data : JSON.parse(data);
        var _html = "";
        if (data.result == 0) {
            _html = '<img id="success_focus" src="' + toastPicUrl + 'toast.png"/>';
            _html += '<div id="toast_message_text">恭喜你退订39健康成功</div>'; // 提示内容
            _html += '<div id="toast_message_submit">确认</div>'; // 确定按钮
            G("toast").innerHTML = _html;
            isShowToast = true;
            LMEPG.ButtonManager.requestFocus("success_focus");
        } else {
            _html = '<img id="default_focus" src="' + toastPicUrl + 'toast.png"/>';
            _html += '<div id="toast_message_text">退订失败，请重试</div>'; // 提示内容
            _html += '<div id="toast_message_submit">确认</div>'; // 确定按钮
            G("toast").innerHTML = _html;
            isShowToast = true;
            LMEPG.ButtonManager.requestFocus("default_focus");
        }
    });
}

/**
 * 关闭弹窗
 */
function updateHtml() {
    G("toast").innerHTML = "";
    lastFocusId = focusId;

    // 重新刷新页面数据
    getData();
}

/**
 * 返回事件
 */
function onBack() {
    // 如果已经弹框，按返回时，把弹框关闭，不进行后续操作
    if (isShowToast) {
        closeToast();
        return;
    }

    //回到活动界面
    LMEPG.Intent.back();
}

/**
 * 关闭弹窗
 */
function closeToast() {
    isShowToast = false;
    G("toast").innerHTML = "";
    LMEPG.ButtonManager.requestFocus(focusId);
}