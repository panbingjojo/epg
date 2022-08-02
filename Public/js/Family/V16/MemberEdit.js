var MemberEdit = {
    buttons: [],
    init: function () {
        this.createBtns();
        this.isEditAction();
        this.updateMember();
    },
    /*编辑模式传过来的数据*/
    editData: {
        /*是否是编辑模式*/
        edit: false,
        member: '爸爸',
        data: ['42', '176', '58']
    },
    /*编辑模式添加dom*/
    isEditAction: function () {
        Hide('delete-member');
        // 1-添加 2-编辑
        if (RenderParam.actionType == 2) {
            Show('delete-member');
            // var deleteElementBtn = new Image();
            // deleteElementBtn.id = 'delete-member';
            // deleteElementBtn.src = g_appRootPath + '/Public/img/hd/Family/V13/btn_delete.png';
            // document.body.appendChild(deleteElementBtn);
            G('call-wrap').innerHTML = '<li></li><li id="select-member"  class="edit-member">' + RenderParam.memberList[0].member_name + '</li><li></li>';
            G('title').innerHTML = '家庭成员编辑';
        }
    },

    onFocusChangeColor: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.setAttribute('class', 'focus');
        } else {
            btnElement.removeAttribute('class');
        }
    },
    /*数字减*/
    sub_number: function (btn) {
        var count = +G(btn.id).innerText;
        var max = btn.id == 'select-age' ? 150 : 300;
        if (btn.id == 'select-weight') {
            count = count - 0.5 < 0 ? max : count - 0.5;
        } else {
            count = count - 1 < 0 ? max : count - 1;
        }
        this.update_number(btn.id, count, max);
    },
    /*数字加*/
    add_number: function (btn) {
        var count = +G(btn.id).innerText;
        var max = btn.id == 'select-age' ? 150 : 300;
        switch (btn.id) {
            case 'select-age':    // 年龄设置最大150岁
                count = count + 1 > max ? 0 : count + 1;
                break;
            case 'select-height': // 身高设置最大300厘米;
                count = count + 1 > max ? 0 : count + 1;
                break;
            case 'select-weight': // 体重最大为300千克
                count = count + 0.5 > max ? 0 : count + 0.5;
                break;
        }
        this.update_number(btn.id, count, max);
    },
    /*更新数字*/
    update_number: function (id, count, max) {
        var personArea = id.slice(7); // 截取要操作的Id(age,height,weight)
        if (id == 'select-weight') {
            G('prev-' + personArea).innerHTML = count - 0.5 < 0 ? max : count - 0.5;
            G(id).innerHTML = count;
            G('next-' + personArea).innerHTML = count + 0.5 > max ? 0 : count + 0.5;
        } else {
            G('prev-' + personArea).innerHTML = count - 1 < 0 ? max : count - 1;
            G(id).innerHTML = count;
            G('next-' + personArea).innerHTML = count + 1 > max ? 0 : count + 1;
        }
    },
    /*键盘上、下键修改数字*/
    onBeforeMoveChangeNumber: function (key, btn) {
        var _this = MemberEdit;
        if (key == 'up') {
            _this.sub_number(btn);
        }
        if (key == 'down') {
            _this.add_number(btn);
        }
    },
    /*添加模式成员选择上一个*/
    prevMember: function () {
        RenderParam.memberList.unshift(RenderParam.memberList.pop());
        this.updateMember();
    },
    /*添加模式成员选择下一个*/
    nextMember: function () {
        RenderParam.memberList.push(RenderParam.memberList.shift());
        this.updateMember();
    },
    /*渲染成员数据*/
    updateMember: function () {
        if (RenderParam.actionType == 2) { // 编辑
            G('select-member').innerHTML = RenderParam.memberList[0].member_name;
            G('select-age').innerHTML = RenderParam.memberList[0].member_age;
            G('select-height').innerHTML = RenderParam.memberList[0].member_height;
            G('select-weight').innerHTML = RenderParam.memberList[0].member_weight;
            this.moveToFocus('select-age');
            LMEPG.BM.getButtonById('select-member').focusable = false;
        } else {
            // 添加成员时，至少有一个成员，数组长度至少为1
            var len = RenderParam.memberList.length;
            if (len - 1 > 0 && len - 1 != 1) {
                G('prev-member').innerHTML = RenderParam.memberList[len - 1].member_name;
            } // 前一项
            G('select-member').innerHTML = RenderParam.memberList[0].member_name; // 中间项
            if (len >= 2) {
                G('next-member').innerHTML = RenderParam.memberList[1].member_name;
            } // 后一项
        }
        // 设置头像
        G('icon-member').src = g_appRootPath + '/Public/img/hd/Family/V16/member_' + RenderParam.memberList[0].member_image_id + '.png';
        this.setDefaultBodyPartNumber();
    },
    /*设置年龄、身高、体重根据选中家庭成员名称的默认数据*/
    setDefaultBodyPartNumber: function () {
        var defaultConfig = {
            age: [
                ['爸爸', '妈妈', 40],
                ['爷爷', '奶奶', 70],
                ['儿子', '女儿', 20],
                ['女性', '男性', 30]
            ],
            height: [
                ['爸爸', '爷爷', '儿子', '男性', 175],
                ['妈妈', '奶奶', '女儿', '女性', 165]
            ],
            weight: [
                ['爸爸', '爷爷', '儿子', '男性', 70],
                ['妈妈', '奶奶', '女儿', '女性', 60]
            ]
        };
        var age = this.getBodyPartNumber(defaultConfig.age);
        var height = this.getBodyPartNumber(defaultConfig.height);
        var weight = this.getBodyPartNumber(defaultConfig.weight);
        if (RenderParam.actionType == 2) { // 编辑
            age = RenderParam.memberList[0].member_age;
            height = RenderParam.memberList[0].member_height;
            weight = RenderParam.memberList[0].member_weight;
        }
        this.update_number('select-age', +age);
        this.update_number('select-height', +height);
        this.update_number('select-weight', +weight);
    },
    /*获取dom设置的成员返回该成员的数据*/
    getBodyPartNumber: function (part) {
        var arr = 20;
        var member = G('select-member').innerHTML;
        for (var i = 0; i < part.length; i++) {
            var list = part[i];
            for (var j = 0; j < list.length; j++) {
                var item = list[j];
                if (item == member) {
                    arr = list[list.length - 1];
                }
            }
        }
        return arr;
    },
    /*全部成员*/
    member: ['爷爷', '奶奶', '爸爸', '妈妈', '男孩', '女孩', '女性', '男性'],
    /*添加模式键盘上、下键切换成员*/
    onBeforeMoveSwitchMember: function (key, btn) {
        var _this = MemberEdit;
        if (_this.editData.edit) {
            return;
        }
        if (key == 'up') {
            _this.prevMember();
        }
        if (key == 'down') {
            _this.nextMember();
        }
    },
    createBtns: function () {
        this.buttons.push({
            id: 'select-member',
            name: '家庭成员',
            type: 'div',
            nextFocusRight: 'select-age',
            // focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V16/member_f.png' : g_appRootPath + '/Public/img/hd/Family/V16/member_f.png',
            focusImage: g_appRootPath + '/Public/img/hd/Family/V16/member_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
            beforeMoveChange: this.onBeforeMoveSwitchMember
        }, {
            id: 'select-age',
            name: '年龄',
            type: 'others',
            nextFocusLeft: 'select-member',
            nextFocusRight: 'select-height',
            focusChange: this.onFocusChangeColor,
            beforeMoveChange: this.onBeforeMoveChangeNumber
        }, {
            id: 'select-height',
            name: '身高',
            type: 'others',
            nextFocusLeft: 'select-age',
            nextFocusRight: 'select-weight',
            focusChange: this.onFocusChangeColor,
            beforeMoveChange: this.onBeforeMoveChangeNumber
        }, {
            id: 'select-weight',
            name: '体重',
            type: 'others',
            nextFocusLeft: 'select-height',
            nextFocusRight: 'submit',
            focusChange: this.onFocusChangeColor,
            beforeMoveChange: this.onBeforeMoveChangeNumber
        }, {
            id: 'submit',
            name: '提交',
            type: 'img',
            nextFocusLeft: 'select-weight',
            nextFocusUp: 'delete-member',
            focusImage: g_appRootPath + '/Public/img/hd/Family/V16/submit_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Family/V16/submit.png',
            click: this.addMember
        }, {
            id: 'delete-member',
            name: '删除成员',
            type: 'img',
            nextFocusLeft: 'select-weight',
            nextFocusDown: 'submit',
            focusImage: g_appRootPath + '/Public/img/hd/Family/V16/btn_delete_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Family/V16/btn_delete.png',
            click: this.delMemberModal
        });
        this.initButtons('select-member');
    },
    initButtons: function (id) {
        LMEPG.ButtonManager.init(id, this.buttons, '', true);
    },
    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    /**
     * 添加或修改家庭成员
     */
    addMember: function () {
        LMEPG.UI.showWaitingDialog('');
        var postData = {
            'member_id': RenderParam.memberList[0].member_id,
            'member_name': RenderParam.memberList[0].member_name,
            'member_age': G('select-age').innerHTML,
            'member_gender': RenderParam.memberList[0].member_gender,
            'member_height': G('select-height').innerHTML,
            'member_weight': G('select-weight').innerHTML,
            'member_image_id': RenderParam.memberList[0].member_image_id
        };
        // 1-添加 2-编辑
        var tip;
        if (RenderParam.actionType == 2) {
            tip = '编辑';
        } else {
            tip = '添加';
        }
        LMEPG.ajax.postAPI('Family/addMember', postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data instanceof Object) {
                    if (data.result == 0) {
                        // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                        LMEPG.KeyEventManager.setAllowFlag(false);
                        LMEPG.UI.showToast(tip + '成功！', 1.5, function () {
                            onBack();
                        });
                    } else {
                        LMEPG.UI.showToast(tip + '失败！' + data.result);
                    }
                } else {
                    LMEPG.UI.showToast(tip + '失败！');
                }
            } catch (e) {
                LMEPG.UI.showToast(tip + '异常！');
            }
        }, function () {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast(tip + '异常！');
        });
    },

    /**
     * 删除家庭成员弹窗
     */
    delMemberModal: function (btn) {
        modal.commonDialog({beClickBtnId: btn.id, onClick: MemberEdit.delMember}, '', '删除该家庭成员，将同时删除检测及问诊记录', '');
    },

    /**
     * 删除家庭成员
     */
    delMember: function () {
        modal.hide();
        LMEPG.UI.showWaitingDialog();
        var postData = {
            'member_id': RenderParam.memberList[0].member_id
        };
        LMEPG.ajax.postAPI('Family/delMember', postData, function (rsp) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data instanceof Object) {
                    if (data.result == 0) {
                        // 延迟处理，避免showToast未渲染出背景图仅显示出提示文本就执行onBack了。
                        LMEPG.KeyEventManager.setAllowFlag(false);
                        LMEPG.UI.showToast('删除成功！', undefined, function () {
                            onBack();
                        });
                    } else {
                        LMEPG.UI.showToast('删除失败！' + data.result);
                    }
                } else {
                    LMEPG.UI.showToast('删除失败！');
                }

            } catch (e) {
                LMEPG.UI.showToast('删除异常！');
            }
        }, function () {
            LMEPG.UI.dismissWaitingDialog();
            LMEPG.UI.showToast('删除异常！');
        });
    }
};

var onBack = function () {
    LMEPG.Intent.back();
};

window.onload = function () {
    MemberEdit.init();

    // 设置皮肤（产品背景图）
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        var bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
        document.body.style.backgroundImage = 'url(' + bgImg + ')';
    }
};
