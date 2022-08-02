!function(win) {
    function page_dom_init() {
        try {
            var gz_dom = $("#gz_order_warp");
            gz_dom.length > 0 ? $("#gz_order_warp").show() : ($("body").append('<div id="gz_order_warp" class="gz-order-warp"><div id="gz_pay_loading" style="display: block"><img src="' + _comom_url + 'image/gz_pay_loading.gif"></div></div>'),
            load_img(_comom_url + "image/gz_repay_bg.png"),
            load_img(_comom_url + "image/gz_repay_tips_bg.png"),
            load_img(_comom_url + "image/gz_protocol_bg.png"))
        } catch (e) {
            alert("pay.js 加载失败")
        }
    }
    function load_css(url) {
        var head = document.head || document.getElementsByTagName("head")[0]
          , node = document.createElement("link");
        node.rel = "stylesheet",
        node.href = url,
        head.appendChild(node)
    }
    function showLoading() {
        $("#gz_pay_loading").show(),
        pay_loading = !0
    }
    function hideLoading(now) {
        clearTimeout(timer);
        var time = now ? 0 : 300;
        timer = setTimeout(function() {
            $("#gz_pay_loading").hide(),
            pay_loading = !1
        }, time)
    }
    function is_function(func) {
        return "function" == typeof func
    }
    function is_undefined(func) {
        return "undefined" == typeof func
    }
    function str_to_float(value) {
        return parseFloat(value)
    }
    function data_combine(arg_0, arg_1) {
        arg_0 && "object" == typeof arg_0 || (arg_0 = arg_1);
        for (var item in arg_1)
            arg_1.hasOwnProperty(item) && (arg_0[item] = arg_1[item])
    }
    function clone(arg_1) {
        var arg_0 = {};
        for (var item in arg_1)
            arg_1.hasOwnProperty(item) && (arg_0[item] = arg_1[item]);
        return arg_0
    }
    function init_bind_key() {
        var _e_method = "onkeydown";
        !window.starcorExt && Utility && "undefined" == typeof android && (_e_method = "onkeypress"),
        is_function(_old_key_event) || (_old_key_event = document[_e_method]),
        document[_e_method] = null,
        document[_e_method] = bind_event
    }
    function bind_event(event) {

        var e = event || window.event || arguments.callee.caller.arguments[0]
          , _code = e.which || e.keyCode;

        LMEPG.Log.info("bind_event --- >_code " + _code);
        if (is_return)
            return void _old_key_event.call(this, e);
        if (_code) {
            switch (_code) {
            case 640:
            case 27:
            case 8:
                e.key_name = "esc";
                break;
            case 37:
                e.key_name = "left";
                break;
            case 39:
                e.key_name = "right";
                break;
            case 13:
                e.key_name = "enter";
                break;
            case 38:
                e.key_name = "up";
                break;
            case 40:
                e.key_name = "down";
                break;
            default:
                is_function(_old_key_event) && _old_key_event.call(this, e)
            }
            if (renew_pay_loading)
                return;
            if (pay_loading && "esc" != e.key_name)
                return;
            pay_loading && "esc" == e.key_name && hideLoading(),
            ef.bind_key(e.key_name);
            try {
                e.preventDefault(),
                e.stopPropagation()
            } catch (e) {}
            return !1
        }
    }
    function load_img(src) {
        var html = '<div  style="display:none;position: absolute;overflow: hidden; z-index: -9999; left: 0px; top: 0px; width: 100%; height: 100%; background:url(' + src + ') no-repeat"></div>';
        $("body").append(html)
    }
    function order_pay_channel(data) {
        for (var pay_platform = ["gft_pay", "weixin_pay", "alipay"], __channelList = [], i = 0, len = data.length; i < len; i++) {
            var pay_platform_id = data[i].pay_platform_id
              , __idx = pay_platform.indexOf(pay_platform_id);
            __idx !== -1 ? pay_platform[__idx] = data[i] : __channelList.push(data[i])
        }
        return __channelList.concat(pay_platform)
    }
    function ercode_create(pay_platform_id, _num) {
        var __id = gz_pay.pay_state + "_channel__" + _num
          , map = {
            weixin_pay: {
                name: "微信",
                c_id: "wx"
            },
            alipay: {
                name: "支付宝",
                c_id: "alipay"
            },
            gft_pay: {
                name: "贵服通",
                c_id: "gft_pay"
            }
        }
          , name = map[pay_platform_id].name || ""
          , c_id = map[pay_platform_id].c_id || ""
          , _id = "gz_ercode_" + pay_platform_id
          , _class = "pay-er-item-" + _num
          , _src = _comom_url + "image/gz_" + c_id + ".png"
          , html = '<div id="' + __id + '" class="pay-er-item ' + _class + '"><div class="pay-er-icon"> <img src="' + _src + '" alt=""> </div> <div class="pay-er-img"> <img  class="er-img-pos ' + _id + '" src="" alt=""></div> <div class="pay-er-btn "> <div class="er-btn-v">我已' + name + "扫码</div> </div></div>";
        if (1 !== _num) {
            var className = "er-line-" + _num;
            html = '<div class="er-line ' + className + '"></div>' + html
        }
        return html
    }
    function createAgreement(id, title, contentText) {
        var html = '<div id="' + id + '" class="protocol-layer"> <p class="protocol-title">' + title + '</p> <div id="' + id + '_content" class="protocol-content"> <div id="' + id + '_main" class="protocol-main">' + contentText + '</div> </div> <div class="protocol-process"> <div class="protocol-bar-warp" id="' + id + '__0"><div class="protocol-bar"></div></div> </div> ';
        return html
    }
    function pay_tips_create(data, state) {
        var html = "";
        switch (state) {
        case 1:
            html = '<p  class="order-success">' + (data.tips_mess || "恭喜您，购买成功") + "</p>";
            break;
        case 2:
            html = '<p  class="pay-order-fail order-fail">' + (data.tips_mess || "很抱歉，该订单未支付") + '</p> <p class="pay-order-fail order-fail-mess">订单编号：<span  class="order-fail-num">' + (data.order_num || "") + "</span></p> ";
            break;
        case 3:
            html = '<p  class="order-success lous-success">' + (data.tips_mess || "恭喜您，白条支付成功") + '</p><p class="pay-order-bar order-bar-1">您当前白条账单为<span class="lous-order-money">' + (data.order_money || "") + '</span>元</p><p class="pay-order-bar order-bar-2">请记得于<span >' + (data.order_time || "") + "</span>前还款哟</p>";
            break;
        case 4:
            html = '<p  class="pay-order-fail order-bar-3 order-fail">' + (data.tips_mess || "很抱歉，您的白条功能受限，请先还款") + '</p> <p class="pay-order-fail order-fail-mess">您当前白条账单总额为：<span class="bar_money">' + (data.order_money || "0") + "</span>元</p> "
        }
        return html
    }
    function lous_balance_timeout(data, time) {
        clearTimeout(_l_b_timer),
        _l_b_timer = setTimeout(function() {
            is_undefined(gz_pay.balance) ? lous_balance_timeout(data, 10) : (set_repay_btn_commom(data.nns_order_price),
            hideLoading())
        }, time)
    }
    function lous_channel_timeout(time, _order_price) {
        clearTimeout(_l_c_timer),
        _l_c_timer = setTimeout(function() {
            var _data = gz_pay.channel;
            if ("" == _data)
                lous_channel_timeout(10, _order_price);
            else {
                if (0 == _data.length)
                    return void gz_pay.render_repay_tips({
                        tips: "支付渠道获取失败，请重试"
                    });
                gz_pay.channel = {},
                gz_pay.render_ercode("repay", _data),
                set_repay_btn_commom(_order_price)
            }
        }, time)
    }
    function set_repay_btn_commom(order_price) {
        if (repay_btnset_times++,
        2 == repay_btnset_times) {
            var pay_money = str_to_float(order_price)
              , can_pay = pay_money <= gz_pay.balance
              , btn_name = can_pay ? "钱袋充足 立即还款" : "钱袋余额不足 请扫码还款";
            $("#repay_big_btn").html(btn_name),
            $("#repay_balance").html(gz_pay.balance);
            var _len = ef.all_area.repay_channel.len
              , _idx = !can_pay && _len > 1 ? 1 : 0;
            "repay_channel" == ef.focused_id && ef.set_focus("repay_channel", _idx)
        }
    }
    function _common_func_init() {
        2 == req_time && gz_pay.pay_method_select(!1, function(state) {
            gz_pay.isAutoRenew && 1 === state ? $("#pay_renew_tips").show() : gz_pay.isAutoRenew = !1,
            hideLoading()
        })
    }
    var $ = function() {
        function myjQuery_extend() {
            for (var target_obj = arguments[0], idx = 1; idx < arguments.length; ++idx) {
                var src_obj = arguments[idx];
                for (var name in src_obj)
                    target_obj[name] = src_obj[name]
            }
            return target_obj
        }
        function myjQuery(selector, context) {
            context || (context = document);
            var result = new base_myjQueryObject;
            switch ("undefined" != typeof selector || "object" != typeof context && "function" != typeof context || "number" != typeof context.length || myjQuery.fn.each.apply(context, [function(idx, item, array) {
                "object" == typeof item && item.__myjQuery == myjQuery ? item.each(function(idx, item) {
                    this.push(item)
                }, result) : item !== myjQuery.novalue && result.push(item)
            }
            ]),
            typeof selector) {
            case "object":
                result.push(selector);
                break;
            case "function":
                var myjqOnLoad = myjQuery(document).data("__myjQueryOnLoad");
                myjqOnLoad || (myjqOnLoad = [],
                myjQuery(document).data("__myjQueryOnLoad", myjqOnLoad),
                document.onreadystatechange = function() {
                    if ("complete" == document.readyState) {
                        var myjqOnLoad = myjQuery(this).data("__myjQueryOnLoad");
                        for (var idx in myjqOnLoad)
                            try {
                                myjqOnLoad[idx].apply(this)
                            } catch (e) {}
                    }
                }
                ),
                myjqOnLoad.push(selector);
                break;
            case "string":
                if ("<" == selector.charAt(0)) {
                    var create_tag = /^<(\w+)\s*\/?>$/i.exec(selector);
                    if (create_tag && create_tag[1]) {
                        result.push(document.createElement(create_tag[1]));
                        break
                    }
                    var create_tag_ctx = document.createElement("div");
                    return myjQuery(create_tag_ctx).html(selector).children()
                }
                if ("function" == typeof context.querySelectorAll) {
                    for (var elements = context.querySelectorAll(selector), idx = 0; idx < elements.length; ++idx)
                        result.push(elements[idx]);
                    break
                }
                switch (selector.charAt(0)) {
                case "#":
                    var target_id = selector.substr(1);
                    try {
                        var element = context.getElementById(target_id);
                        element && result.push(element)
                    } catch (e) {
                        for (var elements = context.getElementsByTagName("*"), idx = 0; idx < elements.length; ++idx) {
                            var element = elements[idx];
                            element.id == target_id && result.push(element)
                        }
                    }
                    break;
                case ".":
                    for (var class_name = selector.substr(1), all_elements = context.getElementsByTagName("*"), idx = 0; idx < all_elements.length; ++idx) {
                        var element = all_elements[idx]
                          , class_list = element.classList;
                        if (class_list)
                            class_list.contains(class_name) && result.push(element);
                        else {
                            var cur_class_names = element.className.toLowerCase().match(/(\S+)/g);
                            if (cur_class_names)
                                for (var class_index = 0; class_index < cur_class_names.length; ++class_index)
                                    if (cur_class_names[class_index] == class_name) {
                                        result.push(element);
                                        break
                                    }
                        }
                    }
                    break;
                default:
                    for (var elements = context.getElementsByTagName(selector), idx = 0; idx < elements.length; ++idx)
                        result.push(elements[idx])
                }
            }
            return result
        }
        function is_undefined(val) {
            return "undefined" == typeof val
        }
        function is_function(val) {
            return "function" == typeof val
        }
        function is_object(val) {
            return "object" == typeof val
        }
        function is_plain_object(val) {
            return !!is_object(val)
        }
        function is_array(val) {
            return "array" == typeof val
        }
        function is_empty_object(val) {
            for (var name in val)
                return !1;
            return !0
        }
        function is_jquery_object(val) {
            return "object" == typeof val && val.__myjQuery === myjQuery
        }
        function is_string(val) {
            return "string" == typeof val
        }
        function is_numeric(val) {
            return !isNaN(parseFloat(obj)) && isFinite(obj)
        }
        function is_ie() {
            return navigator.userAgent.indexOf("MSIE") > 0
        }
        function getStyle(obj, attr) {
            var ie = !1;
            return "backgroundPosition" == attr && ie ? obj.currentStyle.backgroundPositionX + " " + obj.currentStyle.backgroundPositionY : obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, null)[attr]
        }
        myjQuery_extend(myjQuery, {
            extend: myjQuery_extend,
            isArray: is_array,
            isObject: is_object,
            isPlainObject: is_plain_object,
            isEmptyObject: is_empty_object,
            isUndefined: is_undefined,
            isFunction: is_function,
            isNumeric: is_numeric,
            isString: is_string,
            type: function(val) {
                return typeof val
            },
            each: function(func, data) {
                for (var idx = 0; idx < this.length; ++idx)
                    try {
                        var _b = !0;
                        if (_b = data ? func.apply(data, [idx, this[idx], this]) : func.apply(this[idx], [idx, this[idx], this]),
                        _b === !1)
                            break
                    } catch (e) {}
                return this
            },
            novalue: {},
            empty: function() {
                return myjQuery.html.apply(this, [""])
            },
            remove: function() {
                this.parentNode.removeChild(this)
            },
            height: function() {
                var rect = this.getBoundingClientRect()
                  , height = 0;
                return height = rect && !is_undefined(rect.height) ? rect.height : this.clientHeight
            },
            width: function() {
                var rect = this.getBoundingClientRect()
                  , width = rect && !is_undefined(rect.width) ? rect.width : this.clientWidth;
                return width
            },
            html: function(html) {
                return is_undefined(html) ? this.innerHTML : (this.innerHTML = html,
                myjQuery(this))
            },
            text: function() {
                return is_ie() ? function(text) {
                    return is_undefined(text) ? this.innerText : (this.innerText = text,
                    myjQuery(this))
                }
                : function(text) {
                    return is_undefined(text) ? this.textContent : (this.textContent = text,
                    myjQuery(this))
                }
            }(),
            css: function(key, value) {
                if (is_undefined(value)) {
                    if (!is_object(key))
                        return this.style[key];
                    for (var name in key)
                        this.style[name] = key[name];
                    return myjQuery(this)
                }
                return this.style[key] = value,
                myjQuery(this)
            },
            show: function() {
                var _c = "block";
                "none" === this.style.display && (this.style.display = "");
                var __vt = getStyle(this, "display");
                return "none" !== __vt && "" !== __vt ? myjQuery(this) : ("string" == typeof this.__v_t && "" !== this.__v_t.replace(/^\s*|\s*$/g, "") && (_c = this.__v_t),
                myjQuery.css.apply(this, ["display", _c]))
            },
            hide: function() {
                var __v_t = getStyle(this, "display");
                return __v_t && "block" !== __v_t && "none" !== __v_t && (this.__v_t = __v_t),
                myjQuery.css.apply(this, ["display", "none"])
            },
            attr: function(key, value) {
                var values;
                if (is_undefined(value)) {
                    if (!is_object(key)) {
                        if (value = this.getAttribute(key),
                        null == value)
                            return;
                        return value
                    }
                    values = key
                } else
                    values = {},
                    values[key] = value;
                for (var name in values)
                    value = values[name],
                    key = name,
                    null === value ? this.removeAttribute(key) : this.setAttribute(key, value);
                return myjQuery(this)
            },
            removeAttr: function(key) {
                return this.hasAttribute(key) && this.removeAttribute(key),
                myjQuery(this)
            },
            append: function(selector) {
                if (!is_jquery_object(selector)) {
                    var target = myjQuery(selector);
                    selector = target
                }
                if (selector.length) {
                    for (var idx = 0; idx < selector.length; ++idx)
                        this.appendChild(selector[idx]);
                    return selector
                }
                return null
            },
            removeClass: function(class_names) {
                if ("undefined" == typeof class_names)
                    return this.className = "",
                    myjQuery(this);
                var org_class = this.className
                  , test_class = {};
                org_class.replace(/\b([-\w\d]+)\b/g, function(name) {
                    test_class[name] = !0
                }),
                class_names.replace(/\b([-\w\d]+)\b/g, function(name) {
                    delete test_class[name]
                });
                var result_class = [];
                for (var name in test_class)
                    result_class.push(name);
                return this.className = result_class.join(" "),
                myjQuery(this)
            },
            addClass: function(class_names) {
                var org_class = this.className
                  , test_class = {};
                class_names.replace(/\b([-\w\d]+)\b/g, function(name) {
                    test_class[name] = !0
                }),
                org_class.replace(/\b([-\w\d]+)\b/g, function(name) {
                    test_class[name] = !0
                });
                var result_class = [];
                for (var name in test_class)
                    result_class.push(name);
                return this.className = result_class.join(" "),
                myjQuery(this)
            },
            hasClass: function(class_names) {
                var org_class = this.className
                  , test_class = {};
                class_names.replace(/\b([-\w\d]+)\b/g, function(name) {
                    test_class[name] = !0
                }),
                org_class.replace(/\b([-\w\d]+)\b/g, function(name) {
                    delete test_class[name]
                });
                for (var name in test_class)
                    return !1;
                return !0
            },
            data: function(key, value) {
                var __my_jq_data = this.__my_jq_data;
                return is_undefined(__my_jq_data) && (__my_jq_data = {},
                this.__my_jq_data = __my_jq_data),
                "undefined" != typeof value ? (__my_jq_data[key] = value,
                myjQuery(this)) : __my_jq_data[key]
            },
            val: function(value) {
                return is_undefined(value) ? this.value : (this.value = value,
                myjQuery(this))
            },
            parent: function() {
                return myjQuery(this.parentElement)
            },
            click: function(func) {
                if (is_function(func))
                    return myjQuery.bind.apply(this, ["click", func]);
                var e = document.createEvent("MouseEvent");
                return e.initMouseEvent("click", !1, !0),
                this.dispatchEvent(e),
                myjQuery(this)
            },
            mouseover: function(func) {
                return is_function(func) ? myjQuery.bind.apply(this, ["mouseover", func]) : myjQuery.fire.apply(this, ["mouseover"])
            },
            mouseout: function(func) {
                return is_function(func) ? myjQuery.bind.apply(this, ["mouseout", func]) : myjQuery.fire.apply(this, ["mouseout"])
            },
            bind: function(event_name, data, func) {
                return is_undefined(func) && (func = data,
                data = void 0),
                is_function(func) && this.addEventListener(event_name, function(e) {
                    e.data = data,
                    func.apply(this, [e])
                }),
                myjQuery(this)
            },
            unbind: function(event_name) {
                return this.removeEventListener(event_name),
                myjQuery(this)
            },
            fire: function(event_name) {
                return this.fireEvent(event_name),
                myjQuery(this)
            },
            find: function(selector) {
                return myjQuery(selector, this)
            },
            filter: function(selector) {
                switch (typeof selector) {
                case "function":
                    if (selector(this))
                        return myjQuery(this);
                    break;
                case "string":
                    switch (selector.charAt(0)) {
                    case "#":
                        var target_id = selector.substr(1);
                        if (this.id == target_id)
                            return myjQuery(this);
                        break;
                    case ".":
                        var class_name = selector.substr(1)
                          , class_list = this.classList;
                        if (class_list) {
                            if (class_list.contains(class_name))
                                return myjQuery(this);
                            break
                        }
                        var cur_class_names = this.className.toLowerCase().match(/(\S+)/g);
                        if (cur_class_names)
                            for (var class_index = 0; class_index < cur_class_names.length; ++class_index)
                                if (cur_class_names[class_index] == class_name)
                                    return myjQuery(this);
                        break;
                    default:
                        if (this.nodeName.toLowerCase() == selector.toLowerCase())
                            return myjQuery(this)
                    }
                }
                return null
            },
            children: function(selector) {
                return is_undefined(selector) ? myjQuery(void 0, this.children) : myjQuery(void 0, this.children).filter(selector)
            },
            clone: function() {
                return myjQuery(this.cloneNode(!0)).attr("id", "")
            },
            prepend: function(selector) {
                if (!is_jquery_object(selector)) {
                    var target = myjQuery(selector);
                    selector = target
                }
                if (selector.length) {
                    for (var idx = selector.length; idx > 0; )
                        --idx,
                        this.firstChild ? this.insertBefore(selector[idx], this.firstChild) : this.insertBefore(selector[idx]);
                    return selector
                }
                return null
            },
            appendTo: function(selector) {
                if (!is_jquery_object(selector)) {
                    var target = myjQuery(selector);
                    selector = target
                }
                return selector.length && selector[0].appendChild(this),
                myjQuery(this)
            }
        });
        var root_myjQueryObject = function() {};
        root_myjQueryObject.prototype = [];
        var base_myjQueryObject = function() {};
        base_myjQueryObject.prototype = new root_myjQueryObject,
        myjQuery_extend(base_myjQueryObject.prototype, {
            each: myjQuery.each,
            __myjQuery: myjQuery
        }),
        myjQuery.fn = base_myjQueryObject.prototype;
        for (var name in myjQuery)
            if (is_function(myjQuery[name]) && "each" != name) {
                var get_proxy_func = function(op_name) {
                    return function() {
                        for (var args = [], op_func = this.__myjQuery[op_name], idx = 0; idx < arguments.length; ++idx)
                            args.push(arguments[idx]);
                        var ret_vals = new base_myjQueryObject
                          , drop_object = !1;
                        if (this.each(function(idx, element, myjQueryObj) {
                            var ret = op_func.apply(element, args);
                            null === ret ? drop_object = !0 : ret !== myjQuery.novalue && ret_vals.push(ret)
                        }),
                        drop_object)
                            return myjQuery(void 0, ret_vals);
                        switch (ret_vals.length) {
                        case 0:
                            return this;
                        case 1:
                            return ret_vals[0]
                        }
                        return myjQuery(void 0, ret_vals)
                    }
                };
                base_myjQueryObject.prototype[name] = get_proxy_func(name)
            }
        return myjQuery
    }()
      , _comom_url = cpcom_config.pay_resource_url || "../"
      , pay_loading = !0
      , renew_pay_loading = !1
      , protocol_main_text = '  本协议是在贵广网络上符合相应条件并可以使用信用付款服务的注册用户（以下简称“用户”）与贵州省广播电视信息网络股份有限公司及其关联公司（以下简称为 “广电网络”）之间就用户购买贵广网络所销售的商品或所提供的服务，并可以依据本协议就该商品可以进行分期或延期付款相关事宜所订立的契约，请用户仔细阅读本服务协议，点击 " 同意并开通 " 按钮后，本协议即构成对双方有约束力的法律文件。本协议中提及的应由贵广网络行使的权利和履行的义务，由“贵广网络”内部负责相应区域及业务范围的公司分别履行。用户在接受本协议前应明确对于贵广网络进行如下授权：<br>一、授权贵广网络、贵州广电网络公司、或由该网及该公司委托的第三方通过合法渠道了解、咨询、审查用户的个人资信状况，财务状况和其他与评定用户信用付款额度及 付款能力有关的信息；并可以索取、留存和使用该等信息以及用户在京东网站所提供的个人资料，同时有权向协议规定的有关方（包括但不限于京东公司以及网银在 线（北京）科技有限公司（下称“网银在线”）等）披露与用户相关的任何信息，以便给予用户最大限度的信用付款额度，为用户使用信用付款服务提供最大程度的 便利。<br>二、用户的京东账户、密码和（或）数字证书是京东识别用户身份及指令的唯一标志，所有使用用户京东账户、密码和（或）数字证书的操作即为用户的（授权）操 作行为，任何使用用户的京东账户、密码和（或）数字证书发送至京东系统或者网银在线系统的使用“信用付款服务”或“支付”的指令构成用户不可撤销的授权指 示，京东网站、京东公司或网银在线对于依照该指示进行的操作行为及其结果不承担任何责任。用户接受本协议即表明确认知悉京东制定的关于使用信用付款服务的所有规定，接受京东制订的全部收费项目和条件，以及京东公布的任何与延后付款或分期付款有关的条款约束并遵守本协议及其后之修订版本 。第一条 术语定义除非本协议正文另有明确所指，在本协议中所用下列术语定义如下： <br>（一）平台规则：指标示在京东网站之上的，与用户使用京东网站所提供的平台服务有关的任何规范性文件，包括但不限于购物流程、售后政策、退款说明等，同时包括京东就信用付款服务制定的特别规则，以下统称“平台规则”。<br>（二）信用付款服务：指京东网站所有者及平台运营者（以下统称“京东网站”）为符合条件的用户根据京东所提供的“先购物 、后付款”的信用赊购方式的平台服务。“赊购方式付款”指用户在京东消费时，可依据平台规则及相应申请流程，享受由京东提供的相应的延后付款或分期付款的付款方式'
      , renew_main_text = '<p>欢迎使用自动续费扣款服务（以下简称“本服务”），为了保障付费用户的权益，请在使用本服务之前，详细阅读此协议（以下简称“本协议”）所有内容，未成年人则应在法定监护人陪同下阅读。</p><p>您对本服务的开通、使用即视为您已阅读并自愿接受本服务协议的所有内容，即表示已经与贵广网络公司达成协议，并自愿接受本协议的所有内容。</p>第一条 服务说明<p>1.1 在您已开通本服务的前提下，您购买的贵广网络线上增值业务在付费会员有效期到期时， 委托贵广网络支付渠道从您的CA卡账号中扣取下一个计费周期包月费。</p><p>1.2 自动续费：贵广网络通过第1.1条所述账户收取付费会员下一计费周期包月费，并将款项记入付费会员支付记录，同时相应延长付费会员有效期的扣费方式。因上述账户中可扣款余额不足导致的续费失败，视为放弃自动续费服务，您可在下次登录时继续购买或选择自动续费功能。</p><p>1.3 您选择贵广网络CA账户支付渠道享受本服务，将视为同意贵广网络发出扣款指令，并同意贵广网络在不验证用户信息的情况下从上述账户扣划下一个计费周期的包月费。</p>第二条 自动续费使用规则<p>2.1 如您开通本服务，则视为您授权贵广网络在您购买的增值业务会员即将到期时，从您的CA卡账户中代扣一个月计费周期的会员费用，具体扣费节点为每个计费周期到期前的24小时。</p><p>2.2 如在扣费过程出现差错，贵广网络和您应密切配合查明原因，各自承担己方过错造成的损失。</p><p>2.3 您选择使用本服务后，除非您选择终止本服务或账户余额不足，否则，您对贵广网络公司的自动续费委托为不可撤销，贵广网络公司基于本服务在您开通自动续费服务时选择的支付方式下所扣划的费用。</p><p>2.4 若在自动续费日之前，您所订购的业务会员包月服务价格发生调整，贵广网络公司将在机顶盒首页公示修改内容，并按现时有效的价格扣划。</p><p>2.5 贵广网络公司对您开通本服务不收取任何手续费，但贵广网络公司有权根据业务需要或市场变化等原因决定是否调整自动续费周期，并在相关页面进行公告。</p><p>2.6 贵广网络公司向您提供的本服务仅限于您在贵广网络互动平台使用，任何以恶意破解等非法手段规避续费而使用付费会员服务的，均构成对本协议的违反。由此引起的一切法律后果由行为人负责，贵广网络公司将依法追究行为人的法律责任。</p>第三条 服务中止、中断及终止<p>3.1 除非贵广网络公司另有通知、公告，本服务将长期有效。本协议自您选择接受或使用本服务后生效，直至您终止本服务时终止。</p><p>3.2 出现下列情况之一的，贵广网络公司有权立即终止向您提供服务，且无须为此向您或任何第三方承担责任：</p><p>（1）经国家行政或司法机关的生效法律文书确认您存在违法或侵权行为，或者贵广网络公司根据自身的判断，认为您的行为涉嫌违反本协议内容，或涉嫌违反法律法规的规定的；</p><p>（2）您的行为干扰了贵广网络双向互动平台任何部分或功能的正常运行；</p><p>（3）贵广网络公司认为向您提供本服务存在重大风险的。</p><p>3.3 贵广网络公司根据自身商业决策等原因可能会选择中止、中断及中止本服务。如有此等情形发生，贵广网络公司会采取公告的形式通知您。</p><p>3.4 您有权随时终止本服务，终止后，贵广网络公司将停止向您提供本服务。</p><p>终止方法：<p>（1）您可到就近的贵广网络营业厅选择终止本服务</p><p>（2）您可拨打贵广网络服务热线96789终止本服务</p>第四条 服务协议的接受和修订<p>本协议及相关服务条款如由于业务发展需要进行修订的，贵广网络公司将在贵广网络双向互动平台等公布。您可前往查阅最新版协议条款。在贵广网络公司修改上述条款后，如果您不接受修改后的条款，您可以选择终止使用自动续费服务。您继续使用本服务的，将被视为已接受了修改后的协议。</p>第五条 其他约定<p>5.1 法律与争议解决：本协议适用中华人民共和国的法律，并且排除一切冲突法规定的适用。如出现纠纷，您和贵广网络公司一致同意将纠纷提交相关机构进行仲裁。仲裁裁决是终局的，对双方都有约束力。仲裁费用由败诉一方承担。</p><p>5.2 贵广网络公司不行使、未能及时行使或者未充分行使本协议或者按照法律规定所享有的权利，不应被视为放弃该权利，也不影响贵广网络公司在将来行使该权利。</p><p>5.3 如果用户对本条款内容有任何疑问，请拨打我们的客服热线：96789。</p><p style="text-align: right;margin:15px 15px 0 0">贵州省广播电视信息网络股份有限公司</p>'
      , first_init = !0;
    load_css(_comom_url + "pay.css");
    var timer = null
      , _old_key_event = null
      , is_return = !0
      , gz_pay = {
        warp_dom: "",
        isAutoRenew: !1,
        hasSelectedRenew: !1,
        product_info: {},
        product_mess: {},
        pay_order_mess: {},
        repay_order_mess: {},
        page_list: [],
        lous_times: -9999,
        lous_max_times: 0,
        pay_method_state: -1,
        channel: {},
        btn_state: 0,
        page_index: 1,
        page_size: 200,
        pay_state: "pay",
        btn_state: 0,
        lous_list: [],
        er_channel: "",
        lous_obj: {
            size: 5,
            total_index: 0,
            index: 0
        }
    };
    gz_pay.show_warp = function() {
        "none" != gz_pay.warp_dom[0].style.display || is_return || gz_pay.warp_dom.show()
    }
    ,
    gz_pay.create_pay_warp = function(html) {
        var dom = $("#gz_payment");
        dom.length > 0 ? dom.append(html) : gz_pay.warp_dom.append('<div id="gz_payment" class=" gz-payment"><div class="pay-logo"></div>' + html + "</div>")
    }
    ,
    gz_pay.create_pay_channel = function() {
        var _id = "pay_channel"
          , dom = $("#" + _id)
          , html = ""
          , pay_title = "您正在订购" + gz_pay.product_mess.name
          , pay_money = gz_pay.pay_order_mess.order_money || 0
          , _balance = gz_pay.balance || 0
          , _btn_name = "";
        if (gz_pay.pay_method_state != -1) {
            var state = gz_pay.pay_method_state;
            _btn_name = ["钱袋充足 立即支付", "余额不足 使用白条支付", '<span class="lous_icon"></span>余额不足 白条使用受限'][state - 1]
        }
        dom.length > 0 ? ($("#pay_er_warp").html(""),
        $("#pay_title").html(pay_title),
        $("#pay_money").html(pay_money),
        $("#pay_balance_v").html(_balance),
        $("#pay_btn_v").html(_btn_name || ""),
        $("#pay_renew_tips").hide(),
        $("#pay_renew_tips__0").removeClass("selected-item")) : (html = '<div id="pay_channel" class="pay-channel-item pay-channel"><div class="pay-message"><div class="balance-mess"><p>您的钱袋余额</p><p class="balance-value"><span id="pay_balance_v" >' + _balance + '</span>元</p></div><div class="order-mess"><p id="pay_title" class="pay-title">' + pay_title + '</p><p class="pay-money">您本次消费应支付的金额为<span class="pay-money-value" id="pay_money">' + pay_money + '</span>元</p><div id="pay_channel__0" class="pay-btn"><div id="pay_btn_v" class="pay-btn-v">' + (_btn_name || "") + '</div></div><div id="pay_renew_tips" class="pay-renew-tips disnon"><div id="pay_renew_tips__0" class="pay-renew-box"><div class="pay-renew-selected"></div></div><div class="pay-renew-box-label">自动续费</div><div id="pay_renew_tips__1" class="pay-renew-agree-d"><div class="pay-renew-agree-f"></div></div></div><div class="pay-tips"><p>*请在本页面任意选择一种支付方式进行支付即可</p><p>*使用白条支付的用户请仔细阅读弹出的白条协议</p><p>*使用微信或支付宝支付的用户，在手机支付完成后请点击对应按钮刷新购买状态</p></div></div></div><div id="pay_er_warp" class="pay-er-warp er-warp"></div></div>',
        gz_pay.create_pay_warp(html)),
        gz_pay.floor_top(_id)
    }
    ,
    gz_pay.render_ercode = function(type, list) {
        var _id = type + "_er_warp"
          , $dom = $("#" + _id)
          , html = ""
          , pay_platform = "pay" === type ? ["gft_pay", "weixin_pay", "alipay"] : ["weixin_pay", "alipay"]
          , _num = 1;
        $dom.hide().html(""),
        gz_pay.er_channel = [];
        for (var data = order_pay_channel(list), i = 0, len = data.length; i < len; i++) {
            var pay_platform_id = data[i].pay_platform_id || "";
            if (pay_platform_id) {
                var __idx = pay_platform.indexOf(pay_platform_id);
                if (__idx !== -1)
                    gz_pay.er_channel.push(pay_platform_id),
                    gz_pay.channel[pay_platform_id] = data[i],
                    html = ercode_create(pay_platform_id, _num),
                    _num++,
                    $dom.append(html),
                    gz_pay.er_code_scan(pay_platform_id);
                else {
                    var _id = data[i].mode.id || pay_platform_id;
                    gz_pay.channel[_id] = data[i]
                }
            }
        }
        4 === _num && $dom.addClass("more-pay-channel"),
        ef.update_area({
            id: type + "_channel",
            len: _num
        }),
        $dom.show(),
        cancel_polling = !1,
        _num > 1 && gz_pay.check_order()
    }
    ,
    gz_pay.render_ercode_2 = function(type) {
        var _id = type + "_er_warp"
          , $dom = $("#" + _id)
          , html = ""
          , _num = 1
          , data = gz_pay.er_channel;
        $dom.hide().html("");
        for (var i = 0, len = data.length; i < len; i++) {
            var pay_platform_id = data[i];
            "gft_pay" !== pay_platform_id && (html = ercode_create(pay_platform_id, _num),
            _num++,
            $dom.append(html),
            gz_pay.er_code_scan(pay_platform_id))
        }
        ef.update_area({
            id: type + "_channel",
            len: len + 1
        }),
        $dom.show(),
        cancel_polling = !1,
        _num > 1 && gz_pay.check_order()
    }
    ,
    gz_pay.render_pay_tips = function(data) {
        data = data || {};
        var state = data.state || 1;
        gz_pay.btn_state = state;
        var _class = "pay_result_" + state
          , _id = "prompt_layer_pay"
          , $dom = $("#" + _id)
          , _title = data.title || "贵广网络提示您";
        if ($dom.length > 0)
            $("#pay_tips_title").html(_title),
            $("#prompt_layer_mess").html(pay_tips_create(data, state)),
            $dom[0].className = "prompt-layer-pay " + _class;
        else {
            var html = '<div id="prompt_layer_pay" class="prompt-layer-pay ' + _class + '"> <p id="pay_tips_title" class="prompt-layer-title">' + _title + '</p><div id="prompt_layer_mess" class="prompt-layer-mess"> ' + pay_tips_create(data, state) + '</div><div id="prompt_layer_pay__0" class="prompt-layer-btn"> <div class="prompt-layer-btn-f"></div> </div> </div>';
            gz_pay.create_pay_warp(html)
        }
        gz_pay.floor_top(_id),
        ef.set_focus(_id, 0),
        hideLoading()
    }
    ,
    gz_pay.render_auto_renew = function(state) {
        var _id = "renew_protocol_layer"
          , dom = $("#" + _id)
          , isScan = 0 === state;
        if (pro_obj.reset_index(_id),
        dom.length > 0) {
            pro_obj.reset_height();
            var className = isScan ? "addClass" : "removeClass";
            $("#protocol_btn_warp")[className]("protocol-btn-warp-1"),
            gz_pay.floor_top(_id),
            ef.update_area({
                id: _id,
                len: isScan ? 2 : 3
            }),
            ef.set_focus(_id, 0)
        } else {
            var className = isScan ? "protocol-btn-warp-1" : ""
              , html = createAgreement(_id, "贵广网络自动续费协议", renew_main_text) + '<div id="protocol_btn_warp" class="protocol-btn-warp ' + className + '"><div id="renew_protocol_layer__1" class="protocol-btn-item protocol-btn-0 "><div class="protocol-btn"></div></div> <div id="renew_protocol_layer__2" class="protocol-btn-item protocol-btn-1"><div class="protocol-btn"></div></div> </div></div>';
            gz_pay.create_pay_warp(html)
        }
        gz_pay.floor_top(_id),
        ef.update_area({
            id: _id,
            len: isScan ? 2 : 3
        }),
        ef.set_focus(_id, 0)
    }
    ,
    gz_pay.render_bar_protocol = function() {
        var _id = "protocol_layer"
          , dom = $("#" + _id);
        if (pro_obj.reset_index(_id),
        dom.length > 0)
            pro_obj.reset_height(0),
            gz_pay.floor_top(_id),
            ef.set_focus(_id, 0);
        else {
            var html = createAgreement(_id, "广网络白条协议", protocol_main_text) + '<div id="protocol_layer__1" class="protocol-btn-item protocol-btn-ng "><div class="protocol-btn">不接受</div></div> <div id="protocol_layer__2" class="protocol-btn-item protocol-btn-g"><div class="protocol-btn"></div></div> </div>';
            gz_pay.create_pay_warp(html)
        }
        gz_pay.floor_top(_id),
        ef.set_focus(_id, 0)
    }
    ,
    gz_pay.create_repay_warp = function(html) {
        var dom = $("#gz_repayment");
        return dom.length > 0 ? void dom.append(html) : void gz_pay.warp_dom.append('<div id="gz_repayment" class="gz-repayment">' + html + "</div>")
    }
    ,
    gz_pay.render_list_warp = function() {
        var _id = "white_bar_list"
          , dom = $("#" + _id);
        if (dom.length > 0)
            $("#bar_list_body").html(""),
            $("#repay_money").text(gz_pay.lous_total_money),
            $("#bar_total").text(gz_pay.lous_obj.total_index || 1);
        else {
            var html = '<div id="white_bar_list" class="white-bar-list"><div class="bar-icon"></div><p class="repay-mess">白条账单总额：<span id="repay_money" class="repay-money">' + gz_pay.lous_total_money + '</span><span style="font-size: 21px">元</span></p><div class="bar-list-table"><div class="bar-list-head"><span class="bar-mess-1">白条产品信息</span><span class="bar-mess-2">打白条时间</span><span class="bar-mess-3">订单编号</span><span class="bar-mess-4">金额 ( 元 )</span><span class="bar-mess-5">操作</span></div><div id="bar_list_body" class="bar-list-body"></div></div> <div class="bar-page-size"><span id="bar_current" class="bar-current"></span>/<span id="bar_total">' + (gz_pay.lous_obj.total_index || 1) + "</span></div></div>";
            gz_pay.create_repay_warp(html)
        }
        gz_pay.floor_top(_id)
    }
    ,
    gz_pay.render_repay_channel = function(data) {
        var _id = "repay_channel"
          , dom = $("#" + _id)
          , html = ""
          , pay_money = str_to_float(data.nns_order_price)
          , btn_name = "";
        if (!is_undefined(gz_pay.balance)) {
            var can_pay = pay_money <= gz_pay.balance;
            btn_name = can_pay ? "钱袋充足 立即还款" : "钱袋余额不足 请扫码还款"
        }
        dom.length > 0 ? ($("#repay_big_btn").html(btn_name),
        $("#repay_balance").html(gz_pay.balance || ""),
        $("#repay_order_money").html(pay_money),
        $("#repay_order_num").html(data.nns_pay_order_id),
        $("#repay_er_warp").html("")) : (html = '<div  id="repay_channel" class="repay-outer-warp"><img class="bg_url" src="' + _comom_url + 'image/gz_repay_bg.png" alt=""><div class="pay-channel-item repay-channel"><div class="pay-message"><p class="repay-title">请选择还款方式</p><div class="repay-order-mess"><p class="repay-order-title">您还款的订单为<span id="repay_order_num" class="repay-order-num">' + data.nns_pay_order_id + '</span><span class="repay-money-title">应还金额</span><span id="repay_order_money" class="repay-order-money">' + data.nns_order_price + '</span>元</p><p class="repay-balance">您当前的钱袋余额为<span id="repay_balance" class="repay-balance-value">' + (gz_pay.balance || "") + '</span>元</p><div id="repay_channel__0" class="pay-btn"><div id="repay_big_btn" class="pay-btn-v">' + btn_name + '</div></div><div class="pay-tips"><p>*请在本页面选择一种支付方式进行还款即可</p><p>*使用微信或支付宝支付的用户，在手机支付完成后请点击对应按钮刷新还款状态</p><p>*还款成功可恢复对应的白条使用次数</p> </div> </div>  </div><div id="repay_er_warp" class="pay-er-warp er-warp"></div></div></div>',
        gz_pay.create_repay_warp(html)),
        ef.focused_id = _id,
        gz_pay.floor_top(_id, !0)
    }
    ,
    gz_pay.render_repay_tips = function(data) {
        data = data || {};
        var _id = "prompt_layer_repay"
          , dom = $("#" + _id)
          , state = data.state || 1
          , tips = data.tips_mess || (1 == state ? "恭喜您，还款成功" : "很抱歉，该订单未支付")
          , _class = "pay_result_" + state;
        if (dom.length > 0) {
            if (1 == state)
                $("#repay_success_title").html(tips);
            else {
                $("#repay_fail_title").html(tips);
                var _num = data.order_num || "";
                $("#order_fail_num").text(_num)
            }
            dom[0].className = "prompt-layer-repay " + _class
        } else {
            var html = '<div id="prompt_layer_repay" class="prompt-layer-repay ' + _class + '"><img class="bg_url" src="' + _comom_url + 'image/gz_repay_tips_bg.png" alt=""><div class="repay-tips-mess"><p id="repay_success_title" class="order-success">' + tips + '</p><p id="repay_fail_title" class="order-fail pay-order-fail">' + tips + '</p><p class="order-fail-mess pay-order-fail">订单编号：<span id="order_fail_num" class="order-fail-num">' + (data.order_num || "") + '</span></p><div id="prompt_layer_repay__0" class="prompt-layer-btn"><div class="prompt-layer-btn-f"></div></div></div></div>';
            gz_pay.create_repay_warp(html)
        }
        ef.set_focus(_id),
        gz_pay.floor_top(_id, !0),
        hideLoading()
    }
    ,
    gz_pay.create_pay_loading = function() {
        var _id = "pay_loading"
          , dom = $("#" + _id)
          , html = "";
        dom.length > 0 ? $("#pay_loading").show() : (html = '<div id="pay_loading" class="pay-loading"><div class="pay-loading-icon"><img src="' + _comom_url + '/image/gz_renew_pay_loading.gif"></div><p class="pay-loading-tips">订单支付中，请稍后...</p></div>',
        gz_pay.create_pay_warp(html)),
        gz_pay.floor_top(_id)
    }
    ,
    gz_pay.create_order = function(__product, callback) {
        starcorCom.create_order(__product, function(res) {
            return 0 != res.result.state ? (gz_pay.render_pay_tips({
                tips_mess: "订单创建失败，请重试 [" + res.result.state + "]"
            }),
            void gz_pay.show_warp()) : (gz_pay.pay_order_mess = {
                order_id: res.pay_order.id,
                order_money: str_to_float(res.buy_order.order_total_price),
                product_id: res.buy_order.product_id
            },
            void callback())
        })
    }
    ,
    gz_pay.boss_pay = function(order_id, callback) {
        var type = gz_pay.pay_state
          , is_pay = "pay" == type
          , _order = gz_pay[type + "_order_mess"];
        if (gz_pay.balance < _order.order_money)
            return void gz_pay["render_" + type + "_tips"]({
                tips_mess: '<span class="balance_low">钱袋余额不足 请使用其他方式' + (is_pay ? "支付" : "还款") + "</span>"
            });
        var _channel = gz_pay.channel.wallet_payment
          , params = {
            order_id: order_id || gz_pay[type + "_order_mess"].order_id,
            channel_id: _channel.id,
            mode_id: _channel.mode.id
        };
        clearTimeout(_check_timeout),
        starcorCom.boss_pay(params, function(res) {
            var data = {
                state: 1
            }
              , _state = res.result.state;
            is_function(callback) && callback(),
            0 != _state ? (data.tips_mess = is_pay ? "很抱歉，支付失败 [" + res.result.state + "]" : "很抱歉，还款失败 [" + res.result.state + "]",
            hideLoading()) : (gz_pay.update_balance(_order.order_money),
            is_pay ? gz_pay.pay_success_call(gz_pay.pay_success_event) : gz_pay.update_lous_list(_order.order_money),
            gz_pay.page_list.pop(),
            gz_pay.pay_success = !0,
            hideLoading()),
            gz_pay["render_" + type + "_tips"](data)
        })
    }
    ,
    gz_pay.renew_boss_pay = function() {
        renew_pay_loading = !0,
        gz_pay.create_pay_loading();
        var params = gz_pay.product_info
          , _channel = gz_pay.channel.wallet_payment;
        _channel.id && (params.nns_channel_id = _channel.id),
        _channel.mode && _channel.mode.id && (params.nns_mode_id = _channel.mode.id),
        params.nns_partner_id = _channel.partner_id || cpcom_config.nns_partner_id,
        params.nns_auto_renew_flag = 1,
        starcorCom.request("N60_A", params, function(res) {
            return 0 != res.result.state ? (renew_pay_loading = !1,
            gz_pay.render_pay_tips({
                tips_mess: "订购失败，请重试 [" + res.result.state + "]"
            }),
            gz_pay.reset_renew_tips(),
            void gz_pay.show_warp()) : void gz_pay.boss_pay(res.pay_order.id, function() {
                renew_pay_loading = !1,
                gz_pay.reset_renew_tips()
            })
        })
    }
    ,
    gz_pay.reset_renew_tips = function() {
        gz_pay.hasSelectedRenew = !1,
        $("#pay_renew_tips__0").removeClass("selected-item")
    }
    ,
    gz_pay.update_lous_btn = function() {
        gz_pay.pay_method_select(!0, function() {})
    }
    ,
    gz_pay.er_code_scan = function(_c_type) {
        var params = {}
          , type = gz_pay.pay_state;
        data_combine(params, gz_pay[type + "_order_mess"]);
        var _channel = gz_pay.channel[_c_type];
        params.channel_id = _channel.id,
        params.mode_id = _channel.mode.id;
        var _id = "gz_ercode_" + _c_type;
        return function(_id) {
            "gft_pay" === _c_type ? gz_pay.gft_pay(params, function(res) {
                if (0 == res.result.state) {
                    var $dom = $("pay" == gz_pay.pay_state ? "#gz_payment" : "#gz_repayment");
                    $("." + _id, $dom[0])[0].src = res.qrcode_url
                }
            }) : starcorCom[_c_type + "_scan"](params, function(res) {
                if (0 == res.result.state) {
                    var $dom = $("pay" == gz_pay.pay_state ? "#gz_payment" : "#gz_repayment");
                    $("." + _id, $dom[0])[0].src = res.qrcode_url
                }
            })
        }(_id)
    }
    ;
    var _check_timeout = null
      , cancel_polling = !1;
    gz_pay.check_order = function(type) {
        function _fail_common(resp, order_id) {
            cancel_polling = !0,
            is_check ? gz_pay.push_layer(_state + "_channel") : hideLoading(),
            gz_pay["render_" + _state + "_tips"]({
                state: 2,
                order_num: order_id
            })
        }
        type = type || "check_order";
        var _state = gz_pay.pay_state
          , _order = gz_pay[_state + "_order_mess"]
          , order_id = _order.order_id
          , product_id = "pay" == _state ? gz_pay.product_mess.id : _order.product_id
          , is_check = "check_order" == type;
        cancel_polling = !1,
        clearTimeout(_check_timeout),
        is_check || showLoading(),
        starcorCom[type](order_id, product_id, function(resp) {
            "310001" == resp.data.status ? (cancel_polling = !0,
            "repay" == _state ? (gz_pay.push_layer("repay_channel"),
            gz_pay.update_lous_list(_order.order_money)) : gz_pay.pay_success_call(gz_pay.pay_success_event),
            gz_pay.page_list.pop(),
            gz_pay.pay_success = !0,
            gz_pay["render_" + _state + "_tips"](),
            pay_loading = !1) : "310002" == resp.data.status ? _fail_common(resp, order_id) : 0 == resp.result.state ? is_check ? _check_timeout = setTimeout(function() {
                cancel_polling || gz_pay.check_order("check_order")
            }, 3e3) : (gz_pay["render_" + _state + "_tips"]({
                state: 2,
                order_num: order_id
            }),
            pay_loading = !1) : _fail_common(resp, order_id)
        })
    }
    ,
    gz_pay.gft_pay = function(order_data, callback) {
        starcorCom.request("N60_A", {
            nns_func: "gzgd_gft_pay",
            nns_order_id: order_data.order_id,
            nns_channel_id: order_data.channel_id,
            nns_mode_id: order_data.mode_id,
            nns_money: order_data.order_money,
            nns_product_id: order_data.product_id
        }, function(_pay_resp) {
            callback(_pay_resp)
        })
    }
    ,
    gz_pay.lous_pay = function() {
        var _id = gz_pay.pay_order_mess.order_id
          , params = {
            nns_order_id: _id,
            nns_channel_id: gz_pay.channel.lous_payment.id,
            nns_mode_id: gz_pay.channel.lous_payment.mode.id
        };
        clearTimeout(_check_timeout),
        starcorCom.lous_pay(params, function(res) {
            if (0 == res.result.state) {
                gz_pay.page_list.pop(),
                gz_pay.pay_success = !0;
                var _data = res.lous_info || res.result.data || res
                  , _time = _data.repayment_time.slice(0, 10).replace(/-/g, ".");
                gz_pay.render_pay_tips({
                    state: 3,
                    order_time: _time,
                    order_money: _data.lous_price
                }),
                gz_pay.pay_success_call(gz_pay.pay_success_event)
            } else
                gz_pay.render_pay_tips({
                    tips_mess: "很抱歉，支付失败，[" + (res.result.sub_state || res.result.state) + "]"
                });
            hideLoading()
        })
    }
    ,
    gz_pay.get_channel_list = function(product_id, callback) {
        starcorCom.get_pay_channel_list(product_id, function(res) {
            var _data = res.channel_list || [];
            0 != res.result.state && (_data = []),
            is_function(callback) && callback(_data)
        }, !0)
    }
    ,
    gz_pay.get_balance = function(callback) {
        starcorCom.get_balance(function(res) {
            var _balance = 0;
            3e5 == res.state && (_balance = res.balance || 0),
            gz_pay.balance = str_to_float(_balance, 10),
            is_function(callback) && callback(_balance)
        })
    }
    ,
    gz_pay.get_lous_usage = function(callback) {
        starcorCom.get_lous_usage(function(res) {
            var times = 0;
            if (0 == res.result.state) {
                var _type = "single" == gz_pay.product_mess.type ? "single" : "cycle_and_combine";
                try {
                    times = res.lous_usage[0][_type].lous_left || 0,
                    gz_pay.lous_max_times = res.lous_usage[0][_type].lous_all || 0
                } catch (e) {}
            }
            callback(parseInt(times, 10))
        })
    }
    ,
    gz_pay.get_lous_list = function(callback) {
        var _this = gz_pay
          , params = {
            nns_lous_state: 1,
            nns_page_index: _this.page_index,
            nns_page_size: _this.page_size
        };
        starcorCom.get_lous_list(params, function(res) {
            if (0 == res.result.state) {
                var _res = res.lous_info
                  , _lous_list = _res.lous_list;
                if (_lous_list)
                    if (parseInt(res.lous_num) > _this.page_size)
                        _this.page_size = _res.lous_num,
                        _this.get_lous_list(callback);
                    else {
                        for (var total_money = 0, i = 0, len = _lous_list.length; i < len; i++)
                            total_money += str_to_float(_lous_list[i].nns_order_price, 10);
                        _this.lous_list = _lous_list,
                        _this.lous_obj.total_index = Math.ceil(len / _this.lous_obj.size),
                        _this.lous_total_money = total_money.toFixed(2),
                        callback()
                    }
            } else
                _this.lous_obj.total_index = 0,
                _this.lous_total_money = 0,
                _this.lous_list = [],
                callback()
        })
    }
    ,
    gz_pay.update_lous_list = function(money) {
        var _lous_obj = gz_pay.lous_obj
          , idx = 5 * _lous_obj.index + (ef.all_area.white_bar_list.idx || 0);
        gz_pay.lous_list.splice(idx, 1),
        _lous_obj.index = 0;
        var _total = Math.ceil(gz_pay.lous_list.length / _lous_obj.size);
        _lous_obj.total_index = _total,
        $("#bar_total").text(_total || 1),
        gz_pay.render_lous_list(function(len) {
            ef.all_area.white_bar_list.idx = 0,
            ef.all_area.white_bar_list.len = len;
            var _new_money = gz_pay.lous_total_money - money;
            gz_pay.lous_total_money = _new_money,
            $("#repay_money").text(_new_money)
        })
    }
    ,
    gz_pay.update_balance = function(order_money) {
        var _balance = gz_pay.balance - order_money;
        gz_pay.balance = _balance,
        $("#pay_balance_v").length > 0 && $("#pay_balance_v").text(_balance)
    }
    ,
    gz_pay.floor_top = function(id, not_hide) {
        var $dom = $(".floor-top", gz_pay.warp_dom[0]);
        not_hide = not_hide || !1,
        not_hide || $dom.hide(),
        $dom.removeClass("floor-top"),
        $("#" + id).addClass("floor-top").show()
    }
    ,
    gz_pay.return_up = function() {
        var _page_id = gz_pay.page_list.pop();
        if (_page_id)
            gz_pay.floor_top(_page_id),
            ef.set_focus(_page_id, ef.all_area[_page_id].idx);
        else {
            starcorCom.cancel_request(),
            gz_pay.balance && delete gz_pay.balance,
            gz_pay.pay_method_state = -1,
            req_time = 0,
            clearTimeout(_check_timeout),
            is_return = !0;
            var $dom = gz_pay.warp_dom;
            if ($dom.hide(),
            "repay" == gz_pay.pay_state)
                starcorCom.exit();
            else {
                var _$dom = $dom[0];
                $(".floor-top", _$dom).hide(),
                $("#pay_btn_v", _$dom).html(""),
                $("#pay_money", _$dom).html(""),
                $("#pay_balance_v", _$dom).html("0"),
                "function" == typeof gz_pay.close_event && gz_pay.close_event()
            }
        }
    }
    ,
    gz_pay.pay_success_call = function(callback) {
        var _data = {
            message: "订购成功",
            output: {
                serialno: gz_pay.pay_order_mess.order_id
            },
            state: 0
        };
        is_function(callback) && callback(_data)
    }
    ,
    gz_pay.pay_success_event_call = function() {}
    ,
    gz_pay.push_layer = function(id) {
        for (var _list = gz_pay.page_list, _len = _list.length, i = 0; i < _len; i++)
            if (_list[i] == id) {
                gz_pay.page_list = _list.slice(0, i);
                break
            }
        gz_pay.page_list.push(id)
    }
    ,
    gz_pay.pay_method_select = function(lous_update, callback) {
        req_time = 0;
        var _this = gz_pay;
        lous_update = lous_update || !1,
        !lous_update && _this.pay_order_mess.order_money <= _this.balance ? (gz_pay.set_pay_btn(1),
        callback(1)) : lous_update || _this.channel.lous_payment ? gz_pay.get_lous_usage(function(times) {
            gz_pay.lous_times = times;
            var state = 3;
            times > 0 && (state = 2),
            gz_pay.set_pay_btn(state),
            callback(state)
        }) : (gz_pay.set_pay_btn(4),
        callback(4))
    }
    ,
    gz_pay.set_pay_btn = function(state) {
        state = state || 1;
        var _btn_name = ["钱袋充足 立即支付", "余额不足 使用白条支付", '<span class="lous_icon"></span>余额不足 白条使用受限', "钱袋余额不足 请扫码支付"][state - 1];
        gz_pay.pay_method_state = 4 == state ? 1 : state;
        var idx = 4 == state && ef.all_area.pay_channel.len > 1 ? 1 : 0;
        ef.set_focus("pay_channel", idx),
        $("#pay_btn_v").html(_btn_name || "")
    }
    ,
    gz_pay.pay_btn_click = function(state) {
        switch (state = state || gz_pay.pay_method_state,
        gz_pay.push_layer("pay_channel"),
        state) {
        case 1:
            gz_pay.hasSelectedRenew ? gz_pay.render_auto_renew(1) : (showLoading(),
            gz_pay.boss_pay());
            break;
        case 2:
            gz_pay.render_bar_protocol();
            break;
        case 3:
            gz_pay.lous_init()
        }
    }
    ,
    gz_pay.repay_btn_click = function() {
        gz_pay.push_layer("repay_channel"),
        showLoading(),
        gz_pay.boss_pay()
    }
    ,
    gz_pay.lous_init = function() {
        var _this = gz_pay;
        _this.lous_total_money ? _this.render_pay_tips({
            state: 4,
            order_money: _this.lous_total_money
        }) : _this.get_lous_list(function() {
            _this.render_pay_tips({
                state: 4,
                order_money: _this.lous_total_money
            })
        })
    }
    ,
    gz_pay.lous_list_init = function(callback) {
        var _this = gz_pay;
        _this.render_list_warp(),
        _this.lous_obj.index = 0,
        gz_pay.render_lous_list(),
        hideLoading(),
        is_function(callback) && callback()
    }
    ,
    gz_pay.render_lous_list = function(func) {
        var _this = gz_pay
          , $dom = $("#bar_list_body")
          , _size = _this.lous_obj.size
          , _index = _this.lous_obj.index
          , _star = _index * _size
          , _data = gz_pay.lous_list.slice(_star, _star + _size);
        $dom.hide();
        for (var html = "", i = 0, len = _data.length; i < len; i++) {
            var __data = _data[i]
              , _time_1 = __data.nns_create_time ? __data.nns_create_time.split(" ") : ["", ""];
            html += '<div id="white_bar_list__' + i + '" nns_idx="' + (_star + i) + '" class="bar-list-tr"><span class="bar-mess-1">' + (__data.nns_order_name || "") + '</span><span class="bar-mess-2">' + _time_1[0] + "<span>" + _time_1[1] + '</span></span><span class="bar-mess-3"><span>' + __data.nns_pay_order_id + '</span></span><span class="bar-mess-4">' + __data.nns_order_price + '</span><span class="bar-mess-5"><span></span></span></div>'
        }
        $dom.html(html).show(),
        $("#bar_current").text(_index + 1),
        is_function(func) ? func(len) : ef.set_focus("white_bar_list", 0, len)
    }
    ;
    var repay_btnset_times = 0;
    gz_pay.lous_list_click = function(data) {
        if (data) {
            repay_btnset_times = 0,
            gz_pay.repay_order_mess = {
                order_id: data.nns_pay_order_id || "",
                order_money: data.nns_order_price || 0,
                product_id: data.nns_product_id || ""
            },
            gz_pay.page_list.push("white_bar_list"),
            showLoading(),
            gz_pay.render_repay_channel(data);
            var _order_price = data.nns_order_price || 0;
            lous_balance_timeout(data, 0),
            "" != gz_pay.er_channel ? (gz_pay.er_channel.length > 0 ? gz_pay.render_ercode_2("repay") : ef.update_area({
                id: "repay_channel",
                len: 1
            }),
            set_repay_btn_commom(_order_price)) : lous_channel_timeout(0, _order_price)
        }
    }
    ;
    var _l_b_timer = null
      , _l_c_timer = null
      , pro_obj = {
        t_index: 0,
        index: -1,
        unit_h: 0,
        pageHeight: 360,
        currentId: "",
        reset_height: function() {
            var _index = this.index;
            this.pro_main && (this.pro_main[0].style.top = -_index * this.pageHeight + "px",
            this.pro_bar[0].style.top = Math.max(-13, _index * this.unit_h - 17 - 13) + "px")
        },
        reset_index: function(id) {
            pro_obj.index = 0,
            pro_obj.currentId !== id && (pro_obj.t_index = 0)
        }
    };
    gz_pay.protocol_content_move = function(code, id) {
        var _pro_obj = pro_obj;
        if (!_pro_obj.pro_main || _pro_obj.currentId !== id) {
            _pro_obj.currentId = id,
            _pro_obj.pro_main = $("#" + id + "_main"),
            _pro_obj.pro_bar = $("#" + id + "__0");
            var _times = Math.floor(_pro_obj.pro_main.height() / _pro_obj.pageHeight);
            _pro_obj.t_index = _times,
            pro_obj.unit_h = _times > 0 ? 170 / _times : 0
        }
        _pro_obj.t_index < 0 || ("up" == code && _pro_obj.index > 0 ? (_pro_obj.index--,
        _pro_obj.reset_height()) : "down" == code && _pro_obj.index < _pro_obj.t_index && (_pro_obj.index++,
        _pro_obj.reset_height()))
    }
    ,
    gz_pay.detail_product_info = function(__product__) {
        var currency_type = __product__.currency_type;
        currency_type = ("undefined" == typeof currency_type || "undefined" == currency_type) && "CNY" || currency_type;
        var name = __product__.product_name
          , params = {
            nns_func: "create_pay_order",
            nns_order_type: "product_buy",
            nns_product_num: __product__.product_num,
            nns_product_price: __product__.price / 100,
            nns_money: __product__.order_price,
            nns_order_price: __product__.order_price,
            nns_product_id: __product__.product_id,
            nns_product_name: __product__.product_name,
            nns_name: __product__.order_name || name,
            nns_currency_type: currency_type,
            nns_from_type: "CMS",
            nns_product_fee_id: __product__.product_fee_id
        };
        __product__.video_id && (params.nns_video_id = __product__.video_id),
        __product__.video_type && (params.nns_video_type = __product__.video_type),
        __product__.unit && (params.nns_price_unit = __product__.unit),
        __product__.rule_id && (params.nns_rule_id = __product__.rule_id),
        gz_pay.product_info = params
    }
    ;
    var ef = {
        dom: null,
        focused_id: "",
        all_area: {},
        bind_key: function(code) {
            var _func = "";
            if ("" !== this.focused_id) {
                switch (code) {
                case "enter":
                    _func = ef.all_area[this.focused_id].enter;
                    break;
                case "esc":
                    _func = ef.all_area[this.focused_id].esc;
                    break;
                default:
                    _func = ef.all_area[this.focused_id].direction
                }
                is_function(_func) && _func(code)
            } else
                "esc" === code && gz_pay.return_up()
        },
        update_area: function(obj) {
            var id = obj.id || ef.focused_id
              , _this = ef.all_area[id];
            return _this.idx = is_undefined(obj.idx) ? _this.idx || 0 : obj.idx,
            _this.len = is_undefined(obj.len) ? _this.len || 0 : obj.len,
            _this
        },
        set_focus: function(id, idx, len) {
            if ("" != ef.focused_id) {
                var _old_dom = $("#" + ef.focused_id);
                $(".gz-pay-focused-item", _old_dom[0]).removeClass("gz-pay-focused-item")
            }
            this.focused_id = id;
            var _this = this.update_area({
                id: id,
                idx: idx,
                len: len
            });
            _this.dom = $("#" + id)[0],
            $("#" + id + "__" + _this.idx).addClass("gz-pay-focused-item")
        },
        change_focus_item: function(len) {
            var _this = ef.all_area[ef.focused_id]
              , _len = _this.len || 0;
            _this.len = len || _len,
            $(".gz-pay-focused-item", this.dom).removeClass("gz-pay-focused-item"),
            $("#" + ef.focused_id + "__" + _this.idx, this.dom).addClass("gz-pay-focused-item")
        }
    }
      , channel_common = {
        direction: function(code) {
            var _f_id = ef.focused_id
              , _this = ef.all_area[_f_id]
              , idx = _this.idx
              , _len = _this.len;
            0 === _len && (_len = $("#" + _f_id + "__2").length > 0 ? 3 : $("#" + _f_id + "__1").length > 0 ? 2 : 1,
            _this.len = _len);
            var hasRenew = "pay" === gz_pay.pay_state && gz_pay.isAutoRenew;
            return !hasRenew || "down" !== code && "up" !== code ? void ("down" === code && 0 === idx && _len > 1 || "right" === code && idx > 0 && idx + 1 < _len ? (_this.idx++,
            ef.change_focus_item()) : "left" === code && idx > 1 ? (_this.idx--,
            ef.change_focus_item()) : "up" === code && 0 !== idx && (_this.idx = 0,
            ef.change_focus_item())) : void ("down" === code && 0 === idx ? ef.set_focus("pay_renew_tips", 0) : "up" === code && 0 !== idx && ef.set_focus("pay_renew_tips", 0))
        },
        enter: function() {
            var _this = ef.all_area[ef.focused_id]
              , idx = _this.idx;
            0 == idx ? gz_pay[gz_pay.pay_state + "_btn_click"]() : (gz_pay.push_layer(gz_pay.pay_state + "_channel"),
            gz_pay.check_order("query_order"))
        },
        esc: function() {
            clearTimeout(_check_timeout),
            gz_pay.return_up()
        }
    };
    ef.all_area.pay_channel = clone(channel_common),
    ef.all_area.repay_channel = clone(channel_common),
    ef.all_area.pay_renew_tips = {
        direction: function(code) {
            var _this = ef.all_area[ef.focused_id]
              , idx = _this.idx;
            "down" === code && ef.all_area.pay_channel.len > 1 ? ef.set_focus("pay_channel", 1) : "up" === code ? ef.set_focus("pay_channel", 0) : "right" === code && 0 === idx ? (_this.idx++,
            ef.change_focus_item()) : "left" === code && 1 === idx && (_this.idx--,
            ef.change_focus_item())
        },
        enter: function() {
            var _this = ef.all_area[ef.focused_id]
              , idx = _this.idx;
            if (0 == idx) {
                var state = gz_pay.hasSelectedRenew;
                gz_pay.hasSelectedRenew = !state;
                var className = state ? "removeClass" : "addClass";
                $("#pay_renew_tips__0")[className]("selected-item")
            } else
                gz_pay.push_layer("pay_channel"),
                gz_pay.render_auto_renew(0)
        },
        esc: function() {
            clearTimeout(_check_timeout),
            gz_pay.return_up()
        }
    },
    ef.all_area.renew_protocol_layer = {
        direction: function(code) {
            var _this = ef.all_area[ef.focused_id]
              , idx = _this.idx
              , _len = _this.len;
            0 === idx ? "down" === code && 0 !== pro_obj.t_index && pro_obj.index >= pro_obj.t_index ? ef.set_focus("renew_protocol_layer", 1) : gz_pay.protocol_content_move(code, "renew_protocol_layer") : "right" === code && 1 == idx && _len > 2 || "left" == code && 2 === idx ? (_this.idx = 2 === idx ? 1 : 2,
            ef.change_focus_item()) : "up" === code && ef.set_focus("renew_protocol_layer", 0)
        },
        enter: function() {
            var _this = ef.all_area[ef.focused_id]
              , idx = _this.idx
              , _len = _this.len;
            1 == idx ? 2 === _len ? (gz_pay.return_up(),
            ef.set_focus("pay_renew_tips", 1)) : (gz_pay.reset_renew_tips(),
            gz_pay.return_up()) : 2 == idx && gz_pay.renew_boss_pay()
        },
        esc: function() {
            var _this = ef.all_area[ef.focused_id]
              , _len = _this.len;
            gz_pay.return_up(),
            2 === _len ? ef.set_focus("pay_renew_tips", 1) : gz_pay.reset_renew_tips()
        }
    },
    ef.all_area.protocol_layer = {
        direction: function(code) {
            var _this = ef.all_area[ef.focused_id]
              , idx = _this.idx;
            0 == idx ? "down" == code && 0 !== pro_obj.t_index && pro_obj.index >= pro_obj.t_index ? ef.set_focus("protocol_layer", 1) : gz_pay.protocol_content_move(code, "protocol_layer") : "right" == code && 1 == idx || "left" == code && 2 == idx ? (_this.idx = 2 == idx ? 1 : 2,
            ef.change_focus_item()) : "up" == code && ef.set_focus("protocol_layer", 0)
        },
        enter: function() {
            var _this = ef.all_area[ef.focused_id]
              , idx = _this.idx;
            1 == idx ? gz_pay.return_up() : 2 == idx && (showLoading(),
            gz_pay.lous_pay())
        },
        esc: function() {
            gz_pay.return_up()
        }
    };
    var tips_common = {
        enter: function() {
            var is_pay = "pay" == gz_pay.pay_state;
            0 == ef.all_area.pay_channel.idx && 4 == gz_pay.btn_state && is_pay ? (gz_pay.pay_state = "repay",
            clearTimeout(_check_timeout),
            showLoading(),
            gz_pay.lous_list_init()) : (gz_pay.return_up(),
            1 == gz_pay.pay_success && is_pay && gz_pay.pay_success_call(gz_pay.pay_success_back))
        },
        esc: function() {
            gz_pay.return_up()
        }
    };
    ef.all_area.prompt_layer_pay = tips_common,
    ef.all_area.prompt_layer_repay = tips_common,
    ef.all_area.white_bar_list = {
        direction: function(code) {
            var _this = ef.all_area[ef.focused_id]
              , idx = _this.idx
              , _lous_obj = gz_pay.lous_obj;
            "up" == code ? idx > 0 ? (_this.idx--,
            ef.change_focus_item()) : _lous_obj.index > 0 && (_lous_obj.index--,
            gz_pay.render_lous_list(function(len) {
                ef.set_focus("white_bar_list", 4, len)
            })) : "down" == code && (idx < _this.len - 1 ? (_this.idx++,
            ef.change_focus_item()) : _lous_obj.index < _lous_obj.total_index - 1 && (_lous_obj.index++,
            gz_pay.render_lous_list()))
        },
        enter: function() {
            var idx = $("#" + ef.focused_id + "__" + ef.all_area[ef.focused_id].idx).attr("nns_idx") || 0;
            gz_pay.lous_list_click(gz_pay.lous_list[idx])
        },
        esc: function() {
            gz_pay.update_lous_btn(),
            $("#repay_channel").hide(),
            gz_pay.return_up(),
            $("#gz_payment").length > 0 && (gz_pay.pay_state = "pay")
        }
    },
    gz_pay.init = function(option) {
        if (first_init && (first_init = !1),
        page_dom_init(),
        is_return) {
            is_return = !1,
            showLoading(),
            init_bind_key(),
            gz_pay.warp_dom = $("#gz_order_warp");
            var _type = option.pay_type || 1;
            1 == _type ? (gz_pay.btn_state = 0,
            gz_pay.init_pay(option)) : gz_pay.init_repay()
        }
    }
    ,
    gz_pay.init_pay = function(option) {
        gz_pay.pay_success_back = option.success_callback,
        gz_pay.pay_success_event = option.pay_success_event,
        gz_pay.close_event = option.close_event,
        gz_pay.pay_success = !1,
        gz_pay.hasSelectedRenew = !1;
        var _product = option.product || {};
        if (is_undefined(_product.product_id))
            return gz_pay.render_pay_tips({
                tips_mess: "产品信息未定义"
            }),
            void gz_pay.show_warp();
        var is_single = "single" == _product.product_type;
        if (is_single && (!option.video_info || is_undefined(option.video_info.video_id)))
            return gz_pay.render_pay_tips({
                tips_mess: "购买单片，相关单片信息未定义！"
            }),
            void gz_pay.show_warp();
        var __discount = _product.discount || {}
          , _order_name = is_single ? "《" + (option.video_info.video_name || _product.product_name || "") + "》影片" : _product.product_name + (__discount.discount_name || "")
          , isAutoRenew = __discount.auto_renew + "" == "1";
        gz_pay.isAutoRenew = isAutoRenew,
        gz_pay.product_mess = {
            id: _product.product_id,
            type: _product.product_type,
            name: _order_name,
            order_price: _product.order_price
        },
        _product.order_name = _order_name,
        is_single && (_product.video_id = option.video_info.video_id,
        _product.video_type = option.video_info.video_type),
        isAutoRenew && gz_pay.detail_product_info(_product),
        gz_pay.get_balance(function(_balance) {
            $("#pay_balance_v").html(_balance),
            req_time++,
            _common_func_init()
        }),
        gz_pay.create_order(_product, function() {
            gz_pay.get_channel_list(_product.product_id, function(_data) {
                return 0 == _data.length ? (gz_pay.render_pay_tips({
                    tips_mess: "支付渠道获取失败，请重试"
                }),
                void gz_pay.show_warp()) : (gz_pay.create_pay_channel(),
                gz_pay.show_warp(),
                req_time++,
                gz_pay.render_ercode("pay", _data),
                void _common_func_init())
            })
        })
    }
    ;
    var req_time = 0;
    gz_pay.init_repay = function() {
        gz_pay.pay_state = "repay",
        gz_pay.show_warp(),
        gz_pay.get_lous_list(function() {
            gz_pay.lous_list_init()
        }),
        gz_pay.get_balance(),
        "" == gz_pay.er_channel && (gz_pay.channel = "",
        gz_pay.get_channel_list("", function(_data) {
            gz_pay.channel = _data
        }))
    }
    ,
    win.gz_pay_obj = gz_pay;
    win.gz_pay = gz_pay.init;
    win.pay_bind_event = bind_event;
}(window);
