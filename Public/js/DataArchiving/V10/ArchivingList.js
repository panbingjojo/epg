/**
 * Created by Administrator on 2018/10/17.
 */
// 当前点击提交的类型（1-提交 2-删除）
var curSubmitType = 1;
// 当前点击的列表项的数组下标
var curClickItemIndex = 0;
// 是否展开了列表项
var isOpenItem = false;
// 保存当前点击项在页面中5个中的下标，用来做焦点保持
var curIndexInFiveItem = -1;

// 上下箭头在点击某项前的状态
var beforeArrowPre;
var beforeArrowNext;

// 当前服务器时间
var curServerTime;

function onBack() {
    // 如果当前有展开项，第一次按返回键关闭此项
    if (isOpenItem) {
        // 关闭展开项
        {
            // 恢复上下箭头状态
            G("arrow_pre").style.display = beforeArrowPre;
            G("arrow_next").style.display = beforeArrowNext;

            LMEPG.CssManager.removeClass(currentId + "_expand", "items_expand_hover")
            // $("#" + currentId + "_expand").removeClass("items_expand_hover");
            G(currentId + "_block").innerHTML = "";
            LMEPG.BM.requestFocus(currentId);

            for (var i = 0; i < parseInt(currentId.substring(6, 7)) - 1; i++) {
                G("items_" + (i + 1) + "_bg").style.display = "block";
            }
        }
        isOpenItem = false;
    } else {
        LMEPG.Intent.back();
    }
}

var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("archivingList");
        currentPage.setParam("curIndexInFiveItem", curIndexInFiveItem); // 五个中点击项的下标（焦点保持）
        currentPage.setParam("moveNum", moveNum); // 向下翻页了几条（焦点保持）
        currentPage.setParam("measure_data", JSON.stringify(RenderParam.measure_data));
        currentPage.setParam("enter_type", RenderParam.enter_type);
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
    onNavClick: function (btn) {
        LMEPG.ButtonManager.setSelected(btn.id, true);
        Home.currNavId = btn.cNavId;
        switch (btn.id) {
            case "nav_btn_1":
                Page.jumpHomeTab("home");
                break;
            case "nav_btn_2":
                Page.jumpHomeTab("homeTab1");
                break;
            case "nav_btn_3":
                Page.jumpHomeTab("homeTab2");
                break;
            case "nav_btn_4":
                Page.jumpHomeTab("homeTab3");
                break;
            case "nav_btn_5":
                Page.jumpHomeTab("homeTab4");
                break;
        }
    },
}

var detectionTypeDate = ["血糖", "胆固醇", "尿酸"]//检测类型
var detectionMembersData = []//检测检测成员
var detectionStatusDate = []//检测检测成员
// 当前获取焦点的检测成员数组下标
var members = 0;
// 当前获取焦点的检测状态数组下标
var statusData = 0;
var PageStart = {
    // 初始化底部导航栏按钮
    initBottom: function () {
        //    工具栏
        buttons.push({
            id: 'items_1',
            name: '选项1',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'items_2',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/f_btn.png',
            click: PageStart.onClickItems,
            focusChange: "",
            beforeMoveChange: PageStart.onBeforeMoveChange,
            idInFive: 0,
        });
        buttons.push({
            id: 'items_2',
            name: '选项2',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'items_1',
            nextFocusDown: 'items_3',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/f_btn.png',
            click: PageStart.onClickItems,
            focusChange: "",
            beforeMoveChange: PageStart.onBeforeMoveChange,
            idInFive: 1,
        });
        buttons.push({
            id: 'items_3',
            name: '选项3',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'items_2',
            nextFocusDown: 'items_4',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/f_btn.png',
            click: PageStart.onClickItems,
            focusChange: "",
            beforeMoveChange: PageStart.onBeforeMoveChange,
            idInFive: 2,
        });
        buttons.push({
            id: 'items_4',
            name: '选项4',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'items_3',
            nextFocusDown: 'items_5',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/f_btn.png',
            click: PageStart.onClickItems,
            focusChange: "",
            beforeMoveChange: PageStart.onBeforeMoveChange,
            idInFive: 3,
        });
        buttons.push({
            id: 'items_5',
            name: '选项5',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: 'items_4',
            nextFocusDown: '',
            backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/f_btn.png',
            click: PageStart.onClickItems,
            focusChange: "",
            beforeMoveChange: PageStart.onBeforeMoveChange,
            idInFive: 4,
        });


        buttons.push({
            id: 'jc_btn_1',
            name: '确定',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: '',
            focusImage: '',
            click: "",
            focusChange: "",
            beforeMoveChange: "",
        });


        for (var i = 0; i < 3; i++) {
            buttons.push({
                id: 'integer_btn_' + (i + 2),
                name: '展开项',
                type: 'img',
                nextFocusLeft: 'integer_btn_' + (i + 2 - 1),
                nextFocusRight: 'integer_btn_' + (i + 2 + 1),
                nextFocusUp: '',
                nextFocusDown: '',
                click: PageStart.onClickOpen,
                focusChange: PageStart.onTimeFocus,
                beforeMoveChange: PageStart.onBeforeMoveChange,
                cIdx: i,
            });
        }
    },

    onTimeFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
            // $("#" + btn.id).addClass("border_select");
            // $("#" + btn.id + "_bg").addClass("border2");
            LMEPG.CssManager.addClass(btn.id + "_bg", "border2");
        } else {
            // $("#" + btn.id).removeClass("border_select");
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            LMEPG.CssManager.removeClass(btn.id + "_bg", "border2");
            // $("#" + btn.id + "_bg").removeClass("border2");
        }
    },

    onBeforeMoveChange: function (direction, current) {
        //翻页
        switch (direction) {
            case "up":
                if (current.id == "integer_btn_2") {
                    PageStart.upTime(1, detectionMembersData, current.id);
                } else if (current.id == "integer_btn_3") {
                    PageStart.upTime(2, detectionStatusDate, current.id);
                } else if (current.id == "items_1") {
                    List.preMenu();
                    return false;
                }
                break;
            case "down":
                if (current.id == "integer_btn_2") {
                    PageStart.downTime(1, detectionMembersData, current.id);
                } else if (current.id == "integer_btn_3") {
                    PageStart.downTime(2, detectionStatusDate, current.id);
                } else if (current.id == "integer_btn_4") {
                    if (G(current.id).innerHTML == "提交") {
                        G(current.id).innerHTML = "删除";
                        G(current.id + "_next").innerHTML = "提交";
                        curSubmitType = 2;
                    } else {
                        G(current.id).innerHTML = "提交";
                        G(current.id + "_next").innerHTML = "删除";
                        curSubmitType = 1;
                    }
                } else if (current.id == "items_5") {
                    List.nextMenu();
                }
                break;
        }
    },

    /**
     * 点击检测项
     * @param btn
     */
    onClickItems: function (btn) {
        // 保存上下箭头状态
        beforeArrowPre = G("arrow_pre").style.display;
        beforeArrowNext = G("arrow_next").style.display;
        // 隐藏上下箭头状态
        G("arrow_pre").style.display = "none";
        G("arrow_next").style.display = "none";

        // 初始化当前项的选择
        members = 0;
        statusData = 0;
        curSubmitType = 1;

        // 获取真实检测状态
        var pos = G(btn.id).getAttribute("pos");
        curClickItemIndex = pos;
        var statusList = Set.getStatusList(imgIndex.data[pos].type_int, imgIndex.data[pos].time);
        console.log(statusList);
        detectionStatusDate = statusList;

        // 设置展开标志
        isOpenItem = true;
        // 保存当前点击项在5个中的下标
        curIndexInFiveItem = btn.idInFive;

        for (var i = 0; i < parseInt(btn.id.substring(6, 7)) - 1; i++) {
            G("items_" + (i + 1) + "_bg").style.display = "none";
        }
        PageStart.creamHtml(btn.id)
        LMEPG.CssManager.addClass(btn.id + "_expand", "items_expand_hover");
        // $("#" + btn.id + "_expand").addClass("items_expand_hover");
        PageStart.showtime(members, statusData);
        currentId = btn.id;
    },
    // 显示检测成员、检测状态主句
    showtime: function (roleNum, timeType) {

        // var preData = roleNum - 1 >= 0 ? roleNum - 1 : detectionMembersData.length - 1;
        // var nextData = roleNum + 1 > detectionMembersData.length - 1 ? 0 : roleNum + 1;
        // 家庭成员
        var preData = roleNum - 1;
        var nextData = roleNum + 1;
        if (preData < detectionMembersData.length && preData >= 0)
            G("integer_btn_2_pre").innerHTML = "" + detectionMembersData[preData].member_name;
        // $("#integer_btn_2_pre").html(detectionMembersData[preData].member_name);
        else
            G("integer_btn_2_pre").innerHTML = "&nbsp;";
        // $("#integer_btn_2_pre").html("&nbsp;");
        if (nextData < detectionMembersData.length && nextData >= 0)
            G("integer_btn_2_next").innerHTML = "" + detectionMembersData[nextData].member_name;
        // $("#integer_btn_2_next").html(detectionMembersData[nextData].member_name);
        else
        // $("#integer_btn_2_next").html("&nbsp;");
            G("integer_btn_2_next").innerHTML = "&nbsp;";
        if (roleNum < detectionMembersData.length && roleNum >= 0)
            G("integer_btn_2").innerHTML = "" + detectionMembersData[roleNum].member_name;
        // $("#integer_btn_2").html(detectionMembersData[roleNum].member_name);
        else
        // $("#integer_btn_2").html("&nbsp;");
            G("integer_btn_2").innerHTML = "&nbsp;";

        // var preData2 = timeType - 1 >= 0 ? timeType - 1 : detectionStatusDate.length - 1;
        // var nextData2 = timeType + 1 > detectionStatusDate.length - 1 ? 0 : timeType + 1;
        // 检测状态
        var preData2 = timeType - 1;
        var nextData2 = timeType + 1;
        if (preData2 < detectionStatusDate.length && preData2 >= 0)
            G("integer_btn_3_pre").innerHTML = "" + detectionStatusDate[preData2].name;
        // $("#integer_btn_3_pre").html(detectionStatusDate[preData2].name);
        else
        // $("#integer_btn_3_pre").html("&nbsp;");
            G("integer_btn_3_pre").innerHTML = "&nbsp;";
        if (nextData2 < detectionStatusDate.length && nextData2 >= 0)
        // $("#integer_btn_3_next").html(detectionStatusDate[nextData2].name);
            G("integer_btn_3_next").innerHTML = "" + detectionStatusDate[nextData2].name;

        else
        // $("#integer_btn_3_next").html("&nbsp;");
            G("integer_btn_3_next").innerHTML = "&nbsp;";
        if (timeType < detectionStatusDate.length && timeType >= 0)
        // $("#integer_btn_3").html(detectionStatusDate[timeType].name);
            G("integer_btn_3").innerHTML = "" + detectionStatusDate[timeType].name;

        else
            G("integer_btn_3").innerHTML = "&nbsp;";
        // $("#integer_btn_3").html("&nbsp;");
        LMEPG.BM.requestFocus("integer_btn_2");
    },

    creamHtml: function (id) {
        var str = "";
        str += '<div id="integer_btn_2_bg"  class="time_btn"></div>';
        str += '<div id="integer_btn_2_pre"  class="time_code"></div>';
        str += '<div id="integer_btn_3_pre" class="time_code"></div>';
        str += '<div id="integer_btn_4_pre" class="time_code">&nbsp;&nbsp;</div>';

        str += '<div id="integer_btn_3_bg"  class="time_btn"></div>';
        str += '<div id="integer_btn_2"  class="time_code_big"></div>';
        str += '<div id="integer_btn_3" class="time_code_big"></div>';
        str += '<div id="integer_btn_4" class="time_code_big">提交</div>';

        str += '<div id="integer_btn_4_bg"  class="time_btn"></div>';
        str += '<div id="integer_btn_2_next"  class="time_code"></div>';
        str += '<div id="integer_btn_3_next" class="time_code"></div>';
        str += '<div id="integer_btn_4_next" class="time_code">删除</div>';
        G(id + "_block").innerHTML = str;
    },

    /**
     * 点击展开项
     * @param btn
     */
    onClickOpen: function (btn) {
        // 点击“增加”按钮，跳转到家庭成员页面
        if (btn.id == "integer_btn_2" && G(btn.id).innerHTML == "增加") {
            var objCurrent = Page.getCurrentPage();
            objCurrent.setParam("member_focus_index", detectionMembersData.length - 1); // “添加”的数组下标（焦点保持）
            var objMemberAdd = LMEPG.Intent.createIntent("familyMembersAdd");
            objMemberAdd.setParam("actionType", 1);
            LMEPG.Intent.jump(objMemberAdd, objCurrent);
        }

        // 点击“提交”或“删除”
        if (btn.id == "integer_btn_4") {
            // 提交
            if (curSubmitType == 1) {
                Set.dataSubmit();
            }
            // 删除
            else {
                Set.dataDelete();
            }
        }
    },
    // 检测成员、检测类型按向上按键
    upTime: function (type, data, id) {
        var num1 = G(id + "_pre").innerHTML;
        // if (num1 == "" || num1 == " " || num1 == "   " || num1 == "&nbsp;" || num1 == "&nbsp;&nbsp;")
        //     return;
        var num2 = G(id).innerHTML;
        if (num2 == detectionMembersData[0].member_name || num2 == detectionStatusDate[0].name)
            return;
        G(id).innerHTML = "" + num1;
        G(id + "_next").innerHTML = "" + num2;
        if (type == 1) {
            members--;
            if (members < 0) {
                members = data.length - 1;
            }
            if (members - 1 >= 0 && members - 1 < data.length) {
                G(id + "_pre").innerHTML = data[members - 1].member_name;
            } else
                G(id + "_pre").innerHTML = "&nbsp;";
        } else {
            statusData--;
            if (statusData < 0) {
                statusData = data.length - 1;
            }
            if (statusData - 1 >= 0 && statusData - 1 < data.length) {
                G(id + "_pre").innerHTML = data[statusData - 1].name;
            } else
                G(id + "_pre").innerHTML = "&nbsp;";
        }
    },
    // 检测成员、检测类型按向下按键
    downTime: function (type, data, id) {
        var num1 = G(id + "_next").innerHTML;
        // if (num1 == "" || num1 == " " || num1 == "   " || num1 == "&nbsp;" || num1 == "&nbsp;&nbsp;")
        //     return;
        var num2 = G(id).innerHTML;
        if (num2 == detectionMembersData[detectionMembersData.length - 1].member_name || num2 == detectionStatusDate[detectionStatusDate.length - 1].name)
            return;
        G(id + "_pre").innerHTML = "" + num2;
        G(id).innerHTML = "" + num1;
        if (type == 1) {
            members++;
            if (members > data.length - 1) {
                members = 0;
            }
            if (members + 1 >= 0 && members + 1 < data.length) {
                G(id + "_next").innerHTML = data[members + 1].member_name;
            } else
                G(id + "_next").innerHTML = "&nbsp;";
        } else {
            statusData++;
            if (statusData > data.length - 1) {
                statusData = 0;
            }
            if (statusData + 1 >= 0 && statusData + 1 < data.length) {
                G(id + "_next").innerHTML = data[statusData + 1].name;
            } else
                G(id + "_next").innerHTML = "&nbsp;";
        }
    },

    init: function () {
        Set.initData(); // 初始化页面数据
        PageStart.initBottom();
        if (imgIndex.data.length <= 0) {
            G("data_full").style.display = "none";
            LMEPG.ButtonManager.init("jc_btn_1", buttons, "", true);
        } else {
            G("data_null").style.display = "none";
            List.createMenu();
            LMEPG.ButtonManager.init("items_1", buttons, "", true);
        }

        // 焦点恢复
        if (RenderParam.curIndexInFiveItem == -1 || RenderParam.moveNum == -1) {
            return;
        } else {
            // 滚动，显示正确的数据项
            for (var i = 0; i < RenderParam.moveNum; i++) {
                List.nextMenu();
            }
            // 展开对应的项
            PageStart.onClickItems(buttons[RenderParam.curIndexInFiveItem]);
            // 检测成员列表焦点保持在以前的位置
            for (var i = 0; i < RenderParam.member_focus_index; i++) {
                PageStart.downTime(1, detectionMembersData, "integer_btn_2");
            }
        }
    }
};

var List = {
    // 创建菜单
    createMenu: function () {
        var tab_list = document.getElementById("center");//数据块
        var strTable = '';
        var start = (pageCurrent - 1) * cutNum + parseInt(moveNum);//数组截取起始位置
        var end = pageCurrent * cutNum + parseInt(moveNum);//数组截取终止位置
        var newArr = imgIndex.data.slice(start, end);
        tab_list.innerHTML = "";
        for (var i = 0; i < newArr.length; i++) {
            strTable += '<div  id="items_' + (i + 1) + '_bg" class="items"> ';
            strTable += '<img id="items_' + (i + 1) + '" pos="' + (i + moveNum) + '" class="items_bg" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/bg_btn.png"/> ';
            strTable += '<div class="items_btn">';
            strTable += '<div class="items_content">' + newArr[i].time + '</div>';
            strTable += '<div class="items_content">' + newArr[i].type + '</div>';
            strTable += '<div class="items_content">' + newArr[i].num + '<img class="icon_right" src="' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V10/icon_right_1.png"/></div>';
            strTable += '</div>';
            strTable += '<div id="items_' + (i + 1) + '_expand" class="items_expand">';
            strTable += '<div class="time_block">';
            strTable += '<div  class="time_code" style="border-bottom: 1px #FFFFFF solid">检测成员</div>';
            strTable += '<div  class="time_code"  style="border-bottom: 1px #FFFFFF solid">检测状态</div>';
            strTable += '<div  class="time_code">&nbsp;&nbsp;</div>';
            strTable += '</div>';
            strTable += '<div id="items_' + (i + 1) + '_block" class="time_block">';
            strTable += '</div>';
            strTable += '</div></div>';
        }
        tab_list.innerHTML = strTable;
        List.updateMenuArrows();
    },
    //遥控器上按键翻页
    preMenu: function () {
        if (moveNum > 0) {
            moveNum--;
            List.createMenu();
            LMEPG.ButtonManager.requestFocus("items_1");
        } else {
            LMEPG.BM.requestFocus("inspection_input");
        }
    },
    updateMenuArrows: function () {
        var page_right = document.getElementById("arrow_next");
        var page_left = document.getElementById("arrow_pre");
        page_right.style.display = "none";
        page_left.style.display = "none";
        var leveNum = (imgIndex.data.length) - moveNum;
        if (leveNum > 5) {
            page_right.style.display = "block";
        }
        if (moveNum > 0) {
            page_left.style.display = "block";
        }
    },

    //向下翻页事件
    nextMenu: function () {
        var leveNum = parseInt(imgIndex.data.length) - moveNum;
        if (leveNum > 5) {
            moveNum++;
            List.createMenu();
            LMEPG.ButtonManager.requestFocus("items_5");
        } else {

        }
    },
}
// 定义全局按钮
var buttons = [];
var currentId;
var pageCurrent = 1;
var cutNum = 5;
var moveNum = 0;
var fileIndex = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Family/";
var imgIndex = {
    "data": [{
        "time": "2018-09-01 08:35:60",
        "type": "血糖",
        "num": "5.20mmol/L",
    }, {
        "time": "2018-09-02 08:35:60",
        "type": "胆固醇",
        "num": "5.20mmol/L",
    }, {
        "time": "2018-09-03 08:35:60",
        "type": "尿素",
        "num": "5.20mmol/L",
    }, {
        "time": "2018-09-04 08:35:60",
        "type": "血糖",
        "num": "5.20mmol/L",
    }, {
        "time": "2018-09-05 08:35:60",
        "type": "胆固醇",
        "num": "5.20mmol/L",
    }, {
        "time": "2018-09-06 08:35:60",
        "type": "尿素",
        "num": "5.20mmol/L",
    }]
};

// 设置页面数据
var Set = {
    /**
     * 初始化
     */
    initData: function () {
        var enter_type = RenderParam.enter_type;
        var measure_data = RenderParam.measure_data;

        detectionMembersData = [];
        detectionStatusDate = [];
        imgIndex.data = [];
        // 从检测页面进入
        if (enter_type == 1) {
            imgIndex = {};
            imgIndex.data = [];
            var tmp = {};
            tmp.time = measure_data.mMeasureDate;
            tmp.type = Set.getPaperTypeName(measure_data.mPaperType);
            tmp.type_int = measure_data.mPaperType;
            tmp.num = measure_data.mMeasureData + ' ' + Set.getMetricalUnit(measure_data.mPaperType);
            tmp.measure_id = measure_data.mMeasureId;
            tmp.measure_env_temperature = measure_data.mEnvTemperature;
            tmp.measure_data = measure_data.mMeasureData;
            imgIndex.data.push(tmp);
        }
        // 从归档进入
        else if (enter_type == 2) {
            if (RenderParam.recordList.result != 0) {
                // 表示接口没有传递imei号，界面显示“暂无检测数据哦！”
                if (RenderParam.recordList.result == -201) {
                    G("null-data").style.display = "block";
                    return;
                } else {
                    LMEPG.UI.showToast("数据加载失败！");
                    return;
                }
            }
            var list = RenderParam.recordList.list;
            if (list.length == 0) {
                G("null-data").style.display = "block";
            }
            for (var i = 0; i < list.length; i++) {
                var tmp = {};
                var item = list[i];
                tmp.time = item.measure_dt;
                tmp.type = Set.getPaperTypeName(item.extra_data1);
                tmp.type_int = item.extra_data1;
                tmp.num = item.extra_data2 + ' ' + Set.getMetricalUnit(item.extra_data1);
                tmp.measure_id = item.measure_id;
                tmp.measure_env_temperature = "0.0";
                tmp.measure_data = item.extra_data2;
                imgIndex.data.push(tmp);
            }
        }
        // 接收到数据，刷新页面
        else if (enter_type == 3) {
            if (window.localStorage) {
                var storage = window.localStorage;
                var list_str = storage.getItem("measure_data_list");
                imgIndex.data = JSON.parse(list_str);
            } else {
                imgIndex.data = JSON.parse(RenderParam.localStorageData);
            }
        }

        // 初始化检测成员（检测状态根据每项的测量时间不同，显示不同的检测状态，在点击的时候初始化即可）
        Set.initMeasureMember();

        // 初始化健康检测回调函数
        if (enter_type == 1 || enter_type == 3) {
            // 进入页面后，获取此时服务器时间。轮询得到的数据的第一条，将和此时间比较，并且判断此数据是否已经存在到当前列表
            LMEPG.ajax.postAPI("Expert/getTime", {}, function (timeStr) {
                console.log(timeStr);
                curServerTime = Date.parse(timeStr);
                // 轮询
                Set.polling();
            });
        }
    },

    /**
     * 获取试纸类型名
     * @param paperType
     * @returns {string}
     */
    getPaperTypeName: function (paperType) {
        var strPaperType;
        switch (paperType) {
            case 1:
            case "1":
                strPaperType = "血糖";
                break;
            case 2:
            case "2":
                strPaperType = "胆固醇";
                break;
            case 3:
            case "3":
                strPaperType = "甘油三脂";
                break;
            case 4:
            case "4":
                strPaperType = "尿酸";
                break;
            default:
                strPaperType = "未知";
                break;
        }
        return strPaperType;
    },

    /**
     * 得到测量数据单位
     * @param paperType
     * @returns {string}
     */
    getMetricalUnit: function (paperType) {
        var name = "mmol/L";
        if (paperType == 1 ||
            paperType == 2 ||
            paperType == 3
        ) {
            name = "mmol/L";
        } else if (paperType == 4) {
            name = "umol/L";
        }
        return name;
    },

    /**
     * 初始化检测成员
     */
    initMeasureMember: function () {
        detectionMembersData = RenderParam.addedMemberList;
        // 家庭成员最多8个，少于8个均需要有“增加”按钮
        if (detectionMembersData.length < 8) {
            detectionMembersData.push({"member_name": "增加"});
        }
    },

    /**
     * 根据不同检测类型返回对应的检测状态时刻表。类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
     * @param type
     * @returns {Array}
     */
    initStatusMomentList: function (type) {
        var dataList = [];
        switch (Measure.getTypeAsInt(type)) {
            // 血糖的时刻表区别于其他
            case Measure.Type.BLOOD_GLUCOSE:
                if (LMEPG.Func.isObject(RenderParam.momentData) && LMEPG.Func.isArray(RenderParam.momentData.repast)) {
                    for (var i = 0; i < RenderParam.momentData.repast.length; i++) {
                        var item = RenderParam.momentData.repast[i];
                        dataList.push({
                            type: type,
                            desc: Measure.getTypeText(type),
                            id: item.repast_id,
                            name: item.repast_name,
                        });
                    }
                }
                break;
            default:
                if (LMEPG.Func.isObject(RenderParam.momentData) && LMEPG.Func.isArray(RenderParam.momentData.timebuckets)) {
                    for (var i = 0; i < RenderParam.momentData.timebuckets.length; i++) {
                        var item = RenderParam.momentData.timebuckets[i];
                        dataList.push({
                            type: type,
                            desc: Measure.getTypeText(type),
                            id: item.timebucket_id,
                            name: item.timebucket_name,
                        });
                    }
                }
                break;
        }

        return dataList;
    },

    /**
     * 获取最终测量状态列表
     * @param measureType
     * @param measureDt
     * @returns {*|Array}
     */
    getStatusList: function (measureType, measureDt) {
        var statusList = this.initStatusMomentList(measureType);
        var realStatusList = Measure.StatusHelper.getStatusListBy(measureType, statusList, measureDt);
        return realStatusList;
    },

    /**
     * 提交
     */
    dataSubmit: function () {
        // 判断是否选择了家庭成员
        if (detectionMembersData[members].member_name == "增加") {
            LMEPG.UI.showToast("请选择家庭成员！");
            return;
        }

        var latestRepastId = "-1";
        var latestTimebucketId = "-1";
        switch (Measure.getTypeAsInt(imgIndex.data[curClickItemIndex].type_int)) {
            case Measure.Type.BLOOD_GLUCOSE: //血糖：使用repast_id
                latestRepastId = detectionStatusDate[statusData].id;
                break;
            default: //胆固醇和尿酸等其他：使用timebucket_id
                latestTimebucketId = detectionStatusDate[statusData].id;
                break;
        }
        var postData = {
            member_id: detectionMembersData[members].member_id,
            measure_id: imgIndex.data[curClickItemIndex].measure_id,
            repast_id: latestRepastId,
            timebucket_id: latestTimebucketId,
            paper_type: imgIndex.data[curClickItemIndex].type_int,
            env_temperature: imgIndex.data[curClickItemIndex].measure_env_temperature,
            measure_data: imgIndex.data[curClickItemIndex].measure_data,
            measure_dt: imgIndex.data[curClickItemIndex].time,
        };
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Measure/archiveInspectRecord", postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            console.log(data);
            if (data.result === 0) {
                LMEPG.UI.commonDialog.show('存档成功！查看检测结果可至“我的家——检测记录”中查询', ['确定'], function (index) {
                    var enter_type = RenderParam.enter_type;
                    // 从检测页面进入
                    if (enter_type == 1) {
                        // 返回上个页面
                        LMEPG.Intent.back();
                    }
                    // 从归档进入
                    else if (enter_type == 2) {
                        // 刷新当前页面
                        var objSrc = null;
                        var objDst = LMEPG.Intent.createIntent("archivingList");
                        objDst.setParam("enter_type", 2);
                        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                    }
                    // 当前页面接收到新数据后刷新过
                    else if (enter_type == 3) {
                        var measureId = imgIndex.data[curClickItemIndex].measure_id;
                        // 清除当前条在localStorage中的数据，然后刷新页面
                        var list_str;
                        if (window.localStorage) {
                            var storage = window.localStorage;
                            list_str = storage.getItem("measure_data_list");
                        } else {
                            list_str = RenderParam.localStorageData;
                        }
                        var measure_data_list = JSON.parse(list_str);
                        var measure_data_list_new = [];
                        for (var i = 0; i < measure_data_list.length; i++) {
                            if (measure_data_list[i].measure_id == measureId)
                                continue;
                            measure_data_list_new.push(measure_data_list[i]);
                        }

                        Set.setLocalStorageItem(measure_data_list_new, function () {
                            // 刷新页面
                            var objDst = LMEPG.Intent.createIntent("archivingList");
                            objDst.setParam("enter_type", 3);
                            LMEPG.Intent.jump(objDst, null, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                        });

                    }
                });
            } else {
                LMEPG.UI.showToast("归档失败！[" + data.result + "]");
            }
        });
    },

    /**
     * 删除
     */
    dataDelete: function () {
        LMEPG.UI.commonDialog.show('删除后将无法查询本条数据的检测记录哦！确定删除本条数据？', ['确定', '取消'], function (index) {
            if (index == 0) {
                LMEPG.UI.showWaitingDialog("");
                LMEPG.ajax.postAPI("Measure/deleteInspectRecord", {measureId: imgIndex.data[curClickItemIndex].measure_id}, function (data) {
                    LMEPG.UI.dismissWaitingDialog();
                    console.log(data);
                    if (data.result === 0) {
                        LMEPG.UI.showToast("删除成功");
                        var enter_type = RenderParam.enter_type;
                        // 从检测页面进入
                        if (enter_type == 1) {
                            // 返回上个页面
                            LMEPG.Intent.back();
                        }
                        // 从归档进入
                        else if (enter_type == 2) {
                            // 刷新当前页面
                            var objSrc = null;
                            var objDst = LMEPG.Intent.createIntent("archivingList");
                            objDst.setParam("enter_type", 2);
                            LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                        }
                        // 当前页面接收到新数据后刷新过
                        else if (enter_type == 3) {
                            var measureId = imgIndex.data[curClickItemIndex].measure_id;
                            // 清除当前条在localStorage中的数据，然后刷新页面
                            var list_str;
                            if (window.localStorage) {
                                var storage = window.localStorage;
                                list_str = storage.getItem("measure_data_list");
                            } else {
                                list_str = RenderParam.localStorageData;
                            }
                            var measure_data_list = JSON.parse(list_str);
                            var measure_data_list_new = [];
                            for (var i = 0; i < measure_data_list.length; i++) {
                                if (measure_data_list[i].measure_id == measureId)
                                    continue;
                                measure_data_list_new.push(measure_data_list[i]);
                            }

                            Set.setLocalStorageItem(measure_data_list_new, function () {
                                // 刷新页面
                                var objDst = LMEPG.Intent.createIntent("archivingList");
                                objDst.setParam("enter_type", 3);
                                LMEPG.Intent.jump(objDst, null, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                            });

                        }
                    } else {
                        LMEPG.UI.showToast("删除失败！[" + data.result + "]");
                    }
                });
            }
        });
    },

    /**
     * 轮询查询最新的检测记录
     */
    polling: function () {
        LMEPG.ajax.postAPI("Measure/queryLatestMeasureRecord", {}, function (data) {
            console.log(data);
            if (data.result == 0 && data.data.length > 0) {
                var paramObj = {};
                paramObj.mMeasureId = data.data[0].measure_id;
                paramObj.mMeasureDate = data.data[0].measure_dt;
                paramObj.mMeasureData = data.data[0].extra_data2;
                paramObj.mPaperType = data.data[0].extra_data1;
                paramObj.mEnvTemperature = 0.0;
                paramObj.mMemberId = 0;
                paramObj.mRepastId = 0;
                paramObj.mTimebucketId = 0;
                paramObj.mUserId = 0;
                var param = JSON.stringify(paramObj);

                var flag = 0;
                if (Date.parse(paramObj.mMeasureDate) >= curServerTime) {
                    // 判断这条数据是否存在在当前列表
                    for (var i = 0; i < imgIndex.data.length; i++) {
                        if (imgIndex.data[i].measure_id == paramObj.mMeasureId) {
                            flag = 1;
                            break;
                        }
                    }
                } else {
                    flag = 1;
                }

                if (flag == 0) {
                    // 在此页面获取到最新的检测数据，刷新当前页面，加载数据
                    param = JSON.parse(param);
                    // 保存数据
                    var tmp = {};
                    tmp.time = param.mMeasureDate;
                    tmp.type = Set.getPaperTypeName(param.mPaperType);
                    tmp.type_int = param.mPaperType;
                    tmp.num = param.mMeasureData + ' ' + Set.getMetricalUnit(param.mPaperType);
                    tmp.measure_id = param.mMeasureId;
                    tmp.measure_env_temperature = param.mEnvTemperature;
                    tmp.measure_data = param.mMeasureData;
                    imgIndex.data.push(tmp);

                    Set.setLocalStorageItem(imgIndex.data, function () {
                        var objDst = LMEPG.Intent.createIntent("archivingList");
                        objDst.setParam("curIndexInFiveItem", curIndexInFiveItem); // 五个中点击项的下标（焦点保持）
                        objDst.setParam("moveNum", moveNum); // 向下翻页了几条（焦点保持）
                        objDst.setParam("enter_type", 3);
                        LMEPG.Intent.jump(objDst, null, LMEPG.Intent.INTENT_FLAG_DEFAULT);
                    });
                } else {
                    setTimeout(function () {
                        Set.polling();
                    }, 6000);
                }
            } else {
                setTimeout(function () {
                    Set.polling();
                }, 6000);
            }
        });
    },

    /**
     * 获取的本地数据
     */
    localStorageData: "",

    /**
     * 保存本地数据。
     * 如果支持localStorage，则保存到localStorage；否则保存到服务器。
     */
    setLocalStorageItem: function (data, callback) {
        if (window.localStorage) {
            var storage = window.localStorage;
            storage.removeItem("measure_data_list");
            storage.setItem("measure_data_list", JSON.stringify(data));
            callback();
        } else {
            var postData = {
                "key": "EPG-LWS-HEALTHTEST-LOCALSTORAGE-" + RenderParam.carrierId + "-" + RenderParam.userId,
                "value": JSON.stringify(data)
            };
            LMEPG.ajax.postAPI('Activity/saveStoreData', postData, function (rsp) {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    var result = data.result;
                    if (result == 0) {
                        callback();
                    }
                },
                function (rsp) {
                }
            );
        }
    },

    /**
     * 获取本地数据。
     * 同上。
     */
    getLocalStorageItem: function (callback) {
        if (window.localStorage) {
            var storage = window.localStorage;
            var list_str = storage.getItem("measure_data_list");
            this.localStorageData = list_str;
            callback();
        } else {
            var postData = {
                "key": "EPG-LWS-HEALTHTEST-LOCALSTORAGE-" + RenderParam.carrierId + "-" + RenderParam.userId
            };
            LMEPG.ajax.postAPI('Activity/queryStoreData', postData, function (rsp) {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    var result = data.result;
                    if (result == 0) {
                        this.localStorageData = data.val;
                        callback();
                    }
                },
                function (rsp) {
                }
            );
        }
    },
};

window.onload = function () {
    PageStart.init();
};
