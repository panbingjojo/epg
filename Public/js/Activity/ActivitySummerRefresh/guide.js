(function (w, undefined) {


    var Page = {
        /**
         * 获取当前页对象
         */
        getCurrentPage: function getCurrentPage() {
            var objCurrent = LMEPG.Intent.createIntent("activity-common-guide");
            objCurrent.setParam("userId",  RenderParam.userId);
            objCurrent.setParam("inner", RenderParam.inner);
            return objCurrent;
        },

        /**
         * @func 进行购买操作
         * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
         * @returns {boolean}
         */
        jumpBuyVip: function () {
            var objCurrent = this.getCurrentPage();

            var objOrderHome = LMEPG.Intent.createIntent("orderHome");
            objOrderHome.setParam("userId",RenderParam.userId);
            objOrderHome.setParam("directPay", "1");
            objOrderHome.setParam("orderReason", "101");
            objOrderHome.setParam("remark", RenderParam.activityName);

            var objActivityGuide = LMEPG.Intent.createIntent("activity-common-guide");
            objActivityGuide.setParam("userId", RenderParam.userId);
            objActivityGuide.setParam("inner", RenderParam.inner);
            objActivityGuide.setParam("isOrderBack", "1"); // 表示订购回来

            LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
        },

        unionBuyVip: function (contentId) {
            var objCurrent = this.getCurrentPage();

            var objOrderHome = LMEPG.Intent.createIntent("orderHome");
            objOrderHome.setParam("userId", RenderParam.userId);
            objOrderHome.setParam("directPay", "1");
            objOrderHome.setParam("orderReason", "101");
            objOrderHome.setParam("contentId", contentId); // sp订购的内容id
            objOrderHome.setParam("isJointActivity", "1"); // 表示联合活动
            objOrderHome.setParam("remark", RenderParam.activityName);

            var objActivityGuide = LMEPG.Intent.createIntent("activity-common-guide");
            objActivityGuide.setParam("userId", RenderParam.userId);
            objActivityGuide.setParam("inner", RenderParam.inner);
            objActivityGuide.setParam("isOrderBack", "1"); // 表示订购回来

            LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
        },

        jumpHome:function () {
            var objCurrent = this.getCurrentPage();

            var objDialog = LMEPG.Intent.createIntent("home");
            objDialog.setParam("userId", RenderParam.userId);
            objDialog.setParam("inner", RenderParam.inner);

            LMEPG.Intent.jump(objDialog, objCurrent);
        },

        reload: function () {
            LMEPG.ButtonManager.setKeyEventPause(true);
            LMEPG.UI.showWaitingDialog('', 0.4, function () {
                LMEPG.Intent.jump(Page.getCurrentPage());
            });
        },

        goBack: function () {
            if(RenderParam.lmcid === "000051" && RenderParam.userAccount.split('_')[1] === '204'){
                if(typeof(window.parent.iframeReturnUrl) == 'function'){
                    //河南3.0版本的返回大厅逻辑
                    window.parent.iframeReturnUrl();
                }else{
                    LMEPG.Intent.back('IPTVPortal');
                }
            }else{
                Page.jumpHome();
            }
        }
    };

    w.Page = Page;
})(window, undefined);

(function (w, undefined) {
    var AjaxHelper = {
        getLeftTimes: function () {
            LMEPG.ajax.postAPI('Activity/canAnswer', null,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            var leftTimes = data.leftTimes || data.left_times || 0;
                            guide.setLeftTimes(leftTimes);
                        } else {
                            guide.setLeftTimes(0);
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("判断用户是否可以试玩，解析异常！");
                        LMEPG.Log.error(e.toString());
                        LMEPG.ButtonManager.init('', [], '', true); // 失败异常处理，保证至少可以响应返回按键
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("判断用户是否可以试玩失败");
                    LMEPG.ButtonManager.init('', [], '', true); // 失败异常处理，保证至少可以响应返回按键
                }
            );
        },
        exchangePrize: function (id) {
            var postData = {
                action: "bgExchange",
                goodsId: id,
                score: 0
            };
            LMEPG.UI.showWaitingDialog();
            LMEPG.ButtonManager.setKeyEventPause(true);
            LMEPG.ajax.postAPI('Activity/commonAjax', postData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : rsp ? JSON.parse(rsp) : rsp;
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.ButtonManager.setKeyEventPause(false);
                        switch (data.result) {
                            // 兑换成功
                            case 0:
                                LMEPG.UI.showToast("兑换成功!");
                                ExchangeFunc.closeExchange();
                                w.commitExchangeDialog = new CommitExchangeDialog(id);
                                commitExchangeDialog.show();
                                // jumpDrawnPrizeDialog(id);
                                break;
                            // 超出可兑换的数量
                            case -100:
                                // jumpProduceTimeoutDialog();
                                LMEPG.UI.showToast("积分不足!");
                                break;
                            // 库存不足
                            case -101:
                                // jumpNoProduceDialog();
                                LMEPG.UI.showToast("积分不足!");
                                break;
                            // 积分不足不能兑换
                            default:
                                LMEPG.UI.showToast("积分不足!");
                                break;
                        }

                    } catch (e) {
                        LMEPG.UI.showToast("解析异常！", 3);
                        LMEPG.Log.error(e.toString());
                        console.log(e.toString());
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("上报失败！", 3);
                }
            );
        },

        getWinnerList: function () {
            LMEPG.ajax.postAPI('Activity/getExchangePrizeListRecord', null,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            //var leftTimes = data.leftTimes || data.left_times || 0;
                            //guide.setLeftTimes(leftTimes);
                            var winnerData = data.data;
                            WinnerListFunc.renderList(winnerData.all_list, winnerData.list);
                        } else {
                            //guide.setLeftTimes(0);
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("获取中奖名单，解析异常！");
                        LMEPG.Log.error(e.toString());
                        LMEPG.ButtonManager.init('', [], '', true); // 失败异常处理，保证至少可以响应返回按键
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("获取中奖名单失败");
                    LMEPG.ButtonManager.init('', [], '', true); // 失败异常处理，保证至少可以响应返回按键
                }
            );
        },

        updatePrizePhone: function (userTel, goodsId) {
            var reqData = {
                "phoneNumber": userTel,
                "goodsId": goodsId
            };
            LMEPG.ajax.postAPI('Activity/setPhoneNumberForExchange', reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {  // 设置号码成功
                            LMEPG.UI.showToast("提交成功",1,function () {
                                WinnerListFunc.closeList();
                            });
                        } else { // 设置号码失败
                            LMEPG.UI.showToast("提交失败，请重试！");
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("保存手机号结果处理异常！");
                        LMEPG.Log.error(e.toString());
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("请求保存手机号发生错误！");
                }
            );
        },

        uploadPlayRecord: function () {
            LMEPG.ajax.postAPI('Activity/uploadPlayedRecord', null,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        console.log('--->uploadAnswerResult: 上报参与记录' + (result == 0 ? '成功！' : '失败！'));
                        LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录' + (result == 0 ? '成功！' : '失败！'));
                    } catch (e) {
                        console.log('--->uploadAnswerResult: 上报参与记录解析异常！error:' + e.toString());
                        LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录解析异常！error:' + e.toString());
                    }
                },
                function (rsp) {
                    console.log('--->uploadAnswerResult: 上报参与记录发生错误！rsp:' + rsp.toString());
                    LMEPG.Log.info('--->uploadAnswerResult: 上报参与记录发生错误！rsp:' + rsp.toString());
                }
            );
        },

        updateScore: function (score) {
            // 未清扫、剩余次数大于0
            var reqData = {
                'score': score,
                'remark': '消夏积分'
            };
            LMEPG.ajax.postAPI('Activity/addUserScore', reqData,
                function (data) {
                    try {
                        if (data.result == 0) {
                            LMEPG.UI.showToast("消夏值+" + score + "！");
                            Page.reload();
                        } else {
                            LMEPG.UI.dismissWaitingDialog();
                            LMEPG.UI.showToast("上传积分失败!");
                        }
                    } catch (e) {
                        LMEPG.UI.dismissWaitingDialog();
                        LMEPG.UI.showToast("上传积分解析异常!" + e);
                    }
                },
                function (data) {
//                        LMEPG.UI.dismissWaitingDialog();
                    LMEPG.UI.showToast("上传积分请求失败!");
                }
            );
        },

        setPrizePhone: function (userTel, prizeIdx) {
            var reqData = {
                "action": "phone",
                "number": userTel,
                "prizeIdx": prizeIdx
            };
            LMEPG.ajax.postAPI('Activity/commonAjax', reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            LMEPG.UI.showToast("提交电话成功！");
                            Page.reload();
                        } else {
                            LMEPG.UI.showToast("提交失败，请重试！");
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("保存手机号结果处理异常！");
                        LMEPG.Log.error(e.toString());
                        console.log(e.toString())
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("请求保存手机号发生错误！");
                });
        }
    };

    w.AjaxHelper = AjaxHelper;
})(window, undefined);

(function (w, undefined) {

    function RuleDialog() {
        this.buttons = {
            id: 'btn_close_rule',
            name: '返回',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: RenderParam.imgPathPrefix + 'bg_back.png',
            focusImage: RenderParam.imgPathPrefix + 'f_back.gif',
            click: this.dismiss,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: ""
        }
    }

    RuleDialog.prototype.dismiss = function () {
        guide.dialogWrap.innerHTML = "";
        LMEPG.ButtonManager.deleteButtons(ruleDialog.buttons);
        LMEPG.ButtonManager.requestFocus("btn-rule");

        w.onBack = guide.goBack;
    };

    RuleDialog.prototype.show = function () {
        var _html = "";
        _html += '<div ><img id="default_focus" src="' + RenderParam.imgPathPrefix + '/rule_bg.png"/>';
        _html += '<img id="btn_close_rule" class="common_back_position" src="' + RenderParam.imgPathPrefix + '/f_back.gif"/>';
        _html += '</div>';
        guide.dialogWrap.innerHTML = _html;

        LMEPG.ButtonManager.addButtons(ruleDialog.buttons);
        LMEPG.ButtonManager.requestFocus("btn_close_rule");

        w.onBack = ruleDialog.dismiss;
    };

    w.ruleDialog = new RuleDialog();
})(window, undefined);

(function (w, undefined) {
    function CommitExchangeDialog(prizeIdx) {
        this.buttons = [
            {
                id: 'btn_commit_exchange',
                name: '确定',
                type: 'img',
                nextFocusLeft: 'btn_cancel_exchange',
                nextFocusRight: 'btn_cancel_exchange',
                nextFocusUp: 'exchange_user_phone',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_sure.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_sure_f.gif',
                click: this.onCommitExchangeClick,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                prizeIdx: prizeIdx
            }, {
                id: 'btn_cancel_exchange',
                name: '取消',
                type: 'img',
                nextFocusLeft: 'btn_commit_exchange',
                nextFocusRight: 'btn_commit_exchange',
                nextFocusUp: 'exchange_user_phone',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'btn_cancel.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_cancel_f.gif',
                click: this.dismissDialog,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'exchange_user_phone',
                name: '号码框',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'btn_commit_exchange',
                backgroundImage: '',
                focusImage: '',
                click: "",
                focusChange: this.onUserPhoneFocus,
                beforeMoveChange: "",
                moveChange: ""
            }
        ];
    };

    CommitExchangeDialog.prototype.show = function () {
        var _html = "";
        _html += '<img id="default_focus" src="' + RenderParam.imgPathPrefix + '/bg_phone.png"/>';
        _html += '<div id="exchange_user_phone">请输入有效的手机号码</div>';
        _html += '<img id="btn_commit_exchange" src="' + RenderParam.imgPathPrefix + '/btn_sure_f.gif" />';
        _html += '<img id="btn_cancel_exchange" src="' + RenderParam.imgPathPrefix + '/btn_cancel.png" />';
        guide.dialogWrap.innerHTML = _html;

        LMEPG.ButtonManager.addButtons(this.buttons);
        LMEPG.ButtonManager.requestFocus("btn_commit_exchange");

        w.onBack = this.dismissDialog;
    };

    CommitExchangeDialog.prototype.onCommitExchangeClick = function (btn) {
        //获取用户填写的手机号
        var phoneTex = G("exchange_user_phone");
        var userTel = phoneTex.innerHTML;

        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast("请输入有效的手机号码");
            return;
        }

        AjaxHelper.setPrizePhone(userTel, btn.prizeIdx)
    };

    CommitExchangeDialog.prototype.onUserPhoneFocus = function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.UI.keyboard.show(865, 400, 'exchange_user_phone', 'btn_commit_exchange', true);
        }
    };

    CommitExchangeDialog.prototype.dismissDialog = function () {
        // guide.dialogWrap.innerHTML = "";
        // LMEPG.ButtonManager.deleteButtons(commitExchangeDialog.buttons);
        // LMEPG.ButtonManager.requestFocus("btn-produce");
        //
        // w.onBack = guide.goBack;
        Page.reload();
    };

    w.CommitExchangeDialog = CommitExchangeDialog;
})(window, undefined);

(function (w, undefined) {
    var ExchangeFunc = {
        onPrizeItemClick: function (btn) {
            var goodId = btn.good_id;
            var exchangeRecordList = RenderParam.exchangeRecord ?
                (RenderParam.exchangeRecord.data ? RenderParam.exchangeRecord.data.list : "") : "";
            if (exchangeRecordList && exchangeRecordList.length > 0) {
                // 判断是否兑换过物品
                LMEPG.UI.showToast("你已经兑换过奖品了");
                return;
            }
            if (ExchangeFunc.verifyScore(goodId)) {
                AjaxHelper.exchangePrize(goodId);
            } else {
                LMEPG.UI.showToast("消夏值不足！");
            }
        },

        verifyScore: function (verifyGoodId) {
            var listPrizes = RenderParam.setExchangeList.data;
            var consumeScore = 0;
            for (var index = 0; index < listPrizes.length; index++) {
                var goodsId = parseInt(listPrizes[index].goods_id);
                if (verifyGoodId === goodsId) {
                    consumeScore = listPrizes[index].consume_list[0].consume_count;
                }
            }
            return !(consumeScore === 0 || parseInt(RenderParam.score) < consumeScore);
        },

        closeExchange: function () {
            guide.dialogWrap.innerHTML = "";
            LMEPG.ButtonManager.deleteButtons(ExchangeDialog.buttons);
            LMEPG.ButtonManager.requestFocus("btn-produce");

            w.onBack = guide.goBack;
        }
    };

    w.ExchangeFunc = ExchangeFunc;

    var ExchangeDialog = {
        buttons: [{
            id: 'btn_close_exchange',
            name: '返回',
            type: 'img',
            nextFocusLeft: '',
            nextFocusUp: '',
            nextFocusDown: 'exchange-3',
            nextFocusRight: '',
            backgroundImage: RenderParam.imgPathPrefix + 'bg_back.png',
            focusImage: RenderParam.imgPathPrefix + 'f_back.gif',
            click: ExchangeFunc.closeExchange,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
        }, {
            id: 'exchange-1',
            name: '兑换奖品1',
            type: 'img',
            nextFocusLeft: 'exchange-3',
            nextFocusUp: 'btn_close_exchange',
            nextFocusDown: '',
            nextFocusRight: 'exchange-2',
            backgroundImage: RenderParam.imgPathPrefix + 'bg_produce.png',
            focusImage: RenderParam.imgPathPrefix + 'f_produce.gif',
            click: ExchangeFunc.onPrizeItemClick,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            good_id: 1
        }, {
            id: 'exchange-2',
            name: '兑换奖品2',
            type: 'img',
            nextFocusLeft: 'exchange-1',
            nextFocusUp: 'btn_close_exchange',
            nextFocusDown: '',
            nextFocusRight: 'exchange-3',
            backgroundImage: RenderParam.imgPathPrefix + 'bg_produce.png',
            focusImage: RenderParam.imgPathPrefix + 'f_produce.gif',
            click: ExchangeFunc.onPrizeItemClick,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            good_id: 2
        }, {
            id: 'exchange-3',
            name: '兑换奖品3',
            type: 'img',
            nextFocusLeft: 'exchange-2',
            nextFocusUp: 'btn_close_exchange',
            nextFocusDown: '',
            nextFocusRight: 'exchange-1',
            backgroundImage: RenderParam.imgPathPrefix + 'bg_produce.png',
            focusImage: RenderParam.imgPathPrefix + 'f_produce.gif',
            click: ExchangeFunc.onPrizeItemClick,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            good_id: 3
        }],

        show: function () {
            var _html = "";
            _html += '<img src="' + RenderParam.bgImagePrefix + guide.bgIndex + '/exchange_bg.png"/>';
            _html += '<img id="exchange-1" src="' + RenderParam.imgPathPrefix + '/bg_produce.png"/>';
            _html += '<img id="exchange-2" src="' + RenderParam.imgPathPrefix + '/bg_produce.png"/>';
            _html += '<img id="exchange-3" src="' + RenderParam.imgPathPrefix + '/bg_produce.png"/>';
            _html += '<img id="btn_close_exchange" class="common_back_position" src="' + RenderParam.imgPathPrefix + '/f_back.gif"/>';
            _html += '<div id="my_point">' + RenderParam.energyValue + '</div>';
            _html += '<div id="exchange-1-point" class="point"></div>';
            _html += '<div id="exchange-2-point" class="point"></div>';
            _html += '<div id="exchange-3-point" class="point"></div>';
            guide.dialogWrap.innerHTML = _html;

            var listPrizes = RenderParam.setExchangeList.data;
            for (var i = 0; i < listPrizes.length; i++) {
                G('exchange-' + listPrizes[i].goods_id + '-point').innerHTML = listPrizes[i].consume_list[0].consume_count;
            }

            LMEPG.ButtonManager.addButtons(ExchangeDialog.buttons);
            LMEPG.ButtonManager.requestFocus("btn_close_exchange");

            w.onBack = ExchangeFunc.closeExchange;
        }
    };

    w.ExchangeDialog = ExchangeDialog;
})(window, undefined);

(function (w, undefined) {
    var SkillFunc = {
        pageCurrent: 1,
        introduce: [
            {
                "index": 1,
                "title": " 西瓜：",
                "content": "堪称“盛夏之王”，清爽解渴，味道甘味多汁，西瓜除不含脂肪和胆固醇外，含有大量葡萄糖、苹果酸、果糖、蛋白氨基酸、番茄素及丰富的维生素C等物质，是一种富有很高的营养、纯净、食用安全食品，但西瓜性寒凉，素有寒瓜之称，故不能贪食多食。"
            },
            {
                "index": 2,
                "title": " 苦瓜：",
                "content": "味苦，生则性寒，熟则性温。生食清暑泻火，解热除烦；熟食养血滋肝，润脾补肾，能除邪热、解劳乏、清心明目、益气壮阳，有养颜嫩肤、降血糖、养血滋肝的功效，多食会损伤脾肺之气。"
            },
            {
                "index": 3,
                "title": " 菊花茶: ",
                "content": "是一种以菊花为原料制成的花草茶。菊花茶经过鲜花采摘、阴干、生晒蒸晒、烘培等工序制作而成。据古籍记载，菊花味甘苦，性微寒，有散风清热、清肝明目和解毒消炎等作用，脾胃虚寒者需慎用。"
            },
            {
                "index": 4,
                "title": " 绿豆汤：",
                "content": "是一道以绿豆和水作为主要食材熬制而成的汤，具有清热解毒、止渴消暑的功效，是中国民间传统的解暑佳品。寒凉体质、体虚、空腹、服药的人群慎用。"
            },
            {
                "index": 5,
                "title": " 薄荷茶: ",
                "content": "薄荷中薄荷醇、薄荷酮有疏风清热作用，泡茶喝之有清凉感，是清热利尿的良药，它香气清香宜人、滋味鲜爽清凉，是夏季最适宜饮用的一款茶饮，但切忌过量，过量可能导致中毒。"
            },
            {
                "index": 6,
                "title": " 雪梨: ",
                "content": "味甘性寒，具生津润燥、清热化痰、养血生肌之功效，能治风热、润肺、凉心、消痰、降火、解毒，但一次不宜多吃，尤其脾胃虚寒、腹部冷痛和血虚者，不可以多吃。"
            },
            {
                "index": 7,
                "title": " 冰激凌、冷饮: ",
                "content": "虽可降暑去热，但却不宜过量，且此类物品一般要比胃内温度低，容易造成胃肠道疾病，影响身体健康。"
            }
        ],
        onBeforeMoveChange: function (direction, current) {
            var self = current.obj;
            //翻页
            switch (direction) {
                case 'left':
                    if (self.pageCurrent <= 1) {
                        return;
                    }
                    self.pageCurrent--;
                    break;
                case 'right':
                    if (self.pageCurrent >= self.introduce.length) {
                        return;
                    }
                    self.pageCurrent++;
                    break;
            }
            self.updateContent();
        },

        updateContent: function () {
            G("pr-img").src = RenderParam.imgPathPrefix + "pr_" + this.introduce[this.pageCurrent - 1].index + ".png";
            G("introduce_content").innerHTML = this.introduce[this.pageCurrent - 1].title + "<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;" + this.introduce[this.pageCurrent - 1].content
            G("pages").innerHTML = this.pageCurrent + "/" + this.introduce.length
            this.updateArrows();
        },

        updateArrows: function () {
            var top_pages = document.getElementById("left_page");
            var bottom_pages = document.getElementById("right_page");
            if (this.pageCurrent == this.introduce.length) {
                //判断已经到最后面一页
                top_pages.style.display = "block";
                bottom_pages.style.display = "none";
            } else if (this.pageCurrent == 1) {
                top_pages.style.display = "none";
                bottom_pages.style.display = "block";
            } else {
                top_pages.style.display = "block";
                bottom_pages.style.display = "block";
            }
        },

        closeSkill: function () {
            guide.dialogWrap.innerHTML = "";
            LMEPG.ButtonManager.deleteButtons(SkillDialog.buttons);
            LMEPG.ButtonManager.requestFocus("btn-walk-through");

            w.onBack = guide.goBack;
        }
    };

    var SkillDialog = {
        buttons: [
            {
                id: 'btn_close_skill',
                name: '返回',
                type: 'img',
                nextFocusLeft: 'time-3',
                nextFocusRight: 'time-5',
                nextFocusUp: '',
                nextFocusDown: '',
                click: SkillFunc.closeSkill,
                focusChange: "",
                moveChange: "",
                beforeMoveChange: SkillFunc.onBeforeMoveChange,
                obj: SkillFunc
            }
        ],

        show: function () {
            var _html = "";
            _html += '<img src="' + RenderParam.imgPathPrefix + '/produce_bg.png"/>';
            _html += '<img class="left_page" id="left_page" src="' + RenderParam.imgPathPrefix + '/icon_left.png"/>';
            _html += '<img class="right_page" id="right_page" src="' + RenderParam.imgPathPrefix + '/icon_right.png"/>';
            _html += '<img id="pr-img" src="' + RenderParam.imgPathPrefix + '/pr_1.png"/>';
            _html += '<img id="btn_close_skill" class="common_back_position" src="' + RenderParam.imgPathPrefix + '/f_back.gif"/>';
            _html += '<div id="pages">1/7</div>';
            _html += '<div id="introduce_content" class="pr-content"></div>';
            guide.dialogWrap.innerHTML = _html;

            SkillFunc.updateContent();

            LMEPG.ButtonManager.addButtons(SkillDialog.buttons);
            LMEPG.ButtonManager.requestFocus("btn_close_skill");

            w.onBack = SkillFunc.closeSkill;
        }
    };
    w.SkillDialog = SkillDialog;
})(window, undefined);

(function (w, undefined) {
    var WinnerListFunc = {
        prizeInfo: "",
        keyPad: function (btn, hasFocus) {
            if (hasFocus) {
                LMEPG.UI.keyboard.show(860, 460, 'searchText','btn-submit', true);
            }
        },

        formatWinnerUser: function (str) {
            return str.substring(0, 3) + "***" + str.substring(str.length - 3);
        },


        formatWinnerDate: function (dateStr) {
            return new Date(this.getStandardDt(dateStr)).format("yyyy-MM-dd");
        },

        getStandardDt: function (dt) {
            var time = dt.replace(/-/g, ':').replace(' ', ':');
            time = time.split(':');
            return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
        },

        renderList: function (recordData, myInfo) {
            var _html = "";
            _html += '<marquee id="all-prizes" behavior="" direction="up">';
            _html += '<table >';
            var col = 1;
            var mineRecordDate;
            for (var index = 0; index < recordData.length; index++) {
                _html += '<tr>';
                _html += '<td class="col_1" colspan=' + col + '>' + this.formatWinnerUser(recordData[index]['user_account']) + '</td>';
                _html += '<td class="col_2" colspan=' + col + '>' + this.formatWinnerDate(recordData[index]['log_dt']) + '</td>';
                _html += '<td class="col_3" colspan=' + col + '>' + recordData[index]['goods_name'] + '</td>';
                _html += '</tr>';

                if (RenderParam.userAccount === recordData[index].user_account) {
                    mineRecordDate = this.formatWinnerDate(recordData[index].log_dt);
                }
            }
            _html += '</table></marquee>';
            guide.dialogWrap.innerHTML += _html;

            var myPrize = '';
            if (myInfo.length) {
                myPrize += '<marquee id="my-prizes" behavior="" direction="up"  scrollamount="1">';
                myPrize += '<table>';
                this.prizeInfo = myInfo[0];
                myPrize += '<tr>';
                myPrize += '<td class="col_1" colspan=' + col + '>' + this.formatWinnerUser(RenderParam.userAccount);
                myPrize += '<td class="col_2" colspan=' + col + '>' + mineRecordDate;
                myPrize += '<td class="col_3" colspan=' + col + '>' + this.prizeInfo.goods_name;
                if (this.prizeInfo["user_tel"]) {
                    G('searchText').innerHTML = this.prizeInfo["user_tel"];
                }
                myPrize += '</table></marquee>';
            } else {
                myPrize += '<div class="abs my-noPrize">暂无中奖记录</div>';
            }
            guide.dialogWrap.innerHTML += myPrize;
        },

        setPhoneNumber: function (btn) {
            var self = btn.obj;
            var userTel = G("searchText").innerHTML;

            //判断手机号是否正确
            if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
                LMEPG.UI.showToast("请填写正确的手机号！", 3);
                return;
            }
            // 判断获奖信息是否在空
            if (!self.prizeInfo) {
                LMEPG.UI.showToast("您尚未中奖！", 3);
                return;
            }
            // 提取中奖奖品id
            if (!self.prizeInfo.goods_id) {
                LMEPG.UI.showToast("中奖编号为空！", 3);
                return;
            }

            // 修改获奖电话
            AjaxHelper.updatePrizePhone(userTel, self.prizeInfo.goods_id)
        },

        closeList: function () {
            guide.dialogWrap.innerHTML = "";
            LMEPG.ButtonManager.deleteButtons(WinnerListDialog.buttons);
            LMEPG.ButtonManager.requestFocus("btn-price");

            w.onBack = guide.goBack;
        }
    };

    var WinnerListDialog = {
        buttons: [{
            id: 'btn-submit',
            name: '提交',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'btn-cancel',
            nextFocusUp: 'searchText',
            nextFocusDown: '',
            backgroundImage: RenderParam.imgPathPrefix + 'btn_sure.png',
            focusImage: RenderParam.imgPathPrefix + 'btn_sure_f.gif',
            click: WinnerListFunc.setPhoneNumber,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: "",
            obj: WinnerListFunc
        }, {
            id: 'btn-cancel',
            name: '取消',
            type: 'img',
            nextFocusLeft: 'btn-submit',
            nextFocusRight: '',
            nextFocusUp: 'searchText',
            nextFocusDown: '',
            backgroundImage: RenderParam.imgPathPrefix + 'btn_cancel.png',
            focusImage: RenderParam.imgPathPrefix + 'btn_cancel_f.gif',
            click: WinnerListFunc.closeList,
            focusChange: "",
            beforeMoveChange: "",
            moveChange: ""
        }, {
            id: 'searchText',
            name: '号码框',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'submit',
            backgroundImage: '',
            focusImage: '',
            click: "",
            focusChange: WinnerListFunc.keyPad,
            beforeMoveChange: "",
            moveChange: ""
        }],
        show: function () {
            var _html = "";
            _html += '<img src="' + RenderParam.imgPathPrefix + 'bg_winner_list.png"/>';
            _html += '<img id="btn-submit" class="submitPosition" src="' + RenderParam.imgPathPrefix + '/btn_sure.png"/>';
            _html += '<img id="btn-cancel" class="cancelPosition" src="' + RenderParam.imgPathPrefix + '/btn_cancel.png"/>';
            _html += '<div id="searchText" class="searchTextPosition">请输入有效的手机号码</div>';

            guide.dialogWrap.innerHTML = _html;

            AjaxHelper.getWinnerList();
            // WinnerListFunc.renderList(RenderParam.exchangeRecord.data['all_list'], RenderParam.exchangeRecord.data['list']);


            LMEPG.ButtonManager.addButtons(WinnerListDialog.buttons);
            LMEPG.ButtonManager.requestFocus("btn-submit");

            w.onBack = WinnerListFunc.closeList;
        }
    };

    w.WinnerListFunc = WinnerListFunc;
    w.WinnerListDialog = WinnerListDialog;
})(window, undefined);

(function (w, undefined) {

    function Fruit(fruitId, fruitScore) {
        this.fruitObj = G(fruitId);
        this.fruitScore = fruitScore;
        this.positionY = Math.random() * 100;
        this.dropOffsetY = ( RenderParam.platformType === "hd" ? 10 : 5);
        this.winPrizeDropOffsetY = ( RenderParam.platformType === "hd" ? 125 : 70);
    };

    Fruit.prototype.drop = function () {
        GameFunc.dropFruit(this);
        var oSelf = this;
        oSelf.dropTimer = setTimeout(function () {
            oSelf.drop();
        }, 35);
    };
    w.Fruit = Fruit;

    var GameFunc = {
        score: 0,
        countdown: 10,
        countTimer: null,
        frogLeft: RenderParam.platformType === "hd" ? 480 : 240,
        dropOffsetY: RenderParam.platformType === "hd" ? 10 : 5,
        winPrizeDropOffsetY: RenderParam.platformType === "hd" ? 125 : 70,
        step: RenderParam.platformType === "hd" ? 120 : 80,
        winWithinHandY: RenderParam.platformType === "hd" ? 50 : 30,
        ALLOW_MAX_BALLOON: 4,
        regionWidth: RenderParam.platformType === "hd" ? 9 : 6,
        bottomPosition: 120,
        gameWrap: G('content'),

        onBeforeMoveChange: function (direction, current) {
            var self = current.obj;
            //实现翻页
            if ((direction === 'left')) {
                if ((self.frogLeft > 0)) {
                    // 向左移动边界
                    self.hand(-self.step);
                }
                return false;
            }
            if (direction === 'right') {
                if ((self.frogLeft < G("content").clientWidth - self.step)) {
                    // 向右移动边界
                    self.hand(self.step);
                }
                return false;
            }
        },

        hand: function (deltaX) {
            var hand = G("hand");
            this.frogLeft = parseInt(hand.style.left) + deltaX;
            hand.style.left = this.frogLeft + 'px';
        },

        dropFruit: function (fruit) {
            fruit.positionY += this.dropOffsetY;

            var contentHeight = G('content').clientHeight;
            if (fruit.positionY + this.winPrizeDropOffsetY > contentHeight) {
                if (parseInt(fruit.fruitObj.style.left) === this.frogLeft && ((fruit.positionY + this.winWithinHandY) < contentHeight)) {
                    this.score += fruit.fruitScore;
                    fruit.positionY = 0;
                    fruit.fruitObj.style.left = Math.ceil(Math.random() * this.regionWidth) * this.step + "px";//随机产生1到5的数乘以位置移动量去实现每次掉落不同的位置
                } else if (fruit.positionY + this.winPrizeDropOffsetY > parseInt(contentHeight) + this.bottomPosition) {
                    fruit.positionY = 0;
                    fruit.fruitObj.style.left = Math.ceil(Math.random() * this.regionWidth) * this.step + "px";//随机产生1到5的数乘以位置移动量去实现每次掉落不同的位置
                }
            }
            fruit.fruitObj.style.top = fruit.positionY + "px";
        },

        initFruit: function () {
            var gameContainer = G('game-container');
            gameContainer.innerHTML = '';
            for (var i = 1; i <= this.ALLOW_MAX_BALLOON; i++) {
                gameContainer.innerHTML += '<div id="fruit' + i + '" class="fruit" style="display: none"><img id="fruit-img-' + i + '" class="fruit_img"  alt="" /></div>';
            }

            for (var j = 1; j <= this.ALLOW_MAX_BALLOON; j++) {
                var dom = G('fruit' + j);
                dom.style.display = 'block';
                dom.style.top = [0, 145, 290, 435][j - 1] + 'px';
                dom.style.left = Math.ceil(Math.random() * this.regionWidth) * this.step + "px";
                var index = Math.ceil(Math.random() * 6);
                var score;
                if (index === 1 || index === 2) {
                    score = 3;
                } else {
                    score = 5;
                }
                var imgDom = G('fruit-img-' + j);
                imgDom.src = RenderParam.imgPathPrefix + "play_img_" + index + ".png";
                var fruit = new Fruit('fruit' + j, score);
                fruit.drop();
            }
        },

        countDown: function () {
            if (this.countdown === -1) {
                Fruit.prototype.drop = function () {
                    clearTimeout(this.dropTimer);
                };
                clearTimeout(this.countTimer);
                AjaxHelper.updateScore(this.score);
            } else {
                G("timer").innerHTML = '倒计时：' + (this.countdown--) + '' + 's';
                var self = this;
                this.countTimer = setTimeout(function () {
                    self.countDown();
                }, 1000);
            }
        },

        start: function () {
            AjaxHelper.uploadPlayRecord();
            // 定位青蛙到指定位置
            G("hand").style.left = this.frogLeft + "px";
            this.initFruit();
            this.countDown();
        }
    };

    w.GameFunc = GameFunc;
    var Game = {
        buttons: [{
            id: 'hand',
            name: '接手',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            click: "",
            focusChange: "",
            beforeMoveChange: GameFunc.onBeforeMoveChange,
            moveChange: "",
            obj: GameFunc
        }],
        show: function () {
            var _html = "";
            _html += '<img src="' + RenderParam.imgPathPrefix + '/play_bg.png"/>';
            _html += '<div id="content">';
            _html += '<img id="hand" src="' + RenderParam.imgPathPrefix + '/frog_run.png"/>';
            _html += '<div id="game-container">';
            _html += '</div></div>';
            _html += '<div id="timer">倒计时：10s</div>';

            guide.dialogWrap.innerHTML = _html;

            LMEPG.ButtonManager.addButtons(Game.buttons);
            LMEPG.ButtonManager.requestFocus("hand");
            GameFunc.start();
        }
    };

    w.Game = Game;
})(window, undefined);

(function (w, undefined) {
    function GameOverDialog() {
        this.isPurchaseVIP = false;
        this.buttons = [
            {
                id: 'btn_game_over',
                name: '游戏结束',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: RenderParam.imgPathPrefix + 'bg_sure.png',
                focusImage: RenderParam.imgPathPrefix + 'btn_sure_f.gif',
                click: this.onGameOverClick,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: "",
                obj: this
            }
        ];
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            this.isPurchaseVIP = true;
            this.bgImage = RenderParam.imgPathPrefix + "bg_no_all_times.png";
        } else {
            this.bgImage = RenderParam.imgPathPrefix + "bg_no_times.png";
        }
    };

    GameOverDialog.prototype.show = function () {
        var _html = "";

        _html += '<img src=' + this.bgImage + '>';
        _html += '<img id="btn_game_over" src="' + RenderParam.imgPathPrefix + '/btn_sure_f.gif" >';
        guide.dialogWrap.innerHTML = _html;

        LMEPG.ButtonManager.addButtons(this.buttons);
        LMEPG.ButtonManager.requestFocus("btn_game_over");

        w.onBack = this.dismissDialog;
    };

    GameOverDialog.prototype.onGameOverClick = function (btn) {
        w.onBack = Page.onBack;
        if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
            gameOverDialog.dismissDialog();
        } else {
            // 跳转局方订购页
            //Page.jumpBuyVip();
            gameOverDialog.dismissDialog();
        }
    };

    GameOverDialog.prototype.dismissDialog = function () {
        // 结束当前页面
        guide.dialogWrap.innerHTML = "";
        LMEPG.ButtonManager.deleteButtons(gameOverDialog.buttons);
        LMEPG.ButtonManager.requestFocus("btn-start");
        w.onBack = guide.goBack;
    };
    w.gameOverDialog = new GameOverDialog();
})(window, undefined);


(function () {
    function PurchaseStatusDialog(isSuccess) {
        var statusImg = '';
        if (isSuccess) {
            statusImg = 'pay_success.png';
        } else {
            statusImg = 'pay_failed.png';
        }
        var _html = "";
        // 创建背景蒙层
        _html += '<img id="mb_box" class="dialogContext" src="' + RenderParam.imgPathPrefix + statusImg + '"/>';

        var options = {
            el: 'dialog_wrap',
            focusId: '',
            buttons: [],
            dismissFocusId: 'go-gamePage',
            dialogHtml: _html
        };

        LMActivityDialog.call(this, options);
    }

    PurchaseStatusDialog.prototype = new LMActivityDialog();
    PurchaseStatusDialog.prototype.constructor = PurchaseStatusDialog;

    window.PurchaseStatusDialog = PurchaseStatusDialog;
})();

(function (w, undefined) {
    function Guide() {
        this.buttons = [];
        this.dialogWrap = document.getElementById("dialog_wrap");
        this.bgIndex = "";
        this.countDialog = null;
    }

    Guide.prototype.renderBackgroundImg = function () {
        // 该活动不同{carrierId}地区使用图素区分（背景、活动规则、奖品1,2,3）
        switch (RenderParam.lmcid) {
            case "000051":
                this.bgIndex = "V1";
                break;
            case "630092": // 青海
                this.bgIndex = "V2";
                break;
            case "420092": // 湖北
                this.bgIndex = "V3";
                break;
        }
        document.body.style.backgroundImage = "url('" + RenderParam.bgImagePrefix + this.bgIndex + "/guide_bg.png')";
    };

    Guide.prototype.setEnergyValue = function () {
        var energyValue = RenderParam.energyValue;
        if (energyValue < 0) {
            return;
        }
        if (energyValue >= 0 && energyValue <= 200) {
            G('frog-status').src = RenderParam.imgPathPrefix + 'frog_hot.png';
        } else if (energyValue > 200 && energyValue <= 350) {
            G('frog-status').src = RenderParam.imgPathPrefix + 'frog_normal.png';
        } else if (energyValue > 350 && energyValue <= 600) {
            G('frog-status').src = RenderParam.imgPathPrefix + 'frog_cool.png';
        } else {
            G('frog-status').src = RenderParam.imgPathPrefix + 'frog_normal.png';
        }
        var energyY = energyValue / 800 * 280;
        G('energy-status-box').style.backgroundPosition = '0px ' + energyY + 'px';
    };

    Guide.prototype.setLeftTimes = function (leftTimes) {
        this.leftTimes = leftTimes;
        document.getElementById("show-box").innerHTML = leftTimes;
    };

    Guide.prototype.onPlayGameClick = function (btn) {
        var self = btn.obj;
        if (self.leftTimes > 0) {     // 进入游戏页
            Game.show();
        } else {                // 次数用尽弹窗
            gameOverDialog.show();
        }
    };

    Guide.prototype.initButtons = function () {
        var imgPath = RenderParam.imgPathPrefix;
        this.buttons.push({
                id: 'back',
                name: '返回',
                type: 'img',
                nextFocusLeft: 'btn-start',
                nextFocusRight: 'btn-walk-through',
                nextFocusUp: '',
                nextFocusDown: 'btn-rule',
                backgroundImage: imgPath + 'bg_back.png',
                focusImage: imgPath + 'f_back.gif',
                click: this.goBack,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            }, {
                id: 'btn-rule',
                name: '活动详情',
                type: 'img',
                nextFocusLeft: 'btn-start',
                nextFocusRight: 'btn-walk-through',
                nextFocusUp: 'back',
                nextFocusDown: 'btn-price',
                backgroundImage: imgPath + 'bg_rule.png',
                focusImage: imgPath + 'f_rule.gif',
                click: ruleDialog.show,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            }, {
                id: 'btn-price',
                name: '中奖名单',
                type: 'img',
                nextFocusLeft: 'btn-start',
                nextFocusRight: 'btn-walk-through',
                nextFocusUp: 'btn-rule',
                nextFocusDown: 'btn-produce',
                backgroundImage: imgPath + 'bg_list.png',
                focusImage: imgPath + 'f_list.gif',
                click: WinnerListDialog.show,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            }, {
                id: 'btn-produce',
                name: '兑换奖品',
                type: 'img',
                nextFocusLeft: 'btn-start',
                nextFocusRight: 'btn-walk-through',
                nextFocusUp: 'btn-price',
                nextFocusDown: 'btn-start',
                backgroundImage: imgPath + 'bg_produce.png',
                focusImage: imgPath + 'f_produce.gif',
                click: ExchangeDialog.show,
                focusChange: "",
                beforeMoveChange: '',
                moveChange: ''
            }, {
                id: 'btn-start',
                name: '开始游戏',
                type: 'img',
                nextFocusLeft: 'btn-walk-through',
                nextFocusRight: 'btn-produce',
                nextFocusUp: 'btn-produce',
                nextFocusDown: '',
                backgroundImage: imgPath + 'bg_start.png',
                focusImage: imgPath + 'f_start.gif',
                click: this.onPlayGameClick,
                focusChange: "",
                beforeMoveChange: '',
                moveChange: '',
                obj: this
            }, {
                id: 'btn-walk-through',
                name: '图文介绍',
                type: 'img',
                nextFocusLeft: 'btn-rule',
                nextFocusRight: 'btn-start',
                nextFocusUp: '',
                nextFocusDown: 'btn-start',
                backgroundImage: imgPath + 'bg_walk_through.png',
                focusImage: imgPath + 'f_walk_through.gif',
                click: SkillDialog.show,
                focusChange: "",
                beforeMoveChange: '',
                moveChange: ''
            }
        );

        if(RenderParam.lmcid === "000051" || RenderParam.lmcid === "10000051"){
            G('akys').style.display = 'block';
            G('slh').style.display = 'block';
            G('jkmf').style.display = 'block';
            G('slh').style.top = '80px';
            G('akys').style.top = '278px';
            G('jkmf').style.left = '14px';
            G('btn-walk-through').style.left = '1060px';
            G('btn-walk-through').style.top = '368px';

            this.buttons.push({
                id: 'akys',
                name: '爱看影视',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-price',
                nextFocusUp: 'slh',
                nextFocusDown: 'jkmf',
                backgroundImage: imgPath + 'btn_akys.png',
                focusImage: imgPath + 'btn_akys_f.png',
                click: this.goThirdPartySp,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
            },{
                id: 'slh',
                name: '食乐汇',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-rule',
                nextFocusUp: '',
                nextFocusDown: 'akys',
                backgroundImage: imgPath + 'btn_slh.png',
                focusImage: imgPath + 'btn_slh_f.png',
                click: this.goThirdPartySp,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
            },{
                id: 'jkmf',
                name: '健康魔方',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-start',
                nextFocusUp: 'akys',
                nextFocusDown: 'btn-start',
                backgroundImage: imgPath + 'btn_jkmf.png',
                focusImage: imgPath + 'btn_jkmf_f.png',
                click: this.goThirdPartySp,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: '',
            });

            for (var i = 0; i < this.buttons.length; i++) {
                if(this.buttons[i].id === "btn-start"){
                    this.buttons[i].nextFocusLeft = 'jkmf';
                }
                if(this.buttons[i].id === "btn-walk-through"){
                    this.buttons[i].nextFocusUp = 'btn-produce';
                    this.buttons[i].nextFocusLeft = 'btn-start';
                }
                if(this.buttons[i].id === "btn-produce"){
                    this.buttons[i].nextFocusDown = 'btn-walk-through';
                }
            }
        }

        LMEPG.ButtonManager.init("btn-start", this.buttons, '', true);
        w.onBack = this.goBack;
    };

    Guide.prototype.goBack = function () {
        if(RenderParam.lmcid === "000051" && RenderParam.userAccount.split('_')[1] === '204'){
            if(typeof(window.parent.iframeReturnUrl) == 'function'){
                //河南3.0版本的返回大厅逻辑
                window.parent.iframeReturnUrl();
            }else{
                LMEPG.Intent.back('IPTVPortal');
            }
        }else{
            LMActivity.page.goBack();
        }
    };

    Guide.prototype.goThirdPartySp = function (btn) {
        //办事处要求不跳转订购
        if(RenderParam.isVip || true){
            if(btn.id === "slh"){
                var objCurrent = Page.getCurrentPage();
                var objDialog = LMEPG.Intent.createIntent("home");
                objDialog.setParam("isJoinActivit", 1);
                LMEPG.Intent.jump(objDialog, objCurrent,LMEPG.Intent.INTENT_FLAG_DEFAULT);
            }else{
                var objThirdPartySP = LMEPG.Intent.createIntent("activity-common-thirdPartySP");
                objThirdPartySP.setParam("contentId", btn.id);
                objThirdPartySP.setParam("isChangeReturnUrl", 2);
                objThirdPartySP.setParam("backUrl", encodeURIComponent(window.location.href));
                LMEPG.Intent.jump(objThirdPartySP);
            }
        }else{
            Page.unionBuyVip(btn.id);
        }
    };

    Guide.prototype.showOrderResult = function () {
        if (RenderParam.isOrderBack == "1") {
            if (RenderParam.cOrderResult == "1") {
                window.payStatusDialog = new PurchaseStatusDialog(true);
            } else {
                window.payStatusDialog = new PurchaseStatusDialog(false);
            }
            window.payStatusDialog.showDialog();
            window.onBack = function () {
                payStatusDialog.dismissDialog();
                window.onBack = guide.goBack;
            }
        }
    };

    w.Guide = Guide;
})(window, undefined);

