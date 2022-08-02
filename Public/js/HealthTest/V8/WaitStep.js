// 当前服务器时间
var curServerTime = 0;

var Page = {
    num: 0,
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('sg-blood');
        currentPage.setParam('testDevice',RenderParam.testDevice);
        currentPage.setParam('remind',Page.translateText(RenderParam.remind));
        return currentPage;
    },

    translateText: function (text) {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, "\"")
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
        if (this.num < WaitStep.max) {
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
    max:0,
    /**
     * 初始化
     */
    init: function () {
        G('title').innerHTML = RenderParam.deviceName
        this.renderContent()
        Page.autoStep();
        this.writeDataButtons();

        this.pollingNew()

    },

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
                LMEPG.Intent.jump(objDst, objSrc);
            } else {
                setTimeout(function () {
                    WaitStep.polling();
                }, 6000);
            }
        });
    },

    pollingNew:function(){
        LMEPG.ajax.postAPI('NewHealthDevice/pollingCheckNewData', {}, function (data) {
            console.log(data)
            if(!data){
                WaitStep.pollingNew();
                return
            }

            if(data && data.code === 200){
                setTimeout(function () {
                    WaitStep.pollingNew();
                },5000)
            }else{
                var objSrc = Page.getCurrentPage();
                if(data.code == 2){
                    var objDst = LMEPG.Intent.createIntent('familyEdit');
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                }else {
                    var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
                    objDst.setParam("channel",2);
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                }
            }
        },function() {
            WaitStep.pollingNew();
        })
    },

    /**
     * 初始化数据
     */
    renderContent: function () {
        var list = RenderParam.stepPic.split(';')
        WaitStep.max = 7

        var html = ' <img id="step_1" src="'+RenderParam.fsUrl+list[0]+'" alt=""/>\n' +
            '    <img id="step_2" src="'+g_appRootPath+'/Public/img/hd/HealthTest/arrow_right.gif" alt=""/>\n' +
            '    <img id="step_3" src="'+RenderParam.fsUrl+list[1]+'" alt=""/>\n' +
            '    <img id="step_4" src="'+g_appRootPath+'/Public/img/hd/HealthTest/arrow_down.gif" alt=""/>\n' +
            '    <img id="step_5" src="'+RenderParam.fsUrl+list[2]+'" alt=""/>\n' +
            '    <img id="step_6" src="'+g_appRootPath+'/Public/img/hd/HealthTest/arrow_left.gif" alt=""/>\n' +
            '    <img id="step_7" src="'+RenderParam.fsUrl+list[3]+'" alt=""/>'

        G('show_box').innerHTML = html
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
