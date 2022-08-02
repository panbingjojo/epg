!function (win) {
    function obj2querystr(obj) {
        var __str = "";
        if ("object" == typeof obj) for (var item in obj) obj.hasOwnProperty(item) && (__str += "" == __str ? item + "=" + obj[item] : "&" + item + "=" + obj[item]); else __str = obj;
        return __str
    }

    function jsonToString(obj) {
        switch (typeof obj) {
            case"string":
                return '"' + obj.replace(/(["\\])/g, "\\$1") + '"';
            case"array":
                return "[" + obj.map(this.jsonToString).join(",") + "]";
            case"object":
                if (obj instanceof Array) {
                    for (var strArr = [], len = obj.length, i = 0; i < len; i++) strArr.push(this.jsonToString(obj[i]));
                    return "[" + strArr.join(",") + "]"
                }
                if (null == obj) return "null";
                var string = [];
                for (var property in obj) string.push(this.jsonToString(property) + ":" + this.jsonToString(obj[property]));
                return "{" + string.join(",") + "}";
            case"number":
                return obj;
            case"boolean":
                return obj;
            case"undefined":
                return "null"
        }
    }

    function indexOf(data, value) {
        for (var i = 0, len = data.length; i < len; i++) if (data[i] == value) return i;
        return -1
    }

    function ajax_obj(rp, ot) {
        this.xhr = null, this.timeoutID = -1, this.tryReqNum = rp || 0 === rp ? rp : RETRY_NUM, this.out_time = ot || 0 === ot ? ot : RETRY_TIME, this.reqType = "GET", this.success = null, this.error = null, this.requestUrl = "", this.requestParam = null, this.req_datatype = "JSON", this.is_cancel = !1, this._is_working = !1, this.xhr = new XMLHttpRequest
    }

    function implement_que() {
        if (req_wait_que.length > 0) {
            var _next_req = req_wait_que.shift(), req_type = _next_req.params.req_type || "GET";
            delete _next_req.params.req_type, this.set_request(_next_req.url, _next_req.params, _next_req.success, req_type, _next_req.error, _next_req.datatype)
        }
    }

    function combination_params(arg_0, arg_1) {
        arg_0 && "object" == typeof arg_0 || (arg_0 = arg_1);
        for (var item in arg_1) arg_1.hasOwnProperty(item) && !arg_0[item] && (arg_0[item] = arg_1[item])
    }

    var MAX_REQ_NUM = 3, RETRY_NUM = 3, RETRY_TIME = 3e4, last_ajax_idx = 0, req_wait_que = [], jsonp_name_que = [],
        login_info = {nns_user_agent: "nn_player/std", nns_output_type: "json"};
    ajax_obj.prototype.set_request = function (url, param, success, type, error, datatype) {
        if (type ? this.reqType = type : this.reqType = "GET", datatype ? this.req_datatype = datatype : this.req_datatype = "JSON", this._is_working = !0, this.success = success, this.error = error, "JSONP" === this.req_datatype) {
            var __url = url;
            param.nns_output_type = "jsonp";
            var _func = param.nns_func ? "jsonp_" + param.nns_func : "flightHandler",
                _reg = new RegExp("\\b(" + _func + ")\\w{0,}\\b", "g"),
                match_func = jsonp_name_que.join(" ").match(_reg) || [];
            if (match_func.length > 0 && indexOf(match_func, _func) != -1) for (var i = 0, _len = this.tryReqNum; i < _len; i++) if (indexOf(match_func, _func + "_" + i) == -1) {
                _func = _func + "_" + i;
                break
            }
            this.jsonp_func_name = _func, param.nns_jsonp_func = _func, __url += __url.indexOf("?") !== -1 ? "&" + obj2querystr(param) : "?" + obj2querystr(param), __url = cdnRule.get_url(__url), __url = encodeURI(__url.replace(/\?\&/, "?")), __url = __url.replace(/@@@/g, "%23"), __url = __url.replace(/#/g, "%23"), this.send_jsonp_request(__url)
        } else if ("GET" == this.reqType) {
            var __url = url;
            __url += __url.indexOf("?") !== -1 ? "&" + obj2querystr(param) : "?" + obj2querystr(param), __url = cdnRule.get_url(__url), __url = encodeURI(__url.replace(/\?\&/, "?")), __url = __url.replace(/@@@/g, "%23"), __url = __url.replace(/#/g, "%23"), this.sendRequestGet(__url)
        } else {
            var reqParam = this.obj2querystr(param);
            this.sendRequestPost(url, reqParam)
        }
    }, ajax_obj.prototype.createXMLHttpRequest = function () {
        try {
            this.xhr = new XMLHttpRequest
        } catch (e) {
        }
    }, ajax_obj.prototype.sendRequestGet = function (url) {
        var self = this;
        this.requestUrl = url, clearTimeout(this.timeoutID), this.tryReqNum--, this.timeoutID = setTimeout(function () {
            clearTimeout(self.timeoutID), self.xhr.abort(), self.tryReqNum > 0 ? self.sendRequestGet(url) : self.implement_call({
                header: 1e4,
                reason: "request timeout, please check network"
            })
        }, this.out_time), this.xhr.open("GET", url, !0), this.xhr.onreadystatechange = function () {
            self.processResponse()
        }, this.xhr.send(null)
    }, ajax_obj.prototype.sendRequestPost = function (url, param) {
        var self = this;
        this.requestUrl = url, this.requestParam = param, clearTimeout(this.timeoutID), this.tryReqNum--, this.timeoutID = setTimeout(function () {
            clearTimeout(self.timeoutID), self.xhr.abort(), self.tryReqNum > 0 ? self.sendRequestPost(url, param) : self.implement_call({
                header: 1e4,
                reason: "request timeout, please check network"
            })
        }, this.out_time), this.xhr.open("POST", url, !0), this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"), this.xhr.onreadystatechange = function () {
            self.processResponse()
        }, this.xhr.send(param)
    }, ajax_obj.prototype.send_jsonp_request = function (url) {
        var self = this;
        this.requestUrl = url, clearTimeout(this.timeoutID), this.tryReqNum--, this.timeoutID = setTimeout(function () {
            clearTimeout(self.timeoutID), document.getElementsByTagName("head")[0].removeChild(self.script_ele);
            var _que = jsonp_name_que;
            if (jsonp_name_que = _que.splice(indexOf(_que, this.jsonp_func_name), 1), self.tryReqNum > 0) {
                url += 0 + self.tryReqNum, window[self.jsonp_func_name] = null;
                var func_name = self.jsonp_func_name;
                func_name = func_name + "_t_" + self.tryReqNum, self.jsonp_func_name = func_name, url = url.replaceQueryStr(func_name, "JsonpFunc"), self.send_jsonp_request(url)
            } else "function" == typeof this.error && self.error({header: 1e4})
        }, this.out_time), window[this.jsonp_func_name] = function (resp) {
            self.js_load_complete(resp)
        };
        var script_ele = document.createElement("script");
        script_ele.type = "text/javascript", script_ele.src = this.requestUrl, document.getElementsByTagName("head")[0].appendChild(script_ele), jsonp_name_que.push(this.jsonp_func_name), this.script_ele = script_ele
    }, ajax_obj.prototype.js_load_complete = function (resp) {
        clearTimeout(this.timeoutID);
        try {
            "function" != typeof this.success || this.is_cancel || (resp.header = 200, this.success(resp))
        } catch (e) {
        }
        this.tryReqNum = RETRY_NUM;
        var _que = jsonp_name_que;
        jsonp_name_que.splice(indexOf(_que, this.jsonp_func_name), 1), document.getElementsByTagName("head")[0].removeChild(this.script_ele), this._is_working = !1, implement_que.call(this)
    }, ajax_obj.prototype.cancel_ajax = function () {
        if (this.is_cancel = !0, this._is_working = !1, this.tryReqNum = RETRY_NUM, "JSONP" === this.req_datatype) try {
            document.head.removeChild(this.script_ele)
        } catch (e) {
        } else this.xhr.abort();
        clearTimeout(this.timeoutID)
    }, ajax_obj.prototype.processResponse = function () {
        if (4 == this.xhr.readyState) if (200 == this.xhr.status) {
            if (this.is_cancel) return null;
            clearTimeout(this.timeoutID);
            var response_txt = this.xhr.responseText, resp = {};
            if ("" != response_txt) try {
                resp = eval("(" + response_txt + ")"), resp.header = 200
            } catch (e) {
                resp.header = 10001, resp.reason = "json formart error, data is not json string", resp.response_txt = response_txt
            } else resp = {header: this.xhr.status, reason: "response data string is ''"};
            this.implement_call(resp), resp = null
        } else if (0 == this.tryReqNum && 0 != this.xhr.status) {
            clearTimeout(this.timeoutID);
            var resp = {header: this.xhr.status, reason: "request data error, request status is " + this.xhr.status};
            this.implement_call(resp)
        }
    }, ajax_obj.prototype.implement_call = function (resp_data) {
        "function" == typeof this.success && 200 === resp_data.header ? this.success(resp_data) : "function" == typeof this.error && 200 !== resp_data.header && this.error(resp_data), this.xhr.abort(), this._is_working = !1, clearTimeout(this.timeoutID), this.tryReqNum = RETRY_NUM, this.reqType = "GET", this.callBack = null, this.requestUrl = "", this.requestParam = null, implement_que.call(this)
    };
    var nw_ajax = {urls: {}};
    nw_ajax.init = function () {
        for (var i = 1; i <= MAX_REQ_NUM; i++) this["_ajax_req_" + i] = new ajax_obj
    }, nw_ajax.cancel_request = function () {
        for (var i = 1; i <= MAX_REQ_NUM; i++) this["_ajax_req_" + i]._is_working && (this["_ajax_req_" + i].cancel_ajax(), this["_ajax_req_" + i] = new ajax_obj)
    }, nw_ajax.get_data = function (arg_0, arg_1, arg_2, arg_3, arg_4) {
        var url = arg_0;
        if ("string" != typeof arg_0) return this;
        if (arg_0.indexOf("/") === -1 && (url = "object" == typeof android ? android.getUrlEnter(arg_0.toLowerCase()) : this.get_url_by_no(arg_0), !url)) return console.error("interface not valid."), this;
        combination_params(arg_1, login_info);
        for (var _free_ajaxobj = null, i = 1; i <= MAX_REQ_NUM; i++) {
            var __idx = i + last_ajax_idx > MAX_REQ_NUM ? i - MAX_REQ_NUM + last_ajax_idx : i + last_ajax_idx;
            if (!this["_ajax_req_" + __idx]._is_working) {
                _free_ajaxobj = this["_ajax_req_" + __idx], last_ajax_idx = __idx;
                break
            }
        }
        var __error_call = "function" == typeof arg_3 ? arg_3 : null,
            __data_type = arg_4 ? arg_4 : "string" == typeof arg_3 ? arg_3 : "JSONP";
        if (!_free_ajaxobj) return req_wait_que.push({
            url: url,
            params: arg_1,
            success: arg_2,
            error: __error_call,
            datatype: __data_type
        }), this;
        var req_type = arg_1.req_type || "GET";
        return delete arg_1.req_type, _free_ajaxobj.set_request(url, arg_1, arg_2, req_type, __error_call, __data_type), delete req_type, _free_ajaxobj = null, this
    }, nw_ajax.set_common_data = function (key, value) {
        return login_info[key] = value, this
    }, nw_ajax.get_url_by_no = function (str) {
        return str = str.toUpperCase(), this.urls[str]
    }, nw_ajax.get_base_data = function (web_path, success, error) {
        var _url = web_path;
        return this.get_data(_url, {}, function (resp) {
            success(resp)
        }, error), this
    }, nw_ajax.get_epg_base_data = function (success, error) {
        var self = this, _url = this.urls.N3_A_2;
        return this.get_data(_url, {}, function (resp) {
            for (var attr in resp.n3_a) {
                var attrName = attr.toUpperCase();
                self.urls[attrName] = resp.n3_a[attr].url
            }
            success()
        }, error), this
    }, nw_ajax.init(), win.nw_ajax_v2 = nw_ajax
}(window), function (win) {
    var interface_method = {
        N2_A: "ClientIndex",
        N3_A_D: "MAPindex",
        N3_A_E: "TopicIndex",
        N7_A: "ADIndex",
        N24_A: "SpecialIndex",
        N36_A: "MetaDataIndex",
        N39_A: "EPGV2",
        N40_A: "UserIndex",
        N40_B: "UserMessageBoard",
        N40_C: "UserScoreIndex",
        N40_D: "UserRecommendIndex",
        N40_E: "UserMessageIndex",
        N40_F: "UserIntelEpg",
        N40_G: "UserVideoWish",
        N40_J: "GetVideoComments",
        N40_I: "UserBackPlayReserve",
        N41_A: "EPGFrontIndex",
        N50_A: "AuthIndex",
        N60_A: "pay",
        N82_A: "CpInfo",
        N51_A: "AuthIndexStandard",
        N215_A: "AAAAuth",
        N217_A: "ScaaaUser",
        N218_A: "ScaaaCard",
        N219_A: "ScaaaProduct"
    }, interface_config = {
        N1_A_1: "STBindex",
        N2_A_3: "ClientIndex/sync_time",
        N3_A_D_7: "MetaDataIndex/get_media_assets_item_by_labels",
        N3_A_E_1: "TopicIndex/get_topic_info",
        N3_A_E_2: "MetaDataIndex/get_topic_item_list",
        N3_A_E_3: "MetaDataIndex/get_topic_item_info",
        N3_A_E_4: "MetaDataIndex/get_media_assets_item_by_labels",
        N7_A_2: "ADIndex/get_ad_info_by_video_id",
        N7_A_3: "ADIndex/get_ad_info_by_ad_pos",
        N7_A_4: "ADIndex/get_event_ad_info",
        N21_A_1: "MgtvSearchHotWord/get_hot_words",
        N24_A_1: "SpecialIndex/get_special_info",
        N24_A_2: "SpecialIndex/get_special_item_list",
        N24_A_3: "SpecialIndex/search_special_item",
        N24_A_4: "SpecialIndex/get_special_online",
        N24_A_5: "SpecialIndex/get_special_info_by_ids",
        N36_A_1: "MetaDataIndex/get_init_meta_data",
        N36_A_2: "MetaDataIndex/get_skin",
        N36_A_3: "MetaDataIndex/get_public_image",
        N36_A_4: "MetaDataIndex/get_public_image_v2",
        N36_A_5: "MetaDataIndex/get_terminal_realtime_params",
        N36_A_6: "MetaDataIndex/get_live_templates",
        N36_A_7: "MetaDataIndex/get_templates_by_assists",
        N39_A_1: "EPGV2/get_channel_list",
        N39_A_2: "EPGV2/get_media_asset_by_video_id",
        N39_A_3: "EPGV2/get_chats_list",
        N39_A_4: "EPGV2/get_actor_star_list",
        N39_A_5: "EPGV2/get_actor_star_info",
        N39_A_6: "EPGV2/get_dy_data_by_video_id",
        N39_A_7: "EPGV2/get_total_media_asset_item_list",
        N39_A_8: "EPGV2/transformat_keys",
        N39_A_9: "EPGV2/get_index_list_by_category",
        N39_A_10: "EPGV2/get_dy_data_by_index_id",
        N39_A_11: "EPGV2/search_video_index_list",
        N39_A_12: "EPGV2/get_playbill_by_days",
        N39_A_13: "EPGV2/get_agreement_list",
        N39_A_14: "EPGV2/search_actor_star_list",
        N39_A_15: "EPGV2/get_media_asset_list_v2",
        N39_A_16: "EPGV2/get_actor_star_screening_range",
        N39_A_17: "EPGV2/get_hot_actor_star_list",
        N39_A_18: "EPGV2/get_current_playbill",
        N39_A_19: "EPGV2/get_channel_by_buss",
        N39_A_20: "EPGV2/get_video_info_list",
        N39_A_21: "EPGV2/get_preview_list_by_video_id",
        N39_A_22: "EPGV2/get_item_list_by_assist_id",
        N39_A_23: "EPGV2/get_media_assets_bind_labels_v2",
        N39_A_24: "EPGV2/get_video_info_v3",
        N39_A_25: "EPGV2/get_media_assets_info_v2",
        N39_A_26: "EPGV2/get_dynamic_category_item_list",
        N39_A_29: "EPGV2/get_playbill_by_ad_device",
        N39_A_30: "EPGV2/get_video_index_list",
        N39_A_31: "EPGV2/search_media_assets_item_v2",
        N39_A_32: "EPGV2/get_video_recom_video",
        N39_A_33: "EPGV2/get_video_play_after_info",
        N39_A_34: "EPGV2/get_playbill_by_days_v2",
        N39_A_35: "EPGV2/get_player_exit_data",
        N39_A_36: "EPGV2/get_search_hot_word_list",
        N39_A_37: "EPGV2/get_media_by_original_id",
        N39_A_38: "EPGV2/search_playbill",
        N39_A_39: "EPGV2/get_playbill_recommend_list",
        N39_A_40: "EPGV2/get_assets_info_by_product_id",
        N40_A_1: "UserIndex/get_collect_list_v2",
        N40_A_2: "UserIndex/add_collect_v2",
        N40_A_3: "UserIndex/delete_collect_v2",
        N40_A_4: "UserIndex/get_playlist_v2",
        N40_A_5: "UserIndex/add_playlist_v2",
        N40_A_6: "UserIndex/delete_playlist_v2",
        N40_A_7: "UserIndex/get_catch_list_v2",
        N40_A_8: "UserIndex/add_catch_v2",
        N40_A_9: "UserIndex/delete_catch_v2",
        N40_A_10: "UserIndex/sync_collect_by_user",
        N40_A_11: "UserIndex/sync_playlist_by_user",
        N40_A_12: "UserIndex/sync_catch_by_user",
        N40_D_1: "UserRecommendIndex/get_user_recommend",
        N40_D_2: "UserRecommendIndex/set_user_recommend",
        N40_D_3: "UserRecommendIndex/get_user_recommend_v2",
        N40_D_4: "UserRecommendIndex/get_own_calc_user_recommend",
        N40_I_1: "UserBackPlayReserve/add_channel_subscribe",
        N40_I_2: "UserBackPlayReserve/cancel_channel_subscribe",
        N41_A_4: "EPGFrontIndex/get_ability_version_by_initial",
        N82_A_1: "CpInfo/get_cp_list",
        N50_A_1: "AuthIndex/auth_play",
        N50_A_2: "AuthIndex/apply_play",
        N50_A_3: "AuthIndex/apply_download",
        N60_A_1: "pay/create_pay_order",
        N60_A_2: "pay/get_pay_order_info",
        N60_A_3: "pay/get_pay_channel_list",
        N60_A_4: "pay/get_user_pay_list",
        N60_A_5: "pay/alipay_app_pay",
        N60_A_6: "pay/alipay_qr_pay",
        N60_A_7: "pay/alipay_web_pay",
        N60_A_8: "pay/weixinpay_app_pay",
        N60_A_9: "pay/weixinpay_scan_pay",
        N60_A_10: "pay/weixinpay_web_pay",
        N60_A_12: "pay/bestpay_app_pay",
        N60_A_13: "pay/business_status_query",
        N60_A_14: "pay/oceanpay_web_scan_pay",
        N60_A_15: "pay/short_url",
        N60_A_16: "pay/oceanpay_sdk_pay",
        N60_A_17: "pay/boss_wallet_pay",
        N60_A_18: "pay/exchange_video_coupon",
        N60_A_19: "pay/activate_exchange_card",
        N60_A_20: "pay/create_payment_order",
        N60_A_21: "pay/initiate_payment",
        N60_A_22: "pay/check_payment",
        N60_A_23: "pay/buy_product",
        N60_A_24: "pay/smartluy_web_pay",
        N215_A_1: "AAAAuth/scaaa_device_auth",
        N215_A_4: "AAAAuth/scaaa_auth_token",
        N217_A_1: "ScaaaUser/scaaa_get_user_info",
        N218_A_1: "ScaaaCard/exchange_video_coupon",
        N219_A_1: "ScaaaProduct/scaaa_get_ordered_product_list",
        N219_A_2: "ScaaaProduct/scaaa_get_order_history_list",
        N219_A_3: "ScaaaProduct/scaaa_get_upgrade_product_list",
        N219_A_4: "ScaaaProduct/scaaa_upgrade_product",
        N219_A_5: "ScaaaProduct/scaaa_get_buy_product_list",
        N219_A_6: "ScaaaProduct/scaaa_buy_product_report",
        N219_A_7: "ScaaaProduct/scaaa_get_mobile_flow_page",
        N219_A_8: "ScaaaProduct/scaaa_onoder_flow_page",
        N219_A_9: "ScaaaProduct/scaaa_unoder_flow_page",
        N219_A_10: "ScaaaProduct/scaaa_product_unsubscribe",
        N219_A_11: "ScaaaProduct/scaaa_get_product_extension",
        N219_A_12: "ScaaaProduct/scaaa_get_product_discount_list",
        N219_A_13: "ScaaaProduct/scaaa_get_product_and_user_info",
        N219_A_14: "ScaaaProduct/scaaa_get_buy_video_list",
        N219_A_15: "ScaaaProduct/scaaa_user_product_unsubscribe",
        N219_A_16: "ScaaaProduct/scaaa_get_user_cards"
    }, __request = function (url) {
        var request_obj = {}, request_pars = {}, params = url.split("?");
        if (params[1]) {
            var pars = params[1].split("&");
            for (var num in pars) if ("string" == typeof pars[num]) {
                var par = pars[num].split("=");
                request_pars[par[0]] = par[1]
            }
        }
        return request_obj.baseUrl = params[0], request_obj.params = request_pars, request_obj
    }, cdnRule = {
        cdns: {},
        cdnexcept: ["UserId", "Token", "MacId", "SmartCardId", "DeviceId", "UserPassword", "Webtoken", "ExData", "NetId"],
        rule: {},
        api_host: {},
        errcodeRule: {
            N1_A_1: "1002006",
            N3_A_2: "1002006",
            N3_A_A_3: "1002008",
            N3_A_A_4: "1002005",
            N3_A_A_5: "1002010",
            N3_A_A_6: "1002005",
            N3_A_A_7: "1002011",
            N3_A_A_8: "1002007",
            N3_A_A_9: "1002012",
            N3_A_A_10: "1002005",
            N3_A_A_12: "1002008",
            N3_A_A_13: "1002008",
            N3_A_A_14: "1002008",
            N3_A_A_15: "1002005",
            N3_A_D_1: "1002007",
            N3_A_D_2: "1002007",
            N3_A_D_4: "1002005",
            N3_A_D_5: "1002005",
            N3_A_D_6: "1002012",
            N3_A_D_7: "1002007",
            N3_A_D_8: "1002013",
            N3_A_D_9: "1002013",
            N3_A_D_10: "1002007",
            N3_A_D_11: "1002007",
            N3_A_G_1: "1002007",
            N3_A_G_2: "1002007",
            N3_A_G_3: "1002007",
            N3_A_G_4: "1002007",
            N3_A_G_5: "1002007",
            N3_A_H_1: "1002007",
            N100_A_1: "1002005",
            N100_A_2: "1002005",
            N100_A_3: "1002009",
            N23_A_1: "1002014",
            N24_A_1: "1002005",
            N24_A_2: "1002015",
            N24_A_3: "1002005",
            N24_A_4: "1002016",
            N21_A_1: "1002017",
            N21_A_2: "1002017",
            N21_A_3: "1002017",
            N41_A_1: "1002018",
            N50_A_1: "1002019",
            N212_A_1: "1002020",
            N212_A_2: "1002021",
            N212_A_3: "1002022",
            N212_A_4: "1002022",
            N212_A_9: "1002022",
            N212_A_10: "1002022",
            N212_A_11: "1002022",
            N212_A_12: "1002022",
            N212_A_13: "1002022",
            N212_B_1: "1002004",
            N212_B_2: "1002023",
            N212_B_3: "1002023",
            N212_B_4: "1002023",
            N212_B_5: "1002023",
            N212_B_6: "1002023",
            N212_B_7: "1002023",
            N212_B_8: "1002023",
            N212_B_9: "1002023",
            N212_B_10: "1002023",
            N212_B_11: "1002004",
            N212_B_12: "1002023",
            N212_B_13: "1002023",
            N212_B_14: "1002023",
            N212_B_16: "1002023",
            N212_B_17: "1002023",
            N212_B_18: "1002023"
        },
        get_errcode: function (url, params) {
            var code = "1002005", self = this;
            return app_tools.each(this.rule, function (item, attr) {
                var a = item.split("/");
                if (url.indexOf(a[0]) >= 0) return (!params || params.nns_func == a[1]) && (code = self.errcodeRule[attr], !0)
            }), code
        },
        get_api_host_url: function (url, _func) {
            if (_func) {
                for (var item in interface_config) if (interface_config[item].indexOf(_func) != -1) for (var _api_host in this.api_host) if (_api_host.replace(/^API\_HOST\_/gi, "").toUpperCase() == item.toUpperCase()) return url.replace(/^http.?\:\/\/[^\/]+\//, this.api_host[_api_host]);
                return null
            }
            return null
        },
        get_url: function (url) {
            var $urlObj = __request(url), urls = $urlObj.baseUrl.split("/"), index = urls[urls.length - 1],
                __func = $urlObj.params.nns_func;
            $urlObj.params && $urlObj.params.nns_func && (index += "/" + $urlObj.params.nns_func);
            var u = $urlObj.baseUrl;
            $urlObj.params.nns_func && (u += "/" + this.get_upper_word($urlObj.params.nns_func), delete $urlObj.params.nns_func);
            var urlparams = {};
            for (var param_item in $urlObj.params) {
                var param_item_new = this.get_upper_word(param_item);
                urlparams[param_item_new] = $urlObj.params[param_item]
            }
            var __u = this.get_api_host_url(u, __func);
            if (__u) u = __u; else for (var inter in this.rule) if (this.rule[inter] == index && this.cdns[inter]) return u = this.get_cdn_url(u, urlparams, this.cdns[inter]);
            return u = this.get_dy_url(u, urlparams), u = u.indexOf("?") > -1 ? u + "&now=" + (new Date).getTime() : u + "?now=" + (new Date).getTime()
        },
        get_upper_word: function (word) {
            var word = word.replace(/nns\_/g, ""), words = word.split("_");
            word = "";
            for (var m in words) "index" != m && (word += words[m].substring(0, 1).toUpperCase() + words[m].substring(1));
            return word
        },
        get_cdn_url: function (url, params, host) {
            var num = 0;
            for (var attr in params) this.cdnexcept.index(attr) == -1 && (url += num < 5 ? "--" + attr + "__" + params[attr] : url.indexOf("?") > 0 ? "&" + attr + "=" + params[attr] : "?" + attr + "=" + params[attr], num++, 5 == num && (url += ".shtml"));
            return url.indexOf(".shtml") <= 0 && (url += ".shtml"), url = url.replace(/http:\/\/([^\/]+)\//, host)
        },
        get_dy_url: function (url, params) {
            for (var attr in params) url += url.indexOf("?") > 0 ? "&" + attr + "=" + params[attr] : "?" + attr + "=" + params[attr];
            return url
        }
    };
    cdnRule.rule = interface_config || {}, win.interface_method = interface_method, win.cdnRule = cdnRule
}(window);
try {
    window.Utility = Utility
} catch (e) {
    window.Utility = !1
}
!function (window) {
    function indexOf(data, value) {
        for (var i = 0, len = data.length; i < len; i++) if (data[i] == value) return i;
        return -1
    }

    function get_url_params() {
        for (var search_arr = location.search.slice(1), pairs = "" != search_arr ? search_arr.split("&") : [], args = {}, i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf("=");
            if (pos != -1) {
                var argname = pairs[i].substring(0, pos), value = pairs[i].substring(pos + 1);
                value = value ? decodeURIComponent(value) : value, args[argname] = value
            }
        }
        return args
    }

    function is_function(callback) {
        return "function" == typeof callback
    }

    function is_undefined(data) {
        return "undefined" == typeof data || "" == data
    }

    function clone(arg_0, arg_1) {
        arg_0 && "object" == typeof arg_0 || (arg_0 = arg_1);
        for (var item in arg_1) arg_1.hasOwnProperty(item) && (arg_0[item] = arg_1[item])
    }

    function set_cookie(key, value) {
        if (value = encodeURIComponent(jsonToString(value)), window.localStorage) window.localStorage.setItem(key, value); else if (starcorExt) document.cookie = key + "=" + value; else try {
            value += "", Utility.setEnv ? Utility.setEnv(key, value) : SysSetting.setEnv(key, "" + value)
        } catch (e) {
            document.cookie = key + "=" + value
        }
    }

    function get_cookie(key) {
        if (key = key || "middle_user_info", window.localStorage) {
            var value = window.localStorage.getItem(key);
            return value ? value = "" === value ? value : stringToJson(decodeURIComponent(value)) : null
        }
        if (starcorExt) return getCookie_value(key);
        try {
            var value = "";
            return value = Utility.getEnv ? Utility.getEnv(key) : decodeURIComponent(SysSetting.getEnv(key)), "undefined" == value && (value = null), value = "" === value ? value : stringToJson(decodeURIComponent(value))
        } catch (e) {
            return getCookie_value(key)
        }
    }

    function getCookie_value(key) {
        var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
        if (null != arr) {
            var value = arr[2];
            return value = "" === value ? value : stringToJson(decodeURIComponent(value))
        }
        return null
    }

    function jsonToString(obj) {
        switch (typeof obj) {
            case"string":
                return '"' + obj.replace(/(["\\])/g, "\\$1") + '"';
            case"array":
                return "[" + obj.map(jsonToString).join(",") + "]";
            case"object":
                if (obj instanceof Array) {
                    for (var strArr = [], len = obj.length, i = 0; i < len; i++) strArr.push(jsonToString(obj[i]));
                    return "[" + strArr.join(",") + "]"
                }
                if (null == obj) return "null";
                var string = [];
                for (var property in obj) string.push(jsonToString(property) + ":" + jsonToString(obj[property]));
                return "{" + string.join(",") + "}";
            case"number":
                return obj;
            case"boolean":
                return obj
        }
    }

    function stringToJson(data) {
        var json = {};
        return "string" == typeof data ? json = eval("(" + data + ")") : "object" == typeof data && (json = eval(data)), json
    }

    function str2time(date_str) {
        return date_str = date_str.replace(/[-:T ]/g, "").substr(0, 14)
    }

    function str2today(date_str) {
        date_str = date_str.replace(/[-:T ]/g, "").substr(0, 14);
        try {
            return new Date(date_str.slice(0, 4), parseInt(date_str.slice(4, 6)) - 1, date_str.slice(6, 8), date_str.slice(8, 10), date_str.slice(10, 12), date_str.slice(12, 14)).getTime()
        } catch (e) {
            return 0
        }
    }

    function request(number, params, callback, func_name) {
        var data = {};
        "string" == typeof callback && (func_name = callback), "function" == typeof params ? callback = params : data = params, func_name = func_name || data.nns_func;
        var type = data.data_type || "JSONP";
        if (params = baseFunc.get_base_post_data(func_name, data), "N40_A" == number) {
            var has_cp = "undefined" != typeof params.nns_get_cp_ids;
            has_cp && (params.nns_get_cp_ids = params.nns_get_cp_ids == -1 ? "" : params.nns_get_cp_ids) || params.nns_cp_id
        }
        "N40_A" != number || params.nns_user_id || (params.nns_user_id = params.nns_device_id), ajax_v2.get_data(number, params, function (resp) {
            "function" == typeof callback && callback(resp)
        }, type.toUpperCase())
    }

    function create_order_id(__product__, _channel, callback) {
        var currency_type = __product__.currency_type;
        currency_type = ("undefined" == typeof currency_type || "undefined" == currency_type) && "CNY" || currency_type;
        var name = __product__.product_name, params = (baseFunc.base_params, {
            nns_func: "create_pay_order",
            nns_order_type: "product_buy",
            nns_product_num: __product__.product_num,
            nns_product_price: __product__.price,
            nns_money: __product__.order_price,
            nns_order_price: __product__.order_price,
            nns_product_id: __product__.product_id,
            nns_product_name: __product__.product_name,
            nns_name: __product__.order_name || name,
            nns_currency_type: currency_type,
            nns_from_type: "CMS",
            nns_partner_id: _channel.partner_id || nns_partner_id,
            nns_product_fee_id: __product__.product_fee_id
        });
        _channel.id && (params.nns_channel_id = _channel.id), _channel.mode && _channel.mode.id && (params.nns_mode_id = _channel.mode.id), __product__.video_id && (params.nns_video_id = __product__.video_id), __product__.video_type && (params.nns_video_type = __product__.video_type), __product__.unit && (params.nns_price_unit = __product__.unit), __product__.rule_id && (params.nns_rule_id = __product__.rule_id), baseFunc.base_params.cp_id && (params.nns_cp_id = baseFunc.base_params.cp_id), request("N60_A", params, callback)
    }

    function discount_price_func(product, discount, not_add) {
        var _price = 0, p_price = product.price / 100, _times = 1;
        if (discount && discount.discount_type) {
            _times = discount.need_purchased_times;
            var _discount = discount.discount;
            switch (discount.discount_type.type_name) {
                case"fixed_price":
                    _price = _discount;
                    break;
                case"discount":
                    _price = (p_price * _times * parseFloat(_discount)).toFixed(2);
                    break;
                case"full_off":
                    var _full__v = parseFloat(discount.ext_datas.full_off),
                        _total_price = parseFloat(p_price * _times).toFixed(2);
                    _price = _total_price > _full__v ? _total_price - _discount : _total_price;
                    break;
                default:
                    _price = _discount, _times = 1
            }
            product.rule_id = discount.ruler_id
        } else _price = p_price, discount = {};
        product.order_price = _price, product.product_num = _times, product.money = (p_price * _times).toFixed(2), !not_add && (product.discount = discount)
    }

    function go_fml_gdjl_player(params, _back_url) {
        function p_play_url(url, position) {
            android.goVodPlayerNotQuit(url, _back_url, position)
        }

        var option = params.option;
        if ("media" == params.type) starcorCom.apply_play({
            nns_video_id: option.video_id,
            nns_video_type: option.video_type || 0,
            nns_video_index: option.video_index || 0
        }, function (res) {
            var url = res.video && res.video.index && res.video.index && res.video.index.media.url;
            url ? p_play_url(url, option.position) : alert("网络连接失败，请稍后再试【0001" + res.result.state + "】")
        }); else if ("play_stream" == params.type) {
            var url = option.video_rtsp;
            p_play_url(url, option.position)
        }
    }

    function go_tongzhou_player(option, is_meida) {
        var sv_player_host = cpcom_config.player_url || "http://epg.interface.gzgd/nn_cms/data/webapp/common/";
        if (!is_meida) {
            if (!option.video_rtsp) return void alert("播放流为空");
            setGlobalVar("video_rtsp", option.video_rtsp), delete option.video_rtsp
        }
        setGlobalVar("video_option_v2", jsonToString(option));
        var url = sv_player_host + "player/player.html";
        "media" == option.call_mode && (url = sv_player_host + "player/player_media.html"), location.href = url
    }

    function load_js(url, callback) {
        var script_obj = document.createElement("script");
        script_obj.type = "text/javascript", script_obj.charset = "UTF-8", script_obj.src = url, script_obj.onload = function () {
            setTimeout(function () {
                "function" == typeof callback && callback()
            }, 2e3)
        };
        var head = document.head || document.getElementsByTagName("head")[0];
        head.appendChild(script_obj)
    }

    function bind_document(ef) {
        document.onkeydown = null, document.onkeydown = function (event) {
            if (!is_loading) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e) {
                    switch (e.keyCode) {
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
                        case 32:
                            e.key_name = "menu";
                            break;
                        default:
                            var value = bind_number(e.keyCode);
                            "" != value && (e.key_name = "number", e.key_value = value)
                    }
                    ef.bind_key(e)
                }
            }
        }
    }

    function bind_number(keyCode) {
        return keyCode >= 48 && keyCode <= 57 ? "" + (keyCode - 48) : ""
    }

    function setGlobalVar(_sName, _sValue) {
        if (window.localStorage) window.localStorage.setItem(_sName, _sValue); else try {
            _sValue += "", Utility.setEnv ? Utility.setEnv(_sName, _sValue) : SysSetting.setEnv(_sName, "" + encodeURIComponent(_sValue))
        } catch (e) {
            document.cookie = escape(_sName) + "=" + escape(_sValue) + ";path=/"
        }
    }

    function getGlobalVar(_sName) {
        var result = "";
        if (window.localStorage) {
            var value = window.localStorage.getItem(_sName);
            return value ? value : null
        }
        try {
            result = utility.getEnv ? utility.getEnv(_sName) : decodeURIComponent(SysSetting.getEnv(_sName)), "undefined" == result && (result = "")
        } catch (e) {
            for (var aCookie = document.cookie.split("; "), i = 0; i < aCookie.length; i++) {
                var aCrumb = aCookie[i].split("=");
                if (escape(_sName) == aCrumb[0]) {
                    result = unescape(aCrumb[1]);
                    break
                }
            }
        }
        return result
    }

    function getQueryStr(_url, _param) {
        var tmp, rs = new RegExp("(^|)" + _param + "=([^&]*)(&|$)", "g").exec(_url);
        return (tmp = rs) ? tmp[2] : ""
    }

    var baseFunc = {}, ajax_v2 = window.nw_ajax_v2, starcorExt = window.starcorExt, utility = window.Utility,
        Utility = window.Utility, interface_method = window.interface_method,
        nns_partner_id = cpcom_config.nns_partner_id, ip_area_code = "",
        lous_pay_white_list = cpcom_config.lous_pay_white_list,
        white_list = "undefined" != typeof lous_pay_white_list && lous_pay_white_list;
    baseFunc.base_time = "", baseFunc.base_params = {tag: 26}, baseFunc.init = function () {
        var url_data = get_url_params();
        url_data.returnUrl && starcorCom.path_sav(url_data.returnUrl), baseFunc.base_params.cp_id = url_data.cp_id;
        var _is_android = "object" == typeof android;
        if (starcorExt) baseFunc.base_params.env = "starcor", baseFunc.base_params.sub_env = "gdjl_1", baseFunc.base_params.service_type = "iptv", this.starcor_apk(); else if (_is_android) {
            window.starcorExt = starcorExt || !0;
            var _get_service_type = android.get_service_type();
            baseFunc.base_params.service_type = _get_service_type, baseFunc.base_params.env = "starcor", baseFunc.base_params.sub_env = "iptv" == baseFunc.base_params.service_type ? "gdjl_2" : "fml_2", baseFunc.base_params.version = android.get_version(), baseFunc.base_params.tag = android.get_tag()
        } else baseFunc.base_params.env = "other", baseFunc.base_params.sub_env = "fml_1", baseFunc.base_params.service_type = "ipqam", baseFunc.base_params.version = cpcom_config.version, baseFunc.base_params.epg_host = cpcom_config.epg_host;
        _is_android ? baseFunc.has_base_data(null, baseFunc.init_ready_callback) : this.has_stb_url(function () {
            baseFunc.init_auth_token(), baseFunc.init_ready_callback()
        })
    };
    var timer_c = "", get_init_time = 0;
    baseFunc.init_ready_callback = function (info) {
        clearInterval(timer_c), is_function(baseFunc.ready_callback) ? (get_init_time = 0, baseFunc.ready_callback(info)) : get_init_time > 2e4 ? (get_init_time = 0, clearInterval(timer_c)) : timer_c = setInterval(function () {
            get_init_time += 100, clearInterval(timer_c), baseFunc.init_ready_callback(info)
        }, 100)
    }, baseFunc.init_auth_token = function () {
        this.Interval_updata_token(this.get_base_post_data("scaaa_refresh_token"))
    }, baseFunc.starcor_apk = function () {
        var oldStarcorExt = starcorExt;
        starcorExt = {
            _setCallbackResult: function (idx, ret) {
                oldStarcorExt._setCallbackResult(idx, ret)
            }, _execAndroidFunc: function (func, args) {
                return oldStarcorExt._execAndroidFunc(func, args)
            }
        }, starcorExt._invokeCallback = function (name, args, returnIdx) {
            var func = this._callbacks[name], ret = null;
            try {
                var invokeArgs = [];
                for (var idx in args) {
                    var item = args[idx];
                    switch (item.type) {
                        case"number":
                            invokeArgs.push(Number(item.value));
                            break;
                        case"string":
                            invokeArgs.push(String(item.value));
                            break;
                        case"boolean":
                            invokeArgs.push(Boolean(item.value))
                    }
                }
                ret = func.apply(this, invokeArgs)
            } catch (e) {
            }
            starcorExt._setCallbackResult(returnIdx, ret)
        }, starcorExt._addCallback = function (callback) {
            var callbackIdx = String(starcorExt._callback_counter++);
            return this._callbacks[callbackIdx] = callback, callbackIdx
        }, starcorExt._callback_counter = 0, starcorExt._callbacks = {}, starcorExt.exec = function () {
            for (var args = [], idx = 0; idx < arguments.length; ++idx) {
                var val = arguments[idx];
                switch (typeof val) {
                    case"number":
                        args.push({type: "number", value: val});
                        break;
                    case"string":
                        args.push({type: "string", value: val});
                        break;
                    case"bool":
                        args.push({type: "boolean", value: val});
                        break;
                    case"object":
                        args.push({type: "object", value: val});
                        break;
                    case"function":
                        args.push({type: "callback", value: this._addCallback(val)})
                }
            }
            var cmd = args.shift();
            return "undefined" == typeof this._execAndroidFunc ? null : this._execAndroidFunc(cmd.value, JSON.stringify(args))
        }, starcorExt.readSystemProp = function (propName) {
            return String(this.exec("readSystemProp", propName))
        }, starcorExt.closeBrwoser = function (reason) {
            if (reason) return this.exec("closeBrowser", reason)
        }, starcorExt.getServerTime = function () {
            return String(this.exec("getServerTime"))
        }, starcorExt.getTokenInfo = function () {
            return String(this.exec("getTokenInfo"))
        }, starcorExt.getEpgInterfaceData = function () {
            return String(this.exec("getEpgInterfaceData"))
        }, starcorExt.getBaseInfo = function (methodname) {
            return String(this.exec(methodname))
        }, starcorExt.sendIntent = function (mode, intent) {
            return this.exec("sendIntent", mode, intent)
        }, starcorExt.setHandler = function (handlerType, handler) {
            return this.exec("setHandler", handlerType, handler)
        }, starcorExt.setMessageHandler = function (handler) {
            return this.setHandler("Message", handler)
        }, starcorExt.set_global_callback = function (name, callback) {
            this._callbacks[name] = callback
        }, starcorExt.onStop = function () {
            this._invokeCallback("page_event", [{type: "number", value: "1"}])
        }, starcorExt.onRestart = function () {
            this._invokeCallback("page_event", [{type: "number", value: "2"}])
        }, starcorExt.on_user_change = function () {
            this._invokeCallback("token_update", {})
        }, window.starcorExt = starcorExt
    }, baseFunc.utility_apk = function () {
        var base_params = baseFunc.base_params;
        utility ? base_params.device_id = utility.getSystemInfo("SID") || "" : base_params.device_id = cpcom_config.device_id, base_params.mac_id = base_params.device_id
    }, baseFunc.get_starcor_base = function (webview) {
        baseFunc.base_params.version = webview.readSystemProp("app.version"), baseFunc.base_params.device_id = webview.readSystemProp("device.id"), baseFunc.base_params.mac_id = webview.readSystemProp("device.mac"),
            baseFunc.base_params.user_id = webview.readSystemProp("user.id");
        try {
            var token_info = JSON.parse(webview.getTokenInfo());
            baseFunc.base_params.web_token = token_info.webtoken || "", baseFunc.base_params.valid_time = token_info.valid_time || "", baseFunc.base_params.refresh_time = token_info.refresh_time
        } catch (e) {
        }
    }, baseFunc.get_base_post_data = function (func, obj) {
        var base_params = this.base_params, params = {
            nns_device_id: base_params.device_id,
            nns_smart_card: base_params.device_id,
            nns_tag: base_params.tag,
            nns_version: base_params.version
        };
        base_params.cp_id && (params.nns_cp_id = base_params.cp_id), base_params.service_type && (params.nns_service_type = base_params.service_type), base_params.mac_id && (params.nns_mac_id = base_params.mac_id), base_params.user_id && (params.nns_user_id = base_params.user_id);
        var env = base_params.sub_env;
        return !env || "gdjl_2" !== env && "fml_2" !== env ? base_params.web_token && (params.nns_webtoken = base_params.web_token) : params.nns_webtoken = base_params.web_token = android.get_webtoken(), "string" == typeof func ? params.nns_func = func : obj = func, obj && clone(params, obj), params
    }, baseFunc.get_system_time = function (callback) {
        if (starcorExt) {
            var time = str2time(starcorExt.getServerTime());
            is_function(callback) && callback(time)
        } else nw_ajax_v2.get_data("N2_A", {
            nns_func: "sync_time",
            nns_cp_id: baseFunc.base_params.cp_id
        }, function (resp) {
            var time = str2time(resp.time);
            is_function(callback) && callback(time)
        })
    }, baseFunc.Interval_starcor_token = function () {
        try {
            var token_info = JSON.parse(starcorExt.getTokenInfo());
            baseFunc.base_params.web_token = token_info.webtoken || "", baseFunc.base_params.valid_time = token_info.valid_time || "", baseFunc.base_params.refresh_time = token_info.refresh_time
        } catch (e) {
        }
    }, baseFunc.has_base_data = function (_cookie_data, callback) {
        var data = this.base_params, env = data.sub_env;
        if ("gdjl_1" == env) return this.get_starcor_base(starcorExt), starcorExt.set_global_callback("token_update", this.Interval_starcor_token), void(is_function(callback) && callback());
        if ("gdjl_2" == env || "fml_2" == env) {
            data.device_id = android.get_device_id(), data.mac_id = android.get_mac_info(), data.user_id = android.get_user_id(), data.web_token = android.get_webtoken();
            try {
                data.area_code = android.get_area_code() || ""
            } catch (e) {
                data.area_code = ""
            }
            return void(is_function(callback) && callback())
        }
        this.utility_apk(), data = this.base_params, _cookie_data && _cookie_data.device_id == data.device_id ? (clone(_cookie_data, data), data = this.base_params = _cookie_data, set_cookie("middle_user_info", data)) : (data.user_id && delete this.base_params.user_id, data.web_token = null);
        var web_token = data.web_token, device_id = data.device_id;
        device_id ? web_token ? this.token_is_effective(this.get_base_post_data("scaaa_device_auth"), callback) : this.updata_token(this.get_base_post_data("scaaa_device_auth"), callback) : alert("设备不存在")
    }, baseFunc.analysis_N1_interface = function (data, env) {
        function common_func(_obj, key) {
            var is_cdn = "cdns" == key, k = is_cdn ? "c_" : "a_", len = is_cdn ? 0 : 9;
            for (var attr in _obj) if ("group" != attr && indexOf(detail_interface, attr.substr(len, attr.indexOf("_")).toUpperCase()) != -1) {
                var _value = _obj[attr];
                cdnRule[key][attr] = _value;
                var index = indexOf(obj[k + "u"], _value);
                index == -1 && (obj[k + "u"].push(_value), index = obj[k + "u"].length - 1), obj[k + "m"][attr] = index
            }
        }

        if (data) {
            var obj = {b_u: [], c_u: [], a_u: [], b_m: {}, c_m: {}, a_m: {}, d: []},
                detail_interface = ["N7", "N39", "N21", "N40", "N41", "N50", "N51", "N60", "N215", "N2", "N36", "N3", "N24", "N82", "N217", "N219"],
                cdnRule = window.cdnRule, _params = {};
            for (key in data) {
                var _data = data[key];
                if ("parameter_list" !== key && "header" !== key) {
                    if (indexOf(detail_interface, key.substr(0, key.indexOf("_")).toUpperCase()) != -1) {
                        var attrName = key.toUpperCase();
                        ajax_v2.urls[attrName] = _data.url;
                        var index_u = 0;
                        for (b_item in _data) if ("url" == b_item) {
                            var url = _data[b_item] || "", h = url.match(/^http.?\:\/\/[^\/]+\//)[0],
                                dir = url.replace(/^http.?\:\/\/[^\/]+\//, "").replace(/(.*)\/{1}.*/, "$1");
                            index_u = indexOf(obj.b_u, h), index_u == -1 && (obj.b_u.push(h), index_u = obj.b_u.length - 1), index_d = indexOf(obj.d, dir), index_d == -1 && (obj.d.push(dir), index_d = obj.d.length - 1), obj.b_m[key] = [index_u, index_d]
                        }
                    }
                } else if ("parameter_list" == key && _data && _data.length > 0) {
                    for (var num = 0, len = _data.length; num < len; num++) {
                        var _obj = _data[num];
                        if ("CDN" == _obj.group) common_func(_obj, "cdns"); else if ("API_HOST" == _obj.group) common_func(_obj, "api_host"); else for (var attr in _obj) {
                            _params[attr] = _obj[attr];
                            break
                        }
                    }
                    baseFunc.base_params.N1_data = _params, obj.params = _params
                }
            }
            "other" == env && set_cookie("stb_url", obj)
        }
    }, baseFunc.analysis_N1_cookie = function (stb_url) {
        var data = stringToJson(stb_url), cdnRule = window.cdnRule;
        if (data) {
            var base_map = data.b_m, base_url = data.b_u, dir = data.d;
            for (var key in base_map) {
                var _data = base_map[key], attrName = key.toUpperCase();
                ajax_v2.urls[attrName] = base_url[_data[0]] + dir[_data[1]] + "/" + interface_method[attrName]
            }
            var cdn_map = data.c_m, cdn_url = data.c_u;
            for (key in cdn_map) cdnRule.cdns[key] = cdn_url[cdn_map[key]];
            var api_map = data.a_m, api_url = data.a_u;
            for (key in api_map) cdnRule.api_host[key] = api_url[api_map[key]];
            var _params = data.params;
            baseFunc.base_params.N1_data = _params
        }
    }, baseFunc.has_stb_url = function (callback) {
        var base_params = this.base_params, env = base_params.sub_env;
        if ("gdjl_1" == env) this.stb_url = starcorExt.getEpgInterfaceData(), this.analysis_N1_interface(JSON.parse(this.stb_url), env), baseFunc.has_base_data(null, callback); else if ("fml_1" == env) {
            var stb_url = get_cookie("stb_url"), _cookie_data = get_cookie("middle_user_info");
            !stb_url || _cookie_data && _cookie_data.epg_host != base_params.epg_host ? ajax_v2.get_base_data(base_params.epg_host, function (res) {
                baseFunc.analysis_N1_interface(res, env), baseFunc.has_base_data(_cookie_data, callback)
            }) : (this.analysis_N1_cookie(stb_url), this.has_base_data(_cookie_data, callback))
        }
    }, baseFunc.token_is_effective = function (params, callback) {
        var base_params = this.base_params;
        params.nns_func = "scaaa_auth_token", nw_ajax_v2.get_data("N215_A", params, function (res) {
            "300000" != res.result.state ? (base_params.web_token = "", params.nns_func = "scaaa_device_auth", baseFunc.updata_token(params, callback)) : baseFunc.refresh_token(params, callback)
        })
    }, baseFunc.refresh_token = function (params, callback) {
        params.nns_func = "scaaa_refresh_token";
        var base_params = this.base_params;
        nw_ajax_v2.get_data("N215_A", params, function (res) {
            if ("300000" == res.result.state) {
                var _data = res.auth;
                base_params.web_token = _data.web_token, base_params.valid_time = _data.valid_time, base_params.refresh_time = _data.refresh_time, res.user && res.user.id && (baseFunc.base_params.user_id = res.user.id), set_cookie("middle_user_info", baseFunc.base_params), callback()
            } else params.nns_func = "scaaa_device_auth", baseFunc.updata_token(params, callback)
        })
    }, baseFunc.updata_token = function (params, callback) {
        var base_params = this.base_params;
        nw_ajax_v2.get_data("N215_A", params, function (res) {
            if (3e5 == res.result.state) {
                var _data = res.auth;
                base_params.web_token = _data.web_token, base_params.valid_time = _data.valid_time, base_params.refresh_time = _data.refresh_time, res.user && res.user.id && (base_params.user_id = res.user.id), set_cookie("middle_user_info", base_params), callback(res)
            } else alert(res.result.state + " 用户认证失败!")
        })
    };
    var interval_times = null;
    baseFunc.Interval_updata_token = function (params) {
        clearTimeout(interval_times);
        var base_params = baseFunc.base_params, refresh_time = parseInt(baseFunc.base_params.refresh_time, 10),
            times = 1e3 * refresh_time, is_starcor = "gdjl_1" == base_params.sub_env,
            timeout_time = times > 2147483640 ? 2147483640 : times;
        interval_times = window.setTimeout(function () {
            if (is_starcor) {
                var _data = stringToJson(starcorExt.getTokenInfo());
                base_params.web_token = _data.webtoken, base_params.refresh_time = _data.refresh_time, set_cookie("middle_user_info", base_params), baseFunc.Interval_updata_token(params)
            } else baseFunc.refresh_token(params, function () {
                params.nns_webtoken = base_params.web_token, baseFunc.Interval_updata_token(params)
            })
        }, timeout_time)
    };
    var starcorCom = {};
    starcorCom.get_cp_id = function () {
        return baseFunc.base_params.cp_id
    }, starcorCom.get_version = function () {
        return baseFunc.base_params.version
    }, starcorCom.get_token = function () {
        return baseFunc.base_params.web_token
    }, starcorCom.get_env = function () {
        return baseFunc.base_params.env
    }, starcorCom.get_sub_env = function () {
        return baseFunc.base_params.sub_env
    }, starcorCom.get_tag = function () {
        return baseFunc.base_params.tag
    }, starcorCom.get_user_id = function () {
        return baseFunc.base_params.user_id
    }, starcorCom.get_epg_host = function () {
        return baseFunc.base_params.epg_host
    }, starcorCom.get_device_id = function () {
        return baseFunc.base_params.device_id
    }, starcorCom.get_service_type = function () {
        return baseFunc.base_params.service_type
    }, starcorCom.get_config_data = function () {
        return cpcom_config
    }, starcorCom.get_N1_params = function (key) {
        var env = starcorCom.get_sub_env(), _data = "";
        if ("gdjl_2" == env || "fml_2" == env) try {
            _data = android.getUrlEnter(key)
        } catch (e) {
            _data = ""
        } else {
            var data = baseFunc.base_params.N1_data;
            _data = key ? data[key] : data
        }
        return _data
    }, starcorCom.packet_interface = function (params, callback, error) {
        request("N3_A_E", params, callback, error)
    }, starcorCom.get_area_code = function (callback) {
        var env = starcorCom.get_sub_env();
        if ("" != ip_area_code) return void(is_function(callback) && callback(ip_area_code));
        if ("gdjl_1" == env) {
            var area_code = starcorExt.getBaseInfo("getAreaCode");
            ip_area_code = area_code, is_function(callback) && callback(area_code)
        } else if ("gdjl_2" === env || "fml_2" === env) {
            var area_code = "";
            try {
                area_code = android.get_area_code() || ""
            } catch (e) {
            }
            ip_area_code = area_code, is_function(callback) && callback(area_code)
        } else {
            var params = {nns_func: "get_ability_version_by_initial"};
            request("N41_A", params, function (resp) {
                var area_code = resp && resp.i.area_code || "";
                ip_area_code = area_code, is_function(callback) && callback(area_code)
            })
        }
    }, starcorCom.get_area_code_v2 = function () {
        var env = starcorCom.get_sub_env();
        if ("gdjl_1" == env) return starcorExt.getBaseInfo("getAreaCode");
        if ("gdjl_2" === env) return android.get_area_code();
        if ("fml_2" === env) try {
            return android.getBoxInfo("AREAID")
        } catch (e) {
            return "30130"
        } else try {
            return utility.getSystemInfo("ARC")
        } catch (e) {
            return "30130"
        }
    }, starcorCom.get_ipqam_area_code = function () {
        return starcorCom.get_area_code_v2()
    }, starcorCom.get_area_code_original = function (callback) {
        starcorCom.get_user_info(function (resp) {
            var _state = resp.result.state, _obj = {};
            3e5 == _state && (_obj.boss_city = resp.user.boss_city || "", _obj.boss_patch = resp.user.boss_patch || "", _obj.boss_scope = resp.user.boss_scope || ""), "function" == typeof callback && callback(_obj)
        })
    }, starcorCom.path_sav = function (data) {
        if ("object" == typeof android) if ("string" == typeof data) android.path_sav(data); else {
            var url = location.href;
            for (var key in data) url = url.replaceQueryStr(data[key], key);
            android.path_sav(url)
        } else $Path.sav(data)
    }, starcorCom.path_back = function () {
        "object" == typeof android ? android.path_back() : $Path.back()
    }, starcorCom.cancel_request = function () {
        ajax_v2.cancel_request()
    }, starcorCom.request = function (number, params, callback, func_name) {
        request(number, params, callback, func_name)
    }, starcorCom.get_interface_data = function (no, params, callack, func) {
        request(no, params, callack, func)
    }, starcorCom.create_order = function (order_product, _channel, callback) {
        var p_data = {};
        clone(p_data, order_product);
        var _price = order_product.price / 100;
        if (p_data.price = _price, "undefined" == typeof p_data.order_price) {
            var _discount = p_data.discount || {};
            _discount && _discount.rule_id ? (p_data.product_num = _discount.need_purchased_times, p_data.rule_id = _discount.ruler_id, "fixed_price" == _discount.discount_type.type_name ? p_data.order_price = _discount.discount : p_data.order_price = _price * _discount.need_purchased_times * parseFloat(_discount.discount), p_data.money = _price * _discount.need_purchased_times) : (p_data.product_num = 1, p_data.money = _price, p_data.order_price = _price)
        }
        2 == arguments.length && is_function(_channel) && (callback = _channel, _channel = {}), create_order_id(p_data, _channel, callback)
    };
    var pay_loading = !1;
    starcorCom.product_order = function (option) {
        if (!pay_loading) {
            pay_loading = !0;
            var _option = {
                pay_type: 1, success_callback: function (res) {
                }
            };
            clone(_option, option);
            var __product = {};
            if (clone(__product, _option.product), 1 == _option.pay_type && _option.product && is_undefined(_option.product.order_price) && (discount_price_func(__product, __product.discount, !0), _option.product = __product), "function" == typeof gz_pay) gz_pay(_option), pay_loading = !1; else {
                // var _url = cpcom_config.pay_resource_url || "../";
                var _url = "../";
                load_js(_url + "pay.js", function () {
                    gz_pay(_option), pay_loading = !1
                })
            }
        }
    }, starcorCom.boss_pay = function (order_data, callback) {
        request("N60_A", {
            nns_func: "boss_wallet_pay",
            nns_channel_id: order_data.channel_id,
            nns_mode_id: order_data.mode_id,
            nns_order_id: order_data.order_id
        }, function (_pay_resp) {
            callback(_pay_resp)
        })
    }, starcorCom.weixin_pay_scan = function (order_data, callback) {
        request("N60_A", {
            nns_func: "weixinpay_scan_pay",
            nns_order_id: order_data.order_id,
            nns_channel_id: order_data.channel_id,
            nns_mode_id: order_data.mode_id,
            nns_money: order_data.order_money,
            nns_product_id: order_data.product_id
        }, function (_pay_resp) {
            callback(_pay_resp)
        })
    }, starcorCom.alipay_scan = function (order_data, callback) {
        request("N60_A", {
            nns_func: "alipay_qr_pay",
            nns_order_id: order_data.order_id,
            nns_channel_id: order_data.channel_id,
            nns_mode_id: order_data.mode_id,
            nns_money: order_data.order_money,
            nns_product_id: order_data.product_id
        }, function (_pay_resp) {
            callback(_pay_resp)
        })
    }, starcorCom.get_lous_usage = function (callback) {
        request("N60_A", {nns_func: "get_lous_usage"}, function (res) {
            callback(res)
        })
    }, starcorCom.get_lous_list = function (params, callback) {
        request("N60_A", params, callback, "get_lous_list")
    }, starcorCom.lous_pay = function (params, callback) {
        request("N60_A", params, callback, "lous_pay")
    }, starcorCom.order_product = function (order_product, channel_obj, callback) {
        var p_data = {};
        clone(p_data, order_product);
        var _price = order_product.price / 100;
        if (p_data.price = _price, order_product.discount) {
            var _discount = order_product.discount;
            p_data.product_num = _discount.need_purchased_times, p_data.rule_id = _discount.ruler_id, "fixed_price" == _discount.discount_type.type_name ? p_data.order_price = _discount.discount : p_data.order_price = _price * _discount.need_purchased_times * parseFloat(_discount.discount), p_data.money = _price * _discount.need_purchased_times
        } else p_data.product_num = 1, p_data.money = _price, p_data.order_price = _price;
        var _id = channel_obj.id;
        if (channel_obj.partner_id = nns_partner_id, "boss_pay" == _id) starcorCom._channel_obj = channel_obj, create_order_id(p_data, channel_obj, function (resp) {
            var _channel_obj = starcorCom._channel_obj;
            0 == resp.result.state ? request("N60_A", {
                nns_func: "boss_wallet_pay",
                nns_channel_id: _channel_obj.id,
                nns_mode_id: _channel_obj.mode.id,
                nns_order_id: resp.pay_order.id
            }, function (_pay_resp) {
                var mess = 0 == _pay_resp.result.state ? "订购成功" : "订购失败",
                    _data = {message: mess, output: {serialno: resp.pay_order.id}, state: _pay_resp.result.state};
                _pay_resp.data = _data, callback(_pay_resp)
            }) : callback(resp)
        }); else {
            var cp_id = baseFunc.base_params.cp_id || "",
                __str = cpcom_config.zf_url + "?price=" + _price + "&product_id=" + order_product.product_id + "&unit=" + order_product.unit + "&currency_type=" + order_product.currency_type + "&product_fee_id=" + order_product.product_fee_id + "&product_num=" + p_data.product_num + "&money=" + p_data.money + "&order_price=" + p_data.order_price + "&product_name=" + encodeURIComponent(order_product.product_name) + "&cp_id=" + cp_id;
            order_product.video_id && (__str += "&video_id=" + order_product.video_id), order_product.video_type && (__str += "&video_type=" + order_product.video_type), order_product.discount && (__str += "&rule_id=" + p_data.rule_id + "&rule_name=" + encodeURIComponent(order_product.discount.ruler_name_chn)), window.location.href = __str + "&return_url=" + encodeURIComponent(window.location.href)
        }
    }, starcorCom._channel_obj = null, starcorCom.usewx_by_product = function (order_product, channel_obj, callback) {
        starcorCom._channel_obj = channel_obj, create_order_id(order_product, channel_obj, function (resp) {
            var _channel_obj = starcorCom._channel_obj;
            0 == resp.result.state ? request("N60_A", {
                nns_func: "weixinpay_scan_pay",
                nns_order_id: resp.pay_order.id,
                nns_channel_id: _channel_obj.id,
                nns_mode_id: _channel_obj.mode.id,
                nns_money: resp.buy_order.order_total_price,
                nns_product_id: resp.buy_order.product_id
            }, function (_pay_resp) {
                _pay_resp.order_id = resp.pay_order.id, callback(_pay_resp)
            }) : callback(resp)
        })
    }, starcorCom.check_order = function (order_id, product_id, callback) {
        request("N60_A", {
            nns_func: "business_status_query",
            nns_business_id: order_id,
            nns_action: "polling",
            nns_product_id: product_id
        }, callback)
    }, starcorCom.query_order = function (order_id, product_id, callback) {
        request("N60_A", {
            nns_func: "business_status_query",
            nns_business_id: order_id,
            nns_action: "query",
            nns_product_id: product_id
        }, callback)
    }, starcorCom.get_user_info = function (callback) {
        request("N217_A", {nns_func: "scaaa_get_user_info"}, function (resp) {
            callback(resp)
        })
    }, starcorCom.get_balance = function (callback) {
        request("N217_A", {nns_func: "scaaa_get_user_info"}, function (resp) {
            var _state = resp.result.state, balance_obj = {state: _state, balance: 0, reason: resp.result.reason};
            3e5 == _state && (balance_obj.balance = resp.user.money), callback(balance_obj)
        })
    }, starcorCom.get_user_pay_list = function (params, callback) {
        request("N60_A", params, callback, "get_user_pay_list")
    }, starcorCom.get_pay_channel_list = function (product_id, callback, is_get_all) {
        var param = {nns_func: "get_pay_channel_list", nns_partner_id: nns_partner_id};
        1 == arguments.length ? (callback = product_id, product_id = "") : 2 == arguments.length && "function" != typeof callback && (is_get_all = callback, callback = product_id, product_id = ""), is_get_all = is_get_all || !1, product_id && (param.nns_product_id = product_id), request("N60_A", param, function (data) {
            var _channel_data = [];
            if (data && data.channel_list) {
                for (var _data = data.channel_list, i = 0, len = _data.length; i < len; i++) {
                    var __data = _data[i];
                    __data.mode ? __data.mode : {}, __data.mode.name = __data.name;
                    var _p_id = __data.pay_platform_id;
                    if (is_get_all) {
                        var is_lous = "boss_pay" == _p_id && ("" == __data.mode.id || "lous_payment" == __data.mode.id),
                            cp_id = baseFunc.base_params.cp_id;
                        (!is_lous || is_lous && !(white_list && white_list.indexOf(cp_id) == -1 || "" === white_list)) && _channel_data.push(__data)
                    } else "weixin_pay" == _p_id ? _channel_data.push(__data) : "boss_pay" != _p_id || "" != __data.mode.id && "wallet_payment" != __data.mode.id || _channel_data.unshift(__data)
                }
                data.channel_list = _channel_data
            }
            "function" == typeof callback && callback(data)
        })
    }, starcorCom.get_ordered_product_list = function (param, callback) {
        request("N219_A", param, callback, "scaaa_get_ordered_product_list")
    }, starcorCom.get_order_history_list = function (param, callback) {
        request("N219_A", param, callback, "scaaa_get_order_history_list")
    }, starcorCom.exchange_video_coupon = function (param, callback) {
        param = param || {}, is_function(), is_undefined(param.nns_order_type) && (param.nns_order_type = "exchange_card"), request("N219_A", param, callback, "exchange_video_coupon")
    }, starcorCom.auth_play = function (params, callback, has_product) {
        function _common() {
            function auth_dufault_que(resp) {
                var _state = resp.result ? resp.result.state : "";
                1 == _state || 4 == _state || 31 == _state || 35 == _state || 39 == _state ? starcorCom.get_buy_product_list({
                    nns_product_id: resp.buy_information,
                    has_jfcl: params.has_jfcl
                }, function (p_resp) {
                    var __pstate_ = p_resp.result.state;
                    resp.get_product_state = __pstate_, resp.get_product_substate = p_resp.result.sub_state, resp.get_product_reason = p_resp.result.reason, 3e5 == __pstate_ ? resp.order_list = p_resp.product : resp.order_list = [], callback(resp)
                }) : callback(resp)
            }

            params.nns_func = "check_auth_by_media", 1 == has_product ? request("N51_A", params, auth_dufault_que) : request("N51_A", params, callback)
        }

        is_undefined(params.nns_area_code) && "" == ip_area_code ? starcorCom.get_area_code(function (nns_area_code) {
            params.nns_area_code = nns_area_code, _common()
        }) : (params.nns_area_code = params.nns_area_code || ip_area_code, _common())
    }, starcorCom.apply_play = function (params, callback) {
        params.nns_func = "check_auth_and_get_media_by_media", is_undefined(params.nns_area_code) && "" == ip_area_code ? starcorCom.get_area_code(function (nns_area_code) {
            params.nns_area_code = nns_area_code, params.nns_ipqam_area_code = params.nns_ipqam_area_code || starcorCom.get_area_code_v2(), request("N51_A", params, callback)
        }) : (params.nns_area_code = params.nns_area_code || ip_area_code, params.nns_ipqam_area_code = params.nns_ipqam_area_code || starcorCom.get_area_code_v2(), request("N51_A", params, callback))
    }, starcorCom.get_ad_all_info_by_ad_pos = function (params, callback) {
        request("N7_A", params, callback, "get_ad_all_info_by_ad_pos")
    }, starcorCom.get_video_ad_pos = function (params, callback) {
        request("N7_A", params, callback, "get_ad_info_by_video_id")
    }, starcorCom.get_ad_info_by_ad_pos = function (params, callback) {
        request("N7_A", params, callback, "get_ad_info_by_ad_pos")
    }, starcorCom.get_collect_list = function (params, callback) {
        request("N40_A", params, callback, "get_collect_list_v2")
    }, starcorCom.add_collect = function (params, callback) {
        request("N40_A", params, callback, "add_collect_v2")
    }, starcorCom.delete_collect = function (params, callback) {
        request("N40_A", params, callback, "delete_collect_v2")
    }, starcorCom.get_playlist = function (params, callback) {
        request("N40_A", params, callback, "get_playlist_v2")
    }, starcorCom.add_playlist = function (params, callback) {
        request("N40_A", params, callback, "add_playlist_v2")
    }, starcorCom.delete_playlist = function (params, callback) {
        request("N40_A", params, callback, "delete_playlist_v2")
    }, starcorCom.get_catch_list = function (params, callback) {
        request("N40_A", params, callback, "get_catch_list_v2")
    }, starcorCom.add_catch = function (params, callback) {
        request("N40_A", params, callback, "add_catch_v2")
    }, starcorCom.delete_catch = function (params, callback) {
        request("N40_A", params, callback, "delete_catch_v2")
    }, starcorCom.get_hot_words = function (params, callback) {
        request("N21_A", params, callback, "hot_word_list")
    }, starcorCom.get_special_info = function (params, callback) {
        request("N24_A", params, callback, "get_special_info")
    }, starcorCom.get_special_item_list = function (params, callback) {
        request("N24_A", params, callback, "get_special_item_list")
    }, starcorCom.search_special_item = function (params, callback) {
        request("N24_A", params, callback, "search_special_item")
    }, starcorCom.get_special_online = function (params, callback) {
        request("N24_A", params, callback, "get_special_online")
    }, starcorCom.get_special_info_by_ids = function (params, callback) {
        request("N24_A", params, callback, "get_special_info_by_ids")
    }, starcorCom.get_home_data = function (params, callback) {
        request("N36_A", params, callback, "get_init_meta_data")
    }, starcorCom.get_media_assets_class = function (params, callback) {
        request("N39_A", params, callback, "get_media_assets_info_v2")
    }, starcorCom.get_media_assets_list = function (params, callback) {
        request("N39_A", params, callback, "get_media_asset_list_v2")
    }, starcorCom.get_media_assets_bind_labels = function (params, callback) {
        request("N39_A", params, callback, "get_media_assets_bind_labels_v2")
    }, starcorCom.get_video_info = function (params, callback) {
        request("N39_A", params, callback, "get_video_info_v3")
    }, starcorCom.get_video_recom_video = function (params, callback) {
        request("N39_A", params, callback, "get_video_recom_video")
    }, starcorCom.get_video_index_list = function (params, callback) {
        request("N39_A", params, callback, "get_video_index_list")
    }, starcorCom.search_media_assets = function (params, callback) {
        request("N39_A", params, callback, "search_media_assets_item_v2")
    }, starcorCom.transformat_keys = function (params, callback) {
        request("N39_A", params, callback, "transformat_keys")
    }, starcorCom.get_current_playbill = function (params, callback) {
        request("N39_A", params, callback, "get_current_playbill")
    }, starcorCom.get_channel_list = function (params, callback) {
        request("N39_A", params, callback, "get_channel_list")
    }, starcorCom.get_playbill_by_days = function (params, callback) {
        request("N39_A", params, callback, "get_playbill_by_days")
    }, starcorCom.get_media_assets_list_by_labels = function (params, callback) {
        request("N3_A_D", params, callback, "get_media_assets_item_by_labels")
    }, starcorCom.get_media_assets_list_by_labels_v2 = function (params, callback) {
        params = params || {};
        var _m_c_id = params.nns_media_assets_category_id;
        is_undefined(_m_c_id) || (_m_c_id = _m_c_id.replace(/#/g, "@@@"), params.nns_media_assets_category_id = _m_c_id), request("N39_A", params, callback, "get_media_assets_item_by_labels_v2")
    }, starcorCom.get_actor_star_info = function (params, callback) {
        request("N39_A", params, callback, "get_actor_star_info")
    }, starcorCom.get_cp_list = function (params, callback) {
        request("N82_A", params, callback, "get_cp_list")
    }, starcorCom.get_buy_product_list = function (params, callback) {
        function recombination_order_list(data) {
            function get_discount(product_id) {
                starcorCom.get_product_discount_list({nns_product_id: product_id}, function (discount_resp) {
                    var __state = discount_resp.result.state;
                    if ("300000" == __state) for (var _discount_list = discount_resp.discount_list, j = 0, _d_len = _discount_list.length; j < _d_len; j++) {
                        var product_list = {};
                        clone(product_list, __product_list[idx]), discount_price_func(product_list, _discount_list[j]), __order_list.push(product_list)
                    } else discount_price_func(__product_list[idx]), __order_list.push(__product_list[idx]);
                    idx++, ++i < _len ? get_discount(__product_list[idx].product_id) : "function" == typeof callback && (data.product = __order_list, callback(data))
                })
            }

            var __pstate_ = data.result.state;
            if (3e5 == __pstate_) {
                var __product_list = data.product, _len = __product_list.length, __order_list = [], idx = 0, i = 0;
                _len > 0 ? get_discount(__product_list[idx].product_id) : "function" == typeof callback && (data.product = [], callback(data))
            } else "function" == typeof callback && callback(data)
        }

        var has_jfcl = params.has_jfcl || !1;
        has_jfcl ? request("N219_A", params, recombination_order_list, "scaaa_get_buy_product_list") : request("N219_A", params, callback, "scaaa_get_buy_product_list")
    }, starcorCom.get_product_discount_list = function (params, callback) {
        request("N219_A", params, callback, "scaaa_get_product_discount_list")
    }, starcorCom.get_system_time = function (callback) {
        baseFunc.get_system_time(callback)
    }, starcorCom.Player_vod = function (params) {
        var env = starcorCom.get_sub_env();
        if ("gdjl_1" == env) {
            var data = {
                video_id: params.video_id,
                video_index: params.video_index,
                position: params.position,
                source: params.source || "STARCOR"
            };
            starcorCom.go_starcor_play(data);
            var _back_url = params.back_url || "";
            "" != _back_url && _back_url.split("?")[0] != location.href.split("?")[0] && (location.href = _back_url)
        } else if ("gdjl_2" === env || "fml_2" === env) {
            var type = params.call_mode || "play_stream", data = "";
            if ("play_stream" == type && params.video_rtsp) data = {
                type: type,
                option: {position: params.position || 0, video_rtsp: params.video_rtsp}
            }; else {
                if ("media" != type || !params.video_id) return void console.warn("播放串模式未传播放串，或媒资模式未传video_id");
                data = {
                    type: type,
                    option: {
                        position: params.position || 0,
                        video_type: params.video_type || "",
                        video_index: params.video_index || "",
                        video_id: params.video_id || "",
                        video_name: params.video_name || ""
                    }
                }
            }
            var _back_url = params.back_url || location.href;
            go_fml_gdjl_player(data, _back_url)
        } else {
            var data = {
                position: params.position,
                call_mode: params.call_mode || "play_stream",
                is_play_continuous: params.is_play_continuous || !1
            }, is_meida = "media" == data.call_mode, _data = {video_name: params.video_name};
            is_meida ? _data = {
                video_type: params.video_type,
                video_index: params.video_index,
                video_id: params.video_id,
                video_name: params.video_name
            } : data.video_rtsp = params.video_rtsp || "", data.video_data = _data, params.back_url && starcorCom.path_sav(params.back_url), go_tongzhou_player(data, is_meida)
        }
    }, starcorCom.go_starcor_detail_page = function (params) {
        var intent = {
            action: "com.starcor.gzgd.app.general.action",
            extras: {
                source: "com.starcor.gzgd.app",
                data: {
                    cmd: "showDetail",
                    cp_video_id: params.cp_video_id,
                    cp_asset_id: params.cp_asset_id,
                    cp_category_id: params.cp_category_id,
                    cp_id: params.cp_id,
                    source: params.source || "STARCOR"
                }
            },
            flags: ["INCLUDE_STOPPED_PACKAGES"]
        };
        try {
            starcorExt.sendIntent("sendBroadcast", intent)
        } catch (e) {
        }
    }, starcorCom.go_starcor_play = function (params) {
        var data = {
            cmd: "playVideo",
            cp_video_id: params.video_id,
            cp_video_index: params.video_index || 0,
            position: params.position || 0,
            source: params.source || "STARCOR"
        };
        if ("undefined" == typeof android) {
            var intent = {
                action: "com.starcor.gzgd.app.general.action",
                extras: {source: "com.starcor.gzgd.app", data: data},
                flags: ["INCLUDE_STOPPED_PACKAGES"]
            };
            starcorExt.sendIntent("sendBroadcast", intent)
        } else {
            var params = jsonToString(data);
            android.go_starcor_play(params)
        }
    }, starcorCom.go_starcor_play_v2 = function (params) {
        var data = {
            cmd: params.cmd,
            video_id: params.video_id,
            day: params.day,
            start_time: params.start_time,
            source: params.source || "STARCOR"
        };
        "undefined" != typeof params.duration && (data.duration = params.duration);
        var intent = {
            action: "com.starcor.gzgd.app.general.action",
            extras: {source: "com.starcor.gzgd.app", data: data},
            flags: ["INCLUDE_STOPPED_PACKAGES"]
        };
        try {
            starcorExt.sendIntent("sendBroadcast", intent)
        } catch (e) {
        }
    }, starcorCom.create_miniPlayer = function (x, y, w, h) {
        return "undefined" == typeof android ? starcorExt.exec("creatPlayer", x + "", y + "", w + "", h + "") : android.create_miniPlayer(x + "", y + "", w + "", h + "")
    }, starcorCom.play_miniVideo = function (mini_player_id, video_id, video_third_id, video_index, position, source) {
        if ("undefined" == typeof android) return starcorExt.exec("playVideo", mini_player_id, video_id, video_third_id, video_index, position, source);
        position = position || 0;
        var pos = Math.ceil(position / 1e3);
        return android.play_miniVideo(mini_player_id, video_id, video_index, pos, source)
    }, starcorCom.pause_miniPlayer = function (mini_player_id) {
        return "undefined" == typeof android ? starcorExt.exec("pause", mini_player_id) : android.pause_miniPlayer(mini_player_id)
    }, starcorCom.stop_miniPlayer = function (mini_player_id) {
        return "undefined" == typeof android ? starcorExt.exec("stop", mini_player_id) : android.stop_miniPlayer(mini_player_id)
    }, starcorCom.stop_and_display = function (mini_player_id, setDisplayNull) {
        if ("undefined" == typeof android) {
            var setDisplayNull = setDisplayNull || !1;
            return starcorExt.exec("stop", mini_player_id, setDisplayNull.toString())
        }
    }, starcorCom.destroy_miniPlayer = function (mini_player_id) {
        return "undefined" == typeof android ? starcorExt.exec("destroy", mini_player_id) : android.destroy_miniPlayer(mini_player_id)
    }, starcorCom.get_miniVideo_duration = function (mini_player_id) {
        if ("undefined" == typeof android) return starcorExt.exec("getDuration", mini_player_id);
        var _time_len = android.get_miniPlayer_duration(mini_player_id);
        return 1e3 * _time_len
    }, starcorCom.get_miniVideo_current = function (mini_player_id) {
        if ("undefined" == typeof android) return starcorExt.exec("getCurrentPosition", mini_player_id);
        var _time_len = android.get_miniVideo_current(mini_player_id) || 0;
        return 1e3 * _time_len
    }, starcorCom.miniPlayer_seekTo = function (mini_player_id, pos) {
        if ("undefined" == typeof android) return starcorExt.exec("seekTo", mini_player_id, pos);
        var position = Math.ceil(pos / 1e3);
        return android.miniPlayer_seekTo(mini_player_id, position)
    }, starcorCom.get_miniPlayer_state = function (mini_player_id) {
        return "undefined" == typeof android ? starcorExt.exec("getPlayerState", mini_player_id) : android.get_miniPlayer_state(mini_player_id)
    }, starcorCom.go_on_play = function (mini_player_id) {
        return "undefined" == typeof android ? starcorExt.exec("play", mini_player_id) : android.go_on_play(mini_player_id)
    }, starcorCom.set_player_position = function (mini_player_id, x, y, w, h) {
        return "undefined" == typeof android ? starcorExt.exec("setPlayerPosAndWH", mini_player_id, x, y, w, h) : android.resize_miniPlayer(mini_player_id, x, y, w, h)
    }, starcorCom.play_video_by_url = function (mini_player_id, url, position) {
        var position = position || "0";
        if ("undefined" == typeof android) return starcorExt.exec("playVideoByUrl", mini_player_id, url, position);
        var _position = position || 0, _pos = parseInt(parseInt(_position, 10) / 1e3, 10);
        return android.play_urlVideo(mini_player_id, url, _pos)
    }, starcorCom.set_webview_alpha = function (alpha) {
        try {
            if ("undefined" == typeof android) {
                for (var _al = Number(Math.floor(255 * alpha)).toString(16), i = 0, len = 2 - (_al + "").length; i < len; i++) _al = "0" + _al;
                var bgColor = "#" + _al + "ffffff";
                return starcorExt.exec("bringWebToFront", bgColor)
            }
            var _alpha = Number(alpha);
            _alpha <= 1 && (_alpha = 0);
            var _type = 0 == _alpha ? "web" : "video";
            android.bringToForeground(_type)
        } catch (e) {
        }
    }, starcorCom.bind_play_event = function (player_id, callback) {
        var _env = starcorCom.get_sub_env();
        if ("gdjl_1" == _env) starcorExt.exec("setOnPreparedListener", player_id, function (_p_id) {
            callback(6)
        }), starcorExt.exec("setOnErrorListener", player_id, function (playerId, code, msg) {
            var _obj = {playerId: playerId, code: code, msg: msg};
            callback(500, _obj)
        }), starcorExt.exec("setOnSeekCompleteListener", player_id, function (playerId, pos) {
            var _obj = {playerId: playerId, pos: pos};
            callback(200, _obj)
        }), starcorExt.exec("setOnCompleteListener", player_id, function (playerId) {
            callback(8, playerId)
        }), starcorExt.exec("setOnBufferingListener", player_id, function (playerId, buffering, percentage) {
            var _obj = {playerId: playerId, buffering: buffering, percentage: percentage};
            callback(7, _obj);
        }), starcorExt.exec("setOnDestroyListener", player_id, function (playerId) {
            callback(5, playerId)
        }); else if ("fml_1" != _env) try {
            var code_change = {0: 6, 1: 500, 2: 8, 3: 301, 4: 302, 5: 303, 6: 304, 7: 305, 8: 306, 9: 307, 10: 308};
            window.onEvent = null, window.onEvent = function (e) {
                if ("undefined" != typeof e.type) {
                    var _type = parseInt(e.type, 10);
                    switch (_type = 3 == _type && "fml_2" == _env ? _type : 10, _type = code_change[_type] || _type) {
                        case 500:
                        case 301:
                        case 303:
                            var _obj = {playerId: player_id, code: e.errortype, msg: e.errorreson};
                            callback(_type, _obj);
                        default:
                            callback(_type)
                    }
                }
            }
        } catch (e) {
        }
    };
    var progress_lister_timer = null;
    starcorCom.set_progress_listener = function (player_id, callback) {
        var _env = starcorCom.get_sub_env();
        "gdjl_1" == _env ? starcorExt.exec("setOnProgressListener", player_id, function (playerId, pos) {
            callback(playerId, pos)
        }) : "fml_1" != _env && (clearInterval(progress_lister_timer), starcorCom.bind_play_event(playerId, function (_type) {
            0 == _type && (progress_lister_timer = setInterval(function () {
                callback(playerId, android.get_miniVideo_current(playerId))
            }, 500))
        }))
    }, starcorCom.go_pay = function (params, callback) {
        var _env = starcorCom.get_sub_env();
        if ("gdjl_1" == _env) {
            var intent = {
                action: "com.starcor.gzgd.app.authorities.pay",
                extras: {
                    cp_id: params.cp_id || baseFunc.base_params.cp_id,
                    package_name: params.package_name,
                    session_id: params.session_id,
                    cp_video_id: params.cp_video_id,
                    cp_index_id: params.cp_index_id,
                    cp_source_id: params.cp_source_id,
                    video_id: params.video_id,
                    video_index: params.video_index,
                    video_source_id: params.video_source_id,
                    products: params.products,
                    ex_data: params.ex_data
                },
                flags: ["NEW_TASK"]
            };
            is_function(callback) && (starcorCom.pay_result_callback = callback), starcorExt.sendIntent("sendBroadcast", intent)
        }
    }, starcorCom.on_purchase_vip_result = function (state) {
        is_function(starcorCom.pay_result_callback) && starcorCom.pay_result_callback(state)
    }, starcorCom.exit = function (func) {
        if (starcorExt) starcorExt.closeBrwoser("back");
        else if ("undefined" != typeof android) android.finish();
        else if ("function" == typeof func) func();
        else try {
            $Path.back()
        } catch (e) {
            history.go(-1)
        }
    }, starcorCom.apk_page_event = function (callback) {
        try {
            starcorExt.set_global_callback("page_event", callback)
        } catch (e) {
        }
    }, starcorCom.bind_key = function (ef) {
        function grab_event(e) {
            if (!is_loading) {
                var _code = e.which || e.keyCode;
                if (_code) {
                    switch (_code) {
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
                        case 32:
                            e.key_name = "menu";
                            break;
                        default:
                            var value = bind_number(_code);
                            "" != value && (e.key_name = "number", e.key_value = value)
                    }
                    ef.bind_key(e)
                }
            }
        }

        if (starcorExt) try {
            starcorExt.requestFocus(), starcorExt.setKeyEventHandler(function (action, keyCode, keyName, metaState) {
                if (!is_loading) {
                    var e = {keyCode: keyCode, key_name: keyName}, value = bind_number(keyCode);
                    "" != value && (e.key_name = "number", e.keyCode = value), ef.bind_key(e)
                }
            })
        } catch (e) {
            bind_document(ef)
        } else utility ? (document.onirkeypress = grab_event, document.onkeypress = grab_event) : bind_document(ef)
    };
    var apk_player = {};
    apk_player.init = function (option) {
        var _this = apk_player;
        if (option = option || {}, !is_function(option.errorCallback) && (option.errorCallback = function () {
            }), option.call_mode = option.call_mode || 1, _this.player_id && starcorCom.destroy_miniPlayer(_this.player_id), "object" != typeof android && starcorCom.set_webview_alpha(0), _this.player_id = starcorCom.create_miniPlayer.apply(starcorCom, option.position), 1 == option.call_mode) {
            if (!option.url) return void option.errorCallback({state: 1, reason: "url不能为空"});
            starcorCom.play_video_by_url(_this.player_id, option.url)
        } else {
            var _data = option.data;
            if (0 == _data.video_type) {
                var videoId = _data.video_id, videoIndex = _data.video_index || 0, position = data.play_len || 0,
                    source = "STARCOR";
                starcorCom.play_miniVideo(_this.video_id, videoId, videoIndex, position, source)
            } else {
                var params = {};
                for (var k in _data) params["nns_" + k] = _data[k];
                var _video_url = "";
                starcorCom.apply_play(params, function (res) {
                    if ("undefined" != typeof res.result.state) switch (_video_url = "", parseInt(res.result.state)) {
                        case 0:
                        case 6:
                            var url = res.video.index.media.url || "";
                            if (!url) {
                                starcorCom.play_video_by_url(_this.player_id, url);
                                break
                            }
                        default:
                            option.errorCallback({state: 2, reason: res.result.reason})
                    } else option.errorCallback({state: 2, reason: res.result.reason})
                })
            }
        }
        is_function(option.eventCallback) && starcorCom.bind_play_event(apk_player.player_id, callback)
    }, apk_player.setUrl = function (url, pos) {
        pos = pos || 0, starcorCom.play_video_by_url(apk_player.player_id, url, pos + "")
    }, apk_player.playerFull = function (mode) {
        var _page = this, PLYAER_SIZE = _page.position;
        if (_page.full_state = mode, mode) document.body.style.display = "none", starcorCom.set_player_position(_page.player_id, "0", "0", "1", "1"); else {
            var _arr = [_page.player_id].concat(PLYAER_SIZE);
            starcorCom.set_player_position.apply(starcorCom, _arr), document.body.style.display = "block"
        }
    }, apk_player.setVideoDisplayArea = function (x, y, w, h) {
        starcorCom.set_player_position(apk_player.player_id, x + "", y + "", w + "", h + "")
    }, apk_player.pause = function () {
        starcorCom.pause_miniPlayer(apk_player.player_id)
    }, apk_player.play = function () {
        starcorCom.go_on_play(apk_player.player_id)
    }, apk_player.stop = function () {
        starcorCom.stop_miniPlayer(apk_player.player_id)
    }, apk_player.destroy = function () {
        starcorCom.destroy_miniPlayer(apk_player.player_id)
    }, apk_player.seek = function (pos) {
        pos = pos || 0, starcorCom.get_miniVideo_current(apk_player.player_id, pos + "")
    }, apk_player.getDuration = function () {
        return starcorCom.get_miniVideo_duration(apk_player.player_id)
    }, apk_player.getCurrentPosition = function () {
        return starcorCom.get_miniVideo_current(apk_player.player_id)
    }, apk_player.getPlayerState = function () {
        return starcorCom.get_miniPlayer_state(apk_player.player_id)
    }, apk_player.bindEvent = function (callback) {
        !is_function(callback) && (callback = function () {
        }), starcorCom.bind_play_event(apk_player.player_id, callback)
    }, starcorCom.apkPlayer = apk_player, starcorCom.ready = function (callback) {
        baseFunc.ready_callback = callback
    }, starcorCom.reset_starcorCom = function (callback) {
        baseFunc.base_params = {tag: 26}, baseFunc.init(), baseFunc.ready_callback = callback
    };
    var $Path = {
        _globalName: "urlPathGlobalName", _splitChar: "#", _get: function () {
            this.cookie = void 0 == getGlobalVar(this._globalName) ? "" : getGlobalVar(this._globalName), this.urlArr = this.cookie.split(this._splitChar)
        }, _wr: function () {
            this.cookie = this.urlArr.join(this._splitChar), setGlobalVar(this._globalName, this.cookie)
        }, last: function () {
            return this._get(), this.urlArr[this.urlArr.length - 1]
        }, mod: function (data) {
            var url = location.href;
            for (key in data) url = url.replaceQueryStr(data[key], key);
            return this.url = url, this.url
        }, sav: function (data) {
            this._get();
            var urlArr = this.urlArr, url = location.href;
            "string" == typeof data ? (url = data, this.url = data) : this.mod(data);
            try {
                urlArr[urlArr.length - 1].match(/.*(?=\?)/)[0] == url.match(/.*(?=\?)/)[0] && urlArr.pop()
            } catch (e) {
                urlArr[urlArr.length - 1].split("?")[0] == url && urlArr.pop()
            }
            if (urlArr.push(this.url), urlArr.length > 6) {
                var newArr = urlArr.slice(urlArr.length - 6);
                this.urlArr = newArr.splice(0, 0, urlArr[1])
            }
            this._wr()
        }, back: function () {
            this._get();
            var href = this.urlArr.pop();
            this._wr(), href && "" != href || this.home(), location.href = href, "dvbplayer" == getQueryStr(location.href, "from") && utility.ioctlWrite("START_APP", "PackageName:com.coship.guizhou.dvb")
        }, home: function () {
            this.clear();
            try {
                utility.setEnv("portal_Form", ""), location.href = getGlobalVar("PORTAL_ADDR")
            } catch (e) {
            }
        }, clear: function () {
            setGlobalVar(this._globalName, "")
        }
    };
    String.prototype.replaceQueryStr = function (_replaceVal, _searchStr) {
        var tmp, restr = _searchStr + "=" + _replaceVal,
            rs = new RegExp("(^|)" + _searchStr + "=([^&]*)(&|$)", "g").exec(this), val = null;
        if ((tmp = rs) && (val = tmp[2]), null == val) return this.lastIndexOf("&") == this.length - 1 ? this + restr : this.lastIndexOf("?") >= 0 ? this + "&" + restr : this + "?" + restr;
        var shs = _searchStr + "=" + val;
        return this.lastIndexOf("?" + shs) >= 0 ? this.replace("?" + shs, "?" + restr) : this.replace("&" + shs, "&" + restr)
    }, baseFunc.init(), window.starcorCom = starcorCom
}(window);