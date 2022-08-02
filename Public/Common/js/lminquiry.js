/**
 * 统一调用apk端与视频问诊相关的功能
 * Created by yzq on 2019/1/23
 * Modified by RenJiaFen at 2021/05/24 -- 修改兼容多种问诊方式
 */
LMEPG.Inquiry = (function () {

    var InnerView = {

        dialogElement: null, // 对话框节点
        dialogId: 'dialog_container',        // 对话框节点ID
        dialogButtons: [],   // 对话框内部的按钮
        focusIdOnDialogHide: '', // 对话框隐藏后需要获取的焦点，防止页面失去焦点

        countdownTimer: null, // 获取短信验证码倒计时定时器
        isGetCheckCode: false, // 是否点击获取短信验证码
        SMSCountDown: 60, // 倒计时时间，常规定义60秒


        INQUIRY_TYPE_ITEM_PREFIX: 'inquiry-type-', // 问诊方式交互焦点命名前缀
        ONE_LINE_SHOW_INQUIRY_TYPES: 2,

        /**
         * 展示多种问诊方式选择框
         * @param inquiryInfo 问诊相关信息，参数内容同P2PObj的startInquiry方法
         */
        showMultiTypeInquiryDialog: function (inquiryInfo) {
            // 对话框内容样式表
            var innerStyle = { // TODO 标清样式兼容
                // 背景
                background: "margin-top: 124px;width: 772px;height: 466px;",
                // 标题
                title: "position: absolute;top: 198px;left: 306px;color: white;font-size: 48px;font-weight: bold;",
                // 副标题
                subTitle: "position: absolute;top: 283px;left: 306px;color: white;font-size: 30px;",
                // 问诊方式容器
                inquiryTypeContainer: "position: absolute;top: 344px;left: 285px;",
                // 问诊方式
                inquiryType: "margin-top: 20px;margin-left: 20px",
            }

            // 初始化焦点按钮
            var _buttons = [];

            // 初始化对话框内容
            var focusId = '';                          // 对话框默认初始化焦点
            var htmlContent = '<img style="' + innerStyle.background + '" src=' + g_appRootPath + '/Public/img/hd/Inquiry/Common/bg_one_key_inquiry.png alt="图片背景">';
            if (RenderParam.carrierId==='110052') {
                htmlContent += '<div style="' + innerStyle.title + '">一键问诊，方便快捷</div>';
                htmlContent += '<div style="' + innerStyle.subTitle + '">请选择连接方式</div>';
            }else {
                htmlContent += '<div style="' + innerStyle.title + '">一键问医，方便快捷</div>';
                htmlContent += '<div style="' + innerStyle.subTitle + '">请选择问诊方式</div>';
            }

            htmlContent += '<ul style="' + innerStyle.inquiryTypeContainer + '">';
            var doctorInfo = inquiryInfo.doctorInfo;
            // 渲染医生问诊方式
            var inquiryTypeList = inquiryInfo.inquiryTypeList;
            // 循环遍历问诊方式列表
            for (var i = 0; i < inquiryTypeList.length; i++) {
                // 获取当前问诊方式
                var inquiryTypeItem = inquiryTypeList[i];
                if (i % InnerView.ONE_LINE_SHOW_INQUIRY_TYPES === 0) {
                    htmlContent += '<li>';
                }
                // 判断当前方式是否显示
                if (inquiryTypeItem.is_show === '1') {
                    // 判断当前方式显示可用
                    var isInquiryTypeEnable = false;
                    switch (inquiryTypeItem.inquiry_type) {
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
                    if (isInquiryTypeEnable) {
                        // 当前医生支持当前问诊方式，问诊方式按钮正常使用
                        htmlContent += '<img id="' + InnerView.INQUIRY_TYPE_ITEM_PREFIX + i + '" src="' + ((RenderParam.fsUrl || inquiryInfo.serverInfo.fsUrl) + inquiryTypeItem.online_focus_out) + '" style="' + innerStyle.inquiryType + '" alt="">';
                        _buttons.push({
                            id: InnerView.INQUIRY_TYPE_ITEM_PREFIX + i,
                            name: '问诊方式-' + i,
                            type: 'img',
                            nextFocusLeft: InnerView.INQUIRY_TYPE_ITEM_PREFIX + (i - 1),
                            nextFocusRight: InnerView.INQUIRY_TYPE_ITEM_PREFIX + (i + 1),
                            backgroundImage: inquiryInfo.serverInfo.fsUrl + inquiryTypeItem.online_focus_out,
                            focusImage: inquiryInfo.serverInfo.fsUrl + inquiryTypeItem.online_focus_in,
                            inquiryInfo: inquiryInfo,
                            inquiryType: inquiryTypeItem.inquiry_type,
                            beforeMoveChange: InnerView.beforeInquiryTypeMove,
                            index: i,
                            click: InnerView.clickMultiTypeInquiryItem,
                        });
                        if (focusId === '') {
                            focusId = InnerView.INQUIRY_TYPE_ITEM_PREFIX + i;
                        }
                    } else {
                        // 问诊按钮禁止使用
                        htmlContent += '<img id="' + InnerView.INQUIRY_TYPE_ITEM_PREFIX + i + '" src="' + RenderParam.fsUrl + inquiryTypeItem.outline_img + '" style="' + innerStyle.inquiryType + '" alt="">';
                    }
                    if (i % InnerView.ONE_LINE_SHOW_INQUIRY_TYPES !== 0) {
                        htmlContent += '</li>';
                    }
                }
            }
            htmlContent += '</ul>';

            InnerView.showDialog(htmlContent, _buttons, focusId, inquiryInfo.moduleInfo.focusId, true);
        },

        /**
         * 问诊方式焦点移动
         * @param direction 焦点移动方向
         * @param button 问诊方式按钮
         */
        beforeInquiryTypeMove: function (direction, button) {
            var index = button.index;
            switch (direction) {
                case 'up':
                    var nextUpBtn1 = InnerView.INQUIRY_TYPE_ITEM_PREFIX + '0';
                    var nextUpBtn2 = InnerView.INQUIRY_TYPE_ITEM_PREFIX + '1';
                    if (index === 2) {
                        if (null != LMEPG.ButtonManager.getButtonById(nextUpBtn1)) {
                            LMEPG.ButtonManager.requestFocus(nextUpBtn1);
                        } else if (null != LMEPG.ButtonManager.getButtonById(nextUpBtn2)) {
                            LMEPG.ButtonManager.requestFocus(nextUpBtn2);
                        }
                    } else if (index === 3) {
                        if (null != LMEPG.ButtonManager.getButtonById(nextUpBtn2)) {
                            LMEPG.ButtonManager.requestFocus(nextUpBtn2);
                        } else if (null != LMEPG.ButtonManager.getButtonById(nextUpBtn1)) {
                            LMEPG.ButtonManager.requestFocus(nextUpBtn1);
                        }
                    }
                    break;
                case 'down':
                    var nextUpBtn3 = InnerView.INQUIRY_TYPE_ITEM_PREFIX + '2';
                    var nextUpBtn4 = InnerView.INQUIRY_TYPE_ITEM_PREFIX + '3';
                    if (index === 0) {
                        if (null != LMEPG.ButtonManager.getButtonById(nextUpBtn3)) {
                            LMEPG.ButtonManager.requestFocus(nextUpBtn3);
                        } else if (null != LMEPG.ButtonManager.getButtonById(nextUpBtn4)) {
                            LMEPG.ButtonManager.requestFocus(nextUpBtn4);
                        }
                    } else if (index === 1) {
                        if (null != LMEPG.ButtonManager.getButtonById(nextUpBtn4)) {
                            LMEPG.ButtonManager.requestFocus(nextUpBtn4);
                        } else if (null != LMEPG.ButtonManager.getButtonById(nextUpBtn3)) {
                            LMEPG.ButtonManager.requestFocus(nextUpBtn3);
                        }
                    }
                    break;
            }
        },

        /**
         * 多种问诊方式某中具体问诊方式点击响应事件
         * @param btn 某种具体的问诊方式
         */
        clickMultiTypeInquiryItem: function (btn) {
            InnerView.hideDialog();
            var inquiryInfo = btn.inquiryInfo;
            if (btn.inquiryType === P2PObj.InquiryType.WE_CHAT_TELETEXT) { // 图文问诊按钮特殊处理
                // 开启微信图文问诊
                P2PObj.startWeChatTeletextInquiry(inquiryInfo.serverInfo.teletextInquiryUrl + inquiryInfo.doctorInfo.doc_id, inquiryInfo.serverInfo.cwsHlwyyUrl, inquiryInfo.moduleInfo.focusId);
            } else {
                inquiryInfo.inquiryType = btn.inquiryType;
                P2PObj.startInquiry(inquiryInfo);
            }
        },

        /** 显示电话输入框
         *
         * @param phoneList 用户已经绑定的电话号码列表
         * @param dismissFocusId 页面消失恢复焦点
         * @param commitHandler 提交按钮处理函数
         */
        showInputPhone: function (phoneList, dismissFocusId, commitHandler,isPhone) {
            // 样式表
            var innerStyle = {
                // 背景
                background: "margin-top: 136px;left: 206px;width: 868px;height: 448px;",
                // 医生图片背景
                imageDocStyle: "position:absolute;left:640px;top:140px",
                // 表格样式
                table: "position:absolute;top:201px;left:250px;width:480px;height:336px;color:#333;font-size: 28px",
                // 输入框样式
                input: "background-image: url('" + appRootPath + "/Public/img/hd/Inquiry/Common/bg_edit_phone.png');width: 440px;height: 60px;padding-left:20px;line-height:55px;font-size:24px;color:#919191;display:inline-block",
                //光标样式
                cursor:'display:none;width:2px;height:30px;vertical-align: middle;background:#333',
                // 取消按钮样式
                btnCancel: "margin-left:20px",
                // 标题
                title: "font-weight: bold;font-size: 40px;height: 92px;",
                // 标题1
                title1: "font-weight: bold;font-size: 40px;height: 58px;",
                // 标题
                title2: "font-size: 24px;height: 54px;",
                // 短信验证码输入框样式
                checkCodeInput: "background-image: url('" + appRootPath + "/Public/img/hd/Home/V13/Home/Common/ver_code_input.png');width: 203px;height: 55px;padding-left:20px;line-height:55px;font-size:24px;",
                // 获取验证码
                btnCheckCode: "margin-left:15px;background-image: url('" + appRootPath + "/Public/img/hd/Home/V13/Home/Common/get_sms_code.png');text-align:center;width: 133px;height: 55px;line-height:55px;font-size:24px;",
                // 选择电话号码弹窗
                selectPhone: (isPhone)?"position:absolute;left:580px;top:380px":"position:absolute;left:580px;top:405px",
                // 电话号码列表
                phoneListContainer: "position: absolute;left:250px;top: 427px;visibility: hidden;width: 440px;color: #333;font-size:24px;z-index:1",
                // 电话列表第一行元素
                firstPhoneLine: "background-image: url('" + appRootPath + "/Public/img/hd/Inquiry/Common/list_first.png');height: 40px;line-height: 40px;padding-left: 20px;text-align: left",
                // 电话列表最后一行元素
                lastPhoneLine: "background-image: url('" + appRootPath + "/Public/img/hd/Inquiry/Common/list_last.png');height: 40px;line-height: 40px;padding-left: 20px;text-align: left;margin-top: -2px",
                // 电话列表其他行元素
                otherPhoneLine: "background-image: url('" + appRootPath + "/Public/img/hd/Inquiry/Common/list_other.png');height: 40px;line-height: 40px;padding-left: 20px;text-align: left;margin-top: -2px",
            };

            var phoneListLength = phoneList.length;

            // 内容结构
            var dialogHTML = '<img style="' + innerStyle.background + '" src="' + appRootPath + '/Public/img/hd/Inquiry/Common/bg_input_phone.png" />';
            // 医生图片
            dialogHTML += '<img style="' + innerStyle.imageDocStyle + '" src="' + appRootPath + '/Public/img/hd/Inquiry/Common/img_doctor_1.png" />';
            // 表格内容
            dialogHTML += '<table align="left" id="tel_num_table" cellspacing="0" cellpadding="0" style="' + innerStyle.table + '">';
            // 标题“未检测到您的摄像头”
            if (!isPhone) {
                dialogHTML += '<tr style="' + innerStyle.title1 + '">';
                dialogHTML += '<td align="left" id="tel_num_title1" colspan="2" >未检测到您的摄像头</td>';
                dialogHTML += '</tr>';
            }
            // 标题1
            if (!isPhone) {
                dialogHTML += '<tr style="' + innerStyle.title1 + '">';
                dialogHTML += '<td align="left" id="tel_num_title" colspan="2" >为了您与在线医生正常通话</td>';
                dialogHTML += '</tr>';
            }else {
                dialogHTML += '<tr style="' + innerStyle.title + '">';
                dialogHTML += '<td align="left" id="tel_num_title" colspan="2" >为了您与在线医生正常通话</td>';
                dialogHTML += '</tr>';
            }
            // 标题2
            dialogHTML += '<tr style="' + innerStyle.title2 + '">';
            dialogHTML += '<td align="left" id="tel_num_sub_title" colspan="2" >请输入您的手机号，医生会立即回呼您~</td>';
            dialogHTML += '</tr>';
            // 手机号码输入框
            dialogHTML += '<tr>';
            dialogHTML +=
                '<td align="left" style="height: 105px;">' +
                    '<div  style="' + innerStyle.input + '">' +
                        '<span id="tel_num_input" style="vertical-align: middle">请输入有效的电话号码</span>' +
                        '<div id="input-cursor" style="'+innerStyle.cursor+'"></div>' +
                    '</div>' +
                '</td>';
            dialogHTML += '</tr>';
            // 确定、取消按钮
            dialogHTML += '<tr>';
            dialogHTML += '<td align="left" colspan="2"><img id="tel_num_commit" src="' + appRootPath + '/Public/img/hd/Inquiry/Common/btn_sure_normal.png" /><img id="tel_num_cancel" style="' + innerStyle.btnCancel + '" src="' + appRootPath + '/Public/img/hd/Inquiry/Common/btn_cancel_normal.png" /></td>';
            dialogHTML += '</tr>';

            // 内部焦点
            var buttons = [
                {
                    id: 'tel_num_commit',
                    name: "提交按钮",
                    type: "img",
                    nextFocusRight: 'tel_num_cancel',
                    nextFocusUp: phoneListLength > 0 ? 'select-phone' : "tel_num_input",
                    backgroundImage:appRootPath + '/Public/img/hd/Inquiry/Common/btn_sure_normal.png',
                    focusImage:appRootPath + '/Public/img/hd/Inquiry/Common/btn_sure_focus.png',
                    click: InnerView.inputPhoneEventHandler,
                    commitHandler: commitHandler,
                    dismissFocusId: dismissFocusId,
                    focusable: true,
                }, {
                    id: 'tel_num_cancel',
                    name: "取消按钮",
                    type: "img",
                    nextFocusLeft: 'tel_num_commit',
                    nextFocusUp: phoneListLength > 0 ? 'select-phone' : "tel_num_input",
                    backgroundImage: appRootPath + '/Public/img/hd/Inquiry/Common/btn_cancel_normal.png',
                    focusImage: appRootPath + '/Public/img/hd/Inquiry/Common/btn_cancel_focus.png',
                    click: InnerView.inputPhoneEventHandler,
                    focusable: true,
                }, {
                    id: "tel_num_input",
                    name: "输入模式",
                    type: "div",
                    focusable: true,
                    backgroundImage: '',
                    focusImage:'',
                    nextFocusDown: "tel_num_commit",
                    hintText: "请输入有效的电话号码",
                    focusChange: InnerView.showKeyBoard,
                    focusIdOnHideKeyBoard: 'tel_num_commit',
                }
            ];

            // 检测用户已问诊过绑定的电话号码列表是否为空

            if (phoneListLength > 0) {
                // 1、添加选择电话号码按钮
                dialogHTML += '<img id="select-phone" src="' + g_appRootPath + '/Public/img/hd/Inquiry/Common/select_phone.png" style="' + innerStyle.selectPhone + '" alt="选择电话号码"/>';
                buttons.push({
                    id: "select-phone",
                    name: "选择电话号码",
                    type: "img",
                    focusable: true,
                    backgroundImage: appRootPath + "/Public/img/hd/Inquiry/Common/select_phone.png",
                    focusImage: appRootPath + "/Public/img/hd/Inquiry/Common/select_phone_focus.png",
                    nextFocusDown: "tel_num_commit",
                    nextFocusLeft: 'tel_num_input',
                    click: InnerView.inputPhoneEventHandler,
                });
                dialogHTML += '<ul id="phone-list-container" style="' + innerStyle.phoneListContainer + '">';
                // 2、对列表进行循环
                for (var i = 0; i < phoneListLength; i++) {
                    if (i === 0) {
                        // 第一行元素的背景
                        dialogHTML += '<li><div id="phone-line-' + i + '"  style="' + innerStyle.firstPhoneLine + '">' + phoneList[i] + '</div></li>';
                        buttons.push({
                            id: "phone-line-" + i,
                            name: "电话号码-" + i,
                            type: "div",
                            focusable: true,
                            backgroundImage: appRootPath + "/Public/img/hd/Inquiry/Common/list_first.png",
                            focusImage: appRootPath + "/Public/img/hd/Inquiry/Common/list_first_focus.png",
                            nextFocusDown: "phone-line-1",
                            beforeMoveChange: InnerView.listFirstMoveChange,
                            phoneNumber: phoneList[i],
                            click: InnerView.inputPhoneEventHandler,
                        });
                    } else if (i === phoneListLength - 1) {
                        // 最后一行元素背景
                        dialogHTML += '<li "><div id="phone-line-' + i + '" style="' + innerStyle.lastPhoneLine + '">' + phoneList[i] + '</div></li>';
                        buttons.push({
                            id: "phone-line-" + i,
                            name: "电话号码-" + i,
                            type: "div",
                            focusable: true,
                            backgroundImage: appRootPath + "/Public/img/hd/Inquiry/Common/list_last.png",
                            focusImage: appRootPath + "/Public/img/hd/Inquiry/Common/list_last_focus.png",
                            nextFocusUp: "phone-line-" + (i - 1),
                            phoneNumber: phoneList[i],
                            click: InnerView.inputPhoneEventHandler,
                        });
                    } else {
                        dialogHTML += '<li><div id="phone-line-' + i + '"  style="' + innerStyle.otherPhoneLine + '">' + phoneList[i] + '</div></li>';
                        buttons.push({
                            id: "phone-line-" + i,
                            name: "电话号码-" + i,
                            type: "div",
                            focusable: true,
                            backgroundImage: appRootPath + "/Public/img/hd/Inquiry/Common/list_other.png",
                            focusImage: appRootPath + "/Public/img/hd/Inquiry/Common/list_other_focus.png",
                            nextFocusUp: "phone-line-" + (i - 1),
                            nextFocusDown: "phone-line-" + (i + 1),
                            phoneNumber: phoneList[i],
                            click: InnerView.inputPhoneEventHandler,
                        });
                    }

                }
                dialogHTML += '</ul">';
            }

            this.showDialog(dialogHTML, buttons, phoneListLength > 0?'select-phone':'tel_num_input', dismissFocusId, true);

            // 显示最新电话号码
            if (phoneListLength > 0) {
                InnerView._setPhoneNum(phoneList[0]);
            }
        },

        /** 小键盘显示 */
        showKeyBoard: function (btn, hasFocus) {
            if (hasFocus) {
                var keyBoardLeft = 700;
                var keyBoardTop = 324;
                LMEPG.UI.keyboard.show(keyBoardLeft, keyBoardTop, btn.id, 11, btn.focusIdOnHideKeyBoard);
                var hintTextColor = "#919191";
                var inputTextColor = "#333333";
                LMEPG.UI.keyboard.showTipsText(btn.hintText, hintTextColor);
                LMEPG.UI.keyboard.setInputTextColor(inputTextColor);
                if (btn.id === "check_code_input") {
                    LMEPG.UI.keyboard.setInputLimit(4, "验证码最多输入4位")
                }
            }
        },

        /**
         * 电话列表第一行移动监听
         * @param direction 移动方向
         * @param button 第一行元素
         */
        listFirstMoveChange: function (direction, button) {
            if (direction === 'up') {
                // 向上移动隐藏电话号码列表
                H('phone-list-container');
                // 将焦点恢复到选择按钮上
                LMEPG.ButtonManager.requestFocus('select-phone');
            }
        },

        /** 电话输入框事件处理器 */
        inputPhoneEventHandler: function (btn) {
            switch (btn.id) {
                case 'tel_num_commit':
                    // 获取输入的电话号码
                    var inputValue = G('tel_num_input').innerHTML;
                    if (!LMEPG.Func.isTelPhoneMatched(inputValue)) {
                        LMEPG.UI.showToast('请输入有效手机号');
                        return true;
                    }
                    // 调用接口校验手机号码
                    DoctorApiObj.verifyPhoneNumber(inputValue, "0", function (data) {
                        // 再将电话号码保存
                        DoctorApiObj.pushPhoneList(inputValue, function () {
                            // 先隐藏当前弹窗
                            InnerView.hideDialog();
                            if (data.status === 1 || data.status === '1') {
                                // 需要校验手机号获取短信验证码
                                InnerView.showInputCheckCode(inputValue, btn.dismissFocusId, btn.commitHandler);
                            } else {
                                btn.commitHandler(inputValue);
                            }
                        });
                    });
                    break;
                case 'tel_num_cancel':
                    // 隐藏当前对话框
                    InnerView.hideDialog();
                    break;
                case 'tel_num_input':
                    var keyBoardLeft = btn.keyBoardLeft;
                    var keyBoardTop = btn.keyBoardTop;
                    LMEPG.UI.keyboard.show(keyBoardLeft, keyBoardTop, btn.id, false, btn.focusIdOnHideKeyBoard);
                    break;
                case 'select-phone':
                    // 选择电话号码列表
                    S('phone-list-container');
                    // 将焦点移动到第一行
                    LMEPG.ButtonManager.requestFocus('phone-line-0');
                    break;
            }
            if (btn.id.indexOf('phone-line') > -1) {
                InnerView._setPhoneNum(btn.phoneNumber)
                // 将弹窗隐藏
                H('phone-list-container');
                // 将焦点恢复到选择按钮
                LMEPG.ButtonManager.requestFocus('tel_num_commit');
            }
        },

        /**
         * 设置显示电话号码
         * @param phoneNum 电话号码
         * @private
         */
        _setPhoneNum: function (phoneNum) {
            // 获取手机号,设置到输入框
            var inputTextColor = "#333333";
            var inputElement = G('tel_num_input');
            inputElement.innerHTML = phoneNum;
            inputElement.style.color = inputTextColor;
        },

        /**
         * 显示输入款
         * @param phoneNum 手机号
         * @param dismissFocusId 对话框消失页面恢复焦点
         * @param checkCodeHandler 兑换码校验成功处理函数
         */
        showInputCheckCode: function (phoneNum, dismissFocusId, checkCodeHandler) {
            // 样式表
            var innerStyle = {
                // 背景
                background: "margin-top: 136px;left: 206px;width: 868px;height: 448px;",
                // 医生图片背景
                imageDocStyle: "position:absolute;left:640px;top:140px",
                // 表格样式
                table: "position:absolute;top:201px;left:250px;width:480px;height:336px;color:#333;font-size: 28px",
                // 输入框样式
                input: "background-image: url('" + appRootPath + "/Public/img/hd/Inquiry/Common/bg_edit_phone.png');width: 440px;height: 60px;padding-left:20px;line-height:55px;font-size:24px",
                // 取消按钮样式
                btnCancel: "margin-left:20px",
                // 标题
                title: "font-weight: bold;font-size: 40px;",
                // 标题
                title2: "font-size: 24px;",

                cursor:'display:none;width:2px;height:30px;vertical-align: middle;background:#333',
                // 短信验证码输入框样式
                checkCodeInput: "background-image: url('" + appRootPath + "/Public/img/hd/Inquiry/Common/bg_edit_sms_code.png');width: 260px;height: 60px;padding-left:20px;line-height:55px;font-size:24px;color:#919191",
                // 获取验证码
                btnCheckCode: "margin-left:-200px;background-image: url('" + appRootPath + "/Public/img/hd/Inquiry/Common/btn_get_sms_code_normal.png');text-align:center;width: 160px;height: 60px;line-height:55px;font-size:24px;color:#fff"
            }

            // 内容结构
            var dialogHTML = '<img style="' + innerStyle.background + '" src="' + appRootPath + '/Public/img/hd/Inquiry/Common/bg_input_phone.png" />';
            // 医生图片
            dialogHTML += '<img style="' + innerStyle.imageDocStyle + '" src="' + appRootPath + '/Public/img/hd/Inquiry/Common/img_doctor_1.png" />';
            // 表格内容
            dialogHTML += '<table align="left" id="tel_num_table" cellspacing="0" cellpadding="0" style="' + innerStyle.table + '">';
            // 标题1
            dialogHTML += '<tr style="' + innerStyle.title + '">';
            dialogHTML += '<td align="left" id="tel_num_title" colspan="2" >为了您与在线医生正常通话</td>';
            dialogHTML += '</tr>';
            // 标题2
            dialogHTML += '<tr style="' + innerStyle.title2 + '">';
            dialogHTML += '<td align="left" id="tel_num_sub_title" colspan="2" >请输入 您的手机号，医生会立即回呼您~</td>';
            dialogHTML += '</tr>';
            // 手机号码输入框
            dialogHTML += '<tr>';
            dialogHTML += '<td align="left"><div id="tel_num_input" style="' + innerStyle.input + '">' + phoneNum + '</div></td>';
            dialogHTML += '</tr>';
            // 验证码展位框
            dialogHTML += '<tr>';
            dialogHTML +=
                '<td align="left" ><div style="' + innerStyle.checkCodeInput + '">' +
                '<span id="check_code_input" style="vertical-align: middle">请输入验证码</span>' +
                '<div id="input-cursor" style="'+innerStyle.cursor+'"></div>' +
                '</td>';
            dialogHTML += '<td align="left" ><div id="get_check_code" style="' + innerStyle.btnCheckCode + '" >获取验证码</div></td>';
            dialogHTML += '</tr>';
            // 确定、取消按钮
            dialogHTML += '<tr>';
            dialogHTML += '<td align="left" colspan="2"><img id="tel_num_commit" src="' + appRootPath + '/Public/img/hd/Inquiry/Common/btn_sure_normal.png" /><img id="tel_num_cancel" style="' + innerStyle.btnCancel + '" src="' + appRootPath + '/Public/img/hd/Inquiry/Common/btn_cancel_normal.png" /></td>';
            dialogHTML += '</tr>';

            // 内部焦点
            var buttons = [
                {
                    id: 'tel_num_commit',
                    name: "提交按钮",
                    type: "img",
                    nextFocusRight: 'tel_num_cancel',
                    nextFocusUp: "get_check_code",
                    backgroundImage: appRootPath + '/Public/img/hd/Inquiry/Common/btn_sure_normal.png',
                    focusImage: appRootPath + '/Public/img/hd/Inquiry/Common/btn_sure_focus.png',
                    click: InnerView.inputCheckCodeEventHandler,
                    checkCodeHandler: checkCodeHandler,
                    phoneNum: phoneNum,
                    focusable: true,
                }, {
                    id: 'tel_num_cancel',
                    name: "取消按钮",
                    type: "img",
                    nextFocusLeft: 'tel_num_commit',
                    nextFocusUp: "get_check_code",
                    backgroundImage: appRootPath + '/Public/img/hd/Inquiry/Common/btn_cancel_normal.png',
                    focusImage: appRootPath + '/Public/img/hd/Inquiry/Common/btn_cancel_focus.png',
                    click: InnerView.inputCheckCodeEventHandler,
                    focusable: true,
                }, {
                    id: "check_code_input",
                    name: "输入模式",
                    type: "div",
                    focusable: true,
                    backgroundImage: '',
                    focusImage: '',
                    nextFocusDown: "tel_num_commit",
                    hintText: "请输入验证码",
                    focusChange: InnerView.showKeyBoard,
                    focusIdOnHideKeyBoard: 'tel_num_commit',
                }, {
                    id: "get_check_code",
                    name: "获取短信验证码",
                    type: "div",
                    focusable: true,
                    backgroundImage: appRootPath + "/Public/img/hd/Inquiry/Common/btn_get_sms_code_normal.png",
                    focusImage: appRootPath + "/Public/img/hd/Inquiry/Common/btn_get_sms_code_focus.png",
                    nextFocusDown: "tel_num_commit",
                    nextFocusLeft: "check_code_input",
                    phoneNum: phoneNum,
                    click: InnerView.inputCheckCodeEventHandler,
                }
            ];
            this.showDialog(dialogHTML, buttons, 'get_check_code', dismissFocusId, true, InnerView.resetCheckState);
        },

        /** 短信验证码事件处理器 */
        inputCheckCodeEventHandler: function (btn) {
            switch (btn.id) {
                case 'tel_num_cancel':
                    // 隐藏当前对话框
                    InnerView.hideDialog();
                    InnerView.resetCheckState();
                    break;
                case 'check_code_input':
                    var keyBoardLeft = 700;
                    var keyBoardTop = 324;
                    LMEPG.UI.keyboard.show(keyBoardLeft, keyBoardTop, btn.id, false, btn.focusIdOnHideKeyBoard);

                    var hintTextColor = "#919191";
                    var inputTextColor = "#333333";
                    var hintText = "请输入验证码";
                    LMEPG.UI.keyboard.showTipsText(hintText, hintTextColor);
                    LMEPG.UI.keyboard.setInputTextColor(inputTextColor);

                    break;
                case 'get_check_code':
                    if (!InnerView.isGetCheckCode) { // 当前未处于获取倒计时状态
                        // 调用接口校验手机号码
                        DoctorApiObj.verifyPhoneNumber(btn.phoneNum, "1", function (data) {
                            InnerView.isGetCheckCode = true;
                            // 启动定时器，开启倒计时
                            InnerView.countdownTimer = setInterval(InnerView.updateCountdown, 1000);
                            LMEPG.BM.requestFocus('check_code_input')
                        });
                    }
                    break;
                case 'tel_num_commit':
                    // 获取输入的电话号码
                    var inputValue = G('check_code_input').innerHTML;
                    if (inputValue == '请输入验证码' || inputValue == '') {
                        LMEPG.UI.showToast('请输入验证码');
                        return true;
                    }
                    InnerView.hideDialog();
                    var phoneNum = btn.phoneNum;
                    // 调用后台接口校验短信验证码
                    DoctorApiObj.verifyCheckCode(phoneNum, inputValue, function () {
                        btn.checkCodeHandler(phoneNum);
                    })
                    break;
            }
        },

        /** 更新倒计时 */
        updateCountdown: function () {
            var DOMElement = G('get_check_code');
            // 这个是为了实现文字居中
            var blankSpace = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
            DOMElement.innerHTML = blankSpace + (--InnerView.SMSCountDown) + "S";
            if (InnerView.SMSCountDown <= 0) { // 倒计时完成，恢复对应的变量状态
                InnerView.resetCheckState(DOMElement);
            }
        },

        resetCheckState: function (DOMElement) {
            DOMElement = DOMElement || G('get_check_code');
            if (InnerView.countdownTimer) {
                clearInterval(InnerView.countdownTimer);
            }
            if (DOMElement !== null) {
                DOMElement.innerHTML = "获取验证码";
            }
            InnerView.SMSCountDown = 60;
            InnerView.isGetCheckCode = false;
        },

        /** 显示图文、视频问诊二维码 */
        showQRCode: function (config) {
            // 样式表
            var innerStyle = {
                // 背景
                background: "margin-top: 124px;left: 254px;width: 772px;height: 466px;",
                // background: "",
                // 二维码
                QRCode: "position: absolute;top: 193px;left: 331px;width: 250px;height: 250px;",
                // QRCode: "position: absolute;top: 228px;left: 380px;width: 200px;height: 200px;",
                // 标题
                title: "position: absolute;top: 284px;left: 509px;width: 600px;color: #c38554; font-weight: bold;font-size: 30px;",
                // title: "position: absolute;top: 284px;left: 470px;width: 600px;color: #c38554; font-weight: bold;font-size: 30px;",
                // 确定按钮
                btnSure: "position: absolute;top: 485px;left: 552px;"
                // btnSure: "position: absolute;top: 463px;left: 552px;"
            };
            var inquiryTypeText = config.inquiryType === P2PObj.InquiryType.WE_CHAT_TELETEXT ? '图文' : '视频';
            // 背景图
            var bgImage = '/Public/img/hd/Common/V13/ask_doc_dialog_bg.png';
            // var bgImage = '/Public/img/hd/Home/V20/bg_toast.png';
            // 内容结构
            var dialogHTML = '<img style="' + innerStyle.background + '" src="' + appRootPath + bgImage + '"  alt="背景图片"/>';
            dialogHTML += '<img style="' + innerStyle.QRCode + '" src=\'' + config.QRCodeImageUrl + '\' alt="问诊二维码">';
            dialogHTML += '<div style="' + innerStyle.title + '" >请使用微信扫码<br/>进行<span style="color: #f95f53">' + inquiryTypeText + '</span>问诊</div>>';
            dialogHTML += '<img id="btn_sure" style="' + innerStyle.btnSure + '" src="' + appRootPath + '/Public/img/hd/Home/V13/Home/Common/btn_sure.png" alt="确定按钮">';

            var buttons = [
                {
                    id: 'btn_sure',
                    name: '微信问诊确认按钮',
                    type: 'img',
                    backgroundImage: appRootPath + '/Public/img/hd/Home/V13/Home/Common/btn_sure.png',
                    focusImage: appRootPath + '/Public/img/hd/Home/V13/Home/Common/btn_sure_f.png',
                    click: InnerView.hideDialog,
                }
            ];

            this.showDialog(dialogHTML, buttons, 'btn_sure', config.focusIdOnDialogHide, true);
        },

        /**
         * 弹窗提示插件版本升级
         * @param focusIdOnDialogHide 弹窗消失时恢复页面焦点
         * @param updateHandler 点击确定按钮后的升级函数
         */
        showUpdatePluginDialog: function (focusIdOnDialogHide, updateHandler) {
            // 样式表
            var innerStyle = {
                // 背景
                background: "left: 254px;width: 772px;height: 584px;",
                // 确定按钮
                btnSure: "position: absolute;top: 485px;left: 552px;",
                // 升级内容
                content: "position: absolute;top: 292px;left: 254px;width: 740px;height: 100px;color: #333;padding: 15px;text-align: center;font-size: 23px;",
            }
            // 背景图
            var bgImage = '/Public/img/hd/Home/V13/Home/Common/modal.png';
            // 内容结构
            var dialogHTML = '<img style="' + innerStyle.background + '" src="' + appRootPath + bgImage + '"  alt="背景图片"/>';
            // 提示文案
            dialogHTML += '<div  style="' + innerStyle.content + '">当前使用插件版本低，请升级插件至最新版本后再继续使用问诊功能！</div>';
            // 确定按钮
            dialogHTML += '<img id="btn_sure" style="' + innerStyle.btnSure + '" src="' + appRootPath + '/Public/img/hd/Home/V13/Home/Common/btn_sure.png" alt="确定按钮">';

            var buttons = [
                {
                    id: 'btn_sure',
                    name: '插件升级确认按钮',
                    type: 'img',
                    backgroundImage: appRootPath + '/Public/img/hd/Home/V13/Home/Common/btn_sure.png',
                    focusImage: appRootPath + '/Public/img/hd/Home/V13/Home/Common/btn_sure_f.png',
                    click: function () {
                        InnerView.hideDialog();
                        updateHandler();
                    },
                }
            ];

            this.showDialog(dialogHTML, buttons, 'btn_sure', focusIdOnDialogHide, true);
        },

        /** 遥控器触发内部返回事件 */
        _innerBack: function (onDialogHideListener) {
            if (isShow('gid_keyboard_container')) { // 如果存在小键盘优先消失小键盘
                LMEPG.UI.keyboard.dismiss();
            } else if (isS('phone-list-container')) {
                // 判断电话号码选择框显示，关闭电话号码选择框
                H('phone-list-container');
                LMEPG.ButtonManager.requestFocus('select-phone');
            } else { // 关闭弹窗
                if (typeof onDialogHideListener != 'undefined') {
                    InnerView.hideDialog(onDialogHideListener);
                } else {
                    InnerView.hideDialog();
                }
            }
        },

        /**
         * 显示对话框
         * @param htmlContent 内容结构代码
         * @param buttons 焦点按钮
         * @param focusButton 对话款显示时获取的焦点
         * @param focusIdOnDialogHide 对话框消失时恢复页面的焦点
         * @param isSetBackground 是否需要设置背景样式，有些地区弹框图片是携带透明背景样式
         * @param onDialogHideListener 对话框消失时监听器 可以不传
         */
        showDialog: function (htmlContent, buttons, focusButton, focusIdOnDialogHide, isSetBackground, onDialogHideListener) {
            // 创建弹框节点
            var dialogElement = document.createElement('div');
            dialogElement.id = InnerView.dialogId;
            dialogElement.style.position = 'absolute';
            dialogElement.style.top = '0px';
            dialogElement.style.left = '0px';
            dialogElement.style.width = '1280px';
            dialogElement.style.height = '720px';
            dialogElement.style.textAlign = 'center';

            if (isSetBackground) {
                dialogElement.style.backgroundColor = 'rgba(1, 1, 1, .5)';
            }
            dialogElement.innerHTML = htmlContent;
            // 添加节点到DOM树中
            document.body.appendChild(dialogElement);
            InnerView.dialogElement = dialogElement;

            // 初始化焦点事件
            // LMEPG.KEM.addKeyEvent("KEY_BACK", InnerView._innerBack);
            LMEPG.ButtonManager._isKeyEventInterceptCallback = function (keyCode) {
                var result = false;
                var backBtnKeyCodes = [KEY_BACK_ANDROID, KEY_EXIT, KEY_399, KEY_BACK];
                if (backBtnKeyCodes.indexOf(keyCode) > -1) {
                    if (typeof onDialogHideListener != "undefined") {
                        InnerView._innerBack(onDialogHideListener);
                    } else {
                        InnerView._innerBack();
                    }

                    result = true;
                }

                return result;
            };

            LMEPG.BM.addButtons(buttons);
            LMEPG.BM.requestFocus(focusButton);

            // 记录相关内容，方便对话框隐藏
            InnerView.dialogElement = dialogElement;
            InnerView.focusIdOnDialogHide = focusIdOnDialogHide;
            InnerView.dialogButtons = buttons;
        },

        /** 隐藏对话框 */
        hideDialog: function (onDialogHideListener) {
            // 恢复业务逻辑页面按钮操作
            LMEPG.BM.deleteButtons(InnerView.dialogButtons);
            InnerView.dialogButtons = [];
            LMEPG.BM.requestFocus(InnerView.focusIdOnDialogHide);

            // 清空弹窗UI
            delNode(InnerView.dialogId);

            // 恢复业务逻辑页面的返回事件。必须！！！否则，页面无法正常返回！
            // LMEPG.KEM.addKeyEvent("KEY_BACK", "onBack()");
            LMEPG.ButtonManager.removeKeyEventInterceptCallback();

            if (typeof onDialogHideListener != "undefined" && typeof onDialogHideListener == "function") onDialogHideListener();
        }
    }

    var InnerFunc = {
        log: function (str) {
            console.log("js-inquiry:::" + str);
            LMEPG.Log.info("js-inquiry:::" + str);
        },

        /**
         *开始视频问诊
         * @param inquiryInfo 问诊相关信息
         */
        startInquiry: function (inquiryInfo) {
            // 1、组装成员信息
            var memberInfoObj = inquiryInfo.memberInfo;
            var androidMemberInfo = {
                member_id: "-1",
                member_name: "问诊咨询",
                member_age: "25",
                member_gender: "0"
            };
            if (memberInfoObj != null && memberInfoObj instanceof Object) {
                androidMemberInfo.member_id = memberInfoObj.member_id;
                androidMemberInfo.member_name = memberInfoObj.member_name;
                androidMemberInfo.member_age = memberInfoObj.member_age;
                androidMemberInfo.member_gender = memberInfoObj.member_gender;
            }

            // 2、组装医生信息
            var doctorInfoObj = inquiryInfo.doctorInfo;
            var moduleInfo = inquiryInfo.moduleInfo;
            var doctorInfo = {
                "area": doctorInfoObj.area,
                "avatar_url": doctorInfoObj.avatar_url,
                "avatar_url_new": doctorInfoObj.avatar_url_new,
                "department": doctorInfoObj.department,
                "doc_id": doctorInfoObj.doc_id,
                "doc_name": doctorInfoObj.doc_name,
                "gender": doctorInfoObj.gender,
                "good_disease": doctorInfoObj.good_disease,
                "hospital": doctorInfoObj.hospital,
                "inquiry_num": doctorInfoObj.inquiry_num,
                "intro_desc": doctorInfoObj.intro_desc,
                "job_title": doctorInfoObj.job_title,
                "online_state": doctorInfoObj.online_state,
                "realImageUrl": encodeURIComponent(ExpertApiObj.createDoctorUrl(moduleInfo.cwsInquirySeverUrl, doctorInfoObj.doctor_user_id, doctorInfoObj.doctor_avatar, RenderParam.carrierId)),
                "member_id": androidMemberInfo.member_id,
                "member_name": androidMemberInfo.member_name,
                "member_age": androidMemberInfo.member_age,
                "member_gender": androidMemberInfo.member_gender,
                "module_id": moduleInfo.moduleId,
                "module_name": moduleInfo.moduleName,
                "entry_type": moduleInfo.moduleType,
                "is_user_phone_inquiry": typeof moduleInfo.isUserPhoneInquiry == 'undefined' ? false : moduleInfo.isUserPhoneInquiry,
            };

            // 3、存储问诊参数到cws端，然后再右插件来拉取
            CommonApi.buildInquiryParam(doctorInfo, function (data) {
                CommonApi.saveInquiryParam(data, function () {
                    // 区分问诊类型，执行不同的问诊方法
                    APKManager.launchApp(data, inquiryInfo.moduleInfo.focusId);
                });
            });
        },

        /**
         * 校验是否存在摄像头,不存在，则返回弹框输入的电话号码
         * @param callback
         */
        checkHasCameraAndRetTelNum: function (callback) {
            LMAndroid.JSCallAndroid.doCheckHasCamera('', function (jsonFromAndroid) {
                try {
                    var response = JSON.parse(jsonFromAndroid);
                    InnerFunc.log('[checkHasCamera]--->jsonFromAndroid:' + jsonFromAndroid);
                    if (LMEPG.Func.isObject(response)) {
                        var hasCamera = response.has_camera == 0; // 0-有可用摄像头，-1或其它表示无可用摄像头
                        var historyTelPhoneNum = response.history_phone_number; // 上一次使用落地电话功的手机号历史记录
                        LMEPG.call(callback, [hasCamera, historyTelPhoneNum]);
                    } else {
                        LMEPG.UI.showToast('<span style="{0}">发生错误！</span><br/><br/>检查摄像头数据出错'.format(cssBigTitle));
                    }
                } catch (e) {
                    InnerFunc.log('[checkHasCamera]--->Exception: ' + e.toString());
                }
            });
        },

        /**
         * 开始视频问诊 - Android端
         * @param landlinePhoneNum 落地电话号码
         * @param inquiryInfo 问诊相关信息
         */
        startInquiryByAndroid: function (landlinePhoneNum, inquiryInfo) {
            // 1、组装问诊成员信息
            var memberInfoObj = inquiryInfo.memberInfo;
            var androidMemberInfo = {
                member_id: "-1",
                member_name: "问诊咨询",
                member_age: "25",
                member_gender: "0",
                member_entry: LMEPG.Func.isEmpty(landlinePhoneNum) ? "视频问诊" : "电话问诊",
            };
            if (memberInfoObj != null && memberInfoObj instanceof Object) {
                androidMemberInfo.member_id = memberInfoObj.member_id;
                androidMemberInfo.member_name = memberInfoObj.member_name;
                androidMemberInfo.member_age = memberInfoObj.member_age;
                androidMemberInfo.member_gender = memberInfoObj.member_gender;
                androidMemberInfo.member_entry = memberInfoObj.member_entry;
            }

            // 2、组装问诊医生信息
            var doctorInfoObj = inquiryInfo.doctorInfo;
            var tempDocName = doctorInfoObj.doc_name;
            var tempJobTitle = doctorInfoObj.job_title;
            if (tempDocName == "刘萍" && RenderParam.carrierId == "450004") {
                tempDocName = doctorInfoObj.hospital;
                tempJobTitle = "";
            }
            var param = {
                doctor_info: {
                    doctor_id: doctorInfoObj.doc_id,
                    doctor_name: tempDocName,
                    doctor_job_title: tempJobTitle,
                    doctor_avatar_url: doctorInfoObj.avatar_url,
                    doctor_hospital: doctorInfoObj.hospital,
                },
                member_info: androidMemberInfo,
                extras_info: {
                    landline_phone: landlinePhoneNum
                }
            };
            LMAndroid.JSCallAndroid.doDismissWaitingDialog();

            // 3、通知Android端开始问诊
            LMAndroid.JSCallAndroid.doP2PInquiry(JSON.stringify(param), function (jsonFromAndroid) {
                InnerFunc.log("jsonFromAndroid:" + jsonFromAndroid);
                LMEPG.Log.info("jsonFromAndroid:" + jsonFromAndroid);
                LMEPG.call(inquiryInfo.inquiryEndHandler, [jsonFromAndroid]);
            });
        },
    };

    var ExpertObj = {

        /**
         * 问诊大专家 - 约诊记录进入候诊室触发
         * @param expertInfo 专家信息
         * @param isInquiryWithPlugin 是否使用插件问诊（EPG版本需要借助插件实现问诊，APK2.0版本通过JS调用Android端方法实现问诊）
         * @param dismissFocusId 输入电话号码弹框消失页面恢复焦点
         */
        inquiryExpert: function (expertInfo, isInquiryWithPlugin, dismissFocusId) {
            if (isInquiryWithPlugin) {
                ExpertObj.inquiryExpertWithPlugin(dismissFocusId, expertInfo);
            } else {
                InnerFunc.checkHasCameraAndRetTelNum(function (hasCamera, inquiryHistoryPhoneNum) {
                    // 判断是否检测到摄像头
                    if (hasCamera) {
                        ExpertObj.enterWaitingRoom(expertInfo, "");
                    } else {
                        // 弹出对话款，输入电话号码
                        DoctorApiObj.getPhoneList(function (phoneList) {
                            InnerView.showInputPhone(phoneList, dismissFocusId, function (phoneNum) {
                                // 直接进入候诊室
                                ExpertObj.enterWaitingRoom(expertInfo, phoneNum);
                            });
                        });
                    }
                });
            }
        },

        /**
         * 问诊专家
         * @param pageFocusId 当前页面焦点按钮
         * @param expertInfo 问诊专家信息
         */
        inquiryExpertWithPlugin: function (pageFocusId, expertInfo) {
            var moduleInfo = {
                moduleId: "10003",
                moduleName: "咨询大专家",
                entryType: 0,
            };
            //大专家咨询
            var postData = {
                "account_id": expertInfo.account_id,
                "appointment_id": expertInfo.appointment_id,
                "begin_dt": expertInfo.begin_dt,
                "clinic_hospital_id": expertInfo.clinic_hospital_id,
                "clinic_id": expertInfo.clinic_id,
                "clinic_is_pay": expertInfo.clinic_is_pay,
                "clinic_is_refund": expertInfo.clinic_is_refund,
                "clinic_serial": expertInfo.clinic_serial,
                "clinic_state": expertInfo.clinic_state,
                "department_name": expertInfo.department_name,
                "doctor_avatar": expertInfo.doctor_avatar,
                "doctor_introduce": expertInfo.doctor_introduce,
                "doctor_level": expertInfo.doctor_level,
                "doctor_name": expertInfo.doctor_name,
                "doctor_skill": expertInfo.doctor_skill,
                "doctor_user_id": expertInfo.doctor_user_id,
                "end_dt": expertInfo.end_dt,
                "hospital_abbr": expertInfo.hospital_abbr,
                "hospital_name": expertInfo.hospital_name,
                "insert_dt": expertInfo.insert_dt,
                "medical_url": expertInfo.medical_url,
                "patient_name": expertInfo.patient_name,
                "pay_dt": expertInfo.pay_dt,
                "pay_link_dt": expertInfo.pay_link_dt,
                "pay_value": expertInfo.pay_value,
                "phone_num": expertInfo.phone_num,
                "prepare_state": expertInfo.prepare_state,
                "realImageUrl": encodeURIComponent(ExpertApiObj.createDoctorUrl(RenderParam.expertUrl, expertInfo.doctor_user_id, expertInfo.doctor_avatar, RenderParam.carrierId)),
                "user_id": expertInfo.user_id,
                "module_id": moduleInfo.moduleId,
                "module_name": moduleInfo.moduleName,
                "entry_type": moduleInfo.entryType,
            };
            LMEPG.ajax.postAPI("Expert/buildInquiryParam", postData, function (data) {
                var paramInfo = data.param_info;
                CommonApi.saveInquiryParam(paramInfo, function (data) {
                    APKManager.launchApp(paramInfo, pageFocusId);
                });
            });
        },

        /**
         * 进入专家候诊室
         * @param expertInfo 专家信息
         * @param phoneNum 电话号码
         */
        enterWaitingRoom: function (expertInfo, phoneNum) {
            var inquiryJson = {
                "expert_info": {
                    "appointment_id": expertInfo.appointment_id,//就诊编号
                    "clinic_id": expertInfo.clinic_id,//门诊ID
                    "clinic_hospital_id": expertInfo.clinic_hospital_id,//门诊医院ID
                    "user_id": expertInfo.user_id,//患者用户ID
                    "insert_dt": expertInfo.insert_dt,//申请时间
                    "clinic_is_pay": expertInfo.clinic_is_pay,//支付状态 0未支付 1已支付
                    "pay_link_dt": expertInfo.pay_link_dt,//支付时间
                    "clinic_state": expertInfo.clinic_state,//就诊状态 0：等待；1：进行；2：完成；3：关闭；
                    "clinic_serial": expertInfo.clinic_serial,//就诊序号
                    "clinic_is_refund": expertInfo.clinic_is_refund,//退款状态
                    "account_id": expertInfo.account_id,//盒子ID
                    "prepare_state": expertInfo.prepare_state,//房间是否准备就绪 1是 0否
                    "doctor_name": expertInfo.doctor_name,//专家姓名
                    "doctor_level": expertInfo.doctor_level,//专家职称
                    "hospital_name": expertInfo.hospital_name,//专家医院
                    "hospital_abbr": expertInfo.hospital_abbr,//专家医院简称
                    "department_name": expertInfo.department_name,//科室名称
                    "doctor_skill": expertInfo.doctor_skill,//专家擅长
                    "doctor_user_id": expertInfo.doctor_user_id,//医生ID
                    "doctor_avatar": expertInfo.doctor_avatar,//医生头像
                    "pay_value": expertInfo.pay_value,//支付金额
                    "begin_dt": expertInfo.begin_dt,//门诊开始时间
                    "end_dt": expertInfo.end_dt,//门诊结束时间
                    "patient_name": expertInfo.patient_name,//患者姓名
                    "phone_num": expertInfo.phone_num,//患者电话
                    "medical_url": expertInfo.phone_num,//病历地址,
                    "doctor_introduce": expertInfo.doctor_introduce,
                    "realImageUrl": ExpertApiObj.createDoctorUrl(RenderParam.expertUrl, expertInfo.doctor_user_id, expertInfo.doctor_avatar, RenderParam.carrierId)
                },
                "extras_info": {
                    "landline_phone": phoneNum
                }
            }
            InnerFunc.log("inquiryExpert->str::" + JSON.stringify(inquiryJson));
            LMAndroid.JSCallAndroid.doExpertWaitingRoom(JSON.stringify(inquiryJson));
        }
    };

    var P2PObj = {

        ONLINE_INQUIRY_MODULE_ID: '1001',        // 在线问诊模块标识
        ONLINE_INQUIRY_MODULE_NAME: '在线问诊',    // 在线问诊模块名称

        EXPERT_INQUIRY_MODULE_ID: '1002',        // 专家问诊模块标识
        EXPERT_INQUIRY_MODULE_NAME: '专家约诊咨询',// 专家问诊模块名称

        /** 当前问诊类型 */
        InquiryType: {
            VIDEO: '1',                         // 电视视频（EPG对应视频问诊插件，APK调用安卓进行交互）
            TV_PHONE: '2',                      // 电视电话
            WE_CHAT_VIDEO: '3',                 // 微信视频
            WE_CHAT_TELETEXT: '4',              // 微信图文
        },

        /** 问诊入口类型 */
        InquiryEntry: {
            ONLINE_INQUIRY: 1,                  // 在线问诊
            EXPERT_INQUIRY: 2,                  // 视频问专家-诊前咨询
            EXPERT_INQUIRY_ONGOING: 3,          // 就诊
            EXPERT_INQUIRIED_RECORD: 4,         // 视频问专家-诊后咨询
            EXPERT_INQUIRIING_RECORD: 5,        // 视频问专家-已约咨询
            INQUIRY_RECORD: 6,                  // 问诊记录
            INTERNET_HOSPITAL_39: 7             // 39互联网医院咨询
        },

        /**
         * 开始问诊功能
         * @param inquiryInfo 问诊的相关信息
         *  -- userInfo，用户相关的信息，例如用户是否vip，用户的业务账号
         *  -- memberInfo，家庭成员信息，方便用户问诊之后进行归档
         *  -- doctorInfo，问诊的医生信息
         *  -- serverInfo，相关的服务器信息，目前只存在cws互联网医院模块链接地址和微信图文服务器链接地址
         *  -- moduleInfo，问诊的模块相关信息
         *  -- blacklistHandler，检测用户黑名单时的处理函数
         *  -- noInquiryTimesHandler，检测普通用户无问诊次数时处理函数
         *  -- doctorOfflineHandler，检测医生离线时的处理函数
         *  -- inquiryType，发起问诊的方式（电视视频，电视电话，微信视频）
         *  -- inquiryByPlugin，是否采用问诊插件进行问诊（epg使用问诊插件问诊，apk直接发起通过js调用android方法进行性问诊）
         */
        startInquiry: function (inquiryInfo) {
            // 判断是否为连续两次点击按钮
            LMEPG.UI.forbidDoubleClickBtn(function () {
                // 1、检测用户是否为问诊黑名单用户
                DoctorApiObj.isInquiryBlacklist(function (blackListData) {
                    if (blackListData.is_forbid) { // 1.1 -- 用户为问诊黑名单用户
                        inquiryInfo.blacklistHandler(inquiryInfo.moduleInfo.focusId);
                    } else { // 1.2、用户为问诊非黑名单用户
                        // 2、检测用户身份
                        var isUserVip = inquiryInfo.userInfo.isVip;
                        var isVIPInquiry = LMEPG.Func.isAllowAccess(isUserVip, ACCESS_NO_TYPE);
                        if (isVIPInquiry) { // 2.1、用户为VIP身份
                            // 3、检测当前医生是否在线
                            if(RenderParam.carrierId === '440001' && inquiryInfo.leftTime < 1 ){
                                inquiryInfo.noTimesHandler(inquiryInfo.moduleInfo.focusId);
                            }else {
                                P2PObj._startInquiry(inquiryInfo);
                            }
                        } else { // 2.2、用户为普通用户身份
                            // 4、检测用户的免费问诊次数
                            DoctorApiObj.getFreeInquiryTimes(function (inquiryTimesData) {
                                inquiryTimesData = inquiryTimesData instanceof Object ? inquiryTimesData : JSON.parse(inquiryTimesData);
                                if (inquiryTimesData.result === 0 || inquiryTimesData.result === '0') {
                                    if (parseInt(inquiryTimesData.remain_count) < 1) { // 4.1、用户的免费问诊次数为0
                                        inquiryInfo.noTimesHandler(inquiryInfo.moduleInfo.focusId);
                                    } else { // 4.2、用户的免费问诊次数至少有1次，检测当前医生是否在线
                                        P2PObj._startInquiry(inquiryInfo)
                                    }
                                } else {
                                    LMEPG.UI.showToast('获取免费咨询次数失败' + inquiryTimesData.result);
                                }
                            })
                        }
                    }
                });
            });
        },

        /**
         * 问诊条件用户条件检测完成之后开始检测医生条件，并在检测完成之后针对不同的问诊方式进行问诊
         * @param inquiryInfo 问诊相关的信息
         * @private
         */
        _startInquiry: function (inquiryInfo) {
            var doctorId = inquiryInfo.doctorInfo.doc_id;
            // 1、检测当前医生在线状态
            DoctorApiObj.checkDoctorStatus(doctorId, function (isDoctorOnline) {
                if (isDoctorOnline) { // 1.1、当前医生在线
                    switch (inquiryInfo.inquiryType) {
                        case P2PObj.InquiryType.VIDEO:
                            // 电视视频问诊
                            P2PObj._startVideoInquiry(inquiryInfo);
                            break;
                        case P2PObj.InquiryType.TV_PHONE:
                            P2PObj._startTVPhoneInquiry(inquiryInfo);
                            break;
                        case P2PObj.InquiryType.WE_CHAT_VIDEO:
                            // 微信视频问诊
                            P2PObj._startWeChatVideoInquiry(inquiryInfo);
                            break;
                    }
                } else { // 1.2、当前医生不在线
                    inquiryInfo.doctorOfflineHandler();
                }
            });
        },

        /**
         * 电视视频问诊，区分epg的插件和android问诊
         * @param inquiryInfo 问诊相关的信息
         * @private
         */
        _startVideoInquiry: function (inquiryInfo) {
            if (inquiryInfo.inquiryByPlugin === '1') { // 当前地区为EPG，使用问诊插件进行问诊
                InnerFunc.startInquiry(inquiryInfo);
            } else { // 当前地区为APK，通过JS的方式调用android方法进行问诊
                InnerFunc.checkHasCameraAndRetTelNum(function (hasCamera, inquiryHistoryPhoneNum) { // 借助android底层检测是否插入摄像头
                    InnerFunc.log("checkHasCameraAndRetTelNum-hasCamera = " + hasCamera + ", landlinePhoneNum = " + inquiryHistoryPhoneNum);
                    if (hasCamera) { // 检测到摄像头，直接发起问诊
                        InnerFunc.startInquiryByAndroid("", inquiryInfo);
                    } else { // 弹出对话框,进行电话问诊
                        DoctorApiObj.getPhoneList(function (phoneList) {
                            // 2、显示选择电话号码弹窗
                            InnerView.showInputPhone(phoneList, inquiryInfo.moduleInfo.focusId, function (phoneNum) {
                                InnerFunc.startInquiryByAndroid(phoneNum, inquiryInfo);
                            });
                        });
                    }
                });
            }
        },

        /**
         * 电视电话问诊
         * @param inquiryInfo 问诊相关信息
         * @private
         */
        _startTVPhoneInquiry: function (inquiryInfo) {
            // 电视电话问诊，显示电视电话弹窗
            DoctorApiObj.getPhoneList(function (phoneList) {
                // 2、显示选择电话号码弹窗
                InnerView.showInputPhone(phoneList, inquiryInfo.moduleInfo.focusId, function (phoneNum) {
                    P2PObj.routeInquiryCallUI(phoneNum, inquiryInfo);
                },true);
            });
        },

        /**
         * 微信视频问诊
         * @param inquiryInfo 问诊相关信息
         * @private
         */
        _startWeChatVideoInquiry: function (inquiryInfo) {
            var doctorInfo = inquiryInfo.doctorInfo;
            // 1、请求小程序二维码图片链接
            DoctorApiObj.getInquiryQRCode(doctorInfo.doc_id, function (data) {
                // 1.1、拼接微信小程序二维码码图片地址
                var QRCodeImageUrl = data.data;
                var dialogConfig = {
                    QRCodeImageUrl: QRCodeImageUrl,
                    inquiryType: P2PObj.InquiryType.WE_CHAT_VIDEO,
                    focusIdOnDialogHide: inquiryInfo.moduleInfo.focusId
                }
                // 1.2、 显示小程序二维码
                InnerView.showQRCode(dialogConfig);

                // 1.3、轮询用户扫描结果
                var scene = data.scene;
                P2PObj._loopWeChatVideoScanResult(scene, function () {
                    var inquiryCallIntent = LMEPG.Intent.createIntent('inquiryCall');
                    inquiryCallIntent.setParam('doc_id', doctorInfo.doc_id);
                    inquiryCallIntent.setParam('avatar_url', doctorInfo.avatar_url);
                    inquiryCallIntent.setParam('doc_name', doctorInfo.doc_name);
                    inquiryCallIntent.setParam('scene', scene);
                    LMEPG.Intent.jump(inquiryCallIntent, inquiryInfo.moduleInfo.intent);
                });
            })
        },

        /**
         * 医生离线时提供的默认函数
         */
        offlineFunc: function () {
            LMEPG.UI.showToast('当前医生不在线');
        },

        /**
         * 路由电话问诊页面
         * @param phoneNum 用户手机号码
         * @param inquiryInfo 跳转问诊页面的配置参数
         */
        routeInquiryCallUI: function (phoneNum, inquiryInfo) {
            var inquiryCallIntent = LMEPG.Intent.createIntent('inquiryCall');

            var doctorInfo = inquiryInfo.doctorInfo;
            inquiryCallIntent.setParam('doc_id', doctorInfo.doc_id);
            inquiryCallIntent.setParam('avatar_url', doctorInfo.avatar_url);
            inquiryCallIntent.setParam('doc_name', doctorInfo.doc_name);
            inquiryCallIntent.setParam('department', doctorInfo.department);
            inquiryCallIntent.setParam('hospital', doctorInfo.hospital);
            inquiryCallIntent.setParam('phone', phoneNum);
            inquiryCallIntent.setParam('entryType', inquiryInfo.moduleInfo.moduleType);

            LMEPG.Intent.jump(inquiryCallIntent, inquiryInfo.moduleInfo.intent);
        },

        /**
         * 一键问医功能按钮封装，首先获取助理医生信息，然后再弹出多种问诊方式选择对话框
         * @param inquiryInfo 问诊相关的配置 (具体见P2PObj内部的startInquiry方法参数)
         */
        oneKeyInquiry: function (inquiryInfo) {
            LMEPG.UI.forbidDoubleClickBtn(function () {
                LMEPG.UI.showWaitingDialog();
                // 1、获取需要问诊医生的相关信息
                ExpertApiObj.getAdvisoryDoctor(function (data) {
                    LMEPG.UI.dismissWaitingDialog();
                    if (data.code === 0 || data.code === '0') {
                        inquiryInfo.doctorInfo = data.doc_info;
                        inquiryInfo.inquiryTypeList = data.inquiry_type_list;
                        // 2、显示多种问诊选择方式弹窗
                        InnerView.showMultiTypeInquiryDialog(inquiryInfo);
                    } else {
                        LMEPG.UI.showToast("当前没有医生在线，请稍后再试！");
                    }
                });
            });
        },

        /**
         * 轮询微信视频二维码扫描状态
         */
        _loopWeChatVideoScanResult: function (scene, scannedCallback) {
            setTimeout(function () {
                DoctorApiObj.queryWeChatVideoScanResult(scene, scannedCallback);
            }, 1000);
        },

        /**
         * 微信图文问诊
         * @param teletextInquiryUrl 请求微信图文的地址
         * @param cwsHlwyyUrl CWS问诊互联网地址
         * @param focusId 的焦点按钮
         */
        startWeChatTeletextInquiry: function (teletextInquiryUrl, cwsHlwyyUrl, focusId) {
            DoctorApiObj.getTeletextQRCode(teletextInquiryUrl, function (data) {
                var QRCodeImageUrl = cwsHlwyyUrl.substring(0, cwsHlwyyUrl.length - 9) + data.result.QRCode;
                var dialogConfig = {
                    QRCodeImageUrl: QRCodeImageUrl,                          // 微信图文问诊二维码图片地址
                    inquiryType: P2PObj.InquiryType.WE_CHAT_TELETEXT,        // 微信图文问诊
                    focusIdOnDialogHide: focusId                             // 对话框消失时页面获取焦点ID
                }
                // 显示二维码弹框
                InnerView.showQRCode(dialogConfig);
            });
        },

        /**
         * 问诊助理医生
         * 获取医生规则：
         * 在线状态 在线 > 忙碌 > 离线 根据医生排序 杨梨娜 > 杨珊 > 杨倩 > 黄姗姗(Test)  貌似杨梨娜已经账号冻结了
         */
        inquiryAdvisoryDoctor: function (offlineCallback, moduleInfo) {
            LMEPG.UI.forbidDoubleClickBtn(function () {
                LMEPG.UI.showWaitingDialog();
                InnerFunc.getAdvisoryDoctor(offlineCallback, moduleInfo);
            });
        },
        /**
         * 问诊咨询医生
         * 获取医生规则：1.杨丽娜 2.杨倩 3.杨娴 4.田黎 5.李承平 6.周鹭，如果排在第一的医生忙碌或离线则呼叫第二的医生，依次类推。如果这六个医生全部忙碌或者离线，则排除六医的医生，呼叫在线》忙碌》的医生，有多个医生在线，则呼叫问诊次数多的医生，问诊次数相同呼叫职称高的医生。
         */
        inquiryAssistantDoctor: function (offlineCallback) {
            LMEPG.UI.forbidDoubleClickBtn(function () {
                LMEPG.UI.dismissWaitingDialog();
                InnerFunc.getAssistantDoctor(offlineCallback);
            });
        },

    };

    var CommonApi = {

        buildInquiryParam: function (doctorInfo, asyncCallBack) {
            var postData = {
                "area": doctorInfo.area,
                "avatar_url": doctorInfo.avatar_url,
                "avatar_url_new": doctorInfo.avatar_url_new,
                "department": doctorInfo.department,
                "doc_id": doctorInfo.doc_id,
                "doc_name": doctorInfo.doc_name,
                "gender": doctorInfo.gender,
                "good_disease": doctorInfo.good_disease,
                "hospital": doctorInfo.hospital,
                "inquiry_num": doctorInfo.inquiry_num,
                "intro_desc": doctorInfo.intro_desc,
                "job_title": doctorInfo.job_title,
                "online_state": doctorInfo.online_state,
                "realImageUrl": doctorInfo.realImageUrl,
                "module_id": "10001",
                "module_name": "视频问诊",
                "member_id": doctorInfo.member_id,
                "member_name": doctorInfo.member_name,
                "member_age": doctorInfo.member_age,
                "member_gender": doctorInfo.member_gender,
            };
            LMEPG.ajax.postAPI("Doctor/buildInquiryParam", postData, function (data) {
                if (typeof (data.param_info) !== "undefined" && data.param_info != null && data.param_info != "") {
                    asyncCallBack(data.param_info);
                } else {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("生成问诊参数失败");
                }
            });
        },
        /**
         * 保存问诊参数（多半用于第一次启动）
         * @param paramInfo 通过buildInquiryParam()方法获取的参数构造
         * @param asyncCallBack 请求结果异步回调
         */
        saveInquiryParam: function (paramInfo, asyncCallBack) {
            var postData = {
                'mac_addr': CommonApi._getMacAddress(),
                'param_info': paramInfo
            };
            LMEPG.ajax.postAPI("Expert/saveInquiryParam", postData, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * -- 获取电视盒子绑定MAC地址，由于问诊插件（apk）是安装在盒子上，
         * -- 当检测问诊插件相关参数时，需要与具体的某个盒子联系，故而取MAC地址来做为唯一标识
         * @returns {*}
         * @private
         */
        _getMacAddress: function () {
            var retMac = "";
            try {
                if (RenderParam.carrierId == "520094") {   //贵州广电
                    if (starcorCom.get_env() !== 'starcor') {
                        var ethernet = Network.ethernets[0];
                        retMac = ethernet.MACAddress;
                    } else {
                        retMac = android.get_mac_info();
                    }
                } else if (RenderParam.carrierId == "410092") { // 河南电信EPG
                    retMac = RenderParam.accountId;
                } else {
                    var macAddr = LMEPG.STBUtil.getSTBMac(); //获取mac地址
                    macAddr.replace(":", "");
                    macAddr.replace("-", "");
                    retMac = macAddr;
                }
            } catch (e) {
                retMac = "";
            }

            return retMac;
        }
    };

    var ExpertApiObj = {

        /**
         * 获取服务器时间
         * @param asyncCallBack
         */
        getTime: function (asyncCallBack) {
            LMEPG.ajax.postAPI("Expert/getTime", {}, function (timeStr) {
                asyncCallBack(timeStr);
            });
        },
        /**
         * 获取部门
         * @param asyncCallBack
         */
        getDepartment: function (asyncCallBack) {
            LMEPG.ajax.postAPI("Expert/getDepartmentApi", {}, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * 获取医生列表
         * @param departmentID
         * @param limitBegin
         * @param limitNum
         * @param asyncCallBack
         */
        getDoctorList: function (departmentID, limitBegin, limitNum, asyncCallBack) {
            var reqJsonObj = {
                "departmentID": departmentID,
                "limitBegin": limitBegin,
                "limitNum": limitNum
            };
            LMEPG.ajax.postAPI("Expert/getDoctorListApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * 获取专家详细信息
         * @param clinicID
         * @param asyncCallBack
         */
        getExpertDetail: function (clinicID, asyncCallBack) {
            var reqJsonObj = {
                "clinicID": clinicID,
            };
            LMEPG.ajax.postAPI("Expert/getExpertDetail", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * 获取预约成功的信息
         * @param timestamp
         * @param asyncCallBack
         */
        getAppointmentInfo: function (timestamp, asyncCallBack) {
            var reqJsonObj = {
                "timestamp": timestamp
            };
            LMEPG.ajax.postAPI("Expert/getAppointmentApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * 获取二维码信息      // 1:支付订单,2:上传材料,3:立即预约
         * @param appointmentID
         * @param qrCodeType
         * @param asyncCallBack
         */
        getQrCodeViaAppointmentID: function (appointmentID, qrCodeType, asyncCallBack) {
            var reqJsonObj = {
                "qrCodeType": qrCodeType,
                "appointmentID": appointmentID,
                "clinicID": ""
            };
            LMEPG.ajax.postAPI("Expert/getQrCodeApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         *
         * @param clinicID
         * @param asyncCallBack
         */
        getQrCodeViaClinicID: function (clinicID, asyncCallBack) {
            var reqJsonObj = {
                "qrCodeType": 3,
                "appointmentID": "",
                "clinicID": clinicID
            };
            LMEPG.ajax.postAPI("Expert/getQrCodeApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        getQrCodeViaClinicIDWithActivity: function (clinicID, asyncCallBack) {
            var reqJsonObj = {
                "qrCodeType": 4,
                "appointmentID": "",
                "clinicID": clinicID
            };
            LMEPG.ajax.postAPI("Expert/getQrCodeApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * 获取病例资料信息
         * @param appointmentID
         * @param asyncCallBack
         */
        getMaterialList: function (appointmentID, asyncCallBack) {
            var reqJsonObj = {
                "appointmentID": appointmentID,
            };
            LMEPG.ajax.postAPI("Expert/getMaterialListApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * 获取医生建议信息
         * @param appointmentID
         * @param asyncCallBack
         */
        getPatientList: function (appointmentID, asyncCallBack) {
            var reqJsonObj = {
                "appointmentID": appointmentID,
            };
            LMEPG.ajax.postAPI("Expert/getPatientApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         *  获取约诊记录信息
         * @param appointmentID
         * @param limitBegin
         * @param limitNum
         * @param asyncCallBack
         */
        getInquiryList: function (appointmentID, limitBegin, limitNum, asyncCallBack) {
            var reqJsonObj = {
                "appointmentID": appointmentID,
                "limitBegin": limitBegin,
                "limitNum": limitNum,
            };
            LMEPG.ajax.postAPI("Expert/getInquiryListApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         *  获取约诊记录信息
         * @param appointmentID
         * @param limitBegin
         * @param limitNum
         * @param asyncCallBack
         */
        getInquiryFilterList: function (appointmentID, limitBegin, limitNum, asyncCallBack) {
            var reqJsonObj = {
                "appointmentID": appointmentID,
                "limitBegin": limitBegin,
                "limitNum": limitNum,
            };
            LMEPG.ajax.postAPI("Expert/getInquiryFilterListApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * 获取咨询医生
         * @param asyncCallBack
         */
        getAdvisoryDoctor: function (asyncCallBack) {
            var reqJsonObj = {};
            LMEPG.ajax.postAPI("Expert/getAdvisoryDoctor", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },
        /**
         * 获取助理医生
         * @param asyncCallBack
         */
        getAssistantDoctor: function (asyncCallBack) {
            var reqJsonObj = {};
            LMEPG.ajax.postAPI("Doctor/getAssistantDoctor", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        /**
         * 上报专家约诊记录
         * @param userPhone 用户电话号码
         * @param asyncCallBack
         */
        postUserTel: function (userPhone, asyncCallBack) {
            var reqJsonObj = {
                "user_phone": userPhone
            };
            LMEPG.ajax.postAPI("Expert/postUserTelApi", reqJsonObj, function (data) {
                asyncCallBack(data);
            });
        },

        createDoctorUrl: function (urlPrefix, doctorId, avatarUrl, carrierID) {
            var head = {
                func: "getDoctorHeadImage",
                carrierId: carrierID,
                areaCode: "",
            };
            var json = {
                doctorId: doctorId,
                avatarUrl: avatarUrl
            };
            return urlPrefix + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
        },

        createCaseUrl: function (urlPrefix, imgUrl) {
            var head = {
                func: "getImage",
            };
            var json = {
                imageUrl: imgUrl
            };
            return urlPrefix + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
        }

    };

    var DoctorApiObj = {

        /**
         * 问诊量转化
         * @param inquiryNum
         */
        switchInquiryNumStr: function (inquiryNum) {
            var number = "0";
            if (parseInt(inquiryNum + "") >= 10000) {
                number = (parseFloat(inquiryNum + "") / parseFloat(10000 + "")).toFixed(1) + "万";
            } else {
                number = inquiryNum;
            }
            return number;
        },

        /**
         * 获取用户校验过的手机号列表
         *  - 方便用户选择，简化用户操作复杂度
         *  @param callback 异步回调函数
         */
        getPhoneList: function (callback) {
            var param = {};
            var defaultPhoneList = [];
            LMEPG.ajax.postAPI("Doctor/getPhoneList", param, function (phoneListData) {
                // 校准返回数据位JSON对象
                phoneListData = phoneListData instanceof Object ? phoneListData : JSON.parse(phoneListData);
                if (phoneListData.result === 0 || phoneListData.result === '0') {
                    if (phoneListData.phone_list && phoneListData.phone_list !== '') {
                        // 已经有校验过的电话号码
                        var phoneList = phoneListData.phone_list.split(',');
                        callback(phoneList);
                    } else {
                        callback(defaultPhoneList);
                    }
                } else {
                    LMEPG.Log.error("getPhoneList fail: " + phoneListData.result);
                    // 请求出错，不影响用户继续操作
                    callback(defaultPhoneList);
                }
            }, function (errorData) {
                LMEPG.Log.error("getPhoneList error: " + errorData);
                // 请求出错，不影响用户继续操作
                callback(defaultPhoneList);
            })
        },

        /**
         * 存取用户校验过的手机号列表
         *  - 方便用户下次问诊选择，简化用户操作复杂度
         * @param phoneNumber 用户校验的电话号码
         * @param callback 异步回调函数
         */
        pushPhoneList: function (phoneNumber, callback) {
            var param = {
                "phoneNumber": phoneNumber
            };
            var defaultPhoneList = [];
            LMEPG.ajax.postAPI("Doctor/pushPhoneList", param, function (operateData) {
                // 校准返回数据位JSON对象
                operateData = operateData instanceof Object ? operateData : JSON.parse(operateData);
                if (operateData.result === 0 || operateData.result === '0') {
                    LMEPG.Log.error("pushPhoneList success.");
                    // 数据请求成功，正常返回
                    callback();
                } else {
                    LMEPG.Log.error("pushPhoneList fail: " + operateData.result);
                    // 请求出错，不影响用户继续操作
                    callback();
                }
            }, function (errorData) {
                LMEPG.Log.error("pushPhoneList error: " + errorData);
                // 请求出错，不影响用户继续操作
                callback();
            })
        },

        /**
         * 电话问诊时校验电话号码
         * @param phoneNum 电话号码
         * @param isCheckSMSCode 是否需要检测手机短信验证码
         * @param callback 校验成功回调
         */
        verifyPhoneNumber: function (phoneNum, isCheckSMSCode, callback) {
            var postData = {
                'phone': phoneNum,
                'send_sms': isCheckSMSCode
            };

            LMEPG.UI.showWaitingDialog("", 10);
            LMEPG.ajax.postAPI("Doctor/verifyPhoneNumber", postData, function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if (data.result == 0) {
                        callback(data);
                    } else {
                        LMEPG.UI.showToast('校验问诊号码错误');
                    }
                    LMEPG.UI.dismissWaitingDialog();
                } catch (e) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast('校验问诊号码据解析异常');
                }
            }, function () {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast('获取验证码失败');
            });
        },

        /**
         * 校验手机短信验证码
         * @param phoneNum 手机号
         * @param checkCode 手机验证码
         * @param callback 检验成功回调
         */
        verifyCheckCode: function (phoneNum, checkCode, callback) {
            var postData = {
                phone: phoneNum,
                sms_code: checkCode,
            };
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI("Doctor/verifyTelCode", postData, function (data) {
                var checkObj = data instanceof Object ? data : JSON.parse(data);
                if (checkObj.result == "0") {
                    callback();
                } else {
                    LMEPG.UI.showToast("短信验证校验失败！");
                }
                LMEPG.UI.dismissWaitingDialog();
            }, function () {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("短信验证校验失败！");
            });
        },

        /**
         * 获取微信视频问诊二维码
         * @param doctorId  问诊医生ID
         * @param callback  接口请求成功回调
         */
        getInquiryQRCode: function (doctorId, callback) {
            var postData = {
                type: 10001,
                payload: JSON.stringify({
                    doc_id: doctorId,
                    carrierId: RenderParam.carrierId,
                    nikeName: RenderParam.accountId,
                    userId: RenderParam.userId,
                    isVip: RenderParam.isVip
                })
            };

            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('NewHealthDevice/getDeviceQR', postData, function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    console.log(data);
                    if (data.data.code === 200) {
                        callback(data.data);
                    } else {
                        LMEPG.UI.showToast('获取小程序码失败！' + data.code);
                    }
                } catch (e) {
                    LMEPG.UI.showToast('获取小程序码数据解析异常');
                }
                LMEPG.UI.dismissWaitingDialog();
            }, function () {
                LMEPG.UI.showToast('获取小程序码失败！');
                LMEPG.UI.dismissWaitingDialog();
            });
        },

        /**
         * 查询用户扫描小程序二维码状态+
         * @param scene 检测扫描结果参数
         * @param scannedCallback 已扫描状态回调函数
         */
        queryWeChatVideoScanResult: function (scene, scannedCallback) {
            var postData = {
                scene: scene
            }
            LMEPG.ajax.postAPI('Doctor/getInquiryStatus', postData, function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if (parseInt(data.result) === 0 && data.state > 0) {
                        scannedCallback();
                    } else {
                        P2PObj._loopWeChatVideoScanResult(scene, scannedCallback);
                    }
                } catch (e) {
                    P2PObj._loopWeChatVideoScanResult(scene, scannedCallback);
                }
            }, function () {
                P2PObj._loopWeChatVideoScanResult(scene, scannedCallback);
            });
        },

        /**
         * 获取微信图文问诊二维码
         * @param url       请求获取微信图文问诊二维码地址
         * @param callback  接口请求成功回调
         */
        getTeletextQRCode: function (url, callback) {
            var postData = {
                url: url
            };
            LMEPG.ajax.postAPI('Doctor/getTeletextQrcode', postData, function (data) {
                data = data instanceof Object ? data : JSON.parse(data);
                console.log(data);
                if (data.result && data.result.code == 0) {
                    callback(data);
                } else {
                    LMEPG.UI.showToast('获取图文问诊二维码失败！');
                }
                LMEPG.UI.dismissWaitingDialog();
            }, function () {
                LMEPG.UI.showToast('获取图文问诊二维码失败！');
                LMEPG.UI.dismissWaitingDialog();
            });
        },

        /**
         * 根据医生id获取医生在线状态
         * @param docId
         * @param asyncCallback
         */
        getDoctorStatus: function (docId, asyncCallback) {
            var postData = {
                "doctor_id": docId
            };
            LMEPG.ajax.postAPI("Doctor/getDoctorStatus", postData, function (rsp) {
                asyncCallback(rsp);
            });
        },

        /**
         * 检测医生在想状态
         * @param doctorId 医生ID
         * @param asyncCallback 回调函数
         */
        checkDoctorStatus: function (doctorId, asyncCallback) {
            var retOnlineStatus = false;
            var postData = {
                "doctor_id": doctorId
            };
            LMEPG.ajax.postAPI("Doctor/getDoctorStatus", postData, function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if (data.data.code === 0 || data.data.code === '0') {
                        var status = "";
                        if (typeof data.data.doctor_status != 'undefined') {
                            status = data.data.doctor_status;
                        } else if (typeof data.data.status != 'undefined') {
                            status = data.data.status;
                        }

                        if (status === "1" || status === 1) {    // 在线、忙碌，发起请求，医生列表时的在线状态和拉取的在线状态不匹配，需要转化
                            retOnlineStatus = true;
                        }
                    }
                    LMEPG.call(asyncCallback, [retOnlineStatus]);
                } catch (e) {
                    InnerFunc.log('[inquiry.js]---[checkDoctorStatus]--->Exception: ' + e.toString());
                }
            });
        },

        /**
         * 获取医生信息 - 固定医院信息（主要新疆电信社区医院使用）
         * @param isShowLoadingStatus 是否展示等待加载框 （医生列表页定时刷新状态不需要展示）
         * @param requestInfo 请求信息
         * - deptId id
         * - deptIndex 科室编号ID - 后端缓存优化数据使用
         * - page 当前页码
         * - pageSize 每页显示多少数据
         * @param successCallback 加载成功回调
         * @param failCallback 加载失败回调

         */
        getDoctorList: function (isShowLoadingStatus, requestInfo, successCallback, failCallback) {
            if (isShowLoadingStatus) {
                LMEPG.UI.showWaitingDialog();
            }
            LMEPG.ajax.postAPI("Doctor/getDoctorList", requestInfo, function (doctorListData) {
                LMEPG.UI.dismissWaitingDialog();
                doctorListData = doctorListData instanceof Object ? doctorListData : JSON.parse(doctorListData);
                if (doctorListData.result && (doctorListData.result.code === 0 || doctorListData.result.code === '0')) {
                    successCallback(doctorListData.result);
                } else {
                    failCallback(doctorListData);
                }
            }, function (errorData) {
                LMEPG.UI.dismissWaitingDialog();
                failCallback(errorData);
            });
        },

        /**
         * 获取医生信息 - 固定医院信息（主要新疆电信社区医院使用）
         * @param isShowLoadingStatus 是否展示等待加载框 （医生列表页定时刷新状态不需要展示）
         * @param requestInfo 请求信息
         * - deptId id
         * - deptIndex 科室编号ID - 后端缓存优化数据使用
         * - page 当前页码
         * - pageSize 每页显示多少数据
         * - hospitalId 医院ID
         * @param successCallback 加载成功回调
         * @param failCallback 加载失败回调
         */
        getDoctorListByHospitalId: function (isShowLoadingStatus, requestInfo, successCallback, failCallback) {
            if (isShowLoadingStatus) {
                LMEPG.UI.showWaitingDialog();
            }
            LMEPG.ajax.postAPI("Doctor/getDoctorListByHospId", requestInfo, function (doctorListData) {
                LMEPG.UI.dismissWaitingDialog();
                doctorListData = doctorListData instanceof Object ? doctorListData : JSON.parse(doctorListData);
                if (doctorListData.result && (doctorListData.result.code === 0 || doctorListData.result.code === '0')) {
                    successCallback(doctorListData.result);
                } else {
                    failCallback(doctorListData);
                }
            }, function (errorData) {
                LMEPG.UI.dismissWaitingDialog();
                failCallback(errorData);
            });
        },

        /**
         * 获取医生详情
         * @param docId 医生ID
         * @param asyncCallback 回到函数
         */
        getDoctorDetail: function (docId, asyncCallback) {
            var postData = {};
            postData.doctor_id = docId;
            LMEPG.ajax.postAPI("Doctor/getDoctorDetail", postData, function (data) {
                asyncCallback(data);
            });
        },

        /**
         * 获取免费问诊次数
         * @param asyncCallback 回调函数
         */
        getFreeInquiryTimes: function (asyncCallback) {
            var postData = {};
            LMEPG.ajax.postAPI("Doctor/getFreeInquiryTimes", postData, function (data) {
                asyncCallback(data);
            });
        },

        /**
         * 获取问诊记录
         * @param memberId
         * @param pageCurrent
         * @param asyncCallback
         */
        getInquiryRecordDetail: function (memberId, pageCurrent, asyncCallback) {
            var reqData = {
                "member_id": memberId,
                "page_current": pageCurrent
            };
            LMEPG.ajax.postAPI("Doctor/getInquiryRecordDetail", reqData, function (data) {
                asyncCallback(data);
            });
        },

        /**
         * 获取医院部门
         * @param asyncCallback 回调函数
         */
        getDepartmentList: function (asyncCallback) {
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Doctor/getDepartment', {}, function (departmentData) {
                LMEPG.UI.dismissWaitingDialog();
                departmentData = departmentData instanceof Object ? departmentData : JSON.parse(departmentData);
                if (departmentData.code === 0 || departmentData.code === '0') {
                    asyncCallback(departmentData);
                } else {
                    LMEPG.UI.showToast('获取科室列表失败！');
                }
            }, function (errorData) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast('服务器出错，获取科室列表失败！');
            });
        },

        /**
         * 判断是否是黑名单用户
         * @param callback
         */
        isInquiryBlacklist: function (callback) {
            var postData = {};
            LMEPG.ajax.postAPI('Doctor/isInquiryBlacklist', postData, function (data) {
                var blacklistObj = data instanceof Object ? data : JSON.parse(data);
                if (blacklistObj.result === '0' || blacklistObj.result === 0) {
                    callback(data);
                } else {
                    LMEPG.UI.showToast('校验黑名单失败');
                }
            }, function () {
                LMEPG.UI.showToast('校验黑名单失败！');
            });
        },
    };

    var APKManager = {
        _installTimer: null,
        _loopTimes: 0, //循环校验apk是否安装次数

        // 拉起apk插件
        _launch: function (inquiryParam, appInfoData) {
            switch (RenderParam.carrierId) {
                case "410092":
                    if (typeof HybirdCallBackInterface == "undefined") {
                        LMEPG.UI.showToast("机顶盒不支持此插件,请升级后再使用!");
                    } else {
                        HybirdCallBackInterface.appOpenOrDownload(appInfoData.downloadUrl, appInfoData.appPackageName, "39健康-视频问诊");
                    }
                    break;
                case "520094":
                    var command = "am broadcast -a com.chinanetcenter.APP_DETAIL_RECEIVER -e packageName " + appInfoData.appPackageName + " -e type SOFTWARE";
                    if (starcorCom.get_env() !== 'starcor') {
                        Utility.ioctlWrite("EXECUTE_COMMAND", command.toString());
                    } else {
                        android.runCommand(command);
                    }
                    break;
                case "10000051":
                    LMEPG.UI.showToast("正在发起咨询，请稍等...", 5);    //已经安装，启动插件
                    LMEPG.ApkPlugin.startAppByIntent(inquiryParam);
                    if(RenderParam.lmp === "266"){
                        setTimeout(function () {doctorDetailController.routeQrCode();},5000);
                    }
                    break;
                default:
                    LMEPG.UI.showToast("正在发起咨询，请稍等...", 5);    //已经安装，启动插件
                    LMEPG.ApkPlugin.startAppByIntent(inquiryParam);
                    break;
            }
        },

        /**
         * 启动apk插件
         * @param inquiryParam 问诊参数，用于传递到插件apk
         * @param pageFocusId 弹窗弹出前页面的焦点
         */
        launchApp: function (inquiryParam, pageFocusId) {
            LMEPG.UI.showWaitingDialog();
            LMEPG.ajax.postAPI('Doctor/getAppInfo', {}, function (appInfoData) {
                LMEPG.UI.dismissWaitingDialog();
                // 贵州广电检测版本升级逻辑现在局方，EPG无法控制
                if (RenderParam.carrierId === '520094') {
                    APKManager._launch(inquiryParam, appInfoData);
                    return;
                }
                // 1、检测插件是否已安装在盒子
                var isInstallApp = APKManager.checkAppIsInstall(appInfoData.appPackageName);
                LMEPG.Log.debug("launchApp isInstallApp: " + isInstallApp);

                if (isInstallApp) {
                    // 2、检测插件是否需要升级
                    var needUpdate = APKManager.checkIsAppNeedUpdate(appInfoData);
                    LMEPG.Log.debug("launchApp needUpdate: " + needUpdate);
                    if (needUpdate) {
                        // 展示弹窗提示用户升级插件apk
                        InnerView.showUpdatePluginDialog(pageFocusId, function () {
                            // 修改下载版本号和下载链接
                            if (RenderParam.carrierId === '410092') {
                                HybirdCallBackInterface.appOpenOrDownload(appInfoData.downloadUrl, appInfoData.appPackageName, "39健康-视频问诊-版本A");
                            } else {
                                APKManager.installApp(appInfoData);
                            }
                        });
                    } else {
                        // 正常拉起插件apk
                        APKManager._launch(inquiryParam, appInfoData);
                    }
                    APKManager._launch(inquiryParam, appInfoData);
                } else {
                    // 3、安装插件到盒子
                    APKManager.installApp(appInfoData);
                }
            })
        },


        /**
         * 检查插件是否已在盒子安装
         * @param appPackageName 插件apk的包名
         * @returns {*} true - 已安装在盒子 false - 未安装在盒子
         */
        checkAppIsInstall: function (appPackageName) {
            var isInstall = false;
            if (RenderParam.carrierId === '410092' || RenderParam === '520094') {
                // 河南电信epg和贵州广电epg的判断逻辑封装在局方提供的api，这里统一返回true交由下一步处理
                isInstall = true;
            } else {
                // 其他地区由盒子提供的api检测
                isInstall = LMEPG.ApkPlugin.isAppInstall(appPackageName);
            }
            return isInstall;
        },

        /**
         * 检测是否需要升级安装插件apk
         * @param appInfoData 即将安装的插件apk的相关信息
         * @returns {boolean} true - 需要升级安装apk插件，false，不需要安装apk插件
         */
        checkIsAppNeedUpdate: function (appInfoData) {
            // 贵州广电需要局方新版商城上线后再对接升级的逻辑，暂时返回false完成插件apk的升级
            var ret = false;
            if (RenderParam.carrierId === '410092') {
                // 判断当前用户是否上报服务器插件apk信息，河南电信epg主要检测lws端配置的插件apk包名和用户当前使用插件的包名是否一致
                if (appInfoData.appVersionData.result === 0 && appInfoData.appVersionData.data) {
                    LMEPG.Log.debug("appPackageName：" + appInfoData.appPackageName + ",plugin_name：" + appInfoData.appVersionData.data.plugin_name);
                    ret = appInfoData.appPackageName !== appInfoData.appVersionData.data.plugin_name;
                }
            } else {
                // 通过盒子提供API获取盒子当前使用版本名称
                var installedAppVersionName = LMEPG.ApkPlugin.getAppVersion(appInfoData.appPackageName);
                if (installedAppVersionName) {
                    ret = installedAppVersionName < appInfoData.appVersionName;
                } else if (appInfoData.appVersionData.result === 0 && appInfoData.appVersionData.data) {
                    ret = appInfoData.appVersionData.data.version < appInfoData.appVersionName;
                }
            }
            return ret;
        },

        /**
         * 安装插件apk
         * @param appInfoData 插件apk的相关信息
         */
        installApp: function (appInfoData) {
            if (appInfoData.isInstallByAppMarket === 1) {
                // 判断盒子需要跳转应用商城安装插件
                if (RenderParam.carrierId === '10000051' && typeof RenderParam.lmp != 'undefined' && RenderParam.lmp === '266') {
                    window.location.href = "http://10.3.9.20:9080/stb/my_apps?ReturnUrl=" + encodeURIComponent(window.location.href) + "&UserID=" + RenderParam.accountId + "&run_package_name=com.longmaster.iptv.healthplugin.video.qisheng.chinaunicom";
                } else {
                    LMEPG.ApkPlugin.startAppByIntent(appInfoData.appMarketIntent); //启动商城并跳转到插件下载页
                }
            } else {
                // 通过服务器下载插件地址安装插件
                LMEPG.UI.showToast("开始启动下载，请稍等...", 5);
                LMEPG.ApkPlugin.installApp(appInfoData.downloadUrl);
                LMEPG.Log.debug("installApp downloadUrl: " + appInfoData.downloadUrl);
                // 判断如果需要检测插件是否安装然后启动插件
                if (APKManager.checkIsLaunchAppAfterInstall()) {
                    APKManager._installTimer = setInterval(function () {
                        if (APKManager.checkIsAppInstallComplete(appInfoData.appPackageName, appInfoData.appVersionName)) {
                            clearInterval(APKManager._installTimer);
                            LMEPG.UI.showToast("安装完成！即将进入问诊", 1.5, function () {
                                LMEPG.ApkPlugin.startAppByName(appInfoData.appPackageName);
                            });
                        } else {
                            LMEPG.UI.showToast("正在下载安装，请稍等...", 3);
                            if (APKManager._loopTimes < 60) {
                                APKManager._loopTimes++;
                            } else {
                                // 1分钟之内未安装完成就取消检测启动
                                clearInterval(APKManager._installTimer);
                            }
                        }
                    }, 3 * 1000);
                }
            }
        },

        /**
         * 检测是否需要在插件安装完成后启动插件
         * @returns {boolean} true - 需要 false - 不需要
         */
        checkIsLaunchAppAfterInstall: function () {
            var result = true;
            var JI_LINCarriers = ['220094', '220095', '10220094', '10220094'];
            if (JI_LINCarriers.indexOf(carrierId) > -1) {
                var stbModel = LMEPG.STBUtil.getSTBModel();
                var JI_LINSilentModel = ['EC6109_pub_jljlt', 'EC6109_pub_jljdx', 'EC6108V9_pub_jljlt', 'EC6108V9_pub_jljdx', 'EC6108V9A_pub_jljlt', 'EC6108V9A_pub_jljdx',
                    'EC6108V9E_pub_jljlt', 'EC6108V9E_pub_jljdx', 'EC6108V9U_pub_jljlt', 'EC6108V9U_pub_jljdx', 'EC6108V9I_pub_jljlt', 'EC6108V9I_pub_jljdx', 'JLJDX_Q21', 'Q21A_jljdx'];
                if (JI_LINSilentModel.indexOf(stbModel) < 0) {
                    // 吉林广电部分盒子无法根据包名启动插件apk
                    result = false;
                }
            }
            return result;
        },

        /**
         * 检测插件apk是否安装完成
         * @param appPackageName 插件apk的包名
         * @param appVersionName 需要安装的插件apk的版本
         * @returns {boolean} true - 安装完成 false - 未安装完成
         */
        checkIsAppInstallComplete: function (appPackageName, appVersionName) {
            var ret = false;
            var installAppVersion = LMEPG.ApkPlugin.getAppVersion(appPackageName);
            if (installAppVersion) {
                ret = APKManager.isInstalledAPK(appPackageName) && installAppVersion === appVersionName;
            } else {
                ret = APKManager.isInstalledAPK(appPackageName);
            }
            return ret;
        }
    };

    return {
        expert: ExpertObj,
        expertApi: ExpertApiObj,
        p2p: P2PObj,
        p2pApi: DoctorApiObj,
        dialog: InnerView
    }
})();