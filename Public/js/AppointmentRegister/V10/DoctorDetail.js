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
        return LMEPG.Intent.createIntent("doctorDetail");
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
        Home.initRenderAll();
        Home.initButtons();
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);
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

    initRenderAll: function () {
        if (RenderParam.detail.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            return;
        }

        var photo = RenderParam.detail.detail.expert.expertPhoto;
        var name = RenderParam.detail.detail.expert.name;
        var hospital =  RenderParam.detail.detail.expert.hospitalName;
        var position =  RenderParam.detail.detail.expert.jobTitle;
        var department =  RenderParam.detail.detail.expert.hdeptName;
        var specialties =  RenderParam.detail.detail.expert.specialties.replace(/[\r\n]/g,"");
        var introduction =  RenderParam.detail.detail.expert.introduction.replace(/[\r\n]/g,"");

        G("photo").src = Home.getImg(photo);
        G("name").innerHTML = name;
        G("hospital").innerHTML = hospital;
        G("position").innerHTML = position;
        G("department").innerHTML = department;
        G("content-detail").innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;擅长：" + specialties + "<br/>" + "&nbsp;&nbsp;&nbsp;&nbsp;简介：" + introduction;
    },

    /**
     * 获取图片
     */
    getImg: function (img_url) {
        return RenderParam.cwsGuaHaoUrl + "index.php?img_url=" + img_url;
    },

};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};
