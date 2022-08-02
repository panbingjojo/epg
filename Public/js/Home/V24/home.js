var tempUrl = RenderParam.fsUrl
var buttons = []

var moveList = [0,455,770,926]
var movePointer = RenderParam.scrollTop*1

var data = RenderParam.homeConfigInfo.data.entry_list

var moreVideoData = RenderParam.videoClass.data
var nowId=''

var carousel_1 = null
var carousel_2 = null
var carousel_3 = null

var Home = {
    init:function (){
        this.renderAllArea()
        this.initButton()
    },

    renderAllArea:function (){
        console.log(data)
        LMEPG.UI.Marquee.start('meq',5)

        for(var i =0; i<data.length;i++){
            switch (data[i].position){
                case '11':
                    carousel_1 = new Carousel(data[i].item_data,'wrap-0','1')
                    carousel_1.start()
                    break;
                case '12':
                    G('content-2').src =tempUrl+ data[i].item_data[0].img_url
                    break
                case '13':
                    carousel_2 =  new Carousel(data[i].item_data,'wrap-1','2')
                    carousel_2.start()
                    break;
                case '14':
                    carousel_3 = new Carousel(data[i].item_data,'wrap-2','3')
                    carousel_3.start()
                    break;
                case '21':
                    G('food-1').src= tempUrl+ data[i].item_data[0].img_url
                    break;
                case '22':
                    G('food-2').src= tempUrl+ data[i].item_data[0].img_url
                    break;
                case '23':
                    G('food-3').src= tempUrl+ data[i].item_data[0].img_url
                    break;
                case '31':
                    G('sketch-1').src=tempUrl+ data[i].item_data[0].img_url
                    break;
                case '32':
                    G('sketch-2').src=tempUrl+ data[i].item_data[0].img_url
                    break;
                case '33':
                    G('sketch-3').src=tempUrl+ data[i].item_data[0].img_url
                    break;
                case '34':
                    G('sketch-4').src=tempUrl+ data[i].item_data[0].img_url
                    break;
                case '35':
                    G('sketch-5').src=tempUrl+ data[i].item_data[0].img_url
                    break;
                case '41':
                    G('bodybuilding-1').src=tempUrl+ data[i].item_data[0].img_url
                    break;
                case '42':
                    G('bodybuilding-2').src=tempUrl+ data[i].item_data[0].img_url
                    break;
                case '43':
                    G('bodybuilding-3').src=tempUrl+ data[i].item_data[0].img_url
                    break;
                case '44':
                    G('bodybuilding-4').src=tempUrl+ data[i].item_data[0].img_url
                    break;
            }
        }
    },

    initButton:function (){
        buttons.push({
            id: 'vip',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'search',
            nextFocusUp: '',
            nextFocusDown: 'wrap-0',
            backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V24/vip_no_choose.png",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/vip_choose.png",
            click:PageFunc.toVIP,
            focusChange: '',
            beforeMoveChange: "",
            moveChange: "",
        },{
            id: 'search',
            type: 'img',
            nextFocusLeft: 'vip',
            nextFocusRight: 'collect',
            nextFocusUp: '',
            nextFocusDown: 'wrap-0',
            backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V24/search_no_choose.png",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/search_choose.png",
            click:PageFunc.toSearch,
            focusChange: '',
            beforeMoveChange: "",
            moveChange: "",
        },{
            id: 'collect',
            type: 'img',
            nextFocusLeft: 'search',
            nextFocusRight: 'history',
            nextFocusUp: '',
            nextFocusDown: 'wrap-0',
            backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V24/collect_no_choose.png",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/collect_choose.png",
            click:PageFunc.toCollect,
            focusChange: '',
            beforeMoveChange: "",
            moveChange: "",
        },{
            id: 'history',
            type: 'img',
            nextFocusLeft: 'collect',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'wrap-0',
            backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V24/history_no_choose.png",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/history_choose.png",
            click:PageFunc.toHistory,
            focusChange: '',
            beforeMoveChange: "",
            moveChange: "",
        },{
            id: 'wrap-0',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'wrap-3',
            nextFocusUp: 'vip',
            nextFocusDown: 'food-squ-0',
            backgroundImage: " ",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/wrap_0.png",
            click:PageFunc.carouselClick,
            focusChange: '',
            beforeMoveChange:PageFunc.scrollPage,
            moveChange: "",
            index:1
        },{
            id: 'wrap-3',
            type: 'div',
            nextFocusLeft: 'wrap-0',
            nextFocusRight: 'wrap-2',
            nextFocusUp: 'vip',
            nextFocusDown: 'wrap-1',
            backgroundImage: " ",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/wrap_3.png",
            click:PageFunc.toPage,
            focusChange: '',
            beforeMoveChange: "",
            moveChange: "",
            data:data[1].item_data[0]
        },{
            id: 'wrap-1',
            type: 'div',
            nextFocusLeft: 'wrap-0',
            nextFocusRight: 'wrap-2',
            nextFocusUp: 'wrap-3',
            nextFocusDown: 'food-squ-0',
            backgroundImage: " ",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/wrap_1.png",
            click:PageFunc.carouselClick,
            focusChange: '',
            beforeMoveChange:PageFunc.scrollPage,
            moveChange: "",
            index:2
        },{
            id: 'wrap-2',
            type: 'div',
            nextFocusLeft: 'wrap-3',
            nextFocusRight: '',
            nextFocusUp: 'vip',
            nextFocusDown: 'food-squ-0',
            backgroundImage: " ",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/wrap_2.png",
            click:PageFunc.carouselClick,
            focusChange: '',
            beforeMoveChange:PageFunc.scrollPage,
            moveChange: "",
            index:3
        },{
            id: 'food-more',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'wrap-1',
            nextFocusDown: 'food-squ-2',
            backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V24/more_no_choose.png",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/more_choose.png",
            click:PageFunc.toMorePage,
            focusChange: '',
            beforeMoveChange:PageFunc.scrollPage,
            moveChange: "",
            name:'more',
            moreData:moreVideoData[2]
        },{
            id: 'sketch-more',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'food-squ-0',
            nextFocusDown: 'sketch-squ-4',
            backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V24/more_no_choose.png",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/more_choose.png",
            click:PageFunc.toMorePage,
            focusChange: '',
            beforeMoveChange:PageFunc.scrollPage,
            moveChange: "",
            name:'more',
            moreData:moreVideoData[1]
        },{
            id: 'bodybuilding-more',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'sketch-squ-0',
            nextFocusDown: 'bodybuilding-squ-3',
            backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V24/more_no_choose.png",
            focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/more_choose.png",
            click:PageFunc.toMorePage,
            focusChange: '',
            beforeMoveChange:PageFunc.scrollPage,
            moveChange: "",
            name:'more',
            moreData:moreVideoData[0]
        })

        for(var j=0; j<3; j++){
            buttons.push({
                id: 'food-squ-'+j,
                type: 'div',
                nextFocusLeft: 'food-squ-'+(j-1),
                nextFocusRight: 'food-squ-'+(j+1),
                nextFocusUp: 'food-more',
                nextFocusDown: 'sketch-squ-0',
                backgroundImage: " ",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/food_choose.png",
                click:PageFunc.toPage,
                focusChange: '',
                beforeMoveChange: PageFunc.scrollPage,
                moveChange: "",
                data:data[4+j].item_data[0]
            })
        }

        for (var i=0; i<5; i++){
            buttons.push({
                id: 'sketch-squ-'+i,
                type: 'div',
                nextFocusLeft: 'sketch-squ-'+(i-1),
                nextFocusRight:'sketch-squ-'+(i+1),
                nextFocusUp: 'sketch-more',
                nextFocusDown: 'bodybuilding-squ-0',
                backgroundImage: " ",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/sketch_choose.png",
                click:PageFunc.toPage,
                focusChange: '',
                beforeMoveChange:PageFunc.scrollPage,
                moveChange: "",
                data:data[7+i].item_data[0]
            })
        }

        for (var k=0; k<4; k++){
            buttons.push({
                id: 'bodybuilding-squ-'+k,
                type: 'div',
                nextFocusLeft: 'bodybuilding-squ-'+(k-1),
                nextFocusRight:'bodybuilding-squ-'+(k+1),
                nextFocusUp: 'bodybuilding-more',
                nextFocusDown: '',
                backgroundImage: " ",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V24/bodybuilding_choose.png",
                click:PageFunc.toPage,
                focusChange: '',
                beforeMoveChange: "",
                moveChange: "",
                data:data[12+k].item_data[0]
            })
        }
        G('scroll-area').style.top = -moveList[RenderParam.scrollTop]+'px'
        LMEPG.BM.init(RenderParam.focusId||'wrap-0',buttons)
    }
};


var PageFunc = {
    getCurrentPage:function (){
        var cur = LMEPG.Intent.createIntent('home')
        cur.setParam('focusId',nowId)
        cur.setParam('scrollTop',movePointer)
        return cur
    },

    scrollPage:function (dir,cur){
        if(dir === 'down' && !cur.name){
            if(movePointer <= moveList.length){
                movePointer++
                G('scroll-area').style.top = -moveList[movePointer]+'px'
            }

        }else if(dir === 'up' && cur.name === 'more'){
            if(movePointer >0){
                movePointer--
                G('scroll-area').style.top = -moveList[movePointer]+'px'
            }
        }
    },

    toMorePage:function (btn){
        nowId = btn.id
        var cur = PageFunc.getCurrentPage()
        var more = LMEPG.Intent.createIntent('channelIndex')

        more.setParam('modelType', btn.moreData.model_type);
        more.setParam('modelName', btn.moreData.model_name)

        LMEPG.Intent.jump(more, cur);
    },

    toVIP:function (btn){
        nowId = btn.id
        var currentObj = PageFunc.getCurrentPage();

        var jumpAgreementObj = LMEPG.Intent.createIntent('orderHome');
        // 跳转的订购页面

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            LMEPG.UI.showToast('你已经是会员了',3)

        } else {
            jumpAgreementObj.setParam('userId', RenderParam.userId);
            jumpAgreementObj.setParam('isPlaying', '0');
            jumpAgreementObj.setParam('remark', '主动订购');
            LMEPG.Intent.jump(jumpAgreementObj, currentObj);
        }

    },

    toSearch:function (btn){
        nowId = btn.id
        var cur = PageFunc.getCurrentPage()
        var search= LMEPG.Intent.createIntent('search')

        LMEPG.Intent.jump(search, cur);
    },

    toCompilation:function (btn){
        var cur = PageFunc.getCurrentPage()
        var dstObj = LMEPG.Intent.createIntent('channelList');
        dstObj.setParam('subject_id', btn.data.subject_id);
        LMEPG.Intent.jump(dstObj, cur);
    },

    toCollection:function (btn){
        nowId = btn.id
        LMEPG.UI.showWaitingDialog();

        LMEPG.ajax.postAPI('Album/getAlbumIdByAlias',{
            'aliasName':JSON.parse(btn.data.parameters)[0].param

        }, function(rsp) {

            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.result == 0) {
                var cur = PageFunc.getCurrentPage()
                var objDst = LMEPG.Intent.createIntent('channelList');
                objDst.setParam('subject_id', data.album_id);

                LMEPG.Intent.jump(objDst, cur);
            } else{
                LMEPG.UI.showToast('获取视频集id失败!');
            }

            LMEPG.UI.dismissWaitingDialog();
        })

    },

    toVideo:function (btn){
        nowId = btn.id
        var cur = PageFunc.getCurrentPage()
        var player= LMEPG.Intent.createIntent('player')
        var data = JSON.parse(btn.data.inner_parameters)
        console.log(btn.data)

        var videoInfo = {
            'sourceId': data.source_id,
            'videoUrl': RenderParam.platformType === 'hd' ? data.ftp_url.gq_ftp_url :  data.ftp_url.bq_ftp_url,
            'title': data.title,
            'type': data.model_type,
            'userType': data.user_type,
            'freeSeconds': data.free_seconds,
            'entryType': 1,
            'entryTypeName': 'home',
            'focusIdx': btn.id,
            'unionCode':data.union_code,
            'show_status': data.show_status
        };

        if (videoInfo.show_status === '3') {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }

        if (LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        player.setParam('userId', RenderParam.userId);
        player.setParam('videoInfo',JSON.stringify(videoInfo))

        LMEPG.Intent.jump(player, cur);
    },

    toActivity:function (btn){
        nowId = btn.id
        var cur = PageFunc.getCurrentPage()
        var activityName = JSON.parse(btn.data.parameters)[0].param
        var objActivity = LMEPG.Intent.createIntent('activity');

        objActivity.setParam('userId', RenderParam.userId);
        objActivity.setParam('activityName', activityName);
        objActivity.setParam('inner', 1);

        LMEPG.Intent.jump(objActivity, cur);
    },

    toPage:function (btn){
        console.log(btn)
        if(btn.data.entry_type === '5'){
            PageFunc.toVideo(btn)
        }else if(btn.data.entry_type === '34'){
            PageFunc.toCollection(btn)
        }else if(btn.data.entry_type === '4'){
            PageFunc.toActivity(btn)
        }
    },

    toCollect:function (btn){
        nowId = btn.id
        var cur = PageFunc.getCurrentPage()
        var collect= LMEPG.Intent.createIntent('collect')

        LMEPG.Intent.jump(collect, cur);
    },

    toHistory:function (btn){
        nowId = btn.id
        var cur = PageFunc.getCurrentPage()
        var history= LMEPG.Intent.createIntent('historyPlay')

        LMEPG.Intent.jump(history, cur);

    },

    carouselClick:function (btn){
        var carousel = null;

        switch (btn.index){
            case 1:
                carousel = carousel_1
                break;
            case 2:
                carousel = carousel_2
                break;
            case 3:
                carousel = carousel_3
                break
        }

        PageFunc.toPage({
            id:btn.id,
            data:carousel.getCurrentData()
        })
    }
};

function onBack(){
    if(movePointer!==0){
        G('scroll-area').style.top = '0'
        movePointer=0
        LMEPG.BM.requestFocus('wrap-0')
    }else {
        var objHome = PageFunc.getCurrentPage();
        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
}

(function (w){
    function Carousel(data,id,flag){
        this.data = data
        this.id = id
        this.flag = flag || 0
        this.max = data.length
        this.curPoint = 0
    }

    Carousel.prototype.start=function (){
        var that = this
        var html = '';
        var signUrl = JSON.parse(this.data[0].inner_parameters).cornermark.img_url

        html+='<img src="'+tempUrl+this.data[0].img_url+'" id="wrap-content-'+this.flag+'" style="width: 97%;height: 98%">'

        html+='<img id="sign-'+this.flag+'" src="'+tempUrl+signUrl+'" style="position: absolute;left: 20px;top: 15px;display:'+(signUrl?"block":"none")+'">'

        html+='<div style="position: absolute;bottom: 20px;width: 100%;text-align: center" id="wrap-bottom-'+this.flag+'">'

        for (var i = 0;i<this.max;i++){

            html+='<img id="point-'+this.flag+i+'" src="'+(i === 0?g_appRootPath+"/Public/img/hd/Home/V24/carousel_now.png":g_appRootPath+"/Public/img/hd/Home/V24/carousel_no.png")+'">'
        }

        html+='</div>'

        G(this.id).innerHTML = html

        setInterval(function (){
            that.curPoint++
            var children = G('wrap-bottom-'+that.flag).children;
            var s = G('sign-'+that.flag)

            if(that.curPoint >= that.max){
                that.curPoint = 0
            }

            var signUrl = JSON.parse(that.data[that.curPoint].inner_parameters).cornermark.img_url

            if(signUrl){
                s.style.display = 'block'
                s.src=tempUrl+ signUrl
            }else {
                s.style.display = 'none'
            }

            for (var i = 0;i<children.length;i++){
                children[i].src =g_appRootPath+ '/Public/img/hd/Home/V24/carousel_no.png'
            }


            G('wrap-content-'+that.flag).src = tempUrl+ that.data[that.curPoint].img_url
            G('point-'+that.flag+that.curPoint).src =g_appRootPath+ '/Public/img/hd/Home/V24/carousel_now.png'

        },3000)
    };

    Carousel.prototype.getCurrentData = function (){
        return this.data[this.curPoint]
    }

    w.Carousel = Carousel
}(window));
