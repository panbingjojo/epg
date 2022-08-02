(function (e, k, r) {
    var LMInspireOrder = {
        isMonitorKeyEvent: true,
        buttons: [], // 当前页面焦点
        init: function () {
            LMInspireOrder.inspireConfigList = r.payMethod.data.list;
            LMInspireOrder.initButtons();
            if (!LMInspireOrder.showOrderResult() && LMInspireOrder.isShowInspireOrder()) {
                // 启动页面检测定时器
                LMInspireOrder.monitorKeyEvent();
                e.BM.setKeyEventInterceptCallback(LMInspireOrder.onKeyEventIntercept);
            }
        },

        initIFrame: function () {
            if (LMInspireOrder.inspireConfig && LMInspireOrder.inspireConfig.pop_type == '0') {
                // 浮窗页面弹出,创建iFrame标签
                var iFrameParams = LMInspireOrder.makeIFrameParams();
                LMEPG.PayFrame.goLMPay(iFrameParams.payUrl, r.platformType, true, iFrameParams.reloadIntent);
            }
        },

        /**
         *  由具体的页面设置
         */
        makeIFrameParams: function () {

        },

        showModal: function (modal) {
            if (LMInspireOrder.shownModal) {
                // 判断当前是否有显示的模板，如果有就先关闭
                LMInspireOrder.hideModal(LMInspireOrder.shownModal);
            }
            if (modal.onShowListener) {
                // 模板页面在显示后需要完成的操作
                modal.onShowListener();
            }
            if (modal.focusId) {
                // 将焦点移动到模板页面需要获取的焦点的元素
                e.BM.requestFocus(modal.focusId);
            } else {
                // 如果当前模板页面无焦点，则屏蔽活动当前的焦点事件
                e.BM.setKeyEventPause(true);
            }
            // 设置活动正在显示的模板
            LMInspireOrder.shownModal = modal;
            // 显示当前模板页面
            G(modal.id).style.display = 'block';
        },

        hideModal: function (modal) {
            if (modal !== null) {
                if (modal.onDismissListener) {
                    // 执行模板页面隐藏后操作
                    modal.onDismissListener();
                }
                // 隐藏需要隐藏的模板
                G(modal.id).style.display = 'none';
                // 恢复活动中的所有焦点事件
                e.BM.setKeyEventPause(false);
                if (LMInspireOrder.requestFocusId) {
                    // 恢复活动焦点到启动模板的焦点
                    e.BM.requestFocus(LMInspireOrder.requestFocusId);
                }
                // 设置活动正在显示的模板为null
                LMInspireOrder.shownModal = null;
            }
        },

        initButtons: function () {
            LMInspireOrder.buttons.push({
                id: 'do-inspire',
                name: '点击领取',
                type: 'img',
                backgroundImage: r.inspireOrderPath + 'btn_do_inspire.gif',
                focusImage: r.inspireOrderPath + 'btn_do_inspire.gif',
                click: LMInspireOrder.eventHandler
            }, {
                id: 'input-phone',
                name: '输入电话',
                type: 'div',
                nextFocusDown: 'inspire-sure',
                backFocusId: 'inspire-sure',
                focusChange: LMInspireOrder.onInputFocus
            }, {
                id: 'inspire-sure',
                name: '确定中奖电话',
                type: 'img',
                nextFocusUp: 'input-phone',
                nextFocusRight: 'inspire-cancel',
                backgroundImage: r.inspireOrderPath + 'inspire_sure.png',
                focusImage: r.inspireOrderPath + 'inspire_sure_f.gif',
                click: LMInspireOrder.eventHandler
            }, {
                id: 'inspire-cancel',
                name: '取消中奖电话',
                type: 'img',
                nextFocusUp: 'input-phone',
                nextFocusLeft: 'inspire-sure',
                backgroundImage: r.inspireOrderPath + 'inspire_cancel.png',
                focusImage: r.inspireOrderPath + 'inspire_cancel_f.gif',
                click: LMInspireOrder.eventHandler
            });
        },

        /**
         * 根据活动作区分
         * @returns {boolean}
         */
        showOrderResult: function () {
            var orderResult = false;
            if (LMInspireOrder.inspireConfigList.length !== 0) {
                var tempAliasName = LMInspireOrder.inspireConfigList[0].template_info.alias_name;
                switch (tempAliasName) {
                    case "InspireOrderTemplate20191023":
                        orderResult = LMInspireOrder.checkOrderResult();
                        break;
                    case "InspireOrderTemplate20191119":
                    case "InspireOrderTemplate20191202":
                        break;
                    default:
                        break;
                }
            }
            return orderResult;
        },

        checkOrderResult: function () {
            if (r.isOrderBack === '1' &&
                r.orderType === '2' &&
                r.cOrderResult === '1') { // 从订购页面跳转回活动页面
                // 调用抽奖的接口
                LMInspireOrder.lottery(function (data) {
                    LMInspireOrder.lotteryPrizeId = data.prize_idx;
                    G('inspire-prize').src = r.inspireOrderPath + 'inspire_prize_' + data.prize_idx + '.png';
                    var inspireSuccessModal = {
                        id: 'inspire-order-success',
                        focusId: 'inspire-sure',
                        onDismissListener: LMInspireOrder.hideInspireSuccess
                    };
                    LMInspireOrder.showModal(inspireSuccessModal);
                }, function () {
                    var inspireFailModal = {
                        id: 'inspire-order-fail',
                        onShowListener: LMInspireOrder.showInspireFailModal,
                        onDismissListener: LMInspireOrder.hideInspireFailModel,
                    };
                    LMInspireOrder.showModal(inspireFailModal);
                });
                return true;
            }
            return false;
        },

        isShowInspireOrder: function () {
            var showInspireOrder = false;
            // 检测当前是否设置促订且当前用户是普通用户
            if ((r.accountId.indexOf("cutv") < 0) && LMInspireOrder.inspireConfigList.length !== 0 && r.isVip === 0) {
                LMInspireOrder.inspireConfig = LMInspireOrder.inspireConfigList[0];
                switch (LMInspireOrder.inspireConfig.type) {
                    case "1":
                        // 检测当前促订显示次数与设置最大显示次数是否相等
                        showInspireOrder = r.inspireTimes < parseInt(LMInspireOrder.inspireConfig.pop_times);
                        break;
                    case "2":
                        showInspireOrder = r.valueCountdown.showDialog === "1";
                        e.BM.removeKeyEventInterceptCallback();
                        break;
                }

            }
            return showInspireOrder;
        },

        onKeyEventIntercept: function () {
            LMInspireOrder.stopIdleTimer();
            LMInspireOrder.monitorKeyEvent();
            return false;
        },

        monitorKeyEvent: function () {
            // 启动页面检测定时器
            LMInspireOrder.idleTime = parseInt(LMInspireOrder.inspireConfig.idle_time);
            LMInspireOrder.startIdleTimer();
        },

        startIdleTimer: function () {
            LMInspireOrder.idleTime -= 1;
            LMInspireOrder.idelTimer = setInterval(function () {
                if (LMInspireOrder.idleTime <= 0) {
                    LMInspireOrder.stopIdleTimer();
                    // 显示促订模板
                    LMInspireOrder.showInspireTemplate();
                } else {
                    LMInspireOrder.idleTime -= 1;
                }
            }, 1000);
        },

        stopIdleTimer: function () {
            if (LMInspireOrder.idelTimer !== null) {
                clearInterval(LMInspireOrder.idelTimer);
            }
        },

        showInspireTemplate: function (isExit) {
            switch (LMInspireOrder.inspireConfig.type) {
                case "1":
                    // 调用接口增加显示模板的参数
                    e.BM.removeKeyEventInterceptCallback();
                    LMInspireOrder.addInspireOrderTimes(function () {
                        // 显示促订模板
                        var inspireModal = {
                            id: 'inspire-order-home',
                            onShowListener: LMInspireOrder.showInspireModal,
                            onDismissListener: LMInspireOrder.hideInspireModal,
                            focusId: 'do-inspire',
                            isExit: isExit,
                            routerOrder: 0
                        };
                        LMInspireOrder.showModal(inspireModal);
                    }, function () {
                        // 提示保存促订次数扣除失败
                    });
                    break;
                case "2":
                    // 显示加时模板
                    var extraTimeModal = {
                        id: 'countdown',
                        onShowListener: LMInspireOrder.showExtraTimeModal,
                        onDismissListener: LMInspireOrder.hideExtraTimeModel,
                        isExit: isExit
                    };
                    LMInspireOrder.showModal(extraTimeModal);
                    break;
            }
        },

        showInspireModal: function () {

            // 尝试关闭小窗播放 -- 兼容中国联通河南地区
            if (e.mp) {
                e.mp.destroy();
            }

            // 设置促订背景图片
            LMInspireOrder.setInspireHoldBG();

            LMInspireOrder.insprieTime = parseInt(LMInspireOrder.inspireConfig.jump_wait) - 1;
            LMInspireOrder.inspireInterval = setInterval(function () {
                if (LMInspireOrder.insprieTime <= 0) {
                    // 跳转局方订购页
                    if (LMInspireOrder.inspireInterval !== null) {
                        clearInterval(LMInspireOrder.inspireInterval);
                    }
                    LMInspireOrder.shownModal.routerOrder = 1;
                    if (LMInspireOrder.inspireConfig.pop_type == '0') {
                        LMInspireOrder.hideModal(LMInspireOrder.shownModal);
                    }
                    LMInspireOrder.orderVIP();
                } else {
                    LMInspireOrder.insprieTime -= 1;
                }
            }, 1000);

            // 设置页面跳转逻辑
            switch (LMInspireOrder.inspireConfig.btn_jump) {
                case '0':
                    // 按任意键跳转
                    e.BM.setKeyEventInterceptCallback(function () {
                        LMInspireOrder.doOrderByAliasName();
                        return true;
                    });
                    break;
                case '1':
                    // 正常逻辑跳转
                    break;
            }
        },

        setInspireHoldBG: function(){
            var inspireHome = r.platformType + '-inspire';
            switch (LMInspireOrder.inspireConfig.template_info.alias_name) {
                case "InspireOrderTemplate20191023":
                    G(inspireHome).src = g_appRootPath + '/Public/img/'+ r.platformType +'/pay/Common/bg_inspire_home.png';
                    break;
                case "InspireOrderTemplate20191119":
                    LMInspireOrder.setInspireHoldBGByArea(inspireHome,"v2");
                    break;
                case "InspireOrderTemplate20191202":
                    LMInspireOrder.setInspireHoldBGByArea(inspireHome,"v3");
                    break;
                default:
                    break;
            }
        },

        // 根据不同的地区设置挽留页背景
        setInspireHoldBGByArea: function (inspireHome,versionCode) {
            var bgPath = g_appRootPath + '/Public/img/sd/pay/Common/';
            var bgImage = "";
            switch (r.areaCode) {
                case '201':
                    bgImage = 'bg_inspire_home_' + versionCode + '_for_TJ.png';
                    break;
                case '204':
                    bgImage = 'bg_inspire_home_' + versionCode + '_for_HN.png';
                    break;
                case '207':
                    bgImage = 'bg_inspire_home_' + versionCode + '_for_SX.png';
                    break;
                case '208':
                    bgImage = 'bg_inspire_home_' + versionCode + '_for_NM.png';
                    break;
                case '216':
                    bgImage = 'bg_inspire_home_' + versionCode + '_for_SD.png';
                    break;
            }
            G(inspireHome).src = bgPath + bgImage;
        },

        hideInspireModal: function () {
            if (LMInspireOrder.inspireInterval !== null) {
                clearInterval(LMInspireOrder.inspireInterval);
            }
            if (LMInspireOrder.shownModal.isExit) {
                // 如果是返回按键和遥控器返回，直接退出应用
                e.Intent.back();
            } else if (LMInspireOrder.shownModal.routerOrder === 1) {
                // 移除事件
                e.BM.removeKeyEventInterceptCallback();
            } else if (LMInspireOrder.isShowInspireOrder()) {
                // 订购退出，重新启动检测页面无操作事件
                e.BM.setKeyEventInterceptCallback(LMInspireOrder.onKeyEventIntercept);
                LMInspireOrder.monitorKeyEvent();
            }
        },

        hideInspireSuccess: function () {
            //e.BM.requestFocus(LMInspireOrder.requestFocusId);
            if (LMInspireOrder.isShowInspireOrder()) {
                // 重新启动检测页面无操作事件
                e.BM.setKeyEventInterceptCallback(LMInspireOrder.onKeyEventIntercept);
                LMInspireOrder.monitorKeyEvent();
            }
        },

        showExtraTimeModal: function () {
            G('count').innerHTML = LMInspireOrder.inspireConfig.jiashi_wait;
            LMInspireOrder.extraTime = parseInt(LMInspireOrder.inspireConfig.jiashi_wait) - 1;
            LMInspireOrder.extarTimeInterval = setInterval(function () {
                if (LMInspireOrder.extraTime <= 0) {
                    if (LMInspireOrder.extarTimeInterval !== null) {
                        clearInterval(LMInspireOrder.extarTimeInterval);
                    }
                    LMInspireOrder.doExtraTimeOver();
                } else {
                    G('count').innerHTML = String(LMInspireOrder.extraTime);
                    LMInspireOrder.extraTime -= 1;
                }
            }, 1000);
        },

        hideExtraTimeModel: function () {
            if (LMInspireOrder.extarTimeInterval !== null) {
                clearInterval(LMInspireOrder.extarTimeInterval);
            }
            if (LMInspireOrder.shownModal.isExit) {
                e.Intent.back();
            }
        },

        showInspireFailModal: function () {
            LMInspireOrder.failTimer = setTimeout(function () {
                //关闭弹窗
                LMInspireOrder.hideModal(LMInspireOrder.shownModal);
            }, 3 * 1000);
        },

        hideInspireFailModel: function () {
            if (LMInspireOrder.failTimer) {
                clearTimeout(LMInspireOrder.failTimer)
            }
        },

        orderVIP: function () {

        },

        doExtraTimeOver: function () {

        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case "do-inspire":
                    // 跳转订购页面
                    LMInspireOrder.doOrderByAliasName();
                    break;
                case "inspire-sure":
                    // 提交促订中奖电话
                    LMInspireOrder.setLotteryPhone(function () {
                        LMInspireOrder.hideModal(LMInspireOrder.shownModal);
                    }, function () {
                        LMInspireOrder.hideModal(LMInspireOrder.shownModal);
                    });
                    break;
                case "inspire-cancel":
                    // 关闭当前页面
                    LMInspireOrder.hideModal(LMInspireOrder.shownModal);
                    break;
            }
        },

        doOrderByAliasName: function(){
            var tempAliasName = LMInspireOrder.inspireConfigList[0].template_info.alias_name;
            switch (tempAliasName) {
                case "InspireOrderTemplate20191023":
                    LMInspireOrder.doOrder();
                    break;
                case "InspireOrderTemplate20191119":
                    if (LMInspireOrder.insprieTime > 0){
                        e.UI.showWaitingDialogV2('', LMInspireOrder.insprieTime, r.platformType, function () {
                            e.UI.dismissWaitingDialog();
                            LMInspireOrder.doOrder();
                        });
                    }else {
                        LMInspireOrder.doOrder();
                    }
                    break;
                default:
                    break;
            }
        },

        doOrder: function () {
            if (LMInspireOrder.inspireInterval !== null) {
                clearInterval(LMInspireOrder.inspireInterval);
            }
            LMInspireOrder.orderVIP();
            if (LMInspireOrder.inspireConfig.pop_type == '0') {
                LMInspireOrder.hideModal(LMInspireOrder.shownModal);
            }
        },

        doOrderByAliasName: function () {
            var tempAliasName = LMInspireOrder.inspireConfigList[0].template_info.alias_name;
            switch (tempAliasName) {
                case "InspireOrderTemplate20191023":
                    LMInspireOrder.doOrder();
                    break;
                case "InspireOrderTemplate20191119":
                    if (LMInspireOrder.insprieTime > 0) {
                        var dialogConfig = {
                            msg: '',
                            delay: LMInspireOrder.insprieTime,
                            callback: function () {
                                LMInspireOrder.doOrder();
                            },
                            loadingImg: e.App.getAppRootPath() + "/Public/img/" + r.platformType + "/Common/bg_waiting_dialog.gif",
                            dialogCss: 'g_waiting_dialog_v2'
                        };
                        e.UI.buildAndShowWaitingDialogBy(dialogConfig);
                    } else {
                        LMInspireOrder.doOrder();
                    }
                    break;
                default:
                    break;
            }
        },

        doOrder: function () {
            if (LMInspireOrder.inspireInterval !== null) {
                clearInterval(LMInspireOrder.inspireInterval);
            }
            LMInspireOrder.orderVIP();
            if (LMInspireOrder.inspireConfig.pop_type == '0') {
                LMInspireOrder.hideModal(LMInspireOrder.shownModal);
            }
        },

        onInputFocus: function (btn, hasFocus) {
            if (hasFocus) {
                k.init({
                        action: 'tel',
                        // 软键盘弹出距离页面顶部距离，通过输入框元素传入
                        top: btn.keyboardTop ? btn.keyboardTop : '100px',
                        // 软键盘弹出距离页面左边距离，通过输入框元素传入
                        left: btn.keyboardLeft ? btn.keyboardLeft : '88px',
                        input: btn.id,
                        // 软键盘返回时需要恢复的焦点
                        backFocus: btn.backFocusId,
                        resolution: r.platformType
                    }
                );
            }
        },

        lottery: function (successFn, errorFn) {
            var templateName = LMInspireOrder.inspireConfigList[0].template_info.alias_name;
            var params = {
                postData: {
                    uniqueName: templateName
                },
                path: 'NewActivity/lotteryByName'
            };
            e.UI.showWaitingDialog();
            e.BM.setKeyEventPause(true);
            LMEPG.ajax.postAPI(params.path, params.postData,
                function (rsp) { // 网络请求成功
                    e.UI.dismissWaitingDialog();
                    e.BM.setKeyEventPause(false);
                    if (rsp.result === 1) {// 接口调用成功
                        successFn(rsp);
                    } else { // 接口调用失败
                        errorFn(rsp.result);
                    }
                }, function () { // 网络请求失败
                    e.UI.dismissWaitingDialog();
                    e.BM.setKeyEventPause(false);
                }
            );
        },

        addInspireOrderTimes: function (successFn, errorFn) {
            var params = {
                postData: {},
                path: 'Common/addInspireOrderTimes'
            };
            e.UI.showWaitingDialog();
            e.BM.setKeyEventPause(true);
            LMEPG.ajax.postAPI(params.path, params.postData,
                function (rsp) { // 网络请求成功
                    e.UI.dismissWaitingDialog();
                    e.BM.setKeyEventPause(false);
                    if (rsp.result === 0) {// 接口调用成功
                        r.inspireTimes++;
                        successFn(rsp);
                    } else { // 接口调用失败
                        errorFn(rsp.result);
                    }
                }, function () { // 网络请求失败
                    e.UI.dismissWaitingDialog();
                    e.BM.setKeyEventPause(false);
                }
            );
        },

        setLotteryPhone: function (successFn, errorFn) {
            var userTel = G('input-phone').innerText;

            //判断手机号是否正确
            if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                e.UI.showToast('请输入有效的电话', 1);
                return;
            }

            var templateName = LMInspireOrder.inspireConfigList[0].template_info.alias_name;
            var params = {
                postData: {
                    phoneNumber: userTel,
                    prizeId: LMInspireOrder.lotteryPrizeId,
                    uniqueName: templateName
                },
                path: 'NewActivity/setPhoneForLottery'
            };

            e.BM.setKeyEventPause(true);
            e.UI.showWaitingDialog();
            LMEPG.ajax.postAPI(params.path, params.postData,
                function (rsp) { // 网络请求成功
                    e.UI.dismissWaitingDialog();
                    e.BM.setKeyEventPause(false);
                    if (rsp.result === 0) {// 接口调用成功
                        successFn(rsp);
                    } else { // 接口调用失败
                        errorFn(rsp.result);
                    }
                }, function () { // 网络请求失败
                    e.UI.dismissWaitingDialog();
                    e.BM.setKeyEventPause(false);
                }
            );
        }
    };

    window.LMInspireOrder = LMInspireOrder;
})(LMEPG, LMKey, RenderParam);
