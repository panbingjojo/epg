/**
 * 愚翻天活动
 * */
var PAGE = {
    keyCookie: RenderParam.activityName + RenderParam.userId,    //cookie键值，用于判断用户是否1分钟内反复点击产品订购
    buttons: [],
    firstId: 'car_two',//记住是哪张卡片
    timeClock: null,
    thisFrequency: 3,
    tempData: "",
    isclown: false,
    isDirectOrder: true,
    isFirst: true,//判断是否为首次 (true则会出发额外一次)
    residue: RenderParam.leftTimes,
    unionInfo: [
        {
            "area": [
                {
                    "product_id": "jkmf",
                    "img": {"bg": "/V000051/216/btn_order_0.png", "bgf": "/V000051/216/btn_order_0_f.png"}
                },
                {
                    "product_id": "mdy",
                    "img": {"bg": "/V000051/216/btn_order_1.png", "bgf": "/V000051/216/btn_order_1_f.png"}
                },
                {
                    "product_id": "lndx",
                    "img": {"bg": "/V000051/216/btn_order_2.png", "bgf": "/V000051/216/btn_order_2_f.png"}
                },
                {
                    "product_id": "klxq",
                    "img": {"bg": "/V000051/216/btn_order_3.png", "bgf": "/V000051/216/btn_order_3_f.png"}
                },
            ]
        },
        {
            "area": [
                {
                    "product_id": "sjjklinux",
                    "img": {"bg": "V000051/208/btn_order_0.png", "bgf": "/V000051/208/btn_order_0_f.png"}
                },
                {
                    "product_id": "qzlyx",
                    "img": {"bg": "V000051/208/btn_order_1.png", "bgf": "/V000051/208/btn_order_1_f.png"}
                },
                {
                    "product_id": "hbltyd",
                    "img": {"bg": "V000051/208/btn_order_2.png", "bgf": "/V000051/208/btn_order_2_f.png"}
                },
                {
                    "product_id": "wjyybs",
                    "img": {"bg": "V000051/208/btn_order_3.png", "bgf": "/V000051/208/btn_order_3_f.png"}
                },
            ]
        },
        {
            "area": [
                {
                    "product_id": "sjjklinux",
                    "img": {"bg": "/V000051/207/btn_order_1.png", "bgf": "/V000051/207/btn_order_1_f.png"}
                },
                {
                    "product_id": "qzlyx",
                    "img": {"bg": "/V000051/207/btn_order_0.png", "bgf": "/V000051/207/btn_order_0_f.png"}
                },
                {
                    "product_id": "wjyybs",
                    "img": {"bg": "/V000051/207/btn_order_2.png", "bgf": "/V000051/207/btn_order_2_f.png"}
                },
                {
                    "product_id": "jqcs",
                    "img": {"bg": "/V000051/207/btn_order_3.png", "bgf": "/V000051/207/btn_order_3_f.png"}
                },
            ]
        },
    ],
    playerInfo: [
        {"name": 111, "vote": 0, "img": "icon_congee_2"},
        {"name": 222, "vote": 0, "img": "icon_congee_1"},
        {"name": 333, "vote": 0, "img": "icon_congee_3"}
    ],
    init: function () {
        G("frequency").innerHTML = "剩余" + PAGE.residue + "次";
        if(RenderParam.platformType=="sd"){
            G("frequency").innerHTML = PAGE.residue;
        }
        this.UnionInit();
        this.createButton();
        this.initButtons('car_two');
       if(RenderParam.isOrderBack === '1'){
           this.showOrderResult();
       }
        lmInitGo();
    },
    /**
     * 初始化按钮
     * @param focusId 默认聚焦的按钮
     */
    initButtons: function (focusId) {
        LMEPG.ButtonManager.init(focusId, this.buttons, "", true);
    },
    /**
     * 创建图片数组
     * */
    createButton: function () {
        this.buttons.push(
            {
                id: 'btn_activity_rule',
                name: '活动规则',
                type: 'img',
                nextFocusRight: 'btn_back',
                nextFocusDown: 'car_one',
                backgroundImage: RenderParam.imagePath + 'act_rule.png',
                focusImage: RenderParam.imagePath + 'act_rule_f.png',
                nowShow: 'activity_rule',
                beforeMoveChange: PAGE.beforeBtnChange,
                moveChange: PAGE.btnMoveChangeFocus,
                click: this.eventHandler
            },
            {
                id: 'btn_close_rule',
                name: '活动规则tupian',
                type: 'img',
                backgroundImage: RenderParam.imagePath + 'V000051/ ',
                focusImage: RenderParam.imagePath + '/V000051/union_rule.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: this.eventHandler
            },
            {
                id: 'btn_back',
                name: '返回',
                type: 'img',
                nextFocusLeft: 'btn_activity_rule',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: RenderParam.imagePath + 'act_back.png',
                focusImage: RenderParam.imagePath + 'act_back_f.png',
                beforeMoveChange: PAGE.beforeBtnChange,
                moveChange: PAGE.btnMoveChangeFocus,
                click: this.eventHandler
            },
            {
                id: 'btn_winner_list',
                name: '获奖名单-按钮',
                type: 'img',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'car_one',
                backgroundImage: RenderParam.imagePath + 'act_award_list.png',
                focusImage: RenderParam.imagePath + 'act_award_list_f.png',
                nowShow: 'winner_list',
                listType: 'lottery',
                beforeMoveChange: PAGE.beforeBtnChange,
                moveChange: PAGE.btnMoveChangeFocus,
                click: this.eventHandler
            },
            {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusRight: 'btn_list_cancel',
                nextFocusLeft:RenderParam.platformType=="hd"?'reset_tel':'',
                nextFocusUp:RenderParam.platformType=="sd"?'reset_tel':'',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                listType: 'lottery',
                click: LMActivity.eventHandler
            },
            {
                id: 'btn_list_cancel',
                name: '中间名单取消',
                type: 'img',
                nextFocusLeft: 'btn_list_submit',
                backgroundImage: RenderParam.imagePath + 'btn_common_cancel.png',
                focusImage: RenderParam.imagePath + 'btn_common_cancel_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: LMActivity.eventHandler
            },
            {
                id: 'reset_tel',
                name: '输入框-中奖名单-重置电话号码',
                type: 'div',
                nextFocusDown: 'btn_list_submit',
                backFocusId: 'btn_list_submit',
                focusChange: LMActivity.onInputFocus,
                click: LMActivity.eventHandler,
            },
            {
                id: 'car_one',
                name: '卡片左边',
                type: 'div',
                nextFocusUp: 'btn_activity_rule',
                nextFocusRight: 'car_two',
                nextFocusDown: 'sp_one',
                backgroundImage: null,
                focusImage: RenderParam.imagePath + 'car_bg.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'car_two',
                name: '中间卡片',
                type: 'div',
                nextFocusUp: 'btn_activity_rule',
                nextFocusRight: 'car_three',
                nextFocusLeft: 'car_one',
                nextFocusDown: 'sp_one',
                backgroundImage: null,
                focusImage: RenderParam.imagePath + 'car_bg.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'car_three',
                name: '右边卡片',
                type: 'div',
                nextFocusUp: 'btn_activity_rule',
                nextFocusLeft: 'car_two',
                nextFocusDown: 'sp_one',
                backgroundImage: null,
                focusImage: RenderParam.imagePath + 'car_bg.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            }
            ,
            {
                id: 'opt_clown',
                name: '立即抽奖',
                type: 'img',
                nextFocusRight: 'opt_cancel',
                backgroundImage: RenderParam.imagePath + 'btn_start.png',
                focusImage: RenderParam.imagePath + 'btn_start_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'opt_cancel',
                name: '抽到小丑取消',
                type: 'img',
                nextFocusLeft: 'opt_clown',
                backgroundImage: RenderParam.imagePath + 'btn_common_cancel.png',
                focusImage: RenderParam.imagePath + 'btn_common_cancel_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'btn_lottery_submit',
                name: '中奖确定-',
                type: 'img',
                nextFocusRight: 'btn_lottery_cancel',
                nextFocusUp: 'lottery_tel',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                click: LMActivity.eventHandler
            },
            {
                id: 'btn_lottery_cancel',
                name: '抽中奖取消',
                type: 'img',
                nextFocusLeft: 'btn_lottery_submit',
                backgroundImage: RenderParam.imagePath + 'btn_common_cancel.png',
                focusImage: RenderParam.imagePath + 'btn_common_cancel_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'no_sure',
                name: '没有抽到小丑',
                type: 'img',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'clw_opt_nolotter',
                name: '用小丑没有抽到奖',
                type: 'img',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            }, {
                id: 'lottery_tel',
                name: '输入框-兑换-电话号码',
                type: 'div',
                listType: 'lottery',
                nextFocusDown: 'btn_lottery_submit',
                backFocusId: "btn_lottery_submit",//电话号
                focusChange: LMActivity.onInputFocus
            },
            {
                id: 'purchase_sure',
                name: '可以订购确定',
                type: 'img',
                nextFocusRight: 'purchase_sure_false',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'purchase_sure_false',
                name: '可以订购取消',
                type: 'img',
                nextFocusLeft: 'purchase_sure',
                backgroundImage: RenderParam.imagePath + 'btn_common_cancel.png',
                focusImage: RenderParam.imagePath + 'btn_common_cancel_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'purchase_false',
                name: '不能订购取消',
                type: 'img',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'purchase_succeed_sure',
                name: '订购成功确定',
                type: 'img',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'purchase_fail_sure',
                name: '订购失败确定',
                type: 'img',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'extra_ensure',
                name: '额外一次',
                type: 'img',
                backgroundImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                focusImage: RenderParam.imagePath + 'btn_common_sure_f.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.isEnter
            },
            {
                id: 'sp_one',
                name: '第一个sp',
                type: 'img',
                nextFocusUp: "car_one",
                nextFocusRight: 'sp_two',
                backgroundImage: RenderParam.imagePath + this.tempData.area[0].img.bg,
                focusImage: RenderParam.imagePath + this.tempData.area[0].img.bgf,
                contentId: this.tempData.area[0].product_id,
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.UnionEnter
            },
            {
                id: 'sp_two',
                name: '第二个sp',
                type: 'img',
                nextFocusUp: "car_one",
                nextFocusRight: 'sp_three',
                nextFocusLeft: 'sp_one',
                backgroundImage: RenderParam.imagePath + this.tempData.area[1].img.bg,
                focusImage: RenderParam.imagePath + this.tempData.area[1].img.bgf,
                contentId: this.tempData.area[1].product_id,
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.UnionEnter
            },
            {
                id: 'sp_three',
                name: '第三个sp',
                type: 'img',
                nextFocusUp: "car_one",
                nextFocusRight: 'sp_four',
                nextFocusLeft: 'sp_two',
                backgroundImage: RenderParam.imagePath + this.tempData.area[2].img.bg,
                focusImage: RenderParam.imagePath + this.tempData.area[2].img.bgf,
                contentId: this.tempData.area[2].product_id,
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.UnionEnter
            },
            {
                id: 'sp_four',
                name: '第4个sp',
                type: 'img',
                nextFocusUp: "car_one",
                nextFocusLeft: 'sp_three',
                backgroundImage: RenderParam.imagePath + this.tempData.area[3].img.bg,
                focusImage: RenderParam.imagePath + this.tempData.area[3].img.bgf,
                contentId: this.tempData.area[3].product_id,
                moveChange: PAGE.btnMoveChangeFocus,
                click: PAGE.UnionEnter
            }
        )
    },
    /**
     * 关闭规则、获奖名单
     * */
    closeReglation: function () {
        G("activity_rule").style.display = "none"
        G("winner_list").style.display = "none";
        PAGE.initButtons('car_two');
    },
    /**
     * 失去焦点前
     * */
    beforeBtnChange: function (dir, btn) {
        if (null != btn.nowShow) {
            G(btn.nowShow).style.display = "none";
        }
    },
    /**
     * 获得焦点回调
     * */
    btnMoveChangeFocus: function (blurBtn, focusBtn) {
        if (null != blurBtn.id)
            if (blurBtn.id.indexOf("car") > -1) {//卡片失去焦点，重置获取焦点的背景
                G(blurBtn.id).style.backgroundImage = '';
                blurBtn.focusImage = RenderParam.imagePath + 'car_bg.png'
                G(blurBtn.id).children[0].src = RenderParam.imagePath + "style_1.png"
            }
        if (focusBtn.id.indexOf("sp") > -1 && blurBtn.id.indexOf("car") > -1) {
            G(blurBtn.id).style.backgroundImage = '';
            G(blurBtn.id).children[0].src = RenderParam.imagePath + "style_1.png"
        }
    },
    /**
     * 全部的点击事件
     * */
    isEnter: function (Btn) {
        switch (Btn.id) {//act不要权限的操作 看规则等
            case "clw_opt_nolotter"://用小丑没有抽到奖品
                LMActivity.Router.reload();
                break;
            case "no_sure"://没有抽到小丑确认
                LMActivity.Router.reload();
                break;
        }
        if (PAGE.residue != 0 || PAGE.isclown == true) {//剩余的次数大于1或者有小丑
            PAGE.surLuckyLotter(Btn);
        } else {//剩余的次数不够,订购
            PAGE.planceOrder(Btn);
        }
    },
    /**
     * 没有次数且无消除
     * */
    planceOrder: function (Btn) {
        switch (Btn.id) {
            case "purchase_sure"://可以订购确定
                PAGE.closePurchase();//关闭页面去去选择sp
                break;
            case "purchase_sure_false"://可以订购取消
                PAGE.closePurchase();//关闭页面去去选择sp
                return;
                break;
            case "purchase_false"://是vip且所有的都已经订购过后，不可以订购确定
                PAGE.closePurchase();
                return;
                break;
            case "purchase_fail_sure"://订购失败确定
                PAGE.closePurchase();
                return;
                break;
            case "extra_ensure"://额外一次
                var count = 1;
                PAGE.extraFirst(count);
                break;
        }
        if (Btn.id.indexOf("car") > -1) {
            PAGE.purchase(Btn);
        }
    },
    /**
     * 可以抽奖
     * */
    surLuckyLotter: function (Btn) {
        switch (Btn.id) {
            case "car_one"://卡片操作小丑
                var rand = parseInt(Math.floor(Math.random() * PAGE.thisFrequency));
                PAGE.lotterClown(rand, Btn, PAGE.isclown);
                break;
            case "car_two":
                var rand = parseInt(Math.floor(Math.random() * PAGE.thisFrequency));
                PAGE.lotterClown(rand, Btn, PAGE.isclown);
                break;
            case "car_three"://卡片操作小丑
                var rand = parseInt(Math.floor(Math.random() * PAGE.thisFrequency));
                PAGE.lotterClown(rand, Btn, PAGE.isclown);
                break;
            case "opt_clown"://抽中小丑确认
                var rand = parseInt(Math.floor(Math.random() * PAGE.thisFrequency));
                PAGE.optClownSure(rand);
                break;
            case "opt_cancel"://抽中小丑取消
                LMActivity.Router.reload();
                break;
              case "btn_lottery_cancel"://抽中奖取消
                  LMActivity.Router.reload();
                  break;

        }
    },
    /**
     * 第二轮抽奖
     * 用小丑抽到奖品
     * */
    optClownSure: function () {
        PAGE.isclown = false;
        PAGE.doLotteryRound2();
    },
    doLotteryRound2: function () {
        LMActivity.prizeId = "undefined";
        LMActivity.roundFlag = 2;
        LMActivity.AjaxHandler.lottery(function (data) {
            LMActivity.exchangePrizeId = data.prize_idx;
            LMActivity.lotteryPrizeId=data.prize_idx;
            switch (data.prize_name) {
                case "Ipad":
                    G("wining_").src = RenderParam.imagePath + "/V000051/union_award_iPad.png";
                    break;
                case "电动牙刷":
                    G("wining_").src = RenderParam.imagePath + "/V000051/union_award_toothbresh.png";
                    break;
                case "消毒湿巾":
                    G("wining_").src = RenderParam.imagePath + "/V000051/union_award_tissue.png";
                    break;
            }
            LMActivity.showModal({
                id: 'clw_opt_clwon_div',
                focusId: 'btn_lottery_submit',
                onDismissListener: function () {
                    LMActivity.Router.reload();
                }
            });
        }, function () {
            LMActivity.showModal({
                id: 'clw_opt_nolotter_div',
                focusId: 'clw_opt_nolotter',
                onDismissListener: function () {
                    LMActivity.Router.reload();
                }
            })
        });
    },
    /**
     * <!--抽到小丑div-->
     opt_clwon_div
     <!--用小丑抽到奖品-->
     clw_opt_clwon_div
     <!--没有抽到小丑-->
     no_clwon_div
     <!--用小丑没有抽到奖品-->
     clw_opt_nolotter_div
     * 减去次数 count
     * */
    reduceTime: function () {//关闭全部的div
        G("opt_clwon_div").style.display = "none";
        G("clw_opt_clwon_div").style.display = "none";
        G("no_clwon_div").style.display = "none";
        G("clw_opt_nolotter_div").style.display = "none";
        PAGE.initButtons(PAGE.firstId);//把焦点回溯
    },
    /**
     *抽小丑
     */
    lotterClown: function (rand, Btn) {
        PAGE.firstId = Btn.id;
        Btn.focusImage = RenderParam.imagePath + 'car_bg_f.png';
        LMActivity.AjaxHandler.uploadPlayRecord(function () {
                PAGE.residue = parseInt(PAGE.residue) - parseInt(1);
            G("frequency").innerHTML = "剩余" + PAGE.residue + "次";
            if(RenderParam.platformType=="sd"){
                G("frequency").innerHTML = PAGE.residue;
            }
                LMActivity.AjaxHandler.lottery(function (data) {
                    PAGE.reduceTime();
                    G(Btn.id).children[0].src = RenderParam.imagePath + "time_over_1.png";//换上小丑的背景
                    var timeClock = setInterval(function () {
                        clearInterval(timeClock);
                        G("opt_clwon_div").style.display = "block";
                        PAGE.initButtons("opt_clown")
                        PAGE.isclown = true;
                    }, 500);
                }, function () {//没有抽中
                    PAGE.reduceTime();
                    G(Btn.id).children[0].src = RenderParam.imagePath + "time_over.png";//换上小丑的背景
                    var timeClock = setInterval(function () {
                        clearInterval(timeClock);
                        G("no_clwon_div").style.display = "block";
                        PAGE.initButtons("no_sure");
                        PAGE.isclown = false;
                    }, 500);

                });
            }, function () {//订购失败
                LMEPG.UI.showToast('扣除戏次数出错', 3);
            }
        )
    },
    /**
     * order_vip
     * purchase_false_div
     * purchase_succeed_div
     * purchase_fail_div
     * dun_down_div
     * 订购开始
     * */
    purchase: function (Btn) {
        PAGE.firstId = Btn.id;
        if (RenderParam.isVip == 1) {//是vip可以购买次数
            if (PAGE.hasOrderSp() == 0) {
                // 订购产品数量少于1
                PAGE.outBookUnion(PAGE.GlMath());
                return;
            }
            if (PAGE.hasOrderSp() == 4 && RenderParam.leftTimes == 0) {//4款都订购过
                G("purchase_false_div").style.display = "block";
                PAGE.initButtons("purchase_false")
                return;
            }
            if (PAGE.hasOrderSp() != 4) {//有sp可以订购的
                PAGE.closePurchase();
                G("order_vip").style.display = "block";
                PAGE.initButtons("purchase_sure");//把弹出的确定框作为当前焦点
            }

            } else {//不可以可以购买次数
            if (PAGE.hasOrderSp() == 0) {

                // 订购产品数量少于1
                PAGE.outBookUnion(PAGE.GlMath());
                return;
            }
                if (PAGE.hasOrderSp() == 4 && RenderParam.leftTimes == 0) {//4款都订购过
                    G("purchase_false_div").style.display = "block";
                    PAGE.initButtons("purchase_false")
                    return;
                }
                if (PAGE.hasOrderSp() != 4) {//有sp可以订购的
                    PAGE.closePurchase();
                    G("order_vip").style.display = "block";
                    PAGE.initButtons("purchase_sure");//把弹出的确定框作为当前焦点
                }
            }
    },
    //随机数概率计算
    GlMath: function () {
        var tempProduct = RenderParam.areaCode == "216" ? PAGE.unionInfo[0] : (RenderParam.areaCode == "208" ? PAGE.unionInfo[1] : PAGE.unionInfo[2]);
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
    /**
     * 关闭订购打开的窗口
     * */
    closePurchase: function () {
        G("dun_down_div").style.display = "none";
        G("extra_div").style.display = "none";
        G("purchase_false_div").style.display = "none";
        G("order_vip").style.display = "none";
        G("purchase_fail_div").style.display = "none";
        G("purchase_succeed_div").style.display = "none";
        PAGE.initButtons(PAGE.firstId);
        /*LMActivity.Router.reload();*/
    },
    /**
     * 可以订购取消延时
     * isFirst 是否第一次
     * */
    falseDeferred: function (first, Btn) {
        var second = parseInt(G("second").innerHTML);
        if (first) {//第一次extra_div
            PAGE.closePurchase();
            G("dun_down_div").style.display = "block";
            G("extra_div").style.display = "block";
            this.reduceSecond(second, Btn)
        } else {
            PAGE.closePurchase();
        }
    },
    reduceSecond: function (sed, Btn) {
        timeClock = setInterval(function () {
            sed--;
            G("second").innerHTML = sed;
            if (sed == 0) {
                clearInterval(timeClock);
                /*$('.clock').html(60);*/
                if (Btn.id.indexOf("purchase_sure_false") > -1) {
                    G("dun_down_div").style.display = "none";
                    G("extra_div").style.display = "none";
                    PAGE.extraFirst(1);
                }
            }
        }, 1000);
    },
    extraFirst: function (count) {
        LMActivity.AjaxHandler.uploadPlayRecord(function () {
            PAGE.residue = parseInt(PAGE.residue) + parseInt(count);
            G("frequency").innerHTML = PAGE.residue;
            PAGE.closePurchase();
        }, function () {//订购失败
            LMEPG.UI.showToast('增加游戏次数出错', 3);
            PAGE.closePurchase();
            G("purchase_fail_div").style.display = "block";
            PAGE.initButtons("purchase_fail_sure");
        })
    },
    /**设置当前页参数*/
    getCurrentPage: function () {
        return LMEPG.Intent.createIntent('activity');
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
            'entryTypeName': '嗨翻双节，月兔迷宫乐不停',
            'unionCode': 'gylm863'
        };
        LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
            var objCurrent = PAGE.getCurrentPage(); //得到当前页
            var objPlayer = LMEPG.Intent.createIntent('player');
            objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));
            LMEPG.Intent.jump(objPlayer, objCurrent);
        }, function () {
            LMEPG.UI.showToast("视频参数错误");
        });
    },
    /**
     * 在游戏引导页，当点击对应的商品时，如果该产品已经订购，就直接进去产品对应的应用首页
     * 如果该产品没有订购，就跳去订购该产品
     */
    UnionEnter: function (btn) {
        try {
            var spInfo = PAGE.getSpInfoByProductId(btn.contentId);
            spInfo = spInfo instanceof Object ? spInfo : JSON.parse(spInfo);
            // 成功订购回来后点击未订购产品间隔小于1分钟
            var orderSuccessDt = LMEPG.Cookie.getCookie(PAGE.keyCookie);
            var currDt = new Date().getTime();
            if (orderSuccessDt != '' && (currDt - orderSuccessDt < 30000) && spInfo.status != 1) {
                return;
            }
            // 当status==1时，表示已经订购该产品
            if (spInfo.status == 1) {
                PAGE.jumpThirdPartySP(spInfo.contentId, 1); //跳转到其他第三方sp
            } else {
                if (PAGE.isDirectOrder == true) {
                    PAGE.unionBuyVip(spInfo.contentId);  //直接跳到局方订购页
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
        for (var i = 0, size = RenderParam.spMap.length; i < size; i++) {
            var itemObj = JSON.parse(RenderParam.spMap[i]);
            if (itemObj.contentId == contentId) {
                return itemObj;
            }
        }
        throw "没有contentId:" + productId + "的产品";
    },

    /**
     * 判断订购产品数量
     */
    hasOrderSp: function () {
        var total = 0;
        if (LMEPG.Func.isArray(RenderParam.spMap)) {
            for (var i = 0; i < 4; i++) {
                var spItem = JSON.parse(RenderParam.spMap[i]);
                if (spItem.status == 0) {
                    total++
                }
            }
        }
        return 4 - total;
    },
    // 跳转到其他第三方sp
    jumpThirdPartySP: function (contentId, isChangeReturnUrl) {
        isChangeReturnUrl = isChangeReturnUrl ? 1 : 0;
        var objCurrent = LMActivity.Router.getCurrentPage();
        var objThirdPartySP = LMEPG.Intent.createIntent("activity-common-thirdPartySP");
        objThirdPartySP.setParam("userId", RenderParam.userId);
        objThirdPartySP.setParam("contentId", contentId);
        objThirdPartySP.setParam("isChangeReturnUrl", isChangeReturnUrl);
        LMEPG.Intent.jump(objThirdPartySP, objCurrent);
    },
    /**
     * 根据html排列元素自定义属性“productId”，找到一一对应的相应联合产品。
     * @param productId 自定义属性“productId”，表示的是第几个产品
     */
    getProductItemObj: function (productId) {
        try {
            var spInfoItem = PAGE.getSpInfoByProductId(productId);
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
        objOrderHome.setParam("userId", RenderParam.userId);
        objOrderHome.setParam("directPay", "1");
        objOrderHome.setParam("orderReason", "101");
        objOrderHome.setParam("contentId", contentId); // sp订购的内容id
        objOrderHome.setParam("isJointActivity", "1"); // 表示联合活动
        objOrderHome.setParam("remark", RenderParam.activityName);
        var objActivityGuide = LMEPG.Intent.createIntent("activity-common-index");
        objActivityGuide.setParam("userId", RenderParam.userId);
        objActivityGuide.setParam("inner", RenderParam.inner);
        objActivityGuide.setParam("isOrderBack", 1); // 表示订购回来
        LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objActivityGuide);
    },
    /**
     *联合活动初始化
     */
    UnionInit: function () {
        if (RenderParam.areaCode == "216") {//山东
            this.tempData = PAGE.unionInfo[0]
        } else if (RenderParam.areaCode == "208") {
            this.tempData = PAGE.unionInfo[1]

        } else if (RenderParam.areaCode == "207") {//山西
            this.tempData = PAGE.unionInfo[2]
        }
        var stb= LMEPG.STBUtil.getSTBModel();
        if(stb=="IP506H_54U3"){//屏蔽掉亲子乐园
            this.tempData.area.splice(1,1);
            G("sp_one").src = RenderParam.imagePath + this.tempData.area[0].img.bg
            G("sp_two").src = RenderParam.imagePath + this.tempData.area[1].img.bg
            G("sp_three").src = RenderParam.imagePath + this.tempData.area[2].img.bg
        }else{
            G("sp_one").src = RenderParam.imagePath + this.tempData.area[0].img.bg
            G("sp_two").src = RenderParam.imagePath + this.tempData.area[1].img.bg
            G("sp_three").src = RenderParam.imagePath + this.tempData.area[2].img.bg
            G("sp_four").src = RenderParam.imagePath + this.tempData.area[3].img.bg
        }
        //记录订购成功回来时间，用于判断一分钟内可点击
        if (RenderParam.cOrderResult == '1') {
            LMEPG.Cookie.setCookie(PAGE.keyCookie, new Date().getTime());
        }
    },
    /**
     * 判断是否从订购页返回
     * */
    showOrderResult: function () {
        if (RenderParam.isOrderBack === '1') { // 从订购页面跳转回活动页面
            if (RenderParam.cOrderResult === '1') { // 订购成功
                $('order_status').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_order_success.png') + ')'
            } else { // 订购失败
                $('order_status').style.backgroundImage = 'url(' + LMActivity.makeImageUrl('bg_order_fail.png') + ')'
            }
            LMActivity.showModal({ //展示模板页面
                id: 'order_status',
                onDismissListener: function () {
                    if (LMActivity.orderTimer && LMActivity.orderTimer !== null) {
                        // 关闭倒计时
                        clearTimeout(LMActivity.orderTimer);
                    }
                }
            });
            LMActivity.orderTimer = setTimeout(function () {// 设置倒计时关闭模板页面
                LMActivity.hideModal(LMActivity.shownModal);
            }, 3000);
        }
    },
    /**
     * 活动特俗订购方式按照产品顺序50%，30%，10%，10%
     * 如果该产品没有订购，就跳去订购该产品
     */
    outBookUnion: function (id) {
        try {
            var spInfo = PAGE.getSpInfoByProductId(id);
            spInfo = spInfo instanceof Object ? spInfo : JSON.parse(spInfo);
            // 成功订购回来后点击未订购产品间隔小于1分钟
            var orderSuccessDt = LMEPG.Cookie.getCookie(PAGE.keyCookie);
            var currDt = new Date().getTime();
            if (orderSuccessDt != '' && (currDt - orderSuccessDt < 30000) && spInfo.status != 1) {
                return;
            }
            PAGE.unionBuyVip(spInfo.contentId);  //直接跳到局方订购页
        } catch (e) {
            LMEPG.UI.showToast("判断用户是否订购出现异常！\n" + e.toString());
            LMEPG.Log.error(e.toString());
        }
    },
    /**
     * 核心点击事件处理
     * @param btn 被点击的按钮
     */
    eventHandler: function (btn) {
        LMActivity.currentClickedId = btn.id;
        switch (btn.id) {
            case 'btn_back':
                LMActivity.exitActivity();
                break;
            case 'btn_activity_rule':
                LMActivity.triggerModalButton = btn.id;
                LMActivity.showModal({
                    id: 'activity_rule',
                    focusId: 'btn_close_rule'
                });
                break;
            case 'btn_winner_list':
                switch (btn.listType) {
                    case 'exchange':
                        LMActivity.renderExchangeRecordList(RenderParam.exchangeRecordList.data.all_list,
                            RenderParam.exchangeRecordList.data.list);
                        break;
                    case 'lottery':
                        var newlotterList = [];
                  /*      var newMyLotter = [];*/
                        for (var i = 0; i < RenderParam.lotteryRecordList.list.length; i++) {
                            if (RenderParam.lotteryRecordList.list[i].prize_name != '普通牌'&&RenderParam.lotteryRecordList.list[i].prize_name != '小丑牌') {
                                newlotterList.push(RenderParam.lotteryRecordList.list[i]);
                            }
                        }
                       /* for (var i = 0; i < RenderParam.myLotteryRecord.list.length; i++) {
                            if (RenderParam.myLotteryRecord.list[i].prize_idx != 1) {
                                newMyLotter.push(RenderParam.lotteryRecordList.list[i]);
                            }
                        }*/
                        LMActivity.renderLotteryRecordList(newlotterList,
                            RenderParam.myLotteryRecord.list);
                        break;
                }
                LMActivity.triggerModalButton = btn.id;
                LMActivity.showModal({
                    id: 'winner_list',
                    focusId: 'btn_list_submit'
                });
                break;
            case 'btn_list_submit':
                var listType = btn.listType ? btn.listType : 'exchange';
                switch (listType) {
                    case 'exchange':
                        LMActivity.setExchangePhone('reset_tel', true);
                        break;
                    case 'lottery':
                        LMActivity.setLotteryPhone('reset_tel', true);
                        break;
                }

                break;
            case 'btn_close_rule':
            case 'btn_game_over_sure':
            case 'btn_lottery_cancel':
            case 'btn_lottery_fail':
            case 'btn_list_cancel':
            case 'btn-go':
                // 关闭当前对话框
                LMActivity.hideModal(LMActivity.shownModal);
                break;
            case 'btn_exchange_prize':
                LMActivity.triggerModalButton = btn.id;
                var focusId = LMActivity.renderExchangePrize(RenderParam.exchangePrizeList.data, btn.exchangePrizeButtons,
                    btn.exchangeFocusId, btn.moveType);
                LMActivity.showModal({
                    id: 'exchange_prize',
                    focusId: focusId
                });
                break;
            case 'exchange_prize_1':
            case 'exchange_prize_2':
            case 'exchange_prize_3':
                LMActivity.exchangePrize(btn.order);
                break;
            case 'btn_order_submit':
                LMActivity.Router.jumpBuyVip();
                break;
            case 'btn_order_cancel':
                if (RenderParam.isVip === '0' && RenderParam.valueCountdown.showDialog === '1') {
                    LMActivity.showModal({
                        id: 'countdown',
                        onShowListener: function () {
                            LMActivity.startCountdown();
                        },
                        onDismissListener: function () {
                            if (LMActivity.countInterval !== null) {
                                clearInterval(LMActivity.countInterval);
                            }
                        }
                    })
                    LMActivity.playStatus = true;
                } else {
                    LMActivity.hideModal(LMActivity.shownModal);
                    LMEPG.BM.requestFocus('btn_start');
                }
                break;
            /*  case 'btn_lottery_submit':
                  LMActivity.setExchangePhone('exchange_tel', false);
                  break;*/
            case 'btn_exchange_cancel':
                LMActivity.Router.reload();
                break;
            case 'btn_lottery_sure':
                LMActivity.doLottery();
                break;
            case 'btn_lottery_submit':
                LMActivity.setLotteryPhone('lottery_tel', true);
                break;
        }
    }
};

// 活动特殊返回处理
var specialBackArea = ['000051'];
function outBack() {
    if (RenderParam.lmcid == '000051' && RenderParam.areaCode == '216') {
        PAGE.jumpThirdPartySP("jkmf", 0);
    } else if (RenderParam.inner == "1") {
        LMEPG.Intent.back();
    } else {
        LMEPG.Intent.back("IPTVPortal");
    }
}

PAGE.init();