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
        show: function (platformType, prizeName) {
            createPhone(platformType, prizeName);
        }
    };

    /**
     * 订购失败页活动页
     */
    dialogCreateBookFalse = {
        show: function (platformType, n) {
            createBookFalse(platformType, n);
        }
    };
    /**
     * 次数用完页江苏
     */
    dialogCreateTime = {
        show: function (platformType, n, bg) {
            createTime(platformType, n, bg);
        }
    };

    /**
     * 次数用完页联通
     */
    dialogCreateTime000051 = {
        show: function (platformType, n, bg) {
            createTime000051(platformType, n, bg);
        }
    };
    /**
     * 非会员次数用完，订购页 -- 江苏电信
     */
    dialogCreateUnVip320092 = {
        show: function (platformType, n, bg) {
            createUnVip320092(platformType, n, bg);
        }
    };

    /**
     * 非会员次数用完，订购页
     */
    dialogCreateUnVip = {
        show: function (platformType, n, bg) {
            createUnVip(platformType, n, bg);
        }
    };

    /**
     * 末抽中红包再玩一次页面
     */
    dialogCreatePlay = {
        show: function (platformType, n) {
            createPlay(platformType, n);
        }
    };
    /**
     * 中奖页
     */
    dialogCreatePrice = {
        show: function (platformType, prizeName, n) {
            createPrice(platformType, prizeName, n);
        }
    };

    /**
     * 创建活动页
     */
    var createActivity = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/activity_rules_.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/activity_rules_.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/activity_rules_.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        focusType = "back"; //确定按钮类型
    };

    /**
     * 订购失败页
     */
    var createBookFalse = function (platformType, n) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/book_false_.png"/>';
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/rebook_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/rebook_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/rebook_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        focusType = "book"; //确定按钮类型
    };

    /**
     * 次数用完页
     */
    var createTime = function (platformType, n, bg) {
        var _html = '';
        if (bg == "play") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_game_.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_game_.png"  confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_game_.png" />';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_.png"  confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_.png" />';
        }
        _html += '</div>';
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/tips_' + n + '.png"/>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        focusType = "back"; //确定按钮类型
    };


    /**
     * 次数用完页
     */
    var createTime000051 = function (platformType, n, bg) {
        var _html = '';
        if (bg == "play") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_game_000051_.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_game_000051_.png"  confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_game_000051_.png" />';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_.png"  confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/play_times_over_.png" />';
        }
        _html += '</div>';
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/tips_' + n + '.png"/>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        focusType = "back"; //确定按钮类型
    };

    /**
     * 非会员次数用完，订购页---江苏电信
     */
    var createUnVip320092 = function (platformType, n, bg) {
        var _html = '';
        if (bg == "play") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/unvip_book__game_320092_.png"/>';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/unvip_book_320092_.png"/>';
        }
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png"/>';
        if (platformType == "hd") {
            _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_out.png" style="position: absolute;top: 500px;left: 520px;" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_out.png"/>';
        } else {
            _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_out.png" style="position: absolute;top: 328px;"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_out.png"/>';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        focusType = "book"; //确定按钮类型
    };

    /**
     * 非会员次数用完，订购页
     */
    var createUnVip = function (platformType, n, bg) {
        var _html = "";
        /**
         * 高清背景
         */
        if (platformType == "hd") {
            if (bg == "play") {
                _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/unvip_book__game_000051_.png"/>';
            } else {
                _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/unvip_book_320092_.png"/>';
            }
        } else {
            if (bg == "play") {
                _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/unvip_book__game_000051_.png"/>';//标清背景
            } else {
                _html += '<div ><img id="default_focus" style="position: absolute;top: 328px;" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/unvip_book_320092_.png"/>';//标清背景
            }
        }
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png"/>';
        if (platformType == "hd") {
            _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_out.png" style="position: absolute;top: 500px;left: 520px;" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_out.png"/>';
        } else {
            _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_out.png" style="position: absolute;top: 328px;"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/add_vip_out.png"/>';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        focusType = "book"; //确定按钮类型
    };

    /**
     * 末抽中红包再玩一次页面
     */
    var createPlay = function (platformType, n) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/price_is_null_.png"/>';
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/replay_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/replay_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/replay_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        focusType = "play"; //确定按钮类型
    };

    /**
     * 中奖填写手机号码
     */
    var createPhone = function (platformType, prizeName) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/price_come_.png"/>';
        _html += '<div id="price">' + prizeName + '</div>';
        _html += '<input id="focus-8-1" type="text"  placeholder="请输入正确的电话号码"/>';
        _html += '<img id="focus-9-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/save_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/save_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/save_out.png"/>';
        _html += '<img id="focus-10-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V1/back_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        G("focus-8-1").focus();
        dialogFocusId = "focus-8-1";
        focusType = "save"; //确定按钮类型
    };

    /**
     * 中奖页
     */
    var createPrice = function (platformType, prizeName, n) {
        var _html = '';
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/tips_' + n + '.png"/>';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V1/price_phone_.png"/>';
        _html += '<div id="priceText">' + prizeName;
        _html += '<div id="focus-7-1">';
        _html += '</div></div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-7-1";
        focusType = "back"; //确定按钮类型
    }
})();