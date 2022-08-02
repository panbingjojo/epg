(function (w, e, r, a) {
    var Activity = {
        starIndex: 0,
        positionHd: [0, 90, 180, 270, 360, 450, 620],
        positionSd: [0, 50, 110, 170, 230, 290, 380],
        positionX: [],
        scoreY: [0, 3, 6, 9, 12, 15, 18],
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
            w.carRun = new animal("switch", {
                id: "animal-bg",
                end: 4,
                speed: 500,
                imgUrl: LMActivity.makeImageUrl('animal_bg_')
            }, "")
            w.cuntDown = new animal("cuntDown", {
                id: "animal-timer",
                end: 15,
                speed: 1000
            }, function (self) {
                cuntDown.clearTimer("switch");
                if (Activity.starIndex > 0) {
                    Activity.doAddScore(Activity.scoreY[Activity.starIndex]);
                } else {
                    LMActivity.showModal({
                        id: 'game_fail',
                        focusId: 'btn_fail',
                    });
                }
            })
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V000051';
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
            G("btn_order_1").src = r.areaCode == "216" ? a.makeImageUrl('216/btn_order_1.png') : a.makeImageUrl('209/btn_order_1.png');
            G("btn_order_2").src = r.areaCode == "216" ? a.makeImageUrl('216/btn_order_2.png') : a.makeImageUrl('209/btn_order_2.png');
            G("btn_order_3").src = r.areaCode == "216" ? a.makeImageUrl('216/btn_order_3.png') : a.makeImageUrl('209/btn_order_3.png');
            G("btn_order_4").src = r.areaCode == "216" ? a.makeImageUrl('216/btn_order_4.png') : a.makeImageUrl('209/btn_order_4.png');


            G("dg_order_1").src = r.areaCode == "216" ? a.makeImageUrl('216/btn_order_2.png') : a.makeImageUrl('209/btn_order_2.png');
            G("dg_order_2").src = r.areaCode == "216" ? a.makeImageUrl('216/btn_order_1.png') : a.makeImageUrl('209/btn_order_1.png');
            G("dg_order_3").src = r.areaCode == "216" ? a.makeImageUrl('216/btn_order_3.png') : a.makeImageUrl('209/btn_order_3.png');
            G("dg_order_4").src = r.areaCode == "216" ? a.makeImageUrl('216/btn_order_4.png') : a.makeImageUrl('209/btn_order_4.png');

            if (RenderParam.areaCode == "216") {
                document.body.style.backgroundImage = 'url(' + a.makeImageUrl('bg_home_sd.png') + ')';
            }
        },

        initButtons: function () {
            e.BM.init('btn-start', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
        },
        playGame: function () {
            carRun.init();
            Activity.addStart();
        },
        addStart: function () {
            if (RenderParam.platformType == "hd") {
                Activity.positionX = Activity.positionHd;
            } else {
                Activity.positionX = Activity.positionSd;
            }
            if (Activity.starIndex < 6) {
                Activity.starIndex++;
                if (Activity.starIndex > 1) {
                    G("start-" + (Activity.starIndex - 1)).src = a.makeImageUrl('icon_yes.png')
                }
                G("start-" + Activity.starIndex).src = a.makeImageUrl(RenderParam.pathCode + '/status_' + Activity.starIndex + '.png');
                G("bar-man").style.left = Activity.positionX[Activity.starIndex] + "px";
                G("bar-box").style.width = Activity.positionX[Activity.starIndex] + "px";
                // alert(G("bar-man").style.left);
            }
        },

        doAddScore: function (score) {
            // 保存积分
            a.AjaxHandler.addScore(score, function () {
                a.showModal({
                    id: 'game_success',
                    focusId: 'btn_game_success',
                    onDismissListener: function () {
                        a.Router.reload(); // 重新加载
                    }
                });
                G("add_score").innerHTML = score;

            }, function () {
                LMEPG.UI.showToast('添加助力值失败', 2);
            });
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_knowledge':
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.showModal({
                        id: 'modal-knowledge',
                        focusId: ''
                    });
                    break;
                case 'btn_game_success':
                case 'btn_fail':
                    a.Router.reload(); // 重新加载
                    break;
                case 'btn-start':
                    LMActivity.triggerModalButton = btn.id;
                    LMActivity.playStatus = true;
                    if (a.hasLeftTime()) {
                        a.AjaxHandler.uploadPlayRecord(function () {
                            LMActivity.showModal({
                                id: 'play_game',
                                focusId: 'btn-play',
                            });
                            cuntDown.clearTimer("cuntDown");
                            cuntDown.init();
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数失败', 2);
                        });

                    } else if (Union.hasNoOrderSp()) {
                        LMActivity.showModal({
                            id: 'order_vip',
                            focusId: 'dg_order_1'
                        });
                    } else {
                        a.showGameStatus();
                    }
                    break;
                case 'btn-play':
                    Activity.playGame();
                    break;
            }
        }
    };
    var Union = {
        // 跳转到 教育健康
        jumpHAlbum: function () {
            LMActivity.AjaxHandler.saveData("1008013", 1, function () {

            }, function () {
                LMEPG.UI.showToast('状态更改失败', 2);
            })

            var objCurrent = LMActivity.Router.getCurrentPage();
            objCurrent.setParam("focusIndex", "");

            var objAlbum = LMEPG.Intent.createIntent('album');
            objAlbum.setParam('albumName', "album231");
            objAlbum.setParam('inner', 1);
            if (r.demoTimes == "0") {
                objAlbum.setParam('addScore', 1);
            } else {
                objAlbum.setParam('addScore', 0);
            }
            LMEPG.Intent.jump(objAlbum, objCurrent);
        },
        //判断是否订购图片切换
        isPay: function (btn, hasFocus) {
            if (hasFocus) {
                try {
                    var spInfo = Union.getSpInfoByProductId(btn.contentId);
                    spInfo = spInfo instanceof Object ? spInfo : JSON.parse(spInfo);

                    // 当status==1时，表示已经订购该产品
                    if (spInfo.status == 1) {
//                        LMEPG.UI.showWaitingDialog("", 1);
//                        btn.focusImage = btn.alreadyPay;
                        G(btn.id).src = btn.selectImage;
//                        btn.focusImage = btn.alreadyPay;
                    }
                } catch (e) {
                    LMEPG.UI.showToast("判断用户是否订购出现异常！\n" + e.toString());
                    LMEPG.Log.error(e.toString());
                }
            }
        },
        // jsonToArry: function () {
        //     for (var i = 0; i < r.spMap2.length; i++) {
        //         r.spMap.push(r.spMap2[i]);1
        //     }
        //     return r.spMap;
        // },
        /**
         * 在游戏引导页，当点击对应的商品时，如果该产品已经订购，就直接进去产品对应的应用首页
         * 如果该产品没有订购，就跳去订购该产品
         */
        bookUnion: function (btn) {
            try {
                var spInfo = Union.getSpInfoByProductId(btn.contentId);
                spInfo = spInfo instanceof Object ? spInfo : JSON.parse(spInfo);

                // 当status==1时，表示已经订购该产品
                if (spInfo.status == 1) {
                    Union.jumpThirdPartySP(spInfo.contentId); //跳转到其他第三方sp
                } else {
                    if (isDirectOrder) {
                        Union.unionBuyVip(spInfo.contentId);  //直接跳到局方订购页
                    } else {
                        // jumpDialogFirstOrder(btn.productId, btn.name);
//                    jumpUniActivityInfo(spInfo.contentId);  //跳转到订购弹窗，显示商品信息
                    }
                }
            } catch (e) {
                LMEPG.UI.showToast("判断用户是否订购出现异常！\n" + e.toString());
                LMEPG.Log.error(e.toString());
            }
        },
        /**
         * 根据商品productId来确定sp信息 --> [39健康 智慧星球 风车乐园 乐享音乐]
         */
        getSpInfoByProductId: function (contentId) {
            for (var i = 0, size = r.spMap.length; i < size; i++) {
                var itemObj = JSON.parse(r.spMap[i]);
                if (itemObj.contentId == contentId) {
                    return itemObj;
                }
            }
            throw "没有contentId:" + productId + "的产品";
        },
        /**
         * 判断是否还有未订购的sp
         */
        hasNoOrderSp: function () {
            if (LMEPG.Func.isArray(r.spMap)) {
                for (var i = 0; i < 4; i++) {
                    var spItem = JSON.parse(r.spMap[i]);
                    if (spItem.status == 0) {
                        return true;
                    }
                }
            }
            return false;
        },


        /**
         *  按产品规则计算，当回到当前活动首页时，默认焦点落在哪个联合产品按钮上。
         */
        getDefFocusBtnOfUnionProduct: function () {
            return leftTimes > 0 ? "btn-start" /*“抢月饼”按钮*/ : getFirstUnBuyVIPUnionProduct();
        },

        /**
         * 按产品定制规则，筛选出符合条件的、按既定顺序的、第一个未订购的产品。如果没有，默认为39健康产品。
         */
        getFirstUnBuyVIPUnionProduct: function () {
            var btnArray = [];
            for (var i = 1; i <= 4; i++) {
                btnArray["product" + i] = "btn-book" + i;
            }

            for (var productId in btnArray) {
                var product = Union.getProductItemObj(productId);
                if (typeof product !== "undefined" && null != product) {
                    if (product.status != 1) { // 未订购过的产品
                        return btnArray[productId];
                    }
                }
            }

            return LM39_PRODUCT.elementId; // 默认情况焦点位于39健康产品
        },
        // 跳转到其他第三方sp
        jumpThirdPartySP: function (contentId) {
            var objCurrent = LMActivity.Router.getCurrentPage();
            var objThirdPartySP = LMEPG.Intent.createIntent("activity-common-thirdPartySP");

            objThirdPartySP.setParam("userId", r.userId);
            objThirdPartySP.setParam("contentId", contentId);
            LMEPG.Intent.jump(objThirdPartySP, objCurrent);
        },

        /**
         * 根据html排列元素自定义属性“productId”，找到一一对应的相应联合产品。
         * @param productId 自定义属性“productId”，表示的是第几个产品
         */
        getProductItemObj: function (productId) {
            try {
                var spInfoItem = Union.getSpInfoByProductId(productId);
                spInfoItem = spInfoItem instanceof Object ? spInfoItem : JSON.parse(spInfoItem);
                return spInfoItem;
            } catch (e) {
                console.log("--------getFirstUnbookedProduct()-------" + e.toString());
                return null;
            }
        },
        /**
         * @func 进行购买操作
         * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
         * @returns {boolean}
         */
        unionBuyVip: function (contentId) {
            var objCurrent = LMActivity.Router.getCurrentPage();

            var objOrderHome = LMEPG.Intent.createIntent("orderHome");
            objOrderHome.setParam("userId", r.userId);

            objOrderHome.setParam("directPay", "1");
            objOrderHome.setParam("orderReason", "101");
            objOrderHome.setParam("contentId", contentId); // sp订购的内容id
            objOrderHome.setParam("isJointActivity", "1"); // 表示联合活动
            objOrderHome.setParam("remark", "JointActivityWomenDay20200225");

            var objActivityGuide = LMEPG.Intent.createIntent("activity-common-index");
            objActivityGuide.setParam("userId", r.userId);
            objActivityGuide.setParam("inner", r.inner);
            objActivityGuide.setParam("isOrderBack", "1"); // 表示订购回来

            LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
        }
    };


    Activity.exchangePrizeButtons = [
        {
            id: 'exchange_prize_1',
            name: '按钮-兑换一等奖',
            type: 'img',
            nextFocusLeft: 'exchange_prize_3',
            nextFocusRight: 'exchange_prize_2',
            backgroundImage: a.makeImageUrl('btn_exchange_unable.png'),
            focusImage: a.makeImageUrl('btn_exchange_unable_f.png'),
            order: 1,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换二等奖',
            type: 'img',
            nextFocusRight: 'exchange_prize_3',
            nextFocusLeft: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_unable.png'),
            focusImage: a.makeImageUrl('btn_exchange_unable_f.png'),
            order: 0,
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换三等奖',
            type: 'img',
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_unable.png'),
            focusImage: a.makeImageUrl('btn_exchange_unable_f.png'),
            order: 2,
            click: a.eventHandler
        }
    ];

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusDown: 'btn_knowledge',
            nextFocusLeft: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: 'btn_winner_list',
            nextFocusUp: '',
            nextFocusRight: 'btn_knowledge',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: '',
            nextFocusRight: '',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusDown: 'btn_exchange_prize',
            nextFocusRight: 'btn_knowledge',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换奖品',
            type: 'img',
            nextFocusDown: 'btn_order_1',
            nextFocusUp: 'btn_winner_list',
            nextFocusRight: 'btn_knowledge',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            exchangePrizeButtons: Activity.exchangePrizeButtons,
            exchangeFocusId: '',
            moveType: 1,
            click: a.eventHandler
        }, {
            id: 'btn_knowledge',
            name: '按钮-美景汇',
            type: 'img',
            nextFocusDown: r.platformType === 'hd' ? 'btn_order_4' : 'btn_order_3',
            nextFocusUp: 'btn_back',
            nextFocusRight: '',
            nextFocusLeft: r.platformType === 'hd' ? 'btn_order_4' : 'btn_winner_list',
            backgroundImage: a.makeImageUrl('jump_knowledge.png'),
            focusImage: a.makeImageUrl('jump_knowledge_f.png'),
            click: Union.jumpHAlbum
        }, {
            id: 'btn-start',
            name: '开始游戏按钮',
            type: 'img',
            nextFocusUp: '',
            nextFocusRight: 'btn_order_3',
            nextFocusLeft: r.platformType === 'hd' ? 'btn_order_2' : 'btn_order_1',
            backgroundImage: a.makeImageUrl('btn_start.png'),
            focusImage: a.makeImageUrl('btn_start_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: r.platformType === 'sd' ? "reset_tel" : "",
            nextFocusLeft: r.platformType === 'hd' ? "reset_tel" : "",
            nextFocusRight: 'btn_list_cancel',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_list_cancel',
            name: '按钮-中奖名单-取消',
            type: 'img',
            nextFocusLeft: 'btn_list_submit',
            nextFocusUp: r.platformType === 'sd' ? "reset_tel" : "",
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'reset_tel',
            name: '输入框-中奖名单-重置电话号码',
            type: 'div',
            nextFocusRight: r.platformType === 'hd' ? 'btn_list_submit' : '',
            nextFocusDown: r.platformType === 'hd' ? '' : 'btn_list_submit',
            backFocusId: 'btn_list_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_game_success',
            name: '按钮-游戏成功',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_fail',
            name: '按钮-游戏成功',
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
            click: a.eventHandler
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_tel',
            name: '输入框-兑换成功-电话号码',
            type: 'div',
            nextFocusDown: 'btn_exchange_submit',
            backFocusId: 'btn_exchange_submit',
            focusChange: a.onInputFocus,
            click: Activity.eventHandler
        }, {
            id: 'btn_exchange_submit',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusRight: 'btn_exchange_cancel',
            nextFocusUp: 'exchange_tel',
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
        },
        {
            id: 'btn-play',
            name: '按钮-兑换成功-确定',
            type: 'img',
            nextFocusRight: 'btn_game_over_sure',
            nextFocusUp: 'btn_game_over_sure',
            backgroundImage: a.makeImageUrl('btn_play.png'),
            focusImage: a.makeImageUrl('btn_play_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_over_sure',
            name: '按钮-兑换成功-取消',
            type: 'img',
            nextFocusLeft: 'btn-play',
            nextFocusDown: 'btn-play',
            backgroundImage: a.makeImageUrl('btn_close.png'),
            focusImage: a.makeImageUrl('btn_close_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_order_1',
            name: '产品1',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: r.platformType === 'hd' ? 'btn_order_4' : "btn_order_3",
            nextFocusRight: r.platformType === 'hd' ? 'btn_order_2' : 'btn-start',
            nextFocusDown: r.platformType === 'hd' ? '' : 'btn_order_2',
            backgroundImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_1.png') : a.makeImageUrl('209/btn_order_1.png'),
            focusImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_1_f.png') : a.makeImageUrl('209/btn_order_1_f.png'),
            selectImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_1_select.png') : a.makeImageUrl('209/btn_order_1_select.png'),
            productId: "",
            contentId: "qzlyx",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'btn_order_2',
            name: '产品2',
            type: 'img',
            nextFocusUp: r.platformType === 'hd' ? 'btn_exchange_prize' : "btn_order_1",
            nextFocusLeft: r.platformType === 'hd' ? 'btn_order_1' : "btn_order_4",
            nextFocusRight: 'btn-start',
            backgroundImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_2.png') : a.makeImageUrl('209/btn_order_2.png'),
            focusImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_2_f.png') : a.makeImageUrl('209/btn_order_2_f.png'),
            selectImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_2_select.png') : a.makeImageUrl('209/btn_order_2_select.png'),
            productId: "",
            contentId: "sjjklinux",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'btn_order_3',
            name: '产品3',
            type: 'img',
            nextFocusUp: 'btn_knowledge',
            nextFocusLeft: 'btn-start',
            nextFocusDown: r.platformType === 'hd' ? '' : 'btn_order_4',
            nextFocusRight: r.platformType === 'hd' ? 'btn_order_4' : "btn_order_1",
            backgroundImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_3.png') : a.makeImageUrl('209/btn_order_3.png'),
            focusImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_3_f.png') : a.makeImageUrl('209/btn_order_3_f.png'),
            selectImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_3_select.png') : a.makeImageUrl('209/btn_order_3_select.png'),
            productId: "",
            contentId: r.areaCode == "216" ? "drlxyy" : "yyly",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'btn_order_4',
            name: '产品4',
            type: 'img',
            nextFocusUp: r.platformType === 'hd' ? 'btn_knowledge' : "btn_order_3",
            nextFocusLeft: r.platformType === 'hd' ? 'btn_order_3' : "btn-start",
            nextFocusRight: 'btn_order_1',
            backgroundImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_4.png') : a.makeImageUrl('209/btn_order_4.png'),
            focusImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_4_f.png') : a.makeImageUrl('209/btn_order_4_f.png'),
            selectImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_4_select.png') : a.makeImageUrl('209/btn_order_4_select.png'),
            productId: "",
            contentId: r.areaCode == "216" ? "zc" : "drlxyy",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'dg_order_1',
            name: '产品1',
            type: 'img',
            nextFocusLeft: 'dg_order_4',
            nextFocusRight: 'dg_order_2',
            nextFocusDown: r.platformType === 'hd' ? '' : 'dg_order_3',
            backgroundImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_2.png') : a.makeImageUrl('209/btn_order_2.png'),
            focusImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_2_f.png') : a.makeImageUrl('209/btn_order_2_f.png'),
            selectImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_2_select.png') : a.makeImageUrl('209/btn_order_2_select.png'),
            contentId: "sjjklinux",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'dg_order_2',
            name: '产品2',
            type: 'img',
            nextFocusLeft: 'dg_order_1',
            nextFocusRight: 'dg_order_3',
            nextFocusDown: r.platformType === 'hd' ? '' : 'dg_order_4',
            backgroundImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_1.png') : a.makeImageUrl('209/btn_order_1.png'),
            focusImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_1_f.png') : a.makeImageUrl('209/btn_order_1_f.png'),
            selectImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_1_select.png') : a.makeImageUrl('209/btn_order_1_select.png'),
            productId: "",
            contentId: "qzlyx",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'dg_order_3',
            name: '产品3',
            type: 'img',
            nextFocusUp: r.platformType === 'hd' ? '' : "dg_order_1",
            nextFocusLeft: 'dg_order_2',
            nextFocusRight: 'dg_order_4',
            backgroundImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_3.png') : a.makeImageUrl('209/btn_order_3.png'),
            focusImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_3_f.png') : a.makeImageUrl('209/btn_order_3_f.png'),
            selectImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_3_select.png') : a.makeImageUrl('209/btn_order_3_select.png'),
            contentId: r.areaCode == "216" ? "drlxyy" : "yyly",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'dg_order_4',
            name: '产品4',
            type: 'img',
            nextFocusUp: r.platformType === 'hd' ? '' : "dg_order_2",
            nextFocusLeft: 'dg_order_3',
            nextFocusRight: 'dg_order_1',
            backgroundImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_4.png') : a.makeImageUrl('209/btn_order_4.png'),
            focusImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_4_f.png') : a.makeImageUrl('209/btn_order_4_f.png'),
            selectImage: r.areaCode == "216" ? a.makeImageUrl('216/btn_order_4_select.png') : a.makeImageUrl('209/btn_order_4_select.png'),
            contentId: r.areaCode == "216" ? "zc" : "drlxyy",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }
        , {
            id: 'intercept-back',
            name: '产品3',
            type: 'img',
            nextFocusLeft: 'btn-go',
            nextFocusDown: 'btn-go',
            backgroundImage: a.makeImageUrl('btn_home_back.png'),
            focusImage: a.makeImageUrl('btn_home_back_f.png'),
            click: LMActivity.innerBack,
        }, {
            id: 'btn-go',
            name: '产品4',
            type: 'img',
            nextFocusUp: "intercept-back",
            nextFocusRight: "intercept-back",
            backgroundImage: a.makeImageUrl('btn_go.png'),
            focusImage: a.makeImageUrl('btn_go_f.png'),
            click: a.eventHandler
        }
    ];

    w.Activity = Activity;

    function Animals(type, element, callBack) {
        this.element = element;//动画参数数组，第一个为id，第二个为动画累加参数;三个为回调
        this.callBack = callBack;
        this.type = type;
        this.index = 0;
        this.SwitchImgTimer = null;
        this.cuntDowntimer = null;
    }

    Animals.prototype.init = function () {
        var that = this;
        switch (that.type) {
            case "switch":
                this.switchImg();
                break;
            case "cuntDown":
                this.cuntDown();
                break;
            default:
                break;
        }
    };
    Animals.prototype.clearTimer = function (type) {
//            var that = this;
        switch (type) {
            case "switch":
                clearInterval(this.SwitchImgTimer);
                break;
            case "cuntDown":
                clearInterval(this.cuntDowntimer);
                break;
            default:
                break;
        }
    };
    //    图片切换动画
    Animals.prototype.switchImg = function () {
        LMEPG.ButtonManager.setKeyEventPause(true);
        var that = this;
        that.SwitchImgTimer = setInterval(function () {
            that.index++;
            if (that.element instanceof Object) {
                G(that.element.id).src = that.element.imgUrl + that.index + ".png";
            }
            if (that.index == that.element.end) {
                that.index = 0;
                that.clearTimer("switch");
                LMEPG.ButtonManager.setKeyEventPause(false);
            }
        }, that.element.speed);
    };
    //   倒计时
    Animals.prototype.cuntDown = function () {
        var that = this;
        that.index = that.element.end;
        that.cuntDowntimer = setInterval(function () {
            that.index--;
            if (that.element instanceof Object) {
                G(that.element.id).innerHTML = that.index;
            }
            if (that.index == 0) {
                that.index = 0;
                G(that.element.id).innerHTML = that.index
                that.clearTimer("cuntDown");
                LMEPG.call(that.callBack, that);
            }
        }, that.element.speed);
    };

    w.animal = Animals;
})(window, LMEPG, RenderParam, LMActivity);