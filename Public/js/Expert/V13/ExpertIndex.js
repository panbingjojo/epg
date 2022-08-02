var CWS_URL_OUT = RenderParam.CWS_URL_OUT;
var lmcid = RenderParam.lmcid;// 区域ID
var expertUrl = RenderParam.expertUrl;
var userId = RenderParam.userId;

var IS_HAI_KAN_PLATFORM = RenderParam.carrierId === "371092" || RenderParam.carrierId === "371002"; // 是否是海看平台，需要上报用户行为轨迹
var LIST_PAGE_SIZE = 1; // 医生列表大小
/**
 * 在线问医处理对象
 */
var Expert = {
    buttons: [],
    doctorName: "",
    page: 1,
    maxPage: 0,
    dialogMsg: {
        noVideoPlugin: '视频问诊插件安装页',
        noCamera: '未检测到摄像头！请使用电话功能继续问诊。',
        forbiddenAsk: '您之前在问诊过程中的行为已违反相关法律法规，\n不可使用在线问诊功能，同时我司已进行备案，\n并将保留追究你法律责任的权利。',
        noTimes: '您的免费问诊次数已用完\n订购成为VIP会员，畅想无限问诊',
        noDoctorsOnline: '暂无医生在线为您提供问诊服务\n您可选择留下联系方式，方便工作人员电话回访。'
    },
    rgnCondition: null,
    initDeptID: '', // 当前部门id
    initDeptName: '', // 当前部门名称
    isCollected: false,
    isShowTopIcon: true, // 是否显示右上角的图标，类似新疆电信平台不展示
    docId: '',
    clinic: '',
    lastDeptFocusId: 'dep-0', // 科室选择页面的默认焦点
    init: function () {
        // 页面焦点保持
        Expert.rgnCondition = new RegExp('^EC6');
        Expert.focusId = RenderParam.focusId;
        Expert.page = parseInt(RenderParam.page);
        Expert.initDeptID = RenderParam.deptId;
        Expert.initDeptName = RenderParam.deptName;

        // 获取专家列表
        LMEPG.Inquiry.expertApi.getDoctorList(Expert.initDeptID, Expert.page - 1, LIST_PAGE_SIZE, function (doctorListData) {
            console.log(doctorListData);
            // 获取最大页码
            Expert.maxPage = parseInt(doctorListData.count);
            // 初始化交互焦点
            Expert.createBtns();
            // 渲染显示页面
            Expert.renderPage(doctorListData.data);
            // 如果当前地区配置显示收藏按钮，获取收藏的专家列表
            if (RenderParam.isShowCollect === '1') {
                Expert.getCollectedExpertList(doctorListData.data[0].doctor_user_id);
            }
            // 焦点保持
            Expert.moveToFocus(Expert.focusId);
        });

        RenderParam.lmcid === "410092" && Expert.onBack410092()
    },

    onBack410092: function () {
        try {
            HybirdCallBackInterface.setCallFunction(function (param) {
                LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                    onBack();
                }
            });
        } catch (e) {
            LMEPG.UI.logPanel.show("e");
        }
    },

    helpCount: 0,
    previousImageIndex: '',

    /**
     * 小图标功能区得失焦点
     * @param btn
     * @param hasFocus
     * */
    onFocusIn: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.setAttribute('class', 'focus');
            if (btn.id == 'order-rules') {
                G(btn.id).style.color = 'red';
            }
        } else {
            btnElement.removeAttribute('class');
            if (btn.id == 'order-rules') {
                G(btn.id).style.color = '#ffdc19';
            }
        }

        // 选择按钮文字颜色变化
        if (btn.id == 'tab-0') {
            var el = G('dept-name');
            if (hasFocus) {
                S('dept-name');
                G('dept-name').style.color = '#ffffff';
                // 文字字数小于等于4，不滚动
                LMEPG.Func.marquee(el, el.title, 5);
            } else {
                G('dept-name').style.color = '#8b3b51';
                LMEPG.Func.marquee(el);
                el.innerHTML = el.title;
            }
        }
    },

    /**
     * 获取当前页
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurPageObj: function (obj) {
        var objCurrent = LMEPG.Intent.createIntent('expertIndex');
        // 页面焦点保持
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('page', Expert.page);
        objCurrent.setParam('deptId', Expert.initDeptID);
        objCurrent.setParam('deptName', Expert.initDeptName);
        return objCurrent;
    },
    /**
     * 跳转页面
     * @param btn
     */
    jumpPageUI: function (btn) {
        var currentObj = Expert.getCurPageObj(btn);
        // 通过点击对象id,设置跳转页面对象
        var jumpPageObj = {
            search: 'search',
            mark: 'dateMark',
            vip: 'orderHome',
            set: 'custom',
            help: 'helpIndex'
        };
        var jumpAgreementObj = LMEPG.Intent.createIntent(jumpPageObj[btn.id]);
        // 跳转的订购页面
        if (jumpPageObj[btn.id] == 'orderHome') {
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
                modal.commonDialog({
                    beClickBtnId: btn.id,
                    onClick: modal.hide
                }, '<span style="color: #ef6188">您已是VIP会员，不能重复订购</span>', '海量健康资讯', '为您的家人健康保驾护航');
                return;
            } else {
                jumpAgreementObj.setParam('userId', RenderParam.userId);
                jumpAgreementObj.setParam('isPlaying', '0');
                jumpAgreementObj.setParam('remark', '主动订购');
            }
        }
        LMEPG.Intent.jump(jumpAgreementObj, currentObj);
    },
    /**
     * 医生列表移动操作
     * 翻页操作
     */
    onBeforeMoveChange: function (key, btn) {
        var Id = btn.id;
        var turnPage = null;
        if (RenderParam.isShowCollect === '0') { // 当页面隐藏收藏按钮时
            turnPage = {
                prev: key == 'left' && (Id == 'doctor-advice-0' || Id == 'doctor-intro' || Id == 'order-rules'),
                next: key == 'right' && (Id == 'doctor-advice-0' || Id == 'doctor-intro' || Id == 'order-rules')
            };
        } else {
            turnPage = {
                prev: key == 'left' && (Id == 'collect' || Id == 'order-rules'),
                next: key == 'right' && (Id == 'doctor-advice-0' || Id == 'doctor-intro' || Id == 'order-rules')
            };
        }

        if (turnPage.prev) {
            Expert.turnPrevPage();
            return false;
        }
        if (turnPage.next) {
            Expert.turnNextPage();
            return false;
        }
    },
    /**
     * 医生列表上翻页
     */
    turnPrevPage: function () {
        if (this.page == 1) {
            return;
        }

        Expert.getExpertList(Expert.page - 1, function (rsp) {
            console.log(rsp);
            Expert.maxPage = parseInt(rsp.count);
            Expert.page--;
            Expert.renderPage(rsp.data);
            Expert.getCollectedExpertList(rsp.data[0].doctor_user_id);
            Expert.moveToFocus('doctor-advice-0');
        });
    },
    /**
     * 医生列表下翻页
     */
    turnNextPage: function () {
        if (this.page == this.maxPage) {
            return;
        }

        Expert.getExpertList(Expert.page + 1, function (rsp) {
            console.log(rsp);
            Expert.maxPage = parseInt(rsp.count);
            Expert.page++;
            Expert.renderPage(rsp.data);
            Expert.getCollectedExpertList(rsp.data[0].doctor_user_id);
            Expert.moveToFocus('doctor-advice-0');
        });
    },
    /**
     * 左右箭头显隐切换
     */
    toggleArrow: function () {
        S('prev-arrow');
        S('next-arrow');
        this.page === 1 && H('prev-arrow');
        this.page === this.maxPage && H('next-arrow');
    },

    /**
     * 渲染医生列表
     */
    renderPage: function (data) {
        // 设置当前选择的科室名称
        var txt = !LMEPG.Func.isEmpty(Expert.initDeptName) ? Expert.initDeptName : '选择科室';
        var el = G('dept-name');
        el.title = txt;
        el.innerHTML = txt;

        ActionTime.clearOrderTimer();
        var htm = [];
        var currentPageData = data.slice(0, 1);
        var i = currentPageData.length;
        while (i--) {
            var itemData = currentPageData[i];

            // 在线出诊费用
            var feeHtml = '';
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE) && parseFloat(itemData.vip_pay_val) < parseFloat(itemData.order_val)) {
                feeHtml = '       <li class="doctor-case"><span>在线出诊费用：</span><s>' + itemData.order_val + ' </s>&nbsp;<i style="color: #ffdc19">' + itemData.vip_pay_val + '</i></li>';
            } else {
                feeHtml = '       <li class="doctor-case"><span>在线出诊费用：</span>' + '<i>' + itemData.order_val + '</i></li>';
            }

            // 出诊时间
            var dateList = itemData.datelist;
            for (var k = 0; k < 1; k++) {
                var tempDate = dateList[k];
                var beginDt = tempDate.begin_dt;
                var endDt = tempDate.end_dt;

                var beginDtWith2099 = new Date(Expert.getStandardDt(beginDt)).format('yyyy');//如果出现2099年这样的都显示：3天内安排就诊
                var lineHtml = '';
                if (beginDtWith2099 === 2099 || beginDtWith2099 === '2099') {
                    lineHtml = '3天内安排就诊';
                } else {
                    beginDt = new Date(Expert.getStandardDt(beginDt)).format('yyyy-MM-dd hh:mm');
                    endDt = new Date(Expert.getStandardDt(endDt)).format('hh:mm');
                    lineHtml = beginDt + '到' + endDt + '<br/>';
                }
            }
            Expert.doctorName = itemData.doctor_name;
            var collectImage = Expert.isCollected ? 'collected.png' : 'collect.png'
            htm.push('<div class=doctor-item>' +
                '   <div class="picture-wrap">' +
                '       <img class="doctor-picture" id="doctor-picture" alt="">' +
                (RenderParam.isShowCollect === '1' ? '       <img id="collect" src="' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/' + collectImage + '" alt="">' : '') +
                '   </div>' +
                '   <ul>' +
                '       <li class="doctor-title"><span>' + itemData.doctor_name + '</span>/' + itemData.doctor_level + '</li>' +
                '       <li class="doctor-hospital"><span>医院：</span>' + itemData.doctor_hospital_name + '</li>' +
                '       <li class="doctor-department"><span>科室：</span>' + itemData.doctor_department_name + '</li>' +
                '       <li class="doctor-time"><span>出诊时间：</span>' + lineHtml + '</li>' +
                feeHtml +
                '   </ul>' +
                '   <div class="code-wrap">' +
                '       <img id="doctor-code" alt="">' +
                        (RenderParam.isShowDoctorCode === '1' ? '<p>微信扫码立即预约</p>' : '') +
                '       <img id="doctor-advice-0" src="' + g_appRootPath + '/Public/img/hd/Expert/V13/free_advice.png" alt="">' +
                '       <img id="doctor-intro" src="' + g_appRootPath + '/Public/img/hd/Expert/V13/expert_intro.png" alt="">' +
                '   </div>' +
                '</div>' +
                '<p id="page-count">' + Expert.page + '/' + Expert.maxPage + '</p>' +
                '<div class="service-tel">咨询电话：400-061-3939<p>预约代表同意 <i>《<span id="order-rules">预约问诊条款</span>》</i></p></div>');
        }
        var stbModel = LMEPG.STBUtil.getSTBModel();
        G('doctor-container').innerHTML = htm.join(',');
        // 二维码
        var eleQrCode = G('doctor-code');
        // 专家头像
        G('doctor-picture').src = LMEPG.Inquiry.expertApi.createDoctorUrl(expertUrl, itemData.doctor_user_id, itemData.doctor_avatar, lmcid);
        LMEPG.Log.info("eleQrCode:" + stbModel);

        if (RenderParam.isShowDoctorCode === '0') {
            eleQrCode.src = '/Public/img/Common/spacer.gif';
        } else {
            if (Expert.rgnCondition.test(stbModel)) {  //联通华为盒子
                Expert.getDoctorListQrCode(itemData.clinic_id);
            } else {
                eleQrCode.src = itemData.base;
                ActionTime.startOrderTimer(itemData.timestamp);
            }
        }
        Expert.docId = itemData.doctor_user_id;
        Expert.clinic = itemData.clinic_id;
        this.toggleArrow();

        // 海看探针
        if (IS_HAI_KAN_PLATFORM) {
            var turnPageInfo = {
                currentPage: document.referrer,
                turnPage: location.href,
                turnPageName: document.title,
                turnPageId: itemData.clinic_id,
                clickId: ""
            };
            ShanDongHaiKan.sendReportData('6', turnPageInfo);
        }
    },
    rules: function (arg) {
        /**/
        var htm = '';
        var text = '';
        // 预约条款皮肤设置
        var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/bg.png';
        if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
            bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
        }

        switch (RenderParam.carrierId) {
            case '220001':
            case '630001':
            case '620007':
                text = '电视家庭医生'
                break
            case '000051':
                text = '家康小卫士'
                break
            default:
                text = '健康魔方'
                break
        }

        htm += '<div class=rules><img  src=' + bgImg + '>';
        htm += '<span class=title>用户须知</span>';
        htm += '<div class=rules-desc>' +
            '<p class="expert-rule">专家约诊预约条款' +
            '<p>1.选择视频问专家服务，即视为您已接受并同意遵守本须知。' +
            '<p>2.视频问专家提供临床科室专家先付费后咨询服务，用户可根据病情自行选择。' +
            '<p>3.在规定预约时间段，用户需提前进入电视候诊室，根据候诊顺序等待医生通过电视诊室进行沟通。' +
            '<p>4.咨询中，为达成良好的咨询效果，用户需向就诊医生如实详尽提供相关病情资料，如因用户故意隐瞒或' +
            '<p>提供虚假资料而造成的任何不良后果由用户自行承担。' +
            '<p>5.已使用、已预约的服务原则上不可申请退款，如因用户迟到导致错过咨询，已收取费用原则上不予退回。' +
            '<p>6.医生咨询仅为建议，具体诊疗需前往医院进行，最终采纳请结合临床，本应用不承担因选择治疗方案而导致的所有法律责任。' +
            '<p>7.本应用保留未尽事宜的合理解释权。';
        var modalEl = document.createElement('div');
        modalEl.id = 'modal';
        modalEl.innerHTML = htm;
        document.body.appendChild(modalEl);

    },

    onFocusChange: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.style.backgroundColor = '#ef0b2c';
        } else {
            btnElement.style.backgroundColor = '#efa8aa';

        }
    },
    Nc: 20,
    onBeforeMoveChangeScrollDistance: function (key, btn) {
        if (key == 'left' || key == 'right') {
            return;
        }
        var changeUp = function () {
            Expert.Nc = Math.max(0, Expert.Nc -= 20);
        };
        var changeDown = function () {
            Expert.Nc = Math.min(325, Expert.Nc += 20);
        };
        var updateDis = function () {
            G(btn.id).style.top = Expert.Nc + 'px';
            G('desc-wrap').style.top = -Expert.Nc + 'px';
        };
        if (key == 'down') {
            changeDown();
        } else {
            changeUp();
        }
        updateDis();
    },
    /**
     * 点专家介绍跳转到医生详情页面
     */
    onClickToDoctorsDetails: function (btn) {
        var doctorIndex = G(btn.id).getAttribute('data-id');
        var currentObj = Expert.getCurPageObj(btn);
        if (IS_HAI_KAN_PLATFORM) { //海看统计
            var turnPageInfo = {
                currentPage: window.location.href,
                turnPage: "expertDetail",
                turnPageName: doctorIndex,
                turnPageId: Expert.clinic,
                clickId: "39JKZJ-ZJJS"
            };
            ShanDongHaiKan.sendReportData('6', turnPageInfo);
        }
        currentObj.setParam('page', Expert.page); // 保留ajax 请求的页数
        currentObj.setParam('department', Department.department);// 保留ajax 请求的部门
        var jumpAgreementObj = LMEPG.Intent.createIntent('expertDetail');
        jumpAgreementObj.setParam('doctorIndex', doctorIndex); // 传递点击具体那个医生的索引
        jumpAgreementObj.setParam('clinic', Expert.clinic);
        jumpAgreementObj.setParam('qr_img', G('doctor-code').getAttribute('src'));
        LMEPG.Intent.jump(jumpAgreementObj, currentObj);
    },
    /**
     * 医生问诊页面（静态页面，简单添加个弹框，后续依据复杂度添加单独对象）
     * @param btn
     */
    test: function () {
        console.log('测试ok');
    },
    /**
     * 弹出科室选择界面
     * @param btn
     */
    onClickToChoiceDepartment: function (btn) {
        var el = G(btn.id);
        Department.init();
    },

    initButtons: function (focusId) {
        LMEPG.ButtonManager.init(focusId, this.buttons, '', true);
    },
    moveToFocus: function (focusId) {
        LMEPG.ButtonManager.requestFocus(focusId);
    },
    orderRulesBeClick: function (btn) {
        Expert.rules({beClickBtnId: btn.id});
        //LMEPG.ButtonManager.setKeyEventPause(true);
    },
    /**
     * 创建通用头部按钮
     * 创建医生列表虚拟按钮和立即问医按钮
     * 创建脚手架ID;
     */
    createBtns: function () {
        this.buttons = [
            {
                id: 'tab-0',
                name: '选中科室',
                type: 'img',
                nextFocusLeft: 'tab-1',
                nextFocusRight: 'tab-1',
                nextFocusUp: '',
                nextFocusDown: RenderParam.isShowCollect === '1' ? 'collect' : 'doctor-advice-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/tab0.png',
                focusImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/tab0_f.png',
                click: this.onClickToChoiceDepartment,
                focusChange: this.onFocusIn
            }, {
                id: 'tab-1',
                name: '约诊记录',
                type: 'img',
                nextFocusLeft: 'tab-0',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: RenderParam.isShowCollect === '1' ? 'collect' : 'doctor-advice-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/Expert/V13/tab2.png',
                focusImage: g_appRootPath + '/Public/img/hd/Expert/V13/tab2_f.png',
                click: this.onClickToRecord
            }, {
                id: 'doctor-advice-0',
                name: '免费咨询0',
                type: 'img',
                nextFocusLeft: 'collect',
                nextFocusUp: 'tab-1',
                nextFocusDown: 'doctor-intro',
                backgroundImage: g_appRootPath + '/Public/img/hd/Expert/V13/free_advice.png',
                focusImage: g_appRootPath + '/Public/img/hd/Expert/V13/free_advice_f.png',
                click: Expert.consultFree,
                beforeMoveChange: this.onBeforeMoveChange
            }, {
                id: 'doctor-intro',
                name: '专家介绍',
                type: 'img',
                nextFocusLeft: 'collect',
                nextFocusUp: 'doctor-advice-0',
                nextFocusDown: 'order-rules',
                backgroundImage: g_appRootPath + '/Public/img/hd/Expert/V13/expert_intro.png',
                focusImage: g_appRootPath + '/Public/img/hd/Expert/V13/expert_intro_f.png',
                beforeMoveChange: this.onBeforeMoveChange,
                click: this.onClickToDoctorsDetails
            }, {
                id: 'order-rules',
                name: '预约条款',
                type: 'others',
                nextFocusUp: 'doctor-intro',
                focusChange: this.onFocusIn,
                click: this.orderRulesBeClick
                // beforeMoveChange: this.onBeforeMoveChange
            }];
        if (RenderParam.isShowCollect === '1') {
            this.buttons.push({
                id: 'collect',
                name: '收藏',
                type: 'img',
                nextFocusRight: 'doctor-advice-0',
                nextFocusUp: 'tab-0',
                nextFocusDown: 'order-rules',
                backgroundImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collect.png',
                focusImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collect_f.png',
                click: Expert.setCollectStatus,
                focusChange: this.onCollectFocusChange, // 收藏状态不一致，显示的图片也不一致
                beforeMoveChange: this.onBeforeMoveChange
            });
        }
        this.initButtons('tab-0');
    },

    /**
     * 收藏按钮焦点改变事件
     * @param button 收藏按钮
     * @param hasFocus 是否获得焦点
     */
    onCollectFocusChange: function (button, hasFocus) {
        var collectImage = 'collect.png';
        var collectFocusImage = 'collect_f.png'
        if (Expert.isCollected) {
            collectImage = 'collected.png';
            collectFocusImage = 'collected_f.png';
        }
        var collectElement = G(button.id);
        if (hasFocus) {
            collectElement.src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/' + collectFocusImage;
        } else {
            collectElement.src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/' + collectImage;
        }
    },

    /**
     * 获取专家列表
     * @param pageNum
     * @param callback
     */
    getExpertList: function (pageNum, callback) {
        var tempCurrentPage = 0;
        if (parseInt(pageNum) > 0) {
            tempCurrentPage = parseInt(pageNum) - 1;
        }
        LMEPG.UI.showWaitingDialog();
        console.log(Expert.initDeptID);
        LMEPG.Inquiry.expertApi.getDoctorList(Expert.initDeptID, tempCurrentPage, LIST_PAGE_SIZE, function (rsp) {
            rsp = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (rsp.code == 0) {
                callback(rsp);
            } else {
                LMEPG.UI.showToast('拉取医生列表请求失败');
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 时间格式化
     * @param dt
     * @returns {Date}
     */
    getStandardDt: function (dt) {
        var time = dt.replace(/-/g, ':').replace(' ', ':');
        time = time.split(':');
        return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
    },

    /**
     * 获取二维码
     * @param clinicID
     */
    getDoctorListQrCode: function (clinicID) {
        LMEPG.Inquiry.expertApi.getQrCodeViaClinicID(clinicID, function (QRCodeData) {
            var eleQrCode = G('doctor-code');
            try {
                QRCodeData = QRCodeData instanceof Object ? QRCodeData : JSON.parse(QRCodeData);
                if (QRCodeData.code === 0 || QRCodeData.code === '0') {
                    var qrUrl = CWS_URL_OUT + QRCodeData.url;

                    eleQrCode.setAttribute('src', qrUrl);
                    ActionTime.startOrderTimer(QRCodeData.timestamp);
                } else {
                    LMEPG.UI.showToast('获取二维码失败' + QRCodeData.code);
                    eleQrCode.setAttribute('src', '');
                }

            } catch (e) {
                LMEPG.UI.showToast('解析二维码异常');
                eleQrCode.setAttribute('src', '');
            }
        });
    },

    /**
     * 获取收藏的专家列表
     * @param docId 专家Id
     */
    getCollectedExpertList: function (docId) {
        var postData = {
            'item_type': 4 // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
        };
        LMEPG.ajax.postAPI('Collect/getCollectListNew', postData, function (collectListData) {
            collectListData = collectListData instanceof Object ? collectListData : JSON.parse(collectListData);
            console.log(collectListData);
            var currentBtn = LMEPG.BM.getCurrentButton().id;
            if (collectListData.result === 0 || collectListData === '0') {
                // 遍历判断是否收藏过
                var collectList = collectListData.list;
                Expert.isCollected = false;
                for (var i = 0; i < collectList.length; i++) {
                    if (docId === collectList[i].doctor_user_id) {
                        Expert.isCollected = true;
                        break;
                    }
                }
                var collectState = Expert.isCollected ? '1' : '0';
                var currentBtnState = currentBtn === 'collect' ? '1' : '0';
                var state = collectState + '_' + currentBtnState;
                switch (state) {
                    case '1_1': // 已收藏，当前焦点落在收藏按钮
                        G('collect').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collected_f.png';
                        break;
                    case '1_0': // 已收藏，当前焦点未落在收藏按钮
                        G('collect').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collected.png';
                        break;
                    case '0_1': // 未收藏，当前焦点落在收藏按钮
                        G('collect').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collect_f.png';
                        break;
                    case '0_0': // 未收藏，当前焦点未落在收藏按钮
                        G('collect').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collect.png';
                        break;
                }
            }
            Expert.initButtons(currentBtn);
        });
    },
    //// 类型（0收藏 1取消收藏）
    HaiKanHoleStat: function (collectStatus, doctorId) {
        var turnPageInfo = {
            VODCODE: doctorId,
            VODNAME: Expert.doctorName,
            mediastatus: collectStatus == 1 ? "0" : "1",
            reserve1: null,
            reserve2: null,
            from: "jz3.0"
        };
        ShanDongHaiKan.sendReportData('8', turnPageInfo);
    },

    /**
     * 设置收藏状态
     */
    setCollectStatus: function () {
        var postData = {
            'type': Expert.isCollected ? 1 : 0, // 类型（0收藏 1取消收藏）
            'item_type': 4, // 收藏对象类型（1视频 2视频专辑 3医生 4专家）
            'item_id': Expert.docId // 收藏对象id
        };
        if (IS_HAI_KAN_PLATFORM) {
            // 类型（0收藏 1取消收藏）
            Expert.HaiKanHoleStat(Expert.isCollected, Expert.docId);
        }

        LMEPG.ajax.postAPI('Collect/setCollectStatusNew', postData, function (rsp) {
            try {
                var collectItem = rsp instanceof Object ? rsp : JSON.parse(rsp);
                console.log(collectItem);
                if (collectItem.result == 0) {
                    if (postData.type == 0) {
                        //收藏成功
                        Expert.isCollected = true;
                        G('collect').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collected_f.png';
                        LMEPG.UI.showToast('收藏成功');
                    } else {
                        //取消收藏成功
                        Expert.isCollected = false;
                        G('collect').src = g_appRootPath + '/Public/img/hd/DoctorP2P/V13/collect_f.png';
                        LMEPG.UI.showToast('取消收藏成功');
                    }
                } else {
                    LMEPG.UI.showToast('操作失败');
                }
            } catch (e) {
                LMEPG.UI.showToast('操作异常');
            }
        });
    },
    /**
     * 免费咨询
     */
    consultFree: function (button) {
        LMEPG.UI.forbidDoubleClickBtn(function () {
            if (IS_HAI_KAN_PLATFORM) {
                //咨询统计
                var turnPageInfo = {
                    currentPage: document.referrer,
                    turnPage: location.href,
                    turnPageName: document.title,
                    turnPageId: Expert.docId,
                    clickId: "39JKZJ-MFZX"
                };
                ShanDongHaiKan.sendReportData('6', turnPageInfo);
            }
            LMEPG.UI.showWaitingDialog('');

            // 查询助理医生
            LMEPG.Inquiry.expertApi.getAdvisoryDoctor(function (rsp) {

                try {
                    var resObj = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if (resObj.code != '0') {
                        LMEPG.UI.showToast('当前没有医生在线，请稍后在试！');
                        return;
                    }
                    // 判断当前医生是否在线
                    var docInfo = resObj.doc_info;
                    var tempOnline = parseInt(docInfo.online_state);
                    // 医生处于在线或者忙碌状态时
                    if (tempOnline === 3 || tempOnline === 2) {
                        // 查询约诊记录信息，设置当前发起问诊的问诊状态
                        Expert.getInquiryData(docInfo, button.id);
                    } else {
                        LMEPG.UI.showToast('助理医生暂时不在线');
                        LMEPG.UI.dismissWaitingDialog('');
                    }
                } catch (e) {
                    LMEPG.UI.showToast('获取咨询医生解析数据异常');
                    LMEPG.UI.dismissWaitingDialog('');
                }
            }, function (rsp) {
                LMEPG.UI.showToast('获取咨询医生信息请求失败');
                LMEPG.UI.dismissWaitingDialog('');
            });
        });
    },

    /**
     * 拉取问诊记录信息
     * @param:docInfo
     */
    getInquiryData: function (docInfo, buttonId) {
        var inquiryEntry = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRY;
        if (Expert.clinic !== '') {
            LMEPG.Inquiry.expertApi.getInquiryList('', 0, 1, function (data) {
                LMEPG.UI.dismissWaitingDialog();
                try {
                    if (data != null) {
                        var expertJsonObj = data instanceof Object ? data : JSON.parse(data);
                        if (expertJsonObj.data.length > 0) {
                            if (expertJsonObj.code === 0 || expertJsonObj.code === '9') {
                                var tempData = expertJsonObj.data[0];
                                var isPay = tempData.clinic_is_pay;                //支付状态  0未支付 1已支付
                                var clinicState = tempData.clinic_state;           //就诊状态 0：等待；1：进行；2：完成；3：关闭；
                                if (isPay == 1) { //已经付款
                                    if (clinicState == 0) {
                                        inquiryEntry = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRIING_RECORD;
                                    } else if (clinicState == 1) {
                                        inquiryEntry = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRY_ONGOING;
                                    } else if (clinicState == 2) {
                                        inquiryEntry = LMEPG.Inquiry.p2p.InquiryEntry.EXPERT_INQUIRIED_RECORD;
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
                // 开启问诊
                Expert.startInquiry(docInfo, buttonId, inquiryEntry);
            });
        } else {
            // 开启问诊
            Expert.startInquiry(docInfo, buttonId, inquiryEntry);
        }
    },

    /**
     * 开始问诊助理医生
     * @param doctorInfo 助理医生信息
     * @param buttonId 免费咨询按钮
     * @param inquiryType 问诊类型
     */
    startInquiry: function (doctorInfo, buttonId, inquiryType) {
        var inquiryInfo = Expert.getInquiryInfo(buttonId, inquiryType);
        inquiryInfo.doctorInfo = doctorInfo;
        if (RenderParam.areaCode === '216') {
            LMEPG.Inquiry.p2p._startWeChatVideoInquiry(inquiryInfo);
        } else if (RenderParam.carrierId === '420092') {
            // 湖北电信使用电话问诊方式
            LMEPG.Inquiry.p2p._startTVPhoneInquiry(inquiryInfo);
        } else {
            LMEPG.Inquiry.p2p._startVideoInquiry(inquiryInfo);
        }
    },

    /**
     * 通用的问诊参数
     * @param buttonId 点击问诊的按钮Id
     * @param moduleType 当前问诊的状态
     */
    getInquiryInfo: function (buttonId, moduleType) {
        return {
            userInfo: {
                isVip: RenderParam.isVip,                                    // 用户身份信息标识
                accountId: RenderParam.userAccount,                          // IPTV业务账号
            },
            memberInfo: null,                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
            moduleInfo: {
                moduleId: LMEPG.Inquiry.p2p.EXPERT_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                moduleName: LMEPG.Inquiry.p2p.EXPERT_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                moduleType: moduleType,                                      // 问诊模块标识 - 在线问医
                focusId: buttonId,                                           // 当前页面的焦点Id
                intent: Expert.getCurPageObj(buttonId),                      // 当前模块页面路由标识
            },
            serverInfo: {
                fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                cwsHlwyyUrl: RenderParam.CWS_URL_OUT,                        // cws互联网医院模块链接地址
            },
            inquiryEndHandler: Expert.inquiryEndHandler,                     // 检测医生问诊结束之后，android端回调JS端的回调函数
            inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 判断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
        };
    },

    /**
     * 问诊结束处理函数
     */
    inquiryEndHandler: function () {
        LMEPG.Log.info("ExpertIndex.js---startInquiry--End");
    },

    /**
     * 跳转到约诊记录
     */
    onClickToRecord: function (btn) {
        var objCurrent = Expert.getCurPageObj(LMEPG.BM.getCurrentButton());
        var objExpertSuccess = LMEPG.Intent.createIntent('expertRecordHome');
        LMEPG.Intent.jump(objExpertSuccess, objCurrent);
    },

    /**
     * 跳转到预约成功页面
     * @param appointmentID
     */
    jumpExpertSuccess: function (appointmentID) {
        var objCurrent = Expert.getCurPageObj(LMEPG.BM.getCurrentButton());

        var objExpertSuccess = LMEPG.Intent.createIntent('expertSuccess');
        objExpertSuccess.setParam('appointmentID', appointmentID);

        LMEPG.Intent.jump(objExpertSuccess, objCurrent);
    },

    /**
     * 构建问诊基础数据包
     * @param btn
     * @returns {{entryType: number, isUseInquiryPlugin: boolean, inquiryBlacklistHandler: Detail.inquiryBlacklistHandler, userVipState, dialogConfig: {showKeyBoardType: string, keyBoardTop: number, keyBoardLeft: number}, moduleName: string, cwsInquirySeverUrl, moduleId: string, noInquiryTimesHandler: Detail.noInquiryTimesHandler, focusIdOnDialogHide}}
     */
    buildInquiryConfig: function (btn, inquiryEntry) {
        var config = Expert.inquiryConfigBase(btn, inquiryEntry)
        var backPageIntent = Expert.getCurPageObj(null);
        config.inquiryType = LMEPG.Inquiry.p2p.InquiryType.tv_phone;
        config.backPageIntent = backPageIntent;
        config.dialogConfig = { // 主要是键盘相关配置，后期电视电话的弹窗统一，可以省略该配置
            showKeyBoardType: '1',
            keyBoardLeft: 695,
            keyBoardTop: 330,
        };
        return config;
    },

    /**
     * 问诊基础参数
     */
    inquiryConfigBase: function (btn, inquiryEntry) {
        return {
            moduleId: '10002',
            moduleName: '专家约诊',
            entryType: inquiryEntry,
            inquiryBlacklistHandler: Expert.inquiryBlacklistHandler,
            noInquiryTimesHandler: Expert.noInquiryTimesHandler,
            userVipState: RenderParam.isVip, // 当前用户vip状态
            focusIdOnDialogHide: btn.id,
            cwsInquirySeverUrl: RenderParam.cwsHlwyyUrl,
            isCheckInquiryTimes: RenderParam.sDemoId === 'superDemo' ? '0' : '1', // 新疆电信epg社区医院不需要校验问诊次数，sDemoId设置为'superDemo'为新疆电信epg社区医院标识
            isUseInquiryPlugin: RenderParam.isRunOnAndroid === '1' ? '0' : '1', // 是否需要使用Android插件
            dialogConfig: {
                showKeyBoardType: '1',
                keyBoardLeft: 695,
                keyBoardTop: 330,
            }
        }
    },

    /**
     * 问诊返回监听
     * @param focusIdOnHideDialog
     */
    inquiryBlacklistHandler: function (focusIdOnHideDialog) {
        var forbiddenAskTips = '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。';
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: modal.hide
        }, '', forbiddenAskTips, '');
    },

    /**
     *
     * @param focusIdOnHideDialog
     */
    noInquiryTimesHandler: function (focusIdOnHideDialog) {
        var noInquiryTimesTips = '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊'
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: Detail.jumpBuyVip
        }, '', noInquiryTimesTips, '');
    },
};

/**
 * 科室列表
 */
var Department = {
    page: 0,
    maxPage: 0,
    PAGE_ITEM_COUNT: 36,// 一页最多请求36个部门
    init: function () {
        Department.getDepartmentList(function (data) {
            Department.isShow = true;
            Department.maxPage = Math.ceil(data.length / 36);
            Department.renderDepartment(data);
            Department.createBtns();
        });
    },
    /**
     * 设置翻页起始参数
     */
    setPageData: function (data) {
        var plusPage = this.page * 36;
        return data.slice(plusPage, plusPage + 36);
    },
    renderDepartment: function (data) {
        Show('department-container');
        // ajax 异步拉取科室列表;
        var currentPageData = this.setPageData(data);
        console.log(currentPageData);
        var htm = '<div id="department-wrap">';
        currentPageData.forEach(function (t, i) {
            var txt = t.department_name;
            htm += '<div class="department" style="float: left" id="dep-' + i + '" data-id="' + t.department_id + '" dept-name="' + txt + '">' + (txt == '' ? '-' : txt) + '</div>';
        });
        htm += '</div><p>选择科室</p>' +
            '<img src="' + g_appRootPath + '/Public/img/hd/Home/V13/Home/Common/up.png" id="up-arrow" class="dep-arrow">' +
            '<img src="' + g_appRootPath + '/Public/img/hd/Home/V13/Home/Common/down.png" id="down-arrow" class="dep-arrow">';
        G('department-container').innerHTML = htm;
        this.toggleArrow();
        G("dept-name").style.color = "#8b3b51";
    },
    // 呼叫等待医生页面
    callDoctor: function (arg) {
        var htm = '<div class=callDoctor>';
        htm += '<img src=' + g_appRootPath + '/Public/img/hd/Home/V13/Home/Common/bg.png>' +
            '<img id="doctor-pic" src=' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/test0_pic.png>' +
            '<img class="telephone-icon" src=' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/icon_telephone.png>' +
            '<img class="waiting-point" src=' + g_appRootPath + '/Public/img/hd/DoctorP2P/V13/waiting_point.png>' +
            '<p class="waiting-text">正在接通，请稍等' +
            '<p class="notice-text">温馨提示：请注意接听来电，来电号码0898-6856-8003。电话接听后，请将电视调为静音，以免影响通话质量';
        G('modal').innerHTML = htm;
        modal.initPath(arg);
    },
    createBtns: function () {
        // 避免重复创建虚拟按钮
        if (Expert.buttons.some(function (t) {
            return t == 'dep-0';
        })) {
            return;
        }
        var item_count = this.PAGE_ITEM_COUNT;
        while (item_count--) {
            Expert.buttons.push({
                id: 'dep-' + item_count,
                name: '科室',
                type: 'div',
                nextFocusLeft: 'dep-' + (item_count - 1),
                nextFocusRight: 'dep-' + (item_count + 1),
                nextFocusUp: 'dep-' + (item_count - 6),
                nextFocusDown: 'dep-' + (item_count + 6),
                backgroundImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/department.png',
                focusImage: g_appRootPath + '/Public/img/hd/DoctorP2P/V13/department_f.png',
                focusChange: this.toggleFocus,
                click: this.onClickToRenderDoctorList,
                beforeMoveChange: this.onBeforeMoveChange
            });
        }
        Expert.initButtons(Expert.lastDeptFocusId);
    },
    toggleFocus: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            LMEPG.Func.marquee(btnElement, btnElement.getAttribute('dept-name'), 5);
        } else {
            LMEPG.Func.marquee(btnElement);
        }
    },
    /**
     * 点击科室
     */
    onClickToRenderDoctorList: function (btn) {
        // ajax根据科室 异步拉去医生列表;
        Expert.initDeptID = G(btn.id).getAttribute('data-id');
        Expert.initDeptName = G(btn.id).getAttribute('dept-name');
        // 保存科室页面的焦点
        Expert.lastDeptFocusId = btn.id;
        Hide('department-container');
        H('dept-name');

        Expert.page = 1;
        Expert.getExpertList(Expert.page, function (rsp) {
            console.log(rsp);
            Expert.maxPage = parseInt(rsp.count);
            Expert.renderPage(rsp.data);
            Expert.createBtns();
            Expert.getCollectedExpertList(rsp.data[0].doctor_user_id);
        });
    },
    onBeforeMoveChange: function (key, btn) {
        var _ = Department;
        var prevObj = ['dep-0', 'dep-1', 'dep-2', 'dep-3', 'dep-4', 'dep-5'];
        var nextObj = ['dep-30', 'dep-31', 'dep-32', 'dep-33', 'dep-34', 'dep-35'];
        var mergeObj = prevObj.concat(nextObj);
        var isTurnPage = function (arr) {
            return arr.some(function (t) {
                return btn.id == t;
            });
        };
        var turnPageObj = {
            nothing: key == 'left' || key == 'right' || !isTurnPage(mergeObj),
            prevPage: key == 'up' && isTurnPage(prevObj) && _.page != 0,
            nextPage: key == 'down' && isTurnPage(nextObj) && _.page != _.maxPage
        };
        // 不是翻页ID 不做操作
        if (turnPageObj.nothing) {
            return;
        }
        // 向上翻页
        if (turnPageObj.prevPage) {
            _.turnPrevPage();
        }
        // 向下翻页
        if (turnPageObj.nextPage) {
            _.turnNextPage();
        } else if (key == 'down') {
            _.changeDownFocus(key, btn);
        }
    },
    /**
     * 如果向下移动没有对象即移动到第下一排第一个
     * @param key
     * @param btn
     */
    changeDownFocus: function (key, btn) {
        if (!G(btn.nextFocusDown)) {
            var containerChildDom = G('department-wrap').children;
            var lastFocusItem = containerChildDom[containerChildDom.length - 1].id;
            LMEPG.ButtonManager.requestFocus(lastFocusItem);
        }
    },
    turnPrevPage: function () {
        Math.max(0, this.page -= 1);
        this.renderDepartment();
        Expert.moveToFocus('debug');
    },
    turnNextPage: function () {
        Math.min(this.maxPage, this.page += 1);
        this.renderDepartment();
        Expert.moveToFocus('debug');
    },
    toggleArrow: function () {
        S('up-arrow');
        S('down-arrow');
        this.page == 0 && H('up-arrow');
        (this.page + 1) == this.maxPage && H('down-arrow');
    },

    /**
     * 获取科室列表
     * @param callback
     */
    getDepartmentList: function (callback) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.Inquiry.expertApi.getDepartment(function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                var departmentJsonObj = rsp instanceof Object ? rsp : JSON.parse(rsp);
                switch (departmentJsonObj.code) {
                    case '0':
                        if (typeof departmentJsonObj.data == 'undefined' || departmentJsonObj.data == null) {
                            LMEPG.UI.showToast('获取科室异常[' + departmentJsonObj.code + ']');
                            return;
                        }
                        departmentJsonObj.data.unshift({'department_id': '', 'department_name': '全部科室'});
                        console.log(departmentJsonObj);
                        callback(departmentJsonObj.data);
                        break;
                    case '-102':
                        LMEPG.UI.showToast('获取科室异常[' + departmentJsonObj.code + ']：数据为空！');
                        break;
                    default:
                        LMEPG.UI.showToast('获取科室异常[' + departmentJsonObj.code + ']');
                        break;
                }
            } catch (e) {
                LMEPG.UI.showToast('获取科室数据解析异常');
            }
        });
    }
};

/**
 * 遥控器返回事件监听
 */
var onBack = function () {
    if (G('modal')) {
        delNode('modal')
        LMEPG.BM.requestFocus('order-rules')
        return
    }

    switch (true) {
        case Department.isShow:
            Hide('department-container');
            Expert.moveToFocus('tab-0');
            delete Department.isShow;
            break;
        default:
            LMEPG.Intent.back();
            break;
    }
};

/**
 * 轮询订单，支付成功后自动跳转预约成功页面
 * @type {{startOrderTimer: ActionTime.startOrderTimer, clearOrderTimer: ActionTime.clearOrderTimer}}
 */
var ActionTime = {
    orderTimer: null, // 查询订单计时器
    /**
     * 轮询扫码字符订单记过
     * @param timestamp 轮询的时间戳
     */
    startOrderTimer: function (timestamp) {
        ActionTime.orderTimer = setInterval(function () {
            LMEPG.Inquiry.expertApi.getAppointmentInfo(timestamp, function (appointmentData) {
                appointmentData = appointmentData instanceof Object ? appointmentData : JSON.parse(appointmentData);
                console.log('获取订单信息API返回数据-res-->' + JSON.stringify(appointmentData));
                if (appointmentData !== null && (appointmentData.code === 0 || appointmentData.code === '0')) {
                    var appointmentItem = appointmentData.data[0];
                    if (appointmentItem.clinic_is_pay === 1 || appointmentItem.clinic_is_pay === '1') {
                        ActionTime.clearOrderTimer();
                        Expert.jumpExpertSuccess(appointmentItem.appointment_id);
                    }
                } else {
                    console.log('暂无订单信息,code=' + appointmentData.code);
                }
            });
        }, 3000);
    },
    /**
     * 清除轮询定时器
     */
    clearOrderTimer: function () {
        if (ActionTime.orderTimer) {
            clearInterval(ActionTime.orderTimer);
        }
    }
};

