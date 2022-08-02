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

// var test_data_list = [];
// (function () {
//     /*
//     ** randomWord 产生任意长度随机字母数字组合
//     ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
//     ** xuanfeng 2014-08-28
//     */
//
//     function randomWord(randomFlag, min, max){
//         var str = "",
//             range = min,
//             // arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
//             arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//
//         // 随机产生
//         if(randomFlag){
//             range = Math.round(Math.random() * (max-min)) + min;
//         }
//         for(var i=0; i<range; i++){
//             pos = Math.round(Math.random() * (arr.length-1));
//             str += arr[pos];
//         }
//         return str;
//     }
//
//     var valueIndex;
//     var value1 = [3.8, 6.1, 6.2, 7, 7.1];
//     var value2 = [2.8, 3.55, 6.0, 6.1, 7.55];
//     var value3 = [148, 149, 416, 417, 455];
//
//     var timeIndex;
//     var times1 = ["00:00:01", "05:00:01", "12:00:01", "17:00:01"];
//     var times2 = ["00:00:01", "05:00:01", "10:00:01", "14:00:01", "19:00:01"];
//
//     // console.log(randomWord(true, 30, 30))
//
//     //血糖
//     timeIndex = 0;
//     valueIndex = 0;
//     for (var i = 0; i < 5; i++) {
//         if (timeIndex >= times1.length) timeIndex = 0;
//         if (valueIndex >= value1.length) valueIndex = 0;
//         test_data_list.push({
//             dev_mac_addr: "865473037826941",
//             dev_status: "-1",
//             // measure_id: "0020190128519910048641632780" + i,
//             measure_id: randomWord(true, 30, 30),
//             measure_dt: "2019-01-" + ((i + 1 < 10 ? "0" + (i + 1) : (i + 1))) + " " + times1[timeIndex++],
//             extra_data1: 1,//血糖
//             extra_data2: value1[valueIndex++],
//         });
//     }
//
//     //胆固醇
//     timeIndex = 0;
//     valueIndex = 0;
//     for (var i = 0; i < 5; i++) {
//         if (timeIndex >= times2.length) timeIndex = 0;
//         if (valueIndex >= value2.length) valueIndex = 0;
//         test_data_list.push({
//             dev_mac_addr: "865473037826941",
//             dev_status: "-1",
//             // measure_id: "0020190128519910048641632781" + i,
//             measure_id: randomWord(true, 30, 30),
//             measure_dt: "2019-01-" + ((i + 1 < 10 ? "0" + (i + 1) : (i + 1))) + " " + times2[timeIndex++],
//             extra_data1: 2,//胆固醇
//             extra_data2: value2[valueIndex++],
//         });
//     }
//
//     //尿酸
//     timeIndex = 0;
//     valueIndex = 0;
//     for (var i = 0; i < 5; i++) {
//         if (timeIndex >= times2.length) timeIndex = 0;
//         if (valueIndex >= value3.length) valueIndex = 0;
//         test_data_list.push({
//             dev_mac_addr: "865473037826941",
//             dev_status: "-1",
//             // measure_id: "0020190128519910048641632782" + i,
//             measure_id: randomWord(true, 30, 30),
//             measure_dt: "2019-01-" + ((i + 1 < 10 ? "0" + (i + 1) : (i + 1))) + " " + times2[timeIndex++],
//             extra_data1: 4,//尿酸
//             extra_data2: value3[valueIndex++],
//         });
//     }
// })();
// function userTestUnarchiveData() {
//     //TODO 用于办事处在测试服上测试：假数据，发布正式要删除！！！---->BEGIN
//     data = {
//         result: 0,
//         count: test_data_list.length,
//         list: test_data_list
//     };
//     if (LMEPG.Func.isObject(data) && data.result == 0) {
//         if (List.pageCurrent === 1) {
//             List.pageTotalCount = List.pageCurrent * List.pageNum + 1;
//             List.dataList = Measure.parseUnarchivedRecord1List(data.list.slice(0, 5)); //转换为统一约定规则定义的数据结构
//         }
//         if (List.pageCurrent === 2) {
//             List.pageTotalCount = List.pageCurrent * List.pageNum + 1;
//             List.dataList = Measure.parseUnarchivedRecord1List(data.list.slice(5, 10)); //转换为统一约定规则定义的数据结构
//         }
//         if (List.pageCurrent === 3) {
//             List.pageTotalCount = List.pageNum;
//             List.dataList = Measure.parseUnarchivedRecord1List(data.list.slice(10, 15)); //转换为统一约定规则定义的数据结构
//         }
//     } else {
//         if (debug) console.error(LMEPG.Func.string.format('[{0}]--->[{1}]: 查询数据列表出错！data：{2}', [LOG_TAG, 'loadDataList', JSON.stringify(data)]));
//         LMEPG.Log.error(LMEPG.Func.string.format('[{0}]--->[{1}]: 查询数据列表出错！data：{2}', [LOG_TAG, 'loadDataList', JSON.stringify(data)]));
//     }
//     //TODO 用于办事处在测试服上测试：假数据，发布正式要删除！！！<----END
// }


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
            UNKNOWN_TYPE: -999     //未知类型
        },

        /**
         * 数值级别属性
         */
        Level: {
            low: {
                id: -1,
                text: '低',
                color: '#e6ff66'
            },
            normal: {
                id: 0,
                text: '正常',
                color: '#66ff99'
            },
            higher: {
                id: 1,
                text: '偏高',
                color: '#ff9966'
            },
            highest: {
                id: 2,
                text: '高',
                color: '#ff6666'
            }
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
                    max: 9
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
            }
        },

        /**
         * 检测时刻工具类，根据不同类型和时间返回对应的时刻范围
         */
        StatusHelper: {

            /**
             * 检测状态配置表。命名: type{检测类型}
             */
            status_configs: {
                // 血糖
                'type1': [
                    {
                        'id': '1',
                        'name': '凌晨',
                        'type': 1,
                        'desc': '血糖'
                    }, {
                        'id': '2',
                        'name': '空腹',
                        'type': 1,
                        'desc': '血糖'
                    }, {
                        'id': '3',
                        'name': '早餐后',
                        'type': 1,
                        'desc': '血糖'
                    }, {
                        'id': '4',
                        'name': '午餐前',
                        'type': 1,
                        'desc': '血糖'
                    }, {
                        'id': '5',
                        'name': '午餐后',
                        'type': 1,
                        'desc': '血糖'
                    }, {
                        'id': '6',
                        'name': '晚餐前',
                        'type': 1,
                        'desc': '血糖'
                    }, {
                        'id': '7',
                        'name': '晚餐后',
                        'type': 1,
                        'desc': '血糖'
                    }, {
                        'id': '8',
                        'name': '睡前',
                        'type': 1,
                        'desc': '血糖'
                    }
                ],
                // 胆固醇
                'type2': [
                    {
                        'id': '1',
                        'name': '凌晨',
                        'type': 2,
                        'desc': '胆固醇',
                        'start_dt': '00:00:01',
                        'end_dt': '05:00:00'
                    }, {
                        'id': '2',
                        'name': '早上',
                        'type': 2,
                        'desc': '胆固醇',
                        'start_dt': '05:00:01',
                        'end_dt': '10:00:00'
                    },
                    {
                        'id': '3',
                        'name': '中午',
                        'type': 2,
                        'desc': '胆固醇',
                        'start_dt': '10:00:01',
                        'end_dt': '14:00:00'
                    },
                    {
                        'id': '4',
                        'name': '下午',
                        'type': 2,
                        'desc': '胆固醇',
                        'start_dt': '14:00:01',
                        'end_dt': '19:00:00'
                    },
                    {
                        'id': '5',
                        'name': '晚上',
                        'type': 2,
                        'desc': '胆固醇',
                        'start_dt': '19:00:01',
                        'end_dt': '24:00:00'
                    }
                ],
                // 甘油三酯
                'type3': [
                    {
                        'id': '1',
                        'name': '凌晨',
                        'type': 3,
                        'desc': '甘油三酯',
                        'start_dt': '00:00:01',
                        'end_dt': '05:00:00'
                    }, {
                        'id': '2',
                        'name': '早上',
                        'type': 3,
                        'desc': '甘油三酯',
                        'start_dt': '05:00:01',
                        'end_dt': '10:00:00'
                    },
                    {
                        'id': '3',
                        'name': '中午',
                        'type': 3,
                        'desc': '甘油三酯',
                        'start_dt': '10:00:01',
                        'end_dt': '14:00:00'
                    },
                    {
                        'id': '4',
                        'name': '下午',
                        'type': 2,
                        'desc': '胆固醇',
                        'start_dt': '14:00:01',
                        'end_dt': '19:00:00'
                    },
                    {
                        'id': '5',
                        'name': '晚上',
                        'type': 3,
                        'desc': '甘油三酯',
                        'start_dt': '19:00:01',
                        'end_dt': '24:00:00'
                    }
                ],
                // 尿酸
                'type4': [
                    {
                        'id': '1',
                        'name': '凌晨',
                        'type': 4,
                        'desc': '尿酸',
                        'start_dt': '00:00:01',
                        'end_dt': '05:00:00'
                    }, {
                        'id': '2',
                        'name': '早上',
                        'type': 4,
                        'desc': '尿酸',
                        'start_dt': '05:00:01',
                        'end_dt': '10:00:00'
                    },
                    {
                        'id': '3',
                        'name': '中午',
                        'type': 4,
                        'desc': '尿酸',
                        'start_dt': '10:00:01',
                        'end_dt': '14:00:00'
                    },
                    {
                        'id': '4',
                        'name': '下午',
                        'type': 4,
                        'desc': '尿酸',
                        'start_dt': '14:00:01',
                        'end_dt': '19:00:00'
                    },
                    {
                        'id': '5',
                        'name': '晚上',
                        'type': 4,
                        'desc': '尿酸',
                        'start_dt': '19:00:01',
                        'end_dt': '24:00:00'
                    }
                ]
            },

            /**
             * "时刻-状态"对应关联表。定义不同检测类型，在不同时段内可选择的检测状态范围。
             * <pre>例如：
             *      [00:00:01, 05:00:00] -> 显示"凌晨、空腹、早餐后"
             *      [05:00:01, 12:00:00] -> 显示"空腹、早餐后、午餐前、午餐后"
             *      [12:00:01, 17:00:00] -> 显示"午餐前、午餐后、晚餐前、晚餐后"
             *      [17:00:01, 24:00:00] -> 显示"晚餐前、晚餐后、睡前"
             * </pre>
             */
            time_status_table: [
                {
                    measure_type: 1,
                    measure_name: '血糖',
                    data: [
                        {
                            start_dt: '00:00:01',
                            end_dt: '05:00:00',
                            status_ids: [1, 2, 3]
                        },
                        {
                            start_dt: '05:00:01',
                            end_dt: '12:00:00',
                            status_ids: [2, 3, 4, 5]
                        },
                        {
                            start_dt: '12:00:01',
                            end_dt: '17:00:00',
                            status_ids: [4, 5, 6, 7]
                        },
                        {
                            start_dt: '17:00:01',
                            end_dt: '24:00:00',
                            status_ids: [6, 7, 8]
                        }
                    ]
                },
                {
                    measure_type: 2,
                    measure_name: '胆固醇',
                    data: [
                        {
                            start_dt: '00:00:01',
                            end_dt: '05:00:00',
                            status_ids: [1]
                        },
                        {
                            start_dt: '05:00:01',
                            end_dt: '10:00:00',
                            status_ids: [2]
                        },
                        {
                            start_dt: '10:00:01',
                            end_dt: '14:00:00',
                            status_ids: [3]
                        },
                        {
                            start_dt: '14:00:01',
                            end_dt: '19:00:00',
                            status_ids: [4]
                        },
                        {
                            start_dt: '19:00:01',
                            end_dt: '24:00:00',
                            status_ids: [5]
                        }
                    ]
                },
                {
                    measure_type: 3,
                    measure_name: '甘油三脂',
                    data: [
                        {
                            start_dt: '00:00:01',
                            end_dt: '05:00:00',
                            status_ids: [1]
                        },
                        {
                            start_dt: '05:00:01',
                            end_dt: '10:00:00',
                            status_ds: [2]
                        },
                        {
                            start_dt: '10:00:01',
                            end_dt: '14:00:00',
                            status_ids: [3]
                        },
                        {
                            start_dt: '14:00:01',
                            end_dt: '19:00:00',
                            status_ids: [4]
                        },
                        {
                            start_dt: '19:00:01',
                            end_dt: '24:00:00',
                            status_ids: [5]
                        }
                    ]
                },
                {
                    measure_type: 4,
                    measure_name: '尿酸',
                    data: [
                        {
                            start_dt: '00:00:01',
                            end_dt: '05:00:00',
                            status_ids: [1]
                        },
                        {
                            start_dt: '05:00:01',
                            end_dt: '10:00:00',
                            status_ids: [2]
                        },
                        {
                            start_dt: '10:00:01',
                            end_dt: '14:00:00',
                            status_ids: [3]
                        },
                        {
                            start_dt: '14:00:01',
                            end_dt: '19:00:00',
                            status_ids: [4]
                        },
                        {
                            start_dt: '19:00:01',
                            end_dt: '24:00:00',
                            status_ids: [5]
                        }
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

                //校验日期时间格式 "yyyy-MM-dd hh:mm:ss"
                if (!(/^[0-9]{4}[-|/|.][[0-9]{1,2}[-|/|.][[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/.test(dt))) {
                    if (Measure._debug) console.error(LMEPG.Func.string.format('[measure.js]-->getStatusListBy({0}): Mismatch "yyyy-MM-dd hh:mm:ss"!', dt));
                    dtTemp = '2019-01-31 00:00:00';
                }
                var dtStrs = dtTemp.split(' ');
                var timeStrs = dtStrs[1];

                var realStatusList = [];

                var configs = Measure.StatusHelper.time_status_table;
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

                if (Measure._debug) console.error('最终时刻表', realStatusList);
                return realStatusList;
            }
        },

        /**
         * 程序本地化 "家庭成员->添加成员" 列表项，用于不达到指定数量已添加成员，则手动插入该选项，用于点击跳转到添加家庭成员页面。
         */
        ADD_MEMBER_ITEM: {
            'member_id': 0,
            'member_name': '添加成员',
            'member_age': 0,
            'member_gender': 0,
            'member_height': 0,
            'member_weight': 0,
            'member_image_id': 0
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
                    return '血糖';
                case Measure.Type.CHOLESTERIN:
                    return '胆固醇';
                case Measure.Type.TRIGLYCERIDE:
                    return '甘油三脂';
                case Measure.Type.URIC_ACID:
                    return '尿酸';
                default:
                    return '未知类型';
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
                    return 'mmol/L';
                case Measure.Type.CHOLESTERIN:
                    return 'mmol/L';
                case Measure.Type.TRIGLYCERIDE:
                    return 'mmol/L';
                case Measure.Type.URIC_ACID:
                    return 'umol/L';
                default:
                    return 'undefined';
            }
        },

        /**
         * 根据指定类型和时刻id，返回其对应的时刻文本。例如：getStatusTextBy(0, 1) -> 返回血糖类型的"凌晨"时刻。
         *
         * @param measureType 检测类型（1-血糖 2-胆固醇 3-甘油三酯 4-尿酸）
         * @param statusId 时刻id（血糖则用repast_id，否则其它用timebucket_id）
         */
        getStatusTextBy: function (measureType, statusId) {
            var type = Measure.getTypeAsInt(measureType);
            var statusText = '未知类型' + measureType;
            switch (type) {
                case Measure.Type.BLOOD_GLUCOSE:
                case Measure.Type.CHOLESTERIN:
                case Measure.Type.TRIGLYCERIDE:
                case Measure.Type.URIC_ACID:
                    var statusConfigs = Measure.StatusHelper.status_configs['type' + type];
                    if (LMEPG.Func.isArray(statusConfigs)) {
                        for (var i = 0, len = statusConfigs.length; i < len; i++) {
                            var statusObj = statusConfigs[i];
                            if (statusObj && statusObj.id == statusId) {
                                statusText = statusObj.name;
                                break;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            return statusText;
        },

        /**
         * 根据指定检测类型和值，判断其程度等级及其显示颜色
         *
         * @param memberGender 家庭成员性别（0-男，1-女）
         * @param measureType 检测类型（1-血糖 2-胆固醇 3-甘油三酯 4-尿酸）
         * @param measureData 检测数值
         * @param repastId 时刻id（仅measureType为1血糖时才用它）
         */
        getResultLevel: function (memberGender, measureType, measureData, repastId) {
            var level = Measure.Level.normal;

            var type = Measure.getTypeAsInt(measureType);
            var value = parseFloat(measureData);

            switch (type) {
                case Measure.Type.BLOOD_GLUCOSE:
                    // [血糖 - 判定规则]:
                    // 空腹血糖（凌晨、空腹、午餐前、晚餐前、睡前）: 3.9≤空腹≤6.1mmol/L为正常， 6.1＜空腹≤7.0 mmol/L为偏高，空腹＞7.0为高，空腹＜3.9为低；
                    // 非空腹血糖（早餐后、午餐后、晚餐后）: 4.4≤非空腹≤7.8mmol/L为正常， 7.8＜非空腹≤11.1 mmol/L为偏高，非空腹＞11.1为高，非空腹＜4.4为低；
                    switch (parseInt(repastId)) {//血糖标准: 1、凌晨、2、空腹、3、早餐后、4、午餐前、5、午餐后、6、晚餐前、7、晚餐后、8、睡前
                        case 1:
                        case 2:
                        case 4:
                        case 6:
                        case 8:
                            //空腹血糖
                            if (value < 3.9) {
                                //低
                                level = Measure.Level.low;
                            } else if (value >= 3.9 && value <= 6.1) {
                                //正常
                                level = Measure.Level.normal;
                            } else if (6.1 < value && value <= 7.0) {
                                //偏高
                                level = Measure.Level.higher;
                            } else if (value > 7.0) {
                                //高
                                level = Measure.Level.highest;
                            }
                            break;
                        case 3:
                        case 5:
                        case 7:
                            //非空腹血糖
                            if (value < 4.4) {
                                //低
                                level = Measure.Level.low;
                            } else if (value >= 4.4 && value <= 7.8) {
                                //正常
                                level = Measure.Level.normal;
                            } else if (7.8 < value && value <= 11.1) {
                                //偏高
                                level = Measure.Level.higher;
                            } else if (value > 11.1) {
                                //高
                                level = Measure.Level.highest;
                            }
                            break;
                    }

                    break;
                case Measure.Type.CHOLESTERIN:
                    // [胆固醇 - 判定规则]:
                    // 胆固醇 1. 2.8≤胆固醇≤5.17mmol/L为正常，5.17＜胆固醇≤6.0mmol/L为偏高，6.0mmol/L＜胆固醇为高，胆固醇＜2.8mmol/L为低。
                    if (value < 2.8) {
                        level = Measure.Level.low;
                    } else if (value >= 2.8 && value <= 5.17) {
                        level = Measure.Level.normal;
                    } else if (value > 5.17 && value <= 6.0) {
                        level = Measure.Level.higher;
                    } else if (value > 6.0) {
                        level = Measure.Level.highest;
                    }
                    break;
                case Measure.Type.TRIGLYCERIDE:
                    // [甘油三酯 - 判定规则]:
                    // 甘油三酯 0.56≤甘油三酯≤1.7mmol/L为正常；1.7＜甘油三酯≤2.2mmol/L为偏高，甘油三酯＞2.2mmol/L为高，甘油三酯＜0.56mmol/L为低。
                    if (value < 0.56) {
                        level = Measure.Level.low;
                    } else if (value >= 0.56 && value <= 1.7) {
                        level = Measure.Level.normal;
                    } else if (value > 1.7 && value <= 2.2) {
                        level = Measure.Level.higher;
                    } else if (value > 2.2) {
                        level = Measure.Level.highest;
                    }
                    break;
                case Measure.Type.URIC_ACID:
                    // [尿酸 - 判定规则]:
                    // 男：149≤尿酸≤416 umol/L为正常。尿酸＜149 umol/L为低，416 umol/L＜尿酸为高。
                    // 女：89≤尿酸≤357 umol/L为正常。尿酸＜89 umol/L为低，357 umol/L＜尿酸为高
                    if (memberGender == 0) {
                        //男
                        if (value < 149) {
                            level = Measure.Level.low;
                        } else if (value >= 149 && value <= 416) {
                            level = Measure.Level.normal;
                        } else if (value > 416) {
                            level = Measure.Level.highest;
                        }
                    } else {
                        //女
                        if (value < 89) {
                            level = Measure.Level.low;
                        } else if (value >= 89 && value <= 357) {
                            level = Measure.Level.normal;
                        } else if (value > 357) {
                            level = Measure.Level.highest;
                        }
                    }
                    break;
                default:
                    break;
            }

            return level;
        },

        /**
         * 目前可使用的检测类型
         */
        allowedTypes: function () {
            return [
                Measure.Type.BLOOD_GLUCOSE,
                Measure.Type.CHOLESTERIN,
                // Measure.Type.TRIGLYCERIDE,
                Measure.Type.URIC_ACID
            ];
        },

        /**
         * 返回当前可使用的检测类型数据集合。目前仅支持：血糖、胆固醇和尿酸
         * @return array 格式：[type,字符串]，例如：[1, "血糖"]
         */
        getAllowedTypeData: function () {
            var allowTypes = Measure.allowedTypes();
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
         * 判断指定检测类型在当前实际运营中是否可用。
         *
         * @param measureType 检测类型。详参 {@link Measure#Type}
         */
        isMeasureTypeAvailable: function (measureType) {
            if (LMEPG.Func.isEmpty(measureType)) {
                return false;
            }

            var allowTypes = Measure.allowedTypes();
            for (var i = 0, len = allowTypes.length; i < len; i++) {
                var type = allowTypes[i];
                if (type == measureType) {
                    return true;
                }
            }
            return false;
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
            if (!LMEPG.Func.isObject(webDataObj)) {
                if (Measure._debug) console.error(LMEPG.Func.string.format('[measure.js]--->parseUnarchivedRecord1({0}) ---> Invalid param!', JSON.stringify(webDataObj)));
                if (LMEPG.Log) LMEPG.Log.error(LMEPG.Func.string.format('[measure.js]--->parseUnarchivedRecord1({0}) ---> Invalid param!', JSON.stringify(webDataObj)));
                return;
            }

            var measureInfo = {
                measure_id: '',
                measure_type: '',
                measure_data: '',
                measure_dt: '',
                measure_env_temperature: 0,
                bind_device_id: '',
                member_id: '',
                user_id: '',
                repast_id: 0,
                time_bucket_id: 0
            };
            measureInfo.measure_id = get_obj_value_by(webDataObj, 'measure_id');
            measureInfo.measure_type = get_obj_value_by(webDataObj, 'extra_data1');
            measureInfo.measure_data = get_obj_value_by(webDataObj, 'extra_data2');
            measureInfo.measure_dt = get_obj_value_by(webDataObj, 'measure_dt');
            measureInfo.bind_device_id = get_obj_value_by(webDataObj, 'dev_mac_addr');
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
            if (LMEPG.Func.isArray(webDataObjList)) {
                for (var i = 0, len = webDataObjList.length; i < len; i++) {
                    var item = Measure.parseUnarchivedRecord1(webDataObjList[i]);
                    if (LMEPG.Func.isObject(item)) {
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
            if (!LMEPG.Func.isObject(androidPushDataObj)) {
                if (Measure._debug) console.error(LMEPG.Func.string.format('[measure.js]--->parseUnarchivedRecord2({0}) ---> Invalid param!', JSON.stringify(androidPushDataObj)));
                if (LMEPG.Log) LMEPG.Log.error(LMEPG.Func.string.format('[measure.js]--->parseUnarchivedRecord2({0}) ---> Invalid param!', JSON.stringify(androidPushDataObj)));
                return;
            }

            var measureInfo = {
                measure_id: '',
                measure_type: '',
                measure_data: '',
                measure_dt: '',
                measure_env_temperature: 0,
                bind_device_id: '',
                member_id: '',
                user_id: '',
                repast_id: 0,
                time_bucket_id: 0
            };
            measureInfo.measure_id = get_obj_value_by(androidPushDataObj, 'mMeasureId');
            measureInfo.measure_type = get_obj_value_by(androidPushDataObj, 'mPaperType');
            measureInfo.measure_data = get_obj_value_by(androidPushDataObj, 'mMeasureData');
            measureInfo.measure_dt = get_obj_value_by(androidPushDataObj, 'mMeasureDate');
            measureInfo.measure_env_temperature = get_obj_value_by(androidPushDataObj, 'mEnvTemperature');
            measureInfo.repast_id = get_obj_value_by(androidPushDataObj, 'mRepastId');
            measureInfo.time_bucket_id = get_obj_value_by(androidPushDataObj, 'mTimebucketId');
            measureInfo.user_id = get_obj_value_by(androidPushDataObj, 'mUserId');
            measureInfo.member_id = get_obj_value_by(androidPushDataObj, 'mMemberId');
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
            if (LMEPG.Func.isArray(androidPushDataObjList)) {
                for (var i = 0, len = androidPushDataObjList.length; i < len; i++) {
                    var item = Measure.parseUnarchivedRecord2(androidPushDataObjList[i]);
                    if (LMEPG.Func.isObject(item)) {
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
        }

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
            seconds: 5//{min: 1, max: 60},
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
                max: 9999
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
                    if (Measure._debug) console.log('month days', month, range.max);
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
            if (Measure._debug) console.log('range>>>', range);

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
            if (typeof dateObj !== 'object' || null == dateObj) {
                dateObj = new Date(); //默认当前日期
            }
            if (typeof format === 'undefined' || null == format || '' === format) {
                format = 'yyyy-MM-dd hh:mm:ss'; //默认格式
            }

            var dtStr = dateObj.format(format);
            if (DT._debug) console.log('DT: ' + dtStr);
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
            if (DT._debug) console.log('args: ' + JSON.stringify(DT.formatDT2.arguments));
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
            var date = new Date(dtStr.replace(/-/g, '/'));
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
            LMEPG.ajax.postAPI('System/getUnixTimeByOffsetDays', postData, function (data) {
                // if (DT._debug) console.log(data);
                LMEPG.call(callback, [data.start_dt, data.end_dt]);
            });
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
            if (DT._debug) console.error('split: ', times, timee, timen);

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
            if (DT._debug) console.error('split-dt: ', dts.format('yyyy-MM-dd hh:mm:ss'), dte.format('yyyy-MM-dd hh:mm:ss'), dtn.format('yyyy-MM-dd hh:mm:ss'));

            //判断是否在区间 now <- [start, end]
            if (dtn.getTime() >= dts.getTime() && dtn.getTime() <= dte.getTime()) {
                if (DT._debug) console.error(LMEPG.Func.string.format('{0} = [{1},{2}]', [nowTime, startTime, endTime]));
                return true;
            } else {
                if (DT._debug) console.error(LMEPG.Func.string.format('{0} != [{1},{2}]', [nowTime, startTime, endTime]));
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
                time = '00:00:00';
                if (DT._debug) console.error(LMEPG.Func.string.format('[measure.js]--[DT.splitTime()]: "{0}" mismatch "hh:mm:ss" format!', time));
            }
            if ('00:00:00' === time || '24:00:00' === time) {
                time = '23:59:59';
            }

            var strt = time.split(':');
            var inth = Math.abs(parseInt(strt[0]));
            var intm = Math.abs(parseInt(strt[1]));
            var ints = Math.abs(parseInt(strt[2]));
            return {
                h: inth > 23 ? 23 : inth,
                m: inth > 59 ? 59 : intm,
                s: inth > 59 ? 59 : ints
            };
        },

        get_as_date: function (dtStr) {
            if (typeof dtStr === 'undefined') dtStr = '';

            var date = null;

            //校验日期时间格式是否为 "yyyy-MM-dd hh:mm:ss" 或 "yyyy-MM-dd" 或 "yyyy.MM.dd"，否则默认使用当天日期
            if ((/^[0-9]{4}[-|/|.][[0-9]{1,2}[-|/|.][[0-9]{1,2} [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2}$/.test(dtStr))
                || (/^[0-9]{4}[-|/|.][[0-9]{1,2}[-|/|.][[0-9]{1,2}$/.test(dtStr))) {
                date = new Date(dtStr.replace(/-/g, '/'));
            } else {
                date = new Date();
            }

            return date;
        },

        is_same_day: function (dtStr1, dtStr2) {
            var dt1 = DT.get_as_date(dtStr1);
            var dt2 = DT.get_as_date(dtStr2);

            var sameDay = dt1.getFullYear() === dt2.getFullYear()
                && dt1.getMonth() === dt2.getMonth()
                && dt1.getDate() === dt2.getDate();
            if (DT._debug) console.log(LMEPG.Func.string.format('是否同一天: {0} -> [{1}, {2}]', [
                sameDay,
                dt1.format('yyyy-MM-dd hh:mm:ss'),
                dt2.format('yyyy-MM-dd hh:mm:ss')])
            );
            return sameDay;
        },

        /**
         * 比较两个日期，哪个距离格林威治时间最远。即哪个日期最新。
         *
         * @param dtStr1 日期时间1，格式如 "yyyy-MM-dd hh:mm:ss" 或 "yyyy-MM-dd"
         * @param dtStr2 日期时间2，格式如 "yyyy-MM-dd hh:mm:ss" 或 "yyyy-MM-dd"
         * @return {boolean} 如果dtStr1时间最后，则返回true。否则dsStr2时间最新，返回false。
         */
        compare_last_day: function (dtStr1, dtStr2) {
            var dt1 = DT.get_as_date(dtStr1);
            var dt2 = DT.get_as_date(dtStr2);

            if (DT._debug) console.log(dt1.format('yyyy-MM-dd hh:mm:ss'), dt2.format('yyyy-MM-dd hh:mm:ss'));
            return (dt1.getTime() > dt2.getTime());
        }
    };
})(window);