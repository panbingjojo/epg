var HospInner = {
    serverDataCarrierIdList : ["640092", "320092",'320005'], // 预约挂号医院数据在服务器上
    buttons: [],
    hospitalList: [],  //  医院列表
    dataIndex: LMEPG.Func.getLocationString('dataId'),

    /**
     * 页面初始化入口
     */
    init: function () {
        HospInner.renderHtml();
        HospInner.createButtons();
        HospInner.contentController(RenderParam.btnContent);
        LMEPG.BM.init(RenderParam.focusId, HospInner.buttons, '', true);
    },

    /**
     * 根据地区ID初始化页面数据，因为有的地区是世界读取本地数据，有的需要接口拉取数据
     * @param carrierId
     */
    initByCarrierID: function (carrierId) {
        if (HospInner.serverDataCarrierIdList.indexOf(carrierId) >=0) {
            HospInner.getHospitalsList()
        } else {
            HospInner.hospitalList = hospData;
            HospInner.init()
        }
    },

    /**
     * 获取医院列表
     */
    getHospitalsList: function () {
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalListInfo", "", function (rsp) {
            if (rsp.result == 0) {
                HospInner.exchangeHospital(rsp.list)
            } else {
                LMEPG.UI.showToast("数据拉取失败:" + rsp);
            }
        });
    },

    /**
     * 转换医院列表数据
     * @param list {[]} 医院列表
     */
    exchangeHospital: function (list) {
        var temp_list = [];
        for (var i = 0; i < list.length; i++) {
            temp_list.push({
                "id": list[i].hospital_id,
                "title": list[i].hospital_name,
                "hospQRCode": RenderParam.fsUrl + list[i].qrcode_img_url,
                "hospDetail": list[i].brief_intro,
                "hospAddr": list[i].location,
                "hospTel": list[i].tel,
                "imgUrl": RenderParam.fsUrl + list[i].img_url,
                "hospDepart": list[i].recommend_dept.split(/[，|,|、]/g) || [],
                "hospDoctors": list[i].hospDoctors || []
            })
        }
        HospInner.hospitalList = temp_list;
        HospInner.init();
    },

    /**
     * 渲染页面
     */
    renderHtml: function () {
        var data;
        if (RenderParam.carrierId === '430002') { // 湖南电信apk，需要对数组进行排序，所以具体医院的数据需要通过id标识来获取
            data = HospInner.getHospDataById(HospInner.dataIndex);
        } else {
            data = HospInner.getHospByDataIndex(HospInner.dataIndex);
        }
        HospInner.renderImage(data)
        HospInner.renderHsopHtmlData(data)
        HospInner.renderAddrTel(data)
        HospInner.renderDepWrap(data)
    },

    /**
     * 根据医院的id获取医院的具体信息
     * @param hospId 医院Id
     * @returns 具体的医院信息
     */
    getHospDataById: function (hospId) {
        for (var index = 0; index < hospData.length; index++) {
            var hospInfo = hospData[index];
            if (hospInfo.id == hospId) {
                return hospInfo;
            }
        }
    },

    /**
     * 渲染医院信息和详情介绍
     */
    renderHsopHtmlData: function (data) {
        var words1Len = RenderParam.platformType == 'sd' ? 90 : 178;
        // var words2Len = RenderParam.platformType == 'sd' ? 10 : 30;
        // var words3Len = RenderParam.platformType == 'sd' ? 20 : 50;
        G('hosp-short-details').innerHTML = LMEPG.Func.substrByOmit(data.hospDetail, words1Len);
        G('content-details').innerHTML = data.hospDetail;
    },

    /**
     * 更新医院图片和二维码
     */
    renderImage: function (data) {
        G('hosp-pic').src = HospInner.getHospPicImage(data)
        G('qr-code').src = HospInner.getHospQrCode(data)
    },


    /**
     *
     * @param data
     * @returns {string|*}
     */
    getHospQrCode: function (data) {
        var image = data.hospQRCode == "" ?g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/qr_' + HospInner.dataIndex + '.png' :data.hospQRCode;
        RenderParam.carrierId == "430002" && (image = g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/qr_430002_' + HospInner.dataIndex + '.png')
        RenderParam.carrierId == "440001" && (image = g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/guangdongYDHospQR.png')
        RenderParam.carrierId == "620092" && (image = g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/V620092/list_hospital_code_' + HospInner.dataIndex + '.png')

        return image
    },

    /**
     * 获取医院图片
     */
    getHospPicImage: function (data) {
        var image = data.imgUrl == "" ?g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_' + HospInner.dataIndex + '.png':data.imgUrl;
        RenderParam.carrierId == "430002" && (image = g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_430002_' + HospInner.dataIndex + '.png')
        RenderParam.carrierId == "440001" && (image = g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/GD_YD_hosp_' + HospInner.dataIndex + '.png')
        RenderParam.carrierId == "620092" && (image = g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/V620092/list_hospital_img_' + HospInner.dataIndex + '.png')
        return image
    },

    /**
     * 渲染医院地址和电话
     * @param data
     */
    renderAddrTel: function (data) {
        G('addr-tel').innerHTML = (function () {
            return '<li id="doctor-name">' + data.title + '</li>' +
                '<li id="tel-wrap"><img class="icon-tel" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/icon_tel.png"><span>'
                + data.hospTel + '</span></li>' +
                '<li id="addr-wrap"><img class="icon-addr" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/icon_addr.png"><span class="addr-text">'
                + data.hospAddr +
                '</span></li>';
        }());
    },

    /**
     * 渲染推荐科室
     * @param data
     */
    renderDepWrap: function (data) {
        G('dep-wrap').innerHTML = (function () {
            var htm = '';
            for (var i = 0; i < data.hospDepart.length; i++) {
                htm += '<p class="dep" id="dep-' + i + '">' + data.hospDepart[i] + '</p>';
            }
            return htm;
        }());

        if (RenderParam.carrierId === '440001') { //  广东移动隐藏掉专家
            Hide('hosp-experts');
            G("action-wrap").style.marginTop = "60px";
        }
    },

    /**
     * 从医院列表中获取具体医院
     * @param dataIndex {string | number} 医院ID或医院列表索引
     */
    getHospByDataIndex: function (dataIndex) {
        if (HospInner.serverDataCarrierIdList.indexOf(RenderParam.carrierId) >=0) {
            for (var i = 0; i < HospInner.hospitalList.length; i++) {
                if (HospInner.hospitalList[i].id == dataIndex) return HospInner.hospitalList[i]
            }
        } else {
            return HospInner.hospitalList[dataIndex]
        }
    },

    /**
     * 改变医院头像和医院二维码
     * @param carrerId {number | string} 地区ID
     */
    changeHospImageByCarrierId: function (carrerId, item) {
        if (carrerId == '620092') { // 甘肃电信医院图片修改
            G('hosp-pic').src = g_appRootPath + '/Public/img//hd/AppointmentRegister/V13/V620092/list_hospital_img_' + HospInner.dataIndex + '.png';
            G('qr-code').src = g_appRootPath + '/Public/img//hd/AppointmentRegister/V13/V620092/list_hospital_code_' + HospInner.dataIndex + '.png';
        } else if (HospInner.serverDataCarrierIdList.indexOf(RenderParam.carrierId) >=0) {
            G('hosp-pic').src = item.imgUrl;
            G('qr-code').src = item.hospQRCode;
        } else {
            G('hosp-pic').src = g_appRootPath + '/Public/img//hd/AppointmentRegister/V13/hosp_' + HospInner.dataIndex + '.png';
            G('qr-code').src = g_appRootPath + '/Public/img//hd/AppointmentRegister/V13/qr_' + HospInner.dataIndex + '.png';
        }
    },

    /**
     * 创建按钮
     */
    createButtons: function () {
        HospInner.buttons.push({
            id: 'hosp-details',
            type: 'img',
            name: '医院详情',
            nextFocusDown: 'hosp-departments',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_detail.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_detail_f.png',
            btnContent: 'content-1',
            click: HospInner.clickItem
        }, {
            id: 'hosp-departments',
            type: 'img',
            name: '推荐科室',
            nextFocusUp: 'hosp-details',
            nextFocusDown: RenderParam.carrierId === '440001' ? '' : 'hosp-experts',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_department.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_department_f.png',
            btnContent: 'content-2',
            click: HospInner.clickItem
        }, {
            id: 'hosp-experts',
            type: 'img',
            name: '推荐专家',
            nextFocusUp: 'hosp-departments',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_expert.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_expert_f.png',
            click: HospInner.clickItem
        }, {
            id: 'scroll-bar',
            type: 'others',
            name: '滚动条',
            beforeMoveChange: HospInner.scrollContentDistance,
            focusChange: HospInner.onFocusChangeColor
        });
    },
    dis: 0,
    scrollContentDistance: function (key, btn) {
        var scrollBarEl = G('scroll-bar');
        var detailsEl = G('content-details');
        var wordsCount = G('content-details').innerText.length;
        var backReturnLen = RenderParam.platformType == 'sd' ? 300 : 309;
        console.log(wordsCount, backReturnLen);
        if (key == 'left' || key == 'right' || wordsCount < backReturnLen) {
            Hide('scroll-wrap');
            return;
        }
        HospInner.dis = parseInt(scrollBarEl.style.top) || 0;
        if (key == 'up' && HospInner.dis > 0) {
            HospInner.dis -= 1;
            uadateDis();
            return false;
        }
        if (key == 'down' && HospInner.dis <= 237) {
            HospInner.dis += 1;
            uadateDis();
            return false;
        }

        function uadateDis() {
            scrollBarEl.style.top = HospInner.dis + 'px';
            detailsEl.style.top = -(HospInner.dis * 15) + 'px';
        }
    },

    /**
     * 切换焦点颜色
     * @param btn
     * @param hasFocus
     */
    onFocusChangeColor: function (btn, hasFocus) {
        if (hasFocus) {
            HospInner.scrollContentDistance();
            G(btn.id).className = 'focus';
        } else {
            G(btn.id).className = '';
        }
    },

    /**
     * 获取当前页
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('areaListStatic');
        // 页面焦点保持
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('dataId', LMEPG.Func.getLocationString('dataId'));
        objCurrent.setParam('btnContent', HospInner.prevContentIndex);
        return objCurrent;
    },

    /**
     * 切换显示控制函数
     * 按钮点击事件
     * @param btn
     */
    clickItem: function (btn) {
        HospInner.keepBtnid = btn.id;
        if (btn.id == 'hosp-experts') {
            if (RenderParam.carrierId == '620092') {
                LMEPG.UI.showToast('该医院暂无推荐医生');
                return;
            }
            HospInner.jumpDoctorStatic()
        } else {
            HospInner.contentController(btn.btnContent);
            if (btn.id == 'hosp-details') LMEPG.BM.requestFocus('scroll-bar');
        }
    },
    /**
     * 跳转到专家推荐页面
     */
    jumpDoctorStatic: function () {
        var curr = HospInner.getCurPageObj();
        var addr = LMEPG.Intent.createIntent('doctorStatic');
        addr.setParam('dataId', HospInner.dataIndex);
        LMEPG.Intent.jump(addr, curr);
    },

    prevContentIndex: 'content-0',
    contentController: function (id) {
        Hide(HospInner.prevContentIndex);
        Show(id);
        HospInner.prevContentIndex = id;
    }
};

/**
 * 返回页面
 */
function onBack() {
    if (HospInner.prevContentIndex != 'content-0') {
        HospInner.contentController('content-0');
        LMEPG.BM.requestFocus(HospInner.keepBtnid);
    } else {
        LMEPG.Intent.back();
    }
}

/**
 * 页面加载时
 */
window.onload = function () {
    var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/bg.png';
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
    }
    document.body.style.backgroundImage = 'url(' + bgImg + ')';

    // 页面初始化，有的地区是从后台读取数据的，不是读取本地文件，所以这里需要根据地区ID，分方式读取到医院列表
    HospInner.initByCarrierID(RenderParam.carrierId)
};
