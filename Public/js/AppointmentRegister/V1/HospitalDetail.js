/**
 * 返回事件
 */
function onBack() {

    var objHospitalList = LMEPG.Intent.createIntent("appointmentRegister");
    objHospitalList.setParam("pageCurrent", pageCurrent);
    objHospitalList.setParam("lastFocusId", lastFocusId);
    objHospitalList.setParam("areaId", RenderParam.areaId);

    LMEPG.Intent.jump(objHospitalList, null);
}

var pageCurrent = RenderParam.pageCurrent;
var lastFocusId = RenderParam.lastFocusId;
var domImgCode = RenderParam.domImgCode; //显示二维码的img标签

var buttons = [
    {
        id: 'default',
        name: '默认焦点',
        type: 'img',
        nextFocusLeft: '',
        nextFocusUp: '',
        nextFocusDown: 'area_btn',
        backgroundImage: '',
        focusImage: '',
        click: "",
        focusChange: "",
        beforeMoveChange: "",
        moveChange: "",
    }
];

/**
 * 更新二维码s
 */
function updateImgCode() {
    var postData = {"hospital_id": RenderParam.hospitalId};
    LMEPG.ajax.postAPI("AppointmentRegister/getHospitalDetailInfo", postData, function (data) {
        var result = data.result;
        if (result == 0) {
            //获取成功
            domImgCode.src = data.data.url;
        } else {
            //获取失败
            LMEPG.UI.showToast("获取医院二维码失败:" + result, 3);
        }
    }, function () {
        LMEPG.UI.showToast("获取医院二维码异常", 3);
    });
}

window.onload = function () {
    LMEPG.ButtonManager.init('default', buttons, '', true);
    updateImgCode();
};