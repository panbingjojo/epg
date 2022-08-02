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
     * 闖關失败頁面
     * @param isCanAnswer 是否还可以答题
     */
    dialogCreateFalse = {
        show: function (platformType, isCanAnswer) {
            CreateFalse(platformType, isCanAnswer);
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

    /**
     * 创建活动页
     */
    var createActivity = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/winer_bg.png"/>';
        _html += '<img id="btn-one" class="btn_back" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/win_back_in.gif"/>';
        _html += '<img class="title_name"  src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/title_detail.png"/>';
        _html += '<img class="price_one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/price_one.png"/>';
        _html += '<img  class="price_two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/price_two.png"/>';
        _html += '<img  class="price_three" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/price_three.png"/>';
        _html += '<table class="detail-table">';
        _html += '<tr><td>1.每天访问活动页的用户，免费获得1次游戏机会，机会当日有效，次日清零；</td></tr>';
        _html += '<tr><td></td></tr>';
        _html += '<tr><td>2.活动期间，每订购1款产品获得2次游戏机会，订购2款产品获得4次游戏机会，以此类推。</td></tr>';
        _html += '<tr><td></td></tr>';
        _html += '<tr><td>3.活动奖品实物为准，图片只作参考，获奖用户需填写联系电话，活动结束后15个工作日内，由工作人员为获奖用户统一邮寄实物奖，若是获奖用户未填写有效的手机号码，则视为自主放弃领奖。 </td></tr>';
        _html += '</table>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "back"; //确定按钮类型
    };

    var CreateFalse = function (platformType, isCanAnswer) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/fault_bg.png"/>';
        _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/fault_in.gif" >';

        if (isCanAnswer) {
            _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>不服，再来一次<br/></div>';
            focusType = "continueAnswer"; //确定按钮类型
        } else {
            _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>不服，再来一次<br/></div>';
            focusType = "back"; //确定按钮类型
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
    };
    /**
     * 订购失败页
     */
    var createBookFalse = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/fault_bg.png"/>';
        _html += '<div class="introduce">订购失败<br/>请尝试重新订购<br/></div>';
        _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/rebook_in.gif" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "back"; //确定按钮类型
    };

    /**
     * 次数用完页
     */
    var createTime = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/winer_bg.png"/>';
        _html += '<img class="title_name"  src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/produce.png"/>';
        _html += '<img class="introduce2" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/time_over_word.png"/>';
        _html += '<img id="btn-one" class="btn-only2" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/get_in.gif" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "back"; //确定按钮类型
    };


    /**
     * 次数用完页
     */
    var createUnionChoose = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/choose_order_bg.png"/>';
        _html += '<div ><img id="tip_test" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/tip_test.png"/>';
        _html += '<div ><img id="choose_order_test" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/choose_order_text.png"/>';
        _html += '<img id="pay-one"    src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book1_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book1_in_booked.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book1_out.png">';
        _html += '<img id="pay-two"    src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book2_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book2_in_booked.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book2_out.png">';
        _html += '<img id="pay-three"  src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book3_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book3_in_booked.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book3_out.png">';
        _html += '<img id="pay-four"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book4_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book4_in_booked.png" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book4_out.png">';
        _html += '<img id="pay-back"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/back_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "choose"; //确定按钮类型
    };

    /**
     * 非会员次数用完，订购页
     */
    var createUnionBook = function (platformType, price) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/warm_bg.png"/>';
        _html += '<div class="book_text">订购</div>';
        _html += '<div class="book_text_name">' + price + '</div>';
        _html += '<div class="price_text">获取</div>';
        _html += '<div class="price_text_name">精美好礼</div>';
        _html += '<div class="introduce_text">自订购之日起，有效期30天，产品到期后<br/>如未订购，将会自动续订。</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book_open_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book_open_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/book_open_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_up_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_up_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_up_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "bookUnion"; //确定按钮类型
    };


    /**
     * 非会员次数用完，订购页
     */
    var createUnVip = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/warm_bg.png"/>';
        _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>订购成为VIP即可开启宝箱</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/open_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/open_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/open_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_up_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_up_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_up_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "bookUnion"; //确定按钮类型
    };

    /**
     * 末抽中、次数用户
     */
    var createNoPrice = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/winer_bg.png"/>';
        _html += '<img class="title_name"  src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/produce.png"/>';
        _html += '<img class="introduce" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/fault_word.png"/>';
        _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/get_in.gif" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "back"; //确定按钮类型
    };

    /**
     * 中奖填写手机号码
     */
    var createPhone = function (platformType, name) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/phone_bg.png"/>';
        _html += '<img class="introduce-price-text" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/price' + name + '.png"/>';
        _html += '<div id="searchText">请输入有效的电话号码</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/get_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/get_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/get_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivitySurfing/union/give_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "save"; //确定按钮类型
    };
})();