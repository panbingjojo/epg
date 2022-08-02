/**
 * 得到当前页对象
 */
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent('search');
    objCurrent.setParam('classifyId', '0');
    objCurrent.setParam('fromId', '2');
    objCurrent.setParam('currentPage', pageCurrent);
    objCurrent.setParam('focusIndex', LMEPG.ButtonManager.getCurrentButton().id);
    return objCurrent;
}

/**
 * 页面跳转 - 播发器
 */
function jumpPlayVideo(videoInfo) {
    var objCurrent = getCurrentPage();
    objCurrent.setParam('keyWords', videoInfo.works);

    var objPlayer = LMEPG.Intent.createIntent('player');
    objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

    LMEPG.Intent.jump(objPlayer, objCurrent);
}

/**
 * @func 进行购买操作
 * @param id 当前页的焦点位置
 * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
 * @returns {boolean}
 */
function jumpBuyVip(videoInfo) {
    var objCurrent = getCurrentPage();
    objCurrent.setParam('keyWords', videoInfo.works);

    var objOrderHome = LMEPG.Intent.createIntent('orderHome');
    objOrderHome.setParam('isPlaying', '1');
    objOrderHome.setParam('remark', videoInfo.title);

    LMEPG.Intent.jump(objOrderHome, objCurrent);
}

/**
 * 页面跳转 - 专辑
 * @param albumName
 * @param keyWords
 */
function jumpAlbum(albumName, keyWords) {
    var configInfo = {
        entryType: 13,
        source_id: albumName //专辑別名
    };

    var objCurrent = getCurrentPage();
    objCurrent.setParam('fromId', 3);
    objCurrent.setParam('keyWords', keyWords);

    var objAlbum = LMEPG.Intent.createIntent('album');
    objAlbum.setParam('inner', '1');
    objAlbum.setParam('albumName', albumName);

    LMEPG.Intent.jump(objAlbum, objCurrent);
}

var MAX_ELMENT_ROW_NUM = 2;             // 元素最大的行数
var MAX_ELMENT_COLUM_NUM = 2;           // 元素最大的列数

var DATA_TYPE_ALBUM = 0;            // 数据类型 - 专辑
var DATA_TYPE_VIDEO = 1;            // 数据类型 - 视频

var pageTotal = 0;                                   // 总页数
var pageCurrent = 0;                                 // 当前页码
var page = RenderParam.page;

var dataSet = (function () {
    return {
        rawData: [],   //原始数据
        fillDataList: [],  //合并后的数据填充数据
        realfillDataList: [], //当前正在填充的数据

        /**
         * 初始化数据集
         */
        init: function (rawData) {
            if (rawData == undefined || rawData == null)
                return;
            this.rawData = rawData;
            pageTotal = Math.ceil(this.rawData.count / (MAX_ELMENT_ROW_NUM * MAX_ELMENT_COLUM_NUM));         // 计算总页数
            if (pageTotal == 0) {
                pageCurrent = 0;  //重置当前页
            }
            if (pageTotal > 0) {
                pageCurrent = page;  //如果加载到数据，当前页默认为1
            }
            this.initData();
            updateArrows();
            updateUI();
        },

        /**
         * 得到数据总条数
         */
        getDataCount: function () {
            if (this.rawData !== undefined && this.rawData !== null && this.rawData.count !== null) {
                return this.rawData.count;
            }
            return 0;
        },

        /**
         * 初始化数据
         */
        initData: function () {
            this.fillDataList = [];
            if (this.rawData === undefined && this.rawData === null)
                return;
            if (this.rawData.album_list !== undefined && this.rawData.album_list !== null) {
                //专辑列表不为空
                for (var i = 0; i < this.rawData.album_list.length; i++) {
                    var item = {
                        type: DATA_TYPE_ALBUM,
                        name: this.rawData.album_list[i].subject_name,
                        image: this.rawData.album_list[i].image_url,
                        dataId: this.rawData.album_list[i].subject_id
                    };
                    this.fillDataList.push(item);
                }
            }
            if (this.rawData.list !== undefined && this.rawData.list !== null) {
                //视频列表不为空
                for (var i = 0; i < this.rawData.list.length; i++) {
                    var item = {
                        type: DATA_TYPE_VIDEO,
                        name: this.rawData.list[i].title,
                        image: this.rawData.list[i].image_url,
                        dataId: this.rawData.list[i].source_id
                    };
                    this.fillDataList.push(item);
                }
            }
            return this.fillDataList;
        },

        /**
         * 得到填充数据列表
         */
        getFillDataList: function () {
            //type: 类型，自己定义   name: 名称   image: 背景图片， dataId: 表示数据的Id
            if (this.fillDataList != undefined && this.fillDataList != null && this.fillDataList.length > 0) {
                //如果数据已经填充，直接返回数据列表
                return this.fillDataList;
            }
            this.initData();
            return this.fillDataList;
        },

        /**
         * 得到当前填充的数据列表
         */
        getRealFillDataList: function () {
            var data = this.getFillDataList();
            if (data != null) {
                var startIndex = (pageCurrent - 1) * (MAX_ELMENT_COLUM_NUM * MAX_ELMENT_ROW_NUM);
                var endIndex = startIndex + (MAX_ELMENT_COLUM_NUM * MAX_ELMENT_ROW_NUM);
                this.realfillDataList = data.slice(startIndex, endIndex);
            } else {
                this.realfillDataList.clear();
            }
            return this.realfillDataList;
        },

        /**
         * 得到填充数据的长度
         */
        getFillDataCount: function () {
            if (this.fillDataList != undefined && this.fillDataList != null && this.fillDataList.length > 0) {
                //如果数据已经填充，直接返回数据列表
                return this.fillDataList.length;
            }
            return 0;
        },

        /**
         * 得到填充数据的长度
         */
        getRealFillDataCount: function () {
            var dataList = this.getRealFillDataList();
            if (dataList != undefined && dataList != null) {
                return dataList.length;
            }
            return 0;
        },

        /**
         * 通过填充数据项获取原始数据对象
         * @param dataItem
         */
        getDataByItem: function (dataItem) {
            if (dataItem !== undefined && dataItem !== null) {
                switch (dataItem.type) {
                    case DATA_TYPE_ALBUM:
                        if (this.rawData.album_list !== undefined && this.rawData.album_list !== null) {
                            //专辑列表不为空
                            for (var i = 0; i < this.rawData.album_list.length; i++) {
                                if (this.rawData.album_list[i].subject_id == dataItem.dataId) {
                                    return this.rawData.album_list[i];
                                }
                            }
                        }
                        break;
                    case DATA_TYPE_VIDEO:
                        if (this.rawData.list !== undefined && this.rawData.list !== null) {
                            //专辑列表不为空
                            for (var i = 0; i < this.rawData.list.length; i++) {
                                if (this.rawData.list[i].source_id == dataItem.dataId) {
                                    return this.rawData.list[i];
                                }
                            }
                        }
                        break;
                }
            }
        }
    };
})();

/**
 * 创建元素
 */
function createElements(list) {
    if (list == undefined || list == null)
        return;

    stopMarqueeUI();

    //清空数据
    var content = document.getElementById('rightWrap');  //右边装载动态更新的图片容器
    content.innerHTML = '';

    for (var dataIndex = 0; dataIndex < list.length; dataIndex++) {
        //生成id
        if (dataIndex > 1) {
            var uiParentID = 'focus-9-' + (dataIndex - 1);
        } else {
            var uiParentID = 'focus-8-' + (dataIndex + 1);
        }
        var uiImgBorderID = uiParentID + '-border';
        var uiImgSrcID = uiParentID + '-src';
        var uiTitleID = uiParentID + '-title';

        //创建元素
        var uiParent = document.createElement('div');
        var uiImgBorder = document.createElement('img');
        var uiImgSrc = document.createElement('img');
        var uiTitle = document.createElement('div');

        uiParent.setAttribute('id', uiParentID);
        uiParent.setAttribute('index', dataIndex);   // 索引id。 用于和fillDataList 数组的下标关联
        uiImgBorder.setAttribute('id', uiImgBorderID);
        uiImgSrc.setAttribute('id', uiImgSrcID);
        uiImgSrc.setAttribute('src', RenderParam.fsUrl + list[dataIndex].image);

        uiTitle.setAttribute('id', uiTitleID);
        uiTitle.innerHTML = list[dataIndex].name;

        uiParent.appendChild(uiImgSrc);
        uiParent.appendChild(uiImgBorder);
        uiParent.appendChild(uiTitle);

        content.appendChild(uiParent);
    }
}

/**
 *更新界面元素
 * @param pagingFlag 翻页标记 0:不翻页,1翻页
 * @param pagingDirectionFlag:翻页方向：0:首次加载数据，1:向下翻页，2:向上翻页
 */
function updateUI() {
    // 清空数据
    var content = document.getElementById('rightWrap');
    content.innerHTML = '';

    // 更新页数显示
    var showPage = pageTotal > 0 ? (pageCurrent + '/' + pageTotal) : '';
    uiPageFlagElement.innerHTML = showPage;

    if (dataSet.getRealFillDataCount() <= 0) {
        LMEPG.UI.showToast('视频信息不存在');
        return;
    }

    //创建元素
    createElements(dataSet.getRealFillDataList());
}


/**
 * 向后翻页
 */
function pageDown() {
    if (pageCurrent < pageTotal) {
        pageCurrent++;
        updateArrows();
        updateUI();
        LMEPG.ButtonManager.requestFocus('focus-8-1-border');
    }
}

/**
 * 向前翻页
 */
function pageUp() {
    if (pageCurrent > 1) {
        pageCurrent--;
        updateArrows();
        updateUI();
        LMEPG.ButtonManager.requestFocus('focus-8-1-border');
    }
}

/**
 * 更新显示箭头
 * @param pagingDirectionFlag
 */
function updateArrows(pagingDirectionFlag) {
    uiArrowTopElement.style.visibility = 'visible';   //默认都显示
    uiArrowBottomElement.style.visibility = 'visible';
    if (pageCurrent <= 1) {
        uiArrowTopElement.style.visibility = 'hidden'; // 如果在第一页，top就隐藏
    }
    if (pageCurrent >= pageTotal) {
        uiArrowBottomElement.style.visibility = 'hidden';// 如果在最后一页，bottom隐藏
    }
}

(function () {
    G('default_link').focus();
})();

// var debug = document.getElementById("deg");
var nineKeyboardClickStatus = false;//键盘状态;0为弹出，1弹出键盘；
var timerID;                                     //滚动条的定时器
var searchData;                                     //页面返回的数据
var searchTextTips = '请输入首字母进行搜索'; //搜索框中的文字提示
var searchTitleInit = '大家都在看';           //初始化的搜索标题
var searchTitleWithWord = '搜索结果';        //使用字母+数字搜索的标题


var borderImgGetUrl = '/Public/img/' + RenderParam.platformType + '/Search/V21/imgbox.png';       //图片获取焦点的背景图


var borderImgLoseUrl = '/Public/img/' + RenderParam.platformType + '/Search/V21/transparent.png';        //图片失去焦点的背景图

var uiSearchTextElement = document.getElementById('searchText');          // 搜索文字
var uiSearchTitleElement = document.getElementById('searchTitle');         // 搜索结果的标题
var uiPageFlagElement = document.getElementById('pagePlag');               // 显示页码元素
var uiArrowTopElement = document.getElementById('topArrow');               //上箭头元素
var uiArrowBottomElement = document.getElementById('bottomArrow');        //上箭头元素

//存的值对应上下左右中的点击事件
var keyCodeMapping = {
    'focus-1-2': ['2', '', 'A', 'C', 'B'],
    'focus-1-3': ['3', '', 'D', 'F', 'E'],
    'focus-2-1': ['4', '', 'G', 'I', 'H'],
    'focus-2-2': ['5', '', 'J', 'L', 'K'],
    'focus-2-3': ['6', '', 'M', 'O', 'N'],
    'focus-3-1': ['7', 'S', 'P', 'R', 'Q'],
    'focus-3-2': ['8', '', 'T', 'V', 'U'],
    'focus-3-3': ['9', 'Z', 'W', 'Y', 'X']
};


//弹出键盘事件
function keyWordsDir(dir, current) {
    switch (dir) {
        case 'up':
            if (nineKeyboardClickStatus) {
                updateSearch('top', current.id);
                if (nineKeyboardClickStatus) {
                    nineKeyboardClickStatus = false;
                    return false;
                }
            } else {

            }
            break;
        case  'down':
            if (nineKeyboardClickStatus) {
                updateSearch('bottom', current.id);
                if (nineKeyboardClickStatus) {
                    nineKeyboardClickStatus = false;
                    return false;
                }
            } else {

            }

            break;
        case 'left':
            if (nineKeyboardClickStatus) {
                updateSearch('left', current.id);
                if (nineKeyboardClickStatus) {
                    nineKeyboardClickStatus = false;
                    return false;
                }
            } else {

            }
            break;
        case  'right':
            if (nineKeyboardClickStatus) {
                updateSearch('right', current.id);
                if (nineKeyboardClickStatus) {
                    nineKeyboardClickStatus = false;
                    return false;
                }

            } else {

            }
            break;
    }

}

function updateNineKeyboardSrcWithClick(storeID) {
    var currEle = document.getElementById(storeID);
    var onBigImage = LMEPG.ButtonManager.getCurrentButton().bigImg;//获得焦点事件id
    currEle.src = onBigImage;
    nineKeyboardClickStatus = true;
    if (RenderParam.platformType == 'hd') {
        currEle.style.height = '150px';
        currEle.style.width = '150px';
        currEle.style.top = '-14px';
        currEle.style.left = '-14px';
    } else {
        currEle.style.height = '90px';
        currEle.style.width = '90px';
        currEle.style.top = '0px';
        currEle.style.left = '0px';
    }

}

function updateNineKeyboardSrcWithBack(storeID) {
    var currEle = document.getElementById(storeID);
    var onFocusImage = LMEPG.ButtonManager.getCurrentButton().focusImage;//获得焦点事件id
    currEle.src = onFocusImage;
    nineKeyboardClickStatus = false;
    if (RenderParam.platformType == 'hd') {
        currEle.style.height = '122px';
        currEle.style.width = '123px';
        currEle.style.top = '0px';
        currEle.style.left = '0px';
    } else {
        currEle.style.height = '90px';
        currEle.style.width = '90px';
        currEle.style.top = '0px';
        currEle.style.left = '0px';
    }

}

function updateSearch(direction, currId) {
    var currID = currId;
    var currMapKey;
    switch (direction) {
        case 'top':
            currMapKey = keyCodeMapping[currID][0];
            break;
        case 'bottom':
            currMapKey = keyCodeMapping[currID][1];
            break;
        case 'left':
            currMapKey = keyCodeMapping[currID][2];
            break;
        case 'right':
            currMapKey = keyCodeMapping[currID][3];
            break;
        case 'center':
            if (nineKeyboardClickStatus) {
                var currID = LMEPG.ButtonManager.getCurrentButton().id;
                currMapKey = keyCodeMapping[currID][4];
                nineKeyboardClickStatus = false;
            }
            break;
            return;
    }

    if (currMapKey == undefined || currMapKey == '') {
        return;
    }

    var currentText = uiSearchTextElement.innerHTML;
    var lastText = '';
    if (currentText == searchTextTips) {
        lastText = currMapKey;
    } else {
        lastText = currentText + currMapKey;
    }

    uiSearchTextElement.innerHTML = lastText;
    searchVideoByHotWord(lastText);

    var currEle = document.getElementById(currID);
    var onFocusImage = LMEPG.ButtonManager.getCurrentButton().focusImage;//获得焦点事件id
    currEle.src = onFocusImage;
    if (RenderParam.platformType == 'hd') {
        currEle.style.height = '122px';
        currEle.style.width = '123px';
        currEle.style.top = '0px';
        currEle.style.left = '0px';
    } else {
        currEle.style.height = '90px';
        currEle.style.width = '90px';
        currEle.style.top = '0px';
        currEle.style.left = '0px';
    }
}

function onKeyCenter(btn) {
    var storeID = btn.id;
    var clickPosition = storeID.substring(6, 7);
    var clickInt = parseInt(clickPosition);
    var videoID = storeID.substring(0, 9);
    switch (clickInt) {
        case 8:     //点击加载图片的第一排
            clickVideo(videoID);
            break;
        case 9:     //点击加载出来的第二排图片
            clickVideo(videoID);
            break;
        default:
            pageCurrent = 1;
            page = 1;
            if (clickInt < 7) {    //点击键盘部分
                switch (storeID) {
                    case 'focus-1-1':
                        var currentText = uiSearchTextElement.innerHTML;
                        var lastText = '';
                        if (currentText == searchTextTips) {
                            lastText = '1';
                        } else {
                            lastText = currentText + '1';
                        }

                        uiSearchTextElement.innerHTML = lastText;
                        searchVideoByHotWord(lastText);
                        break;
                    case 'focus-4-1':
                        searchClear(storeID);
                        break;
                    case 'focus-4-2':
                        var currentText = uiSearchTextElement.innerHTML;
                        var lastText = '';
                        if (currentText == searchTextTips) {
                            lastText = '0';
                        } else {
                            lastText = currentText + '0';
                        }

                        uiSearchTextElement.innerHTML = lastText;
                        searchVideoByHotWord(lastText);
                        break;
                    case 'focus-4-3':
                        searchBack(storeID);
                        break;
                    default:
                        if (nineKeyboardClickStatus) {
                            updateSearch('center');
                            return;
                        } else {
                            updateNineKeyboardSrcWithClick(storeID);
                        }
                        break;
                }

            }
            break;
    }
}


/**
 * 监听上页按键
 */
function pressPreviousPage() {
    pageUp();
}

/**
 * 监听下页按键
 */
function pressNextPage() {
    pageDown();
}


function stopMarqueeUI() {
    LMEPG.UI.Marquee.stop();
}

function marqueeUI(nextID) {
    LMEPG.UI.Marquee.stop();
    var scrollFocus = nextID + '-title';
    LMEPG.UI.Marquee.start(nextID, 4, 2, 50, 'left', 'scroll');
}


// 根据热搜词汇进行搜索视频信息
function searchVideoByHotWord(textvalue, focusId) {
    searchVideoByHotWordPost(textvalue, focusId);
}

function searchVideoByHotWordPost(textValue, focusId) {
    var postData = {'textvalue': textValue};
    LMEPG.ajax.postAPI('Search/searchVideoByHotWord', postData, function (data) {
        if (data.result == 0) {
            dataSet.init(data);
            if (typeof focusId !== 'undefined') {
                LMEPG.ButtonManager.requestFocus(focusId);
            }
        } else {
            LMEPG.UI.showToast('视频加载失败[code=' + data.result + ']');
        }

        if (textValue == '' || textValue == undefined || textValue == null) {
            uiSearchTitleElement.innerHTML = searchTitleInit;
        } else {
            uiSearchTitleElement.innerHTML = searchTitleWithWord;
        }
    });
}

function clickVideo(videoID) {
    //选中视频点击事件
    var focusIDName = videoID;
    var focusElement = document.getElementById(focusIDName);
    var index = focusElement.getAttribute('index');
    var list = dataSet.getRealFillDataList();
    if (list != undefined && list != null) {
        var works = '';
        if (searchTextTips != uiSearchTextElement.innerHTML) {
            works = uiSearchTextElement.innerHTML;
        }
        if (index >= 0 && index < list.length) {
            var item = list[index];
            switch (item.type) {
                case DATA_TYPE_ALBUM:
                    var videoItem = dataSet.getDataByItem(item);
                    if (videoItem != undefined && videoItem != null) {
                        jumpAlbum(videoItem.alias_name, works);
                    }
                    break;
                case DATA_TYPE_VIDEO:
                    var videoItem = dataSet.getDataByItem(item);
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
                            'focusIdx': focusIDName,
                            'works': works,
                            'show_status':videoItem.show_status
                        };

                        //视频专辑下线处理
                        if(videoInfo.show_status == "3") {
                            LMEPG.UI.showToast('该节目已下线');
                            return;
                        }

                        // 先判断userType：2需要会员才能观看，其他可以直接观看
                        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                            jumpPlayVideo(videoInfo);
                        } else {
                            var postData = {'videoInfo': JSON.stringify(videoInfo)};
                            LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
                                if (data.result == 0) {
                                    jumpBuyVip(videoInfo);
                                } else {
                                    LMEPG.UI.showToast('系统报错', 3);
                                }
                            });
                        }
                    } catch (e) {
                    }
                    break;
            }
        }
    }
}

/**
 * 清空搜索框中的文本
 */
function searchClear() {
    var currentText = uiSearchTextElement.innerHTML;
    if (currentText == searchTextTips) {
        return;
    }
    uiSearchTextElement.innerHTML = searchTextTips;
    searchVideoByHotWord('');
}

/**
 * 删除搜索框中的最后一个字符
 */
function searchBack() {
    var currentText = uiSearchTextElement.innerHTML;
    if (currentText == searchTextTips || currentText == '' || currentText == null || currentText == undefined) {
        return;
    }

    var str = currentText.substring(0, currentText.length - 1);
    uiSearchTextElement.innerHTML = str;
    if (uiSearchTextElement.innerHTML == '') {
        uiSearchTextElement.innerHTML = searchTextTips;
    } else {
        uiSearchTextElement.innerHTML = str;
    }
    searchVideoByHotWord(str);
}

/**
 * 根据图片地址生产js能使用的背景图片地址
 * @param imgURL
 */
function createBackgroundURL(imgURL) {
    return 'url(\'' + imgURL + '\') no-repeat';
}

//        获得焦点事件
function onFocusChange(btn, hasFocus) {
    if (hasFocus) {
        marqueeUI(btn.title);  //开始滚动标题
    } else {
        stopMarqueeUI();
    }
}

function onBack() {
    if (typeof (nineKeyboardClickStatus) !== 'undefined' && nineKeyboardClickStatus) {
        var btnId = LMEPG.ButtonManager.getCurrentButton().id;//获得焦点事件id
        updateNineKeyboardSrcWithBack(btnId);
    } else {
        LMEPG.Intent.back();
    }
}

//        注册翻页按钮
LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_PAGE_UP: 'pressPreviousPage()',	        //上一页事件
        KEY_PAGE_DOWN: 'pressNextPage()'           //下一页事件
    });
var buttons = [
    {
        id: 'focus-1-1',
        name: '按键1',
        type: 'img',
        nextFocusLeft: 'focus-1-3',
        nextFocusRight: 'focus-1-2',
        nextFocusUp: 'focus-4-1',
        nextFocusDown: 'focus-2-1',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword1_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword1_in.png',
        bigImg: '',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-1-2',
        name: '按键2',
        type: 'img',
        nextFocusLeft: 'focus-1-1',
        nextFocusRight: 'focus-1-3',
        nextFocusUp: 'focus-4-2',
        nextFocusDown: 'focus-2-2',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword2_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword2_in.png',
        bigImg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword2_confrim.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-1-3',
        name: '按键3',
        type: 'img',
        nextFocusLeft: 'focus-1-2',
        nextFocusRight: 'focus-8-1-border',
        nextFocusUp: 'focus-4-3',
        nextFocusDown: 'focus-2-3',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword3_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword3_in.png',
        bigImg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword3_confrim.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-2-1',
        name: '按键4',
        type: 'img',
        nextFocusLeft: 'focus-2-3',
        nextFocusRight: 'focus-2-2',
        nextFocusUp: 'focus-1-1',
        nextFocusDown: 'focus-3-1',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword4_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword4_in.png',
        bigImg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword4_confrim.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-2-2',
        name: '按键5',
        type: 'img',
        nextFocusLeft: 'focus-2-1',
        nextFocusRight: 'focus-2-3',
        nextFocusUp: 'focus-1-2',
        nextFocusDown: 'focus-3-2',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword5_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword5_in.png',
        bigImg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword5_confrim.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-2-3',
        name: '按键6',
        type: 'img',
        nextFocusLeft: 'focus-2-2',
        nextFocusRight: 'focus-8-1-border',
        nextFocusUp: 'focus-1-3',
        nextFocusDown: 'focus-3-3',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword6_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword6_in.png',
        bigImg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword6_confrim.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-3-1',
        name: '按键7',
        type: 'img',
        nextFocusLeft: 'focus-3-3',
        nextFocusRight: 'focus-3-2',
        nextFocusUp: 'focus-2-1',
        nextFocusDown: 'focus-4-1',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword7_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword7_in.png',
        bigImg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword7_confrim.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-3-2',
        name: '按键8',
        type: 'img',
        nextFocusLeft: 'focus-3-1',
        nextFocusRight: 'focus-3-3',
        nextFocusUp: 'focus-2-2',
        nextFocusDown: 'focus-4-2',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword8_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword8_in.png',
        bigImg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword8_confrim.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-3-3',
        name: '按键9',
        type: 'img',
        nextFocusLeft: 'focus-3-2',
        nextFocusRight: 'focus-8-1-border',
        nextFocusUp: 'focus-2-3',
        nextFocusDown: 'focus-4-3',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword9_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword9_in.png',
        bigImg: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword9_confrim.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-4-1',
        name: '按键清空',
        type: 'img',
        nextFocusLeft: 'focus-4-3',
        nextFocusRight: 'focus-4-2',
        nextFocusUp: 'focus-3-1',
        nextFocusDown: 'focus-1-1',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/del_btn_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/del_btn_in.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-4-2',
        name: '按键0',
        type: 'img',
        nextFocusLeft: 'focus-4-1',
        nextFocusRight: 'focus-4-3',
        nextFocusUp: 'focus-3-2',
        nextFocusDown: 'focus-1-2',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword0_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/keyword0_in.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-4-3',
        name: '退格',
        type: 'img',
        nextFocusLeft: 'focus-4-2',
        nextFocusRight: 'focus-8-1-border',
        nextFocusUp: 'focus-3-3',
        nextFocusDown: 'focus-1-3',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/back_btn_out.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/back_btn_in.png',
        click: onKeyCenter,
        beforeMoveChange: keyWordsDir,
        moveChange: ''
    }, {
        id: 'focus-8-1-border',
        name: '视频1号位',
        type: 'img',
        indexId: 'focus-8-1',
        title: 'focus-8-1-title',
        nextFocusLeft: 'focus-1-3',
        nextFocusRight: 'focus-8-2-border',
        nextFocusUp: '',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/transparent.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/imgbox.png',
        click: onKeyCenter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }, {
        id: 'focus-8-2-border',
        name: '视频2号位',
        type: 'img',
        indexId: 'focus-8-2',
        title: 'focus-8-2-title',
        nextFocusLeft: 'focus-8-1-border',
        nextFocusRight: 'focus-8-3-border',
        nextFocusUp: '',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/transparent.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/imgbox.png',
        click: onKeyCenter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }, {
        id: 'focus-8-3-border',
        name: '视频3号位',
        type: 'img',
        indexId: 'focus-8-3',
        title: 'focus-8-3-title',
        nextFocusLeft: 'focus-8-2-border',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/transparent.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/imgbox.png',
        click: onKeyCenter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }, {
        id: 'focus-9-1-border',
        name: '视频1号位',
        type: 'img',
        indexId: 'focus-9-1',
        title: 'focus-9-1-title',
        nextFocusLeft: 'focus-3-3',
        nextFocusRight: 'focus-9-2-border',
        nextFocusUp: 'focus-8-1-border',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/transparent.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/imgbox.png',
        click: onKeyCenter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }, {
        id: 'focus-9-2-border',
        name: '视频2号位',
        type: 'img',
        indexId: 'focus-9-2',
        title: 'focus-9-2-title',
        nextFocusLeft: 'focus-9-1-border',
        nextFocusRight: 'focus-9-3-border',
        nextFocusUp: 'focus-8-2-border',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/transparent.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/imgbox.png',
        click: onKeyCenter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }, {
        id: 'focus-9-3-border',
        name: '视频3号位',
        type: 'img',
        indexId: 'focus-9-3',
        title: 'focus-9-3-title',
        nextFocusLeft: 'focus-9-2-border',
        nextFocusRight: '',
        nextFocusUp: 'focus-8-3-border',
        nextFocusDown: '',
        focusable: true,
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/transparent.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V21/imgbox.png',
        click: onKeyCenter,
        focusChange: onFocusChange,
        beforeMoveChange: onBeforeMoveChange,
        moveChange: ''
    }];


/**
 * 焦点移动前事件回调
 * @param prev
 * @param btn
 * @param hasFocus
 */
function onBeforeMoveChange(dir, current) {
    //翻页
    switch (current.id) {
        case 'focus-9-1-border':
        case 'focus-9-2-border':
        // case 'focus-9-3-border':
            if (dir == 'down') {
                pressNextPage();
            }
            break;
        case 'focus-8-1-border':
        case 'focus-8-2-border':
        // case 'focus-8-3-border':
            if (dir == 'down') {
                //如果焦点位置在第二个详情位置按下键，判断第二行没有数据，跳到第二行上一个焦点
                var x = parseInt(current.id.substring(8, 9));
                for (; x > 0; x--) {
                    var nextFocusIdName = 'focus-' + 9 + '-' + x + '-border';
                    var element = document.getElementById(nextFocusIdName);
                    if (element != null && typeof (element) != 'undefined') {
                        break;
                    }
                }
                if (typeof (element) == 'undefined' || element == null) {
                    return false;
                } else {
                    LMEPG.ButtonManager.requestFocus(nextFocusIdName);
                }
            } else if (dir == 'up') {
                pressPreviousPage();
            }
            break;
    }
}

window.onload = function () {
    if (parseInt(RenderParam.isReturnFlag) > 0) {
        if (RenderParam.keyWords != "") {
            uiSearchTextElement.innerHTML = RenderParam.keyWords;
        }
    }

    LMEPG.ButtonManager.init("focus-1-1", buttons);
    searchVideoByHotWord(RenderParam.keyWords, is_empty(RenderParam.focusId) ? "focus-1-1" : RenderParam.focusId);
};
