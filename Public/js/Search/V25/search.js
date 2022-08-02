// 全局变量
var buttons = [];
var nineKeyboardClickStatus = false;//T形键盘状态;0为弹出，1弹出键盘；
var searchTextTips = "请输入首字母进行搜索"; //搜索框中的文字提示
var searchTitleInit = "大家都在看";           //初始化的搜索标题
var searchTitleWithWord = "搜索结果";        //使用字母+数字搜索的标题
var uiSearchTitleElement;                     // 搜索结果的标题
var uiSearchTextElement = "";          // 搜索文字
//T形键盘值映射
var keyCodeMapping = {
    //确定，左上右下
    "focus-1-2": ["B", 'A', '2', 'C', ''],
    "focus-1-3": ["E", 'D', '3', 'F', ""],
    "focus-2-1": ["H", 'G', '4', 'I', ""],
    "focus-2-2": ["K", 'J', '5', 'L', ''],
    "focus-2-3": ["N", 'M', '6', 'O', ''],
    "focus-3-1": ["Q", 'P', '7', 'R', "S"],
    "focus-3-2": ["U", 'T', '8', 'V', ''],
    "focus-3-3": ["X", 'W', '9', 'Y', "Z"]
};

//返回按键
function onBack() {
    Page.onBack();
}

//页面跳转
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("search");
        currentPage.setParam("focusIndex", LMEPG.ButtonManager.getCurrentButton().id);
        currentPage.setParam("pageCurrent", CollectionContent.currentPage);
        currentPage.setParam("searchText", uiSearchTextElement.innerHTML);
        currentPage.setParam("focusNav", CollectionContent.currentNav)
        return currentPage;
    },

    /**
     * 跳转 - 播放器
     */
    jumpPlayVideo: function (videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast("视频信息为空！");
            return;
        }

        var objcurrent = Page.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objcurrent);
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
        var objcurrent = Page.getCurrentPage();

        // 订购首页
        var objOrderHome = LMEPG.Intent.createIntent("orderHome");
        objOrderHome.setParam("remark", remark);
        objOrderHome.setParam("isPlaying", 1);
        objOrderHome.setParam("singlePayItem", typeof (singlePayItem) !== "undefined" ? singlePayItem : 1);

        LMEPG.Intent.jump(objOrderHome, objcurrent);
    },

    /**
     * 返回事件
     */
    onBack: function () {
        if (typeof (nineKeyboardClickStatus) !== "undefined" && nineKeyboardClickStatus) {
            //T形框显示
            KeyWord.updateNineKeyboardSrcWithBack();
        } else {
            LMEPG.Intent.back();
        }
    },

    jumpSeriesPage:function (id) {
        var objcurrent = Page.getCurrentPage();
        var jumpAgreementObj = LMEPG.Intent.createIntent('channelList');
        jumpAgreementObj.setParam('subject_id', id);
        LMEPG.Intent.jump(jumpAgreementObj, objcurrent);
    },

    jumpAlbumPage:function (name) {
        var objcurrent = Page.getCurrentPage();
        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', name);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objcurrent);
    },

    jumpDocPage:function(docId){
        var objCurrent =  Page.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('doctorDetails');
        jumpObj.setParam('doctorIndex', docId); // 传递点击具体那个医生的id
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    jumpExpertPage:function (clinic_id) {
        var objCurrent =  Page.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('expertDetail');
        jumpObj.setParam('clinic', clinic_id);
        LMEPG.Intent.jump(jumpObj, objCurrent);
    }
};

/**
 * 健康视频搜索模块
 */
var HealthSearch = {
    /**
     * 初始化页面
     */
    init: function () {
        if(RenderParam.carrierId == '630092'){
            //数据探针上报
            var dataRP ={
                userId:RenderParam.userId,
                pageKey:window.location.pathname,
                pageType:'searchPage',
            }
            DataReport.getValue(1,dataRP);
        }
        //初始化参数
        //uiSearchTitleElement = document.getElementById("searchTitle");
        uiSearchTextElement = document.getElementById("searchText")
        //初始化键盘
        KeyWord.init();
        //初始化搜索结果,并初始化焦点
        CollectionContent.init();
    },
};

//键盘对象（左边）
var KeyWord = {
    //弹出键盘事件
    init: function () {
        var fixPath = RenderParam.carrierId==='000051'?'LT/':''
        buttons.push(
            {
                id: "focus-1-1",
                name: "按键1",
                type: 'img',
                nextFocusLeft: 'focus-1-3',
                nextFocusRight: 'focus-1-2',
                nextFocusUp: 'focus-4-1',
                nextFocusDown: 'focus-2-1',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_1.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_1.png",
                bigImg: "",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: ""
            },
            {
                id: "focus-1-2",
                name: "按键2",
                type: 'img',
                nextFocusLeft: 'focus-1-1',
                nextFocusRight: 'focus-1-3',
                nextFocusUp: 'focus-4-2',
                nextFocusDown: 'focus-2-2',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_2.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_2.png",
                bigImg: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"select_keyword_2.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-1-3",
                name: "按键3",
                type: 'img',
                nextFocusLeft: 'focus-1-2',
                nextFocusRight: '',
                nextFocusUp: 'focus-4-3',
                nextFocusDown: 'focus-2-3',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_3.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_3.png",
                bigImg: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"select_keyword_3.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-2-1",
                name: "按键4",
                type: 'img',
                nextFocusLeft: 'focus-2-3',
                nextFocusRight: 'focus-2-2',
                nextFocusUp: 'focus-1-1',
                nextFocusDown: 'focus-3-1',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_4.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_4.png",
                bigImg: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"select_keyword_4.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-2-2",
                name: "按键5",
                type: 'img',
                nextFocusLeft: 'focus-2-1',
                nextFocusRight: 'focus-2-3',
                nextFocusUp: 'focus-1-2',
                nextFocusDown: 'focus-3-2',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_5.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_5.png",
                bigImg: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"select_keyword_5.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-2-3",
                name: "按键6",
                type: 'img',
                nextFocusLeft: 'focus-2-2',
                nextFocusRight: '',
                nextFocusUp: 'focus-1-3',
                nextFocusDown: 'focus-3-3',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_6.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_6.png",
                bigImg: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"select_keyword_6.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-3-1",
                name: "按键7",
                type: 'img',
                nextFocusLeft: 'focus-3-3',
                nextFocusRight: 'focus-3-2',
                nextFocusUp: 'focus-2-1',
                nextFocusDown: 'focus-4-1',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_7.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_7.png",
                bigImg: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"select_keyword_7.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: ""
            },
            {
                id: "focus-3-2",
                name: "按键8",
                type: 'img',
                nextFocusLeft: 'focus-3-1',
                nextFocusRight: 'focus-3-3',
                nextFocusUp: 'focus-2-2',
                nextFocusDown: 'focus-4-2',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_8.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_8.png",
                bigImg: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"select_keyword_8.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-3-3",
                name: "按键9",
                type: 'img',
                nextFocusLeft: 'focus-3-2',
                nextFocusRight: '',
                nextFocusUp: 'focus-2-3',
                nextFocusDown: 'focus-4-3',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_9.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_9.png",
                bigImg: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"select_keyword_9.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-4-1",
                name: "按键清空",
                type: 'img',
                nextFocusLeft: 'focus-4-3',
                nextFocusRight: 'focus-4-2',
                nextFocusUp: 'focus-3-1',
                nextFocusDown: 'focus-1-1',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_clear.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_clear.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-4-2",
                name: "按键0",
                type: 'img',
                nextFocusLeft: 'focus-4-1',
                nextFocusRight: 'focus-4-3',
                nextFocusUp: 'focus-3-2',
                nextFocusDown: 'focus-1-2',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_keyword_0.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_keyword_0.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            },
            {
                id: "focus-4-3",
                name: "退格",
                type: 'img',
                nextFocusLeft: 'focus-4-2',
                nextFocusRight: '',
                nextFocusUp: 'focus-3-3',
                nextFocusDown: 'focus-1-3',
                focusable: true,
                backgroundImage: g_appRootPath + "/Public/img/hd/Search/V25/bg_back.png",
                focusImage: g_appRootPath + "/Public/img/hd/Search/V25/"+fixPath+"f_back.png",
                click: KeyWord.onKeyCenter,
                beforeMoveChange: KeyWord.onBeforeMoveChange,
                moveChange: "",
            })
    },

    /**
     * 点击数字键盘弹出T形框
     * @param storeID
     */
    updateNineKeyboardSrcWithClick: function (currentBtn) {
        var currEle = document.getElementById(currentBtn.id);
        currEle.src = currentBtn.bigImg;
        G(currentBtn.id).setAttribute("class", "big_btn");
        nineKeyboardClickStatus = true;
    },

    /**
     * 隐藏T形框
     * @param storeID
     */
    updateNineKeyboardSrcWithBack: function () {
        var currentBtn = LMEPG.ButtonManager.getCurrentButton();
        var currEle = document.getElementById(currentBtn.id);
        currEle.src = currentBtn.focusImage;
        G(currentBtn.id).setAttribute("class", "key_btn");
        nineKeyboardClickStatus = false;
    },

    /**
     * 点击数字键盘前判断是否有T形框弹出
     * @param dir
     * @param current
     * @returns {boolean}
     */
    onBeforeMoveChange: function (dir, current) {

        var bigClassList = document.getElementsByClassName('big_btn')
       if(dir === 'right' && (current.id === 'focus-4-3' || current.id === 'focus-3-3' || current.id === 'focus-2-3' || current.id ==='focus-1-3') && !bigClassList.length ){
           setTimeout(function () {
               LMEPG.BM.requestFocus(CollectionContent.currentNav)
           },50)
           return
       }

        if (nineKeyboardClickStatus) {
            //T形框显示，更新搜索框
            var currMapKey;
            switch (dir) {
                case "enter":
                    currMapKey = keyCodeMapping[current.id][0];
                    break;
                case "up":
                    currMapKey = keyCodeMapping[current.id][2];
                    break;
                case  "down":
                    currMapKey = keyCodeMapping[current.id][4];
                    break;
                case "left":
                    currMapKey = keyCodeMapping[current.id][1];
                    break;
                case "right":
                    currMapKey = keyCodeMapping[current.id][3];
                    break;
            }
            KeyWord.searchAdd(currMapKey);
            KeyWord.updateNineKeyboardSrcWithBack();
            return false;
        } else {
            //T形框隐藏,不拦截按键事件
            return true;
        }
    },

    /**
     * 数字键盘点击事件
     * @param btn
     */
    onKeyCenter: function (btn) {
        if (nineKeyboardClickStatus) {
            //有T形框显示，就交给onBeforeMoveChange处理
            KeyWord.onBeforeMoveChange("enter", btn);
        } else {
            var storeID = btn.id;
            switch (storeID) {
                case "focus-1-1":
                    KeyWord.searchAdd("1");
                    break;
                case "focus-4-1":
                    KeyWord.searchClear(storeID);
                    break;
                case "focus-4-2":
                    KeyWord.searchAdd("0");
                    break;
                case "focus-4-3":
                    KeyWord.searchBack(storeID);
                    break;
                default:
                    //多选择按键，显示T形框
                    KeyWord.updateNineKeyboardSrcWithClick(btn);
                    break;
            }
        }
    },

    /**
     * 添加搜索框中的文本
     */
    searchAdd: function (text) {
        var currentText = uiSearchTextElement.innerHTML;
        if (LMEPG.Func.isEmpty(text)) {
            //需要增加的文本为空
            return;
        } else {
            if (LMEPG.Func.isEmpty(currentText) || currentText == searchTextTips) {
                uiSearchTextElement.innerHTML = text;
            } else {
                uiSearchTextElement.innerHTML = currentText + text;
            }
            searchVideoByHotWord(uiSearchTextElement.innerHTML);
        }
    },

    /**
     * 清空搜索框中的文本
     */
    searchClear: function () {
        var currentText = uiSearchTextElement.innerHTML;
        uiSearchTextElement.innerHTML = searchTextTips;
        searchVideoByHotWord("");
    },

    /**
     * 删除搜索框中的最后一个字符
     */
   searchLock:false,
    searchBack: function () {
       if(KeyWord.searchLock){
           return;
       }
        KeyWord.searchLock = true

        var currentText = uiSearchTextElement.innerHTML;
        if (currentText == searchTextTips || currentText == "" || currentText == null || currentText == undefined) {
            return;
        }

        var str = currentText.substring(0, currentText.length - 1);
        uiSearchTextElement.innerHTML = str;
        if (uiSearchTextElement.innerHTML == "") {
            uiSearchTextElement.innerHTML = searchTextTips;
        } else {
            uiSearchTextElement.innerHTML = str;
        }
        searchVideoByHotWord(str);
    },

}

/**
 * 搜索结果列表管理（右边）
 * @type {{}}
 */
var CollectionContent = {
    MAX_ITEM_NUM: 4,    // 最大分页item数
    MAX_ROW_ITEM_NUM: 2,    // 行最大元素
    currentPage: 1,     // 当前页
    count: 0,           // 元素总数
    countPage: 0,        // 总页数
    allData:[],         //全部数据
    data: [],           // 数据源
    currentNav:RenderParam.focusNav || 'nav-1',


    /**
     * 初始话搜索结果
     * @param data
     */
    init: function () {
        //初始化搜索结果按钮
        for (var i = 0; i < CollectionContent.MAX_ITEM_NUM; i++) {
            var downBtn = (i + 1) + CollectionContent.MAX_ROW_ITEM_NUM;
            var upBtn = (i + 1) - CollectionContent.MAX_ROW_ITEM_NUM;
            buttons.push({
                id: 'recommended_' + (i + 1),
                name: '推荐位',
                type: 'img',
                nextFocusLeft: 'recommended_' + i,
                nextFocusRight: 'recommended_' + (i + 2),
                nextFocusUp: 'recommended_' + upBtn,
                nextFocusDown: 'recommended_' + downBtn,
                backgroundImage: "",
                focusImage: "",
                click: CollectionContent.onClick,
                focusChange: CollectionContent.recommendedFocus,
                beforeMoveChange: CollectionContent.onBeforeMoveChange,
                cPosition: i, //推荐位编号
            });
        }

        for (var j = 1; j<6; j++){
            buttons.push({
                id: 'nav-'+j,
                name: 'nav',
                type: 'div',
                nextFocusLeft: j === 1? 'focus-1-3':'nav-' + (j - 1),
                nextFocusRight: 'nav-' + (j + 1),
                nextFocusUp: '',
                nextFocusDown: 'recommended_1',
                backgroundImage: " ",
                focusImage:g_appRootPath + "/Public/img/hd/Search/V25/nav-choose.png",
                selectImage:g_appRootPath+ "/Public/img/hd/Search/V25/nav-has-choose.png",
                click: '',
                focusChange: CollectionContent.navFocus,
                beforeMoveChange: CollectionContent.navHasChoose,
                moveChange:CollectionContent.navMoveChange,
                cPosition: i, //推荐位编号
            })
        }


        // 初始化焦点
        LMEPG.ButtonManager.init('focus-1-1', buttons, '', true);
        //注册翻页按钮
        LMEPG.KeyEventManager.addKeyEvent(
            {
                KEY_PAGE_UP: CollectionContent.prevPage,	        //上一页事件
                KEY_PAGE_DOWN: CollectionContent.nextPage,      //下一页事件
            });

        if (LMEPG.Func.isEmpty(RenderParam.focusIndex) || LMEPG.Func.isEmpty(RenderParam.pageCurrent)) {
            H('up_content_arrows');
            H('down_content_arrows');
            RenderParam.searchText = "";
            searchVideoByHotWord(RenderParam.searchText, RenderParam.focusIndex);
        } else {
            uiSearchTextElement.innerHTML = RenderParam.searchText;
            if (RenderParam.searchText == searchTextTips) {
                RenderParam.searchText = "";
            }
            CollectionContent.currentPage = LMEPG.Func.isEmpty(RenderParam.pageCurrent) ? 1 : parseInt(RenderParam.pageCurrent);
            searchVideoByHotWord(RenderParam.searchText, RenderParam.focusIndex);
        }

        G(CollectionContent.currentNav).style.backgroundImage = "url(/Public/img/hd/Search/V25/nav-has-choose.png)"

    },
    /**
     * 菜单改变
     */
    navMoveChange:function(pre,btn,dir){
        if(dir === 'left' || dir==='right'){
            if(RenderParam.carrierId === '000051'){
                CollectionContent.MAX_ITEM_NUM = btn.id === 'nav-3'? 2:4
            }


            CollectionContent.currentNav = btn.id
            CollectionContent.reset()
            CollectionContent.update()

            CollectionContent.changNav3Style()
        }
    },

    changNav3Style:function(){
        if(RenderParam.carrierId !== '000051'){
            return
        }

        if(CollectionContent.currentNav=== 'nav-3'){
            LMEPG.CssManager.addClass('item_img_0','nav-3')
            LMEPG.CssManager.addClass('item_img_1','nav-3')
        }else {
            LMEPG.CssManager.removeClass('item_img_0','nav-3')
            LMEPG.CssManager.removeClass('item_img_1','nav-3')
        }
    },

    navFocus:function(btn, hasFocus){
        if (hasFocus) {
           G(btn.id).style.color = '#662200'
        } else {
            G(btn.id).style.color = '#fff'
        }
    },

    navHasChoose:function(dir,btn){
        if(dir==='down' && CollectionContent.data && CollectionContent.data.length !== 0){
            setTimeout(function () {
                G(btn.id).style.backgroundImage = "url("+btn.selectImage+")"
            },50)
        }
    },
    /**
     * 更新搜索结果
     */
    update: function () {
        KeyWord.searchLock = false
        if(RenderParam.carrierId === '000051') {
            CollectionContent.MAX_ITEM_NUM = CollectionContent.currentNav === 'nav-3' ? 2 : 4
        }
        switch (this.currentNav) {
            case "nav-1":
                this.data =  this.allData.list
                break;
            case "nav-2":
                this.data =  this.allData.series_list
                break;
            case "nav-3":
                this.data =  this.allData.album_list
                break;
            case "nav-4":
                this.data =  this.allData.doctor_list
                break;
            case "nav-5":
                this.data =  this.allData.expert_list
                break;
        }

        if(!this.data || this.data.length === 0){
            Show("no_search_text")
            return
        }


        Hide("no_search_text")
        this.count = this.data.length;
        if (this.count > 0) {
            this.countPage = Math.ceil(this.count / this.MAX_ITEM_NUM);
            Hide("no_search_text")
        }
        var subData = this.getCurrentPageData();
        this.createElements(subData);
        this.updateArrows();
        this.updatePageNumUI();
        CollectionContent.changNav3Style()
    },

    /**
     * 重置搜索结果
     */
    reset: function () {
        if (LMEPG.Func.isExist(this.data) && this.data.length > 0) {
            this.data = null;
            this.count = 0;
            this.currentPage = 1;
            this.countPage = 0;
            G('rightWrap').innerHTML = "";
            H('up_content_arrows');
            H('down_content_arrows');
            // G('page_num').innerHTML = "0/0";
            G('page_num').innerHTML = "";
        }
    },

    /**
     * 得到当前页数据
     */
    getCurrentPageData: function () {
        var data = [];
        if (this.currentPage < 1) {
            this.currentPage = 1;
        }
        if (this.currentPage <= this.countPage) {
            var start = (this.currentPage - 1) * this.MAX_ITEM_NUM;
            var end = this.currentPage == this.countPage ?
                this.count : this.currentPage * this.MAX_ITEM_NUM;
            data = this.data.slice(start, end);
        }
        return data;
    },

    /**
     * 向上翻页
     */
    prevPage: function () {
        if (CollectionContent.currentPage > 1) {
            CollectionContent.currentPage = CollectionContent.currentPage - 1;
            var data = CollectionContent.getCurrentPageData();
            if (data.length > 0) {
                CollectionContent.createElements(data);
                LMEPG.BM.requestFocus('recommended_' + data.length)
                LMEPG.ButtonManager.refresh('');
            }
            CollectionContent.updateArrows();
            CollectionContent.updatePageNumUI();
        }
    },

    /**
     * 向下翻页
     */
    nextPage: function () {
        if (CollectionContent.currentPage < CollectionContent.countPage) {
            CollectionContent.currentPage = CollectionContent.currentPage + 1;
            var data = CollectionContent.getCurrentPageData();
            if (data.length > 0) {
                CollectionContent.createElements(data);
                LMEPG.BM.requestFocus('recommended_' + 1)
                LMEPG.ButtonManager.refresh();

            }
            CollectionContent.updateArrows();
            CollectionContent.updatePageNumUI();
        }
    },

    /**
     * 更新箭头
     */
    updateArrows: function () {
        if (CollectionContent.currentPage <= 1) {
            H('up_content_arrows');
        } else {
            S('up_content_arrows');
        }
        if (CollectionContent.currentPage == CollectionContent.countPage) {
            H('down_content_arrows');
        } else {
            S('down_content_arrows');
        }
    },

    /**
     * 更新页码
     */
    updatePageNumUI: function () {
        var pageNum = G('page_num');
        pageNum.innerHTML = CollectionContent.currentPage + "/" + CollectionContent.countPage;
    },

    /**
     * 创建元素
     */
    createElements: function (data) {
        var collectionContaniner = G('rightWrap');
        var collectionButtons = [];
        LMEPG.UI.Marquee.stop();
        collectionContaniner.innerHTML = "";
        var html = "";
        for (var i = 0; i < data.length; i++) {
            var itemContainerId = "recommended_" + (i + 1);
            var itemImgId = "item_img_" + i;

            html += '<div id="' + itemContainerId + '">';
            var defaultImg = g_appRootPath + '/Public/img/hd/Home/V10/default.png';
            html += '<img id="' + itemImgId + '"' + ' class="' + "item_img" + '"' + ' src="' + addFsUrl(data[i].image_url) + '"  onerror="this.src=\'' + defaultImg + '\'"/>';
             if (CollectionContent.currentNav==='nav-2') {
                 html += '<p class="num-squ">'+data[i].content_cnt+'全集</p>';
             }
            html += '</div>';

        }
        CollectionContent.updatePageNumUI();
        collectionContaniner.innerHTML = html;
    },

    /**
     * 侧边导航栏焦点效果
     * @param btn
     * @param hasFocus
     */
    recommendedFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if(CollectionContent.currentNav === 'nav-3' && RenderParam.carrierId === '000051'){
                LMEPG.CssManager.addClass(btn.id, "collection_zoom_out_nav3");
            }else {
                if(RenderParam.carrierId === '000051'){
                    LMEPG.CssManager.addClass(btn.id, "collection_zoom_out");
                }else {
                    LMEPG.CssManager.addClass(btn.id, "collection_zoom_out_hn");
                }

            }

        } else {
            if(CollectionContent.currentNav === 'nav-3' && RenderParam.carrierId === '000051'){
                LMEPG.CssManager.removeClass(btn.id, "collection_zoom_out_nav3");
            }else {
                if(RenderParam.carrierId === '000051'){
                    LMEPG.CssManager.removeClass(btn.id, "collection_zoom_out");
                }else {
                    LMEPG.CssManager.removeClass(btn.id, "collection_zoom_out_hn");
                }

            }

            // LMEPG.UI.Marquee.stop();
        }
    },

    /**
     * 焦点改变前回调，如果有特殊处理可以在该函数中处理后返回false。将不在继续往下执行。
     * @param dir
     * @param btn
     */
    onBeforeMoveChange: function (dir, btn) {
        switch (dir) {
            case "left":
                if (btn.id == "recommended_1"
                    || btn.id == "recommended_3"
                    || btn.id == "recommended_5") {
                    LMEPG.BM.requestFocus("focus-1-3");
                    return false;
                }
                break;
            case "right":
                break;
            case "up":
                if (btn.id == "recommended_1"
                    || btn.id == "recommended_2") {
                    if (CollectionContent.currentPage > 1) {
                        CollectionContent.prevPage();
                        CollectionContent.changNav3Style()
                    } else {
                        LMEPG.BM.requestFocus(CollectionContent.currentNav);
                    }
                    return false;
                }
                break;
            case "down":
                switch (btn.id) {
                    case 'recommended_1':
                    case 'recommended_2':
                        var nextFocusDownId = LMEPG.Func.gridBtnUtil.getNextFocusDownId(btn);
                        if(CollectionContent.currentNav === 'nav-3'){
                            CollectionContent.nextPage();
                            CollectionContent.changNav3Style()
                        }else {
                            if (!LMEPG.Func.isEmpty(nextFocusDownId)) {
                                LMEPG.BM.requestFocus(nextFocusDownId);
                            } else {
                                var nextRightBtn = LMEPG.BM.getButtonById(btn.nextFocusRight);
                                if (LMEPG.Func.isExist(nextRightBtn)) {
                                    LMEPG.BM.requestFocus(nextRightBtn.id);
                                }
                            }
                        }

                        return false;
                    case "recommended_3":
                    case "recommended_4":
                        if (CollectionContent.currentPage < CollectionContent.countPage) {
                            CollectionContent.nextPage();
                            return false;
                        }
                        break;
                }
                break;
        }
    },

    /**
     * 搜索视频点击
     */
    onClick: function (btn) {
        var index = (CollectionContent.currentPage - 1) * CollectionContent.MAX_ITEM_NUM + btn.cPosition;
        if (LMEPG.Func.isExist(CollectionContent.data) && index < CollectionContent.data.length) {
            var videoData = CollectionContent.data[index];
            switch (CollectionContent.currentNav) {
                case "nav-0":
                case "nav-1":
                    CollectionContent.toVideoPage(videoData)
                    break
                case "nav-2":
                    CollectionContent.toSeriesPage(videoData)
                    break
                case "nav-3":
                    CollectionContent.toAlbumPage(videoData)
                    break
                case "nav-4":
                    CollectionContent.toDoctorPage(videoData)
                    break
                case "nav-5":
                    CollectionContent.toExpertPage(videoData)
                    break
            }

        }

    },
    toVideoPage:function(videoData){
        // 视频播放
        var videoObj = videoData.ftp_url instanceof Object ? videoData.ftp_url : JSON.parse(videoData.ftp_url);
        var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

        // 创建视频信息
        var videoInfo = {
            "sourceId": videoData.source_id,
            "videoUrl": encodeURIComponent(videoUrl),
            "title": videoData.title,
            "type": videoData.model_type,
            "userType": videoData.user_type,
            "freeSeconds": videoData.free_seconds,
            "unionCode": videoData.union_code,
            "entryType": 0,
            "entryTypeName": "搜索页面",
            'show_status' : videoData.show_status,
        };
        // 数据探针 用户搜索行为探针
        if (RenderParam.carrierId == '630092') {
            var dataRP = {
                userId: RenderParam.userId,
                pageKey: window.location.pathname,
                pageType: 'searchPage',
                keyWord: uiSearchTextElement.innerText,
                mediaCode: videoInfo.videoUrl,
                mediaName: videoInfo.title,
                mediaType: '视频',
            }
            DataReport.getValue(3, dataRP);
        }
        //视频专辑下线处理
        if(videoInfo.show_status == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }
        if (isAllowPlay(videoInfo)) {
            Page.jumpPlayVideo(videoInfo);
        } else {
            Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

    toSeriesPage:function (data) {
        Page.jumpSeriesPage(data.subject_id)
    },

    toAlbumPage:function (data) {
        Page.jumpAlbumPage(data.alias_name)
    },

    toDoctorPage:function (data) {
        var docId = data.doc_id;
        if (typeof docId === 'undefined') {
            docId = data.doctor_id;
        }
        Page.jumpDocPage(docId)
    },

    toExpertPage:function (data) {
        Page.jumpExpertPage(data.clinic_id)
    }

};



// 根据热搜词汇进行搜索视频信息
function searchVideoByHotWord(textValue, focusId) {
    Hide("page_num");
    CollectionContent.reset();
    var postData = {
        "textvalue": textValue,
        'isSearchDoctor': 1
    };
    LMEPG.ajax.postAPI("Search/searchVideoByHotWord", postData, function (data) {
        if (data.result == 0) {
            var list = data.list
            if (LMEPG.Func.isExist(list) && list.length > 0) {
                Show("page_num");
                Hide("no_search_text");
                console.log(data)

                CollectionContent.allData = data

                CollectionContent.update();
                if (typeof focusId !== 'undefined' && !LMEPG.Func.isEmpty(focusId)) {
                    LMEPG.ButtonManager.requestFocus(focusId);
                }
            } else {
                Show("no_search_text");
            }
        } else {
            LMEPG.UI.showToast("搜索视频失败[code=" + data.result + "]");
        }

    });
}

window.onload = function () {
    HealthSearch.init();
};
