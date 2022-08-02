var memberWebStr = JSON.parse(RenderParam.memberWebStr);
var memberList = []; // 家庭成员
var initInquiryID = RenderParam.initInquiryID;
var Archive = {
    page: 0,
    maxPage: 0,
    buttons: [],
    beClickBtnId: 'focus-0',
    data: [
        {id: 1232, name: '男性用户', src: g_appRootPath + '/Public/img/hd/DataArchiving/V13/man.png'},
        {id: 1232, name: '爸爸', src: g_appRootPath + '/Public/img/hd/DataArchiving/V13/father.png'},
        {id: 1232, name: '妈妈', src: g_appRootPath + '/Public/img/hd/DataArchiving/V13/mather.png'},
        {id: 1232, name: '女孩', src: g_appRootPath + '/Public/img/hd/DataArchiving/V13/girl.png'},
        {id: 1232, name: '男孩', src: g_appRootPath + '/Public/img/hd/DataArchiving/V13/boy.png'},
        {id: 1232, name: '添加', src: g_appRootPath + '/Public/img/hd/DataArchiving/V13/add.png'}
    ],
    init: function () {
        if (memberWebStr.result != 0) {
            LMEPG.UI.showToast('数据获取失败');
            return;
        } else {
            memberList = memberWebStr.list;
        }

        this.initData(); // 初始化数据
        /**
         * 起始页数为零
         * 数据最后一个除以条数再向下取整得到最大页数
         * @type {number}
         */

        Archive.page = parseInt(RenderParam.page);
        this.page = Archive.page;
        this.maxPage = Math.floor((memberList.length - 1) / 4);
        this.render();
        this.createBtns();

        // 焦点和页数保持
        if (!LMEPG.Func.isEmpty(RenderParam.focusId)) {
            LMEPG.BM.requestFocus(RenderParam.focusId);
        }
    },
    setPage: function (count) {
        var page = this.page * count;
        this.currentData = memberList.slice(page, page + count);
    },
    render: function () {
        this.setPage(4);
        var htm = '';
        this.currentData.forEach(function (t, i) {
            var image = g_appRootPath + '/Public/img/hd/DataArchiving/V13/member_' + t.member_image_id + '.png';
            htm += '<div >' +
                '<img  id="focus-' + i + '" src=' + image + '>' +
                '<p class="span_name">' + t.member_name + '</p>' +
                '</div>';
        });
        G('list-wrapper').innerHTML = htm;
        this.toggleArrow();
    },
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('testIndex');
        objCurrent.setParam('userId', RenderParam.userId);
        objCurrent.setParam('inner', RenderParam.inner);
        return objCurrent;
    },
    onClick: function (btn) {
        Archive.beClickBtnId = btn.id;
        var curPage = Archive.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('imeiInput');
        LMEPG.Intent.jump(dstPage, curPage);
    },

    onBeforeMoveChange: function (key, btn) {
        switch (true) {
            case key == 'left' && btn.id == 'focus-0':
                Archive.prevPage();
                return false;
            case key == 'right' && btn.id == 'focus-3':
                Archive.nextPage();
                return false;
        }
    },
    prevPage: function () {
        if (this.page == 0) {
            return;
        }
        Math.max(0, this.page -= 1);
        this.render();
        LMEPG.ButtonManager.requestFocus('focus-3');
    },
    nextPage: function () {
        if (this.page == this.maxPage) {
            return;
        }
        Math.min(this.maxPage, this.page += 1);
        this.render();
        LMEPG.ButtonManager.requestFocus('focus-0');
    },
    toggleArrow: function () {
        S('left-arrow');
        S('right-arrow');
        this.page == 0 && H('left-arrow');
        this.page == this.maxPage && H('right-arrow');
    },
    createBtns: function () {
        var FOCUS_COUNT = 4;
        while (FOCUS_COUNT--) {
            this.buttons.push({
                id: 'focus-' + FOCUS_COUNT,
                type: 'div',
                nextFocusLeft: 'focus-' + (FOCUS_COUNT - 1),
                nextFocusRight: 'focus-' + (FOCUS_COUNT + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/ask_f.png' : g_appRootPath + '/Public/img/hd/DataArchiving/V13/ask_f.png',
                click: this.clickMember,
                beforeMoveChange: this.onBeforeMoveChange
            });
        }
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'focus-0', this.buttons, '', true);
    },

    /**
     * 初始化数据
     */
    initData: function () {
        // 家庭成员最多8个，不足8个则添加一个“添加”家庭成员的按钮
        if (memberList.length < 8) {
            var member = {
                member_id: 0,
                member_image_id: 0,
                member_name: '添加'
            };
            memberList.push(member);
        }
    },

    /**
     * 点击成员归档/添加成员
     */
    clickMember: function (btn) {
        var index = parseInt(btn.id.substr(6));
        var member = Archive.currentData[index];
        // 添加成员
        if (member.member_id == 0) {
            PageJump.jumpMemberEditPage(btn);
        }
        // 归档
        else {
            Network.archiveRecord(member.member_id);
        }
    }
};

/**
 * =======================================页面跳转============================================
 */
var PageJump = {
    /**
     * 获取当前页面对象
     * @param obj
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurPageObj: function (obj) {
        var objCurrent = LMEPG.Intent.createIntent('doctorRecordArchive');
        objCurrent.setParam('focusId', obj.id);
        objCurrent.setParam('page', Archive.page);
        objCurrent.setParam('inquiryID', initInquiryID);
        return objCurrent;
    },

    /**
     * 跳转添加、编辑页面
     */
    jumpMemberEditPage: function (btn) {
        var curObj = PageJump.getCurPageObj(btn);
        var dstObj = LMEPG.Intent.createIntent('familyMembersEdit');
        dstObj.setParam('actionType', 1); // 添加
        LMEPG.Intent.jump(dstObj, curObj);
    }
};

/**
 * ======================================网络请求=========================================
 */
var Network = {
    /**
     * 归档用户的信息
     * @param memberID
     */
    archiveRecord: function (memberID) {
        LMEPG.UI.showWaitingDialog();
        var reqData = {
            'member_id': memberID,
            'inquiry_id': initInquiryID
        };
        LMEPG.ajax.postAPI('Doctor/setArchiveRecord', reqData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data instanceof Object) {
                    if (data.result == 0) {
                        LMEPG.UI.showToast('归档成功', 2, function () {
                            // 归档成功跳转到前一个页面的第一条
                            var dstObj = LMEPG.Intent.createIntent('doctorRecordDetail');
                            dstObj.setParam('memberID', -1);
                            dstObj.setParam('memberName', '无');
                            dstObj.setParam('isArchived', 0); // 1-已归档 0-未归档
                            LMEPG.Intent.jump(dstObj, null);
                        });
                    } else {
                        LMEPG.UI.showToast('归档失败:' + data.result);
                    }
                } else {
                    LMEPG.UI.showToast('归档失败');
                }

            } catch (e) {
                LMEPG.UI.showToast('归档失败，解析异常！');
                console.log('--->' + e.toString());
            }
            LMEPG.UI.dismissWaitingDialog();
        }, function (rsp) {
            LMEPG.UI.showToast('归档失败请求失败！');
            LMEPG.UI.dismissWaitingDialog();
        });
    }
};
var onBack = function () {
    LMEPG.Intent.back();
};
