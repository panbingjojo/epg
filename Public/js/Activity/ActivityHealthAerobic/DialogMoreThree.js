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
        rankList: function (recordData, myInfo) {
            rankList(recordData, myInfo);
        },
        exchange: function () {
            exchange();
        },
        unExchange: function () {
            unExchange();
        },
        hasExchanged: function () {
            hasExchanged();
        },
        emptyStore: function () {
            emptyStore();
        },
        successExchange: function () {
            successExchange();
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
        _html += '<div ><img id="mb_box" src="' + A.imgPathPrefix + '/' + A.currentTime + '_pay_vip.png"/>';
        _html += '<img id="btn-sure-pay" class="abs sure" src="' + A.imgPathPrefix + 'btn_sure.png"/>';
        _html += '<img id="btn-cancle"  class="abs btn-cancle-pay" src="' + A.imgPathPrefix + 'btn_cancle.png"/>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        A.reload = true;
        A.isModal = true;
        LMEPG.ButtonManager.requestFocus("btn-sure-pay");
        LMEPG.ButtonManager.getButtonById("btn-cancle").nextFocusLeft = "btn-sure-pay";
    };

    /**
     * 会员次数用尽，明天来
     */
    var vipCreateTimes = function () {
        LMEPG.UI.showToast("你的次数已经使用完，请明天再来！");
    };
    /**
     * 活动规则
     */
    var CreateRule = function () {
        var imgPrefix = "/Public/" + A.platformType + "/img/Activity/ActivityHealthAerobic/" + imgVision;
        clearTimeout(A.homeCDTimer);
        var _html = "";
        _html += '<div id=""><img id="mb_box"  src="' + imgPrefix + '/' + A.currentTime + '_bg_rule.png"/>';
        _html += '<img id="rule-close" class="abs" src=' + A.imgPathPrefix + 'btn_close_f.gif>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        A.isModal = true;
        A.beClickBtnId = "rules";
        LMEPG.ButtonManager.requestFocus("rule-close");
    };

    /**
     * 订购成功
     */
    var createSuccessBook = function () {
        var _html = "";
        _html += '<div ><img id="mb_box" src="' + A.imgPathPrefix + 'pay_success.png"/>';
        // _html += '<img id="btn-one" class="abs sure" src="' + imgPathPrefix + 'btn_one.gif"/>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        A.isModal = true;
        U.saveScore(10)
    };

    /**
     * 订购失败
     */
    var createfalseBook = function () {
        var _html = "";
        _html += '<div ><img id="mb_box" src="' + A.imgPathPrefix + 'pay_failed.png"/>';
        // _html += '<img id="btn-one" class="abs sure" src="' + imgPathPrefix + 'btn_one.gif"/>';
        _html += '</div>';
        A.modal.innerHTML = _html;
        A.isModal = true;
    };

    /**
     * 没有抽到奖品
     */
    var uncomplete = function () {
        var _html = "";
        _html += '<img id="mb_box" src="' + A.imgPathPrefix + 'lose_prize.png"/>';
        // _html += '<img id="btn-one" class="abs sure" src="' + A.imgPathPrefix + 'btn_one.gif"/>';
        A.modal.innerHTML = _html;
        A.isModal = true;
        A.reload = true;
        LMEPG.ButtonManager.requestFocus("btn-one");
    };

    /**
     * 完成游戏填写手机号码
     */
    var complete = function (goodImg) {
        var imgPrefix = "/Public/" + A.platformType + "/img/Activity/ActivityHealthAerobic/" + imgVision;
        var _html = "";
        var  tel = A.userTel || "请输入有效电话号码";
        _html += '<img id="mb_box" src=' + A.imgPathPrefix + 'lucky_prize.png>';
        _html += '<img id="win-prize" class="abs" src="' + imgPrefix + goodImg + '.gif">';
        _html += '<div class="tel-wrap tel-complete"><span id="searchText">' + tel + '</span></div>';
        _html += '<img id="btn-submit" class="abs complete-submit sure" src="' + A.imgPathPrefix + 'btn_sure.png" >';
        _html += '<img id="btn-cancle" class="abs complete-cancle cancle" style="" src="' + A.imgPathPrefix + 'btn_cancle.png">';
        A.modal.innerHTML = _html;
        A.isModal = true;
        A.reload = true;
        LMEPG.ButtonManager.requestFocus("btn-submit");
    };
    /**
     * 中奖名单
     */
    var rankList = function (recordData, myInfo) { // 后台拉去中奖相关信息填充
        var _html = "";
        var  tel = A.userTel || "请输入有效电话号码";
        _html += '<img id="mb_box" src="' + A.imgPathPrefix + A.currentTime + '_bg_win_list.png" alt="">';
        _html += '<img id="btn-submit" class="abs list-submit sure" src="' + A.imgPathPrefix + 'btn_sure.png" alt="">';
        _html += '<img id="btn-cancle" class="abs list-cancle cancle" src="' + A.imgPathPrefix + 'btn_cancle.png" alt="">';

        var col = 1;
        if (recordData.length) {
            _html += '<marquee id="win-table" class="abs" behavior="" direction="up">';
            _html += '<table >';
            for (var x = 0; x < recordData.length; x++) {
                _html += '<tr>';
                for (var y in recordData[x]) {
                    col = 1;
                    y == "winTime" && (col = 3);
                    _html += '<td class="' + y + '" colspan=' + col + '>' + recordData[x][y];
                }
            }
        } else {
            _html += '<div class="abs total-noPrize">没有中奖记录</div>';
        }

        A.modal.innerHTML = _html;
        var myPrize = '';
        if (myInfo.length) {
            myPrize += '<marquee  class="abs single-table"  behavior="" direction="up"  scrollamount="3">';
            myPrize += '<table>';
            for (var i = 0; i < myInfo.length; i++) {
                myPrize += '<tr>';
                for (var j in myInfo[i]) {
                    col = 1;
                    j == "winTime" && (col = 3);
                    myPrize += '<td class="' + j + '" colspan=' + col + '>' + myInfo[i][j];
                }
            }
        } else {
            myPrize += '<div class="abs my-noPrize">没有中奖记录</div>';
        }

        A.modal.innerHTML += myPrize;
        A.modal.innerHTML += '<div class="tel-wrap tel-list"><span id="searchText">' + tel;
        A.beClickBtnId = "winners";
        A.isModal = true;
        LMEPG.ButtonManager.requestFocus("btn-submit");
    };
    /**
     * 兑换奖品UI
     */
    var exchange = function () {
        var _html = "";
        var infoGift = A.setExchangeList.data;
        console.log(infoGift, A.myExchange, A.currentTime);
        var hasExchange = A.myExchange ? A.myExchange : "暂无兑换记录";
        var imgPrefix = "/Public/" + A.platformType + "/img/Activity/ActivityHealthAerobic/" + imgVision +"/";
        _html += '<img src="' + imgPrefix + A.currentTime + '_bg_exchange.png">';
        _html += '<img id="exchange-close"  class="abs" src="' + A.imgPathPrefix + 'btn_close.png"/>';
        _html += '<div class="abs myScore">' + A.getUserScore + '</div>';
        _html += '<div class="abs hasExchange">' + hasExchange + '</div>';
        _html += '<div id="exchange-wrap">';
        _html += '<div><p>' + infoGift[0].consume_list[0].consume_count + '</p><img id="exchange-1" src=' + A.imgPathPrefix + 'btn_exchange1.png></div>';
        _html += '<div><p>' + infoGift[1].consume_list[0].consume_count + '</p><img id="exchange-2" src=' + A.imgPathPrefix + 'btn_exchange1.png></div>';
        _html += '<div><p>' + infoGift[2].consume_list[0].consume_count + '</p><img id="exchange-3" src=' + A.imgPathPrefix + 'btn_exchange1.png></div>';
        A.isModal = true;
        A.modal.innerHTML = _html;
        A.beClickBtnId = "exchange";
        LMEPG.ButtonManager.requestFocus("exchange-1");
    };
    /**
     * 不能兑换
     */
    var unExchange = function () {
        LMEPG.UI.showToast("积分不足不能兑换！", 1);
    };
    /**
     * 你已经兑换过了
     */
    var hasExchanged = function () {
        LMEPG.UI.showToast("你已经兑换过该奖品哦！", 2);
        /* var _html = "";
         _html += '<img id="mb_box" src="' + A.imgPathPrefix + 'has_exchange.png"/>';
         A.modal.innerHTML = _html;
         A.isModal = true;
         A.reload = true;*/
    };
    /**
     * 库存不足
     */
    var emptyStore = function () {
        var _html = "";
        _html += '<img id="mb_box" src="' + A.imgPathPrefix + 'exchange_empty.png"/>';
        A.modal.innerHTML = _html;
        A.isModal = true;
        A.reload = true;
    };
    /**
     * 兑换成功
     */
    var successExchange = function () {
        var _html = "";
        var  tel = A.userTel || "请输入有效电话号码";
        _html += '<img id="exchange_bg" src="' + A.imgPathPrefix + 'exchange_success.png"/>';
        _html += '<div class="tel-wrap tel-exchange"><span id="searchText">' + tel + '</span></div>';
        _html += '<img id="btn-submit" class="abs complete-submit sure" src="' + A.imgPathPrefix + 'btn_sure.png" >';
        _html += '<img id="btn-cancle" class="abs complete-cancle cancle" style="" src="' + A.imgPathPrefix + 'btn_cancle.png">';
        A.modal.innerHTML = _html;
        A.isModal = true;
        A.reload = true;

        LMEPG.ButtonManager.requestFocus("btn-submit");
    };
}());

