function Search() {
    this.buttons = [];
    this.input = G('search-value');
    this.showLetter = false;
    this.init();

}

Search.prototype = {
    init: function () {

        this._createButtons();
        this._initButton('key-0'); // 首次进入初始化为第一个键值焦点
        this._updateValue();
    },
    /**
     * 构建虚拟键盘
     */
    _createButtons: function () {
        var self = this;
        var COUNT_KEYS = 12; // 键盘的键值个数
        var key_val = [
            ['1', '', '', '', ''],
            ['2', 'A', 'B', 'C', ''],
            ['3', 'D', 'E', 'F', ''],
            ['4', 'G', 'H', 'I', ''],
            ['5', 'J', 'K', 'L', ''],
            ['6', 'M', 'N', 'O', ''],
            ['7', 'P', 'Q', 'R', 'S'],
            ['8', 'T', 'U', 'V', ''],
            ['9', 'W', 'X', 'Y', 'Z'],
            ['清空', '', '', '', ''],
            ['0', '', '', '', ''],
            ['退格', '', '', '', '']
        ];
        var i = 0;
        while (i < COUNT_KEYS) {
            var toRightFocus = ((i + 1) % 3 === 0) ? 'focus-0' : 'key-' + (i + 1); // 键盘右边4个键右移动到视频列表焦点
            var ImageIndex = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V9/key_' + i;
            self.buttons.push({
                id: 'key-' + i,
                name: '键-' + i,
                type: 'img',
                nextFocusUp: 'key-' + (i - 3),
                nextFocusDown: 'key-' + (i + 3),
                nextFocusLeft: 'key-' + (i - 1),
                nextFocusRight: toRightFocus,
                backgroundImage: ImageIndex + '.png',
                focusImage: ImageIndex + '_f.png',
                clickImage: ImageIndex + '_k.png',
                click: self._click,
                focusChange: '',
                val: key_val[i],
                Obj: self
            });
            i++;
        }
    },
    _click: function (btn) {
        var index;
        var self = btn.Obj;
        var isAction = false;
        self.showLetter = false;
        switch (btn.id) {
            case 'key-0': // 只输入“1”
                index = 0;
                break;
            case 'key-10':// 只输入“0”
                index = 0;
                break;
            case 'key-9':// 清空输入值
                index = '';
                isAction = true;
                break;
            case 'key-11': // 删除前一个输入值
                var fetchVal = self.input.getAttribute('val');  // 获得前一个输入值
                index = fetchVal.slice(0, fetchVal.length - 1);
                isAction = true;
                break;
            default: // 调用字母键盘
                self.showLetter = self._showLetter(btn);
                break;
        }
        !self.showLetter && self._updateValue(btn, index, isAction);
    },
    /**
     * 动态构建脚手架ID虚拟按钮（链接键值）
     */
    _showLetter: function (btn) {
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
            click: this._letterClick,
            focusChange: this._letterFocus,
            beforeMoveChange: this._letterDirection,
            focusable: true
        });
        this._initButton('input-key-wrapper');
        G(btn.id).className = 'show-letter';
        return true;
    },
    /**
     * 字母键盘获得焦点(样式操作)
     */
    _letterFocus: function (btn, hasFocus) {
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
    _letterClick: function (btn) {
        var self = btn.Obj;
        self._moveToFocus(btn.toObj.id);
        self._updateValue(btn.toObj, 2);
        self.showLetter = false; // 还原返回条件
        G(btn.toObj.id).className = '';
    },
    /**
     * 字母键盘被移动取值
     * index: 键值索引值
     */
    _letterDirection: function (key, btn) {
        var self = btn.Obj;
        var currentKey = btn.toObj;
        var index;
        switch (key) {
            case 'up':
                index = 0;
                break;
            case 'down':
                index = 4;
                break;
            case 'left':
                index = 1;
                break;
            case 'right':
                index = 3;
                break;
        }
        self._updateValue(currentKey, index);
        self.showLetter = false; // 还原返回条件
        G(btn.toObj.id).className = '';
    },
    /**
     * 实时更新关键字状态
     * currentKey：当前小键盘对象
     * index：关键字
     * isAction：是否执行附加操作（如删除、清空）
     */
    _updateValue: function (currentKey, index, isAction) {
        var input = this.input;
        var fetchVal = input.getAttribute('val');  // 获得前一个输入值

        if (arguments.length == 0) {
            fetchVal = this._getLocationString('keyWords');  // 若是播放回来,使用播放视频返回的搜索关键字
        } else {
            if (isAction) {
                fetchVal = index; // 抓取单个键值-->"0","1","清空","退格"
            } else {
                fetchVal += currentKey.val[index]; // 抓取前一个和当前输入值
            }
        }
        input.setAttribute('val', fetchVal); // 绑定当前抓取值
        input.innerText = fetchVal || '请输入首字母/数字进行搜索';// 输入框显示绑定值
        this._searchAction(fetchVal);                            // 执行Ajax搜索行为
    },
    /**
     * 执行ajax请求搜索获取视频列表信息
     * fetchVal：请求的关键字
     */
    _searchAction: function (fetchVal) {
        var self = this;
        // 根据热搜词汇进行搜索视频信息
        var postData = {'textvalue': fetchVal};
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Search/searchVideoByHotWord', postData, function (data) {
            if (data.result == 0) {
                // 调用视频列表对象
                /*data.list = [
                   {
                        'source_id': '1411',
                        'carrier_id': '640092',
                        'image_url': '\/imgs\/640092\/video\/20180920\/183.png',
                        'title': '\u300a\u5c0f\u5b69\u5e73\u65f6\u53ef\u4ee5\u5403\u4e09\u516c\u4ed4\u5c0f\u513f\u4e03\u661f\u8336\u5417\u300b',
                        'ftp_url': '{"bq_ftp_url":"99100000012018091816490302858427","gq_ftp_url":"99100000012018091816490302858427"}',
                        'source_type': '0',
                        'model_type': '10',
                        'user_type': '2',
                        'free_seconds': '30',
                        'duration': '0:01:39',
                        'intro_image_url': '',
                        'intro_txt': '',
                        'price': '0',
                        'valid_duration': '0',
                        'show_status': '2',
                        'union_code': 'gylm183',
                        'insert_dt': '2018-09-20 09:50:40'
                    }, {
                        'source_id': '1406',

                        'carrier_id': '640092',
                        'image_url': '\/imgs\/640092\/video\/20180920\/178.png',
                        'title': '\u300a\u513f\u79d1\u4e3b\u4efb\uff1a\u5b69\u5b50\u4e00\u5e74\u56db\u5b63\u90fd\u80fd\u8fdb\u8865\u5417\uff1f\u300b',
                        'ftp_url': '{"bq_ftp_url":"99100000012018091816490202858417","gq_ftp_url":"99100000012018091816490202858417"}',
                        'source_type': '0',
                        'model_type': '10',
                        'user_type': '2',
                        'free_seconds': '30',
                        'duration': '0:02:06',
                        'intro_image_url': '',
                        'intro_txt': '',
                        'price': '0',
                        'valid_duration': '0',
                        'show_status': '2',
                        'union_code': 'gylm178',
                        'insert_dt': '2018-09-20 09:50:38'
                    }, {
                        'source_id': '1008',
                        'carrier_id': '640092',
                        'image_url': '\/imgs\/640092\/video\/20180903\/700.png',
                        'title': '\u76ee\u524d\u80ba\u764c\u7684\u653e\u5c04\u6cbb\u7597\u6709\u54ea\u4e9b\u65b0\u7684\u6280\u672f\u5417\uff1f',
                        'ftp_url': '{"bq_ftp_url":"99100000012018083117061002742151","gq_ftp_url":"99100000012018083117044002741421"}',
                        'source_type': '0',
                        'model_type': '1',
                        'user_type': '2',
                        'free_seconds': '30',
                        'duration': '0:03:04',
                        'intro_image_url': '',
                        'intro_txt': '',
                        'price': '0',
                        'valid_duration': '0',
                        'show_status': '2',
                        'union_code': 'gylm700',
                        'insert_dt': '2018-09-03 19:28:10'
                    }, {
                        'source_id': '1408',
                        'carrier_id': '640092',
                        'image_url': '\/imgs\/640092\/video\/20180920\/180.png',
                        'title': '\u300a\u813e\u80c3\u4e43\u540e\u5929\u4e4b\u672c \u8c03\u813e\u4e4b\u4f59\u8be5\u5982\u4f55\u517b\u80c3\u300b',
                        'ftp_url': '{"bq_ftp_url":"99100000012018091816490202858421","gq_ftp_url":"99100000012018091816490202858421"}',
                        'source_type': '0',
                        'model_type': '10',
                        'user_type': '2',
                        'free_seconds': '30',
                        'duration': '0:01:23',
                        'intro_image_url': '',
                        'intro_txt': '',
                        'price': '0',
                        'valid_duration': '0',
                        'show_status': '2',
                        'union_code': 'gylm180',
                        'insert_dt': '2018-09-20 09:50:39'
                    }, {
                        'source_id': '1008',
                        'carrier_id': '640092',
                        'image_url': '\/imgs\/640092\/video\/20180903\/700.png',
                        'title': '\u76ee\u524d\u80ba\u764c\u7684\u653e\u5c04\u6cbb\u7597\u6709\u54ea\u4e9b\u65b0\u7684\u6280\u672f\u5417\uff1f',
                        'ftp_url': '{"bq_ftp_url":"99100000012018083117061002742151","gq_ftp_url":"99100000012018083117044002741421"}',
                        'source_type': '0',
                        'model_type': '1',
                        'user_type': '2',
                        'free_seconds': '30',
                        'duration': '0:03:04',
                        'intro_image_url': '',
                        'intro_txt': '',
                        'price': '0',
                        'valid_duration': '0',
                        'show_status': '2',
                        'union_code': 'gylm700',
                        'insert_dt': '2018-09-03 19:28:10'
                    }, {
                        'source_id': '1408',
                        'carrier_id': '640092',
                        'image_url': '\/imgs\/640092\/video\/20180920\/180.png',
                        'title': '\u300a\u813e\u80c3\u4e43\u540e\u5929\u4e4b\u672c \u8c03\u813e\u4e4b\u4f59\u8be5\u5982\u4f55\u517b\u80c3\u300b',
                        'ftp_url': '{"bq_ftp_url":"99100000012018091816490202858421","gq_ftp_url":"99100000012018091816490202858421"}',
                        'source_type': '0',
                        'model_type': '10',
                        'user_type': '2',
                        'free_seconds': '30',
                        'duration': '0:01:23',
                        'intro_image_url': '',
                        'intro_txt': '',
                        'price': '0',
                        'valid_duration': '0',
                        'show_status': '2',
                        'union_code': 'gylm180',
                        'insert_dt': '2018-09-20 09:50:39'
                    }
                ];*/
                new VideoList(data.list, fetchVal);

                LMEPG.UI.dismissWaitingDialog();
                // 获取是否播放操作返回
                if (LMEPG.Cookie.getCookie('oncePlay') == '1') {
                    // 还原常规搜索操作
                    LMEPG.Cookie.setCookie('oncePlay', '0');
                    self._initButton(RenderParam.focusIndex);
                } else {
                    self._initButton(LMEPG.ButtonManager.getCurrentButton().id);
                }
            } else {
                LMEPG.UI.showToast('视频加载失败[code=' + data.result + ']');
            }
        });
    },
    _initButton: function (focusId) {
        LMEPG.ButtonManager.init(focusId, this.buttons, '', true);
    },
    _moveToFocus: function (focusId) {
        LMEPG.ButtonManager.requestFocus(focusId);
    },
    /**
     * 获取浏览器跳转设置的参数
     * @param name
     * @returns {string}
     * @private
     */
    _getLocationString: function (name) {
        try {
            var searchData = window.location.search.replace(/\?/g, '');
            var arr = searchData.split('&');
            var objData = {};
            arr.forEach(function (t) {
                var key = t.slice(0, t.indexOf('='));
                objData[key] = t.slice(t.indexOf('=') + 1);
            });
            return objData[name] ? objData[name] : '';
        } catch (e) {
            //    nothing
        }
    },
    /**
     * 返回事件
     */
    onBack: function () {
        // 与方向键操作对象一样，用户返回键之后送回当前键值焦点
        if ($.showLetter) {
            var currentKey = LMEPG.ButtonManager.getCurrentButton().toObj;
            $._moveToFocus(currentKey.id);
            $.showLetter = false;
            G(currentKey.id).className = '';
        } else {
            LMEPG.Intent.back();
        }
    }
};

var $ = new Search();
// 公用返回函数（全局、键值对象）
var onBack = $.onBack;

/**
 * 视频列表
 * @param data
 * @param fetchVal
 * @constructor
 */
function VideoList(data, fetchVal) {
    /**页数策略
     * 1.播放回来->即使用播放回来的页数
     * 2.搜索操作->使用初始化页数0
     * 3.播放回来的页数大于总页数（异常页数）->使用初始化页数0
     * @type {*|string}
     */
    var playStatus = LMEPG.Cookie.getCookie('oncePlay');
    var backPage = +playStatus ? $._getLocationString('page') : 0;
    this.page = backPage > (data.length / 6) ? 0 : parseInt(backPage);
    this.data = data;
    this.fetchVal = fetchVal;
    this.init();
}

VideoList.prototype = {
    init: function () {
        this._renderHtml();
    },
    _renderHtml: function () {
        var self = this;
        var htm = '';
        if (this.data.length == 0) {
            LMEPG.UI.showToast('没有您搜索的内容哦，换其他试试。', 1);
            htm += '<div class=\'null-data\'>搜索结果为空';
            H('page-index');
        } else {
            S('page-index');
        }
        var count = RenderParam.platformType == 'hd' ? 6 : 4;
        var basePageCount = this.page * count;
        var currentPageData = this.data.slice(basePageCount, basePageCount + count);
        this.videoInfo = currentPageData;
        currentPageData.forEach(function (t, i) {
            var imgFtp = RenderParam.fsUrl + t.image_url;
            htm += '<div class="item">';
            htm += '<img id=focus-' + i + '  data-focus=' + imgFtp + ' src=' + imgFtp + '>';
            htm += '<p class="item-title">' + t.title;
            htm += '</div>';
        });
        G('title').innerText = this.fetchVal != '' ? '搜索结果' : '大家都在看';
        G('content-container').innerHTML = htm;
        G('page-index').innerText = (this.page + 1) + '/' + Math.ceil(this.data.length / 6);
        this._toggleArrow();
        this._createButtons(currentPageData);
    },
    _turnPage: function (key, btn) {
        var self = btn.obj;
        var startPage = self.page;
        var endPage = Math.ceil(self.data.length / 6);
        var prevPageId = ['focus-0', 'focus-1', 'focus-2'];
        var nextPageId = ['focus-3', 'focus-4', 'focus-5'];
        if (RenderParam.platformType == 'sd') {
            prevPageId = ['focus-0', 'focus-1'];
            nextPageId = ['focus-2', 'focus-3'];
        }
        var judgeID = function (t) {
            return t == btn.id;
        };
        // 当且仅当条件满足才翻上一个页面：1.方向键向上；2.按钮为向上翻页按钮；3.不是第一页
        if (key == 'up' && prevPageId.filter(judgeID).length && startPage != 0) {
            self._prevPage();
        }
        // 当且仅当条件满足才翻下一个页面：1.方向键向下；2.按钮为向下翻页按钮；3.不是最后一页
        if (key == 'down' && nextPageId.filter(judgeID).length && (self.page + 1) != endPage) {
            self._nextPage();
        }
    },
    _prevPage: function () {
        this.page = Math.max(0, this.page -= 1);
        this._renderHtml();
        $._initButton('content-container');
    },
    _nextPage: function () {
        this.page = Math.min(Math.ceil(this.data.length / 6), this.page += 1);
        this._renderHtml();
        $._initButton('content-container');
    },
    _toggleArrow: function () {
        H('prev-arrow');
        H('next-arrow');
        this.page > 0 && S('prev-arrow');
        this.page < Math.ceil(this.data.length / 6 - 1) && S('next-arrow');
    },
    /**
     * 实时创建虚拟动态按钮
     * currentPageData：可视视频列表信息
     */
    _createButtons: function (currentPageData) {
        var self = this;
        if (RenderParam.platformType == 'sd') {
            $.buttons.splice(10);
        } else {
            $.buttons.splice(12);
        }
        $.buttons.push({
            id: 'content-container',
            name: '脚手架ID',
            nextFocusUp: RenderParam.platformType == 'hd' ? 'focus-5' : 'focus-3',
            nextFocusDown: 'focus-0'
        });
        var i = 0;
        var MAX_FOCUS_COUNT = currentPageData.length;
        var lastFocusObj = 'focus-' + (currentPageData.length - 1);
        while (i < MAX_FOCUS_COUNT) {
            var lineCount = 3;  // 每行的个数
            var upId = 'focus-' + (+i - 3); // 向上的焦点
            var downId = 'focus-' + (+i + 3);  // 向下的焦点
            var downFocusObj = G(downId);
            var toLeftFocus = i % 3 ? 'focus-' + (i - 1) : 'key-2';

            if (RenderParam.platformType == 'sd') {
                lineCount = 2;
                upId = 'focus-' + (+i - 2);
                downId = 'focus-' + (+i + 2);
                downFocusObj = G(downId);
                toLeftFocus = i % 2 ? 'focus-' + (i - 1) : 'key-2';
            }
            $.buttons.push({
                id: 'focus-' + i,
                name: '视频-' + currentPageData[i].source_id,
                type: 'others',
                nextFocusUp: upId,
                // 如果当前ID下移没有对象则移动到最后的那个对象上
                nextFocusDown: downFocusObj ? downId : (i < lineCount && lastFocusObj),
                nextFocusLeft: toLeftFocus,
                nextFocusRight: 'focus-' + (i + 1),
                click: self._click,
                focusChange: self._focusChange,
                beforeMoveChange: self._turnPage,
                obj: self
            });
            i++;
        }
    },
    /**
     * 视频列表被点击跳转播放页面该条视频
     * videoItem：实时获取的当前可视视频列表对象的信息
     */
    _click: function (btn) {
        var focusIDName = btn.id;
        var self = btn.obj;
        var videoItem = self.videoInfo[btn.id.slice(6)];
        var words = G('search-value').getAttribute('val');
        try {
            var videoUrlObj = (videoItem.ftp_url instanceof Object ? videoItem.ftp_url : JSON.parse(videoItem.ftp_url));
            var videoUrl = (RenderParam.platformType == 'hd' ? videoUrlObj.gq_ftp_url : videoUrlObj.bq_ftp_url);
            var videoInfo = {
                'sourceId': videoItem.source_id,
                'videoUrl': videoUrl,
                'title': videoItem.title,
                'type': videoItem.model_type,
                'freeSeconds': videoItem.free_seconds,
                'userType': videoItem.user_type,
                'unionCode': videoItem.union_code,
                'entryType': 3,
                'entryTypeName': RenderParam.modeTitle,
                'words': words,
                'focusIdx': focusIDName,
                'durationTime': videoItem.duration
            };

            // 先判断userType：2需要会员才能观看，其他可以直接观看
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                self.jumpPlayVideo(videoInfo);
            } else {
                var postData = {'videoInfo': JSON.stringify(videoInfo)};
                LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
                    if (data.result == 0) {
                        self.jumpBuyVip(videoInfo);
                    } else {
                        LMEPG.UI.showToast('系统报错', 3);
                    }
                });
            }
        } catch (e) {
            console.error(e);
        }
    },
    /**
     * 视频列表获得、失去焦点操作
     * 1.获得焦点当字数大于10个长度使用滚动效果
     * 2.失去焦点还原之前DOM结构
     */
    _focusChange: function (btn, hasFocus) {
        var self = btn.obj;
        var btnEl = G(btn.id);
        var pEl = document.createElement('p');
        var marqueeEl = document.createElement('marquee');
        if (hasFocus) {
            btnEl.className = 'focus';
            self._marquee(btnEl, marqueeEl);
        } else {
            self._marquee(btnEl, pEl);
            btnEl.removeAttribute('class');
        }
        return false;
    },
    /**
     * 滚动切换
     */
    _marquee: function (btnEl, newE) {
        var lastChildEl = btnEl.parentElement.lastElementChild;
        var title = lastChildEl.innerText;
        var MAX_roll = RenderParam.platformType == 'hd' ? 10 : 7;
        if (title.length > MAX_roll) {
            newE.innerText = title;
            btnEl.parentElement.replaceChild(newE, lastChildEl);
        }
    },
    /**
     * 得到当前页对象
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('search');
        objCurrent.setParam('classifyId', '0');
        objCurrent.setParam('fromId', '2');
        objCurrent.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
        objCurrent.setParam('page', this.page);
        // 记录播放操作
        LMEPG.Cookie.setCookie('oncePlay', '1');
        return objCurrent;
    },
    /**
     * 页面跳转 - 播发器
     */
    jumpPlayVideo: function (videoInfo) {
        var objCurrent = this.getCurrentPage();
        objCurrent.setParam('keyWords', videoInfo.words);

        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    /**
     * @func 进行购买操作
     * @param id 当前页的焦点位置
     * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
     * @returns {boolean}
     */
    jumpBuyVip: function (videoInfo) {
        var objCurrent = this.getCurrentPage();
        objCurrent.setParam('keyWords', videoInfo.works);

        var objOrderHome = LMEPG.Intent.createIntent('orderHome');
        objOrderHome.setParam('isPlaying', '1');
        objOrderHome.setParam('remark', videoInfo.title);

        LMEPG.Intent.jump(objOrderHome, objCurrent);
    }
};
