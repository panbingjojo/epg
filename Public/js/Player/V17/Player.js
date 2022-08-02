/**
 * 宁夏广电EPG 播放
 */
(function (ott, fn) {
    var Player = {};
    if (Object.prototype.toString.call(ott) !== '[object Object]') throw new Error('播放器依赖组件类型不正确~');
    Player = fn(ott);
    // Object.assign(opt, Player); // ECMASript5
    window.OTTPlayer = Player;

}(ottService, function (ott) {

    return {
        init: function () {
            this.savePlayerProgress(JSON.stringify(RenderParam.videoInfo));
            this.saveVideoSetProgress(JSON.stringify(RenderParam.videoInfo));

            this.playVod(RenderParam.videoUrl);

            this.logInfo();
        },

        logInfo: function () {
            LMEPG.Log.info('ott.getSystemInfo==>', JSON.stringify(ott.getSystemInfo()));
            LMEPG.Log.info('ott.getSystemInfo==>', JSON.stringify(ott));
        },

        /**
         * 跳转到单剧集点播播放页面
         * @param code 视频码
         */
        playVod: function (code) {
            // code: 视频码
            if (!code || code.length == 0) {
                alert('请输入要播放的视频code');
                return;
            }
            ott.playVod(code);
        },

        /**
         * 视频集播放
         * @param seriesCode 连续剧剧头code
         * @param episodeCode 连续剧剧集code（不填表示从最后观看的那集或第一集开始播放（系列剧，指最新一期））
         * @param contentType 多剧集类型（series 电视剧；series2 综艺，系列剧）
         */
        playSeries: function (seriesCode, episodeCode, contentType) {
            if (seriesCode == null || seriesCode.length == 0) {
                alert('请输入要播放的多剧集code');
                return;
            }
            if (contentType != 'series' && contentType != 'series2') {
                alert('请正确输入要播放的多剧集类型');
                return;
            }
            ott.playSeries(seriesCode, episodeCode, contentType);
        },

        /**
         * 跳转到单剧集联播播放页面
         * @param code 单剧集视频码
         * @param categoryCode 编排了多个单视频
         */
        categoryPlay: function (code, categoryCode) {
            ott.playVods(code, categoryCode);
        },

        /**
         * 打开窗口点播节目播放
         * @param channelCode 频道
         * @param startTime 开始时间
         * @param endTime 结束时间
         */
        playSchedule: function (channelCode, startTime, endTime) {
            ott.playSchedule(channelCode, startTime, endTime);
        },

        /**
         * 停止小窗口播放
         */
        stopTrailer: function () {
            ott.stopTrailer();
        },

        /**
         * 保存用户播放进度
         */
        savePlayerProgress: function (value, callback) {
            var postData = {
                "key": "EPG-LWS-LATEST-VIDEOINFO-" + RenderParam.carrierId + "-" + RenderParam.userId,
                "value": value
            };
            LMEPG.ajax.postAPI('Activity/saveStoreData', postData, function (rsp) {
                console.log(rsp);
                if (callback)
                    callback();
            });
        },

        /**
         * 保存用户视频集播放进度
         */
        saveVideoSetProgress: function (value) {
            if (!LMEPG.Func.isEmpty(RenderParam.subjectId)) {
                var postData = {
                    "key": "EPG-LWS-LATEST-VIDEOINFO-VIDEOSET-" + RenderParam.subjectId + '-' + RenderParam.carrierId + "-" + RenderParam.userId,
                    "value": value
                };
                LMEPG.ajax.postAPI('Activity/saveStoreData', postData, function (rsp) {
                    console.log(rsp);
                });
            }
        },

    };
}));
