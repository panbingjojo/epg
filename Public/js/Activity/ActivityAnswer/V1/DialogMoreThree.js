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
     * 闖關成功頁面
     */
    dialogCreateSuccess = {
        show: function (resolution) {
            CreateSuccess(resolution);
        }
    };
    /**
     * 闖關失败頁面
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
    dialogCreateTime = {
        show: function (resolution) {
            createTime(resolution);
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
     * 闖關成功
     */
    var CreateSuccess = function (resolution) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/success_bg.png"/>';
            _html += '<div class="introduce-success">恭喜您获得一个宝箱！赶快打开吧~<br/></div>';
            _html += '<img id="btn-one" class="btn-success" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/open_in.gif" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/success_bg.png"/>';
            _html += '<div class="introduce-success">恭喜您获得一个宝箱！赶快打开吧~<br/></div>';
            _html += '<img id="btn-one" class="btn-success" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/open_in.gif" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        /**
         * 确定按钮类型
         */
        focusType = "open";
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
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/detail_bg.png"/>';
            _html += '<img id="btn-one" class="btn_back" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/win_back_in.gif"/>';
            _html += '<img class="price_one" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/price_one.png"/>';
            _html += '<img  class="price_two" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/price_two.png"/>';
            _html += '<img  class="price_three" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/price_three.png"/>';
            _html += '<table class="detail-table">';
            _html += '<tr><td>1.凡在活动期间，包月用户每天有1次答题抽奖机会，当日答题抽奖机会当天24点清零。</td></tr>';
            _html += '<tr><td>2.未订购“39健康”业务的用户在活动期间获赠1次试玩机会，成功订购业务成为包月用户后即可享受包月用户答题</td></tr>';
            _html += '<tr><td>抽奖权益。</td></tr>';
            _html += '<tr><td>3.活动奖品以实物为准，图片只作参考，获奖用户需填写联系电话，活动结束后15个工作日与其联系，统一邮寄奖</td></tr>';
            _html += '<tr><td>品。</td></tr>';
            _html += '<tr><td>4.获奖用户未正确填写电话号码或未填写电话号码，则视为自主放弃领奖。</td></tr>';
            _html += '</table>';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/detail_bg.png"/>';
            _html += '<img id="btn-one" class="btn_back" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/win_back_in.gif"/>';
            _html += '<img class="price_one" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/price_one.png"/>';
            _html += '<img  class="price_two" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/price_two.png"/>';
            _html += '<img  class="price_three" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/price_three.png"/>';
            _html += '<table class="detail-table">';
            _html += '<tr><td>1.凡在活动期间，包月用户每天有1次答题抽奖机会，当日答题</td></tr>';
            _html += '<tr><td>机会当天24点清零。</td></tr>';
            _html += '<tr><td>2.未订购“39健康”业务的用户在活动期间获赠1次试玩机会，成</td></tr>';
            _html += '<tr><td>功订购业务成为包月用户后即可享受包月用户答题抽奖权益。</td></tr>';
            _html += '<tr><td>3.活动奖品以实物为准，图片只作参考，获奖用户需填写联系</td></tr>';
            _html += '<tr><td>电话，活动结束后15个工作日与其联系，统一邮寄奖品。</td></tr>';
            _html += '<tr><td>4.获奖用户未正确填写电话号码或未填写电话号码，则视为自</td></tr>';
            _html += '<tr><td>主放弃领奖。</td></tr>';
            _html += '</table>';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
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
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/fault_bg.png"/>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/fault_in.gif" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/fault_bg.png"/>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/fault_in.gif" >';
        }
        if(isCanAnswer){
            _html += '<div class="introduce">真遗憾，答错了！<br/>请继续挑战<br/></div>';
            focusType = "continueAnswer";
        } else{
            _html += '<div class="introduce">真遗憾，答错了！<br/>请明天再来挑战来吧~<br/></div>';
            focusType = "back";
        }
        _html += '</div>';
        dialog.innerHTML = _html;
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
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/fault_bg.png"/>';
            _html += '<div class="introduce">订购失败<br/>请尝试重新订购<br/></div>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/rebook_in.gif" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/fault_bg.png"/>';
            _html += '<div class="introduce">订购失败<br/>请尝试重新订购<br/></div>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/rebook_in.gif" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        /**
         * 确定按钮类型
         */
        focusType = "back";
    };

    /**
     * 次数用完页
     */
    var createTime = function (resolution) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/warm_bg.png"/>';
            _html += '<div class="introduce">今日答题次数已用完<br/>请明天再来挑战吧!<br/></div>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/fault_in.gif" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/warm_bg.png"/>';
            _html += '<div class="introduce">今日答题次数已用完<br/>请明天再来挑战吧!<br/></div>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/fault_in.gif" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        /**
         * 确定按钮类型
         */
        focusType = "back";
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
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/warm_bg.png"/>';
            _html += '<div class="introduce">试玩结束<br/>订购成为VIP即可开起宝箱</div>';
            _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/open_out.png" onfocusurl="/Public/img/hd/Activity/ActivityAnswer/V1/open_in.gif" confirmurl="/Public/img/hd/Activity/ActivityAnswer/V1/open_out.png" >';
            _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/give_up_out.png"  onfocusurl="/Public/img/hd/Activity/ActivityAnswer/V1/give_up_in.gif" confirmurl="/Public/img/hd/Activity/ActivityAnswer/V1/give_up_out.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/warm_bg.png"/>';
            _html += '<div class="introduce">试玩结束<br/>订购成为VIP即可开起宝箱</div>';
            _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/open_out.png" onfocusurl="/Public/img/hd/Activity/ActivityAnswer/V1/open_in.gif" confirmurl="/Public/img/hd/Activity/ActivityAnswer/V1/open_out.png" >';
            _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/give_up_out.png"  onfocusurl="/Public/img/hd/Activity/ActivityAnswer/V1/give_up_in.gif" confirmurl="/Public/img/hd/Activity/ActivityAnswer/V1/give_up_out.png" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        /**
         * 确定按钮类型
         */
        focusType = "book";
    };

    /**
     * 末抽中
     */
    var createNoPrice = function (resolution) {
        var _html = "";
        /**
         * 高清背景
         */
        if (resolution == "hd") {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/warm_bg.png"/>';
            _html += '<div class="introduce">真遗憾，和奖品擦肩而过！<br/>请明天再挑战！</div>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/fault_in.gif" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/warm_bg.png"/>';
            _html += '<div class="introduce">真遗憾，和奖品擦肩而过！<br/>请明天再挑战！</div>';
            _html += '<img id="btn-one" class="btn-only" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/fault_in.gif" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
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
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/warm_bg.png"/>';
            _html += '<div class="introduce-price-text">恭喜您获得：<span class="introduce-price-name">' + name + '</span></div>';
            _html += '<div id="myPhone">请英雄留下您的联系方式</div>';
            _html += '<div id="searchText">请输入有效的电话号码</div>';
            _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/get_out.png" onfocusurl="/Public/img/hd/Activity/ActivityAnswer/V1/get_in.gif" confirmurl="/Public/img/hd/Activity/ActivityAnswer/V1/get_out.png" >';
            _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/img/hd/Activity/ActivityAnswer/V1/give_out.png"  onfocusurl="/Public/img/hd/Activity/ActivityAnswer/V1/give_in.gif" confirmurl="/Public/img/hd/Activity/ActivityAnswer/V1/give_out.png" >';
        } else {
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/warm_bg.png"/>';
            _html += '<div class="introduce-price-text">恭喜您获得：<span class="introduce-price-name">' + name + '</span></div>';
            _html += '<div id="myPhone">请英雄留下您的联系方式</div>';
            _html += '<div id="searchText">请输入有效的电话号码</div>';
            _html += '<img id="btn-one" class="btn-one" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/get_out.png" onfocusurl="/Public/img/sd/Activity/ActivityAnswer/V1/get_in.gif" confirmurl="/Public/img/sd/Activity/ActivityAnswer/V1/get_out.png" >';
            _html += '<img id="btn-two" class="btn-two" src="__ROOT__/Public/img/sd/Activity/ActivityAnswer/V1/give_out.png"  onfocusurl="/Public/img/sd/Activity/ActivityAnswer/V1/give_in.gif" confirmurl="/Public/img/sd/Activity/ActivityAnswer/V1/give_out.png" >';
        }
        _html += '</div>';
        dialog.innerHTML = _html;
        /**
         * 确定按钮类型
         */
        focusType = "save";
    };
})();