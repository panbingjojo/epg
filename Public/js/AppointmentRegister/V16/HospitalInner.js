var HospInner = {
    buttons: [],
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
        var words1Len = RenderParam.platformType == 'sd' ? 90 : 178;
        var words2Len = RenderParam.platformType == 'sd' ? 10 : 30;
        var words3Len = RenderParam.platformType == 'sd' ? 20 : 50;

        G('hosp-pic').src = RenderParam.fsUrl + data.img_url;
        G('qr-code').src = RenderParam.fsUrl + data.qrcode_img_url;
        G('hosp-short-details').innerHTML = LMEPG.Func.substrByOmit(data.brief_intro, words1Len);
        G('content-details').innerHTML = data.brief_intro;
        G('addr-tel').innerHTML = (function () {
            return '<li id="doctor-name" style="color: black;font-weight: bold">' + data.hospital_name + '</li>' +
                '<li id="tel-wrap" style="color: black"><img class="icon-tel" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V16/icon_tel.png"><span style="color: black">'
                + data.tel + '</span></li>' +
                '<li id="addr-wrap" style="color: black"><img class="icon-addr" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V16/icon_addr.png"><span class="addr-text">'
                + data.location +
                '</span></li>';
        }());
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
            nextFocusDown: 'hosp-departments',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V16/hosp_detail.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V16/hosp_detail_f.png',
            btnContent: 'content-1',
            click: this.clickItem
        }, {
            id: 'hosp-departments',
            type: 'img',
            name: '推荐科室',
            nextFocusUp: 'hosp-details',
            nextFocusDown: 'hosp-experts',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V16/hosp_department.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V16/hosp_department_f.png',
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
            id: 'scroll-bar-1',
            type: 'others',
            name: '滚动条',
            beforeMoveChange: this.scrollContentDistance,
            focusChange: this.onFocusChangeColor
        }, {
            id: 'scroll-bar-2',
            type: 'others',
            name: '滚动条',
            beforeMoveChange: this.scrollContentDistance,
            focusChange: this.onFocusChangeColor
        });
    },
    dis: 0,
    offsetY: 0,
    offsetStep: 20,
    scrollBarHeight: 66, // 滚动条的高度
    scrollContentDistance: function (direction, btn) {
        if (direction == 'left' || direction == 'right') {
            return;
        }
        var deltaY = HospInner.wrapContentHeight - HospInner.scrollBarHeight;
        var scale = HospInner.wrapContentHeight / HospInner.contentHeight;
        switch (direction) {
            case 'up':
                HospInner.offsetY -= HospInner.offsetStep;
                if (HospInner.offsetY < 0) { // 判断边界值
                    HospInner.offsetY = 0;
                }
                break;
            case 'down':
                HospInner.offsetY += HospInner.offsetStep; // 修改变量
                if (HospInner.offsetY >= deltaY) { // 判断边界值
                    HospInner.offsetY = deltaY;
                }
                break;
        }
        var contentDetailId;
        if (btn.id === 'scroll-bar-1') {
            contentDetailId = 'content-details';
        }
        if (btn.id === 'scroll-bar-2') {
            contentDetailId = 'department-container';
        }
        // 修改滚动条的位置
        G(btn.id).style.top = HospInner.offsetY + 'px';
        var contentDetailDOM = G(contentDetailId);
        // 修改内容区域高度
        contentDetailDOM.style.top = -(HospInner.offsetY / scale) + 'px';
    },
    onFocusChangeColor: function (btn, hasFocus) {
        if (hasFocus) {
            // HospInner.scrollContentDistance();
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
            HospInner.contentController(btn.btnContent);
            if (btn.id == 'hosp-details') LMEPG.BM.requestFocus('scroll-bar-1');
            if (btn.id == 'hosp-departments') LMEPG.BM.requestFocus('scroll-bar-2');
        }
    },
    prevContentIndex: 'content-0',

    getInnerHeight: function (el, attr) {
        var val;
        if (el.currentStyle) {
            val = el.currentStyle[attr];
        } else {
            try {
                val = getComputedStyle(el, null)[attr];
            } catch (e) {
                val = el.innerText.length;
            }
        }
        return val;
    },

    /**
     * 获取节点内部的属性
     * @param el DOM节点
     * @param attr 属性名称
     * @returns {string} 返回节点属性
     */
    getElementAttrByName: function (el, attr) {
        var val;
        if (el.currentStyle) {
            val = el.currentStyle[attr];
        } else {
            try {
                val = getComputedStyle(el, null)[attr];
            } catch (e) {
                val = el.innerText.length;
            }
        }
        return val;
    },

    contentHeight: 0,
    wrapContentHeight: 0,
    contentController: function (id) {
        Hide(HospInner.prevContentIndex);
        Show(id);
        HospInner.prevContentIndex = id;

        // 判断是否显示内容滚动条
        if (id === 'content-1') {
            HospInner.calcScrollBar('content-1', 'content-details', 'scroll-wrap-1', 'scroll-bar-1', 0);
        }
        if (id === 'content-2') {
            HospInner.calcScrollBar('content-2', 'dep-wrap', 'scroll-wrap-2', 'scroll-bar-2', -30);
        }
    },

    calcScrollBar: function (contentId, contentDetailId, scrollWrapId, scrollBarId, extraHeight) {
        HospInner.contentHeight = parseInt(this.getInnerHeight(G(contentDetailId), 'height')) - extraHeight;
        HospInner.wrapContentHeight = parseInt(this.getInnerHeight(G(contentId), 'height'));
        // 如果没有溢出内容则不显示滚动条
        if (HospInner.contentHeight < HospInner.wrapContentHeight) {
            if (G(scrollWrapId)) G(contentId).removeChild(G(scrollWrapId)); // 移除节点
        } else {
            // 1、检查是否存在滚动条
            if (!G(scrollWrapId)) {
                var scrollWrap = document.createElement("div");
                scrollWrap.setAttribute("id", scrollWrapId);
                scrollWrap.innerHTML = '<p id="' + scrollBarId + '"></p>';
                G(contentId).appendChild(scrollWrap);
            }
            // 2、计算显示内容区域和内容区域的比例
            var scale = HospInner.wrapContentHeight / HospInner.contentHeight;
            var scrollWrapHeight = parseInt(this.getInnerHeight(G(scrollWrapId), 'height'));
            // 3、计算滚动条的高度
            var scrollBarHeight = scrollWrapHeight * scale;
            if (scrollBarHeight < 66) {
                scrollBarHeight = 66;
            }
            HospInner.scrollBarHeight = scrollBarHeight;
            // 4、修改滚动条高度
            G(scrollBarId).style.height = scrollBarHeight + 'px';
        }
    }
};

function onBack() {
    if (HospInner.prevContentIndex != 'content-0') {
        HospInner.contentController('content-0');
        LMEPG.BM.requestFocus(HospInner.keepBtnid);
    } else {
        LMEPG.Intent.back();
    }
}

window.onload = function () {
    var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V16/Home/bg.png';
    var contentImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V16/content_bg.png';
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
    }
    document.body.style.backgroundImage = 'url(' + bgImg + ')';
    G("content-position").style.backgroundImage = 'url(' + contentImg + ')';

    HospInner.init();
};
