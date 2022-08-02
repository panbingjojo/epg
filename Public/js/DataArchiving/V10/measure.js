// +----------------------------------------------------------------------
// | MoFang-EPG-LWS
// +----------------------------------------------------------------------
// | 健康检测模块
// +----------------------------------------------------------------------
// | 功能：
// |    1. 封装所有健康检测功能模块通用的相关常量、方法等。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/1/21 下午1:41
// +----------------------------------------------------------------------

function now() {
    return new Date();
}

(function (w) {

    /**
     * 测量相关
     */
    w.Measure = {
        _debug: false, //用于调度打印

        /**
         * 健康检测类型
         */
        Type: {
            BLOOD_GLUCOSE: 1,       //血糖（医，blood glucose）
            CHOLESTERIN: 2,         //胆固醇（医，cholesterin）
            TRIGLYCERIDE: 3,        //甘油三酯（医，triglyceride）
            URIC_ACID: 4,           //尿酸（医，uric acid）
            UNKNOWN_TYPE: -999,     //未知类型
        },

        /**
         * 健康检测输入数值类型及其范围
         */
        InputData: {
            dig_2: 2,//十位
            dig_1: 1,//个位
            dot_1: -1,//小数个位
            dot_2: -2,//小数十位
            /**
             * 返回指定数据位置[十位/个位/小数个位/小数十位]的限制范围。
             *
             * @param whichDigits 数据位置 [{@link InputData#dig_1}|{@link InputData#dig_2}|{@link InputData#dot_1}|{@link InputData#dot_2}]
             * @return {{min: number, max: number}}
             */
            getRangeBy: function (whichDigits) {
                var range = {
                    min: 0,
                    max: 9,
                };
                switch (whichDigits) {
                    case Measure.InputData.dig_2:
                        if (Measure._debug) console.info('>>>十位');
                        range.min = 0;
                        range.max = 2;
                        break;
                    case Measure.InputData.dig_1:
                        if (Measure._debug) console.info('>>>个位');
                        range.min = 0;
                        range.max = 9;
                        break;
                    default:
                        if (Measure._debug) console.info('>>>默认');
                        range.min = 0;
                        range.max = 9;
                        break;
                }
                return range;
            },
        },

        // 0:01-5：00显示"凌晨、空腹、早餐后"；
        // 5:01-12：00显示"空腹、早餐后、午餐前、午餐后"；
        // 12：01-17:00显示"午餐前、午餐后、晚餐前、晚餐后"；
        // 17:01-24:00显示"晚餐前、晚餐后、睡前"；
        /**
         * 检测时刻工具类，根据不同类型和时间返回对应的时刻范围
         */
        StatusHelper: {
            config: [
                {
                    measure_type: 1,
                    measure_name: "血糖",
                    data: [
                        {
                            start_dt: "00:00:01",
                            end_dt: "05:00:00",
                            status_ids: [1, 2, 3],
                        },
                        {
                            start_dt: "05:00:01",
                            end_dt: "12:00:00",
                            status_ids: [2, 3, 4, 5],
                        },
                        {
                            start_dt: "12:00:01",
                            end_dt: "17:00:00",
                            status_ids: [4, 5, 6, 7],
                        },
                        {
                            start_dt: "17:00:01",
                            end_dt: "24:00:00",
                            status_ids: [6, 7, 8],
                        },
                    ]
                },
                {
                    measure_type: 2,
                    measure_name: "胆固醇",
                    data: [
                        {
                            start_dt: "00:00:01",
                            end_dt: "05:00:00",
                            status_ids: [1],
                        },
                        {
                            start_dt: "05:00:01",
                            end_dt: "10:00:00",
                            status_ids: [2],
                        },
                        {
                            start_dt: "10:00:01",
                            end_dt: "14:00:00",
                            status_ids: [3],
                        },
                        {
                            start_dt: "14:00:01",
                            end_dt: "19:00:00",
                            status_ids: [4],
                        },
                        {
                            start_dt: "19:00:01",
                            end_dt: "24:00:00",
                            status_ids: [5],
                        },
                    ]
                },
                {
                    measure_type: 3,
                    measure_name: "甘油三酯",
                    data: [
                        {
                            start_dt: "00:00:01",
                            end_dt: "05:00:00",
                            status_ids: [1],
                        },
                        {
                            start_dt: "05:00:01",
                            end_dt: "10:00:00",
                            status_ids: [2],
                        },
                        {
                            start_dt: "10:00:01",
                            end_dt: "14:00:00",
                            status_ids: [3],
                        },
                        {
                            start_dt: "14:00:01",
                            end_dt: "19:00:00",
                            status_ids: [4],
                        },
                        {
                            start_dt: "19:00:01",
                            end_dt: "24:00:00",
                            status_ids: [5],
                        },
                    ]
                },
                {
                    measure_type: 4,
                    measure_name: "尿酸",
                    data: [
                        {
                            start_dt: "00:00:01",
                            end_dt: "05:00:00",
                            status_ids: [1],
                        },
                        {
                            start_dt: "05:00:01",
                            end_dt: "10:00:00",
                            status_ids: [2],
                        },
                        {
                            start_dt: "10:00:01",
                            end_dt: "14:00:00",
                            status_ids: [3],
                        },
                        {
                            start_dt: "14:00:01",
                            end_dt: "19:00:00",
                            status_ids: [4],
                        },
                        {
                            start_dt: "19:00:01",
                            end_dt: "24:00:00",
                            status_ids: [5],
                        },
                    ]
                }
            ],

            /**
             * 根据时间段返回对应的可选时刻段
             *
             * @param measureType
             * @param allStatusList
             * @param dt 日期时间，必须为"yyyy-MM-dd hh:mm:ss"
             * @return {Array}
             */
            getStatusListBy: function (measureType, allStatusList, dt) {
                var dtTemp = dt;
                //校验日期时间格式 "yyyy:MM:dd hh:mm:ss"
                if (!(/^[0-9]{4}[-|/][[0-9]{1,2}[-|/][[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/.test(dt))) {
                    if (Measure._debug) console.error(LMEPG.Func.string.format('[measure.js]-->getStatusListBy({0}): Mismatch "yyyy-MM-dd hh:mm:ss"!', dt));
                    dtTemp = "2019-01-31 00:00:00";
                }
                var dtStrs = dtTemp.split(" ");
                var timeStrs = dtStrs[1];

                var realStatusList = [];

                var configs = Measure.StatusHelper.config;
                for (var key in configs) {
                    var config = configs[key];
                    if (measureType != config.measure_type) {
                        continue;
                    }

                    for (var i = 0, lenI = config.data.length; i < lenI; i++) {
                        var data = config.data[i];
                        if (!DT.withinTimeRange(data.start_dt, data.end_dt, timeStrs)) {
                            continue;
                        }

                        var statusIds = data.status_ids;
                        for (var j = 0, lenJ = statusIds.length; j < lenJ; j++) {
                            var statusId = statusIds[j];
                            for (var k = 0, lenK = allStatusList.length; k < lenK; k++) {
                                var statusItemObj = allStatusList[k];
                                if (statusItemObj.id == statusId) {
                                    realStatusList.push(statusItemObj);
                                }
                            }
                        } // #Endof for-loop

                    } // #Endof for-loop
                    break;
                } // #Endof for-loop

                if (Measure._debug) console.error("最终时刻表", realStatusList)
                return realStatusList;
            },
        },

        /**
         * 程序本地化 "家庭成员->添加成员" 列表项，用于不达到指定数量已添加成员，则手动插入该选项，用于点击跳转到添加家庭成员页面。
         */
        ADD_MEMBER_ITEM: {
            "member_id": 0,
            "member_name": "添加成员",
            "member_age": 0,
            "member_gender": 0,
            "member_height": 0,
            "member_weight": 0,
            "member_image_id": 0
        },

        /**
         * 返回检测类型，number值。
         *
         * @param measureType
         */
        getTypeAsInt: function (measureType) {
            var type = parseInt(measureType);
            return isNaN(type) ? Measure.Type.UNKNOWN_TYPE : type;
        },

        /**
         * 根据不同检测类型返回对应文本。
         *
         * @param measureType 检测类型。1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
         * @returns {string}
         */
        getTypeText: function (measureType) {
            var type = parseInt(measureType);
            switch (type) {
                case Measure.Type.BLOOD_GLUCOSE:
                    return "血糖";
                case Measure.Type.CHOLESTERIN:
                    return "胆固醇";
                case Measure.Type.TRIGLYCERIDE:
                    return "甘油三脂";
                case Measure.Type.URIC_ACID:
                    return "尿酸";
                default:
                    return "未知类型";
            }
        },

        /**
         * 根据不同检测类型返回对应检测数据的单位。
         *
         * @param measureType 检测类型。1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
         * @returns {string}
         */
        getUnitText: function (measureType) {
            var type = parseInt(measureType);
            switch (type) {
                case Measure.Type.BLOOD_GLUCOSE:
                    return "mmol/L";
                case Measure.Type.CHOLESTERIN:
                    return "mmol/L";
                case Measure.Type.TRIGLYCERIDE:
                    return "mmol/L";
                case Measure.Type.URIC_ACID:
                    return "umol/L";
                default:
                    return "undefined";
            }
        },

        /**
         * 返回当前可使用的检测类型数据集合。目前仅支持：血糖、胆固醇和尿酸
         * @return array 格式：[type,字符串]，例如：[1, "血糖"]
         */
        getAllowedTypeData: function () {
            var allowTypes = [
                Measure.Type.BLOOD_GLUCOSE,
                Measure.Type.CHOLESTERIN,
                Measure.Type.URIC_ACID,
            ];

            var typeData = [];
            for (var i = 0, len = allowTypes.length; i < len; i++) {
                var type = allowTypes[i];
                typeData.push({
                    type: type,
                    text: Measure.getTypeText(type)
                });
            }
            return typeData;
        },

        /**
         * 统一解析与封装 [来自服务器拉取到的一条未归档测量数据] 并转换为 [统一约定规则定义的数据结构] 返回。
         *
         * <pre> webDataObj 数据结构形如：
         * {
         *     "measure_id": "201901215152999749268538488",
         *     "dev_mac_addr": "865473037826941",
         *     "dev_status": "-1",
         *     "extra_data1": "1",
         *     "extra_data2": "6.5",
         *     "measure_dt": "2019-01-21 17:28:35"
         * }
         * </pre>
         *
         * @param webDataObj
         */
        parseUnarchivedRecord1: function (webDataObj) {
            if (!is_object(webDataObj)) {
                if (Measure._debug) console.error(LMEPG.Func.string.format("[measure.js]--->parseUnarchivedRecord1({0}) ---> Invalid param!", JSON.stringify(webDataObj)));
                if (LMEPG.Log) LMEPG.Log.error(LMEPG.Func.string.format("[measure.js]--->parseUnarchivedRecord1({0}) ---> Invalid param!", JSON.stringify(webDataObj)));
                return;
            }

            var measureInfo = {
                measure_id: "",
                measure_type: "",
                measure_data: "",
                measure_dt: "",
                measure_env_temperature: 0,
                bind_device_id: "",
                member_id: "",
                user_id: "",
                repast_id: 0,
                time_bucket_id: 0,
            };
            measureInfo.measure_id = get_obj_value_by(webDataObj, "measure_id");
            measureInfo.measure_type = get_obj_value_by(webDataObj, "extra_data1");
            measureInfo.measure_data = get_obj_value_by(webDataObj, "extra_data2");
            measureInfo.measure_dt = get_obj_value_by(webDataObj, "measure_dt");
            measureInfo.bind_device_id = get_obj_value_by(webDataObj, "dev_mac_addr");
            return measureInfo;
        },

        /**
         * 统一解析与封装 [来自服务器拉取到的一条未归档测量数据集合] 并转换为 [统一约定规则定义的数据结构] 返回。
         *
         * <pre> webDataObjList 数据结构形如：
         * [
         *  {
         *     "measure_id": "201901215152999749268538488",
         *     "dev_mac_addr": "865473037826941",
         *     "dev_status": "-1",
         *     "extra_data1": "1",
         *     "extra_data2": "6.5",
         *     "measure_dt": "2019-01-21 17:28:35"
         *  },
         *  {...},
         *  ...]
         * </pre>
         * @param webDataObjList
         * @return array
         */
        parseUnarchivedRecord1List: function (webDataObjList) {
            var targetList = [];
            if (is_array(webDataObjList)) {
                for (var i = 0, len = webDataObjList.length; i < len; i++) {
                    var item = Measure.parseUnarchivedRecord1(webDataObjList[i]);
                    if (is_object(item)) {
                        targetList.push(item);
                    }
                }
            }
            return targetList;
        },

        /**
         * 统一解析与封装 [监听到来自Android设备收到的ws推送测量数据] 并转换为 [统一约定规则定义的数据结构] 返回。
         *
         * <pre> webDataObj 数据结构形如：
         *  {
         *      "mMeasureId": "201901181025051529164820918",
         *      "mMeasureDate": "2019-01-18 10:18:07",
         *      "mMeasureData": 6.38,
         *      "mPaperType": type,
         *      "mEnvTemperature": 0,
         *      "mRepastId": 0,
         *      "mTimebucketId": 0,
         *      "mUserId": 0
         *      "mMemberId": 0,
         *  }
         * </pre>
         *
         * @param androidPushDataObj
         */
        parseUnarchivedRecord2: function (androidPushDataObj) {
            if (!is_object(androidPushDataObj)) {
                if (Measure._debug) console.error(LMEPG.Func.string.format("[measure.js]--->parseUnarchivedRecord2({0}) ---> Invalid param!", JSON.stringify(androidPushDataObj)));
                if (LMEPG.Log) LMEPG.Log.error(LMEPG.Func.string.format("[measure.js]--->parseUnarchivedRecord2({0}) ---> Invalid param!", JSON.stringify(androidPushDataObj)));
                return;
            }

            var measureInfo = {
                measure_id: "",
                measure_type: "",
                measure_data: "",
                measure_dt: "",
                measure_env_temperature: 0,
                bind_device_id: "",
                member_id: "",
                user_id: "",
                repast_id: 0,
                time_bucket_id: 0,
            };
            measureInfo.measure_id = get_obj_value_by(androidPushDataObj, "mMeasureId");
            measureInfo.measure_type = get_obj_value_by(androidPushDataObj, "mPaperType");
            measureInfo.measure_data = get_obj_value_by(androidPushDataObj, "mMeasureData");
            measureInfo.measure_dt = get_obj_value_by(androidPushDataObj, "mMeasureDate");
            measureInfo.measure_env_temperature = get_obj_value_by(androidPushDataObj, "mEnvTemperature");
            measureInfo.repast_id = get_obj_value_by(androidPushDataObj, "mRepastId");
            measureInfo.time_bucket_id = get_obj_value_by(androidPushDataObj, "mTimebucketId");
            measureInfo.user_id = get_obj_value_by(androidPushDataObj, "mUserId");
            measureInfo.member_id = get_obj_value_by(androidPushDataObj, "mMemberId");
            return measureInfo;
        },

        /**
         * 统一解析与封装 [监听到来自Android设备收到的ws推送测量数据集合] 并转换为 [统一约定规则定义的数据结构] 返回。
         *
         * <pre> androidPushDataObjList 数据结构形如：
         * [
         *  {
         *      "mMeasureId": "201901181025051529164820918",
         *      "mMeasureDate": "2019-01-18 10:18:07",
         *      "mMeasureData": 6.38,
         *      "mPaperType": type,
         *      "mEnvTemperature": 0,
         *      "mRepastId": 0,
         *      "mTimebucketId": 0,
         *      "mUserId": 0
         *      "mMemberId": 0,
         *  },
         *  {...},
         *  ...]
         * </pre>
         * @param androidPushDataObjList
         * @return array
         */
        parseUnarchivedRecord2List: function (androidPushDataObjList) {
            var targetList = [];
            if (is_array(androidPushDataObjList)) {
                for (var i = 0, len = androidPushDataObjList.length; i < len; i++) {
                    var item = Measure.parseUnarchivedRecord2(androidPushDataObjList[i]);
                    if (is_object(item)) {
                        targetList.push(item);
                    }
                }
            }
            return targetList;
        },

        /**
         * 监听拉雅设备成功上传最新的测量的数据（须知：Android端WebSocket成功上传后会通知Web！）
         *
         * <pre>使用示例：
         *      Measure.listenUploadedHealthMeasureData(function(measureData)) {
         *          //Do it yourself here...
         *      }
         *
         *      注意：其中参数"measureData"请详细参考 {@link Measure#parseUnarchivedRecord2()} 返回的对象结构！
         * </pre>
         *
         * @param callback 监听到有效测量数据后，回调给上一层按需处理，以一个对象参数作为当前有效测量数据返回！e.g. function(measureData)
         */
        listenUploadedHealthMeasureData: function (callback) {
            /*LMAndroid.JSCallAndroid.doListenHealthCheckMeasure(null, function (jsonFromAndroid) {
                try {
                    var data = JSON.parse(jsonFromAndroid);
                    if (data instanceof Object) {
                        var measureData = Measure.parseUnarchivedRecord2(data);
                        if (!is_object(measureData)) {
                            return;
                        }

                        LMEPG.call(callback, [measureData]);
                    }
                } catch (e) {
                }
            })*/
        },

    };

    /**
     * 日期时间相关
     */
    w.DT = {
        _debug: false, //用于调度打印
        Type: {
            year: 0, //{min: 1900, max: 2299},
            month: 1,//{min: 1, max: 12},
            day: 2,//{min: 1, max: 31},
            hours: 3,//{min: 1, max: 24},
            minutes: 4,//{min: 1, max: 60},
            seconds: 5,//{min: 1, max: 60},
        },

        /**
         * 返回指定日期时间的限制范围。如果是月份的天数，则需要传递第2个参数month（注意，month取值范围为：0~11）
         *
         * @param dtType 日期时间类型 {@link DT#Type}
         * @param month 指定月份，仅仅当第1个参数类型为{@link DT#Type#month}时有效。
         * @return {{min: number, max: number}}
         */
        getRangeBy: function (dtType, month) {
            var range = {
                min: 1,
                max: 9999,
            };

            switch (dtType) {
                case DT.Type.year:
                    range.min = 1900;
                    range.max = 2099;
                    break;
                case DT.Type.month:
                    range.min = 1;
                    range.max = 12;
                    break;
                case DT.Type.day:
                    month = parseInt(month);
                    if (isNaN(month)) month = 0;
                    range.min = 1;
                    range.max = DT.getDaysOf(month);
                    if (Measure._debug) console.log("month days", month, range.max);
                    break;
                case DT.Type.hours:
                    range.min = 0;
                    range.max = 23;
                    break;
                case DT.Type.minutes:
                case DT.Type.seconds:
                    range.min = 0;
                    range.max = 59;
                    break;
                default:
                    break;
            }
            if (Measure._debug) console.log("range>>>", range)

            return range;
        },

        /**
         * 获取指定月份天数
         *
         * @param month 月份数值 [0, 11]
         * @return {number} 返回天数
         */
        getDaysOf: function (month) {
            var date = new Date();
            date.setMonth(month);
            /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
            date.setDate(0);
            return date.getDate();
        },

        /**
         * 获取距离当前日期时间多少天前/后的时期时间
         *
         * @param offsetDays 相差天数。正数表示向后数多少天，负数表示向前数多少天。
         * @return {{year: number, month: number, day: number, hours: number, minutes: number, seconds: number}}
         */
        getSpecifiedDate: function (offsetDays) {
            var dt = new Date();
            dt.setDate(dt.getDate() + offsetDays); //获取offsetDays天后的日期
            return {
                year: dt.getFullYear(),
                month: dt.getMonth() + 1,
                day: dt.getDate(),
                hours: dt.getHours(),
                minutes: dt.getMinutes(),
                seconds: dt.getSeconds()
            };
        },

        /**
         * 通过提供的 "年月日时分秒" 数值（number或者parseInt后是一个数值的字符串）生成对应的Date日期对象。
         *
         * @param year 年。例如：2019
         * @param month 月。例如：0，表示1月份
         * @param day 日。例如：30
         * @param hours 时。例如：12
         * @param minutes 分。例如：30
         * @param seconds 秒。例如：45
         * @return {*}
         */
        parseAsDate: function (year, month, day, hours, minutes, seconds) {
            year = parseInt(year);
            month = parseInt(month);
            day = parseInt(day);
            hours = parseInt(hours);
            minutes = parseInt(minutes);
            seconds = parseInt(seconds);
            return new Date(year, month, day, hours, minutes, seconds);
        },

        /**
         * 格式化指定日期为客串。
         *
         * @param dateObj {@link Date}对象
         * @param format 指定日期时间格式。例如："yyyy-MM-dd hh:mm:ss"
         */
        formatDT1: function (dateObj, format) {
            if (typeof dateObj !== "object" || null == dateObj) {
                dateObj = new Date(); //默认当前日期
            }
            if (typeof format === "undefined" || null == format || "" === format) {
                format = "yyyy-MM-dd hh:mm:ss"; //默认格式
            }

            var dtStr = dateObj.format(format);
            if (DT._debug) console.log("DT: " + dtStr);
            return dtStr;
        },

        /**
         * 通过提供的 "年月日时分秒" 数值（number或者parseInt后是一个数值的字符串）生成对应的Date日期对象。
         *
         * @param year 年。例如：2019
         * @param month 月。例如：0，表示1月份
         * @param day 日。例如：30
         * @param hours 时。例如：12
         * @param minutes 分。例如：30
         * @param seconds 秒。例如：45
         *
         * @param format 指定日期时间格式。例如："yyyy-MM-dd hh:mm:ss"
         */
        formatDT2: function (year, month, day, hours, minutes, seconds, format) {
            if (DT._debug) console.log("args: " + JSON.stringify(DT.formatDT2.arguments))
            var date = DT.parseAsDate(year, month, day, hours, minutes, seconds);
            return DT.formatDT1(date, format);
        },

        /**
         * 转换字符串日期时间为指定的格式。
         *
         * @param dtStr 日期时间字符串。格式必须为"yyyy-MM-dd hh:mm:ss"
         * @param format 指定返回的日期格式
         */
        format: function (dtStr, format) {
            var date = new Date(dtStr.replace(/-/g, "/"));
            return date.format(format);
        },

        /**
         * 以指定日期时间为基准，获取与其相差的天数的日期时间，并以对象形式（包含："开始，结束"）返回并排序开始与结束时间。
         *
         * 调用示例：
         *
         *  // 获取距离当前时刻过去7/30/90天的时间
         *  DT.getDTRange(-7/-30/-90, function(start_dt, end_dt) {});
         *
         * 返回示例：
         *  {
         *      start_dt: "2019-01-21 17:42:12",
         *      end_dt: "2019-01-28 17:42:12",
         *      offset_days: -7
         *  }
         *
         * @param offsetDays 与当前日期相差的天数，正数表示在基准日期之后，负数表示在基准时间之前。
         * @param callback 取到指定服务器系统时间后，回调给上一层并带回当前起始与终止时期时间。
         */
        getDTRange: function (offsetDays, callback) {
            var postData = {
                offsetDays: offsetDays
            };
            LMEPG.ajax.postAPI("System/getUnixTimeByOffsetDays", postData, function (data) {
                // if (DT._debug) console.log(data);
                LMEPG.call(callback, [data.start_dt, data.end_dt]);
            })
        },

        /**
         * 判断某个时刻是否在指定范围时刻内。
         *
         * @param startTime 范围起始时刻，格式必须为"hh:mm:ss"
         * @param endTime 范围终止时刻，格式必须为"hh:mm:ss"
         * @param nowTime 当前被比较时刻，格式必须为"hh:mm:ss"
         * @return boolean 如果nowTime在[startTime, endTime]区间内，则返回布尔值true，否则返回false。
         */
        withinTimeRange: function (startTime, endTime, nowTime) {
            var times = DT.splitTime(startTime);
            var timee = DT.splitTime(endTime);
            var timen = DT.splitTime(nowTime);
            if (DT._debug) console.error("split: ", times, timee, timen)

            var dts = new Date();
            var dte = new Date();
            var dtn = new Date();

            dts.setHours(times.h);
            dts.setMinutes(times.m);
            dts.setSeconds(times.s);

            dte.setHours(timee.h);
            dte.setMinutes(timee.m);
            dte.setSeconds(timee.s);

            dtn.setHours(timen.h);
            dtn.setMinutes(timen.m);
            dtn.setSeconds(timen.s);
            if (DT._debug) console.error("split-dt: ", dts.format("yyyy-MM-dd hh:mm:ss"), dte.format("yyyy-MM-dd hh:mm:ss"), dtn.format("yyyy-MM-dd hh:mm:ss"))

            //判断是否在区间 now <- [start, end]
            if (dtn.getTime() >= dts.getTime() && dtn.getTime() <= dte.getTime()) {
                if (DT._debug) console.error(LMEPG.Func.string.format("{0} = [{1},{2}]", [nowTime, startTime, endTime]));
                return true;
            } else {
                if (DT._debug) console.error(LMEPG.Func.string.format("{0} != [{1},{2}]", [nowTime, startTime, endTime]));
                return false;
            }
        },

        /**
         * 拆分 "hh:mm:ss" 格式时间为int型，并以对象返回
         *
         * @param time 必须为"hh:mm:ss"
         */
        splitTime: function (time) {
            if (!(/^[0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/.test(time))) {
                //校验格式是否为 "hh:mm:ss"，不满足的话，则默认为 "00:00:00"
                time = "00:00:00";
                if (DT._debug) console.error(LMEPG.Func.string.format('[measure.js]--[DT.splitTime()]: "{0}" mismatch "hh:mm:ss" format!', time));
            }
            if ("00:00:00" === time || "24:00:00" === time) {
                time = "23:59:59";
            }

            var strt = time.split(":");
            var inth = Math.abs(parseInt(strt[0]));
            var intm = Math.abs(parseInt(strt[1]));
            var ints = Math.abs(parseInt(strt[2]));
            return {
                h: inth > 23 ? 23 : inth,
                m: inth > 59 ? 59 : intm,
                s: inth > 59 ? 59 : ints,
            };
        },
    };
})(window);