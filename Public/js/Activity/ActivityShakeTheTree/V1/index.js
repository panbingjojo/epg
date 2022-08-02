window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
(function (win, doc, epg, TP, utils, LMKey) {

    var leftTimes = TP.leftTimes;
    var imgPrefix = TP.activityImg;
    var $ = function (id) {
        return doc.getElementById(id);
    };

    var Activity = {
        init: function () {
            this.diff();
            Activity.getVideo();
            this.checkPayAction();
            this.setLeftTimes(leftTimes);
            epg.BM.init('jump-game', this.buttons, true);
        },

        /*差异化处理*/
        diff: function () {
            var baseImgT = '450092';// V1为图片路径使用基础
            if (TP.lmcid === baseImgT) {
                var el = $('btn-pay-cancel');
                el.parentNode.removeChild(el);
            }
            // doc.body.style.backgroundImage = 'url(' + TP.activityImg + '/V640093/bg_home.png)';
            $('modal-rule').style.backgroundImage = 'url(' + imgPrefix + '/V' + TP.lmcid + '/m_rule.png)';
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
                            if (self.isSurePayModal) {
                                self.reload();
                            } else {
                                epg.Intent.back();
                            }
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
        randVideo: null,
        // ajax 拉取视频列表
        getVideo: function () {

            var postData = {
                'userId': TP.userId,
                'videoUserType': 2
            };
            LMEPG.ajax.postAPI('Player/getRecommendVideoInfo', postData, function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    if (data.result == 0) {
                        console.log(postData);
                        Activity.randVideo = data.data[0];
                        console.log(data, Activity.randVideo);
                    } else {
                        LMEPG.UI.showToast('视频加载失败[code=' + data.result + ']');
                    }
                } catch (e) {
                    LMEPG.UI.showToast('视频加载解析异常' + e.toString());
                }
            }, function (rsp) {
                LMEPG.UI.showToast('视频加载请求失败');
            });
        },
        /**
         * 跳转到视频播放页，播放结束时返回到首页
         * @param data 视频信息
         */
        jumpPlayVideo: function (data) {

            // 创建视频信息
            var videoObj = data.ftp_url instanceof Object ? data.ftp_url : JSON.parse(data.ftp_url);
            var videoUrl = TP.platformType == 'hd' ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

            var videoInfo = {
                'sourceId': data.source_id,
                'videoUrl': videoUrl,
                'title': data.title,
                'type': data.model_type,
                'userType': data.user_type,
                'freeSeconds': data.free_seconds,
                'entryType': 1,
                'entryTypeName': 'epg-home',
                'unionCode': data.union_code,
                'showStatus': 1
            };
            var objCurrent = Activity.getCurrentPage(); //得到当前页


            var objPlayer = LMEPG.Intent.createIntent('player');
            objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

            LMEPG.Intent.jump(objPlayer, objCurrent);
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
                case 'btn-uncompleted-sure':
                case 'btn-accomplish-cancel':
                    Activity.modal.hide();
                    break;
                // 去抽奖
                case 'go-lottery':
                    Activity.ajaxHandler.lottery();
                    break;
                // 消失弹框
                case 'go-again':
                    Activity.modal.hide();
                    $('p-add-score').innerHTML = 0;
                    break;
                // 支付确认
                case 'btn-pay-sure':
                    if (TP.lmcid === '450092') {
                        Activity.jumpPlayVideo(Activity.randVideo);
                    } else {
                        Activity.jumpBuyVip();
                    }
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
                    Activity.game.start();
                    break;
                // 显示中奖名单
                case 'jump-winner':
                    TP.beClickId = btn.id;
                    Activity.render.winnerListUI();
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

        /*设置支付成功/失败的图片显示*/
        setPayImageSrc: function (val) {
            Activity.modal.show('modal-pay', '', function () {
                doc.getElementById('pay-back-tip').src = TP.activityImg + val + '.png';
                setTimeout(function () {
                    Activity.modal.hide();
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


            /*抽奖ajax接口调用*/
            lottery: function (num) {
                var postData = {
                    'prizeIdx': Activity.game.lv().slice(-1)
                };
                utils.dialog.showWaiting();
                epg.BM.setKeyEventPause(true);
                epg.ajax.postAPI('Activity/participateActivity', postData,
                    function (data) {
                        console.log(data);
                        epg.BM.setKeyEventPause(false);
                        Activity.lotteryResult(data.result, data['unique_name']);
                    },
                    function (rsp) {
                        utils.dialog.showToast('抽奖发生错误', 3,
                            function () {
                                Activity.reload();
                            }
                        );
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
                    'Activity/setPhoneNumber',
                    {'phoneNumber': userTel},
                    function (rsp) {
                        try {
                            var data = rsp instanceof Object ? rsp : JSON.parse(
                                rsp);
                            var result = data.result;
                            TP.userTel = userTel;
                            utils.dialog.showToast('提交电话成功！', 1, Activity.reload);
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
            count = 0,
            gameCD = 10,
            randF = utils.getRandom,
            cdTimer = null,
            timeTamp0 = 0,
            cdEl = null;

        /**
         * 开始游戏
         */
        Game.start = function () {
            var timeTamp1 = new Date();
            if (timeTamp1 - timeTamp0 < 100) return;
            timeTamp0 = timeTamp1;
            var that = Game;
            !that.state && that.CD();
            score += randF(0, 2);
            that.state = true;
            that.updateFruitCount(score);
            that.setGameImg('btn_place.png');
        };

        /**
         * 更新果实数量
         */

        Game.updateFruitCount = function (score) {
            $('get-fruit').innerHTML = score;
        };

        /**
         * 设置开始按钮状态
         */
        Game.setGameImg = function () {
            var treeEl = $('tree');
            var btnGameStart = $('game-start');
            btnGameStart.src = imgPrefix + 'shake_f.gif';
            treeEl.src = imgPrefix + 'tree_f.gif';
            clearTimeout(Game.btnSwitchTimer);
            Game.btnSwitchTimer = setTimeout(function () {
                btnGameStart.src = imgPrefix + 'shake.png';
                treeEl.src = imgPrefix + 'tree.png';
            }, 500);
        };

        /**
         * 游戏CD
         */
        Game.CD = function () {
            cdEl = $('game-cd');
            (function rec() {
                gameCD--;
                cdEl.innerHTML = gameCD;
                cdTimer = setTimeout(rec, 1000);
                if (gameCD === 0) {
                    epg.BM.setKeyEventPause(true);
                    Game.over();
                }
            }());
        };

        /**
         * 游戏结束
         */
        Game.over = function () {
            epg.KEM.setAllowFlag(false); // 禁用点击
            var that = this;
            that.state = false;
            clearTimeout(cdTimer);
            that.setGameImg('btn_start.gif');
            utils.dialog.showWaiting(1, '', function () {
                Game.lv = score >= 10 && score < 20 ? ' get-lottery-3' : score >= 20 && score < 30 ? ' get-lottery-2' : score > 30 ? ' get-lottery-1' : ' get-lottery-faield';
                var focusId = Game.lv === ' get-lottery-faield' ? 'go-again' : 'go-lottery';
                var el = $('go-lottery');
                el = el ? el : $('go-again');
                el.id = focusId;
                $('p-add-score').innerHTML = score;
                $('modal-add-score').className = 'modal ' + Game.lv;
                Activity.modal.show('modal-add-score', focusId, that.resetGame);
                epg.BM.setKeyEventPause(false);
            });

        };

        /**
         * 初始化游戏
         */
        Game.resetGame = function () {
            score = 0;
            gameCD = 10;
            cdEl.innerHTML = gameCD + 's';
        };

        return {

            lv: function () {
                return Game.lv;
            },
            state: function () {
                return Game.state;
            },
            start: Game.start
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
            console.log(TP.AllUserPrizeList, TP.AllUserPrizeList.list);
            var allUserData = TP.AllUserPrizeList.list;
            var htm = '<marquee  id="all-marquee" scrollamount="5"  direction="up"><table id="all-table" class="marquee-table">';
            for (var i = 0; i < allUserData.length; i++) {
                htm += '<tr>'
                    + '<td class="winner-account">'
                    + that.formatAccount(allUserData[i]['user_account'])
                    + '<td class="winner-time">'
                    + that.formatDate(allUserData[i]['prize_dt'])
                    + '<td class="winner-prize">' + allUserData[i]['prize_name'];
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
                        + that.formatDate(myData[j]['prize_dt'])
                        + '<td class="winner-prize">' + myData[j]['prize_name'];
                }
            }

            $('my-list').innerHTML = myHtm;
            $('total-list').innerHTML = htm;
            $('rewrite-tel').innerHTML = TP.userTel || '请输入有效的电话';
            that.modal.show('modal-list', 'btn-list-submit');
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
        nextFocusUp: 'jump-back',
        backgroundImage: imgPrefix + 'jump_game.png',
        focusImage: imgPrefix + 'jump_game_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'jump-back',
        name: '按钮-返回',
        type: 'img',
        nextFocusDown: 'jump-game',
        nextFocusRight: 'jump-rule',
        backgroundImage: imgPrefix + 'jump_back.png',
        focusImage: imgPrefix + 'jump_back_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'btn-rule-close',
        name: '按钮-返回主界面',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_close.png',
        focusImage: imgPrefix + 'btn_close_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'jump-rule',
        name: '按钮-显示活动规则',
        type: 'img',
        nextFocusDown: 'jump-game',
        nextFocusLeft: 'jump-back',
        nextFocusRight: 'jump-winner',
        backgroundImage: imgPrefix + 'jump_rule.png',
        focusImage: imgPrefix + 'jump_rule_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'jump-winner',
        name: '按钮-显示中奖名单',
        type: 'img',
        nextFocusDown: 'jump-game',
        nextFocusLeft: 'jump-rule',
        backgroundImage: imgPrefix + 'jump_winner.png',
        focusImage: imgPrefix + 'jump_winner_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'btn-list-submit',
        name: '按钮-提交电话号码',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusRight: 'btn-list-cancel',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.gif',
        isAction: 'isListSubmit',
        click: Activity.eventHandler
    }, {
        id: 'btn-list-cancel',
        name: '按钮-取消提交电话/关闭中奖名单',
        type: 'img',
        nextFocusUp: 'rewrite-tel',
        nextFocusLeft: 'btn-list-submit',
        backgroundImage: imgPrefix + 'btn_cancel.png',
        focusImage: imgPrefix + 'btn_cancel_f.gif',
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
        focusImage: imgPrefix + 'btn_sure_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'btn-accomplish-submit',
        name: '按钮-完成游戏提交',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusRight: 'btn-accomplish-cancel',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.gif',
        isAction: '',
        click: Activity.eventHandler
    }, {
        id: 'btn-accomplish-cancel',
        name: '按钮-完成游戏取消',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusLeft: 'btn-accomplish-submit',
        backgroundImage: imgPrefix + 'btn_cancel.png',
        focusImage: imgPrefix + 'btn_cancel_f.gif',
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
        focusImage: imgPrefix + 'btn_sure_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'btn-pay-cancel',
        name: '按钮-取消支付',
        type: 'img',
        nextFocusLeft: 'btn-pay-sure',
        backgroundImage: imgPrefix + 'btn_cancel.png',
        focusImage: imgPrefix + 'btn_cancel_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'game-start',
        name: '开始游戏',
        type: 'div',
        backgroundImage: '',
        focusImage: imgPrefix + 'shake_bg.gif',
        click: Activity.eventHandler
    }, {
        id: 'btn-one-add',
        name: '',
        type: 'img',
        focusImage: imgPrefix + 'btn_one_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'go-lottery',
        name: '',
        type: 'img',
        focusImage: imgPrefix + 'lottery_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'go-again',
        name: '',
        type: 'img',
        focusImage: imgPrefix + 'btn_again_f.gif',
        click: Activity.eventHandler
    }, {
        id: 'btn-one0',
        name: '',
        type: 'img',
        backgroundImage: imgPrefix + 'btn_sure.png',
        focusImage: imgPrefix + 'btn_sure_f.gif',
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
