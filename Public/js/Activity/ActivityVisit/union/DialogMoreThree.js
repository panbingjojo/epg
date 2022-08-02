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
     * 抽奖失败
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
     * 订购成功页活动页
     */
    dialogCreateBookSucces = {
        show: function (platformType) {
            createBookSucces(platformType);
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
     * 会员次数用完页
     */
    dialogCreateTimeOver = {
        show: function (platformType) {
            createTimeOver(platformType);
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
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/detail_bg.png"/>';
        _html += '<img id="btn-one" class="btn_back" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/win_back_in.gif"/>';
        _html += '<img class="price_one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/price_one.png"/>';
        _html += '<img  class="price_two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/price_two.png"/>';
        _html += '<img  class="price_three" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/price_three.png"/>';
        _html += '<table class="detail-table">';
        _html += '<tr><td>1.每天访问活动页的用户，免费获得1个礼包，礼包当日有效，次日清零。 </td></tr>';
        _html += '<tr><td>2.活动期间，每订购1款产品获得2个礼包，订购2款产品获得4个礼包，以此类推。 </td></tr>';
        _html += '<tr><td>3.活动奖品实物为准，图片只作参考，获奖用户需填写联系电话，活动结束后15个工作日内，由工作人员为获奖用户统一邮寄实物奖，若是获奖用户未填写有效的电话号码，则视为自主放弃领奖。 </td></tr>';
        _html += '</table>';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "back"; // 按钮功能
    };

    var CreateFalse = function (platformType, isCanAnswer) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/warm_bg.png"/>';
        _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/fault_in.gif" >';
        if (isCanAnswer) {
            _html += '<div class="introduce">真遗憾！健康礼包里面<br/>什么都没有，继续努力！<br/></div>';
            /** 确定按钮类型 */
            focusType = "back"; // 返回首页，点击玩游戏继续抽奖
        } else {
            _html += '<div class="introduce">真遗憾，和奖品擦肩而过！<br/>请明天再战！<br/></div>';
            /** 确定按钮类型 */
            focusType = "drawn"; // 进行下一步，判断是否还有产品未订购还是已经订购完了次数用尽
        }
        _html += '</div>';
        dialog.innerHTML = _html;
    };
    /**
     * 订购失败页
     */
    var createBookFalse = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/book_false.png"/>';
        _html += '<div class="introduce2">订购失败</div>';
        _html += '<div  id="btn-one"></div>';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "back"; // 按钮功能
    };

    /**
     * 订购成功
     */
    var createBookSucces = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/book_success.png"/>';
        _html += '<div class="introduce2">订购成功</div>';
        _html += '<div  id="btn-one"></div>';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "back"; // 按钮功能
    };
    /**
     * 答题次数用完
     */
    var createTimeOver = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/warm_bg.png"/>';
        _html += '<div class="introduce">今日领取礼包的次数已用完<br/>请明天再来!<br/></div>';
        _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/fault_in.gif" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "back"; // 按钮功能
    };

    /**
     * 次数用完页
     */
    var createTime = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/time_over_bg.png"/>';
        _html += '<div class="introduce-pay">机会用光了，订购以下产品获得<br/>更多赢礼包机会</div>';
        _html += '<img id="btn-one" class="pay-one"  src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/book1_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book1_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book1_out.png">';
        _html += '<img id="pay-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/book2_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book2_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book2_out.png">';
        _html += '<img id="pay-three" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/book3_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book3_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book3_out.png">';
        _html += '<img id="pay-four" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/book4_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book4_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book4_out.png">';
        _html += '<img id="pay-back"   src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/pay_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "bookUnion"; // 按钮功能
    };

    /**
     * 非会员次数用完，订购页
     */
    var createUnionBook = function (platformType, price) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/warm_bg.png"/>';
        _html += '<div class="book_text">订购</div>';
        _html += '<div class="book_text_name">' + price + '</div>';
        _html += '<div class="price_text">获取</div>';
        _html += '<div class="price_text_name">精美好礼</div>';
        _html += '<div class="introduce_text">自订购之日起，有效期30天，产品到期后<br/>如未订购，将会自动续订。</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/book_open_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book_open_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/book_open_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/give_up_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/give_up_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/give_up_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "bookUnion"; // 按钮功能
    };


    /**
     * 非会员次数用完，订购页
     */
    var createUnVip = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/warm_bg.png"/>';
        _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>订购成为VIP即可开启宝箱</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/open_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/open_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/open_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/give_up_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/give_up_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/give_up_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "bookUnion"; // 按钮功能
    };

    /**
     * 末抽中、次数用户
     */
    var createNoPrice = function (platformType) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/warm_bg.png"/>';
        _html += '<div class="introduce">真遗憾，和奖品擦肩而过！<br/>请明天再挑战！</div>';
        _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/fault_in.gif" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "back"; // 按钮功能
    };

    /**
     * 中奖填写手机号码
     */
    var createPhone = function (platformType, name) {
        var _html = '';
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/warm_bg.png"/>';
        _html += '<div class="introduce-price-text">恭喜您获得：<span class="introduce-price-name">' + name + '</span></div>';
        _html += '<div id="myPhone">请留下您的联系方式</div>';
        _html += '<div id="searchText">请输入有效的电话号码</div>';
        _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/confrim_out.png" onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/confrim_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/confrim_out.png" >';
        _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityVisit/union/cancle_out.png"  onfocusurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/cancle_in.gif" confirmurl="/Public/' + platformType + '/img/Activity/ActivityVisit/union/cancle_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        focusType = "save"; // 按钮功能
    };

})();