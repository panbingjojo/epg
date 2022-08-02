var buttons = [];
var Data = {
    videoInfo: [
        {
            'sourceId': "8165",
            'videoUrl': "Program1000100001",
            'title': "致敬白衣战士",
            'unionCode': "qxwjj001",
        },
    ],
};
var Page = {
    defaultFocusId: "btn-box-video",
    //页面初始化操作
    init: function () {
        Page.initButtons();                 // 初始化焦点按钮
        LMEPG.BM.init(Page.defaultFocusId, buttons, "", true);
        // 启动小窗口播放
        Play.startPollPlay();
    },
    initButtons: function () {
        buttons.push({
            id: 'btn-box-video',
            name: '视频',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            focusChange: "",
            click: Page.parseVideoInfo,
        });

    },





    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("retrograde");
        return currentPage;
    },
    parseVideoInfo: function (btn) {
        var videoInfo = Data.videoInfo[0];
        var videoParams = {
            'sourceId': videoInfo.source_id,
            'videoUrl': videoInfo.videoUrl,
            'title': videoInfo.title,
            'type': 2,
            'entryType': 4,
            'entryTypeName': "",
            'userType': 0,
            'freeSeconds': 0,
            'focusIdx': LMEPG.BM.getCurrentButton().id,
            'unionCode': videoInfo.union_code
        };
        Page.playVideo(videoParams);
    },
    playVideo: function (videoParams) {
        var objCurrent = Page.getCurrentPage();
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoParams));
        LMEPG.Intent.jump(objPlayer, objCurrent);
    },


}

function onBack() {
    //回到局方
    LMEPG.Intent.back();
}