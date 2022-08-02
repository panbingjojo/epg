/* eslint-disable no-undef*/
window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
(function (win, doc, epg, TP, utils, LMKey) {

    var setExchangeList = TP.setExchangeList.data;
    var imgPrefix = TP.activityImg;
    var taskFocusId = 'jump-mark';
    var totalScore = TP.totalScore['total_score'];

    var Activity = {
        init: function () {
            this.diff();
            this.setShouldOnFocus();
        },

        /* 获取应当设置焦点的按钮*/
        setShouldOnFocus: function () {
            var scoreData = TP.allChannelScore.list;

            LMEPG.BM.init('', Activity.buttons,"", true);
            Activity.taskCommpleted(scoreData);
        },

        /* 任务完成情况*/
        taskCommpleted: function (scoreData) {
             // scoreData = [
             //     {reason: '100', times: 1},
             //     {reason:'107',times:1},
             //     {reason: '106', times: 2}
             // ];
            var markTask = Activity.getUcompleted(scoreData, '100', 1) && 'jump-mark';
            var caseTask = Activity.getUcompleted(scoreData, '107', 1) && 'jump-case';
            var playTask = Activity.getUcompleted(scoreData, '106', 2) && 'jump-play';
            

            taskFocusId = markTask || caseTask || playTask || 'btn-exchange-0';
            Activity.render.exchangeUI();
            var btnExchange0 = LMEPG.BM.getButtonById('btn-exchange-0');
            var btnExchange1 = LMEPG.BM.getButtonById('btn-exchange-2');
            LMEPG.BM.requestFocus(taskFocusId);
            btnExchange0.nextFocusRight = taskFocusId;
            btnExchange1.nextFocusRight = taskFocusId;

        },

        getUcompleted: function (data, code, count) {
            var item;
            var len = data.length;

            while (len--) {
                item = data[len];
                if (item.reason === code && item.times <= count) {
                    Activity.setCommpletedStatus(code, data[len].times);
                    return false;
                }
            }
            return true;
        },

        setCommpletedStatus: function (code, times) {
            var setStatus = function (btnId, retId, count) {
                G(retId).innerHTML = '完成挑战任务 （' + times + '/' + count + '）';
                if (times !== count) return; // 完成次数没有达到不禁用按钮
                G(btnId).src = imgPrefix + 'btn_completed.png';
                LMEPG.BM.getButtonById(btnId).focusable = false;
            };

            switch (code) {
                case '100':
                    setStatus('jump-mark', 'completed-0', 1);
                    break;
                case '107':
                    setStatus('jump-case', 'completed-1', 1);
                    LMEPG.BM.getButtonById('jump-mark').nextFocusDown = 'jump-play';
                    break;
                case '106':
                    setStatus('jump-play', 'completed-2', 2);
                    break;
                default:
                    break;
            }
        },

        /* 差异化处理*/
        diff: function () {
            var baseImgT = '450092';

            if (TP.lmcid === baseImgT) return;
            // doc.body.style.backgroundImage = 'url(' + TP.activityImg + '/V640093/bg_home.png)';
            // G('modal-rule').style.backgroundImage = 'url(' + imgPrefix + '/V' + TP.lmcid + '/m_rule.png)';
        },


        /* 返回*/
        jumpBack: function () {

            clearTimeout(self.cdTimer);
            // 弹框存在，不是提示订购弹框
            if (Activity.modal.isModal) {
                Activity.modal.hide();
            } else {
                LMEPG.Intent.back();
            }
        },

        /* 重载当前界面*/
        reload: function () {
            // 页面加载中释放一切事件
            LMEPG.onEvent = 'release';
            utils.dialog.showWaiting(0.2, '', function () {
                LMEPG.Intent.jump(Activity.getCurrentPage());
            });
        },

        /* 设置当前页参数*/
        getCurrentPage: function () {
            return LMEPG.Intent.createIntent('activity-common-guide');
        },

        jump: function (btn) {
            var addr;

            switch (btn.id) {
                case 'jump-mark':
                    addr = LMEPG.Intent.createIntent('dateMark');
                    break;
                case 'jump-case':
                    addr = LMEPG.Intent.createIntent('doctorIndex');
                    break;
                case 'jump-play':
                    // 跳转到健康百科
                    addr = LMEPG.Intent.createIntent('channelIndex');
                    addr.setParam('itemIndex', 4);
                    addr.setParam('modelType', 11);
                    addr.setParam('modelName', '健康百科');
                    break;
                default:
                    break;

            }
            LMEPG.Intent.jump(addr, Activity.getCurrentPage());
        },

        changeToBtnFocus: function (key, btn) {
            var jumpAry = ['jump-mark', 'jump-case', 'jump-play'];
            var nextFocusKey = 'nextFocus' + key.slice(0, 1).toUpperCase() + key.slice(1);
            var nextBtn = LMEPG.BM.getButtonById(btn[nextFocusKey]);

            if (nextBtn && nextBtn.focusable === false) {
                if (jumpAry.indexOf(btn.id) >= 0 && key === 'up') {
                    LMEPG.BM.requestFocus('jump-back');
                } else {
                    LMEPG.BM.requestFocus(taskFocusId);
                }
            }
        },

        /* 兑换奖品*/
        exchangePrize: function (btn) {
            if (TP.exchangeRecords.data.list.length || Activity.isSureExchange) {
                utils.dialog.showToast('你已经兑换过奖品了', 1);
            } else {
                Activity.ajaxHandler.requestExchangeAction(btn, Activity.setModalTipsByExchange);
            }
        },

        /* 渲染兑换奖品成功界面*/
        renderSuccessExchangePage: function () {
            G('accomplish-tel').innerHTML = TP.userTel || '请输入有效的电话';
            Activity.modal.show('modal-accomplish', 'btn-accomplish-submit', utils.dialog.hide);
        },

        /* 设置兑奖之后的弹框提示*/
        setModalTipsByExchange: function (ret) {
            console.log(ret);
            switch (Number(ret.result)) {
                // 成功兑换
                case 0:
                    Activity.renderSuccessExchangePage();
                    Activity.isSureExchange = true;
                    break;
                // 材料不足
                case -102 :
                    LMUtils.dialog.showToast('积分不足，还不能兑换哦~', 1.5);
                    break;
                // 超出可兑换数量
                case -100:
                    LMUtils.dialog.showToast('超出可兑换数量了，不能兑换哦~', 1.5);
                    break;
                // 库存不足/其他情况
                default:
                    LMUtils.dialog.showToast('真遗憾，奖品库存不足了~', 2);
                    break;
            }
        },


        /* 截取时间格式："yyyy-MM-dd"*/
        formatDate: function (dateStr) {
            return dateStr.slice(0, dateStr.indexOf(' '));
        },

        /* 敏感信息处理*/
        formatAccount: function (str) {
            return str.slice(0, 3) + '***' + str.slice(str.length - 3);
        },

        /* 事件综合处理（模拟事件，键盘事件）*/
        eventHandler: function (btn, hasFocus) {
            switch (btn.id) {
                // 退出活动
                case 'jump-back':
                    Activity.jumpBack();
                    break;
                case 'jump-mark':
                case 'jump-case':
                case 'jump-play':
                    Activity.jump(btn);
                    break;
                // 模板消失
                case 'btn-one0':
                case 'btn-rule-close':
                case 'btn-uncompleted-sure':
                case 'btn-accomplish-cancel':
                    Activity.modal.hide();
                    break;
                // 显示活动规则
                case 'jump-rule':
                    TP.beClickId = btn.id;
                    Activity.modal.show('modal-rule');
                    break;
                // 显示兑换奖品界面
                case 'jump-exchange':
                    TP.beClickId = btn.id;
                    Activity.render.exchangeUI();
                    break;
                // 执行兑换
                case 'btn-exchange-0':
                case 'btn-exchange-1':
                case 'btn-exchange-2':
                case 'btn-exchange-3':
                    Activity.exchangePrize(btn);
                    break;
                // 上传电话号码
                case 'btn-list-submit':
                case 'btn-accomplish-submit':
                    Activity.setPhoneNumber(btn);
                    break;
                // 启动数字小键盘
                case 'rewrite-tel':
                case 'accomplish-tel':
                    Activity.callKeypad(btn, hasFocus);
                    break;
                default:
                    break;
            }
        },

        callKeypad: function (btn, hasFocus) {
            var reC = TP.platformType === 'hd' ? '200px' : '150px';

            hasFocus && LMKey.init({
                action: 'tel',
                top: reC,
                left: '300px',
                input: btn.id,
                backFocus: btn.backFocusId,
                resolution: TP.platformType
            });
        },

        setPhoneNumber: function (btn) {
            var isAction = btn.isAction;
            var inputId = isAction === 'isListSubmit' ? 'rewrite-tel' : 'accomplish-tel';
            var userTel = G(inputId).innerText;

            //判断手机号是否正确
            if (!utils.verify.isValidTel(userTel)) {
                utils.dialog.showToast('请输入有效的电话', 1);
                return;
            }

            // 判断是兑换到过奖品
            if (isAction === 'isListSubmit' && !Activity.hasOwnPrized) {
                utils.dialog.showToast('您尚未中奖', 1);
                return;
            }

            Activity.ajaxHandler.submitUserTel(userTel, function () {
                TP.userTel = userTel;
                utils.dialog.showToast('提交电话成功！', 2, Activity.reload);
            });
        },

        /**
         * 模板显/隐控制器
         * 显示：
         * @param modalId 弹框流id
         * @param focusId(useReload请求立即重载) 若没有传递,则暂停按键操作功能
         * @param bol 标记重载
         * @param callback 回调
         * 隐藏：
         * @param bol 请求重载页面
         * @param callback 回到
         *
         */
        modal: {
            prevModal: '',
            isModal: false,
            show: function (currModal, focusId, callback) {
                var prevModal = Activity.modal.prevModal;

                if (prevModal) G(prevModal).style.display = 'none';
                if (currModal) G(currModal).style.display = 'block';
                Activity.modal.isModal = true;
                Activity.modal.prevModal = currModal;
                Activity.modal.isReload = focusId; // 当传递1的时候则隐藏的时候重载
                if (focusId) {
                    focusId === 'useReload'
                        ? Activity.reload()
                        : LMEPG.BM.requestFocus(focusId);
                } else {
                    LMEPG.BM.setKeyEventPause(true);
                }
                typeof callback === 'function' && callback();
            },

            hide: function (bol, callback) {
                var modalId = Activity.modal.prevModal;

                if (modalId) {
                    G(modalId).style.display = 'none';
                    Activity.modal.isModal = false;
                    LMEPG.BM.setKeyEventPause(false);
                    LMEPG.BM.requestFocus(TP.beClickId);
                    if (Activity.modal.isReload === 1) {
                        LMEPG.BM.setKeyEventPause(true);
                        Activity.reload();
                    }
                }
                typeof callback === 'function' && callback();
            }
        },

        /** 验证对象*/
        verifyUser: {

            // 验证剩余游戏次数
            isHaveTimes: TP.leftTimes.leftTimes > 0,
            // 验证是否VIP
            isVip: TP.isVip === '1',
            // 验证是否首次进入
            isFirstEnter: !TP.firstEnter,
            // 验证是否支付成功
            isPaySuccess: TP.cOrderResult === '1'
        }
    };

    /**
     * ajax 集中处理对象
     * 调用网络请求
     * 通用错误提示
     *
     * */
    Activity.ajaxHandler = {

        /* 保存用户电话号码*/
        submitUserTel: function (tel, callback) {
            utils.dialog.showWaiting();
            LMEPG.ajax.postAPI(
                'Activity/setPhoneNumber',
                {phoneNumber: tel, exchange: true},
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /* 获取保存的积分数据*/
        getUserScore: function (callback) {
            utils.dialog.showWaiting();
            LMEPG.ajax.postAPI(
                'Activity/getUserScore',
                null,
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /* 请求兑换奖品*/
        requestExchangeAction: function (btn, callback) {
            utils.dialog.showWaiting();
            LMEPG.ajax.postAPI(
                'Activity/exchangePrize',
                {goodsId: btn.goodsId},
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        // 请求错误
        errorNetwork: function () {
            utils.dialog.showToast('网络请求发生错误了!', 3);
        }
    };


    /**
     * 渲染层
     */
    Activity.render = {

        // 渲染兑换界面
        exchangeUI: function () {
            var htm = '';
            for (var i = 0; i < setExchangeList.length; i++) {
                htm += '<div class="exchange-wrap exchange-wrap-' + i + '">';
                htm += '<p class="count-' + i + '"> x' + setExchangeList[i].consume_list[0].consume_count + '</p>';
                htm += '<img id="btn-exchange-' + i + '" src="' + imgPrefix + '/btn_exchange.png">';
                htm += '</div>';
            }

            G('exchange-wrap').innerHTML = htm;
            G('score-count').innerHTML = 'x ' + totalScore;
        }
    };

    /**
     * 注册所有虚拟按钮
     * @type {*[]}
     */
    Activity.buttons = [{
        id: 'debug',
        name: '脚手架ID',
        type: 'img',
        backgroundImage: String(imgPrefix),
        focusImage: String(imgPrefix),
        click: Activity.eventHandler
    }, {
        id: 'jump-back',
        name: '按钮-返回',
        type: 'img',
        nextFocusDown: 'jump-mark',
        nextFocusLeft: 'jump-rule',
        backgroundImage: imgPrefix + 'jump_back.png',
        focusImage: imgPrefix + 'jump_back_f.gif',
        beforeMoveChange: Activity.changeToBtnFocus,
        click: Activity.eventHandler
    }, {
        id: 'jump-rule',
        name: '按钮-显示活动规则',
        type: 'img',
        nextFocusDown: 'btn-exchange-0',
        nextFocusRight: 'jump-back',
        backgroundImage: imgPrefix + 'jump_rule.png',
        focusImage: imgPrefix + 'jump_rule_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'jump-mark',
        name: '按钮-跳转签到',
        type: 'img',
        nextFocusUp: 'jump-back',
        nextFocusLeft: 'btn-exchange-0',
        nextFocusDown: 'jump-case',
        backgroundImage: imgPrefix + 'jump_mark.png',
        focusImage: imgPrefix + 'jump_mark_f.png',
        click: Activity.eventHandler
    }, {
        id: 'jump-case',
        name: '按钮-跳转问诊',
        type: 'img',
        nextFocusUp: 'jump-mark',
        nextFocusDown: 'jump-play',
        nextFocusLeft: 'btn-exchange-0',
        backgroundImage: imgPrefix + 'jump_case.png',
        focusImage: imgPrefix + 'jump_case_f.png',
        isAction: '',
        beforeMoveChange: Activity.changeToBtnFocus,
        click: Activity.eventHandler
    }, {
        id: 'jump-play',
        name: '按钮-跳转播放',
        type: 'img',
        nextFocusUp: 'jump-case',
        nextFocusLeft: 'btn-exchange-0',
        backgroundImage: imgPrefix + 'jump_play.png',
        focusImage: imgPrefix + 'jump_play_f.png',
        beforeMoveChange: Activity.changeToBtnFocus,
        click: Activity.eventHandler
    }, {
        id: 'accomplish-tel',
        name: '完成游戏输入框',
        type: 'img',
        click: Activity.eventHandler,
        focusChange: Activity.eventHandler,
        backFocusId: 'btn-accomplish-submit'
    }, {
        id: 'btn-one0',
        name: '',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        click: Activity.eventHandler
    }, {
        id: 'btn-exchange-0',
        name: '',
        type: 'img',
        nextFocusUp: 'jump-rule',
        nextFocusDown: 'btn-exchange-1',
        nextFocusLeft: '',
        nextFocusRight: 'btn-exchange-1',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goodsId: setExchangeList[0].goods_id,
        click: Activity.eventHandler
    }, {
        id: 'btn-exchange-1',
        name: '',
        type: 'img',
        nextFocusUp: 'jump-rule',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-0',
        nextFocusRight: 'btn-exchange-2',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goodsId: setExchangeList[1].goods_id,
        beforeMoveChange: Activity.changeToBtnFocus,
        click: Activity.eventHandler
    }, {
        id: 'btn-exchange-2',
        name: '',
        type: 'img',
        nextFocusUp: 'btn-exchange-0',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-1',
        nextFocusRight: '',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goodsId: setExchangeList[2].goods_id,
        beforeMoveChange: Activity.changeToBtnFocus,
        click: Activity.eventHandler
    },/* {
        id: 'btn-exchange-3',
        name: '',
        type: 'img',
        nextFocusUp: 'btn-exchange-1',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-2',
        nextFocusRight: 'jump-mark',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goodsId: setExchangeList[3].goods_id,
        beforeMoveChange: Activity.changeToBtnFocus,
        click: Activity.eventHandler
    },*/ {
        id: 'btn-accomplish-submit',
        name: '按钮-完成游戏提交',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusRight: 'btn-accomplish-cancel',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        isAction: '',
        click: Activity.eventHandler
    }, {
        id: 'btn-accomplish-cancel',
        name: '按钮-完成游戏取消',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusLeft: 'btn-accomplish-submit',
        backgroundImage: imgPrefix + 'btn_cancel.png',
        focusImage: imgPrefix + 'btn_cancel_f.png',
        click: Activity.eventHandler
    }, {
        id: '',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: '',
        nextFocusRight: '',
        backgroundImage: String(imgPrefix),
        focusImage: String(imgPrefix),
        click: Activity.eventHandler
    }];

    win.Activity = Activity;
    win.onBack = Activity.jumpBack;

}(window, document, LMEPG, RenderParam, LMUtils, LMKey));
