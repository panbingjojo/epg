(function (w, d, e, r, k, u) {

    function $(elementId) {
        return d.getElementById(elementId);
    }

    w.$ = $;

    var LMActivity = {
        shownModal: null,
        triggerModalButton: '',
        makeImageUrl: function (imageFile) {
            // r.imagePath -- 控制器构建当前活动图片服务器路径
            // imageFile -- 具体的活动文件名
            return r.imagePath + imageFile;
        },

        showModal: function (modal) {
            if (LMActivity.shownModal) {
                // 判断当前是否有显示的模板，如果有就先关闭
                LMActivity.hideModal(LMActivity.shownModal);
            }
            // 显示当前模板页面
            $(modal.id).style.display = 'block';
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
            LMActivity.shownModal = modal;
        },

        hideModal: function (modal) {
            if (modal !== null) {
                // 隐藏需要隐藏的模板
                $(modal.id).style.display = 'none';
                // 恢复活动中的所有焦点事件
                e.BM.setKeyEventPause(false);
                if (modal.onDismissListener) {
                    // 执行模板页面隐藏后操作
                    modal.onDismissListener();
                }
                if (LMActivity.triggerModalButton) {
                    // 恢复活动焦点到启动模板的焦点
                    e.BM.requestFocus(LMActivity.triggerModalButton);
                }
                // 设置活动正在显示的模板为null
                LMActivity.shownModal = null;
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

        /*截取时间格式："yyyy-MM-dd"*/
        formatDate: function (dateStr) {
            return dateStr.slice(0, dateStr.indexOf(' '));
        },

        /*敏感信息处理*/
        formatAccount: function (str) {
            return str.slice(0, 3) + '***' + str.slice(str.length - 3);
        },

        renderLotteryRecordList: function (lotteryRecordList, myLotteryRecordList) {
            var myLotteryRecord = null;
            var htm = '<marquee  id="all_marquee" scrollamount="5"  direction="up"><table id="all_table" class="marquee_table">';
            for (var i = 0; i < lotteryRecordList.length; i++) {
                htm += '<tr>'
                    + '<td class="winner_account">'
                    + LMActivity.formatAccount(lotteryRecordList[i]['user_account'])
                    + '<td class="winner_time">'
                    + LMActivity.formatDate(lotteryRecordList[i]['prize_dt'])
                    + '<td class="winner_prize">' + lotteryRecordList[i]['prize_name'];
                if (lotteryRecordList[i]['user_account'] === r.userAccount) {
                    myLotteryRecord = lotteryRecordList[i];
                }
            }
            htm += '</table></marquee>';

            // 当前登录用户中奖信息
            var myHtm = '<marquee  id="my_marquee" scrollamount="5"  direction="up"><table id="my_table" class="marquee_table">';
            if (myLotteryRecord) {
                LMActivity.lotteryPrizeId= myLotteryRecord['prize_idx'];
                myHtm += '<tr>'
                    + '<td class="winner_account">'
                    + LMActivity.formatAccount(myLotteryRecord['user_account'])
                    + '<td class="winner_time">'
                    + LMActivity.formatDate(myLotteryRecord['prize_dt'])
                    + '<td class="winner_prize">' + myLotteryRecord['prize_name'];
            }

            $('my_list').innerHTML = myHtm;
            $('total_list').innerHTML = htm;
            if (myLotteryRecordList &&
                myLotteryRecordList.length > 0
                && myLotteryRecordList[0]['user_tel']) {
                $('reset_tel').innerHTML = myLotteryRecordList[0]['user_tel'];
            } else {
                $('reset_tel').innerHTML = "请输入有效的电话";
            }
        },

        renderExchangeRecordList: function (exchangeRecordList, myExchangeRecordList) {
            var myExchangeRecord = null;
            var htm = '<marquee  id="all_marquee" scrollamount="5"  direction="up"><table id="all_table" class="marquee_table">';
            for (var i = 0; i < exchangeRecordList.length; i++) {
                htm += '<tr>'
                    + '<td class="winner_account">'
                    + LMActivity.formatAccount(exchangeRecordList[i]['user_account'])
                    + '<td class="winner_time">'
                    + LMActivity.formatDate(exchangeRecordList[i]['log_dt'])
                    + '<td class="winne_prize">' + exchangeRecordList[i]['goods_name'];
                if (exchangeRecordList[i]['user_account'] === r.userAccount) {
                    myExchangeRecord = exchangeRecordList[i];
                }
            }
            htm += '</table></marquee>';

            // 当前登录用户中奖信息
            var myHtm = '<marquee  id="my_marquee" scrollamount="5"  direction="up"><table id="my_table" class="marquee_table">';
            if (myExchangeRecord) {
                LMActivity.exchangePrizeId = myExchangeRecord['goods_id'];
                myHtm += '<tr>'
                    + '<td class="winner_account">'
                    + LMActivity.formatAccount(myExchangeRecord['user_account'])
                    + '<td class="winner_time">'
                    + LMActivity.formatDate(myExchangeRecord['log_dt'])
                    + '<td class="winner_prize">' + myExchangeRecord['goods_name'];
            }

            $('my_list').innerHTML = myHtm;
            $('total_list').innerHTML = htm;
            if (myExchangeRecordList && myExchangeRecordList.length > 0) {
                $('reset_tel').innerHTML = myExchangeRecordList[0]['user_tel'];
            } else {
                $('reset_tel').innerHTML = "请输入有效的电话";
            }
        },

        renderExchangePrize: function (exchangePrizeList, exchangePrizeButtons, exchangeFocusId, moveType) {
            $('game_score').innerHTML = r.score; // 当前游戏积分
            $('exchange_point_1').innerHTML = exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_2').innerHTML = exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_3').innerHTML = exchangePrizeList[2].consume_list[0].consume_count;

            var gameScore = parseInt(r.score);
            var focusId = exchangeFocusId;
            if (r.exchangeRecordList.data.list.length > 0 ||
                gameScore < parseInt(exchangePrizeList[2].consume_list[0].consume_count)) {
                LMActivity.disableExchangePrize('exchange_prize_1');
                LMActivity.disableExchangePrize('exchange_prize_2');
                LMActivity.disableExchangePrize('exchange_prize_3');
            } else if (gameScore < parseInt(exchangePrizeList[1].consume_list[0].consume_count)) {
                LMActivity.disableExchangePrize('exchange_prize_1');
                LMActivity.disableExchangePrize('exchange_prize_2');
                LMActivity.enableExchangePrize('exchange_prize_3', exchangePrizeButtons[2]);
                focusId = 'exchange_prize_3';
            } else if (gameScore < parseInt(exchangePrizeList[0].consume_list[0].consume_count)) {
                LMActivity.disableExchangePrize('exchange_prize_1');
                LMActivity.enableExchangePrize('exchange_prize_2', exchangePrizeButtons[1]);
                LMActivity.enableExchangePrize('exchange_prize_3', exchangePrizeButtons[2]);
                exchangePrizeButtons[1].nextFocusRight = exchangePrizeButtons[2].id;
                exchangePrizeButtons[2].nextFocusLeft = exchangePrizeButtons[1].id;
                focusId = 'exchange_prize_2';
            } else {
                LMActivity.enableExchangePrize('exchange_prize_1', exchangePrizeButtons[0]);
                LMActivity.enableExchangePrize('exchange_prize_2', exchangePrizeButtons[1]);
                LMActivity.enableExchangePrize('exchange_prize_3', exchangePrizeButtons[2]);
                if (moveType === 1) {
                    exchangePrizeButtons[1].nextFocusRight = exchangePrizeButtons[0].id;
                    exchangePrizeButtons[2].nextFocusLeft = exchangePrizeButtons[0].id;
                }
                focusId = 'exchange_prize_1';
            }

            return focusId;
        },

        disableExchangePrize: function (prizeId) {
            $(prizeId).src = LMActivity.makeImageUrl('btn_exchange_unable.png');
            e.BM.deleteButtons(prizeId);
        },

        enableExchangePrize: function (prizeId, exchangePrizeButton) {
            $(prizeId).src = LMActivity.makeImageUrl('btn_exchange_enable.png');
            e.BM.addButtons(exchangePrizeButton);
        },

        hasLeftTime: function () {
            return r.leftTimes > 0;
        },

        showGameStatus: function (gameOverFocusId) {
            if (r.isVip === '0') {
                // 普通用户提示VIP订购
                LMActivity.showModal({
                    id: 'order_vip',
                    focusId: 'btn_order_submit'
                });
            } else {
                // VIP用户提示活动结束
                LMActivity.showModal({
                    id: 'game_over',
                    focusId: gameOverFocusId
                });
            }
        },

        setExchangePhone: function (input, isReset) {
            var userTel = $(input).innerText;

            //判断手机号是否正确
            if (!u.verify.isValidTel(userTel)) {
                u.dialog.showToast('请输入有效的电话', 1);
                return;
            }

            if (isReset && !LMActivity.exchangePrizeId) {
                u.dialog.showToast('您尚未中奖', 1);
                return;
            }

            LMActivity.AjaxHandler.setPhoneForExchange(userTel, LMActivity.exchangePrizeId, function () {
                u.dialog.showToast('设置电话号码成功', 3, function () {
                    LMActivity.Router.reload();
                })
            }, function () {
                u.dialog.showToast('设置电话号码出错', 3, function () {
                    LMActivity.Router.reload();
                })
            })
        },

        setLotteryPhone: function (input, isReset) {
            var userTel = $(input).innerText;

            //判断手机号是否正确
            if (!u.verify.isValidTel(userTel)) {
                u.dialog.showToast('请输入有效的电话', 1);
                return;
            }

            if (isReset && !LMActivity.lotteryPrizeId) {
                u.dialog.showToast('您尚未中奖', 1);
                return;
            }

            LMActivity.AjaxHandler.setPhoneForLottery(userTel, LMActivity.lotteryPrizeId, function () {
                u.dialog.showToast('设置电话号码成功', 3, function () {
                    LMActivity.Router.reload();
                })
            }, function () {
                u.dialog.showToast('设置电话号码出错', 3, function () {
                    LMActivity.Router.reload();
                })
            })
        },

        /**
         * 核心点击事件处理
         * @param btn 被点击的按钮
         */
        eventHandler: function (btn) {
            LMActivity.currentClickedId = btn.id;
            switch (btn.id) {
                case 'btn_back':
                    LMActivity.exitActivity();
                    break;
                case 'btn_activity_rule':
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.showModal({
                        id: 'activity_rule',
                        focusId: 'btn_close_rule'
                    });
                    break;
                case 'btn_winner_list':
                    switch (btn.listType) {
                        case 'exchange':
                            LMActivity.renderExchangeRecordList(r.exchangeRecordList.data.all_list,
                                r.exchangeRecordList.data.list);
                            break;
                        case 'lottery':
                            LMActivity.renderLotteryRecordList(r.lotteryRecordList.list,
                                r.myLotteryRecord.list);
                            break;
                    }
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.showModal({
                        id: 'winner_list',
                        focusId: 'btn_list_submit'
                    });
                    break;
                case 'btn_list_submit':
                    var listType = btn.listType ? btn.listType : 'exchange';
                    switch (listType){
                        case 'exchange':
                            LMActivity.setExchangePhone('reset_tel', true);
                            break;
                        case 'lottery':
                            LMActivity.setLotteryPhone('reset_tel', true);
                            break;
                    }

                    break;
                case 'btn_close_rule':
                case 'btn_game_over_sure':
                case 'btn_lottery_cancel':
                case 'btn_lottery_fail':
                case 'btn_list_cancel':
                    // 关闭当前对话框
                    LMActivity.hideModal(LMActivity.shownModal);
                    break;
                case 'btn_exchange_prize':
                    LMActivity.triggerModalButton = btn.id;
                    var focusId = LMActivity.renderExchangePrize(r.exchangePrizeList.data, btn.exchangePrizeButtons,
                        btn.exchangeFocusId, btn.moveType);
                    LMActivity.showModal({
                        id: 'exchange_prize',
                        focusId: focusId
                    });
                    break;
                case 'exchange_prize_1':
                case 'exchange_prize_2':
                case 'exchange_prize_3':
                    LMActivity.exchangePrize(btn.order);
                    break;
                case 'btn_order_submit':
                    LMActivity.Router.jumpBuyVip();
                    break;
                case 'btn_order_cancel':
                    if (r.isVip === '0' && r.valueCountdown.showDialog === '1') {
                        LMActivity.showModal({
                            id: 'countdown',
                            onShowListener: function () {
                                LMActivity.startCountdown();
                            },
                            onDismissListener: function () {
                                if (LMActivity.countInterval !== null) {
                                    clearInterval(LMActivity.countInterval);
                                }
                            }
                        })
                    } else {
                        LMActivity.hideModal(LMActivity.shownModal);
                    }
                    break;
                case 'btn_exchange_submit':
                    LMActivity.setExchangePhone('exchange_tel', false);
                    break;
                case 'btn_exchange_cancel':
                    LMActivity.Router.reload();
                    break;
                case 'btn_lottery_sure':
                    LMActivity.doLottery();
                    break;
                case 'btn_lottery_submit':
                    LMActivity.setLotteryPhone('lottery_tel', false);
                    break;
            }
        },

        exitActivity: function () {
            if (r.isVip === '0' && r.valueCountdown.showDialog === '1') {
                LMActivity.showModal({
                    id: 'countdown',
                    onShowListener: function () {
                        LMActivity.startCountdown();
                    },
                    onDismissListener: function () {
                        e.Intent.back();
                    }
                })
            } else {
                e.Intent.back();
            }
        },

        doLottery: function () {
            LMActivity.AjaxHandler.lottery(function (data) {
                LMActivity.lotteryPrizeId = data.prize_idx;
                $('prize_image').src = LMActivity.prizeImage[data.prize_idx];
                LMActivity.showModal({
                    id: 'lottery_success',
                    focusId: 'btn_lottery_submit',
                    onDismissListener: function () {
                        LMActivity.Router.reload();
                    }
                })
            },function () {
                LMActivity.showModal({
                    id: 'lottery_fail',
                    focusId: 'btn_lottery_fail',
                    onDismissListener: function () {
                        LMActivity.Router.reload();
                    }
                })
            });
        },

        exchangePrize: function (prizeIndex) {
            var prizeId = (r.exchangePrizeList.data)[prizeIndex].goods_id;
            LMActivity.AjaxHandler.exchangePrize(prizeId, function () {
                // 显示兑换成功
                LMActivity.exchangePrizeId = prizeId;
                LMActivity.showModal({
                    id: 'exchange_success',
                    focusId: 'btn_exchange_submit',
                    onDismissListener: function () {
                        LMActivity.Router.reload();
                    }
                })
            }, function (errCode) {
                // 兑换失败
                if (errCode === -101) {
                    $('exchange_fail').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_no_prize.png') + ')';
                    LMActivity.showModal({
                        id: 'exchange_fail',
                        onDismissListener: function () {
                            LMActivity.Router.reload();
                        }
                    });
                    LMActivity.exFailTimer = setTimeout(function () {
                        LMActivity.hideModal(LMActivity.shownModal);
                    }, 3000);
                }
            });
        },

        showOrderResult: function () {
            if (r.isOrderBack === '1') { // 从订购页面跳转回活动页面
                if (r.cOrderResult === '1') { // 订购成功
                    $('order_status').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_order_success.png') + ')'
                } else { // 订购失败
                    $('order_status').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_order_fail.png') + ')'
                }
                LMActivity.showModal({ //展示模板页面
                    id: 'order_status',
                    onDismissListener: function () {
                        if (LMActivity.orderTimer && LMActivity.orderTimer !== null) {
                            // 关闭倒计时
                            clearTimeout(LMActivity.orderTimer);
                        }
                    }
                });
                LMActivity.orderTimer = setTimeout(function () {// 设置倒计时关闭模板页面
                    LMActivity.hideModal(LMActivity.shownModal);
                }, 3000);
            }
        },

        startCountdown: function () {
            LMActivity.count = 8;
            $('count').innerText = String(LMActivity.count);
            LMActivity.countInterval = setInterval(function () {
                $('count').innerText = String(--LMActivity.count);
                if (LMActivity.count === 0) {
                    clearInterval(LMActivity.countInterval);
                    var countdownValue = {
                        showDialog: "0"
                    };
                    LMActivity.AjaxHandler.saveData(r.keyCountdown, JSON.stringify(countdownValue), function () {
                        LMActivity.AjaxHandler.addExtraTimes(function () {
                            LMActivity.Router.reload();
                        }, function () {
                            u.dialog.showToast("游戏机会增加失败", 3, function () {
                                LMActivity.Router.reload();
                            });
                        });
                    })
                }
            }, 1000);
        },

        ajaxPost: function (params) {
            u.dialog.showWaiting();
            e.BM.setKeyEventPause(true);
            // 处理抽奖接口成功码的判断
            var successCode = 0;
            if (params.successCode) {
                successCode = params.successCode;
            }
            LMEPG.ajax.postAPI(params.path, params.postData,
                function (rsp) { // 网络请求成功
                    u.dialog.hide();
                    e.BM.setKeyEventPause(false);
                    if (rsp.result == successCode) {// 接口调用成功
                        params.successCallback(rsp);
                    } else { // 接口调用失败
                        params.errorCallback(rsp.result);
                    }
                },function () { // 网络请求失败
                    u.dialog.hide();
                    e.BM.setKeyEventPause(false);
                }
            );
        }
    };

    LMActivity.Router = {

        /*重载当前界面*/
        reload: function () {
            // 页面加载中释放一切事件
            u.dialog.showWaiting(0.2, '', function () {
                e.Intent.jump(LMActivity.Router.getCurrentPage());
            });
        },

        /*设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity-common-index');
        },

        /*进行订购跳转操作*/
        jumpBuyVip: function () {
            var objCurrent = LMActivity.Router.getCurrentPage();

            var objOrderHome = e.Intent.createIntent('orderHome');
            objOrderHome.setParam('directPay', '1');
            objOrderHome.setParam('orderReason', '101');
            objOrderHome.setParam('hasVerifyCode', '1');

            var objActivityGuide = LMActivity.Router.getCurrentPage();
            objActivityGuide.setParam('isOrderBack', '1'); // 表示订购回来

            // pop_type：局方订购页形式（0浮窗形式 1跳转形式）,IFrame加载订购页面(0--不是，是直接页面跳转, 1--是，在当前页面用IFrame加载；)
            var isIFramePay = 0;
            var payMethod = r.payMethod;
            if (payMethod && payMethod.result == 0) {
                var item = payMethod.data.list[0];
                if (item) {
                    isIFramePay = item.pop_type == '0' ? 1 : 0;
                }
            }

            LMEPG.Log.info("activity isIFramePay = " + isIFramePay);
            if (isIFramePay == 1) {
                objOrderHome.setParam('isIFramePay', '1');
                LMActivity.hideModal(LMActivity.shownModal);
                var payUrl = e.Intent.getJumpUrl(objOrderHome, objCurrent, e.Intent.INTENT_FLAG_NOT_STACK);
                e.PayFrame.goLMPay(payUrl, r.platformType);
            } else {
                e.Intent.jump(objOrderHome, objCurrent, e.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
            }
        }
    };

    LMActivity.AjaxHandler = {
        saveData: function (key, value, successFn, errorFn) {
            var params = {
                postData: {
                    "key": key,
                    "value": value
                },
                path: 'Common/saveData'
            };
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
        },
        uploadPlayRecord: function (successFn, errorFn) {
            var params = {
                postData: {'extraTimes': r.extraTimes},
                path: 'NewActivity/uploadPlayedRecord'
            };
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
        },
        addScore: function (score, successFn, errorFn) {
            var params = {
                postData: {
                    'score': score,
                    'remark': '用户积分'
                },
                path: 'NewActivity/addUserScore'
            };
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
        },
        exchangePrize: function (id, successFn, errorFn) {
            var params = {
                postData: {
                    prizeId: id
                },
                path: 'NewActivity/exchangePrize'
            };
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
        },
        setPhoneForExchange: function (userPhone, prizeId, successFn, errorFn) {
            var params = {
                postData: {
                    phoneNumber: userPhone,
                    prizeId: prizeId
                },
                path: 'NewActivity/setPhoneForExchange'
            };
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
        },
        setPhoneForLottery: function (userPhone, prizeId, successFn, errorFn) {
            var params = {
                postData: {
                    phoneNumber: userPhone,
                    prizeId: prizeId
                },
                path: 'NewActivity/setPhoneForLottery'
            };
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
        },
        addExtraTimes: function (successFn, errFn) {
            var params = {
                postData: {},
                path: 'NewActivity/addExtraTimes'
            };
            params.successCallback = successFn;
            params.errorCallback = errFn;
            LMActivity.ajaxPost(params);
        },
        lottery: function (successFn, errorFn) {
            var params = {
                postData: {},
                path: 'NewActivity/lottery'
            };
            params.successCode = 1;
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
        },
    };

    w.LMActivity = LMActivity;
    w.onBack = function () {
        if (LMActivity.shownModal) {
            LMActivity.hideModal(LMActivity.shownModal);
        } else {
            LMActivity.exitActivity();
        }
    }
})(window, document, LMEPG, RenderParam, LMKey, LMUtils);