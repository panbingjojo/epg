// +----------------------------------------------------------------------
// | MoFang-EPG-LWS
// +----------------------------------------------------------------------
// | EPG 底层播放器的封装
// +----------------------------------------------------------------------
// | 说明：
// |    1. 通用的MediaPlayer接口调用封装，应用所有所有地区。
// |    2. 具体不同运营平台同一功能不同接口方法，则需在dispatcher分发实现！
// |    3. 统一对外提供为“方法调用”，不直接操作属性名。
// |           例如：LMEPG.mp.getXXX/setXXX
// +----------------------------------------------------------------------
// | 提供接口：(LMEPG.mp.xxx)
// |    - initPlayer/initPlayerMode1/initPlayerByBind/destroy
// |    - play/pause/resume/fastForward/fastRewind/toggleMuteFlag
// |    - playByTime/getCurrentPlayTime/setMediaDuration/getMediaDuration
// |    - getPlayerState/getMuteFlag/isMuted/isSpeedResumed/setSpeed/getSpeed
// |    - mpInstance/is_mpClassExist/is_mpInstanceExist
// |    - ...
// +----------------------------------------------------------------------
// | 通常调用模式：
// |    1. 场景-1：
// |        LMEPG.mp.initPlayerMode1();
// |        LMEPG.mp.playOfFullscreen(videoUrl);
// |        LMEPG.mp.playByTime(0);
// |    或
// |        LMEPG.mp.initPlayerMode1();
// |        LMEPG.mp.playOfSmallscreen(playUrl, left, top, width, height);
// |    2. 场景-2：
// |        var info = LMEPG.mp.dispatcherUrl.getUrlWith320092(left, top, width, height, videoUrl);
// |        var factUrl = thirdPlayerUrl + info;
// |        G("id-iframe-smallscreen").setAttribute("src", factUrl);
// |        LMEPG.mp.initPlayerByBindWithCustomUI();
// |    3. 场景-3：
// |        LMEPG.mp.initPlayer();
// |        LMEPG.mp.playOfFullscreen(videoUrl);
// |    或
// |        LMEPG.mp.initPlayer();
// |        LMEPG.mp.playOfSmallscreen(playUrl, left, top, width, height);
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/9/19
// +----------------------------------------------------------------------

/**
 * 全局的播放器实例。
 * 注：
 *      1. 推荐外部调用尽量不直接使用该 g_mp，如需应新增封闭接口方法在 LMEPG.mp.mpInstance 下，以方便平台化分发实现！
 *      2. 该 g_mp 仅为“可支持MediaPlayer”的实例。若某些平台自定义封装另取别名时，即不可用之！或者把自定义封装的其它播放器
 * 实例化或者直接赋值给该变量，这样可一定程度差异化分发、兼容复用含义！
 */
var g_mp;
var time = 0;
/**
 * 定义播放器
 * @private
 */
var __LMMediaPlayerSdk = function () {

    //******************************* 当前对象 *******************************//

    var gmp_self = this;

    //******************************* 当前维护参数（部分附加在mp对象上，便于跟踪） *******************************//

    // 播放状态（注：各定义值，请勿更改！）
    var m_State = {
        PLAY: "play",                           //正常播放
        PAUSE: "pause",                         //暂停
        FAST_REWIND: "fastRewind",              //倍速快退
        FAST_FORWARD: "fastForward",            //倍速快进
        END: "end",                             //结束
    };

    // 静音标志
    var m_MuteFlag = {
        OFF: 0,                                 //0：有声（关闭静音）
        ON: 1,                                  //1：静音（开启静音）
    };

    var m_carrierId = get_carrier_id() || "";   //[string]平台id：用于扩展分发“不同平台”MediaPlayer差异化接口
    var m_areaCode = get_area_code() || "";     //[string]平台-省份id：用于扩展分发“同一平台-不同省份”-MediaPlayer差异化接口
    var m_lmsl = get_platform_type() || "hd";   //[string]平台类型：hd-高清 sd-标清
    var m_state = m_State.PLAY;                 //[string]播放状态（详见State)
    var m_speed = 1;                            //[number]播放倍速（1：正常 [1, 2, 4, 8, 16, 32]）
    var m_instanceID = null;                    //[number]播放器本地实例的instanceID
    var m_duration = 0;                         //[number]存储视频总时长（用于持久化非MediaPlayer接口($mp.getMediaDuration())获取到的总时长）
    var m_isSpeedResumed = false;               //[boolean]是否从倍速中重新恢复播放状态（false：未恢复，仍处于倍速播放中，true：从倍速恢复为正常播放）
    var m_isBindMode = false;                   //[boolean]是否通过绑定本地播放器实例播放视频
    var m_isLogOnScreen = 0;                    //[number]屏幕调试打印开关，默认关闭（1开启 0关闭）

    var m_isCUCCPush = window.mp && window.mp != 'undefined'; //[boolean]中国联通播放器push

    ////////////////////////////////////// 内部使用接口 //////////////////////////////////////////////
    /** 打印相关跟踪日志 */
    var m_printLog = function (msg, level) {
        if (m_isLogOnScreen) console.log(msg);
        if (m_isLogOnScreen && LMEPG.Log) LMEPG.Log.info(msg);
        if (m_isLogOnScreen && LMEPG.UI) LMEPG.UI.logPanel.show(msg, true, "-->",
            (function () {
                if (level === 'v') return '#BBBBBB';
                if (level === 'd') return '#0070BB';
                if (level === 'i') return '#48BB31';
                if (level === 'w') return '#BBBB23';
                if (level === 'e') return '#FF0006';
                if (level === 'a') return '#8F0005';
            })()
        );
    };

    ////////////////////////////////////// MediaPlayer设置区 //////////////////////////////////////////////

    /**
     * 播放状态
     */
    this.State = m_State;

    /**
     * 静音标志
     */
    this.MuteFlag = m_MuteFlag;

    /**
     * 统一返回，当前的、全局的播放器实例。
     * @return MediaPlayer实例 或 其它平台封装的别名播放器 或 null 或 undefined
     */
    this.mpInstance = function () {
        return gmp_self.dispatcher.impl_mpInstance();
    };

    /**
     * 初始化播放器
     * @return {__LMMediaPlayerSdk}
     */
    this.initPlayer = function () {
        gmp_self.dispatcher.impl_initPlayerByInit();
        return this;
    };

    /**
     * 模式1：不使用系统默认的播放器UI，音量调节UI是自定义UI
     * @return {__LMMediaPlayerSdk}
     */
    this.initPlayerMode1/*数字1非字母l*/ = function () {
        gmp_self.dispatcher.impl_initPlayerMode1();
        return this;
    };

    /**
     * 通过绑定模式，初始化播放器且：不使用系统默认的播放器UI，音量调节UI是自定义UI
     */
    this.initPlayerByBindWithCustomUI = function () {
        gmp_self.dispatcher.impl_initPlayerByBindWithCustomUI();
        return this;
    };

    /**
     * 初始化播放器，使用默认本地实例绑定初始化播放器。
     * @return {__LMMediaPlayerSdk}
     */
    this.initPlayerByBind = function () {
        gmp_self.dispatcher.impl_initPlayerByBind();
        return this;
    };

    /**
     * 绑定播放器实例
     * @private 内部调用
     */
    var m_bindPlayerInstance = function () {
        var stbType1 = LMEPG.STBUtil ? LMEPG.STBUtil.getSTBModel() : "";
        if (m_carrierId == "640092" && (stbType1.toUpperCase().indexOf("TY1208-Z") < 0)) {
            //TODO 宁夏电信EPG绑定播放器实例。后期会慢慢验证统一优化为该绑定方式
            var iTemp = 0;
            g_mp = new MediaPlayer();                      // 创建播放实例
            //当某型号的盒子正常播放，但快进、暂停失效时，添加在这
            if (stbType1.toUpperCase().indexOf("EC6110T") >= 0 ||
                stbType1.toUpperCase().indexOf("EC6108V9U") >= 0 ||
                stbType1.toUpperCase().indexOf("E900V21E") >= 0) {
                var instanceId = g_mp.getNativePlayerInstanceID();
                LMEPG.Log.debug('>>>>> getNativePlayerInstanceID ---> instanceId:' + instanceId);
                if (instanceId >= 0) {
                    iTemp = instanceId;
                    m_instanceID = instanceId;
                    return;
                }
            }
            for (var i = 0; i < 256; i++) {
                var status = g_mp.bindNativePlayerInstance(i);
                if (status == 0) {
                    iTemp = i;
                    m_instanceID = i;
                    break;
                } else {
                    g_mp.releaseMediaPlayer(i);
                }
            }
            setTimeout(function () {
                for (var i = iTemp + 1; i < 256; i++) {
                    g_mp.releaseMediaPlayer(i);
                }
            }, 300);
        } else if ((m_carrierId == "420092") && (stbType1.toUpperCase().indexOf("B860AV") >= 0)) {
            // 修复：【中兴B860AV2.1-T】机顶盒在进入39健康进入后30秒后才加载完成
            // 原因：一次性创建了256个播放实例以及同时释放了256个实例对象导致，请让模板去进一步修改优化
            g_mp = new MediaPlayer();                      // 创建播放实例
            var instanceId = g_mp.getNativePlayerInstanceID();
            LMEPG.Log.debug('>>>>> playWithIframe ---> instanceId:' + instanceId);
            if (instanceId >= 0) {
                m_instanceID = instanceId;
            }
            return;
        } else if ((m_carrierId == "650092" || m_carrierId == "12650092")) {
            // 修复：【中兴B860AV2.1-T】机顶盒在进入39健康进入后30秒后才加载完成
            // 原因：一次性创建了256个播放实例以及同时释放了256个实例对象导致，请让模板去进一步修改优化
            g_mp = new MediaPlayer();                      // 创建播放实例
            var instanceId = g_mp.getNativePlayerInstanceID();
            LMEPG.Log.debug('>>>>> playWithIframe ---> instanceId:' + instanceId);
            if (instanceId >= 0) {
                m_instanceID = instanceId;
            } else {
                for (var i = 0; i < 256; i++) {
                    var status = g_mp.bindNativePlayerInstance(i);
                    if (status == 0) {
                        iTemp = i;
                        m_instanceID = i;
                        break;
                    } else {
                        g_mp.releaseMediaPlayer(i);
                    }
                }
                setTimeout(function () {
                    for (var i = iTemp + 1; i < 256; i++) {
                        g_mp.releaseMediaPlayer(i);
                    }
                }, 300);
            }
            return;
        } else if (m_carrierId == "620092" && stbType1 == 'EC6110T_pub_gsgdx') {
            // 华为盒子获取不到时长
            LMEPG.Log.info('620092 不绑定播放器实例盒子型号--->>' + stbType1);
            var iTemp = 0;
            g_mp = new MediaPlayer();                      // 创建播放实例
            for (var i = 0; i < 256; i++) {
                var status = g_mp.bindNativePlayerInstance(i);
                if (status == 0) {
                    iTemp = i;
                    m_instanceID = i;
                    break;
                } else {
                    g_mp.releaseMediaPlayer(i);
                }
            }
            setTimeout(function () {
                for (var i = iTemp + 1; i < 256; i++) {
                    g_mp.releaseMediaPlayer(i);
                }
            }, 300);
        } else if (m_carrierId == "450092") {
            // 华为盒子获取不到时长
            var iTemp = 0;
            g_mp = new MediaPlayer();                      // 创建播放实例
            var instanceId = g_mp.getNativePlayerInstanceID();
            LMEPG.Log.debug('>>>>> playWithIframe ---> instanceId:' + instanceId);
            if (instanceId >= 0) {
                m_instanceID = instanceId;
                return;
            }
            for (var i = 0; i < 256; i++) {
                var status = g_mp.bindNativePlayerInstance(i);
                if (status == 0) {
                    iTemp = i;
                    m_instanceID = i;
                    break;
                } else {
                    g_mp.releaseMediaPlayer(i);
                }
            }
            setTimeout(function () {
                for (var i = iTemp + 1; i < 256; i++) {
                    g_mp.releaseMediaPlayer(i);
                }
            }, 300);
        } else if (LMEPG.Func.array.contains(m_carrierId, [
            // 目前已经验证上线的平台如下，已对绑定做优化，以加快启动速度。
            "000051",
            "630092",
            // "640092", // 宁夏电信EPG，天邑盒子进行简单绑定时，无法播放视频，所以不能进行绑定
        ])) {
            //TODO 宁夏电信EPG绑定播放器实例。后期会慢慢验证统一优化为该绑定方式
            var iTemp = 0;
            g_mp = new MediaPlayer();                      // 创建播放实例
            for (var i = 0; i < 256; i++) {
                var status = g_mp.bindNativePlayerInstance(i);
                if (status == 0) {
                    iTemp = i;
                    m_instanceID = i;
                    break;
                } else {
                    g_mp.releaseMediaPlayer(i);
                }
            }
            setTimeout(function () {
                for (var i = iTemp + 1; i < 256; i++) {
                    g_mp.releaseMediaPlayer(i);
                }
            }, 300);
        } else {
            //TODO 后期会慢慢验证统一优化该绑定方式为如上（宁夏电信EPG）：
            //  1、关于无需重复多次释放已有实例。有之则复用以减少初始化时间与性能！
            //  2、创建多个MediaPlayer实例，造成浪费和其它难以预料的问题！
            // ----- 将在接下来的第2次重构阶段进行验证与调整（Songhui on 2019-11-29）
            var mp = new MediaPlayer();
            var tmp1 = 1;

            if (stbType1.toUpperCase().indexOf("B700V5") >= 0) {
                g_mp = mp;
            } else {
                for (var i = 0; i < 256; i++) {
                    if (mp.bindNativePlayerInstance(i) == 0) {
                        tmp1 = mp.releaseMediaPlayer(i);
                    }
                }
                if (tmp1 == 0) {
                    g_mp = null;//避免创建多个实例：从内存中释放旧的存在实例
                    g_mp = new MediaPlayer();
                } else {
                    g_mp = null;//避免创建多个实例：从内存中释放旧的存在实例
                    g_mp = mp;
                }
            }

            for (var i = 0; i < 256; i++) {
                if (mp.bindNativePlayerInstance(i) == 0) {
                    mp.releaseMediaPlayer(i);
                }
            }

            //避免创建多个实例：从内存中释放旧的存在实例
            if (mp) mp = null;
            if (g_mp) g_mp = null;

            g_mp = new MediaPlayer();                      // 创建播放实例
            for (var i = 0; i < 256; i++) {
                var status = g_mp.bindNativePlayerInstance(i);
                if (status == 0) {
                    m_instanceID = i;
                    break;
                } else {
                    g_mp.releaseMediaPlayer(i);
                }
            }
        }
    };

    /**
     * 是否收到虚拟按键后重新绑定。在768虚拟信号回调通知函数里调用该方法，以判断是否需要重新绑定
     * @param virtualEvent [object] 播放器的虚拟回调按键事件
     * @returns {boolean} true-表示绑定成功或者非绑定模式 false-绑定失败或当前虚拟事件对绑定帮助
     */
    this.bind = function (virtualEvent) {
        if (!m_isBindMode) {
            return true;    //不是通过绑定播放器本地实例，不需继续绑定
        }

        try {
            var _bindInstanceId = parseInt(virtualEvent.instance_id);
            if (_bindInstanceId < 0) {
                return false; //参数错误
            }

            if (m_instanceID == _bindInstanceId) {
                return true; //播放器正常，进行后续操作
            }

            if (virtualEvent.type !== "EVENT_PLAYMODE_CHANGE" && virtualEvent.type !== "EVENT_MEDIA_BEGINING") {
                return false; //接收的事件对绑定没有帮助
            }

            g_mp.bindNativePlayerInstance(_bindInstanceId);

            if (_bindInstanceId == g_mp.getNativePlayerInstanceID()) {
                m_instanceID = _bindInstanceId;
                return true; //绑定成功，继续后续处理
            }
        } catch (e) {
            m_printLog("[bind(virtualEvent)]-->error: " + e.toString());
        }

        return false;
    };

    /**
     * 播放媒体资源 - 全屏播放。调用前，需要初始化播放器，例如：
     * <pre style='color:red'>调用示例：
     *     LMEPG.mp.initPlayerByBind();
     *     LMEPG.mp.playOfFullscreen("播放地址", 是否需要格式化串bool值);
     * </pre>
     * @param mediaUrl [string] 媒体地址
     * @param isNeedFormatPlayUrl [boolean] 是否需要格式化播放串。false-不需要，true-需要。如果不传，默认true需要。
     * @return {__LMMediaPlayerSdk}
     */
    this.playOfFullscreen = function (mediaUrl, isNeedFormatPlayUrl) {
        gmp_self.dispatcher.impl_playOfFullscreen(mediaUrl, isNeedFormatPlayUrl);
        return this;
    };

    /**
     * 播放媒体资源 - 小窗播放。调用前，需要初始化播放器，例如：
     * <pre style='color:red'>调用示例：
     *     LMEPG.mp.initPlayerByBind();
     *     LMEPG.mp.playOfSmallscreen("播放地址", x坐标, y坐标, 小窗宽度, 小窗高度, 是否需要格式化播放器bool，开始播放的时移时刻秒);
     * </pre>
     * @param mediaUrl [string] 媒体地址
     * @param left [number] x坐标
     * @param top [number] y坐标
     * @param width [number] 小窗宽度
     * @param height [number] 小窗高度
     * @param isNeedFormatPlayUrl [boolean] 是否需要格式化播放串。false-不需要，true-需要。如果不传，默认true需要。
     * @param playByTimeSeconds [number] 开始播放的时移时刻秒
     * @return {__LMMediaPlayerSdk}
     */
    this.playOfSmallscreen = function (mediaUrl, left, top, width, height, isNeedFormatPlayUrl, playByTimeSeconds) {
        gmp_self.dispatcher.impl_playOfSmallscreen(mediaUrl, left, top, width, height, isNeedFormatPlayUrl, playByTimeSeconds);
        return this;
    };

    /**
     * 时移播放
     * @param second [number] 秒数
     */
    this.playByTime = function (second) {
        gmp_self.setPlayerState(m_State.PLAY);
        gmp_self.dispatcher.impl_playByTime(second);
    };

    /**
     * 调用MediaPlayer的play
     */
    this.play = function () {
        gmp_self.dispatcher.impl_play();
    };

    /**
     * 暂停
     */
    this.pause = function () {
        gmp_self.setSpeed(1);
        gmp_self.setPlayerState(m_State.PAUSE);
        gmp_self.dispatcher.impl_pause();
    };

    /**
     * 刷新
     */
    this.refresh = function () {
        gmp_self.dispatcher.impl_refresh();
    };

    /**
     * 从 暂停/快进/快退 中恢复正常播放
     */
    this.resume = function () {
        gmp_self.setSpeed(1);
        gmp_self.setPlayerState(m_State.PLAY);
        gmp_self.dispatcher.impl_resume();
    };

    /** 播放或暂停 */
    this.playOrPause = function (callback) {
        if (m_state === m_State.PLAY) {
            gmp_self.pause();
        } else {
            gmp_self.resume();
        }
        LMEPG.call(callback, [m_state, gmp_self]);
    };

    /** 倍速快进 */
    this.fastForward = function () {
        console.log("[lmplayer.js]--(fastForward)--speed--" + m_speed + "--m_state--" + m_state);
        if (m_speed >= 32 || m_state === m_State.FAST_REWIND) {
            m_isSpeedResumed = true;
            gmp_self.resume();
        } else {
            m_isSpeedResumed = false;
            gmp_self.setSpeed(m_speed * 2);
            gmp_self.setPlayerState(m_State.FAST_FORWARD);
            gmp_self.dispatcher.impl_fastForward();
        }
    };

    /** 倍速快退 */
    this.fastRewind = function () {
        if (m_speed >= 32 || m_state === m_State.FAST_FORWARD) {
            m_isSpeedResumed = true;
            gmp_self.resume();
        } else {
            m_isSpeedResumed = false;
            gmp_self.setSpeed(m_speed * 2);
            gmp_self.setPlayerState(m_State.FAST_REWIND);
            gmp_self.dispatcher.impl_fastRewind();
        }
    };

    /**
     * 调大音量
     * @param absOffset [number] 改变的音量偏移量（正整数）（注：若提供无效，则根据不同地区使用默认的间隔）
     * @return {*|number|*} 返回调节后音量值
     */
    this.upVolume = function (absOffset) {
        return (gmp_self.dispatcher.impl_upVolume(absOffset) || 0);
    };

    /**
     * 调小音量
     * @param absOffsetUnit [number] 改变音的量偏移量（正整数）（注：若提供无效，则根据不同地区使用默认的间隔）
     * @return {*|number|*} 返回调节后音量值
     */
    this.downVolume = function (absOffsetUnit) {
        return (gmp_self.dispatcher.impl_downVolume(absOffsetUnit) || 0);
    };

    /***
     * 获取当前音量值
     * @return {number}
     */
    this.getCurrentVolume = function () {
        return (gmp_self.dispatcher.impl_getVolume() || 0);
    };

    /***
     * 获取当前音量值
     * @param volume [number] 设置音量值。须>=0！
     */
    this.setCurrentVolume = function (volume) {
        if (typeof volume !== "number") return;
        gmp_self.dispatcher.impl_setVolume(volume > 0 ? volume : 0);
    };

    /**
     * 开启或关闭声音（反选静音）
     * @returns {number} 返回最终的静音状态标志
     * @see {@link __LMMediaPlayerSdk.MuteFlag}
     */
    this.toggleMuteFlag = function () {
        if (!gmp_self.is_mpInstanceExist()) return m_MuteFlag.OFF;
        gmp_self.dispatcher.impl_toggleMuteFlag();
        return gmp_self.getMuteFlag();
    };

    /**
     * 获取当前播放时间（注：该函数一定返回 number 类型！）
     * @return {number} 当前播放时长（秒）
     */
    this.getCurrentPlayTime = function () {
        if (!gmp_self.is_mpInstanceExist()) return 0;
        var timeInSec = (gmp_self.dispatcher.impl_getCurrentPlayTime() || 0);
        if (typeof timeInSec === "string") timeInSec = get_as_int(timeInSec);// 转换为int类型给上层（因为某些盒子取到的值为string类型）
        if (timeInSec <= 0) _varMgrTool.fastOpr.resetFastSeekOpr();
        return timeInSec;
    };

    /**
     * 设置视频总时长（某些地区平台，无MediaPlayer接口可获取总时长，需要其它http单独接口获取，然后再统一管理在此类返回）
     * @param duration [number] 总时长数值（秒）
     */
    this.setMediaDuration = function (duration) {
        m_duration = typeof duration !== "number" ? 0 : duration;
        m_printLog('须知：[' + m_carrierId + ']-->手动设置总时长：' + duration, 'd');
    };

    /**
     * 获取总时长（注：该函数一定返回 number 类型！）
     * @param isUsedCache [boolean] 是否使用上一次取值缓存。true-表示使用上一次获取的“有效总时长”。false或不传或非boolean类型，每次重新获取！
     * @return {number} 总时长（秒）
     */
    this.getMediaDuration = function (isUsedCache) {
        if (!gmp_self.is_mpInstanceExist()) return 0;

        var timeInSec = 0;

        // 为了减少频繁的底层调用，一定程度优化性能。先得到上一次的有效缓存（1. 总时长一般不会每次都变化不一样！2.暂认为大于0
        // 为有效总时长）：若有效，直接使用。否则，重新从底层请求获取。Added by Songhui on 2019-11-12
        if (typeof isUsedCache !== "boolean") isUsedCache = false;
        if (isUsedCache) {
            // ****使用缓存****
            timeInSec = get_as_int(m_duration); //拿到上一次缓存总时长
            timeInSec = timeInSec <= 0 ? (gmp_self.dispatcher.impl_getMediaDuration() || 0) : timeInSec; //校验若无效，最新获取
        } else {
            // ****最新获取****
            timeInSec = (gmp_self.dispatcher.impl_getMediaDuration() || 0);
        }

        if (typeof timeInSec === "string") timeInSec = get_as_int(timeInSec);// 转换为int类型给上层（因为某些盒子取到的值为string类型）
        m_duration = timeInSec; //缓存总时长，以便下次使用缓存选择时直接使用

        return timeInSec;
    };

    /**
     * 一次性获取出“播放进度”和“总时长”
     * @param isUsedCache [boolean] 是否使用上一次取值缓存。true-表示使用上一次获取的“有效总时长”。false或不传或非boolean类型，每次重新获取！
     * @return {{duration: number, position: number}}
     */
    this.getTimes = function (isUsedCache) {
        return {
            position: gmp_self.getCurrentPlayTime(),
            duration: gmp_self.getMediaDuration(isUsedCache)
        }
    };

    /**
     * 停止播放，释放资源。
     */
    this.destroy = function () {
        if (gmp_self.is_mpInstanceExist()) {
            try {
                gmp_self.dispatcher.impl_stop();
                gmp_self.dispatcher.impl_release();
            } catch (e) {
                m_printLog("[destroy]-->error: " + e.toString(), 'e');
            }
        }
    };

    /**
     * 停止播放
     */
    this.stop = function () {
        if (gmp_self.is_mpInstanceExist()) {
            try {
                gmp_self.dispatcher.impl_stop();
            } catch (e) {
                m_printLog("[stop]-->error: " + e.toString(), 'e');
            } finally {
                gmp_self.setSpeed(1);
                gmp_self.setPlayerState(m_State.PLAY);
            }
        }
    };

    /**
     * 检查“MediaPlayer类”（MediaPlayer类、或者某平台基于MediaPlayer再次封装的别名播放器类）是否存在，这是做任何
     * MediaPlayer 操作前的必要判断。
     * @return {boolean} true-存在类 false-不存在该类
     */
    this.is_mpClassExist = function () {
        return gmp_self.dispatcher.impl_is_mpClassExist();
    };

    /**
     * 检查当前创建的“全局播放器实例”是否有效，这是做任何 MediaPlayer 操作前的必要判断。
     * @return {boolean} true-g_mp实例有效 false-g_mp实例无效
     */
    this.is_mpInstanceExist = function () {
        return gmp_self.dispatcher.impl_is_mpInstanceExist();
    };


    /**
     * 判断视频是否正在播放中
     * @return {boolean} 是否正在播放中 true-是 false-否
     */
    this.isPlaying = function () {
        return gmp_self.dispatcher.impl_is_mpPlaying();
    };

    /** 播放开始 */
    this.isBeginning = function (keyCode) {
        return keyCode === "EVENT_MEDIA_BEGINING";
    };

    /** 播放结束 */
    this.isEnd = function (keyCode) {
        return keyCode === "EVENT_MEDIA_END";
    };

    /** 播放出错 */
    this.isError = function (keyCode) {
        return keyCode === "EVENT_MEDIA_ERROR";
    };

    /** 播放模式改变 */
    this.isPlayModeChanged = function (keyCode) {
        return keyCode === "EVENT_PLAYMODE_CHANGE";
    };

    /** 是否为高清平台 */
    this.isHD = function () {
        return m_lmsl !== "sd"; //若无效""，则默认按hd处理
    };

    /**
     * 通过“当前时长”和“总时长”比较（当且仅当该2值有效的大于0），判断是否播放结束。
     * @return {boolean} true-结束 false-未结束
     */
    this.checkPlayEndManually = function () {
        var curPlayTimeMoment = gmp_self.getCurrentPlayTime();
        var playDuration = gmp_self.getMediaDuration();
        if (curPlayTimeMoment > 0 && playDuration > 0) {
            return curPlayTimeMoment === playDuration;
        } else {
            return false;
        }
    };

    /** 获取播放串 */
    /**
     * 格式化播放串
     * @param mediaUrl [string] 原始播放串
     * @param isNeedFormatPlayUrl [boolean] 是否需要格式化播放串（可选）（注：未传递时默认true，即需要格式播放串）
     * @return {*|string|string}
     */
    this.formatMediaStr = function (mediaUrl, isNeedFormatPlayUrl) {
        var isFormattedUrl = (typeof isNeedFormatPlayUrl === "boolean" ? isNeedFormatPlayUrl : true); //未传递时默认true，即需要格式播放串
        if (isFormattedUrl) return (gmp_self.dispatcher.impl_getFormatMediaStr(mediaUrl) || "");
        else return mediaUrl;
    };

    ////////////////////////////////////// SETTER/GETTER区 //////////////////////////////////////////////
    /**
     * 设置播放倍速
     * @param speed 可选值[1, 2, 4, 8, 16, 32, 64]
     * @private 目前仅供内部调用
     */
    this.setSpeed = function (speed) {
        m_speed = speed;
    };

    /**
     * 返回当前播放倍速
     * @returns {number} 1：正常倍速
     * @see 可选值 [1, 2, 4, 8, 16, 32, 64]
     */
    this.getSpeed = function () {
        return m_speed;
    };

    /**
     * 设置播放播放器状态
     * @param state
     * @see {@link __LMMediaPlayerSdk.State}
     */
    this.setPlayerState = function (state) {
        m_state = state;
    };

    /**
     * 返回当前播放状态
     * @returns {string|*}
     * @see {@link __LMMediaPlayerSdk.State}
     */
    this.getPlayerState = function () {
        return m_state;
    };

    /**
     * 获取静音状态标志（0-有声 1-静音）
     * @return number [number] 标志（0-有声 1-静音）
     * @see {@link __LMMediaPlayerSdk.MuteFlag}
     */
    this.getMuteFlag = function () {
        return gmp_self.dispatcher.impl_getMuteFlag();
    };

    /**
     * 是否静音
     * @returns {boolean} true：处于静音状态，false：处于有声状态
     */
    this.isMuted = function () {
        return m_MuteFlag.ON === gmp_self.getMuteFlag();
    };

    /**
     * 是否从倍速中重新恢复播放状态
     * @returns {boolean} false：未恢复，仍处于倍速播放中，true：从倍速恢复为正常播放
     */
    this.isSpeedResumed = function () {
        return m_isSpeedResumed;
    };

    ////////////////////////////////////// 不同平台SETTER/GETTER区(尾部区域) //////////////////////////////////////////////
    /**
     * 平台化的控制变量管理
     * @author Songhui
     */
    var _varMgrTool = {
        // 快操作定时器，主要用于某些平台的快操作接口只触发一次。为了集成现有通用逻辑以复用，添加此定时器循环操作，直至用户触发结束并销毁！
        fastOpr: (function () {
            var clazz = function () {
                var _self = this;
                var _fastTimer = null;              //中国联通-湖南省：快操作定时器

                this.startDelay = function (handler, delayInMilliSec, TAG) {
                    if (typeof delayInMilliSec !== "number") delayInMilliSec = 200;
                    m_printLog("[快操作-" + TAG + "][" + m_carrierId + "-" + m_areaCode + "]：开始（" + delayInMilliSec + "ms）", 'v');

                    // 中国联通
                    if (m_carrierId === "000051" && m_areaCode === "231") { //湖南省
                        (_fastTimer && clearInterval(_fastTimer)) || (_fastTimer = null);
                        _fastTimer = setInterval(handler, delayInMilliSec);
                    }
                };

                this.release = function () {
                    // 中国联通
                    if (m_carrierId === "000051" && m_areaCode === "231") { //湖南省
                        (_fastTimer && clearInterval(_fastTimer)) || (_fastTimer = null);
                    }
                };

                // 强制重置快操作（快进/快退）为正常倍速。应用：当快进/快退到头或尾时，需要检查并强制统一归置状态
                this.resetFastSeekOpr = function () {
                    // 中国联通
                    if (m_carrierId === "000051" && m_areaCode === "231") { //湖南省 TODO 待定：该场景调优不只 联通-湖南，所有地区都需要，后期依次增加适配，完毕后可放开if判断！
                        // 快进/快退 时，无效的继续该操作应该被终止！
                        if (LMEPG.Func.array.contains(m_state, [m_State.FAST_FORWARD, m_State.FAST_REWIND])) {
                            m_printLog("[快操作][" + m_carrierId + "-" + m_areaCode + "]：已经无效，强制终止!", 'i');
                            _self.release();
                            gmp_self.resume();
                        }
                    }
                };
            };
            return new clazz();
        })(), // #End of _varMgrTool$fastOpr;
    }; // #End of _varMgrTool

    /**
     * 平台化的接口分发总实现。格式：LMEPG.mp.dispatcher.impl_doYourImplementation(){}
     * @author Songhui
     */
    this.dispatcher = {

        // 返回当前的全局播放器实例对象
        impl_mpInstance: function () {
            try {
                switch (m_carrierId) {
                    case "000051"://中国联通
                        switch (m_areaCode) {
                            case "231"://中国联通-湖南省
                                g_mp = (typeof LTtvPlayer !== "undefined" && LTtvPlayer != null) ? LTtvPlayer : null;
                                break;
                        }
                        break;
                    default://默认通用
                        break;
                }
            } catch (e) {
                m_printLog("[mpInstance]-->error: " + e.toString(), 'e');
            }

            return g_mp;
        },

        // 判断是否存在“播放器类”，一切的基础！
        impl_is_mpClassExist: function () {
            var hasMPObj = false;
            try {
                switch (m_carrierId) {
                    case "000051"://中国联通
                        switch (m_areaCode) {
                            case "231"://中国联通-湖南省
                                hasMPObj = (typeof LTtvPlayer !== "undefined" && LTtvPlayer != null);
                                break;
                            default://默认通用
                                hasMPObj = (typeof MediaPlayer !== "undefined" && MediaPlayer != null);
                                break;
                        }
                        break;
                    default://默认通用
                        hasMPObj = (typeof MediaPlayer !== "undefined" && MediaPlayer != null);
                        break;
                }
            } catch (e) {
                m_printLog("[isMediaPlayerExit]-->error: " + e.toString(), 'e');
            }
            return hasMPObj;
        },

        // 判断“全局的播放器实例”是否有效，一切的基础！
        impl_is_mpInstanceExist: function () {
            try {
                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (m_isCUCCPush) {
                            return true;
                        } else {
                            switch (m_areaCode) {
                                case "231"://中国联通-湖南省
                                    return (typeof LTtvPlayer !== "undefined" && LTtvPlayer != null);
                                default://默认通用
                                    return !!g_mp;
                            }
                        }
                    default://默认通用
                        return !!g_mp;
                }
            } catch (e) {
                m_printLog("[is_mpInstanceExist]-->error: " + e.toString(), 'e');
            }
            return !!g_mp;
        },

        // 判断“是否正在播放”
        impl_is_mpPlaying: function () {
            var isInit = gmp_self.dispatcher.impl_is_mpInstanceExist();
            if (!isInit) {
                m_printLog("[is_mpPlaying]-->error: 未初始化实例！", 'w');
                return false;
            }
            try {
                switch (m_carrierId) {
                    case "000051"://中国联通
                        switch (m_areaCode) {
                            case "231"://中国联通-湖南省
                                return (typeof LTtvPlayer !== "undefined" && LTtvPlayer.isPlaying());
                            default://默认通用
                                return (typeof g_mp.isPlaying === "function" && g_mp.isPlaying());
                        }
                    default://默认通用
                        return (typeof g_mp.isPlaying === "function" && g_mp.isPlaying());
                }
            } catch (e) {
                m_printLog("[is_mpPlaying]-->error: " + e.toString(), 'e');
            }
            return false;
        },

        // 快进
        impl_fastForward: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                        // m_areaCode === "231"/*中国联通-湖南省*/ ? LTtvPlayer.forward(self.getSpeed()) : g_mp.fastForward(self.getSpeed())
                        console.log("[lmplayer.js]--(impl_fastForward)--m_isCUCCPush--" + m_isCUCCPush);
                        if (m_isCUCCPush) {
                            var go_time = parseInt(window.mp.getCurrentPlayTime());
                            go_time = go_time + gmp_self.getSpeed();
                            var totalTime = parseInt(window.mp.getMediaDuration());
                            if (go_time < totalTime) {
                                window.mp.fastForward(gmp_self.getSpeed());
                            }
                        } else if (m_areaCode === "231") {/*中国联通-湖南省*/
                            LTtvPlayer.forward(gmp_self.getSpeed());
                            _varMgrTool.fastOpr.startDelay(function () {
                                LTtvPlayer.forward(gmp_self.getSpeed());
                            }, 200, "快进");
                        } else {
                            g_mp.fastForward(gmp_self.getSpeed());
                        }
                        break;
                    case "440094"://广东广电
                        g_mp.pace = gmp_self.getSpeed();
                        g_mp.refresh();
                        break;
                    case "510094"://四川广电
                        g_mp.setPace(gmp_self.getSpeed());
                        g_mp.refresh();
                        break;
                    default://默认通用
                        g_mp.fastForward(gmp_self.getSpeed());
                        break;
                }
            } catch (e) {
                m_printLog("[fastForward]-->error: " + e.toString(), 'e');
            }
        },

        // 快退
        impl_fastRewind: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                        // m_areaCode === "231"/*中国联通-湖南省*/ ? LTtvPlayer.rewind(self.getSpeed()) : g_mp.fastRewind(-self.getSpeed());
                        if (m_isCUCCPush) {
                            var go_time = parseInt(window.mp.getCurrentPlayTime());
                            go_time = go_time - gmp_self.getSpeed();
                            if (go_time > 0) {
                                window.mp.fastRewind(gmp_self.getSpeed());
                            }
                        } else if (m_areaCode === "231") {/*中国联通-湖南省*/
                            LTtvPlayer.rewind(gmp_self.getSpeed());
                            _varMgrTool.fastOpr.startDelay(function () {
                                LTtvPlayer.rewind(gmp_self.getSpeed());
                            }, 200, "快退");
                        } else {
                            g_mp.fastRewind(-gmp_self.getSpeed());
                        }
                        break;
                    case "440094"://广东广电
                        g_mp.pace = -gmp_self.getSpeed();
                        g_mp.refresh();
                        break;
                    case "510094"://四川广电
                        g_mp.setPace(-gmp_self.getSpeed());
                        g_mp.refresh();
                        break;
                    default://默认通用
                        g_mp.fastRewind(-gmp_self.getSpeed());
                        break;
                }
            } catch (e) {
                m_printLog("[fastRewind]-->error: " + e.toString(), 'e');
            }
        },

        // 从 暂停/快进/快退 中恢复正常播放
        impl_resume: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (m_isCUCCPush) {
                            window.mp.resume();
                        } else {
                            m_areaCode === "231"/*中国联通-湖南省*/ ? LTtvPlayer.resume() : g_mp.resume();
                        }
                        break;
                    case "440094"://广东广电
                        g_mp.pace = 1;
                        g_mp.refresh();
                        break;
                    case "510094"://四川广电
                        g_mp.setPace(1);
                        g_mp.refresh();
                        g_mp.resume();
                        break;
                    case "220094"://吉林
                    case "10220094"://吉林
                        var stbType1 = LMEPG.STBUtil ? LMEPG.STBUtil.getSTBModel() : "";
                        LMEPG.Log.info("impl_resume stbType:" + stbType1);
                        if ((stbType1.toUpperCase().indexOf("UNT400G") < 0) ||
                            (stbType1.toUpperCase().indexOf("S-010W-AV2S") < 0) ||
                            (stbType1.toUpperCase().indexOf("S65") < 0) ||
                            (stbType1.toUpperCase().indexOf("NL5101RK3228H") < 0)) {
                            LMEPG.Log.info("impl_resume:time:" + time);
                            g_mp.resume();
                            g_mp.playByTime(1, parseInt(time) + 1);
                        } else {
                            g_mp.resume();
                        }
                        break;
                    default://默认通用
                        g_mp.resume();
                        break;
                }
            } catch (e) {
                m_printLog("[resume]-->error: " + e.toString(), 'e');
            } finally {
                _varMgrTool.fastOpr.release();
            }
        },

        /// 暂停
        impl_pause: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (m_isCUCCPush) {
                            window.mp.pause();
                        } else {
                            m_areaCode === "231"/*中国联通-湖南省*/ ? LTtvPlayer.pause() : g_mp.pause();
                        }
                        break;
                    case "440094"://广东广电
                        g_mp.pause(1);
                        break;
                    case "220094"://吉林
                    case "10220094"://吉林
                        var stbType1 = LMEPG.STBUtil ? LMEPG.STBUtil.getSTBModel() : "";
                        LMEPG.Log.info("impl_pause:stbType1:" + stbType1);
                        if ((stbType1.toUpperCase().indexOf("UNT400G") < 0) ||
                            (stbType1.toUpperCase().indexOf("S-010W-AV2S") < 0) ||
                            (stbType1.toUpperCase().indexOf("S65") < 0) ||
                            (stbType1.toUpperCase().indexOf("NL5101RK3228H") < 0)) {
                            time = g_mp.getCurrentPlayTime();
                            LMEPG.Log.info("impl_pause:getCurrentPlayTime:" + time);
                            g_mp.pause();
                        } else {
                            g_mp.pause();
                        }
                        break;
                    default://默认通用
                        g_mp.pause();
                        break;
                }
            } catch (e) {
                m_printLog("[pause]-->error: " + e.toString(), 'e');
            }
        },

        // 刷新播放
        impl_refresh: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (m_areaCode !== "231"/*中国联通-湖南省:空实现，仅逻辑占位。*/) g_mp.refresh();
                        break;
                    default://默认通用
                        g_mp.refresh();
                        break;
                }
            } catch (e) {
                m_printLog("[refresh]-->error: " + e.toString(), 'e');
            }
        },

        // 启动播放
        impl_play: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (m_areaCode !== "231"/*中国联通-湖南省:空实现，仅逻辑占位。*/) g_mp.play();
                        break;
                    default://默认通用
                        g_mp.play();
                        break;
                }
            } catch (e) {
                m_printLog("[play]-->error: " + e.toString(), 'e');
            }
        },

        // 停止播放
        impl_stop: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (!m_isCUCCPush) {
                            m_areaCode === "231"/*中国联通-湖南省*/ ? LTtvPlayer.stop() : g_mp.stop();
                        }
                        break;
                    default://默认通用
                        g_mp.stop();
                        break;
                }
            } catch (e) {
                m_printLog("[stop]-->error: " + e.toString(), 'e');
            }
        },

        // 释放插口
        impl_release: function () {
            try {
                if (m_carrierId == '000051' && m_isCUCCPush && window.mp.getIsReady()) {
                    //window.mp.pause();
                    //window.mp.hideMedia();
                    return;
                }

                if (!g_mp) return;

                if (typeof g_mp.releasePlayerInstance !== "undefined") {
                    g_mp.releasePlayerInstance();
                }
                if (typeof g_mp.unbindNativePlayerInstance !== "undefined") {    //例如：四川广电
                    g_mp.unbindNativePlayerInstance(m_instanceID);
                }
                if (typeof g_mp.unbindPlayerInstance !== "undefined") {          //例如：四川广电
                    g_mp.unbindPlayerInstance(m_instanceID);
                }
                if (typeof g_mp.releaseMediaPlayer !== "undefined") {            //例如：山东电信
                    g_mp.releaseMediaPlayer(m_instanceID);
                }
            } catch (e) {
                m_printLog("[release]-->error: " + e.toString(), 'e');
            } finally {
                g_mp = null; //必须：重置状态，释放内存！！！
            }
        },

        // 时移播放
        impl_playByTime: function (second) {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (m_isCUCCPush) {
                            window.mp.playByTime(0, second); // 跳转播放时间点
                        } else {
                            m_areaCode === "231"/*中国联通-湖南省*/ ? LTtvPlayer.seekTo(second * 1000/*millis*/) : g_mp.playByTime(1, second);
                        }
                        break;
                    case "440094"://广东广电
                        g_mp.point = second;
                        g_mp.play();
                        break;
                    default://默认通用
                        g_mp.playByTime(1, second);
                        break;
                }
            } catch (e) {
                m_printLog("[playByTime]-->error: " + e.toString(), 'e');
            }
        },

        // 获取当前播放时间
        impl_getCurrentPlayTime: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return 0;
                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (m_isCUCCPush) {
                            return window.mp.getCurrentPlayTime();
                        } else {
                            return m_areaCode === "231"/*中国联通-湖南省*/ ? (LTtvPlayer.getPosition() || 0) : (g_mp.getCurrentPlayTime() || 0);
                        }
                    case "440094"://广东广电
                        return (g_mp.currentPoint || 0);
                    default://默认通用
                        return (g_mp.getCurrentPlayTime() || 0);
                }
            } catch (e) {
                m_printLog("[getCurrentPlayTime]-->error: " + e.toString(), 'e');
                return 0;
            }
        },

        // 获取总时长
        impl_getMediaDuration: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return 0;
                switch (m_carrierId) {
                    case "000051"://中国联通
                        if (m_isCUCCPush) {
                            return window.mp.getMediaDuration();
                        } else {
                            return m_areaCode === "231"/*中国联通-湖南省*/ ? (LTtvPlayer.getDuration() || 0) : (g_mp.getMediaDuration() || 0);
                        }
                    case "440094"://广东广电
                    case "510094"://四川广电
                        return m_duration;
                    default://默认通用
                        return (g_mp.getMediaDuration() || 0);//还没加载时一般获取到的是NaN或者0;
                }
            } catch (e) {
                m_printLog("[getMediaDuration]-->error: " + e.toString(), 'e');
                return 0;
            }
        },

        // 反选静音
        impl_toggleMuteFlag: function () {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "440094"://广东广电
                        gmp_self.isMuted() ? g_mp.audioUnmute() : g_mp.audioMute();
                        break;
                    default://默认通用
                        g_mp.setMuteFlag(gmp_self.isMuted() ? m_MuteFlag.OFF : m_MuteFlag.ON);
                        break;
                }
            } catch (e) {
                m_printLog("[toggleMuteFlag]-->error: " + e.toString(), 'e');
            }
        },

        // 获取静音状态标志（0-有声 1-静音）
        impl_getMuteFlag: function () {
            try {
                switch (m_carrierId) {
                    case "440094"://广东广电
                        return g_mp.getMute();
                    default://默认通用
                        return g_mp.getMuteFlag();
                }
            } catch (e) {
                m_printLog("[getMuteFlag]-->error: " + e.toString(), 'e');
                return m_MuteFlag.OFF;
            }
        },

        // 获取音量
        impl_getVolume: function () {
            try {
                switch (m_carrierId) {
                    case "440094"://广东广电EPG
                        return (gmp_self.dispatcherInteractBehavior.getVolume440094() || 0);
                    default://默认通用
                        if (g_mp) return (g_mp.getVolume() || 0);
                        else return 0;
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->获取音量（getVolume）发生异常：" + e.toString(), 'e');
                return 0;
            }
        },

        // 设置音量
        impl_setVolume: function (volume) {
            try {
                switch (m_carrierId) {
                    case "440094"://广东广电EPG
                        return (gmp_self.dispatcherInteractBehavior.setVolume440094(volume) || 0);
                    default://默认通用
                        if (g_mp) g_mp.setVolume(volume);
                        break;
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->获取音量（getVolume）发生异常：" + e.toString(), 'e');
                return 0;
            }
        },

        // 音量+
        impl_upVolume: function (absOffsetUnit/*改变的音量偏移量（正整数）*/) {
            try {
                // 计算默认“+”音量偏移量数值！！！
                var realAbsOffset = typeof absOffsetUnit === "number" ? Math.abs(absOffsetUnit) : 0;
                switch (m_carrierId) {
                    case "440094"://广东广电EPG
                        realAbsOffset = realAbsOffset !== 0 ? realAbsOffset : 2; //默认改变值：2
                        return gmp_self.dispatcherInteractBehavior.changeVolume440094(32, +realAbsOffset);
                    default://默认通用
                        realAbsOffset = realAbsOffset !== 0 ? realAbsOffset : 5; //其它默认改变值：5
                        return gmp_self.dispatcherInteractBehavior.changeVolumeDefault(100, +realAbsOffset);
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->音量+（upVolume）发生异常：" + e.toString(), 'e');
                return 0;
            }
        },

        // 音量-
        impl_downVolume: function (absOffsetUnit/*改变的音量偏移量（正整数）*/) {
            try {
                // 计算默认“+”音量偏移量数值！！！
                var realAbsOffset = typeof absOffsetUnit === "number" ? Math.abs(absOffsetUnit) : 0;
                switch (m_carrierId) {
                    case "440094"://广东广电EPG
                        realAbsOffset = realAbsOffset !== 0 ? realAbsOffset : 2; //默认改变值：2
                        return gmp_self.dispatcherInteractBehavior.changeVolume440094(32, -realAbsOffset);
                    default://默认通用
                        realAbsOffset = realAbsOffset !== 0 ? realAbsOffset : 5; //其它默认改变值：5
                        return gmp_self.dispatcherInteractBehavior.changeVolumeDefault(100, -realAbsOffset);
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->音量-（downVolume）发生异常：" + e.toString(), 'e');
                return 0;
            }
        },

        // 组织 mp.setSingleMedia/mp.setMediaSource 所需的播放器格式，个别地区可能不一样，需要个性化设置
        impl_getFormatMediaStr: function (mediaUrl) {
            try {
                switch (m_carrierId) {
                    case "220094"://吉林广电EPG（联通）
                    case "10220094"://吉林广电EPG（联通）
                        return gmp_self.dispatcherUrl.getFormatMediaStr220094(mediaUrl);
                    case "220095"://吉林广电EPG（电信）
                    case "10220095"://吉林广电EPG（电信）魔方
                        return gmp_self.dispatcherUrl.getFormatMediaStr220095(mediaUrl);
                    case '370092'://山东电信EPG
                        return gmp_self.dispatcherUrl.getFormatMediaStr370092(mediaUrl);
                    case '10000051':
                    case '000051':
                        var stbModel = LMEPG.STBUtil ? LMEPG.STBUtil.getSTBModel() : "";
                        if (stbModel && stbModel.indexOf('B860A') >= 0) {
                            return gmp_self.dispatcherUrl.getFormatMediaStr10000051(mediaUrl);
                        } else {
                            return gmp_self.dispatcherUrl.getFormatMediaStrDefault(mediaUrl);
                        }
                    default://默认通用
                        return gmp_self.dispatcherUrl.getFormatMediaStrDefault(mediaUrl);
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->组织播放串（formatMediaStr）发生异常：" + e.toString(), 'e');
                return "";
            }
        },

        // 初始化选择（一）模式1：不使用系统默认的播放器UI，音量调节UI是自定义UI
        impl_initPlayerMode1/*数字1非字母l*/: function () {
            if (!gmp_self.is_mpClassExist()) return; //校验1：判断“类”是否存在？-->若“不存在”则结束，因无法实例化！！！
            if (gmp_self.is_mpInstanceExist()) return; //校验1：判断“类实例对象”是否存在？-->若“已存在”则结束，无需重复实例化，规避内存增大！！！

            try {
                switch (m_carrierId) {
                    case "000051"://中国联通
                        gmp_self.dispatcherInitInstance.initPlayerByMode1000051();
                        break;
                    default://默认通用
                        gmp_self.dispatcherInitInstance.initPlayerByMode1Default();
                        break;
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->初始化播放器（initPlayerMode1）发生异常：" + e.toString(), 'e');
            }
        },

        // 初始化选择（二）通过绑定模式，初始化播放器且：不使用系统默认的播放器UI，音量调节UI是自定义UI
        impl_initPlayerByBindWithCustomUI: function () {
            if (!gmp_self.is_mpClassExist()) return; //校验1：判断“类”是否存在？-->若“不存在”则结束，因无法实例化！！！
            if (gmp_self.is_mpInstanceExist()) return; //校验1：判断“类实例对象”是否存在？-->若“已存在”则结束，无需重复实例化，规避内存增大！！！

            try {
                switch (m_carrierId) {
                    case "000051"://中国联通
                        gmp_self.dispatcherInitInstance.initPlayerByBindWithCustomUI000051();
                        break;
                    default://默认通用
                        gmp_self.dispatcherInitInstance.initPlayerByBindWithCustomUIDefault();
                        break;
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->初始化播放器（initPlayerByBindWithCustomUI）发生异常：" + e.toString(), 'e');
            }
        },

        // 初始化选择（三）“初始化init”方式实例化播放器
        impl_initPlayerByInit: function () {
            if (!gmp_self.is_mpClassExist()) return; //校验1：判断“类”是否存在？-->若“不存在”则结束，因无法实例化！！！
            if (gmp_self.is_mpInstanceExist()) return; //校验1：判断“类实例对象”是否存在？-->若“已存在”则结束，无需重复实例化，规避内存增大！！！

            try {
                console.log("impl_initPlayerByInit 初始化播放器 m_carrierId : " + m_carrierId)
                switch (m_carrierId) {
                    case "000051"://中国联通
                    case "11000051"://乐动传奇
                        gmp_self.dispatcherInitInstance.initPlayerByInit000051();
                        break;
                    case "440094"://广东广电
                        gmp_self.dispatcherInitInstance.initPlayerByInit440094();
                        break;
                    default://默认通用
                        gmp_self.dispatcherInitInstance.initPlayerByInitDefault();
                        break;
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->初始化播放器（initPlayerByInit）发生异常：" + e.toString(), 'e');
            }
        }, // #End of impl_initPlayerByInit

        // “绑定bind”方式实例化播放器
        impl_initPlayerByBind: function () {
            if (!gmp_self.is_mpClassExist()) return;
            LMEPG.Log.debug('>>>>> Player.js ---> impl_initPlayerByBind');
            try {
                switch (m_carrierId) {
                    case "460092"://海南电信EPG
                        gmp_self.dispatcherInitInstance.initPlayerByBind460092();
                        break;
                    case "510094"://四川广电EPG
                        gmp_self.dispatcherInitInstance.initPlayerByBind510094();
                        break;
                    default://默认通用
                        gmp_self.dispatcherInitInstance.initPlayerByBindDefault();
                        break;
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->初始化播放器（initPlayerByBind）发生异常：" + e.toString(), 'e');
            }
        }, // #End of impl_initPlayerByBind

        // 大窗播放，注意前提必须对MediaPlayer完成初始化（bind or init）
        impl_playOfFullscreen: function (mediaUrl, isNeedFormatPlayUrl) {
            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                    case "11000051"://乐动传奇
                        gmp_self.dispatcherPlayBehavior.playOfFullOrSmallScreen000051(mediaUrl, false, isNeedFormatPlayUrl);
                        break;
                    case "440094"://广东广电EPG
                        gmp_self.dispatcherPlayBehavior.playOfFullOrSmallScreen440094(mediaUrl, false);
                        break;
                    case "510094"://四川广电EPG
                        gmp_self.dispatcherPlayBehavior.playOfFullOrSmallScreen510094(mediaUrl, false);
                        break;
                    default://默认通用
                        m_printLog("[" + m_carrierId + "][lmplayer]-->大窗播放（playOfFullscreenDefault）mediaUrl：" + mediaUrl + " isNeedFormatPlayUrl:" + isNeedFormatPlayUrl);
                        gmp_self.dispatcherPlayBehavior.playOfFullscreenDefault(mediaUrl, isNeedFormatPlayUrl);
                        break;
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->大窗播放（playOfFullscreen）发生异常：" + e.toString(), 'e');
            }
        }, // #End of impl_playOfFullscreen

        // 小窗播放，注意前提必须对MediaPlayer完成初始化（bind or init）
        impl_playOfSmallscreen: function (mediaUrl, left, top, width, height, isNeedFormatPlayUrl, playByTimeSeconds) {

            try {
                if (!gmp_self.is_mpInstanceExist()) return;

                switch (m_carrierId) {
                    case "000051"://中国联通
                    case "11000051"://乐动传奇
                        gmp_self.dispatcherPlayBehavior.playOfFullOrSmallScreen000051(mediaUrl, true, isNeedFormatPlayUrl, left, top, width, height, playByTimeSeconds);
                        break;
                    case "440094"://广东广电EPG
                        gmp_self.dispatcherPlayBehavior.playOfFullOrSmallScreen440094(mediaUrl, true, left, top, width, height);
                        break;
                    case "510094"://四川广电EPG
                        gmp_self.dispatcherPlayBehavior.playOfFullOrSmallScreen510094(mediaUrl, true, left, top, width, height);
                        break;
                    case "10000051":
                        gmp_self.dispatcherPlayBehavior.playOfSmallScreen10000051(mediaUrl, left, top, width, height, isNeedFormatPlayUrl, playByTimeSeconds);
                        break;
                    default://默认通用
                        gmp_self.dispatcherPlayBehavior.playOfSmallscreenDefault(mediaUrl, left, top, width, height, isNeedFormatPlayUrl, playByTimeSeconds);
                        break;
                }
            } catch (e) {
                m_printLog("[" + m_carrierId + "][lmplayer]-->小播播放（playOfSmallscreen）发生异常：" + e.toString(), 'e');
            }
        }, // #End of impl_playOfFullscreen

    }; // #End of LMEPG.mp$dispatcher

    /**
     * 单一职责，平台化接口分发：仅初始化实例
     * @author Songhui
     */
    this.dispatcherInitInstance = {

        // 模式1：不使用系统默认的播放器UI，音量调节UI是自定义UI
        initPlayerByMode1Default: function () {
            try {
                if (!gmp_self.is_mpClassExist()) {
                    return;
                }

                g_mp = new MediaPlayer();                               // 创建播放实例
                var instanceId = g_mp.getNativePlayerInstanceID();      // 本地播放器实例
                var playListFlag = 0;                                   // 0、单媒体播放  1、多媒体播放
                var videoDisplayMode = 1;                               // 显示模式：0、自定义尺寸 1、全屏(默认) 2、按宽度显示 3、按高度显示 255、不显示在背后播放
                var height = 100;                                       // 播放窗口的高度
                var width = 100;                                        // 播放窗口的宽带
                var left = 50;                                          // 播放窗口到浏览器左边的距离，自定义尺寸必须指定
                var top = 50;                                           // 播放窗口到浏览器顶部的距离，自定义尺寸必须指定
                var muteFlag = 0;                                       // 静音标志： 0、有声(默认) 1、静音
                var useNativeUIFlag = 0;                                // 本地UI显示标志: 0、不使用本地自带UI 1、使用本地自带UI(默认)
                var subtitleFlag = 0;                                   // 字幕显示标志：0、不显示字幕(默认) 1、显示字幕
                var videoAlpha = 0;                                     // 透明度设置（0-100）：  0、不透明(默认) 100、完全透明
                var cycleFlag = 1;                                      // 循环播放标志：0、循环播放（默认值）, 1、单次播放
                var randomFlag = 0;                                     // 随机播放标志
                var autoDelFlag = 0;                                    // 自动删除标志
                g_mp.initMediaPlayer(instanceId, playListFlag, videoDisplayMode,
                    height, width, left, top, muteFlag,
                    useNativeUIFlag, subtitleFlag, videoAlpha,
                    cycleFlag, randomFlag, autoDelFlag);
                g_mp.setAllowTrickmodeFlag(0);                          // 是否允许播放期间TrickMode操作： 0、允许 1、不允许(默认值)
                g_mp.setProgressBarUIFlag(0);                           // 是否显示自带进度条UI： 0、不显示 1、显示（默认）
                if (get_carrier_id() == '10220094' || get_carrier_id() == '220094') {
                    g_mp.setAudioVolumeUIFlag(0);
                } else {
                    g_mp.setAudioVolumeUIFlag(1);                           // 是否显示自带音量UI，0、不显示   1、显示（默认值）
                }
            } catch (e) { //照顾浏览器不报错
                throw e; //交由上层处理，便于根据地区统一调试跟踪
            }
        },

        // 通过绑定模式，初始化播放器且：不使用系统默认的播放器UI，音量调节UI是自定义UI
        initPlayerByBindWithCustomUIDefault: function () {
            try {
                if (!gmp_self.is_mpClassExist()) {
                    return;
                }

                m_isBindMode = true;           // 标志为当前为绑定实例化播放器模式！等待绑定成功虚拟按键回调可能用到，见本类bind()方法
                m_bindPlayerInstance();        // 绑定播放器实例

                g_mp.setAllowTrickmodeFlag(0);      // 是否允许播放期间TrickMode操作： 0、允许 1、不允许(默认值)
                g_mp.setProgressBarUIFlag(0);       // 是否显示自带进度条UI： 0、不显示 1、显示（默认）
                g_mp.setAudioVolumeUIFlag(0);       // 是否显示自带音量UI，0、不显示   1、显示（默认值）
            } catch (e) {
                throw e; //交由上层处理，便于根据地区统一调试跟踪
            }
        },

        // 默认实例初始化：绑定方式
        initPlayerByBindDefault: function () {
            try {
                if (m_carrierId == '000051' && m_isCUCCPush) return // 中国联通非push播放器

                m_isBindMode = true;                           // 标志为当前为绑定实例化播放器模式！等待绑定成功虚拟按键回调可能用到，见本类bind()方法
                m_bindPlayerInstance();                        // 绑定播放器实例
                g_mp.setAllowTrickmodeFlag(0);                      // 是否允许播放期间TrickMode操作： 0、允许 1、不允许(默认值)
                g_mp.setProgressBarUIFlag(0);                       // 是否显示自带进度条UI： 0、不显示 1、显示（默认）
                g_mp.setAudioVolumeUIFlag(1);                       // 是否显示自带音量UI，0、不显示   1、显示（默认值）
            } catch (e) {
                throw e; //交由上层处理，便于根据地区统一调试跟踪
            }
        },

        // 海南电信EPG：bind方式
        initPlayerByBind460092: function () {
            try {
                g_mp = new MediaPlayer();                           // 创建播放实例
                var instance = g_mp.getNativePlayerInstanceID();    // 获取播放器实例ID;
                g_mp.bindNativePlayerInstance(0);                   // 绑定对象，用于多页面
                g_mp.bindNativePlayerInstance(instance);            // 获取本地绑定的默认实例，采用绑定方式，不需要调用initMediaPlayer
                g_mp.setAllowTrickmodeFlag(0);                      // 是否允许播放期间TrickMode操作： 0、允许 1、不允许(默认值)
                g_mp.setProgressBarUIFlag(0);                       // 是否显示自带进度条UI： 0、不显示 1、显示（默认）
                g_mp.setAudioVolumeUIFlag(1);                       // 是否显示自带音量UI，0、不显示
            } catch (e) {
                m_printLog("[initPlayerByBind460092-->发生异常：" + e.toString(), 'e');
            }
        },

        // 四川广电EPG：bind方式
        initPlayerByBind510094: function () {
            try {
                if (!gmp_self.is_mpClassExist()) {
                    return;
                }

                g_mp = new MediaPlayer();

                // 注意接口方法与常用的有差异！
                if (typeof g_mp.getNativePlayerInstanceId !== "undefined") {
                    //例如：四川广电同州版本
                    m_instanceID = g_mp.getNativePlayerInstanceId();           //获取播放器实例
                    m_printLog("[510094][getNativePlayerInstanceId::instanceID]=" + m_instanceID, 'd');
                    g_mp.bindNativePlayerInstance(m_instanceID);               //绑定播放器实例/销毁g_mp.unbindNativePlayerInstance(nativePlayerInstanceID);
                    g_mp.setAllowTrickmodeFlag(0);                                  //是否允许播放期间TrickMode操作： 0、允许 1、不允许(默认值)
                } else if (typeof g_mp.getPlayerInstanceID !== "undefined") {
                    //例如：四川广电非同州版本
                    g_mp = new MediaPlayer();
                    m_instanceID = g_mp.getPlayerInstanceID();                 //获取播放器实例
                    m_printLog("[510094][getPlayerInstanceID::instanceID]=" + m_instanceID, 'd');
                    g_mp.bindPlayerInstance(m_instanceID);                     //绑定播放器实例 bindPlayerInstance/销毁g_mp.unbindPlayerInstance(nativePlayerInstanceID);
                    g_mp.enableTrickMode(true);                                     //设置TrickMode 操作标志。表示该播放器实例在生命周期内是否都允许任何TrickMode操作（包括快进/快退/暂停）
                } else {
                    //其它
                    // self.dispatcherInitInstance.initPlayerByBindDefault();
                    m_printLog("[510094]initPlayerByBind：暂不支持接口实现！", 'w');
                }
            } catch (e) {
                m_printLog("[510094][initPlayerByBind-->发生异常：" + e.toString(), 'e');
            }
        },

        // 默认初始化实例方式
        initPlayerByInitDefault: function () {
            try {
                if (typeof MediaPlayer === "undefined") {
                    return;
                }

                g_mp = new MediaPlayer();                               // 创建播放实例
                var instanceId = g_mp.getNativePlayerInstanceID();      // 本地播放器实例
                var playListFlag = 0;                                   // 0、单媒体播放  1、多媒体播放
                var videoDisplayMode = 1;                               // 显示模式：0、自定义尺寸 1、全屏(默认) 2、按宽度显示 3、按高度显示 255、不显示在背后播放
                var height = 100;                                       // 播放窗口的高度
                var width = 100;                                        // 播放窗口的宽带
                var left = 50;                                          // 播放窗口到浏览器左边的距离，自定义尺寸必须指定
                var top = 50;                                           // 播放窗口到浏览器顶部的距离，自定义尺寸必须指定
                var muteFlag = 0;                                       // 静音标志： 0、有声(默认) 1、静音
                var useNativeUIFlag = 1;                                // 本地UI显示标志: 0、不使用本地自带UI 1、使用本地自带UI(默认)
                var subtitleFlag = 0;                                   // 字幕显示标志：0、不显示字幕(默认) 1、显示字幕
                var videoAlpha = 0;                                     // 透明度设置（0-100）：  0、不透明(默认) 100、完全透明
                var cycleFlag = 1;                                      // 循环播放标志：0、循环播放（默认值）, 1、单次播放
                var randomFlag = 0;                                     // 随机播放标志
                var autoDelFlag = 0;                                    // 自动删除标志
                g_mp.initMediaPlayer(instanceId, playListFlag, videoDisplayMode,
                    height, width, left, top, muteFlag,
                    useNativeUIFlag, subtitleFlag, videoAlpha,
                    cycleFlag, randomFlag, autoDelFlag);
                g_mp.leaveChannel();                                    // 离开直播频道
                g_mp.setAllowTrickmodeFlag(0);                          // 是否允许播放期间TrickMode操作： 0、允许 1、不允许(默认值)
                g_mp.setProgressBarUIFlag(0);                           // 是否显示自带进度条UI： 0、不显示 1、显示（默认）
                g_mp.setAudioVolumeUIFlag(1);                           // 是否显示自带音量UI，0、不显示   1、显示（默认值）
            } catch (e) { //照顾浏览器不报错
                m_printLog("[lmplayer]-->初始化播放器（initPlayer）发生异常：" + e.toString(), 'e');
            }
        },

        // 广东广电EPG：init方式
        initPlayerByInit440094: function () {
            try {
                g_mp = new top.MediaPlayer();                      // 创建播放对象
                g_mp.unBindPlayerInstance();
                var instanceID = g_mp.createPlayerInstance("Video", 2); //获取播放器实例ID;
            } catch (e) {
                throw e;
            }
        },

        // 中国联通：init方式
        initPlayerByInit000051: function () {
            if (!m_isCUCCPush) {
                switch (m_areaCode) {
                    case "231"://中国联通-湖南省
                        // 空实现，仅逻辑占位。直接由LTtvPlayer.play接口初始化并启动播放
                        break;
                    default://默认通用
                        gmp_self.dispatcherInitInstance.initPlayerByInitDefault();
                        break;
                }
            }
        },

        // 中国联通EPG-湖南省：init模式一
        initPlayerByMode1000051: function () {
            switch (m_areaCode) {
                case "231"://中国联通-湖南省
                    // 空实现，仅逻辑占位。直接由LTtvPlayer.play接口初始化并启动播放
                    break;
                default://默认通用
                    gmp_self.dispatcherInitInstance.initPlayerByMode1Default();
                    break;
            }
        },

        // 中国联通EPG-湖南省：init模式一
        initPlayerByBindWithCustomUI000051: function () {
            switch (m_areaCode) {
                case "231"://中国联通-湖南省
                    // 空实现，仅逻辑占位。直接由LTtvPlayer.play接口初始化并启动播放
                    break;
                default://默认通用
                    gmp_self.dispatcherInitInstance.initPlayerByBindWithCustomUIDefault();
                    break;
            }
        },
    }; // #End of LMEPG.mp$dispatcherInitInstance

    /**
     * 单一职责，平台化接口分发：仅开启播放控制（大窗&&小窗）。
     * <p style='color:red'>注：必须在初始化完MediaPlayer实例后，才可调用！</p>
     * @author Songhui
     */
    this.dispatcherPlayBehavior = {

        //******************************* 大窗分发实现 *******************************//

        // 默认全屏大窗方式
        playOfFullscreenDefault: function (mediaUrl, isNeedFormatPlayUrl) {
            try {
                if (!g_mp) return;

                var mediaStr = gmp_self.formatMediaStr(mediaUrl, isNeedFormatPlayUrl);
                g_mp.setSingleMedia(mediaStr);
                g_mp.setVideoDisplayMode(1);                          // 设置播放模式
                g_mp.refreshVideoDisplay();                           // 刷新显示
                g_mp.playFromStart();                                 // 开始播放
            } catch (e) {
                throw e;
            }
        },

        // 广电广电EPG
        playOfFullOrSmallScreen440094: function (mediaUrl, isSmallScreen, left, top, width, height) {
            try {
                if (!g_mp) return;

                var fullscreenFlag = typeof isSmallScreen === "boolean" && isSmallScreen ? 0 : 1; //1-全屏 0-小窗
                var location = fullscreenFlag === 1 ? [0, 0, 0, 0] : [left, top, width, height]; //大窗-无需提供 left/top/width/height，默认为0即可
                g_mp.position = fullscreenFlag + ',' + location[0] + ',' + location[1] + ',' + location[2] + ',' + location[3]; //设置位置参数表示是否全屏
                g_mp.source = mediaUrl; //设置播放地址
                g_mp.play(); //设置源后即播放而非等待获取媒资详情后（解析到总时长）（除非调用refresh）。例如，前期媒资注入平台有同步问题，获取不到详情。因此，不能一直阻塞播放！！！

                m_printLog("[广东广电][" + (!fullscreenFlag ? "小窗" : "大窗") + "]格式串: " + mediaUrl, 'i');
                m_printLog("[广东广电][" + (!fullscreenFlag ? "小窗" : "大窗") + "]位置: " + JSON.stringify(location), 'i');
            } catch (e) {
                m_printLog("[playOfFullOrSmallScreen440094-->发生异常：" + e.toString(), 'e');
            }
        },

        // 四川广电EPG
        playOfFullOrSmallScreen510094: function (mediaUrl, isSmallScreen, left, top, width, height) {
            try {
                if (!g_mp) return;

                if (typeof g_mp.getNativePlayerInstanceId !== "undefined") {
                    //例如：四川广电同州版本
                    g_mp.setSingleMedia(mediaUrl);                                  //设置播放串
                    g_mp.setVideoDisplayMode(isSmallScreen === true ? 0 : 1);       //设置播放模式（0-小窗 1-全屏）
                    if (isSmallScreen) {
                        g_mp.setVideoDisplayArea(left, top, width, height);         //显示区域
                    }
                    g_mp.refreshVideoDisplay();                                     //刷新显示
                    g_mp.playFromStart();                                           //从头播放
                    g_mp.play();                                                    //开始播放
                } else if (typeof g_mp.getPlayerInstanceID !== "undefined") {
                    //例如：四川广电非同州版本
                    g_mp.setMediaSource(mediaUrl);                                  //设置播放串 setMediaSource
                    g_mp.setVideoDisplayMode(isSmallScreen === true ? 0 : 1);       //设置播放模式（0-小窗 1-全屏）
                    if (isSmallScreen) {
                        g_mp.setVideoDisplayArea(new Rectangle(left, top, width, height));  //显示区域
                    }
                    g_mp.refreshVideoDisplay();                                     //刷新显示
                    g_mp.play();                                                    //开始播放
                    g_mp.refresh();                                                 //刷新显示 refresh
                } else {
                    //其它
                    m_printLog("[playOfFullOrSmallScreen510094-->暂不支持接口实现！", 'w');
                    //self.dispatcherPlayBehavior.playOfFullscreenDefault(mediaUrl, 0);
                }
            } catch (e) {
                m_printLog("[playOfFullOrSmallScreen510094-->发生异常：" + e.toString(), 'e');
            }
        },

        // 中国联通EPG-及分省
        playOfFullOrSmallScreen000051: function (mediaUrl, isSmallScreen, isNeedFormatPlayUrl, left, top, width, height, playByTimeSeconds) {
            playByTimeSeconds = (typeof playByTimeSeconds === "number" && playByTimeSeconds >= 0 ? playByTimeSeconds : 0); //播放起始
            m_printLog("[中国联通][开始播放]-原始串: " + mediaUrl, 'v');

            var mediaStr = mediaUrl;
            if (m_isCUCCPush) {
                window.mp.initMediaPlayer(mediaStr, left, top, width, height, playByTimeSeconds);
                var whileFlag = true;
                while (whileFlag) {
                    if (window.mp.getIsReady()) {
                        whileFlag = false;
                    }
                }
            } else {
                switch (m_areaCode) {
                    case "231"://中国联通-湖南省
                        mediaStr = LMEPG.Func.rtsp2http(mediaUrl);//特别注意：该省份播放器必须用http格式的url填充源地址！否则，rtsp会出现马赛克！！！
                        var location = isSmallScreen ? [left, top, width, height] : (gmp_self.isHD() ? [0, 0, 1280, 720] : [0, 0, 640, 530]);
                        m_printLog("[中国联通-湖南省][" + (isSmallScreen ? "小窗" : "大窗") + "]格式串: " + mediaStr, 'i');
                        m_printLog("[中国联通-湖南省][" + (isSmallScreen ? "小窗" : "大窗") + "]位置: " + JSON.stringify(location), 'i');
                        LTtvPlayer.play(mediaStr, location[0], location[1], location[2], location[3], false/*onTop置顶*/, false/*isLooping循环*/, playByTimeSeconds/*position播放起始位置*/);
                        break;
                    default://默认通用
                        var protocol = mediaUrl.substring(0, 4);
                        var stbModel = LMEPG.STBUtil.getSTBModel();
                        if ((stbModel.indexOf('B860A') >= 0 || stbModel.indexOf('EC6108V9E') >= 0 || stbModel.indexOf('BV310') >= 0) && stbModel !== 'B860AV1.2' && protocol === "rtsp") {
                            mediaStr = LMEPG.Func.rtsp2http(mediaStr);
                        } else {
                            mediaStr = LMEPG.Func.http2rtsp(mediaUrl);//特别注意：该地区默认使用转换为rtsp格式
                        }
                        if (isSmallScreen) {
                            gmp_self.dispatcherPlayBehavior.playOfSmallscreenDefault(mediaStr, left, top, width, height, isNeedFormatPlayUrl, playByTimeSeconds);
                        } else {
                            gmp_self.dispatcherPlayBehavior.playOfFullscreenDefault(mediaStr, isNeedFormatPlayUrl);
                        }
                        break;
                }
            }
        },

        playOfSmallScreen10000051: function (mediaUrl, left, top, width, height, isNeedFormatPlayUrl, playByTimeSeconds) {
            try {
                var stbModel = LMEPG.STBUtil ? LMEPG.STBUtil.getSTBModel() : "";
                var protocol = mediaUrl.substring(0, 4);
                if (stbModel && stbModel.indexOf('B860A') >= 0 && protocol === "rtsp") {
                    mediaUrl = mediaUrl.replace("rtsp://", "http://");
                }
                var mediaStr = gmp_self.formatMediaStr(mediaUrl, isNeedFormatPlayUrl);
                g_mp.setSingleMedia(mediaStr);
                g_mp.setVideoDisplayMode(0);
                g_mp.setVideoDisplayArea(left, top, width, height);
                g_mp.refreshVideoDisplay();
                g_mp.playFromStart();
                if (typeof playByTimeSeconds === "number" && playByTimeSeconds >= 0) {
                    gmp_self.playByTime(playByTimeSeconds);
                } else {
                    g_mp.play();
                }
            } catch (e) {
                throw e;
            }
        },

        //******************************* 小窗分发实现 *******************************//

        // 默认小窗方式
        playOfSmallscreenDefault: function (mediaUrl, left, top, width, height, isNeedFormatPlayUrl, playByTimeSeconds) {
            try {
                var mediaStr = gmp_self.formatMediaStr(mediaUrl, isNeedFormatPlayUrl);
                m_printLog("[中国联通][开始播放]-播放串: " + mediaStr, 'v');
                g_mp.setSingleMedia(mediaStr);
                g_mp.setVideoDisplayMode(0);
                g_mp.setVideoDisplayArea(left, top, width, height);
                g_mp.refreshVideoDisplay();
                g_mp.playFromStart();
                if (typeof playByTimeSeconds === "number" && playByTimeSeconds >= 0) {
                    gmp_self.playByTime(playByTimeSeconds);
                } else {
                    g_mp.play();
                }
            } catch (e) {
                throw e;
            }
        },

    }; // #End of LMEPG.mp$dispatcherPlayBehavior

    /**
     * 单一职责，平台化接口分发：播放过程中的交互行为。
     * @author Songhui
     */
    this.dispatcherInteractBehavior = {

        // 默认更改音量调用实现
        changeVolumeDefault: function (max/*允许音量最大值*/, offset/*每次音量变化值：+即音量加，-即音量减*/) {
            if (!g_mp) {
                return 0;
            }

            // 参数校验
            if (typeof offset !== "number") offset = 5;
            if (typeof max !== "number" || max <= 0) max = 100;

            // 设置
            var volume = (+g_mp.getVolume());
            volume += offset; //计算目标音量值
            if (offset > 0) {
                volume = volume > max ? max : volume;
            } else {
                volume = volume < Math.abs(offset) ? 0 : volume;
            }

            g_mp.setVolume(volume);
            return g_mp.getVolume();
        },

        // 广东广电EPG
        changeVolume440094: function (max/*允许音量最大值*/, offset/*每次音量变化值：+即音量加，-即音量减*/) {
            if (typeof DataAccess !== "undefined" && DataAccess != null) {

                // 参数校验
                if (typeof offset !== "number") offset = 2;
                if (typeof max !== "number" || max <= 0) max = 32;

                // 设置
                var volume = parseInt(DataAccess.getInfo("MediaSetting", "OutputVolumn"));
                volume += offset;
                if (offset > 0) {
                    volume = volume > max ? max : volume;
                } else {
                    volume = volume < Math.abs(offset) ? 0 : volume;
                }

                return gmp_self.dispatcherInteractBehavior.setVolume440094(volume);
            } else {
                return 0;
            }
        },

        // 广东广电EPG：可能返回undefined，上层按需校验！
        setVolume440094: function (volume) {
            if (typeof DataAccess !== "undefined" && DataAccess != null) {
                // 若为静音开启，则先关闭之
                if (g_mp && g_mp.getMute() === 1) g_mp.audioUnmute();

                // 修改音量
                var succeed = DataAccess.setInfo("MediaSetting", "OutputVolumn", volume);
                if (succeed === 1 || succeed === "1") { // 设置成功
                    return volume;
                } else { // 设置失败，重新获取音量返回
                    return parseInt(DataAccess.getInfo("MediaSetting", "OutputVolumn"));
                }
            }
        },

        // 广东广电：可能返回undefined，上层按需校验！
        getVolume440094: function () {
            if (typeof DataAccess !== "undefined" && DataAccess != null) {
                return parseInt(DataAccess.getInfo("MediaSetting", "OutputVolumn"));
            }
        },

    }; // #End of LMEPG.mp$dispatcherInteractBehavior

    /**
     * 单一职责，平台化接口分发：仅URL获取
     * @author Songhui
     */
    this.dispatcherUrl = {

        //******************************* getUrl分发实现 *******************************//

        /**
         * 获取江苏电信视频第三方视频播放的后缀地址
         * @param left [number] 左边位置
         * @param top [number] 顶部位置
         * @param width [number] 视频宽度
         * @param height [number] 视频高度
         * @param mediaCode [string] 注入局方的视频ID
         * @returns {string}
         */
        getUrlWith320092: function (left, top, width, height, mediaCode) {
            var playArea = left + ":" + top + ":" + width + ":" + height;
            var date = new Date();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) month = "0" + month;
            if (strDate >= 0 && strDate <= 9) strDate = "0" + strDate;

            var currentDate = date.getFullYear() + ":" + month + ":" + strDate + ":" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            var url =
                "<play_action>vod</play_action>" +
                "<play_id>" + mediaCode + "</play_id>" +
                "<play_time>" + currentDate + "</play_time>" +
                "<play_mode>small</play_mode>" +
                "<play_area>" + playArea + "</play_area>" +
                "<back_vax_url></back_vax_url >" +
                "<back_vas_url_par></back_vas_url_par>" +
                "<add_info></add_info>";
            return "?THIRD_INFO=" + encodeURI(url);
        },

        /**
         * 获取江西电信第三方视频播放的后缀
         * @param left [number] 左边位置
         * @param top [number] 顶部位置
         * @param width [number] 视频宽度
         * @param height [number] 视频高度
         * @param mediaCode [string] 注入局方的视频ID
         * @param size [string] 高清（"hd"），标清（"sd"）
         * @returns {string}
         */
        getUrlWith360092: function (left, top, width, height, mediaCode, size) {
            var url =
                "<vas_action>play_trailer</vas_action>" +
                "<mediacode>" + mediaCode + "</mediacode>" +
                "<mediatype>VOD</mediatype>" +
                "<left>" + left + "</left>" +
                "<top>" + top + "</top>" +
                "<width>" + width + "</width>" +
                "<height>" + height + "</height>" +
                "<size>" + size + "</size>";
            return "?vas_info=" + encodeURI(url);
        },

        /**
         * 获取甘肃电信第三方视频播放的后缀
         * @param mediaCode [string] 注入局方的视频ID
         * @param accountId [string] 用户ID
         * @param userToken [string] 播放器入参
         * @param returnUrl [string] 返回URL
         * @returns {string}
         */
        getUrlWith620092: function (mediaCode, returnUrl) {
            var url =
                "<vas_action>fullscreen</vas_action>" +
                "<mediacode>" + mediaCode + "</mediacode>" +
                "<mediatype>VOD</mediatype>" +
                "<vas_back_url>" + returnUrl + "</vas_back_url>"
            return "?vas_info=" + encodeURI(url);
        },

        /**
         * 获取宁夏电信第三方视频播放的后缀
         * @param left [number] 左边位置
         * @param top [number] 顶部位置
         * @param width [number] 视频宽度
         * @param height [number] 视频高度
         * @param mediaCode [string] 注入局方的视频ID
         * @returns {string}
         */
        getUrlWith640092: function (left, top, width, height, mediaCode) {
            var url =
                "<vas_action>play_trailer</vas_action>" +
                "<mediacode>" + mediaCode + "</mediacode>" +
                "<mediatype>VOD</mediatype>" +
                "<left>" + left + "</left>" +
                "<top>" + top + "</top>" +
                "<width>" + width + "</width>" +
                "<height>" + height + "</height>";
            return "?vas_info=" + encodeURI(url);
        },

        getUrlWith350092: function (left, top, width, height, mediaCode) {
            var url =
                "<vas_action>play_trailer</vas_action>" +
                "<mediacode>" + mediaCode + "</mediacode>" +
                "<mediatype>VOD</mediatype>" +
                "<left>" + left + "</left>" +
                "<top>" + top + "</top>" +
                "<width>" + width + "</width>" +
                "<height>" + height + "</height>" +
                "<cycle>1</cycle>" +
                "<size>hd</size>";
            return "?vas_info=" + encodeURI(url);
        },

        /**
         * 获取宁夏电信全屏视频播放的后缀
         * @param mediaCode [string] 注入局方的视频ID
         * @returns {string}
         */
        getFullScreenUrlWith640092: function (mediaCode) {
            var url =
                "<vas_action>fullscreen</vas_action>" +
                "<mediacode>" + mediaCode + "</mediacode>" +
                "<mediatype>VOD</mediatype>" +
                "<vas_back_url></vas_back_url>";
            return "?vas_info=" + encodeURI(url);
        },

        /**
         * 获取青海电信第三方视频播放的后缀
         * @param left [number] 左边位置
         * @param top [number] 顶部位置
         * @param width [number] 视频宽度
         * @param height [number] 视频高度
         * @param mediaCode [string] 注入局方的视频ID
         * @param isHW [boolean] 是否为华为平台
         * @returns {string}
         */
        getUrlWith630092: function (left, top, width, height, mediaCode, isHW) {
            var url = "MediaService/SmallScreen";
            if (isHW === "huawei" || (typeof isHW === "boolean" && isHW)) {
                url += ".jsp";
            }
            url += "?ContentID=" + mediaCode.toString() + "&Left=" + left.toString();
            url += "&Top=" + top.toString();
            url += "&Width=" + width.toString();
            url += "&Height=" + height.toString();
            url += "&CycleFlag=0&GetCntFlag=0&ifameFlag=0&ReturnURL=";
            return encodeURI(url);
        },

        /**
         * 青海电信EPG，播放电视频道
         * @param left [number] 左边位置
         * @param top [number] 顶部位置
         * @param width [number] 视频宽度
         * @param height [number] 视频高度
         * @param channelNo [string] 电视频道ID
         * @param isHW [boolean] 是否为华为平台
         * @returns {string}
         */
        getUrlWithChannel630092: function (left, top, width, height, channelNo, isHW) {
            var param = "";
            if (isHW === "huawei" || (typeof isHW === "boolean" && isHW)) {
                param = "/EPG/jsp/defaultnew/en/smallCh.jsp??left=" + left + "&top=" + top + "&width=" + width + "&height=" + height + "&channelNo=" + channelNo;
            } else {
                param = "/iptvepg/frame51/smallCh.jsp?left=" + left + "&top=" + top + "&width=" + width + "&height=" + height + "&channelNo=" + channelNo;
            }
            return encodeURI(param);
        },

        /**
         * “青海电信” - 获取播放器前缀地址（与后缀地址组成完成的url地址，放入iframe中进行播放）
         * @param stbEPGDomainUrl [string] 通过LMEPG.STBUtil.getEPGDomain()获取
         * @returns {{url: string, isHW: boolean}}
         */
        getUrlWith630092PrefixObj: function (stbEPGDomainUrl) {
            var ret = {
                url: "",
                isHW: false,
                platform: "ZTE",
            };
            if (typeof stbEPGDomainUrl === "undefined" || stbEPGDomainUrl == null) {
                stbEPGDomainUrl = LMEPG.STBUtil ? LMEPG.STBUtil.getEPGDomain() : "";
            }

            stbEPGDomainUrl = stbEPGDomainUrl.replace("://", "+++");
            var portIndex = stbEPGDomainUrl.indexOf(":");
            var pathIndex = stbEPGDomainUrl.indexOf("/");
            var result = stbEPGDomainUrl.substring(portIndex, pathIndex);
            stbEPGDomainUrl = stbEPGDomainUrl.replace("+++", "://");
            if (result === ":33200") {//华为端口（or：是否要改为类同新疆？）
                ret.url = stbEPGDomainUrl.substr(0, stbEPGDomainUrl.indexOf("/EPG/")) + "/EPG/";
                ret.isHW = true;
                ret.platform = "HW";
            } else {
                var index = stbEPGDomainUrl.lastIndexOf("/");
                ret.url = stbEPGDomainUrl.substr(0, index) + "/";
                ret.isHW = false;
                ret.platform = "ZTE";
            }
            return ret;
        },

        /**
         * “新疆电信” - 获取播放器地址后缀
         * @param left [number] 左边位置
         * @param top [number] 顶部位置
         * @param width [number] 视频宽度
         * @param height [number] 视频高度
         * @param mediaCode [string] 注入局方的视频ID
         * @param isHW [boolean] 是否为华为平台
         * @returns {string}
         */
        getUrlWith650092Suffix: function (left, top, width, height, mediaCode, isHW) {
            var url = "MediaService/SmallScreen";
            if (isHW) {
                url += ".jsp";
            }
            url += "?ContentID=" + mediaCode.toString() + "&Left=" + left.toString();
            url += "&Top=" + top.toString();
            url += "&Width=" + width.toString();
            url += "&Height=" + height.toString();
            url += "&CycleFlag=0&GetCntFlag=0&ifameFlag=0&ReturnURL=";
            return encodeURI(url);
        },

        /**
         * “宁夏电信” - 获取播放器地址后缀
         * @param left [number] 左边位置
         * @param top [number] 顶部位置
         * @param width [number] 视频宽度
         * @param height [number] 视频高度
         * @param mediaCode [string] 注入局方的视频ID
         * @param isHW [boolean] 是否为华为平台
         * @returns {string}
         */
        getUrlWith640092Suffix: function (left, top, width, height, mediaCode, isHW) {
            var url = LMEPG.STBUtil.getEPGDomain();
            if (!LMEPG.Func.isEmpty(url) && url.indexOf(":") != -1) {
                var playurl = url.split(':')[0] + ":" + url.split(':')[1] + ':' + url.split(':')[2].split('/')[0];
                if (isHW) {
                    playurl = playurl + '/EPG/jsp/zy2q/en/play/smallPlay.jsp';
                } else {
                    playurl = playurl + '/iptvepg/frame1092/play/smallPlay.jsp';
                }

                playurl += "?CODE=" + mediaCode.toString() + "&PARENTCODE=" + mediaCode.toString() + "&LEFT=" + left.toString();
                playurl += "&TOP=" + top.toString();
                playurl += "&WIDTH=" + width.toString();
                playurl += "&HEIGHT=" + height.toString();
                playurl += "&USERID=" + Authentication.CTCGetConfig('UserID');
                playurl += "&FEEFLAG=" + "0";
                playurl += "&PLAYTYPE=" + "2";
                playurl += "&TYPE=" + "0";
                playurl += "&PLAYDURATION=" + (new Date()).getTime();
                playurl += "&USERTOKEN=" + Authentication.CTCGetConfig('UserToken');
                playurl += "&SPID=" + "spaj0080";
                playurl += "&CONTENTTYPE=" + "1";
                playurl = encodeURI(playurl);
                return playurl;
            }
        },

        /**
         * “新疆电信” - 获取播放器前缀地址（与后缀地址组成完成的url地址，放入iframe中进行播放）
         * @param stbEPGDomainUrl [string] 通过LMEPG.STBUtil.getEPGDomain()获取
         * @returns {{url: string, isHW: boolean}}
         */
        getUrlWith650092PrefixObj: function (stbEPGDomainUrl) {
            var ret = {
                url: "",
                isHW: false,
                platform: "ZTE",
            };
            if (typeof stbEPGDomainUrl === "undefined" || stbEPGDomainUrl == null) {
                stbEPGDomainUrl = LMEPG.STBUtil ? LMEPG.STBUtil.getEPGDomain() : "";
            }

            stbEPGDomainUrl = stbEPGDomainUrl.replace("://", "+++");
            // var portIndex = stbEPGDomainUrl.indexOf(":");
            // var pathIndex = stbEPGDomainUrl.indexOf("/");
            // var result = stbEPGDomainUrl.substring(portIndex, pathIndex);
            stbEPGDomainUrl = stbEPGDomainUrl.replace("+++", "://");
            if (stbEPGDomainUrl.indexOf("EPG") !== -1) {
                ret.url = stbEPGDomainUrl.split("/EPG")[0] + "/EPG/";
                ret.isHW = true;
                ret.platform = "HW";
            } else {
                var index = stbEPGDomainUrl.lastIndexOf("/");
                ret.url = stbEPGDomainUrl.substr(0, index) + "/";
                ret.isHW = false;
                ret.platform = "ZTE";
            }
            return ret;
        },

        /**
         * 获取湖北电信第三方视频播放的后缀
         * @param left [number] 左边位置
         * @param top [number] 顶部位置
         * @param width [number] 视频宽度
         * @param height [number] 视频高度
         * @param mediaCode [string] 注入局方的视频ID
         * @param lmpf [string] 平台名字，例如：“huawei”，“zte”
         * @returns {string}
         */
        getUrlWith420092: function (left, top, width, height, mediaCode, lmpf) {
            var url = "MediaService/SmallScreen";
            if (lmpf === "huawei") {
                url += ".jsp?Type=ad&";
            } else {
                url += "?";
            }
            url += "ContentID=" + mediaCode.toString() + "&Left=" + left.toString();
            url += "&Top=" + top.toString();
            url += "&Width=" + width.toString();
            url += "&Height=" + height.toString();
            url += "&CycleFlag=0";
            return encodeURI(url);
        },

        //******************************* formatMediaStr分发实现 *******************************//

        // 默认格式化后播放串
        getFormatMediaStrDefault: function (mediaUrl) {
            var mediaStr = '';
            mediaStr += '[{';
            mediaStr += 'mediaUrl:"' + mediaUrl + '",';                 // 媒体地址
            mediaStr += 'mediaCode:"jsoncode1",';                       // 媒体唯一标识
            mediaStr += 'mediaType:2,';                                 // 媒体类型 1、TYPE_CHANNEL 2、TYPE_VOD 3、TYPE_TVOD 4、TYPE_MUSIC
            mediaStr += 'audioType:4,';                                 // 音频编码类型：1: MPEG-1/2 layer 2 (MP2) 2: MPEG-1/2 layer 3 (MP3) 3: MPEG-2 LC-AAAC 4: MPEG-4 LC-AAC 5: MPEG-4 HE-AAC 6: AC-3 7: WMA9
            mediaStr += 'videoType:3,';                                 // 视频编码类型： 1、MPEG-2 2、MPEG-4 3、H.264 4、WMV9 5、VC-1 6、AVS
            mediaStr += 'streamType:2,';                                // 流类型： 1、PS 2、TS 3、MP4 4、ASF
            mediaStr += 'drmType:1,';                                   // DRM类型：1、DRM_TYPE_CLEAR_TEXT 2、DRM_TYPE_BESTDRM 3、DRM_TYPE_NDS 4、DRM_TYPE_MICROSOFT 5、DRM_WIDEVINE
            mediaStr += 'fingerPrint:0,';                               // 是否支持水印保护：0、开启fingerPrint 1、关闭fingerPrint (缺省值))
            mediaStr += 'copyProtection:1,';                            // 防止拷贝类型：0、PROTECTION_NO (缺省值) 1、PROTECTION_MACROVISION 3、PROTECTION_CGMSA
            mediaStr += 'allowTrickmode:1,';                            // 是否允许Trickmode：0、不允许Trickmode 1、允许Trickmode (缺省值)
            mediaStr += 'startTime:0,';                                 // 开始时间
            mediaStr += 'endTime:20000.3,';                             // 结束时间
            mediaStr += 'entryID:"jsonentry1"';                         // 多媒体播放时 PlayList列表中的唯一标识（只在加入Playlist时用到）
            mediaStr += '}]';
            return mediaStr;
        },

        // 默认格式化后播放串
        getFormatMediaStr10000051: function (mediaUrl) {
            var mediaStr = '';
            mediaStr += '[{';
            mediaStr += 'mediaUrl:"' + mediaUrl + '",';                 // 媒体地址
            mediaStr += 'mediaCode:"jsoncode1",';                       // 媒体唯一标识
            mediaStr += 'mediaType:2,';                                 // 媒体类型 1、TYPE_CHANNEL 2、TYPE_VOD 3、TYPE_TVOD 4、TYPE_MUSIC
            mediaStr += 'audioType:1,';                                 // 音频编码类型：1: MPEG-1/2 layer 2 (MP2) 2: MPEG-1/2 layer 3 (MP3) 3: MPEG-2 LC-AAAC 4: MPEG-4 LC-AAC 5: MPEG-4 HE-AAC 6: AC-3 7: WMA9
            mediaStr += 'videoType:1,';                                 // 视频编码类型： 1、MPEG-2 2、MPEG-4 3、H.264 4、WMV9 5、VC-1 6、AVS
            mediaStr += 'streamType:1,';                                // 流类型： 1、PS 2、TS 3、MP4 4、ASF
            mediaStr += 'drmType:1,';                                   // DRM类型：1、DRM_TYPE_CLEAR_TEXT 2、DRM_TYPE_BESTDRM 3、DRM_TYPE_NDS 4、DRM_TYPE_MICROSOFT 5、DRM_WIDEVINE
            mediaStr += 'fingerPrint:0,';                               // 是否支持水印保护：0、开启fingerPrint 1、关闭fingerPrint (缺省值))
            mediaStr += 'copyProtection:1,';                            // 防止拷贝类型：0、PROTECTION_NO (缺省值) 1、PROTECTION_MACROVISION 3、PROTECTION_CGMSA
            mediaStr += 'allowTrickmode:1,';                            // 是否允许Trickmode：0、不允许Trickmode 1、允许Trickmode (缺省值)
            mediaStr += 'startTime:0,';                                 // 开始时间
            mediaStr += 'endTime:20000.3,';                             // 结束时间
            mediaStr += 'entryID:"jsonentry1"';                         // 多媒体播放时 PlayList列表中的唯一标识（只在加入Playlist时用到）
            mediaStr += '}]';
            return mediaStr;
        },

        // 吉林广电EPG（联通）：组织播放串
        getFormatMediaStr220094: function (mediaUrl) {
            var mediaStr = [
                {
                    "mediaUrl": mediaUrl,
                    "mediaCode": "mediaCode",
                    "mediaType": 2,
                    "audioType": 1,
                    "videoType": 1,
                    "streamType": 1,
                    "drmType": 1,
                    "fingerPrint": 0,
                    "copyProtection": 1,
                    "allowTrickmode": 1,
                    "startTime": 0,
                    "endTime": -1,
                    "entryID": "entryID"
                }
            ];
            return JSON.stringify(mediaStr);
        },


        // 吉林广电EPG（电信）：组织播放串
        getFormatMediaStr220095: function (mediaUrl) {
            var mediaStr = '';
            mediaStr += '[{';
            mediaStr += 'mediaUrl:"' + mediaUrl + '",';                 // 媒体地址
            mediaStr += 'mediaCode:"mediaCode",';                       // 媒体唯一标识
            mediaStr += 'mediaType:2,';                                 // 媒体类型 1、TYPE_CHANNEL 2、TYPE_VOD 3、TYPE_TVOD 4、TYPE_MUSIC
            mediaStr += 'audioType:1,';                                 // 音频编码类型：1: MPEG-1/2 layer 2 (MP2) 2: MPEG-1/2 layer 3 (MP3) 3: MPEG-2 LC-AAAC 4: MPEG-4 LC-AAC 5: MPEG-4 HE-AAC 6: AC-3 7: WMA9
            mediaStr += 'videoType:1,';                                 // 视频编码类型： 1、MPEG-2 2、MPEG-4 3、H.264 4、WMV9 5、VC-1 6、AVS
            mediaStr += 'streamType:1,';                                // 流类型： 1、PS 2、TS 3、MP4 4、ASF
            mediaStr += 'drmType:1,';                                   // DRM类型：1、DRM_TYPE_CLEAR_TEXT 2、DRM_TYPE_BESTDRM 3、DRM_TYPE_NDS 4、DRM_TYPE_MICROSOFT 5、DRM_WIDEVINE
            mediaStr += 'fingerPrint:0,';                               // 是否支持水印保护：0、开启fingerPrint 1、关闭fingerPrint (缺省值))
            mediaStr += 'copyProtection:1,';                            // 防止拷贝类型：0、PROTECTION_NO (缺省值) 1、PROTECTION_MACROVISION 3、PROTECTION_CGMSA
            mediaStr += 'allowTrickmode:1,';                            // 是否允许Trickmode：0、不允许Trickmode 1、允许Trickmode (缺省值)
            mediaStr += 'startTime:0,';                                 // 开始时间
            mediaStr += 'endTime:-1,';                                  // 结束时间
            mediaStr += 'entryID:"entryID"';                            // 多媒体播放时 PlayList列表中的唯一标识（只在加入Playlist时用到）
            mediaStr += '}]';
            return mediaStr;
        },

        // 山东电信EPG：组织播放串
        getFormatMediaStr370092: function (mediaUrl) {
            var mediaStr = [
                {
                    "mediaUrl": mediaUrl,
                    "mediaCode": "jsoncode1",
                    "mediaType": 2,
                    "audioType": 1,
                    "videoType": 1,
                    "streamType": 1,
                    "drmType": 1,
                    "fingerPrint": 0,
                    "copyProtection": 1,
                    "allowTrickmode": 1,
                    "startTime": 0,
                    "endTime": 20000,
                    "entryID": "jsonentry1"
                }
            ];
            return JSON.stringify(mediaStr);
        },

    }; // #End of LMEPG.mp$dispatcherUrl

    //******************************* 其它动态初始化（立即执行任务）：必须最后区域定义 *******************************//
    (function exec_mp_extras_immediately() {
        switch (m_carrierId) {
            case "000051"://中国联通
                switch (m_areaCode) {
                    case "231"://中国联通-湖南省
                        /*
                         * 说明：由于该省LTtvPlayer不会触发相关的事件（KEY_VIRTUAL_EVENT/EVENT_MEDIA_BEGINING/EVENT_MEDIA_END/EVENT_MEDIA_ERROR）,
                         * 且无Utility对象及其相关方法。为了全局兼容现有业务逻辑，临时对其手动定义，即可不对业务层做任务改动！Utility运用到的相关方法有：Utility.getEvent()
                         * -----Added by Songhui on 2019-11-25
                         */

                        // [中国联通-湖南省]播放器回调接口对象：1、默认不初始化，内部按需定义！2、该回调变量名官方定死固定了，不可变！！！
                        window.LTtvPlayerCallBack = {};
                        window.LTtvPlayerCallBack.onStart = function () {
                            // 开始播放（暂不处理）
                            m_printLog("[中国联通-湖南省]：开始播放~" + (arguments.length > 0 ? JSON.stringify(arguments) : ""), 'd');
                            LMEPG.Func.thirdEx.iUtility.setEvent({type: "EVENT_MEDIA_BEGINING"});
                            LMEPG.Framework.onEvent(KEY_VIRTUAL_EVENT, true);
                        };
                        window.LTtvPlayerCallBack.onComplete = function () {
                            // 播放结束
                            m_printLog("[中国联通-湖南省]：播放结束~" + (arguments.length > 0 ? JSON.stringify(arguments) : ""), 'd');
                            LMEPG.Func.thirdEx.iUtility.setEvent({type: "EVENT_MEDIA_END"});
                            LMEPG.Framework.onEvent(EVENT_MEDIA_END, true);
                        };
                        window.LTtvPlayerCallBack.onError = function () {
                            // 播放错误（暂不处理，湖南技术人员说“视频播放不稳定就会报这个错”，否则会经常卡住）
                            m_printLog("[中国联通-湖南省]：播放错误~" + (arguments.length > 0 ? JSON.stringify(arguments) : ""), 'd');
                            LMEPG.Func.thirdEx.iUtility.setEvent({type: "EVENT_MEDIA_ERROR"});
                            LMEPG.Framework.onEvent(EVENT_MEDIA_ERROR, true);
                        };
                        break;
                }
                break;
        }
    })();

};

LMEPG.mp = new __LMMediaPlayerSdk();
