var ActivityDeliverMoonCake = {
    buttons: [],
    init: function () {
        // 初始化差异图片
        ActivityDeliverMoonCake.initImageRegional();
        ActivityDeliverMoonCake.initGameData();
        ActivityDeliverMoonCake.gameBox = G('game-box');
        // 显示游戏次数
        G('game-times').innerHTML = RenderParam.leftTimes;
        // 初始化按钮
        ActivityDeliverMoonCake.initButtons();
        // 初始化弹窗
        ActivityDeliverMoonCake.initDialog();
        // 初始化
        LMActivity.init();
        // 显示订购结果
        LMActivity.showOrderResult();
    },

    initImageRegional: function(){
        var imageRegion = '';
        switch (RenderParam.lmcid) {
            case '640092':
                imageRegion = 'V1/';
                break;
            case '220094':
                imageRegion = 'V2/';
                break;
            default:
                imageRegion = 'V1/';
                break;
        }
        LMActivity.imageRegionPath = RenderParam.imagePathPrefix + imageRegion;

        G('background').src = LMActivity.createRegionImageUrl('bg_home.png');
        G('bg-activity-rule').src = LMActivity.createRegionImageUrl('bg_activity_rule.png');
    },

    initButtons: function () {
        //初始化活动规则页面
        LMActivity.initActivityRuleButton();

        // 初始化中奖名单页面
        LMActivity.initWinnerList(LMActivity.WinnerListType.Lottery);
        var keyBoardTop = RenderParam.platformType == 'hd' ? '365px' : '298px';
        LMActivity.initWinnerListButton(keyBoardTop);

        // 初始化订购对话框
        LMActivity.initPurchaseVIPButton();
        // 初始化游戏结束对话框
        LMActivity.initGameOverButton();

        // 初始化抽奖相关
        LMActivity.initLotterySuccessButtons();
        LMActivity.initLotteryFailButton();

        var activityButtons = [
            {
                id: 'btn-back',
                name: '关闭',
                type: 'img',
                nextFocusLeft: 'btn-start',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'btn-rules',
                backgroundImage: LMActivity.createImageUrl('btn_back.png'),
                focusImage: LMActivity.createImageUrl('btn_back_f.png'),
                click: LMActivity.exit,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'btn-rules',
                name: '活动规则',
                type: 'img',
                nextFocusLeft: 'btn-start',
                nextFocusRight: '',
                nextFocusUp: 'btn-back',
                nextFocusDown: 'btn-winner-list',
                backgroundImage: LMActivity.createImageUrl('btn_rules.png'),
                focusImage: LMActivity.createImageUrl('btn_rules_f.png'),
                click: LMActivity.showActivityRule,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'btn-winner-list',
                name: '中奖名单',
                type: 'img',
                nextFocusLeft: 'btn-start',
                nextFocusRight: '',
                nextFocusUp: 'btn-rules',
                nextFocusDown: 'btn-start',
                backgroundImage: LMActivity.createImageUrl('btn_winner_list.png'),
                focusImage: LMActivity.createImageUrl('btn_winner_list_f.png'),
                click: LMActivity.showWinnerList,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'btn-start',
                name: '开始游戏',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn-winner-list',
                nextFocusUp: 'btn-winner-list',
                nextFocusDown: '',
                backgroundImage: LMActivity.createImageUrl('btn_start.png'),
                focusImage: LMActivity.createImageUrl('btn_start_f.png'),
                click: ActivityDeliverMoonCake.start,
                focusChange: "",
                beforeMoveChange: "",
                moveChange: ""
            }, {
                id: 'game-box',
                name: '游戏盒子',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: LMActivity.createImageUrl('icon_game_box.png'),
                focusImage: LMActivity.createImageUrl('icon_game_box.png'),
                click: '',
                focusChange: "",
                beforeMoveChange: ActivityDeliverMoonCake.moveGameBox,
                moveChange: ""
            }, {
                id: 'btn-game-fail',
                name: '游戏失败',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: LMActivity.createImageUrl('btn_sure.png'),
                focusImage: LMActivity.createImageUrl('btn_sure_f.png'),
                click: ActivityDeliverMoonCake.exitGameFail,
                focusChange: "",
                beforeMoveChange: '',
                moveChange: ""
            }, {
                id: 'btn-lottery',
                name: '抽奖',
                type: 'img',
                nextFocusLeft: 'btn-cancel-lottery',
                nextFocusRight: 'btn-cancel-lottery',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: LMActivity.createImageUrl('btn_lottery.png'),
                focusImage: LMActivity.createImageUrl('btn_lottery_f.png'),
                click: ActivityDeliverMoonCake.lottery,
                focusChange: "",
                beforeMoveChange: '',
                moveChange: ""
            }, {
                id: 'btn-cancel-lottery',
                name: '取消抽奖',
                type: 'img',
                nextFocusLeft: 'btn-lottery',
                nextFocusRight: 'btn-lottery',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: LMActivity.createImageUrl('btn_cancel_lottery.png'),
                focusImage: LMActivity.createImageUrl('btn_cancel_lottery_f.png'),
                click: ActivityDeliverMoonCake.exitGameSuccess,
                focusChange: "",
                beforeMoveChange: '',
                moveChange: ""
            }];
        ActivityDeliverMoonCake.buttons = activityButtons.concat(LMActivity.buttons);
        LMEPG.ButtonManager.init('btn-start', ActivityDeliverMoonCake.buttons, '', true);
    },

    initDialog: function () {
        // 创建游戏弹窗显示
        ActivityDeliverMoonCake.gameConfig = {
            id: 'game-container',
            focusId: 'game-box',
            hideFocusId: 'btn-start',
            onShowListener: function () {
                // 初始化游戏状态
                ActivityDeliverMoonCake.initGame();
            },
            onDismissListener: function () {
                // 回复游戏页面状态
                ActivityDeliverMoonCake.resetGame();
            }
        };
        ActivityDeliverMoonCake.gameFailConfig = {
            id: 'game-fail',
            focusId: 'btn-game-fail',
            hideFocusId: 'btn-start',
            onShowListener: function () {
                G('game-fail-score').innerHTML = ActivityDeliverMoonCake.getCurrentScore().toString();
            },
            onDismissListener: function () {
                LMActivity.intent.reload();
            }
        };
        ActivityDeliverMoonCake.gameSuccessConfig = {
            id: 'game-success',
            focusId: 'btn-lottery',
            hideFocusId: 'btn-start',
            onShowListener: function () {
                G('game-success-score').innerHTML = ActivityDeliverMoonCake.getCurrentScore().toString();
            },
            onDismissListener: function () {
                LMActivity.intent.reload();
            }
        };
    },

    initGameData: function () {
        if (RenderParam.platformType === 'hd') {
            ActivityDeliverMoonCake.gameBoxWidth = 187;
            ActivityDeliverMoonCake.gameBoxHeight = 217;
            ActivityDeliverMoonCake.moonCakeWidth = 101;
            ActivityDeliverMoonCake.moonCakeHeight = 98;
            ActivityDeliverMoonCake.moonCakeMoveY = 10;
            ActivityDeliverMoonCake.maxBoxLeft = 1280;
            ActivityDeliverMoonCake.maxBoxHeight = 720;
            ActivityDeliverMoonCake.initCakeLeft = 26;
            ActivityDeliverMoonCake.initBoxLeft = 587;
            ActivityDeliverMoonCake.initBoxTop = 503;
            ActivityDeliverMoonCake.moonCakePosition = [1005, 818, 631, 444, 257, 70];
        } else {
            ActivityDeliverMoonCake.gameBoxWidth = 130;
            ActivityDeliverMoonCake.gameBoxHeight = 151;
            ActivityDeliverMoonCake.moonCakeWidth = 74;
            ActivityDeliverMoonCake.moonCakeHeight = 73;
            ActivityDeliverMoonCake.moonCakeMoveY = 8;
            ActivityDeliverMoonCake.maxBoxLeft = 644;
            ActivityDeliverMoonCake.maxBoxHeight = 530;
            ActivityDeliverMoonCake.initCakeLeft = 37;
            ActivityDeliverMoonCake.initBoxLeft = 297;
            ActivityDeliverMoonCake.initBoxTop = 379;
            ActivityDeliverMoonCake.moonCakePosition = [449, 328, 195, 65];
        }
    },

    start: function () {
        if (parseInt(RenderParam.leftTimes) > 0) {
            // 上传游戏次数
            LMActivity.ajaxHelper.uploadPlayRecord(ActivityDeliverMoonCake.uploadRecordSuccess, ActivityDeliverMoonCake.uploadRecordFail);
        } else if (RenderParam.isVip == '0') {
            // 显示订购弹窗
            LMActivity.showDialog(LMActivity.purchaseConfig);
        } else {
            // 显示游戏结束弹窗
            LMActivity.showDialog(LMActivity.gameOverConfig);
        }
    },
    exitGameFail: function () {
        LMActivity.hideDialog(ActivityDeliverMoonCake.gameFailConfig);
    },
    exitGameSuccess: function () {
        LMActivity.hideDialog(ActivityDeliverMoonCake.gameSuccessConfig);
    },
    lottery: function () {
        // Ajax请求抽奖接口，根据抽奖的结果做不同的处理
        LMActivity.ajaxHelper.lottery(ActivityDeliverMoonCake.lotterySuccess, ActivityDeliverMoonCake.lotteryFail);
    },

    // ------ 游戏页逻辑处理 ------
    initGame: function () {
        // 显示当前游戏积分数
        G('cake-count').innerHTML = '0';

        ActivityDeliverMoonCake.gameBox.style.left = ActivityDeliverMoonCake.initBoxLeft + 'px';
        ActivityDeliverMoonCake.gameBox.style.top = ActivityDeliverMoonCake.initBoxTop + 'px';

        ActivityDeliverMoonCake.currentScore = 0;
        ActivityDeliverMoonCake.gameTime = 30;
        ActivityDeliverMoonCake.isGameRunning = true;

        ActivityDeliverMoonCake.cakeCount = 4;
        ActivityDeliverMoonCake.createMoonCake();
        ActivityDeliverMoonCake.createCakeInterval = setInterval(function () {
            ActivityDeliverMoonCake.cakeCount--;
            if (ActivityDeliverMoonCake.cakeCount <= 0) {
                clearInterval(ActivityDeliverMoonCake.createCakeInterval);
            } else {
                ActivityDeliverMoonCake.createMoonCake();
            }
        }, 1000);

        G('game-time').innerHTML = ActivityDeliverMoonCake.gameTime + 'S';
        ActivityDeliverMoonCake.gameInterval = setInterval(function () {
            if (ActivityDeliverMoonCake.gameTime <= 0) {
                ActivityDeliverMoonCake.isGameRunning = false;
                clearInterval(ActivityDeliverMoonCake.gameInterval);
                // 判断本次游戏积分，0 -- 显示游戏失败页面，大于0 -- 记录当前活动积分
                if (ActivityDeliverMoonCake.currentScore > 0) {
                    LMActivity.ajaxHelper.updateScore(ActivityDeliverMoonCake.currentScore, ActivityDeliverMoonCake.updateScoreSuccess, ActivityDeliverMoonCake.updateScoreFail);
                } else {
                    LMActivity.showDialog(ActivityDeliverMoonCake.gameFailConfig);
                }
            } else {
                ActivityDeliverMoonCake.gameTime--;
                G('game-time').innerHTML = ActivityDeliverMoonCake.gameTime + 'S';
            }
        }, 1000);
    },

    resetGame: function () {
        // 停止当前游戏
        ActivityDeliverMoonCake.isGameRunning = false;
        // 清除游戏页定时器
        if (ActivityDeliverMoonCake.createCakeInterval) {
            clearInterval(ActivityDeliverMoonCake.createCakeInterval);
        }
        if (ActivityDeliverMoonCake.gameInterval) {
            clearInterval(ActivityDeliverMoonCake.gameInterval);
        }
        //清除当前页面已经存在的月饼
        G('cake-container').innerHTML = '';
        // 游戏次数减1
        var gameTimes = parseInt(RenderParam.leftTimes);
        gameTimes = gameTimes - 1;
        RenderParam.leftTimes = String(gameTimes);
        G('game-times').innerHTML = RenderParam.leftTimes;
    },

    moveGameBox: function (direction, current) {
        var currentBoxLeft = parseInt(ActivityDeliverMoonCake.gameBox.style.left);
        var nextBoxLeft = 0;
        switch (direction) {
            case 'left':
                nextBoxLeft = currentBoxLeft - ActivityDeliverMoonCake.gameBoxWidth;
                if (nextBoxLeft > 0) {
                    ActivityDeliverMoonCake.gameBox.style.left = nextBoxLeft + 'px';
                }
                break;
            case 'right':
                nextBoxLeft = currentBoxLeft + ActivityDeliverMoonCake.gameBoxWidth;
                if (nextBoxLeft < (ActivityDeliverMoonCake.maxBoxLeft - ActivityDeliverMoonCake.gameBoxWidth)) {
                    ActivityDeliverMoonCake.gameBox.style.left = nextBoxLeft + 'px';
                }
                break;
        }
    },

    createMoonCake: function () {
        var cakeElement = document.createElement('img');
        cakeElement.src = RenderParam.imagePath + 'icon_moon_cake.png';
        cakeElement.style.width = ActivityDeliverMoonCake.moonCakeWidth + 'px';
        cakeElement.style.height = ActivityDeliverMoonCake.moonCakeHeight + 'px';
        cakeElement.style.top = '0px';
        cakeElement.style.left = ActivityDeliverMoonCake.randomCakeLeft() + 'px';
        G('cake-container').appendChild(cakeElement);

        var cakeInterval = setInterval(function () {
            if (ActivityDeliverMoonCake.isGameRunning) {
                var currentBoxLeft = parseInt(ActivityDeliverMoonCake.gameBox.style.left);
                var currentCakeTop = parseInt(cakeElement.style.top);
                var currentCakeLeft = parseInt(cakeElement.style.left);
                var isCakeInBoxX = currentCakeLeft >= currentBoxLeft && currentCakeLeft <= (currentBoxLeft + ActivityDeliverMoonCake.gameBoxWidth);
                var cakeBottom = currentCakeTop + ActivityDeliverMoonCake.moonCakeHeight;
                var isCakeInBoxY = cakeBottom >= ActivityDeliverMoonCake.initBoxTop - 5 && cakeBottom <= ActivityDeliverMoonCake.initBoxTop + 5;
                if (isCakeInBoxY && isCakeInBoxX) {
                    // 月饼已经落入盒子中
                    ActivityDeliverMoonCake.currentScore++;
                    G('cake-count').innerHTML = ActivityDeliverMoonCake.getCurrentScore().toString();
                    // 刷新外部已经获取月饼数量
                    ActivityDeliverMoonCake.clearMoonCake(cakeInterval, cakeElement);
                    // 显示+1图片
                    ActivityDeliverMoonCake.createScoreAdd(currentCakeTop, currentCakeLeft);
                }
                var nextCakeTop = currentCakeTop + ActivityDeliverMoonCake.moonCakeMoveY;
                if (nextCakeTop < (ActivityDeliverMoonCake.maxBoxHeight - ActivityDeliverMoonCake.moonCakeHeight)) {
                    cakeElement.style.top = nextCakeTop + 'px';
                } else {
                    ActivityDeliverMoonCake.clearMoonCake(cakeInterval, cakeElement);
                }
            }
        },100)
    },

    createScoreAdd: function (top, left) {
        var scoreElement = document.createElement('img');
        scoreElement.src = RenderParam.imagePath + 'icon_add_score.png';
        scoreElement.style.top = top + 'px';
        scoreElement.style.left = left + 'px';
        G('cake-container').appendChild(scoreElement);

        var scoreTimeout = setTimeout(function () {
            clearTimeout(scoreTimeout);
            ActivityDeliverMoonCake.removeElement(scoreElement);
        }, 60);
    },

    clearMoonCake: function (cakeInterval, cakeElement) {
        clearInterval(cakeInterval);
        ActivityDeliverMoonCake.removeElement(cakeElement);
        ActivityDeliverMoonCake.createMoonCake();
    },

    randomCakeLeft: function () {
        var index = LMActivity.func.getRandomInt(ActivityDeliverMoonCake.moonCakePosition.length - 1);
        return ActivityDeliverMoonCake.moonCakePosition[index];

    },

    getCurrentScore: function () {
        return ActivityDeliverMoonCake.currentScore;
    },

    // ------ 网络请求处理 ------
    /**
     *  上传活动游戏次数成功
     */
    uploadRecordSuccess: function () {
        //判断当前积分分别显示不同弹窗
        LMActivity.showDialog(ActivityDeliverMoonCake.gameConfig);
    },
    /**
     *  上传活动游戏次数失败
     */
    uploadRecordFail: function () {
        // 弹出提示，上传积分失败
        LMEPG.UI.showToast("活动记录失败，请稍后重试", 1);
    },
    /**
     *  保存积分成功
     */
    updateScoreSuccess: function () {
        //判断当前积分分别显示不同弹窗
        if (ActivityDeliverMoonCake.getCurrentScore() >= 10) {
            // 当前游戏积分大于10
            LMActivity.showDialog(ActivityDeliverMoonCake.gameSuccessConfig);
        } else {
            // 当前游戏积分小于10
            LMActivity.showDialog(ActivityDeliverMoonCake.gameFailConfig);
        }
    },
    /**
     *  保存积分失败
     */
    updateScoreFail: function () {
        // 弹出提示，上传积分失败
        LMEPG.UI.showToast("上传积分失败", 1, function () {
            // 刷新当前页面
            LMActivity.intent.reload();
        });
    },
    /**
     * 抽奖成功
     * @param data 接口返回数据
     */
    lotterySuccess: function (data) {
        // 保存当前获奖的奖品Id
        LMActivity.prizeId = data.prize_idx;
        // 隐藏当前显示页面
        H('lottery-success');
        // 显示抽奖成功页面
        LMActivity.showDialog(LMActivity.lotterySuccessConfig);
    },
    /**
     *  抽奖失败
     */
    lotteryFail: function () {
        // 隐藏当前显示页面
        H('lottery-success');
        // 显示抽奖失败页面
        LMActivity.showDialog(LMActivity.lotteryFailConfig);
    },

    removeElement: function (_element) {
        var _parentElement = _element.parentNode;
        if (_parentElement) {
            _parentElement.removeChild(_element);
        }
    }
};