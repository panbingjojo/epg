/**
 *
 * 处理查询确诊小区逻辑
 * */

var SureArea = {
    init: function () {
        this.buttons = [];
        this.retNameAry = [];
        this.retIdxAry = [];
        this.num = "";
        this.provinceIndex = "";
        this.cityIndex = "";
        this.municipality = ['北京市', '上海市', '天津市', '重庆市'];
        this.inputId = "input-province";
        this.searchData = {"province": "", "city": "", "district": ""};
        this.createBtns();
        this.setCurrDate();
        this.getDefaultSureArea();
        LMEPG.BM.init('input-province', this.buttons, '', true);
    },
    /**
     * 获取默认省->省会城市->第一个区的确诊区域
     */
    getDefaultSureArea: function () {
        var me = SureArea;
        me.getChinaTerritoryMakeName(0, function (data) {
            me.resolveDefaultProvince(data.list);
        });
    },
    /**
     * 解析默认省/直辖市赋值
     * @param data
     */
    resolveDefaultProvince: function (data) {
        var me = SureArea;
        var lmcid = RenderParam.lmcid;
        var pid = lmcid === "000051" ? "" : lmcid.slice(0, 4);
        var province = "";
        var areaCode = RenderParam.areaCode;

        data.forEach(function (item, index, self) {
            if (lmcid === '000051') {
                // 简写版到标准列表中区遍历查找正确的名称
                province = RenderParam.areaCodes[areaCode][1];
                if (areaCode && province && item.name.indexOf(province) > -1) {
                    me.initDefaultParam(item);
                }
            } else if (pid === item.code.slice(0, 4)) {
                me.initDefaultParam(item);
            }
        })
    },
    /**
     * 初始化默认省参数
     * @param item
     */
    initDefaultParam: function (item) {
        var me = SureArea;
        me.provinceIndex = item.id;
        me.searchData['province'] = item.name;
        me.getProvincialCapital(item.id);
        G('input-province').innerHTML = item.name;
        console.log(item)
    },
    /**
     * 获取省会城市并进行渲染第一个区域
     * @param provinceIndex
     */
    getProvincialCapital: function (provinceIndex) {
        var me = SureArea;
        var capital = '';
        LMEPG.BM._buttons['input-district'].focusable = true;
        me.getChinaTerritoryMakeName(provinceIndex, function (cityData) {
            capital = cityData.list[0];// 省会城市即获取城市后的第一个
            me.cityIndex = capital.id;
            me.searchData['city'] = capital.name;
            G('input-city').innerHTML = capital.name;
            if (SureArea.isItMunicipality()) {
                me.resolveSaveUseResultAreaToArrayString(cityData.list, true);
                me.getSureAreaName()
            } else {
                // 继续获取区/县列表
                me.getChinaTerritoryMakeName(me.cityIndex, function (data) {
                    me.resolveSaveUseResultAreaToArrayString(data.list, true);
                    me.districtIndex = capital.id;
                    me.searchData['district'] = data.list[0].name;
                    G('input-city').innerHTML = capital.name;
                    me.getSureAreaName()
                })
            }
        });
    },
    /**
     * 获取中国领土板块对应名称
     */
    getChinaTerritoryMakeName: function (num, callback) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('System/queryChineseDistrict', {"proId": num}, function (data) {
            data = data instanceof Object ? data : JSON.parse(data);
            if (data.code == 200) {
                typeof callback === 'function' && callback(data);
            } else {
                LMEPG.UI.showToast('获取失败' + data.code);
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },
    /**
     * 点击输入框
     * @param btn
     */
    clickInput: function (btn) {
        var me = SureArea;
        var num = "0";
        var modalId = "";
        var focusId = "";
        var isMunicipality = me.municipality.indexOf(me.searchData['province']) > -1;
        if (btn.id === "input-city" && isMunicipality) return;

        switch (btn.id) {
            // 点击省
            case 'input-province':
                num = 0;
                modalId = 'modal-province';
                focusId = 'province';
                me.searchData['city'] = "";
                me.searchData['district'] = "";
                G('input-city').innerHTML = "市/区";
                G('input-district').innerHTML = "全部";
                break;
            // 点击市
            case 'input-city':
                num = me.provinceIndex;
                modalId = 'modal-city';
                focusId = 'city';
                me.searchData ['district'] = '';
                G('input-district').innerHTML = "全部";
                break;
            // 点击县/区
            case 'input-district':
                num = me.municipality.indexOf(me.searchData['province']) > -1 ? me.provinceIndex : me.cityIndex;
                modalId = 'modal-district';
                focusId = 'district';
                break;
        }


        me.inputId = btn.id;
        me.getChinaTerritoryMakeName(num, function (data) {
            me.resolveSaveUseResultAreaToArrayString(data.list);
            me.initRender(data, modalId, focusId);
        })
    },
    /**
     * 初始化渲染列表选项必要参数
     * @param data
     * @param modalId
     * @param focusId
     * @param callback
     */
    initRender: function (data, modalId, focusId, callback) {
        var me = SureArea;
        me.scrollSelectOption.data = SureArea.assembleData(data.list, "name");
        me.modalId = modalId;
        me.scrollSelectOption.num = 0;
        me.scrollSelectOption.listCount = 3;
        me.scrollSelectOption.render();
        LMEPG.BM.requestFocus(focusId + '-1');
        modalId && S(modalId);
        typeof callback === 'function' && callback();
    },

    unique_array_item: function (ary) {
        var temp = [];
        for (var i = 0; i < ary.length; i++) {
            var item = ary[i];
            if (temp.indexOf(item) === -1) temp.push(item);
        }
        return temp;
    },
    /**
     * 组装选项列表接口数据
     * @param data
     * @param param
     */
    assembleData: function (data, param) {
        console.log('dafda', data);
        // 组装搜索结果
        var resultList = data instanceof Array ? data : data.list;
        resultList = SureArea.unique_array_item(resultList);
        var len = resultList.length;
        var id = '';
        var name = '';
        var code = '';
        var resultData = [];
        while (len--) {
            id = resultList[len].id ? resultList[len].id : len;
            name = resultList[len][param] ? resultList[len][param] : resultList[len];
            code = resultList[len]['code'] ? resultList[len]['code'] : resultList[len];
            resultData.unshift({id: id, name: name, code: code});
        }
        return resultData;
    },
    /**
     * 获取对应确诊地区名称
     * @param callback
     */
    getSureAreaName: function (callback) {
        var me = SureArea;
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Epidemic/getEpidemicDistrictArea', me.searchData, function (data) {
            data = data instanceof Object ? data : JSON.parse(data);
            if (data.code === 200) {
                me.areaList.render(data);
                typeof callback === 'function' && callback();
            } else {
                LMEPG.UI.showToast('获取失败' + data.code);
            }
            LMEPG.UI.dismissWaitingDialog();
            console.log(data);
        });
    },
    /**
     * 国家直辖市行政请求方式组装
     */
    isItMunicipality: function () {
        var me = SureArea;
        var municipality = me.municipality;
        var province = me.searchData['province'];
        var city = me.searchData['city'];

        if (municipality.indexOf(province) > -1 && municipality.indexOf(city) === -1) {
            me.searchData['city'] = province;
            me.searchData['district'] = city;
            G('input-city').innerHTML = province;
            return true;
        }
    },
    /**
     * 解析请求确诊区域区/县名称为字符串数组
     * @param data
     * @param isFirstLoad
     */
    resolveSaveUseResultAreaToArrayString: function (data, isFirstLoad) {
        var me = SureArea;
        // 第一次加载和被点击输入框--县/区
        if (isFirstLoad || me.modalId === 'input-district') {
            me.retNameAry = [];
            me.retIdxAry = [];
            data.forEach(function (item, index, self) {
                me.retNameAry.push(item.name);
                me.retIdxAry.push(item.id);
            });
        }
    },
    areaList: {
        areaListData: [], // 列表的总数据
        areaListCount: 0, // 列表递增数
        areaListPageSize: 7, // 列表最单页个数
        move: function (key, btn) {
            var me = SureArea.areaList;

            // 本小区列表上一页
            if (key === 'up' && me.areaListCount !== 0) {
                me.prev();
                LMEPG.BM.requestFocus('list-controller');
                return false;
            }

            // 本小区列表下一页
            if (key === 'down' && me.areaListCount + me.areaListPageSize < me.areaListData.length) {
                me.next();
                LMEPG.BM.requestFocus('list-controller');
                return false;
            }

            if ((key === 'left' || key === "right") && btn.id === 'list-controller') {
                me.rebuild(key);
                return false;
            }
        },
        /**
         * 左右移动list-controller焦点切换确诊区域
         * @param key
         */
        rebuild: function (key) {
            var me = SureArea;
            var idx = me.retNameAry.indexOf(me.searchData['district']); // 遍历得到搜索的值在数组中的索引
            var searchValue = me.retNameAry[key === 'left' ? --idx : ++idx]; // 查询搜索的值

            me.rebuidIdx = idx; // 记录判断字段索引
            if (searchValue) { // 存在搜索的值
                me.searchData['district'] = searchValue;
                me.getSureAreaName(function () {
                    LMEPG.BM.requestFocus('list-controller');
                });

                // G(me.inputId).innerHTML = me.marquee(searchValue, 5);
            }
        },
        prev: function () {
            var me = SureArea.areaList;
            if (me.areaListCount <= 0) return;
            me.areaListCount -= me.areaListPageSize;
            me.render();
        },
        next: function () {
            var me = SureArea.areaList;
            if (me.areaListCount + me.areaListPageSize >= me.areaListData.length) return;
            me.areaListCount += me.areaListPageSize;
            me.render();
        },
        render: function (data, areaName) {
            data = data ? SureArea.assembleData(data) : SureArea.areaList.areaListData;
            var currData = data.slice(this.areaListCount, this.areaListCount + this.areaListPageSize);
            var len = currData.length;
            var htm = "<li id=list-controller>逗留地点</li>";
            var headTxt = SureArea.searchData['district'] || "确诊地区";
            var name = '';
            console.log(currData);
            for (var i = 0; i < len; i++) {
                name = RenderParam.areaCode === '223' ? currData[i]['code'] : currData[i]['name'];
                htm += '<li id=item-' + i + '>' + name + '</li>';
            }

            LMEPG.Log.info('贵州联通==>' + JSON.stringify(currData));
            LMEPG.Log.info('贵州联通==>' + JSON.stringify(htm));
            G('title-txt').innerHTML = SureArea.marquee(headTxt, 5);
            G('list-area-wrap').innerHTML = (data.length === 0 ? htm + '<span class="null-data">该区域暂无数据~</span>' : htm);
            this.areaListData = data;
            this.arrow(data, headTxt);
        },
        arrow: function (data, headTxt) {
            var idx = SureArea.retNameAry.indexOf(headTxt);
            var prev = idx;
            var next = idx;
            H('left-arrow');
            H('right-arrow');
            H('down-arrow');
            SureArea.retNameAry[--prev] && S('left-arrow');
            SureArea.retNameAry[++next] && S('right-arrow');
            this.areaListCount + this.areaListPageSize < data.length && S('down-arrow');
        }
    },
    /**
     * 列表选择项事件操作
     */
    scrollSelectOption: {
        num: 0,
        data: null,
        listCount: 0, // 渲染列表的个数
        selectedOption: '', // 选择的选项
        move: function (key, btn) {
            var me = SureArea.scrollSelectOption;
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
                LMEPG.UI.showToast('暂无查询信息！', 2, H(SureArea.modalId));
                return;
            }
            switch (SureArea.inputId) {
                // 渲染省列表
                case "input-province":
                    focusIdPrefix = 'province-';
                    listWrapId = 'modal-province';
                    break;
                // 渲染市列表
                case "input-city":
                    focusIdPrefix = 'city-';
                    listWrapId = 'modal-city';
                    break;
                // 渲染区列表
                case "input-district":
                    focusIdPrefix = 'district-';
                    listWrapId = 'modal-district';
                    break;
                default:
                    break;
            }

            for (var i = 0; i < listData.length; i++) {
                htm += '<li id="' + focusIdPrefix + (i + 1) + '" data-id="' + listData[i].id + '">' + listData[i]["name"];
            }

            G(listWrapId).innerHTML = htm;
            S(SureArea.modalId);
        },
        focus: function (btn, bol) {
            var optionEl = G(btn.id);
            var optionTxt = optionEl.innerText;
            if (optionTxt.length >= 8) {
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
            var me = SureArea;
            var optionElement = G(btn.id);
            var txt = optionElement.innerText;
            var focusIdPrefix = btn.id.slice(0, -2);
            var dataId = optionElement.getAttribute('data-id');
            var provinceName = G('input-province').innerText;

            // 隐藏模态框列表选项
            H(me.modalId);
            // 绑点列表选择项值到输入框
            G(me.inputId).innerHTML = me.marquee(txt, 5);
            // 送回输入框焦点
            LMEPG.BM.requestFocus(me.inputId);
            // 记录搜索项值
            me.searchData[focusIdPrefix] = txt;
            // 记录选择项索引
            me[focusIdPrefix + 'Index'] = dataId;
            me.modalId = "";
            if (me.inputId === 'input-province') {
                me.getProvincialCapital(dataId);
            } else if (me.inputId === "input-city") {
                // 点击直辖二级输入框
                if (me.isItMunicipality()) {
                    me.getSureAreaName();
                    return
                }
                // 继续获取区/县列表
                me.getChinaTerritoryMakeName(dataId, function (data) {
                    me.resolveSaveUseResultAreaToArrayString(data.list, true);
                    me.searchData['district'] = data.list[0].name;
                    G('input-city').innerHTML = me.searchData['city'];
                    me.getSureAreaName()
                })
            } else if (me.inputId === "input-district") {
                me.searchData['district'] = txt;
                me.getSureAreaName()
            }
        }
    },
    /**
     * 溢出滚动文字
     * @param txt
     * @param len
     */
    marquee: function (txt, len) {
        return txt.length > len ? '<marquee>' + txt + '</marquee>' : txt;
    },
    /**
     * 设置更新日期提醒
     */
    setCurrDate: function () {
        var date = new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        G('tip-wrap').innerHTML = ('来自卫健委等机构数据' + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + '更新');
    },
    /**
     * 创建虚拟按钮
     */
    createBtns: function () {
        this.buttons.push(
            {
                id: 'input-province',
                name: '省输入框',
                type: 'div',
                nextFocusLeft: '',
                nextFocusRight: 'input-city',
                nextFocusDown: 'list-controller',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_input.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_input_f.png',
                click: SureArea.clickInput

            }, {
                id: 'input-city',
                name: '市输入框',
                type: 'div',
                nextFocusLeft: 'input-province',
                nextFocusRight: 'input-district',
                nextFocusDown: 'list-controller',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_input.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_input_f.png',
                click: SureArea.clickInput
            }, {
                id: 'input-district',
                name: '区输入框',
                type: 'div',
                nextFocusLeft: 'input-city',
                nextFocusRight: '',
                nextFocusDown: 'list-controller',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_input.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_input_f.png',
                click: SureArea.clickInput
            }, {
                id: 'province-1',
                name: '省列表焦点',
                type: 'div',
                nextFocusUp: 'province-',
                nextFocusDown: 'province-2',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                beforeMoveChange: SureArea.scrollSelectOption.move,
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click
            }, {
                id: 'province-2',
                name: '省列表焦点',
                type: 'div',
                nextFocusUp: 'province-1',
                nextFocusDown: 'province-3',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                beforeMoveChange: SureArea.scrollSelectOption.move,
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click
            }, {
                id: 'province-3',
                name: '省列表焦点',
                type: 'div',
                nextFocusUp: 'province-2',
                nextFocusDown: 'province-',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                beforeMoveChange: SureArea.scrollSelectOption.move,
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click
            }, {
                id: 'city-1',
                name: '市列表焦点',
                type: 'div',
                nextFocusUp: 'city-',
                nextFocusDown: 'city-2',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                beforeMoveChange: SureArea.scrollSelectOption.move,
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click
            }, {
                id: 'city-2',
                name: '市列表焦点',
                type: 'div',
                nextFocusUp: 'city-1',
                nextFocusDown: 'city-3',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                beforeMoveChange: SureArea.scrollSelectOption.move,
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click
            }, {
                id: 'city-3',
                name: '市列表焦点',
                type: 'div',
                nextFocusUp: 'city-2',
                nextFocusDown: 'city-',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                beforeMoveChange: SureArea.scrollSelectOption.move,
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click
            }, {
                id: 'district-1',
                name: '区列表焦点',
                type: 'div',
                nextFocusUp: 'district-',
                nextFocusDown: 'district-2',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                beforeMoveChange: SureArea.scrollSelectOption.move,
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click
            }, {
                id: 'district-2',
                name: '区列表焦点',
                type: 'div',
                nextFocusUp: 'district-1',
                nextFocusDown: 'district-3',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click
            }, {
                id: 'district-3',
                name: '区列表焦点',
                type: 'div',
                nextFocusUp: 'district-2',
                nextFocusDown: 'district-',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/transparent.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/area_modal_option_f.png',
                focusChange: SureArea.scrollSelectOption.focus,
                click: SureArea.scrollSelectOption.click,
                beforeMoveChange: SureArea.scrollSelectOption.move
            }, {
                id: 'list-controller',
                name: '区列表焦点',
                type: 'div',
                nextFocusUp: 'input-city',
                nextFocusDown: '',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/list_item_bg.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/list_head_bg.png',
                beforeMoveChange: SureArea.areaList.move
            }
        )
    }
};

function onBack() {
    if (SureArea.modalId) {
        H(SureArea.modalId);
        SureArea.modalId = "";
        LMEPG.BM.requestFocus(SureArea.inputId);
    } else {
        LMEPG.Intent.back()
    }
}