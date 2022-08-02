(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 10,
            timerId: "",
            currentSkin: 0,

            init: function () {
                //广西电信EPG VIP订购弹窗
                if (r.lmcid == '450092') {
                    G('order_vip_bg').src = r.imagePath + "V450092/bg_order_vip.png";
                    // G('btn_order_submit').style.left = r.platformType == 'hd' ? '555px' : '270px';
                    // H('btn_order_cancel');
                }
                Activity.initParam();
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                a.showOrderResult();
            },
            initParam: function () {
                if (r.inner == 0 && r.userId == 0) {
                    LMEPG.UI.showWaitingDialog();
                    LMEPG.AuthUser.authUser(function (data) {
                        r.userId = data.userId;
                        r.isVip = data.isVip;
                        LMActivity.AjaxHandler.getActivityId(r.activityName);
                        // LMActivity.AjaxHandler.getAssignCountdownInfo();
                    }, function () {
                        LMEPG.UI.showToast("鉴权失败");
                    }, LMEPG.AuthUser.authNodeActivity);
                } else {
                    LMActivity.AjaxHandler.getAllUserPrizeList();
                    LMActivity.AjaxHandler.getMyPrizeList();
                    // LMEPG.UI.showWaitingDialog();
                    // LMActivity.AjaxHandler.getActivityTimes(r.activityName)
                }
            },
          ///鉴权
            initRegional: function () {
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                // 活动规则
                $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_prize_1.png',
                    "2": regionalImagePath + '/icon_prize_2.png',
                    "3": regionalImagePath + '/icon_prize_3.png'
                };
            },
            createGameMap: function () {
                var ele = {
                    "containerId": "skin-list",
                    "data": Activity.data,
                    "pageSize": 3,
                    "btnId": "skin-btn-",
                    "type": "img",
                    "onFocus": function (btn, has) {
                        if (has) {
                            Activity.currentSkin = btn.cType;
                            G("game_container").style.backgroundImage = "url(" + r.imagePath + 'bg_game_container_' + btn.cType + ".png)";
                        } else {

                        }
                    }
                }
                Pagination.init(ele);

            },
            isEmpt: function (id) {
                var temId = parseInt(id.substring(6, 7));
                if (unLightId.indexOf(temId) >= 0) {
                    return true;
                } else {
                    return false;
                }
            },

            initGameData: function () {
                LMActivity.playStatus = false;
            },


            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_start':
                        LMActivity.AjaxHandler.getActivityTimes(r.activityName, function () {
                            if (a.hasLeftTime()) {
                                Activity.startBtn();
                            } else {
                                LMActivity.triggerModalButton = btn.id;
                                a.showGameStatus('btn_game_over_sure');
                            }
                        })
                        break;
                    case 'btn_game_confirm':
                        // 扣除次数成功直接去抽奖
                        a.doLottery();
                        break
                    case 'btn_order_submit':
                        if (RenderParam.lmcid === '450092') {
                            Activity.jumpPlayVideo();
                        } else {
                            if (RenderParam.isVip == 1) {
                                LMEPG.UI.showToast("你已经订购过，不用再订购！");
                            } else {
                                LMActivity.Router.jumpBuyVip();
                            }
                        }
                        break;
                    case 'play':
                        if (Activity.currentSkin == 1) {
                            LMActivity.showModal({
                                id: 'game_result_f',
                                focusId: 'btn_no_score'
                            });
                        } else {
                            LMActivity.showModal({
                                id: 'game_result_s',
                                focusId: 'btn_game_confirm'
                            });
                        }
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close_exchange':
                    case 'btn_close':
                        LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                        // a.hideModal(a.shownModal);
                        LMActivity.Router.reload();
                }
            },

            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },

            startBtn: function (btn) {
                LMActivity.triggerModalButton = 'btn_start';
                if (LMActivity.playStatus) {
                    return;
                }
                LMActivity.playStatus = true;
                a.AjaxHandler.uploadPlayRecord(function () {
                    LMActivity.showModal({
                        id: 'game_container',
                        focusId: 'skin-btn-0'
                    });
                    Activity.createGameMap();
                    r.leftTimes = r.leftTimes - 1;
                    G("left_times").innerHTML = "剩余次数：" + r.leftTimes;
                }, function () {
                    LMEPG.UI.showToast('扣除游戏次数出错', 3);
                });
            },

            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },

            /**
             * 跳转到视频播放页，播放结束时返回到首页
             * @param data 视频信息
             */
            jumpPlayVideo: function () {
                // 创建视频信息
                var videoInfo = {
                    'videoUrl': RenderParam.platformType == 'hd' ? '99100000012019122711312406850550' : '99100000012019122711452806855842',
                    'sourceId': '24382',
                    'title': '为什么体检前需要空腹？',
                    'type': 4,
                    'userType': '2',
                    'freeSeconds': '30',
                    'entryType': 2,
                    'entryTypeName': '元旦摇好礼，欢乐喜相送',
                    'unionCode': 'gylm863',
                    'showStatus': 1
                };

                LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
                    var objCurrent = Activity.getCurrentPage(); //得到当前页
                    var objPlayer = LMEPG.Intent.createIntent('player');
                    objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

                    LMEPG.Intent.jump(objPlayer, objCurrent);
                }, function () {
                    LMEPG.UI.showToast("视频参数错误");
                });
            },

        };

        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: '',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_close_rule',
                name: '按钮-活动规则-关闭',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            }, {
                id: 'btn_start',
                name: '按钮-开始',
                type: 'img',
                nextFocusUp: 'btn_winner_list',
                nextFocusLeft: '',
                nextFocusRight: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusUp: '',
                nextFocusLeft: 'reset_tel',
                nextFocusRight: 'btn_list_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                listType: 'lottery',
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
                id: 'exchange_prize_1',
                name: '按钮-兑换1',
                type: 'img',
                order: 0,
                nextFocusUp: 'btn_close_exchange',
                nextFocusRight: 'exchange_prize_2',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler
            }, {
                id: 'exchange_prize_2',
                name: '按钮-兑换2',
                type: 'img',
                order: 1,
                nextFocusUp: 'btn_close_exchange',
                nextFocusLeft: 'exchange_prize_1',
                nextFocusRight: 'exchange_prize_3',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler
            }, {
                id: 'exchange_prize_3',
                name: '按钮-兑换3',
                type: 'img',
                order: 2,
                nextFocusUp: 'btn_close_exchange',
                nextFocusLeft: 'exchange_prize_2',
                backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
                focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_exchange_submit',
                name: '按钮-兑换成功-确定',
                type: 'img',
                nextFocusUp: 'exchange_tel',
                nextFocusRight: 'btn_exchange_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_exchange_cancel',
                name: '按钮-兑换成功-取消',
                type: 'img',
                nextFocusLeft: 'btn_exchange_submit',
                nextFocusUp: 'exchange_tel',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'exchange_tel',
                name: '输入框-兑换-电话号码',
                type: 'div',
                nextFocusDown: 'btn_exchange_submit',
                backFocusId: 'btn_exchange_submit',
                focusChange: a.onInputFocus
            }, {
                id: 'btn_game_over_sure',
                name: '按钮-结束游戏',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
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
                click: a.eventHandler
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
                id: 'play',
                name: '按钮-换装',
                type: 'img',
                nextFocusUp: 'skin-btn-0',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('play.png'),
                focusImage: a.makeImageUrl('play_f.png'),
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
            init: function (element) {
                this.containerId = element.containerId;
                this.data = element.data;
                this.pagesSize = element.pageSize;
                this.btnId = element.btnId;
                this.type = element.type;
                // this.callBack = element.callBack;
                this.onFocusBack = element.onFocus;
                if (!this.isCreateBtn) {
                    this.isCreateBtn = true;
                    this.createBtn(this.pagesSize);
                }
                // this.isCreateBtn = element.isCreateBtn || false;
                // this.containerId = element.containerId;
                // this.curPage = 0;
                // this.type = element.type || "img";
                // this.data = element.data;
                // this.pagesSize = element.pagesSize || 0;
                // this.btnId = element.btnId;
                // this.callBack = element.callBack;
                // this.onFocusBack = element.onFocusBack;
                this.createHtml();
            },
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
            cut: function () {
                return this.data.slice(this.curPage, this.pagesSize + this.curPage)
            },
            turnPage: function (dir, cur) {
                if (dir == "left" && cur.id == Pagination.btnId + "0") {
                    Pagination.prePage()
                    return false
                } else if (dir == "right" && cur.id == Pagination.btnId + (Pagination.pagesSize - 1)) {
                    Pagination.nextPage()
                    return false
                }
            },
            onClick: function (btn) {
                LMEPG.call(Pagination.callBack, btn)
            },
            onFocus: function (btn, has) {
                LMEPG.call(Pagination.onFocusBack, btn, has)
            },

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