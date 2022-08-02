
/****************************************************************
 * 全局控制变量声明
 *****************************************************************/
var isDetainPageShowing = false;    // 挽留页（Detain Page）显示标志

function onBack() {
  LMEPG.Log.error("::::::按返回键了");
  if (isDetainPageShowing) {
    LMEPG.Intent.back();
  } else {
    UIPlayer.PlayStatus.pausePlaying();
  }

}


/****************************************************************
 * 页面跳转控制
 *****************************************************************/
var Page = {
  /** 得到当前页对象 */
  getCurrentPage: function () {
    var objCurrent = LMEPG.Intent.createIntent("player");
    objCurrent.setParam("userId", RenderParam.userId);
    objCurrent.setParam("videoInfo", JSON.stringify(RenderParam.videoInfo));
    return objCurrent;
  },

  /** 页面跳转 - 播放器 */
  jumpPlayVideo: function (videoInfo) {
    var objCurrent = this.getCurrentPage();

    var objPlayer = LMEPG.Intent.createIntent("player");
    objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));

    LMEPG.Intent.jump(objPlayer, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
  },

  /**
   * 页面跳转 -  购买vip页
   * @param remark
   */
  jumpBuyVip: function (remark, videoInfo) {
    var objCurrent = this.getCurrentPage();

    var objOrderHome = LMEPG.Intent.createIntent("orderHome");
    objOrderHome.setParam("userId", RenderParam.userId);
    objOrderHome.setParam("isPlaying", "1");
    objOrderHome.setParam("remark", remark);

    LMEPG.Intent.jump(objOrderHome, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
  }
};

/****************************************************************
 * 全局常量声明。说明：C表示Const常量。
 *****************************************************************/
var C = {
  /** 图片 */
  Pic: {
    // 挽留页面相关图标
    replay: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/Replay.png',                             // “重播”：无焦点
    replay_focus: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/ReplayFocus.png',                  // “重播”：有焦点
    resume_replay: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/ResumePlay.png',                  // “继续播放”：无焦点
    resume_replay_focus: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/ResumePlayFocus.png',       // “继续播放”：有焦点
    collect: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/Collect.png',                           // “收藏”：无焦点
    collect_focus: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/CollectFocus.png',                // “收藏”：有焦点
    no_collect: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/NoCollect.png',                      // “取消收藏”：无焦点
    no_collect_focus: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/NoCollectFocus.png',           // “取消收藏”：有焦点
  },

  /** 常用控件id */
  ID: {
    play_indicator_container: 'play-indicator-container', // 播放、暂停、倍速父容器
    play_indicator_img: 'play-indicator-bg',        // 播放、暂停、倍速图标
    play_indicator_text: 'play-indicator-text',     // 倍速显示文本
  },

  /** 按钮功能类型 */
  FuncType: {
    REPLAY: "replay",                   // 重播
    RESUME: "resume",                   // 继续播放
    COLLECT: "collect",                 // 收藏
    NO_COLLECT: "no_collect",           // 取消收藏
    EXIT: "exit",                       // 退出
    RECOMMEND_VIDEO: "recommend_video"  // 推荐视频
  },

  /** 方向标识，请勿修改！ */
  Dir: {
    UP: "up",                           // 上
    DOWN: "down",                       // 下
    LEFT: "left",                       // 左
    RIGHT: "right"                      // 右
  }
};


/****************************************************************
 * 焦点保持控制（记录挽留页第1、2排的焦点状态）
 *****************************************************************/
var FocusKeeper = {
  lastFocusedBtnIdOfLine1: 'focus-1-1',       // 离开第1排前的焦点按钮，默认为第1个
  lastFocusedBtnIdOfLine2: 'focus-2-1',       // 离开第2排前的焦点按钮，默认为第1个
  record: function (currentFocusedBtnId) {   // 记录当前的焦点按钮id
    if (currentFocusedBtnId) {
      if (currentFocusedBtnId.startWith('focus-1')) {
        this.lastFocusedBtnIdOfLine1 = currentFocusedBtnId;
      } else if (currentFocusedBtnId.startWith('focus-2')) {
        this.lastFocusedBtnIdOfLine2 = currentFocusedBtnId;
      }
    }
  }
};


/****************************************************************
 * 按键监听控制
 *****************************************************************/
var PlayerKeyEventManager = {
  /** 返回上一页 */
  jumpBack: function () {
    LMEPG.Intent.back();
  },
  /** 上键。*/
  onKeyUp: function (currentBtnObj) {
    switch (currentBtnObj.id) {
      case "default_link":
        UIPlayer.ProgressUIHandler.show();
        break;
      default:
        if (currentBtnObj.id.startWith('focus-2')) {
          LMEPG.ButtonManager.requestFocus(FocusKeeper.lastFocusedBtnIdOfLine1);
        }
        break;
    }

  },

  /** 下键。*/
  onKeyDown: function (currentBtnObj) {
    switch (currentBtnObj.id) {
      case "default_link":
        UIPlayer.ProgressUIHandler.show();
        break;
      default:
        if (currentBtnObj.id.startWith('focus-1')) {
          LMEPG.ButtonManager.requestFocus(FocusKeeper.lastFocusedBtnIdOfLine2);
        }
        break;
    }

  },

  /** 左键。*/
  onKeyLeft: function (currentBtnObj) {
    switch (currentBtnObj.id) {
      case "default_link":
        UIPlayer.ProgressUIHandler.show();
        break;
      default:
        break;
    }
  },

  /** 右键。*/
  onKeyRight: function (currentBtnObj) {
    switch (currentBtnObj.id) {
      case "default_link":
        UIPlayer.ProgressUIHandler.show();
        break;
      default:
        break;
    }
  },

  /** “确定”按键 */
  onEnterKeyClicked: function () {
    var focusBtnObj = LMEPG.ButtonManager.getCurrentButton();
    ButtonAction.onClick(focusBtnObj);
  },

  /** “上/下/左/右”按键。dir必为之一：up/down/left/right */
  onDirectionKeyMoved: function (dir) {
    if (isDetainPageShowing) {  // 暂停状态：弹出挽留页。使用框架内部统一处理挽留页按钮移动焦点行为。
      LMEPG.ButtonManager._onMoveChange(dir);
    } else {                // 播放状态：非挽留页。根据需要自定义行为。
    }
  },

  /** 重播 或 继续播放 */
  resumeOrReplay: function (btn) {
    if (btn.funcType === C.FuncType.RESUME) {
      UIPlayer.ProgressUIHandler.hide(); //隐藏进度条
      UIPlayer.PlayStatus.togglePlayerState();
    } else {
      window.location.reload();
    }
  },

  /** 点击播放挽留页推荐视频之一 */
  playVideo: function (btn) {
    // 加强判断处理：非点击挽留页推荐视频，拒绝播放
    if (!isDetainPageShowing) {
      console.log("-------playVideo(btn)------->>> 非挽留页推荐视频点击，拒绝操作！");
      return;
    }
    // 按钮对象无效：拒绝播放
    if (typeof btn === 'undefined' || btn == null) {
      console.log("-------playVideo(btn)------->>> invalid button，拒绝操作！");
      return;
    }

    var btnId = btn.id;
    if (btnId.startWith('focus-1')) {
      //得到播放地址
      var videoInfo = {
        "sourceId": G(btnId).getElementsByTagName("img")[0].getAttribute('sourceId'),
        "videoUrl": G(btnId).getElementsByTagName("img")[0].getAttribute('gqPlayUrl'),
        "title": G(btnId).getElementsByTagName("img")[0].getAttribute('title'),
        "type": "",
        "userType": G(btnId).getElementsByTagName("img")[0].getAttribute('user_type'),
        "freeSeconds": G(btnId).getElementsByTagName("img")[0].getAttribute('freeSeconds'),
        "entryType": 1,
        "entryTypeName": "play",
        "show_status": G(btnId).getElementsByTagName("img")[0].getAttribute('show_status'),
      };
      //视频专辑下线处理
      if(videoInfo.show_status == "3") {
        LMEPG.UI.showToast('该节目已下线');
        return;
      }
      if (!videoInfo.userType && !videoInfo.sourceId) {
        LMEPG.UI.showToast("播放错误：无效的视频资源！");
        return;
      }
      //=================================================================//
      //  视频的播放策略（userType：0-不限，1-普通用户可看, 2-vip可看）  //
      //=================================================================//
      LMEPG.Log.info("play recommend videoInfo:" + JSON.stringify(videoInfo));
      if (UIPlayer.allowPlayVideo(videoInfo)) {
        // 直接播放推荐视频
        Page.jumpPlayVideo(videoInfo);
      } else {
        // 如果isForbidOrder = 1，表示不允许订购，直接返回
        if (RenderParam.isForbidOrder == '1') {
          LMEPG.UI.showToast("您已受限订购该业务，暂时不能订购!", 3);
          window.setTimeout(function () {
            LMEPG.Intent.back();
          }, 3000);
        } else {
          // “非VIP用户” 且 “仅限VIP用户” 且 “免费试看时长为0”，则直接跳转到VIP限制订购
          Page.jumpBuyVip(videoInfo.title, videoInfo);
        }
      }
    }
  },

};

/****************************************************************
 * Button事件
 *****************************************************************/
var ButtonAction = {
  beforeMoveChange: function (dir, current) {
    console.log("--------beforeMoveChange---" + current.id + ", " + dir);
    switch (dir) {
      case C.Dir.LEFT:
        PlayerKeyEventManager.onKeyLeft(current);
        break;
      case C.Dir.RIGHT:
        PlayerKeyEventManager.onKeyRight(current);
        break;
      case C.Dir.UP:
        PlayerKeyEventManager.onKeyUp(current);
        break;
      case C.Dir.DOWN:
        PlayerKeyEventManager.onKeyDown(current);
        break;
    }
  },

  onFocusChange: function (btn, hasFocus) {
    console.log("--------onFocusChange---" + btn.id + ", " + hasFocus);
    // PlayerFocus.hasFocus(btn, hasFocus);
    if (hasFocus) {
      switch (btn.id) {
        case "focus-1-1":
          Show("img1-border");
          break;
        case "focus-1-2":
          Show("img2-border");
          break;
        case "focus-1-3":
          Show("img3-border");
          break;
        default:
          PlayerFocus.hasFocus(btn, hasFocus);
          break;
      }
    } else {
      switch (btn.id) {
        case "focus-1-1":
          Hide("img1-border");
          break;
        case "focus-1-2":
          Hide("img2-border");
          break;
        case "focus-1-3":
          Hide("img3-border");
          break;
        default:
          PlayerFocus.hasFocus(btn, hasFocus);
          break;
      }
    }
    // 上一次的焦点保持记录
    if (isDetainPageShowing && hasFocus) {
      FocusKeeper.record(btn.id);
    }
  },


  onClick: function (btn) {
    switch (btn.id) {
      case "default_link":
        if (RenderParam.isVip != 1 && parseInt(RenderParam.userType) == 2) {
          Page.jumpBuyVip(RenderParam.videoTitle, RenderParam.videoInfo);
        }else {
          UIPlayer.PlayStatus.togglePlayerState();
        }
        break;
      // 挽留页1-4推荐位
      case 'focus-1-1':
      case 'focus-1-2':
      case 'focus-1-3':
        PlayerKeyEventManager.playVideo(btn);
        break;
      // 挽留页底部按钮：重播/继续播放、收藏/取消收藏、退出
      case 'focus-2-1':
        UIPlayer.replay(btn);

        break;
      case 'focus-2-2':
        var expectedStatus = RenderParam.collectStatus == 1 ? 0 : 1;  //改变收藏状态
        UIPlayer.setCollectStatus(RenderParam.sourceId, expectedStatus);
        break;
      case 'focus-2-3':
        PlayerKeyEventManager.jumpBack();
        break;
    }
  }
};

var buttons = [
  {
    id: 'default_link',
    name: '默认焦点',
    type: 'img',
    nextFocusLeft: "",
    nextFocusRight: '',
    nextFocusUp: '',
    nextFocusDown: '',
    backgroundImage: "",
    focusImage: "",
    click: ButtonAction.onClick,
    focusChange: "",
    beforeMoveChange: ButtonAction.beforeMoveChange,
  }, {
    id: 'focus-1-1',
    name: '挽留页-推荐位1',
    type: 'div',
    focusable: true,
    backgroundImage: '',
    focusImage: '',
    nextFocusLeft: 'focus-1-3',//从第1个推荐视频，继续按左键循环移动到最右第4个推荐视频位上
    nextFocusUp: '',
    nextFocusRight: 'focus-1-2',
    nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
    beforeMoveChange: ButtonAction.beforeMoveChange,
    focusChange: ButtonAction.onFocusChange,
    click: ButtonAction.onClick,
    funcType: C.FuncType.RECOMMEND_VIDEO,
    dataObj: null//推荐视频对象
  },
  {
    id: 'focus-1-2',
    name: '挽留页-推荐位2',
    type: 'div',
    focusable: true,
    backgroundImage: '',
    focusImage: '',
    nextFocusLeft: 'focus-1-1',
    nextFocusUp: '',
    nextFocusRight: 'focus-1-3',
    nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
    beforeMoveChange: ButtonAction.beforeMoveChange,
    focusChange: ButtonAction.onFocusChange,
    click: ButtonAction.onClick,
    funcType: C.FuncType.RECOMMEND_VIDEO,
    dataObj: null//推荐视频对象
  },
  {
    id: 'focus-1-3',
    name: '挽留页-推荐位3',
    type: 'div',
    focusable: true,
    backgroundImage: '',
    focusImage: '',
    nextFocusLeft: 'focus-1-2',
    nextFocusUp: '',
    nextFocusRight: 'focus-1-1',
    nextFocusDown: FocusKeeper.lastFocusedBtnIdOfLine2,
    beforeMoveChange: ButtonAction.beforeMoveChange,
    focusChange: ButtonAction.onFocusChange,
    click: ButtonAction.onClick,
    funcType: C.FuncType.RECOMMEND_VIDEO,
    dataObj: null//推荐视频对象
  },
  {
    id: 'focus-2-1',
    name: '挽留页-重播/继续播放',
    type: 'img',
    focusable: true,
    backgroundImage: '', //动态更新值
    focusImage: '', //动态更新值
    nextFocusLeft: 'focus-2-3',//从第1个按钮，继续按左键循环移动到最右第3个按钮上
    nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
    nextFocusRight: 'focus-2-2',
    nextFocusDown: '',
    beforeMoveChange: ButtonAction.beforeMoveChange,
    focusChange: ButtonAction.onFocusChange,
    click: ButtonAction.onClick,
    funcType: C.FuncType.RESUME //自定义属性
  },
  {
    id: 'focus-2-2',
    name: '挽留页-收藏/取消收藏',
    type: 'img',
    focusable: true,
    backgroundImage: '', //动态更新值
    focusImage: '', //动态更新值
    nextFocusLeft: 'focus-2-1',
    nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
    nextFocusRight: 'focus-2-3',
    nextFocusDown: '',
    beforeMoveChange: ButtonAction.beforeMoveChange,
    focusChange: ButtonAction.onFocusChange,
    click: ButtonAction.onClick,
    funcType: C.FuncType.COLLECT //自定义属性
  },
  {
    id: 'focus-2-3',
    name: '挽留页-退出',
    type: 'img',
    focusable: true,
    backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/Exit.png',
    focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Player/V10/ExitFocus.png',
    nextFocusLeft: 'focus-2-2',
    nextFocusUp: FocusKeeper.lastFocusedBtnIdOfLine1,
    nextFocusRight: 'focus-2-1',//从第3个按钮，继续按右键循环移动到最左第1个按钮上
    nextFocusDown: '',
    beforeMoveChange: ButtonAction.beforeMoveChange,
    focusChange: ButtonAction.onFocusChange,
    click: ButtonAction.onClick,
    funcType: C.FuncType.EXIT //自定义属性
  }
];

/**
 * 播放器界面相关
 */
UIPlayer = {
  isSitcomPlay: false,   //是否是连续剧播放形式
  videoDuration: 0,                                                // 视频总时长
  progressWidth: 888,
  uiTimer: null,
  currentSeekSecond: -1,                                           // 当前seek的秒数，只要>=0就表示正在seek
  indicatorWidth: 40,                                              // 进度条指示器的宽度
  replay: function (btn) {
    if (UIPlayer.isSitcomPlay) {
      var tempVideoInfo = RenderParam.albumArr[0];
      UIPlayer.playNextVideo(tempVideoInfo);
    } else {
      PlayerKeyEventManager.resumeOrReplay(btn);
    }
  },
  showPlayEnd: function () {
    UIPlayer.log("registerCallback::end");
    clearInterval(this.uiTimer);
    LMEPG.mp.destroy();
    UIPlayer.initPlayOrReplay(1);                         // 创建重播按钮
    UIPlayer.setVisibilityForDetainPageUI(true); // 隐藏更多显示，防止已进入就显示
  },
  playNextVideo: function (videoInfo) {
    var objCurrent = LMEPG.Intent.createIntent("player");
    var objPlayer = LMEPG.Intent.createIntent("player");
    objPlayer.setParam("userId", RenderParam.userId);
    objPlayer.setParam("videoInfo", JSON.stringify(videoInfo));
    objPlayer.setParam("subjectId", RenderParam.subjectId);
    LMEPG.Intent.jump(objPlayer, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
  },
  finishPlay: function () {
    if (RenderParam.albumArr.length > 0) {
      UIPlayer.isSitcomPlay = true;
    } else {
      UIPlayer.showPlayEnd();
    }
    var tempNextVideoInfo;
    for (var index = 0; index < RenderParam.albumArr.length; index++) {
      var tempVideoInfo = RenderParam.albumArr[index];
      if (RenderParam.videoInfo.sourceId === tempVideoInfo.sourceId) {
        var tempIndex = index + 1;
        if (tempIndex >= RenderParam.albumArr.length) {  //连续剧播放结束
          UIPlayer.showPlayEnd();
        } else {
          tempNextVideoInfo = RenderParam.albumArr[tempIndex];
          UIPlayer.playNextVideo(tempNextVideoInfo);
        }
        break;
      }
    }

  },
  //显示播放下一集提示信息
  showNextTips: function () {
    for (var index = 0; index < RenderParam.albumArr.length; index++) {
      var tempVideoInfo = RenderParam.albumArr[index];
      if (RenderParam.videoInfo.sourceId === tempVideoInfo.sourceId) {
        if (index < RenderParam.albumArr.length - 1) {
          LMEPG.UI.showToast("即将为您自动播放下一集", 5);
        }
        break;
      }
    }
  },
  init: function () {
    LMEPG.mp.registerCallback(function () {
      UIPlayer.log("registerCallback::begin");
    }, function () {
      UIPlayer.finishPlay();
    });
    LMEPG.mp.getUrl(RenderParam.videoUrl, function (url) {
      LMEPG.mp.initPlayer(url, 0, 0, 1280, 720);
    });
    UIPlayer.ProgressUIHandler.start();
    UIPlayer.initPlayOrReplay(0); // 初始化渲染 “继续播放/重播”相关控件
    UIPlayer.initCollectOrNot(RenderParam.collectStatus); // 初始化渲染 “收藏/取消收藏”相关控件
    UIPlayer.initRecommendVideoInfo(RenderParam.userId); // 加载数据并初始化渲染 “推荐视频1-4”相关控件
    UIPlayer.setVisibilityForDetainPageUI(false); // 隐藏更多显示，防止已进入就显示
    UIPlayer.PlayTips.show();

  },
  log: function (msg) {
    LMEPG.Log.error("UIPlayer::" + msg);
  },
  PlayStatus: {
    // 当前播放状态：play | pause
    curPlayerState: 'play',
    // 播放
    resume: function () {
      LMEPG.mp.resume();
    },
    // 暂停
    pause: function () {
      LMEPG.mp.pause();
    },
    //定时校验是否存在挽留页，如果存在，则暂停播放
    checkStatus: function () {
      if (isDetainPageShowing) {
        LMEPG.mp.pause();
      }
    },
    // 暂停正在播放
    pausePlaying: function () {
      UIPlayer.ProgressUIHandler.hide(); // 隐藏进度条
      this.togglePlayerState();
      LMEPG.ButtonManager.requestFocus('focus-2-1');
    },
    // 点击确认键播放或者暂停
    togglePlayerState: function () {
      if (this.curPlayerState === 'play') {
        this.curPlayerState = 'pause';
        LMEPG.mp.pause();
      } else if (this.curPlayerState === 'pause') {
        this.curPlayerState = 'play';
        LMEPG.mp.resume();
      }
      this.refreshPlayState(); // 统一刷新是否显示挽留页
    },
    // 刷新播放状态
    refreshPlayState: function () {
      if (this.curPlayerState === 'pause') {
        UIPlayer.setVisibilityForDetainPageUI(true);
      } else if (this.curPlayerState === 'play') {
        UIPlayer.setVisibilityForDetainPageUI(false);
      }
    }
  },
  /**
   * 进度条相关操作
   **/
  ProgressUIHandler: {
    isProgressShow: false,                                          // 进度条是否显示
    autoHideProgressTimer: null,                                    // 自动隐藏进度条定时器
    AUTO_HIDE_PROGRESS_TIME: 5 * 1000,                               // 自动隐藏菜单的时间，单位毫秒
    /** 启动进度条计时器 */
    start: function () {
      UIPlayer.ProgressUIHandler.show();
      //进入页面时，视频需要一定的加载时间
      setTimeout(function () {
        UIPlayer.ProgressUIHandler.onProgress();
        UIPlayer.uiTimer = setInterval(function () {
          UIPlayer.PlayStatus.checkStatus();
          UIPlayer.ProgressUIHandler.onProgress();
          if (RenderParam.isVip != 1) {
            UIPlayer.ProgressUIHandler.checkFreeTime();
          }
        }, 1000);//1秒刷新一次
      }, 1000);
    },
    /** 显示进度条 */
    show: function () {
      this.isProgressShow = true;
      Show('playUI');// 进度条外圈UI
      this.restart();
    },

    /** 隐藏进度条 */
    hide: function () {
      this.isProgressShow = false;
      Hide('playUI');//进度条外圈UI
      if (this.autoHideProgressTimer) clearTimeout(this.autoHideProgressTimer);
    },
    /** 播放菜单重新开始计时 */
    restart: function () {
      if (this.autoHideProgressTimer) clearTimeout(this.autoHideProgressTimer);
      this.autoHideProgressTimer = setTimeout(function () {
        UIPlayer.ProgressUIHandler.hide();
      }, this.AUTO_HIDE_PROGRESS_TIME);//3秒钟后自动隐藏
    },
    /** 进度条回调接口 */
    onProgress: function () {
      // 取出“视频总时长、当前已播放时长”
      var mpTimes = this.getTimesArray();
      var totalDuration = mpTimes[0];
      var curPlayTime = mpTimes[1];
      var tempDuration = totalDuration - curPlayTime;
      // LMEPG.Log.error("tempDuration=::" + tempDuration);
      if (tempDuration === 5 && curPlayTime > 1) {
        UIPlayer.showNextTips();
      }
      if (curPlayTime > totalDuration && curPlayTime > 5) {      //修复获取当前时间过长，导致进度条显示异常
        return;
      }
      if (curPlayTime > totalDuration && curPlayTime > 30) {
        clearInterval(this.uiTimer);
        return;
      }
      var pTime = LMEPG.Func.formatTimeInfo(1, curPlayTime);//设置当前播放时间
      // 显示“当前时长:总时长”
      if (!UIPlayer.videoDuration) {
        UIPlayer.videoDuration = totalDuration;
      }
      var totalTime = LMEPG.Func.formatTimeInfo(1, totalDuration);
      if (totalTime === "32335:05") {
        return;
      }
      G('totaltime').innerHTML = totalTime; //设置总时长
      if (pTime === '0-1:0-1') {
        return; //表示读时间进度有问题，不给予更新时间
      }
      G('ptime').innerHTML = pTime;

      // 更新进度条UI比例效果
      var rate = UIPlayer.ProgressUIHandler.getPlayRate();       //当前播放的比例，取值0-1
      var progressLength = rate * UIPlayer.progressWidth;//进度条的长度
      if (UIPlayer.currentSeekSecond < 0) {
        G('fill').style.width = progressLength + 'px';
        if (progressLength > UIPlayer.indicatorWidth / 2) {
          G('ball').style.left = (progressLength - UIPlayer.indicatorWidth / 2) + 'px';
        }
      }

    },
    /**
     * 实时获取当前“视频总时长、当前已播放时长”。注意：每个值为>=0的number类型。
     * @return {*[]} [视频总时长, 当前已播放时长]
     */
    getTimesArray: function () {
      var duration = LMEPG.mp.getMediaDuration();
      var currentPlayTime = LMEPG.mp.getCurrentPlayTime();

      // 强转数据类型。
      // 特别注意：盒子底层播放器MediaPlayer.getCurrentPlayTime()和MediaPlayer.getMediaDuration()返回可能是"string"
      // 类型，例如："25"。
      // 所以，若我们应用层要将其作为一个"number"类型来处理，比如：相加、比较大小等操作，我们需要强转
      if (typeof duration === 'string') {
        var durationTemp = parseInt(duration + "");
        if (!isNaN(durationTemp)) duration = durationTemp;
      }
      if (typeof currentPlayTime === 'string') { // 目前检测到：LMEPG.mp.getCurrentPlayTime()可能为"string"
        var currentPlayTimeTemp = parseInt(currentPlayTime + "");
        if (!isNaN(currentPlayTimeTemp)) currentPlayTime = currentPlayTimeTemp;
      }
      return [duration, currentPlayTime];
    },
    /** 获取播放总进度比例，返回介于0-1之间的小数 */
    getPlayRate: function () {
      var timeArray = UIPlayer.ProgressUIHandler.getTimesArray();
      var duration = timeArray[0];
      var currentPlayTime = timeArray[1];
      return duration > 0 && currentPlayTime >= 0 ? currentPlayTime / duration : 0;
    },
    /**
     * 当用户为非vip(RenderParam.isVip=0/1表示VIP)且只有vip(RenderParam.userType==2)才可看时：
     * 检测免费时长，如果免费时长到了，就直接跳到局方计费页
     */
    checkFreeTime: function () {
      // 如果视频是vip才可以看，否则要判断免费播放时长。（userType：（0-不限，1-普通用户可看, 2-vip可看））
      if (parseInt(RenderParam.userType) == 2) {
        var tempCurrentTime = LMEPG.mp.getCurrentPlayTime();
        if (tempCurrentTime >= RenderParam.freeSeconds) {
          LMEPG.mp.destroy();
          if (RenderParam.isForbidOrder == '1') {   // 如果isForbidOrder = 1，表示不允许订购，直接返回
            LMEPG.UI.showToast("您已受限订购该业务，暂时不能订购!", 3);
            window.setTimeout(function () {
              LMEPG.Intent.back();
            }, 3000);
          } else {
            Page.jumpBuyVip(RenderParam.videoInfo.title, RenderParam.videoInfo);
          }
        }
      }
    },
  },
  //确定订购图标显示操作
  PlayTips: {
    show: function () {
      if (RenderParam.isVip != 1 && parseInt(RenderParam.userType) == 2) {
        Show("tips");
      }
    },
    hide: function () {
      Hide("tips");
    }
  },

  /**
   * 创建  重播/继续播放  按钮
   * @param isPlayEnd 0-继续播放 1-重播
   */
  initPlayOrReplay: function (isPlayEnd) {
    var div1 = G('div1');
    var isReplayStatus = isPlayEnd == 1; // 是否变更为“重播”状态

    var textId = isReplayStatus ? "replaytext" : "resumeplay";
    var text = isReplayStatus ? "重播" : "继续播放";
    var initImgSrc = isReplayStatus ? C.Pic.replay : C.Pic.resume_replay;
    var leftMargin = '323px';
    div1.innerHTML = '<img id="focus-2-1" class="navimg" style="left:' + leftMargin + '" src="' + initImgSrc + '"/>';

    // 按钮属性赋值
    buttons[4].name = text;
    buttons[4].backgroundImage = isReplayStatus ? C.Pic.replay : C.Pic.resume_replay;
    buttons[4].focusImage = isReplayStatus ? C.Pic.replay_focus : C.Pic.resume_replay_focus;
    buttons[4].funcType = isReplayStatus ? C.FuncType.REPLAY : C.FuncType.RESUME;
  },

  /**
   * 判断当前用户是否可以直接观看指定视频（包括试看），如果不能需要先去订购VIP。
   *  播放规则：
   *  1.userType=2（仅vip可看）：
   *      (1)VIP:可直接播放观看。
   *      (2)普通会员：免费观看时长:freeSeconds>0可播放。freeSeconds<=0直接跳转订购。
   *  2. userType=0（不限用户）或userType=1（至少是普通用户条件）:可直接免费观看，没有试看一说。
   */
  allowPlayVideo: function (videoInfo) {
    if (RenderParam.isVip) {    // vip用户可播放观看
      return true;
    } else {        // 非vip用户可播放观看的前提是：不限vip用户 或者 有免费试看时长
      var isOnlyVIPPlay = videoInfo.userType == 2; // 0-不限，1-普通用户可看，2-仅限VIP用户可看（普通用户需要检查免费时长）
      return !isOnlyVIPPlay || videoInfo.freeSeconds > 0;
    }
  },
  /**
   * 创建  收藏/取消收藏  按钮
   * @param collectStatus 变更当前的收藏状态 0-已收藏 1-未收藏
   */
  initCollectOrNot: function (collectStatus) {
    var div2 = G('div2');
    var isCurrentCollectStatus = collectStatus == 0; // 当前是否为“已收藏”状态（注：UI上显示应该是取反的！）

    var textId = isCurrentCollectStatus ? "collecttext" : "nocollecttext";
    var text = isCurrentCollectStatus ? "取消收藏" : "收藏";
    var initImgSrc = isCurrentCollectStatus ? C.Pic.collect : C.Pic.no_collect;
    var leftMargin = '583px';

    div2.innerHTML = '<img id="focus-2-2" class="navimg" style="left:' + leftMargin + '" src="' + initImgSrc + '"/>';

    // 按钮属性赋值
    buttons[5].name = text;
    buttons[5].backgroundImage = isCurrentCollectStatus ? C.Pic.collect : C.Pic.no_collect;
    buttons[5].focusImage = isCurrentCollectStatus ? C.Pic.collect_focus : C.Pic.no_collect_focus;
    buttons[5].funcType = isCurrentCollectStatus ? C.FuncType.COLLECT : C.FuncType.NO_COLLECT;
  },
  /**
   * 加载推荐位视频数据（即挽留页显示的1-4号位视频数据）
   * @param userId 当前用户id
   */
  initRecommendVideoInfo: function (userId) {
    // debug2('Player.initRecommendVideoInfo(' + userId + ')');
    var postData = {
      "userId": userId
    };
    LMEPG.ajax.postAPI('Player/getRecommendVideoInfo', postData, function (rsp) {
      // 请求成功
      try {
        var gqPlayUrl = {};
        var bqPlayUrl = {};
        var title = {};
        var image_url = {};
        var userType = {};
        var sourceId = {};
        var freeTimes = {};
        var show_status = {};

        var recommendData = rsp instanceof Object ? rsp : JSON.parse(rsp);
        if (LMEPG.Func.isObject(recommendData)) {
          if (!LMEPG.Func.isArray(recommendData.data) || recommendData.data.length <= 0) {
            return;
          }

          for (var i = 0; i < recommendData.data.length; i++) {
            if (i > 2) {
              break;
            }
            gqPlayUrl[i] = eval('(' + recommendData.data[i].ftp_url + ')').gq_ftp_url;
            bqPlayUrl[i] = eval('(' + recommendData.data[i].ftp_url + ')').bq_ftp_url;
            title[i] = recommendData.data[i].title;
            image_url[i] = recommendData.data[i].image_url;
            userType[i] = recommendData.data[i].user_type;
            sourceId[i] = recommendData.data[i].source_id;
            freeTimes[i] = recommendData.data[i].free_seconds;
            show_status[i] = recommendData.data[i].show_status;
            G('img' + i).src = RenderParam.imgHost + image_url[i];
            G('img' + i).setAttribute('gqPlayUrl', gqPlayUrl[i]);
            G('img' + i).setAttribute('bqPlayUrl', bqPlayUrl[i]);
            G('img' + i).setAttribute('user_type', userType[i]);
            G('img' + i).setAttribute('sourceId', sourceId[i]);
            G('img' + i).setAttribute('title', title[i]);
            G('img' + i).setAttribute('freeSeconds', freeTimes[i]);
            G('img' + i).setAttribute('show_status', show_status[i]);

            // 按钮属性赋值
            buttons[i].funcType = C.FuncType.RECOMMEND_VIDEO;
            buttons[i].dataObj = recommendData.data[i];
          }
        } else {
          throw 'The parsed result "RecommendData" is not an Object!';
        }
      } catch (e) {
        console.error("推荐视频数据处理异常：" + e.toString());
        LMEPG.Log.error("推荐视频数据处理异常：" + e.toString());
        LMEPG.UI.showToast("推荐视频数据处理异常：" + e.toString());
      }
    }, function (rsp) {
      // 请求出错
    });
  },
  /**
   * 显示/隐藏 挽留页
   * @param show 显示还是隐藏“挽留页”。true | false
   */
  setVisibilityForDetainPageUI: function (show) {
    isDetainPageShowing = show;
    if (show) {
      Show('collectback');
      LMEPG.BM.requestFocus("focus-2-1");
      UIPlayer.PlayTips.hide();
    } else {
      Hide('collectback');
      LMEPG.BM.requestFocus("default_link");
      UIPlayer.PlayTips.show();
    }
  },
  // 收藏与取消收藏
  setCollectStatus: function (sourceId, expectedStatus) {
    var postData = {
      "source_id": sourceId,
      "status": expectedStatus
    };
    LMEPG.ajax.postAPI("Collect/setCollectStatus", postData, function (rsp) {
      // 请求成功
      try {
        var jsonObj = rsp instanceof Object ? rsp : JSON.parse(rsp);
        if (jsonObj && jsonObj.result == 0) {
          RenderParam.collectStatus = expectedStatus;
          UIPlayer.initCollectOrNot(RenderParam.collectStatus);
          //
          // 加强用户体验：
          // 如果在收藏/取消收藏过程中，用户就移动了按钮焦点。即：server响应时刻 > 用户变更当前收藏/取消收藏按钮焦点时刻，
          // 当server变更收藏状态响应时，若当前记录的焦点按钮还是自己本身，则强制requestFocus以更新最新的UI焦点状态！
          var currentFocusBtn = LMEPG.ButtonManager.getCurrentButton();
          if (currentFocusBtn && currentFocusBtn.id === 'focus-2-2') {
            LMEPG.ButtonManager.requestFocus('focus-2-2');
          }
        } else {
          LMEPG.UI.showToast((expectedStatus == 1 ? "取消收藏失败！" : "收藏失败！") + "[" + (jsonObj ? jsonObj.result : jsonObj) + "]");
        }
      } catch (e) {
        LMEPG.UI.showToast("发生异常，操作失败！");
        LMEPG.Log.error("-------setCollectStatus------- exception: " + e.toString());
      }
    }, function (rsp) {
      // 请求失败
    });
  }

};


window.onunload = function () {
  LMEPG.mp.destroy();
};
