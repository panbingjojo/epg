var Test = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',
    data: [
        {id: 1232, name: '血糖', src: g_appRootPath + '/Public/img/hd/HealthTest/V16/test_0.png'},
        {id: 1232, name: '尿酸', src: g_appRootPath + '/Public/img/hd/HealthTest/V16/test_1.png'},
        {id: 1232, name: '胆固醇', src: g_appRootPath + '/Public/img/hd/HealthTest/V16/test_2.png'}
    ],
    init: function () {
        /**
         * 起始页数为零
         * 数据最后一个除以条数再向下取整得到最大页数
         * @type {number}
         */
        this.maxPage = Math.floor((this.data.length - 1) / 3);
        this.render();
        this.createBtns();
    },
    setPage: function (count) {
        var page = this.page * count;
        this.currentData = this.data.slice(page, page + count);
    },
    render: function () {
        this.setPage(3);
        var htm = '';
        for (var i = 0; i < this.currentData.length; i++) {
            var t = this.currentData[i];
            htm += '<img id="focus-' + i + '" src="' + t.src + '">';
        }
        G('list-wrapper').innerHTML = htm;
        this.toggleArrow();
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('testIndex');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },
    onClick: function (btn) {
        Test.beClickBtnId = btn.id;
        var curPage = Test.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('imeiInput');
        var id = parseInt(btn.id.substr(6));
        var testType;
        if (id == 0) testType = 3;
        else if (id == 1) testType = 2;
        else if (id == 2) testType = 1;
        dstPage.setParam('testType', testType); // 检测类型：1-胆固醇 2-尿酸 3-血糖
        LMEPG.Intent.jump(dstPage, curPage);
    },

    onBeforeMoveChange: function (key, btn) {
        switch (true) {
            case key == 'left' && btn.id == 'focus-0':
                Test.prevPage();
                return false;
            case key == 'right' && btn.id == 'focus-2':
                Test.nextPage();
                return false;
        }
    },
    prevPage: function () {
        if (this.page == 0) {
            return;
        }
        Math.max(0, this.page -= 1);
        this.render();
        LMEPG.ButtonManager.requestFocus('focus-2');
    },
    nextPage: function () {
        if (this.page == this.maxPage) {
            return;
        }
        Math.min(this.maxPage, this.page += 1);
        this.render();
        LMEPG.ButtonManager.requestFocus('focus-0');
    },
    toggleArrow: function () {
        S('left-arrow');
        S('right-arrow');
        this.page == 0 && H('left-arrow');
        this.page == this.maxPage && H('right-arrow');
    },
    createBtns: function () {
        var FOCUS_COUNT = 3;
        while (FOCUS_COUNT--) {
            this.buttons.push({
                id: 'focus-' + FOCUS_COUNT,
                type: 'div',
                nextFocusLeft: 'focus-' + (FOCUS_COUNT - 1),
                nextFocusRight: 'focus-' + (FOCUS_COUNT + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                // focusImage: RenderParam.platformType === 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V16/test_f.png' : g_appRootPath + '/Public/img/hd/HealthTest/V16/test_f.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/test_f.png',
                click: this.onClick,
                beforeMoveChange: this.onBeforeMoveChange
            });
        }
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'focus-0', this.buttons, '', true);
    }
};

var onBack = function () {
    LMEPG.Intent.back();
};