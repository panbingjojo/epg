function onBeforeMoveChange(dir, current) {
    LMEPG.Func.gridBtnUtil.onCommonMoveChange(dir, current, "focus", "-");
}

/**
 * 跳转到医院列表页
 */
function goHospitalDetail(index) {
    var areaInfo = areaList[index];

    var objHospitalList = LMEPG.Intent.createIntent("appointmentRegister");
    objHospitalList.setParam("areaId", areaInfo.city_id);

    LMEPG.Intent.jump(objHospitalList, null);
}

/**
 * 返回事件
 */
function onBack() {
    LMEPG.Intent.back();
}

var areasId = ["focus-1-1", "focus-1-2", "focus-2-1", "focus-2-2", "focus-3-1", "focus-3-2", "focus-4-1", "focus-4-2", "focus-5-1", "focus-5-2", "focus-6-1", "focus-6-2"];
var areasData = JSON.parse(RenderParam.areasData);
var guaHaoUrl = RenderParam.guahaoUrl;
var areaList;
var buttons = [];

/**
 * 更新区域
 */
function updateAreas() {
    if (areasData.result != 0) {
        LMEPG.UI.showToast("获取地区列表出错:" + areasData.result, 3);
        return;
    }
    areaList = areasData.list[0].city;
    var html = "";
    var i = 0;
    var picPath = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/AppointmentRegister/";
    for (i; i < areasId.length && i < areaList.length; i++) {
        html += '<div id="' + areasId[i] + '">' + areaList[i].city_name + '</div>';
        buttons[i] = LMEPG.ButtonManager.createButton(
            areasId[i],
            areaList[i].city_name,
            "",
            "",
            "",
            "",
            picPath + "/V1/area_btn_out.png",
            picPath + "/V1/area_btn_in.png",
            "goHospitalDetail(" + i + ")",
            onFocusBtn,
            onBeforeMoveChange,
            ""
        );
    }
    G("areaText").innerHTML = html;
    LMEPG.ButtonManager.init(areasId[0], buttons, '', true);
}

/**
 *  按钮获得焦点
 */
function onFocusBtn(btn, hasFocus) {
    if (hasFocus) {
        G(btn.id).style.backgroundImage = 'url(' + btn.focusImage + ')';
        G(btn.id).style.color = '#000000';
        LMEPG.UI.Marquee.start(btn.id, 5, 2, 50, "left", "scroll");
    } else {
        G(btn.id).style.backgroundImage = 'url(' + btn.backgroundImage + ')';
        G(btn.id).style.color = '#ffffff';
        LMEPG.UI.Marquee.stop();
    }
}

window.onload = function () {
    updateAreas();
};
