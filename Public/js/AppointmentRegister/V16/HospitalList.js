var Hosp = {
    maxPage: 0,
    buttons: [],
    hospData: [],
    init: function () {
        this.page = RenderParam.page;
        Hosp.getCwsData();
    },
    getCwsData: function () {
        var me = this;
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalListInfo", "", function (rsp) {
            try {
                if (rsp.result == 0) {
                    Hosp.hospData = rsp.list;
                    Hosp.maxPage = Math.ceil((Hosp.hospData.length) / 6)
                    me.renderList();
                    me.createButtons();
                    LMEPG.BM.init(RenderParam.focusId, me.buttons, '', true);
                    // me.init(rsp.list);
                } else {
                    LMEPG.UI.showToast("数据拉取失败:" + rsp);
                }
            } catch (e) {
                LMEPG.UI.showToast("数据拉取失败:" + e);
            }
        });
    },
    renderList: function () {
        var htm = '';
        var reStart = (this.page - 1) * 6;
        var cutData = Hosp.hospData.slice(reStart, reStart + 6);
        this.cutDataLength = cutData.length;
        if (RenderParam.carrierId == '620092') {
            cutData.forEach(function (t, i) {
                // 标/高清滚动字数限制
                var titleLen = RenderParam.platformType == 'sd' ? 8 : 12;
                htm += '<div class="item-wrap" data-id="' + t.hospital_id + '" id="focus-' + i + '">' +
                    '<img class="item-img620092" src="' + RenderParam.fsUrl + t.img_url + '">' +
                    '<div id="p-' + i + '"data-title="' + t.hospital_name + '">' + '</div>' +
                    '</div>';
            });
        } else {
            cutData.forEach(function (t, i) {
                // 标/高清滚动字数限制
                var titleLen = RenderParam.platformType == 'sd' ? 8 : 12;
                htm += '<div class="item-wrap" data-id="' + t.hospital_id + '" id="focus-' + i + '">' +
                    '<img class="item-img" src="' + RenderParam.fsUrl + t.img_url + '">' +
                    '<div id="p-' + i + '" class="item-p" data-title="' + t.hospital_name + '">' + LMEPG.Func.substrByOmit(t.hospital_name, titleLen) + '</div>' +
                    '</div>';
            });
        }

        G('list-wrapper').innerHTML = htm;
        G('page-count').innerHTML = this.page + '/' + this.maxPage;
        this.toggleArrow();
    },
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
    prevList: function (btn) {
        if (this.page == 1) return;
        this.page--;
        this.renderList();
        btn == 'page-prev' ? LMEPG.BM.requestFocus('page-prev') : LMEPG.BM.requestFocus('focus-5');
    },
    onClickSetMoveUpId: function (btn) {
        // 当前页面个数小于4个
        if (Hosp.cutDataLength < 4) {
            btn.nextFocusUp = 'focus-0';
        } else {
            btn.nextFocusUp = 'focus-3';
        }
    },
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
            pEl.innerHTML = LMEPG.Func.substrByOmit(textW, titleLen)
        }
    },
    nextList: function (btn) {
        if (this.page == this.maxPage) return;
        this.page++;
        this.renderList();
        btn == 'page-next' ? LMEPG.BM.requestFocus('page-next') : LMEPG.BM.requestFocus('focus-0');
    },
    toggleArrow: function () {
        H('icon-prev');
        H('icon-next');
        this.page > 1 && S('icon-prev');
        this.page < this.maxPage && S('icon-next');
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
        objCurrent.setParam('isExitApp', RenderParam.isExitApp);
        return objCurrent;
    },
    clickItem: function (btn) {
        var curr = Hosp.getCurPageObj();
        var cutLen = btn.id.slice(btn.id.length - 1);
        var addr = null;
        // 最后一页且点击的是最后一个列表焦点跳转到更多医院界面
        if (RenderParam.isRunOnAndroid !== "1" && Hosp.page == Hosp.maxPage && cutLen == Hosp.cutDataLength - 1) {
            addr = LMEPG.Intent.createIntent('moreHospitalStatic');
        } else {
            addr = LMEPG.Intent.createIntent('areaListStatic');
        }
        addr.setParam('dataId', G(btn.id).getAttribute('data-id'));
        LMEPG.Intent.jump(addr, curr);
    },
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
    createButtons: function () {
        var Nc = 6;
        while (Nc--) {
            this.buttons.push({
                id: 'focus-' + Nc,
                type: 'div',
                name: '视频列表焦点',
                nextFocusUp: 'focus-' + (Nc - 3),
                nextFocusDown: Nc < 3 ? 'focus-' + (Nc + 3) : 'page-first',
                nextFocusLeft: 'focus-' + (Nc - 1),
                nextFocusRight: 'focus-' + (Nc + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V16/hosp_f.png',
                beforeMoveChange: this.beforeMoveItem,
                focusChange: this.onFocusSetMoveDownId,
                click: this.clickItem
            });
        }
        this.buttons.push({
            id: 'page-first',
            type: 'img',
            name: '首页按钮',
            nextFocusUp: 'focus-3',
            nextFocusRight: 'page-prev',
            backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V16/first_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/Channel/V16/first_page_f.png',
            focusChange: this.onClickSetMoveUpId,
            click: this.clickActionBtn
        }, {
            id: 'page-prev',
            type: 'img',
            name: '上一个按钮',
            nextFocusUp: 'focus-3',
            nextFocusLeft: 'page-first',
            nextFocusRight: 'page-next',
            backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V16/prev_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/Channel/V16/prev_page_f.png',
            focusChange: this.onClickSetMoveUpId,
            click: this.clickActionBtn
        }, {
            id: 'page-next',
            type: 'img',
            name: '下一个按钮',
            nextFocusUp: 'focus-3',
            nextFocusLeft: 'page-prev',
            nextFocusRight: 'page-last',
            backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V16/next_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/Channel/V16/next_page_f.png',
            focusChange: this.onClickSetMoveUpId,
            click: this.clickActionBtn
        }, {
            id: 'page-last',
            type: 'img',
            name: '最后一页按钮',
            nextFocusUp: 'focus-3',
            nextFocusLeft: 'page-next',
            backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V16/last_page.png',
            focusImage: g_appRootPath + '/Public/img/hd/Channel/V16/last_page_f.png',
            focusChange: this.onClickSetMoveUpId,
            click: this.clickActionBtn
        });
    }
};

function onBack() {
    if (RenderParam.isExitApp === '1') { // apk2.0平台，且需要直接退出应用，只有问诊功能模块
        if ( RenderParam.isRunOnAndroid === '1') {
            LMAndroid.JSCallAndroid.doExitApp(); // 直接退出应用
        } else {
            LMEPG.Intent.back('IPTVPortal');
        }

    } else {
        LMEPG.Intent.back();
    }
}

window.onload = function () {
    var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V16/Home/bg.png';
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
    }
    document.body.style.backgroundImage = 'url(' + bgImg + ')';

    Hosp.init();
};