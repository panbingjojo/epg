/**
 * ***************************************************
 * 健康检测js文件
 * ***************************************************
 */
// 页面按钮数组
var buttons = [];
var Test = {
    page: 0,
    testTYpe: ["aal-imei", "sg-blood", "test-weight","doctor-code","bind-wristband","testIndexThree", "inputTest"],
    imgSrc: "/Public/img/hd/HealthTest/V8/",

    /**
     * 页面初始化，页面入口
     */
    init: function () {
        this.createBtns();
        Pagination.init(Test.buildPageParams())
    },

    /**
     * 构建
     */
    buildPageParams:function (){
        //  设备图片列表
        var device_images = [this.imgSrc + "link_1", this.imgSrc + "link_2", this.imgSrc + "link_3", this.imgSrc + "link_6"]
        return {
            "containerId": "list-wrapper",
            "data": device_images,
            "pageSize": 3,
            "btnId": "link-"
        }
    },

    /**
     * 获取当前页西信息
     * @returns {{param, setPageName: setPageName, name: string, setParam: setParam}}
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('testIndex');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('page', Pagination.curPage);
        return objCurrent;
    },

    /**
     * 设备列表中的点击事件
     * @param btn
     */
    onClick: function (btn) {
        if (btn.cType == "bind-wristband") {
            Test.queryWristBindStatus(btn);
        } else {
            Test.jumpHealthTestIMEI(btn.cType);
        }
    },

    /**
     * 查询当前绑定状态
     * @param btn
     */
    queryWristBindStatus: function (btn) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('DeviceCheck/queryRememberWrist', "",
            function (data) {

                try {
                    if (data.result == 1 && data.list != null && data.list.length > 0) {
                        LMEPG.UI.dismissWaitingDialog();
                        Test.jumpWristRecord(data.list);
                    } else {
                        LMEPG.UI.dismissWaitingDialog();
                        Test.jumpHealthTestIMEI(btn.cType);
                    }
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("手环绑定状态解析异常!" + e);
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("手环绑定状态请求失败!");
            }
        );
    },

    /**
     * 跳转 - 健康检测IMEI号输入页面
     */
    jumpHealthTestIMEI: function (type) {
        var objCurrent = Test.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent(type);
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    /**
     * 跳转 - 手环检测记录界面
     */
    jumpWristRecord: function (list) {
        var objCurrent = Test.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent("wristList-wristband");
        objHomeTab.setParam('member_id', list[0].member_id);
        objHomeTab.setParam('member_image_id', list[0].member_image_id);
        objHomeTab.setParam('member_name', list[0].member_name);
        objHomeTab.setParam('device_id', list[0].device_id);
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

    /**
     * 创建按钮
     */
    createBtns: function () {
        buttons.push(
            {
                id: 'input',
                type: 'img',
                nextFocusDown: 'link-0',
                nextFocusRight: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input_f.png',
                click: this.onClick,
                cType: this.testTYpe[6],
                beforeMoveChange: this.onBeforeMoveChange
            })
    }
};

/**
 * 设备列表相关的处理逻辑
 * @type {{init: Pagination.init, buildDeviceListHtml: Pagination.buildDeviceListHtml, cut: (function(*): *), data: string, prePage: Pagination.prePage, nextPage: Pagination.nextPage, createBtn: Pagination.createBtn, toggleArrow: Pagination.toggleArrow, type: string, btnId: string, updateBttonImg: Pagination.updateBttonImg, createHtml: Pagination.createHtml, turnPage: ((function(*, *): boolean)|*), curPage: number, initParams: Pagination.initParams, containerId: string, pagesSize: number}}
 */
var Pagination = {
    containerId: "",//分页容器,
    curPage: 0,
    type: "img",
    data: "",   //  设备列表
    pagesSize: 3,
    btnId: "",
    /**
     * 设备列表数据初始化
     * @param element
     */
    init: function (element) {
        this.initParams(element)
        this.createBtn();
        this.createHtml();
    },

    /**
     * 初始化分页变量数据
     * @param element
     */
    initParams:function (element){
        Pagination.containerId = element.containerId;
        Pagination.data = element.data;
        Pagination.pagesSize = element.pageSize;
        Pagination.btnId = element.btnId;
    },

    /**
     * 创建html数据包
     */
    createHtml: function () {
        var curData = Pagination.cut(Pagination.data);
        Pagination.buildDeviceListHtml(curData);
        Pagination.updateBttonImg(curData)
        this.toggleArrow();
        LMEPG.ButtonManager.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'link-0');
    },

    /**
     * 更新设备列表中的按钮数据
     * @param list
     */
    updateBttonImg:function (list){
        for (var i = 0; i < list.length; i++) {
            LMEPG.BM.getButtonById(Pagination.btnId + i).backgroundImage = g_appRootPath + list[i] + '.png';
            LMEPG.BM.getButtonById(Pagination.btnId + i).focusImage = g_appRootPath + list[i] + '_f.png';
            LMEPG.BM.getButtonById(Pagination.btnId + i).cType = Test.testTYpe[Pagination.curPage + i];
        }
    },

    /**
     * 构建设备列表html文本
     * @param list
     */
    buildDeviceListHtml:function (list){
        var sHtml = "";
        for (var i = 0;i<list.length;i++){
            sHtml += '<img id="' + Pagination.btnId + i + '" src="' + g_appRootPath + list[i] + '.png"/>';
        }
        G(this.containerId).innerHTML = sHtml;
    },

    /**
     * 前端分页展示
     */
    cut: function (list) {
        return list.slice(Pagination.curPage, Pagination.pagesSize + Pagination.curPage)
    },

    /**
     * 切换页面
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
        }
    },

    /**
     * 创建按钮
     */
    createBtn: function () {
        var focusNum = 3;
        while (focusNum--) {
            buttons.push({
                id: this.btnId + focusNum,
                type: 'img',
                nextFocusUp: 'input',
                nextFocusLeft: this.btnId + (focusNum - 1),
                nextFocusRight: this.btnId + (focusNum + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/input.png',
                click: Test.onClick,
                beforeMoveChange: this.turnPage,
                cType: ""
            });
        }
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'link-0', buttons, '', true);
    },

    /**
     * 上一页
     */
    prePage: function () {
        if (this.curPage > 0) {
            this.curPage--;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + "0");
        }
    },

    /**
     * 下一页
     */
    nextPage: function () {
        if (this.curPage < Math.floor(this.data.length - this.pagesSize)) {
            this.curPage++;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + (Pagination.pagesSize - 1));
        }
    },

    /**
     *
     */
    toggleArrow: function () {
        S('left-arrow');
        S('right-arrow');
        this.curPage == 0 && H('left-arrow');
        this.curPage == Math.floor(this.data.length - this.pagesSize) && H('right-arrow');
    },
}

var onBack = function () {
    LMEPG.Intent.back();
};