/**
 * 返回
 */
function onBack() {
    LMEPG.Intent.back();
}

// var testDoc = G('test');
var returnUrl = RenderParam.returnIP + LMEPG.Intent.INTENT_BACK_URL;

/** 页面加载完成 */
/**
 * 获取播放视频的id（外键id转內键id）
 */
function getVideoId() {
    var getVideoIdParams = {
        'nns_ids': RenderParam.videoUrl,
        'nns_mode': 0,
        'nns_type': 'video'
    };
    starcorCom.transformat_keys(getVideoIdParams, function (data) {
        var videoId = data.l.il[0].id;
        LMEPG.Log.error('guizhougd player--------transformat_keys videoId:' + videoId);
        if (typeof videoId == 'undefined' || videoId == null || videoId == '') {
            LMEPG.UI.showToast('该视频没有内键ID!', 5);
            setTimeout(function () {
                LMEPG.Intent.back();
            }, 3000);
        } else {
            playVideo(videoId);
        }
    });
}

/**
 * 播放视频
 */
function playVideo(videoId) {
    isStarcInit = true;
    var params = {
        'call_mode': 'media',//调取方式 play_stream:流获取 ；media:通过媒资调用（CMS平台为starcor时才能使用媒资播放方式且video_data不能为空） 默认为play_stream
        'position': 0, //播放起点
        'is_play_continuous': 1, //是否连续播放 call_mode为media时is_play_continuous为1才生效
        'video_type': 0,
        'video_index': 0,
        'video_id': videoId,
        'video_name': RenderParam.videoTitle,
        'back_url': returnUrl
    };
    starcorCom.Player_vod(params);
}

//初始化视达科js中间件接口
starcorCom.ready(function () {
    getVideoId();
});
