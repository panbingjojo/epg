// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | [健康检测-所有未归档检测记录列表]页面控制js
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/2/12 下午1:41
// +----------------------------------------------------------------------
var LOG_TAG = "ArchivingList.js";
var debug = false;

// 当前页默认有焦点的按钮ID
var defaultFocusId = "items_1";
var lastFocusJCBtnId = "jc_btn_1"; //记录最后获得焦点的“空数据页面”按钮ID，用于焦点返回保持
var lastFocusToolBtnId = "inspection_input"; //记录最后获得焦点的“顶部工具栏”按钮ID，用于焦点返回保持
var lastFocusItemsId = "items_1"; //记录最后获得焦点的“数据列表”按钮ID，用于焦点返回保持

// 定义全局按钮
var buttons = [];

/**
 * 页面跳转控制
 */
var Page = {

    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("healthTestArchivingList");
        currentPage.setParam("type", RenderParam.type);
        currentPage.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        currentPage.setParam("currentPage", List.pageCurrent);
        currentPage.setParam("pageItemIndex", lastFocusItemsId.split("_")[1]);
        return currentPage;
    },

    // 跳转->增加家庭成员
    jumpMemberAdd: function (memberId) {
        var objCurrent = Page.getCurrentPage();
        objCurrent.setParam("actionType", "1"); // 1表示从新增家庭成员页面返回
        var objDst = LMEPG.Intent.createIntent("familyMembersAdd");
        objDst.setParam("actionType", "1"); // 1表示新增家庭成员
        objDst.setParam("memberID", memberId);
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    // 跳转->健康检测-首页（引导步骤） type: 类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
    jumpHealthTestHome: function (measureType) {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("healthTestIMEIInput");
        objDst.setParam("type", measureType);
        LMEPG.Intent.jump(objDst, objCurrent);
    },
};


/**
 * 检测记录列表
 */
var List = {

    pageCurrent: 1, // 当前页
    pageNum: 5, // 每页数量
    pageTotalCount: 0, //数据问题
    dataList: [], // 归档数据列表
    expandingItemId: "", // 当前正在展开的列表项btnId

    memberList: [], // 第1列滚动数据：用户已添加的家庭成员列表
    statusList: { // 第2列滚动数据：检测状态时刻列表，命名为：type{类型}
        type1: Measure.StatusHelper.status_configs.type1, //血糖
        type2: Measure.StatusHelper.status_configs.type2, //胆固醇
        type3: Measure.StatusHelper.status_configs.type3, //甘油三脂
        type4: Measure.StatusHelper.status_configs.type4, //尿酸
    },
    actionList: [], // 第3列滚动数据

    scrollType: { // 滚动成员类型
        member: 0, //检测成员
        status: 1, //检测状态
        action: 2, //操作按钮
    },
    scrollIndex: { //滚动列表当前显示位置
        member: 1, //检测成员
        status: 0, //检测状态
        action: 0, //操作按钮
    },

    initOnce: function () {
        this.initMembers();
        this.initActions();
    },

    initMembers: function () {
        var addedMemberCount = this.memberList.length;
        if (addedMemberCount > 0) {
            // 情况1：有添加过家庭成员
            // >>>
            // 已添加成员数量=[1, 8)，则添加"添加成员"按钮
            if (addedMemberCount < 8) {
                this.memberList.push(Measure.ADD_MEMBER_ITEM);
            }
        } else {
            // 情况2：未曾添加过任何家庭成员
            // >>>
            this.memberList.push(Measure.ADD_MEMBER_ITEM);
        }
    },

    initActions: function () {
        this.actionList = [
            {
                id: 0,
                name: "提交"
            },
            {
                id: -1,
                name: "删除"
            }
        ];
    },

    getStatusList: function (measureType, measureDt) {
        var statusList = eval("List.statusList.type" + measureType);
        if (!LMEPG.Func.isArray(statusList)) {
            statusList = [];
            if (debug) console.error(LMEPG.Func.string.format("getStatusList(): Not an array by eval(List.statusList.type{0})!", measureType));
        }
        return Measure.StatusHelper.getStatusListBy(measureType, statusList, measureDt);
    },

    getCurrentPageDataList: function () {
        var data = [];
        if (this.dataList.length > 0) {
            data = this.dataList.slice(0, this.pageNum);
        }
        return data;
    },

    // 创建菜单
    createListUI: function () {
        var domList = G("center");
        var data = this.getCurrentPageDataList();
        if (!LMEPG.Func.isArray(data)) {
            domList.innerHTML = "";
            return;
        }

        var htmlStr = "";
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var memberId = item.member_id;
            var measureType = item.measure_type;
            var measureId = item.measure_id;
            var measureDt = DT.format(item.measure_dt, "yyyy.MM.dd hh:mm:ss");//item.measure_dt;
            var measureData = item.measure_data;

            var formatData = isNaN(parseFloat(measureData)) ? 0 : parseFloat(measureData);
            if (measureType == Measure.Type.BLOOD_GLUCOSE || measureType == Measure.Type.CHOLESTERIN) {
                formatData = formatData.toFixed(2);//e.g. "6.55"
            }
            var measureTypeText = Measure.getTypeText(measureType);
            var measureDataWithUnit = formatData + Measure.getUnitText(measureType);
            var measureStatusId = List.getStatusList(measureType, measureDt);

            htmlStr += '<div  id="items_' + (i + 1) + '_bg" class="items"> ';
            htmlStr += '<img id="items_' + (i + 1) + '" class="items_bg" alt="" ' +
                ' src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/HealthTest/bg_btn.png" ' +
                ' member-id="' + memberId + '"' +
                ' measure-id="' + measureId + '"' +
                ' measure-dt="' + measureDt + '"' +
                ' measure-type="' + measureType + '"' +
                ' measure-status-id="' + measureStatusId + '"' +
                ' c-index="' + i + '"' +
                ' />';
            htmlStr += '<div class="items_btn">';
            htmlStr += '<div class="items_content">' + measureDt + '</div>';
            htmlStr += '<div class="items_content">' + measureTypeText + '</div>';
            htmlStr += '<div class="items_content">' + measureDataWithUnit +
                '<img id="items_' + (i + 1) + '_icon" class="icon_right"' +
                ' src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/HealthTest/icon_right_1.png" alt=""/>' +
                '</div>';
            htmlStr += '</div>';
            htmlStr += '<div id="items_' + (i + 1) + '_expand" class="items_expand">';
            htmlStr += '<div class="time_block">';
            htmlStr += '<div class="time_code" style="border-bottom: 1px #FFFFFF solid;">检测成员</div>';
            htmlStr += '<div class="time_code" style="border-bottom: 1px #FFFFFF solid;">检测状态</div>';
            htmlStr += '<div class="time_code">&nbsp;&nbsp;</div>';
            htmlStr += '</div>';
            htmlStr += '<div id="items_' + (i + 1) + '_block" class="time_block">';
            htmlStr += '</div>';
            htmlStr += '</div></div>';
        }
        domList.innerHTML = htmlStr;

        List.updatePageArrowUI();
        List.checkToShowEmptyDataUI();
    },

    // 数据列表项焦点效果
    onFocusChange_List: function (btn, hasFocus) {
        if (hasFocus) {
            lastFocusItemsId = btn.id;
            defaultFocusId = btn.id;
        }
    },

    // 点击展开滚动列表项焦点效果
    onFocusChange_ScrollList: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "border_select");
            LMEPG.CssManager.addClass(btn.id + "_bg", "border_focused");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "border_select");
            LMEPG.CssManager.removeClass(btn.id + "_bg", "border_focused");
        }
    },

    // 其它工具按钮焦点效果
    onFocusChange_OtherButtons: function (btn, hasFocus) {
        if (hasFocus) {
            if (btn.id.startWith("jc_btn_")) {
                lastFocusJCBtnId = btn.id;
            } else if (btn.id === "question_input" || btn.id === "inspection_input") {
                lastFocusToolBtnId = btn.id;
            }
        }
    },

    // 检测记录列表项焦点移动
    onBeforeMoveChange_List: function (direction, current) {
        switch (direction) {
            case "up":
                if (current.id === "items_1") {
                    if (List.loadPrevPage()) {
                        return false;
                    }
                }
                break;
            case "down":
                if (current.id === "items_5") {
                    if (List.loadNextPage()) {
                        return false;
                    }
                }
                break;
        }
    },

    // 展开某项检测记录后子项列表滚动焦点移动
    onBeforeMoveChange_ScrollList: function (direction, current) {
        var measureType = G(List.expandingItemId).getAttribute("measure-type");

        switch (direction) {
            case "up":
                switch (current.id) {
                    case "integer_btn_2":
                        List.scrollUp(List.scrollType.member, List.memberList, current.id);
                        break;
                    case "integer_btn_3":
                        var measureDt = G(List.expandingItemId).getAttribute("measure-dt");
                        List.scrollUp(List.scrollType.status, List.getStatusList(measureType, measureDt), current.id);
                        break;
                    case "integer_btn_4":
                        List.scrollUp(List.scrollType.action, List.actionList, current.id);
                        break;
                }
                break;
            case "down":
                switch (current.id) {
                    case "integer_btn_2":
                        List.scrollDown(List.scrollType.member, List.memberList, current.id);
                        break;
                    case "integer_btn_3":
                        var measureDt = G(List.expandingItemId).getAttribute("measure-dt");
                        List.scrollDown(List.scrollType.status, List.getStatusList(measureType, measureDt), current.id);
                        break;
                    case "integer_btn_4":
                        List.scrollDown(List.scrollType.action, List.actionList, current.id);
                        break;
                }
                break;
        }
    },

    // 其它工具按钮焦点移动
    onBeforeMoveChange_OtherButtons: function (direction, current) {
        switch (direction) {
            case "up":
                if (current.id.startWith("jc_btn_")) {
                    LMEPG.BM.requestFocus(lastFocusToolBtnId);
                    return false;
                }
                break;
            case "down":
                if (current.id === "question_input" || current.id === "inspection_input") {
                    if (List.isEmptyPage()) {
                        LMEPG.BM.requestFocus(lastFocusJCBtnId);
                        return false;
                    }
                }

                break;
        }
    },

    // 点击数据列表项
    onClick_List: function (btn) {
        if (LMEPG.Func.isElementExist(btn.id)) {
            List.expandItem(btn.id);
        } else {
            // 避免没有列表项，LMEPG.BM框架仍保持按钮，则会发生js出错从而导致按返回键失败！
            if (debug) console.error(LMEPG.Func.string.format("[{0}]--[onClick_List({1}): dom is not exist!", [LOG_TAG, btn.id]));
        }
    },

    // 点击展开滚动列表项
    onClick_ScrollList: function (btn) {
        var itemId = G(btn.id).getAttribute("item-id");

        switch (btn.id) {
            case "integer_btn_2":
            case "integer_btn_3":
                if (btn.id === "integer_btn_2" && itemId == "0") { //添加家庭成员
                    Page.jumpMemberAdd(itemId);
                    return;
                }

                List.collapseItem(List.expandingItemId);
                break;
            case "integer_btn_4":
                if (itemId == "0") { //提交
                    Action.archive();
                } else if (itemId == "-1") { //删除
                    var measureId = G(List.expandingItemId).getAttribute("measure-id");
                    Action.delete(measureId);
                }
                break;
        }
    },

    // 点击其它工具按钮
    onClick_OtherButtons: function (btn) {
        if (btn.id === "question_input") { //问医记录待归档
            // Page.jumpP2PInquiryArchive();
        } else if (btn.id === "inspection_input") { //检测记录待归档刷新
            List.reloadDataList();
        } else if (btn.id.startWith("jc_btn_")) {
            var inspectType = Measure.Type.URIC_ACID; //检测类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
            if (btn.id.endWith("_1")) inspectType = Measure.Type.BLOOD_GLUCOSE;
            if (btn.id.endWith("_2")) inspectType = Measure.Type.CHOLESTERIN;
            if (btn.id.endWith("_3")) inspectType = Measure.Type.URIC_ACID;
            Page.jumpHealthTestHome(inspectType);
        }
    },

    // 刷新当前页列表，如果获取到当前页没有数据，则自动回退到上一页
    reloadCurrentPageList: function () {
        defaultFocusId = lastFocusItemsId; //刷新当前页后，新数据列表仍然先保持在当前操作（归档/删除）的位置上（如果存在的话）
        this.loadDataList(function () {
            if (List.isEmptyPage()) {
                List.loadPrevPage();
            }
        });
    },

    // 重新更新整个列表
    reloadDataList: function () {
        defaultFocusId = "items_1";
        this.pageCurrent = 1;
        this.loadDataList();
    },

    // 加载数据列表
    loadDataList: function (asyncCallback) {
        this.pageTotalCount = 0; // 重置数据
        this.dataList = []; // 重置数据

        var postData = {
            currentPage: this.pageCurrent,
            pageNum: this.pageNum,
        };
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI("DeviceCheck/getAllUnarchivedRecordList", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();

            if (LMEPG.Func.isObject(data) && data.result == 0) {
                List.pageTotalCount = data.count;
                List.dataList = Measure.parseUnarchivedRecord1List(data.list); //转换为统一约定规则定义的数据结构
            } else {
                if (debug) console.error(LMEPG.Func.string.format('[{0}]--->[{1}]: 查询数据列表出错！data：{2}', [LOG_TAG, 'loadDataList', JSON.stringify(data)]));
                LMEPG.Log.error(LMEPG.Func.string.format('[{0}]--->[{1}]: 查询数据列表出错！data：{2}', [LOG_TAG, 'loadDataList', JSON.stringify(data)]));
            }

            List.createListUI();
            LMEPG.call(asyncCallback); //异步加载数据完成且渲染完成，执行相应的回调操作
        });
    },

    // 遥控器左键-上翻页
    loadPrevPage: function () {
        if (this.hasPrev()) {
            defaultFocusId = "items_5";
            this.pageCurrent--;
            this.loadDataList();
            return true;
        }
    },

    // 遥控器右键-下翻页
    loadNextPage: function () {
        if (this.hasNext()) {
            defaultFocusId = "items_1";
            this.pageCurrent++;
            this.loadDataList();
            return true;
        }
    },

    // 更新分页箭头显示
    updatePageArrowUI: function () {
        if (this.hasPrev()) {
            Show("arrow_pre");
        } else {
            Hide("arrow_pre");
        }

        if (this.hasNext()) {
            Show("arrow_next");
        } else {
            Hide("arrow_next");
        }
    },

    isEmptyPage: function () {
        return LMEPG.Func.isArray(this.dataList) && this.dataList.length === 0;
    },

    // 校验加载第一页时，拉取空数据列表时，显示占位符提示
    checkToShowEmptyDataUI: function () {
        var hasNoData = this.isEmptyPage();
        if (this.pageCurrent === 1 && hasNoData) {
            // 第1页，即空数据列表，显示占位提示
            Hide("data_full");
            Show("data_null");
            LMEPG.BM.requestFocus(lastFocusJCBtnId);
        } else {
            Hide("data_null");
            Show("data_full");

            // 检查并尝试自动上移一个列表项位置：
            // 如果（归档/删除）一条数据后重新更新列表后，若（归档/删除）前那个位置的id不存在了（不足1页了），则向上移动一个列表项！
            List.autoTryBackspacePrevItem(); //删除完刷新列表，焦点尝试自动回退
        }
    },

    hasPrev: function () {
        return this.pageCurrent > 1;
    },

    hasNext: function () {
        return Math.ceil(this.pageTotalCount / this.pageNum) > this.pageCurrent;
    },

    hasExpandingItems: function () {
        return !LMEPG.Func.isEmpty(List.expandingItemId);
    },

    tryToExpandItemBy: function (itemBtnId) {
        if (!LMEPG.Func.isEmpty(List.expandingItemId)) {
            if (G(itemBtnId)) {
                LMEPG.BM.requestFocus(itemBtnId);
                LMEPG.Framework.onEvent(KEY_ENTER);
            }
        }
    },

    createExpandHtml: function (id) {
        var str = "";
        str += '<div id="integer_btn_2_bg"  class="time_btn" item-id=""></div>';
        str += '<div id="integer_btn_2_pre"  class="time_code" item-id=""></div>';
        str += '<div id="integer_btn_3_pre" class="time_code" item-id=""></div>';
        str += '<div id="integer_btn_4_pre" class="time_code" item-id="">&nbsp;&nbsp;</div>';

        str += '<div id="integer_btn_3_bg"  class="time_btn" item-id=""></div>';
        str += '<div id="integer_btn_2"  class="time_code_big border_select" item-id=""></div>';
        str += '<div id="integer_btn_3" class="time_code_big" item-id=""></div>';
        str += '<div id="integer_btn_4" class="time_code_big" item-id="">提交</div>';

        str += '<div id="integer_btn_4_bg"  class="time_btn" item-id=""></div>';
        str += '<div id="integer_btn_2_next"  class="time_code" item-id=""></div>';
        str += '<div id="integer_btn_3_next" class="time_code" item-id=""></div>';
        str += '<div id="integer_btn_4_next" class="time_code" item-id="">删除</div>';
        G(id + "_block").innerHTML = str;
    },

    findArrayIndexBy: function (measureType, measureId, measureStatusId, memberId) {
        if (debug) console.log(LMEPG.Func.string.format("measureType[{0}]-measureId[{1}]-statusId[{2}]-memberId[{3}]", [measureType, measureId, measureStatusId, memberId]));

        //家庭成员默认选中值：从添加页面返回后保持到最新的一个，即倒数第2个（包含手动插入的"添加成员"按钮）
        var memberListTemp = List.memberList;
        if (memberListTemp.length >= 2) List.scrollIndex.member = memberListTemp.length - 2;
        else if (memberListTemp.length >= 1) List.scrollIndex.member = 0;

        // for (var i = 0, len = memberListTemp.length; i < len; i++) {
        //     var item = memberListTemp[i].member_id;
        //     if (item.member_id != 0 && item.member_id == memberId) {
        //         List.scrollIndex.member = i;
        //         break;
        //     } else {
        //         if (len <= 2) List.scrollIndex.member = 0; // 默认从第1个显示开始
        //         else List.scrollIndex.member = 1; // 默认从第2个显示开始
        //     }
        // }

        // var statusListTemp = List.getStatusList(measureType);
        // for (var i = 0; i < statusListTemp.length; i++) {
        //     if (statusListTemp[i].id == measureStatusId) {
        //         List.scrollIndex.status = i;
        //         break;
        //     } else {
        //         List.scrollIndex.status = 0; // 默认从第1个显示开始
        //     }
        // }
    },

    renderScrollListItemUIFirst: function (measureType, measureId, measureDt, measureStatusId, memberId) {
        var realStatusList = List.getStatusList(measureType, measureDt);
        List.findArrayIndexBy(measureType, measureId, measureStatusId, memberId);

        List.updateScrollListItemsUI(List.scrollType.member, List.memberList, List.scrollIndex.member);
        List.updateScrollListItemsUI(List.scrollType.status, realStatusList, List.scrollIndex.status);
        List.updateScrollListItemsUI(List.scrollType.action, List.actionList, List.scrollIndex.action);

        LMEPG.BM.requestFocus("integer_btn_2");
    },

    /**
     * 按上键滚动列表
     *
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param dataList 滚动数据列表
     */
    scrollUp: function (scrollType, dataList) {
        switch (scrollType) {
            case List.scrollType.member:
                var desIndex = List.scrollIndex.member - 1 < 0 ? dataList.length - 1 : List.scrollIndex.member - 1;
                List.updateScrollListItemsUI(List.scrollType.member, dataList, desIndex);
                break;
            case List.scrollType.status:
                var desIndex = List.scrollIndex.status - 1 < 0 ? dataList.length - 1 : List.scrollIndex.status - 1;
                List.updateScrollListItemsUI(List.scrollType.status, dataList, desIndex);
                break;
            case List.scrollType.action:
                var desIndex = List.scrollIndex.action - 1 < 0 ? dataList.length - 1 : List.scrollIndex.action - 1;
                List.updateScrollListItemsUI(List.scrollType.action, dataList, desIndex);
                break;
            default:
                break;
        }
    },

    /**
     * 按下键滚动列表
     *
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param dataList 滚动数据列表
     */
    scrollDown: function (scrollType, dataList) {
        switch (scrollType) {
            case List.scrollType.member:
                var ascIndex = List.scrollIndex.member + 1 > dataList.length - 1 ? 0 : List.scrollIndex.member + 1;
                List.updateScrollListItemsUI(List.scrollType.member, dataList, ascIndex);
                break;
            case List.scrollType.status:
                var ascIndex = List.scrollIndex.status + 1 > dataList.length - 1 ? 0 : List.scrollIndex.status + 1;
                List.updateScrollListItemsUI(List.scrollType.status, dataList, ascIndex);
                break;
            case List.scrollType.action:
                var ascIndex = List.scrollIndex.action + 1 > dataList.length - 1 ? 0 : List.scrollIndex.action + 1;
                List.updateScrollListItemsUI(List.scrollType.action, dataList, ascIndex);
                break;
            default:
                break;
        }
    },


    /**
     * 更新展开项的不同滚动列表项数据
     *
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param dataList 滚动数据列表
     * @param currentSelectIndex 当前中央选中的列表数据索引序号
     */
    updateScrollListItemsUI: function (scrollType, dataList, currentSelectIndex) {
        if (debug) console.error(LMEPG.Func.string.format("updateScrollListItemsUI({0}, index={1})>>list_size: {2}", [
            scrollType === List.scrollType.member ? "检测成员" : scrollType === List.scrollType.status ? "检测状态" : "操作按钮",
            currentSelectIndex,
            dataList.length
        ]));
        var prevIndex = 0, prevData = null;
        var currIndex = 0, currData = null;
        var nextIndex = 0, nextData = null;
        var placeholder1 = "&nbsp;&nbsp;";
        var placeholder2 = "undefined";

        function _debug_value(value) {
            var localDebug = false; //TODO 用于调试状态值，上线置为false
            return localDebug ? '<span style="color: #ff0000;">[' + value + ']</span>' : "";
        }

        switch (scrollType) {
            case List.scrollType.member:
                if (dataList.length === 1) {
                    prevIndex = -1;
                    currIndex = 0;
                    nextIndex = -1;
                } else if (dataList.length === 2) {
                    prevIndex = -1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                } else {
                    prevIndex = currentSelectIndex - 1 < 0 ? dataList.length - 1 : currentSelectIndex - 1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                }

                // 记录当前滚动中央显示的位置
                List.scrollIndex.member = currIndex;

                prevData = dataList[prevIndex];
                currData = dataList[currIndex];
                nextData = dataList[nextIndex];

                G("integer_btn_2_pre").innerHTML = (prevData ? prevData.member_name + _debug_value(prevData.member_id) : placeholder1);
                G("integer_btn_2_pre").setAttribute("item-id", prevData ? prevData.member_id : placeholder2);

                G("integer_btn_2").innerHTML = (currData ? currData.member_name + _debug_value(currData.member_id) : placeholder1);
                G("integer_btn_2").setAttribute("item-id", currData ? currData.member_id : placeholder2);

                G("integer_btn_2_next").innerHTML = (nextData ? nextData.member_name + _debug_value(nextData.member_id) : placeholder1);
                G("integer_btn_2_next").setAttribute("item-id", nextData ? nextData.member_id : placeholder2);
                break;

            case List.scrollType.status:
                if (dataList.length === 1) {
                    prevIndex = -1;
                    currIndex = 0;
                    nextIndex = -1;
                } else if (dataList.length === 2) {
                    prevIndex = -1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                } else {
                    prevIndex = currentSelectIndex - 1 < 0 ? dataList.length - 1 : currentSelectIndex - 1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                }

                // 记录当前滚动中央显示的位置
                List.scrollIndex.status = currIndex;

                prevData = dataList[prevIndex];
                currData = dataList[currIndex];
                nextData = dataList[nextIndex];

                G("integer_btn_3_pre").innerHTML = (prevData ? prevData.name + _debug_value(prevData.id) : placeholder1);
                G("integer_btn_3_pre").setAttribute("item-id", prevData ? prevData.id : placeholder2);

                G("integer_btn_3").innerHTML = (currData ? currData.name + _debug_value(currData.id) : placeholder1);
                G("integer_btn_3").setAttribute("item-id", currData ? currData.id : placeholder2);

                G("integer_btn_3_next").innerHTML = (nextData ? nextData.name + _debug_value(nextData.id) : placeholder1);
                G("integer_btn_3_next").setAttribute("item-id", nextData ? nextData.id : placeholder2);
                break;

            case List.scrollType.action:
                if (dataList.length === 1) {
                    prevIndex = -1;
                    currIndex = 0;
                    nextIndex = -1;
                } else if (dataList.length === 2) {
                    prevIndex = -1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                } else {
                    prevIndex = currentSelectIndex - 1 < 0 ? dataList.length - 1 : currentSelectIndex - 1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                }

                // 记录当前滚动中央显示的位置
                List.scrollIndex.action = currIndex;

                prevData = dataList[prevIndex];
                currData = dataList[currIndex];
                nextData = dataList[nextIndex];

                G("integer_btn_4_pre").innerHTML = (prevData ? prevData.name + _debug_value(prevData.id) : placeholder1);
                G("integer_btn_4_pre").setAttribute("item-id", prevData ? prevData.id : placeholder2);

                G("integer_btn_4").innerHTML = (currData ? currData.name + _debug_value(currData.id) : placeholder1);
                G("integer_btn_4").setAttribute("item-id", currData ? currData.id : placeholder2);

                G("integer_btn_4_next").innerHTML = (nextData ? nextData.name + _debug_value(nextData.id) : placeholder1);
                G("integer_btn_4_next").setAttribute("item-id", nextData ? nextData.id : placeholder2);
                break;
            default:
                break;
        }

    },

    renderExpandUIAt: function (itemBtnId) {
        List.createExpandHtml(itemBtnId);

        LMEPG.CssManager.addClass(itemBtnId + "_expand", "items_expand_hover");

        var measureStatusId = G(itemBtnId).getAttribute("measure-status-id");
        var measureType = G(itemBtnId).getAttribute("measure-type");
        var measureDt = G(itemBtnId).getAttribute("measure-dt");
        var measureId = G(itemBtnId).getAttribute("measure-id");
        var memberId = G(itemBtnId).getAttribute("member-id");
        List.renderScrollListItemUIFirst(measureType, measureId, measureDt, measureStatusId, memberId);

        G(itemBtnId + "_icon").src = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/icon_down_1.png";
    },

    // 展开指定条目
    expandItem: function (itemBtnId) {
        if (!(/^items_[1-5]$/.test(itemBtnId))) {
            if (debug) console.error("expandItem({0}): invalid and reject!");
            return;
        }

        switch (itemBtnId) {
            case "items_3"://展开第3个，只需要隐藏其它条目1，其余空间足够
                Hide("items_1_bg");
                break;
            case "items_4"://展开第4个，只需要隐藏其它条目1、2、3，其余空间足够
                Hide("items_1_bg");
                Hide("items_2_bg");
                Hide("items_3_bg");
                break;
            case "items_5"://展开第5个，只需要隐藏其它条目1、2、3，其余空间足够
                Hide("items_1_bg");
                Hide("items_2_bg");
                Hide("items_3_bg");
                break;
        }

        List.expandingItemId = itemBtnId;
        List.renderExpandUIAt(itemBtnId);

        Hide("arrow_next");//隐藏下一页箭头，腾出更多展示空间
    },

    // 折叠当前正在展开条目
    collapseItem: function (itemBtnId) {
        if (!LMEPG.Func.isEmpty(itemBtnId) && (/^items_[1-5]$/.test(itemBtnId))) {
            switch (itemBtnId) {
                case "items_3"://展开第3个，只需要隐藏其它条目1，其余空间足够
                    Show("items_1_bg");
                    break;
                case "items_4"://展开第4个，只需要隐藏其它条目1、2、3，其余空间足够
                    Show("items_1_bg");
                    Show("items_2_bg");
                    Show("items_3_bg");
                    break;
                case "items_5"://展开第5个，只需要隐藏其它条目1、2、3，其余空间足够
                    Show("items_1_bg");
                    Show("items_2_bg");
                    Show("items_3_bg");
                    break;
            }

            LMEPG.CssManager.removeClass(itemBtnId + "_expand", "items_expand_hover");
            G(itemBtnId + "_icon").src = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/icon_right_1.png";
            G(itemBtnId + "_block").innerHTML = "";
            LMEPG.BM.requestFocus(itemBtnId);
        } else {
            // 如果未指定关闭哪个展开的id参数。则默认关闭当前展开的那一项
            if (!LMEPG.Func.isEmpty(List.expandingItemId)) {
                List.collapseItem(List.expandingItemId);
            }
        }

        List.expandingItemId = null;
        List.updatePageArrowUI();//尝试恢复下一页箭头，不再需要腾出更多展示空间
    },

    /**
     * 检查并尝试自动上移一个列表项位置：
     * 如果（归档/删除）一条数据后重新更新列表后，若（归档/删除）前那个位置的id不存在了（不足1页了），则向上移动一个列表项！
     */
    autoTryBackspacePrevItem: function () {
        if (!LMEPG.Func.isEmpty(defaultFocusId) && (/^items_[1-5]$/.test(defaultFocusId))
        ) {
            if (!LMEPG.Func.isElementExist(defaultFocusId)) {
                var idParts = defaultFocusId.split("_");
                idParts[1] = parseInt(idParts[1]) - 1;
                var newFocusId = "";
                for (var i = 0; i < idParts.length; i++) {
                    newFocusId += idParts[i];
                    if (i < idParts.length - 1) {
                        newFocusId += "_";
                    }
                }
                LMEPG.BM.requestFocus(newFocusId);
                return;
            }
        }
        LMEPG.BM.requestFocus(defaultFocusId);
    },

};

/**
 * 操作控制
 */
var Action = {
    archive: function () {
        function _getChildDivBy(parentId, childId) {
            var dom = G(parentId);
            if (!LMEPG.Func.isExist(dom)) {
                return;
            }

            var sons = dom.getElementsByTagName("div");
            if (debug) console.error("sons", sons);
            if (LMEPG.Func.isExist(sons) && sons.length > 0) {
                for (var i = 0, len = sons.length; i < len; i++) {
                    var son = sons[i];
                    if (son.id == childId) {
                        if (debug) console.error("Find-->", son);
                        return son;
                    }
                }
            }
        }

        var cIndex = parseInt(G(List.expandingItemId).getAttribute("c-index"));
        if (isNaN(cIndex)) {
            LMEPG.UI.showToast(LMEPG.Func.string.format("提交过程发生错误！请检查[{0}]", cIndex));
        } else {
            var pageList = List.getCurrentPageDataList();
            if (cIndex >= 0 && cIndex < pageList.length) {
                var record = pageList[cIndex];

                var domMemberId = _getChildDivBy(List.expandingItemId + "_block", "integer_btn_2");
                var domStatusId = _getChildDivBy(List.expandingItemId + "_block", "integer_btn_3");
                var memberId = LMEPG.Func.isExist(domMemberId) ? domMemberId.getAttribute("item-id") : "";
                var statusId = LMEPG.Func.isExist(domStatusId) ? domStatusId.getAttribute("item-id") : "";
                if (!LMEPG.Func.isExist(domMemberId) || !LMEPG.Func.isExist(domStatusId)) {
                    LMEPG.UI.showToast("程序内部出错！[-1, -1]");
                    return;
                }

                if (LMEPG.Func.isEmpty(memberId) || memberId == "0") {
                    LMEPG.UI.showToast("请先添加一个家庭成员！");
                    return;
                }

                var latestRepastId = "-1";
                var latestTimebucketId = "-1";
                switch (Measure.getTypeAsInt(record.measure_type)) {
                    case Measure.Type.BLOOD_GLUCOSE: //血糖：使用repast_id
                        latestRepastId = statusId;
                        break;
                    case Measure.Type.CHOLESTERIN:
                    case Measure.Type.URIC_ACID: //胆固醇和尿酸：使用timebucket_id
                        latestTimebucketId = statusId;
                        break;
                }

                var postData = {
                    member_id: memberId,
                    measure_id: record.measure_id,
                    repast_id: latestRepastId,
                    timebucket_id: latestTimebucketId,
                    paper_type: record.measure_type,
                    env_temperature: record.measure_env_temperature,
                    measure_data: record.measure_data,
                    measure_dt: record.measure_dt,
                };

                LMEPG.UI.showWaitingDialog();
                LMEPG.ajax.postAPI("DeviceCheck/archiveInspectRecord", postData, function (data) {
                    LMEPG.UI.dismissWaitingDialog();
                    if (data.result === 0) {
                        // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                        LMEPG.KEM.setAllowFlag(false);
                        LMEPG.UI.showToast("归档成功", 1.5, function () {
                            LMEPG.KEM.setAllowFlag(true);
                            List.collapseItem();
                            List.reloadCurrentPageList();
                        });
                    } else {
                        LMEPG.UI.showToast(LMEPG.Func.string.format("归档失败！[{0}]", data.result));

                    }
                });
            } else {
                LMEPG.UI.showToast(LMEPG.Func.string.format("提交过程发生错误！请检查[{0}]", cIndex));
            }
        }

    },

    delete: function (measureId) {
        function _deleteInner() {
            if (LMEPG.Func.isEmpty(measureId)) {
                LMEPG.UI.showToast(LMEPG.Func.string.format("删除失败！<br/>无效的id[{0}]", measureId));
                return;
            }

            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI("DeviceCheck/deleteInspectRecord", {measureId: measureId}, function (data) {
                LMEPG.UI.dismissWaitingDialog();
                if (data.result === 0) {
                    // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                    LMEPG.KEM.setAllowFlag(false);
                    LMEPG.UI.showToast("删除成功", 1.5, function () {
                        LMEPG.KEM.setAllowFlag(true);
                        List.collapseItem();
                        List.reloadCurrentPageList();
                    });
                } else {
                    LMEPG.UI.showToast(LMEPG.Func.string.format("删除失败！[{0}]", data.result));
                }
            });
        }

        LMEPG.UI.commonDialog.show("删除后将无法查询本条数据的检测记录哦！确实删除本条数据？", ["确定", "取消"], function (btnIndex) {
            if (btnIndex === 0) {
                _deleteInner();
            }
        })
    },

};

/**
 * 检测记录归档列表-控制入口类
 */
var UnarchivedInspectList = {
    isInitFirst: true, // 首次加载页面标志

    initButtons: function () {
        buttons.push({
            id: "items_1",
            name: "选项1",
            type: "img",
            nextFocusUp: "inspection_input",
            nextFocusDown: "items_2",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_btn.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_btn.png",
            click: List.onClick_List,
            focusChange: List.onFocusChange_List,
            beforeMoveChange: List.onBeforeMoveChange_List,
        });
        buttons.push({
            id: "items_2",
            name: "选项2",
            type: "img",
            nextFocusUp: "items_1",
            nextFocusDown: "items_3",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_btn.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_btn.png",
            click: List.onClick_List,
            focusChange: List.onFocusChange_List,
            beforeMoveChange: List.onBeforeMoveChange_List,
        });
        buttons.push({
            id: "items_3",
            name: "选项3",
            type: "img",
            nextFocusUp: "items_2",
            nextFocusDown: "items_4",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_btn.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_btn.png",
            click: List.onClick_List,
            focusChange: List.onFocusChange_List,
            beforeMoveChange: List.onBeforeMoveChange_List,
        });
        buttons.push({
            id: "items_4",
            name: "选项4",
            type: "img",
            nextFocusUp: "items_3",
            nextFocusDown: "items_5",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_btn.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_btn.png",
            click: List.onClick_List,
            focusChange: List.onFocusChange_List,
            beforeMoveChange: List.onBeforeMoveChange_List,
        });
        buttons.push({
            id: "items_5",
            name: "选项4",
            type: "img",
            nextFocusUp: "items_4",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_btn.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_btn.png",
            click: List.onClick_List,
            focusChange: List.onFocusChange_List,
            beforeMoveChange: List.onBeforeMoveChange_List,
        });

        buttons.push({
            id: "question_input",
            name: "问医记录",
            type: "img",
            nextFocusRight: "inspection_input",
            nextFocusDown: "items_1",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/DataArchiving/bg_q_record.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/DataArchiving/f_q_record.png",
            click: List.onClick_OtherButtons,
            focusChange: List.onFocusChange_OtherButtons,
            beforeMoveChange: List.onBeforeMoveChange_OtherButtons,
        });
        buttons.push({
            id: "inspection_input",
            name: "检测记录",
            type: "img",
            nextFocusLeft: "question_input",
            nextFocusDown: "items_1",
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/DataArchiving/select_i_record.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/DataArchiving/f_i_record.png",
            click: List.onClick_OtherButtons,
            focusChange: List.onFocusChange_OtherButtons,
            beforeMoveChange: List.onBeforeMoveChange_OtherButtons,
        });


        for (var i = 0; i < 3; i++) {
            buttons.push({
                id: "integer_btn_" + (i + 2),
                name: "选项4",
                type: "img",
                nextFocusLeft: "integer_btn_" + (i + 2 - 1),
                nextFocusRight: "integer_btn_" + (i + 2 + 1),
                click: List.onClick_ScrollList,
                focusChange: List.onFocusChange_ScrollList,
                beforeMoveChange: List.onBeforeMoveChange_ScrollList,
            });
        }

        for (var i = 0; i < 3; i++) {
            buttons.push({
                id: "jc_btn_" + (i + 1),
                name: "选项4",
                type: "img",
                nextFocusLeft: "jc_btn_" + (i + 1 - 1),
                nextFocusRight: "jc_btn_" + (i + 1 + 1),
                nextFocusUp: "inspection_input",
                backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/DrugInquiry/bg_key.png",
                focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/DrugInquiry/f_key.gif",
                click: List.onClick_OtherButtons,
                focusChange: List.onFocusChange_OtherButtons,
                beforeMoveChange: List.onBeforeMoveChange_OtherButtons,
            });
        }

        LMEPG.BM.init("", buttons, "", true);
    },

    // 准备前初始化、处理一些数据变量
    initData: function () {
        // 初始化检测记录列表数据
        List.dataList = LMEPG.Func.isArray(RenderParam.recordDataList) ? RenderParam.recordDataList : [];
        List.memberList = LMEPG.Func.isArray(RenderParam.addedMemberList) ? RenderParam.addedMemberList : [];

        // 记录返回焦点保持按钮、页码、默认选中列表项
        if (!LMEPG.Func.isEmpty(RenderParam.focusIndex)) {
            if (RenderParam.focusIndex.startWith("jc_btn_")) lastFocusJCBtnId = RenderParam.focusIndex;
            if (RenderParam.focusIndex.startWith("inspection_input")
                || RenderParam.focusIndex.startWith("question_input")) {
                lastFocusToolBtnId = RenderParam.focusIndex;
            }
        }

        if (!LMEPG.Func.isEmpty(RenderParam.currentPage)) List.pageCurrent = RenderParam.currentPage;
        if (!LMEPG.Func.isEmpty(RenderParam.pageItemIndex)) {
            lastFocusItemsId = "items_" + RenderParam.pageItemIndex;
            defaultFocusId = lastFocusItemsId;
        }

        // 如果action==1，表示添加家庭成员或者从检测引导页面收到push数据后，跳转到当前归档页面。用于进入当前归档页面后，
        // 保持并自动展开指定列表项
        if (RenderParam.actionType == 1 && !LMEPG.Func.isEmpty(lastFocusItemsId)) {
            List.expandingItemId = lastFocusItemsId;
        }
    },

    /**
     * 页面初始化唯一入口
     */
    init: function () {
        this.initData();
        this.initButtons();
        List.initOnce();
        List.loadDataList(function () {
            // 首次加载完成后，保持上一次跳转到添加家庭成员列表前的展开项
            List.tryToExpandItemBy(List.expandingItemId);
        });
        this.isInitFirst = false;
    }
};

function onBack() {
    if (List.hasExpandingItems()) {
        List.collapseItem();
    } else {
        LMEPG.Intent.back();
    }
}

window.onload = function () {
    UnarchivedInspectList.init();
};