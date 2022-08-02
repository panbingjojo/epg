/**
 * 数据归档js
 */
var TestIntroduce = {
    buttons: [],
    keepFocusId: 'write-data', // 当前选中的tab
    init: function () {
        this.createButtons();
        TestIntroduce.createHtml(RenderParam.fatType);
    },
    /**
     * 获取已归档体脂数据
     * @param measureId
     */

    decimalAdjust: function (type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    },

    createHtml: function (data) {
        // Decimal round
        if (!Math.round10) {
            Math.round10 = function(value, exp) {
                return TestIntroduce.decimalAdjust('round', value, exp);
            };
        }
        G("fat").innerHTML = Math.round10(data.labelValue,-2) + data.labelUnit;
        G("health-advice").innerHTML = typeof data.labelContent == "undefined" ? "" : data.labelContent;
        G("sport-advice").innerHTML = typeof data.labelSportsAdvice == "undefined" ? "" : data.labelSportsAdvice;
        G("diet-advice").innerHTML = typeof data.labelDietaryAdvice == "undefined" ? "" : data.labelDietaryAdvice;
        G("fat-icon").innerHTML = data.labelLevelName;
        var strHtml = "";
        curDataList = data.levelIntervalList;
        G("title").innerHTML = data.label;

        var num = this.findLevel(RenderParam.fatType);
        var x = parseInt(800 / curDataList.length);
        strHtml += '<img id="process-img" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/long_' + (curDataList.length - 1) + '.png" alt="">';
        for (var i = 0; i < curDataList.length; i++) {
            var tmpPos = x * i;
            var tmpPos2 = x * i + x;
            if (i == curDataList.length - 1) {
                // strHtml += '<div id="percent-' + (i + 1) + '" class="percent" style="left: '+tmpPos2+'px">' + curDataList[i].startValue + '</div>'
            } else {
                strHtml += '<div id="percent-' + (i + 1) + '" class="percent"  style="left: ' + tmpPos2 + 'px">' + curDataList[i].endValue + '</div>'
            }
            strHtml += ' <div id="type-' + (i + 1) + '" class="type"  style="left: ' + tmpPos + 'px"> ' + curDataList[i].levelIntervalName + '</div>'
        }

        var posDot = this.getLevel(curDataList, data.labelValue);
        var bgImg = g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/fat_h_' + (posDot + 1) + '.png';
        G("fat-icon").style.background = 'url(' + bgImg + ')';
        var levelData = curDataList[posDot];
        var curLevel = typeof levelData.endValue != "undefined" ? levelData.endValue : levelData.startValue;
        if (data.labelValue - curLevel < 0) {
            var curDot = posDot * x + data.labelValue
        } else if (data.labelValue - curLevel > 20) {
            var curDot = posDot * x + (data.labelValue - curLevel)
        } else {
            var curDot = posDot * x + (curData[0].labelValue - curLevel) * num;
        }
        if (curDot > 780) {
            curDot = 610;
        }
        strHtml += '<div id="fat-pos"  style="left: ' + curDot + 'px"></div>';
        G("process").innerHTML = strHtml;

        if(RenderParam.fatType === '去脂体重'){
            G('advice-content').innerHTML =
                "<div style='color: #fff;margin: 20px;font-size: 20px'>什么是去脂体重?</div>" +
                "<div style='color: #fff;margin:20px;font-size: 20px'>去脂体重又称瘦体重，即体内的非脂肪成分，其中肌肉和骨骼占很大比重，这是影响身体活动能力的重要因素。在运动训练中，保持较高的瘦体重，对提高有氧耐力和运动能力是非常有好处的。</div>"

        }
    },

    getLevel: function (data, curData) {
        var temp = 0;
        for (var i = 0; i < data.length; i++) {
            if (curData < data[i].endValue) {
                temp = i;
                break
            } else if (i == data.length - 1) {
                temp = i;
                break
            }
        }
        return temp;
    },

    findLevel: function (name) {
        switch (name) {
            case "内脏脂肪等级":
                return 13;
                break;
            case "基础代谢量":
                return 0.15;
                break;
            default:
                return 40;
                break

        }
    },

    createButtons: function () {
        this.buttons.push({
            id: 'write-data',
            name: '体脂数据输入',
            type: 'img',
            nextFocusRight: 'fat-test',
            nextFocusDown: 'BMI-bg',
        })
        LMEPG.BM.init("", this.buttons, '', true);
    },

};

var onBack = function () {
    LMEPG.Intent.back();
};