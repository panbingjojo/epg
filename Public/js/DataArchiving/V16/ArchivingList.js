/**
 * 数据归档js
 */
// 当前服务器时间
var curServerTime = 0;

var DataArchive = {
    buttons: [],
    page: 0,
    maxPage: 0,
    tabType: 1, // 1-当前是健康检测Tab页面 2-当前是问医记录Tab页面
    curClickItemIndex: 0, // 当前点击的列表项的数组下标
    dialogMsg: {
        forbiddenAsk: '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。',
        noTimes: '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊'
    },
    init: function () {
        this.createButtons();
    },

    /*显示对应记录*/
    showTableRecord: function (btn, hasFocus) {
        var me = DataArchive;
        if (hasFocus) {
            switch (btn.id) {
                // 渲染未归档问医记录
                case 'ask-doctor-record':
                    // 如果不是从问医记录详情返回，则不需要焦点保持
                    if (LMEPG.Func.isEmpty(RenderParam.isFromAskDoctorDetailPageBack)) {
                        RenderParam.page = 1;
                        RenderParam.focusId = '';
                    }

                    // 如果当前页面加载了数据，回到tab按钮时不需要重新加载数据
                    if (hasLoadData && me.tabType == 2) {
                        return;
                    }

                    DataArchive.page = parseInt(RenderParam.page);
                    Network.getInquiryRecordList(DataArchive.page, function () {
                        DataArchive.tabType = 2;
                        me.data = inquiryRecordListFromCWS;// 问医数据
                        if (me.data.length) {
                            me.thead = ['问医时间', '医生信息', '主诉'];
                            me.renderTable();
                        } else {
                            me.nullAskRecordData();
                        }

                        // 数据保持和焦点恢复
                        if (!LMEPG.Func.isEmpty(RenderParam.focusId)) {
                            LMEPG.BM.requestFocus(RenderParam.focusId);
                        }
                        // 数据保持完成后，把保持信息清除，因为跳转到另一个tab，数据保持就不需要了
                        RenderParam.page = 1;
                        RenderParam.focusId = '';
                    });
                    break;
                // 渲染未归档检测记录
                case 'test-record':
                    // 切换到检测记录tab后，问医记录的数据保持就不需要了
                    RenderParam.isFromAskDoctorDetailPageBack = '';

                    // 如果当前页面加载了数据，回到tab按钮时不需要重新加载数据
                    if (hasLoadData && me.tabType == 1) {
                        return;
                    }
                    DataArchive.page = 1;
                    if (!LMEPG.Func.isEmpty(RenderParam.page)) {
                        DataArchive.page = +RenderParam.page;
                    }
                    Network.getTestRecordList(DataArchive.page, function () {
                        DataArchive.tabType = 1;
                        me.data = testRecordList;// 检测数据
                        if (me.data && me.data.length) {
                            me.thead = ['检测时间', '检测类型', '检测数值'];
                            me.renderTable();
                        } else {
                            me.nullTestRecordData();
                        }

                        // 数据保持和焦点恢复
                        if (!LMEPG.Func.isEmpty(RenderParam.focusId)) {
                            LMEPG.BM.requestFocus(RenderParam.focusId);
                            // DataArchive.onClickTable(LMEPG.BM.getButtonById(RenderParam.focusId));
                        }
                        // 数据保持完成后，把保持信息清除，因为跳转到另一个tab，数据保持就不需要了
                        RenderParam.page = 1;
                        RenderParam.focusId = '';
                    });

                    // 进入检测Tab页面后，获取此时服务器时间。轮询得到的数据的第一条，将和此时间比较，如果是最新数据，则刷新页面
                    LMEPG.ajax.postAPI('Expert/getTime', {}, function (timeStr) {
                        console.log(timeStr);
                        LMEPG.Log.info("健康检测当前服务器时间：" + timeStr);
                        // curServerTime = Date.parse(timeStr);
                        LMEPG.Log.info("健康检测当前服务器时间毫秒数：" + curServerTime);
                        // 轮询
                        HealthMeasure.polling();
                    });
                    break;
            }
        }
    },
    data: [], // 为空则显示检测的三个按钮
    pageData: [],// 当前页面要显示的数据
    /*截取当前页面的数据*/
    getCurrentPageData: function () {
        var start = 0;
        this.pageData = this.data.slice(start, start + 5);
    },
    /*渲染记录到表格*/
    thead: ['问医时间', '医生信息', '主诉'],
    renderTable: function () {
        this.getCurrentPageData();
        this.initTabFocusDown('focus-0');
        this.recordDataTable(this.thead);
        this.toggleArrow();
    },
    /*对应移动到功能按钮上*/
    initTabFocusDown: function (id) {
        LMEPG.BM.getButtonById('ask-doctor-record').nextFocusDown = id;
        // LMEPG.BM.getButtonById('test-record').nextFocusDown = id;
    },
    /*创建表格*/
    recordDataTable: function (thead) {
        var data = this.pageData;
        var htm = '<table id="table-wrap">';
        htm += '<tr class="thead-txt"><td>' + thead[0] + '</td><td>' + thead[1] + '</td><td>' + thead[2] + '</td></tr>';
        data.forEach(function (t, i) {
            var content1, content2, content3;
            // 检测记录
            if (DataArchive.tabType == 1) {
                content1 = t.measure_dt; // 检测时间
                content2 = HealthMeasure.getPaperTypeName(t.extra_data1); // 检测类型
                content3 = t.extra_data2 + HealthMeasure.getMetricalUnit(t.extra_data1); // 检测数值
            }
            // 问医记录
            else {
                var cutTxt = function (str, len) {
                    var txt = str;
                    if (txt.length > len) {
                        txt = txt.slice(0, len) + '...';
                    }
                    return txt;
                };
                content1 = t.connected_dt; // 问医时间
                var additionInfo = '';
                if (inquiryRecordListFrom39[i].department && inquiryRecordListFrom39[i].job_title) {
                    additionInfo = '(' + inquiryRecordListFrom39[i].department + '/' + inquiryRecordListFrom39[i].job_title + ')';
                }
                content2 = cutTxt(t.doctor_name + additionInfo, 12); // 医生信息（医生姓名）
                content3 = LMEPG.Func.isEmpty(inquiryRecordListFrom39[i].disease_desc) ? '无' : cutTxt(inquiryRecordListFrom39[i].disease_desc, 10); // 主诉
            }
            htm += '<tr id=focus-' + i + '  class="tbody-txt"><td class="td-time">' + content1 + '</td><td class="td-info">' + content2 + '</td><td  class="td-result">' + content3 + '</td></tr>';
        });
        G('record-container').innerHTML = htm;
    },
    /*没有检测记录*/
    nullTestRecordData: function () {
        H('prev-arrow');
        H('next-arrow');
        var htm = '<table id="table-wrap">';
        if (isBindDevice) {
            htm += '<table id="table-wrap"><tr><td class="thead-title">还没有检测记录，赶快去测测吧！</td></tr>';
            htm += '<tr><td align="center"><img id="test-bloodSugar" src="' + g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_bloodSugar.png" alt="检测血糖"></td></tr>';
            htm += '<tr><td align="center"><img id="test-UA" src="' + g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_ua.png" alt="检测尿酸"></td></tr>';
            htm += '<tr><td align="center"><img id="test-cholesterol" src="' + g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_cholesterol.png" alt="检测胆固醇"></td></tr>';
            this.initTabFocusDown('test-bloodSugar');
        } else {
            htm += '<tr><td class="thead-title">未绑定任何设备哦~</td></tr>';
        }
        G('record-container').innerHTML = htm;
    },
    /*没有问医记录*/
    nullAskRecordData: function () {

        H('prev-arrow');
        H('next-arrow');
        var htm = '<table id="table-wrap">';
        htm += '<table id="table-wrap"><tr><td class="thead-title">还没有问医记录哦！</td></tr>';
        htm += '<tr><td align="center"><img id="to-ask-doctor"' +
            ' src="' + g_appRootPath + '/Public/img/hd/DataArchiving/V16/to_ask_doctor.png"' +
            ' alt="一键问医"/></td></tr>';
        G('record-container').innerHTML = htm;
        this.initTabFocusDown('to-ask-doctor');
    },
    /*上一页*/
    prevTablePage: function () {
        if (this.page == 1) {
            if (this.tabType == 1) {
                this.moveToFocus('test-record');
            } else {
                this.moveToFocus('ask-doctor-record');
            }
            return;
        }

        if (this.tabType == 1) { // 检测Tab
            Network.getTestRecordList(DataArchive.page - 1, function () {
                DataArchive.page--;
                DataArchive.data = testRecordList;// 检测数据
                DataArchive.renderTable();
                DataArchive.moveToFocus('focus-4');
            });
        } else { // 问医Tab
            Network.getInquiryRecordList(DataArchive.page - 1, function () {
                DataArchive.page--;
                DataArchive.data = inquiryRecordListFromCWS;// 问医数据
                DataArchive.renderTable();
                DataArchive.moveToFocus('focus-4');
            });
        }
    },
    /*下一页*/
    nextTablePage: function () {
        if (this.page == this.maxPage) {
            return;
        }

        if (this.tabType == 1) { // 检测Tab
            Network.getTestRecordList(DataArchive.page + 1, function () {
                DataArchive.page++;
                DataArchive.data = testRecordList;// 检测数据
                DataArchive.renderTable();
                DataArchive.moveToFocus('focus-0');
            });
        } else { // 问医Tab
            Network.getInquiryRecordList(DataArchive.page + 1, function () {
                DataArchive.page++;
                DataArchive.data = inquiryRecordListFromCWS;// 问医数据
                DataArchive.renderTable();
                DataArchive.moveToFocus('focus-0');
            });
        }
    },
    toggleArrow: function () {
        S('prev-arrow');
        S('next-arrow');
        console.log(this.page, this.maxPage);
        this.page == 1 && H('prev-arrow');
        this.page == this.maxPage && H('next-arrow');
    },
    // 点击列表项
    onClickTable: function (btn) {
        // 保存点击项下标
        DataArchive.curClickItemIndex = parseInt(btn.id.substr(6));
        if (DataArchive.tabType == 1) { // 点击检测项
            HealthMeasure.initMeasureMember();
            HealthMeasure.initStatusMomentList(testRecordList[parseInt(btn.id.substr(6))].extra_data1);
            console.log(DataArchive.testMember);
            console.log(DataArchive.testStatus);

            // 检测成员
            G('prev-member').innerHTML = DataArchive.testMember[0].member_name;
            G('select-member').innerHTML = DataArchive.testMember[1].member_name;
            G('next-member').innerHTML = DataArchive.testMember[2].member_name;
            // 检测状态
            G('prev-status').innerHTML = DataArchive.testStatus[0].name;
            G('select-status').innerHTML = DataArchive.testStatus[1].name;
            G('next-status').innerHTML = DataArchive.testStatus[2].name;

            S('choice-inner');
            DataArchive.tableBeClickItem = btn.id;
            LMEPG.BM.requestFocus('select-member');
        } else { // 点击问医项
            PageJump.jumpDoctorRecord(btn);
        }
    },
    onFocusChange: function (btn, hasFocus) {
        var btnEl = G(btn.id);
        if (hasFocus) {
            btnEl.setAttribute('class', 'tbody-txt focus');
        } else {
            btnEl.setAttribute('class', 'tbody-txt');
        }
    },
    onBeforeFocusMoveTable: function (key, btn) {
        if (key == 'up' && btn.id == 'focus-0') {
            DataArchive.prevTablePage();
            return false;
        }
        if (key == 'down' && btn.id == 'focus-4') {
            DataArchive.nextTablePage();
            return false;
        }
    },
    onFocusChangeColor: function (btn, bol) {
        var btnEl = G(btn.id);
        if (bol) {
            btnEl.className = 'focus';
        } else {
            btnEl.className = '';
        }
    },
    testMember: [], // 检测成员
    testStatus: [], // 检测状态
    onBeforeMoveSwitchItem: function (key, btn) {
        var me = DataArchive;

        // switch (true) {
        // 	case key == 'left' || key == 'right':
        // 		return;
        // 	case btn.id == 'select-member': // 选择检测成员
        // 		me.testData = me.testMember;
        // 		break;
        // 	case btn.id == 'select-status':// 选择检测状态
        // 		me.testData = me.testStatus;
        // 		break;
        // }

        // 选择检测成员/状态上一个
        function switchUp(btn) {
            if (key == 'up') {
                if (btn.id == 'select-member') {
                    me.testMember.unshift(me.testMember.pop());
                } else if (btn.id == 'select-status') {
                    me.testStatus.unshift(me.testStatus.pop());
                }
            }
        }

        // 选择检测成员/状态下一个
        function switchDown(btn) {
            if (key == 'down') {
                if (btn.id == 'select-member') {
                    me.testMember.push(me.testMember.shift());
                } else if (btn.id == 'select-status') {
                    me.testStatus.push(me.testStatus.shift());
                }
            }
        }

        switchUp(btn);
        switchDown(btn);
        me.renderTestData(btn);
    },
    /*渲染选择检测的成员/状态*/
    renderTestData: function (btn) {
        if (btn) {
            var selectIndex = btn.id.slice(7);
            console.log(selectIndex);

            if (btn.id == 'select-member') {
                G('prev-' + selectIndex).innerHTML = this.testMember[0].member_name;
                G(btn.id).innerHTML = this.testMember[1].member_name;
                G('next-' + selectIndex).innerHTML = this.testMember[2].member_name;
            } else if (btn.id == 'select-status') {
                G('prev-' + selectIndex).innerHTML = this.testStatus[0].name;
                G(btn.id).innerHTML = this.testStatus[1].name;
                G('next-' + selectIndex).innerHTML = this.testStatus[2].name;
            }
        } else {
            // S('choice-inner');
            // this.testData = []; // 初始化检测数组
            // // 检测成员
            // G('prev-member').innerHTML = this.testMember[0];
            // G('select-member').innerHTML = this.testMember[1];
            // G('next-member').innerHTML = this.testMember[2];
            // // 检测状态
            // G('prev-status').innerHTML = this.testStatus[0];
            // G('select-status').innerHTML = this.testStatus[1];
            // G('next-status').innerHTML = this.testStatus[2];
        }
    },
    createButtons: function () {
        var STATIC_TR = 5;// 固定的5个tr焦点对象
        while (STATIC_TR--) {
            this.buttons.push({
                id: 'focus-' + STATIC_TR,
                name: '列表焦点',
                type: 'div',
                nextFocusUp: 'focus-' + (STATIC_TR - 1),
                nextFocusDown: 'focus-' + (STATIC_TR + 1),
                click: this.onClickTable,
                // focusChange: this.onFocusChange,
                beforeMoveChange: this.onBeforeFocusMoveTable,
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                // focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/tr_f.png' : g_appRootPath + '/Public/img/hd/DataArchiving/V16/tr_f.png'
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/tr_f.png'
            });
        }
        this.buttons.push({
            id: 'ask-doctor-record',
            name: '问医记录',
            type: 'img',
            nextFocusDown: 'test-UA',
            nextFocusRight: 'test-record',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/ask_record.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/ask_record_f.png',
            focusChange: this.showTableRecord
        }, {
            id: 'test-record',
            name: '检测记录',
            type: 'img',
            nextFocusDown: 'test-bloodSugar',
            nextFocusLeft: 'ask-doctor-record',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_record.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_record_f.png',
            focusChange: this.showTableRecord
        }, {
            id: 'test-bloodSugar',
            name: '无数据-检测血糖',
            type: 'img',
            nextFocusUp: 'test-record',
            nextFocusDown: 'test-UA',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_bloodSugar.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_bloodSugar_f.png',
            click: PageJump.jumpImeiInputPage,
            testType: 3
        }, {
            id: 'test-UA',
            name: '无数据-检测尿酸',
            type: 'img',
            nextFocusUp: 'test-bloodSugar',
            nextFocusDown: 'test-cholesterol',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_ua.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_ua_f.png',
            click: PageJump.jumpImeiInputPage,
            testType: 2
        }, {
            id: 'test-cholesterol',
            name: '无数据-检测胆固醇',
            type: 'img',
            nextFocusUp: 'test-UA',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_cholesterol.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/test_cholesterol_f.png',
            click: PageJump.jumpImeiInputPage,
            testType: 1
        }, {
            id: 'to-ask-doctor',
            name: '无数据-一键问医',
            type: 'img',
            nextFocusUp: 'ask-doctor-record',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/to_ask_doctor.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/to_ask_doctor_f.png',
            click: ''
        }, {
            id: 'btn-submit',
            name: '提交',
            type: 'img',
            nextFocusLeft: 'select-status',
            nextFocusDown: 'btn-delete',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/btn_submit.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/btn_submit_f.png',
            click: Network.dataSubmit
        }, {
            id: 'btn-delete',
            name: '删除',
            type: 'img',
            nextFocusLeft: 'select-status',
            nextFocusUp: 'btn-submit',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/btn_delete.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/btn_delete_f.png',
            click: Network.dataDelete
        }, {
            id: 'select-status',
            name: '选择检测状态',
            type: 'others',
            nextFocusLeft: 'select-member',
            nextFocusRight: 'btn-delete',
            click: '',
            focusChange: this.onFocusChangeColor,
            beforeMoveChange: this.onBeforeMoveSwitchItem
        }, {
            id: 'select-member',
            name: '选择检测成员',
            type: 'others',
            nextFocusRight: 'select-status',
            click: PageJump.jumpMemberEditPage,
            focusChange: this.onFocusChangeColor,
            beforeMoveChange: this.onBeforeMoveSwitchItem
        });
        LMEPG.BM.init(RenderParam.showAskDoctorTab == 0 ? 'test-record' : 'ask-doctor-record', this.buttons, '', true);
    },
    moveToFocus: function (id) {
        LMEPG.BM.requestFocus(id);
    }
};

function onBack() {
    var choiceInner = G('choice-inner').style.visibility;
    if (choiceInner == 'visible') {
        H('choice-inner');
        LMEPG.BM.requestFocus(DataArchive.tableBeClickItem);
    } else {
        LMEPG.Intent.back();
    }
}

/**
 * ====================================================网络请求=======================================================
 */
var testRecordList = []; // 未归档的检测记录列表
var inquiryRecordListFromCWS = []; // 未归档的问医记录列表
var inquiryRecordListFrom39 = []; // 未归档的问医记录列表（信息一部分来自cws，一部分来自39）
var hasLoadData = false; // 表示是否页面加载了数据
var isBindDevice = true; // 是否绑定了设备id
var Network = {
    /**
     * 获取未归档的检测记录列表
     */
    getTestRecordList: function (pageCurrent, callback) {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            page_current: pageCurrent,
            page_num: 5
        };
        LMEPG.ajax.postAPI('Measure/queryUnarchivedRecordList', postData, function (data) {
            var data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);
            if (data.result == 0 || data.result == -201) { // 201表示没有绑定设备
                if (data.result == 0) isBindDevice = true;
                if (data.result == -201) isBindDevice = false;
                testRecordList = data.list;
                DataArchive.maxPage = Math.ceil(data.count / 5);
                hasLoadData = true;
                callback();
            } else {
                LMEPG.UI.showToast('数据获取失败！');
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 获取未归档的问医记录列表
     */
    getInquiryRecordList: function (pageCurrent, callback) {
        LMEPG.UI.showWaitingDialog('');
        var postData = {
            page_current: pageCurrent,
            page_num: 5
        };
        LMEPG.ajax.postAPI('Doctor/getNotArchivePageRecord', postData, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(data);
              
                if (data instanceof Object) {
                    var mInquiryList = data.requiryList;
                    var mInquiry39List = data.requiry39List;

                    if (mInquiryList.result == 0) {
                        var list = mInquiryList.list;
                        inquiryRecordListFromCWS = list;
                        inquiryRecordListFrom39 = mInquiry39List;
                        DataArchive.maxPage = Math.ceil(mInquiryList.count / 5);
                        hasLoadData = true;
                        callback();
                    } else {
                        LMEPG.UI.showToast('获取数据失败:' + data.result);
                    }
                } else {
                    LMEPG.UI.showToast('获取数据失败');
                }

            } catch (e) {
                G('debug').innerHTML += e.toString();
                LMEPG.UI.showToast('获取数据解析异常', e.toString());
            }
        }, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast('获取数据请求失败');
        });
    },

    /**
     * 提交
     */
    dataSubmit: function () {
        // 判断是否选择了家庭成员
        if (DataArchive.testMember[1].member_name == '增加') {
            LMEPG.UI.showToast('请选择家庭成员！');
            return;
        }

        var latestRepastId = '-1';
        var latestTimebucketId = '-1';
        switch (Measure.getTypeAsInt(testRecordList[DataArchive.curClickItemIndex].extra_data1)) {
            case Measure.Type.BLOOD_GLUCOSE: //血糖：使用repast_id
                latestRepastId = DataArchive.testStatus[1].id;
                break;
            default: //胆固醇和尿酸等其他：使用timebucket_id
                latestTimebucketId = DataArchive.testStatus[1].id;
                break;
        }
        var postData = {
            member_id: DataArchive.testMember[1].member_id,
            measure_id: testRecordList[DataArchive.curClickItemIndex].measure_id,
            repast_id: latestRepastId,
            timebucket_id: latestTimebucketId,
            paper_type: testRecordList[DataArchive.curClickItemIndex].extra_data1,
            env_temperature: 0,
            measure_data: testRecordList[DataArchive.curClickItemIndex].extra_data2,
            measure_dt: testRecordList[DataArchive.curClickItemIndex].measure_dt
        };
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Measure/archiveInspectRecord', postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            console.log(data);
            if (data.result === 0) {
                LMEPG.UI.showToast('归档成功');
                // 刷新当前页面
                var objSrc = null;
                var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
                LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
            } else {
                LMEPG.UI.showToast('归档失败！[' + data.result + ']');
            }
        });
    },

    /**
     * 删除
     */
    dataDelete: function (btn) {

        modal.commonDialog({beClickBtnId: btn.id, onClick: doDelete}, '', '确定删除该条数据？', '删除后相应的数据将无法恢复哦！');

        function doDelete() {
            LMEPG.UI.showWaitingDialog('');
            LMEPG.ajax.postAPI('Measure/deleteInspectRecord', {measureId: testRecordList[DataArchive.curClickItemIndex].measure_id}, function (data) {
                LMEPG.UI.dismissWaitingDialog();
                console.log(data);
                if (data.result === 0) {
                    LMEPG.UI.showToast('删除成功');
                    // 刷新当前页面
                    var objSrc = null;
                    var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                } else {
                    LMEPG.UI.showToast('删除失败！[' + data.result + ']');
                }
            });
        }
    },
};

/**
 * ============================================健康检测================================================
 */
var HealthMeasure = {
    /**
     * 获取试纸类型名
     * @param paperType
     * @returns {string}
     */
    getPaperTypeName: function (paperType) {
        var strPaperType;
        switch (parseInt(paperType)) {
            case 1:
                strPaperType = '血糖';
                break;
            case 2:
                strPaperType = '胆固醇';
                break;
            case 3:
                strPaperType = '甘油三脂';
                break;
            case 4:
                strPaperType = '尿酸';
                break;
            default:
                strPaperType = '未知';
                break;
        }
        return strPaperType;
    },

    /**
     * 得到测量数据单位
     * @param paperType
     * @returns {string}
     */
    getMetricalUnit: function (paperType) {
        paperType = parseInt(paperType);
        var name = 'mmol/L';
        if (paperType == 1 ||
            paperType == 2 ||
            paperType == 3
        ) {
            name = 'mmol/L';
        } else if (paperType == 4) {
            name = 'umol/L';
        }
        return name;
    },

    /**
     * 初始化检测成员
     */
    initMeasureMember: function () {
        DataArchive.testMember = [];
        DataArchive.testMember = RenderParam.addedMemberList;
        // 家庭成员最多8个，少于8个均需要有“增加”按钮
        if (DataArchive.testMember.length < 8) {
            DataArchive.testMember.push({'member_name': '增加'});
        }
        // UI页面是3个循环切换，所以不足3个，用“增加”按钮补上
        var len = DataArchive.testMember.length;
        for (var i = 0; i < 3 - len; i++) {
            DataArchive.testMember.push({'member_name': '增加'});
        }
    },

    /**
     * 根据不同检测类型返回对应的检测状态时刻表。类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
     * @param type
     * @returns {Array}
     */
    initStatusMomentList: function (type) {
        DataArchive.testStatus = [];
        switch (Measure.getTypeAsInt(type)) {
            // 血糖的时刻表区别于其他
            case Measure.Type.BLOOD_GLUCOSE:
                if (LMEPG.Func.isObject(RenderParam.momentData) && LMEPG.Func.isArray(RenderParam.momentData.repast)) {
                    for (var i = 0; i < RenderParam.momentData.repast.length; i++) {
                        var item = RenderParam.momentData.repast[i];
                        DataArchive.testStatus.push({
                            type: type,
                            desc: Measure.getTypeText(type),
                            id: item.repast_id,
                            name: item.repast_name
                        });
                    }
                }
                break;
            default:
                if (LMEPG.Func.isObject(RenderParam.momentData) && LMEPG.Func.isArray(RenderParam.momentData.timebuckets)) {
                    for (var i = 0; i < RenderParam.momentData.timebuckets.length; i++) {
                        var item = RenderParam.momentData.timebuckets[i];
                        DataArchive.testStatus.push({
                            type: type,
                            desc: Measure.getTypeText(type),
                            id: item.timebucket_id,
                            name: item.timebucket_name
                        });
                    }
                }
                break;
        }

        return DataArchive.testStatus;
    },

    /**
     * 轮询查询最新的检测记录
     */
    polling: function () {
        LMEPG.ajax.postAPI('Measure/queryLatestMeasureRecord', {}, function (data) {
            console.log(data);
            LMEPG.Log.info("健康检测轮询记录：" + JSON.stringify(data));
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
                    // 在此页面获取到最新的检测数据，刷新当前页面，加载数据
                    var objSrc = null;
                    var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
                    LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                } else {
                    setTimeout(function () {
                        HealthMeasure.polling();
                    }, 6000);
                }
            } else {
                setTimeout(function () {
                    HealthMeasure.polling();
                }, 6000);
            }
        });
    }
};

/**
 * =============================================页面跳转=============================================
 */
var PageJump = {

    /**
     * 获取当前页面对象
     * @param obj
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('healthTestArchivingList');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },

    /**
     * 跳转到视频问诊记录详情
     */
    jumpDoctorRecord: function (btn) {
        var curObj = PageJump.getCurPageObj();
        curObj.setParam('showAskDoctorTab', 1); // 是否显示归档页面的问医记录Tab
        var dstObj = LMEPG.Intent.createIntent('doctorRecordDetail');
        dstObj.setParam('memberID', -1);
        dstObj.setParam('memberName', '无');
        dstObj.setParam('isArchived', 0); // 1-已归档 0-未归档
        dstObj.setParam('initPage', (DataArchive.page - 1) * 5 + (parseInt(btn.id.substr(6)) + 1)); // 跳转到问诊记录的第几页
        LMEPG.Intent.jump(dstObj, curObj);
    },

    /**
     * 跳转健康检测输入页面
     * @param btn
     */
    jumpImeiInputPage: function (btn) {
        var curPage = PageJump.getCurPageObj();
        var dstPage = LMEPG.Intent.createIntent('imeiInput');
        dstPage.setParam('testType', btn.testType); // 检测类型：1-胆固醇 2-尿酸 3-血糖
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 跳转订购页面
     */
    jumpBuyVip: function () {
        var objCurrent = PageJump.getCurPageObj();
        objCurrent.setParam('showAskDoctorTab', 1); // 是否显示归档页面的问医记录Tab
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 跳转添加家庭成员页面
     */
    jumpMemberEditPage: function () {
        var curObj = PageJump.getCurPageObj();
        curObj.setParam("page", DataArchive.page);
        curObj.setParam("focusId", DataArchive.tableBeClickItem);
        var dstObj = LMEPG.Intent.createIntent('familyMembersEdit');
        dstObj.setParam('actionType', 1); // 添加
        curObj.setParam('isAddMember', true);
        LMEPG.Intent.jump(dstObj, curObj);
    }
};
