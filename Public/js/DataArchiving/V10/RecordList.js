/**
 * Created by Administrator on 2018/12/28.
 */
// 定义全局按钮
var buttons = [];
var imgUrl = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Family/V10/";

// 返回按键
function onBack() {
    Page.onBack();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("recordList");
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam("page", Department.page);
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
    defaultFocusId: "card-1",
    //页面初始化操作
    init: function () {
        Home.initButtons();                 // 初始化焦点按钮
        Department.createHtml(RenderParam.memberList.list)
        // var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        // LMEPG.BM.init(Home.defaultFocusId, buttons, "", true);

        // 设置未归档数据条数
        if (RenderParam.recordList.result == 0) {
            G("times").innerHTML = RenderParam.recordList.count;
            if (RenderParam.recordList.count == 0) {
                Hide("times");
            }
        } else {
            Hide("times");
        }

        // 焦点恢复
        var page = RenderParam.page;
        for (var i = 0; i < page; i++) {
            Department.nextPage();
        }
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);
    },

    initButtons: function () {
        buttons.push({
            id: 'arching-btn',
            name: '数据归档',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'card-1',
            backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Family/V10/bg_arching.png",
            focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Family/V10/f_arching.png",
            click: Department.jumpArchivingList,
            focusChange: "",
            beforeMoveChange: "",
            cType: "region",
        });

        for (var i = 0; i < Department.count; i++) {
            buttons.push({
                id: 'card-' + (i + 1),
                name: '家庭成员项',
                type: 'div',
                nextFocusLeft: 'card-' + i,
                nextFocusRight: 'card-' + (i + 2),
                nextFocusUp: 'arching-btn',
                nextFocusDown: '',
                backgroundImage: imgUrl + "bg_card.png",
                focusImage: imgUrl + "f_card.png",
                click: Department.jumpRecordDetail,
                focusChange: "",
                beforeMoveChange: Home.onBeforeMoveChange,
                cType: "region",
            });
        }
    },

    // 推荐位按键移动
    onBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                if (current.id == "card-1") {
                    Department.prevPage();
                    return false;
                } else {
                }
                break;
            case 'right':
                if (current.id == "card-3") {
                    Department.nextPage();
                    return false;
                }
                break;
        }
    },


    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },

}

var Department = {
    count: 3,
    page: 0,
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    /**
     * 创建二级菜单
     */
    createHtml: function (data) {
        if (RenderParam.memberList.result != 0) {
            LMEPG.UI.showToast("数据加载失败！");
            return;
        }
        if (data.length == 0) {
            G("null-data").style.display = "block";
            Home.defaultFocusId = "arching-btn";
        }

        var htmlStr = "";
        if (RenderParam.memberList.list.length > this.count)
            var dataList = Department.cut(data, this.page * this.count, this.count);
        else
            var dataList = data;
        for (var i = 0; i < dataList.length; i++) {
            htmlStr += '  <div id="card-' + (i + 1) + '" pos="' + (this.page * this.count + i) + '" class="card"><img class="photo" src="' + imgUrl + "icon_member_" + dataList[i].member_image_id + '.png"/>';
            htmlStr += '  <div class="intro-info">' + dataList[i].member_name + '<br/><span class="font-s">检测记录</span></div>';
            htmlStr += '   </div>';
        }
        G("center").innerHTML = htmlStr;
        Department.updateMenuArrows();
        // Department.createThirdPart(secondList[0].subject);
    },


    prevPage: function () {
        if (Department.page > 0) {
            Department.page--;
            Department.createHtml(RenderParam.memberList.list);
            LMEPG.BM.requestFocus("card-3");
        } else {
            return false;
        }
    },

    updateMenuArrows: function () {
        var page_right = document.getElementById("right");
        var page_left = document.getElementById("left");
        page_right.style.display = "none";
        page_left.style.display = "none";
        if (Department.page > 0) {
            page_left.style.display = "block";
        }
        if (Department.page < Math.ceil(RenderParam.memberList.list.length / Department.count) - 1) {
            page_right.style.display = "block";
        }
    },

    nextPage: function () {
        if (Department.page < Math.ceil(RenderParam.memberList.list.length / Department.count) - 1) {
            Department.page++;
            Department.createHtml(RenderParam.memberList.list)
            LMEPG.BM.requestFocus("card-1");
        } else {

        }
    },

    /**
     * 跳转进入未归档列表页面
     */
    jumpArchivingList: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("archivingList");
        objDst.setParam("enter_type", 2); // 进入下个页面类型，1-检测进入 2-未归档进入
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    /**
     * 跳转记录详情
     * @param btn
     */
    jumpRecordDetail: function (btn) {
        var pos = G(btn.id).getAttribute("pos");
        var member = RenderParam.memberList.list[pos];
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("recordDetail");
        objDst.setParam("member_id", member.member_id);
        objDst.setParam("member_image_id", member.member_image_id);
        objDst.setParam("member_name", member.member_name);
        objDst.setParam("member_gender", member.member_gender);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },
};

window.onload = function () {
    Home.init();
};
