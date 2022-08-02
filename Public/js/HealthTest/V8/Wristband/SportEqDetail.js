var buttons = [];
var Test = {
        imgUrl: g_appRootPath + "/Public/img/hd/HealthTest/V8/Wristband/",
        start_dt: "",
        end_dt: "",
        typeNameList: ["跑步", "健走", "骑行", "游泳", "力量训练", "新跑步", "室内跑步", "椭圆机", "有氧运动", "篮球", "足球", "羽毛球", "排球",
            "乒乓球", "瑜伽", "电竞", "有氧运动-12分钟跑", "有氧运动-6分钟走", "健身舞", "太极"],
        // tempData: [
        //     {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        //     {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        //     {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        //     {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        //     {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        //     {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        //     {param1: "2012-12-15", param2: "789", param3: "还差120步"},
        //
        // ],

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
                        Test.start_dt = data.start_dt;
                        Test.end_dt = data.end_dt;
                        G("head-time").innerHTML = data.start_dt + "-" + data.end_dt;
                        G("time").innerHTML = Math.floor(data.sum_data[0].exercise_time / 60);
                        G("head-val").innerHTML = data.sum_data[0].calories;
                        // console.log(data.calories_data.calorie)
                        // var totalCalories = Test.getArrayAdd(data.calories_data.calorie);
                        // var maxCalories = Test.getArrayMax(data.calories_data.calorie)[0];
                        // var tempTime = Test.format(parseInt(data.calories_data.utc), Test.getArrayMax(data.calories_data.calorie)[1]);
                        // G("max-cal").innerHTML = maxCalories;
                        // G("time-cal").innerHTML = tempTime;
                        // G("total").innerHTML = totalCalories;
                        // var maxCalories = Test.getArrayMax(data.rate_data[0].value)[0];
                        // data.measure_data.unshift({
                        //     name: "最高心率",
                        //     unit: "次/分钟",
                        //     value: maxCalories,
                        // })


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
            G('title').innerHTML = RenderParam.member_name +"的" +Test.typeNameList[RenderParam.exercise_type-1];
            var strHtml = '';
            var j = 0;
            data.forEach(function (item, i) {
                var tempImg = "";
                if (item.name == "最高心率" || item.name == "平均心率") {
                    j++
                    tempImg = '/Public/img/hd/HealthTest/V8/weight/type_bg_' + j + '.png'
                    strHtml += '<div class="sport-type2" style="background: url(' + tempImg + ')">';
                    strHtml += '<div class="title">' + item.name + '</div>';
                    strHtml += '<div class="val">' + item.value + '</div>';
                    strHtml += '<div class="unit">' + item.unit + '</div>';
                    strHtml += '</div>';
                }
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
            var objCurrent = LMEPG.Intent.createIntent('sportEqDetail-wristband');
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
            dstObj.setParam('start_dt', Test.start_dt);
            dstObj.setParam('end_dt', Test.end_dt);

            dstObj.setParam('member_name', RenderParam.member_name);
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