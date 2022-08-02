var CwsData = {};

var hospitalImagePath = "hospitalImg/"; // 医院相关图片路径

function goInquiry() {
    var objDoctorP2P = {};
    var objCurrent = LMEPG.Intent.createIntent('hospital-index-version');
    objCurrent.setParam("userId", RenderParam.userId);
    objCurrent.setParam('hospitalId', RenderParam.hospitalId);
    objCurrent.setParam('hospitalName', RenderParam.hospitalName);
    objCurrent.setParam('version', RenderParam.version);
    objCurrent.setParam('function', RenderParam.functions);
    objDoctorP2P = LMEPG.Intent.createIntent("doctorList");
    objDoctorP2P.setParam("userId", RenderParam.userId);
    objDoctorP2P.setParam("hospitalId", RenderParam.hospitalId);
    var hospitalName = G('title').innerText;
    objDoctorP2P.setParam("hospitalName", hospitalName);
    objDoctorP2P.setParam("s_demo_id", 'superDemo');

    LMEPG.Intent.jump(objDoctorP2P, objCurrent);
}

function jumpEducation() {
    //预约挂号跳转，显示
    if (CwsData.jkjyEnable === false || CwsData.smyyEnable === true) {
        G('piece-3').style.display = 'block';
        return;
    }

    //健康教育跳转
    var objCurrent = LMEPG.Intent.createIntent('hospital-index-version');
    objCurrent.setParam("userId", RenderParam.userId);
    objCurrent.setParam('hospitalId', RenderParam.hospitalId);
    objCurrent.setParam('hospitalName', RenderParam.hospitalName);
    objCurrent.setParam('version', RenderParam.version);
    objCurrent.setParam('function', RenderParam.functions);
    objCurrent.setParam('focusId', LMEPG.ButtonManager.getCurrentButton().id);
    var addr = LMEPG.Intent.createIntent('album');
    addr.setParam('albumName', '39Featured');
    addr.setParam('areaName', RenderParam.hospitalName);
    LMEPG.Intent.jump(addr, objCurrent);
}

/**
 * 返回事件
 */
function onBack() {
    if (G("piece-3").style.display == "block") {
        G("piece-3").style.display = "none";
        return;
    }
    var goHistoryHospitals = ["beijingbaicao", "akeshunancheng", "kuerleshizhongyiyiyuan", "awatiyiyuan",
        "huanweilupianquguanweihui", "tianshanquheijiashanguanweihui",
        "shufuxianwukusakezhenweishengyuan", "kashidiquyingjishaxianchengzhenweishengyuan",
        "hulianwangyiliaofuwu", "fuyun",
        "hulianwangyiliaofuwu", "aletaidiqufuyoubaojianyuan",
        "hebaxiangshequ", "shenglilushequ"];
    if (goHistoryHospitals.indexOf(RenderParam.hospitalName) > -1) {
        LMEPG.Intent.back();
    } else {
        LMEPG.Intent.back("IPTVPortal");
    }

}

// 解析医生头像工具
function resolveImgToLocal2(urlPrefix, avatarUrl, doctorId) {
    var head = {
        func: 'getDoctorHeadImage',
        carrierId: "650092",
        areaCode: ''
    };
    var json = {
        doctorId: doctorId,
        avatarUrl: avatarUrl
    };
    return urlPrefix + '?head=' + JSON.stringify(head) + '&json=' + JSON.stringify(json);
}

CwsData = {
    hospitalId: '',
    jkjyEnable: false,// 是否为健康教育按钮
    smyyEnable: false, // 是否为上门预约按钮
    swichAjaxData: function () {
        var postData = {
            'hospId': RenderParam.hospitalId
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Doctor/getHospitalList', postData,
            function (data) {
                try {
                    var result = data.code;
                    if (result == 0) {
                        var hospData = data.hospitalInfo[0];
                        CwsData.hospitalId = hospData.hosl_id;
                        CwsData.renderCws(hospData);
                        // CommunityHosp.hospitalImg = hospData.hosp_image_url;
                    } else { // 设置号码失败
                        LMEPG.UI.showToast("没有拿到数据！" + data.result);
                    }
                } catch (e) {
                    LMEPG.UI.showToast("获取模板处理异常！");
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("获取模板发生错误！");
            }
        );

    },
    getHospData: function () {
        CwsData.swichAjaxData();
    },
    renderCws: function (data) {
        // diff
        G('hosName-1').innerText = data.hosl_name;
        G('title').innerText = data.hosl_name;
        G('introduce').innerHTML = data.hosp_introduce;
        var hospitalUrl = resolveImgToLocal2("http://120.70.237.86:10000/cws/39hospital/index.php", data.hosp_image_url, CwsData.hospitalId);
        G("piece-0-pic").src = hospitalUrl;
        LMEPG.UI.dismissWaitingDialog();
    },

    init: function () {
        CwsData.getHospData();
        console.log(RenderParam.hospitalName);
        var functions = RenderParam.functions.split(',');

        if (functions.indexOf('jkzx') == -1) {
            G('piece-1-btn').parentNode.removeChild(G('piece-1-btn'));
        }

        if (functions.indexOf('yygh') == -1 && functions.indexOf('jkjy') == -1 && functions.indexOf("smyy") == -1) {
            G('piece-2-btn').parentNode.removeChild(G('piece-2-btn'));
        } else if(functions.indexOf("smyy") > -1) {
            G("piece-2-btn").src = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/btn_order.png';
            LMEPG.BM.getButtonById("piece-2-btn").backgroundImage = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/btn_order.png';
            LMEPG.BM.getButtonById("piece-2-btn").focusImage = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/btn_order_f.png';
            G('piece-3-1').src = RenderParam.resourcesUrl + hospitalImagePath + RenderParam.hospitalId + "/appointment_dialog.png";
            this.smyyEnable = true;
        } else {
            if (functions.indexOf('yygh') > -1) {
                G("piece-2-btn").src = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/bg_guahao.png';
                LMEPG.BM.getButtonById("piece-2-btn").backgroundImage = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/bg_guahao.png';
                LMEPG.BM.getButtonById("piece-2-btn").focusImage = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/bg_guao_f.png';
            } else {
                this.jkjyEnable = true;
            }
        }

    },
}