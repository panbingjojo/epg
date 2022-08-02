// 用户绑定电话号码成功提示
var BIND_PHONE_NUMBER_SUCCESS_TIPS = '绑定成功！';
// 用户更换电话号码成功提示
var CHANGE_PHONE_NUMBER_SUCCESS_TIPS = '更换成功！';

var MemberEdit = {
    buttons: [],
    clearTimer: null,
    //清除提示框定时器
    clearTimer1: null,
    clearTimer2: null,
    //暂不支持健康检测的地区
    testRecordDisableCarriers: ["10220095"],
    init: function () {
        this.hideEditPhoneDialog();
        this.createBtns();
        this.isEditAction();
        this.updateMember();
        this.hidePhone();
    },

    /**
     *  隐藏编辑手机号码弹框
     */
    hideEditPhoneDialog: function() {
        // 编辑手机号码弹框隐藏
        Hide('inputPhone');
        // 编辑手机号码相关提示弹窗隐藏
        Hide('pointOut');
    },
    /*编辑模式传过来的数据*/
    editData: {
        /*是否是编辑模式*/
        edit: false,
        member: '爸爸',
        data: ['42', '176', '58']
    },
    hidePhone: function () {
        if (RenderParam.memberList[0].member_id === 0) {
            G("body-setPhone").style.display = "none";
            G("tips").style.display = "none";
            G("btn_phone").style.display = "none";
            MemberEdit.buttons[4].nextFocusDown = ""
            MemberEdit.buttons[4].nextFocusUp = ""
        }
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
        var max = btn.id == 'select-age' ? 127 : 300;
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
        var max = btn.id == 'select-age' ? 127 : 300;
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
        G('icon-member').src = g_appRootPath + '/Public/img/hd/Family/V13/member_' + RenderParam.memberList[0].member_image_id + '.png';
        this.setDefaultBodyPartNumber();
        // 判断该成员是否绑定手机号
        this.updatePhoneNumber();
    },

    /**
     * 更新显示家庭成员手机号，如果手机号不为空，则显示已绑定的手机号，按钮提示更换手机号
     * 如果手机号为空，则提示用户绑定手机号
     */
    updatePhoneNumber: function() {
        var memberTel = RenderParam.memberList[0].member_tel;
        if (typeof memberTel == 'undefined' || memberTel === 0 || memberTel === '') {
            G("setPhone").innerHTML = "您还未绑定手机号";
            G("btn_phone").innerHTML = "绑定手机号";
            G("identifyingCodeToast").innerHTML = "请绑定手机号";
        } else {
            G("setPhone").innerHTML = memberTel;
            G("btn_phone").innerHTML = "更换手机号";
            G("identifyingCodeToast").innerHTML = "更换绑定手机号";
        }
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
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/member_f.png' : g_appRootPath + '/Public/img/hd/Family/V13/member_f.png',
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
            nextFocusDown: 'btn_phone',
            focusImage: g_appRootPath + '/Public/img/hd/Family/V13/submit_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/submit.png',
            click: this.addMember
        }, {
            id: 'btn_phone',
            name: '绑定电话号码',
            type: 'div',
            nextFocusLeft: 'setPhone',
            nextFocusUp: 'submit',
            focusImage: g_appRootPath + '/Public/img/hd/Family/V13/setphone_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/setphone.png',
            click: this.setPhone
        }, {
            id: 'phone_submit',
            name: '电话号码',
            type: 'others',
            nextFocusLeft: '',
            nextFocusUp: 'identifyingCode',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Family/V13/phone_submit_f.png' : g_appRootPath + '/Public/img/hd/Family/V13/phone_submit_f.png',
            backgroundImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Family/V13/phone_submit.png' : g_appRootPath + '/Public/img/hd/Family/V13/phone_submit.png',
            click: this.checkIdentifyingCode
        }, {
            id: 'phone_number',
            name: '电话号码',
            type: 'div',
            nextFocusDown: 'identifyingCode',
            nextFocusUp: '',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Family/V13/phone_number_bg_f.png' : g_appRootPath + '/Public/img/hd/Family/V13/phone_number_bg_f.png',
            backgroundImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Family/V13/phone_number_bg.png' : g_appRootPath + '/Public/img/hd/Family/V13/phone_number_bg.png',
            click: this.inputphonenumber
        }, {
            id: 'identifyingCode',
            name: '验证码',
            type: 'div',
            nextFocusRight: 'btn_identifyingCode',
            nextFocusUp: 'phone_number',
            nextFocusDown: 'phone_submit',
            focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Family/V13/identifyingCode_f.png' : g_appRootPath + '/Public/img/hd/Family/V13/identifyingCode_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/identifyingCode.png',
            click: this.inputphonenumber1
        }, {
            id: 'btn_identifyingCode',
            name: '电话号码',
            type: 'div',
            nextFocusLeft: 'identifyingCode',
            nextFocusUp: 'phone_number',
            nextFocusDown: 'phone_submit',
            focusImage: g_appRootPath + '/Public/img/hd/Family/V13/countdown_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/countdown.png',
            click: this.identifyingCode
        }, {
            id: 'delete-member',
            name: '删除成员',
            type: 'img',
            nextFocusLeft: 'select-weight',
            nextFocusDown: 'submit',
            focusImage: g_appRootPath + '/Public/img/hd/Family/V13/btn_delete_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/btn_delete.png',
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
            'member_image_id': RenderParam.memberList[0].member_image_id,
            'member_tel': RenderParam.memberList[0].member_tel ? RenderParam.memberList[0].member_tel : ''
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
                            LMEPG.Intent.back()
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
    //绑定电话号码
    setPhone: function () {
        Show("inputPhone");
        LMEPG.BM.requestFocus("phone_number");
    },
    // 输入手机号与验证码
    inputphonenumber: function (btn) {
        LMEPG.UI.keyboard.show(870, 370, btn.id, btn.id, true);
    },
    inputphonenumber1: function (btn) {
        LMEPG.UI.keyboard.show(870, 370, btn.id, btn.id, true);
    },
    identifyingCode: function (input, isReset) {
        var userTel = G("phone_number").innerText;
        var identifyingCodeText = G("btn_identifyingCode").innerHTML
        // 判断手机号是否正确
        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast('请输入有效的电话', 1);
            return;
        }
        //验证码倒计时时不能请求获得验证码
        if (identifyingCodeText === "获取验证码" || identifyingCodeText === "重新获取") {
            //   请求得到验证码
            MemberEdit.getidentifyingCode()
        } else {
            LMEPG.UI.showToast('请稍等', 1);
        }
    },
    // 请求得到验证码
    getidentifyingCode: function () {
        var user_tel = G("phone_number").innerHTML;
        var postData = {
            'user_tel': user_tel,
            "send_sms": 1
        };
        LMEPG.ajax.postAPI('User/getIdentifyingCode', postData, function (rsp) {
            var identifyingCountdown = 120;
            G("btn_identifyingCode").innerHTML = identifyingCountdown + "s";
            MemberEdit.clearTimer = setInterval(MemberEdit.identifyingCodeTime, 1000);
        }, function () {
            alert("获取验证码失败")
        });

    },
    //验证码验证倒计时
    identifyingCodeTime: function () {
        var identifyingCodeTime = parseInt(G("btn_identifyingCode").innerHTML) - 1;
        if (identifyingCodeTime <= 0) {
            clearInterval(MemberEdit.clearTimer);
            G("btn_identifyingCode").innerHTML = "重新获取";
        } else {
            G("btn_identifyingCode").innerHTML = identifyingCodeTime + "s";
        }
    },
    //验证验证码
    checkIdentifyingCode: function () {
        var identifyingCode = G("identifyingCode").innerHTML;
        var user_tel = G("phone_number").innerHTML;
        if (identifyingCode !== "请输入验证码" || identifyingCode == "") {
            var postData = {
                'phone': user_tel,
                'sms_code': identifyingCode,
                "type": 8
            };

            LMEPG.ajax.postAPI('Doctor/verifyTelCode', postData, function (rsp) {
                if (rsp.result === 0) {
                    // 上报现在绑定的号码
                    var postData1 = {
                        'member_id': RenderParam.memberList[0].member_id,
                        'member_tel': user_tel
                    };
                    //上报号码
                    LMEPG.ajax.postAPI('Family/bindPhoneNumber', postData1, function (rsp) {
                        if (rsp.result === 0) {
                            RenderParam.memberList[0].member_tel = user_tel;
                            Hide("inputPhone");
                            Show("pointOut");
                            G("identifyingCodeToast").innerHTML = "更换绑定手机号";
                            clearInterval(MemberEdit.clearTimer);
                            G("btn_identifyingCode").innerHTML = "获取验证码";
                            //区别是绑定还是更换
                            if (G("btn_phone").innerHTML === "绑定手机号") {
                                G("pointOut1").innerHTML = BIND_PHONE_NUMBER_SUCCESS_TIPS;
                            } else {
                                G("pointOut1").innerHTML = CHANGE_PHONE_NUMBER_SUCCESS_TIPS;
                            }
                            MemberEdit.isBindPhoneNum = true;
                            setTimeout(function () {
                                Hide('pointOut'); // 隐藏操作成功提示弹窗
                                MemberEdit.updatePhoneNumber(); // 修改页面显示
                                LMEPG.BM.requestFocus("btn_phone");
                            }, 2000);
                        }
                    }, function () {
                    });
                } else {
                    Hide("inputPhone");
                    Show("pointOut");
                    G("pointOut1").innerHTML = "验证码错误，请重新填写！"
                    MemberEdit.tipsTimer = setTimeout(function () {
                        Hide("pointOut");
                        Show('inputPhone');
                        LMEPG.BM.requestFocus("phone_number");
                    }, 2000);
                }
            }, function () {
                alert("验证验证码失败")
            });
        } else {
            Hide("inputPhone");
            Show("pointOut");
            G("pointOut1").innerHTML = "请输入验证码！";
            MemberEdit.tipsTimer = setTimeout(function () {
                Hide("pointOut");
                Show('inputPhone');
                LMEPG.BM.requestFocus("phone_number");
            }, 2000);
        }

    },
    //显示验证结果弹窗
    pointOut: function () {
        Hide("pointOut");
        Show("inputPhone")
    },
    /**
     * 删除家庭成员弹窗
     */
    delMemberModal: function (btn) {
        var text = "删除该家庭成员，将同时删除检测及问诊记录";
        if(MemberEdit.testRecordDisableCarriers.indexOf(RenderParam.carrierId) > -1){
            text = "删除家庭成员，将同时删除问诊记录";
        }
        modal.commonDialog({beClickBtnId: btn.id, onClick: MemberEdit.delMember}, '', text, '');
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
                           LMEPG.Intent.back()
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
    if (isShow('inputPhone')) { // 当前显示编辑手机号页面
        Hide('inputPhone'); // 隐藏手机号编辑页面
        LMEPG.ButtonManager.requestFocus('btn_phone'); // 恢复页面焦点
    } else if (isShow('pointOut')) {
        if (MemberEdit.tipsTimer !== null) {
            clearTimeout(MemberEdit.tipsTimer);
        }
        var tipsMessage = G('pointOut').innerHTML;
        if (tipsMessage !== BIND_PHONE_NUMBER_SUCCESS_TIPS && tipsMessage !== CHANGE_PHONE_NUMBER_SUCCESS_TIPS) {
            Hide("pointOut");
            Show('inputPhone') // 隐藏提示框
            LMEPG.BM.requestFocus("phone_number");
        }
    } else {
        LMEPG.Intent.back(); // 退出家庭成员编辑界面
    }
};

window.onload = function () {
    MemberEdit.init();

    // 设置皮肤（产品背景图）
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        var bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
        document.body.style.backgroundImage = 'url(' + bgImg + ')';
    }
};
