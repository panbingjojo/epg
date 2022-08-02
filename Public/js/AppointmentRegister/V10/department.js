/**
 * Created by Administrator on 2018/12/28.
 */
// 定义全局按钮
var buttons = [];
// 带滚动条的列表
var scroll = "third-list";

// 保存当前二级菜单获取焦点的下标
var currentSecondMenuPos = 0;

// 返回按键
function onBack() {
    Page.onBack();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function (isGoDetail) {
        var currentPage = LMEPG.Intent.createIntent("departmentDetail");
        currentPage.setParam("hospital_id", RenderParam.hospital_id);
        currentPage.setParam("is_province", RenderParam.is_province);
        // 焦点保持需要保存的信息
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        if (!isGoDetail) {
            var leftMenuId = LMEPG.BM.getSelectedButton("department").id;
            currentPage.setParam('leftMenuId', leftMenuId);
            currentPage.setParam('leftMenuPage', Department.page);
            currentPage.setParam('currentSecondMenuPos', currentSecondMenuPos);
            currentPage.setParam('rightMenuPage', Department.rightPage);
        }
        return currentPage;
    },

    /**
     * 返回事件
     */
    onBack: function () {
        LMEPG.Intent.back();
    }
};

var Home = {
    defaultFocusId: "subject-1",
    //页面初始化操作
    init: function () {
        Home.initRenderAll();                //渲染页面
        Home.initButtons();                 // 初始化焦点按钮

        // 焦点恢复
        LMEPG.BM.init(Home.defaultFocusId, buttons, "", true);
        if (!LMEPG.Func.isEmpty(RenderParam.leftMenuId)) {
            var leftMenuId = RenderParam.leftMenuId;
            var leftMenuPage = RenderParam.leftMenuPage;
            var rightMenuPage = RenderParam.rightMenuPage;
            var currentSecondMenuPosTmp = RenderParam.currentSecondMenuPos;
            currentSecondMenuPos = currentSecondMenuPosTmp;
            LMEPG.BM.setSelected(leftMenuId, true);
            for (var i = 0; i < leftMenuPage; i++)
                Department.nextPage();
            LMEPG.BM.requestFocus(leftMenuId);
            LMEPG.CssManager.addClass(leftMenuId, "btn-select");

            for (var i = 0; i < rightMenuPage; i++)
                Department.rightNextPage();
        }
        if (!LMEPG.Func.isEmpty(RenderParam.focusIndex)) {
            LMEPG.BM.requestFocus(RenderParam.focusIndex);
        }
    },

    initRenderAll: function () {
        if (RenderParam.hospital_info.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }
        Department.renderHospitalInfo();//医院数据
        Department.createSecondPart(RenderParam.hospital_info.list);//二级菜单数据
        Department.createThirdPart(RenderParam.hospital_info.list[0].child_node); // 三级菜单数据
    },

    initButtons: function () {
        buttons.push({
            id: 'btn-detail',
            name: '医院详情',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'subject-1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: Home.goHospitalDetail,
            focusChange: Home.departFocus,
            beforeMoveChange: Home.onRecommendBeforeMoveChange,
            cType: "region",
        });
        for (var i = 0; i < Department.count; i++) {
            buttons.push({
                id: 'subject-' + (i + 1),
                name: '科室选择 - 左边',
                type: 'div',
                nextFocusLeft: "",
                nextFocusRight: 'tab-1',
                nextFocusUp: 'subject-' + i,
                nextFocusDown: 'subject-' + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/bg_subject.png",
                focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/f_subject.png",
                selectedImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/select_subject.png",
                groupId: "department",
                click: Home.onClickRegion,
                focusChange: Home.departFocus,
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
                cType: "region",
            });
        }
        for (var i = 0; i < Department.count; i++) {
            buttons.push({
                id: 'tab-' + (i + 1),
                name: '科室选择 - 右边',
                type: 'div',
                nextFocusLeft: "subject-1",
                nextFocusRight: '',
                nextFocusUp: 'tab-' + i,
                nextFocusDown: 'tab-' + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_null.png",
                focusImage: g_appRootPath + "/Public/img/hd/AppointmentRegister/V10/BtnBox/bg_depart.png",
                click: Home.goDoctorList,
                focusChange: Home.departFocus,
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
            });
        }
    },


    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            if (btn.id.substring(0, 7) == "subject") {
                G("third-list").style.overflow = "hidden";
                LMEPG.BM.setSelected(btn.id, true);
                LMEPG.CssManager.removeClass(btn.id, "btn-select");
                S(btn.id + "-bg");

                // 二级菜单获取焦点时，加载对应三级菜单数据
                console.log(G(btn.id).getAttribute("pos"));
                var pos = G(btn.id).getAttribute("pos");
                currentSecondMenuPos = pos;
                Department.rightPage = 0;
                Department.createThirdPart(RenderParam.hospital_info.list[pos].child_node);
            } else if (btn.id.substring(0, 3) == "tab") {
                S(LMEPG.BM.getSelectedButton("department").id + "-bg");
            }
            // LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            // LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            if (btn.id.substring(0, 7) == "subject") {
                // G("third-list").style.overflow = "auto";
                H(btn.id + "-bg");
            }
        }
    },

    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                if (current.id == "subject-1") {
                    Department.prevPage();
                } else if (current.id == "tab-1") {
                    Department.rightPrevPage();
                }
                break;
            case 'down':
                if (current.id == "subject-4") {
                    Department.nextPage();
                } else if (current.id == "tab-4") {
                    Department.rightNextPage();
                }
                if (current.id == "btn-detail") {
                    LMEPG.CssManager.removeClass("subject-2", "btn-select");
                    LMEPG.CssManager.removeClass("subject-3", "btn-select");
                    LMEPG.CssManager.removeClass("subject-4", "btn-select");
                    H("subject-2" + "-bg");
                    H("subject-3" + "-bg");
                    H("subject-4" + "-bg");
                }
                break;
            case 'left':
                if ((current.id.substring(0, 3)) == "tab") {
                    var currentId = LMEPG.BM.getSelectedButton("department").id;
                    LMEPG.BM.requestFocus(currentId);
                }
                break;
            case 'right':
                if ((current.id.substring(0, 7)) == "subject") {
                    LMEPG.CssManager.addClass(current.id, "btn-select");
                }
                break;
        }
    },

    // 跳转医院详情
    goHospitalDetail: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("hospitalDetail");
        /*objDst.setParam("hosl_pic", RenderParam.hospital_info.detail.info.hosl_pic);
        objDst.setParam("hosl_name", RenderParam.hospital_info.detail.info.hosl_name);
        objDst.setParam("address", RenderParam.hospital_info.detail.info.address);
        // 去掉<p> $nbsp;标签，否则JSON转换出错
        var hospital_profile = RenderParam.hospital_info.detail.info.hospital_profile;
        hospital_profile = hospital_profile.replace(/&nbsp;/ig, "");
        hospital_profile = hospital_profile.replace(/<[^>]+>/g, "");
        objDst.setParam("hospital_profile", hospital_profile);*/

        objDst.setParam("hospital_id", RenderParam.hospital_id);
        objDst.setParam("is_province", RenderParam.is_province);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 跳转到医生列表
    goDoctorList: function (btn) {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("doctorList");
        var pos = G(btn.id).getAttribute("pos");
        pos = parseInt(pos);
        objDst.setParam("hospital_id", RenderParam.hospital_info.detail.info.hosl_id);
        objDst.setParam("dept_id", RenderParam.hospital_info.list[currentSecondMenuPos].child_node[pos].dept_id);
        objDst.setParam("shift_limit", RenderParam.hospital_info.list[currentSecondMenuPos].child_node[pos].shift_limit);
        objDst.setParam("tips", RenderParam.hospital_info.list[currentSecondMenuPos].child_node[pos].tips);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },
}


var Department = {
    count: 4,
    page: 0,
    rightPage: 0,
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    /**
     * 创建二级菜单
     */
    createSecondPart: function (data) {
        var htmlStr = "";
        var secondList = Department.cut(data, this.page, this.count);
        for (var i = 0; i < secondList.length; i++) {
            htmlStr += ' <div id="subject-' + (i + 1) + '" class="subject" pos="' + (i + this.page) + '">' + secondList[i].dept_name + '</div>';
        }
        G("second-list").innerHTML = htmlStr;
        LMEPG.BM.setSelected("subject-1", true);

        // 判断是否最后一页隐藏或显示箭头
        if (Department.page >= RenderParam.hospital_info.list.length - Department.count) {
            H("m-next-subject");
        } else {
            S("m-next-subject");
        }
    },
    /**
     * 创建三级菜单
     */
    createThirdPart: function (data) {
        var htmlStr = "";
        var thirdList = Department.cut(data, this.rightPage, this.count);
        for (var i = 0; i < thirdList.length; i++) {
            htmlStr += ' <div id="tab-' + (i + 1) + '" class="tab"' + ' pos="' + (i + Department.rightPage) + '">' + thirdList[i].dept_name + '</div>';
            htmlStr += ' <hr class="sub-line"/>';
        }
        G("third-list").innerHTML = htmlStr;

        // 判断是否最后一页隐藏或显示箭头
        if (Department.rightPage >= RenderParam.hospital_info.list[currentSecondMenuPos].child_node.length - Department.count) {
            H("m-next-depart");
        } else {
            S("m-next-depart");
        }
    },

    prevPage: function () {
        if (Department.page > 0) {
            Department.page--;
            Department.createSecondPart(RenderParam.hospital_info.list);
            LMEPG.BM.requestFocus("subject-1");
        } else {
            LMEPG.BM.requestFocus("btn-detail");
            LMEPG.CssManager.addClass("subject-1", "btn-select");
            S("subject-1-bg");
            return false;
        }
    },

    nextPage: function () {
        if (Department.page < RenderParam.hospital_info.list.length - Department.count) {
            Department.page++;
            Department.createSecondPart(RenderParam.hospital_info.list);
            LMEPG.BM.requestFocus("subject-4");
        } else {

        }
    },

    rightPrevPage: function () {
        if (Department.rightPage > 0) {
            Department.rightPage--;
            Department.createThirdPart(RenderParam.hospital_info.list[currentSecondMenuPos].child_node);
            LMEPG.BM.requestFocus("tab-1");
        } else {
            LMEPG.BM.requestFocus("btn-detail");
            return false;
        }
    },

    rightNextPage: function () {
        if (Department.rightPage < RenderParam.hospital_info.list[currentSecondMenuPos].child_node.length - Department.count) {
            Department.rightPage++;
            Department.createThirdPart(RenderParam.hospital_info.list[currentSecondMenuPos].child_node);
            LMEPG.BM.requestFocus("tab-4");
        }
    },

    /**
     * 渲染医院
     */
    renderHospitalInfo: function () {
        var detail = RenderParam.hospital_info.detail;

        G("photo").src = RenderParam.cwsGuaHaoUrl + detail.info.hosl_pic;
        G("hospital").innerHTML = detail.info.hosl_name;
        G("address").innerHTML = detail.info.address;
        G("introduce").innerHTML = detail.info.hospital_profile;
    },
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};

