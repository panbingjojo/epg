// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 芒果TV（第三方）库js封装
// +----------------------------------------------------------------------
// | 说明：
// |    1、为避免业务模块需要，每个地方都要引入相关的多个文件，且该模块有变动时
// | 各个业务模块亦同步更改。为减轻此负担，内部统一引入相关文件即可。仅提供外部
// | 业务模块一个入口js文件，即当前js文件即可！
// |
// | 注意：
// |    1、由于服务器配置可能存在多级目录，为保证真实的资源路径（__ROOT__）：
// | 请引入该js文件前务必先引入lmcommon.js，因需要g_appRootPath。
// |    2、新添加代码，若有需要请局部格式化结构，切勿全局格式化（以保证关键代码
// | 结构化）。
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2020/3/5
// +----------------------------------------------------------------------

//********************* [统一引入核心库] *********************//
var buttons = [];
var videoList = RenderParam.albumDetail.data.video_list;
var videoimg = 1;
var cutNum = 4;
var pageNum = 1;
var MenuList ={
    INDEX: 1,
    MAX_SIZE: 4,
    CURRENT_PAGE: parseInt(RenderParam.pages),
    CURRENT_DATA: "",
    defaultFocusId: RenderParam.focusIndex,
    initButton: function () {
        buttons.length = 0;
        MenuList.MAX_SIZE = videoList.length;
        for (var i = 1; i < MenuList.MAX_SIZE + 1; i++) {
            buttons.push(
                {
                    id: "video_list_" + i+ '_bg',
                    name: '区域焦点',
                    type: 'img',
                    nextFocusUp: '',
                    nextFocusDown: '',
                    nextFocusLeft: 'video_list_' + (i - 1)+ '_bg',
                    nextFocusRight: 'video_list_' + (i + 1)+ '_bg',
                    focusChange: MenuList.areaFocus,
                    click: MenuList.onClick,
                    beforeMoveChange: MenuList.switchPage,
                    cPosition: i, //位置编号
                }
            )
        }
    },

    createVideoList: function (page) {
        var dom = G("video_list");
        dom.innerHTML = "";
        //var pageNum = MenuList.cut(data, pageCurrent - 1, this.count);
        var strHtml = "";
        var postData = {
            'userId': RenderParam.userId
        };
        //从搜索框进入视频，使用推荐视频
        if(RenderParam.albumDetail.data.video_list.length > 0){
            videoList = RenderParam.albumDetail.data.video_list;
        }else {
            if(videoList.length == 0){
                LMEPG.ajax.postAPI('Player/getRecommendVideoInfo', postData, function (rsp){
                    videoList = rsp.data;
                    MenuList.createVideoList();
                    MenuList.initButton();
                    LMEPG.BM.init('video_list_1_bg', buttons, true);
                    G('video_list').style.display = "block";
                    return;
                },function (rsp) {
                    return;
                    // 请求出错
                });
            }
        }

        var start = 0;//数组截取起始位置
        var end = 100;//数组截取终止位置
        var videoArr = videoList.slice(start, end);
        if(videoArr.length == 0){
            return;
        }
        var leftImg = "'" + g_appRootPath + "/Public/img/hd/Player/V7/left_arrow.png" + "'";
        var rightImg = "'" + g_appRootPath + "/Public/img/hd/Player/V7/right_arrow.png" + "'";

        for (var i = 0; i < videoArr.length; i++){
            if(RenderParam.sourceId == videoArr[i].source_id){
                videoimg = i;
                break;
            }
        }

        strHtml += '<div style="position: absolute;left: 100px;color: #fffefe;">| 选集</div>';

        strHtml += '<div id="video_left" class="video_list_block" style="position: relative; width: 50px; margin-right: 90px;margin-left: 95px;display: inline-block;text-align: center;vertical-align: middle;margin-bottom: 100px;"> ';
        strHtml += '<img id="video_left_bg" class="video_list_img" src="__ROOT__/Public/img/{$platformType}/Player/V7/left_arrow.png" onerror="this.src=' + leftImg + '" /> ';
        strHtml += '</div>';

        for (var i = 0; i < videoArr.length; i++) {
            if (videoimg < 4){
                if(i<4){
                    strHtml += MenuList.addHtml(true,i,videoArr);
                }else
                {
                    strHtml += MenuList.addHtml(false,i,videoArr);
                }
            } else if(videoimg + 4 >= videoArr.length){
                if(videoimg + 4 == videoArr.length){
                    if(i >= videoimg){
                        strHtml += MenuList.addHtml(true,i,videoArr);
                    }else{
                        strHtml += MenuList.addHtml(false,i,videoArr);
                    }
                }else {
                    if(videoArr.length -1 -i < 4){
                        strHtml += MenuList.addHtml(true,i,videoArr);
                    }else{
                        strHtml += MenuList.addHtml(false,i,videoArr);
                    }
                }

            }else{
                if (i >= videoimg && i <= videoimg+3){
                    strHtml += MenuList.addHtml(true,i,videoArr);
                }else{
                    strHtml += MenuList.addHtml(false,i,videoArr);
                }
            }

        }

        strHtml += '<div id="video_right" class="video_list_block" style="position: relative; width: 50px; margin-left: 75px;display: inline-block;text-align: center;vertical-align: middle;margin-bottom: 100px;"> ';
        strHtml += '<img id="video_right_bg" class="video_list_img"  src="__ROOT__/Public/img/{$platformType}/Player/V7/right_arrow.png" onerror="this.src=' + rightImg + '" /> ';
        strHtml += '</div>';

        dom.innerHTML = strHtml;
        if(videoimg == 0){
            G('video_left_bg').style.display = "none";
        }
        if(videoArr.length == videoimg + 1 && videoArr.length > 4){
            G('video_right_bg').style.display = "none";
        }
    },

    addFsUrl: function(path) {
        return RenderParam.imgHost + path;
    },

    addHtml: function(bool,i,videoArr) {
        var defaultImg = "'" + g_appRootPath + "/Public/img/hd/Home/V10/default.png" + "'";
        var strHtml = "";
        if(bool){
            strHtml += '<div id="video_list_' + (i + 1) + '" class="video_list_block" style="position: relative;width: 200px;height: 140px;margin-top: 35px;margin-left: 5px;display: inline-block;"> ';
            strHtml += '<img id="video_list_' + (i + 1) + '_bg" class="video_list_img" style="width: 90%" src="' + MenuList.addFsUrl(videoArr[i].image_url) + '" onerror="this.src=' + defaultImg + '" /> ';
            strHtml += '</div>';
        }else{
            strHtml += '<div id="video_list_' + (i + 1) + '" class="video_list_block" style="position: relative;width: 200px;height: 140px;margin-top: 35px;margin-left: 5px; display: none;"> ';
            strHtml += '<img id="video_list_' + (i + 1) + '_bg" class="video_list_img" style="width: 90%" src="' + MenuList.addFsUrl(videoArr[i].image_url) + '" onerror="this.src=' + defaultImg + '" /> ';
            strHtml += '</div>';
        }
        return strHtml;
    },

    areaFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "select_video_list");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "select_video_list");
        }
    },
    // 推荐位点击
    onClick: function (btn) {
        if (LMEPG.Func.isExist(videoList)) {
            var index = (pageNum - 1) * cutNum + btn.cPosition-1;
            if (index < videoList.length) {
                var data =  videoList[index];
                // 视频播放
                var videoObj = data.ftp_url instanceof Object ? data.ftp_url : JSON.parse(data.ftp_url);
                var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
                // 创建视频信息
                var videoInfo = {
                    "sourceId": data.source_id,
                    "videoUrl": encodeURIComponent(videoUrl),
                    "title": data.title,
                    "type": videoList[btn.cPosition -1].model_type,//RenderParam.albumDetail.data.subject_list[0].model_type,
                    "userType": data.user_type,
                    "freeSeconds": data.free_seconds,
                    "entryType": 13,
                    "entryTypeName": "视频专辑",
                    "unionCode": data.union_code,
                    "show_status": data.show_status
                };
                //视频专辑下线处理
                if(videoInfo.show_status == "3") {
                    LMEPG.UI.showToast('该节目已下线');
                    return;
                }
                if (isAllowPlay(videoInfo)) {
                    MenuList.jumpPlayVideo(videoInfo);
                } else {
                    MenuList.jumpBuyVip(videoInfo.title, videoInfo);
                }
            }
        }
    },

    // 推荐位按键移动
    switchPage: function (dir, current) {
        switch (dir) {
            case 'left':
                if(current.cPosition > 4){
                    MenuList.moveLeft(current.cPosition);
                }
                if(current.cPosition == 2){
                    G('video_left_bg').style.display = "none";
                }
                if(current.cPosition <= videoList.length ){
                    G('video_right_bg').style.display = "inline-block";
                }
                MenuList.moveLeftOne(current);
                break;
            case 'right':
                if(current.cPosition >= 4 && videoList.length > current.cPosition){
                    G('video_list_'+(current.cPosition-3)).style.display = "none";
                    G('video_list_'+(current.cPosition+1)).style.display = "inline-block";
                }
                if(current.cPosition + 1 == videoList.length ){
                    G('video_right_bg').style.display = "none";
                }
                if(current.cPosition >= 1){
                    G('video_left_bg').style.display = "inline-block";
                }
                break;
            case 'down':
                break;
            case 'up':
                break;
        }
    },
    preMenu: function () {
        if (pageCurrent > 1) {
            pageCurrent--;
            Nav.createPagination(videoList);
            LMEPG.BM._buttons = {};
            LMEPG.ButtonManager.init("pagination-8", buttons, "", true);
        } else {
        }
    },

    moveLeftOne: function (current){
        var video_list = 'video_list_'+(current.cPosition+3);
        var s=document.getElementById(video_list);
        if(document.getElementById('video_list_'+(current.cPosition+3)) && document.getElementById('video_list_'+(current.cPosition-1))){
            if(G(video_list).style.display ==  'inline-block' && G('video_list_'+(current.cPosition-1)).style.display ==  'none'){
                G('video_list_'+(current.cPosition+3)).style.display =  "none";
                G('video_list_'+(current.cPosition-1)).style.display =  "inline-block";
            }
        }
    },

    moveLeft: function (cPosition) {
        if( cPosition == videoList.length || cPosition == videoList.length-1 || cPosition == videoList.length-2){
            return;
        }

        if (G('video_list_'+(cPosition+3)).style.display=="inline-block"){
            G('video_list_'+(cPosition-1)).style.display = "inline-block";
            G('video_list_'+(cPosition+3)).style.display = "none";
        }else if (G('video_list_'+(cPosition+2)).style.display=="inline-block"){
            G('video_list_'+(cPosition-2)).style.display = "inline-block";
            G('video_list_'+(cPosition+2)).style.display = "none";
        }else if (G('video_list_'+(cPosition+1)).style.display=="inline-block"){
            G('video_list_'+(cPosition-3)).style.display = "inline-block";
            G('video_list_'+(cPosition+1)).style.display = "none";
        }else{
            G('video_list_'+(cPosition-4)).style.display = "inline-block";
            G('video_list_'+(cPosition)).style.display = "none";
        }
        if(cPosition == 5){
            G('video_list_'+(cPosition+3)).style.display = "none";
            G('video_list_'+(cPosition+2)).style.display = "none";
            G('video_list_'+(cPosition+1)).style.display = "none";
            G('video_list_'+(cPosition)).style.display = "none";
            G('video_list_'+(cPosition-1)).style.display = "inline-block";
            G('video_list_'+(cPosition-2)).style.display = "inline-block";
            G('video_list_'+(cPosition-3)).style.display = "inline-block";
            G('video_list_'+(cPosition-4)).style.display = "inline-block";
        }
    },

    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        var objcurrent = MenuList.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));
        if(RenderParam.albumDetail.data.video_list.length > 0){
            objPlayer.setParam("subjectId", RenderParam.albumDetail.data.subject_list[0].subject_id);
        }
        LMEPG.Intent.jump(objPlayer, objcurrent);
    },

    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("PlayerVideoSet");
        currentPage.setParam("modeType", "");
        currentPage.setParam("modeTitle", "");
        currentPage.setParam("focusIndex", LMEPG.ButtonManager.getCurrentButton().id);
        currentPage.setParam("pageCurrent", pageNum);
        return currentPage;
    },

    /**
     * 跳转 -- 订购页
     * @param remark        订购来源（标示）
     * @param videoInfo     如果视频正在播放，播放视频的信息。
     * @param singlePayItem 是否是单订购
     */
    jumpBuyVip: function (remark, videoInfo, singlePayItem) {
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }
        var objcurrent = MenuList.getCurrentPage();

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("remark", remark);
        objOrderHome.setParam("isPlaying", 1);
        objOrderHome.setParam("singlePayItem", typeof (singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objcurrent);
    },

}

 function onBack() {
       if(G("video_list").style.display=="block"){
           G("video_list").style.display="none";
           mgTVPlay.init();
           LMEPG.BM.init('', []);
           LMEPG.KeyEventManager.addKeyEvent({
               KEY_DOWN: 'onKeyDown()'
           });
       }else {
           //回到活动界面
           LMEPG.Intent.back();
       }
   }
