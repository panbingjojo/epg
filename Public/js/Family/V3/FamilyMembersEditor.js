
/**
 * 得到当前页对象
 */
function getCurrentPage() {
    return LMEPG.Intent.createIntent('familyMembersEditor');
}

/**
 * 页面跳转 - 增加家庭成员
 */
function jumpMemberEdit(actionType, memberID) {
    var objCurrent = getCurrentPage();

    var objMemberAdd = LMEPG.Intent.createIntent('familyMembersAdd');
    objMemberAdd.setParam('actionType', actionType);
    objMemberAdd.setParam('memberID', memberID);

    LMEPG.Intent.jump(objMemberAdd, objCurrent);
}

/** 按返回键 */
function onBack() {
    LMEPG.Intent.back();
}

var Action = {

    beforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                var nextFocusLeft = LMEPG.BM.getNearbyFocusButton('left');
                if (!nextFocusLeft) {
                    loadPrevPage();
                    return false;
                }
                break;
            case 'right':
                var nextFocusRight = LMEPG.BM.getNearbyFocusButton('right');
                if (nextFocusRight) {
                    // 若相邻右侧为“添加”按钮下方隐藏的“删除按钮”的话，则焦点跳转到“添加”按钮
                    if (nextFocusRight.action === ACTION_TYPE.DELETE && nextFocusRight.memberId == 0) {
                        var nextFocusRightUp = LMEPG.BM.getNearbyFocusButton('up', nextFocusRight.id);
                        if (nextFocusRightUp) LMEPG.BM.requestFocus(nextFocusRightUp.id);
                    } else {
                        LMEPG.BM.requestFocus(nextFocusRight.id);
                    }
                } else {
                    loadNextPage();
                }
                return false;
            case 'down':
                if (current.action === ACTION_TYPE.ADD) { // “添加”按钮下方没有显示按钮
                    LMEPG.BM.requestFocus(current.id);
                    return false;
                }
                break;
        }
    },

    onClick: function (btn) {
        switch (btn.action) {
            case ACTION_TYPE.ADD:
                jumpMemberEdit('1', btn.memberId);
                break;
            case ACTION_TYPE.EDIT:
                jumpMemberEdit('2', btn.memberId);
                break;
            case ACTION_TYPE.DELETE:
                currFocusBtnDel = btn;
                LMEPG.UI.commonDialog.show('删除该家庭成员，将同时删除其检测及问诊记录，确定删除该家庭成员？', ['确定', '取消'], function (btnIndex) {
                    if (btnIndex === 0) {
                        delMember(currFocusBtnDel.memberId);
                    }
                });
                break;
        }
    }
};

<!-- 页面使用常量 -->
var MAX_PER_PAGE = 5;           // 每页显示的成员数目

/** 按钮点击类型 */
var ACTION_TYPE = {
    ADD: 'add',          // 添加
    DELETE: 'delete',    // 编辑
    EDIT: 'edit',        // 删除
};

/** “添加”按钮 */
var initMemberAddItem = {
    'member_id': 0,
    'member_name': '添加',
    'member_age': 0,
    'member_gender': 0,
    'member_height': 0,
    'member_weight': 0,
    'member_image_id': 0
};


var eleArrowLeft = G('left_page');      // 上一页
var eleArrowRight = G('right_page');    // 下一页
var eleTableContent = G('content');     // 数据块

var pageCurrent = 1;    // 当前页码
var pageNum = 0;        // 总页数

var memberArray = [];

var currFocusBtnDel;    // 当获得焦点的“删除”按钮id
var buttons = [];       // 当前页面所有按钮


function init() {
    try {
        memberArray = JSON.parse(RenderParam.initMember);
        memberArray.reverse();
        pageCurrent = 1;
        createHtml();
    } catch (e) {
    }
}

function createHtml() {
    if (memberArray.length > 0) {
        if (memberArray.length < 8) {
            var index = memberArray.length - 1;
            var lastMemberID = memberArray[index].member_id;
            if (parseInt(lastMemberID) != 0) {
                memberArray.push(initMemberAddItem);
            }
        }
    } else {
        memberArray.push(initMemberAddItem);
    }

    pageNum = Math.ceil(memberArray.length / MAX_PER_PAGE);

    var start = (pageCurrent - 1) * MAX_PER_PAGE;//数组截取起始位置
    var end = pageCurrent * MAX_PER_PAGE;//数组截取终止位置

    var tableStr = '';
    eleTableContent.innerHTML = '';

    // 设置翻页箭头
    eleArrowLeft.style.display = pageCurrent > 1 ? 'block' : 'none';
    eleArrowRight.style.display = pageCurrent < pageNum ? 'block' : 'none';

    var initCol = 0;
    var newArr = memberArray.slice(start, end);
    buttons.length = 0; // 清空旧数据
    for (var i = 0; i < newArr.length; i++) {
        initCol++;

        var isAddBtn = newArr[i].member_image_id == 0; // 是否为自定义的“添加”按钮

        var btn1 = 'focus-1-' + initCol; // 第1行按钮id
        var btn2 = 'focus-2-' + initCol; // 第2行按钮id

        // btn1对应“左/上/右/下”按钮id
        var btn1NextFocusLeft = initCol > 1 ? 'focus-1-' + (initCol - 1) : '';
        var btn1NextFocusRight = initCol < MAX_PER_PAGE ? 'focus-1-' + (initCol + 1) : '';
        var btn1NextFocusDown = 'focus-2-' + initCol;

        // btn2对应“左/上/右/下”按钮id
        var btn2NextFocusLeft = initCol > 1 ? 'focus-2-' + (initCol - 1) : '';
        var btn2NextFocusRight = initCol < MAX_PER_PAGE ? 'focus-2-' + (initCol + 1) : '';
        var btn2NextFocusUp = 'focus-1-' + initCol;

        if (isAddBtn) {
            tableStr += '<div class="role"> ' +
                '<img class="head_img"  src="' + g_appRootPath + '/Public/img/hd/Doctor/V1/famliy_role_add.png" alt=""/> ' +
                '<div class="introduce" ></div> ' +
                '<div id="' + btn1 + '" class="btn">添加</div>' +
                '<div id="' + btn2 + '" class="none">删除</div>' +
                '</div>';
        } else {
            tableStr += '<div class="role">' +
                '<img class="head_img" src="' + g_appRootPath + '/Public/img/hd/Doctor/V1/famliy_role' + newArr[i].member_image_id + '.png" alt=""/> ' +
                '<div class="introduce" >' + newArr[i].member_name + '</div>' +
                '<div id="' + btn1 + '" class="btn">编辑</div>' +
                '<div id="' + btn2 + '" class="btn">删除</div>' +
                '</div>';
        }

        var itemButtons =
            [
                {
                    id: btn1,
                    name: isAddBtn ? '添加' : '编辑',
                    type: 'div',
                    focusable: true,
                    backgroundImage: g_appRootPath + '/Public/img/hd/Doctor/V1/btn_out.png',
                    focusImage: g_appRootPath + '/Public/img/hd/Doctor/V1/btn_in.png',
                    nextFocusLeft: btn1NextFocusLeft,
                    nextFocusUp: '',
                    nextFocusRight: btn1NextFocusRight,
                    nextFocusDown: btn1NextFocusDown,
                    beforeMoveChange: Action.beforeMoveChange,
                    click: Action.onClick,
                    action: isAddBtn ? ACTION_TYPE.ADD : ACTION_TYPE.EDIT,
                    memberId: newArr[i].member_id
                },
                {
                    id: btn2,
                    name: '删除',
                    type: 'div',
                    focusable: true,
                    backgroundImage: g_appRootPath + '/Public/img/hd/Doctor/V1/btn_out.png',
                    focusImage: g_appRootPath + '/Public/img/hd/Doctor/V1/btn_in.png',
                    nextFocusLeft: btn2NextFocusLeft,
                    nextFocusUp: btn2NextFocusUp,
                    nextFocusRight: btn2NextFocusRight,
                    nextFocusDown: '',
                    beforeMoveChange: Action.beforeMoveChange,
                    click: Action.onClick,
                    action: ACTION_TYPE.DELETE,
                    memberId: newArr[i].member_id
                }
            ];
        buttons.push(itemButtons[0], itemButtons[1]);
    }
    eleTableContent.innerHTML = tableStr;
    LMEPG.BM.init('focus-1-1', buttons, '', true);
}

function loadNextPage() {
    if (pageCurrent < pageNum) {
        pageCurrent++;
        createHtml();
        LMEPG.BM.requestFocus('focus-1-1');
    }
}

function loadPrevPage() {
    if (pageCurrent > 1) {
        pageCurrent--;
        createHtml();
        LMEPG.BM.requestFocus('focus-1-' + MAX_PER_PAGE);
    }
}

/**
 * 删除家庭成员信息
 * @param memberID 家庭成员id
 */
function delMember(memberID) {
    LMEPG.UI.showWaitingDialog();
    var postData = {
        'member_id': memberID
    };
    LMEPG.ajax.postAPI('Family/delMember', postData, function (rsp) {
        try {
            LMEPG.UI.dismissWaitingDialog();
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {
                if (data.result == 0) {
                    for (var index in memberArray) {
                        if (memberArray[index].member_id == memberID) {
                            memberArray.splice(index, 1);
                            createHtml();
                            break;
                        }
                    }
                    LMEPG.UI.showToast('删除成功');
                } else {
                    LMEPG.UI.showToast('删除失败：' + data.result);
                    LMEPG.BM.requestFocus(currFocusBtnDel.id);
                }
            } else {
                LMEPG.UI.showToast('删除失败');
                LMEPG.BM.requestFocus(currFocusBtnDel.id);
            }

        } catch (e) {
            LMEPG.UI.showToast('删除异常');
            LMEPG.BM.requestFocus(currFocusBtnDel.id);
        }
    }, function () {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast('删除异常');
        LMEPG.BM.requestFocus(currFocusBtnDel.id);
    });

}
