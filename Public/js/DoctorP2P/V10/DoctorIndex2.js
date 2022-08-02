var DOCTOR_PAGE_SIZE = 4; // 单页显示的医生数量

var REFRESH_DOCTOR_LIST_INTERVAL = 15 * 60 * 1000; // 医生列表页面刷新时间间隔

var DOCTOR_ITEM_PREFIX = "doctor-item-"; // 医生项标识前缀

/** 医生列表页业务页面控制 */
var doctorIndexView = {

    showPage: 1, // 当前列表展示的分页

    maxPage: 1,  // 当前页面显示的最大页码

    isAddButtons: false, // 是否已经添加过按钮

    buttons: [], // 当前页面交互焦点,科室选择按钮是必然存在的，所以固定初始化

    /**
     * 显示科室名称
     */
    showDepartment: function () {
        G('department-name').innerHTML = RenderParam.departmentName;
    },

    /**
     * 渲染医生列表数据
     * @param doctorListData 医生列表数据
     */
    renderDoctorList: function (doctorListData) {
        var doctorList = doctorListData.list;
        var _html = '';
        var _buttons = [];
        for (var i = 0; i < doctorList.length; i++) {
            // 单个医生项
            var doctorItem = doctorList[i];

            _html += '<div id="' + DOCTOR_ITEM_PREFIX + i + '" data-id="' + doctorItem.doc_id + '" class="doctor-item">';
            // 医生状态
            _html += '<img class="doctor-status" src="' + doctorIndexController.getDoctorStatusImage(doctorItem.online_state,doctorItem.today_recommend) + '"/>';
            // 医生头像
            var doctorAvatarUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, doctorItem.doc_id, doctorItem.avatar_url, RenderParam.carrierId);
            _html += "<img class='doctor-avatar' src='" + doctorAvatarUrl + "'>";
            // 医生推荐状态
            _html += '<div class="doctor-recommend">' + doctorIndexController.getDoctorRecommendImage(doctorItem.today_recommend) + '</div>';
            // 医生接诊量
            _html += '<div class="doctor-reception-times">已问诊<span>' + LMEPG.Inquiry.p2pApi.switchInquiryNumStr(doctorItem.inquiry_num) + '</span></div>';

            _html += '<div class="introduce">';
            // 医生名字
            _html += '<div class="introduce-word doctor-name">' + doctorItem.doc_name + '</div>';
            // 医院名字
            _html += '<div class="introduce-word hospital-name">' + doctorItem.hospital + '</div>';
            // 医生所属科室
            _html += '<div class="introduce-word">科室：<span>' + doctorItem.department + '</span></div>';
            // 医生职称
            _html += '<div class="introduce-word">职称：<span>' + doctorItem.job_title + '</span></div>';
            _html += '</div>';
            _html += '</div>';

            // 按钮
            _buttons.push({
                id: DOCTOR_ITEM_PREFIX + i,
                name: '医生项-' + i,
                type: 'div',
                nextFocusLeft: DOCTOR_ITEM_PREFIX + (i - 1),
                nextFocusRight: DOCTOR_ITEM_PREFIX + (i + 1),
                nextFocusUp: DOCTOR_ITEM_PREFIX + (i - 2),
                nextFocusDown:  DOCTOR_ITEM_PREFIX + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_card.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_card.png",
                click: doctorIndexController.clickDoctorItem,
                focusChange: doctorIndexView.onDoctorItemFocusChange,
                beforeMoveChange: doctorIndexView.onDoctorItemBeforeMove,
                index: i,
            });
        }
        // 添加页面内容
        G('table-list').innerHTML = _html;
        // 添加焦点按钮
        if (!doctorIndexView.isAddButtons || doctorIndexView.showPage === 1) {
            doctorIndexView.isAddButtons = true;
            LMEPG.ButtonManager.addButtons(_buttons);
        }
        if (doctorList.length === 3) { // 修改焦点指向
            var doctorItem1 = LMEPG.ButtonManager.getButtonById(DOCTOR_ITEM_PREFIX + '1');
            doctorItem1.nextFocusDown = DOCTOR_ITEM_PREFIX + '2';
        }
        // 显示页码
        G('pages').innerHTML = doctorIndexView.showPage + '/' + doctorIndexView.maxPage;
        // 修改默认焦点
        if (RenderParam.focusIndex === (DOCTOR_ITEM_PREFIX + "1") && doctorList.length === 1) {
            RenderParam.focusIndex = DOCTOR_ITEM_PREFIX + "0";
        }
        // 移动到焦点按钮
        LMEPG.ButtonManager.requestFocus(RenderParam.focusIndex);
        // 显示箭头
        doctorIndexView.showArrow();
    },

    /**
     * 箭头显示
     */
    showArrow: function () {
        if (parseInt(doctorIndexView.showPage) === doctorIndexView.maxPage) {
            // 最后一页，隐藏翻页箭头
            Hide('m-next');
        } else {
            // 其他页，正常显示
            Show('m-next');
        }
    },

    /**
     * 医生项焦点改变处理函数
     * @param button 具体的医生项
     * @param hasFocus 是否获得焦点
     */
    onDoctorItemFocusChange: function (button, hasFocus) {
        // 获取医生状态和医生头像元素
        var imgs = G(button.id).getElementsByTagName("img");
        var today_recommend = G(button.id).getElementsByTagName('div');
        if (hasFocus) {
            LMEPG.CssManager.addClass(button.id, "doctor-item-hover");
            imgs[0].className += " zoom-img-1";
            imgs[1].className += " zoom-img-2";
            today_recommend[0].className += " zoom-doctor-recommend";
        } else {
            LMEPG.CssManager.removeClass(button.id, "doctor-item-hover");
            imgs[0].className = "doctor-status";
            imgs[1].className = "doctor-avatar";
            today_recommend[0].className = "doctor-recommend";
        }
    },

    /**
     * 医生项焦点移动改变
     * @param direction 移动方向
     * @param button 具体的医生项
     */
    onDoctorItemBeforeMove: function (direction, button) {
        // 判断第一页第一行
        var isFirstRow = direction === 'up' && (button.id === 'doctor-item-0' || button.id === 'doctor-item-1') && parseInt(doctorIndexView.showPage) === 1;
        // 判断向上翻页条件,方向键向上,第一排按钮,不在第一页
        var isTurnPrevPage = direction === 'up' && (button.id === 'doctor-item-0' || button.id === 'doctor-item-1') && parseInt(doctorIndexView.showPage) !== 1;
        // 判断向下翻页条件,方向键向下,最后一排按钮,不在最后一页
        var isTurnNextPage = direction === 'down' && (button.id === 'doctor-item-2' || button.id === 'doctor-item-3') && parseInt(doctorIndexView.showPage) !== doctorIndexView.maxPage;

        if (isFirstRow) {
            LMEPG.ButtonManager.requestFocus('department');
        } else if (isTurnPrevPage) {
            // 向上翻页
            doctorIndexController.turnPrevPage(button.id);
        } else if (isTurnNextPage) {
            // 向下翻页
            doctorIndexController.turnNextPage(button.id);
        }
    },

    /**
     * 焦点方案初始化
     */
    initButtons: function () {
        doctorIndexView.buttons.push({
            id: 'department',
            name: '选择科室',
            type: 'div',
            nextFocusDown: DOCTOR_ITEM_PREFIX + '0',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_long.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_long.png",
            click: doctorIndexController.clickDepartment,
        });
        LMEPG.ButtonManager.init(RenderParam.focusIndex, doctorIndexView.buttons, '', true);
    }
}

/** 医生列表页业务逻辑控制 */
var doctorIndexController = {

    refreshListTimer: null, // 页面列表刷新定时器

    /**
     * 页面初始化逻辑
     */
    init: function () {
        // 1、显示科室名称
        doctorIndexView.showDepartment();
        // 2、获取医生列表
        // 2.1、初始化当前展示的分页
        doctorIndexView.showPage = RenderParam.page;
        // 2.2、调用接口获取数据
        doctorIndexModel.getDoctorList(true);
        // 3、初始化页面焦点（除医生列表外，医生列表还没有加载）
        doctorIndexView.initButtons();
    },

    /**
     * 获取医生列表数据成功处理函数
     * @param doctorListData 医生列表数据
     */
    getDoctorListSuccess: function (doctorListData) {
        if (doctorListData.code === 0 || doctorListData.code === '0') {
            // 计算显示的最大页码
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
                    doctorIndexModel.getDoctorList(false);
                }, REFRESH_DOCTOR_LIST_INTERVAL);
            }
        } else {
            LMEPG.UI.showToast('获取医生列表数据失败，' + doctorListData.code);
        }
    },

    /**
     * 获取医生列表失败
     * @param errorData 出错提示
     */
    getDoctorListFail: function (errorData) {
        LMEPG.UI.showToast('获取医生列表数据出错，' + errorData);
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
                    statusImage = 'busy.png';
                }
                break;
            case '4': // 假忙碌
                statusImage = 'busy.png';
                break;
            default:
                statusImage = 'off_line.png';
                break;
        }
        return g_appRootPath + '/Public/img/hd/DoctorP2P/V10/status_' + statusImage;
    },

    /**
     * 根据医生推荐状态获取显示的图像
     * @param today_recommend 推荐状态
     */
    getDoctorRecommendImage: function (today_recommend) {
        var html = '';
        switch (today_recommend) {
            case '1': // 今日推荐
                html += '<img src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V10/recommend_line.png' + '" alt="今日推荐" style="margin-top: 28px">';
                break;
            case '2': // 接诊中
                html += '<img src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V10/recommend_line.png' + '" alt="今日推荐">';
                html += '<img src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V10/treating_line.png' + '" alt="接诊中" style="margin-top: 5px">';
                break;
            default:
                html = '';
                break;
        }
        return html;
    },

    /**
     * 向上翻页
     * @param currentButtonId 当前页面获得焦点的元素ID
     */
    turnPrevPage: function (currentButtonId) {
        doctorIndexView.showPage--;
        if (currentButtonId === 'doctor-item-0') {
            RenderParam.focusIndex = 'doctor-item-2';
        } else {
            RenderParam.focusIndex = 'doctor-item-3';
        }
        doctorIndexModel.getDoctorList(true);
    },

    /**
     * 向下翻页
     * @param currentButtonId 当前页面获得焦点的元素ID
     */
    turnNextPage: function (currentButtonId) {
        doctorIndexView.showPage++;
        if (currentButtonId === 'doctor-item-2') {
            RenderParam.focusIndex = 'doctor-item-0';
        } else {
            RenderParam.focusIndex = 'doctor-item-1';
        }
        doctorIndexModel.getDoctorList(true);
    },

    /**
     * 点击科室选择按钮，跳转科室列表选择页
     * @param button 选择科室按钮
     */
    clickDepartment: function (button) {
        var departmentIntent = LMEPG.Intent.createIntent("doctorDepartment");
        departmentIntent.setParam("departmentId", RenderParam.departmentId);
        departmentIntent.setParam("departmentName", RenderParam.departmentName);
        departmentIntent.setParam("departmentIndex", RenderParam.departmentIndex);
        LMEPG.Intent.jump(departmentIntent, doctorIndexController.getDoctorListIntent(button.id));
    },

    /**
     * 点击具体的某个医生项
     * @param button 医生项按钮
     */
    clickDoctorItem: function (button) {
        var doctorDetailIntent = LMEPG.Intent.createIntent("doctorDetails");
        var doctorId = G(button.id).getAttribute('data-id');
        doctorDetailIntent.setParam("doc_id", doctorId);
        LMEPG.Intent.jump(doctorDetailIntent, doctorIndexController.getDoctorListIntent(button.id));
    },

    /**
     * 当前医生列表页路由对象
     * @param buttonId 当前页面焦点
     * @returns {{param: {}, setPageName: function(*): void, name: never, setParam: function(*, *): void}}
     */
    getDoctorListIntent: function (buttonId) {
        var intent = LMEPG.Intent.createIntent("doctorIndex");
        intent.setParam('focusIndex', buttonId);
        intent.setParam("departmentId", RenderParam.departmentId);
        intent.setParam("departmentName", RenderParam.departmentName);
        intent.setParam("departmentIndex", RenderParam.departmentIndex);
        intent.setParam("pageCurrent", doctorIndexView.showPage);
        return intent;
    }
}

/** 医生列表数据交互逻辑 */
var doctorIndexModel = {


    /**
     * 获取医生列表数据
     * @param isShowLoading 是否显示等待加载框，定时器刷新列表页的时候不需要显示加载框（用户体验无感知）
     */
    getDoctorList: function (isShowLoading) {
        var requestInfo = {
            deptId: RenderParam.departmentId,       // 医院科室ID
            deptIndex: RenderParam.departmentIndex, // 医院科室编号
            page: doctorIndexView.showPage,   // 医生列表分页所在分页
            pageSize: DOCTOR_PAGE_SIZE        // 医生列表单页显示医生数量
        }
        LMEPG.Inquiry.p2pApi.getDoctorList(isShowLoading, requestInfo, doctorIndexController.getDoctorListSuccess, doctorIndexController.getDoctorListFail);
    },

}

/**
 * 遥控器返回事件监听
 */
function onBack() {
    // 返回上一页
    LMEPG.Intent.back();
}