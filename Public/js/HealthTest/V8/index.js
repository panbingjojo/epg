
var buttons = [];

var stepOne = {
    focusId:'link-0',
    init:function(){
        stepOne.getDeviceData(function (data) {
            Pagination.data = data.data;
            Pagination.curStep = 1;
            stepOne.render()
            Pagination.createInputBtn()
            Pagination.toggleArrow();
            LMEPG.BM.init('link-0',[],true)
        })

    },

    render:function () {
        var buttonArr = []
        var html = '<div class="step-1-title">请选择设备类型</div>'
        var curData = Pagination.cut();

        curData.forEach(function (item,index) {
            var urlArr = item.type_picture.split(';')
            html+='<img src="'+RenderParam.fsUrl+urlArr[0]+'" id="link-'+index+'" class="base-list"/>'

            buttonArr.push({
                id: 'link-'+index,
                type: 'img',
                nextFocusUp: 'input',
                nextFocusLeft: 'link-'+(index-1),
                nextFocusRight: 'link-'+(index+1),
                backgroundImage: RenderParam.fsUrl+urlArr[0],
                focusImage: RenderParam.fsUrl+urlArr[1],
                click: function (btn) {
                    stepOne.focusId = LMEPG.BM.getCurrentButton().id
                    stepTwo.renderSNPop()
                },
                beforeMoveChange: Pagination.turnPage,
                dName:item.type_name
            })
        })

        G('container').innerHTML = html
        LMEPG.BM.addButtons(buttonArr)
    },

    getDeviceData:function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('NewHealthDevice/getBaseDeviceType', '', function (data){
            LMEPG.UI.dismissWaitingDialog()
            if(data.result === 0){
                cb(data)
            }else {
                LMEPG.UI.showToastUI('获得设备类型错误')
            }

        })
    },

    checkHasLock:function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('NewHealthDevice/checkDeviceWhetherLock', {
            carrierId:RenderParam.carrierId
        }, function (data){
            LMEPG.UI.dismissWaitingDialog()
            cb(data)
        })
    },

    checkNeedLock:function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('NewHealthDevice/checkNeedLock', {}, function (data){
            LMEPG.UI.dismissWaitingDialog()
            console.log(data)
            cb(data)
        })
    }
}


var stepTwo = {
    renderSNPop:function () {
        var snDiv = document.createElement("div");
        snDiv.id = "sn-pop";
        LMEPG.CssManager.addClass(snDiv, "sn-pop");
        document.body.appendChild(snDiv);

        G("sn-pop").innerHTML = stepTwo.renderContent();

        stepTwo.addButton()
        LMEPG.BM.requestFocus('sn-input')
    },

    renderContent:function () {
        return '<div class="sn-bg">' +
                    '<div class="inner-content">' +
                        '<div class="sn-title">请输入您的设备SN号：</div>' +
                        '<div class="sn-input" id="sn-input">请输入SN号</div>'+
                        '<div class="sn-tip">' +
                            '<p>注：</p>'+
                            '<p>1. SN号可在设备背面查看；</p>'+
                            '<p>2.只有平台定制版设备才可以解锁此功能，若未购买建议去线下运营商营业厅购买。</p>'+
                        '</div>'+
                        '<div class="sn-btn-area">' +
                            '<img src="'+g_appRootPath+'/Public/img/hd/Device/V1/sn-sure.png" id="sn-ok">'+
                            '<img src="'+g_appRootPath+'/Public/img/hd/Device/V1/sn-back.png" style="margin-left: 35px" id="sn-cancel">'+
                        '</div>'+
                    '</div>' +
            '</div>'
    },

    addButton:function () {
        var buttons = []

        buttons.push({
            id: 'sn-ok',
            type: 'img',
            nextFocusUp: 'sn-input',
            nextFocusLeft: '',
            nextFocusRight: 'sn-cancel',
            backgroundImage: g_appRootPath + '/Public/img/hd/Device/V1/sn-sure.png',
            focusImage: g_appRootPath + '/Public/img/hd/Device/V1/sn-sure-f.png',
            click: stepTwo.checkNum,
            beforeMoveChange: '',
        },{
            id: 'sn-cancel',
            type: 'img',
            nextFocusUp: 'sn-input',
            nextFocusLeft: 'sn-ok',
            nextFocusRight: '',
            backgroundImage: g_appRootPath + '/Public/img/hd/Device/V1/sn-back.png',
            focusImage: g_appRootPath + '/Public/img/hd/Device/V1/sn-back-f.png',
            click: function () {
                delNode('sn-pop')
                LMEPG.BM.requestFocus(stepOne.focusId)
            },
            beforeMoveChange: '',
        },{
            id: 'sn-input',
            type: 'img',
            nextFocusDown: 'sn-ok',
            nextFocusLeft: '',
            nextFocusRight: '',
            backgroundImage: '',
            focusImage: '',
            focusChange: function (btn,hasFocus) {
                if(hasFocus){
                    LMEPG.UI.keyboard.showWithEn({
                        x:690,
                        y:330,
                        inputEle:btn.id,
                        placeholder:'请输入SN号',
                        maxLength:18,
                        backId:'sn-ok'
                    });
                }
            },
        })

        LMEPG.BM.addButtons(buttons)
    },

    checkNum:function(){
        var num = G('sn-input').innerHTML
        if (LMEPG.UI.keyboard.inputIsNull()) {
            stepTwo.mesToast('SN号不可为空');
            return;
        }

        stepTwo.checkSNNum(num,function (data) {
            stepTwo.mesToast(data.msg,function () {
                if(data.code === 200){
                    Pagination.modelType = data.modelType
                    Pagination.nowDevice = data.deviceType
                    Pagination.init()
                    delNode('sn-pop')
                }
            })

        })
    },

    mesToast:function(mes,cb){
        var snDiv = document.createElement("div");
        snDiv.innerHTML = mes;
        snDiv.id = "sn-toast";
        LMEPG.CssManager.addClass(snDiv, "sn-toast");
        document.body.appendChild(snDiv);

        setTimeout(function () {
            delNode('sn-toast')
            cb&&cb()
        },2000)
    },

    checkSNNum:function (snCode,cb) {
        LMEPG.ajax.postAPI('NewHealthDevice/checkSNNum', {
            carrierId:RenderParam.carrierId,
            snCode:snCode
        },function (data) {
            console.log(data)
            cb(data)
        })
    },
}

var Test = {
    /**
     * 页面处初始化入口
     */
    init: function () {
        Pagination.init()
    },

    /**
     * 获取当前页数据
     * @returns {{param, setPageName: setPageName, name: string, setParam: setParam}}
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('testIndex');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('page', Pagination.curPage);
        objCurrent.setParam('tabIndex', Pagination.tabIndex);
        return objCurrent;
    },

    /**
     * 页面上的可点击事件
     * @param btn
     */
    onClick: function (btn) {
        Test.jumpHealthTestIMEI(btn.typeIndex,btn.cType);
    },

    toRecord:function(){
        var objCurrent = Test.getCurrentPage();
        var target = LMEPG.Intent.createIntent('healthTestArchivingList');
        target.setParam('comeFrom','device')
        LMEPG.Intent.jump(target, objCurrent);
    },

    /**
     * 跳转 - 二维码
     */
    jumpHealthTestIMEI: function (index,type) {
        var objCurrent = Test.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent(type || 'sg-blood');
        if(!type){
            if(Pagination.data[Pagination.curPage+index].device_model_id == Pagination.openDevice.deviceModelId){
                Pagination.data[Pagination.curPage+index].sn = Pagination.openDevice.snCode
            }
            objHomeTab.setParam('remind',Test.translateText( Pagination.data[Pagination.curPage+index].reminder));
            Pagination.data[Pagination.curPage+index].reminder = ''
            objHomeTab.setParam('testDevice',JSON.stringify(Pagination.data[Pagination.curPage+index]));
            console.log(Pagination.data[Pagination.curPage+index])
        }
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    translateText: function (text) {
        return text
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, "\"")
    },

    jumpToSNPage:function (btn) {
        if(Pagination.data[Pagination.curPage+btn.typeIndex].device_model_id == Pagination.openDevice.deviceModelId){
            Pagination.data[Pagination.curPage+btn.typeIndex].sn = Pagination.openDevice.snCode
        }

        var objCurrent = Test.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent('test-weight');
        objHomeTab.setParam('remind',Test.translateText( Pagination.data[Pagination.curPage+btn.typeIndex].reminder));
        Pagination.data[Pagination.curPage+btn.typeIndex].reminder = ''
        objHomeTab.setParam('testDevice',JSON.stringify(Pagination.data[Pagination.curPage+btn.typeIndex]));

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    }

};

/**
 * 分页
 */
var Pagination = {
    curPage: 0,
    data: null,
    allData:null,
    pagesSize: 3,
    curStep:1,
    tabIndex : 0,

    modelType:0,
    modelIndex:0,
    nowDevice:null,
    openDevice:null,

    /**
     * 初始化设备分页数据
     * @param element
     */
    init: function () {
        stepOne.checkNeedLock(function (res) {
            if(res.data === null || res.data.value === '1'){
                stepOne.checkHasLock(function (data) {
                    if(data.code === 200){
                        Pagination.initDeviceList(data)
                    }else {
                        stepOne.init()
                    }
                })
            }else {
                Pagination.initDeviceList()
            }
        })
    },

    initDeviceList:function(res){
        Pagination.curPage = parseInt(RenderParam.page || "0")
        Pagination.tabIndex = parseInt(RenderParam.tabIndex || '0')
        Pagination.curStep = 2
        Pagination.openDevice = res?res.deviceInfo[0]:'0'
        Pagination.getDeviceList(function (data) {
            Pagination.data = data
            Pagination.allData = data
            Pagination.showDeviceList()
            LMEPG.ButtonManager.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : Pagination.modelType?'link-'+Pagination.modelIndex:'link-0');
        })
    },

    showDeviceList:function(){
        if(Pagination.nowDevice){
            var arr = this.filterTab()
            for(var i=0; i<arr.length; i++){
                if(arr[i] == Pagination.nowDevice){
                    Pagination.tabIndex = i
                    break
                }
            }
        }

        Pagination.createInputBtn()
        Pagination.createBtn();
        Pagination.renderTitle()
        LMEPG.CssManager.addClass('tab-'+Pagination.tabIndex, "test-tab-f");
        Pagination.filterList(Pagination.nowDevice || G('tab-'+Pagination.tabIndex).innerHTML)

        Pagination.createHtml();
        Pagination.changeArrowTop();
    },

    renderTitle:function(){
        var buttons = []
        var html =  '<div class="test-title">请选择您的健康检测设备</div><div style="margin-top: 35px">'


        this.filterTab().forEach(function (item,index) {
            html+='<div class="test-tab " id="tab-'+index+'">'+item+'</div>'

            buttons.push({
                id: 'tab-'+index,
                type: 'div',
                nextFocusUp: 'input',
                nextFocusLeft: 'tab-'+(index-1),
                nextFocusRight: 'tab-'+(index+1),
                nextFocusDown: 'link-0',
                click: '',
                backgroundImage:' ',
                focusImage: g_appRootPath + '/Public/img/hd/Device/V1/tab-f.png',
                beforeMoveChange: function (dir,btn) {
                    if(dir === 'down'){
                        LMEPG.CssManager.addClass(btn.id, "test-tab-f");
                    }
                },
                focusChange:Pagination.tabFocus,
                moveChange:Pagination.tabMove,
                tabIndex: index
            })
        })

        html+='</div><div id="device-content" style="margin-top: 40px"></div>'

        LMEPG.BM.addButtons(buttons)
        G('container').innerHTML =  html
    },

    tabMove:function(pre,cur,dir){
        if(dir === 'left' || dir === 'right'){
            var flag = G(cur.id).innerHTML
            Pagination.tabIndex = cur.tabIndex
            Pagination.curPage = 0;
            Pagination.filterList(flag)
            Pagination.createHtml();
        }
    },

    tabFocus:function(btn,hasFocus){
        if(hasFocus){
            G(btn.id).style.fontWeight = 'bold'
            LMEPG.CssManager.removeClass(btn.id, "test-tab-f");
        }else {
            G(btn.id).style.fontWeight = 'normal'
        }
    },

    filterList:function(flag){
        if(flag === '全部'){
            Pagination.data = Pagination.allData
            return
        }
        Pagination.data = []
        Pagination.allData.forEach(function (item) {
            if(item.type_name === flag){
                Pagination.data.push(item)
            }
        })
    },

    changeArrowTop:function(){
        G('right-arrow').style.top = '390px'
        G('left-arrow').style.top = '390px'
    },

    filterTab:function(){
        var filterArr = ['全部']

        this.allData.forEach(function (item) {
            if(filterArr.indexOf(item.type_name) === -1){
                if(Pagination.nowDevice && item.device_type == Pagination.nowDevice){
                    Pagination.nowDevice = item.type_name
                }
                filterArr.push(item.type_name)
            }
        })
        return filterArr
    },

    /**
     * 创建Html
     */
    createHtml: function () {
        G('device-content').innerHTML = "";
        var sHtml = "";
        var curData = this.cut();

        curData.forEach(function (item, i) {
            var urlArr = item.device_picture.split(';')
            sHtml += '<img id="link-' + i + '" src="' + (RenderParam.fsUrl+urlArr[0]) + '"/>';

            if(Pagination.modelType && Pagination.modelType == item.device_model_id ){
                Pagination.modelIndex = i
            }
        });

        G('device-content').innerHTML = sHtml;

        for (var i = 0; i < curData.length; i++) {
            var urlArr = curData[i].device_picture.split(';')
            LMEPG.BM.getButtonById('link-'+ i).backgroundImage = RenderParam.fsUrl+urlArr[0] ;
            LMEPG.BM.getButtonById('link-' + i).focusImage = RenderParam.fsUrl+urlArr[1];
            LMEPG.BM.getButtonById('link-' + i).click = curData[i].detection_mode === '1'?Test.onClick : Test.jumpToSNPage;
        }

        this.toggleArrow();
    },

    getDeviceList:function(cb){
        LMEPG.ajax.postAPI('NewHealthDevice/getDeviceList', {},function (data) {
            console.log(data)
            if(data.result === 0){
                cb(data.data)
            }else {
                LMEPG.UI.showToast('获取设备列表错误!')
            }
        })
    },
    /**
     * 给设备列表做分页
     * @returns {string}
     */
    cut: function () {
        return this.data.slice(this.curPage, this.pagesSize + this.curPage)
    },

    /**
     * 切换页面，上一页或下一页
     * @param dir
     * @param cur
     * @returns {boolean}
     */
    turnPage: function (dir, cur) {
        if (dir == "left" && cur.id == "link-0") {
            Pagination.prePage()
            return false
        } else if (dir == "right" && cur.id == "link-2") {
            Pagination.nextPage()
            return false
        }else if(dir === 'up' && Pagination.curStep === 2){
            LMEPG.BM.requestFocus('tab-'+Pagination.tabIndex)
            return false
        }
    },

    /**
     * 创建设备按钮映射
     */
    createBtn: function () {
        var focusNum = 3;
        while (focusNum--) {
            buttons.push({
                id: 'link-' + focusNum,
                type: 'img',
                nextFocusUp: '',
                nextFocusLeft: 'link-' + (focusNum - 1),
                nextFocusRight: 'link-' + (focusNum + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
                beforeMoveChange: this.turnPage,
                typeIndex: focusNum
            });
        }
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'link-0', buttons, '', true);
    },

    createInputBtn: function () {
        LMEPG.BM.addButtons([{
            id: 'input',
            type: 'img',
            nextFocusDown: Pagination.curStep===1?'link-0':'tab-0',
            nextFocusLeft: 'test-record',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input_f.png',
            click: Test.onClick,
            cType: 'inputTest',
            beforeMoveChange:function (dir) {
                if(dir === 'down' && Pagination.curStep === 2){
                    LMEPG.BM.requestFocus('tab-'+Pagination.tabIndex)
                    return false
                }
            }
        },{
            id: 'test-record',
            type: 'img',
            nextFocusDown: Pagination.curStep===1?'link-0':'tab-0',
            nextFocusRight: 'input',
            backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/test_record.png',
            focusImage: g_appRootPath + '/Public/img/hd/Family/V13/test_record_f.png',
            click: Test.toRecord,
            cType: 'record',
            beforeMoveChange:function (dir) {
                if(dir === 'down' && Pagination.curStep === 2){
                    LMEPG.BM.requestFocus('tab-'+Pagination.tabIndex)
                    return false
                }
            }
        }])
    },

    /**
     * 上一页
     */
    prePage: function () {
        if (this.curPage > 0) {
            this.curPage--;
            this.createHtml();
            LMEPG.BM.requestFocus('link-0');
        }
    },

    /**
     * 下一页
     */
    nextPage: function () {
        if (this.curPage < Math.floor(this.data.length - this.pagesSize)) {
            this.curPage++;
            this.createHtml();
            LMEPG.BM.requestFocus('link-' + (Pagination.pagesSize - 1));
        }
    },

    /**
     * 判断左右箭头是否显示
     */
    toggleArrow: function () {
        S('left-arrow');
        S('right-arrow');
        this.curPage == 0 && H('left-arrow');
        this.curPage >= Math.floor(this.data.length - this.pagesSize) && H('right-arrow');
    }
}

/**
 * 页面返回
 */
var onBack = function () {
    if(G('sn-pop')){
        delNode('sn-pop')
        LMEPG.BM.requestFocus(stepOne.focusId)
    }else {
        LMEPG.Intent.back();
    }

};