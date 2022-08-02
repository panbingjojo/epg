(function (w) {
    var HomeEntryType = {
        VIDEO_VISIT_BY_DEPART: 1, //视频问诊-科室
        VIDEO_VISIT_BY_DOCTOR: 2, //视频问诊-医生
        ACTIVITYS: 3,   //活动
        HEALTH_VIDEO_BY_TYPES: 4, //健康视频分类
        HEALTH_VIDEO: 5,  //健康视频
        DEVICE_STORES: 6,//设备商城
        DEVICE_STORES_BY_ID: 7,//设备商城商品
        HOME_PAGE: 8,//首页
        VIDEO_VISIT_HOME: 9,//视频问诊
        DOCTOR_CONSULTATION_HOME: 10,//名医会诊
        MY_FIMILY_HOME: 11,//我的家
        HEALTH_VIDEO_HOME: 12,//健康视频首页
        HEALTH_VIDEO_SUBJECT: 13,//健康视频专题
        GUAHAO_HOME: 14,//预约挂号
        GUAHAO_BY_HOSP: 15,//预约挂号-医院
        USER_GUIDE: 16,//使用指南
        HEALTH_MEASURE: 17,//健康检测
        SEARCH: 18,//搜索
        EXPERT_CONSULTATION: 19,//专家约诊
        EXPERT_CONSULTATION_REMIND: 20, //专家约诊消息提醒
        THIRD_PARTY_URL: 22,            //跳转第三方应用
        MY_COLLECTION: 23, // 我的收藏
        EXPERT_INQUIRY_RECORD: 25, // 专家问诊记录
        NIGHTPHARMACY: 24, //夜间药房
        VIDEO_INQUIRY_RECORD: 28, // 视频问诊记录
        REGISTER_RECORD: 29, // 挂号记录
        DETECT_HEALTH_RECORD: 30, // 健康检测记录
        FAMILY_MEMBER: 31, // 家庭成员
        ABOUT_US: 32, // 关于我们
        ALBUM_UI: 33, // UI专辑
        HEALTH_VIDEO_SET: 34,  //视频集
        PURCHASE_DEVICE_RECORD: 38, //设备商城–购买记录
        ALBUM_GRAPHIC: 39,// 专辑 - 图文
        GRAPHIC_DETAIL: 43, // 图文
        PLAY_VIDEO_RECORD: 44, // 播放记录
        FAMILY_ARCHIVES: 45, // 家庭档案
        EPIDEMIC: 48, // 疫情模块
        ENTRY_APP: 58 //应用跳转
    };

    var currentPage = {
        switchPageType:function (type,info) {
            switch (type) {
                case 'home':
                    return currentPage.homePage(info)
            }
        },

        homePage:function (info) {
            var objCurrent = LMEPG.Intent.createIntent("home");
            objCurrent.setParam('focusId',info.id)
            objCurrent.setParam('focusIndex',info.tab)
            objCurrent.setParam('scrollDis',info.scroll)
            objCurrent.setParam('position',info.position || '')
            return objCurrent
        }
    }

    var PageEvent = {
        toBuyVIP:function (obj) {

            // --------上报局方使用模块数据 start--------
            var clickTime = new Date().getTime();
            var deltaTime = Math.round((clickTime - initTime) / 1000);
            var postData = {
                "type": 7,
                "operateResult": "应用首页",
                "stayTime":  deltaTime
            };
            LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", postData, LMEPG.emptyFunc, LMEPG.emptyFunc);
            // --------上报局方使用模块数据 end--------

            var objCurrent = currentPage.switchPageType(obj.curPage,obj.backInfo)

            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
                LMEPG.UI.showToast('您已是vip会员，不可重复订购')
                return;

            }else {

                var jumpObj = LMEPG.Intent.createIntent('orderHome');
                jumpObj.setParam("userId", RenderParam.userId);
                jumpObj.setParam("isPlaying", "0");
                jumpObj.setParam("remark", '主动订购');
                jumpObj.setParam("directPay", 1);
            }

            LMEPG.Intent.jump(jumpObj, objCurrent);
        },

        toCollect:function(obj){
            var objCurrent = currentPage.switchPageType(obj.curPage,obj.backInfo)
            var collect= LMEPG.Intent.createIntent('collect')

            LMEPG.Intent.jump(collect, objCurrent);
        },

        toSearch:function(obj){
            var objCurrent = currentPage.switchPageType(obj.curPage,obj.backInfo)
            var search= LMEPG.Intent.createIntent('search')

            LMEPG.Intent.jump(search,objCurrent);
        },

        toHistory:function(obj){
            var objCurrent = currentPage.switchPageType(obj.curPage,obj.backInfo)
            var history= LMEPG.Intent.createIntent('historyPlay')

            LMEPG.Intent.jump(history, objCurrent);
        },

        toVideoCollect:function(obj){
            LMEPG.ajax.postAPI('Album/getAlbumIdByAlias',{
                    'aliasName':JSON.parse(obj.data.parameters)[0].param
            }, function(rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);

                if (data.result == 0) {
                    var cur = currentPage.switchPageType(obj.curPage,obj.backInfo)

                    var objDst = LMEPG.Intent.createIntent('channelList');
                    objDst.setParam('subject_id', data.album_id);

                    if(obj.innerTab){
                        objDst.setParam('focusId', obj.innerTab.focusId); // 焦点
                        objDst.setParam('navPage', obj.innerTab.navPage); // 导航栏第几页
                        objDst.setParam('keepNavFocusId', obj.innerTab.keepNavFocusId); // 被选择的导航栏第几项
                        objDst.setParam('page', obj.innerTab.page); // 视频集结果列表第几页
                        objDst.setParam('navIndex', obj.innerTab.navIndex); // 当前加载数据的导航栏id
                    }

                    LMEPG.Intent.jump(objDst, cur);
                } else{
                    LMEPG.UI.showToast('获取视频集id失败!');
                }
            })
        },

        toVideo:function (obj) {
            if(typeof obj.data.ftp_url === 'string' ){
                obj.data.ftp_url = JSON.parse(obj.data.ftp_url)
            }

            var videoUrl = RenderParam.platformType === 'hd' ? obj.data.ftp_url.gq_ftp_url : obj.data.ftp_url.bq_ftp_url;
            var sourceId = obj.data.source_id

            if(obj.sourceID){
                sourceId = obj.sourceID[0].param
            }

            var videoInfo = {
                'sourceId': sourceId,
                'videoUrl': videoUrl,
                'title': obj.data.title,
                'type': obj.data.model_type,
                'userType': obj.data.user_type,
                'freeSeconds': obj.data.free_seconds,
                'entryType': 1,
                'entryTypeName': obj.curPage,
                'focusIdx':obj.id,
                'unionCode': obj.data.union_code,
                'show_status': obj.data.show_status
            };
            if (obj.data.show_status === "3") {
                LMEPG.UI.showToast('该节目已下线');
                return;
            }

            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)){
                var objHome = currentPage.switchPageType(obj.curPage,obj.backInfo)

                var objPlayer = LMEPG.Intent.createIntent('player');
                objPlayer.setParam('userId', RenderParam.userId);
                objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

                LMEPG.Intent.jump(objPlayer, objHome);
            }else {
                PageEvent.toBuyVIP()
            }
        },

        toMoreVideo:function (obj) {
            var inner_parameters = JSON.parse(obj.data.inner_parameters);
            var parameters = JSON.parse(obj.data.parameters);
            var modelName = inner_parameters.title;
            var modelType = parameters[0].param;
            var pageName = null;
            if (inner_parameters.level === '1') {
                pageName = 'channelIndex';
            } else {
                pageName = 'secondChannelIndex';
            }

            var objHome = currentPage.switchPageType(obj.curPage,obj.backInfo);
            var objDst = LMEPG.Intent.createIntent(pageName);
            objDst.setParam('modelType', modelType);
            objDst.setParam('modelName', modelName);

            if(obj.backInfo.innerTab){
                objDst.setParam('focusId', obj.backInfo.innerTab.focusId); // 焦点
                objDst.setParam('navPage', obj.backInfo.innerTab.navPage); // 导航栏第几页
                objDst.setParam('keepNavFocusId', obj.backInfo.innerTab.keepNavFocusId); // 被选择的导航栏第几项
                objDst.setParam('page', obj.backInfo.innerTab.page); // 视频集结果列表第几页
                objDst.setParam('navIndex', obj.backInfo.innerTab.navIndex); // 当前加载数据的导航栏id
            }

            LMEPG.Intent.jump(objDst, objHome);
        },

        toActivity:function (obj) {
            var objHome = currentPage.switchPageType(obj.curPage,obj.backInfo);
            var objActivity = LMEPG.Intent.createIntent('activity');
            var inner_parameters = JSON.parse(obj.data.parameters);
            objActivity.setParam('userId', RenderParam.userId);
            objActivity.setParam('activityName', inner_parameters[0].param);
            objActivity.setParam('inner', 1);
            LMEPG.Intent.jump(objActivity, objHome);
        },

        toAlbum:function (obj) {
            if(obj.data.parameters){
                var tempData = JSON.parse(obj.data.parameters)
                obj.data.alias_name = tempData[0].param
            }
            var objHome = currentPage.switchPageType(obj.curPage,obj.backInfo);
            var objAlbum = LMEPG.Intent.createIntent('album');
            objAlbum.setParam('userId', RenderParam.userId);
            objAlbum.setParam('albumName',obj.data.alias_name);
            objAlbum.setParam('inner', 1);

            LMEPG.Intent.jump(objAlbum, objHome);
        },

        holdPage:function () {
            var objHome =  currentPage.switchPageType('home',{tab:'0',id:'position-0',scroll:0});
            var objHold = LMEPG.Intent.createIntent('hold');
            objHold.setParam('userId', RenderParam.userId);
            LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
        },

        toPicAndWord:function(obj){
            var graphicJson = JSON.parse(obj.data.parameters);
            var graphicId = graphicJson[0]['param'];

            var objHome = currentPage.switchPageType(obj.curPage,obj.backInfo);
            var objGraphic = LMEPG.Intent.createIntent("album");

            objGraphic.setParam('albumName', 'TemplateAlbum');
            objGraphic.setParam('graphicId', graphicId);

            LMEPG.Intent.jump(objGraphic, objHome);
        },

        toPartyYUrl:function(obj){
            var graphicJson = JSON.parse(obj.data.parameters);
            var graphicUrl = graphicJson[0]['param'];
            var backUrl = encodeURIComponent(window.location.href);
            graphicUrl = graphicUrl.replace('{userId}', RenderParam.accountId);
            graphicUrl = graphicUrl.replace('{carrierId}', RenderParam.accountId);
            graphicUrl = graphicUrl.replace('{backUrl}', backUrl);
            window.location.href = graphicUrl;
        },

        jumpTestPage: function () {
            // 跳转3983前 先注销小窗播放
            LMEPG.mp.destroy();

            var objHome =  currentPage.switchPageType('home',{tab:'0',id:'position-0',scroll:0});
            var objDst = LMEPG.Intent.createIntent('testEntrySet');
            objDst.setParam('userId', RenderParam.userId);
            LMEPG.Intent.jump(objDst, objHome);
        },
    }

    w.PageEvent = PageEvent
    w.HomeEntryType = HomeEntryType
})(window)
