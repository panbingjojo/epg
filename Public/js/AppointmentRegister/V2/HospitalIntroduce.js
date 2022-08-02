/**
 * 返回事件
 */
function onBack() {
    var objHospitalList = LMEPG.Intent.createIntent("appointmentRegisterHospitalDetail");
    objHospitalList.setParam("pageCurrent", pageCurrent);
    objHospitalList.setParam("lastFocusId", lastFocusId);
    objHospitalList.setParam("index", index);
    objHospitalList.setParam("focusId", focusId);
    LMEPG.Intent.jump(objHospitalList, null);
}

var pageCurrent = RenderParam.pageCurrent;
var lastFocusId = RenderParam.lastFocusId;
var focusId = RenderParam.focusId;

/**
 * 焦点移动前事件回调
 */
function onBeforeMoveChange(dir, current) {
    //实现翻页
    if (dir == 'up') {
        if (page > 1) {
            page--;
            createHtml(page)
        }
        return false;
    }
    if (dir == 'down') {
        if (page < parseInt(pageCurrent1)) {
            page++;
            createHtml(page)
        }
        return false;
    }
}

var buttons = [
    {
        id: 'default',
        name: '上一页',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'nextPages',
        nextFocusUp: '',
        nextFocusDown: '',
        click: "",
        focusChange: "",
        beforeMoveChange: onBeforeMoveChange,
        moveChange: "",
    }
];

var index = RenderParam.index;
var page = 1;
var pageCurrent1 = hospitalList[index].pages;   //当前页数
function createHtml(page) {
    G("introduceImg").src = g_appRootPath + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V2/" + hospitalList[index].introduce_img + "_" + page + ".png";
    updateArrows();
}

/**
 * 更新指示箭头
 */
function updateArrows() {
    var arrowLeft = G("prePages");
    var arrowRight = G("nextPages");
    if (page == parseInt(pageCurrent1)) {
        //判断已经到最后面一页
        Show(arrowLeft);
        Hide(arrowRight);
    } else if (page < parseInt(pageCurrent1)) {
        Hide(arrowLeft);
        Show(arrowRight);
    } else {
        Show(arrowLeft);
        Show(arrowRight);
    }
}

window.onload = function () {
    LMEPG.ButtonManager.init('default', buttons, '', true);
    G("detailImg").src = g_appRootPath + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V2/" + hospitalList[index].detail_img + ".png";
    createHtml(page);
};
