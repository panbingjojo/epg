var buttons = [];
var Test = {
        imgUrl: g_appRootPath + "/Public/img/hd/HealthTest/V8/Wristband/",
        start_dt: "",
        end_dt: "",
        typeNameList: ["跑步", "健走", "骑行", "游泳", "力量训练", "新跑步", "室内跑步", "椭圆机", "有氧运动", "篮球", "足球", "羽毛球", "排球",
            "乒乓球", "瑜伽", "电竞", "有氧运动-12分钟跑", "有氧运动-6分钟走", "健身舞", "太极"],

        init: function () {
            /**
             * 通用组件调用
             * @type {number}
             */
            Test.getData();
            Test.createBtn();
            // G("scroll-wrapper").scrollTop = parseInt(RenderParam.scrollTop);

        },
        getData: function () {
            LMEPG.UI.showWaitingDialog();
            var postData = {
                "memberId": RenderParam.member_id,
                "measure_id": RenderParam.measure_id,
                "exercise_type": RenderParam.exercise_type,
            }
            LMEPG.ajax.postAPI('DeviceCheck/getSportDetail', postData,
                function (data) {
                    console.log(data)
                    LMEPG.UI.dismissWaitingDialog();
                    if (data.result == 0) {
                        Test.compute(data);
                        Test.start_dt = data.start_dt;
                        Test.end_dt = data.end_dt;
                        Test.render(data.measure_data);
                    } else {
                        LMEPG.UI.showToast("暂无数据", 3, LMEPG.Intent.back());
                    }
                },
                function (data) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("手步数数据状态请求失败!");
                }
            );
        },

        getArrayAdd: function (data) {
            var tempData = 0;
            for (var i = 0; i < data.length; i++) {
                tempData += parseInt(data[i]);
            }
            return tempData;
        },
        getMinuteAndScond: function (time) {
            var muniteAndScond = time.split(".")[0] + "'" + time.split(".")[1] * 6 + "''";
            return muniteAndScond;
        },
        compute: function (data) {
            G("head-time").innerHTML = data.start_dt + "-" + data.end_dt;
            G("time").innerHTML = Test.getMinuteAndScond(new Number(data.sum_data[0].exercise_time / 60).toFixed(1));
            G("head-val").innerHTML = data.sum_data[0].calories;
            if (data.calories_data != null) {
                console.log(data.calories_data.calorie)
                // var totalCalories = Test.getArrayAdd(data.calories_data.calorie);
                var maxCalories = Test.getArrayMax(data.calories_data.calorie)[0];
                var tempTime = Test.format(parseInt(data.calories_data.utc), Test.getArrayMax(data.calories_data.calorie)[1]);
                G("max-cal").innerHTML = maxCalories;
                G("time-cal").innerHTML = tempTime;
            }

            // G("total").innerHTML = totalCalories;
            if (data.speed_data != null) {
                var num = new Number((Test.getArrayAdd(data.speed_data[0].value) / 60) / (data.speed_data[0].value.length)).toFixed(1);
                var minuteAndSecond = Test.getMinuteAndScond(num);
                // alert(minuteAndSecond[0])
                data.measure_data.unshift({
                    name: "平均配速",
                    unit: "分/公里",
                    value: minuteAndSecond
                })
            }
            if (data.sum_data != null && data.sum_data.length > 0) {
                data.measure_data.unshift({
                    name: "心率区间总时长",
                    unit: "分钟/时长",
                    value: LMEPG.Func.isEmpty(Test.getMinuteAndScond(new Number(data.sum_data[0].exercise_time / 60).toFixed(1))) ? 0 : Test.getMinuteAndScond(new Number(data.sum_data[0].exercise_time / 60).toFixed(1)),
                })
            }
            if (data.rate_data != null) {
                data.measure_data.unshift({
                    name: "心率区间总时长占比",
                    unit: "百分比",
                    value: (Test.computeTime(data) * 100).toFixed(2),
                })
            }
        },
        computeTime: function (data) {
            var per = 0, perData = 0;
            if (data.rate_data.length > 0) {
                for (var i = 0; i < data.rate_data[1].value.length; i++) {
                    if (parseInt(data.rate_data[1].value[i]) > 121) {
                        per++
                    }
                }
            }
            perData = per / data.rate_data[1].value.length
            return perData;
        },

        getArrayMax: function (data) {
            var tempData = [0, 1];
            var maxData = 0;
            var maxIndex = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i] > tempData) {
                    maxData = data[i];
                    maxIndex = i;
                    tempData = [maxData, maxIndex + 1]
                }
            }
            return tempData;
        },
        add0: function (m) {
            return m < 10 ? '0' + m : m
        },
        format: function (shijianchuo, index) {
            var time = new Date(parseInt(shijianchuo) * 1000);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return Test.add0(h) + ':' + Test.add0(mm + index);
        },

        render: function (data) {
            G('title').innerHTML = RenderParam.member_name + "的" + Test.typeNameList[RenderParam.exercise_type - 1];
            var strHtml = '';
            data.pop();
            data.forEach(function (item, i) {
                var tempImg = "";
                var j = (i + 1) - Math.floor(i / 3) * 3
                tempImg = '/Public/img/hd/HealthTest/V8/weight/type_bg_' + j + '.png'
                strHtml += '<div class="sport-type" style="background: url(' + tempImg + ')">';
                strHtml += '<div class="title">' + item.name + '</div>';
                if (item.name == "时间") {
                    strHtml += '<div class="val">' + Test.getMinuteAndScond(new Number(item.value / 60).toFixed(1)) + '</div>';
                } else {
                    strHtml += '<div class="val">' + item.value + '</div>';
                }
                strHtml += '<div class="unit">' + item.unit + '</div>';
                strHtml += '</div>';
            })

            G("container").innerHTML = strHtml;
        }

        ,
        createBtn: function () {
            buttons.push({
                id: 'sport',
                type: 'img',
                backgroundImage: Test.imgUrl + "sport.png",
                focusImage: Test.imgUrl + "sport_f.png",
                click: Test.jumpDetail,
                beforeMoveChange: Test.onBeforeMoveChange,
            })
            LMEPG.ButtonManager.init('sport', buttons, '', true);
        }
        ,

        onBeforeMoveChange: function (dir, cur) {
            if (dir == "down") {
                G("container").scrollTop += 30
            } else if (dir == "up") {
                G("container").scrollTop -= 30
            }
        }
        ,

        getCurrentPage: function () {
            var objCurrent = LMEPG.Intent.createIntent('sportDetail-wristband');
            objCurrent.setParam('page', Test.page);
            // objCurrent.setParam('scrollTop', parseInt(G("scroll-wrapper").scrollTop));
            objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
            objCurrent.setParam('member_id', RenderParam.member_id);
            objCurrent.setParam('member_image_id', RenderParam.member_image_id);
            objCurrent.setParam('member_name', RenderParam.member_name);
            objCurrent.setParam('member_gender', RenderParam.member_gender);
            objCurrent.setParam('measure_id', RenderParam.measure_id);
            objCurrent.setParam('exercise_type', RenderParam.exercise_type);
            return objCurrent;
        }
        ,

        jumpDetail: function (btn) {
            var curObj = Test.getCurrentPage();
            var dstObj = LMEPG.Intent.createIntent("heartRateSport-wristband");
            dstObj.setParam('member_id', RenderParam.member_id);
            dstObj.setParam('member_name', RenderParam.member_name);
            dstObj.setParam('start_dt', Test.start_dt);
            dstObj.setParam('end_dt', Test.end_dt);
            dstObj.setParam('member_image_id', RenderParam.member_image_id);
            dstObj.setParam('member_gender', RenderParam.member_gender);
            LMEPG.Intent.jump(dstObj, curObj);
        }
        ,
    }
;

var onBack = function () {
    LMEPG.Intent.back();
};