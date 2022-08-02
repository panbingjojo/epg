var prePointer = 0
var curPointer = 0
var count = 0
var contentData = []
var fixedUrl = RenderParam.fsUrl
var buttons = []
var groupId = RenderParam.navGroup*1 || 0
var curFocusId = ''
var curPage = 1

var Home = {
    init:function (){
        var that = this
        this.renderColumn()

        this.getContent(RenderParam.secondClass.data[groupId].model_type,function (){
            curPointer = RenderParam.navIndex === '0'? Math.min(8, count):RenderParam.navIndex*1
            prePointer = RenderParam.navPage*1

            curPage = Math.ceil(curPointer/8)
            G('cur-page').innerHTML= curPage.toString()

            that.renderContent(groupId)
            that.initButton()
            PageFunc.showArrow()
            if(RenderParam.navGroup){
                G('column-'+RenderParam.navGroup).style.backgroundImage = 'url(__ROOT__/Public/img/hd/Channel/V24/more_has_choose.png)'
            }
        })
    },

    renderColumn:function (){
        var html = ''
        var data = RenderParam.secondClass.data
        for(var i=0;i<data.length;i++ ){
            html+=' <div class="column" id="column-'+i+'">'+data[i].model_name+'</div>'

            buttons.push({
                id: 'column-'+i,
                type: 'div',
                nextFocusLeft:i===0?"":'column-'+(i-1),
                nextFocusRight: 'column-'+(i+1),
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: " ",
                focusImage:  g_appRootPath+ "/Public/img/hd/Channel/V24/more_choose.png",
                selectedImage: g_appRootPath+'/Public/img/hd/Channel/V24/more_has_choose.png',
                click:'',
                focusChange: '',
                beforeMoveChange: PageFunc.toContentArea,
                moveChange: PageFunc.changeContent,
                groupId:i,
                data:data[i]
            })
        }
        G('type-class').innerHTML = html
    },

    renderContent:function (groupId){
        var html = ''
        var buttonList = []
        for (var i = prePointer;i<curPointer;i++){
            html+=' <div class="content-item" id="content-item-'+i+'" style="margin-top:'+(i>prePointer+4?10:0)+'px">\n' +
                '      <img src="'+fixedUrl+contentData[i].image_url+'" style="width: 100%;height: 100%;border-radius: 15px"/>'
            if(contentData[i].subject_id){
                html+='<div class="how-long">'+contentData[i].content_cnt+'集</div>'
            }
            html+='  </div>'

            buttonList.push({
                id: 'content-item-'+i,
                type: 'div',
                nextFocusLeft: 'content-item-'+(i-1),
                nextFocusRight:'content-item-'+(i+1),
                nextFocusUp: i-4 >= prePointer?'content-item-'+(i-4):'column-'+groupId,
                nextFocusDown:i+4 >= curPointer?'content-item-'+(curPointer-1) : 'content-item-'+(i+4),
                backgroundImage: " ",
                focusImage:  g_appRootPath+ "/Public/img/hd/Channel/V24/choose_squ.png",
                click:PageFunc.toPage,
                focusChange: '',
                beforeMoveChange:PageFunc.turnPage,
                moveChange: "",
                cIndex:i,
                data:contentData[i]
            })

        }
        LMEPG.BM.addButtons(buttonList)
        G('main-content').innerHTML = html
    },

    initButton:function (){
        LMEPG.BM.init(RenderParam.focusId || 'column-0',buttons)
    },

    getContent:function (modelType,success){
        LMEPG.ajax.postAPI('Video/getVideoList',{'model_type': modelType}, function(data){
            var jsonData = JSON.parse(data)
            console.log(jsonData)
            
            curPointer = Math.min(8, jsonData.count)
            prePointer = 0

            count =  jsonData.count
            contentData = jsonData.album_list.concat(jsonData.list)
            curPage = 1

            G('foot').style.display = contentData.length === 0?'none':'block'

            G('no-result').style.display =  contentData.length === 0?'block':'none'
            G('cur-page').innerHTML= contentData.length === 0?'0':'1'
            G('total-page').innerHTML = Math.ceil(count / 8)

            success()
        })
    }
}

var PageFunc = {
    getCurrentPage:function (id){
        var curPage = LMEPG.Intent.createIntent('channelIndex')
        curPage.setParam('modelType', RenderParam.firstModelType);
        curPage.setParam('modelName', RenderParam.modelName);
        curPage.setParam('focusId',id)
        curPage.setParam('navPage',prePointer)
        curPage.setParam('navIndex',curPointer)
        curPage.setParam('navGroup',groupId)

        return curPage
    },

    toContentArea:function (dir,btn){
        groupId = btn.groupId
        if(dir === 'down' && contentData.length!==0){
            setTimeout(function (){
                LMEPG.BM.requestFocus('content-item-'+prePointer)
                G(btn.id).style.backgroundImage = 'url(' + btn.selectedImage + ')';
            })
        }
    },
    changeContent:function (pre,cur,dir){
        if (dir ==='left' || dir ==='right'){
            groupId = cur.groupId
            Home.getContent(cur.data.model_type,function (){
                curPage = 1
                Home.renderContent(groupId)
                PageFunc.showArrow()
            })
        }

    },

    toPage:function (btn){
        var cur = PageFunc.getCurrentPage(btn.id)

        if(btn.data.subject_id){
            var dstObj = LMEPG.Intent.createIntent('channelList');
            dstObj.setParam('subject_id', btn.data.subject_id);
            LMEPG.Intent.jump(dstObj, cur);
        }else {
            var player= LMEPG.Intent.createIntent('player')
            var ftpUrl = JSON.parse(btn.data.ftp_url);

            var videoInfo = {
                'sourceId': btn.data.source_id,
                'videoUrl': RenderParam.platformType === 'hd' ? ftpUrl.gq_ftp_url : ftpUrl.bq_ftp_url,
                'title': btn.data.title,
                'type': btn.data.model_type,
                'userType': btn.data.user_type,
                'freeSeconds': btn.data.free_seconds,
                'entryType': 1,
                'entryTypeName': '视频',
                'unionCode': btn.data.union_code,
            };

            player.setParam('userId', RenderParam.userId);
            player.setParam('videoInfo',JSON.stringify(videoInfo))

            LMEPG.Intent.jump(player, cur);
        }
        console.log(btn.data)
    },

    turnPage:function (dir,btn){
        if(dir === 'right' && (btn.cIndex+1 === prePointer+4 || btn.cIndex+1 === curPointer) && curPointer+1<count){
            prePointer+=8
            curPointer+8<count?curPointer+=8:curPointer = count
            Home.renderContent(groupId)
            curPage+=1
            G('cur-page').innerHTML= curPage
            setTimeout(function (){ LMEPG.BM.requestFocus('content-item-'+prePointer)})

        }else if(dir === 'left' && prePointer-8 >= 0 && (btn.cIndex === prePointer || btn.cIndex === prePointer+4)){
            curPointer-prePointer>=8?curPointer-=8:curPointer -= curPointer-prePointer
            prePointer-=8

            Home.renderContent(groupId)
            curPage-=1
            G('cur-page').innerHTML= curPage
            setTimeout(function (){ LMEPG.BM.requestFocus('content-item-'+(curPointer-1))})
        }
        PageFunc.showArrow()

    },

    showArrow:function (){
        G('left-arrow').style.display = prePointer === 0?'none':'block'
        G('right-arrow').style.display = curPointer >= contentData.length?'none':'block'
    }
}