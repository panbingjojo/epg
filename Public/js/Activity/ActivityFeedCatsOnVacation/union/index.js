(function (w, e, r, a) {
    var Activity = {
        keyCookie : r.activityName+r.userId,    //cookie键值，用于判断用户是否1分钟内反复点击产品订购
        init: function () {
            Activity.initRegional();
            Activity.initButtons();
            a.showOrderResult();
            a.setPageSize();

            /*if(r.areaCode == '207'){
                var __epg = Authentication.CTCGetConfig('EPGDomain');
                var reg = "(http://|https://)?([^/]*)";
                var epgServer = __epg.match(new RegExp(reg))[0];
                LMEPG.UI.logPanel.show(epgServer);
            }*/
        },

        initRegional: function () {
            var regionalImagePath = r.imagePath + 'V000051';
            // 活动规则
            $('activity_rule').style.backgroundImage = 'url(' + regionalImagePath + '/bg_activity_rule.png)';
            // 兑换奖品
            $('exchange_prize').style.backgroundImage = 'url(' + regionalImagePath + '/bg_exchange_prize.png)';

            //首页产品
            G("btn_order_1").src = a.makeImageUrl(r.areaCode+'/btn_order_1.png');
            G("btn_order_2").src = a.makeImageUrl(r.areaCode+'/btn_order_2.png') ;
            G("btn_order_3").src = a.makeImageUrl(r.areaCode+'/btn_order_3.png') ;
            G("btn_order_4").src = a.makeImageUrl(r.areaCode+'/btn_order_4.png');

            // 初始化 首页和兑奖页进度条
            if(r.platformType == 'hd'){
                var progressTop = parseInt((r.score/10) * 3)+'px'
            }else{
                var progressTop = Math.round((r.score/10) * 1.56)+'px'
            }
            G('progress_step').style.height = progressTop;
            G('ex_progress_step').style.height = progressTop;

            // 记录订购成功回来时间，用于判断一分钟内可点击
            if(r.cOrderResult == '1'){
                LMEPG.Cookie.setCookie(Activity.keyCookie,new Date().getTime());
            }

        },

        initButtons: function () {
            e.BM.init('btn_start', Activity.buttons.concat(Activity.exchangePrizeButtons), true);
        },

        playGame: function () {
            if(r.score >= 500){
                LMEPG.UI.showToast('喵喵饱了，快去兑换奖品吧！');
                return;
            }
            var add_score = 10; //每次点击增加10分
            G('game_start').innerHTML ='<img src="'+r.imagePath+'/icon_eat_fish.gif" id="eat_fish">';
            setTimeout(function () {
                    Activity.doAddScore(add_score);
            },7000);
        },

        doAddScore: function (score) {
            // 保存积分
            a.AjaxHandler.addScore(score, function () {
                // LMActivity.Router.reload();
                LMActivity.playStatus = false;
                e.Intent.jump(LMActivity.Router.getCurrentPage())
            }, function () {
                LMActivity.playStatus = false;
                LMEPG.UI.showToast('添加积分失败', 2);
            });
        },

        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_game_success':
                case 'btn_fail':
                    a.Router.reload(); // 重新加载
                    break;
                case 'btn_order_sure':
                    LMActivity.hideModal(LMActivity.shownModal);
                    break;
                case 'btn_start':
                    LMActivity.triggerModalButton = btn.id;
                    if (a.hasLeftTime()) {
                        if(!LMActivity.playStatus){
                            LMActivity.playStatus = true;
                            a.AjaxHandler.uploadPlayRecord(function () {
                                Activity.playGame();
                            }, function () {
                                LMEPG.UI.showToast('扣除游戏次数失败', 2);
                            });
                            // Activity.playGame();
                        }
                    }else{
                        // 1:表示均未订购直接跳转第一个产品；2:还有未订购产品，回首页订购；其他：提示明天再来
                        var hasOrder = Union.hasNoOrderSp();
                        var ordercontentId = '';
                        switch (r.areaCode){
                            case '208':
                            case '204':
                                ordercontentId = 'sjjklinux';
                                break;
                            case '209':
                            case '216':
                                ordercontentId = 'qzlyx';
                                break;
                            case '207':
                                ordercontentId = 'jkmf';
                                break;
                        };
                        if(hasOrder == 1 ){
                            Union.unionBuyVip(ordercontentId);
                        }else if (hasOrder == 2) {
                            LMActivity.showModal({
                                id: 'order_vip',
                                focusId: 'btn_order_sure'
                            });
                        } else {
                            a.showGameStatus('btn_game_over_sure');
                        }
                    }
                    break;
            }
        }
    };
    var Union = {
        //判断是否订购图片切换
        isPay: function (btn, hasFocus) {
            if (hasFocus) {
                try {
                    var spInfo = Union.getSpInfoByProductId(btn.contentId);
                    spInfo = spInfo instanceof Object ? spInfo : JSON.parse(spInfo);

                    // 当status==1时，表示已经订购该产品
                    if (spInfo.status == 1) {
                        G(btn.id).src = btn.selectImage;
                    }
                } catch (e) {
                    LMEPG.UI.showToast("判断用户是否订购出现异常！\n" + e.toString());
                    LMEPG.Log.error(e.toString());
                }
            }
        },

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
                var currDt =new Date().getTime();
                if(orderSuccessDt != '' && (currDt - orderSuccessDt < 60000) && spInfo.status != 1){
                    return;
                }

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
                var order_cnt = 0;
                for (var i = 0; i < 4; i++) {
                    var spItem = JSON.parse(r.spMap[i]);
                    if (spItem.status == 1) {
                        order_cnt++;
                    }
                }
                // 1:表示均未订购直接跳转第一个产品；2:还有未订购产品，回首页订购；其他：提示明天再来
                if(order_cnt == 0){
                    return  1 ;
                }else if(order_cnt == 4){
                    return 3;
                }else{
                    return 2;
                }
            }
            return false;
        },


        /**
         *  按产品规则计算，当回到当前活动首页时，默认焦点落在哪个联合产品按钮上。
         */
        getDefFocusBtnOfUnionProduct: function () {
            return leftTimes > 0 ? "btn_start" /*“抢月饼”按钮*/ : getFirstUnBuyVIPUnionProduct();
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
            objOrderHome.setParam("remark", "JointActivityFeedCatsOnVacation20200727");

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
            nextFocusDown: 'btn_exchange_prize',
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
            nextFocusRight: 'btn_back',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_close_rule',
            name: '按钮-活动规则-返回',
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
            nextFocusDown: 'btn_order_1',
            nextFocusRight: 'btn_exchange_prize',
            backgroundImage: a.makeImageUrl('btn_winner_list.png'),
            focusImage: a.makeImageUrl('btn_winner_list_f.png'),
            listType: 'exchange',
            click: a.eventHandler
        }, {
            id: 'btn_exchange_prize',
            name: '按钮-兑换奖品',
            type: 'img',
            nextFocusDown: 'btn_order_3',
            nextFocusUp: 'btn_back',
            nextFocusLeft: 'btn_winner_list',
            backgroundImage: a.makeImageUrl('btn_exchange_prize.png'),
            focusImage: a.makeImageUrl('btn_exchange_prize_f.png'),
            exchangePrizeButtons: Activity.exchangePrizeButtons,
            exchangeFocusId: '',
            moveType: 1,
            click: a.eventHandler
        }, {
            id: 'btn_start',
            name: '开始游戏按钮',
            type: 'img',
            nextFocusUp: '',
            nextFocusLeft: 'btn_order_2',
            nextFocusRight: 'btn_order_4',
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
            id: 'btn_order_sure',
            name: '按钮-订购VIP-确定',
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
            name: '按钮-游戏结束-确定',
            type: 'img',
            nextFocusLeft: 'btn-play',
            nextFocusDown: 'btn-play',
            backgroundImage: a.makeImageUrl('btn_common_sure.png'),
            focusImage: a.makeImageUrl('btn_common_sure_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_order_1',
            name: '产品1',
            type: 'img',
            nextFocusUp: 'btn_winner_list',
            nextFocusLeft: '',
            nextFocusRight: 'btn_start',
            nextFocusDown: 'btn_order_2',
            backgroundImage: a.makeImageUrl(r.areaCode+'/btn_order_1.png') ,
            focusImage: a.makeImageUrl(r.areaCode+'/btn_order_1_f.png') ,
            selectImage:a.makeImageUrl(r.areaCode+'/btn_order_1_select.png'),
            productId: "",
            contentId: r.areaCode == "207" ? "jkmf" : "qzlyx",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'btn_order_2',
            name: '产品2',
            type: 'img',
            nextFocusUp: "btn_order_1",
            nextFocusLeft: '',
            nextFocusRight: 'btn_start',
            backgroundImage: a.makeImageUrl(r.areaCode+'/btn_order_2.png'),
            focusImage: a.makeImageUrl(r.areaCode+'/btn_order_2_f.png'),
            selectImage: a.makeImageUrl(r.areaCode+'/btn_order_2_select.png'),
            productId: "",
            contentId: r.areaCode == "207" ? "sxgdyseby" : "sjjklinux",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'btn_order_3',
            name: '产品3',
            type: 'img',
            nextFocusUp: 'btn_exchange_prize',
            nextFocusLeft: 'btn_start',
            nextFocusDown: 'btn_order_4',
            nextFocusRight: '',
            backgroundImage: a.makeImageUrl(r.areaCode+'/btn_order_3.png') ,
            focusImage:a.makeImageUrl(r.areaCode+'/btn_order_3_f.png'),
            selectImage:a.makeImageUrl(r.areaCode+'/btn_order_3_select.png'),
            productId: "",
            contentId: r.areaCode == "216" ? "wkly" : r.areaCode == "204" ? "hlgf": r.areaCode == "207" ? "czly" :"wjjs",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'btn_order_4',
            name: '产品4',
            type: 'img',
            nextFocusUp: "btn_order_3",
            nextFocusLeft: "btn_start",
            nextFocusRight: '',
            backgroundImage: a.makeImageUrl(r.areaCode+'/btn_order_4.png'),
            focusImage:  a.makeImageUrl(r.areaCode+'/btn_order_4_f.png') ,
            selectImage:  a.makeImageUrl(r.areaCode+'/btn_order_4_select.png') ,
            productId: "",
            contentId: r.areaCode == "208" ? "zyatb" : r.areaCode == "207" ? "sxgdysrhyb" :"bsmkly",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'dg_order_1',
            name: '产品1',
            type: 'img',
            nextFocusLeft: 'dg_order_4',
            nextFocusRight: 'dg_order_2',
            backgroundImage:  a.makeImageUrl(r.areaCode+'/btn_order_1.png') ,
            focusImage:  a.makeImageUrl(r.areaCode+'/btn_order_1_f.png') ,
            selectImage:  a.makeImageUrl(r.areaCode+'/btn_order_1_select.png'),
            contentId: r.areaCode == "207" ? "jkmf" : "qzlyx",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'dg_order_2',
            name: '产品2',
            type: 'img',
            nextFocusLeft: 'dg_order_1',
            nextFocusRight: 'dg_order_3',
            backgroundImage: a.makeImageUrl(r.areaCode+'/btn_order_2.png') ,
            focusImage:  a.makeImageUrl(r.areaCode+'/btn_order_2_f.png') ,
            selectImage:  a.makeImageUrl(r.areaCode+'/btn_order_2_select.png') ,
            productId: "",
            contentId: r.areaCode == "207" ? "sxgdyseby" : "sjjklinux",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'dg_order_3',
            name: '产品3',
            type: 'img',
            nextFocusLeft: 'dg_order_2',
            nextFocusRight: 'dg_order_4',
            backgroundImage: a.makeImageUrl(r.areaCode+'/btn_order_3.png'),
            focusImage:a.makeImageUrl(r.areaCode+'/btn_order_3_f.png') ,
            selectImage: a.makeImageUrl(r.areaCode+'/btn_order_3_select.png') ,
            contentId:r.areaCode == "216" ? "wkly" : r.areaCode == "204" ? "hlgf": r.areaCode == "207" ? "czly" :"wjjs",
            click: Union.bookUnion,
            focusChange: Union.isPay,
        }, {
            id: 'dg_order_4',
            name: '产品4',
            type: 'img',
            nextFocusLeft: 'dg_order_3',
            nextFocusRight: 'dg_order_1',
            backgroundImage: a.makeImageUrl(r.areaCode+'/btn_order_4.png'),
            focusImage:  a.makeImageUrl(r.areaCode+'/btn_order_4_f.png'),
            selectImage:  a.makeImageUrl(r.areaCode+'/btn_order_4_select.png'),
            contentId: r.areaCode == "208" ? "zyatb" : r.areaCode == "207" ? "sxgdysrhyb" :"bsmkly",
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
})(window, LMEPG, RenderParam, LMActivity);