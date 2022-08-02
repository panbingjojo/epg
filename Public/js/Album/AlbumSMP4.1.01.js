(function() {
	window.smallVideo = {
		startPollPlay: function(opt) {
			var videoUrl = smallVideo.getCurrentPollVideoUrl(); //播放地址
			var left = opt.left;
			var top = opt.top;
			var width = opt.width;
			var height = opt.height;
			var thirdPlayerUrl, port_index, path_index, result, lmpf, index;
			switch (TP.lmcid) {
				case '320092': //江苏电信
				case '640092': //宁夏电信
				case '450092': //广西电信
					this.playWithIframe(videoUrl, left, top, width, height);
					break;
				case '000051':
					setTimeout(function() {
						if (stbModel == 'IP506H_54U3') { //内蒙联通海信盒子
							LMEPG.mp.initPlayerByBind();
						} else{
							LMEPG.mp.initPlayer();
						}
						if (TP.platformType == 'hd') {
							LMEPG.mp.playOfSmallscreen(videoUrl, left, top, width, height); //小窗播放
							document.getElementById('default_link').focus();//防止（部分盒子）页面失去焦点
						}
					}, 500);
					break;
				case '520094': // 贵州广电播放器
					var data = TP.videoData[0];
					var videoInfoArr = [
						{   // 创建视频信息
							'sourceId': data.source_id,
							'videoUrl': videoUrl,
							'title': data.show_title,
							'type': '1',
							'userType': data.user_type,
							'freeSeconds': data.free_seconds,
							'entryType': 1,
							'entryTypeName': '专题轮播视频'
						}];
					var tempPosition = {
						left: left,
						top: top,
						width: width,
						height: height
					};

					var tempVideoInfo = encodeURIComponent(JSON.stringify(videoInfoArr[0]));
					var tempAllVideoInfo = encodeURIComponent(JSON.stringify(videoInfoArr));
					var jumpUrl = '/index.php/Home/Player/smallV1?videoInfo=' + tempVideoInfo + '&allVideoInfo=' + tempAllVideoInfo + '&position=' + JSON.stringify(tempPosition);
					G('smallscreen').src = jumpUrl;
					break;
				case '630092'://青海电信
					thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
					thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
					port_index = thirdPlayerUrl.indexOf(':');
					path_index = thirdPlayerUrl.indexOf('/');
					result = thirdPlayerUrl.substring(port_index, path_index);
					thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
					if (result === ':33200') {
						//华为端口
						lmpf = 'huawei';
						index = thirdPlayerUrl.indexOf('/EPG/');
						thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
					} else{
						lmpf = 'zte';
						index = thirdPlayerUrl.lastIndexOf('/');
						thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
					}
					info = LMEPG.mp.dispatcherUrl.getUrlWith630092(left, top, width, height, videoUrl, lmpf);
					factUrl = thirdPlayerUrl + info;
					G('smallscreen').setAttribute('src', factUrl);
					LMEPG.mp.initPlayerByBind();
					document.getElementById('default_link').focus();//防止（部分盒子）页面失去焦点
					break;
				case '420092':// 湖北电信EPG
					thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
					if (thirdPlayerUrl == '') {
						LMEPG.UI.showToast('domainUrl is empty!!!', 3);
						return;
					}

					thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
					port_index = thirdPlayerUrl.indexOf(':');
					path_index = thirdPlayerUrl.indexOf('/');
					result = thirdPlayerUrl.substring(port_index, path_index);
					thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
					if (result == ':33200') {
						lmpf = 'huawei';
						index = thirdPlayerUrl.indexOf('/EPG/');
						thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
					} else{
						lmpf = 'zte';
						index = thirdPlayerUrl.lastIndexOf('/');
						thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
					}

					info = LMEPG.mp.dispatcherUrl.getUrlWith420092(left, top, width, height, videoUrl, lmpf);
					playUrl = thirdPlayerUrl + info;
					G('smallscreen').setAttribute('src', playUrl);
					LMEPG.mp.initPlayerByBind();
					document.getElementById('default_link').focus();//防止（部分盒子）页面失去焦点
					break;
				case '350092': // 福建电信EPG
					// 判断第三方播放器地址
					thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
					if (!thirdPlayerUrl) {
						LMEPG.UI.showToast('domainUrl is empty!!!', 3);
						return;
					}
					var playParam = LMEPG.mp.dispatcherUrl.getUrlWith640092(top, left, width, height, videoUrl);
					thirdPlayerFullUrl = thirdPlayerUrl + playParam;

					G('smallscreen').setAttribute('src', thirdPlayerFullUrl); // 设置第三方播放器地址
					LMEPG.mp.initPlayerByBind();
					document.getElementById('default_link').focus();//防止（部分盒子）页面失去焦点
					break;
				case '360092': // 福建电信EPG
					// 判断第三方播放器地址
					if (TP.domainUrl == undefined || TP.domainUrl == '') {
						LMEPG.UI.showToast('domainUrl is empty!!!', 3);
						return;
					}
					var info = LMEPG.mp.dispatcherUrl.getUrlWith360092(top, left, width, height, videoUrl, TP.platformType);
					var playUrl = TP.domainUrl + info;
					// http://115.153.215.71:8282/EPG/jsp/8601_4Kdazhongban/en/HD_vasToMemInterface.jsp?vas_info=<vas_action>play_trailer</vas_action>
					// <mediacode>99100000012019031416475304411751</mediacode><mediatype>VOD</mediatype><left>358</left><top>150</top><width>550</width>
					// <height>302</height><size>hd</size>
					G('smallscreen').setAttribute('src', playUrl);
					LMEPG.mp.initPlayerByBind();
					document.getElementById('default_link').focus();//防止（部分盒子）页面失去焦点
					break;
				case '650092'://新疆电信
					var stbModel = LMEPG.STBUtil.getSTBModel();
					var stbDomainUrl = LMEPG.STBUtil.getEPGDomain();
					var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(stbDomainUrl);
					thirdPlayerUrl = prefixObj.url;
					info = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(left, top, width, height, videoUrl, prefixObj.isHW);
					var playUrl = thirdPlayerUrl + info;
					G('smallscreen').setAttribute('src', playUrl);
					LMEPG.mp.initPlayerByBind();
					G('default_link').focus();
					break;

				case '460092': // 海南电信
					thirdPlayerUrl = LMEPG.STBUtil.getEPGDomain();
					if (thirdPlayerUrl == '') {
						LMEPG.UI.showToast('domainUrl is empty!!!', 3);
						return;
					}
					thirdPlayerUrl = thirdPlayerUrl.replace('://', '+++');
					port_index = thirdPlayerUrl.indexOf(':');
					path_index = thirdPlayerUrl.indexOf('/');
					result = thirdPlayerUrl.substring(port_index, path_index);
					thirdPlayerUrl = thirdPlayerUrl.replace('+++', '://');
					if (result == ':33200') {
						lmpf = 'huawei';
						index = thirdPlayerUrl.indexOf('/EPG/');
						thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/EPG/';
					} else{
						lmpf = 'zte';
						index = thirdPlayerUrl.lastIndexOf('/');
						thirdPlayerUrl = thirdPlayerUrl.substr(0, index) + '/';
					}

					var info = LMEPG.mp.dispatcherUrl.getUrlWith420092(left, top, width, height, videoUrl, lmpf);
					var thirdPlayerFullUrl = thirdPlayerUrl + info;
					G('smallscreen').setAttribute('src', thirdPlayerFullUrl); // 设置第三方播放器地址
					LMEPG.mp.initPlayerByBind();
					document.getElementById('default_link').focus();//防止（部分盒子）页面失去焦点
					setTimeout(function() {
						var stbType1 = LMEPG.STBUtil.getSTBModel();
						if (stbType1.toUpperCase().indexOf('HG600') >= 0) {
							LMEPG.mp.upVolume(5);//在当前音量基础上，+5并设置
						}
					}, 1000);
					break;
				default:
					setTimeout(function() {
						LMEPG.mp.initPlayer(); //初始化
						if (TP.platformType == 'hd') {
							LMEPG.mp.playOfSmallscreen(videoUrl, left, top, width, height); //小窗播放
							document.getElementById('default_link').focus();//防止（部分盒子）页面失去焦点
						}
					}, 500);
					break;
			}
		},

		getCurrentPollVideoUrl: function() {
			var ftp_url_json;
			var videoInfo = TP.videoData[0];
			if (videoInfo != null) {
				if (videoInfo.ftp_url instanceof Object) {
					ftp_url_json = videoInfo.ftp_url;
				} else{
					ftp_url_json = JSON.parse(videoInfo.ftp_url);
				}

				if (TP.platformType == 'hd') {
					return ftp_url_json.gq_ftp_url;
				} else{
					return ftp_url_json.bq_ftp_url;
				}
			} else{
				return '';
			}
		},

		playWithIframe: function(videoUrl, left, top, width, height) {
			setTimeout(function() {
				if (!TP.domainUrl) {
					LMEPG.UI.showToast('domainUrl is empty!!!', 3);
					return;
				}
				var info;
				if (TP.lmcid == '640092') {
					var stbDomainUrl = LMEPG.STBUtil.getEPGDomain();
					var prefixObj = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(stbDomainUrl);
					var thirdPlayerUrl = prefixObj.url;
					// left - top - width - height
					info = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(left, top, width, height, videoUrl, prefixObj.isHW);
					TP.domainUrl = thirdPlayerUrl;
				} else{
					info = LMEPG.mp.dispatcherUrl.getUrlWith320092(left, top, width, height, videoUrl);
				}

				var factUrl = TP.domainUrl + info;
				if (typeof LMEPG.Log != 'undefined') {
					LMEPG.Log.debug('AlbumSmallVideo.js ---> playWithIframe factUrl:' + factUrl);
				}
				var mSmallFrame = document.getElementById('smallscreen');
				mSmallFrame.setAttribute('src', factUrl);
				LMEPG.mp.initPlayerByBind();
				document.getElementById('default_link').focus();//防止（部分盒子）页面失去焦点
			}, 500);
		}
	};
	window.onunload = function() {
		if (TP.lmcid == '520094') {
			G('smallscreen').contentWindow.destorySmallPlayer();
		} else{
			LMEPG.mp.destroy();
		}
	};
}());