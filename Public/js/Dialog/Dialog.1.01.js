(function (w, d, epg) {
    /**
     * @param: beClickBtnId: 触发该弹框的ID
     * @param: isLoad: 标记是否需要重载当前界面 true/false
     * @param: focusId：焦点移动到当前弹框界面的按钮上
     * @param: onClick：传入的点击事件指针
     * @param: defaultPhoneNum：传入默认的电话号码
     * @param: keyPadX：小键盘左上x坐标位置 既left
     * @param: keyPadY：小键盘左上y坐标位置 既top
     */
    var _options = {
        beClickBtnId: '',
        focusId: 'modal-sure',
        isLoad: false,
        onClick: '',
        time: 10,
        numberAction: '',
        defaultPhoneNum: '',
        keyPadX: '',
        keyPadY: '',
    };
    var Modal = {
        _setPath: function (arg, htm) {
            for (var item in arg) {
                if (arg.hasOwnProperty(item)) {
                    _options[item] = arg[item];
                }
            }
            Modal.isModal = true; // 标记本弹框存在消失时释放
            var modalEl = d.createElement('div');
            modalEl.id = 'modal';
            modalEl.innerHTML = htm;
            var modal = d.getElementById('modal');
            if (modal) {
                modal.innerHTML = htm;
            } else {
                d.body.appendChild(modalEl);
            }
            epg.BM._isKeyEventInterceptCallback = function (keyCode) {
                if (keyCode == KEY_BACK && Modal.isModal) {
                    Modal.hide();
                    return true;
                } else {
                    return false;
                }
            };
        },

        _initPath: function (arg, htm) {
            this._setPath(arg, htm);
            epg.BM.addButtons({
                id: 'modal-sure',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'modal-cancel',
                nextFocusUp: 'tel-number',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure_f.png',
                click: _options.onClick
            });
            epg.BM.addButtons({
                id: 'modal-cancel',
                name: '',
                type: 'img',
                nextFocusLeft: 'modal-sure',
                nextFocusRight: '',
                nextFocusUp: 'tel-number',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_cancel.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_cancel_f.png',
                click: arg.onCancel == undefined ? this.hide : arg.onCancel
            });
            epg.BM.requestFocus(_options.focusId);
        },

        _initPath_000051: function (arg, htm) {
            this._setPath(arg, htm);
            epg.BM.addButtons({
                id: 'modal-sure',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'modal-cancel',
                nextFocusUp: 'tel-number',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V25/btn_sure.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V25/btn_sure_f.png',
                click: _options.onClick
            });
            epg.BM.addButtons({
                id: 'modal-cancel',
                name: '',
                type: 'img',
                nextFocusLeft: 'modal-sure',
                nextFocusRight: '',
                nextFocusUp: 'tel-number',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V25/btn_cancel.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V25/btn_cancel_f.png',
                click: arg.onCancel == undefined ? this.hide : arg.onCancel
            });
            epg.BM.requestFocus(_options.focusId);
        },
        _initPath_11000051: function (arg, htm) {
            this._setPath(arg, htm);
            epg.BM.addButtons({
                id: 'modal-sure',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'modal-cancel',
                nextFocusUp: 'tel-number',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V28/btn_sure.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V28/btn_sure_f.png',
                click: _options.onClick
            });
            epg.BM.addButtons({
                id: 'modal-cancel',
                name: '',
                type: 'img',
                nextFocusLeft: 'modal-sure',
                nextFocusRight: '',
                nextFocusUp: 'tel-number',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V28/btn_cancel.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V28/btn_cancel_f.png',
                click: arg.onCancel == undefined ? this.hide : arg.onCancel
            });
            epg.BM.requestFocus(_options.focusId);
        },
        /*调用小键盘对于focusChange的方法的*/
        _keyPad: function (btn, bol) {
            if (bol) {
                if (_options.keyPadX && _options.keyPadY) {
                    LMEPG.UI.keyboard.show(_options.keyPadX, _options.keyPadY, 'telephone', 'modal-sure');
                } else if (_options.resolution == 'hd') {
                    LMEPG.UI.keyboard.show(512, 277, 'telephone', 'modal-sure');
                } else {
                    LMEPG.UI.keyboard.show(137, 385, 'telephone', 'modal-sure');
                }
                // JJKye.init({
                // 	isExist: true,
                // 	action: _options.numberAction,
                // 	input: 'telephone', //  输入框ID
                // 	backFocus: 'modal-sure', // 返回ID
                // 	resolution: _options.resolution || 'hd' // 盒子分辨率
                // });
            }
        },
        /*调用小键盘对于onClick方法的*/
        _keyPadForOnClickFun: function (btn) {
            switch (btn.id) {
                case "tel-number":
                    if (_options.resolution == 'hd') {
                        LMEPG.UI.keyboard.show(512, 277, "telephone", true, 'modal-sure');
                    } else {
                        LMEPG.UI.keyboard.show(137, 149, "telephone", true, 'modal-sure');
                    }
                    break;
                case "sms":
                    if (_options.resolution == 'hd') {
                        LMEPG.UI.keyboard.show(512, 277, "sms-value", false, 'modal-sure');
                    } else {
                        LMEPG.UI.keyboard.show(137, 149, "sms-value", false, 'modal-sure');
                    }
                    break;

                case"input-click-div":
                    if (RenderParam.platformType == 'hd') {
                        LMEPG.UI.keyboard.show(512, 277, "telephone", true, 'modal-sure');
                    } else {
                        LMEPG.UI.keyboard.show(137, 149, "telephone", true, 'modal-sure');
                    }
                    break;
            }
        },

        /*消失本弹框*/
        hide: function () {
            var key = w.LMKey || {};
            var isExist = key.isExist || false;
            var focusBtn = LMEPG.BM.getCurrentButton().id;
            if (G('gid_keyboard_container') && G('gid_keyboard_container').style.display !== 'none') { // 如果存在小键盘优先消失小键盘
                Hide('gid_keyboard_container');
                LMEPG.BM.requestFocus("modal-sure");
                // LMKey.hideKeyPad();
                return;
            }
            //d.body.removeChild(G('modal'));
            delNode('modal')
            Modal.isModal = false;
            _options.isLoad ? location.reload(false) : null;
            epg.BM.requestFocus(_options.beClickBtnId);
            epg.BM.setKeyEventPause(false);
        },
        /*延迟消失*/
        delayDisappear: function () {
            var _this = this;
            if (_options.time) {
                epg.BM.setKeyEventPause(true);
                setTimeout(function () {
                    _this.hide();
                    epg.BM.setKeyEventPause(false);
                }, _options.time * 1000);
            }
        },

        /**
         * 填写电话号码弹框
         * @param arg
         * @param txt1: 提示语第1行
         * @param txt2: 提示语第2行
         */
        setPhoneNumber: function (arg, txt1, txt2) {
            var htm = '<div class=dialog_wrapper>';
            htm += '<img class="modal_center_img" src='+g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/modal.png>';
            htm += '<div class="msg_text">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<div id="tel-number" class="tel-number" style="background-image:url("' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/phone_input.png")>' +
                '<span class="tel-name">手机号：</span>' +
                '<span id="telephone">请输入有效的电话</span></div>' +
                '</div>' +
                '<div class="btn_wrap">' +
                '<img id="modal-sure" src='+g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure.png>' +
                '<img id="modal-cancel" src='+g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_cancel.png>' +
                '</div>';

            epg.BM.addButtons({
                id: 'tel-number',
                name: '电话框焦点',
                type: 'div',
                resolution: 'hd',
                focusChange: this._keyPad
            });
            this._initPath(arg, htm);
        },

        /**
         *短信验证弹框
         * @param arg
         * @param txt1: 提示语第1行
         * @param txt2: 提示语第2行
         * @param getVerCodeFun: 获取验证码方法
         */
        SMSverification: function (arg, getVerCodeFun, txt1, txt2) {
            var htm = '<div class=dialog_wrapper>';
            htm += '<img class="modal_center_img" src='+g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/modal.png>';
            htm += '<div class="msg_text">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<div id="tel-number" class="tel-number bg-position" style="background-image:url("' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/phone_input.png)">' +
                '<span class="tel-name">手机号：</span>' +
                '<span id="telephone">请输入有效的电话</span></div>' +
                '<div id="sms" class="sms" style="background-image:url("' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/ver_code_input.png)>"' +
                '<label class="sms-label float-left">验证码：</label>' +
                '<p id="sms-value" class="float-left sms-value">请输入验证码</p><div id="get-ver-Code" class="get-ver-Code" style="background-image:url("' + g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/get_sms_code.png)">获取验证码</div></div>' +
                '</div>' +
                '<div class="btn_wrap">' +
                '<img id="modal-sure" src='+g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure.png>' +
                '<img id="modal-cancel" src='+g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_cancel.png>' +
                '</div>';

            epg.BM.addButtons({
                id: 'tel-number',
                name: '电话框焦点',
                type: 'div',
                resolution: 'hd',
                backgroundImage: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/phone_input.png',
                focusImage:g_appRootPath+ '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/phone_input_f.png',
                click: this._keyPadForOnClickFun,
                nextFocusDown: 'sms',
            });
            epg.BM.addButtons({
                id: 'sms',
                name: '短信框焦点',
                type: 'div',
                resolution: 'hd',
                backgroundImage: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/ver_code_input.png',
                focusImage: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/ver_code_input_f.png',
                click: this._keyPadForOnClickFun,
                nextFocusDown: 'modal-sure',
                nextFocusUp: 'tel-number',
                nextFocusRight: 'get-ver-Code',
            });

            epg.BM.addButtons({
                id: 'get-ver-Code',
                name: '获取验证码焦点',
                type: 'div',
                resolution: 'hd',
                // focusChange: this._keyPad,
                backgroundImage: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/get_sms_code.png',
                focusImage: g_appRootPath+'/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Common/get_sms_code_f.png',
                click: getVerCodeFun,
                nextFocusDown: 'modal-sure',
                nextFocusUp: 'tel-number',
                nextFocusLeft: 'sms',
            });


            this._setPath(arg, htm);

            epg.BM.addButtons({
                id: 'modal-sure',
                name: '',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'modal-cancel',
                nextFocusUp: 'sms',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure_f.png',
                click: _options.onClick
            });
            epg.BM.addButtons({
                id: 'modal-cancel',
                name: '',
                type: 'img',
                nextFocusLeft: 'modal-sure',
                nextFocusRight: '',
                nextFocusUp: 'sms',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_cancel.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_cancel_f.png',
                click: arg.onCancel == undefined ? this.hide : arg.onCancel
            });
            epg.BM.requestFocus(_options.focusId);
            G('telephone').innerHTML = _options.defaultPhoneNum ? _options.defaultPhoneNum : '';
        },

        /**
         * 通用文本提示框
         * @param arg
         * @param txt1 :提示语第1行
         * @param txt2 :提示语第2行
         * @param txt3 :提示语第3行
         * @param txt4 :提示语第4行
         */
        textDialog: function (arg, txt1, txt2, txt3, txt4) {
            var htm = '<div class=dialog_wrapper>';
            htm += '<img class="modal_center_img" src='+g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/modal.png>';
            htm += '<div class="msg_text">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<br/>' + (txt3 || '') +
                '<br/>' + (txt4 || '') +
                '</div>';
            this._setPath(arg, htm);
            this.delayDisappear();
            epg.BM.setKeyEventPause(true);
        },

        /**
         * 通用文本提示框
         * @param arg
         * @param txt1 :提示语第1行
         * @param txt2 :提示语第2行
         * @param txt3 :提示语第3行
         * @param txt4 :提示语第4行
         */
        textDialogWithSure: function (arg, txt1, txt2, txt3, txt4) {
            var htm = '<div class=dialog_wrapper>';
            htm += '<img class="modal_center_img" src='+g_appRootPath+'/Public/img/hd/Home/V13/Home/Common/modal.png>';
            htm += '<div class="msg_text">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<br/>' + (txt3 || '') +
                '<br/>' + (txt4 || '') +
                '</div>';
            htm += '<img id="modal-sure" class="modal-sure-single" src='+g_appRootPath+'/Public/img/hd/Home/V13/Home/Common/btn_sure.png>';
            this._setPath(arg, htm);

            epg.BM.addButtons({
                id: 'modal-sure',
                name: '',
                type: 'img',
                nextFocusDown: '',
                backgroundImage:g_appRootPath+ '/Public/img/hd/Home/V13/Home/Common/btn_sure.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V13/Home/Common/btn_sure_f.png',
                click: Modal.hide,
            });

            epg.BM.requestFocus('modal-sure');
        },

        /**
         * 通用提示框(带确认、取消按钮)
         * @param arg
         * @param txt1 :提示语第1行
         * @param txt2 :提示语第2行
         * @param txt3 :提示语第3行
         * @param txt4 :提示语第4行
         */
        commonDialog: function (arg, txt1, txt2, txt3, txt4) {
            var htm = '<div class=dialog_wrapper>';
            htm += '<img class="modal_center_img" src='+g_appRootPath+'/Public/img/hd/Home/V13/Home/Common/modal.png>';
            htm += '<div class="msg_text">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<br/>' + (txt3 || '') +
                '<br/>' + (txt4 || '') +
                '</div>' +
                '<div class="btn_wrap">' +
                '<img id="modal-sure" src='+g_appRootPath+'/Public/img/hd/Home/V13/Home/Common/btn_sure.png>' +
                '<img id="modal-cancel" src='+g_appRootPath+'/Public/img/hd/Home/V13/Home/Common/btn_cancel.png>' +
                '</div>';
            this._initPath(arg, htm);
        },

        commonDialog_000051: function (arg, txt1, txt2, txt3, txt4) {
            var htm = '<div class=dialog_wrapper_food>';
            htm += '<img class="modal_center_img_food" src='+g_appRootPath+'/Public/img/hd/Home/V25/modal.png>';
            htm += '<div class="msg_text_food">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<br/>' + (txt3 || '') +
                '<br/>' + (txt4 || '') +
                '</div>' +
                '<div class="btn_wrap_food">' +
                '<img id="modal-sure" src='+g_appRootPath+'/Public/img/hd/Home/V25/btn_sure.png>' +
                '<img id="modal-cancel" src='+g_appRootPath+'/Public/img/hd/Home/V25/btn_cancel.png>' +
                '</div>';
            this._initPath_000051(arg, htm);
        },

        textDialogWithSure_000051: function (arg, txt1, txt2, txt3, txt4) {
            var htm = '<div class=dialog_wrapper_food>';
            htm += '<img class="modal_center_img_food" src='+g_appRootPath+'/Public/img/hd/Home/V25/modal.png>';
            htm += '<div class="msg_text_food">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<br/>' + (txt3 || '') +
                '<br/>' + (txt4 || '') +
                '</div>';
            htm += '<img id="modal-sure" class="modal-sure-single-food" src='+g_appRootPath+'/Public/img/hd/Home/V25/btn_sure.png>';
            this._setPath(arg, htm);

            epg.BM.addButtons({
                id: 'modal-sure',
                name: '',
                type: 'img',
                nextFocusDown: '',
                backgroundImage:g_appRootPath+ '/Public/img/hd/Home/V25/btn_sure.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V25/btn_sure_f.png',
                click: Modal.hide,
            });

            epg.BM.requestFocus('modal-sure');
        },

        commonDialog_11000051: function (arg, txt1, txt2, txt3, txt4) {
            var htm = '<div class=dialog_wrapper_11000051>';
            htm += '<img class="modal_center_img_11000051" src='+g_appRootPath+'/Public/img/hd/Home/V28/modal.png>';
            htm += '<div class="msg_text_11000051">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<br/>' + (txt3 || '') +
                '<br/>' + (txt4 || '') +
                '</div>' +
                '<div class="btn_wrap_11000051">' +
                '<img id="modal-sure" src='+g_appRootPath+'/Public/img/hd/Home/V28/btn_sure.png>' +
                '<img id="modal-cancel" src='+g_appRootPath+'/Public/img/hd/Home/V28/btn_cancel.png>' +
                '</div>';
            this._initPath_11000051(arg, htm);
        },

        textDialogWithSure_11000051: function (arg, txt1, txt2, txt3, txt4) {
            var htm = '<div class=dialog_wrapper_11000051>';
            htm += '<img class="modal_center_img_11000051" src='+g_appRootPath+'/Public/img/hd/Home/V28/modal.png>';
            htm += '<div class="msg_text_11000051">' +
                (txt1 || '') +
                '<br/>' + (txt2 || '') +
                '<br/>' + (txt3 || '') +
                '<br/>' + (txt4 || '') +
                '</div>';
            htm += '<img id="modal-sure" class="modal-sure-single-11000051" src='+g_appRootPath+'/Public/img/hd/Home/V28/btn_sure.png>';
            this._setPath(arg, htm);

            epg.BM.addButtons({
                id: 'modal-sure',
                name: '',
                type: 'img',
                nextFocusDown: '',
                backgroundImage:g_appRootPath+ '/Public/img/hd/Home/V28/btn_sure.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V28/btn_sure_f.png',
                click: Modal.hide,
            });

            epg.BM.requestFocus('modal-sure');
        },


        /*微信问诊弹框*/
        weRender: function () {
            var htm = '';
            var me = arguments.length > 1 ? arguments[1].me : this;
            //var weCount = me.weData.weCount = +!me.weData.weCount;
            var weCount = 1;

            htm = '<img class="wechat-bg" src='+g_appRootPath+'/Public/img/hd/Common/V13/wechat_bg.png>';
            htm += '<p class="wechat-title">温馨提示</p>';
            htm += '<p class="wechat-info1">根据您的设备情况，请选择手机微信扫码问诊。</p>';
            htm += '<img class="pic-item" id="qrcode" src=\'' + me.innerImg[weCount] + '\'>';
            //htm += '<p class="wechat-info2">' + me.innerText[weCount] + '</p>';
            //htm += '<img class="left-item" src=__ROOT__/Public/img/hd/Common/V13/left.png>';
            //htm += '<img class="right-item" src=__ROOT__/Public/img/hd/Common/V13/right.png>';

            me._setPath(me.weData, htm);
        },
        weChatDialog: function (arg, callback) {
            this.weData = arg;
            this.innerImg = [g_appRootPath+'/Public/img/hd/Common/V13/pic_camera.png', arg.qr_img];
            this.innerText = [
                '1.请您确认摄像头设备已插好<br/>' + '2.若无摄像头可使用电话回拨问诊<br/>3.按遥控器确认键进行电视问诊',
                '请使用微信扫码进行问诊<br/>过程中请保持手机网络通畅'
            ];
            this.weRender();
            epg.BM.addButtons({
                id: 'modal',
                name: '',
                type: 'others',
                click: callback,
                beClickBtn: arg.beClickBtn,
                //beforeMoveChange: this.weRender,
                me: this
            });

            epg.BM.requestFocus('modal');
        },

        /**
         * 问诊选择对话框
         * @param arg
         */
        inquiryChooseDialog: function (arg, mode) {
            if (typeof mode === 'undefined') {
                mode = "V13";
            }

            this.weData = arg;
            var htm;
            var me = this;

            var docInfo = arg.docInfo;
            var docImInfo = arg.docImInfo;

            var isShowWeChatInquiry = true;

            var currerCarrierId = get_carrier_id();
            if (currerCarrierId == '371092' ) {
                isShowWeChatInquiry = false;
            }

            htm = '<img class="wechat-video-bg" id="wechat-video-bg" src='+g_appRootPath+'/Public/img/hd/Common/' + mode + '/ask_doc_dialog_bg_1.png>';
            htm += '<p class="inquiry-choose-text" id="inquiry-choose-text">请选择一键问医的问诊方式</p>';
            htm += '<img id="dialog_ask_doc_tv_video" src='+g_appRootPath+'/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_video.png>';
            htm += '<img id="dialog_ask_doc_tv_phone" src='+g_appRootPath+'/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_phone.png>';
            htm += '<img id="dialog_ask_doc_wechat_teletext" src='+g_appRootPath+'/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext.png>';
            htm += '<img id="dialog_ask_doc_wechat_video" src='+g_appRootPath+'/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_video.png>';
            me._setPath(me.weData, htm);

            epg.BM.addButtons({
                id: 'dialog_ask_doc_tv_video',
                name: '',
                type: 'img',
                nextFocusRight: 'dialog_ask_doc_tv_phone',
                nextFocusDown: 'dialog_ask_doc_wechat_teletext',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/DoctorP2P/" + mode + "/ask_doc_tv_video.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/DoctorP2P/"+ mode + "/ask_doc_tv_video_f.png",
                docInfo: docInfo,
                click: arg.chooseInquiryWay,
            });
            epg.BM.addButtons({
                id: 'dialog_ask_doc_tv_phone',
                name: '',
                type: 'img',
                nextFocusLeft: 'dialog_ask_doc_tv_video',
                nextFocusDown: 'dialog_ask_doc_wechat_video',
                backgroundImage:  g_appRootPath+ "/Public/img/hd/DoctorP2P/" + mode + "/ask_doc_tv_phone.png",
                focusImage:  g_appRootPath+ "/Public/img/hd/DoctorP2P/" + mode + "/ask_doc_tv_phone_f.png",
                docInfo: docInfo,
                click: arg.chooseInquiryWay,
            });
            epg.BM.addButtons({
                id: 'dialog_ask_doc_wechat_teletext',
                name: '',
                type: 'img',
                nextFocusUp: 'dialog_ask_doc_tv_video',
                nextFocusRight: 'dialog_ask_doc_wechat_video',
                backgroundImage: g_appRootPath+'/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext.png',
                focusImage: g_appRootPath+'/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext_f.png',
                docInfo: docImInfo,
                click: arg.chooseInquiryWay,
            });
            epg.BM.addButtons({
                id: 'dialog_ask_doc_wechat_video',
                name: '',
                type: 'img',
                nextFocusUp: 'dialog_ask_doc_tv_phone',
                nextFocusLeft: 'dialog_ask_doc_wechat_teletext',
                backgroundImage: g_appRootPath+'/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_video.png',
                focusImage: g_appRootPath+'/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_video_f.png',
                docInfo: docInfo,
                click: arg.chooseInquiryWay,
            });

            // 设置问诊按钮置灰
            var isSupportTvVideo = true;
            var isSupportTvPhone = true;
            var isSupportWechatTeletext = true;
            var isSupportWechatVideo = true;
            if (docImInfo.is_im_inquiry != 1) { // 未开通图文问诊
                isSupportWechatTeletext = false;
                epg.BM.getButtonById('dialog_ask_doc_wechat_teletext').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext_offline.png';
                G('dialog_ask_doc_wechat_teletext').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext_offline.png';
            }
            if(currerCarrierId == '10220094'){
                isSupportWechatTeletext = false;
                G('dialog_ask_doc_wechat_teletext').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext_offline.png';
                epg.BM.getButtonById('dialog_ask_doc_wechat_teletext').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext_offline.png';
            }
            if (RenderParam.carrierId == '370092') {
                var isSupportWechatTeletext = false;
                var isSupportWechatVideo = false;
                epg.BM.getButtonById('dialog_ask_doc_wechat_teletext').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext_offline.png';
                epg.BM.getButtonById('dialog_ask_doc_wechat_video').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_video_offline.png';
                G('dialog_ask_doc_wechat_teletext').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_teletext_offline.png';
                G('dialog_ask_doc_wechat_video').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_video_offline.png';
            }

            if (docInfo == '' || docInfo.is_video_inquiry != 1 || (docInfo.online_state == 0 || docInfo.online_state == 1)) { // 一键问医未获取到医生、未开通视频问诊、离线
                isSupportTvVideo = false;
                isSupportTvPhone = false;
                isSupportWechatVideo = false;
                epg.BM.getButtonById('dialog_ask_doc_tv_video').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_video_offline.png';
                epg.BM.getButtonById('dialog_ask_doc_tv_phone').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_phone_offline.png';
                epg.BM.getButtonById('dialog_ask_doc_wechat_video').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_video_offline.png';
                G('dialog_ask_doc_tv_video').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_video_offline.png';
                G('dialog_ask_doc_tv_phone').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_phone_offline.png';
                G('dialog_ask_doc_wechat_video').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_wechat_video_offline.png';
            }
            if (RenderParam.carrierId == '440004' || RenderParam.carrierId == '640092' || RenderParam.carrierId == '320092' || RenderParam.carrierId == '410092' || RenderParam.carrierId == '420092' || RenderParam.carrierId == '500092' || RenderParam.carrierId === '520092' ) { // 不支持插件

                isSupportTvVideo = false;
                epg.BM.getButtonById('dialog_ask_doc_tv_video').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_video_offline.png';
                G('dialog_ask_doc_tv_video').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_video_offline.png';
            }
            if (RenderParam.platformType === 'sd' || RenderParam.areaCode === '216') { // 不支持插件
                isSupportTvVideo = false;
                epg.BM.getButtonById('dialog_ask_doc_tv_video').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_video_offline.png';
                G('dialog_ask_doc_tv_video').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_video_offline.png';
            }
            if (RenderParam.carrierId == '520094' || RenderParam.carrierId == '520092') { // 不支持电话问诊（贵州广电没有端口、贵州电信不支持）
                isSupportTvPhone = false;
                epg.BM.getButtonById('dialog_ask_doc_tv_phone').backgroundImage = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_phone_offline.png';
                G('dialog_ask_doc_tv_phone').src = g_appRootPath + '/Public/img/hd/DoctorP2P/' + mode + '/ask_doc_tv_phone_offline.png';
            }

            if (!isShowWeChatInquiry) {
                isSupportWechatTeletext = false;
                isSupportWechatVideo = false;
                G('dialog_ask_doc_tv_video').style.top = '380px';
                G('dialog_ask_doc_tv_phone').style.top = '380px';
                Hide('dialog_ask_doc_wechat_teletext');
                Hide('dialog_ask_doc_wechat_video');
            }


            if (isSupportTvVideo) epg.BM.requestFocus('dialog_ask_doc_tv_video');
            else if (isSupportTvPhone) epg.BM.requestFocus('dialog_ask_doc_tv_phone');
            else if (isSupportWechatTeletext) epg.BM.requestFocus('dialog_ask_doc_wechat_teletext');
            else if (isSupportWechatVideo) epg.BM.requestFocus('dialog_ask_doc_wechat_video');

            if (!isSupportTvPhone) epg.BM.getButtonById('dialog_ask_doc_tv_video').nextFocusRight = '';
            if (!isSupportWechatTeletext) epg.BM.getButtonById('dialog_ask_doc_tv_video').nextFocusDown = '';

            if (!isSupportTvVideo) epg.BM.getButtonById('dialog_ask_doc_tv_phone').nextFocusLeft = '';
            if (!isSupportWechatVideo) epg.BM.getButtonById('dialog_ask_doc_tv_phone').nextFocusDown = '';

            if (!isSupportTvVideo) epg.BM.getButtonById('dialog_ask_doc_wechat_teletext').nextFocusUp = '';
            if (!isSupportWechatVideo) epg.BM.getButtonById('dialog_ask_doc_wechat_teletext').nextFocusRight = '';

            if (!isSupportTvPhone) epg.BM.getButtonById('dialog_ask_doc_wechat_video').nextFocusUp = '';
            if (!isSupportWechatTeletext) epg.BM.getButtonById('dialog_ask_doc_wechat_video').nextFocusLeft = '';


        },

        /**
         * 问诊选择对话框
         * @param arg
         */
        inquiryChooseDialogV1: function (arg) {
            this.inquiryChooseDialog(arg, "V10");
            G('wechat-video-bg').style.marginTop = '11px';
            G('wechat-video-bg').style.width = '1057px';
            G('wechat-video-bg').style.height = '704px';
            G('dialog_ask_doc_tv_video').style.left = '412px';
            G('dialog_ask_doc_wechat_teletext').style.left = '412px';
        },
        /**
         * 问诊选择对话框-中国联通V16 yellow主题
         * @param arg
         */
        inquiryChooseDialogV2: function (arg) {
            this.inquiryChooseDialog(arg, "V16");
            G('inquiry-choose-text').style.color = "#000";
        },
        /**
         * 问诊选择对话框-中国联通魔方-启生
         * @param arg
         */
        inquiryChooseDialogV3: function (arg) {
            this.inquiryChooseDialog(arg, "V20");
            G('inquiry-choose-text').style.color = "#fff";
        },

        /**
         * 微信问诊弹窗(视频、图文)
         * @param arg
         */
        weChatInquiryDialog: function (arg,hint) {
            this.weData = arg;
            var htm;
            var me = this;
            var type = arg.type == 1 ? '图文' : '视频';

            htm = '<img class="wechat-video-bg" src='+g_appRootPath+'/Public/img/hd/Common/V13/ask_doc_dialog_bg.png>';
            htm += '<p class="wechat-info3" style="color: #c38554; font-weight: bold">请使用微信扫码<br/>进行<span style="color: #f95f53">' + type + '</span>问诊</p>';
            htm += '<img class="pic-item1" id="qrcode" src=\'' + arg.qr_img + '\'>';
            htm += '<img id="modal-sure" class="modal-sure" src='+g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure.png>';
            if(!!hint == true)
                htm += hint;
            me._setPath(me.weData, htm);

            epg.BM.addButtons({
                id: 'modal-sure',
                name: '',
                type: 'img',
                nextFocusDown: '',
                backgroundImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure.png',
                focusImage: g_appRootPath+'/Public/img/hd/Home/V16/Home/Common/btn_sure_f.png',
                click: Modal.hide,
            });

            epg.BM.requestFocus('modal-sure');
        },
    };

    function object(o) {
        function F() {
        }

        F.prototype = o;
        return new F();
    }

    w.modal = object(Modal);
}(window, document, LMEPG));

