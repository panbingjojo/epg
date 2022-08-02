var CWS_HLWYY_URL = RenderParam.CWS_HLWYY_URL;
var carrierId = RenderParam.carrierId;
var areaCode = RenderParam.areaCode;
var searchTextTips = ""; //搜索框中的文字提示

// 定义全局按钮
var buttons = [];
var phone = RenderParam.phone;

function onBack() {
    LMEPG.Intent.back();
}

function htmlBack() {
    onBack();
}

var InitData = {
    PageCurrent: 1, //当前第几页
    PageTotal: 0, //总的页码
    InitMemberId: RenderParam.memberId,
    StoreDoctorId: "",
    MemberInfo: {
        memberId: RenderParam.memberId,
        memberName: RenderParam.memberName,
        memberAge: RenderParam.memberAge,
        memberGender: RenderParam.memberGender,
    },
    LoadState: {
        Init: 1,    //初始化加载数据
        PrePage: 2, //加载上一页数据
        NextPage: 3 //加载下一页数据
    },
    StoreDeleteInquiry: {
        userId: null,
        memberId: null,
        inquiryId: null
    },
};


//显示删除弹框
function showDeleteDialog() {
    LMEPG.UI.commonDialog.showV1('确定删除该数据吗？', ["确定", '取消'], function (id) {
        switch (id) {
            case 0:
                deleteInquiry();
                break;
            case 1:
                LMEPG.UI.commonDialog.dismiss();
                break;
        }
    });
}

//删除家庭成员信息
function deleteInquiry() {
    if (InitData.StoreDeleteInquiry.inquiryId == null || InitData.StoreDeleteInquiry.userId == null || InitData.StoreDeleteInquiry.inquiryId == null) {
        LMEPG.UI.showToast("当前问诊记录状态异常");
        return;
    }
    var reqData = {
        "userId": InitData.StoreDeleteInquiry.userId,
        "memberId": InitData.StoreDeleteInquiry.memberId,
        "inquiryId": InitData.StoreDeleteInquiry.inquiryId
    };
    LMEPG.UI.showWaitingDialog("");
    LMEPG.ajax.postAPI('Doctor/deleteInquiry', reqData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {
                if (data.result === 0) {
                    // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                    LMEPG.KeyEventManager.setAllowFlag(false);
                    LMEPG.UI.showToastV1("删除成功", 1.5, function () {
                        LMEPG.KeyEventManager.setAllowFlag(true);
                        loadInquiryData(InitData.LoadState.Init);
                    });
                } else {
                    LMEPG.UI.showToastV1("删除失败:" + data.result);
                }
            } else {
                LMEPG.UI.showToastV1("删除失败");
            }

        } catch (e) {
            LMEPG.UI.showToastV1("删除异常");
        }
    }, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToastV1("删除失败");
    });
}

//加载问诊记录
function loadInquiryData(state) {
//        LMEPG.UI.hideToast(); // 如果快速按键翻页时，先关闭上一次还未自动关闭的toast
    switch (state) {
        case InitData.LoadState.Init:
            InitData.PageCurrent = 1;
            break;
        case InitData.LoadState.PrePage:
            if (InitData.PageCurrent > 1) {
                InitData.PageCurrent--;
            } else {
                LMEPG.UI.showToastV1("当前第一页了");
                return;
            }
            break;
        case InitData.LoadState.NextPage:
            if (InitData.PageCurrent < InitData.PageTotal) {
                InitData.PageCurrent++;
            } else {
                LMEPG.UI.showToastV1("当前最后一页了");
                return;
            }
            break;
    }
    var reqData = {
        "currentPage": InitData.PageCurrent,
        "pageNum": 1,
        "memberID": -1
    };
    LMEPG.UI.showWaitingDialog();
    LMEPG.ajax.postAPI('Doctor/getAllInquiryRecord', reqData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {
                if (data.result === 0) {
                    if (data.count === 0) {
                        Hide("content");
                        G("no_data").style.display = "block";
                        LMEPG.BM.init("", buttons, '', true);
                    } else {
                        Show("content");
                        G("no_data").style.display = "none";
                        get39InquiryData(data);
                    }
                } else {
                    LMEPG.UI.showToast("获取数据失败:" + data.result);
                }
            } else {
                LMEPG.UI.showToast("获取数据失败");
            }

        } catch (e) {
            LMEPG.UI.showToast("获取数据解析异常");
        }
    }, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast("获取数据请求失败");
    });
}

function get39InquiryData(recordObj) {
    var recordItemObj = recordObj["list"][0];
    var tempInquiryId = recordItemObj.inquiry_id;
    var tempNethospUserId = recordItemObj.nethosp_user_id;
    InitData.StoreDoctorId = recordItemObj.doctor_id;
    console.log("---->recordItemObj:" + JSON.stringify(recordItemObj));
    LMEPG.UI.showWaitingDialog("");
    var reqData = {
        "inquiry_id": tempInquiryId,
        "nethosp_user_id": tempNethospUserId
    };
    LMEPG.ajax.postAPI('Doctor/getHLWYYInquiryRecord', reqData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {

                if (data.code === "0") {
                    List.createMenu(recordObj, data);
                } else {
                    LMEPG.UI.showToast("获取数据失败:" + data.result);
                }
            } else {
                LMEPG.UI.showToast("获取数据失败");
            }

        } catch (e) {
            LMEPG.UI.showToast("获取数据解析异常");
        }
    }, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast("获取数据请求失败");
    });
}

/**
 * 增加再次问诊功能
 */
function startInquiryAgain() {

    if (InitData.StoreDoctorId === "") {
        return;
    }
    LMEPG.UI.showWaitingDialog();
    var reqData = {
        "doctor_id": InitData.StoreDoctorId,
    };
    LMEPG.ajax.postAPI('Doctor/getDoctorDetail', reqData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            console.log("doctor_id:" + JSON.stringify(data));
            if (data instanceof Object) {
                if (data.code == "0") {
                    getFreeInquiryTimes(function (callback) {
                        P2PInstantInquiry.checkDoctorOnlineStatus(phone, data.doc_info, function (jsonFromAndroid) {
                            Page.jumpDoctorInquiry(data.doc_info, jsonFromAndroid);
                        });
                    });
                }
            } else {
                LMEPG.UI.showToast("获取数据失败");
            }

        } catch (e) {
            LMEPG.UI.showToast("获取数据解析异常");
        }
    }, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast("获取数据请求失败");
    });
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
            LMEPG.UI.showToast("获取免费问诊次数失败" + freeTimesObj.result);
        }
    }, function () {
        LMEPG.UI.showToast("获取免费问诊次数失败！");
    });
}

function jumpBuyVip() {
    var objHome = Page.getCurrentPage();
    objHome.setParam("userId", RenderParam.userId);
    objHome.setParam("fromId", "1");

    // 订购首页
    var objOrderHome = LMEPG.Intent.createIntent("orderHome");
    objOrderHome.setParam("userId", RenderParam.userId);
    objOrderHome.setParam("remark", "在线问诊");

    LMEPG.Intent.jump(objOrderHome, objHome);
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
        areaCode: areaCode,
    };
    var json = {
        doctorId: doctorId,
        avatarUrl: avatarUrl
    };
    return urlPrefix + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
}

/** 日期转换 */
function getInquiryDurationTime(createDt, finishDt) {
    var mInquiryDate = "";
    try {

        var mDiff = new Date(getStandardDt(finishDt)).getTime() - new Date(getStandardDt(createDt)).getTime();
        var mDay = parseInt(mDiff / (24 * 60 * 60 * 1000));
        var mHour = parseInt((mDiff / (60 * 60 * 1000) - mDay * 24));
        var mMin = parseInt(((mDiff / (60 * 1000)) - mDay * 24 * 60 - mHour * 60));
        var mSecond = parseInt((mDiff / 1000 - mDay * 24 * 60 * 60 - mHour * 60 * 60 - mMin * 60));
        if (mHour > 0) {
            mInquiryDate = mHour + "时" + mMin + "分" + mSecond + "秒";
        } else if (mMin > 0) {
            mInquiryDate = mMin + "分" + mSecond + "秒";
        } else if (mSecond > 0) {
            mInquiryDate = mSecond + "秒";
        } else {
            mInquiryDate = 0 + "秒";
        }
    } catch (e) {
        console.log("------>" + e);
    }
    return mInquiryDate;
}

function getStandardDt(dt) {
    var time = dt.replace(/-/g, ':').replace(' ', ':');
    time = time.split(':');
    var resultTime = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
    return resultTime;
}

/**
 *
 * */
function getScoreStr(score) {
    if (null == score || undefined === score || score === "") {
        score = 0;
    } else {
        score = parseInt(score);
    }
    var ScoreArr = [
        "下次记得评价呦！",
        "感谢您的评价，我们会继续改进！",
        "感谢您的评价，祝您生活愉快！",
        "感谢您的评价，祝您生活愉快！",
        "谢谢您的支持，我们会再接再厉！",
        "谢谢您的支持，我们会再接再厉！"
    ];
    switch (score) {
        case 0:
            return ScoreArr[0];
        case 1:
            return ScoreArr[1];
        case 2:
            return ScoreArr[2];
        case 3:
            return ScoreArr[3];
        case 4:
            return ScoreArr[4];
        case 5:
            return ScoreArr[5];
        default:
            return ScoreArr[0];
    }

}

var Page = {

    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPageName = "doctorRecordHome";
        if(RenderParam.carrierId === '640092' || RenderParam.carrierId === '460092') {
            currentPageName = "doctorRecordHomeV2";
        }
        var currentPage = LMEPG.Intent.createIntent(currentPageName);
        currentPage.setParam("memberID", InitData.InitMemberId);
        return currentPage;
    },

    onClickInquiry: function (btn) {
        startInquiryAgain();
    },
    jumpDoctorEvaluation: function (str) {
        var objCurrent = Page.getCurrentPage();
        var objDepartment = LMEPG.Intent.createIntent("doctorEvaluation");
        objDepartment.setParam("InquiryData", str);
        LMEPG.Intent.jump(objDepartment, objCurrent);
    },
    jumpDoctorInquiry: function (doctorInfo, jsonInquiry) {
        var objCurrent = Page.getCurrentPage();

        var objInquiryCall = LMEPG.Intent.createIntent("inquiryCall");
        objInquiryCall.setParam("area", RenderParam.areaCode);
        objInquiryCall.setParam("avatar_url", doctorInfo.avatar_url);
        objInquiryCall.setParam("department", doctorInfo.department);
        objInquiryCall.setParam("doc_id", doctorInfo.doc_id);
        objInquiryCall.setParam("doc_name", doctorInfo.doc_name);
        objInquiryCall.setParam("hospital", doctorInfo.hospital);
        objInquiryCall.setParam("job_title", doctorInfo.job_title);
        objInquiryCall.setParam("entryType", P2PInstantInquiry.InquiryEntry.INQUIRY_RECORD);
        objInquiryCall.setParam("phone", jsonInquiry.extras_info.landline_phone);
        objInquiryCall.setParam("src_page", RenderParam.carrierId === '640092' ? "doctorRecordHomeV2" : "doctorRecordHome");

        LMEPG.Intent.jump(objInquiryCall, objCurrent);
    }

};
var PageStart = {


    // 初始化底部导航栏按钮
    initBottom: function () {
        buttons.push({
            id: 'delete_btn',
            name: '删除',
            type: 'img',
            nextFocusLeft: 'inquiry_again',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V3/bg_del.png',
            focusImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V3/f_de.gif',
            click: showDeleteDialog,
            focusChange: PageStart.onFocusChange,
            beforeMoveChange: PageStart.onBeforeMoveChange,
        });
        buttons.push({
            id: 'inquiry_again',
            name: '选项4',
            type: 'img',
            nextFocusLeft: "",
            nextFocusRight: "delete_btn",
            backgroundImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V3/bg_key.png',
            focusImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V3/f_key.png',
            click: Page.onClickInquiry,
            focusChange: "",
            beforeMoveChange: PageStart.onBeforeMoveChange,
        });
    },
    pageUp: function () {
        loadInquiryData(InitData.LoadState.PrePage);
    },
    pageDown: function () {
        loadInquiryData(InitData.LoadState.NextPage);
    },

    onTimeFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "border_select")
        } else {
            LMEPG.CssManager.removeClass(btn.id, "border_select")
        }
    },
    onClickStar: function (btn) {
        var score = btn.cStartIndex;
        var reqData = {
            inquiryId: InitData.InquiryData.inquiryId,
            userId: InitData.InquiryData.userId,
            score: score
        };
        LMEPG.ajax.postAPI('Doctor/setDoctorScore', reqData, function (rsp) {
            var retObj = JSON.parse(rsp);
            switch (retObj.code) {
                case "0":
                    var btnStar5 = LMEPG.BM.getButtonById("star_5");
                    btn.backgroundImage = g_appRootPath + "/Public/img/hd/DoctorP2P/V3/icon_star_full.png";
                    btnStar5.focusable = false;
                    LMEPG.BM.requestFocus("suggest_btn");
                    LMEPG.UI.showToast("评价成功");
                    break;
                case "-1008":
                    LMEPG.UI.showToast("你已经评价过了，不能再次评价！");
                    break;
                default:
                    LMEPG.UI.showToast("评价失败，请重新评价！" + retObj.code);
                    break;
            }
        });
    },

    onBeforeMoveChange: function (direction, current) {
        //翻页
        switch (direction) {
            case "up":
                if (current.id === "inquiry_again") {
                    loadInquiryData(InitData.LoadState.PrePage);
                    return false;
                }
                break;
            case "down":
                if (current.id === "inquiry_again") {
                    loadInquiryData(InitData.LoadState.NextPage);
                    return false;
                }
                break;
            case "right":
                if (current.id.substring(0, 4) === "star") {
                    var currentIndex = current.cStartIndex;
                    if (currentIndex < 5) {
                        current.backgroundImage = g_appRootPath + "/Public/img/hd/DoctorP2P/V3/icon_star_full.png";
                    } else {
                        current.backgroundImage = g_appRootPath + "/Public/img/hd/DoctorP2P/V3/icon_star_full.png";
                        LMEPG.BM.requestFocus("delete_btn");
                        return false;
                    }
                }
                break;
            case "left":
                if (current.id.substring(0, 4) === "star") {
                    current.backgroundImage = g_appRootPath + "/Public/img/hd/DoctorP2P/V3/icon_star_null.png";
                }
                break;
        }
    },

    init: function () {
        PageStart.initBottom();
        if (InitData.InitMemberId === "-1") {
            Show("warm_tips");
        } else {
            Hide("warm_tips");
        }
    }
};

var List = {
    // 创建菜单
    createMenu: function (mInquiryList, mInquiry39List) {
        InitData.StoreDeleteInquiry.userId = mInquiryList.list[0].user_id;
        InitData.StoreDeleteInquiry.memberId = mInquiryList.list[0].member_id;
        InitData.StoreDeleteInquiry.inquiryId = mInquiryList.list[0].inquiry_id;

        InitData.PageTotal = mInquiryList.count;
        var tab_list = G("doctor_info");//数据块
        var tab_list2 = G("tab_content");//数据块
        var strTable = '';
        var strTable2 = '';

        tab_list.innerHTML = "";
        tab_list2.innerHTML = "";

        //变量赋值
        var tempDisease = "暂无"; //主诉
        var tempMedicalHistory = "暂无"; //病史
        var tempAdvice = "暂无"; //建议

        var tempDocName = "";
        var tempDocJob = "";
        var tempDocDepartment = "";
        var tempCreateDt = mInquiryList["list"][0].create_dt;
        var tempFinishDt = mInquiryList["list"][0].finish_dt;
        var tempInquiryDutation = getInquiryDurationTime(tempCreateDt, tempFinishDt);
        var tempRecommendMedicineArr = [];//推荐用药列表
        var tempDocImg = "";
        var tempPageFlag = InitData.PageCurrent + "/" + InitData.PageTotal;

        if (mInquiry39List.code === "0") {
            var inquiry39Item = mInquiry39List.info;

            if (inquiry39Item instanceof Object) {
                tempDisease = is_empty(inquiry39Item.disease_desc) ? tempDisease : inquiry39Item.disease_desc;//主诉
                tempAdvice = is_empty(inquiry39Item.diagnosis) ? tempAdvice : inquiry39Item.diagnosis;    //建议
                tempMedicalHistory = is_empty(inquiry39Item.medical_history) ? tempMedicalHistory : inquiry39Item.medical_history;//病史
                tempDocName = inquiry39Item.doc_name;
                tempDocJob = inquiry39Item.job_title;
                tempDocDepartment = inquiry39Item.department;
                tempDocImg = buildDoctorAvatarUrl(CWS_HLWYY_URL, inquiry39Item.doc_id, inquiry39Item.avatar_url, carrierId);
            }
        } else {
            LMEPG.UI.showToast("拉取39问诊记录异常：" + mInquiry39List.code);
        }

        G("page").innerHTML = tempPageFlag;
        if (InitData.PageCurrent > 1) {
            Show("arrow_pre");
        } else {
            Hide("arrow_pre");
        }
        if (InitData.PageCurrent < InitData.PageTotal) {
            Show("arrow_next");
        } else {
            Hide("arrow_next");
        }
        var btnTips = "再次问诊";
        if (InitData.InitMemberId === "-1") {
            btnTips = "归档";
        }
        // 创建医生
        strTable += "<img class='bg_info' src='" + g_appRootPath + "/Public/img/hd/DoctorP2P/V3/bg_doctor_v1.png'/>";
        strTable += "<img class='doctor_photo' src='" + tempDocImg + "'/> ";
        strTable += '<div class="doctor_introduce"> ';
        strTable += '<div class="title">' + tempDocName + '</div> ';
        strTable += ' <div class="doctor_word">' + tempDocJob + '</div> ';
        strTable += ' <div class="doctor_word">' + tempDocDepartment + '</div> ';
        strTable += ' <div class="doctor_word">' + tempCreateDt + '</div> ';
        strTable += ' <div class="doctor_word" >' +
            '   <div class="button_text_1">' + btnTips + '</div>' +
            '   </span><img id="inquiry_again" class="button_img_1" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V3/bg_key.png" />' +
            '</div> ';
        strTable += ' <div class="doctor_word marginTop">' + getScoreStr(mInquiry39List.info.assess_score) + '</div> ';
        strTable += ' <div class="doctor_word marginTop"> ';

        // 根据评分创建星星
        var assessScore = parseInt(mInquiry39List.info.assess_score);
        for (var j = 0; j < 5; j++) {
            if (j < assessScore) {
                strTable += ' <img  class="star" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V3/icon_star_full.png"/> ';
            } else {
                strTable += ' <img  class="star" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V3/icon_star_null.png"/> ';
            }
        }

        // buttons.push();

        strTable += ' </div> ';
        strTable += ' </div> ';
        //创建问诊结果
        strTable2 += ' <div id="tab1"> ';
//            strTable2 += ' <div class="result"><span class="font_weight">咨询人：</span><div class="line">' + tempDocName + '</div><div class="long"></div> ';
        strTable2 += ' <div class="result"><span class="font_weight">时长：</span>' + tempInquiryDutation + '</div> ';
        strTable2 += ' <div class="result"><span class="font_weight">主诉：</span>' + tempDisease + '</div> ';
        strTable2 += ' <div class="result"><span class="font_weight">病史：</span>' + tempMedicalHistory + '</div> ';
        strTable2 += ' <div class="result"><span class="font_weight">初诊：</span> ';
        strTable2 += ' ' + tempAdvice + '</div> ';
        strTable2 += ' </div> ';

        tab_list.innerHTML = strTable;
        tab_list2.innerHTML = strTable2;
        LMEPG.BM.init("inquiry_again", buttons, "", true)
    },

};

window.onload = function () {
    PageStart.init();
    loadInquiryData(InitData.LoadState.Init);
    LMEPG.UI.keyboard.addCloseCallBack(function () {
        LMEPG.BM.init('gid_common_edit_dialog_input', buttons, '', true);
        LMEPG.KEM.addKeyEvent("KEY_BACK", LMEPG.UI.commonEditDialog.onInnerBack);
    });
    if (RenderParam.carrierId === '640092') document.body.style.backgroundImage = 'url(' + LMEPG.ajax.getAppRootPath() + '/Public/img/hd/Home/V10/bg.png)';
};
