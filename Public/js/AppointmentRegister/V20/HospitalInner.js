var HospInner = {
    isDetail: false,
    buttons: [],
    openName: "",
    init: function () {
        HospInner.getCwsData();
    },
    getCwsData: function () {
        var me = this;
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalListInfo", "", function (rsp) {
            try {
                if (rsp.result == 0) {
                    me.dataIndex = LMEPG.Func.getLocationString('dataId');
                    var element = rsp.list.filter(function (item) {
                        return item.hospital_id == me.dataIndex
                    })
                    me.renderHtml(element);
                    me.createButtons();
                    me.contentController(RenderParam.btnContent);
                    LMEPG.BM.init(RenderParam.focusId, me.buttons, '', true);
                } else {
                    LMEPG.UI.showToast("数据拉取失败:" + rsp);
                }
            } catch (e) {
                LMEPG.UI.showToast("数据拉取失败:" + e);
            }
        });
    },
    renderHtml: function (element) {
        var data = element[0];
        var words1Len = RenderParam.platformType == 'sd' ? 90 : 190;
        var words2Len = RenderParam.platformType == 'sd' ? 10 : 30;
        var words3Len = RenderParam.platformType == 'sd' ? 20 : 50;

        G('hosp-pic').src = RenderParam.fsUrl + data.img_url;
        G('qr-code').src = RenderParam.fsUrl + data.qrcode_img_url;
        G('hosp-short-details').innerHTML = LMEPG.Func.isEmpty(data.registration_intro) ? '请用手机扫描二维码-进行预约挂号缴费' : LMEPG.Func.substrByOmit(data.registration_intro, words1Len);
        G('content-details').innerHTML = data.brief_intro;
        G('addr-tel').innerHTML = (function () {
            return '<li id="doctor-name">' + data.hospital_name + '</li>' +
                '<li id="tel-wrap"><img class="icon-tel" src="__ROOT__/Public/img/hd/AppointmentRegister/V20/icon_tel.png"><div id="tel-text">'
                + data.tel + '</div></li>' +
                '<li id="addr-wrap"><img class="icon-addr" src="__ROOT__/Public/img/hd/AppointmentRegister/V20/icon_addr.png"><span class="addr-text">'
                + data.location +
                '</span></li>';
        }());

        LMEPG.UI.Marquee.start('doctor-name', 10);
        LMEPG.UI.Marquee.start('tel-text', 25);


        var partData = HospInner.resolvedDepartmentData(data);
        G('dep-wrap').innerHTML = (function () {
            var htm = '';
            for (var i = 0; i < partData.length; i++) {
                htm += '<p class="dep" id="dep-' + i + '">' + partData[i] + '</p>';
            }
            return htm;
        }());
    },
    /**
     * 解析单个医院科室数据
     * @param data
     */
    resolvedDepartmentData: function (data) {
        var tempData = LMEPG.Func.string.replaceAll(data.recommend_dept);
        return this.data = tempData.split(/[,\uff0c\u3001]/g);
        // return LMEPG.Func.array.fullAry(this.data);
    },
    createButtons: function () {
        this.buttons.push({
            id: 'hosp-details',
            type: 'img',
            name: '医院详情',
            nextFocusUp: 'back',
            nextFocusDown: 'hosp-departments',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V20/hosp_detail.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V20/hosp_detail_f.png',
            btnContent: 'content-1',
            click: this.clickItem
        }, {
            id: 'hosp-departments',
            type: 'img',
            name: '推荐科室',
            nextFocusUp: 'hosp-details',
            nextFocusDown: 'hosp-experts',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V20/hosp_department.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V20/hosp_department_f.png',
            btnContent: 'content-2',
            click: this.clickItem
        }, {
            id: 'hosp-experts',
            type: 'img',
            name: '推荐专家',
            nextFocusUp: 'hosp-departments',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V16/hosp_expert.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V16/hosp_expert_f.png',
            click: this.clickItem
        }, {
            id: 'scroll-bar',
            type: 'others',
            name: '滚动条',
            beforeMoveChange: this.scrollContentDistance,
            focusChange: this.onFocusChangeColor
        }, {
            id: 'back',
            type: 'others',
            name: '滚动条',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/back.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/back_f.png',
            click: onBack,
            beforeMoveChange: this.scrollContentDistance,
        });
    },
    dis: 0,
    scrollContentDistance: function (key, btn) {
        var scrollBarEl = G('scroll-bar');
        var detailsEl = G('content-details');
        var wordsCount = G('content-details').innerText.length;
        var backReturnLen = RenderParam.platformType == 'sd' ? 300 : 309;
        console.log(wordsCount, backReturnLen);
        if (key == 'down' && btn.id == "back") {
            if (HospInner.isDetail) {
                LMEPG.BM.requestFocus("scroll-bar")
            } else {
                if (HospInner.openName == "depart") {

                } else {
                    LMEPG.BM.requestFocus("hosp-details")
                }
            }
            return false;
        }
        if (wordsCount < backReturnLen) {
            Hide('scroll-wrap');
            return;
        }
        HospInner.dis = parseInt(scrollBarEl.style.top) || 0;
        if (key == 'up' && HospInner.dis > 0) {
            HospInner.dis -= 1;
            uadateDis();
            return false;
        } else if (key == 'up') {
            LMEPG.BM.requestFocus("back")
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
     * @param btn
     */
    clickItem: function (btn) {
        HospInner.keepBtnid = btn.id;
        if (btn.id == 'hosp-experts') {
            if (RenderParam.carrierId == '620092') {
                LMEPG.UI.showToast('该医院暂无推荐医生');
                return;
            }
            var curr = HospInner.getCurPageObj();
            var addr = LMEPG.Intent.createIntent('doctorStatic');
            addr.setParam('dataId', HospInner.dataIndex);
            LMEPG.Intent.jump(addr, curr);
        } else {
            G('content-title').innerHTML = btn.name + '：';
            Hide('action-wrap');
            // HospInner.isDetail = btn.id == "hosp-details" ? true : false;
            if (G("action-wrap").style.display == "none" && btn.name == "医院详情") {
                HospInner.isDetail = true;
            } else {
                HospInner.isDetail = false;
                HospInner.openName = "depart";
            }
            Show('back');
            HospInner.contentController(btn.btnContent);
            LMEPG.BM.requestFocus('back')
            // if (btn.id == 'hosp-details') LMEPG.BM.requestFocus('scroll-bar');
        }
    },
    prevContentIndex: 'content-0',
    contentController: function (id) {
        Hide(HospInner.prevContentIndex);
        Show(id);
        HospInner.prevContentIndex = id;
    }
};

function onBack() {
    if (HospInner.prevContentIndex != 'content-0') {
        G('content-title').innerHTML = '挂号指南：';
        Show('action-wrap');
        // Hide("back")
        HospInner.isDetail = false;
        HospInner.openName = ""
        HospInner.contentController('content-0');
        LMEPG.BM.requestFocus(HospInner.keepBtnid);
    } else {
        LMEPG.Intent.back();
    }
}


