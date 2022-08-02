/**
 * 获取当前页对象
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent("appointmentRegisterHospitalDetail");
}

/**
 * 跳转到医院详情页
 */
function goHospitalIntroduce(index) {
    var objCurrent = getCurrentPage();
    var objHospitalDetail = LMEPG.Intent.createIntent("appointmentRegisterHospitalIntroduce");
    objHospitalDetail.setParam("index", index);
    objHospitalDetail.setParam("pageCurrent", pageCurrent);
    objHospitalDetail.setParam("lastFocusId", lastFocusId);
    objHospitalDetail.setParam("focusId", LMEPG.ButtonManager.getCurrentButton().id);
    LMEPG.Intent.jump(objHospitalDetail, objCurrent);
}

/**
 * 跳转到科室列表
 */
function goSubjectList(index) {
    var objCurrent = getCurrentPage();

    var objHospitalDetail = LMEPG.Intent.createIntent("appointmentSubjectList");
    objHospitalDetail.setParam("index", index);
    objHospitalDetail.setParam("pageCurrent", pageCurrent);
    objHospitalDetail.setParam("lastFocusId", lastFocusId);
    objHospitalDetail.setParam("focusId", LMEPG.ButtonManager.getCurrentButton().id);
    LMEPG.Intent.jump(objHospitalDetail, objCurrent);
}

/**
 * 跳转到医生列表
 */
function goDoctorList(index) {
    var objCurrent = getCurrentPage();
    var objHospitalDetail = LMEPG.Intent.createIntent("appointmentDoctorList");
    objHospitalDetail.setParam("index", index);
    objHospitalDetail.setParam("pageCurrent", pageCurrent);
    objHospitalDetail.setParam("lastFocusId", lastFocusId);
    objHospitalDetail.setParam("focusId", LMEPG.ButtonManager.getCurrentButton().id);
    LMEPG.Intent.jump(objHospitalDetail, objCurrent);
}

/**
 * 返回事件
 */
function onBack() {

    var objHospitalList = LMEPG.Intent.createIntent("appointmentRegister");
    objHospitalList.setParam("pageCurrent", pageCurrent);
    objHospitalList.setParam("lastFocusId", lastFocusId);

    LMEPG.Intent.jump(objHospitalList, null);
}

var focusId = RenderParam.focusId;
var pageCurrent = RenderParam.pageCurrent;
var lastFocusId = RenderParam.lastFocusId;
var index = RenderParam.index;

var buttons = [
    {
        id: 'detail',
        name: '医院详情',
        type: 'img',
        nextFocusLeft: '',
        nextFocusUp: '',
        nextFocusDown: 'subject',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/bg_hos_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/f_hos_btn.png',
        click: "goHospitalIntroduce(" + index + ")",
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
    }, {
        id: 'subject',
        name: '推荐科室',
        type: 'img',
        nextFocusLeft: '',
        nextFocusUp: 'detail',
        nextFocusDown: 'doctor',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/bg_subj_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/f_subj_btn.png',
        click: "goSubjectList(" + index + ")",
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
    }, {
        id: 'doctor',
        name: '推荐专家',
        type: 'img',
        nextFocusLeft: '',
        nextFocusUp: 'subject',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/bg_doct_btn.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V2/f_doct_btn.png',
        click: "goDoctorList(" + index + ")",
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
    }
];

window.onload = function () {
    G("hos_img").src = g_appRootPath + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V2/" + hospitalList[index].detail_img + ".png";
    G("title").innerHTML = hospitalList[index].hosl_name;
    G("address_word").innerHTML = hospitalList[index].address;
    G("telephone").innerHTML = hospitalList[index].telepone;
    G("imgCode").src = g_appRootPath + '/Public/img/' + RenderParam.platformType + "/AppointmentRegister/V2/" + hospitalList[index].code + ".png";
    LMEPG.ButtonManager.init(LMEPG.Func.isEmpty(focusId) ? 'detail' : focusId, buttons, '', true);
};
