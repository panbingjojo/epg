function onBack() {
    Page.onBack();
}

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("familyHome");
        currentPage.setParam("inquiryId", RenderParam.initInquiryID);
        return currentPage;
    },

    jumpThisPage: function () {
        var objCurrent = Page.getCurrentPage();
        LMEPG.Intent.jump(objCurrent, null);
    },

    /**
     * 跳转到添加成员
     */
    jumpMemberAdd: function (memberID) {
        var objCurrent = Page.getCurrentPage();
        var objMemberAdd = LMEPG.Intent.createIntent("familyMembersAdd");
        objMemberAdd.setParam("actionType", 1);
        objMemberAdd.setParam("memberID", memberID);
        LMEPG.Intent.jump(objMemberAdd, objCurrent);
    },

    /**
     * 跳转到编辑家庭成员
     */
    jumpMemberEdit: function (memberID) {
        var objCurrent = Page.getCurrentPage();
        var objMemberAdd = LMEPG.Intent.createIntent("familyMembersEditor");
        objMemberAdd.setParam("actionType", 1);
        objMemberAdd.setParam("memberID", memberID);
        LMEPG.Intent.jump(objMemberAdd, objCurrent);
    },

    jumpTestPage: function () {
        var objHome = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('testEntrySet');
        objDst.setParam('userId', RenderParam.userId);
        LMEPG.Intent.jump(objDst, objHome);
    },

    onBack: function () {
        LMEPG.Intent.back();
    },

    /**
     * 显示错误信息并退出
     * @param timeOut
     */
    showError: function (msg) {
        LMEPG.UI.showToast(msg, 10);
        setTimeout(function () {
            Page.onBack();
        }, 3000)
    },

};


var buttons = [];   // 定义全局按钮
var pageCurrent = 1;
var MAX_PER_PAGE = 5;
var pageNum = 0;
var fileIndex = g_appRootPath + "/Public/img/hd/Family/V10/";


/**
 *  初始化数据
 */
function initData() {
    var isSuccess = false;
    if (LMEPG.Func.isExist(RenderParam.memberInfo)) {
        var result = RenderParam.memberInfo.result;
        if (result == 0 || result == '0') {
            List.memberList = RenderParam.memberInfo.list ? RenderParam.memberInfo.list.reverse() : [];
            if (LMEPG.Func.isExist(List.memberList) && List.memberList.length > 0) {
                isSuccess = true;
            } else {
                //获取成功，但是还没有添加过任何家庭成员
                isSuccess = true;
            }
        } else {
            Page.showError("获取家庭成员信息失败，result：" + result);
        }
    } else {
        Page.showError("获取家庭成员信息失败");
    }
    return isSuccess;
}

/**
 * 初始化焦点按钮
 */
function initBottom() {

    for (var i = 0; i < MAX_PER_PAGE; i++) {
        buttons.push({
            id: 'btn-editor-' + (i + 1),
            name: '编辑按钮',
            type: 'div',
            nextFocusLeft: 'btn-editor-' + (i + 1 - 1),
            nextFocusRight: 'btn-editor-' + (i + 1 + 1),
            nextFocusUp: '',
            nextFocusDown: 'btn-delete-' + (i + 1),
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            cMemberItem: "",
            click: onBtnClick,
            focusChange: onRoleFocus,
            beforeMoveChange: onBeforeMoveChange,
            index: i,
        });
    }

    for (var i = 0; i < MAX_PER_PAGE; i++) {
        buttons.push({
            id: 'btn-delete-' + (i + 1),
            name: '删除按钮',
            type: 'div',
            nextFocusLeft: 'btn-delete-' + (i + 1 - 1),
            nextFocusRight: 'btn-delete-' + (i + 1 + 1),
            nextFocusUp: 'btn-editor-' + (i + 1),
            nextFocusDown: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            cMemberItem: "",
            click: onBtnClick,
            focusChange: onRoleFocus,
            beforeMoveChange: onBeforeMoveChange,
            index: i,
        });
    }
}

/**
 *  按钮点击事件
 */
function onBtnClick(btn) {
    var memberId;
    var memberItem;
    var chooseIndex = btn.index + (pageCurrent - 1) * MAX_PER_PAGE;
    if (chooseIndex > -1 && chooseIndex < List.memberList.length) {
        memberItem = List.memberList[chooseIndex];
        if (LMEPG.Func.isExist(memberItem)) {
            memberId = memberItem.member_id;
        }
    }

    if (btn.id.indexOf("editor") != -1) {
        //判断点击的是编辑按钮
        if (chooseIndex == List.memberList.length) {
            //判断点击的是最后一个添加家庭成员按钮
            Page.jumpMemberAdd();
        } else {
            Page.jumpMemberEdit(memberId);
        }

    } else if (btn.id.indexOf("delete") != -1) {
        //判断点击的是删除按钮
        LMEPG.UI.commonDialog.show("删除该家庭成员，将同时删除其检测及问诊记录，确定删除该家庭成员？", ['确定', '取消'], function (index) {
            if (index == 0) {
                delMember(memberId);
            }
            return false;
        });

    } else {
        LMEPG.UI.showToast("没有判断出点击的是什么按钮");
    }
}

/**
 *  删除特定的家庭成员
 */
function delMember(memberId) {
    var postData = {
        "member_id": memberId
    };
    LMEPG.UI.showWaitingDialog();
    LMEPG.ajax.postAPI("Family/delMember", postData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {
                if (data.result == 0) {
                    // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                    LMEPG.KeyEventManager.setAllowFlag(false);
                    LMEPG.UI.showToast("删除成功！", undefined, function () {
                        Page.jumpThisPage();
                    });
                } else {
                    LMEPG.UI.showToast("删除失败！" + data.result);
                }
            } else {
                LMEPG.UI.showToast("删除失败！");
            }

        } catch (e) {
            LMEPG.UI.showToast("删除异常！");
        }
    }, function () {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast("删除异常！");
    });
}

/**
 *  焦点改变事件
 */
function onRoleFocus(btn, hasFocus) {
    if (hasFocus) {
        LMEPG.CssManager.addClass(btn.id, "btn-hover");
    } else {
        LMEPG.CssManager.removeClass(btn.id, "btn-hover");
    }
}

/**
 * 按键移动前事件
 */
function onBeforeMoveChange(direction, current) {
    var currentIndex = current.index + (pageCurrent - 1) * MAX_PER_PAGE;
    switch (direction) {
        case "right":
            if (current.id == "btn-editor-5" || current.id == "btn-delete-5") {
                List.nextMenu();
                return false;
            }

            if (current.id.indexOf("delete") != -1 && currentIndex == (List.memberList.length - 1)) {
                LMEPG.BM.requestFocus('btn-editor-' + (current.index + 2));
                return false;
            }
            break;
        case "left":
            if (current.id == "btn-editor-1" || current.id == "btn-delete-1") {
                List.preMenu();
                return false;
            }
            break;
        case "down":
            if (currentIndex == List.memberList.length) {
                LMEPG.BM.requestFocus('btn-delete-' + current.index);
                return false;
            }
            break;
    }
}

var List = {

    memberList: "",

    // 创建菜单
    createMenu: function () {
        var tab_list = document.getElementById("float_block");//数据块
        var strTable = '';
        pageNum = Math.ceil((List.memberList.length + 1) / MAX_PER_PAGE);
        var start = (pageCurrent - 1) * MAX_PER_PAGE;//数组截取起始位置
        var end = pageCurrent * MAX_PER_PAGE;//数组截取终止位置

        var newArr = List.memberList.slice(start, end);
        tab_list.innerHTML = "";
        for (var i = 0; i < (newArr.length); i++) {
            var imgUrl = fileIndex + "icon_member_" + newArr[i].member_image_id + ".png";
            strTable += '<div  class="role">';
            strTable += '<img  src="' + imgUrl + '"/> ';
            strTable += '<p class="inline-title">' + newArr[i].member_name + '</p>';
            strTable += '<p class="inline-title"><div  id="btn-editor-' + (i + 1) + '" class="edd-btn btn-bg">编辑</div></p>';
            strTable += '<p class="inline-title"><div id="btn-delete-' + (i + 1) + '" class="edd-btn btn-bg">删除</div></p>';
            strTable += '</div>';
        }
        if ((pageCurrent == pageNum) && (List.memberList.length < 8)) {
            //最后一页最后一个是添加按钮
            var imgUrl = fileIndex + "icon_member_0.png";
            strTable += '<div  class="role">';
            strTable += '<img  src="' + imgUrl + '"/> ';
            strTable += '<p class="inline-title">&nbsp;&nbsp;&nbsp;&nbsp;</p>';
            strTable += '<p class="inline-title"><div  id="btn-editor-' + (i + 1) + '" class="edd-btn btn-bg">添加</div></p>';
            strTable += '<p class="inline-title"><div  class="edd-btn" style="padding: 30px 40px">&nbsp;&nbsp;&nbsp;&nbsp;</div></p>';
            strTable += '</div>';
        }

        tab_list.innerHTML = strTable;


        var page_right = document.getElementById("arrow_right");
        var page_left = document.getElementById("arrow_left");
        page_right.style.display = "none";
        page_left.style.display = "none";

        if (pageCurrent < pageNum) {
            page_right.style.display = "block";

        }
        if (pageCurrent > 1) {
            page_left.style.display = "block";

        }
    },

    preMenu: function () {  //遥控器左按键翻页
        if (pageCurrent > 1) {
            pageCurrent--;
            List.createMenu();
            LMEPG.ButtonManager.requestFocus("btn-editor-5");
        }
    },

    nextMenu: function () {

        if (pageCurrent < pageNum) {
            pageCurrent++;
            List.createMenu();
            LMEPG.ButtonManager.requestFocus("btn-editor-1");
        }
    },

};

window.onload = function () {

    try {
        RenderParam.memberInfo = JSON.parse(RenderParam.memberInfo);
    } catch (e) {
        console.error(e);
    }

    if (initData()) {
        List.createMenu(); //初始化页面
        initBottom(); //初始化焦点按钮
        LMEPG.ButtonManager.init("btn-editor-1", buttons, "", true);
    }
    LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], Page.jumpTestPage);
};
