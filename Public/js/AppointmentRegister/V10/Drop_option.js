/**
 * Created by Administrator on 2019/1/8.
 */
var time = new Date();
var m = time.getMonth() + 1;                // 月
// var m = 3;                // 月
var y = time.getFullYear();               // 年
// var day = time.getDate();                      // 总数
var day = 3;                      // 总数
var endData;
var OptionBox = {
    scrollId: "",
    selectId: "",
    grade: 3,
    row: 5,
    //创建下拉选项
    initOption: function (data, id, scrollId) {
        OptionBox.scrollId = scrollId;
        OptionBox.selectId = id;
        var html = "";
        html += '<div class="option" style="background-image: url(' + LMEPG.App.getAppRootPath() + "/Public/img/hd/Home/V10/option_select.png" + ')"><div class="option-scroll" id="option-scroll">';
        var buttonsTemp = [];
        for (var i = 0; i < data.length; i++) {
            html += '<div id="option-' + (i + 1) + '" class="select-btn">' + data[i].name + '</div>';
            buttons.push({
                id: 'option-' + (i + 1),
                name: '下拉选项',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: 'option-' + i,
                nextFocusDown: 'option-' + (i + 2),
                backgroundImage: "",
                focusImage: "",
                click: OptionBox.selectEnter,
                focusChange: OptionBox.optionFocus,
                beforeMoveChange: OptionBox.onScrollBeforeMoveChange,
                type: "one",
                pos: i,
            });
        }

        html += '<div class="content-select"></div>';
        html += '</div></div>';
        var selectPage = document.createElement("div");  //创建显示控件
        selectPage.id = "dropDown";
        LMEPG.CssManager.addClass(selectPage, "dropDown");
        selectPage.innerHTML = html;
        var body = document.body;
        body.appendChild(selectPage);
        LMEPG.BM.addButtons(buttonsTemp);
        // LMEPG.BM.refresh();
        LMEPG.BM.init("option-1", buttons, "", true);
        LMEPG.BM.requestFocus("option-1");
        LMEPG.KEM.addKeyEvent('KEY_BACK', OptionBox.onSelfBack);

        // 隐藏页面滚动条
        if (OptionBox.scrollId != undefined && OptionBox.scrollId != null && OptionBox.scrollId != "") {
           G(OptionBox.scrollId).style.overflow = "hidden";
        }
    },


    initOptionData: function (data, id, scrollId) {
        OptionBox.scrollId = scrollId;
        OptionBox.selectId = id;
        var html = "";
        var buttonsTemp = [];
        for (var j = 0; j < OptionBox.getTime().length; j++) {
            html += '<div class="option" style="background-image: url(' + LMEPG.App.getAppRootPath() + "/Public/img/hd/Home/V10/option_select.png" + ')"><div class="option-scroll" style="overflow: hidden">';
            for (var i = 0; i < OptionBox.getTime()[j].length; i++) {
                var timeCode = OptionBox.getTime()[j][i];
                if (parseInt(timeCode) < 10) {
                    timeCode = "0" + timeCode;
                }
                if (i == 2) {
                    html += '<div id="option-' + ((j * OptionBox.row) + (i + 1)) + '" class="select-btn2 blue">' + timeCode + '</div>';
                } else {
                    html += '<div id="option-' + ((j * OptionBox.row) + (i + 1)) + '" class="select-btn2">' + timeCode + '</div>';
                }
                // var optionId = "option-" + ((j * OptionBox.row) + (i + 1));
                // alert(G(optionId).innerHTML);
                // if (parseInt(G(optionId).innerHTML) < 10) {
                //     G(optionId).innerHTML = "0" + G(optionId).innerHTML;
                // }
            }
            buttons.push({
                id: 'option-' + ((j * OptionBox.row) + OptionBox.grade),
                name: '下拉选项',
                type: 'img',
                nextFocusLeft: 'option-' + (((j * OptionBox.row) + OptionBox.grade) - OptionBox.row),
                nextFocusRight: 'option-' + (((j * OptionBox.row) + OptionBox.grade) + OptionBox.row),
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: "",
                focusImage: "",
                click: OptionBox.selectEnter,
                focusChange: OptionBox.optionFocus,
                beforeMoveChange: Home.onRecommendBeforeMoveChange,
                type: "three",
            });
            html += '<div class="content-select"></div>';
            html += '</div></div>';
        }
        var selectPage = document.createElement("div");  //创建显示控件
        selectPage.id = "dropDown";
        LMEPG.CssManager.addClass(selectPage, "dropDown");
        selectPage.innerHTML = html;
        var body = document.body;
        body.appendChild(selectPage);
        LMEPG.BM.addButtons(buttonsTemp);
        // LMEPG.BM.refresh();
        LMEPG.BM.init("option-3", buttons, "", true);
        LMEPG.BM.requestFocus("option-3");
        LMEPG.KEM.addKeyEvent('KEY_BACK', OptionBox.onSelfBack);

        // 隐藏页面滚动条
        if (OptionBox.scrollId != undefined && OptionBox.scrollId != null && OptionBox.scrollId != "") {
            document.getElementById(OptionBox.scrollId).style.overflow = "hidden";
        }
    },


    clearOption: function () {
        var body = document.body;
        body.removeChild(G("dropDown"));
        LMEPG.BM.requestFocus(OptionBox.selectId);
    },
    //创建下拉选项确认
    selectEnter: function (btn) {
        // 选择某一项，先把跑马灯关闭
        LMEPG.UI.Marquee.stop();
        // 显示页面滚动条
        if (OptionBox.scrollId != undefined && OptionBox.scrollId != null && OptionBox.scrollId != "") {
            document.getElementById(OptionBox.scrollId).style.overflow = "auto";
        }

        if (btn.type == "three") {
            G(OptionBox.selectId + "-value").innerHTML = G("option-3").innerHTML + "-" + G("option-8").innerHTML + "-" + G("option-13").innerHTML;
        } else {
            G(OptionBox.selectId + "-value").innerHTML = G(btn.id).innerHTML;
            // 选择省，把市区清空
            if (OptionBox.selectId == "txtAre-1") {
                sCity = "";
                sArea = "";
                G("txtAre-2-value").innerHTML = "";
                G("txtAre-3-value").innerHTML = "";
                sProvince = G(btn.id).innerHTML;

                // 这几个地方，没有二三级
                if (sProvince == "台湾省" || sProvince == "香港特别行政区" || sProvince == "澳门特别行政区") {
                    Hide("area-2");
                    Hide("area-3");
                } else {
                    Show("area-2");
                    Show("area-3");
                }
            }
            // 选择市，把区清空
            if (OptionBox.selectId == "txtAre-2") {
                sArea = "";
                G("txtAre-3-value").innerHTML = "";
                sCity = G(btn.id).innerHTML;
            }
            // 选择区
            if (OptionBox.selectId == "txtAre-3") {
                sArea = G(btn.id).innerHTML;
            }
            // 选择亲情关系
            if (OptionBox.selectId == "txtRelation") {
                sRelationIndex = btn.pos;
            }
        }
        OptionBox.clearOption();
        LMEPG.KEM.addKeyEvent('KEY_BACK', 'onBack()');
    },
    optionFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
            LMEPG.UI.Marquee.start(btn.id, 6, 5, 50, "left", "scroll");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            LMEPG.UI.Marquee.stop();
        }
    },

    // 时间二维数组
    getTime: function () {
        var yearList = [y - 2, y - 1, y, y + 1, y + 2];
        var monthList = [m > 1 ? m - 2 : 11, m > 1 ? m - 1 : 12, m, m > 12 ? 1 : m + 1, m == 12 ? 2 : m + 2];
        // var dayList = [OptionBox.getDateStr(-2)[2], OptionBox.getDateStr(-1)[2], day, OptionBox.getDateStr(1)[2], OptionBox.getDateStr(2)[2]];
        var dayList = [1, 2, day, 4, 5];
        var timeData = [yearList, monthList, dayList];

        return timeData;
    },

    clearDay: function (min, length) {
        var i = 0;
        for (; min < length; min++) {
            i++;
            G("option-" + min).innerHTML = "0" + i;
        }
    },

    /*获取一个月的天数 */
    getCountDays: function (curMonth) {
        var curDate = new Date();
        /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
        curDate.setMonth(curMonth);
        /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
        curDate.setDate(0);
        /* 返回当月的天数 */
        return curDate.getDate();
    },


    upTime: function (min, length, max, type) {
        for (; min < length; min++) {
            var timeContent = G("option-" + min).innerHTML;
            G("option-" + min).innerHTML = "" + (parseInt(timeContent) - 1);
            if (parseInt(G("option-" + min).innerHTML) < 10) {
                G("option-" + min).innerHTML = "0" + G("option-" + min).innerHTML;
            }
            if (type == "option-8") {
                if (parseInt(timeContent) == max) {
                    G("option-" + min).innerHTML = 12;
                }
                OptionBox.clearDay(11, 16);
                endData = OptionBox.getCountDays(parseInt(G("option-8").innerHTML));
            } else if (type == "option-13") {
                if (parseInt(timeContent) == max) {
                    G("option-" + min).innerHTML = endData;
                }
            }
        }
    },
    downTime: function (min, length, max, type) {
        for (; min < length; min++) {
            var timeContent = G("option-" + min).innerHTML;
            G("option-" + min).innerHTML = "" + (parseInt(timeContent) + 1);
            if (parseInt(G("option-" + min).innerHTML) < 10) {
                G("option-" + min).innerHTML = "0" + G("option-" + min).innerHTML;
            }
            if (type == "option-8") {
                if (parseInt(timeContent) == max) {
                    G("option-" + min).innerHTML = 1;
                }
                OptionBox.clearDay(11, 16);
                endData = OptionBox.getCountDays(parseInt(G("option-8").innerHTML));
            } else if (type == "option-13") {
                if (parseInt(timeContent) == max) {
                    G("option-" + min).innerHTML = 1;
                }
            }
        }

    },

    // 处理返回键，关闭当前弹窗
    onSelfBack: function () {
        OptionBox.clearOption();
        LMEPG.KEM.addKeyEvent('KEY_BACK', 'onBack()');

        // 显示页面滚动条
        if (OptionBox.scrollId != undefined && OptionBox.scrollId != null && OptionBox.scrollId != "") {
            document.getElementById(OptionBox.scrollId).style.overflow = "auto";
        }
    },

    // 滚动控制
    onScrollBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                OptionBox.showScrollTop(current.id, "option-scroll", "up");
                break;
            case 'down':
                OptionBox.showScrollTop(current.id, "option-scroll", "down");
                break;
        }
    },

    showScrollTop: function (id, scroll, dir) {
        LMEPG.UI.scrollVertically(id, scroll, dir, 35);
    },
}
