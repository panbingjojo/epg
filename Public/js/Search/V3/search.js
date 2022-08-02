var MAX_ELMENT_ROW_NUM = 2;             // 元素最大的行数
var MAX_ELMENT_COLUM_NUM = 3;           // 元素最大的列数

var DATA_TYPE_ALBUM = 0;            // 数据类型 - 专辑
var DATA_TYPE_VIDEO = 1;            // 数据类型 - 视频

var pageCurrent = isNaN(parseInt(RenderParam.pageCurrent)) ? parseInt(RenderParam.pageCurrent) : 1;
var pageTotal = 0;                                   // 总页数

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

                // if (parseInt(RenderParam.isReturnFlag) < 1) {
                //     pageCurrent = 1;  //如果加载到数据，当前页默认为1
                // }
                // 修复返回时页码
                //pageCurrent=RenderParam.pageCurrent;
                if(parseInt(RenderParam.isReturnFlag) == 0) {
                    pageCurrent = 1;
                }else {
                    pageCurrent = RenderParam.pageCurrent
                }
            }
            this.initData();
            updateArrows();
            updateUI();
            updateMarquee(PAGE_INIT);
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

    //清空数据
    var content = document.getElementById('rightWrap');  //右边装载动态更新的图片容器
    content.innerHTML = '';

    for (var dataIndex = 0; dataIndex < list.length; dataIndex++) {
        //生成id
        if (dataIndex > 2) {
            var uiParentID = 'focus-9-' + (dataIndex - 2);
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
        uiParent.setAttribute('index', dataIndex + '');   // 索引id。 用于和fillDataList 数组的下标关联
        uiImgBorder.setAttribute('id', uiImgBorderID);
        uiImgBorder.setAttribute('src', CommonBorderSrc);
        uiImgSrc.setAttribute('id', uiImgSrcID);
        uiImgSrc.setAttribute('src', RenderParam.fsUrl + list[dataIndex].image);

        uiTitle.setAttribute('id', uiTitleID);
        uiTitle.innerHTML = list[dataIndex].name;

        uiParent.appendChild(uiImgBorder);
        uiParent.appendChild(uiImgSrc);
        uiParent.appendChild(uiTitle);

        var videoItem = dataSet.getDataByItem(list[dataIndex]);
        var userType = false;
        if (videoItem.user_type == '2' && showCornerVip == '1') {
            //显示vip
            userType = true;
        }
        if (videoItem.user_type == '3' && RenderParam.showCornerPay == '1') {
            //显示付费
            userType = true;
        }
        if (RenderParam.platformType == 'hd') {
            if (dataIndex > 2) {
                LMEPG.UI.setCornerMore(uiParent, 21, 25, 40, 40, userType, videoItem.user_type);
            } else {
                LMEPG.UI.setCornerMore(uiParent, 21, 14, 40, 40, userType, videoItem.user_type);
            }
        } else {
            if (dataIndex > 2) {
                LMEPG.UI.setCornerMore(uiParent, 10, 10, 25, 25, userType, videoItem.user_type);
            } else {
                LMEPG.UI.setCornerMore(uiParent, 10, 10, 25, 25, userType, videoItem.user_type);
            }
        }
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
        LMEPG.UI.showToastV2('视频信息不存在', 3);
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
    }
    updateArrows();
    updateUI();
    updateMarquee(PAGE_DOWN);
}

/**
 * 向前翻页
 */
function pageUp() {
    if (pageCurrent > 1) {
        pageCurrent--;
    }
    updateArrows();
    updateUI();
    updateMarquee(PAGE_UP);
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

function updateMarquee(dir) {
    if (parseInt(RenderParam.isReturnFlag) > 0 || dir > 0) {
        var nextID = 'focus-8-1-border';
        if (parseInt(RenderParam.isReturnFlag) > 0) {
            nextID = RenderParam.focusId;
        }
        LMEPG.UI.Marquee.rollId = undefined;
        LMEPG.UI.Marquee.stop();
        LMEPG.ButtonManager.requestFocus(nextID);
        var btn = LMEPG.ButtonManager.getButtonById(nextID);
        LMEPG.UI.Marquee.start(btn.title, 4, 2, 50, 'left', 'scroll');
        RenderParam.isReturnFlag = 0;
    }
}

<!--页面跳转-->
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
 * 跳转 - 挽留页
 */
function jumpHoldPage() {
    var objHome = getCurrentPage();
    var objHold = LMEPG.Intent.createIntent('hold');
    objHold.setParam('isReturnFlag', '8');
    LMEPG.Intent.jump(objHold, objHome);
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
    objCurrent.setParam('keyWords', jumpHoldPage());

    var objAlbum = LMEPG.Intent.createIntent('album');
    objAlbum.setParam('albumName', albumName);
    objAlbum.setParam('inner', 1);

    LMEPG.Intent.jump(objAlbum, objCurrent);
}

/**
 * 跳转 - 视频详情页
 */
function jumpIntroVideo(videoInfo) {
    if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
        LMEPG.UI.showToastV2('视频信息为空！');
        return;
    }

    var objHome = getCurrentPage();
    // 跳转时保存输入框内容
    objHome.setParam('keyWords', videoInfo.works);
    // 更多视频，按分类进入
    var objPlayer = LMEPG.Intent.createIntent('introVideo-single');
    objPlayer.setParam('inner', 1);
    objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

    LMEPG.Intent.jump(objPlayer, objHome);
}

var searchData;                                     //页面返回的数据

var PAGE_INIT = 0;                         //初始化页面加载数据
var PAGE_UP = 1;                         //左翻页加载数据
var PAGE_DOWN = 2;                        //右翻页加载数据

var searchTextTips = '请输入首字母进行搜索'; //搜索框中的文字提示
var searchTitleInit = '大家都在看';           //初始化的搜索标题
var searchTitleWithWord = '搜索结果';        //使用字母+数字搜索的标题

var page = 1;


var borderKeyLoseUrl = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/defaultbg.png';     //按键失去焦点的背景图
var CommonBorderSrc = g_appRootPath + '/Public/img/Common/spacer.gif';                   //透明的背景图片，避免广电盒子有一个默认边框


var uiSearchTextElement = document.getElementById('searchText');          // 搜索文字
var uiSearchTitleElement = document.getElementById('searchTitle');         // 搜索结果的标题
var uiPageFlagElement = document.getElementById('pagePlag');               // 显示页码元素
var uiArrowTopElement = document.getElementById('topArrow');               //上箭头元素
var uiArrowBottomElement = document.getElementById('bottomArrow');        //上箭头元素

var fontSelectColor = '#1d4377';                                             //文字选中的效果
var fontSelectLoseColor = 'white';                                           //文字不选择的效果
var showCornerVip = '1';                // 是否显示vip角标


function onBack() {
    LMEPG.Intent.back();
}

window.onload = function () {
    LMEPG.KeyEventManager.addKeyEvent(
        {
            KEY_399: function () { //广西广电返回键
                LMEPG.Intent.back();
            },
            KEY_514: function () {  //广西广电退出键
                jumpHoldPage();
            }
        }
    );

    if (parseInt(RenderParam.isReturnFlag) > 0) {
        var idx = document.getElementById('focus-1-1');
        idx.style.color = fontSelectLoseColor;
        idx.style.background = createBackgroundURL(borderKeyLoseUrl);
        if (RenderParam.keyWords != '') {
            uiSearchTextElement.innerHTML = RenderParam.keyWords;
        }
    }

    if (is_empty(RenderParam.focusId)) {
        RenderParam.focusId = "focus-1-1";
    }

    searchVideoByHotWord(RenderParam.keyWords);
    var buttons = getInitButton();
    LMEPG.ButtonManager.init(RenderParam.focusId, buttons);
};

// 根据热搜词汇进行搜索视频信息
function searchVideoByHotWord(textValue) {
    var postData = {'textvalue': textValue};
    LMEPG.UI.showWaitingDialog('');
    LMEPG.ajax.postAPI('Search/searchVideoByHotWord', postData, function (data) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            if (data instanceof Object) {
                searchData = data;
            } else {
                searchData = JSON.parse(data);
            }
            dataSet.init(searchData);
        } catch (e) {
        }

        if (textValue == '' || textValue == undefined || textValue == null) {
            uiSearchTitleElement.innerHTML = searchTitleInit;
        } else {
            uiSearchTitleElement.innerHTML = searchTitleWithWord;
        }
    });
}

function clickVideo(storeID) {
    //选中视频点击事件
    var focusIDName = storeID;
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
                            'introImageUrl': videoItem.intro_image_url,
                            'introTxt': videoItem.intro_txt,
                            'price': videoItem.price,
                            'validDuration': videoItem.valid_duration,
                            'show_status': videoItem.show_status
                        };

                        //视频专辑下线处理
                        if(videoInfo.show_status == "3") {
                            LMEPG.UI.showToastV2('该节目已下线');
                            return;
                        }

                        if (RenderParam.carrierId == '450094') {
                            jumpIntroVideo(videoInfo);
                        } else {
                            // 先判断userType：2需要会员才能观看，其他可以直接观看
                            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                                jumpPlayVideo(videoInfo);
                            } else {
                                var postData = {'videoInfo': JSON.stringify(videoInfo)};
                                LMEPG.ajax.postAPI('Player/storeVideoInfo', postData, function (data) {
                                    if (data.result == 0) {
                                        jumpBuyVip(videoInfo);
                                    } else {
                                        LMEPG.UI.showToastV2('系统报错', 3);
                                    }
                                });
                            }
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


function onKeyMoveChange(currBtn, nextBtn, dir) {
    G(nextBtn.id).style.color = fontSelectColor;
}


function onFocusChange(btn, hasFocus) {
    if (hasFocus) {
        LMEPG.UI.Marquee.stop();
        LMEPG.UI.Marquee.start(btn.title, 7, 4, 50, 'left', 'scroll');
    } else {
        LMEPG.UI.Marquee.stop();
    }
}

function onKeyFocusChange(btn, hasFocus) {
    if (hasFocus) {
        G(btn.id).style.color = fontSelectColor;
    }
}

function onBeforeMoveChange(dir, currBtn) {
    switch (currBtn.id) {
        case 'focus-9-1-border':
        case 'focus-9-2-border':
        case 'focus-9-3-border':
            if (dir == 'down') {
                var currentTotal = parseInt(pageCurrent) * 6;
                if (currentTotal >= dataSet.getDataCount()) {
                    return;
                }
                pageDown();
            }
            break;
        case 'focus-8-1-border':
        case 'focus-8-2-border':
        case 'focus-8-3-border':
            if (dir == 'down') {
                //如果焦点位置在第二个详情位置按下键，判断第二行没有数据，跳到第二行上一个焦点
                var x = parseInt(currBtn.id.substring(8, 9));
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
                pageUp();
            }
            break;
        default:
            G(currBtn.id).style.color = fontSelectLoseColor;
            break;
    }
}


function onKeyCenter(btn) {
    var itemId = btn.id;
    var itemIdArr = itemId.split('-');
    var tempIdPrefix = itemIdArr[0];
    var tempRow = parseInt(itemIdArr[1]);
    var tempCol = parseInt(itemIdArr[2]);

    switch (tempRow) {
        case 7:      //点击清空、退格
            pageCurrent = 1;
            page = 1;
            if (tempCol === 1) { //点击清空
                searchClear();
            } else {              //点击退格
                searchBack();
            }
            break;
        case 8:     //点击加载图片的第一排
            clickVideo(btn.indexId);
            break;
        case 9:     //点击加载出来的第二排图片
            clickVideo(btn.indexId);
            break;
        case 10:
            if (tempCol === 1) {
                jumpHome();
            } else if (tempCol === 2) {
                jumpMain();
            } else {
                LMEPG.Intent.back();
            }
            break;
        default:
            pageCurrent = 1;
            page = 1;
            if (tempRow < 7) {    //点击键盘部分
                var currentText = uiSearchTextElement.innerHTML;
                var inputText = btn.word;
                var lastText = '';
                if (currentText == searchTextTips) {
                    lastText = inputText;
                } else {
                    lastText = currentText + inputText;
                }

                uiSearchTextElement.innerHTML = lastText;
                searchVideoByHotWord(lastText);
            }
            break;
    }
}

function jumpHome() {
    LMEPG.Intent.back('IPTVPortal');
}

function jumpMain() {
    var currentPage = LMEPG.Intent.createIntent('');
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, currentPage, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
}


function getInitButton() {
    var buttons = [];
    var InitIDArr = [
        'focus-1-1', 'focus-1-2', 'focus-1-3', 'focus-1-4', 'focus-1-5', 'focus-1-6',
        'focus-2-1', 'focus-2-2', 'focus-2-3', 'focus-2-4', 'focus-2-5', 'focus-2-6',
        'focus-3-1', 'focus-3-2', 'focus-3-3', 'focus-3-4', 'focus-3-5', 'focus-3-6',
        'focus-4-1', 'focus-4-2', 'focus-4-3', 'focus-4-4', 'focus-4-5', 'focus-4-6',
        'focus-5-1', 'focus-5-2', 'focus-5-3', 'focus-5-4', 'focus-5-5', 'focus-5-6',
        'focus-6-1', 'focus-6-2', 'focus-6-3', 'focus-6-4', 'focus-6-5', 'focus-6-6'
    ];
    var KeyMap = [
        'A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '0'
    ];

    for (var index = 0; index < InitIDArr.length; index++) {
        var itemId = InitIDArr[index];
        var itemIdArr = itemId.split('-');
        var tempIdPrefix = itemIdArr[0];
        var tempRow = itemIdArr[1];
        var tempCol = itemIdArr[2];
        var tempWord = KeyMap[index];

        var leftId = getNextFocusLeftId(tempRow, tempCol, tempIdPrefix);
        var rightId = getNextFocusRightId(tempRow, tempCol, tempIdPrefix);
        var topId = getNextFocusTopId(tempRow, tempCol, tempIdPrefix);
        var downId = getNextFocusDownId(tempRow, tempCol, tempIdPrefix);

        var item = {
            id: InitIDArr[index],
            name: itemId,
            type: 'div',
            title: '',
            nextFocusLeft: leftId,
            nextFocusRight: rightId,
            nextFocusUp: topId,
            nextFocusDown: downId,
            focusable: true,
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/defaultbg.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/wordbg.png',
            click: onKeyCenter,
            focusChange: onKeyFocusChange,
            beforeMoveChange: onBeforeMoveChange,
            moveChange: onKeyMoveChange,
            word: tempWord
        };
        buttons.push(item);
    }

    var retButtons = buttons.concat(
        [
            {
                id: 'focus-7-1',
                name: 'focus-7-1',
                type: 'div',
                title: '',
                nextFocusLeft: '',
                nextFocusRight: 'focus-7-2',
                nextFocusUp: 'focus-6-1',
                nextFocusDown: 'focus-10-1',
                focusable: true,
                backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/delbtnfault.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/delbtn.png',
                click: onKeyCenter,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            },
            {
                id: 'focus-7-2',
                name: 'focus-7-2',
                type: 'div',
                title: '',
                nextFocusLeft: 'focus-7-1',
                nextFocusRight: '',
                nextFocusUp: 'focus-6-6',
                nextFocusDown: 'focus-10-1',
                focusable: true,
                backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/backbtnfault.png',
                focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/backbtn.png',
                click: onKeyCenter,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            },
            {
                id: 'focus-10-1',
                name: 'focus-10-1',
                type: 'img',
                title: onKeyCenter,
                nextFocusLeft: '',
                nextFocusRight: 'focus-10-2',
                nextFocusUp: 'focus-7-1',
                nextFocusDown: '',
                focusable: true,
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V4/bg_home_btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V4/f_home_btn.png',
                click: onKeyCenter,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            },
            {
                id: 'focus-10-2',
                name: 'focus-10-2',
                type: 'img',
                title: '',
                nextFocusLeft: 'focus-10-1',
                nextFocusRight: 'focus-10-3',
                nextFocusUp: 'focus-7-1',
                nextFocusDown: '',
                focusable: true,
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V4/bg_main_btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V4/f_main_btn.png',
                click: onKeyCenter,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            },
            {
                id: 'focus-10-3',
                name: '',
                type: 'img',
                title: '',
                nextFocusLeft: 'focus-10-2',
                nextFocusRight: '',
                nextFocusUp: 'focus-7-1',
                nextFocusDown: '',
                focusable: true,
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V4/bg_back_btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V4/f_back_btn.png',
                click: onKeyCenter,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            }, {
            id: 'focus-8-1-border',
            name: '视频1号位',
            type: 'img',
            indexId: 'focus-8-1',
            title: 'focus-8-1-title',
            nextFocusLeft: 'focus-1-6',
            nextFocusRight: 'focus-8-2-border',
            nextFocusUp: '',
            nextFocusDown: '',
            focusable: true,
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/transparent.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/imgbox.png',
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
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/transparent.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/imgbox.png',
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
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/transparent.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/imgbox.png',
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
            nextFocusLeft: 'focus-1-6',
            nextFocusRight: 'focus-9-2-border',
            nextFocusUp: 'focus-8-1-border',
            nextFocusDown: '',
            focusable: true,
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/transparent.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/imgbox.png',
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
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/transparent.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/imgbox.png',
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
            nextFocusDown: onKeyCenter,
            focusable: true,
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/transparent.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Search/V3/imgbox.png',
            click: onKeyCenter,
            focusChange: onFocusChange,
            beforeMoveChange: onBeforeMoveChange,
            moveChange: ''
        }
        ]
    );
    return retButtons;

    function getNextFocusLeftId(tempRow, tempCol, tempIdPrefix) {
        if (tempCol > 1) {
            tempCol--;
        } else {
            tempCol = 6;
        }
        return tempIdPrefix + '-' + tempRow + '-' + tempCol;
    }

    function getNextFocusRightId(tempRow, tempCol, tempIdPrefix) {
        if (tempCol < 6) {
            tempCol++;
        } else {
            return 'focus-8-1-border';
        }
        return tempIdPrefix + '-' + tempRow + '-' + tempCol;
    }

    function getNextFocusTopId(tempRow, tempCol, tempIdPrefix) {
        if (tempRow > 1) {
            tempRow--;
        } else {
            if (tempRow < 4) {
                return 'focus-7-1';
            } else {
                return 'focus-7-2';
            }
        }
        return tempIdPrefix + '-' + tempRow + '-' + tempCol;
    }

    function getNextFocusDownId(tempRow, tempCol, tempIdPrefix) {
        if (tempRow < 6) {
            tempRow++;
        } else {
            if (tempCol < 4) {
                return 'focus-7-1';
            } else {
                return 'focus-7-2';
            }
        }
        return tempIdPrefix + '-' + tempRow + '-' + tempCol;
    }

}
