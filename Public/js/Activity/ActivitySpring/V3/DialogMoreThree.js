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
     * 次数用完页联通
     */
    dialogCreateTime = {
        show: function (platformType, n) {
            createTime(platformType, n);
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
     * 末抽中红包再玩一次页面
     */
    dialogCreatePlay = {
        show: function (platformType, n) {
            createPlay(platformType, n);
        }
    };

    /**
     * 非会员次数用完，订购页
     */
    dialogCreateUnVip = {
        show: function (platformType, n) {
            createUnVip(platformType, n);
        }
    };

    /**
     * 创建活动页
     */
    var createActivity = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/activity_rules_.png"/>';
        _html += '<img id="focus-5-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_guide_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_guide_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_guide_out.png"/>';
        _html += '<div id="rule_content" ><p>1.活动期间，进入活动页面的用户，活动开始前7日，每天可获得1次抽奖机会，成功订购”远程医疗“业务成为VIP会员后，每天可获得3次抽奖机会；活动期间，所有用户在活动页面通过抽奖有机会获得5元、50元、100元翼支付红包、合肥海洋世界亲子票、合肥万达主题乐园亲子票等精美奖品。所有用户抽奖机会仅限当日使用，次日作废。</p>';
        _html += '<p>2.活动奖品以实物为准，图片只作参考；获奖用户需填写联系电话，红包奖品，工作人员将在活动结束后10个工作日内以话费形式充值至您预留的电信手机号码中；实物奖品，工作人员将在活动结束后10个工作日内，根据您预留的联系方式联系您并确认奖品发放方式。</p>';
        _html += '<p>3.兑奖规则：活动期间，所有获奖用户需在活动期间订购”远程医疗“业务才有资格领取奖品，获奖用户若未预留联系方式或是未预留有效的联系方式，视为放弃领奖。</p></div>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-5-1";
        focusType = "back"; //确定按钮类型
    };

    /**
     * 末抽中红包再玩一次页面
     */
    var createPlay = function (platformType, n) {
        var _html = "";
        /**
         * 高清背景
         */
        if (platformType == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/dialog_bg_.png"/>';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/price_is_null_.png"/>';//标清背景
        }
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/replay_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/replay_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/replay_out.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        /**
         * 确定按钮类型
         */
        focusType = "play";
    };

    /**
     * 订购失败页
     */
    var createBookFalse = function (platformType, n) {
        var _html = "";
        /**
         * 高清背景
         */
        if (platformType == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/dialog_bg_.png"/>';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/book_false_.png"/>';//标清背景
        }
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/rebook_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/rebook_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/rebook_out.png"/>';
        _html += '<div id="titel_introduce" >真遗憾！订购失败！</div>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        focusType = "book"; //确定按钮类型
    };


    /**
     * 次数用完页
     */
    var createTime = function (platformType, n) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/dialog_bg_.png" />';
        _html += '</div>';
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png"/>';
        _html += '<div id="titel_introduce" >您今天的出游次数不足，请明天再来哦！</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-7-1";
        focusType = "back"; //确定按钮类型
    };

    /**
     * 非会员次数用完，订购页---江苏电信
     */
    var createUnVip320092 = function (platformType, n, bg) {
        var _html = "";
        /**
         * 高清背景
         */
        if (platformType == "hd") {
            if (bg == "play") {
                _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/unvip_book__game_320092_.png"/>';
            } else {
                _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/unvip_book_320092_.png"/>';
            }
        } else {
            if (bg == "play") {
                _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/unvip_book__game_320092_.png"/>';//标清背景
            } else {
                _html += '<div ><img id="default_focus" style="position: absolute;top: 328px;" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/unvip_book_320092_.png"/>';//标清背景
            }
        }
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png"/>';
        if (platformType == "hd") {
            _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_out.png" style="position: absolute;top: 500px;left: 520px;" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_out.png"/>';
        } else {
            _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_out.png" style="position: absolute;top: 328px;"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_out.png"/>';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        focusType = "book"; //确定按钮类型
    };

    /**
     * 非会员次数用完，订购页
     */
    var createUnVip = function (platformType, n) {
        var _html = "";
        /**
         * 高清背景
         */
        if (platformType == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/dialog_bg_.png"/>';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/price_is_null_.png"/>';//标清背景
        }
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/add_vip_out.png"/>';
        _html += '<div id="titel_introduce" >您今天的出游次数不足，订购获取更多出游机会！</div>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        focusType = "book"; //确定按钮类型
    };

    /**
     * 末抽中红包再玩一次页面
     */
    var createPlay = function (platformType, n) {
        var _html = "";
        /**
         * 高清背景
         */
        if (platformType == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/dialog_bg_.png"/>';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/price_is_null_.png"/>';//标清背景
        }
        _html += '<img id="tips" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/tips_' + n + '.png"/>';
        _html += '<img id="focus-7-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/replay_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/replay_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/replay_out.png"/>';
        _html += '<div id="titel_introduce" >真遗憾，没找到礼物哦！</div>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-6-1";
        focusType = "play"; //确定按钮类型
    };

    /**
     * 中奖填写手机号码
     */
    var createPhone = function (platformType, prizeName) {
        var _html = "";
        /**
         * 高清背景
         */
        if (platformType == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/price_bg_.png"/>';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/price_come_.png"/>';//标清背景
        }
        _html += '<div id="price">' + prizeName + '</div>';
        _html += '<input id="focus-8-1" type="text"  placeholder="请输入正确的电话号码"/>';
        _html += '<div id="phone_name">手机号码:</div>';
        _html += '<div id="price_name_text">恭喜您获得:</div>';
        _html += '<img id="price_box" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/price_box.png" />';
        _html += '<img id="focus-9-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/save_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/save_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/save_out.png"/>';
        _html += '<img id="focus-10-1" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySpring/V3/back_out.png"/>';
        _html += '<div class="phone-warm">温馨提示：为了方便奖品发放，请留下您有效的手机号码，所中奖品若是红包，请务必填写有效的电信手机号，否则视为放弃领奖资格!</div>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "focus-8-1";
        focusType = "save"; //确定按钮类型
    };

})();