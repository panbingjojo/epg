/**
 * 用户抽中了将的弹框
 */
(function () {
    /**
     * 创建活动详情页
     */
    dialogCreateActivity = {
        show: function (platformType) {
            createActivity(platformType);
        }
    };
    /**
     * 中奖填写手机号码
     */
    dialogCreatePhone = {
        show: function (platformType) {
            createPhone(platformType);
        }
    };

    /**
     * 订购失败页活动页
     */
    dialogCreateBookFalse = {
        show: function (platformType) {
            createBookFalse(platformType);
        }
    };
    /**
     * 次数用完页
     */
    dialogCreateTime = {
        show: function (platformType) {
            createTime(platformType);
        }
    };
    /**
     * 非会员次数用完，订购页 -- 江苏电信
     */
    dialogCreateUnVip320092 = {
        show: function (platformType) {
            createUnVip320092(platformType);
        }
    };

    /**
     * 非会员次数用完，订购页
     */
    dialogCreateUnVip = {
        show: function (platformType) {
            createUnVip(platformType);
        }
    };

    /**
     * 末抽中红包再玩一次页面
     */
    dialogCreatePlay = {
        show: function (platformType) {
            createPlay(platformType);
        }
    };
    /**
     * 中奖页
     */
    dialogCreatePrice = {
        show: function (platformType, prizeName) {
            createPrice(platformType, prizeName);
        }
    };

    /**
     * 创建活动页
     */
    var createActivity = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/activity_rules_.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        focusType = "back"; //确定按钮类型
    };

    /**
     * 订购失败页
     */
    var createBookFalse = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/unvip_book_.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/rebook_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/rebook_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/rebook_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-7-1";
        focusType = "book"; //确定按钮类型
    };

    /**
     * 次数用完页
     */
    var createTime = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/play_times_over.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/play_times_over.png"  confirmurl="/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/play_times_over.png" />';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        focusType = "back"; //确定按钮类型
    };

    /**
     * 非会员次数用完，订购页---江苏电信
     */
    var createUnVip320092 = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/unvip_book_320092_.png"/>';
        _html += '<img id="focus-6-1" src=__ROOT__"/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png"/>';
        _html += '<img id="focus-7-1" src=__ROOT__"/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/add_vip_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/add_vip_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/add_vip_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-7-1";
        focusType = "book"; //确定按钮类型
    };

    /**
     * 非会员次数用完，订购页
     */
    var createUnVip = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/unvip_book_.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/add_vip_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/add_vip_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/add_vip_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-7-1";
        focusType = "book"; //确定按钮类型
    };

    /**
     * 末抽中红包再玩一次页面
     */
    var createPlay = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/price_is_null_.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/replay_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/replay_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/replay_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-7-1";
        focusType = "play"; //确定按钮类型
    };

    /**
     * 中奖填写手机号码
     */
    var createPhone = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/wrrite_phone_.png"/>';
        _html += '<img id="focus-8-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/back_out.png"/>';
        _html += '<input id="focus-9-1" type="text"/>';
        _html += '<img id="focus-10-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/save_out.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/save_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/save_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-9-1";
        focusType = "save"; //确定按钮类型
    };

    /**
     * 中奖页
     */
    var createPrice = function (platformType, prizeName) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityQianghongbao/V1/winning_.png"/>';
        _html += '<div id="priceText">' + prizeName;
        _html += '</div></div>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        focusType = "back"; //确定按钮类型
    }
})();