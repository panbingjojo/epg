var HospDoctor = {
    serverDataCarrierIdList : ["640092", "320092",'320005'], // 预约挂号医院数据在服务器上
    maxPage: 0,
    buttons: [],
    hospitalList: [],  //  医院列表
    hospDoctors:  [], //  推荐医生列表
    dataIndex: LMEPG.Func.getLocationString('dataId'),
    hospTitle: "",   //  医院标题

    /**
     * 页面初始化入口
     */
    init: function () {
        HospDoctor.page = RenderParam.page;
        HospDoctor.renderHtml();
        HospDoctor.createButtons();
        LMEPG.BM.init(RenderParam.focusId, HospDoctor.buttons, '', true);
    },

    /**
     * 根据地区ID初始化页面数据，因为有的地区是世界读取本地数据，有的需要接口拉取数据
     * @param carrierId
     */
    initByCarrierID: function (carrierId) {
        if (HospDoctor.serverDataCarrierIdList.indexOf(carrierId) >=0) {
            HospDoctor.getHospitalsList();
        } else {
            HospDoctor.hospitalList = hospData;
            var data;
            if (RenderParam.carrierId === '430002') { // 湖南电信apk，需要对数组进行排序，所以具体医院的数据需要通过id标识来获取
                data = HospDoctor.getHospDataById(HospDoctor.dataIndex);
            } else {
                data = HospDoctor.getHospByDataIndex(HospDoctor.dataIndex);
            }
            HospDoctor.hospDoctors = data.hospDoctors;
            HospDoctor.init();
        }
    },

    /**
     * 获取推荐医生列表
     * @param hospital_id
     */
    getDoctorListById: function (hospital_id) {
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalExpertInfo", {"hospital_id": hospital_id}, function (res) {
            try {
                if (res.result == 0) {
                    HospDoctor.hospDoctors = JSON.stringify(res.list) !== "{}" ? HospDoctor.parseDocList(res.list) : []
                    HospDoctor.init();
                } else {
                    LMEPG.UI.showToast("获取推荐医生失败 ~:" + e);
                }
            } catch (e) {
                LMEPG.UI.showToast("抱歉出错了，请联系管理员 ~:" + e);
            }
        });
    },


    /**
     * 处理推荐医生列表
     * @param {[]} list 医生列表
     */
    parseDocList: function (list) {
        var temp_list = [];
        for (var index in list) {
            for (var test in list[index]) {
                var item = list[index][test];
                temp_list.push({
                    "id": item.doctor_id,
                    "name": item.doctor_name,
                    "depmart": item.dept_name,
                    "position": item.doctor_level,
                    "goods": "-",
                    "intro": item.doctor_intro,
                })
            }
        }
        return temp_list;
    },

    /**
     * 获取医院列表
     */
    getHospitalsList: function () {
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalListInfo", "", function (rsp) {
            if (rsp.result == 0) {
                HospDoctor.hospitalList = HospDoctor.exchangeHospital(rsp.list);
                HospDoctor.getDoctorListById(HospDoctor.dataIndex);
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
                "hospDepart": list[i].recommend_dept.split("、") || []
            })
        }
        return temp_list;
    },


    /**
     * 渲染页面
     */
    renderHtml: function () {
        var data;
        if (RenderParam.carrierId === '430002') { // 湖南电信apk，需要对数组进行排序，所以具体医院的数据需要通过id标识来获取
            data = HospDoctor.getHospDataById(HospDoctor.dataIndex);
        } else {
            data = HospDoctor.getHospByDataIndex(HospDoctor.dataIndex);
        }
        HospDoctor.hospTitle = data.title;
        HospDoctor.readerAddrTel(data);
        HospDoctor.renderHospPic(data);
        HospDoctor.renderList();
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
     * 从医院列表中获取具体医院
     * @param dataIndex {string | number} 医院ID或医院列表索引
     */
    getHospByDataIndex: function (dataIndex) {
        if (HospDoctor.serverDataCarrierIdList.indexOf(RenderParam.carrierId) >=0) {
            for (var i = 0; i < HospDoctor.hospitalList.length; i++) {
                if (HospDoctor.hospitalList[i].id == dataIndex) return HospDoctor.hospitalList[i];
            }
        } else {
            return HospDoctor.hospitalList[dataIndex];
        }
    },

    /**
     * 渲染医院地址和电话
     * @param data
     */
    readerAddrTel: function (data) {
        G('addr-tel').innerHTML = (function () {
            return '<li id="hosp-name">' + data.title + '</li>' +
                '<li id="tel-wrap"><img class="icon-tel" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/icon_tel.png"><span class="tel-text">'
                + data.hospTel + '</span></li>' +
                '<li id="addr-wrap"><img class="icon-addr" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/icon_addr.png"><span class="addr-text">'
                + data.hospAddr +
                '</span></li>';
        }());
    },

    /**
     * 渲染医院图片
     * @param data
     */
    renderHospPic: function (data) {
        if (RenderParam.carrierId == '620092') {
            G('hosp-pic').src = g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/V620092/list_hospital_img_' + HospDoctor.dataIndex + '.png';
        } else if (HospDoctor.serverDataCarrierIdList.indexOf(RenderParam.carrierId) >=0) {
            G('hosp-pic').src = data.imgUrl;
        } else if (RenderParam.carrierId === '430002') {
            G('hosp-pic').src = g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/hosp_430002_' + HospDoctor.dataIndex + '.png';
        } else {
            G('hosp-pic').src = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V13/hosp_' + HospDoctor.dataIndex + '.png';
        }
    },

    /**
     * 渲染推荐医生列表
     */
    renderList: function () {
        console.log("***************************")
        console.log(HospDoctor.hospDoctors);
        HospDoctor.maxPage = Math.ceil(HospDoctor.hospDoctors.length / 4);
        var reStart = (HospDoctor.page - 1) * 4;
        var cutData = HospDoctor.hospDoctors.slice(reStart, reStart + 4);
        HospDoctor.buildDocListHtmlCode(cutData);
        HospDoctor.buildPageCount();
        HospDoctor.toggleArrow();
    },

    /**
     * 构建数量显示
     */
    buildPageCount: function () {
        G('page-count').innerHTML = HospDoctor.page + '/' + HospDoctor.maxPage;
    },

    /**
     * 构建推荐医生html代码
     * @param cutData
     */
    buildDocListHtmlCode: function (cutData) {
        var htm = '';
        cutData.forEach(function (t, i) {
            htm += '<div id="doctor-' + i + '" data-doctor="' + t.id + '" class="doctor-item">' +
                '<img id="doctor-pic" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/default_doctor.png">' +
                '<p id="doctor-name">' + t.name + '</p>' +
                '<p id="doctor-dep">' + t.depmart + '</p>' +
                '<p id="doctor-pos">' + t.position + '</p>' +
                '</div>';
        });
        G('list-wrapper').innerHTML = htm;
    },

    /**
     * 移动前
     * @param key
     * @param btn
     * @returns {boolean}
     */
    beforeMoveItem: function (key, btn) {
        if (key == 'left' && btn.id == 'doctor-0') {
            HospDoctor.prevList();
            return false;
        }
        if (key == 'right' && btn.id == 'doctor-3') {
            HospDoctor.nextList();
            return false;
        }
    },

    /**
     * 上一页，上一个列表
     */
    prevList: function () {
        if (HospDoctor.page == 1) return;
        HospDoctor.page--;
        HospDoctor.renderList();
        LMEPG.BM.requestFocus('doctor-3');
    },

    /**
     * 下一页
     */
    nextList: function () {
        if (HospDoctor.page == HospDoctor.maxPage) return;
        HospDoctor.page++;
        HospDoctor.renderList();
        LMEPG.BM.requestFocus('doctor-0');
    },

    /**
     * 箭头方法
     */
    toggleArrow: function () {
        H('icon-prev');
        H('icon-next');
        HospDoctor.page > 1 && S('icon-prev');
        HospDoctor.page < HospDoctor.maxPage && S('icon-next');
    },
    /**
     * 获取当前页
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('doctorStatic');
        // 页面焦点保持
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('dataId', LMEPG.Func.getLocationString('dataId'));
        objCurrent.setParam('page', HospDoctor.page);
        return objCurrent;
    },

    /**
     * item,点击事件
     * @param btn
     */
    clickItem: function (btn) {
        var doctorIndex = G(btn.id).getAttribute('data-doctor');
        var curr = HospDoctor.getCurPageObj();
        var addr = LMEPG.Intent.createIntent('doctorDetailStatic');
        addr.setParam('dataId', LMEPG.Func.getLocationString('dataId'));
        addr.setParam('doctorIndex', doctorIndex);
        // 根据地区ID，添加特殊字段
        addr = HospDoctor.addSpecialFields(addr, btn);
        console.log(addr);
        LMEPG.Intent.jump(addr, curr);
    },

    /**
     * 添加特殊字段
     * @param addr
     * @param btn
     * @constructor
     */
    addSpecialFields: function (addr, btn) {
        if (HospDoctor.serverDataCarrierIdList.indexOf(RenderParam.carrierId) >=0) {
            var index = (HospDoctor.page - 1) * 4 + parseInt(btn.id.split("-")[1]);
            HospDoctor.page > 1 && (index + 1);
            var item = HospDoctor.hospDoctors[index];
            addr.setParam("depmart", item.depmart);
            addr.setParam("goods", item.goods);
            addr.setParam("id", item.id);
            addr.setParam("intro", item.intro);
            addr.setParam("name", item.name);
            addr.setParam("position", item.position);
            addr.setParam("title", HospDoctor.hospTitle);
            return addr;
        }
        return addr;
    },

    createButtons: function () {
        var Nc = 4;
        while (Nc--) {
            HospDoctor.buttons.push({
                id: 'doctor-' + Nc,
                type: 'div',
                name: '医生列表焦点',
                nextFocusLeft: 'doctor-' + (Nc - 1),
                nextFocusRight: 'doctor-' + (Nc + 1),
                backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V13/doctor_item.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V13/doctor_item_f.png',
                beforeMoveChange: HospDoctor.beforeMoveItem,
                click: HospDoctor.clickItem
            });
        }
    }
};


/**
 * 页面返回
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 文档加载
 */
window.onload = function () {
    var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/bg.png';
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
    }
    document.body.style.backgroundImage = 'url(' + bgImg + ')';
    // 页面初始化，有的地区是从后台读取数据的，不是读取本地文件，所以这里需要根据地区ID，分方式读取到医院列表
    HospDoctor.initByCarrierID(RenderParam.carrierId)
};
