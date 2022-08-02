window.isPreventDefault = false; // 启用浏览器默认按键功能（方便调试）
(function (win, doc, epg, TP) {

    var bgTimer = null;  // 游戏背景循环时间控制
    var obsTimer = null;
    var gameCDTimer = null;
    var setExchangeList = TP.setExchangeList ? TP.setExchangeList.data : null;
    var leftTimes = TP.leftTimes;
    var personEl;
    var gameInner;
    var Activity = {

        init: function () {
            this.diff();
            this.createBtns();
            this.checkPayAction();
            this.setLeftTimes(leftTimes);
            epg.BM.init('jump-game', this.buttons, true);
            personEl = G('person');
            gameInner = G('modal-game');
        },

        /*差异化处理*/
        diff: function () {
            // var baseImgT = '000051';// V1为图片路径使用基础
            // if (TP.lmcid == baseImgT) return;
            doc.body.style.backgroundImage = 'url(' + TP.imgDiffPrefix + 'bg_home.png)';
            G('modal-rule').style.backgroundImage = 'url(' + TP.imgDiffPrefix + 'm_rule.png)';
            G('modal-exchange').style.backgroundImage = 'url(' + TP.imgDiffPrefix + 'm_exchange.png)';
        },

        /*初始化剩余次数*/
        setLeftTimes: function (count, state) {
            G('times-count').innerHTML = count;
        },

        /*检查支付状态*/
        checkPayAction: function () {
            if (TP.isOrderBack == '1') {
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
            if (Activity.animate.isStart) {
                return; // 执行完游戏
            } else if (self.modal.isModal && !Activity.isSurePayModal) {// 弹框存在，不是提示订购弹框
                self.modal.hide();
            } else {
                if (self.checkUserInfo()) {
                    // 普通用户触发了提示订购弹框，试玩次数还没有加
                    if (Activity.isSurePayModal) {
                        self.reload();
                    } else {
                        epg.Intent.back();
                    }
                }
            }
        },

        /*首次进入鉴权倒计时功能*/
        checkUserInfo: function () {
            var self = Activity;
            if (TP.cdCount == '-1' || +TP.isVip || self.backState) return true;
            Activity.modal.show('modal-cd', '');
            self.modal.isModal = false;
            var cdCount = 8; // 倒计时8秒
            var cdElement = G('count-down');
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
            LMUtils.dialog.showWaiting(0.2, '', function () {
                epg.Intent.jump(Activity.getCurrentPage());
            });
        },

        /*设置当前页参数*/
        getCurrentPage: function () {
            var objCurrent = epg.Intent.createIntent('activity-common-guide');
            return objCurrent;
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
        /**
         * 播放视频
         * @param videoInfo
         */
        jumpPlayVideo: function (videoInfo) {
            var objCurrent = this.getCurrentPage();
            var objPlayer = epg.Intent.createIntent("player");
            objPlayer.setParam("userId", "{$userId}");
            objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

            epg.Intent.jump(objPlayer, objCurrent);
        },
        /**
         * 点击视频
         */
        clickVideo: function () {
            // 视频名称：哪些因素会影响孩子长高？
            var videoUrlObj = {
                bq_ftp_url: "99100000012019122711455506855986",
                gq_ftp_url: "99100000012019122711314706850694"
            };
            var videoUrl = (TP.platformType == "hd" ? videoUrlObj.gq_ftp_url : videoUrlObj.bq_ftp_url);
            var videoInfo = {
                "sourceId": "11841",
                "videoUrl": videoUrl,
                "title": "哪些因素会影响孩子长高？",
                "type": "4",
                "freeSeconds": "30",
                "userType": "2",
                "entryType": 3,
                "entryTypeName": "开学季",
                'showStatus': 1
            };
            Activity.jumpPlayVideo(videoInfo);
        },

        /*校验游戏资格*/
        checkQualification: function (data) {
            if (+leftTimes) {
                S('warn-tips');
                S('game-start');
                Activity.modal.show('modal-game', 'game-start', Activity.ajaxHandler.uploadLeftTimes);
            } else {
                if (this.verifyUser.isVip()) {
                    this.modal.show('modal-vip-notimes', 'btn-one0');
                } else {
                    //广西电信比较特殊，没有游戏次数跳转到视频播放页
                    switch (RenderParam.lmcid) {
                        case '450092':
                            this.modal.show('modal-notimes-jump-to-video', 'btn-play-video-sure');
                            break;
                        default:
                            Activity.isSurePayModal = true;
                            this.modal.show('modal-pay-notimes', 'btn-pay-sure');
                    }
                }
            }
        },


        animate: {
            CD: 0,
            score: 0,
            currObs: '', //当前的障碍物元素

            minX: 450,
            maxX: 730,
            minY: 340,
            maxY: 720,

            obsTop: '', // 障碍物top
            obsLeft: '', // 障碍物left
            obsHeight: '', // 障碍物height
            obsOffsetX: '', // 障碍物偏移值 left + width

            penLeft: '', // 人物left
            penWidth: '', // 人物width
            penOffsetX: '', // 人物偏移值 left + width
            penOffsetY: '', // 人物偏移值 top + height

            obsElementAry: [], // 障碍物dom数组

            initInfo: function () {
                G('game-cd').innerHTML = 10;
                if (TP.platformType == 'sd') {
                    this.minX = 188;
                    this.maxX = 360;
                    this.minY = 248;
                    this.maxY = 530;
                }
                this.obsElementAry = [G('obs_0'), G('obs_1'), G('obs_2')];
            },
            /*开始游戏*/
            readyGo: function () {

                var _this = Activity.animate;
                _this.isStart = true;
                _this.score = 0;
                _this.obsCount = 0;
                _this.loopRoad();  /*背景移动*/
                _this.showObs();    /*创建障碍物*/
                _this.gameCD();
                _this.penLeft = _this.minX;
                _this.penWidth = _this.getStyle(personEl, 'width');
                _this.penOffsetY = _this.getStyle(personEl, 'height') + _this.getStyle(personEl, 'top');
                epg.BM.requestFocus('person');
            },

            gameCD: function () {
                var count = 10; // 每次执行游戏初始化为10
                var cdEl = G('game-cd');
                (function cd() {
                    count--;
                    Activity.animate.CD = count;
                    cdEl.innerHTML = count;
                    gameCDTimer = setTimeout(cd, 1000);
                    if (count === 0) {
                        Activity.animate.releaseTimer(Activity.animate.currObs);
                    }
                }());
            },

            // 结束游戏释放定时器
            releaseTimer: function (el, back) {
                clearTimeout(bgTimer);
                clearTimeout(obsTimer);
                clearTimeout(gameCDTimer);
                el.className = 'obs hide';
                personEl.style.left = Activity.animate.minX + 'px';
                LMUtils.dialog.showToast('game over!', 1, Activity.ajaxHandler.storeUserScore);
                Activity.animate.isStart = false;
            },

            getStyle: function (el, attr) {
                if (el.currentStyle) {
                    return parseInt(el.currentStyle[attr]);
                } else {
                    return parseInt(getComputedStyle(el, null)[attr]);
                }
            },

            /*创建障碍物*/
            showObs: function () {
                var scopeUtils = LMUtils;
                var _this = Activity.animate;
                var rand_number = scopeUtils.getRandom(0, 2);
                var randEl = _this.obsElementAry[rand_number];
                var obsT = scopeUtils.getRandom(_this.minY + 100, _this.maxY);
                var obsL = scopeUtils.getRandom(_this.minX, _this.maxX);

                _this.obsTop = obsT;
                _this.obsLeft = obsL;
                _this.currObs = randEl;
                _this.obsHeight = _this.getStyle(randEl, 'height');
                _this.obsOffsetX = _this.getStyle(randEl, 'width') + obsL;

                randEl.style.top = obsT + 'px';
                randEl.style.left = obsL + 'px';
                randEl.className = 'obs show';
                _this.obsMove(randEl, obsT);
                _this.score += 2;

            },

            /*障碍物移动*/
            obsMove: function (randEl, obsT) {

                var _this = Activity.animate;
                var moveY = obsT;
                (function loop() {
                    moveY = Math.max(_this.minY - _this.obsHeight, moveY -= 17);
                    randEl.style.top = moveY + 'px';
                    obsTimer = setTimeout(loop, 140);
                    _this.mayStopMove(randEl, moveY);

                    if (moveY + _this.obsHeight <= _this.minY) {
                        randEl.className = 'obs hide';
                        clearTimeout(obsTimer);
                        _this.showObs();
                    }
                }());
            },

            /**
             * 游戏结束：
             * 1.障碍物偏移值和人物偏移值有双（x方向、y方向）交叉
             * 2.游戏时间到
             */
            mayStopMove: function (randEl, moveY) {
                var _this = Activity.animate;
                var crossX = _this.obsOffsetX >= _this.penLeft && _this.penWidth + _this.penLeft > _this.obsLeft + 10; // 误差值：10
                var crossY = _this.penOffsetY >= moveY + _this.obsHeight;
                if (crossX && crossY) {
                    // 游戏结束
                    Activity.animate.releaseTimer(randEl);
                }
            },

            /*背景移动*/
            loopRoad: function () {

                var next_count = 0;
                var prev_count;
                // 存储dom 避免重复查询造成不必要的消耗性能
                var bgImgAry = [G('bg-img_0'), G('bg-img_1'), G('bg-img_2')];
                (function loop() {
                    next_count == 2 ? next_count = 0 : next_count += 1;

                    bgImgAry[prev_count] && H(bgImgAry[prev_count]);
                    bgImgAry[next_count] && S(bgImgAry[next_count]);
                    prev_count = next_count;
                    bgTimer = setTimeout(loop, 300);
                }());
            },

            /*人物移动*/
            movePerson: function (key, btn) {

                var _this = Activity.animate;
                var moveLeft = function () {
                    _this.penLeft = Math.max(_this.minX, _this.penLeft -= 33);
                };

                var moveRight = function () {
                    _this.penLeft = Math.min(_this.maxX, _this.penLeft += 33);
                };

                var updateX = function () {
                    personEl.style.left = _this.penLeft + 'px';
                };

                if (key === 'left') {
                    moveLeft();
                    updateX();
                    return false;
                }

                if (key === 'right') {
                    moveRight();
                    updateX();
                    return false;
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

        render: {
            /*渲染游戏UI*/
            gamePageUI: function () {
                var rand = LMUtils.getRandom(0, 2);
            },
            /*渲染中奖名单UI*/
            winnerListUI: function (data) {
                // 所有参与该活动的用户的中奖信息
                var allUserData = data;
                var htm = '<marquee  id="all-marquee" scrollamount="5"  direction="up"><table id="all-table" class="marquee-table">';
                for (var i = 0; i < allUserData.length; i++) {
                    htm += '<tr>'
                        + '<td class="winner-account">'
                        + Activity.formatAccount(allUserData[i].user_account)
                        + '<td class="winner-time">'
                        + Activity.formatDate(allUserData[i].log_dt)
                        + '<td class="winner-prize">' + allUserData[i].goods_name;
                }
                htm += '</table></marquee>';

                var myData = allUserData;
                var myHtm = '<marquee  id="my-marquee" scrollamount="5"  direction="up"><table id="my-table" class="marquee-table">';
                for (var j = 0; j < myData.length; j++) {
                    if (myData[j].user_account === TP.loginUserAccount) {
                        Activity.hasOwnPrized = true;
                        myHtm += '<tr>'
                            + '<td class="winner-account">'
                            + Activity.formatAccount(myData[j].user_account)
                            + '<td class="winner-time">'
                            + Activity.formatDate(myData[j].log_dt)
                            + '<td class="winner-prize">' + myData[j].goods_name;
                    }
                }

                G('my-list').innerHTML = myHtm;
                G('total-list').innerHTML = htm;
                G('rewrite-tel').innerHTML = TP.userTel || '请输入有效的电话';
                Activity.modal.show('modal-list', 'btn-list-submit', '');
                LMUtils.dialog.hide();
            },

            /*渲染兑换UI*/
            exchangeUI: function (data) {

                var userScore = data;
                var exchangeConsume = TP.setExchangeList.data;
                var htm = '<img id="btn-close-exchange" src= "' + TP.imgFtpPrefix + 'jump_back.png">'
                    + '<p class="exchange-user-score">' + (userScore || 0) + '</p>'
                    + '<div class="require-score-wrap">'
                    + '<span>' + exchangeConsume[0].consume_list[0].consume_count + '</span>'
                    + '<span>' + exchangeConsume[1].consume_list[0].consume_count + '</span>'
                    + '<span>' + exchangeConsume[2].consume_list[0].consume_count + '</span>'
                    + '</div>';


                G('data-exchange').innerHTML = htm;
                Activity.modal.show('modal-exchange', 'btn-exchange_0');
                LMUtils.dialog.hide();
            }
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
                // 广西电信用户没有次数跳转到播放视频页面
                case 'btn-play-video-sure':
                    Activity.clickVideo();
                    break;
                // 广西电信用户没有次数取消跳转到播放视频页面
                case 'btn-play-video-cancel':
                    clearTimeout(Activity.cdTimer);
                    Activity.checkUserInfo() && Activity.modal.hide(true);
                    break;

                // 校验游戏资格
                case 'jump-game':
                    TP.beClickId = btn.id;
                    Activity.animate.initInfo();
                    Activity.ajaxHandler.canAnswer(Activity.checkQualification);
                    break;
                // 上传电话号码
                case 'btn-list-submit':
                case 'btn-accomplish-submit':
                    Activity.ajaxHandler.setPhoneNumber(btn);
                    break;
                // 支付失败
                case 'pay-failed':
                    Activity.setPayImageSrc('m_pay_field');
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
                    H('warn-tips');
                    H('game-start');
                    Activity.animate.readyGo();
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
                LMUtils.dialog.showToast('你已经兑换过奖品了', 1);
            } else {
                Activity.ajaxHandler.requestExchangeAction(btn);
            }
        },

        /*设置支付成功/失败的图片显示*/
        setPayImageSrc: function (val) {
            Activity.modal.show('modal-pay', '', function () {
                doc.getElementById('pay-back-tip').src = TP.imgFtpPrefix + val + '.png';
                setTimeout(function () {
                    Activity.modal.hide();
                }, 3000);
            });
        },


        /*渲染兑换奖品成功界面*/
        renderSuccessExchangePage: function (data) {
            G('accomplish-tel').innerHTML = TP.userTel || '请输入有效的电话';
            Activity.modal.show('modal-accomplish', 'btn-accomplish-submit');
            LMUtils.dialog.hide();
        },

        /*设置兑奖之后的弹框提示*/
        setModalTipsByExchange: function (code) {

            switch (parseInt(code)) {
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
                    LMUtils.dialog.showToast('兑换失败', 1.5);
                    break;
                // 库存不足/其他情况
                default:
                    LMUtils.dialog.showToast('兑换失败', 2);
                    break;
            }
        },

        /**ajax 集中处理对象*/
        ajaxHandler: {

            canAnswer: function (fn) {
                LMUtils.dialog.showWaiting();
                epg.ajax.postAPI(
                    'Activity/canAnswer',
                    null,
                    function (rsp) {
                        var data = rsp;
                        if (data.result == 0) {
                            fn.call(Activity, rsp);
                            LMUtils.dialog.hide();
                        } else {
                            console.log(rsp);
                            LMUtils.dialog.showToast('请求试玩发生错误！', 1);
                        }
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('请求试玩发生错误！', 1);
                        console.log(rsp);
                    }
                );
            },

            uploadLeftTimes: function () {
                LMUtils.dialog.showWaiting();
                epg.ajax.postAPI(
                    'Activity/uploadUserJoin',
                    null,
                    function (rsp) {
                        var data = rsp;
                        if (data.result == 0) {
                            console.log(data, 'jyyxzg');
                            Activity.setLeftTimes(data.leftTimes);
                            leftTimes = data.leftTimes;
                            LMUtils.dialog.hide();
                        } else {
                            console.log(rsp);
                            LMUtils.dialog.showToast('请求试玩发生错误！', 1);
                        }
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('请求试玩发生错误！', 1);
                        console.log(rsp);
                    }
                );
            },

            /*保存弹框提示鉴别参数*/
            storeCDToVerify: function (num, callBack) {
                LMUtils.dialog.showWaiting();
                var postData = {
                    key: TP.activityInfo.list.unique_name + TP.userId,
                    value: num
                };
                console.log(postData);
                epg.ajax.postAPI('Activity/saveStoreData', postData,
                    function (rsp) {

                        console.log(rsp);
                        callBack();
                        LMUtils.dialog.hide();
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('结果发生错误！', 2);
                    }
                );
            },

            /*增加游戏次数*/
            addUserTimesUpdate: function (callBack) {
                LMUtils.dialog.showWaiting();
                LMEPG.ajax.postAPI('Activity/addUserLotteryTimes', null,
                    function (rsp) {
                        console.log(rsp);
                        callBack();
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('结果发生错误！', 2);
                    }
                );
            },

            /*保存用户获得的材料*/
            storeUserScore: function () {

                LMUtils.dialog.showWaiting();
                var score = 10 - Activity.animate.CD + Activity.animate.score;
                epg.ajax.postAPI(
                    'Activity/addUserScore',
                    {score: score},
                    function (rsp) {
                        var data = rsp;
                        G('p-add-score').innerHTML = score || 0;
                        Activity.modal.show('modal-add-score', 'btn-one-add');
                        Activity.ajaxHandler.getUserScore(1);
                        LMUtils.dialog.hide();
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('保存失败' + rsp, 3);
                    }
                );
            },

            /*获取保存的积分数据*/
            getUserScore: function (state) {

                LMUtils.dialog.showWaiting();

                epg.ajax.postAPI(
                    'Activity/getUserScore',
                    null,
                    function (rsp) {
                        console.log(rsp);
                        !state && Activity.render.exchangeUI(rsp);
                        G('total-score').innerHTML = rsp || 0;
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('查询失败！', 3);
                    }
                );
            },

            /*请求兑换奖品*/
            requestExchangeAction: function (btn) {

                LMUtils.dialog.showWaiting();

                epg.ajax.postAPI(
                    'Activity/exchangePrize',
                    {'goodsId': btn.goods_id},
                    function (rsp) {
                        console.log(rsp);
                        Activity.setModalTipsByExchange(rsp.result);
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('兑换奖品异常！', 3);
                    }
                );
            },

            /*获取所有兑换奖品列表*/
            getExchangePrizeListRecord: function (btn) {

                LMUtils.dialog.showWaiting();

                epg.ajax.postAPI(
                    'Activity/getExchangePrizeListRecord',
                    '',
                    function (rsp) {
                        console.log(rsp);
                        if (rsp.result == 0) {
                            Activity.render.winnerListUI(rsp.data.all_list);
                        } else {
                            LMUtils.dialog.showToast('获取兑换奖品失败！', 2);
                        }
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('获取兑换奖品异常！', 3);
                    }
                );
            },

            /*保存用户电话号码*/
            setPhoneNumber: function (btn) {

                LMUtils.dialog.showWaiting();

                var isAction = btn.isAction;
                var currentTelId = isAction === 'isListSubmit' ? 'rewrite-tel' : 'accomplish-tel';
                var userTel = G(currentTelId).innerText;

                //判断手机号是否正确
                if (!LMUtils.verify.isValidTel(userTel)) {
                    LMUtils.dialog.showToast('请输入有效的电话', 1);
                    return;
                }

                // 判断是兑换到过奖品
                if (isAction === 'isListSubmit' && !Activity.hasOwnPrized) {
                    LMUtils.dialog.showToast('您尚未中奖', 1);
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
                            if (result == 0) {
                                TP.userTel = userTel;
                                LMUtils.dialog.showToast('提交电话成功！', 1);
                            } else {
                                LMUtils.dialog.showToast('存储失败！', 2);
                            }
                            Activity.modal.hide();
                        } catch (e) {
                            LMUtils.dialog.showToast('提交失败，请重试！', 2);
                            epg.Log.error(e.toString());
                            console.log(e);
                        }
                    },
                    function (rsp) {
                        LMUtils.dialog.showToast('请求保存手机号发生错误！', 3, Activity.reload());
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
                prevModal && Hide(prevModal);
                currModal && Show(currModal);
                this.isModal = true;
                this.prevModal = currModal;
                if (!focusId) {
                    epg.BM.setKeyEventPause(true);
                } else {
                    focusId === 'useReload'
                        ? Activity.reload(true)
                        : epg.BM.requestFocus(focusId);
                }
                typeof callback === 'function' && callback();
            },

            hide: function (bol, callback) {
                if (this.isModal) {
                    Hide(this.prevModal);
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
                return TP.isVip == 1;
            },

            // 验证是否首次进入
            isFirstEnter: function () {
                return !TP.firstEnter;
            },

            // 验证是否支付成功
            isPayState: function () {
                return TP.cOrderResult == 1;
            }


        },

        buttons: [],
        createBtns: function () {
            var self = Activity;
            var imgPrefix = TP.imgFtpPrefix;
            this.buttons = [
                {
                    id: 'jump-game',
                    name: '首页-开始对决',
                    type: 'img',
                    nextFocusUp: 'jump-exchange',
                    nextFocusRight: 'jump-exchange',
                    backgroundImage: imgPrefix + 'jump_start.png',
                    focusImage: imgPrefix + 'jump_start_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'jump-back',
                    name: '按钮-返回',
                    type: 'img',
                    nextFocusDown: 'jump-rule',
                    nextFocusLeft: 'jump-game',
                    backgroundImage: imgPrefix + 'jump_back.png',
                    focusImage: imgPrefix + 'jump_back_f.gif',
                    click: self.jumpBack
                }, {
                    id: 'jump-rule',
                    name: '按钮-显示活动规则',
                    type: 'img',
                    nextFocusUp: 'jump-back',
                    nextFocusDown: 'jump-winner',
                    nextFocusLeft: 'jump-game',
                    backgroundImage: imgPrefix + 'jump_rule.png',
                    focusImage: imgPrefix + 'jump_rule_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'jump-winner',
                    name: '按钮-显示中奖名单',
                    type: 'img',
                    nextFocusUp: 'jump-rule',
                    nextFocusDown: 'jump-exchange',
                    nextFocusLeft: 'jump-game',
                    backgroundImage: imgPrefix + 'jump_winner.png',
                    focusImage: imgPrefix + 'jump_winner_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'jump-exchange',
                    name: '按钮-显示中奖名单',
                    type: 'img',
                    nextFocusUp: 'jump-winner',
                    nextFocusLeft: 'jump-game',
                    nextFocusDown: 'jump-game',
                    backgroundImage: imgPrefix + 'jump_exchange.png',
                    focusImage: imgPrefix + 'jump_exchange_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'btn-rule-close',
                    name: '按钮-返回主界面',
                    type: 'img',
                    backgroundImage: imgPrefix + 'jump_back.png',
                    focusImage: imgPrefix + 'jump_back_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'btn-list-submit',
                    name: '按钮-提交电话号码',
                    type: 'img',
                    nextFocusUp: 'rewrite-tel',
                    nextFocusRight: 'btn-list-cancel',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.gif',
                    isAction: 'isListSubmit',
                    click: self.eventHandler
                }, {
                    id: 'btn-list-cancel',
                    name: '按钮-取消提交电话/关闭中奖名单',
                    type: 'img',
                    nextFocusUp: 'rewrite-tel',
                    nextFocusLeft: 'btn-list-submit',
                    backgroundImage: imgPrefix + 'btn_cancel.png',
                    focusImage: imgPrefix + 'btn_cancel_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'rewrite-tel',
                    name: '输入框-从输入电话号码',
                    type: 'img',
                    backgroundImage: imgPrefix + '',
                    focusImage: imgPrefix + '',
                    focusChange: self.eventHandler,
                    backFocusId: 'btn-list-submit'
                }, {
                    id: 'debug',
                    name: '脚手架ID',
                    type: 'img',
                    backgroundImage: imgPrefix + '',
                    focusImage: imgPrefix + '',
                    click: self.eventHandler
                }, {
                    id: 'btn-uncompleted-sure',
                    name: '按钮-没有完成游戏“确认”',
                    type: 'img',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'btn-accomplish-submit',
                    name: '按钮-完成游戏提交',
                    type: 'img',
                    nextFocusUp: 'accomplish-tel',
                    nextFocusRight: 'btn-accomplish-cancel',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.gif',
                    isAction: '',
                    click: self.eventHandler
                }, {
                    id: 'btn-accomplish-cancel',
                    name: '按钮-完成游戏取消',
                    type: 'img',
                    nextFocusUp: 'accomplish-tel',
                    nextFocusLeft: 'btn-accomplish-submit',
                    backgroundImage: imgPrefix + 'btn_cancel.png',
                    focusImage: imgPrefix + 'btn_cancel_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'accomplish-tel',
                    name: '完成游戏输入框',
                    type: 'img',
                    click: self.eventHandler,
                    focusChange: self.eventHandler,
                    backFocusId: 'btn-accomplish-submit'
                }, {
                    id: 'btn-pay-sure',
                    name: '按钮-确认支付',
                    type: 'img',
                    nextFocusRight: 'btn-pay-cancel',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'btn-pay-cancel',
                    name: '按钮-取消支付',
                    type: 'img',
                    nextFocusLeft: 'btn-pay-sure',
                    backgroundImage: imgPrefix + 'btn_cancel.png',
                    focusImage: imgPrefix + 'btn_cancel_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'btn-play-video-sure',
                    name: '按钮-确认跳转到播放视频',
                    type: 'img',
                    nextFocusRight: 'btn-play-video-cancel',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'btn-play-video-cancel',
                    name: '按钮-取消跳转到播放视频',
                    type: 'img',
                    nextFocusLeft: 'btn-play-video-sure',
                    backgroundImage: imgPrefix + 'btn_cancel.png',
                    focusImage: imgPrefix + 'btn_cancel_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'btn-exchange_0',
                    name: '',
                    type: 'img',
                    nextFocusUp: 'btn-close-exchange',
                    nextFocusLeft: 'btn-exchange_2',
                    nextFocusRight: 'btn-exchange_1',
                    backgroundImage: imgPrefix + 'btn_exchange.png',
                    focusImage: imgPrefix + 'btn_exchange_f.gif',
                    goods_id: setExchangeList ? setExchangeList[0].goods_id : null,
                    click: self.eventHandler,
                    idx: 1
                }, {
                    id: 'btn-exchange_1',
                    name: '',
                    type: 'img',
                    nextFocusUp: 'btn-close-exchange',
                    nextFocusLeft: 'btn-exchange_0',
                    nextFocusRight: 'btn-exchange_2',
                    backgroundImage: imgPrefix + 'btn_exchange.png',
                    focusImage: imgPrefix + 'btn_exchange_f.gif',
                    goods_id: setExchangeList ? setExchangeList[1].goods_id : null,
                    click: self.eventHandler,
                    idx: 2
                }, {
                    id: 'btn-exchange_2',
                    name: '',
                    type: 'img',
                    nextFocusUp: 'btn-close-exchange',
                    nextFocusRight: 'btn-exchange_0',
                    nextFocusLeft: 'btn-exchange_1',
                    backgroundImage: imgPrefix + 'btn_exchange.png',
                    focusImage: imgPrefix + 'btn_exchange_f.gif',
                    goods_id: setExchangeList ? setExchangeList[2].goods_id : null,
                    click: self.eventHandler,
                    idx: 3
                }, {
                    id: 'btn-close-exchange',
                    name: '关闭兑换界面',
                    type: 'img',
                    nextFocusDown: 'btn-exchange_2',
                    backgroundImage: imgPrefix + 'jump_back.png',
                    focusImage: imgPrefix + 'jump_back_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'game-start',
                    name: '开始游戏',
                    type: 'img',
                    backgroundImage: imgPrefix + 'btn_start.png',
                    focusImage: imgPrefix + 'btn_start_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'person',
                    name: '',
                    type: 'others',
                    beforeMoveChange: self.animate.movePerson
                }, {
                    id: 'btn-one-add',
                    name: '',
                    type: 'img',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.gif',
                    click: self.eventHandler
                }, {
                    id: 'btn-one0',
                    name: '',
                    type: 'img',
                    backgroundImage: imgPrefix + 'btn_sure.png',
                    focusImage: imgPrefix + 'btn_sure_f.gif',
                    click: self.eventHandler
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
                    click: self.eventHandler
                }
            ];
        }
    };

    win.Activity = Activity;
    win.onBack = Activity.jumpBack;

}(window, document, LMEPG, RenderParam));
