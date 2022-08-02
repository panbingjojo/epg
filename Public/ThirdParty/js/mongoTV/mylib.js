// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 芒果TV（第三方）库js封装
// +----------------------------------------------------------------------
// | 说明：
// |    1、为避免业务模块需要，每个地方都要引入相关的多个文件，且该模块有变动时
// | 各个业务模块亦同步更改。为减轻此负担，内部统一引入相关文件即可。仅提供外部
// | 业务模块一个入口js文件，即当前js文件即可！
// |
// | 注意：
// |    1、由于服务器配置可能存在多级目录，为保证真实的资源路径（__ROOT__）：
// | 请引入该js文件前务必先引入lmcommon.js，因需要g_appRootPath。
// |    2、新添加代码，若有需要请局部格式化结构，切勿全局格式化（以保证关键代码
// | 结构化）。
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2020/3/5
// +----------------------------------------------------------------------

//********************* [统一引入核心库] *********************//
(function () {
    // 为加强代码做的额外保护
    var get_cookie_ex = function (c_name) {
        var c_value = "";
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start !== -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end === -1) c_end = document.cookie.length;
                c_value = unescape(document.cookie.substring(c_start, c_end));
            }
        }
        c_value = typeof c_value === "undefined" || c_value == null ? "" : c_value;
        return decodeURI(c_value);
    };

    // 内部引入核心库js
    try {
        var __phpROOT__ = typeof g_appRootPath !== "undefined" ? g_appRootPath : get_cookie_ex("c_app_root_path");//避免时序问题，重新获取根path
        document.writeln('<script type="text/javascript" src="' + __phpROOT__ + '/Public/ThirdParty/js/mongoTV/webview.js?t=' + Date.now() + '"></script>');
    } catch (e) {
        console.error(e);
    }
})();

//********************* [局方提供的代码块] *********************//

(function () {

    /**
     * 读取系统属性，返回函数
     * @param propName 属性名
     * @return {Function} 返回函数
     * @author hsong on 2020-3-5
     */
    var readSysProp = function (propName) {
        return function () {
            try {
                var propValue = Webview.readSystemProp(propName);
                console.debug("readSysProp(" + propName + ") val:" + (typeof propValue === "object" ? JSON.stringify(propValue) : propValue));
                return propValue;
            } catch (e) {
                console.error("readSysProp(" + propName + ") err:" + e.toString());
                return "";
            }
        }
    };

    var mylib = {
        "ajax_timeout": 5000, //设置ajax超时时间
    };

    /*aaa接口地址*/
    //mylib.aaa_url = "http://183.215.118.157:6600/aaa/"; //测试
    mylib.aaa_url = "http://111.23.13.56:6060/aaa/"; //正式

    /*会员中心获取活动信息的数据接口地址*/
    mylib.member_menter_url = "http://183.215.118.141:6600/MemberInterface/GetActiveInfo?";
    mylib.mg_url = "http://183.215.118.141:6600/MemberInterface/";

    //移动api数据
    mylib.api_url = "http://111.23.13.13:6600/epg/templates/mango_tv/api/";

    //数据埋点
    mylib.mg_url_stats = "http://183.215.118.103:6060/";

    //************* 统一定义信息函数，供启动登录/注册调用 *************//
    mylib.get_app_name          = readSysProp("app.name");                              //读取应用名
    mylib.get_app_version       = readSysProp("app.version");                           //读取应用版本
    mylib.get_user_id           = readSysProp("user.id");                               //读取用户id，未登录时值为空
    mylib.get_user_name         = readSysProp("user.name");                             //读取用户名，未登录时值为空
    mylib.get_user_token        = readSysProp("user.token");                            //读取用户token，未登录时值为空
    mylib.get_bindPhone         = readSysProp("bindPhone");                             //读取用户统一账号（别名）
    mylib.get_areaId            = readSysProp("areaId");                                //读取区域代码（电话区号）
    mylib.get_groupId           = readSysProp("groupId");                               //读取分组ID：0普通家庭用户，1酒店用户
    mylib.get_device_mac        = readSysProp("device.mac");                            //读取系统MAC（默认为有线网MAC）
    mylib.get_stbid             = readSysProp("stbid");                                 //读取机顶盒序列号（用于区分机顶盒）
    mylib.get_common_data       = readSysProp("common.data");                           //json对象包含manufacturers:厂商，model：型号，system_version：系统版本，ip:ip地址
    mylib.get_cmcc_userId       = readSysProp("cmcc.userId");                           //移动框架登录用户ID: cmcc.userId
    mylib.get_cmcc_token        = readSysProp("cmcc.token");                            //移动框架盒子登录后token
    mylib.get_cmcc_accountId    = readSysProp("cmcc.account.identity");                 //移动框架计费标识: cmcc.account.identity
    mylib.get_cmcc_cityCode     = readSysProp("cmcc.city.code");                        //移动框架机顶盒城市编码（消费地域）: cmcc.city.code
    mylib.get_cmcc_copyrightId  = readSysProp("cmcc.copyrightId");                      //移动框架版权所有
    mylib.get_terminalType      = function () {                                                    //终端类型
        try {
            return Webview.getVersion();
        } catch (e) {
            return "";
        }
    };                                               //终端类型
    mylib.get_common_data_meta  = function () {                                                    //所有信息获取
        var meta = {
            ip: 'unknown',
            model: 'unknown',
            manufacturers: 'unknown',
            system_version: 'unknown',
        };
        try {
            var dataArr = mylib.get_common_data();
            if (Object.prototype.toString.call(dataArr) === "[object Object]"
                || Object.prototype.toString.call(dataArr) === "[object String]") {
                var data = JSON.parse(dataArr);
                if (typeof data.ip !== "undefined") meta.ip = data.ip;
                if (typeof data.model !== "undefined") meta.model = data.model;
                if (typeof data.manufacturers !== "undefined") meta.manufacturers = data.manufacturers;
                if (typeof data.system_version !== "undefined") meta.system_version = data.system_version;
            } else {
                console.error("mylib.get_common_data() is not an Object.");
            }
        } catch (e) {
        }
        return meta;
    };                                               //所有信息获取
    mylib.get_webview           = function () {                                                    //返回Webview对象
        return Webview;
    };                                                  //返回Webview对象

    // 移动统一获取所有信息返回
    mylib.get_all_info = function () {
        var commonData = mylib.get_common_data_meta();
        return {
            appName :          mylib.get_app_name(),
            appVersion :       mylib.get_app_version(),
            userId :           mylib.get_user_id(),
            userName :         mylib.get_user_name(),
            userToken :        mylib.get_user_token(),
            bindPhone :        mylib.get_bindPhone(),
            areaId :           mylib.get_areaId(),
            groupId :          mylib.get_groupId(),
            deviceMac :        mylib.get_device_mac(),
            terminalType :     mylib.get_terminalType(),
            stbid:             mylib.get_stbid(),
            ip :               commonData.ip,
            model :            commonData.model,
            manufacturers :    commonData.manufacturers,
            systemVersion :    commonData.system_version,
            cmccUserId :       mylib.get_cmcc_userId(),
            cmccToken :        mylib.get_cmcc_token(),
            cmccAccountId :    mylib.get_cmcc_accountId(),
            cmccCityCode :     mylib.get_cmcc_cityCode(),
            cmccCopyrightId :  mylib.get_cmcc_copyrightId(),
        };
    };

    // 联通统一获取所有信息返回
    mylib.get_all_unicom_info = function () {
        var commonData = mylib.get_common_data_meta();
        return {
            appName :          mylib.get_app_name(),
            appVersion :       mylib.get_app_version(),
            userId :           mylib.get_user_id(),
            userName :         mylib.get_user_name(),
            userToken :        mylib.get_user_token(),
            bindPhone :        mylib.get_bindPhone(),
            areaId :           mylib.get_areaId(),
            groupId :          mylib.get_groupId(),
            deviceMac :        mylib.get_device_mac(),
            terminalType :     mylib.get_terminalType(),
            stbid:             mylib.get_stbid(),
            ip :               commonData.ip,
            model :            commonData.model,
            manufacturers :    commonData.manufacturers,
            systemVersion :    commonData.system_version,
            //cmccUserId :       mylib.get_cmcc_userId(),
            //cmccToken :        mylib.get_cmcc_token(),
            //cmccAccountId :    mylib.get_cmcc_accountId(),
            //cmccCityCode :     mylib.get_cmcc_cityCode(),
            //cmccCopyrightId :  mylib.get_cmcc_copyrightId(),
        };
    };

    var formwork = "4kyd"; //移动
    //key统计标示，value平台标示
    var piwik_sub_data = {
        "4kyd": "HNYD", //移动
        "4klt": "HNLT", //联通
        "4k": "HNDX"	//电信
    };
    mylib.fromsource = "8"; //会员中心 移动标识
    mylib.KEY_UP = "UP";
    mylib.KEY_DOWN = "DOWN";
    mylib.KEY_LEFT = "LEFT";
    mylib.KEY_RIGHT = "RIGHT";
    mylib.KEY_SELECT = "ENTER";
    mylib.KEY_BACK = "BACK";
    mylib.KEY_PAGEUP = "PAGEUP";
    mylib.KEY_PAGEDOWN = "PAGEDOWN";
    mylib.KEY_DELETE = "DELETE";
    mylib.KEY_MOVE = true; //默认焦点可以移动；
    mylib.isTest = false;

    mylib.bind_key = function (focus_manage) {
        try {
            Webview.requestFocus();
            Webview.setKeyEventHandler(function (action, keyCode, keyName, metaState) {
                var keyInfo = "action = " + action + ", keyName = " + keyName +
                    ", keyCode = " + keyCode + ", metaState = " + metaState;
                console.log("setKeyEventHandler:" + keyInfo);
                if (keyCode == 92) keyName = "PAGEUP";
                else if (keyCode == 93) keyName = "PAGEDOWN";
                var fn = focus_manage[focus_manage.area];
                if (typeof fn === "function") {
                    if (mylib.KEY_MOVE) fn(keyName);
                }
            });
        } catch (e) {
            //监听按键
            document.onkeydown = function (event) {
                mylib.KEY_UP = 38;
                mylib.KEY_DOWN = 40;
                mylib.KEY_LEFT = 37;
                mylib.KEY_RIGHT = 39;
                mylib.KEY_SELECT = 13;
                mylib.KEY_PAGEUP = 33;
                mylib.KEY_PAGEDOWN = 34;
                mylib.KEY_BACK = 8;
                mylib.KEY_DELETE = 64;
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e) {
                    var fn = focus_manage[focus_manage.area];
                    if (typeof fn === "function") {
                        if (mylib.KEY_MOVE) fn(e.keyCode);
                    }
                }
            };
        }
    };

    /***
     * 获取url参数
     * @returns {*}
     * @param param
     * @param url
     */
    mylib.getURLParameter = function (param, url) {
        var params = (url.substr(url.indexOf("?") + 1)).split("&");
        if (params != null) {
            for (var i = 0; i < params.length; i++) {
                var strs = params[i].split("=");
                if (strs[0] == param) {
                    return strs[1];
                }
            }
        }
        return "";
    };

    /***
     * 获取url参数
     * @param key
     * @returns {*}
     */
    mylib.get_request_params = function (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return r[2];
        }
        return null;
    };

    /***
     * 获取视频详情
     * @param id  专题id
     * @param callback
     */
    mylib.get_sp_data_by_id = function (id, callback) {
        var url_ = mylib.api_url + "getDetail.jsp?id=" + id;
        console.log(url_);
        mylib.ajax_json(url_, function (data) {
            callback(data);
        })
    };

    /**
     * 栏目信息
     * categoryid：栏目id,
     * currPage:当前页数，
     * pageSize：每页个数
     */
    mylib.get_apk_list_data_by_categoryid = function (object, callback) {
        var url_ = mylib.api_url + "getCategoryContent.jsp?id=" + object.categoryid +
            "&begin=" + object.currPage + "&pageSize=" + object.pageSize;
        console.log("栏目信息~~~", url_);
        mylib.ajax_json(url_, function (data) {
            callback(data);
        })
    };

    mylib.ajax_json = function (url, callback) {
        $.ajax({
            type: "get",
            url: url,
            dataType: "json",
            timeout: mylib.ajax_timeout, // 设置超时时间
            success: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            },
            error: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            }
        });
    };

    /***
     * Ajax数据请求（Get）
     * @param url
     * @param callback
     */
    mylib.ContentLoader = function (url, callback) {
        $.ajax({
            type: "get",
            url: url,
            dataType: "jsonp",
            success: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            },
            error: function (res) {
                callback(res);
            }
        });
    };

    /***
     * Ajax数据请求（Get）（失败时也回调）
     * @param url
     * @param callback
     */
    mylib.ContentLoader2 = function (url, callback) {
        $.ajax({
            type: "get",
            url: url,
            dataType: "jsonp",
            success: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            },
            error: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            }
        });
    };
    mylib.ContentLoader3 = function (url, callback) {
        $.ajax({
            type: "get",
            url: url,
            dataType: "jsonp",
            jsonp: "nns_jsonp_func",
            success: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            },
            error: function (res) {
                callback(res);
                //console.log(res);
            }
        });
    };

    mylib.ContentLoader4 = function (url, callback) {
        $.ajax({
            type: "get",
            url: url,
            dataType: "jsonp",
            jsonp: "nns_jsonp_func",
            jsonpCallback: "success_jsonpCallback",
            success: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            },
            error: function (res) {
                callback(res);
                //console.log(res);
            }
        });
    };

    /**
     * 二分查找下标(jsonArray)
     * @param {Object} arr
     * @param {Object} key
     * @param {Object} json_key
     * return -1/下标
     * 支持数据格式
     * [{a:0},[b:1]]
     * 调用示例
     * mylib.binary_search(jsonArray,0,"a")
     */
    mylib.binary_search = function (arr, key, json_key) {
        var index = -1;
        for (var i in arr) {
            if (key == arr[i][json_key]) {
                index = parseInt(i);
                break;
            }
        }
        return index;
    };

    /**
     * post方式
     * @param {Object} opt
     * @param {Object} callback
     */
    mylib.ajax_post = function (opt, callback) {
        $.ajax({
            type: "post",
            url: opt.url,
            data: opt.data,
            timeout: mylib.ajax_timeout, // 设置超时时间
            dataType: "jsonp",
            success: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            },
            error: function (res) {
                if (typeof callback === "function") {
                    callback(res);
                }
            }
        });
    };


    /***
     * 播放连续剧(没有视频窗页面)
     * @param opt,父集ID，子集序号，播放类型
     * {index:1,media_asset_id:"00000001000000000009000000003603"}
     */
    //移动视频播放接口
    mylib.mobile_play_video = function (opt) {
        var playIntent = {
            package: "com.hunantv.operator",
            action: "mangotv://com.hunantv.operator/player/vod",
            data: "",
            extras: {
                "video_index": opt.index, //第几集
                "media_asset_id": opt.media_asset_id, //媒资id
            },
            flags: []
        };
        Webview.sendIntent("startActivity", playIntent); //湖南电信、湖南联通
    };

    //联通视频播放接口
    mylib.unicom_play_video = function (opt) {
        var playIntent = {
            package: "com.hunantv.operator",
            action: "com.mgtv.hndx.prop.mgplayer.MgVodPlayerActivity",
            data: "",
            extras: {
                "video_id": opt.video_id, //视频ID
                "video_type": opt.video_type, //视频类型 0:点播 1:直播
                "video_new_index": opt.video_new_index, //第几集
                "video_all_index": opt.video_all_index, //总集数
                "quality": opt.quality, //清晰度
                "ui_style": opt.ui_style, //展示样式
                "category_id": opt.index, //第几集
                "video_name": opt.video_name, //视频或者频道名称
                "video_index": opt.index, //第几集
                "media_asset_id": opt.media_asset_id, //媒资id
            },
            flags: []
        };
        Webview.sendIntent("startActivity", playIntent); //湖南电信、湖南联通
    };

    /**
     * 注册播放相关回调
     * @param onCompletedCallback 结束回调。形如：onCompletedCallback(isCompleted)
     * @param onErrorCallback 错误回调。形如：???
     * @param onStartCallback 开始回调。形如：???
     */
    mylib.registerCallback = function (onCompletedCallback, onErrorCallback, onStartCallback) {
        Webview.registerCallback(commitExchangeDialog, onErrorCallback, onStartCallback);
    };

    mylib.jumpOrder = function (opt) {
        //定义 id ( 内容ID ，产品ID ，分类ID)，type （0 表示内容ID ，2 表示产品ID，3 表示分类ID）
        var playIntent = {
            package: "com.hunantv.operator",
            action: "mangotv://com.hunantv.operator/order",
            data: "",
            extras: {
                product: {
                    "id": opt.id,
                    "time": opt.time,
                    "price": opt.price,
                    "type": opt.type,
                    "name": opt.name,
                    "bag": opt.bag
                }
            },
            flags: []
        };
        Webview.sendIntent("startActivity", playIntent);
    };

    //跳转栏目
    //var opt={"id":"","category_id":""};
    mylib.SecondColumnActivity = function (opt) {
        var playIntent = {
            package: "com.hunantv.operator",
            action: "mangotv://com.hunantv.operator/list",
            extras: {
                category_id: opt.category_id
            },
            flags: [],
            data: ""
        };
        Webview.sendIntent("startActivity", playIntent);
    };

    //直播全屏播放
    mylib.livePlayVideo = function (id, name) {
        var playIntent = {
            package: "com.hunantv.operator",
            action: "mangotv://com.hunantv.operator/player/live",
            data: "",
            extras: {
                id: id, //频道id
            },
            flags: []
        };
        Webview.sendIntent("startActivity", playIntent);
    };

    /**
     * 跳转首页
     */
    mylib.openHome = function () {
        var playIntent = {
            "package": "com.hunantv.operator",
            "action": "mangotv://com.hunantv.operator/home",
            "data": "",
            "extras": {},
            "flags": []
        };
        Webview.sendIntent("startActivity", playIntent);
    };

    /**
     * 详情页
     **/
    mylib.details_page = function (opt) {
        var playIntent = {
            package: "com.hunantv.operator",
            action: "mangotv://com.hunantv.operator/detail",
            data: "",
            extras: {
                media_assets_id: opt.id,
            },
            flags: []
        };
        Webview.sendIntent("startActivity", playIntent);
    };

    //专题访问统计
    mylib.piwik = function (id, TopicsName) {
        id += "_" + formwork;
        if (typeof TopicsName === "undefined" || TopicsName == null) {//common.isNull
            TopicsName = "";
        } else {
            TopicsName = encodeURI(TopicsName)
        }
        var Platform = piwik_sub_data[formwork]; //平台标示
        var timestamp = new Date().getTime();
        var stbid = mylib.get_stbid();
        var link2load = mylib.mg_url_stats + "Piwik/?TopicsId=" + id + "&UserId=" + (stbid == "" ? "67500017779" : stbid) + "&t=" + timestamp + "&TopicsName=" +
            encodeURI(TopicsName) + "&Platform=" + Platform;
        console.log("piwik_url", link2load);
        mylib.ContentLoader2(link2load, function (data) {
        });
    };

    window.mangoTV = mylib;
})();



