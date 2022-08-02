var Hosp = {
    serverDataCarrierIdList : ["640092", "320092",'320005'], // 预约挂号医院数据在服务器上
    maxPage: 0,
    buttons: [],
    hospitalList: [],    //  医院列表

    /**
     * 获取医院列表数据
     */
    getServerData: function () {
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalListInfo", "", function (rsp) {
            rsp.result == 0 ? Hosp.getServerData_(rsp.list) : LMEPG.UI.showToast("数据拉取失败:" + rsp);
        });
    },

    /**
     * 获取医院列表数据后的操作
     * 转换医院列表数据
     * @param list {[]} 医院列表
     */
    getServerData_: function (list) {
        var temp_list = [];
        for (var i = 0; i < list.length; i++) {
            temp_list.push(Hosp.buildHospItem(list[i]))
        }
        Hosp.hospitalList = temp_list;
        Hosp.maxPage = Math.ceil((Hosp.hospitalList.length - 1) / 6);
        Hosp.init();
    },

    /**
     * 构建医院信息
     * @param item
     */
    buildHospItem: function (item) {
        return {
            "id": item.hospital_id,
            "title": item.hospital_name,
            "hospQRCode": item.hospital_code,
            "hospDetail": item.brief_intro,
            "hospAddr": item.location,
            "hospTel": item.tel,
            "imgUrl": RenderParam.fsUrl + item.img_url,
            "hospDepart": item.recommend_dept.split(/[,|，|;|；|、]\s*/g) || [],
            "hospDoctors": item.hospDoctors || []
        }
    },

    /**
     * 页面初始化
     */
    init: function () {
        Hosp.page = RenderParam.page;
        Hosp.renderList();
        Hosp.createButtons();
        LMEPG.BM.init(RenderParam.focusId, Hosp.buttons, '', true);
    },

    /**
     * 渲染医院列表
     */
    renderList: function () {
        var reStart = (Hosp.page - 1) * 6;
        var cutData = Hosp.hospitalList.slice(reStart, reStart + 6);
        Hosp.cutDataLength = cutData.length;
        G('list-wrapper').innerHTML = Hosp.buildHtmlByCarrierId(RenderParam.carrierId, cutData);
        G('page-count').innerHTML = Hosp.page + '/' + Hosp.maxPage;
        Hosp.toggleArrow();
    },

    /**
     * 构建html代码
     * @param carrierId
     * @param cutData {[]} 医院列表
     * @returns {string}
     */
    buildHtmlByCarrierId: function (carrierId, cutData) {
        if (carrierId == "620092") return Hosp.buildHtml620092(cutData);
        if (Hosp.serverDataCarrierIdList.indexOf(carrierId)>=0) return Hosp.buildHtml640092(cutData);
        return Hosp.buildHtmlDefault(cutData);
    },

    /**
     * 宁夏电信
     * @param cutData
     * @returns {string}
     */
    buildHtml640092: function (cutData) {
        var html = '';
        cutData.forEach(function (t, i) {
            // 标/高清滚动字数限制
            var titleLen = RenderParam.platformType == 'sd' ? 8 : 12;
            html += '<div class="item-wrap" data-id="' + t.id + '" id="focus-' + i + '">' +
                '<img class="item-img" src="' + t.imgUrl + '">' +
                '<div id="p-' + i + '" class="item-p" data-title="' + t.title + '">' + LMEPG.Func.substrByOmit(t.title, titleLen) + '</div>' +
                '</div>';
        });
        return html;
    },

    /**
     * 构建特殊地区html
     * @returns {string}
     */
    buildHtml620092: function (cutData) {
        var html = "";
        cutData.forEach(function (t, i) {
            html += '<div class="item-wrap" data-id="' + t.id + '" id="focus-' + i + '">' +
                '<img class="item-img620092" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/V620092/list_hospital_img_' + t.id + '.png">' +
                '<div id="p-' + i + '"data-title="' + t.title + '">' + '</div>' +
                '</div>';
        });
        return html;
    },

    /**
     * 构建默认html资源
     * @returns {string}
     */
    buildHtmlDefault: function (cutData) {
        var htm = '';
        cutData.forEach(function (t, i) {
            // 标/高清滚动字数限制
            var titleLen = RenderParam.platformType == 'sd' ? 8 : 12;
            htm += '<div class="item-wrap" data-id="' + t.id + '" id="focus-' + i + '">' +
                '<img class="item-img" src="' + g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/' + Hosp.getImageNameByLmcid() + t.id + '.png">' +
                '<div id="p-' + i + '" class="item-p" data-title="' + t.title + '">' + LMEPG.Func.substrByOmit(t.title, titleLen) + '</div>' +
                '</div>';
        });
        return htm;
    },

    /**
     * 获取静态图片名字
     */
    getImageNameByLmcid: function () {
        var imageName = "hosp_";
        RenderParam.carrierId == '430002' && (imageName = "hosp_430002_")
        return imageName;
    },

    /**
     * 移动前
     * @param key
     * @param btn
     * @returns {boolean}
     */
    beforeMoveItem: function (key, btn) {
        if (key == 'left' && (btn.id == 'focus-0' || btn.id == 'focus-3')) {
            Hosp.prevList(btn.id);
            return false;
        }
        if (key == 'right' && (btn.id == 'focus-2' || btn.id == 'focus-5')) {
            Hosp.nextList(btn.id);
            return false;
        }
    },

    /**
     * 切换分页
     * @param btn
     */
    prevList: function (btn) {
        if (Hosp.page == 1) return;
        Hosp.page--;
        Hosp.renderList();
        btn == 'page-prev' ? LMEPG.BM.requestFocus('page-prev') : LMEPG.BM.requestFocus('focus-5');
    },

    /**
     *  当前页面个数小于4个，设置线上移动的焦点
     * @param btn
     */
    onClickSetMoveUpId: function (btn) {
        btn.nextFocusUp = Hosp.cutDataLength < 4 ? 'focus-0' : 'focus-3'
    },

    /**
     *
     * @param btn
     * @param hasFocus
     */
    onFocusSetMoveDownId: function (btn, hasFocus) {
        var cutIndex = btn.id.slice(btn.id.length - 1);
        var pEl = G('p-' + cutIndex);
        var titleLen = RenderParam.platformType == 'sd' ? 8 : 12;
        var textW = pEl.getAttribute('data-title');
        // 获得焦点
        if (hasFocus) {
            // 且id索引小于3
            if (cutIndex < 3) {
                if (Hosp.cutDataLength > 3) {
                    var downFocuId = 'focus-' + (parseInt(cutIndex) + 3);
                    // 当前页面焦点Id向下移动对应的DOM是否存在
                    if (LMEPG.Func.isElementExist(downFocuId)) {
                        btn.nextFocusDown = 'focus-' + (parseInt(cutIndex) + 3);
                    } else {
                        btn.nextFocusDown = 'focus-' + (Hosp.cutDataLength - 1);
                    }
                } else {
                    // 当前页数大于3个,否则移动到首页按钮
                    btn.nextFocusDown = 'page-first';
                }
            }
            LMEPG.Func.marquee(pEl, textW, titleLen, 3);
        } else {
            LMEPG.Func.marquee(pEl);
            pEl.innerHTML = LMEPG.Func.substrByOmit(textW, titleLen);
        }
    },

    /**
     * 下一页
     * @param btn
     */
    nextList: function (btn) {
        if (Hosp.page == Hosp.maxPage) return;
        Hosp.page++;
        Hosp.renderList();
        btn == 'page-next' ? LMEPG.BM.requestFocus('page-next') : LMEPG.BM.requestFocus('focus-0');
    },

    /**
     *  切换箭头
     */
    toggleArrow: function () {
        H('icon-prev');
        H('icon-next');
        Hosp.page > 1 && S('icon-prev');
        Hosp.page < Hosp.maxPage && S('icon-next');
    },

    /**
     * 获取当前页
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('indexStatic');
        // 页面焦点保持
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('page', Hosp.page);
        return objCurrent;
    },

    /**
     * 医院列表item，点击事件
     * @param btn
     */
    clickItem: function (btn) {
        var addr = Hosp.getTargetPage(btn);
        LMEPG.Intent.jump(addr, Hosp.getCurPageObj());
    },

    /**
     * 获取医院医院体跳转页面
     * 主要判断是否是列表中的最后一个医院,最后一页且点击的是最后一个列表焦点跳转到更多医院界面
     */
    getTargetPage: function (btn) {
        var cutLen = btn.id.slice(btn.id.length - 1);
        var isRouteRecommendHospital = Hosp.page == Hosp.maxPage && cutLen == Hosp.cutDataLength - 1 && RenderParam.isRunOnAndroid == '0';
        var pageName = isRouteRecommendHospital ? "moreHospitalStatic" : "areaListStatic";
        var targetPage =  LMEPG.Intent.createIntent(pageName);
        var _id = G(btn.id).getAttribute('data-id');

        targetPage.setParam('dataId', _id);

        // 当目标页面为本省更多医生的二维码时，把二维码带过去
        if (pageName == "moreHospitalStatic") {
            var _imgUrl = Hosp.hospitalList[_id - 1].imgUrl;
            targetPage.setParam("moreHospitalUrl", _imgUrl);
        }

        return targetPage;
    },

    /**
     * 翻页按钮
     * @param btn
     */
    clickActionBtn: function (btn) {
        switch (btn.id) {
            case 'page-first':
                Hosp.page = 1;
                Hosp.renderList();
                break;
            case 'page-prev':
                Hosp.prevList(btn.id);
                break;
            case 'page-next':
                Hosp.nextList(btn.id);
                break;
            case 'page-last':
                Hosp.page = Hosp.maxPage;
                Hosp.renderList();
                break;
        }
        Hosp.onClickSetMoveUpId(btn);
    },

    /**
     * 创建按钮数组
     */
    createButtons: function () {
        var Nc = 6;
        while (Nc--) {
            Hosp.buttons.push({
                id: 'focus-' + Nc,
                type: 'div',
                name: '视频列表焦点',
                nextFocusUp: 'focus-' + (Nc - 3),
                nextFocusDown: Nc < 3 ? 'focus-' + (Nc + 3) : 'page-first',
                nextFocusLeft: 'focus-' + (Nc - 1),
                nextFocusRight: 'focus-' + (Nc + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V13/hosp_f.png',
                beforeMoveChange: Hosp.beforeMoveItem,
                focusChange: Hosp.onFocusSetMoveDownId,
                click: Hosp.clickItem
            });
        }
        Hosp.buttons.push({
            id: 'page-first',
            type: 'img',
            name: '首页按钮',
            nextFocusUp: 'focus-3',
            nextFocusRight: 'page-prev',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/page_first.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/page_first_f.png',
            focusChange: Hosp.onClickSetMoveUpId,
            click: Hosp.clickActionBtn
        }, {
            id: 'page-prev',
            type: 'img',
            name: '上一个按钮',
            nextFocusUp: 'focus-3',
            nextFocusLeft: 'page-first',
            nextFocusRight: 'page-next',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/page_prev.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/page_prev_f.png',
            focusChange: Hosp.onClickSetMoveUpId,
            click: Hosp.clickActionBtn
        }, {
            id: 'page-next',
            type: 'img',
            name: '下一个按钮',
            nextFocusUp: 'focus-3',
            nextFocusLeft: 'page-prev',
            nextFocusRight: 'page-last',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/page_next.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/page_next_f.png',
            focusChange: Hosp.onClickSetMoveUpId,
            click: Hosp.clickActionBtn
        }, {
            id: 'page-last',
            type: 'img',
            name: '最后一页按钮',
            nextFocusUp: 'focus-3',
            nextFocusLeft: 'page-next',
            backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/page_last.png',
            focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V13/page_last_f.png',
            focusChange: Hosp.onClickSetMoveUpId,
            click: Hosp.clickActionBtn
        });
    },

    /**
     * 设置页面背景图片
     */
    setBgImage: function () {
        var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/bg.png';
        if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
            bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
        }
        document.body.style.backgroundImage = 'url(' + bgImg + ')';
    }
};

/**
 * 页面返回
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 页面加载
 */
window.onload = function () {
    Hosp.setBgImage();

    // 判断是否从服务器读取数据
    if (Hosp.serverDataCarrierIdList.indexOf(RenderParam.carrierId) >=0) {
        Hosp.getServerData();
    } else {
        Hosp.hospitalList = hospData;
        Hosp.maxPage = Math.ceil((hospData.length - 1) / 6);
        Hosp.init();
    }
};