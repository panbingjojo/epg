// 定义全局按钮
var buttons = [];

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
        return LMEPG.Intent.createIntent("hospitalDetail");
    },

    /**
     * 返回事件
     */
    onBack: function () {
        LMEPG.Intent.back();
    }
};

var Home = {
    defaultFocusId: "btn-register",

    init: function () {
        Home.initRenderAll(RenderParam.hospital_info.detail.info); // 渲染页面
        Home.initButtons(); // 初始化焦点按钮
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);
    },

    initRenderAll: function (data) {
        if (RenderParam.hospital_info.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }
        G("photo").src = RenderParam.cwsGuaHaoUrl + data.hosl_pic;
        G("hospital").innerHTML = data.hosl_name;
        G("address").innerHTML = data.address;
        G("content-detail").innerHTML = Home.cutString(data.hospital_profile, 585);
    },

    initButtons: function () {
        buttons.push({
            id: 'btn-register',
            name: '预约挂号',
            type: 'div',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'subject-1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
            click: onBack,
            focusChange: Home.departFocus,
            beforeMoveChange: "",
            cType: "region",
        });
    },


    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },

    /**参数说明：
     * 根据长度截取先使用字符串，超长部分追加…
     * str 对象字符串
     * len 目标字节长度
     * 返回值： 处理结果字符串
     */
    cutString: function (str, len) {
        // length属性读出来的汉字长度为1
        if (str.length * 2 <= len) {
            return str;
        }
        var strlen = 0;
        var s = "";
        for (var i = 0; i < str.length; i++) {
            s = s + str.charAt(i);
            if (str.charCodeAt(i) > 128) {
                strlen = strlen + 2;
                if (strlen >= len) {
                    return s.substring(0, s.length - 1) + "...";
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {
                    return s.substring(0, s.length - 2) + "...";
                }
            }
        }
        return s;
    }
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
