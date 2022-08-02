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
var defaultFocusId = "btn-1";

// 定义全局按钮
var buttons = [];

/**
 * 具体检测类型对应的记录列表
 */
var List = {

    pageCurrent: 1, // 当前页
    pageNum: 9, // 每页数量
    pageTotalCount: 0, // 总条数
    measureType: Measure.Type.BLOOD_GLUCOSE, // 检测类型：1-血糖 2-胆固醇 3-甘油三酯 4-尿酸
    dataList: [], // 数据列表（每页）

    /**
     * 初始化调用，一次
     */
    initOnce: function () {
        // 设置成员信息
        G("member-avatar").src = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/icon_member_" + RenderParam.memberImageId + ".png";
        G("member-name").innerHTML = RenderParam.memberName;

        // 加载数据
        // this.refreshDataListBy(Measure.Type.BLOOD_GLUCOSE);
    },

    /**
     * 刷新指定检测类型的检测记录
     *
     * @param measureType
     */
    refreshDataListBy: function (measureType) {
        this.pageCurrent = 1;
        this.measureType = LMEPG.Func.isEmpty(measureType) ? this.measureType : measureType;
        this.loadDataList();
    },

    /**
     * 根据指定检测类型，拉取当前家庭成员对应的检测数据
     *
     * @param asyncCallback 成员检索完数据并更新UI后，回调给上层做私有处理
     */
    loadDataList: function (asyncCallback) {
        LMEPG.UI.showWaitingDialog();

        // 重置上一次设置
        List.dataList = [];
        List.pageTotalCount = 0;

        var postData = {
            memberId: RenderParam.memberId,
            paperType: List.measureType,
            startDT: "",
            endDT: "",
            currentPage: List.pageCurrent,
            pageNum: List.pageNum,
        };
        LMEPG.ajax.postAPI("DeviceCheck/getMemberArchivedRecordList", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (debug) console.log("getMemberArchivedRecordList: ", postData, data);
            if (LMEPG.Func.isObject(data) && data.result == 0) {
                List.dataList = LMEPG.Func.isArray(data.list) ? data.list : [];
                List.pageTotalCount = data.count;
                List.createListUI();
            } else {
                if (debug) console.error(LMEPG.Func.string.format("[{0}]_loadDataListBy(req={1})--->[Failed!]: rsp={2}", [LOG_TAG, JSON.stringify(postData), JSON.stringify(data)]));
                LMEPG.Log.error(LMEPG.Func.string.format("[{0}]_loadDataListBy(req={1})--->[Failed!]: rsp={2}", [LOG_TAG, JSON.stringify(postData), JSON.stringify(data)]));
            }

            LMEPG.call(asyncCallback);

            List.updatePaginationUI();
            List.checkToShowEmptyDataUI();
        }, function () {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast("请求数据失败！");
        });
    },

    // 创建列表UI
    createListUI: function () {
        var htmlStr = "";
        htmlStr += '<table>';
        htmlStr += '<img id="center-box" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/HealthTest/big_box.png" alt=""/>';
        for (var i = 0; i < List.dataList.length; i++) {
            var data = List.dataList[i];
            if (!LMEPG.Func.isObject(data)) {
                continue;
            }

            var measureType = data.paper_type;
            var measureDT = DT.format(data.measure_dt, "yyyy.MM.dd hh:mm:ss");
            var formatData = isNaN(parseFloat(data.measure_data)) ? 0 : parseFloat(data.measure_data);
            if (measureType == Measure.Type.BLOOD_GLUCOSE || measureType == Measure.Type.CHOLESTERIN) {
                formatData = formatData.toFixed(2);//e.g. "6.55"
            }
            var measureDataWithUnit = formatData + Measure.getUnitText(measureType);
            var measureLevel = Measure.getResultLevel(RenderParam.memberGender, measureType, formatData, data.repast_id);
            var measureStatus = Measure.getStatusTextBy(measureType, measureType == Measure.Type.BLOOD_GLUCOSE ? data.repast_id : data.timebucket_id);

            htmlStr += "<tr>";
            htmlStr += '  <td>' + measureDT + '</td>';
            htmlStr += '  <td style="text-align: center;">' + measureStatus + '</td>';
            htmlStr += '  <td style="text-align: center;">' + measureDataWithUnit + '</td>';
            htmlStr += '  <td style=" text-align: center;color: ' + measureLevel.color + '">' + measureLevel.text + '</td>';
            htmlStr += '</tr>';
        }
        htmlStr += '</table>';

        G("center").innerHTML = htmlStr;
    },

    isEmptyPage: function () {
        return LMEPG.Func.isArray(this.dataList) && this.dataList.length === 0;
    },

    // 校验加载第一页时，拉取空数据列表时，显示占位符提示
    checkToShowEmptyDataUI: function () {
        if (this.pageCurrent === 1 && this.isEmptyPage()) {
            // 第1页，即空数据列表，显示占位提示
            G("empty-data").innerHTML = LMEPG.Func.string.format('暂无 "{0}" 检测记录!', Measure.getTypeText(this.measureType));
            Show("empty-data");
            Hide("center");
        } else {
            Hide("empty-data");
            Show("center");
        }
    },

    // 更新分页显示
    updatePaginationUI: function () {
        if (this.hasNext()) {
            Show("arrow-next");
        } else {
            Hide("arrow-next");
        }
        if (this.hasPrev()) {
            Show("arrow-prev");
        } else {
            Hide("arrow-prev");
        }
    },

    hasPrev: function () {
        return this.pageCurrent > 1;
    },

    hasNext: function () {
        return Math.ceil(this.pageTotalCount / this.pageNum) > this.pageCurrent;
    },

    // 遥控器按键-上翻页
    loadPrevPage: function () {
        if (this.hasPrev()) {
            this.pageCurrent--;
            this.loadDataList('Show("center-box")');
            return true;
        }
    },

    // 遥控器按键-下翻页
    loadNextPage: function () {
        if (this.hasNext()) {
            this.pageCurrent++;
            this.loadDataList('Show("center-box")');
            return true;
        }
    },

    // 列表项焦点移动操作
    onBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case "left":
                if (current.id === "center") {
                    var currentId = LMEPG.BM.getSelectedButton(BtnAction.GROUP_NAME).id;
                    LMEPG.BM.requestFocus(currentId);
                }
                break;
            case "right":
                if (current.id.startWith("btn-")) {
                    G(current.id).style.color = "black";
                }
                break;
            case "up":
                if (current.id === "center") {
                    if (List.loadPrevPage()) {
                        return false;
                    }
                }
                break;
            case "down":
                if (current.id === "center") {
                    if (List.loadNextPage()) {
                        return false;
                    }
                }
                break;
        }
    },

};

/**
 * 检测类型面板按钮控制
 */
var BtnAction = {

    GROUP_NAME: "TypeButtons",

    onFocusChange: function (btn, hasFocus) {
        if (btn.id.startWith("btn-")) {
            if (hasFocus) {
                G(btn.id).style.color = "#ffffff";
                Show("s-box");

                var curSelectedNavBtn = LMEPG.BM.getSelectedButton(BtnAction.GROUP_NAME);
                if (!LMEPG.Func.isExist(curSelectedNavBtn) || curSelectedNavBtn.id !== btn.id) {
                    // 如果当前分类导航从刚选中，则加载其下的数据列表。否则，focused状态不重新加载，除非点击它！
                    List.refreshDataListBy(btn.cMeasureType);
                }

                LMEPG.BM.setSelected(btn.id, true);
            } else {
                Hide("s-box");
            }
        } else if (btn.id === "center") {
            if (hasFocus) {
                Show("center-box");
            } else {
                Hide("center-box");
            }
        }
    },

    onClick: function (btn) {
        if (btn.id.startWith("btn-")) {
            List.refreshDataListBy(btn.cMeasureType);
        }
    },
};

/**
 * 健康检测记录详情页面-控制入口类
 */
var HealthRecordDetail = {

    initButtons: function () {
        buttons.push({
            id: "center",
            name: "数据列表",
            type: "div",
            nextFocusLeft: "",
            nextFocusRight: "",
            nextFocusUp: "",
            nextFocusDown: "",
            backgroundImage: "",
            focusImage: "",
            click: "",
            focusChange: BtnAction.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
        });

        var allowedMeasureTypes = [
            Measure.Type.BLOOD_GLUCOSE,
            Measure.Type.CHOLESTERIN,
            Measure.Type.URIC_ACID,
        ];
        for (var i = 0; i < 3; i++) {
            buttons.push({
                id: "btn-" + (i + 1),
                name: "检测类型",
                type: "div",
                nextFocusLeft: "",
                nextFocusRight: "center",
                nextFocusUp: "btn-" + i,
                nextFocusDown: "btn-" + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/bg_button.png",
                focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/f_button.png",
                selectedImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/HealthTest/select_button.png",
                click: BtnAction.onClick,
                focusChange: BtnAction.onFocusChange,
                beforeMoveChange: List.onBeforeMoveChange,
                groupId: BtnAction.GROUP_NAME,
                cMeasureType: allowedMeasureTypes[i],
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

    },

    /**
     * 页面初始化唯一入口
     */
    init: function () {
        this.initData();
        this.initButtons();

        List.initOnce();
    },

};

function onBack() {
    LMEPG.Intent.back();
}

window.onload = function () {
    HealthRecordDetail.init();
};