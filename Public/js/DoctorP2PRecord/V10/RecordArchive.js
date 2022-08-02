var InitData = {
    memberWebStr: RenderParam.member,
    initInquiryID: RenderParam.inquiryID,
    memberArray: [],
    initMemberAddItem: {
        "member_id": 0,
        "member_name": "添加",
        "member_age": 0,
        "member_gender": 0,
        "member_height": 0,
        "member_weight": 0,
        "member_image_id": 0
    }
};

var buttons = [];   // 定义全局按钮
var pageCurrent = 1;
var MAX_PER_PAGE = 4;
var pageNum = 0;
var fileIndex = g_appRootPath + "/Public/img/hd/Family/V10/";

function onBack() {
    LMEPG.Intent.back();
}


function initData() {
    try {
        var memberJson = JSON.parse(InitData.memberWebStr);
        if (memberJson.result == 0) {
            InitData.memberArray = memberJson.list;
            InitData.memberArray.reverse();
            pageCurrent = 1;
            if (InitData.memberArray.length > 0) {
                if (InitData.memberArray.length < 8) {
                    var index = InitData.memberArray.length - 1;
                    var lastMemberID = InitData.memberArray[index].member_id;
                    if (parseInt(lastMemberID) !== 0) {
                        InitData.memberArray.push(InitData.initMemberAddItem);
                    }
                }
            } else {
                InitData.memberArray.push(InitData.initMemberAddItem);
            }
            List.createMenu();
            LMEPG.ButtonManager.init("role_1", buttons, "", true);
        } else {
            LMEPG.UI.showToast("加载家庭成员失败:" + memberJson.result);
        }
    } catch (e) {
        console.log("--------exception--------" + e.toString());
    }
}

/** 归档用户的信息 */
function archiveRecord(memberID) {
    var reqData = {
        "member_id": memberID,
        "inquiry_id": InitData.initInquiryID
    };
    LMEPG.UI.showWaitingDialog();
    LMEPG.ajax.postAPI('Doctor/setArchiveRecord', reqData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {
                if (data.result == 0) {
                    // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                    LMEPG.KeyEventManager.setAllowFlag(false);
                    LMEPG.UI.showToast("归档成功", 1.5, function () {
                        onBack();
                    });
                } else {
                    LMEPG.UI.showToast("归档失败:" + data.result);
                }
            } else {
                LMEPG.UI.showToast("归档失败");
            }

        } catch (e) {
            LMEPG.UI.showToast("归档失败，解析异常！");
            console.log("--->" + e.toString());
        }
    }, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast("归档失败请求失败！");
    });

}

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("recordArchive");
        currentPage.setParam("inquiryID", InitData.initInquiryID);
        return currentPage;
    },
    archiveInquiryToMember: function (btn) {
        var memberId = btn.cMemberItem.member_id;
        switch (memberId) {
            case 0:                     // 添加成员
                Page.jumpMemberAdd(memberId);
                break;
            default:                    // 选中成员归档
                archiveRecord(memberId);
                break;
        }

    },
    jumpMemberAdd: function (memberID) {
        var objCurrent = Page.getCurrentPage();
        var objMemberAdd = LMEPG.Intent.createIntent("familyMembersAdd");
        objMemberAdd.setParam("actionType", 1);
        objMemberAdd.setParam("memberID", memberID);
        LMEPG.Intent.jump(objMemberAdd, objCurrent);
    }

};

var List = {
    // 创建菜单
    createMenu: function () {
        var tab_list = G("float_block");//数据块
        var strTable = '';
        pageNum = Math.ceil(InitData.memberArray.length / MAX_PER_PAGE);
        var start = (pageCurrent - 1) * MAX_PER_PAGE;//数组截取起始位置
        var end = pageCurrent * MAX_PER_PAGE;//数组截取终止位置

        var newArr = InitData.memberArray.slice(start, end);
        tab_list.innerHTML = "";
        for (var i = 0; i < newArr.length; i++) {
            buttons[i].cMemberItem = newArr[i];
            var imgUrl = fileIndex + "icon_member_" + newArr[i].member_image_id + ".png";
            strTable += ' <div  class="role">';
            strTable += '<img id="role_' + (i + 1) + '"  src="' + imgUrl + '"/> ';
            strTable += '<p>' + newArr[i].member_name + '</p>';
            strTable += '</div>';
            var backgroundImage = g_appRootPath + '/Public/img/hd/Family/V10/icon_member_' + newArr[i].member_image_id + '.png';
            var focusImage = g_appRootPath + '/Public/img/hd/Family/V10/icon_member_' + newArr[i].member_image_id + '_s.png';

            buttons[i].backgroundImage = backgroundImage;
            buttons[i].focusImage = focusImage;
        }


        tab_list.innerHTML = strTable;

        if (pageCurrent < pageNum) {
            Show("arrow_right");
        } else {
            Hide("arrow_right");
        }
        if (pageCurrent > 1) {
            Show("arrow_left");
        } else {
            Hide("arrow_left");
        }
    },

    preMenu: function () {  //遥控器左按键翻页
        if (pageCurrent > 1) {
            pageCurrent--;
            List.createMenu();
            LMEPG.ButtonManager.requestFocus("role_4");
        }
    },

    nextMenu: function () {

        if (pageCurrent < pageNum) {
            pageCurrent++;
            List.createMenu();
            LMEPG.ButtonManager.requestFocus("role_1");
        }
    },

};

var PageStart = {
    // 初始化底部导航栏按钮
    initBottom: function () {

        for (var i = 0; i < 4; i++) {
            buttons.push({
                id: 'role_' + (i + 1),
                name: '选项4',
                type: 'img',
                nextFocusLeft: 'role_' + (i + 1 - 1),
                nextFocusRight: 'role_' + (i + 1 + 1),
                nextFocusUp: '',
                nextFocusDown: '',
                cMemberItem: "",
                click: Page.archiveInquiryToMember,
                focusChange: PageStart.onRoleFocus,
                beforeMoveChange: PageStart.onBeforeMoveChange,
            });
        }
    },
    //    工具栏焦点效果
    onRoleFocus: function (btn, hasFocus) {
        if (hasFocus) {

        } else {

        }
    },
    onBeforeMoveChange: function (direction, current) {
        //翻页
        switch (direction) {
            case "right":
                if (current.id == "role_4") {
                    List.nextMenu();
                    return false;
                }
                break;
            case "left":
                if (current.id == "role_1") {
                    List.preMenu();
                    return false;
                }
                break;
        }
    },
    init: function () {
        List.createMenu();
        PageStart.initBottom();       // 初始化底部导航栏按钮
        initData();
    }
};

window.onload = function () {
    PageStart.init();
    initData();
};
