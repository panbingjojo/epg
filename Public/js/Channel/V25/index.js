var pathPrefix = '/Public/img/hd/Home/V16/Home/';
var searchIcon = pathPrefix + 'search.png';
var searchIconF = pathPrefix + 'search_f.png';
var vipIcon = pathPrefix + 'vip.png';
var vipIconF = pathPrefix + 'vip_f.png';

var hisIcon = pathPrefix + 'history.png';
var hisIconF = pathPrefix + 'history_f.png';
var collIcon = pathPrefix + 'collect.png';
var collIconF = pathPrefix + 'collect_f.png';
var dataIcon = pathPrefix + 'data.png';
var dataIconF = pathPrefix + 'data_f.png';
var Level2 = {
	page: 0,
	maxPage: 0,
	buttons: [],
	beClickBtnId: 'focus-0',
	data: {},
	videoSetList: [], // 当前视频集列表
	init: function() {
		// 数据恢复
		Level2.keepNavFocusId = RenderParam.keepNavFocusId;
		Level2.page = parseInt(RenderParam.page);
		Level2.navPage = parseInt(RenderParam.navPage);
		Level2.navIndex = parseInt(RenderParam.navIndex);

		this.maxNavPage = Math.ceil((RenderParam.secondClass.data.length) / 6);
		this.renderNav(); // 渲染导航
		this.createBtns();

		// 获取对应导航下的视频集
		Level2.getVideoSetList(RenderParam.secondClass.data[Level2.navIndex + Level2.navPage * 5].model_type, Level2.navIndex, function() {
			Level2.render();
			// 焦点恢复
			if (!LMEPG.Func.isEmpty(RenderParam.focusId)) {
				LMEPG.BM.requestFocus(RenderParam.focusId);
				// G(Level2.keepNavFocusId).style.backgroundImage = 'url(' + (RenderParam.platformType=='sd'?'/Public/img/sd/Unclassified/V13/nav_s.png':'/Public/img/hd/Channel/V16/btn_nav_s.png') + ')';
				G(Level2.keepNavFocusId).style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/Channel/V25/nav-has-choose.png)';
				Level2.isLeaveNav = true;
			}
		});


	},
	navIndex: 0, // 当前加载的数据的tab id
	currentData: [],
	/*视频列表渲染*/
	render: function() {
		var page = this.page * 8;
		var maxPage = this.maxPage;
		this.currentData = Level2.videoSetList.slice(page, page + 8);
		var htm = '';
		var isNullData = this.isNullData();
		if (isNullData) {
			maxPage = 0;
		} else{
			this.currentData.forEach(function(t, i) {
				htm += '<li id=focus-' + i + '>'
					+ '<img onerror="this.src=\'/Public/img/Common/default.png\'" src=' + RenderParam.fsUrl + t.image_url + '>';
				if (t.album_type) {
					htm += '<p>' + t.content_cnt + '全集</p>';
				}
			});
			G('list-wrapper').innerHTML = htm;
		}

		G('page-index').innerHTML = (this.page + 1) + '/' + (maxPage + 1);
		this.toggleArrow();
	},
	// 空数据处理
	isNullData: function() {
		if (this.currentData.length == 0) {
			G('list-wrapper').innerHTML = '<div class=null-data>该栏目还没有视频哦~';
			H('page-wrapper');
			return true;
		}
		S('page-wrapper');
		return false;
	},

	isLeaveNav: false, // 标记是否离开导航
	keepNavFocusId: 'nav-0', // 存储离开导航时候的焦点
	onMoveChangeKeepNavFocus: function(key, btn) {
		// 如果当前tab无数据，则焦点在tab上不能下移
		if (Level2.videoSetList.length == 0 && key == 'down') {
			return;
		}
		var _this = Level2;
		if (key == 'up' || key == 'down') {
			_this.isLeaveNav = true;
			_this.keepNavFocusId = btn.id;
			var downFocusNavId = ['search', 'set', 'mark', 'vip', 'help'];
			downFocusNavId.forEach(function(t) {
				if (LMEPG.BM.getButtonById(t)) {
                    LMEPG.BM.getButtonById(t).nextFocusDown = _this.keepNavFocusId;
                }
			});
		}
		if (key == 'left' && btn.id == 'nav-0') {
			_this.prevNav();
			return false;
		}
		if (key == 'right' && btn.id == 'nav-5') {
			_this.nextNav();
			return false;
		}
	},
	navPage: 0,
	maxNavPage: 0,
	prevNav: function() {
		if (this.navPage == 0) {
			return;
		}
		this.navPage--;
		this.renderNav();
		this.moveToFocus('nav-4');
	},
	nextNav: function() {
		if (this.navPage == this.maxNavPage - 1) {
			return;
		}
		this.navPage++;
		this.renderNav();
		this.moveToFocus('nav-0');
	},

	// navData: Array.from({length: 100}, (v, k) => k),// 模拟数据

	/*渲染导航*/
	renderNav: function() {

		var count = this.navPage * 6;
		var currentNavData = RenderParam.secondClass.data.slice(count, count + 6);
		var htm = '';
		currentNavData.forEach(function(t, i) {
			htm += '<p title="'+t.model_name+'" id="nav-' + i + '">' + t.model_name + '</p>';
		});
		G('nav-container').innerHTML = htm;
		this.toggleNavArrow();
	},

	// 上一页
	prevPage: function(btn) {
		var that = Level2;
		that.page = Math.max(0, that.page -= 1);
		that.render();
		if (btn.id.substr(0, 6) == 'focus-') {
			Level2.moveToFocus('focus-0');
			return;
		}
		that.changeMoveFocusId(btn);
	},
	// 下一页
	nextPage: function(btn) {
		var that = Level2;
		that.page = Math.min(that.maxPage, that.page += 1);
		that.render();
		if (btn.id.substr(0, 6) == 'focus-') {
			Level2.moveToFocus('focus-0');
			return;
		}
		that.changeMoveFocusId(btn);
	},
	// 第一页
	firstPage: function(btn) {
		var that = Level2;
		that.page = 0;
		that.render();
		that.changeMoveFocusId(btn);
	},
	// 最后一页
	lastPage: function(btn) {
		var that = Level2;
		that.page = that.maxPage;
		that.render();
		that.changeMoveFocusId(btn);
	},
	toggleNavArrow: function() {
		S('nav-prev-arrow');
		S('nav-next-arrow');
		this.navPage == 0 && H('nav-prev-arrow');
		this.navPage == this.maxNavPage - 1 && H('nav-next-arrow');
	},
	/**
	 * 1.
	 *  最后一页或下一页是最后一页的时候，
	 *  且页面视频个数不足6个，
	 *  功能按钮上移ID为最后一个视频;
	 * 2.
	 *  当前页面视频列表小于4个的时候，
	 *  视频列表下移到功能区；
	 *  当前视频列表个数为6个还原移动方向
	 */
	changeMoveFocusId: function(btn) {
		var leaveItems = (this.currentData.length - 1) % 6;
		var upId = ['first-page', 'next-page', 'prev-page', 'last-page'];

		if (leaveItems != 0) {
			upId.forEach(function(t) {
				LMEPG.ButtonManager.getButtonById(t).nextFocusUp = 'focus-' + leaveItems;
			});
		} else{
			upId.forEach(function(t) {
				LMEPG.ButtonManager.getButtonById(t).nextFocusUp = 'focus-4';
			});
		}
		var downId = ['focus-0', 'focus-1', 'focus-2'];
		if (leaveItems < 3) {
			downId.forEach(function(t) {
				var btn = LMEPG.ButtonManager.getButtonById(t);
				if (btn) {
					btn.nextFocusDown = 'first-page';
				}
			});
		} else{
			this.buttons.length = 0;
			this.createBtns();
			this.isLeaveNav = true;
			this.moveToFocus(btn.id);
		}
	},
	/**
	 * 导航得失焦点操作
	 * 得到焦点：初始化视频列表；还原标记离开导航状态为false
	 * 失去焦点：如果是离开状态设置指示UI为离开
	 * @param btn
	 * @param hasFocus
	 */
	onFocusChangeVideoList: function(btn, hasFocus) {
		var _this = Level2;
		var btnId = G(btn.id)
		if (hasFocus) {

			btnId.style.color = '#662200'
			btnId.style.fontWeight = 'bold'

			_this.isLeaveNav = false;
			var navIndex = parseInt(btn.id.substr(4));
			var el = G(btn.id);
			LMEPG.Func.marquee({el:el,len: 6, txt:el.title}, true);
			if (navIndex == _this.navIndex) {
				return;
			}

			Level2.getVideoSetList(RenderParam.secondClass.data[navIndex + Level2.navPage * 5].model_type, navIndex, function () {
                Level2.page = 0;
				_this.render();
            });
		}
		else {
			btnId.style.color = '#fff'
			btnId.style.fontWeight = 'normal'

            LMEPG.Func.marquee();
			if (_this.isLeaveNav) {
				G(btn.id).style.backgroundImage = 'url(' + btn.selectedImage + ')';
			}
		}
		_this.toggleFocus(btn, hasFocus);
	},

	// 箭头指示切换
	toggleArrow: function() {
		S('prev-arrow');
		S('next-arrow');
		this.page == 0 && H('prev-arrow');
		this.page == this.maxPage && H('next-arrow');
		this.currentData.length == 0 && H('next-arrow');
	},
	getCurPageObj: function() {
		var objCurrent = LMEPG.Intent.createIntent('channelIndex');
		objCurrent.setParam('modelType', RenderParam.firstModelType);
		objCurrent.setParam('modelName', RenderParam.modelName);
		objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id); // 焦点
		objCurrent.setParam('navPage', Level2.navPage); // 导航栏第几页
		objCurrent.setParam('keepNavFocusId', Level2.keepNavFocusId); // 被选择的导航栏第几项
		objCurrent.setParam('page', Level2.page); // 视频集结果列表第几页
		objCurrent.setParam('navIndex', Level2.navIndex); // 当前加载数据的导航栏id
		return objCurrent;
	},
	jumpPageUI: function(btn) {

		var currentObj = Level2.getCurPageObj(btn);
		// 通过点击对象id,设置跳转页面对象
		var jumpPageObj = {
			'search': 'search',
			'mark': 'dateMark',
			'vip': 'orderHome',
			'set': 'custom',
			'help': 'helpIndex',
			'history': 'historyPlay',
			'collect': 'collect',
			'data': 'familyEdit',
		};
		var jumpAgreementObj = LMEPG.Intent.createIntent(jumpPageObj[btn.id]);
		// 跳转的订购页面
		if (jumpPageObj[btn.id] == 'orderHome') {
			if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
				modal.commonDialog({beClickBtnId: btn.id, onClick: modal.hide}, '<span style="color: #ef6188">您已是VIP会员，不能重复订购</span>', '海量健康资讯', '为您的家人健康保驾护航');
				return;
			} else{
				jumpAgreementObj.setParam('userId', RenderParam.userId);
				jumpAgreementObj.setParam('isPlaying', '0');
				jumpAgreementObj.setParam('remark', '主动订购');
			}
		}
		LMEPG.Intent.jump(jumpAgreementObj, currentObj);
	},
	jumpLevel3VideoListPage: function(btn) {
		var currentObj = Level2.getCurPageObj(btn);
		var data = Level2.currentData[parseInt(btn.id.substr(6))];
		// 跳转视频集
		if (data.subject_id) {
            var dstObj = LMEPG.Intent.createIntent('channelList');
            dstObj.setParam('subject_id', data.subject_id);
			dstObj.setParam('alias_name', data.alias_name);
            LMEPG.Intent.jump(dstObj, currentObj);
        }
		// 跳转视频
		else {
            // 创建视频信息
			var ftpUrl = JSON.parse(data.ftp_url);
            var videoInfo = {
                'sourceId': data.source_id,
                'videoUrl': RenderParam.platformType == 'hd' ? ftpUrl.gq_ftp_url : ftpUrl.bq_ftp_url,
                'title': data.title,
                'type': data.model_type,
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
            }
            else {
                PageJump.jumpBuyVip(videoInfo.title, videoInfo);
            }
		}
	},
	toggleFocus: function(btn, hasFocus) {
		var btnElement = G(btn.id);
		if (hasFocus) {
			btnElement.setAttribute('class', 'focus');
		} else{
			btnElement.removeAttribute('class');
		}
	},
	onMoveChangeFocusId: function(key, btn) {
		var indexID = btn.id.slice(btn.id.length - 1);
		if (key == 'up' && indexID < 4) {
			Level2.moveToFocus(Level2.keepNavFocusId);
			return false;
		}

		// 数据不满2行，底部按钮向上，焦点到第一视频集
		if (key == 'up' && (btn.id == 'first-page' || btn.id == 'prev-page' || btn.id == 'next-page' || btn.id == 'last-page')) {
			Level2.moveToFocus('focus-' + (Level2.currentData.length - 1));
			return false;
		}

		// 数据不满2行，上面的按钮向下，焦点到“首页”上面
		if (key === 'down' && (btn.id === 'focus-0' || btn.id === 'focus-1' || btn.id === 'focus-2' || btn.id === 'focus-3')) {
            if (Level2.currentData.length <= 4) {
                Level2.moveToFocus('first-page');
                return false;
            } else {
            	// 如果底部按钮不存在，则焦点一到第二行最后一个按钮上去
				if (LMEPG.Func.isEmpty(LMEPG.BM.getButtonById(LMEPG.BM.getNextFocusDownId(btn.id)))) {
                    Level2.moveToFocus('focus-' + (Level2.currentData.length - 1));
                    return false;
                }
			}
		}

		// 左右按键切换翻页
		if (key === 'left') {
			if (btn.id === 'focus-0' || btn.id === 'focus-4') {
				Level2.prevPage(btn);
				return false;
			}
		} else if (key === 'right') {
			if (btn.id === 'focus-3' || btn.id === 'focus-7') {
				Level2.nextPage(btn);
				return false;
			}
		}

	},

	onTopBtnMoveChange: function(key, btn) {
		if (btn.id == 'search' || btn.id == 'set' || btn.id == 'mark' || btn.id == 'vip' || btn.id == 'store' || btn.id == 'help'|| btn.id == 'history'|| btn.id == 'collect') {
			if (key == 'down') {
				LMEPG.BM.requestFocus(Level2.keepNavFocusId);
				return false;
			}
		}
	},
	createBtns: function() {
		var count = 6;
		while (count--) {
			this.buttons.push({
				id: 'nav-' + count,
				name: '导航',
				type: 'div',
				nextFocusLeft: 'nav-' + (count - 1),
				nextFocusRight: 'nav-' + (count + 1),
				nextFocusUp: 'search',
				nextFocusDown: 'focus-0',
				backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
				focusImage:g_appRootPath+'/Public/img/hd/Channel/V25/nav-choose.png',
				selectedImage:g_appRootPath+'/Public/img/hd/Channel/V25/nav-has-choose.png',
				// focusImage: g_appRootPath+ '/Public/img/hd/Channel/V25/btn_nav_f.png',
				// selectedImage:g_appRootPath+'/Public/img/hd/Channel/V16/btn_nav_s.png',
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
				nextFocusUp: VIDEO_COUNT < 4 ? 'nav-0' : 'focus-' + (VIDEO_COUNT - 4),
				nextFocusDown: VIDEO_COUNT > 3 ? 'first-page' : 'focus-' + (VIDEO_COUNT + 4),
				backgroundImage:g_appRootPath+ '/Public/img/hd/Common/transparent.png',
				focusImage: RenderParam.platformType == 'sd' ?g_appRootPath+ '/Public/img/sd/Unclassified/V13/video_f.png' : g_appRootPath+'/Public/img/hd/Home/V25/recommend-bg-2.png',
				//focusImage:  '/Public/img/hd/Channel/V16/video_f.png',
				click: this.jumpLevel3VideoListPage,
				beforeMoveChange: this.onMoveChangeFocusId
			});
		}

		this.buttons.push(
			{
				id: 'search',
				name: '搜索图标',
				type: 'img',
				nextFocusLeft: 'debug',
				nextFocusRight: 'vip',
				nextFocusDown: 'debug',
				backgroundImage: searchIcon,
				focusImage: searchIconF,
				click: this.jumpPageUI,
				focusChange: this.toggleFocus,
				beforeMoveChange: this.onTopBtnMoveChange
			},
			{
				id: 'vip',
				name: 'VIP图标',
				type: 'img',
				nextFocusLeft: 'search',
				nextFocusRight: 'history',
				nextFocusDown: 'debug',
				backgroundImage: vipIcon,
				focusImage: vipIconF,
				click: this.jumpPageUI,
				focusChange: this.toggleFocus,
				beforeMoveChange: this.onTopBtnMoveChange
			},{
				id: 'history',
				name: '历史',
				type: 'img',
				nextFocusLeft: 'vip',
				nextFocusRight: 'collect',
				nextFocusDown: 'debug',
				backgroundImage: hisIcon,
				focusImage: hisIconF,
				click: this.jumpPageUI,
				focusChange: this.toggleFocus,
				beforeMoveChange: this.onTopBtnMoveChange
			}
			,{
				id: 'collect',
				name: '收藏',
				type: 'img',
				nextFocusLeft: 'history',
				nextFocusRight: 'data',
				nextFocusDown: 'debug',
				backgroundImage: collIcon,
				focusImage: collIconF,
				click: this.jumpPageUI,
				focusChange: this.toggleFocus,
				beforeMoveChange: this.onTopBtnMoveChange
			},{
				id: 'data',
				name: '收藏',
				type: 'img',
				nextFocusLeft: 'collect',
				nextFocusRight: '',
				nextFocusDown: 'debug',
				backgroundImage: dataIcon,
				focusImage: dataIconF,
				click: this.jumpPageUI,
				focusChange: this.toggleFocus,
				beforeMoveChange: this.onTopBtnMoveChange
			}, {
			id: 'first-page',
			name: '首页',
			type: 'img',
			nextFocusRight: 'prev-page',
			nextFocusUp: 'focus-3',
			backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V25/first_page.png',
			focusImage: g_appRootPath + '/Public/img/hd/Channel/V25/first_page_f.png',
			click: this.firstPage,
			beforeMoveChange: this.onMoveChangeFocusId
		}, {
			id: 'prev-page',
			name: '上一页',
			type: 'img',
			nextFocusLeft: 'first-page',
			nextFocusRight: 'next-page',
			nextFocusUp: 'focus-4',
			backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V25/prev_page.png',
			focusImage: g_appRootPath + '/Public/img/hd/Channel/V25/prev_page_f.png',
			click: this.prevPage,
			beforeMoveChange: this.onMoveChangeFocusId
		}, {
			id: 'next-page',
			name: '下一页',
			type: 'img',
			nextFocusLeft: 'prev-page',
			nextFocusRight: 'last-page',
			nextFocusUp: 'focus-4',
			backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V25/next_page.png',
			focusImage: g_appRootPath + '/Public/img/hd/Channel/V25/next_page_f.png',
			click: this.nextPage,
			beforeMoveChange: this.onMoveChangeFocusId
		}, {
			id: 'last-page',
			name: '尾页',
			type: 'img',
			nextFocusLeft: 'next-page',
			nextFocusUp: 'focus-5',
			backgroundImage: g_appRootPath + '/Public/img/hd/Channel/V25/last_page.png',
			focusImage: g_appRootPath + '/Public/img/hd/Channel/V25/last_page_f.png',
			click: this.lastPage,
			beforeMoveChange: this.onMoveChangeFocusId
		});
		console.log(this.buttons);
		this.initButtons(this.keepNavFocusId);
	},
	initButtons: function(id) {
		LMEPG.ButtonManager.init(id, this.buttons, '', true);
	},

	moveToFocus: function(id) {
		LMEPG.ButtonManager.requestFocus(id);
	},

	/**
	 * 获取对应分类视频集/视频列表
	 * @param modelType
	 */
	getVideoSetList: function(modelType, navIndex, callback) {
		var postData = {'model_type': modelType};
		LMEPG.UI.showWaitingDialog();
		LMEPG.ajax.postAPI('Video/getVideoList', postData, function(data) {
			var data = JSON.parse(data);
			console.log("getVideoList");
			console.log(data);
			if (data.result == 0) {
				Level2.videoSetList = [];
				// 视频集
				for (var i = 0; i < data.album_list.length; i++) {
					if (data.album_list[i].album_type == 1) {
						Level2.videoSetList.push(data.album_list[i]);
					}
				}
				// 视频
                Level2.videoSetList = Level2.videoSetList.concat(data.list);
				console.log(Level2.videoSetList);

				// 模拟多条数据
				// for (var i = 0; i < 10; i++) {
				// 	Level2.videoSetList.push(Level2.videoSetList[0]);
				// }

                Level2.maxPage = Math.floor((Level2.videoSetList.length - 1) / 8);
                Level2.navIndex = navIndex;
            	callback();
            } else {
            	LMEPG.UI.showToast("数据获取失败！");
			}

			LMEPG.UI.dismissWaitingDialog();
		});
	}
};

/**
 * ===============================处理跳转===============================
 */
var PageJump = {

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

        var objCurrent = Level2.getCurPageObj();
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

        var objHome = Level2.getCurPageObj();;

        // 更多视频，按分类进入
        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objHome);
    },

};

var onBack = htmlBack = function() {
	LMEPG.Intent.back();
};