var CWS_HLWYY_URL = RenderParam.CWS_HLWYY_URL;
var CWS_URL_OUT = RenderParam.CWS_URL_OUT;
var platformType = RenderParam.platformType;     // 平台类型
var parentPage = RenderParam.parentPage;         // 父页面
var returnUrl = RenderParam.returnUrl;               // 父页面
var focusId = RenderParam.focusId;       //默认焦点
var userId = RenderParam.userId;
var carrierId = RenderParam.carrierId;
var areaCode = RenderParam.areaCode;
var lmcid = RenderParam.lmcid;// 区域ID
var expertUrl = RenderParam.expertUrl;
var ExpertRecord = {
    buttons: [],
    page: 0, // 当前页码（从0开始）
    maxPage: 0, // 最大页码（从0开始）
    init: function () {
        // 焦点保持
        ExpertRecord.page = parseInt(RenderParam.page);

        Network.getInquiryData(ExpertRecord.page);
        RenderParam.lmcid === "410092" && ExpertRecord.onBack410092()
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

    /**
     * 渲染页面
     * @param data
     */
    render: function (data) {
        if (data == null) {
            LMEPG.UI.showToast("拉取数据失败" + data);
            LMEPG.BM.init('', [], '', true);
            return;
        }
        var expertJsonObj = data instanceof Object ? data : JSON.parse(data);
        if (expertJsonObj.data.length === 0) { // 无数据情况
            LMEPG.BM.init('', [], '', true);
            Show('null-data-000051');
            return;
        }
        // 保存最大页数
        ExpertRecord.maxPage = expertJsonObj.count - 1;
        // 设置页码
        G('page-count').innerHTML = (this.page + 1) + '/' + (this.maxPage + 1);
        ActionTime.clearOrderTimer();
        ActionTime.clearInquiryTimer();

        var code = expertJsonObj.code;
        if (code != 0) {
            LMEPG.UI.showToast("拉取数据失败" + code);
            LMEPG.BM.init('', [], '', true);
            return;
        }

        // html
        Show('content');
        G('doctor-item').innerHTML = '<ul class="picture-wrap">' +
            '<li><img class="doctor-picture" id="doctor-picture" alt=""></li>' +
            '<li class="doctor-name" id="doctor-name"></li>' +
            '<li class="doctor-department" id="doctor-department"></li>' +
            '<li class="doctor-Attending" id="doctor-Attending"></li>' +
            // '<li class="doctor-case">问诊量</li>' +
            '</ul>' +
            '<ul id="user-order-info">' +
            '<li class="doctor-hospital"><span id="left-time-title"></span><span id="left-time"></span></li>' +
            '<li class="doctor-hospital" id="hospital-name"></li>' +
            // '<li class="user-number"><span>订单编号：</span>32312</li>' +
            '<li class="user-status" id="order-status"></li>' +
            '<li class="user-case-num" id="appointment-id"></li>' +
            '<li class="user-case-time" id="inquiry-time"></li>' +
            '<li class="user-apply-time" id="apply-time"></li>' +
            '<li class="user-pay" id="fee"></li>' +
            '<li class="user-name" id="patient-name"></li>' +
            '<li class="user-contact" id="contact"></li>' +
            '</ul>' +
            '<div class="code-wrap">' +
            '<img id="doctor-code" alt="">' +
            '<p id="doctor-code-desc"></p>';
        this.toggleArrow();
        // 其他逻辑
        CONSULT_EXPERT_STATUS = false;
        var tempData = expertJsonObj.data[0];

        var timeWithYear = new Date(getStandardDt(tempData && tempData.begin_dt)).format("yyyy");
        var inquiryBeginDtFromApi = tempData.begin_dt;            //问诊开始时间
        var inquiryEndDtFromApi = tempData.end_dt;            //问诊开始时间

        // 就诊时间
        var tempInquiryTime = "";
        if (timeWithYear == "2099") {
            tempInquiryTime = "3天内安排就诊";
        } else {
            tempInquiryTime = new Date(getStandardDt(tempData.begin_dt)).format("yyyy-MM-dd hh:mm") + "到" + new Date(getStandardDt(tempData.end_dt)).format("hh:mm");
        }

        var stateFlag = tempData.clinic_is_pay + '-' + tempData.clinic_state // 支付状态  0未支付 1已支付 - 就诊状态 0：等待；1：进行；2：完成；3：关闭；
        switch (stateFlag) {
            case '0-0':
                ORDER_STATUS = ORDER_STATUS_PAY;
                break;
            case '0-3':
                ORDER_STATUS = ORDER_STATUS_CLOSE;
                break;
            case '1-0':
                ORDER_STATUS = ORDER_STATUS_INQUIRY;
                break;
            case '1-2':
                ORDER_STATUS = ORDER_STATUS_OVER;
                break;
        }

        APPOINTMENT_ID = tempData.appointment_id;
        buttons = [];
        buttonConsult.appointmentID = tempData.appointment_id;
        buttonAdvise.appointmentID = tempData.appointment_id;
        buttonCase.appointmentID = tempData.appointment_id;
        buttonConsult.expertObj = tempData;
        var orderStatusDesc; // 文字订单状态
        var qrcodeDesc; // 二维码底部文字描述
        var appointmentId; // 就诊编号
        switch (ORDER_STATUS) {
            case ORDER_STATUS_OVER:
                orderStatusDesc = "已完成";
                qrcodeDesc = "扫码保存建议至手机";
                buttons.push(buttonConsult);
                buttons.push(buttonAdvise);
                buttons.push(buttonCase);
                buttonConsult.nextFocusDown = "btn-case";
                Show("btn-consult");
                Show("btn-case");
                Show("btn-advise");
                getQrCode(tempData.appointment_id, ORDER_STATUS);
                // 咨询助理医生按钮
                if (RenderParam.focusId == "btn-consult" || RenderParam.focusId == "")
                    G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                else
                    G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                appointmentId = tempData.appointment_id;
                break;
            case ORDER_STATUS_INQUIRY:
                orderStatusDesc = "待就诊";
                qrcodeDesc = "微信扫码<br/>上传病历资料";
                appointmentId = tempData.appointment_id;
                buttons.push(buttonConsult);
                buttons.push(buttonCase);
                buttonConsult.nextFocusDown = "btn-case";
                Show("btn-consult");
                Show("btn-case");
                Hide("btn-advise");

                INQUIRY_END_TIME = new Date(getStandardDt(inquiryEndDtFromApi)).getTime();
                INQUIRY_START_TIME = new Date(getStandardDt(inquiryBeginDtFromApi)).getTime();

                if (timeWithYear == "2099") {
                    CONSULT_EXPERT_STATUS = false;
                    // 咨询助理医生按钮
                    if (RenderParam.focusId == "btn-consult" || RenderParam.focusId == "")
                        G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                    else
                        G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                    buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                    buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                } else {
                    mServerTime = 0;
                    LMEPG.Inquiry.expertApi.getTime(function (date) {
                        mServerTime = new Date(getStandardDt(date)).getTime();
                        var timeEndInterval = INQUIRY_END_TIME - mServerTime;//距离结束问诊的时间间隔
                        if (timeEndInterval <= 0) {
                            var timeStr = "请及时进入候诊室";
                            G("left-time-title").innerHTML = timeStr;
                            G("left-time").innerHTML = "";
                            CONSULT_EXPERT_STATUS = true;

                            // 进入候诊室按钮
                            if (RenderParam.focusId == "btn-consult" || RenderParam.focusId == "")
                                G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter_f.png";
                            else
                                G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter.png";
                            buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter.png";
                            buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter_f.png";
                        } else {
                            CONSULT_EXPERT_STATUS = false;
                            ActionTime.startInquiryTimer(false);
                        }
                    });
                }
                getQrCode(tempData.appointment_id, ORDER_STATUS);
                break;
            case ORDER_STATUS_PAY:
                orderStatusDesc = "待付款";
                qrcodeDesc = "微信扫码支付";
                appointmentId = "无";
                buttonConsult.nextFocusDown = "";
                buttons.push(buttonConsult);
                Show("btn-consult");
                Hide("btn-case");
                Hide("btn-advise");
                // 咨询助理医生按钮
                if (RenderParam.focusId == "btn-consult" || RenderParam.focusId == "")
                    G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                else
                    G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                getQrCode(tempData.appointment_id, ORDER_STATUS);
                break;
            case ORDER_STATUS_CLOSE:
                orderStatusDesc = "已关闭";
                appointmentId = tempData.appointment_id;
                buttons.push(buttonConsult);
                buttonConsult.nextFocusDown = "";
                Hide("btn-case");
                Hide("btn-advise");
                qrcodeDesc = "";
                G("doctor-code").src = g_appRootPath + "/Public/img/Common/spacer.gif"; // 二维码
                // 咨询助理医生按钮
                if (RenderParam.focusId == "btn-consult" || RenderParam.focusId == "")
                    G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                else
                    G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                break;
            default:
                appointmentId = tempData.appointment_id;
                LMEPG.UI.showToast("当前约诊状态异常");
                buttonConsult.nextFocusDown = "";
                buttons.push(buttonConsult);
                Hide("btn-case");
                Hide("btn-advise");
                qrcodeDesc = "";
                G("doctor-code").src = g_appRootPath + "/Public/img/Common/spacer.gif"; // 二维码
                // 咨询助理医生按钮
                if (RenderParam.focusId == "btn-consult" || RenderParam.focusId == "")
                    G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                else
                    G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                break;
        }

        // 设置页面数据
        G("doctor-picture").src = LMEPG.Inquiry.expertApi.createDoctorUrl(expertUrl, tempData.doctor_user_id, tempData.doctor_avatar, lmcid); // 医生头像
        G("doctor-name").innerHTML = tempData.doctor_name; // 医生姓名
        G("doctor-department").innerHTML = tempData.department_name; // 部门
        G("doctor-Attending").innerHTML = tempData.doctor_level; // 职称
        G("hospital-name").innerHTML = "医院：" + tempData.hospital_name; // 医院名称
        G("order-status").innerHTML = "订单状态：" + orderStatusDesc; // 订单状态
        G("appointment-id").innerHTML = "就诊编号：" + appointmentId; // 就诊编号
        G("inquiry-time").innerHTML = "就诊时间：" + tempInquiryTime; // 就诊时间
        G("apply-time").innerHTML = "申请时间：" + tempData.insert_dt; // 申请时间
        var fee = (parseFloat(tempData.pay_value) - parseFloat(LMEPG.Func.isEmpty(tempData.discount_value) ? 0 : tempData.discount_value)).toFixed(2);
        if (fee < 0) fee = '0.00';
        G("fee").innerHTML = "订单费用：" + fee; // 订单费用
        G("patient-name").innerHTML = "患者姓名：" + tempData.patient_name; // 患者姓名
        G("contact").innerHTML = "联系方式：" + tempData.phone_num; // 联系方式
        G("doctor-code-desc").innerHTML = qrcodeDesc; // 二维码底部文字描述


        LMEPG.ButtonManager.init("btn-consult", buttons, "", true);
        // 焦点保持
        if (!LMEPG.Func.isEmpty(RenderParam.focusId))
            LMEPG.BM.requestFocus(RenderParam.focusId);
    },
    prevPage: function () {
        if (this.page == 0) {
            return;
        }
        this.page--;
        RenderParam.focusId = ''; // 上一页，下一页，没有焦点保持，清空
        Network.getInquiryData(this.page);
    },
    nextPage: function () {
        if (this.page == this.maxPage) {
            return;
        }
        this.page++;
        RenderParam.focusId = ''; // 上一页，下一页，没有焦点保持，清空
        Network.getInquiryData(this.page);
    },
    toggleArrow: function () {
        S('prev-arrow');
        S('next-arrow');
        this.page == 0 && H('prev-arrow');
        this.page == this.maxPage && H('next-arrow');
    },
};

/**
 * 网络请求
 */
var Network = {
    /**
     * 拉取问诊记录信息
     * @param startLimit 对应mysql中的limit字句开始值，从0开始
     */
    getInquiryData: function (startLimit) {
        LMEPG.UI.showWaitingDialog("");
        LMEPG.Inquiry.expertApi.getInquiryList("", startLimit, 1, function (data) {
            console.log(data);
            ExpertRecord.render(data); // 渲染页面
            LMEPG.UI.dismissWaitingDialog();
        });
    }
};

/**
 * ===================================页面跳转等=================================
 */
var Action = {
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent("expertRecordHome");
        objCurrent.setParam("page", ExpertRecord.page);
        var currentButton = LMEPG.BM.getCurrentButton();
        if (currentButton) {
            objCurrent.setParam("focusId", currentButton.id);
        }
        return objCurrent;
    },
    /**
     * 咨询助理医生/进入候诊室
     * @param btnItemObj
     */
    consult: function (btnItemObj) {
        if (RenderParam.carrierId == '371092' || RenderParam.carrierId == '371002') {
            var turnPageInfo = {
                currentPage: window.location.origin + "/index.php/Home/Expert/expertIndexV13",
                turnPage: window.location.href,
                turnPageName: document.title,
                turnPageId: btnItemObj.expertObj.clinic_id,
                clickId: "39JKZJJJ-MFZX"
            };
            ShanDongHaiKan.sendReportData('6', turnPageInfo);
        }
        if (CONSULT_EXPERT_STATUS) {
            Action.consultExpert(btnItemObj.expertObj, btnItemObj.id);
        } else {
            Action.consultFree(btnItemObj.id);
        }
        console.log(CONSULT_EXPERT_STATUS);
    },
    /**
     * 查看病历
     * @param btnItemObj
     */
    patientCase: function (btnItemObj) {
        var objCurrent = Action.getCurrentPage();

        var objExpertCase = LMEPG.Intent.createIntent("expertCase");
        objExpertCase.setParam("appointmentID", btnItemObj.appointmentID);

        LMEPG.Intent.jump(objExpertCase, objCurrent);
    },
    /**
     * 查看医生建议
     * @param btnItemObj
     */
    advise: function (btnItemObj) {
        var objCurrent = Action.getCurrentPage();

        var objExpertAdvice = LMEPG.Intent.createIntent("expertAdvice");
        objExpertAdvice.setParam("appointmentID", btnItemObj.appointmentID);

        LMEPG.Intent.jump(objExpertAdvice, objCurrent);
    },
    /**
     * 跳转支付成功页面
     * @param appointmentID
     */
    jumpExpertSuccess: function (appointmentID) {
        var objCurrent = Action.getCurrentPage();

        var objExpertRecordSuccess = LMEPG.Intent.createIntent("expertSuccess");
        objExpertRecordSuccess.setParam("appointmentID", appointmentID);

        LMEPG.Intent.jump(objExpertRecordSuccess, objCurrent);
    },

    /**
     * 咨询大专家
     * @param expertObj 大专家信息对象
     * @param buttonId 免费咨询按钮
     */
    consultExpert: function (expertObj, buttonId) {

        if (RenderParam.platformType === 'sd' || RenderParam.areaCode === '216') {
            Action.consultFree(buttonId);
            return;
        }

        // 问诊大专家
        LMEPG.Inquiry.expert.inquiryExpert(expertObj, RenderParam.isRunOnAndroid === '0', buttonId);

        ActionTime.startInquiryAppUpdateUiTimer();
    },

    /**
     * 咨询助理医生
     * @param buttonId 免费咨询按钮
     */
    consultFree: function (buttonId) {
        LMEPG.UI.showWaitingDialog("");
        LMEPG.Inquiry.expertApi.getAdvisoryDoctor(function (data) {
            try {
                LMEPG.UI.dismissWaitingDialog("");
                var resObj = data instanceof Object ? data : JSON.parse(data);
                if (resObj.code != "0") {
                    LMEPG.UI.showToast("当前没有医生在线，请稍后在试！");
                    return;
                }

                // 判断医生是否在线
                var docInfo = resObj.doc_info;
                var tempOnline = parseInt(docInfo.online_state);
                // 医生处于在线或者忙碌状态时
                if (tempOnline !== 3 || tempOnline === 2) {
                    LMEPG.UI.showToast("助理医生暂时不在线");
                    return;
                }

                var entryType = -1;
                if (ORDER_STATUS == ORDER_STATUS_OVER) {
                    //诊后咨询
                    entryType = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRIED_RECORD;
                } else if (ORDER_STATUS == ORDER_STATUS_INQUIRY) {
                    //已约咨询
                    entryType = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRIING_RECORD;
                } else {
                    //诊前咨询
                    entryType = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRY;
                }

                var inquiryInfo = Action.getInquiryInfo(buttonId, entryType);
                inquiryInfo.doctorInfo = docInfo;
                if (RenderParam.platformType === 'sd' || RenderParam.areaCode === '216') { // 使用微信小程序问诊
                    LMEPG.Inquiry.p2p._startWeChatVideoInquiry(inquiryInfo);
                } else {
                    LMEPG.Inquiry.p2p._startVideoInquiry(inquiryInfo);
                }
            } catch (e) {
                LMEPG.UI.showToast("解析数据异常");
                console.log("--->" + e.toString());
            }
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog("");
            LMEPG.UI.showToast("获取咨询医生信息请求失败");
        });
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
                intent: Action.getCurrentPage(),                             // 当前模块页面路由标识
            },
            serverInfo: {
                fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                cwsHlwyyUrl: RenderParam.CWS_URL_OUT,                        // cws互联网医院模块链接地址
            },
            inquiryEndHandler: Action.inquiryEndHandler,               // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        };
    },

    /**
     * 问诊结束处理函数
     */
    inquiryEndHandler: function () {
        LMEPG.Log.info("ExpertIndex.js---startInquiry--End");
    },
};


/**
 * ********************************************定时器相关的方法******************************************************
 */
var mOrderTimer; // 轮询定时器，订单状态为待付款的时候，开启轮询
var mServerTime = 0; //定时器开始的值
var INQUIRY_START_TIME = "0";//问诊时间,用来做定时器使用
var INQUIRY_END_TIME = "0";//问诊结束时间
var CONSULT_EXPERT_STATUS = false;//true:咨询大医生，false：咨询助理医生
var mInquiryTimer = null;//问诊定时器
var mInquiryAppUpdateUiTimer = null;//开始问诊时定时获取医生状态，更新订单状态
var APPOINTMENT_ID;//预约id

var ORDER_STATUS_PAY = 1;//待付款的订单状态
var ORDER_STATUS_INQUIRY = 2;//等就诊的订单状态
var ORDER_STATUS_OVER = 3;//已完成的订单状态
var ORDER_STATUS_CLOSE = 4;//已关闭的订单状态
var ORDER_STATUS = 0;//没有订单状态

var ActionTime = {
    orderTimerAppointmentID: "",//保存订单中的预约id

    startOrderTimer: function (appointmentID) {
        ActionTime.orderTimerAppointmentID = appointmentID;
        if (ActionTime.orderTimerAppointmentID == "") {
            return;
        }
        // 轮询查询订单状态，支付成功后自动跳转到成功结果页面
        mOrderTimer = setInterval(function () {
            LMEPG.Inquiry.expertApi.getInquiryList(ActionTime.orderTimerAppointmentID, 0, 1, function (data) {
                try {
                    var expertJsonObj = null;
                    if (data instanceof Object) {
                        expertJsonObj = data;
                    } else {
                        expertJsonObj = JSON.parse(data);
                    }
                    var code = expertJsonObj.code;
                    if (code == 0) {
                        var tempData = expertJsonObj.data[0];
                        var isPay = tempData.clinic_is_pay;                //支付状态  0未支付 1已支付
                        var clinicState = tempData.clinic_state;           //就诊状态 0：等待；1：进行；2：完成；3：关闭；
                        if (isPay == 1 && clinicState == 0) {
                            ActionTime.clearOrderTimer();
                            Action.jumpExpertSuccess(ActionTime.orderTimerAppointmentID);
                        }

                    } else if (code == "-102") {
                        console.log("拉取数据失败订单数据失败：" + code);
                    } else {
                        console.log("拉取数据失败订单数据失败：" + code);
                    }
                } catch (e) {
                    console.log("拉取数据失败订单数据异常：" + e.toString());
                }
            });
        }, 3000);
    },

    clearOrderTimer: function () {
        ActionTime.orderTimerAppointmentID = "";
        clearInterval(mOrderTimer);
    },

    startInquiryTimer: function (isLoop) {
        if (isLoop) {
            mServerTime = mServerTime + 1000;
        }
        if (INQUIRY_START_TIME > 0) {
            var timeStartInterval = INQUIRY_START_TIME - mServerTime;//距离开始问诊的时间间隔
            var timeEndInterval = INQUIRY_END_TIME - mServerTime;//距离结束问诊的时间间隔
            console.log("------->timeStartInterval=" + timeStartInterval + "--->INQUIRY_START_TIME=" + INQUIRY_START_TIME);
            if (timeStartInterval > 0) {
                if (timeStartInterval <= 1200000) { //距离问诊开始20分钟内
                    CONSULT_EXPERT_STATUS = true;

                    // 进入候诊室按钮
                    if (LMEPG.BM.getCurrentButton().id == 'btn-consult')
                        G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter_f.png";
                    else
                        G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter.png";
                    buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter.png";
                    buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter_f.png";
                } else {
                    CONSULT_EXPERT_STATUS = false;

                    // 咨询助理医生按钮
                    if (LMEPG.BM.getCurrentButton().id == 'btn-consult')
                        G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                    else
                        G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                    buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor.png";
                    buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_doctor_f.png";
                }
                G("left-time-title").innerHTML = "距离门诊开始还有";
                showTime();
            } else {
                if (timeEndInterval > 0) {  //问诊时间中
                    var timeStr = "请及时进入候诊室";
                    G("left-time-title").innerHTML = timeStr;
                    G("left-time").innerHTML = "";
                    CONSULT_EXPERT_STATUS = true;

                    // 进入候诊室按钮
                    if (LMEPG.BM.getCurrentButton().id == 'btn-consult')
                        G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter_f.png";
                    else
                        G("btn-consult").src = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter.png";
                    buttons[0].backgroundImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter.png";
                    buttons[0].focusImage = g_appRootPath + "/Public/img/hd/Expert/V13/btn_consult_enter_f.png";
                }
            }

            function showTime() {
                var d, h, m, s;
                d = Math.floor(timeStartInterval / 1000 / 60 / 60 / 24);
                h = checkTime(Math.floor(timeStartInterval / 1000 / 60 / 60 % 24));
                m = checkTime(Math.floor(timeStartInterval / 1000 / 60 % 60));
                s = checkTime(Math.floor(timeStartInterval / 1000 % 60));
                var timeStr = d + "天" + h + "时" + m + "分" + s + "秒";
                console.log("timer=" + timeStr);
                G("left-time").innerHTML = timeStr;
                mInquiryTimer = setTimeout(ActionTime.startInquiryTimer, 1000, true);

                function checkTime(i) { //将0-9的数字前面加上0，历1变为01
                    if (i < 10) {
                        i = "0" + i;
                    }
                    return i;
                }

            }
        }
    },

    /**
     * 清除查询订单计时器
     */
    clearInquiryTimer: function () {
        clearTimeout(mInquiryTimer);
    },

    /**
     * 启动定时器，查询订单状态
     */
    startInquiryAppUpdateUiTimer: function () {
        console.log("startInquiryAppUpdateUiTimer-->start");
        mInquiryAppUpdateUiTimer = setInterval(function () {
            LMEPG.Inquiry.expertApi.getInquiryList(APPOINTMENT_ID, 0, 1, function (data) {
                try {
                    var expertJsonObj = null;
                    if (data instanceof Object) {
                        expertJsonObj = data;
                    } else {
                        expertJsonObj = JSON.parse(data);
                    }
                    var code = expertJsonObj.code;
                    if (code == 0) {
                        var tempData = expertJsonObj.data[0];
                        var clinicState = tempData.clinic_state;           //就诊状态 0：等待；1：进行；2：完成；3：关闭；
                        if (clinicState == 2 || clinicState == 3) {
                            ActionTime.clearInquiryAppUpdateUiTimer();
                            ActionTime.clearInquiryTimer();
                            G("left-time-title").innerHTML = "";
                            G("left-time").innerHTML = "";
                            console.log("startInquiryAppUpdateUiTimer-->正常了");
                        } else {
                            console.log("startInquiryAppUpdateUiTimer-->其他状态");
                        }

                    } else if (code == "-102") {
                        console.log("startInquiryAppUpdateUiTimer拉取数据失败订单数据失败：" + code);
                    } else {
                        console.log("startInquiryAppUpdateUiTimer拉取数据失败订单数据失败：" + code);
                    }
                } catch (e) {
                    console.log("startInquiryAppUpdateUiTimer拉取数据失败订单数据异常：" + e.toString());
                }
            });
        }, 1000);
    },

    clearInquiryAppUpdateUiTimer: function () {
        clearInterval(mInquiryAppUpdateUiTimer);
        G("left-time-title").innerHTML = "";
        G("left-time").innerHTML = "";
        console.log("clearInquiryAppUpdateUiTimer-->");
    }
};

/**
 * 获取二维码
 * @param appointmentID
 * @param orderStatus
 */
function getQrCode(appointmentID, orderStatus) {
    var qrType = 1;
    if (orderStatus == ORDER_STATUS_OVER || orderStatus == ORDER_STATUS_INQUIRY) {
        qrType = 2;
    }
    LMEPG.Inquiry.expertApi.getQrCodeViaAppointmentID(appointmentID, qrType, function (data) {
        try {
            var qrCodeJsonObj = null;
            if (data instanceof Object) {
                qrCodeJsonObj = data;
            } else {
                qrCodeJsonObj = JSON.parse(data);
            }
            if (qrCodeJsonObj.code == 0) {
                if (orderStatus == ORDER_STATUS_PAY) {
                    ActionTime.startOrderTimer(appointmentID, qrCodeJsonObj.timestamp);
                }
                var qrUrl = CWS_URL_OUT + qrCodeJsonObj.url;
                G("doctor-code").src = qrUrl; // 二维码
            } else {
                LMEPG.UI.showToast("获取二维码失败" + qrCodeJsonObj.code);
                G("doctor-code").src = g_appRootPath + "/Public/img/Common/spacer.gif"; // 二维码
            }
        } catch (e) {
            LMEPG.UI.showToast("解析二维码异常");
            console.log("d=" + e);
            G("doctor-code").src = g_appRootPath + "/Public/img/Common/spacer.gif"; // 二维码
        }
    });
}

/**
 * 格式化时间
 * @param dt
 * @returns {Date}
 */
function getStandardDt(dt) {
    var time = dt.replace(/-/g, ':').replace(' ', ':');
    time = time.split(':');
    var resultTime = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
    return resultTime;
}


/**
 * =====================================按钮相关==================================
 */
var buttons = [];
var buttonConsult = {
    id: 'btn-consult',
    name: '咨询助理医生/进入候诊室',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: '',
    nextFocusUp: '',
    nextFocusDown: 'btn-case',
    backgroundImage: g_appRootPath + '/Public/img/hd/Expert/V13/btn_consult_doctor.png',
    focusImage: g_appRootPath + '/Public/img/hd/Expert/V13/btn_consult_doctor_f.png',
    click: Action.consult,
    focusChange: "",
    beforeMoveChange: onbeforeMoveTurnPage,
    moveChange: "",
    appointmentID: "",//预约的id
    consultStatus: "false",//false咨询普通医生，true约诊的大专家医生
    expertObj: null //大专家对象
};

var buttonCase = {
    id: 'btn-case',
    name: '查看病历',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: '',
    nextFocusUp: 'btn-consult',
    nextFocusDown: 'btn-advise',
    backgroundImage: g_appRootPath + '/Public/img/hd/Expert/V13/btn_case.png',
    focusImage: g_appRootPath + '/Public/img/hd/Expert/V13/btn_case_f.png',
    click: Action.patientCase,
    focusChange: "",
    beforeMoveChange: onbeforeMoveTurnPage,
    moveChange: "",
    appointmentID: ""
};

var buttonAdvise = {
    id: 'btn-advise',
    name: '医生建议',
    type: 'img',
    nextFocusLeft: '',
    nextFocusRight: '',
    nextFocusUp: 'btn-case',
    nextFocusDown: '',
    backgroundImage: g_appRootPath + '/Public/img/hd/Expert/V13/btn_advise.png',
    focusImage: g_appRootPath + '/Public/img/hd/Expert/V13/btn_advise_f.png',
    click: Action.advise,
    focusChange: "",
    beforeMoveChange: onbeforeMoveTurnPage,
    moveChange: "",
    appointmentID: ""
};

/**
 * 左右切换翻页
 * @param key
 * @param btn
 */
function onbeforeMoveTurnPage(key, btn) {
    if (key == 'left') {
        ExpertRecord.prevPage();
    }
    if (key == 'right') {
        ExpertRecord.nextPage();
    }
}

var onBack = function () {
    LMEPG.Intent.back();
};
