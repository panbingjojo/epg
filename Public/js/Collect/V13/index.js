var Collect = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',

    /**
     * 页面初始化
     */
    init: function () {
        Collect.initSpecialCode()
        Collect.setBeiJingAreaCode();
        Collect.page = parseInt(RenderParam.page) - 1;
        Collect.navIndex = parseInt(RenderParam.navIndex);
        Collect.keepNavFocusId = 'nav-' + Collect.navIndex;
        if (Collect.navIndex > 1) {
            G('list-wrapper').className = 'person';
        }
        this.createBtns();
        Collect.getCollectList(Collect.navIndex + 1, Collect.onGetCollectListSuccess);
        Collect.tabDif();
    },

    /**
     * 初始化特殊代码
     */
    initSpecialCode: function () {
        // 宁夏广电只保留了“视频集”
        var carrierList = ['500092', '640094', '620092']
        if (carrierList.indexOf(RenderParam.carrierId) >= 0) RenderParam.navIndex = 1;
    },

    /** 当获取数据成功之后的操作 */
    onGetCollectListSuccess: function () {
        console.log("init");
        Collect.render();
        Collect.moveToFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : Collect.keepNavFocusId);

        // 导航栏选中tab背景
        var btn = LMEPG.BM.getButtonById('nav-' + Collect.navIndex);
        G(btn.id).style.backgroundImage = 'url(' + btn.selectedImage + ')';
        // 在此收藏页面，如果用户看视频时把视频取消收藏，焦点恢复时焦点会丢失，需重新判断页数、焦点
        if (!LMEPG.Func.isEmpty(RenderParam.focusId) && LMEPG.BM.getButtonById(RenderParam.focusId) == null) {
            var focusId = RenderParam.focusId;
            var posNum = parseInt(focusId.substr(6));
            if (posNum > 0 && Collect.dataList.length > 0) {
                Collect.moveToFocus('focus-' + (posNum - 1));
            } else if (Collect.page > 0) {
                Collect.prevPage();
                Collect.moveToFocus('focus-' + (Collect.dataList.length - 1));
            } else {
                Collect.moveToFocus('nav-' + Collect.navIndex);
            }
        }
    },

    /**
     * 特殊地区去掉特殊模块
     */
    tabDif: function () {
        Collect.tabDifNav1()
        Collect.tabDifNav2()
        Collect.tabDifNav3()
    },

    /**
     * 去除视频集
     */
    tabDifNav1: function () {
        var areaList = ["630001","320005"]
        if (areaList.indexOf(RenderParam.carrierId) >= 0) delNode("nav-1");
    },

    /**
     *  去除医生
     */
    tabDifNav2: function () {
        var areaList = ["420092","320005"]
        if (areaList.indexOf(RenderParam.carrierId) >= 0) delNode("nav-2");
    },

    /**
     * 去除专家
     */
    tabDifNav3: function () {
        var areaList = ["420092","640092","320005"]
        if (areaList.indexOf(RenderParam.carrierId) >= 0) delNode("nav-3");
    },

    /**
     *
     */
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
    // 网络获取的数据列表
    dataList: [],
    render: function () {
        var count = this.navIndex > 1 ? 5 : 8;
        this.maxPage = Math.floor((this.dataList.length - 1) / count);
        var page = this.page * count;
        var maxPage = this.maxPage;
        this.currentData = this.dataList.slice(page, page + count);
        var htm = '';
        var isNullData = this.isNullData();
        if (isNullData) {
            maxPage = 1;
        } else {
            console.log(this.currentData)
            this.currentData.forEach(function (t, i) {
                // 收藏按钮图片
                if (t.collectStatus == 1 || t.collectStatus == undefined) {
                    var collectStatusImg = g_appRootPath + '/Public/img/hd/Collect/V13/uncollect.png';
                } else {
                    var collectStatusImg = g_appRootPath + '/Public/img/hd/Collect/V13/collect.png';
                }

                // 视频、视频集、医生、专家图片
                if (Collect.navIndex == 2) {
                    var image = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, t.doctor_id, t.doctor_avatar, RenderParam.carrierId);
                } else if (Collect.navIndex == 3) {
                    var image = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cws39HospitalUrl, t.doctor_user_id, t.doctor_avatar, RenderParam.carrierId);
                } else {
                    var image = RenderParam.fsUrl + t.image_url;
                }

                htm += '<li id=focus-' + i + ' pos=' + (i + page) + '>' +
                    '<img onerror="this.src=' + g_appRootPath + '\'/Public/img/Common/default.png\'" src=' + image + '>' +
                    '<img  class="uncollect" id="uncollect-' + i + '" src=' + collectStatusImg + ' pos=' + (i + page) + '>';
                if (Collect.navIndex == 1) {
                    htm += '<p>' + t.content_cnt + '全集</p>';
                }
                if (RenderParam.carrierId === '620007') {
                    htm += '<div class="g-title" id="g-title-' + i + '">' + t.title + '</div>'
                }

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

    /**
     *
     * @param key
     * @param btn
     * @returns {boolean}
     */
    onMoveChangeKeepNavFocus: function (key, btn) {
        var _this = Collect;
        // 如果当前tab下无数据，则禁止焦点向下
        if (Collect.dataList.length == 0 && key == 'down') {
            return false;
        }

        var _this = Collect;
        if (key == 'down') {
            _this.isLeaveNav = true;
            _this.keepNavFocusId = btn.id;
        }

        if (RenderParam.carrierId === '630001') {
            if (btn.id === 'nav-0' && key === 'right') {
                LMEPG.ButtonManager.requestFocus('nav-2');
                return false;
            }

            if (btn.id === 'nav-2' && key === 'left') {
                LMEPG.ButtonManager.requestFocus('nav-0');
                return false;
            }
        }
    },

    /**
     * 上一页
     * @param btn
     */
    prevPage: function (btn) {
        this.page--;
        this.render();
    },

    /**
     * 下一页
     * @param btn
     */
    nextPage: function (btn) {
        this.page++;
        this.render();
    },

    /**
     * 焦点上移
     * @param btn
     */
    focusUp: function (btn) {
        var indexID = btn.id.slice(btn.id.length - 1);
        if (indexID < 4 && btn.id.substr(0, 5) == 'focus') {
            this.moveToFocus(this.keepNavFocusId);
            return false;
        }
    },
    /**
     * 焦点右移
     * @param btn
     */
    focusRight: function (btn) {
        if (this.page == this.maxPage) {
            return;
        }
        var turnNextCondition = {
            video: this.navIndex < 2 && (btn.id == 'focus-3' || btn.id == 'focus-7' || btn.id == 'uncollect-3' || btn.id == 'uncollect-7'),// 视频、视频集
            person: this.navIndex > 1 && (btn.id == 'focus-4' || btn.id == 'uncollect-4')// 医生、专家列表翻页
        };
        if (turnNextCondition.video || turnNextCondition.person) {
            this.nextPage(btn);
            this.moveToFocus('focus-0');
            return false;
        }
    },
    /**
     * 焦点左移
     * @param btn
     */
    focusLeft: function (btn) {
        if (this.page == 0) {
            return;
        }
        var turnPrevCondition = {
            video: this.navIndex < 2 && (btn.id == 'focus-0' || btn.id == 'focus-4' || btn.id == 'uncollect-0' || btn.id == 'uncollect-4'),
            person: this.navIndex > 1 && (btn.id == 'focus-0' || btn.id == 'uncollect-0')
        };
        if (turnPrevCondition.video || turnPrevCondition.person) {
            this.prevPage(btn);
            var moveToId = this.navIndex > 1 ? 'focus-4' : 'focus-7';
            this.moveToFocus(moveToId);
            return false;
        }
    },
    /**
     * 焦点下移
     * @param btn
     */
    focusDown: function (btn) {
        // 视频或视频集，在最后一页，焦点在第一行收藏按钮上，焦点下面却没有按钮，则焦点移动到第二行最后一个
        if (parseInt(btn.id.substr(10)) <= 3 && Collect.navIndex < 2 && Collect.page == Collect.maxPage) {
            if (LMEPG.Func.isEmpty(LMEPG.BM.getButtonById(LMEPG.BM.getNextFocusDownId(btn.id)))) {
                LMEPG.BM.requestFocus('focus-' + (Collect.dataList.length % 8 - 1));
                return false;
            }
        }
    },

    /**
     * 焦点移动
     * @param key
     * @param btn
     * @returns {boolean}
     */
    onMoveChangeFocusId: function (key, btn) {
        var _this = Collect
        switch (key) {
            // 移动到焦点保持的导航条上
            case 'up' :
                _this.focusUp(btn)
                break;
            // 向右翻页
            case 'right':
                _this.focusRight(btn)
                break;
            case 'left':
                _this.focusLeft(btn)
                break;
            case 'down':
                _this.focusDown(btn)
                break;
        }
    },

    /**
     * 导航获得焦点渲染视频列表
     * @param btn
     * @param hasFocus
     */
    onFocusChangeVideoList: function (btn, hasFocus) {
        var _this = Collect;
        if (hasFocus) {
            console.log(LMEPG.BM.getPreviousButton());
            // 焦点从列表跳到tab，tab获取焦点，但是不获取数据
            var previousBtn = LMEPG.BM.getPreviousButton();
            if (!LMEPG.Func.isEmpty(previousBtn) && previousBtn.id.substr(0, 5) == 'focus') {
                _this.isLeaveNav = false;
                return;
            }

            // 获取收藏列表
            var itemType = parseInt(btn.id.slice(btn.id.length - 1)) + 1;
            Collect.getCollectList(itemType, function () {
                console.log("focus");
                _this.page = 0;
                _this.navIndex = btn.id.slice(btn.id.length - 1);
                _this.render();
                _this.isLeaveNav = false;
                if (_this.navIndex > 1 && Collect.dataList.length > 0) {
                    G('list-wrapper').className = 'person';
                } else {
                    G('list-wrapper').className = '';
                }
            });
        } else {
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
        var index = btn.id.substr(6)
        console.log(index)
        if (hasFocus && RenderParam.carrierId === '620007') {
            LMEPG.UI.Marquee.start('g-title-' + index, 11)
        } else {
            LMEPG.UI.Marquee.stop()
        }

        if (hasFocus && Collect.navIndex > 1) {
            btnElement.style.backgroundImage = 'url(' + (RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/doctor_f.png' : g_appRootPath + '/Public/img/hd/Collect/V13/radius_f.png') + ')';
        } else {
            //	默认
        }

    },

    /**
     * 创建导航按钮
     */
    createBtnsNav: function () {
        var NAV_COUNT = 4;
        while (NAV_COUNT--) {
            this.buttons.push({
                id: 'nav-' + NAV_COUNT,
                name: '导航',
                type: 'div',
                nextFocusLeft: 'nav-' + (NAV_COUNT - 1),
                nextFocusRight: 'nav-' + (NAV_COUNT + 1),
                nextFocusDown: 'focus-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/nav_f.png' : g_appRootPath + '/Public/img/hd/Collect/V13/nav_f.png',
                selectedImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/nav_s.png' : g_appRootPath + '/Public/img/hd/Collect/V13/nav_s.png',
                beforeMoveChange: this.onMoveChangeKeepNavFocus,
                focusChange: this.onFocusChangeVideoList
            });
        }
    },

    /**
     * 创建视频按钮
     */
    createBtnsVideo: function () {
        var VIDEO_COUNT = 8;
        while (VIDEO_COUNT--) {
            this.buttons.push({
                id: 'focus-' + VIDEO_COUNT,
                name: '视频',
                type: 'div',
                nextFocusLeft: 'focus-' + (VIDEO_COUNT - 1),
                nextFocusRight: 'focus-' + (VIDEO_COUNT + 1),
                nextFocusUp: VIDEO_COUNT < 4 ? 'nav-0' : 'uncollect-' + (VIDEO_COUNT - 4),
                nextFocusDown: 'uncollect-' + VIDEO_COUNT,
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/video_list_f.png' : g_appRootPath + '/Public/img/hd/Collect/V13/video_list_f.png',
                click: Collect.onClickImg,
                beforeMoveChange: this.onMoveChangeFocusId,
                focusChange: this.onFocusChangeBgImg
            }, {
                id: 'uncollect-' + VIDEO_COUNT,
                name: '收藏',
                type: 'img',
                nextFocusDown: 'focus-' + (VIDEO_COUNT + 4),
                nextFocusUp: 'focus-' + VIDEO_COUNT,
                nextFocusLeft: 'uncollect-' + (VIDEO_COUNT - 1),
                nextFocusRight: 'uncollect-' + (VIDEO_COUNT + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Collect/V13/uncollect.png',
                focusImage: g_appRootPath + '/Public/img/hd/Collect/V13/uncollect_f.png',
                click: Collect.onClickCollect,
                beforeMoveChange: this.onMoveChangeFocusId
            });
        }
    },

    /**
     * 创建空按钮
     */
    createBtnsEmtry: function () {
        this.buttons.push({
            id: '',
            name: '',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: '',
            beforeMoveChange: ''
        });
    },
    /**
     * 创建按钮
     */
    createBtns: function () {
        this.createBtnsNav();
        this.createBtnsVideo();
        this.createBtnsEmtry()
        this.initButtons(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : this.keepNavFocusId);
        if (RenderParam.platformType == 'sd') LMEPG.BM.getButtonById('nav-3').focusable = false; // 设置标清专家按钮不可用
    },

    /**
     * 初始化按钮
     * @param id
     */
    initButtons: function (id) {
        LMEPG.ButtonManager.init(id, this.buttons, '', true);
    },

    /**
     * 移动焦点
     * @param id
     */
    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    /**
     * 创建视频信息
     * @param videoData
     * @param videoUrl
     * @param btn
     * @returns {{sourceId, entryType: number, unionCode: (string|*), videoUrl, focusIdx, userType, entryTypeName: string, title, type, freeSeconds: (string|*), show_status}}
     */
    buildVideoInfo: function (videoData, videoUrl, btn) {
        return {
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
    },

    /**
     * 是否允许播放视频
     * @param videoInfo
     * @returns {boolean}
     */
    videoIsAllowAccess: function (videoInfo) {
        return LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)
    },
    /**
     * 点击视频类型
     */
    onClickVideoType: function (pos, btn) {
        var videoData = Collect.dataList[pos];
        var play_url = videoData.ftp_url;
        var videoObj = play_url instanceof Object ? play_url : JSON.parse(play_url);
        var videoUrl = RenderParam.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;
        var videoInfo = this.buildVideoInfo(videoData, videoUrl, btn);

        //视频专辑下线处理
        if (videoInfo.show_status == "3") {
            LMEPG.UI.showToast('该节目已下线');
            return;
        }
        this.videoIsAllowAccess(videoInfo) ? PageJump.jumpPlayVideo(videoInfo) : PageJump.jumpBuyVip(videoInfo.title, videoInfo);
    },

    /**
     * 点击列表图片，根据图片表示的类型，跳转到不同页面
     */
    onClickImg: function (btn) {
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        if (Collect.navIndex == 0) {                // 点击视频
            Collect.onClickVideoType(pos, btn)
        } else if (Collect.navIndex == 1) {         // 点击视频集
            PageJump.jumpVideoSet(btn);
        } else if (Collect.navIndex == 2) {         // 跳转医生页面
            PageJump.jumpDoctorPage(btn);
        } else {                                    // 跳转专家页面
            PageJump.jumpExpertPage(btn);
        }
    },

    /**
     * 点击收藏按钮
     * @param btn
     */
    onClickCollect: function (btn) {
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        if (Collect.dataList[pos].collectStatus == undefined || Collect.dataList[pos].collectStatus == 1) {
            var type = 1;
        } else {
            var type = 0;
        }
        var itemType = parseInt(Collect.navIndex) + 1;
        // 不同种类的收藏，id不一样
        if (Collect.navIndex == 0) {
            var itemId = Collect.dataList[pos].source_id;
        } else if (Collect.navIndex == 1) {
            var itemId = Collect.dataList[pos].subject_id;
        } else if (Collect.navIndex == 2) {
            var itemId = Collect.dataList[pos].doctor_id;
        } else {
            var itemId = Collect.dataList[pos].doctor_user_id;
        }
        Collect.setCollectStatus(type, itemType, itemId, pos, btn.id);
    },

    /**
     * 获取收藏列表
     * @param itemType
     */
    getCollectList: function (itemType, callback) {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            'item_type': itemType // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
        };
        LMEPG.ajax.postAPI('Collect/getCollectListNew', postData, function (rsp) {
            var collectData = rsp instanceof Object ? rsp : JSON.parse(rsp);
            console.log(itemType);
            console.log(collectData);
            if (collectData.result == 0) {
                Collect.dataList = collectData.list;
                callback();
            } else {
                LMEPG.UI.showToast('数据获取失败！');
            }

            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 设置收藏状态成功
     */
    collectSuccess: function (postData, btnId, index) {
        G(btnId).src = g_appRootPath + '/Public/img/hd/Collect/V13/uncollect_f.png';
        Collect.dataList[index].collectStatus = 1;
        // 更新按钮的图片
        for (var i = 0; i < Collect.buttons.length; i++) {
            if (Collect.buttons[i].id == btnId) {
                Collect.buttons[i].backgroundImage = g_appRootPath + '/Public/img/hd/Collect/V13/uncollect.png';
                Collect.buttons[i].focusImage = g_appRootPath + '/Public/img/hd/Collect/V13/uncollect_f.png';
                break;
            }
        }
    },

    /**
     * 取消搜藏状态成功
     * @param postData
     * @param btnId
     */
    clearCollectSuccess: function (postData, btnId, index) {
        //取消收藏成功
        var isHideData = RenderParam.carrierId == '220001';
        if (isHideData) {// 吉林移动需要隐藏数据
            Collect.getCollectList(parseInt(Collect.navIndex) + 1, Collect.onGetCollectListSuccess);
        } else {
            G(btnId).src = g_appRootPath + '/Public/img/hd/Collect/V13/collect_f.png';
            Collect.dataList[index].collectStatus = 0;
            // 更新按钮的图片
            for (var i = 0; i < Collect.buttons.length; i++) {
                if (Collect.buttons[i].id == btnId) {
                    Collect.buttons[i].backgroundImage = g_appRootPath + '/Public/img/hd/Collect/V13/collect.png';
                    Collect.buttons[i].focusImage = g_appRootPath + '/Public/img/hd/Collect/V13/collect_f.png';
                    break;
                }
            }
        }
    },

    /**
     * 设置收藏状态请求后的操作
     * @param postData
     * @param btnId
     */
    setCollectStatusAfter: function (postData, btnId, index) {
        postData.type == 0 ? this.collectSuccess(postData, btnId, index) : this.clearCollectSuccess(postData, btnId, index)
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
        var _this = this;
        var postData = {
            'type': type, // 类型（0收藏 1取消收藏）
            'item_type': itemType, // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
            'item_id': itemId // 收藏对象id
        };
        LMEPG.ajax.postAPI('Collect/setCollectStatusNew', postData, function (rsp) {
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                collectItem.result == 0 ? _this.setCollectStatusAfter(postData, btnId, index) : LMEPG.UI.showToast('操作失败');
            } catch (e) {
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
        currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
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

/**
 * 页面返回
 */
var onBack = function () {
    LMEPG.Intent.back();
};