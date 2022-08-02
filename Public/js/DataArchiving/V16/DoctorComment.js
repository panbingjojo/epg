var Detail = {
    innerHeight: '',
    buttons: [],
    page: 1, // 当前页
    pageNum: 0, // 总页数
    inquiryItem: null, // 从后台获取的问诊记录单个详情
    inquiry39Obj: null, // 从39互联网医院获取的问诊单个详情
    scrollStatus: 0,
    dialogMsg: {
        noVideoPlugin: '视频问诊插件安装页',
        noCamera: '未检测到摄像头！请使用电话功能继续问诊。',
        forbiddenAsk: '您之前在问诊过程中的行为已违反相关法律法规，<br>不可使用在线问诊功能，同时我司已进行备案，<br>并将保留追究你法律责任的权利。',
        noTimes: '您的免费问诊次数已用完<br>订购成为VIP会员，畅想无限问诊',
        noDoctorsOnline: '暂无医生在线为您提供问诊服务\n您可选择留下联系方式，方便工作人员电话回访。'
    },
    init: function () {
        H('content');
        Detail.createBtns();
        Detail.page = !LMEPG.Func.isEmpty(RenderParam.initPage) ? RenderParam.initPage : Detail.page;
        Detail.loadInquiryData(Detail.page, function () {
            Detail.render(Detail.inquiryItem, Detail.inquiry39Obj);
        });
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
            G('archive').src = g_appRootPath + '/Public/img/hd/DataArchiving/V16/archive.png';
        } else {
            G('archive').src = g_appRootPath + '/Public/img/hd/DataArchiving/V16/inquiry_again.png';
        }
        this.buttons.push({
            id: 'archive',
            name: '归档/再次问诊',
            type: 'img',
            nextFocusUp: 'delete-result',
            nextFocusDown: '',
            nextFocusRight: 'delete-result',
            backgroundImage: RenderParam.isArchived == 0
                ? g_appRootPath + '/Public/img/hd/DataArchiving/V16/archive.png'
                : g_appRootPath + '/Public/img/hd/DataArchiving/V16/inquiry_again.png',
            focusImage: RenderParam.isArchived == 0
                ? g_appRootPath + '/Public/img/hd/DataArchiving/V16/archive_f.png'
                : g_appRootPath + '/Public/img/hd/DataArchiving/V16/inquiry_again_f.png',
            click: this.clickArchiveOrInquiryAgain,
            beforeMoveChange: Detail.turnPage
        }, {
            id: 'icon-star-0',
            name: '打星评论',
            type: 'img',
            nextFocusUp: 'archive',
            nextFocusLeft: 'icon-star-4',
            nextFocusRight: 'icon-star-1',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star_f.png',
            click: ''
        }, {
            id: 'icon-star-1',
            name: '打星评论',
            type: 'img',
            nextFocusUp: 'archive',
            nextFocusLeft: 'icon-star-0',
            nextFocusRight: 'icon-star-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star_f.png',
            click: ''
        }, {
            id: 'icon-star-2',
            name: '打星评论',
            type: 'img',
            nextFocusUp: 'archive',
            nextFocusLeft: 'icon-star-1',
            nextFocusRight: 'icon-star-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star_f.png',
            click: ''
        }, {
            id: 'icon-star-3',
            name: '打星评论',
            type: 'img',
            nextFocusUp: 'archive',
            nextFocusLeft: 'icon-star-2',
            nextFocusRight: 'icon-star-4',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star_f.png',
            click: ''
        }, {
            id: 'icon-star-4',
            name: '打星评论',
            type: 'img',
            nextFocusUp: 'archive',
            nextFocusLeft: 'icon-star-3',
            nextFocusRight: 'scroll-bar',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/star_f.png',
            click: ''
        }, {
            id: 'delete-result',
            name: '删除',
            type: 'img',
            nextFocusLeft: 'archive',
            nextFocusDown: 'scroll-bar',
            backgroundImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/delete.png',
            focusImage: g_appRootPath + '/Public/img/hd/DataArchiving/V16/delete_f.png',
            click: Detail.showDeleteDialog
        }, {
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
    render: function (inquiryItem, inquiry39Obj) {
        var disease = '';
        var medicalHistory = '';
        var advice = '';
        var docName = '';
        var docDepartment = '';
        var docJob = '';
        var time = this.getInquiryDurationTime(inquiryItem.create_dt, inquiryItem.finish_dt); // 时长
        var doctorImgStc = inquiryItem.doctor_image_url;
        console.log(doctorImgStc)
        var score = 0;

        if (inquiry39Obj.code == 0) {
            var inquiry39Item = inquiry39Obj.info;
            if (inquiry39Item instanceof Object) {
                disease = inquiry39Item.disease_desc;//主诉
                advice = inquiry39Item.diagnosis;    //建议
                medicalHistory = inquiry39Item.medical_history;//病史
                if (!LMEPG.Func.isEmpty(inquiry39Item)) {
                    if (!LMEPG.Func.isEmpty(inquiry39Item.assess_score)) {
                        score = inquiry39Item.assess_score;
                    }
                }
                docName = inquiry39Item.doc_name;
                docDepartment = inquiry39Item.department;
                docJob = inquiry39Item.job_title;

            }
        } else {
            disease = '';//主诉
            advice = '';    //建议
            medicalHistory = '';//病史
            LMEPG.UI.showToast('拉取39问诊记录异常：' + inquiry39Obj.code);
        }

        G('main-suit-content').innerHTML = disease;
        G('case-history-content').innerHTML = medicalHistory;
        G('advice-content').innerHTML = advice;
        G('duration-ask').innerHTML = time;
        G('counsel-person').innerHTML = RenderParam.memberName;
        // G('doctor-pic').src = !/.*(jpg|png).*/.test(doctorImgStc) ? g_appRootPath + '/Public/img/Common/default.png' : doctorImgStc;
        G('doctor-pic').src = doctorImgStc;
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
        LMEPG.ajax.postAPI('Doctor/getInquiryRecordDetail', reqData, function (rsp) {
            S('content');
            LMEPG.UI.dismissWaitingDialog();
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data instanceof Object) {
                    var mInquiryList = data.requiryList;
                    var mInquiry39List = data.requiry39List;

                    console.log(data);

                    if (mInquiryList.result == 0) {
                        Detail.page = page;
                        Detail.pageNum = mInquiryList.count;
                        var list = mInquiryList.list;
                        if (list.length > 0) {
                            var inquiryItem = list[0];
                            Detail.inquiryItem = inquiryItem;
                            Detail.inquiry39Obj = mInquiry39List;
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
                } else {
                    LMEPG.UI.showToast('获取数据失败');
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
     * @param createDt
     * @param finishDt
     * @returns {string}
     */
    getInquiryDurationTime: function (createDt, finishDt) {
        var mInquiryDate = '';
        try {

            var mDiff = new Date(this.getStandardDt(finishDt)).getTime() - new Date(this.getStandardDt(createDt)).getTime();
            var mDay = parseInt(mDiff / (24 * 60 * 60 * 1000));
            var mHour = parseInt((mDiff / (60 * 60 * 1000) - mDay * 24));
            var mMin = parseInt(((mDiff / (60 * 1000)) - mDay * 24 * 60 - mHour * 60));
            var mSecond = parseInt((mDiff / 1000 - mDay * 24 * 60 * 60 - mHour * 60 * 60 - mMin * 60));
            if (mHour > 0) {
                mInquiryDate = mHour + '时' + mMin + '分' + mSecond + '秒';
            } else if (mMin > 0) {
                mInquiryDate = mMin + '分' + mSecond + '秒';
            } else if (mSecond > 0) {
                mInquiryDate = mSecond + '秒';
            } else {
                mInquiryDate = 0 + '秒';
            }
        } catch (e) {
            console.log('------>' + e);
        }
        return mInquiryDate;
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
    clickArchiveOrInquiryAgain: function () {
        // 再次问诊
        if (RenderParam.isArchived == 1) {
           // 该版本样式暂未使用，如需使用该版本样式再开放功能
        }
        // 归档
        else {
            PageJump.jumpDoctorRecordArchive();
        }
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
                Detail.render(Detail.inquiryItem, Detail.inquiry39Obj);
            });
            return false;
        } else if (dir == 'down') {
            if (Detail.page == Detail.pageNum) {
                return false;
            }
            Detail.loadInquiryData(Detail.page + 1, function () {
                Detail.render(Detail.inquiryItem, Detail.inquiry39Obj);
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
        return currentPage;
    },

    /**
     * 跳转购买vip页面
     */
    jumpBuyVip: function () {
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
        var jumpObj = LMEPG.Intent.createIntent('doctorRecordArchive');
        jumpObj.setParam('inquiryID', Detail.inquiryItem.inquiry_id);
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

var onBack = function () {
    if (RenderParam.isArchived == 0) { // 未归档
        var jumpObj = LMEPG.Intent.createIntent('healthTestArchivingList');
        jumpObj.setParam('page', Math.ceil(Detail.page / 5));
        jumpObj.setParam('focusId', 'focus-' + (Detail.page % 5 - 1));
        jumpObj.setParam('showAskDoctorTab', 1);
        jumpObj.setParam('isFromAskDoctorDetailPageBack', 1);
        LMEPG.Intent.jump(jumpObj, null);
    } else {
        LMEPG.Intent.back();
    }
};
