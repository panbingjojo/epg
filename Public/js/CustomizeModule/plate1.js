var Page = {
    hasSmallVideo: true,

    /**
     * 初始化
     */
    init: function () {
        this.setPageSize();
        this.renderHome();
        LMEPG.ButtonManager.init(RenderParam.focusIndex, Page.buttons, '', true);
        LMEPG.BM.requestFocus(RenderParam.focusIndex||"video-TV");
    },

    renderHome: function () {
        document.body.style.background = "url(" + RenderParam.fsUrl + RenderParam.moduleConfig.bg_img.bq_img_url + ")";
        document.body.style.backgroundRepeat = "no-repeat";

        var list = RenderParam.moduleConfig.entry_list;
        var getImg = Page.getImg;
        var item = '';
        var pos = '';
        var posData = '';
        var id = '';
        var listP = [];// entry_list对象里的P1-P6
        var tab0Data = [11, 12, 13, 14, 15, 16]; // TODO “推荐”模块后台配置位置的position


        for (var key in list) {
            listP.push(list[key]);
        }

        for (var i = 0; i < listP.length; i++) {
            item = listP[i];
            pos = parseInt(item.position);
            posData = item.item_data;

            switch (pos) {
                case 11:
                       id = 'free-area'; // 免费专区1
                       break;
                   case 12:
                       id = 'link-0'; // 小窗位置2
                       break;
                   case 13:
                       id = 'link-1'; // 热门位置3
                       break;
                   case 14:
                       id = 'link-2';
                       break;
                   case 15:
                       id = 'link-3'; // 继续观看下面位置5
                       break;
                   case 16:
                       id = ''; //
                       Page.bottom_htm(posData);
                       break;
               }
               if (id && tab0Data.indexOf(pos) > -1) G(id).src = getImg(JSON.parse(posData[0].img_url).normal);
           }
    },

    bottom_htm: function (bottomData) {
        var htm_bom = '';
        for (var k = 0; k < bottomData.length; k++) {
            htm_bom += '<div><img src="' + Page.getImg(JSON.parse(bottomData[k].img_url).normal) + '" id="b-link-' + k + '"></div>';
        }
        G('second-content-row').innerHTML = htm_bom;
    },

    /**
     * 重新设置分辨率，河南有盒子会出现页面放大情况，原因是高清盒子使用了标清页面
     */
    setPageSize: function () {
        var meta = document.getElementsByTagName('meta');
        //LMEPG.Log.error("task::setPageSize ---> meta" + meta);
        if (typeof meta !== "undefined") {
            try {
                if (RenderParam.platformType == "hd") {
                    meta["page-view-size"].setAttribute('content', "1280*720");
                } else {
                    meta["page-view-size"].setAttribute('content', "640*530");
                }
            } catch (e) {

            }
        }
    },
    /**
     * 获取完整路径图片地址
     */
    getImg: function (relativeUrl) {
        return relativeUrl ? RenderParam.fsUrl + relativeUrl : '';
    },

    onFocusIn: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.setAttribute('class', 'focus');
        } else {
            btnElement.removeAttribute('class');
        }
    },

    bottomBtnOnfocus: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.className = 'focus';
        } else {
            btnElement.className = '';
        }
    },
};

PageEvent.setCurrentPage = function () {
    var objCurrent = LMEPG.Intent.createIntent('customizeModule');
    objCurrent.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
    objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
    objCurrent.setParam('moduleId', RenderParam.moduleConfig.module.module_id);

    return objCurrent;
}

/**
 * ===============================处理首页小窗口视频轮播===============================
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id
    /**启动小窗播放*/
    startPollPlay: function () {

        if (RenderParam.homePollVideoList.count == 0) {
            return;
        }
        // 避免多次调用
        var globalPath = RenderParam;
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();
        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        var playVideoUrl = LMEPG.Func.http2rtsp(videoUrl);
        var param = {
            carrierId: globalPath.carrierId,
            videoUrl: playVideoUrl,
            playerScreenId: 'iframe_small_screen',
            platformType: globalPath.platformType,
            playerUrl: globalPath.thirdPlayerUrl
        };
        if (globalPath.platformType == 'hd') {
            switch (globalPath.stbModel) {
                case '':
                case 'E900V21D': // 区分盒子传递位置参数
                    param.position = {top: 172, left: 70, width: 347, height: 194}; // 按比例420/235，不按比例有黑边
                    break;
                default:
                    param.position = {top: 172, left: 70, width: 347, height: 205};
                    break;
            }
        } else {
            param.position = {top: 150, left: 40, width: 149, height: 106};// 中国联通标清
        }
        LMSmallPlayer.initParam(param);
        LMSmallPlayer.startPlayVideo();
    },

    /** 处理首页轮播视频 */
    playHomePollVideo: function () {
        var data = Play.getCurrentPollVideoData();
        if (LMEPG.Func.isEmpty(data)) return;
        // 创建视频信息
        data.entryType = 1;
        data.entryTypeName = '首页轮播视频';
        var videoUrl = data.videoUrl;
        data.ftp_url = {
            gq_ftp_url: videoUrl,
            bq_ftp_url: videoUrl
        };

        PageJump.jumpPlayVideo(data);
    },
    /**得到当前轮播地址*/
    getCurrentPollVideoUrl: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId].videoUrl;
    },
    /**得到当前轮播数据对象*/
    getCurrentPollVideoData: function () {
        return RenderParam.homePollVideoList.list[Play.currPollVideoId];
    },
    /**播放过程中的事件*/
    onPlayEvent: function () {
        var self = Play;
        try {
            var videoCount = RenderParam.homePollVideoList.count;
            self.currPollVideoId = self.currPollVideoId == videoCount - 1 ? 0 : self.currPollVideoId++;
            self.startPollPlay();
        } catch (e) {
            LMEPG.UI.showToast('播放出错了[' + e.toString() + ']', 2);
            LMEPG.Log.error(e.toString());
        }
    },
    /** “音量+/-”按键 */
    onVolumeChanged: function (dir) {
        LMEPG.Log.info("onVolumeChanged --> start");
        switch (dir) {
            case "up":
                if (LMEPG.mp) {
                    // 音量增加
                    LMEPG.Log.info("onVolumeChanged --> up +++");
                    LMEPG.mp.upVolume();
                }
                break;
            case "down":
                if (LMEPG.mp) {
                    // 音量减小
                    LMEPG.Log.info("onVolumeChanged --> down ---");
                    LMEPG.mp.downVolume();
                }
                break;
        }
    },
};

/**
 * 退出应用大厅控制对象，后期抽到独立的文件进行单独控制
 * @type {{exitApp4QINGHAI: ExitApplication.exitApp4QINGHAI}}
 */
var ExitApplication = {
    /** 青海电信返回局方大厅逻辑 */
    exitApp4QINGHAI:function () {
        if(RenderParam.fromLaunch == 1){ // 卓影平台退出局方大厅
            Utility.setValueByName("exitIptvApp");
        }else { // 正常返回逻辑
            LMEPG.Intent.back('IPTVPortal');
        }
    }
}

var onBack = htmlBack = function () {
   // 目前暂时跳转返回局方大厅，如果后期有需要，根据启动页传递参数inner，来判断是否返回局方大厅还是应用首页
   if (RenderParam.carrierId === '630092') {
       ExitApplication.exitApp4QINGHAI();
   }
};

Page.buttons= [
    {
        id: 'video-TV',
        name: '小窗视频',
        type: 'img',
        nextFocusRight: 'link-1',
        nextFocusUp: 'tab-0',
        nextFocusDown: 'free-area',
        backgroundImage: '/Public/img/Common/spacer.gif',
        focusImage: '/Public/img/hd/CustomizeModule/video_f.png',
        click: PageEvent.click,
        focusChange: Page.onFocusIn,
        cPosition: 12,
        cIndex:0
    }, {
        id: 'free-area',
        name: '免费专区',
        type: 'img',
        nextFocusRight:'link-1',
        nextFocusUp: 'video-TV',
        nextFocusDown: 'b-link-0',
        click: PageEvent.click,
        focusChange: Page.onFocusIn,
        cPosition: 11,
        cIndex:0
    }, {
        id: 'link-1',
        name: '推荐位1',
        type: 'img',
        nextFocusLeft: 'video-TV',
        nextFocusRight: 'link-2',
        nextFocusUp: 'tab-0',
        nextFocusDown: 'b-link-2',
        click: PageEvent.click,
        focusChange: Page.onFocusIn,
        cPosition: 13,
        cIndex:0
    }, {
        id: 'link-2',
        name: '推荐为2（由轮播映射）',
        type: 'others',
        nextFocusLeft: RenderParam.carrierId == "440004" ? 'video-TV' : 'link-1',
        nextFocusRight: 'link-3',
        nextFocusUp: 'tab-0',
        nextFocusDown: 'b-link-3',
        click: PageEvent.click,
        focusChange: Page.onFocusIn,
        cPosition: 14,
        cIndex:0
    },
    {
        id: 'link-3',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'link-2',
        nextFocusUp: '',
        nextFocusDown: 'b-link-4',
        click: PageEvent.click,
        focusChange: Page.onFocusIn,
        cPosition: 15,
        cIndex:0
    }, {
        id: 'b-link-0',
        name: '第一个功能区',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'b-link-1',
        nextFocusUp: 'free-area',
        click: PageEvent.click,
        focusChange:  Page.bottomBtnOnfocus,
        cPosition: 16,
        cIndex:0
    }, {
        id: 'b-link-1',
        name: '第二个功能区',
        type: 'img',
        nextFocusLeft: 'b-link-0',
        nextFocusRight: 'b-link-2',
        nextFocusUp: 'free-area',
        click: PageEvent.click,
        focusChange: Page.bottomBtnOnfocus,
        cPosition: 16,
        cIndex:1
    }, {
        id: 'b-link-2',
        name: '第三个功能区',
        type: 'img',
        nextFocusLeft: 'b-link-1',
        nextFocusRight: 'b-link-3',
        nextFocusUp: 'link-2',
        nextFocusDown: '',
        click: PageEvent.click,
        focusChange: Page.bottomBtnOnfocus,
        cPosition: 16,
        cIndex:2
    }, {
        id: 'b-link-3',
        name: '第四个功能区',
        type: 'img',
        nextFocusLeft: 'b-link-2',
        nextFocusRight: 'b-link-4',
        nextFocusUp: 'link-2',
        click: PageEvent.click,
        focusChange: Page.bottomBtnOnfocus,
        cPosition: 16,
        cIndex:3
    }, {
        id: 'b-link-4',
        name: '第五个功能区',
        type: 'img',
        nextFocusLeft: 'b-link-3',
        nextFocusRight: '',
        nextFocusUp: 'link-3',
        click: PageEvent.click,
        focusChange: Page.bottomBtnOnfocus,
        cPosition: 16,
        cIndex:4
    }]

window.onunload = function () {
    LMEPG.mp.destroy();  //释放播放器
};


