// 当前服务器时间
var curServerTime = 0;

var Page = {
    num: false,
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('testIndex');
        return currentPage;
    },

    autoStep: function () {
        if (Page.num) {
            WaitStep.nextPage();
        } else {
            WaitStep.prePage();
        }
        Page.num = !Page.num;
        this.timerID1 = setTimeout('Page.autoStep()', 5000);
        // } else {
        //     clearTimeout(this.timerID1);
        // }
    },


};

var WaitStep = {
    page: 1,
    max: 2,
    /**
     * 初始化
     */
    init: function (index) {
        // this.max = index;
        WaitStep.writeDataButtons();
        this.updateArrow();
        this.queryWristBindStatus()
    },

    queryWristBindStatus: function () {
        // LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('DeviceCheck/queryRememberWrist', "",
            function (data) {
                try {
                    if (data.result == 1) {
                        // LMEPG.UI.dismissWaitingDialog();
                        WaitStep.jumpWristRecord(data.list);
                    } else {
                        setTimeout(WaitStep.queryWristBindStatus,3000)
                    }
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("手环绑定状态解析异常!" + e);
                }
            },
            function (data) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("手环绑定状态请求失败!");
            }
        );
    },
    /**
     * 跳转 - 手环检测记录界面
     */
    jumpWristRecord: function (list) {
        var objCurrent =Page.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent("wristList-wristband");
        objHomeTab.setParam('member_id', list[0].member_id);
        objHomeTab.setParam('member_image_id', list[0].member_image_id);
        objHomeTab.setParam('member_name', list[0].member_name);
        objHomeTab.setParam('device_id', list[0].device_id);
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },
    nextPage: function () {
        if (this.page < this.max) {
            this.page++;
        }
        G("step" + (this.page - 1)).style.display = "none";
        G("step" + this.page).style.display = "block";
        this.updateArrow();
    },
    prePage: function () {
        if (this.page > 1) {
            this.page--;
        }
        G("step" + (this.page + 1)).style.display = "none";
        G("step" + this.page).style.display = "block";
        this.updateArrow();
    },
    onBeforeMoveChange: function (dir, btn) {
        if (dir == "left") {
            WaitStep.prePage();
        } else if (dir == "right") {
            WaitStep.nextPage();
        }
    },
    updateArrow: function () {
        G("pages").innerHTML = this.page + "/" + WaitStep.max;
        if (this.page == 1) {
            Hide('left');
        } else {
            Show('left');
        }
        if (this.page == this.max) {
            Hide('right');
        } else {
            Show('right');
        }
    },

    /**
     * 初始化按钮
     */
    writeDataButtons: function () {
        var buttons = [
            {
                id: 'default',
                type: 'img',
                backgroundImage: "",
                focusImage: "",
                nextFocusRight: 'introduce-btn',
                beforeMoveChange: WaitStep.onBeforeMoveChange
            }
        ];
        LMEPG.BM.init('default', buttons, '', true);
    }
};

/**
 * 返回键
 */
var onBack = function () {
    LMEPG.Intent.back();
};