/**
 * 三级视频列表
 */
var Level3 = {
	COUNT: 7, // 导航栏单页个数常量
	MAX_COUNT: 56, // 单页导航条总数常量
	NUM: 8, // 单页视频列表的个数常量
	listPage: 0,
	tabPage: 0,
	tabMaxPage: 0,
	isLeaveTab: false,
	keepFocusId: 'tab-0', // 焦点保持变量
	currentTabIndex: 0, // 当前导航条索引
	tabData: [],
	buttons: [],
	block:true,
	init: function () {
		// 数据和焦点保持
		this.tabPage = parseInt(RenderParam.tabPage);
		this.keepFocusId = RenderParam.keepFocusId;
		this.listPage = +RenderParam.keepFocusId.slice(-1) + parseInt(this.tabPage) * this.COUNT;
		this.initTopData();
		this.tabArray();
		this.renderTab();
		this.createBtns();
		this.renderList();
		this.updateCollectBtnUI();

		//this.startPlay();
		//this.diffCarrierId();
		this.block = false
		RenderParam.focusId && LMEPG.BM.requestFocus(RenderParam.focusId);
		RenderParam.focusId && this.bg(Level3.keepFocusId, g_appRootPath+ '/Public/img/hd/Channel/V25/num-has-choose.png');
		if(!RenderParam.focusId){
			G('tab-0').style.color = '#662200'
		}
	},

	/**
	 * 地区差异化
	 */
	diffCarrierId:function () {
		// 辽宁电信EPG焦点，首次进入默认在第一个视频上，隐藏集数和收藏按钮，左侧小窗替换为图片
		if (LMEPG.BM.getCurrentButton().id == 'full-screen' && RenderParam.carrierId == '210092') {
			LMEPG.BM.requestFocus('focus-0');
			G('desc-icon').innerHTML = "";
			G('cover-img').src = RenderParam.fsUrl + RenderParam.detail.data.subject_list[0].image_url;
		}
	},

	bg: function (id, val) {
		var element = G(id);
		if (element)
			element.style.backgroundImage = "url(" + val + ")";
	},

	startPlay: function () {

		if (this.videoList.length > 0) {
			// 播放小窗视频
			setTimeout(function () {
				Play.init();
				Play.startPollPlay(Play.lastedPlaySecond);
			}, 1000);
		}
		// 无数据调整UI提示效果
		else {
			Hide("container");
			Show("null-data-000051");
		}
	},

	/**
	 * 处理视频数据
	 * 8个一组包装
	 */
	tabArray: function () {
		for (var i = 0; i < this.videoList.length / this.NUM; i++) {
			var tempArr = [];
			for (var j = 0; j < this.NUM; j++) {
				tempArr.push(this.videoList[i * this.NUM + j]);
			}
			this.tabData[i] = tempArr;
		}

		this.tabMaxPage = Math.ceil((this.tabData.length) / this.COUNT);
	},

	/**
	 * 渲染视频集导航
	 */
	renderTab: function () {
		var htm = '';
		var count = this.tabPage * this.COUNT;
		this.currentPageData = this.tabData.slice(count, count + this.COUNT);
		var len = this.currentPageData.length;
		for (var i = 0; i < len; i++) {
			var start = i * this.NUM + this.tabPage * this.MAX_COUNT;
			// 最后一个tab特殊显示，集数根据实际情况显示
			if (Level3.tabPage == Level3.tabMaxPage - 1 && i == len - 1) {
				// 最后一页的视频个数
				var lastTabVideoCount = Level3.videoList.length % this.NUM;
				if (lastTabVideoCount == 0)
					lastTabVideoCount = this.NUM;
				if (lastTabVideoCount == 1)
					htm += '<li id=tab-' + i + '>' + (start + 1) + '</li>';
				else
					htm += '<li id=tab-' + i + '>' + (start + 1) + '-' + (start + lastTabVideoCount) + '</li>';
			} else {
				htm += '<li id=tab-' + i + '>' + (start + 1) + '-' + (start + 8) + '</li>';
			}
		}

		G('tab-wrap').innerHTML = htm;
		Level3.toggleNavArrow();
	},

	/**
	 * 导航条移动操作
	 * 左翻上一页、右翻下一页
	 * 上、下记录焦点保持且标记焦点离开导航条
	 * @param key
	 * @param btn
	 * @returns {boolean}
	 */
	onBeforeMoveTurnTab: function (key, btn) {
		var me = Level3;
		if (key == 'left' && btn.id == 'tab-0' && me.tabPage > 0) {
			me.tabPrev();
			return false;
		}
		if (key == 'right' && btn.id == 'tab-6' && me.tabPage < me.tabMaxPage - 1) {
			me.tabNext();
			return false;
		}

		if (key === "up" || key === "down") {
			me.isLeaveTab = true;
		}
		me.keepFocusId = btn.id;
	},

	// 上一个导航页
	tabPrev: function () {
		this.tabPage--;
		this.renderTab();
		LMEPG.BM.requestFocus('tab-6');
	},

	// 下一个导航页
	tabNext: function () {
		this.tabPage++;
		this.renderTab();
		LMEPG.BM.requestFocus('tab-0');
	},

	/**
	 * tab导航条得失焦点
	 */
	onFocusRenderVideoList: function (btn, hasFocus) {
		var me = Level3;
		var btnId = G(btn.id)

		if(Level3.block) return

		if (hasFocus) {
			// 标记当前tab索引
			me.currentTabIndex = +btn.id.substr(-1);
			console.log(me.currentTabIndex,'me',btn.id)
			me.listPage = me.currentTabIndex + parseInt(me.tabPage) * me.COUNT;
			me.renderList();
			me.isLeaveTab = false;

			btnId.style.color = '#662200'
		} else {
			console.log(777)
			btnId.style.color = '#fff'
			if (me.isLeaveTab) {
				G(btn.id).style.backgroundImage = 'url(' + btn.selectedImage + ')';
			}
		}
	},

	/**
	 * 渲染视频列表
	 */
	renderList: function () {
		// 当前tab上下焦点移动不再重复渲染视频列表
		var htm = '';
		var data = Level3.videoList;
		var count = Level3.listPage * 8;
		var currentData = data.slice(count, count + 8);
		console.log(Level3.listPage,'hell0')
		currentData.forEach(function (t, i) {
			htm += '<div id="focus-' + i + '" data-link=' + t.id + '>' +
				'<img onerror=this.src="' + g_appRootPath+ '/Public/img/Common/default.png" src=' + RenderParam.fsUrl + t.image_url + '>' +
				'<p class="video-number">第' + (data.indexOf(t) + 1) + '集</p>' +
				'</div>';
		});

		G('content-wrap').innerHTML = htm;
		this.initListFocusBtn(currentData);
		this.toggleListArrow();
	},

	/**
	 * 初始化视频列表按钮
	 */
	initListFocusBtn: function (pageData) {
		// 视频列表
		var listLen = this.NUM;
		// var sdImg = g_appRootPath+ '/Public/img/sd/Unclassified/V16/video_list1_f.png';
		var sdImg =g_appRootPath+  '/Public/img/hd/Channel/V16/video_list_f.png';
		var hdImg = g_appRootPath+ '/Public/img/hd/Home/V25/recommend-bg-2.png';
		while (listLen--) {
			this.buttons.push({
				id: 'focus-' + listLen,
				name: '',
				type: 'div',
				nextFocusLeft: 'focus-' + (listLen - 1),
				nextFocusRight: 'focus-' + (listLen + 1),
				nextFocusUp: listLen < 4 ? 'debug' : 'focus-' + (listLen - 4),
				//nextFocusDown: 'focus-' + (listLen + 4),
				nextFocusDown: LMEPG.Func.setDownFocus(pageData.length, 4, listLen, 'focus-'),
				backgroundImage: g_appRootPath+'/Public/img/Common/transparent.png',
				focusImage: hdImg,
				click: this.onClickPlay,
				beforeMoveChange: this.onBeforeMoveTurnVideoList,
				focusChange: ''
			});
		}

		LMEPG.BM.addButtons(this.buttons);
	},

	/**
	 * 下一页视频列表
	 * @param dir
	 */
	listPrev: function (dir) {
		if (this.listPage == 0) return;
		this.listPage--;
		this.renderList();
		LMEPG.BM.requestFocus('focus-7');
		// tab选中状态跟随移动变化
		Level3.keepFocusId === 'tab-0' ? Level3.tabPrev() : this.setNavBgState(dir);
	},

	/**
	 * 上一页视频列表
	 * @param dir
	 */
	listNext: function (dir) {
		var tabIndex = +this.keepFocusId.slice(-1) * this.tabPage;
		if ((this.listPage + tabIndex) == Level3.listMaxPage) return;
		this.listPage++;
		this.renderList();
		LMEPG.BM.requestFocus('focus-0');
		// tab选中状态跟随移动变化
		Level3.keepFocusId === 'tab-6' ? Level3.tabNext() : this.setNavBgState(dir);
	},

	/**
	 * 设置背景图片
	 * @param dir 切换视频列表的方向（左/右）
	 */
	setNavBgState: function (dir) {
		var me = Level3;
		var tabFocusIndex = +me.keepFocusId.substr(4);
		me.bg(me.keepFocusId, "");
		me.keepFocusId = 'tab-' + (tabFocusIndex - (dir === "left" ? (tabFocusIndex === 0 ? 0 : 1) : (tabFocusIndex === 6 ? 6 : -1)));
		me.bg(me.keepFocusId, RenderParam.platformType=='sd'?g_appRootPath+ '/Public/img/sd/Unclassified/V16/gather_video_s.png':g_appRootPath+ '/Public/img/hd/Channel/V25/num-has-choose.png');
	},

	/**
	 * 1.焦点移动翻页视频列表
	 * 2.向上移动到对应集数的tab上
	 * @param key
	 * @param btn
	 * @returns {boolean}
	 */
	onBeforeMoveTurnVideoList: function (key, btn) {
		switch (true) {
			case key == 'left' && (btn.id == 'focus-0' || btn.id == 'focus-4'):
				Level3.listPrev(key);
				return false;
			case key == 'right' && (btn.id == 'focus-3' || btn.id == 'focus-7'):
				Level3.listNext(key);
				return false;
			case btn.id.slice(-1) < 4:
				if (key == 'up') {
					LMEPG.BM.requestFocus('debug');
					LMEPG.BM.getButtonById('debug').nextFocusUp = Level3.keepFocusId;
				} else if (key == 'down') {
					// 最后一页
					if (Level3.tabPage == Level3.tabMaxPage) {
						// 最后一页的视频个数
						var lastTabVideoCount = Level3.videoList.length % 8;
						if (+btn.id.substr(6, 1) + 4 > lastTabVideoCount - 1) {
							LMEPG.BM.requestFocus('focus-' + (lastTabVideoCount - 1));
							return false;
						}
					}
				}
				break;
		}
	},

	toggleListArrow: function () {
		S('prev-arrow');
		S('next-arrow');
		this.listPage == 0 && H('prev-arrow');
		this.listPage == Level3.listMaxPage && H('next-arrow');
	},

	toggleNavArrow: function () {
		S("nav-next");
		if (Level3.tabPage == Level3.tabMaxPage - 1)
			H("nav-next");
	},

	onFocusMoveToNavFocusId: function (key, btn) {
		switch (btn.id) {
			case 'full-screen':
			case 'collect':
			case 'one-key-inquiry':
				if (key == 'down') {
					// 如果视频集无数据，则焦点禁止向下
					if (Level3.videoList.length == 0) return false;
					LMEPG.BM.requestFocus('debug');
					LMEPG.BM.getButtonById('debug').nextFocusDown = Level3.keepFocusId;
				}
				break;
		}
	},

	/**
	 * 点击视频列表播放
	 * @param btn
	 */
	onClickPlay: function (btn) {
		var dataIndex = parseInt(btn.id.slice(btn.id.length - 1)) + Level3.listPage * Level3.NUM;
		Level3.onClickVideoItem(dataIndex); // 播放视频
	},

	// 处理点击视频列表事件
	onClickVideoItem: function (dataIndex) {
		var videoList = RenderParam.detail.data.video_list;
		var data = videoList[dataIndex];
		// 创建视频信息
		var videoInfo = {
			'sourceId': data.source_id,
			'videoUrl': RenderParam.platformType == 'hd' ? data.ftp_url.gq_ftp_url : data.ftp_url.bq_ftp_url,
			'title': data.title,
			'type': RenderParam.detail.data.subject_list[0].model_type,
			'userType': data.user_type,
			'freeSeconds': data.free_seconds,
			'entryType': 1,
			'entryTypeName': '视频集',
			'unionCode': data.union_code,
			'show_status': data.show_status,
		};

		//视频专辑下线处理
		if(videoInfo.show_status == "3") {
			LMEPG.UI.showToast('该节目已下线');
			return;
		}
		if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
			PageJump.jumpPlayVideo(videoInfo);
		} else {
			PageJump.jumpBuyVip(videoInfo.title, videoInfo);
		}
	},

	/**
	 * 设置虚拟按钮
	 */
	createBtns: function () {
		this.buttons.push({
			id: 'full-screen',
			name: '全屏',
			type: 'img',
			nextFocusRight: 'collect',
			nextFocusDown: 'debug',
			backgroundImage: g_appRootPath+ '/Public/img/hd/Channel/V16/full_screen.png',
			focusImage: g_appRootPath+ '/Public/img/hd/Channel/V16/full_screen_f.png',
			click: Play.playHomePollVideo,
			beforeMoveChange: this.onFocusMoveToNavFocusId,
			focusChange: ''
		}, {
			id: 'collect',
			name: '收藏',
			type: 'img',
			nextFocusLeft: 'full-screen',
			nextFocusRight: 'one-key-inquiry',
			nextFocusDown: 'debug',
			backgroundImage:g_appRootPath+  '/Public/img/hd/Channel/V25/collect.png',
			focusImage:g_appRootPath+  '/Public/img/hd/Channel/V25/collect-choose.png',
			click: Level3.setCollectStatus,
			beforeMoveChange: this.onFocusMoveToNavFocusId,
			focusChange: ''
		}, {
			id: 'debug',
			name: '脚手架ID',
			type: 'others',
			nextFocusUp: 'tab-0',
			nextFocusDown: 'tab-0'
		});

		// 导航条
		var tabLen = this.COUNT;
		while (tabLen--) {
			this.buttons.push({
				id: 'tab-' + tabLen,
				name: '',
				type: 'div',
				nextFocusLeft: 'tab-' + (tabLen - 1),
				nextFocusRight: 'tab-' + (tabLen + 1),
				nextFocusUp: 'collect',
				nextFocusDown: 'focus-0',
				backgroundImage:  ' ',
				focusImage:g_appRootPath+ '/Public/img/hd/Channel/V25/num-choose.png',
				selectedImage:g_appRootPath+ '/Public/img/hd/Channel/V25/num-has-choose.png',
				click: '',
				beforeMoveChange: this.onBeforeMoveTurnTab,
				focusChange: this.onFocusRenderVideoList
			});

		}
		LMEPG.BM.init("tab-0", this.buttons, '', true);
	},
	/**
	 * 初始化顶部数据
	 */
	initTopData: function () {
		if (RenderParam.detail.result != 0) {
			LMEPG.UI.showToast("数据加载失败！", 2, function () {
				onBack();
			});
			return;
		}

		/* 模拟数据
          Level3.videoList = [];
          for (var i = 0; i < 120; i++) {
              Level3.videoList.push([
                  {id: 23321, src: ROOT + '/Public/hd/img/Channel/V13/test_1.png'},
                  {id: 23321, src: ROOT + '/Public/img/hd/Channel/V13/test_1.png'}]
              );
          }*/

		Level3.videoList = RenderParam.detail.data.video_list;
		Level3.listMaxPage = Math.ceil(Level3.videoList.length / 8) - 1;

		G('cover').src =RenderParam.fsUrl+RenderParam.detail.data.subject_list[0].image_url
		G("desc-title").innerHTML = RenderParam.detail.data.subject_list[0].subject_name;
		G("how-num").innerHTML = "共" + Level3.videoList.length+'集';
		G("desc-text").innerHTML = RenderParam.detail.data.subject_list[0].intro_txt;
	},

	/**
	 * 设置收藏状态
	 */
	setCollectStatus: function () {
		var postData = {
			"type": RenderParam.isCollect == 1 ? 1 : 0, // 类型（0收藏 1取消收藏）
			"item_type": 2, // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
			"item_id": RenderParam.detail.data.subject_list[0].subject_id // 收藏对象id
		};
		LMEPG.ajax.postAPI("Collect/setCollectStatusNew", postData, function (rsp) {
			try {
				var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
				console.log(collectItem);
				if (collectItem.result == 0) {
					if (postData.type == 0) {
						//收藏成功
						RenderParam.isCollect = 1;
						G("collect").src =  g_appRootPath+"/Public/img/hd/Channel/V25/cancel-collect-v.png";
						LMEPG.UI.showToast("收藏成功");
					} else {
						//取消收藏成功
						RenderParam.isCollect = 0;
						G("collect").src =  g_appRootPath+"/Public/img/hd/Channel/V25/collect-choose.png";
						LMEPG.UI.showToast("取消收藏成功");
					}

					// 更新收藏按钮图片
					Level3.updateCollectBtnUI();
				} else {
					LMEPG.UI.showToast("操作失败");
				}
			} catch (e) {
				LMEPG.UI.showToast("操作异常");
			}
		});
	},

	/**
	 * 更新收藏按钮图片
	 */
	updateCollectBtnUI: function () {
		var collectBtn = Level3.buttons[1]; // 添加的第第二个按钮为收藏按钮
		var currentFocusBtn = LMEPG.BM.getCurrentButton().id;

		if (RenderParam.isCollect == 0) {
			collectBtn.backgroundImage =  g_appRootPath+"/Public/img/hd/Channel/V25/collect.png";
			collectBtn.focusImage = g_appRootPath+ "/Public/img/hd/Channel/V25/collect-choose.png";
			if (currentFocusBtn !== 'collect')
				G("collect").src = g_appRootPath+ "/Public/img/hd/Channel/V25/collect.png";
		} else {
			collectBtn.backgroundImage = g_appRootPath+ "/Public/img/hd/Channel/V25/has-collect.png";
			collectBtn.focusImage =  g_appRootPath+"/Public/img/hd/Channel/V25/cancel-collect-v.png";

			if (currentFocusBtn !== 'collect')
				G("collect").src = g_appRootPath+ "/Public/img/hd/Channel/V25/has-collect.png";
		}
	},
};

/**
 * ===============================处理首页小窗口视频轮播===============================
 */
var Play = {
    currPollVideoId: 0,     //当前轮播id

    /**
	 * 初始化，如果有用户当前视频集历史播放记录和进度，则给currPollVideoId赋值，找到当前的轮播id，
	 * 并且从指定的进度进行小窗播放
     */
    lastedPlaySecond: 0, // 当前视频集小窗播放的历史进度
    lastedPollVideoId: 0, // 有历史播放进度的轮播id，首次进入页面初始化
	init: function() {
		var latestVideoInfo = RenderParam.latestVideoInfo;
		if (latestVideoInfo.result == 0) {
			var videoInfo = JSON.parse(latestVideoInfo.val);
			for (var i = 0; i < Level3.videoList.length; i++) {
				if (videoInfo.sourceId == Level3.videoList[i].source_id) {
					Play.currPollVideoId = i;
					Play.lastedPollVideoId = i;
					Play.lastedPlaySecond = parseInt(videoInfo.lastedPlaySecond);
					break;
				}
			}
		}
	},

    /**
     * 启动小窗播放
     */
    startPollPlay: function(lastedPlaySecond) {
        //G("sm-current").innerHTML = "第" + (Play.currPollVideoId + 1) + "集";
        // 在开始播放之前，先注销播放器，避免有的盒子在频繁切换播放器状态时有问题
        LMEPG.mp.destroy();
        var videoUrl = Play.getCurrentPollVideoUrl(); //播放地址
        var playVideoUrl = LMEPG.Func.http2rtsp(videoUrl);
        var param = {
            carrierId: RenderParam.carrierId,
            videoUrl: playVideoUrl,
            playerScreenId: 'iframe_small_screen',
            platformType: RenderParam.platformType,
            playerUrl: RenderParam.thirdPlayerUrl
        };
        if (RenderParam.platformType == 'hd') {
            param.position = {top: 54, left: 92, width: 348, height: 200};
        } else {
            param.position = {top: 40, left: 50, width: 180, height: 134};
        }
        // 时移播放
        if (!LMEPG.Func.isEmpty(lastedPlaySecond))
        	param.playByTimeSeconds = lastedPlaySecond;
        LMSmallPlayer.initParam(param);
        LMSmallPlayer.startPlayVideo();
    },

    /** 处理首页轮播视频 */
    playHomePollVideo: function() {
        var data = Play.getCurrentPollVideoData();
        if (data == null) {
            return;
        }
        // 创建视频信息
        var videoInfo = {
            'sourceId': data.source_id,
            'videoUrl': RenderParam.platformType == 'hd' ? data.ftp_url.gq_ftp_url : data.ftp_url.bq_ftp_url,
            'title': data.title,
            'type': RenderParam.detail.data.subject_list[0].model_type,
            'userType': data.user_type,
            'freeSeconds': data.free_seconds,
            'entryType': 1,
            'entryTypeName': '视频集',
            'unionCode': data.union_code,
			'show_status': data.show_status,
        };
		//视频专辑下线处理
		if(videoInfo.show_status == "3") {
			LMEPG.UI.showToast('该节目已下线');
			return;
		}
        if (Play.lastedPollVideoId == Play.currPollVideoId) {
        	videoInfo.lastedPlaySecond = Play.lastedPlaySecond;
		}

        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
            PageJump.jumpPlayVideo(videoInfo);
        }
        else {
            PageJump.jumpBuyVip(videoInfo.title, videoInfo);
        }
    },

    /**
     * 得到当前轮播地址
     */
    getCurrentPollVideoUrl: function() {
    	if (RenderParam.platformType == 'hd')
        	return Level3.videoList[Play.currPollVideoId].ftp_url.gq_ftp_url;
    	else
            return Level3.videoList[Play.currPollVideoId].ftp_url.bq_ftp_url;
    },

    /**
     * 得到当前轮播数据对象
     * @returns {*}
     */
    getCurrentPollVideoData: function() {
        return Level3.videoList[Play.currPollVideoId];
    },

    /**
     * 播放过程中的事件
     */
    onPlayEvent: function(keyCode) {
        if (LMEPG.mp.isEnd(keyCode) || LMEPG.mp.isError(keyCode)) {
            var videoCount = Level3.videoList.length;
            if (Play.currPollVideoId >= 0 && Play.currPollVideoId < videoCount - 1) {
                Play.currPollVideoId++;
            }
            else {
                Play.currPollVideoId = 0;
            }
            Play.startPollPlay();
        }
    },

};

// 注册播放事件回调
LMEPG.KeyEventManager.addKeyEvent(
    {
        EVENT_MEDIA_END: Play.onPlayEvent,
        EVENT_MEDIA_ERROR: Play.onPlayEvent,
    }
);

window.onunload = function() {
    LMEPG.mp.destroy();  //释放播放器
};



/**
 * ===============================处理跳转===============================
 */
var PageJump = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function() {
        var currentPage = LMEPG.Intent.createIntent('channelList');
        currentPage.setParam('subject_id', RenderParam.detail.data.subject_list[0].subject_id);
        // 焦点保持
		currentPage.setParam('focusId', LMEPG.BM.getCurrentButton().id);
		currentPage.setParam('listPage', Level3.listPage); // 列表页数
		currentPage.setParam('tabPage', Level3.tabPage); // tab页数
		currentPage.setParam('keepFocusId', Level3.keepFocusId); // 选中的tab

        return currentPage;
    },

    /**
     * 跳转购买vip页面
     */
    jumpBuyVip: function(remark, videoInfo) {
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
    jumpPlayVideo: function(videoInfo) {
        if (LMEPG.Func.isEmpty(videoInfo) || LMEPG.Func.isEmpty(videoInfo.videoUrl)) {
            LMEPG.UI.showToast('视频信息为空！');
            return;
        }

        var objHome = PageJump.getCurrentPage();

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));
        objPlayer.setParam('subjectId', RenderParam.detail.data.subject_list[0].subject_id);

        LMEPG.Intent.jump(objPlayer, objHome);
    },

};


var onBack = htmlBack = function() {
	LMEPG.Intent.back();
};
