/**
 * 数据归档js
 */
var isFirstEnter = true; // 第一次进入加载数据
var TestRecord = {
    buttons: [],
    page: 0,
    maxPage: 0,
    keepFocusId: 'tab-0', // 当前选中的tab
    init: function () {
        this.createButtons();
    },

    /*显示对应记录*/
    showTableRecord: function (btn, hasFocus) {
        TestRecord.keepFocusId = btn.id;

        var _this = TestRecord;
        if (hasFocus) {
            Network.getSpecifyRecordList(btn.paperType, function () {
                curPaperType = btn.paperType;
                _this.data = recordList;
                _this.maxPage = _this.data.length;
                _this.renderTable(btn);
                LMEPG.BM.getButtonById('test-item').nextFocusDown = btn.id;
                LMEPG.BM.getButtonById('write-data').nextFocusDown = btn.id;

                if (isFirstEnter) {
                    isFirstEnter = false;
                    if (!LMEPG.Func.isEmpty(RenderParam.focusId)) {
                        LMEPG.BM.requestFocus(RenderParam.focusId);
                    }
                }

                // 空数据
                S('table-wrap');
                G('null-data-000051').style.display = 'none';
                G('null-data-000051').innerHTML = '';
                if (recordList.length == 0) {
                    H('table-wrap');
                    G('null-data-000051').style.display = 'block';
                    G('null-data-000051').innerHTML = '暂无' + HealthTest.getPaperTypeName(curPaperType) + '检测记录';
                }
            });
        }
    },
    data: [],
    /*渲染记录到表格*/
    renderTable: function (btn) {
        this.page = 0;
        this.recordDataTable();
        this.getFocusItemImg(btn); // 得到当前的焦点
        this.getDistance(); // 得到当前的距离
    },

    /*创建表格*/
    currentData: [],
    recordDataTable: function () {
        var cutTxt = function (str, len) {
            var txt = str;
            if (txt.length > len) {
                txt = txt.slice(0, len) + '...';
            }
            return txt;
        };
        var Ns = this.page; // 起始位置
        this.currentData = this.data.slice(Ns, Ns + 7);
        var htm = '<table id="table">';
        htm += '<tr><td  class="test-time">检测时间</td><td>检测状态</td><td>检测数值</td><td>检测结果</td><td></td></tr>';
        this.currentData.forEach(function (t, i) {
            var trClassName = i % 2 == 0 ? 'even' : 'odd';
            htm += '<tr id=focus-' + i + ' class="' + trClassName + '">' +
                '<td class="test-time">' + t.measure_dt +
                '<td class="test-status">' + HealthTest.getMoment(t) +
                '<td class="test-number">' + t.measure_data + Measure.getUnitText(t.paper_type) +
                // '<td class="test-number">'+ 'sdfa' +
                '<td class="test-result">' + HealthTest.getMetricalRange(t.paper_type, RenderParam.member_gender, t.repast_id, t.measure_data) +
                '<td class="test-delete"><img id="delete-' + i + '" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png" measureId="' + t.measure_id + '" alt=""></tr>';
        });
        G('table-wrap').innerHTML = htm;
        this.isOverflowWrap();
    },
    getFocusItemImg: function (btn) {
        var img = '';
        switch (btn.id) {
            case 'tab-0':
                img = 'bloodSugar';
                break;
            case 'tab-1':
                img = 'cholesterol';
                break;
            case 'tab-2':
                img = 'ua';
                break;
        }
        this.initFocusData(btn.name, img);
    },
    initFocusData: function (name, item) {
        LMEPG.BM.getButtonById('test-item').backgroundImage = g_appRootPath + '/Public/img/hd/HealthTest/V13/test_' + item + '.png';
        LMEPG.BM.getButtonById('test-item').focusImage = g_appRootPath + '/Public/img/hd/HealthTest/V13/test_' + item + '_f.png';
        G('title').innerHTML = RenderParam.member_name + name;
        G('test-item').src = g_appRootPath + '/Public/img/hd/HealthTest/V13/test_' + item + '.png';
        G('person-pic').src = g_appRootPath + '/Public/img/hd/HealthTest/V13/member_' + RenderParam.member_image_id + '.png';
    },
    isOverflowWrap: function () {
        if (this.currentData.length > 6) {
            S('scroll-wrap');
        } else {
            H('scroll-wrap');
        }
    },
    Ns: 0, // 滚动条滚动基数
    Nc: 0, // 滚动条滚动变数
    getDistance: function () {
        var trHeight = RenderParam.platformType == 'hd' ? 50 : 40;
        var max = this.data.length * trHeight; // 滚动条移动最大的距离
        this.Ns = parseInt(((17500 - trHeight) / max));
    },
    onBeforeMoveChangeScrollDistance: function (key, btn) {
        var _this = TestRecord;
        var scrollElement = G('scroll-bar');
        var scrollBtnObj = LMEPG.BM.getButtonById('delete-0');

        initUpFocus();
        switch (true) {
            case key == 'left' || key == 'right':
                return;
            case key == 'up' && _this.page == 0:
                scrollBtnObj.nextFocusUp = TestRecord.keepFocusId ? TestRecord.keepFocusId : 'write-data';
                break;
            case key == 'up' && btn.id == 'delete-0':
                changeUp();
                updateDis();
                break;
            case key == 'down' && btn.id == 'delete-5':
                changeDown();
                updateDis();
                return false;
        }

        function initUpFocus() {
            scrollBtnObj.nextFocusUp = '';
        }

        function updateDis() {
            scrollElement.style.top = _this.Nc + 'px';
        }

        function changeUp() {
            if (_this.page == 0) {
                return;
            }
            _this.Nc = Math.max(-50, _this.Nc -= _this.Ns);
            _this.page--;
            _this.recordDataTable();
            _this.moveToFocus('delete-0');
        }

        function changeDown() {
            if (_this.page == _this.maxPage - 6) {
                return;
            }
            _this.Nc = Math.min(300, _this.Nc += _this.Ns);
            _this.page++;
            _this.recordDataTable();
            _this.moveToFocus('delete-5');
        }
    },
    createButtons: function () {
        this.buttons.push({
            id: 'tab-0',
            name: '血糖记录',
            type: 'div',
            nextFocusUp: 'test-item',
            nextFocusLeft: 'tab-2',
            nextFocusRight: 'tab-1',
            nextFocusDown: 'delete-0',
            focusChange: this.showTableRecord,
            backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/tab_test_f.png' : g_appRootPath + '/Public/img/hd/HealthTest/V13/tab_f.png',
            paperType: 1 // 类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
        }, {
            id: 'tab-1',
            name: '胆固醇记录',
            type: 'div',
            nextFocusUp: 'test-item',
            nextFocusRight: 'tab-2',
            nextFocusLeft: 'tab-0',
            nextFocusDown: 'delete-0',
            focusChange: this.showTableRecord,
            backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/tab_test_f.png' : g_appRootPath + '/Public/img/hd/HealthTest/V13/tab_f.png',
            paperType: 2 // 类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
        }, {
            id: 'tab-2',
            name: '尿酸记录',
            type: 'div',
            nextFocusUp: 'test-item',
            nextFocusLeft: 'tab-1',
            nextFocusRight: 'tab-0',
            nextFocusDown: 'delete-0',
            focusChange: this.showTableRecord,
            backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/tab_test_f.png' : g_appRootPath + '/Public/img/hd/HealthTest/V13/tab_f.png',
            paperType: 4 // 类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
        }, {
            id: 'test-item',
            name: '测试项目',
            type: 'img',
            nextFocusDown: 'tab-0',
            nextFocusRight: 'write-data',
            backgroundImage: '',
            focusImage: '',
            click: PageJump.jumpImeiInputPage
        }, {
            id: 'write-data',
            name: '输入数据',
            type: 'img',
            nextFocusLeft: 'test-item',
            nextFocusDown: 'tab-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/write_data.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/write_data_f.png',
            click: PageJump.jumpPageInputDataPage
        }, {
            id: 'scroll-bar',
            name: '滚动条',
            type: 'img',
            nextFocusUp: 'write-data',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/write_data.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/write_data_f.png',
            focusChange: this.onFocusChangeColor,
            beforeMoveChange: ''
        });
        var count = 7;
        while (count--) {
            this.buttons.push({
                id: 'delete-' + count,
                name: '列表删除焦点',
                type: 'img',
                nextFocusUp: count == 0 ? 'tab-0' : 'delete-' + (count - 1),
                nextFocusDown: 'delete-' + (count + 1),
                nextFocusRight: '',
                nextFocusLeft: '',
                click: Network.deleteArchiveRecord,
                focusChange: this.onFocusChange,
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/deleteRecord_f.png',
                beforeMoveChange: this.onBeforeMoveChangeScrollDistance
            });
        }
        LMEPG.BM.init(RenderParam.keepFocusId, this.buttons, '', true);
    },
    moveToFocus: function (id) {
        LMEPG.BM.requestFocus(id);
    }
};

/**
 * ============================================健康检测相关===============================================
 */
var curPaperType = 1; // 当前试纸类型
var HealthTest = {
    /**
     * 获取时段和就餐状态
     */
    getMoment: function (item) {
        var momentStr = '';
        if (RenderParam.momentData != null) {
            var repast_id = item.repast_id;
            var timebucket_id = item.timebucket_id;
            if (repast_id != '-1') {
                for (var j = 0; j < RenderParam.momentData.repast.length; j++) {
                    if (repast_id == RenderParam.momentData.repast[j].repast_id) {
                        momentStr = RenderParam.momentData.repast[j].repast_name;
                        break;
                    }
                }
            }
            if (timebucket_id != '-1') {
                for (var j = 0; j < RenderParam.momentData.timebuckets.length; j++) {
                    if (timebucket_id == RenderParam.momentData.timebuckets[j].timebucket_id) {
                        momentStr = RenderParam.momentData.timebuckets[j].timebucket_name;
                        break;
                    }
                }
            }
        }
        return momentStr;
    },

    /**
     * 返回测量数据的范围值
     * @param paperType
     * @param userSex
     * @param repastId
     * @param value
     * @returns {*}
     */
    getMetricalRange: function (paperType, userSex, repastId, value) {
        paperType = parseInt(paperType);
        userSex = parseInt(userSex);
        repastId = parseInt(repastId);
        value = parseFloat(value);

        var metricalRange = '正常';
        // 1.	空腹血糖（凌晨、空腹、午餐前、晚餐前、睡前）：3.9≤空腹≤6.1mmol/L为正常， 6.1＜空腹≤7.0 mmol/L为偏高，空腹＞7.0为高，空腹＜3.9为低；
        // 4.	非空腹血糖（早餐后、午餐后、晚餐后）：4.4≤非空腹≤7.8mmol/L为正常， 7.8＜非空腹≤11.1 mmol/L为偏高，非空腹＞11.1为高，非空腹＜4.4为低；
        if (paperType == 1) {
            //血糖标准 //1、凌晨、2、空腹、3、早餐后、4、午餐前、5、午餐后、6、晚餐前、7、晚餐后、8、睡前
            switch (repastId) {
                case 1:
                case 2:
                case 4:
                case 6:
                case 8:
                    //空腹血糖
                    if (value < 3.9) {
                        //低
                        metricalRange = '低';
                    } else if (value >= 3.9 && value <= 6.1) {
                        //正常
                        metricalRange = '正常';
                    } else if (6.1 < value && value <= 7.0) {
                        //偏高
                        metricalRange = '偏高';
                    } else if (value > 7.0) {
                        //高
                        metricalRange = '高';
                    }
                    break;
                case 3:
                case 5:
                case 7:
                    //非空腹血糖
                    if (value < 4.4) {
                        //低
                        metricalRange = '低';
                    } else if (value >= 4.4 && value <= 7.8) {
                        //正常
                        metricalRange = '正常';
                    } else if (7.8 < value && value <= 11.1) {
                        //偏高
                        metricalRange = '偏高';
                    } else if (value > 11.1) {
                        //高
                        metricalRange = '高';
                    }
                    break;
            }
        } else if (paperType == 2) {
            //胆固醇 1. 2.8≤胆固醇≤5.17mmol/L为正常，5.17＜胆固醇≤6.0mmol/L为偏高，6.0mmol/L＜胆固醇为高，胆固醇＜2.8mmol/L为低。
            if (value < 2.8) {
                metricalRange = '低';
            } else if (value >= 2.8 && value <= 5.17) {
                metricalRange = '正常';
            } else if (value > 5.17 && value <= 6.0) {
                metricalRange = '偏高';
            } else if (value > 6.0) {
                metricalRange = '高';
            }
        } else if (paperType == 3) {
            //甘油三酯// 0.56≤甘油三酯≤1.7mmol/L为正常；1.7＜甘油三酯≤2.2mmol/L为偏高，甘油三酯＞2.2mmol/L为高，甘油三酯＜0.56mmol/L为低。
            if (value < 0.56) {
                metricalRange = '低';
            } else if (value >= 0.56 && value <= 1.7) {
                metricalRange = '正常';
            } else if (value > 1.7 && value <= 2.2) {
                metricalRange = '偏高';
            } else if (value > 2.2) {
                metricalRange = '高';
            }
        } else if (paperType == 4) {
            //尿酸  男：149≤尿酸≤416 umol/L为正常。尿酸＜149 umol/L为低，416 umol/L＜尿酸为高。
            // 女：89≤尿酸≤357 umol/L为正常。尿酸＜89 umol/L为低，357 umol/L＜尿酸为高
            if (userSex == 0) {
                //男
                if (value < 149) {
                    metricalRange = '低';
                } else if (value >= 149 && value <= 416) {
                    metricalRange = '正常';
                } else if (value > 416) {
                    metricalRange = '高';
                }
            } else {
                //女
                if (value < 89) {
                    metricalRange = '低';
                } else if (value >= 89 && value <= 357) {
                    metricalRange = '正常';
                } else if (value > 357) {
                    metricalRange = '高';
                }
            }
        }
        return metricalRange;
    },

    /**
     * 获取试纸类型名
     * @param paperType
     * @returns {string}
     */
    getPaperTypeName: function (paperType) {
        var strPaperType;
        switch (parseInt(paperType)) {
            case 1:
                strPaperType = '血糖';
                break;
            case 2:
                strPaperType = '胆固醇';
                break;
            case 3:
                strPaperType = '甘油三脂';
                break;
            case 4:
                strPaperType = '尿酸';
                break;
            default:
                strPaperType = '未知';
                break;
        }
        return strPaperType;
    }
};

/**
 * ============================================网络请求===============================================
 */
var recordList = [];
var Network = {
    /**
     * 获取指定类型的检测记录
     * @param paperType
     */
    getSpecifyRecordList: function (paperType, callback) {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Measure/queryMemberInspectRecord', {'paperType': paperType, 'memberId': RenderParam.member_id}, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);
            if (data.result == 0) {
                recordList = data.list;
                callback();
            } else {
                LMEPG.UI.showToast('数据获取失败！');
            }
        });
    },

    /**
     * 删除一条已归档数据
     * @param measureId
     */
    deleteArchiveRecord: function (btn) {
        LMEPG.UI.showWaitingDialog('');
        var measureId = G(btn.id).getAttribute('measureId');
        LMEPG.ajax.postAPI('Measure/deleteArchiveRecord', {'measureId': measureId, 'memberId': RenderParam.member_id}, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            data = data instanceof Object ? data : JSON.parse(data);
            console.log(data);
            if (data.result == 0) {
                LMEPG.UI.showToast('删除成功！');
                // 刷新当前Tab
                var curTabBtnId;
                if (curPaperType == 1) {
                    curTabBtnId = 'tab-0';
                } else if (curPaperType == 2) {
                    curTabBtnId = 'tab-1';
                } else if (curPaperType == 4) {
                    curTabBtnId = 'tab-2';
                }
                TestRecord.moveToFocus(curTabBtnId);
            } else {
                LMEPG.UI.showToast('删除失败！');
            }
        });
    }
};

/**
 * ===========================================页面跳转==============================================
 */
var PageJump = {
    /**
     * 获取当前页面
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('testRecord');
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_gender', RenderParam.member_gender);
        objCurrent.setParam('keepFocusId', TestRecord.keepFocusId);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },

    /**
     * 跳转到检测页面
     * @param btn
     */
    jumpImeiInputPage: function (btn) {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('imeiInput');
        var enterType; // 进入下个页面的检测类型
        // curPaperType 类型：1-血糖 2-胆固醇 3-甘油三脂 4-尿酸
        if (curPaperType == 1) {
            enterType = 3;
        } else if (curPaperType == 2) {
            enterType = 1;
        } else if (curPaperType == 4) {
            enterType = 2;
        }
        dstPage.setParam('testType', enterType); // 检测类型：1-胆固醇 2-尿酸 3-血糖
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 跳转输入数据页面
     */
    jumpPageInputDataPage: function () {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('inputTestData');
        LMEPG.Intent.jump(dstPage, curPage);
    }
};

var onBack = function () {
    LMEPG.Intent.back();
};