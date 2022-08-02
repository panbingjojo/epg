/**
 * 数据归档js
 */
var isFirstEnter = true; // 第一次进入加载数据
var TestRecord = {
    buttons: [],
    hideReportBtnCarriers: ['10000051', '10220094', '520094'],
    page: 0,
    maxPage: 0,
    keepFocusId: RenderParam.focusId || 'detail-0', // 当前选中的tab
    canUplaod: false,//是否开通上传天翼云
    pageNum: 5,//每页条数
    init: function () {
        H('table-wrap');
        H('report_bat');
        H('ask_fast');
        H('write-data');
        H('scroll-wrap');
        if (RenderParam.carrierId == '650092') {
            this.canUplaod = true;
            G('report_bat').style.display = 'block';
            G('notice_text').style.display = 'block';
        }
        this.page = RenderParam.page;
        this.keepFocusId = RenderParam.keepFocusId;
        this.createButtons();
        this.getData();
    },
    getData: function () {
        var _this = TestRecord;
        Network.getSpecifyRecordList(RenderParam.testType, function () {
            // curPaperType = btn.paperType;
            _this.data = recordList;
            _this.maxPage = _this.data.length;
            _this.renderTable();
            LMEPG.BM.requestFocus(TestRecord.keepFocusId)
            // 空数据
            S('table-wrap');
            G('null-data-000051').style.display = 'none';
            G('null-data-000051').innerHTML = '';
            if (recordList.length == 0) {
                Show("go-test");
                LMEPG.BM.requestFocus("go-test");
                H('table-wrap');
                H('report_bat');
                H('ask_fast');
                H('write-data');
                H('scroll-wrap');
                G('null-data-000051').style.display = 'block';
                G('null-data-000051').innerHTML = '暂无检测记录';
            } else {
                // TestRecord.keepFocusId = 'detail-0';
                S('table-wrap');
                S('report_bat');
                S('ask_fast');
                S('write-data');
                S('scroll-wrap');
                LMEPG.BM.requestFocus(TestRecord.keepFocusId)
            }
        });
    },

    data: [],
    /*渲染记录到表格*/
    renderTable: function (btn) {
        this.page = 0;
        this.createBloodListUI()
        this.getDistance(); // 得到当前的距离
    },
    /*创建表格*/
    currentData: [],
    // 创建列表UI
    createBloodListUI: function () {
        var Ns = this.page; // 起始位置
        console.log(this.data)
        this.currentData = this.data.slice(Ns, Ns + TestRecord.pageNum);
        var htmlStr = "";
        htmlStr += '<table  id="table" style="font-size: 25px;">';
        htmlStr += '<tr>';
        htmlStr += '  <td style="text-align: center;width: 304px">检测时间</td><td style="text-align: center;width: 204px">体重</td>' +
            '<td style="text-align: center;width: 324px">体脂率</td><td style="text-align: left;"></td>';
        htmlStr += '</tr>';
        for (var i = 0; i < this.currentData.length; i++) {
            var data = this.currentData[i];
            if (!LMEPG.Func.isObject(data)) {
                continue;
            }
            var measureType = data.paper_type;
            var measureDT = DT.format(data.measure_dt, "yyyy.MM.dd hh:mm:ss");
            var fatData = JSON.parse(data.measure_data)
            var bodyFat = fatData.pbf == "" ? "0" : data.env_temperature;
            // var measureLevel = HealthTest.getMetricalRange(measureType, RenderParam.member_gender, data.repast_id, formatData); reportRecord
            var reportImage = data.flag == "1" ? '/Public/img/hd/HealthTest/V13/reported_n.png' : g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord.png';
            if (TestRecord.canUplaod) {
                htmlStr += '<tr><td  colspan="3" style="height: 50px;"><ul id="detail-' + i + '" class="detail-2" data-link="' + data.measure_id + '" data-time="' + measureDT + '" data-fat="' + bodyFat + '" data-weight="' + fatData.weight + '" data-resistance="' + fatData.resistance + '"><li>' + measureDT + '</li>';
                htmlStr += '<li style="width: 230px">' + fatData.weight + 'KG</li>';
                // htmlStr += '<li>' + bodyFat + '</li></ul></td>';
                htmlStr += '<li>体脂率详情>>         </li></ul></td>';
                // htmlStr += '  <td style=" text-align: center;color: ' + measureLevel.color + '">' + measureLevel.text + '</td>';
                htmlStr += '<td class="test-delete-2" style="min-width: 31px;height: 50px;">' +
                    '<img style="margin-top: 15px" id="report-' + i + '" src="' + g_appRootPath + reportImage + '" measureId="' + data.measure_id + '" data-time="' + measureDT + '" data-fat="' + bodyFat + '" data-weight="' + fatData.weight + '" data-resistance="' + fatData.resistance + '" data-flag="' + data.flag + '" alt="">' +
                    '<img style="margin-top: 15px" id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.measure_id + '" alt="">';
                htmlStr += '</tr>';
            } else {
                htmlStr += '<tr><td  colspan="3" style="height: 50px;"><ul id="detail-' + i + '" class="detail-2" data-link="' + data.measure_id + '" data-time="' + measureDT + '" data-fat="' + bodyFat + '" data-weight="' + fatData.weight + '" data-resistance="' + fatData.resistance + '"><li>' + measureDT + '</li>';
                htmlStr += '<li style="width: 230px">' + fatData.weight + 'KG</li>';
                // htmlStr += '<li>' + bodyFat + '</li></ul></td>';
                htmlStr += '<li>体脂率详情>>         </li></ul></td>';
                // htmlStr += '  <td style=" text-align: center;color: ' + measureLevel.color + '">' + measureLevel.text + '</td>';
                htmlStr += '<td class="test-delete-2" style="min-width: 31px;height: 50px;">' +
                    // '<img style="margin-top: 15px" id="report-' + i + '" src="' + g_appRootPath + reportImage + '" measureId="' + data.measure_id + '" data-time="' + measureDT + '" data-fat="' + bodyFat + '" data-weight="' + fatData.weight + '" data-resistance="' + fatData.resistance + '" data-flag="' + data.flag + '" alt="">' +
                    '<img style="margin-top: 15px" id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.measure_id + '" alt="">';
                htmlStr += '</tr>';
            }
        }
        // htmlStr += '</table>';

        G('table-wrap').innerHTML = htmlStr;
        this.isOverflowWrap();
    },


    isOverflowWrap: function () {
        if (this.currentData.length > this.pageNum-1) {
            S('scroll-wrap');
        } else {
            H('scroll-wrap');
        }
    },
    Ns: 0, // 滚动条滚动基数
    Nc: 0, // 滚动条滚动变数
    getDistance: function () {
        var trHeight = RenderParam.platformType == 'hd' ? 50 : 40;
        var max = this.data.length * trHeight; // 滚动条移动最大的距离
        this.Ns = parseInt(((17500 - trHeight) / max));
    },
    onBeforeMoveChangeScrollDistance: function (key, btn) {
        var _this = TestRecord;
        var scrollElement = G('scroll-bar');
        var scrollBtnObj = LMEPG.BM.getButtonById('delete-0');

        initUpFocus();

        if (key == 'down' && (btn.id.indexOf('delete') >= 0
            || btn.id.indexOf('report') >= 0
            || btn.id.indexOf('detail') >= 0)) {
            setDetailDown();
            setDelDown();
            setReportDown();
        }

        if (key == 'up' && btn.id == 'write-data') {
            btn.nextFocusUp = 'delete-' + (_this.currentData.length - 1);
        }

        switch (true) {
            case key == 'left' || key == 'right':
                return;
            case key == 'up' && _this.page == 0:
                scrollBtnObj.nextFocusUp = 'ask_fast';
                break;
            case key == 'up' && (btn.id == 'delete-0' || btn.id == 'detail-0' || btn.id == 'report-0'):
                changeUp(btn.id);
                updateDis();
                setDetailDown();
                setDelDown();
                setReportDown();
                return false;
            case key == 'down' && (btn.id == 'delete-' + (TestRecord.pageNum - 1)
                || btn.id == 'detail-' + (TestRecord.pageNum - 1)
                || btn.id == 'report-' + (_this.pageNum - 1)):
                changeDown(btn.id);
                updateDis();
                setDetailDown();
                setDelDown();
                setReportDown();
                return false;
        }

        function setDetailDown() {
            var detailBtn;
            for (var i = 0; i < _this.pageNum; i++) {
                detailBtn = LMEPG.BM.getButtonById('detail-' + i);
                if (!!detailBtn === false)
                    break;
                detailBtn.nextFocusDown = (i + 1 == _this.pageNum) ? 'write-data' : ('detail-' + (i + 1));
            }

            detailBtn = LMEPG.BM.getButtonById('detail-' + (_this.currentData.length - 1));
            detailBtn.nextFocusDown = 'write-data';
        }


        function setDelDown() {
            var delBtn;
            for (var i = 0; i < _this.pageNum; i++) {
                delBtn = LMEPG.BM.getButtonById('delete-' + i);
                if (!!delBtn === false)
                    break;
                delBtn.nextFocusDown = (i + 1 == _this.pageNum) ? 'write-data' : ('delete-' + (i + 1));
            }

            delBtn = LMEPG.BM.getButtonById('delete-' + (_this.currentData.length - 1));
            delBtn.nextFocusDown = 'write-data';
        }

        function setReportDown() {
            var reportBtn;
            for (var i = 0; i < _this.pageNum; i++) {
                reportBtn = LMEPG.BM.getButtonById('report-' + i);
                if (!!reportBtn === false)
                    break;
                reportBtn.nextFocusDown = (i + 1 == _this.pageNum) ? 'write-data' : ('report-' + (i + 1));
            }

            reportBtn = LMEPG.BM.getButtonById('report-' + (_this.currentData.length - 1));
            if (!!reportBtn === true)
                reportBtn.nextFocusDown = 'write-data';
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
            _this.Nc = Math.max(-50, _this.Nc -= _this.Ns);
            _this.page--;
            _this.createBloodListUI()
            _this.moveToFocus(btn.id);
        }

        function changeDown(id) {
            if (_this.page == _this.maxPage - (_this.pageNum - 1)) {
                return;
            }
            _this.Nc = Math.min(300, _this.Nc += _this.Ns);
            _this.page++;
            _this.createBloodListUI()

            if (btn.id.indexOf('detail') >= 0) {
                _this.moveToFocus('detail-' + (_this.currentData.length - 1));
            } else if (btn.id.indexOf('report') >= 0) {
                _this.moveToFocus('report-' + (_this.currentData.length - 1));
            } else {
                _this.moveToFocus('delete-' + (_this.currentData.length - 1));
            }
        }
    },
    moveToFocus: function (id) {
        LMEPG.BM.requestFocus(id);
    },
    moveToFocus: function (id) {
        LMEPG.BM.requestFocus(id);
    },
    createButtons: function () {
        this.buttons.push({
            id: 'report_bat',
            name: '一键上传至云盘',
            type: 'img',
            nextFocusRight: 'ask_fast',
            nextFocusDown: 'report-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord_bat.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord_bat_f.png',
            click: PageJump.jumpReportDataBat,
        }, {
            id: 'ask_fast',
            name: '一键问医',
            type: 'img',
            nextFocusLeft: this.canUplaod ? 'report_bat' : '',
            nextFocusDown: 'delete-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/ask_fast.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/ask_fast_f.png',
            click: TestRecord.onClickOneKeyInquiry,
        }, {
            id: 'scroll-bar',
            name: '滚动条',
            type: 'img',
            nextFocusUp: 'ask_fast',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/all_delete.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/all_delete_f.png',
            focusChange: this.onFocusChangeColor,
            beforeMoveChange: ''
        }, {
            id: 'go-test',
            name: '去检测',
            type: 'img',
            nextFocusUp: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/go_test.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/go_test_f.png',
            click: PageJump.jumpTest,
            beforeMoveChange: '',
            cName: "testIndex",
        });
        var count = TestRecord.pageNum;
        if (!TestRecord.canUplaod) {
            while (count--) {
                this.buttons.push({
                    id: 'delete-' + count,
                    name: '列表删除焦点',
                    type: 'img',
                    nextFocusUp: count == 0 ? 'ask_fast' : 'delete-' + (count - 1),
                    nextFocusDown: 'delete-' + (count + 1),
                    nextFocusRight: '',
                    nextFocusLeft: 'detail-' + count,
                    click: Network.deleteArchiveRecord,
                    focusChange: this.onFocusChange,
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord_f.png',
                    beforeMoveChange: this.onBeforeMoveChangeScrollDistance
                });
                this.buttons.push({
                    id: 'detail-' + count,
                    name: '详情',
                    type: 'div',
                    nextFocusUp: count == 0 ? 'ask_fast' : 'detail-' + (count - 1),
                    nextFocusDown: 'detail-' + (count + 1),
                    nextFocusRight: 'delete-' + count,
                    nextFocusLeft: '',
                    click: PageJump.jumpRecordDetail,
                    focusChange: this.onFocusChange,
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/all_btn.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/all_btn_f.png',
                    beforeMoveChange: this.onBeforeMoveChangeScrollDistance
                });
            }
        } else {
            while (count--) {
                this.buttons.push({
                    id: 'delete-' + count,
                    name: '列表删除焦点',
                    type: 'img',
                    nextFocusUp: count == 0 ? 'ask_fast' : 'report-' + (count - 1),
                    nextFocusDown: 'delete-' + (count + 1),
                    nextFocusRight: '',
                    nextFocusLeft: 'report-' + count,
                    click: Network.deleteArchiveRecord,
                    focusChange: this.onFocusChange,
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord_f.png',
                    beforeMoveChange: this.onBeforeMoveChangeScrollDistance
                });
                this.buttons.push({
                    id: 'report-' + count,
                    name: '列表上报数据焦点',
                    type: 'img',
                    nextFocusUp: count == 0 ? 'report_bat' : 'report-' + (count - 1),
                    nextFocusDown: 'report-' + (count + 1),
                    nextFocusRight: 'delete-' + count,
                    nextFocusLeft: 'detail-' + count,
                    click: PageJump.jumpReportData,
                    focusChange: this.onReportDataFocus,
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord_f.png',
                    beforeMoveChange: this.onBeforeMoveChangeScrollDistance
                });
                this.buttons.push({
                    id: 'detail-' + count,
                    name: '详情',
                    type: 'div',
                    nextFocusUp: count == 0 ? 'report_bat' : 'detail-' + (count - 1),
                    nextFocusDown: 'detail-' + (count + 1),
                    nextFocusRight: 'report-' + count,
                    nextFocusLeft: '',
                    click: PageJump.jumpRecordDetail,
                    focusChange: this.onFocusChange,
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/all_btn.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/all_btn_f.png',
                    beforeMoveChange: this.onBeforeMoveChangeScrollDistance
                });
            }
        }

        this.buttons.push({
            id: 'write-data',
            name: '全部删除',
            type: 'img',
            nextFocusUp: 'delete-' + (TestRecord.pageNum - count - 1),
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/all_delete.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/all_delete_f.png',
            click: Network.deleteAllRecord,
            beforeMoveChange: this.onBeforeMoveChangeScrollDistance,
        });

        LMEPG.BM.init(TestRecord.keepFocusId, this.buttons, '', true);
    },

    onReportDataFocus: function (btn, has) {
        var eventSrc = G(btn.id)
        var isReport = eventSrc.getAttribute("data-flag") == "1";
        var focusImage = isReport ? '/Public/img/hd/HealthTest/V13/reported_f.png' : g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord_f.png';
        var normalImage = isReport ? '/Public/img/hd/HealthTest/V13/reported_n.png' : g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord.png';
        if (has) {
            eventSrc.src = g_appRootPath + focusImage;
        } else {
            eventSrc.src = g_appRootPath + normalImage;
        }
    },

    /** 一键问医响应事件 */
    onClickOneKeyInquiry: function (btnObj) {
        var inquiryInfo = {
            userInfo: {
                isVip: RenderParam.isVip,                                    // 用户身份信息标识
                accountId: RenderParam.accountId,                            // IPTV业务账号
            },
            memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
            moduleInfo: {
                moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                focusId: btnObj.id,                                          // 当前页面的焦点Id
                intent: PageJump.getCurrentPage(),                           // 当前模块页面路由标识
            },
            serverInfo: {
                fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                cwsHlwyyUrl: RenderParam.teletextInquiryServerUrl,           // cws互联网医院模块链接地址
                teletextInquiryUrl: RenderParam.cwsInquirySeverUrl,          // 微信图文问诊服务器链接地址
            },
            blacklistHandler: TestRecord.inquiryBlacklistHandler,            // 校验用户黑名单时处理函数
            noTimesHandler: TestRecord.noInquiryTimesHandler,                // 检验普通用户无问诊次数处理函数
            doctorOfflineHandler: TestRecord.showDoctorOfflineTips,          // 检验医生离线状态时处理函数
            inquiryEndHandler: TestRecord.inquiryEndHandler,                 // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        }

        LMEPG.Inquiry.p2p.oneKeyInquiry(inquiryInfo); // 启动一键问诊
    },

    inquiryBlacklistHandler: function (focusIdOnHideDialog) {
        var forbiddenAskTips = '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。';
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: modal.hide
        }, '', forbiddenAskTips, '');
    },

    noInquiryTimesHandler: function(focusIdOnHideDialog){
        var noInquiryTimesTips = '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊'
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: PageJump.jumpBuyVip
        }, '', noInquiryTimesTips, '');
    },

    /**
     * 医生不在线处理函数
     */
    showDoctorOfflineTips: function () {
        LMEPG.UI.showToast('当前医生不在线');
    },

    /**
     * 医生问诊结束处理函数
     */
    inquiryEndHandler: function () {

    }
};

/**
 * ============================================健康检测相关===============================================
 */
var curPaperType = 1; // 当前试纸类型
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
};

/**
 * ============================================网络请求===============================================
 */
var recordList = [];
var Network = {
    /**
     * 获取指定类型的检测记录
     * @param paperType
     */
    getSpecifyRecordList: function (paperType, callback) {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Measure/queryMemberInspectRecord', {
            'paperType': paperType,
            'memberId': RenderParam.member_id
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);
            if (data.result == 0) {
                recordList = data.list;
                TestRecord.keepFocusId='detail-0';
                callback();
            } else {
                LMEPG.UI.showToast('数据获取失败！');
            }
        });
    },
    /**
     * 删除所有已归档数据
     * @param measureId
     */
    deleteAllRecord: function (btn) {
        LMEPG.UI.showWaitingDialog('');
        var deviceType = RenderParam.testType
        var measureId = G(btn.id).getAttribute('measureId');
        LMEPG.ajax.postAPI('Measure/deleteArchiveRecord', {
            'deviceType': deviceType,
            'measureId': "-1",
            'memberId': RenderParam.member_id
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);
            if (data.result == 0) {
                LMEPG.UI.showToast('删除成功！');
                TestRecord.getData();
            } else {
                LMEPG.UI.showToast('删除失败！');
            }
        });
    },


    /**
     * 删除一条已归档数据
     * @param measureId
     */
    deleteArchiveRecord: function (btn) {
        LMEPG.UI.showWaitingDialog('');
        var measureId = G(btn.id).getAttribute('measureId');
        LMEPG.ajax.postAPI('Measure/deleteArchiveRecord', {
            'measureId': measureId,
            'memberId': RenderParam.member_id
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);
            if (data.result == 0) {
                LMEPG.UI.showToast('删除成功！');
                TestRecord.getData();
            } else {
                LMEPG.UI.showToast('删除失败！');
            }
        });
    }
};

/**
 * ===========================================页面跳转==============================================
 */
var PageJump = {
    /**
     * 获取当前页面
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('weight-list');
        objCurrent.setParam('keepFocusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('testType', RenderParam.testType);
        objCurrent.setParam('page', TestRecord.page);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        return objCurrent;
    },
    /**
     * 删除一条已归档数据
     * @param measureId
     */
    jumpTest: function (btn) {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent(btn.cName);
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 删除一条已归档数据
     * @param measureId
     */
    jumpRecordDetail: function (btn) {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('weight-detail');
        var measureId = G(btn.id).getAttribute("data-link");
        dstPage.setParam("measureId", measureId);
        dstPage.setParam('member_id', RenderParam.member_id);
        dstPage.setParam('member_image_id', RenderParam.member_image_id);
        dstPage.setParam('member_name', RenderParam.member_name);
        dstPage.setParam('time', G(btn.id).getAttribute("data-time"));
        dstPage.setParam('fat', G(btn.id).getAttribute("data-fat"));
        dstPage.setParam('weight', G(btn.id).getAttribute("data-weight"));
        dstPage.setParam('resistance', G(btn.id).getAttribute("data-resistance"));
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 跳转数据上报页面
     * @param btn 绑定具体某条数据
     */
    jumpReportData: function (btn) {
        var eventSrc = G(btn.id);
        var reportFlag = eventSrc.getAttribute("data-flag");
        if (reportFlag == "1") {
            LMEPG.UI.showToast("数据已上报，请勿重复上报！");
        } else if (reportFlag == "2") {
            LMEPG.UI.showToast("手动输入的数据不可上报！");
        } else {
            var curPage = PageJump.getCurrentPage();
            var dstPage = LMEPG.Intent.createIntent('report-data');
            dstPage.setParam("measureType", "weight");

            var measureId = eventSrc.getAttribute('measureId');
            var date = eventSrc.getAttribute('data-time');
            var fatRate = eventSrc.getAttribute('data-fat');
            var weight = eventSrc.getAttribute('data-weight') + "KG";
            var resistance = eventSrc.getAttribute('data-resistance');
            dstPage.setParam("measureId", measureId);
            dstPage.setParam('member_id', RenderParam.member_id);
            dstPage.setParam('member_image_id', RenderParam.member_image_id);
            dstPage.setParam('member_name', RenderParam.member_name);
            var measureData = {
                'date': date,
                'fat': fatRate,
                'weight': weight,
                'resistance': resistance
            }
            dstPage.setParam('measureData', JSON.stringify(measureData));
            LMEPG.Intent.jump(dstPage, curPage);
        }
    },
    /**
     * 跳转数据批量上报页面
     * @param btn 绑定具体某条数据
     */
    jumpReportDataBat: function () {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('report-data-bat');
        dstPage.setParam("measureType", "weight");

        dstPage.setParam('member_id', RenderParam.member_id);
        dstPage.setParam('member_image_id', RenderParam.member_image_id);
        dstPage.setParam('member_name', RenderParam.member_name);
        dstPage.setParam('test_type', RenderParam.testType);

        LMEPG.Intent.jump(dstPage, curPage);
    },

    /** 问诊时没有问诊次数跳转计费 */
    jumpBuyVip: function () {
        modal.hide();
        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

};

var onBack = function () {
    LMEPG.Intent.back();
};