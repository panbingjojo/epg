var INQUIRY_TYPE_ITEM_PREFIX = 'inquiry-type-'; // 问诊方式定义前缀

var NO_INQUIRY_TIME_TIPS = "您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊"; // 普通用户问诊时无问诊次数文案提示

var BLACKLIST_USER_TIPS = "您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。"; // 问诊时检测用户黑名单时提示

var FAKE_BUSY_FLAG = "4";

/** 医生详情页面逻辑 */
var doctorDetailView = {

    defaultFocusId: '', // 初始化默认焦点

    /**
     * 渲染医生信息
     */
    renderDoctorInfo: function () {
        var doctorInfo = doctorDetailController.doctorInfo;
        // 医生头像
        var avatarUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, doctorInfo.doc_id, doctorInfo.avatar_url, RenderParam.carrierId);
        G("avatar").setAttribute("src", avatarUrl);
        // 医生在线状态
        G("status").setAttribute("src", doctorDetailController.getDoctorStatusImage(doctorInfo.online_state,doctorInfo.today_recommend));
        // 医生推荐状态
        G('doctor-recommend').innerHTML = doctorDetailController.getDoctorRecommendImage(doctorInfo.today_recommend);
        // 医生名字
        G("name").innerHTML = doctorInfo.doc_name;
        // 医生所在医院
        G("hospital").innerHTML = doctorInfo.hospital;
        // 医生职位
        G("position").innerHTML = "职称：<span>" + doctorInfo.job_title + "</span>";
        // 医生所属科室
        G("department").innerHTML = "科室：<span>" + doctorInfo.department + "</span>";
        // 医生接诊次数
        G("reception-times").innerHTML = "已问诊" + LMEPG.Inquiry.p2pApi.switchInquiryNumStr(doctorInfo.inquiry_num);
        // 医生简介
        G("doctor-desc-detail").innerHTML = doctorInfo.intro_desc;
    },

    /**
     * 渲染医生问诊方式
     */
    renderInquiryTypeList: function () {
        var inquiryTypeList = doctorDetailController.inquiryTypeList;
        var _html = '';
        var _buttons = [];
        for (var i = 0; i < inquiryTypeList.length; i++) {
            var inquiryTypeItem = inquiryTypeList[i];
            // 判断当前方式是否显示
            if (inquiryTypeItem.is_show === '1') {
                // 判断当前方式显示可用
                var isInquiryTypeEnable = doctorDetailController.isInquiryTypeEnable(inquiryTypeItem);
                _html += '<li>';
                if (isInquiryTypeEnable) {
                    // 当前医生支持当前问诊方式，问诊方式按钮正常使用
                    _html += '<img id="' + INQUIRY_TYPE_ITEM_PREFIX + i + '" src="' + RenderParam.fsUrl + inquiryTypeItem.online_focus_out + '" alt="">';
                    _buttons.push({
                        id: INQUIRY_TYPE_ITEM_PREFIX + i,
                        name: '问诊方式-' + i,
                        type: 'img',
                        nextFocusUp: i === 0 ? '' : doctorDetailController.findNextUpInquiry(i -1),
                        nextFocusDown: i=== inquiryTypeList.length - 1 ? '' :  doctorDetailController.findNextDownInquiry(i + 1),
                        backgroundImage: RenderParam.fsUrl + inquiryTypeItem.online_focus_out,
                        focusImage: RenderParam.fsUrl + inquiryTypeItem.online_focus_in,
                        inquiryType: inquiryTypeItem.inquiry_type,
                        click: doctorDetailController.clickInquiry,
                    });
                    if (doctorDetailView.defaultFocusId === '') {
                        doctorDetailView.defaultFocusId = INQUIRY_TYPE_ITEM_PREFIX + i;
                    }
                } else {
                    // 问诊按钮禁止使用
                    _html += '<img id="' + INQUIRY_TYPE_ITEM_PREFIX + i + '" src="' + RenderParam.fsUrl + inquiryTypeItem.outline_img + '" alt="">';
                }
                _html += '</li>';
            }
        }
        // 添加页面元素
        G('inquiry-type-container').innerHTML = _html;
        // 添加按钮
        LMEPG.ButtonManager.addButtons(_buttons);
        // 聚焦页面焦点
        LMEPG.ButtonManager.requestFocus(doctorDetailView.defaultFocusId);
    },

    /**
     * 医生详情数据获取失败
     */
    showGetDoctorDetailFail: function () {
        LMEPG.UI.showToast("获取医生详情失败");
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
                doctorDetailController.routeOrderVIP();
            },                                                   // 弹窗点击确定的回调事件
        }
        // 弹窗提示购买VIP才能继续发起问诊
        modal.commonDialog(dialogConfig, '', NO_INQUIRY_TIME_TIPS, '');
    },

    /**
     * 问诊时医生离线提示
     */
    showDoctorOfflineTips: function () {
        LMEPG.UI.showToast('当前医生不在线');
    },

    /**
     * 问诊忙碌提示
     * @param buttonId 触发弹窗的按钮ID
     */
    showInquiryBusyTips: function (buttonId) {
        var tips1 = '当前排队用户较多，等待时间过长，建议您';
        var tips2 = '选择其他医生进行咨询，或稍后再来！';
        modal.textDialogWithSure({beClickBtnId: buttonId, onClick: modal.hide}, "", tips1, tips2);
    }
};

/** 医生详情控制逻辑 */
var doctorDetailController = {

    doctorInfo: null, // 医生信息

    inquiryTypeList: null, // 问诊方式列表

    inquiryButtonId: '', // 问诊方式Id

    init: function () {
        // 1、获取医生详情
        LMEPG.Inquiry.p2pApi.getDoctorDetail(RenderParam.docId, function (doctorDetailData) {
            if (doctorDetailData === null || doctorDetailData.code.toString() !== '0') {
                doctorDetailView.showGetDoctorDetailFail();
            } else {
                // 1、缓存数据
                doctorDetailController.doctorInfo = doctorDetailData.doc_info;
                doctorDetailController.inquiryTypeList = doctorDetailData.inquiry_type_list;
                // 2、渲染医生信息
                doctorDetailView.renderDoctorInfo();
                // 3、渲染医生问诊方式
                doctorDetailView.renderInquiryTypeList();
            }
        });
        // 2、初始化焦点方案，监听遥控器返回按键使能
        LMEPG.ButtonManager.init(doctorDetailView.defaultFocusId, [], '', true);
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
                statusImage = 'offline_status.png';
                break;
            case '3': // 在线
                statusImage = 'online_status.png';
                break;
            case '2': // 忙碌
                if (today_recommend === '2') {
                    statusImage = 'online_status.png';
                } else {
                    statusImage = 'busy_status.png';
                }
                break;
            case '4': // 假忙碌
                statusImage = 'busy_status.png';
                break;
            default:
                statusImage = 'offline_status.png';
                break;
        }
        return g_appRootPath + '/Public/img/hd/DoctorP2P/V10/' + statusImage;
    },

    /**
     * 根据医生推荐状态获取显示的图像
     * @param today_recommend 推荐状态
     */
    getDoctorRecommendImage: function (today_recommend) {
        var html = '';
        switch (today_recommend) {
            case '1': // 今日推荐
                html += '<img src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V10/recommend_line.png' + '" alt="今日推荐" style="margin-top: 27px">';
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
     * 问诊方式点击事件监听
     * @param button 问诊方式项
     */
    clickInquiry: function (button) {

        if (button.inquiryType === LMEPG.Inquiry.p2p.InquiryType.WE_CHAT_TELETEXT) { // 微信图文弹窗显示即可
            LMEPG.Inquiry.p2p.startWeChatTeletextInquiry(RenderParam.teletextInquiryUrl + doctorDetailController.doctorInfo.doc_id, RenderParam.cwsHlwyyUrl, button.id);
            return;
        }

        // 假忙碌状态显示
        if (doctorDetailController.doctorInfo.online_state === FAKE_BUSY_FLAG) {
            doctorDetailView.showInquiryBusyTips(button.id);
            return;
        }

        var doctorDetailIntent = LMEPG.Intent.createIntent('doctorDetails');
        doctorDetailIntent.setParam('doc_id', RenderParam.docId);

        // 组装问诊信息参数
        var inquiryInfo = {
            userInfo: {
                isVip: RenderParam.isVip,                                    // 用户身份信息标识
                accountId: RenderParam.userAccount,                          // IPTV业务账号
            },
            memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
            moduleInfo: {
                moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                focusId: button.id,                                          // 当前页面的焦点Id
                intent: doctorDetailIntent,                                  // 当前模块页面路由标识
            },
            doctorInfo: doctorDetailController.doctorInfo,
            serverInfo: {
                cwsHlwyyUrl: RenderParam.cwsHlwyyUrl,                        // cws互联网医院模块链接地址
                teletextInquiryUrl: RenderParam.teletextInquiryUrl,          // 微信图文问诊服务器链接地址
            },
            blacklistHandler: doctorDetailView.showBlacklistUserTips,        // 校验用户黑名单时处理函数
            noTimesHandler: doctorDetailView.showNoInquiryTimesTips,         // 检验普通用户无问诊次数处理函数
            doctorOfflineHandler: doctorDetailView.showDoctorOfflineTips,    // 检验医生离线状态时处理函数
            inquiryEndHandler: doctorDetailController.inquiryEndHandler,     // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryType: button.inquiryType,                                 // 触发问诊的问诊方式
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        }

        doctorDetailController.inquiryButtonId = button.id;

        // 开始触发问诊
        LMEPG.Inquiry.p2p.startInquiry(inquiryInfo);
    },

    /**
     * 检测问诊结束以后android端回调JS端的处理函数
     * @param inquiryEndData 回调时携带的参数
     */
    inquiryEndHandler: function (inquiryEndData) {
        console.log("inquiryEndHandler - data - " + inquiryEndData);
    },

    /**
     * 查询当前焦点指向的下一焦点
     * @param indexStart 问诊方式的起始小标
     * @returns {string} 问诊方式的id
     */
    findNextDownInquiry: function (indexStart) {
        var inquiryTypeItemId = '';
        for (var i = indexStart; i < doctorDetailController.inquiryTypeList.length; i++) {
            var inquiryTypeItem = doctorDetailController.inquiryTypeList[i];
            // 判断当前方式显示可用
            if (doctorDetailController.isInquiryTypeEnable(inquiryTypeItem)) {
                inquiryTypeItemId = INQUIRY_TYPE_ITEM_PREFIX + i;
                break;
            }
        }
        return inquiryTypeItemId;
    },

    /**
     * 查询当前焦点指向的下一焦点
     * @param indexStart 问诊方式的起始小标
     * @returns {string} 问诊方式的id
     */
    findNextUpInquiry: function (indexStart) {
        var inquiryTypeItemId = '';
        for (var i = indexStart; i >= 0; i--) {
            var inquiryTypeItem = doctorDetailController.inquiryTypeList[i];
            // 判断当前方式显示可用
            if (doctorDetailController.isInquiryTypeEnable(inquiryTypeItem)) {
                inquiryTypeItemId = INQUIRY_TYPE_ITEM_PREFIX + i;
                break;
            }
        }
        return inquiryTypeItemId;
    },

    /**
     * 查询当前医生状态是否支持某种问诊方式
     * @param inquiryType 问诊方式对象
     * @returns {boolean}
     */
    isInquiryTypeEnable: function (inquiryType) {
        var doctorInfo = doctorDetailController.doctorInfo;
        var isInquiryTypeEnable = false;
        switch (inquiryType.inquiry_type) {
            case LMEPG.Inquiry.p2p.InquiryType.VIDEO: // 电视视频问诊方式
                isInquiryTypeEnable = doctorInfo.is_video_inquiry === '1';
                break;
            case LMEPG.Inquiry.p2p.InquiryType.TV_PHONE: // 电视电话问诊方式
                isInquiryTypeEnable = doctorInfo.is_tv_phone_inquiry === '1';
                break;
            case LMEPG.Inquiry.p2p.InquiryType.WE_CHAT_VIDEO: // 微信视频问诊方式
                isInquiryTypeEnable = doctorInfo.is_wx_video_inquiry === '1';
                break;
            case LMEPG.Inquiry.p2p.InquiryType.WE_CHAT_TELETEXT: // 微信图文问诊方式
                isInquiryTypeEnable = doctorInfo.is_im_inquiry === '1';
                break;
        }
        return isInquiryTypeEnable;
    },

    /**
     * 跳转订购页面
     */
    routeOrderVIP: function () {
        // --------上报局方使用模块数据 start--------
        if(RenderParam.carrierId === "10000051") {
            var clickTime = new Date().getTime();
            var deltaTime = Math.round((clickTime - initTime) / 1000);
            var postData = {
                "type": 7,
                "operateResult": "在线问诊",
                "stayTime":  deltaTime
            };
            LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", postData, LMEPG.emptyFunc, LMEPG.emptyFunc);
        }
        // --------上报局方使用模块数据 end--------
        // 当前页面
        var doctorDetailIntent = LMEPG.Intent.createIntent('doctorDetails');
        doctorDetailIntent.setParam('doc_id', RenderParam.docId);

        // 订购页面
        var orderPageIntent = LMEPG.Intent.createIntent("orderHome");
        orderPageIntent.setParam("remark", "视频问诊");

        // 跳转页面
        LMEPG.Intent.jump(orderPageIntent, doctorDetailIntent);
    }
};

/** 医生详情数据交互逻辑 */
var doctorDetailModel = {}