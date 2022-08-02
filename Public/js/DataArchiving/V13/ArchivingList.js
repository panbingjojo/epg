/**
 * 数据归档js
 */
// 当前服务器时间
var timer = null
var curServerTime = 0;
var scene;
var DataArchive = {
    isFirst:true,
    buttons: [],
    showMFImageCarriers: ['10000051', '10220094', '520094','440004'],
    page: 0,
    isExecute:false,
    maxPage: 0,
    tabType: 1, // 1-当前是健康检测Tab页面 2-当前是问医记录Tab页面
    curClickItemIndex: 0, // 当前点击的列表项的数组下标
    areaName: ["10220095", "620007",'460092', "110052"], // 在此数组中，则不显示“健康检测数据归档”
    timer: 0,
    isShowTestRecord: true, // 是否展示检测记录
    curClassifyData:0,
    dialogMsg: {
        forbiddenAsk: '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。',
        noTimes: '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊'
    },
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('healthTestArchivingList');
        currentPage.setParam('showAskDoctorTab', 1);
        return currentPage;
    },
    init: function () {
        if(RenderParam.focusId){
            DataArchive.isFirst = false
        }

        this.difConfig();
        this.createButtons();
    },
    difConfig: function () {
        if (DataArchive.areaName.indexOf(RenderParam.carrierId) != -1) {
            DataArchive.isShowTestRecord = false;
            G("test-record").parentNode.removeChild(G("test-record"));
            G("test-bloodSugar").parentNode.removeChild(G("test-bloodSugar"));
            // G("member-inspection-record").parentNode.removeChild(G("member-inspection-record"));
            G('ask-doctor-record').style.left = 142 + 'px';
            G('ask-doctor-record').style.top = 124 + 'px';
        }
    },
    setIntervalFun:function(cb){
        if (!DataArchive.isExecute) {
            DataArchive.isExecute = true;
            LMEPG.BM.getButtonById("test-record").nextFocusDown = "test-bloodSugar";

            Network.getNeedClassifyData(function () {
                DataArchive.tabType = 1;
                DataArchive.data = testRecordList;// 检测数据
                console.log(testRecordList);
                if (DataArchive.data && DataArchive.data.length) {
                    DataArchive.thead = ['检测时间', '检测类型', '检测数值'];
                    DataArchive.renderTable('refresh');
                } else {
                    DataArchive.nullTestRecordData();
                }
                // 数据保持和焦点恢复
                if (!LMEPG.Func.isEmpty(RenderParam.focusId)) {
                    LMEPG.BM.requestFocus(RenderParam.focusId);
                }
                // 数据保持完成后，把保持信息清除，因为跳转到另一个tab，数据保持就不需要了
                RenderParam.page = 1;
                RenderParam.focusId = '';
                DataArchive.isExecute = false;
                cb && cb()
                });
            }else{
                LMEPG.BM.getButtonById("test-record").nextFocusDown = "";

            }
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
                        me.data = inquiryRecordList;// 问医数据
                        if (me.data.length) {
                            me.thead = (RenderParam.carrierId==='110052')?['问诊时间', '医生信息', '主诉','问诊时长']:['问医时间', '医生信息', '主诉','问诊时长'];
                            me.renderTable();
                        } else {
                            me.nullAskRecordData();
                        }

                        // 数据保持和焦点恢复
                        if (!LMEPG.Func.isEmpty(RenderParam.focusId)) {
                            LMEPG.BM.requestFocus(RenderParam.focusId);
                            G('ask-doctor-record').style.backgroundImage = 'url("'+g_appRootPath+'/Public/img/hd/DataArchiving/V13/head-tab-s.png")'
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
                    Network.getNeedClassifyData(function () {
                        DataArchive.tabType = 1;
                        me.data = testRecordList;// 检测数据
                        if (me.data && me.data.length) {
                            me.thead = ['检测时间', '检测类型', '检测数值'];
                            me.renderTable('refresh');
                            if(DataArchive.isFirst){
                                LMEPG.BM.requestFocus('focus-0')
                                G('test-record').style.backgroundImage = 'url("'+g_appRootPath +'/Public/img/hd/DataArchiving/V13/head-tab-s.png")'
                                DataArchive.isFirst = false
                            }
                        } else {
                            me.nullTestRecordData();
                            if(DataArchive.isFirst){
                                //LMEPG.BM.requestFocus('test-bloodSugar')
                                DataArchive.isFirst = false
                            }
                        }
                        // 数据保持和焦点恢复
                        if (!LMEPG.Func.isEmpty(RenderParam.focusId)) {
                            LMEPG.BM.requestFocus(RenderParam.focusId);
                            G('test-record').style.backgroundImage = 'url("'+g_appRootPath+'/Public/img/hd/DataArchiving/V13/head-tab-s.png")'
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
                        //HealthMeasure.polling();
                    });
                    break;
            }
        }
    },
    data: [], // 为空则显示检测的三个按钮
    pageData: [],// 当前页面要显示的数据
    /*截取当前页面的数据*/
    getCurrentPageData: function () {
        if(DataArchive.tabType == 2){
            this.pageData = this.data
            return
        }

        this.pageData = this.data.slice((DataArchive.page-1)*5, (DataArchive.page)*5);
    },
    /*渲染记录到表格*/
    thead: (RenderParam.carrierId==='110052'?['问诊时间', '医生信息', '主诉']:['问医时间', '医生信息', '主诉']),
    renderTable: function () {
        this.getCurrentPageData();
        this.initTabFocusDown('focus-0');
        this.recordDataTable(this.thead);
        this.toggleArrow();
    },
    /*对应移动到功能按钮上*/
    initTabFocusDown: function (id) {

        LMEPG.BM.getButtonById('ask-doctor-record').nextFocusDown = id;
        if (DataArchive.areaName.indexOf(RenderParam.carrierId) == -1) {
            LMEPG.BM.getButtonById('test-record').nextFocusDown = id;
        }
    },
    dateFtt:function(fmt){
        if(fmt!=""){
            var array = fmt.split(":");
            if(array.length==3){
                fmt = fmt.substring(0,fmt.lastIndexOf(":"));
            }
        }
        return fmt;
    },
    /*创建表格*/
    recordDataTable: function (thead) {
        var data = this.pageData
        var that = this;
        var speEle=''
        if(thead.length>3){
            speEle='<td>' + thead[3] + '</td>'
        }else {
            //speEle='<td style="line-height: 1"><img id="refresh" src="'+g_appRootPath + '/Public/img/hd/DataArchiving/V13/refresh.png'+'"/></td>'
        }
        var htm = '<table id="table-wrap">';
        htm += '<tr class="thead-txt"><td>' + thead[0] + '</td><td>' + thead[1] + '</td><td>' + thead[2] + '</td>'+speEle+'<td></td></tr>';
        data.forEach(function (t, i) {
            var content1, content2, content3;
            // 检测记录
            if (DataArchive.tabType == 1) {
                var value = 0
                switch (t.deviceTypeName) {
                    case '体脂称':
                        value = t.fatFreeWeight+'KG'
                        break
                    case '血糖':
                        value = t.measureData+'mmol/L'
                        break
                    case '血压计':
                        //mmHG bpm
                        value = '低压:'+t.diastolicPressure + 'mmHG 高压:'+t.systolicPressure+'mmHG 心率:'+t.heartRate+'bpm'
                        break
                }

                htm += '<tr class="tbody-txt"><td class="td-time">' + t.measureDt + '</td>' +
                    '<td class="td-info">' + t.deviceTypeName + '</td>' +
                    '<td  class="td-result" id="value-'+i+'">' + value + '</td>' +
                    '<td class="td-result ">' +
                    '<div class="placeonfile" id="focus-' + i + '" data-cur=' + t.index + ',' + '></div>' +
                    '</td></tr>';

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
                content1 = that.dateFtt(t.create_dt); // 问医时间
                var additionInfo = '';
                if (inquiryRecordList[i].department && inquiryRecordList[i].job_title) {
                    additionInfo = '(' + inquiryRecordList[i].department + '/' + inquiryRecordList[i].job_title + ')';
                }
                content2 = cutTxt(t.doctor_name + additionInfo, 12); // 医生信息（医生姓名）
                content3 = LMEPG.Func.isEmpty(inquiryRecordList[i].disease_desc) ? '无' : cutTxt(inquiryRecordList[i].disease_desc, 10); // 主诉
                var content4 = DataArchive.formatSeconds(t.duration)

                htm += '<tr class="tbody-txt"><td class="td-time">' + content1 + '</td><td class="td-info">' + content2 + '</td><td class="td-info">' + content3 + '</td><td class="td-info">' + content4 + '</td>';

                htm += '<td class="td-result "><div class="placeonfile" id="focus-'+i+'"></div></td></tr>';
            }

        });

        G('record-container').innerHTML = htm;
    },

    formatSeconds:function(value) {
        var result = parseInt(value) || 0
        var h = Math.floor(result / 3600);
        var m = Math.floor((result / 60 % 60));
        var s = Math.floor((result % 60));

        var res = '';
        if(h != 0) res += h+'小时';
        if(m != 0) res += m+'分';
        res += s+'秒';
        return res;
    },
    /*没有检测记录*/
    nullTestRecordData: function () {
        H('prev-arrow');
        H('next-arrow');
        var htm = '<table id="table-wrap">';
        if (isBindDevice) {
            htm += '<table id="table-wrap"><tr><td class="thead-title">还没有检测记录，赶快去测测吧！</td></tr>';
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
        if (RenderParam.carrierId==='110052'){
            htm += '<table id="table-wrap"><tr><td class="thead-title">还没有问诊记录哦！</td></tr>';
        }else {
            htm += '<table id="table-wrap"><tr><td class="thead-title">还没有问医记录哦！</td></tr>';
        }
        if (DataArchive.showMFImageCarriers.indexOf(RenderParam.carrierId) > -1) {
            htm += '<tr><td align="center"><img id="to-ask-doctor"' +
                ' src="' + g_appRootPath + '/Public/img/hd/DataArchiving/V13/to_ask_doctor_mofang.png"' +
                ' alt="去问医"/></td></tr>';
        } else if (RenderParam.carrierId==='110052'){
            htm += '<tr><td align="center"><img id="to-ask-doctor"' +
                ' src="' + g_appRootPath + '/Public/img/hd/DataArchiving/V13/to_ask_doctor_cihai.png"' +
                ' alt="一键问诊"/></td></tr>';
        } else {
            htm += '<tr><td align="center"><img id="to-ask-doctor"' +
                ' src="' + g_appRootPath + '/Public/img/hd/DataArchiving/V13/to_ask_doctor.png"' +
                ' alt="一键问医"/></td></tr>';

        }
        G('record-container').innerHTML = htm;
        this.initTabFocusDown('to-ask-doctor');
        setTimeout(function () {
            G('ask-doctor-record').style.backgroundImage = 'url('+g_appRootPath + '/Public/img/hd/DataArchiving/V13/head-tab-s.png'+')'
        },50)

        LMEPG.BM.requestFocus('to-ask-doctor');

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
            DataArchive.page--;
            DataArchive.renderTable();
            DataArchive.moveToFocus('focus-4');

        } else { // 问医Tab
            Network.getInquiryRecordList(DataArchive.page - 1, function () {
                DataArchive.page--;
                if(inquiryRecordList.length < 3){
                    G("prev-arrow").style.top="310px";
                }else {
                    G("prev-arrow").style.top="253px";
                }
                DataArchive.data = inquiryRecordList;// 问医数据
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
            DataArchive.page++;
            DataArchive.renderTable();
            DataArchive.moveToFocus('focus-0');

        } else { // 问医Tab
            Network.getInquiryRecordList(DataArchive.page + 1, function () {
                DataArchive.page++;
                if(inquiryRecordList.length < 3){
                    G("prev-arrow").style.top="310px";
                }else {
                    G("prev-arrow").style.top="253px";
                }
                DataArchive.data = inquiryRecordList;// 问医数据
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
            DataArchive.curClassifyData = G(btn.id).getAttribute('data-cur');
            HealthMeasure.initMeasureMember();
            HealthMeasure.initStatusMomentList(testRecordList[parseInt(btn.id.substr(6))].extra_data1);
            console.log(DataArchive.testMember);

            if(RenderParam.carrierId =='10220094' ){
                for(var idx = 3- DataArchive.testMember.length;idx >0;idx--){
                    DataArchive.testMember.push({member_name:'增加'});
                }
            }
            // 检测成员
            if(DataArchive.testMember[1]!=undefined){
                G('prev-member').innerHTML = DataArchive.testMember[0].member_name;
            }

            if(DataArchive.testMember[0]!=undefined && DataArchive.testMember[1]!== undefined){
                G('select-member').innerHTML = DataArchive.testMember[1].member_name;
            }else {
                G('select-member').innerHTML = DataArchive.testMember[0].member_name;
            }

            if(DataArchive.testMember[2]!=undefined) {
                G('next-member').innerHTML = DataArchive.testMember[2].member_name;
            }


            S('choice-inner');
            DataArchive.tableBeClickItem = btn.id;
            LMEPG.BM.requestFocus('select-member');
            if (testRecordList[parseInt(DataArchive.curClassifyData)].deviceType !== 1) {
                LMEPG.BM.getButtonById("select-member").nextFocusRight = "btn-submit";
                LMEPG.BM.getButtonById("btn-submit").nextFocusLeft = "select-member";
                LMEPG.BM.getButtonById("btn-delete").nextFocusLeft = "select-member";
                G('prev-status').innerHTML = "";
                G('select-status').innerHTML = "";
                G('next-status').innerHTML = "";
                G('food-title').style.display="none";
                G('food-status').style.display="none";
                G('member-title').style.left="320px";
                G('test-member').style.left="320px";
                G('btn-submit').style.left="600px";
                G('btn-delete').style.left="600px";
            } else {
                // 检测状态
                G('prev-status').innerHTML = DataArchive.testStatus[0].name;
                G('select-status').innerHTML = DataArchive.testStatus[1].name;
                G('next-status').innerHTML = DataArchive.testStatus[2].name;
                G('food-title').style.display="block";
                G('food-status').style.display="block";
                LMEPG.BM.getButtonById("select-member").nextFocusRight = "select-status";
                LMEPG.BM.getButtonById("btn-submit").nextFocusLeft = "select-status";
                LMEPG.BM.getButtonById("btn-delete").nextFocusLeft = "select-status";
                G('member-title').style.left="164px";
                G('test-member').style.left="164px";
                G('btn-submit').style.left="825px";
                G('btn-delete').style.left="825px";
            }
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
            btnEl.className = 'choice';
        }
    },
    testMember: [], // 检测成员
    testStatus: [], // 检测状态
    onBeforeMoveSwitchItem: function (key, btn) {
        var me = DataArchive;
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
    }
    ,
    /*渲染选择检测的成员/状态*/
    renderTestData: function (btn) {
        if (btn) {
            var selectIndex = btn.id.slice(7);
            if (btn.id == 'select-member') {
                if(this.testMember.length==1){
                    G(btn.id).innerHTML = this.testMember[0].member_name;
                }else if(this.testMember.length==2){
                    if(this.testMember[1]!=undefined) {
                        G('prev-' + selectIndex).innerHTML = this.testMember[0].member_name;
                    }
                    if(this.testMember[0]!=undefined) {
                        G(btn.id).innerHTML = this.testMember[1].member_name;
                    }
                }else {
                    if (this.testMember[1] != undefined) {
                        G('prev-' + selectIndex).innerHTML = this.testMember[0].member_name;
                    }
                    if (this.testMember[0] != undefined) {
                        G(btn.id).innerHTML = this.testMember[1].member_name;
                    }
                    if (this.testMember[2] != undefined) {
                        G('next-' + selectIndex).innerHTML = this.testMember[2].member_name;
                    }
                }
            } else if (btn.id == 'select-status') {
                if(this.testStatus.length==1){
                    G(btn.id).innerHTML = this.testStatus[0].name;
                }else if(this.testStatus.length==2){
                    if(this.testStatus[0]!=undefined) {
                        G('prev-' + selectIndex).innerHTML = this.testStatus[0].name;
                    }
                    if(this.testStatus[1]!=undefined) {
                        G(btn.id).innerHTML = this.testStatus[1].name;
                    }
                }else{
                    if(this.testStatus[0]!=undefined) {
                        G('prev-' + selectIndex).innerHTML = this.testStatus[0].name;
                    }
                    if(this.testStatus[1]!=undefined) {
                        G(btn.id).innerHTML = this.testStatus[1].name;
                    }
                    if(this.testStatus[2]!=undefined) {
                        G('next-' + selectIndex).innerHTML = this.testStatus[2].name;
                    }
                }
            }
        }
    },

    btnStatusChange:function(dir, btn){
        if(dir === 'up' || (dir === 'down' && G('focus-0'))){
            setTimeout(function () {
                G(btn.id).style.backgroundImage = 'url('+btn.selectImage+')';
            }, 50)
        }
    },

    statusReset:function(dir, btn){
        if(dir === 'down'){
            G('ask-doctor-record').style.backgroundImage = 'url()';
        }
    },

    autoRefresh:function(btn, hasFocus){
        if(hasFocus && DataArchive.page === 1){
            timer = setTimeout(function () {
               DataArchive.setIntervalFun(function () {
                   LMEPG.BM.requestFocus(btn.id);
               })

            },5000);
        }else {
            clearTimeout(timer);
        }

    },

    createButtons: function () {
        var STATIC_TR = 5;// 固定的5个tr焦点对象
        var isShowMFImage = DataArchive.showMFImageCarriers.indexOf(RenderParam.carrierId) > -1;
        function changeImage(){
            if (isShowMFImage) {
                return g_appRootPath +'/Public/img/hd/DataArchiving/V13/to_ask_doctor_mofang.png';
            }else if(RenderParam.carrierId=='110052') {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/to_ask_doctor_cihai.png';
            }else {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/to_ask_doctor.png';
            }
        }

        function changeFocusImage() {
            if (isShowMFImage){
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/to_ask_doctor_f_mofang.png';
            }else if (RenderParam.carrierId=='110052') {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/to_ask_doctor_f_cihai.png';
            }else {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/to_ask_doctor_f.png';
            }
        }

        function changeInsImage(){
            if (RenderParam.comeFrom === 'doc' && RenderParam.carrierId==='110052') {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/see-doc-record_cihai.png';
            }else if(RenderParam.comeFrom === 'doc') {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/see-doc-record.png';
            }else {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/member_inspection_record.png';
            }
        }

        function changeInsFocus() {
            if (RenderParam.comeFrom === 'doc' && RenderParam.carrierId==='110052') {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/see-doc-record_f_cihai.png';
            }else if(RenderParam.comeFrom === 'doc') {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/see-doc-record-f.png';
            }else {
                return g_appRootPath + '/Public/img/hd/DataArchiving/V13/member_inspection_record_f.png';
            }
        }
        while (STATIC_TR--) {
            this.buttons.push({
                id: 'focus-' + STATIC_TR,
                name: '列表焦点',
                type: 'div',
                nextFocusUp: 'focus-' + (STATIC_TR - 1),
                nextFocusDown: 'focus-' + (STATIC_TR + 1),
                click: this.onClickTable,
                beforeMoveChange: this.onBeforeFocusMoveTable,
                index:STATIC_TR,
                backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/placeonfile.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/hd/DataArchiving/V13/placeonfile_f.png' : g_appRootPath + '/Public/img/hd/DataArchiving/V13/placeonfile_f.png',
                focusChange:this.autoRefresh
            });
        }
        this.buttons.push({
                id: 'doctor-list',
                name: '健康咨询',
                type: 'img',
                nextFocusDown: DataArchive.isShowTestRecord ? 'test-record' : 'ask-doctor-record',
                nextFocusLeft: 'member-inspection-record',
                backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/doctor_list.png',
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/doctor_list_f.png',
                click: PageJump.jumpDoctorPage,
                beforeMoveChange:this.statusReset
            },
            {
                id: 'member-inspection-record',
                name: '查看成员记录',
                type: 'img',
                nextFocusDown: DataArchive.isShowTestRecord ? 'test-record' : 'ask-doctor-record',
                nextFocusLeft: DataArchive.isShowTestRecord ? 'test-bloodSugar' : 'ask-doctor-record',
                nextFocusRight:'doctor-list',
                backgroundImage: changeInsImage(),
                focusImage: changeInsFocus(),
                click: PageJump.jumpMemberInspectionRecordPage,
                beforeMoveChange:this.statusReset

            },
            {
                id: 'ask-doctor-record',
                name: '问医记录',
                type: 'div',
                nextFocusDown:'',
                nextFocusLeft: DataArchive.isShowTestRecord ? 'test-record' : 'ask-doctor-record',
                nextFocusRight: 'member-inspection-record',
                nextFocusUp: DataArchive.isShowTestRecord ? 'test-bloodSugar':'member-inspection-record',
                backgroundImage: ' ',
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/head-tab-f.png',
                selectImage:g_appRootPath + '/Public/img/hd/DataArchiving/V13/head-tab-s.png',
                focusChange: this.showTableRecord,
                beforeMoveChange:this.btnStatusChange

            }, {
                id: 'test-record',
                name: '检测记录',
                type: 'div',
                nextFocusDown: '',
                nextFocusRight: 'ask-doctor-record',
                nextFocusUp: 'test-bloodSugar',
                backgroundImage: ' ',
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/head-tab-f.png',
                selectImage:g_appRootPath + '/Public/img/hd/DataArchiving/V13/head-tab-s.png',
                focusChange: this.showTableRecord,
                beforeMoveChange:this.btnStatusChange
            },{
                id: 'refresh',
                name: '刷新',
                type: 'img',
                nextFocusDown: 'focus-0',
                nextFocusUp: 'test-record',
                backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/refresh.png',
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/refresh-f.png',
                focusChange: this.showTableRecord,
                click:this.setIntervalFun,
            }, {
                id: 'test-bloodSugar',
                name: '无数据-检测血糖',
                type: 'img',
                nextFocusRight: 'member-inspection-record',
                nextFocusDown: 'test-record',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/go_test.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/go_test_f.png',
                click: PageJump.jumpImeiInputPage,
                testType: 3,
                beforeMoveChange:this.statusReset
            }, {
                id: 'test-UA',
                name: '无数据-检测尿酸',
                type: 'img',
                nextFocusUp: 'test-bloodSugar',
                nextFocusDown: 'test-cholesterol',
                backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/test_ua.png',
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/test_ua_f.png',
                click: PageJump.jumpImeiInputPage,
                testType: 2
            }, {
                id: 'test-cholesterol',
                name: '无数据-检测胆固醇',
                type: 'img',
                nextFocusUp: 'test-UA',
                backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/test_cholesterol.png',
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/test_cholesterol_f.png',
                click: PageJump.jumpImeiInputPage,
                testType: 1
            }, {
                id: 'to-ask-doctor',
                name: '无数据-一键问医',
                type: 'img',
                nextFocusUp: 'ask-doctor-record',
                backgroundImage:  changeImage(),
                focusImage: changeFocusImage(),
                click: Network.onKeyInquiry
            }, {
                id: 'btn-submit',
                name: '提交',
                type: 'img',
                nextFocusLeft: 'select-status',
                nextFocusDown: 'btn-delete',
                backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/btn_submit.png',
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/btn_submit_f.png',
                click: Network.classifyData
            }, {
                id: 'btn-delete',
                name: '删除',
                type: 'img',
                nextFocusLeft: 'select-status',
                nextFocusUp: 'btn-submit',
                backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/btn_delete.png',
                focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/btn_delete_f.png',
                click: Network.deleteClassifyData
            }, {
                id: 'select-status',
                name: '选择检测状态',
                type: 'others',
                nextFocusLeft: 'select-member',
                nextFocusRight: 'btn-submit',
                click: '',
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: this.onBeforeMoveSwitchItem
            }, {
                id: 'select-member',
                name: '选择检测成员',
                type: 'others',
                nextFocusRight: 'select-status',
                click: function (){

                    var member_id =0;
                    var members =  DataArchive.testMember;
                    for(var i=0;i<members.length;i++){
                        if(members[i].member_id !=undefined && members[i].member_name==G('select-member').innerHTML){
                            member_id =  members[i].member_id;
                            break
                        }
                    }

                    if(member_id !== 0)
                        return

                    PageJump.jumpMemberEditPage()
                },
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: this.onBeforeMoveSwitchItem
            });

        if (!DataArchive.isShowTestRecord) {
            LMEPG.BM.init('ask-doctor-record', this.buttons, '', true);
        } else if(RenderParam.comeFrom && !RenderParam.focusId){
            LMEPG.BM.init(RenderParam.comeFrom === 'doc' ? 'ask-doctor-record' : 'test-record', this.buttons, '', true);
        } else {
            LMEPG.BM.init(RenderParam.showAskDoctorTab == 1 ? 'ask-doctor-record' : 'test-record', this.buttons, '', true);
        }
    },
    moveToFocus: function (id) {
        LMEPG.BM.requestFocus(id);
    },

    /**
     * 检测当前用户黑名单时处理函数
     * @param focusIdOnHideDialog 提示弹窗消失后回复页面的焦点
     */
    inquiryBlacklistHandler: function (focusIdOnHideDialog) {
        var forbiddenAskTips = '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。';
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: modal.hide
        }, '', forbiddenAskTips, '');
    },

    /**
     * 检测当前用户无问诊次数时处理函数
     * @param focusIdOnHideDialog 提示弹窗消失后回复页面的焦点
     */
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
var testRecordList = [];    // 未归档的检测记录列表
var inquiryRecordList = []; // 未归档的问医记录列表
var hasLoadData = false; // 表示是否页面加载了数据x`
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
            //console.log(data);
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

    getNeedClassifyData:function(callback){
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('NewHealthDevice/getNeedClassifyData', {}, function (data) {
            LMEPG.UI.dismissWaitingDialog()
            if(!data){
                Network.getNeedClassifyData(callback)
                return
            }
            if(data.code === 200){
                console.log(data,9090777)
                var allData = []
                data.data.forEach(function (item) {
                    item.data.forEach(function (i) {
                        i.deviceType = item.deviceType
                        i.deviceTypeName = item.deviceTypeName
                        allData.push(i)
                    })
                })

                allData.sort(function (a,b) {
                    return a.measureDt < b.measureDt?1 : -1
                })

                allData.forEach(function (i,index) {
                    i.index = index
                })

                testRecordList = allData;

                DataArchive.maxPage = Math.ceil(allData.length / 5);

            }else {
                testRecordList = []
            }

            hasLoadData = true;
            callback();

        },function () {
            Network.getNeedClassifyData(callback)
        })
    },

    classifyData:function(){
        LMEPG.UI.showWaitingDialog('');
        var leverData = testRecordList[parseInt(DataArchive.curClassifyData)]

        var member_id =0;
        var members =  DataArchive.testMember;
        for(var i=0;i<members.length;i++){
            if(members[i].member_id !=undefined && members[i].member_name==G('select-member').innerHTML){
                member_id =  members[i].member_id;
                break
            }
        }
        if (member_id==0) {
            LMEPG.UI.showToast('请选择家庭成员！');
            LMEPG.UI.dismissWaitingDialog()
            return;
        }

        leverData.repastId = DataArchive.testStatus[1].id
        leverData.memberId = member_id

        var postData = {
            paperType:leverData.deviceType,
            uuid:leverData.uuid,
            jsonData:JSON.stringify(leverData)
        }

        LMEPG.ajax.postAPI('NewHealthDevice/classifyData', postData, function (data){
            LMEPG.UI.dismissWaitingDialog()
            if(data.code === 200){
                LMEPG.UI.showToast('归档成功');
                var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
                LMEPG.Intent.jump(objDst, null, LMEPG.Intent.INTENT_FLAG_DEFAULT);
            }

        })
    },

    deleteClassifyData:function(btn){//
        modal.commonDialog({beClickBtnId: btn.id, onClick: doDelete}, '', '确定删除该条数据？', '删除后相应的数据将无法恢复哦！');

        function doDelete() {

            LMEPG.UI.showWaitingDialog('');
            LMEPG.ajax.postAPI('NewHealthDevice/deleteClassifyData', {
                uuid:testRecordList[parseInt(DataArchive.curClassifyData)].uuid
            }, function (data){
                if(data.code === 200){
                    LMEPG.UI.dismissWaitingDialog()
                    LMEPG.UI.showToast('删除成功！');
                    var objDst = LMEPG.Intent.createIntent('healthTestArchivingList');
                    LMEPG.Intent.jump(objDst, null, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                }

            })
        }
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
        LMEPG.ajax.postAPI('Doctor/getNotArchivePageRecord', postData, function (recordListData) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                recordListData = recordListData instanceof Object ? recordListData : JSON.parse(recordListData);
                if (recordListData.result === 0 || recordListData.result === '0') {
                    inquiryRecordList = recordListData.list;
                    DataArchive.maxPage = Math.ceil(recordListData.count / 5);
                    hasLoadData = true;
                    callback();
                } else {
                    LMEPG.UI.showToast('获取数据失败:' + data.result);
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
        /*
        if (DataArchive.testMember[1].member_name == '增加') {
            LMEPG.UI.showToast('请选择家庭成员！');
            return;
        }*/
        var member_id =0;
        var members =  DataArchive.testMember;
        for(var i=0;i<members.length;i++){
            if(members[i].member_id !=undefined && members[i].member_name==G('select-member').innerHTML){
                member_id =  members[i].member_id;
                break
            }
        }
        if (member_id==0) {
            LMEPG.UI.showToast('请选择家庭成员！');
            return;
        }
        var latestRepastId = '-1';
        var latestTimebucketId = '-1';
        switch (Measure.getTypeAsInt(testRecordList[DataArchive.curClickItemIndex].extra_data1)) {
            case Measure.Type.BLOOD_GLUCOSE: //血糖：使用repast_id
                latestRepastId = DataArchive.testStatus[1].id;
                break;
            case 5: //血压
                break;
            default: //胆固醇和尿酸等其他：使用timebucket_id
                latestTimebucketId = DataArchive.testStatus[1].id;
                break;
        }
        var postData = {
            //member_id: DataArchive.testMember[1].member_id,
            member_id: member_id,
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
            //console.log(data);
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
                //console.log(data);
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


    /**
     * 一键问医
     */
    onKeyInquiry: function (btnObj) {
        var $routeDocListPageCarriers = ["440004", "10000051", "10220094"]; // 按钮显示【去问诊】的地区集合
        var $isRouteDoctorListPage = $routeDocListPageCarriers.indexOf(RenderParam.carrierId) > -1; // 判断当前地区属于【去问诊】的地区集合
        if ($isRouteDoctorListPage) { // 跳转医生列表页面进行问诊
            PageJump.jumpDoctorListPage(btnObj);
        } else {
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
                    intent: PageJump.getCurPageObj(),                           // 当前模块页面路由标识
                },
                serverInfo: {
                    fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                    cwsHlwyyUrl: RenderParam.CWS_HLWYY_URL,                      // cws互联网医院模块链接地址
                    teletextInquiryUrl: RenderParam.teletextInquiryUrl,          // 微信图文问诊服务器链接地址
                },
                blacklistHandler: DataArchive.inquiryBlacklistHandler,           // 校验用户黑名单时处理函数
                noTimesHandler: DataArchive.noInquiryTimesHandler,               // 检验普通用户无问诊次数处理函数
                doctorOfflineHandler: DataArchive.showDoctorOfflineTips,         // 检验医生离线状态时处理函数
                inquiryEndHandler: DataArchive.inquiryEndHandler,                // 检测医生问诊结束之后，android端回调JS端的回调函数
                inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
            }

            LMEPG.Inquiry.p2p.oneKeyInquiry(inquiryInfo); // 启动一键问诊
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
            case 5:
                strPaperType = '血压';
                break;
            case 6:
                strPaperType = '体脂';
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
        } else if (paperType == 5) {
            name = '';
        }
        return name;
    },
    sortNum:function(a,b) {
        return b.member_id-a.member_id;
    }
    ,

    /**
     * 初始化检测成员
     */
    initMeasureMember: function () {
        DataArchive.testMember = [];
        DataArchive.testMember = [].concat(RenderParam.addedMemberList).sort(this.sortNum);
        // 家庭成员最多5个，少于5个均需要有“增加”按钮
        if (DataArchive.testMember.length < 5) {
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
            //console.log(data);
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
        objCurrent.setParam('comeFrom',RenderParam.comeFrom)
        return objCurrent;
    },

    /**
     * 跳转到视频问诊记录详情
     */
    jumpDoctorRecord: function (btn) {

        var curObj = PageJump.getCurPageObj();
        curObj.setParam('showAskDoctorTab', 1); // 是否显示归档页面的问医记录Tab
        curObj.setParam('comeFrom', RenderParam.comeFrom);

        var dstObj = LMEPG.Intent.createIntent('doctorRecordDetail');
        dstObj.setParam('memberID', -1);
        dstObj.setParam('memberName', '无');
        dstObj.setParam('isArchived', 0); // 1-已归档 0-未归档
        dstObj.setParam('initPage', (DataArchive.page - 1) * 5 + (parseInt(btn.id.substr(6)) + 1)); // 跳转到问诊记录的第几页

        dstObj.setParam('showAskDoctorTab', 1); // 是否显示归档页面的问医记录Tab
        dstObj.setParam('comeFrom', RenderParam.comeFrom);
        //LMEPG.Intent.jump(dstObj);

        LMEPG.Intent.jump(dstObj, curObj);

    },

    /**
     * 跳转健康检测输入页面
     * @param btn
     */
    jumpImeiInputPage: function (btn) {
        var curPage = PageJump.getCurPageObj();
        var dstPage = LMEPG.Intent.createIntent('testIndex');
        // dstPage.setParam('testType', btn.testType); // 检测类型：1-胆固醇 2-尿酸 3-血糖
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 跳转医生列表页面
     */
    jumpDoctorPage: function (btn) {
        var curPage = LMEPG.Intent.createIntent('healthTestArchivingList');
        curPage.setParam('focusId', btn.id);
        var dstPage = LMEPG.Intent.createIntent('doctorIndex');
        LMEPG.Intent.jump(dstPage, curPage);
    },

    jumpMemberInspectionRecordPage:function (btn) {
        var curPage = LMEPG.Intent.createIntent('healthTestArchivingList');
        curPage.setParam('comeFrom',RenderParam.comeFrom);
        curPage.setParam('focusId', btn.id);

        var dstPage = LMEPG.Intent.createIntent('familyEdit');
        dstPage.setParam('comeFrom',RenderParam.comeFrom);
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 跳转医生列表页面
     */
    jumpDoctorListPage: function (btnObj) {
        var curPage = LMEPG.Intent.createIntent('healthTestArchivingList');
        curPage.setParam('showAskDoctorTab', 1);
        curPage.setParam('focusId', btnObj.id);
        curPage.setParam("page", DataArchive.page);
        var dstPage = LMEPG.Intent.createIntent('doctorIndex');
        dstPage.setParam('userId', RenderParam.userId);
        dstPage.setParam('s_demo_id', "demo");
        dstPage.setParam('tabId', "tab-4");
        dstPage.setParam('isBack', 1);
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
     * 视频问诊主页
     */
    jumpVideoVisitHome: function () {

        var objCurrent = Page.getCurrentPage();

        var objDoctorP2P = LMEPG.Intent.createIntent('doctorIndex');
        objDoctorP2P.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objDoctorP2P, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
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
