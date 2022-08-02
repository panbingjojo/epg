/**
 *desc:专题封装
 *author: jxf
 *@date 2019-05-28
 *@version: 2.0
 * 去掉了往期专题模块，更清晰的调用区域差异化
 */
(function(w, d, e, t) {
	var Album = {
		currentAlbum: t.albumName,
		focusIDName: t.focusIDName,
		listMovePages: t.listMovePages,
		totalVideoArray: [],
		buttons: [],
		init: function(opt) {
			this.resolvedOptions(opt);
			this.getVideoArrayItem();
			this.renderVideoItem();
			this.createButtons();
		},
		resolvedOptions: function(opt) {
			opt = opt || {};
			for (var item in opt) {
				if (opt.hasOwnProperty(item)) {
					Album[item] = opt[item];
				}
			}
		},
		getVideoArrayItem: function() {
			var i = this.allVideoLength; // 入口参数引入
			while (i--) {
				this.totalVideoArray.unshift(i);
			}
			if (t.platformType == 'hd' && this.hasSmallVideo) {
				this.totalVideoArray.shift(); // 有小窗则剔除第一个
			}
		},
		renderVideoItem: function() {
			var htm = '';
			var videoList = this.totalVideoArray.slice(this.listMovePages, this.V + this.listMovePages);
			var len = videoList.length;
			for (var i = 0; i < len; i++) {
				var src = this.imgPrefixIndex + 'bg_video_item_' + (videoList[i] + 1) + '.png';
				var focusBg = this.imgPrefixIndex + 'f_video_item_' + (videoList[i] + 1) + '.png';
				htm += '<img id=focus-' + (i + 1) + ' data-v=' + videoList[i] + ' src=' + src + ' data-f=' + focusBg + ' data-b=' + src + '>';
			}
			this.arrowToggle();
			d.getElementById('tab-content').innerHTML = htm;
		},

		createButtons: function() {
			var videoList = this.totalVideoArray.slice(this.listMovePages, this.V + this.listMovePages);
			// 视频列表按钮
			for (var j = 0; j < videoList.length; j++) {
				var move = this.videoListItemMove;
				var up = move.up, down = move.down, left = move.left, right = move.right;
				if (this.listVideoDirection == 'right') {
					left = 'focus-' + j;
					right = 'focus-' + (j + 2);
				} else{
					up = 'focus-' + j;
					down = 'focus-' + (j + 2);
				}
				this.buttons.push({
					id: 'focus-' + (j + 1),
					name: '视频' + (j + 1),
					type: 'img',
					nextFocusUp: up,
					nextFocusDown: down,
					nextFocusLeft: left,
					nextFocusRight: right,
					click: this.keyEnter,
					focusChange: this.onFocus,
					beforeMoveChange: this.beforeFocusMove
				});
			}
			this.buttons.push({
				id: 'back',
				name: '返回',
				type: 'img',
				nextFocusLeft: this.backItemMove.left,
				nextFocusRight: this.backItemMove.right,
				nextFocusDown: this.backItemMove.down,
				backgroundImage: this.imgPrefixIndex + 'bg_back.png',
				focusImage: this.imgPrefixIndex + 'f_back.png',
				click: this.onBack
			}, {
				id: 'more',
				name: '更多精彩',
				type: 'img',
				nextFocusLeft: this.moreItemMove.left,
				nextFocusRight: this.moreItemMove.right,
				nextFocusDown: this.moreItemMove.down,
				nextFocusUp: this.moreItemMove.up,
				backgroundImage: this.imgPrefixIndex + 'bg_more_video.png',
				focusImage: this.imgPrefixIndex + 'f_more_video.png',
				click: this.jumpVideoMore
			}, {
				id: 'videoTv',
				name: '视频小窗',
				type: 'img',
				nextFocusLeft: this.videoTvItemMove.left,
				nextFocusRight: this.videoTvItemMove.right,
				nextFocusDown: this.videoTvItemMove.down,
				nextFocusUp: this.videoTvItemMove.up,
				backgroundImage: this.imgPrefixIndex + 'bg_small_video.png',
				focusImage: this.imgPrefixIndex + 'f_small_video.png',
				click: this.keyEnter
			});
			e.BM.init(this.focusIDName, this.buttons, '', true);
		},

		// 指示箭头切换
		arrowToggle: function() {
			H('v-prev');
			H('v-next');
			this.listMovePages > 0 && S('v-prev');
			this.totalVideoArray.length - this.listMovePages > this.V && S('v-next');
		},

		// 焦点移动前回调
		beforeFocusMove: function(direction, current) {
			var self = Album;
			var nextDirection = self.listVideoDirection;
			var prevDirection = nextDirection == 'right' ? 'left' : 'up';
			// 向上滚动
			if (direction == prevDirection && current.id == 'focus-1') {
				self.prev(direction, current);
			}
			// 向下滚动
			if (direction == nextDirection && current.id == 'focus-' + self.V) {
				self.next(direction, current);
			}
		},

		// 上一页
		prev: function() {
			if (this.listMovePages > 0) {
				this.listMovePages--;
				this.renderVideoItem();
				e.BM.requestFocus('focus-1');
			} else{
				e.BM.requestFocus(this.videoListItemMove.prev);
			}
		},

		// 下一页
		next: function() {
			var videoList = (this.totalVideoArray.length) - this.listMovePages;
			if (videoList > this.V) {
				this.listMovePages++;
				this.renderVideoItem();
				e.BM.requestFocus('focus-' + this.V);
			} else{
				e.BM.requestFocus(this.videoListItemMove.next);
			}
		},

		// 获得焦点、失去焦点添加样式
		onFocus: function(btn, hasFocus) {
			var btnEl = d.getElementById(btn.id);
			var debugEl = d.getElementById('debug');
			if (hasFocus) {
				debugEl.innerHTML = '.'; // 标清防止焦点丢失
				btnEl.src = btnEl.getAttribute('data-f');//获取焦点
			} else{
				debugEl.innerHTML = '';
				btnEl.src = btnEl.getAttribute('data-b');//失去焦点
			}
		},

		// 键入事件
		keyEnter: function(btn) {
			var self = Album;
			var btnObj = d.getElementById(btn.id);
			var videoIndex = btnObj.getAttribute('data-v');
			var videoInfo = t.videoData[videoIndex];
			switch (true) {
				case btn.id == 'back':
					self.onBack();
					break;
				case self.lastVideoTvItemClickIsMore && videoIndex == self.allVideoLength - 1 :
					self.jumpVideoMore(btn); // 最后一个视频列表是跳转查看更多
					break;
				default:
					try {
						self.onClickVideoItem(btn.id, videoInfo);
					} catch (e) {
						d.getElementById('debug').innerText = '系统报错！' + e.toString();
					}
					break;
			}
		},
		onClickVideoItem: function(id, videoInfo) {
			var self = Album;
			var ftp_url_json, play_id;
			if (videoInfo.ftp_url instanceof Object) {
				ftp_url_json = videoInfo.ftp_url;
			} else{
				ftp_url_json = JSON.parse(videoInfo.ftp_url);
			}

			//视频专辑下线处理
			if (videoInfo.show_status == "3") {
				LMEPG.UI.showToast('该节目已下线');
				return;
			}

			// 视频ID
			if (this.platformType == 'hd') {
				play_id = ftp_url_json.gq_ftp_url;
			} else{
				play_id = ftp_url_json.bq_ftp_url;
			}
			var paramJson = {
				'sourceId': videoInfo.source_id,
				'videoUrl': play_id,
				'title': videoInfo.title,
				'type': 2,
				'entryType': 4,
				'entryTypeName': this.currentAlbum,
				'userType': videoInfo.user_type,
				'freeSeconds': videoInfo.free_seconds,
				'duration': videoInfo.duration,
				'focusIdx': id,
				'unionCode': videoInfo.union_code,
				'showStatus': videoInfo.show_status
			};
			if (e.Func.isAllowAccess(t.vip, ACCESS_PLAY_VIDEO_TYPE, paramJson)) {
				self.jumpVideoPlay(paramJson);
			} else{
				var postData = {'videoInfo': JSON.stringify(paramJson)};
				e.ajax.postAPI('Player/storeVideoInfo', postData, function(data) {
					if (data.result == 0) {
						self.jumpBuyVip(paramJson.focusIdx, paramJson.title);
					} else{
						d.getElementById('debug').innerText = '系统报错!';
					}
				});
			}
		},

		jumpBuyVip: function(focusIdx, remark) {
			var objCurrent = this.getCurrentPage();
			objCurrent.setParam('fromId', 1);
			objCurrent.setParam('focus_index', focusIdx);
			objCurrent.setParam('page', 0);
			objCurrent.setParam('moveNum', this.listMovePages);

			var objOrderHome = e.Intent.createIntent('orderHome');
			objOrderHome.setParam('isPlaying', '1');
			objOrderHome.setParam('remark', remark);

			e.Intent.jump(objOrderHome, objCurrent);
		},

		jumpVideoPlay: function(paramJson) {
			var objCurrent = this.getCurrentPage();
			objCurrent.setParam('fromId', 2);

			var objPlayer = e.Intent.createIntent('player');
			objPlayer.setParam('videoInfo', JSON.stringify(paramJson));
			// 广西广电多传一个参数
			objPlayer.setParam('allVideoInfo', JSON.stringify([paramJson]));
			e.Intent.jump(objPlayer, objCurrent);
		},

		getCurrentPage: function() {
			var objCurrent = e.Intent.createIntent('album');
			objCurrent.setParam('albumName', this.currentAlbum);
			objCurrent.setParam('focus_index', this.focusIDName);
			objCurrent.setParam('moveNum', this.listMovePages);
			objCurrent.setParam('fromId', 1);
			objCurrent.setParam('inner', this.inner);
			d.getElementById('debug').innerHTML = this.currentAlbum + this.focusIDName+this.listMovePages;
			return objCurrent;
		},

		jumpVideoMore: function() {
			var self = Album;
            // 中国联通/江苏电信跳转首页精选专辑tab
            if (TP.lmcid == '000051' || TP.lmcid == '320092') {
                self.morePageName = 'home';
            }
			var objMoreVideo = e.Intent.createIntent(self.morePageName);
			objMoreVideo.setParam('modeType', self.backHomeTabNumber);
			objMoreVideo.setParam('modeTitle', '更多精彩');
			objMoreVideo.setParam('currentTabIndex', 3);
			objMoreVideo.setParam('homeTabIndex', 5);
			objMoreVideo.setParam('pageCurrent', 1); // 内容页数
			objMoreVideo.setParam('navCurrent', 0);  // 导航焦点
			objMoreVideo.setParam('classifyId', 1);
			objMoreVideo.setParam('modelType', 4);
            objMoreVideo.setParam('tabId', 'tab-2');  // 中国联通专辑更多视频跳转的tabId

			var objBack = e.Intent.createIntent(self.backPage);
			e.Intent.jump(objMoreVideo, objBack);
		},
		onBack: function() {
			if( typeof TP.areaCode != 'undefined'){
				if(TP.carrierId =='000051' && TP.areaCode == '207'){
					LMEPG.Intent.back('IPTVPortal');
					return;
				}
			}

			LMEPG.Intent.back();
		}
	};

	// 使用原型继承（部分盒子会将全局字面量对象属性被强制更改）
	function object(o) {
		function F() {}

		F.prototype = o;
		return new F();
	}

	w.EPGAlbum = object(Album);
	w.onBack = EPGAlbum.onBack;
	//w.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
}(window, document, LMEPG, TP));
