(function () {
    /**
     * 创建活动详情页
     */
    dialogCreateActivity = {
        show: function () {
            createActivity();
        }
    };

    // 测试结果
    dialogCreateResult = {
        show: function () {
            testResult();
        }
    };

    /**
     * 抽奖失败
     * @param isCanAnswer 是否还可以答题
     */
    dialogCreateFalse = {
        show: function (isCanAnswer) {
            CreateFalse(isCanAnswer);
        }
    };
    /**
     * 中奖页：中奖填写手机号码
     */
    dialogCreatePhone = {
        show: function (name, prizeName) {
            createPhone(name, prizeName);
        }
    };

    /**
     * 订购失败页活动页
     */
    dialogCreateBookFalse = {
        show: function () {
            createBookFalse();
        }
    };
    /**
     * 会员次数用完页
     */
    dialogCreateTimeOver = {
        show: function () {
            createTimeOver();
        }
    };
    /**
     * 非会员次数用完，订购页
     */
    dialogCreateUnVip = {
        show: function () {
            createUnVip();
        }
    };

    /**
     * 未中奖
     */
    dialogNoPrice = {
        show: function () {
            createNoPrice();
        }
    };

    /**
     * 显示测试结果
     */
    dialogTestResultPage = {
        /**
         *
         * @param resolution 平台 hd / sd
         * @param answersType 题库类型：1-趣味小常识 2-心理测试 3-亚健康测试
         * @param answersSubType 题目具体的类型 type 1-7
         * @param message 显示提示内容
         */
        show: function (resolution, answersType, answersSubType, message) {
            createTestResultPage(resolution, answersType, answersSubType, message);
        }
    };

    /**
     * 创建活动页
     */
    var createActivity = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/bg_rule.png"/>';
        _html += '<img id="btn-close" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/close_f.gif"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-close";
        focusType = "back"; // 按钮功能
    };

    /**
     * 订购失败页
     */
    var createBookFalse = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/fault_bg.png"/>';
        _html += '<div class="introduce">订购失败<br/>请尝试重新订购<br/></div>';
        _html += '<img id="btn-one" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/rebook_in.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "back"; // 按钮功能
    };

    /**
     * 次数用完页
     */
    var createTimeOver = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/bg_no_all_times.png"/>';
        _html += '<img id="btn-one" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_sure_f.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "back"; // 按钮功能
    };

    /**
     * 非会员次数用完，订购页
     */
    var createUnVip = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/bg_no_times.png"/>';
        _html += '<img  id="btn-sure" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_sure.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_sure_f.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_sure.png" >';
        _html += '<img  id="btn-cancle" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_cancle.png"  onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn-cancle_f.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn-cancle.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-sure";
        focusType = "book"; // 按钮功能
    };

    /**
     * 末抽中、次数用户
     */
    var createNoPrice = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/bg_unwin.png"/>';
        _html += '<img id="btn-one" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_sure.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "back"; // 按钮功能
    };

    /**
     * 中奖页：中奖填写手机号码
     */
    var createPhone = function (platformType, prizeName) {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/bg_win.png"/>';
        _html += '<img id="goods" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/' + prizeName + '"  onfocusurl="__ROOT__/Public/img/sd/Activity/ActivityHeathTest/V3/confirm_in.png" confirmurl="__ROOT__/Public/img/sd/Activity/ActivityHeathTest/V3/confirm_out.png" >';
        _html += '<div id="searchText" class="commonPosition">请输入有效的电话号码</div>';
        _html += '<img id="btn-sure" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_sure.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/confirm_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/confirm_out.png" >';
        _html += '<img id="btn-cancle" class="commonPosition" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_cancle.png"  onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/cancel_in.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/cancel_out.png" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-sure";
        focusType = "save"; // 按钮功能
    };

    /**
     * 测试结果
     */
    var testResult = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/bg_test_result.png"/>';
        _html += '<img id="btn-open" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_open.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_open_f.png" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_open.png" />';
        _html += '<img id="btn-close" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_close.png" onfocusurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_close_f.gif" confirmurl="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_close.png" />';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-close";
        focusType = "back"; // 按钮功能
    };

    /**
     * 测试答题评测
     * @param platformType 平台 hd / sd
     * @param answersType 题库类型：1-趣味小常识 2-心理测试 3-亚健康测试
     * @param answersSubType 题目具体的类型 type 1-7
     * @param message 显示提示内容
     */
    var createTestResultPage = function (platformType, answersType, answersSubType, message) {
        var defaultTip = G('default_tip');
        if (defaultTip) {
            var html = '';
            if (answersType == 1) {
                html += '<div><img id="test-result-bg" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/bg_result.png">';
            } else {
                html += '<div><img id="test-result-bg" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/bg_test_result.png">';
            }
            html += '<img id="btn-test-result-open-bag" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_open.png">';
            html += '<img id="btn-test-result-close" src="__ROOT__/Public/' + platformType + '/img/Activity/ActivityHeathTest/V3/btn_close.png">';
            html += '<div id="test-result-message">' + message + '</div>';
            html += '</div>';

            defaultTip.innerHTML = html;
            defaultTip.style.visibility = 'block';
            dialogFocusId = "btn-test-result-open-bag";
            focusType = "open-bag"; // 按钮功能
        }
    }
})();