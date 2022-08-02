var ctime;

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

var Page = {
    init: function () {
        LMEPG.BM.init('', [], '', true);
        RenderParam.docImageUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, RenderParam.docId, RenderParam.avatarUrl, RenderParam.carrierId);
        G("doctor-pic").src = RenderParam.docImageUrl;

        // 电话问诊
        if (RenderParam.scene == '') {
            H('icon-item');
            PhoneInquiry.displayStateInfo(0);
            PhoneInquiry.startInquiry();
        }
        // 微信问诊
        else {
            H('introduce-msg');
            Page.queryInquiryInfoTimeOut();
        }
    },

    /**
     * 查询小程序问诊状态
     */
    queryInquiryInfo: function () {
        var postData = {
            scene: RenderParam.scene,
        };
        LMEPG.ajax.postAPI("Doctor/getInquiryStatus", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data.result == 0) {
                    Page.displayStateInfo(data.state);
                } else if (data.code == -1) {
                    console.log(data.message);
                    Page.queryInquiryInfoTimeOut();
                } else {
                    // LMEPG.UI.showToast("获取问诊状态失败！");
                    Page.queryInquiryInfoTimeOut();
                }
            } catch (e) {
                // LMEPG.UI.showToast("获取问诊状态数据解析异常" + rsp);
                Page.queryInquiryInfoTimeOut();
            }
        }, function () {
            // LMEPG.UI.showToast("获取问诊状态失败！");
            Page.queryInquiryInfoTimeOut();
        });
    },

    /**
     * 问诊状态显示
     * @param state
     */
    displayStateInfo: function (state) {
        try {
            switch (state.toString()) {
                case "0":
                    Page.queryInquiryInfoTimeOut();
                    break;
                case "1":
                    G('text-info').innerText = "正在连接，请稍后...";
                    Page.queryInquiryInfoTimeOut();
                    break;
                case "2":
                    G('text-info').innerText = "微信小程序正在问诊...";
                    Page.queryInquiryInfoTimeOut();
                    break;
                case "3":
                case "4":
                    G('text-info').innerText = "微信小程序问诊已结束...";
                    //LMEPG.UI.showToast("微信小程序问诊已结束");
                    jumpBack();
                    break;
                case "-1":
                    G('text-info').innerText = "小程序码已失效...";
                    //LMEPG.UI.showToast("小程序码已失效");
                    jumpBack();
                    break;
                default:
                    LMEPG.UI.showToast("获取问诊状态出错！");
                    jumpBack();
                    break;
            }
        } catch (e) {
            LMEPG.UI.showToast("出错啦！");
            jumpBack();
        }
    },

    queryInquiryInfoTimeOut: function () {
        ctime = setTimeout(Page.queryInquiryInfo, 1000);
    },
};


var netHospUserId = "0";
var ipvtInquiryID = 0;
var inquiryId = "0";
var waitTime = 0;              //等待时长
var callResult = 0;            //呼叫结果
var curOrder = 0;
var PhoneInquiry = {
    /**
     * 开始问诊
     */
    startInquiry: function () {
        var postData = {
            doc_id: RenderParam.docId,
            user_id: RenderParam.userId,
            phone: RenderParam.phoneNumber,
            is_vip: 0,
            user_name: "",
            area: RenderParam.areaCode,
            platform_name: "EPG平台",
            inquiry_id: "0",
            entry: "在线问诊",
            age: "20",
            gender: "男",
        };

        LMEPG.ajax.postAPI("Doctor/startInquiry", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(postData);
                console.log(data);
                if (data.code == 0) {
                    PhoneInquiry.getIPTVInquiryID();
                    PhoneInquiry.addMemberInquiryRecord(0);
                } else {
                    LMEPG.UI.showToast("发起问诊失败！");
                    jumpBack();
                }
            } catch (e) {
                console.log(e);
                LMEPG.UI.showToast("网络故障，发起问诊失败"+e);
                jumpBack();
            }
        }, function () {
            LMEPG.UI.showToast("网络故障，发起问诊失败！");
            jumpBack();
        });
    },

    /**
     * 获取问诊id
     */
    getIPTVInquiryID: function () {
        var timestamp = Date.parse(new Date());
        ipvtInquiryID = RenderParam.userId + timestamp / 1000;
    },

    /**
     * 添加问诊记录到cws
     * @param type
     */
    addMemberInquiryRecord: function (type) {
        var postData = {
            user_id: RenderParam.userId,
            phone: RenderParam.phoneNumber,
            hospital: RenderParam.hospital,
            doc_id: RenderParam.docId,
            doc_name: RenderParam.docName,
            doc_image_url: RenderParam.docImageUrl,
            net_hosp_user_id: netHospUserId == "0" ? RenderParam.userId : netHospUserId,
            inquiry_id: ipvtInquiryID,
            member_id: "-1",
            member_name: "",
            inquiry_type: type,
            entry_type: RenderParam.entryType,
            dept_id: RenderParam.department,
            wait_time: waitTime,
            call_result: callResult,
            net_hosp_inquiry_id: inquiryId,
        };

        LMEPG.ajax.postAPI("Doctor/addMemberInquiryRecord", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(data);
                if (type == 0) {
                    setTimeout(PhoneInquiry.queryInquiryInfo, 1000);
                } else {
                    jumpBack();
                }
            } catch (e) {
                LMEPG.UI.showToast("添加问诊记录数据解析异常");
                jumpBack();
            }
        }, function () {
            LMEPG.UI.showToast("添加问诊记录失败！");
            jumpBack();
        });
    },

    /**
     * 查询问诊信息
     */
    queryInquiryInfo: function () {
        var postData = {
            phone: RenderParam.phoneNumber,
            user_id: RenderParam.userId,
        };

        LMEPG.ajax.postAPI("Doctor/queryInquiryInfo", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                PhoneInquiry.dealInquiryMsg(data);
            } catch (e) {
                LMEPG.UI.showToast("获取问诊状态数据解析异常" + rsp);
                PhoneInquiry.finishInquiry();
            }
        }, function () {
            LMEPG.UI.showToast("获取问诊状态失败！");
            PhoneInquiry.finishInquiry();
        });  
    },

    /**
     * 结束问诊
     */
    finishInquiry: function () {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            phone: RenderParam.phoneNumber,
            user_id: RenderParam.userId,
        };

        LMEPG.ajax.postAPI("Doctor/finishInquiry", postData, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(data);
                if (data == "undefined") {
                    jumpBack();
                } else {
                    if (data.code != 0) {
                        jumpBack();
                    }
                }
            } catch (e) {
                LMEPG.UI.showToast("结束问诊失败,数据解析异常");
                jumpBack();
            }
        }, function () {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("结束问诊失败！");
            jumpBack();
        });
    },

    /**
     * 状态处理
     */
    dealInquiryMsg: function (data) {
        if (data.code == undefined) {
            LMEPG.UI.showToast("获取问诊状态失败！");
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
                        PhoneInquiry.displayStateInfo(1);
                    } else {
                        PhoneInquiry.displayStateInfo(2);
                    }
                } else if (data.state == P2PInstantInquiry.INQUIRY_STATE.DOC_TREATE_SUCCESS) {
                    PhoneInquiry.displayStateInfo(3);
                } else if (data.state == P2PInstantInquiry.INQUIRY_STATE.END_BY_DOC || data.state == P2PInstantInquiry.INQUIRY_STATE.END_BY_USER) {
                    PhoneInquiry.addMemberInquiryRecord(1);
                    break;
                }
                setTimeout(PhoneInquiry.queryInquiryInfo, 1000);
                break;
            case -101:
                PhoneInquiry.addMemberInquiryRecord(1);
                break;
            case -102:
                LMEPG.UI.showToast("用户数据有误！");
                PhoneInquiry.addMemberInquiryRecord(1);
                break;
            default:
                LMEPG.UI.showToast("未知错误！");
                PhoneInquiry.addMemberInquiryRecord(1);
                break
        }
    },

    /**
     * 问诊状态显示
     * @param state
     */
    displayStateInfo: function (state) {
        try {
            switch (state) {
                case 0:
                    G("text-info").innerHTML = "在线问诊连线中，请稍等...";
                    break;
                case 1:
                    G("text-info").innerHTML = "您当前排在第" + curOrder + "位,请稍等...";
                    break;
                case 2:
                    G("text-info").innerHTML = "正在接通，请稍等...";
                    break;
                case 3:
                    G("text-info").innerHTML = "问 诊 中...";
                    break;
            }
        } catch (e) {
            LMEPG.UI.showToast("出错啦！");
            jumpBack();
        }
    },
};

var onBack = function () {
    if (RenderParam.scene == '') {
        PhoneInquiry.finishInquiry();
        return;
    }
    jumpBack();
};

var jumpBack = function () {
    LMEPG.Intent.back();
};

window.onload = function () {
    Page.init();

    // 设置皮肤（产品背景图）
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        var bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
        document.body.style.backgroundImage = 'url(' + bgImg + ')';
    }
};

