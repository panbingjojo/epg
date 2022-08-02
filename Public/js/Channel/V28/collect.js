var data = RenderParam.detail.data
var fixedUrl = RenderParam.fsUrl //'http://healthiptv-fs.langma.cn'
var prePointer = RenderParam.prePointer*1
var curPointer = RenderParam.curPointer === '0'?Math.min(8,data.video_list.length):(RenderParam.curPointer*1)
var count = 0
var hasChooseId = ''
var hasChooseNum = 'class-num-0'

var Home = {
    init:function (){
        console.log(data)
        this.renderHead()
        this.renderContent()
        this.renderClassNum()
        this.initButton()
        this.updateArrow()
    },

    renderHead:function (){
        var sub =data.subject_list[0]
        G('head-pic').src =fixedUrl+sub.image_url
        G('name').innerHTML =sub.subject_name
        G('num').innerHTML = data.video_list.length
        count = data.video_list.length
        G('simple-intro').innerHTML = sub.intro_txt || "暂无简介"
    },

    updateArrow:function(){
        G('right-arrow').style.display = curPointer+1<=count? 'block':'none'
        G('left-arrow').style.display = prePointer-8 >= 0?'block':'none'
    },

    renderContent:function (){
        var html = ''
        var button = []
        for (var i = prePointer;i<curPointer;i++){

            html+=' <div class="content-item" id="content-item-'+i+'">\n' +
                '      <img src="'+fixedUrl+data.video_list[i].image_url+'" style="width: 100%;height: 100%;border-radius: 15px">\n' +
                '   </div>'

            button.push({
                id: 'content-item-'+i,
                type: 'div',
                nextFocusLeft: 'content-item-'+(i-1),
                nextFocusRight:'content-item-'+(i+1),
                nextFocusUp: i-4 >= prePointer?'content-item-'+(i-4):'',
                nextFocusDown:(i+4 >= curPointer && i+4<Math.ceil(i/8)*8)?'content-item-'+(curPointer-1):'content-item-'+(i+4),
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Channel/V24/choose_squ.png",
                click:PageFunc.toVideo,
                focusChange: '',
                beforeMoveChange:PageFunc.turnPage,
                moveChange: "",
                cIndex:i,
                data:data.video_list[i],
                group:parseInt(i/8)
            })
        }

        LMEPG.BM.addButtons(button)
        G('main-content').innerHTML = html
    },

    renderClassNum:function (){
        var html = ''
        var group = Math.ceil(data.video_list.length / 8)
        var button = []

        for (var i=0;i<group;i++){
            html+='<div class="class-num" id="class-num-'+i+'" style="background: url('+(i===parseInt((curPointer-1) / 8)?'/Public/img/hd/Channel/V24/class_num_has_choose.png':'')+')">'+(i*8+1)+'-'+Math.min((i*8+8),data.video_list.length)+ '</div>'

            button.push({
                id: 'class-num-'+i,
                type: 'div',
                nextFocusLeft: 'class-num-'+(i-1),
                nextFocusRight:'class-num-'+(i+1),
                nextFocusUp: 'i-collect',
                nextFocusDown: '',
                backgroundImage:" " ,
                focusImage: "/Public/img/hd/Channel/V24/class_num_choose.png",
                selectedImage:"/Public/img/hd/Channel/V24/class_num_has_choose.png",
                click:'',
                focusChange: '',
                beforeMoveChange:PageFunc.toContentArea,
                moveChange: "",
                group:i,
            })
        }

        LMEPG.BM.addButtons(button)
        G('bottom').innerHTML = html
    },

    initButton:function (){
        var button = []

        button.push({
            id: 'i-collect',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight:'',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage:RenderParam.isCollect === 0?"/Public/img/hd/Channel/V24/no_collect_no_choose.png":"/Public/img/hd/Channel/V24/collect_no_choose.png",
            focusImage: RenderParam.isCollect === 0?"/Public/img/hd/Channel/V24/no_collect_choose.png":"/Public/img/hd/Channel/V24/collect_choose.png",
            click:PageFunc.collect,
            focusChange: '',
            beforeMoveChange:PageFunc.toLeaveCollect,
            moveChange: "",
        })
        LMEPG.BM.init(RenderParam.focusId || 'content-item-0',button)
    }
}


var PageFunc = {
    els :document.getElementsByClassName('class-num'),
    turnPage:function (dir,btn){
        hasChooseId = btn.id

        if(dir === 'up' && btn.cIndex+4<(btn.group+1)*8){
           setTimeout(function (){
               LMEPG.BM.requestFocus('class-num-'+btn.group)
               hasChooseNum = 'class-num-'+btn.group
           })

        }else if(dir === 'right' && (btn.cIndex+1 === prePointer+4 || btn.cIndex+1 === curPointer)&& curPointer+1<count){
            prePointer+=8
            curPointer+8<count ? curPointer+=8 : curPointer = count
            Home.updateArrow()
            for (var i = 0 ;i<PageFunc.els.length;i++){
                PageFunc.els[i].style.backgroundImage = "url()"
            }

            G('class-num-'+(btn.group+1)).style.backgroundImage = 'url("/Public/img/hd/Channel/V24/class_num_has_choose.png")'
            hasChooseNum = 'class-num-'+(btn.group+1)
            setTimeout(function (){ LMEPG.BM.requestFocus('content-item-'+prePointer)})
            Home.renderContent()
        }else if(dir === 'left' && (btn.cIndex === prePointer || btn.cIndex === prePointer+4) && prePointer-8 >= 0){
            curPointer-prePointer>=8 ? curPointer-=8 : curPointer-=curPointer-prePointer
            prePointer-=8
            Home.updateArrow()
            for (var i = 0 ;i<PageFunc.els.length;i++){
                PageFunc.els[i].style.backgroundImage = "url()"
            }

            G('class-num-'+(btn.group-1)).style.backgroundImage = 'url("/Public/img/hd/Channel/V24/class_num_has_choose.png")'
            hasChooseNum = 'class-num-'+(btn.group-1)
            setTimeout(function (){ LMEPG.BM.requestFocus('content-item-'+(curPointer-1))},50)

            Home.renderContent()
        }

    },

    toVideo:function (btn){
        console.log(btn.data)
        var player= LMEPG.Intent.createIntent('player')
        var curPage = LMEPG.Intent.createIntent('channelList')
        curPage.setParam('subject_id', data.subject_list[0].subject_id);
        curPage.setParam('focusId',btn.id)
        curPage.setParam('prePointer',prePointer)
        curPage.setParam('curPointer',curPointer)

        var ftpUrl = btn.data.ftp_url;
        var videoInfo = {
            'sourceId': btn.data.source_id,
            'videoUrl': RenderParam.platformType === 'hd' ? ftpUrl.gq_ftp_url : ftpUrl.bq_ftp_url,
            'title': btn.data.title,
            'type': RenderParam.detail.data.subject_list[0].model_type,
            'userType': btn.data.user_type,
            'freeSeconds': btn.data.free_seconds,
            'entryType': 1,
            'entryTypeName': '视频集',
            'unionCode': btn.data.union_code,
            'showStatus':btn.data.show_status
        };

        player.setParam('userId', RenderParam.userId);
        player.setParam('videoInfo',JSON.stringify(videoInfo))

        LMEPG.Intent.jump(player,curPage);

    },

    toContentArea:function(dir,btn){
        if(dir === 'down'){
            setTimeout(function (){
                if(G(hasChooseId)){
                    LMEPG.BM.requestFocus(hasChooseId)
                }else {
                    LMEPG.BM.requestFocus('content-item-'+prePointer)
                }

                G('class-num-'+btn.group).style.backgroundImage = 'url("/Public/img/hd/Channel/V24/class_num_has_choose.png")'

            },50)
        }else if(dir === 'left' && prePointer-8 >= 0){
            curPointer-prePointer>=8 ? curPointer-=8 : curPointer-=curPointer-prePointer
            prePointer-=8
            Home.updateArrow()
            hasChooseNum ='class-num-'+ (parseInt(btn.id.substr(10))-1)
            Home.renderContent()
        }else if(dir === 'right' &&  curPointer+1<count){
            prePointer+=8
            curPointer+8<count ? curPointer+=8 : curPointer = count
            Home.updateArrow()
            hasChooseNum ='class-num-'+ (parseInt(btn.id.substr(10))+1)
            Home.renderContent()
        }
    },
    toLeaveCollect:function (dir){
        if(dir ==='down'){
            setTimeout(function (){LMEPG.BM.requestFocus(hasChooseNum)})
        }
    },
    collect:function (){
        var postData = {
            "type": RenderParam.isCollect === 1 ? 1 : 0, // 类型（0收藏 1取消收藏）
            "item_type": 2, // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
            "item_id": RenderParam.detail.data.subject_list[0].subject_id // 收藏对象id
        };

        LMEPG.ajax.postAPI("Collect/setCollectStatusNew", postData, function (rsp) {

            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(collectItem.result === 0)
                if (collectItem.result === 0) {
                    if (postData.type === 0) {
                        //收藏成功
                        RenderParam.isCollect = 1;
                        G("i-collect").src ="/Public/img/hd/Channel/V24/collect_choose.png";
                        PageFunc.updateCollectBtnUI()
                        LMEPG.UI.showToast("收藏成功");
                    } else {
                        //取消收藏成功
                        RenderParam.isCollect = 0;
                        PageFunc.updateCollectBtnUI()
                        G("i-collect").src ="/Public/img/hd/Channel/V24/no_collect_choose.png";
                        LMEPG.UI.showToast("取消收藏成功");
                    }

                    // 更新收藏按钮图片
                    //Level3.updateCollectBtnUI();
                } else {
                    LMEPG.UI.showToast("操作失败");
                }
            } catch (e) {
                LMEPG.UI.showToast("操作异常");
            }
        });
    },

    updateCollectBtnUI:function (){
        LMEPG.BM.deleteButtons('i-collect')
        LMEPG.BM.addButtons({
            id: 'i-collect',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight:'',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage:RenderParam.isCollect === 0?"/Public/img/hd/Channel/V24/no_collect_no_choose.png":"/Public/img/hd/Channel/V24/collect_no_choose.png",
            focusImage: RenderParam.isCollect === 0?"/Public/img/hd/Channel/V24/no_collect_choose.png":"/Public/img/hd/Channel/V24/collect_choose.png",
            click:PageFunc.collect,
            focusChange: '',
            beforeMoveChange:'',
            moveChange: "",
        })
    }

}