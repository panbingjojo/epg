(function () {
    /**
     * 创建活动详情页
     */
    dialogCreateActivity = {
        show: function () {
            createActivity();
        }
    };
    /**
     * 第三关抽奖
     */
    dialogCreateThreePass = {
        show: function () {
            createThreePass();
        }
    };

    /**
     * 第三关抽奖
     */
    dialogCreateNoPass = {
        show: function () {
            createNoPass();
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
        show: function (priceId) {
            createPhone(priceId);
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
     * 创建活动页
     */
    var createActivity = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/' + platformType + '/Activity/'+ imgModel+'/rule_bg.png"/>';
        _html += '<img id="btn-close" class="commonPosition" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/f_back.gif"/>';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-close";
        focusType = "back"; // 按钮功能
    };


    /**
     * 次数用完页
     */
    var createTimeOver = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/bg_no_all_times.png"/>';
        _html += '<img id="btn-one" class="commonPosition" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn_sure_f.gif" >';
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
        if(carrierId == '640094'){
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/bg_no_times_640094.png"/>';
        }else{
            _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/bg_no_times.png"/>';
        }
        _html += '<img  id="btn-sure" class="commonPosition btn-sure" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn_sure.png" onfocusurl="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn_sure_f.png" confirmurl="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn_sure.png" >';
        _html += '<img  id="btn-cancel" class="commonPosition btn-cancel" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn_cancel.png"  onfocusurl="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn-cancel_f.png" confirmurl="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn-cancel.png" >';
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
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/bg_unwin.png"/>';
        // _html += '<div ><img class="title_3" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/bg_unwin.png"/>';
        _html += '<img id="btn-one" class="commonPosition" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn_sure_f.gif" >';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-one";
        focusType = "back"; // 按钮功能
    };

    /**
     * 中奖页：中奖填写手机号码
     */
    var createPhone = function (priceId) {
        var _html = "";
        _html += '<div ><img id="default_focus" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/bg_phone.png"/>';
        _html += '<div id="searchText" class="commonPosition">请输入有效的手机号码</div>';
        _html += '<img class="price"  src="__ROOT__/Public/img/' + platformType + '/Activity/' + imgModel+'/icon_price_' + priceId + '.png"/>';
        _html += '<img id="btn-sure"  class="commonPosition btn-sure2" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn_sure.png" >';
        _html += '<img id="btn-cancel" class="commonPosition btn-cancel2" src="__ROOT__/Public/img/' + platformType + '/Activity/' + activityImgPath+'/btn_cancel.png">';
        _html += '</div>';
        dialog.innerHTML = _html;
        dialogFocusId = "btn-sure";
        focusType = "save"; // 按钮功能
    };
})();