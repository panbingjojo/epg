// 当前服务器时间
var curServerTime = 0;

var Page = {
    num: 0,
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('test-weight');
        return currentPage;
    },


    /**
     * 跳转输入数据页面
     */
    jumpPageInputDataPage: function () {
        var curPage = Page.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTestData');
        LMEPG.Intent.jump(dstPage, curPage);
    },
    autoStep: function () {
        if (this.num < 7) {
            Page.stepNext();
            this.timerID1 = setTimeout('Page.autoStep()', 2000);
        } else {
            clearTimeout(this.timerID1);
        }
    },

    stepNext: function () {
        this.num++;
        G('step_' + this.num).style.display = 'block';
    },
};

var WaitStep = {
    /**
     * 初始化
     */
    init: function () {
        Page.autoStep();
        this.initData();
        this.writeDataButtons();

        // 进入页面后，获取此时服务器时间。轮询得到的数据的第一条，将和此时间比较
        LMEPG.ajax.postAPI('Expert/getTime', {}, function (timeStr) {
            LMEPG.Log.info('健康检测当前服务器时间：' + timeStr);
            // curServerTime = Date.parse(timeStr);
            curServerTime = timeStr
            LMEPG.Log.info('健康检测当前服务器时间毫秒数：' + curServerTime);
            console.log(curServerTime);
            // 轮询
            WaitStep.polling();
        });
    },

    /**
     * 初始化数据
     */
    initData: function () {
        // G('title').innerHTML = '爱奥乐血糖仪检测';

    },

    /**
     * 轮询查询最新的检测记录
     */
    polling: function () {
        var postData = {'data_type': 6,"timestamp":curServerTime};
        LMEPG.ajax.postAPI('DeviceCheck/getlastTestMeasureRecord', postData, function (data) {
            console.log(data);
            LMEPG.Log.info('健康检测轮询记录：' + JSON.stringify(data));
            if (data.result == 0 && data.data.length > 0) {
                // 跳转到数据归档页面
                var objSrc = Page.getCurrentPage();
                var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
                objDst.setParam("channel",2);
                LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
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
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/write_btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/write_btn_f.png',
                click: Page.jumpPageInputDataPage
            }];
        LMEPG.BM.init('', buttons, '', true);
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
