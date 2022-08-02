function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent("activity-consultation-new-guide");
    objCurrent.setParam("pageCurrent", pageCurrent);
    objCurrent.setParam("focusId", LMEPG.ButtonManager.getCurrentButton().id);
    return objCurrent;
}

function jumpScanCode() {
    var curObj = getCurrentPage();
    var jumpScanCodeObj = LMEPG.Intent.createIntent("activity-consultation-new-code");

    var cidData = JSON.parse(clinicArr);
    StoreClinicId = cidData.data[0];

    jumpScanCodeObj.setParam("clinicId", StoreClinicId);
    LMEPG.Intent.jump(jumpScanCodeObj, curObj);
}


/**
 * 跳转标记
 * @param flag
 */
function jumpDialog(flag) {
    switch (flag) {
        case 1:
            break;
        case 2:
            break;
        default:
            LMEPG.UI.showToast("网页异常");
            return;
    }
    var curObj = getCurrentPage();
    var jumpScanCodeObj = LMEPG.Intent.createIntent("activity-consultation-new-dialog");
    jumpScanCodeObj.setParam("flag", flag);
    LMEPG.Intent.jump(jumpScanCodeObj, curObj);
}

var Button = {
    initBtn: function () {
        buttons.push(
            {
                id: 'rule_btn',
                name: '活动规则',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: 'back',
                nextFocusDown: '',
                nextFocusRight: 'consultation_btn',
                backgroundImage: g_appRootPath + '/Public/img/hd/Activity/ActivityConsultation/V1/rule_out.png',
                focusImage: g_appRootPath + '/Public/img/hd/Activity/ActivityConsultation/V1/rule_in.png',
                click: JumpPage.jumpRecord,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
            }, {
                id: 'consultation_btn',
                name: '预约记录',
                type: 'img',
                nextFocusLeft: 'rule_btn',
                nextFocusRight: 'photo_box',
                nextFocusUp: 'back',
                nextFocusDown: 'btn-price',
                backgroundImage: g_appRootPath + '/Public/img/hd/Activity/ActivityConsultation/V1/consultation_out.png',
                focusImage: g_appRootPath + '/Public/img/hd/Activity/ActivityConsultation/V1/consultation_in.png',
                click: JumpPage.jumpRecord,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
            },
            {
                id: 'photo_box',
                name: '专家图片',
                type: 'img',
                nextFocusLeft: 'consultation_btn',
                nextFocusUp: 'back',
                nextFocusRight: 'back',
                nextFocusDown: 'btn-price',
                backgroundImage: g_appRootPath + '/Public/img/hd/Activity/ActivityConsultation/V1/photo_box_out.png',
                focusImage: g_appRootPath + '/Public/img/hd/Activity/ActivityConsultation/V1/photo_box_in.png',
                click: JumpPage.jumpRecord,
                focusChange: "",
                beforeMoveChange: beforeMoveChange,
                moveChange: "",
            }, {
                id: 'back',
                name: '返回',
                type: 'img',
                nextFocusLeft: 'photo_box',
                nextFocusUp: 'back',
                nextFocusRight: '',
                nextFocusDown: 'photo_box',
                backgroundImage: g_appRootPath + '/Public/img/hd/Activity/ActivityConsultation/V1/inde_back_out.png',
                focusImage: g_appRootPath + '/Public/img/hd/Activity/ActivityConsultation/V1/inde_back_in.png',
                click: onBack,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
            }
        )
    },

}
var JumpPage = {
    jumpRule: function () {
        var curObj = getCurrentPage();
        var jumpRecordObj = LMEPG.Intent.createIntent("activity-consultation-new-rule");
        LMEPG.Intent.jump(jumpRecordObj, curObj);
    },

    jumpRecord: function (btn) {
        if (btn.id == "rule_btn") {
            var curObj = getCurrentPage();
            var jumpRecordObj = LMEPG.Intent.createIntent("activity-consultation-new-rule");
            LMEPG.Intent.jump(jumpRecordObj, curObj);
        } else if (btn.id == "photo_box") {
            JumpPage.getIsAlreadyAppointment();
        } else {
            var curObj = getCurrentPage();
            var jumpRecordObj = LMEPG.Intent.createIntent("activity-consultation-new-record");
            var cidData = JSON.parse(clinicArr);
            StoreClinicId = cidData.data[0];

            jumpRecordObj.setParam("clinicId", StoreClinicId);
            LMEPG.Intent.jump(jumpRecordObj, curObj);
        }
    },

    //判断是否预约过
    getIsAlreadyAppointment: function () {
        LMEPG.ajax.postAPI("Activity/getActivityHasWinning", null, function (data) {
            console.log("--->" + data);
            try {
                var resObj = data instanceof Object ? data : JSON.parse(data);
                if (resObj.result == 0) {
                    //
                    if (isVip == 1) {
                        jumpScanCode();
                    } else {
                        jumpBuyVip(); //跳转局方订购页
                    }
                } else {
                    //跳转已经预约过
                    jumpDialog(2);
                }
            } catch (e) {
                LMEPG.UI.showToast("获取数据异常：" + e.toString());
                console.log("--->" + e.toString());
            }
        }, function (data) {
            LMEPG.UI.showToast("获取数据请求失败");
            LMEPG.UI.dismissWaitingDialog("");
        });

    }
}

function beforeMoveChange(dir, curent) {
    if (dir == "up") {
        turnUp();
    } else if (dir == "down") {
        turnDown();
    }
}


function turnUp() {
    if (pageCurrent > 1) {
        LMEPG.UI.showWaitingDialog("");
        pageCurrent--;
        createHtml(pageCurrent, LoadPrePageFlag);
    } else {
    }
}

function turnDown() {
    var leveNum = pageNum - pageCurrent;
    if (leveNum > 0) {
        LMEPG.UI.showWaitingDialog("");
        pageCurrent++;
        createHtml(pageCurrent, LoadNextPageFlag);
    } else {
    }
}


function createHtml(innerPageCurrent, LoadPageFlag) {

    var start = (innerPageCurrent - 1);//数组截取起始位置
    //数组截取终止位置
    var singleArr = initClinicArr.data.slice(start, innerPageCurrent);
    var clinicId = singleArr[0];
    StoreClinicId = clinicId;

    LMEPG.Inquiry.expertApi.getExpertDetail(clinicId, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var tempData = rsp instanceof Object ? rsp : JSON.parse(rsp);
            var code = parseInt(tempData.code);
            if (code === 0) {
                var expertObj = tempData["data"][0];
                G("photo_img").src = LMEPG.Inquiry.expertApi.createDoctorUrl(expertUrl, expertObj.doctor_user_id, expertObj.doctor_avatar, lmcid);
                G("doctor").innerHTML = expertObj.doctor_name;
                G("job_name").innerHTML = expertObj.doctor_level;
                G("hospital").innerHTML = expertObj.doctor_hospital_name;
                G("content").innerHTML = expertObj.doctor_skill;
                LMEPG.Log.info("goodAt>>>>>" + expertObj.doctor_skill);
                console.log(expertObj.doctor_skill);
                pageNum = initClinicArr.data.length;
                G("page").innerHTML = pageCurrent + "/" + pageNum;
                updateArrows();
            } else {
                switch (LoadPageFlag) {
                    case LoadInitPageFlag:
                        break;
                    case LoadNextPageFlag:
                        pageCurrent--
                        break;
                    case LoadPrePageFlag:
                        pageCurrent++;
                        break;
                }
                LMEPG.UI.showToast("加载失败:" + code);
            }
        } catch (e) {
            LMEPG.UI.showToast("获取专家详情数据解析异常！");
        }
    }, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast("获取专家详情请求失败");
    });
}

function onBack() {
    // LMEPG.Intent.back();
    LMEPG.Intent.back('IPTVPortal');
}

window.onload = function (ev) {
    if (innerRoute == "0" || userId == "") { // 请求接口进行鉴权
        authUser();
    } else {
        initActivity();
    }
}

function authUser() {
    LMEPG.UI.showWaitingDialog("");
    var EPGParams = {
        stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
        stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
        epgDomain: LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
        stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
        epgUserId: LMEPG.STBUtil.getUserId(),    // 盒子绑定的用户ID
        userToken: LMEPG.STBUtil.getUserToken(), // 用户当前的token值
        authNode: 'activity',                    // 用户当前鉴权的节点（例如启动页传入，splash）
        vipState: 0,                             // 当前的用户身份
        userAccount: userAccount,                // 用户账号
    }
    LMEPG.Log.debug("LMAuthUser->authByNetwork->postData->" + JSON.stringify(EPGParams));
    // LMEPG.ajax.postAPI("Users/authUser", EPGParams, function (respData) {
    // //测试服测试
    LMEPG.ajax.postAPI("User/authUser", EPGParams, function (respData) {
        LMEPG.UI.dismissWaitingDialog();
        userId = respData.userId;
        isVip = respData.isVip;
        initActivity();
    }, function (errorData) {
        LMEPG.Log.error("LMSplashModel->authByNetwork->error->" + errorData);
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast("页面初始失败！");
    })
}

/**
 * 活动内部初始化流程
 */
function initActivity() {
    initData();
    Button.initBtn();
    initClinicArr = JSON.parse(clinicArr);

    if (null != initFocusId && undefined != initFocusId && initFocusId != "") {
        LMEPG.ButtonManager.init(initFocusId, buttons, '', true);
    } else {
        LMEPG.ButtonManager.init(['photo_box'], buttons, '', true);
    }

    // lmInitGo();
}

/**
 * 初始化页面数据
 */
function initData() {
    html = '<!-- 默认标签：防止焦点丢失 -->' +
        '<if condition="$carrierId neq \'640094\' and  $carrierId neq \'620092\'">' +
        '    <a id="default_link" href="#"><img class="grubFocusImg" src="'+ g_appRootPath +'/Public/img/Common/spacer.gif"/></a>' +
        '</if>' +
        '<div id="debug" style="position: absolute; top: 0px; left: 0px; font-size: 40px;color: red"></div>' +
        '<img id="rule_btn" class="btn" src="'+ g_appRootPath +'/Public/img/'+ platformType +'/Activity/ActivityConsultation/V1/rule_out.png"/>' +
        '<!--<img id="detail_btn" class="btn"-->' +
        '<!--src="__ROOT__/Public/img/{$platformType}/Activity/ActivityConsultation/V1/detail_out.png"/>-->' +
        '<img id="consultation_btn" class="btn"' +
        '     src="'+ g_appRootPath +'/Public/img/'+ platformType +'/Activity/ActivityConsultation/V1/consultation_out.png"/>' +
        '<img id="back" class="btn"' +
        '     src="'+ g_appRootPath +'/Public/img/'+ platformType +'/Activity/ActivityConsultation/V1/inde_back_out.png"/>' +
        '<img id="photo_box" src="'+ g_appRootPath +'/Public/img/'+ platformType +'/Activity/ActivityConsultation/V1/photo_box_out.png"/>' +
        '<img id="photo_img" src="'+ g_appRootPath +'/Public/img/hd/DoctorExpert/1002016.png"' +
        '     onerror="this.src=\''+ g_appRootPath +'/Public/img/hd/Expert/init_doctor.png\'"/>' +
        '<img id="pre_page" style="display: none"' +
        '     src="'+ g_appRootPath +'/Public/img/'+ platformType +'/Activity/ActivityConsultation/V1/pre_page.png"/>' +
        '<img id="next_page" style="display: none"' +
        '     src="'+ g_appRootPath +'/Public/img/'+ platformType +'/Activity/ActivityConsultation/V1/next_page.png"/>' +
        '<div class="title">' +
        '    <span id="doctor"></span>&nbsp;|&nbsp;<span id="job_name"></span>&nbsp;|&nbsp;<span id="hospital"></span>' +
        '</div>' +
        '<div class="good_at">擅长：</div>' +
        '<div id="content"></div>' +
        '<div id="page" style="display: none">1/10</div>' +
        '<div class="time"></div>';
    G('container').innerHTML = html;
    var doctorId = JSON.parse(clinicArr).data[0];
    G('doctor').innerHTML = doctors[doctorId].doctor + ':';
    G('job_name').innerHTML = doctors[doctorId].jobName;
    G('hospital').innerHTML = doctors[doctorId].hospital;
    G('content').innerHTML = doctors[doctorId].content;
    G('photo_img').src = g_appRootPath + '/Public/img/hd/DoctorExpert/' + doctors[doctorId].photoImg;
    document.body.style.backgroundImage = 'url("'+g_appRootPath+'/Public/img/hd/Activity/ActivityConsultation/V2/'+ doctors[doctorId].bodyBg +'")';
}

/**
 * 更新指示箭头
 */
function updateArrows() {
    var top_pages = document.getElementById("pre_page");
    var bottom_pages = document.getElementById("next_page");
    top_pages.style.display = "none";
    bottom_pages.style.display = "none";
    var leveNum = pageNum - pageCurrent;
    if (pageCurrent > 1) {
        top_pages.style.display = "block";
    }

    if (leveNum > 0) {
        bottom_pages.style.display = "block";
    }
}


/**
 * @func 进行购买操作
 * @param id 当前页的焦点位置
 * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
 * @returns {boolean}
 */
function jumpBuyVip() {
    var objCurrent = getCurrentPage();

    var objOrderHome = LMEPG.Intent.createIntent("orderHome");
    objOrderHome.setParam("userId", userId);
    objOrderHome.setParam("directPay", "1");
    objOrderHome.setParam("orderReason", "101");
    objOrderHome.setParam("remark", activityName);

    LMEPG.Intent.jump(objOrderHome, objCurrent);
}

