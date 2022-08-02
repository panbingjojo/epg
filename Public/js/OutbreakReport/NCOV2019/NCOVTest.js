/*
 * 新型冠状病毒自测评估js处理逻辑
 */
var NCOV = {
    storeDataQuestion: [0, 0, 0],
    searchData: {"date": "", "type": "0", "area": "", "no": "", "page": "1", "pageSize": "1000"},
    modalId: '',
    inputId: '',
    optionIndex: '',
    traffic: '',
    init: function () {
        this.maxDay = 31;
        // LMEPG.BM.init('input-date', buttons, '', true);
        LMEPG.BM.init('question-1-option-1', NVOVTestButtons, '', true);
    },
    /**
     * 点击上一步按钮
     * @param btn
     */
    questionPrevStep: function (btn) {
        var prevStep = +btn.stepIndex.slice(-1) - 1;
        var focusId = prevStep === 1 || prevStep === 3 ? 'question-' + prevStep + '-option-1' : "input-date";
        Hide(btn.stepIndex);
        Show('question-' + prevStep);
        LMEPG.BM.requestFocus(focusId);
    },
    /**
     * 点击下一步按钮
     * @param btn
     */
    questionNextStep: function (btn) {
        var nextStep = +btn.stepIndex.slice(-1) + 1;
        var focusId = nextStep === 1 || nextStep === 3 ? 'question-' + nextStep + '-option-1' : "input-date";
        Hide(btn.stepIndex);
        Show('question-' + nextStep);
        LMEPG.BM.requestFocus(focusId);
    },
    /**
     * 点击最后一个题目下一步按钮显示评测结果
     * @param btn
     */
    questionNextStepShowAnswerResult: function (btn) {
        NCOV.storeDataQuestion[1] = NCOV.saveUseResultAction();
        var currentPage = LMEPG.Intent.createIntent("nCoV-test");
        var targetPage = LMEPG.Intent.createIntent("nCoV-test-result");
        targetPage.setParam('result', JSON.stringify(NCOV.storeDataQuestion));
        LMEPG.Intent.jump(targetPage, currentPage)
    },
    /**
     * 点击轮渡输入框
     * @param btn
     */
    clickInputBoard: function (btn) {
        var me = NCOV;
        var scrollObj = me.scrollSelectOption;
        me.inputId = btn.id;
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Epidemic/getEpidemicSameTrip', me.searchData, function (data) {
            data = data instanceof Object ? data : JSON.parse(data);
            if (data.code === 200) {
                me.saveUseResult = data.list;
                me.modalId = 'board-modal-wrap';
                scrollObj.num = 0;
                scrollObj.listCount = 5;
                scrollObj.data = NCOV.assembleData(data);
                scrollObj.render();
                LMEPG.BM.requestFocus('board-1');
                S('board-modal-wrap');
            } else {
                LMEPG.UI.showToast('没有该检索结果哦~');
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },
    /**
     * 点击通用搜索框
     * @param btn
     */
    clickInputKeyword: function (btn) {
        var trafficIdx = NCOV.traffic;
        // 选择地铁、公交车、其他场所
        if (trafficIdx === "3" || trafficIdx === "5" || trafficIdx === "8") {
            if (G('input-province').innerText === "省/直辖市" || G('input-city').innerText === "市/区") {
                LMEPG.UI.showToast('请先选择省/市', 1);
                return;
            }
        }

        // 长途客车/大巴、出租车
        if (trafficIdx === "4" || trafficIdx === "6") {
            if (G('input-abbreviation').innerText === "省简称") {
                LMEPG.UI.showToast('请先选择省简称', 1);
                return;
            }
        }
        NCOV.inputId = btn.id;
        NCOVsearch.init();
    },
    /**
     * 点击题目选项
     * @param btn
     */
    clickQuestionOption: function (btn) {
        var selectIcon = G(btn.selectId);
        if (selectIcon.src.indexOf('_s') > -1) {
            NCOV.storeDataQuestion[btn.qIndex] -= 1;
            selectIcon.src = ROOT + '/Public/img/hd/OutbreakReport/NCOV/option.png';
        } else {
            NCOV.storeDataQuestion[btn.qIndex] += 1;
            selectIcon.src = ROOT + "/Public/img/hd/OutbreakReport/NCOV/option_s.png"
        }
    },
    /**
     * 点击交通方式选择框
     * @param btn
     */
    clickInputTraffic: function (btn) {
        S('traffic-modal-wrap');
        NCOV.inputId = btn.id;
        NCOV.modalId = 'traffic-modal-wrap';
        NCOV.scrollSelectOption.data = [
            {name: "全部", id: 0},
            {name: "飞机", id: 1},
            {name: "火车", id: 2},
            {name: "地铁", id: 3},
            {name: "长途客车/大巴", id: 4},
            {name: "公交车", id: 5},
            {name: "出租车", id: 6},
            {name: "轮船", id: 7},
            {name: "其他公共场所", id: 8}
        ];
        NCOV.scrollSelectOption.num = 0;
        NCOV.scrollSelectOption.listCount = 5;
        NCOV.scrollSelectOption.render();
        NCOV.searchData = {"date": "", "type": "0", "area": "", "no": "", "page": "1", "pageSize": "1000"};
        LMEPG.BM.requestFocus('traffic-1');
    },
    /**
     * 点击省份选择框
     * @param btn
     */
    clickInputProvince: function (btn) {
        NCOV.getChineseDistrict("0", 'province-modal-wrap', 'province');
        NCOV.inputId = btn.id;
        G("input-city").innerHTML = '市/区';
    },
    /**
     * 点击城市选择框
     * @param btn
     */
    clickInputCity: function (btn) {
        if (NCOV.modalId !== "province-modal-wrap" && NCOV.modalId !== "city-modal-wrap") return;
        NCOV.getChineseDistrict(NCOV.optionIndex, 'city-modal-wrap', 'city');
        NCOV.inputId = btn.id;
    },
    /**
     * 点击省简称输入框
     * @param btn
     */
    clickAbbreviationInput: function (btn) {
        NCOV.getChineseDistrict('0', 'abbreviation-modal-wrap', 'abbreviation');
        NCOV.inputId = btn.id;
    },
    /**
     * 省市检索
     * @param num
     * @param param1
     * @param param2
     * @param callback
     */
    getChineseDistrict: function (num, param1, param2, callback) {
        var me = NCOV;
        var name = param2 === "abbreviation" ? "short" : "name";
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('System/queryChineseDistrict', {"proId": num}, function (data) {
            if (data.code == 200) {
                me.scrollSelectOption.data = NCOV.assembleData(data, name);
                me.saveUseResult = data.list;
                me.modalId = param1;
                me.scrollSelectOption.num = 0;
                me.scrollSelectOption.listCount = 3;
                me.scrollSelectOption.render();
                LMEPG.BM.requestFocus(param2 + '-1');
                S(param1);
                typeof callback === 'function' && callback();
            } else {
                LMEPG.UI.showToast('获取失败[code=' + data.result + ']');
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },
    /**
     * 脚手架触发程序
     * @param data
     */
    stageClickKewordInput: function (data) {
        // 返回数据异常/或搜索清空隐藏搜索列表模态框
        G('search-result').innerHTML = "";
        if (!data || !data.list || data.length === 0 || G('input-keyword').getAttribute('val') === "") {
            H('search-result');
            return;
        }

        NCOV.scrollSelectOption.data = NCOV.assembleData(data);
        NCOV.scrollSelectOption.num = 0;
        NCOV.scrollSelectOption.listCount = 3;
        NCOV.modalId = 'search-result';
        NCOV.scrollSelectOption.render();
        G('search-result').className = 'modal-search-wrap-' + NCOV.traffic;
    },
    /**
     * 组装接口数据
     * @param data
     * @param param
     */
    assembleData: function (data, param) {
        // 组装搜索结果
        var resultData = [];
        var resultList = data.list;
        var len = resultList.length;
        while (len--) {
            var id = resultList[len].id ? resultList[len].id : len;
            var name = resultList[len][param] ? resultList[len][param] : resultList[len];
            resultData.unshift({id: id, name: name});
        }
        return resultData;
    },
    scrollSelectOption: {
        num: 0,
        data: null,
        listCount: 0, // 渲染列表的个数
        selectedOption: '', // 选择的选项
        move: function (key, btn) {
            var me = NCOV.scrollSelectOption;
            //  向上滚动
            if (key === "up" && btn.id.slice(-1) === '1') {
                me.prev();
                LMEPG.BM.requestFocus(btn.id);
            }
            // 向下滚动
            if (key === "down" && +btn.id.slice(-1) === me.listCount) {
                me.next();
                LMEPG.BM.requestFocus(btn.id);
            }
        },
        prev: function () {
            if (this.num <= 0) return;
            this.num--;
            this.render();

        },
        next: function () {
            if (this.num >= this.data.length - this.listCount) return;
            this.num++;
            this.render();
        },
        render: function () {
            var htm = '';
            var focusIdPrefix = '';
            var listWrapId = '';
            var listData = this.data.slice(this.num, this.num + this.listCount);
            if (!this.data || !this.data.length) {
                LMEPG.UI.showToast('暂无查询信息！', 2, function () {
                    H(NCOV.modalId);
                });
                return
            }
            switch (NCOV.inputId) {
                // 渲染交通工具列表
                case "input-traffic":
                    focusIdPrefix = 'traffic-';
                    listWrapId = 'traffic-modal-wrap';
                    break;
                // 渲染省份列表
                case "input-province":
                    focusIdPrefix = 'province-';
                    listWrapId = 'province-modal-wrap';
                    break;
                // 渲染城市列表
                case "input-city":
                    focusIdPrefix = 'city-';
                    listWrapId = 'city-modal-wrap';
                    break;
                // 渲染车牌简称列表
                case "input-abbreviation":
                    focusIdPrefix = 'abbreviation-';
                    listWrapId = 'abbreviation-modal-wrap';
                    break;
                // 渲染轮船船号列表
                case "input-board":
                    focusIdPrefix = 'board-';
                    listWrapId = 'board-modal-wrap';
                    break;
                // 渲染通用结果搜索列表
                default:
                    focusIdPrefix = 'result-';
                    listWrapId = 'search-result';
                    break;
            }

            for (var i = 0; i < listData.length; i++) {
                htm += '<li id="' + focusIdPrefix + (i + 1) + '" data-id="' + listData[i].id + '">' + listData[i]["name"];
            }

            G(listWrapId).innerHTML = htm;
            S(NCOV.modalId);
        },
        focus: function (btn, bol) {
            var optionEl = G(btn.id);
            var optionTxt = optionEl.innerText;
            if (optionTxt.length > 8) {
                if (bol) {
                    optionEl.innerHTML = '<marquee>' + optionTxt + '</marquee>';
                } else {
                    optionEl.innerHTML = optionTxt;
                }
            }
        },
        /**
         * 选择列表项被点击
         * @param btn
         */
        click: function (btn) {
            var optionElement = G(btn.id);
            var txt = optionElement.innerText;
            var dataId = optionElement.getAttribute('data-id');
            var keywordBtn = LMEPG.BM.getButtonById('input-keyword');
            var trafficBtn = LMEPG.BM.getButtonById('input-traffic');

            if (NCOV.inputId === "input-traffic") {
                NCOV.traffic = dataId;
                NCOV.searchData['type'] = dataId;
            }
            // 二级关联选择（省->市）
            if (NCOV.inputId === "input-province") NCOV.optionIndex = G(btn.id).getAttribute('data-id');
            if (NCOV.inputId === "input-city") NCOV.searchData['area'] = G(btn.id).innerText;
            if (txt === '全部') {
                H('select-abbreviation');
                H('select-board');
                S('search-text');
                H('select-area');
                G('search-title').innerHTML = "查行程：";
                G('search-text').className = 'search-trip-number';
                G('input-keyword').innerHTML = '<span>输入同行程查询关键字如：CA8392</span>';
                G('input-keyword').style.backgroundImage = "url(__ROOT__/Public/img/hd/OutbreakReport/NCOV/question2_input1.png)";
                trafficBtn.nextFocusDown = 'input-keyword';
                keywordBtn.nextFocusUp = 'input-traffic';
                keywordBtn.backgroundImage = ROOT + '/Public/img/hd/OutbreakReport/NCOV/question2_input1.png';
                keywordBtn.focusImage = ROOT + '/Public/img/hd/OutbreakReport/NCOV/question2_input1_f.png';
            }
            if (txt === '飞机' || txt === "火车") {
                H('select-abbreviation');
                H('select-board');
                H('select-area');
                S('search-text');
                G('search-title').innerHTML = (txt === '飞机' ? '航班号：' : "车次：");
                G('search-text').className = 'search-trip-number';
                G('input-keyword').innerHTML = ("<span>" + (txt === '飞机' ? '输入航班号：如CA898' : "输入列车号：如K3838") + "</span>");
                G('input-keyword').style.backgroundImage = "url(__ROOT__/Public/img/hd/OutbreakReport/NCOV/question2_input1.png)";
                trafficBtn.nextFocusDown = 'input-keyword';
                keywordBtn.nextFocusUp = 'input-traffic';
                keywordBtn.backgroundImage = ROOT + '/Public/img/hd/OutbreakReport/NCOV/question2_input1.png';
                keywordBtn.focusImage = ROOT + '/Public/img/hd/OutbreakReport/NCOV/question2_input1_f.png';
            }

            if (txt === '地铁' || txt === "公交车" || txt === "其他公共场所") {
                H('select-abbreviation');
                H('select-board');
                S('search-text');
                S('select-area');
                G('search-text').className = 'search-area-number';
                G('search-title').innerHTML = '';
                G('input-keyword').innerHTML = ('<span>' + txt + '线路：比如2 </span>');
                G('input-keyword').style.backgroundImage = "url(__ROOT__/Public/img/hd/OutbreakReport/NCOV/question2_input1.png)";
                trafficBtn.nextFocusDown = 'input-province';
                keywordBtn.nextFocusUp = 'input-province';
                keywordBtn.backgroundImage = ROOT + '/Public/img/hd/OutbreakReport/NCOV/question2_input1.png';
                keywordBtn.focusImage = ROOT + '/Public/img/hd/OutbreakReport/NCOV/question2_input1_f.png';
            }

            if (txt === '长途客车/大巴' || txt === "出租车") {
                H('select-board');
                H('select-area');
                S('search-text');
                S('select-abbreviation');
                G('search-text').className = 'search-abbreviation-number';
                G('search-title').innerHTML = '';
                G('input-keyword').innerHTML = ('<span> 输入车牌号：比如:A168xxx</span>');
                trafficBtn.nextFocusDown = 'input-abbreviation';
                keywordBtn.nextFocusLeft = 'input-abbreviation';
                keywordBtn.nextFocusUp = 'input-traffic';
                keywordBtn.backgroundImage = ROOT + '/Public/img/hd/OutbreakReport/NCOV/search_abbreviation_bg.png';
                keywordBtn.focusImage = ROOT + '/Public/img/hd/OutbreakReport/NCOV/search_abbreviation_f.png';
            }

            if (txt === '轮船') {
                H('select-abbreviation');
                H('select-area');
                H('search-text');
                S('select-board');
                trafficBtn.nextFocusDown = 'input-board';
                LMEPG.BM.getButtonById('question-2-prev-step').nextFocusUp = 'input-board';
                LMEPG.BM.getButtonById('question-2-next-step').nextFocusUp = 'input-board';
            } else {
                LMEPG.BM.getButtonById('question-2-prev-step').nextFocusUp = 'input-keyword';
                LMEPG.BM.getButtonById('question-2-next-step').nextFocusUp = 'input-keyword';
            }

            // 隐藏模态框列表选项
            H(NCOV.modalId);
            // 绑点列表选择项值到输入框
            G(NCOV.inputId).innerHTML = txt;
            // 送回输入框焦点
            LMEPG.BM.requestFocus(NCOV.inputId);
        }
    },
    /**
     * 保存答题结果用于评测结果标准
     */
    saveUseResultAction: function () {
        if (NCOV.inputId === "input-keyword" || NCOV.inputId === "input-board") {
            var ret = NCOV.saveUseResult;
            var len = ret.length;
            var use = G(NCOV.inputId).innerText;
            while (len--) {
                if (use === ret[len]) return 1;
            }
        }
        return 0;
    },
    /**
     * 点击日期选择框
     * @param btn
     */
    clickInputDate: function (btn) {
        NCOV.setDaysMax();
        S('date-modal-wrap');
        LMEPG.BM.requestFocus('curr-year');
        NCOV.inputId = btn.id;
        NCOV.modalId = 'date-modal-wrap';
    },
    /**
     * 点击日期模态框
     * @param btn
     */
    clickModalDate: function (btn) {
        var year = G('curr-year').innerText;
        var month = G('curr-month').innerText;
        var day = G('curr-day').innerText;
        var selectDate = year + '-' + month + '-' + day;
        G('input-date').innerHTML = selectDate;
        H('date-modal-wrap');
        LMEPG.BM.requestFocus('input-date');
        NCOV.modalId = '';
        NCOV.searchData['date'] = selectDate;

    },
    /**
     * 移动日期模态框选项按钮
     * @param key
     * @param btn
     */
    moveModalDate: function (key, btn) {
        var lastStr = btn.id.slice(5);
        var prev = G('prev-' + lastStr);
        var curr = G('curr-' + lastStr);
        var next = G('next-' + lastStr);
        var prevCount = +prev.innerText;
        var currCount = +curr.innerText;
        var nextCount = +next.innerText;

        // 向上滚动日期
        if (key === "up") {
            // 上一年
            if (lastStr === "year") {
                prev.innerHTML = '';
                curr.innerHTML = '2020';
                next.innerHTML = '2021';
            }
            // 上一月
            if (lastStr === "month") {
                prev.innerHTML = zero(prevCount <= 1 ? 12 : prevCount -= 1);
                curr.innerHTML = zero(currCount <= 1 ? 12 : currCount -= 1);
                next.innerHTML = zero(nextCount <= 1 ? 12 : nextCount -= 1);
                NCOV.setDaysMax(key, lastStr);
            }
            // 上一天
            if (lastStr === "day") {
                prev.innerHTML = zero(prevCount <= 1 ? NCOV.maxDay : prevCount -= 1);
                curr.innerHTML = zero(currCount <= 1 ? NCOV.maxDay : currCount -= 1);
                next.innerHTML = zero(nextCount <= 1 ? NCOV.maxDay : nextCount -= 1);
            }
        }
        // 向下滚动日期对象
        if (key === "down") {
            // 下一年
            if (lastStr === "year") {
                prev.innerHTML = '2020';
                curr.innerHTML = '2021';
                next.innerHTML = '';
            }
            // 下一月
            if (lastStr === "month") {
                prev.innerHTML = zero(prevCount === 12 ? 1 : prevCount += 1);
                curr.innerHTML = zero(currCount === 12 ? 1 : currCount += 1);
                next.innerHTML = zero(nextCount === 12 ? 1 : nextCount += 1);
                NCOV.setDaysMax(key, lastStr);
            }
            // 下一天
            if (lastStr === "day") {
                prev.innerHTML = zero(prevCount >= NCOV.maxDay ? 1 : prevCount += 1);
                curr.innerHTML = zero(currCount >= NCOV.maxDay ? 1 : currCount += 1);
                next.innerHTML = zero(nextCount >= NCOV.maxDay ? 1 : nextCount += 1);
            }
        }

        function zero(num) {
            return (num + '').length === 1 ? '0' + num : num;
        }
    },
    /**
     * 设置某年某月的最大天数
     * @param key
     * @param str
     * @returns {number}
     */
    setDaysMax: function (key, str) {
        if (key === 'left' || key === "right" || str === 'day') return;
        var year = G('curr-year').innerText;
        var month = G('curr-month').innerText;
        var days = new Date(year, month, 0).getDate();
        G('prev-day').innerHTML = days;
        G('curr-day').innerHTML = '01';
        G('next-day').innerHTML = '02';
        NCOV.maxDay = days;
    }
};

/**
 * 返回处理
 */
function onBack() {
    // 此处保护键盘处于显示状态返回送回焦点
    var keypad = G('key-container');
    if (NCOVsearch.isShowLetter) {
        LMEPG.BM.requestFocus(NCOVsearch.keepaliveId);
        NCOVsearch.isShowLetter = false;
    } else if (keypad) {
        var backFocusId = G('result-1') ? "result-1" : NCOV.inputId;
        keypad.parentNode.removeChild(keypad);
        LMEPG.BM.requestFocus(backFocusId);
    } else if (NCOV.modalId) {
        H(NCOV.modalId);
        NCOV.modalId = "";
        LMEPG.BM.requestFocus(NCOV.inputId);
    } else {

        LMEPG.Intent.back()
    }
}
