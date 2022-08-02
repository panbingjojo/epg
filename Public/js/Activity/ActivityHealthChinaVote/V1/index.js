(function (w, e, r, a) {

    var Activity = {
        init: function () {
            //活动不再弹窗倒计时
            if (r.lmcid == '000051' || r.lmcid == '440094' || r.lmcid == '000006' ) {
                r.valueCountdown.showDialog = '0';
            }
            Activity.rankTimer;
            Activity.buttons = [];
            Activity.initLocalData();
            Activity.initMoreData();
            Activity.startRefresh();
            Activity.initButtons();

            w.onunload = function () {
                clearTimeout(Activity.rankTimer);
            };
        },

        initLocalData: function(){
            try {
                Activity.rawVoteData = [
                    {"playerId": 1,"videoId": "gylm375",  "videoAddr":"GDZX7420190509222523", "voteNum": 0, "total_hot": 0,  "videoTitle":"何为岐黄？"},
                    {"playerId": 2,"videoId": "gylm376",  "videoAddr":"GDZX8620190509222528", "voteNum": 0, "total_hot": 0,  "videoTitle":"橘井是什么？"},
                    {"playerId": 3,"videoId": "gylm377",  "videoAddr":"GDZX9020190509223022", "voteNum": 0, "total_hot": 0,  "videoTitle":"青囊与华佗"},
                    {"playerId": 4,"videoId": "gylm378",  "videoAddr":"GDZX0220190509223030", "voteNum": 0, "total_hot": 0,  "videoTitle":"“杏林”一词的由来"},
                    {"playerId": 5,"videoId": "gylm379",  "videoAddr":"GDZX0620190509223032", "voteNum": 0, "total_hot": 0,  "videoTitle":"悬壶是怎么来的？"},
                    {"playerId": 6,"videoId": "gylm380",  "videoAddr":"GDZX9820190509223027", "voteNum": 0, "total_hot": 0,  "videoTitle":"坐堂的由来你知道吗"},
                    {"playerId": 7,"videoId": "gylm381",  "videoAddr":"GDZX9420190509223024", "voteNum": 0, "total_hot": 0,  "videoTitle":"扁鹊三兄弟"},
                    {"playerId": 8,"videoId": "gylm382",  "videoAddr":"GDZX1820190509223526", "voteNum": 0, "total_hot": 0,  "videoTitle":"医祖扁鹊"},
                    {"playerId": 9,"videoId": "gylm383",  "videoAddr":"GDZX1020190509223522", "voteNum": 0, "total_hot": 0,  "videoTitle":"扁鹊见蔡桓公"},
                    {"playerId": 10,"videoId": "gylm384",  "videoAddr":"GDZX2220190509223528", "voteNum": 0, "total_hot": 0,  "videoTitle":" 扁鹊诊脉 "},
                    // {"playerId": 11,"videoId": "gylm375",  "videoAddr":"GDZX7420190509222523", "voteNum": 0, "total_hot": 0,  "videoTitle":"2何为岐黄？"},
                    // {"playerId": 12,"videoId": "gylm376",  "videoAddr":"GDZX8620190509222528", "voteNum": 0, "total_hot": 0,  "videoTitle":"2橘井是什么？"},
                    // {"playerId": 13,"videoId": "gylm377",  "videoAddr":"GDZX9020190509223022", "voteNum": 0, "total_hot": 0,  "videoTitle":"2青囊与华佗"},
                    // {"playerId": 14,"videoId": "gylm378",  "videoAddr":"GDZX0220190509223030", "voteNum": 0, "total_hot": 0,  "videoTitle":"2“杏林”一词的由来"},
                    // {"playerId": 15,"videoId": "gylm379",  "videoAddr":"GDZX0620190509223032", "voteNum": 0, "total_hot": 0,  "videoTitle":"2悬壶是怎么来的？"},
                    // {"playerId": 16,"videoId": "gylm380",  "videoAddr":"GDZX9820190509223027", "voteNum": 0, "total_hot": 0,  "videoTitle":"2坐堂的由来你知道吗"},
                    // {"playerId": 17,"videoId": "gylm381",  "videoAddr":"GDZX9420190509223024", "voteNum": 0, "total_hot": 0,  "videoTitle":"2扁鹊三兄弟"},
                    // {"playerId": 18,"videoId": "gylm382",  "videoAddr":"GDZX1820190509223526", "voteNum": 0, "total_hot": 0,  "videoTitle":"2医祖扁鹊"},
                    // {"playerId": 19,"videoId": "gylm383",  "videoAddr":"GDZX1020190509223522", "voteNum": 0, "total_hot": 0,  "videoTitle":"2扁鹊见蔡桓公"},
                    // {"playerId": 20,"videoId": "gylm384",  "videoAddr":"GDZX2220190509223528", "voteNum": 0, "total_hot": 0,  "videoTitle":"2 扁鹊诊脉 "},
                ];

                this.currentPage = 1;
                this.voteData = JSON.parse(JSON.stringify(Activity.rawVoteData));
                this.rankData = JSON.parse(JSON.stringify(Activity.rawVoteData));
                // this.moreData = JSON.parse(JSON.stringify(Activity.rawVoteData));
                this.pageType = ""; //1——vote； 2——rank 3——more 页面刷新类型，如果等于空，则不刷新
                this.NUM_PER_PAGE = this.pageType != "rank"? 8:10;
                this.maxPage = Math.ceil(Activity.rawVoteData.length / this.NUM_PER_PAGE);
                // this.getCurrentPageData();
            }catch (e) {
                LMEPG.UI.logPanel.show("initLocalData"+e);
            }

        },

        initMoreData: function(){
            try {
                Activity.moreData = [
                    {"playerId": 1,"videoId": "gylm375",  "videoAddr":"GDZX7420190509222523", "voteNum": 0, "total_hot": 0,  "videoTitle":"何为岐黄？"},
                    {"playerId": 2,"videoId": "gylm376",  "videoAddr":"GDZX8620190509222528", "voteNum": 0, "total_hot": 0,  "videoTitle":"橘井是什么？"},
                    {"playerId": 3,"videoId": "gylm377",  "videoAddr":"GDZX9020190509223022", "voteNum": 0, "total_hot": 0,  "videoTitle":"青囊与华佗"},
                    {"playerId": 4,"videoId": "gylm378",  "videoAddr":"GDZX0220190509223030", "voteNum": 0, "total_hot": 0,  "videoTitle":"“杏林”一词的由来"},
                    {"playerId": 5,"videoId": "gylm379",  "videoAddr":"GDZX0620190509223032", "voteNum": 0, "total_hot": 0,  "videoTitle":"悬壶是怎么来的？"},
                    {"playerId": 6,"videoId": "gylm380",  "videoAddr":"GDZX9820190509223027", "voteNum": 0, "total_hot": 0,  "videoTitle":"坐堂的由来你知道吗"},
                    {"playerId": 7,"videoId": "gylm381",  "videoAddr":"GDZX9420190509223024", "voteNum": 0, "total_hot": 0,  "videoTitle":"扁鹊三兄弟"},
                    {"playerId": 8,"videoId": "gylm382",  "videoAddr":"GDZX1820190509223526", "voteNum": 0, "total_hot": 0,  "videoTitle":"医祖扁鹊"},
                    {"playerId": 9,"videoId": "gylm383",  "videoAddr":"GDZX1020190509223522", "voteNum": 0, "total_hot": 0,  "videoTitle":"扁鹊见蔡桓公"},
                    {"playerId": 10,"videoId": "gylm384",  "videoAddr":"GDZX2220190509223528", "voteNum": 0, "total_hot": 0,  "videoTitle":" 扁鹊诊脉 "},
                ];

                this.currentPage = 1;
                this.pageType = ""; //1——vote； 2——rank 3——more 页面刷新类型，如果等于空，则不刷新
                this.NUM_PER_PAGE = this.pageType != "rank"? 8:10;
                this.maxPage = Math.ceil(Activity.moreData.length / this.NUM_PER_PAGE);
            }catch (e) {
                LMEPG.UI.logPanel.show("initMoreData"+e);
            }

        },

        startRefresh: function () {
            //启动之前刷新一次，否则3秒之内无数据
            Activity.refreshData();
            // 启动定时器定时刷新
            this.rankTimer = setInterval(function () {
                Activity.refreshData();
            }, 3*1000);
        },

        initButtons: function () {
            try {
                Activity.buttons = [];
                Activity.buttons.push(
                    {
                        id: "btn_close_vote",
                        name: "关闭-投票专区",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "",
                        nextFocusUp: "",
                        nextFocusDown: "vote-box-0",
                        backgroundImage: RenderParam.imagePath + 'btn_close.png',
                        focusImage: RenderParam.imagePath + 'btn_close_f.png',
                        click: Activity.dismissDialog,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_prev_page_vote",
                        name: "按钮-上一页-vote",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "btn_next_page_vote",
                        nextFocusUp: "vote-box-0",
                        nextFocusDown: "",
                        backgroundImage: RenderParam.imagePath + 'btn_prev_page.png',
                        focusImage: RenderParam.imagePath + 'btn_prev_page_f.png',
                        click: Activity.prevPageVote,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_next_page_vote",
                        name: "按钮-下一页-vote",
                        type: 'img',
                        nextFocusLeft: "btn_prev_page_vote",
                        nextFocusRight: "",
                        nextFocusUp: "vote-box-0",
                        nextFocusDown: "btn_activity_rule",
                        backgroundImage: RenderParam.imagePath + 'btn_next_page.png',
                        focusImage: RenderParam.imagePath + 'btn_next_page_f.png',
                        click: Activity.nextPageVote,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_close_more",
                        name: "关闭-投票专区",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "",
                        nextFocusUp: "",
                        nextFocusDown: "more-box-0",
                        backgroundImage: RenderParam.imagePath + 'btn_close.png',
                        focusImage: RenderParam.imagePath + 'btn_close_f.png',
                        click: Activity.dismissDialog,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_prev_page_more",
                        name: "按钮-上一页-more",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "btn_next_page_more",
                        nextFocusUp: "more-box-0",
                        nextFocusDown: "",
                        backgroundImage: RenderParam.imagePath + 'btn_prev_page.png',
                        focusImage: RenderParam.imagePath + 'btn_prev_page_f.png',
                        click: Activity.prevPageVote,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_next_page_more",
                        name: "按钮-下一页-more",
                        type: 'img',
                        nextFocusLeft: "btn_prev_page_more",
                        nextFocusRight: "",
                        nextFocusUp: "more-box-0",
                        nextFocusDown: "btn_activity_rule",
                        backgroundImage: RenderParam.imagePath + 'btn_next_page.png',
                        focusImage: RenderParam.imagePath + 'btn_next_page_f.png',
                        click: Activity.nextPageVote,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_close_rank",
                        name: "按钮-关闭排行榜",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "",
                        nextFocusUp: "",
                        nextFocusDown: "",
                        backgroundImage: RenderParam.imagePath + 'btn_close.png',
                        focusImage: RenderParam.imagePath + 'btn_close_f.png',
                        click: Activity.dismissDialog,
                        focusChange: '',
                        beforeMoveChange: Activity.moveRankDownFocus,
                        Obj: this
                    }, {
                        id: "btn_prev_page_rank",
                        name: "按钮-上一页-rank",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "",
                        nextFocusUp: "btn_close_rank",
                        nextFocusDown: "",
                        backgroundImage: RenderParam.imagePath + 'left.png',
                        focusImage: RenderParam.imagePath + 'left.png',
                        click: "",
                        focusChange: '',
                        beforeMoveChange: Activity.prevPageRank,
                        Obj: this
                    }, {
                        id: "btn_next_page_rank",
                        name: "按钮-下一页-rank",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "",
                        nextFocusUp: "btn_close_rank",
                        nextFocusDown: "",
                        backgroundImage: RenderParam.imagePath + 'right.png',
                        focusImage: RenderParam.imagePath + 'right.png',
                        click: "",
                        focusChange: '',
                        beforeMoveChange: Activity.nextPageRank,
                        Obj: this
                    }, {
                        id: "btn_back",
                        name: "按钮-返回",
                        type: 'img',
                        nextFocusLeft: "btn_start",
                        nextFocusRight: "",
                        nextFocusUp: "",
                        nextFocusDown: "btn_activity_rule",
                        backgroundImage: RenderParam.imagePath + 'btn_back.png',
                        focusImage: RenderParam.imagePath + 'btn_back_f.png',
                        click: a.eventHandler,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_activity_rule",
                        name: "按钮-活动规则",
                        type: 'img',
                        nextFocusLeft: "btn_start",
                        nextFocusRight: "",
                        nextFocusUp: "btn_back",
                        nextFocusDown: "btn_rank",
                        backgroundImage: RenderParam.imagePath + 'btn_activity_rule.png',
                        focusImage: RenderParam.imagePath + 'btn_activity_rule_f.png',
                        click: this.showRuleDialog,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_rank",
                        name: "按钮-排行榜",
                        type: 'img',
                        nextFocusLeft: "btn_start",
                        nextFocusRight: "",
                        nextFocusUp: "btn_activity_rule",
                        nextFocusDown: "btn_more",
                        backgroundImage: RenderParam.imagePath + 'btn_rank.png',
                        focusImage: RenderParam.imagePath + 'btn_rank_f.png',
                        click: Activity.showRankDialog,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_more",
                        name: "按钮-更多精彩",
                        type: 'img',
                        nextFocusLeft: "btn_start",
                        nextFocusRight: "",
                        nextFocusUp: "btn_rank",
                        nextFocusDown: "btn_start",
                        backgroundImage: RenderParam.imagePath + 'btn_more.png',
                        focusImage: RenderParam.imagePath + 'btn_more_f.png',
                        click: Activity.showMoreDialog,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_start",
                        name: "按钮-投票专区",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "btn_more",
                        nextFocusUp: "btn_more",
                        nextFocusDown: "",
                        backgroundImage: RenderParam.imagePath + 'btn_start.png',
                        focusImage: RenderParam.imagePath + 'btn_start_f.png',
                        click: Activity.showVoteDialog,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: "btn_close_rule",
                        name: "关闭活动规则",
                        type: 'img',
                        nextFocusLeft: "",
                        nextFocusRight: "",
                        nextFocusUp: "",
                        nextFocusDown: "",
                        backgroundImage: RenderParam.imagePath + 'btn_close.png',
                        focusImage: RenderParam.imagePath + 'btn_close_f.png',
                        click: Activity.dismissDialog,
                        focusChange: '',
                        beforeMoveChange: '',
                        Obj: this
                    }, {
                        id: 'btn_game_over_sure',
                        name: '按钮-结束游戏',
                        type: 'img',
                        backgroundImage: a.makeImageUrl('btn_sure.png'),
                        focusImage: a.makeImageUrl('btn_sure.png'),
                        click: Activity.closeGameOver
                    }
                );
                if (Activity.pageType == 'vote'){
                    Activity.initVoteButtons();
                } else if (Activity.pageType == 'more'){
                    Activity.initMoreButtons();
                }
                LMEPG.ButtonManager.init("btn_start", this.buttons, '', true);
                // LMEPG.ButtonManager.init(["btn_start"], Activity.buttons, '', true);
            }catch (e) {
                LMEPG.UI.logPanel.show("initButtons "+e);
            }
        },

        initVoteButtons:function(){
            var VIDEO_COUNT = Activity.currentPageData.length;
            for (i = 0; i < VIDEO_COUNT; i++) {
                Activity.buttons.push({
                    id: 'vote-box-' + i,
                    name: '投票图片' + i,
                    type: 'img',
                    nextFocusLeft: i > 0 ? 'vote-box-' + (i - 1) : '',
                    nextFocusRight: i < VIDEO_COUNT - 1 ? 'vote-box-' + (i + 1) : '',
                    nextFocusUp: i < 4 ? 'btn_close_vote' : 'btn-vote-' + (i - 4),
                    nextFocusDown: 'btn-vote-' + i,
                    backgroundImage: RenderParam.imagePath + 'vote_box.png',
                    focusImage: RenderParam.imagePath + 'vote_box_f.png',
                    click: Activity.jumpPlayVideo,
                    focusChange: '',
                    beforeMoveChange: '',
                    orderId: i,
                }, {
                    id: 'btn-vote-' + i,
                    name: '投票按钮' + i,
                    type: 'img',
                    nextFocusLeft: i > 0 ? 'btn-vote-' + (i - 1) : '',
                    nextFocusRight: i < VIDEO_COUNT ? 'btn-vote-' + (i + 1) : '',
                    nextFocusUp: 'vote-box-' + i,
                    nextFocusDown: i > 3 || VIDEO_COUNT < 5 ? 'btn_prev_page_vote' : 'vote-box-' + (i + 4),
                    backgroundImage: RenderParam.imagePath + 'btn_vote.png',
                    focusImage: RenderParam.imagePath + 'btn_vote_f.png',
                    click: Activity.startVote,
                    focusChange: '',
                    beforeMoveChange: '',
                    orderId: i,
                });
            }
        },

        initMoreButtons:function(){
            var VIDEO_COUNT = Activity.currentPageData.length;
            for (i = 0; i < VIDEO_COUNT; i++) {
                Activity.buttons.push({
                    id: 'more-box-' + i,
                    name: '投票图片' + i,
                    type: 'img',
                    nextFocusLeft: i > 0 ? 'more-box-' + (i - 1) : '',
                    nextFocusRight: i < VIDEO_COUNT - 1 ? 'more-box-' + (i + 1) : '',
                    nextFocusUp: i < 4 ? 'btn_close_more' : 'more-box-' + (i - 4),
                    nextFocusDown: i > 3 || VIDEO_COUNT < 5 ? 'btn_prev_page_more' : 'more-box-' + (i + 4),
                    backgroundImage: RenderParam.imagePath + 'transparent.png',
                    focusImage: RenderParam.imagePath + 'more_box_f.png',
                    click: Activity.jumpPlayVideo,
                    focusChange: '',
                    beforeMoveChange: '',
                    orderId: i,
                });
            }
        },

        /**
         * 获取当前页面对象
         */
        getCurrentPage: function () {
            try {
                return LMEPG.Intent.createIntent("activity-common-index");
            }catch (e) {
                LMEPG.UI.logPanel.show("getCurrentPage "+e);
            }
        },

        jumpPlayVideo: function (btn) {
            try {
                data = Activity.currentPageData[btn.orderId];
                // 创建视频信息
                var videoInfo = {
                    'videoUrl': data.videoAddr,
                    'sourceId': '',
                    'title':  data.videoTitle,
                    'type': 4,
                    'userType': RenderParam.isVip != 1 ? 2 : 1,
                    'freeSeconds': 0,
                    'entryType': 1,
                    'entryTypeName': 'activity',
                    'unionCode': data.videoId,
                    'showStatus': 1
                };

                // LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
                var objCurrent = Activity.getCurrentPage(); //得到当前页
                var objPlayer = LMEPG.Intent.createIntent('player');
                objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

                LMEPG.Intent.jump(objPlayer, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objCurrent);
                // }, function () {
                //     LMEPG.UI.showToast("视频参数错误");
                // });
            }catch (e) {
                LMEPG.UI.logPanel.show("jumpPlayVideo "+e);
            }
        },

       showRuleDialog: function () {
           LMActivity.triggerModalButton = 'btn_start';
           LMActivity.showModal({
               id: 'activity_rule',
               focusId: 'btn_close_rule'
           });
        },

        showRankDialog: function () {
            try {
                Activity.pageType = "rank";
                Activity.NUM_PER_PAGE = 10;
                Activity.maxPage = Math.ceil(Activity.rankData.length / Activity.NUM_PER_PAGE);
                Activity.currentPage = 1;
                // LMEPG.UI.logPanel.show("refreshRankByVoteNum 222");
                Activity.refreshRankByVoteNum();
                Activity.handleData();
                Hide('btn_prev_page_rank');
                Hide('btn_next_page_rank');
                LMActivity.triggerModalButton = 'btn_start';
                if (Activity.maxPage > 1){
                    Show('btn_next_page_rank');
                }
                a.showModal({
                    id: 'rank-container',
                    focusId: Activity.maxPage > 1 ? 'btn_next_page_rank':'btn_close_rank',
                });
            }catch (e) {
                LMEPG.UI.logPanel.show("showRankDialog "+e);
            }
        },

       showVoteDialog: function () {
            try {
                Activity.pageType = "vote";
                Activity.NUM_PER_PAGE = 8;
                Activity.maxPage = Math.ceil(Activity.voteData.length / Activity.NUM_PER_PAGE);
                Activity.currentPage = 1;
                Activity.refreshVoteByHot();
                Activity.handleData();
                Activity.initRender();
                Activity.initVoteButtons();
                LMActivity.triggerModalButton = 'btn_start';
                a.showModal({
                    id: 'vote-container',
                    focusId: 'vote-box-' + getRandom(0, Activity.currentPageData.length - 1),
                });
            }catch (e) {
                LMEPG.UI.logPanel.show("showVoteDialog "+e);
            }

        },

       showMoreDialog: function () {
            try {
                Activity.pageType = "more";
                Activity.NUM_PER_PAGE = 8;
                Activity.maxPage = Math.ceil(Activity.moreData.length / Activity.NUM_PER_PAGE);
                Activity.currentPage = 1;
                // Activity.refreshVoteByHot();
                Activity.handleData();
                // Activity.initRender();
                Activity.initMoreButtons();
                LMActivity.triggerModalButton = 'btn_start';
                a.showModal({
                    id: 'more-container',
                    focusId: 'more-box-0',
                });
            }catch (e) {
                LMEPG.UI.logPanel.show("showMoreDialog "+e);
            }
        },

        // closeVoteDialog:function(){
        //     this.pageType = "";
        //     // Hide('vote-container');
        //     a.hideModal(a.shownModal);
        //     LMEPG.BM.requestFocus('btn_start');
        // },

        closeGameOver:function(){
            // Hide('game_over');
            LMActivity.triggerModalButton = 'btn_start';
            a.hideModal(a.shownModal);
            // LMEPG.BM.requestFocus('vote-box-' + getRandom(0, Activity.currentPageData.length - 1));
            LMEPG.BM.requestFocus('btn_start');
        },

        dismissDialog: function (btn) {
            a.hideModal(a.shownModal);
            if (btn.id == 'btn_close_vote' || btn.id =='btn_close_rank') {
                Activity.pageType = '';
            }
            LMEPG.BM.requestFocus('btn_start');
        },

        startVote: function (btn){
            try {
                if (a.hasLeftTime()) {
                    a.AjaxHandler.uploadPlayRecord(function () {
                        Activity.doVote(btn);
                        G("left_times").innerHTML = --RenderParam.leftTimes;
                    }, function () {
                        LMEPG.UI.showToast('扣除游戏次数出错', 3);
                    });
                }else{

                    a.showModal({
                        id: 'game_over',
                        focusId: "btn_game_over_sure"
                    });
                };
            }catch (e) {
                LMEPG.UI.logPanel.show("startVote "+e);
            }

        },

        doVote: function (btn) {
            var playerId = Activity.currentPageData[btn.orderId].playerId;
            var reqData = {
                "playerId": playerId
            };
            //  投票操作
            LMEPG.ajax.postAPI('Activity/setPlayerRote', reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                            var result = data.result;

                            if (result == 0) {
                                Activity.showAddVote(btn.orderId);//投票成功！
                            } else {
                                LMEPG.UI.showToast("投票失败！");
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("投票异常，解析异常！");
                        LMEPG.Log.error(e.toString());
                        LMEPG.UI.logPanel.show("投票异常，解析异常！ "+e);
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("服务器异常");
                }
            );
        },

        showAddVote: function (orderId, callback) {
            var id = "add-one-" +  orderId;
            G('vote-num-'+ orderId).innerHTML = parseInt(G('vote-num-'+ orderId).innerHTML) + 1;
            Show(id);
            // 如果已经执行了setTimeOut,强制停止
            if (LMEPG.UI.showToastUITimer)
                clearTimeout(LMEPG.UI.showToastUITimer);
            LMEPG.UI.showToastUITimer = setTimeout(function () {
                Hide(id);
                LMEPG.call(callback);
            },   1000);
        },

        renderTableHtml: function () {
            try {
                G(Activity.pageType+"-wrap").innerHTML = "";
                if (Activity.pageType == "vote"){
                    G(Activity.pageType+"-wrap").innerHTML = Activity.createVoteTable();
                } else if (Activity.pageType == "rank"){
                    G(Activity.pageType+"-wrap").innerHTML = Activity.createRankTable();
                } else if(Activity.pageType == "more"){
                    G(Activity.pageType+"-wrap").innerHTML = Activity.createMoreTable();
                }
                G(Activity.pageType+"-page-index").innerHTML = Activity.currentPage+"/"+Activity.maxPage;
                Activity.pageType == "vote" ? Activity.updateVoteNum():1;
                Activity.pageType != "more" ? Activity.initRender():1;
            }catch (e) {
                LMEPG.UI.logPanel.show("renderTableHtml "+e);
            }
        },

        createVoteTable: function () {
            try {
                var tableHtml = "<table>";
                var voteBoxImg = RenderParam.imagePath + "vote_box.png";
                var btnVoteImg = RenderParam.imagePath + "btn_vote.png";
                var addVoteImg = RenderParam.imagePath + "vote_num_add.png";
                var rowNum = 0;
                for (var index = 0; index < Activity.currentPageData.length; index++) {
                    // 添加行,4个一行
                    if (index % 4 == 0) {
                        tableHtml += "<tr>";
                        rowNum++;
                        var tdVote = 'td-vote-' + rowNum;
                        var voteImg = 'vote-img-' + rowNum;
                        var voteBox = 'vote-box-' + rowNum;
                        var btnVote = 'btn-vote-' + rowNum;
                        var addVote = 'add-vote-' + rowNum;
                        var voteNum = 'vote-num-' + rowNum;
                    }

                    // 添加投票图片、投票按钮、投票数
                    var videoId = RenderParam.imagePath + "\\vote_img\\" + Activity.currentPageData[index].videoId + ".png";
                    tableHtml +=
                        // "<td class=\"td-vote\" width=\"25%\">"+
                        "<td class=\""+ tdVote+ "\">"+
                        "<img id=\"vote-img-"  + index + "\" class=\""+ voteImg + "\" src= \"" + videoId + "\">"+
                        "<img id=\"vote-box-"  + index + "\" class=\""+ voteBox + "\" src= \"" + voteBoxImg + "\">"+
                        "<img id=\"btn-vote-"  + index + "\" class=\""+ btnVote + "\" src= \"" + btnVoteImg + "\">"+
                        "<img id=\"add-one-"  + index + "\" class=\""+ addVote + "\" src= \"" + addVoteImg + "\">"+
                        // "<p id=\"vote-num-"  + index + "\" class=\""+ voteNum + "\">"+ Activity.currentPageData[index].voteNum + "</p>"+
                        "<p id=\"vote-num-"  + index + "\" class=\""+ voteNum + "\"></p>"+
                        "</td>";

                    if ((index + 1) % 4 == 0) {
                        tableHtml += "</tr>";
                    }
                }

                tableHtml += "</table>";

                return tableHtml;
            }catch (e) {
                LMEPG.UI.logPanel.show("createVoteTable "+e);
            }
        },

        createMoreTable: function () {
            try {
                var tableHtml = "<table>";
                var moreBoxImg = RenderParam.imagePath + "transparent.png";
                var rowNum = 0;
                for (var index = 0; index < Activity.currentPageData.length; index++) {
                    // 添加行,4个一行
                    if (index % 4 == 0) {
                        tableHtml += "<tr>";
                        rowNum++;
                        var tdmore = 'td-more-' + rowNum;
                        var moreImg = 'more-img-' + rowNum;
                        var moreBox = 'more-box-' + rowNum;
                    }

                    // 添加更多精彩图片
                    // var videoId = RenderParam.imagePath + "\\more_img\\" + Activity.currentPageData[index].videoId + ".png";//换新的视频图片后换成此目录
                    var videoId = RenderParam.imagePath + "\\vote_img\\" + Activity.currentPageData[index].videoId + ".png";
                    tableHtml +=
                        // "<td class=\"td-more\" width=\"25%\">"+
                        "<td class=\""+ tdmore+ "\">"+
                        "<img id=\"more-img-"  + index + "\" class=\""+ moreImg + "\" src= \"" + videoId + "\">"+
                        "<img id=\"more-box-"  + index + "\" class=\""+ moreBox + "\" src= \"" + moreBoxImg + "\">"+
                        "</td>";

                    if ((index + 1) % 4 == 0) {
                        tableHtml += "</tr>";
                    }
                }

                tableHtml += "</table>";

                return tableHtml;
            }catch (e) {
                LMEPG.UI.logPanel.show("createMoreTable "+e);
            }
        },

        createRankTable: function () {
            try {
                var tableHtml = "<table>";
                for (var index = 0; index < Activity.currentPageData.length; index++) {
                    tableHtml +=
                        "<tr class='rank-tr'>"+
                        "<td class='rank-td-1'>"+
                        "<p id=\"rank-num-"  + index + "\" class=\"rank-num\">"+ ((Activity.currentPage - 1) * Activity.NUM_PER_PAGE + index + 1) +"</p>"+
                        "</td>"+
                        "<td class='rank-td-2'>"+
                        "<p id=\"rank-name-"  + index + "\" class=\"rank-name\">"+ Activity.currentPageData[index].videoTitle +"</p>"+
                        "</td>"+
                        "</tr>";
                }
                tableHtml += "</table>";
                return tableHtml;
            }catch (e) {
                LMEPG.UI.logPanel.show("createRankTable "+e);
            }
        },

        handleData:function(){
            Activity.getCurrentPageData();
            Activity.renderTableHtml();
            Activity.initButtons();
        },

        prevPageVote:function(btn){
            if (Activity.currentPage > 1 ){
                Activity.currentPage--;
                Activity.handleData();
                // LMEPG.BM.requestFocus('vote-box-0');
                LMEPG.BM.requestFocus(btn.id);
            }
        },

        nextPageVote:function(btn){
            if (Activity.currentPage < Activity.maxPage){
                Activity.currentPage++;
                Activity.handleData();
                // LMEPG.BM.requestFocus('vote-box-0');
                LMEPG.BM.requestFocus(btn.id);
            }
        },

        prevPageRank:function(direction, btn){
            if (Activity.currentPage > 1 && direction == "left") {
                Activity.currentPage--;
                Activity.handleData();
                if (Activity.currentPage <= 1) {
                    Hide("btn_prev_page_rank");
                    Show("btn_next_page_rank");
                    LMEPG.BM.requestFocus('btn_next_page_rank');
                }
            }
        },

        nextPageRank:function(direction, btn){
            if (Activity.currentPage < Activity.maxPage && direction == "right"){
                Activity.currentPage++;
                Activity.handleData();
                if (Activity.currentPage >= Activity.maxPage){
                    Hide("btn_next_page_rank");
                    Show("btn_prev_page_rank");
                    LMEPG.BM.requestFocus('btn_prev_page_rank');
                }
            }
        },

        moveRankDownFocus:function(direction){
            if(direction == "down" && Activity.maxPage > 1){
                LMEPG.BM.requestFocus(G("btn_next_page_rank").style.visibility == "visible" ? "btn_next_page_rank": "btn_prev_page_rank");
            }
        },

        refreshData: function () {
            var reqData = {};
            LMEPG.ajax.postAPI('Activity/getPlayerRote', reqData,
                function (rsp) {
                    try {

                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            //G("debug").innerHTML += "rankTimer start --------</br>";
                            if ( data.list.length > 0) {
                                data.list.forEach(function (st,si) {
                                    if (typeof  Activity.rawVoteData[st.player_id - 1] !== "undefined") {
                                        Activity.rawVoteData[st.player_id - 1].voteNum = st.total_point;
                                        Activity.rawVoteData[st.player_id - 1].total_hot = st.total_hot;
                                    }
                                });
                                //排行榜刷新整个页面
                                if (Activity.pageType == "rank"){
                                    // LMEPG.UI.logPanel.show("refreshRankByVoteNum 111");
                                    Activity.refreshRankByVoteNum();
                                    Activity.getCurrentPageData();
                                    Activity.renderTableHtml();
                                //投票专区只刷新票数，不重排作品顺序
                                }else if (Activity.pageType == "vote") {
                                    Activity.updateVoteNum();
                                }
                            }
                        } else {
                            LMEPG.UI.showToast("刷新失败！");
                        }
                    } catch (e) {
                        LMEPG.UI.logPanel.show("刷新异常，解析异常！"+e);
                        LMEPG.UI.showToast("刷新异常，解析异常！");
                        LMEPG.Log.error(e.toString());
                    }
                },
                function (rsp) {
                    LMEPG.UI.logPanel.show("服务器异常 "+rsp);
                    LMEPG.UI.showToast("服务器异常");
                }
            );
        },

        getCurrentPageData: function(){
            try {
                this.currentPageData = Activity[Activity.pageType + "Data"].slice((this.currentPage - 1) * Activity.NUM_PER_PAGE, this.currentPage * Activity.NUM_PER_PAGE);
                return this.currentPageData
            }catch (e) {
                LMEPG.UI.logPanel.show("getCurrentPageData "+e);
            }
        },

        //只有重新进入投票专区才更新投票专区的顺序,按热度排序
        refreshVoteByHot: function () {
            try {
                Activity.voteData = JSON.parse(JSON.stringify(Activity.rawVoteData));
                this.voteData.sort(function (prev, next) {
                    return next.total_hot - prev.total_hot;
                })
            }catch (e) {
                LMEPG.UI.logPanel.show("refreshVoteByHot "+e);
            }
        },

        //更新投票专区当前页作品票数
        updateVoteNum: function(){
            try {
                for (i = 0; i < Activity.currentPageData.length; i++) {
                    G('vote-num-'+ i).innerHTML = Activity.rawVoteData[Activity.currentPageData[i].playerId - 1].voteNum;
                }
            }catch (e) {
                LMEPG.UI.logPanel.show("updateVoteNum "+e);
            }
        },

        //按票数排序
        refreshRankByVoteNum: function () {
            try {
                Activity.rankData = JSON.parse(JSON.stringify(Activity.rawVoteData));;
                this.rankData.sort(function (prev, next) {
                    return next.voteNum - prev.voteNum;
                })
            }catch (e) {
                LMEPG.UI.logPanel.show("refreshRankByVoteNum "+e);
            }
        },

        /**
         * 初始化元素隐藏
         * */
        initRender: function() {
            try {
                // Hide('vote-container');

                var i = 0;
                while( i<Activity.currentPageData.length ){
                    Hide("add-one-" + i);
                    i++;
                }
            }catch (e) {
                LMEPG.UI.logPanel.show("initRender "+e);
            }
        },

    };//end Activity =
    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);