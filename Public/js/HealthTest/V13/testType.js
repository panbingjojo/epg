var typeAccept = null;

switch (RenderParam.carrierId) {
    case '10220094':
        typeAccept = [
            {id: 5, name: '血压', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_0.png'},
            {id: 6, name: '体脂', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_1.png'},
            {id: 1, name: '血糖', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_2.png'},
        ];
        break;
    case '440004':
        typeAccept = [
            {id: 5, name: '血压', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_0.png'},
            {id: 6, name: '体脂', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_1.png'},
            {id: 1, name: '血糖', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_2.png'},
            {id: 4, name: '尿酸', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_3.png'},
            {id: 2, name: '胆固醇', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_4.png'},
        ];

    case '10000051':
        typeAccept = [
            {id: 5, name: '血压', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_0.png'},
            {id: 6, name: '体脂', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_1.png'},
            {id: 1, name: '血糖', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_2.png'},
            {id: 4, name: '尿酸', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_3.png'},
            {id: 2, name: '胆固醇', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_4.png'},
        ];
        break;
    default:
        typeAccept = [
            {id: 5, name: '血压', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_0.png'},
            {id: 6, name: '体脂', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_1.png'},
            {id: 1, name: '血糖', src: g_appRootPath + '/Public/img/hd/HealthTest/V13/test_2.png'},
        ];
        break;
}

var Test = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',
    data: typeAccept,
    init: function () {
        // 起始页数为零,数据最后一个除以条数再向下取整得到最大页数
        this.maxPage = Math.floor((this.data.length - 1) / 3);
        this.page = RenderParam.page
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
            htm += '<img id="focus-' + i + '" src="' + t.src + '"  data-link="' + t.id + '">';
        }
        G('list-wrapper').innerHTML = htm;
        this.toggleArrow();
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('testRecord');
        objCurrent.setParam('page', Test.page);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_gender', RenderParam.member_gender);


        return objCurrent;
    },

    /**
     * 功能点击事件
     * @param btn
     */
    onClick: function (btn) {
        Test.beClickBtnId = btn.id;
        var testType = G(btn.id).getAttribute("data-link");
        Test.jumpHealthTestRecord(testType)
    },

    /**
     * 跳转健康检测记录
     */
    jumpHealthTestRecord: function (testType) {
        LMEPG.Intent.jump(Test.getDstObj(testType), Test.getCurrentPage());
    },

    /**
     * 获取目标页面信息
     * @param testType
     * @returns {*}
     */
    getDstObj: function (testType) {
        var dstObj = Test.initDstObjByTestType(testType)
        dstObj.setParam('member_id', RenderParam.member_id);
        dstObj.setParam('member_name', RenderParam.member_name);
        dstObj.setParam('member_image_id', RenderParam.member_image_id);
        dstObj.setParam('member_gender', RenderParam.member_gender);
        dstObj.setParam('testType', testType);
        return dstObj;
    },

    /**
     * 根据类型初始化目标页面实例
     */
    initDstObjByTestType: function (testType) {
        if (testType == 6) {
            return LMEPG.Intent.createIntent('weight-list');
        } else if (testType == 7) {
            return LMEPG.Intent.createIntent('wristList-wristband');
        } else {
            return LMEPG.Intent.createIntent('testList');
        }
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
                focusImage: RenderParam.platformType === 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/test_f.png' : g_appRootPath + '/Public/img/hd/HealthTest/V13/test_f.png',
                click: this.onClick,
                beforeMoveChange: this.onBeforeMoveChange,
            });
        }
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'focus-0', this.buttons, '', true);
    }
};

var onBack = function () {
    LMEPG.Intent.back();
};