// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | [健康检测-检测记录首页]页面控制js
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/2/12 下午1:41
// +----------------------------------------------------------------------
var LOG_TAG = "healthTestRecordList.js";
var debug = false;

// 当前页默认有焦点的按钮ID
var defaultFocusId = "card-1";
var lastFocusIdToolbar = "write-btn";//用于焦点保持 -> 顶部按钮：最后一次是从哪个按钮 [下移焦点]
var lastFocusIdListItem = "card-1";//用于焦点保持 -> 列表项：最后一次是从哪个按钮 [上移焦点]

// 定义全局按钮
var buttons = [];

/**
 * 页面跳转控制
 */
var Page = {

    // 获取当前页面对象
    getCurrentPage: function (clickMemberId) {
        var currentPage = LMEPG.Intent.createIntent("healthTestRecordList");
        currentPage.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        currentPage.setParam("focusMemberId", LMEPG.Func.isEmpty(clickMemberId) ? "" : clickMemberId);
        return currentPage;
    },

    // 跳转->输入数据页面
    jumpInputData: function () {
        var objCurrent = Page.getCurrentPage(Page._getLastFocusMemberId());
        var objDst = LMEPG.Intent.createIntent("healthTestInputData");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    // 跳转->所有未归档记录列表页面
    jumpUnarchivedInspectList: function () {
        var objCurrent = Page.getCurrentPage(Page._getLastFocusMemberId());
        var objDst = LMEPG.Intent.createIntent("healthTestArchivingList");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    // 跳转->某一家庭成员检测记录详情页面
    jumpHealthRecordDetail: function (memberObj) {
        var src = Page.getCurrentPage(memberObj.member_id);
        var dst = LMEPG.Intent.createIntent("healthTestRecordDetail");
        dst.setParam("memberId", memberObj.member_id);
        dst.setParam("memberName", memberObj.member_name);
        dst.setParam("memberImageId", memberObj.member_image_id);
        dst.setParam("memberGender", memberObj.member_gender);
        LMEPG.Intent.jump(dst, src);
    },

    // 获取上最后一次聚焦的家庭成员id，如果没有返回undefined或者""
    _getLastFocusMemberId: function () {
        var btn = LMEPG.BM.getButtonById(lastFocusIdListItem);
        if (LMEPG.Func.isObject(btn)) {
            var memberObj = List.getMemberDataAt(parseInt(btn.cIndex));
            return LMEPG.Func.isObject(memberObj) ? memberObj.member_id : "";
        }
    },

};

/**
 * 有检测记录的家庭成员列表
 */
var List = {

    pageCurrent: 1, // 当前页
    pageNum: 3, // 每页数量
    dataList: [], // 数据列表

    // 截取当前页展示数据
    getCurrentPageDataList: function () {
        var data = [];
        if (this.dataList.length > 0) {
            var start = (this.pageCurrent - 1) * this.pageNum; //数组截取起始位置
            var end = start + this.pageNum; //数组截取终止位置
            data = this.dataList.slice(start, end);
        }
        return data;
    },

    // 初始化列表
    init: function (memberList) {
        this.dataList = LMEPG.Func.isArray(memberList) ? memberList : [];
        this.createListUI();
    },

    // 创建列表UI
    createListUI: function () {
        var data = this.getCurrentPageDataList();
        var htmlStr = "";

        for (var i = 0; i < data.length; i++) {
            var role = data[i];

            htmlStr += '<div id="card-' + (i + 1) + '" class="card">';
            htmlStr += '  <img class="photo" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/HealthTest/icon_member_' + role.member_image_id + '.png" alt=""/>';
            htmlStr += '  <div class="intro-info">' + role.member_name + '<br/><span class="font-s">检测记录</span></div>';
            htmlStr += '</div>';
        }

        G("center").innerHTML = htmlStr;

        List.updatePaginationUI();
        List.checkToShowEmptyDataUI();
    },

    isEmptyPage: function () {
        return LMEPG.Func.isArray(this.dataList) && this.dataList.length === 0;
    },

    // 校验加载第一页时，拉取空数据列表时，显示占位符提示
    checkToShowEmptyDataUI: function () {
        if (this.pageCurrent === 1 && this.isEmptyPage()) {
            // 第1页，即空数据列表，显示占位提示
            Hide("data_full");
            Show("data_null");
            LMEPG.BM.requestFocus(defaultFocusId);
        } else {
            Hide("data_null");
            Show("data_full");
            LMEPG.BM.requestFocus(defaultFocusId);
        }
    },

    // 更新分页显示
    updatePaginationUI: function () {
        if (this.hasNext()) {
            Show('arrow-right');
        } else {
            Hide('arrow-right');
        }
        if (this.hasPrev()) {
            Show('arrow-left');
        } else {
            Hide('arrow-left');
        }
    },

    hasPrev: function () {
        return this.pageCurrent > 1;
    },

    hasNext: function () {
        return Math.ceil(this.dataList.length / this.pageNum) > this.pageCurrent;
    },

    // 遥控器按键-上翻页
    loadPrevPage: function () {
        if (this.hasPrev()) {
            defaultFocusId = "card-3";
            this.pageCurrent--;
            this.createListUI();
            return true;
        }
    },

    // 遥控器按键-下翻页
    loadNextPage: function () {
        if (this.hasNext()) {
            defaultFocusId = "card-1";
            this.pageCurrent++;
            this.createListUI();
            return true;
        }
    },

    // 列表项焦点移动操作
    onBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case "left":
                if (current.id === "card-1") {
                    if (List.loadPrevPage()) {
                        return false;
                    }
                }
                break;
            case "right":
                if (current.id === "card-3") {
                    if (List.loadNextPage()) {
                        return false;
                    }
                }
                break;
            case "up":
                if (current.id.startWith("card-")) {
                    lastFocusIdListItem = current.id;
                    LMEPG.BM.requestFocus(lastFocusIdToolbar);
                    return false;
                }
                break;
            case "down":
                if (!current.id.startWith("card-")) {
                    lastFocusIdToolbar = current.id;
                    LMEPG.BM.requestFocus(lastFocusIdListItem);
                    return false;
                }
                break;
        }
    },

    // 列表项点击
    onClick: function (btn) {
        var memberObj = List.getMemberDataAt(parseInt(btn.cIndex));
        if (LMEPG.Func.isObject(memberObj)) {
            Page.jumpHealthRecordDetail(memberObj);
        } else {
            LMEPG.UI.showToast("程序出错：下标越界！");
        }
    },

    // 返回当前列表页指定位置的家庭成员对象
    getMemberDataAt: function (pos) {
        var pageData = List.getCurrentPageDataList();
        if (pos >= 0 && pos < pageData.length) {
            return pageData[pos];
        } else {
            return null;
        }
    },
};

/**
 * 健康检测记录首页-控制入口类
 */
var HealthRecordList = {
    initButtons: function () {
        buttons.push({
            id: "write-btn",
            name: "输入数据",
            type: "img",
            nextFocusRight: "arching-btn",
            nextFocusDown: "card-1",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_write.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_write.png",
            click: Page.jumpInputData,
            beforeMoveChange: List.onBeforeMoveChange,
        });

        buttons.push({
            id: "arching-btn",
            name: "数据归档",
            type: "img",
            nextFocusLeft: "write-btn",
            nextFocusDown: "card-1",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_arching.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_arching.png",
            click: Page.jumpUnarchivedInspectList,
            beforeMoveChange: List.onBeforeMoveChange,
        });

        for (var i = 0; i < List.pageNum; i++) {
            buttons.push({
                id: "card-" + (i + 1),
                name: "家庭成员-" + (i + 1),
                type: "div",
                nextFocusLeft: "card-" + i,
                nextFocusRight: "card-" + (i + 2),
                nextFocusUp: "write-btn",
                backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_card.png",
                focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_card.png",
                click: List.onClick,
                beforeMoveChange: List.onBeforeMoveChange,
                cIndex: i,
            });
        }

        LMEPG.BM.init(defaultFocusId, buttons, "", true);
    },

    // 准备前初始化、处理一些数据变量
    initData: function () {
        // 默认按钮焦点保持
        if (!LMEPG.Func.isEmpty(RenderParam.focusIndex)) {
            defaultFocusId = RenderParam.focusIndex;
        }
        if (!LMEPG.Func.isArray(RenderParam.memberList) || RenderParam.memberList.length === 0) {
            defaultFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? "write-btn" : defaultFocusId;
            List.pageCurrent = 1;
        } else {
            // 从上一页面返回当前页后，计算上一次点击的成员位置及其分页
            for (var i = 0, len = RenderParam.memberList.length; i < len; i++) {
                var member = RenderParam.memberList[i];
                if (member.member_id == RenderParam.focusMemberId) {
                    List.pageCurrent = Math.ceil((i + 1) / List.pageNum);
                }
            }
        }

        // 显示右上角红点（未归档数）
        var unarchivedCount = parseInt(RenderParam.unarchivedCount + "");
        if (!isNaN(unarchivedCount) && unarchivedCount > 0) {
            G("count").innerHTML = unarchivedCount + "";
            Show("count");
        } else {
            Hide("count");
        }

    },

    /**
     * 页面初始化唯一入口
     */
    init: function () {
        this.initData();
        this.initButtons();

        List.init(RenderParam.memberList);
    },
};

function onBack() {
    LMEPG.Intent.back();
}

window.onload = function () {
    HealthRecordList.init();
};