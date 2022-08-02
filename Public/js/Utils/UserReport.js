// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 用户访问轨迹上报（多用于第三方SDK）
// +----------------------------------------------------------------------
// | 说明：
// |    1. 对用户行为进行采集、上报，用于运营分析（例如：宁夏移动APK-数据埋点上报）
// |    2. ...
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2020/02/25
// +----------------------------------------------------------------------

(function (w) {
    w.LMTrace = (function () {

        var firstEntryTime = Date.now();
        var lmcid = get_carrier_id();
        var allowReport = LMEPG.Func.array.contains(lmcid, ['640001']);

        var checkAllowedReport = function () {
            if (!allowReport) console.warn("暂不支持上报地区：" + lmcid);
            return allowReport;
        };

        var getNowDate = function (formatPattern) {
            return new Date().format(is_empty(formatPattern) ? "yyyyMMdd" : formatPattern);
        };
        var getNowDateTime = function (formatPattern) {
            return new Date().format(is_empty(formatPattern) ? "yyyyMMddhhmmssS" : formatPattern);
        };

        var eventType = {
            H5: {val: 1, desc: "H5页面事件"},
            NonH5: {val: 0, desc: "普通事件"},
        };

        /*-
            - 普通事件：type=0
                {
                    "type": "0",
                    "desc": "普通事件",
                    "data":
                        {
                            "eventId": "39health_pg_homepg", //事件编码（事件埋点名称）。例如：39health_pg_homepg、39health_pg_consultDoctor……
                            "eventAttr": "2020-2-25 10:11:20", //事件参数（表示具体的含义，用于定向分析即）。例如：日期时间、问诊总时长、点击科室名称……
                            "eventLabel": "access", //事件类型。例如：点击、页面访问……
                            "eventAcc": 1, //点击次数（至少为1次）。暂无累计，约定每次都调用上报，固定为1。
                        }
                }
            - H5页事件：type=1
                {
                    "type": "1",
                    "desc": "H5页面事件",
                    "data":
                        {
                            "webType": "0", //网页类型（0进入网页 1退出网页 2网页点击 3非网页点击）
                            "webTime": "时间戳", //网页时间
                            "webTitle": "百度一下", //网页标题
                            "webUrl": "http://www.baidu.com", //网页地址
                        }
                }
         */
        var execReport = function (eventType, data, callback) {
            var androidParam = {
                "type": eventType.val,
                "desc": eventType.desc,
                "data": data,
            };
            console.log("[ExecTraceSDKReport]'s json: " + JSON.stringify(androidParam));
            LMAndroid && LMAndroid.JSCallAndroid.doReportTrace(JSON.stringify(androidParam), callback);
        };

        // 数据区
        var data = {
            // 访问页面id
            pageId: {
                recommend: "39health_pg_homepg",                    //推荐页-访问量
                find: "39health_pg_find",                           //发现页-访问量
                topics: "39health_pg_topics",                       //精选专题页-访问量
                myFamily: "39health_pg_myhome",                     //我的家页-访问量
                doctorList: "39health_pg_consultDoctor",            //在线问诊页-访问量
                telInput: "39health_pg_telephoneInput",             //问诊电话输入页面-访问量
                inquiryPhone: "39health_pg_talking",                //电话接通页-访问量
                inquiryVideo: "39health_pg_Video",                  //视频问诊进行页-访问量
                doctorDetails: "39health_pg_doctorDetails",         //医生介绍页-访问量
                useTime: "39health_pg_usetime",                     //单次使用时长（退出时间-进入时间）
            },

            // 点击类型id
            clickId: {
                seeDoctor: "39health_list_seedoctor_btnclick",      //推荐页-在线问医的点击量
                healthVideo: "39health_list_healthvideo_btnclick",  //推荐页-健康视频的点击量
                picture: "39health_list_picture_btnclick",          //推荐页-健康视频的点击量
                guaHao: "39health_list_registration_btnclick",      //推荐页-预约挂号的点击量
                doctor: "39health_list_doctor_btnclick",            //医生列表中医生的点击量
                dept: "39health_category_departments_btnclick",     //科室分类点击量
                consultBtn: "39health_consultation_btnclick",       //我要咨询-点击量
                inputTel: "39health_specifiedInput_btnclick",       //输入电话号码-确定按钮点击量
                newRegUser: "39health_newuser",                     //新注册用户
            },
        };

        var clazz = function () {

            // 当前实例
            var self = this;

            /** 首次进入/访问页面时间 */
            this.entryTime = firstEntryTime;

            /** 事件id */
            this.ID = data;

            /** 获取当前 - 日期 */
            this.now_dt = function (formatPattern) {
                return getNowDate(formatPattern);
            };

            /** 获取当前 - 日期时间 */
            this.now_dt_time = function (formatPattern) {
                return getNowDateTime(formatPattern);
            };

            // 统计 - 页面逗留时长
            this.stay = function (pageId, eventLabel, callback) {
                var eventAttr = ~~((Date.now() - firstEntryTime) / 1000); //停留时长（s）
                self.access(pageId, JSON.stringify({stay_duration: eventAttr + "s"}), eventLabel, callback);
            };

            // 访问页面
            this.access = function (pageId, eventAttr, eventLabel, callback) {
                if (!checkAllowedReport()) return;
                self.exec(pageId, eventAttr, repair_data(eventLabel, "access"), 1, callback);
            };

            // 点击事件
            this.click = function (clickId, eventAttr, eventLabel, callback) {
                if (!checkAllowedReport()) return;
                self.exec(clickId, eventAttr, repair_data(eventLabel, "click"), 1, callback);
            };

            /**
             * 核心：执行事件（非H5事件）
             * @param eventId [string] 事件编码
             * @param eventAttr [string] 事件属性。自定义，我约定为：统一为json字符串，用节点节命名清晰。
             * @param eventLabel [string] 事件标签。
             * @param eventAcc [number] 事件次数，默认为1。
             * @param callback [function] 回调（当前埋点暂用不着），android端调用完回调信息，例如：callback(jsonFromAndroid)
             */
            this.exec = function (eventId, eventAttr, eventLabel, eventAcc, callback) {
                if (!checkAllowedReport()) return;
                if (is_empty(eventId) || eventId.trim().length === 0) return;
                var data = {
                    "eventId": eventId.trim(), //事件编码（事件埋点名称）。
                    "eventAttr": (function () {
                        if (is_object(eventAttr)) {
                            return JSON.stringify(eventAttr);
                        } else {
                            return !is_empty(eventAttr) ? eventAttr : JSON.stringify({dt: getNowDateTime()});
                        }
                    })(),
                    "eventLabel": is_empty(eventLabel) ? "unknown-eventLabel" : eventLabel, //事件类型。
                    "eventAcc": typeof eventAcc === "number" ? eventAcc : 1, //点击次数（至少为1次）。暂无累计，约定每次都调用上报，固定为1。
                };
                execReport(eventType.NonH5, data, callback);
            };

            // 普通事件
            this.record = function (type, desc, data, callback) {
                if (!checkAllowedReport()) return;
                execReport({val: type, desc: desc}, data, callback);
            };
        };
        return new clazz();
    })();
}(window));