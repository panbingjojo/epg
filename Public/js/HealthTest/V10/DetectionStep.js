// 定义全局按钮
var buttons = [];

// 当前服务器时间
var curServerTime;
var autoNextStepTimer;
var num = 0;

function onBack() {
    LMEPG.Intent.back();
}

var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        return LMEPG.Intent.createIntent('healthTestDetectionStep');
    }

};

var PageStart = {

    // 初始化底部导航栏按钮
    initButtons: function () {
        buttons.push({
            id: 'data_input',
            name: '输入数据',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: PageStart.pcTestJump,
            // click: '',
            focusChange: '',
            beforeMoveChange: ''
        });
    },

    autoStep: function () {
        if (num < 7) {
            PageStart.stepNext();
            autoNextStepTimer = setTimeout('PageStart.autoStep()', 3000);
        } else {
            clearTimeout(autoNextStepTimer);
        }
    },

    stepNext: function () {
        num++;
        Show('step_' + num);
    },

    init: function () {
        PageStart.autoStep();
        PageStart.initButtons();       // 初始化底部导航栏按钮
        LMEPG.BM.init('data_input', buttons);

        // 进入页面后，获取此时服务器时间。轮询得到的数据的第一条，将和此时间比较
        LMEPG.ajax.postAPI('Expert/getTime', {}, function (timeStr) {
            curServerTime = Date.parse(timeStr);
            PageStart.polling();
        });
    },

    // PC测试，跳转下一个页面
    pcTestJump: function () {
        // 跳转到检测结果页面
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('archivingList');
        var jsonStr = '{"mMeasureId":"201902025557521050862424817","mMeasureDate":"2019-02-02 09:56:07","mMeasureData":6.87,"mEnvTemperature":0.0,"mMemberId":0,"mPaperType":1,"mRepastId":0,"mTimebucketId":0,"mUserId":0}';
        objDst.setParam('measure_data', jsonStr);
        objDst.setParam('enter_type', 1); // 进入下个页面类型，1-检测进入 2-未归档进入
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 轮询查询最新的检测记录
     */
    polling: function () {
        LMEPG.ajax.postAPI('Measure/queryLatestMeasureRecord', {}, function (data) {
            if (data.result == 0 && data.data.length > 0) {
                var paramObj = {};
                paramObj.mMeasureId = data.data[0].measure_id;
                paramObj.mMeasureDate = data.data[0].measure_dt;
                paramObj.mMeasureData = data.data[0].extra_data2;
                paramObj.mPaperType = data.data[0].extra_data1;
                paramObj.mEnvTemperature = 0.0;
                paramObj.mMemberId = 0;
                paramObj.mRepastId = 0;
                paramObj.mTimebucketId = 0;
                paramObj.mUserId = 0;
                var param = JSON.stringify(paramObj);
                if (Date.parse(paramObj.mMeasureDate) >= curServerTime) {
                    // 跳转到检测结果页面
                    var objSrc = Page.getCurrentPage();
                    var objDst = LMEPG.Intent.createIntent('archivingList');
                    objDst.setParam('measure_data', param);
                    objDst.setParam('enter_type', 1); // 进入下个页面类型，1-检测进入 2-未归档进入
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                } else {
                    setTimeout(function () {
                        PageStart.polling();
                    }, 6000);
                }
            } else {
                setTimeout(function () {
                    PageStart.polling();
                }, 6000);
            }
        });
    }
};

window.onload = function () {
    PageStart.init();
};
