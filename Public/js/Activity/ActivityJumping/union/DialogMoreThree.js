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
     * 闖關成功頁面
     */
    dialogCreateSuccess = {
        show: function (platformType) {
            CreateSuccess(platformType);
        }
    };
    /**
     * 闖關失败頁面
     * @param isCanAnswer 是否还可以答题
     */
    dialogCreateFalse = {
        show: function (platformType) {
            CreateFalse(platformType);
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
     * 未中奖
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

    var createActivity = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/rule_bg.png"/>';
        _html += '<table class="detail-table">';
        _html += '<img id="btn-one" class="btn_back" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/win_back_in.png"/>';
        _html += '<tr><td>1.每天访问活动页的用户免费获得1次游戏机会，订购1款产品每天获得2次游戏机会，订购2款产品每天获得4次游戏机会，以此类推。</td></tr>';
        _html += '<tr><td></td></tr>';
        _html += '<tr><td>2.活动奖品以实物为准，图片只作参考，获奖用户请及时补充联系电话，若未填写有效手机号，则视为自主放弃领奖。</td></tr>';
        _html += '<tr><td></td></tr>';
        _html += '<tr><td>3.奖品将在活动结束后15个工作日内，由工作人员与您联系确认奖品发放信息，请保持手机畅通。</td></tr>';
        _html += '</table>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };

    /**
     * 闖關成功
     */
    var CreateSuccess = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/succes_bg.png"/>';
        _html += '<div class="introduce">成功拿到礼物盒！赶紧打开看看吧~<br/></div>';
        _html += '<img id="btn-one" class="btn-success" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/btn_back_in.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "default_focus";
        /**
         * 确定按钮类型
         */
        focusType = "openUnion";
    };

    /**
     * 闖關失败
     */
    var CreateFalse = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/false_bg.png" />';
        _html += '<div class="introduce">真可惜，你离奖品还差一点儿</div>';
        _html += '<img  id="btn-one" class="btn-success" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/btn_back_in.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "continueAnswer";
    };

    /**
     * 中奖填写手机号码
     */
    var createPhone = function (platformType, name) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/phone_bg.png"/>';
        _html += '<div class="introduce_win_price">真厉害，获得' + name + '</div>';
        _html += '<div id="searchText">请输入有效的电话号码</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/submit_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/submit_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/submit_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/pay_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/pay_in.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/pay_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "save";
    };

    /**
     * 订购失败页
     */
    var createBookFalse = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/fault_bg.png"/>';
        _html += '<div class="introduce">订购失败<br/>请尝试重新订购<br/></div>';
        _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/rebook_in.gif" >';
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
    var createTime = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/false_bg.png"/>';
        _html += '<div class="introduce">您今天的游戏次数已经用完<br/>请明天再来挑战！</div>';
        _html += '<img  id="btn-one" class="btn-success" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/btn_back_in.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };

    /**
     * 非会员次数用完，订购页
     */
    var createUnVip = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/warm_bg.png"/>';
        _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>订购成为VIP即可开启宝箱</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/open_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/open_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/open_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/give_up_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/give_up_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/give_up_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "bookUnion";
    };

    /**
     * 未中奖
     */
    var createNoPrice = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/false_bg.png"/>';
        _html += '<div class="introduce">礼盒里什么都没有，再试试!</div>';
        _html += '<img  id="btn-one" class="btn-success" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/btn_back_in.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "noPrice";
    };

    /**
     * 次数用完页
     */
    var createUnionChoose = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/choose_order_bg.png"/>';
        _html += '<div class="introduce2">游戏机会用光了，订购以下产品获取更多游戏机会:</div>';
        _html += '<img id="pay-one"    src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/book1_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book1_in_booked2.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book1_out.png">';
        _html += '<img id="pay-two"    src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/book2_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book2_in_booked2.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book2_out.png">';
        _html += '<img id="pay-three"  src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/book3_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book3_in_booked2.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book3_out.png">';
        _html += '<img id="pay-four"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/book4_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book4_in_booked2.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book4_out.png">';
        _html += '<img id="pay-back"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/pay_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        /**
         * 确定按钮类型
         */
        focusType = "choose";
    };

    /**
     * 非会员次数用完，订购页
     */
    var createUnionBook = function (platformType, price) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/warm_bg.png"/>';
        _html += '<div class="introduce">游戏机会用光了，订购以下产品获取更多游戏机会！<br/>订购成为VIP即可开启宝箱</div>';
        _html += '<div class="book_text">订购</div>';
        _html += '<div class="book_text_name">' + price + '</div>';
        _html += '<div class="price_text">获取</div>';
        _html += '<div class="price_text_name">精美好礼</div>';
        _html += '<div class="introduce_text">自订购之日起，有效期30天，产品到期后<br/>如未订购，将会自动续订。</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/book_open_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book_open_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/book_open_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityJumping/union/give_up_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/give_up_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityJumping/union/give_up_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "bookUnion";
    };


})();