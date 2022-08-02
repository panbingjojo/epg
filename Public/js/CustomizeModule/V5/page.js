var albumList = [
    {album:'album526',name:'要做好冬季防护，预防急性心梗'},
    {album:'album525',name:'流感正当时，专家有良方' },
    {album:'album500',name:'霜降过后，日益见凉' },
    {album:'album524',name:'寒冬来袭健胃养脾' },
    {album:'album380',name:'凉风至，白露降，记得添被子' },
    {album:'album117_2',name:'口腔溃疡怎么办？——别啥都怪上火' },
    {album:'album147',name:'帕金森病“药”早知道' },
    {album:'album364',name:'枸杞配啤酒，活到九十九？' },
    {album:'album354',name:'家有一老，如有一宝' },
    {album:'album293',name:'中老年人过冬指南 ' },
    {album:'album544',name:'五脏养生肝为首' },
    {album:'album521',name:'诱发头晕的病因' },
    {album:'album520',name:'要当心“结石”来了！' },
    {album:'album169',name:'糖尿病误区知多少？' },
]

var classroomList = [
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom60.jsp',name:'老年人健身入门'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom61.jsp',name:'老年人健身日常正确姿势'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom62.jsp',name:'广场舞悠悠情歌'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom64.jsp',name:'杨氏太极拳'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom65.jsp',name:'广场舞赞美风光'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom68.jsp',name:'广场舞边疆情歌系列'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom69.jsp',name:'广场舞草原风系列一'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom67.jsp',name:'广场舞草原风系列二'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom66.jsp',name:'广场舞经典情歌系列一'},
    {album:'http://222.217.76.3:9191/iptv-health-epg-v3/login_recom63.jsp',name:'广场舞经典情歌系列二'},
]

var healthScroll = [0, -333, -673, -1005];
var classRoomScroll = [0, -333, -673];
var tRight = [3,7,11,15]

/** 按返回键 */
function onBack() {
    LMEPG.Intent.back("IPTVPortal");
}

var Page = {
    pageIndex:0,
    nowTab:0,

    init:function () {
        var json = null;
        this.initButton();
        if(RenderParam.focusIndex){
            json = JSON.parse(RenderParam.focusIndex);
            RenderParam.page === '0'? this.renderHealthContent():this.renderHealthContent();
            console.log(json,88)
            var temp = RenderParam.page === '0'? healthScroll : classRoomScroll;
            Page.pageIndex = parseInt(json.top) ;

            if( RenderParam.page === '0'){
                G('health').src = g_appRootPath + '/Public/img/hd/CustomizeModule/V5/health-s.png';

            }else {
                G('classroom').src = g_appRootPath + '/Public/img/hd/CustomizeModule/V5/classroom-s.png';
            }

            G('main').style.marginTop =temp[json.top]+'px';

        }else {
            this.renderHealthContent();
        }

        LMEPG.BM.init(json?json.id:'health',[]);
    },

    initButton:function () {
       var buttons = [{
           id: 'health',
           name: '',
           type: 'img',
           nextFocusDown:'item-0',
           nextFocusLeft:'',
           nextFocusRight:'classroom',
           focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V5/health-f.png',
           backgroundImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V5/health.png',
           selectImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V5/health-s.png',
           beforeMoveChange: Page.changeHeadPic,
           focusChange:Page.changeType,
           tab:0
       },{
           id: 'classroom',
           name: '',
           type: 'img',
           nextFocusDown:'item-0',
           nextFocusLeft:'health',
           nextFocusRight:'',
           focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V5/classroom-f.png',
           backgroundImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V5/classroom.png',
           selectImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V5/classroom-s.png',
           beforeMoveChange: Page.changeHeadPic,
           focusChange:Page.changeType,
           tab:1
       }]

        LMEPG.BM.addButtons(buttons);
    },

    renderHealthContent:function () {
        var html = '';
        var buttons = [];

        albumList.forEach(function (item,index) {
            var src = '/Public/img/hd/CustomizeModule/V5/album-'+index+'.png'
            html+='<div class="item" id="item-'+index+'">' +
                    '<img src="'+g_appRootPath+'/Public/img/hd/CustomizeModule/V5/free-icon.png'+'" class="icon"/>'+
                    '<img src="'+(g_appRootPath+src)+'">' +
                    '<div class="bottom-area" id="text-'+index+'">' +
                            item.name+
                    '</div>'+
                '</div>'

            buttons.push({
                id: 'item-'+index,
                name: '',
                type: 'div',
                nextFocusUp:index <=3 ? 'health' : 'item-'+(index-4),
                nextFocusDown:'item-'+(index+4),
                nextFocusLeft:index % 4 === 0 ?'' : 'item-'+(index-1),
                nextFocusRight:tRight.indexOf(index)!== -1 ?'' : 'item-'+(index+1),
                focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V5/border-pic.png',
                backgroundImage: ' ',
                beforeMoveChange:Page.turnPage,
                click:Page.toAlbum,
                album:item.album,
                scrollId: "text-"+index,
                focusChange:Page.scrollText
            })

        })

        LMEPG.BM.addButtons(buttons);
        G('main').innerHTML = html;
    },

    renderClassroomContent:function(){
        var html = '';
        var buttons = [];

        classroomList.forEach(function (item,index) {
            var src = '/Public/img/hd/CustomizeModule/V5/t-album-'+index+'.jpg'
            html+='<div class="item" id="item-'+index+'">' +
                '<img src="'+g_appRootPath+'/Public/img/hd/CustomizeModule/V5/free-icon.png'+'" class="icon"/>'+
                '<img src="'+(g_appRootPath+src)+'">' +
                '<div class="bottom-area" id="text-'+index+'">' +
                item.name+
                '</div>'+
                '</div>'

            buttons.push({
                id: 'item-'+index,
                name: '',
                type: 'div',
                nextFocusUp:index <=3 ? 'classroom' : 'item-'+(index-4),
                nextFocusDown:'item-'+(index+4),
                nextFocusLeft:index % 4 === 0 ?'' : 'item-'+(index-1),
                nextFocusRight:tRight.indexOf(index)!== -1? '' : 'item-'+(index+1),
                focusImage: g_appRootPath + '/Public/img/hd/CustomizeModule/V5/border-pic.png',
                backgroundImage: ' ',
                beforeMoveChange:Page.turnPage,
                click:Page.toClassRoom,
                album:item.album,
                scrollId: "text-"+index,
                focusChange:Page.scrollText
            })

        })

        LMEPG.BM.addButtons(buttons);
        G('main').innerHTML = html;
    },

    changeType:function(btn, hasFocus){
        if(hasFocus){
            Page.nowTab = btn.tab;
            btn.tab === 0? Page.renderHealthContent() : Page.renderClassroomContent()
        }
    },

   changeHeadPic:function(dir, btn){
        if (dir === 'down'){
            setTimeout(function () {
                G(btn.id).src = btn.selectImage;
            },50)
        }
    },

    scrollText:function(btn,hasFocus){
        if(hasFocus){
            LMEPG.UI.Marquee.start(btn.scrollId,9);
        }else {
            LMEPG.UI.Marquee.stop();
        }
    },

    turnPage:function (dir, btn) {
        var nowList =  Page.nowTab === 0 ? healthScroll : classRoomScroll

        if(dir === 'down'){
            if(Page.pageIndex === nowList.length - 1 )
                return

            if(!G(btn.nextFocusDown)){
                var index = btn.nextFocusDown.substr(5);
                while (!G('item-'+index)){
                    index--;
                }

                LMEPG.BM.requestFocus('item-'+index);
            }

            Page.pageIndex++;
            G('main').style.marginTop = nowList[Page.pageIndex] + 'px';

        }else if(dir === 'up'){
            if(Page.pageIndex === 0)
                return
            Page.pageIndex--;
            G('main').style.marginTop = nowList[Page.pageIndex] + 'px';
        }
    },

    getCurrentPage:function(){
        var objCurrent = LMEPG.Intent.createIntent('customizeModule');

        objCurrent.setParam("focusIndex", JSON.stringify({
            id:LMEPG.BM.getCurrentButton().id,
            top:Page.pageIndex
        }));

        objCurrent.setParam("page",Page.nowTab);

        return objCurrent
    },

    toAlbum:function(btn){
        var  objCurrent = Page.getCurrentPage();
        var objAlbum = LMEPG.Intent.createIntent('album');

        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', btn.album);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objCurrent);
    },

    toClassRoom:function (btn) {
        var  objCurrent = Page.getCurrentPage();
        var jumpThirdParty= LMEPG.Intent.createIntent('third-party-sp');
        jumpThirdParty.setParam('thirdUrl', btn.album);
        jumpThirdParty.setParam('carrierId', carrierId);
        LMEPG.Intent.jump(jumpThirdParty, objCurrent);
    }
}