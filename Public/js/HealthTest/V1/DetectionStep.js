// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | [健康检测-引导步骤]页面控制js
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019-5-28 13:50:05
// +----------------------------------------------------------------------
var LOG_TAG = 'DetectionStep.js';
var debug = false;

// 当前页默认有焦点的按钮ID
var defaultFocusId = 'btn_data_input';

// 定义全局按钮
var buttons = [];

// 本地打印日志
function log(tag, msg) {
    var logMsg = LMEPG.Func.string.format("[{0}][{1}]--->{2}", [LOG_TAG, tag, msg]);
    if (debug) console.log(logMsg);
    LMEPG.Log.info(logMsg);
}

/**
 * 页面跳转控制
 */
var Page = {

    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('healthTestDetectionStep');
        currentPage.setParam('type', RenderParam.type);
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        return currentPage;
    },

    // 跳转->输入数据页面
    jumpInputData: function () {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('healthTestInputData');
        objDst.setParam('type', RenderParam.type);
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    // 跳转->待归档页面
    jumpArchiveData: function (recordJsonStr) {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('healthTestArchived');
        objDst.setParam('type', RenderParam.type);
        objDst.setParam('recordDataList', recordJsonStr);
        objDst.setParam('actionType', 1);
        LMEPG.Intent.jump(objDst, objCurrent);
    }
};

/**
 * 轮询监听拉雅设备检测数据
 */
var Looper = {

    INTERVAL: 5000, //间隔指定时长，向cws服务器获取最新的检测数据
    counter: 0,//轮询定时计数器，用于日志跟踪
    timer: null, //轮询定时器
    startServerTime: 0, // 首次进入当前页面时的服务器时间，用于判断过滤掉之前未进入该页面去轮询最新检测数据接口时的历史数据。总之，以进入该页面后检测到的数据为准，才跳转到归档页面

    // 向cws轮询获取健康检测数据，获得后再根据callback回调给上一层处理
    getLatestMeasureData: function (callback) {
        log('Looper.getLatestMeasureData()', 'Pull[' + Looper.counter + '] the latest measure data from CWS now...');

        /*-
         * data返回示例：
         *  {
         *      "result":0,
         *      "data":[{
         *          "dev_mac_addr":"3242342342422",
         *          "dev_status":"-1"
         *          "measure_id": "201901181025051529164820918",
         *          "extra_data1":1, //paper_type
         *          "extra_data2":12.16,//measure_data
         *          "measure_dt":"2017-07-02 12:00:00"
         *      }]
         *  }
         */
        LMEPG.ajax.postAPI('DeviceCheck/getLatestMeasureData', null, function (data) {
            log('Looper.getLatestMeasureData()', 'get measure data(' + (typeof data) + ')：' + JSON.stringify(data));

            //数据校验
            if (LMEPG.Func.isObject(data) && data.result == 0 && LMEPG.Func.isArray(data.data) && data.data.length > 0) {
                var webMeasureData = data.data[0];
                var measureData = {
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

                if (Measure.isMeasureTypeAvailable(webMeasureData.extra_data1)) {
                    measureData.measure_id = webMeasureData.measure_id;
                    measureData.measure_dt = webMeasureData.measure_dt;
                    measureData.bind_device_id = webMeasureData.dev_mac_addr;
                    measureData.measure_type = parseInt(webMeasureData.extra_data1);
                    measureData.measure_data = parseFloat(webMeasureData.extra_data2);

                    if (DT.compare_last_day(measureData.measure_dt, Looper.startServerTime)) {//注意：使用Date.parse(XXX)会得到NAN（例如：吉林广电盒子EC6109 pub_jljlt）。
                        // 只有进入当前页后，查询到的检测数据才算有效，过滤掉之前的历史数据
                        LMEPG.call(callback, [measureData]);
                        return;
                    } else {
                        // 过滤掉历史数据，非当前页去检测得到的数据
                        log('Looper.getLatestMeasureData()', 'Continue polling because of a history measure data![measure_dt/server_dt=' + measureData.measure_dt + '/' + Looper.startServerTime + ']');
                    }
                }
            }

            // 错误异常信息跟踪
            log('Looper.getLatestMeasureData()', 'Invalid data! data: ' + JSON.stringify(data));
        });
    },

    launchTimer: function () {
        this.counter++;
        log('Looper.launchTimer()', 'BEGIN[' + this.counter + ']: Start timer immediately >>>');

        this.getLatestMeasureData(function (measureData) {
            LMEPG.UI.showToast('系统监听到有新的 [' + Measure.getTypeText(measureData.measure_type) + '] 测量数据');
            Looper.clearTimer();
            var dataList = [];
            dataList.push(measureData);
            var dataListStr = JSON.stringify(dataList);
            Page.jumpArchiveData(dataListStr);
        });
    },

    clearTimer: function () {
        log('Looper.clearTimer()', 'clear timer!');
        clearInterval(this.timer);
        this.timer = null;
    },

    /**
     * 启动监听 - 来自拉雅设备检测数据
     */
    start: function () {
        this.clearTimer();
        this.timer = setInterval('Looper.launchTimer();', this.INTERVAL);
    }
};

/**
 * 检测步骤页面输入控制
 */
var DetectionStep = {
    timerID1: null,
    num: 0,
    initButtons: function () {
        buttons.push({
            id: 'btn_data_input',
            name: '输入数据',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'arching-btn',
            nextFocusUp: '',
            nextFocusDown: 'card-1',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_write.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/f_write.png',
            click: Page.jumpInputData,
            focusChange: DetectionStep.onBtnFocus
        });
    },

    onBtnFocus: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).src = btn.focusImage;
        } else {
            G(btn.id).src = btn.backgroundImage;
        }
    },

    autoStep: function () {
        if (this.num < 7) {
            DetectionStep.stepNext();
            this.timerID1 = setTimeout('DetectionStep.autoStep()', 3000);
        } else {
            clearTimeout(this.timerID1);
        }
    },

    stepNext: function () {
        this.num++;
        G('step_' + this.num).style.display = 'block';
    },

    /**
     * 初始化唯一入口
     */
    init: function () {
        this.initButtons();
        this.autoStep();

        LMEPG.ButtonManager.init(defaultFocusId, buttons, '', true);

        // 进入页面后，获取此时服务器时间。轮询得到的数据的第一条，将和此时间比较
        LMEPG.ajax.postAPI('Expert/getTime', null, function (timeStr) {
            log('init', 'getUnixServerTime: ' + timeStr);
            // 轮询
            Looper.startServerTime = timeStr; //日期时间格式："2019-05-28 13:12:00" 或 "2019/05/28 13:12:00"
            Looper.start();
        });
    }
};

function onBack() {
    LMEPG.Intent.back();
}

window.onload = function () {
    DetectionStep.init();
};
