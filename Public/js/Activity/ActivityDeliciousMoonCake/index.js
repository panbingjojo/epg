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
            cakeType: null,
            startFocus: 'btn_wuren_cake',
            rankData: {
                total_rank: [],
                my_rank: []
            },

            init: function () {
                if (-1 == ['410092','220001','371002'].indexOf(RenderParam.lmcid)) {
                    a.setPageSize();
                }
                Activity.initRegional();
                Activity.initGameData();
                a.showOrderResult();

                if (RenderParam.carrierId == "410092") {//处理河南地区返回
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
                }

                var nowTime = Math.round(new Date());
                var startDate = RenderParam.endDt;
                startDate = startDate.replace(new RegExp("-", "gm"), "/");
                var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
                if (nowTime >= endDateM) {
                    LMActivity.showModal({
                        id: 'bg_game_over',
                        onDismissListener: function () {
                            LMActivity.innerBack();
                        }
                    });
                    if (['220001', '220094', '220095', '10220094'].indexOf(r.carrierId) > -1) {
                        setTimeout(function () {
                            LMActivity.hideModal(LMActivity.shownModal);
                        }, 3000);
                    }
                }

                Activity.getRankData();

            },

            initRegional: function () {
                // 活动规则图片片路径
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
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
                Activity.gameOverFlag = false;  //本局游戏结束标志
            },
            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':
                        LMActivity.innerBack();
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
                    case 'btn_game_fail_sure':
                        LMActivity.triggerModalButton = 'btn_start';
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        LMActivity.Router.reload();
                        break;
                    case 'btn_start':
                        Activity.goCall();
                        break;
                    case 'btn_game_sure':
                        Activity.addScore(1, Activity.cakeType, function () {
                            LMActivity.triggerModalButton = 'btn_start';
                            a.hideModal(a.shownModal);
                        }, function () {
                            LMEPG.UI.showToast('添加积分失败', 2);
                            LMActivity.triggerModalButton = 'btn_start';
                            a.hideModal(a.shownModal);
                            LMActivity.playStatus = false;
                        });
                        break;
                    case 'btn_activity_rule':
                        LMActivity.triggerModalButton = btn.id;
                        LMActivity.showModal({
                            id: 'activity_rule',
                            focusId: ''
                        });
                        break;
                    case 'btn_wuren_cake':
                    case 'btn_danhuang_cake':
                    case 'btn_huotui_cake':
                    case 'btn_furong_cake':
                        Activity.cakeType = btn.id;
                        e.BM._buttons[btn.id].backgroundImage = a.makeImageUrl(btn.id + '_f.gif');
                        e.BM.requestFocus('btn_start');
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'btn_game_over_sure':
                        LMActivity.Router.reload();
                        break;
                    case 'btn_exchange_rank':
                        Activity.renderRankList(Activity.rankData.total_rank, Activity.rankData.my_rank);
                        LMActivity.triggerModalButton = btn.id;
                        LMActivity.showModal({
                            id: 'rank_list',
                            focusId: ''
                        });
                        break;
                }
            },
            goCall: function () {
                if (true == LMActivity.playStatus) {
                    return;
                }
                LMActivity.playStatus = true;
                if (a.hasLeftTime()) {
                    a.AjaxHandler.uploadPlayRecord(function () {
                        G("left_times").innerHTML = r.leftTimes - 1;
                        a.showModal({
                            id: 'game_success',
                            focusId: 'btn_game_sure',
                            onDismissListener: function () {
                                a.Router.reload();
                            }
                        });
                    }, function () {
                        LMEPG.UI.showToast('扣除游戏次数出错', 3);
                    });
                } else {
                    LMActivity.playStatus = false;
                    a.showGameStatus('btn_game_over_sure');
                }
            },
            addScore: function (score, cakeType, successFn, errorFn) {
                var cakeTypeValue = 0;
                switch (cakeType) {
                    case 'btn_wuren_cake':
                        cakeTypeValue = 1;
                        break;
                    case 'btn_danhuang_cake':
                        cakeTypeValue = 2;
                        break;
                    case 'btn_huotui_cake':
                        cakeTypeValue = 3;
                        break;
                    case 'btn_furong_cake':
                        cakeTypeValue = 4;
                        break;
                }
                var params = {
                    postData: {
                        'score': score,
                        'remark': '用户积分,type=' + cakeTypeValue
                    },
                    path: 'NewActivity/addUserScore'
                };
                params.successCallback = successFn;
                params.errorCallback = errorFn;
                LMActivity.ajaxPost(params);
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init(Activity.startFocus, Activity.buttons, true);
            },
            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },
            onBack: function () {
                if (LMActivity.shownModal) {
                    if (typeof (LMActivity.playStatus) != 'undefined') {
                        clearInterval(LMActivity.countInterval);
                    }

                    if (LMActivity.playStatus) {
                        LMActivity.Router.reload();
                    } else {
                        LMActivity.hideModal(LMActivity.shownModal);
                    }
                } else {
                    LMActivity.exitActivity();
                }
            },
            getRankData: function () {
                var autoRank = function (rank) {
                    for (var i = 1; i < 5; i++) {
                        var res = rank.filter(function (v) {
                            return v.cake_type == i;
                        });
                        if (res.length === 0) {
                            rank.push({
                                cake_type: i,
                                cnt: 0
                            });
                        }
                    }
                };
                LMEPG.ajax.postAPI('Activity/getUserRank', null,
                    function (rsp) { // 网络请求成功
                        if (rsp.result == 0) {// 接口调用成功
                            Activity.rankData = rsp.data;
                            autoRank(Activity.rankData.total_rank);
                        } else {
                            autoRank(Activity.rankData.total_rank);
                        }
                        Activity.setBtnFocus();
                        Activity.initButtons();
                    }, function () { // 网络请求失败
                        autoRank(Activity.rankData.total_rank);
                        Activity.initButtons();
                    }
                );
            },
            setBtnFocus: function () {
                if (Activity.rankData.my_rank.length === 0) {
                    return;
                }

                switch (parseInt(Activity.rankData.my_rank[0].cake_type)) {
                    case 1:
                        Activity.cakeType = 'btn_wuren_cake';
                        break;
                    case 2:
                        Activity.cakeType = 'btn_danhuang_cake';
                        break;
                    case 3:
                        Activity.cakeType = 'btn_huotui_cake';
                        break;
                    case 4:
                        Activity.cakeType = 'btn_furong_cake';
                        break;
                }
                var bg = a.makeImageUrl(Activity.cakeType + '_f.gif');
                $(Activity.cakeType).src = bg;

                Activity.startFocus = 'btn_start';

                Activity.buttons.map(function (v) {
                    switch (v.id) {
                        case 'btn_start':
                            v.nextFocusUp = 'btn_exchange_rank';
                            break;
                        case 'btn_exchange_rank':
                            v.nextFocusDown = 'btn_start';
                            v.nextFocusLeft = '';
                            break;
                        case 'btn_back':
                        case 'btn_activity_rule':
                        case 'btn_winner_list':
                        case 'btn_exchange_prize':
                            v.nextFocusLeft = '';
                            break;
                    }
                });

            },
            cakeName: {
                "1": '五仁月饼',
                "2": '蛋黄月饼',
                "3": '火腿月饼',
                "4": '莲蓉月饼'
            },
            renderRankList: function (totalRank, myRank) {
                var htm = '<table id="all_rank_table" class="rank_table">';
                for (var i = 0; i < totalRank.length; i++) {
                    htm += '<tr>'
                        + '<td class="cake_name">'
                        + (i + 1) + ' ' + Activity.cakeName[totalRank[i].cake_type]
                        + '</td>'
                        + '<td class="rank_table_empty"></td>'
                        + '<td class="cake_cnt">'
                        + totalRank[i].cnt
                        + '</td>'
                        + '</tr>';
                }
                htm += '</table>';

                // 当前登录用户中奖信息
                var myHtm = '<table id="my_rank_table" class="rank_table">';
                for (var i = 0; i < myRank.length; i++) {
                    myHtm += '<tr>'
                        + '<td class="cake_name">'
                        + Activity.cakeName[myRank[i].cake_type]
                        + '</td>'
                        + '<td class="rank_table_empty"></td>'
                        + '<td class="cake_cnt">'
                        + myRank[i].cnt
                        + '</td>'
                        + '</tr>';
                }
                myHtm += '</table>';

                $('my_rank_list').innerHTML = myHtm;
                $('total_rank_list').innerHTML = htm;
            },
            beforeMoveChange: function (direction, btn) {
                switch (btn.id) {
                    case 'btn_start':
                        if (direction != 'up' || Activity.rankData.my_rank.length > 0) {
                            break;
                        }
                        var bg = a.makeImageUrl(Activity.cakeType + '.png');
                        $(Activity.cakeType).src = bg;
                        e.BM._buttons[Activity.cakeType].backgroundImage = bg;
                        Activity.cakeType = null;
                        break;
                }
            },
        };
        Activity.buttons = [
            {
                id: 'btn_wuren_cake',
                name: '按钮-五仁月饼',
                type: 'img',
                nextFocusLeft: 'btn_furong_cake',
                nextFocusRight: 'btn_danhuang_cake',
                nextFocusUp: 'btn_exchange_rank',
                backgroundImage: a.makeImageUrl('btn_wuren_cake.png'),
                focusImage: a.makeImageUrl('btn_wuren_cake_f.gif'),
                click: Activity.eventHandler
            },
            {
                id: 'btn_danhuang_cake',
                name: '按钮-蛋黄月饼',
                type: 'img',
                nextFocusLeft: 'btn_wuren_cake',
                nextFocusRight: 'btn_huotui_cake',
                nextFocusUp: 'btn_exchange_rank',
                backgroundImage: a.makeImageUrl('btn_danhuang_cake.png'),
                focusImage: a.makeImageUrl('btn_danhuang_cake_f.gif'),
                click: Activity.eventHandler
            },
            {
                id: 'btn_huotui_cake',
                name: '按钮-火腿月饼',
                type: 'img',
                nextFocusLeft: 'btn_danhuang_cake',
                nextFocusRight: 'btn_furong_cake',
                nextFocusUp: 'btn_exchange_rank',
                backgroundImage: a.makeImageUrl('btn_huotui_cake.png'),
                focusImage: a.makeImageUrl('btn_huotui_cake_f.gif'),
                click: Activity.eventHandler
            },
            {
                id: 'btn_furong_cake',
                name: '按钮-芙蓉月饼',
                type: 'img',
                nextFocusLeft: 'btn_huotui_cake',
                nextFocusRight: 'btn_wuren_cake',
                nextFocusUp: 'btn_exchange_rank',
                backgroundImage: a.makeImageUrl('btn_furong_cake.png'),
                focusImage: a.makeImageUrl('btn_furong_cake_f.gif'),
                click: Activity.eventHandler
            },
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: 'btn_wuren_cake',
                nextFocusUp: '',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: 'btn_wuren_cake',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusLeft: 'btn_wuren_cake',
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
                backgroundImage: a.makeImageUrl('btn_common_sure1.png'),
                focusImage: a.makeImageUrl('btn_common_sure1_f.png'),
                listType: 'lottery',
                click: Activity.eventHandler
            }, {
                id: 'btn_game_fail_sure',
                name: '游戏未完产成页确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure1.png'),
                focusImage: a.makeImageUrl('btn_common_sure1_f.png'),
                listType: 'lottery',
                click: Activity.eventHandler
            },
            {
                id: 'btn_exchange_rank',
                name: '美味榜单',
                type: 'img',
                nextFocusLeft: 'btn_wuren_cake',
                nextFocusUp: 'btn_exchange_prize',
                nextFocusDown: 'btn_wuren_cake',
                nextFocusRight: "btn_exchange_prize",
                backgroundImage: a.makeImageUrl('btn_exchange_rank.png'),
                focusImage: a.makeImageUrl('btn_exchange_rank_f.png'),
                click: Activity.eventHandler
            },
            {
                id: 'btn_start',
                name: '游戏开始',
                type: 'img',
                nextFocusLeft: '',
                nextFocusUp: 'btn_wuren_cake',
                nextFocusDown: '',
                nextFocusRight: "",
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                click: Activity.eventHandler
            }, {
                id: 'btn_exchange_prize',
                name: '兑换礼品',
                type: 'img',
                nextFocusLeft: 'btn_wuren_cake',
                nextFocusUp: 'btn_winner_list',
                nextFocusDown: 'btn_exchange_rank',
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
                backgroundImage: a.makeImageUrl('btn_common_sure1.png'),
                focusImage: a.makeImageUrl('btn_common_sure1_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_exchange_cancel',
                name: '按钮-兑换成功-取消',
                type: 'img',
                nextFocusUp: 'exchange_tel',
                nextFocusLeft: 'btn_exchange_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel1.png'),
                focusImage: a.makeImageUrl('btn_common_cancel1_f.png'),
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
                click: Activity.eventHandler
            }, {
                id: 'btn_order_submit',
                name: '按钮-订购VIP',
                type: 'img',
                nextFocusRight: 'btn_order_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure1.png'),
                focusImage: a.makeImageUrl('btn_common_sure1_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_order_cancel',
                name: '按钮-取消订购VIP',
                type: 'img',
                nextFocusLeft: 'btn_order_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel1.png'),
                focusImage: a.makeImageUrl('btn_common_cancel1_f.png'),
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
                id: 'cat',
                name: '猫咪',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('cat1.png'),
                focusImage: a.makeImageUrl('cat1.png'),
                beforeMoveChange: Activity.pickUp
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

var specialBackArea = ['460092', "410092", '220094', '220095', '10220094','371092','371002'];

function outBack() {
    if (specialBackArea.indexOf(RenderParam.carrierId) > -1) {
        var objSrc = LMActivity.Router.getCurrentPage();
        var objHome = LMEPG.Intent.createIntent('home');
        LMEPG.Intent.jump(objHome, objSrc);
    }
}