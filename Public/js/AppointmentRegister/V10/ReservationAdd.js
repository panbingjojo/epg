// 定义全局按钮
var buttons = [];
var imgUrl = g_appRootPath + "/Public/img/hd/Home/V10/";

// 滚动div id
var scroll = "scroll";

// 协议按钮是否选择
var isSelectRule = true;
// 病历本是否选择
var isSelectMedicalBook = false;

// 返回按键
function onBack() {
    Page.onBack();
}

// 就诊卡输入框监听，填写了就诊卡号，就不算就诊卡的费用
function onInputChange(e) {
    var cardId = G("cardId").value.trim();
    if (cardId == "") {
        G("cost-4").innerHTML = RenderParam.input_info.num.medical_card_price;
    } else {
        G("cost-4").innerHTML = "0";
    }
    Home.calculateFee();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("reservationAdd");
        currentPage.setParam("user_id", RenderParam.user_id);
        currentPage.setParam("expert_key", RenderParam.expert_key);
        currentPage.setParam("num", RenderParam.num);
        currentPage.setParam("is_online", RenderParam.is_online);
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },

    /**
     * 返回事件
     */
    onBack: function () {
        LMEPG.Intent.back();
    }
};

var Home = {
    defaultFocusId: "add-man",
    //页面初始化操作
    init: function () {
        Home.initData(RenderParam.input_info); // 初始化数据
        Home.initCheckItemButtons(RenderParam.input_info.check_item); // 初始化检查项目焦点按钮
        Home.initButtons();                 // 初始化焦点按钮
        Home.calculateFee();
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);

        // 让就诊卡输入框默认失去焦点，并且失效
        G("cardId").blur();
        G("cardId").disabled = true;

        // 如果从规则返回，滚动到底部
        if (lastFocusId == "rule") {
            G("default").style.top = "-320px";
        }
    },

    // 初始化数据
    initData: function (data) {
        if (data.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }
        var shift_limit = data.expert.department.shift_limit;
        if (shift_limit == 0 || shift_limit == 2 || shift_limit == 3) {
            // 从二维码跳入
            if (RenderParam.from_qrcode_page == 1)
                LMEPG.UI.showToast("该科室不支持无身份证号儿童挂号", 1.5);
        }
        var scheduling = '';
        if (data.num.scheduling != null) {
            switch (data.num.scheduling) {
                case 1:
                    scheduling = '上午';
                    break;
                case 2:
                    scheduling = '下午';
                    break;
                case 3:
                    scheduling = '夜间';
                    break;
                case 4:
                    scheduling = '全天';
                    break;
            }
        }
        G("hospital").innerHTML = data.expert.hospital.hosl_name;
        G("address").innerHTML = data.expert.hospital.address;
        G("subject").innerHTML = data.expert.expert.hdeptName;
        G("name").innerHTML = data.expert.expert.name;
        G("type").innerHTML = data.expert.expert.jobTitle;
        G("time").innerHTML = data.num.date + ' ' + data.num.week + '' + scheduling + ' ' + (data.num.start_dt == undefined ? '' : data.num.start_dt) + ' ';
        G("number").innerHTML = data.num.order == undefined ? '' : data.num.order + "号";
        G("medical_book_price").innerHTML = data.num.medical_book_price;
        G("cost-1").innerHTML = data.num.price;
        G("cost-2").innerHTML = data.num.medical_book_price;
        G("cost-3").innerHTML = "0";
        G("cost-4").innerHTML = data.num.medical_card_price;
    },

    // 初始化检查项目焦点按钮
    initCheckItemButtons: function (data) {
        if (data.code != 0 || data.list == null) {
            return;
        }
        var list = data.list;
        var checkTotalFee = 0;
        for (var i = 1; i <= list.length; i++) {
            var sHtml = "";
            sHtml += "<tr>";
            sHtml += "<td>检查项目>" + list[i - 1].checkName + "</td>";
            sHtml += "<td><img id=\"radio-2-" + i + "\" class=\"radio\" src=\"" + g_appRootPath + "/Public/img/hd/Home/V10/select_radio_btn_bg.png\"/>";
            sHtml += "</td>";
            sHtml += "</tr>";

            G("table").innerHTML += sHtml;

            buttons.push({
                id: 'radio-2-' + i,
                name: '检查项目',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: (i - 1) < 1 ? 'radio-1' : 'radio-2-' + (i - 1),
                nextFocusDown: (i + 1) > list.length ? 'weChat-btn' : 'radio-2-' + (i + 1),
                backgroundImage: imgUrl + "select_radio_btn_bg.png",
                focusImage: imgUrl + "select_radio_btn_f.png",
                cBackgroundImage: imgUrl + "radio_btn_bg.png",
                cFocusImage: imgUrl + "radio_btn_f.png",
                fBackgroundImage: imgUrl + "select_radio_btn_bg.png",
                fFocusImage: imgUrl + "select_radio_btn_f.png",
                click: Home.radioBtnEnter,
                focusChange: "",
                beforeMoveChange: ScrollControl.onScrollBeforeMoveChange,
                cType: "select",
                pos: i - 1,
            });

            // 初始化时，计算检查费用
            checkTotalFee += parseFloat(list[i - 1].cost);
        }
        G("cost-3").innerHTML = "" + checkTotalFee;
    },

    initButtons: function () {
        var info = RenderParam.patient_info;
        if (info != null && info != undefined) {
            G("add-man").innerHTML = "<ul><li>" + info.patient_name + "</li><li >" + (info.gender == "0" ? "男" : "女") +
                "</li><li >" + info.age + "岁</li><li >" + (info.patient_phone == "" ? info.contacts_phone : info.patient_phone) +
                "</li><li class=\"blue fived\">切换就诊人></li></ul>";
        }

        buttons.push({
            id: 'add-man',
            name: '添加就诊人',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'cardId',
            backgroundImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/bg_btn_long_2.png",
            focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_btn_long_2.png",
            click: Home.goPatientSelection,
            focusChange: Home.departFocus,
            beforeMoveChange: ScrollControl.onScrollBeforeMoveChange,
            cType: "region",
        });
        buttons.push({
            id: 'cardId',
            name: '就诊卡填写',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'add-man',
            nextFocusDown: 'radio-1',
            backgroundImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/bg_btn_long_3.png",
            focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_btn_long_3.png",
            click: 'LMEPG.UI.keyboard.show(220, 330, "cardId", "cardId")',
            focusChange: "",
            beforeMoveChange: ScrollControl.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'radio-1',
            name: '购买病历本',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'cardId',
            nextFocusDown: (RenderParam.input_info.check_item.code == 0 && RenderParam.input_info.check_item.list.length > 0) ?
                'radio-2-1' : 'weChat-btn',
            // backgroundImage: imgUrl + "select_radio_btn_bg.png",
            // focusImage: imgUrl + "select_radio_btn_f.png",
            backgroundImage: imgUrl + "radio_btn_bg.png",
            focusImage: imgUrl + "radio_btn_f.png",
            cBackgroundImage: imgUrl + "radio_btn_bg.png",
            cFocusImage: imgUrl + "radio_btn_f.png",
            fBackgroundImage: imgUrl + "select_radio_btn_bg.png",
            fFocusImage: imgUrl + "select_radio_btn_f.png",
            click: Home.radioBtnEnter,
            focusChange: "",
            beforeMoveChange: ScrollControl.onScrollBeforeMoveChange,
            cType: "un-select",
        });

        buttons.push({
            id: 'weChat-btn',
            name: '微信支付',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'spot-btn',
            nextFocusUp: (RenderParam.input_info.check_item.code == 0 && RenderParam.input_info.check_item.list.length > 0) ?
                'radio-2-' + RenderParam.input_info.check_item.list.length : 'radio-1',
            nextFocusDown: 'radio-3',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: Home.doOrder,
            focusChange: Home.departFocus,
            beforeMoveChange: ScrollControl.onScrollBeforeMoveChange,
            cType: "region",
            pay_way: 1,
        });

        buttons.push({
            id: 'spot-btn',
            name: '到医院支付',
            type: 'div',
            nextFocusLeft: 'weChat-btn',
            nextFocusRight: '',
            nextFocusUp: (RenderParam.input_info.check_item.code == 0 && RenderParam.input_info.check_item.list.length > 0) ?
                'radio-2-' + RenderParam.input_info.check_item.list.length : 'radio-1',
            nextFocusDown: 'radio-3',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: Home.doOrder,
            focusChange: Home.departFocus,
            beforeMoveChange: ScrollControl.onScrollBeforeMoveChange,
            cType: "region",
            pay_way: 2,
        });

        buttons.push({
            id: 'radio-3',
            name: '协议radio',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'rule',
            nextFocusUp: 'weChat-btn',
            nextFocusDown: '',
            backgroundImage: imgUrl + "select_radio_btn_s_bg.png",
            focusImage: imgUrl + "select_radio_btn_s_f.png",
            cBackgroundImage: imgUrl + "radio_btn_s_bg.png",
            cFocusImage: imgUrl + "radio_btn_s_f.png",
            fBackgroundImage: imgUrl + "select_radio_btn_s_bg.png",
            fFocusImage: imgUrl + "select_radio_btn_s_f.png",
            click: Home.radioBtnEnter,
            focusChange: "",
            beforeMoveChange: "",
            cType: "select",
        });

        buttons.push({
            id: 'rule',
            name: '协议btn',
            type: 'img',
            nextFocusLeft: 'radio-3',
            nextFocusRight: '',
            nextFocusUp: 'weChat-btn',
            nextFocusDown: '',
            click: Home.goRule,
            focusChange: Home.ruleFocus,
            beforeMoveChange: "",
        });
    },
    // 点击选中事件
    radioBtnEnter: function (btn) {
        // 取消选中
        if (btn.cType == "select") {
            btn.backgroundImage = btn.cBackgroundImage;
            btn.focusImage = btn.cFocusImage;
            btn.cType = "un-select";
            G(btn.id).src = btn.cFocusImage;

            // 病历本
            if (btn.id == 'radio-1') {
                G("cost-2").innerHTML = "0";
                Home.calculateFee();
                isSelectMedicalBook = false;
            }
            // 检查项目
            else if (btn.id.substring(0, 8) == 'radio-2-') {
                var checkTotalFee = parseFloat(G("cost-3").innerHTML);
                checkTotalFee -= parseFloat(RenderParam.input_info.check_item.list[btn.pos].cost);
                G("cost-3").innerHTML = "" + checkTotalFee;
                Home.calculateFee();
                // 增加字段，标识是否选中
                RenderParam.input_info.check_item.list[btn.pos].selected = false;
            }
            // 协议
            else if (btn.id == 'radio-3') {
                isSelectRule = false;
            }
        }
        // 选中
        else if (btn.cType == "un-select") {
            btn.backgroundImage = btn.fBackgroundImage;
            btn.focusImage = btn.fFocusImage;
            btn.cType = "select";
            G(btn.id).src = btn.fFocusImage;

            // 病历本
            if (btn.id == 'radio-1') {
                G("cost-2").innerHTML = RenderParam.input_info.num.medical_book_price;
                Home.calculateFee();
                isSelectMedicalBook = true;
            }
            // 检查项目
            else if (btn.id.substring(0, 8) == 'radio-2-') {
                var checkTotalFee = parseFloat(G("cost-3").innerHTML);
                checkTotalFee += parseFloat(RenderParam.input_info.check_item.list[btn.pos].cost);
                G("cost-3").innerHTML = "" + checkTotalFee;
                Home.calculateFee();
                // 增加字段，标识是否选中
                RenderParam.input_info.check_item.list[btn.pos].selected = true;
            }
            // 协议
            else if (btn.id == 'radio-3') {
                isSelectRule = true;
            }
        }

    },
    ruleFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "under-line");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "under-line");
        }
    },

    textFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).disabled = false;
            setTimeout(function () {
                LMEPG.UI.Style.input_moveCursorTo(G(btn.id), G(btn.id).value.length)
            });
            // G(btn.id).focus();
        } else {
            G(btn.id).disabled = true;
            G(btn.id).blur();
        }
    },
    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },
    // 合计费用
    calculateFee: function () {
        G("cost-total").innerHTML = "" + (parseFloat(G("cost-1").innerHTML) + parseFloat(G("cost-2").innerHTML) + parseFloat(G("cost-3").innerHTML) + parseFloat(G("cost-4").innerHTML));
    },

    // 跳转协议页面
    goRule: function () {
        var objSrc = Page.getCurrentPage();
        objSrc.setParam("scrollTop", G(scroll).scrollTop);
        var objDst = LMEPG.Intent.createIntent("reservationRule");
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 支付 1-微信支付 2-线下支付
    doOrder: function (btn) {
        // 判断是否支持WX支付、线下支付或都支持
        var isSupportWXPay = true;
        var isSupportOfflinePay = true;
        if (parseInt(RenderParam.is_online) == 0) {
            isSupportWXPay = false;
            isSupportOfflinePay = true;
        } else {
            var payType = parseInt(RenderParam.input_info.num.payType);
            switch (payType) {
                case 0:
                    isSupportWXPay = true;
                    isSupportOfflinePay = true;
                    break;
                case 1:
                    isSupportWXPay = true;
                    isSupportOfflinePay = false;
                    break;
                case 2:
                    isSupportWXPay = false;
                    isSupportOfflinePay = true;
                    break;
            }
        }
        if (btn.pay_way == 1 && isSupportWXPay == false) {
            LMEPG.UI.showToast("不支持微信支付");
            return;
        }
        if (btn.pay_way == 2 && isSupportOfflinePay == false) {
            LMEPG.UI.showToast("不支持到医院支付");
            return;
        }

        if (!isSelectRule) {
            LMEPG.UI.showToast("您还没有阅读《预约挂号规则》并同意相关规定");
            return;
        }
        var patient_info = RenderParam.patient_info;
        if (patient_info == null || patient_info == undefined) {
            LMEPG.UI.showToast("请选择就诊人");
            return;
        }
        // 发送请求
        var postData = {};
        var is_online = RenderParam.is_online;
        var shift_limit = RenderParam.input_info.expert.department.shift_limit;
        var isChildren = patient_info.patient_id_no == "" ? true : false;
        var user_id = RenderParam.input_info.user_id;
        var num_item = RenderParam.input_info.num;
        var expert_detail = RenderParam.input_info.expert;
        var pay_way = btn.pay_way;
        var medical_card_number = G("cardId").innerHTML;
        if (medical_card_number == "请输入就诊卡号")
            medical_card_number = "";
        var check_item = RenderParam.input_info.check_item.list;
        var check_item_arr = [];
        if (check_item != null && check_item != undefined) {
            for (var i = 0; i < check_item.length; i++) {
                if (check_item[i].selected != false) {
                    var tmp = {};
                    tmp.dept_id = check_item[i].deptId;
                    tmp.check_name = check_item[i].checkName;
                    tmp.impl_dept_id = check_item[i].implDeptId;
                    tmp.check_id = check_item[i].checkId;
                    tmp.cost = check_item[i].cost;
                    check_item_arr.push(tmp);
                }
            }
        }
        var check_item_arr_json = JSON.stringify(check_item_arr);

        // shift_limit 预约限制；0-默认（有身份证挂号），1-仅支持儿童预约，2-仅支持男性预约，3-仅支持女性预约，4-可儿童预约
        // is_online 号源类型 0-未开通导诊，1-开通了导诊且开通了排队，2-开通了导诊且未开通排队（现在只有1和2）
        if (is_online != 0) {
            // 儿童预约
            // if (shift_limit == 1 || (shift_limit == 4 && isChildren)) {
            if (isChildren) {
                postData = {
                    user_id: user_id,
                    osid: num_item.osid != null ? num_item.osid : '',
                    hospital_id: expert_detail.hospital.hosl_id,
                    pro_code: num_item.pro_code,
                    pay_type: pay_way,
                    card_type: medical_card_number != "" ? 2 : 0,
                    card_number: medical_card_number != "" ? medical_card_number : '',
                    reg_info: '{"docId": "' + num_item.doc_id + '","docName": "' + num_item.doc_name + '","regDate": "' + num_item.date + '","regTime": "'
                        + num_item.start_dt + '","orderId": "' + num_item.order + '","scheduling": "' + num_item.scheduling + '"}',
                    children_card_number: '',
                    children_name: patient_info.patient_name,
                    children_birthday: patient_info.birthday,
                    children_gender: patient_info.gender == 0 ? 1 : 2,
                    proxy_name: patient_info.contacts_name,
                    proxy_certificate_type: 1,
                    proxy_certificate_number: patient_info.contacts_id_no,
                    proxy_phone: patient_info.contacts_phone,
                    proxy_address: patient_info.province_city_zone + '_' + patient_info.patient_addr,
                    check_items: check_item_arr.length == 0 ? "" : check_item_arr_json,
                    medical_book_price: isSelectMedicalBook ? num_item.medical_book_price : 0,
                    medical_card_price: medical_card_number == "" ? num_item.medical_card_price : 0,
                    health_card: 0, // 这里还没有选医保卡方式？默认无
                    extend_msg: num_item.extend_msg
                };
                postData.order_type = 3;
            }
            // 成人预约
            else {
                postData = {
                    user_id: user_id,
                    osid: num_item.osid != null ? num_item.osid : '',
                    hospital_id: expert_detail.hospital.hosl_id,
                    patient_id: patient_info.id,
                    pro_code: num_item.pro_code,
                    pay_type: pay_way,
                    card_type: medical_card_number != "" ? 2 : 0,
                    card_number: medical_card_number != "" ? medical_card_number : '',
                    doc_id: num_item.doc_id,
                    doc_name: num_item.doc_name,
                    regist_dt: num_item.date + ',' + num_item.scheduling,
                    check_items: check_item_arr.length == 0 ? "" : check_item_arr_json,
                    medical_book_price: isSelectMedicalBook ? num_item.medical_book_price : 0,
                    medical_card_price: medical_card_number == "" ? num_item.medical_card_price : 0,
                    health_card: 0, // 这里还没有选医保卡方式？默认无
                    extend_msg: num_item.extend_msg
                };
                postData.order_type = 2;
            }
        } else {
            postData = {
                user_id: user_id,
                scid: num_item.scid,
                patient_name: patient_info.patient_name,
                patient_id: patient_info.id,
                certificate_type: 1,
                certificate_number: patient_info.patient_id_no,
                phone: patient_info.patient_phone,
                return_flag: 0,
                disease: '',
                symptom: '',
                gender: patient_info.gender,
                birth_day: patient_info.birthday,
                is_need_pay: 1,     // 是否需要支付；0-是，1-否
                card_type: medical_card_number != "" ? 2 : 0,
                card_number: medical_card_number != "" ? medical_card_number : '',
                address: patient_info.patient_addr
            };
            postData.order_type = 1;
        }
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("GuaHao/postAppointDoOrder", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            var data = JSON.parse(data);
            console.log(data);
            if (data.code != 0) {
                if (data.code == -1 && data.message == "id_card参数不存在！") {
                    LMEPG.UI.showToast("该科室不支持无身份证号儿童挂号");
                } else {
                    LMEPG.UI.showToast("挂号失败，" + data.message);
                }
                return;
            }

            // 挂号成功
            if (is_online == 0) {
                // 跳转挂号详情
                // is_online现在只有1和2，没有0，此情况不考虑
            } else {
                // 到医院支付
                if (pay_way == 2) {
                    // 跳转挂号详情
                    var objSrc = Page.getCurrentPage();
                    var objDst = LMEPG.Intent.createIntent("registrationDetails");
                    objDst.setParam("order_id", data.order.orderId);
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
                }
                // 微信支付
                else {
                    // 跳转支付页面
                    var objSrc = Page.getCurrentPage();
                    var objDst = LMEPG.Intent.createIntent("paymentOrder");
                    objDst.setParam("order_id", data.order.orderId);
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                }
            }
        });
    },

    // 跳转选择就诊人页面
    goPatientSelection: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("patientSelection");
        objDst.setParam("user_id", RenderParam.user_id);
        objDst.setParam("expert_key", RenderParam.expert_key);
        objDst.setParam("num", RenderParam.num);
        objDst.setParam("is_online", RenderParam.is_online);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },
}


var ScrollControl = {
    // 滚动控制
    onScrollBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                ScrollControl.scrollController("default", 80, dir);
                break;
            case 'down':
                ScrollControl.scrollController("default", -80, dir);
                break;
        }
    },

    scrollController: function (id, amount, dir) {
        switch (dir) {
            case 'up':
                if (parseInt(G(id).style.top) <= -80) {
                    G(id).style.top = parseInt(G(id).style.top) + amount + "px";
                }
                break;
            case 'down':
                if (parseInt(G(id).style.top) >= -800) {
                    G(id).style.top = parseInt(G(id).style.top) + amount + "px";
                }
        }
    },
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
