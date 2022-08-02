/**
 * 页面初始化
 */
(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 10,
            timerId: "",
            currentSkin: 1,
            gameCountDown: null,
            clickNum: 0,
            tipsTimer: null,

            /**
             * 页面初始化
             */
            init: function () {
                // Activity.initLmcid()
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtonFocus();
                a.showOrderResult();
                RenderParam.lmcid == "410092" && Activity.onBack410092();
                this.diff();

                var nowTime= new Date().getTime();
                var startDate =RenderParam.endDt;
                startDate= startDate.replace(new RegExp("-","gm"),"/");
                var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
                if(nowTime>=endDateM){
                    LMActivity.showModal({
                        id: 'bg_game_over',
                        onDismissListener: function () {
                            LMEPG.Intent.back();
                        }
                    });
                }

            },


            /**
             * 处理河南地区返回
             */
            onBack410092: function () {
                try {
                    HybirdCallBackInterface.setCallFunction(function (param) {
                        LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                        if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                            Activity.onBack();
                        }
                    });
                } catch (e) {
                    LMEPG.UI.logPanel.show("e");
                }
            },

            /**
             * 地区测试代码
             */
            initLmcid: function () {
                RenderParam.lmcid != '410092' && a.setPageSize();
            },

            /**
             * 地区区域化处理
             */

            diff: function() {
                if (RenderParam.lmcid == '640092') {
                    var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                    $('bg_1').src = regionalImagePath + '/bg_home.png';
                }
            },

            /**
             * 初始化规则图片
             */
            initRegional: function () {
                // 活动规则图片片路径
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
            },

            /**
             * 初始化游戏标志位
             */
            initGameData: function () {
                LMActivity.playStatus = false;
                Activity.gameOverFlag = false;  //本局游戏结束标志
            },

            /**
             * 页面点击事件
             * @param btn
             */
            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack();
                        break;
                    case 'btn_order_submit':
                        Activity.toBuyVip()
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close':
                    case 'btn_game_fail_sure':
                        Activity.btnGameFailSure()
                        break;
                    case 'btn_game_sure':
                        Activity.btnGameSure()
                        break;
                    case 'btn_begin':
                        Activity.btnBegin()
                        break;
                    case 'btn_start':
                        Activity.btnStart()
                        break;
                    case 'btn_close_exchange':
                        // 关闭当前对话框
                        LMActivity.hideModal(LMActivity.shownModal);
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'btn_game_over_sure':
                        LMActivity.Router.reload();
                }
            },

            /**
             * 开始游戏
             */
            btnStart: function () {
                LMActivity.playStatus = true;
                if (a.hasLeftTime()) {
                    a.AjaxHandler.uploadPlayRecord(function () {
                        G("left_times").innerHTML = r.leftTimes - 1;
                        Activity.showGameModal()
                        Activity.tipsTimer = Activity.setGameInterval(1)
                    }, function () {
                        LMEPG.UI.showToast('扣除游戏次数出错', 3);
                    });
                } else {
                    a.showGameStatus('btn_game_over_sure');
                }
            },

            /**
             * 设置游戏定时器
             */
            setGameInterval: function (tipsNum) {
                Activity.playStatus = true;
                return setInterval(function () {
                    if (tipsNum <= 0) {
                        G("tips1").style.display = "none";
                        clearInterval(Activity.tipsTimer);
                        if (!Activity.gameOverFlag) {
                            Activity.gameCountDown = setInterval(Activity.ActivityCountDown, 1000);
                        }
                    }
                    tipsNum--;
                }, 1000);
            },

            /**
             * 显示游戏容器
             */
            showGameModal: function () {
                a.showModal({
                    id: 'game_container',
                    focusId: 'btn_begin',
                    onDismissListener: function () {
                        Activity.playStatus ? a.Router.reload() : "";
                    }
                });
            },

            /**
             * 游戏按钮
             */
            btnBegin: function () {
                LMEPG.UI.forbidDoubleClickBtn(function () {
                    if (Activity.playStatus) {
                        Activity.clickNum++;
                        Activity.moveBear();
                    }
                }, 500);

            },

            /**
             * 熊妈妈速度变化
             */
            moveBear: function (){
                var regionalImagePath = r.imagePath;
                if (Activity.clickNum == 1){
                    G("move_bear").src = regionalImagePath + '/MobileBear2.gif';
                }
                else if (Activity.clickNum == 2) {
                    G("move_bear").src = regionalImagePath + '/MobileBear3.gif';
                }
                else if (Activity.clickNum == 3) {
                    G("move_bear").src = regionalImagePath + '/MobileBear4.gif';
                }
                else if (Activity.clickNum == 4) {
                    G("move_bear").src = regionalImagePath + '/MobileBear5.gif';
                }
                else if (Activity.clickNum == 5) {
                    G("move_bear").src = regionalImagePath + '/MobileBear6.gif';
                }
            },

            /**
             * 游戏胜利确认按钮
             */
            btnGameSure: function () {
                if (!Activity.canSure) {
                    return;
                }
                var postData = G("add_count").innerHTML;
                a.AjaxHandler.addScore(postData, function () {
                    LMActivity.triggerModalButton = 'btn_start';
                    a.hideModal(a.shownModal);
                    Activity.playStatus = false;
                }, function () {
                    LMEPG.UI.showToast('添加积分失败', 2);
                    LMActivity.triggerModalButton = 'btn_start';
                    a.hideModal(a.shownModal);
                    Activity.playStatus = false;
                })

            },

            /**
             * 游戏失败确认
             */
            btnGameFailSure: function () {
                LMActivity.triggerModalButton = 'btn_start';
                a.hideModal(a.shownModal);
                LMActivity.playStatus = false;
                LMActivity.Router.reload();
            },

            /**
             * 去购买Vip
             */
            toBuyVip: function () {
                RenderParam.isVip == 1 ? LMEPG.UI.showToast("你已经订购过，不用再订购！") : LMActivity.Router.jumpBuyVip();
            },


            /**
             * 活动总倒计时处理
             * @constructor
             */
            canSure: false,
            sureBackDown: 3,
            ActivityCountDown: function () {
                var gameTime = parseInt(G("game_countdown").innerHTML);
                if (gameTime <= 0) {
                    clearInterval(Activity.gameCountDown);
                    Activity.playStatus = false;
                    Activity.gameOverFlag = false;
                    //本局结束，重置游戏参数
                    G("game_countdown").innerHTML = RenderParam.gameTimeSingle;
                    var interval_ = setInterval(function () {
                        Activity.sureBackDown--
                        if (Activity.sureBackDown === 0) {
                            Activity.canSure = true
                            clearInterval(interval_)
                        }
                    }, 1000)
                    Activity.checkGameResult();
                } else {
                    Activity.gameOverFlag = true;
                    G("game_countdown").innerHTML = gameTime - 1;
                    // gameTime < 7 && Activity.changeCountdownCss()
                }
            },


            /**
             * 检查游戏结果
             */
            checkGameResult: function () {
                if (Activity.clickNum >= 5) {
                    Activity.showGameSuccess()
                    Activity.updateCountPosition()
                } else {
                    Activity.showGameFail()
                }
            },

            /**
             * 显示游戏失败
             */
            showGameFail:function (){
                a.showModal({
                    id: 'game_fail',
                    focusId: 'btn_game_fail_sure',
                    onDismissListener: function () {
                        a.Router.reload();
                    }
                });
            },

            /**
             * 更新count和position
             */
            updateCountPosition:function (){
                if (Activity.clickNum > 5) {
                    G("add_count").innerHTML = 1;
                }
            },

            /**
             * 显示游戏成功结果
             */
            showGameSuccess:function (){
                a.showModal({
                    id: 'game_success',
                    focusId: 'btn_game_sure',
                    onDismissListener: function () {
                        a.Router.reload();
                    }
                });
            },

            /**
             * 初始页面首页默认焦点
             */
            initButtonFocus: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },
            /**
             * 设置当前页参数
             */
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },

            /**
             * 返回
             */
            onBack: function () {
                if (LMActivity.shownModal) {
                    if (r.isVip === '0' && r.valueCountdown.showDialog === '1' && $("order_vip").style.display == 'block') {
                        LMActivity.showModal({
                            id: 'countdown',
                            onShowListener: function () {
                                LMActivity.startCountdown();
                            },
                        })
                    } else {
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
            },
            /**
             * 获取页面元素图片地址
             * @param imageName
             */

        };
        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: 'btn_start',
                nextFocusUp: '',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: 'btn_start',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_close_rule',
                name: '按钮-活动规则-关闭',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusLeft: 'btn_start',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'btn_exchange_prize',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'exchange',
                click: a.eventHandler
            }, {
                id: 'btn_game_sure',
                name: '按钮-中奖名单',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                listType: 'lottery',
                click: Activity.eventHandler
            }, {
                id: 'btn_game_fail_sure',
                name: '游戏未完产成页确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                listType: 'lottery',
                click: Activity.eventHandler
            }, {
                id: 'btn_start',
                name: '回家',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: 'btn_exchange_prize',
                nextFocusRight: "btn_exchange_prize",
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_exchange_prize',
                name: '兑换礼品',
                type: 'img',
                nextFocusLeft: 'btn_start',
                nextFocusUp: 'btn_winner_list',
                nextFocusDown: 'btn_start',
                // backgroundImage: Activity.getImageUrl('btn_exchange_prize.png'),
                // focusImage: Activity.getImageUrl('btn_exchange_prize_f.png'),
                backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
                focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
                click: a.eventHandler
            },{
                id: 'exchange_prize_1',
                name: '按钮-兑换1',
                type: 'img',
                order: 0,
                nextFocusLeft: 'exchange_prize_3',
                nextFocusRight: 'exchange_prize_2',
                nextFocusUp: 'btn_close_exchange',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler
            }, {
                id: 'exchange_prize_2',
                name: '按钮-兑换2',
                type: 'img',
                order: 1,
                nextFocusLeft: 'exchange_prize_1',
                nextFocusRight: 'exchange_prize_3',
                nextFocusUp: 'btn_close_exchange',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler
            }, {
                id: 'exchange_prize_3',
                name: '按钮-兑换3',
                type: 'img',
                order: 2,
                nextFocusLeft: 'exchange_prize_2',
                nextFocusRight: 'exchange_prize_1',
                nextFocusUp: 'btn_close_exchange',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_exchange_submit',
                name: '按钮-兑换成功-确定',
                type: 'img',
                nextFocusUp: 'exchange_tel',
                nextFocusLeft: '',
                nextFocusRight: 'btn_exchange_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_exchange_cancel',
                name: '按钮-兑换成功-取消',
                type: 'img',
                nextFocusUp: 'exchange_tel',
                nextFocusLeft: 'btn_exchange_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusUp: 'reset_tel',
                nextFocusLeft: '',
                nextFocusRight: 'btn_list_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                listType: 'exchange',
                click: a.eventHandler
            }, {
                id: 'btn_list_cancel',
                name: '按钮-中奖名单-取消',
                type: 'img',
                nextFocusLeft: 'btn_list_submit',
                nextFocusUp: '',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'reset_tel',
                name: '输入框-中奖名单-重置电话号码',
                type: 'div',
                nextFocusDown: 'btn_list_submit',
                backFocusId: 'btn_list_submit',
                left: 900,
                top: 480,
                focusChange: a.onInputFocus,
                click: Activity.eventHandler
            }, {
                id: 'btn_lottery_submit',
                name: '按钮-中奖-确定',
                type: 'img',
                nextFocusUp: 'lottery_tel',
                nextFocusRight: 'btn_lottery_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_lottery_cancel',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: 'btn_lottery_submit',
                nextFocusUp: 'lottery_tel',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'lottery_tel',
                name: '输入框-抽奖-电话号码',
                type: 'div',
                nextFocusDown: 'btn_lottery_submit',
                backFocusId: 'btn_lottery_submit',
                focusChange: a.onInputFocus
            }, {
                id: 'btn_lottery_fail',
                name: '按钮-抽奖失败-确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_close_exchange',
                name: '按钮-兑换页-返回',
                type: 'img',
                nextFocusDown: 'exchange_prize_1',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'exchange_tel',
                name: '输入框-兑换-电话号码',
                type: 'div',
                nextFocusDown: 'btn_exchange_submit',
                backFocusId: 'btn_exchange_submit',
                focusChange: a.onInputFocus,
                top: 405,
                left: 900,
            }, {
                id: 'btn_game_over_sure',
                name: '按钮-结束游戏',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_order_submit',
                name: '按钮-订购VIP',
                type: 'img',
                nextFocusRight: 'btn_order_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_order_cancel',
                name: '按钮-取消订购VIP',
                type: 'img',
                nextFocusLeft: 'btn_order_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_game_confirm',
                name: '按钮-中奖-确定',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn_game_cancel',
                backgroundImage: a.makeImageUrl('btn_lotter.png'),
                focusImage: a.makeImageUrl('btn_lotter_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_game_cancel',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: 'btn_game_confirm',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_no_score',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_begin',
                name: '加速',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_begin.png'),
                focusImage: a.makeImageUrl('btn_begin.png'),
                click: Activity.eventHandler
            }
        ];
        var Pagination = {
            isCreateBtn: false,
            containerId: "",//分页容器,
            curPage: 0,
            type: "img",
            data: "",
            pagesSize: 0,
            btnId: "",
            callBack: "",
            onFocusBack: "",

            /**
             * 初始化页面
             * @param element
             */
            init: function (element) {
                this.containerId = element.containerId;
                this.data = element.data;
                this.pagesSize = element.pageSize;
                this.btnId = element.btnId;
                this.type = element.type;
                this.onFocusBack = element.onFocus;
                if (!this.isCreateBtn) {
                    this.isCreateBtn = true;
                    this.createBtn(this.pagesSize);
                }
                this.createHtml();
            },

            /**
             * 构建页面元素
             */
            createHtml: function () {
                G(this.containerId).innerHTML = "";
                var sHtml = "";
                var curData = this.cut(this.data);
                var that = this;
                curData.forEach(function (item, i) {
                    sHtml += '<img id="' + that.btnId + i + '" src="' + r.imagePath + 'style_' + item + '.png">';
                });
                G(this.containerId).innerHTML = sHtml;
                for (var i = 0; i < curData.length; i++) {
                    LMEPG.BM.getButtonById(Pagination.btnId + i).cType = curData[i];
                    LMEPG.BM.getButtonById(Pagination.btnId + i).backgroundImage = r.imagePath + 'style_' + curData[i] + '.png';
                    LMEPG.BM.getButtonById(Pagination.btnId + i).focusImage = r.imagePath + 'style_' + curData[i] + '_f.png';
                }
                LMEPG.ButtonManager.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : Pagination.btnId + '0');
            },

            /**
             * 前端发分页
             * @returns {string}
             */
            cut: function () {
                return this.data.slice(this.curPage, this.pagesSize + this.curPage)
            },

            /**
             * 切换page
             * @param dir
             * @param cur
             * @returns {boolean}
             */
            turnPage: function (dir, cur) {
                if (dir == "left" && cur.id == Pagination.btnId + "0") {
                    Pagination.prePage()
                    return false
                } else if (dir == "right" && cur.id == Pagination.btnId + (Pagination.pagesSize - 1)) {
                    Pagination.nextPage()
                    return false
                }
            },

            /**
             * 点击事件
             * @param btn
             */
            onClick: function (btn) {
                LMEPG.call(Pagination.callBack, btn)
            },

            /**
             * 聚焦事件
             * @param btn
             * @param has
             */
            onFocus: function (btn, has) {
                LMEPG.call(Pagination.onFocusBack, btn, has)
            },

            /**
             *
             * @param page
             */
            createBtn: function (page) {
                var focusNum = page;
                while (focusNum--) {
                    Activity.buttons.push({
                        id: Pagination.btnId + focusNum,
                        type: Pagination.type,
                        nextFocusLeft: Pagination.btnId + (focusNum - 1),
                        nextFocusRight: Pagination.btnId + (focusNum + 1),
                        nextFocusDown: "play",
                        backgroundImage: r.imagePath + "style_" + (focusNum + 1) + ".png",
                        focusImage: r.imagePath + "style_" + (focusNum + 1) + "_f.png",
                        click: Pagination.onClick,
                        focusChange: Pagination.onFocus,
                        beforeMoveChange: Pagination.turnPage,
                        cType: ""
                    });
                }
                LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : Pagination.btnId + '0', Activity.buttons, '', true);
            },

            /**
             * 上一页
             */
            prePage: function () {
                if (this.curPage > 0) {
                    this.curPage--;
                    this.createHtml();
                    LMEPG.BM.requestFocus(Pagination.btnId + "0");
                } else {
                    this.curPage = 3;
                    this.createHtml();
                    LMEPG.BM.requestFocus(Pagination.btnId + "0");
                }
            },

            /**
             * 下一页
             */
            nextPage: function () {
                if (this.curPage < (this.data.length - this.pagesSize)) {
                    this.curPage++;
                    this.createHtml();
                    LMEPG.BM.requestFocus(Pagination.btnId + (Pagination.pagesSize - 1));
                } else {
                    this.curPage = 0
                    this.createHtml();
                    LMEPG.BM.requestFocus(Pagination.btnId + (Pagination.pagesSize - 1));
                }
            },
        }
        w.Activity = Activity;
    }

)
(window, LMEPG, RenderParam, LMActivity);


var specialBackArea = ['460092', "410092",'10220094'];

/**
 * 退出，返回
 */
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}