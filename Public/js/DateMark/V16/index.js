var arg = {
    markInfo: RenderParam.markInfo,
    vip: RenderParam.isVip,
};
var Mark = {
    buttons: [],
    ajaxDate: arg.markInfo.signed_in_days,
    init: function () {
        this.createBtns();
        this.createDate();
        this.initInfo(arg.markInfo);
    },
    initInfo: function (info) {
        G('today-score').innerText = info.today_in_score;
        G('total-score').innerText = info.total_score;
        G('keep-mark-day').innerText = info.continuous_days;
    },

    onClick: function (btn) {
        switch (btn.id) {
            case 'btn-rules':
                Mark.rules({beClickBtnId: btn.id});
                break;
            case 'btn-lottery':
                Mark.jumpLotteryPage();
                break;
            case 'btn-mark':
                Mark.startMark(btn);
                break;
        }
    },
    startMark: function (btn) {
        LMEPG.ajax.postAPI('DateMark/addMark', null,
            function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if (data.result == 0) {
                        // 签到成功
                        Mark.successMark(data, btn);
                    } else {
                        LMEPG.UI.showToast('签到失败请重新签到！', 3);
                    }
                } catch (e) {
                    LMEPG.UI.showToast('解析异常！', 3);
                    console.log(e);
                }
            },
            function (rsp) {
                LMEPG.UI.showToast('上报失败！', 3);
            }
        );
    },
    /**
     *成功签到
     */
    successMark: function (data, btn) {
        this.initInfo(data);
        this.createDate();
        this.forbiddenFocus('btn-mark');
        G('today').className = 'mark-had';
        LMEPG.BM.requestFocus('btn-lottery');
        G('btn-mark').src = btn.hadMarkImage;
    },
    /**
     * 创建日期对象
     */
    createDate: function () {
        var STATIC_NUM = 8; // UI固定展示今天之前连续的日期共8个
        var dateArray = [];
        var date = new Date();
        var year = date.getFullYear(); // 年
        var month = date.getMonth();   // 月
        var day = date.getDate();      // 日
        var dayCount = parseInt(day);
        var today = this.plusZero(month + 1) + '-' + this.plusZero(day);
        var prevMonthDays = new Date(year, month, 0).getDate(); // 上一个月的天数
        while (STATIC_NUM--) {
            if (STATIC_NUM - dayCount >= 0) {
                dateArray.unshift(this.plusZero(month) + '-' + Math.abs(prevMonthDays - STATIC_NUM + dayCount)); // 上个月的日期
            } else {
                dateArray.unshift(this.plusZero(month + 1) + '-' + this.plusZero((day - STATIC_NUM))); // 当前月的日期
            }
        }

        this.renderDate(month, dateArray, today);
        this.resolveToday(year + '-' + today);
    },
    /**
     * 渲染日期对象
     * @param month
     * @param dateArray
     * @param today
     */
    renderDate: function (month, dateArray, today) {
        var htm = '';
        var addId = '';
        var count = dateArray.length;
        while (count--) {
            var thisClassName = 'mark-miss';
            var thisDate = dateArray[count];
            if (this.ajaxDate.length) {
                this.ajaxDate.forEach(function (t) {
                    var date = t.slice(5);
                    if (date == thisDate) {
                        thisClassName = 'mark-had';
                    } else if (thisDate == today) {
                        thisClassName = 'mark-will';
                        addId = 'today';
                    }
                });
            } else {
                if (thisDate == today) {
                    thisClassName = 'mark-will';
                    addId = 'today';
                }
            }
            htm += '<li id="' + addId + '" class=' + thisClassName + '>' + thisDate;
        }
        G('date-wrapper').innerHTML = htm;
    },
    /**
     * 解析今天的签到情况
     * 重置焦点移动方向
     * @param today
     * @returns {string[]}
     */
    resolveToday: function (today) {
        var isTodayMark = this.ajaxDate.filter(function (t) {
            return t == today;
        });
        // 已签到改变改变焦点为不可获得状态
        if (+isTodayMark.length) {
            this.forbiddenFocus('btn-mark');
            this.moveToFocus('btn-lottery');
            G('btn-mark').src = LMEPG.ButtonManager.getButtonById('btn-mark').hadMarkImage;
        }
        return isTodayMark;
    },
    forbiddenFocus: function (id) {
        LMEPG.ButtonManager.getButtonById(id).focusable = false;
    },
    /**
     * 小于10的日期前加0
     * @param number
     * @returns {*}
     */
    plusZero: function (number) {
        if (number < 10) {
            return '0' + number;
        } else {
            return number;
        }
    },
    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },
    createBtns: function () {
        this.buttons.push({
            id: 'btn-rules',
            name: '规则说明',
            type: 'img',
            nextFocusDown: 'btn-lottery',
            backgroundImage: g_appRootPath + '/Public/img/hd/DateMark/V16/btn_rules.png',
            focusImage: g_appRootPath + '/Public/img/hd/DateMark/V16/btn_rules_f.png',
            click: this.onClick
        }, {
            id: 'btn-lottery',
            name: '抽奖',
            type: 'img',
            nextFocusUp: 'btn-rules',
            nextFocusDown: 'btn-mark',
            backgroundImage: g_appRootPath + '/Public/img/hd/DateMark/V16/btn_lottery.png',
            focusImage: g_appRootPath + '/Public/img/hd/DateMark/V16/btn_lottery_f.png',
            focusChange: '',
            click: this.onClick
        }, {
            id: 'btn-mark',
            name: '签到',
            type: 'img',
            nextFocusUp: 'btn-lottery',
            nextFocusRight: 'btn-lottery',
            backgroundImage: g_appRootPath + '/Public/img/hd/DateMark/V16/btn_mark.png',
            focusImage: g_appRootPath + '/Public/img/hd/DateMark/V16/btn_mark_f.png',
            hadMarkImage: g_appRootPath + '/Public/img/hd/DateMark/V16/btn_mark_s.png',
            click: this.onClick,
            focusable: true
        }, {
            id: 'debug',
            name: '脚手架ID',
            focusable: true
        });
        LMEPG.ButtonManager.init('btn-mark', this.buttons, '', true);
    },
    rules: function (arg) {
        var htm = '';
        // 签到规则皮肤设置
        var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V16/Home/bg.png';
        if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
            bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
        }
        htm += '<div class=rules><img  src=' + bgImg + '>';
        htm += '<span class=title>签到规则</span>';
        htm += '<div class=rules-desc>' +
            '<p>1.自首次签到之日起，按连续签到天数，赠送对应积分如下：' +
            '<p>连续签到1/2/3/4/5/6/≧7天，对应赠送1/2/3/4/5/6/8积分。' +
            '<p>特别奖励：若连续签到达到以下天数时，则赠送积分如下：' +
            '<p>连续签到天达30/60/90/120/150/180/210/240/270/300/330/360天，奖励对应天数的积分，如连续' +
            '<p>签到120天则奖励120积分。' +
            '<p>2.每天仅可签到一次。' +
            '<p>3.签到领取的积分，仅可用于本产品内有明显提示的兑换和消耗，不适用于其他用途。' +
            '<p>4.若通过作弊行为刷积分，一经发现将收回签到所得积分。' +
            '<p class=placeholder>' +
            '<p style="font-weight: bold">特别提示：' +
            '<p>①若某天未签到，则连续签到天数将从0算起。' +
            '<p>②若连续签到天数达到360天并领取360积分，则领取积分后的次日开始连续签到天数将从0算起。';
        modal._setPath(arg, htm);
        LMEPG.BM.setKeyEventPause(true);
    },
    /**
     * 获取当前页
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('dateMark');
        objCurrent.setParam('focusId', 'btn-lottery');
        return objCurrent;
    },

    /**
     * 跳转抽奖页页面
     * @param btn
     */
    jumpLotteryPage: function (btn) {
        try {
            var currentObj = this.getCurPageObj();
            var jumpAgreementObj = LMEPG.Intent.createIntent('lottery');
            LMEPG.Intent.jump(jumpAgreementObj, currentObj);
        } catch (e) {
            G('debug').innerHTML = e.toString();
        }

    }
};
var onBack = function () {
    LMEPG.Intent.back();
};