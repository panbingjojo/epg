var DataReport = {
    pageType: {
        portal: 'Lancher/EPG首页',
        SpPortal: '专区首页',
        vodDetail: '点播详情页',
        listPage: '列表页',
        searchPage: '搜索页',
        topicPage: '专题',
        livePage: '直播列表',
        lookbackPage: '回看列表',
        activities: '活动页',
        others: '其他'
    },

    getValue: function (reportType,data) {
        //reportType: 1:页面探针,2:按钮、推荐位点击探针,3:用户搜索行为探针,4:用户订购行为探针
        if(reportType == '' || reportType =='undefined') {
            console.log('reportType is null!');
            return;
        }

        var doMain='';
        var postJson='';
        var accountId = LMEPG.Cookie.getCookie("c_account_id")|| data.userId;
        switch (reportType){
            case 1:     //页面探针
                doMain = 'http://110.167.132.8:8091/itv/pagereport';
                postJson = {
                    userId: accountId,
                    partnerCode: '8000042',
                    pageKey: data.pageKey,                               //页面键
                    pageType: data.pageType,                             //页面类型
                    pageName: DataReport.pageType[data.pageType],
                    pageMParam: data.pageMParam || '',                  //页面主要参数
                    refPageKey: '',                                     //上一级页面键值
                    refPageName: ''                                     //上一级页面名称
                };
                break;
            case 2:     //按钮、推荐位点击探针
                doMain = 'http://110.167.132.8:8091/itv/clickreport';
                postJson = {
                    userId: accountId,
                    partnerCode: '8000042',
                    pageKey: data.pageKey,                               //页面键
                    pageType: data.pageType,                             //页面类型
                    pageName: DataReport.pageType[data.pageType],
                    pageMParam: '',                                                 //页面主要参数
                    btnArea:data.btnArea,                                          //区域标识
                    btnName:data.btnName,                                          //按钮名称
                    tabName:data.tabName,                                          //所属导航栏
                };
                break;
            case 3:     //用户搜索行为探针
                doMain = 'http://110.167.132.8:8091/itv/searchreport';
                postJson = {
                    userId: accountId,
                    pageKey: data.pageKey,                            //页面键
                    pageType: data.pageType,                          //页面类型
                    pageName: DataReport.pageType[data.pageType],
                    keyWord: data.keyWord,                                      //搜索词
                    mediaCode:data.mediaCode,                                     //实体code
                    mediaName:data.mediaName,                                     //实体名称
                    mediaType:data.mediaType,                                     //实体类型
                };
                break;
            case 4:     //用户订购行为探针
                doMain = 'http://110.167.132.8:8091/itv/orderreport';
                postJson = {
                    userId: accountId,
                    partnerCode: '8000042',
                    pageKey: data.pageKey,                               //页面键
                    pageType: data.pageType,                             //页面类型
                    pageName: DataReport.pageType[data.pageType],        //页面名称
                    actionType: data.actionType,                                      //事件类型（bc：点击（点击页面上的按钮时上报）pv：访问（进入订购页时上报））
                    mediaCode:data.mediaCode,                                        //引发节目code
                    mediaName:data.mediaName,                                        //引发节目名称
                    productCode:'310401202500',                                      //订购产品code
                    productName:'39JK',                                      //订购产品名称
                    btnName:data.btnName,                                          //按钮名称（订购、确认按钮均上报）
                    recommMediaCode:'',                                  //推荐位节目code
                    recommMediaName:'',                                  //推荐位节目名称
                    recommUrl:'',                                         //推荐位活动页地址
                };
                break;
            default:     //默认
                break;
        }

        var info = '';
        for (var i in postJson) {
            info += i + '=' + postJson[i] + '&';
        };
        console.log(info);

        //组装数据上报 ajax请求
        if (info != '') {
            var realUrl = doMain + '?' + info.substr(0,info.length-1);
            LMEPG.Log.info('dataReport Url  >>>>>>>'+realUrl);
            DataReport.reportAjax(realUrl);
        }
    },

    reportAjax:function (realUrl) {
        LMEPG.ajax.post({
            url: realUrl,
            requestType: "GET",
            data: "",
            success: function (xmlHttp, rsp) {
                console.log('请求成功---->>' + JSON.stringify(rsp));
            },
            error: function () {
                console.log('请求失败---->>');
            }
        });
    }
};

var ShanDongHaiKan = {
    sendReportData: function (idx, turnPageInfo) {
        LMEPG.Log.info('sendReportData:: id = '+idx + ", data = " + JSON.stringify(turnPageInfo));
        console.log('sendReportData:: id = '+idx + ", data = " + JSON.stringify(turnPageInfo));
        if (get_carrier_id() == '371092') {
            doSendPlayData(idx, turnPageInfo);
        } else {
            if (idx == '6') {
                // 普通事件探针
                LMAndroid.JSCallAndroid.doSendData(JSON.stringify(turnPageInfo), function (resParam, notifyAndroidCallback) {});
            } else if (idx == '7'){
                // 订购探针
                LMAndroid.JSCallAndroid.doSendOrdertData(JSON.stringify(turnPageInfo),function (jsonFromAndroid,notifyAndroidCallback) {});
            } else if (idx == '8') {
                // 播放数据探针
                LMAndroid.JSCallAndroid.doSendCollectData(JSON.stringify(turnPageInfo),function (jsonFromAndroid,notifyAndroidCallback) {});
            }
        }
    }
};