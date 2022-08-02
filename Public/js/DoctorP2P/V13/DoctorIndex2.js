/** 常量定义区域 - start  */

var DOCTOR_PAGE_SIZE = 4; // 医生列表单页显示医生数量

var REFRESH_DOCTOR_LIST_INTERVAL = 15 * 60 * 1000; // 医生列表页面刷新时间间隔

var DEPARTMENT_PAGE_SIZE = 36; // 科室列表单页显示科室数量

var ELLIPSIS = "..."; // 省略号，显示科室时使用

var DEPARTMENT_ROW_SHOW_ITEM = 6; // 科室一行展示的元素个数

var DEPARTMENT_ITEM_PREFIX = "department-item-"; // 科室项标识前缀

var NO_INQUIRY_TIME_TIPS = "您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊"; // 普通用户问诊时无问诊次数文案提示

var BLACKLIST_USER_TIPS = "您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。"; // 问诊时检测用户黑名单时提示

var DOCTOR_ITEM_PREFIX = "doctor-item-"; // 医生项标识前缀

var DOCTOR_NAME_LIMIT_LENGTH = 6; // 医生名字限制长度

var DOCTOR_JOB_LIMIT_LENGTH = 7; // 医生职业限制长度

/** 常量定义区域 - end  */

/** 医生列表页 - 页面渲染 */
var doctorIndexView = {

    showPage: 1, // 当前列表所在分页

    buttons: [], // 页面活动焦点

    _isAddButtons: false, // 是否添加过按钮

    maxPage: 1, // 分页显示的最大页

    clipDepartmentLength: 4, // 科室最大显示长度

    /**
     * 渲染头部页面
     */
    renderHeader: function () {
        // 使用逗号对头部的功能进行切分然后合成数组
        var functions = doctorIndexController.headerFunctions = RenderParam.headerFunctions.split(",");
        // 排除数组为空的情况
        if (functions.length > 0) {
            var _html = '';
            for (var i = 0; i < functions.length; i++) {
                var func = functions[i];
                var nextLeft = i === 0 ? '' : functions[i - 1]; // 往左移动焦点
                var nextRight = i === functions.length - 1 ? '' : functions[i + 1]; // 往右移动的焦点
                switch (func) {
                    case 'select-department': // 选择科室
                        _html += '<div style="display: inline-block;position: relative"><div id="department-name">' + (RenderParam.deptId === '' ? '选择科室' : RenderParam.deptId) + '</div>';
                        _html += '<img id="select-department" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/select_department.png" alt="选择科室"/></div>';

                        doctorIndexView.buttons.push({
                            id: 'select-department',
                            name: '选择科室',
                            type: 'img',
                            nextFocusLeft: nextLeft,
                            nextFocusRight: nextRight,
                            nextFocusDown: DOCTOR_ITEM_PREFIX + '0',
                            backgroundImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/select_department.png',
                            focusImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/select_department_focus.png',
                            focusChange: doctorIndexView.selectDepartmentFocusChange,
                            click: doctorIndexController.selectDepartment,
                            beforeMoveChange:doctorIndexView.changeLeaveStyle
                        });
                        break;
                    case "one-key-inquiry": // 一键问医
                        if (RenderParam.carrierId === '110052'){
                            _html += '<img id="one-key-inquiry" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/one_key_inquiry_cihai.png" alt="一键问诊"/>';
                        }else {
                            _html += '<img id="one-key-inquiry" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/one_key_inquiry.png" alt="一键问医"/>';
                        }
                        doctorIndexView.buttons.push({
                            id: 'one-key-inquiry',
                            name: '一键问医',
                            type: 'img',
                            nextFocusLeft: nextLeft,
                            nextFocusRight: nextRight,
                            nextFocusDown:  DOCTOR_ITEM_PREFIX + '0',
                            backgroundImage: RenderParam.carrierId=='110052'?g_appRootPath + '/Public/img/hd/DoctorP2P/V13/one_key_inquiry_cihai.png':g_appRootPath + '/Public/img/hd/DoctorP2P/V13/one_key_inquiry.png',
                            focusImage: RenderParam.carrierId=='110052'?g_appRootPath + '/Public/img/hd/DoctorP2P/V13/one_key_inquiry_focus_cihai.png':g_appRootPath + '/Public/img/hd/DoctorP2P/V13/one_key_inquiry_focus.png',
                            click: doctorIndexController.oneKeyInquiry,
                            beforeMoveChange:doctorIndexView.changeLeaveStyle
                        });
                        break;
                    case "doctor-schedule": // 医生排班
                        _html += '<img id="doctor-schedule" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/doctor_schedule.png" alt="医生排班"/>';
                        doctorIndexView.buttons.push({
                            id: 'doctor-schedule',
                            name: '医生排班',
                            type: 'img',
                            nextFocusLeft: nextLeft,
                            nextFocusRight: nextRight,
                            nextFocusDown: 'doctor-item-0',
                            backgroundImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/doctor_schedule.png',
                            focusImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/doctor_schedule_focus.png',
                            click: doctorIndexController.routeDoctorSchedule,
                        });
                        break;
                    case "ask-record": // 问诊记录
                        if (RenderParam.carrierId==='110052'){
                            _html += '<img id="ask-record" src="'+ g_appRootPath + '/Public/img/hd/DoctorP2P/V13/ask-record_cihai.png" alt="问诊记录">';
                        }else {
                            _html += '<img id="ask-record" src="'+ g_appRootPath + '/Public/img/hd/DoctorP2P/V13/ask-record.png" alt="问医记录">';
                        }
                        doctorIndexView.buttons.push(                    {
                                id: 'ask-record',
                                name: '问诊记录',
                                type: 'img',
                                nextFocusLeft: nextLeft,
                                nextFocusRight: nextRight,
                                nextFocusDown: 'doctor-item-0',
                                backgroundImage: RenderParam.carrierId==='110052'?g_appRootPath + '/Public/img/hd/DoctorP2P/V13/ask-record_cihai.png':g_appRootPath + '/Public/img/hd/DoctorP2P/V13/ask-record.png',
                                focusImage: RenderParam.carrierId==='110052'?g_appRootPath + '/Public/img/hd/DoctorP2P/V13/ask-record_f_cihai.png':g_appRootPath + '/Public/img/hd/DoctorP2P/V13/ask-record-f.png',
                                click:doctorIndexController.routerToAskRecord,
                                beforeMoveChange:doctorIndexView.changeLeaveStyle
                            }                        );
                        break;
                }
            }
            G('header').innerHTML = _html;
        }
    },

    changeLeaveStyle:function(dir){
        if(dir === 'down' && departmentListController.isHeartAsk){
            setTimeout(function () {
                G('heart-ask').src =  g_appRootPath + '/Public/img/hd/DoctorP2P/V13/heart-ask-m.png'
            },50)
        }
    },

    renderArrow: function () {
        doctorIndexView.buttons.push({
            id: 'doctor-prev-arrow',
            name: '左箭头',
            type: 'img',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/Common/left.png',
            focusImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/Common/left.png',
            click: doctorIndexView.turnPrevPage,
        });
        doctorIndexView.buttons.push({
            id: 'doctor-next-arrow',
            name: '右箭头',
            type: 'img',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/Common/right.png',
            focusImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/Common/right.png',
            click: doctorIndexView.turnNextPage,
        });
    },

    /**
     * 渲染医生列表页
     * @param doctorListData 医生列表数据
     */
    renderDoctorList: function (doctorListData) {

        // 针对民生热线兼容标题
        if (RenderParam.carrierId === '651092') G('hospital-name').innerHTML = doctorListData.orgName;
        // 世纪慈海兼容标题
        if (RenderParam.carrierId === '110052') G('hospital-name').innerHTML = '在线问诊';

        var doctorList = doctorListData.list;
        var _html = '';
        var _buttons = [];
        for (var i = 0; i < doctorList.length; i++) {
            var doctorItem = doctorList[i];
            _html += '<ul id="' + DOCTOR_ITEM_PREFIX + i + '" >';
            // 医生头像
            var doctorAvatarUrl = '';
            var defaultDoctorAvatar = g_appRootPath + '/Public/img/Common/default.png';
            if (RenderParam.carrierId === '651092') {
                doctorAvatarUrl = doctorItem.avatar_url;
            } else {
                doctorAvatarUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, doctorItem.doc_id, doctorItem.avatar_url, RenderParam.carrierId);
            }
            _html += '<li class="doctor-avatar" ><img onerror="this.src=\'' + defaultDoctorAvatar + '\'" src=' + doctorAvatarUrl + ' alt="医生头像"/></li>';
            // 医生推荐状态
            _html += '<li class="doctor-recommend">' + doctorIndexController.getDoctorRecommendImage(doctorItem.today_recommend) + '</li>';
            // 医生状态
            _html += '<li class="doctor-status"><img src="' + doctorIndexController.getDoctorStatusImage(doctorItem.online_state,doctorItem.today_recommend) + '" alt="医生状态"></li>';
            // 医生名字
            _html += '<li id="doctor-name-' + i + '" data-name="' + doctorItem.doc_name + '" class="doctor-name">' + LMEPG.Func.substrByOmit(doctorItem.doc_name, DOCTOR_NAME_LIMIT_LENGTH) + '</li>';
            if (RenderParam.carrierId === '651092') {
                // 工作人员职位
                _html += '<li id="doctor-job-' + i + '" data-name="' + doctorItem.job + '" class="doctor-only-job">' + LMEPG.Func.substrByOmit(doctorItem.job, DOCTOR_JOB_LIMIT_LENGTH) + '</li>';
                //是否显示电话号码
                if(doctorItem.if_show_tel === 1){
                    _html += '<li id="doctor-job-' + i + '" class="doctor-job" data-name="' + '电话' + '" >' + doctorItem.phone_num + '</li>';
                }
            } else {
                // 医生所在科室
                _html += '<li class="doctor-department" >' + doctorItem.department + '</li>';
                // 医生职称
                _html += '<li id="doctor-job-' + i + '" class="doctor-job" data-name="' + doctorItem.job_title + '" >' + doctorItem.job_title + '</li>';
                // 医生接诊次数
                _html += '<li class="doctor-reception-times">问诊量' + doctorItem.inquiry_num + '</li>';
            }
            _html += '</ul>';
            // 添加焦点
            if (!doctorIndexView._isAddButtons) {
                _buttons.push({
                    id: DOCTOR_ITEM_PREFIX + i,
                    name: '医生项-' + i,
                    type: 'div',
                    nextFocusUp: doctorIndexController.headerFunctions[0],
                    nextFocusDown: '',
                    nextFocusLeft: DOCTOR_ITEM_PREFIX + (i - 1),
                    nextFocusRight: DOCTOR_ITEM_PREFIX + (i + 1),
                    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/DoctorP2P/V13/doctor_item_bg.png',
                    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/DoctorP2P/V13/doctor_item_f.png',
                    click: doctorIndexController.clickDoctorItem,
                    focusChange: doctorIndexView.doctorItemFocusChange,
                    beforeMoveChange: doctorIndexView.doctorItemMoveChange,
                    doctorId: doctorItem.doc_id,
                    index: i,
                });
            }
        }
        // 渲染医生列表
        G('doctor-container').innerHTML = _html;
        // 添加焦点按钮
        if (!doctorIndexView._isAddButtons  || doctorIndexView.showPage === 1) {
            LMEPG.ButtonManager.addButtons(_buttons);
            LMEPG.BM.initButtonsOnclick();
        }
        if (RenderParam.focusId === (DOCTOR_ITEM_PREFIX + '0') && doctorList.length === 0 ) {
            RenderParam.focusId = doctorIndexController.headerFunctions[0];
        }
        // 移动至合适的焦点
        LMEPG.ButtonManager.requestFocus(RenderParam.focusId);
        // 显示目前页码
        G('page-num').innerHTML = doctorIndexView.showPage + '/' + doctorIndexView.maxPage;
        // 显示箭头
        doctorIndexView.showArrow();
    },

    /**
     * 展示箭头
     */
    showArrow: function () {
        if (doctorIndexView.maxPage > 1) {
            doctorIndexView.showPage > 1 ? Show('doctor-prev-arrow') : Hide('doctor-prev-arrow');
            doctorIndexView.showPage < doctorIndexView.maxPage ? Show('doctor-next-arrow') : Hide('doctor-next-arrow');
        } else {
            Hide('doctor-prev-arrow');
            Hide('doctor-next-arrow');
        }
    },

    /**
     * 医生列表获取失败处理函数
     * @param errorData 错误数据
     */
    showGetDoctorListFail: function (errorData) {
        if (RenderParam.carrierId === '651092') {
            LMEPG.UI.showToast('获取工作人员列表失败！');
        } else {
            LMEPG.UI.showToast('获取医生列表失败');
        }
    },

    /**
     * 问诊用户黑名单提示
     */
    showBlacklistUserTips: function (pageFocusId) {
        var dialogConfig = {
            beClickBtnId: pageFocusId, // 弹窗消失后，页面获得的焦点
            onClick: modal.hide,                                 // 弹窗点击确定的回调事件
        }
        // 提示用户无法问诊
        modal.commonDialog(dialogConfig, '', BLACKLIST_USER_TIPS, '');
    },

    /**
     * 问诊次数为0提示
     */
    showNoInquiryTimesTips: function (pageFocusId) {
        var dialogConfig = {
            beClickBtnId: pageFocusId, // 弹窗消失后，页面获得的焦点
            onClick: function () {
                modal.hide();
                doctorIndexController.routeOrderVIP();
            },                                                   // 弹窗点击确定的回调事件
        }
        // 弹窗提示购买VIP才能继续发起问诊
        modal.commonDialog(dialogConfig, '', NO_INQUIRY_TIME_TIPS, '');
    },

    /**
     * 问诊时医生离线提示
     */
    showDoctorOfflineTips: function () {
        if (RenderParam.carrierId === '651092') {
            LMEPG.UI.showToast('当前工作人员不在线');
        } else {
            LMEPG.UI.showToast('当前医生不在线');
        }
    },

    /**
     *  显示已经选择的科室名称
     */
    showSelectedDepartment: function () {
        G('department-name').innerHTML = departmentListController.selectDepartment;
    },

    /**
     * 选择科室按钮焦点改变事件监听
     * @param button 选择科室按钮
     * @param hasFocus 是否获得焦点
     */
    selectDepartmentFocusChange: function(button,hasFocus) {
        var selectDepartmentElement = G('department-name');
        var departmentName = departmentListController.selectDepartment;
        if (departmentName.length > doctorIndexView.clipDepartmentLength) {
            if (hasFocus) {
                selectDepartmentElement.innerHTML = '<marquee scrollamount="4">' + departmentName;
            } else {
                selectDepartmentElement.innerHTML = departmentName.slice(0, doctorIndexView.clipDepartmentLength) + ELLIPSIS;
            }
        }
    },

    /**
     * 医生项焦点获得事件
     * @param button 具体的某个医生项
     * @param hasFocus 是否获得焦点
     */
    doctorItemFocusChange: function (button, hasFocus) {
        var doctorNameElement = G('doctor-name-' + button.index);
        var doctorJobElement = G('doctor-job-' + button.index);
        var doctorName = doctorNameElement.getAttribute('data-name');
        var doctorJob = doctorJobElement.getAttribute('data-name');
        if (hasFocus) {
            LMEPG.Func.marquee3(doctorNameElement, doctorName, DOCTOR_NAME_LIMIT_LENGTH, 3);
            LMEPG.Func.marquee3(doctorJobElement, doctorJob, DOCTOR_JOB_LIMIT_LENGTH, 3);
        } else {
            LMEPG.Func.marquee3(doctorNameElement);
            doctorNameElement.innerHTML = LMEPG.Func.substrByOmit(doctorName, DOCTOR_NAME_LIMIT_LENGTH);
            LMEPG.Func.marquee3(doctorJobElement);
            doctorJobElement.innerHTML = LMEPG.Func.substrByOmit(doctorJob, DOCTOR_JOB_LIMIT_LENGTH);
        }
    },

    /**
     * 医生项焦点移动事件，当检测移动当前页显示列表到第一项或者最后一项时，需要翻页
     * @param direction 焦点移动的方向
     * @param button 医生项按钮
     */
    doctorItemMoveChange: function (direction, button) {
        if (doctorIndexView.maxPage > 1) {
            var firstDoctorItem = DOCTOR_ITEM_PREFIX + '0';
            var lastDoctorItem = DOCTOR_ITEM_PREFIX + (DOCTOR_PAGE_SIZE - 1);

            switch (direction) {
                case 'left':
                    if (button.id === firstDoctorItem && doctorIndexView.showPage !== 1) {
                        doctorIndexView.turnPrevPage();
                    }
                    break;
                case 'right':
                    if (button.id === lastDoctorItem && doctorIndexView.showPage !== doctorIndexView.maxPage) {
                        doctorIndexView.turnNextPage();
                    }
                    break;
            }
        }

        if( direction === 'up' && departmentListController.isHeartAsk){
            LMEPG.BM.requestFocus('heart-ask')
            return false
        }
    },

    /**
     * 上前翻页
     */
    turnPrevPage: function () {
        var lastDoctorItem = DOCTOR_ITEM_PREFIX + (DOCTOR_PAGE_SIZE - 1);
        // 向前翻页
        doctorIndexView.showPage -= 1;
        // 修改默认焦点
        RenderParam.focusId = lastDoctorItem;
        // 渲染医生列表
        doctorIndexController.getDoctorList(true);
    },

    /**
     * 向后翻页
     */
    turnNextPage: function () {
        var firstDoctorItem = DOCTOR_ITEM_PREFIX + '0';
        // 向后翻页
        doctorIndexView.showPage += 1;
        // 修改默认焦点
        RenderParam.focusId = firstDoctorItem;
        // 渲染医生列表
        doctorIndexController.getDoctorList(true);
    }
};

/** 医生列表页 - 页面逻辑 */
var doctorIndexController = {

    inquiryButtonId: '',    // 问诊时使用的按钮

    refreshListTimer: null, // 列表刷新定时器，由于后端医生登录状态暂时没有长链接的机制来更新前端页面，所以通过前端页面定时刷新

    headerFunctions: [],    // 头部功能列表

    doctorList: [],         // 医生列表

    /**
     * 页面初始化
     */
    init: function () {
        // 1、拉取科室列表
        departmentListController.getDepartmentList();
        // 2、 渲染医生列表页头部
        doctorIndexView.renderHeader();
        doctorIndexView.renderArrow();
        // 3、初始化焦点按钮
        LMEPG.ButtonManager.init(RenderParam.focusIndex, doctorIndexView.buttons, '', true);
        // 4、 设置当前页面显示页码，请求医生列表页并进行渲染
        doctorIndexView.showPage = parseInt(RenderParam.page);
        this.getDoctorList(true);

        this.difAreaHandle()

        if(RenderParam.isHeartAsk === '1'){
            departmentListController.isHeartAsk = true
            G('heart-ask').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/heart-ask-m.png'
        }
    },

    difAreaHandle:function(){
        if(RenderParam.carrierId === '440001'){
            LMEPG.ajax.postAPI("Doctor/getFreeInquiryTimes",{}, function (data) {
               G('ask-left-time').style.display = 'block'
                if(data.remain_count > 0){
                    G('ask-left-time').innerHTML = (RenderParam.isVip == 1?'尊敬的健康尊享会员，您本月问诊次数剩余'+data.remain_count+'次'
                        :'尊敬的用户，你的免费体验问诊次数剩余'+data.remain_count+'次')
                }else {
                    G('ask-left-time').innerHTML = RenderParam.isVip == 1?
                        '尊敬的健康尊享会员，您本月问诊次数已耗尽，下月可继续问诊':'您的体验问诊次数已用完，成为VIP会员，尊享30次在线问医权益'
                }
            })
        }
    },

    /**
     * 获取医生列表数据
     * @param isShowLoadingStatus 是否需要展示等待加载框，刷新列表页面同步医生状态时不要展示等待框
     */
    getDoctorList: function (isShowLoadingStatus, cb) {
        var requestInfo = {
            deptId: RenderParam.deptId,       // 医院科室ID
            deptIndex: RenderParam.deptIndex, // 医院科室编号
            page: doctorIndexView.showPage,   // 医生列表分页所在分页
            pageSize: DOCTOR_PAGE_SIZE        // 医生列表单页显示医生数量
        }
        // 判断当前是否为新疆电信社区医院或者新疆电信民生热线
        if (RenderParam.sDemoId !== '') {
            requestInfo.hospId = RenderParam.hospitalId; // 添加医院ID
            // 根据医院ID获取医生列表
            LMEPG.Inquiry.p2pApi.getDoctorListByHospitalId(isShowLoadingStatus, requestInfo, function (doctorListData) {
                doctorIndexController.getDoctorListSuccess(doctorListData);
                cb && cb()
            }, doctorIndexView.showGetDoctorListFail);
        } else {
            // 根据部分信息获取医生列表
            LMEPG.Inquiry.p2pApi.getDoctorList(isShowLoadingStatus, requestInfo, function (doctorListData) {
                doctorIndexController.getDoctorListSuccess(doctorListData);
                cb && cb()
            }, doctorIndexView.showGetDoctorListFail);
        }
    },

    /**
     * 获取医生列表数据成功
     * @param doctorListData 医生列表数据
     * @param focusIndex 渲染医生列表时的焦点
     */
    getDoctorListSuccess: function (doctorListData) {
        // 保存医生列表数据
        doctorIndexController.doctorList = doctorListData.list;
        // 更新最大页码
        doctorIndexView.maxPage = Math.ceil(doctorListData.total / DOCTOR_PAGE_SIZE);
        // 渲染医生列表数据
        doctorIndexView.renderDoctorList(doctorListData);
        // 先清除定时器，然后再开始刷新，避免翻页或者选择科室后刷新页面，定时器发生累计
        if (doctorIndexController.refreshListTimer) {
            clearTimeout(doctorIndexController.refreshListTimer);
            // 启动定时器
            doctorIndexController.refreshListTimer = setTimeout(function () {
                // 保持焦点不变
                RenderParam.focusId = LMEPG.ButtonManager.getCurrentButton().id;
                // 刷新列表页
                doctorIndexController.getDoctorList(false);
            }, REFRESH_DOCTOR_LIST_INTERVAL);
        }
    },

    /**
     * 获取医生所属的科室列表
     * @param button 选择医院科室按钮
     */
    getDepartmentList: function (button) {
        LMEPG.Inquiry.p2pApi.getDepartmentList(doctorIndexView.showDepartmentList);
    },

    /**
     * 选择科室按钮点击事件，展示科室选择页
     * @param button 选择科室按钮
     */
    selectDepartment: function (button) {
        departmentListView.showDepartmentList(parseInt(RenderParam.deptIndex));
    },

    /**
     * 一键问医功能
     * @param button 一键问医按钮
     */
    oneKeyInquiry: function (button) {
        // 记录触发问诊ID
        doctorIndexController.inquiryButtonId = button.id;
        // 发起一键问医功能
        LMEPG.Inquiry.p2p.oneKeyInquiry(doctorIndexController.getInquiryInfo(button.id));
    },

    /**
     * 医生项点击事件
     * @param button 具体的医生项
     */
    clickDoctorItem: function (button) {
        if (RenderParam.carrierId === '651092') { // 新疆电信民生热线直接发起问诊
            doctorIndexController.inquiryButtonId = button.id;
            var index = button.index;
            var doctorInfo = doctorIndexController.doctorList[index];
            var inquiryInfo = doctorIndexController.getInquiryInfo(button.id);
            // 检测医生职位
            if (typeof doctorInfo.job_title == 'undefined') {
                if (doctorInfo.job) {
                    doctorInfo.job_title = doctorInfo.job;
                } else {
                    doctorInfo.job_title = "接线员";
                }
            }
            inquiryInfo.doctorInfo = doctorInfo;
            LMEPG.Inquiry.p2p._startVideoInquiry(inquiryInfo);
        } else { // 其他地区跳转跳转医生详情页面
            var doctorId = button.doctorId;
            doctorIndexController.routeDoctorDetail(doctorId);
        }
    },

    /**
     * 路由医生排班页面 --- 未来电视触摸设备平台使用
     * @param button 医生排班按钮
     */
    routeDoctorSchedule: function (button) {
        var doctorIndexIntent = doctorIndexController.getPageIntent();
        var albumIntent = LMEPG.Intent.createIntent('album');
        albumIntent.setParam('albumName', 'GraphicAlbum_27');
        // 中转页面使用
        albumIntent.setParam('focusId', button.id);
        albumIntent.setParam('deptId', RenderParam.deptId);
        albumIntent.setParam('deptIndex', RenderParam.deptIndex);
        albumIntent.setParam('page', doctorIndexView.showPage);
        LMEPG.Intent.jump(albumIntent, doctorIndexIntent);
    },

    /**
     * 路由订购VIP页面
     */
    routeOrderVIP: function () {
        var doctorIndexIntent = doctorIndexController.getPageIntent();
        var orderVIPIntent = LMEPG.Intent.createIntent('orderHome');
        LMEPG.Intent.jump(orderVIPIntent, doctorIndexIntent);
    },

    /**
     * 路由医生详情
     * @param doctorId 医生Id
     */
    routeDoctorDetail: function (doctorId) {
        var doctorIndexIntent = doctorIndexController.getPageIntent();
        var doctorDetailIntent = LMEPG.Intent.createIntent('doctorDetails');
        if (RenderParam.sDemoId) {
            doctorDetailIntent.setParam('s_demo_id', RenderParam.sDemoId);
        }
        doctorDetailIntent.setParam('doctorIndex', doctorId);
        LMEPG.Intent.jump(doctorDetailIntent, doctorIndexIntent);
    },

    routerToAskRecord:function(){
        var doctorIndexIntent = doctorIndexController.getPageIntent();
        var target = LMEPG.Intent.createIntent('healthTestArchivingList');
        target.setParam('comeFrom','doc')
        LMEPG.Intent.jump(target, doctorIndexIntent);
    },

    /**
     * 医生问诊结束后回调处理函数 --- APK版本接收，暂时保留不做处理
     */
    inquiryEndHandler: function () {

    },

    /**
     * 获取当前页面的路由对象
     */
    getPageIntent: function () {
        var intent = LMEPG.Intent.createIntent('doctorIndex');
        // 页面焦点保持
        intent.setParam('isExitApp', RenderParam.isExitApp)
        intent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        intent.setParam('page', doctorIndexView.showPage);
        intent.setParam('deptId', RenderParam.deptId);
        intent.setParam('deptIndex', RenderParam.deptIndex);
        intent.setParam('isHeartAsk', departmentListController.isHeartAsk)
        if (G('department-name')) {
            intent.setParam('departmentName', G('department-name').innerHTML);
        }
        if (RenderParam.sDemoId) {
            intent.setParam('s_demo_id', RenderParam.sDemoId);
            intent.setParam('hospitalId', RenderParam.hospitalId);
            intent.setParam('hospitalName', RenderParam.title);
        }
        return intent;
    },

    /**
     * 根据医生状态获取显示的图像
     * @param status 医生状态
     * @param today_recommend 医生推荐状态
     */
    getDoctorStatusImage: function (status,today_recommend) {
        var statusImage = '';
        switch (status) {
            case '0': // 离线
                statusImage = 'off_line.png';
                break;
            case '3': // 在线
                statusImage = 'on_line.png';
                break;
            case '2': // 忙碌
                if (today_recommend === '2') {
                    statusImage = 'on_line.png';
                } else {
                    statusImage = 'busy_line.png';
                }
                break;
            case '4': // 假忙碌
                statusImage = 'busy_line.png';
                break;
            default:
                statusImage = 'off_line.png';
                break;
        }
        return g_appRootPath + '/Public/img/hd/DoctorP2P/V13/' + statusImage;
    },
    /**
     * 根据医生推荐状态获取显示的图像
     * @param today_recommend 推荐状态
     */
    getDoctorRecommendImage: function (today_recommend) {
        var html = '';
        switch (today_recommend) {
            case '1': // 今日推荐
                html += '<img src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/recommend_line.png' + '" alt="今日推荐">';
                break;
            case '2': // 接诊中
                html += '<img src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/recommend_line.png' + '" alt="今日推荐">';
                html += '<img src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/treating_line.png' + '" alt="接诊中" style="margin-top: 5px">';
                break;
            default:
                html = '';
                break;
        }
        return html;
    },

    /**
     * 获取当前模块问诊医生的问诊信息
     * @param buttonId 触发问诊的按钮ID
     * @returns 当前模块的问诊信息
     */
    getInquiryInfo: function (buttonId) {
        return {
            userInfo: {
                isVip: RenderParam.isVip,                                    // 用户身份信息标识
                accountId: RenderParam.userAccount,                          // IPTV业务账号
            },
            memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
            moduleInfo: {
                moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                focusId: buttonId,                                           // 当前页面的焦点Id
                intent: doctorIndexController.getPageIntent(),               // 当前模块页面路由标识
            },
            serverInfo: {
                fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                cwsHlwyyUrl: RenderParam.cwsHlwyyUrl,                        // cws互联网医院模块链接地址
                teletextInquiryUrl: RenderParam.teletextInquiryUrl,          // 微信图文问诊服务器链接地址
            },
            blacklistHandler: doctorIndexView.showBlacklistUserTips,         // 校验用户黑名单时处理函数
            noTimesHandler: doctorIndexView.showNoInquiryTimesTips,          // 检验普通用户无问诊次数处理函数
            doctorOfflineHandler: doctorIndexView.showDoctorOfflineTips,     // 检验医生离线状态时处理函数
            inquiryEndHandler: doctorIndexController.inquiryEndHandler,      // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        };
    }
};

/** 医生列表页 - 科室列表 - 页面渲染 */
var departmentListView = {

    showPage: 1, // 当前显示分页页数

    buttons: [], // 科室列表页面交互的焦点

    clipNameLength: RenderParam.platformType === 'sd' ? 4 : 5, // 科室列表截取部门名称长度

    _isAddButtons: false, // 是否已经添加过焦点，避免重复添加

    /**
     * 展示科室列表提供用户选择
     */
    showDepartmentList: function (focusIndex) {
        // 获取当前页需要展示的科室列表
        var showDepartmentList = departmentListController.pagingData[departmentListView.showPage - 1];
        // 操作DOM的元素
        var _html = '';
        // 初始化默认的焦点
        var focusId = '';
        // 对列表进行遍历
        for (var i = 0; i < showDepartmentList.length; i++) {
            if (showDepartmentList[i].department_id == '88'){
                showDepartmentList.splice(i,1)
            }
            var departmentItem = showDepartmentList[i];

            var indexStart = (departmentListView.showPage - 1) * DEPARTMENT_PAGE_SIZE
            // 构造DOM节点
            _html += '<div class="department-item" id="' + DEPARTMENT_ITEM_PREFIX + (indexStart + i) + '" data-name="' + departmentItem.dept_name + '" data-id="' + departmentItem.dept_id + '">' +
                departmentListView.clipDepartmentName(departmentItem.dept_name) + '</div>';

            // 构造焦点交互对象
            if (!departmentListView._isAddButtons) {
                var button = {
                    id: DEPARTMENT_ITEM_PREFIX + i,
                    name: '科室项-' + i,
                    type: 'div',
                    nextFocusLeft: DEPARTMENT_ITEM_PREFIX + (i - 1),
                    nextFocusRight: DEPARTMENT_ITEM_PREFIX + (i + 1),
                    nextFocusUp: DEPARTMENT_ITEM_PREFIX + (i - DEPARTMENT_ROW_SHOW_ITEM),
                    nextFocusDown: DEPARTMENT_ITEM_PREFIX + (i + DEPARTMENT_ROW_SHOW_ITEM),
                    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/DoctorP2P/V13/department.png',
                    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/DoctorP2P/V13/department_f.png',
                    focusChange: departmentListView.departmentItemFocus,
                    click: departmentListController.clickDepartmentItem,
                    beforeMoveChange: departmentListController.onDepartmentItemMoveChange,
                    index: i
                };

                this.buttons.push(button);
            }

            // 设置初始化焦点
            if (focusIndex === (indexStart + i)) {
                focusId = DEPARTMENT_ITEM_PREFIX + i;
            }
        }
        departmentListController.lastIndex = i - 1;
        // 添加DOM节点到DOM树中
        G('department-wrap').innerHTML = _html;
        // 展示分页箭头
        departmentListView.showPageArrow();
        // 添加焦点行为
        if (!departmentListView._isAddButtons || departmentListView.showPage === 1) {
            LMEPG.ButtonManager.addButtons(departmentListView.buttons);
        }
        // 移动焦点到所设置焦点
        LMEPG.ButtonManager.requestFocus(focusId);
        // 显示科室列表页面
        Show('department-container');
    },

    /**
     * 展示分页的箭头
     */
    showPageArrow: function () {
        if (departmentListController.maxPage > 1) { // 分页数量大于一页，展示箭头
            if (departmentListView.showPage === 1) { // 在第一页，隐藏向上翻页箭头
                Hide('department-prev-arrow');
            } else {  // 不在第一页，隐藏向上翻页箭头
                Show('department-prev-arrow');
            }
            if (departmentListView.showPage === departmentListController.maxPage) { // 在最后一页，隐藏向下翻页箭头
                Hide('department-next-arrow');
            } else { // 不在最后一页，隐藏向下翻页箭头
                Show('department-next-arrow');
            }
        } else { // 分页数量小于一页，不展示箭头
            Hide('department-prev-arrow');
            Hide('department-next-arrow');
        }
    },

    /**
     * 当科室元素获取焦点时，当长度超过设置显示长度，滚动显示全部科室名称
     * @param button 科室元素按钮
     * @param hasFocus 当前科室元素是否获得焦点
     */
    departmentItemFocus: function (button, hasFocus) {
        var departmentItem = G(button.id);
        var departmentName = departmentItem.getAttribute('data-name');
        if (departmentName.length > departmentListView.clipNameLength) {
            if (hasFocus) {
                departmentItem.innerHTML = '<marquee scrollamount="4">' + departmentName;
            } else {
                departmentItem.innerHTML = departmentListView.clipDepartmentName(departmentName);
            }
        }
    },

    /**
     * 展示的科室名称过长时需要进行字符串裁剪
     * @param departmentName 科室名称
     */
    clipDepartmentName: function (departmentName) {
        var handledName = departmentName;

        if (departmentName.length > departmentListView.clipNameLength) {
            handledName = departmentName.slice(0, departmentListView.clipNameLength) + ELLIPSIS;
        }
        return handledName;
    },

    /**
     * 隐藏科室选择页
     */
    hide: function () {
        Hide('department-container');
    }
};

/** 医生列表页 - 科室列表 - 页面渲染 */
var departmentListController = {

    maxPage: 1, // 部门列表所能承受的最大分页

    pagingData: [], // 经过计算获得分页的数据

    selectDepartment: '', // 当前选择的科室

    lastIndex: -1, // 当前列表页显示得最后一个元素的下标

    isHeartAsk:false,

    /**
     * 获取部门列表数据
     */
    getDepartmentList: function () {
        LMEPG.Inquiry.p2pApi.getDepartmentList(function (departmentListData) {
            // 添加全部科室列表项
            departmentListData.list.unshift({'dept_id': '', 'dept_name': '全部科室'});
            // 计算最大分页
            departmentListController.maxPage = Math.ceil(departmentListData.list.length / DEPARTMENT_PAGE_SIZE);

            // 对列表数据进行分页
            for (var i = 0; i <= departmentListController.maxPage; i++) {
                // 分页的起始下标
                var startIndex = i * DEPARTMENT_PAGE_SIZE;
                // 分页大小
                var endIndex = Math.min(departmentListData.list.length, (i + 1) * DEPARTMENT_PAGE_SIZE);
                // 存储分页的数据
                departmentListController.pagingData.push(departmentListData.list.slice(startIndex, endIndex));
            }
        });
    },

    /**
     * 具体科室点击事件
     * @param button 具体科室元素
     */
    clickDepartmentItem: function (button) {
        // 更新科室相关请求医生列表参数
        var departmentItem = G(button.id);
        departmentListController.selectDepartment = departmentItem.getAttribute('data-name');
        RenderParam.deptId = departmentItem.getAttribute('data-id');
        RenderParam.deptIndex = parseInt(button.id.substring(DEPARTMENT_ITEM_PREFIX.length));
        // 关闭科室列表页
        Hide('department-container');
        // 展示选择结果
        doctorIndexView.showSelectedDepartment();
        // 修改默认焦点
        RenderParam.focusId = DOCTOR_ITEM_PREFIX + '0';
        // 更新当前页码到第一页，刷新医生列表
        doctorIndexView.showPage = 1;
        doctorIndexController.getDoctorList(true);
        departmentListController.isHeartAsk = false
    },

    getSpeDepartment:function(btn){
        RenderParam.deptId = '全科'
        RenderParam.deptIndex = '1'
        doctorIndexView.showPage = 1;
        RenderParam.focusId = DOCTOR_ITEM_PREFIX + '0';
        doctorIndexController.getDoctorList(true,function () {
            G(btn.id).src = btn.selectImage
            departmentListController.isHeartAsk = true
        });

    },

    /**
     * 科室列表向上翻页
     */
    turnPrevPage: function () {
        departmentListView.showPage -= 1;
        departmentListView.showDepartmentList(DEPARTMENT_PAGE_SIZE - 1);
    },

    /**
     * 科室列表向下翻页
     */
    turnNextPage: function () {
        departmentListView.showPage += 1;
        departmentListView.showDepartmentList(0);
    },

    /**
     * 科室项移动焦点事件处理函数
     * @param direction 移动方向
     * @param button 科室项按钮
     */
    onDepartmentItemMoveChange: function (direction,button) {
        var index = button.index;
        // 第一行元素所包含的下标
        var firstRowIndexList = [];
        // 最后一行元素包含的下标
        var lastRowIndexList = [];
        for (var i = 0; i < DEPARTMENT_ROW_SHOW_ITEM; i++) {
            firstRowIndexList.push(i);
            lastRowIndexList.unshift(DEPARTMENT_PAGE_SIZE - i - 1);
        }
        if (departmentListController.maxPage > 1) {
            // 第一行科室项配置向上翻页功能
            if (direction === 'up' && firstRowIndexList.includes(index)) {
               departmentListController.turnPrevPage();
            }

            // 最后一行科室项配置向下翻页功能
            if (direction === 'down' && lastRowIndexList.includes(index)) {
                departmentListController.turnNextPage();
            }
        }

        // 倒数第二排向下移动无焦点，移动至最后一个焦点
        if (direction === 'down' && G(button.nextFocusDown) === null) {
            LMEPG.ButtonManager.requestFocus(DEPARTMENT_ITEM_PREFIX + departmentListController.lastIndex);
        }
    }
};

/**
 * 遥控器监听返回函数
 */
function onBack() {
    if (isShow('department-container')) { // 判断当前是否显示科室选择页
        // 关闭科室列表选择页
        Hide('department-container');
        // 焦点恢复
        LMEPG.ButtonManager.requestFocus('select-department');
    } else if (RenderParam.isExitApp === '1') {  // 判断是否需要退出apk应用程序
        // 退出apk应用程序
        // LMAndroid.JSCallAndroid.doExitApp(); // 直接退出应用
        LMEPG.Intent.back('IPTVPortal');
    } else {
        // 返回上一级页面
        LMEPG.Intent.back();
    }
}