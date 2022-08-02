var HelpIntroduce = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',
    init: function () {
        this.createBtns();
    },
    getCurrentPage: function () {
        return LMEPG.Intent.createIntent('testIndex');
    },
    onClick: function (btn) {
        HelpIntroduce.beClickBtnId = btn.id;
        var curPage = HelpIntroduce.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('imeiInput');
        dstPage.setParam('testType', parseInt(btn.id.substr(6)) + 1); // 检测类型：1-胆固醇 2-尿酸 3-血糖
        LMEPG.Intent.jump(dstPage, curPage);
    },
    prevGuideIndex: 0,
    toggleGuide: function () {
        var _this = HelpIntroduce;
        H('focus-' + _this.prevGuideIndex);
        var currentGuideIndex = Math.min(5, _this.prevGuideIndex += 1);
        _this.prevGuideIndex = currentGuideIndex;
        S('focus-' + currentGuideIndex);
    },
    createBtns: function () {
        var FOCUS_COUNT = 3;
        while (FOCUS_COUNT--) {
            this.buttons.push({
                id: 'focus-' + FOCUS_COUNT,
                type: 'img',
                nextFocusLeft: 'focus-' + (FOCUS_COUNT - 1),
                nextFocusRight: 'focus-' + (FOCUS_COUNT + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Help/V13/test_' + FOCUS_COUNT + '.png',
                focusImage: g_appRootPath + '/Public/img/hd/Help/V13/test_' + FOCUS_COUNT + '_f.png',
                click: this.onClick
            });
        }
        LMEPG.ButtonManager.init('focus-0', this.buttons, '', true);
    }
};

var onBack = function () {
    LMEPG.Intent.back();
};
