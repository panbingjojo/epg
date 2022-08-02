var Member = {
        buttons: [],
        init: function () {
            this.createBtns();
            this.initData();
            LMEPG.BM.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'focus-1');
        },
        /*最多8个成员*/
        data: [],
        /*移动切换成员*/
        onBeforeMoveSwitchMember: function (key, btn) {
            if (key == 'left' || key == 'right') {
                Member.updateMemberArray(key, btn);
                Member.updateMemberUI(key, btn);
                LMEPG.BM.requestFocus('focus-1');
            }
        },
        currentFocusMember: '',
        updateMemberUI: function (btn) {
            var htm = '';
            if (RenderParam.memberInfo.list.length == 1) {
                RenderParam.memberInfo.list.push(
                    {member_id: 0, member_image_id: 0, member_name: '请添加家庭成员'},
                    {member_id: 0, member_image_id: 0, member_name: '请添加家庭成员'}
                );
            } else if (RenderParam.memberInfo.list.length == 2) {
                RenderParam.memberInfo.list.push(
                    {member_id: 0, member_image_id: 0, member_name: '请添加家庭成员'}
                );
            }
            var currData = RenderParam.memberInfo.list.slice(0, 3);
            currData.forEach(function (t, i) {
                    if (LMEPG.Func.isEmpty(t) || t.member_id == 0) {
                        htm += '<img id="focus-' + i + '" src="' + g_appRootPath + '/Public/img/hd/Family/V20/add_icon.png">';
                    } else {
                        htm += '<img id="focus-' + i + '" src="' + g_appRootPath + '/Public/img/hd/Family/V20/icon_member_' + t.member_image_id + '.png">';
                    }
                    if (i == 1) Member.currentFocusMember = t;
                }
            );
            G('member-wrapper').innerHTML = htm;
            G('member-call').innerHTML = Member.currentFocusMember.member_name; // 称呼
            Member.onFocusChangeUI();
        },
        onFocusChangeUI: function () {
            if (Member.currentFocusMember.member_image_id == 0) {
                H('btn-jump-action');// 隐藏添加按钮
                LMEPG.BM.getButtonById('focus-1').nextFocusDown = '';
            } else {
                S('btn-jump-action'); // 显示成员按钮
                LMEPG.BM.getButtonById('focus-1').nextFocusDown = 'ask-doctor-record';
            }
        },
        /*更新成员数组*/
        updateMemberArray: function (key) {
            if (key == 'left') {
                RenderParam.memberInfo.list.unshift(RenderParam.memberInfo.list.pop());
            } else {
                RenderParam.memberInfo.list.push(RenderParam.memberInfo.list.shift());
            }
        }
        ,
        getCurPageObj: function () {
            var objCurrent = LMEPG.Intent.createIntent('familyEdit');
            objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
            objCurrent.setParam('memberID', Member.currentFocusMember.member_id);
            return objCurrent;
        }
        ,
        /**
         * 跳转添加、编辑页面
         */
        jumpMemberEditPage: function (btn) {
            var curObj = Member.getCurPageObj();
            var memberId = Member.currentFocusMember.member_id;
            if (!+memberId) {
                var dstObj = LMEPG.Intent.createIntent('familyMembersAdd');
                dstObj.setParam('actionType', 1); // 添加
                curObj.setParam('isAddMember', true);
            } else {
                var dstObj = LMEPG.Intent.createIntent('familyMembers');
                dstObj.setParam('actionType', 2); // 编辑
                dstObj.setParam('memberID', memberId);
            }
            LMEPG.Intent.jump(dstObj, curObj,LMEPG.Intent.INTENT_FLAG_DEFAULT);
        }
        ,
        createBtns: function () {
            this.buttons.push({
                id: 'focus-1',
                name: '家庭成员',
                type: 'div',
                nextFocusUp: 'data-archiving',
                nextFocusDown: 'ask-doctor-record',
                // focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V16/btn_member_f.png' : g_appRootPath + '/Public/img/hd/Family/V16/member_radius_f.png',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V20/member_radius_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                click: this.jumpMemberEditPage,
                focusChange: this.onFocusChangeUI,
                beforeMoveChange: this.onBeforeMoveSwitchMember
            }, {
                id: 'data-archiving',
                name: '数据归档',
                type: 'img',
                nextFocusDown: 'focus-1',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V20/data_archiving_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V20/data_archiving.png',
                click: this.jumpDataArchiving,
                focusChange: '',
                beforeMoveChange: ''
            }, {
                id: 'ask-doctor-record',
                name: '问医记录',
                type: 'img',
                nextFocusUp: 'focus-1',
                nextFocusDown: 'test-record',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V20/ask_record_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V20/ask_record.png',
                click: this.jumpDoctorRecord,
                focusChange: '',
                beforeMoveChange: this.onBeforeMoveSwitchMember
            }, {
                id: 'test-record',
                name: '检测记录',
                type: 'img',
                nextFocusUp: 'ask-doctor-record',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V16/test_record_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V16/test_record.png',
                click: this.jumpHealthTestRecord,
                focusChange: '',
                beforeMoveChange: this.onBeforeMoveSwitchMember
            });
            this.initButtons('');
        }
        ,
        initButtons: function (id) {
            LMEPG.ButtonManager.init(id, this.buttons, '', true);
        }
        ,
        moveToFocus: function (id) {
            LMEPG.ButtonManager.requestFocus(id);
        }
        ,

        /**
         * 初始化数据，数据最多8条，不足8条时，用空数据补一条，代表添加+
         */
        initData: function () {
            if (RenderParam.memberInfo.result != 0) {
                LMEPG.UI.showToast('数据获取失败');
                return;
            }

            var curLen = RenderParam.memberInfo.list.length;
            if (curLen < 8) {
                RenderParam.memberInfo.list.push({member_id: 0, member_name: '请添加家庭成员', member_image_id: 0});
                if (curLen == 0) {
                    RenderParam.memberInfo.list.push({member_id: 0, member_name: '请添加家庭成员', member_image_id: 0});
                    RenderParam.memberInfo.list.push({member_id: 0, member_name: '请添加家庭成员', member_image_id: 0});
                } else if (curLen == 1) {
                    RenderParam.memberInfo.list.push({member_id: 0, member_name: '请添加家庭成员', member_image_id: 0});
                }
            } // 0代表空数据

            // 数据恢复
            var loopCount = RenderParam.memberInfo.list.length;
            if (!LMEPG.Func.isEmpty(RenderParam.memberID)) {
                while (loopCount--) {
                    if (RenderParam.memberInfo.list[1].member_id == RenderParam.memberID) {
                        break;
                    } else {
                        this.onBeforeMoveSwitchMember('right');
                    }
                }
                // 如果是从添加页面返回，焦点到最新添加成员上
                if (!LMEPG.Func.isEmpty(RenderParam.isAddMember)) {
                    this.onBeforeMoveSwitchMember('left');
                }
            }

            this.updateMemberUI(); // 显示数据
        }
        ,

        /**
         * 跳转到视频问诊记录详情
         */
        jumpDoctorRecord: function (btn) {
            var curObj = Member.getCurPageObj(btn);
            var dstObj = LMEPG.Intent.createIntent('doctorRecordDetail');
            dstObj.setParam('memberID', RenderParam.memberInfo.list[1].member_id);
            dstObj.setParam('memberName', RenderParam.memberInfo.list[1].member_name);
            dstObj.setParam('memberObj', JSON.stringify(RenderParam.memberInfo.list[1]));
            dstObj.setParam('isArchived', 1); // 1-已归档 0-未归档
            LMEPG.Intent.jump(dstObj, curObj);
        }
        ,

        /**
         * 跳转数据归档页面
         */
        jumpDataArchiving: function (btn) {
            var curObj = Member.getCurPageObj(btn);
            var dstObj = LMEPG.Intent.createIntent('healthTestArchivingList');
            dstObj.setParam('showAskDoctorTab', 1); // 是否显示归档页面的问医记录Tab
            LMEPG.Intent.jump(dstObj, curObj);
        }
        ,

        /**
         * 跳转健康检测记录
         */
        jumpHealthTestRecord: function (btn) {
            // var curObj = Member.getCurPageObj(btn);
            // var dstObj = LMEPG.Intent.createIntent('testRecord');
            // dstObj.setParam('member_id', RenderParam.memberInfo.list[1].member_id);
            // dstObj.setParam('member_name', RenderParam.memberInfo.list[1].member_name);
            // dstObj.setParam('member_image_id', RenderParam.memberInfo.list[1].member_image_id);
            // dstObj.setParam('member_gender', RenderParam.memberInfo.list[1].member_gender);
            // LMEPG.Intent.jump(dstObj, curObj);

            //ylp add 20210122 begin///
            var curObj = Member.getCurPageObj(btn);
            var dstObj = LMEPG.Intent.createIntent('testRecord');
            dstObj.setParam('member_id', RenderParam.memberInfo.list[1].member_id);
            dstObj.setParam('member_name', RenderParam.memberInfo.list[1].member_name);
            dstObj.setParam('member_image_id', RenderParam.memberInfo.list[1].member_image_id);
            dstObj.setParam('member_gender', RenderParam.memberInfo.list[1].member_gender);
            LMEPG.Intent.jump(dstObj, curObj);
            //ylp add 20210122 end///
        }
    }
;
var onBack = function () {
    LMEPG.Intent.back();
};
