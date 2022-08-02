function goInquiry() {
    var objDoctorP2P = {};
    var objCurrent = LMEPG.Intent.createIntent('hospital-index');
    objCurrent.setParam("userId", RenderParam.userId);
    objCurrent.setParam('hospitalName', RenderParam.hospitalName);
    objDoctorP2P = LMEPG.Intent.createIntent("doctorList");
    objDoctorP2P.setParam("userId", RenderParam.userId);
    objDoctorP2P.setParam("hospitalId", CwsData.areaMap());
    var hospitalName = G('title').innerText;
    objDoctorP2P.setParam("hospitalName", hospitalName);
    objDoctorP2P.setParam("s_demo_id", 'superDemo');

    LMEPG.Intent.jump(objDoctorP2P, objCurrent);
}

function jumpEducation() {
    if (RenderParam.hospitalName == "wulumuqiyalan") {
        G('piece-3').style.display = 'block'
    } else {
        var objDoctorP2P = {};
        var objCurrent = LMEPG.Intent.createIntent('hospital-index');
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam('hospitalName', RenderParam.hospitalName);
        objDoctorP2P = LMEPG.Intent.createIntent("album");
        objDoctorP2P.setParam("userId", RenderParam.userId);
        objDoctorP2P.setParam('albumName', '39Featured');
        LMEPG.Intent.jump(objDoctorP2P, objCurrent);

    }

}

/**
 * 返回事件
 */
function onBack() {
    if (G("piece-3").style.display == "block") {
        G("piece-3").style.display = "none";
        return
    }
    if (RenderParam.hospitalName == "beijingbaicao" || RenderParam.hospitalName == "akeshunancheng") {
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

var CwsData = {
    hospitalId: '',
    swichAjaxData: function () {
        var postData = {
            'hospId': CwsData.areaMap()
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
    areaMap: function () {
        var hospitalId = "";
        switch (RenderParam.hospitalName) {
            //服务热线
            case "dabanchengyiyuan":
                hospitalId = "TN9082";
                break;
            case "huimingjikunyiyuan":
                hospitalId = "TN9085";
                break;
            case "huixuanyuanshequfuwuzhan":
                hospitalId = "TN9087";
                break;
            case "wulumuqimaliyiyuan":
                hospitalId = "TN9088";
                break;
            case "shanshanyiyuan":
                hospitalId = "TN5112";
                break;
            case "kuerleshi":
                hospitalId = "TN9106";
                break;
            case "akeshunancheng":
                hospitalId = "TN9115";
                break;
            case "hongxingerchang":
                hospitalId = "TN9121";
                break;
            case "165tuan":
                hospitalId = "TN9215";
                break;
            case "wujiaqushihui":
                hospitalId = "TN9256";
                break;
            case "beijingbaicao":
                hospitalId = "TN9436";
                break;
            case "wulumuqiyalan":
                hospitalId = "TN9440";
                break;
            case "wulumuqierdaoqiaoyiyuan":
                hospitalId = "TN9454";
                break;
            case "hetiandiqu":
                hospitalId = "TN9114";
                break;
            case "diyishialaer":
                hospitalId = "TN9459";
                break;
            case "saimachang":
                hospitalId = "TN8923";
                break;
            case "saimachanghonhqishequ":
                hospitalId = "TN9465";
                break;
            case "huyangshirenmingyiyuan":
                hospitalId = "TN9477";
                break;
            case "huixiangshequfuwuzhan":
                hospitalId = "TN9490";
                break;
            case "shaquyangzijiangshequweishengfuwuzhongxin":
                hospitalId = "TN9493";
                break;
            case "shuixigouzhenpingxiliangcunweishengshi":
                hospitalId = "TN9494";
                break;
            case "hongyangshequweisehngfuwuzhan":
                hospitalId = "TN9553";
                break;
            case "yiningxianzhongyiyiyuan":
                hospitalId = "TN9557";
                break;
            case "baichengxianrenminyiyuan":
                hospitalId = "TN9573";
                break;
            case "aketaoxianrenminyiyuan":
                hospitalId = "TN3408";
                break;
            default:
                hospitalId = "TN9082";
                break;
        }
        return hospitalId;
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

        if (RenderParam.hospitalName != "akeshunancheng" && RenderParam.hospitalName != "wulumuqiyalan") {
            G('piece-2-btn').parentNode.removeChild(G('piece-2-btn'))
        } else if (RenderParam.hospitalName == "wulumuqiyalan") {
            G("piece-2-btn").src = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/bg_guahao.png';
            LMEPG.BM.getButtonById("piece-2-btn").backgroundImage = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/bg_guahao.png';
            LMEPG.BM.getButtonById("piece-2-btn").focusImage = '/Public/img/hd/Activity/ActivityCommunityHospital/V4/bg_guao_f.png';

        }
    },
}