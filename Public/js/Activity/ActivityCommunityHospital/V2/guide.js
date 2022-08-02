/**
 * 加载医生信息。
 * @param hospitalId
 * @param deptId
 * @param page
 * @param pageSize
 */
function loadDoctorList(hospitalId, deptId, page, pageSize) {
    LMEPG.UI.showWaitingDialog();
    getDoctorList(hospitalId, deptId, page, pageSize, function (deptId, page, pageSize, data) {
        LMEPG.UI.dismissWaitingDialog();
        if (data.result.code == 0) {
            // 绑定医生信息到页面
            buildDoctorInfo(data.result.list);
        } else {
            LMEPG.Log.error("获取信息失败，code : " + data.result.code);
        }

    });
}

/**
 * 拉取医生list
 * @param data
 */
function getDoctorList(hospitalId, deptId, page, pageSize, callback) {
    var postData = {};
    postData.deptId = ((deptId === "全部科室") ? "" : deptId);
    postData.page = page;
    postData.pageSize = pageSize;
    postData.hospId = hospitalId;
    LMEPG.ajax.postAPI("Doctor/getDoctorListByHospId", postData, function (data) {
        LMEPG.call(callback, [deptId, page, pageSize, data]);
    }, function () {
        LMEPG.UI.showToast("获取医生列表失败！");
    });
}

/**
 * 拉取医生信息绑定要页面上
 * @param doctors
 */
function buildDoctorInfo(doctors) {
    console.log(doctors);
    var doctorInfo = doctors[0];
    if (doctors.length == 0 || doctorInfo == 'undefined') {
        LMEPG.UI.showToast("获取医生信息失败!", 3);
        return;
    }

    var expertUrl = resolveImgToLocal("http://120.70.237.86:10000/cws/39hospital/index.php", doctorInfo.doc_id, doctorInfo.avatar_url, '650092');
    console.log(expertUrl);
    // 填写医生信息
    G('piece-1-pic').src = expertUrl;
    G('doctor-name').innerHTML = doctorInfo.doc_name;
    G('doctor-position').innerHTML = doctorInfo.job_title;
    G('doctor-dep').innerHTML = '<span id="doctor-hospital">' + doctorInfo.department + "  " + doctorInfo.hospital + '</span>'
    G('doctor-goods').innerHTML = '<span id="goods-title">特长: </span>' + doctorInfo.good_disease;
}

function goInquiry() {
    var objDoctorP2P = {};
    var objCurrent = LMEPG.Intent.createIntent('activity-common-guide');
    objCurrent.setParam("userId", RenderParam.userId);
    objCurrent.setParam("s_demo_id", 'superDemo');

    objDoctorP2P = LMEPG.Intent.createIntent("doctorList");
    objDoctorP2P.setParam("userId", RenderParam.userId);
    objDoctorP2P.setParam("hospitalId", RenderParam.hospitalId);
    var hospitalName = G('title').innerText;
    objDoctorP2P.setParam("hospitalName", hospitalName);
    objDoctorP2P.setParam("s_demo_id", 'superDemo');

    LMEPG.Intent.jump(objDoctorP2P, objCurrent);
}
/**
 * 返回事件
 */
function onBack() {
    LMEPG.Intent.back("IPTVPortal");
}

// 解析医生头像工具
function resolveImgToLocal(urlPrefix, doctorId, avatarUrl, carrierID) {
    var head = {
        func: 'getDoctorHeadImage',
        carrierId: carrierID,
        areaCode: ''
    };
    var json = {
        doctorId: doctorId,
        avatarUrl: avatarUrl
    };
    return urlPrefix + '?head=' + JSON.stringify(head) + '&json=' + JSON.stringify(json);
}