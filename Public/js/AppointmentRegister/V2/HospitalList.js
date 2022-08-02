/**
 * 获取当前页对象
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent("appointmentRegister");
}

/**
 * 跳转到医院详情页
 */
function goHospitalDetail(index) {
    var hospitalItem = hospitalList[((pageCurrent - 1) * 6) + index - 1]
    var objCurrent = getCurrentPage();
    var objHospitalDetail = LMEPG.Intent.createIntent("appointmentRegisterHospitalDetail");
    objHospitalDetail.setParam("hoslName", hospitalItem.hosl_name);
    objHospitalDetail.setParam("address", hospitalItem.address);
    objHospitalDetail.setParam("hoslId", hospitalItem.hosl_id);
    objHospitalDetail.setParam("telephone", hospitalItem.telepone);
    objHospitalDetail.setParam("detailImg", hospitalItem.detail_img);
    objHospitalDetail.setParam("code", hospitalItem.code);
    objHospitalDetail.setParam("pageCurrent", pageCurrent);
    objHospitalDetail.setParam("index", hospitalItem.index);
    objHospitalDetail.setParam("lastFocusId", LMEPG.ButtonManager.getCurrentButton().id);

    LMEPG.Intent.jump(objHospitalDetail, objCurrent);
}

/**
 * 返回事件
 */
function onBack() {
    //回到活动界面
    LMEPG.Intent.back();
}

var pageCurrent = RenderParam.pageCurrent;   //当前页数
var lastFocusId = RenderParam.lastFocusId;   //在当前页的位置
var sumPageCurrent = Math.ceil(hospitalList.length / 6);
var buttons = [
    {
        id: 'hos-1-1-border',
        name: '医院1',
        type: 'img',
        titleId: 'hos-title-1',
        nextFocusLeft: '',
        nextFocusRight: 'hos-1-2-border',
        nextFocusUp: 'area_btn',
        nextFocusDown: 'hos-2-1-border',
        click: "goHospitalDetail(1)",
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: 'hos-1-2-border',
        name: '选择区域',
        type: 'img',
        titleId: 'hos-title-2',
        nextFocusLeft: 'hos-1-1-border',
        nextFocusRight: 'hos-1-3-border',
        nextFocusUp: 'area_btn',
        nextFocusDown: 'hos-2-2-border',
        click: "goHospitalDetail(2)",
        focusChange: onFocus,
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'hos-1-3-border',
        name: '选择区域',
        type: 'img',
        titleId: 'hos-title-3',
        nextFocusLeft: 'hos-1-2-border',
        nextFocusRight: '',
        nextFocusUp: 'area_btn',
        nextFocusDown: 'hos-2-3-border',
        click: "goHospitalDetail(3)",
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: 'hos-2-1-border',
        name: '选择区域',
        type: 'img',
        titleId: 'hos-title-4',
        nextFocusLeft: '',
        nextFocusRight: 'hos-2-2-border',
        nextFocusUp: 'hos-1-1-border',
        nextFocusDown: '',
        click: "goHospitalDetail(4)",
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    },
    {
        id: 'hos-2-2-border',
        name: '选择区域',
        type: 'img',
        titleId: 'hos-title-5',
        nextFocusLeft: 'hos-2-1-border',
        nextFocusRight: 'hos-2-3-border',
        nextFocusUp: 'hos-1-2-border',
        nextFocusDown: '',
        click: "goHospitalDetail(5)",
        focusChange: onFocus,
        beforeMoveChange: "",
        moveChange: "",
    },
    {
        id: 'hos-2-3-border',
        name: '选择区域',
        type: 'img',
        titleId: 'hos-title-6',
        nextFocusLeft: 'hos-2-2-border',
        nextFocusRight: '',
        nextFocusUp: 'hos-1-3-border',
        nextFocusDown: '',
        click: "goHospitalDetail(6)",
        focusChange: onFocus,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    }
]


/**
 * 焦点移动前事件回调
 * @param prev
 * @param btn
 * @param hasFocus
 */
function onBeforeMoveChange(dir, current) {
    //实现翻页
    if ((dir == 'left') && (current.id == "hos-1-1-border" || current.id == "hos-2-1-border")) {
        if (current.id == "hos-1-1-border") {
            lastFocusId = "hos-1-3-border";
        } else if (current.id == "hos-2-1-border") {
            lastFocusId = "hos-2-3-border";
        }
        turnUp();
        return false;
    }
    if (dir == 'right' && (current.id == "hos-1-3-border" || current.id == "hos-2-3-border")) {
        if (current.id == "hos-1-3-border") {
            lastFocusId = "hos-1-1-border";
        } else if (current.id == "hos-2-3-border") {
            lastFocusId = "hos-1-1-border";
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
    createHtml();
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
    createHtml();
    LMEPG.ButtonManager.requestFocus(lastFocusId);
}

/**
 * 医院列表获得焦点
 */
function onFocus(btn, hasFocus) {
    if (hasFocus == true) {
        G(btn.id).style.visibility = "visible";
    } else {
        G(btn.id).style.visibility = "hidden";
    }
    LMEPG.UI.Marquee.stop();
}


/**
 * 创建医生列表显示的内容
 */
function createHtml() {
    var start = (pageCurrent - 1) * 6;//数组截取起始位置
    var end = pageCurrent * 6;//数组截取终止位置
    var tabConent = G("tabConent");//医院列表的父布局
    updateArrows();
    LMEPG.UI.Marquee.stop();
    var strtable = ''; //保存6个医院的html代码
    tabConent.innerHTML = "";
    var initCol = 0;
    var initCol2 = 0;
    var newArr = hospitalList.slice(start, end);
    for (var i = 0; i < newArr.length; i++) {
        if (i <= 2) {
            initCol++;
            strtable += '<div class="hos_focus' + initCol + '">';
            strtable += '<img id="hos-1-' + initCol + '-border" class="hos-border" src="' + LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/hos_boder.png"/>';
            strtable += '<img id="hos-1-' + initCol + '" class="hos-img" src="' + LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/' + newArr[i].hosl_pic + '.png"/>';
            strtable += '</div>';
        } else {
            initCol++;
            initCol2++;
            strtable += '<div class="hos_focus' + initCol + '">';
            strtable += '<img id="hos-2-' + initCol2 + '-border" class="hos-border" src="' + LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/hos_boder.png"/>';
            strtable += '<img id="hos-2-' + initCol2 + '" class="hos-img" src="' + LMEPG.App.getAppRootPath() + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/' + newArr[i].hosl_pic + '.png"/>';
            strtable += '</div>';
        }
    }
    tabConent.innerHTML = strtable;
}

/**
 * 更新指示箭头
 */
function updateArrows() {
    var arrowLeft = G("left_page");
    var arrowRight = G("right_page");
    if (sumPageCurrent == 0 || sumPageCurrent == 1) {
        Hide(arrowLeft);
        Hide(arrowRight);
        return;
    }
    if (pageCurrent == sumPageCurrent) {
        //判断已经到最后面一页
        Show(arrowLeft);
        Hide(arrowRight);
    } else if (pageCurrent == 1) {
        Hide(arrowLeft);
        Show(arrowRight);
    } else {
        Show(arrowLeft);
        Show(arrowRight);
    }
}

window.onload = function () {
    if (LMEPG.Func.isEmpty(pageCurrent)) pageCurrent = 1;
    if (LMEPG.Func.isEmpty(lastFocusId)) lastFocusId = 'hos-1-1-border';
    createHtml();
    LMEPG.ButtonManager.init(lastFocusId, buttons, '', true);
};
