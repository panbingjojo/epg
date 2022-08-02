(function () {

    /**弹框提示函数
     * dialogShow
     * @Func
     * rule ->              活动规则
     * rankList ->          中奖名单
     * vipTimes ->          vip次数用完
     * timeOver ->          普通用户次数用完
     * complete ->          完成游戏
     * uncomplete ->        未完成游戏
     * successPay ->        支付成功
     * failedPay ->         支付失败
     *
     */
    dialogShow = {

        rule: function () {
            CreateRule();
        },
        rankList: function (userAccount, winnTime, goodName, userTel, recordData) {
            rankList(userAccount, winnTime, goodName, userTel, recordData);
        },
        vipTimes: function () {
            vipCreateTimes();
        },
        timeOver: function (resolution) {
            createTimeOver(resolution);
        },

        uncomplete: function () {
            uncomplete();
        },
        complete: function (goodImg) {
            complete(goodImg);
        },

        successPay: function () {
            createSuccessBook();
        },
        failedPay: function () {
            createfalseBook();
        },
    };


    /**
     * 普通用户次数用尽，去订购
     */
    var createTimeOver = function () {
        var _html = "";
        _html += '<div ><img class=loading src=' + A.imgPathPrefix + 'pay_vip.png>';
        _html += '<img id=btn-sure-pay class="abs sure" src=' + A.imgPathPrefix + 'btn_sure.png>';
        _html += '<img id=btn-cancel  class="abs btn-cancel-pay" src=' + A.imgPathPrefix + 'btn_cancel.png>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        initPath("rules","btn-sure-pay",true);
        LMEPG.ButtonManager.getButtonById("btn-cancel").nextFocusLeft = "btn-sure-pay";
    };

    /**
     * 会员次数用尽，明天来
     */
    var vipCreateTimes = function () {
        var _html = "";
        _html += '<div >';
        _html += '<img class=loading src=' + A.imgPathPrefix + 'no_times.png>';
        _html += '<img id=btn-one  src=' + A.imgPathPrefix + 'btn_sure_f.png>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        initPath("rules","btn-one","")
    };
    /**
     * 活动规则
     */
    var CreateRule = function () {
        var imgPrefix = "/Public/" + A.platformType + "/img/Activity/ActivityJoyTourism/" + ImgV;
        clearTimeout(A.homeCDTimer);
        var _html = "";
        _html += '<div><img class=loading  src=' + imgPrefix + '/bg_rule.png>';
        _html += '<img id=rule-close src=' + A.imgPathPrefix + 'btn_close.png>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        initPath("rules","rule-close","")
    };

    /**
     * 订购成功
     */
    var createSuccessBook = function () {
        var _html = "";
        _html += '<div ><img class=loading src=' + A.imgPathPrefix + 'pay_success.png>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        initPath("","","")
    };

    /**
     * 订购失败
     */
    var createfalseBook = function () {
        var _html = "";
        _html += '<div ><img class=loading src=' + A.imgPathPrefix + 'pay_failed.png>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        initPath("","","")
    };

    /**
     * 没有抽到奖品
     */
    var uncomplete = function () {
        var _html = "";
        _html += '<img id="lose-prize" class=loading src=' + A.imgPathPrefix + 'lose_prize.png>';
        A.modal.innerHTML = _html;
        initPath("","btn-one",true)
    };

    /**
     * 完成游戏填写手机号码
     */
    var complete = function (goodImg) {
        var imgPrefix = "/Public/" + A.platformType + "/img/Activity/ActivityJoyTourism/" + ImgV + "/";
        var _html = "";
        _html += '<img class=loading src=' + A.imgPathPrefix + 'lucky_prize.png>';
        _html += '<img id=win-prize class=abs src=' + imgPrefix + goodImg + '.png>';
        _html += '<div class="tel-wrap tel-complete"><span id=userTel>' + (A.userTel || "请输入有效手机号") + '</span></div>';
        _html += '<img id=btn-submit class="abs complete-submit sure" src=' + A.imgPathPrefix + 'btn_sure.png>';
        _html += '<img id=btn-cancel class="abs complete-cancel cancel" src=' + A.imgPathPrefix + 'btn_cancel.png>';
        A.modal.innerHTML = _html;
        initPath("","btn-submit",true)
    };
    /**
     * 中奖名单
     */
    var rankList = function (recordData, myInfo) { // 后台拉去中奖相关信息填充
        clearTimeout(A.homeCDTimer);
        var _html = "";
        _html += '<img class=loading src=' + A.imgPathPrefix + 'bg_win_list.png>';
        _html += '<img id=btn-submit class="abs list-submit sure" src=' + A.imgPathPrefix + 'btn_sure.png>';
        _html += '<img id=btn-cancel class="abs list-cancel cancel" src=' + A.imgPathPrefix + 'btn_cancel.png>';
        _html += '<marquee id=win-table direction=up>';
        _html += '<table >';
        A.modal.innerHTML = _html;
        var totalPrizeList = function(data) {
            var htm = "";
            for (var x = 0; x < data.length; x++) {
                htm += '<tr>';
                for (var y in data[x]) {
                    htm += '<td class=' + y + '>' + data[x][y];
                }
            }
            document.getElementsByTagName("table")[0].innerHTML =htm;
        };
        var myPrizeList = function(myInfo){
            var myPrize = '';
            myInfo.length == 0 ? myInfo = [{user: "", winTime: "暂无中奖记录", prize: ""}] :null;
            myPrize += '<span class="already-get-prize-user current-user">' + (myInfo[0].user? "已中奖":"未中奖" ) + '</span>';
            myPrize += '<span class="already-get-prize-time current-user">' + myInfo[0].user + '</span>';
            myPrize += '<span class="already-get-prize-name current-user">' + myInfo[0].prize + '</span>';
            A.modal.innerHTML += myPrize;
            A.modal.innerHTML += '<div class="tel-wrap tel-list"><span id=userTel>' + (A.userTel || "请输入有效手机号");
        };
        totalPrizeList(recordData);
        myPrizeList(myInfo);
        initPath("winners","btn-submit")
    };
    var initPath = function(beClick,focusId,isReload) {
        A.beClickBtnId = beClick;
        A.isModal = true;
        A.reload = isReload;
        LMEPG.ButtonManager.requestFocus(focusId);
    }
}());

