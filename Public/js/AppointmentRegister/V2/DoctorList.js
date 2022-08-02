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

var index = RenderParam.index;
var page = 1;   //当前页数
var sumPageCurrent = Math.ceil(hospitalList[index].doctor.length / 3);
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
        if (page < parseInt(sumPageCurrent)) {
            page++;
            createHtml(page)
        }
        return false;
    }
}

/**
 * 焦点移动前事件回调
 * @param prev
 * @param btn
 * @param hasFocus
 */

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
        moveChange: "",
        beforeMoveChange: onBeforeMoveChange,
    }
];

function createHtml() {
    var start = (page - 1) * 3;//数组截取起始位置
    var end = page * 3;//数组截取终止位置
    var tabConent = G("tabConent");//医院列表的父布局
    updateArrows();
    var strtable = ''; //保存6个医院的html代码
    tabConent.innerHTML = "";
    var initCol = 0;
    var newArr = hospitalList[index].doctor.slice(start, end);
    for (var i = 0; i < newArr.length; i++) {
        initCol++;
        strtable += '<div  id="card_' + initCol + '"><div class="doc_name">' + newArr[i].doctor_name + '</div>';
        strtable += '<div class="doc_job">' + newArr[i].position + '</div>';
        strtable += '<img class="photo" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/photo_img.png" />';
        strtable += '<div class="doc_subject">' + newArr[i].subject_name + '</div>';
        strtable += '<div class="doc_good">' + newArr[i].good_at + '</div>';
        strtable += "</div>";
    }
    tabConent.innerHTML = strtable;
}

/**
 * 更新指示箭头
 */
function updateArrows() {
    var arrowLeft = G("prePages");
    var arrowRight = G("nextPages");
    if (page == parseInt(sumPageCurrent)) {
        //判断已经到最后面一页
        Show(arrowLeft);
        Hide(arrowRight);
    } else if (page < parseInt(sumPageCurrent)) {
        Hide(arrowLeft);
        Show(arrowRight);
    } else {
        Show(arrowLeft);
        Show(arrowRight);
    }
}

window.onload = function () {
    G("title").innerHTML = hospitalList[index].hosl_name;
    LMEPG.ButtonManager.init('default', buttons, '', true);
    console.log(hospitalList[index].doctor.slice(3, 6));
    G("detailImg").src = g_appRootPath + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V2/" + hospitalList[index].detail_img + ".png";
    createHtml(page)
};
