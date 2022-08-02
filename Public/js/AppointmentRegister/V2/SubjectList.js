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
    }
];

var index = RenderParam.index;

function createHtml() {
    G("title").innerHTML = hospitalList[index].hosl_name;
    var tabConent = G("tabConent");//数据块
    var strtable = '';
    tabConent.innerHTML = "";
    var initCol = 0;
    for (var i = 0; i < hospitalList[index].subject.length; i++) {
        initCol++;
        strtable += '<div id="focus-1-' + initCol + '">' + hospitalList[index].subject[i].subject_name + '</div> ';
    }
    tabConent.innerHTML = strtable;
}

window.onload = function () {
    LMEPG.ButtonManager.init('default', buttons, '', true);
    G("detailImg").src = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/AppointmentRegister/V2/" + hospitalList[index].detail_img + ".png";
    createHtml();
};