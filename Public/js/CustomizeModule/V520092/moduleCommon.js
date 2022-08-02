var  moduleCommon ={
    EntryType:{
        "HEALTH_VIDEO_BY_TYPES": 4, //健康视频分类
        "HEALTH_VIDEO": 5,  //视频
        "HEALTH_VIDEO_SET": 34,  //视频集
    },
    ModuleId:{
        "JKSH": 'JKSH', //健康生活
        "JKYD": 'JKYD', //健康运动
        "JKYS": 'JKYS', //健康影视
        "JKZS": 'JKZS', //健康知识
    },
    /**
     * 通过url获取焦点ID，没有返回Null
     */
    getFocusIdFromUrl:function (){
        return  /&{0,1}focusId=\d{0,2}-\d{0,2}/gi.test(window.location.search) ? moduleCommon.getUrlKValueByKey("focusId") : null;
    },

    /**
     * 获取url搜索值
     * @param key
     * @returns {null}
     */
    getUrlKValueByKey:function (key){
        var list = window.location.search.split("&");
        for (var i = 0; i < list.length; i++) {
            if(/.{0,1}focusId=/gi.test(list[i])){
                return  list[i].split("=")[1]
            }
        }
        return null;
    },
    /**
     * 获取当前页
     */
    getCurPageObj: function (moduleId) {
        var objCurrent = LMEPG.Intent.createIntent('customizeModule');
        objCurrent.setParam('moduleId', moduleId);
        objCurrent.setParam('focusId', Page.data.currentFocus);
        return objCurrent;
    },
    /**
     * 跳转播放器
     */
    jumpPlayVideo: function (moduleId,data) {
        var videoData = data.inner_parameters;
        if (typeof videoData == 'string') {
            videoData = JSON.parse(videoData);
        }
        // 创建视频信息
        var videoInfo = {
            "sourceId": JSON.parse(data.parameters)[0].param,
            'videoUrl': encodeURIComponent(videoData.ftp_url.gq_ftp_url),
            'title': videoData.title,
            'type': videoData.model_type,
            'userType': videoData.user_type,
            'freeSeconds': videoData.free_seconds,
            'duration': videoData.duration,
            'entryType': 1,
            'entryTypeName': 'home',
            'unionCode': videoData.union_code,
        };

        var objCurrent =  moduleCommon.getCurPageObj(moduleId);
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    /**
     * 跳转视频列表
     */
    jumpVideoList: function (moduleId,data) {
        var videoParams = data.inner_parameters;
        if (typeof videoParams == 'string') videoParams = JSON.parse(videoParams);
        var objCurrent = moduleCommon.getCurPageObj(moduleId);
        var more = LMEPG.Intent.createIntent('channelIndex');
        more.setParam('modelType',  JSON.parse(data.parameters)[0].param);
        more.setParam('modelName', videoParams.title)
        LMEPG.Intent.jump(more, objCurrent);
    },

    /**
     * 跳转视频集
     */
    jumpVideoSet: function (moduleId,data) {
        var objCurrent = moduleCommon.getCurPageObj(moduleId);
        var more = LMEPG.Intent.createIntent('channelList');
        more.setParam('subject_id', JSON.parse(data.parameters)[0].param);

        LMEPG.Intent.jump(more, objCurrent);
    },
}
