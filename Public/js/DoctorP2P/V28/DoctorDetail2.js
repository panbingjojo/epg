
var NO_INQUIRY_TIME_TIPS = "您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊"; // 普通用户问诊时无问诊次数文案提示

var BLACKLIST_USER_TIPS = "您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。"; // 问诊时检测用户黑名单时提示

/**
 * 医生详情 - 视图控制层
 */
var doctorDetailView = {

    // 逻辑交互按钮
    buttons: [],

    // 是否显示电视视频
    isShowVideoInquiry: false,
    // 是否显示电视电话
    isShowPhoneInquiry: false,

    // 是否显示滚动条
    isScrollBar: false,

    // 医生自我简介高度
    introHeight: 216,

    /**
     * 视图 - 渲染医生详情
     */
    renderDoctorDetail: function () {
        var avatarUrl = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.cwsHlwyyUrl, doctorDetailController.doctorInfo.doc_id, doctorDetailController.doctorInfo.avatar_url, RenderParam.carrierId);
        G("photo").setAttribute("src", avatarUrl);
        G("status").setAttribute("src", doctorDetailController.getDoctorStatusImage(doctorDetailController.doctorInfo.online_state));
        G("name").innerHTML = doctorDetailController.doctorInfo.doc_name;
        G("hospital").innerHTML = doctorDetailController.doctorInfo.hospital;
        G("position").innerHTML = "职称：<span>" + doctorDetailController.doctorInfo.job_title + "</span>";
        G("department").innerHTML = "<span>" + doctorDetailController.doctorInfo.department + "</span>";
        G("number").innerHTML = "已问诊" + LMEPG.Inquiry.p2pApi.switchInquiryNumStr(doctorDetailController.doctorInfo.inquiry_num);

    },

    /**
     * 视图 - 显示医生自我简介
     */
    renderDoctorIntro: function() {
        G("introduction").innerHTML += doctorDetailController.doctorInfo.intro_desc;

        // 判断是否需要显示滚动条
        if (parseInt(G('introduction').offsetHeight) > doctorDetailView.introHeight) {
            document.getElementsByClassName('doctor_detail')[0].innerHTML += '<img id="scroll_bar" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/scroll_bar.png" alt="">' +
                '        <img id="scroll_bar_f" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V28/scroll_bar_f.png" alt="">';
            doctorDetailView.isShowScrollBar = true;

            // 添加滚动条焦点
            var _buttons = [{
                id: 'scroll_bar_f',
                name: '滚动条',
                type: 'img',
                backgroundImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/scroll_bar_f.png",
                focusImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/scroll_bar_f.png",
                click: '',
                focusChange: "",
                beforeMoveChange: doctorDetailView.scrollIntro,
            }];

            // 添加焦点
            LMEPG.ButtonManager.addButtons(_buttons);
        }
    },

    /**
     * 视图 - 自动滚动医生简介
     * @param direction 移动方向
     * @param button 滚动条
     */
    scrollIntro: function (direction, button) {
        var step = parseInt((G('introduction').offsetHeight - 205) / 43);
        switch (direction) {
            case 'up':
                if (Math.abs(G('introduction').offsetTop - 44) > 43) {
                    G('introduction').style.marginTop = G('introduction').offsetTop - 44 + 43 + 'px';
                    if (Math.abs(G('introduction').offsetTop - 44) < 43) {
                        G('introduction').style.marginTop = 0 + 'px';
                    }
                    G(button.id).style.top = G(button.id).offsetTop - parseInt(109 / step) + 'px';
                    if (Math.abs(G(button.id).offsetTop - 81) < parseInt(109 / step)) {
                        G(button.id).style.top = 81 + 'px';
                    }
                }
                break;
            case 'down':
                if (Math.abs((G('introduction').offsetTop - 44 - 205) + G('introduction').offsetHeight) > 43 ) {
                    G('introduction').style.marginTop = G('introduction').offsetTop - 44 - 43 + 'px';
                    G(button.id).style.top = G(button.id).offsetTop + parseInt(109 / step) + 'px';
                    if (Math.abs(G(button.id).offsetTop - 191) < parseInt(109 / step)) {
                        G(button.id).style.top = 190 + 'px';
                    }
                } else if (doctorDetailView.isShowVideoInquiry) {
                    LMEPG.BM.requestFocus('btn-video-inquiry');
                } else if (doctorDetailView.isShowPhoneInquiry) {
                    LMEPG.BM.requestFocus('btn-phone-inquiry');
                }
                break;
        }
    },

    /**
     * 视图 - 渲染问诊方式
     */
    renderInquiryType: function () {
        var _html = '';
        var _buttons = [];
        var _focusIndex = '';
        if (doctorDetailView.isShowVideoInquiry) {
            _html = '<img id="tv_video_tips" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V28/tv_video_tips.png" alt=""><img id="tv_video_tips_item" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V28/tv_video_tips.gif" alt="">' + '<img id="btn-video-inquiry" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V28/ask_doc_tv_video.png" alt="">';
            _buttons.push({
                id: 'btn-video-inquiry',
                name: '电视视频',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: doctorDetailView.isShowScrollBar ? 'scroll_bar_f' : '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/ask_doc_tv_video.png",
                focusImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/ask_doc_tv_video_f.png",
                click: doctorDetailController.startVideoInquiry,
            });
            _focusIndex = 'btn-video-inquiry';
        } else if (doctorDetailView.isShowPhoneInquiry) {
            _html = '<img id="tv_phone_tips" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V28/tv_phone_tips.png" alt="">' + '<img id="btn-phone-inquiry" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V28/ask_doc_tv_phone.png" alt="">';
            _buttons.push({
                id: 'btn-phone-inquiry',
                name: '电视电话',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: doctorDetailView.isShowScrollBar ? 'scroll_bar_f' : '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/ask_doc_tv_phone.png",
                focusImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V28/ask_doc_tv_phone_f.png",
                click: doctorDetailController.startPhoneInquiry,
            });
            _focusIndex = 'btn-phone-inquiry';
        }
        G('inquiry_mode').innerHTML = _html;
        LMEPG.ButtonManager.addButtons(_buttons);
        LMEPG.ButtonManager.requestFocus(_focusIndex);
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
                doctorDetailController.routeOrderHome();
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
};

/**
 * 医生详情 - 逻辑控制层
 */
var doctorDetailController= {

    // 医生信息
    doctorInfo: null,

    /**
     * 逻辑 - 初始化
     */
    init: function () {
        // 获取医生详情
        LMEPG.Inquiry.p2pApi.getDoctorDetail(RenderParam.docId, function (doctorDetailData) {
            if (doctorDetailData === null || doctorDetailData.code.toString() !== '0') {
                LMEPG.UI.showToast("获取医生详情失败！");
            } else {
                // 缓存数据
                doctorDetailController.doctorInfo = doctorDetailData.doc_info;
                // 渲染医生信息
                doctorDetailView.renderDoctorDetail();
                // 渲染医生简介
                doctorDetailView.renderDoctorIntro();
                // 渲染问诊方式
                if (RenderParam.stbModel === 'E910') {
                    doctorDetailView.isShowPhoneInquiry = true;
                } else {
                    doctorDetailView.isShowVideoInquiry = true;
                }
                doctorDetailView.renderInquiryType();
            }
        });
        // 2、初始化焦点方案，监听遥控器返回按键使能
        LMEPG.ButtonManager.init(doctorDetailView.defaultFocusId, [], '', true);
    },

    /**
     * 逻辑 - 视频问诊
     * @param button 视频问诊按钮
     */
    startVideoInquiry: function(button) {
        LMEPG.Inquiry.p2p.startInquiry(doctorDetailController.createInquiryInfo(button.id, LMEPG.Inquiry.p2p.InquiryType.VIDEO));
    },

    /**
     * 逻辑 - 电话问诊
     * @param button 电话问诊按钮
     */
    startPhoneInquiry: function(button) {
        LMEPG.Inquiry.p2p.startInquiry(doctorDetailController.createInquiryInfo(button.id, LMEPG.Inquiry.p2p.InquiryType.TV_PHONE));
    },

    /**
     * 构建问诊信息
     * @param focusId 触发按钮
     * @param inquiryType 问诊方式
     * @returns 问诊信息对象
     */
    createInquiryInfo: function (focusId, inquiryType) {
        var doctorDetailIntent = LMEPG.Intent.createIntent('doctorDetails');
        doctorDetailIntent.setParam('doc_id', RenderParam.docId);

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
                focusId: focusId,                                            // 当前页面的焦点Id
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
            inquiryType: inquiryType,                                        // 触发问诊的问诊方式
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        };
    },

    /**
     * 检测问诊结束以后android端回调JS端的处理函数
     * @param inquiryEndData 回调时携带的参数
     */
    inquiryEndHandler: function (inquiryEndData) {
        console.log("inquiryEndHandler - data - " + inquiryEndData);
    },

    /**
     * 逻辑 - 跳转计费页
     */
    routeOrderHome: function () {
        // --------上报局方使用模块数据 start--------
        if(RenderParam.carrierId === "10000051") {
            var clickTime = new Date().getTime();
            var deltaTime = Math.round((clickTime - initTime) / 1000);
            var postData = {
                "type": 7,
                "operateResult": "老年版在线问诊",
                "stayTime":  deltaTime
            };
            LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", postData, LMEPG.emptyFunc, LMEPG.emptyFunc);
        }
        // --------上报局方使用模块数据 end--------

        var doctorDetailIntent = LMEPG.Intent.createIntent('doctorDetails');
        doctorDetailIntent.setParam('doc_id', RenderParam.docId);
        var orderHomeIntent = LMEPG.Intent.createIntent("orderHome");
        orderHomeIntent.setParam("remark", "视频问诊");
        LMEPG.Intent.jump(orderHomeIntent, doctorDetailIntent);

    },

    /**
     * 逻辑 - 跳转小程序二维码页
     */
    routeQrCode: function () {
        if(RenderParam.carrierId === "10000051" && RenderParam.lmp==="266") {
            var AppletsQrCode = LMEPG.Intent.createIntent("AppletsQrCode");
            LMEPG.Intent.jump(AppletsQrCode);
        }
    },

    /**
     * 根据医生状态获取显示的图像
     * @param status 医生状态
     */
    getDoctorStatusImage: function (status) {
        var statusImage = '';
        switch (status) {
            case '0': // 离线
                statusImage = 'offline_status.png';
                break;
            case '3': // 在线
                statusImage = 'online_status.png';
                break;
            case '2': // 忙碌
            case '4': // 假忙碌
                statusImage = 'busy_status.png';
                break;
            default:
                statusImage = 'offline_status.png';
                break;
        }
        return g_appRootPath + '/Public/img/hd/DoctorP2P/V10/' + statusImage;
    },
};
var doctorDetailModel = {};