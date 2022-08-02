function onBack() {
    LMEPG.Intent.back();
}

var JumpHandle = {
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent("doctorRecordDetail");
        objCurrent.setParam("memberID", DataHandle.InitData.memberID);
        objCurrent.setParam("memberObj", UIHandle.escape2Html(DataHandle.InitData.memberObj));
        return objCurrent;
    },
    jumpDoctorRecordDetail: function () { //医生记录详情页
        var objCurrent = this.getCurrentPage();
        var objRecordArchive = LMEPG.Intent.createIntent("recordArchive");
        objRecordArchive.setParam("inquiryID", DataHandle.InitData.inquiryItem.inquiry_id);
        objRecordArchive.setParam("memberID", DataHandle.InitData.memberID);
        LMEPG.Intent.jump(objRecordArchive, objCurrent);
    },
    jumpBuyVip: function () {
        var objCurrent = JumpHandle.getCurrentPage();
        objCurrent.setParam("pageCurrent", DataHandle.pageCurr);
        objCurrent.setParam("memberObj", UIHandle.escape2Html(DataHandle.InitData.memberObj));
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("userId", RenderParam.userId);
        objOrderHome.setParam("remark", "视频问诊记录");
        LMEPG.Intent.jump(objOrderHome, objCurrent);
    },
    startInquiry: function (memberInfo, docInfo) {
    }
};

/**
 * 问诊
 * @type {{}}
 */
var scene = "";
var Inquiry = {
    /**
     * 开启一键问医功能
     * @param button 一键问医按钮
     */
    oneKeyInquiry: function (button) {
        console.log(DataHandle.InitData.inquiryItem);
        if (DataHandle.InitData.memberID == "-1") {
            JumpHandle.jumpDoctorRecordDetail();
        } else {
            LMEPG.Inquiry.p2pApi.getDoctorDetail(DataHandle.InitData.inquiryItem.doctor_id, function (docInfo) {
                var inquiryInfo = {
                    userInfo: {
                        isVip: RenderParam.isVip,                                    // 用户身份信息标识
                        accountId: RenderParam.accountId,                            // IPTV业务账号
                    },
                    memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
                    moduleInfo: {
                        moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                        moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                        moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                        focusId: button.id,                                          // 当前页面的焦点Id
                        intent: JumpHandle.getCurrentPage(),                           // 当前模块页面路由标识
                    },
                    serverInfo: {
                        fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                        cwsHlwyyUrl: RenderParam.CWS_HLWYY_URL,                      // cws互联网医院模块链接地址
                        teletextInquiryUrl: RenderParam.teletextInquiryUrl,          // 微信图文问诊服务器链接地址
                    },
                    blacklistHandler: Inquiry.inquiryBlacklistHandler,               // 校验用户黑名单时处理函数
                    noTimesHandler: Inquiry.noInquiryTimesHandler,                   // 检验普通用户无问诊次数处理函数
                    doctorOfflineHandler: Inquiry.showDoctorOfflineTips,             // 检验医生离线状态时处理函数
                    inquiryEndHandler: Inquiry.inquiryEndHandler,                    // 检测医生问诊结束之后，android端回调JS端的回调函数
                    inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
                }

                LMEPG.Inquiry.p2p.oneKeyInquiry(inquiryInfo); // 启动一键问诊
            });
        }
    },

    inquiryBlacklistHandler: function () {
        var tipsText = '您之前在问诊过程中的行为已违反相关法律法规，不可使用在线问诊功能，同时我司已进行备案，并将保留追究你法律责任的权利。';
        LMEPG.UI.commonDialog.show(tipsText, ["确定", "取消"], function (index) {
            if (index === 0) {
                LMEPG.UI.commonDialog.dismiss();
            }
        });
    },

    noInquiryTimesHandler: function () {
        var tipsText = "您的免费问诊机会已用完！成为VIP可不限问诊次数";
        LMEPG.UI.commonDialog.show(tipsText, ["确定", "取消"], function (index) {
            if (index === 0) {
                JumpHandle.jumpBuyVip();
            }
        });
    },

    /**
     * 医生不在线处理函数
     */
    showDoctorOfflineTips: function () {
        LMEPG.UI.showToast('当前医生不在线');
    },

    /**
     * 医生问诊结束处理函数
     */
    inquiryEndHandler: function () {

    },
};

var UIHandle = {
    fileIndex: g_appRootPath + "/Public/img/hd/FamilyFile/",
    onClick: function (btn) {
        if (DataHandle.InitData.memberID == "-1") {
            JumpHandle.jumpDoctorRecordDetail();
        } else {
            var memberObj = JSON.parse(UIHandle.escape2Html(DataHandle.InitData.memberObj));
            var memberInfo = {
                member_id: memberObj.member_id,
                member_name: memberObj.member_name,
                member_age: memberObj.member_age,
                member_gender: memberObj.member_gender
            };
            var docInfo = {
                doc_id: DataHandle.InitData.inquiryItem.doctor_id
            };
            console.log("再次问诊");

            JumpHandle.startInquiry(memberInfo, docInfo);
        }
    },
    escape2Html: function (str) {
        var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    },
    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
//                LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
//                LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },
    onBeforeMoveChange: function (direction, current) {
        //翻页
        switch (direction) {
            case "left":
                if (current.id == "btn-change") {
                    UIHandle.preMenu();
                }
                break;
            case "right":
                if (current.id == "btn-change") {
                    UIHandle.nextMenu();
                }
                break;
        }
    },
    getScoreStr: function (score) {
        if (LMEPG.Func.isEmpty(score)) {
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

    },

    createHtml: function (inquiryItem, inquiry39Obj) {
        var disease = "";
        var medicalHistory = "";
        var advice = "";
        var docName = "";
        var docDepartment = "";
        var docJob = "";
        var time = getInquiryDurationTime(inquiryItem.create_dt, inquiryItem.finish_dt);
        var doctorImgStc = inquiryItem.doctor_image_url;
        var score = 0;

        if (inquiry39Obj.code == 0) {
            var inquiry39Item = inquiry39Obj.info;
            if (inquiry39Item instanceof Object) {
                disease = inquiry39Item.disease_desc;//主诉
                advice = inquiry39Item.diagnosis;    //建议
                medicalHistory = inquiry39Item.medical_history;//病史
                if (!LMEPG.Func.isEmpty(inquiry39Item)) {
                    if (!LMEPG.Func.isEmpty(inquiry39Item.assess_score)) {
                        score = inquiry39Item.assess_score;
                    }
                }
                docName = inquiry39Item.doc_name;
                docDepartment = inquiry39Item.department;
                docJob = inquiry39Item.job_title;

            }
        } else {
            disease = "";//主诉
            advice = "";    //建议
            medicalHistory = "";//病史
            LMEPG.UI.showToast("拉取39问诊记录异常：" + inquiry39Obj.code);
        }

        var btnTips = "再次问诊";
        if (DataHandle.InitData.memberID == "-1") {
            btnTips = "归档";
            G("warm").innerHTML = "温馨提示：请添加具体问诊人，归于个人健康档案";
        }

        var tab_list = document.getElementById("doctor_info");//数据块
        var tab_list2 = document.getElementById("tab_content");//数据块
        var strTable = '';
        var strTable2 = '';

        var defaultImg = " " + g_appRootPath + "__/Public/img/hd/DoctorP2P/V10/init_doc.png'";
        tab_list.innerHTML = "";
        tab_list2.innerHTML = "";

        strTable += "<img class='doctor_photo' src='" + doctorImgStc + "' onerror='this.src=" + defaultImg + "'/> ";
        strTable += '<div class="doctor_introduce"> ';
        strTable += '<div class="title">' + docName + '</div> ';
        strTable += ' <div class="doctor_word marginTop ">' + docDepartment + '</div> ';
        strTable += ' <div class="doctor_word marginTop ">' + docJob + '</div> ';
        strTable += ' <div class="doctor_word marginTop "></div> ';
        strTable += ' <div class="doctor_word marginTop "><div id="btn-change" class="btn-bg">' + btnTips + '</div></div> ';
        // strTable += ' <div class="doctor_word2 marginTop">' + UIHandle.getScoreStr(score) + '</div> ';
        strTable += ' <div class="doctor_word marginTop"> ';
        var starIndex = 0;

        // for (var j = 0; j < parseInt(score); j++) {   // 创建星星
        //     starIndex++
        //     strTable += ' <img id="star_' + starIndex + '" class="star" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V10/icon_star_ful.png"/> ';
        // }
        // for (var m = 0; m < 5 - parseInt(score); m++) {
        //     starIndex++
        //     strTable += ' <img id="star_' + starIndex + '" class="star" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V10/icon_star_null.png"/> ';
        // }
        strTable += ' </div> ';
        strTable += '</div>';
        var tempMemberName = "";
        if (!LMEPG.Func.isEmpty(DataHandle.InitData.memberObj)) {
            var memberObj = JSON.parse(UIHandle.escape2Html(DataHandle.InitData.memberObj));
            tempMemberName = memberObj.member_name;
        }
        tempMemberName = tempMemberName === undefined ? "" : tempMemberName;

        // 创建详情
        strTable2 += '<div  class="result">' + inquiryItem.create_dt + '</div>';
        strTable2 += ' <div class="result"><span class="font_weight">姓名：</span><div class="line">' + tempMemberName + '</div><div class="long">&nbsp;&nbsp</div> ';
        strTable2 += ' <span  class="font_weight">时长：</span><div class="line">' + time + '</div></div> ';
        strTable2 += ' <div class="result"><span class="font_weight">主诉：</span>' + getLimitStr(disease, 80) + '</div> ';
        strTable2 += ' <div class="result"><span class="font_weight">病史：</span>' + getLimitStr(medicalHistory, 80) + '</div> ';
        strTable2 += ' <div class="result"><span class="font_weight">初诊：</span> ';
        strTable2 += ' ' + getLimitStr(advice, 80) + '</div> ';

        tab_list.innerHTML = strTable;
        tab_list2.innerHTML = strTable2;
        this.updateMenuArrows();
        G("page").innerHTML = DataHandle.pageCurr + "/" + DataHandle.pageNum;
        LMEPG.ButtonManager.init("btn-change", buttons, "", true);

    },
    //遥控器左按键翻页
    preMenu: function () {
        if (DataHandle.pageCurr > 1) {
            DataHandle.pageCurr--;
            DataHandle.loadInquiryData();
        } else {
            LMEPG.UI.showToast("已经是第一页");
        }
    },
    nextMenu: function () {
        if (DataHandle.pageCurr < DataHandle.pageNum) {
            DataHandle.pageCurr++;
            DataHandle.loadInquiryData();
        } else {
            LMEPG.UI.showToast("已经是最后一页");
        }
    },
    updateMenuArrows: function () {
        G("arrow_pre").style.display = DataHandle.pageCurr > 1 ? "block" : "none";
        G("arrow_next").style.display = DataHandle.pageCurr < DataHandle.pageNum ? "block" : "none";
    },
    showNoData: function (isShow) {
        if (isShow) {
            G("content").style.display = "none";
            G("no-data").style.display = "block";
        } else {
            G("content").style.display = "block";
            G("no-data").style.display = "none";
        }
    }

};

// 定义全局按钮
var buttons = [
    {
        id: 'btn-change',
        name: '再次问诊或者归档',
        type: 'div',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
        focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
        click: Inquiry.oneKeyInquiry,
        focusChange: UIHandle.departFocus,
        beforeMoveChange: UIHandle.onBeforeMoveChange,
    }
];

var DataHandle = {
    InitData: {
        inquiryItem: "",
        memberObj: RenderParam.memberObj,
        memberID: RenderParam.memberID,
    },
    pageCurr: RenderParam.pageCurr,//当前页码
    pageNum: 0, //总数,
    loadInquiryData: function () {
        LMEPG.UI.showWaitingDialog("");
        var reqData = {
            "member_id": this.InitData.memberID,
            "page_current": this.pageCurr
        };
        LMEPG.ajax.postAPI('Doctor/getInquiryRecordDetail', reqData, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data instanceof Object) {
                    var mInquiryList = data.requiryList;
                    var mInquiry39List = data.requiry39List;

                    if (mInquiryList.result == 0) {
                        DataHandle.pageNum = mInquiryList.count;
                        var list = mInquiryList.list;
                        if (list.length > 0) {
                            var inquiryItem = list[0];
                            DataHandle.InitData.inquiryItem = inquiryItem;
                            UIHandle.createHtml(inquiryItem, mInquiry39List);
                            UIHandle.showNoData(false);
                        } else {
                            UIHandle.showNoData(true);
                            LMEPG.ButtonManager.init('', buttons, '', true);
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
};


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

function getLimitStr(str, overflowLength) {
    try {
        if (str == null) return 0;
        if (typeof str != "string") {
            str += "";
        }
        var length = str.replace(/[^\x00-\xff]/g, "ab").length
        if (overflowLength <= length) {
            return str.substring(0, overflowLength) + "...";
        }
    } catch (e) {
        LMEPG.UI.showToast("--->".e.toString());
    }
    return str;
}

window.onload = function () {
    DataHandle.loadInquiryData();
};
