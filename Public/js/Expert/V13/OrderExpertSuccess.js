var ORDER_STATUS_PAY = 1;//待付款的订单状态
var ORDER_STATUS_INQUIRY = 2;//等就诊的订单状态
var ORDER_STATUS_OVER = 3;//已完成的订单状态
var ORDER_STATUS_CLOSE = 4;//已关闭的订单状态
var ORDER_STATUS = 0;//没有订单状态

var OrderSuccess = {
    innerEl: G('desc-wrap'),
    innerHeight: '',
    buttons: [],
    init: function () {
        this.createBtns();
        LMEPG.Inquiry.expertApi.getInquiryList(RenderParam.initAppointmentID,0, 1, function (data) {
            console.log(data);
            OrderSuccess.updateUI(data);
        });
    },
    onFocusChange: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.style.backgroundColor = '#ef0b2c';
        } else {
            btnElement.style.backgroundColor = '#32cfe0';
        }
    },
    createBtns: function () {
        this.buttons.push({
            id: 'btn-sure',
            name: '免费咨询1',
            type: 'img',
            nextFocusDown: 'scroll-bar',
            backgroundImage: g_appRootPath+'/Public/img/hd/Home/V13/Home/Common/btn_sure.png',
            focusImage: g_appRootPath+'/Public/img/hd/Home/V13/Home/Common/btn_sure_f.png',
            focusChange: '',
            click: onBack,
        });
        this.initButtons('btn-sure');
    },
    initButtons: function (focusId) {
        LMEPG.ButtonManager.init(focusId, this.buttons, '', true);
    },
    moveToFocus: function (focusId) {
        LMEPG.ButtonManager.requestFocus(focusId);
    },
    /**
     * 设置页面数据
     * @param data
     */
    updateUI: function (data) {
        try {
            var expertJsonObj;
            if (data instanceof Object) {
                expertJsonObj = data;
            } else {
                expertJsonObj = JSON.parse(data);
            }
            if (expertJsonObj.code === 0 || expertJsonObj.code === '0') {
                var tempData = expertJsonObj.data[0];
                G("doctor-title").innerHTML = tempData.doctor_name;
                G("doctor-hospital").innerHTML = tempData.hospital_name;
                G("doctor-department").innerHTML = tempData.department_name;
                G("order-number").innerHTML = "";
                G("doctor-number").innerHTML = tempData.appointment_id;
                G("order-time").innerHTML = tempData.insert_dt;
                G("order-cost").innerHTML = tempData.pay_value;
                G("user-name").innerHTML = tempData.patient_name;
                G("user-contact").innerHTML = tempData.phone_num;

                var timeWithYear = new Date(this.getStandardDt(tempData.begin_dt)).format("yyyy");
                var tempInquiryTime = "";
                if (timeWithYear == "2099") {
                    tempInquiryTime = "3天内安排就诊";
                } else {
                    tempInquiryTime = new Date(this.getStandardDt(tempData.begin_dt)).format("yyyy-MM-dd hh:mm") + "到" + new Date(this.getStandardDt(tempData.end_dt)).format("hh:mm");
                }
                G("doctor-time").innerHTML = tempInquiryTime;

                this.getQrCode(tempData.appointment_id);

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

                switch (ORDER_STATUS) {
                    case ORDER_STATUS_OVER:
                        G("order-status").innerHTML = "已完成";
                        break;
                    case ORDER_STATUS_INQUIRY:
                        G("order-status").innerHTML = "待就诊";
                        break;
                    case ORDER_STATUS_PAY:
                        G("order-status").innerHTML = "待付款";
                        break;
                    case ORDER_STATUS_CLOSE:
                        G("order-status").innerHTML = "已关闭";
                        break;
                    default:
                        LMEPG.UI.showToast("当前约诊状态异常");
                        break;
                }

            } else if (code == "-102") {
                LMEPG.UI.showToast("拉取数据失败" + code);
            } else {
                LMEPG.UI.showToast("拉取数据失败" + code);
            }
        } catch (e) {
            console.log(e);
        }
    },

    /**
     * 获取二维码
     * @param appointmentID
     */
    getQrCode: function (appointmentID) {
        LMEPG.Inquiry.expertApi.getQrCodeViaAppointmentID(appointmentID, 1, function (data) {
            try {
                var qrCodeJsonObj;
                if (data instanceof Object) {
                    qrCodeJsonObj = data;
                } else {
                    qrCodeJsonObj = JSON.parse(data);
                }
                if (qrCodeJsonObj.code === 0 || qrCodeJsonObj.code === '0') {
                    var qrUrl = RenderParam.CWS_URL_OUT + qrCodeJsonObj.url;
                    G("doctor-code").setAttribute("src", qrUrl);
                } else {
                    LMEPG.UI.showToast("获取二维码失败" + qrCodeJsonObj.code);
                }
            } catch (e) {
                LMEPG.UI.showToast("解析二维码异常" + qrCodeJsonObj.code);
            }
        });
    },

    /**
     * 格式化时间
     * @param dt
     * @returns {Date}
     */
    getStandardDt: function (dt) {
        var time = dt.replace(/-/g, ':').replace(' ', ':');
        time = time.split(':');
        var resultTime = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
        return resultTime;
    },
};
var onBack = function () {
    LMEPG.Intent.back();
};