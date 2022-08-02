// 当前服务器时间
var curServerTime = 0;

var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('introduce');
        return currentPage;
    },

};

var WaitStep = {
    page: 1,
    max: 0,
    data:null,
    /**
     * 初始化
     */
    init: function () {
        this.getIntroPic(function (data) {
            WaitStep.createHtml(data)
            WaitStep.data = data
            G('default').innerHTML = data[0].title
            WaitStep.max = data.length
            WaitStep.updateArrow();
        })
        WaitStep.writeDataButtons();

    },

    createHtml:function(list){
        var html =''
        list.forEach(function (item,index) {
            html+=' <div id="step'+(index+1)+'" class="step" style="display:'+((index===0)?"block":"none")+'">'+
                ' <p>'+item.subtitle+'</p> '+
                '   <img class="step-img" src="'+RenderParam.fsUrl+item.picture+'"/>'+
                '</div>'
        })

        G('introduce-area').innerHTML = html
    },

    nextPage: function () {
        if (this.page <this.max) {
            this.page++;
        }
        G('default').innerHTML = WaitStep.data[this.page-1].title
        G("step" + (this.page - 1)).style.display = "none";
        G("step" + this.page).style.display = "block";
        this.updateArrow();
    },
    prePage: function () {
        if (this.page > 1) {
            this.page--;
        }
        G('default').innerHTML = WaitStep.data[this.page-1].title
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
    },

    getIntroPic:function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('NewHealthDevice/getDeviceIntro', {
            deviceId:RenderParam.introId
        },function (data) {
            console.log(data)
            LMEPG.UI.dismissWaitingDialog()
            if(data.result === 0){
                cb(data.data)
            }else {
                LMEPG.UI.showToast('获取设备列表错误!')
            }
        })
    }
};

/**
 * 返回键
 */
var onBack = function () {
    LMEPG.Intent.back();
};