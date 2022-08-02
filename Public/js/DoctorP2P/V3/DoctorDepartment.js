<!--事件回调处理 -->
var departmentList = [];

/**
 * 点击事件回调
 * @param btn
 */
function onClick(btn) {
    jumpDoctorList(btn.cDeptId,btn.cIdx);
}

/**
 * 焦点改变事件回调
 * @param btn
 * @param hasFocus
 */
function onFocusChange(btn, hasFocus) {
    if (hasFocus) {
        LMEPG.UI.Marquee.start("", 5, 2, 50, "left", "scroll");
//                LMEPG.CssManager.removeClass(btn.id + '_text', 'unfocus_text_color');
//                LMEPG.CssManager.addClass(btn.id + '_text', 'focus_text_color');
//                LMEPG.CssManager.removeClass(btn.id + '_text' + '_marquee', 'unfocus_text_color');
//                LMEPG.CssManager.addClass(btn.id + '_text' + '_marquee', 'focus_text_color');
    } else {
//                LMEPG.CssManager.removeClass(btn.id + '_text', 'focus_text_color');
//                LMEPG.CssManager.addClass(btn.id + '_text', 'unfocus_text_color');
//                LMEPG.CssManager.removeClass(btn.id + '_text' + '_marquee', 'focus_text_color');
//                LMEPG.CssManager.addClass(btn.id + '_text' + '_marquee', 'unfocus_text_color');
        LMEPG.UI.Marquee.stop();
    }
}

/**
 * 焦点移动前事件回调
 */
function onBeforeMoveChange(dir, current) {
    if (typeof current.cIdx !== 'undefined') {
        var currRowNum = Math.floor(current.cIdx / DEPT_MAX_COLUMNS);  // 当前行号， 从第0行开始算
        var currColumnsNum = current.cIdx % DEPT_MAX_COLUMNS;          // 当前列号，从第0列开始算
        var currRowCount = Math.ceil(currDeptList.length / (DEPT_MAX_COLUMNS)) // 当前总行数。
        var nextId = -1;
        if (dir === 'left') {
            if (currColumnsNum > 0) {
                nextId = currRowNum * DEPT_MAX_COLUMNS + currColumnsNum - 1;
            }
        } else if (dir === 'right') {
            if (currColumnsNum < DEPT_MAX_COLUMNS - 1) {
                nextId = currRowNum * DEPT_MAX_COLUMNS + currColumnsNum + 1;
            }
        } else if (dir == 'up') {
            if (currRowNum > 0) {
                nextId = (currRowNum - 1) * DEPT_MAX_COLUMNS + currColumnsNum;
            }
        } else if (dir == 'down') {
            if (currRowNum < currRowCount - 1) {
                nextId = (currRowNum + 1) * DEPT_MAX_COLUMNS + currColumnsNum;
                nextId = nextId < currDeptList.length ? nextId : currDeptList.length - 1;  //如果下一行填不满，焦点走到最后一个。
            }
        }

        if (nextId != -1) {
            LMEPG.ButtonManager.requestFocus('focus_dept_' + nextId);
        } else {
            //实现翻页
            if (dir == 'up') turnUp();
            if (dir == 'down') turnDown();
        }
    }
    return false
}

/**
 * 返回按键事件回调
 */
function onBack() {
    jumpBack();
}

function htmlBack() {
    onBack();
}

<!--动态创建科室选项元素-->
var DEPT_MAX_ROWS = 5;      // 最大科室行数
var DEPT_MAX_COLUMNS = 3;   // 最大科室列数
var buttons = [];
var currentPage = 1; //当前页码
var currDeptList = [];

/**
 * 创建科室列表元素
 */
function createDeptElements(deptList, focusIndex) {
    var deptContainer = G('dept_container');
    deptContainer.innerHTML = "";   // 清空装载科室的容器

    var deptBackgroundImage = LMEPG.App.getAppRootPath() + "/Public/img/hd/DoctorP2P/V3/bg_key.png";          // 焦点背景图
    var deptFocusImage = LMEPG.App.getAppRootPath() + "/Public/img/hd/DoctorP2P/V3/f_key.png";          // 焦点背景图

    var containerWidth = 680;   // 容器宽度 高清
    var containerHeight = 531;   // 容器高度 高清
    var focusWidth = 180;        // 科室按钮的 宽度
    var focusHeight = 67;        // 科室按钮的 高度
    var marginTop = 0;          // 第一个元素距离容器顶端的距离
    var marginLeft = 0;         // 第一个元素距离容器左边的距离
    var focusMarginLeft = 55;    // 元素之间的左间距
    var focusMarginTop = 30;     // 元素之间的右间距
    var deptTableClass = "position:" + "absolute;";
    deptTableClass += "left:0px;";
    deptTableClass += "top:0px;";
    deptTableClass += "width:" + containerWidth + "px;";
    deptTableClass += "height:" + containerHeight + "px;";

    var tableElement = '<div style="' + deptTableClass + '">';
    for (var i = 0; i < deptList.length; i++) {
        var currRowNum = Math.floor(i / DEPT_MAX_COLUMNS);  //从第0行开始算
        var currColumnsNum = i % DEPT_MAX_COLUMNS;          //从第0列开始算

        var focusDeptId = "focus_dept_" + i;   //科室按钮的焦点id

        // 计算按钮位置
        var left = focusWidth * currColumnsNum + marginLeft + (focusMarginLeft * currColumnsNum);
        var top = focusHeight * currRowNum + marginTop + (focusMarginTop * currRowNum);

        var deptItemClass = "position:" + "absolute; ";
        deptItemClass += "left:" + left + "px;";
        deptItemClass += "top:" + top + "px;";
        deptItemClass += "width:" + focusWidth + "px;";
        deptItemClass += "height:" + focusHeight + "px;";

        var deptElement = '<div style="' + deptItemClass + '">';
        deptElement += '<img id="' + focusDeptId + '"';
        deptElement += ' src="' + deptBackgroundImage + '">';
        deptElement += ' </img>';
        deptElement += '<div class="dept_text" ' + ' id="' + focusDeptId + '_text" ' + '>'
        deptElement += deptList[i].dept_name + '</div>';
        deptElement += '</div>'
        tableElement += deptElement;

        //初始化按钮属性
        var button = {
            id: focusDeptId,
            name: deptList[i].dept_name,
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            focusable: true,
            backgroundImage: deptBackgroundImage,
            focusImage: deptFocusImage,
            click: onClick,
            focusChange: onFocusChange,
            beforeMoveChange: onBeforeMoveChange,
            moveChange: "",
            cIdx: i,                          //本按钮自定义属性
            cDeptId: deptList[i].dept_id,     //本按钮自定义属性，将部门id 填到属性中，这样不需要取列表中查找，提高利率
        }
        buttons.push(button);
    }
    tableElement += '</div>';
    deptContainer.innerHTML = tableElement;

    LMEPG.ButtonManager.init('focus_dept_' + focusIndex, buttons, '', true);
}


/**
 * 向上翻页
 */
function turnUp() {
    if (currentPage <= 1) return;
    currentPage--;
    updateDeptView(0);
    updateArrows();
}

/**
 * 向下翻页
 */
function turnDown() {
    var pageCount = Math.ceil(departmentList.length / (DEPT_MAX_ROWS * DEPT_MAX_COLUMNS));
    if (currentPage >= pageCount) return;
    currentPage++
    updateDeptView(0);
    updateArrows();
}

/**
 * 更新指示箭头
 */
function updateArrows() {
    S('top_arrows');
    S('bottom_arrows');
    var pageCount = Math.ceil(departmentList.length / (DEPT_MAX_ROWS * DEPT_MAX_COLUMNS));

    if (currentPage <= 1) {
        H('top_arrows');
    }

    if (currentPage >= pageCount) {
        H('bottom_arrows');
    }
}

/**
 * 更新部门选择列表
 */
function updateDeptView(focusIndex) {
    if (currentPage < 1) return;
    var startPos = (currentPage - 1) * (DEPT_MAX_ROWS * DEPT_MAX_COLUMNS);
    var endPos = departmentList.length;
    if (endPos > startPos + (DEPT_MAX_ROWS * DEPT_MAX_COLUMNS)) {
        endPos = startPos + (DEPT_MAX_ROWS * DEPT_MAX_COLUMNS);
    }
    currDeptList = departmentList.slice(startPos, endPos);
    createDeptElements(currDeptList, focusIndex);
}

<!--页面跳转-->
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent("doctorDepartment");
    return objCurrent;
}

//返回上一级页面
function jumpBack() {
    LMEPG.Intent.back();
}

//选择完科室后，跳转到医生页
function jumpDoctorList(deptId,deptIndex) {
    var objCurrent = getCurrentPage();

    var objDoctorList = LMEPG.Intent.createIntent("doctorIndex");
    objDoctorList.setParam("focusId", "");
    objDoctorList.setParam("currentPage", 1);
    objDoctorList.setParam("deptId", deptId);
    objDoctorList.setParam("deptIndex", deptIndex);

    LMEPG.Intent.jump(objDoctorList, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
}

(function () {
    H('no_data');       //隐藏
    H('top_arrows');
    H('bottom_arrows');
})(); // 隐藏标签
(function () {
    departmentList = [];
    if (typeof RenderParam.departmentObj === "undefined" || RenderParam.departmentObj.code !== 0) {
        // 未获取到数据
        //S('no_data');       //隐藏
        //H('dept_container');
        departmentList.unshift({"dept_id": "全部科室", "dept_name": "全部科室", "dept_intro": "", "doc_count": "1000"})
    } else {
        departmentList = RenderParam.departmentObj.list;
        departmentList.unshift({"dept_id": "全部科室", "dept_name": "全部科室", "dept_intro": "", "doc_count": "1000"})
    }
})(); // 增加全部科室项
(function () {
    var index = 0; //如果没有找到，默认在第一个全部科室上
    for (var i = 0; i < departmentList.length; i++) {
        if (departmentList[i].dept_id == RenderParam.deptId) {
            index = i;
            break;
        }
    }
    currentPage = Math.ceil((index + 1) / (DEPT_MAX_ROWS * DEPT_MAX_COLUMNS));
    var startPos = (currentPage - 1) * (DEPT_MAX_ROWS * DEPT_MAX_COLUMNS);
    focusIndex = index - startPos > 0 ? index - startPos : 0;
})();

window.onload = function () {
    G('default_link').focus();
    updateDeptView(focusIndex);
    updateArrows();
};

