/** 弹框控制组件 */
var Dialog = {

    modalId: 'modal',

    dialogWrapperClass: "width: 774px;height: 584px;position: relative;top: 60px;left: 254px;",

    show: function (htm, buttons, focusId, onBackPressListener) {
        var modalEl = document.createElement('div');
        modalEl.id = Dialog.modalId;
        modalEl.innerHTML = htm;
        var modal = document.getElementById(Dialog.modalId);
        if (modal) {
            modal.innerHTML = htm;
            Dialog.initModalStyle(modal);
        } else {
            document.body.appendChild(modalEl);
            Dialog.initModalStyle(modalEl);
        }
        if (typeof buttons != "undefined") LMEPG.ButtonManager.addButtons(buttons);
        if (typeof focusId != "undefined") LMEPG.ButtonManager.requestFocus(focusId);
        // 弹框是否拦截页面返回事件
        LMEPG.BM._isKeyEventInterceptCallback = function (keyCode) {
            var result = false;
            if (keyCode === KEY_EXIT || keyCode === KEY_BACK) {
                if (typeof onBackPressListener != "undefined") {
                    LMEPG.call(onBackPressListener, []);
                } else {
                    Dialog.hide();
                }
                result = true;
            }
            return result;
        };
    },

    hide: function (backFocusId) {
        document.body.removeChild(G(Dialog.modalId));
        if (typeof backFocusId != "undefined") LMEPG.BM.requestFocus(backFocusId);
        LMEPG.BM.setKeyEventPause(false);
        LMEPG.BM._isKeyEventInterceptCallback = null;
    },

    initModalStyle: function (modal) {
        modal.style.position = 'absolute';
        modal.style.zIndex = '3';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '1280px';
        modal.style.height = '720px';
        modal.style.textAlign = 'center';
        modal.style.fontSize = '24px';
        modal.style.backgroundColor = 'rgba(1, 1, 1, .5)';
    },
}

/** 上报数据视图层 */
var ReportDataView = {

    // 焦点按钮
    buttons: [],

    // 上报按钮
    btnReportData: 'btn_report_data',
    // 体脂详情
    fatDetail: 'measure_weight',

    /**
     * 初始化焦点按钮
     *  -- 确认上报数据按钮
     */
    initButtons: function () {
        ReportDataView.buttons.push({
            id: ReportDataView.btnReportData,
            name: '电话框焦点',
            type: 'img',
            click: ReportDataView.onClickListener,
            backgroundImage: ROOT + '/Public/img/hd/HealthTest/V13/btn_report_data_n.png',
            focusImage: ROOT + '/Public/img/hd/HealthTest/V13/btn_report_data_f.png',
            beforeMoveChange: ReportDataView.onButtonMove,
        }, {
            id: ReportDataView.fatDetail,
            name: '体脂详情',
            type: 'div',
            click: ReportDataView.onClickListener,
            backgroundImage: ROOT + '/Public/img/hd/HealthTest/V13/measure_weight_n.png',
            focusImage: ROOT + '/Public/img/hd/HealthTest/V13/measure_weight_f.png',
            nextFocusDown: ReportDataView.btnReportData
        });

        LMEPG.ButtonManager.init(ReportDataView.btnReportData, ReportDataView.buttons, "", true);
    },

    /**
     * 点击事件处理函数
     * @param btn 事件源
     */
    onClickListener: function (btn) {
        switch (btn.id) {
            case ReportDataView.btnReportData:
                // 查询access_token
                ReportDataModel.queryAccessToken();
                break;
            case ReportDataView.fatDetail:
                // 跳转体脂详情
                ReportDataController.routeFatDetail();
                break;
        }
    },

    /**
     * 上报按钮焦点移动监听
     * @param dir 移动方向
     * @param btn 移动焦点
     */
    onButtonMove: function (dir, btn) {
        if (dir === "up" && RenderParam.measureType === ReportDataController.IPTVForward_WEIGHT_TYPE) {
            // 选中体脂焦点按钮
            LMEPG.ButtonManager.requestFocus(ReportDataView.fatDetail);
        }
    },

    /**
     * 展示二维码弹窗
     * @param imageData 二维码数据（base64编码）
     */
    showQRCode: function (imageData) {
        var imageCodeClass = 'position:absolute;top:314px;left:314px;width:144px;height:134px';
        var tipClass = 'position:absolute;top:490px;width:774px;text-align:center;font-size:32px;color:#333';
        var tips = '请使用手机进行上报';
        // 弹窗显示二维码逻辑
        var htm = '<div style="' + Dialog.dialogWrapperClass + '">';
        htm += '<img src=' + ROOT + '/Public/img/hd/Common/V13/modal.png>';
        htm += '<img style="' + imageCodeClass + '" src=' + imageData + '>';
        htm += '<div style="' + tipClass + '">' + tips + '</div>';
        htm += '</div>';
        Dialog.show(htm);
    },

    /**
     * 关闭二维码弹窗
     */
    hideQRCode: function () {
        Dialog.hide();
    },

    /**
     * 弹窗提示 -- 通用弹窗
     * @param dialogContent 弹窗显示的内容(扫描成功后，上报成功后)
     */
    showDialog: function (dialogContent) {
        var tipClass = 'position:absolute;top:377px;font-size:32px;color:#333;width:774px;text-align:center';
        // 弹窗显示二维码逻辑
        var htm = '<div style="' + Dialog.dialogWrapperClass + '">';
        htm += '<img src=' + ROOT + '/Public/img/hd/Common/V13/modal.png>';
        htm += '<div style="' + tipClass + '">' + dialogContent + '</div>';
        htm += '</div>';
        Dialog.show(htm);
    }
}

/** 上报数据控制器 */
var ReportDataController = {

    // 血压
    IPTVForward_BLOOD_PRESSURE_TYPE: 'bloodPressure',
    // 体脂
    IPTVForward_WEIGHT_TYPE: 'weight',
    // 血压
    IPTVForward_BLOOD_SUGAR_TYPE: 'bloodSugar',

    // 扫面二维码状态定时器
    scanCodeTimer: null,
    // 扫面二维码状态间隔时间
    scanCodeTime: 2000,
    // 扫描登录状态的间隔时间
    loginLoopTime: 2000,
    // 扫描二维码扫描登录状态定时器
    loginStatusTimer: null,
    // 已扫描文案提示
    loginTips: '已扫描，请在手机端完成登录！',

    // 二维码图片唯一标识
    imageId: '',

    init: function () {
        ReportDataView.initButtons();
    },

    /**
     * 查询当前是否已经扫二维码状态
     * @param isScanCode 是否已经扫描当前二维码
     */
    queryScanStatus: function () {
        ReportDataController.scanCodeTimer = setTimeout(function () {
            // 查询当前是否已经扫描二维码
            ReportDataModel.queryScanStatus();
        }, ReportDataController.scanCodeTime);
    },

    cancelScanStatus: function(){
        // 清除定时器
        clearTimeout(ReportDataController.scanCodeTimer);
        // 关闭二维码弹窗
        ReportDataView.hideQRCode();
        // 弹窗提示手机端进行登录
        ReportDataView.showDialog(ReportDataController.loginTips);
        // 轮询登录状态
        ReportDataController.queryLoginStatus();
    },

    /**
     * 轮询登录状态
     * @param loginStatus -- 包含是否已经登录成功、登录成功的Code
     */
    loopLoginStatus: function (loginStatus) {
        var isLogin = loginStatus.result == 0;
        if (isLogin) { // 登录成功
            // 获取登录后获取的code值
            var loginCode = loginStatus.loginCode;
            // 关闭定时器
            clearTimeout(ReportDataController.loginStatusTimer);
            // 上报数据
            ReportDataModel.reportData(loginCode);
        } else {
            ReportDataController.queryLoginStatus();
        }
    },

    /**
     * 查询手机扫面是否成功
     */
    queryLoginStatus: function () {
        ReportDataController.loginStatusTimer = setTimeout(function () {
            ReportDataModel.queryLoginStatus();
        }, ReportDataController.loginTips);
    },

    /**
     * 路由体脂详情 -- 上报体脂的时候需要确认体脂详情数据
     */
    routeFatDetail: function () {
        var reportIntent = ReportDataController.reportDataIntent();
        var fatDetailIntent = LMEPG.Intent.createIntent('weight-detail');
        var measureData = RenderParam.measureData;
        fatDetailIntent.setParam("measureId", RenderParam.measureId);
        fatDetailIntent.setParam('member_id', RenderParam.memberId);
        fatDetailIntent.setParam('member_image_id', RenderParam.memberImgId);
        fatDetailIntent.setParam('member_name', RenderParam.memberName);
        fatDetailIntent.setParam('time', measureData.date);
        fatDetailIntent.setParam('fat', measureData.fatRate);
        fatDetailIntent.setParam('weight', measureData.weight);
        fatDetailIntent.setParam('resistance', measureData.resistance);

        fatDetailIntent.setParam('height', measureData.height);
        fatDetailIntent.setParam('age', measureData.age);
        fatDetailIntent.setParam('sex', measureData.sex);
        LMEPG.Intent.jump(fatDetailIntent, reportIntent);
    },

    /** 当前页面的返回参数 -- 跳转其他页面返回使用 */
    reportDataIntent: function () {
        var reportIntent = LMEPG.Intent.createIntent('report-data');
        reportIntent.setParam('measureType', RenderParam.measureType);
        reportIntent.setParam("measureId", RenderParam.measureId);
        reportIntent.setParam("measureData", JSON.stringify(RenderParam.measureData));
        reportIntent.setParam('member_id', RenderParam.memberId);
        reportIntent.setParam('member_image_id', RenderParam.memberImgId);
        reportIntent.setParam('member_name', RenderParam.memberName);
        return reportIntent;
    },

    /** 返回页面 */
    onBack: function () {
        LMEPG.Intent.back();
    }

}

/** 上报数据数据层 */
var ReportDataModel = {
    //查询access_token
    getAccessTokenUrl: 'IPTVForward/queryAccessToken',
    // 链接 -- 获取二维码图片
    getQRCodeImgUrl: "IPTVForward/getQRCodeImage",
    // 链接 -- 查询扫面状态
    queryScanStatusUrl: "IPTVForward/queryScanStatus",
    // 链接 -- 查询登录状态
    queryLoginStatusUrl: "IPTVForward/queryLoginStatus",
    // 链接 -- 上报数据
    reportDataUrl: "DeviceCheck/reportData",

    //查询access_token
    queryAccessToken: function(){
        // 显示等待框
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI(ReportDataModel.getAccessTokenUrl, {}, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if(!!data.access_token === false){
                /** 获取二维码图片 */
                ReportDataModel.getQRCodeImage();
            }else{
                // 上报数据
                ReportDataModel.reportData(0);
            }
        }, function (errorData) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showMessage("查询access_token失败！--" + errorData, 3);
        })
    },
    /** 获取二维码图片 */
    getQRCodeImage: function () {
        // 显示等待框
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI(ReportDataModel.getQRCodeImgUrl, {}, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            // 保存图片标识
            ReportDataController.imageId = data.key;
            // 显示二维码
            ReportDataView.showQRCode(data.qrCode);
            // 开启轮询
            ReportDataController.queryScanStatus();
        }, function (errorData) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showMessage("查询二维码失败！--" + errorData, 3);
        })
    },

    /** 查询是否扫描二维码图片 */
    queryScanStatus: function () {
        LMEPG.ajax.postAPI(ReportDataModel.queryScanStatusUrl, {
            "imageId": ReportDataController.imageId, // 查询图片的唯一标识
        }, function (data) {
            var isScanCode = data.result == 0;
            LMEPG.Log.info("ReportDataModel--queryScanStatus--isScanCode--" + isScanCode);
            // 根据轮询扫描状态决定是否进行下一次扫描
            if(isScanCode){
                ReportDataController.cancelScanStatus();
            }else {
                ReportDataController.queryScanStatus();
            }
        }, function (errorData) {
            LMEPG.UI.showMessage("查询二维码扫描状态失败！--" + errorData, 3);
        });
    },

    /** 查询当前登录状态 */
    queryLoginStatus: function () {
        LMEPG.ajax.postAPI(ReportDataModel.queryLoginStatusUrl, {
            "imageId": ReportDataController.imageId, // 查询图片的唯一标识
        }, function (data) {
            LMEPG.Log.info("ReportDataModel--queryLoginStatus--data--" + JSON.stringify(data));
            // 根据轮询扫描状态决定是否进行下一次扫描
            ReportDataController.loopLoginStatus(data);
        }, function (errorData) {
            LMEPG.UI.showMessage("查询二维码扫描状态失败！--" + errorData, 3);
        });
    },

    /** 上报数据 */
    reportData: function (code) {

        var paperType;  // 试纸类型
        var measureValue; // 测量指
        var measureData = RenderParam.measureData;
        var repastId = '-1';
        switch (RenderParam.measureType) {
            case ReportDataController.IPTVForward_BLOOD_SUGAR_TYPE: //血糖：使用repast_id
                repastId = measureData.state || '-1';
                paperType = 1;
                measureValue = parseFloat(measureData.data);
                break;
            case ReportDataController.IPTVForward_BLOOD_PRESSURE_TYPE:
                paperType = 5;
                var bloodPressureValue = {
                    "highPressureValue": parseInt(measureData.diastolicPressure),
                    "lowPressureValue": parseInt(measureData.systolicPressure),
                    "heartRate": parseInt(measureData.heartRate),
                }
                measureValue = JSON.stringify(bloodPressureValue);
                break;
            case ReportDataController.IPTVForward_WEIGHT_TYPE:
                paperType = 6;
                var fatValue = {
                    "weight": parseInt(measureData.weight),
                    "pbf": "",
                    "resistance": "",
                }
                measureValue = JSON.stringify(fatValue);
                break;
        }
        var postData = {
            code: code,
            member_id: RenderParam.memberId,
            measure_id: RenderParam.measureId,
            repast_id: repastId,
            bucket_id: "-1",
            paper_type: paperType, // 试纸类型
            env_temperature: 0,
            measure_data: measureValue,
            measure_dt: measureData.date
        };

        LMEPG.ajax.postAPI(ReportDataModel.reportDataUrl, postData, function (data) {
            LMEPG.Log.info("ReportDataModel--reportDataUrl--data--" + JSON.stringify(data));
            if(data.result == 0){
                // 弹窗提示上传成功
                ReportDataView.showDialog("上传成功");

                LMEPG.ajax.postAPI('/NewHealthDevice/synData', {
                    memberId:RenderParam.memberId,
                    synList:JSON.stringify([RenderParam.measureId])
                }, function (data){
                    console.log(data)
                })

                // 返回退出当前页面
                setTimeout(function () {
                    ReportDataController.onBack();
                }, 3000);
            }else {
                ReportDataView.showDialog("上传失败");
            }

        }, function (errorData) {
            LMEPG.UI.showMessage("上报数据失败！--" + errorData, 3);
        });
    }
}