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
    /**
     * 初始化焦点按钮
     *  -- 确认上报数据按钮
     */
    initButtons: function () {
        ReportDataView.buttons.push({
            id: ReportDataView.btnReportData,
            name: '确认上报',
            type: 'img',
            click: ReportDataView.onClickListener,
            backgroundImage: ROOT + '/Public/img/hd/HealthTest/V13/btn_report_data_n.png',
            focusImage: ROOT + '/Public/img/hd/HealthTest/V13/btn_report_data_f.png',
            beforeMoveChange: ReportDataView.onBeforeMoveChangeScrollDistance,
        });

        var count = ReportDataController.pageNum;
        while (count--) {
            this.buttons.push({
                id: 'delete-' + count,
                name: '列表删除焦点',
                type: 'img',
                nextFocusUp: count == 0 ? 'ask_fast' : 'delete-' + (count - 1),
                nextFocusDown: 'delete-' + (count + 1),
                nextFocusRight: '',
                nextFocusLeft: 'detail-' + count,
                click: ReportDataController.deleteArchiveRecord,
                focusChange: this.onFocusChange,
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord_f.png',
                beforeMoveChange: ReportDataView.onBeforeMoveChangeScrollDistance
            });
            if (RenderParam.measureType == ReportDataController.IPTVForward_WEIGHT_TYPE)
                this.buttons.push({
                    id: 'detail-' + count,
                    name: '详情',
                    type: 'div',
                    nextFocusUp: count == 0 ? 'ask_fast' : 'detail-' + (count - 1),
                    nextFocusDown: 'detail-' + (count + 1),
                    nextFocusRight: 'delete-' + count,
                    nextFocusLeft: '',
                    click: this.jumpRecordDetail,
                    focusChange: this.onFocusChange,
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/all_btn.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/all_btn_f.png',
                    beforeMoveChange: ReportDataView.onBeforeMoveChangeScrollDistance
                });
        }

        LMEPG.ButtonManager.init(ReportDataView.btnReportData, ReportDataView.buttons, "", true);
    }
    ,

    /**
     * 点击事件处理函数
     * @param btn 事件源
     */
    onClickListener: function (btn) {
        switch (btn.id) {
            case ReportDataView.btnReportData:
                if(ReportDataController.data.length == 0){
                    LMEPG.UI.showToast("没有可上传的数据！");
                    return;
                }
                // 查询access_token
                ReportDataModel.queryAccessToken();
                break;
        }
    }
    ,

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
    }
    ,

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
    }
    ,

    /**
     * 关闭二维码弹窗
     */
    hideQRCode: function () {
        Dialog.hide();
    }
    ,

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
    },

    jumpRecordDetail: function (btn) {
        var curPage = ReportDataController.reportDataIntent();
        var dstPage = LMEPG.Intent.createIntent('weight-detail');
        var measureId = G(btn.id).getAttribute("data-link");
        dstPage.setParam("measureId", measureId);
        dstPage.setParam('member_id', RenderParam.memberId);
        dstPage.setParam('member_image_id', RenderParam.memberImgId);
        dstPage.setParam('member_name', RenderParam.memberName);
        dstPage.setParam('time', G(btn.id).getAttribute("data-time"));
        dstPage.setParam('fat', G(btn.id).getAttribute("data-fat"));
        dstPage.setParam('weight', G(btn.id).getAttribute("data-weight"));
        dstPage.setParam('resistance', G(btn.id).getAttribute("data-resistance"));

        dstPage.setParam('height', G(btn.id).getAttribute("data-height"));
        dstPage.setParam('age', G(btn.id).getAttribute("data-age"));
        dstPage.setParam('sex', parseInt(G(btn.id).getAttribute("data-sex"))+1);
        LMEPG.Intent.jump(dstPage, curPage);
    },
    onFocusChange: function (btn, has) {
        if (has) {
            LMEPG.CssManager.addClass(btn.id, "focus");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "focus");
        }
    },
    onBeforeMoveChangeScrollDistance: function (key, btn) {
        var _this = ReportDataController;
        var scrollElement = G('scroll-bar');
        var scrollBtnObj = LMEPG.BM.getButtonById('delete-0');

        initUpFocus();

        if (key == 'down' && (btn.id.indexOf('delete') >= 0
            || btn.id.indexOf('detail') >= 0)) {
            setDetailDown();
            setDelDown();
        }

        if (key == 'up' && btn.id == ReportDataView.btnReportData) {
            if (RenderParam.measureType == ReportDataController.IPTVForward_WEIGHT_TYPE)
                btn.nextFocusUp = 'detail-' + (_this.currentData.length - 1);
            else
                btn.nextFocusUp = 'delete-' + (_this.currentData.length - 1);
        }

        switch (true) {
            case key == 'left' || key == 'right':
                return;
            case key == 'up' && (btn.id == 'delete-0' || btn.id == 'detail-0'):
                changeUp(btn.id);
                updateDis();
                setDetailDown();
                setDelDown();
                return false;
            case key == 'down' && (btn.id == 'delete-' + (_this.pageNum - 1)
                || btn.id == 'detail-' + (_this.pageNum - 1)):
                changeDown(btn.id);
                updateDis();
                setDetailDown();
                setDelDown();
                return false;
        }

        function setDetailDown() {
            var detailBtn;
            for (var i = 0; i < _this.pageNum; i++) {
                detailBtn = LMEPG.BM.getButtonById('detail-' + i);
                if (!!detailBtn === false)
                    break;
                detailBtn.nextFocusDown = (i + 1 == _this.pageNum) ? ReportDataView.btnReportData : ('detail-' + (i + 1));
            }

            detailBtn = LMEPG.BM.getButtonById('detail-' + (_this.currentData.length - 1));
            if (!!detailBtn === false)
                return;
            detailBtn.nextFocusDown = ReportDataView.btnReportData;
        }


        function setDelDown() {
            var delBtn;
            for (var i = 0; i < _this.pageNum; i++) {
                delBtn = LMEPG.BM.getButtonById('delete-' + i);
                if (!!delBtn === false)
                    break;
                delBtn.nextFocusDown = (i + 1 == _this.pageNum) ? ReportDataView.btnReportData : ('delete-' + (i + 1));
            }

            delBtn = LMEPG.BM.getButtonById('delete-' + (_this.currentData.length - 1));
            delBtn.nextFocusDown = ReportDataView.btnReportData;
        }

        function initUpFocus() {
            scrollBtnObj.nextFocusUp = '';
        }

        function updateDis() {
            scrollElement.style.top = _this.Nc + 'px';
        }

        function changeUp(id) {
            if (_this.page == 0) {
                return;
            }
            _this.Nc = Math.max(-2, _this.Nc -= _this.Ns);
            _this.page--;
            _this.renderTable();
            ReportDataView.moveToFocus(btn.id);
        }

        function changeDown(id) {
            if (_this.page == _this.maxPage - (_this.pageNum - 1)) {
                return;
            }
            _this.Nc = Math.min(166, _this.Nc += _this.Ns);
            _this.page++;
            _this.renderTable();

            if (btn.id.indexOf('detail') >= 0) {
                ReportDataView.moveToFocus('detail-' + (_this.currentData.length - 1));
            } else {
                ReportDataView.moveToFocus('delete-' + (_this.currentData.length - 1));
            }
        }
    },
    moveToFocus: function (id) {
        LMEPG.BM.requestFocus(id);
    },
    moveToFocus: function (id) {
        LMEPG.BM.requestFocus(id);
    },
}

/** 上报数据控制器 */
var ReportDataController = {

    // 血压
    IPTVForward_BLOOD_PRESSURE_TYPE: 'diastolicPressure',
    // 体脂
    IPTVForward_WEIGHT_TYPE: 'fatFreeWeight',
    // 血糖
    IPTVForward_BLOOD_SUGAR_TYPE: 'bloodGlucose',

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
    data: [],
    currentData: [],
    page: 0,
    maxPage: 0,
    pageNum: 3,//每页条数
    init: function () {
        this.isOverflowWrap();
        ReportDataView.initButtons();
        this.getData();
    },

    getData: function () {
        var _this = ReportDataController;
        _this.page = 0;
      
        ReportDataController.getUserTestData(function (list) {
            if (list.length == 0) {
                H('table-wrap');
                G('null-data-000051').style.display = 'block';
                G('null-data-000051').style.top = '190px';
                G('null-data-000051').innerHTML = '暂无检测记录';
                return;
            }

            _this.data = list;
            _this.maxPage = _this.data.length;
            _this.renderTable();
            _this.getDistance();
            S('table-wrap');
            G('null-data-000051').style.display = 'none';
            G('null-data-000051').innerHTML = '';
        })

    },

    getUserTestData:function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('NewHealthDevice/getUserTestData', {
            memberId:RenderParam.memberName.member_id,
            itemId:RenderParam.testType.id,
            synData:0
        },function (res) {
            LMEPG.UI.dismissWaitingDialog()
            if(res.code === 200){
                var list = []
                res[RenderParam.testType.key].forEach(function (item) {
                    if (item.synData === 0 && item.source === 2) {
                        list.push(item);
                    }
                })
                cb(list)
            }else {
                cb([])
                LMEPG.UI.showToast('获取列表错误')
            }
        })
    },
    /**
     * 获取指定类型的检测记录
     * @param paperType
     */
    getSpecifyRecordList: function (paperType, callback) {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Measure/queryMemberInspectRecord', {
            'paperType': paperType,
            'memberId': RenderParam.memberId
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            data = data instanceof Object ? data : JSON.parse(data);
            if (data.result == 0) {
                callback(data.list);
            } else {
                LMEPG.UI.showToast('数据获取失败！');
            }
        });
    },
    renderTable: function () {
        var Ns = this.page; // 起始位置
        this.currentData = this.data.slice(Ns, Ns + this.pageNum);
        var htmlStr = "";
        htmlStr += '<table  id="table" style="font-size: 25px;">';
        switch (RenderParam.measureType) {
            case this.IPTVForward_BLOOD_PRESSURE_TYPE:
                htmlStr += '<tr>';
                htmlStr += '  <td style="text-align: center;">检测时间</td><td style="text-align: center;">收缩压</td>' +
                    '<td style="text-align: center;">舒张压</td><td style="text-align: center;">心率</td><td style="text-align: center;">结果</td>';
                htmlStr += '</tr>';
                break;
            case this.IPTVForward_BLOOD_SUGAR_TYPE:
                htmlStr += '<tr><td  class="test-time">检测时间</td><td>检测状态</td><td>检测数值</td><td>检测结果</td><td></td></tr>';
                break;
            case this.IPTVForward_WEIGHT_TYPE:
                htmlStr += '<tr>';
                htmlStr += '  <td style="text-align: center;width: 304px">检测时间</td><td style="text-align: center;width: 204px">体重</td>' +
                    '<td style="text-align: center;width: 324px">体脂率</td><td style="text-align: left;"></td>';
                htmlStr += '</tr>';
                break;
        }

        for (var i = 0; i < this.currentData.length; i++) {
            var data = this.currentData[i];
            if (!LMEPG.Func.isObject(data)) {
                continue;
            }

            var measureDT = data.measureDt

            switch (RenderParam.measureType) {
                case this.IPTVForward_BLOOD_PRESSURE_TYPE:
                    var formatData = data
                    var highPressureValue = formatData.systolicPressure + "mmHG";
                    var lowPressureValue = formatData.diastolicPressure + "mmHG";
                    var heartRate = formatData.heartRate + "bpm";
                    var measureLevel = HealthTest.getMetricalRange(5, RenderParam.memberName.member_gender, data.repastId, formatData);

                    htmlStr += "<tr>";
                    htmlStr += '  <td style="text-align: center;">' + measureDT + '</td>';
                    htmlStr += '  <td style="text-align: center;">' + highPressureValue + '</td>';
                    htmlStr += '  <td style="text-align: center;">' + lowPressureValue + '</td>';
                    htmlStr += '  <td style="text-align: center;">' + heartRate + '</td>';
                    htmlStr += '  <td style=" text-align: center;color: ' + measureLevel.color + '">' + measureLevel.text + '</td>';

                    htmlStr += '  <td class="test-delete" style="width: 71px">' +
                        '<img id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.dataUuid + '" alt="">';
                    htmlStr += '</tr>';
                    break;
                case this.IPTVForward_BLOOD_SUGAR_TYPE:
                    var trClassName = i % 2 == 0 ? 'even' : 'odd';
                    var measureDate = data.measureDt;
                    var measureStatus = HealthTest.getMoment(data);
                    var measureData = data.bloodGlucose + data.dataUnit;
                    var measureLevel = HealthTest.getMetricalRange(1, RenderParam.memberName.member_gender, data.repastId, data.bloodGlucose);
                    htmlStr += '<tr id=focus-' + i + ' class="' + trClassName + '">' +
                        '<td class="test-time">' + measureDate +
                        '<td class="test-status">' + measureStatus +
                        '<td class="test-number">' + measureData +
                        '<td class="test-result">' + measureLevel +
                        '<td class="test-delete">' +
                        '<img id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.dataUuid + '" alt="">' +
                        '</tr>';

                    break;
                case this.IPTVForward_WEIGHT_TYPE:
                    var fatData = data
                    var bodyFat = fatData.pbf == "" ? "0" : data.env_temperature;
                    htmlStr += '<tr><td  colspan="3" style="height: 50px;"><ul id="detail-' + i + '" class="detail-2" data-id="'+data.dataUuid+'" data-age="' + RenderParam.memberName.member_age + '" data-time="' + measureDT + '" data-sex="' + RenderParam.memberName.member_gender + '" data-weight="' + data.fatFreeWeight + '" data-resistance="' + data.resistance + '" data-height="'+RenderParam.memberName.member_height+'"><li>' + measureDT + '</li>';
                    htmlStr += '<li style="width: 230px">' + fatData.fatFreeWeight + 'KG</li>';
                    htmlStr += '<li>体脂率详情>>         </li></ul></td>';
                    htmlStr += '<td class="test-delete-2" style="min-width: 31px;height: 50px;">' +
                        '<img style="margin-top: 15px" id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.dataUuid + '" alt="">';
                    htmlStr += '</tr>';
                    break;
            }
        }

        G('table-wrap').innerHTML = htmlStr;
        this.isOverflowWrap();
    },
    isOverflowWrap: function () {
        if (this.currentData.length > this.pageNum - 1) {
            S('scroll-wrap');
        } else {
            H('scroll-wrap');
        }
    },
    Ns: 0, // 滚动条滚动基数
    Nc: 0, // 滚动条滚动变数
    getDistance: function () {
        var trHeight = 50 ;
        var max = this.data.length * trHeight; // 滚动条移动最大的距离
        this.Ns = parseInt(((17500 - trHeight) / max));
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

    cancelScanStatus: function () {
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
        LMEPG.Intent.jump(fatDetailIntent, reportIntent);
    },

    /** 当前页面的返回参数 -- 跳转其他页面返回使用 */
    reportDataIntent: function () {
        var reportIntent = LMEPG.Intent.createIntent('report-data-bat');
        reportIntent.setParam('measureType', RenderParam.measureType);
        reportIntent.setParam('test_type', JSON.stringify(RenderParam.testType));
        reportIntent.setParam("measureId", RenderParam.measureId);
        reportIntent.setParam("measureData", JSON.stringify(RenderParam.measureData));
        reportIntent.setParam('member_id', RenderParam.memberId);
        reportIntent.setParam('member_image_id', RenderParam.memberImgId);
        reportIntent.setParam('member_name',  JSON.stringify(RenderParam.memberName));


        return reportIntent;
    },

    /** 返回页面 */
    onBack: function () {
        LMEPG.Intent.back();
    },
    //删除单条列表
    deleteArchiveRecord: function (btn) {
        var measureId = G(btn.id).getAttribute('measureId');
        var index = -1;
        for(var i=0;i<ReportDataController.data.length;i++){
            if(ReportDataController.data[i].dataUuid == measureId){
                index = i;
                break;
            }
        }

        if(index == -1)
            return;
         ReportDataController.data.splice(index,1);
         if( ReportDataController.data.length === 0){
             H('table-wrap');
             G('null-data-000051').style.display = 'block';
             G('null-data-000051').style.top = '190px';
             G('null-data-000051').innerHTML = '暂无检测记录';
             H('btn_report_data')
             return;
         }
        if(ReportDataController.page>0 && ReportDataController.data.length == index)
            ReportDataController.page --;

        ReportDataController.renderTable();
        var el = G(btn.id);
        if(!!el === false){
            var temp = btn.id.split('-');
            var id = 'delete-'+(temp[1]-1)
            el = G(id);
            if(!!el === true)
                ReportDataView.moveToFocus(id);
        }else{
            ReportDataView.moveToFocus(btn.id);
        }
    },

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
    reportDataUrl: "DeviceCheck/reportBatData",

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
            if (isScanCode) {
                ReportDataController.cancelScanStatus();
            } else {
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
        var postData = [];
        for(var i=0;i<ReportDataController.data.length;i++){
            var paperType;  // 试纸类型
            var measureValue; // 测量指
            var measureData = ReportDataController.data[i];
            var repastId = '-1';
            switch (RenderParam.measureType) {
                case ReportDataController.IPTVForward_BLOOD_SUGAR_TYPE: //血糖：使用repast_id
                    repastId = measureData.repastId || '-1';
                    paperType = 1;
                    measureValue = parseFloat(measureData.bloodGlucose);
                    break;
                case ReportDataController.IPTVForward_BLOOD_PRESSURE_TYPE:
                    paperType = 5;
                    var bloodPressureValue = {
                        "highPressureValue": parseInt(measureData.systolicPressure),
                        "lowPressureValue": parseInt(measureData.diastolicPressure),
                        "heartRate": parseInt(measureData.heartRate),
                    }
                    measureValue = JSON.stringify(bloodPressureValue);
                    break;
                case ReportDataController.IPTVForward_WEIGHT_TYPE:
                    paperType = 6;
                    var fatValue = {
                        "weight": parseInt(measureData.fatFreeWeight),
                        "pbf": "",
                        "resistance": "",
                    }
                    measureValue = JSON.stringify(fatValue);
                    break;
            }
            postData.push({
                member_id: measureData.memberId,
                measure_id: measureData.dataUuid,
                repast_id: repastId,
                timebucket_id: "-1",
                paper_type: paperType, // 试纸类型
                env_temperature: 0,
                measure_data: measureValue,
                measure_dt: measureData.measureDt
            });
        }
        LMEPG.ajax.postAPI(ReportDataModel.reportDataUrl, {list:JSON.stringify(postData)}, function (data) {
            LMEPG.Log.info("ReportDataModel--reportDataUrl--data--" + JSON.stringify(data));
            if (data.result == 0) {
                // 弹窗提示上传成功
                var temp = []
                ReportDataController.data.forEach(function (item) {
                    temp.push(item.dataUuid)
                })

                LMEPG.ajax.postAPI('/NewHealthDevice/synData', {
                    memberId:RenderParam.memberName.member_id,
                    synList:JSON.stringify(temp)
                }, function (data){
                    console.log(data)
                })

                ReportDataView.showDialog("上传成功");
                // 返回退出当前页面
                setTimeout(function () {
                    // ReportDataController.onBack();
                    ReportDataController.onBack();
                }, 3000);
            } else {
                ReportDataView.showDialog("上传失败");
            }

        }, function (errorData) {
            LMEPG.UI.showMessage("上报数据失败！--" + errorData, 3);
        });
    }
}

/**
 * ============================================健康检测相关===============================================
 */
var HealthTest = {
    /**
     * 数值级别属性
     */
    Level: {
        low: {
            id: -1,
            text: '低',
            color: '#e6ff66'
        },
        normal: {
            id: 0,
            text: '正常',
            color: '#66ff99'
        },
        higher: {
            id: 1,
            text: '偏高',
            color: '#ff9966'
        },
        highest: {
            id: 2,
            text: '高',
            color: '#ff6666'
        }
    },
    /**
     * 获取时段和就餐状态
     */
    getMoment: function (item) {
        var momentStr = '';
        if (RenderParam.momentData != null) {
            var repast_id = item.repastId;
            var timebucket_id = item.timebucket_id;
            if (repast_id != '-1') {
                for (var j = 0; j < RenderParam.momentData.repast.length; j++) {
                    if (repast_id == RenderParam.momentData.repast[j].repast_id) {
                        momentStr = RenderParam.momentData.repast[j].repast_name;
                        break;
                    }
                }
            }
            if (timebucket_id != '-1') {
                for (var j = 0; j < RenderParam.momentData.timebuckets.length; j++) {
                    if (timebucket_id == RenderParam.momentData.timebuckets[j].timebucket_id) {
                        momentStr = RenderParam.momentData.timebuckets[j].timebucket_name;
                        break;
                    }
                }
            }
        }
        return momentStr;
    },

    /**
     * 返回测量数据的范围值
     * @param paperType
     * @param userSex
     * @param repastId
     * @param value
     * @returns {*}
     */
    getMetricalRange: function (paperType, userSex, repastId, value) {
        paperType = parseInt(paperType);
        userSex = parseInt(userSex);
        repastId = parseInt(repastId);
        if (paperType != 5) {
            value = parseFloat(value);
        }
        var metricalRange = '正常';
        // 1.	空腹血糖（凌晨、空腹、午餐前、晚餐前、睡前）：3.9≤空腹≤6.1mmol/L为正常， 6.1＜空腹≤7.0 mmol/L为偏高，空腹＞7.0为高，空腹＜3.9为低；
        // 4.	非空腹血糖（早餐后、午餐后、晚餐后）：4.4≤非空腹≤7.8mmol/L为正常， 7.8＜非空腹≤11.1 mmol/L为偏高，非空腹＞11.1为高，非空腹＜4.4为低；
        if (paperType == 1) {
            //血糖标准 //1、凌晨、2、空腹、3、早餐后、4、午餐前、5、午餐后、6、晚餐前、7、晚餐后、8、睡前
            switch (repastId) {
                case 1:
                case 2:
                case 4:
                case 6:
                case 8:
                    //空腹血糖
                    if (value < 3.9) {
                        //低
                        metricalRange = '低';
                    } else if (value >= 3.9 && value <= 6.1) {
                        //正常
                        metricalRange = '正常';
                    } else if (6.1 < value && value <= 7.0) {
                        //偏高
                        metricalRange = '偏高';
                    } else if (value > 7.0) {
                        //高
                        metricalRange = '高';
                    }
                    break;
                case 3:
                case 5:
                case 7:
                    //非空腹血糖
                    if (value < 4.4) {
                        //低
                        metricalRange = '低';
                    } else if (value >= 4.4 && value <= 7.8) {
                        //正常
                        metricalRange = '正常';
                    } else if (7.8 < value && value <= 11.1) {
                        //偏高
                        metricalRange = '偏高';
                    } else if (value > 11.1) {
                        //高
                        metricalRange = '高';
                    }
                    break;
            }
        } else if (paperType == 2) {
            //胆固醇 1. 2.8≤胆固醇≤5.17mmol/L为正常，5.17＜胆固醇≤6.0mmol/L为偏高，6.0mmol/L＜胆固醇为高，胆固醇＜2.8mmol/L为低。
            if (value < 2.8) {
                metricalRange = '低';
            } else if (value >= 2.8 && value <= 5.17) {
                metricalRange = '正常';
            } else if (value > 5.17 && value <= 6.0) {
                metricalRange = '偏高';
            } else if (value > 6.0) {
                metricalRange = '高';
            }
        } else if (paperType == 5) {
            var highPressure = parseInt(value.systolicPressure);
            var lowPressure = parseInt(value.diastolicPressure);
            if (highPressure < 90 || lowPressure < 60) {
                metricalRange = HealthTest.Level.low;
            } else if (highPressure > 139 || lowPressure > 89) {
                metricalRange = HealthTest.Level.highest;
            } else {
                metricalRange = HealthTest.Level.normal;
            }
        } else if (paperType == 3) {
            //甘油三酯// 0.56≤甘油三酯≤1.7mmol/L为正常；1.7＜甘油三酯≤2.2mmol/L为偏高，甘油三酯＞2.2mmol/L为高，甘油三酯＜0.56mmol/L为低。
            if (value < 0.56) {
                metricalRange = '低';
            } else if (value >= 0.56 && value <= 1.7) {
                metricalRange = '正常';
            } else if (value > 1.7 && value <= 2.2) {
                metricalRange = '偏高';
            } else if (value > 2.2) {
                metricalRange = '高';
            }
        } else if (paperType == 4) {
            //尿酸  男：149≤尿酸≤416 umol/L为正常。尿酸＜149 umol/L为低，416 umol/L＜尿酸为高。
            // 女：89≤尿酸≤357 umol/L为正常。尿酸＜89 umol/L为低，357 umol/L＜尿酸为高
            if (userSex == 0) {
                //男
                if (value < 149) {
                    metricalRange = '低';
                } else if (value >= 149 && value <= 416) {
                    metricalRange = '正常';
                } else if (value > 416) {
                    metricalRange = '高';
                }
            } else {
                //女
                if (value < 89) {
                    metricalRange = '低';
                } else if (value >= 89 && value <= 357) {
                    metricalRange = '正常';
                } else if (value > 357) {
                    metricalRange = '高';
                }
            }
        }
        return metricalRange;
    },


};