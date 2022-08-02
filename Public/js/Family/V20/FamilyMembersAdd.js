// 定义全局按钮
var buttons = [];

var InitData = {
    memberArray: [],
    CurrentIndexOfMemberArray: 0  //当前家庭成员memberArray数组的索引
};

function onBack() {
    LMEPG.Intent.back();
}


var BtnClick = {
    addMember: function (btn) {
        // 只有点击最后一个按钮“提交 ”才执行点击提交操作
        if (btn.id !== "parameter_5") {
            return;
        }

        var itemMember = InitData.memberArray[InitData.CurrentIndexOfMemberArray];
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
                        // 延迟处理，避免showToastV2未渲染出背景图仅显示出提示文本就执行onBack了。
                        LMEPG.KeyEventManager.setAllowFlag(false);
                        LMEPG.UI.showToastV2("添加成功！", 1.5, function () {
                            onBack();
                        });
                    } else {
                        LMEPG.UI.showToastV2("添加失败！" + data.result);
                    }
                } else {
                    LMEPG.UI.showToastV2("添加失败！");
                }
            } catch (e) {
                LMEPG.UI.showToastV2("添加异常！");
            }
        }, function () {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToastV2("添加异常！");
        });

    }

};

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("familyMembersAdd");
        return currentPage;
    },

    /**
     * 跳转到home页面
     */
    jumpFamilyTab: function (memberId) {
        var objCurrent = Page.getCurrentPage(); //得到当前页

        var objHome = LMEPG.Intent.createIntent("familyHome");
        objHome.setParam("memberID", memberId);
        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
};


var PageStart = {
    // 初始化按钮
    initBottom: function () {
        for (var i = 0; i < 4; i++) {
            buttons.push({
                id: 'parameter_' + (i + 1),
                name: '选项4',
                type: 'img',
                nextFocusLeft: 'parameter_' + (i + 1 - 1),
                nextFocusRight: 'parameter_' + (i + 1 + 1),
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/DrugInquiry/bg_key.png',
                focusImage: g_appRootPath + '/Public/img/hd/DrugInquiry/f_key.gif',
                click: BtnClick.addMember,
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
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V20/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Family/V20/f_btn_1.png",
            click: BtnClick.addMember,
            focusChange: PageStart.onBtnFocus,
            beforeMoveChange: PageStart.onBeforeMoveChange
        })
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

    //焦点改变前
    onBeforeMoveChange: function (direction, current) {
        switch (direction) {
            case "up":
                if (current.id == "parameter_1") {
                    if (InitData.memberArray.length > 1) {  //如果只有一个家庭成员，不需要移动
                        InitData.CurrentIndexOfMemberArray--;
                        if (InitData.CurrentIndexOfMemberArray < 0) {
                            InitData.CurrentIndexOfMemberArray = InitData.memberArray.length - 1;
                        }
                        PageStart.initRole(InitData.CurrentIndexOfMemberArray);
                    }
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
                    if (InitData.memberArray.length > 1) {  //如果只有一个家庭成员，不需要移动
                        InitData.CurrentIndexOfMemberArray++;
                        if (InitData.CurrentIndexOfMemberArray > InitData.memberArray.length - 1) {
                            InitData.CurrentIndexOfMemberArray = 0;
                        }
                        PageStart.initRole(InitData.CurrentIndexOfMemberArray);
                    }
                } else if (current.id == "parameter_2") {
                    PageStart.downType(1, 100, "parameter_2");
                } else if (current.id == "parameter_3") {
                    PageStart.downType(30, 260, "parameter_3");
                } else if (current.id == "parameter_4") {
                    PageStart.downType(1, 300, "parameter_4");
                }
                break;
        }
    },

    initRole: function (num) {
        //家庭成员姓名设置
        var eleMemberName1 = G("parameter_1_pre");
        var eleMemberName2 = G("parameter_1");
        var eleMemberName3 = G("parameter_1_next");
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

        if (InitData.memberArray.length >= 2) {
            var tempPreIndex = 0;
            if (num === 0) {
                tempPreIndex = InitData.memberArray.length - 1;
            } else {
                tempPreIndex = num - 1;
            }
            var tempNextIndex = 0;
            if (num < InitData.memberArray.length - 1) {
                tempNextIndex = num + 1;
            }

            if (InitData.memberArray.length === 2) {
                eleMemberName1.innerHTML = InitData.memberArray[tempPreIndex].member_name;
                eleMemberName3.innerHTML = "&nbsp;&nbsp;";
            } else {
                eleMemberName1.innerHTML = InitData.memberArray[tempPreIndex].member_name;
                eleMemberName3.innerHTML = InitData.memberArray[tempNextIndex].member_name;
            }
        } else if (InitData.memberArray.length === 1) {
            eleMemberName1.innerHTML = "&nbsp;&nbsp;";
            eleMemberName3.innerHTML = "&nbsp;&nbsp;";
        } else {
        }

        eleMemberName2.innerHTML = InitData.memberArray[num].member_name;

        eleMemberAge1.innerHTML = InitData.memberArray[num].member_age - 1;
        eleMemberAge2.innerHTML = InitData.memberArray[num].member_age;
        eleMemberAge3.innerHTML = InitData.memberArray[num].member_age + 1;

        eleMemberHeight1.innerHTML = InitData.memberArray[num].member_height - 1;
        eleMemberHeight2.innerHTML = InitData.memberArray[num].member_height;
        eleMemberHeight3.innerHTML = InitData.memberArray[num].member_height + 1;

        eleMemberWeight1.innerHTML = InitData.memberArray[num].member_weight - 0.5;
        eleMemberWeight2.innerHTML = InitData.memberArray[num].member_weight;
        eleMemberWeight3.innerHTML = InitData.memberArray[num].member_weight + 0.5;

        G("photo").src = g_appRootPath + "/Public/img/hd/Family/V10/icon_member_" + InitData.memberArray[num].member_image_id + ".png";

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

        InitData.memberArray.reverse();

        PageStart.initBottom();
        PageStart.initRole(InitData.CurrentIndexOfMemberArray);
        LMEPG.ButtonManager.init("parameter_1", buttons, "", true);
    }
};

window.onload = function () {
    PageStart.init();
};
