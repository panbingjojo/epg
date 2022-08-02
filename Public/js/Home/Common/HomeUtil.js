// +----------------------------------------------------------------------
// | MoFang-EPG-LWS
// +----------------------------------------------------------------------
// | 首页几个导航页里公用的方法抽取封装在此文件。
// |
// | ~切记：在每个HomeTab.html中优先引入该HomeUtil.js文件！
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/11/8 9:05
// +----------------------------------------------------------------------

(function (w) {

    /**
     * 是否显示vip
     */
    w.isShowVip = function (info) {
        if (RenderParam.carrierId == '520092') {
            // 贵州电信统一屏蔽
            return false;
        }
        if (RenderParam.isVip == 1) {
            return false;
        } else if (info.userType == 2 || info.userType == '2') {
            return true;
        } else if (info.user_type == 2 || info.user_type == '2') {
            return true;
        } else {
            return false;
        }
    },

        /**
         * 更新角标
         * @param info 视频信息
         * @param id 更新角标的元素id
         */
        w.updateVipIcon = function (info, id) {
            if (isShowVip(info)) {
                Show(id);
            } else {
                Hide(id);
            }
        };

    /**
     * 更新角标
     * @param info 视频信息
     * @param id 更新角标的元素id
     */
    w.updateCornerMark = function (info, id) {
        if (info) {
            var type = info.type;
            if (type === -1) {
                Hide(id);
            } else {
                G(id).src = addFsUrl(info.img_url);
                Show(id);
            }
        } else {
            Hide(id);
        }
    };

    /**
     * 校验视频是否允许播放
     * @param videoInfo
     */
    w.isAllowPlay = function (videoInfo) {
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            // vip用户可以观看
            return true;
        }

        if (videoInfo.userType == 0 || videoInfo.userType == 1) {
            // 视频允许免费用户观看
            return true;
        }

        if (parseInt(videoInfo.freeSeconds) > 0) {
            // 视频有免费观看时长
            return true;
        }

        return false;
    };

    /**
     *  添加fs地址
     * @param url
     * @returns {*}
     */
    w.addFsUrl = function (url) {
        return RenderParam.fsUrl + url;
    };

    /**
     * 得到推荐位数据通过位置
     * @param position
     */
    w.getRecommendDataByPosition = function (position) {
        var dataList = RenderParam.pageInfo.data;
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            if (data.position == position) {
                return data;
            }
        }
        return null;
    };

})(window);