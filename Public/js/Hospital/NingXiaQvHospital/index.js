var Index = {
    init: function () {
        Index.createBtns();
    },

    goBack: function () {
        // LMEPG.Intent.back();
        LMEPG.Intent.back("IPTVPortal");
    },

    createBtns: function () {
        var buttons = [
            {
                id: "btn_index_1",
                name: '焦点1',
                type: 'div',
                nextFocusLeft: "",
                nextFocusRight: "btn_index_2",
                nextFocusDown: "btn_index_3",
                backgroundImage: ROOT+'/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.imagePath + "index_focus_box.png",
                click: Index.onClickListener,
            },
            {
                id: "btn_index_2",
                name: '焦点2',
                type: 'div',
                nextFocusLeft: "btn_index_1",
                nextFocusRight: "btn_index_3",
                nextFocusDown: "btn_index_4",
                backgroundImage: ROOT+'/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.imagePath + "index_focus_box.png",
                click: Index.onClickListener,
            },
            {
                id: "btn_index_3",
                name: '焦点3',
                type: 'div',
                nextFocusLeft: "btn_index_2",
                nextFocusRight: "btn_index_4",
                nextFocusUp: "btn_index_1",
                backgroundImage: ROOT+'/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.imagePath + "index_focus_box.png",
                click: Index.onClickListener,
            },
            {
                id: "btn_index_4",
                name: '焦点4',
                type: 'div',
                nextFocusLeft: "btn_index_3",
                nextFocusRight: "",
                nextFocusUp: "btn_index_2",
                backgroundImage: ROOT+'/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.imagePath + "index_focus_box.png",
                click: Index.onClickListener,
            },
        ];

        var defaultFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? 'btn_index_1' : RenderParam.focusIndex;

        LMEPG.ButtonManager.init(defaultFocusId, buttons, '', true);
    },

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("hospital-index");
        currentPage.setParam("hospitalName", RenderParam.hospitalName);
        return currentPage;
    },

    /**
     * 处理点击事件
     * @param btn
     */
    onClickListener:function (btn) {
        switch (btn.id) {
            case "btn_index_1": // 医院简介
                Index.jumpHospitalBrief(btn.id);
                break;
            case "btn_index_2": // 医生简介
                Index.jumpDoctorBrief(btn.id);
                break;
           /* case "btn_index_2": // 在线问诊
                Index.jumpInquiry(btn.id);
                break;*/
            case "btn_index_3": // 疾控防控
                Index.jumpHealthEducation(btn.id,"GraphicAlbum_29");
                break;
            case "btn_index_4": // 教育健康
                Index.jumpHealthEducation(btn.id,"GraphicAlbum_28");
                break;
            default:
                LMEPG.Log.error("no support: " + btn.id);
        }
    },

    // 跳转到 医院简介
    jumpHospitalBrief: function (focusIndex) {
        var objCurrent = Index.getCurrentPage(); //得到当前页
        // objCurrent.setParam("focusIndex", focusIndex);
        //
        // var objHospital = LMEPG.Intent.createIntent("hospital-hospitalIntroduce");
        // objHospital.setParam("userId", RenderParam.userId);
        // objHospital.setParam("hospitalName", RenderParam.hospitalName);
        // objHospital.setParam("inner", 0);
        //
        // LMEPG.Intent.jump(objHospital, objCurrent);
        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('albumName', "TemplateAlbum");
        objAlbum.setParam('graphicId', 271);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objCurrent);
    },
    // 跳转到 医生简介
    jumpDoctorBrief: function (focusIndex) {
        var objCurrent = Index.getCurrentPage(); //得到当前页
        objCurrent.setParam("focusIndex", focusIndex);

        var objHospital = LMEPG.Intent.createIntent("hospital-doctorIntroduce");
        objHospital.setParam("userId", RenderParam.userId);
        objHospital.setParam("hospitalName", RenderParam.hospitalName);
        objHospital.setParam("inner", 0);

        LMEPG.Intent.jump(objHospital, objCurrent);
    },

    // 跳转到 在线问诊
    jumpInquiry: function (focusIndex) {
        var objCurrent = Index.getCurrentPage(); //得到当前页
        objCurrent.setParam("focusIndex", focusIndex);

        var objHospital = LMEPG.Intent.createIntent("hospital-doctor-list");
        objHospital.setParam("userId", RenderParam.userId);
        objHospital.setParam("hospitalName", RenderParam.hospitalName);
        objHospital.setParam("inner", 0);

        LMEPG.Intent.jump(objHospital, objCurrent);
    },

    // 跳转到 疾控防控
    jumpDiseasePrevention: function (focusIndex) {
        var objCurrent = Index.getCurrentPage(); //得到当前页
        objCurrent.setParam("focusIndex", focusIndex);

        var objHospital = LMEPG.Intent.createIntent("hospital-disease-control");
        objHospital.setParam("userId", RenderParam.userId);
        objHospital.setParam("hospitalName", RenderParam.hospitalName);
        objHospital.setParam("inner", 0);

        LMEPG.Intent.jump(objHospital, objCurrent);
    },

    // 跳转到 教育健康
    jumpHealthEducation: function (focusIndex,album) {
        var objCurrent = Index.getCurrentPage();
        objCurrent.setParam("focusIndex", focusIndex);

        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('albumName', album);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objCurrent);
    },
};