/**
 * EPG焦点移动框架
 * @author: xiaofei.jian
 * @time: 2019-08-04 16:24
 * @version: 2.0
 * @desc:调整说明参考：sources/epg-lws/Public/README.md
 */
var debug = true; // 调试环境，上线后必须把此参数改为false！
/****************************************************************
 * 事件定义：
 * KEY_ 开头的是系统按键事件
 * EVENT_ 开头的是虚拟按键
 ***************************************************************/
/*eslint no-unused-vars: "off"*/
var KEY_BACK = 0x0008, 	            // 返回/删除
    KEY_BACK_640 = 0x0280, 	        // 返回按键（值为640）
    KEY_ENTER = 0x000D, 	        // 确定
    KEY_PAGE_UP = 0x0021,	        // 上页
    KEY_PAGE_DOWN = 0x0022,         // 下页
    KEY_LEFT = 0x0025,              // 左
    KEY_LEFT_65 = 0x0041,           // 左
    KEY_UP = 0x0026,                // 上
    KEY_UP_87 = 0x0057,             // 上
    KEY_RIGHT = 0x0027,	            // 右
    KEY_RIGHT_68 = 0x0044,	        // 右
    KEY_DOWN = 0x0028,	            // 下
    KEY_DOWN_83 = 0x0053,	        // 下
    KEY_0 = 0x0030,                 // 0
    KEY_1 = 0x0031,                 // 1
    KEY_2 = 0x0032,                 // 2
    KEY_3 = 0x0033,                 // 3
    KEY_4 = 0x0034,                 // 4
    KEY_5 = 0x0035,                 // 5
    KEY_6 = 0x0036,                 // 6
    KEY_7 = 0x0037,                 // 7
    KEY_8 = 0x0038,                 // 8
    KEY_9 = 0x0039,                 // 9
    KEY_VOL_UP = 0x0103, 	        // Vol+，音量加
    KEY_VOL_UP_61 = 0x003D, 	    // Vol+，音量加
    KEY_VOL_DOWN = 0x0104,	        // Vol-，音量减
    KEY_VOL_DOWN_45 = 0x002D,	    // Vol-，音量减
    KEY_MUTE_67 = 0x0043,	        // Mute，静音
    KEY_MUTE = 0x0105,	            // Mute，静音
    KEY_TRACK = 0x0106,	            // Audio Track，切换音轨
    KEY_PLAY_PAUSE = 0x0107,	    // >||，播放，暂停
    KEY_FAST_FORWARD = 0x0108,	    // >> ，快进
    KEY_FAST_REWIND = 0x0109,	    // << ，快退
    KEY_RED = 0x0113,               // 红色键
    KEY_GREEN = 0x0114,	            // 绿色键
    KEY_YELLOW = 0x0115,            // 黄色键
    KEY_BLUE = 0x0116,              // 蓝色键
    KEY_DELETE = 0x0118,            // 删除键中兴盒子
    KEY_VIRTUAL_EVENT = 0x0300,	    // 虚拟事件按键
    KEY_EXIT = 0x001B,	            // 退出按键（非home键）
    KEY_399 = 0x018F,               // 广西广电返回键
    KEY_514 = 0x0202,               // 广西广电退出键
    KEY_5002 = 5002,                // 广西广电--加载成功，开始播放
    KEY_5004 = 5004,                // 广西广电播--加上失败
    KEY_5006 = 5006,                // 广西广电播--正常播放结束
    KEY_5007 = 5007,                // 广西广电--播放结束，用户按退出或其他快捷键结束播放
    KEY_5008 = 5008,                // 广西广电--播放异常

    BUTTON_TYPE_DIV = 'div',                        // 焦点按钮类型---- div

    EVENT_MEDIA_END = 'EVENT_MEDIA_END',            // 视频播放结束
    EVENT_MEDIA_ERROR = 'EVENT_MEDIA_ERROR';        // 视频播放错误


/*根据ID返回dom元素*/
function G(arg) {
    return typeof arg === 'string' ? document.getElementById(arg) : arg;
}

/*元素显示*/
function S(arg) {
    if (arg) G(arg).style.visibility = 'visible';
}

/*元素隐藏*/
function H(arg) {
    if (arg) G(arg).style.visibility = 'hidden';
}

/*显示元素，相当于文档新增了元素*/
function Show(arg) {
    if (arg) G(arg).style.display = 'block';
}

/*隐藏元素，相当于文档删除了元素*/
function Hide(arg) {
    if (arg) G(arg).style.display = 'none';
}

/*切换元素显隐效果*/
function toggle(arg) {
    var el = G(arg);
    var isDisplay = el.style.display;
    el.style.display = isDisplay === 'block' ? 'none' : 'block';
}

/*判断元素是否存在*/
function isExist(obj) {
    // 除去0,null,undefined,''外都返回true,
    return !!obj;
}

/*通用类型判断函数*/
function is(o, type) {
    switch (type.toLowerCase()) {
        case 'undefined':
            return o === undefined;
        case 'null':
            return o === null;
        case 'object':
            return isExist(o) && !(o instanceof Array) && (o instanceof Object);
        case 'array':
            return o instanceof Array;
        case 'finite':
            var isnan = {'NaN': 1, 'Infinity': 1, '-Infinity': 1};
            return !isnan['hasOwnProperty'](+o);
        default:
            return typeof o === type && o !== null;
    }
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
        if (typeof fn === 'function') {
            if (!is(args, 'array')) {
                var temp = [];
                for (var i = 1; i < arguments.length; i++)
                    temp.push(arguments[i]);
                args = temp;
            }
            return fn.apply(null, args);
        }
    },

    onEvent: null  //事件回调, 如果页面需要自己定义事件处理器，可以在页面单独配置使用
};

/**
 * 事件管理
 * KeyEventManager
 */
LMEPG.KeyEventManager = LMEPG.KEM = function () {

    var _keys = {};      // 存储注册的按键事件
    var _keyCodes = [];  // 存储按键键值
    var _isAllow = true; // 是否允许执行按键事件
    /**
     * 启用按键处理器，如果外部没有重新定义，采用该按键处理器
     * @param code 键值
     * @private
     */
    var _runKeyEvent = function (code) {
        if (LMEPG.KEM.stopEventProcess(code)) return;
        _keyCodes.push(code);
        for (var i in _keys) {
            if (code === window[i] && _isAllow) {
                LMEPG.call(_keys[i], code);
                break;
            }
        }
    };

    return {

        /**
         * 初始化按键事件管理器
         */
        init: function () {
            //判断事件处理器是否定义，避免重复定义处理
            if (!LMEPG.onEvent) {
                LMEPG.onEvent = _runKeyEvent;
            }
        },
        /**
         * 检测键值有效
         * @param code
         * @returns {boolean}
         */
        isValidKey: function (code) {
            //如果是“KEY_”或者“EVENT_”开头，视作按键
            return code.indexOf('KEY_') === 0 || code.indexOf('EVENT_') === 0;
        },
        /**
         * 增加事件处理，支持单个事件和批量添加事件
         * @param code  事件id  可以是字符串和对象数据。不能是number
         * @param action 单个事件添加时的事件响应动作
         */
        addKeyEvent: function (code, action) {
            var _code = code;
            if (typeof _code === 'string' && action) {
                _code = {};
                _code[code] = action;
            }
            if (typeof _code === 'object') {
                //批量添加按键事件
                for (var i in _code) {
                    if (this.isValidKey(i)) {
                        _keys[i] = _code[i];
                    } else {
                        console.error('错误：添加按键映射时code为不支持的类型！');
                    }
                }
            } else if (typeof _code === 'number') {
                //根本不允许出现这种错误！
                console.error('错误：添加按键映射时code不能为number类型！');
            }
            return this;
        },

        /**
         * 删除事注册件键值
         * @param code
         * @returns {LMEPG.KeyEventManager}
         */
        delKeyEvent: function (code) {
            if (!is(code, 'array')) {
                //单个事件删除，转换成数组和多个事件删除统一处理
                code = [code];
            }
            for (var i = 0; i < code.length; i++) {
                if (_keys[code[i]]) {
                    _keys[code[i]] = '';
                }
            }
            return this;
        },

        /**
         * 得到按键序列
         * @returns {[]}
         */
        getKeyCodes: function () {
            return _keyCodes;
        },
        /**
         * 得到注册键值集合
         */
        getKeys: function () {
            return _keys;
        },

        setAllowFlag: function (flag, code) {
            if (typeof flag === 'function') {
                _isAllow = flag.call(null, code);
            } else {
                _isAllow = flag;
            }
        },

        /**
         * 设置特定事件拦截
         */
        stopEventProcess: function () {
        }
    };
}();

/**
 * 自定义按钮控件管理器
 * ButtonManager
 */
LMEPG.ButtonManager = LMEPG.BM = LMEPG.bm = function () {
    /*定义私有变量*/
    var _buttons = {};               // 自定义按钮数组
    var _previous = null;            // 上一个焦点按钮
    var _current = null;             // 当前焦点按钮
    var _currentElement = null;      // 当前焦点按钮dom节点
    var _isKeyEventPause = false;    // 按键事件是否暂停的标志

    /**
     * 注册默认的按键事件
     * @private
     */
    var _setDefaultKeyEvent = function (isInitKeys) {
        if (isInitKeys) {
            LMEPG.KEM.init();
            LMEPG.KEM.addKeyEvent({
                KEY_BACK: _onBack,	           // 返回键，onBack 由页面自行定义回调
                KEY_ENTER: _onClick,		   // 确定键
                KEY_UP: _onMoveChange,		   // 上键
                KEY_DOWN: _onMoveChange,	   // 下键
                KEY_LEFT: _onMoveChange,	   // 左键
                KEY_RIGHT: _onMoveChange       // 右键
            });
        }
    };

    var _onBack = function () {
        // 页面自定义了返回函数
        if (typeof onBack === 'function') {
            // eslint-disable-next-line no-undef
            onBack();
        }
    };

    /**
     * 默认确认按键处理回调
     * @private
     */
    var _onClick = function () {
        var currBtn = _current;
        if (currBtn && !_isKeyEventPause) {
            LMEPG.call(currBtn.click, [currBtn]);
        }
    };

    /**
     * 默认方向按键回调
     * @private
     * @param code
     */
    var _onMoveChange = function (code) {
        var dir = _getDirection(code);
        var currBtn = _current;
        /*
        * 移动前判断（以下任意条件成立则更新按钮状态）：
        * 1.方向不存在
        * 2.设置了事件暂停
        * 3.按钮不存在
        * 4.焦点移动之前回调返回false
        * */
        if (!dir || _isKeyEventPause || !currBtn || _onBeforeMoveChange(dir) === false) {
            return;
        }

        var nextFocusIndex = 'nextFocus' + dir.slice(0, 1) + dir.slice(1).toLowerCase();
        var nextBtn = _buttons[currBtn[nextFocusIndex]];
        _currentElement = nextBtn ? G(nextBtn.id) : null;
        if (nextBtn && nextBtn.focusable && _currentElement) {
            _update(nextBtn);
        }
        // 焦点移动之后回调
        LMEPG.call(_current.moveChange, [currBtn, nextBtn, dir]);
    };

    /**
     * 执行改变前的回调
     * @param direction
     * @private
     */
    var _onBeforeMoveChange = function (direction) {
        var currBtn = _current;
        if (currBtn && currBtn.beforeMoveChange) {
            return LMEPG.call(currBtn.beforeMoveChange, [direction.toLowerCase(), currBtn]);
        }
    };

    /**
     * 按钮状态切换
     * @private
     */
    var _update = function (nextBtn) {
        _previous = _current;
        _current = nextBtn;
        // 更新上一个按钮状态
        _setFocusStates(_previous, 'backgroundImage', false);
        // 更新下一个按钮状态
        _setFocusStates(_current, 'focusImage', true);

    };

    /**
     * 封装按钮状态
     * @param btnObj
     * @param img
     * @param bol
     * @private
     */
    var _setFocusStates = function (btnObj, img, bol) {
        // 当bol=true避免二次查询该节点
        var btnEl = btnObj ? bol ? _currentElement : G(btnObj.id) : null;
        if (!btnEl) return; // 不存在更新按钮返回
        if (btnObj[img]) { // 存在设置的图片路径
            if (btnObj.type === BUTTON_TYPE_DIV) {
                btnEl.style.backgroundImage = 'url(' + btnObj[img] + ')';
            } else {
                btnEl.src = btnObj[img];
            }
        }
        LMEPG.call(btnObj.focusChange, [btnObj, bol]);
    };

    /**
     * 获取注册的方向按键事件后缀
     * @param code
     * @returns {string}
     * @private
     */
    var _getDirection = function (code) {
        var keys = LMEPG.KEM.getKeys();
        for (var i in keys) {
            if (window[i] === code) {
                return i.slice(i.indexOf('_') + 1);
            }
        }
    };

    return {

        /**
         * 初始化话按键管理器
         * @param focusId  默认按钮，字符串(目前只用到字符串)
         * @param buttons  定义好的按钮数组
         * @param isInitKeys 是否使用默认的按键处理器。
         */
        init: function (focusId, buttons, isInitKeys) {
            _setDefaultKeyEvent(isInitKeys);
            this.addButtons(buttons);
            _current = _buttons[focusId]; // 初始化按钮
            _currentElement = G(focusId); // 初始化DOM节点
            _update(_current);
        },

        /**
         * 设置按键事件是否暂停（可恢复）
         * isPause true:暂停按键事件；false:按键事件正常使用
         */
        setKeyEventPause: function (isPause) {
            _isKeyEventPause = isPause;
            return isPause;
        },
        /**
         * 如果button为对象，则增加单个button.
         * 如果buttons是多个button按钮组成的数组，则增加多个button
         * @param buttons
         */
        addButtons: function (buttons) {
            // 如果添加的是单个则转化为数组统一处理
            if (is(buttons, 'object')) {
                buttons = [buttons];
            }
            // 添加的按钮为数组
            if (is(buttons, 'array')) {
                var i = buttons.length;
                while (i--) {
                    var setBtn = buttons[i];
                    if (setBtn.id) {
                        // 初始化可获得焦点引用参数
                        if (setBtn.focusable === undefined) {
                            setBtn.focusable = true;
                        }
                        _buttons[setBtn.id] = setBtn;
                    }
                }
            }
        },

        /**
         * 删除button，如果buttonId是一个单独的按钮,转换为数组统一处理
         * 如果buttonId是一个buttonId的数组，删除一组button.
         * @param btnId
         */
        deleteButtons: function (btnId) {
            if (is(btnId, 'string')) {
                btnId = [btnId];
            }
            if (is(btnId, 'array') && _buttons[btnId]) {
                var i = btnId.length;
                while (i--) {
                    delete _buttons[btnId];
                }
            }
        },

        /**
         * 请求获得焦点
         * @param buttonId 按钮Id
         */
        requestFocus: function (buttonId) {
            var btn = this.getButtonById(buttonId);
            if (btn && btn.focusable) {
                _currentElement = G(btn.id);
                _update(btn);
            }
        },
        /*取当前按钮对象*/
        getCurrentButton: function () {
            if (_current) {
                var id = _current.id;
                return this.getButtonById(id);
            }
        },

        /*获取上一个焦点按钮对象*/
        getPreviousButton: function () {
            if (!_previous) {
                //按钮不存在，不做任何处理
                return;
            }
            var id = _previous.id;
            return this.getButtonById(id);
        },

        /**
         * 通过按钮Id获得按钮对象
         * @param id
         */
        getButtonById: function (id) {
            if (isExist(id)) {
                var btn = _buttons[id];
                //如果按钮配置了disable:true，那么视作这个按钮不存在
                if (btn && btn.disabled !== true) {
                    return btn;
                }
            }
            return null;
        },
        /*返回设置的有效按钮集合*/
        getButtons: function () {
            return _buttons;
        }
    };
}();

LMEPG.ajax = function () {
    return {
        /**
         * 请求
         * @param url
         * @param data
         * @param onSuccess
         * @param onError
         * @param asy
         */
        postAPI: function (url, data, onSuccess, onError, asy) {

            LMEPG.ajax.post({
                url: LMEPG.ajax.getAppRootPath() + '/index.php/Api/' + url,
                requestType: 'POST',
                dataType: 'json',
                asy: asy,
                data: data,
                success: function (xhr, rsp) {
                    LMEPG.call(onSuccess, [rsp]);
                },
                error: onError || function () {
                    console.error('Ajax request error! ');
                }
            });
        },

        /** 发起post请求 */
        post: function (config) {
            var url = config.url;
            var type = config.requestType || 'POST';
            var contentType = config.contentType || 'application/x-www-form-urlencoded';
            var dataType = config.dataType || 'json';
            var headers = config.headers || [];
            var asy = config.asy || true;
            var fnSuccess = config.success;
            var fnError = config.error;

            var xhr = this.createXMLHttp();
            /** 监听请求状态改变 */
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var rsp = xhr.responseText || xhr.responseXML;
                    if (dataType === 'json' && typeof rsp === 'string') {
                        rsp = JSON.parse(rsp);
                    }
                    if (xhr.status === 200) {
                        LMEPG.call(fnSuccess, [xhr, rsp]);
                    } else {
                        LMEPG.call(fnError, [xhr, rsp]);
                    }
                }
            };
            xhr.open(type, url, asy);
            this.send(xhr, headers, contentType, config.data);
        },

        /** 创建请求实体 */
        createXMLHttp: function () {
            // eslint-disable-next-line no-undef
            return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        },

        /** 发送数据 */
        send: function (xhr, headers, type, data) {

            for (var i = headers.length; i--;) {
                xhr.setRequestHeader(headers[i].name, headers[i].value);
            }
            xhr.setRequestHeader('Content-Type', type);
            if (typeof data === 'object' && type === 'application/x-www-form-urlencoded') {
                var str = '';
                for (var k in data) {
                    str += k + '=' + data[k] + '&';
                }
                data = str.slice(0, str.length - 1);
            }
            xhr.send(data);
        },

        /** 获取访问页面路径 */
        getBasePagePath: function (pageName, onCallback) {
            var config = {};
            config.url = this.getAppRootPath() + '/index.php/Home/AjaxServer/getBasePagePath';
            config.dataType = 'json';
            config.data = {
                'page_name': pageName
            };
            config.success = function (xhr, data) {
                LMEPG.call(onCallback, [pageName, data]);
            };
            config.error = function () {
                LMEPG.call(onCallback, [pageName, '']);
            };
            LMEPG.ajax.post(config);
        },

        /** 得到Ajax服务地址的路径 */
        getAjaxServerPagePath: function (funcName) {
            return this.getAppRootPath() + '/index.php/Home/AjaxServer/' + funcName;
        },

        getAppRootPath: function () {
            var appRootPath = this.getCookie('c_app_root_path');
            if (!appRootPath || appRootPath.indexOf('http') < 0) {
                appRootPath = '';
            }
            return appRootPath;
        },
        /**
         * 设置cookie
         * @param cname：存储的键
         * @param cvalue：存储的值
         * @param exdays：存储的时间
         */
        setCookie: function (cname, cvalue, exdays) {
            exdays = exdays || 30;// 默认存储30天
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = 'expires=' + d.toUTCString();
            document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
        },
        /**
         * 获取设置的cookie
         * @param cname
         * @returns {string}
         */
        getCookie: function (cname) {
            var name = cname + '=';
            var cay = document.cookie.split(';');
            var len = cay.length;
            while (len--) {
                var c = cay[len];
                if (c.charAt(0) === ' ') c = c.substring(1);
                if (c.indexOf(name) === 0) {
                    return decodeURIComponent(c.substring(name.length, c.length));
                }
            }
            return '';
        },
        /**
         * 上报心包，统计用户在线情况
         */
        sendHeartbeat: function () {
            var url = LMEPG.ajax.getAjaxServerPagePath('heartbeat');
            LMEPG.ajax.post({
                url: url,
                requestType: 'GET',
                error: function () {
                    var uploadImgElement = G('upload-heart-beat');
                    if (uploadImgElement) {
                        uploadImgElement.src = url;
                    } else {
                        var img = document.createElement('img');
                        img.id = 'upload-heart-beat';
                        img.src = url;
                        img.style.visibility = 'hidden';//图片必须隐藏
                        document.body.appendChild(img);
                    }
                }
            });
        },
        /**
         * 启动统计循环
         */
        uploadLooper: function () {
            (function sendHeartbeat() {
                try {
                    LMEPG.ajax.sendHeartbeat();
                    var timer = setTimeout(sendHeartbeat, 60000);
                    console.info(timer);
                } catch (e) {
                    console.error(e.toString());
                }
            })();  //1分钟上报一次心跳。
        }
    };
}();

/**
 * 事件监听
 */
LMEPG.Framework = function () {

    return {
        looper: function () {
            LMEPG.Framework.eventLooper();   // 启动事件监听
            LMEPG.ajax.uploadLooper(); // 启动统计管理
        },

        //事件处理
        eventHandler: function (event) {

            event = event || window.event;
            var keyCode = event.which || event.keyCode || event.charCode;
            if (keyCode === KEY_VIRTUAL_EVENT) {
                LMEPG.call(LMEPG.Framework.onVirtualEvent, [keyCode]);
            } else {
                LMEPG.call(LMEPG.Framework.onEvent, [keyCode, event]);
            }
        },

        onEvent: function (keyCode, event) {
            var codeNumber = LMEPG.Framework.transferKeyCode(keyCode);
            keyCode = codeNumber !== keyCode ? codeNumber : keyCode;
            //阻止浏览器的默认按键功能
            if (event) {
                var isDefined = window.isPreventDefault;
                if (isDefined) {
                    if (isDefined !== false) {
                        event.preventDefault();
                    }
                } else {
                    event.preventDefault();
                }
            }

            if (LMEPG.onEvent) {
                LMEPG.onEvent(keyCode);
            } else {
                console.warn('没有初始化或初始化未完成！');
            }
        },

        /*转换盒子不一样键码*/
        transferKeyCode: function (keyCode) {

            switch (keyCode) {
                case KEY_BACK_640:
                    keyCode = KEY_BACK;
                    break;
                case KEY_LEFT_65:
                    keyCode = KEY_LEFT;
                    break;
                case KEY_RIGHT_68:
                    keyCode = KEY_RIGHT;
                    break;
                case KEY_UP_87:
                    keyCode = KEY_UP;
                    break;
                case KEY_DOWN_83:
                    keyCode = KEY_DOWN;
                    break;
                case KEY_VOL_UP_61:
                    keyCode = KEY_VOL_UP;
                    break;
                case KEY_VOL_DOWN_45:
                    keyCode = KEY_VOL_DOWN;
                    break;
                case KEY_MUTE_67:
                    keyCode = KEY_MUTE;
                    break;
            }
            return keyCode;
        },

        /*获取第三方库注册特殊键位*/
        onVirtualEvent: function () {
            //虚拟按键事件
            var isInv = window.Utility;
            if (isInv) {
                var oEvent = isInv.getEvent();
                if (!LMEPG.onEvent) LMEPG.onEvent(oEvent.type, true);
            }
        },

        /*启动事件循环*/
        eventLooper: function () {
            if (window.debug) {
                document.onkeydown = LMEPG.Framework.eventHandler;
            } else {
                document.onkeypress = LMEPG.Framework.eventHandler;
            }
        }
    };
}();
LMEPG.Framework.looper();
