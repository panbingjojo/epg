
/**
 *desc: IPTV前端js工具类
 *ps：若使用该组件请不要添加诸如mlmcid 、carrid等区域判断的工具函数在这里面
 *author: xiaofei.jian
 *@2019-07-25 09:44
 */

(function (win, doc, lmepg) {
    /**
     * 注册全局变量LMUtils命名空间
     */
    win.LMUtils = win.lmUtils = win.lmutils = {
        o_extend: o_extend,
        o_mix: o_mix,
        o_entrust: o_entrust,
        roll: roll,                                 // 滚动方案(带滚动条)
        dom: dom(),                                 // dom 操作方案
        marquee: marquee(),                         // 原生marquee标签滚动
        browserSize: getBrowserSize(),              // 获取自定义的浏览器尺寸
        substrByOmit: substrByOmit,                 // 特殊字符结尾
        getLocationString: getLocationString,       // 获取浏览器搜索地址参数
        shuffle: shuffle,                           // 随机打乱数组函数
        browserDetails: browserDetails,             // 获取浏览器信息
        colorRandom: colorRandom,                   // 随机颜色
        fade: fade,                                 // 淡入淡出工具
        getRandom: numRandom,                       // 获取两个数字之间的随机数字
        listenKey: listenKey,                       // 监听特殊数字键值执行功能
        onceFn: onceFn,                             // 调用只执行一次函数
        getStyle: getStyle,                         // 获取外联样式值
        forceEventBack: forceEventBack              // 模拟事件机制失效返回（当盒子支持addEventListener）
    };


    /*单例继承*/
    function o_extend(o) {
        function F() {
        }

        F.prototype = o;
        return new F();
    }

    /*对象浅复制*/
    function o_mix(to, _from) {
        for (var key in _from) {
            to[key] = _from[key];
        }
        return to;
    }

    /*寄生继承*/
    function o_entrust(p, o) {
        var prototype = o_extend(o.prototype);
        prototype.constructor = p;
        p.prototype = prototype;
    }

   /*调用只执行一次函数*/
    var signs = true;

    function onceF(fn) {
        if (fn && signs) {
            signs = false;
            fn.call(null, arguments);
        }
    }

    /*函数执行一次*/
    function onceFn(fn) {
        var called = false;

        return function () {
            if (!called) {
                called = true;
                fn.apply(this, arguments);
            }
        };
    }

   /*函数补丁*/
    Function.prototype.before = function (fn) {
        var _this = this;
        return function () {
            fn.apply(this, arguments);
            return _this.apply(this, arguments);
        };
    };

    /*获取设置的窗口尺寸*/
    function getBrowserSize() {
        var innerContent = '';
        var metaEl = doc.getElementsByTagName('meta')[0];
        if (metaEl.content) {
            innerContent = metaEl.content;
        } else {
            innerContent = metaEl.getAttribute('content');
        }
        return innerContent === '1280*720' ? 'hd' : 'sd';
    }

    /**
     * 强制返回如果支持监听
     * 避免焦点方案不生效从而使应用宕机
     */
    function forceEventBack() {
        doc.addEventListener('keydown', function (e) {
            if (e.which === KEY_BACK) history.go(-1);
        });
    }

    /**
     * 监听特殊数字键值执行功能
     * 注意：起始位置键要相同
     * 调用示例：LMUtils.listenKey(7,[KEY_7, KEY_7, KEY_9, KEY_7], function () {
        console.log('ok123');
    });
     */
    function listenKey(start, keyArray, fn) {
        var startKey = 'KEY_' + start;
        var useKey = keyArray.join('');
        var listenToDo = function () {
            var keys = lmepg.KeyEventManager.getKeyCodes();
            // 获取键值起始索引
            keys = keys.slice(keys.length - keyArray.length).join('');
            if (keys == useKey) {
                fn.call(null, arguments);
            }
        };

        onceF(function () {
            lmepg.KeyEventManager.addKeyEvent(startKey, listenToDo);
        });
    }

    /**
     * dom操作
     * 删除dom
     * className增、删、改、查
     */
    function dom() {

        return {
            removeSelf: function (el) {
                el.parentNode.removeChild(el);
            },

            removeElement: function (_element) {
                if (_element !== null) {
                    var _parentElement = _element.parentNode;
                    if (_parentElement) {
                        _parentElement.removeChild(_element);
                    }
                }
            },

            hasClass: function (el, cls) {
                return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
            },

            addClass: function (el, cls) {
                var oldCls = el.className;
                if (!this.hasClass(el, cls)) {
                    el.className = oldCls + ' ' + cls;
                }
            },

            removeClass: function (el, cls) {
                if (this.hasClass(el, cls)) {
                    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)', 'gi');
                    el.className = el.className.replace(reg, ' ');
                }
            },

            toggleClass: function (el, cls) {
                return this.hasClass(el, cls) ? this.removeClass(el, cls) : this.addClass(el, cls);
            }
        };
    }

    /**
     * 移动工具函数
     * @param scrollBarId: 滚动条ID
     * @param scrollId: 滚动槽ID
     * @param wrapId: 内容块ID
     * @param moveH: 每次单位移动距离
     * @returns {{move: move, up: up, down: down}}
     * 调用示例：var roll = Roll('scroll-bar', 'scroll-wrap', 'desc-wrap', 20, 10);
     */
    function roll(scrollBarId, scrollId, wrapId, moveH) {

        var knobEl = doc.getElementById(scrollBarId);
        var rollEl = doc.getElementById(scrollId);
        var wrapEl = doc.getElementById(wrapId);
        var H_roll = rollEl.offsetHeight;
        var H_wrap = wrapEl.offsetHeight;
        var H_knob = knobEl.offsetHeight;
        if (H_wrap < H_roll) {
            // 内容块没有溢出删除滚动UI
            this.dom.removeSelf(rollEl);
            return;
        }
        // 滚动条移动单位长度
        var U_roll = moveH;
        // 内容块移动单位长度
        var U_wrap = parseInt(H_wrap * U_roll / (H_roll - H_knob));
        // 滚动条移动变数
        var N_roll = 0;
        // 内容块移动变数
        var N_wrap = 0;
        // 动态设置滚动条按钮高度
        return {
            up: function (fn) {
                if (N_roll <= 0) {
                    // 滚动条触顶执行回调
                    fn && fn.apply(null, arguments);
                } else {
                    N_roll -= U_roll;
                    N_wrap += U_wrap;
                    this.move();
                }
            },
            down: function (fn) {
                if (N_roll >= H_roll - H_knob) {
                    // 滚动条触底执行回调
                    fn && fn.apply(null, arguments);
                } else {
                    N_roll += U_roll;
                    N_wrap -= U_wrap;
                    this.move();
                }
            },
            move: function () {
                // 部分盒子不支持top/left的负值，故使用marginTop
                knobEl.style.marginTop = N_roll + 'px';
                wrapEl.style.marginTop = N_wrap + 'px';
            }
        };
    }

    /**
     * 特殊符号结尾工具函数
     * @param str: 字符串
     * @param len: 截取长度
     * @param suf: 结尾后缀
     * @returns {string|*}
     */
    function substrByOmit(str, len, suf) {

        if (str.length <= len) return str;
        var suffix = suf ? suf : '...';
        var subStr = str.slice(0, len);
        return subStr + suffix;
    }

    /**
     * 获取浏览器跳转设置的参数
     * @param name
     * @returns {*}
     */
    function getLocationString(name) {

        var searchString = win.location.search.replace('?', '');
        var stageArray = searchString.split('&');
        var objData = {};
        var len = stageArray.length;
        while (len--) {
            var item = stageArray[len];
            var eqIndex = item.indexOf('=');
            var key = item.slice(0, eqIndex);
            objData[key] = item.slice(eqIndex + 1);
        }
        return objData[name];
    }

    /**
     * 随机打乱数组顺序
     * @param array
     * @returns {*}
     */
    function shuffle(array) {
        return array.sort(function () {
            return Math.random() - 0.5;
        });
    }

    /**
     * 获取浏览器对象字符串信息
     * @returns {string}
     */
    function browserDetails() {
        var nag = win.navigator;
        var browserObjToStr = '';
        for (var x in nag) {
            if (typeof nag[x] == 'string') {
                browserObjToStr += x + ':' + nag[x] + '\n<br/>';
            }
        }
        return browserObjToStr;
    }

    /**
     * 随机颜色
     * @returns {string}
     */
    function colorRandom() {
        var r = numRandom(0, 255);
        var g = numRandom(0, 255);
        var b = numRandom(0, 255);
        return '#' + toSeize(r) + toSeize(g) + toSeize(b);
    }

    /**
     * 转换十六进制工具
     * @param num
     * @returns {string}
     */
    function toSeize(num) {
        var currSeize = (num).toString(16);
        return currSeize.length >= 2 ? currSeize : '0' + currSeize;
    }

    /**
     * 获取n到m的一个随机整数
     * @param m: 始
     * @param n：末
     * @returns {number}
     */
    function numRandom(m, n) {
        return parseInt(Math.random() * (n - m + 1) + m);
    }

    /**
     * 元素淡入淡出效果
     * @param fn：回调
     * @param e: 元素
     * @param n：起始透明度0或1
     * @param c：定时器间隔
     */
    function fade(fn, e, n, c) {
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
    }

    /**
     * a.得失焦点文字滚动切换:
     * @param obj：传入滚动使用参数,
     * @param bol：传入标记,
     * LMUtils.marquee.start({el: btnElement, len: nameLen, txt: txt},true)
     *
     * b.没有事件驱动文本滚动:
     * 调用示例->LMUtils.marquee.start({txt:txt,len:200,dir:'up',vel:3})
     */
    function marquee() {

        var _option = {};
        return {
            start: function (obj, bol) {
                _option = obj;
                _option.bol = bol;
                // 得到焦点或失去焦点没有达到限制长度直接返回
                if (obj.txt.length < obj.len) return obj.txt;
                var htm = '<marquee ' +
                    'style="float:left;width:100%;height:100%" ' +
                    // 滚动速度
                    'scrollamount="' + obj.vel + '" ' +
                    // 滚动方式（如来回滚动、从左至右滚动）
                    'behavior="' + obj.way + '" ' +
                    // 滚动方向
                    'direction="' + obj.dir + '">' +
                    obj.txt +
                    '</marquee>';
                if (bol) {
                    obj.el.innerHTML = htm;
                } else {
                    // 返回没有事件驱动文本滚动
                    return htm;
                }
            },
            stop: function (fn) {
                if (!_option.el) return;
                _option.el.innerHTML = _option.bol ? substrByOmit(_option.txt, _option.len) : _option.txt;
                fn && fn.apply(null, arguments);
            }
        };
    }

    /**
     * 获取外联样式值
     * @param el
     * @param attr
     * @returns {number}
     */
    function getStyle(el, attr) {
        if (el.currentStyle) {
            return parseInt(el.currentStyle[attr]);
        } else {
            return parseInt(getComputedStyle(el, null)[attr]);
        }
    }

    /**
     * 弹框组件
     * @type {{hide: LMUtils.dialog.hide, showToast: LMUtils.dialog.showToast, showWaiting: LMUtils.dialog.showWaiting}}
     */
    LMUtils.dialog = (function () {

        var timer = null;
        var commonWrapEl = G('id_common_dialog');

        /**
         * 创建弹框容器
         * @param content：创建的内容
         * @param cls: 样式类名
         * @returns {boolean}
         */
        var createDialogContainer = function (content, cls) {
            if (commonWrapEl) return true;
            commonWrapEl = doc.createElement('div');  //创建显示控件
            commonWrapEl.id = 'id_common_dialog';
            commonWrapEl.className = cls;
            commonWrapEl.innerHTML = content;
            doc.body.appendChild(commonWrapEl);
        };

        /**
         * 初始化共用参数
         * @param content：创建的内容
         * @param cls: 样式类名
         */
        var initParam = function (content, cls) {
            timer && clearTimeout(timer);
            lmepg.BM.setKeyEventPause(true);
            if (createDialogContainer(content, cls)) {
                commonWrapEl.className = cls;
                commonWrapEl.innerHTML = content;
            }
            S(commonWrapEl);
        };

        /**
         * 定时消失弹框
         * @param sed：传过来的时间
         * @param second：超时时间
         * @param fn：时间结束回调
         */
        var timeoutCallBack = function (sed, second, fn) {
            timer = setTimeout(function () {
                if (sed) {
                    LMUtils.dialog.hide(fn);
                } else {
                    // 超时消失提示
                    LMUtils.dialog.showToast('等待已超时！', 2);
                }
            }, second);
        };

        return {
            /**
             * 显示加载框
             * @param sed：显示秒数（可选,若没有传递second,超时为20秒）
             * @param msg：显示信息（可选）
             * @param fn：回调（可选）
             * 调用示例：LMUtils.dialog.showWaiting(3);
             */
            showWaiting: function (sed, msg, fn) {
                var maxSed = 20000; // 限定超时
                msg = !msg ? '' : msg;
                var second = !sed ? maxSed : sed * 1000;
                var cls = LMUtils.browserSize === 'hd' ? 'hd_waiting_dialog' : 'sd_waiting_dialog';
                initParam(msg, cls);
                timeoutCallBack(sed, second, fn);
            },
            /**
             * 显示提示消息
             * @param msg：显示信息（必须）
             * @param sed：显示秒数（可选如果没有传递,超时为最大10秒）
             * @param fn：回调（可选）
             */
            showToast: function (msg, sed, fn) {
                var maxSed = 10000; // 限定超时
                var second = !sed ? maxSed : sed * 1000;
                var cls = LMUtils.browserSize === 'hd' ? 'hd_message_dialog' : 'sd_message_dialog';
                initParam(msg, cls);
                timeoutCallBack(sed, second, fn);
            },

            /**
             * 隐藏弹框
             * @param fn
             */
            hide: function (fn) {
                if (commonWrapEl) {
                    timer && clearTimeout(timer);
                    H(commonWrapEl);
                    lmepg.BM.setKeyEventPause(false);
                    typeof fn === "function" && fn();
                }
            }
        };
    }());

    /**
     * 验证组件
     */
    LMUtils.verify = (function () {
        return {
            // 判断对象是否为空
            isNullObj: function (obj) {
                for (var i in obj) {
                    return false;
                }
                return true;
            },

            isTel: function (num) {
                var telReg = /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147)|(145))\d{8}$/;
                return telReg.test(num);
            },

            /** 判断手机号码是否有效
             * @param num 手机号码
             */
            isValidTel: function (num) {
                //手机号正则
                var phoneReg = /^1[34578]\d{9}$/;
                return phoneReg.test(num);
            }
        };
    }());

}(window, document, LMEPG));

