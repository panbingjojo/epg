/**
 * 搜索功能对象
 */
var Search = {
    input: '',
    buttons: [],
    keepaliveId: 'key-0',
    isFirstSearch: true,
    isShowLetter: false,
    searchWord: '',
    firstTabSelected: 'single-video',
    isHD: true,
    imgPrefix: g_appRootPath+'/Public/img/hd/Search/V13/',
    modelDif: ["450092", "420092", "410092","150002"],
    init: function () {
        this.isHD = RenderParam.platformType !== 'sd';
        this.imgPrefix =g_appRootPath+ '/Public/img/' + RenderParam.platformType + '/Search/V13/';
        this.input = G('search-value');
        this.createButtons();
        this.setBeiJingAreaCode();
        this.initButton('key-0'); // 首次进入初始化为第一个键值焦点
        this.updateValue({}, -1, this.keepFocus);
        Search.tabDif();
    },
// 特殊地区去掉专家一身模块
    tabDif: function () {
        if (Search.modelDif.indexOf(RenderParam.carrierId) != -1) {
            delNode("doctor");
            delNode("expert");
        }
    },
    setBeiJingAreaCode: function () {
        if (RenderParam.areaCode !== '205') return;
        this.firstTabSelected = 'album';
        Tab.keepFocusId = 'album';
        delNode('single-video');
        delNode('gather-video');
        LMEPG.BM.requestFocus('album');
        var navIdx = RenderParam.navIndex;
        RenderParam.navIndex = +navIdx < 2 ? navIdx + 2 : navIdx;
    },

    /*焦点和数据保持*/
    keepFocus: function () {
        var currentKeepTabFocus = RenderParam.keepFocusId;
        var keepFocusId = RenderParam.focusId;
        if (currentKeepTabFocus) {
            LMEPG.BM.requestFocus('single-video');
            LMEPG.BM.requestFocus(currentKeepTabFocus);
            Tab.keepFocusId = RenderParam.keepFocusId;
            Tab.onMoveChange('down', LMEPG.BM.getButtonById(currentKeepTabFocus));
            G(currentKeepTabFocus).style.backgroundImage = 'url(' + this.imgPrefix + 'tab_s.png)';
        }

        for (var i = 0; i < parseInt(RenderParam.page); i++) {
            VideoList.nextPage();
        }

        if (keepFocusId) {
            LMEPG.BM.requestFocus(keepFocusId);
        }
    },
    /**
     * 构建虚拟键盘
     */
    createButtons: function () {
        var self = this;
        var COUNT_KEYS = 12; // 键盘的键值个数
        var key_val = [
            ['A', 'B', 'C', '1'],
            ['D', 'E', 'F', '2'],
            ['G', 'H', 'I', '3'],
            ['J', 'K', 'L', '4'],
            ['M', '', 'N', '5'],
            ['O', 'P', 'Q', '6'],
            ['R', 'S', 'T', '7'],
            ['U', 'V', 'W', '8'],
            ['X', 'Y', 'Z', '9'],
            ['', '', '', '0']
        ];
        while (COUNT_KEYS--) {
            var ImageIndex =g_appRootPath+ '/Public/img/hd/Search/V13/key' + COUNT_KEYS;
            self.buttons.push({
                id: 'key-' + COUNT_KEYS,
                name: '键-' + COUNT_KEYS,
                type: 'img',
                nextFocusUp: 'delete',
                nextFocusDown: 'single-video',
                nextFocusLeft: 'key-' + (COUNT_KEYS - 1),
                nextFocusRight: 'key-' + (COUNT_KEYS + 1),
                backgroundImage: ImageIndex + '.png',
                focusImage: ImageIndex + '_f.png',
                clickImage: ImageIndex + '_k.png',
                click: self.click,
                focusChange: self.keyOnfocusIn,
                val: key_val[COUNT_KEYS],
                Obj: self
            });
        }
        self.buttons.push({
            id: 'delete',
            name: '退格',
            type: 'img',
            nextFocusLeft: 'clear',
            nextFocusRight: 'clear',
            nextFocusDown: 'key-0',
            backgroundImage: g_appRootPath+'/Public/img/hd/Search/V13/delete.png',
            focusImage:g_appRootPath+ '/Public/img/hd/Search/V13/delete_f.png',
            click: self.deleteText,
            Obj: self
        }, {
            id: 'clear',
            name: '清空',
            type: 'img',
            nextFocusLeft: 'delete',
            nextFocusRight: 'delete',
            nextFocusDown: 'key-9',
            backgroundImage:g_appRootPath+ '/Public/img/hd/Search/V13/clear.png',
            focusImage: g_appRootPath+'/Public/img/hd/Search/V13/clear_f.png',
            click: self.clear,
            Obj: self
        });
    },
    deleteText: function (btn) {
        var self = btn.Obj;
        var value = self.input.getAttribute('val');
        value && self.updateValue(btn);
    },
    clear: function (btn) {
        var self = btn.Obj;
        self.updateValue(btn);
    },

    setFirstSearchTabIndex: function () {
        this.isFirstSearch = false;
        G(Search.firstTabSelected).style.backgroundImage = 'url(' + (this.isHD ?g_appRootPath+ '/Public/img/hd/Search/V13/nav_s.png' :g_appRootPath+ '/Public/img/sd/Unclassified/V13/tab_s.png') + ')';
    },
    keyOnfocusIn: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.className = 'focus';
            btn.nextFocusDown = Tab.keepFocusId; // 移动焦点保持对象
        } else {
            btnElement.className = '';
        }
    },
    click: function (btn) {
        var self = btn.Obj;
        self.isShowLetter = false;
        if (btn.id == 'key-9') {
            self.updateValue(btn, 3);
        } else {
            self.keepaliveId = btn.id;
            self.isShowLetter = self.showLetter(btn);
            G(btn.id).setAttribute('class', 'click');
        }
    },
    /**
     * 动态构建脚手架ID虚拟按钮（链接键值）
     */
    showLetter: function (btn) {
        // 更新创建虚拟脚手架
        if (this.buttons.length > 13) {
            (this.buttons.splice(this.buttons.length - 1));
        }
        this.buttons.push({
            id: 'input-key-wrapper',
            name: '脚手架ID',
            type: 'img',
            toObj: btn,
            Obj: this,
            nextFocusUp: btn.id,
            nextFocusDown: btn.id,
            nextFocusLeft: btn.id,
            nextFocusRight: btn.id,
            click: this.letterClick,
            focusChange: this.letterFocus,
            beforeMoveChange: this.letterDirection,
            focusable: true
        });
        this.initButton('input-key-wrapper');
        return true;
    },
    /**
     * 字母键盘获得焦点(样式操作)
     */
    letterFocus: function (btn, hasFocus) {
        // 设置当前字母键值的样式
        var currentKey = btn.toObj;
        var btnEl = G(currentKey.id);
        if (hasFocus) {
            btnEl.src = currentKey.clickImage;
        }
    },
    /**
     * 字母键盘被点击取值
     */
    letterClick: function (btn) {
        var self = btn.Obj;
        self.moveToFocus(btn.toObj.id);
        G(btn.id).removeAttribute('class');
    },
    /**
     * 字母键盘被移动取值
     * index: 键值索引值（顺时针）
     */
    letterDirection: function (key, btn) {
        var self = btn.Obj;
        var currentKey = btn.toObj;
        var index;
        switch (key) {
            case 'left':
                index = 0;
                break;
            case 'up':
                index = 1;
                break;
            case 'right':
                index = 2;
                break;
            case 'down':
                index = 3;
                break;
        }
        self.updateValue(currentKey, index);
        self.isShowLetter = false; // 还原返回条件
    },
    /**
     * 实时更新关键字状态
     * currentKey：当前小键盘对象键
     * index：关键字索引
     * isAction：是否执行附加操作（如删除、清空）
     */
    updateValue: function (currentKey, index, callback) {
        var input = this.input,
            thisID = currentKey.id || undefined,
            fetchVal = input.getAttribute('val'), // 获取前一个输入值
            promptMessage = RenderParam.carrierId != '210092' ?
                '请输入首字母/数字进行搜索，如搜索“健康”，则输入“JK”' :
                '请输入片名首字母进行搜索';
        switch (thisID) {
            case undefined:
                fetchVal = !LMEPG.Func.isEmpty(RenderParam.searchWord) ? RenderParam.searchWord : '';    // 若是首次进入/播放回来,使用浏览器地址关键字
                break;
            case 'delete':                                        // 退格（删除）功能
                fetchVal = fetchVal.slice(0, fetchVal.length - 1);
                break;
            case 'clear':                                         // 清空"功能
                fetchVal = '';
                break;
            default:
                fetchVal += currentKey.val[index];               // 抓取前一个和当前输入值
                break;
        }
        input.innerText = fetchVal || promptMessage;              // 输入框显示绑定值
        input.setAttribute('val', fetchVal);                      // 绑定当前抓取值
        // 保存搜索关键词
        Search.searchWord = fetchVal;
        this.searchAction(fetchVal, callback);                              // 执行Ajax搜索行为
    },
    /**
     * 执行ajax请求搜索获取视频列表信息
     * fetchVal：请求的关键字
     */
    searchAction: function (fetchVal, callback) {
        var self = this;
        // 根据热搜词汇进行搜索视频信息
        var postData = {
            'textvalue': fetchVal,
            'isSearchDoctor': RenderParam.carrierId == '640094' || RenderParam.carrierId === '150002' ? '0' : '1'
        };
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Search/searchByHotWord', postData, function (data) {
            if (data.result == 0) {
                self.isFirstSearch && self.setFirstSearchTabIndex();
                // 调用视频列表对象
                if (LMEPG.Func.isEmpty(fetchVal)) {
                    self.data = data.list;
                } else {
                    self.data = data;
                }
                console.log(self.data);

                self.fetchVal = fetchVal;
                Tab.init();
                LMEPG.UI.dismissWaitingDialog();
                // 获取是否播放操作返回
                if (LMEPG.Cookie.getCookie('oncePlay') == '1') {
                    // 还原常规搜索操作
                    LMEPG.Cookie.setCookie('oncePlay', '0');
                    self.initButton(RenderParam.focusIndex);
                } else {
                    self.initButton(LMEPG.ButtonManager.getCurrentButton().id);
                }

                if (!LMEPG.Func.isEmpty(callback)) {
                    callback();
                }
            } else {
                LMEPG.UI.showToast('加载失败[code=' + data.result + ']');
            }
        });
    },
    initButton: function (focusId) {
        LMEPG.ButtonManager.init(focusId, this.buttons, '', true);
    },
    moveToFocus: function (focusId) {
        LMEPG.ButtonManager.requestFocus(focusId);
    }
};
/**
 * 搜索结果导航
 * 焦点到那个导航tab上即显示对应的搜索内容
 * 离开处理焦点保持
 */
var Tab = {
    // 保存当前选中状态的tab
    keepFocusId: 'single-video',
    init: function () {
        this.createBtns();
        VideoList.init(Search.data, Search.fetchVal, Tab.keepFocusId);
    },
    createBtns: function () {
        if (Search.buttons.some(function (t) {
                return t.id == 'single-video'; // 如果有焦点
            })) {
            return;
        }
        var navTabBgImg = Search.isHD ? g_appRootPath+'/Public/img/hd/Search/V13/nav_bg.png' : g_appRootPath+'/Public/img/sd/Unclassified/V13/tab_bg.png';
        var navTabFocusImg = Search.isHD ? g_appRootPath+'/Public/img/hd/Search/V13/nav_f.png' : g_appRootPath+'/Public/img/sd/Unclassified/V13/tab_f.png';
        Search.buttons.push({
            id: 'single-video',
            name: '视频',
            type: 'div',
            nextFocusRight: 'gather-video',
            nextFocusUp: 'key-0',
            nextFocusDown: 'v-0',
            backgroundImage: navTabBgImg,
            focusImage: navTabFocusImg,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onMoveChange
        }, {
            id: 'gather-video',
            name: '视频集',
            type: 'div',
            nextFocusLeft: 'single-video',
            nextFocusRight: 'album',
            nextFocusUp: 'key-0',
            nextFocusDown: 'v-0',
            backgroundImage: navTabBgImg,
            focusImage: navTabFocusImg,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onMoveChange
        }, {
            id: 'album',
            name: '专题',
            type: 'div',
            nextFocusLeft: 'gather-video',
            nextFocusRight: 'doctor',
            nextFocusUp: 'key-0',
            nextFocusDown: 'v-0',
            backgroundImage: navTabBgImg,
            focusImage: navTabFocusImg,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onMoveChange

        }, {
            id: 'doctor',
            name: '医生',
            type: 'div',
            nextFocusLeft: 'album',
            nextFocusRight: Search.isHD ? RenderParam.carrierId!=='650092'? 'expert':"" : "",
            nextFocusUp: 'key-0',
            nextFocusDown: 'v-0',
            backgroundImage: navTabBgImg,
            focusImage: navTabFocusImg,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onMoveChange
        }, RenderParam.carrierId!=='650092'? {
            id: 'expert',
            name: '专家',
            type: 'div',
            nextFocusLeft: 'doctor',
            nextFocusUp: 'key-0',
            nextFocusDown: 'v-0',
            backgroundImage: navTabBgImg,
            focusImage: navTabFocusImg,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onMoveChange
        }:{});
        Search.initButton(null);
    },
    onFocusIn: function (btn, hasFocus) {
        // 处理data 数据显示对应tab内容
        if (hasFocus) {
            Tab.isLeave = false;
            if (btn.id != Tab.keepFocusId) {
                // 为了减少渲染DOM，导航条已经渲染的list，从其他地方移动过来之后不再渲染
                VideoList.init(Search.data, Search.fetchVal, btn.id);
            }
            Tab.keepFocusId = btn.id; // tab离开的焦点保持ID
        } else if (Tab.isLeave) {
            G(btn.id).style.backgroundImage = 'url(' + (Search.isHD ? g_appRootPath+'/Public/img/hd/Search/V13/nav_s.png' : g_appRootPath+'/Public/img/sd/Unclassified/V13/tab_s.png') + ')';
        }
    },
    onMoveChange: function (key, btn) {
        if (key == 'up' || key == 'down') Tab.isLeave = true;

        // 如果底部数据为空，则焦点不允许向下
        if (key == 'down' && VideoList.data.length == 0) {
            Tab.isLeave = false;
            return false;
        }
    }
};

/**
 * 视频列表
 * @param data // 输入的数据
 * @param fetchVal // 关键字
 */
var VideoList = {
    /**页数策略
     * 1.播放回来->即使用播放回来的页数
     * 2.搜索操作->使用初始化页数0
     * 3.播放回来的页数大于总页数（异常页数）->使用初始化页数0
     * @type {*|string}
     */
    init: function (data, fetchVal, tabId) {
        // 根据在哪个tab设置不同的数据
        switch (tabId) {
            case 'gather-video':
                data = data.series_list;
                break;
            case 'album':
                data = data.album_list;
                break;
            case 'doctor':
                data = data.doctor_list;
                break;
            case 'expert':
                data = data.expert_list;
                break;
            default:
                data = data.list;
                break;
        }

        var playStatus = LMEPG.Cookie.getCookie('oncePlay');// 记录播放返回
        var backPage = +playStatus ? LMEPG.Func.getLocationString('page') : 0;//获取跳转后返回来的页数
        this.data = data; // 总搜索数据
        this.tabId = tabId || 'single-video'; // tab切换ID
        this.fetchVal = fetchVal; // 搜索的关键字
        this.nextPageId = 'v-3'; // 下一个翻页ID
        this.showPageCount = 4; // 当前tab切换当前页显示搜索到的个数
        this.styleClassName = 'style-0'; // tab切换的类名
        this.reSetParam();
        // 当前页数->若总数据调试小于跳转返回（可能异常）得到的页数则重置为0
        this.page = backPage > (data.length / this.showPageCount) ? 0 : parseInt(backPage);
        this.maxPage = Math.ceil(this.data.length / this.showPageCount);// 最大页数
        this.renderHtml();
        // 如果创建了就不在重复创建虚拟按钮
        !this.isCreateListVideoBtns && this.createButtons();
        this.reSetMoveFocus();
    },
    renderHtml: function () {
        S('page-index');
        var isNullData = this.isNullData();
        this.byClassificationRender();
        G('title').innerText = this.fetchVal != '' ? '搜索结果' : '大家都在看';
        var page = isNullData ? 0 : (this.page + 1);
        G('page-index').innerText = page + '/' + this.maxPage;
        this.toggleArrow(isNullData);
    },
    /**
     * 空数据处理
     */
    isNullData: function () {
        if (this.data.length == 0) {
            // LMEPG.UI.showToast('没有您搜索的内容哦，换其他试试。', 1);
            G('content-container').innerHTML = '<div class=null-data>搜索结果为空~';
            H('page-index');
            return true;
        }
        return false;
    },
    /**
     * 解析数据
     */
    setVideoListData: function () {
        var count = this.tabId == 'doctor' || this.tabId == 'expert' ? 5 : 4;
        var basePageCount = this.page * count;
        return this.data.slice(basePageCount, basePageCount + count);
    },

    /**
     * 分类渲染
     */
    byClassificationRender: function () {
        if (this.data.length == 0) {
            return;
        }
        var htm = '';
        var that = this;
        var data = that.setVideoListData();
        for (var i = 0; i < data.length; i++) {
            var t = data[i];
            var pathX = RenderParam;
            var imgFtp = pathX.fsUrl + t.image_url;
            var docName = '';
            if (that.tabId == 'doctor') {
                if (that.fetchVal == '') {
                    imgFtp = LMEPG.Inquiry.expertApi.createDoctorUrl(pathX.cwsHlwyyUrl, t.doc_id, t.avatar_url_new, pathX.carrierId);
                    docName = t.doc_name;
                } else {
                    imgFtp = LMEPG.Inquiry.expertApi.createDoctorUrl(pathX.cwsHlwyyUrl, t.doctor_id, t.doctor_avatar, pathX.carrierId);
                    docName = t.doctor_name;
                }
            }
            if (that.tabId == 'expert') {
                imgFtp = LMEPG.Inquiry.expertApi.createDoctorUrl(pathX.cws39HospitalUrl, t.doctor_user_id, t.doctor_avatar, pathX.carrierId);
                docName = t.doctor_name;
            }

            htm += '<div class=' + that.styleClassName + '>';
            htm += '<img id=v-' + i + ' data-link="" onerror="this.src=\'__ROOT__/Public/img/Common/default.png\'"  data-focus=' + imgFtp + ' src=' + imgFtp + '>';
            if (that.tabId == 'gather-video') {
                htm += '<p class="modify">' + t.content_cnt + '全集</p>';
            }
            if (that.tabId == 'doctor' || that.tabId == 'expert') {
                htm += '<p class="modify">' + docName + '</p>';
            }
            htm += '</div>';
        }
        G('content-container').innerHTML = htm;
    },
    /**
     * 初始化:
     *       下一个翻页ID
     *       每页显示个数
     *       焦点父级div样式类名
     */
    reSetParam: function () {
        var id = this.tabId;
        if (id == 'expert' || id == 'doctor') {
            this.nextPageId = 'v-4';
            this.showPageCount = 5;
            this.styleClassName = 'style-1';
        }
    },
    /**
     * 重置脚手架移动方向
     */
    reSetMoveFocus: function () {
        var id = this.tabId;
        if (id == 'expert' || id == 'doctor') {
            this.setButtonsMoveFocus('nextFocusLeft', 'v-4');
        } else {
            this.setButtonsMoveFocus('nextFocusLeft', 'v-3');
        }
    },

    setButtonsMoveFocus: function (direction, id) {
        for (var i = 0; i < Search.buttons.length; i++) {
            var t = Search.buttons[i];
            if (t.id == 'content-container') {
                t[direction] = id;
            }
        }
    },

    turnPage: function (key, btn) {
        var self = btn.obj;
        var startPage = self.page;
        var endPage = self.maxPage;

        // 当且仅当条件满足才翻上一个页面：1.方向键向上；2.按钮为向上翻页按钮；3.不是第一页
        if (key == 'left' && btn.id == 'v-0' && startPage != 0) {
            self.prevPage();
        }
        // 当且仅当条件满足才翻下一个页面：1.方向键向下；2.按钮为向下翻页按钮；3.不是最后一页
        if (key == 'right' && btn.id == self.nextPageId && (self.page + 1) != endPage) {
            self.nextPage();
        }
    },
    prevPage: function () {
        this.page = Math.max(0, this.page -= 1);
        this.renderHtml();
        Search.moveToFocus('content-container');
    },
    nextPage: function () {
        this.page = Math.min(this.maxPage, this.page += 1);
        this.renderHtml();
        Search.moveToFocus('content-container');
    },
    toggleArrow: function (isNullData) {
        S('prev-arrow');
        S('next-arrow');
        this.page == 0 && H('prev-arrow');
        (this.page + 1) == this.maxPage && H('next-arrow');
        isNullData && H('next-arrow');
    },
    /**
     * 创建视频列表按钮
     */
    createButtons: function () {
        Search.buttons.push({
            id: 'content-container',
            name: '脚手架ID',
            nextFocusLeft: 'v-3',
            nextFocusRight: 'v-0'
        });
        var countIndex = 5;// 视频列表(专家和医生5个最大计算)的个数
        while (countIndex--) {
            Search.buttons.push({
                id: 'v-' + countIndex,
                name: '列表-' + countIndex,
                type: 'others',
                nextFocusLeft: 'v-' + (countIndex - 1),
                nextFocusRight: 'v-' + (countIndex + 1),
                click: this.click,
                focusChange: this.focusChange,
                beforeMoveChange: this.turnPage,
                obj: this
            });
        }
        this.isCreateListVideoBtns = true; // 禁止重复创建
    },
    /**
     * 视频列表被点击跳转播放页面该条视频
     * videoInfo：实时获取的当前页视频列表对象的信息
     */
    click: function (btn) {
        // 视频
        if (Tab.keepFocusId == 'single-video') {
            var index = parseInt(btn.id.substr(2)) + VideoList.page * 4;
            var videoData = Search.data.list[index];
            var play_url = videoData.ftp_url;
            var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
            var videoUrl = Search.isHD ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
            // 创建视频信息
            var videoInfo = {
                'sourceId': videoData.source_id,
                'videoUrl': videoUrl,
                'title': videoData.title,
                'type': videoData.model_type,
                'userType': videoData.user_type,
                'freeSeconds': videoData.free_seconds,
                'entryType': 1,
                'entryTypeName': '搜索',
                'unionCode': videoData.union_code,
                'show_status': videoData.show_status,
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
        // 视频集
        else if (Tab.keepFocusId == 'gather-video') {
            var index = parseInt(btn.id.substr(2)) + VideoList.page * 4;
            var subject_id = Search.data.series_list[index].subject_id;
            PageJump.jumpVideoList(subject_id);
        }
        // 专辑
        else if (Tab.keepFocusId == 'album') {
            var index = parseInt(btn.id.substr(2)) + VideoList.page * 4;
            var albumName = Search.data.album_list[index].alias_name;
            PageJump.jumpAlbumPage(albumName);
        }
        // 医生
        else if (Tab.keepFocusId == 'doctor') {
            var index = parseInt(btn.id.substr(2)) + VideoList.page * 5;
            var docId = Search.data.doctor_list[index].doc_id;
            if (typeof docId === 'undefined') {
                docId = Search.data.doctor_list[index].doctor_id;
            }
            PageJump.jumpDoctorPage(docId);
        }
        // 专家
        else if (Tab.keepFocusId == 'expert') {
            var index = parseInt(btn.id.substr(2)) + VideoList.page * 5;
            var clinicId = Search.data.expert_list[index].clinic_id;
            PageJump.jumpExpertPage(clinicId);
        }
    },
    /**
     * 视频列表获得、失去焦点操作
     * 1.获得焦点当字数大于10个长度使用滚动效果
     * 2.失去焦点还原之前DOM结构
     */
    focusChange: function (btn, hasFocus) {
        var self = btn.obj;
        var btnEl = G(btn.id);
        var txtEl = btnEl.nextElementSibling;
        if (hasFocus) {
            btnEl.parentNode.id = 'style-s';
            btnEl.className = 'focus';
            if (txtEl) {
                txtEl.className = 'modify focus';
                LMEPG.Func.marquee(txtEl, txtEl.innerText, 6);
            }
            btn.nextFocusUp = Tab.keepFocusId;
        } else {
            btnEl.parentNode.id = '';
            btnEl.removeAttribute('class');
            if (txtEl) {
                txtEl.className = 'modify';
                LMEPG.Func.marquee(txtEl);
            }
        }
        return false;
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
        var currentPage = LMEPG.Intent.createIntent('search');
        currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('page', VideoList.page);
        currentPage.setParam('curSelectedTabId', Tab.keepFocusId);
        currentPage.setParam('searchWord', Search.searchWord);
        return currentPage;
    },

    /**
     * 跳转购买vip页面
     */
    jumpBuyVip: function (remark, videoInfo) {
        if (typeof (videoInfo) !== 'undefined' && videoInfo !== '') {
            var postData = {
                'videoInfo': JSON.stringify(videoInfo)
            };
            // 存储视频信息
            LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
            });
        }

        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        jumpObj.setParam('userId', RenderParam.userId);
        jumpObj.setParam('isPlaying', '1');
        jumpObj.setParam('remark', remark);
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
     * @param btn
     */
    jumpVideoList: function (subject_id) {
        var currentObj = PageJump.getCurrentPage();
        var jumpAgreementObj = LMEPG.Intent.createIntent('channelList');
        jumpAgreementObj.setParam('subject_id', subject_id);
        LMEPG.Intent.jump(jumpAgreementObj, currentObj);
    },

    /**
     * 跳转 -- 专辑页面
     * @param albumName
     */
    jumpAlbumPage: function (albumName) {
        var objHome = PageJump.getCurrentPage();
        var objAlbum = LMEPG.Intent.createIntent('album');
        objAlbum.setParam('userId', RenderParam.userId);
        objAlbum.setParam('albumName', albumName);
        objAlbum.setParam('inner', 1);
        LMEPG.Intent.jump(objAlbum, objHome);
    },

    /**
     * 跳转到医生页面
     */
    jumpDoctorPage: function (docId) {
        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('doctorDetails');
        jumpObj.setParam('doctorIndex', docId); // 传递点击具体那个医生的id
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转到专家页面
     */
    jumpExpertPage: function (clinic_id) {
        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('expertDetail');
        jumpObj.setParam('clinic', clinic_id);
        LMEPG.Intent.jump(jumpObj, objCurrent);
    }
};

// 公用返回函数（全局、键值对象）
var onBack = htmlBack = function () {
    // 此处保护键盘处于显示状态返回送回焦点
    if (Search.isShowLetter) {
        Search.moveToFocus(Search.keepaliveId);
        Search.isShowLetter = false;
    } else {
        LMEPG.Intent.back();
    }
};
