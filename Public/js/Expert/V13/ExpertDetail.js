var CWS_HLWYY_URL = RenderParam.CWS_HLWYY_URL;
var platformType = RenderParam.platformType;     // 平台类型
var parentPage = RenderParam.parentPage;         // 父页面
var returnUrl = RenderParam.returnUrl;               // 父页面
var focusId = RenderParam.focusId;       //默认焦点
var userId = RenderParam.userId;
var carrierId = RenderParam.carrierId;
var areaCode = RenderParam.areaCode;
var clinic = RenderParam.clinic;
var expertUrl = RenderParam.expertUrl;
var lmcid = RenderParam.lmcid;// 区域ID

var Detail = {
    buttons: [],
    init: function () {
        Detail.getExpertDetail(function (data) {
            G("doctor-title").innerHTML = data.doctor_name + '<span>' + data.doctor_level + '</span>';
            G("doctor-department").innerHTML = data.doctor_department_name;
            G("doctor-hospital").innerHTML = data.doctor_hospital_name;
            G("doctor-Attending").innerHTML = data.doctor_skill.length > 12 ? '<marquee id="doctor-Attending" scrollamount="5"\n' +
                'scrolldelay="50" scrolldelay="50" behavior="scroll" ' +
                'direction="left">' + data.doctor_skill + '</marquee>' : data.doctor_skill;

            G("introduce").innerHTML = LMUtils.marquee.start({
                txt: data.doctor_introduce,
                len: 400,
                dir: 'up',
                vel: 2
            });
            var marquee = document.getElementsByTagName('marquee')[1];
            if (marquee) {
                marquee.style.height = 330 + 'px';
            }
            G("doctor-pic").src = LMEPG.Inquiry.expertApi.createDoctorUrl(expertUrl, data.doctor_user_id, data.doctor_avatar, lmcid);

            Detail.createBtns();

            // 海看探针
            if (RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002") {
                var turnPageInfo = {
                    currentPage: document.referrer,
                    turnPage: location.href,
                    turnPageName: document.title,
                    turnPageId: data.clinic_id,
                    clickId: ""
                };
                ShanDongHaiKan.sendReportData('6', turnPageInfo);
            }
        });
        this.isOverflowWrap();
        RenderParam.lmcid === "410092" && Detail.onBack410092()
    },


    onBack410092: function () {
        try {
            HybirdCallBackInterface.setCallFunction(function (param) {
                LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                   onBack();
                }
            });
        } catch (e) {
            LMEPG.UI.logPanel.show("e");
        }
    },

    onFocusChange: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.style.backgroundColor = '#ef0b2c';
        } else {
            btnElement.style.backgroundColor = '#32cfe0';

        }
    },
    innerEl: G('desc-wrap'),
    elHeight: 0,
    isOverflowWrap: function () {
        this.elHeight = parseInt(this.getInnerHeight(this.innerEl, 'height'));
        this.elHeight < 410 && G('doctor-desc').removeChild(G('scroll-wrap'));  // 如果没有溢出内容则不显示滚动条
    },
    getInnerHeight: function (el, attr) {
        var val;
        if (el.currentStyle) {
            val = el.currentStyle[attr];
        } else {
            val = getComputedStyle(el, null)[attr];
        }
        return val;
    },
    Nc: 20,
    onBeforeMoveChangeScrollDistance: function (key, btn) {
        if (key == 'left' || key == 'right') {
            return;
        }
        var scrollElement = G(btn.id);
        var scrollBtnObj = LMEPG.ButtonManager.getButtonById('scroll-bar');
        if (key == 'up' && scrollElement.style.top == '0px') {
            scrollBtnObj.nextFocusUp = 'doctor-advice-1';
        } else {
            scrollBtnObj.nextFocusUp = '';
        }
        var changeUp = function () {
            Detail.Nc = Math.max(0, Detail.Nc -= 20);
        };
        var changeDown = function () {
            Detail.Nc = Math.min(270, Detail.Nc += 20);
        };
        var updateDis = function () {
            scrollElement.style.top = Detail.Nc + 'px';
            G('desc-wrap').style.top = -Detail.Nc + 'px';
        };
        if (key == 'down') {
            changeDown();
        } else {
            changeUp();
        }
        updateDis();
    },
    createBtns: function () {
        this.buttons.push({
            id: 'doctor-advice-1',
            name: '免费咨询1',
            type: 'img',
            nextFocusDown: 'scroll-bar',
            backgroundImage: g_appRootPath + '/Public/img/hd/Expert/V13/free_advice.png',
            focusImage: g_appRootPath + '/Public/img/hd/Expert/V13/free_advice_f.png',
            focusChange: '',
            click: Detail.consultFree,
        }, {
            id: 'scroll-bar',
            name: '滚动条',
            type: 'div',
            nextFocusUp: 'doctor-advice-1',
            click: '',
            focusChange: this.onFocusChange,
            beforeMoveChange: this.onBeforeMoveChangeScrollDistance
        });
        this.initButtons('doctor-advice-1');
    },
    initButtons: function (focusId) {
        LMEPG.ButtonManager.init(focusId, this.buttons, '', true);
    },
    moveToFocus: function (focusId) {
        LMEPG.ButtonManager.requestFocus(focusId);
    },

    /**
     * 获取专家详情
     */
    getExpertDetail: function (callback) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.Inquiry.expertApi.getExpertDetail(clinic, function (rsp) {
            var expertInfoList = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (typeof expertInfoList.data === "undefined") {
                console.log("获取专家详情数据失败！");
                onBack();
                return;
            }
            if (expertInfoList.code === 0 || expertInfoList.code === '0') {
                callback(expertInfoList.data[0]);
            } else {
                LMEPG.UI.showToast("获取专家详情请求失败");
                onBack();
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 免费咨询
     */
    consultFree: function (button) {
        LMEPG.UI.forbidDoubleClickBtn(function () {
            // 山东电信海看上报埋点信息
            if (RenderParam.carrierId === "371092" || RenderParam.carrierId === "371002") {
                var turnPageInfo = {
                    currentPage: window.location.origin + "/index.php/Home/Expert/expertIndexV13",
                    turnPage: window.location.href,
                    turnPageName: document.title,
                    turnPageId: RenderParam.clinic,
                    clickId: "39JKZJJJ-MFZX"
                };
                ShanDongHaiKan.sendReportData('6', turnPageInfo);
            }
            LMEPG.UI.showWaitingDialog("");
            LMEPG.Inquiry.expertApi.getAdvisoryDoctor(function (rsp) {
                LMEPG.UI.dismissWaitingDialog("");
                try {
                    var resObj = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if (resObj.code != "0") {
                        LMEPG.UI.dismissWaitingDialog("");
                        LMEPG.UI.showToast("当前没有医生在线，请稍后在试！");
                        return;
                    }
                    // 判断医生是否在线
                    var docInfo = resObj.doc_info;
                    var tempOnline = parseInt(docInfo.online_state);
                    // 医生处于在线或者忙碌状态时
                    if (tempOnline === 3 || tempOnline === 2) {
                        Detail.getInquiryData(docInfo, button.id);
                    } else {
                        LMEPG.UI.showToast("助理医生暂时不在线");
                    }
                } catch (e) {
                    LMEPG.UI.showToast("解析数据异常");
                    LMEPG.UI.dismissWaitingDialog("");
                }
            });
        });
    },

    /**
     * 拉取问诊记录信息
     * @param:docInfo
     */
    getInquiryData: function (docInfo, buttonId) {
        var inquiryEntry = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRY;
        if (clinic !== '') {
            LMEPG.Inquiry.expertApi.getInquiryList('', 0, 1, function (data) {
                try {
                    if (data != null) {
                        var expertJsonObj = data instanceof Object ? data : JSON.parse(data);
                        if (expertJsonObj.data.length > 0) {
                            if (expertJsonObj.code === 0 || expertJsonObj.code === '9') {
                                var tempData = expertJsonObj.data[0];
                                var isPay = tempData.clinic_is_pay;                //支付状态  0未支付 1已支付
                                var clinicState = tempData.clinic_state;           //就诊状态 0：等待；1：进行；2：完成；3：关闭；
                                if (isPay == 1) { //已经付款
                                    if (clinicState == 0) {
                                        inquiryEntry = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRIING_RECORD;
                                    } else if (clinicState == 1) {
                                        inquiryEntry = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRY_ONGOING;
                                    } else if (clinicState == 2) {
                                        inquiryEntry = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRIED_RECORD;
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                // 开启问诊
                Detail.startInquiry(docInfo, buttonId, inquiryEntry);

            });
        } else {
            // 开启问诊
            Detail.startInquiry(docInfo, buttonId, inquiryEntry);
        }
    },

    /**
     * 开始问诊助理医生
     * @param doctorInfo 助理医生信息
     * @param buttonId 免费咨询按钮
     * @param inquiryType 问诊类型
     */
    startInquiry: function (doctorInfo, buttonId, inquiryType) {
        var inquiryInfo = Detail.getInquiryInfo(buttonId, inquiryType);
        inquiryInfo.doctorInfo = doctorInfo;
        if (RenderParam.areaCode === '216') {
            LMEPG.Inquiry.p2p._startWeChatVideoInquiry(inquiryInfo);
        } else if (RenderParam.carrierId === '420092') {
            // 湖北电信使用电话问诊方式
            LMEPG.Inquiry.p2p._startTVPhoneInquiry(inquiryInfo);
        } else {
            LMEPG.Inquiry.p2p._startVideoInquiry(inquiryInfo);
        }
    },

    /**
     * 通用的问诊参数
     * @param buttonId 点击问诊的按钮Id
     * @param moduleType 当前问诊的状态
     */
    getInquiryInfo: function (buttonId, moduleType) {
        return {
            userInfo: {
                isVip: RenderParam.isVip,                                    // 用户身份信息标识
                accountId: RenderParam.userAccount,                          // IPTV业务账号
            },
            memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
            moduleInfo: {
                moduleId: LMEPG.Inquiry.p2p.EXPERT_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                moduleName: LMEPG.Inquiry.p2p.EXPERT_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                moduleType: moduleType,                                      // 问诊模块标识 - 在线问医
                focusId: buttonId,                                           // 当前页面的焦点Id
                intent: Detail.getCurPageObj(),                      // 当前模块页面路由标识
            },
            serverInfo: {
                fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                cwsHlwyyUrl: RenderParam.CWS_URL_OUT,                        // cws互联网医院模块链接地址
            },
            inquiryEndHandler: Detail.inquiryEndHandler,                     // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        };
    },

    /**
     * 问诊结束处理函数
     */
    inquiryEndHandler: function () {
        LMEPG.Log.info("ExpertIndex.js---startInquiry--End");
    },

    /**
     * 当前页面的路由
     */
    getCurPageObj: function () {
        var intent = LMEPG.Intent.createIntent('expertDetail');
        intent.setParam('clinic', clinic);
        return intent;
    }
};
var onBack = function () {
    LMEPG.Intent.back();
};