// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 视频播放 --- 各地区平台播放串获取与转换逻辑提取
// +----------------------------------------------------------------------
// | 说明：
// |    由于不同地区平台的对接不一样，获取相应播放串的方式也不一样。但在前期初
// | 始化、后期播放器播放播放等接口及框架已经封装好，我们只需把中间过程传入
// | MediaPlayer的播放串（或转换后的播放串）以接口形式呈现，应用层逻辑接入调用
// | 即可！
// +----------------------------------------------------------------------
// | 使用：
// |    1. 每个Player.js一开始则先导入当前js！
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/12/10
// +----------------------------------------------------------------------

/*****************************************************************
 * 存储当前播控中的自定义全局通用变量
 *****************************************************************/
var lmPlayUrlFetcher = (function () {
    var clazz = function () {
        var self = this;

        /**
         * 动态创建iframe并返回
         * @return {Element} 返回创建的iframe对象。可能为null或者undefined，上层需要判断。
         */
        var _specialCreateEmptyIframe = function (lmcid) {
            // 注：（再次加强）目前，非指定地区，暂不动态操作该iframe，以避免影响到其它地区的同样使用（需要测试通过才允许）
            if (lmcid !== "650092" && lmcid !== "12650092") {//新疆电信
                lmTVLogPanel.log.e('"_specialCreateEmptyIframe" failed because of no support this area! : ' + lmcid, true);
                return null;
            }

            // 1. 在 <div id="smallvod"></div> 中创建iframe
            // 示例：
            // <div id="smallvod">
            //      <iframe id="smallscreen" name="smallscreen" src="about:blank"
            //              frameborder="0" scrolling="no"
            //              style="width: 0; height: 0; visibility: hidden">
            //      </iframe>
            // </div>
            var iframeContainer = G("smallvod");
            if (!iframeContainer) {
                iframeContainer = document.createElement("div");
                iframeContainer.id = "smallvod";
                if (G("backg")) G("backg").appendChild(iframeContainer);
                else document.body.appendChild(iframeContainer);
            }

            // 2. 创建iframe对象并添加到容器中
            var iframe = G("smallscreen");
            if (iframe) _specialDestroyIframe(lmcid);// if (iframe) lmTVPlayAction.destroyIframe(iframe);

            iframe = document.createElement("iframe");

            // 设置iframe的样式
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "none";
            iframe.style.visibility = "hidden";
            iframe.frameBorder = "0";
            iframe.scrolling = "no";
            iframe.id = "smallscreen";//必须！
            iframe.name = "smallscreen";//必须！
            iframe.src = "about:blank";//空

            // 添加到iframe_container中
            iframeContainer.appendChild(iframe);

            return iframe;
        };

        /**
         *
         * @param iframe
         */
        /**
         * 销毁释放Iframe
         * @param lmcid [string] 平台id
         * @param iframe [IFrame] iframe dom对象
         * @private
         */
        var _specialDestroyIframe = function (lmcid, iframe) {
            // 注：（再次加强）目前，非指定地区，暂不动态操作该iframe，以避免影响到其它地区的同样使用（需要测试通过才允许）
            if (lmcid !== "650092" && lmcid !== "12650092") {//新疆电信
                lmTVLogPanel.log.e('"_specialDestroyIframe" failed because of no support this area! : ' + lmcid, true);
                return;
            }

            lmTVLogPanel.log.i("_specialDestroyIframe");

            if (typeof iframe === "undefined" || iframe == null) iframe = G("smallscreen");
            if (!iframe) return;

            iframe.src = "about:blank";//iframe指向空白页面，这样能够释放大部分内存
            try {
                iframe.contentWindow.document.write("");//清空iframe的内容
                iframe.contentWindow.document.close();//避免iframe内存泄漏
            } catch (e) {
            } finally {
                iframe.parentNode.removeChild(iframe);//把iframe从页面移除
            }
        };

        /**
         * 初始化或转换一些必要的JS参数，一般开头先调用。比如：video_url的协议地址转换等。
         * <pre>已知config参数有：
         *     config = {
         *         mediaCode: "视频注入码或url"
         *     }
         * </pre>
         * @param data [object] 外部参数（可能包含：视频注入码或url），这样可中间处理某些值后面可用。
         * @param callback [function] 初始化设置完毕后，回调通知上层做其它自定义处理。
         *        callback(
         *              carrierId,              // 当前地区码
         *              latestVideoUrl,         // 最新的播放串url（可能是视频注入码或者转换后的其它格式url）
         *        )
         */
        this.initPlayJSParams = function (data, callback) {
            var lmcid = get_carrier_id();
            switch (lmcid) {
                case "000051": // 中国联通
                case "370093": // 山东联通
                    // 将http协议头转化为rtsp
                    data.mediaCode = LMEPG.Func.http2rtsp(data.mediaCode);
                    break;
                case "650092": // 新疆电信
                case "12650092": // 新疆电信天天健身
                    //新疆电信针对华为盒子EC6108V9U_pub_xjxdx获取不到播放器时长：先通过iframe获取getMediastr在进行播放
                    var url = "";
                    var code = data.mediaCode;//媒资id (e.g. "CDWYPro514339651743116122")（lmTVParams.get_v_VideoUrl()）
                    try {
                        var epgDomain = Authentication.CTCGetConfig("EPGDomain");
                        var last = epgDomain.indexOf("/jsp/");
                        var platform;
                        if (last === -1) {
                            last = epgDomain.lastIndexOf("/");
                            url = epgDomain.substr(0, last);
                            url += "/MediaService/SmallScreen";
                            platform = "ZTE";
                        } else {
                            url = epgDomain.substr(0, last);
                            url += "/MediaService/SmallScreen.jsp";
                            platform = "HW";
                        }
                        url += "?ContentID=" + code + "&Left=0&Top=0&Width=0&Height=0&CycleFlag=0&GetCntFlag=1";
                        if (platform === "HW") {
                            url += "&ReturnURL=" + encodeURIComponent(document.referrer);
                        }
                    } catch (e) {
                        url = "";
                    }

                    data.iframeUrl = url;
                    var iframe = _specialCreateEmptyIframe(lmcid);
                    if (iframe) iframe.setAttribute("src", url);
                    break;
            }

            if (typeof callback !== "undefined" && callback != null) {
                LMEPG.call(callback);
            }
        };

        /**
         * 初始化播放器：需要使用的第三方播放器前缀地址，即domainUrl有效才可调用该方法。
         * <pre style='color:yellow;'>调用示例：
         *     getIFramePlayUrlWithDomainUrl(lmcid, thidrDomainUrl, function(carrierId,mediaCode,iframePlayUrl) {
         *          // 自定义实现后续逻辑。例如：
         *          G("smallscreen").setAttribute("src", iframePlayUrl);
         *          LMEPG.mp.initPlayerByBindWithCustomUI();
         *     });
         * </pre>
         * @param lmcid [string] 当前地区平台id
         * @param mediaCode [string] 传入播放地址(注入码或url)
         * @param thirdDomainUrl [string] 第三方播放器根路径地址。
         * @param callback [function] 根据第三方播放器根路径地址组装真实的播放串url，回调通知上层做其它自定义处理。
         *        callback(
         *              carrierId,              // 当前地区码
         *              mediaCode,              // 原始媒资id（可能是视频注入码或者转换后的其它格式url）
         *              iframePlayUrl,          // 根据第三方播放器根路径拼接后，传入iFrame里src的地址。
         *       )
         */
        this.getIFramePlayUrlWithDomainUrl = function (lmcid, mediaCode, thirdDomainUrl, callback) {
            lmTVLogPanel.log.i("getIFramePlayUrlWithDomainUrl: " + thirdDomainUrl);

            if (!LMEPG.Func.array.contains(lmcid, [/*"630092",*/ "650092"])) {
                // 除了（青海电信/新疆电信/）
                // TODO 暂时看不明白为什么要判断？
                // if (!LMEPG.Func.isEmpty(thirdDomainUrl)) {
                //     return;
                // }
            }

            setTimeout(function () {

                var location = I_HD() ? [0, 0, 1280, 720] : [0, 0, 644, 530]; //高清HD/标清SD - 不同模式下的坐标宽高：[left,top,width,height]
                var player_relativeUrl = ""; //不同地区的播放串
                var player_thirdPlayPrefix = thirdDomainUrl;//默认用提供的前缀！特殊地区再根据接口拼接！

                switch (lmcid) {
                    case "350092"://福建电信
                        player_relativeUrl = LMEPG.mp.dispatcherUrl.getUrlWith350092(location[0], location[1], location[2], location[3], mediaCode);
                        break;
                    case "640092"://宁夏电信
                        player_relativeUrl = LMEPG.mp.dispatcherUrl.getFullScreenUrlWith640092(mediaCode);
                        break;
                    case "630092"://青海电信
                        var prefixObj_630092 = LMEPG.mp.dispatcherUrl.getUrlWith630092PrefixObj(LMEPG.STBUtil.getEPGDomain());
                        player_thirdPlayPrefix = prefixObj_630092.url;
                        player_relativeUrl = LMEPG.mp.dispatcherUrl.getUrlWith630092(location[0], location[1], location[2], location[3], mediaCode, prefixObj_630092.isHW);
                        break;
                    case "650092"://新疆电信
                    case "12650092"://新疆电信天天健身
                        var prefixObj_650092 = LMEPG.mp.dispatcherUrl.getUrlWith650092PrefixObj(LMEPG.STBUtil.getEPGDomain());
                        player_thirdPlayPrefix = prefixObj_650092.url;
                        player_relativeUrl = LMEPG.mp.dispatcherUrl.getUrlWith650092Suffix(location[0], location[1], location[2], location[3], mediaCode, prefixObj_650092.isHW);
                        break;
                    case "320092"://江苏电信
                        player_relativeUrl = LMEPG.mp.dispatcherUrl.getUrlWith320092(location[0], location[1], location[2], location[3], mediaCode);
                        break;
                    default:
                        player_relativeUrl = LMEPG.mp.dispatcherUrl.getUrlWith320092(location[0], location[1], location[2], location[3], mediaCode);
                        break;
                }

                // 最终，回调上层按需处理，不在当前类处理！
                var iframePlayUrl = player_thirdPlayPrefix + player_relativeUrl;
                lmTVLogPanel.log.i("[拼接第三方后url]：" + iframePlayUrl);

                if (typeof callback === "function") {
                    callback(lmcid, mediaCode, iframePlayUrl);
                    /*-回调上层调用示例：
                     * G("smallscreen").setAttribute("src", iframePlayUrl);
                     * LMEPG.mp.initPlayerByBindWithCustomUI(); // 具有自定义音量UI的初始化必须使用该方法！
                     */
                }
            }, 500);
        };

        /**
         * 异步获取（所有平台）- “最终提供给底层MediaPlayer的播放串url”，以启动MediaPlayer播放。
         * @param mediaCode [string] 注入视频id
         * @param successCallback [function] 成功回调 - successCallback(carrierId, mediaCode, isPlayWithIframe, finalPlayUrl(或iframePlayUrl), extraData[更多信息对象，用于某些平台ajax获取数据后再实行自己逻辑])
         * @param failCallback [function] 失败回调 - failCallback(carrierId, mediaCode, isPlayWithIframe, errorMsg)
         */
        this.fetchPlayUrl = function (mediaCode, successCallback, failCallback) {
            var lmcid = get_carrier_id();
            var domainUrl = LMEPG.Func.getAppBusinessValue("domainUrl");
            var fnSuccess = function (finalPlayUrl, extraData, isPlayWithIframe) {
                if (Object.prototype.toString.call(extraData) !== "[object Object]") {
                    extraData = {};//构建默认传递，避免上层更多冗余判断！
                }
                // LMEPG.Log.error("getPlayUrl---> " + finalPlayUrl);
                LMEPG.call(successCallback, [lmcid, mediaCode, !!isPlayWithIframe, finalPlayUrl, extraData]);
            };
            var fnFailed = function (errorMsg, isPlayWithIframe) {
                LMEPG.call(failCallback, [lmcid, mediaCode, !!isPlayWithIframe, errorMsg]);
            };

            switch (lmcid) {
                case "320092"://江苏电信
                case "450092"://广西电信
                case "630092"://青海电信
                case "350092"://福建电信
                case "640092"://宁夏电信
                    self.getIFramePlayUrlWithDomainUrl(lmcid, mediaCode, domainUrl, function (carrierId, mediaCode, iframePlayUrl) {
                        fnSuccess(iframePlayUrl, null, true);
                    });
                    break;
                case "650092"://新疆电信
                case "12650092": // 新疆电信天天健身
                    fnSuccess(mediaCode); //特别注意：应用层应该使用iframe.getMediastr获取串再播放！这种方式更兼容所有盒子~~
                    break;
                case "000051"://中国联通
                    fnSuccess(mediaCode);
                    break;
                case "220094"://吉林广电（联通）
                case "10220094"://吉林广电（联通）魔方
                    self.urlMaster.getPlayUrl220094(mediaCode, fnSuccess, fnFailed);
                    break;
                case "220095"://吉林广电（电信）
                case "10220095"://吉林广电（电信）魔方
                    self.urlMaster.getPlayUrl220095(mediaCode, fnSuccess, fnFailed);
                    break;
                case "510094"://四川广电
                    self.urlMaster.getPlayUrl510094(mediaCode, fnSuccess, fnFailed);
                    break;
                case "440094"://广东广电
                    self.urlMaster.getPlayUrl440094(mediaCode, fnSuccess, fnFailed);
                    break;
                default:
                    fnSuccess(mediaCode);
                    break;
            }

            return "";
        };

        /**
         * 通过“注入视频ID”，根据各平台提供接口获取真正播放地址url。
         */
        this.urlMaster = {

            /** “吉林广电（联通）” - 获取真实播放串（mediaCode-注入视频id，fnSuccess-成功回调，fnFailed-失败回调）*/
            getPlayUrl220094: function (mediaCode, fnSuccess, fnFailed) {
                if (LMEPG.Func.isEmpty(mediaCode)) {
                    LMEPG.call(fnFailed, ["无效的视频ID"]);
                    return;
                }
                try {
                    if (typeof window.top.jk39 !== "undefined" && window.top.jk39 !== null && window.top.jk39.fetchPlayData !== undefined) {
                        lmTVLogPanel.log.i(LMEPG.Func.string.format("[吉林联通debug][window.top.jk39.PLAYTYPE.vod={0}]--mediaCode:{1}", [window.top.jk39.PLAYTYPE.vod, mediaCode]));
                        window.top.jk39.fetchPlayData({
                                type: window.top.jk39.PLAYTYPE.vod, //播放视频类型，玛朗39健康的默认vod
                                contentId: mediaCode, //节目ID，即注入的视频code
                                breakpoint: "0", //开始播放时间，可选，默认为0
                                categoryId: "", //栏目ID，可选
                                callback: function (playUrl, videoName) {
                                    lmTVLogPanel.log.i(LMEPG.Func.string.format("[吉林联通debug][返回URL={0}]",[playUrl]));
                                    LMEPG.call(fnSuccess, [playUrl, /*更多附加*/{
                                        mediaCode: mediaCode,
                                        playUrl: playUrl,
                                        name: videoName,
                                        desc: "220094 - 吉林广电（联通）",
                                    }]);
                                    /*-上层调用示例：
                                     * LMEPG.mp.initPlayerMode1().playOfFullscreen(playUrl).play();
                                     */
                                }
                            }
                        );
                    } else {
                        LMEPG.call(fnFailed, ['getPlayUrl--->No "window.top.jk39.fetchPlayData" function!']);
                    }
                } catch (e) { //保护兼容
                    LMEPG.Log.error("getPlayUrl--->Exception: " + e.toString());
                    LMEPG.call(fnFailed, ["获取播放地址发生异常！"]);
                }
            },

            /** “吉林广电（电信）” - 获取真实播放串（mediaCode-注入视频id，fnSuccess-成功回调，fnFailed-失败回调）*/
            getPlayUrl220095: function (mediaCode, fnSuccess, fnFailed) {
                if (LMEPG.Func.isEmpty(mediaCode)) {
                    LMEPG.call(fnFailed, ["无效的视频ID"]);
                    return;
                }
                try {
                    if (typeof window.top.bestv !== "undefined" && window.top.bestv !== null && window.top.bestv.fetchPlayData !== undefined) {
                        window.top.bestv.fetchPlayData({
                                type: window.top.bestv.PLAYTYPE.vod, //播放视频类型，玛朗39健康的默认vod
                                contentId: mediaCode, //节目ID，即注入的视频code
                                breakpoint: "0", //开始播放时间，可选，默认为0
                                categoryId: "", //栏目ID，可选
                                callback: function (playUrl, videoName) {
                                    LMEPG.call(fnSuccess, [playUrl, /*更多附加*/{
                                        mediaCode: mediaCode,
                                        playUrl: playUrl,
                                        name: videoName,
                                        desc: "220095 - 吉林广电（电信）",
                                    }]);
                                    /*-上层调用示例：
                                     * LMEPG.mp.initPlayerMode1().playOfFullscreen(playUrl).play();
                                     */
                                }
                            }
                        );
                    } else {
                        LMEPG.call(fnFailed, ['getPlayUrl--->No "window.top.bestv.fetchPlayData" function!']);
                    }
                } catch (e) { //保护兼容
                    LMEPG.Log.error("getPlayUrl--->Exception: " + e.toString());
                    LMEPG.call(fnFailed, ["获取播放地址发生异常！"]);
                }
            },

            /** “四川广电” - 获取真实播放串（mediaCode-注入视频id，fnSuccess-成功回调，fnFailed-失败回调）*/
            getPlayUrl510094: function (mediaCode, fnSuccess, fnFailed) {
                if (typeof window.SCGDPlayer === "object") {
                    window.SCGDPlayer.getMediaPlayUrl(mediaCode, function (playUrl, data) {
                        LMEPG.mp.setMediaDuration(data.duration);// 注：四川广电获取不到时长，需要从媒资详情获取填充！
                        LMEPG.call(fnSuccess, [playUrl, /*更多附加*/{
                            mediaCode: mediaCode,
                            playUrl: playUrl,
                            data: data,
                            duration: data.duration,
                            desc: "220095 - 吉林广电（电信）",
                        }]);
                        /*-上层调用示例：
                         * LMEPG.mp.setMediaDuration(data.duration);
                         * LMEPG.mp.initPlayerByBind().playOfFullscreen(playUrl)
                         */
                    }, function (errorMsg) {
                        LMEPG.call(fnFailed, [errorMsg]); //应用层应当退出返回
                    });
                } else {
                    LMEPG.call(fnFailed, ["初始化失败！3秒后退出..."]); //应用层应当退出返回
                }
            },

            /** “广东广电” - 获取真实播放串（mediaCode-注入视频id，fnSuccess-成功回调，fnFailed-失败回调）*/
            getPlayUrl440094: function (mediaCode, fnSuccess, fnFailed) {
                if (typeof window.UtilsWithGDGD === "object") {
                    window.UtilsWithGDGD.getPlayUrl(mediaCode, function (isSuccess, playUrl) {
                        printLog("getPlayUrl440094 ---- playUrl:" + playUrl);
                        if (isSuccess) {
                            LMEPG.call(fnSuccess, [playUrl, /*更多附加*/{
                                mediaCode: mediaCode,
                                playUrl: playUrl,
                                // duration: data.duration,
                                desc: "440094 - 广东广电",
                            }]);
                            /*-上层调用示例：
                             * //LMEPG.mp.setMediaDuration(data.duration);
                             * LMEPG.mp.initPlayer().playOfFullscreen(playUrl)
                             * //lmTVPlayAction.getVideoInfo440094(mediaCode);//获取视频信息
                             */
                        } else {
                            LMEPG.call(fnFailed, [playUrl/*TODO 作为失败描述了，需要规范*/]);
                        }
                    });
                } else {
                    LMEPG.call(fnFailed, ["初始化失败！window.UtilsWithGDGD对象不存在..."]);
                }
            },

        }; // #Endof $urlMaster

    };
    return new clazz();
})();