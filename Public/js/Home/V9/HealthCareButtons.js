/**
 * 页面跳转
 * @type {{}}
 */
var JumpPage = {
    getCurrentPage: function () {
        var current = LMEPG.ButtonManager.getCurrentButton();
        var objCurrent = LMEPG.Intent.createIntent('healthCare');
        objCurrent.setParam('pageIndex', 5);
        objCurrent.setParam('focusIndex', current.id);
        return objCurrent;
    },
    pageLevelThreeTab: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var idx = '';
        if (position == RenderParam.recommendDataList[7].position) {
            idx = btn.subIdx;
        }
        var data = JumpPage.getRecommendDataByPosition(position, idx);
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(position, data.order);
        var objCurrent = JumpPage.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent('MenuTabLevelThree');
        objHomeTab.setParam('userId', RenderParam.userId);
        objHomeTab.setParam('homeTabIndex', RenderParam.classifyId);
        objHomeTab.setParam('currentTabIndex', idx);
        objHomeTab.setParam('modelType', data.source_id);
        objHomeTab.setParam('modelTitle', data.title);
        objHomeTab.setParam('classifyId', RenderParam.classifyId);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    /**
     * 推荐位被点击
     * @param btn
     */
    onRecommendClick: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var idx = '';
        // 第一号推荐位
        if (position == RenderParam.recommendDataList[0].position) {
            idx = G('carousel-wrapper').getElementsByClassName('active')[0].getAttribute('data-Link');
        }

        var data = JumpPage.getRecommendDataByPosition(position, idx);
        // 统计推荐位点击事件
        LMEPG.StatManager.statRecommendEvent(position, data.order);
        switch (data.entryType) {
            case '5':
                // 视频播放
                var videoObj = data.play_url instanceof Object ? data.play_url : JSON.parse(data.play_url);
                var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

                // 创建视频信息
                var videoInfo = {
                    'sourceId': data.source_id,
                    'videoUrl': videoUrl,
                    'title': data.title,
                    'type': data.model_type,
                    'userType': data.user_type,
                    'freeSeconds': data.freeSeconds,
                    'entryType': 1,
                    'entryTypeName': 'home',
                    'focusIdx': btn.id,
                    'unionCode': data.union_code
                };

                if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                    Page.jumpPlayVideo(videoInfo);
                } else {
                    Page.jumpBuyVip(videoInfo.title, videoInfo);
                }
                break;
            case '4':
                // 更多视频
                Page.jumpChannelPage(data.title, data.source_id, '1');
                break;
            case '13':
                // 专辑
                Page.jumpAlbumPage(data.source_id);
                break;
            case '3':
                // 活动
                Page.jumpActivityPage(data.source_id);
                break;
            case '14':
                //预约挂号首页
                Page.jumpGuaHaoPage();
                break;
            case '22':
                // 具体地址跳转
                LMEPG.UI.showToast('具体地址跳转');
                break;
            case '24':
                //预约挂号首页
                Page.jumpnightMedicine();
                break;
            case '10':
                Page.jump39Hospital();
                break;
            case '9':
                Page.jumpInquiry();
                break;
        }
    },

    // 2号推荐位，小窗口视频播放
    onRecommendPollVideoClick: function (btn) {
        var position = btn.cIdx;   // 得到位置类型数据
        var data = JumpPage.getRecommendPollVideoDataByPosition(position);
        if (data == '') {
            LMEPG.UI.showToast('小窗口视频信息有误！', 3);
            return;
        }

        // 创建视频信息
        var videoInfo = {
            'sourceId': data.sourceId,
            'videoUrl': data.videoUrl,
            'title': data.title,
            'type': data.modelType,
            'userType': data.userType,
            'freeSeconds': data.freeSeconds,
            'entryType': 1,
            'entryTypeName': 'home',
            'focusIdx': btn.id,
            'unionCode': data.unionCode
        };

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            Page.jumpPlayVideo(videoInfo);
        } else {
            Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },
    /**
     * 通过推荐位编号得到推荐位数据
     * @param: position 推荐位编号（比如1 号推荐位 --11 ）
     * @param: idx 此推荐位的推荐个数索引，比如一个推荐位有3个内容，引索引为（0，1，2）
     * @param position
     */
    getRecommendDataByPosition: function (position, idx) {
        var tmpData = '';
        var dataList = RenderParam.recommendDataList;
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            if (data.position == position) {
                if (idx != '') {
                    tmpData = data.item_data[idx];
                } else {
                    tmpData = data.item_data[0];
                }
                break;
            }
        }

        // 重新组装数据
        var data = {};
        if (tmpData != '') {
            data.image_url = tmpData.img_url;
            data.entryType = tmpData.entry_type;
            data.order = tmpData.order;

            //解析视频ID
            var paramArr = JSON.parse(tmpData.parameters);
            data.source_id = paramArr[0].param;

            // 解析视频内部参数
            if (tmpData.inner_parameters != '') {
                var innerParams = JSON.parse(tmpData.inner_parameters);
                data.title = innerParams.title;
                data.model_type = innerParams.model_type;
                data.user_type = innerParams.user_type;
                data.play_url = innerParams.ftp_url;
                data.freeSeconds = innerParams.free_seconds;
            }
        }

        return data;
    },

    /**
     * 针对推荐位2 进行数据处理（主要是视频轮播）
     * @param: position 此推荐位的推荐个数索引，比如一个推荐位有3个内容，引索引为（0，1，2）
     */
    getRecommendPollVideoDataByPosition: function (position) {
        var data = Play.getCurrentPollVideoData();
        return data;
    }
};
var buttons = [{
    id: 'search',
    name: '',
    type: 'img',
    nextFocusLeft: 'collection',
    nextFocusRight: 'collection',
    nextFocusUp: '',
    nextFocusDown: 'carousel-link',
    backgroundImage: g_appRootPath + '/Public/img/hd/Menu/Common/search.png',
    focusImage: g_appRootPath + '/Public/img/Common/spacer.gif',
    bgImage: g_appRootPath + '/Public/img/hd/Home/V7/tab0/search_f.png',
    click: Page.jumpSearchPage,
    focusChange: topIconOnFocus,
    beforeMoveChange: '',
    moveChange: '',
    cIdx: ''
}, {
    id: 'collection',
    name: '',
    type: 'img',
    nextFocusLeft: 'search',
    nextFocusRight: 'search',
    nextFocusUp: '',
    nextFocusDown: 'carousel-link',
    backgroundImage: g_appRootPath + '/Public/img/hd/Menu/Common/collection.png',
    focusImage: g_appRootPath + '/Public/img/Common/spacer.gif',
    bgImage: g_appRootPath + '/Public/img/hd/Home/V7/tab0/collection_f.png',
    click: Page.jumpCollectPage,
    focusChange: topIconOnFocus,
    beforeMoveChange: '',
    moveChange: '',
    cIdx: ''
},
    /**
     * 上两个
     * 推荐位2--视频轮播
     * 推荐位1--图片轮播
     */
    {
        id: 'videoTv',
        name: '推荐位2号',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'carousel-link',
        nextFocusUp: 'search',
        nextFocusDown: 'left-link-1',
        click: JumpPage.onRecommendPollVideoClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: '0'
    }, {
        id: 'carousel-link',
        name: '推荐位1号',
        type: 'img',
        nextFocusLeft: 'videoTv',
        nextFocusRight: '',
        nextFocusUp: 'search',
        nextFocusDown: 'right-link-1',
        backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
        focusImage: g_appRootPath + '/Public/img/hd/Menu/Tab5/carousel_f.png',
        click: JumpPage.onRecommendClick,
        focusChange: carouselFocus,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[0].position
    },
    /**
     * 下左四个
     */
    {
        id: 'left-link-1',
        name: '9号推荐位-健康讲堂',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'right-link-1',
        nextFocusUp: 'videoTv',
        nextFocusDown: 'left-link-2',
        click: JumpPage.pageLevelThreeTab,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[7].position,
        subIdx: 0
    }, {
        id: 'left-link-2',
        name: '9号推荐位-医学科普',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'right-link-1',
        nextFocusUp: 'left-link-1',
        nextFocusDown: 'left-link-3',
        click: JumpPage.pageLevelThreeTab,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[7].position,
        subIdx: 1
    }, {
        id: 'left-link-3',
        name: '9号推荐位-医学常识',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'right-link-1',
        nextFocusUp: 'left-link-2',
        nextFocusDown: 'left-link-4',
        click: JumpPage.pageLevelThreeTab,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[7].position,
        subIdx: 2
    }, {
        id: 'left-link-4',
        name: '9号推荐位-健康百科',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'right-link-1',
        nextFocusUp: 'left-link-3',
        nextFocusDown: '',
        click: JumpPage.pageLevelThreeTab,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[7].position,
        subIdx: 3
    },
    /**
     * 下右六个
     */
    {
        id: 'right-link-1',
        name: '推荐位7',
        type: 'img',
        nextFocusLeft: 'left-link-1',
        nextFocusRight: 'right-link-2',
        nextFocusUp: 'carousel-link',
        nextFocusDown: 'right-link-4',
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[5].position
    }, {
        id: 'right-link-2',
        name: '推荐位5',
        type: 'img',
        nextFocusLeft: 'right-link-1',
        nextFocusRight: 'right-link-3',
        nextFocusUp: 'carousel-link',
        nextFocusDown: 'right-link-5',
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[3].position
    }, {
        id: 'right-link-3',
        name: '推荐位3',
        type: 'img',
        nextFocusLeft: 'right-link-2',
        nextFocusRight: 'right-link-4',
        nextFocusUp: 'carousel-link',
        nextFocusDown: 'right-link-6',
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[1].position
    }, {
        id: 'right-link-4',
        name: '推荐位8',
        type: 'img',
        nextFocusLeft: 'left-link-4',
        nextFocusRight: 'right-link-5',
        nextFocusUp: 'right-link-1',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[6].position
    }, {
        id: 'right-link-5',
        name: '推荐位6',
        type: 'img',
        nextFocusLeft: 'right-link-4',
        nextFocusRight: 'right-link-6',
        nextFocusUp: 'right-link-2',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[4].position
    }, {
        id: 'right-link-6',
        name: '推荐位4',
        type: 'img',
        nextFocusLeft: 'right-link-5',
        nextFocusRight: '',
        nextFocusUp: 'right-link-3',
        nextFocusDown: '',
        click: JumpPage.onRecommendClick,
        focusChange: onFocusChangeBg,
        beforeMoveChange: '',
        moveChange: '',
        cIdx: RenderParam.recommendDataList[2].position
    }, {
        id: '',
        name: '',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Menu/Tab5',
        focusImage: g_appRootPath + '/Public/img/hd/Menu/Tab5',
        click: '',
        focusChange: '',
        beforeMoveChange: '',
        moveChange: '',
        cIdx: ''
    }];

function topIconOnFocus(btn, hasFocus) {
    var curObj = document.getElementById(btn.id);
    if (hasFocus) {
        curObj.style.backgroundImage = 'url(' + btn.bgImage + ')';

    } else {
        curObj.style.backgroundImage = 'url(__ROOT__/Public/img/Common/spacer.gif)';
    }
}

/**
 * 轮播获得失去焦点事件
 * @param btn
 * @param hasFocus
 */
function carouselFocus(btn, hasFocus) {
    if (hasFocus) {
        clearInterval(carouselTimer);
    } else {
        clearInterval(carouselTimer);
        carouselTimer = setInterval(renderTab5Page.loop, 2000);
    }
}

/**
 * 推荐位获得失去焦点事件
 * @param btn
 * @param hasFocus
 */
function onFocusChangeBg(btn, hasFocus) {
    if (hasFocus) {
        G(btn.id).className = 'active';
    } else {
        G(btn.id).className = '';
    }
}

function onBack() {
    LMEPG.Intent.back();
}