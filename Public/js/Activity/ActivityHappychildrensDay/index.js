(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 10,
            timerId: "",
            currentSkin: 1,

            init: function () {
                a.setPageSize();
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                a.showOrderResult();
                a.setPageSize();
            },

            initRegional: function () {
                // 活动规则图片片路径
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';

                // a.prizeImage = {
                //     "1": regionalImagePath + '/icon_prize_1.png',
                //     "2": regionalImagePath + '/icon_prize_2.png',
                //     "3": regionalImagePath + '/icon_prize_3.png'
                // };
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
                    case 'btn_back':
                        LMActivity.exitActivity();
                        break;
                    case 'btn_order_submit':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close_exchange':
                    case 'btn_close':
                    case 'btn_game_sure':
                        LMActivity.triggerModalButton = 'btn_start';
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        break;
                    case 'lipstick1':
                    case 'lipstick2':
                    case 'lipstick3':
                    case 'lipstick4':
                    case 'lipstick5':
                        LMActivity.AjaxHandler.getActivityTimes(r.activityName, function () {
                            if (a.hasLeftTime()) {
                                if (LMActivity.playStatus) {
                                    return;
                                }
                                LMActivity.playStatus = true;
                                a.AjaxHandler.uploadPlayRecord(function () {
                                    r.leftTimes = r.leftTimes - 1;
                                    G("left_times").innerHTML = r.leftTimes;
                                    a.AjaxHandler.addScore(1, function () {
                                        // $('add_count').innerHTML = String(parseInt(RenderParam.score) +1);
                                        a.showModal({
                                            id: 'game_success',
                                            focusId: 'btn_game_sure',
                                            onDismissListener: function () {
                                                a.Router.reload();
                                            }
                                        });
                                    }, function () {
                                        LMEPG.UI.showToast('添加积分失败', 2);
                                    });
                                }, function () {
                                    LMEPG.UI.showToast('扣除游戏次数出错', 3);
                                });
                            } else {
                                LMActivity.triggerModalButton = btn.id;
                                a.showGameStatus('btn_game_over_sure');
                            }
                        });
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                        LMActivity.Router.reload();
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('lipstick4', Activity.buttons, true);
            },
            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            }
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
                click: Activity.eventHandler
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
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: a.eventHandler
            },{
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusLeft: 'lipstick6',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'btn_exchange_prize',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'exchange',
                click: a.eventHandler
            },{
                id: 'btn_game_sure',
                name: '按钮-中奖名单',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                listType: 'lottery',
                click: Activity.eventHandler
            },
            {
                id: 'lipstick1',
                name: '过山车',
                type: 'img',
                nextFocusLeft: 'lipstick4',
                nextFocusUp: 'btn_exchange_prize',
                nextFocusDown: 'btn_winner_list',
                nextFocusRight:"lipstick2",
                backgroundImage: a.makeImageUrl('game1.png'),
                focusImage: a.makeImageUrl('game1_f.png'),
                click: Activity.eventHandler
            },{
                id: 'lipstick2',
                name: '海盗船',
                type: 'img',
                nextFocusLeft: 'lipstick1',
                nextFocusRight:"lipstick5",
                nextFocusUp: 'btn_exchange_prize',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('game2.png'),
                focusImage: a.makeImageUrl('game2_f.png'),
                click: Activity.eventHandler
            },{
                id: 'lipstick3',
                name: '激流勇进',
                type: 'img',
                nextFocusLeft: 'lipstick5',
                nextFocusRight:"lipstick4",
                nextFocusUp: 'lipstick5',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('game3.png'),
                focusImage: a.makeImageUrl('game3_f.png'),
                click: Activity.eventHandler
            },{
                id: 'lipstick4',
                name: '旋转木马',
                type: 'img',
                nextFocusLeft: 'lipstick3',
                nextFocusRight:"lipstick1",
                nextFocusUp: "btn_exchange_prize",
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('game4.png'),
                focusImage: a.makeImageUrl('game4_f.png'),
                click: Activity.eventHandler
            },{
                id: 'lipstick5',
                name: '碰碰车',
                type: 'img',
                nextFocusLeft: 'lipstick2',
                nextFocusRight:"lipstick3",
                nextFocusUp: 'btn_exchange_prize',
                nextFocusDown: 'lipstick3',
                backgroundImage: a.makeImageUrl('game5.png'),
                focusImage: a.makeImageUrl('game5_f.png'),
                click: Activity.eventHandler
            },
            {
                id: 'btn_exchange_prize',
                name: '兑换礼品',
                type: 'img',
                nextFocusLeft: 'lipstick5',
                nextFocusUp: 'btn_winner_list',
                nextFocusDown: 'lipstick3',
                backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
                focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
                click: a.eventHandler
            },
            {
                id: 'exchange_prize_1',
                name: '按钮-兑换1',
                type: 'img',
                order: 0,
                nextFocusLeft: 'exchange_prize_3',
                nextFocusRight: 'exchange_prize_2',
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
                id: 'exchange_tel',
                name: '输入框-兑换-电话号码',
                type: 'div',
                nextFocusDown: 'btn_exchange_submit',
                backFocusId: 'btn_exchange_submit',
                focusChange: a.onInputFocus
            },
            {
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
            },  {
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
                this.onFocusBack = element.onFocus;
                if (!this.isCreateBtn) {
                    this.isCreateBtn = true;
                    this.createBtn(this.pagesSize);
                }
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

var specialBackArea = ['460092'];
function outBack() {
    if (RenderParam.lmcid == '460092') {
        var objSrc = LMActivity.Router.getCurrentPage();
        var objHome = LMEPG.Intent.createIntent('home');
        LMEPG.Intent.jump(objHome, objSrc);
    }
}