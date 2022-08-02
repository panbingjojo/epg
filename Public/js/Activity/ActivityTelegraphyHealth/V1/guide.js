var AreaData = [
    /*   {
           "areaName": "乌鲁木齐",
           "areaID": "1001",
           "voteNumber": 0
       },*/ {
        "areaName": "克拉玛依",
        "business": "友谊路营业厅",
        "areaID": "1002",
        "voteNumber": 0
    }, {
        "areaName": "昌吉",
        "business": "延安北路营业厅",
        "areaID": "1003",
        "voteNumber": 0
    }, {
        "areaName": "塔城",
        "business": "新华街营业厅",
        "areaID": "1004",
        "voteNumber": 0
    }, {
        "areaName": "哈密",
        "business": "中山北路营业厅",
        "areaID": "1005",
        "voteNumber": 0
    }, {
        "areaName": "阿勒泰",
        "business": "解放路中心营业厅",
        "areaID": "1006",
        "voteNumber": 0
    }, {
        "areaName": "和田",
        "business": "北京西路营业厅",
        "areaID": "1007",
        "voteNumber": 0
    }, {
        "areaName": "克州",
        "business": "阿图什市中心营业厅",
        "areaID": "1008",
        "voteNumber": 0
    }
    , {
        "areaName": "博州",
        "business": "博乐顾力木图营业厅",
        "areaID": "1009",
        "voteNumber": 0
    }, {
        "areaID": "1010",
        "business": "团结东街营业厅",
        "areaName": "奎屯",
        "voteNumber": 0
    }, {
        "areaID": "1011",
        "business": "北四路营业厅",
        "areaName": "石河子",
        "voteNumber": 0
    }, {
        "areaID": "1012",
        "business": "老城路营业厅",
        "areaName": "吐鲁番",
        "voteNumber": 0
    }, {
        "areaID": "1013",
        "business": "库尔勒人民西路中心营业厅",
        "areaName": "巴州",
        "voteNumber": 0
    }, {
        "areaID": "1014",
        "areaName": "阿克苏",
        "business": "大十字中心营业厅",
        "voteNumber": 0
    }, {
        "areaID": "1015",
        "areaName": "喀什",
        "business": "人民西路营业厅",
        "voteNumber": 0
    }, {
        "areaID": "1016",
        "business": "伊宁解放南路营业厅",
        "areaName": "伊犁",
        "voteNumber": 0
    }
];

var AreaMap = {
    // "1001": "乌鲁木齐",
    "1002": {
        areaName: '克拉玛依',
        business: "友谊路营业厅"
    },
    "1003": {
        areaName: '昌吉',
        business: "延安北路营业厅"
    },
    "1004": {
        areaName: "塔城",
        business: "新华街营业厅"
    },
    "1005": {
        areaName: "哈密",
        business: "中山北路营业厅"
    },
    "1006": {
        areaName: "阿勒泰",
        business: "解放路中心营业厅"
    },
    "1007": {
        areaName: "和田",
        business: "北京西路营业厅"
    },
    "1008": {
        areaName: "克州",
        business: "阿图什市中心营业厅"
    },
    "1009": {
        areaName: "博州",
        business: "博乐顾力木图营业厅"
    },
    "1010": {
        areaName: "奎屯",
        business: "团结东街营业厅"
    },
    "1011": {
        areaName: "石河子",
        business:  "北四路营业厅"
    },
    "1012": {
        areaName: "吐鲁番",
        business: "老城路营业厅"
    },
    "1013": {
        areaName: "巴州",
        business: "库尔勒人民西路中心营业厅"
    },
    "1014": {
        areaName: "阿克苏",
        business: "大十字中心营业厅"
    },
    "1015": {
        areaName: "喀什",
        business: "人民西路营业厅"
    },
    "1016": {
        areaName: "伊犁",
        business: "伊宁解放南路营业厅"
    }
};

/**
 * 页面跳转对象。
 */
var Page = {
    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        return LMEPG.Intent.createIntent("activity-common-guide");
    },

    /**
     * 跳转到home页面
     */
    jumpHome: function () {
        var objCurrent = Page.getCurrentPage(); //得到当前页

        var objHome = LMEPG.Intent.createIntent("home");
        objHome.setParam("userId", RenderParam.userId);

        LMEPG.Intent.jump(objHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 跳转到专辑
     * @param albumName
     */
    jumpAlbum: function (albumName) {
        var objCurrent = Page.getCurrentPage(); //得到当前页

        var objHome = LMEPG.Intent.createIntent("home");
        objHome.setParam("userId", RenderParam.userId);

        var objAlbum = LMEPG.Intent.createIntent("album");
        objAlbum.setParam("userId", RenderParam.userId);
        objAlbum.setParam("albumName", albumName);
        objAlbum.setParam("inner", 1);

        LMEPG.Intent.jump(objAlbum, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objHome);
    },

    /**
     * 跳转到活动
     * @param activityName
     */
    jumpActivity: function (activityName) {
        var objCurrent = Page.getCurrentPage(); //得到当前页

        var objHome = LMEPG.Intent.createIntent("home");
        objHome.setParam("userId", RenderParam.userId);

        var objActivity = LMEPG.Intent.createIntent("activity");
        objActivity.setParam("userId", RenderParam.userId);
        objActivity.setParam("activityName", activityName);
        objActivity.setParam("inner", 1);

        LMEPG.Intent.jump(objActivity, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT, objHome);
    },

    /**
     * 跳转到视频播放页，播放结束时返回到首页
     * @param data 视频信息
     */
    jumpPlayVideo: function (data) {

        // 创建视频信息
        var videoObj = data.ftp_url instanceof Object ? data.ftp_url : JSON.parse(data.ftp_url);
        var videoUrl = RenderParam.platformType == "hd" ? videoObj.gq_ftp_url : videoObj.bq_ftp_url;

        var videoInfo = {
            "sourceId": data.source_id,
            "videoUrl": videoUrl,
            "title": data.title,
            "type": data.model_type,
            "userType": data.user_type,
            "freeSeconds": data.free_seconds,
            "entryType": 1,
            "entryTypeName": "epg-home",
            "unionCode": data.union_code,
            'showStatus': 1
        };

        var objCurrent = Page.getCurrentPage(); //得到当前页

        var objHome = LMEPG.Intent.createIntent("home");
        objHome.setParam("userId", RenderParam.userId);

        var objPlayer = LMEPG.Intent.createIntent("player");
        objPlayer.setParam("userId", RenderParam.userId);
        objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

        LMEPG.Intent.jump(objPlayer, objCurrent, 0, objHome);
    },

    /**
     * 页面跳转
     * @param userfromType
     * @param subId
     */
    jumpPage: function (userfromType, subId) {
        Page.jumpTransition(userfromType, subId);
    },

    jumpTransition: function (userfromType, subId) {
        switch (parseInt(userfromType)) {
            case 0:
                //进入主页
                Page.jumpHome();
                break;
            case 1:
                //进入专辑
                Page.jumpAlbum(subId);
                break;
            case 2:
                Page.jumpActivity(subId);
                break;
            case 3:
                Page.jumpPlayVideo(subId);
                break;
            default:
                //进入主页
                Page.jumpHome();
                break;
        }
    },

    /**
     * 判断是否直接去首页
     * return: true--直接去首页,false--按原来逻辑跳转
     */
    isJumpHome: function (userfromType) {
        // 如果不是中国联通EPG，就按原来的逻辑处理，如果是中国联通EPG，就按下面的规处理
        if (RenderParam.carrierId != "000051") {
            return false;
        }

        // 屏蔽中国联通EPG-山东省拦截（专辑、活动，直接进产品首页），除了青岛（该进哪儿就进哪儿）
        if (RenderParam.carrierId == "000051" && RenderParam.areaCode == "216") {
            if (RenderParam.subAreaCode == "0532") {
                // 中国联通-山东-青岛
                return false;
            } else if (parseInt(userfromType) == 2) { // 与朱凯沟通：如果是活动，就不去首页了 20190328
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
};


(function (w, undefined) {
    // 定义当前页面对应的对象
    function Guide() {
        this.__proto__.buttons = [];
        this.answerTimes = RenderParam.leftTimes;
        this.pastIndex = 1;
        this.totalPast = 6;
    }

    Guide.prototype.refreshRank = function () {
        var reqData = {};
        LMEPG.ajax.postAPI('Activity/getPlayerRote', reqData,
            function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    var result = data.result;
                    if (result == 0) {
                        //G("debug").innerHTML += "rankTimer start --------</br>";
                        RenderParam.voteDetail = data;
                        guide.initData();
                        guide.renderHtml();
                        var currentBtnId = LMEPG.ButtonManager.getCurrentButton().id;
                        LMEPG.ButtonManager.init(currentBtnId, guide.buttons, '', true);
                        //G("debug").innerHTML += "rankTimer end --------</br>";
                    } else {
                        LMEPG.UI.showToast("刷新失败！");
                    }
                } catch (e) {
                    LMEPG.UI.showToast("刷新异常，解析异常！");
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("服务器异常");
            }
        );
    };

    Guide.prototype.startRefresh = function () {
        // 启动定时器，没隔60秒实时刷新当前页面
        this.rankTimer = setInterval(function () {
            guide.refreshRank();
        }, 60*1000);
    };

    Guide.prototype.initData = function () {
        // 处理后端排名数据
        this.voteAreaList = [];
        // this.todayVote = 0;
        if (RenderParam.voteDetail && RenderParam.voteDetail.result === 0) {
            var areaListData = RenderParam.voteDetail.list;
            if (areaListData.length === 0) {
                this.voteAreaList = AreaData;
            } else {
                for (var i = 0; i < AreaData.length; i++) {
                    var existAreaId = AreaData[i].areaID;
                    var isReplace = false;
                    for (var j = 0; j < areaListData.length; j++) {
                        var areaId = areaListData[j].player_id;
                        if (existAreaId === areaId) {
                            var voteNum = areaListData[j].total_point;
                            if (areaId == "1001") {
                                // voteNum = 99999;
                                continue;
                            }
                            if (areaId == '1003'){
                                voteNum = 99999;
                            }
                            this.voteAreaList.push({
                                "areaID": areaId,
                                "areaName": AreaMap[areaId].areaName,
                                "business":  AreaMap[areaId].business,
                                "voteNumber": voteNum
                            });
                            isReplace = true;
                            break;
                        }
                    }
                    if (!isReplace) {
                        this.voteAreaList.push(AreaData[i]);
                    }
                }
                this.voteAreaList.sort(function (prev, next) {
                    if (next.voteNumber - prev.voteNumber == 0) {
                        return prev.areaID - next.areaID;
                    } else {
                        return next.voteNumber - prev.voteNumber;
                    }
                })
            }
        }
    };

    Guide.prototype.renderHtml = function () {
        G("rank_wrap").innerHTML = "";
        // 创建1-8名地区表格
        var leftTableData = this.voteAreaList.slice(0, 8);
        var leftTableHtml = "<table class='table_left'>";

        G("rank_wrap").innerHTML += this.createTable(leftTableHtml, false, leftTableData);

        // 创建9-16名地区表格
        var rightTableData = this.voteAreaList.slice(8, this.voteAreaList.length);
        var rightTableHtml = "<table class='table_right'>";

        G("rank_wrap").innerHTML += this.createTable(rightTableHtml, true, rightTableData);
    };

    Guide.prototype.createTable = function (tableHtml, isRight, tableData) {
        // 投票图片路径
        var voteImagePath = RenderParam.imagePathPrefix + "btn_vote.png";
        for (var index = 0; index < tableData.length; index++) {
            // 获取数据添加一行
            var areaObj = tableData[index];
            // 添加排名列
            tableHtml += "<tr><td class='table_col1'></td>";
            // 添加地区列
            tableHtml += "<td class='table_col2'><span class='area_name'>" + areaObj.areaName + "</span><span class='business'>("+ areaObj.business +")</span></td>";
            // 添加投票列
            var voteId;
            if (isRight) {
                voteId = "btn_vote_" + (index + 8);
            } else {
                voteId = "btn_vote_" + index;
            }
            tableHtml += "<td class='table_col3'><img id='" + voteId + "' src='" + voteImagePath + "' data-v='" + areaObj.areaID + "'></td></tr>";
        }

        tableHtml += "</table>";

        return tableHtml;
    };

    Guide.prototype.back = function () {
        var reqData = {
            "lmp": 28
        };
        //普通入口，需要拉取启动配置
        LMEPG.ajax.postAPI("Activity/getEntryRecommendInfo", reqData, function (rdata) {
            if (rdata.result == 0) {
                switch (rdata.data.type) {
                    case 1: // 专辑
                        Page.jumpPage(rdata.data.type, rdata.data.alias_name);
                        break;
                    case 2: // 活动
                        Page.jumpPage(rdata.data.type, rdata.data.alias_name);
                        break;
                    case 3: // 单集视频
                        Page.jumpPage(rdata.data.type, rdata.data.video_info);
                        break;
                    case 4: // 视频集

                    default:
                        LMEPG.UI.showToast("暂时不支持类型：" + rdata.data.type);
                        var userfromType = 0; // 不符合上面的条件，就弹出toast提示，然后进行首页
                        var activityName = "";
                        Page.jumpPage(userfromType, activityName);
                        break;
                }
            } else {
                var userfromType = 0; // 没数据，进行首页
                var activityName = "";
                Page.jumpPage(userfromType, activityName);
            }
        });
    };

    Guide.prototype.showRuleDialog = function () {
        var dialogHtml = "";
        dialogHtml += "<img src='" + RenderParam.imagePathPrefix + "bg_rule.png' />";
        dialogHtml += "<img id='btn_close_rule' class='btn_close' src='" + RenderParam.imagePathPrefix + "btn_close.gif' />";
        G('dialog_wrap').innerHTML = dialogHtml;
        LMEPG.ButtonManager.requestFocus('btn_close_rule');
    };

    Guide.prototype.showNoticeDialog = function () {
        var dialogHtml = "";
        dialogHtml += "<img src='" + RenderParam.imagePathPrefix + "bg_notice.png' />";
        dialogHtml += "<img id='btn_close_notice' class='btn_close' src='" + RenderParam.imagePathPrefix + "btn_close.gif' />";
        G('dialog_wrap').innerHTML = dialogHtml;
        LMEPG.ButtonManager.requestFocus('btn_close_notice');
    };

    Guide.prototype.showPastDialog = function (btn) {
        var self = btn.Obj;
        var dialogHtml = "";
        dialogHtml += "<img src='" + RenderParam.imagePathPrefix + "bg_past.png' />";
        dialogHtml += "<img id='img_past' src='" + RenderParam.imagePathPrefix + "past_1.png' />";
        dialogHtml += "<img id='btn_left_arrow' src='" + RenderParam.imagePathPrefix + "btn_left_arrow.png' />";
        dialogHtml += "<img id='btn_right_arrow' src='" + RenderParam.imagePathPrefix + "btn_right_arrow.png' />";
        dialogHtml += "<div id='past_indicator'>1/" + self.totalPast + "</div>";
        dialogHtml += "<img id='btn_close_past' class='btn_close' src='" + RenderParam.imagePathPrefix + "btn_close.gif' />";
        G('dialog_wrap').innerHTML = dialogHtml;
        H("btn_left_arrow");
        LMEPG.ButtonManager.requestFocus('btn_close_past');
    };

    Guide.prototype.dismissDialog = function (btn) {
        G('dialog_wrap').innerHTML = "";

        switch (btn.id) {
            case 'btn_close_rule':
                LMEPG.ButtonManager.requestFocus('btn_rule');
                break;
            case 'btn_close_notice':
                LMEPG.ButtonManager.requestFocus('btn_vote_0');
                break;
            case 'btn_close_past':
                LMEPG.ButtonManager.requestFocus('btn_past');
                break;
        }
    };


    Guide.prototype.onBeforePastMove = function (direction, current) {
        var self = current.Obj;
        //翻页
        switch (direction) {
            case 'left':
                if (self.pastIndex <= 1) {
                    return;
                }
                self.pastIndex--;
                break;
            case 'right':
                if (self.pastIndex >= self.totalPast) {
                    return;
                }
                self.pastIndex++;
                break;
        }
        self.updatePast();
    };

    Guide.prototype.updatePast = function () {
        G("img_past").src = RenderParam.imagePathPrefix + "past_" + this.pastIndex + ".png";
        if (this.pastIndex == 1) {
            H('btn_left_arrow')
        } else if (this.pastIndex == this.totalPast) {
            H('btn_right_arrow');
        } else {
            S('btn_left_arrow');
            S('btn_right_arrow');
        }
        G('past_indicator').innerHTML = this.pastIndex + '/' + this.totalPast;
    };


    Guide.prototype.getAnswerTimes = function (btn) {
        var reqData = {
            "roundFlag": 1
        };

        LMEPG.ajax.postAPI('Activity/participateActivity', reqData,
            function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    guide.answerTimes = data["left_times"];
                    if (guide.answerTimes < 0) {
                        // 显示公告弹窗
                        LMEPG.UI.showToast("今日已投票！");
                        guide.showNoticeDialog();
                    } else {
                        LMEPG.UI.showToast("投票成功！");
                        guide.showNoticeDialog();
                    }
                } catch (e) {
                    LMEPG.UI.showToast("投票异常，解析异常！");
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("服务器异常");
            }
        );
    };

    Guide.prototype.doVote = function (btn) {
        // var self = btn.Obj;
        var areaId = G(btn.id).getAttribute('data-v');
        if (guide.answerTimes <= 0) {
            // 显示公告弹窗
            LMEPG.UI.showToast("今日已投票！");
            guide.showNoticeDialog();
        } else {
            var reqData = {
                "playerId": areaId
            };
            //  投票操作
            LMEPG.ajax.postAPI('Activity/setPlayerRote', reqData,
                function (rsp) {
                    try {
                        var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                        var result = data.result;
                        if (result == 0) {
                            // 获取当前剩余投票次数
                            guide.getAnswerTimes();
                        } else {
                            LMEPG.UI.showToast("投票失败！");
                        }
                    } catch (e) {
                        LMEPG.UI.showToast("投票异常，解析异常！");
                        LMEPG.Log.error(e.toString());
                    }
                },
                function (rsp) {
                    LMEPG.UI.showToast("服务器异常");
                }
            );
        }
    };

    Guide.prototype.initButtons = function () {
        for (var index = 0; index < this.voteAreaList.length; index++) {
            var btnId = 'btn_vote_' + index;
            var moveUp = 'btn_vote_' + (index - 1);
            var moveLeft = '';
            var moveRight = '';
            var moveDown = 'btn_vote_' + (index + 1);

            var btnName = "投票位" + (index + 1);
            // 左边表格事件
            if (index === 0 || index === 8) {
                // 左边第一位
                moveUp = '';
            }
            if (index === 7 || index === (this.voteAreaList.length - 1)) {
                // 左边最后一位
                moveDown = '';
            }
            if (index === 8 || index === 9) {
                moveRight = 'btn_rule';
            }
            if (index === 10 || index === 11) {
                moveRight = 'btn_past';
            }
            if (index < 8) {
                moveRight = 'btn_vote_' + (index + 8);
            } else {
                moveLeft = 'btn_vote_' + (index - 8);
            }
            this.buttons.push({
                id: btnId,
                name: btnName,
                type: 'img',
                nextFocusLeft: moveLeft,
                nextFocusRight: moveRight,
                nextFocusUp: moveUp,
                nextFocusDown: moveDown,
                backgroundImage: RenderParam.imagePathPrefix + 'btn_vote.png',
                focusImage: RenderParam.imagePathPrefix + 'btn_vote_f.gif',
                click: this.doVote,
                focusChange: '',
                beforeMoveChange: '',
                Obj: this
            });
        }
        this.buttons.push({
            id: "btn_back",
            name: "返回",
            type: 'img',
            nextFocusLeft: "btn_vote_8",
            nextFocusRight: "",
            nextFocusUp: "",
            nextFocusDown: "btn_rule",
            backgroundImage: RenderParam.imagePathPrefix + 'btn_back.png',
            focusImage: RenderParam.imagePathPrefix + 'btn_back_f.gif',
            click: this.back,
            focusChange: '',
            beforeMoveChange: '',
            Obj: this
        }, {
            id: "btn_rule",
            name: "返回",
            type: 'img',
            nextFocusLeft: "btn_vote_8",
            nextFocusRight: "",
            nextFocusUp: "btn_back",
            nextFocusDown: "btn_past",
            backgroundImage: RenderParam.imagePathPrefix + 'btn_rule.png',
            focusImage: RenderParam.imagePathPrefix + 'btn_rule_f.gif',
            click: this.showRuleDialog,
            focusChange: '',
            beforeMoveChange: '',
            Obj: this
        }, {
            id: "btn_past",
            name: "往期风采",
            type: 'img',
            nextFocusLeft: "btn_vote_10",
            nextFocusRight: "",
            nextFocusUp: "btn_rule",
            nextFocusDown: "",
            backgroundImage: RenderParam.imagePathPrefix + 'btn_past.png',
            focusImage: RenderParam.imagePathPrefix + 'btn_past_f.gif',
            click: this.showPastDialog,
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
            focusImage: RenderParam.imagePathPrefix + 'btn_close.gif',
            click: this.dismissDialog,
            focusChange: '',
            beforeMoveChange: '',
            Obj: this
        }, {
            id: "btn_close_notice",
            name: "关闭活动公告",
            type: 'img',
            nextFocusLeft: "",
            nextFocusRight: "",
            nextFocusUp: "",
            nextFocusDown: "",
            focusImage: RenderParam.imagePathPrefix + 'btn_close.gif',
            click: this.dismissDialog,
            focusChange: '',
            beforeMoveChange: '',
            Obj: this
        }, {
            id: "btn_close_past",
            name: "关闭往期风采",
            type: 'img',
            nextFocusLeft: "",
            nextFocusRight: "",
            nextFocusUp: "",
            nextFocusDown: "",
            focusImage: RenderParam.imagePathPrefix + 'btn_close.gif',
            click: this.dismissDialog,
            focusChange: '',
            beforeMoveChange: this.onBeforePastMove,
            Obj: this
        });
        LMEPG.ButtonManager.init("btn_vote_0", this.buttons, '', true);
    };

    w.Guide = Guide;
})(window, undefined);

(function (w, undefined) {
    var guide = new Guide();
    guide.initData();
    guide.renderHtml();
    guide.initButtons();
    w.guide = guide;
    guide.startRefresh();

    w.onunload = function () {
        clearTimeout(guide.rankTimer);
    };
    w.onBack = guide.back;

    lmInitGo();
})(window, undefined);


