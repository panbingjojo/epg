(function (w, e, r, a) {
    var Activity = {
        keyCookie: r.activityName + r.userId,    //cookie键值，用于判断用户是否1分钟内反复点击产品订购
        playStatus: false,
        score: 0,
        times: 0,
        unionInfo: [
            {
                "area": [
                    {"product_id": "sjjklinux", "img": "1"},
                    {"product_id": "mdy", "img": "2"},
                    {"product_id": "klxq", "img": "3"},
                    {"product_id": "drlxyy", "img": "4"},
                ]
            },
            {
                "area": [
                    {"product_id": "sjjklinux", "img": "1"},
                    {"product_id": "hnjyzq", "img": "2"},
                    {"product_id": "hxlm", "img": "3"},
                    {"product_id": "wkly", "img": "4"},
                ]
            },
            {
                "area": [
                    {"product_id": "sjjklinux", "img": "1"},
                    {"product_id": "qzlyx", "img": "2"},
                    {"product_id": "hlgf", "img": "3"},
                    {"product_id": "wjjs", "img": "4"},
                ]
            },
        ],
        playerInfo: [
            {"name": 111, "vote": 0, "img": "icon_congee_2"},
            {"name": 222, "vote": 0, "img": "icon_congee_1"},
            {"name": 333, "vote": 0, "img": "icon_congee_3"}
        ],
        init: function () {
            Activity.initGameData();
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
            Activity.times = (parseInt(G("left_times").innerHTML) + parseInt(r.extraTimes));
            G("left_times").innerHTML = Activity.times;
        },

        hasLeftTimeS: function () {
            return Activity.times > 0;
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V' + r.lmcid;
            // 活动规则
            G('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
            // 兑换奖品
            G('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';
            Activity.setOrderImg();
            // 记录订购成功回来时间，用于判断一分钟内可点击
            if (r.cOrderResult == '1') {
                LMEPG.Cookie.setCookie(Activity.keyCookie, new Date().getTime());
            }


        },

        setOrderImg: function () {
            var product = 4
            for (var i = 0; i < product; i++) {
                G("btn_order_" + (i + 1)).src = a.makeImageUrl('' + r.areaCode + '/btn_order_' + (i + 1) + '.png');
            }
            if (r.areaCode == "216" && r.accountId.substring(0, 3) != "cut") {
                G('btn_order_4').parentNode.removeChild(G('btn_order_4'))
            }
        },


        initGameData: function () {
            LMEPG.UI.showWaitingDialog();
            Activity.getVote();
        },
        reRank: function (data) {
            var t = 0;
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < data.length; j++) {
                    if (parseInt(data[i].vote) < parseInt(data[j].vote)) {
                        t = data[i];
                        data[i] = data[j];
                        data[j] = t;
                    }
                }
            }
            this.showVote(data);
        },
        showVote: function (data) {
            G("first").innerHTML = data[2].vote;
            G("second").innerHTML = data[1].vote;
            G("third").innerHTML = data[0].vote;
            G("vote-img-1").src = a.makeImageUrl(data[1].img + '.png');
            G("vote-img-2").src = a.makeImageUrl(data[2].img + '.png');
            G("vote-img-3").src = a.makeImageUrl(data[0].img + '.png');
            LMEPG.UI.dismissWaitingDialog();
        },


        initButtons: function () {
            var tempData = "";
            if (r.areaCode == "216") {
                tempData = Activity.unionInfo[0]
            } else if (r.areaCode == "208") {
                tempData = Activity.unionInfo[1]
            } else if (r.areaCode == "207") {
                tempData = Activity.unionInfo[2]
            } else {
                tempData = Activity.unionInfo[1]
            }
            // LMEPG.UI.logPanel.show(tempData)
            // LMEPG.UI.logPanel.show(tempData.area.length)
            var i = tempData.area.length;
            while (i--) {
                Activity.buttons.push({
                        id: 'btn_order_' + (i + 1),
                        name: '产品1',
                        type: 'img',
                        nextFocusUp: 'btn_start_2',
                        nextFocusLeft: 'btn_order_' + i,
                        nextFocusRight: 'btn_order_' + (i + 2),
                        nextFocusDown: "",
                        backgroundImage: a.makeImageUrl('' + r.areaCode + '/btn_order_' + (i + 1) + '.png'),
                        focusImage: a.makeImageUrl('' + r.areaCode + '/btn_order_' + (i + 1) + '_f.png'),
                        selectImage: a.makeImageUrl('' + r.areaCode + '/btn_order_' + (i + 1) + '_select.png'),
                        contentId: tempData.area[i].product_id,
                        click: Union.bookUnion,
                        focusChange: Union.isPay,
                    }
                )
                //     Activity.buttons.push(
                //         {
                //             id: 'dg_order_' + (i + 1),
                //             name: '产品1',
                //             type: 'img',
                //             nextFocusUp: '',
                //             nextFocusLeft: 'dg_order_' + i,
                //             nextFocusRight: 'dg_order_' + (i + 2),
                //             nextFocusDown: "",
                //             backgroundImage: a.makeImageUrl('' + r.areaCode + '/btn_order_' + (i + 1) + '.png'),
                //             focusImage: a.makeImageUrl('' + r.areaCode + '/btn_order_' + (i + 1) + '_f.png'),
                //             selectImage: a.makeImageUrl('' + r.areaCode + '/btn_order_' + (i + 1) + '_select.png'),
                //             contentId: tempData.area[i].product_id,
                //             click: Union.bookUnion,
                //             focusChange: Union.isPay,
                //         }
                //     )
            }
            e.BM.init('btn_start_2', Activity.buttons, true);
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_start_1':
                case 'btn_start_2':
                case 'btn_start_3':
                    a.triggerModalButton = btn.id;
                    LMActivity.playStatus = true;
                    // LMEPG.BM.setKeyEventPause(true);
                    if (Activity.hasLeftTimeS()) {
                        // 联合活动上报用户信息 
                        LMEPG.ajax.postAPI("Debug/sendUserBehaviourWeb", {
                            "type": 7,
                            "operateResult": r.activityName
                        }, LMEPG.emptyFunc(), LMEPG.emptyFunc());
                        a.AjaxHandler.uploadPlayRecord(function () {
                            Activity.doVote(btn);
                            // if (LMActivity.playStatus = 'false') {
                            //
                            // }
                        }, function () {
                            LMEPG.UI.showToast('扣除游戏次数出错', 3);
                        });

                    } else if (Union.hasNoOrderSp()) {
                        if (Union.hasOrderSp() < 1) {
                            // 订购产品数量少于1
                            Union.outBookUnion(Activity.GlMath());

                        } else {
                            LMActivity.showModal({
                                id: 'order_vip',
                                focusId: 'btn_game_fail_sure'
                            });
                        }
                    } else {
                        a.showGameStatus('btn_game_over_sure');
                    }
                    break;
                case 'btn_lottery_cancel':
                case 'btn_lottery_exit':
                case 'btn_game_fail_sure':
                case 'btn_game_sure':
                case 'btn_close_tips':
                    // 隐藏当前正在显示的模板
                    a.hideModal(a.shownModal);
                    break;
            }
        },
        //随机数概率计算
        GlMath: function () {
            var tempProduct = r.areaCode == "216" ? Activity.unionInfo[0] : (r.areaCode == "208" ? Activity.unionInfo[1] : Activity.unionInfo[2]);
            var product = 0;
            var randomKey = Math.random() * 10;
            if (randomKey > 0 && randomKey < 6) {
                // 百分之50%
                product = 0;
            } else if (randomKey > 5 && randomKey < 9) {
                // 百分之30%
                product = 1;
            } else if (randomKey == 9) {
                //百分之10%
                product = 2;
            } else if (randomKey == 10) {
                //百分之10%
                product = 0;
            }
            return tempProduct.area[product].product_id
        },

        startGame: function () {
            // LMActivity.playStatus = true;
        },
        doVote: function (btn) {
            var reqData = {
                "playerId": Activity.playerInfo[btn.playerId].name,
            };
            //  投票操作
            LMEPG.ajax.postAPI('Activity/setPlayerRote', reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;

                        if (result == 0) {
                            // Activity.showAddVote(btn.orderId);//投票成功！
                            LMEPG.UI.showToast("投票成功!");
                            Activity.checkGameResult(btn.playerId + 2)
                            // LMActivity.Router.reload();
                        } else {
                            LMEPG.UI.showToast("投票失败！");
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("投票异常，解析异常！");
                        LMEPG.Log.error(e.toString());
                        LMEPG.UI.logPanel.show("投票异常，解析异常！ " + e);
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("服务器异常");
                }
            );
        },
        getVote: function () {
            var reqData = {
                "playerId": "",
            };
            //  投票操作
            LMEPG.ajax.postAPI('Activity/getPlayerRote', reqData,
                function (rsp) {
                    console.log(rsp)
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;

                        if (result == 0) {
                            if (data.list.length > 0) {
                                for (var i = 0; i < data.list.length; i++) {
                                    for (var j = 0; j < Activity.playerInfo.length; j++) {
                                        if (data.list[i].player_id == Activity.playerInfo[j].name) {
                                            Activity.playerInfo[j].vote = data.list[i].total_point;
                                        }
                                    }
                                }
                            }
                            Activity.reRank(Activity.playerInfo);
                        } else {
                            LMEPG.UI.showToast("投票失败！");
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("获取投票异常，解析异常！");
                        LMEPG.Log.error(e.toString());
                        LMEPG.UI.logPanel.show("获取投票异常，解析异常！ " + e);
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("服务器异常");
                }
            );
        },

        checkGameResult: function (score) {
            a.AjaxHandler.addScore(parseInt(score), function () {
                $('add_count').innerHTML = String(score - 1);
                a.showModal({
                    id: 'game_success',
                    focusId: 'btn_game_sure',
                    onDismissListener: function () {
                        a.Router.reload(); // 重新加载
                    }
                });
            }, function () {
                LMEPG.UI.showToast('添加积分失败', 2);
            });
        },

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
                // 成功订购回来后点击未订购产品间隔小于1分钟
                var orderSuccessDt = LMEPG.Cookie.getCookie(Activity.keyCookie);
                var currDt = new Date().getTime();
                if (orderSuccessDt != '' && (currDt - orderSuccessDt < 60000) && spInfo.status != 1) {
                    LMEPG.UI.showToast("刚订购完一款产品，先去体验一下吧");
                    return;
                }
                // 产品订购量大于两款直接进入应用
                if (Union.hasOrderSp() >= 2) {
                    if (spInfo.status == 1) {
                        Union.jumpThirdPartySP(spInfo.contentId); //跳转到其他第三方sp
                    } else {
                        //增加游戏次数
                        LMActivity.AjaxHandler.addExtraTimes(function () {
                            Union.jumpThirdPartySP(spInfo.contentId); //跳转到其他第三方sp
                        }, function () {
                            Union.jumpThirdPartySP(spInfo.contentId); //跳转到其他第三方sp
                            // LMEPG.UI.showToast("游戏机会增加失败", 3, function () {
                            //     // LMActivity.Router.reload();
                            // });
                        });
                    }
                } else {
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
                }
            } catch (e) {
                LMEPG.UI.showToast("判断用户是否订购出现异常！\n" + e.toString());
                LMEPG.Log.error(e.toString());
            }
        },
        /**
         * 活动特俗订购方式按照产品顺序50%，30%，10%，10%
         * 如果该产品没有订购，就跳去订购该产品
         */
        outBookUnion: function (id) {
            try {
                var spInfo = Union.getSpInfoByProductId(id);
                spInfo = spInfo instanceof Object ? spInfo : JSON.parse(spInfo);
                // 成功订购回来后点击未订购产品间隔小于1分钟
                var orderSuccessDt = LMEPG.Cookie.getCookie(Activity.keyCookie);
                var currDt = new Date().getTime();
                if (orderSuccessDt != '' && (currDt - orderSuccessDt < 60000) && spInfo.status != 1) {
                    return;
                }
                Union.unionBuyVip(spInfo.contentId);  //直接跳到局方订购页
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
         * 判断订购产品数量
         */
        hasOrderSp: function () {
            var total = 0;
            if (LMEPG.Func.isArray(r.spMap)) {
                for (var i = 0; i < 4; i++) {
                    var spItem = JSON.parse(r.spMap[i]);
                    if (spItem.status == 0) {
                        total++
                    }
                }
            }
            return 4 - total;
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
            objOrderHome.setParam("remark", "JointActivityLaBaRace20201228");

            var objActivityGuide = LMEPG.Intent.createIntent("activity-common-index");
            objActivityGuide.setParam("userId", r.userId);
            objActivityGuide.setParam("inner", r.inner);
            objActivityGuide.setParam("isOrderBack", "1"); // 表示订购回来

            LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
        }
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_start_3',
            nextFocusDown: 'btn_activity_rule',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusRight: '',
            nextFocusLeft: 'btn_start_3',
            nextFocusDown: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则-返回',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_winner_list',
            name: '按钮-中奖名单',
            type: 'img',
            nextFocusUp: 'btn_activity_rule',
            nextFocusRight: '',
            nextFocusLeft: 'btn_start_3',
            nextFocusDown: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换礼品',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusDown: 'btn_start_3',
            nextFocusLeft: 'btn_start_3',
            backgroundImage: a.makeImageUrl('btn_change_gift.png'),
            focusImage: a.makeImageUrl('btn_change_gift_f.png'),
            // listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_start_1',
            name: '按钮-ready',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_start_3',
            nextFocusRight: 'btn_start_2',
            nextFocusDown: 'btn_order_1',
            backgroundImage: a.makeImageUrl('btn_chose.png'),
            focusImage: a.makeImageUrl('btn_chose_f.png'),
            click: Activity.eventHandler,
            playerId: 1,
            exScore: 1,
        }, {
            id: 'btn_start_2',
            name: '按钮-ready',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_start_1',
            nextFocusRight: 'btn_start_3',
            nextFocusDown: 'btn_order_1',
            backgroundImage: a.makeImageUrl('btn_chose.png'),
            focusImage: a.makeImageUrl('btn_chose_f.png'),
            click: Activity.eventHandler,
            playerId: 2,
            exScore: 0,
        }, {
            id: 'btn_start_3',
            name: '按钮-ready',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_start_2',
            nextFocusRight: 'btn_exchange_prize',
            nextFocusDown: 'btn_order_1',
            backgroundImage: a.makeImageUrl('btn_chose.png'),
            focusImage: a.makeImageUrl('btn_chose_f.png'),
            click: Activity.eventHandler,
            playerId: 0,
            exScore: 2,
        }, {
            id: 'btn_tips',
            name: '按钮-小贴士',
            type: 'img',
            nextFocusDown: 'btn_start_1',
            nextFocusUp: 'btn_back',
            nextFocusLeft: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_tips.png'),
            focusImage: a.makeImageUrl('btn_tips_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_list_submit',
            name: '按钮-中奖名单-确定',
            type: 'img',
            nextFocusUp: 'reset_tel',
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
            id: 'btn_cannon',
            name: '图片-针管',
            type: 'img',
            beforeMoveChange: Activity.cannonMove,
            click: Activity.eventHandler
        }, {
            id: 'btn_game_sure',
            name: '按钮-游戏成功确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_game_fail_sure',
            name: '按钮-游戏失败确定',
            type: 'img',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: Activity.eventHandler
        }, {
            id: 'exchange_prize_1',
            name: '按钮-兑换1',
            type: 'img',
            order: 0,
            nextFocusLeft: 'exchange_prize_2',
            nextFocusRight: 'exchange_prize_3',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_2',
            name: '按钮-兑换2',
            type: 'img',
            order: 1,
            nextFocusLeft: 'exchange_prize_3',
            nextFocusRight: 'exchange_prize_1',
            backgroundImage: a.makeImageUrl('btn_exchange_enable.png'),
            focusImage: a.makeImageUrl('btn_exchange_enable_f.png'),
            click: a.eventHandler
        }, {
            id: 'exchange_prize_3',
            name: '按钮-兑换3',
            type: 'img',
            order: 2,
            nextFocusLeft: 'exchange_prize_1',
            nextFocusRight: 'exchange_prize_2',
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
            click: a.eventHandler
        }, {
            id: 'btn_order_cancel',
            name: '按钮-取消订购VIP',
            type: 'img',
            nextFocusLeft: 'btn_order_submit',
            backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
            focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
            click: a.eventHandler
        }
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);
