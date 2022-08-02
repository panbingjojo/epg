/**ActivityDateMarkAlone 活动标识
 * 全局参数取值对象
 */

var Lottery = {
    buttons: [],
    init: function () {
        this.createBtns();
        this.initInfo();
    },
    /**
     * 初始化操作
     */
    initInfo: function () {
        G("total-score").innerText = RenderParam.markInfo.total_score;
        G("loseSore").innerText = RenderParam.activityInfo.list.attend_consume_score;// 抽奖消耗积分
        G("leave-times").innerText = "剩余抽奖次数：" + Math.floor(RenderParam.markInfo.total_score / RenderParam.activityInfo.list.attend_consume_score);
        this.setLuckyUser();
        this.setPrizeImg();

    },

    /**
     * 设置后台配置的奖品图片
     */

    setPrizeImg: function () {
        var i = 0;
        var htmLine1 = "";
        var htmLine2 = [];
        var htmLine3 = [];
        var fsPrefix = RenderParam.fsUrl;
        var configPrizeList = RenderParam.prizeList;
        var imgId = "";
        var imgLink = "";
        var imgStr = "";
        var occupied = "";

        for (; i < 8; i++) {
            imgId = "prize-" + (i + 1);
            imgLink = fsPrefix + configPrizeList[i].image_url;
            imgStr = "<img id=\"" + imgId + "\" src=\"" + imgLink + "\">";
            occupied = "<img class=\"occupied\" src=\"" + g_appRootPath + "/Public/img/Common/spacer.gif\">";

            // 第一行奖品
            if (i < 3) {
                htmLine1 += imgStr;
            }

            // 第二行奖品
            if (i === 3 || i === 7) {
                htmLine2.push(imgStr);
            }

            // 第三行奖品
            if (i > 3 && i < 7) {
                if (i === 4) {
                    htmLine2.push(occupied);
                }
                htmLine3.push(imgStr);
            }
        }
        // console.log('htmLine1==>' + htmLine1, '\n\n\nhtmLine2==>' + htmLine2, '\n\n\nhtmLine3==>' + htmLine3);
        G("prize-wrap").innerHTML = (htmLine1 + htmLine2.reverse().join("") + htmLine3.reverse().join(""));
    },

    setLuckyUser: function () {
        var list = RenderParam.allUserPrizeList;
        var i = list.length;
        var filterName = ["未中奖", "谢谢参与", ""];
        var luckyUser = {
            prize_dt: "2019-10-21 13:31:54",
            prize_idx: "4",
            prize_name: "100积分",
            user_account: "cutv201711272010101",
            user_id: "221463"
        };

        while (i--) {
            var user = list[i];
            if (filterName.indexOf(user.prize_name) === -1) {
                luckyUser = user;
            }
        }

        G("marquee-wrap").innerHTML = "<marquee> 恭喜ID为" + luckyUser.user_account + "的用户获得" + luckyUser.prize_name + "奖品";
    },
    /**
     * 点击事件
     * 1.规则弹框
     * 2.抽奖操作
     * 3.上报用户电话号码
     */
    onClick: function (btn) {
        switch (btn.id) {
            case "btn-rules":
                Lottery.rules();
                if (RenderParam.platformType == "sd") Hide("lottery-container"); // 部分盒子会出现动的色彩显示在最上层
                break;
            case "btn-lottery":
                if (Lottery.checkQualification()) {
                    Lottery.animate();
                    Lottery.lotteryBegin();
                } else {
                    modal.textDialog({
                        beClickBtnId: btn.id,
                        time: 2
                    }, "", "", "抽奖次数不足哦~", "");
                }
                break;
            case "modal-sure":
                Lottery.setPhoneNumber();
                break;
        }
    },
    /**
     * 检查抽奖资格
     *条件： 次数=总积分/每次消耗积分
     */
    checkQualification: function () {
        return Math.floor(RenderParam.markInfo.total_score / RenderParam.activityInfo.list.attend_consume_score) >= 1;
    },

    /**
     * 开始抽奖
     * 1.检查剩余次数(首页进来的时候已经检查)
     * 3.ajax抽奖接口,返回中奖物品ID
     */
    prizeResult: "",
    lotteryBegin: function () {
        var that = this;
        var postData = {
            "activityId": RenderParam.activityId,
            "action": "lottery",
            "lottery": 1
        };
        LMEPG.ButtonManager.setKeyEventPause(true); //停止点击事件
        LMEPG.ajax.postAPI("Activity/commonAjax", postData,
            function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    console.log(data);
                    that.prizeResult = data;
                    that.prizeId = +data.unique_name;
                    that.resultStatus = data.result;
                } catch (e) {
                    LMEPG.UI.showToast("解析异常！", 3);
                    console.log(e);
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("上报失败！", 3);
            }
        );
    },
    /**
     * 抽奖结果->结束动画
     * @param rollTimes:执行动画次数
     * @param Id: 动画返回的ID
     */
    lotteryResult: function (rollTimes, Id) {
        var prizeName = this.prizeResult.prize_name;
        var imgPrizeName = RenderParam.prizeList[Id - 1].prize_name;
        var filterName = ["未中奖", "谢谢参与", "再接再厉", ""];
        var isRealPrize = filterName.indexOf(prizeName) === -1;
        var isImgPrize = filterName.indexOf(imgPrizeName) === -1;
        // 获得返回状态
        var rp = {
            rpi: this.resultStatus == 1 && Id != this.prizeId,
            epi: this.resultStatus == 0 && isImgPrize
        };
        // 是否获得真实奖品
        var ret = {
            luck: isRealPrize && this.resultStatus == 1,
            lose: !isRealPrize || this.resultStatus == 0
        };

        /*
         * 转圈小于5圈;
         * 中奖-->没有指示到当前转盘对应奖品位置上;
         * 未中奖-->没有指示到未中奖对应位置上;
         * */
        if (rollTimes < 5 || rp.rpi || rp.epi) return;

        if (ret.luck) {
            clearTimeout(this.timer);
            LMEPG.UI.showWaitingDialog("", 2, function () {
                Lottery.showLotterySuccessTip(prizeName);
            });
        }

        if (ret.lose) {
            // 指示到“谢谢参与”
            clearTimeout(this.timer);
            LMEPG.UI.showToast("很遗憾未中奖！", 2, this.reload);
        }
    },

    isSd: function () {
        return RenderParam.platformType === "sd";
    },

    // 显示成功抽到奖品设置电话界面
    showLotterySuccessTip: function (prizeName) {
        var me = this;
        clearTimeout(me.timer);
        me.isSd() && Hide("lottery-container"); // 部分盒子会出现动的色彩显示在最上层
        LMEPG.BM.setKeyEventPause(false); // 恢复点击事件
        modal.setPhoneNumber({
            beClickBtnId: "lottery",
            onClick: me.setPhoneNumber,
            buttons: me.buttons,
            numberAction: "tel",
            resolution: RenderParam.platformType,
            isLoad: true
        }, "恭喜您获得奖品<b style=\"color:gold;\">" + prizeName + "</b>请留下您的, 联系方式");

    },

    /**
     * ease动画（由快到慢~）
     */
    animate: function () {
        var that = this,
            Nc = 1,             // 动画变数
            Nt = 1,             // 动画次数
            Nm = 8,             // 执行最大次数
            Ns = 100,           // 执行间隔时间
            Np = Math.PI / 10,  // 执行动画常量
            prevFocus = "debug",
            nextFocus = "prize-1",
            updateFocus = function () {
                G(prevFocus).className = "";
                G(nextFocus).className = "focus";
                prevFocus = nextFocus;
            };
        (function ease() {
            Ns += 20;
            if (Nc == Nm) {
                Nt++;
                Nc = 1;
            } else {
                Nc++;
            }
            nextFocus = "prize-" + Nc;
            that.timer = setTimeout(ease, Ns * Np);
            updateFocus();
            that.lotteryResult(Nt, Nc);
        }());
    },
    /**
     * 保存用户电话号码
     * 1.判断电话号码是否输入正确
     * 2.提交电话接口处理
     */
    setPhoneNumber: function () {
        var userTel = G("telephone").innerHTML;
        //判断手机号是否正确
        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast("请输入有效电话号码!");
            return;
        }

        var reqData = {
            "phoneNumber": userTel,
            "activityId": "10030"
        };
        LMEPG.ajax.postAPI("Activity/setPhoneNumber", reqData,
            function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    var result = data.result;
                    console.log(data);
                    if (result == 0) {
                        LMEPG.UI.showToast("提交电话成功！");
                        Lottery.reload();
                    } else {
                        LMEPG.UI.showToast("提交失败，请重试！");
                    }
                } catch (e) {
                    LMEPG.UI.showToast("保存手机号结果处理异常！");
                    LMEPG.Log.error(e.toString());
                    console.log(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("请求保存手机号发生错误！");
            });
    },
    rules: function () {
        var htm = "";
        // 签到规则皮肤设置
        var bgImg = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V16/Home/bg.png";
        if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
            bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
        }
        htm += "<div class=rules><img  src=" + bgImg + ">";
        htm += "<span class=title>签到规则</span>";
        htm += "<div class=rules-desc>" +
            "<p>1.自首次签到之日起，按连续签到天数，赠送对应积分如下：" +
            "<p>连续签到1/2/3/4/5/6/≧7天，对应赠送1/2/3/4/5/6/8积分。" +
            "<p>特别奖励：若连续签到达到以下天数时，则赠送积分如下：" +
            "<p>连续签到天达30/60/90/120/150/180/210/240/270/300/330/360天，奖励对应天数的积分，如连续" +
            "<p>签到120天则奖励120积分。" +
            "<p>2.每天仅可签到一次。" +
            "<p>3.签到领取的积分，仅可用于本产品内有明显提示的兑换和消耗，不适用于其他用途。" +
            "<p>4.若通过作弊行为刷积分，一经发现将收回签到所得积分。" +
            "<p class=placeholder>" +
            "<p style=\"font-weight: bold\">特别提示：" +
            "<p>①若某天未签到，则连续签到天数将从0算起。" +
            "<p>②若连续签到天数达到360天并领取360积分，则领取积分后的次日开始连续签到天数将从0算起。";
        LMEPG.BM.requestFocus("debug");
        modal._setPath({beClickBtnId: "btn-rules"}, htm);
        LMEPG.BM.setKeyEventPause(true);
    },
    onFocusInShowGifWarpper: function (btn, hasFocus) {
        if (hasFocus) {
            Show("lottery-container");
        }
    },
    /**
     * 添加虚拟按钮
     */
    createBtns: function () {
        this.buttons.push({
            id: "btn-rules",
            name: "规则说明",
            type: "img",
            nextFocusDown: "btn-lottery",
            nextFocusLeft: "btn-lottery",
            backgroundImage: g_appRootPath + "/Public/img/hd/DateMark/V16/btn_rules.png",
            focusImage: g_appRootPath + "/Public/img/hd/DateMark/V16/btn_rules_f.png",
            focusChange: this.onFocusInShowGifWarpper,
            click: this.onClick
        }, {
            id: "btn-lottery",
            name: "抽奖",
            type: "img",
            nextFocusUp: "btn-rules",
            nextFocusRight: "btn-rules",
            backgroundImage: g_appRootPath + "/Public/img/hd/DateMark/V16/btn_lottery.png",
            focusImage: g_appRootPath + "/Public/img/hd/DateMark/V16/btn_lottery_f.png",
            focusChange: this.onFocusInShowGifWarpper,
            click: this.onClick
        }, {
            id: "debug",
            name: "脚手架ID",
            focusable: true
        });
        LMEPG.ButtonManager.init("btn-lottery", this.buttons, "", true);
    },
    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },
    reload: function () {
        location.reload(false);
    }
};
/**
 * 公用返回
 */
var onBack = function () {
    LMEPG.Intent.back();
};