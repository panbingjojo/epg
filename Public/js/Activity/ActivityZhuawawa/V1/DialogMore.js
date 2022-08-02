/**
 * 用户抽中了将的弹框
 */
(function () {
    // 抽奖次数用完弹窗
    dialogBookThree = {
        show: function (platformType) {
            GenerateHtml(platformType);
            dialogFocusId = "focus-6-1";
        }
    };
    // 非会员弹窗
    dialogNoChance = {
        show: function (platformType) {
            GenerateHtml2(platformType);
            dialogFocusId = "btn-buyVip-ok";
        }
    };

    // 继续抓取
    dialogAgin = {
        show: function () {
            GenerateHtml3();
            dialogFocusId = "btn-play-music";
        }
    };

    // 订购失败弹窗
    dialogFalse = {
        show: function () {
            GenerateHtml4();
            dialogFocusId = "focus-6-1";
        }
    };

    prcieList = {
        show: function (typeModl) {
            GenerateHtml15(typeModl);
            dialogFocusId = "btn-setPhoneText";
        }
    };

    dialogList = {
        show: function (data, prizeNumMy, prizeList, prizeNum) {
            GenerateHtml16(data, prizeNumMy, prizeList, prizeNum);
            dialogFocusId = "default";
        }
    };

    dialogRule = {
        show: function () {
            GenerateHtml17();
            dialogFocusId = "btn-rule-look";
        }
    };

    dialogVip = {
        show: function () {
            GenerateHtml18();
            dialogFocusId = "default";
        }
    };
    dialogMsg = {
        show: function (msg) {
            GenerateHtml19(msg);
            dialogFocusId = "default";
        }
    };

    var GenerateHtml = function (platformType) {
        var _html = "";
        if (platformType == "hd") {
            _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_more_book_lt.png"/>';
        } else {
            _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/sd/Activity/ActivityZhuawawa/V1/dialog_more_book_lt.png"/>';
        }
        _html += '<img class="focus-6-1" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/book_out.png" onfocusurl="/Public/img/hd/Activity/ActivityZhuawawa/V1/book_in.png" confirmurl="/Public/img/hd/Activity/ActivityZhuawawa/V1/book_out.png"/>';
        _html += '<img class="focus-6-2" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_back_out.png" onfocusurl="/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_back_in.png" confirmurl="/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_back_out.png"/>';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

    var GenerateHtml2 = function (platformType) {
        var _html = "";
        if (platformType == "hd") {
            _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_no_chance_lt.png"/>';
        } else {
            _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/sd/Activity/ActivityZhuawawa/V1/dialog_no_chance_lt.png"/>';
        }
        _html += '<img id="btn-buyVip-ok" class="focus-6-1" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/book_out.png"/>';
        _html += '<img id="btn-buyVip-cancle" class="focus-6-2" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_back_out.png"/>';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

    var GenerateHtml3 = function () {
        var _html = "";
        _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_agin.png"/>';
        _html += '<img id="btn-play-music" class="focus-6-1" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/play_video_out.png"/>';
        _html += '<img id="btn-play-again" class="focus-6-2" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/one_more_out.png" />';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

    var GenerateHtml4 = function () {
        var _html = "";
        _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_false.png"/>';
        _html += '<img id="focus-6-1" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/rebook_out.png" onfocusurl="/Public/img/hd/Activity/ActivityZhuawawa/V1/rebook_in.png" confirmurl="/Public/img/hd/Activity/ActivityZhuawawa/V1/rebook_out.png"/>';
        _html += '<img id="focus-6-2" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/cancel_out.png" onfocusurl="/Public/img/hd/Activity/ActivityZhuawawa/V1/cancel_in.png" confirmurl="/Public/img/hd/Activity/ActivityZhuawawa/V1/cancel_out.png"/>';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

    var GenerateHtml15 = function (typeModl) {
        var _html = "";
        _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/price_dailog.png"/>';
        _html += '<img id="btn-setPhone-ok" class="focus-6-1" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_confirm_out.png"/>';
        _html += '<img id="btn-setPhone-cancle" class="focus-6-2" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_giveup_out.png"/>';
        _html += '<input id="btn-setPhoneText" type="text"/>';
        _html += '<div id="warmMsg"></div>';
        _html += '<div id="phoneNum">' + typeModl + '</div>';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

    var GenerateHtml16 = function (data, prizeNumMy, prizeList, prizeNum) {
        var myPrizeName1 = "";
        var myPrizeName2 = "";
        var myPrizeInsertDt1 = "";
        var myPrizeInsertDt2 = "";
        var myPrizeName3 = "";
        if (data.length > 0) {
            myPrizeName1 = data[prizeNumMy].prize_name;
            myPrizeInsertDt1 = data[prizeNumMy].insert_dt;
        } else {
            myPrizeName3 = "暂无中奖记录";
        }
        if (data.length > 1) {
            myPrizeName2 = data[prizeNumMy + 1].prize_name;
            myPrizeInsertDt2 = data[prizeNumMy + 1].insert_dt;
        }
        var user_account1 = "";
        var user_account2 = "";
        var user_account3 = "";
        if (prizeList.list.length > 0) {
            user_account1 = prizeList.list[prizeNum].user_account;
            user_account1 = user_account1.substr(0, 3) + "***" + user_account1.substring(user_account1.length - 3, user_account1.length)

        }
        if (prizeList.list.length > 1) {
            user_account2 = prizeList.list[prizeNum + 1].user_account;
            user_account2 = user_account2.substr(0, 3) + "***" + user_account2.substring(user_account2.length - 3, user_account2.length)
        }
        if (prizeList.list.length > 2) {
            user_account3 = prizeList.list[prizeNum + 2].user_account;
            user_account3 = user_account3.substr(0, 3) + "***" + user_account3.substring(user_account3.length - 3, user_account3.length)
        }

        var _html = "";
        _html += '<div><img  id="mb_box"  src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_list.png"/>';
        _html += '<table id="table" class="table">';
        if (prizeList.list.length > 0) {
            _html += '<tr><td>' + user_account1 + '</td><td>' + prizeList.list[prizeNum].prize_dt + '</td><td>' + prizeList.list[prizeNum].prize_name + '</td></tr>';
        }
        if (prizeList.list.length > 1) {
            _html += '<tr><td>' + user_account2 + '</td><td>' + prizeList.list[prizeNum + 1].prize_dt + '</td><td>' + prizeList.list[prizeNum + 1].prize_name + '</td></tr>';
        }
        if (prizeList.list.length > 2) {
            _html += '<tr><td>' + user_account3 + '</td><td>' + prizeList.list[prizeNum + 2].prize_dt + '</td><td>' + prizeList.list[prizeNum + 2].prize_name + '</td></tr>';
        }
        _html += '</table>';
        _html += '<ul id="priceTime"><li><div class="block">' + myPrizeInsertDt1 + '</div><div class="block">' + myPrizeName1 + '</div></li><li>' + myPrizeName3 + '</li><li><div class="block">' + myPrizeInsertDt2 + '</div><div class="block">' + myPrizeName2 + '</div></li></ul>';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

    var GenerateHtml17 = function () {
        var _html = "";
        _html += '<div ><img id="mb_box"  src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/rulebg.png"/>';
        _html += '<img id="btn-rule-back" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/back_out.png">';
        _html += '<img id="price1" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/price1.png" >';
        _html += '<img id="price2" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/price2.png" >';
        _html += '<img id="price3" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/price3.png" >';
        _html += '<img id="price4" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/price4.png" >';
        _html += '<img id="price5" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/price5.png" >';
        _html += '<img id="price6" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/price6.png" >';
        _html += '<img id="btn-rule-look" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/btn_look_price_out.png" >';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

    var GenerateHtml18 = function () {
        var _html = "";
        _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_vip.png"/>';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

    var GenerateHtml19 = function (msg) {
        var _html = "";
        _html += '<div ><img id="mb_box" src="__ROOT__/Public/img/hd/Activity/ActivityZhuawawa/V1/dialog_msg.png"/>';
        _html += '<div id="msg">' + msg + '</div>';
        _html += '</div>';
        dialogPhone.innerHTML = _html;
    };

})();