var HelpModule = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',
    init: function () {
        this.createBtns();
        if (RenderParam.carrierId == '000051') {
            G('about-desc').src = g_appRootPath + '/Public/img/hd/Help/V16/about_' + RenderParam.carrierId + '.png';
        } else if (RenderParam.carrierId == '320092') {
            G('about-desc').src = g_appRootPath + '/Public/img/hd/Help/V16/about_' + RenderParam.carrierId + '.png';
        }
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('helpIndex');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },
    onClick: function (btn) {
        HelpModule.beClickBtnId = btn.id;
        HelpModule.count = 0;
        HelpModule.demoIframe = true;
        switch (btn.id) {
            case 'focus-0':
                Show('demo-wrap');
                HelpModule.onBeforeMoveChange();
                break;
            case 'focus-1':
                // 跳转到新手指导播放
                if (RenderParam.carrierId == '000051') {
                    LMEPG.UI.showToast("暂未开放");
                } else {
                    HelpModule.jumpIntroduceVideo();
                }
                break;
            case 'focus-2':
                Show('about-wrap');
                G('about-title').innerHTML = '关于我们';
                break;
        }
    },
    count: 0,
    maxCount: 6,
    previousImageIndex: 0,
    onBeforeMoveChange: function (key, btn) {
        var self = HelpModule;
        if (key == 'up' || key == 'down' || !G('demo-' + self.previousImageIndex)) {
            return;
        }
        LMEPG.BM.requestFocus('debug');
        Hide('demo-' + self.previousImageIndex);
        Show('demo-' + self.count);
        if (self.count == self.maxCount) {
            self.count = 0;
            Show('demo-0');
        } else {
            self.previousImageIndex = self.count++;
        }
    },

    toggleArrow: function () {
        Show('left-arrow');
        Show('right-arrow');
        this.page == 0 && Hide('left-arrow');
        this.page == this.maxPage && Hide('right-arrow');
    },
    createBtns: function () {
        var FOCUS_COUNT = 3;
        while (FOCUS_COUNT--) {
            this.buttons.push({
                id: 'focus-' + FOCUS_COUNT,
                type: 'img',
                nextFocusLeft: 'focus-' + (FOCUS_COUNT - 1),
                nextFocusRight: 'focus-' + (FOCUS_COUNT + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Help/V16/test_' + FOCUS_COUNT + '.png',
                focusImage: g_appRootPath + '/Public/img/hd/Help/V16/test_' + FOCUS_COUNT + '_f.png',
                click: this.onClick
            });
        }
        this.buttons.push({
            id: 'debug',
            name: '脚手架ID',
            type: 'others',
            click: HelpModule.onBeforeMoveChange,
            beforeMoveChange: HelpModule.onBeforeMoveChange
        });
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'focus-0', this.buttons, '', true);
    },

    /**
     * 跳转介绍视频
     */
    jumpIntroduceVideo: function () {
        var videoUrlObj = null;
        switch (RenderParam.carrierId) {
            case '000051': // 中国联通
                videoUrlObj = {
                    bq_ftp_url: 'http://202.99.114.93/88888891/16/20190903/270835916/270835916.ts',
                    gq_ftp_url: 'http://202.99.114.93/88888891/16/20190903/270835917/270835917.ts'
                };
                break;
            case '370092': // 山东电信
                videoUrlObj = {
                    bq_ftp_url: 'P_1007673',
                    gq_ftp_url: 'P_1007673'
                };
                break;
            case '320092': // 江苏电信
                videoUrlObj = {
                    bq_ftp_url: '99100000012018082010225302705578',
                    gq_ftp_url: '99100000012018082010213402704850'
                };
                break;
        }
        var videoUrl = (RenderParam.platformType == 'hd' ? videoUrlObj.gq_ftp_url : videoUrlObj.bq_ftp_url);
        var videoInfo = {
            'sourceId': '1431',
            'videoUrl': videoUrl,
            'title': '视频指南',
            'type': '4',
            'freeSeconds': '0',
            'userType': '0',
            'entryType': 1,
            'entryTypeName': '帮助',
            'focusIdx': 'focus-1',
            'unionCode': ''
        };
        this.jumpPlayVideo(videoInfo);
    },

    /**
     * 播放视频
     * @param videoInfo
     */
    jumpPlayVideo: function (videoInfo) {
        var objCurrent = this.getCurrentPage();

        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objCurrent);
    }
};
HelpModule.init();
var onBack = function () {
    if (HelpModule.demoIframe) {
        Hide('demo-wrap');
        Hide('about-wrap');
        G('about-title').innerHTML = '帮助';
        LMEPG.BM.requestFocus(HelpModule.beClickBtnId);
        HelpModule.demoIframe = false;
    } else {
        LMEPG.Intent.back();
    }
};
