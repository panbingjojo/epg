/**
 * 用户抽中了将的弹框
 */
(function () {
    /**
     * 创建活动详情页
     */
    dialogCreateActivity = {
        show: function (resolution) {
            createActivity(resolution);
        }
    };

    /**
     * 抽奖失败
     * @param isCanAnswer 是否还可以答题
     */
    dialogCreateFalse = {
        show: function (resolution, isCanAnswer) {
            CreateFalse(resolution, isCanAnswer);
        }
    };
    /**
     * 中奖填写手机号码
     */
    dialogCreatePhone = {
        show: function (resolution, name) {
            createPhone(resolution, name);
        }
    };

    /**
     * 订购失败页活动页
     */
    dialogCreateBookFalse = {
        show: function (resolution) {
            createBookFalse(resolution);
        }
    };
    /**
     * 会员次数用完页
     */
    dialogCreateTimeOver = {
        show: function (resolution) {
            createTimeOver(resolution);
        }
    };
    /**
     * 非会员次数用完，订购页
     */
    dialogCreateUnVip = {
        show: function (resolution) {
            createUnVip(resolution);
        }
    };

    /**
     * 未中奖
     */
    dialogNoPrice = {
        show: function (resolution) {
            createNoPrice(resolution);
        }
    };

    /**
     * 联合订购选择页
     */
    dialogUnionChoose = {
        show: function (resolution) {
            createUnionChoose(resolution);
        }
    };

    /**
     * 创建活动页
     */
    var createActivity = function (resolution) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/rule_bg.png"/>';
            _html += '<img id="btn-one" class="btn_back" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/close_in.gif"/>';
            _html += '<table class="detail-table">';
            _html += '<tr><td>1.活动期间，每天访问活动页的普通用户可免费获得1次游戏机会，成功订购成为VIP后，即可每天额外获得3次游戏机会，机会不可累加，次日作废。</td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td>2.每次游戏接到10枚以上月饼便可参与抽奖1次，精美奖品等你带回家。</td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td>3.活动奖品以实物为准，图片只作参考，获奖用户请及时补充联系电话，若未填写有效手机号，则视为自主放弃领奖。 </td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td>4.奖品将在活动结束后15个工作日内，由工作人员与您联系确认奖品发放信息，请保持手机畅通。 </td></tr>';
            _html += '</table>';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/rule_bg.png"/>';
            _html += '<img id="btn-one" class="btn_back" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/close_in.gif"/>';
            _html += '<table class="detail-table">';
            _html += '<tr><td>1.活动期间，每天访问活动页的普通用户可免费获得1次游戏机会，成功订购成为VIP后，即可每天额外获得3次游戏机会，机会不可累加，次日作废。</td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td>2.每次游戏接到10枚以上月饼便可参与抽奖1次，精美奖品等你带回家。</td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td>3.活动奖品以实物为准，图片只作参考，获奖用户请及时补充联系电话，若未填写有效手机号，则视为自主放弃领奖。 </td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td></td></tr>';
            _html += '<tr><td>4.奖品将在活动结束后15个工作日内，由工作人员与您联系确认奖品发放信息，请保持手机畅通。 </td></tr>';
            _html += '</table>';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };

    var CreateFalse = function (resolution, isCanAnswer) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/fault_bg.png"/>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/fault_in.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/fault_bg.png"/>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/fault_in.png" >';
        }
        if (isCanAnswer) {
            _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>不服，再来一次<br/></div>';
            focusType = "continueAnswer"; // 进行下一步，判断是否还有产品未订购还是已经订购完了次数用尽
        } else {
            _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>不服，再来一次<br/></div>';
            focusType = "back"; // 返回首页
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
    };
    /**
     * 订购失败页
     */
    var createBookFalse = function (resolution) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/fault_bg.png"/>';
            _html += '<div class="introduce">订购失败<br/>请尝试重新订购<br/></div>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/rebook_in.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/fault_bg.png"/>';
            _html += '<div class="introduce">订购失败<br/>请尝试重新订购<br/></div>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/rebook_in.png" >';
        }
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
    var createTimeOver = function (resolution) {
        var _html = "";
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/time_over_bg.png"/>';
            _html += '<img id="btn-one" class="btn-only2" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/confirm_in.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/time_over_bg.png"/>';
            _html += '<img id="btn-one" class="btn-only2" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/confirm_in.png" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };


    /**
     * 次数用完页，但还有未订购
     */
    var createUnionChoose = function (resolution) {
        var _html = "";
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/union_book_bg.png"/>';
            _html += '<img id="btn-one" class="btn-left" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/confirm_out.png" onfocusurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/confirm_in.png" confirmurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/confirm_out.png" >';
            _html += '<img id="btn-two" class="btn-right" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/cancel_out.png"  onfocusurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/cancel_in.png" confirmurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/cancel_out.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/union_book_bg.png"/>';
            _html += '<img id="btn-one" class="btn-left" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/confirm_out.png" onfocusurl="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/confirm_in.png" confirmurl="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/confirm_out.png" >';
            _html += '<img id="btn-two" class="btn-right" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/cancel_out.png"  onfocusurl="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/cancel_in.png" confirmurl="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/cancel_out.png" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "bookVip"; //按钮类型：确定按钮-->订购VIP
    };


    /**
     * 非会员次数用完，订购页
     */
    var createUnVip = function (resolution) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/warm_bg.png"/>';
            _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>订购成为VIP即可开启宝箱</div>';
            _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/open_out.png" onfocusurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/open_in.png" confirmurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/open_out.png" >';
            _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/give_up_out.png"  onfocusurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/give_up_in.png" confirmurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/give_up_out.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/warm_bg.png"/>';
            _html += '<div class="introduce">真遗憾，差一点就中奖了！<br/>订购成为VIP即可开启宝箱</div>';
            _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/open_out.png" onfocusurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/open_in.png" confirmurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/open_out.png" >';
            _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/give_up_out.png"  onfocusurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/give_up_in.png" confirmurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/give_up_out.png" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "bookUnion";
    };

    /**
     * 末抽中、次数用户
     */
    var createNoPrice = function (resolution) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/not_won.png"/>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/confirm_in.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/not_won.png"/>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/confirm_in.png" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };

    /**
     * 中奖填写手机号码
     */
    var createPhone = function (resolution, name) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/Winning_bg.png"/>';

            _html += '<div class="price_word">' + name + ' </div>';
            _html += '<div class="price_introduce">留下您的联系方式以便领奖哦~ </div>';
            _html += '<div id="searchText">请输入有效的电话号码</div>';
            _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/confirm_out.png" onfocusurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/confirm_in.png" confirmurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/confirm_out.png" >';
            _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/cancel_out.png"  onfocusurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/cancel_in.png" confirmurl="__ROOT__/Public/img/hd/Activity/ActivityMidAutumn/V340092/cancel_out.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/Winning_bg.png"/>';

            _html += '<div class="price_word">' + name + ' </div>';
            _html += '<div class="price_introduce">留下您的联系方式以便领奖哦~ </div>';
            _html += '<div id="searchText">请输入有效的电话号码</div>';
            _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/confirm_out.png" onfocusurl="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/confirm_in.png" confirmurl="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/confirm_out.png" >';
            _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/cancel_out.png"  onfocusurl="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/cancel_in.png" confirmurl="__ROOT__/Public/img/sd/Activity/ActivityMidAutumn/V340092/cancel_out.png" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        /**
         * 确定按钮类型
         */
        focusType = "save";
    };
})();