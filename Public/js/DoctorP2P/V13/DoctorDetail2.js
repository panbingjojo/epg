/** 常量定义区域 - start  */

var GET_DOCTOR_DETAIL_FAIL_TIPS = '获取医生详情数据失败!'; // 医生列表请求链接

var MODULE_IMAGE_PATH = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/'; // 当前模块的图片路径

var SCROLL_BAR_MOVE_STEP = 20; // 滚动条移动步长

var NO_INQUIRY_TIME_TIPS = "您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊"; // 普通用户问诊时无问诊次数文案提示

var VIP_NO_INQUIRY_TIME_TIPS = "尊敬的健康尊享会员<br>您本月问诊次数已耗尽，下月可继续问诊";

var BLACKLIST_USER_TIPS = "您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。"; // 问诊时检测用户黑名单时提示

var COLLECT_DOCTOR_TYPE = 3; // 收藏医生的类型

var IS_HAI_KAN_PLATFORM = RenderParam.carrierId === '371002' || RenderParam.carrierId === '371092'; // 是否海看平台，海看平台需要上报探针日志

var ONE_LINE_SHOW_INQUIRY_TYPES = 2; // 单行展示问诊方式数量

var TOTAL_INQUIRY_TYPES = 4; // 目前所有平台支持的问诊方式数量

var INQUIRY_TYPE_ITEM_PREFIX = 'inquiry-type-'; // 问诊方式定义前缀

/** 常量定义区域 - end  */

/** 医生详情 - 页面渲染 */
var doctorDetailView = {

    videoInquiry: 'video-inquiry',      // 电视视频
    tvPhoneInquiry: 'tv-phone-inquiry', // 电视电话
    weChatTeletext: 'we-chat-teletext', // 微信图文
    weChatVideo: 'we-chat-video',       // 微信视频
    collect: 'collect',                 // 收藏
    scrollBar: 'scroll-bar',            // 滚动条

    defaultFocusId: '',               // 初始化时获得焦点的问诊方式

    buttons: [],                        // 页面交互焦点

    isShowScrollBar: 0,                 // 是否显示医生简介滚动条

    roll: null,                         // 滚动条滚动对象

    isDoctorCollected: false,           // 当前医生是否处于收藏状态

    /**
     * 渲染医生信息
     */
    renderDoctorInfo: function () {
        var doctorData = doctorDetailController.doctorData;
        var doctorInfo = doctorData.doc_info;
        // 医生头像
        var defaultDoctorAvatar = g_appRootPath + '/Public/img/Common/default.png';
        var doctorAvatarUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, doctorInfo.doc_id, doctorInfo.avatar_url, RenderParam.carrierId);
        G('doctor-pic').innerHTML = '<img onerror="this.src=\'' + defaultDoctorAvatar + '\'" src=' + doctorAvatarUrl + ' alt="医生头像"/>';
        // 医生推荐状态
        G('doctor-recommend').innerHTML = doctorDetailController.getDoctorRecommendImage(doctorInfo.today_recommend);
        // 医生在线状态
        G('doctor-status').src = doctorDetailController.getDoctorStatusImage(doctorInfo.online_state,doctorInfo.today_recommend);
        // 医生姓名
        G('doctor-name').innerHTML = doctorInfo.doc_name;
        // 医生所在科室
        G('doctor-department').innerHTML = doctorInfo.department;
        // 医生职称
        G('doctor-job-title').innerHTML = doctorInfo.job_title;
        // 医生问诊数量
        G('doctor-reception-times').innerHTML = '问诊量：' + doctorInfo.inquiry_num;

        // 渲染医生问诊方式
        var inquiryTypeList = doctorData.inquiry_type_list;
        // 循环遍历问诊方式列表
        for (var i = 0; i < inquiryTypeList.length; i++) {
            // 获取当前问诊方式
            var inquiryTypeItem = inquiryTypeList[i];
            // 判断当前方式是否显示
            if (inquiryTypeItem.is_show === '1') {
                // 判断当前方式显示可用
                var isInquiryTypeEnable = false;
                switch (inquiryTypeItem.inquiry_type.toString()) {
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

                var _html = '';
                if (isInquiryTypeEnable) {
                    // 当前医生支持当前问诊方式，问诊方式按钮正常使用
                    _html = '<img id="' + INQUIRY_TYPE_ITEM_PREFIX + i + '" src="' + RenderParam.fsUrl + inquiryTypeItem.online_focus_out + '" alt="">';
                    doctorDetailView.buttons.push({
                        id: INQUIRY_TYPE_ITEM_PREFIX + i,
                        name: '问诊方式-' + i,
                        type: 'img',
                        nextFocusLeft: INQUIRY_TYPE_ITEM_PREFIX + (i - 1),
                        nextFocusRight: INQUIRY_TYPE_ITEM_PREFIX + (i + 1),
                        backgroundImage: RenderParam.fsUrl + inquiryTypeItem.online_focus_out,
                        focusImage: RenderParam.fsUrl + inquiryTypeItem.online_focus_in,
                        inquiryType: inquiryTypeItem.inquiry_type.toString(),
                        click: doctorDetailController.clickInquiry,
                        beforeMoveChange: doctorDetailView.onInquiryItemMove,
                        isInquiryTypeEnable: isInquiryTypeEnable,
                    });
                    if (doctorDetailView.defaultFocusId === '') {
                        doctorDetailView.defaultFocusId = INQUIRY_TYPE_ITEM_PREFIX + i;
                    }
                } else {
                    // 问诊按钮禁止使用
                    _html = '<img id="' + INQUIRY_TYPE_ITEM_PREFIX + i + '" src="' + RenderParam.fsUrl + inquiryTypeItem.outline_img + '" alt="">';
                }
                if (i < ONE_LINE_SHOW_INQUIRY_TYPES) {
                    // 如果落在第一行
                    G('inquiry-wrap-1').innerHTML += _html;
                } else {
                    // 如果落在第二行
                    G('inquiry-wrap-2').innerHTML += _html;
                }
            }

        }
    },

    /**
     * 渲染医生简介
     */
    renderDoctorIntro: function () {
        var doctorData = doctorDetailController.doctorData;
        var doctorInfo = doctorData.doc_info;
        var skill = doctorInfo.good_disease ? doctorInfo.good_disease : '-';
        var _html = '';
        _html += '<p id="text-skill">' + '擅长：' + skill + '</p>';
        _html += '<br>';
        _html += '<br>';
        _html += '<p id="text-intro">' + '简介：' + doctorInfo.intro_desc + '</p>';
        G('intro-wrap').innerHTML = _html;
        doctorDetailView.roll = lmUtils.roll('scroll-bar', 'scroll-wrap', 'intro-wrap', SCROLL_BAR_MOVE_STEP);
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
        var isVip = RenderParam.isVip == '1'
        var dialogConfig = {
            beClickBtnId: pageFocusId, // 弹窗消失后，页面获得的焦点
            onClick: function () {
                modal.hide();
                if(!isVip)
                    doctorDetailController.routeOrderVIP();
            },                                                   // 弹窗点击确定的回调事件
        }
        // 弹窗提示购买VIP才能继续发起问诊
        modal.commonDialog(dialogConfig, '',isVip?VIP_NO_INQUIRY_TIME_TIPS:NO_INQUIRY_TIME_TIPS, '');
    },

    /**
     * 问诊时医生离线提示
     */
    showDoctorOfflineTips: function () {
        LMEPG.UI.showToast('当前医生不在线');
    },

    /**
     * 医生详情信息获取失败提示
     */
    showDoctorDetailGetFail: function () {
        LMEPG.UI.showToast(GET_DOCTOR_DETAIL_FAIL_TIPS);
        // LMEPG.Intent.back();
    },

    /**
     * 初始化焦点按钮
     */
    initButtons: function () {
        // 获取数据
        if (parseInt(RenderParam.isShowCollect) === 1) { // 当前地区支持收藏医生功能
            var inquiryButtonsLength = doctorDetailView.buttons.length;
            doctorDetailView.buttons.push({
                id: doctorDetailView.collect,
                name: '收藏',
                type: 'img',
                backgroundImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collect.png',
                focusImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collect_f.png',
                nextFocusRight: doctorDetailView.scrollBar,
                click: doctorDetailController.clickCollect,
                focusChange: doctorDetailView.collectFocusChange,
                beforeMoveChange: doctorDetailView.onCollectMove,
            });
            if (doctorDetailView.defaultFocusId === '') { // 当前地区支持显示收藏
                doctorDetailView.defaultFocusId = doctorDetailView.collect;
            }
        }

        // if (doctorDetailView.isShowScrollBar) { // 当前医生简介内容过长需要显示滚动条
        doctorDetailView.buttons.push({
            id: doctorDetailView.scrollBar,
            name: '滚动条',
            type: 'img',
            nextFocusLeft: doctorDetailView.collect,
            focusChange: doctorDetailView.scrollBarFocusChange,
            beforeMoveChange: doctorDetailView.onScrollBarMove
        });
        if (doctorDetailView.defaultFocusId === '') { // 当前医生简介内容过长需要显示滚动条
            doctorDetailView.defaultFocusId = doctorDetailView.scrollBar;
        }
        // }

        LMEPG.ButtonManager.init(doctorDetailView.defaultFocusId, doctorDetailView.buttons, '', true);
    },

    /**
     * 收藏按钮状态焦点改变事件
     * @param button 收藏按钮
     * @param hasFocus 当前按钮是否获得焦点
     */
    collectFocusChange: function (button, hasFocus) {
        var normalImage = '';
        var focusImage = '';
        if (doctorDetailView.isDoctorCollected) {
            normalImage = MODULE_IMAGE_PATH + 'collected.png';
            focusImage = MODULE_IMAGE_PATH + 'collected_f.png';
        } else {
            normalImage = MODULE_IMAGE_PATH + 'collect.png';
            focusImage = MODULE_IMAGE_PATH + 'collect_f.png';
        }
        if (hasFocus) {
            G(doctorDetailView.collect).src = focusImage;
        } else {
            G(doctorDetailView.collect).src = normalImage;
        }
    },

    /**
     * 根据医生状态显示当前医生的收藏状态
     */
    showDoctorCollectStatus: function () {
        if (doctorDetailView.isDoctorCollected) {
            G(doctorDetailView.collect).src = MODULE_IMAGE_PATH + 'collected.png';
        } else {
            G(doctorDetailView.collect).src = MODULE_IMAGE_PATH + 'collect.png';
        }
    },

    /**
     * 提示操作收藏按钮结果
     */
    showUpdateCollectStatusResult: function () {
        var tipsMessage = doctorDetailView.isDoctorCollected ? '收藏成功' : '取消收藏成功';
        LMEPG.UI.showToast(tipsMessage);
    },


    /**
     * 滚动条获得焦点事件
     * @param button 滚动条
     * @param hasFocus 是否获得焦点
     */
    scrollBarFocusChange: function (button, hasFocus) {
        var btnElement = G(button.id);
        if (hasFocus) {
            btnElement.style.backgroundColor = '#ef0b2c';
        } else {
            btnElement.style.backgroundColor = '#efa8aa';
        }
    },

    /**
     * 滚动条焦点移动监听
     * @param moveDirection 移动方向
     * @param button 滚动条焦点对象
     */
    onScrollBarMove: function (moveDirection, button) {
        if (moveDirection === 'up') {
            doctorDetailView.roll.up();
        } else if (moveDirection === 'down') {
            doctorDetailView.roll.down();
        }
    },

    /**
     * 检测到医生处于假忙碌状态时的提示信息
     * @param buttonId 触发弹窗的按钮
     */
    showFakeBusyTips: function (buttonId) {
        var tips1 = '当前排队用户较多，等待时间过长，建议您';
        var tips2 = '选择其他医生进行咨询，或稍后再来！';
        modal.textDialogWithSure({beClickBtnId: buttonId, onClick: modal.hide}, "", tips1, tips2);
    },

    /**
     * 问诊方式移动事件监听
     * @param direction 移动方向
     * @param button 移动按钮
     */
    onInquiryItemMove: function (direction, button) {
        switch (direction) {
            case 'up':
                if (button.id === (INQUIRY_TYPE_ITEM_PREFIX + "2")) {
                    if (LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "0").isInquiryTypeEnable) {
                        LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "0");
                    } else if (LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "1").isInquiryTypeEnable) {
                        LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "1");
                    }
                } else if (button.id === (INQUIRY_TYPE_ITEM_PREFIX + "3")) {
                    if (LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "1").isInquiryTypeEnable) {
                        LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "1");
                    }else if (LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "0").isInquiryTypeEnable) {
                        LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "0");
                    }
                }
                break;
            case 'down':
                var inquiryType2 = LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "2");
                var inquiryType3 = LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "3");
                if (button.id === (INQUIRY_TYPE_ITEM_PREFIX + "0")) {
                    if (inquiryType2 && inquiryType2.isInquiryTypeEnable) {
                        LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "2");
                    } else if (inquiryType3 && inquiryType3.isInquiryTypeEnable) {
                        LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "3");
                    } else if (parseInt(RenderParam.isShowCollect) === 1) {
                        LMEPG.ButtonManager.requestFocus(doctorDetailView.collect);
                    }
                } else if (button.id === (INQUIRY_TYPE_ITEM_PREFIX + "1")) {
                    if (inquiryType3 && inquiryType3.isInquiryTypeEnable) {
                        LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "3");
                    } else if (inquiryType2 && inquiryType2.isInquiryTypeEnable) {
                        LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "2");
                    } else if (parseInt(RenderParam.isShowCollect) === 1) {
                        LMEPG.ButtonManager.requestFocus(doctorDetailView.collect);
                    }
                } else if ( (button.id === (INQUIRY_TYPE_ITEM_PREFIX + "2") || button.id === (INQUIRY_TYPE_ITEM_PREFIX + "3") ) && parseInt(RenderParam.isShowCollect) === 1) {
                    LMEPG.ButtonManager.requestFocus(doctorDetailView.collect);
                }
                break;
        }
    },

    /**
     * 收藏按钮移动事件监听
     * @param direction 移动方向
     * @param button 收藏按钮
     */
    onCollectMove: function (direction,button) {
        if (direction === 'up') {
            var inquiryItem2 = LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "2");
            if (inquiryItem2 && inquiryItem2.isInquiryTypeEnable) {
                LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "2");
            } else if (LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "3") && LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "3").isInquiryTypeEnable) {
                LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "3");
            } else if (LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "0") && LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "0").isInquiryTypeEnable){
                LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "0");
            } else if (LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "1") && LMEPG.ButtonManager.getButtonById(INQUIRY_TYPE_ITEM_PREFIX + "1").isInquiryTypeEnable) {
                LMEPG.ButtonManager.requestFocus(INQUIRY_TYPE_ITEM_PREFIX + "1");
            }
        }
    }
};

/** 医生详情 - 控制器 */
var doctorDetailController = {

    doctorData: null,          // 医生详情对象
    scrollBarMoveFocusId: '',  // 滚动条返回焦点按钮
    leftAskTime:0,

    /**
     * 初始化页面，主要是获取医生详情数据
     */
    init: function () {
        // 获取医生详情
        LMEPG.Inquiry.p2pApi.getDoctorDetail(RenderParam.doctorId, function (doctorData) {
            if (doctorData == null) {
                // 显示获取医生详情失败
                doctorDetailView.showDoctorDetailGetFail();
            } else {
                doctorData = doctorData instanceof Object ? doctorData : JSON.parse(doctorData);
                if (doctorData.code === 0 || doctorData.code === '0') {
                    // 缓存医生详情
                    doctorDetailController.doctorData = doctorData;
                    // 渲染医生信息
                    doctorDetailView.renderDoctorInfo();
                    // 渲染医生简介
                    doctorDetailView.renderDoctorIntro();
                    // 查询医生收藏状态
                    if (parseInt(RenderParam.isShowCollect) === 1) {
                        doctorDetailModel.getCollectDoctorList(doctorDetailController.getCollectDoctorListHandler);
                    } else {
                        doctorDetailView.initButtons();
                    }
                    // 山东海看上报页面路由探针日志
                    if (IS_HAI_KAN_PLATFORM) {
                        doctorDetailModel.HaiKanClickHoleStat('');
                    }
                } else {
                    // 显示获取医生详情失败
                    doctorDetailView.showDoctorDetailGetFail();
                }
            }
        })

        this.difAreaHandle()
    },

    difAreaHandle:function(){
        if(RenderParam.carrierId === '440001'){
            LMEPG.ajax.postAPI("Doctor/getFreeInquiryTimes",{}, function (data) {
                G('ask-left-time').style.display = 'block'
                doctorDetailController.leftAskTime = data.remain_count
                if(data.remain_count > 0){
                    G('ask-left-time').innerHTML = (RenderParam.isVip == 1?'尊敬的健康尊享会员，您的问诊次数剩余'+data.remain_count+'次'
                        :'尊敬的用户，你的免费体验问诊次数剩余'+data.remain_count+'次')
                }else {
                    G('ask-left-time').innerHTML = RenderParam.isVip == 1?
                        '尊敬的健康尊享会员，您本月问诊次数已耗尽，下月可继续问诊':'您的体验问诊次数已用完，成为VIP会员，尊享30次在线问医权益'
                }
            })
        }
    },

    /**
     * 电视视频、电视电话、微信视频问诊功能
     * @param button 电视视频、电视电话、微信视频各自对应的按钮
     */
    clickInquiry: function (button) {

        if (doctorDetailController.doctorData.doc_info.online_state === "4") {
            doctorDetailView.showFakeBusyTips(button.id);
            return;
        }

        var clickId = '';
        if (button.inquiryType === LMEPG.Inquiry.p2p.InquiryType.VIDEO) { // 电视视频
            clickId = "39JKYS-DSSP";
        } else if (button.inquiryType === LMEPG.Inquiry.p2p.InquiryType.TV_PHONE) { // 电视电话
            clickId = "39JKYS-DSDH";
        } else if (button.inquiryType === LMEPG.Inquiry.p2p.InquiryType.WE_CHAT_VIDEO) {  // 微信视频
            clickId = "39JKYS-WXSP";
        } else if (button.inquiryType === LMEPG.Inquiry.p2p.InquiryType.WE_CHAT_TELETEXT) { // 微信图文
            clickId = "39JKYS-WXTW";
        }
        // 山东电信海看平台统计点击事件
        if (IS_HAI_KAN_PLATFORM) {
            doctorDetailModel.HaiKanClickHoleStat(clickId);
        }

        if (button.inquiryType === LMEPG.Inquiry.p2p.InquiryType.WE_CHAT_TELETEXT) { // 微信图文弹窗显示即可
            LMEPG.Inquiry.p2p.startWeChatTeletextInquiry(RenderParam.teletextInquiryUrl + doctorDetailController.doctorData.doc_info.doc_id, RenderParam.cwsHlwyyUrl, button.id);
            return;
        }

        // 组装问诊信息参数
        var inquiryInfo = {
            userInfo: {
                isVip: RenderParam.sDemoId !== '' ? 1 : RenderParam.isVip,   // 用户身份信息标识
                accountId: RenderParam.accountId,                            // IPTV业务账号
            },
            memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
            moduleInfo: {
                moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                focusId: button.id,                                          // 当前页面的焦点Id
                intent: doctorDetailController.getPageIntent(),              // 当前模块页面路由标识
            },
            doctorInfo: doctorDetailController.doctorData.doc_info,
            serverInfo: {
                cwsHlwyyUrl: RenderParam.cwsHlwyyUrl,                        // cws互联网医院模块链接地址
                teletextInquiryUrl: RenderParam.teletextInquiryUrl,          // 微信图文问诊服务器链接地址
            },
            blacklistHandler: doctorDetailView.showBlacklistUserTips,        // 校验用户黑名单时处理函数
            noTimesHandler: doctorDetailView.showNoInquiryTimesTips,         // 检验普通用户无问诊次数处理函数
            doctorOfflineHandler: doctorDetailView.showDoctorOfflineTips,    // 检验医生离线状态时处理函数
            inquiryEndHandler: doctorDetailController.inquiryEndHandler,     // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryType: button.inquiryType,                                 // 触发问诊的问诊方式
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊
            leftTime: doctorDetailController.leftAskTime
        }
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
     * 收藏按钮点击事件
     */
    clickCollect: function () {
        doctorDetailModel.updateDoctorCollectStatus();
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
                statusImage = 'busy_line.png';
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
     * 查询收藏医生列表处理函数，判断当前医生是否已经收藏
     * @param collectDoctorListData 当前用户收藏的医生列表
     */
    getCollectDoctorListHandler: function (collectDoctorListData) {
        var doctorId = doctorDetailController.doctorData.doc_info.doc_id;
        for (var i = 0; i < collectDoctorListData.length; i++) {
            if (doctorId === collectDoctorListData[i].doctor_id) {
                doctorDetailView.isDoctorCollected = true;
                break;
            }
        }
        doctorDetailView.showDoctorCollectStatus();
        // 初始化相关焦点
        doctorDetailView.initButtons();
    },

    /**
     * 更新医生收藏状态处理函数
     */
    updateDoctorCollectStatusHandler: function () {
        doctorDetailView.isDoctorCollected = !doctorDetailView.isDoctorCollected;
        doctorDetailView.showUpdateCollectStatusResult();
        LMEPG.ButtonManager.requestFocus(doctorDetailView.collect);
    },

    /**
     * 当前模块路由对象，用作其他页面返回
     */
    getPageIntent: function () {
        var intent = LMEPG.Intent.createIntent('doctorDetails');
        intent.setParam('doctorIndex', RenderParam.doctorId);
        intent.setParam('s_demo_id', RenderParam.sDemoId);
        return intent;
    },

    /**
     * 路由订购页面
     */
    routeOrderVIP: function () {
        if (RenderParam.carrierId === "320001") {
            var PayInfo = {
                "returnPageName": RenderParam.returnPageName,
            };
            Pay.buildPayInfo(PayInfo);
            return;
        }

        if (RenderParam.carrierId === "05001110") {
            Pay.doPay05001110();
            return;
        }

        modal.hide();
        var objCurrent = doctorDetailController.getPageIntent();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        if(RenderParam.carrierId === "370002" || RenderParam.carrierId === "370092"){
            jumpObj.setParam('isNewPay', '1');
        }
        LMEPG.Intent.jump(jumpObj, objCurrent);
    }
};

var Pay = {
    doPay05001110:function () {
        if(RenderParam.accountId[0] == '1' && RenderParam.accountId.length == 11){
            Pay.directOrder();
        }else {
            LMAndroid.onGetDeviceInfoCallbackUI = function (resParam, notifyAndroidCallback) {
                LMEPG.Log.info("doGetUserId:" + resParam);
                var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
                if(resParamObj.userAccount[0] == '1' && resParamObj.userAccount.length == 11){
                    RenderParam.accountId = resParamObj.userAccount;
                    Pay.authOrder(resParamObj);
                }else {
                    LMAndroid.jsCallAndroid('doLogin', "", '');
                }
            };
            LMAndroid.jsCallAndroid('doGetUserId', "", 'LMAndroid.AndroidCallJS.onGetDeviceInfoCallback');
        }
    },

    authOrder:function (param) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI("Pay/getProductInfo",null,function (res) {
            LMAndroid.JSCallAndroid.doUserTypeAuth(JSON.stringify(res), function (resParam, notifyAndroidCallback) {
                LMEPG.Log.info("Splash页鉴权结果:" + resParam);
                var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
                var authData = {};
                authData.vipState = resParamObj.result == 1?resParamObj.result:0;
                authData.msg = encodeURIComponent(resParamObj.data);
                authData.userAccount = param.userAccount;
                LMEPG.AuthUser.authByNetwork(authData, function () {
                    if(authData.vipState == 1){
                        doctorDetailController.clickInquiry(LMEPG.BM.getCurrentButton());
                    }else{
                        Pay.directOrder();
                    }
                },function () {
                    LMEPG.UI.showToast("登录失败", 1);
                    LMEPG.UI.dismissWaitingDialog();
                });
            });
        });
    },

    directOrder:function () {
        LMEPG.ajax.postAPI("Pay/buildPayUrl",null,function (payRes) {
            if(payRes.result == 0){
                LMEPG.ajax.postAPI("Pay/getProductInfo",null,function (res) {
                    LMAndroid.JSCallAndroid.doPay(JSON.stringify(res), function (resParam, notifyAndroidCallback) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.Log.info("doPay 订购结果:" + resParam);
                        var resParamObj = resParam instanceof Object ? resParam : JSON.parse(resParam);
                        if(resParamObj.result == 1){
                            LMEPG.ajax.postAPI("Pay/uploadPayResult", payRes, function (rsp) {
                                LMEPG.Log.info("doPay uploadPayResult result = "+JSON.stringify(rsp))
                                if (rsp.result == '0') {
                                    RenderParam.isVip = 1;
                                    LMEPG.UI.showToast("支付成功!",1);
                                } else {
                                    LMEPG.UI.showToast("上传订购结果失败", 1);
                                }
                            });
                        }
                    });
                });
            }else {
                LMEPG.UI.showToast("创建订单失败", 1);
                LMEPG.UI.dismissWaitingDialog();
            }
        });
    }
}

/** 医生详情 - 数据模型 */
var doctorDetailModel = {

    /**
     * 查询当前用户收藏医生的列表
     * @param callback 查询成功的回调函数
     */
    getCollectDoctorList: function (callback) {
        var postData = {
            item_type: COLLECT_DOCTOR_TYPE, // 查询收藏医生的类型
        }
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Collect/getCollectListNew', postData, function (collectDoctorListData) {
            LMEPG.UI.dismissWaitingDialog();
            collectDoctorListData = collectDoctorListData instanceof Object ? collectDoctorListData : JSON.parse(collectDoctorListData);
            if (collectDoctorListData.result === 0 || collectDoctorListData.result === '0') {
                callback(collectDoctorListData.list);
            } else {
                console.log("查询收藏医生列表失败！");
            }
        });
    },

    /**
     * 更改医生收藏状态
     * @param callback 操作成功回调函数
     */
    updateDoctorCollectStatus: function (callback) {
        if (IS_HAI_KAN_PLATFORM) {
            // 山东电信海看上报探针日志
            doctorDetailModel.HaiKanCollectHoleStat();
        }
        var postData = {
            'type': doctorDetailView.isDoctorCollected ? "1" : "0",       // 类型（0收藏 1取消收藏）
            'item_type': COLLECT_DOCTOR_TYPE,                              // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
            'item_id': doctorDetailController.doctorData.doc_info.doc_id            // 收藏对象id
        };
        LMEPG.ajax.postAPI('Collect/setCollectStatusNew', postData, function (collectStatusData) {
            collectStatusData = collectStatusData instanceof Object ? collectStatusData : JSON.parse(collectStatusData);
            if (collectStatusData.result === 0 || collectStatusData.result === "0") {
                doctorDetailController.updateDoctorCollectStatusHandler(collectStatusData);
            } else {
                LMEPG.UI.showToast('操作失败');
            }
        });
    },

    /**
     * 山东海看收藏状态探针上报
     */
    HaiKanCollectHoleStat: function () {
        var turnPageInfo = {
            VODCODE: Detail.docInfo.doc_id,
            VODNAME: Detail.docInfo.doc_name,
            mediastatus: doctorDetailView.isDoctorCollected ? "0" : "1",
            reserve1: null,
            reserve2: null,
            from: "jz3.0"
        };
        ShanDongHaiKan.sendReportData('8', turnPageInfo);
    },

    /**
     * 山东海看点击事件探针上报
     */
    HaiKanClickHoleStat: function (clickId) {
        var turnPageInfo = {
            currentPage: window.location.origin + "/index.php/Home/DoctorP2P/doctorIndexV13",
            turnPage: window.location.href,
            turnPageName: document.title,
            turnPageId: doctorDetailController.doctorData.doc_id,
        };
        if (clickId) {
            turnPageInfo.clickId = clickId;
        }
        ShanDongHaiKan.sendReportData('6', turnPageInfo);
    },

};

/**
 * 遥控器返回事件
 */
function onBack() {
    LMEPG.Intent.back();
}