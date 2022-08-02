var Collect = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',
    modelDif: ["420092", "410092"],
    backId:null,
    clock:true,
    innerMenuFlag : true,
    changeClock:0,

    renderBlock:true,
    init: function () {

        // 江苏电信、宁夏广电只保留了“视频集”
        if (RenderParam.carrierId == '320092'
            || RenderParam.carrierId == '500092'
            || RenderParam.carrierId == '640094'
            || RenderParam.carrierId == '620092') {
            RenderParam.navIndex = 1;
        }
        Collect.setBeiJingAreaCode();

        Collect.page = parseInt(RenderParam.page) - 1;
        Collect.navIndex = parseInt(RenderParam.navIndex);
        Collect.keepNavFocusId = 'nav-' + Collect.navIndex;


        Collect.renderHead(function (){
            Collect.getCollectList('',RenderParam.navIndex,function () {

                Collect.render();
                Collect.createBtns();
                Collect.moveToFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : this.keepNavFocusId);


               if(RenderParam.focusId){
                   var p = RenderParam.focusId.substr(6)

                   if(p >= 8){
                       p = p % 8
                   }

                  if(G('focus-'+p)){
                      G('mask-'+ p).style.display = 'block'
                      G('play-'+ p).src = g_appRootPath+'/Public/img/hd/Collect/V25/play-choose.png'
                      G('focus-'+p).style.backgroundImage = 'url("__ROOT__/Public/img/hd/Home/V25/recommend-bg-2.png")'
                  }else if( Collect.currentData.length === 0 && Collect.page!==0 && Collect.renderBlock){
                      Collect.page--
                      Collect.render();
                      LMEPG.BM.requestFocus('focus-0')
                      Collect.renderBlock = false

                  } else{
                      G('mask-'+ (p-1)).style.display = 'block'
                      G('play-'+ (p-1)).src = g_appRootPath+'/Public/img/hd/Collect/V25/play-choose.png'
                      G('focus-'+(p-1)).style.backgroundImage = 'url("__ROOT__/Public/img/hd/Home/V25/recommend-bg-2.png")'
                      LMEPG.BM.requestFocus('focus-'+(p-1))
                  }



               }

               Collect.clock=false
                // 导航栏选中tab背景
                var btn = LMEPG.BM.getButtonById('nav-' + Collect.navIndex);
                G(btn.id).style.backgroundImage = 'url(' + (RenderParam.focusId?btn.selectedImage:btn.focusImage )+ ')';

                // 在此收藏页面，如果用户看视频时把视频取消收藏，焦点恢复时焦点会丢失，需重新判断页数、焦点
                if (!LMEPG.Func.isEmpty(RenderParam.focusId) && LMEPG.BM.getButtonById(RenderParam.focusId) == null) {
                    var focusId = RenderParam.focusId;
                    var posNum = parseInt(focusId.substr(6));
                    if (posNum > 0) {
                        Collect.moveToFocus('focus-' + (posNum - 1));
                    } else {
                        if (Collect.page > 0) {
                            Collect.prevPage();
                            Collect.moveToFocus('focus-7');
                        } else {
                            Collect.moveToFocus('nav-' + Collect.navIndex);
                        }
                    }
                }
            });
            Collect.tabDif();
        })

    },


// 特殊地区去掉专家一身模块
    tabDif: function () {
        if (Collect.modelDif.indexOf(RenderParam.carrierId) != -1) {
            delNode("nav-2");
            delNode("nav-3");
        }
    },

    setBeiJingAreaCode: function () {
        if (RenderParam.areaCode !== '205') return;

        this.keepNavFocusId = 'nav-2';
        delNode('nav-0');
        delNode('nav-1');
        var navIdx = RenderParam.navIndex;
        RenderParam.navIndex = +navIdx < 2 ? navIdx + 2 : navIdx;
    },
    // 导航索引
    navIndex: 0,
    // 当前页面数据，一页的数据
    currentData: [],
    //头部信息
    headData:[],
    // 网络获取的数据列表
    dataList: [],
    render: function () {
        var count = 8 //this.navIndex > 1 ? 5 : 8;
        this.maxPage = Math.floor((this.dataList.length - 1) / count);
        var page = this.page * count;
        var maxPage = this.maxPage;
        this.currentData = this.dataList.slice(page, page + count);
        var htm = '';
        var isNullData = this.isNullData();
        if (isNullData) {
            maxPage = 1;
        } else {
            this.currentData.forEach(function (t, i) {
                // 收藏按钮图片
                if (t.collectStatus == 1 || t.collectStatus == undefined) {
                    var collectStatusImg = '/Public/img/hd/Collect/V25/cancel-collect.png';
                } else {
                    var collectStatusImg = '/Public/img/hd/Collect/V13/cancel_choose.png';
                }

                // 视频、视频集、医生、专家图片

                var image = RenderParam.fsUrl + t.image_url;

                htm += '<li style="position: relative" id=focus-' + i + ' pos=' + (i + page) + '>' +
                    '<img onerror="this.src=\'/Public/img/Common/default.png\'" src=' + image + '>'
                if(t.subject_id){
                    htm+='<div class="how-long">'+t.content_cnt+'集</div>'
                }
                htm+=   '<div class="mask" id="mask-'+i+'" style="display: none">' +
                    '<img  class="play" id="play-' + i + '" src="__ROOT__/Public/img/hd/Collect/V25/play.png" pos=' + (i + page) + '>'+
                    '<img  class="uncollect" id="uncollect-' + i + '" src=' + collectStatusImg + ' pos=' + (i + page) + '>' +
                    '</div>'

            });
            G('list-wrapper').innerHTML = htm;
        }
        if (this.dataList.length == 0) {
            G('page-index').innerHTML = '0/0';
        } else {
            G('page-index').innerHTML = (this.page + 1) + '/' + (maxPage + 1);
        }
        this.toggleArrow();
    },

    renderHead:function (success){
        var html = '';
        Collect.headData = [0,1,2]
        var text = ['全部视频', '单个视频', '视频集锦']
        for (var i = 0; i < 3; i++) {
            html += '<p id="nav-' + i + '" pos="' + i + '">' + text[i] + '</p>'
        }

        G('nav-container').innerHTML = html

        success()

    },

    // 空数据处理
    isNullData: function () {
        if (this.currentData.length == 0) {
            // G('list-wrapper').innerHTML = '<div class=null-data>该栏目还没有内容哦~';
            G('null-data-000051').style.display = 'block';
            H('list-container');
            return true;
        }
        G('null-data-000051').style.display = 'none';
        S('list-container');
        return false;
    },
    /*导航焦点保持*/
    isLeaveNav: false,
    keepNavFocusId: 'nav-0',
    onMoveChangeKeepNavFocus: function (key, btn) {
        // 如果当前tab下无数据，则禁止焦点向下
        if (Collect.dataList.length == 0 && key == 'down') {
            return false;
        }
        var _this = Collect;
        if (key == 'up' || key == 'down') {
            _this.isLeaveNav = true;
            _this.keepNavFocusId = btn.id;
        }

    },
    // 上一页
    prevPage: function (btn) {
        this.page--;
        this.render();
    },
    // 下一页
    nextPage: function (btn) {

        this.page++;
        this.render();
    },
    onMoveChangeFocusId: function (key, btn) {
        var _this = Collect;
        var indexID = btn.id.slice(btn.id.length - 1);
        var pos = parseInt(G(btn.id).getAttribute('pos'));

        switch (key) {
            // 移动到焦点保持的导航条上
            case 'up' :
                Collect.innerMenuFlag=!Collect.innerMenuFlag
                G('play-'+(pos-Collect.page*8)).src = g_appRootPath+'/Public/img/hd/Collect/V25/play-choose.png'
                G('uncollect-'+(pos-Collect.page*8)).src = g_appRootPath+'/Public/img/hd/Collect/V25/cancel-collect.png'
                Collect.changeClock = 0
                console.log(pos-Collect.page*8)
                if(!Collect.innerMenuFlag){
                    if (indexID < 4 && btn.id.substr(0, 5) == 'focus') {
                        Collect.innerMenuFlag =true
                        _this.moveToFocus(_this.keepNavFocusId);
                        G('mask-'+(pos-Collect.page*8)).style.display = 'none'
                        return false;
                    }else {
                        console.log(parseInt(btn.id.substr(6))-4)
                        _this.moveToFocus('focus-'+(parseInt(btn.id.substr(6))-4));
                        Collect.innerMenuFlag =true
                    }
                }

                break;
            // 向右翻页
            case 'right':
                Collect.innerMenuFlag = true
                Collect.changeClock = 0
                if (_this.page == _this.maxPage) {
                    return;
                }

                var turnNextCondition = {
                    video: _this.navIndex < Collect.headData.length && (btn.id == 'focus-3' || btn.id == 'focus-7' || btn.id == 'uncollect-3' || btn.id == 'uncollect-7'),// 视频、视频集
                };

                if (turnNextCondition.video ) {
                    _this.nextPage(btn);
                    _this.moveToFocus('focus-0');
                    G('mask-0').style.display = 'block'
                    G('play-0').src = g_appRootPath+'/Public/img/hd/Collect/V25/play-choose.png'
                    return false;
                }
                break;
            case 'left':
                Collect.innerMenuFlag = true
                Collect.changeClock = 0
                console.log(btn.id, _this.page);
                if (_this.page == 0) {
                    return;
                }
                var turnPrevCondition = {
                    video: _this.navIndex < Collect.headData.length && (btn.id == 'focus-0' || btn.id == 'focus-4' || btn.id == 'uncollect-0' || btn.id == 'uncollect-4')

                };
                if (turnPrevCondition.video) {
                    _this.prevPage(btn);
                    var moveToId = 'focus-7';
                    _this.moveToFocus(moveToId);
                    G('mask-7').style.display = 'block'
                    G('play-7').src = g_appRootPath+'/Public/img/hd/Collect/V25/play-choose.png'
                    return false;
                }
                break;
            case 'down':
                Collect.changeClock++
                var len =  Collect.currentData.length

                if(Collect.changeClock <= 2 ) {
                    Collect.innerMenuFlag = false
                    G('play-' + (pos - Collect.page * 8)).src =g_appRootPath+ '/Public/img/hd/Collect/V25/play.png'
                    G('uncollect-' + (pos - Collect.page * 8)).src =g_appRootPath+ '/Public/img/hd/Collect/V25/cancel-collect-choose.png'

                    if ((pos - Collect.page * 8 + 4 >= len) && (Collect.changeClock === 2)) {
                        if (len > 4 && len < 8 && pos - Collect.page * 8 < 4) {
                            LMEPG.BM.requestFocus('focus-' + (len - 1))
                        } else {
                            LMEPG.BM.requestFocus('first-page')
                            G('mask-' + (pos - Collect.page * 8)).style.display = 'none'
                        }

                        Collect.changeClock = 0
                        Collect.innerMenuFlag = true
                        return
                    }

                    if (Collect.changeClock === 2 && pos + 4 > 3 * (Collect.page + 1)) {

                        G('mask-' + (pos - Collect.page * 8)).style.display = 'none'
                        Collect.innerMenuFlag = true
                        Collect.changeClock = 0

                        var id = 'focus-' + ((pos + 4) % 8)
                        LMEPG.BM.requestFocus(G(id) ? 'focus-' + ((pos + 4) % 8) : 'focus-' + (Collect.currentData.length - 1))

                    }

                }
                // 视频或视频集，在最后一页，焦点在第一行收藏按钮上，焦点下面却没有按钮，则焦点移动到第二行最后一个
                // if (parseInt(btn.id.substr(10)) <= 3 && Collect.navIndex < 3 && Collect.page == Collect.maxPage) {
                //     if (LMEPG.Func.isEmpty(LMEPG.BM.getButtonById(LMEPG.BM.getNextFocusDownId(btn.id)))) {
                //         LMEPG.BM.requestFocus('focus-' + (Collect.dataList.length % 8 - 1));
                //         return false;
                //     }
                // }
                break;
        }
    },
    timer:null,
    /*导航获得焦点渲染视频列表*/
    onFocusChangeVideoList: function (btn, hasFocus) {
        var _this = Collect;
        if (hasFocus) {
            console.log(LMEPG.BM.getPreviousButton());
            // 焦点从列表跳到tab，tab获取焦点，但是不获取数据
            var previousBtn = LMEPG.BM.getPreviousButton();
            G(btn.id).style.color = '#662200'

            if (!LMEPG.Func.isEmpty(previousBtn) && previousBtn.id.substr(0, 5) == 'focus') {
                _this.isLeaveNav = false;
                return;
            }

            if(Collect.clock) return
            // 获取收藏列表
            if(Collect.timer){
                clearTimeout(Collect.timer)
            }

            Collect.timer = setTimeout(function (){
                var itemType = parseInt(btn.id.slice(btn.id.length - 1)) ;

                Collect.getCollectList('',itemType, function () {
                    _this.page = 0;
                    _this.navIndex = btn.id.slice(btn.id.length - 1);
                    _this.render();
                    _this.isLeaveNav = false;
                    _this.addButtons()
                    if (_this.navIndex > 1 && Collect.dataList.length > 0) {
                        G('list-wrapper').className = '';
                    } else {
                        G('list-wrapper').className = '';
                    }
                });
            },500)

        } else {
            G(btn.id).style.color = '#fff'
            if (_this.isLeaveNav) {
                G(btn.id).style.backgroundImage = 'url(' + btn.selectedImage + ')';
            }
        }
        _this.toggleFocus(btn, hasFocus);
    },
    /*箭头指示切换*/
    toggleArrow: function () {
        S('prev-arrow');
        S('next-arrow');
        this.page == 0 && H('prev-arrow');
        this.page == this.maxPage && H('next-arrow');
        this.currentData.length == 0 && H('next-arrow');
    },
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('channelIndex');
        return objCurrent;
    },

    toggleFocus: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.className = 'focus';
        } else {
            btnElement.className = '';
        }
    },
    onFocusChangeBgImg: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus && Collect.navIndex > 1) {
            //btnElement.style.backgroundImage = 'url(' + (RenderParam.platformType == 'sd' ? '/Public/img/sd/Unclassified/V13/doctor_f.png' : g_appRootPath + '/Public/img/hd/Collect/V13/radius_f.png') + ')';
        } else {
            //	默认
        }
    },
    createBtns: function () {
        var NAV_COUNT = Collect.headData.length;
        while (NAV_COUNT--) {
            this.buttons.push({
                id: 'nav-' + NAV_COUNT,
                name: '导航',
                type: 'div',
                nextFocusLeft: 'nav-' + (NAV_COUNT - 1),
                nextFocusRight: 'nav-' + (NAV_COUNT + 1),
                nextFocusDown: 'focus-0',
                backgroundImage: " ",
                focusImage:g_appRootPath+'/Public/img/hd/Channel/V25/nav-choose.png',
                selectedImage:g_appRootPath+'/Public/img/hd/Channel/V25/nav-has-choose.png',
                beforeMoveChange: this.onMoveChangeKeepNavFocus,
                focusChange: this.onFocusChangeVideoList
            });
        }
        var VIDEO_COUNT = 8;

        while (VIDEO_COUNT--) {
            this.buttons.push({
                id: 'focus-' + VIDEO_COUNT,
                name: '视频',
                type: 'div',
                nextFocusLeft: 'focus-' + (VIDEO_COUNT - 1),
                nextFocusRight: 'focus-' + (VIDEO_COUNT + 1),
                nextFocusUp:"",//  'focus-' + (VIDEO_COUNT - 4),
                nextFocusDown:"",//VIDEO_COUNT + 4 >= Collect.currentData.length?'focus-'+(Collect.currentData.length-1) :'focus-' + (VIDEO_COUNT + 4),
                backgroundImage:g_appRootPath+ '/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V13/video_list_f.png' : g_appRootPath+'/Public/img/hd/Home/V25/recommend-bg-2.png',
                click: this.toPlayVideo,
                beforeMoveChange: this.onMoveChangeFocusId,
                focusChange: this.onFocusChangeBgImg,
                moveChange: Collect.showMenu,
            }, {
                id: 'uncollect-' + VIDEO_COUNT,
                name: '收藏',
                type: 'img',
                nextFocusDown: '',
                nextFocusUp: 'play-' + VIDEO_COUNT,
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage:g_appRootPath+ '/Public/img/hd/Collect/V25/cancel-collect.png',
                focusImage: g_appRootPath+'/Public/img/hd/Collect/V25/cancel-choose-choose.png',
                click: Collect.onClickCollect,
                beforeMoveChange: this.onMoveChangeFocusId
            },{
                id: 'play-' + VIDEO_COUNT,
                name: '播放',
                type: 'img',
                nextFocusDown: 'uncollect-' + VIDEO_COUNT,
                nextFocusUp: '',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Collect/V25/play.png',
                focusImage:g_appRootPath+'/Public/img/hd/Collect/V25/play-choose.png',
                click: Collect.onClickImg,
                beforeMoveChange: ''
            });
        }

        this.buttons.push({
            id: 'first-page',
            name: '首页',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'focus-0',
            nextFocusLeft: '',
            nextFocusRight: 'prev-page',
            backgroundImage:g_appRootPath+ '/Public/img/hd/Channel/V25/first_page.png',
            focusImage: g_appRootPath+'/Public/img/hd/Channel/V25/first_page_f.png',
            click: function () {
                if(Collect.page === 0) return

                Collect.page = 0;
                Collect.render();
            },
            beforeMoveChange: ''
        },{
            id: 'prev-page',
            name: '上一页',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'focus-0',
            nextFocusLeft: 'first-page',
            nextFocusRight: 'next-page',
            backgroundImage: g_appRootPath+'/Public/img/hd/Channel/V25/prev_page.png',
            focusImage:g_appRootPath+ '/Public/img/hd/Channel/V25/prev_page_f.png',
            click: function () {
                if (Collect.page == 0) {
                    return;
                }
                Collect.prevPage()
            },
            beforeMoveChange: ''
        },{
            id: 'next-page',
            name: '下一页',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'focus-0',
            nextFocusLeft: 'prev-page',
            nextFocusRight: 'last-page',
            backgroundImage: g_appRootPath+'/Public/img/hd/Channel/V25/next_page.png',
            focusImage:g_appRootPath+ '/Public/img/hd/Channel/V25/next_page_f.png',
            click: function () {
                if (Collect.page == Collect.maxPage) {
                    return;
                }
                Collect.nextPage();
            },
            beforeMoveChange: ''
        },{
            id: 'last-page',
            name: '尾页',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'focus-0',
            nextFocusLeft: 'next-page',
            nextFocusRight: '',
            backgroundImage: g_appRootPath+'/Public/img/hd/Channel/V25/last_page.png',
            focusImage:g_appRootPath+ '/Public/img/hd/Channel/V25/last_page_f.png',
            click: function () {
                if (Collect.page == Collect.maxPage) {
                    return;
                }
                Collect.page = Collect.maxPage
                Collect.render();
            },
            beforeMoveChange: ''
        })
        var id = ''
        if(!LMEPG.Func.isEmpty(RenderParam.focusId)){
            id = RenderParam.focusId
            var num = id.substr(6)
            if( num >= 8){
                id = 'focus-'+ (num % 8)
            }
        }else {
            id = this.keepNavFocusId
        }

        this.initButtons(id);
    },

    addButtons:function (){
        var buttons=[]
        var VIDEO_COUNT = 8;

        while (VIDEO_COUNT--) {
            buttons.push({
                id: 'focus-' + VIDEO_COUNT,
                name: '视频',
                type: 'div',
                nextFocusLeft: 'focus-' + (VIDEO_COUNT - 1),
                nextFocusRight: 'focus-' + (VIDEO_COUNT + 1),
                nextFocusUp:"",//  'focus-' + (VIDEO_COUNT - 4),
                nextFocusDown:"",//VIDEO_COUNT + 4 >= Collect.currentData.length?'focus-'+(Collect.currentData.length-1) :'focus-' + (VIDEO_COUNT + 4),
                backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath+'/Public/img/sd/Unclassified/V13/video_list_f.png' :g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-2.png',
                click: this.toPlayVideo,
                beforeMoveChange: this.onMoveChangeFocusId,
                focusChange: this.onFocusChangeBgImg,
                moveChange: Collect.showMenu,
            }, {
                id: 'uncollect-' + VIDEO_COUNT,
                name: '收藏',
                type: 'img',
                nextFocusDown: '',
                nextFocusUp: 'play-' + VIDEO_COUNT,
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Collect/V24/cancel.png',
                focusImage: g_appRootPath+'/Public/img/hd/Collect/V24/cancel_choose.png',
                click: Collect.onClickCollect,
                beforeMoveChange: this.onMoveChangeFocusId
            },{
                id: 'play-' + VIDEO_COUNT,
                name: '播放',
                type: 'img',
                nextFocusDown: 'uncollect-' + VIDEO_COUNT,
                nextFocusUp: '',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Collect/V24/play.png',
                focusImage:g_appRootPath+ '/Public/img/hd/Collect/V24/play_choose.png',
                click: Collect.onClickImg,
                beforeMoveChange: ''
            });
        }

        LMEPG.BM.addButtons(buttons)
    },

    initButtons: function (id) {
        LMEPG.ButtonManager.init(id, this.buttons, '', true);
    },

    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    toPlayVideo:function (btn){
        Collect.innerMenuFlag? Collect.onClickImg(btn):Collect.onClickCollect(btn)
    },

    showMenu:function (pre,btn){
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        Collect.backId = pos

        if(Collect.changeClock === 0){
            if(pre && pre.id){
                var prePos = parseInt(G(pre.id).getAttribute('pos'));
                if(G('mask-'+(prePos-Collect.page*8)))
                    G('mask-'+(prePos-Collect.page*8)).style.display = 'none'
            }


            G('mask-'+(pos-Collect.page*8)).style.display = 'block'
            G('play-'+(pos-Collect.page*8)).src =g_appRootPath+ '/Public/img/hd/Collect/V25/play-choose.png'
            G('uncollect-'+(pos-Collect.page*8)).src =g_appRootPath+ '/Public/img/hd/Collect/V25/cancel-collect.png'
        }
    },
    /**
     * 点击列表图片
     */
    onClickImg: function (btn) {
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        Collect.backId = pos

        if(Collect.dataList[pos].subject_id){
            PageJump.jumpVideoSet(btn);
        }else {
            var videoData = Collect.dataList[pos];
            var play_url = videoData.ftp_url;
            var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
            var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
            // 创建视频信息
            var videoInfo = {
                'sourceId': videoData.source_id,
                'videoUrl': videoUrl,
                'title': videoData.title,
                'type': videoData.model_type,
                'userType': videoData.user_type,
                'freeSeconds': videoData.free_seconds,
                'entryType': 1,
                'entryTypeName': 'home',
                'focusIdx': btn.id,
                'unionCode': videoData.union_code,
                'show_status': videoData.show_status
            };
            //视频专辑下线处理
            if (videoInfo.show_status == "3") {
                LMEPG.UI.showToast('该节目已下线');
                return;
            }
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                PageJump.jumpPlayVideo(videoInfo);
            } else {
                PageJump.jumpBuyVip(videoInfo.title, videoInfo);
            }
        }


        // 点击视频集
        //if (Collect.navIndex == 1) {
            //PageJump.jumpVideoSet(btn);
        //}
        // 跳转医生页面
        //else if (Collect.navIndex == 2) {
            //PageJump.jumpDoctorPage(btn);
        //
        // 跳转专家页面
        //else {
        //    PageJump.jumpExpertPage(btn);
       // }
    },

    /**
     * 点击收藏按钮
     * @param btn
     */
    onClickCollect: function (btn) {
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        Collect.backId = pos

        if (Collect.dataList[pos].collectStatus == undefined || Collect.dataList[pos].collectStatus == 1) {
            var type = 1;
        } else {
            var type = 0;
        }
        var itemType = Collect.dataList[pos].subject_id?2:1;
        // 不同种类的收藏，id不一样
        var itemId = Collect.dataList[pos].subject_id?Collect.dataList[pos].subject_id:Collect.dataList[pos].source_id

        Collect.setCollectStatus(type, itemType, itemId, pos, btn.id);
    },

    /**
     * 获取收藏列表
     * @param itemType
     */
    getCollectList: function (parentType,itemType,callback) {
        LMEPG.UI.showWaitingDialog();

        Collect.dataList = []

        if(itemType == 0){
            for (var i=1;i<3;i++){
                Collect.getCollectData(i,callback)
            }
        }else {
            Collect.getCollectData(itemType, callback)
        }
    },

    getCollectData:function(itemType,callback){
        var postData = {
            'item_type': itemType, // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
            'parent_model_type':''
        };

        LMEPG.ajax.postAPI('Collect/getCollectListNew', postData, function (rsp) {
            var collectData = rsp instanceof Object ? rsp : JSON.parse(rsp);
            console.log(collectData);
            if (collectData.result == 0 ) {
                Collect.dataList =Collect.dataList.concat(collectData.list);
                callback()
            } else {
                //LMEPG.UI.showToast('数据获取失败！');
            }

            LMEPG.UI.dismissWaitingDialog();
        });
    },
    /**
     * 设置收藏状态
     * @param type
     * @param itemType
     * @param itemId
     * @param index 当前项的数组下标
     * @param btnId 元素id
     */
    setCollectStatus: function (type, itemType, itemId, index, btnId) {
        var postData = {
            'type': type, // 类型（0收藏 1取消收藏）
            'item_type': itemType, // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
            'item_id': itemId // 收藏对象id
        };
        // postData.type = 0;
        // postData.item_type = 2;
        // postData.item_id = 571;

        console.log(Collect.backId % 8)
        LMEPG.ajax.postAPI('Collect/setCollectStatusNew', postData, function (rsp) {
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(collectItem);
                if (collectItem.result == 0) {
                    if (postData.type == 0) {
                        //收藏成功
                        G(btnId).src =g_appRootPath+ '/Public/img/hd/Collect/V13/uncollect_f.png';
                        Collect.dataList[index].collectStatus = 1;
                        // 更新按钮的图片
                        for (var i = 0; i < Collect.buttons.length; i++) {
                            if (Collect.buttons[i].id == btnId) {
                                Collect.buttons[i].backgroundImage =g_appRootPath+ '/Public/img/hd/Collect/V13/uncollect.png';
                                Collect.buttons[i].focusImage =g_appRootPath+ '/Public/img/hd/Collect/V13/uncollect_f.png';
                                break;
                            }
                        }
                    } else {

                        Collect.dataList.splice(Collect.backId,1);
                        if( Collect.backId % 8 === 0 && Collect.page !== 0){
                            Collect.page--
                        }

                        Collect.render();

                        (Collect.backId*1-1<0)?
                            LMEPG.BM.requestFocus('nav-'+Collect.navIndex)
                            :
                            LMEPG.BM.requestFocus('focus-'+((Collect.backId-1) % 8));

                        if(Collect.backId*1-1>=0){
                            var position = Collect.backId*1-1>=0?Collect.backId*1-1:'0'
                            G('mask-'+position % 8).style.display = 'block'
                            G('play-'+position % 8).src = g_appRootPath+'/Public/img/hd/Collect/V25/play-choose.png'
                            G('uncollect-'+position % 8).src = g_appRootPath+'/Public/img/hd/Collect/V25/cancel-collect.png'

                        }

                        Collect.innerMenuFlag = true
                        Collect.changeClock = 0
                    }
                } else {
                    LMEPG.UI.showToast('操作失败');
                }
            } catch (e) {
                console.log(e)
                LMEPG.UI.showToast('操作异常');
            }
        });
    }
};

/**
 * ===============================处理跳转===============================
 */
var PageJump = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('collect');
        currentPage.setParam('navIndex', Collect.navIndex);
        currentPage.setParam('page', Collect.page + 1);
        currentPage.setParam('focusId','focus-'+Collect.backId);
        return currentPage;
    },

    /**
     * 跳转购买vip页面
     */
    jumpBuyVip: function (remark, videoInfo) {
        if (typeof (videoInfo) !== "undefined" && videoInfo !== "") {
            var postData = {
                "videoInfo": JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
            });
        }

        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        jumpObj.setParam("userId", RenderParam.userId);
        jumpObj.setParam("isPlaying", "1");
        jumpObj.setParam("remark", remark);
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        var objHome = PageJump.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    },

    /**
     * 跳转视频集
     */
    jumpVideoSet: function (btn) {
        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('channelList');
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        jumpObj.setParam('subject_id', Collect.dataList[pos].subject_id);
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转到医生页面
     */
    jumpDoctorPage: function (btn) {
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        var doctorIndex = Collect.dataList[pos].doctor_id;
        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('doctorDetails');
        jumpObj.setParam('doctorIndex', doctorIndex); // 传递点击具体那个医生的索引
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转到专家页面
     */
    jumpExpertPage: function (btn) {
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        var clinic_id = Collect.dataList[pos].clinic_id;
        var objCurrent = PageJump.getCurrentPage(btn);
        var jumpObj = LMEPG.Intent.createIntent('expertDetail');
        jumpObj.setParam('clinic', clinic_id);
        LMEPG.Intent.jump(jumpObj, objCurrent);
    }

};

var onBack = function () {
    LMEPG.Intent.back();
};