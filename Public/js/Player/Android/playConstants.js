(function (w) {
    //播放器全局参数
    w.PlayConstans = {

        videoStart: (function () {
            var VIDEO_OPERATE_START_BASE = 10000;
            return {
                //开始播放回调消息类型
                VIDEO_OPERATE_START_BASE: VIDEO_OPERATE_START_BASE,
                VIDEO_START_REASON_WEB_NOTIFY: VIDEO_OPERATE_START_BASE + 1,// 网页通知开始
            }
        })(),

        videoPause: (function () {
            var VIDEO_OPERATE_PAUSE_BASE = 20000;
            return {
                //暂停播放回调消息类型
                VIDEO_OPERATE_PAUSE_BASE: VIDEO_OPERATE_PAUSE_BASE,
                VIDEO_PAUSE_REASON_WEB_NOTIFY: VIDEO_OPERATE_PAUSE_BASE + 1,// 网页通知暂停
                VIDEO_PAUSE_REASON_USER_DO: VIDEO_OPERATE_PAUSE_BASE + 2,   // 用户点击暂停
            }
        })(),

        videoResume: (function () {
            var VIDEO_OPERATE_RESUME_BASE = 30000;
            return {
                //继续播放回调消息类型
                VIDEO_OPERATE_RESUME_BASE: VIDEO_OPERATE_RESUME_BASE,
                VIDEO_RESUME_REASON_WEB_NOTIFY: VIDEO_OPERATE_RESUME_BASE + 1,// 网页通知续播
                VIDEO_RESUME_REASON_USER_DO: VIDEO_OPERATE_RESUME_BASE + 2,   // 用户点击续播
            }
        })(),

        videoFinish: (function () {
            var VIDEO_OPERATE_FINISH_BASE = 40000;
            return {
                //暂停播放回调消息类型
                VIDEO_OPERATE_FINISH_BASE: VIDEO_OPERATE_FINISH_BASE,
                VIDEO_FINISH_REASON_WEB_NOTIFY: VIDEO_OPERATE_FINISH_BASE + 1,                          // 网页通知结束
                VIDEO_FINISH_REASON_ERROR: VIDEO_OPERATE_FINISH_BASE + 2,                               // 视频出错结束
                VIDEO_FINISH_REASON_BAD_NET: VIDEO_OPERATE_FINISH_BASE + 3,                             // 网络不通结束
                VIDEO_FINISH_REASON_USER_RETURN: VIDEO_OPERATE_FINISH_BASE + 4,                         // 用户返回结束
                VIDEO_FINISH_REASON_PLAY_COMPLETE: VIDEO_OPERATE_FINISH_BASE + 5,                       // 播放完成结束
                VIDEO_FINISH_REASON_ARRIVE_FREE_TIME: VIDEO_OPERATE_FINISH_BASE + 6,                    // 免费时间到结束
                VIDEO_FINISH_REASON_BUY_VIP: VIDEO_OPERATE_FINISH_BASE + 7,                             // 免费时间到结束
                VIDEO_FINISH_REASON_UP_DOWN: VIDEO_OPERATE_FINISH_BASE + 8,                             // 在播放界面点击上下键结束
                VIDEO_FINISH_REASON_AUDIT_FAILED: VIDEO_OPERATE_FINISH_BASE + 9,                        // 审核平台不通过（例如：审核平台方已下线）
                VIDEO_FINISH_REASON_TIME_OUT: VIDEO_OPERATE_FINISH_BASE + 10,                           // 播放超时
                VIDEO_FINISH_REASON_ERROR_OTHERS: VIDEO_OPERATE_FINISH_BASE + 11,                       // 其它出错（例如：暂不支持对应播放器！）
            }
        })(),
    };

    //第三方协作
    w.PlayThirdParty = {

        /**-
         * Web控制选择播放器类型（主要用于拥有集成第三方播放器情况下方可有效，才有切换选择权：默认使用LongMaster(我方)自定义Ijk播放器）
         *
         * 播放器SDK选值约定：
         *      101-LongMaster(我方)自定义Ijk播放器
         *      102-IcntvPlayer（未来TV）集成播放器
         *      注：默认未定义-继续使用LongMaster(我方)自定义Ijk播放器
         *      ... 更多详见PlayerDispatcher$TVPlayerSDKType
         * @author Songhui
         */
        TVPlayerSDKType: {
            SDK_lmIjk: 101,            //LongMaster(我方)自定义Ijk播放器
            SDK_weilaiTV: 102,         //IcntvPlayer（未来TV）集成播放器
            SDK_nanchuanTV: 103,         //（南方传媒TV）集成播放器
        },
        /**
         * 当使用我方自定义的Ijk播放器时，在视频播放参数中添加 "ijkType"来指定使用的ijk播放器实现方式
         */
        IjkPlayerType:{
            /**
             * Ijk播放器,使用PopupWindow方式实现，该方式在Android 9.0盒子上有问题。
             * 默认值，当使用我方自定义播放器时，未设置"ijkType"来指定实现方式，则使用该方式。
             */
            TYPE_POPUP_WINDOW:0,
            /**
             * Ijk播放器，使用addView的方式，将播放器添加到Activity中。
             * 当某地区需要适配Android 9.0盒子，且播放器有问题时，可指定使用该播放器实现方式。
             */
            TYPE_ADD_VIEW:1
        },
        // 未来电视播控相关
        WeilaiTV: (function () {
            return {
                /**
                 * 获取ProgramId（节目ID）：该值为cws后台（规则）定义，用于推送未来的审核内容唯一值。同时，用于Android端IcntvPlayerSDK播放，必须！！！
                 * @param videoId [string] 注入视频id
                 * @param carrierId [string] 地区码
                 */
                getProgramId: function (videoId, carrierId) {
                    return "hv_" + videoId + "_" + carrierId; // CWS后台向未来推送审核节目id格式："hv_$videoId_$carrierId"
                },
            };
        })(),
    };
})(window);

