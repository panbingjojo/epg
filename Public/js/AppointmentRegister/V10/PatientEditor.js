// 滚动列表
var scroll = "scroll";

// 定义全局按钮
var buttons = [];
var imgUrl = g_appRootPath + "/Public/img/hd/Home/V10/";

// 是否儿童
var isChildren = false;
// 是否默认
var isDefault = false;
// 选择的省市区
var sProvince = "";
var sCity = "";
var sArea = "";
// 选择亲情关系数组下标
var sRelationIndex = 0;

// 返回按键
function onBack() {
    Page.onBack();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("patientEditor");
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
    defaultFocusId: "txtName",

    init: function () {
        Home.initButtons();
        Home.initMode(); // 初始化显示模式
        Home.initData(); // 初始化数据
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);
        endData = OptionBox.getCountDays(m);
    },

    initMode: function () {
        // 新增
        if (RenderParam.type == "1") {
            Form.adultMode(); // 成人模式
            Form.status = 0;
        }
        // 编辑
        else {
            if (RenderParam.patient_info.patient_id_no == "") {
                Form.childMode(); // 儿童模式
                Form.status = 1;
                Home.radioBtnEnter(buttons[0]);
            } else {
                Form.adultMode(); // 成人模式
                Form.status = 0;
            }
        }
    },

    initData: function () {
        // 手机挂号二维码
        var postData = {
            "key": "EPG-LWS-AppointmentRegister-" + RenderParam.carrierId + "-" + RenderParam.userId
        };
        LMEPG.ajax.postAPI('Activity/queryStoreData', postData, function (rsp) {
                console.log(rsp);
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                var result = data.result;
                if (result == 0) {
                    G("QRCode").src = data.val;
                }
            },
            function (rsp) {
            }
        );

        if (RenderParam.type == "1") {
            return;
        }
        // 初始化全局变量
        isChildren = RenderParam.patient_info.patient_id_no == "" ? true : false;
        isDefault = RenderParam.patient_info.is_default == "0" ? false : true;
        var PCA = RenderParam.patient_info.province_city_zone.split("_");
        sProvince = PCA[0];
        sCity = PCA[1];
        sArea = PCA[2];
        sRelationIndex = 0;
        for (var i = 0; i < Form.relationData.list.length; i++) {
            if (Form.relationData.list[i].id == parseInt(RenderParam.patient_info.family_rel_id)) {
                sRelationIndex = i;
                break;
            }
        }
        // 初始化页面
        var data = RenderParam.patient_info;
        G("realName").value = data.patient_name;
        G("telPhone").value = isChildren ? data.contacts_phone : data.patient_phone;
        G("idNo").value = isChildren ? data.contacts_id_no : data.patient_id_no;
        G("txtRelation-value").innerHTML = data.family_rel_name;
        G("txtMinZu-value").innerHTML = data.nation;
        G("txtAre-1-value").innerHTML = sProvince;
        G("txtAre-2-value").innerHTML = sCity;
        G("txtAre-3-value").innerHTML = sArea;
        G("txtAge-value").innerHTML = data.birthday;
        G("txtSex-value").innerHTML = data.gender == "0" ? "男" : "女";
        G("relationName").value = data.contacts_name;
        G("Address").value = data.patient_addr;
        if (!isDefault)
            Home.radioBtnEnter(buttons[13]);
    },

    initButtons: function () {
        buttons.push({
            id: 'radio-1',
            name: '儿童选项',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'txtName',
            backgroundImage: imgUrl + "radio_btn_bg.png",
            focusImage: imgUrl + "radio_btn_f.png",
            cBackgroundImage: imgUrl + "radio_btn_bg.png",
            cFocusImage: imgUrl + "radio_btn_f.png",
            fBackgroundImage: imgUrl + "select_radio_btn_bg.png",
            fFocusImage: imgUrl + "select_radio_btn_f.png",
            click: Home.radioBtnEnter,
            focusChange: "",
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "un-select",
        });


        buttons.push({
            id: 'txtName',
            name: '儿童姓名',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'radio-1',
            nextFocusDown: 'txtAge',
            backgroundImage: "",
            focusImage: "",
            click: "",
            focusChange: Home.inputFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'txtAge',
            name: '儿童年龄',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtName',
            nextFocusDown: 'txtSex',
            backgroundImage: "",
            focusImage: "",
            click: Home.optionSelect,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'txtSex',
            name: '儿童性别',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtAge',
            nextFocusDown: 'txtNameS',
            backgroundImage: "",
            focusImage: "",
            click: Home.optionSelect,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'txtNameS',
            name: '家长姓名',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtSex',
            nextFocusDown: 'txtPhone',
            backgroundImage: "",
            focusImage: "",
            click: "",
            focusChange: Home.inputFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'txtPhone',
            name: '儿童电话',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtNameS',
            nextFocusDown: 'txtIdCard',
            backgroundImage: "",
            focusImage: "",
            click: "",
            focusChange: Home.inputFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });


        buttons.push({
            id: 'txtIdCard',
            name: '身份证',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtPhone',
            nextFocusDown: 'txtRelation',
            backgroundImage: "",
            focusImage: "",
            click: Form.scrollIntoView,
            focusChange: Home.inputFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
            htmlId: "idNo",
        });


        buttons.push({
            id: 'txtRelation',
            name: '关系',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtIdCard',
            nextFocusDown: 'txtMinZu',
            backgroundImage: "",
            focusImage: "",
            click: Home.optionSelect,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });


        buttons.push({
            id: 'txtMinZu',
            name: '民族',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtRelation',
            nextFocusDown: 'txtAre-1',
            backgroundImage: "",
            focusImage: "",
            click: Home.optionSelect,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'txtAre-1',
            name: '区域-省',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtMinZu',
            nextFocusDown: 'txtAre-2',
            backgroundImage: "",
            focusImage: "",
            click: Home.optionSelect,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'txtAre-2',
            name: '区域-市',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtAre-1',
            nextFocusDown: 'txtAre-3',
            backgroundImage: "",
            focusImage: "",
            click: Home.optionSelect,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'txtAre-3',
            name: '区域-区',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtAre-2',
            nextFocusDown: 'txtAddress',
            backgroundImage: "",
            focusImage: "",
            click: Home.optionSelect,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'txtAddress',
            name: '地址',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtAre-3',
            nextFocusDown: 'radio-2',
            backgroundImage: "",
            focusImage: "",
            click: Form.scrollIntoView,
            focusChange: Home.inputFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
            htmlId: "Address",
        });

        buttons.push({
            id: 'radio-2',
            name: '默认',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'txtAddress',
            nextFocusDown: 'save',
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
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "un-select",
        });

        buttons.push({
            id: 'save',
            name: '保存',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'back',
            nextFocusUp: 'radio-2',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Form.submit,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'back',
            name: '取消',
            type: 'img',
            nextFocusLeft: 'save',
            nextFocusRight: 'delete',
            nextFocusUp: 'radio-2',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Form.submit,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

        buttons.push({
            id: 'delete',
            name: '删除',
            type: 'img',
            nextFocusLeft: 'back',
            nextFocusRight: '',
            nextFocusUp: 'radio-2',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: Form.submit,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onScrollBeforeMoveChange,
            cType: "region",
        });

    },
    optionSelect: function (btn) {
        if (btn.id == "txtSex") {
            OptionBox.initOption(Form.sexData, btn.id, "scroll");
        } else if (btn.id == "txtRelation") {
            OptionBox.initOption(Form.relationData.list, btn.id, "scroll");
        } else if (btn.id == "txtMinZu") {
            OptionBox.initOption(Form.selNation.list, btn.id, "scroll");
        } else if (btn.id == "txtAge") {
            OptionBox.initOptionData(Form.selNation.list, btn.id, "scroll");
        }
        // 选择省
        else if (btn.id == "txtAre-1") {
            Home.getArea(btn.id, '', '');
        }
        // 选择市
        else if (btn.id == "txtAre-2") {
            Home.getArea(btn.id, sProvince, '');
        }
        // 选择区
        else if (btn.id == "txtAre-3") {
            Home.getArea(btn.id, sProvince, sCity);
        }
    },
    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            if (btn.id == "txtAge") {
                Form.formValidation(btn.id);
            }
        }
    },

    inputFocus: function (btn, hasFocus) {
        var idDom = G(btn.id).getElementsByTagName("input")[0]
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
            idDom.disabled = false;
            setTimeout(function () {
                LMEPG.UI.Style.input_moveCursorTo(idDom, idDom.value.length)
            });
            // G(btn.id).focus();
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            idDom.disabled = true;
            idDom.blur();
            Form.formValidation(btn.id);
        }
    },

    // 点击选中事件
    radioBtnEnter: function (btn) {
        // 取消选中
        if (btn.cType == "select") {
            btn.backgroundImage = btn.cBackgroundImage;
            btn.focusImage = btn.cFocusImage;
            btn.cType = "un-select";
            G(btn.id).src = btn.cFocusImage;

            // 儿童radio
            if (btn.id == "radio-1") {
                isChildren = false;
                Form.adultMode();
                Form.status = 0;
            }
            // 默认radio
            if (btn.id == "radio-2") {
                isDefault = false;
            }
        }
        // 选中
        else if (btn.cType == "un-select") {
            btn.backgroundImage = btn.fBackgroundImage;
            btn.focusImage = btn.fFocusImage;
            btn.cType = "select";
            G(btn.id).src = btn.fFocusImage;

            // 儿童radio
            if (btn.id == "radio-1") {
                isChildren = true;
                Form.childMode();
                Form.status = 1;
            }
            // 默认radio
            if (btn.id == "radio-2") {
                isDefault = true;
            }
        }

    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                if (current.id.substr(0, 7) != "option-") // 选择生日的弹窗，阻止滚动
                    ScrollControl.showScrollTop(current.id, "up");

                if (current.id == "txtPhone") {
                    if (Form.status == 0) {
                        LMEPG.BM.requestFocus("txtName");
                        return false;
                    } else if (Form.status == 1) {
                        // LMEPG.BM.requestFocus("txtSex");
                        LMEPG.BM.requestFocus("txtNameS");
                        return false;
                    }
                } else if (current.id == "option-3") {
                    OptionBox.upTime(1, 6, "", current.id);
                } else if (current.id == "option-8") {
                    OptionBox.upTime(6, 11, 1, current.id);
                } else if (current.id == "option-13") {
                    // alert(endData);
                    OptionBox.upTime(11, 16, 1, current.id);
                }
                break;
            case 'down':
                if (current.id.substr(0, 7) != "option-") // 选择生日的弹窗，阻止滚动
                    ScrollControl.showScrollTop(current.id, "down");

                if (current.id == "txtName") {
                    if (Form.status == 0) {
                        LMEPG.BM.requestFocus("txtPhone");
                        return false;
                    } else if (Form.status == 1) {
                        LMEPG.BM.requestFocus("txtAge");
                        return false;
                    }
                } else if (current.id == "option-3") {
                    OptionBox.downTime(1, 6, "", current.id);
                } else if (current.id == "option-8") {
                    OptionBox.downTime(6, 11, 12, current.id);
                } else if (current.id == "option-13") {
                    // alert(endData);
                    OptionBox.downTime(11, 16, endData, current.id);
                }
                break;
        }
    },

    // 滚动控制
    onScrollBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                ScrollControl.showScrollTop(current.id, "up");

                // 这几个地方，没有二三级，焦点控制单独处理
                if (current.id == "txtAddress") {
                    if (sProvince == "台湾省" || sProvince == "香港特别行政区" || sProvince == "澳门特别行政区") {
                        LMEPG.BM.requestFocus("txtAre-1");
                        return false;
                    }
                }
                break;
            case 'down':
                ScrollControl.showScrollTop(current.id, "down");

                // 这几个地方，没有二三级，焦点控制单独处理
                if (current.id == "txtAre-1") {
                    if (sProvince == "台湾省" || sProvince == "香港特别行政区" || sProvince == "澳门特别行政区") {
                        LMEPG.BM.requestFocus("txtAddress");
                        return false;
                    }
                }
                break;
        }
    },

    // 获取省市区
    getArea: function (id, pro_name, city_name) {
        if (id == "txtAre-2") {
            if (pro_name == "") {
                LMEPG.UI.showToast("请先选择省");
                return;
            }
        } else if (id == "txtAre-3") {
            if (pro_name == "") {
                LMEPG.UI.showToast("请先选择省");
                return;
            }
            if (city_name == "") {
                LMEPG.UI.showToast("请先选择市");
                return;
            }
        }
        var postData = {
            "pro_name": pro_name,
            "city_name": city_name,
        };
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("GuaHao/getArea", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            var data = JSON.parse(data);
            console.log(data);
            if (data.code != 0) {
                LMEPG.UI.showToast("数据加载失败");
                return;
            }
            // 格式化数据
            var list = [];
            for (var i = 0; i < data.list.length; i++) {
                var item = {};
                item.name = data.list[i];
                list.push(item);
            }
            OptionBox.initOption(list, id, "scroll");
        });
    }
}

var Form = {
    status: 0,//模式
    sexData: [{"name": "男"}, {"name": "女"}],
    relationData: {
        "list": [
            {id: 1, name: '本人'},
            {id: 2, name: '丈夫'},
            {id: 3, name: '妻子'},
            {id: 4, name: '儿子'},
            {id: 5, name: '孙子'},
            {id: 6, name: '孙女'},
            {id: 7, name: '父亲'},
            {id: 8, name: '母亲'},
            {id: 9, name: '公公'},
            {id: 10, name: '婆婆'},
            {id: 11, name: '岳父'},
            {id: 12, name: '祖母'},
            {id: 13, name: '外祖父'},
            {id: 14, name: '外祖母'},
            {id: 15, name: '哥哥'},
            {id: 16, name: '弟弟'},
            {id: 17, name: '姐姐'},
            {id: 18, name: '妹妹'},
            {id: 19, name: '其他亲属'},
            {id: 20, name: '非亲属'},
            {id: 21, name: '女儿'},
            {id: 22, name: '祖父'},
            {id: 24, name: '岳母'},
        ]
    },

    selNation: {
        "list": [
            {"name": "汉族"},
            {"name": "蒙古族"},
            {"name": "回族"},
            {"name": "藏族"},
            {"name": "维吾尔族"},
            {"name": "苗族"},
            {"name": "彝族"},
            {"name": "壮族"},
            {"name": "布依族"},
            {"name": "朝鲜族"},
            {"name": "满族"},
            {"name": "侗族"},
            {"name": "瑶族"},
            {"name": "白族"},
            {"name": "土家族"},
            {"name": "哈尼族"},
            {"name": "哈萨克族"},
            {"name": "傣族"},
            {"name": "黎族"},
            {"name": "傈僳族"},
            {"name": "佤族"},
            {"name": "畲族"},
            {"name": "高山族"},
            {"name": "拉祜族"},
            {"name": "水族"},
            {"name": "东乡族"},
            {"name": "纳西族"},
            {"name": "景颇族"},
            {"name": "柯尔克孜族"},
            {"name": "土族"},
            {"name": "达斡尔族"},
            {"name": "仫佬族"},
            {"name": "羌族"},
            {"name": "布朗族"},
            {"name": "撒拉族"},
            {"name": "毛南族"},
            {"name": "仡佬族"},
            {"name": "锡伯族"},
            {"name": "阿昌族"},
            {"name": "普米族"},
            {"name": "塔吉克族"},
            {"name": "怒族"},
            {"name": "乌孜别克族"},
            {"name": "俄罗斯族"},
            {"name": "鄂温克族"},
            {"name": "德昂族"},
            {"name": "保安族"},
            {"name": "裕固族"},
            {"name": "京族"},
            {"name": "塔塔尔族"},
            {"name": "独龙族"},
            {"name": "鄂伦春族"},
            {"name": "赫哲族"},
            {"name": "门巴族"},
            {"name": "珞巴族"},
            {"name": "基诺族"}]
    },


    childMode: function () {
        Show("child-1");
        Show("child-2");
        Show("child-3");
        G("name").innerHTML = "儿童姓名:";
        G("phone").innerHTML = "联系人手机号码:";
        G("card").innerHTML = "联系人身份证号:";
        LMEPG.CssManager.removeClass("txtPhone", "text1");
        LMEPG.CssManager.addClass("txtPhone", "text3");
        LMEPG.CssManager.removeClass("txtIdCard", "text1");
        LMEPG.CssManager.addClass("txtIdCard", "text3");
    },

    adultMode: function () {
        Hide("child-1");
        Hide("child-2");
        Hide("child-3");
        G("name").innerHTML = "姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:";
        G("phone").innerHTML = "手机号码:";
        G("card").innerHTML = "身份证号:";
        LMEPG.CssManager.removeClass("txtPhone", "text3");
        LMEPG.CssManager.addClass("txtPhone", "text1");
        LMEPG.CssManager.removeClass("txtIdCard", "text3");
        LMEPG.CssManager.addClass("txtIdCard", "text1");
    },

    // 解决输入框被键盘挡住
    scrollIntoView: function (btn) {
        if (btn.htmlId == "idNo")
            G("idNo").scrollIntoView();
        if (btn.htmlId == "Address")
            G("Address").scrollIntoView();
    },


    // 表单实时验证
    formValidation: function (id) {
        //真实姓名验证
        var name = G("realName").value;
        var relationName = G("relationName").value;
        var userTel = G("telPhone").value;
        var idNo = G("idNo").value;
        var address = (G("Address").value).trim();
        var regName = /^[\u4e00-\u9fa5]{2,4}$/;
        var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;


        if (id == "txtName") {
            if (!regName.test(name)) {
                G("txtName").getElementsByTagName("span")[0].style.visibility = "visible";
                return;
            } else {
                G("txtName").getElementsByTagName("span")[0].style.visibility = "hidden";
                return;
            }
        } else if (id == "txtPhone") {
            //判断手机号是否正确
            if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                G("txtPhone").getElementsByTagName("span")[0].style.visibility = "visible";
                return;
            } else {
                G("txtPhone").getElementsByTagName("span")[0].style.visibility = "hidden";
                return;
            }
        } else if (id == "txtIdCard") {
            //身份证号验证验证
            if (!regIdNo.test(idNo)) {
                G("txtIdCard").getElementsByTagName("span")[0].style.visibility = "visible";
                return;
            } else {
                G("txtIdCard").getElementsByTagName("span")[0].style.visibility = "hidden";
                return;
            }
        } else if (id == "txtNameS") {
            if (!regName.test(relationName)) {
                G("txtNameS").getElementsByTagName("span")[0].style.visibility = "visible";
                return;
            } else {
                G("txtNameS").getElementsByTagName("span")[0].style.visibility = "hidden";
                return;
            }
        } else if (id == "txtAge") {
            if (G("txtAge-value").innerHTML == "年\月\日") {
                G("txtAge").getElementsByTagName("span")[0].style.visibility = "visible";
                return;
            }
        } else if (id == "txtAddress") {
            if (address == null || address == "") {
                G("txtAddress").getElementsByTagName("span")[0].style.visibility = "visible";
                return;
            } else {
                G("txtAddress").getElementsByTagName("span")[0].style.visibility = "hidden";
                return;
            }
        }


    },

    submit: function (btn) {
        // 判断进入类型，是新增还是编辑按钮进入
        var type = -1; // 1-新增 2-编辑 3-删除 -1（默认值，代表从新增进入的“取消”和“删除”，从编辑进入的“取消”
        if (RenderParam.type == "1") {
            if (btn.id == "save")
                type = 1;
        } else {
            if (btn.id == "save")
                type = 2;
            else if (btn.id == "delete")
                type = 3;
        }
        if (type == -1) { // 返回上一个页面
            var objSrc = Page.getCurrentPage();
            objSrc = null;
            var objDst = LMEPG.Intent.createIntent("patientSelection");
            objDst.setParam("user_id", RenderParam.user_id);
            objDst.setParam("expert_key", RenderParam.expert_key);
            objDst.setParam("num", RenderParam.num);
            objDst.setParam("is_online", RenderParam.is_online);
            LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
            return;
        }

        //真实姓名验证
        var name = G("realName").value;
        var relationName = G("relationName").value;
        var userTel = G("telPhone").value;
        var idNo = G("idNo").value;
        var address = G("Address").value;
        var regName = /^[\u4e00-\u9fa5]{2,4}$/;

        if (!regName.test(name)) {
            LMEPG.UI.showToast("真实姓名填写有误！", 3);
            G("txtName").getElementsByTagName("span")[0].style.visibility = "visible";
            return;
        }

        if (isChildren) {
            if (!regName.test(relationName)) {
                LMEPG.UI.showToast("联系人填写有误！", 3);
                return;
            }

            if (G("txtAge-value").innerHTML == "年\月\日") {
                LMEPG.UI.showToast("日期格式有误！", 3);
                // G("txtAge").getElementsByTagName("span")[0].style.visibility = "visible";
                return;
            }
        }


        //判断手机号是否正确
        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast("请填写正确的手机号！", 3);
            return;
        }
        //身份证号验证验证
        var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!regIdNo.test(idNo)) {
            LMEPG.UI.showToast("身份证填写有误！", 3);
            return;
        }
        // 地址不能为空
        if (address == "") {
            if (type != 3) {
                LMEPG.UI.showToast("地址不能为空！", 3);
                return;
            }
        }
        // 省市区不能为空
        var province_city_zone = sProvince + "_" + sCity + "_" + sArea;
        if (sProvince == "" || sCity == "" || sArea == "") {
            // 这几个地方，没有二三级
            if (sProvince == "台湾省" || sProvince == "香港特别行政区" || sProvince == "澳门特别行政区") {
                province_city_zone = sProvince;
            } else {
                LMEPG.UI.showToast("省市区不能为空！", 3);
                return;
            }
        }

        // 非儿童挂号，通过身份证倒数第二位判断，奇数-男，偶数-女
        // 儿童挂号，直接选择
        var gender = G("txtSex-value").innerHTML == "男" ? 0 : 1;
        if (!isChildren) {
            var revertSecondNum = parseInt(idNo.charAt(16));
            if (revertSecondNum % 2 == 0)
                gender = 1;
            else
                gender = 0;
        }

        // 发送请求
        var postData = {
            "type": type,
            "patient_name": name,
            "patient_id_no": isChildren ? "" : idNo,
            "patient_addr": address,
            "patient_phone": isChildren ? "" : userTel,
            "is_default": isDefault ? 1 : 0,
            "record_id": type != 1 ? RenderParam.patient_info.id + "" : "",
            "province_city_zone": province_city_zone,
            "nation": G("txtMinZu-value").innerHTML,
            "family_rel_id": Form.relationData.list[sRelationIndex].id + "",
            "patient_sex": gender,
            "patient_birthday": isChildren ? G("txtAge-value").innerHTML : idNo.substring(6, 10) + "-" + idNo.substring(10, 12) + "-" + idNo.substring(12, 14),
            "patient_avatar": "",
            "contacts_name": isChildren ? relationName : "",
            "contacts_id_no": isChildren ? idNo : "",
            "contacts_phone": isChildren ? userTel : "",
        };
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("GuaHao/postOperatePatient", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            var data = JSON.parse(data);
            console.log(data);
            if (data.code != 0) {
                if (type == 3)
                    LMEPG.UI.showToast("删除失败，" + data.message);
                else
                    LMEPG.UI.showToast("保存失败，" + data.message);
                return;
            }
            var objSrc = Page.getCurrentPage();
            objSrc = null;
            var objDst = LMEPG.Intent.createIntent("patientSelection");
            objDst.setParam("user_id", RenderParam.user_id);
            objDst.setParam("expert_key", RenderParam.expert_key);
            objDst.setParam("num", RenderParam.num);
            objDst.setParam("is_online", RenderParam.is_online);
            LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
        });
    },
};

var ScrollControl = {
    showScrollTop: function (id, dir) {
        LMEPG.UI.scrollVertically(id, scroll,dir, -1);
    },
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
