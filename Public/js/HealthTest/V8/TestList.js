/**
 * 数据归档js
 */
var isFirstEnter = true; // 第一次进入加载数据

var typeAccept = [];

var timer = null
var uData = JSON.parse(RenderParam.unusualItems.replace(/(&quot;)/g, "\""));
console.log(uData,'---')

var TestRecord = {
    buttons: [],
    hideReportBtnCarriers: ['10000051', '10220094', '520094'],
    page: RenderParam.page,
    maxPage: 0,
    keepFocusId: RenderParam.focusId || '', // 当前选中的tab
    canUplaod: false,//是否开通上传天翼云
    pageNum: 5,//每页条数,
    nowTab: RenderParam.keepFocusId ? RenderParam.keepFocusId : 'tab-0',
    testIdNum: RenderParam.keepFocusId ? parseInt(RenderParam.keepFocusId.slice(-1)) : 0,
    inTab:true,
    countDown:30,
    dataKey:'',

    init: function () {
        var that = this

        Network.getUserTestData('1',function (data) {
            Network.getReadeStatus(function () {
                typeAccept = data.items;
                that.testId = typeAccept[TestRecord.testIdNum].id;
                that.dataKey = typeAccept[TestRecord.testIdNum].englishName;
                H('table-wrap');
                H('write-data');
                H('scroll-wrap');
                if (RenderParam.carrierId == '650092') {
                    that.canUplaod = true;
                    G('report_bat').style.display = 'block';
                    G('notice_text').style.display = 'block';
                    G('go-test').style.left = '575px'
                }
                G('title').innerHTML = RenderParam.member_name+'的检测记录'
                that.renderTab()
                that.createButtons();

                if(RenderParam.focusIndex){
                    that.testId = typeAccept[RenderParam.focusIndex.substr(4)].id
                    that.dataKey = typeAccept[RenderParam.focusIndex.substr(4)].englishName
                    G('tab-line').style.display = 'block'
                    G('tab-line').style.left=  parseInt( RenderParam.focusIndex.substr(4))*195 + 12 +'px'
                    if(RenderParam.focusId === 'report_bat'){
                        G('tab-line').style.display = 'none'
                    }
                    that.nowTab = RenderParam.focusIndex
                }
                that.getData(that.testId);
                TestRecord.shouldOpenPop()
            })

        })
    },

    shouldOpenPop:function(){
        var nowTime = new Date().getTime()
        var interval = null
        if(uData.closeTime){
            interval = nowTime - new Date(uData.closeTime).getTime() >=  172800000 //120000
        }

        if (uData.abnormalTypes && uData.abnormalTypes.length > 0 && (interval === null || interval)) {
            TestRecord.openTipPop()
        }

    },

    getData: function (id) {
        console.log(id,TestRecord.dataKey,'-------id')
        var _this = TestRecord;
        Network.getUserTestData(id, function (data) {
            _this.data = data[TestRecord.dataKey] || [];

            _this.maxPage = Math.ceil(_this.data.length / 5);
            _this.renderTable(id);
            _this.renderPage()
            Network.toUpdateReadStatue(id)

            var tempBtn = []
            for(var i=0; i<_this.maxPage; i++){
                tempBtn.push({
                    id: 'page-' + i,
                    name: '页码',
                    type: 'div',
                    nextFocusUp: '',
                    nextFocusDown: 'write-data',
                    nextFocusRight: 'page-' + (i+1),
                    nextFocusLeft: 'page-' + (i-1),
                    click: '',
                    focusChange: TestRecord.changePage,
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/page-num-bg.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/page-num-bg-f.png',
                    beforeMoveChange: TestRecord.leavePage,
                    page:i
                });
            }

            LMEPG.BM.addButtons(tempBtn)

            if(TestRecord.keepFocusId){
                if( _this.data.length!==0){
                    LMEPG.BM.requestFocus(TestRecord.keepFocusId ==='go-test'?'delete-0':TestRecord.keepFocusId)
                }else {
                    LMEPG.BM.requestFocus(G(TestRecord.keepFocusId)?TestRecord.keepFocusId:TestRecord.nowTab)
                }
                TestRecord.keepFocusId = ''
            }else if( _this.data.length!==0 && !TestRecord.inTab){
                LMEPG.BM.requestFocus('delete-0')
            }else {
                LMEPG.BM.requestFocus(TestRecord.nowTab)
                TestRecord.inTab = true
                G('tab-line').style.display = 'none'
            }

            // 空数据
            S('table-wrap');
            G('null-data-000051').style.display = 'none';
            G('null-data-000051').innerHTML = '';
            if ( _this.data.length == 0) {
                H('table-wrap');
                H('write-data');
                H('scroll-wrap');
                G('null-data-000051').style.display = 'block';
                G('null-data-000051').innerHTML = '暂无检测记录';
            }else {
                S('table-wrap');
                S('write-data');
                S('scroll-wrap');
            }
        });
    },

    changePage: function (btn, has) {
        if (has) {
            TestRecord.changeDown(btn.page)
        }
    },

    openTipPop:function(){
        G('tip-pop').style.display = 'block'
        var obj = TestRecord.getUnusualItems(uData.abnormalTypes)
        G('has-num').innerHTML = obj.num
        G('has-item').innerHTML = obj.str

        LMEPG.BM.requestFocus('ask_fast')

        timer = setInterval(function () {
            TestRecord.countDown--
            G('count-down-num').innerHTML = TestRecord.countDown
            if( TestRecord.countDown === 0){
                clearInterval(timer)
                G('tip-pop').style.display = 'none'
                Network.closeReadeTip()
            }
        },1000)
    },

    getUnusualItems:function(i){
        var str = ''
        var num = 0
        i.forEach(function (item) {
            str+=item.itemName+','
            num+=item.count
        })
        return {
            str:str,
            num:num
        }
    },

    leavePage:function(dir){
        if(dir === 'up'){
            setTimeout(function () {
                LMEPG.BM.requestFocus((TestRecord.testId === 6?'detail-':'delete-') + (TestRecord.currentData.length -1))
            },50)
        }
    },
    renderPage:function(){
        var html = ''
        for(var i=0;i<this.maxPage;i++){
            html+='<div class="page-num" id="page-'+i+'">'+(i+1)+'</div>'
        }
        G('page').innerHTML = html
    },

    renderTab:function(){
        var html = ''
        typeAccept.forEach(function (item,index) {
            html+='<div class="tab-name"  id="tab-'+index+'">'+item.healthDataItem+'</div>'
            var canShow = ''
            var tempArr= []

            uData.unreads && uData.unreads.forEach(function (item) {
                for(var key in item){
                    tempArr.push(parseInt(key))
                }
            })

            canShow = tempArr.indexOf(item.id)>=0?'block':'none'

            html+='<img src='+g_appRootPath+'/Public/img/hd/HealthTest/V13/icon-small.png style="position: absolute;' +
                '    width: 10px;' +
                '    left: '+(index*190+19)+'px;' +
                '    top: 15px; display:'+canShow+'" id="img-'+item.id+'" >'

            TestRecord.buttons.push({
                id: 'tab-' + index,
                name: 'tab',
                type: 'div',
                nextFocusUp: 'ask_fast',
                nextFocusRight: 'tab-' + (index+1),
                nextFocusLeft: 'tab-' + (index-1),
                click: '',
                focusChange: '',
                backgroundImage: ' ',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/tab-choose.png',
                beforeMoveChange: TestRecord.tabLeave,
                moveChange:TestRecord.tabMove,
                testId:item.id
            })
        })
        html+='<div class="tab-line" id="tab-line" style="display: none"></div>'

        G('type-tab').innerHTML = html
    },
    tabLeave:function(dir,btn){
        if(dir === 'down' && TestRecord.data.length > 0){
            TestRecord.nowTab = btn.id
            G('tab-line').style.display = 'block'
            G('tab-line').style.left=  parseInt( btn.id.substr(4))*195 + 12 +'px'
            TestRecord.inTab = false
            LMEPG.BM.requestFocus(btn.testId === 6 ? 'detail-0' : 'delete-0')
            return false
        }
    },

    tabMove:function(pre,btn,dir){
        if (dir === 'left' || dir === 'right') {
            if((dir === 'right' && pre.id === ('tab-'+(typeAccept.length-1)))|| (dir === 'left' && pre.id === 'tab-0'))
                return

            TestRecord.nowTab = 'tab-' + btn.id.substr(4)
            TestRecord.dataKey = typeAccept[btn.id.substr(4)].englishName
            TestRecord.testId = btn.testId
            TestRecord.page = 0
            TestRecord.getData(btn.testId);

            G('img-'+pre.testId).style.display = 'none'
        }
    },

    data: [],
    /*渲染记录到表格*/
    renderTable: function (id) {
        if (id === 1) {
            this.createBloodListUI()
        } else if(id === 4){
            this.createWeightListUI()
        } else {
            this.recordDataTable(); //
        }
        this.getDistance(); // 得到当前的距离
    },
    /*创建表格*/
    currentData: [],
    // 创建列表UI
    createBloodListUI: function () {
        var Ns = this.page; // 起始位置
        this.currentData = this.data.slice(Ns*TestRecord.pageNum, (Ns+1) * TestRecord.pageNum);
        if(this.currentData.length === 0 && this.page!==0){
            this.page--
            this.currentData = this.data.slice(this.page*TestRecord.pageNum, (this.page+1) * TestRecord.pageNum);
        }
        var htmlStr = "";
        htmlStr += '<table  id="table" style="font-size: 25px;">';
        htmlStr += '<tr>';
        htmlStr += '  <td style="text-align: center;">检测时间</td><td style="text-align: center;">收缩压</td>' +
            '<td style="text-align: center;">舒张压</td><td style="text-align: center;">心率</td><td style="text-align: center;">结果</td>';
        htmlStr += '</tr>';
        for (var i = 0; i < this.currentData.length; i++) {
            var data = this.currentData[i];
            if (!LMEPG.Func.isObject(data)) {
                continue;
            }
            var measureDT = data.measureDt;

            var highPressureValue = data.systolicPressure + data.dataUnit;
            var lowPressureValue = data.diastolicPressure + data.dataUnit;
            var heartRate = (data.heartRate || 0) + "bpm";
            var hasRead = data.readStatus

            var trClassName = TestRecord.getLeverClass(data.describe)

            htmlStr += "<tr>";
            htmlStr += '  <td style="text-align: center;"><img src="'+g_appRootPath+'/Public/img/hd/HealthTest/V13/icon-small.png" class="read-circle" style="display:'+(hasRead?"none":"block")+'">' + measureDT + '</td>';
            htmlStr += '  <td style="text-align: center;">' + highPressureValue + '</td>';
            htmlStr += '  <td style="text-align: center;">' + lowPressureValue + '</td>';
            htmlStr += '  <td style="text-align: center;">' + heartRate + '</td>';
            htmlStr += '  <td style=" text-align: center;" class="'+trClassName+'">' + data.describe + '</td>';
            var reportImage = data.synData == 1 ? '/Public/img/hd/HealthTest/V13/reported_n.png' : '/Public/img/hd/HealthTest/V13/reportRecord.png';
            if (!TestRecord.canUplaod) {
                htmlStr += '  <td class="test-delete" style="width: 71px">' +
                    '<img id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.dataUuid + '" data-lever="'+ data.describe+'" alt="">';
            } else {
                htmlStr += '  <td class="test-delete" style="width: 71px">' +
                    '<img id="report-' + i + '" src="' + g_appRootPath + reportImage + '" data-source="'+data.source+'" measureId="' + data.dataUuid + '" data-date="' + measureDT + '" data-high="' + highPressureValue + '" data-low="' + lowPressureValue + '" data-rate="' + heartRate + '" data-level="' + data.describe + '" data-flag="' + data.synData + '"  alt="">' +
                    '<img id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.dataUuid + '" data-lever="'+ data.describe+'" alt="">';
            }
            htmlStr += '</tr>';
        }

        // htmlStr += '</table>';

        G('table-wrap').innerHTML = htmlStr;
        this.isOverflowWrap();
    },

    createWeightListUI: function () {
        var Ns = this.page; // 起始位置
        this.currentData = this.data.slice(Ns*TestRecord.pageNum, (Ns+1) * TestRecord.pageNum);
        if(this.currentData.length === 0 && this.page!==0){
            this.page--
            this.currentData = this.data.slice(this.page*TestRecord.pageNum, (this.page+1) * TestRecord.pageNum);
        }
        var htmlStr = "";
        htmlStr += '<table  id="table" style="font-size: 25px;">';
        htmlStr += '<tr>';
        htmlStr += '  <td style="text-align: center;width: 304px">检测时间</td><td style="text-align: center;width: 204px">体重</td>' +
            '<td style="text-align: center;width: 324px">体脂率</td><td style="text-align: left;"></td>';
        htmlStr += '</tr>';
        for (var i = 0; i < this.currentData.length; i++) {
            var data = this.currentData[i];

            var measureDT = data.measureDt;
            var bodyFat = data.fatFreeWeight + data.dataUnit;
            var hasRead = data.readStatus


            var reportImage = data.synData == "1" ? '/Public/img/hd/HealthTest/V13/reported_n.png' : g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord.png';
            if (TestRecord.canUplaod) {
                htmlStr += '<tr><td  colspan="3" style="height: 50px;"><ul id="detail-' + i + '" class="detail-2" data-id="'+data.dataUuid+'" data-age="' + uData.member_age + '" data-time="' + measureDT + '" data-sex="' + uData.member_gender + '" data-weight="' + data.fatFreeWeight + '" data-resistance="' + data.resistance + '" data-height="'+uData.member_height+'"><li><img src="'+g_appRootPath+'/Public/img/hd/HealthTest/V13/icon-small.png" class="read-circle" style="display:'+(hasRead?"none":"block")+'">' + measureDT + '</li>';
                htmlStr += '<li style="width: 230px;">' + bodyFat + '</li>';

                htmlStr += '<li >体脂率详情>></li></ul></td>';

                htmlStr += '<td  class="test-delete-2" style="min-width: 31px;height: 50px;">' +
                    '<img style="margin-top: 15px" id="report-' + i + '" data-source="'+data.source+'" src="' + g_appRootPath + reportImage + '" measureId="' + data.dataUuid + '" data-time="' + measureDT + '" data-age="'+uData.member_age+'" data-sex="'+uData.member_gender+'" data-fat="' + bodyFat + '" data-weight="' + data.fatFreeWeight + '" data-resistance="' + data.resistance + '" data-flag="' + data.synData + '" data-height="'+uData.member_height+'" alt="">' +
                    '<img style="margin-top: 15px" id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.dataUuid + '" alt="">';
                htmlStr += '</tr>';
            } else {
                htmlStr += '<tr><td  colspan="3" style="height: 50px;"><ul id="detail-' + i + '" class="detail-2" data-id="'+data.dataUuid+'" data-age="' + uData.member_age + '" data-time="' + measureDT + '" data-sex="' + uData.member_gender + '" data-weight="' + data.fatFreeWeight + '" data-resistance="' + data.resistance + '" data-height="'+uData.member_height+'"><li ><img src="'+g_appRootPath+'/Public/img/hd/HealthTest/V13/icon-small.png" class="read-circle" style="display:'+(hasRead ==='0'?"block":"none")+'">' + measureDT + '</li>';
                htmlStr += '<li style="width: 230px;">' + bodyFat + '</li>';

                htmlStr += '<li>体脂率详情>></li></ul></td>';

                htmlStr += '<td class="test-delete-2" style="min-width: 31px;height: 50px;">' +
                    '<img style="margin-top: 15px" id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + data.dataUuid + '" alt="">';
                htmlStr += '</tr>';
            }
        }

        G('table-wrap').innerHTML = htmlStr;
        this.isOverflowWrap();
    },

    recordDataTable: function () {
        var Ns = this.page; // 起始位置
        this.currentData = this.data.slice(Ns*TestRecord.pageNum, (Ns+1) * TestRecord.pageNum);
        console.log(this.currentData,'--------')
        if(this.currentData.length === 0 && this.page!==0){
            this.page--
            this.currentData = this.data.slice(this.page*TestRecord.pageNum, (this.page+1) * TestRecord.pageNum);
        }
        var htm = '<table id="table">';
        htm += '<tr><td  class="test-time">检测时间</td><td style="display:'+(this.currentData[0] && this.currentData[0].repastId?'revert':'none')+'">检测状态</td><td>检测数值</td><td>检测结果</td><td></td></tr>';
        this.currentData.forEach(function (t, i) {

            var measureDate = t.measureDt;
            var measureStatus = HealthTest.getMoment(t.repastId);
            var measureData = t[TestRecord.dataKey]+t.dataUnit

            var trClassName = TestRecord.getLeverClass(t.describe)
            var reportImage = t.synData == 1 ? '/Public/img/hd/HealthTest/V13/reported_n.png' : '/Public/img/hd/HealthTest/V13/reportRecord.png';

            if (!TestRecord.canUplaod) {
                htm += '<tr id=focus-' + i + '>' +
                    '<td class="test-time"><img src="'+g_appRootPath+'/Public/img/hd/HealthTest/V13/icon-small.png" class="read-circle" style="display:'+(t.readStatus ?"none":"block")+'">' + measureDate +
                    '<td class="test-status" style="display: '+(t.repastId?"revert":"none")+'">' + measureStatus +
                    '<td class="test-number">' + measureData +
                    '<td class="test-result '+trClassName+'">' + t.describe +
                    '<td class="test-delete">' +
                    '<img id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + t.dataUuid + '" data-lever="'+ t.describe+'" alt="">' +
                    '</tr>';
            } else {
                htm += '<tr id=focus-' + i + '>' +
                    '<td class="test-time"><img src="'+g_appRootPath+'/Public/img/hd/HealthTest/V13/icon-small.png" class="read-circle" style="display: '+(t.readStatus ?"none":"block")+'">' + measureDate +
                    '<td class="test-status" style="display: '+(t.repastId?"revert":"none")+'">' + measureStatus +
                    '<td class="test-number">' + measureData +
                    '<td class="test-result '+trClassName+' ">' + t.describe +
                    '<td class="test-delete">' +
                    '<img id="report-' + i + '" src="' + g_appRootPath + reportImage + '" data-source="'+t.source+'" measureId="' + t.dataUuid + '" data-date="' + measureDate + '" data-status="' + measureStatus + '" data-number="' + measureData + '" data-level="' + t.describe + '" data-state="' + t.repastId + '" data-flag="' + t.synData + '" alt="" style="margin-right: 30px;">' +
                    '<img id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + t.dataUuid + '" data-lever="'+ t.describe+'" alt="">' +
                    '</tr>';
            }
        });
        G('table-wrap').innerHTML = htm;
        this.isOverflowWrap();
    },

    getLeverClass:function(str){
        switch (str) {
            case '低':
                return 'low'
            case '正常':
                return  'normal'
            case '偏高':
                return 'higher'
            case '高':
                return 'highest'
            default:
                return 'other'

        }
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
        var scrollBtnObj = LMEPG.BM.getButtonById('delete-0');
        var scrollBtnReport = LMEPG.BM.getButtonById('report-0');
        var scrollBtnDetail = LMEPG.BM.getButtonById('detail-0');

        initUpFocus();

        if (key === 'down' && (btn.id.indexOf('delete') >= 0
            || btn.id.indexOf('report') >=0 || btn.id.indexOf('detail') >=0) ) {
            if(!G(btn.nextFocusDown)){
                setTimeout(function () {
                    LMEPG.BM.requestFocus('page-'+_this.page)
                },50)
            }
        }

        switch (true) {
            case key == 'left' || key == 'right':
                return;
            case key == 'up' :
                if(btn.id==='delete-0' || btn.id==='report-0' || btn.id === 'detail-0'){
                    G('tab-line').style.display = 'none'
                    TestRecord.inTab = true
                }

                scrollBtnObj.nextFocusUp = TestRecord.nowTab;
                scrollBtnReport?scrollBtnReport.nextFocusUp = TestRecord.nowTab:'';
                scrollBtnDetail?scrollBtnDetail.nextFocusUp = TestRecord.nowTab:'';
                break;
            case key == 'down' && (btn.id == 'delete-' + (_this.pageNum - 1)
                || btn.id == 'report-' + (_this.pageNum - 1) ||  btn.id == 'detail-' + (_this.pageNum - 1)):
                setTimeout(function () {
                    LMEPG.BM.requestFocus('page-'+(Math.ceil(_this.pageNum/5)-1))
                },50)
                return false;
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

        function changeUp() {
            if (_this.page == 0) {
                return;
            }
            _this.page--;
            if (TestRecord.testId === 1) {
                _this.createBloodListUI()
            } else if( TestRecord.testId  === 4){
                _this.createWeightListUI()
            }else {
                _this.recordDataTable();
            }
            _this.moveToFocus(btn.id);
        }

    },

    changeDown: function (page) {
        TestRecord.page = page;
        if (TestRecord.testId === 1) {
            TestRecord.createBloodListUI()
        } else if (TestRecord.testId === 4) {
            TestRecord.createWeightListUI()
        } else {
            TestRecord.recordDataTable();
        }
    },

    moveToFocus: function (id) {
        LMEPG.BM.requestFocus(id);
    },

    headBtnMove:function(dir){
        if(dir === 'down'){
            LMEPG.BM.requestFocus(G('tip-pop').style.display === 'block'?'icon-close':TestRecord.nowTab)
            return false
        }
    },

    createButtons: function () {

        this.buttons.push({
            id: 'report_bat',
            name: '一键上传至云盘',
            type: 'img',
            nextFocusRight: 'ask_fast',
            nextFocusLeft:'go-test',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord_bat.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord_bat_f.png',
            click: PageJump.jumpReportDataBat,
            beforeMoveChange:this.headBtnMove
        }, {
            id: 'ask_fast',
            name: '一键问医',
            type: 'img',
            nextFocusLeft: this.canUplaod ? 'report_bat' : 'go-test',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/ask_fast.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/ask_fast_f.png',
            click: TestRecord.onClickOneKeyInquiry,
            beforeMoveChange:this.headBtnMove
        }, {
            id: 'icon-close',
            name: '关闭弹窗',
            type: 'img',
            nextFocusUp: 'ask_fast',
            nextFocusDown: 'tab-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/icon-tip-close.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/icon-tip-close-f.png',
            click: function () {
                clearInterval(timer)
                G('tip-pop').style.display = 'none'
                LMEPG.BM.requestFocus(TestRecord.nowTab)
                Network.closeReadeTip()
            },
            beforeMoveChange:this.headBtnMove
        },{
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
            nextFocusRight:this.canUplaod ? 'report_bat' : 'ask_fast',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/go_test.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/go_test_f.png',
            click: PageJump.jumpTest,
            beforeMoveChange: function (dir) {
                if(dir === 'down'){
                    setTimeout(function () {
                        LMEPG.BM.requestFocus(TestRecord.nowTab)
                        G('tab-line').style.display = 'none'
                        TestRecord.inTab = true
                    },50)
                }
            },
            cName: "testIndex",
        });
        var count = TestRecord.pageNum;
        console.log(count)
        while (count--) {
            this.buttons.push({
                id: 'delete-' + count,
                name: '列表删除焦点',
                type: 'img',
                nextFocusUp: count == 0 ? 'ask_fast' : 'delete-' + (count - 1),
                nextFocusDown: 'delete-' + (count + 1),
                nextFocusRight: '',
                nextFocusLeft: TestRecord.canUplaod?'report-' + count:'detail-'+count,
                click: Network.deleteRecord,
                focusChange: this.onFocusChange,
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord_f.png',
                beforeMoveChange: this.onBeforeMoveChangeScrollDistance,
                deleteType:'1'
            });

            this.buttons.push({
                id: 'detail-' + count,
                name: '详情',
                type: 'div',
                nextFocusUp: count == 0 ? '' : 'detail-' + (count - 1),
                nextFocusDown: 'detail-' + (count + 1),
                nextFocusRight: TestRecord.canUplaod? 'report-' + count : 'delete-' + count,
                nextFocusLeft: '',
                click: PageJump.jumpRecordDetail,
                focusChange: this.onFocusChange,
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/all_btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/all_btn_f.png',
                beforeMoveChange: this.onBeforeMoveChangeScrollDistance
            });

            if (TestRecord.canUplaod) {
                this.buttons.push({
                    id: 'report-' + count,
                    name: '列表上报数据焦点',
                    type: 'img',
                    nextFocusUp: count == 0 ? 'tab-0' : 'report-' + (count - 1),
                    nextFocusDown: 'report-' + (count + 1),
                    nextFocusRight: 'delete-' + count,
                    nextFocusLeft: 'detail-' + count,
                    click: PageJump.jumpReportData,
                    focusChange: this.onReportDataFocus,
                    backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/reportRecord_f.png',
                    beforeMoveChange: this.onBeforeMoveChangeScrollDistance
                });
            }
        }

        this.buttons.push({
            id: 'write-data',
            name: '全部删除',
            type: 'img',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/all_delete.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/all_delete_f.png',
            click: Network.deleteRecord,
            beforeMoveChange:function (dir) {
                if(dir === 'up'){
                    LMEPG.BM.requestFocus('page-'+TestRecord.page)
                }
            },
            deleteType:'0'
        });

        LMEPG.BM.init('', this.buttons, '', true);
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
                cwsHlwyyUrl: RenderParam.cwsInquirySeverUrl,                 // cws互联网医院模块链接地址
                teletextInquiryUrl: RenderParam.teletextInquiryServerUrl,    // 微信图文问诊服务器链接地址
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
    /**
     * 获取时段和就餐状态
     */
    getMoment: function (id) {
        var momentStr = '';
        if (RenderParam.momentData != null) {
            var repast_id = id;
            var timebucket_id = -1;
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
                console.log(TestRecord.keepFocusId)
                callback();
            } else {
                LMEPG.UI.showToast('数据获取失败！');
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
                TestRecord.getData(TestRecord.testId);
            } else {
                LMEPG.UI.showToast('删除失败！');
            }
        });
    },
    /**
     * 删除所有已归档数据
     * @param measureId
     */
    deleteAllRecord: function (btn) {
        LMEPG.UI.showWaitingDialog('');
        var deviceType = TestRecord.testId
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
                TestRecord.getData(TestRecord.testId);
            } else {
                LMEPG.UI.showToast('删除失败！');
            }
        });
    },

    updateReadStatus:function (id) {
        LMEPG.ajax.postAPI('Measure/updateReadStatus',{
            'memberId':RenderParam.member_id,
            'type':'2',
            'paperType':id
        },function (data) {
            if(data.result!==0){
                LMEPG.UI.showToast('数据状态改变出错');
            }
            console.log(data)
        })
    },

    saveData: function (key, value,success) {
        var params = {
            postData: {
                "key": key,
                "value": value
            },
            path: 'Common/saveData'
        };

        LMEPG.ajax.postAPI(params.path, params.postData,function (res) {
            console.log(res)
        })
    },
    getData: function (key,success) {
        var params = {
            postData: {
                "key": key,
            },
            path: 'Common/queryData'
        };

        LMEPG.ajax.postAPI(params.path, params.postData,function (res) {
            success(res.result === 0? res.val:0)
        })
    },
    //------ new 接口
    getUserTestData:function (itemId,cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('NewHealthDevice/getUserTestData', {
            memberId:uData.member_id,
            itemId:itemId
        },function (res) {
            LMEPG.UI.dismissWaitingDialog()
            if(res.code === 200){
                console.log(res,9090)
                cb(res)
            }else {
                LMEPG.UI.showToast('获取列表错误')
            }
        })
    },

    closeReadeTip:function () {
        LMEPG.ajax.postAPI('NewHealthDevice/closeReadeTestTip', {
            memberId:uData.member_id,
        },function (res) {
            console.log(res,9090)
        })
    },

    toUpdateReadStatue:function (itemId) {
        LMEPG.ajax.postAPI('NewHealthDevice/updateReadeTestStatus', {
            memberId:uData.member_id,
            itemId:itemId,
        },function (res) {
            console.log(res,9080)
        })
    },

    deleteRecord:function (btn) {
        LMEPG.UI.showWaitingDialog('');
        var deleteList = []
        var count = 0
        if(btn.deleteType === '1'){
            var measureId = G(btn.id).getAttribute('measureId');
            var lever = G(btn.id).getAttribute('data-lever');
            if(lever && lever !== '正常'){
                count+=1
            }
            deleteList.push(measureId)
        }else {
            TestRecord.data.forEach(function (item) {
                if(item.describe && item.describe !== '正常'){
                    count+=1
                }
                deleteList.push(item.dataUuid)
            })
        }

        LMEPG.ajax.postAPI('NewHealthDevice/deleteTestRecord', {
            memberId:uData.member_id,
            paperType:TestRecord.testId,
            dataUuid:JSON.stringify(deleteList),
            abnormalCount:count
        },function (res) {
            LMEPG.UI.dismissWaitingDialog()
            if(res.code === 200){
                TestRecord.getData(TestRecord.testId);
            }
        })
    },

    getReadeStatus:function(cb){
        LMEPG.ajax.postAPI('NewHealthDevice/getUserReadeTestStatus', {}, function (res) {
            if(res.code===200){
                if(res.data) {
                    var data = JSON.parse(res.data)
                    var nowData = {}
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].memberId === parseInt(uData.member_id)) {
                            nowData = data[i]
                            break
                        }
                    }
                    for (var key in nowData) {
                        if (nowData.hasOwnProperty(key)) {
                            uData[key] = nowData[key]
                        }
                    }
                }
                cb()
            }
        })
    },
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
        var objCurrent = LMEPG.Intent.createIntent('testList');
        objCurrent.setParam('testType',TestRecord.testId);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_gender', RenderParam.member_gender);
        objCurrent.setParam('focusIndex', TestRecord.nowTab);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton() ? LMEPG.BM.getCurrentButton().id : '');
        objCurrent.setParam('page', TestRecord.page);
        objCurrent.setParam('unusualItems', JSON.stringify(uData))
        return objCurrent;
    },

    /** 问诊时没有问诊次数跳转计费 */
    jumpBuyVip: function () {
        // --------上报局方使用模块数据 start--------
        if(RenderParam.carrierId === "10000051") {
            var clickTime = new Date().getTime();
            var deltaTime = Math.round((clickTime - initTime) / 1000);
            var postData = {
                "type": 7,
                "operateResult": "检测记录-一键问医",
                "stayTime":  deltaTime
            };
            LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", postData, LMEPG.emptyFunc, LMEPG.emptyFunc);
        }
        // --------上报局方使用模块数据 end--------
        modal.hide();
        var objCurrent = PageJump.getCurrentPage();
        objCurrent.setParam('focusId','ask_fast');
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        LMEPG.Intent.jump(jumpObj, objCurrent);
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
     * 跳转到检测页面
     * @param btn
     */
    jumpImeiInputPage: function (btn) {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('imeiInput');
        var enterType; // 进入下个页面的检测类型
        // curPaperType 类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
        if (curPaperType == 1) {
            enterType = 3;
        } else if (curPaperType == 2) {
            enterType = 1;
        } else if (curPaperType == 4) {
            enterType = 2;
        }
        dstPage.setParam('testType', enterType); // 检测类型：1-胆固醇 2-尿酸 3-血糖
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 跳转输入数据页面
     */
    jumpPageInputDataPage: function () {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTestData');
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 跳转数据上报页面
     * @param btn 绑定具体某条数据
     */
    jumpReportData: function (btn) {
        var eventSrc = G(btn.id);
        var reportFlag = eventSrc.getAttribute("data-flag");
        var source = eventSrc.getAttribute("data-source");
        if (reportFlag === '1') {
            LMEPG.UI.showToast("数据已上报，请勿重复上报！");
        } else if (source === '1') {
            LMEPG.UI.showToast("手动输入的数据不可上报!");
        } else {
            var curPage = PageJump.getCurrentPage();
            //reportData
            if (RenderParam.carrierId == "10000051" || RenderParam.carrierId == "10220094")
                var dstPage = LMEPG.Intent.createIntent('reportData');
            else
                var dstPage = LMEPG.Intent.createIntent('report-data');
            dstPage.setParam('member_image_id', RenderParam.member_image_id);
            dstPage.setParam('member_name', RenderParam.member_name);
            dstPage.setParam('member_id', RenderParam.member_id);
            var measureId = eventSrc.getAttribute('measureId');
            var measureDate = eventSrc.getAttribute('data-date');
            var measureLevel = eventSrc.getAttribute('data-level');
            dstPage.setParam("measureId", measureId);
            dstPage.setParam("date", measureDate);
            dstPage.setParam("level", measureLevel);
            var measureData = null;
            if (TestRecord.testId == '1') {
                dstPage.setParam('measureType', "bloodPressure");
                var diastolicPressure = eventSrc.getAttribute('data-high');
                var systolicPressure = eventSrc.getAttribute('data-low');
                var heartRate = eventSrc.getAttribute('data-rate');
                measureData = {
                    'date': measureDate,
                    'level': measureLevel,
                    'diastolicPressure': diastolicPressure,
                    'systolicPressure': systolicPressure,
                    'heartRate': heartRate
                }
            } else if(TestRecord.testId == '4' ){
                dstPage.setParam('measureType', 'weight');
                dstPage.setParam('member_id', RenderParam.member_id);
                dstPage.setParam('member_image_id', RenderParam.member_image_id);
                dstPage.setParam('member_name', RenderParam.member_name);

                measureData = {
                    date:G(btn.id).getAttribute("data-time"),
                    fat: G(btn.id).getAttribute("data-fat"),
                    weight: G(btn.id).getAttribute("data-weight"),
                    resistance:G(btn.id).getAttribute("data-resistance"),

                    height:G(btn.id).getAttribute("data-height"),
                    age:G(btn.id).getAttribute("data-age"),
                    sex:parseInt(G(btn.id).getAttribute("data-sex"))+1

                }

                LMEPG.Intent.jump(dstPage, curPage);
            }else {
                dstPage.setParam('measureType', 'bloodSugar');
                var measureStatus = eventSrc.getAttribute('data-status');
                var measureState = eventSrc.getAttribute('data-state');
                var measureNumber = eventSrc.getAttribute('data-number');
                measureData = {
                    'date': measureDate,
                    'level': measureLevel,
                    'status': measureStatus,
                    'state': measureState,
                    'data': measureNumber,
                }
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

        dstPage.setParam("measureType", TestRecord.dataKey);

        dstPage.setParam('member_id', RenderParam.member_id);
        dstPage.setParam('member_image_id', RenderParam.member_image_id);
        dstPage.setParam('member_name', JSON.stringify(uData));
        dstPage.setParam('test_type', JSON.stringify({id:TestRecord.testId,key:TestRecord.dataKey}));

        LMEPG.Intent.jump(dstPage, curPage);
    },

    jumpRecordDetail: function (btn) {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('weight-detail');

        dstPage.setParam('member_id', RenderParam.member_id);
        dstPage.setParam('member_image_id', RenderParam.member_image_id);
        dstPage.setParam('member_name', RenderParam.member_name);
        dstPage.setParam('time', G(btn.id).getAttribute("data-time"));
        dstPage.setParam('weight', G(btn.id).getAttribute("data-weight"));
        dstPage.setParam('resistance', G(btn.id).getAttribute("data-resistance"));
        dstPage.setParam('id', G(btn.id).getAttribute("data-id"));

        dstPage.setParam('height', G(btn.id).getAttribute("data-height"));
        dstPage.setParam('age', G(btn.id).getAttribute("data-age"));
        dstPage.setParam('sex', parseInt(G(btn.id).getAttribute("data-sex"))+1);



        LMEPG.Intent.jump(dstPage, curPage);
    },

};

var onBack = function () {
    if(G('dialog_container')){
        delNode('dialog_container')
        LMEPG.BM.requestFocus('ask_fast')
    }else {
        LMEPG.Intent.back();
    }
};