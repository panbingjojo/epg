PageEvent.setCurrentPage = function () {
    var objCurrent = LMEPG.Intent.createIntent('customizeModule');

    objCurrent.setParam("focusIndex", JSON.stringify({
        id:LMEPG.BM.getCurrentButton().id,
        data:Page.nowData
    }));
    objCurrent.setParam("modelId", RenderParam.modelId);
    objCurrent.setParam("page", Page.nowPage);
    objCurrent.setParam('themePicture', Page.nowData)
    return objCurrent
}

var Page = {
    maxPage:0,
    nowPage:parseInt(RenderParam.page) || 0,
    dataList:[],
    nowData:0,
    timer:null,

    init:function () {
        try {
            var that = this;
            this.getVideoData(function () {
                that.renderContent();
                that.initButton();
                that.initBg();
                that.showArrow();
                console.log(RenderParam.focusIndex)
                if(RenderParam.focusIndex){
                    RenderParam.focusIndex = JSON.parse(RenderParam.focusIndex.replace(/(&quot;)/g, "\""))
                    if(RenderParam.focusIndex.id === 'small-v' || RenderParam.focusIndex.id === 'to-pay'){
                        Play.startPollPlay(RenderParam.focusIndex.data)
                    }
                }

                LMEPG.ButtonManager.init(RenderParam.focusIndex? RenderParam.focusIndex.id : 'item-0', [], '', true);
            })
        }catch (e) {
            document.body.innerHTML='<div style="color: red">'+e+'</div>'
        }
    },


    renderContent:function () {
        var html = '';
        var buttons = [];
        var nowData = this.dataList.slice(this.nowPage*10, this.nowPage*10+10);
        console.log(this.nowPage,888)

         for(var i=0; i< nowData.length; i++){
             html += '<div class="item" id="item-'+i+'">'+nowData[i].title+'</div>';

             buttons.push({
                 id: 'item-'+i,
                 name: '',
                 type: 'div',
                 nextFocusUp:i<2?'to-pay' : 'item-'+(i-2),
                 nextFocusDown:'item-'+(i+2),
                 nextFocusLeft:i%2 === 0?'small-v':'item-'+(i-1),
                 nextFocusRight:'item-'+(i+1),
                 focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V2/f_video_item_0.png',
                 backgroundImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V2/bg_video_item_0.png',
                 click: this.toPlayVideo,
                 focusChange:this.changeVideo,
                 beforeMoveChange: this.turnPage,
                 playData:nowData[i]

             })
         }

         G('content').innerHTML = html;
         LMEPG.BM.addButtons(buttons);
    },

    changeVideo:function(btn,hasFocus){
        if(hasFocus){
            if(Page.timer){
                clearTimeout(Page.timer)
                Page.timer = null
            }

            Page.timer = setTimeout(function () {
                Page.nowData = btn.playData
                Play.startPollPlay(btn.playData);
            },500)
        }
    },

    getVideoData:function (cb) {
        var that = this;
        LMEPG.ajax.postAPI('Video/getVideoList', {
            model_type:RenderParam.modelId

        }, function (res) {
            if(res){
                var data = JSON.parse(res);
                that.maxPage = Math.ceil(data.count / 10);
                data.list.forEach(function (item) {
                    item.ftp_url = JSON.parse(item.ftp_url)
                })
                that.dataList = data.list;
                console.log(data)
                cb();
            }
        })
    },

    toPlayVideo:function(btn){
        LMEPG.mp.destroy();
        if(btn.id === 'small-v')
            btn.playData = Page.nowData

        PageJump.jumpPlayVideo(btn.playData, RenderParam.modelId);
    },

    turnPage:function(dir,btn){
        if(dir === 'down' && Page.nowPage !== Page.maxPage -1 &&(btn.id ==='item-8' || btn.id ==='item-9')){
            Page.nowPage++
            Page.renderContent();
            Page.showArrow();
            LMEPG.BM.requestFocus('item-0');
            return false

        }else if(dir === 'up' && Page.nowPage!==0 && (btn.id ==='item-0' || btn.id ==='item-1')){
            Page.nowPage--
            Page.renderContent();
            Page.showArrow();
            LMEPG.BM.requestFocus('item-8');
            return false
        }

    },

    toBuyVip:function(){
        if(RenderParam.isVip == '1'){
            LMEPG.UI.showToast('您已订购！')
            return
        }
        //LMEPG.mp.destroy();
        PageJump.jumpBuyVip();
    },

    showArrow:function () {
        if(this.nowPage === 0){
            G('up').style.display = 'none';
            G('down').style.display = 'block';

        }else if(this.nowPage === this.maxPage - 1){

            G('up').style.display = 'block';
            G('down').style.display = 'none';
        }else {

            G('up').style.display = 'block';
            G('down').style.display = 'block';
        }
    },

    initBg:function(){
        document.body.style.backgroundImage = "url("+ RenderParam.fsUrl + RenderParam.moduleConfig.bg_img.gq_img_url+")";
    },

    initButton:function () {
        LMEPG.BM.addButtons([{
            id: 'to-pay',
            name: '',
            type: 'div',
            nextFocusDown:'item-0',
            nextFocusLeft:'small-v',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V2/f_order.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V2/bg_order.png',
            click: Page.toBuyVip,
            focusChange: '',
            beforeMoveChange: ''
        },{
            id: 'small-v',
            name: '',
            type: 'img',
            nextFocusUp:'to-pay',
            nextFocusRight:'item-0',
            focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V2/f_small_video.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V2/bg_small_video.png',
            click: Page.toPlayVideo,
            focusChange: '',
            beforeMoveChange: ''

        }])
    }
}

var Play = {
    currPollVideoId: 0,     //当前轮播id
    /**启动小窗播放*/
    startPollPlay: function (item) {

        // 避免多次调用
        var globalPath = RenderParam;
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();

        var videoUrl = Play.getCurrentPollVideoUrl(item); //播放地址
        var playVideoUrl = LMEPG.Func.http2rtsp(videoUrl);
        var param = {
            carrierId: globalPath.carrierId,
            videoUrl: playVideoUrl ,
            playerScreenId: 'iframe_small_screen',
            platformType: globalPath.platformType,
            playerUrl: globalPath.thirdPlayerUrl
        };
        if (globalPath.platformType == 'hd') {
            switch (globalPath.stbModel) {
                case '':
                case 'E900V21D': // 区分盒子传递位置参数
                    param.position = {top: 240, left: 90, width: 430, height: 240}; // 按比例420/235，不按比例有黑边
                    break;
                default:
                    param.position = {top: 240, left: 90, width: 430, height: 240};
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
    getCurrentPollVideoUrl: function (item) {
        return item.ftp_url.gq_ftp_url;
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

LMEPG.KeyEventManager.addKeyEvent({
    EVENT_MEDIA_END: Page.nowData!== 0?Play.startPollPlay(Page.nowData):'',	         //视频播放结束
});

function onBack() {
    LMEPG.Intent.back()
}
