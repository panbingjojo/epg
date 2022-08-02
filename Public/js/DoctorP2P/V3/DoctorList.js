<!-- 处理视频问诊医生列表 -->
var doctors = [];
var doctorCount = 0;
var currentPage = RenderParam.currentPage;
var currentDeptId = RenderParam.currentDeptId; //全部科室
var currentDeptIndex = RenderParam.currentDeptIndex; // 科室编号
var MAX_PAGE_STEP = 4;      //每页获取四个医生
var focusId = RenderParam.focusId;       //默认焦点
var isLoading = false;
var direction = "";
var focusDeptBtnId = "secondary_img_1"; //当前选中科室的button id
var phone = RenderParam.phone;

var InitGlobalParam = {
    DepartmentArr: []
};

/**
 * 加载医生信息。
 * @param deptId
 * @param deptIndex
 * @param page
 * @param pageSize
 */
function loadDoctorList(deptId, deptIndex, page, pageSize) {
    LMEPG.UI.showWaitingDialog();
    getDoctorList(deptId, deptIndex, page, pageSize, function (deptId, page, pageSize, data) {
        LMEPG.UI.dismissWaitingDialog();
        if (data.result.code == 0) {
            doctorCount = data.result.total;
            doctors = data.result.list;
            isLoading = false;
        }
        refreshDoctorList(false);
    });
    isLoading = true;
}

//根据医生问诊量计算问诊数据
function getInquiryNumStr(inquiryNum) {
    var number = "0";
    if (parseInt(inquiryNum + "") >= 10000) {
        number = (parseFloat(inquiryNum + "") / parseFloat(10000 + "")).toFixed(1) + "万";
    } else {
        number = inquiryNum;
    }
    return number;
}

/**
 * 刷新医生列表
 */
function refreshDoctorList() {

    var tab_list = document.getElementById("doctor_list");//数据块
    var strTable = '';

    tab_list.innerHTML = "";

    for (var i = 0; i < 4; i++) {
        if (i < doctors.length) {
            var doctorInfo = doctors[i];
            var docUrl = buildDoctorAvatarUrl(RenderParam.CWS_HLWYY_URL, doctorInfo.doc_id, doctorInfo.avatar_url, RenderParam.carrierId);
            var docName = doctorInfo.doc_name;
            var docDepartment = doctorInfo.department;
            var docJob = doctorInfo.job_title;
            var docInquiryNum = doctorInfo.inquiry_num;
            var docOnlineStatus = doctorInfo.online_state; // 医生在线状态
            var isFakeBusy = doctorInfo.is_fake_busy; // 是否手动设置
            strTable += ' <div class="doctor_' + (i + 1) + '"> ';
            strTable += ' <img id="icon_btn_' + (i + 1) + '_bg" class="doctor_bg" src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/DoctorP2P/V3/bg_doctor.png"/> ';
            strTable += "<img  class='doctor_img' src='" + docUrl + "'/> ";
            strTable += ' <div class="doctor_introduce big_size top1">' + docName + '</div> ';
            strTable += ' <div class="doctor_introduce2 top2">' + docDepartment + '</div> ';
            strTable += ' <div class="doctor_introduce top3">' + docJob + '</div> ';
            strTable += ' <div class="doctor_introduce yellow top4">问诊量:' + getInquiryNumStr(docInquiryNum) + '</div> ';

            var onlineState = P2PInstantInquiry.switchDocOnlineState(docOnlineStatus, isFakeBusy);
            var tempBtnTips = "立即问诊";
            var tempOnlineFlag = 3;//默认离线状态
            if (onlineState == 1) { //在线
                tempOnlineFlag = 1;
            } else if (onlineState == 2) {  //忙碌
                tempOnlineFlag = 2;
                tempBtnTips = "立即排队";
            } else if (onlineState == 3) {  //离线
                tempOnlineFlag = 3;
            }

            strTable += ' <img id="icon_btn_' + (i + 1) + '" class="icon_status" src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/DoctorP2P/V3/bg_icon_' + tempOnlineFlag + '.png"/> ';
            // 隐藏问诊按钮
            /*if (tempOnlineFlag !== 3) {
                strTable += ' <div class="submit_btn"> ';
                strTable += ' <img id="doctor_btn_' + (i + 1) + '" class="btn_bg" src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/DoctorP2P/V3/bg_key.png"/> ';
                strTable += ' <div class="btn_title">' + tempBtnTips + '</div> ';
            }*/
            strTable += ' </div></div>';
        }
    }

    tab_list.innerHTML = strTable;

    updateOnlineStatusCorner(doctors);

    if (currentPage === 1) {
        Hide('arrow_left');
    } else {
        Show('arrow_left');
    }
    if ((currentPage - 1) * MAX_PAGE_STEP + doctors.length < doctorCount) {
        Show('arrow_right');
    } else {
        Hide('arrow_right');
    }

    var pageCount = Math.ceil(doctorCount / MAX_PAGE_STEP);
    G('page_num').innerHTML = currentPage + '/' + pageCount;

    if (focusId.length > 0) {
        LMEPG.ButtonManager.requestFocus(focusId);
        focusId = "";
    } else {
        //变动焦点
        if (direction === "" || doctors.length <= 0) {
            LMEPG.ButtonManager.requestFocus("subject_btn");
        } else if (direction === "left") {
            LMEPG.ButtonManager.requestFocus("icon_btn_4");
        } else {
            LMEPG.ButtonManager.requestFocus("icon_btn_1");
        }
    }
}

//更新医生相关状态
function updateOnlineStatusCorner(doctors) {
    for (var j = 0; j < 4; j++) {
        if (j < doctors.length) {
            var onlineStatus = doctors[j].online_state;//医生在线状态
            var isFakeBusy = doctors[j].is_fake_busy; // 是否手动设置
            var tempCurrentBtnId = 'icon_btn_' + (j + 1);
            var tempBtn = LMEPG.ButtonManager.getButtonById(tempCurrentBtnId);
            onlineStatus = P2PInstantInquiry.switchDocOnlineState(onlineStatus, isFakeBusy).toString();
            var tempOnlineFlag = 3;
            if (tempBtn != null) {
                if (onlineStatus === "1") { //在线
                    tempOnlineFlag = 1;
                } else if (onlineStatus === '2') {  //忙碌
                    tempOnlineFlag = 2;
                } else if (onlineStatus === '3') {  //离线
                    tempOnlineFlag = 3;
                }
            }

            tempBtn.backgroundImage = LMEPG.App.getAppRootPath() + "/Public/img/hd/DoctorP2P/V3/bg_icon_" + tempOnlineFlag + ".png";
            tempBtn.focusImage = LMEPG.App.getAppRootPath() + "/Public/img/hd/DoctorP2P/V3/f_icon_" + tempOnlineFlag + ".gif";
        }
    }
}

/**
 * 向左翻页
 */
function turnLeft() {
    if (isLoading) return;
    direction = "left";
    if (currentPage > 1) {
        currentPage--;
        loadDoctorList(currentDeptId, currentDeptIndex, currentPage, MAX_PAGE_STEP);
    }
}

/**
 * 向右翻页
 */
function turnRight() {
    if (isLoading) return;
    direction = "right";
    if ((currentPage - 1) * MAX_PAGE_STEP + doctors.length < doctorCount) {
        currentPage++;
        loadDoctorList(currentDeptId, currentDeptIndex, currentPage, MAX_PAGE_STEP);
    }
}

<!--视频问诊处理-->
/**
 * 拉取医生list
 * @param deptId
 * @param deptIndex
 * @param page
 * @param pageSize
 * @param callback
 */
function getDoctorList(deptId, deptIndex, page, pageSize, callback) {
    var postData = {};
    postData.deptId = (deptId === "全部科室" ? "" : deptId);
    postData.deptIndex = deptIndex;
    postData.page = page;
    postData.pageSize = pageSize;
    LMEPG.ajax.postAPI("Doctor/getDoctorList", postData, function (data) {
        LMEPG.call(callback, [deptId, page, pageSize, data]);
    }, function () {
        LMEPG.UI.showToastV1("获取医生列表失败！");
    });
}

/**
 * 构建医生头像地址
 * @param urlPrefix
 * @param doctorId
 * @param avatarUrl
 * @param carrierID
 * @returns {string}
 */
function buildDoctorAvatarUrl(urlPrefix, doctorId, avatarUrl, carrierID) {
    var head = {
        func: "getDoctorHeadImage",
        carrierId: carrierID,
        areaCode: RenderParam.areaCode,
    };
    var json = {
        doctorId: doctorId,
        avatarUrl: avatarUrl
    };
    return urlPrefix + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
}

/**
 * 免费次数检测：规则-》如果用户是vip就跳过检测，不是vip则检测
 */
function getFreeInquiryTimes(callback) {
    if (RenderParam.isVip) {
        LMEPG.call(callback, [""]);
        return;
    }
    var postData = {};
    LMEPG.ajax.postAPI("Doctor/getFreeInquiryTimes", postData, function (data) {
        var freeTimesObj = data instanceof Object ? data : JSON.parse(data);
        if (freeTimesObj.result == "0") {
            if (freeTimesObj.remain_count > 0) {
                LMEPG.call(callback, [data]);
            } else {
                LMEPG.UI.commonDialog.showV1("您的免费问诊次数已用完，订购成为VIP会员，畅享无限问诊", ["确定", "取消"], function (index) {
                    if (index === 0) {
                        jumpBuyVip();
                    }
                });
            }
        } else {
            LMEPG.UI.showToastV1("获取免费问诊次数失败" + freeTimesObj.result);
        }
    }, function () {
        LMEPG.UI.showToastV1("获取免费问诊次数失败！");
    });
}

/**
 * 得到当前页面
 */
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent("doctorIndex");
    objCurrent.setParam("focusId", LMEPG.ButtonManager.getCurrentButton().id);
    objCurrent.setParam("currentPage", currentPage);
    objCurrent.setParam("deptId", currentDeptId);
    objCurrent.setParam("inner", RenderParam.inner);
    return objCurrent;
}

function jumpBuyVip() {
    var objHome = getCurrentPage();
    objHome.setParam("userId", RenderParam.userId);
    objHome.setParam("fromId", "1");

    // 订购首页
    var objOrderHome = LMEPG.Intent.createIntent("orderHome");
    objOrderHome.setParam("userId", RenderParam.userId);
    objOrderHome.setParam("remark", "在线问诊");

    LMEPG.Intent.jump(objOrderHome, objHome);
}

var BtnOnClick = {
    startInquiry: function (btn) {
        var doctorInfo = doctors[btn.cIndex];
        focusId = LMEPG.ButtonManager.getCurrentButton().id;
        getFreeInquiryTimes(function (callback) {
            P2PInstantInquiry.checkDoctorOnlineStatus(phone, doctorInfo, function (jsonInquiry) {
                BtnOnClick.jumpDoctorInquiry(doctorInfo, jsonInquiry);
            });
        });
    },
    startInquiryAssistant: function (btn) {
        focusId = LMEPG.ButtonManager.getCurrentButton().id;
        getFreeInquiryTimes(function (callback) {
            P2PInstantInquiry.start(phone, function (jsonInquiry) {
                var doctorInfo = {
                    doc_id: jsonInquiry.doctor_info.doctor_id,
                    doc_name: jsonInquiry.doctor_info.doctor_name,
                    job_title: jsonInquiry.doctor_info.doctor_job_title,
                    avatar_url: jsonInquiry.doctor_info.doctor_avatar_url,
                    hospital: jsonInquiry.doctor_info.doctor_hospital,
                    department: jsonInquiry.doctor_info.doctor_department,
                };
                BtnOnClick.jumpDoctorInquiry(doctorInfo, jsonInquiry);
            });
        });


    },
    jumpDetail: function (btn) {
        var doctorInfo = doctors[btn.cIndex];
        var objCurrent = getCurrentPage();

        var objDepartment = LMEPG.Intent.createIntent("doctorDetails");
        objDepartment.setParam("area", doctorInfo.area);
        objDepartment.setParam("avatar_url", doctorInfo.avatar_url);
        objDepartment.setParam("avatar_url_new", doctorInfo.avatar_url_new);
        objDepartment.setParam("department", doctorInfo.department);
        objDepartment.setParam("doc_id", doctorInfo.doc_id);
        objDepartment.setParam("doc_name", doctorInfo.doc_name);
        objDepartment.setParam("gender", doctorInfo.gender);
        objDepartment.setParam("good_disease", doctorInfo.good_disease);
        objDepartment.setParam("hospital", doctorInfo.hospital);
        objDepartment.setParam("inquiry_num", doctorInfo.inquiry_num);
        objDepartment.setParam("intro_desc", doctorInfo.intro_desc);
        objDepartment.setParam("job_title", doctorInfo.job_title);
        objDepartment.setParam("online_state", doctorInfo.online_state);
        objDepartment.setParam("is_fake_busy", doctorInfo.is_fake_busy);
        objDepartment.setParam("realImageUrl", doctorInfo.realImageUrl);

        LMEPG.Intent.jump(objDepartment, objCurrent);
    },
    jumpDepart: function (btn) {
        var objCurrent = getCurrentPage();
        var objDepartment = LMEPG.Intent.createIntent("doctorDepartment");
        objDepartment.setParam("deptId", currentDeptId);
        LMEPG.Intent.jump(objDepartment, objCurrent);
    },
    jumpRecordHome: function (btn) {
        var objCurrent = getCurrentPage();
        var objDepartment = LMEPG.Intent.createIntent("doctorRecordHomeV2");
        LMEPG.Intent.jump(objDepartment, objCurrent);
    },
    department: function (btn) {
        focusId = btn.id;
        layerStatus = 0;
        var departmentObj = btn.cDepartmentObj;
        currentPage = 1;
        loadDoctorList(departmentObj.dept_id, currentPage, MAX_PAGE_STEP);
        G("subject_btn_title").innerHTML = departmentObj.dept_name;
        currentDeptId = departmentObj.dept_name;
        G("layer").style.display = "none";
        G("subject_btn").style.zIndex = "0";
        G("secondary_menu").innerHTML = "";
        var button = LMEPG.ButtonManager.getSelectedButton("nav");
        LMEPG.ButtonManager.requestFocus(button.id);
    },
    jumpDoctorInquiry: function (doctorInfo, jsonInquiry) {
        focusId = LMEPG.ButtonManager.requestFocus(focusId);
        var objCurrent = getCurrentPage();

        var objInquiryCall = LMEPG.Intent.createIntent("inquiryCall");
        objInquiryCall.setParam("deptId", currentDeptId);
        objInquiryCall.setParam("area", RenderParam.areaCode);
        objInquiryCall.setParam("avatar_url", doctorInfo.avatar_url);
        objInquiryCall.setParam("avatar_url_new", doctorInfo.avatar_url_new);
        objInquiryCall.setParam("department", doctorInfo.department);
        objInquiryCall.setParam("doc_id", doctorInfo.doc_id);
        objInquiryCall.setParam("doc_name", doctorInfo.doc_name);
        objInquiryCall.setParam("gender", doctorInfo.gender);
        objInquiryCall.setParam("good_disease", doctorInfo.good_disease);
        objInquiryCall.setParam("hospital", doctorInfo.hospital);
        objInquiryCall.setParam("inquiry_num", doctorInfo.inquiry_num);
        objInquiryCall.setParam("intro_desc", doctorInfo.intro_desc);
        objInquiryCall.setParam("job_title", doctorInfo.job_title);
        objInquiryCall.setParam("online_state", doctorInfo.online_state);
        objInquiryCall.setParam("realImageUrl", doctorInfo.realImageUrl);
        objInquiryCall.setParam("entryType", P2PInstantInquiry.InquiryEntry.ONLINE_INQUIRY);
        objInquiryCall.setParam("phone", jsonInquiry.extras_info.landline_phone);
        objInquiryCall.setParam("src_page", "doctorList");
        LMEPG.Intent.jump(objInquiryCall, objCurrent);
    }
};

/**
 * 页面跳转对象。
 */
var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("splash");
        return currentPage;
    },

    /**
     * 跳转到home页面
     */
    jumpHome: function () {
        var objCurrent = Page.getCurrentPage(); //得到当前页

        var objHome = LMEPG.Intent.createIntent("home");
        objHome.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
    /**
     * 返回上一页
     */
};


function onBack() {
    if (RenderParam.inner == 0) {
        LMEPG.Intent.back("IPTVPortal");
    } else {
        LMEPG.Intent.back();
    }
}

function htmlBack() {
    onBack();
}

var Focus = {
    // 初始化按钮
    initBottom: function () {
        var root = LMEPG.App.getAppRootPath();
        buttons.push({
            id: 'subject_btn',
            name: '图片',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'record_btn',
            nextFocusUp: '',
            nextFocusDown: 'icon_btn_1',
            backgroundImage: root + '/Public/img/hd/DoctorP2P/V3/bg_subject.png',
            focusImage: root + '/Public/img/hd/DoctorP2P/V3/f_subject.png',
            selectedImage: root + '/Public/img/hd/DoctorP2P/V3/select_subject.png',
            groupId: "nav",
            click: BtnOnClick.jumpDepart,
            focusChange: Focus.menuFocus,
            beforeMoveChange: "",
        }, {
            id: 'inquiry_btn',
            name: '图片',
            type: 'img',
            nextFocusLeft: 'subject_btn',
            nextFocusRight: 'record_btn',
            nextFocusUp: '',
            nextFocusDown: 'icon_btn_1',
            backgroundImage: root + '/Public/img/hd/DoctorP2P/V3/bg_inquiry.png',
            focusImage: root + '/Public/img/hd/DoctorP2P/V3/f_inquiry.png',
            groupId: "nav",
            click: BtnOnClick.startInquiryAssistant,
            focusChange: Focus.menuFocus,
            beforeMoveChange: "",
        }, {
            id: 'record_btn',
            name: '问诊记录',
            type: 'img',
            nextFocusLeft: 'subject_btn',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'icon_btn_1',
            backgroundImage: root + '/Public/img/hd/DoctorP2P/V3/bg_record.png',
            focusImage: root + '/Public/img/hd/DoctorP2P/V3/f_record.png',
            groupId: "nav",
            click: BtnOnClick.jumpRecordHome,
            focusChange: Focus.menuFocus,
            beforeMoveChange: "",
        });
        for (var i = 0; i < 4; i++) {
            buttons.push({
                id: 'icon_btn_' + (i + 1),
                name: '图片',
                type: 'img',
                nextFocusLeft: 'icon_btn_' + (i + 1 - 1),
                nextFocusRight: 'icon_btn_' + (i + 1 + 1),
                nextFocusUp: 'subject_btn',
                nextFocusDown: 'doctor_btn_' + (i + 1),
                backgroundImage: root + '/Public/img/hd/DoctorP2P/V3/bg_icon_3.png',
                focusImage: root + '/Public/img/hd/DoctorP2P/V3/f_icon_3.gif',
                click: BtnOnClick.jumpDetail,
                focusChange: Focus.menuFocus,
                beforeMoveChange: Focus.onBeforeMoveChange,
                cIndex: i
            }, {
                id: 'doctor_btn_' + (i + 1),
                name: '按钮',
                type: 'img',
                nextFocusLeft: 'doctor_btn_' + (i + 1 - 1),
                nextFocusRight: 'doctor_btn_' + (i + 1 + 1),
                nextFocusUp: 'icon_btn_' + (i + 1),
                nextFocusDown: '',
                backgroundImage: root + '/Public/img/hd/DoctorP2P/V3/bg_key.png',
                focusImage: root + '/Public/img/hd/DoctorP2P/V3/f_key.png',
                click: BtnOnClick.startInquiry,
                cSpareId: 'icon_btn_' + (i + 1),
                groupId: "nav",
                focusChange: Focus.menuFocus,
                beforeMoveChange: Focus.onBeforeMoveChange,
                cIndex: i
            });
        }
    },

    // 菜单选中效果
    menuFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).src = btn.focusImage;
            if (btn.id.substring(0, 8) == "icon_btn") {
//                    G(btn.id + "_bg").src = LMEPG.App.getAppRootPath() + '/Public/img/hd/DoctorP2P/V3/f_doctor.gif'
                LMEPG.CssManager.addClass(btn.id + "_bg", "focus");
            }
            if (btn.id == "subject_btn") {
                getCurrentPage()
//                    $(".subject_title").css("color", "#ffffff")
                LMEPG.UI.Marquee.stop();
                LMEPG.UI.Marquee.start(btn.id + "_title", 4, 5, 50, "left", "scroll");
            }
        } else {
            G(btn.id).src = btn.backgroundImage;
            if (btn.id.substring(0, 8) == "icon_btn") {
                LMEPG.CssManager.removeClass(btn.id + "_bg", "focus");
            }
        }
    },
    onBeforeMoveChange: function (direction, current) {
        //翻页
        switch (direction) {
            case "right":
                if (current.id == "doctor_btn_4" || current.id == "icon_btn_4") {
                    turnRight();
                    return false
                }
                if (!G(current.nextFocusRight)) {
                    if (G(current.cSpareId)) {
                        LMEPG.BM.requestFocus(current.cSpareId);
                    }
                }
                break;
            case "left":
                if (current.id == "doctor_btn_1" || current.id == "icon_btn_1") {
                    turnLeft();
                    return false
                }
                break;
        }
    }
};

function isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        var c = arr[i];
        if (value === c) {
            return true;
        }
    }
    return false;
}

var buttons = [];

var PageStart = {
    init: function () {
        //当前选中科室焦点保持：更新当前选中科室名称
        G("subject_btn_title").innerHTML = is_empty(currentDeptId) ? "选择科室" : currentDeptId;
        Focus.initBottom();
        LMEPG.ButtonManager.init("subject_btn", buttons, "", true);
    }
};

var itemAllDepart = {
    dept_id: "全部科室",
    dept_name: "全部科室",
    dept_intro: "",
    doc_count: "1000"
};

window.onload = function () {
    if (RenderParam.carrierId === "640092") {
        document.body.style.backgroundImage = 'url(' + ROOT + '/Public/img/hd/Home/V10/bg.png)'
    }
    PageStart.init();
    loadDoctorList(currentDeptId, currentDeptIndex, currentPage, MAX_PAGE_STEP);

};
