// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | [健康检测-手动输入检测数据]页面控制js
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/2/12 下午1:41
// +----------------------------------------------------------------------
var LOG_TAG = 'InputData.js';
var debug = false;
var defaultFocusId = 'items_1';     // 当前页默认有焦点的按钮ID
var buttons = [];                   // 定义全局按钮

/**
 * 本地打印日志
 * @param tag
 * @param msg
 */
function log(tag, msg) {
    var logMsg = LMEPG.Func.string.format("[{0}][{1}]--->{2}", [LOG_TAG, tag, msg]);
    if (debug) console.log(logMsg);
    LMEPG.Log.info(logMsg);
}


/**
 * 页面跳转控制
 */
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('inputTest');
        var formDataJson = JSON.stringify(List.formData);
        currentPage.setParam('type', List.formData.measure_type);
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('inputFormData', formDataJson);
        return currentPage;
    },

    /**
     *  跳转->增加家庭成员
     * @param memberId
     */
    jumpMemberAdd: function (memberId) {
        var objCurrent = Page.getCurrentPage();
        objCurrent.setParam('actionType', '1'); // 1表示从新增家庭成员页面返回
        var objDst = LMEPG.Intent.createIntent('familyMembersEdit');
        objDst.setParam('actionType', '1'); // 1表示新增家庭成员
        objDst.setParam('memberID', memberId);
        LMEPG.Intent.jump(objDst, objCurrent);
    }
};

/**
 * 列表项
 */
var List = {
    allTestData:null,
    testTypeIndex:0,//
    testStatusIndex:0,//
    hasPoint:true,
    openIndex:0,

    expandingItemId: null, // 展开条目元素id
    typeList: [], // 检测状态数据列表
    memberList: [], // 第1列滚动数据：用户已添加的家庭成员列表

    statusList: { // 第2列滚动数据：检测状态时刻列表，命名为：type{类型}
        type1: Measure.StatusHelper.status_configs.type1, //血糖
        type2: Measure.StatusHelper.status_configs.type2, //胆固醇
        type3: Measure.StatusHelper.status_configs.type3, //甘油三脂
        type4: Measure.StatusHelper.status_configs.type4, //尿酸
        type5: Measure.StatusHelper.status_configs.type5, //血压
        type6: Measure.StatusHelper.status_configs.type6 //体脂
    },
    scrollType: { // 滚动成员类型
        dt: { //检测时期
            year: DT.Type.year,
            month: DT.Type.month,
            day: DT.Type.day,
            hours: DT.Type.hours,
            minutes: DT.Type.minutes,
            seconds: DT.Type.seconds
        },
        type: 101,   //检测类型
        value: 102,  //检测数值
        member: 103, //检测成员
        status: 104 //检测状态
    },
    scrollIndex: { //滚动列表当前显示位置
        type: 0,   //检测类型
        member: 1, //检测成员
        status: 0, //检测状态
        resetStatus: function () {//重置默认检测状态值
            this.status = 0;
        }
    },
    formData: { // 当前所有显示的状态值
        measure_dt: { //检测时间，例如：2019-01-23 09:22
            year: 1970,
            month: 0, //注意：月份范围为0~11
            day: 1,
            hours: 0,
            minutes: 0,
            seconds: 0,
            toString: function () {
                return DT.formatDT2(this.year, this.month, this.day, this.hours, this.minutes, this.seconds, 'yyyy-MM-dd hh:mm:ss');
            }
        },
        measure_type: Measure.Type.BLOOD_GLUCOSE,//检测类型
        measure_value: '0.00',//检测数值，例如：5.21
        measure_value2: '75',//检测数值，例如：5.21
        measure_value3: '65',//检测数值，例如：5.21
        measure_member_id: '',//检测家庭成员id
        measure_status: 1,//检测状态时刻值id，例如：上午、下午……

        resetValue: function () {//重置默认数值
            LMEPG.ButtonManager.init("items_2", buttons, '', true);
        }

    },
    currentOpenId: "",//记录当前弹出值的ID;

    getInputData:function(cb){
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('NewHealthDevice/getNeedWriteData', {}, function (data) {
            LMEPG.UI.dismissWaitingDialog()
            console.log(data)
            List.allTestData = data.data
            cb()
        })
    },


    initOnce: function () {
        // 初始化检测记录列表数据
        this.memberList = LMEPG.Func.isArray(RenderParam.addedMemberList) ? RenderParam.addedMemberList : [];
        this.typeList = Measure.getAllowedTypeData();
        this.initMembers();
        if (debug) console.log(this.typeList, this.memberList, this.statusList);
    },

    initMembers: function () {
        var addedMemberCount = this.memberList.length;
        if (addedMemberCount > 0) {
            // 情况1：有添加过家庭成员
            // >>>
            // 已添加成员数量=[1, 8)，则添加"添加成员"按钮
            if (addedMemberCount < 5) {
                this.memberList.push(Measure.ADD_MEMBER_ITEM);
            }
        } else {
            // 情况2：未曾添加过任何家庭成员
            // >>>
            this.memberList.push(Measure.ADD_MEMBER_ITEM);
        }
    },

    getStatusList: function (measureType) {
        var statusList = eval('List.statusList.type' + measureType);
        if (!LMEPG.Func.isArray(statusList)) {
            statusList = [];
            log("getStatusList()", "Not an array by eval(List.statusList.type{" + measureType + "})!");
        }
        return Measure.StatusHelper.getStatusListBy(measureType, statusList, List.formData.measure_dt.toString());
    },

    /**
     * 设置输入时间
     * @param year 年
     * @param month 月
     * @param day 日
     * @param hours 时
     * @param minutes 分
     * @param seconds 秒
     */
    setInputDT: function (year, month, day, hours, minutes, seconds) {
        this.formData.measure_dt.year = year;
        this.formData.measure_dt.month = month;
        this.formData.measure_dt.day = day;
        this.formData.measure_dt.hours = hours;
        this.formData.measure_dt.minutes = minutes;
        this.formData.measure_dt.seconds = seconds;
    },

    selectCurrentInputDT: function () {
        var dt = [1970, 1, 1, 0, 0, 0];
        for (var i = 1; i <= 6; i++) {
            var dom = G('time_btn_' + i);
            if (dom) {
                var value = parseInt(dom.innerHTML);
                dt[i - 1] = !isNaN(value) ? value : dt[i - 1];
            }
        }
        List.setInputDT(dt[0], dt[1] - 1, dt[2], dt[3], dt[4], dt[5]);
    },

    /**
     * 首次初始化输入列表
     *
     * @param overrideInitDefValueCallback 是否单独初始化表单默认值的函数，具有返回值boolean。如果返回true，表示已单独初始化默认数据。
     */
    renderListItemUIFirst: function (overrideInitDefValueCallback) {
        var isKeptLastInputData = LMEPG.call(overrideInitDefValueCallback);
        if (!isKeptLastInputData) {
            if (debug) console.error('>>>使用默认初始化。。。。');
            // 检测时间
            var dt = now();
            this.setInputDT(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds());

            if(RenderParam.type !== '1'){
                for(var i=0; i< this.allTestData.length; i++){
                    if(this.allTestData[i].healthDataItem === RenderParam.type){
                        this.testTypeIndex = i
                        break
                    }
                }
            }

            // 检测数值
            this.formData.resetValue();

            // 检测成员
            // 检测状态
            this.formData.measure_status = 1;
        }

        // 准备完成所有列表默认数据，其它参数再统一初始化
        this.findArrayIndex();

        this.renderListItemUI_measureDT();
        this.vTime()
        this.renderListItemUI_measureType();

        this.renderListItemUI_measureMember();

    },

    vTime:function(){
            var status = [
                {
                    start_dt: 0,
                    end_dt: 5,
                    status_ids: 0
                },
                {
                    start_dt: 6,
                    end_dt: 12,
                    status_ids: 1
                },
                {
                    start_dt: 13,
                    end_dt: 17,
                    status_ids: 3
                },
                {
                    start_dt: 18,
                    end_dt: 23,
                    status_ids: 5
                }
            ]

        for(var i=0; i<status.length; i++){
            if(List.formData.measure_dt.hours >=status[i].start_dt && List.formData.measure_dt.hours <= status[i].end_dt){
                List.testStatusIndex = status[i].status_ids
                break
            }
        }

    },
    renderListItemUI_measureDT: function () {
        Date.prototype.Format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1,         //月份
                "d+": this.getDate(),          //日
                "h+": this.getHours(),          //小时
                "m+": this.getMinutes(),         //分
                "s+": this.getSeconds(),         //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds()       //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        var newTime = new Date().format('yyyy-MM-dd HH:mm:ss');
        if (newTime.toString().indexOf('H') !== -1) {
            G('time').innerHTML = new Date().format('yyyy-MM-dd hh:mm:ss');
        } else {
            G('time').innerHTML = newTime;
        }
    },


    renderListItemUI_measureType: function () {
        this.testTypeDataChange()
        this.showOrHideListItemArrowsUI('items_2_container', List.allTestData.length > 1);
    },

    renderListItemUI_measureMember: function () {
        this.updateHScrollListItemsUI(List.scrollType.member, List.memberList, List.scrollIndex.member);
        this.showOrHideListItemArrowsUI('items_4_container', List.memberList.length > 1);
    },


    showOrHideListItemArrowsUI: function (itemsContainerId, show) {
        function _setItemArrowsVisible(rootContainerId, show) {
            var dom = G(rootContainerId);
            if (!LMEPG.Func.isExist(dom)) {
                return;
            }

            var sons = dom.getElementsByClassName('items_content');
            if (LMEPG.Func.isExist(sons) && sons.length > 0) {
                var arrowsLeft = sons[0].getElementsByClassName('icon_left');
                var arrowsRight = sons[0].getElementsByClassName('icon_right');
                if (LMEPG.Func.isExist(arrowsLeft) && arrowsLeft.length > 0) arrowsLeft[0].style.display = show ? 'block' : 'none';
                if (LMEPG.Func.isExist(arrowsRight) && arrowsRight.length > 0) arrowsRight[0].style.display = show ? 'block' : 'none';
            }
        }

        if (show) {
            _setItemArrowsVisible(itemsContainerId, true);
        } else {
            _setItemArrowsVisible(itemsContainerId, false);
        }
    },

    // 更新当前滚动日期选中值
    renderScrollListDTUI: function () {
        var currentValues = [
            {type: List.scrollType.dt.year, value: List.formData.measure_dt.year},
            {type: List.scrollType.dt.month, value: List.formData.measure_dt.month + 1},//显示出来，月份要加1
            {type: List.scrollType.dt.day, value: List.formData.measure_dt.day},
            {type: List.scrollType.dt.hours, value: List.formData.measure_dt.hours},
            {type: List.scrollType.dt.minutes, value: List.formData.measure_dt.minutes},
            {type: List.scrollType.dt.seconds, value: List.formData.measure_dt.seconds}
        ];
        for (var i = 1; i <= 6; i++) {
            var currentScrollBtnId = 'time_btn_' + i;
            var currentValue = currentValues[i - 1];
            var range = DT.getRangeBy(currentValue.type, currentValue.value);//第2个参数仅仅为month时才有效！
            List.updateVScrollListItemsUI(currentValue.type, currentScrollBtnId, currentValue.value, range.min, range.max);
        }

        G('icon_right_1').src = g_appRootPath + '/Public/img/hd/HealthTest/icon_down_1.png';
        LMEPG.BM.requestFocus('time_btn_1');
    },

    // 更新当前滚动输入检测类型值
    renderScrollListValueUI: function (hasPoint,value) {
       if(hasPoint) {
           // "十位个位:小数个位小数十位"
           var array = (value + '').split('.');
           var part1 = 0, part2 = 0;//正数部分、小数部分
           var dig_1 = 0, dig_2 = 0;//个位、十位
           var dot_1 = 0, dot_2 = 0;//小数个位、小数十位

           if (array.length >= 2) {
               part1 = isNaN(parseInt(array[0])) ? 0 : parseInt(array[0]);
               part2 = isNaN(parseInt(array[1])) ? 0 : parseInt(array[1]);
           } else if (array.length === 1) {
               part1 = isNaN(parseInt(array[0])) ? 0 : parseInt(array[0]);
               part2 = 0;
           }

           dig_2 = parseInt((part1 % 100) / 10);//十位
           dig_1 = parseInt(part1 % 10);//个位
           dot_1 = parseInt((part2 % 100) / 10);//小数个位
           dot_2 = parseInt(part2 % 10);//小数十位

           var dig_2_range = Measure.InputData.getRangeBy(Measure.InputData.dig_2);//十位范围
           var dig_1_range = Measure.InputData.getRangeBy(Measure.InputData.dig_1);//个位范围
           var dot_1_range = Measure.InputData.getRangeBy(Measure.InputData.dot_1);//小数个位范围
           var dot_2_range = Measure.InputData.getRangeBy(Measure.InputData.dot_2);//小数十位范围

           List.updateVScrollListItemsUI(List.scrollType.value, 'num_btn_2', dig_2, dig_2_range.min, dig_2_range.max);//十位
           List.updateVScrollListItemsUI(List.scrollType.value, 'num_btn_3', dig_1, dig_1_range.min, dig_1_range.max);//个位
           List.updateVScrollListItemsUI(List.scrollType.value, 'num_btn_4', dot_1, dot_1_range.min, dot_1_range.max);//小数个位
           List.updateVScrollListItemsUI(List.scrollType.value, 'num_btn_5', dot_2, dot_2_range.min, dot_2_range.max);//小数十位

       }else {
           var x = 0, y = 0, z = 0;//百倍、个位、十位

           // "百倍十位个位"

           var array = (value + '').split('.');


           var part1 = 0;//正数部分、小数部分
           // var dig_3 = 0, dig_2 = 0, dig_1 = 0;//百倍、个位、十位

           if (array.length >= 0) {
               part1 = isNaN(parseInt(array[0])) ? 0 : parseInt(array[0]);
           } else if (array.length === 1) {
               part1 = isNaN(parseInt(array[0])) ? 0 : parseInt(array[0]);
           }

           x = parseInt(part1 / 100);//百位
           y = parseInt((part1 % 100) / 10);//十位
           z = parseInt(part1 % 10);//个位

           var dig_range = Measure.InputData.getRangeBy();//范围

           List.updateVScrollListItemsUI(List.scrollType.value, 'integer_btn_2', x, dig_range.min, dig_range.max);//百位
           List.updateVScrollListItemsUI(List.scrollType.value, 'integer_btn_3', y, dig_range.min, dig_range.max);//十位
           List.updateVScrollListItemsUI(List.scrollType.value, 'integer_btn_4', z, dig_range.min, dig_range.max);//个位
       }
    },

    /**
     * 当变更月份时，重置显示天数
     */
    resetDayUI: function () {
        G('time_btn_3_pre').innerHTML = '01';
        G('time_btn_3').innerHTML = '02';
        G('time_btn_3_next').innerHTML = '03';
    },

    /**
     * 当变更检测类型时，重置检测数值
     */
    resetListItemValueUI: function () {
        List.formData.resetValue();
    },

    /**
     * 根据检测类型得到我们定义的类型对象
     */
    findArrayIndex: function () {
        //检测类型
        var typeListTemp = List.typeList;
        for (var i = 0, len = typeListTemp.length; i < len; i++) {
            if (typeListTemp[i].type == List.formData.measure_type) {
                List.scrollIndex.type = i;
                break;
            } else {
                List.scrollIndex.type = 0; // 默认从第1个显示开始
            }
        }

        //检测成员
        //家庭成员默认选中值：从添加页面返回后保持到最新的一个，即倒数第2个（包含手动插入的"添加成员"按钮）
        var memberListTemp = List.memberList;
        if (memberListTemp.length >= 2) List.scrollIndex.member = memberListTemp.length - 2;
        else if (memberListTemp.length >= 1) List.scrollIndex.member = 0;

        //就餐时刻
        var statusListTemp = List.getStatusList(List.formData.measure_type);
        for (var i = 0; i < statusListTemp.length; i++) {
            if (statusListTemp[i].id == List.formData.measure_status) {
                List.scrollIndex.status = i;
                break;
            } else {
                List.scrollIndex.status = 0; // 默认从第1个显示开始
            }
        }
    },

    /**
     * 数据列表焦点移动
     * @param direction 方向键值
     * @param current
     */
    onBeforeMoveChange_List: function (direction, current) {
        switch (direction) {
            case 'up':
                List.focusUpFun(current);
                break;
            case 'down':
                List.focusDownFun(current)
                break;
            case 'left':
                List.focusLeftFun(current)
                break;
            case 'right':
                List.focusRightFun(current)
                break;
        }
    },

    /**
     * 焦点向上移动
     * @param current
     */
    focusUpFun: function (current) {
        if (current.id.startWith('time_btn_')) {//滚动日期时间
            var dtRange = DT.getRangeBy(current.scrollType, G('time_btn_2').innerHTML);
            List.scrollUp(current.scrollType, current.id, dtRange.min, dtRange.max);
            if (current.id === 'time_btn_2') {
                List.resetDayUI();
            }
        } else if (current.id.startWith('num_btn_')) {//滚动数值
            // List.scrollUp(current.id);
        }
    },

    /**
     * 焦点向下移动
     * @param current
     */
    focusDownFun: function (current) {
        if (current.id.startWith('time_btn_')) {//滚动日期时间
            var dtRange = DT.getRangeBy(current.scrollType, G('time_btn_2').innerHTML);
            List.scrollDown(current.scrollType, current.id, dtRange.min, dtRange.max);
            if (current.id === 'time_btn_2')  List.resetDayUI();
        } else if (current.id.startWith('num_btn_')) {//滚动数值

        }
    },

    //  焦点向左移动
    focusLeftFun: function (current) {
        console.log(333)
        switch (current.id) {
            case 'items_2': //检测类型
                List.testTypeDataChange('left')
                List.resetListItemValueUI();
                break;
            case 'items_4': //检测成员
                List.scrollLeft(List.scrollType.member, List.memberList);
                break;
            case 'items_5': //检测状态
                List.updateTestStatus(List.testTypeIndex,'left')
                break;
        }
    },

    /**
     * 焦点向由移动
     * @param current
     */
    focusRightFun: function (current) {
        switch (current.id) {
            case 'items_2': //检测类型
                List.testTypeDataChange('right')
                List.resetListItemValueUI();

                break;
            case 'items_4': //检测成员
                List.scrollRight(List.scrollType.member, List.memberList);
                break;
            case 'items_5': //检测状态
                List.updateTestStatus(List.testTypeIndex,'right')
                break;
        }
    },

    /**
     * 点击数据列表项
     * @param btn
     */
    onClick_List: function (btn) {
        switch (btn.id) {
            case 'items_1'://检测时间
                List.expandItem(btn);
                break;
            case 'items_4'://检测成员
                if (List.formData.measure_member_id == '0') { //添加家庭成员
                    Page.jumpMemberAdd(List.formData.measure_member_id);
                }
                break;
            default:
                List.expandItem(btn);
        }
    },

    /**
     * 点击展开滚动列表项
     * @param btn
     */
    onClick_ScrollList: function (btn) {
        if (btn.id.startWith('time_btn_')) {
            List.collapseItem('items_1', true);
        } else {
            if (btn.id.startWith('num_btn_') || btn.id.startWith('integer_btn_')) {
                List.collapseItem(List.currentOpenId, true);
            }
        }
    },

    hasExpandingItems: function () {
        return !LMEPG.Func.isEmpty(List.expandingItemId);
    },

    /**
     * 展开指定条目
     * @param itemBtnId
     */
    expandItem: function (itemBtn) {
        List.openIndex =parseInt(G(itemBtn.id).getAttribute('data-index'))
        console.log( List.openIndex,999)
        switch (itemBtn.id) {
            case 'items_1'://检测时间
                List.expandingItemId = itemBtn.id;
                List.renderScrollListDTUI();
                LMEPG.CssManager.addClass(itemBtn.id + '_expand', 'items_expand_hover');
                break;
            default:
                LMEPG.CssManager.addClass(itemBtn.id+'-expand' , 'items_expand_hover');
                List.expandingItemId = itemBtn.id
                List.hasPoint = itemBtn.hasPoint
                for(var i = List.openIndex-1;i>=0;i--){
                    G('extend-item-'+i).style.display = 'none'
                }
                if(itemBtn.hasPoint){
                    List.formData.measure_type = Measure.Type.BLOOD_GLUCOSE
                    List.createHtml1(itemBtn.id);
                    List.renderScrollListValueUI(true,itemBtn.defaultValue);
                }else {
                    List.formData.measure_type = Measure.Type.BLOOD_PRESSURE
                    List.createHtml2(itemBtn.id);
                    List.renderScrollListValueUI(false,itemBtn.defaultValue);
                }
                break

        }
        List.currentOpenId = itemBtn.id;
    },

    /**
     * 折叠当前正在展开条目. isSelectedInput: 如果确定选择当前滚动列表值，则才会更新和保存相关数据
     * @param itemBtnId
     * @param isSelectedInput
     */
    collapseItem: function (itemBtnId, isSelectedInput) {
        var select = (typeof isSelectedInput === 'boolean' && isSelectedInput === true);

            switch (itemBtnId) {
                case 'items_1'://检测时间
                    if (select) {//保存与更新UI
                        List.selectCurrentInputDT();
                        G('time').innerHTML = this.formData.measure_dt.toString();
                    }
                    LMEPG.CssManager.removeClass('items_1_expand', 'items_expand_hover');
                    G('icon_right_1').src = g_appRootPath + '/Public/img/hd/HealthTest/icon_right_1.png';
                    LMEPG.BM.requestFocus('items_1');
                    break;

                default:
                    for(var i = List.openIndex-1; i>=0; i--){
                        G('extend-item-'+i).style.display = 'block'
                    }

                    if (List.hasPoint) {//保存与更新UI
                        var dig_2 = parseInt(G('num_btn_2').innerHTML);//十位
                        var dig_1 = parseInt(G('num_btn_3').innerHTML);//个位
                        var dot_1 = parseInt(G('num_btn_4').innerHTML);//小数个位
                        var dot_2 = parseInt(G('num_btn_5').innerHTML);//小数十位
                        if (isNaN(dig_2) || dig_2 === 0) dig_2 = '';
                        if (isNaN(dig_1) || dig_1 === 0) dig_1 = '0';
                        if (isNaN(dot_1) || dot_1 === 0) dot_1 = '0';
                        if (isNaN(dot_2) || dot_2 === 0) dot_2 = '0';

                        G(itemBtnId+'-detection_num').innerHTML = dig_2 + '' + dig_1 + '.' + dot_1 + '' + dot_2
                    }else {
                        var dig_3 = parseInt(G('integer_btn_2').innerHTML);//百位
                        var dig_2 = parseInt(G('integer_btn_3').innerHTML);//十位
                        var dig_1 = parseInt(G('integer_btn_4').innerHTML);//个位
                        if (isNaN(dig_3) || dig_3 === 0) dig_3 = '';
                        if (isNaN(dig_2) || isNaN(dig_3) || dig_3 === 0) dig_2 = '';
                        if (isNaN(dig_1) || dig_1 === 0) dig_1 = '0';

                        G(itemBtnId+'-detection_num').innerHTML = dig_3 + '' + dig_2 + '' + dig_1
                    }

                    G(itemBtnId+'-time_block').innerHTML = ''
                    LMEPG.CssManager.removeClass(itemBtnId+'-expand', 'items_expand_hover');
                    G(itemBtnId+'-icon_right').src = g_appRootPath + '/Public/img/hd/HealthTest/icon_right_1.png';
                    LMEPG.BM.requestFocus(itemBtnId);

                    break
            }

        List.expandingItemId = null;
    },

    /**
     * 点击展开滚动列焦点效果
     * @param btn
     * @param hasFocus
     */
    onFocusChange_ScrollList: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, 'border_select');
        } else {
            LMEPG.CssManager.removeClass(btn.id, 'border_select');
        }
    },

    // 点击展开滚动列表焦点移动
    onBeforeMoveChange_ScrollList: function (direction, current) {
        switch (direction) {
            case 'up':
                if (current.id.startWith('time_btn_')) {//滚动日期时间
                    var dtRange = DT.getRangeBy(current.scrollType, G('time_btn_2').innerHTML);
                    List.scrollUp(current.scrollType, current.id, dtRange.min, dtRange.max);
                    if (current.id === 'time_btn_2') {
                        List.resetDayUI();
                    }
                } else if (current.id.startWith('num_btn_')
                    || current.id.startWith('integer_btn_')) {//滚动数值
                    var valueRange = Measure.InputData.getRangeBy(current.scrollType);
                    List.scrollUp(List.scrollType.value, current.id, valueRange.min, valueRange.max);
                }
                break;

            case 'down':
                if (current.id.startWith('time_btn_')) {//滚动日期时间
                    var dtRange = DT.getRangeBy(current.scrollType, G('time_btn_2').innerHTML);
                    List.scrollDown(current.scrollType, current.id, dtRange.min, dtRange.max);
                    if (current.id === 'time_btn_2') {
                        List.resetDayUI();
                    }
                } else if (current.id.startWith('num_btn_')
                    || current.id.startWith('integer_btn_')) {//滚动数值
                    var valueRange = Measure.InputData.getRangeBy(current.scrollType);
                    List.scrollDown(List.scrollType.value, current.id, valueRange.min, valueRange.max);
                }
                break;
        }
    },

    /**
     * 按上键滚动列表
     *
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param currentBtnId 当前中央滚动项按钮id
     * @param minValue 滚动列表最小数值
     * @param maxValue 滚动列表最大数值
     */
    scrollUp: function (scrollType, currentBtnId, minValue, maxValue) {
        var currentValue = parseInt(G(currentBtnId).innerHTML);
        if (isNaN(currentValue)) {
            log("scrollUp()", "ERROR: scrollUp ---> NAN! (btnId={" + currentBtnId + "})");
            return;
        }

        var desValue = currentValue - 1 < minValue ? maxValue : currentValue - 1;
        List.updateVScrollListItemsUI(scrollType, currentBtnId, desValue, minValue, maxValue);
    },

    /**
     * 按下键滚动列表
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param currentBtnId 当前中央滚动项按钮id
     * @param minValue 滚动列表最小数值
     * @param maxValue 滚动列表最大数值
     */
    scrollDown: function (scrollType, currentBtnId, minValue, maxValue) {
        var currentValue = parseInt(G(currentBtnId).innerHTML);
        if (isNaN(currentValue)) {
            log("scrollDown()", "ERROR: scrollUp ---> NAN! (btnId={" + currentBtnId + "})");
            return;
        }
        var desValue = currentValue + 1 > maxValue ? minValue : currentValue + 1;
        List.updateVScrollListItemsUI(scrollType, currentBtnId, desValue, minValue, maxValue);
    },

    /**
     * 更新展开项的不同滚动列表项数据
     *
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param currentBtnId 当前中央滚动项按钮id
     * @param currentValue 当前选中数值
     * @param minValue 滚动列表最小数值
     * @param maxValue 滚动列表最大数值
     */
    updateVScrollListItemsUI: function (scrollType, currentBtnId, currentValue, minValue, maxValue) {
        log("updateVScrollListItemsUI()", LMEPG.Func.string.format("args_(btnId={0}, current={1}, min={2}, max={3})", [currentBtnId, currentValue, minValue, maxValue]));

        var prev = currentValue - 1 < minValue && minValue >= 0 ? maxValue : currentValue - 1;
        var curr = currentValue;
        var next = currentValue + 1 > maxValue ? minValue : currentValue + 1;

        switch (scrollType) {
            case List.scrollType.dt.year:
            case List.scrollType.dt.month:
            case List.scrollType.dt.day:
            case List.scrollType.dt.hours:
            case List.scrollType.dt.minutes:
            case List.scrollType.dt.seconds:
                // 补足日期时间格式："yyyy-MM-dd hh:mm:ss"
                if (prev < 10) prev = '0' + prev;
                if (curr < 10) curr = '0' + curr;
                if (next < 10) next = '0' + next;
                break;
        }

        G(currentBtnId + '_pre').innerHTML = prev + '';
        G(currentBtnId).innerHTML = curr + '';
        G(currentBtnId + '_next').innerHTML = next + '';
    },

    /**
     * 按左键滚动列表
     *
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param dataList 滚动数据列表
     */
    scrollLeft: function (scrollType, dataList) {
        switch (scrollType) {
            case List.scrollType.type:
                var desIndex = List.scrollIndex.type - 1 < 0 ? dataList.length - 1 : List.scrollIndex.type - 1;
                List.updateHScrollListItemsUI(List.scrollType.type, dataList, desIndex);
                break;
            case List.scrollType.member:
                var desIndex = List.scrollIndex.member - 1 < 0 ? dataList.length - 1 : List.scrollIndex.member - 1;
                List.updateHScrollListItemsUI(List.scrollType.member, dataList, desIndex);
                break;
            case List.scrollType.status:
                var desIndex = List.scrollIndex.status - 1 < 0 ? dataList.length - 1 : List.scrollIndex.status - 1;
                List.updateHScrollListItemsUI(List.scrollType.status, dataList, desIndex);
                break;
            default:
                break;
        }
    },

    /**
     * 按右键滚动列表
     *
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param dataList 滚动数据列表
     */
    scrollRight: function (scrollType, dataList) {
        switch (scrollType) {
            case List.scrollType.type:
                var ascIndex = List.scrollIndex.type + 1 > dataList.length - 1 ? 0 : List.scrollIndex.type + 1;
                List.updateHScrollListItemsUI(List.scrollType.type, dataList, ascIndex);
                break;
            case List.scrollType.member:
                var ascIndex = List.scrollIndex.member + 1 > dataList.length - 1 ? 0 : List.scrollIndex.member + 1;
                List.updateHScrollListItemsUI(List.scrollType.member, dataList, ascIndex);
                break;
            case List.scrollType.status:
                var ascIndex = List.scrollIndex.status + 1 > dataList.length - 1 ? 0 : List.scrollIndex.status + 1;
                List.updateHScrollListItemsUI(List.scrollType.status, dataList, ascIndex);
                break;
            default:
                break;
        }
    },

    testTypeDataChange:function(dir){
        if(dir === 'left'){
            List.testTypeIndex--
            if(List.testTypeIndex < 0 )
                List.testTypeIndex = List.allTestData.length-1
        }else if(dir === 'right'){
            List.testTypeIndex++
            if(List.testTypeIndex>=List.allTestData.length)
                List.testTypeIndex = 0
        }

        G('detectionType').innerHTML = List.allTestData[List.testTypeIndex].healthDataItem
        List.updateTestItem(List.testTypeIndex)
        List.updateTestStatus(List.testTypeIndex)
    },

    updateTestStatus:function(index,dir){

        var len = List.allTestData[index].subDatas[0].statusValues.length

        if(len === 0){
            G('items_5_container').style.display ='none'
            return;
        }

        G('items_5_container').style.display = 'block';
        if(dir === 'left'){
            List.testStatusIndex--
            if( List.testStatusIndex < 0 )
                List.testStatusIndex = len - 1

        }else if(dir === 'right'){
            List.testStatusIndex++
            if( List.testStatusIndex>=len)
                List.testStatusIndex = 0
        }

        G('detectionStatus').innerHTML = List.allTestData[index].subDatas[0].statusValues[List.testStatusIndex].statusName
    },

    updateTestItem:function(i){
        var html=''
        var buttons = []

        List.allTestData[i].subDatas.forEach(function (item,index) {
            console.log(item)
            html+='<div id="extend-item-'+index+'" class="items">' +
                '        <img id="ex-items-'+index+'" class="items_bg" src="'+g_appRootPath+'/Public/img/hd/HealthTest/bg_btn.png" alt="" data-index="'+index+'"/>' +
                '        <div class="items_title" id="items_title">'+item.healthDataItem+'</div>' +
                '        <div class="items_content">' +
                '            <span id="ex-items-'+index+'-detection_num">'+item.defaultValue+'</span><span>&nbsp'+item.dataUnit+'</span>' +
                '            <img id="ex-items-'+index+'-icon_right" class="icon_right" src="'+g_appRootPath+'/Public/img/hd/HealthTest/icon_right_1.png" alt=""/>\n' +
                '        </div>'+
                '        <div id="ex-items-'+index+'-expand" class="items_expand" style="background-image: url('+g_appRootPath+'/Public/img/hd/HealthTest/bg_box.png)">' +
                '            <div id="ex-items-'+index+'-time_block" class="time_block"></div>' +
                '        </div>'+
                '    </div>'

            buttons.push({
                id: 'ex-items-'+index,
                name: '',
                type: 'img',
                nextFocusUp: index === 0?'items_2':'ex-items-'+(index-1),
                nextFocusDown:(index ===  (List.allTestData[i].subDatas.length - 1))? 'items_4':'ex-items-'+(index+1),
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/f_btn_v.png',
                click: List.onClick_List,
                hasPoint:item.defaultValue?item.defaultValue.indexOf('.') !== -1 : false,
                defaultValue:item.defaultValue
            })
        })

        LMEPG.BM.addButtons(buttons)
        LMEPG.BM.getButtonById('items_4').nextFocusUp ='ex-items-'+ (List.allTestData[i].subDatas.length - 1)
        G('extend-item').innerHTML = html
    },
    /**
     * 更新展开项的不同滚动列表项数据
     *
     * @param scrollType 滚动列表类型 详情 {@link List#scrollType}
     * @param dataList 滚动数据列表
     * @param currentSelectIndex 当前中央选中的列表数据索引序号
     */
    updateHScrollListItemsUI: function (scrollType, dataList, currentSelectIndex) {
        if (debug) console.error(LMEPG.Func.string.format('updateHScrollListItemsUI({0}, index={1})>>list_size: {2}', [
            scrollType === List.scrollType.member ? '检测成员' : scrollType === List.scrollType.status ? '检测状态' : '操作按钮',
            currentSelectIndex,
            dataList.length
        ]));
        var prevIndex = 0, prevData = null;
        var currIndex = 0, currData = null;
        var nextIndex = 0, nextData = null;
        var placeholder1 = '&nbsp;&nbsp;';

        function _debug_value(value) {
            var localDebug = false; //TODO 用于调试状态值，上线置为false
            return localDebug ? '<span style="color: #ff0000;">[' + value + ']</span>' : '';
        }

        switch (scrollType) {
            case List.scrollType.type:
                if (dataList.length === 1) {
                    prevIndex = -1;
                    currIndex = 0;
                    nextIndex = -1;
                } else if (dataList.length === 2) {
                    prevIndex = -1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                } else {
                    prevIndex = currentSelectIndex - 1 < 0 ? dataList.length - 1 : currentSelectIndex - 1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                }

                currData = dataList[currIndex];

                // 记录当前滚动中央显示的位置
                List.scrollIndex.type = currIndex;
                List.formData.measure_type = currData ? currData.type : '';
                G('detectionType').innerHTML = currData ? currData.text + _debug_value(currData.type) : placeholder1;
                break;

            case List.scrollType.member:
                if (dataList.length === 1) {
                    prevIndex = -1;
                    currIndex = 0;
                    nextIndex = -1;
                } else if (dataList.length === 2) {
                    prevIndex = -1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                } else {
                    prevIndex = currentSelectIndex - 1 < 0 ? dataList.length - 1 : currentSelectIndex - 1;
                    currIndex = currentSelectIndex;
                    nextIndex = currIndex + 1 > dataList.length - 1 ? 0 : currIndex + 1;
                }

                currData = dataList[currIndex];

                // 记录当前滚动中央显示的位置
                List.scrollIndex.member = currIndex;
                List.formData.measure_member_id = currData ? currData.member_id : '';

                G('detectionMember').innerHTML = currData ? currData.member_name + _debug_value(currData.member_id) : placeholder1;
                break;

            default:
                break;
        }

    },

    // 创建可选择 "正数2位.小数2位" 的UI。5列等分，：主要用于血糖和胆固醇，例如：16:66
    createHtml1: function (id) {
        var str = '';
        str += '<div class="decimal_point"></div>';
        str += '<div id="num_btn_2_pre" class="time_code2">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_3_pre" class="time_code2">&nbsp;&nbsp;</div>';
        str += '<div class="time_code2">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_4_pre" class="time_code2">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_5_pre" class="time_code2">&nbsp;&nbsp;</div>';

        str += '<div id="num_btn_2" class="time_code_big2 border_select">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_3" class="time_code_big2">&nbsp;&nbsp;</div>';
        str += '<div  class="time_code_big2">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_4" class="time_code_big2">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_5" class="time_code_big2">&nbsp;&nbsp;</div>';

        str += '<div id="num_btn_2_next" class="time_code2">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_3_next" class="time_code2">&nbsp;&nbsp;</div>';
        str += '<div class="time_code2">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_4_next" class="time_code2">&nbsp;&nbsp;</div>';
        str += '<div id="num_btn_5_next" class="time_code2">&nbsp;&nbsp;</div>';

        G(id+'-time_block').innerHTML = str;
        G(id+'-icon_right').src = g_appRootPath + '/Public/img/hd/HealthTest/icon_down_1.png';
        LMEPG.BM.requestFocus('num_btn_2');
    },

    // 创建可选择 "正数3位" 的UI。3列等分，主要用于尿酸，例如：355
    createHtml2: function (id) {
        var str = '';
        str += '<div  class="time_code3">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_2_pre"  class="time_code3">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_3_pre" class="time_code3">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_4_pre" class="time_code3">&nbsp;&nbsp;</div>';
        str += '<div class="time_code3">&nbsp;&nbsp;</div>';

        str += '<div  class="time_code_big3">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_2"  class="time_code_big3 border_select">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_3" class="time_code_big3">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_4" class="time_code_big3">&nbsp;&nbsp;</div>';
        str += '<div class="time_code_big3">&nbsp;&nbsp;</div>';

        str += '<div  class="time_code3">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_2_next"  class="time_code3">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_3_next" class="time_code3">&nbsp;&nbsp;</div>';
        str += '<div id="integer_btn_4_next" class="time_code3">&nbsp;&nbsp;</div>';
        str += '<div class="time_code3">&nbsp;&nbsp;</div>';

        G(id+'-time_block').innerHTML = str;
        G(id+'-icon_right').src = g_appRootPath + '/Public/img/hd/HealthTest/icon_down_1.png';
        LMEPG.BM.requestFocus('integer_btn_2');
    }

};

/**
 * 健康检测输入数据页面-控制入口类
 */
var InputData = {
    isBlood: false,
    buildButtons: function () {
        buttons.push({
            id: 'items_1',
            name: '选项1',
            type: 'img',
            nextFocusDown: 'items_2',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/f_btn_v.png',
            click: List.onClick_List
        });

        buttons.push({
            id: 'items_2',
            name: '选项2',
            type: 'img',
            nextFocusUp: 'items_1',
            nextFocusDown: 'ex-items-0',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/f_btn_v.png',
            beforeMoveChange: List.onBeforeMoveChange_List
        });

        buttons.push({
            id: 'items_4',
            name: '选项4',
            type: 'img',
            nextFocusUp: '',
            nextFocusDown: 'items_5',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/f_btn_v.png',
            click: List.onClick_List,
            beforeMoveChange:function (dir,btn) {
                List.onBeforeMoveChange_List(dir,btn)
                if(dir === 'down' && G('items_5_container').style.display === 'none'){
                    LMEPG.BM.requestFocus('inquiry_btn')
                    return false
                }
            }
        });

        buttons.push({
            id: 'items_5',
            name: '选项4',
            type: 'img',
            nextFocusUp: 'items_4',
            nextFocusDown: 'inquiry_btn',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_btn.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/f_btn_v.png',
            beforeMoveChange: List.onBeforeMoveChange_List
        });

        buttons.push({
            id: 'inquiry_btn',
            name: '选项4',
            type: 'img',
            nextFocusUp: 'items_5',
            backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/bg_button.png',
            focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V13/tab_f.png',
            click: InputData.newSubmit,
            beforeMoveChange: function (dir) {
                if(dir === 'up' && G('items_5_container').style.display === 'none'){
                    LMEPG.BM.requestFocus('items_4')
                    return false
                }
            }
        });

        var dtTypes = [
            List.scrollType.dt.year,
            List.scrollType.dt.month,
            List.scrollType.dt.day,
            List.scrollType.dt.hours,
            List.scrollType.dt.minutes,
            List.scrollType.dt.seconds
        ];
        for (var i = 0; i < 6; i++) {
            buttons.push({
                id: 'time_btn_' + (i + 1),
                name: '选项4',
                type: 'img',
                nextFocusLeft: 'time_btn_' + (i + 1 - 1),
                nextFocusRight: 'time_btn_' + (i + 1 + 1),
                click: List.onClick_ScrollList,
                focusChange: List.onFocusChange_ScrollList,
                beforeMoveChange: List.onBeforeMoveChange_ScrollList,
                scrollType: dtTypes[i] //滚动日期时间类型
            });
        }

        var valueTypes1 = [
            Measure.InputData.dig_2,
            Measure.InputData.dig_1,
            Measure.InputData.dot_1,
            Measure.InputData.dot_2
        ];
        for (var i = 0; i < 4; i++) {
            buttons.push({
                id: 'num_btn_' + (i + 2),
                name: '选项4',
                type: 'img',
                nextFocusLeft: 'num_btn_' + (i + 2 - 1),
                nextFocusRight: 'num_btn_' + (i + 2 + 1),
                click: List.onClick_ScrollList,
                focusChange: List.onFocusChange_ScrollList,
                beforeMoveChange: List.onBeforeMoveChange_ScrollList,
                scrollType: valueTypes1[i] //滚动数值类型
            });
        }

        var valueTypes2 = [
            Measure.InputData.dig_1,
            Measure.InputData.dig_1,
            Measure.InputData.dig_1
        ];
        for (var i = 0; i < 3; i++) {
            buttons.push({
                id: 'integer_btn_' + (i + 2),
                name: '选项4',
                type: 'img',
                nextFocusLeft: 'integer_btn_' + (i + 2 - 1),
                nextFocusRight: 'integer_btn_' + (i + 2 + 1),
                nextFocusUp: '',
                nextFocusDown: '',
                click: List.onClick_ScrollList,
                focusChange: List.onFocusChange_ScrollList,
                beforeMoveChange: List.onBeforeMoveChange_ScrollList,
                scrollType: valueTypes2[i] //滚动数值类型
            });
        }
    },

    // 校验表单数据
    checkFormData: function () {
        if (LMEPG.Func.isEmpty(List.formData.measure_dt.toString())) {
            LMEPG.UI.showToast('请选择检测时间！');
            return false;
        }
        if (LMEPG.Func.isEmpty(List.formData.measure_type)) {
            LMEPG.UI.showToast('请选择检测类型！');
            return false;
        }
        if (LMEPG.Func.isEmpty(List.formData.measure_member_id) || List.formData.measure_member_id == '0') {
            LMEPG.UI.showToast('请先添加一个家庭成员！');
            return false;
        }
        if (LMEPG.Func.isEmpty(List.formData.measure_status)) {
            if (Measure.getTypeAsInt(List.formData.measure_type) == Measure.Type.BLOOD_PRESSURE) {

            } else {
                LMEPG.UI.showToast('请选择检测状态！');
                return false;
            }
        }
        return true;
    },

    newSubmit:function(){
        console.log(List.allTestData[List.testTypeIndex].subDatas[0].statusValues.length)

        if (LMEPG.Func.isEmpty(List.formData.measure_member_id) || List.formData.measure_member_id == '0') {
            LMEPG.UI.showToast('请先添加一个家庭成员！');
            return;
        }

        var upList = []

        for(var i = 0;i<List.allTestData[List.testTypeIndex].subDatas.length;i++){
            upList.push({
                name:List.allTestData[List.testTypeIndex].subDatas[i].englishName,
                value:G('ex-items-'+i+'-detection_num').innerHTML
            })
        }

        console.log(upList)

        var postData = {
            paperType:List.allTestData[List.testTypeIndex].paperType,
            member_id: List.formData.measure_member_id,
            measure_dt: G('time').innerHTML,
            testStatus:List.allTestData[List.testTypeIndex].subDatas[0].statusValues.length !== 0?List.allTestData[List.testTypeIndex].subDatas[0].statusValues[List.testStatusIndex].statusId : '',
            upList:JSON.stringify(upList)
        };
        console.log(postData)
        LMEPG.ajax.postAPI('NewHealthDevice/upWriteData', postData, function (data) {
            console.log(data,123)
            if(data.code === 200){
                setTimeout(function () {
                   LMEPG.Intent.back()
                },2000)
                LMEPG.UI.showToast('提交成功')
            }
        })
    },

    /**
     * 准备前初始化、处理一些数据变量
     */
    initData: function () {
        // 默认按钮焦点保持
        if (!LMEPG.Func.isEmpty(RenderParam.focusIndex) && RenderParam.focusIndex.startWith('items_')) {
            defaultFocusId = RenderParam.focusIndex;
        }
    },

    /**
     * 页面初始化唯一入口
     */
    init: function () {
        this.initData();
        this.buildButtons();
        List.initOnce();
        InputData.renderListItemUIFirst()
        InputData.initButtonsFocus()
    },

    /**
     * 初始化按钮焦点
     */
    initButtonsFocus:function (){
        LMEPG.ButtonManager.init(defaultFocusId, buttons, '', true);
    },

    /**
     * 渲染列表
     */
    renderListItemUIFirst:function (){
        List.renderListItemUIFirst(function () {
            // 跳转到其它页面（添加家庭成员）前已数的表单数据保持
            if (LMEPG.Func.isObject(RenderParam.inputFormData)) {
                List.formData.measure_type = get_obj_value_by(RenderParam.inputFormData, 'measure_type');
                List.formData.measure_value = get_obj_value_by(RenderParam.inputFormData, 'measure_value');
                List.formData.measure_status = get_obj_value_by(RenderParam.inputFormData, 'measure_status');
                List.formData.measure_dt.year = get_obj_value_by(RenderParam.inputFormData, 'measure_dt.year');
                List.formData.measure_dt.month = get_obj_value_by(RenderParam.inputFormData, 'measure_dt.month');
                List.formData.measure_dt.day = get_obj_value_by(RenderParam.inputFormData, 'measure_dt.day');
                List.formData.measure_dt.hours = get_obj_value_by(RenderParam.inputFormData, 'measure_dt.hours');
                List.formData.measure_dt.minutes = get_obj_value_by(RenderParam.inputFormData, 'measure_dt.minutes');
                List.formData.measure_dt.seconds = get_obj_value_by(RenderParam.inputFormData, 'measure_dt.seconds');
                return false;
            } else {
                return false;
            }
        });
    },
};

/**
 * 返回
 */
function onBack() {
    if (List.hasExpandingItems()) {
        List.collapseItem(List.currentOpenId);
    } else {
        LMEPG.Intent.back();
    }
}

/**
 * 文档加载完成，开始初始化
 */
window.onload = function () {
    // 设置皮肤（产品背景图）
    if (!LMEPG.Func.isEmpty(RenderParam.skin) && !LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        var bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
        document.body.style.backgroundImage = 'url(' + bgImg + ')';
    }

    List.getInputData(function () {
        InputData.init();
        List.resetListItemValueUI();

    })

};
