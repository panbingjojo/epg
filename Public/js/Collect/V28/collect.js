var Collect = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',
    modelDif: ["420092", "410092"],
    init: function () {
        
        // 江苏电信、宁夏广电只保留了“视频集”
        if (RenderParam.carrierId == '320092'
            || RenderParam.carrierId == '500092'
            || RenderParam.carrierId == '640094'
            || RenderParam.carrierId == '620092') {
            RenderParam.navIndex = 1;
        }

        Collect.page = parseInt(RenderParam.page) - 1;
        Collect.navIndex = parseInt(RenderParam.navIndex);
        Collect.keepNavFocusId = 'focus-0';
        if (Collect.navIndex > 1) {
            G('list-wrapper').className = 'person';
        }

        this.createBtns();
        var that = this
        Collect.getCollectList(Collect.navIndex + 1, function () {
            console.log("init");
            Collect.render();
            Collect.moveToFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : that.keepNavFocusId);

            // 导航栏选中tab背景
            var btn = LMEPG.BM.getButtonById('nav-' + Collect.navIndex);
            //G(btn.id).style.backgroundImage = 'url(' + btn.selectedImage + ')';

            // 在此收藏页面，如果用户看视频时把视频取消收藏，焦点恢复时焦点会丢失，需重新判断页数、焦点
            if (!LMEPG.Func.isEmpty(RenderParam.focusId) && LMEPG.BM.getButtonById(RenderParam.focusId) == null) {
                var focusId = RenderParam.focusId;
                var posNum = parseInt(focusId.substr(6));
                if (posNum > 0) {
                    Collect.moveToFocus('focus-' + (posNum - 1));
                } else {
                    if (Collect.page > 0) {
                        Collect.prevPage();
                        Collect.moveToFocus('focus-5');
                    } else {
                        Collect.moveToFocus('nav-' + Collect.navIndex);
                    }
                }
            }
        });
    },

    // 导航索引
    navIndex: 0,
    // 当前页面数据，一页的数据
    currentData: [],
    // 网络获取的数据列表
    dataList: [],
    render: function () {
        var count = this.navIndex > 1 ? 6 : 6;
        this.maxPage = Math.floor((this.dataList.length - 1) / count);
        // if (this.maxPage < parseInt(RenderParam.page)) {
        //     this.page - 2;
        // }
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
                    var collectStatusImg = '/Public/img/hd/Home/V22/Collect/collect.png';
                    var btn = LMEPG.BM.getButtonById('uncollect-'+i)
                    if(btn){
                        btn.backgroundImage = '/Public/img/hd/Home/V22/Collect/collect.png'
                        btn.focusImage= '/Public/img/hd/Home/V22/Collect/collect_f.png'
                    }
                } else {
                    var collectStatusImg = '/Public/img/hd/Home/V22/Collect/uncollect.png';
                    var btn = LMEPG.BM.getButtonById('uncollect-'+i)

                    if(btn){
                        btn.backgroundImage = '/Public/img/hd/Home/V22/Collect/uncollect.png';
                        btn.focusImage = '/Public/img/hd/Home/V22/Collect/uncollect_f.png'
                    }

                }

                // 视频、视频集、医生、专家图片
                if (Collect.navIndex == 2) {
                    var image = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, t.doctor_id, t.doctor_avatar, RenderParam.carrierId);
                } else if (Collect.navIndex == 3) {
                    var image = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cws39HospitalUrl, t.doctor_user_id, t.doctor_avatar, RenderParam.carrierId);
                } else {
                    var image = RenderParam.fsUrl + t.image_url;
                }

                htm += '<li id=focus-' + i + ' pos=' + (i + page) + ' class="video">' +
                    '<img  onerror="this.src=\'/Public/img/Common/default.png\'" src=' + image + '>' +
                    '<img  class="uncollect" id="uncollect-' + i + '" src=' + collectStatusImg + ' pos=' + (i + page) + '>';
                if (Collect.navIndex == 1) {
                    htm += '<p>' + t.content_cnt + '全集</p>';
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
    keepNavFocusId: 'focus-0',
    onMoveChangeKeepNavFocus: function (key, btn) {
        // 如果当前tab下无数据，则禁止焦点向下
        if (Collect.dataList.length == 0 && key == 'right') {
            return false;
        }
        var _this = Collect;
        if (key == 'left' || key == 'right') {
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
        switch (key) {
            // 移动到焦点保持的导航条上
            case 'up' :
                // if (indexID < 3 && btn.id.substr(0, 5) == 'focus') {
                //     _this.moveToFocus(_this.keepNavFocusId);
                //     return false;
                // }
                break;
            // 向右翻页
            case 'right':
                if (_this.page == _this.maxPage) {
                    return;
                }
                var turnNextCondition = {
                    video: _this.navIndex < 2 && (btn.id == 'focus-2' || btn.id == 'focus-5' || btn.id == 'uncollect-2' || btn.id == 'uncollect-5'),// 视频、视频集
                };
                if (turnNextCondition.video) {
                    _this.nextPage(btn);
                    _this.moveToFocus('focus-0');
                    return false;
                }
                break;
            case 'left':
                console.log(btn.id, _this.page);
                if (_this.page == 0) {
                    if (btn.id == 'focus-0' || btn.id == 'uncollect-0') {
                        _this.moveToFocus(_this.keepNavFocusId);
                    }
                    return
                }
                var turnPrevCondition = {
                    video: _this.navIndex < 2 && (btn.id == 'focus-0' || btn.id == 'focus-3' || btn.id == 'uncollect-0' || btn.id == 'uncollect-3'),
                };
                if (turnPrevCondition.video) {
                    _this.prevPage(btn);
                    var moveToId = _this.navIndex > 1 ? 'focus-2' : 'focus-5';
                    _this.moveToFocus(moveToId);
                    return false;
                }
                break;
            case 'down':
                // 视频或视频集，在最后一页，焦点在第一行收藏按钮上，焦点下面却没有按钮，则焦点移动到第二行最后一个
                if (parseInt(btn.id.substr(10)) <= 3 && Collect.navIndex < 2 && Collect.page == Collect.maxPage) {
                    if (LMEPG.Func.isEmpty(LMEPG.BM.getButtonById(LMEPG.BM.getNextFocusDownId(btn.id)))) {
                        LMEPG.BM.requestFocus('focus-' + (Collect.dataList.length % 6 - 1));
                        return false;
                    }
                }
                break;
        }
    },
    /*导航获得焦点渲染视频列表*/
    onFocusChangeVideoList: function (btn, hasFocus) {
        var _this = Collect;
        if (hasFocus) {
            // LMEPG.BM.setSelected(btn.id, true)
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
                G(btn.id).style.src = btn.selectedImage2;
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
        if (hasFocus) {
            // alert("Ddd")
            btnElement.setAttribute('class', 'focus');
            // btnElement.style.backgroundImage = 'url(' + (RenderParam.platformType == 'sd' ? '/Public/img/sd/Unclassified/V13/doctor_f.png' : '/Public/img/hd/Collect/V13/radius_f.png') + ')';
        } else {
            btnElement.setAttribute('class', 'video');
            //	默认
        }
    },
    createBtns: function () {
        var NAV_COUNT = 2;
        while (NAV_COUNT--) {
            this.buttons.push({
                id: 'nav-' + NAV_COUNT,
                name: '导航',
                type: 'img',
                nextFocusUp: 'nav-' + (NAV_COUNT - 1),
                nextFocusDown: 'nav-' + (NAV_COUNT + 1),
                nextFocusRight: 'focus-0',
                backgroundImage: '/Public/img/hd/Home/V22/Collect/nav_' + (NAV_COUNT + 1) + '.png',
                focusImage: '/Public/img/hd/Home/V22/Collect/nav_' + (NAV_COUNT + 1) + '_f.png',
                selectedImage2: '/Public/img/hd/Home/V22/Collect/nav_' + (NAV_COUNT + 1) + '_select.png',
                beforeMoveChange: this.onMoveChangeKeepNavFocus,
                focusChange: this.onFocusChangeVideoList
            });
        }
        var VIDEO_COUNT = 6;
        while (VIDEO_COUNT--) {
            this.buttons.push({
                id: 'focus-' + VIDEO_COUNT,
                name: '视频',
                type: 'div',
                nextFocusLeft: 'focus-' + (VIDEO_COUNT - 1),
                nextFocusRight: 'focus-' + (VIDEO_COUNT + 1),
                nextFocusUp: 'uncollect-' + (VIDEO_COUNT - 3),
                nextFocusDown: 'uncollect-' + VIDEO_COUNT,
                // backgroundImage: '/Public/img/hd/Common/transparent.png',
                // focusImage: RenderParam.platformType == 'sd' ? '/Public/img/sd/Unclassified/V13/video_list_f.png' : '/Public/img/hd/Collect/V13/video_list_f.png',
                click: Collect.onClickImg,
                beforeMoveChange: this.onMoveChangeFocusId,
                focusChange: this.onFocusChangeBgImg
            }, {
                id: 'uncollect-' + VIDEO_COUNT,
                name: '收藏',
                type: 'img',
                nextFocusDown: 'focus-' + (VIDEO_COUNT + 3),
                nextFocusUp: 'focus-' + VIDEO_COUNT,
                nextFocusLeft: 'uncollect-' + (VIDEO_COUNT - 1),
                nextFocusRight: 'uncollect-' + (VIDEO_COUNT + 1),
                backgroundImage: '/Public/img/hd/Home/V22/Collect/collect.png',
                focusImage: '/Public/img/hd/Home/V22/Collect/collect_f.png',
                click: Collect.onClickCollect,
                beforeMoveChange: this.onMoveChangeFocusId
            });
        }
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
        this.initButtons(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : this.keepNavFocusId);
    },
    initButtons: function (id) {
        LMEPG.ButtonManager.init(id, this.buttons, '', true);
    },

    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    /**
     * 点击列表图片
     */
    onClickImg: function (btn) {
        var pos = parseInt(G(btn.id).getAttribute('pos'));
        // 点击视频
        if (Collect.navIndex == 0) {
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
        else if (Collect.navIndex == 1) {
            PageJump.jumpVideoSet(btn);
        }
        // 跳转医生页面
        else if (Collect.navIndex == 2) {
            PageJump.jumpDoctorPage(btn);
        }
        // 跳转专家页面
        else {
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
        LMEPG.ajax.postAPI('Collect/setCollectStatusNew', postData, function (rsp) {
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(collectItem);
                if (collectItem.result == 0) {
                    if (postData.type == 0) {
                        //收藏成功
                        G(btnId).src = '/Public/img/hd/Home/V22/Collect/collect_f.png';
                        Collect.dataList[index].collectStatus = 1;
                        // 更新按钮的图片
                        for (var i = 0; i < Collect.buttons.length; i++) {
                            if (Collect.buttons[i].id == btnId) {
                                Collect.buttons[i].backgroundImage = '/Public/img/hd/Home/V22/Collect/collect.png';
                                Collect.buttons[i].focusImage = '/Public/img/hd/Home/V22/Collect/collect_f.png';
                                break;
                            }
                        }
                    } else {
                        //取消收藏成功
                        G(btnId).src = '/Public/img/hd/Home/V22/Collect/uncollect_f.png';
                        Collect.dataList[index].collectStatus = 0;
                        // 更新按钮的图片
                        for (var i = 0; i < Collect.buttons.length; i++) {
                            if (Collect.buttons[i].id == btnId) {
                                Collect.buttons[i].backgroundImage = '/Public/img/hd/Home/V22/Collect/uncollect.png';
                                Collect.buttons[i].focusImage = '/Public/img/hd/Home/V22/Collect/uncollect_f.png';
                                break;
                            }
                        }
                    }
                } else {
                    LMEPG.UI.showToast('操作失败');
                }
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

var onBack = function () {
    LMEPG.Intent.back();
};