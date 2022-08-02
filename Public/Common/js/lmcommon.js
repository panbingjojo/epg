// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | LongMaster IPTV EPG 前端最核心js：包含系列核心通用操作！
// +----------------------------------------------------------------------
// | 说明：
// |    1.  全局唯一根命名空间声明：LMEPG
// |    2.  应用上下文环境和相关属性：LMEPG.App
// |    3.  Cookie封装：LMEPG.Cookie
// |    4.  AJAX(Asynchronous JavaScript+XML)异步请求封装：LMEPG.ajax
// |    5.  Intent路由跳转封装：LMEPG.Intent
// |    6.  Log日志封装：LMEPG.Log
// |    7.  统计管理器：LMEPG.StatManager
// |    8.  通用函数库：LMEPG.Func
// |    9.  全局事件监听器：LMEPG.KeyEventManager
// |    10. 自定义按钮控件管理器：LMEPG.ButtonManager
// |    11. CSS样式管理器：LMEPG.CssManager
// |    12. 机顶盒相关操作封装：LMEPG.STBUtil
// |    13. EPG调APK问诊插件封装：LMEPG.ApkPlugin
// +----------------------------------------------------------------------
// | 使用：
// |    1. 必须为首个js引用。
// |        e.g. <head>...<script type="text/javascript" src="__ROOT__/Public/Common/js/lmcommon.js?t={$time}"></script>...</head>
// +----------------------------------------------------------------------
// | 修改规则：
// |    1. 定义Object类名时，请按照“大驼峰命名法”。
// |        e.g. LMEPG.Log/LMEPG.Func/LMEPG.Cookie/LMEPG.ButtonManager/LMEPG.KeyEventManager
// |        >>>>>但注意一下，LMEPG.ajax暂时特殊，为全小写！<<<<<
// |    2. 定义Object类名时，若为简短类名缩写，请按照“首字母”大写。
// |        e.g. MEPG.UI/LMEPG.BM/LMEPG.KEM
// |    3. 请统一按照功能及相关性，定义类/方法所在合适区域位置！！！
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/10/11
// +----------------------------------------------------------------------

/******************************************************************
 * 全局变量设置，区域码ID。
 *****************************************************************/
var CARRIER_ID_SHANDONG_HICON = '371092'; // 山东电信海看项目区域id

/******************************************************************
 * 全局变量判断和设置，比如是否是调试模式，是否是android盒子等等。
 *****************************************************************/
window.loadJSStartDT = new Date().getTime();
window.isWinOS = typeof isWinOS !== "undefined";
if (typeof debug === "undefined") {
    window.debug = true;//调试模式，上线后必须把此参数改为false！
    window.local_debug = true;//针对贵州广电新媒体，代码放到贵州电信lws下，本机调试设为true，上线后必须把此参数改为false！
    window.isPreventDefault = true; // 启用浏览器默认按键功能（方便调试）
}

/***************************************************************
 * 事件定义：
 * KEY_ 开头的是系统按键事件
 * EVENT_ 开头的是虚拟按键
 ***************************************************************/
var KEY_MANGGUOTV_BACK = 0x0004;           //联通芒果TV返回按键
var KEY_MANGGUOTV_UP = 0x0013;             //联通芒果TV上按键）
var KEY_MANGGUOTV_DOWN = 0x0014;           //联通芒果TV下按键
var KEY_MANGGUOTV_ENTER = 0x0017;          //联通芒果TV确认按键
var KEY_MANGGUOTV_LEFT = 0x0015;           //联通芒果TV左按键
var KEY_MANGGUOTV_RIGHT = 0x0016;          //联通芒果TV右按键）


var KEY_BACK = 0x0008;              // 返回/删除
var KEY_BACK_640 = 0x0280;          // 返回按键（值为640）
var KEY_BACK_24 = 0x0018;           // 返回/删除（中国联通辽宁返回按键）
var KEY_BACK_ANDROID = 0xffff; 	    // Android返回键（安卓返回键code=4）
var KEY_ENTER = 0x000D;             // 确定
var KEY_PAGE_UP = 0x0021;           // 上页
var KEY_PAGE_DOWN = 0x0022;         // 下页
var KEY_LEFT = 0x0025;              // 左
var KEY_LEFT_65 = 0x0041;           // 左
var KEY_UP = 0x0026;                // 上
var KEY_UP_87 = 0x0057;             // 上
var KEY_RIGHT = 0x0027;             // 右
var KEY_RIGHT_68 = 0x0044;	        // 右
var KEY_DOWN = 0x0028;	            // 下
var KEY_DOWN_83 = 0x0053;	        // 下
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
var KEY_VOL_UP_61 = 0x003D; 	    // Vol+，音量加
var KEY_VOL_UP_447 = 0x01BF;	    // Vol+，音量加（四川广电）
var KEY_VOL_UP_1095 = 0x0447;	    // Vol+，音量加（四川广电）
var KEY_VOL_DOWN = 0x0104;	        // Vol-，音量减
var KEY_VOL_DOWN_45 = 0x002D;	    // Vol-，音量减
var KEY_VOL_DOWN_448 = 0x01C0;	    // Vol-，音量减（四川广电）
var KEY_VOL_DOWN_1096 = 0x0448;	    // Vol-，音量减（四川广电）
var KEY_MUTE = 0x0105;	            // Mute，静音
var KEY_MUTE_67 = 0x0043;	        // Mute，静音
var KEY_MUTE_1097 = 0x0449;	        // Mute，静音（四川广电）
var KEY_TRACK = 0x0106;	            // Audio Track，切换音轨
var KEY_PLAY = 0x019F;				// 播放功能键：>，播放（四川广电）
var KEY_PLAY_1045 = 0x0415;			// 播放功能键：>，播放（四川广电）
var KEY_PLAY_PAUSE = 0x0107;	    // 播放功能键：>||，暂停
var KEY_PLAY_PAUSE_19 = 0x0013;	    // 播放功能键：>||，暂停（四川广电）
var KEY_PLAY_STOP = 0x010e;	        // 播放功能键：□，停止
var KEY_FAST_FORWARD = 0x0108;	    // 播放功能键：>> ，快进
var KEY_FAST_FORWARD_417 = 0x01A1;	// 播放功能键：>> ，快进（四川广电）
var KEY_FAST_REWIND = 0x0109;	    // 播放功能键：<< ，快退
var KEY_FAST_REWIND_412 = 0x019C;	// 播放功能键：<< ，快退（四川广电）
var KEY_RED = 0x0113;               // 红色键
var KEY_GREEN = 0x0114;             // 绿色键
var KEY_YELLOW = 0x0115;            // 黄色键
var KEY_BLUE = 0x0116;              // 蓝色键
var KEY_DELETE = 0x0118;            // 删除键中兴盒子
var KEY_VIRTUAL_EVENT = 0x0300;     // 虚拟事件按键（768）
var KEY_EXIT = 0x001B;              // 退出按键（非home键）
var KEY_399 = 0x018F;               // 广西广电返回键
var KEY_514 = 0x0202;               // 广西广电退出键
var KEY_5002 = 5002;                // 广西广电--加载成功，开始播放
var KEY_5004 = 5004;                // 广西广电播--加上失败
var KEY_5006 = 5006;                // 广西广电播--正常播放结束
var KEY_5007 = 5007;                // 广西广电--播放结束，用户按退出或其他快捷键结束播放
var KEY_5008 = 5008;                // 广西广电--播放异常
var KEY_5010 = 5010;                // 广西广电--恢复播放
var KEY_MEDIA_END = 0x32D7;         // 播放结束（四川广电）
var KEY_CHANNEL_UP = 0x0021;        // 频道+（山东）
var KEY_CHANNEL_DOWN = 0x0022;      // 频道-（山东）

var BUTTON_TYPE_DIV = "div";                        //焦点按钮类型---- div
var BUTTON_TYPE_INPUTTEXT = "input-test";         	//焦点按钮类型---- 输入框

var EVENT_MEDIA_END = "EVENT_MEDIA_END";            // 视频播放结束
var EVENT_MEDIA_ERROR = "EVENT_MEDIA_ERROR";        // 视频播放错误

// 允许的进入类型
var ACCESS_NO_TYPE = 0;                             // 不区分类型，只要是VIP就可以
var ACCESS_PLAY_VIDEO_TYPE = 1;                     // 观看视频
var ACCESS_VIDEO_INQUIRY_TYPE = 2;                  // 视频问诊
var ACCESS_TEL_INQUIRY_TYPE = 3;                    // 电话问诊
var ACCESS_HEALTH_MEASURE_TYPE = 4;                 // 健康检测

// 记录当前页，是否已经按过back键了。
// 用于：避免已经在返回但页面还未及时返回用户再次操作时，导致其它意想不到的逻辑异常（通常为stack已pop）！
var G_IS_BACK_PRESSED = false;
// 函数只执行一次标识
var onceFnCalledSign = false;

// 基本常量
var G_CONST = {
    // 方向（键值勿改！）
    left: "left", right: "right", up: "up", down: "down", center: "center"
};

/*****************************************************************
 * 通用快捷函数定义：
 *****************************************************************/
/**
 * 根据控件ID返回控件的引用
 * @param id [string] 控件（元素）id
 * @returns {Element} 返回对象引用
 */
function G(id) {
    return document.getElementById(id);
}

/**
 * 简短方法名，判断元素是否定义
 * @param obj [any]
 * @return {*|boolean}
 */
function is_exist(obj) {
    return LMEPG.Func.isExist(obj);
}

/**
 * 简短方法名，判断元素是否为空
 * @param obj [any]
 * @return {*|boolean}
 */
function is_empty(obj) {
    return LMEPG.Func.isEmpty(obj);
}

/**
 * 简短方法名，根据控件元素id判断该元素在dom中是否存在且有效
 * @param elementId [string] 元素id
 * @return {boolean} true-有效存在 false-不存在
 */
function is_element_exist(elementId) {
    return LMEPG.Func.isElementExist(elementId);
}

/**
 * 判断是否为 高清(hd) 平台
 * @returns {boolean} true-hd false-sd
 */
function I_HD() {
    if (typeof window.top.lmsl === "undefined") window.top.lmsl = get_platform_type();
    return window.top.lmsl === "hd";
}

/**
 * 显示控件（visibility属性）
 * @param id [string|dom object] dom元素id或者dom元素对象
 */
function S(id) {
    var temp = id instanceof HTMLElement ? id : G(id);
    if (temp) {
        temp.style.visibility = "visible";
    }
}

/**
 * 隐藏控件（visibility属性）
 * @param id [string|dom object] dom元素id或者dom元素对象
 */
function H(id) {
    var temp = id instanceof HTMLElement ? id : G(id);
    if (temp) {
        temp.style.visibility = "hidden";
    }
}

/**
 * 显示一个元素，与S不同的是，修改的是display属性<br>
 * 修改visibility的最大缺点是：如果子元素是显示的话，即使父元素隐藏了子元素也不会隐藏
 * @param id [string|dom object] dom元素id或者dom元素对象
 */
function Show(id) {
    var temp = id instanceof HTMLElement ? id : G(id);
    if (temp) {
        temp.style.display = "block";
    }
}

/**
 * 隐藏一个元素，与H不同的是，修改的是display属性<br>
 * add by lxa 20140922
 * 修改visibility的最大缺点是：如果子元素是显示的话，即使父元素隐藏了子元素也不会隐藏
 * @param id [string|dom object] dom元素id或者dom元素对象
 */
function Hide(id) {
    var temp = id instanceof HTMLElement ? id : G(id);
    if (temp) {
        temp.style.display = "none";
    }
}

/**
 * 判断 visibility 属性是否显示
 * @param id [string|dom object] dom元素id或者dom元素对象
 * @return {Element|boolean} null/undefined-不存在 或 boolean[true-显示 false-隐藏]
 */
function isS(id) {
    var temp = id instanceof HTMLElement ? id : G(id);
    var getVisibility = temp && temp.style.visibility;
    return temp && getVisibility && getVisibility !== "hidden";
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
    return temp && typeof getDisplay != "undefined" && getDisplay !== "none";
}

/**
 * 简短工具函数--删除DOM自身
 * @param id
 */
function delNode(id) {
    var nodeMe = G(id);
    if (nodeMe) nodeMe.parentNode.removeChild(nodeMe);
}

/**
 * 是否已经按过返回键：
 * 用于记录当前页是否已经按返回键了，避免已经在返回但页面还未及时返回用户再次操作时，导致其它意想不到的逻辑异常（通常为stack已pop）！
 *
 * @return {boolean} true-当前页已按back键。false-未按过back键。
 */
function isBackPressed() {
    if (!G_IS_BACK_PRESSED) {
        G_IS_BACK_PRESSED = true;
        return false;
    } else {
        return true;
    }
}

/**
 * 按back键默认返回实现（为兼容页面遗漏或者通用定义冗余）。
 * 注：若存在其它业务逻辑，请具体页面定义覆写！
 */
function onBack() {
    LMEPG.Intent.back();
}

/**
 * 通过id查找标签
 * 注：模拟jq标签选择器相当于（"#test p"）
 */
function findChildrenById(id, childNodeName) {
    var resultNodeList = []

    if (!childNodeName && typeof childNodeName !== 'string') return resultNodeList
    childNodeName = childNodeName.toUpperCase()

    var parentNode = document.getElementById(id)
    if (!parentNode) return resultNodeList

    var childrenNodeList = parentNode.children

    for (var i = 0; i < childrenNodeList.length; i++) {
        if (childrenNodeList[i].nodeName === childNodeName) {
            resultNodeList.push(childrenNodeList[i])
        }
    }

    return resultNodeList
}

/**
 * 获取css中的属性
 * @param id [string] 控件id
 * @param propertyName [string] 属性名
 */
function getPropertyValue(id, propertyName) {
    return getComputedStyle(document.getElementById(id), null).getPropertyValue(propertyName);
}

/**
 * 判断src字符串中是否包含的des字符串
 * @param src
 * @param dst
 */
function strContain(src, dst) {
    if (is_empty(src) || is_empty(dst)) {
        return false;
    }

    for (var i = 0; i < (src.length - dst.length + 1); i++) {
        for (var j = 0; j < dst.length; j++) {
            if (src[i + j] == dst[j]) {
                if (j == (dst.length - 1)) {
                    return true;
                }
            } else {
                break;
            }
        }
    }
    return false;
}

/**
 * 获取[minValue, maxValue]之间的随机整数
 *
 * @param minValue [number] 最小值
 * @param maxValue [number] 最大值
 * @returns {number} 随机整数
 */
function getRandom(minValue, maxValue) {
    var choices = Math.floor(maxValue - minValue) + 1;
    return Math.floor(Math.random() * choices + minValue);
}

/**
 * <pre>
 * 通过对象及其对象下的属性名，返回对应的值。主要是为了避免相同操作（获取某一对象的某一属性，进行一系列的判断，诸如
 * 该对象是否存在某属性等），因为中间未判断原因导致js出错，故此统一用try-catch捕获错误，异常时返回空串“”。
 *
 * 使用示例：get_obj_value_by(obj, "Name.v")
 *          表示尝试返回对象 obj.Name.v 的值
 * </pre>
 *
 * @param obj [object] 对象
 * @param property [string] 属性名
 * @return {*} 空串“”或具体的属性值[maybe any javascript data-type]
 */
function get_obj_value_by(obj, property) {
    try {
        if (LMEPG.Func.isObject(obj)) {
            return eval("obj." + property);
        } else {
            return "";
        }
    } catch (e) {
        //LMEPG.Log.error('get_obj_value_by(' + obj + ', ' + property + ') >>> Occurred Exception: ' + e.toString());
        return "";
    }
}

/**
 * 简短方法名，强转输入number数值转换为int并返回。
 * @param numberVal [number|string] 只能为number或string类型的“数值”！
 * @return {number} 返回强转后的int数值。若提供的入参无效，则默认为0。
 */
function get_as_int(numberVal) {
    return LMEPG.Func.formatter.getAsNumber(numberVal, false);
}

/**
 * 获取当前页在<head></head>定义的全局carrierId：平台码
 * @return {string} 若定义声明，则返回string类型的carrierId。否则，返回空字符串""。
 */
function get_carrier_id() {
    // 简单缓存于当前页面，避免调用多次查询！
    if (typeof window.top.lmcid !== "string" || window.top.lmcid === "") {
        window.top.lmcid = LMEPG.Func.getAppBusinessValue(["carrierId", "lmcid"], function () {
            return LMEPG.App.getCarrierId(); //若前面两种页面都未定义，则尝试用应用首次进入缓存的值
        });
    } else {
        // console.debug("-->Hey! lmcid from cache: " + window.top.lmcid);
    }
    //carrier_id添加保护，防止lmcid与cookie内容不一样的情况
    if (!LMEPG.Func.isEmpty(LMEPG.App.getCarrierId())) {
        if (window.top.lmcid != LMEPG.App.getCarrierId()) {
            window.top.lmcid = LMEPG.App.getCarrierId();
        }
    }
    return window.top.lmcid;
}

/**
 * 获取当前页在<head></head>定义的全局areaCode：平台-省份码
 * @return {string} 若定义声明，则返回string类型的areaCode。否则，返回空字符串""。
 */
function get_area_code() {
    // 简单缓存于当前页面，避免调用多次查询！
    if (typeof window.top.lmareaCode !== "string" || window.top.lmareaCode === "") {
        window.top.lmareaCode = LMEPG.Func.getAppBusinessValue("areaCode", function () {
            return LMEPG.Cookie.getCookie("c_area_code"); //若前面两种页面都未定义，则尝试用应用首次进入缓存的值
        });
    } else {
        // LMEPG.Log.error("-->Hey! lmareaCode from cache: " + window.top.lmareaCode);
    }
    return window.top.lmareaCode;
}

function get_user_account_id() {
    // 简单缓存于当前页面，避免调用多次查询！
    if (typeof window.top.accountId !== "string" || window.top.accountId === "") {
        window.top.accountId = LMEPG.Func.getAppBusinessValue(["accountId", "userAccount"], function () {
            return LMEPG.Cookie.getCookie("c_account_id"); //若前面两种页面都未定义，则尝试用应用首次进入缓存的值
        });
    } else {
        // console.debug("-->Hey! accountId from cache: " + window.top.accountId);
    }
    return window.top.accountId;
}

/**
 * 获取当前页在<head></head>定义的全局subAreaCode：平台-省份-地区码
 * @return {string} 若定义声明，则返回string类型的subAreaCode。否则，返回空字符串""。
 */
function get_sub_area_code() {
    // 简单缓存于当前页面，避免调用多次查询！
    if (typeof window.top.lmsubAreaCode !== "string" || window.top.lmsubAreaCode === "") {
        window.top.lmsubAreaCode = LMEPG.Func.getAppBusinessValue("subAreaCode", function () {
            return LMEPG.Cookie.getCookie("c_sub_area_code"); //若前面两种页面都未定义，则尝试用应用首次进入缓存的值
        });
    } else {
        // LMEPG.Log.error("-->Hey! lmsubAreaCode from cache: " + window.top.lmsubAreaCode);
    }
    return window.top.lmsubAreaCode;
}

/**
 * 获取当前页在<head></head>定义的全局platformType：高/标清平台（hd、sd）
 * @return {string} 若定义声明，则返回string类型的subAreaCode。否则，返回空字符串""。
 */
function get_platform_type() {
    // 简单缓存于当前页面，避免调用多次查询！
    if (typeof window.top.lmplatformType !== "string" || window.top.lmplatformType === "") {
        window.top.lmplatformType = LMEPG.Func.getAppBusinessValue("platformType", function () {
            return LMEPG.Cookie.getCookie("c_platform_type"); //若前面两种页面都未定义，则尝试用应用首次进入缓存的值
        });
    } else {
        // LMEPG.Log.error("-->Hey! lmplatformType from cache: " + window.top.lmplatformType);
    }
    return window.top.lmplatformType;
}

/**
 * 判断字符串是否以指定内容开头
 * @param str [string] 指定匹配参数。
 * @returns {boolean} 匹配指定开头内容，返回为真。否则为假。
 */
String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
};

/**
 * 判断字符串是否以指定内容结尾
 * @param str [string] 指定匹配参数。
 * @returns {boolean} 匹配指定结尾内容，返回为真。否则为假。
 */
String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");
    return reg.test(this);
};

if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {

        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

/**
 * 格式化时间
 * @param formatPattern [string] 格式化模式。例如：["yyyy-MM-dd hh:mm:ss"|"yyyy/MM/dd hh:mm:ss"|...]
 * @returns {*} 返回指定格式化后的日期时间字符串
 */
Date.prototype.format = function (formatPattern) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(formatPattern)) {
        formatPattern = formatPattern.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(formatPattern)) {
            formatPattern = formatPattern.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return formatPattern;
};

/**
 * 兼容旧环境
 * 参考: http://es5.github.com/#x15.4.4.19
 * 针对浏览器不支持ES 2015 Object.create,Array: forEach、map、filter、some、every
 * */
(function () {
    // Object.create
    if (typeof Object.create !== "function") {
        Object.create = function (proto, propertiesObject) {
            if (typeof proto !== 'object' && typeof proto !== 'function') {
                throw new TypeError('Object prototype may only be an Object: ' + proto);
            } else if (proto === null) {
                throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
            }

            if (typeof propertiesObject != 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

            function F() {
            }

            F.prototype = proto;

            return new F();
        };
    }

    // Array.forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    // Array.filter
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (func, thisArg) {
            'use strict';
            if (!((typeof func === 'Function' || typeof func === 'function') && this)) {
                throw new TypeError();
            }

            var len = this.length >>> 0,
                res = new Array(len), // preallocate array
                t = this, c = 0, i = -1;
            if (thisArg === undefined) {
                while (++i !== len) {
                    // checks to see if the key was set
                    if (i in this) {
                        if (func(t[i], i, t)) {
                            res[c++] = t[i];
                        }
                    }
                }
            } else {
                while (++i !== len) {
                    if (i in this) {
                        if (func.call(thisArg, t[i], i, t)) {
                            res[c++] = t[i];
                        }
                    }
                }
            }

            res.length = c;
            return res;
        };
    }

    // Array.map
    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, thisArg) {
            var T, A, k;
            if (this == null) {
                throw new TypeError(' this is null or not defined');
            }

            // 1. 将O赋值为调用map方法的数组.
            var O = Object(this);

            // 2.将len赋值为数组O的长度.
            var len = O.length >>> 0;
            if (Object.prototype.toString.call(callback) !== '[object Function]') {
                throw new TypeError(callback + ' is not a function');
            }
            if (thisArg) {
                T = thisArg;
            }
            A = new Array(len);
            k = 0;
            while (k < len) {
                var kValue, mappedValue;
                if (k in O) {
                    kValue = O[k];
                    mappedValue = callback.call(T, kValue, k, O);
                    A[k] = mappedValue;
                }
                k++;
            }
            return A;
        };
    }

    // Array.some
    if (!Array.prototype.some) {
        Array.prototype.some = function (fun/*, thisArg*/) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.some called on null or undefined');
            }
            if (typeof fun !== 'function') {
                throw new TypeError();
            }
            var t = Object(this);
            var len = t.length >>> 0;
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t && fun.call(thisArg, t[i], i, t)) {
                    return true;
                }
            }
            return false;
        };
    }

    // Array.every
    if (!Array.prototype.every) {
        Array.prototype.every = function (callbackfn, thisArg) {
            'use strict';
            var T, k;
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }
            var O = Object(this);
            var len = O.length >>> 0;
            if (typeof callbackfn !== 'function') {
                throw new TypeError();
            }
            if (arguments.length > 1) {
                T = thisArg;
            }
            k = 0;
            while (k < len) {
                var kValue;
                if (k in O) {
                    kValue = O[k];
                    var testResult = callbackfn.call(T, kValue, k, O);
                    if (!testResult) {
                        return false;
                    }
                }
                k++;
            }
            return true;
        };
    }


    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
            value: function (searchElement, fromIndex) {

                if (this == null) {//this是空或者未定义，抛出错误
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);//将this转变成对象
                var len = o.length >>> 0;//无符号右移0位，获取对象length属性，如果未定义就会变成0

                if (len === 0) {//length为0直接返回false未找到目标值
                    return false;
                }

                var n = fromIndex | 0;//查找起始索引
                var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);//计算正确起始索引，因为有可能是负值

                while (k < len) {//从起始索引处开始循环
                    if (o[k] === searchElement) {//如果某一位置与寻找目标相等，返回true，找到了
                        return true;
                    }
                    k++;
                }
                return false;//未找到，返回false
            }
        });
    }
})();

/**
 * Base64，暂时为兼容未整合lmauthEx.js！
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

/*****************************************************************
 * （必须：首个声明！）全局唯一根命名空间声明：LMEPG
 *****************************************************************/
var LMEPG = {
    /**
     * 函数调用（供调用回调函数使用）
     * @param fn [function] 需要调用的函数
     * @param args [string|array] 需要传递的参数数组
     * @returns {*} 返回调用返回的结果
     */
    call: function (fn, args) {
        if (typeof fn == "string" && fn !== "") {
            return eval("(" + fn + ")");
        } else if (typeof fn == "function") {
            if (!this.Func.isArray(args)) {
                var temp = [];
                for (var i = 1; i < arguments.length; i++) {
                    temp.push(arguments[i]);
                }
                args = temp;
            }
            return fn.apply(window, args);
        }
    },

    /**
     * 空方法，需要清除操作时使用，
     */
    emptyFunc: function () {
        // NEEDN'T DO NOTHING HERE!
    },

    /*
     * 事件回调, 如果页面需要自己定义事件处理器，可以在页面单独配置使用： [function] args[code]
     *     e.g. onEvent = function (code){}
     */
    onEvent: null
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
    };
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
            if (LMEPG.App.getCarrierId() == "520095" && appRootPath.indexOf("lmzhjkpic") == -1 && !window.local_debug) {
                appRootPath = appRootPath + '/lmzhjkpic';
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
var g_appRootPath = appRootPath = LMEPG.App.getAppRootPath();

/*****************************************************************
 * AJAX(Asynchronous JavaScript+XML)异步请求封装
 *****************************************************************/
LMEPG.ajax = (function () {
    return {
        /**
         * 以“POST方式”进行AJAX请求。
         *
         * @param url [string] 请求url
         * @param data [object] 请求数据
         * @param onSuccess [function] 成功回调函数，附带1个形参（string|object|array，具体类型决定于后端）
         * @param onError [function] 失败回调函数
         */
        postAPI: function (url, data, onSuccess, onError) {
            if (!/^http:\/\//.test(url)) {
                url = LMEPG.ajax.getAppRootPath() + "/index.php/Api/" + url;
            } else {
                // NO RE-CHANGED AND JUST KEEP IT!
            }
            LMEPG.ajax.post({
                url: url,
                requestType: "POST",
                dataType: "json",
                data: data,
                success: function (xmlHttp, rsp) {
                    LMEPG.call(onSuccess, [rsp]);
                },
                error: onError || function () {
                    LMEPG.Log.error("Ajax request error!");
                }
            });
        },

        /**
         * 以“GET方式”进行AJAX请求。
         *
         * @param url [string] 请求url
         * @param data [object] 请求数据
         * @param onSuccess [function] 成功回调函数，附带1个形参（string|object|array，具体类型决定于后端）
         * @param onError [function] 失败回调函数
         */
        GETAPI: function (url, onSuccess, onError) {
            if (!/^http:\/\//.test(url)) {
                url = LMEPG.ajax.getAppRootPath() + "/index.php/Api/" + url;
            } else {
                // NO RE-CHANGED AND JUST KEEP IT!
            }

            LMEPG.ajax.post({
                url: url,
                requestType: "GET",
                dataType: "json",
                success: function (xmlHttp, rsp) {
                    LMEPG.call(onSuccess, [rsp]);
                },
                error: onError || function () {
                    LMEPG.Log.error("Ajax request error!");
                }
            });
        },


        /**
         * 执行 POST 请求
         *
         * @param config [object] 请求配置信息
         */
        post: function (config) {
            var url = config.url;
            var type = config.requestType || "POST";
            var contentType = config.contentType || "application/x-www-form-urlencoded";
            var dataType = config.dataType || "json";
            var headers = config.headers || [];
            var fnSuccess = config.success;
            var fnError = config.error;

            var xmlHttp = this.createXMLHttp();
            /*监听请求状态改变*/
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    var rsp = xmlHttp.responseText || xmlHttp.responseXML;
                    if (dataType === "json") rsp = eval("(" + rsp + ")");
                    if (xmlHttp.status === 200) {
                        LMEPG.call(fnSuccess, [xmlHttp, rsp]);
                    } else {
                        LMEPG.call(fnError, [xmlHttp, rsp]);
                    }
                }
            };
            if (LMEPG.App.getCarrierId() == "520095" && url.indexOf("lmzhjkpic") == -1 && !window.local_debug) {
                url = '/lmzhjkpic/' + url;
                LMEPG.Log.info("task:url:" + url);
            }
            xmlHttp.open(type, url, true);
            this.send(xmlHttp, headers, contentType, config.data);
        },

        /**
         * 创建请求实体
         *
         * @return {XMLHttpRequest}
         */
        createXMLHttp: function () {
            var xmlHttp;
            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            return xmlHttp;
        },

        /**
         * XMLHttpRequest 执行发送数据请求
         *
         * @param xmlHttp [XMLHttpRequest] 请求实例
         * @param headers [array] 请求头
         * @param contentType [string] 请求内容类型
         * @param data [object] 请求参数信息
         */
        send: function (xmlHttp, headers, contentType, data) {
            for (var i = 0; i < headers.length; ++i) {
                xmlHttp.setRequestHeader(headers[i].name, headers[i].value);
            }
            xmlHttp.setRequestHeader("Content-Type", contentType);

            if (typeof data == "object" && contentType === "application/x-www-form-urlencoded") {
                var s = "";
                for (var attr in data) {
                    s += attr + "=" + data[attr] + "&";
                }
                if (s) {
                    s = s.substring(0, s.length - 1);
                }
                xmlHttp.send(s);
            } else {
                xmlHttp.send(data);
            }
        },

        /**
         * 获取访问页面路径
         *
         * @param pageName [string] 需要访问的页面名称
         * @param onCallback [function] 请求访问页面成功回调，附带2参数[传入的页面名，请求返回的数据(string|object|array)]
         */
        getBasePagePath: function (pageName, onCallback) {
            var config = {};
            config.url = this.getAppRootPath() + "/index.php/Home/AjaxServer/getBasePagePath";
            config.data = {
                page_name: pageName
            };
            config.dataType = "json";
            config.success = function (xmlHttp, data) {
                LMEPG.call(onCallback, [pageName, data]);
            };
            config.error = function (xmlHttp, data) {
                LMEPG.call(onCallback, [pageName, ""]);
            };
            LMEPG.ajax.post(config);
        },

        /**
         * 获取指定方法名的ajax服务地址的路径
         *
         * @param funcName [string] 请求后端的方法名
         * @return {string} 返回具体的请求路径
         */
        getAjaxServerPagePath: function (funcName) {
            return this.getAppRootPath() + "/index.php/Home/AjaxServer/" + funcName;
        },

        /**
         * 得到应用程序的根路径
         *
         * @return {*}
         */
        getAppRootPath: function () {
            var appRootPath = this.getCookie("c_app_root_path");
            if (appRootPath === undefined || appRootPath === null || appRootPath.indexOf("http") < 0) {
                appRootPath = "";
            }
            if (LMEPG.App.getCarrierId() == "520095" && appRootPath.indexOf("lmzhjkpic") == -1 && !window.local_debug) {
                appRootPath = appRootPath + '/lmzhjkpic';
            }
            return appRootPath;
        },

        /**
         * 得到cookie缓存
         *
         * @param c_name [string] cookie名字
         * @returns {*} 存储cookie值value。 注：返回一定不会为undefined或null，最少返回空字符串""！
         */
        getCookie: function (c_name) {
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
    };
})();

/*****************************************************************
 * 页面跳转控制器
 *****************************************************************/
LMEPG.Intent = (function () {
    return {
        // 入栈参数
        INTENT_FLAG_DEFAULT: 0,     // 正常入栈
        INTENT_FLAG_CLEAR_TOP: 1,   // 清空栈，入栈元素为栈顶
        INTENT_FLAG_NOT_STACK: 2,   // 元素不入栈

        INTENT_JUMP_URL: "/index.php/Home/Intent/index",
        INTENT_BACK_URL: "/index.php/Home/Intent/back",
        INTENT_GET_BACK_URL: "/index.php/Home/Intent/getBackUrl",

        /**
         * 页面跳转：生成跳转地址URL，并执行跳转。
         *
         * 根据intentFlag判断入栈方式，intentFlag可选值：
         * <ul>
         *  <li>INTENT_FLAG_DEFAULT：如果backPage存在，backPage入栈。否则srcPage（非空时）入栈</li>
         *  <li>INTENT_FLAG_CLEAR_TOP：清空栈中元素，如果backPage存在，backPage入栈。否则srcPage（非空时）入栈</li>
         *  <li>INTENT_FLAG_NOT_STACK：不需要入栈。当前页只是作为中间页</li>
         * </ul>
         *
         * @param dst [object] 需要跳转的目标页面“路由名称”
         * @param src [object] 当前页面“路由名称”
         * @param intentFlag [number] 入栈标志（详见LMEPG.Intent.INTENT_FLAG_{DEFAULT|CLEAR_TOP|NOT_STACK}）
         * @param backPage [object] 入栈页面，如果为空的话，src作为入栈页面（针对的是目标页面返回跳转页面不是当前页面时使用）
         * @see {@link LMEPG.Intent.INTENT_FLAG_DEFAULT}
         * @see {@link LMEPG.Intent.INTENT_FLAG_CLEAR_TOP}
         * @see {@link LMEPG.Intent.INTENT_FLAG_NOT_STACK}
         */
        jump: function (dst, src, intentFlag, backPage) {
            if (typeof intentFlag === "undefined" || intentFlag == null || intentFlag === "") {
                intentFlag = this.INTENT_FLAG_DEFAULT;
            }

            LMEPG.Intent.limitJump(dst, src, intentFlag, backPage, function () {
                var goUrl = LMEPG.Intent.getJumpUrl(dst, src, intentFlag, backPage);
                if (LMEPG.App.getCarrierId() == "520095" && goUrl.indexOf("lmzhjkpic") == -1 && !window.local_debug) {
                    goUrl = '/lmzhjkpic' + goUrl;
                }
                window.location.href = goUrl;
            });
        },

        /**
         * 界面进入策略限定（目前仅使用于UI专辑）
         * @param dst
         * @param src
         * @param intentFlag
         * @param backPage
         * @param callback
         */
        limitJump: function (dst, src, intentFlag, backPage, callback) {
            var carrier_id = LMEPG.Cookie.getCookie('c_carrier_id');
            var inner = LMEPG.Cookie.getCookie('c_inner_value');

            if ((inner != 1 && carrier_id != 650092 && carrier_id != 12650092) || dst.name !== 'album') {
                callback();
                return;
            }

            var userNumber = +LMEPG.Cookie.getCookie('isVip'); // type: number
            LMEPG.ajax.postAPI(
                'Album/getAlbumData',
                {albumName: dst.param.albumName},
                function (albumAccessLimitNumber) {
                    if (+albumAccessLimitNumber === 2) {
                        if (userNumber === 1) {
                            callback()
                        } else {
                            // 跳转订购
                            dst = LMEPG.Intent.createIntent('orderHome');
                            LMEPG.Intent.jump(dst, src, intentFlag, backPage)
                        }
                    } else {
                        callback()
                    }
                },
                function () {
                    LMEPG.UI.showToast('请求数据出错了！', 2);
                });
        },

        /**
         * 页面跳转：返回生成的跳转地址URL。
         *
         * 根据intentFlag判断入栈方式，intentFlag可选值：
         * <ul>
         *  <li>INTENT_FLAG_DEFAULT：如果backPage存在，backPage入栈。否则srcPage（非空时）入栈</li>
         *  <li>INTENT_FLAG_CLEAR_TOP：清空栈中元素，如果backPage存在，backPage入栈。否则srcPage（非空时）入栈</li>
         *  <li>INTENT_FLAG_NOT_STACK：不需要入栈。当前页只是作为中间页</li>
         * </ul>
         *
         * @param dst [object] 需要跳转的目标页面“路由名称”
         * @param src [object] 当前页面“路由名称”
         * @param intentFlag [number] 入栈标志（详见LMEPG.Intent.INTENT_FLAG_{DEFAULT|CLEAR_TOP|NOT_STACK}）
         * @param backPage [object] 入栈页面，如果为空的话，src作为入栈页面（针对的是目标页面返回跳转页面不是当前页面时使用）
         * @see {@link LMEPG.Intent.INTENT_FLAG_DEFAULT}
         * @see {@link LMEPG.Intent.INTENT_FLAG_CLEAR_TOP}
         * @see {@link LMEPG.Intent.INTENT_FLAG_NOT_STACK}
         */
        getJumpUrl: function (dst, src, intentFlag, backPage) {
            if (typeof intentFlag === "undefined" || intentFlag == null || intentFlag === "") {
                intentFlag = this.INTENT_FLAG_DEFAULT;
            }

            var goUrl = LMEPG.ajax.getAppRootPath() + this.INTENT_JUMP_URL
                + "?dst=" + encodeURI(JSON.stringify(dst))
                + "&src=" + encodeURI(JSON.stringify(src))
                + "&backPage=" + encodeURI(JSON.stringify(backPage))
                + "&intentFlag=" + intentFlag;

            return goUrl;
        },

        /**
         * 返回上一页
         */
        back: function (pageName) {
            if (isBackPressed()) return;
            if (LMEPG.Func.array.contains(get_carrier_id(), ["520094"])) {
                this._getBackUrlToBack();
            } else {
                window.location.href = LMEPG.ajax.getAppRootPath() + this.INTENT_BACK_URL + "?pageName=" + pageName;
            }
        },

        /**
         * 通过获取返回地址，跳转到上一级页面
         * @private
         */
        _getBackUrlToBack: function () {
            if (LMEPG.UI) LMEPG.UI.showWaitingDialog();
            var backUrl = LMEPG.ajax.getAppRootPath() + this.INTENT_GET_BACK_URL;
            LMEPG.ajax.post({
                url: backUrl,
                requestType: "POST",
                dataType: "json",
                data: {},
                success: function (xmlHttp, rsp) {
                    var retData = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if (retData.result === 0 || retData.result === "0") {
                        window.location.href = retData.url;
                    } else {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("返回异常，请联系管理员");
                    }
                },
                error: function () {
                    if (LMEPG.UI) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("返回异常，请重试");
                    }
                }
            });
        },

        /**
         * 创建意图对象
         * @param pageName [string] 自定义定义的“控制器-方法”页面路由名
         * @param pageParamKVInPairs [object] 传递参数键值对
         * @return {{param, setPageName: setPageName, name: string, setParam: setParam}}
         */
        createIntent: function (pageName, pageParamKVInPairs) {
            var name = "";
            var param = {};

            if (typeof pageName === "string" && pageName !== "") {
                name = pageName;
            }
            if (typeof pageParamKVInPairs === "object" && pageParamKVInPairs != null) {
                param = pageParamKVInPairs;
            }

            return {
                name: name,
                param: param,
                setPageName: function (name) {
                    this.name = name;
                },
                setParam: function (name, value) {
                    this.param[name] = value;
                }
            };
        }
    };
})();

/*****************************************************************
 * 页面日志上报
 *****************************************************************/
LMEPG.Log = (function () {
    var LMLogSdk = function () {
        this.debug = function (msg) {
            this.__reportLog("debug", msg);
        };

        this.warn = function (msg) {
            this.__reportLog("warn", msg);
        };

        this.info = function (msg) {
            this.__reportLog("info", msg);
        };

        this.error = function (msg) {
            this.__reportLog("error", msg);
        };

        this.fatal = function (msg) {
            this.__reportLog("fatal", msg);
        };

        this.__reportLog = function (logLevel, msg) {
            var reportLogUrl = LMEPG.ajax.getAjaxServerPagePath("log");
            //var msgWithTime = '[' + new Date().format('yyyy-MM-dd hh:mm:ss') + '] ' + msg;
            var data = {
                "logLevel": logLevel,
                "msg": encodeURIComponent(msg),
            };

            var xmlHttp;
            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    // DO NOTHING HERE...
                    // var rsp = xhr.responseText || xhr.responseXML;
                }
            };

            xmlHttp.open("POST", reportLogUrl, true);
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            if (typeof data == "object") {
                var s = "";
                for (var attr in data) {
                    s += attr + "=" + data[attr] + "&";
                }
                if (s) {
                    s = s.substring(0, s.length - 1);
                }
                xmlHttp.send(s);
            } else {
                xmlHttp.send(data);
            }
        };
    }; //#End of LMLogSdk

    return new LMLogSdk();
})();

/*****************************************************************
 * 统计管理器：LMEPG.StatManager
 *****************************************************************/
LMEPG.StatManager = (function () {
    return {
        /**
         * 异步或同步上报数据接口
         * @param url [string] 请求url
         * @param async [boolean] 是否使用异步请求。true-异步 false-同步
         */
        ajax: function (url, async) {
            var xmlHttp = null;
            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (xmlHttp) {
                xmlHttp.open("GET", url, async);
                xmlHttp.send(null);
                xmlHttp = null;
            } else {
                var img = document.createElement("img");
                img.src = url;
                img.style.visibility = "hidden";//图片必须隐藏
                document.body.appendChild(img);
            }
        },

        /**
         * 上报心包，统计用户在线情况
         */
        sendHeartbeat: function () {
            var url = LMEPG.ajax.getAjaxServerPagePath("heartbeat");
            this.ajax(url, true); //异步上传
        },

        /**
         * 统计上报，页面推荐位点击事件
         * @param recommendId 推荐位的位置编号id
         * @param recommendOrder 推荐位的顺序编号（80002中返回的order）
         */
        statRecommendEvent: function (recommendId, recommendOrder) {
            var postData = {
                "recommendId": recommendId,
                "recommendOrder": recommendOrder
            };
            LMEPG.ajax.postAPI("Common/statRecommend", postData);
        }
    };
})();

/*****************************************************************
 * 通用函数库：LMEPG.Func。
 * 注意：若有内部类，请统一放置末尾定义(按类型区域声明)，且以小写命名。例如，string/array/codec
 *****************************************************************/
LMEPG.Func = (function () {
    return {
        /**
         * 定义常见用于判断js的数据类型。（请勿更改！！！）
         */
        jsType: {
            t_string: "string",
            t_number: "number",
            t_boolean: "boolean",
            t_function: "function",
            t_object: "object",
            t_array: "array",
            t_date: "date",
            t_regExp: "RegExp",
            t_htmlElement: "HTMLElement",//通常只判断html dom元素即可，暂不细分诸如：HTMLDivElement、HTMLImageElement等
            t_null: "null",
            t_undefined: "undefined"
        },

        /**
         * 标准地判断变量是否匹配 “指定的数据类型”！
         * <pre>
         *     调用示例：LMEPG.Func.isTypeOf(yourVar, LMEPG.Func.jsType.t_object);
         * </pre>
         *
         * @param variable [any] 变量
         * @param comparedType [string]：期望比较的JS数据类型。详见 {@link LMEPG.Func.jsType}
         * @returns {boolean} true-匹配 false-不匹配
         * @see {@link LMEPG.Func.jsType}
         * @author Songhui 2019-10-17
         */
        isTypeOf: function (variable, comparedType) {
            switch (comparedType) {
                case LMEPG.Func.jsType.t_string:
                    return Object.prototype.toString.call(variable) === "[object String]";
                case LMEPG.Func.jsType.t_number:
                    return Object.prototype.toString.call(variable) === "[object Number]";
                case LMEPG.Func.jsType.t_boolean:
                    return Object.prototype.toString.call(variable) === "[object Boolean]";
                case LMEPG.Func.jsType.t_function:
                    return Object.prototype.toString.call(variable) === "[object Function]";
                case LMEPG.Func.jsType.t_object:
                    return Object.prototype.toString.call(variable) === "[object Object]";
                case LMEPG.Func.jsType.t_array:
                    return Object.prototype.toString.call(variable) === "[object Array]";
                case LMEPG.Func.jsType.t_date:
                    return Object.prototype.toString.call(variable) === "[object Date]";
                case LMEPG.Func.jsType.t_regExp:
                    return Object.prototype.toString.call(variable) === "[object RegExp]";
                case LMEPG.Func.jsType.t_htmlElement: //通常只判断html dom元素即可，暂不细分诸如：HTMLDivElement、HTMLImageElement等
                    return (variable instanceof HTMLElement);
                case LMEPG.Func.jsType.t_null:
                    return Object.prototype.toString.call(variable) === "[object Null]";
                case LMEPG.Func.jsType.t_undefined:
                    return Object.prototype.toString.call(variable) === "[object Undefined]";
                default:
                    LMEPG.Log.error("暂不支持的未知判断类型！comparedType: " + comparedType);
                    return false;
            }
        },

        /**
         * 判断元素是否定义
         *
         * @param variable [any] 变量
         * @returns {boolean} true-存在 false-不存在
         */
        isExist: function (variable) {
            return !(typeof variable === "undefined" || variable === null || variable === "");
        },

        /**
         * 判断指定变量是否为空（undefined | null | ""）
         *
         * @param variable [any]
         * @returns {boolean} true-空（undefined | null | ""） false-不为空
         */
        isEmpty: function (variable) {
            return typeof variable === "undefined" || variable === null || variable === "";
        },

        /**
         * 判断变量是否是 “undefined”且“非null”的有效 [数组]
         *
         * @param variable [any] 变量
         * @returns {boolean} true：数组 false：非数组
         */
        isArray: function (variable) {
            return LMEPG.Func.isTypeOf(variable, LMEPG.Func.jsType.t_array);
        },

        /**
         * 判断变量是否是一个 “非undefined”且“非null”且“非Array”的有效 {对象}
         *
         * @param variable [any] 变量
         * @returns {boolean} true：对象 false：非对象
         */
        isObject: function (variable) {
            return LMEPG.Func.isTypeOf(variable, LMEPG.Func.jsType.t_object);
        },

        /**
         * 比较两个“基本数据类型”变量是否相等。非基本数据类型不准确，请单独处理。
         * <pre style='color:red;font-weight:bold;'>
         *     特别注意：被比较的2个参数若都为无效的值（null/undefined/""），则亦会认为该2变量值一样！
         *     故，调用前请视具体场景，以决定是否需要先考虑些种情况！
         * </pre>
         * @param var1 [any] 参数1
         * @param var2 [any] 参数2
         * @param isTypeSensitive [boolean] 是否类型敏感：true-考虑类型 false-不考虑类型
         */
        equals: function (var1, var2, isTypeSensitive) {
            if (typeof isTypeSensitive !== "boolean") isTypeSensitive = false; //校验：强制按定义类型传参！
            return isTypeSensitive ? var1 === var2 : var1 == var2;
        },

        /**
         * 根据控件元素id判断该元素在dom中是否存在且有效
         *
         * @param elementId [string] 元素id
         * @return {boolean} true-有效存在 false-不存在
         */
        isElementExist: function (elementId) {
            var element = G(elementId);
            return (typeof element !== "undefined" && element !== null);
        },

        /**
         * 将时间进行格式化返回
         *
         * @param type 1-总秒数格式化为 MM:SS，2-将 hh:mm:ss 转为总秒数
         * @param data
         * @return {*}
         */
        formatTimeInfo: function (type, data) {
            try {
                if (type == 1) {
                    // 格式化为MM:SS
                    var m = Math.floor(data / 60);
                    m = m < 10 ? ("0" + m) : m;
                    var s = data % 60;
                    s = s < 10 ? ("0" + s) : s;
                    return m + ":" + s;
                } else if (type == 2) {
                    var dateArr = data.split(":"); // "00:07:21" ---> [00,07,21]
                    // 处理小时转成多少秒
                    var htos = parseInt(dateArr[0]) * 60 * 60;
                    // 处理分转成多少秒
                    var mtos = parseInt(dateArr[1]) * 60;
                    // 计算总秒时间
                    return parseInt(htos) + parseInt(mtos) + parseInt(dateArr[2]);
                }
            } catch (e) {
                // 兼容保护，避免外部传递参数不可转换为number类型导致parseInt错误
                LMEPG.Log.error("LMEPG.Func.formatTimeInfo--->error: " + e.toString());
            }
            return data; //不支持的类型原样输出
        },

        /**
         * 判断用户是否有权限进入
         *
         * @param isVip [string|number] 表示用户当前是否为vip 1--是vip，0--不是vip
         * @param accessType number 进入类型（0--不区分类型，只要是VIP就可以、1--观看视频、2--视频问诊、3--电话问诊、4--健康检测）
         * @param param [object] 对应accessType,传递相应的参数
         * @returns {boolean} true--能进入，false--不能进入
         */
        isAllowAccess: function (isVip, accessType, param) {
            try {
                var carrierId = get_carrier_id();
                var isAuth = carrierId == CARRIER_ID_SHANDONG_HICON && typeof hkAuth != 'undefined';
                // LMEPG.Log.info("isAllowAccess isAuth: " + isAuth);
                if(isAuth) {
                    // 山东电信海看需要进行鉴权
                    var authCode = "2110MAMS000000011612857872982000";
                    hkAuth({code: authCode},
                        function (resp) {
                            LMEPG.Log.info("hai_kan authResp:" + resp);
                        },
                        function (err) {
                            LMEPG.Log.info("hai_kan authErr:" + err);
                        });
                }
                if (accessType == 0 && parseInt(isVip) === 1) {
                    return true;
                } else if (accessType == 1) {
                    // 允许“VIP用户”访问（观看视频）
                    if (parseInt(isVip) === 1) return true;

                    // 允许“免费用户”访问（观看视频）
                    if (parseInt(param.userType) === 0) return true;

                    // 视频有免费观看时长，允许访问
                    if (parseInt(param.freeSeconds) > 0) return true;
                } else {
                    LMEPG.Log.error("此类型暂时不支持");
                }
            } catch (e) {
                // 兼容保护，避免外部传递参数不可转换为number类型导致parseInt错误
                LMEPG.Log.error("LMEPG.Func.isAllowAccess--->error: " + e.toString());
            }
            return false;
        },

        /**
         * 将 http 协议头转化为 rtsp。
         * <pre>例如：
         *   videoUrlSrc: "http://202.99.114.93/88888891/16/20171215/269767418/269767418.mp4";
         *   videoUrlDst: "rtsp://202.99.114.93/88888891/16/20171215/269767418/269767418.mp4";
         *  </pre>
         * @param videoUrlSrc [string] 未转换过协议头的原始视频地址
         * @returns {*}
         */
        http2rtsp: function (videoUrlSrc) {
            var rtspUrl = videoUrlSrc;
            var protocol = videoUrlSrc.substring(0, 4);
            if (protocol === "http") {
                rtspUrl = videoUrlSrc.replace(/http/, "rtsp");
            }
            return rtspUrl;
        },

        /**
         * 将 rtsp 协议头转化为 http。
         * <pre>例如：
         *   videoUrlSrc: "rtsp://202.99.114.93/88888891/16/20171215/269767418/269767418.mp4";
         *   videoUrlDst: "http://202.99.114.93/88888891/16/20171215/269767418/269767418.mp4";
         *  </pre>
         * @param videoUrlSrc [string] 未转换过协议头的原始视频地址
         * @returns {*}
         */
        rtsp2http: function (videoUrlSrc) {
            var rtspUrl = videoUrlSrc;
            var protocol = videoUrlSrc.substring(0, 4);
            if (protocol === "rtsp") {
                rtspUrl = videoUrlSrc.replace(/rtsp/, "http");
            }
            return rtspUrl;
        },

        /**
         * 判断是否为有效手机号格式
         * <pre>
         * -------------------------------------------------------------------------------------------
         *       国内运营商         |            已有号段            |    新增号段（2017-08-08 工信部）
         * -------------------------+--------------------------------+--------------------------------
         *       中国移动：         |    134/135/136/137/138/139/    |    1440(物联网)/148(物联网)/198
         *                          |    147(上网卡)/                |
         *                          |    150/151/152/157/158/159     |
         *                          |    165/                        |
         *                          |    172/178(4G)/                |
         *                          |    182/183/184/187/188         |
         * -------------------------+--------------------------------+--------------------------------
         *      中国联通：          |    130/131/132/                |    146(物联网)/166
         *                          |    145(上网卡)/                |
         *                          |    155/156/                    |
         *                          |    171/175/176(4G)/            |
         *                          |    185/186/                    |
         * -------------------------+--------------------------------+--------------------------------
         *      中国电信：          |    133/                        |    1410(物联网)/199
         *                          |    149/                        |
         *                          |    153/                        |
         *                          |    173/174/177(4G)/            |
         *                          |    180/181/189/                |
         *                          |    191/                        |
         * -------------------------+--------------------------------+--------------------------------
         *      虚拟运营商：        |    170/171                     |
         * -------------------------------------------------------------------------------------------
         *  记~ 最新收录 by Songhui on 2019-10-12
         * -------------------------------------------------------------------------------------------
         *</pre>
         * @param number [string|number] 手机号码
         * @returns {boolean} true--有效, false--无效
         */
        isTelPhoneMatched: function (number) {
            if (typeof number === "undefined" || number == null || number === "") {
                return false;
            }
            var TEL_REG = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
            return TEL_REG.test(number);
        },

        /**
         * 通用正则判断（使用RegExp而非字面量，为兼容某些标清盒子不支持字面量）。
         * @param pattern [string] 正则表达式串（必选）
         * @param input [string] 待判断内容（必选）
         * @return {boolean} true-匹配 false-不匹配
         */
        isRegxMatch: function (pattern, input) {
            return new RegExp(pattern).test(input);
        },

        /**
         * 检测 ，如果为Null，返回空字符串
         * @param param PHP渲染参数
         * @returns {string}
         */
        checkParamsNull: function (param) {
            return param ? param : "";
        },

        /**
         * 当时间间隔小于100毫秒时，就认为是操作有效
         * @returns {boolean}
         */
        checkClickValid: function () {
            // var stbModel = LMEPG.Cookie.getCookie("stbModel");
            try {
                var stbModel = LMEPG.STBUtil.getSTBModel();
                stbModel = stbModel ? stbModel : '';
            } catch (e) {
                LMEPG.Log.error("checkClickValid >>> getSTBModel fail");
            }


            var lastTime = LMEPG.Cookie.getCookie("lastTime");

            //  LMEPG.Log.info("checkClickValid >>> stbModel: " + stbModel + ", lastTime = " + lastTime);

            if (stbModel === "" || lastTime === "") {
                return true;
            }

            // 中国联通基地--展厅的盒子，按键一次会响应两次
            var checkDeltaModels = ["EC6108V9U_pub_tjjlt","EC6108V9A_pub_tjjlt"];
            if (checkDeltaModels.indexOf(stbModel) < 0) {
                return true;
            }

            var currentTime = new Date(); //当前时间
            var dt = currentTime.getTime();
            var diffTime = dt - lastTime; //时间差的毫秒数

            // LMEPG.Log.info("checkClickValid >>> diffTime: " + diffTime);
            if (diffTime > 100) {
                LMEPG.Cookie.setCookie("lastTime", dt);
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
         * 随机打乱数组顺序并返回
         *
         * @param array [array] 输入数组
         * @returns {Array} 返回乱序数组
         */
        shuffle: function (array) {
            if (!this.isArray(array)) {
                return [];
            }

            var currentIndex = array.length, temporaryValue, randomIndex;
            while (currentIndex--) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        },
        /**
         * 跑马灯函数工具
         * @param el 容器DOM
         * @param txt 文本
         * @param len 限定长度
         * @param vel 速度
         * @param dir 方向
         */
        marquee: function (el, txt, len, vel, dir) {
            var param = arguments;
            var element = el; // 滚动容器
            var text = txt || ''; // 滚动文本
            var velocity = vel; // 滚动速度
            var direction = dir; // 滚动方向
            var htm = '<marquee ' +
                'style="float:left;width:100%;height:100%" ' +
                // 滚动速度
                'scrollamount="' + velocity + '" ' +
                // 滚动方向
                'direction="' + direction + '">' +
                text +
                '</marquee>';

            var isStopMarquee = function () {
                // 如果传入的参数个数为1，且焦点DOM存在，且未丢失保存的文本
                if (param.length === 1 && element && element.marqueeText) {
                    element.innerHTML = element.marqueeText;
                }
            };

            return function () {
                isStopMarquee();
                if (text && text.length >= len && element instanceof HTMLElement) {
                    element.marqueeText = text;
                    element.innerHTML = htm;
                } else {
                    return htm;
                }
            }();
        },

        /**
         * //TODO 属于UI层，需要放到lmui.js里去，后期再看看是否丢弃还是折衷整合！
         * @param obj：滚动参数
         * a.得失焦点文字滚动切换:
         * @param bol：得/失焦点->滚动/停止 true/false,
         * 调用示例->得到焦点：LMEPG.Func.marquee({el: btnElement, len: nameLen, txt: txt}, true);
         * 调用示例->失去焦点：LMEPG.Func.marquee();
         *
         * b.没有事件驱动文本滚动:
         * @param innerBol：传入标记(不涉及焦点得失),
         * 调用示例->LMEPG.Func.marquee({txt:txt,len:200,dir:"up",vel:3},true,true )
         */
        marquee2: function (obj, bol, innerBol) {
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
         * 跑马灯函数工具
         * @param el 容器DOM
         * @param txt 文本
         * @param len 限定长度
         * @param vel 速度
         * @param dir 方向
         */
        marquee3: function (el, txt, len, vel, dir) {
            var param = arguments;
            var element = el; // 滚动容器
            var text = txt || ''; // 滚动文本
            var velocity = vel; // 滚动速度
            // 滚动方向
            var htm = '<marquee ' +
                'style="width:100%;height:100%" ' +
                // 滚动速度
                'scrollamount="' + velocity + '" ' +
                // 滚动方向
                'direction="' + dir + '">' +
                text +
                '</marquee>';

            var isStopMarquee = function () {
                // 如果传入的参数个数为1，且焦点DOM存在，且未丢失保存的文本
                if (param.length === 1 && element && element.marqueeText) {
                    element.innerHTML = element.marqueeText;
                }
            };

            return function () {
                isStopMarquee();
                if (text && text.length > len && element instanceof HTMLElement) {
                    element.marqueeText = text;
                    element.innerHTML = htm;
                } else {
                    return htm;
                }
            }();
        },

        /**
         * 特殊符号结尾工具函数
         * //TODO 需要再整合调整，决定是否使用
         * @param str: 字符串
         * @param len: 截取长度
         * @param suf: 结尾后缀
         * @returns {string|*}
         */
        substrByOmit: function (str, len, suf) {
            if (str.length <= len) return str;
            var suffix = suf ? suf : "...";
            var subStr = str.slice(0, len);
            return subStr + suffix;
        },

        /**
         * 元素淡入淡出效果
         * @param e: 元素
         * @param n：起始透明度0或1
         * @param c：定时器间隔
         * @param fn：回调
         */
        fade: function (e, n, c, fn) {
            var oS = n;
            var oC = c ? c : 50;
            var oE = Math.abs(n - 1);
            if (!e) return;
            (function op() {
                n ? oS -= 0.1 : oS += 0.1;
                oS = +(oS.toFixed(1));
                e.style.opacity = oS;
                var opTimer = setTimeout(op, oC);
                if (oS === oE) {
                    clearTimeout(opTimer);
                    fn && fn();
                }
            }());
        },

        /**
         * 获取样式值
         * @param el
         * @param attr
         * @returns {number}
         */
        getStyle: function (el, attr) {
            if (el.currentStyle) {
                return parseInt(el.currentStyle[attr]);
            } else {
                return parseInt(getComputedStyle(el, null)[attr]);
            }
        },

        /**
         * 强制返回如果支持监听
         * 避免焦点方案不生效从而使应用宕机
         */
        isErrorForceEventBack: function () {
            window.onerror = function (message, filename, lineno) {
                var errorLog = "payInfo.html error>>> " +
                    "\nmessage:" + message +
                    "\nfile_name:" + filename +
                    "\nline_NO:" + lineno;
                // 提示错误信息
                // LMEPG.UI.showToast(errorLog);
                // 上报错误信息
                LMEPG.Log.error(errorLog);
                // 监听返回生效
                document.addEventListener('keydown', function (e) {
                    if (e.which === KEY_BACK) history.go(-1);
                });
            };
        },

        /*函数执行一次*/
        onceFn: function (fn) {
            if (!onceFnCalledSign) {
                onceFnCalledSign = true;
                fn.apply(this, arguments);
            }
        },

        /*单例继承*/
        o_extend: function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        },

        /*对象浅复制*/
        o_mix: function (to, _from) {
            for (var key in _from) {
                if (_from.hasOwnProperty(key)) {
                    to[key] = _from[key];
                }
            }
            return to;
        },

        /**
         * 监听特殊数字键值执行功能
         * 注意：起始位置键要相同
         * 调用示例：LMEPG.Func.listenKey(7,[KEY_7, KEY_7, KEY_9, KEY_7], callback);
         */
        listenKey: function (start, keyArray, fn) {
            var startKey = 'KEY_' + start;
            var useKey = keyArray.join('');
            var listenToDo = function () {
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                // 获取键值起始索引
                keys = keys.slice(keys.length - keyArray.length).join('');
                if (keys == useKey) {
                    fn.call(null, arguments);
                }
            };

            LMEPG.KEM.addKeyEvent(startKey, listenToDo);
        },

        /**
         * 移除iPanel自带的焦点框
         */
        removeIPanelDefaultFocusBorder: function () {
            try {
                if (typeof (iPanel) !== "undefined") {
                    iPanel.focusWidth = "0";
                }
            } catch (e) {
            }
        },

        /**
         * 定义应用内业务取参。
         * <pre style='font-weight:bold;color:yellow;'>
         *  一、注意：常用于从前端 RenderParam(必须是该值名称！) 对象中定义的字段获取。
         *      若取不到，再尝试从cookie中获取或其它方式返回，通过第二个参数回调返回。
         *
         *  二、调用示例：
         *      // 第一参数说明："carrierId"：约定每个HTML开头定义！"lmcid"：某些专辑里的定义！
         *      var lmCarrierId = LMEPG.Func.getAppBusinessValue(["carrierId", "lmcid"], function () {
         *           return LMEPG.App.getCarrierId(); //若前面两种页面都未定义，则尝试用应用首次进入缓存的值
         *      });
         * </pre>
         * @param renderParamPropName [string|array(string)] 获取的名字（可能为数组，例如：定义lmcid和carrierId均表示同一业务值，则均以array传入，找到其一即可）。
         * @param compatHandlerFun [function] 兼容处理函数。若未获取到，由上层处理提供一个默认值。该函数返回一个有效值，否则返回为空！
         * @return {*|string} 返回目标值或者空字符串（未找到情况下为空“”）
         * @author Songhui
         */
        getAppBusinessValue: function (renderParamPropName, compatHandlerFun) {
            // 目标value
            var finalValue = "";

            if (typeof RenderParam === "object" && null != RenderParam) {
                // 依次查找，兼容多种情况：以array兼容处理可能提供的name，遍历查询到首次匹配即可！
                if (typeof renderParamPropName === "string") renderParamPropName = [renderParamPropName];  //single-string -> array
                if (!LMEPG.Func.isArray(renderParamPropName)) renderParamPropName = [renderParamPropName]; //non-array -> array

                var searchName = ""; //目标搜索key
                for (var i = 0, len = renderParamPropName.length; i < len; i++) {
                    searchName = renderParamPropName[i];
                    if (LMEPG.Func.object.contains(RenderParam, searchName)) {
                        try {
                            finalValue = eval("RenderParam." + searchName);
                            if (typeof finalValue !== "undefined" && finalValue != null && finalValue !== "") {
                                // 在对象 RenderParam 中匹配，结束查找！
                                console.debug('-->Great! Found "RenderParam.' + searchName + '"(' + finalValue + ') yet!');
                                break;
                            } else {
                                // 在对象 RenderParam 中未匹配，继续查找...
                                console.debug('-->Oh, sorry! Not found "RenderParam.' + searchName + '! And continue...');
                            }
                        } catch (e) { //兼容处理
                            LMEPG.Log.error(e);
                            finalValue = "";
                        }
                    } else {
                        // 在对象 RenderParam 中不存在该字段，继续查找...
                        console.debug('-->Oh, sorry! No such "RenderParam.' + searchName + '! And continue...');
                    }
                }
            }

            if (finalValue === "" && (typeof compatHandlerFun === "function")) {
                finalValue = LMEPG.call(compatHandlerFun);
                if (typeof finalValue === "undefined") finalValue = "";
            }
            return finalValue ? finalValue : "";
        },

        /**
         * 测试打印指定对象实例信息。
         * @param obj [object] 被打印对象
         * @param isNeedPrintBody [boolean] 布尔值。是否需要打印函数体。
         * @param isNeedPrintRecursively [boolean] 布尔值。是否需要递归遍历对象。
         * @return {string} 返回对象信息
         * @author Songhui 2019-10-17
         */
        queryObjInfo: function (obj, isNeedPrintBody, isNeedPrintRecursively) {
            if (typeof obj !== "object" || null === obj) {
                return "undefined or null";
            }

            var result = "";

            try {
                var isPrintBody = (typeof isNeedPrintBody === "boolean") && isNeedPrintBody;//是否打印方法体
                var isPrintRecursively = (typeof isNeedPrintRecursively === "boolean") && isNeedPrintRecursively;//是否递归打印每个对象属性
                for (var i in obj) {
                    var prop = obj[i];
                    result += "    ";
                    if (isPrintRecursively && (typeof prop === "object" && prop != null)) {
                        result += "\n[" + i + "::" + (typeof prop) + "] --> " + prop + "\n";
                        result += LMEPG.Func.queryObjInfo(prop);
                        result += "\n\n------------------------------------------";
                    } else {
                        result += "[" + i + "::" + (typeof prop) + "]";
                        result += isPrintBody ? ("--> " + prop) : "";
                    }
                    result += "\n";
                }
            } catch (e) {
                result += "\n\n query occurred an exception: " + e.toString();
            }

            if (result !== "") result = "{\n" + result + "\n}";
            return result;
        },

        /**
         * 执行特殊代码，code是经过eval过的base64编码的js代码串
         * @param code
         */
        execSpecialCode: function (code) {
            var codeFrag = LMEPG.Func.codec.base64_decode(code);
            try {
                eval(eval("(" + unescape(codeFrag) + ")"));
            } catch (e) {
                LMEPG.Log.error("execSpecialCode --->error: " + e.toString());
            }
        },

        /***********************************************
         * Func内部类：字符串的工具方法
         ***********************************************/
        string: {
            /**
             * 清除字符串中的空格。注：若输入无效，则返回亦无效。故，建议上层调用加强判断！
             * @param input [string] 输入字符串
             * @return {void | string | undefined}
             */
            trim: function (input) {
                if (input) {
                    return input.replace(/^\s*(.*?)\s*$/g, "$1");
                } else {
                    return input;//返回原始输入
                }
            },
            /**
             * 清除字符串中的所有的空格元素
             * @param str
             * @returns {string}
             */
            replaceAll: function (str) {
                if (str) {
                    var temp = '';
                    for (var i = str.length; i--;) {
                        temp = (str[i] === " " ? "" : str[i]) + temp;
                    }
                    return temp;
                }
            },

            /**
             * 使用占位符的方法，格式化字符串。
             * <pre>
             *     使用示例：
             *      LMEPG.Func.string.format("我叫{0}。", ["张三"]); 或  LMEPG.Func.string.format("我叫{0}。", "张三");
             *      LMEPG.Func.string.format("我叫{0}，来自{1}。", ["张三", "北京"]);
             * </pre>
             * @param str [string] 原字符串，带有{i}占位符的。
             * @param replaces [string] 替换{i}占位符的字符串，有多个必须使用数组，有1个可以只用字符串。
             * @return 被格式化替换后的字符串
             */
            format: function (str, replaces) {
                if (LMEPG.Func.isEmpty(str)) return str;
                if (!LMEPG.Func.isArray(replaces)) replaces = [replaces];
                for (var i = 0; i < replaces.length; i++) {
                    // 使用正则表达式，循环替换占位符数据
                    str = str.replace(new RegExp("\\{" + i + "\\}", "g"), replaces[i]);
                }
                return str;
            }
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
             * 将数组中无效(undefined、null、'')的项去掉,从而转成紧密数组
             * @param ary
             */
            fullAry: function (ary) {
                if (ary) {
                    for (var i = ary.length; i--;) {
                        var temp = ary[i];
                        !temp && temp !== 0 && temp !== false && ary.splice(i, 1);
                    }

                    return this;
                }
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
                    LMEPG.Log.error('array.contains(' + searchValue + ' , ' + searchArray + ')--->Exception: ' + e.toString());
                }
                return false;
            }

        },

        /***********************************************
         * Func内部类：格式化的工具方法
         ***********************************************/
        formatter: {

            /**
             * 将“string或number的数值”强转为期望的具体类型数值！若类型不可强转，则会返回该指定数据类型的默认值！
             *
             * <pre>
             *     调用示例：LMEPG.Func.formatter.getAsNumber(yourVar);
             * </pre>
             *
             * @param numberVal [string|number] 变量。一般支持为number或string类型！
             * @param isCastToFloat [boolean] 期望强转为 float 类型。若不传或false，则默认强转为int类型数值！
             * @returns {number} 整型number。
             * @see {@link LMEPG.Func.jsType}
             * @author Songhui 2019-11-11
             */
            getAsNumber: function (numberVal, isCastToFloat) {
                var retValue = 0;

                if (typeof numberVal === "number") {
                    // 若已经是number类型，则直接返回！
                    // 注：此处暂不对具体类型再强转（例如：期望为int，但传入值却为float类型），交给上层单独处理。因为我们应用层
                    // 业务逻辑，很少有对具体的float和int区分（基本靠number判断），除非特殊情况。若必需要，待定评估是否加上强转!
                    retValue = numberVal;
                } else if (typeof numberVal === "string") {
                    // 校验是否为 int 或 float，否则将string强转
                    if (typeof isCastToFloat !== "boolean") isCastToFloat = false;
                    try {
                        // var temp = eval("parse" + (isCastToFloat ? "Float" : "Int") + "(numberVal)");
                        // var temp = eval("parse" + (isCastToFloat ? "Float" : "Int") + "(" + numberVal + ")");
                        var temp = eval("parse" + (isCastToFloat ? "Float" : "Int") + "('" + numberVal + "')");
                        if (!isNaN(temp)) retValue = temp;
                    } catch (e) {
                        LMEPG.Log.error('formatter.getAsNumber(' + numberVal + ' , ' + isCastToFloat + ')--->Exception: ' + e.toString());
                    }
                }

                return retValue;
            }
        },

        /***********************************************
         * Func内部类：对象的工具方法
         ***********************************************/
        object: {
            /**
             * 判断某个对象是否存在指定属性。
             * @param object [object] 对象实例。建议为对象！若为关联数组，也是可以支持的，但不建议用于判断数组！
             * @param propertyName [string] 需要判断的对象名称
             * @param isProtoPropSensitive [boolean] 是否原型属性敏感。默认为false，即不判断原型的属性，仅当前自身属性！！！
             * @return {boolean} true-存在 false-不存在
             */
            contains: function (object, propertyName, isProtoPropSensitive) {
                if (typeof object !== "object" || null === object) {
                    LMEPG.Log.error('无效参数"object"！');
                    return false;
                }
                if (typeof propertyName !== "string" || "" === propertyName) {
                    LMEPG.Log.error('无效参数"propertyName"！');
                    return false;
                }

                if (typeof isProtoPropSensitive !== "boolean") isProtoPropSensitive = false;//默认仅判断自身属性！
                if (isProtoPropSensitive) {
                    return propertyName in object;
                } else {
                    return Object.prototype.hasOwnProperty.call(object, propertyName);
                }
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

        /***********************************************
         * Func内部类：常规网格列表的按钮焦点移动工具方法
         ***********************************************/
        gridBtnUtil: {

            /**
             * 网格列表按钮焦点走向，通过id的 Row-Col 进行计算。
             * <ul style="color:yellow;font-weight:bold;">
             * 注意：BtnId定义必须规范为：{prefixName-RowNO-ColNO}，例如"focus-2-3"、"title-11-2"
             *          <li>PrefixName：前缀名称string</li>
             *          <li>RowNO：行号number</li>
             *          <li>ColNO：列号number</li>
             * </ul>
             *
             * @param currentBtnObj [object] 当前按钮元素对象，即按钮框架LMEPG.BM定义的一个Button对象！（必传）
             * @param direction [string] 方向(left/right/up/down)（必传）
             * @param btnIdPrefixName [string] 当前按钮元素id名的前缀名，即“prefixName-X-Y”中的“prefixName”，用于不同的定义，不做强制限制（必传）
             * @param btnIdSeparatedSymbol [string] 当前按钮元素id名“prefixName-RowNO-ColNO”之前的分隔符号，例如“-”
             * @returns {boolean} true-不拦截焦点移动，继续传递。false-拦截焦点移动事件，即消费此事件。
             */
            onCommonMoveChange: function (direction, currentBtnObj, btnIdPrefixName, btnIdSeparatedSymbol) {
                try {
                    if (typeof btnIdPrefixName !== "string" || btnIdPrefixName === "") {
                        btnIdPrefixName = "focus"; //默认以“focus”为按钮id名前缀
                    }
                    if (typeof btnIdSeparatedSymbol !== "string" || btnIdSeparatedSymbol === "") {
                        btnIdSeparatedSymbol = "-"; //默认以“-”分隔
                    }

                    var btnIdPattern = "^" + btnIdPrefixName + btnIdSeparatedSymbol + "(\\d)+" + btnIdSeparatedSymbol + "(\\d)+$";//e.g. "focus-1-2"
                    var isRegxBtnId = new RegExp(btnIdPattern).test(currentBtnObj.id);

                    if (isRegxBtnId) {
                        var idSplitStrs = currentBtnObj.id.split("-"); //具有一定规则的网格列表按钮id分隔
                        if (idSplitStrs != null && idSplitStrs.length > 2) {
                            var y = parseInt(idSplitStrs[1]); //RowNO-对应y
                            var x = parseInt(idSplitStrs[2]); //ColNO-对应x
                            var nextFocusId = "";

                            if (direction === "up") {
                                // 上移，RowNO-1，ColNO不变
                                for (; x > 0; x--) {
                                    nextFocusId = "focus-" + (y - 1) + "-" + x;
                                    if (LMEPG.Func.isElementExist(nextFocusId)) { // 找到目标元素，结束查找
                                        break;
                                    }
                                }
                            } else if (direction === "down") {
                                // 下移，RowNO+1，ColNO不变
                                for (; x > 0; x--) {
                                    nextFocusId = "focus-" + (y + 1) + "-" + x;
                                    if (LMEPG.Func.isElementExist(nextFocusId)) { // 找到目标元素，结束查找
                                        break;
                                    }
                                }
                            } else if (direction === "left") {
                                // 左移，RowNO不变，ColNO-1
                                nextFocusId = "focus-" + y + "-" + (x - 1);
                            } else if (direction === "right") {
                                // 右移，RowNO不变，ColNO+1
                                nextFocusId = "focus-" + y + "-" + (x + 1);
                            }

                            // 最后，找到目标元素且存在，则焦点移动到该元素并结束事件！！！
                            if (is_element_exist(nextFocusId)) {
                                LMEPG.ButtonManager.requestFocus(nextFocusId);
                                return false;
                            }
                        }
                    } else {
                        LMEPG.Log.error('网格按钮id名非规范结构："prefixName-RowNO-ColNO"');
                    }
                } catch (e) {
                    LMEPG.Log.error('gridBtnUtil.onCommonMoveChange(' + direction + ' , ' + currentBtnObj + ')--->Exception: ' + e.toString());
                }

                // 外部通用处理！！！
                if (typeof onCommonMoveChangeCallback === "function") {
                    LMEPG.call(onCommonMoveChangeCallback, [direction, currentBtnObj]);
                }
                return true;
            },

            /**
             * 网格列表按钮，获取向下的焦点元素id。如果正下方没有，就再往右边查找。
             * @param currentBtnObj [object] 当前按钮元素对象，即按钮框架LMEPG.BM定义的一个Button对象！（必传，不许为null）
             * @return {string} 返回元素查找id，为string或者undefined！
             */
            getNextFocusDownId: function (currentBtnObj) {
                if (LMEPG.Func.isElementExist(currentBtnObj.nextFocusDown)) {
                    // 向下dom存在，直接返回
                    return currentBtnObj.nextFocusDown;
                } else {
                    // 向下dom不存在，继续左下查找
                    var nextLeftBtnObj = LMEPG.ButtonManager.getNearbyFocusButton("left", currentBtnObj.id);
                    while (nextLeftBtnObj && LMEPG.Func.isElementExist(nextLeftBtnObj.id)) {
                        // 左边dom元素存在，找其下方元素
                        var nextDownBtnId = LMEPG.Func.isElementExist(nextLeftBtnObj.nextFocusDown) && nextLeftBtnObj.nextFocusDown;
                        if (nextDownBtnId) {
                            // 找到目标元素id
                            return nextDownBtnId;
                        } else {
                            // 继续向左查找
                            nextLeftBtnObj = LMEPG.ButtonManager.getNearbyFocusButton("left", nextLeftBtnObj.id);
                        }
                    }
                    console.warn("没有下一行了");
                }
                // 最终都未找到，返回空。结束！
                return "";
            }
        },

        /***********************************************
         * Func内部类：其它第三扩展（慎用！）
         ***********************************************/
        thirdEx: {
            /**
             * 用户兼容事件相关（目前主要为：播放器应用）：
             *      1、由于某些播控平台（如，中国联通-湖南省）不会触发相关的事件KEY_VIRTUAL_EVENT/EVENT_MEDIA_BEGINING/EVENT_MEDIA_END/EVENT_MEDIA_ERROR）,且无Utility对象及其相关方法。
             *      2、为了全局兼容现有业务逻辑，临时对其手动定义，即可不对业务层做任务改动！
             *      3、目前Utility在播控地方运用到的相关方法有：Utility.getEvent()
             * 注意：如此使用，仅仅对未定义Utility对象及其内部所有方法的平台而已，请明确根据所属地区慎用！（Added by Songhui on 2019-11-25）
             */
            iUtility: {
                /**
                 * 外部设置Event对象
                 * @param eventObj [object] 替换的Event对象
                 * @param isRewrittenGetEventFunc [boolean] 是否重写Event.getEvent方法（false-不重写，即沿用上一次定义。true/其它-重写）
                 */
                setEvent: function (eventObj, isRewrittenGetEventFunc) {
                    if (!LMEPG.Func.isObject(eventObj)) {
                        return;
                    }

                    // 若系统 Utility 不存在，则手动定义该对象！
                    if (typeof window.Utility === "undefined" || window.Utility == null) {
                        console.debug("no window.Utility");
                        window.Utility = {};
                    }

                    // 若系统 Utility.getEvent 不存在，则手动定义！
                    if (typeof isRewrittenGetEventFunc !== "boolean") isRewrittenGetEventFunc = true;
                    if (typeof window.Utility.getEvent !== "function" || isRewrittenGetEventFunc) {
                        console.debug("no window.Utility.getEvent");
                        window.Utility.getEvent = function () {
                            console.debug("调用：Utility.getEvent--" + eventObj.type);
                            return {
                                type: eventObj.type //当前 Event 对象表示的事件的名称。
                            };
                        };
                    }
                } // #End of setEvent
            } // #End of Func$iUtility
        }
    };
})();

/*****************************************************************
 * 通过该类，注册事件监听器
 *****************************************************************/
LMEPG.Framework = (function () {
    return {
        /**
         * 启动事件任务循环
         */
        looper: function () {
            LMEPG.Framework.eventLooper();   // 启动事件监听
            LMEPG.Framework.statLooper();    // 启动统计
        },

        /**
         * 事件处理器接收入口
         *
         * @param event [KeyboardEvent] 按键事件
         */
        eventHandler: function (event) {
            event = event || window.event;
            var keyCode = event.which || event.keyCode;
            if (keyCode === KEY_VIRTUAL_EVENT) {
                LMEPG.call(LMEPG.Framework.onVirtualEvent, [keyCode]);
            } else {

                LMEPG.call(LMEPG.Framework.onEvent, [keyCode, event]);
            }
            if (!LMEPG.Framework.checkBackPreventDefault(keyCode)) {
                LMEPG.Framework.preventDefault(event);
            }
        },

        /**
         * 自定义处理事件回调
         *
         * @param keyCode [string|number] 键值
         * @param event [KeyboardEvent] 按键事件
         */
        onEvent: function (keyCode, event) {

            // 处理特殊按键
            keyCode = LMEPG.Framework.convertSpecialKeyCode(keyCode);

            // 判断是否设置按键监听拦截
            if (LMEPG.BM && (typeof LMEPG.BM.getKeyEventInterceptCallback() === "function")) {
                var isIntercept = LMEPG.call(LMEPG.BM.getKeyEventInterceptCallback(), keyCode);
                if (isIntercept) {
                    return;
                }
            }

            // 两次响应的间隔，不能小于100毫秒，排除掉虚拟按键
            if (!LMEPG.Func.checkClickValid()) {
                return;
            }

            // 阻止浏览器的默认按键功能(调试除外)
            if (event) {
                if (window.unPreventDefault && typeof window.unPreventDefault === "boolean") {
                    // 空处理，强制启用按键响应
                } else {
                    LMEPG.Framework.preventDefault(event);
                }
            }

            if (typeof LMEPG.onEvent !== "undefined" && LMEPG.onEvent != null) {
                LMEPG.onEvent(keyCode);
            }
        },
        /**
         * 加强判断，以兼容！
         * @param event
         */
        preventDefault: function (event) {
            if (!window.hasOwnProperty("debug")) {
                if (typeof event.preventDefault === "function") event.preventDefault(); //加强判断，以兼容！
            }

            // 禁用浏览器backspace默认事件，有的低版本浏览器会执行回退操作
            if (event.returnValue) {
                event.returnValue = false;
            }

            if (window.isPreventDefault) {
                if (typeof event.preventDefault === "function") event.preventDefault(); //加强判断，以兼容！
                event.returnVal = false;
            }
        },

        /**
         * 检查返回按键是否可执行系统默认行为
         */
        checkBackPreventDefault: function (keyCode) {
            if (keyCode !== KEY_BACK) {
                return true;
            }

            var carriers = ["10220095", '220095'];
            // 判断地区
            if (typeof RenderParam != "undefined" && carriers.indexOf(RenderParam.carrierId) !== -1) {
                var stbModel = LMEPG.STBUtil.getSTBModel();
                var stbModels = ["EC6108V9U_pub_jljdx","HG680-R","EC6110T_jljdx"];
                //判断盒子型号
                if (stbModels.indexOf(stbModel) !== -1) {
                    return false;
                }
            }
            // 判断盒子型号
            return true;
        },

        /**
         * 兼容处理不同厂商的遥控器键值，将同一功能键但不同的keyCode转换为同一keyCode来处理
         *
         * @param keyCode 入参键值
         * @return 统一处理该功能的keyCode
         */
        convertSpecialKeyCode: function (keyCode) {
            switch (keyCode) {
                case KEY_BACK_640:
                case KEY_399://广西广电盒子返回无效统一处理
                case KEY_514:
                case KEY_BACK_24:
                case KEY_MANGGUOTV_BACK:
                case KEY_BACK_ANDROID:
                    keyCode = KEY_BACK;
                    break;
                case KEY_LEFT_65:
                case KEY_MANGGUOTV_LEFT:
                    keyCode = KEY_LEFT;
                    break;
                case KEY_MANGGUOTV_ENTER:
                case KEY_PLAY_PAUSE:
                    keyCode = KEY_ENTER;
                    break;
                case KEY_RIGHT_68:
                case KEY_MANGGUOTV_RIGHT:
                    keyCode = KEY_RIGHT;
                    break;
                case KEY_UP_87:
                case KEY_MANGGUOTV_UP:
                    keyCode = KEY_UP;
                    break;
                case KEY_DOWN_83:
                case KEY_MANGGUOTV_DOWN:
                    keyCode = KEY_DOWN;
                    break;
                case KEY_VOL_UP_61:
                case KEY_VOL_UP_447:
                case KEY_VOL_UP_1095:
                    keyCode = KEY_VOL_UP;
                    break;
                case KEY_VOL_DOWN_45:
                case KEY_VOL_DOWN_448:
                case KEY_VOL_DOWN_1096:
                    keyCode = KEY_VOL_DOWN;
                    break;
                case KEY_MUTE_67:
                case KEY_MUTE_1097:
                    keyCode = KEY_MUTE;
                    break;
                case KEY_PLAY_1045:
                    keyCode = KEY_PLAY;
                    break;
                case KEY_PLAY_PAUSE_19:
                    keyCode = KEY_PLAY_PAUSE;
                    break;
                case KEY_FAST_REWIND_412:
                    keyCode = KEY_FAST_REWIND;
                    break;
                case KEY_FAST_FORWARD_417:
                    keyCode = KEY_FAST_FORWARD;
                    break;
            }
            return keyCode;
        },

        onVirtualEvent: function () {
            //虚拟按键事件
            eval('oEvent = ' + Utility.getEvent());
            if (typeof LMEPG.onEvent !== 'undefined' && null != LMEPG.onEvent) {
                LMEPG.onEvent(oEvent.type, true);
            }
        },

        /**
         * 启动事件循环
         */
        eventLooper: function () {
            if (debug) {
                document.onkeydown = LMEPG.Framework.eventHandler;
            } else {
                document.onkeypress = LMEPG.Framework.eventHandler;
            }
        },


        /**
         * 启动统计循环
         */
        statLooper: function () {
            (function sendHeartbeat() {
                LMEPG.call("LMEPG.StatManager.sendHeartbeat()", []);
                setTimeout(sendHeartbeat, 60000);
                // setTimeout(sendHeartbeat, 3000);
            })(); //1分钟上报一次心跳。
        }
    };
})();

/*****************************************************************
 * event事件管理器
 *****************************************************************/
LMEPG.KeyEventManager = LMEPG.KEM = (function () {
    return {
        _keys: {}, // 存储注册的按键事件
        _isAllow: true, // 是否允许使用按键，默认允许。（仅某些特殊场景下，才需要外部动态的设置为禁止。例如，正在网络请求上报中）
        _keyCodes: new Array(100),

        /**
         * 初始化按键事件管理器
         */
        init: function () {
            // 判断事件处理器是否定义，避免重复定义处理
            if (!LMEPG.onEvent) {
                LMEPG.onEvent = LMEPG.KeyEventManager._defaultKeyEvent;
            }
        },

        /**
         * 增加事件处理，支持单个事件和批量添加事件
         * @param code [string|object] 事件id  可以是字符串和对象数据。但不能是number！
         * @param action 单个事件添加时的事件响应动作
         */
        addKeyEvent: function (code, action) {
            if (typeof code === "string" && action !== undefined) {
                // 单个添加事件，将单个事件转换成多个事件的对象，在统一添加处理
                var _code = code;
                code = {};
                code[_code] = action;
            }
            if (typeof code === "object") {
                // 批量添加按键事件
                var obj = code;
                for (var i in obj) {
                    if (i.indexOf("KEY_") === 0 || i.indexOf("EVENT_") === 0) {
                        // 如果是“KEY_”或者“EVENT_”开头，视作按键
                        this._keys[i] = obj[i];
                    } else {
                        alert("错误：添加按键映射时code为不支持的类型！");
                    }
                }
            } else if (typeof code === "number") {
                // 根本不允许出现这种错误！
                alert("错误：添加按键映射时code不能为number类型！");
            }
            return this;
        },

        /**
         * 删除指定按键的事件，即解注册。
         * @param code [string] 键值
         * @return {LMEPG.KeyEventManager}
         */
        delKeyEvent: function (code) {
            if (Object.prototype.toString.call(code) !== "[object Array]") {
                // 单个事件删除，转换成数组和多个事件删除统一处理
                code = [code];
            }
            for (var i = 0; i < code.length; i++) {
                if (this._keys[code[i]]) {
                    this._keys[code[i]] = "LMEPG.emptyFunc()";
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
         * @param isAllowed [boolean] 是否允许响应按键事件
         */
        setAllowFlag: function (isAllowed) {
            if (typeof isAllowed === "boolean") {
                this._isAllow = isAllowed;
            }
        },

        /**
         * 默认按键处理器，如果外部没有重新定义，采用该按键处理器
         * @param code [string] 按键值
         * @private
         */
        _defaultKeyEvent: function (code) {
            LMEPG.KeyEventManager._keyCodes.push(code);
            for (var i in LMEPG.KeyEventManager._keys) {
                if (!LMEPG.KeyEventManager._isAllow || code !== window[i]) {
                    continue;
                }

                // 注：在活动手机号 <input> 标签焦点时，按返回键不执行 back 操作！
                if (code == KEY_BACK) {
                    var currentBtn = LMEPG.ButtonManager && LMEPG.ButtonManager.getCurrentButton();
                    if ((typeof currentBtn !== "undefined" && currentBtn != null) &&
                        (typeof (currentBtn.type) !== "undefined" && currentBtn.type === BUTTON_TYPE_INPUTTEXT)
                    ) {
                        return;
                    }
                }
                LMEPG.call(LMEPG.KeyEventManager._keys[i], code);
            }
        }
    };
})();

/*****************************************************************
 * 自定义按钮控件管理器
 *****************************************************************/
LMEPG.ButtonManager = LMEPG.BM = (function () {
    return {
        _buttons: {},               // 自定义按钮数组
        _config: {},                // 初始化配置属性
        _previous: null,            // 上一个焦点按钮[object]
        _current: null,             // 当前焦点按钮[object]
        _direction: null,           // 上一次按键的方向[string]
        _isKeyEventPause: false,    // 按键事件是否暂停的标志[boolean]
        _isKeyEventInterceptCallback: null,   //按键事件拦截方法[function]

        /**
         * 初始化话按键管理器。
         *
         * 通常调用示例：
         *     LMEPG.BM.init("默认焦点元素ID", [所有的按钮数组]); //默认第3、4个参数可以省略不提供，则使用默认！！！
         *
         * @param defaultFocusId [string] 指定默认初始化获得焦点的元素id（可选，可为空“”）n
         * @param buttons [array] 按键对象数组（必须）
         * @param imagePath [string] 资源文件根路径。 如果资源文件采用相对路径时，使用该目录下面的资源路径。不需要，默认传空“”（可选）
         * @param isUseDefaultKeyEvents [boolean] 是否使用默认的按键处理器（可选）
         */
        init: function (defaultFocusId, buttons, imagePath, isUseDefaultKeyEvents) {
            this.clearFocus();
            var config = defaultFocusId;
            if (arguments.length >= 2) {
                config = {
                    defaultFocusId: defaultFocusId, //MUST:string
                    buttons: LMEPG.Func.isArray(buttons) ? buttons : [], //MUST:array
                    imagePath: typeof imagePath === "string" ? imagePath : "",//MUST:string
                    defaultKeyEvents: typeof isUseDefaultKeyEvents === "boolean" ? isUseDefaultKeyEvents : true//MUST:boolean
                };
            }
            this._config = config;          // 保存配置参数
            this._initDefaultKeyEvents();
            this._initButtons();
            this._initDefaultFocusButton();
            this._update();
        },

        /**
         * 触摸屏点击事件（内部默认调用）
         * @param tempId
         * @private
         */
        _addOnclick: function (tempId) {
            if (typeof RenderParam != "undefined" && RenderParam.carrierId === '05001110') {
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
         * 设置按键事件是否暂停（可恢复）
         * @param isPause true:暂停按键事件；false:按键事件正常使用
         */
        setKeyEventPause: function (isPause) {
            this._isKeyEventPause = isPause;
        },

        /**
         * 设置按键事件拦截方法
         * @param interceptCallback [function]拦截按键事件的方法，返回true标识拦截，返回false表示不拦截，改方法不存在表示不拦截
         */
        setKeyEventInterceptCallback: function (interceptCallback) {
            this._isKeyEventInterceptCallback = interceptCallback;
        },

        /**
         * 获取按键事件拦截方法
         */
        getKeyEventInterceptCallback: function () {
            return this._isKeyEventInterceptCallback;
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
         * @returns {{id: *, name: *,
         *      nextFocusLeft: *, nextFocusRight: *, nextFocusUp: *, nextFocusDown: *,
         *      backgroundImage: *, focusImage: *,
         *      click: *, focusChange: *, beforeMoveChange: *, moveChange: *}}
         */
        createButton: function (id, name,
                                nextFocusLeft, nextFocusRight, nextFocusUp, nextFocusDown,
                                backgroundImage, focusImage, click,
                                focusChange, beforeMoveChange, moveChange) {
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
            };
        },

        /**
         * <pre>
         * 增加 buttons 按钮：
         *      1. 若 button 为对象，则增加单个button。
         *      2. 若 button 是一个 button 的数组，则增加多个button。
         * </pre>
         * @param button [array|single_buttonObj] 按钮对象或者按钮数组
         */
        addButtons: function (button) {
            var current = this._current;
            var previous = this._previous;
            if (!LMEPG.Func.isArray(button)) {
                button = [button];
            }
            for (var i = 0; i < button.length; i++) {
                this.deleteButtons(button[i]);
                var _button = this._repairButton(button[i]);
                this._buttons[_button.id] = _button;
                this._addOnclick(_button.id);
                if (typeof current !== "undefined" && current != null && _button.id === current.id) {
                    this._current = _button;
                }
                if (typeof previous !== "undefined" && previous != null && _button.id === previous.id) {
                    this._previous = _button;
                }

            }
        },

        /**
         * 删除button，如果buttonId是一个单独的按钮，删除单个buttonId.
         * 如果buttonId是一个buttonId的数组，删除一组button.
         * @param btnId [string] 按钮对象id
         */
        deleteButtons: function (btnId) {
            if (!LMEPG.Func.isArray(btnId)) {
                btnId = [btnId];
            }
            for (var i in btnId) {
                if (this._previous != null && this._previous.id === btnId[i].id) {
                    this._previous = null;
                }
                if (this._current != null && this._current.id === btnId[i].id) {
                    this._current = null;
                }
                delete LMEPG.ButtonManager._buttons[btnId[i].id];
            }
        },

        /**
         * 刷新界面, 增加，删除按钮后，如果需要显示更新，需要调用此函数
         */
        refresh: function () {
            if (this._previous != null && this._buttons != null) {
                this._previous = this._buttons[this._previous.id];
            }
            if (this._current != null && this._buttons != null) {
                this._current = this._buttons[this._current.id];
            }
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
            if (!current) {
                return;
            }

            var _current = G(current.id);
            if (_current) {
                if (current.backgroundImage) {
                    if (current.type === BUTTON_TYPE_DIV) {
                        _current.style.backgroundImage = current.backgroundImage;
                    } else {
                        _current.src = current.backgroundImage;
                    }
                } else if (current.type === BUTTON_TYPE_INPUTTEXT) {
                    _current.disabled = true;
                    _current.blur();
                }
            }
        },

        /**
         * 设置按钮选中状态
         * @param btnId [string] 按钮对象id
         * @param selected [boolean] 是否选中
         */
        setSelected: function (btnId, selected) {
            var button = this.getButtonById(btnId);
            if (typeof (button) !== "undefined" && button) {
                if (typeof button.selected !== "undefined" && button.selected === selected) {
                    return;
                }

                // 设置按钮状态
                button.selected = selected;
                LMEPG.ButtonManager._buttons[button.id] = button;

                // 更新同一组的其他按钮的选中状态视图
                if (selected) {
                    if (typeof (button.groupId) !== "undefined" && button.groupId != null && button.groupId !== "") {
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

                if (typeof this._current !== "undefined" && this._current != null && this._current.id === button.id) {
                    // 当前焦点ID被设置选中状态时，保持为焦点状态
                    return;
                }
                // 更新当前设置按钮的视图
                LMEPG.ButtonManager._updateSelectStatus(button);
            }
        },
        /**
         * 获取被选中的按钮
         * @param groupId [string] 组id名标识符
         */
        getSelectedButton: function (groupId) {
            var button = null;
            if (typeof groupId === "undefined" || groupId == null) {
                groupId = "";
            }

            var buttons = LMEPG.ButtonManager._buttons;
            for (var btn in buttons) {
                if (groupId === "" && (typeof (buttons[btn].groupId) === "undefined"
                    || buttons[btn].groupId == null || buttons[btn].groupId === "") && buttons[btn].selected) {
                    button = buttons[btn];
                    break;
                }
                if (groupId === buttons[btn].groupId && buttons[btn].selected) {
                    button = buttons[btn];
                }
            }
            return button;
        },

        _updateSelectStatus: function (button) {
            if ((typeof (button) === "undefined" || button === null)
                || (typeof (button.selected) === "undefined" || button.selected == null)) {
                return;
            }

            var _button = G(button.id);
            if (!_button) {
                return;
            }
            if (button.selected && button.selectedImage) {
                if (button.type === BUTTON_TYPE_DIV) {
                    _button.style.backgroundImage = 'url(\'' + button.selectedImage + '\')';
                } else {
                    _button.src = button.selectedImage;
                }
            } else if (button.backgroundImage) {
                if (button.type === BUTTON_TYPE_DIV) {
                    _button.style.backgroundImage = 'url(\'' + button.backgroundImage + '\')';
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
         * @param direction [string] 方向限值 ["up|down|left|right"]
         * @param buttonId [string] 指定按钮的id。如果不存在，则使用当前按钮作为基准按钮寻找。
         * @return {object|undefined} 返回目标按钮对象，可能为undefined
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
         * @param id dom元素id
         * @return {null|undefined|object}
         */
        getButtonById: function (id) {

            if (typeof id === "string" && id !== "") {
                var _button = G(id);
                if (_button) {
                    var btn = this._buttons[id];
                    // 如果按钮配置了disable:true，那么视作这个按钮不存在
                    if (btn && btn.disabled !== true) {
                        return this._buttons[id];
                    }
                }
            }
            return null;
        },

        /**
         * 通过按钮id获取向上按键的焦点id
         * @param id [string] dom元素id
         */
        getNextFocusUpId: function (id) {
            var button = this.getButtonById(id);
            if (!button) {//按钮不存在，不做任何处理
                return;
            }
            return button.nextFocusUp;
        },

        /**
         * 通过按钮id获取向下按键的焦点id
         * @param id [string] dom元素id
         */
        getNextFocusDownId: function (id) {
            var button = this.getButtonById(id);
            if (!button) {//按钮不存在，不做任何处理
                return;
            }
            return button.nextFocusDown;
        },

        /**
         * 通过按钮id获取向左按键的焦点id
         * @param id [string] dom元素id
         */
        getNextFocusLeftId: function (id) {
            var button = this.getButtonById(id);
            if (!button) {//按钮不存在，不做任何处理
                return;
            }
            return button.nextFocusLeft;
        },

        /**
         * 通过按钮id获取向右按键的焦点id
         * @param id [string] dom元素id
         */
        getNextFocusRightId: function (id) {
            var button = this.getButtonById(id);
            if (!button) {//按钮不存在，不做任何处理
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
         * （供外部调用）模拟当前焦点按键-点击事件
         */
        performClick: function () {
            var btn = LMEPG.BM.getCurrentButton();
            if (btn) LMEPG.call(btn.click, [btn]);
        },

        /**
         * （供外部调用）模拟当前焦点按键-移动事件
         */
        performMoveChange: function (dir) {
            LMEPG.BM._onMoveChange(dir);
        },

        /**
         * 默认确认按键处理回调
         * @private
         */
        _onClick: function () {
            if (!this._current) {
                return;
            }
            if (this._isKeyEventPause === true) {
                return;
            }
            LMEPG.call(this._current.click, [this._current]);
        },

        /**
         * 默认方向按键回调
         * @param direction [string] 方向限值 ["up|down|left|right"]
         * @private
         */
        _onMoveChange: function (direction) {
            if (!this._current) {
                return;
            }
            if (this._isKeyEventPause === true) {
                return;
            }

            this._direction = direction;

            if (this._onBeforeMoveChange(direction) === false) {
                return;
            }

            var button;
            var nextButtonId = this._getNextFocusId(this._current.id, direction);
            if (typeof nextButtonId == "string") {
                nextButtonId = [nextButtonId];
            }
            if (LMEPG.Func.array.isArray(nextButtonId)) {
                for (var i = 0; i < nextButtonId.length; i++) {
                    button = this.getButtonById(nextButtonId[i]);
                    if (button) {
                        break;
                    }
                }
                if (button && button.focusable === true) {
                    this._previous = this._current;
                    this._current = button;
                    this._update();
                }
            }
            LMEPG.call(this._current.moveChange, [this._previous, this._current, direction]);
        },

        /**
         * 执行改变前的回调
         * @param direction [string] 方向限值 ["up|down|left|right"]
         * @private
         */
        _onBeforeMoveChange: function (direction) {
            if (this._current && this._current.beforeMoveChange) {
                return LMEPG.call(this._current.beforeMoveChange, [direction, this._current]);
            }
        },

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
                        KEY_RIGHT: 'LMEPG.ButtonManager._onMoveChange("right")',		            // 右键
                        KEY_UP: 'LMEPG.ButtonManager._onMoveChange("up")',			                // 上键
                        KEY_DOWN: 'LMEPG.ButtonManager._onMoveChange("down")',		                // 下键
                        KEY_BACK: 'onBack()'							                            // 返回键，onBack 由页面自行定义回调
                    });
            }
        },

        /**
         * 初始化按钮集合，修正部分参数
         * @private
         */
        _initButtons: function () {
            //初始化所有的按钮属性
            for (var i = 0; i < this._config.buttons.length; i++) {
                var button = this._config.buttons[i];
                var _button = G(button.id);
                if (!button) {
                    continue;
                }
                // button.type != "others" --> 当在另一个对象中push buttons按钮时在翻页的时候（翻页的焦点会拿取上一个按钮对象的src）故在此添加一个阻止条件
                if (!button.backgroundImage && _button && button.type !== "others") {
                    // 如果按钮没有设置backgroundImage图片，把src作为对应的图片按钮。要求必须写在window.onload里面，否则部分盒子获取不到src
                    // button.backgroundImage = _button.src;
                }
                if (this._config.imagePath && button.focusImage && button.focusImage.indexOf("http") < 0) {
                    //如果(配置了imagePath && 当前按钮配置了焦点图片 && 焦点图片不是http开头)
                    button.focusImage = this._config.imagePath + button.focusImage;
                }
                if (this._config.imagePath && button.backgroundImage && button.backgroundImage.indexOf("http") < 0) {
                    //如果(配置了imagePath && 当前按钮配置了焦点图片 && 焦点图片不是http开头)
                    button.backgroundImage = this._config.imagePath + button.backgroundImage;
                }
                if (typeof button.focusable === 'undefined') button.focusable = true;
                this._buttons[button.id] = button;
                this._addOnclick(button.id);
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
                    button.backgroundImage = _button.src;
                }
                if (this._config.imagePath && button.focusImage && button.focusImage.indexOf("http") < 0) {
                    //如果(配置了imagePath && 当前按钮配置了焦点图片 && 焦点图片不是http开头)
                    button.focusImage = this._config.imagePath + button.focusImage;
                }
                if (this._config.imagePath && button.backgroundImage && button.backgroundImage.indexOf("http") < 0) {
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
            if (typeof this._config.defaultFocusId === "string") {
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
        },

        /**
         * 更新按钮状态
         * @private
         */
        _update: function () {
            var prev = this._previous;
            var current = this._current;

            // 减少查询dom次数
            var prevElement = prev ? G(prev.id) : null;
            var currElement = current ? G(current.id) : null;

            // 更新上一个按钮状态
            if (prevElement) {
                if (typeof prev.selected !== "undefined" && prev.selected
                    && typeof prev.selectedImage !== "undefined" && prev.selectedImage) {
                    // 按钮为选中状态
                    if (prev.type === BUTTON_TYPE_DIV) {
                        prevElement.style.backgroundImage = "url(" + prev.selectedImage + ")";
                    } else {
                        prevElement.src = prev.selectedImage;
                    }
                } else if (prev.backgroundImage) {
                    if (prev.type === BUTTON_TYPE_DIV) {
                        prevElement.style.backgroundImage = "url(" + prev.backgroundImage + ")";
                    } else {
                        prevElement.src = prev.backgroundImage;
                    }
                } else if (prev.type === BUTTON_TYPE_INPUTTEXT) {
                    prevElement.disabled = true;
                    prevElement.blur();
                }

                LMEPG.call(prev.focusChange, [prev, false]);
            }

            // 更新当前按钮的状态
            if (currElement) {
                if (current.focusImage) {
                    if (current.type === BUTTON_TYPE_DIV) {
                        currElement.style.backgroundImage = 'url(' + current.focusImage + ')';
                    } else {
                        currElement.src = current.focusImage;
                    }
                } else if (current.type === BUTTON_TYPE_INPUTTEXT) {
                    currElement.disabled = false;
                    currElement.focus();
                }

                LMEPG.call(current.focusChange, [current, true]);
            }
        },

        /**
         * 获取按钮的下一个焦点Id
         * @param id [string] dom元素id
         * @param direction [string] 方向限值 ["up|down|left|right"]
         * @private
         */
        _getNextFocusId: function (id, direction) {
            if (direction === "up") {
                return this.getNextFocusUpId(id);
            }
            if (direction === "down") {
                return this.getNextFocusDownId(id);
            }
            if (direction === "left") {
                return this.getNextFocusLeftId(id);
            }
            if (direction === "right") {
                return this.getNextFocusRightId(id);
            }
        }
    };
})();

/*****************************************************************
 * CSS样式管理器
 *****************************************************************/
LMEPG.CssManager = (function () {
    return {
        /**
         * 判断样式是否存在。注意，标清盒子不一定支持，谨慎使用！
         * @param obj [string|dom object] dom元素id或者dom元素对象
         * @param cls
         * @return {boolean} true-存在样式 false-不存在样式
         */
        hasClass: function (obj, cls) {
            if (!obj) return false;
            if (typeof obj === "string") { // 如果obj是字符串，id的话，先得到对象。
                obj = G(obj);
                if (!obj) return false;
            }

            // 判断是否有该样式
            return strContain(obj.className, cls);
        },

        /**
         * 增加样式。注意，标清盒子不一定支持，谨慎使用！
         * @param obj [string|dom object] dom元素id或者dom元素对象
         * @param cls
         */
        addClass: function (obj, cls) {
            if (!obj) return;
            if (typeof obj === "string") { // 如果obj是字符串，id的话，先得到对象。
                obj = G(obj);
                if (!obj) return;
            }
            if (!this.hasClass(obj, cls)) {
                obj.className += " " + cls;
            }
        },

        /**
         * 删除样式
         * @param obj
         * @param cls
         */
        removeClass: function (obj, cls) {
            if (!obj) return;
            if (typeof obj === "string") { // 如果obj是字符串，id的话，先得到对象。
                obj = G(obj);
                if (!obj) return;
            }
            if (this.hasClass(obj, cls)) {
                obj.className = obj.className.replace(eval("/" + cls + "/g"), " ");
            }
        }
    };
})();

/*****************************************************************
 * 机顶盒相关信息操作 JS 工具
 *****************************************************************/
LMEPG.STBUtil = (function () {
    return {
        /**
         * 获取机顶盒 用户账号/业务账号
         * @return {string}
         */
        getUserId: function () {
            var stbUID = "";

            try {
                if (typeof (Authentication) === "object") {
                    //此方法经测试目前可以获取到华为，中兴，创维三款机顶盒型号
                    stbUID = Authentication.CTCGetConfig("UserID");
                    if (!stbUID) {
                        stbUID = Authentication.CUGetConfig("UserID");
                    }

                    if (!stbUID) {
                        // 安徽电信 创维盒子需要用username来获取业务帐号
                        stbUID = Authentication.CTCGetConfig("username");
                    }

                    if (!stbUID) {
                        stbUID = Authentication.CUGetConfig("username");
                    }

                    // 烽火的机顶盒
                    if (!stbUID) {
                        stbUID = Authentication.CTCGetConfig("device.userid");
                    }
                }

                // 中兴老的盒子获取机顶盒型号的方法
                if (!stbUID && typeof (ztebw) == "object") {
                    stbModel = ztebw.ioctlRead("infoZTEHWType");
                    if (!stbModel) {
                        stbModel = ztebw.ioctlRead("infoHWProduct");
                    }
                }

                // 长虹机顶盒获取账号（四川广电：智能卡号）方法
                if (!stbUID && typeof (CAManager) === "object") {
                    stbUID = CAManager.cardSerialNumber;
                }
            } catch (e) {
                // 兼容保护（如：对象未定义方法）
            }

            return stbUID;
        },

        /**
         * 获取机顶盒 设备ID
         * @return {string}
         */
        getSTBId: function () {
            var stbId = "";

            try {
                if (typeof (Authentication) == "object") {
                    stbId = Authentication.CTCGetConfig("STBID");
                    if (!stbId) {
                        stbId = Authentication.CUGetConfig("STBID");
                    }
                    if (!stbId) {
                        stbId = Authentication.CTCGetConfig("device.stbid"); // 烽火的机顶盒
                    }
                }

                // 广西广电获取stbId
                if (!stbId && typeof (guangxi) === "object") {
                    stbId = guangxi.getStbNum();
                }
            } catch (e) {
                // 兼容保护（如：对象未定义方法）
            }

            return stbId;
        },

        /**
         * 获取机顶盒型号
         * @return {string}
         */
        getSTBModel: function () {
            var stbModel = "";

            try {
                if (typeof (Authentication) == "object") {
                    // 此方法经测试目前可以获取到华为，中兴，创维三款机顶盒型号
                    stbModel = Authentication.CTCGetConfig("STBType");
                    if (!stbModel) {
                        stbModel = Authentication.CUGetConfig("STBType");
                    }
                    if (!stbModel) {
                        stbModel = Authentication.CTCGetConfig("device.stbmodel"); // 烽火的机顶盒
                    }
                }

                // 中兴老的盒子获取机顶盒型号的方法
                if (!stbModel && typeof (ztebw) == "object") {
                    stbModel = ztebw.ioctlRead("infoZTEHWType");
                    if (!stbModel) {
                        stbModel = ztebw.ioctlRead("infoHWProduct");
                    }
                }

                // 长虹机顶盒获取型号（四川广电）
                if (!stbModel && typeof (HardwareInfo) === "object" && typeof (HardwareInfo.STB) === "object") {
                    stbModel = HardwareInfo.STB.model;
                }
            } catch (e) {
                // 兼容保护（如：对象未定义方法）
            }

            return stbModel;
        },

        /**
         * 获取机顶盒mac地址
         * @return {string}
         */
        getSTBMac: function () {
            if (window.isWinOS) { //Windows操作系统
                return "00-00-00-00-00-00";
            }

            var mac = "";
            if (typeof (Authentication) == "object") {
                try {
                    mac = Authentication.CUGetConfig("mac");
                    if (!mac && typeof (ztebw) == "object") {
                        var stbId = ztebw.ioctlRead("infoHWSN");
                        mac = stbId.substring(stbId.length - 12);
                    }

                    if (!mac) {
                        mac = Authentication.CTCGetLocalMAC();
                    }
                } catch (e) {
                }
            }

            // 广西广电获取mac
            if (!mac && typeof iPanel === "object") {
                mac = iPanel.getGlobalVar("MAC_ETH0");
            }

            // 长虹机顶盒获取mac（四川广电）
            if (!mac && typeof (Ethernet) === "object") {
                mac = Ethernet.MACAddress;
            }

            if (mac) {
                while (mac.indexOf(":") !== -1) {
                    mac = mac.replace(":", "");
                }
            } else {
                mac = "00-00-00-00-00-00";
            }
            return mac;
        },

        /**
         * 获取 EPG大厅地址
         * @return {string}
         */
        getEPGDomain: function () {
            var epgDomain = "";

            try {
                if (typeof (Authentication) == "object") {
                    epgDomain = Authentication.CTCGetConfig("EPGDomain");
                    if (!epgDomain) {
                        epgDomain = Authentication.CUGetConfig("EPGDomain");
                    }
                    if (typeof epgDomain === "undefined" || epgDomain == null) {
                        epgDomain = "";
                    }
                }
            } catch (e) {
                // 兼容保护（如：对象未定义方法）
                LMEPG.Log.fatal('getEPGDomain excption:' + e);
            }

            return epgDomain;
        },

        /**
         * 获取 UserToken
         * @return {string}
         */
        getUserToken: function () {
            var userToken = "";
            if (typeof (Authentication) == "object") {
                userToken = Authentication.CTCGetConfig("UserToken");
                if (!userToken) {
                    userToken = Authentication.CUGetConfig("UserToken");
                }
                if (!userToken) {
                    userToken = Authentication.CTCGetConfig("device.usertoken");
                }
            }
            return userToken;
        }
    };
})();

/*****************************************************************
 * 机顶盒EPG调用APK插件处理
 *****************************************************************/
LMEPG.ApkPlugin = (function () {
    return {
        /**
         * 判断盒子是否支持APK插件
         * @return {boolean} true-支持。false-不支持
         */
        isSupportApk: function () {
            return typeof STBAppManager !== "undefined" && STBAppManager != null;
        },

        /**
         * 判断插件APK是否安装
         * @param appName [string] APK应用程序唯一包名
         * @returns {*|undefined} 若不支持，返回undefined！
         */
        isAppInstall: function (appName) {
            return this.isSupportApk() ? STBAppManager.isAppInstalled(appName) : undefined;
        },

        /**
         * 通过包名启动app插件
         * @param appName [string] APK应用程序唯一包名
         * @return {*|undefined} 若不支持，返回undefined！
         */
        startAppByName: function (appName) {
            return this.isSupportApk() ? STBAppManager.startAppByName(appName) : undefined;
        },

        /**
         * 通过Intent方式启动插件应用
         * @param intentMessage [object] 标准规范的启动APK程序所需参数
         * @return {*|undefined} 若不支持，返回undefined！
         */
        startAppByIntent: function (intentMessage) {
            return this.isSupportApk() ? STBAppManager.startAppByIntent(intentMessage) : undefined;
        },

        /**
         * 通过包名重启app
         * @param appName [string] APK应用程序唯一包名
         * @return {*|undefined} 若不支持，返回undefined！
         */
        resetAppByName: function (appName) {
            return this.isSupportApk() ? STBAppManager.restartAppByName(appName) : undefined;
        },

        /**
         * 提供APK下载地址下载并自动安装
         * @param appDownloadUrl [string] 下载APK程序的URL地址
         * @returns {*|undefined} 若不支持，返回undefined！
         */
        installApp: function (appDownloadUrl) {
            return this.isSupportApk() ? STBAppManager.installApp(appDownloadUrl) : undefined;
        },

        /**
         * 卸载App应用
         * @param appName app应用包名
         * @returns {*}
         */
        uninstallApp: function (appName) {
            return this.isSupportApk() ? STBAppManager.uninstallApp(appName) : undefined;
        },

        /**
         * 查询 Android 系统已安装应用的版本号
         * @param appName [string] APK应用程序唯一包名
         * @returns {*|string} 返回查询到系统已安装该APP的版本号。若不支持，返回空字符串！
         */
        getAppVersion: function (appName) {
            return this.isSupportApk() ? STBAppManager.getAppVersion(appName) : "";
        }
    };
})();

/*****************************************************************
 * 其它立即执行任务
 *****************************************************************/
// 其它附加执行
(function exec_extras_immediately() {
    if (typeof window.onunload !== "undefined") {
        window.onunload = function () {
            if (typeof (iPanel) != "undefined") {
                if (LMEPG.Cookie.getCookie("iPanel_focusWidth") != null && LMEPG.Cookie.getCookie("iPanel_focusWidth") !== "") {
                    iPanel.focusWidth = LMEPG.Cookie.getCookie("iPanel_focusWidth");
                } // 还原系统光标的大小
            }
        };
    }
    // 广西广电盒子返回无效统一处理
    if (LMEPG.Func.array.contains(get_carrier_id(), ["520094"])) {
        if (typeof iPanel == "object") {  //广西广电需要赋值返回键、退出键有页面来控制
            iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", 1);
            iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", 1);
        }
    }
})();

/*****************************************************************
 * 鉴权相关处理
 *****************************************************************/
LMEPG.AuthUser = (function () {
    return {
        authUrl: 'User/authUser',

        /** 启动页鉴权节点 */
        authNodeSplash: 'splash',
        /** 活动页鉴权节点 */
        authNodeActivity: 'activity',

        /**
         * 对用户进行鉴权
         * @param successFunc
         *  -- 鉴权成功回调函数, 中国联通特殊处理, 需要路由局方鉴权地址鉴权
         * @param failFunc    鉴权失败回调函数
         * @param authPos 当前鉴权接口参数，默认启动页鉴权
         */
        authUser: function (successFunc, failFunc, authPos) {
            // 1、获取盒子内部相关参数
            var EPGParams = this.getEPGParams(authPos);
            // 2、校验用户状态
            EPGParams.vipState = EPGParams.vipState ? EPGParams.vipState : 0;
            // 3、获取盒子绑定开通的业务账号
            EPGParams.userAccount = EPGParams.userAccount ? EPGParams.userAccount : get_user_account_id();
            // 4、调用接口
            this.authByNetwork(EPGParams, function (data) {
                var unicomCarriers = ['000051', '10000051', '11000051', '13000051'];
                var carrierId = get_carrier_id();
                LMEPG.Log.info("task 1");
                if (unicomCarriers.indexOf(carrierId) > -1 && data.result == -10) { // 中国联通特殊处理，需要路由到局方鉴权地址
                    LMEPG.Log.info("task");
                    window.location = data.authUrl;
                } else {
                    LMEPG.Log.info("successFunc");
                    successFunc(data);
                }
            }, failFunc);
        },

        /**
         * Android平台鉴权方法
         * @param authData 鉴权的通用数据，包括用户的账号信息，盒子的设备信息
         * @param successFunc 鉴权成功的回调函数
         * @param failFunc 鉴权失败的回调函数
         */
        authUser4Android: function (authData, successFunc, failFunc) {
            // 空实现，待需要android平台自动实现
        },

        /**
         * 获取盒子内部相关的信息
         *  -- 为简化逻辑流程，结合业务员，默认设置有内部相关参数
         *  -- 如果存在差异，需要覆盖重写函数来进一步实现
         * */
        getEPGParams: function (authNode) {
            return {
                stbModel: LMEPG.STBUtil.getSTBModel(),   // 盒子型号，包括厂商和具体系列
                stbMac: LMEPG.STBUtil.getSTBMac(),       // 盒子MAC地址
                epgDomain: LMEPG.STBUtil.getEPGDomain(), // 局方大厅的地址，用于应用程序返回局方大厅
                stbId: LMEPG.STBUtil.getSTBId(),         // 盒子的设备ID
                epgUserId: LMEPG.STBUtil.getUserId(),    // 盒子绑定的用户ID
                userToken: LMEPG.STBUtil.getUserToken(), // 用户当前的token值
                authNode: authNode                       // 用户当前鉴权的节点（例如启动页传入，splash）
            }
        },

        /** 网络层交互 **/
        authByNetwork: function (postData, successFunc, failFunc) {
            LMEPG.Log.debug("LMAuthUser->authByNetwork->postData->" + JSON.stringify(postData));
            LMEPG.ajax.postAPI(this.authUrl, postData, function (respData) {
                successFunc(respData);
            }, function (errorData) {
                LMEPG.Log.error("LMSplashModel->authByNetwork->error->" + errorData);
                failFunc(errorData);
            })
        }
    };
})();

// 结束声明命名空间LMEPG后，引入业务扩展js
try {
    LMEPG.Log.info('lmcommon.js g_appRootPath=' + g_appRootPath);
    document.writeln('<script type="text/javascript" src="' + g_appRootPath + '/Public/Common/js/lmcommonExt.js?t=' + Date.now() + '"></script>');
} catch (e) {
    LMEPG.Log.error('lmcommon.js includes JS-Files error:' + e.toString());
}

// 核心事件框架启动
LMEPG.Framework.looper();

//************************ 调试加载JS结束时间 ************************//
//if (debug) console.log("###### [DEBUG] lmcommon.js ######: loaded cost time: " + (new Date().getTime() - window.loadJSStartDT) + " ms");

// 结束声明命名空间LMEPG后，引入业务扩展js

//联通芒果TV监听事件
try {
    if (get_carrier_id() == "07430093") {
        Webview.stopVideo();
        Webview.setKeyEventHandler(function (action, keyCode, keyName, metaState) {
            LMEPG.Log.info("keyCode:" + keyCode);
            LMEPG.call(LMEPG.Framework.onEvent, [keyCode]);
        });
    }
} catch (e) {
    console.log('lmcommon.js includes JS-Files error:' + e.toString());
}

try {
    // 山东海看
    if (get_carrier_id() == '371092') {
        document.writeln('<script  type="text/javascript" src="' + g_appRootPath + '/Public/ThirdParty/js/371092/haikanCtAuthSDK_1.0.1.min.js"></script>');
        document.writeln('<script type="text/javascript" src="' + g_appRootPath + '/Public/ThirdParty/js/371092/haiKanProbe_1.0.1.min.js"></script>');
    }

    // 数据探针上报。
    if (get_carrier_id() == "630092" || get_carrier_id() == '371092' || get_carrier_id() == '371002') {
        document.write('<script type="text/javascript" src="' + appRootPath + '/Public/Common/js/lmdatareport.js"></script>');
    }
} catch (e) {
    LMEPG.Log.error('lmcommon.js includes JS-Files error:' + e.toString());
}

//广东广电返回按键底层做了处理,需要通过回调js方式
function doReturnKey() {
    LMEPG.Framework.onEvent(KEY_BACK)
}

// 结束声明命名空间LMEPG后，引入业务扩展js
try {
    LMEPG.Log.debug('lmcommon.js g_appRootPath=' + g_appRootPath);
    document.writeln('<script type="text/javascript" src="' + g_appRootPath + '/Public/Common/js/lmcommonExt.js?t=' + new Date().getTime() + '"></script>');
    document.writeln('<script type="text/javascript" src="' + g_appRootPath + '/Public/Common/js/lmmobile_base.js"></script>');
} catch (e) {
    LMEPG.Log.error('lmcommon.js includes JS-Files error:' + e.toString());
}
