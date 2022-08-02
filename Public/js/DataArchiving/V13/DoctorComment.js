var scene;
var Detail = {
    innerHeight: '',
    buttons: [],
    page: 1, // 当前页
    pageNum: 0, // 总页数
    inquiryItem: null, // 从后台获取的问诊记录单个详情
    scrollStatus: 0,
    dialogMsg: {
        noVideoPlugin: '视频问诊插件安装页',
        noCamera: '未检测到摄像头！请使用电话功能继续问诊。',
        forbiddenAsk: '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。',
        noTimes: '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊',
        noDoctorsOnline: '暂无医生在线为您提供问诊服务\n您可选择留下联系方式，方便工作人员电话回访。'
    },
    init: function () {
        Hide('content');
        Detail.createBtns();
        Detail.page = !LMEPG.Func.isEmpty(RenderParam.initPage) ? RenderParam.initPage : Detail.page;
        Detail.loadInquiryData(Detail.page, function () {
            Detail.render(Detail.inquiryItem);
        });

        if (RenderParam.memberID != -1) {
            Network.updateReadStatus()
        }

    },
    onFocusChange: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.style.backgroundColor = '#ef0b2c';
        } else {
            btnElement.style.backgroundColor = '#32cfe0';

        }
    },
    // innerEl: G('desc-wrap'),
    elHeight: 0,
    isOverflowWrap: function () {
        this.elHeight = parseInt(this.getInnerHeight(G('desc-wrap'), 'height'));
        // 如果没有溢出内容则不显示滚动条
        if (this.elHeight < (RenderParam.platformType == 'sd' ? 380 : 510) && G('scroll-wrap')) {
            H('scroll-wrap');
            LMEPG.BM.getButtonById("delete-result").nextFocusDown = "";
            this.scrollStatus = 0;
        } else {
            S('scroll-wrap');
            this.scrollStatus = 1;
            LMEPG.BM.getButtonById("delete-result").nextFocusDown = "scroll-bar";
        }
    },
    getInnerHeight: function (el, attr) {
        var val;
        if (el && el.currentStyle && attr) {
            val = el.currentStyle[attr];
        } else {
            try {
                if (attr) val = getComputedStyle(el, null)[attr];
                else val = el.innerText.length;
            } catch (e) {
                val = el.innerText.length;
            }
        }
        return val;
    },
    Nc: 20,
    onBeforeMoveChangeScrollDistance: function (key, btn) {
        if (key == 'left' || key == 'right') {
            return;
        }
        if (key == 'up' && (Detail.getInnerHeight(G('scroll-bar'), "top") == '0'
            || Detail.getInnerHeight(G('scroll-bar'), "top") == "0px")) {
            LMEPG.ButtonManager.getButtonById('scroll-bar').nextFocusUp = 'delete-result';
            LMEPG.BM.requestFocus("delete-result");
        } else {
            LMEPG.ButtonManager.getButtonById('scroll-bar').nextFocusUp = '';
        }
        var changeUp = function () {
            Detail.Nc = Math.max(0, Detail.Nc -= 20);
        };
        var changeDown = function () {
            Detail.Nc = Math.min(350, Detail.Nc += 20);
        };
        var updateDis = function () {

            G(btn.id).style.top = Detail.Nc + 'px';
            G('desc-wrap').style.top = -Detail.Nc + 'px';
        };
        if (key == 'down') {
            if (this.scrollStatus = 0) {
                return;
            }
            changeDown();
        } else {
            changeUp();
        }
        updateDis();
    },
    createBtns: function () {
        if (RenderParam.isArchived == 0) {
            G('archive').src = g_appRootPath + '/Public/img/hd/DataArchiving/V13/archive.png';
        } else {
            if (RenderParam.carrierId==='110052'){
                G('archive').src = g_appRootPath + '/Public/img/hd/DataArchiving/V13/inquiry_again_cihai.png';
            }else {
                G('archive').src = g_appRootPath + '/Public/img/hd/DataArchiving/V13/inquiry_again.png';
            }
        }
        this.buttons.push({
            id: 'archive',
            name: '归档/再次问诊',
            type: 'img',
            nextFocusUp: 'delete-result',
            nextFocusDown: '',
            nextFocusRight: 'delete-result',
            backgroundImage: RenderParam.isArchived == 0
                ? g_appRootPath + '/Public/img/hd/DataArchiving/V13/archive.png'
                : (RenderParam.carrierId=='110052'
                    ?g_appRootPath + '/Public/img/hd/DataArchiving/V13/inquiry_again_cihai.png'
                    :g_appRootPath + '/Public/img/hd/DataArchiving/V13/inquiry_again.png'),
            focusImage: RenderParam.isArchived == 0
                ? g_appRootPath + '/Public/img/hd/DataArchiving/V13/archive_f.png'
                : (RenderParam.carrierId=='110052'
                    ?g_appRootPath + '/Public/img/hd/DataArchiving/V13/inquiry_again_cihai_f.png'
                    :g_appRootPath + '/Public/img/hd/DataArchiving/V13/inquiry_again_f.png'),
            click: this.clickArchiveOrInquiryAgain,
            beforeMoveChange: Detail.turnPage
        }, {
            id: 'delete-result',
            name: '删除',
            type: 'img',
            nextFocusLeft: 'archive',
            nextFocusDown: 'scroll-bar',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/delete.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V13/delete_f.png',
            click: Detail.showDeleteDialog
        },{
            id: 'scroll-bar',
            name: '滚动条',
            type: 'div',
            nextFocusLeft: 'archive',
            nextFocusUp: 'delete-result',
            focusChange: this.onFocusChange,
            beforeMoveChange: this.onBeforeMoveChangeScrollDistance
        });
        this.initButtons('archive');
    },
    initButtons: function (focusId) {
        LMEPG.ButtonManager.init(focusId, this.buttons, '', true);
    },
    moveToFocus: function (focusId) {
        LMEPG.ButtonManager.requestFocus(focusId);
    },

    /**
     * 渲染页面
     */
    render: function (inquiryItem) {
        var disease = '';
        var medicalHistory = '';
        var advice = '';
        var docName = '';
        var docDepartment = '';
        var docJob = '';
        var time = this.getInquiryDurationTime(inquiryItem.duration); // 时长
        var doctorImgStc = inquiryItem.doctor_image_url;
        console.log(doctorImgStc)
        var score = 0;

        disease = inquiryItem.disease_desc;//主诉
        advice = inquiryItem.diagnosis;    //建议
        medicalHistory = inquiryItem.medical_history;//病史
        docName = inquiryItem.doc_name;
        docDepartment = inquiryItem.department;
        docJob = inquiryItem.job_title;


        G('main-suit-content').innerHTML = disease;
        G('case-history-content').innerHTML = medicalHistory;
        G('advice-content').innerHTML = advice;
        G('duration-ask').innerHTML = time;
        G('counsel-person').innerHTML = RenderParam.memberName;
        G('doctor-pic').src = LMEPG.Inquiry.expertApi.createDoctorUrl(RenderParam.CWS_HLWYY_URL, inquiryItem.doc_id, inquiryItem.avatar_url, RenderParam.carrierId);
        G('doctor-case').innerHTML = inquiryItem.create_dt;
        G('doctor-title').innerHTML = docName;
        G('doctor-department').innerHTML = docDepartment;
        G('doctor-Attending').innerHTML = docJob;

        // 页数
        G('page').innerHTML = Detail.page + '/' + Detail.pageNum;

        if (G("desc-wrap")) G("desc-wrap").style.top = "0px";
        if (G("scroll-bar")) G("scroll-bar").style.top = "0px";

        this.updateArrows();
        this.isOverflowWrap();
    },

    /**
     * 获取某个家庭成员的问诊记录  member_id为-1时，获取的是未归档的记录
     */
    loadInquiryData: function (page, callback) {
        LMEPG.UI.showWaitingDialog('');
        var reqData = {
            'member_id': RenderParam.memberID,
            'page_current': page
        };
        LMEPG.ajax.postAPI('Doctor/getInquiryRecordDetail', reqData, function (recordDetailData) {
            Hide('content');
            LMEPG.UI.dismissWaitingDialog();
            try {
                recordDetailData = recordDetailData instanceof Object ? recordDetailData : JSON.parse(recordDetailData);
                console.log(recordDetailData);
                if (recordDetailData.result === 0 || recordDetailData.result === '0') {
                    Detail.page = page;
                    Detail.pageNum = recordDetailData.count;
                    var recordList = recordDetailData.list;
                    if (recordList.length > 0) {
                        Show('content');
                        Detail.inquiryItem = recordList[0];
                        callback();
                    } else {
                        LMEPG.BM.init('', [], '', true);
                        G('null-data-000051').style.display = 'block';
                        Hide('content');
                    }
                } else {
                    LMEPG.UI.showToast('获取数据失败:' + data.result);
                    onBack();
                }
            } catch (e) {
                console.log(e);
                LMEPG.UI.showToast('获取数据解析异常:' + e.toString());
                // onBack();
                G('debug').innerHTML = e.toString();
            }
        }, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast('获取数据请求失败');
            onBack();
        });
    },

    /**
     * 删除问诊记录弹窗
     */
    showDeleteDialog: function (btn) {
        modal.commonDialog({beClickBtnId: btn.id, onClick: Detail.deleteInquiryRecord}, '', '删除后不可恢复，您确定删除', '');
    },

    /**
     * 删除问诊记录
     */
    deleteInquiryRecord: function () {
        modal.hide();
        LMEPG.UI.showWaitingDialog('');
        var reqData = {
            'inquiryId': Detail.inquiryItem.inquiry_id
        };
        LMEPG.ajax.postAPI('Doctor/deleteInquiryRecord', reqData, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
            if (data.result == 0) {
                LMEPG.UI.showToast('删除成功！');
                // 重新加载页面
                PageJump.reloadCurrPage();
            } else {
                LMEPG.UI.showToast('删除失败！');
            }
        });
    },

    /**
     * 日期转换
     * @param value
     * @returns {string}
     */
    getInquiryDurationTime: function (value) {
        var result = parseInt(value) || 0
        var h = Math.floor(result / 3600);
        var m = Math.floor((result / 60 % 60));
        var s = Math.floor((result % 60));

        var res = '';
        if(h != 0) res += h+'小时';
        if(m != 0) res += m+'分';
        res += s+'秒';
        return res;
    },

    getStandardDt: function (dt) {
        var time = dt.replace(/-/g, ':').replace(' ', ':');
        time = time.split(':');
        var resultTime = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
        return resultTime;
    },

    escape2Html: function (str) {
        var arrEntities = {'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
            return arrEntities[t];
        });
    },
    /**
     * 归档/再次问诊
     */
    clickArchiveOrInquiryAgain: function (btnObj) {
        LMEPG.UI.forbidDoubleClickBtn(function () {
            if (RenderParam.isArchived == 1) {
                // 再次问诊
                LMEPG.Inquiry.p2pApi.getDoctorDetail(Detail.inquiryItem.doctor_id, function (doctorData) {
                    console.log('再次问诊');
                    var currentPage = PageJump.getCurrentPage();
                    var memberObj = JSON.parse(Detail.escape2Html(RenderParam.memberObj));
                    var inquiryInfo = {
                        userInfo: {
                            isVip: RenderParam.isVip,                                    // 用户身份信息标识
                            accountId: RenderParam.accountId,                            // IPTV业务账号
                        },
                        memberInfo: {
                            member_id: memberObj.member_id,
                            member_name: memberObj.member_name,
                            member_age: memberObj.member_age,
                            member_gender: memberObj.member_gender
                        },                                                // 问诊成员信息（从家庭成员已归档记录里面进行问诊，该参数标识成员身份）
                        moduleInfo: {
                            moduleId: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_ID,        // 问诊模块标识 - 在线问医
                            moduleName: LMEPG.Inquiry.p2p.ONLINE_INQUIRY_MODULE_NAME,    // 问诊模块名称 - 在线问医
                            moduleType: LMEPG.Inquiry.p2p.InquiryEntry.ONLINE_INQUIRY,   // 问诊模块标识 - 在线问医
                            focusId: btnObj.id,                                          // 当前页面的焦点Id
                            intent: currentPage,                           // 当前模块页面路由标识
                        },
                        serverInfo: {
                            fsUrl: RenderParam.fsUrl,                                    // 文件资源服务器链接地址，一键问医获取按钮图片时用到
                            cwsHlwyyUrl: RenderParam.CWS_HLWYY_URL,                      // cws互联网医院模块链接地址
                            teletextInquiryUrl: RenderParam.teletextInquiryUrl,          // 微信图文问诊服务器链接地址
                        },
                        doctorInfo: doctorData.doc_info,                                 // 问诊医生详情
                        inquiryTypeList: doctorData.inquiry_type_list,                   // 当前地区支持的问诊方式列表
                        blacklistHandler: Detail.inquiryBlacklistHandler,                // 校验用户黑名单时处理函数
                        noTimesHandler: Detail.noInquiryTimesHandler,                    // 检验普通用户无问诊次数处理函数
                        doctorOfflineHandler: Detail.showDoctorOfflineTips,              // 检验医生离线状态时处理函数
                        inquiryEndHandler: Detail.inquiryEndHandler,                     // 检测医生问诊结束之后，android端回调JS端的回调函数
                        inquiryByPlugin: RenderParam.isRunOnAndroid === '0' ? '1' : '0', // 断是否使用问诊插件进行问诊（APK版本直接调回android端进行问诊）
                    }

                    // 显示问诊方式选择对话框
                    LMEPG.Inquiry.dialog.showMultiTypeInquiryDialog(inquiryInfo);
                });
            } else {
                // 归档
                PageJump.jumpDoctorRecordArchive();
            }
        });
    },

    /**
     * 检测当前用户黑名单时处理函数
     * @param focusIdOnHideDialog 提示弹窗消失后回复页面的焦点
     */
    inquiryBlacklistHandler: function (focusIdOnHideDialog) {
        var forbiddenAskTips = '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。';
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: modal.hide
        }, '', forbiddenAskTips, '');
    },

    /**
     * 检测当前用户无问诊次数时处理函数
     * @param focusIdOnHideDialog 提示弹窗消失后回复页面的焦点
     */
    noInquiryTimesHandler: function (focusIdOnHideDialog) {
        var noInquiryTimesTips = '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊'
        modal.commonDialog({
            beClickBtnId: focusIdOnHideDialog,
            onClick: PageJump.jumpBuyVip
        }, '', noInquiryTimesTips, '');
    },

    /**
     * 医生不在线处理函数
     */
    showDoctorOfflineTips: function () {
        LMEPG.UI.showToast('当前医生不在线');
    },

    /**
     * 医生问诊结束处理函数
     */
    inquiryEndHandler: function () {

    },

    /**
     * 上下翻页
     * @param dir
     * @param btn
     */
    turnPage: function (dir, btn) {
        if (dir == 'up') {
            if (Detail.page == 1) {
                return false;
            }
            Detail.loadInquiryData(Detail.page - 1, function () {
                Detail.render(Detail.inquiryItem);
            });
            return false;
        } else if (dir == 'down') {
            if (Detail.page == Detail.pageNum) {
                return false;
            }
            Detail.loadInquiryData(Detail.page + 1, function () {
                Detail.render(Detail.inquiryItem);
            });
            return false;
        }
    },

    /**
     * 上下箭头更新
     */
    updateArrows: function () {
        S('prev-arrow');
        S('next-arrow');
        if (Detail.page == 1) {
            H('prev-arrow');
        }
        if (Detail.page == Detail.pageNum) {
            H('next-arrow');
        }
    }
};

/**
 * ===============================处理跳转===============================
 */
var PageJump = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('doctorRecordDetail');
        currentPage.setParam('memberID', RenderParam.memberID);
        currentPage.setParam('memberName', RenderParam.memberName);
        currentPage.setParam('isArchived', RenderParam.isArchived); // 1-已归档 0-未归档
        currentPage.setParam('initPage', Detail.page); // 跳转到问诊记录的第几页
        currentPage.setParam('memberObj', RenderParam.memberObj); // 当前成员的信息
        return currentPage;
    },

    /**
     * 跳转购买vip页面
     */
    jumpBuyVip: function () {

        // --------上报局方使用模块数据 start--------
        if (RenderParam.carrierId === "10000051") {
            var clickTime = new Date().getTime();
            var deltaTime = Math.round((clickTime - initTime) / 1000);
            var postData = {
                "type": 7,
                "operateResult": "检测记录再次问医",
                "stayTime": deltaTime
            };
            LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", postData, LMEPG.emptyFunc, LMEPG.emptyFunc);
        }
        // --------上报局方使用模块数据 end--------

        var objCurrent = PageJump.getCurrentPage();
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 可归档家庭成员页面
     */
    jumpDoctorRecordArchive: function () {
        var objCurrent = PageJump.getCurrentPage();
        objCurrent.setParam('memberID', -1);
        objCurrent.setParam('memberName', '无');
        objCurrent.setParam('isArchived', 0); // 1-已归档 0-未归档
        objCurrent.setParam('comeFrom', RenderParam.comeFrom);
        var jumpObj = LMEPG.Intent.createIntent('doctorRecordArchive');
        jumpObj.setParam('inquiryID', Detail.inquiryItem.inquiry_id);
        jumpObj.setParam('comeFrom', RenderParam.comeFrom);
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    /**
     * 重新加载当前页面
     */
    reloadCurrPage: function () {
        var jumpObj = LMEPG.Intent.createIntent('doctorRecordDetail');
        jumpObj.setParam('memberID', RenderParam.memberID);
        jumpObj.setParam('memberName', RenderParam.memberName);
        jumpObj.setParam('isArchived', RenderParam.isArchived); // 1-已归档 0-未归档
        LMEPG.Intent.jump(jumpObj, null);
    }
};

/**
 * ==========================================网络请求=================================================
 */
var Network = {

    updateReadStatus: function () {
        LMEPG.ajax.postAPI('Measure/updateReadStatus', {
            'memberId': RenderParam.memberID,
            'type': '1',
            'paperType': ''
        }, function (data) {
            if (data.result !== 0) {
                LMEPG.UI.showToast('数据状态改变出错');
            }
            console.log(data)
        })
    }
};

var onBack = function () {
    if (RenderParam.isArchived == 0) { // 未归档
        var jumpObj = LMEPG.Intent.createIntent('healthTestArchivingList');
        jumpObj.setParam('page', Math.ceil(Detail.page / 5));
        jumpObj.setParam('focusId', 'focus-' + (Detail.page % 5 - 1));
        jumpObj.setParam('showAskDoctorTab', 1);
        jumpObj.setParam('isFromAskDoctorDetailPageBack', 1);
        jumpObj.setParam('comeFrom', RenderParam.comeFrom);
        LMEPG.Intent.jump(jumpObj, null);
    } else {
        LMEPG.Intent.back();
    }
};
