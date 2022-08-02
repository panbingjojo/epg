// 定义全局按钮
var buttons = [];

var InitData = {
    memberArray: [],
    CurrentIndexOfMemberArray: 0,  //当前家庭成员memberArray数组的索引
};

function onBack() {
    LMEPG.Intent.back();
}


//修改家庭成員信息，修改跟添加使用同一個接口
function addMember() {

    var itemMember = InitData.memberArray[0];
    LMEPG.UI.showWaitingDialog("");

    var age = G("parameter_2").innerHTML;
    var weight = G("parameter_4").innerHTML;
    var height = G("parameter_3").innerHTML;
    var postData = {
        "member_id": itemMember.member_id,
        "member_name": itemMember.member_name,
        "member_age": age,
        "member_gender": itemMember.member_gender,
        "member_height": height,
        "member_weight": weight,
        "member_image_id": itemMember.member_image_id
    };

    LMEPG.ajax.postAPI("Family/addMember", postData, function (rsp) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data instanceof Object) {
                if (data.result == 0) {
                    // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                    LMEPG.KeyEventManager.setAllowFlag(false);
                    LMEPG.UI.showToast("修改成功！", 1.5, function () {
                        onBack();
                    });
                } else {
                    LMEPG.UI.showToast("修改失败！:" + data.result);
                }
            } else {
                LMEPG.UI.showToast("修改失败！");
            }
        } catch (e) {
            LMEPG.UI.showToast("修改异常！");
        }
    }, function () {
        LMEPG.UI.dismissWaitingDialog();
        LMEPG.UI.showToast("修改异常！");
    });

}

/**
 * 删除家庭成员信息,暂时不需要
 */
function delMember() {
    function confirm_delete_member() {
        var itemMember = InitData.memberArray[0];
        var postData = {
            "member_id": itemMember.member_id
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
                        LMEPG.UI.showToast("删除成功！", 1.5, function () {
                            onBack();
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

    LMEPG.UI.commonDialog.show("删除该家庭成员，将同时删除其检测及问诊记录，确定删除？", ["确定", "取消"], function (index) {
        if (index === 0) {
            confirm_delete_member();
        }
    });

}

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("familyMembersEditor");
        return currentPage;
    },

    /**
     * 跳转到home页面
     */
    jumpHomeTab: function (tabName) {
        var objCurrent = Page.getCurrentPage(); //得到当前页

        var objHome = LMEPG.Intent.createIntent(tabName);
        objHome.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },
}

var numInit = 0;
var PageStart = {
    // 初始化底部导航栏按钮
    initBottom: function () {
        //    工具栏
        for (var i = 0; i < 4; i++) {
            buttons.push({
                id: 'parameter_' + (i + 1),
                name: '选项4',
                type: 'img',
                nextFocusLeft: 'parameter_' + (i + 1 - 1),
                nextFocusRight: 'parameter_' + (i + 1 + 1),
                nextFocusUp: '',
                nextFocusDown: '',
                click: PageStart.onBtnClick,
                focusChange: PageStart.onBtnFocus,
                beforeMoveChange: PageStart.onBeforeMoveChange,
            });
        }
        buttons.push({
            id: 'parameter_5',
            name: '选项5',
            type: 'div',
            nextFocusLeft: 'parameter_4',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: PageStart.onBtnClick,
            focusChange: PageStart.onBtnFocus,
            beforeMoveChange: PageStart.onBeforeMoveChange
        })

    },

    onBtnClick: function (btn) {
        if (btn.id === "parameter_5") {
            addMember();
        }
    },

    // 焦点效果
    onBtnFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if (btn.id == "parameter_5") {
                LMEPG.CssManager.addClass(btn.id, "btn-hover");
            } else {
                LMEPG.CssManager.addClass(btn.id, "parameter_focus");
            }
        } else {
            if (btn.id == "parameter_5") {
                LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            } else {
                LMEPG.CssManager.removeClass(btn.id, "parameter_focus");
            }
        }
    },
    onBeforeMoveChange: function (direction, current) { //翻页
        switch (direction) {
            case "up":
                if (current.id == "parameter_1") {
                    numInit--;
                    if (numInit < 0) {
                        numInit = roleData.length - 1;
                    }
                    PageStart.initRole(numInit);
                } else if (current.id == "parameter_2") {
                    PageStart.upType(1, 100, "parameter_2");
                } else if (current.id == "parameter_3") {
                    PageStart.upType(30, 260, "parameter_3");
                } else if (current.id == "parameter_4") {
                    PageStart.upType(1, 300, "parameter_4");
                }
                break;
            case "down":
                if (current.id == "parameter_1") {
                    numInit++;
                    if (numInit > roleData.length - 1) {
                        numInit = 0;
                    }
                    PageStart.initRole(numInit);
                } else if (current.id == "parameter_2") {
                    PageStart.downType(1, 100, "parameter_2");
                } else if (current.id == "parameter_3") {
                    PageStart.downType(30, 260, "parameter_3");
                } else if (current.id == "parameter_4") {
                    PageStart.downType(1, 300, "parameter_4");
                }
                break;
            case "left":
                if (current.id == "parameter_2") {
                    return false;
                }
                break;
        }
    },
    initRole: function () {
        //家庭成员姓名设置
        var eleMemberName2 = G("parameter_1");
        //家庭成员年龄设置
        var eleMemberAge1 = G("parameter_2_pre");
        var eleMemberAge2 = G("parameter_2");
        var eleMemberAge3 = G("parameter_2_next");
        //家庭成员身高设置
        var eleMemberHeight1 = G("parameter_3_pre");
        var eleMemberHeight2 = G("parameter_3");
        var eleMemberHeight3 = G("parameter_3_next");
        //家庭成员体重设置
        var eleMemberWeight1 = G("parameter_4_pre");
        var eleMemberWeight2 = G("parameter_4");
        var eleMemberWeight3 = G("parameter_4_next");

        var itemMember = InitData.memberArray[0];

        eleMemberName2.innerHTML = itemMember.member_name;

        eleMemberAge1.innerHTML = parseInt(itemMember.member_age) - 1;
        eleMemberAge2.innerHTML = parseInt(itemMember.member_age);
        eleMemberAge3.innerHTML = parseInt(itemMember.member_age) + 1;

        eleMemberHeight1.innerHTML = parseInt(itemMember.member_height) - 1;
        eleMemberHeight2.innerHTML = parseInt(itemMember.member_height);
        eleMemberHeight3.innerHTML = parseInt(itemMember.member_height) + 1;

        eleMemberWeight1.innerHTML = parseFloat(itemMember.member_weight) - 0.5;
        eleMemberWeight2.innerHTML = parseFloat(itemMember.member_weight);
        eleMemberWeight3.innerHTML = parseFloat(itemMember.member_weight) + 0.5;
        G("photo").src = g_appRootPath + "/Public/img/hd/Family/V10/icon_member_" + itemMember.member_image_id + ".png";
    },
    upType: function (min, max, type) {
        var num1 = parseFloat(G(type + "_pre").innerHTML);
        var num2 = parseFloat(G(type).innerHTML);
        G(type).innerHTML = "" + num1;
        G(type + "_next").innerHTML = "" + num2;
        if (type + "_pre" == "parameter_4_pre") {
            G(type + "_pre").innerHTML = "" + ((num1 - 0.5 < min) ? max : num1 - 0.5);
        } else {
            G(type + "_pre").innerHTML = "" + ((num1 - 1 < min) ? max : num1 - 1);
        }
    },
    downType: function (min, max, type) {
        var num1 = parseFloat(G(type + "_next").innerHTML);
        var num2 = parseFloat(G(type).innerHTML);
        G(type + "_pre").innerHTML = "" + num2;
        G(type).innerHTML = "" + num1;
        if (type + "_next" == "parameter_4_next") {
            G(type + "_next").innerHTML = "" + ((num1 + 0.5 > max) ? min : num1 + 0.5);
        } else {
            G(type + "_next").innerHTML = "" + ((num1 + 1 > max) ? min : num1 + 1);
        }
    },

    init: function () {
        try {
            InitData.memberArray = JSON.parse(RenderParam.memberList);
        } catch (e) {
        }
        PageStart.initBottom();
        PageStart.initRole();
        LMEPG.ButtonManager.init("parameter_2", buttons, "", true);
    }
};

window.onload = function () {
    PageStart.init();
};
