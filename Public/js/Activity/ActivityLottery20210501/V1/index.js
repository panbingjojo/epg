/**
 * 愚翻天活动
 * */
var PAGE = {
    keyCookie: RenderParam.activityName + RenderParam.userId,    //cookie键值，用于判断用户是否1分钟内反复点击产品订购
    buttons: [],
    firstId: '',//记住是哪张卡片
    timeClock: null,
    thisFrequency: 3,
    tempData: {},
    isFirst:true,
    isclown: false,
    firLotter:0,
    residue: parseInt(RenderParam.leftTimes),
    myValue: parseInt(RenderParam.score),
    platformInfo:{
        '630092':{ //青海
            prizePage:'prize_list.png',
            rules:'ruls_detail.png'
        },
        '460092':{//海南
            prizePage:'hainan_exchangePage.png',
            rules:'hainan_rules.png'
        },
        '410092':{//河南
            prizePage:'henan_exchange_page.png',
            rules:'henan_rules.png'
        },
        '000051':{//联通
            prizePage:'liantong_exchange_page.png',
            rules:'liantong_rules.png'
        }
    },
    carridInfo: [],

    init: function () {
        LMActivity.setPageSize()
        if  ( RenderParam.lmcid == "450092"){
            // G("order_vip_bg").src='__ROOT__/Public/img/'+r.platformType+'/Activity/ActivityAprilFoolDay/V1/lookViod1.png';
            G("order_vip_bg").src='__ROOT__/Public/img/hd/Activity/ActivityAprilFoolDay/V1/lookViod1.png';
        }
        if (G('default_link')) G('default_link').focus();

        if(PAGE.residue == 0 && RenderParam.extraTimes != 0){
            PAGE.residue = RenderParam.extraTimes
        }

        G("frequency").innerHTML = PAGE.residue;

        G("frequency").innerHTML = PAGE.residue;
        G('renew-value').innerHTML=PAGE.myValue;

        this.AppInit();
        this.createButton();
        this.initPrizeList();
        this.loadImg();
        this.initButtons('btn_begin_game');
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

    loadImg:function(){
        var list =[RenderParam.imagePath+'times_over.png',RenderParam.imagePath+'renew_success.png',RenderParam.imagePath+'renew_fails.png']
        for(var i=0;i<3;i++){
            var img = new Image()
            img.src=list[i];
        }
    },
    /**
     * 创建图片数组
     * */
    createButton: function () {

        for (var i=0;i<3;i++){
            this.buttons.push({
                id: 'exchange-btn-'+i,
                name: '兑换按键',
                type: 'img',
                order:i,
                nextFocusRight: 'exchange-btn-'+(i+1),
                nextFocusLeft: 'exchange-btn-'+(i-1),
                nextFocusUp:'close_prize',
                backgroundImage: RenderParam.imagePath + 'exchange_no.png',
                focusImage: RenderParam.imagePath + 'exchange_has.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: this.eventHandler
            })
        }

        this.buttons.push(
            {
                id: 'btn_begin_game',
                name: '假期续费',
                type: 'img',
                nextFocusUp:'btn_winner_list',
                nextFocusRight: 'btn_winner_list',
                nextFocusLeft: 'btn_exchange-gift',
                backgroundImage: RenderParam.imagePath + 'renew_no.png',
                focusImage: RenderParam.imagePath + 'renew_has.png',
                click: this.eventHandler
            },
            {
                id: 'btn_activity_rule',
                name: '活动规则',
                type: 'img',
                nextFocusRight: 'btn_back',
                nextFocusDown: 'btn_exchange-gift',
                backgroundImage: RenderParam.imagePath + 'ruls_no.png',
                focusImage: RenderParam.imagePath + 'ruls_has.png',
                nowShow: 'activity_rule',
                click: this.eventHandler
            },
            {
                id: 'btn_close_rule',
                name: '活动规则关闭',
                type: 'img',
                focusImage: RenderParam.imagePath +this.platformInfo[RenderParam.lmcid].rules,
                moveChange: PAGE.btnMoveChangeFocus,
                click: this.eventHandler
            },
            {
                id: 'btn_exchange-gift',
                name: '兑换礼物',
                type: 'img',
                nextFocusRight: 'btn_winner_list',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'btn_begin_game',
                backgroundImage: RenderParam.imagePath + 'exchange_gifts_has.png',
                focusImage: RenderParam.imagePath + 'exchange_gifts_no.png',
                nowShow: 'activity_rule',
                click: this.eventHandler
            },
            {
                id: 'exchange_gifts_pop',
                name: '活动规则关闭',
                type: 'img',
                focusImage: RenderParam.imagePath +'ruls_detail.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: this.eventHandler
            },
            {
                id: 'btn_back',
                name: '返回',
                type: 'img',
                nextFocusLeft: 'btn_activity_rule',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: RenderParam.imagePath + 'back_no.png',
                focusImage: RenderParam.imagePath + 'back_has.png',
                click: this.eventHandler
            },
            {
                id: 'btn_winner_list',
                name: '获奖名单',
                type: 'img',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_begin_game',
                nextFocusLeft: 'btn_exchange-gift',
                backgroundImage: RenderParam.imagePath + 'name_list_no.png',
                focusImage: RenderParam.imagePath + 'name_list_has.png',
                nowShow: 'winner_list',
                listType: 'exchange',
                click: this.eventHandler
            },
            {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusRight: 'btn_list_cancel',
                nextFocusLeft:RenderParam.platformType=="hd"?'reset_tel':'',
                nextFocusUp:RenderParam.platformType=="sd"?'reset_tel':'',
                backgroundImage: RenderParam.imagePath + 'ok_no.png',
                focusImage: RenderParam.imagePath + 'ok_has.png',
                moveChange: PAGE.btnMoveChangeFocus,
                listType: 'exchange',
                click: LMActivity.eventHandler
            },
            {
                id: 'btn_list_cancel',
                name: '中间名单取消',
                type: 'img',
                nextFocusLeft: 'btn_list_submit',
                backgroundImage: RenderParam.imagePath + 'cancel_no.png',
                focusImage: RenderParam.imagePath + 'cancel_has.png',
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
                id: 'pop-ok',
                name: '弹窗确定',
                type: 'img',
                backgroundImage: RenderParam.imagePath + 'ok_no.png',
                focusImage: RenderParam.imagePath +'ok_has.png',
                moveChange: PAGE.btnMoveChangeFocus,
                click: this.eventHandler
            },
            {
                id: 'btn_exchange_submit',
                name: '按钮-兑换成功-确定',
                type: 'img',
                nextFocusUp: 'exchange_tel',
                nextFocusRight: 'btn_exchange_cancel',
                backgroundImage: RenderParam.imagePath + 'ok_no.png',
                focusImage: RenderParam.imagePath + 'ok_has.png',
                click: this.eventHandler
            }, {
                id: 'btn_exchange_cancel',
                name: '按钮-兑换成功-取消',
                type: 'img',
                nextFocusLeft: 'btn_exchange_submit',
                nextFocusUp: 'exchange_tel',
                backgroundImage:  RenderParam.imagePath + 'cancel_no.png',
                focusImage:  RenderParam.imagePath + 'cancel_has.png',
                click: this.eventHandler
            },
            {
                id: 'exchange_tel',
                name: '兑换成功-电话号码',
                type: 'div',
                nextFocusDown: 'btn_exchange_submit',
                backFocusId: 'btn_exchange_submit',
                focusChange: LMActivity.onInputFocus,
            },
            {
                id: 'on-gift-ok',
                name: '无奖品-确定',
                type: 'img',
                backgroundImage:  RenderParam.imagePath + 'ok_no.png',
                focusImage:  RenderParam.imagePath + 'ok_has.png',
                click: this.eventHandler
            },
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
                id: 'close_prize',
                name: '关闭兑奖窗口',
                type: 'img',
                nextFocusDown: 'exchange-btn-0',
                backgroundImage: RenderParam.imagePath + 'close_btn_exchange.png',
                focusImage: RenderParam.imagePath + 'close_btn_exchange_has.png',
                click: this.eventHandler
            },
            {
                id: 'btn_lottery_submit',
                name: '中奖确定-',
                type: 'img',
                nextFocusRight: 'btn_lottery_cancel',
                nextFocusUp: 'lottery_tel',
                backgroundImage: RenderParam.imagePath + 'ok_no.png',
                focusImage: RenderParam.imagePath + 'ok_has.png',
                click: LMActivity.eventHandler
            },
            {
                id: 'btn_lottery_cancel',
                name: '抽中奖取消',
                type: 'img',
                nextFocusLeft: 'btn_lottery_submit',
                backgroundImage: RenderParam.imagePath + 'cancel_no.png',
                focusImage: RenderParam.imagePath + 'cancel_has.png',
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
                id: 'btn_order_submit',
                name: '可以订购确定',
                type: 'img',
                nextFocusRight: 'btn_order_cancel',
                backgroundImage: RenderParam.imagePath + 'ok_no.png',
                focusImage: RenderParam.imagePath + 'ok_has.png',
                click: LMActivity.eventHandler
            },
            {
                id: 'btn_order_cancel',
                name: '可以订购取消',
                type: 'img',
                nextFocusLeft: 'btn_order_submit',
                backgroundImage: RenderParam.imagePath + 'cancel_no.png',
                focusImage: RenderParam.imagePath + 'cancel_has.png',
                click: LMActivity.eventHandler
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
            }
        )
    },

    /**
     * 关闭规则、获奖名单
     * */
    closeReglation: function () {
        //G("activity_rule").style.display = "none"
        G("winner_list").style.display = "none";
        PAGE.initButtons('car_two');
    },

    nowFocusChange:function(Btn,dir){
        if(PAGE.firLotter==1){
            if(Btn.id.indexOf("car")>-1){
                G(Btn.id).children[0].src = RenderParam.imagePath + "style_1.png";
                Btn.focusImage =  RenderParam.imagePath + "car_bg.png";
                PAGE.firLotter=0;
            }
        }
    },
    initPrizeList:function (){
        var els=document.getElementsByClassName('renew-value')
        for(var i=0;i<3;i++){
            els[i].innerHTML=RenderParam.exchangePrizeList.data[i].consume_list[0].consume_count
        }
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

        if (focusBtn.id.indexOf("sp") > -1 && blurBtn.id.indexOf("car") > -1) {
            G(blurBtn.id).style.backgroundImage = '';
            G(blurBtn.id).children[0].src = RenderParam.imagePath + "style_1.png"
        }
    },
    /**
     * 全部的点击事件
     * */
    isEnter: function (Btn) {

        if(Btn.id.indexOf("car")>-1||Btn.id.indexOf("btn")>-1){
            PAGE.firstId = Btn.id;
        }
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
     * 订购入口
     * */
    planceOrder: function (Btn) {
        switch (Btn.id) {
            case "btn_order_cancel"://可以订购取消
                PAGE.falseDeferred(PAGE.isFirst, Btn);
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
                PAGE.extraFirst();
                break;
        }
        if (Btn.id.indexOf("car") > -1 ||Btn.id.indexOf("car_two") > -1) {
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
            case "no_sure"://没有抽到小丑确认
                var count = 1;
                LMActivity.Router.reload();
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
            if(data.msg.indexOf("一等奖")>-1){
                G("wining_").src = RenderParam.imagePath + PAGE.tempData.carrid[0].img.prize.one;
            }else if(data.msg.indexOf("二等奖")>-1){
                G("wining_").src = RenderParam.imagePath + PAGE.tempData.carrid[0].img.prize.two;
            }else if(data.msg.indexOf("三等奖")>-1){
                G("wining_").src = RenderParam.imagePath + PAGE.tempData.carrid[0].img.prize.three;
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
                    G("frequency").innerHTML = PAGE.residue;

                LMActivity.AjaxHandler.lottery(function (data) {
                    PAGE.reduceTime();
                    PAGE.firLotter=1;
                    G(Btn.id).children[0].src = RenderParam.imagePath + "time_over_1.png";//换上小丑的背景
                    var timeClock = setInterval(function () {
                        clearInterval(timeClock);
                        G("opt_clwon_div").style.display = "block";
                        PAGE.initButtons("opt_clown")
                        PAGE.isclown = true;
                    }, 1000);
                }, function () {//没有抽中
                    PAGE.reduceTime();
                    PAGE.firLotter=1
                    G(Btn.id).children[0].src = RenderParam.imagePath + "time_over.png";//换上小丑的背景
                    var timeClock = setInterval(function () {
                        clearInterval(timeClock);
                        G("no_clwon_div").style.display = "block";
                        PAGE.initButtons("no_sure");
                        PAGE.isclown = false;
                    }, 1000);

                });
            }, function () {//订购失败
                LMEPG.UI.showToast('扣除戏次数出错', 3);
            }
        )
    },
    /**
     * 可以订购取消延时
     * isFirst 是否第一次
     * */
    falseDeferred: function (first, Btn) {
        var second = parseInt(G("second").innerHTML);
        PAGE.closePurchase();
        G("dun_down_div").style.display = "block";
        G("extra_div").style.display = "block";
            this.reduceSecond(second, Btn)
    },
    reduceSecond: function (sed, Btn) {
        timeClock = setInterval(function () {
            sed--;
            G("second").innerHTML = sed;
            if (sed == 0) {
                if (Btn.id.indexOf("btn_order_cancel") > -1) {
                    G("dun_down_div").style.display = "none";
                    G("extra_div").style.display = "none";
                    G("frequency").innerHTML = PAGE.residue;
                    LMActivity.AjaxHandler.addExtraTimes(function () {
                        PAGE.residue = parseInt(PAGE.residue) + parseInt(RenderParam.extraTimes);
                        LMActivity.Router.reload()
                    }, function () {
                        LMEPG.UI.showToast('增加额外游戏次数用完', 2);
                        LMActivity.Router.reload();
                    });
                    G("second").innerHTML=8
                    clearInterval(timeClock);
                }
            }
        }, 1000);

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
        // if (RenderParam.lmcid !=="450092" ){
        //
        // }
        if (RenderParam.isVip != 1) {//是vip可以购买
            PAGE.closePurchase();
            G("order_vip").style.display = "block";
            LMEPG.BM.requestFocus("btn_order_cancel")
            // PAGE.initButtons("btn_order_submit");//把弹出的确定框作为当前焦点
        } else {//不可以可以购买次数
            G("purchase_false_div").style.display = "block";
            PAGE.initButtons("purchase_false")
            return;
        }
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
            'videoUrl': RenderParam.platformType == 'hd' ? '99100000012019122711185006845837' : '99100000012019122711325606851126',
            'sourceId': '24382',
            'title': '手足口病的治疗和护理？',
            'type': 4,
            'userType': '2',
            'freeSeconds': '30',
            'entryType': 2,
            'entryTypeName': '愚翻天',
            'unionCode': 'gylm039'
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
     *应用活动初始化
     */
    AppInit: function () {
        G('btn_close_x').src=RenderParam.imagePath+this.platformInfo[RenderParam.lmcid].prizePage

        if(null!=this.tempData){
            document.body.style.backgroundImage="url("+RenderParam.imagePath+"bg.png)"
            //G("activity_rule").children[0].src=RenderParam.imagePath+this.tempData.carrid[0].img.rule;
        }

    },
    /**
     * 判断是否从订购页返回
     * */
    showOrderResult: function () {
        if (RenderParam.isOrderBack === '1') { // 从订购页面跳转回活动页面
            if (RenderParam.cOrderResult === '1') { // 订购成功
                LMActivity.showModal({ //展示模板页面
                    id: 'purchase_succeed_div',
                    onDismissListener: function () {
                        if (LMActivity.orderTimer && LMActivity.orderTimer !== null) {
                            // 关闭倒计时
                            clearTimeout(LMActivity.orderTimer);
                        }
                    }
                });
            } else { // 订购失败
                LMActivity.showModal({ //展示模板页面
                    id: 'purchase_fail_div',
                    onDismissListener: function () {
                        if (LMActivity.orderTimer && LMActivity.orderTimer !== null) {
                            // 关闭倒计时
                            clearTimeout(LMActivity.orderTimer);
                        }
                    }
                });
            }

            LMActivity.orderTimer = setTimeout(function () {// 设置倒计时关闭模板页面
                LMActivity.hideModal(LMActivity.shownModal);
            }, 2000);
        }
    },
    /**
     * 核心点击事件处理
     * @param btn 被点击的按钮
     */
    eventHandler: function (btn) {
        LMActivity.currentClickedId = btn.id;
        switch (btn.id) {
            case 'btn_begin_game':
                LMActivity.triggerModalButton = btn.id;

                LMActivity.AjaxHandler.uploadPlayRecord(function (d){
                    if(PAGE.residue != 0){
                        PAGE.residue = parseInt(PAGE.residue) - 1;
                        G("frequency").innerHTML = PAGE.residue;

                        if( RenderParam.extraTimes*1 >= 1){
                            RenderParam.extraTimes = RenderParam.extraTimes*1 - 1;
                        }

                    }else if(PAGE.residue == 0) {
                        
                        if(RenderParam.isVip == '1'){
                            G('type-img').src=RenderParam.imagePath+'times_over.png'
                            LMActivity.showModal({
                                id: 'game-success',
                                focusId: 'btn_close_rule'
                            });
                        }else {
                            LMActivity.showModal({
                                id: 'order_vip',
                                focusId: 'btn_order_submit'
                            });
                        }
                        return ;
                    }

                    LMActivity.AjaxHandler.lottery(function (){
                        G('type-img').src=RenderParam.imagePath+'renew_success.png'
                        LMActivity.AjaxHandler.addScore(1,function (){
                            PAGE.myValue+=1
                            G('renew-value').innerHTML=PAGE.myValue
                        })

                        LMActivity.showModal({
                            id: 'game-success',
                            focusId: 'btn_close_rule'
                        });

                    },function (data){

                        if(data == 0){
                            G('type-img').src=RenderParam.imagePath+'renew_fails.png'
                            LMActivity.showModal({
                                id: 'game-success',
                                focusId: 'btn_close_rule'
                            });
                        }else {
                            if(RenderParam.isVip == '1'){
                                G('type-img').src=RenderParam.imagePath+'times_over.png'
                                LMActivity.showModal({
                                    id: 'game-success',
                                    focusId: 'btn_close_rule'
                                });
                            }else {
                                LMActivity.showModal({
                                    id: 'order_vip',
                                    focusId: 'btn_order_submit'
                                });
                            }
                        }
                    })
                })
                break;
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
            case 'btn_exchange-gift':
                LMActivity.triggerModalButton = btn.id;
                G('my-exchange-value').innerHTML=PAGE.myValue;

                LMActivity.showModal({
                    id: 'exchange_gifts_pop',
                    focusId: 'exchange-btn-0'
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
                                newlotterList.push(RenderParam.exchangeRecordList.data.all_list[i]);
                            }
                        }
                        /* for (var i = 0; i < RenderParam.myLotteryRecord.list.length; i++) {
                             if (RenderParam.myLotteryRecord.list[i].prize_idx != 1) {
                                 newMyLotter.push(RenderParam.lotteryRecordList.list[i]);
                             }
                         }*/
                        LMActivity.renderExchangeRecordList(newlotterList,
                            RenderParam.exchangePrizeList.list);
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
            case 'btn_exchange_submit':
                LMActivity.setExchangePhone('exchange_tel', true);
                break
            case 'btn_close_rule':
            case 'btn_game_over_sure':
            case 'btn_lottery_cancel':
            case 'btn_lottery_fail':
            case 'btn_list_cancel':
            case 'btn-go':
            case 'pop-ok':
            case 'on-gift-ok':
            case 'close_prize':
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
            case 'exchange-btn-0':
            case 'exchange-btn-1':
            case 'exchange-btn-2':
                LMActivity.exchangePrize(btn.order);
                break;
            case 'btn_order_submit':
                if (RenderParam.lmcid === '450092' ) {
                    PAGE.jumpPlayVideo();
                } else {
                    if (RenderParam.isVip == 1) {
                        LMEPG.UI.showToast("你已经订购过，不用再订购！");
                    } else {
                        LMActivity.Router.jumpBuyVip();
                    }
                }
                break;

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
var specialBackArea = ['220095','460092'];
function outBack() {
    if (RenderParam.lmcid == '220095' || RenderParam.lmcid == '460092') {
        var objSrc = LMActivity.Router.getCurrentPage();
        var objHome = LMEPG.Intent.createIntent('home');
        LMEPG.Intent.jump(objHome, objSrc);
    }
}

PAGE.init();