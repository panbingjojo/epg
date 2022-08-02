(function (w) {
    // 推荐位入口类型
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
        HEALTH_SELF_TEST: 40, // 健康自测
        GRAPHIC_DETAIL: 43, // 图文
        GRAPHIC_CLASS: 42,              // 图文栏目
        PLAY_VIDEO_RECORD: 44, // 播放记录
        FAMILY_ARCHIVES: 45, // 家庭档案
        EPIDEMIC: 48, // 疫情模块
        SELF_TEST_CLASSIFY: 51,
        PACKET_HEALTH_LIVE: 55, //山东电信 健康生活小包模块
        PACKET_CHANNEL_OLD: 56, //山东电信 中老年健康-小包视频模块
        PACKET_CHANNEL_BABY: 57  //山东电信 宝贝天地-小包视频模块
    };

    function getPositionData(position) {
        var dataList = RenderParam.homeConfigInfo.data.entry_list;

        for (var i = 0; i < dataList.length; i++) {
            if (dataList[i].position == position) {
                return dataList[i];
            }
        }

        return null;
    }

     function getAlbumIdByAlias(aliasName, callback) {
        LMEPG.UI.showWaitingDialog();

        var reqData = {
            'aliasName': aliasName
        };

        LMEPG.ajax.postAPI('Album/getAlbumIdByAlias', reqData, function (rsp) {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.result == 0) {
                callback(data.album_id);
            } else {
                LMEPG.UI.showToast('获取视频集id失败!');
            }
            LMEPG.UI.dismissWaitingDialog();
        })
    }

    function clickSwitch(item) {
        switch (parseInt(item.entry_type)) {

            case HomeEntryType.ACTIVITYS:
                PageJump.jumpActivityPage(JSON.parse(item.parameters)[0].param);
                break;

            case HomeEntryType.HEALTH_VIDEO_BY_TYPES: // 更多视频
                PageJump.jumpHealthVideoHome(item);
                break;

            case HomeEntryType.HEALTH_VIDEO:
                // 视频播放
                PageJump.jumpPlayVideo(item);
                break;

            case HomeEntryType.VIDEO_VISIT_HOME: // 视频问诊
                PageJump.jumpVideoVisitHome();
                break;

            case HomeEntryType.HEALTH_VIDEO_SUBJECT:
            case HomeEntryType.ALBUM_UI:
            case HomeEntryType.ALBUM_GRAPHIC:
                PageJump.jumpAlbumPage(JSON.parse(item.parameters)[0].param);
                break;

            case HomeEntryType.GUAHAO_HOME: // 挂号主页
                PageJump.jumpGuaHaoPage();
                break;

            case HomeEntryType. HEALTH_SELF_TEST: // 健康自测
                PageJump.jumpMofangPlugin();
                break;

            case HomeEntryType.NIGHTPHARMACY: // 夜间药房
                PageJump.jumpNightpharmacy();
                break;

            case HomeEntryType.HEALTH_MEASURE: // 健康检测
                PageJump.jumpHealthMeasure();
                break;

            case HomeEntryType.EXPERT_CONSULTATION: //专家约诊
                if (RenderParam.platformType == 'sd') {
                    LMEPG.UI.showToast('不支持的盒子类型！', 1.5);
                    return;
                }
                PageJump.jumpExpertConsultation();
                break;

            case HomeEntryType.HEALTH_VIDEO_SET:  //视频集
                getAlbumIdByAlias(JSON.parse(item.parameters)[0].param, function (subject_id) {
                    PageJump.jumpVideoListPage(subject_id);
                });
                break;

            case HomeEntryType.MY_COLLECTION:
                PageJump.jumpCommon('collect');
                break;

            case HomeEntryType.EXPERT_INQUIRY_RECORD:
                if (RenderParam.platformType == 'sd') {
                    LMEPG.UI.showToast('不支持的盒子类型！', 1.5);
                    return;
                }
                PageJump.jumpCommon('expertRecordHome');
                break;

            case HomeEntryType.FAMILY_ARCHIVES:
            case HomeEntryType.FAMILY_MEMBER:
                PageJump.jumpCommon('familyEdit');
                break;

            case HomeEntryType.PLAY_VIDEO_RECORD:
                PageJump.jumpCommon('historyPlay');
                break;

            case HomeEntryType.GRAPHIC_DETAIL:
                var graphicJson = JSON.parse(item.parameters);
                var graphicId = graphicJson[0]['param'];
                PageJump.jumpGraphicDetail(graphicId);
                break;

            case HomeEntryType.THIRD_PARTY_URL: //跳转第三方网页
                PageJump.jumpThirdPartyUrl(JSON.parse(item.parameters)[0].param);
                break;

            case HomeEntryType.EPIDEMIC: //跳转第三方网页
                PageJump.jumpEpidemic();
                break;

            case HomeEntryType.PACKET_HEALTH_LIVE: //跳转健康生活
                PageJump.jumpPacketHealth();
                break;

            case HomeEntryType.PACKET_CHANNEL_OLD: //跳转小包视频 中老年健康、宝贝天地
            case HomeEntryType.PACKET_CHANNEL_BABY:
                PageJump.jumpPacketChannel(item.entry_type);
                break;

            case HomeEntryType.DEVICE_STORES:  //设备商城
                PageJump.jumpDeviceStore();
                break;

            case HomeEntryType.GRAPHIC_CLASS:
                PageJump.jumpGraphicColumn(item);
                break

            case HomeEntryType.SELF_TEST_CLASSIFY:
                PageJump.jumpTest(item);
                break

            case HomeEntryType.ABOUT_OURS: // 关于我们 -- 待完成，需要跳转帮助页面再显示关于我们
            case HomeEntryType.PURCHASE_DEVICE_RECORD:
            case HomeEntryType.DEVICE_STORES_BY_ID:  //设备商城商品
            case HomeEntryType.HOME_PAGE:  //首页
            case HomeEntryType.REGISTER_RECORD: // 挂号记录 -- 待完成
            case HomeEntryType.DETECT_HEALTH_RECORD: // 健康检测记录 -- 待完成，需要家庭成员
            case HomeEntryType.EXPERT_CONSULTATION_REMIND: //专家约诊消息提醒
            case HomeEntryType.SEARCH:  //搜索

            case HomeEntryType.VIDEO_VISIT_BY_DOCTOR:  //视频问诊-医生
            case HomeEntryType.VIDEO_VISIT_BY_DEPART:  //视频问诊-科室
            case HomeEntryType.GUAHAO_BY_HOSP: //挂号-医院
            case HomeEntryType.USER_GUIDE: //用户指南
            case HomeEntryType.VIDEO_INQUIRY_RECORD: // 视频问医记录 -- 待完成，需要家庭成员

            default:
                LMEPG.UI.showToast('未配置的跳转类型!');
                break;
        }
    }

    var PageJump = {
        /** 通用页面跳转方法 */
        jumpCommon: function (router) {
            router = typeof router === 'object'? router.page:router
            LMEPG.Intent.jump(LMEPG.Intent.createIntent(router), PageEvent.setCurrentPage());
        },

        /**跳转购买vip页面*/
        jumpBuyVip: function () {
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
                LMEPG.UI.showToast('您已是vip会员，不可重复订购')
                return
            }

            var objCurrent = PageEvent.setCurrentPage();
            var jumpObj = LMEPG.Intent.createIntent('orderHome');
            jumpObj.setParam("userId", RenderParam.userId);
            jumpObj.setParam("isPlaying", "0");
            jumpObj.setParam("remark", '主动订购');

            LMEPG.Intent.jump(jumpObj, objCurrent);
        },

        /**跳转 - 播放器*/
        jumpPlayVideo: function (itemData) {
            var nameTemp = itemData && itemData.inner_parameters;
            if (nameTemp === "") {
                LMEPG.UI.showToast('播放该视频数据丢失或未配置！', 2);
                return;
            }
            // 视频播放

            var videoData = nameTemp instanceof Object ? nameTemp : JSON.parse(nameTemp);
            var videoUrl = RenderParam.platformType == "hd" ? videoData.ftp_url.gq_ftp_url : videoData.ftp_url.bq_ftp_url;
            var sourceId = JSON.parse(itemData.parameters)[0].param;

            // 创建视频信息
            var videoInfo = {
                'sourceId': sourceId,
                'videoUrl': videoUrl,
                'title': videoData.title,
                'type': videoData.model_type,
                'userType': videoData.user_type,
                'freeSeconds': videoData.free_seconds,
                'entryType': 1,
                'entryTypeName': 'home',
                'unionCode': videoData.union_code,
                'show_status': videoData.showStatus,
            };

            if (videoInfo.show_status == '3') {
                LMEPG.UI.showToast('该内容不存在，请选择其它内容');
                return;
            }

            if (LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
                LMEPG.UI.showToast('视频信息为空！');
                return;
            }

            // 更多视频，按分类进入
            objHome = PageEvent.setCurrentPage()
            objPlayer = LMEPG.Intent.createIntent('player');
            objPlayer.setParam('userId', RenderParam.userId);
            objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                LMEPG.Intent.jump(objPlayer, objHome);
            } else {
                PageJump.jumpBuyVip();
            }
        },

        /**跳转->专家约诊首页*/
        jumpExpertConsultation: function () {
            var objCurrent =PageEvent.setCurrentPage();
            var jumpObj = LMEPG.Intent.createIntent('expertIndex');
            LMEPG.Intent.jump(jumpObj, objCurrent);
        },

        /**
         * 跳转 -- 活动页面
         * @param activityName
         */
        jumpActivityPage: function (activityName) {
            var objHome = PageEvent.setCurrentPage();
            var objActivity = LMEPG.Intent.createIntent('activity');
            objActivity.setParam('userId', RenderParam.userId);
            objActivity.setParam('activityName', activityName);
            objActivity.setParam('inner', 1);
            LMEPG.Intent.jump(objActivity, objHome);
        },

        /**跳转->视频问诊*/
        jumpVideoVisitHome: function () {
            var objCurrent = PageEvent.setCurrentPage();
            var jumpObj = LMEPG.Intent.createIntent('doctorIndex');
            LMEPG.Intent.jump(jumpObj, objCurrent);
        },

        /**
         * 疫情模块接口
         */
        jumpEpidemic: function () {
            var objHome = PageEvent.setCurrentPage();

            var objEpidemic = LMEPG.Intent.createIntent('report-index');
            objEpidemic.setParam("userId", RenderParam.userId);
            LMEPG.Intent.jump(objEpidemic, objHome);
        },

        /**
         * 跳转 -- 专辑页面
         * @param albumName
         */
        jumpAlbumPage: function (albumName) {
            var objHome = PageEvent.setCurrentPage();
            var objAlbum = LMEPG.Intent.createIntent('album');
            objHome.setParam('albumName', albumName);
            objAlbum.setParam('userId', RenderParam.userId);
            objAlbum.setParam('albumName', albumName);
            objAlbum.setParam('inner', 1);
            LMEPG.Intent.jump(objAlbum, objHome);
        },

        /**跳转->健康检测*/
        jumpHealthMeasure: function () {
            var objSrc = PageEvent.setCurrentPage();
            var objDst = LMEPG.Intent.createIntent('testIndex');
            LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
        },

        /**跳转继续播放*/
        jumpContinuePlay: function () {
            if (RenderParam.latestVideoInfo.result == 0) {
                LMEPG.UI.showToast('已为您继续播放', 1, function () {
                    var videoInfo = JSON.parse(RenderParam.latestVideoInfo.val);
                    PageJump.jumpPlayVideo(videoInfo);
                });
            } else {
                LMEPG.UI.showToast('无未播放完的视频');
            }
        },

        /**跳转 - 挽留页*/
        jumpHoldPage: function () {
            var objHome = PageEvent.setCurrentPage();
            objHome.setParam("fromId", "1");
            var objHold = LMEPG.Intent.createIntent('hold');
            objHold.setParam('userId', RenderParam.userId);
            LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
        },

        /**跳转到3983测试页*/
        jumpTestPage: function () {
            var objHome = PageEvent.setCurrentPage();
            var objDst = LMEPG.Intent.createIntent('testEntrySet');
            objDst.setParam('userId', RenderParam.userId);
            LMEPG.Intent.jump(objDst, objHome);
        },

        /**跳转到视频集*/
        jumpVideoListPage: function (subjectId) {
            var objHome = PageEvent.setCurrentPage();
            var objDst = LMEPG.Intent.createIntent('channelList');
            objDst.setParam('subject_id', subjectId);
            LMEPG.Intent.jump(objDst, objHome);
        },

        /**跳转 -- 预约挂号*/
        jumpGuaHaoPage: function () {
            var objCurrent = PageEvent.setCurrentPage();
            var objGuaHao = LMEPG.Intent.createIntent("appointmentRegister");
            objGuaHao.setParam("focusIndex", "");

            LMEPG.Intent.jump(objGuaHao, objCurrent);
        },

        jumpMofangPlugin: function () {
            LMEPG.ApkMofang.func.launch();
        },

        /**跳转 -- 夜间药房*/
        jumpNightpharmacy: function () {
            var objCurrent = PageEvent.setCurrentPage();
            objCurrent.setParam("userId", RenderParam.userId);
            objCurrent.setParam("fromId", "1");
            objCurrent.setParam("page", "0");

            var objCollect = LMEPG.Intent.createIntent("nightMedicine");
            objCollect.setParam("userId", RenderParam.userId);

            LMEPG.Intent.jump(objCollect, objCurrent);
        },

        /**跳转 -- 一级视频/二级视频*/
        jumpMoreVideos: function (itemData) {
            var inner_parameters = JSON.parse(itemData.inner_parameters);
            var parameters = JSON.parse(itemData.parameters);
            var modelName = inner_parameters.title;
            var modelType = parameters[0].param;
            var objHome = PageEvent.setCurrentPage();
            var pageName;
            if (inner_parameters.level == 1) {
                pageName = 'channelIndex';
            } else {
                pageName = 'secondChannelIndex';
            }
            var objDst = LMEPG.Intent.createIntent(pageName);
            objDst.setParam('modelType', modelType);
            objDst.setParam('modelName', modelName);
            LMEPG.Intent.jump(objDst, objHome);
        },

        /**
         * 跳转 -- 更多视频页
         */
        jumpHealthVideoHome: function (itemData) {
            var innerParams = JSON.parse(itemData.inner_parameters);
            var params = JSON.parse(itemData.parameters);
            var modeTitle = innerParams.title;
            var modeType = params[0].param;

            var objHome = PageEvent.setCurrentPage();
            objHome.setParam("userId", RenderParam.userId);
            objHome.setParam("fromId", "2");

            var objChannel = LMEPG.Intent.createIntent("healthVideoList");
            objChannel.setParam("userId", RenderParam.userId);
            objChannel.setParam("page", typeof (page) === "undefined" ? "1" : page);
            objChannel.setParam("modeTitle", modeTitle);
            objChannel.setParam("modelType", modeType);
            LMEPG.Intent.jump(objChannel, objHome);
        },

        jumpMenuPage: function () {
            var objCurrent = PageEvent.setCurrentPage();

            var objHomeTab = LMEPG.Intent.createIntent("menuTab");
            objHomeTab.setParam("userId", RenderParam.userId);

            LMEPG.Intent.jump(objHomeTab, objCurrent);
        },

        /**
         * 跳转 -- 图文详情
         * @param graphicId 图文ID
         */
        jumpGraphicDetail: function (graphicId) {
            var objHome = PageEvent.setCurrentPage();

            var objGraphic = LMEPG.Intent.createIntent("album");
            objGraphic.setParam('albumName', 'TemplateAlbum');
            objGraphic.setParam('graphicId', graphicId);

            LMEPG.Intent.jump(objGraphic, objHome);
        },

        /**
         * 跳转第三方网页
         * @param url 网页地址
         */
        jumpThirdPartyUrl: function (url) {
            window.location.href = url;
        },

        jumpPacketHealth: function () {
            //山东电信 跳转健康生活
            var objHome = PageEvent.setCurrentPage();

            objDst = LMEPG.Intent.createIntent('healthLive');
            objDst.setParam('userId', RenderParam.userId);
            objDst.setParam('inner', 1);
            LMEPG.Intent.jump(objDst, objHome);
        },

        //设备商城跳转
        jumpDeviceStore: function () {
            var objHome = PageEvent.setCurrentPage();

            var objDst = LMEPG.Intent.createIntent('payOnline');
            LMEPG.Intent.jump(objDst, objHome);
        },

        jumpGraphicColumn:function (item) {
            var classifyJson = JSON.parse(item.parameters);
            var classifyId = classifyJson[0]['param'];
            var objCurrent = PageEvent.setCurrentPage();

            objCurrent.setParam("userId", RenderParam.userId);
            objCurrent.setParam("fromId", "1");
            objCurrent.setParam("page", "0");

            var objGraphicClass = LMEPG.Intent.createIntent("graphicColumn");
            objGraphicClass.setParam('modelType', classifyId);
            LMEPG.Intent.jump(objGraphicClass, objCurrent);
        },
        jumpTest:function (item) {
            var classifyId = JSON.parse(item.parameters)[0].param
            var objSrc = PageEvent.setCurrentPage();
            var objDst = LMEPG.Intent.createIntent('selfTestList');
            objDst.setParam('currentClassId', is_empty(classifyId) ? -1 : classifyId);
            LMEPG.Intent.jump(objDst, objSrc);
        }
    };

    w.PageEvent ={
        click: function (opt) {
            var item = getPositionData(opt.cPosition)
            var itemData = (item && item.item_data && item.item_data[opt.cIndex])  || '';
            clickSwitch(itemData)
        },

        setCurrentPage:function () {}
    }
    w.PageJump = PageJump
})(window)