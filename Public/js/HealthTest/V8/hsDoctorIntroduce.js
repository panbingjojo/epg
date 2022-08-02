// 当前服务器时间
var curServerTime = 0;

var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('hsDoctorIntroduce');
        return currentPage;
    },

};

var WaitStep = {
    page: 1,
    max: 7,
    /**
     * 初始化
     */
    init: function () {
        WaitStep.writeDataButtons();
        this.updateArrow();
    },

    nextPage: function () {
        if (this.page <this.max) {
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
        G("pages").innerHTML = this.page + "/" + this.max;
        // alert(this.page)
        if(this.page==1){
            Hide('left');
        }else {
            Show('left');
        }
        if(this.page==this.max){
            Hide('right');
        }else {
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