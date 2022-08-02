window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
(function (win, doc, epg, TP, utils, LMKey) {

    var setExchangeList = TP.setExchangeList.data;
    var leftTimes = parseInt(TP.leftTimes);
    var imgPrefix = TP.activityImg;
    var $ = function (id) {
        return doc.getElementById(id);
    };

    var Activity = {
        init: function () {
            this.diff();
            this.checkPayAction();
            this.setLeftTimes(leftTimes);
            epg.BM.init('jump-game', this.buttons, true);
        },

        /*差异化处理*/
        diff: function () {
            // var baseImgT = '630092';// V1为图片路径使用基础
            // if (TP.lmcid === baseImgT) return;
            // doc.body.style.backgroundImage = 'url(' + TP.imgDiffPrefix + 'bg_home.png)';
            // $('modal-rule').style.backgroundImage = 'url(' + TP.imgDiffPrefix + 'm_rule.png)';
            // $('modal-exchange').style.backgroundImage = 'url(' + TP.imgDiffPrefix + 'm_exchange.png)';
        },

        /*初始化剩余次数*/
        setLeftTimes: function (count) {
            $('times-count').innerHTML = count < 0 ? 0 : count;
        },

        /*检查支付状态*/
        checkPayAction: function () {
            if (TP.isOrderBack === '1') {
                var IdIndex = Activity.verifyUser.isPayState()
                    ? 'pay-success'
                    : 'pay-failed';
                Activity.eventHandler({id: IdIndex});
            }
        },

        /*返回*/
        jumpBack: function () {
            var self = Activity;
            clearTimeout(self.cdTimer);
            // 游戏中不允许退出
            if (!self.game.state()) {
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


        /*校验游戏资格*/
        checkQualification: function () {

            if (leftTimes > 0) {
                if (+TP.extraTimes) {
                    this.modal.show('modal-game', 'game-start', this.ajaxHandler.subTimes);
                } else {
                    this.modal.show('modal-game', 'game-start', this.ajaxHandler.uploadLeftTimes);
                }
            } else {
                if (this.verifyUser.isVip()) {
                    this.modal.show('modal-vip-notimes', 'btn-one0');
                } else {
                    this.isSurePayModal = true;
                    this.modal.show('modal-pay-notimes', 'btn-pay-sure');
                }
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
                case 'btn-close-exchange':
                case 'btn-uncompleted-sure':
                case 'btn-accomplish-cancel':
                    Activity.modal.hide();
                    break;
                // 支付确认
                case 'btn-pay-sure':
                    Activity.jumpBuyVip();
                    break;
                // 校验游戏资格
                case 'jump-game':
                    TP.beClickId = btn.id;
                    Activity.checkQualification();
                    break;
                // 上传电话号码
                case 'btn-list-submit':
                case 'btn-accomplish-submit':
                    Activity.ajaxHandler.setPhoneNumber(btn);
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
                    Activity.modal.show('modal-rule', 'btn-rule-close');
                    break;
                // 支付取消
                case 'btn-pay-cancel':
                    clearTimeout(Activity.cdTimer);
                    Activity.checkUserInfo() && Activity.modal.hide(true);
                    break;
                // 开始游戏
                case 'game-start':
                    if (Activity.game.state()) {
                        Activity.game.putDownCake();
                    } else {
                        Activity.game.start();
                    }
                    break;
                // 显示中奖名单
                case 'jump-winner':
                    TP.beClickId = btn.id;
                    Activity.ajaxHandler.getExchangePrizeListRecord();
                    break;
                // 显示兑换界面
                case 'jump-exchange':
                    TP.beClickId = btn.id;
                    Activity.ajaxHandler.getUserScore();
                    break;
                // 执行兑换
                case 'btn-exchange_0':
                case 'btn-exchange_1':
                case 'btn-exchange_2':
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

        /*兑换过奖品*/
        exchangePrize: function (btn) {
            if (TP.exchangeRecords.data.list.length || Activity.isSureExchange) {
                utils.dialog.showToast('你已经兑换过奖品了哦~', 1);
            } else {
                Activity.ajaxHandler.requestExchangeAction(btn);
            }
        },

        /*设置支付成功/失败的图片显示*/
        setPayImageSrc: function (val) {
            Activity.modal.show('modal-pay', '', function () {
                doc.getElementById('pay-back-tip').src = TP.activityImg + val + '.png';
                setTimeout(function () {
                    Activity.modal.hide();
                }, 3000);
            });
        },


        /*渲染兑换奖品成功界面*/
        renderSuccessExchangePage: function () {
            $('accomplish-tel').innerHTML = TP.userTel || '请输入有效的电话';
            Activity.modal.show('modal-accomplish', 'btn-accomplish-submit');
            utils.dialog.hide();
        },

        /*设置兑奖之后的弹框提示*/
        setModalTipsByExchange: function (code) {

            switch (parseInt(code)) {
                // 成功兑换
                case 0:
                    Activity.isSureExchange = true;
                    Activity.renderSuccessExchangePage();
                    break;
                // 材料不足
                case -102 :
                    utils.dialog.showToast('积分不足，还不能兑换哦~', 1.5);
                    break;
                // 超出可兑换数量
                case -100:
                    utils.dialog.showToast('超出可兑换数量了，不能兑换哦~', 1.5);
                    break;
                // 库存不足/其他情况
                default:
                    utils.dialog.showToast('真遗憾，奖品库存不足了~', 2);
                    break;
            }
        },

        /**ajax 集中处理对象*/
        ajaxHandler: {
            canAnswer: function (fn) {
                utils.dialog.showWaiting();
                epg.ajax.postAPI(
                    'Activity/uploadUserJoin',
                    null,
                    function (rsp) {
                        var data = rsp;
                        if (data.result === 0) {
                            console.log(data, 'jyyxzg');
                            fn.call(Activity, rsp);
                            utils.dialog.hide();
                        } else {
                            console.log(rsp);
                            utils.dialog.showToast('请求试玩发生错误！', 1);
                        }
                    },
                    function (rsp) {
                        utils.dialog.showToast('请求试玩发生错误！', 1);
                        console.log(rsp);
                    }
                );
            },

            /*减掉游戏次数*/
            subTimes: function () {
                utils.dialog.showWaiting();
                epg.ajax.postAPI('Activity/subExtraActivityTimes', null,
                    function (rsp) {
                        console.log('sub==>' + rsp);
                        TP.extraTimes = 0;
                        Activity.setLeftTimes(--leftTimes);
                        utils.dialog.hide();
                    },
                    function () {
                        utils.dialog.showToast('结果发生错误！', 2);
                    }
                );
            },

            uploadLeftTimes: function () {
                utils.dialog.showWaiting();
                epg.ajax.postAPI(
                    'Activity/uploadUserJoin',
                    null,
                    function (rsp) {
                        var data = rsp;
                        if (data.result === 0) {
                            console.log(data, 'jyyxzg');
                            leftTimes = data.leftTimes;
                            Activity.setLeftTimes(data.leftTimes);
                            utils.dialog.hide();
                        } else {
                            console.log(rsp);
                            utils.dialog.showToast('请求试玩发生错误！', 1);
                        }
                    },
                    function (rsp) {
                        utils.dialog.showToast('请求试玩发生错误！', 1);
                        console.log(rsp);
                    }
                );
            },

            /*保存弹框提示鉴别参数*/
            storeCDToVerify: function (num, callBack) {
                utils.dialog.showWaiting();
                var postData = {
                    key: TP.activityInfo.list['unique_name'] + TP.userId,
                    value: num
                };
                console.log(postData);
                epg.ajax.postAPI('Activity/saveStoreData', postData,
                    function (rsp) {

                        console.log('saveCDCount==>' + rsp);
                        callBack();
                        utils.dialog.hide();
                    },
                    function () {
                        utils.dialog.showToast('结果发生错误！', 2);
                    }
                );
            },

            /*增加游戏次数*/
            addUserTimesUpdate: function (callBack) {
                utils.dialog.showWaiting();
                epg.ajax.postAPI('Activity/addUserLotteryTimes', null,
                    function (rsp) {
                        console.log('addTimes==>' + rsp);
                        callBack();
                    },
                    function () {
                        utils.dialog.showToast('结果发生错误！', 2);
                    }
                );
            },

            /*保存用户获得的材料*/
            storeUserScore: function (score, callback) {

                utils.dialog.showWaiting();
                epg.ajax.postAPI(
                    'Activity/addUserScore',
                    {score: score},
                    function () {
                        $('p-add-score').innerHTML = score || 0;
                        Activity.modal.show('modal-add-score', 'btn-one-add', callback);
                        // Activity.ajaxHandler.getUserScore(1);
                        utils.dialog.hide();
                    },
                    function (rsp) {
                        utils.dialog.showToast('保存失败' + rsp, 3);
                    }
                );
            },

            /*获取保存的积分数据*/
            getUserScore: function (state) {

                utils.dialog.showWaiting();

                epg.ajax.postAPI(
                    'Activity/getUserScore',
                    null,
                    function (rsp) {
                        console.log(rsp);
                        !state && Activity.render.exchangeUI(rsp);
                        // $('total-score').innerHTML = rsp || 0;
                    },
                    function () {
                        utils.dialog.showToast('查询失败！', 3);
                    }
                );
            },

            /*请求兑换奖品*/
            requestExchangeAction: function (btn) {

                utils.dialog.showWaiting();

                epg.ajax.postAPI(
                    'Activity/exchangePrize',
                    {'goodsId': btn.goods_id},
                    function (rsp) {
                        console.log(rsp);
                        Activity.setModalTipsByExchange(rsp.result);
                    },
                    function () {
                        utils.dialog.showToast('兑换奖品异常！', 3);
                    }
                );
            },

            /*获取所有兑换奖品列表*/
            getExchangePrizeListRecord: function () {

                utils.dialog.showWaiting();

                epg.ajax.postAPI(
                    'Activity/getExchangePrizeListRecord',
                    '',
                    function (rsp) {
                        console.log(rsp);
                        if (rsp.result === 0) {
                            Activity.render.winnerListUI(rsp.data['all_list']);
                        } else {
                            utils.dialog.showToast('获取兑换奖品失败！', 2);
                        }
                    },
                    function () {
                        utils.dialog.showToast('获取兑换奖品异常！', 3);
                    }
                );
            },

            /*保存用户电话号码*/
            setPhoneNumber: function (btn) {

                utils.dialog.showWaiting();

                var isAction = btn.isAction;
                var currentTelId = isAction === 'isListSubmit' ? 'rewrite-tel' : 'accomplish-tel';
                var userTel = $(currentTelId).innerText;

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

                epg.ajax.postAPI(
                    'Activity/setPhoneNumberForExchange',
                    {'phoneNumber': userTel},
                    function (rsp) {
                        try {
                            var data = rsp instanceof Object ? rsp : JSON.parse(
                                rsp);
                            var result = data.result;
                            if (result === 0) {
                                TP.userTel = userTel;
                                utils.dialog.showToast('提交电话成功！', 1);
                            } else {
                                utils.dialog.showToast('存储失败！', 2);
                            }
                            Activity.modal.hide();
                        } catch (e) {
                            utils.dialog.showToast('提交失败，请重试！', 2);
                            epg.Log.error(e.toString());
                            console.log(e);
                        }
                    },
                    function () {
                        utils.dialog.showToast('请求保存手机号发生错误！', 3, Activity.reload());
                    }
                );
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
                var prevModal = this.prevModal;
                if (prevModal) $(prevModal).style.display = 'none';
                if (currModal) $(currModal).style.display = 'block';
                this.isModal = true;
                this.prevModal = currModal;
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
                var modalId = this.prevModal;
                if (modalId) {
                    $(modalId).style.display = 'none';
                    this.isModal = false;
                    epg.BM.setKeyEventPause(false);
                    epg.BM.requestFocus(TP.beClickId);
                    if (this.isReload) {
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
            isPayState: function () {
                return TP.cOrderResult === '1';
            }
        }
    };

    /**
     * 游戏对象(查表算法)
     */
    Activity.game = (function () {
        var Game = {},
            score = 0,
            gameCD = 30,
            cakeViewH = [12, 18, 28, 35, 45, 54, 60, 62, 71, 80],// 月饼视线高度值
            //cakeRealH = [27, 42, 60, 80, 100, 120, 135, 144, 161, 180], // 月饼实际高度
            cakeOffsetY = [138, 146, 153, 164, 181, 207, 247, 296, 345, 397], // 月饼距离顶部偏移值
            idNumber = 10,
            randF = utils.getRandom,
            curr_rand_src_n = 0,
            prev_rand_src_n = 10,
            storeFallCakeEl = [],
            storeGetCakeImg = [],
            createCakeTimer = null,
            fallCakeTimer = null,
            cdTimer = null,
            cdEl = null;

        /**
         * 开始游戏
         */
        Game.start = function () {
            var that = Game;
            that.setPlayBtnStatus('btn_place.png');
            that.CD();
            that.state = true;
            that.cakeFall();
        };

        /**
         * 设置开始按钮状态
         * @param str
         */
        Game.setPlayBtnStatus = function (str) {
            $('game-start').src = imgPrefix + str;
        };

        /**
         * 月饼落下
         */
        Game.cakeFall = function () {
            idNumber--;
            var currCakeId = 'c_' + idNumber;
            var cakeEl = $(currCakeId);
            this.randomImg(cakeEl);
            var count = -100;
            (function loop() {
                count += 5;
                cakeEl.style.top = count + 'px';
                fallCakeTimer = setTimeout(loop, 20);
                if (count >= cakeOffsetY[idNumber]) {
                    score += 3;
                    clearTimeout(fallCakeTimer);
                    clearTimeout(createCakeTimer);
                    storeFallCakeEl.push(cakeEl);
                    storeGetCakeImg.push(curr_rand_src_n); // 存储已经出现的月饼
                    Game.mayStop(cakeEl, idNumber);
                }
            }());
        };

        /**
         * 轮询月饼图片
         * @param cakeEl
         */
        Game.randomImg = function (cakeEl) {
            if (cakeEl) {
                (function loop() {
                    curr_rand_src_n = Game.filterCakeImg();
                    cakeEl.src = imgPrefix + 'c_' + curr_rand_src_n + '.png';
                    createCakeTimer = setTimeout(loop, 500);
                }());
            } else {
                Game.over();
            }
        };

        /**
         * 过滤出现过的月饼
         */
        Game.filterCakeImg = function () {
            var arr = storeGetCakeImg;
            var len = arr.length;
            while (len < 10) {
                var r = randF(0, 9);
                if (arr.indexOf(r) === -1) return r;
            }
        };

        /**
         * 放置月饼
         */
        Game.putDownCake = function () {
            clearTimeout(createCakeTimer);
        };

        /**
         * 放置的月饼形状(上大下细)不正确终止游戏
         */
        Game.mayStop = function (cakeEl, idNumber) {
            // 当前形状要小于上一个的形状才可继续，否则结束游戏
            if (prev_rand_src_n > curr_rand_src_n) {
                if (idNumber - curr_rand_src_n >= 3) {
                    Game.closeToPrevCake(cakeEl, idNumber);
                }
                prev_rand_src_n = curr_rand_src_n;
                Game.cakeFall();
            } else {
                Game.over();
            }
        };

        /**
         * 上一个月饼和下一个月饼空隙太大处理尽量靠近
         */
        Game.closeToPrevCake = function (cakeEl, idNumber) {
            if (idNumber === 9) return; // 第一个返回
            var pEl = $('c_' + (idNumber + 1));
            var c_Hv = cakeViewH[curr_rand_src_n];
            var p_Y = pEl.offsetTop;
            // Yc = p_Y - c_Hv;(前一个偏移值-当前视口高度值)
            cakeEl.style.top = p_Y - c_Hv + 'px';
        };

        /**
         * 游戏CD
         */
        Game.CD = function () {
            cdEl = $('game-cd');
            (function rec() {
                gameCD--;
                cdEl.innerHTML = gameCD + 's';
                cdTimer = setTimeout(rec, 1000);
                if (gameCD === 0) {
                    Game.over();
                }
            }());
        };

        /**
         * 游戏结束
         */
        Game.over = function () {
            var that = this;
            that.state = false;
            clearTimeout(cdTimer);
            clearTimeout(fallCakeTimer);
            clearTimeout(createCakeTimer);
            that.setPlayBtnStatus('btn_start.gif');
            utils.dialog.showToast('game over!', 2, function () {
                Activity.ajaxHandler.storeUserScore(score, that.resetGame);
            });
        };

        /**
         * 初始化游戏
         */
        Game.resetGame = function () {
            var i = storeFallCakeEl.length;
            while (i--) {
                storeFallCakeEl[i].src = '';
            }
            score = 0;
            gameCD = 30;
            idNumber = 10;
            curr_rand_src_n = 0;
            prev_rand_src_n = 10;
            storeFallCakeEl = [];
            storeGetCakeImg = [];
            cdEl.innerHTML = gameCD + 's';
        };

        return {
            state: function () {
                return Game.state;
            },
            start: Game.start,
            putDownCake: Game.putDownCake
        };
    }());

    /**
     * 渲染层
     */
    Activity.render = {

        /*渲染中奖名单UI*/
        winnerListUI: function (data) {
            // 所有参与该活动的用户的中奖信息
            var that = Activity;
            var allUserData = data;
            var htm = '<marquee  id="all-marquee" scrollamount="5"  direction="up"><table id="all-table" class="marquee-table">';
            for (var i = 0; i < allUserData.length; i++) {
                htm += '<tr>'
                    + '<td class="winner-account">'
                    + that.formatAccount(allUserData[i]['user_account'])
                    + '<td class="winner-time">'
                    + that.formatDate(allUserData[i]['log_dt'])
                    + '<td class="winner-prize">' + allUserData[i]['goods_name'];
            }
            htm += '</table></marquee>';

            // 当前登录用户中奖信息
            var myData = allUserData;
            var myHtm = '<marquee  id="my-marquee" scrollamount="5"  direction="up"><table id="my-table" class="marquee-table">';
            for (var j = 0; j < myData.length; j++) {
                if (myData[j]['user_account'] === TP.loginUserAccount) {
                    that.hasOwnPrized = true;
                    myHtm += '<tr>'
                        + '<td class="winner-account">'
                        + that.formatAccount(myData[j]['user_account'])
                        + '<td class="winner-time">'
                        + that.formatDate(myData[j]['log_dt'])
                        + '<td class="winner-prize">' + myData[j]['goods_name'];
                }
            }

            $('my-list').innerHTML = myHtm;
            $('total-list').innerHTML = htm;
            $('rewrite-tel').innerHTML = TP.userTel || '请输入有效的电话';
            that.modal.show('modal-list', 'btn-list-submit');
            utils.dialog.hide();
        },

        /*渲染兑换UI*/
        exchangeUI: function (data) {
            var htm = '';
            var userScore = data;
            var exchangeConsume = TP.setExchangeList.data;
            htm += '<img id="btn-close-exchange" src= "' + TP.activityImg + 'jump_back.png">'
                + '<p class="exchange-user-score">x' + (userScore || 0) + '</p>'
                + '<div class="require-score-wrap">'
                + '<span class="require-0">x' + exchangeConsume[0]['consume_list'][0]['consume_count'] + '</span>'
                + '<span class="require-1">x' + exchangeConsume[1]['consume_list'][0]['consume_count'] + '</span>'
                + '<span class="require-2">x' + exchangeConsume[2]['consume_list'][0]['consume_count'] + '</span>'
                + '</div>';

            $('data-exchange').innerHTML = htm;
            Activity.modal.show('modal-exchange', 'btn-exchange_0');
            utils.dialog.hide();
        }
    };

    /**
     * 活动虚拟按钮
     * @type {*[]}
     */
    Activity.buttons = [{
        id: 'jump-game',
        name: '首页-开始对决',
        type: 'img',
        nextFocusUp: 'jump-exchange',
        nextFocusRight: 'jump-exchange',
        backgroundImage: imgPrefix + 'jump_game.png',
        focusImage: imgPrefix + 'jump_game_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'jump-back',
        name: '按钮-返回',
        type: 'img',
        nextFocusDown: 'jump-rule',
        nextFocusLeft: 'jump-game',
        backgroundImage: imgPrefix + 'jump_back.png',
        focusImage: imgPrefix + 'jump_back_f.png',
        click: Activity.eventHandler
    }, {
        id: 'jump-rule',
        name: '按钮-显示活动规则',
        type: 'img',
        nextFocusUp: 'jump-back',
        nextFocusDown: 'jump-winner',
        nextFocusLeft: 'jump-game',
        backgroundImage: imgPrefix + 'jump_rule.png',
        focusImage: imgPrefix + 'jump_rule_f.png',
        click: Activity.eventHandler
    }, {
        id: 'jump-winner',
        name: '按钮-显示中奖名单',
        type: 'img',
        nextFocusUp: 'jump-rule',
        nextFocusDown: 'jump-exchange',
        nextFocusLeft: 'jump-game',
        backgroundImage: imgPrefix + 'jump_winner.png',
        focusImage: imgPrefix + 'jump_winner_f.png',
        click: Activity.eventHandler
    }, {
        id: 'jump-exchange',
        name: '按钮-显示中奖名单',
        type: 'img',
        nextFocusUp: 'jump-winner',
        nextFocusLeft: 'jump-game',
        nextFocusDown: 'jump-game',
        backgroundImage: imgPrefix + 'jump_exchange.png',
        focusImage: imgPrefix + 'jump_exchange_f.png',
        click: Activity.eventHandler
    }, {
        id: 'btn-rule-close',
        name: '按钮-返回主界面',
        type: 'img',
        backgroundImage: imgPrefix + 'jump_back.png',
        focusImage: imgPrefix + 'jump_back_f.png',
        click: Activity.eventHandler
    }, {
        id: 'btn-list-submit',
        name: '按钮-提交电话号码',
        type: 'img',
        nextFocusLeft: 'rewrite-tel',
        nextFocusRight: 'btn-list-cancel',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        isAction: 'isListSubmit',
        click: Activity.eventHandler
    }, {
        id: 'btn-list-cancel',
        name: '按钮-取消提交电话/关闭中奖名单',
        type: 'img',
        // nextFocusUp: 'rewrite-tel',
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
        id: 'debug',
        name: '脚手架ID',
        type: 'img',
        backgroundImage: imgPrefix + '',
        focusImage: imgPrefix + '',
        click: Activity.eventHandler
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
        id: 'btn-exchange_0',
        name: '',
        type: 'img',
        nextFocusUp: 'btn-close-exchange',
        nextFocusLeft: 'btn-exchange_2',
        nextFocusRight: 'btn-exchange_1',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goods_id: setExchangeList[0].goods_id,
        click: Activity.eventHandler,
        idx: 1
    }, {
        id: 'btn-exchange_1',
        name: '',
        type: 'img',
        nextFocusUp: 'btn-close-exchange',
        nextFocusLeft: 'btn-exchange_0',
        nextFocusRight: 'btn-exchange_2',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goods_id: setExchangeList[1].goods_id,
        click: Activity.eventHandler,
        idx: 2
    }, {
        id: 'btn-exchange_2',
        name: '',
        type: 'img',
        nextFocusUp: 'btn-close-exchange',
        nextFocusRight: 'btn-exchange_0',
        nextFocusLeft: 'btn-exchange_1',
        backgroundImage: imgPrefix + 'btn_exchange.png',
        focusImage: imgPrefix + 'btn_exchange_f.png',
        goods_id: setExchangeList[2].goods_id,
        click: Activity.eventHandler,
        idx: 3
    }, {
        id: 'btn-close-exchange',
        name: '关闭兑换界面',
        type: 'img',
        nextFocusDown: 'btn-exchange_2',
        backgroundImage: imgPrefix + 'jump_back.png',
        focusImage: imgPrefix + 'jump_back_f.png',
        click: Activity.eventHandler
    }, {
        id: 'game-start',
        name: '开始游戏',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_start.gif',
        focusImage: imgPrefix + 'btn_start.gif',
        click: Activity.eventHandler
    }, {
        id: 'cake-wrap',
        name: '',
        type: 'others'
    }, {
        id: 'btn-one-add',
        name: '',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
        click: Activity.eventHandler
    }, {
        id: 'btn-one0',
        name: '',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.png',
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

// eslint-disable-next-line no-undef
}(window, document, LMEPG, RenderParam, LMUtils, LMKey));
