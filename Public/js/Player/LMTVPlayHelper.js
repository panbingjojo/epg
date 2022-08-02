// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 全屏大窗播控 --- 部分非业务高耦合逻辑代码提取
// +----------------------------------------------------------------------
// | 说明：
// |    由于不同地区平台的细化需求不一样，就会产生不一样UI，从而导致相关的UI交
// | 互操作可能有细微差别。但除此外，其它中间交互业务逻辑基本一致。故提取此类通
// | 用方法，以回调方式交给具体的上层去处理后续逻辑（例如：如何展示UI、如何提示
// | ……）
// +----------------------------------------------------------------------
// | 使用：
// |    1. 每个Player.js一开始则先导入当前js！
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/12/10
// +----------------------------------------------------------------------

// 调试日志开关(1开启 0关闭)。正式线上，请改为0！
var debug_mode = 0;

/** 统一DEBUG日志打印 */
function printLog(msg, errorLevel) {
    var tag = typeof window.TAG_NAME !== "string" ? "" : window.TAG_NAME;
    var logMsg = "[播放器日志][" + tag + "]--->" + msg;
    if (errorLevel === true) {
        console.error(logMsg);
        LMEPG.Log.error(logMsg);
    } else {
        console.log(logMsg);
        LMEPG.Log.info(logMsg);
    }
}

// TODO 通过Class类查找元素对象
function printObjInfo(obj, tag) {
    var strInfo = 'TAG->' + tag;
    try {
        if (typeof obj !== 'undefined' || obj) {
            strInfo = strInfo + ' ----> object[';
            for (var key in obj) {
                var strValue = key + '->';
                if (typeof (obj[key]) == 'function') {
                    strValue = strValue + 'function'; //+ obj[key];
                } else {
                    strValue = strValue + obj[key];
                }
                strValue = strValue + ',';
                strInfo = strInfo + strValue;
            }
            strInfo = strInfo + ']';
        } else {
            strInfo = strInfo + 'is null or undefined]';
        }
    } catch (e) {
        strInfo += '-->Exception: ' + e.toString();
    }
    return strInfo;
}

/*****************************************************************
 * 日志打印调试面板
 *****************************************************************/
var lmTVLogPanel = (function () {
    // 代码动态创建和初始化 debug1 及其style，并返回一个HTMLElement的对象
    var checkAndInitDebug1 = function () {
        var htmlEle = window.lmdebug1; //缓存结果，减少频繁查询！
        if (typeof htmlEle === "undefined" || htmlEle == null) {
            var setCssStyle = function (htmlEleDiv) {
                htmlEleDiv.style.position = "absolute";
                htmlEleDiv.style.left = "0px";
                htmlEleDiv.style.top = "0px";
                htmlEleDiv.style.width = "100%";
                htmlEleDiv.style.height = "auto";
                htmlEleDiv.style.wordWrap = "break-word";
                htmlEleDiv.style.zIndex = "100";
                htmlEleDiv.style.fontSize = I_HD() ? "20px" : "12px";
                htmlEleDiv.style.color = "#FF0000";
                htmlEleDiv.style.border = "1px solid #FF0000";
                htmlEleDiv.style.border = "none";
                htmlEleDiv.style.display = "none";
                return htmlEleDiv;
            };
            var idName = "debug1";
            htmlEle = G(idName);
            if (typeof htmlEle === "undefined" || htmlEle == null) {
                htmlEle = document.createElement("div");
                htmlEle.id = idName;
                htmlEle = setCssStyle(htmlEle);
                document.body.appendChild(htmlEle);
            } else {
                htmlEle = setCssStyle(htmlEle);
            }
            window.lmdebug1 = htmlEle;
        }
        return htmlEle;
    };

    // 代码动态创建和初始化 debug2 及其style，并返回一个HTMLElement的对象
    var checkAndInitDebug2 = function () {
        var htmlEle = window.lmdebug2; //缓存结果，减少频繁查询！
        if (typeof htmlEle === "undefined" || htmlEle == null) {
            var setCssStyle = function (htmlEleDiv) {
                htmlEleDiv.style.position = "absolute";
                htmlEleDiv.style.left = "0px";
                htmlEleDiv.style.top = I_HD() ? "220px"/*172px*/ : "160px" /*140px*/;
                htmlEleDiv.style.width = "100%";
                htmlEleDiv.style.height = "auto";
                htmlEleDiv.style.maxHeight = "50%";
                htmlEleDiv.style.wordWrap = "break-word";
                htmlEleDiv.style.zIndex = "100";
                htmlEleDiv.style.fontSize = I_HD() ? "20px" : "12px";
                htmlEleDiv.style.color = "#48BB31";
                htmlEleDiv.style.border = "1px solid #FFFF00";
                htmlEleDiv.style.overflow = "auto";
                htmlEleDiv.style.display = "none";
                return htmlEleDiv;
            };
            var idName = "debug2";
            htmlEle = G(idName);
            if (typeof htmlEle === "undefined" || htmlEle == null) {
                htmlEle = document.createElement("div");
                htmlEle.id = idName;
                htmlEle = setCssStyle(htmlEle);
                document.body.appendChild(htmlEle);
            } else {
                htmlEle = setCssStyle(htmlEle);
            }

            window.lmdebug2 = htmlEle;
        }
        return htmlEle;
    };

    // 调试信息（1）
    var logPanel1 = function (msg) {
        // 非调试模式，不开启屏幕日志
        if (!debug_mode) return;

        var domDebug = checkAndInitDebug1();
        if (!domDebug || typeof RenderParam !== "object") {
            return;
        }

        var _userType = parseInt(RenderParam.userType);
        var _playUserTypeStr = _userType === 2 ? "仅限VIP用户观看" : _userType === 1 ? "普通用户可观看" : "不限用户";//0-不限，1-普通用户可看，2-仅限VIP用户可看（普通用户需要检查免费时长）
        var _areaCode = get_area_code() !== "" ? "(" + get_area_code() + ")" : "";

        // 创建html
        var htmlStr = '';
        var legendStyle = I_HD() ?
            'color: white; margin-left: 10px; background-color: #FF0000; border-radius: 3px; padding:1px 2px;font-size: 15px' :
            'color: white; margin-left: 8px; background-color: #FF0000; border-radius: 2px; padding:1px 1px;font-size: 10px';
        var tb1_Style = I_HD ? 'padding: 5px;' : 'padding: 2px;';
        var tb2_Style = I_HD ? 'padding: 5px;' : 'padding: 2px;';
        var tb1_tdStyle = 'white-space: nowrap; padding:1px';
        var tb2_tdStyle = 'white-space: nowrap; padding:1px';
        var tb1_td1_bg = '#00000000';//'#FFFFFF';
        var tb1_td2_bg = '#00000000';//'#FFFFCC';
        var tb2_td1_bg = '#00000000';
        var tb2_td2_bg = '#00000000';

        htmlStr += '<form>';
        htmlStr += '<fieldset style="border: 1px solid #ff0000;">';
        htmlStr += '<legend style="' + legendStyle + ';">基本信息(v2020.01 by hsong)</legend>';

        // 基本信息
        htmlStr += '<table width="100%" cellspacing="1px" style="' + tb1_Style + '">';
        htmlStr += '    <tr>';
        htmlStr += '        <td width="10%" bgcolor="' + tb1_td1_bg + '" style="' + tb1_tdStyle + '">地区编号：</td><td width="20%" bgcolor="' + tb1_td2_bg + '" style="' + tb1_tdStyle + '">' + get_carrier_id() + _areaCode + '</td>';
        htmlStr += '        <td width="10%" bgcolor="' + tb1_td1_bg + '" style="' + tb1_tdStyle + '">STB型号：</td><td width="20%" bgcolor="' + tb1_td2_bg + '" style="' + tb1_tdStyle + '">' + (LMEPG.STBUtil.getSTBModel() + (I_HD() ? '（高清）' : '（标清）')) + '</td>';
        htmlStr += '        <td width="10%" bgcolor="' + tb1_td1_bg + '" style="' + tb1_tdStyle + '">用户ID：</td><td width="20%" bgcolor="' + tb1_td2_bg + '" style="' + tb1_tdStyle + '">' + RenderParam.userId + '</td>';
        htmlStr += '    </tr>';
        htmlStr += '    <tr>';
        htmlStr += '        <td width="10%" bgcolor="' + tb1_td1_bg + '" style="' + tb1_tdStyle + '">业务账号：</td><td width="20%" bgcolor="' + tb1_td2_bg + '" style="' + tb1_tdStyle + '">' + RenderParam.accountId + '</td>';
        htmlStr += '        <td width="10%" bgcolor="' + tb1_td1_bg + '" style="' + tb1_tdStyle + '">是否VIP：</td><td width="20%" bgcolor="' + tb1_td2_bg + '" style="' + tb1_tdStyle + '">' + (!!RenderParam.isVip ? '是' : '否') + '</td>';
        htmlStr += '        <td width="10%" bgcolor="' + tb1_td1_bg + '" style="' + tb1_tdStyle + '">播放策略[' + RenderParam.userType + ']：</td><td width="20%" bgcolor="' + tb1_td2_bg + '" style="' + tb1_tdStyle + '">' + _playUserTypeStr + '</td>';
        htmlStr += '    </tr>';
        htmlStr += '</table>';
        // 分隔线
        htmlStr += '<div class="debug-divider" style="width:100%;height:1px;background-color:red;margin: 0px 0"></div>';
        // 视频信息
        htmlStr += '<table width="100%" cellspacing="1px" style="' + tb2_Style + '">';
        htmlStr += '    <tr>';
        htmlStr += '        <td width="11%" bgcolor="' + tb2_td1_bg + '" style="' + tb2_tdStyle + '">视频标题：</td><td width="auto" bgcolor="' + tb2_td2_bg + '" style="' + tb2_tdStyle + '">' + lmTVParams.get_v_VideoTitle() + '[' + lmTVParams.get_v_SourceId() + ']' + '</td>';
        htmlStr += '    </tr>';
        htmlStr += '    <tr>';
        htmlStr += '        <td width="11%" bgcolor="' + tb2_td1_bg + '" style="' + tb2_tdStyle + '">视频地址：</td><td width="auto" bgcolor="' + tb2_td2_bg + '" style="' + tb2_tdStyle + '">' + lmTVParams.get_v_VideoUrl() + '</td>';
        htmlStr += '    </tr>';
        htmlStr += '    <tr>';
        htmlStr += '        <td width="11%" bgcolor="' + tb2_td1_bg + '" style="' + tb2_tdStyle + '">免费试看：</td><td width="auto" bgcolor="' + tb2_td2_bg + '" style="' + tb2_tdStyle + '">' + lmTVParams.get_v_FreeSeconds() + '秒</td>';
        htmlStr += '    </tr>';
        htmlStr += '</table>';
        // 播放状态
        htmlStr += '<div class="debug-divider" style="width:100%;height:1px;background-color:red;margin: 0px 0"></div>';// 分隔线
        htmlStr += '<div style="padding: 2px 20px 2px 2px; color: #FFFF00; text-align: right">' + (typeof msg === "string" && msg !== "" ? msg : "请稍后，视频正在加载中...") + '</div>';

        htmlStr += '</fieldset>';
        htmlStr += '</form>';

        domDebug.style.backgroundColor = '#000000';
        domDebug.style.opacity = '0.8';
        domDebug.style.display = 'block';
        domDebug.innerHTML = htmlStr;
    };

    // 调试信息（2）
    var logPanel2 = function (msg, color, isWriteToDisk) {
        // 选择性写入磁盘日志，方便问题跟踪
        if (!!isWriteToDisk) printLog(msg);

        // 非调试模式，不开启屏幕日志
        if (!debug_mode) return;

        var domDebug = checkAndInitDebug2();
        if (!domDebug) return;
        if (!domDebug.innerHTML) domDebug.innerHTML = '';

        domDebug.style.backgroundColor = '#000000';
        domDebug.style.opacity = '0.8';
        domDebug.style.display = 'block';
        domDebug.innerHTML = (domDebug.innerHTML ? domDebug.innerHTML + '<br/>' : '') + '<span style="color: ' + color + '">→ ' + msg + '</span>';
        domDebug.scrollTop = domDebug.scrollHeight;
    };

    var logPanelObj = function () {
        var self = this;
        var lowestLevel = -1; // 过滤筛选某些level级别的日志（默认全级别打印）

        /**
         * 日志级别
         * @type {{a: number, d: number, e: number, v: number, w: number, i: number, none: number}}
         */
        this.logLevel = {
            none: -1,
            v: 0,
            d: 1,
            i: 2,
            w: 3,
            e: 4,
            a: 5,
        };

        /**
         * 打印基本信息（平台、用户、视频等）
         */
        this.logBasicInfo = function (msg) {
            logPanel1(msg);
        };

        /**
         * 其它日志跟踪打印
         */
        this.log = (function () {
            return {
                v: function (msg, isWriteToDisk) {
                    if (lowestLevel < self.logLevel.v) logPanel2(msg, "#BBBBBB", isWriteToDisk);
                },
                d: function (msg, isWriteToDisk) {
                    if (lowestLevel < self.logLevel.d) logPanel2(msg, "#0070BB", isWriteToDisk);
                },
                i: function (msg, isWriteToDisk) {
                    if (lowestLevel < self.logLevel.i) logPanel2(msg, "#48BB31", isWriteToDisk);
                },
                w: function (msg, isWriteToDisk) {
                    if (lowestLevel < self.logLevel.w) logPanel2(msg, "#BBBB23", isWriteToDisk);
                },
                e: function (msg, isWriteToDisk) {
                    if (lowestLevel < self.logLevel.e) logPanel2(msg, "#FF0006", isWriteToDisk);
                },
                a: function (msg, isWriteToDisk) {
                    if (lowestLevel < self.logLevel.a) logPanel2(msg, "#8F0005", isWriteToDisk);
                },
                /** 指定过滤指定级别以上（不包含）的日志 */
                filter: function (aboveLevel) {
                    if (aboveLevel === self.logLevel.none) lowestLevel = aboveLevel;
                    else if (typeof aboveLevel === "number" && aboveLevel > 0) lowestLevel = aboveLevel;
                },
            }
        })();
    };
    return new logPanelObj();
})();

/*****************************************************************
 * 仅适用于引用当前js框架，仅基本的通用页面跳转控制
 * 注：若涉及其它的跳转，请在具体页面声明，不该继续耦合在当前js里了~
 * @author: Songhui
 * @date: 2019/12/10
 *****************************************************************/
var Page = {

    /**
     * 得到当前页对象
     * @param videoInfo [object] 当前视频信息
     */
    getCurrentPage: function (videoInfo) {
        // 1、提供最新的，则直接使用。
        if (!LMEPG.Func.isObject(videoInfo)) {
            // 2、尝试从当前全局更新的 lmTVParams 中获取。
            videoInfo = lmTVParams.get_v_VideoInfo();
            if (!LMEPG.Func.isObject(videoInfo)) {
                // 3、尝试从当前前端页声明的 RenderParam.videoInfo 获取。
                videoInfo = LMEPG.Func.getAppBusinessValue("videoInfo", function () {
                    LMEPG.Log.error("警告：拿不到当前播放的视频信息！");
                    return {}; //未取到则提供一个默认的空对象，避免后续的报错！
                });
            }
        }
        var objCurrent = LMEPG.Intent.createIntent("player");
        objCurrent.setParam("videoInfo", JSON.stringify(videoInfo));
        return objCurrent;
    },

    /**
     * 页面跳转 - 播放器
     * @param videoInfo [object] 当前视频信息
     */
    jumpPlayVideo: function (videoInfo) {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("player");
        objDst.setParam("videoInfo", JSON.stringify(videoInfo));
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 页面跳转 -  购买vip页
     * @param remark [string] 订购备注
     * @param videoInfo [object] 当前视频信息
     */
    jumpBuyVip: function (remark, videoInfo) {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("orderHome");
        objDst.setParam("isPlaying", "1");
        objDst.setParam("remark", remark);
        objDst.setParam("videoInfo", JSON.stringify(videoInfo));
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /** 页面跳转 - 专辑 */
    jumpAlbum: function (albumName) {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("album");
        objDst.setParam("albumName", albumName);
        objDst.setParam("atFreeTime", 1);
        objDst.setParam("inner", 1);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
};

/*****************************************************************
 * 统一接口定义：播放控制
 *----------------------------------------------------------------
 * 注：若业务层需要，切不可更改命名空间，直接覆写相关方法逻辑即可！
 *----------------------------------------------------------------
 * @author: Songhui
 * @date: 2019/12/10
 *****************************************************************/
var lmPlayAPI = {

    /*--------------------------------------------*
     * 物理功能按键（播控相关）
     *--------------------------------------------*/

    /**
     * 快进
     */
    doFastForward: function () {
        lmTVLogPanel.log.v("[lmPlayAPI]: doFastForward");
        var state = LMEPG.mp.getPlayerState();
        switch (state) {
            case LMEPG.mp.State.PLAY:
            case LMEPG.mp.State.FAST_REWIND:
            case LMEPG.mp.State.FAST_FORWARD:
            case LMEPG.mp.State.PAUSE:
                if (state === LMEPG.mp.State.PAUSE) {
                    lmPlayUIAPI.withPauseCancelled();
                }
                LMEPG.mp.fastForward();
                lmPlayUIAPI.withFastForward(
                    LMEPG.mp.getPlayerState(),
                    LMEPG.mp.isSpeedResumed(),
                    LMEPG.mp.getCurrentPlayTime()
                );
                break;
        }
    },

    /**
     * 快退
     */
    doFastRewind: function () {
        lmTVLogPanel.log.v("[lmPlayAPI]: doFastRewind");
        var state = LMEPG.mp.getPlayerState();
        switch (state) {
            case LMEPG.mp.State.PLAY:
            case LMEPG.mp.State.FAST_REWIND:
            case LMEPG.mp.State.FAST_FORWARD:
            case LMEPG.mp.State.PAUSE:
                if (state === LMEPG.mp.State.PAUSE) {
                    lmPlayUIAPI.withPauseCancelled();
                }
                LMEPG.mp.fastRewind();
                lmPlayUIAPI.withFastRewind(
                    LMEPG.mp.getPlayerState(),
                    LMEPG.mp.isSpeedResumed(),
                    LMEPG.mp.getCurrentPlayTime()
                );
                break;
        }
    },

    /**
     * 暂停播放
     */
    doPause: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPause");
        // 非挽留页情况：快进/快退 ---> 正常倍速恢复 （正常播放，则无须重复操作）
        if (LMEPG.Func.array.contains(LMEPG.mp.getPlayerState(), [LMEPG.mp.State.PLAY, LMEPG.mp.State.PAUSE, LMEPG.mp.State.FAST_REWIND, LMEPG.mp.State.FAST_FORWARD])) {
            lmTVLogPanel.log.i('按下“暂停键”：[当前状态:' + LMEPG.mp.getPlayerState() + ']->启动暂停...');
            LMEPG.mp.pause();
            lmPlayUIAPI.withPause();
        } else {
            lmTVLogPanel.log.i('按下“暂停键”：[当前状态:' + LMEPG.mp.getPlayerState() + ']->无效暂停！');
        }
    },

    /**
     * 恢复播放
     */
    doPlay: function () {

        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPlay");
        // 非挽留页情况：快进/快退 ---> 正常倍速恢复 （正常播放，则无须重复操作）
        if (LMEPG.Func.array.contains(LMEPG.mp.getPlayerState(), [LMEPG.mp.State.PAUSE, LMEPG.mp.State.FAST_REWIND, LMEPG.mp.State.FAST_FORWARD])) {
            lmTVLogPanel.log.i('按下“播放键”：[当前状态:' + LMEPG.mp.getPlayerState() + ']->启动恢复...');
            LMEPG.mp.resume();
            lmPlayUIAPI.withResume();
        } else {
            lmTVLogPanel.log.i('按下“播放键”：[当前状态:' + LMEPG.mp.getPlayerState() + ']->无效恢复！');
        }
    },

    /**
     * 停止播放
     */
    doStop: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doStop");
        lmPlayUIAPI.withStop();
    },

    /**
     * 恢复播放
     */
    doResume: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doResume");
        // 非挽留页情况：快进/快退 ---> 正常倍速恢复 （正常播放，则无须重复操作）
        if (LMEPG.Func.array.contains(LMEPG.mp.getPlayerState(), [LMEPG.mp.State.PAUSE, LMEPG.mp.State.FAST_REWIND, LMEPG.mp.State.FAST_FORWARD])) {
            lmTVLogPanel.log.i('按下“播放键”：[当前状态:' + LMEPG.mp.getPlayerState() + ']->启动恢复...');
            LMEPG.mp.resume();
            lmPlayUIAPI.withResume();
        } else {
            lmTVLogPanel.log.i('按下“播放键”：[当前状态:' + LMEPG.mp.getPlayerState() + ']->无效恢复！');
        }
    },

    /**
     * 重播（播放新一条视频）前置操作
     * <pre>videoInfoJson示例：
     *      {
     *          "sourceId": "10481",                            //视频编码
     *          "videoUrl": "rtsp://202.99.114.93/88888891/16/20180828/270241467/270241467.ts", //视频播放串或注入id
     *          "title": "怎么判断孩子是不是真的肥胖？",          //视频标题
     *          "userType": "2",                                //播放策略（0-不限，1-普通用户可看, 2-vip可看）
     *          "freeSeconds": "30",                            //免费试看时长（秒）
     *          "unionCode": "gylm901",                         //TODO 待注释
     *          "type": "",                                     //TODO 待注释
     *          "entryType": 1,                                 //TODO 待注释
     *          "entryTypeName": "play",                        //TODO 待注释
     *          "collectStatus": "1",                           //是否收藏（0-已收藏 1-未收藏）
     *      }
     * </pre>
     * @param isReplay [boolean] 是否重播。true-重播当前视频 false-播放另外一条新视频
     * @param videoInfoJson [object] 重播或新播放视频json对象。参数格式，严格遵循示例。
     */
    doReplayBefore: function (isReplay, videoInfoJson) {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doReplayBefore");
    },

    /**
     * 重播（播放新一条视频）后置操作
     * <pre>videoInfoJson示例：
     *      {
     *          "sourceId": "10481",                            //视频编码
     *          "videoUrl": "rtsp://202.99.114.93/88888891/16/20180828/270241467/270241467.ts", //视频播放串或注入id
     *          "title": "怎么判断孩子是不是真的肥胖？",          //视频标题
     *          "userType": "2",                                //播放策略（0-不限，1-普通用户可看, 2-vip可看）
     *          "freeSeconds": "30",                            //免费试看时长（秒）
     *          "unionCode": "gylm901",                         //TODO 待注释
     *          "type": "",                                     //TODO 待注释
     *          "entryType": 1,                                 //TODO 待注释
     *          "entryTypeName": "play",                        //TODO 待注释
     *          "collectStatus": "1",                           //是否收藏（0-已收藏 1-未收藏）
     *      }
     * </pre>
     * @param isReplay [boolean] 是否重播。true-重播当前视频 false-播放另外一条新视频
     * @param videoInfoJson [object] 重播或新播放视频json对象。参数格式，严格遵循示例。
     */
    doReplayAfter: function (isReplay, videoInfoJson) {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doReplayAfter");
    },

    /**
     * 重播（播放新一条视频）真正执行操作！！！
     * <pre>videoInfoJson示例：
     *      {
     *          "sourceId": "10481",                            //视频编码
     *          "videoUrl": "rtsp://202.99.114.93/88888891/16/20180828/270241467/270241467.ts", //视频播放串或注入id
     *          "title": "怎么判断孩子是不是真的肥胖？",          //视频标题
     *          "userType": "2",                                //播放策略（0-不限，1-普通用户可看, 2-vip可看）
     *          "freeSeconds": "30",                            //免费试看时长（秒）
     *          "unionCode": "gylm901",                         //TODO 待注释
     *          "type": "",                                     //TODO 待注释
     *          "entryType": 1,                                 //TODO 待注释
     *          "entryTypeName": "play",                        //TODO 待注释
     *          "collectStatus": "1",                           //是否收藏（0-已收藏 1-未收藏）
     *      }
     * </pre>
     * @param isReplay [boolean] 是否重播。true-重播当前视频 false-播放另外一条新视频
     * @param videoInfoJson [object] 重播或新播放视频json对象。参数格式，严格遵循示例。
     */
    doRefreshPlay: function (isReplay, videoInfoJson) {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doRefreshPlay");
    },

    /**
     * “当前视频重播”的核心调用！！！其会分别调用：前置执行、真正执行、后置执行等3个核心方法。
     * <pre>videoInfoJson示例：
     *      {
     *          "sourceId": "10481",                            //视频编码
     *          "videoUrl": "rtsp://202.99.114.93/88888891/16/20180828/270241467/270241467.ts", //视频播放串或注入id
     *          "title": "怎么判断孩子是不是真的肥胖？",          //视频标题
     *          "userType": "2",                                //播放策略（0-不限，1-普通用户可看, 2-vip可看）
     *          "freeSeconds": "30",                            //免费试看时长（秒）
     *          "unionCode": "gylm901",                         //TODO 待注释
     *          "type": "",                                     //TODO 待注释
     *          "entryType": 1,                                 //TODO 待注释
     *          "entryTypeName": "play",                        //TODO 待注释
     *          "collectStatus": "1",                           //是否收藏（0-已收藏 1-未收藏）
     *      }
     * </pre>
     * @param videoInfoJson [object] 重播或新播放视频json对象。参数格式，严格遵循示例。
     */
    doReplay: function (videoInfoJson) {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doReplay");
        lmPlayAPI.doReplayBefore(true, videoInfoJson);
        lmPlayAPI.doRefreshPlay(true, videoInfoJson);
        lmPlayAPI.doReplayAfter(true, videoInfoJson);
    },

    /**
     * “新视频播放”的核心调用！！！其会分别调用：前置执行、真正执行、后置执行等3个核心方法。
     * <pre>videoInfoJson示例：
     *      {
     *          "sourceId": "10481",                            //视频编码
     *          "videoUrl": "rtsp://202.99.114.93/88888891/16/20180828/270241467/270241467.ts", //视频播放串或注入id
     *          "title": "怎么判断孩子是不是真的肥胖？",          //视频标题
     *          "userType": "2",                                //播放策略（0-不限，1-普通用户可看, 2-vip可看）
     *          "freeSeconds": "30",                            //免费试看时长（秒）
     *          "unionCode": "gylm901",                         //TODO 待注释
     *          "type": "",                                     //TODO 待注释
     *          "entryType": 1,                                 //TODO 待注释
     *          "entryTypeName": "play",                        //TODO 待注释
     *          "collectStatus": "1",                           //是否收藏（0-已收藏 1-未收藏）
     *      }
     * </pre>
     * @param videoInfoJson [object] 重播或新播放视频json对象。参数格式，严格遵循示例。
     */
    doPlayNew: function (videoInfoJson) {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPlayNew");
        lmPlayAPI.doReplayBefore(false, videoInfoJson);
        lmPlayAPI.doRefreshPlay(false, videoInfoJson);
        lmPlayAPI.doReplayAfter(false, videoInfoJson);
    },

    /*--------------------------------------------*
     * 物理功能按键（音量相关）
     *--------------------------------------------*/

    /**
     * 增大音量
     */
    doVolumeUp: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doVolumeUp");
        lmPlayUIAPI.withVolumeChange(true);
    },

    /**
     * 减小音量
     */
    doVolumeDown: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doVolumeDown");
        lmPlayUIAPI.withVolumeChange(false);
    },

    /**
     * 静音切换
     */
    doVolumeMute: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doVolumeMute");
        var muteFlag = LMEPG.mp.toggleMuteFlag();
        var isMuted = muteFlag === LMEPG.mp.MuteFlag.ON;
        lmPlayUIAPI.withVolumeMute(isMuted);
    },

    /*--------------------------------------------*
     * 物理功能按键（方向相关）
     *--------------------------------------------*/

    /**
     * 按上键
     */
    doPressKeyUp: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPressKeyUp");
        if (lmTVGlobals.isHoldPageShowing()) {
            var handled = lmPlayUIAPI.withPressDirKeyOnHoldPage(G_CONST.up);
            if (!!handled) {
                // 业务层已自定义逻辑实现了！
            } else {
                LMEPG.BM.performMoveChange(G_CONST.up);
            }
        } else {
            lmPlayUIAPI.withPressDirKey(G_CONST.up);
        }
    },

    /**
     * 按下键
     */
    doPressKeyDown: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPressKeyDown");
        if (lmTVGlobals.isHoldPageShowing()) {
            var handled = lmPlayUIAPI.withPressDirKeyOnHoldPage(G_CONST.down);
            if (!!handled) {
                // 业务层已自定义逻辑实现了！
            } else {
                LMEPG.BM.performMoveChange(G_CONST.down);
            }
        } else {
            lmPlayUIAPI.withPressDirKey(G_CONST.down);
        }
    },

    /**
     * 按左键
     */
    doPressKeyLeft: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPressKeyLeft");
        if (lmTVGlobals.isHoldPageShowing()) {
            var handled = lmPlayUIAPI.withPressDirKeyOnHoldPage(G_CONST.left);
            if (!!handled) {
                // 业务层已自定义逻辑实现了！
            } else {
                LMEPG.BM.performMoveChange(G_CONST.left);
            }
        } else {
            lmPlayUIAPI.withPressDirKey(G_CONST.left);
            lmPlayAPI.doFastRewind();
        }
    },

    /**
     * 按右键
     */
    doPressKeyRight: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPressKeyRight");
        if (lmTVGlobals.isHoldPageShowing()) {
            var handled = lmPlayUIAPI.withPressDirKeyOnHoldPage(G_CONST.right);
            if (!!handled) {
                // 业务层已自定义逻辑实现了！
            } else {
                LMEPG.BM.performMoveChange(G_CONST.right);
            }
        } else {
            lmPlayUIAPI.withPressDirKey(G_CONST.right);
            lmPlayAPI.doFastForward();
        }
    },

    /**
     * 按中间键
     */
    doPressKeyCenter: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPressKeyCenter");
        if (lmTVGlobals.isHoldPageShowing()) {
            var handled = lmPlayUIAPI.withPressDirKeyOnHoldPage(G_CONST.right);
            if (!!handled) {
                // 业务层已自定义逻辑实现了！
            } else {
                LMEPG.BM.performClick();
            }
        } else {
            var state = LMEPG.mp.getPlayerState();
            switch (state) {
                case LMEPG.mp.State.PLAY:
                    lmPlayAPI.doPause();
                    break;
                case LMEPG.mp.State.PAUSE:
                case LMEPG.mp.State.FAST_REWIND:
                case LMEPG.mp.State.FAST_FORWARD:
                    lmPlayAPI.doResume();
                    break;
                default:
                    break;
            }
        }
    },

    /*--------------------------------------------*
     * 物理功能按键（其它按键）
     *--------------------------------------------*/

    /**
     * 按返回键
     */
    doPressKeyBack: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPressKeyBack");
        lmPlayUIAPI.withPressKeyBack(lmTVGlobals.isHoldPageShowing());
    },

    /**
     * 按删除键（注：某些盒子上，此键处理为返回键功能！）
     */
    doPressKeyDelete: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPressKeyDelete");
        lmPlayUIAPI.withPressKeyBack(lmTVGlobals.isHoldPageShowing());
    },

    /**
     * 按退出键
     */
    doPressKeyExit: function () {
        lmTVLogPanel.log.v("[声明]-->lmPlayAPI::doPressKeyExit");
        lmPlayUIAPI.withPressKeyExit();
    },

    /**
     * 触发虚拟按键（注：不会手动操作，一般用于监听来自于系统发送！）
     */
    doSignalVirtualKey: function () {
        lmPlayHandler.handle_VirtualKey(lmPlayUIAPI.withVirtualKey);
    },

};

/*****************************************************************
 * 统一接口定义：UI交互控制，应用层执行更新UI操作逻辑。
 *----------------------------------------------------------------
 * 注：若业务层需要，切不可更改命名空间，直接覆写相关方法逻辑即可！
 *----------------------------------------------------------------
 * @author: Songhui
 * @date: 2019/12/10
 *****************************************************************/
var lmPlayUIAPI = {

    /*--------------------------------------------*
     * 物理功能按键（播控相关UI更新）
     *--------------------------------------------*/

    /**
     * 执行“快进”后，请在此更新UI。
     * @param latestPlayState [string] 记录的最新播放状态。详见 {@link LMEPG.mp.getPlayerState}
     * @param isSpeedResumed [boolean] 是否达到恢复正常1倍速播放。true-正常 false-快进中
     * @param currentPlayTimeInSec [number] 当前播放进度（秒）
     */
    withFastForward: function (latestPlayState, isSpeedResumed, currentPlayTimeInSec) {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withFastForward");
    },

    /**
     * 执行“快退”后，请在此更新UI。
     * @param latestPlayState [string] 记录的最新播放状态。详见 {@link LMEPG.mp.getPlayerState}
     * @param isSpeedResumed [boolean] 是否达到恢复正常1倍速播放。true-正常 false-快进中
     * @param currentPlayTimeInSec [number] 当前播放进度（秒）
     */
    withFastRewind: function (latestPlayState, isSpeedResumed, currentPlayTimeInSec) {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withFastRewind");
    },

    /**
     * 执行“暂停”后，请在此更新UI。
     */
    withPause: function () {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withPause");
    },

    /**
     * 执行“取消暂停”后，请在此更新UI。
     */
    withPauseCancelled: function () {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!][PS:业务层实现!]-->lmPlayUIAPI::withPauseCancelled");
    },

    /**
     * 执行“恢复播放”后，请在此更新UI。
     */
    withResume: function () {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withResume");
    },

    /**
     * 执行“重播”后，请在此更新UI。
     */
    withReplay: function () {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withReplay");
    },

    /**
     * 执行“停止播放”后，请在此更新UI。
     */
    withStop: function () {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withStop");
    },

    /**
     * 执行“音量调节”后，请在此更新UI。
     * @param isAscend [boolean] 是否增大音量。true-调高音量 false-调低音量
     */
    withVolumeChange: function (isAscend) {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withVolumeChange");
    },

    /**
     * 执行“静音切换”后，请在此更新UI。
     * @param isMuted [boolean] 是否为静音状态。true-静音中 false-有声中
     */
    withVolumeMute: function (isMuted) {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withVolumeMute");
    },

    /*--------------------------------------------*
     * 物理功能按键（方向键相关UI更新）
     *--------------------------------------------*/

    /**
     * 执行“方向键”后，请在此更新UI。
     * @param direction [string] 方向。详见 {@link G_CONST}
     */
    withPressDirKey: function (direction) {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withPressDirKey");
    },

    /**
     * 执行“在挽留页弹出中按方向键”后，请在此更新UI。请注意有返回值（boolean）的使用场景！！！
     * @param direction [string] 方向。详见 {@link G_CONST}
     * @return boolean。需要返回一个boolean值，true-表示已经业务层已经自定义拦截处理了。false-业务层未处理，则当前框架会走默认焦点移动事件。
     */
    withPressDirKeyOnHoldPage: function (direction) {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withPressDirKeyOnHoldPage");
    },

    /**
     * 执行“虚拟事件”后，请在此更新UI。
     * <pre style='color:red'>
     * 注意：若为收到虚拟按键后，需要重新绑定且绑定成功或者不走绑定方式（不通过绑定方式判断）的，则正常进入当前方法。
     * 否则，其它情况将不会回调此或者isOk=false，请上层调用开发者微微注意此。
     * </pre>
     * @param isOk [boolean] 是否已经正常接收并解析到事件。true-正常处理。false-失败处理。
     * @param msg [strin] 描述信息（成功：相关提示。失败：错误环节原因）
     * @param vKeyCode [string|number] 事件code
     * @param vKeyEvent [object] 事件整个对象，可能会undefined或null（失败情况下）。
     */
    withVirtualKey: function (isOk, msg, vKeyCode, vKeyEvent) {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withVirtualKey");
    },

    /*--------------------------------------------*
     * 物理功能按键（其它按键UI更新）
     *--------------------------------------------*/

    /**
     * 执行“返回键”后，请在此更新UI。
     * @param isHoldPageShowing [boolean] 挽留是否正在显示中。true-显示 false-关闭
     */
    withPressKeyBack: function (isHoldPageShowing) {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withPressKeyBack");
    },

    /**
     * 执行“退出键”后，请在此更新UI。
     */
    withPressKeyExit: function () {
        lmTVLogPanel.log.v("[声明][PS:业务层实现!]-->lmPlayUIAPI::withPressKeyExit");
    },
};

/*****************************************************************
 * 其它播放逻辑处理
 * @author: Songhui
 * @date: 2019/12/10
 *****************************************************************/
var lmPlayerUtil = {

    /**
     * 注册播控事件监听。默认实现，请勿更改！！！
     */
    registerSpecialKeys: function () {
        lmTVLogPanel.log.v("注册特殊按键...");
        LMEPG.KeyEventManager.init();
        LMEPG.KeyEventManager.addKeyEvent
        (
            {
                /* 物理功能按键（音量相关） */
                KEY_MUTE: lmPlayAPI.doVolumeMute,                                                   // 静音开关
                KEY_VOL_UP: lmPlayAPI.doVolumeUp,                                                   // 音量+
                KEY_VOL_DOWN: lmPlayAPI.doVolumeDown,                                               // 音量+

                /* 物理功能按键（播控相关） */
                KEY_FAST_FORWARD: lmPlayAPI.doFastForward,                                          // 遥控键：快进>>
                KEY_FAST_REWIND: lmPlayAPI.doFastRewind,                                            // 遥控键：快退<<
                KEY_PLAY: lmPlayAPI.doPlay,                                                         // 遥控键：播放>
                KEY_PLAY_PAUSE: lmPlayAPI.doPause,                                                  // 遥控键：暂停>||
                KEY_PLAY_STOP: lmPlayAPI.doStop,                                                    // 遥控键：停止□

                /* 物理功能按键（方向相关） */
                KEY_UP: lmPlayAPI.doPressKeyUp,                                                     // 上键
                KEY_DOWN: lmPlayAPI.doPressKeyDown,                                                 // 下键
                KEY_LEFT: lmPlayAPI.doPressKeyLeft,                                                 // 左键
                KEY_RIGHT: lmPlayAPI.doPressKeyRight,                                               // 右键
                KEY_ENTER: lmPlayAPI.doPressKeyCenter,                                              // 确定（center）

                /* 虚拟按键 */
                KEY_VIRTUAL_EVENT: lmPlayAPI.doSignalVirtualKey,                                    // 虚拟按键
                EVENT_MEDIA_END: lmPlayAPI.doSignalVirtualKey,                                      // 虚拟按键 - 结束
                EVENT_MEDIA_ERROR: lmPlayAPI.doSignalVirtualKey,                                    // 虚拟按键 - 错误

                /* 其它按键 */
                KEY_BACK: lmPlayAPI.doPressKeyBack,                                                 // 返回
                KEY_DELETE: lmPlayAPI.doPressKeyDelete,                                             // 兼容辽宁华为EC2108V3H的删除键（返回键）
                KEY_EXIT: lmPlayAPI.doPressKeyExit,                                                 // 退出按键
            }
        );
    },
};

/*****************************************************************
 * 默认内部逻辑实现（处理不同的响应）
 * @author: Songhui
 * @date: 2019/12/10
 *****************************************************************/
var lmPlayHandler = {

    /**
     * 通用处理接收虚拟事件，并以回调函数响应上层：callback(isOk, msg, vKeyCode, vKeyEvent)
     * @param callback [function] 4个参数：
     *                 [
     *                      isOk, //boolean值：true-成功，false-失败
     *                      msg, //string值：描述信息
     *                      vKeyCode, //int|string值：isOk为true时，成功获取到“虚拟键值”。否则，undefined
     *                      vKeyEvent //object值：isOk为true时，成功获取到整个“虚拟事件”。否则，undefined
     *                 ]
     */
    handle_VirtualKey: function (callback) {
        if (typeof Utility === "undefined" || Utility == null || typeof Utility.getEvent === "undefined") {
            LMEPG.Log.error("[播放器日志]--[handle_VirtualKey]：Utility 或 Utility.getEvent() 不存在！");
            LMEPG.call(callback, [false, "虚拟事件：Utility 或 Utility.getEvent() 不存在！"]);
            return;
        }

        var oKeyEvent = Utility.getEvent();
        try {
            // 加强处理：由于有些会返回为json串，需要手动转换。
            // 例如：{"type":"EVENT_MEDIA_ERROR","instance_id":12,"error_code":10090,"error_message":"The STB sends a playback control command,
            // however,the Media Server sends no response due to a timeout","media_code":"jsoncode1"}
            if (typeof oKeyEvent === "string" && oKeyEvent !== "") {
                lmTVLogPanel.log.i("[虚拟事件]：Utility.getEvent() 返回值string类型（即将转换对象）：" + oKeyEvent, true);
                oKeyEvent = eval('(' + oKeyEvent + ')');
            }else if (typeof oKeyEvent === "string" && oKeyEvent == "") {
                lmTVLogPanel.log.e("[虚拟事件]：Utility.getEvent() 返回值空：", true);
                return;
            }
        } catch (e) {
            lmTVLogPanel.log.e("[虚拟事件]：Utility.getEvent() 返回值转换为对象异常：" + e.toString(), true);
        }
        if (typeof oKeyEvent !== "object") {
            lmTVLogPanel.log.e("[虚拟事件]：Utility.getEvent() 返回值非object：" + oKeyEvent, true);
            LMEPG.call(callback, [false, "[虚拟事件]：Utility.getEvent() 返回值非object：" + oKeyEvent]);
            return;
        }

        // 获取真实的event参数
        var oKeyCode = oKeyEvent.type;
        lmTVLogPanel.log.i(LMEPG.Func.string.format("[虚拟事件]：成功处理。[{0}]-->oKeyEvent: {1}", [oKeyCode, JSON.stringify(oKeyEvent)]));
        if (!LMEPG.mp.bind(oKeyEvent)) {
            lmTVLogPanel.log.w(LMEPG.Func.string.format("[虚拟事件]：成功处理。[{0}]-->收到虚拟重新绑定::false！", [oKeyCode]));
            return;
        }

        // 正常通知应用层
        LMEPG.call(callback, [true, "虚拟事件：成功接收虚拟事件", oKeyCode, oKeyEvent]);
    },

};

/*****************************************************************
 * 存储当前播放相关信息
 *----------------------------------------------------------------
 * 注：若业务层需要，切不可更改命名空间，直接覆写相关方法逻辑即可！
 *----------------------------------------------------------------
 * @author: Songhui
 * @date: 2019/12/10
 *****************************************************************/
var lmTVParams = (function () {
    var lmTVPlayParamObj = function () {
        var v_VideoInfoObj = null;      //![缓存当前播放视频整个json信息]
        var v_sourceId = "";            //视频编码
        var v_videoUrl = "";            //视频播放串或注入id
        var v_title = "";               //视频标题
        var v_userType = "";            //播放策略（0-不限，1-普通用户可看, 2-vip可看）
        var v_freeSeconds = 0;          //免费试看时长（秒）
        var v_type = "";                //TODO 待注释
        var v_unionCode = "";           //TODO 待注释
        var v_entryType = 1;            //TODO 待注释
        var v_entryTypeName = "";       //TODO 待注释
        var v_collectStatus = "1";      //是否收藏（0-已收藏 1-未收藏）

        /**
         * 更新“当前播放”的视频信息
         * @param info [object] 视频信息对象。若未提供，则继续使用上一次的播放信息！！！
         * @return {lmTVPlayParamObj}
         */
        this.init_VideoInfo = function (info) {
            var isDefined = function (variableObj) {
                return typeof variableObj !== "undefined";
            };
            if (typeof info === "object" && info != null) {
                v_VideoInfoObj = info;
                v_sourceId = isDefined(info.sourceId) ? info.sourceId : "";
                v_videoUrl = isDefined(info.videoUrl) ? info.videoUrl : "";
                v_title = isDefined(info.title) ? info.title : "";
                v_type = isDefined(info.type) ? info.type : "";
                v_userType = isDefined(info.userType) ? info.userType : 0;
                v_freeSeconds = isDefined(info.freeSeconds) ? info.freeSeconds : 0;
                v_unionCode = isDefined(info.unionCode) ? info.unionCode : "";
                v_entryType = isDefined(info.entryType) ? info.entryType : 1;
                v_entryTypeName = isDefined(info.entryTypeName) ? info.entryTypeName : "";
                v_collectStatus = isDefined(info.collectStatus) ? info.collectStatus : 1;
            }
            return this;
        };

        /** 返回 - 整个视频参数信息 */
        this.get_v_VideoInfo = function () {
            return v_VideoInfoObj;
        };

        /** 返回 - 视频编码 */
        this.get_v_SourceId = function () {
            return v_sourceId;
        };

        /** 设置 - 视频编码 */
        this.set_v_SourceId = function (sourceId) {
            v_sourceId = sourceId;
        };

        /** 返回 - 最新的视频地址或注入码（若转换后，可能为具体的http/rtsp播放串） */
        this.get_v_VideoUrl = function () {
            return v_videoUrl;
        };

        /** 设置 - 最新的视频地址或注入码（若转换后，可能为具体的http/rtsp播放串），并返回更新值。 */
        this.set_v_VideoUrl = function (videoUrl) {
            v_videoUrl = videoUrl;
            return v_videoUrl;
        };

        /** 返回 - 视频标题 */
        this.get_v_VideoTitle = function () {
            return v_title;
        };

        /** 返回 - 播放策略（0-不限，1-普通用户可看, 2-vip可看） */
        this.get_v_UserType = function () {
            return v_userType;
        };

        /** 返回 - 免费试看时长（秒） */
        this.get_v_FreeSeconds = function () {
            return v_freeSeconds;
        };

        /** 返回 - 收藏状态（number：0-已收藏 1-未收藏） */
        this.get_v_CollectStatus = function () {
            return isNaN(parseInt(v_collectStatus)) ? 1 : parseInt(v_collectStatus);
        };

        /** 返回 - 是否收藏过（boolean：true-已收藏 false-未收藏） */
        this.is_t_Collected = function () {
            return parseInt(v_collectStatus) === 0;//（0-已收藏 1-未收藏）
        };

        /** 设置 - 收藏状态（number：0-已收藏 1-未收藏） */
        this.set_v_CollectStatus = function (collectStatus) {
            v_collectStatus = collectStatus;
        };

    };
    return new lmTVPlayParamObj();
})();

/*****************************************************************
 * 存储当前播控中的自定义全局通用变量。
 *----------------------------------------------------------------
 * 注：若业务层需要，切不可更改命名空间，直接覆写相关方法逻辑即可！
 *----------------------------------------------------------------
 * @author: Songhui
 * @date: 2019/12/10
 *****************************************************************/
var lmTVGlobals = (function () {
    var lmTVGlobalsObj = function () {
        // 挽留推荐页（Hold Page）显示标志（true-显示 false-关闭）
        var isHoldPageShowing = false;

        // 参数说明：
        // 用户是否已经触发按键焦点移动。（hpShow = Hold Page Showing，表示挽留页弹出显示中）
        // 例如，某些平台，播放结束弹出挽留页后，若指定时段内用户无按键移动操作，则会自动播放推荐视频。
        var hpShow_HasKeyMoved = false;             //挽留页显示中：是否按过键移动了
        var hpShow_DelayWhenNoKeyMoved = 0;         //挽留页显示中：未按键任何键时的自动计数器（秒）

        /** 返回 - 是否正在显示挽留页逻辑（boolean：boolean-显示 false-关闭） */
        this.isHoldPageShowing = function () {
            return !!isHoldPageShowing;
        };

        /** 设置 - 是否正在显示挽留页逻辑（boolean：true-显示 false-关闭） */
        this.setHoldPageShowing = function (isShowing) {
            isHoldPageShowing = !!isShowing;
        };

        /** 返回 - 挽留页显示中，是否按过键移动了（boolean：true-移动过了 false-未移动过） */
        this.is_hpShow_HasKeyMoved = function () {
            return !!hpShow_HasKeyMoved;
        };

        /** 设置 - 挽留页显示中，是否按过键移动了（boolean：true-移动过了 false-未移动过） */
        this.set_hpShow_HasKeyMoved = function (hasMoved) {
            hpShow_HasKeyMoved = !!hasMoved;
        };

        /** 设置 - 挽留页显示中，未按键任何键时的自动计数器（秒）（number） */
        this.set_hpShow_DelayWhenNoKeyMoved = function (delayInSeconds) {
            hpShow_DelayWhenNoKeyMoved = delayInSeconds;
        };

        /** 设置 - 挽留页显示中，未按键任何键时的自动计数器（秒）自增计数，并返回秒数（number） */
        this.increase_hpShow_DelayWhenNoKeyMoved = function () {
            lmTVLogPanel.log.v("播放结束，用户未操作（秒）：" + (hpShow_DelayWhenNoKeyMoved + 1));
            return ++hpShow_DelayWhenNoKeyMoved;
        };

        /** 返回 - 挽留页显示中，未按键任何键时的自动计数器（秒）自增计秒数（number） */
        this.get_hpShow_DelayWhenNoKeyMoved = function () {
            return hpShow_DelayWhenNoKeyMoved;
        };

        /** 重置 - 当前全局性变量 */
        this.reset = function () {
            lmTVLogPanel.log.v("重置全局变量");
            isHoldPageShowing = false;
            hpShow_HasKeyMoved = false;
            hpShow_DelayWhenNoKeyMoved = 0;
        }
    };
    return new lmTVGlobalsObj();
})();
