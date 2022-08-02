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
        show: function (platformType, name) {
            createPhone(platformType, name);
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
     * 会员次数用完页
     */
    dialogCreateTime = {
        show: function (platformType) {
            createTime(platformType);
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
     * 未中动物
     */
    dialogNoPrice = {
        show: function (platformType) {
            createNoPrice(platformType);
        }
    };

    /**
     * 联合订购选择页
     */
    dialogUnionChoose = {
        show: function (platformType) {
            createUnionChoose(platformType);
        }
    };

    /**
     * 联合订购页
     */
    dialogUnionBook = {
        show: function (platformType, price) {
            createUnionBook(platformType, price);
        }
    };

    /**
     * 对象积分不够
     */
    dialogNoPoints = {
        show: function (platformType) {
            createNoPoints(platformType);
        }
    };
    /**
     * 已经兑过奖
     */
    dialogAlreadyPrice = {
        show: function (platformType) {
            alreadyPrice(platformType);
        }
    };
    /**
     * 订购成功
     */
    dialogBookSucces = {
        show: function (platformType) {
            createBookSucces(platformType);
        }
    };

    /**
     * 订购失败
     */
    dialogBookFalse = {
        show: function (platformType) {
            createBookFalse(platformType);
        }
    };

    /**
     * 创建活动规则说明页
     */
    var createActivity = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/rule_bg.png"/>';
        _html += '<div class="mTitle">活动规则</div>';
        _html += '<table class="detail-table">';
        _html += '<tr><td>	1、活动期间，每天访问活动页的用户可免费获得1次游戏机会，每成功订购一款产品，即可每天额外获得2次游戏机会，以此类推，游戏机会不可累加，次日作废。 </td></tr>';
        _html += '<tr><td></td></tr>';
        _html += '<tr><td>2、每次游戏完成1件家务便可获得10积分，消耗不同积分有机会获得相应奖品，数量有限，兑完为止。</td></tr>';
        _html += '<tr><td></td></tr>';
        _html += '<tr><td>3、活动奖品以实物为准，图片只作参考，获奖用户请及时补充联系电话，若未填写有效手机号，则视为自主放弃领奖。<br/></td></tr>';
        _html += '<tr><td></td></tr>';
        _html += '<tr><td>	4、奖品将在活动结束后15个工作日内，由工作人员与您联系确认奖品发放信息，请保持手机畅通。 </td></tr>';
        _html += '</table>';
        _html += '<img id="rule_back" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/list_back_in.gif"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };

    /**
     * 次数用完页
     */
    var createTime = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/time_over.png"/>';
        _html += '<div class="mTitle">次数用尽</div>';
        _html += '<div class="content">您今天的游戏次数已用完<br/>家务要天天做哦，记得明天再来！</div>';
        _html += '<img id="btn-one" class="btn-only"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_back_in.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };


    /**
     * 次数用完页
     */
    var createUnionChoose = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/choose_order_bg.png"/>';
        _html += '<div class="mTitle">次数用尽</div>';
        _html += '<div class="content">机会用光了，订购以下产品<br/>获取更多游戏机会</div>';
        _html += '<img id="pay-one"    src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book1_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book1_in_booked.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book1_out.png">';
        _html += '<img id="pay-two"    src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book2_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book2_in_booked.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book2_out.png">';
        _html += '<img id="pay-three"  src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book3_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book3_in_booked.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book3_out.png">';
        _html += '<img id="pay-four"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book4_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book4_in_booked.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book4_out.png">';
        _html += '<img id="pay-back"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/list_back_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        /**
         * 确定按钮类型
         */
        focusType = "choose";
    };

    /**
     * 末抽中、次数用户
     */
    var createNoPrice = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/no_animal.png"/>';
        _html += '<div class="mTitle">真遗憾</div>';
        _html += '<div class="content">这次未能抽中心意奖品，继续努力哦~<br/>勤劳的孩子运气不会太差的！</div>';
        _html += '<img id="btn-one" class="btn-only"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_back_in.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back"; // 抽奖模式
    };


    /**
     * 兑奖积分不够
     */
    var createNoPoints = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/no_points.png"/>';
        _html += '<div class="mTitle">积分不足</div>';
        _html += '<div class="content">您的积分还不足，还不能抽奖哦~继续努力</div>';
        _html += '<img id="btn-one" class="btn-only"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_back_in.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };
    /**
     * 已经兑过奖
     */
    var alreadyPrice = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/already_price.png"/>';
        _html += '<img id="btn-one" class="btn-only"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_back_in.gif" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };
    /**
     * 订购成功
     */
    var createBookSucces = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_succes.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        focusType = "back";
    };

    /**
     * 订购失败
     */
    var createBookFalse = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_false.png"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        focusType = "back";
    };

    /**
     * 中奖填写手机号码
     */
    var createPhone = function (platformType, name) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/phone_bg.png"/>';
        _html += '<div class="mTitle">中奖啦</div>';
        _html += '<div class="content2">成功抽中&nbsp;&nbsp;<span class="yee">' + name + '&nbsp;&nbsp;</span>，留下您的联系方式领奖吧！</div>';
        _html += '<div class="myPhone">我的手机号:</div>';
        _html += '<div id="searchText">请输入有效的电话号码</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_back_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_back_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/book_back_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityCleaning/union/give_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/give_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivityCleaning/union/give_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "save";
    };
})();