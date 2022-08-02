var ALL_DEPARTMENT = {"dept_id": "", "dept_name": "全部科室"}; // 全部科室json对象

var DEPARTMENT_ITEM_PREFIX = 'department-item-'; // 科室id名称前缀

var DEPARTMENT_NAME_LIMIT_LENGTH = 4; // 科室名称显示最大长度

var SHOW_DEPARTMENT_ONE_ROW = 4; // 单行显示的科室个数

/** 科室列表页面逻辑 */
var departmentView = {

    buttons: [], // 与用户交互的焦点

    /**
     * 渲染科室列表
     */
    renderDepartmentList: function () {
        var _html = '<div id="department-list" >';
        var _buttons = [];
        var defaultFocusId = DEPARTMENT_ITEM_PREFIX + '0';

        var length = departmentController.departmentList.length;
        // 循环遍历数组
        for (var i = 0; i < length; i++) {
            // 取出指定项
            var departmentItem = departmentController.departmentList[i];
            // 科室id
            var departmentId = departmentItem.dept_id;
            // 科室名称
            var departmentName = departmentItem.dept_name;
            // 拼接html
            _html += '<div id="'+ DEPARTMENT_ITEM_PREFIX + i + '"  data-index="'+ i + '" data-name="' + departmentName + '" data-id="' + departmentId + '" class="department-item department-item-bg">' + LMEPG.Func.substrByOmit(departmentName, DEPARTMENT_NAME_LIMIT_LENGTH) + '</div>';

            // 初始化对象
            _buttons.push({
                id: DEPARTMENT_ITEM_PREFIX + i,
                name: '科室',
                type: 'div',
                nextFocusLeft: DEPARTMENT_ITEM_PREFIX + (i % SHOW_DEPARTMENT_ONE_ROW === 0 ? '' : (i - 1)),
                nextFocusRight: DEPARTMENT_ITEM_PREFIX + ((i + 1) % SHOW_DEPARTMENT_ONE_ROW === 0 ? '' : (i + 1)),
                nextFocusUp: DEPARTMENT_ITEM_PREFIX + (i - SHOW_DEPARTMENT_ONE_ROW),
                nextFocusDown: i + SHOW_DEPARTMENT_ONE_ROW >= length ? DEPARTMENT_ITEM_PREFIX + (length - 1) : DEPARTMENT_ITEM_PREFIX + (i + SHOW_DEPARTMENT_ONE_ROW),
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
                click: departmentController.onClickDepartmentItem,
                focusChange: departmentView.onDepartmentItemFocusChange,
                departmentId: departmentId,
                departmentName: departmentName,
                departmentIndex: i, // 记录当前科室ID，获取医生列表的时候需要该字段，后端数据接口缓存优化时调整
            });

            // 确定默认焦点
            if (RenderParam.departmentId === departmentId) {
                defaultFocusId = DEPARTMENT_ITEM_PREFIX + i;
            }
        }
        _html += '</div>';

        // 添加页面结构
        G('department-container').innerHTML = _html;

        // 添加焦点方案
        LMEPG.ButtonManager.addButtons(_buttons);
        LMEPG.ButtonManager.requestFocus(defaultFocusId);
    },

    /**
     * 科室项焦点改变事件监听
     * @param button 具体某个科室项
     * @param hasFocus 是否改变焦点
     */
    onDepartmentItemFocusChange: function (button, hasFocus) {
        var departmentElement = G(button.id);
        var departmentName = button.departmentName;
        if (hasFocus) {
            LMEPG.Func.marquee3(departmentElement, departmentName, DEPARTMENT_NAME_LIMIT_LENGTH, 3);
        } else {
            LMEPG.Func.marquee3(departmentElement);
            departmentElement.innerHTML = LMEPG.Func.substrByOmit(departmentName, DEPARTMENT_NAME_LIMIT_LENGTH);
        }
    },
};

/** 科室列表控制逻辑 */
var departmentController = {

    departmentList: [], // 科室列表

    /**
     * 初始化逻辑
     */
    init: function () {
        // 获取科室列表
        LMEPG.Inquiry.p2pApi.getDepartmentList(departmentController.getDepartmentListSuccess);
        // 初始化焦点方案
        LMEPG.ButtonManager.init('', departmentView.buttons, '', true);
    },

    /**
     * 获取科室列表数据处理函数
     * @param departmentListData 医生列表数据
     */
    getDepartmentListSuccess: function (departmentListData) {
        // 前端自动添加全部科室选项
        departmentListData.list.unshift(ALL_DEPARTMENT);
        // 缓存数据
        departmentController.departmentList = departmentListData.list;
        // 渲染列表数据
        departmentView.renderDepartmentList();
    },

    /**
     * 科室项点击事件
     * @param button 科室项
     */
    onClickDepartmentItem: function (button) {
        var departmentIntent = LMEPG.Intent.createIntent("doctorDepartment");
        var doctorListIntent = LMEPG.Intent.createIntent("doctorIndex");
        doctorListIntent.setParam("departmentId", button.departmentId);
        doctorListIntent.setParam("departmentName", button.departmentName);
        doctorListIntent.setParam("departmentIndex", button.departmentIndex);
        LMEPG.Intent.jump(doctorListIntent, departmentIntent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
};

function onBack() {
    LMEPG.Intent.back();
}