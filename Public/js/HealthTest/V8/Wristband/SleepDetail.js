var buttons = [];
var Test = {
    currData: 10000,
    init: function () {
        this.createBtn();
        Test.getData();
    },
    render: function (data) {
        //睡眠部分
        G("awake_duration").innerHTML = Test.toHourMinute(data.sleep_list[0].awake_duration)
        G("awake_sleep").innerHTML = 100- data.sleep_list[0].deep_sleep-data.sleep_list[0].light_sleep;
        G("daily_dt").innerHTML = Test.formatShortTime(data.sleep_list[0].daily_dt);
        G("deep_duration").innerHTML = Test.toHourMinute(data.sleep_list[0].deep_duration);
        G("deep_sleep").innerHTML = data.sleep_list[0].deep_sleep;
        G("light_duration").innerHTML = Test.toHourMinute(data.sleep_list[0].light_duration);
        G("light_sleep").innerHTML = data.sleep_list[0].light_sleep;
        G("sleep_dt").innerHTML = data.sleep_list[0].sleep_dt;
        G("sleep_duration").innerHTML = Test.toHourMinute(data.sleep_list[0].sleep_duration);
        G("getup_dt").innerHTML = data.sleep_list[0].getup_dt;


        //心率部分
        G("average_rate").innerHTML = data.rate_list[0].average_rate;
        G("max_rate").innerHTML = data.rate_list[0].max_rate;
        G("min_rate").innerHTML = data.rate_list[0].min_rate;

        //睡眠周期
        G("max_dt").innerHTML = Test.getDayHour(data.sum_list[0].max_dt)[1] +'<span class="low-font">'+Test.getDayHour(data.sum_list[0].max_dt)[0]+"</span>";
        G("max_duration").innerHTML = Test.toHourMinute(data.sum_list[0].max_duration);
        G("min_dt").innerHTML = Test.getDayHour(data.sum_list[0].min_dt)[1] +'<span class="low-font">'+Test.getDayHour(data.sum_list[0].min_dt)[0]+"</span>";
        G("min_duration").innerHTML = Test.toHourMinute(data.sum_list[0].min_duration);
    },
    toHourMinute: function (minutes) {
        return (Math.floor(minutes / 60) + "小时" + (minutes % 60) + "分钟");

    },
    formatShortTime: function (date) {
        return newDate = /\d{4}-\d{1,2}-\d{1,2}/g.exec(date)
    },
    getDayHour: function (dateString) {
        var tempDate = [];
        var dateArray = dateString.split("-");
        var Hour = dateString.split(" ");
        date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
        tempDate.push("周" + "日一二三四五六".charAt(date.getDay()))
        tempDate.push(Hour[1])
        return tempDate;
    },

    createBtn: function () {
        buttons.push({
            id: 'default',
            type: 'img',
            beforeMoveChange: Test.onBeforeMoveChange,
        })
        LMEPG.ButtonManager.init('default', buttons, '', true);
    },

    getData: function () {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            "memberId": RenderParam.member_id,
            "measure_id": RenderParam.measure_id,
        }
        LMEPG.ajax.postAPI('DeviceCheck/getSleepDetail', postData,
            function (data) {
                console.log(data)
                LMEPG.UI.dismissWaitingDialog();
                if (data.result == 0) {
                    Test.render(data);
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

    onBeforeMoveChange: function (dir, cur) {
        if (dir == "down") {
            G("default").scrollTop += 30
        } else if (dir == "up") {
            G("default").scrollTop -= 30
        }
    },

    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('wristList-wristband');
        return objCurrent;
    },

};

var onBack = function () {
    LMEPG.Intent.back();
};