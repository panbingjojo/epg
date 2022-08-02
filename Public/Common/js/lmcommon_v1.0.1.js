/**
 * 通用框架处理，共用框架
 * Created by caijun on 2018/2/28.
 */

/****************************************************************
 * 全局变量判断和设置，比如是否是调试模式，是否是android盒子等等。
 *****************************************************************/
if (typeof debug === 'undefined')
    window.debug = true;//调试模式，上线后必须把此参数改为false！

/****************************************************************
 * 定义区域码
 ***************************************************************/
var CARRIER_ID_GUO_AN_GUANG_SHI = "02000011";       // 国安广视（康乐养生堂）
var CARRIER_ID_GUANGDONGGD = "440004";              // 广东广电
var CARRIER_ID_JIUAIHEALTH = "03000011";            // 玖爱健康
var CARRIER_ID_DEMO4 = "000409";                    // 展示版本-4（广东广电）
var CARRIER_ID_DEMO5 = "00000509";                  // 展示版本-5（基于青海移动）
var CARRIER_ID_DEMO6 = "000609";                    // 展示版本-6（基于贵州广电）
var CARRIER_ID_DEMO7 = "000709";                    // 展示版本-7（基于中国联通APK2.0）
var CARRIER_ID_GUIZHOUGD = "520004";                // 贵州广电
var CARRIER_ID_GANSUYD = "620007";                  // 甘肃移动
var CARRIER_ID_GUANGXIGD = "450004";                // 广西广电
var CARRIER_ID_QINGHAIYD = "630001";                // 青海移动
var CARRIER_ID_NINGXIAYD = "640001";                // 宁夏移动
var CARRIER_ID_SHANDONGDX = "370002";               // 山东电信
var CARRIER_ID_CHINAUNICOM = "000006";              // 中国联通
var CARRIER_ID_XIZANGYD = "540001";                 // 西藏移动
var CARRIER_ID_HUNANYX = "430012";                  // 湖南有线
var CARRIER_ID_WEILAITV_TOUCH_DEVICE = "05001110";  // 未来电视触摸屏设备
var CARRIER_ID_JIANGXIYD = "360001";                // 江西移动
var CARRIER_ID_JIANGSUYD = "320001";                // 江苏移动
var CARRIER_ID_JIANGSUDX_YUEME = "000005";          // 江苏电信悦me
var CARRIER_ID_SHANXIYD = "610001";                 // 陕西移动
var CARRIER_ID_YB_HEALTH_UNIFIED = "09000001";      // 未来电视怡伴健康统一接口
var CARRIER_ID_YBHEALTH = "09000006";               // 怡伴健康
var CARRIER_ID_GUANGDONGYD = "440001";              // 广东移动
var CARRIER_ID_GUANGXIYDYIBAN = "09450001";         // 广西移动怡伴
var CARRIER_ID_GUANGXIYD = "450001";                // 广西移动
var CARRIER_ID_SHIJICIHAI = "110052";                // 世纪慈海在线问诊APK
/****************************************************************
 * 事件定义：
 * KEY_ 开头的是系统按键事件
 * EVENT_ 开头的是虚拟按键
 ***************************************************************/
var KEY_BACK = 0x0008; 	            // 返回/删除
var KEY_BACK_640 = 0x0280; 	        // 返回按键（值为640）
var KEY_BACK_ANDROID = 0xffff; 	    // Android返回键（安卓返回键code=4）
var KEY_ENTER = 0x000D; 	        // 确定
var KEY_PAGE_UP = 0x0021;	        // 上页
var KEY_PAGE_DOWN = 0x0022;         // 下页
var KEY_LEFT = 0x0025;              // 左
var KEY_LEFT_65 = 0x0041;              // 左
var KEY_UP = 0x0026;                // 上
var KEY_UP_87 = 0x0057;                // 上
var KEY_RIGHT = 0x0027;	            // 右
var KEY_RIGHT_68 = 0x0044;	            // 右
var KEY_DOWN = 0x0028;	            // 下
var KEY_DOWN_83 = 0x0053;	            // 下
var KEY_0 = 0x0030;                 // 0
var KEY_1 = 0x0031;                 // 1
var KEY_2 = 0x0032;                 // 2
var KEY_3 = 0x0033;                 // 3
var KEY_4 = 0x0034;                 // 4
var KEY_5 = 0x0035;                 // 5
var KEY_6 = 0x0036;                 // 6
var KEY_7 = 0x0037;                 // 7
var KEY_8 = 0x0038;                 // 8
var KEY_9 = 0x0039;                 // 9
var KEY_VOL_UP = 0x0103; 	        // Vol+，音量加
var KEY_VOL_UP_61 = 0x003D; 	        // Vol+，音量加
var KEY_VOL_DOWN = 0x0104;	        // Vol-，音量减
var KEY_VOL_DOWN_45 = 0x002D;	        // Vol-，音量减
var KEY_MUTE = 0x0105;	            // Mute，静音
var KEY_TRACK = 0x0106;	            // Audio Track，切换音轨
var KEY_PLAY_PAUSE = 0x0107;	    // >||，播放，暂停
var KEY_FAST_FORWARD = 0x0108;	    // >> ，快进
var KEY_FAST_REWIND = 0x0109;	    // << ，快退
var KEY_RED = 0x0113;               // 红色键
var KEY_GREEN = 0x0114;	            // 绿色键
var KEY_YELLOW = 0x0115;            // 黄色键
var KEY_BLUE = 0x0116;              // 蓝色键
var KEY_DELETE = 0x0118;            // 删除键中兴盒子
var KEY_VIRTUAL_EVENT = 0x0300;	    // 虚拟事件按键
var KEY_EXIT = 0x001B;	            // 退出按键（非home键）
var KEY_287 = 0x011F;                // 广西广电退出键
var KEY_399 = 0x018F;                // 广西广电返回键
var KEY_514 = 0x0202;                // 广西广电退出键
var KEY_5002 = 5002;                  //广西广电--加载成功，开始播放
var KEY_5004 = 5004;                  //广西广电播--加上失败
var KEY_5006 = 5006;                  //广西广电播--正常播放结束
var KEY_5007 = 5007;                  //广西广电--播放结束，用户按退出或其他快捷键结束播放
var KEY_5008 = 5008;                  //广西广电--播放异常
var KEY_5008 = 5010;                  //广西广电--恢复播放

/****************************************************************
 * 焦点类型
 ***************************************************************/
var BUTTON_TYPE_DIV = "div";                        //焦点按钮类型---- div
var BUTTON_TYPE_INPUTTEXT = "input-test";         //焦点按钮类型---- 输入框

/****************************************************************
 *
 ***************************************************************/
var EVENT_MEDIA_END = 'EVENT_MEDIA_END';            // 视频播放结束
var EVENT_MEDIA_ERROR = 'EVENT_MEDIA_ERROR';        // 视频播放错误

var G_IS_PRESS_BACK = false;

// 允许的进入类型
var ACCESS_NO_TYPE = 0; // 不区分类型，只要是VIP就可以
var ACCESS_PLAY_VIDEO_TYPE = 1; // 观看视频
var ACCESS_VIDEO_INQUIRY_TYPE = 2; // 视频问诊
var ACCESS_TEL_INQUIRY_TYPE = 3; // 电话问诊
var ACCESS_HEALTH_MEASURE_TYPE = 4; // 健康检测

/****************************************************************
 * 通用快捷函数定义：
 ***************************************************************/
/**
 * 根据控件ID返回控件的引用
 * @param id  控件（元素）id
 * @returns {Element} 返回对象引用
 * @constructor
 */
function G(id) {
    return document.getElementById(id);
}

/**
 * 显示控件
 * @param id 控件id
 * @constructor
 */
function S(id) {
    var temp = G(id);
    if (temp)
        temp.style.visibility = 'visible';
}

/**
 * 隐藏控件
 * @param id 控件id
 * @constructor
 */
function H(id) {
    var temp = G(id);
    if (temp)
        temp.style.visibility = 'hidden';
}

/**
 * 显示一个元素，与S不同的是，修改的是display属性<br>
 * add by lxa 20140922
 * 修改visibility的最大缺点是：如果子元素是显示的话，即使父元素隐藏了子元素也不会隐藏
 * @param id
 */
function Show(id) {
    var temp = G(id);
    if (temp)
        temp.style.display = 'block';
}

/**
 * 隐藏一个元素，与H不同的是，修改的是display属性<br>
 * add by lxa 20140922
 * 修改visibility的最大缺点是：如果子元素是显示的话，即使父元素隐藏了子元素也不会隐藏
 * @param id
 */
function Hide(id) {
    var temp = G(id);
    if (temp)
        temp.style.display = 'none';
}

/**
 * 判断 visibility 属性是否显示
 * @param id [string|dom object] dom元素id或者dom元素对象
 * @return {Element|boolean} null/undefined-不存在 或 boolean[true-显示 false-隐藏]
 */
function isS(id) {
    var temp = id instanceof HTMLElement ? id : G(id);
    var getVisibility = temp.style.visibility;
    return temp && /*getVisibility 注：空串为默认值，即显示状态！&&*/ getVisibility !== "hidden";
}

/**
 * 判断 display 属性是否显示
 *
 * @param id [string|dom object] dom元素id或者dom元素对象
 * @return {Element|boolean} null/undefined-不存在 或 boolean[true-显示 false-隐藏]
 */
function isShow(id) {
    var temp = id instanceof HTMLElement ? id : G(id);
    var getDisplay = temp && temp.style.display;
    return temp && /*getDisplay 注：空串为默认值，即显示状态！&&*/ getDisplay !== "none";
}

/**
 * 简短方法名，判断元素在dom中是否存在且有效
 * @param elementId
 * @return {*|boolean}
 */
function is_element_exist(elementId) {
    return !LMEPG.func.isEmpty(elementId) && LMEPG.func.isElementExist(elementId);
}

/**
 * 简短方法名，判断元素是否定义
 * @param obj
 * @return {*|boolean}
 */
function is_exist(obj) {
    return LMEPG.func.isExist(obj);
}

/**
 * 判断src字符串中是否包含的des字符串
 * @param src
 * @param des
 */
function strContain(src, des) {
    if (src == null || src == "" || des == null || des == "") {
        return false;
    }
    for (var i = 0; i < (src.length - des.length + 1); i++) {
        for (var j = 0; j < des.length; j++) {
            if (src[i + j] == des[j]) {
                if (j == (des.length - 1)) {
                    return true;
                }
                continue;
            } else {
                break;
            }
        }
    }
    return false;
}

/**
 * 获取随机数整数
 * @param minValue 最小值
 * @param maxValue  最大值
 * @returns {number}
 */
function getRandom(minValue, maxValue) {
    var choices = maxValue - minValue + 1;
    var num = Math.floor(Math.random() * choices + minValue);
    return num;
}

/**
 * 判断当前是否正在运行在PC上。
 *
 * @return {boolean|isRunOnPC} true：正在运行在PC浏览器。false：正在运行在Android上！
 */
function is_run_on_PC() {
    return typeof window.isRunOnPC === 'undefined' || window.isRunOnPC;
}

/**
 * 简短方法名，判断变量是否是一个 “非undefined”且“非null”且“非Array”的有效 {对象}！
 * @param obj
 * @return {*|boolean}
 */
function is_object(obj) {
    return LMEPG.func.isObject(obj);
}

/**
 * 是否已经按过返回键
 * @returns {boolean}
 * @constructor
 */
function IS_PRESS_BACK() {
    if (!G_IS_PRESS_BACK) {
        G_IS_PRESS_BACK = true;
        return false;
    }
    return true;
}

/**
 * 简短方法名，判断变量是否是 “undefined”且“非null”的有效 [数组]！
 * @param obj
 * @return {*|boolean}
 */
function is_array(obj) {
    return LMEPG.func.isArray(obj);
}

/**
 * 修整数据，若空无效，则返回默认提供数据，否则原样返回。
 * @param input [string|any basic] 基本数据类型
 * @param defaultValue [string|any basic] 第一参为空无效时，替换默认值（若无提供，返回原值）
 * @return {string|default} 返回原值或默认值
 */
function repair_data(input, defaultValue) {
    if (LMEPG.Func.isEmpty(input) && typeof defaultValue !== "undefined") {
        return defaultValue;
    }
    return input;
}

/**
 * 根据 [图片|音频] 相对路径转换为真实的fs地址。
 * @param srcUrl 例如："/imgs/navigate_bar/320002/20171107150041.png", "/audio/1000010/20181204/home_nav_guanjia.mp3"
 * @return string 返回绝对路径，如果srcUrl无效的话，返回空""。
 *      例如："http://test-mofang-fs.langma.cn:7091/imgs/navigate_bar/320002/20171107150041.png"
 */
function to_real_url(srcUrl) {
    if (typeof RenderParam !== "undefined" && LMEPG.Func.isObject(RenderParam)
        && !LMEPG.Func.isEmpty(RenderParam.fsUrl) && !LMEPG.Func.isEmpty(srcUrl)) {
        return RenderParam.fsUrl + srcUrl;
    } else {
        return srcUrl;
    }
}

/**
 * 访问控制：是否显示VIP角标。
 * @param accessCtrl 访问控制（0不限 1普通用户 2VIP）
 */
function is_show_vip_corner(accessCtrl) {
    if (typeof RenderParam !== "undefined" && LMEPG.Func.isObject(RenderParam) && !LMEPG.Func.isEmpty(RenderParam.isVip)) {
        return RenderParam.isVip != 1 && (accessCtrl == 2 || accessCtrl == 1);//默认是否显示VIP角标
    } else {
        return false;
    }
}

/**
 * 通过对象及其对象下的属性名，返回对应的值。主要是为了避免相同操作（获取某一对象的某一属性，进行一系列的判断，诸如
 * 该对象是否存在某属性等），因为中间未判断原因导致js出错，故此统一用try-catch捕获错误，异常时返回空串“”。
 *
 * 使用示例：get_obj_value_by(obj, "Name.v")
 *          表示尝试返回对象 obj.Name.v 的值
 *
 * @param obj
 * @param property
 * @return {*}
 */
function get_obj_value_by(obj, property) {
    try {
        if (is_object(obj)) {
            return eval("obj." + property);
        } else {
            return "";
        }
    } catch (e) {
        console.error("get_obj_value_by({0}, {1}) >>> Occurred Exception: {2}".format(obj, property, e.toString()));
        return "";
    }
}

/**
 * Base64！
 */
function Base64() {
    // base64编码
    this.encode = function (input) {
        return LMEPG && LMEPG.Func ? LMEPG.Func.codec.base64_encode(input) : input;
    };

    // base64编码
    this.decode = function (input) {
        return LMEPG && LMEPG.Func ? LMEPG.Func.codec.base64_decode(input) : input;
    };
}

/**
 * 定义EPG命名空间。所有相关的操作都封装在该对象中
 * @type {{call: LMEPG.call}}
 */
var LMEPG = {
    /**
     * 函数调用（供调用回调函数使用）
     * @param fn  需要调用的函数
     * @param args 需要传递的参数数组
     * @returns {*} 返回调用返回的结果
     */
    call: function (fn, args) {
        if (typeof fn == "string" && fn !== '') {
            return eval("(" + fn + ")");
        } else if (typeof fn == "function") {
            if (!this.Func.isArray(args)) {
                var temp = [];
                for (var i = 1; i < arguments.length; i++)
                    temp.push(arguments[i]);
                args = temp;
            }
            return fn.apply(window, args);
        }
    },

    /**
     * 空方法，需要清除操作时使用，
     * @private
     */
    emptyFunc: function () {
        //空方法
    },

    onEvent: null  //事件回调, 如果页面需要自己定义事件处理器，可以在页面单独配置使用
};

/*****************************************************************
 * Cookie封装
 *****************************************************************/
LMEPG.Cookie = (function () {
    return {
        /**
         * 设置cookie
         *
         * @param name 存储cookie节点名
         * @param value 存储cookie对应的值
         */
        setCookie: function (name, value) {
            var day = 30;
            var path = "/";
            var str = name + "=" + value + "; ";
            if (day) {
                var date = new Date();
                date.setTime(date.getTime() + day * 24 * 3600 * 1000);
                str += "expires=" + date.toGMTString() + "; ";
            }
            if (path) {
                str += "path=" + path;
            }
            document.cookie = str;//注意，cookie这样设置并不会覆盖之前所有的cookie！除非同名同path
        },

        /**
         * 根据指定cookie名获取具体cookie值
         *
         * @param c_name [string] 存储cookie节点名
         * @returns {string} 存储cookie值value。注：返回一定不会为undefined或null，最少返回空字符串""！
         */
        getCookie: function (c_name) {
            var c_value = "";

            var temp = new RegExp("(^|;| )" + c_name + "=([^;]*)(;|$)", "g").exec(document.cookie);
            if (temp != null) {
                var tempValue = temp[2];
                c_value = tempValue === '""' ? c_value : tempValue;
            }

            // 加强统一处理
            if (typeof c_value === "undefined" || c_value == null) {
                c_value = "";
            }

            return c_value;
        },

        /**
         * 根据指定cookie名获取具体cookie值
         *
         * @param c_name [string] 存储cookie节点名
         * @returns {*} 存储cookie值value。 注：返回一定不会为undefined或null，最少返回空字符串""！
         */
        getCookieEx: function (c_name) {
            var c_value = "";

            if (document.cookie.length > 0) {
                var c_start = document.cookie.indexOf(c_name + "=");
                if (c_start !== -1) {
                    c_start = c_start + c_name.length + 1;
                    var c_end = document.cookie.indexOf(";", c_start);
                    if (c_end === -1) {
                        c_end = document.cookie.length;
                    }
                    c_value = unescape(document.cookie.substring(c_start, c_end));
                }
            }

            // 加强统一处理
            if (typeof c_value === "undefined" || c_value == null) {
                c_value = "";
            }

            return c_value;
        }
    }
})();

/*****************************************************************
 * 应用上下文环境和相关属性
 *****************************************************************/
LMEPG.App = (function () {
    return {
        /**
         * 得到应用程序的根路径
         * @return {string}
         */
        getAppRootPath: function () {
            var appRootPath = LMEPG.Cookie.getCookieEx("c_app_root_path");
            if (typeof appRootPath === "undefined" || appRootPath === null) {
                appRootPath = "";
            }
            return decodeURI(appRootPath);
        },

        /**
         * 得到Cookie里首次进入应用缓存的carrierId
         * @return {string}
         */
        getCarrierId: function () {
            return LMEPG.Cookie.getCookieEx("c_carrier_id");
        }

    };
})();

/** __ROOT__全局变量，引用页面js可直接使用！ */
var g_appRootPath = LMEPG.App.getAppRootPath();

/**
 * 通用函数库
 * @type {{isArray, formatTimeInfo, removeDefaultFocusbolder}}
 */
LMEPG.Func = LMEPG.func = (function () {
    return {
        /**
         * 判断变量是否是 “undefined”且“非null”的有效 [数组]！
         * @param variable  变量
         * @returns {boolean} true：数组 false：非数组
         */
        isArray: function (variable) {
            return LMEPG.Func.isExist(variable) && (variable instanceof Array);
        },

        /**
         * 将时间进行格式化返回
         * @type：1、格式化为MM:SS
         */
        formatTimeInfo: function (type, second) {
            if (type == 1) {
                // 格式化为MM:SS
                var m = Math.floor(second / 60);
                m = m < 10 ? ('0' + m) : m;
                var s = second % 60;
                s = s < 10 ? ('0' + s) : s;
                return m + ':' + s;
            }
            return second;  //不支持的类型原样输出
        },

        /**
         * 根据元素id判断该元素在dom中是否存在且有效
         * @param elementId 元素id
         * @return {boolean}
         */
        isElementExist: function (elementId) {
            var element = G(elementId);
            return (typeof element !== 'undefined' && element != null);
        },


        /** 移除iPanel自带的焦点框*/
        removeDefaultFocusbolder: function () {
            if (typeof (iPanel) != "undefined") {
                iPanel.focusWidth = "0";
            }
        },
        /**
         * 清除字符串中的空格
         * @param str
         * @returns {string | void}
         */
        trim: function (str) {
            if (str) return str.replace(/^\s*(.*?)\s*$/g, '$1');
        },

        /**
         * 将http协议头转化为rtsp。
         * <pre>例如：
         *   videoUrlSrc: "http://202.99.114.93/88888891/16/20171215/269767418/269767418.mp4";
         *   videoUrlDst: "rtsp://202.99.114.93/88888891/16/20171215/269767418/269767418.mp4";
         *  </pre>
         * @param videoUrlSrc 未转换过协议头的原始视频地址
         * @returns {*}
         */
        httpTortsp: function (videoUrlSrc) {
            var dst = videoUrlSrc;
            var protocol = videoUrlSrc.substring(0, 4);
            if (protocol == "http") {
                dst = videoUrlSrc.replace(/http/, 'rtsp');
            }
            return dst;
        },

        /** 判断手机号码是否有效
         * @param number 手机号码
         * @returns {boolean} true--有效, false--无效
         */
        checkTelPhoneNumberValid: function (number) {
            // 如果number为空，则是无效的手机号码
            if (typeof number == "undefined" || number == null || number == "") {
                return false;
            }

            //手机号正则
            var phoneReg = /^1[34578]\d{9}$/;
            if (!phoneReg.test(number)) {
                return false;
            }

            return true;
        },

        /**
         * 判断用户是否有权限进入
         * @param isvip 表示用户当前是否为vip 1--是vip，0--不是vip
         * @param accessType 进入类型（0--不区分类型，只要是VIP就可以、1--观看视频、2--视频问诊、3--电话问诊、4--健康检测）
         * @param param 对应accessType,传递相应的参数
         * @returns {boolean} true--能进入，false--不能进入
         */
        isAllowAccess: function (isvip, accessType, param) {
            if (accessType == 0 && parseInt(isvip) == 0
                && typeof (RenderParam) !== "undefined"
                && (RenderParam.carrierId == CARRIER_ID_JIANGXIYD
                || RenderParam.carrierId == CARRIER_ID_JIANGSUYD)) {
                LMAndroid.JSCallAndroid.doAuth(null, function (resParam, notifyAndroidCallback) {
                    LMEPG.Log.info('JIANGXIYD/JIANGSUYD isAllowAccess doAuth result:' + resParam);
                    var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
                    if (resParamObj.isVip == 1) return true;
                    else return false;
                });
            } else {
                if (accessType == 0) {
                    if (parseInt(isvip) == 1) {
                        return true;
                    }
                } else if (accessType == 1) {
                    if (parseInt(isvip) == 1) {
                        return true;
                    }

                    if (parseInt(param.userType) == 0) {
                        // 视频允许免费用户观看
                        return true;
                    }

                    if (parseInt(param.freeSeconds) > 0) {
                        // 视频有免费观看时长
                        return true;
                    }
                } else {
                    console.error("此类型暂时不支持");
                }

                return false;
            }
        },

        /**
         * 判断元素是否定义
         * @param obj
         * @returns {boolean}
         */
        isExist: function (obj) {
            if (typeof (obj) === "undefined" || obj === null) {
                return false;
            }
            return true;
        },

        /**
         * 判断元素是否为空
         * @param element
         * @returns {boolean}
         */
        isEmpty: function (element) {
            if (typeof (element) === "undefined"
                || element === null
                || element === "") {
                return true;
            }
            return false;
        },
        /**
         * 判断变量是否是一个 “非undefined”且“非null”且“非Array”的有效 {对象}！
         * @param variable 变量
         * @returns {boolean} true：对象 false：非对象
         */
        isObject: function (variable) {
            return LMEPG.Func.isExist(variable) && !(variable instanceof Array) && (variable instanceof Object);
        },

        /**
         * 当时间间隔小于100毫秒时，就认为是操作有效
         * @returns {boolean}
         */
        checkClickValid: function () {
            var stbModel = LMEPG.Cookie.getCookie('stbModel');
            var lastTime = LMEPG.Cookie.getCookie('lastTime');

            if (stbModel == "" || lastTime == "") {
                return true;
            }

            // 中国联通基地--展厅的盒子，按键一次会响应两次
            if (stbModel != "EC6108V9U_pub_tjjlt") {
                return true;
            }

            var currentTime = new Date();    //当前时间
            var dt = currentTime.getTime();
            var diffTime = dt - lastTime; //时间差的毫秒数
            if (diffTime > 100) {
                LMEPG.Cookie.setCookie('lastTime', dt);
                return true;
            }
            return false;
        },

        /**
         * 下移算法：
         * 没有按钮则移动到最后一个按钮上
         * @param m：最大按钮数
         * @param n：每行按钮数
         * @param i：当前选项索引
         * @param s：拼接字符串前缀
         * @returns {*}
         */
        setDownFocus: function (m, n, i, s) {
            var l = +m % +n;
            var u = +m - +n;
            return l > 0 && i >= u && i < +m - l ? s + (+m - 1) : s + (i + +n);
        },

        /**
         * 获取浏览器跳转设置的参数
         * @param name
         * @returns {*}
         */
        getLocationString: function (name) {
            var searchString = location.search.length > 0 ? location.search.substring(1) : "";
            var stageArray = searchString.split('&');
            var objData = {};
            for (var i = stageArray.length; i--;) {
                var item = stageArray[i].split("=");
                var key = decodeURIComponent(item[0]);
                if (key) objData[key] = decodeURIComponent(item[1]);
            }
            return name ? objData[name] : objData;
        },
        /**
         * 随机打乱数组顺序
         * @param array
         * @returns {*}
         */
        shuffle: function (array) {
            var currentIndex = array.length,
                temporaryValue,
                randomIndex;
            while (currentIndex--) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        },
        /**
         * @param obj：滚动参数
         *
         * a.得失焦点文字滚动切换:
         * @param bol：得/失焦点->滚动/停止 true/false,
         * 调用示例->得到焦点：LMEPG.func.marquee({el: btnElement, len: nameLen, txt: txt}, true);
         * 调用示例->失去焦点：LMEPG.func.marquee();
         *
         * b.没有事件驱动文本滚动:
         * @param innerBol：传入标记(不涉及焦点得失),
         * 调用示例->LMEPG.func.marquee({txt:txt,len:200,dir:'up',vel:3},true,true )
         */
        marquee: function (obj, bol, innerBol) {
            bol && (this.rollObj = obj);
            var self = this.rollObj;

            // 得到焦点或失去焦点没有达到限制长度直接返回
            if (self.txt.length <= self.len) return self.txt;
            var htm = '<marquee ' +
                'style="float:left;width:100%;height:100%" ' +
                // 滚动速度
                'scrollamount="' + self.vel + '" ' +
                // 滚动方式（如来回滚动、从左至右滚动）
                'behavior="' + self.way + '" ' +
                // 滚动方向
                'direction="' + self.dir + '">' +
                self.txt +
                '</marquee>';
            if (innerBol) {
                // 返回没有事件驱动文本滚动
                return htm;
            } else {
                var txt = bol ? self.txt : this.substrByOmit(self.txt, self.len);
                var nodeInner = bol ? htm : txt;
                var currEl = self.el;
                if (currEl) currEl.innerHTML = nodeInner;
                return false;
            }
        },

        /**
         * 特殊符号结尾工具函数
         * @param str: 字符串
         * @param len: 截取长度
         * @param suf: 结尾后缀
         * @returns {string|*}
         */
        substrByOmit: function (str, len, suf) {
            if (str.length <= len) return str;
            var suffix = suf ? suf : '...';
            var subStr = str.slice(0, len);
            return subStr + suffix;
        },

        /***********************************************
         * Func内部类：数组的工具方法
         ***********************************************/
        array: {
            /**
             * 判断对象是否是数组
             * @param variable [any] 变量
             * @returns {boolean}
             */
            isArray: function (variable) {
                return LMEPG.Func.isArray(variable);
            },

            /**
             * 判断对象是数组且为空数组
             * @param array [array] 判断的数组
             * @return {boolean} true-空数组或者不是一个有效数组 false-非空数组
             */
            isEmpty: function (array) {
                return !this.isArray(array) || array.length === 0;
            },

            /**
             * 删除数组中指定的值并返回最新的数组。注意：该方法会改变原始数组，请根据实际情况使用！
             * @param srcArray [array] 原始数组
             * @param value [any] 要删除的指定元素
             * @return {Array} 删除元素后最新的数组
             */
            removeByValue: function (srcArray, value) {
                var index = srcArray.indexOf(value);
                if (index > -1) {
                    srcArray.splice(index, 1);
                }
                return srcArray;
            },

            /**
             * 判断某个值（目前仅支持：基本数据类型）是否在指定数组中。因为使用Array.indexOf()是 === 全类型比较，所以不满足
             * 当前需要，我们只需要检测其内容是否相等即可。
             * @param searchValue [any] 要检测的值
             * @param searchArray [array] 等检测值的参考范围数组
             * @return {boolean} true：包含。false：不包含
             * @author Songhui 2018-11-23
             */
            contains: function (searchValue, searchArray) {
                try {
                    for (var i = 0; i < searchArray.length; i++) {
                        if (searchArray[i] == searchValue) { // 注意：使用内容比较，不要用全等于“===”！！！
                            return true;
                        }
                    }
                } catch (e) { // 防止参数不合法，出错。
                    console.error('array.contains(' + searchValue + ' , ' + searchArray + ')--->Exception: ' + e.toString());
                }
                return false;
            }
        },

        /***********************************************
         * Func内部类：解解码器
         ***********************************************/
        codec: (function () {
            var LMCodecSdk = function () {
                var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

                /**
                 * Base64编码
                 * @param input [string] 输入内容
                 * @return {string} 返回编码后内容
                 */
                this.base64_encode = function (input) {
                    var output = "";
                    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                    var i = 0;
                    input = this.utf8_encode(input);
                    while (i < input.length) {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);
                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;
                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }
                        output = output +
                            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                    }
                    return output;
                };

                /**
                 * Base64解码
                 * @param input [string] 输入内容
                 * @return {string | *} 返回解码后内容
                 */
                this.base64_decode = function (input) {
                    var output = "";
                    var chr1, chr2, chr3;
                    var enc1, enc2, enc3, enc4;
                    var i = 0;
                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                    while (i < input.length) {
                        enc1 = _keyStr.indexOf(input.charAt(i++));
                        enc2 = _keyStr.indexOf(input.charAt(i++));
                        enc3 = _keyStr.indexOf(input.charAt(i++));
                        enc4 = _keyStr.indexOf(input.charAt(i++));
                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;
                        output = output + String.fromCharCode(chr1);
                        if (enc3 !== 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        if (enc4 !== 64) {
                            output = output + String.fromCharCode(chr3);
                        }
                    }
                    output = this.utf8_decode(output);
                    return output;
                };

                /**
                 * UTF-8编码
                 * @param input [string] 输入内容
                 * @return {string} 返回编码后内容
                 */
                this.utf8_encode = function (input) {
                    input = input.replace(/\r\n/g, "\n");
                    var utfText = "";
                    for (var n = 0; n < input.length; n++) {
                        var c = input.charCodeAt(n);
                        if (c < 128) {
                            utfText += String.fromCharCode(c);
                        } else if ((c > 127) && (c < 2048)) {
                            utfText += String.fromCharCode((c >> 6) | 192);
                            utfText += String.fromCharCode((c & 63) | 128);
                        } else {
                            utfText += String.fromCharCode((c >> 12) | 224);
                            utfText += String.fromCharCode(((c >> 6) & 63) | 128);
                            utfText += String.fromCharCode((c & 63) | 128);
                        }

                    }
                    return utfText;
                };

                /**
                 * UTF-8解码
                 * @param input [string] 输入内容
                 * @return {string} 返回编码后内容
                 */
                this.utf8_decode = function (input) {
                    var string = "";
                    var i = 0;
                    var c1 = 0;
                    var c2 = 0;
                    var c3 = 0;
                    while (i < input.length) {
                        c1 = input.charCodeAt(i);
                        if (c1 < 128) {
                            string += String.fromCharCode(c1);
                            i++;
                        } else if ((c1 > 191) && (c1 < 224)) {
                            c2 = input.charCodeAt(i + 1);
                            string += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
                            i += 2;
                        } else {
                            c2 = input.charCodeAt(i + 1);
                            c3 = input.charCodeAt(i + 2);
                            string += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                            i += 3;
                        }
                    }
                    return string;
                };
            };
            return new LMCodecSdk();
        })(),
    }
})();

/**
 * 事件管理
 * @type {{_keys, addEvent, delEvent}}
 */
LMEPG.KEM = LMEPG.KeyEventManager = (function () {
    return {
        // 存储注册的按键事件
        _keys: {},
        _isAllow: true,
        _keyCodes: new Array(100),

        /**
         * 初始化按键事件管理器
         */
        init: function () {
            //判断事件处理器是否定义，避免重复定义处理
            if (!LMEPG.onEvent) {
                LMEPG.onEvent = LMEPG.KeyEventManager._defaultKeyEvent;
            }
        },

        /**
         * 增加事件处理，支持单个事件和批量添加事件
         * @param code  事件id  可以是字符串和对象数据。不能是number
         * @param action 单个事件添加时的事件响应动作
         */
        addKeyEvent: function (code, action) {
            if (typeof code === 'string' && action !== undefined) {
                //单个添加事件，将单个事件转换成多个事件的对象，在统一添加处理
                var _code = code;
                code = {};
                code[_code] = action;
            }
            if (typeof code === 'object') {
                //批量添加按键事件
                var obj = code;
                for (var i in obj) {
                    if (i.indexOf('KEY_') === 0 || i.indexOf('EVENT_') === 0) {
                        //如果是“KEY_”或者“EVENT_”开头，视作按键
                        this._keys[i] = obj[i];
                    } else {
                        alert('错误：添加按键映射时code为不支持的类型！');
                    }
                }
            } else if (typeof code === 'number') {
                //根本不允许出现这种错误！
                alert('错误：添加按键映射时code不能为number类型！');
            }
            return this;
        },

        delKeyEvent: function (code) {
            if (!(code instanceof Array)) {
                //单个事件删除，转换成数组和多个事件删除统一处理
                code = [code];
            }
            for (var i = 0; i < code.length; i++) {
                if (this._keys[code[i]]) {
                    this._keys[code[i]] = 'LMEPG.emptyFunc()';
                }
            }
            return this;
        },

        /**
         * 得到按键序列
         */
        getKeyCodes: function () {
            return this._keyCodes;
        },

        /**
         * 是否允许响应按键事件, 如果该标志设置未假。将不响应按键事件到应用层。
         *
         * @param isAllow
         */
        setAllowFlag: function (isAllow) {
            if (isAllow === 'undefined') return;
            this._isAllow = isAllow;
        },

        /**
         * 默认按键处理器，如果外部没有重新定义，采用该按键处理器
         * @param code 按键值
         * @private
         */
        _defaultKeyEvent: function (code) {
            LMEPG.KeyEventManager._keyCodes.push(code);
            for (var i in LMEPG.KeyEventManager._keys) {
                if (code === window[i] && LMEPG.KeyEventManager._isAllow) {
                    if (code == KEY_BACK) {
                        var currentBtn = LMEPG.ButtonManager.getCurrentButton();
                        if (typeof (currentBtn) !== "undefined" && currentBtn &&
                            (typeof (currentBtn.type) !== "undefined") && currentBtn.type == BUTTON_TYPE_INPUTTEXT) {
                            return;
                        }
                    }
                    LMEPG.call(LMEPG.KeyEventManager._keys[i], code);
                }
            }
        },
    }
})();

/**
 * 自定义按钮控件管理器
 *
 * @type {{_buttons, _config, _previous, _current, _direction, init, requestFocus, getCurrentButton,
 * getPreviousButton, getButtonById, getNextFocusUpId, getNextFocusDownId, getNextFocusLeftId,
 * getNextFocusRightId, getNextFocusDownId, _onClick, _onMoveChange, _onBeforeMoveChange, _initDefaultKeyEvents,
 * _initButtons, _initDefaultFocusButton, _update, _getNextFocusId}}
 */
LMEPG.ButtonManager = LMEPG.bm = LMEPG.BM = (function () {
    return {
        _buttons: {},               // 自定义按钮数组
        _config: {},                // 初始化配置属性
        _previous: null,            // 上一个焦点按钮
        _current: null,             // 当前焦点按钮
        _direction: null,           // 上一次按键的方向
        _isKeyEventPause: false,   //按键事件是否暂停的标志
        _isKeyEventInterceptCallback: null,   //按键事件拦截方法

        /**
         * 初始化话按键管理器
         * @param focusId  默认按钮，字符串或者是数组，如果是数组，循环便利第一个存在的按钮
         * @param buttons  定义好的按钮数组
         * @param resPath  资源文件根路径。 如果资源文件采用相对路径时，使用该目录下面的资源路径。
         * @param isInitKeys 是否使用默认的按键处理器。
         */
        init: function (defaultFocusId, buttons, imagePath, defaultKeyEvents) {
            this.clearFocus();
            var config = defaultFocusId;
            if (arguments.length >= 2) {
                config = {
                    defaultFocusId: defaultFocusId,
                    buttons: buttons,
                    imagePath: imagePath,
                    defaultKeyEvents: defaultKeyEvents
                };
            }
            this._config = config;          // 保存配置参数
            this._initDefaultKeyEvents();
            this._initButtons();
            this._initDefaultFocusButton();
            this._update();
        },

        /**
         * 设置按键事件是否暂停（可恢复）
         * isPause true:暂停按键事件；false:按键事件正常使用
         */
        setKeyEventPause: function (isPause) {
            this._isKeyEventPause = isPause;
        },

        /**
         * 设置按键事件拦截方法
         * interceptCallback 拦截按键事件的方法，返回true标识拦截，返回false表示不拦截，改方法不存在表示不拦截
         */
        setKeyEventInterceptCallback: function (interceptCallback) {
            this._isKeyEventInterceptCallback = interceptCallback;
        },

        /**
         * 清除按键事件拦截方法
         */
        removeKeyEventInterceptCallback: function () {
            this._isKeyEventInterceptCallback = null;
        },

        /**
         * 创建button按钮对象
         * @param id  按钮ID
         * @param name 按钮名称
         * @param nextFocusLeft  向左按键焦点ID
         * @param nextFocusRight 向右按键焦点ID
         * @param nextFocusUp 向上按键焦点ID
         * @param nextFocusDown 向下按键焦点ID
         * @param backgroundImage 按钮背景图片
         * @param focusImage 获得焦点时背景图片
         * @param click  点击回调函数
         * @param focusChange  焦点改变回调函数
         * @param beforeMoveChange 焦点移动前回调函数
         * @param moveChange 焦点移动完成后回调函数
         * @returns {{id: *, name: *, nextFocusLeft: *, nextFocusRight: *, nextFocusUp: *, nextFocusDown: *, backgroundImage: *, focusImage: *, click: *, focusChange: *, beforeMoveChange: *, moveChange: *}}
         */
        createButton: function (id, name, nextFocusLeft, nextFocusRight, nextFocusUp, nextFocusDown, backgroundImage, focusImage, click, focusChange, beforeMoveChange, moveChange) {
            return {
                id: id,
                name: name,
                nextFocusLeft: nextFocusLeft,
                nextFocusRight: nextFocusRight,
                nextFocusUp: nextFocusUp,
                nextFocusDown: nextFocusDown,
                backgroundImage: backgroundImage,
                focusImage: focusImage,
                click: click,
                focusChange: focusChange,
                beforeMoveChange: beforeMoveChange,
                moveChange: moveChange
            }
        },

        /**
         * 增加Buttons 按钮,如果button为对象，则增加单个button.
         * 如果button是一个button按钮的数据，则增加多个button
         * @param button
         */
        addButtons: function (button) {
            var current = this._current;
            var previous = this._previous;
            if (!LMEPG.func.isArray(button)) {
                button = [button];
            }
            for (var i = 0; i < button.length; i++) {
                this.deleteButtons(button[i]);
                var _button = this._repairButton(button[i]);
                this._addOnclick(_button.id);
                this._buttons[_button.id] = _button;
                if (current != null && _button.id == current.id) {
                    this._current = _button
                }
                if (previous != null && _button.id == previous.id) {
                    this._previous = _button
                }
            }
        },

        /**
         * 删除button，如果buttonId是一个单独的按钮，删除单个buttonId.
         * 如果buttonId是一个buttonId的数组，删除一组button.
         * @param button
         */
        deleteButtons: function (btnId) {
            if (!LMEPG.func.isArray(btnId)) {
                btnId = [btnId];
            }
            for (var i in btnId) {
                if (this._previous != null && this._previous.id == btnId[i].id) {
                    this._previous = null;
                }
                if (this._current != null && this._current.id == btnId[i].id) {
                    this._current = null;
                }
                delete LMEPG.ButtonManager._buttons[btnId[i].id];
            }
        },

        /**
         * 刷新界面, 增加，删除按钮后，如果需要显示更新，需要调用此函数
         */
        refresh: function () {
            if (this._previous != null && this._buttons != null)
                this._previous = this._buttons[this._previous.id];
            if (this._current != null && this._buttons != null)
                this._current = this._buttons[this._current.id];
            this._update();
        },

        /**
         * 请求获得焦点
         * @param buttonId 按钮Id
         */
        requestFocus: function (buttonId) {
            var btn = this.getButtonById(buttonId);
            if (!btn || (typeof (btn.focusable) !== "undefined" && btn.focusable === false)) {
                //按钮不存在，不做任何处理
                return;
            }
            this._previous = this._current;
            this._current = btn;
            this._update();
        },

        /**
         * 清除焦点
         */
        clearFocus: function () {
            var current = this._current;
            if (current) {
                var _current = G(current.id);
                if (_current != null) {
                    if (current.backgroundImage) {
                        if (current.type == BUTTON_TYPE_DIV) {
                            _current.style.backgroundImage = current.backgroundImage;
                        } else {
                            _current.src = current.backgroundImage;
                        }
                    } else if (current.type == BUTTON_TYPE_INPUTTEXT) {
                        _current.disabled = true;
                        _current.blur();
                    }
                }
            }
        },

        /**
         * 设置按钮选中状态
         * @param btnId
         * @param selected
         */
        setSelected: function (btnId, selected) {
            var button = this.getButtonById(btnId);
            if (typeof (button) !== "undefined" && button) {
                // 相同的属性可能也需要刷新一下
                // if (typeof button.selected !== "undefined" && button.selected === selected) {
                //     return;
                // }

                // 设置按钮状态
                button.selected = selected;
                LMEPG.ButtonManager._buttons[button.id] = button;

                // 更新同一组的其他按钮的选中状态视图
                if (selected) {
                    if (typeof (button.groupId) !== "undefined"
                        && button.groupId != null
                        && button.groupId != "") {
                        var buttons = LMEPG.ButtonManager._buttons;
                        for (var btn in buttons) {
                            if (typeof (buttons[btn].groupId) !== "undefined"
                                && buttons[btn].groupId != null
                                && buttons[btn].groupId === button.groupId
                                && buttons[btn].id !== button.id) {
                                buttons[btn].selected = false;
                                LMEPG.ButtonManager._updateSelectStatus(buttons[btn]);
                            }
                        }
                    }
                }

                if (this._current != null && this._current.id === button.id) {
                    // 当前焦点ID被设置选中状态时，保持为焦点状态
                    return;
                }
                // 更新当前设置按钮的视图
                LMEPG.ButtonManager._updateSelectStatus(button);
            }
        },

        /**
         * 获取被选中的按钮
         * @param groudId
         */
        getSelectedButton: function (groupId) {
            var button = null;
            if (typeof (groupId) === "undefined" || groupId == null)
                groupId = "";

            var buttons = LMEPG.ButtonManager._buttons;
            for (var btn in buttons) {
                if (groupId == "" && (typeof (buttons[btn].groupId) === "undefined"
                    || buttons[btn].groupId == null || buttons[btn].groupId == "") && buttons[btn].selected) {
                    button = buttons[btn];
                    break;
                }
                if (groupId == buttons[btn].groupId && buttons[btn].selected) {
                    button = buttons[btn];
                }
            }
            return button;
        },

        _updateSelectStatus: function (button) {
            if (typeof (button) === "undefined"
                || button === null
                || typeof (button.selected) === "undefined"
                || button.selected == null) {
                return;
            }

            var _button = G(button.id);
            if (button.selected && button.selectedImage) {
                if (button.type == BUTTON_TYPE_DIV) {
                    _button.style.backgroundImage = 'url(\"' + button.selectedImage + '\")';
                } else {
                    _button.src = button.selectedImage;
                }
            } else if (button.backgroundImage) {
                if (button.type == BUTTON_TYPE_DIV) {
                    _button.style.backgroundImage = button.backgroundImage;
                } else {
                    _button.src = button.backgroundImage;
                }
            }
        },

        /**
         * 获取当前按钮对象
         */
        getCurrentButton: function () {
            if (!this._current) {
                //按钮不存在，不做任何处理
                return;
            }
            var id = this._current.id;
            return this.getButtonById(id);
        },

        /**
         * 获取上一个焦点按钮对象
         */
        getPreviousButton: function () {
            if (!this._previous) {
                //按钮不存在，不做任何处理
                return;
            }
            var id = this._previous.id;
            return this.getButtonById(id);
        },

        /**
         * 获取指定按钮“上/下/左/右”4个方向相邻的按钮对象
         * @param direction 方向值只能为：left / up / right / down
         * @param buttonId  指定按钮的id。如果不存在，则使用当前按钮作为基准按钮寻找。
         */
        getNearbyFocusButton: function (direction, buttonId) {
            var targetBtnId = buttonId;
            if (!targetBtnId) {
                targetBtnId = this._current.id;
            }
            var nextButtonId = this._getNextFocusId(targetBtnId, direction);
            if (nextButtonId) {
                return this.getButtonById(nextButtonId);
            }
        },

        /**
         * 通过按钮Id获得按钮对象
         * @param id
         * @param ignoreDomExist  是否忽略判断dom元素是否存在
         */
        getButtonById: function (id, ignoreDomExist) {
            if (id !== undefined) {
                if (ignoreDomExist !== undefined && ignoreDomExist) {
                    var btn = this._buttons[id];
                    //如果按钮配置了disable:true，那么视作这个按钮不存在
                    if (btn && btn.disabled !== true)
                        return this._buttons[id];
                } else {
                    var _button = G(id);
                    if (_button) {
                        var btn = this._buttons[id];
                        //如果按钮配置了disable:true，那么视作这个按钮不存在
                        if (btn && btn.disabled !== true)
                            return this._buttons[id];
                    }
                }
            }
            return null;
        },

        /**
         * 通过按钮Id获取向上按键的焦点Id
         * @param id
         */
        getNextFocusUpId: function (id) {
            var button = this.getButtonById(id);
            if (!button) {
                //按钮不存在，不做任何处理
                return;
            }
            return button.nextFocusUp;
        },

        /**
         * 通过按钮Id获取向下按键的焦点Id
         * @param id
         */
        getNextFocusDownId: function (id) {
            var button = this.getButtonById(id);
            if (!button) {
                //按钮不存在，不做任何处理
                return;
            }
            return button.nextFocusDown;
        },

        /**
         * 通过按钮Id获取向左按键的焦点Id
         * @param id
         */
        getNextFocusLeftId: function (id) {
            var button = this.getButtonById(id);
            if (!button) {
                //按钮不存在，不做任何处理
                return;
            }
            return button.nextFocusLeft;
        },

        /**
         * 通过按钮Id获取向右按键的焦点Id
         * @param id
         */
        getNextFocusRightId: function (id) {
            var button = this.getButtonById(id);
            if (!button) {
                //按钮不存在，不做任何处理
                return;
            }
            return button.nextFocusRight;
        },

        /**
         * 返回设置的有效按钮集合
         */
        getButtons: function () {
            return this._buttons;
        },

        /**
         * 默认确认按键处理回调
         * @private
         */
        _onClick: function () {
            LMEPG.call(this._current.click, [this._current]);
        }
        ,

        /**
         * 默认方向按键回调
         * @param dir 移动方向
         * @private
         */
        _onMoveChange: function (direction) {
            if (!this._current) {
                return;
            }
            this._direction = direction;

            if (this._onBeforeMoveChange(direction) === false) {
                return;
            }

            var button;
            var nextButtonId = this._getNextFocusId(this._current.id, direction);
            if (typeof nextButtonId == "string")
                nextButtonId = [nextButtonId];
            if (LMEPG.Func.isArray(nextButtonId)) {
                for (var i = 0; i < nextButtonId.length; i++) {
                    button = this.getButtonById(nextButtonId[i]);
                    if (button)
                        break;
                }
                if (button && (typeof (button.focusable) === "undefined" || button.focusable === true)) {
                    this._previous = this._current;
                    this._current = button;
                    this._update();
                }
            }
            LMEPG.call(this._current.moveChange, [this._previous, this._current, direction]);
        }
        ,

        /**
         * 执行改变前的回调
         * @param direction
         * @private
         */
        _onBeforeMoveChange: function (direction) {
            if (!this._current) {
                return;
            }
            if (this._current.beforeMoveChange) {
                return LMEPG.call(this._current.beforeMoveChange, [direction, this._current])
            }
        }
        ,

        /**
         * 初始化默认的按键事件
         * @private
         */
        _initDefaultKeyEvents: function () {
            if (this._config.defaultKeyEvents) {
                LMEPG.KeyEventManager.init();
                LMEPG.KeyEventManager.addKeyEvent(
                    {
                        KEY_ENTER: 'LMEPG.ButtonManager._onClick()',			                    // 确定键
                        KEY_LEFT: 'LMEPG.ButtonManager._onMoveChange("left")',		                // 左键
                        KEY_RIGHT: 'LMEPG.ButtonManager._onMoveChange("right")',		                // 右键
                        KEY_UP: 'LMEPG.ButtonManager._onMoveChange("up")',			                // 上键
                        KEY_DOWN: 'LMEPG.ButtonManager._onMoveChange("down")',		                // 下键
                        KEY_BACK: 'onBack()'							                                        // 返回键，onBack 由页面自行定义回调
                    });
            }
        }
        ,

        /**
         * 初始化按钮集合，修正部分参数
         * @private
         */
        _initButtons: function () {
            //初始化所有的按钮属性
            for (var i = 0; i < this._config.buttons.length; i++) {
                var button = this._config.buttons[i];
                button = this._repairButton(button);
                this._addOnclick(button.id);
                this._buttons[button.id] = button;
            }
        },

        /**
         * 触摸屏点击事件（内部默认调用）
         * @param tempId
         * @private
         */
        _addOnclick: function (tempId) {
            if (typeof RenderParam != "undefined" && RenderParam.carrierId == CARRIER_ID_WEILAITV_TOUCH_DEVICE) {
                if (G(tempId)) {
                    G(tempId).onclick = function () {
                        var btn = LMEPG.BM.getButtonById(tempId);
                        LMEPG.BM.requestFocus(btn.id);
                        // 延迟执行点击事件，保证焦点的选中图片显示出来，不然直接页面跳转回导致选中图片加载失败
                        setTimeout(function () {
                            LMEPG.call(btn.click, [btn]);
                        }, 100);
                    }
                }
            }
        },

        /**
         * 触摸屏点击事件
         * （外部主动调用。因为有可能_initButtons的时候，页面元素还未渲染，导致触摸屏点击监听事件失效，因此
         * 可以在页面渲染完成后主动调用此方法）
         * @public
         */
        initButtonsOnclick: function () {
            var currentButtonsPropertyNames = Object.getOwnPropertyNames(this._buttons);
            for (var i = 0; i < currentButtonsPropertyNames.length; i++) {
                var button = this._buttons[currentButtonsPropertyNames[i]];
                var tempId = button.id;
                this._addOnclick(tempId);
            }
        },

        /**
         * 修正button的部分参数
         * @param button
         * @private
         */
        _repairButton: function (button) {
            if (button) {
                var _button = G(button.id);

                if (!button.backgroundImage && _button) {
                    // 如果按钮没有设置backgroundImage图片，把src作为对应的图片按钮。要求必须写在window.onload里面，否则部分盒子获取不到src
                    button.backgroundImage = "";
                }
                if (this._config.imagePath && button.focusImage && button.focusImage.indexOf('http') < 0) {
                    //如果(配置了imagePath && 当前按钮配置了焦点图片 && 焦点图片不是http开头)
                    button.focusImage = this._config.imagePath + button.focusImage;
                }
                if (this._config.imagePath && button.backgroundImage && button.backgroundImage.indexOf('http') < 0) {
                    button.backgroundImage = this._config.imagePath + button.backgroundImage;
                }
                if (typeof button.focusable === "undefined") button.focusable = true;
            }
            return button;
        },


        /**
         * 初始化默认焦点
         * @private
         */
        _initDefaultFocusButton: function () {
            // 设置默认获得焦点的按钮
            if (typeof this._config.defaultFocusId === 'string') {
                this._current = this.getButtonById(this._config.defaultFocusId);
            } else if (LMEPG.Func.isArray(this._config.defaultFocusId)) {
                for (var i = 0; i < this._config.defaultFocusId.length; i++) {
                    var button = this.getButtonById(this._config.defaultFocusId[i]);
                    if (button) {
                        this._current = button;
                        break;
                    }
                }
            }
        }
        ,

        /**
         * 更新按钮状态
         * @private
         */
        _update: function () {
            var prev = this._previous;
            var current = this._current;

            //更新上一个按钮状态
            if (prev && G(prev.id)) {
                var _prev = G(prev.id);
                if (typeof prev.selected !== "undefined"
                    && prev.selected
                    && typeof prev.selectedImage !== "undefined"
                    && prev.selectedImage) {
                    //按钮为选中状态
                    if (prev.type == BUTTON_TYPE_DIV) {
                        _prev.style.backgroundImage = "url(" + prev.selectedImage + ")";
                    } else {
                        _prev.src = prev.selectedImage;
                    }
                } else if (prev.backgroundImage) {
                    if (prev.type == BUTTON_TYPE_DIV) {
                        _prev.style.backgroundImage = "url(" + prev.backgroundImage + ")";
                    } else {
                        _prev.src = prev.backgroundImage;
                    }
                } else if (prev.type == BUTTON_TYPE_INPUTTEXT) {
                    _prev.disabled = true;
                    _prev.blur();
                }
                LMEPG.call(prev.focusChange, [prev, false]);
            }
            //更新当前按钮的状态
            if (current && G(current.id)) {
                var _current = G(current.id);
                if (current.focusImage) {
                    if (current.type == BUTTON_TYPE_DIV) {
                        _current.style.backgroundImage = "url(" + current.focusImage + ")";
                    } else {
                        _current.src = current.focusImage;
                    }
                } else if (current.type == BUTTON_TYPE_INPUTTEXT) {
                    _current.disabled = false;
                    _current.focus();
                }

                LMEPG.call(current.focusChange, [current, true]);
            }
        }
        ,

        /**
         * 获取按钮的下一个焦点Id
         * @param id
         * @param direction
         * @private
         */
        _getNextFocusId: function (id, direction) {
            if (direction == "up") {
                return this.getNextFocusUpId(id)
            } else if (direction == "down") {
                return this.getNextFocusDownId(id)
            } else if (direction == "left") {
                return this.getNextFocusLeftId(id)
            } else if (direction == "right") {
                return this.getNextFocusRightId(id)
            }
        },
    }
})();

LMEPG.CssManager = (function () {
    return {
        /**
         * 判断样式是否存在，
         * 注意，标清盒子不一定支持，谨慎使用
         * @param obj 元素id或者元素对象
         * @param cls 样式名称
         * @returns {Array|{index: number, input: string}}
         */
        hasClass: function (obj, cls) {
            if (!obj) return;
            if (typeof obj === 'string') {
                //如果obj是字符串，id的话，先得到对象。
                obj = G(obj);
                if (!obj) return;
            }
            //判断是否有该样式
            if (strContain(obj.className, cls)) {
                return true;
            } else {
                return false;
            }
        },
        /**
         * 增加样式
         * 注意，标清盒子不一定支持，谨慎使用
         * @param obj
         * @param cls
         */
        addClass: function (obj, cls) {
            if (!obj) return;
            if (typeof obj === 'string') {
                //如果obj是字符串，id的话，先得到对象。
                obj = G(obj);
                if (!obj) return;
            }
            if (!this.hasClass(obj, cls)) obj.className += " " + cls;
        },
        /**
         * 删除样式
         * @param obj
         * @param cls
         */
        removeClass: function (obj, cls) {
            if (!obj) return;
            if (typeof obj === 'string') {
                //如果obj是字符串，id的话，先得到对象。
                obj = G(obj);
                if (!obj) return;
            }
            if (this.hasClass(obj, cls)) {
                obj.className = obj.className.replace(eval("/" + cls + "/g"), ' ');
            }
        }
    }
})();

/**
 * 统计管理器，
 * @type {{ajax: LMEPG.StatManager.ajax}}
 */
LMEPG.StatManager = (function () {
    return {
        /**
         * 异步上报数据接口
         * @param url
         * @param async
         * @param fnSuccess
         * @param fnError
         */
        ajax: function (url, async, fnSuccess, fnError) {
            var xmlHttp = null;
            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (xmlHttp) {
                /** 监听请求状态改变 */
                xmlHttp.onreadystatechange = function () {
                    if (xmlHttp.readyState == 4) {
                        var rsp = xmlHttp.responseText || xmlHttp.responseXML;
                        rsp = eval("(" + rsp + ")");
                        if (xmlHttp.status == 200)
                            LMEPG.call(fnSuccess, [rsp]);
                        else
                            LMEPG.call(fnError, [rsp]);
                    }
                };
                xmlHttp.open("GET", url, async);
                xmlHttp.send(null);
                xmlHttp = null;
            } else {
                var img = document.createElement('img');
                img.src = url;
                img.style.visibility = 'hidden';//图片必须隐藏
                document.body.appendChild(img);
            }
        },

        /**
         * 上报心包，统计用户在线情况
         */
        sendHeartbeat: function () {
            var url = LMEPG.ajax.getAppRootPath() + '/index.php/Api/System/sendHeart';
            this.ajax(url, false);  //异步上传
        },

        loopPayResult: function() {
            var url = LMEPG.ajax.getAppRootPath() + '/index.php/Api/Pay/loopPayResult';
            this.ajax(url, false,function (rsp) {
                if(rsp.result == 1 && LMEPG.ui){
                    // 弹窗提示
                    LMEPG.ui.showToast(rsp.msg);
                }
            });  //异步上传
        },
    }
})();

//附件到window对象上
window.lmepg = LMEPG;

/**
 * 判断字符串是否以指定内容开头
 * @param str
 * @returns {boolean} 匹配指定开头内容，返回为真。否则为假。
 */
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};

/**
 * 判断字符串是否以指定内容结尾
 * @param str
 * @returns {boolean} 匹配指定结尾内容，返回为真。否则为假。
 */
String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
};

/**
 * 格式化时间
 * @param fmt
 * @returns {*}
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

/**
 * 定义原生使用占位符的方法，格式化数据。使用示例：
 *  "我叫{0}，来自{1}。".format("张三", "北京")
 * @returns {*}
 */
String.prototype.format = function () {
    // 数据长度为空，则直接返回
    if (!arguments || arguments.length <= 0) {
        return this;
    }

    // 使用正则表达式，循环替换占位符数据
    var self = this;
    if (typeof arguments === 'object') {
        for (var key in arguments) {
            if (arguments.hasOwnProperty(key)) self = self.replace(new RegExp("\\{" + key + "\\}", "g"), arguments[key]);
        }
    } else {
        for (var i = 0; i < arguments.length; i++) self.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    }
    return self;
};

// 结束声明命名空间LMEPG后，引入业务扩展js
try {
    console.debug('lmcommon.js g_appRootPath=' + g_appRootPath);
    document.writeln('<script type="text/javascript" src="' + g_appRootPath + '/Public/common/js/lmcommonExt.js?t=' + new Date().getTime() + '"></script>');
} catch (e) {
    console.error('lmcommon.js includes JS-Files error:' + e.toString());
}

