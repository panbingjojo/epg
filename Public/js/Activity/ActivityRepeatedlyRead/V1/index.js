window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
(function (win, doc, epg, TP, utils, LMKey) {
// (function (w, e, r, a) {

    var leftTimes = TP.leftTimes;
    var setExchangeList = TP.setExchangeList.data;
    var imgPrefix = TP.activityImg;
    var $ = function (id) {
        return doc.getElementById(id);
    };

    var Activity = {
        init: function () {
            this.diff();
            this.checkPayState();
            this.setLeftTimes(leftTimes);
            epg.BM.init('card-0', this.buttons, true);
        },

        /*差异化处理*/
        diff: function () {
            // var baseImgT = '450092';
            // if (TP.lmcid === baseImgT) return;
            if (TP.lmcid === '620092' || TP.lmcid === '000051' ){
                doc.body.style.backgroundImage = 'url(' + TP.activityImg + '/V'+TP.lmcid+'/bg_home.png)';
            }
            // doc.body.style.backgroundImage = 'url(' + TP.activityImg + '/V640093/bg_home.png)';
            // $('modal-rule').style.backgroundImage = 'url(' + imgPrefix + '/V' + TP.lmcid + '/m_rule.png)';
        },

        /*初始化剩余次数*/
        setLeftTimes: function (count) {
            $('times-count').innerText = '剩余次数：' + (count < 0 ? 0 : count);
            $('score-count').innerText = '茱萸：' + TP.score;
        },

        /*检查支付状态*/
        checkPayState: function () {
            if (TP.isOrderBack === '1') {
                var IdIndex = Activity.verifyUser.isPaySuccess()
                    ? 'pay-success'
                    : 'pay-failed';
                Activity.eventHandler({id: IdIndex});
            } else {
                Activity.render.renderTrueCard();
            }
        },

        /*返回*/
        jumpBack: function () {
            var self = Activity;
            clearTimeout(self.cdTimer);
            // 弹框存在，不是提示订购弹框
            if (self.modal.isModal && !self.isSurePayModal) {
                self.modal.hide();
            } else {
                // 提示8秒增加次数
                if (self.checkUserInfo()) {
                    // 普通用户触发了提示订购弹框，试玩次数还没有加
                    if (self.isSurePayModal && TP.cdCount !== '-1') {
                        self.reload();
                    } else {
                        if (self.isSurePayModal) {
                            self.reload();
                        } else {
                            epg.Intent.back();
                        }
                    }
                }
            }
        },

        /*首次进入鉴权倒计时功能*/
        checkUserInfo: function () {
            var self = Activity;
            if (TP.cdCount === '-1' || +TP.isVip || self.backState) return true;
            Activity.modal.show('modal-cd', '');
            self.modal.isModal = false;
            var cdCount = 8; // 倒计时8秒
            var cdElement = $('count-down');
            epg.BM.setKeyEventPause(true);
            (function cd() {
                if (cdCount >= 0) {
                    self.backState = true;
                    TP.cdCount = cdCount;
                    cdElement.innerHTML = cdCount--;
                    self.cdTimer = setTimeout(cd, 1000);
                } else {
                    clearTimeout(self.cdTimer);
                    self.ajaxHandler.storeCDToVerify(cdCount, function () {
                            self.ajaxHandler.addUserTimesUpdate(self.reload);
                        }
                    );
                }
            }());
            return false;
        },


        /*重载当前界面*/
        reload: function () {
            // 页面加载中释放一切事件
            epg.onEvent = 'release';
            utils.dialog.showWaiting(0.2, '', function () {
                epg.Intent.jump(Activity.getCurrentPage());
            });
        },

        /*设置当前页参数*/
        getCurrentPage: function () {
            return epg.Intent.createIntent('activity-common-guide');
        },

        /*校验游戏资格*/
        checkGameQualification: function (btn) {
            if (leftTimes > 0) {
                // 同步进行
                Activity.game.turnCard(btn.id);
            } else {
                if (this.verifyUser.isVip()) {
                    this.modal.show('modal-vip-notimes', 'btn-one0');
                } else {
                    this.isSurePayModal = true;
                    this.modal.show('modal-pay-notimes', 'btn-pay-sure');
                }
            }
        },

        /*上报游戏访问记录*/
        uploadUserPlayGame: function (fn) {
            if (+TP.extraTimes) {
                Activity.ajaxHandler.subExtraTimes(fn);
            } else {
                Activity.ajaxHandler.subCommonTimes(fn);
            }
        },

        /*进行订购跳转操作*/
        jumpBuyVip: function () {
            var objCurrent = Activity.getCurrentPage();

            var objOrderHome = epg.Intent.createIntent('orderHome');
            objOrderHome.setParam('directPay', '1');
            objOrderHome.setParam('orderReason', '101');
            objOrderHome.setParam('hasVerifyCode', '1');

            var objActivityGuide = Activity.getCurrentPage();
            objActivityGuide.setParam('isOrderBack', '1'); // 表示订购回来

            epg.Intent.jump(objOrderHome, objCurrent, epg.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
        },

        setPhoneNumber: function (btn) {
            var isAction = btn.isAction;
            var inputId = isAction === 'isListSubmit' ? 'rewrite-tel' : 'accomplish-tel';
            var userTel = $(inputId).innerText;

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

        /*兑换奖品*/
        exchangePrize: function (btn) {
            if (TP.exchangeRecords.data.list.length || Activity.isSureExchange) {
                LMUtils.dialog.showToast('你已经兑换过奖品了', 1);
            } else {
                Activity.ajaxHandler.requestExchangeAction(btn, Activity.setModalTipsByExchange);
            }
        },

        /*渲染兑换奖品成功界面*/
        renderSuccessExchangePage: function () {
            G('accomplish-tel').innerHTML = TP.userTel || '请输入有效的电话';
            Activity.modal.show('modal-accomplish', 'btn-accomplish-submit', utils.dialog.hide);
        },

        /*设置兑奖之后的弹框提示*/
        setModalTipsByExchange: function (ret) {

            switch (parseInt(ret.result)) {
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

        /*设置支付成功/失败的图片显示*/
        setPayImageSrc: function (val) {
            Activity.modal.show('modal-pay', '', function () {
                doc.getElementById('modal-pay').style.backgroundImage = 'url("' + imgPrefix + val + '.png")';
                setTimeout(function () {
                    Activity.modal.hide('', Activity.render.renderTrueCard);
                }, 3000);
            });
        },

        /**
         *抽奖结果
         * 2.背景切换为正常背景
         * 3.成功抽到奖品：鱼的效果切换为抽奖成功后的“龙”效果图 ：失败：失败的鱼效果
         * 4.显示抽到的奖品
         */
        lotteryResult: function (resultStatus, prizeId) {
            switch (resultStatus) {
                //没有抽中奖品
                case 0:
                    Activity.modal.show('modal-no-prize', '', Activity.reload);
                    break;
                //抽中奖品
                case 1:
                    utils.dialog.hide();
                    $('accomplish-tel').innerText = TP.userTel || '请输入有效电话';
                    $('accomplish-prize').src = TP.activityImg + '/V' + TP.lmcid + '/prize_' + prizeId + '.png';
                    Activity.modal.show('modal-accomplish', 'btn-accomplish-submit');
                    break;
                //其它
                default:
                    utils.dialog.showToast('没有抽到奖[' + resultStatus + ']', 1, Activity.reload);
                    break;
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

        /*事件综合处理（模拟事件，键盘事件）*/
        eventHandler: function (btn, hasFocus) {
            switch (btn.id) {
                // 退出活动
                case 'jump-back':
                    Activity.jumpBack();
                    break;
                // 模板消失
                case 'btn-one0':
                case 'btn-one-add':
                case 'btn-rule-close':
                case 'btn-list-cancel':
                case 'btn-uncompleted-sure':
                case 'btn-accomplish-cancel':
                    Activity.modal.hide();
                    break;
                // 支付确认
                case 'btn-pay-sure':
                    Activity.jumpBuyVip();
                    break;
                // 校验游戏资格
                case 'card-0':
                case 'card-1':
                case 'card-2':
                case 'card-3':
                case 'card-4':
                case 'card-5':
                    TP.beClickId = btn.id;
                    Activity.checkGameQualification(btn);
                    break;
                // 上传电话号码
                case 'btn-list-submit':
                case 'btn-accomplish-submit':
                    Activity.setPhoneNumber(btn);
                    break;
                // 支付失败
                case 'pay-failed':
                    Activity.setPayImageSrc('m_pay_failed');
                    break;
                // 支付成功
                case 'pay-success':
                    Activity.setPayImageSrc('m_pay_success');
                    break;
                // 显示活动规则
                case 'jump-rule':
                    TP.beClickId = btn.id;
                    // Activity.modal.show('modal-rule', 'btn-rule-close');
                    Activity.modal.show('modal-rule');
                    break;
                // 支付取消
                case 'btn-pay-cancel':
                    clearTimeout(Activity.cdTimer);
                    Activity.checkUserInfo() && Activity.modal.hide(true);
                    break;
                // 显示中奖名单
                case 'jump-winner':
                    TP.beClickId = btn.id;
                    Activity.render.winnerListUI();
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
                    Activity.exchangePrize(btn);
                    break;
                // 启动数字小键盘
                case 'rewrite-tel':
                case 'accomplish-tel':
                    var reC = TP.platformType === 'hd' ? '200px' : '150px';
                    hasFocus && LMKey.init({
                            action: 'tel',
                            top: reC,
                            left: '300px',
                            input: btn.id,
                            backFocus: btn.backFocusId,
                            resolution: TP.platformType
                        }
                    );
                    break;
            }
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
                if (prevModal) $(prevModal).style.display = 'none';
                if (currModal) $(currModal).style.display = 'block';
                Activity.modal.isModal = true;
                Activity.modal.prevModal = currModal;
                Activity.modal.isReload = focusId; // 当传递1的时候则隐藏的时候重载
                if (!focusId) {
                    epg.BM.setKeyEventPause(true);
                } else {
                    focusId === 'useReload'
                        ? Activity.reload()
                        : epg.BM.requestFocus(focusId);
                }
                typeof callback === 'function' && callback();
            },

            hide: function (bol, callback) {
                var modalId = Activity.modal.prevModal;
                if (modalId) {
                    $(modalId).style.display = 'none';
                    Activity.modal.isModal = false;
                    epg.BM.setKeyEventPause(false);
                    epg.BM.requestFocus(TP.beClickId);
                    if (Activity.modal.isReload === 1) {
                        epg.BM.setKeyEventPause(true);
                        Activity.reload();
                    }
                }
                typeof callback === 'function' && callback();
            }
        },

        /**验证对象*/
        verifyUser: {

            // 验证剩余游戏次数
            isHaveTimes: function () {
                return TP.leftTimes.leftTimes > 0;
            },

            // 验证是否VIP
            isVip: function () {
                return TP.isVip === '1';
            },

            // 验证是否首次进入
            isFirstEnter: function () {
                return !TP.firstEnter;
            },

            // 验证是否支付成功
            isPaySuccess: function () {
                return TP.cOrderResult === '1';
            }
        }
    };

    /**
     * ajax 集中处理对象
     * 调用网络请求
     * 通用错误提示
     *
     * */
    Activity.ajaxHandler = {

        /*消耗额外游戏次数*/
        subExtraTimes: function (callback) {
            utils.dialog.showWaiting();
            epg.ajax.postAPI(
                'Activity/subExtraActivityTimes',
                null,
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /*消耗通用游戏次数*/
        subCommonTimes: function (callback) {
            utils.dialog.showWaiting();
            epg.ajax.postAPI(
                'Activity/uploadUserJoin',
                null,
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /*保存弹框提示鉴别参数*/
        storeCDToVerify: function (num, callBack) {
            utils.dialog.showWaiting();
            var postData = {
                key: TP.activityInfo.list['unique_name'] + TP.userId,
                value: num
            };
            epg.ajax.postAPI(
                'Activity/saveStoreData',
                postData,
                callBack,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /*增加游戏次数*/
        addUserTimesUpdate: function (callBack) {
            utils.dialog.showWaiting();
            epg.ajax.postAPI(
                'Activity/addUserLotteryTimes',
                null,
                callBack,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /*保存用户电话号码*/
        submitUserTel: function (tel, callback) {
            utils.dialog.showWaiting();
            epg.ajax.postAPI(
                'Activity/setPhoneNumber',
                {'phoneNumber': tel, 'exchange': true},
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /*保存用户获得的材料*/
        storeUserScore: function (score, callback) {
            utils.dialog.showWaiting();
            epg.ajax.postAPI(
                'Activity/addUserScore',
                {score: score},
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /*获取保存的积分数据*/
        getUserScore: function (callback) {
            utils.dialog.showWaiting();
            epg.ajax.postAPI(
                'Activity/getUserScore',
                null,
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /*请求兑换奖品*/
        requestExchangeAction: function (btn, callback) {
            utils.dialog.showWaiting();
            epg.ajax.postAPI(
                'Activity/exchangePrize',
                {'goodsId': btn.goods_id},
                callback,
                Activity.ajaxHandler.errorNetwork
            );
        },

        /*获取所有兑换奖品列表*/
        getExchangePrizeListRecord: function (callback) {
            utils.dialog.showWaiting();
            epg.ajax.postAPI(
                'Activity/getExchangePrizeListRecord',
                '',
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
     * 游戏对象(查表算法)
     */
    Activity.game = {
        storeTurnCard: [],
        turnCard: function (btnId) {
            var cardImage = '';
            var num = btnId.slice(-1);
            var realCardIndex = this.realAry[num];
            if (realCardIndex === 'A') {
                cardImage = 'card_0.png';

            } else if (realCardIndex === 'B') {
                cardImage = 'card_1.png';
            } else if (realCardIndex === 'C') {
                cardImage = 'card_2.png';
            }
            $(btnId).src = imgPrefix + cardImage;
            this.storeTurnCard.push(realCardIndex);
            this.onceRound();
        },

        onceRound: function () {
            if (this.storeTurnCard.length === 2) {
                Activity.uploadUserPlayGame(utils.dialog.hide);
                if (this.storeTurnCard[0] === this.storeTurnCard[1]) {
                    this.addScore();
                } else {
                    setTimeout(function () {
                        Activity.modal.show('modal-lose-score', '', function () {
                            setTimeout(Activity.reload, 1500);
                        });
                    }, 2000);

                }
                this.storeTurnCard = [];
            }
        },

        addScore: function () {
            var score = 2; // 每次增加的分数
            $('p-add-score').innerHTML = score + ' 个';
            Activity.modal.show('modal-add-score', '',function () {
                Activity.ajaxHandler.storeUserScore(score, function () {
                    setTimeout(Activity.reload, 1000);
                });
            });

        }
    };

    /**
     * 渲染层
     */
    Activity.render = {

        renderFalseCard: function () {
            var htm = '';
            for (var i = 0; i < 6; i++) {
                htm += '<img id="card-' + i + '" src="' + imgPrefix + 'card.png">';
            }
            $('card-wrap').innerHTML = htm;
            epg.KEM.setAllowFlag(true);
            epg.BM.requestFocus('card-0');
        },

        renderTrueCard: function () {
            Activity.game.realAry = utils.shuffle(['A', 'A', 'B', 'B', 'C', 'C']);
            var htm = '';
            for (var i = 0, len = Activity.game.realAry.length; i < len; i++) {
                var cardImage = '';
                var item = Activity.game.realAry[i];
                if (item === 'A') {
                    cardImage = 'card_0.png';
                } else if (item === 'B') {
                    cardImage = 'card_1.png';
                } else if (item === 'C') {
                    cardImage = 'card_2.png';
                }
                htm += '<img id="card-' + i + '" src="' + imgPrefix + cardImage + '">';
            }
            $('card-wrap').innerHTML = htm;
            epg.KEM.setAllowFlag(false);
            setTimeout(Activity.render.renderFalseCard, 3000);
        },

        // 渲染中奖名单UI
        winnerListUI: function () {
            // 所有参与该活动的用户的中奖信息
            Activity.ajaxHandler.getExchangePrizeListRecord(function (data) {
                console.log(data);
                var allUserData = data['data']['all_list'];
                renderAllList(allUserData);
                renderMyList(allUserData);
                renderTelphone(TP.userTel);
                Activity.modal.show('modal-list', 'btn-list-submit', utils.dialog.hide);
            });

            function renderAllList(data) {
                var htm = '<marquee  id="all-marquee" scrollamount="5"  direction="up"><table id="all-table" class="marquee-table">';
                for (var i = 0; i < data.length; i++) {
                    htm += '<tr>'
                        + '<td class="winner-account">'
                        + Activity.formatAccount(data[i]['user_account'])
                        + '<td class="winner-time">'
                        + Activity.formatDate(data[i]['log_dt'])
                        + '<td class="winner-prize">' + data[i]['goods_name'];
                }
                htm += '</table></marquee>';
                $('total-list').innerHTML = htm;
            }

            function renderMyList(data) {
                // 当前登录用户中奖信息
                var myData = data;
                var myHtm = '<marquee  id="my-marquee" scrollamount="5"  direction="up"><table id="my-table" class="marquee-table">';
                for (var j = 0; j < myData.length; j++) {
                    if (myData[j]['user_account'] === TP.loginUserAccount) {
                        Activity.hasOwnPrized = true;
                        myHtm += '<tr>'
                            + '<td class="winner-account">'
                            + Activity.formatAccount(myData[j]['user_account'])
                            + '<td class="winner-time">'
                            + Activity.formatDate(myData[j]['log_dt'])
                            + '<td class="winner-prize">' + myData[j]['goods_name'];
                    }
                }
                $('my-list').innerHTML = myHtm;
            }

            function renderTelphone(tel) {
                $('rewrite-tel').innerHTML = tel || '请输入有效的电话';
            }
        },

        // 渲染兑换界面
        exchangeUI: function () {
            var htm = '<ul class="prize-list">';
            for (var i = 0; i < setExchangeList.length; i++) {
                htm += '<li class="prize-item">';
                htm += '<img src= "' + imgPrefix + 'V' + TP.lmcid + '/prize_' + (i + 1) + '.png">';
                htm += '<p>茱萸 X ' + setExchangeList[i]['consume_list'][0]['consume_count'] + '</p>';
                htm += '<img id="btn-exchange-' + i + '" src="' + imgPrefix + '/btn_exchange.png">';
                htm += '</li>';
            }

            htm += '</ul><p id="exchange-total-score">茱萸：' + TP.score + '</p>';
            $('modal-exchange').innerHTML = htm;
            Activity.modal.show('modal-exchange', 'btn-exchange-0');
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
        backgroundImage: imgPrefix + '',
        focusImage: imgPrefix + '',
        click: Activity.eventHandler
    }, {
        id: 'jump-back',
        name: '按钮-返回',
        type: 'img',
        nextFocusDown: 'jump-rule',
        nextFocusLeft: 'card-2',
        backgroundImage: imgPrefix + 'jump_back.png',
        focusImage: imgPrefix + 'jump_back_f.png',
        // click: LMActivity.exitActivity,
        click: Activity.jumpBack,
    }, {
        id: 'jump-rule',
        name: '按钮-显示活动规则',
        type: 'img',
        nextFocusUp: 'jump-back',
        nextFocusDown: 'jump-winner',
        nextFocusLeft: 'card-2',
        // backgroundImage: imgPrefix +'/V' + TP.lmcid + '/jump_rule.png',
        backgroundImage: imgPrefix +'jump_rule.png',
        focusImage: imgPrefix + 'jump_rule_f.png',
        click: Activity.eventHandler
    }, {
        id: 'jump-winner',
        name: '按钮-显示中奖名单',
        type: 'img',
        nextFocusUp: 'jump-rule',
        nextFocusDown: 'jump-exchange',
        nextFocusLeft: 'card-2',
        backgroundImage: imgPrefix + 'jump_winner.png',
        focusImage: imgPrefix + 'jump_winner_f.png',
        click: Activity.eventHandler
    }, {
        id: 'jump-exchange',
        name: '按钮-显示兑奖界面',
        type: 'img',
        nextFocusUp: 'jump-winner',
        nextFocusLeft: 'card-2',
        backgroundImage: imgPrefix + 'jump_exchange.png',
        focusImage: imgPrefix + 'jump_exchange_f.png',
        click: Activity.eventHandler
    }, {
        id: 'btn-rule-close',
        name: '按钮-返回主界面',
        type: 'div',
        backgroundImage: imgPrefix + 'btn_close.png',
        focusImage: imgPrefix + 'btn_close_f.png',
        click: Activity.eventHandler
    }, {
        id: 'btn-list-submit',
        name: '按钮-提交电话号码',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusRight: 'btn-list-cancel',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        isAction: 'isListSubmit',
        click: Activity.eventHandler
    }, {
        id: 'btn-list-cancel',
        name: '按钮-取消提交电话/关闭中奖名单',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusLeft: 'btn-list-submit',
        backgroundImage: imgPrefix + 'btn_cancel.png',
        focusImage: imgPrefix + 'btn_cancel_f.png',
        click: Activity.eventHandler
    }, {
        id: 'rewrite-tel',
        name: '输入框-从输入电话号码',
        type: 'img',
        backgroundImage: imgPrefix + '',
        focusImage: imgPrefix + '',
        focusChange: Activity.eventHandler,
        backFocusId: 'btn-list-submit'
    }, {
        id: 'btn-uncompleted-sure',
        name: '按钮-没有完成游戏“确认”',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        click: Activity.eventHandler
    }, {
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
        id: 'accomplish-tel',
        name: '完成游戏输入框',
        type: 'img',
        click: Activity.eventHandler,
        focusChange: Activity.eventHandler,
        backFocusId: 'btn-accomplish-submit'
    }, {
        id: 'btn-pay-sure',
        name: '按钮-确认支付',
        type: 'img',
        nextFocusRight: 'btn-pay-cancel',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        click: Activity.eventHandler
    }, {
        id: 'btn-pay-cancel',
        name: '按钮-取消支付',
        type: 'img',
        nextFocusLeft: 'btn-pay-sure',
        backgroundImage: imgPrefix + 'btn_cancel.png',
        focusImage: imgPrefix + 'btn_cancel_f.png',
        click: Activity.eventHandler
    }, {
        id: 'card-0',
        name: '翻卡牌',
        type: 'div',
        nextFocusDown: 'card-3',
        nextFocusLeft: 'card-5',
        nextFocusRight: 'card-1',
        backgroundImage: imgPrefix + 'card.png',
        focusImage: imgPrefix + 'card_f.png',
        click: Activity.eventHandler
    }, {
        id: 'card-1',
        name: '翻卡牌',
        type: 'div',
        nextFocusDown: 'card-4',
        nextFocusLeft: 'card-0',
        nextFocusRight: 'card-2',
        backgroundImage: imgPrefix + 'card.png',
        focusImage: imgPrefix + 'card_f.png',
        click: Activity.eventHandler
    }, {
        id: 'card-2',
        name: '翻卡牌',
        type: 'div',
        nextFocusDown: 'card-5',
        nextFocusLeft: 'card-1',
        nextFocusRight: 'jump-exchange',
        backgroundImage: imgPrefix + 'card.png',
        focusImage: imgPrefix + 'card_f.png',
        click: Activity.eventHandler
    }, {
        id: 'card-3',
        name: '翻卡牌',
        type: 'div',
        nextFocusUp: 'card-0',
        nextFocusLeft: 'card-2',
        nextFocusRight: 'card-4',
        backgroundImage: imgPrefix + 'card.png',
        focusImage: imgPrefix + 'card_f.png',
        click: Activity.eventHandler
    }, {
        id: 'card-4',
        name: '翻卡牌',
        type: 'div',
        nextFocusUp: 'card-1',
        nextFocusLeft: 'card-3',
        nextFocusRight: 'card-5',
        backgroundImage: imgPrefix + 'card.png',
        focusImage: imgPrefix + 'card_f.png',
        click: Activity.eventHandler
    }, {
        id: 'card-5',
        name: '翻卡牌',
        type: 'div',
        nextFocusUp: 'card-2',
        nextFocusLeft: 'card-4',
        nextFocusRight: 'jump-exchange',
        backgroundImage: imgPrefix + 'card.png',
        focusImage: imgPrefix + 'card_f.png',
        click: Activity.eventHandler
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
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-2',
        nextFocusRight: 'btn-exchange-1',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goods_id: setExchangeList[0].goods_id,
        click: Activity.eventHandler
    }, {
        id: 'btn-exchange-1',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-0',
        nextFocusRight: 'btn-exchange-2',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goods_id: setExchangeList[1].goods_id,
        click: Activity.eventHandler
    }, {
        id: 'btn-exchange-2',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-exchange-1',
        nextFocusRight: 'btn-exchange-0',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goods_id: setExchangeList[2].goods_id,
        click: Activity.eventHandler
    }, {
        id: '',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: '',
        nextFocusRight: '',
        backgroundImage: imgPrefix + '',
        focusImage: imgPrefix + '',
        click: Activity.eventHandler
    }];

    win.Activity = Activity;
    win.onBack = Activity.jumpBack;
}(window, document, LMEPG, RenderParam, LMUtils, LMKey));
