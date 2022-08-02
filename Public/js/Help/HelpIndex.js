/**
 * 帮助模块js逻辑应用
 */
var HelpModule = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',
    modelDif: ["450092", "420092", "410092"],
    count: 0,
    init: function () {
        this.createBtns();
        if (RenderParam.carrierId == '000051') {
            G('about-desc').src = g_appRootPath + '/Public/img/hd/Help/V13/about_' + RenderParam.carrierId + '.png';
        } else if (RenderParam.carrierId == '320092'
            || RenderParam.carrierId == '500092') {
            G('about-desc').src = g_appRootPath + '/Public/img/hd/Help/V13/about_' + RenderParam.carrierId + '.png';
        } else if (RenderParam.carrierId === '450092') {
            delNode('demo-4');
            delNode('demo-5');
        }
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('helpIndex');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },
    onClick: function (btn) {
        HelpModule.beClickBtnId = btn.id;
        // HelpModule.count = 0;
        HelpModule.demoIframe = true;
        switch (btn.id) {
            case 'focus-0':
                Show('demo-wrap');
                HelpModule.onBeforeMoveChange();
                break;
            case 'focus-1': // 视频介绍
                var noIntroduceVideoCarriers = ['000709', '000051'];
                var hasIntroduceVideo = noIntroduceVideoCarriers.includes(RenderParam.carrierId) < 0;
                if(hasIntroduceVideo) {
                    HelpModule.jumpIntroduceVideo();
                }else {
                    LMEPG.UI.showToast("暂未开放");
                }
                break;
            case 'focus-2':
                Show('about-wrap');
                G('about-title').innerHTML = '关于我们';
                break;
        }
    },

    /**
     * 简化 EPG 翻页
     * 2020.4.23
     * .-../.-/.../---/-.-./../---.-..-/-/---.-..-/--.-/..-/../.-/---.-.
     * .-/-/---.-..-/...-/../.-./---.-..-/./.-../.-/...-/./../.-../.-.././.-.-.-
     * @param key
     * @param btn
     */
    onBeforeMoveChange: function (key, btn) {
        var that = HelpModule;
        var count = that.count;

        if (key === 'up' || key === 'down') return;

        // 初始化渲染参数
        if (!key) {
            Show('demo-0');
            Hide('demo-' + that.maxCount);
            // this.count = 0;
            this.maxCount = HelpModule.modelDif.indexOf(RenderParam.carrierId) != -1 ? 3 : 5; // 最大的张数
            LMEPG.BM.requestFocus('debug'); // 焦点依附到脚手架上面
        } else {
            // 切换帮助图片
            Hide('demo-' + count);
            that.count = count = key === 'left' ? Math.max(0, --count) : Math.min(that.maxCount, ++count);
            Show('demo-' + count);
        }
        // 箭头指示
        count === 0 ? Hide('left-arrow') : Show('left-arrow');
        count === that.maxCount ? Hide('right-arrow') : Show('right-arrow');
    },

    createBtns: function () {
        if (RenderParam.carrierId == '650092' || RenderParam.carrierId == '640094' || RenderParam.carrierId == '450092'|| RenderParam.carrierId == '620092' || RenderParam.carrierId == '410092'|| RenderParam.carrierId == '420092') { // 宁夏广电暂时隐藏视频介绍
            this.buttons.push({
                id: 'focus-0',
                type: 'img',
                nextFocusLeft: 'focus-2',
                nextFocusRight: 'focus-2',
                backgroundImage: g_appRootPath + '/Public/img/hd/Help/V13/test_0.png',
                focusImage: g_appRootPath + '/Public/img/hd/Help/V13/test_0_f.png',
                click: this.onClick
            });
            this.buttons.push({
                id: 'focus-2',
                type: 'img',
                nextFocusLeft: 'focus-0',
                nextFocusRight: 'focus-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/Help/V13/test_2.png',
                focusImage: g_appRootPath + '/Public/img/hd/Help/V13/test_2_f.png',
                click: this.onClick
            });
        } else {
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
