var scene;

// 启生魔方 - 小包标识
var isMFSmallPackage = RenderParam.carrierId === '10000051' && RenderParam.lmp === '266';

function onBack() { // 返回按键
    if(G('gid_common_edit_dialog')){
        delNode('gid_common_edit_dialog');
        LMEPG.BM.requestFocus('ask_doc_tv_phone');
    }else {
        LMEPG.Intent.back();
    }

}

/**
 * 兼容老版本
 * @type {{startInquiry: DoctorP2PHandler.startInquiry, checkDocterOnlineStatus: DoctorP2PHandler.checkDocterOnlineStatus, getDoctorStatus: DoctorP2PHandler.getDoctorStatus, getFreeInquiryTimes: DoctorP2PHandler.getFreeInquiryTimes}}
 */
var DoctorP2PHandler = {
    startInquiry: function (doctorInfo, memberInfo) {

        if (RenderParam.isVip) {
            //检查医生状态
            DoctorP2PHandler.checkDocterOnlineStatus(doctorInfo, memberInfo);
        } else {
            // 非VIP问诊次数限制，查询免费问诊次数
            DoctorP2PHandler.getFreeInquiryTimes(doctorInfo, memberInfo, function (doctorInfo, memberInfo, data) {
                var freeTimesObj = data instanceof Object ? data : JSON.parse(data);
                if (freeTimesObj.result == "0") {
                    if (freeTimesObj.remain_count < 1) {
                        // 贵州电信EPG、贵州广电EPG，直接跳计费
                        BtnOnClick.jumpBuyVip();
                    } else {
                        //检查医生状态
                        DoctorP2PHandler.checkDocterOnlineStatus(doctorInfo, memberInfo);
                    }
                } else {
                    LMEPG.UI.showToast("获取免费问诊次数失败" + freeTimesObj.result);
                }
            });
        }
    },

    /**
     * 检查医生状态
     */
    checkDocterOnlineStatus: function (doctorInfo, memberInfo) {
        if (doctorInfo.online_state == "3" || doctorInfo.online_state == "2") {
            // 医生处于可问诊状态，才能发起问诊
            DoctorP2PHandler.getDoctorStatus(doctorInfo, memberInfo, function (doctorInfo, memberInfo, data) {
                if (data.data.code == "0") {
                    var status = data.data.doctor_status;
                    if (status == "1") {
                        //在线、忙碌，发起请求，医生列表时的在线状态和拉取的在线状态不匹配，需要转化
                        var moduleInfo = {
                            moduleId: "10001",
                            moduleName: "视频问诊",
                            entryType: DoctorPlugin.InquiryEntry.ONLINE_INQUIRY
                        }
                        DoctorPlugin.startInquiry(moduleInfo, doctorInfo, memberInfo);
                    } else {
                        LMEPG.UI.showToast("当前医生不在线");
                    }
                } else {
                    LMEPG.UI.showToast("获取医生在线状态失败");
                }
            });  //需要实时判断医生在线情况
        } else {
            // 提示医生不在线，需要重新封装提示框，先用alert 进行测试
            LMEPG.UI.showToast("当前医生不在线，请刷新医生列表");
        }
    },

    /**
     * 获取医生在线状态
     * @param data 请求参数数组
     */
    getDoctorStatus: function (doctorInfo, memberInfo, callback) {
        var postData = {
            doctor_id: doctorInfo.doc_id
        };
        LMEPG.ajax.postAPI("Doctor/getDoctorStatus", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                LMEPG.call(callback, [doctorInfo, memberInfo, data]);
            } catch (e) {
                LMEPG.UI.showToast("获取医生状态数据解析异常");
            }
        }, function () {
            LMEPG.UI.showToast("获取咨询在线状态失败！");
        });
    },

    //获取免费问诊次数
    getFreeInquiryTimes: function (doctorInfo, memberInfo, callback) {
        var postData = {};
        LMEPG.ajax.postAPI("Doctor/getFreeInquiryTimes", postData, function (data) {
            LMEPG.call(callback, [doctorInfo, memberInfo, data]);
        });
    },
};

var BtnOnClick = {
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent("doctorDetailsSmall");
        objCurrent.setParam("doc_id", InitData.docId);
        return objCurrent;
    },
    jumpBuyVip: function () {

        // --------上报局方使用模块数据 start--------
        if(RenderParam.carrierId === "10000051") {
            var clickTime = new Date().getTime();
            var deltaTime = Math.round((clickTime - initTime) / 1000);
            var postData = {
                "type": 7,
                "operateResult": "在线问诊",
                "stayTime":  deltaTime
            };
            LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", postData, LMEPG.emptyFunc, LMEPG.emptyFunc);
        }
        // --------上报局方使用模块数据 end--------

        var objCurrent = BtnOnClick.getCurrentPage();
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("userId", RenderParam.userId);
        objOrderHome.setParam("remark", "视频问诊");
        LMEPG.Intent.jump(objOrderHome, objCurrent);
    }
};

// 定义全局按钮
var buttons = [
    {
        id: 'ask_doc_tv_phone',
        name: '电视电话',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/ask_doc_tv_phone.png",
        focusImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/ask_doc_tv_phone_f.png",
        click: startInquiry,
        focusChange: phoneVideoFocusChange,
        beforeMoveChange: ""
    }, {
        id: 'ask_doc_tv_video',
        name: '电视视频',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/ask_doc_tv_video.png",
        focusImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/ask_doc_tv_video_f.png",
        click: startInquiry,
        focusChange: phoneVideoFocusChange,
        beforeMoveChange: ""
    },
];

function startInquiry(btn) {
    if (RenderParam.accessInquiryInfo.isAccessInquiry == 0 ) {
        LMEPG.UI.showToast(RenderParam.accessInquiryInfo.message);
        return;
    }

    if (btn.id == 'ask_doc_wechat_teletext') {
        jumpInquiry(InitData.storeDocObj);
        return;
    }

    var isFakeBusy = InitData.storeDocObj.is_fake_busy;
    if (isFakeBusy == '1') { // 处于手动调整忙碌状态
        var tips = '当前排队用户较多，等待时间过长，建议您选择其他医生进行咨询，或稍后再来！';
        // 弹出提示框
        LMEPG.UI.commonDialog.show(tips, ["确定"], function (index) {
        });
        //字体内容长，增加容器高度
        G('gid_common_dialog_message').style.top = '250px';
        G('gid_common_dialog_message').style.height = '150px';
        return;
    }

    if (RenderParam.isVip) {
        jumpInquiry(InitData.storeDocObj);
        return;
    }
    LMEPG.Inquiry.p2pApi.getFreeInquiryTimes(function (data) {
        var freeTimesObj = data instanceof Object ? data : JSON.parse(data);
        if (freeTimesObj.result == "0") {
            if (freeTimesObj.remain_count < 1) {
                // 青海电信，弹窗提示
                var tipsText = "您的免费问诊次数已用完，成为VIP即可不限问诊次数。";
                LMEPG.UI.commonDialog.show(tipsText, ["确定", "取消"], function (index) {
                    if (index === 0) {
                        BtnOnClick.jumpBuyVip();
                    }
                });
            } else {
                jumpInquiry(InitData.storeDocObj);
            }

        } else {
            LMEPG.UI.showToast("获取免费问诊次数失败" + freeTimesObj.result);
        }
    });
}

function scrollText(dir, current) {
    var num = parseInt((G('introduction').offsetHeight - 205) / 43);
    switch (dir) {
        case 'up':
            if (Math.abs(G('introduction').offsetTop - 44) > 43) {
                G('introduction').style.marginTop = G('introduction').offsetTop - 44 + 43 + 'px';
                if (Math.abs(G('introduction').offsetTop - 44) < 43) {
                    G('introduction').style.marginTop = 0 + 'px';
                }
                G(current.id).style.top = G(current.id).offsetTop - parseInt(109 / num) + 'px';
                if (Math.abs(G(current.id).offsetTop - 81) < parseInt(109 / num)) {
                    G(current.id).style.top = 81 + 'px';
                }
            }
            break;
        case 'down':
            if (Math.abs((G('introduction').offsetTop - 44 - 205) + G('introduction').offsetHeight) > 43 ) {
                G('introduction').style.marginTop = G('introduction').offsetTop - 44 - 43 + 'px';
                G(current.id).style.top = G(current.id).offsetTop + parseInt(109 / num) + 'px';
                if (Math.abs(G(current.id).offsetTop - 191) < parseInt(109 / num)) {
                    G(current.id).style.top = 190 + 'px';
                }
            } else if (current.isSupportTvPhone) {
                LMEPG.BM.requestFocus('ask_doc_tv_phone');
            } else if (current.isSupportTvVideo) {
                LMEPG.BM.requestFocus('ask_doc_tv_video');
            }
            break;
    }
}

function phoneVideoFocusChange(btn) {
    switch (btn.id) {
        case 'ask_doc_tv_phone':
            G('tv_phone_tips').style.display = 'block';
            G('tv_video_tips').style.display = 'none';
            G('tv_video_tips_item').style.display = 'none';
            break;
        case 'ask_doc_tv_video':
            G('tv_video_tips').style.display = 'block';
            G('tv_video_tips_item').style.display = 'block'
            G('tv_phone_tips').style.display = 'none';
            break;
    }
}

function jumpInquiry(doctorInfo) {
    var curBtnId = LMEPG.BM.getCurrentButton().id;
    switch (curBtnId) {
        // 电视视频
        case 'ask_doc_tv_video':
            checkDoctorOnlineStatus(InitData.storeDocObj);
            break;
        // 电视电话
        case 'ask_doc_tv_phone':
            P2PInstantInquiry.checkDoctorOnlineStatus('', doctorInfo, function (jsonInquiry) {
                console.log(jsonInquiry);
                jumpInquiryPage(doctorInfo, jsonInquiry);
            });
            break;
    }
}

/**
 * 跳转微信小程序问诊页面/电话问诊页面
 */
function jumpInquiryPage(doctorInfo, jsonInquiry) {
    var objCurrent = LMEPG.Intent.createIntent('doctorDetailsSmall');
    objCurrent.setParam('doc_id', RenderParam.docId);
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
    }

    LMEPG.Intent.jump(objInquiryCall, objCurrent);
}

/**
 * 检查医生在线状态
 */
function checkDoctorOnlineStatus(doctorInfo) {
    if (doctorInfo.online_state == "3" || doctorInfo.online_state == "2" || doctorInfo.online_state == "100") {
        //医生处于可问诊状态，才能发起问诊
        getDoctorStatus(doctorInfo, function (doctorInfo, data) {
            if (data.data.code == 0) {
                var status = data.data.doctor_status;
                if (status == "1") {
                    //在线、忙碌，发起请求，医生列表时的在线状态和拉取的在线状态不匹配，需要转化
                    var moduleInfo = {
                        moduleId: "10001",
                        moduleName: "视频问诊",
                        entryType: DoctorPlugin.InquiryEntry.ONLINE_INQUIRY,
                    }
                    DoctorPlugin.startInquiry(moduleInfo, doctorInfo);
                } else {
                    LMEPG.UI.showToast("当前医生不在线");
                }
            }
        });  //需要实时判断医生在线情况
    } else {
        // 提示医生不在线，需要重新封装提示框，先用alert 进行测试
        LMEPG.UI.showToast("当前医生不在线，请刷新医生列表");
    }
}

/**
 * 获取医生在线状态
 * @param doctorInfo 医生信息
 * @param callback 回调函数
 */
function getDoctorStatus(doctorInfo, callback) {
    var postData = {
        doctor_id: doctorInfo.doc_id
    };
    LMEPG.ajax.postAPI("Doctor/getDoctorStatus", postData, function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            LMEPG.call(callback, [doctorInfo, data]);
        } catch (e) {
            LMEPG.UI.showToast("获取医生状态数据解析异常");
        }
    }, function () {
        LMEPG.UI.showToast("获取咨询在线状态失败！");
    });
}

var InitData = {
    docId: RenderParam.docId,
    storeDocObj: null
};

function updateUI(docObj) {
    G('inquiry_mode').innerHTML = '<img id="tv_phone_tips" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/tv_phone_tips.png">' +
        '        <img id="tv_video_tips" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/tv_video_tips.png" style="display: none">' +
        '        <img id="tv_video_tips_item" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/tv_video_tips.gif" style="display: none">' +
        '        <img id="ask_doc_tv_phone" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/ask_doc_tv_phone.png">' +
        '        <img id="ask_doc_tv_video" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/ask_doc_tv_video.png">';

    if (!LMEPG.Func.isObject(docObj) || docObj.code != "0") {
        LMEPG.UI.showToast("获取详情失败");
        return;
    }

    var tempDocInfo = docObj.doc_info;
    InitData.storeDocObj = tempDocInfo;
    var online_state = LMEPG.Inquiry.p2pApi.switchDocOnlineState(tempDocInfo.online_state,tempDocInfo.is_fake_busy);
    var isEnableWeXinTeletext = online_state == 3 && tempDocInfo.is_im_inquiry == 1;
    if (!isMFSmallPackage && isEnableWeXinTeletext) {
        online_state = 1;
    }
    var statusImgSrc = g_appRootPath + "/Public/img/hd/DoctorP2P/V10/status_" + online_state + ".png";
    var tempImgUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, tempDocInfo.doc_id, tempDocInfo.avatar_url, RenderParam.carrierId);
    G("photo").setAttribute("src", tempImgUrl);
    G("status").setAttribute("src", statusImgSrc);
    G("name").innerHTML = tempDocInfo.doc_name;
    G("hospital").innerHTML = tempDocInfo.hospital;
    G("position").innerHTML = "职称：<span>" + tempDocInfo.job_title + "</span>";
    G("department").innerHTML = "<span>" + tempDocInfo.department + "</span>";
    G("number").innerHTML = "已问诊" + LMEPG.Inquiry.p2pApi.switchInquiryNumStr(tempDocInfo.inquiry_num);
    G("introduction").innerHTML += tempDocInfo.intro_desc;

    // 设置问诊按钮置灰
    var isSupportTvPhone = false;
    var isSupportTvVideo = true;

    // E910盒子只支持电视电话问诊
    if (RenderParam.stbModel === "E910") {
        isSupportTvPhone = true;
        isSupportTvVideo = false;
    }

    if (isSupportTvVideo && !isSupportTvPhone) {
        G('ask_doc_tv_phone').style.display = 'none';
        G('ask_doc_tv_video').style.left = 482 + 'px';
    }
    if (!isSupportTvVideo && isSupportTvPhone) {
        G('ask_doc_tv_video').style.display = 'none';
        G('ask_doc_tv_phone').style.left = 482 + 'px';
    }

    if (tempDocInfo.is_video_inquiry != 1 || online_state == 3) { // 未开通视频问诊、离线
        if (isSupportTvPhone) {
            buttons[0].backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/V10/ask_doc_tv_phone_offline.png';
            G('ask_doc_tv_phone').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V10/ask_doc_tv_phone_offline.png';
        }
        if (isSupportTvVideo) {
            buttons[1].backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/V10/ask_doc_tv_video_offline.png';
            G('ask_doc_tv_video').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V10/ask_doc_tv_video_offline.png';
        }
        isSupportTvVideo = false;
        isSupportTvPhone = false;
    }

    var initFocusId;
    if (isSupportTvPhone) initFocusId = 'ask_doc_tv_phone';
    else if (isSupportTvVideo) initFocusId = 'ask_doc_tv_video';

    if (isSupportTvVideo) buttons[0].nextFocusRight = 'ask_doc_tv_video';
    else buttons[0].nextFocusRight = '';

    if (isSupportTvPhone) buttons[1].nextFocusLeft = 'ask_doc_tv_phone';
    else buttons[1].nextFocusLeft = '';

    if (parseInt(G('introduction').offsetHeight) > 216) {
        document.getElementsByClassName('doctor_detail')[0].innerHTML += '<img id="scroll_bar" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/scroll_bar.png">' +
            '        <img id="scroll_bar_f" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/scroll_bar_f.png">';
        buttons.push({
            id: 'scroll_bar_f',
            name: '滚动条',
            type: 'img',
            backgroundImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/scroll_bar_f.png",
            focusImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/scroll_bar_f.png",
            click: '',
            focusChange: "",
            isSupportTvPhone: isSupportTvPhone,
            isSupportTvVideo: isSupportTvVideo,
            beforeMoveChange: scrollText,
        });
        buttons[0].nextFocusUp = 'scroll_bar_f';
        buttons[1].nextFocusUp = 'scroll_bar_f';
    }

    if (!isSupportTvPhone && !isSupportTvVideo) {
        initFocusId = 'scroll_bar_f';
    }

    LMEPG.BM.init(initFocusId, buttons, "", true);
    /*var num = parseInt((G('introduction').offsetHeight - 205) / 43);
    G('scroll_bar_f').style.height = parseInt(149 / (num + 1)) + 'px';*/
}

var DoctorDetail = {

    /** 医生详情 - 启动唯一入口 */
    startEntry: function () {

        LMEPG.UI.showWaitingDialog();
        LMEPG.Inquiry.p2pApi.getDoctorDetail(InitData.docId, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if(RenderParam.carrierId == '10220094' || RenderParam.carrierId == '10220095'){
                data.doc_info.is_im_inquiry = 0;
            }
            updateUI(data);
        });
    }
};
