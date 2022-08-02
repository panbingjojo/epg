var DATA = RenderParam.configInfo.data.entry_list;
var nowTab = RenderParam.focusIndex || 0;
var nowPosition = RenderParam.position || 'position-0';

var cutDown = 5;
var timer = null;
var tempId = '';

(function (w) {
    function Carousel(data,id) {
        this.data = data;
        this.id = id;
        this.max = data.length;
        this.current = 0;
    }

    Carousel.prototype.start = function(){
        var that = this;
        var ele = G(this.id).children;
        var point = ele[2].children;

        setInterval(function () {
            that.current++;
            if(that.current>= that.max){
                that.current = 0;
            }

            ele[0].src = RenderParam.fsUrl + JSON.parse(that.data[that.current].img_url).normal;

            var mark =that.data[that.current].inner_parameters ? JSON.parse(that.data[that.current].inner_parameters).cornermark.img_url : '';
            ele[1].src = mark ? RenderParam.fsUrl+mark : "";

            for(var j=0;j<point.length;j++){
                point[j].src = g_appRootPath + '/Public/img/hd/Home/V25/point.png';
            }

            point[that.current].src = g_appRootPath + '/Public/img/hd/Home/V25/point-choose.png';


        },2500);
    };

    Carousel.prototype.getCurrentData = function(){
        return this.data[this.current];
    };

    w.Carousel = Carousel;
}(window));

var Home ={
    init:function () {
        G('default_link').focus();
        G('app').style.background="url("+RenderParam.fsUrl+RenderParam.themeImage+")";
        if (RenderParam.carrierId !== '000006') {
            Utils.setPageSize();
        }
        this.renderTab();
        Home.switchRenderContent(RenderParam.focusIndex*1 || 0);
        this.renderMarquee();
        this.initButton();

        LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], PageEvent.jumpTestPage);
    },

    initButton:function(){
        var button = [];

        button.push({
                id: 'vip',
                type: 'img',
                nextFocusLeft: 'search',
                nextFocusRight: 'collect',
                nextFocusUp: '',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V25/vip-no-choose.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V25/vip-choose.png",
                click: Home.funcClick,
                focusChange: '',
                beforeMoveChange: Home.funcLeave,
                moveChange: "",
                curPage: 'home',
            }, {
                id: 'search',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'vip',
                nextFocusUp: '',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V25/search-no-choose.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V25/search-choose.png",
                click: Home.funcClick,
                focusChange: '',
                beforeMoveChange: Home.funcLeave,
                moveChange: "",
                curPage: 'home',
            }, {
                id: 'collect',
                type: 'img',
                nextFocusLeft: 'vip',
                nextFocusRight: 'history',
                nextFocusUp: '',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V25/collect-no-choose.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V25/collect-choose.png",
                click: Home.funcClick,
                focusChange: '',
                beforeMoveChange: Home.funcLeave,
                moveChange: "",
                curPage: 'home',
            }, {
                id: 'history',
                type: 'img',
                nextFocusLeft: 'collect',
                nextFocusRight: RenderParam.areaCode =='201'?'unreg':'lock',
                nextFocusUp: '',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V25/history-no-choose.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V25/history-choose.png",
                click:Home.funcClick,
                focusChange: '',
                beforeMoveChange: Home.funcLeave,
                moveChange: "",
                curPage: 'home',
            }, {
                id: 'lock',
                type: 'img',
                nextFocusLeft: 'history',
                nextFocusRight: '',
                nextFocusUp: '',
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V25/child-lock.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V25/child-lock-choose.png",
                click: Home.funcClick,
                focusChange: '',
                beforeMoveChange: Home.funcLeave,
                moveChange: "",
                curPage: 'home',
            },{
                id: 'unreg',
                type: 'img',
                nextFocusLeft: 'history',
                nextFocusRight: '',
                nextFocusUp: '',
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V25/unreg.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V25/unreg_f.png",
                click: Home.cancelOrderProduct,
                focusChange: '',
                beforeMoveChange: Home.funcLeave,
                moveChange: "",
                curPage: 'home',
            }, {
                id: 'pop-back',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'pop-continue',
                nextFocusUp: '',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V25/back.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V25/back-choose.png",
                click: function () {
                LMEPG.Intent.back('IPTVPortal');
            },
            focusChange: '',
                beforeMoveChange: '',
                moveChange: "",
        }, {
                id: 'pop-continue',
                type: 'img',
                nextFocusLeft: 'pop-back',
                nextFocusRight: '',
                nextFocusUp: '',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/Home/V25/continue.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/Home/V25/continue-choose.png",
                click: function () {
                    H('pop');
                    clearInterval(timer);
                    cutDown = 5;
                    LMEPG.BM.requestFocus(tempId);
                },
                focusChange: '',
                beforeMoveChange: '',
                moveChange: "",
            }
        );

        if( RenderParam.focusId && (RenderParam.focusId!=='collect' && RenderParam.focusId !== 'history' && RenderParam.focusId !== 'search'  && RenderParam.focusId !== 'vip')){
            RenderParam.focusIndex && (G('tab-'+RenderParam.focusIndex).src = RenderParam.fsUrl+RenderParam.navConfig[RenderParam.focusIndex].img_url.focus_out);
        }

        G('scroll').style.left = (RenderParam.scrollDis || 0)+'px';
        LMEPG.BM.init(RenderParam.focusId || (RenderParam.areaCode === '207'? 'bottom-item-4':'tab-0'),button);
    },

    renderTab:function () {
        var html = "";
        var button = [];
        RenderParam.navConfig.forEach(function (i,index) {
            html+='<img src="'+RenderParam.fsUrl+i.img_url.normal+'" id="tab-'+index+'">';

            button.push({
                id: 'tab-'+index,
                type: 'img',
                nextFocusLeft: 'tab-'+(index-1),
                nextFocusRight: 'tab-'+(index+1),
                nextFocusUp: 'search',
                backgroundImage: RenderParam.fsUrl+i.img_url.normal,
                focusImage: RenderParam.fsUrl+i.img_url.focus_in,
                selectImage:RenderParam.fsUrl+i.img_url.focus_out,
                click:'',
                focusChange: '',
                beforeMoveChange: Home.tabLeave,
                moveChange:Home.tabChange,
                tabIndex:index,
                buttonType:'tab'
            });
        });
        LMEPG.BM.addButtons(button);
        G('classify').innerHTML = html;
    },

    funcLeave:function(dir){
        if(dir === 'down'){
            setTimeout(function () {
                LMEPG.BM.requestFocus('tab-'+nowTab);
            },50);
        }
    },

    tabChange:function(pre,btn,dir){
        nowTab = btn.tabIndex;
        if(dir === 'left' || dir === 'right'){
            Home.switchRenderContent(btn.tabIndex);
            Tab1Func.block = false;
            Tab2Func.block = false;
            Tab3Func.block = false;
            Tab4Func.block = false;
        }
    },

    switchRenderContent:function(n){
        switch (n) {
            case 0:
                Home.renderTab1Content();
                break;
            case 1:
                Home.renderTab2Content();
                break;
            case 2:
                Home.renderTab3Content();
                break;
            case 3:
                Home.renderTab4Content();
                break;
        }
    },

    tabLeave:function(dir,btn){
        if(dir === 'down'){
            setTimeout(function () {
                LMEPG.BM.requestFocus(nowPosition);
                G(btn.id).src = btn.selectImage;
            },50);

        }else if(dir === 'up'){
            nowTab = btn.tabIndex;

        }else if(dir === 'left' || dir === 'right'){
            nowPosition = 'position-0';
        }
    },

    renderTab1Content:function () {
        var html ='<div class="scroll-area"><div id="scroll" style="position: absolute">';
        var obj1 = Tab1.renderHotList();
        var obj2 = Tab1.renderMainContent();

        html+= obj1.html;
        html+= obj2.html;

        html+='</div></div>';
        html+= Tab1.renderBottomList();

        G('content').innerHTML = html;

        obj1.carouselList.forEach(function (i) {
            i.start();
        })

        obj2.carouselList.forEach(function (i) {
            i.start();
        })
    },

    renderTab2Content:function (){
        var html ='<div class="scroll-area"><div id="scroll" style="position: absolute">';
        var obj = Tab2.renderFoodMainContent();
        html+= obj.html;
        html+= '</div></div>';

        html+= Tab2.renderTab2Bottom();

        G('content').innerHTML = html;

        obj.carouselList.forEach(function (i) {
            i.start();
        })
    },

    renderTab3Content:function(){
        var html ='<div class="scroll-area-2"><div id="scroll" style="position: absolute">';
        var obj = Tab3.renderMainContent();
        html+= obj.html;
        html+= '</div></div>';

        G('content').innerHTML = html;

        obj.carouselList.forEach(function (i) {
            i.start();
        })
    },

    renderTab4Content:function(){
        var html ='<div class="scroll-area-2"><div id="scroll" style="position: absolute">';
        html+= Tab4.renderList();
        html+= '</div></div>';

        G('content').innerHTML = html;
    },

    renderMarquee:function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('scroll-wrapper').innerHTML = '<marquee scrollamount="4">' + data.content + '</marquee>';
        }, function (errorInfo) {
            LMEPG.Log.error("getMarquee error: " + errorInfo);
        })
    },

    funcClick:function(btn){
        var scroll =G('scroll').offsetLeft;
        switch (btn.id) {
            case 'collect':
                PageEvent.toCollect({
                    curPage: 'home',
                    backInfo: {tab:nowTab,id: 'collect', scroll: scroll,position:nowPosition}
                });
                break;
            case 'history':
                PageEvent.toHistory({
                    curPage: 'home',
                    backInfo: {tab:nowTab,id: 'history', scroll: scroll,position:nowPosition}
                });
                break;
            case 'search':
                PageEvent.toSearch({
                    curPage: 'home',
                    backInfo: {tab:nowTab,id: 'search', scroll: scroll,position:nowPosition}
                });
                break;
            case 'vip':
                PageEvent.toBuyVIP({
                    curPage: 'home',
                    backInfo: {tab:nowTab,id: 'vip', scroll: scroll,position:nowPosition}
                });
                break;
            case 'lock':
                if (RenderParam.payLockStatus == "0") {
                    // 童锁未开启，开启童锁
                    var postData = {
                        'flag': 1,
                        'focusIndex': 'lock',
                        'returnPageName': "home"
                    };
                    LMEPG.ajax.postAPI("Pay/getPayLockSetUrl", postData, function (data) {
                        if (data.result == 0) {
                            window.location.href = data.url;
                        }
                    });
                }else if(RenderParam.payLockStatus == "1"){
                    var postData = {
                        'flag': 0,
                        'focusIndex': 'lock',
                        'returnPageName': "home"
                    };
                    LMEPG.ajax.postAPI("Pay/getPayLockSetUrl", postData, function (data) {
                        if (data.result == 0) {
                            window.location.href = data.url;
                        }
                    });
                }
                break;
        }
    },

    /**
     * 退订
     * @param btn
     */
    cancelOrderProduct: function (btn) {
        modal.commonDialog_000051({
            beClickBtnId: btn.id,
            onClick: function () {
                LMEPG.UI.showWaitingDialog();
                LMEPG.ajax.postAPI('Pay/cancelOrderProduct', null, function (data) {
                    // 把data转成json对象
                    data = data instanceof Object ? data : JSON.parse(data);
                    // 退订成功
                    if (data.result == 0 ) {
                        RenderParam.isVip=0;
                        var tips1 = '恭喜您退订食乐汇成功!';
                    } else if(data.result == 10030102) {
                        RenderParam.isVip=0;
                        var tips1 = '未订购该产品，退订失败!';
                    } else {
                        var tips1 = '退订失败，请重试！';
                    }
                    modal.textDialogWithSure_000051({beClickBtnId: btn.id, onClick: Home.init()}, "", tips1);
                    LMEPG.UI.dismissWaitingDialog();
                });
            }
        }, '', '您确定要终止续订食乐汇吗？', '');
    },

    itemClickEvent:function (btn) {
        var data = btn.data;

        if(btn.carousel){
            data = btn.carousel.getCurrentData();
        }

        if(data.entry_type == HomeEntryType.HEALTH_VIDEO){
            PageEvent.toVideo({
                data:JSON.parse(data.inner_parameters),
                curPage:btn.curPage,
                backInfo:btn.backInfo,
                sourceID:JSON.parse(data.parameters)
            })

        }else if(data.entry_type == HomeEntryType.HEALTH_VIDEO_SET){
            btn.data = data;
            PageEvent.toVideoCollect(btn);

        }else if(data.entry_type == HomeEntryType.HEALTH_VIDEO_BY_TYPES){
            btn.data = data;
            PageEvent.toMoreVideo(btn);

        }else if(data.entry_type == HomeEntryType.ACTIVITYS){
            btn.data = data;
            PageEvent.toActivity(btn);

        } else if(data.entry_type == HomeEntryType.GRAPHIC_DETAIL){
            btn.data = data;
            PageEvent.toPicAndWord(btn);
        } else if(data.entry_type == HomeEntryType.THIRD_PARTY_URL){
            btn.data = data
            PageEvent.toPartyYUrl(btn)
        } else{
            btn.data = data;
            PageEvent.toAlbum(btn);
        }
    }
};


var Tab1 = {
    renderHotList:function () {
        var button = [];
        var len = Math.min(3,RenderParam.videoPlayRank.list.length);
        var carouselList = [];
        var carousel = '';

        var html ='<div class="tab1-left-area" >' +
            '<div class="hot-title"></div>';

        for (var i=0; i<len; i++){
            html+='<div class="hot-item" id="hot-item-'+i+'">\n' +
                 '<div class="hot-text" id="text-'+i+'">'+RenderParam.videoPlayRank.list[i].title +'</div>'+
                '       <img src= "' + g_appRootPath + '/Public/img/hd/Home/V25/hot-play-no-choose.png" id="hot-play-'+i+'">' +
                '  </div>';

                html+= i+1!== len?' <div class="hot-line"></div>':'<div style="height: 2px;margin-left: 10px;width: 248px;"></div>';

            button.push({
                id: 'hot-item-'+i,
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: 'position-0',
                nextFocusUp: i === 0?'tab-0':'hot-item-'+(i-1),
                nextFocusDown: i === 2?'position-2':'hot-item-'+(i+1),
                backgroundImage:g_appRootPath+  '/Public/img/hd/Home/V25/hot-title-bg.png',
                focusImage: g_appRootPath+ '/Public/img/hd/Home/V25/hot-title-bg-choose.png',
                selectImage:'',
                click:PageEvent.toVideo,
                focusChange: Tab1Func.scrollHotText,
                beforeMoveChange: Utils.recordPosition,
                moveChange: "",
                data:RenderParam.videoPlayRank.list[i],
                curPage:'home',
                backInfo:{tab:'0',id:'hot-item-'+i,scroll:0},
                index:i
            });
        }
        var mark =DATA[2].item_data[0].inner_parameters ? JSON.parse(DATA[2].item_data[0].inner_parameters).cornermark.img_url:'';

        html+='<div id="position-2" class="other-recommend">' +
                '<img src="'+RenderParam.fsUrl + JSON.parse(DATA[2].item_data[0].img_url).normal+'">';


        html+='<img class="sign"  src="'+(mark?RenderParam.fsUrl+mark:"")+'" style="width: auto;height: auto">';


        if(DATA[2].item_data.length>=2){
            html+='<div class="point-area" style="position: absolute;bottom:'+(RenderParam.platformType==="hd"?20:10)+'px;width:'+(RenderParam.platformType==="hd"?247:100)+'px;text-align: center">';

            for(var j = 0; j<DATA[2].item_data.length;j++){
                html+='<img src="'+g_appRootPath+(j===0?"/Public/img/hd/Home/V25/point-choose.png":"/Public/img/hd/Home/V25/point.png")+'">';
            }

            html+='</div>';

            carousel = new Carousel(DATA[2].item_data,'position-2');
            carouselList.push(carousel);
        }

         html+= '</div>';



        button.push({
            id: 'position-2',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: 'position-3',
            nextFocusUp: 'hot-item-2',
            nextFocusDown: 'bottom-item-0',
            backgroundImage: ' ',
            focusImage:g_appRootPath+  '/Public/img/hd/Home/V25/recommend-bg-2.png',
            selectImage:'',
            click:Home.itemClickEvent,
            focusChange: '',
            beforeMoveChange: Utils.recordPosition,
            moveChange: "",
            data:DATA[2].item_data[0],
            curPage:'home',
            positionIndex:2,
            backInfo:{tab:'0',id:'position-2',scroll:0},
            carousel:carousel
        });

        html+='</div>';

        LMEPG.BM.addButtons(button);

        return {
            html:html,
            carouselList:carouselList
        };
    },

    renderMainContent:function(){
        var html = '<div class="tab1-right-area"><div class="first-recommend">';
        var button = [];
        var carouselList = [];
        var carousel = '';
        var pointSize = RenderParam.platformType === 'hd'? 15:10;
        for (var i = 0; i < 6; i++) {
            carousel = '';
            if(i===2) continue;
            var mark =DATA[i].item_data[0].inner_parameters ? JSON.parse(DATA[i].item_data[0].inner_parameters).cornermark.img_url:'';

            if (i < 2) {
                html += '<div class="recommend-position-' + i + '" id="position-' + i + '">' +
                    '<img src="' + RenderParam.fsUrl + JSON.parse(DATA[i].item_data[0].img_url).normal + '">';


                html+='<img src="'+(mark?RenderParam.fsUrl+mark:"")+'" class="sign" style="width:auto;height:auto">';

                if(DATA[i].item_data.length>=2){
                    html+='<div class="point-area">';
                    for(var j = 0; j<DATA[i].item_data.length;j++){
                        html+='<img src="'+g_appRootPath+(j===0?"/Public/img/hd/Home/V25/point-choose.png":"/Public/img/hd/Home/V25/point.png")+'" style="width:'+pointSize+'px;height:'+pointSize+'px">';
                    }
                    html+='</div>';

                    carousel = new Carousel(DATA[i].item_data,'position-' + i);
                    carouselList.push(carousel);
                }


                 html+=  '</div>';

                button.push({
                    id: 'position-' + i,
                    type: 'div',
                    nextFocusLeft: i === 0 ? 'hot-item-0' : 'position-0',
                    nextFocusRight: i === 0 ? 'position-1' : 'position-6',
                    nextFocusUp: 'tab-0',
                    nextFocusDown: i === 0 ? 'position-3' : 'position-5',
                    backgroundImage: ' ',
                    focusImage: i === 0 ? g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-0.png' : g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-1.png',
                    selectImage: '',
                    click: Home.itemClickEvent,
                    focusChange: '',
                    beforeMoveChange: Utils.recordPosition,
                    moveChange: Tab1Func.recommendTurnPage,
                    positionIndex: i,
                    data:DATA[i].item_data[0],
                    curPage:'home',
                    backInfo:{tab:'0',id:'position-' + i,scroll:0},
                    carousel:carousel
                });
            } else {
                var offset = RenderParam.platformType === 'hd'?(((i - 3) * 258)-5):((i - 3) * 128);

                html += '<div id="position-' + i + '" class="recommend-position-base" style="left: ' + (offset + 3) + 'px">' +
                    '<img src="' + RenderParam.fsUrl + JSON.parse(DATA[i].item_data[0].img_url).normal + '">';


                html+='<img src="'+(mark?RenderParam.fsUrl+mark:"")+'" class="sign" style="width: auto;height: auto">';



                if(DATA[i].item_data.length>=2){
                    html+='<div class="point-area" style="bottom:'+(RenderParam.platformType==="hd"?35:10)+'px">';

                    for(var j = 0; j<DATA[i].item_data.length;j++){
                        html+='<img src="'+g_appRootPath+(j===0?"/Public/img/hd/Home/V25/point-choose.png":"/Public/img/hd/Home/V25/point.png")+'" style="width:'+pointSize+'px;height:'+pointSize+'px">';
                    }

                    html+='</div>';

                    carousel= new Carousel(DATA[i].item_data,'position-' + i);
                    carouselList.push(carousel);
                }

                 html+= '</div>';

                button.push({
                    id: 'position-' + i,
                    type: 'div',
                    nextFocusLeft: i === 2 ? 'hot-item-0' : 'position-' + (i - 1),
                    nextFocusRight: 'position-'+(i+1),
                    nextFocusUp: i > 4 ? 'position-1' : 'position-0',
                    nextFocusDown: 'bottom-item-0',
                    backgroundImage: ' ',
                    focusImage: g_appRootPath + '/Public/img/hd/Home/V25/recommend-bg-2.png',
                    selectImage: '',
                    click: Home.itemClickEvent,
                    focusChange: '',
                    beforeMoveChange:Utils.recordPosition,
                    moveChange: Tab1Func.recommendTurnPage,
                    positionIndex: i,
                    data:DATA[i].item_data[0],
                    curPage:'home',
                    backInfo:{tab:'0',id:'position-' + i,scroll:0},
                    carousel:carousel
                });
            }

            if (i === 5) {
                html += '</div>';
            }
        }

        for (var j = 0; j <DATA[6].item_data.length; j++) {
            var offset =   RenderParam.platformType === 'hd'?(j * 275 + 770):(j * 175 + 387);
            var scroll =  RenderParam.platformType === 'hd'?-((j+1)*250) : -((j+1)*150);
            var marks = DATA[6].item_data[j].inner_parameters ? JSON.parse(DATA[6].item_data[j].inner_parameters).cornermark.img_url:'';


            html += '<div id="position-' + (j+6) + '" class="recommend-item" style="left:' + offset + 'px">' +
                '<img src="' + RenderParam.fsUrl + JSON.parse(DATA[6].item_data[j].img_url).normal + '">';

            if(marks){
                html+='<img src="'+RenderParam.fsUrl+marks+'" class="sign" style="width: auto;height: auto">';
            }

             html+=  '</div>';

            button.push({
                id: 'position-'+(j+6),
                type: 'div',
                nextFocusLeft: 'position-' + (j+6 - 1),
                nextFocusRight: 'position-' + (j+6 + 1),
                nextFocusUp: 'tab-0',
                nextFocusDown: 'bottom-item-0',
                backgroundImage: ' ',
                focusImage:g_appRootPath+  '/Public/img/hd/Home/V25/recommend-bg-3.png',
                selectImage: '',
                click: Home.itemClickEvent,
                focusChange: '',
                beforeMoveChange: Utils.recordPosition,
                moveChange: Tab1Func.recommendTurnPage,
                positionIndex: j+6,
                data:DATA[6].item_data[j],
                curPage:'home',
                backInfo:{tab:'0',id:'position-' + (j+6),scroll:scroll}
            });
        }

        html+= '</div>';
        LMEPG.BM.addButtons(button);

        return {
            html:html,
            carouselList:carouselList
        };
    },

    renderBottomList:function () {
        var html = ' <div class="tab1-bottom-area">';
        var len = DATA[7].item_data.length;
        var button = [];

        for(var i=0;i<len;i++){
            html+= '<img class="bottom-item" id="bottom-item-'+ i+'" src="'+RenderParam.fsUrl+JSON.parse(DATA[7].item_data[i].img_url).normal+'">';

            button.push({
                id: 'bottom-item-'+i,
                type: 'img',
                nextFocusLeft: 'bottom-item-'+(i-1),
                nextFocusRight: 'bottom-item-'+(i+1),
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: RenderParam.fsUrl+JSON.parse(DATA[7].item_data[i].img_url).normal ,
                focusImage: RenderParam.fsUrl+JSON.parse(DATA[7].item_data[i].img_url).focus_in ,
                selectImage:'',
                click:Home.itemClickEvent,
                focusChange: '',
                beforeMoveChange: function (dir) {
                    if(dir === 'up'){
                        setTimeout(function () {
                            LMEPG.BM.requestFocus(nowPosition);
                        },50);
                    }
                },
                moveChange: "",
                data:DATA[7].item_data[i],
                curPage:'home',
                backInfo:{tab:'0',id:'bottom-item-'+i,scroll:0}
            });
        }
        html+='</div>';

        LMEPG.BM.addButtons(button);

        return html;
    }
};

var Tab2 = {
    renderFoodMainContent:function () {
        var html = '<div class="tab2-main-area">';
        var button = [];
        var carouselList = [];
        var carousel = '';
        var pointSize = RenderParam.platformType === 'hd'? 15:10;

        for(var i = 8; i<13; i++){
            carousel = '';
            var mark =DATA[i].item_data[0].inner_parameters ? JSON.parse(DATA[i].item_data[0].inner_parameters).cornermark.img_url:'';

           html+='<div class="food food-position-'+(i-8)+'" id="position-'+(i-8)+'">' +
               '    <img class="pos-img" src = "'+RenderParam.fsUrl + JSON.parse(DATA[i].item_data[0].img_url).normal+'">';


            html+='<img src="'+(mark? RenderParam.fsUrl + mark:'')+'" class="sign" style="width: auto;height: auto">';


            if(DATA[i].item_data.length>=2){
                html+='<div class="point-area">';

                for(var j = 0; j<DATA[i].item_data.length;j++){
                    html+='<img src="'+g_appRootPath+(j===0?"/Public/img/hd/Home/V25/point-choose.png":"/Public/img/hd/Home/V25/point.png")+'" style="width: '+pointSize+'px;height: '+pointSize+'px">';
                }

                html+='</div>';

                carousel = new Carousel(DATA[i].item_data,'position-' + (i-8));
                carouselList.push(carousel);
            }


             html+= ' </div>';

            var info = Tab2Func.sureContentInfo((i-8));

            button.push({
                id: 'position-'+(i-8),
                type: 'div',
                nextFocusLeft: info.left,
                nextFocusRight: info.right,
                nextFocusUp: info.up,
                nextFocusDown: info.down,
                backgroundImage: ' ',
                focusImage: info.bg,
                selectImage:'',
                click:Home.itemClickEvent,
                focusChange: '',
                beforeMoveChange: Utils.recordPosition,
                moveChange: Tab2Func.recommendTurnPage,
                positionIndex:i-8,
                data:DATA[i].item_data[0],
                curPage:'home',
                backInfo:{tab:'1',id:'position-'+(i-8),scroll:0},
                carousel:carousel

            });
        }

        for (var j = 0; j<DATA[13].item_data.length; j++){
            var offset = RenderParam.platformType === 'hd'?(1080+(j*280)) : (545+(j*145));
            var scroll = RenderParam.platformType === 'hd'? -((j+1)*250) : -((j+1)*150);
            var mark =DATA[i].item_data[0].inner_parameters ? JSON.parse(DATA[13].item_data[j].inner_parameters).cornermark.img_url:'';

            html+='<div class="food-item" style="left: '+offset+'px" id="position-'+(5+j)+'">' +
                '    <img src = "'+RenderParam.fsUrl + JSON.parse(DATA[13].item_data[j].img_url).normal+'">';

            if(mark){
                html+='<img src="'+RenderParam.fsUrl+mark+'" class="sign" style="width: auto;height: auto">';
            }

            html+='</div>';

            button.push({
                id: 'position-'+(5+j),
                type: 'div',
                nextFocusLeft: 'position-'+(5+j-1),
                nextFocusRight: 'position-'+(5+j+1),
                nextFocusUp: 'tab-1',
                nextFocusDown: 'bottom-item-0',
                backgroundImage: ' ',
                focusImage:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-3.png',
                selectImage:'',
                click:Home.itemClickEvent,
                focusChange:'',
                beforeMoveChange: Utils.recordPosition,
                moveChange: Tab2Func.recommendTurnPage,
                positionIndex:5+j,
                data:DATA[13].item_data[j],
                curPage:'home',
                backInfo:{tab:'1',id:'position-'+(5+j),scroll:scroll}
            });
        }

        html+= '</div>';

        LMEPG.BM.addButtons(button);

        return {
            html:html,
            carouselList:carouselList
        };
    },

    renderTab2Bottom:function () {
        var button = [];
        var html = '<div class="tab1-bottom-area">';

        DATA[14].item_data.forEach(function (i,index) {
            html+='<img  class="bottom-item" id="bottom-item-'+index+'" src="'+RenderParam.fsUrl+JSON.parse(i.img_url).normal+'"/>';

            button.push({
                id: 'bottom-item-'+index,
                type: 'img',
                nextFocusLeft: 'bottom-item-'+(index-1),
                nextFocusRight: 'bottom-item-'+(index+1),
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: RenderParam.fsUrl+JSON.parse(i.img_url).normal ,
                focusImage: RenderParam.fsUrl+JSON.parse(i.img_url).focus_in ,
                selectImage:'',
                click:Home.itemClickEvent,
                focusChange: '',
                beforeMoveChange: function (dir) {
                    if(dir === 'up'){
                        setTimeout(function () {
                            LMEPG.BM.requestFocus(nowPosition)
                        },50)
                    }
                },
                moveChange: "",
                data:i,
                curPage:'home',
                backInfo:{tab:'1',id:'bottom-item-'+index,scroll:0,
                    innerTab:{
                        focusId:'focus-0',
                        navPage:0,
                        keepNavFocusId:'nav-'+(index+1),
                        page:0,
                        navIndex:(index+1)
                    }}
            });
        });

        html+='</div>';
        LMEPG.BM.addButtons(button);

        return html;
    }
};

var Tab3 = {
    renderMainContent:function () {
        var html = '<div class="tab3-main-area">';
        var button = [];
        var carousel = '';
        var carouselList = [];
        var pointSize = RenderParam.platformType === 'hd'? 15:10;

        for (var i = 15 ;i<20;i++){
            carousel = '';
            if((i-15) === 4){
                html+=' <img class="food-position-'+(i-15)+'" id="position-'+(i-15)+'" src="'+RenderParam.fsUrl + JSON.parse(DATA[i].item_data[0].img_url).normal+'">';

            }else {
                var mark = DATA[i].item_data[0].inner_parameters ? JSON.parse(DATA[i].item_data[0].inner_parameters).cornermark.img_url:'';
                html+='<div class="food-position-'+(i-15)+'" id="position-'+(i-15)+'">' +
                    '   <img src="'+RenderParam.fsUrl + JSON.parse(DATA[i].item_data[0].img_url).normal+'">';

                html+='<img src="'+(mark? RenderParam.fsUrl+mark : '')+'" class="sign" style="width: auto;height: auto">';

                if(DATA[i].item_data.length>=2){
                    html+='<div class="point-area">';

                    for(var j = 0; j<DATA[i].item_data.length;j++){
                        html+='<img src="'+g_appRootPath+(j===0?"/Public/img/hd/Home/V25/point-choose.png":"/Public/img/hd/Home/V25/point.png")+'" style="width:'+pointSize+'px;height: '+pointSize+'px">';
                    }

                    html+='</div>';

                    carousel = new Carousel(DATA[i].item_data,'position-' + (i-15));
                    carouselList.push(carousel);
                }

                html+= '</div>';
            }

            var info = Tab3Func.sureContentInfo((i-15));

            button.push({
                id: 'position-'+(i-15),
                type: (i-15) === 4 ? 'img':'div',
                nextFocusLeft: info.left,
                nextFocusRight: info.right,
                nextFocusUp: info.up,
                nextFocusDown: info.down,
                backgroundImage: info.normalGb || " ",
                focusImage: info.bg,
                selectImage:'',
                click:Home.itemClickEvent,
                focusChange: '',
                beforeMoveChange: Utils.recordPosition,
                moveChange: Tab3Func.recommendTurnPage,
                positionIndex:i-15,
                data:DATA[i].item_data[0],
                curPage:'home',
                backInfo:{tab:'2',id:'position-'+(i-15),scroll:0},
                carousel:carousel
            });
        }

        DATA[20].item_data.forEach(function (i,index) {
            var offset = RenderParam.platformType === 'hd'? (765+index*280) : (375+index*140);
            var scroll =  RenderParam.platformType === 'hd'?-(index*270) : -(index*120);
            var mark = i.inner_parameters ? JSON.parse(i.inner_parameters).cornermark.img_url:'';

            html+='<div class="food-item" id="position-'+(index+5)+'" style="left: '+offset+'px">' +
                '     <img src="'+RenderParam.fsUrl+JSON.parse(i.img_url).normal+'"/>';
            if(mark){
                html+='<img src="'+RenderParam.fsUrl+mark+'" class="sign" style="width: auto;height: auto">';
            }

             html+=  '</div>';

            button.push({
                id: 'position-'+(index+5),
                type: 'div',
                nextFocusLeft: 'position-'+(index+5-1),
                nextFocusRight: 'position-'+(index+5+1),
                nextFocusUp: 'tab-2',
                nextFocusDown: '',
                backgroundImage:' ',
                focusImage:g_appRootPath+  '/Public/img/hd/Home/V25/recommend-bg-3.png',
                selectImage:'',
                click:Home.itemClickEvent,
                focusChange: '',
                beforeMoveChange: Utils.recordPosition,
                moveChange: Tab3Func.recommendTurnPage,
                positionIndex:(index+5),
                data:i,
                curPage:'home',
                backInfo:{tab:'2',id:'position-'+(index+5),scroll:scroll}
            });
        })

        html+='</div>';
        LMEPG.BM.addButtons(button);

        return {
            html:html,
            carouselList:carouselList
        };
    }
};

var Tab4 = {
    renderList:function () {
        var html = '<div class="tab4-main-area">';
        var len = RenderParam.albumList.count;
        var button =[];
        for(var i = 0; i<len; i++){
            var offset = RenderParam.platformType === 'hd'? i*280 : i*140;
            var scroll = RenderParam.platformType === 'hd'?-((i-3)*280) : -((i-3)*135);

                html+='<div id="position-'+i+'" class="album-list" style="left:'+offset+'px">' +
                '     <img style="width: 100%; height: 100%" src="'+RenderParam.fsUrl+RenderParam.albumList.list[i].image_url+'"/>'+
                '  </div>';
            button.push({
                id: 'position-'+i,
                type: 'div',
                nextFocusLeft: 'position-'+(i-1),
                nextFocusRight: 'position-'+(i+1),
                nextFocusUp: 'tab-3',
                nextFocusDown: '',
                backgroundImage: ' ',
                focusImage:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-3.png',
                selectImage:'',
                click:Home.itemClickEvent,
                focusChange:'',
                beforeMoveChange: Utils.recordPosition,
                moveChange:Tab4Func.albumTurnPage,
                positionIndex:i,
                curPage:'home',
                data:RenderParam.albumList.list[i],
                backInfo:{tab:'3',id:'position-'+i,scroll:i>3? scroll : 0}
            });
        }
        html+='</div>';

        LMEPG.BM.addButtons(button);
        return html;
    }

};

//--------------------------------
var Tab1Func = {
    len:DATA[6].item_data.length,
    block:false,

    recommendTurnPage:function (pre,btn,dir) {
        var leftValue = G('scroll').offsetLeft;
        var offset = RenderParam.platformType === 'hd'?250:150;

        if((btn.positionIndex === Tab1Func.len+5 && !pre) || (pre.buttonType === 'tab')) return;

        if(dir === 'right' && btn.positionIndex > 5 && !Tab1Func.block){
            G('scroll').style.left = (leftValue - offset)+'px';
            if(btn.positionIndex === Tab1Func.len+5)
                Tab1Func.block =true;
        }else if(dir=== 'left' && leftValue !== 0 && btn.positionIndex>=5){
            G('scroll').style.left = (leftValue + offset) +'px';
            Tab1Func.block = false;
        }

    },

    scrollHotText:function (btn,hasFocus) {
        if(hasFocus){
            LMEPG.UI.Marquee.start('text-'+btn.index,RenderParam.platformType==='hd'? 8 : 5,4)
            G(btn.id).style.color = '#662200';
           G('hot-play-'+btn.index).src = g_appRootPath + '/Public/img/hd/Home/V25/hot-play-choose.png';
        }else {
            LMEPG.UI.Marquee.stop()
            G(btn.id).style.color = '#fff';
            G('hot-play-'+btn.index).src = g_appRootPath + '/Public/img/hd/Home/V25/hot-play-no-choose.png';
        }
    }
};

var Tab2Func = {
    len:DATA[13].item_data.length,
    block:false,
    sureContentInfo:function (i) {
        switch (i) {
            case 0:
                return {
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-3.png',
                    right:'position-1',
                    up:'tab-1',
                    down:'bottom-item-0',
                    left:''
                };
            case 1:
                return{
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-0.png',
                    right:'position-4',
                    up:'tab-1',
                    down:'position-2',
                    left:'position-0'
                };
            case 2:
                return {
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-2.png',
                    right:'position-3',
                    up:'position-1',
                    down:'bottom-item-0',
                    left:'position-0'
                };
            case 3:
                return {
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-2.png',
                    right:'position-4',
                    up:'position-1',
                    down:'bottom-item-0',
                    left:'position-2'
                };
            case 4:
                return {
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-3.png',
                    right:'position-5',
                    up:'tab-1',
                    down:'bottom-item-0',
                    left:'position-1'
                };
        }
    },

    recommendTurnPage:function(pre,btn,dir){
        var leftValue = G('scroll').offsetLeft;
        var offset = RenderParam.platformType === 'hd'?250:150;

        if((btn.positionIndex === Tab2Func.len+4 && !pre) || (pre.buttonType === 'tab')) return;

        if(dir === 'right' && btn.positionIndex > 4 && !Tab2Func.block){
            G('scroll').style.left = (leftValue-offset )+'px';
            if(btn.positionIndex === Tab2Func.len+4)
                Tab2Func.block =true;
        }else if(dir=== 'left' && leftValue !== 0 && btn.positionIndex>3){
            G('scroll').style.left = (leftValue+offset) +'px';
            Tab2Func.block = false;
        }
    }

};

var Tab3Func = {
    len:DATA[20].item_data.length,
    block:false,

    recommendTurnPage:function(pre,btn,dir){
        var leftValue = G('scroll').offsetLeft;
        var offset = RenderParam.platformType === 'hd'? 270 : 120;

        if((btn.positionIndex === Tab3Func.len+5-1 && !pre) || (pre.buttonType === 'tab')) return;

        if(dir === 'right' && btn.positionIndex > 5 && !Tab3Func.block){
            G('scroll').style.left = (leftValue-offset) +'px';
            if(btn.positionIndex === Tab3Func.len+5-1)
                Tab3Func.block =true;
        }else if(dir=== 'left' && leftValue !== 0 && btn.positionIndex>=5){
            G('scroll').style.left = (leftValue+offset) +'px';
            Tab3Func.block = false;
        }

    },

    sureContentInfo:function (i) {
        switch (i) {
            case 0:
                return {
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-0.png',
                    right:'position-3',
                    up:'tab-2',
                    down:'position-1',
                    left:''
                };
            case 1:
                return {
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-1.png',
                    right:'position-2',
                    up:'position-0',
                    down:'',
                    left:''
                };
            case 2:
                return {
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-1.png',
                    right:'position-4',
                    up:'position-0',
                    down:'',
                    left:'position-1'
                };
            case 3:
                return {
                    bg:g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-3.png',
                    right:'position-5',
                    up:'tab-2',
                    down:'position-4',
                    left:'position-0'
                };
            case 4:
                var url = JSON.parse(DATA[19].item_data[0].img_url);
                return {
                    bg: RenderParam.fsUrl+url.focus_in,
                    normalGb:RenderParam.fsUrl+url.normal,
                    right:'position-5',
                    up:'position-3',
                    down:'',
                    left:'position-2'
                };
        }

    }
};

var Tab4Func = {
    len:RenderParam.albumList.list.length || 0,
    block:false,

    albumTurnPage:function(pre,btn,dir){
        var leftValue = G('scroll').offsetLeft;
        var offset = RenderParam.platformType === 'hd'? 280 : 135;

        if((btn.positionIndex === Tab4Func.len-1 && !pre) || (pre.buttonType === 'tab')) return;

        if(dir === 'right' && btn.positionIndex > 3 && !Tab4Func.block){
            G('scroll').style.left = (leftValue-offset) +'px';
            if(btn.positionIndex === Tab4Func.len*1-1) {
                Tab4Func.block =true;
            }
        }else if(dir=== 'left' && leftValue !== 0 && btn.positionIndex>2){
            G('scroll').style.left = (leftValue+offset) +'px';
            Tab4Func.block = false;
        }
    }
};

var Utils = {
    setPageSize:function () {
        var meta = document.getElementsByTagName('meta');
        if ((typeof meta !== "undefined") && (meta["page-view-size"] != null)) {
            if (RenderParam.platformType == "hd") {
                meta["page-view-size"].setAttribute('content', "1280*720");
            } else {
                meta["page-view-size"].setAttribute('content', "640*530");
            }
            var contentSize = meta["page-view-size"].getAttribute('content');
            if (contentSize !== '1280*720' || contentSize !== '640*530') {
                setTimeout(Utils.setPageSize, 500);
            }
        }
    },
    recordPosition:function (dir,btn) {
        nowPosition = btn.id;
    },

};

function onBack(){
    if (RenderParam.isJoinActivit == '1') {
        LMEPG.Intent.back();
    }else{
        PageEvent.holdPage()
    }
}

LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_1:' keyClick()',
        KEY_2: 'keyClick()',
        KEY_4: 'keyClick()',
        KEY_5: 'keyClick()',
        KEY_6: 'keyClick()',
        KEY_7: 'keyClick()',
        KEY_8: 'keyClick()',
        KEY_9: 'keyClick()',
        KEY_0: 'keyClick()',
    });


function keyClick() {
    if(RenderParam.areaCode === '201'){
        S('pop');
        G('cut-down').innerHTML = cutDown;
        tempId = LMEPG.BM.getCurrentButton().id;
        LMEPG.BM.requestFocus('pop-back');

        timer = setInterval(function () {
            cutDown--;
            G('cut-down').innerHTML = cutDown;
            if(cutDown < 0){
                H('pop');
                clearInterval(timer);
                LMEPG.Intent.back('IPTVPortal');
            }

        },1000);
    }
}