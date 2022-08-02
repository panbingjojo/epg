/**
 * 检测时间对象
 * 输入弹出层触发为点击输入框
 */
var curServerTime; // 当前服务器时间
var InputData = {
    init: function () {
        var that = this;
        LMEPG.ajax.postAPI('Expert/getTime', {}, function (timeStr) {
            console.log(timeStr);
            curServerTime = timeStr;

            that.createBtns();
            that.render();
            that.initButtons('input-time'); // 不需要做焦点保持
            that.initData();
        });
    },
    /*首次加载渲染初始日期对象*/
    render: function () {
        var selectDate = this.createDate();
        var addDate = {
            y: 1970,
            m: +selectDate.month > 12 ? '01' : +selectDate.month + 1,
            d: +selectDate.day > +selectDate.maxDay ? '01' : +selectDate.day + 1,
            h: +selectDate.hour > 23 ? '01' : +selectDate.hour + 1,
            i: +selectDate.minute > 59 ? '01' : +selectDate.minute + 1,
            s: +selectDate.second > 59 ? '01' : +selectDate.second + 1
        };
        // 第一行时间~
        var htmTop = '<li class="date-inner-top">' +
            '<span id="prev-date-year">' + (+selectDate.year - 1) + '</span>' +
            '<span id="prev-date-month">' + this.plusZero(+selectDate.month - 1) + '</span>' +
            '<span id="prev-date-day">' + this.plusZero(+selectDate.day - 1) + '</span>' +
            '<i></i>' +
            '<span id="prev-date-hour">' + this.plusZero(+selectDate.hour - 1) + '</span>' +
            '<span id="prev-date-minute">' + this.plusZero(+selectDate.minute - 1) + '</span>' +
            '<span id="prev-date-second">' + this.plusZero(+selectDate.second - 1) + '</span>';

        // 第二行时间~
        var htmCenter = '<li class="date-inner-center">' +
            '<span id="select-date-year" class="focus">' + selectDate.year + '</span>-' +
            '<span id="select-date-month">' + selectDate.month + '</span>-' +
            '<span id="select-date-day">' + selectDate.day + '</span>' +
            '<i></i>' +
            '<span id="select-date-hour">' + selectDate.hour + '</span>:' +
            '<span id="select-date-minute">' + selectDate.minute + '</span>:' +
            '<span id="select-date-second">' + selectDate.second + '</span>';

        // 第三行时间~
        var htmBottom = '<li class="date-inner-bottom">' +
            '<span id="next-date-year">1970</span>' +
            '<span id="next-date-month">' + this.plusZero(addDate.m) + '</span>' +
            '<span id="next-date-day">' + this.plusZero(addDate.d) + '</span>' +
            '<i></i>' +
            '<span id="next-date-hour">' + this.plusZero(addDate.h) + '</span>' +
            '<span id="next-date-minute">' + this.plusZero(addDate.i) + '</span>' +
            '<span id="next-date-second">' + this.plusZero(addDate.s) + '</span>';

        G('date-modal').innerHTML = htmTop + htmCenter + htmBottom;
    },
    /*点击焦点框显示日期选择弹出层*/
    isShowTimeModal: false,
    onClickShowTimeModal: function () {
        S('date-modal');
        InputData.isShowTimeModal = true; // 标记日期弹出层（释放时判断）
        InputData.moveToFocus('select-date-year'); // （焦点移动到年份选择项）
    },
    /**
     * 日期对象构思逻辑：
     * 上下移动切换日期选择数字
     * 上为减、下为加
     * 年份最小为1970年，最大为今年
     * 月份最小为1月最大为12
     * 日期最小为1日最大为选择的年月最大天数
     * 小时最小为00最大为59
     * 分钟、秒数最小为00最大为59
     */
    onBeforeMoveChangeDate: function (key, btn) {
        if (key == 'left' || key == 'right') {
            return;
        }
        var that = InputData;
        var btnElement = G(btn.id);
        var currentTimes = that.createDate();
        var innerYear = G('select-date-year').innerText;
        var innerMonth = G('select-date-month').innerText;
        var maxDays = new Date(innerYear, innerMonth, 0).getDate(); // 当前年月对应的日期最大天数
        var number = +btnElement.innerText;
        var min = 0;
        var max = '';
        switch (btn.id) {
            case 'select-date-year':
                min = 1970;
                max = currentTimes.year;
                break;
            case 'select-date-month':
                min = 1;
                max = 12;
                break;
            case 'select-date-day':
                min = 1;
                max = maxDays;
                break;
            case 'select-date-hour':
                max = 23;
                break;
            case 'select-date-minute':
            case 'select-date-second':
                max = 59;
                break;
        }
        if (key == 'up') {
            that.sub_number(number, btnElement, min, max);
        } else {
            that.add_number(number, btnElement, min, max);
        }
    },
    /*向上选择日期（减）*/
    sub_number: function (number, btnElement, min, max) {
        number == min ? number = max : number--;
        this.updateDate(number, btnElement, min, max);
    },
    /*向下选择日期（加）*/
    add_number: function (number, btnElement, min, max) {
        number == max ? number = min : number++;
        this.updateDate(number, btnElement, min, max);
    },
    /*更新日期值*/
    updateDate: function (number, btnElement, min, max) {
        var cutId = btnElement.id.slice(7);
        var sub = number == min ? max : number - 1;
        var add = number == max ? min : number + 1;
        G('prev-' + cutId).innerText = this.plusZero(sub);
        btnElement.innerText = this.plusZero(number);
        G('next-' + cutId).innerText = this.plusZero(add);
        this.change_days(btnElement);
    },
    /**
     * 如果触发的是年、月按钮
     * 且日期框大于该年、月对应的日期最大天数，实时更新该年月的最大天数
     */
    change_days: function (btnElement) {
        if (btnElement.id == 'select-date-year' || btnElement.id == 'select-date-month') {
            var year = G('select-date-year').innerText;
            var month = G('select-date-month').innerText;
            var days = G('select-date-day').innerText;
            var maxDays = new Date(year, month, 0).getDate();
            if (+days > maxDays) {
                G('select-date-day').innerText = maxDays;
            }
        }
    },
    /*创建当前日期层对象数据*/
    createDate: function () {
        //2019-06-25 16:23:18格式
        var date = new Date(+curServerTime.substr(0, 4),
            +curServerTime.substr(5, 2) - 1,
            +curServerTime.substr(8, 2),
            +curServerTime.substr(11, 2),
            +curServerTime.substr(14, 2),
            +curServerTime.substr(17, 2));

        var year = date.getFullYear(); // 年
        var month = date.getMonth() + 1; // 月
        var day = date.getDate(); // 日
        var hour = date.getHours(); // 时
        var minute = date.getMinutes(); // 分
        var second = date.getSeconds(); // 秒
        return {
            year: year,
            month: this.plusZero(month),
            day: this.plusZero(day),
            hour: this.plusZero(hour),
            minute: this.plusZero(minute),
            second: this.plusZero(second),
            maxDay: new Date(year, month, 0).getDate()
        };
    },
    /*隐藏日期弹出层，绑定日期到日期输入框*/
    onClickHideTimeModal: function () {
        H('date-modal');
        InputData.moveToFocus('input-time');
        InputData.isShowTimeModal = false;
        var year = G('select-date-year').innerHTML;
        var month = G('select-date-month').innerHTML;
        var day = G('select-date-day').innerHTML;
        var hour = G('select-date-hour').innerHTML;
        var minute = G('select-date-minute').innerHTML;
        var second = G('select-date-second').innerHTML;
        G('input-time').innerHTML = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

        // 时间变化时，更新检测状态
        TestStatus.updateStatus();

    },
    onFocusChangeColor: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).className = 'focus';
        } else {
            G(btn.id).className = '';
        }
    },
    plusZero: function (number) {
        if (number < 10 && number.toLocaleString().length < 2) {
            if (number < 0) {
                return '00';
            } else {
                return '0' + number;
            }
        } else {
            return number;
        }
    },
    initButtons: function (id) {
        if (RenderParam.focusId == 'member-add')
            id = 'member-next';
        LMEPG.ButtonManager.init(id, this.buttons, '', true);
    },

    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },
    buttons: [],
    createBtns: function () {
        this.buttons.push(
            //检测时间虚拟按钮
            {
                id: 'input-time',
                name: '检测时间',
                type: 'div',
                nextFocusDown: 'type-prev',
                // backgroundImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V16/test_time.png' : g_appRootPath + '/Public/img/hd/HealthTest/V16/test_time.png',
                backgroundImage:  g_appRootPath + '/Public/img/hd/HealthTest/V16/test_time.png',
                // focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V16/test_time_f.png' : g_appRootPath + '/Public/img/hd/HealthTest/V16/test_time_f.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/test_time_f.png',
                click: this.onClickShowTimeModal
            }, {
                id: 'select-date-year',
                name: '年',
                type: 'others',
                nextFocusRight: 'select-date-month',
                click: this.onClickHideTimeModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: this.onBeforeMoveChangeDate
            }, {
                id: 'select-date-month',
                name: '月',
                type: 'others',
                nextFocusLeft: 'select-date-year',
                nextFocusRight: 'select-date-day',
                click: this.onClickHideTimeModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: this.onBeforeMoveChangeDate
            }, {
                id: 'select-date-day',
                name: '日',
                type: 'others',
                nextFocusLeft: 'select-date-month',
                nextFocusRight: 'select-date-hour',
                click: this.onClickHideTimeModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: this.onBeforeMoveChangeDate
            }, {
                id: 'select-date-hour',
                name: '时',
                type: 'others',
                nextFocusLeft: 'select-date-day',
                nextFocusRight: 'select-date-minute',
                click: this.onClickHideTimeModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: this.onBeforeMoveChangeDate
            }, {
                id: 'select-date-minute',
                name: '分',
                type: 'others',
                nextFocusLeft: 'select-date-hour',
                nextFocusRight: 'select-date-second',
                click: this.onClickHideTimeModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: this.onBeforeMoveChangeDate
            }, {
                id: 'select-date-second',
                name: '秒',
                type: 'others',
                nextFocusLeft: 'select-date-minute',
                click: this.onClickHideTimeModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: this.onBeforeMoveChangeDate
            }
            // 检测类型虚拟按钮
            , {
                id: 'type-prev',
                name: '检测类型上一个',
                type: 'img',
                nextFocusUp: 'input-time',
                nextFocusRight: 'type-next',
                nextFocusDown: 'input-number',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/prev.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/prev_f.png',
                beforeMoveChange: TestType.turnInner
            }, {
                id: 'type-next',
                name: '检测类型下一个',
                type: 'img',
                nextFocusUp: 'input-time',
                nextFocusLeft: 'type-prev',
                nextFocusDown: 'input-number',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/next.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/next_f.png',
                beforeMoveChange: TestType.turnInner
            }
            // 检测数值虚拟按钮
            , {
                id: 'input-number',
                name: '检测数值输入框',
                type: 'div',
                nextFocusUp: 'type-next',
                nextFocusDown: 'member-prev',
                // backgroundImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V16/test_number.png' : g_appRootPath + '/Public/img/hd/HealthTest/V16/test_number.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/test_number.png',
                // focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V16/test_number_f.png' : g_appRootPath + '/Public/img/hd/HealthTest/V16/test_number_f.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/test_number_f.png',
                click: TestNumber.onClickInNumberInput,
                focusChange: TestNumber.onFocusChangeInNumberInput
            }, {
                id: 'select-number-percentile',
                name: '百位',
                type: 'others',
                nextFocusRight: 'select-number-decade',
                click: TestNumber.onClickHideNumberModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: TestNumber.onBeforeMoveChangeNumber
            }, {
                id: 'select-number-decade',
                name: '十位',
                type: 'others',
                nextFocusLeft: 'select-number-percentile',
                nextFocusRight: 'select-number-digit',
                click: TestNumber.onClickHideNumberModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: TestNumber.onBeforeMoveChangeNumber
            }, {
                id: 'select-number-digit',
                name: '分位',
                type: 'others',
                nextFocusLeft: 'select-number-decade',
                nextFocusRight: 'select-number-quantity',
                click: TestNumber.onClickHideNumberModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: TestNumber.onBeforeMoveChangeNumber
            }, {
                id: 'select-number-quantity',
                name: '小数第一位',
                type: 'others',
                nextFocusLeft: 'select-number-digit',
                nextFocusRight: 'select-number-centimeter',
                click: TestNumber.onClickHideNumberModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: TestNumber.onBeforeMoveChangeNumber
            }, {
                id: 'select-number-centimeter',
                name: '小数第二位',
                type: 'others',
                nextFocusLeft: 'select-number-quantity',
                click: TestNumber.onClickHideNumberModal,
                focusChange: this.onFocusChangeColor,
                beforeMoveChange: TestNumber.onBeforeMoveChangeNumber
            }
            // 检测成员虚拟按钮
            , {
                id: 'member-prev',
                name: '检测成员上一个',
                type: 'img',
                nextFocusUp: 'input-number',
                nextFocusRight: 'member-next',
                nextFocusDown: 'status-prev',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/prev.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/prev_f.png',
                beforeMoveChange: TestMember.turnInner
            }, {
                id: 'member-next',
                name: '检测成员下一个',
                type: 'img',
                nextFocusUp: 'input-number',
                nextFocusLeft: 'member-prev',
                nextFocusRight: '',
                nextFocusDown: 'status-prev',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/next.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/next_f.png',
                beforeMoveChange: TestMember.turnInner
            }, {
                id: 'member-add',
                name: '增加成员',
                type: 'img',
                nextFocusUp: 'input-number',
                nextFocusLeft: 'member-prev',
                nextFocusRight: 'member-next',
                nextFocusDown: 'status-prev',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/btn_add.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/btn_add_f.png',
                click: PageJump.jumpMemberEditPage
            }
            // 检测状态虚拟按钮
            , {
                id: 'status-prev',
                name: '检测状态上一个',
                type: 'img',
                nextFocusUp: 'member-prev',
                nextFocusRight: 'status-next',
                nextFocusDown: 'test-submit',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/prev.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/prev_f.png',
                beforeMoveChange: TestStatus.turnInner
            }, {
                id: 'status-next',
                name: '检测状态下一个',
                type: 'img',
                nextFocusUp: 'member-next',
                nextFocusLeft: 'status-prev',
                nextFocusDown: 'test-submit',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/next.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/next_f.png',
                beforeMoveChange: TestStatus.turnInner
            }
            // 提交按钮
            , {
                id: 'test-submit',
                name: '提交输入数据',
                type: 'img',
                nextFocusLeft: 'status-next',
                nextFocusUp: 'status-next',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/submit_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V16/submit.png',
                click: Network.submit
            });
    },

    /*初始化数据*/
    initData: function () {
        // 数据保持
        TestMember.count = parseInt(RenderParam.testMemberIndex);
        G('input-time').innerHTML = RenderParam.testTime || '<span>请按确认键选择检测时间~</span>';
        TestType.count = parseInt(RenderParam.testTypeIndex);
        G('input-number').innerHTML = RenderParam.testValue || (TestType.count == 1 ? '355.00umol/L' : '06.55mmol/L');
        TestStatus.count = parseInt(RenderParam.testStatusIndex);

        // 初始化家庭成员
        TestMember.data = RenderParam.addedMemberList;
        if (TestMember.data.length < 8) {
            S('member-add');
        } else {
            H('member-add');
        }
        TestMember.init();
        TestType.init();
        G('input-number').innerHTML = RenderParam.testValue || (TestType.count == 1 ? '355.00umol/L' : '06.55mmol/L');
    }
};
var TestType = {
    data: ['血糖', '尿酸', '胆固醇'],
    count: 0,
    init: function () {
        this.updateInput();
    },
    /*切换检测类型*/
    turnInner: function (key, btn) {
        var that = TestType;
        if (key == 'left') {
            // that.count = Math.max(0, that.count -= 1);
            that.count -= 1;
            that.count < 0 ? that.count = that.data.length - 1 : null;
            that.updateInput();
        }
        if (key == 'right') {
            // that.count = Math.min(that.data.length - 1, that.count += 1);
            that.count += 1;
            that.count >= that.data.length ? that.count = 0 : null;
            that.updateInput();
        }
    },
    updateInput: function () {
        var that = TestType;
        G('input-type').innerHTML = that.data[that.count];
        G('number-name').innerHTML = that.data[that.count];
        G('input-number').innerHTML = (TestType.count == 1 ? '355.00umol/L' : '06.55mmol/L');

        // 检测类型变化时，更新检测状态
        TestStatus.updateStatus();
    },
    /*获取接口需要用到的检测类型（1-血糖 2-胆固醇 3-甘油三脂 4-尿酸）*/
    getRealType: function () {
        var typeText = G('input-type').innerHTML;
        if (typeText == '血糖') {
            return 1;
        }
        if (typeText == '胆固醇') {
            return 2;
        }
        if (typeText == '尿酸') {
            return 4;
        }
    }
};
var TestNumber = {
    init: function (btn) {
        this.render(btn);
    },
    render: function (btn) {
        var num = G('input-number').innerHTML;
        if (num.length == 11) {
            num = "0" + num;
        }
        // 第一行~
        var htmTop = '<li class="number-top">';
        if (btn.hasPercentile) {
            htmTop += '<span id="prev-number-percentile">' + (+num.charAt(0) == 0 ? 9 : +num.charAt(0) - 1) + '</span>';                     // 百位
        }
        htmTop += '<span id="prev-number-decade">' + (+num.charAt(1) == 0 ? 9 : +num.charAt(1) - 1) + '</span>' +                            // 十位
            '<span id="prev-number-digit">' + (+num.charAt(2) == 0 ? 9 : +num.charAt(2) - 1) + '</span>' +                                   // 个位
            '<span class="number-placeholder">.</span>' +
            '<span id="prev-number-quantity">' + (+num.charAt(4) == 0 ? 9 : +num.charAt(4) - 1) + '</span>' +                                // 第一个小数点
            '<span id="prev-number-centimeter">' + (+num.charAt(5) == 0 ? 9 : +num.charAt(5) - 1) + '</span>';                               // 第二个小数点

        // 第二行~
        var htmCenter = '<li class="number-center">';
        if (btn.hasPercentile) {
            htmCenter += '<span id="select-number-percentile">' + num.charAt(0) + '</span>';
        }
        htmCenter += '<span id="select-number-decade">' + num.charAt(1) + '</span>' +
            '<span id="select-number-digit">' + num.charAt(2) + '</span>' +
            '<span class="number-placeholder">.</span>' +
            '<span id="select-number-quantity">' + num.charAt(4) + '</span>' +
            '<span id="select-number-centimeter">' + num.charAt(5) + '</span>';

        // 第三行~
        var htmBottom = '<li class="number-bottom">';
        if (btn.hasPercentile) {
            htmBottom += '<span id="next-number-percentile">' + (+num.charAt(0) == 9 ? 0 : +num.charAt(0) + 1) + '</span>';
        }
        htmBottom += '<span id="next-number-decade">' + (+num.charAt(1) == 9 ? 0 : +num.charAt(1) + 1) + '</span>' +
            '<span id="next-number-digit">' + (+num.charAt(2) == 9 ? 0 : +num.charAt(2) + 1) + '</span>' +
            '<span class="number-placeholder">.</span>' +
            '<span id="next-number-quantity">' + (+num.charAt(4) == 9 ? 0 : +num.charAt(4) + 1) + '</span>' +
            '<span id="next-number-centimeter">' + (+num.charAt(5) == 9 ? 0 : +num.charAt(5) + 1) + '</span>';
        G('number-modal').innerHTML = htmTop + htmCenter + htmBottom;
    },
    isThreeItems: false,
    onFocusChangeInNumberInput: function (btn, hasFocus) {
        if (hasFocus && G('input-type').innerHTML == '尿酸') {
            btn.hasPercentile = 1;
            TestNumber.isThreeItems = true;
        } else {
            TestNumber.isThreeItems = false;
            btn.hasPercentile = 0;
        }
    },
    onClickHideNumberModal: function () {
        H('number-modal');
        InputData.moveToFocus('input-number');
        TestNumber.isShowNumberModal = false;
        TestNumber.updateInputVal();

    },
    updateInputVal: function (btn) {
        var percentile = '';
        var hasPercentile = LMEPG.BM.getButtonById('input-number');
        if (hasPercentile.hasPercentile) {
            percentile = G('select-number-percentile').innerHTML;
        }
        var decade = G('select-number-decade').innerHTML;
        var digit = G('select-number-digit').innerHTML;
        var quantity = G('select-number-quantity').innerHTML;
        var centimeter = G('select-number-centimeter').innerHTML;
        // 获取单位：尿酸-umol/L 其他-mmol/L
        var unit;
        if (G('input-type').innerHTML == '尿酸') {
            unit = 'umol/L';
        } else {
            unit = 'mmol/L';
        }
        G('input-number').innerHTML = percentile + decade + digit + '.' + quantity + centimeter + unit;
    },
    onBeforeMoveChangeNumber: function (key, btn) {
        var number = +G(btn.id).innerHTML;
        if (key == 'up') {
            TestNumber.sub_number(number, btn);
        }
        if (key == 'down') {
            TestNumber.add_number(number, btn);
        }
    },
    sub_number: function (number, btn) {
        number == 0 ? number = 9 : number--;
        this.update_number(number, btn);
    },
    add_number: function (number, btn) {
        number == 9 ? number = 0 : number++;
        this.update_number(number, btn);
    },
    update_number: function (number, btn) {
        var cutId = btn.id.slice(7);
        G('prev-' + cutId).innerHTML = number == 0 ? 9 : number - 1;
        G(btn.id).innerHTML = number;
        G('next-' + cutId).innerHTML = number == 9 ? 0 : number + 1;
    },
    isShowNumberModal: false,
    onClickInNumberInput: function (btn) {
        TestNumber.init(btn);
        S('number-modal');
        var numberId = TestNumber.isThreeItems ? 'select-number-percentile' : 'select-number-decade';
        InputData.moveToFocus(numberId);
        TestNumber.isShowNumberModal = true;
    }
};
var TestMember = {
    data: [],
    count: 0,
    init: function () {
        this.updateInput();
    },
    turnInner: function (key, btn) {
        if (key == 'down' || key == 'up') {
            return;
        }
        var that = TestMember;
        if (key == 'left' && btn.id == 'member-prev') {
            // that.count = Math.max(0, that.count -= 1);
            that.count -= 1;
            that.count < 0 ? that.count = that.data.length : null;
        }
        if (key == 'right' && btn.id == 'member-next') {
            // that.count = Math.min(that.data.length, that.count += 1);
            that.count += 1;
            that.count > that.data.length ? that.count = 0 : null;
        }
        that.updateInput();
    },
    updateInput: function () {
        var that = TestMember;
        var prevBtnObj = LMEPG.BM.getButtonById('member-prev');
        var nextBtnObj = LMEPG.BM.getButtonById('member-next');
        if (that.data.length > 0 && that.count < that.data.length) { // 成员数目大于0 且小于8个
            G('input-member').innerHTML = that.data[that.count].member_name;
            prevBtnObj.nextFocusRight = 'member-next';
            nextBtnObj.nextFocusLeft = 'member-prev';
        } else {
            if (that.count >= 8) return; // 至多8个不再显示增加按钮
            G('input-member').innerHTML = '<img id="member-add" align="center" src="'  + '__ROOT__/Public/img/hd/HealthTest/V16/btn_add.png" alt="">';
            prevBtnObj.nextFocusRight = 'member-add';
            nextBtnObj.nextFocusLeft = 'member-add';
        }
    }
};
var TestStatus = {
    data: ['午餐后', '早餐前', '睡觉前', '晚餐前'],
    count: 0,
    init: function () {
        this.updateInput();
    },
    turnInner: function (key, btn) {
        var that = TestStatus;
        if (key == 'left') {
            // that.count = Math.max(0, that.count -= 1);
            that.count -= 1;
            that.count < 0 ? that.count = that.data.length - 1 : null;
            that.updateInput();
        }
        if (key == 'right') {
            // that.count = Math.min(that.data.length - 1, that.count += 1);
            that.count += 1;
            that.count >= that.data.length ? that.count = 0 : null;
            that.updateInput();
        }
    },
    updateInput: function () {
        var that = TestStatus;
        G('input-status').innerHTML = that.data[that.count].name;
    },

    /**
     * 根据不同检测类型返回对应的检测状态时刻表。类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
     * @param type
     * @returns {Array}
     */
    initStatusMomentList: function (type) {
        var dataList = [];
        switch (Measure.getTypeAsInt(type)) {
            // 血糖的时刻表区别于其他
            case Measure.Type.BLOOD_GLUCOSE:
                if (LMEPG.Func.isObject(RenderParam.momentData) && LMEPG.Func.isArray(RenderParam.momentData.repast)) {
                    for (var i = 0; i < RenderParam.momentData.repast.length; i++) {
                        var item = RenderParam.momentData.repast[i];
                        dataList.push({
                            type: type,
                            desc: Measure.getTypeText(type),
                            id: item.repast_id,
                            name: item.repast_name
                        });
                    }
                }
                break;
            default:
                if (LMEPG.Func.isObject(RenderParam.momentData) && LMEPG.Func.isArray(RenderParam.momentData.timebuckets)) {
                    for (var i = 0; i < RenderParam.momentData.timebuckets.length; i++) {
                        var item = RenderParam.momentData.timebuckets[i];
                        dataList.push({
                            type: type,
                            desc: Measure.getTypeText(type),
                            id: item.timebucket_id,
                            name: item.timebucket_name
                        });
                    }
                }
                break;
        }

        return dataList;
    },

    /**
     * 获取最终测量状态列表
     * @param measureType
     * @param measureDt
     * @returns {*|Array}
     */
    getStatusList: function (measureType, measureDt) {
        var statusList = this.initStatusMomentList(measureType);
        var realStatusList = Measure.StatusHelper.getStatusListBy(measureType, statusList, measureDt);
        return realStatusList;
    },

    /**
     * 更新检测状态
     */
    updateStatus: function () {
        // 更新检测状态(检测状态和时间、检测类型有关，二者变化的时候都需要重新计算得到检测状态列表）
        var statusList = TestStatus.getStatusList(TestType.getRealType(), G('input-time').innerHTML);
        TestStatus.data = statusList;
        TestStatus.init();
    }
};

/**
 * 网络请求
 * @type {{submit: Network.submit}}
 */
var Network = {
    /**
     * 提交
     */
    submit: function () {
        var reg = /^[0-9]*$/;

        // 检测时间
        var time = G('input-time').innerHTML;
        if (time == '' || !reg.test(time.substr(0, 1))) {
            LMEPG.UI.showToast('请选择时间');
            return;
        }
        // 家庭成员
        if (TestMember.data.length == 0 || TestMember.count >= TestMember.data.length) {
            LMEPG.UI.showToast('请选择或添加一个家庭成员');
            return;
        }
        var memberId = TestMember.data[TestMember.count].member_id;
        // 试纸类型
        var paperType = TestType.getRealType();
        // 测试数值
        if (paperType == 4)
            var testValue = G('input-number').innerHTML.substr(0, 6);
        else
            var testValue = G('input-number').innerHTML.substr(0, 5);
        if (!reg.test(testValue.substr(0, 1))) {
            LMEPG.UI.showToast('请选择检测数值');
            return;
        }
        // 测试状态
        var latestRepastId = '-1';
        var latestTimebucketId = '-1';
        if (paperType == 1) {
            latestRepastId = TestStatus.data[TestStatus.count].id;
        }//血糖：使用repast_id
        else {
            latestTimebucketId = TestStatus.data[TestStatus.count].id;
        } //胆固醇和尿酸：使用timebucket_id

        var postData = {
            member_id: memberId,
            measure_id: '',//切记：手动输入没有measureId，传递空让后台认为这是手动输入的，然后后台会自动分配一个实际的measure_id！
            repast_id: latestRepastId,
            timebucket_id: latestTimebucketId,
            paper_type: paperType,
            env_temperature: 0,
            measure_data: testValue,
            measure_dt: time
        };

        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('DeviceCheck/archiveInspectRecord', postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.result === 0) {
                // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                LMEPG.KEM.setAllowFlag(false);
                LMEPG.UI.showToast('提交成功', 1.5, function () {
                    LMEPG.UI.showToast('查看详情请到“我的-家庭档案”');
                    LMEPG.KEM.setAllowFlag(true);
                });
            } else {
                LMEPG.UI.showToast('提交失败！');
            }
        });
    }
};

/**
 * 页面跳转
 */
var PageJump = {
    /**
     * 获取当前页面对象
     * @param obj
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurPageObj: function () {
        var objCurrent = LMEPG.Intent.createIntent('inputTestData');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('testTime', G('input-time').innerHTML); // 检测时间
        objCurrent.setParam('testTypeIndex', TestType.count); // 检测类型数组下标
        objCurrent.setParam('testValue', G('input-number').innerHTML); // 检测数值
        objCurrent.setParam('testStatusIndex', TestStatus.count); // 检测状态数组下标
        return objCurrent;
    },

    /**
     * 跳转添加家庭成员页面
     */
    jumpMemberEditPage: function () {
        var curObj = PageJump.getCurPageObj();
        var dstObj = LMEPG.Intent.createIntent('familyMembersEdit');
        dstObj.setParam('actionType', 1); // 添加
        LMEPG.Intent.jump(dstObj, curObj);
    }
};

var onBack = function () {
    switch (true) {
        case InputData.isShowTimeModal:
            H('date-modal');
            InputData.moveToFocus('input-time');
            InputData.isShowTimeModal = false;
            break;
        case TestNumber.isShowNumberModal:
            H('number-modal');
            InputData.moveToFocus('input-number');
            TestNumber.isShowNumberModal = false;
            break;
        default:
            LMEPG.Intent.back();
            break;
    }
};
