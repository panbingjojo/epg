// 当前服务器时间
var curServerTime = 0;

var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('healthTestDetectionStep');
        return currentPage;
    },


    /**
     * 跳转输入数据页面
     */
    jumpPageInputDataPage: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTestData');
        LMEPG.Intent.jump(dstPage, curPage);
    }
};

var WaitStep = {
    /**
     * 初始化
     */
    init: function () {
        this.initData();
        this.writeDataButtons();

        // 进入页面后，获取此时服务器时间。轮询得到的数据的第一条，将和此时间比较
        LMEPG.ajax.postAPI('Expert/getTime', {}, function (timeStr) {
            console.log(timeStr);
            LMEPG.Log.info('健康检测当前服务器时间：' + timeStr);
            // curServerTime = Date.parse(timeStr);
            LMEPG.Log.info('健康检测当前服务器时间毫秒数：' + curServerTime);
            // 轮询
            WaitStep.polling();
        });
    },

    /**
     * 初始化数据
     */
    initData: function () {
        Hide('cholesterol-tips');
        Hide('uric-tips');
        Hide('blood-tips');

        if (RenderParam.testType == 1) {
            G('title').innerHTML = '胆固醇检测';
            Show('cholesterol-tips');
        } else if (RenderParam.testType == 2) {
            G('title').innerHTML = '尿酸检测';
            Show('uric-tips');
        } else {
            G('title').innerHTML = '血糖检测';
            Show('blood-tips');
        }
    },

    /**
     * 轮询查询最新的检测记录
     */
    polling: function () {
        LMEPG.ajax.postAPI('Measure/queryLatestMeasureRecord', {}, function (data) {
            console.log(data);
            LMEPG.Log.info('健康检测轮询记录：' + JSON.stringify(data));
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
                // 暂时注释掉，有数据就跳转，服务器时间经常不同步
                if (true/*Date.parse(paramObj.mMeasureDate) >= curServerTime*/) {
                    // 跳转到数据归档页面
                    var objSrc = Page.getCurrentPage();
                    var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                } else {
                    setTimeout(function () {
                        WaitStep.polling();
                    }, 6000);
                }
            } else {
                setTimeout(function () {
                    WaitStep.polling();
                }, 6000);
            }
        });
    },

    /**
     * 初始化按钮
     */
    writeDataButtons: function () {
        var buttons = [
            {
                id: 'write-btn',
                type: 'img',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/write_btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/write_btn_f.png',
                click: Page.jumpPageInputDataPage
            }];
        LMEPG.BM.init('write-btn', buttons, '', true);
    }
};

/**
 * 返回键
 */
var onBack = function () {
    LMEPG.Intent.back();
};

// 初始化
WaitStep.init();
