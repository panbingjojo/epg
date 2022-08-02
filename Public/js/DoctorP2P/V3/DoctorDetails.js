// 定义全局按钮
var buttons = [];
var scene = "";
var CWS_WXSERVER_URL = RenderParam.CWS_WXSERVER_URL;
var isGetQRCodeSuccess = false;

/**
 * 得到当前页面
 */
function getCurrentPage() {
    var docInfo = InitData.docInfo;
    var objCurrent = LMEPG.Intent.createIntent("doctorDetails");

    objCurrent.setParam("avatar_url", docInfo.avatar_url);
    objCurrent.setParam("department", docInfo.department);
    objCurrent.setParam("avatar_url_new", docInfo.avatarUrlNew);
    objCurrent.setParam("hospital", docInfo.hospital);
    objCurrent.setParam("doc_id", docInfo.doc_id);
    objCurrent.setParam("doc_name", docInfo.doc_name);
    objCurrent.setParam("gender", docInfo.gender);
    objCurrent.setParam("good_disease", docInfo.goodDisease);
    objCurrent.setParam("inquiry_num", docInfo.inquiryNum);
//        objCurrent.setParam("intro_desc", docInfo.introDesc);
    objCurrent.setParam("job_title", docInfo.job_title);
    objCurrent.setParam("online_state", docInfo.online_state);

    return objCurrent;
}

/**
 * 免费次数检测：规则-》如果用户是vip就跳过检测，不是vip则检测
 */
function getFreeInquiryTimes(callback) {
    if (RenderParam.isVip) {
        LMEPG.call(callback, [""]);
        return;
    }

    if (RenderParam.carrierId == "450094") {
        getGuyNumTimes(callback);
        return;
    }
    var postData = {};
    LMEPG.ajax.postAPI("Doctor/getFreeInquiryTimes", postData, function (data) {
        var freeTimesObj = data instanceof Object ? data : JSON.parse(data);
        if (freeTimesObj.result == "0") {
            console.log("left free times:" + freeTimesObj.remain_count);
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
        LMEPG.UI.dismissWaitingDialog();
    }, function () {
        LMEPG.UI.showToastV1("获取免费问诊次数失败！");
        LMEPG.UI.dismissWaitingDialog();
    });
}

/**
 * 按次收费问诊
 */
function getGuyNumTimes(callback) {
    var postData = {"buy_type": 0,};
    LMEPG.ajax.postAPI("Pay/getBuyNum", postData, function (data) {
        var freeTimesObj = data instanceof Object ? data : JSON.parse(data);
        freeTimesObj.buy_num=freeTimesObj.buy_num==null?0:parseInt(freeTimesObj.buy_num);
        if (freeTimesObj.result == "0") {
            if (freeTimesObj.buy_num > 0) {
                LMEPG.call(callback, [data]);
            } else {
                LMEPG.UI.commonDialog.showV1("您的体验次数已经用完，继续问诊3元/次", ["确定", "取消"], function (index) {
                    if (index === 0) {
                        var PayInfo = {
                            'vip_id': "5",
                            'product_id': "0",//1包月订购，3包年订购
                            'userId': RenderParam.userId,
                            'isPlaying': "0",
                            'orderReason': "102",
                            'remark': "在线问诊",
                            'returnUrl': '',
                            'returnPageName': ""
                        };

                        LMEPG.UI.showWaitingDialog('');
                        LMEPG.ajax.postAPI('Pay/buildPayUrl', PayInfo, function (data) {
                            LMEPG.UI.dismissWaitingDialog('');
                            if (data.result == 0) {
                                window.location.href = data.payUrl; //得到支付地址并跳转
                            } else {
                                LMEPG.UI.showToast('获取订购参数异常：' + data.result);
                            }
                        });
                    }
                });
            }
        } else {
            LMEPG.UI.showToastV1("获取问诊次数失败" + freeTimesObj.result);
        }
        LMEPG.UI.dismissWaitingDialog();
    }, function () {
        LMEPG.UI.showToastV1("获取问诊次数失败！");
        LMEPG.UI.dismissWaitingDialog();
    });
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


function jumpDoctorEvaluation(str) {
    var objCurrent = getCurrentPage();
    var objDepartment = LMEPG.Intent.createIntent("doctorEvaluation");
    objDepartment.setParam("InquiryData", str);
    LMEPG.Intent.jump(objDepartment, objCurrent);
}

function onBack() {
    if (isS("wx_inquiry_img")) {
        H("wx_inquiry_img");
        return;
    }
    LMEPG.Intent.back();
}

function htmlBack() {
    onBack();
}

function initUI() {
    G("docPhoto").src = buildDoctorAvatarUrl(RenderParam.CWS_HLWYY_URL, InitData.docInfo.doc_id, InitData.docInfo.avatar_url, RenderParam.carrierId);
    G("docName").innerHTML = InitData.docInfo.doc_name;
    G("docDepartment").innerHTML = "科室：" + InitData.docInfo.department;
    G("docJob").innerHTML = "职称：" + InitData.docInfo.job_title;
    G("docNum").innerHTML = "问诊量：" + getInquiryNumStr(InitData.docInfo.inquiryNum);
//        G("docGood").innerHTML = InitData.docInfo.goodDisease;
//        G("docBrief").innerHTML = InitData.docInfo.introDesc;
    var onlineStatus = InitData.docInfo.online_state;
    var isFakeBusy = InitData.docInfo.is_fake_busy;
    var onlineState = P2PInstantInquiry.switchDocOnlineState(onlineStatus, isFakeBusy);
    if (onlineState == 1) { //在线
        tempOnlineFlag = 1;
    } else if (onlineState == 2) {  //忙碌
        tempOnlineFlag = 2;
    } else if (onlineState == 3) {  //离线
        tempOnlineFlag = 3;
    }
    G("icon_status").src = LMEPG.App.getAppRootPath() + "/Public/img/hd/DoctorP2P/V3/bg_icon_" + tempOnlineFlag + ".png";

    // 获取小程序二维码
    getInquiryQRCode(InitData.docInfo.doc_id);
}

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

/*
 * 拉取医生详情
 */
function getDoctorDetail() {
    var reqData = {
        "doctor_id": RenderParam.docId,
    };
    LMEPG.ajax.postAPI('Doctor/getDoctorDetail', reqData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {
                if (data.code == "0") {
                    G("docGood").innerHTML = data.doc_info.good_disease;
                    G("docBrief").innerHTML = data.doc_info.intro_desc;
                }
            } else {
                LMEPG.UI.showToastV1("获取数据失败");
            }

        } catch (e) {
            LMEPG.UI.showToastV1("获取数据解析异常");
        }
    }, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToastV1("获取数据请求失败");
    });
}

/**
 * 检查医生在线状态
 */
function checkDoctorOnlineStatus() {
    var doctorInfo = InitData.docInfo;
    var isFakeBusy = doctorInfo.is_fake_busy;
    if (isFakeBusy == '1') {
        var tips = '当前排队用户较多，等待时间过长，建议您选择其他医生进行咨询，或稍后再来！';
        // 弹窗提示
        LMEPG.UI.commonDialog.showV1(tips, ["确定"], function (index) {});
    } else {
        LMEPG.UI.showWaitingDialog("", 8);
        getFreeInquiryTimes(function (callback) {
            P2PInstantInquiry.checkDoctorOnlineStatus(RenderParam.phone, doctorInfo, function (jsonFromAndroid) {
                Page.jumpDoctorInquiry(doctorInfo, jsonFromAndroid);
            });
        });
    }
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
 * 获取小程序二维码
 * @param docId
 */
function getInquiryQRCode(docId) {
    var postData = {
        doctor_id: docId
    }
    LMEPG.ajax.postAPI("Doctor/getInquiryQRCode", postData, function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            console.log("Doctor/getInquiryQRCode:");
            console.log(data);
            if (data.result == 0) {
                G('inquiry_by_wx_qrcode').src = buildDoctorAvatarUrl(RenderParam.CWS_HLWYY_URL,
                    "WX_QRCODE_" + RenderParam.accountId + "_" + new Date().getTime(), data.url, RenderParam.carrierId);
                scene = data.scene;
                isGetQRCodeSuccess = true;
                queryInquiryInfo();
            } else {
                LMEPG.Log.error("获取小程序码失败！" + data.result);
                LMEPG.UI.showToastV1("获取小程序码失败！");
                H("wx_inquiry_img");
                //getInquiryQRCode(docId);
            }
        } catch (e) {
            LMEPG.Log.error("获取小程序码数据解析异常");
            LMEPG.UI.showToastV1("获取小程序码数据解析异常");
            H("wx_inquiry_img");
            //getInquiryQRCode(docId);
        }
    }, function () {
        LMEPG.Log.error("获取小程序码失败！");
        LMEPG.UI.showToastV1("获取小程序码失败！");
        H("wx_inquiry_img");
        //getInquiryQRCode(docId);
    });
}

/**
 * 查询是否扫码
 */
function queryInquiryInfo() {
    var postData = {
        scene: scene,
    };
    LMEPG.ajax.postAPI("Doctor/getInquiryStatus", postData, function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.result == 0) {
                if (data.state != 0) {
                    var doctorInfo = InitData.docInfo;
                    Page.jumpDoctorInquiry(doctorInfo, null);
                } else {
                    queryInquiryInfoTimeOut();
                }
            } else {
                LMEPG.Log.error("获取问诊状态失败！");
                queryInquiryInfoTimeOut();
            }
        } catch (e) {
            LMEPG.Log.error("获取问诊状态数据解析异常" + rsp);
            queryInquiryInfoTimeOut();
        }
    }, function () {
        LMEPG.Log.error("获取问诊状态失败！");
        queryInquiryInfoTimeOut();
    });
}

function queryInquiryInfoTimeOut() {
    setTimeout(queryInquiryInfo, 1000);
}

/**
 * 显示微信小程序二维码
 */
function showWXInquiryImg() {
    var doctorInfo = InitData.docInfo;
    LMEPG.UI.showWaitingDialog();
    getFreeInquiryTimes(function (callback) {
        LMEPG.UI.forbidDoubleClickBtn(function () {
            P2PInstantInquiry.isInquiryBlacklist(function (data) {
                if (doctorInfo.online_state == "3" || doctorInfo.online_state == "2") {
                    // 医生处于可问诊状态，才能发起问诊
                    P2PInstantInquiry.getDoctorStatus(doctorInfo, function (doctorInfo, data) {
                        LMEPG.UI.dismissWaitingDialog();
                        if (data.data.code == 0) {
                            var status = data.data.doctor_status;
                            if (status == "1") {
                                S("wx_inquiry_img");
                                if (!isGetQRCodeSuccess) {
                                    // 获取小程序二维码
                                    getInquiryQRCode(InitData.docInfo.doc_id);
                                }
                                LMEPG.UI.dismissWaitingDialog();
                            } else {
                                LMEPG.UI.showToastV1('当前医生不在线！');
                            }
                        }
                    });
                } else {
                    // 提示医生不在线
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToastV1('当前医生不在线');
                }
            });
        });
    });
}

var Page = {
    jumpDoctorInquiry: function (doctorInfo, jsonInquiry) {
        var objCurrent = getCurrentPage();
        var objInquiryCall = LMEPG.Intent.createIntent("inquiryCall");
        if (jsonInquiry != null) {
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
            objInquiryCall.setParam("src_page", "doctorDetails");
            objInquiryCall.setParam("returnUrl", "doctorDetails");
        } else {
            objInquiryCall.setParam("scene", scene);
        }

        LMEPG.Intent.jump(objInquiryCall, objCurrent);
    },
};

var PageStart = {

    // 初始化底部导航栏按钮
    initBottom: function () {
        // 工具栏
        buttons.push({
            id: 'wx_inquiry_btn',
            name: '微信问诊',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'inquiry_btn',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/DoctorP2P/V3/bg_key.png',
            focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/DoctorP2P/V3/f_key.png',
            click: showWXInquiryImg,
            focusChange: PageStart.onBtnFocus,
            beforeMoveChange: "",
        });
        buttons.push({
            id: 'inquiry_btn',
            name: '问诊',
            type: 'img',
            nextFocusLeft: 'wx_inquiry_btn',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/DoctorP2P/V3/bg_key.png',
            focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/DoctorP2P/V3/f_key.png',
            click: checkDoctorOnlineStatus,
            focusChange: PageStart.onBtnFocus,
            beforeMoveChange: "",
        });
    },

    // 工具栏焦点效果
    onBtnFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).src = btn.focusImage
        } else {
            G(btn.id).src = btn.backgroundImage
        }
    },

    init: function () {
        getDoctorDetail();
        initUI();
        PageStart.initBottom();       // 初始化底部导航栏按钮
        LMEPG.BM.init("wx_inquiry_btn", buttons, "", true);
    }
};

window.onload = function () {
    if (RenderParam.carrierId === "640092") {
        document.body.style.backgroundImage = 'url(' + LMEPG.ajax.getAppRootPath() + '/Public/img/hd/Home/V10/bg.png)'
    }
    PageStart.init();
};
