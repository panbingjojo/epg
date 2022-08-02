(function (w, d, e, r) {
    // 中国联通活动不再弹窗倒计时
    if (r.lmcid == '000051' || r.lmcid== '12650092') {
        r.valueCountdown.showDialog = '0';
    }

    if (RenderParam.lmcid == '630092') {
        //数据探针上报  页面探针
        var dataRP ={
            userId:RenderParam.userId,
            pageKey:window.location.pathname,
            pageType:'activities',
        }
        DataReport.getValue(1,dataRP);
    }

    function $(elementId) {
        return d.getElementById(elementId);
    }

    w.$ = $;
    var exchangeStatus = false;
    var LMActivity = {
        playStatus: false,
        shownModal: null,
        triggerModalButton: '',
        makeImageUrl: function (imageFile) {
            // r.imagePath -- 控制器构建当前活动图片服务器路径
            // imageFile -- 具体的活动文件名
            return r.imagePath + imageFile;
        },

        /**
         * 重新设置分辨率，河南有盒子会出现页面放大情况，原因是高清盒子使用了标清页面
         */
        setPageSize: function () {
            var meta = document.getElementsByTagName('meta');
            var contentSize = meta["page-view-size"].getAttribute('content');
            //LMEPG.Log.error("task::setPageSize ---> meta" + meta);
            if (typeof meta !== "undefined") {
                if (RenderParam.platformType == "hd") {
                    meta["page-view-size"].setAttribute('content', "1280*720");
                } else {
                    meta["page-view-size"].setAttribute('content', "640*530");
                }
                // LMEPG.Log.error("task::setPageSize ---> meta set 1280*720");
            }
            //LMEPG.Log.error("task::setPageSize ---> meta end");
            if (contentSize !== '1280*720' || contentSize !== '640*530') {
                setTimeout(LMActivity.setPageSize, 500);
            }
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
                LMEPG.UI.keyboard.show(100, 88, btn.id, btn.backFocusId, true);
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

        renderLotteryRecordList: function (lotteryRecordList, myLotteryRecordList,rollLine) {
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
            var myHtm = '<marquee  id="my_marquee" scrollamount="'+(rollLine || 0)+'"  direction="up"><table id="my_table" class="marquee_table">';
            if (myLotteryRecord) {
                LMActivity.lotteryPrizeId = myLotteryRecord['prize_idx'];
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

                $('reset_tel').innerHTML = myLotteryRecordList[myLotteryRecordList.length - 1]['user_tel'];
            } else {
                $('reset_tel').innerHTML = "请输入有效的电话";
            }
        },

        renderExchangeRecordList: function (exchangeRecordList, myExchangeRecordList,line) {
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
            var myHtm = '<marquee  id="my_marquee" scrollamount="'+(line || 0)+'"  direction="up"><table id="my_table" class="marquee_table">';
            if (myExchangeRecord) {
                // 判断是否兑过奖
                LMActivity
                    .exchangePrizeId = myExchangeRecord['goods_id'];
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
                $('reset_tel').innerHTML = myExchangeRecordList[0]['user_tel'] || '请输入有效的电话';
            } else {
                $('reset_tel').innerHTML = "请输入有效的电话";
            }
        },

        renderExchangePrize: function (exchangePrizeList, exchangePrizeButtons, exchangeFocusId, moveType) {
            $('game_score').innerHTML = r.score; // 当前游戏积分
            $('exchange_point_1').innerHTML = exchangePrizeList[0].consume_list[0].consume_count;
            $('exchange_point_2').innerHTML = exchangePrizeList[1].consume_list[0].consume_count;
            $('exchange_point_3').innerHTML = exchangePrizeList[2].consume_list[0].consume_count;
            focusId = 'exchange_prize_1';

            return focusId;
        },

        hasLeftTime: function () {
            return r.leftTimes > 0;
        },

        showGameStatus: function (gameOverFocusId) {
            if (r.isVip === 0 || r.isVip === '0') {
                // 普通用户提示VIP订购
                if (r.activityName == "JointActivityWomenDay20200225") {
                    LMActivity.showModal({
                        id: 'order_vip',
                        focusId: 'dg_order_1'
                    });
                } else if (r.activityName == "ActivityChooseStyle20210207") {
                    LMActivity.Router.jumpBuyVip();
                } else {
                    LMActivity.showModal({
                        id: 'order_vip',
                        focusId: 'btn_order_submit'
                    });
                }
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
            if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                LMEPG.UI.showToast('请输入有效的电话', 1);
                return;
            }

            if (isReset && !LMActivity.exchangePrizeId) {
                LMEPG.UI.showToast('您尚未中奖', 1);
                return;
            }

            LMActivity.AjaxHandler.setPhoneForExchange(userTel, LMActivity.exchangePrizeId, function () {
                LMEPG.UI.showToast('设置电话号码成功', 3, function () {
                    LMActivity.Router.reload();
                })
            }, function () {
                LMEPG.UI.showToast('设置电话号码出错', 3, function () {
                    LMActivity.Router.reload();
                })
            })
        },

        setLotteryPhone: function (input, isReset) {
            var userTel = $(input).innerText;
            //判断手机号是否正确
            if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                LMEPG.UI.showToast('请输入有效的电话', 1);
                return;
            }

            if (isReset && !LMActivity.lotteryPrizeId) {
                LMEPG.UI.showToast('您尚未中奖', 1);
                return;
            }

            LMActivity.AjaxHandler.setPhoneForLottery(userTel, LMActivity.lotteryPrizeId, function () {
                LMEPG.UI.showToast('设置电话号码成功', 3, function () {
                    LMActivity.Router.reload();
                })
            }, function () {
                LMEPG.UI.showToast('设置电话号码出错', 3, function () {
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
                    switch (listType) {
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
                case 'btn-go':
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
                        LMActivity.playStatus = true;
                    } else {
                        LMActivity.hideModal(LMActivity.shownModal);
                        LMEPG.BM.requestFocus('btn_start');
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
            // 青海电信 活动返回是跳转另一个大厅
            if (r.lmcid == '630092' && r.fromLaunch == '1') {
                Utility.setValueByName("exitIptvApp");
                return;
            }

            if (r.isVip === '0' && r.valueCountdown.showDialog === '1') {

                LMActivity.showModal({
                    id: 'countdown',
                    onShowListener: function () {
                        LMActivity.startCountdown();
                    },
                    onDismissListener: function () {
                        LMActivity.innerBack();
                    }
                })
            } else {
                LMActivity.innerBack()
            }
        },
        /**
         * 监听返回事件--> 返回局方的Home页面
         */
        innerBack: function () {

            // 通过此接口，来设置活动的特殊返回
            if (typeof outBack == "function" && specialBackArea != undefined && specialBackArea.indexOf(RenderParam.lmcid) != -1) {
                outBack();
                return;
            }

            if (r.inner == "1") {
                e.Intent.back();
            } else {
                e.Intent.back("IPTVPortal");
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
                });
                LMActivity.playStatus = false;
            }, function () {
                LMActivity.showModal({
                    id: 'lottery_fail',
                    focusId: 'btn_lottery_fail',
                    onDismissListener: function () {
                        LMActivity.Router.reload();
                    }
                });
                LMActivity.playStatus = false;
            });
        },

        doLotteryRound1: function (id, succImg, failImg) {
            LMActivity.AjaxHandler.lottery(function (data) {
                LMActivity.lotteryPrizeId = data.prize_idx;
                $(id).src = succImg;
                setTimeout(function () {
                    LMActivity.showModal({
                        id: 'lottery_success_1',
                        focusId: 'btn_lottery_submit_1',
                    });
                }, 2000);
            }, function () {
                $(id).src = failImg;
                setTimeout(function () {
                    LMActivity.showModal({
                        id: 'lottery_fail_1',
                        focusId: 'btn_lottery_fail_1',
                    })
                }, 2000);
            });
        },

        doLotteryRound2: function () {
            LMActivity.prizeId = "undefined";
            LMActivity.roundFlag = 2;
            LMActivity.AjaxHandler.lottery(function (data) {
                LMActivity.lotteryPrizeId = data.prize_idx;
                $("lottery_prize").src = LMActivity.prizeImage[parseInt(data.unique_name) - 1];     //调整通过奖品唯一标识确定奖品图片
                LMActivity.showModal({
                    id: 'lottery_success',
                    focusId: 'btn_lottery_submit',
                    onDismissListener: function () {
                        LMActivity.Router.reload();
                    }
                });
            }, function () {
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
            if (r.exchangeRecordList.data.list.length > 0) {
                LMEPG.UI.showToast("您已经兑换过奖品")
                return;
            }
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
                        focusId: 'on-gift-ok', //add new
                        onDismissListener: function () {
                            LMActivity.Router.reload();
                        }
                    });
                    LMActivity.exFailTimer = setTimeout(function () {
                        LMActivity.hideModal(LMActivity.shownModal);
                    }, 3000);
                } else if (errCode === -102) {
                    if (r.activityName == 'JointActivityFeedCatsOnVacation20200727') {
                        LMEPG.UI.showToast("喵小肥还没吃饱哦~", 3);
                    } else if (r.activityName == 'ActivityDeerGrowUp20201118') {
                        LMEPG.UI.showToast("成长值不足!", 3);
                    } else {
                        LMEPG.UI.showToast("积分不足", 3);
                    }
                } else {
                    LMEPG.UI.showToast("兑换出错" + errCode, 3);
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
                            LMEPG.UI.showToast("游戏机会增加失败", 3, function () {
                                LMActivity.Router.reload();
                            });
                        });
                    })
                }
            }, 1000);
        },

        ajaxPost: function (params) {
            if (r.activityName != 'ActivityDemolitionExpress20200312' && r.activityName != 'JointActivityFeedCatsOnVacation20200727') {
                LMEPG.UI.showWaitingDialog();
            }

            e.BM.setKeyEventPause(true);
            // 处理抽奖接口成功码的判断
            var successCode = 0;
            if (params.successCode) {
                successCode = params.successCode;
            }
            LMEPG.ajax.postAPI(params.path, params.postData,
                function (rsp) { // 网络请求成功
                    LMEPG.UI.dismissWaitingDialog();
                    e.BM.setKeyEventPause(false);
                    if (rsp.result == successCode) {// 接口调用成功
                        params.successCallback(rsp);
                    } else { // 接口调用失败
                        params.errorCallback(rsp.result);
                    }
                }, function () { // 网络请求失败
                    LMEPG.UI.dismissWaitingDialog();
                    e.BM.setKeyEventPause(false);
                }
            );
        }
    };

    LMActivity.Router = {

        /*重载当前界面*/
        reload: function () {
            // 页面加载中释放一切事件1
            LMEPG.UI.showWaitingDialog('', 2, function () {
                e.Intent.jump(LMActivity.Router.getCurrentPage());
            });
        },

        /*设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity-common-index');
        },

        /*进行订购跳转操作*/
        jumpBuyVip: function () {
            if (RenderParam.lmcid == '630092') {
                //数据探针上报  用户订购行为探针
                var dataRP = {
                    userId: RenderParam.userId,
                    pageKey: window.location.pathname,
                    pageType: 'activities',
                    actionType: 'bc',
                    mediaCode: r.activityName,
                    mediaName: document.title,
                    btnName: '确定',
                }
                DataReport.getValue(4, dataRP);
            }
            ;

            var objCurrent = LMActivity.Router.getCurrentPage();

            var objOrderHome = e.Intent.createIntent('orderHome');
            objOrderHome.setParam('directPay', '1');
            objOrderHome.setParam('orderReason', '101');
            objOrderHome.setParam('hasVerifyCode', '1');
            if (r.activityName == 'ActivityDemolitionExpress20200312') {
                objOrderHome.setParam('activityName', 'ActivityDemolitionExpress20200312');
            }

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
        getActivityTimes: function (name, callBack) {
            var postData = {"activityName": name};
            LMEPG.ajax.postAPI('NewActivity/getActivityTimes', postData, function (data) {
                if (data.result == 0) {
                    r.leftTimes = parseInt(data.leftTimes);
                    // G("left_times").innerHTML = "剩余次数：" + r.leftTimes;
                    LMEPG.call(callBack);
                } else {
                    LMEPG.UI.showToast("拉取活动次数失败");
                }
            });
        },
        getAssignCountdownInfo: function (name) {
            var postData = {};

            LMEPG.ajax.postAPI('NewActivity/assignCountdownInfo', postData, function (data) {

                r.keyCountdown = data.keyCountdown;
                r.valueCountdown = JSON.parse(data.valueCountdown);
                r.extraTimes = data.extraTimes;
                // } else {
                //     LMEPG.UI.showToast("拉取活动次数失败");
                // }
            });
        },
        getActivityId: function (name) {

            var postData = {"activityName": name};
            LMEPG.ajax.postAPI('NewActivity/getActivityId', postData, function (rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data.code == 0) {
                    LMEPG.UI.dismissWaitingDialog();
                    LMActivity.AjaxHandler.getAllUserPrizeList();
                    LMActivity.AjaxHandler.getMyPrizeList();
                    // r.lotteryRecordList = data;
                } else {
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("拉取活动id失败");
                }
            });
        },
        getAllUserPrizeList: function () {
            var postData = {};
            LMEPG.ajax.postAPI('NewActivity/getAllUserPrizeListByAjax', postData, function (data) {
                if (data.result == 0) {
                    r.lotteryRecordList = data;
                } else {
                    LMEPG.UI.showToast("拉取中将列表失败");
                }
            });
        },
        getMyPrizeList: function () {
            var postData = {};
            LMEPG.ajax.postAPI('NewActivity/getMyPrizeListByAjax', postData, function (rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data.result == 0) {
                    r.myLotteryRecord = data;
                } else {
                    LMEPG.UI.showToast("我的拉取中将列表失败");
                }
            });
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

        // lottery: function (successFn, errorFn) {
        //     if(typeof LMActivity.prizeId === "undefined"){
        //         var params = {
        //             postData: {},
        //             path: 'NewActivity/lottery'
        //         };
        //     }else{
        //         var params = {
        //             postData: {"prizeIdx":LMActivity.prizeId},
        //             path: 'NewActivity/lottery'
        //         };
        //     }
        //     params.successCode = 1;
        //     params.successCallback = successFn;
        //     params.errorCallback = errorFn;
        //     LMActivity.ajaxPost(params);
        // },

        lottery: function (successFn, errorFn) {
            if (typeof LMActivity.roundFlag === "undefined") {
                LMActivity.roundFlag = 1;
            }

            if (typeof LMActivity.prizeId === "undefined" || LMActivity.prizeId == "undefined") {
                var params = {
                    postData: {"roundFlag": LMActivity.roundFlag},
                    path: 'NewActivity/lottery'
                };
            } else {
                var params = {
                    postData: {"prizeIdx": LMActivity.prizeId, "roundFlag": LMActivity.roundFlag},
                    path: 'NewActivity/lottery'
                };
            }
            params.successCode = 1;
            params.successCallback = successFn;
            params.errorCallback = errorFn;
            LMActivity.ajaxPost(params);
            LMActivity.prizeId = "undefined";
        },
    };

    w.LMActivity = LMActivity;
    w.onBack = function () {
        if (LMActivity.shownModal) {
            if (r.isVip === '0' && r.valueCountdown.showDialog === '1' && $("order_vip").style.display == 'block') {
                LMActivity.showModal({
                    id: 'countdown',
                    onShowListener: function () {
                        LMActivity.startCountdown();
                    },
                    // onDismissListener: function () {
                    //     e.Intent.back();
                    // }
                })
            } else {
                // 如果存在挽留页计时器则清除
                if (typeof (LMActivity.playStatus) != 'undefined') {
                    clearInterval(LMActivity.countInterval);
                }

                if (LMActivity.playStatus) {
                    LMActivity.Router.reload();
                } else {
                    LMActivity.hideModal(LMActivity.shownModal);
                }
            }
        } else {
            LMActivity.exitActivity();
        }
    }
})(window, document, LMEPG, RenderParam);