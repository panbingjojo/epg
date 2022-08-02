(function (w, e, r, a) {
        w.unLightId = [1, 2, 3, 4, 5, 6];
        w.Animal = function (id, img) {
            this.id = id || "";
            this.timer = "";
            this.size = 5;
            this.img = img;
        };
        Animal.prototype.init = function () {
            var that = this;
            LMEPG.BM.requestFocus("light_" + unLightId[unLightId.length - 1])
            G(that.id).src = that.img;
            this.timer = setInterval(function () {
                if (parseInt(G(that.id).style.top) > 0) {
                    var offsetTop = (parseInt(G(that.id).style.top) - that.size);
                    G(that.id).style.top = offsetTop + "px";
                } else {
                    // LMEPG.UI.logPanel.show(G(that.id).style.top);
                    Hide(that.id)
                    clearInterval(that.timer);
                }
            }, 10)
        };
        var Activity = {
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 10,
            timerId: "",

            init: function () {
                //广西电信EPG VIP订购弹窗
                if (r.lmcid == '450092') {
                    G('order_vip_bg').src = r.imagePath + "V450092/bg_order_vip.png";
                    // G('btn_order_submit').style.left = r.platformType == 'hd' ? '555px' : '270px';
                    // H('btn_order_cancel');
                }

                Activity.initRegional();
                Activity.createGameMap();
                Activity.initGameData();
                Activity.initButtons();
                a.showOrderResult();
            },

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
            playGame: function (btn) {
                var index = parseInt(btn.id.substring(6, 7));
                console.log("id>>" + index)
                for (var i = 0; i < unLightId.length; i++) {
                    if (index == unLightId[i]) {
                        unLightId.splice(i, 1);
                        console.log(unLightId);
                    }
                }
                w.Animal1 = new Animal(btn.id, btn.selectedImage);
                w.Animal1.init();
            },
            cutDown: function (id, callBack) {
                Activity.timerId = setInterval(function () {
                    if (Activity.cutTime != 0) {
                        Activity.cutTime--
                        G(id).innerHTML = "" + Activity.cutTime;
                    } else {
                        clearInterval(Activity.timerId);
                        LMEPG.call(callBack);
                    }
                }, 1000)

            },
            createGameMap: function () {
                var strHtml = "";
                var i = 6;
                if (r.platformType == "hd") {
                    Activity.pos = [2, 30, 243, 327, 297, 339]
                } else {
                    Activity.pos = [6, 51, 156, 205, 230, 253]
                }
                while (i--) {
                    var temImg = a.makeImageUrl('light_' + (i + 1) + '.png')
                    strHtml += '<img src="' + temImg + '" id="light_' + (i + 1) + '" style="top:' + Activity.pos[i] + 'px">'
                    Activity.buttons.push({
                            id: 'light_' + (i + 1),
                            name: '灯笼',
                            type: 'img',
                            nextFocusUp: 'light_' + (i - 1),
                            nextFocusDown: 'light_' + (i + 3),
                            nextFocusLeft: 'light_' + i,
                            nextFocusRight: 'light_' + (i + 2),
                            backgroundImage: a.makeImageUrl('light_' + (i + 1) + '.png'),
                            focusImage: a.makeImageUrl('light_' + (i + 1) + '_f.png'),
                            selectedImage: a.makeImageUrl('light_' + (i + 1) + '_select.png'),
                            click: Activity.playGame,
                            beforeMoveChange: Activity.beforeChange,
                        }
                    )
                }
                strHtml += '<div id="cutDown">10</div>';
                G("game_container").innerHTML = strHtml;
            },
            beforeChange: function (dir, curr) {
                switch (dir) {
                    case "up":
                        if ((unLightId.indexOf(1) >= 0) && (unLightId.indexOf(2) == -1)) {
                            LMEPG.BM.requestFocus("light_1");
                        } else if ((unLightId.indexOf(2) >= 0) && (unLightId.indexOf(1) == -1)) {
                            LMEPG.BM.requestFocus("light_2");
                        } else if ((unLightId.indexOf(2) >= -1) && (unLightId.indexOf(1) == -1)) {
                            return false
                        } else if (curr.id == "light_5" || curr.id == "light_6") {
                            LMEPG.BM.requestFocus("light_2");
                            return false
                        }
                        break;
                    case "down":
                        var currentId = Activity.getNextFocus(curr.id, "down");
                        if (curr.id == "light_2" && currentId == "" && Activity.isEmpt("light_3")) {
                            LMEPG.BM.requestFocus("light_3");
                        } else if (curr.id == "light_3" || curr.id == "light_4") {
                            return false;
                        } else {
                            LMEPG.BM.requestFocus(currentId);
                        }
                        return false
                        break;
                    case "left":
                        if (curr.id == "light_3") {
                            return false
                        } else {
                            LMEPG.BM.requestFocus(Activity.getNextFocus(curr.id, "left"));
                            return false
                        }
                        break;
                    case "right":
                        LMEPG.BM.requestFocus(Activity.getNextFocus(curr.id, "right"));
                        return false
                        break;
                }
            },
            isEmpt: function (id) {
                var temId = parseInt(id.substring(6, 7));
                if (unLightId.indexOf(temId) >= 0) {
                    return true;
                } else {
                    return false;
                }
            },
            getNextFocus: function (currentBtnObj, dir) {
                var nextFocusObj = LMEPG.ButtonManager.getNearbyFocusButton(dir, currentBtnObj.id);
                while (nextFocusObj) {
                    if (Activity.isEmpt(nextFocusObj.id)) {
                        return nextFocusObj.id;
                    } else {
                        if (dir == "up") {
                            nextFocusObj = LMEPG.ButtonManager.getNearbyFocusButton("left", nextFocusObj.id)
                        } else if (dir == "down") {
                            nextFocusObj = LMEPG.ButtonManager.getNearbyFocusButton("right", nextFocusObj.id)
                        } else {
                            nextFocusObj = LMEPG.ButtonManager.getNearbyFocusButton(dir, nextFocusObj.id)
                        }
                    }
                }
                return "";
            },

            initGameData: function () {
                LMActivity.playStatus = false;
            },


            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_start':
                        if (a.hasLeftTime()) {
                            Activity.startBtn();
                        } else {
                            LMActivity.triggerModalButton = btn.id;
                            a.showGameStatus('btn_game_over_sure');
                        }
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
                        focusId: 'light_6'
                    });
                    Activity.cutDown("cutDown", function () {
                        Activity.score = 6 - unLightId.length;
                        Activity.cutTime = 10;
                        if (Activity.score >= 3) {
                            LMActivity.showModal({
                                id: 'game_result_s',
                                focusId: 'btn_game_confirm'
                            });
                            G("score").innerHTML = "" + Activity.score;
                        } else {
                            LMActivity.showModal({
                                id: 'game_result_f',
                                focusId: 'btn_no_score'
                            });
                        }
                    })
                    r.leftTimes = r.leftTimes - 1;
                    G("left_times").innerHTML = r.leftTimes;
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
                nextFocusLeft: 'btn_start',
                nextFocusUp: '',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: a.eventHandler
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
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusLeft: 'btn_start',
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
                nextFocusUp: 'reset_tel',
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
                nextFocusUp: 'reset_tel',
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
            },
        ];

        w.Activity = Activity;
    }
)
(window, LMEPG, RenderParam, LMActivity);