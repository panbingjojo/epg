<!-- 事件回调处理 -->
var CWS_HLWYY_URL = RenderParam.CWS_HLWYY_URL;
var platformType = RenderParam.platformType;     // 平台类型
var parentPage = RenderParam.parentPage;         // 父页面
var returnUrl = RenderParam.returnUrl;               // 父页面
var srcPage = RenderParam.srcPage;               // 返回页
var focusId = RenderParam.focusId;       //默认焦点
var userId = RenderParam.userId;
var carrierId = RenderParam.carrierId;
var areaCode = RenderParam.areaCode;
var phoneNumber = RenderParam.phoneNumber;
var entryType = RenderParam.entryType;
var avatarUrl = RenderParam.avatarUrl;
var department = RenderParam.department;
var hospital = RenderParam.hospital;
var docId = RenderParam.docId;
var docName = RenderParam.docName;
var currentDeptId = RenderParam.currentDeptId; //全部科室

var P2PInstantInquiry = {
    /** 问诊呼叫返回状态码 */
    INQUIRY_STATE: {
        CALL_START: 1,
        CALL_SUCCESS: 2,
        JOIN_LIST_START: 3,
        DOC_TREATE_START: 4,
        DOC_TREATE_SUCCESS: 5,
        END_BY_DOC: 6,
        END_BY_USER: 7,

        CALL_TIMEOUT: -1,
        CALL_FAILED: -2,
        JOIN_LIST_FAILED: -3,
    },
}

/**
 * 返回按键事件回调
 */
function onBack() {
    LMEPG.UI.commonDialog.showV1("您确定要结束本次问诊吗？", ["确定", "取消"], function (index) {
        if (index === 0) {
            finishInquiry();
        }
    });
//            LMEPG.Intent.back();
}

function htmlBack() {
    onBack();
}

<!-- 页面跳转 -->
/**
 * 得到当前页面
 */
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent("inquiryCall");
    return objCurrent;
}

//返回上级页面
function jumpBack() {
    LMEPG.Intent.back();
}

<!-- 处理视频问诊医生列表 -->
var doctors = [];

var netHospUserId = "0";
var ipvtInquiryID = 0;
var inquiryId = "0";
var waitTime = 0;              //等待时长
var callResult = 0;            //呼叫结果
var netHospInquiryId = 0;      //互联网医院问诊id
var curOrder = 0;


<!--视频问诊处理-->

/**
 * 开始问诊！！！
 */
function startInquiry() {
    var postData = {
        doc_id: docId,
        user_id: userId,
        phone: phoneNumber,
        is_vip: 0,
        user_name: "",
        area: areaCode,
        platform_name: "青海电信",
        inquiry_id: "0",
        entry: "在线问诊",
        age: "20",
        gender: "男",
    };

    LMEPG.ajax.postAPI("Doctor/startInquiry", postData, function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.code == 0) {
                getIPTVInquiryID();
                addMemberInquiryRecord(0);
            } else {
                LMEPG.UI.showToastV2("发起问诊失败！");
                LMEPG.Intent.back();
            }
        } catch (e) {
            LMEPG.UI.showToastV2("网络故障，发起问诊失败");
            LMEPG.Intent.back();
        }
    }, function () {
        LMEPG.UI.showToastV2("网络故障，发起问诊失败！");
        LMEPG.Intent.back();
    });
}

/**
 * 添加问诊记录到cws
 * @param type 类型
 */
function addMemberInquiryRecord(type) {
    var postData = {
        user_id: userId,
        phone: phoneNumber,
        hospital: hospital,
        doc_id: docId,
        doc_name: docName,
        doc_image_url: encodeURIComponent(buildDoctorAvatarUrl(CWS_HLWYY_URL, docId, avatarUrl, carrierId)),
        net_hosp_user_id: netHospUserId == "0" ? userId : netHospUserId,
        inquiry_id: ipvtInquiryID,
        member_id: "-1",
        member_name: "",
        inquiry_type: type,
        entry_type: entryType,
        dept_id: department,
        wait_time: waitTime,
        call_result: callResult,
        net_hosp_inquiry_id: inquiryId,
    };

    LMEPG.ajax.postAPI("Doctor/addMemberInquiryRecord", postData, function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (type == 1) {
                if (inquiryId > 0) {
                    var InquiryData = {
                        userId: netHospUserId,
                        inquiryId: inquiryId,
                        memberId: -1,
                    };
                    jumpBack();
                } else {
                    jumpBack();
                }
            } else {
                setTimeout(queryInquiryInfo, 1000);
            }
        } catch (e) {
            LMEPG.UI.showToastV2("添加问诊记录数据解析异常");
        }
    }, function () {
        LMEPG.UI.showToastV2("添加问诊记录失败！");
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
        areaCode: areaCode,
    };
    var json = {
        doctorId: doctorId,
        avatarUrl: avatarUrl
    };
    return urlPrefix + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
}

function getIPTVInquiryID() {
    var timestamp = Date.parse(new Date());
    ipvtInquiryID = userId + timestamp / 1000;
    return ipvtInquiryID;
}

function finishInquiry() {
    // 微信问诊
    if (RenderParam.scene != "") {
        jumpBack();
        return;
    }

    var postData = {
        phone: phoneNumber,
        user_id: userId,
    };

    LMEPG.ajax.postAPI("Doctor/finishInquiry", postData, function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data == "undefined") {
                jumpBack();
            } else {
                if (data.code == 0) {
                    jumpBack();
                }
            }
        } catch (e) {
            LMEPG.UI.showToastV2("结束问诊失败,数据解析异常");//d
            jumpBack();
        }
    }, function () {
        LMEPG.UI.showToastV2("结束问诊失败！");
        jumpBack();
    });

}


function queryInquiryInfo() {
    var postData = {
        phone: phoneNumber,
        user_id: userId,
    };

    LMEPG.ajax.postAPI("Doctor/queryInquiryInfo", postData, function (rsp) {
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            dealInquiryMsg(data);
        } catch (e) {
            LMEPG.UI.showToastV2("获取问诊状态数据解析异常" + rsp);
            finishInquiry();
        }
    }, function () {
        LMEPG.UI.showToastV2("获取问诊状态失败！");
        finishInquiry();
    });
}

function dealInquiryMsg(data) {
//        document.getElementById("p1").innerHTML = "code:" + data.code + ", state:" + data.state + ", errcode:" + data.errcode + ", inquiry_id:" + data.inquiry_id + ",order:" + data.order;
    if (typeof data.code == 'undefined') {
        LMEPG.UI.showToastV2("获取问诊状态失败！");
        return;
    }
    switch (data.code) {
        case 0:
            netHospUserId = data.hlwyy_user_id;
            callResult = data.call_result;
            inquiryId = data.inquiry_id;
            waitTime = data.wait_time;
            curOrder = data.order;
            if (data.state == P2PInstantInquiry.INQUIRY_STATE.JOIN_LIST_START) {
                if (curOrder > 1) {
                    PageStart.status = 1;
                    PageStart.initHtml();
                } else {
                    PageStart.status = 2;
                    PageStart.initHtml();
                }
            } else if (data.state == P2PInstantInquiry.INQUIRY_STATE.DOC_TREATE_SUCCESS) {
                PageStart.status = 3;
                PageStart.initHtml();
            } else if (data.state == P2PInstantInquiry.INQUIRY_STATE.END_BY_DOC || data.state == P2PInstantInquiry.INQUIRY_STATE.END_BY_USER) {
                addMemberInquiryRecord(1);
                break;
            }
            setTimeout(queryInquiryInfo, 1000);
            break;
        case -101:
            addMemberInquiryRecord(1);
            break;
        case -102:
            LMEPG.UI.showToastV2("用户数据有误！");
            addMemberInquiryRecord(1);
            break;
        default:
            LMEPG.UI.showToastV2("未知错误！");
            addMemberInquiryRecord(1);
            break
    }
}

var buttons = [];
var PageStart = {
    status: 0, //0是呼叫，1是排队，2等待 医生接诊,3是问诊
    // 初始化底部导航栏按钮
    initBottom: function () {
        //    工具栏
        buttons.push({
            id: 'finish-btn',
            name: '问医',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            click: finishInquiry,
        });
    },
    initHtml: function () {
        switch (PageStart.status) {
            case 0:
                G("waiting-msg").innerHTML = "在线问诊连线中，请稍等...";
                G("introduce").innerHTML = "温馨提示：请注意接听来电，来电号码为 0898-6856-8003 。";
                break;
            case 1:
                G("waiting-msg").innerHTML = "您当前排在第<span id=number>" + curOrder + "</span>位,请稍等...";
                G("introduce").innerHTML = "欢迎来到互联网医院远程问诊服务平台，稍后会为您接通医生，请不要挂机！";
                break;
            case 2:
                G("waiting-msg").innerHTML = "正在接通，请稍等...";
                G("introduce").innerHTML = "欢迎来到互联网医院远程问诊服务平台，稍后会为您接通医生，请不要挂机！";
                break;
            case 3:
                G("waiting-msg").innerHTML = "问 诊 中...";
                G("introduce").innerHTML = "感谢您使用互联网医院远程问诊！";
                break;
        }
    },
    init: function () {
        PageStart.initBottom();
        PageStart.initHtml();
        LMEPG.ButtonManager.init("finish-btn", buttons, "", true);
    }
};

var WXInquiry = {
    /**
     * 查询小程序问诊状态
     */
    queryInquiryInfo: function() {
        var postData = {
            scene: RenderParam.scene,
        };
        LMEPG.ajax.postAPI("Doctor/getInquiryStatus", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(data);
                if (data.result == 0) {
                    WXInquiry.displayStateInfo(data.state);
                } else {
                    LMEPG.Log.error("获取问诊状态失败！");
                    WXInquiry.queryInquiryInfoTimeOut();
                }
            } catch (e) {
                LMEPG.Log.error("获取问诊状态数据解析异常" + rsp);
                WXInquiry.queryInquiryInfoTimeOut();
            }
        }, function () {
            LMEPG.Log.error("获取问诊状态失败！");
            WXInquiry.queryInquiryInfoTimeOut();
        });
    },

    queryInquiryInfoTimeOut: function() {
        setTimeout(WXInquiry.queryInquiryInfo, 1000);
    },

    /**
     * 问诊状态显示
     * @param state
     */
    displayStateInfo: function(state) {
        try {
            switch (state) {
                case 0:
                    WXInquiry.queryInquiryInfoTimeOut();
                    break;
                /*case 1:
                    G('waiting-msg').innerText = "正在连接，请稍后...";
                    WXInquiry.queryInquiryInfoTimeOut();
                    break;*/
                case 1:
                    G('waiting-msg').innerText = "微信小程序正在排队...";
                    WXInquiry.queryInquiryInfoTimeOut();
                    break;
                case 2:
                    G('waiting-msg').innerText = "微信小程序正在问诊...";
                    WXInquiry.queryInquiryInfoTimeOut();
                    break;
                case 3:
                case 4:
                    G('waiting-msg').innerText = "微信小程序问诊已结束...";
                    // LMEPG.UI.showToastV2("微信小程序问诊已结束");
                    jumpBack();
                    break;
                case -1:
                    G('waiting-msg').innerText = "小程序码已失效...";
                    LMEPG.UI.showToastV2("小程序码已失效");
                    jumpBack();
                    break;
                default:
                    LMEPG.UI.showToastV2("获取问诊状态出错！");
                    jumpBack();
                    break;
            }
        } catch (e) {
            LMEPG.UI.showToastV2("出错啦！");
            jumpBack();
        }
    },
};

window.onload = function () {
    // 电话问诊
    if (RenderParam.scene == "") {
        startInquiry();
        PageStart.init();
    }
    // 小程序问诊
    else {
        G("introduce").innerHTML = "";
        WXInquiry.queryInquiryInfo();
        LMEPG.ButtonManager.init("finish-btn", buttons, "", true);
    }
};
