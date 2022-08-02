/**
 * 获取当前页对象
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent("appointmentRegisterRecord");
}

/**
 * 跳转到挂号详情页
 */
function goRecordDetail(index) {
    var recordItem = recordList[((pageCurrent - 1) * 2) + index - 1]

    var objCurrent = getCurrentPage();
    var objHospitalDetail = LMEPG.Intent.createIntent("appointmentRegisterRecordDetail");
    objHospitalDetail.setParam("order_id", recordItem.orderId);
    objHospitalDetail.setParam("pageCurrent", pageCurrent);
    objHospitalDetail.setParam("lastFocusId", LMEPG.ButtonManager.getCurrentButton().id);

    LMEPG.Intent.jump(objHospitalDetail, objCurrent);
}

/**
 * 跳转到更多挂号记录页面
 */
function goMoreRecord() {
    if (moreRecordUrl == null || moreRecordUrl == "") {
        LMEPG.UI.showToast("没有更多医院挂号记录", 3);
        return;
    }
    var objCurrent = getCurrentPage();
    var objMoreRecord = LMEPG.Intent.createIntent("appointmentRegisterRecordMoreRecord");
    objMoreRecord.setParam("moreRecordUrl", moreRecordUrl);

    LMEPG.Intent.jump(objMoreRecord, objCurrent);
}

/**
 * 返回事件
 */
function onBack() {
    LMEPG.Intent.back();
}

var guaHaoUrl = RenderParam.guahaoUrl;
var recordListInfos = RenderParam.recordListInfos;
var recordList = JSON.parse(recordListInfos).list.list;
var moreRecordUrl = JSON.parse(recordListInfos).list.url;
var pageCurrent = RenderParam.pageCurrent;   //当前页数
var lastFocusId = RenderParam.lastFocusId;   //在当前页的位置
var sumPageCurrent = Math.ceil(recordList.length / 2);

var buttons = [
    {
        id: 'appoint_btn',
        name: '更多医院挂号记录',
        type: 'img',
        nextFocusLeft: '',
        nextFocusUp: '',
        nextFocusDown: 'detail_btn1',
        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V1/more_btn_out.png',
        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V1/more_btn_in.png',
        click: "goMoreRecord()",
        focusChange: onFocusBtn,
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'detail_btn1',
        name: '查看详情1',
        type: 'img',
        nextFocusLeft: '',
        nextFocusUp: 'appoint_btn',
        nextFocusDown: 'detail_btn2',
        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V1/detail_btn_out.png',
        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V1/detail_btn_in.png',
        click: "goRecordDetail(1)",
        focusChange: onFocusBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: 'detail_btn2',
        name: '查看详情2',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: 'detail_btn1',
        nextFocusDown: '',
        click: "goRecordDetail(2)",
        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V1/detail_btn_out.png',
        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V1/detail_btn_in.png',
        focusChange: onFocusBtn,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    }
];

/**
 * 焦点移动前事件回调
 */
function onBeforeMoveChange(dir, current) {
    //实现翻页
    if (dir == 'left') {
        turnUp();
        return false;
    }
    if (dir == 'right') {
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
    createHtml();
    LMEPG.ButtonManager.requestFocus(LMEPG.ButtonManager.getCurrentButton().id);
}

/**
 * 向后翻页
 */
function turnDown() {
    if (pageCurrent >= sumPageCurrent) {
        return;
    }
    pageCurrent++;
    createHtml();
    LMEPG.ButtonManager.requestFocus(LMEPG.ButtonManager.getCurrentButton().id);
}

/**
 *  按钮获得焦点
 */
function onFocusBtn(btn, hasFocus) {
    if (hasFocus == true) {
        G(btn.id).style.backgroundImage = 'url(' + btn.focusImage + ')';
        G(btn.id).style.color = '#000000';
    } else {
        G(btn.id).style.backgroundImage = 'url(' + btn.backgroundImage + ')';
        G(btn.id).style.color = '#ffffff';
    }
}

/**
 * 创建医生列表显示的内容
 */
function createHtml() {
    var start = (pageCurrent - 1) * 2;//数组截取起始位置
    var end = pageCurrent * 2;//数组截取终止位置
    var tabConent = G("tabConent");//医院列表的父布局
    updateArrows();
    LMEPG.UI.Marquee.stop();
    var strtable = ''; //保存6个医院的html代码
    tabConent.innerHTML = "";
    var initCol = 0;
    var initCol2 = 0;
    var newArr = recordList.slice(start, end);
    for (var i = 0; i < newArr.length; i++) {
        initCol++;
        strtable += '<div class="detail_card' + initCol + '">';
        strtable += '<div class="card_title">' + newArr[i].hospitalName + '</div>';
        strtable += ' <div class="card_name">患者姓名：' + newArr[i].patientName + '</div>';
        strtable += '  <div class="card_doctor">科室医生：' + newArr[i].expertName + '</div>';
        strtable += '  <div class="card_time">就诊时间：' + newArr[i].shiftDate + newArr[i].shiftWeek + newArr[i].timeRangeName + newArr[i].timeSection + '</div>';
        strtable += '  <div class="card_money">合计费用：' + newArr[i].regFee + '</div>';
        strtable += '  <div id="detail_btn' + initCol + '" class="btn_detail">查看详情</div>';
        strtable += '</div>';
    }
    tabConent.innerHTML = strtable;
}

/**
 * 更新指示箭头
 */
function updateArrows() {
    var arrowLeft = G("left_page");
    var bottom_pages = G("right_page");
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

window.onload = function (ev) {
    if (pageCurrent == null || pageCurrent == "") {
        pageCurrent = 1;
    }
    if (lastFocusId == null || lastFocusId == "") {
        lastFocusId = 'detail_btn1';
    }
    if (recordList.length == 0) {
        LMEPG.UI.showToast("暂无挂号记录，可以在右上方查看更多医院挂号记录", 3);
        lastFocusId = "appoint_btn";
    }
    createHtml(pageCurrent);
    LMEPG.ButtonManager.init(lastFocusId, buttons, '', true);
};