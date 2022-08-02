<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html lang="en">
<head>
    <title>document title</title>
    <meta http-equiv="Expires" content="0">
    <meta http-equiv="Cache-Control" content="no-cache">
    <meta http-equiv="Pragma" content="no-cache">
    <meta charset="utf-8" name="page-view-size" content="<?php echo ($size); ?>">
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/common.css?t=<?php echo ($time); ?>"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Common/V13/dialog.css?t=<?php echo ($time); ?>"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Home/V13/home.css?t=<?php echo ($time); ?>"/>

    <!--第三方依赖库-->
    <script type="text/javascript" src="/Public/ThirdParty/js/json2.js?t=<?php echo ($time); ?>"></script>
    <!--全局渲染参数-->
    <script type="text/javascript">
        var rootPath = '';
        var RenderParam = {
            carrierId: '<?php echo ($carrierId); ?>', // 地区id
            areaCode: '<?php echo ($areaCode); ?>', // 省份地区码
            platformType: '<?php echo ($platformType); ?>', // 平台类型
            debug: '<?php echo ($debug); ?>', // 调试模式
            pageSize: '<?php echo ($size); ?>', // 页面尺寸
            stbModel: '<?php echo ($stbModel); ?>', // 盒子的型号
            fsUrl: '<?php echo ($resourcesUrl); ?>', // fs 地址
            time: '<?php echo ($time); ?>', // 开始渲染时间
            userId: '<?php echo ($userId); ?>', // 用户Id
            accountId: '<?php echo ($accountId); ?>', // 用户账号
            client: '<?php echo ($client); ?>', // 盒子CA卡号
            regionCode: '<?php echo ($regionCode); ?>', // 网关CA卡的区域码
            userType: '<?php echo ($userType); ?>', // 用户类型：老人型，儿童型
            isRunOnAndroid: '<?php echo ($isRunOnAndroid); ?>', // 是否运行在Android设备
            lmp: "<?php echo ($lmp); ?>",

            loginId: '<?php echo ($loginId); ?>', // 用户登录id
            positionTwoConfig: '<?php echo ($positionTwoConfig); ?>',
            checkTime: '<?php echo ($checkTime); ?>',
            commonImgsView: '<?php echo ($commonImgsView); ?>', // 公用图片模式
            themeImage: '<?php echo ($themePicture); ?>', // 应用主题背景
            thirdPlayerUrl: '<?php echo ($domainUrl); ?>', // 第三方播放器根路径地址
            focusIndex: '<?php echo ($focusIndex); ?>', // 焦点ID
            isVip: <?php echo ($isVip); ?>, // 用户是否是vip
            autoOrder: '<?php echo ($autoOrder); ?>', // 用户是否是续订vip
            classifyId: '<?php echo ($classifyId); ?>', // 导航栏ID
            navConfig: <?php echo ($navigateInfo); ?>, // 导航栏配置
            configInfo: <?php echo ($homeConfigInfo); ?>, // 主页配置信息
            videoPlayRank: <?php echo ($videoPlayRank); ?>, // Tab1热播榜
            videoClass: <?php echo ($videoClass); ?>, // Tab1视频栏目
            albumList: <?php echo ($albumList); ?>, // Tab2专辑列表
            homePollVideoList: <?php echo ($homePollVideoList); ?>, // 首页轮播的视频列表
            latestVideoInfo: <?php echo ($latestVideoInfo); ?>,  // 最近播放的视频
            accessInquiryInfo: <?php echo ($accessInquiryInfo11); ?>, // 是否能访问视频问诊,1--表示能访问
            tabBg: '<?php echo ($tabBg); ?>',
            helpTabInfo: <?php echo ($helpTabInfo); ?>, // 帮助提示幕布参数
            skin: <?php echo ($skin); ?>,      // 用户自定义背景
            showPayLock: <?php echo ($showPayLock); ?>, // 显示定购童锁 0-- 不显示童锁，1-- 显示童锁
            payLockStatus: "<?php echo ($payLockStatus); ?>", // 支付锁的状态，中国联通EPG
            isOrderBack: "<?php echo ($isOrderBack); ?>", // 是否为订购返回
            orderType: "<?php echo ($orderType); ?>", // 是否为订购返回
            cOrderResult: "<?php echo (cookie('c_order_result')); ?>",
            payMethod: <?php echo ($payMethod); ?>, // 促订设置
            partner: '<?php echo ($partner); ?>', // 用户是否是续订vip
            serverPath: '<?php echo ($serverPath); ?>', // 用户是否是续订vip
            setPageSizeState: '<?php echo ($setPageSizeState); ?>', // 是否需要设置页面的分辨率属性
            isEnterFromYsten: '<?php echo ($isEnterFromYsten); ?>',      // 是否从使用易视腾鉴权计费接口的入口进入（广东移动APK融合包）
            freeExperience:<?php echo ($freeExperience); ?>,                       // 免费体验状态
            isJoinActivit:'<?php echo ($isJoinActivit); ?>',                       // 是否是联合活动
        };

    </script>
    <?php if($carrierId == '410092' ): ?><!--河南电信EPG js文件-->
        <script type="text/javascript" src="/Public/ThirdParty/js/410092/vod_utils.js?t=<?php echo ($time); ?>"></script><?php endif; ?>

    <!--    <?php if(($carrierId) == "371092"): ?>-->
    <!--        &lt;!&ndash;海看（山东电信）EPG 数据探针js文件&ndash;&gt;-->
    <!--        <script type="text/javascript" src="/Public/ThirdParty/js/371092/haiKanProbe_1.0.1.min.js"></script>-->
    <!--<?php endif; ?>-->

    <!--公共库-->
    <script type="text/javascript" src="/Public/Common/js/lmcommon.js?t=<?php echo ($time); ?>"></script>
    <?php if(($isRunOnAndroid) == "1"): ?><script type="text/javascript" src="/Public/Common/js/android.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
    <script type="text/javascript" src="/Public/Common/js/lmui.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/Common/js/lmplayer.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/Common/js/lmauthEx.js?t=<?php echo ($time); ?>"></script>
    <?php if($carrierId == '450094' ): ?><!-- 广西广电小窗视频播放 -->
        <script type="text/javascript" src="http://10.1.15.25/webJS/gxgd.config.js?t=<?php echo ($time); ?>"></script>
        <script type="text/javascript" src="http://10.1.15.25/webJS/starcorCom.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
    <!--当前页所用自定义js-->
    <script type="text/javascript" src="/Public/js/Player/LMSmallPlayer.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/js/Dialog/Dialog.1.01.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/js/Home/V13/HelpModal.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/js/Home/V13/home.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/js/Home/V13/banner.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/js/Pay/lmPayFrame.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/js/Pay/lmOrderConf.js?t=<?php echo ($time); ?>"></script>
</head>
<body bgcolor="transparent">
<?php switch($carrierId): case "440001": ?><script type="text/javascript" src="/Public/js/Pay/V440001/PayYsten.js?t=<?php echo ($time); ?>"></script><?php break;?>
    <?php case "440004": ?><!--广东广电-纯WEB版本-->
        <script type="text/javascript" src="/Public/ThirdParty/js/440004/WebViewJavascriptBridge.js"></script>
        <script type="text/javascript" src="/Public/ThirdParty/js/440004/player.js"></script>
        <script type="text/javascript" src="/Public/ThirdParty/js/440004/jquery.min.js"></script><?php break;?>
    <?php case "450092": ?><script type="text/javascript"
                src="/Public/ThirdParty/js/450092/registerGlobalKey.js?t=<?php echo ($time); ?>"></script><?php break; endswitch;?>
<!--<?php if($carrierId == '371092' ): ?>-->
<!--    <script type="text/javascript" src="/Public/ThirdParty/js/371092/haikanCtAuthSDK_1.0.1.min.js"></script>-->
<!--    <script type="text/javascript" src="/Public/ThirdParty/js/371092/haiKanProbe_1.0.1.min.js"></script>-->
<!--<?php endif; ?>-->

<div id="debug"></div>

<?php if($carrierId == '430012' ): ?><img style="position: absolute;top: 26px;left: 45px" id="logo2"
         src="/Public/img/hd/Home/V13/Home/logo2.png"/><?php endif; ?>

<?php if($carrierId == '430002' ): ?><img style="position: absolute;top: 26px;left: 45px" id="logo4"
         src="/Public/img/hd/Home/V13/Home/logo-hunan.png"/><?php endif; ?>
<?php if($carrierId == '150002' ): ?><img style="position: absolute;top: 26px;left: 45px" id="logo3"
         src="/Public/img/hd/Home/V13/Home/logo-neimenggu.png"/><?php endif; ?>

<a href="#" id="default_link"><img class="grubFocusImg" src="/Public/img/Common/spacer.gif"/></a>

<!--头部导航-->
<div id="header-container">

    <!--    -->
    <?php if($carrierId == '320092'): ?><img id="logo-jsdx" src="/Public/img/hd/Home/V13/Home/logo_320092.png">
        <?php elseif($carrierId == '440004'): ?>
        <img id="logo-gddx" src="/Public/img/hd/Home/V13/Home/logo_440004.png">
        <?php elseif($carrierId == '640001'): ?>
        <img id="logo-nxdx" src="/Public/img/hd/Home/V13/Home/logo_640001.png"><?php endif; ?>

    <!--  顶部操作内容图标  -->
    <?php if($carrierId == '430002'): ?><div id="top-action-content-icons1">
            <img id="search" src="/Public/img/hd/Home/V13/Home/search1.png">
            <img id="vip" src="/Public/img/hd/Home/V13/Home/vip1.png">
            <img id="quit" src="/Public/img/hd/Home/V13/Home/quit.png">
            <div id="service-tel1">服务电话：4009900901</div>
        </div>
    <?php elseif($carrierId == '440004'): ?>
        <div id="top-action-content-icons">
            <img id="search" src="/Public/img/hd/Home/V13/Home/search1.png">
            <img id="vip" src="/Public/img/hd/Home/V13/Home/vip1.png">
        </div>
    <?php else: ?>
        <div id="top-action-content-icons">
            <?php if($carrierId == '320092'): ?><img id="life" style="position: relative;top: 3px" src="/Public/img/hd/Home/V13/Home/life.png"><?php endif; ?>
            <?php if(($carrierId != '371092') OR ($carrierId != '371002')): ?><img id="search" src="/Public/img/hd/Home/V13/Home/search_371092.png">
                <?php else: ?>
                <img id="search" src="/Public/img/hd/Home/V13/Home/search.png"><?php endif; ?>

            <?php if(($carrierId != '371092') OR ($carrierId != '371002')): ?><img id="vip" src="/Public/img/hd/Home/V13/Home/vip_371092.png">
                <?php else: ?>
                <img id="vip" src="/Public/img/hd/Home/V13/Home/vip.png"><?php endif; ?>
        </div><?php endif; ?>

    <!--    导航内容按钮 -->
    <div id="nav-content-tabs"></div>
</div>

<script type="text/javascript">
    var CARRIER_ID_SHANDONG_HICON = '371092'; // 山东电信海看项目区域id

    var thisNavID; // 跳转记录当前导航条焦点
    var navIsLeave; // 导航条是否离开
    var previousTabIndex; // 上一个导航焦点
    var isStartSmallVideo = false;
    var callbackOnce = true; // 声明执行一次函数
    var smallVideoTimer = null; // 小窗播放定时器
    var getJumpKeepFocusTabId = LMEPG.Func.getLocationString('tabId') || 'tab-0';  // 得到跳转页面回来的tab焦点
    var pathPrefix = g_appRootPath + '/Public/img/hd/Home/V13/Home/';

    /**
     * 宁夏电信移除帮助按钮
     */
    function hideHelpBtn(carrierId) {
        // if(carrierId == "640092") document.getElementById("help").remove();
    }

    hideHelpBtn(RenderParam.carrierId);

    function tabMoveUpdate(currentTabIndex) {
    }

    /**
     * 导航栏得失焦点回调操作
     */
    function tabGetFocus(btn, hasFocus) {
        var buttonId = btn.id;
        // 当前导航条的索引
        console.log("onFocusIn btn id = " + buttonId + "  hasFocus = " + hasFocus)
        var currentTabIndex = buttonId.slice(-1);
        if (hasFocus) {
            lazyLoad(currentTabIndex);
            // 启动当前内容块轮播
            startTimer(currentTabIndex);
            if (Tab0.hasSmallVideo) {
                // 重置小窗播放的内容块
                reBuildSmallVideo(currentTabIndex);
            }else  if(["650092","420092","410092","320092","450092","370092","371092","500092","620092",'150002'].indexOf(RenderParam.carrierId) !== -1 && (Tab0.hasSmallVideo == false)){
                //二号位兼容改版
                 Show("link-0");
            }
            // 调用内容块控制器
            tabContentController(currentTabIndex);
            // 设置不同内容块背景图
            setBodyBackgroundImage(currentTabIndex);
            // 初始化变量
            initializationVariable(btn);
            // 首次进入执行帮助图文
            HelpModal.showTabHelp(currentTabIndex);
        } else {
            tabLoseFocus(btn, currentTabIndex);
        }
        toggleFocus(btn, hasFocus);
    }

    /**
     * 各屏幕数据懒加载
     */
    function lazyLoad(index) {
        if (!eval('Tab' + index).isLoad) {
            eval('Tab' + index).init();
            eval('Tab' + index).isLoad = true;
            LMEPG.ButtonManager.init(this.tabId, buttons, '', true);
            if (index == 0) {
                if (Tab0.noSmallVideoArea.indexOf(RenderParam.carrierId) === -1) {
                    Hide('link-0');
                }
            }
        }
    }

    /**
     * 销毁/重启小窗播放
     */
    function reBuildSmallVideo(index) {
        clearInterval(smallVideoTimer);
        if (!+index) {
            if (index == previousTabIndex) return;
            // 每次加载Tab0页面，开启小窗播放
            if (isStartSmallVideo) return;
            isStartSmallVideo = true;
            Play.startPollPlay();
        } else {
            smallVideoTimer = setInterval(function () {
                LMEPG.mp.destroy();
                if (RenderParam.carrierId === '450094') {
                    iPanel.setGlobalVar("VOD_CTRL_STOP", "1");
                }
                if (RenderParam.isRunOnAndroid === '1') {
                    LMAndroid.hideSmallVideo();
                }
            }, 100);

            // 江苏电信华为盒子(EC6110T_pub_jssdx)释放小窗播放方式
            if (RenderParam.stbModel === 'EC6110T_pub_jssdx' ||
                RenderParam.stbModel === 'EC6108V9_pub_jssdx' ||
                RenderParam.stbModel == 'EC6110T_pub_gsgdx' ||
                RenderParam.stbModel == 'EC6108V9U_pub_gsgdx'
            ) {
                G('iframe_small_screen').src = g_appRootPath + '/Public/img/Common/spacer.gif';
            }
        }
    }

    /**
     * 内容块显隐控制器
     */
    function tabContentController(index) {
        var isShowDisplay = G('content-' + index).style.display;
        if (isShowDisplay === 'none' || !isShowDisplay) {
            Hide('content-' + previousTabIndex); // 隐藏上一个tabContent
            Show('content-' + index); // 显示当前tabContent
        }
    }

    /**
     * 导航栏失去焦点
     */
    function tabLoseFocus(btn, index) {
        // 焦点离开导航设置焦点保持
        onceFn();
        previousTabIndex = index;
        isStartSmallVideo = false;
        if (navIsLeave) {
            G(btn.id).src = RenderParam.fsUrl + RenderParam.navConfig[index].img_url.focus_out;
        }
    }

    /**
     * 得到焦点初始化
     */
    function initializationVariable(btn) {
        thisNavID = btn.id; // 标记当前焦点的ID
        HelpModal.count = 0; // 初始话当前帮助索引为零
        navIsLeave = false; // 导航得到焦点标记离开状态为false
    }

    /**
     * 为不同tab设置不同背景图，主要是tab0有小窗，背景图为镂空的
     */
    function setBodyBackgroundImage(index) {
        var imgPrefix = g_appRootPath + '/Public/img/<?php echo ($platformType); ?>/Home/V13/Home/';
        var TP = RenderParam;
        var bgObj = RenderParam.themeImage;

        //+--------------------主页的背景图设置规则----------------------
        //优先级：系统配置背景图>自定义皮肤>默认
        //+-------------------------------------------------------------
        var bgImg;
        if (RenderParam.carrierId !== "001006" && bgObj) {
            bgImg = TP.fsUrl + JSON.parse(bgObj).bottom;
        } else if (TP.skin['sy'] || TP.skin['cpbjt']) {
            bgImg = index == 0 ? TP.fsUrl + TP.skin.sy : TP.fsUrl + TP.skin.cpbjt;
        } else {
             bgImg = index === '0' ? (imgPrefix + 'bg_home1.png') : (imgPrefix + 'bg.png');
        }
        console.log("index-->" + index);
        LMEPG.Log.info('[header.html]--->[bgImg]--->背景图片地址: ' + bgImg);
        document.body.style.backgroundImage = 'url(' + bgImg + ')';
    }

    /**
     * 启动轮播
     */
    function startTimer(currentTabIndex) {
        if (currentTabIndex == 0) {
            Tab0.banner.stop();
            Tab0.bannerData.length > 1 ? Tab0.banner.start() : Hide('point-wrapper');
        }
        if (currentTabIndex == 1) {
            Tab1.banner.stop();
            Tab1.bannerData.length > 1 ? Tab1.banner.start() : Hide('tab1-point-wrapper');
        }
    }

    /**
     * 通用切换
     */
    function toggleFocus(btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.setAttribute('class', 'focus');
        } else {
            btnElement.removeAttribute('class');
        }
    }

    /**
     * 小图标功能区得失焦点
     */
    function onFocusIn(btn, hasFocus) {
        toggleFocus(btn, hasFocus);
        initDownFocusObj(btn);
    }

    /**
     * 小图标下移（搜索左移动）到当前对应内容块导航焦点上
     */
    function initDownFocusObj(btn) {
        LMEPG.BM.getButtonById(btn.id).nextFocusDown = 'tab-' + previousTabIndex;
        if (RenderParam.carrierId != "320092") {
            if (btn.id == 'search') {
                LMEPG.BM.getButtonById('search').nextFocusLeft = 'tab-' + previousTabIndex;
            }
        } else {
            if (btn.id == 'life') {
                LMEPG.BM.getButtonById('life').nextFocusLeft = 'tab-' + previousTabIndex;
            }
        }
    }

    /**
     * 导航栏焦点移动之前
     */
    function setTabLeaveStatus(key, btn) {
        var nextFocusId = 'nextFocus' + key.slice(0, 1).toUpperCase() + key.slice(1);
        var btnObj = G(btn[nextFocusId]);
        if (btnObj) {
            // 导航栏向上、下移动设置离开状态
            if (key == 'up' || key == 'down') {
                navIsLeave = true;
            } else {
                getJumpKeepFocusTabId = false; // 其他页面不是通过返回操作跳转回来初始化该参数
            }
            // 山东电信海看上报点击事件
            var moveToBtnId = btnObj.id;
            if ((key == "right" || key == "left") && (RenderParam.carrierId == CARRIER_ID_SHANDONG_HICON || RenderParam.carrierId == "371002")&& moveToBtnId.indexOf('tab') > -1) {
                sendNavEventFoHICON(moveToBtnId);
            }
        }
    }

    /**
     * 只执行一次函数
     */
    function onceFn() {
        if (callbackOnce && getJumpKeepFocusTabId) {
            navIsLeave = true;
            callbackOnce = false;
            if (typeof getJumpKeepFocusTabId === 'string') {
                previousTabIndex = getJumpKeepFocusTabId.slice(-1);
            }
        }
    }

    /**
     * 获取当前页
     */
    function getCurPageObj() {
        var objCurrent = LMEPG.Intent.createIntent('home');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('tabId', thisNavID);
        objCurrent.setParam('bottomPage', +Tab1.bottomPage);
        return objCurrent;
    }

    /**
     * 小图标跳转页面
     */
    function jumpPageUI(btn) {
        if (RenderParam.carrierId === '430002' && (btn.id === 'quit' || btn.id === 'tab3-link-6')) {
            if (!LMAndroid.isRunOnPc()) {
                var param = '{"appId":"777777","outDown":"1","loadURL":"http://124.232.135.212:8082/AppStoreTV4/service/page/newPage/ordertwo.jsp"}';
                LMAndroid.JSCallAndroid.quitPay(param, function (resParam, notifyAndroidCallback) {

                });
            } else {
                LMEPG.UI.showToast('运行在PC上');
            }

            return;
        }

        var currentObj = getCurPageObj(btn);
        // 通过点击对象id,设置跳转页面对象
        var jumpPageObj = {
            'search': 'search',
            'mark': 'dateMark',
            'vip': 'orderHome',
            'set': 'custom',
            'help': 'helpIndex',
            'life': 'life'
        };

        var jumpAgreementObj = LMEPG.Intent.createIntent(jumpPageObj[btn.id]);
        // 跳转的订购页面
        if (jumpPageObj[btn.id] == 'orderHome') {
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_NO_TYPE)) {
                modal.commonDialog({
                    beClickBtnId: btn.id,
                    onClick: modal.hide
                }, '<span style="color: #ef6188">您已是VIP会员，不能重复订购</span>', '海量健康资讯', '为您的家人健康保驾护航');
                return;
            } else {
                jumpAgreementObj.setParam('userId', RenderParam.userId);
                jumpAgreementObj.setParam('isPlaying', '0');
                jumpAgreementObj.setParam('remark', '主动订购');
            }
        } else if (jumpPageObj[btn.id] == 'life') {
            var url = 'http://180.100.135.12:8296/life/superior/login';
            window.location.href = url;
            return;
        }
        LMEPG.Intent.jump(jumpAgreementObj, currentObj);
    }

    /**
     * 点击童锁
     */
    function lockBeClick() {
        if (RenderParam.payLockStatus == "0") {
            // 童锁未开启，开启童锁
            var postData = {
                'flag': 1,
                'focusIndex': 'lock',
                'returnPageName': "home"
            };
            LMEPG.ajax.postAPI("Pay/getPayLockSetUrl", postData, function (data) {
                if (data.result == 0) {
                    window.location.href = data.url;
                }
            });
            return;
        }
        if (RenderParam.payLockStatus == "1") {
            // 童锁已开启，关闭童锁
            var postData = {
                'flag': 0,
                'focusIndex': 'lock',
                'returnPageName': "home"
            };
            LMEPG.ajax.postAPI("Pay/getPayLockSetUrl", postData, function (data) {
                if (data.result == 0) {
                    window.location.href = data.url;
                }
            });
            return;
        }
        // 查询童锁的状态异常。
    }

    var searchNormalImage = 'search.png';  // 搜索图片
    var searchFocusImage = 'search_f.png'; // 搜索获取焦点图片
    var orderNormalImage = "vip.png";      // 订购图片
    var orderFocusImage = "vip_f.png";     // 订购获取焦点图片
    var helpNormalImage = "help.png";      // 帮组图片
    var helpFocusImage = "help_f.png";     // 帮组获取焦点图片
    (function () {
        if (RenderParam.carrierId === '440004') { // 广西广电
            searchNormalImage = 'search1.png';
            orderNormalImage = "vip1.png";
        } else if(RenderParam.carrierId === "371092" || RenderParam.carrierId === "371002"){ // 山东海看epg\山东海看apk
            searchFocusImage = 'search_371092_f.png';
            orderFocusImage = "vip_371092_f.png";
            helpFocusImage = "help_371092_f.png";
        }
    })();

    var buttons = RenderParam.carrierId === '430002'?[
            {
                id: 'search',
                name: '搜索图标',
                type: 'img',
                nextFocusLeft: 'tab-3',
                nextFocusRight: 'vip',
                nextFocusDown: 'tab-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/search1.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/search_f.png',
                click: jumpPageUI,
                //beforeMoveChange: onBeforeMoveChanged_Header,
                focusChange: onFocusIn
            }, {
                id: 'vip',
                name: 'VIP图标',
                type: 'img',
                nextFocusLeft: 'search',
                nextFocusRight: 'quit',
                nextFocusDown: 'tab-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/vip1.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/vip_f.png',
                click: jumpPageUI,
                //beforeMoveChange: onBeforeMoveChanged_Header,
                focusChange: onFocusIn
            }, {
                id: 'quit',
                name: 'VIP图标',
                type: 'img',
                nextFocusLeft: 'vip',
                nextFocusRight: 'mark',
                nextFocusDown: 'tab-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/quit.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V13/Home/quit_f.png',
                click: jumpPageUI,
                //beforeMoveChange: onBeforeMoveChanged_Header,
                focusChange: onFocusIn
            }, {
                id: 'tab-0',
                name: '第一个导航',
                type: 'img',
                nextFocusLeft: 'tab-3',
                nextFocusRight: 'tab-1',
                nextFocusUp: 'search',
                nextFocusDown: 'video-TV',
                backgroundImage: RenderParam.fsUrl + RenderParam.navConfig[0].img_url.normal,
                focusImage: RenderParam.fsUrl + RenderParam.navConfig[0].img_url.focus_in,
                // selectedImage: RenderParam.fsUrl + RenderParam.navConfig[0].img_url.focus_out,
                focusChange: tabGetFocus,
                beforeMoveChange: setTabLeaveStatus
            }, {
                id: 'tab-1',
                name: '第二个导航',
                type: 'img',
                nextFocusLeft: 'tab-0',
                nextFocusRight: 'tab-2',
                nextFocusUp: 'search',
                nextFocusDown: 'tab1-link',
                backgroundImage: RenderParam.fsUrl + RenderParam.navConfig[1].img_url.normal,
                focusImage: RenderParam.fsUrl + RenderParam.navConfig[1].img_url.focus_in,
                // selectedImage: RenderParam.fsUrl + RenderParam.navConfig[1].img_url.focus_out,
                focusChange: tabGetFocus,
                beforeMoveChange: setTabLeaveStatus
            }, {
                id: 'tab-2',
                name: '第三个导航',
                type: 'img',
                nextFocusLeft: 'tab-1',
                nextFocusRight: 'tab-3',
                nextFocusUp: 'search',
                nextFocusDown: 'sift-2',
                backgroundImage: RenderParam.fsUrl + RenderParam.navConfig[2].img_url.normal,
                focusImage: RenderParam.fsUrl + RenderParam.navConfig[2].img_url.focus_in,
                // selectedImage: RenderParam.fsUrl + RenderParam.navConfig[2].img_url.focus_out,
                focusChange: tabGetFocus,
                beforeMoveChange: setTabLeaveStatus
            }, {
                id: 'tab-3',
                name: '第四个导航',
                type: 'img',
                nextFocusLeft: 'tab-2',
                nextFocusRight: 'search',
                nextFocusUp: 'search',
                nextFocusDown: 'tab3-link-1',
                backgroundImage: RenderParam.fsUrl + RenderParam.navConfig[3].img_url.normal,
                focusImage: RenderParam.fsUrl + RenderParam.navConfig[3].img_url.focus_in,
                // selectedImage: RenderParam.fsUrl + RenderParam.navConfig[3].img_url.focus_out,
                focusChange: tabGetFocus,
                beforeMoveChange: setTabLeaveStatus
            }, {
                id: 'debug',
                name: '脚手架ID',
                type: 'others',
                click: HelpModal.showTabHelp,
                beforeMoveChange: HelpModal.showTabHelp
            }
        ] :
        [{
            id: 'life',
            name: '优品生活首页',
            type: 'img',
            nextFocusLeft: 'tab-3',
            nextFocusRight: 'search',
            nextFocusDown: 'tab-0',
            backgroundImage: pathPrefix + 'life.png',
            focusImage: pathPrefix + 'life_f.png',
            click: jumpPageUI,
            focusChange: onFocusIn
        },
        {
            id: 'search',
            name: '搜索图标',
            type: 'img',
            nextFocusLeft: RenderParam.carrierId == "320092" ? 'life' : 'tab-3',
            nextFocusRight: 'vip',
            nextFocusDown: 'tab-0',
            backgroundImage: pathPrefix + searchNormalImage,
            focusImage: pathPrefix + searchFocusImage,
            click: jumpPageUI,
            focusChange: onFocusIn
        }, {
            id: 'mark',
            name: '签到图标',
            type: 'img',
            nextFocusLeft: 'search',
            nextFocusRight: RenderParam.carrierId == "610092" ? 'set' : 'vip',
            nextFocusDown: 'tab-0',
            backgroundImage: pathPrefix + 'mark.png',
            focusImage: pathPrefix + 'mark_f.png',
            click: jumpPageUI,
            focusChange: onFocusIn
        }, {
            id: 'vip',
            name: 'VIP图标',
            type: 'img',
            nextFocusLeft: 'search',
            nextFocusRight: 'help',
            nextFocusDown: 'tab-0',
            backgroundImage: pathPrefix + orderNormalImage,
            focusImage: pathPrefix + orderFocusImage,
            click: jumpPageUI,
            focusChange: onFocusIn
        }, {
            id: 'set',
            name: '设置图标',
            type: 'img',
            nextFocusLeft: RenderParam.carrierId == "610092" ? 'mark' : 'vip',
            nextFocusRight: 'help',
            nextFocusDown: 'tab-0',
            backgroundImage: pathPrefix + 'set.png',
            focusImage: pathPrefix + 'set_f.png',
            click: jumpPageUI,
            focusChange: onFocusIn
        }, {
            id: 'help',
            name: '帮助图标',
            type: 'img',
            nextFocusLeft: 'vip',
            nextFocusRight: RenderParam.showPayLock == 1 ? 'lock' : '',
            nextFocusUp: '',
            nextFocusDown: 'tab-0',
            backgroundImage: pathPrefix + helpNormalImage,
            focusImage: pathPrefix + helpFocusImage,
            click: jumpPageUI,
            focusChange: onFocusIn
        }, {
            id: 'lock',
            name: '童锁图标',
            type: 'img',
            nextFocusLeft: 'help',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: 'tab-0',
            backgroundImage: RenderParam.payLockStatus == 1 ? pathPrefix + 'lock_open.png' : pathPrefix + 'lock_close.png',
            focusImage: RenderParam.payLockStatus == 1 ? pathPrefix + 'lock_open_f.png' : pathPrefix + 'lock_close_f.png',
            click: lockBeClick,
            focusChange: onFocusIn
        }, {
            id: 'tab-0',
            name: '第一个导航',
            type: 'img',
            nextFocusLeft: 'tab-3',
            nextFocusRight: 'tab-1',
            nextFocusUp: RenderParam.carrierId == "320092" ? 'life' : 'search',
            nextFocusDown: 'video-TV',
            backgroundImage: RenderParam.fsUrl + RenderParam.navConfig[0].img_url.normal,
            focusImage: RenderParam.fsUrl + RenderParam.navConfig[0].img_url.focus_in,
            focusChange: tabGetFocus,
            moveChange: tabMoveUpdate,
            beforeMoveChange: setTabLeaveStatus
        }, {
            id: 'tab-1',
            name: '第二个导航',
            type: 'img',
            nextFocusLeft: 'tab-0',
            nextFocusRight: 'tab-2',
            nextFocusUp: RenderParam.carrierId == "320092" ? 'life' : 'search',
            nextFocusDown: 'tab1-link',
            backgroundImage: RenderParam.fsUrl + RenderParam.navConfig[1].img_url.normal,
            focusImage: RenderParam.fsUrl + RenderParam.navConfig[1].img_url.focus_in,
            focusChange: tabGetFocus,
            moveChange: tabMoveUpdate,
            beforeMoveChange: setTabLeaveStatus
        }, {
            id: 'tab-2',
            name: '第三个导航',
            type: 'img',
            nextFocusLeft: 'tab-1',
            nextFocusRight: 'tab-3',
            nextFocusUp: RenderParam.carrierId == "320092" ? 'life' : 'search',
            nextFocusDown: 'sift-2',
            backgroundImage: RenderParam.fsUrl + RenderParam.navConfig[2].img_url.normal,
            focusImage: RenderParam.fsUrl + RenderParam.navConfig[2].img_url.focus_in,
            focusChange: tabGetFocus,
            moveChange: tabMoveUpdate,
            beforeMoveChange: setTabLeaveStatus
        }, {
            id: 'tab-3',
            name: '第四个导航',
            type: 'img',
            nextFocusLeft: 'tab-2',
            nextFocusRight: RenderParam.carrierId === '430012' ? 'search' : 'tab-0',
            nextFocusUp: 'search',
            nextFocusDown: 'tab3-link-1',
            backgroundImage: RenderParam.fsUrl + RenderParam.navConfig[3].img_url.normal,
            focusImage: RenderParam.fsUrl + RenderParam.navConfig[3].img_url.focus_in,
            focusChange: tabGetFocus,
            moveChange: tabMoveUpdate,
            beforeMoveChange: setTabLeaveStatus
        }, {
            id: 'debug',
            name: '脚手架ID',
            type: 'others',
            click: HelpModal.showTabHelp,
            beforeMoveChange: HelpModal.showTabHelp
        }];

    function sendNavEventFoHICON(navId) {

        var turnPageInfo = {
            currentPage: location.href,   // 跳转前页面
            turnPage: location.href,      // 当前页面
            turnPageName: "",  // 当前页面名称
            turnPageId: "",    // 当前页面：详情页节目code/列表页categoryid/专题id
            clickId: ""        // 推荐位Id,由海看分配
        };
        switch (navId) {
            case 'tab-0':
                turnPageInfo.turnPageName = "首页-推荐";
                turnPageInfo.clickId = '39JKTJ';
                break;
            case 'tab-1':
                turnPageInfo.turnPageName = "首页-发现";
                turnPageInfo.clickId = '39JKFX';
                break;
            case 'tab-2':
                turnPageInfo.turnPageName = "首页-精选专题";
                turnPageInfo.clickId = '';//39JKJXZT
                break;
            case 'tab-3':
                turnPageInfo.turnPageName = "首页-我的";
                turnPageInfo.clickId = '39JKWD';
                break;
        }
        ShanDongHaiKan.sendReportData('6', turnPageInfo);
    }
</script>

<!--主容器-->
<div id="content-container">
    <div id="content-0" class="content">
        <!-- 首页推荐页面-->
<div id="first-content-row">
    <img id="video-TV" src="/Public/img/Common/spacer.gif">
    <!-- 小窗（江苏电信） -->
    <div class="small_screen_player">
        <iframe id="iframe_small_screen" frameborder="0" scrolling="no"></iframe>
    </div>

    <!-- 辽宁、山东，河南电信小窗位置为推荐位 -->
    <img id="link-0" src="/Public/img/hd/Player/smallvideo_bg.gif"/>
    <?php if($carrierId != '450092'): ?><img id="small-video-bg" src="/Public/img/hd/Home/V13/Home/smp_bg.png"><?php endif; ?>

    <img id="free-area"/>


    <!--    广东广电WEB-EPG-纯WEB版本 -->
    <?php if($carrierId == '440004' ): ?><div id="link-1-wrapper" style="display: none">
            <img id="icon-modify1" src="/Public/img/hd/Home/V13/Home/icon_hot.png">
            <img id="link-1">
        </div>

        <!--轮播组件-->
        <div id="carousel-wrapper" class="temp-x">
            <div id="link-2"></div>
            <img id="link-2-0" style="width: 464px" onerror="this.src='/Public/img/Common/default.png'">
            <img id="link-2-1" style="width: 464px" onerror="this.src='/Public/img/Common/default.png'">
            <img id="icon-modify2" src="/Public/img/hd/Home/V13/Home/icon_new.png">
            <div id="point-wrapper" style="left: 110px !important;"></div>
        </div>
        <?php else: ?>
        <div id="link-1-wrapper">
            <?php if($carrierId == '320092' ): ?><img id="icon-modify1" src="/Public/img/hd/Home/V13/Home/icon_VIP.png">
                <?php else: ?>
                <img id="icon-modify1" src="/Public/img/hd/Home/V13/Home/icon_hot.png"><?php endif; ?>
            <img id="link-1">
        </div>
        <!--轮播组件-->
        <div id="carousel-wrapper">
            <div id="link-2"></div>
            <img id="link-2-0" onerror="this.src='/Public/img/Common/default.png'">
            <img id="link-2-1">
            <?php if($carrierId == '320092' ): ?><img id="icon-modify2" src="/Public/img/hd/Home/V13/Home/icon_VIP.png">
                <?php else: ?>
                <img id="icon-modify2" src="/Public/img/hd/Home/V13/Home/icon_new.png"><?php endif; ?>
            <div id="point-wrapper"></div>
        </div><?php endif; ?>

    <!--    -->
    <div id="keep-watch-wrapper">
        <div id="keep-watch-title">
            <marquee id="lately-video-title"></marquee>
        </div>
        <img id="keep-watch" src="/Public/img/Common/spacer.gif">
    </div>

    <!--    继续观看下面的窗口，例如：疫情专区-->
    <div id="link-3-wrapper">
        <img id="link-3">
    </div>
</div>

<!-- 推荐页面最下方的推荐位-->
<div id="second-content-row">
    <div><img id="b-link-0"></div>
    <div><img id="b-link-1"></div>
    <div><img id="b-link-2"></div>
    <div><img id="b-link-3"></div>
    <div><img id="b-link-4"></div>
</div>

<!-- 帮助流程 -->
<div id="tab0-help" class="tab-help-wrap">
    <img id="tab0-help0" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab0_help0.png">
    <img id="tab0-help1" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab0_help1.png">
    <img id="tab0-help2" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab0_help2.png">
    <img id="tab0-help3" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab0_help3.png">
</div>
<script type="text/javascript">
    // 推荐页面的数据
    var Tab0 = {
        isLoad: false,
        noSmallVideoArea:[],
        hasSmallVideo : true,
        init: function () {
            this.noSmallVideoArea = ['410092', '370092', '210092', '610092', '440004','440001','150002','450001','640001'];
            this.hasSmallVideo = this.noSmallVideoArea.indexOf(RenderParam.carrierId) === -1;
            if(RenderParam.carrierId === '430002'){
                G('keep-watch-wrapper').style.backgroundImage = 'url('+g_appRootPath+'/Public/img/hd/Home/V13/Home/hunan-tab0.png)'
                G('keep-watch-title').style.width = '135px'
                G('keep-watch-title').style.top = '36px'

                var choose = G('keep-watch')

                choose.style.left = '6px'
                choose.style.top = '6px'
                choose.style.width = '293px'
                choose.style.height = '98px'
            }else {
                G('keep-watch-wrapper').style.backgroundImage = 'url('+g_appRootPath+'/Public/img/hd/Home/V13/Home/keep_watch.png)'
                G('keep-watch-title').innerHTML = '<marquee> 您还没有点播过视频哦！</marquee>';
            }
            this.bannerData = [];
            this.createBtns();
            this.renderTab0();
            this.banner = new Banner(Tab0.bannerData, 'link-2-0', 'link-2-1', 'point-');
            this.banner.renderDots('point-wrapper');
            if(this.hasSmallVideo == undefined)
                this.hasSmallVideo = this.noSmallVideoArea.indexOf(RenderParam.carrierId) === -1;

            if (RenderParam.carrierId == "440004") {
                G("link-2-0").style.backgroundImage = 'url("/Public/img/hd/Home/V13/Home/a_link_x.png")';
                G("link-2-1").style.backgroundImage = 'url("/Public/img/hd/Home/V13/Home/a_link_x.png")';
            }

            if (RenderParam.carrierId == CARRIER_ID_SHANDONG_HICON || RenderParam.carrierId == "371002") {
                sendNavEventFoHICON("tab-0");
            }

        },
        /**
         * 渲染Tab0
         */
        renderTab0: function () {
            var me = this;
            var list = RenderParam.configInfo.data.entry_list/*.slice(0, 6)*/;
            var getImg = Page.getImg;
            var item = '';
            var pos = '';
            var posData = '';
            var id = '';
            var tab0Data = [11, 12, 13, 14, 15, 16];// TODO “推荐”模块后台配置位置的position
            latest_htm(); // 最近播放
            for (var i = 0; i < list.length; i++) {
                item = list[i];
                pos = parseInt(item.position);
                posData = item.item_data;
                switch (pos) {
                    case 11:
                        id = 'free-area'; // 免费专区
                        break;
                    case 12:
                        id = 'link-0'; // 小窗位置
                        break;
                    case 13:
                        id = 'link-1'; // 热门位置
                        break;
                    case 14:
                        id = '';
                        banner_htm(posData);
                        break;
                    case 15:
                        id = 'link-3'; // 继续观看下面位置
                        break;
                    case 16:
                        id = '';
                        bottom_htm(posData);
                        break;
                }
                if (id && tab0Data.indexOf(pos) > -1) G(id).src = getImg(posData[0].img_url);
            }

            /**
             * banner数据与渲染
             */
            function banner_htm(data) {
                me.bannerData = [];
                for (var j = 0; j < data.length; j++) {
                    var val = data[j];
                    me.bannerData.push({
                        id: j,
                        src: getImg(val.img_url),
                        entry_type: val.entry_type,
                        parameters: val.parameters,
                        inner_parameters: val.inner_parameters
                    })
                }

                if (data[0]) G('link-2-0').src = getImg(data[0].img_url);
                if (data[1]) G('link-2-1').src = getImg(data[1].img_url);
            }

            /*最近播放渲染*/
            function latest_htm() {
                if(RenderParam.carrierId === '430002'){
                    var value = 0
                    Tab0.getTestDataLast(function (data) {
                        if(data.data['10003'] || data.data['10006']){
                            value = data.data['10003']? data.data['10003'].fatFreeWeight : data.data['10006'].fatFreeWeight
                            G('keep-watch-title').innerHTML = '<marquee>体重：' +value + 'KG</marquee>';

                        }else if(data.data['10002']){
                            value = data.data['10002']
                            G('keep-watch-title').innerHTML = '<marquee> 低压：'+value.diastolicPressure + 'mmHG 高压:'+value.systolicPressure+'mmHG 心率:'+value.heartRate+'bpm' + '</marquee>';

                        }else if(data.data['10005'] || data.data['10004'] ){
                            value =data.data['10005']? data.data['10005'].bloodGlucose : data.data['10004'].bloodGlucose
                            G('keep-watch-title').innerHTML = '<marquee>血糖：' +value + 'mmol</marquee>';

                        }else {
                            G('keep-watch-title').innerHTML = '<marquee>您还未进行检测</marquee>';
                        }
                    })
                }else {
                    if (RenderParam.latestVideoInfo.result == 0 && RenderParam.latestVideoInfo.val != "undefined") {
                        var videoInfo = JSON.parse(RenderParam.latestVideoInfo.val);
                        G('keep-watch-title').innerHTML = '<marquee>' + videoInfo.title + '</marquee>';
                    }
                }
            }

            /*底部渲染*/
            function bottom_htm(bottomData) {
                var htm_bom = '';
                for (var k = 0; k < bottomData.length; k++) {
                    htm_bom += '<div><img src="' + getImg(bottomData[k].img_url) + '" id="b-link-' + k + '"></div>';
                }
                G('second-content-row').innerHTML = htm_bom;
            }
        },
        /**
         * 当前页面元素获得失去焦点
         * 修饰图标“热门”，“最新”跟随寄生元素得失焦点变化
         * 轮播获得焦点与通用元素变化一致
         * @param btn
         * @param hasFocus
         */
        onFocusIn: function (btn, hasFocus) {
            var me = Tab0;
            var btnElement = G(btn.id);
            if (hasFocus) {
                btnElement.setAttribute('class', 'focus');
            } else {
                btnElement.removeAttribute('class');
            }
            me.modifyOnFocus(btn.id, hasFocus);
            me.link2OnFocus(btn, hasFocus, btnElement);
        },
        /**
         * 轮播推荐位得失焦点处理
         * 轮询切换
         * @param btn
         * @param hasFocus
         */
        link2OnFocus: function (btn, hasFocus) {
            if (btn.id != 'link-2') return;

            var carousel_0 = G(btn.id + '-0');
            var carousel_1 = G(btn.id + '-1');
            if (hasFocus) {
                carousel_0.setAttribute('class', 'focus');
                carousel_1.setAttribute('class', 'focus');
            } else {
                carousel_0.removeAttribute('class');
                carousel_1.removeAttribute('class');
            }
        },
        /**
         * 修饰图标得失焦点
         * @param id
         * @param hasFocus
         */
        modifyOnFocus: function (id, hasFocus) {
            if (id != 'link-1' && id != 'link-2') return;

            var prevModifyElementId = 'icon-modify' + (id == 'link-1' ? 1 : 2);
            if (hasFocus) {
                G(prevModifyElementId).setAttribute('class', 'focus');
            } else {
                G(prevModifyElementId).removeAttribute('class');
            }
        },

        /**
         * 底部按钮焦点
         */
        bottomBtnOnfocus: function (btn, hasFocus) {
            var btnElement = G(btn.id);
            if (hasFocus) {
                btnElement.className = 'focus';
            } else {
                btnElement.className = '';
            }
        },

        getTestDataLast:function(cb){
            LMEPG.ajax.postAPI('NewHealthDevice/deviceDataLast', {},function (res) {
                if(res.code === 200){
                    console.log(res,9090)
                    cb(res)
                }else {
                    G('keep-watch-title').innerHTML = '<marquee>您还未进行检测</marquee>';
                }
            })
        },

        /**
         * 创建按钮
         */
        createBtns: function () {
            var videoFocusImagePath = g_appRootPath + '/Public/img/hd/Home/V13/Home/video_f.png';
            var keepWatchFocusImgPath =RenderParam.carrierId === '430002'?g_appRootPath+'/Public/img/hd/Home/V13/Home/hunan-tab0-f.png': g_appRootPath + '/Public/img/hd/Home/V13/Home/keep_watch_f.png';
            if(RenderParam.platformType == 'sd') {
                keepWatchFocusImgPath = g_appRootPath + '/Public/img/sd/Unclassified/V13/keep_watch_f.png';
            }
            buttons.push({
                id: 'video-TV',
                name: '小窗视频',
                type: 'img',
                nextFocusRight: RenderParam.carrierId == "440004" ? 'link-2' : 'link-1',
                nextFocusUp: 'tab-0',
                nextFocusDown: 'free-area',
                backgroundImage: g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: videoFocusImagePath,
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cNavId: 2,
                cPosition: 12
            }, {
                id: 'free-area',
                name: '免费专区',
                type: 'img',
                nextFocusRight: RenderParam.carrierId == "440004" ? 'link-2' : 'link-1',
                nextFocusUp: 'video-TV',
                nextFocusDown: 'b-link-0',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cNavId: 2,
                cPosition: 11
            }, {
                id: 'link-1',
                name: '推荐位1',
                type: 'img',
                nextFocusLeft: 'video-TV',
                nextFocusRight: 'link-2',
                nextFocusUp: 'tab-0',
                nextFocusDown: 'b-link-2',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cNavId: 2,
                cPosition: 13
            }, {
                id: 'link-2',
                name: '推荐为2（由轮播映射）',
                type: 'others',
                nextFocusLeft: RenderParam.carrierId == "440004" ? 'video-TV' : 'link-1',
                nextFocusRight: 'keep-watch',
                nextFocusUp: 'tab-0',
                nextFocusDown: 'b-link-3',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cNavId: 2,
                cPosition: 14
            }, {
                id: 'keep-watch',
                name: '继续观看',
                type: 'img',
                nextFocusLeft: 'link-2',
                nextFocusRight: '',
                nextFocusUp: 'tab-0',
                nextFocusDown: 'link-3',
                backgroundImage:g_appRootPath + '/Public/img/Common/spacer.gif',
                focusImage: keepWatchFocusImgPath,
                click:RenderParam.carrierId==='430002'?PageJump.jumpClassifyPage:PageJump.jumpContinuePlay,
                focusChange: this.onFocusIn,
                cNavId: 2
            }, {
                id: 'link-3',
                name: '推荐位3',
                type: 'img',
                nextFocusLeft: 'link-2',
                nextFocusUp: 'keep-watch',
                nextFocusDown: 'b-link-4',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cNavId: 2,
                cPosition: 15
            }, {
                id: 'b-link-0',
                name: '第一个功能区',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'b-link-1',
                nextFocusUp: 'free-area',
                click: Page.onClickRecommendPosition,
                focusChange: this.bottomBtnOnfocus,
                cNavId: 2,
                cPosition: 16
            }, {
                id: 'b-link-1',
                name: '第二个功能区',
                type: 'img',
                nextFocusLeft: 'b-link-0',
                nextFocusRight: 'b-link-2',
                nextFocusUp: 'free-area',
                click: Page.onClickRecommendPosition,
                focusChange: this.bottomBtnOnfocus,
                cNavId: 2,
                cPosition: 16
            }, {
                id: 'b-link-2',
                name: '第三个功能区',
                type: 'img',
                nextFocusLeft: 'b-link-1',
                nextFocusRight: 'b-link-3',
                nextFocusUp: 'link-2',
                nextFocusDown: '',
                click: Page.onClickRecommendPosition,
                focusChange: this.bottomBtnOnfocus,
                cNavId: 2,
                cPosition: 16
            }, {
                id: 'b-link-3',
                name: '第四个功能区',
                type: 'img',
                nextFocusLeft: 'b-link-2',
                nextFocusRight: 'b-link-4',
                nextFocusUp: 'link-2',
                click: Page.onClickRecommendPosition,
                focusChange: this.bottomBtnOnfocus,
                cNavId: 2,
                cPosition: 16
            }, {
                id: 'b-link-4',
                name: '第五个功能区',
                type: 'img',
                nextFocusLeft: 'b-link-3',
                nextFocusRight: '',
                nextFocusUp: 'link-3',
                click: Page.onClickRecommendPosition,
                focusChange: this.bottomBtnOnfocus,
                cNavId: 2,
                cPosition: 16
            });
        }
    };
</script>

    </div>
    <div id="content-1" class="content">
        <div class="tab1-link-1-wrap">
    <div id="tab1-link">
        <img src="/Public/img/hd/Home/V13/Home/free_icon.png" class="sign-area" style="top: 0;display: none"
             id="free-icon-0">
    </div>
    <img id="tab1-link-1" onerror="this.src='/Public/img/Common/default.png'">
    <img id="tab1-link-0">
    <div id="tab1-point-wrapper"></div>
</div>
<div class="tab1-center-link">
    <div>
        <img id="tab1-link-2">
        <img src="/Public/img/hd/Home/V13/Home/free_icon.png" class="sign-area" style="top: 0;display: none"
             id="free-icon-1">
    </div>
    <div>
        <img id="tab1-link-3">
        <img src="/Public/img/hd/Home/V13/Home/free_icon.png" class="sign-area" style="top: 0;display: none"
             id="free-icon-2">
    </div>
    <!--标清位置改变-->
    <div class="sd-re-pos-1">
        <img src="/Public/img/hd/Home/V13/Home/free_icon.png" class="sign-area" style="top: 0;display: none"
             id="free-icon-3">
        <img id="tab1-link-4">
    </div>
    <div class="sd-re-pos-2">
        <img src="/Public/img/hd/Home/V13/Home/free_icon.png" class="sign-area" style="top: 0;display: none"
             id="free-icon-4">
        <img id="tab1-link-5">
    </div>
</div>
<ul class="hot-video-list" id="hot-wrap"></ul>

<!--底部容器，按钮导航-->
<div class="tab1-bottom-link">
    <div id="overlay-wrap"></div>
</div>
<div id="tab1-help" class="tab-help-wrap">
    <img id="tab1-help0" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab1_help0.png">
</div>

<script type="text/javascript">
    var Tab1 = {
        isLoad: false,
        temp_id: "", //  辅助变量
        init: function () {
            Tab1.hotRefVideo = [];
            Tab1.bottomData = [];
            Tab1.bottomPageSize = 5;
            Tab1.bottomPage = +LMEPG.Func.getLocationString('bottomPage') || 0;
            Tab1.getBottomData();
            Tab1.createBtns();
            Tab1.renderTab1();
            Tab1.renderBottom();
            Tab1.banner = new Banner(Tab1.bannerData, 'tab1-link-0', 'tab1-link-1', 'tab1-point-');
            Tab1.banner.renderDots('tab1-point-wrapper');
        },
        /**
         * 渲染Tab1
         */
        renderTab1: function () {
            Tab1.setHotWrapBg()
            Tab1.hotVideo_htm();
            Tab1.updatePageDisPlay()
        },

        /**
         *
         */
        updatePageDisPlay: function () {
            var list = RenderParam.configInfo.data.entry_list;
            var tab1Data = [21, 22, 23, 24, 25];               //  “发现”模块后台配置位置的position
            for (var i = 0; i < list.length; i++) {
                this.displayByPos(list, i)
                var pos = parseInt(list[i].position);
                if (this.temp_id && tab1Data.indexOf(pos) > -1) {
                    G(this.temp_id).src = Page.getImg(list[i].item_data[0].img_url);
                }
            }
        },

        /**
         *
         */
        displayByPos: function (list, index) {
            var pos = parseInt(list[index].position);
            switch (pos) {
                case 21:
                    Tab1.temp_id = '';
                    this.banner_htm(list[index].item_data);
                    this.addFreeIcon('free-icon-0', list, index);
                    break;
                case 22:
                    Tab1.temp_id = 'tab1-link-2';
                    this.addFreeIcon('free-icon-1', list, index);
                    break;
                case 23:
                    Tab1.temp_id = 'tab1-link-3';
                    this.addFreeIcon('free-icon-2', list, index);
                    break;
                case 24:
                    Tab1.temp_id = 'tab1-link-4';
                    this.addFreeIcon('free-icon-3', list, index);
                    break;
                case 25:
                    Tab1.temp_id = 'tab1-link-5';
                    this.addFreeIcon('free-icon-4', list, index);
                    break;
                default:
                    Tab1.temp_id = "";
                    break
            }
        },

        /**
         * 设置热播背景
         */
        setHotWrapBg: function () {
            var bgListTitle = 'url("/Public/img/' + RenderParam.platformType + '/Home/V13/Home/Tab1/hot_title.png")';
            if (RenderParam.carrierId == '371092') {
                bgListTitle = 'url("/Public/img/hd/Unclassified/V13/hot_title_371092.png")';
            }
            G('hot-wrap').style.backgroundImage = bgListTitle;
        },

        /**
         * 热播榜html数据包
         */
        hotVideo_htm: function () {
            var data = LMEPG.Func.shuffle(RenderParam.videoPlayRank.list);
            var currentBtn = LMEPG.BM.getCurrentButton();
            if (data.length === 0) return;
            Tab1.hotRefVideo = data;
            Tab1.renderHotWrap(data)
            Tab1.moveFocusOnFirst(currentBtn)
            Tab1.refreshHotWrap(data);
        },

        /**
         * 渲染banner
         */
        banner_htm: function (carouselData) {
            Tab1.bannerData = this.buildBannerData(carouselData)
            if (Tab1.bannerData[0]) G('tab1-link-0').src = Tab1.bannerData[0].src;
            if (Tab1.bannerData[1]) G('tab1-link-1').src = Tab1.bannerData[1].src;
        },

        /**
         * 构建banner数据包
         */
        buildBannerData: function (carouselData) {
            var temp_list = []
            for (var j = 0; j < carouselData.length; j++) {
                var val = carouselData[j];
                temp_list.push({
                    id: j,
                    src: Page.getImg(val.img_url),
                    entry_type: val.entry_type,
                    parameters: val.parameters,
                    inner_parameters: val.inner_parameters
                })
            }
            return temp_list;
        },

        /**
         * 渲染热播列表html
         */
        renderHotWrap: function (data) {
            var hotInner = '';
            var staticCount = 6; // 固定的位置个数
            for (var i = 0; i < staticCount; i++) {
                var hotItem = data[i];
                var titleTxt = hotItem ? hotItem.title : '';
                var titlen = RenderParam.platformType == 'sd' ? 10 : 12;
                var title = titleTxt.length > titlen ? titleTxt.slice(0, titlen) + "..." : titleTxt;
                if (RenderParam.carrierId == '371092') {
                    hotInner += ' <li data-title="' + titleTxt + '" id="hot-' + i + '" style="background-image: url(' + g_appRootPath + '/Public/img/hd/Unclassified/V13/hot_bg_371092.png)">' + title;
                } else {
                    hotInner += ' <li data-title="' + titleTxt + '" id="hot-' + i + '" style="background-image: url(' + g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab1/hot_bg.png)">' + title;

                }
            }
            G('hot-wrap').innerHTML = hotInner;
        },

        /**
         * 添加免费角标
         */
        addFreeIcon: function (id, list, index) {
            if (!list[index].item_data[0].inner_parameters) {
                return
            }

            var type = JSON.parse(list[index].item_data[0].inner_parameters).user_type

            if (!type) {
                return;
            }

            if (RenderParam.carrierId === '430002' &&
                RenderParam.isVip === 0 &&
                list[index].item_data[0].entry_type === '5' &&
                type !== '2') {

                G(id).style.display = 'block'
            }
        },

        /**
         * 如果焦点在热播榜上，每次刷新时把焦点移到第一条
         */
        moveFocusOnFirst: function (currentBtn) {
            if (currentBtn && currentBtn.id.substr(0, 4) === 'hot-') {
                LMEPG.BM.requestFocus('hot-0');
            }
        },

        /**
         * 隔十秒刷新一下热播榜
         */
        refreshHotWrap: function (data) {
            if (data.length > 6) {
                clearTimeout(this.hotTimer);
                this.hotTimer = setTimeout(this.hotVideo_htm, 10000);
            }
        },
        /**
         * 通用位置获得焦点
         * @param btn
         * @param hasFocus
         */
        onFocusIn: function (btn, hasFocus) {
            var btnElement = G(btn.id);
            if (hasFocus) {
                btnElement.setAttribute('class', 'focus');
            } else {
                btnElement.removeAttribute('class');
            }
            Tab1.bottomOnFocusIn(btn, hasFocus);
            Tab1.carouselLink1OnFocus(btn, hasFocus);
        },
        /**
         * 轮播推荐位得失焦点处理
         * 轮询切换
         * @param btn
         * @param hasFocus
         */
        carouselLink1OnFocus: function (btn, hasFocus) {
            if (btn.id != 'tab1-link') {
                return;
            }
            var carousel_0 = G(btn.id + '-0');
            var carousel_1 = G(btn.id + '-1');
            if (hasFocus) {
                carousel_0.setAttribute('class', 'focus');
                carousel_1.setAttribute('class', 'focus');
            } else {
                carousel_0.removeAttribute('class');
                carousel_1.removeAttribute('class');
            }
        },

        /**
         * 点击热播视频
         * @param btn
         */
        onClickHotVideo: function (btn) {
            var videoData = Tab1.hotRefVideo[btn.id.slice(-1)];

            PageJump.jumpPlayVideo(videoData);
        },
        hotOnFocusIn: function (btn, hasFocus) {
            var btnEl = G(btn.id);
            var txtInner = btnEl.getAttribute('data-title');
            var lenWord = RenderParam.platformType == 'sd' ? 8 : 12;
            if (btn.id.indexOf('hot') < 0) {
                return;
            }

            if (hasFocus) {
                if (txtInner.length > lenWord) btnEl.innerHTML = '<marquee>' + txtInner;
                btnEl.style.color = '#000';
            } else {
                if (txtInner.length > lenWord) btnEl.innerHTML = txtInner.length > lenWord ? txtInner + '...' : txtInner;
                btnEl.style.color = '#fff';
            }
        },

        /**
         * 点击二级视频入口（页面的最后一行）
         */
        onClickJumpLevel2Page: function (btn) {
            if (RenderParam.carrierId === '440001'){
                Page.onClickRecommendPosition(btn)
            }else {
                var currentObj = getCurPageObj();
                var lastIdx = +btn.id.slice(-1);
                var btnJumpData = Tab1.jumpBottomData[lastIdx];
                if (RenderParam.carrierId == CARRIER_ID_SHANDONG_HICON || RenderParam.carrierId == "371002") {
                    // 山东电信海看埋点上报推荐位点击事件
                    var clickId = Page._getHICONClickId(btn.id);
                    var turnPageInfo = {
                        currentPage: location.href,
                        turnPage: location.origin + "/Home/Channel/channelIndexV13",
                        turnPageName: btnJumpData.model_name,
                        turnPageId: "39_" + btnJumpData.model_type,
                        clickId: clickId
                    };
                    ShanDongHaiKan.sendReportData('6', turnPageInfo);
                }
                // 通过点击对象id,设置跳转页面对象
                var jumpAgreementObj = LMEPG.Intent.createIntent('channelIndex');
                jumpAgreementObj.setParam('itemIndex', Tab1.bottomPage);
                jumpAgreementObj.setParam('modelType', btnJumpData.model_type);
                jumpAgreementObj.setParam('modelName', btnJumpData.model_name);
                LMEPG.Intent.jump(jumpAgreementObj, currentObj);
            }
        },
        /**
         * 视频栏目获得焦点
         * 处理进入二级视频栏目滚动效果
         * @param btn
         * @param hasFocus
         */
        bottomOnFocusIn: function (btn, hasFocus) {
            if (btn.id.indexOf('bottom') < 0) {
                return;
            }
            if (hasFocus) {
                if (btn.id == 'bottom-link-0') {
                    showLeft();
                }
                if (btn.id == 'bottom-link-4') {
                    showRight();
                }
            }

            function showLeft() {
                G('first-action').setAttribute('class', 'moveRight');
                if (Tab1.prevImage) {
                    Show('placeholder-0');
                    Hide('placeholder-1');
                }
            }

            function showRight() {
                G('first-action').setAttribute('class', 'moveLeft');
                if (Tab1.nextImage) {
                    Hide('placeholder-0');
                    Show('placeholder-1');
                }
            }
        },
        /**
         * 视频栏目焦点移动
         * 切换滚动
         * @param dir
         * @param btn
         */
        turnBottomPage: function (dir, btn) {
            var me = Tab1;
            if (dir == 'left' && btn.id == 'bottom-link-0' && me.bottomPage != 0) {
                me.bottomPage -= 1;
                me.renderBottom(btn);
                LMEPG.BM.requestFocus('bottom-link-0');
            }
            if (dir == 'right' && btn.id == 'bottom-link-4' && me.bottomPage < me.bottomData.length - 5) {
                me.bottomPage += 1;
                me.renderBottom(btn);
                LMEPG.BM.requestFocus('bottom-link-4');
            }
        },
        /**
         * 转换组装底部视频栏目数据
         */
        getBottomData: function () {
            var bom_data = RenderParam.videoClass.data || [];
            var getImgFun = Page.getImg;
            if (RenderParam.carrierId==='440001' && RenderParam.configInfo.result==0) {
                var recommentData = RenderParam.configInfo.data.entry_list[10].item_data;
                var position = RenderParam.configInfo.data.entry_list[10].position
                for (var i = 0; i < recommentData.length; i++) {
                    this.bottomData.push({
                        id: i,
                        src: getImgFun(recommentData[i].img_url),
                        dataType: recommentData[i],
                        position: position
                    });
                }
            }else {
                for (var k = 0; k < bom_data.length; k++) {
                    this.bottomData.push({
                        id: k,
                        src: getImgFun(bom_data[k].img_url),
                        show_title: bom_data[k].show_title,
                        model_type: bom_data[k].model_type,
                        model_name: bom_data[k].model_name
                    });
                }
            }
        },

        /**
         * 底部视频栏目
         */
        renderBottom: function (btn) {
            var bottomInner = '';
            var parentNodeId = '';
            var parentNodeClass = '';
            var src = '';
            var start = this.bottomPage;
            var end = this.bottomPage + this.bottomPageSize;
            var data = this.bottomData.slice(start, end);

            if (data.length === 0) return;
            for (var k = 0; k < this.bottomPageSize; k++) {
                src = data[k] ? data[k].src : '';
                parentNodeId = k === 0 ? 'first-action' : '';
                parentNodeClass = k === 0 ? 'moveRight' : '';
                LMEPG.Log.info("TabContent_1.html--renderBottom--src::" + src);
                bottomInner += '<div class="' + parentNodeClass + '" id="' + parentNodeId + '"><img id="bottom-link-' + k + '" src="' + src + '"></div>';
            }

            // 添加站位元素
            bottomInner = '<div id="placeholder-0" class="left-placeholder"><img id="placeholder-img-0" src=""></div>' + bottomInner;
            bottomInner += '<div id="placeholder-1" class="right-placeholder"><img id="placeholder-img-1" src=""></div>';

            G('overlay-wrap').innerHTML = bottomInner;
            this.jumpBottomData = data;
            this.prevImage = start ? this.bottomData[start - 1] : null;
            this.nextImage = this.bottomData[end] ? this.bottomData[end] : null;
            this.refPlaceholder(this.prevImage, this.nextImage);
        },

        /**
         * 视频栏目
         * 展示占位元素
         * @param prevImage
         * @param nextImage
         */
        refPlaceholder: function (prevImage, nextImage) {
            if (this.bottomData.length < 6) {
                return;
            }

            if (prevImage && prevImage.src) {
                G('placeholder-img-0').src = prevImage.src;
            }

            if (nextImage && nextImage.src) {
                G('placeholder-img-1').src = nextImage.src;
            }
        },

        /**
         * 构建按钮
         */
        createBtns: function () {
            // 推荐位1
            buttons.push({
                id: 'tab1-link',
                type: 'img',
                nextFocusRight: 'tab1-link-2',
                nextFocusUp: 'tab-1',
                nextFocusDown: RenderParam.platformType == 'sd' ? 'tab1-link-4' : 'bottom-link-0',
                click: Page.onClickRecommendPosition,
                focusChange: Tab1.onFocusIn,
                cNavId: 2,
                cPosition: 21
            });
            // 中间四个推荐位
            buttons.push({
                id: 'tab1-link-2',
                type: 'img',
                nextFocusLeft: 'tab1-link',
                nextFocusRight: RenderParam.platformType == 'sd' ? 'hot-0' : 'tab1-link-3',
                nextFocusUp: 'tab-1',
                nextFocusDown: RenderParam.platformType == 'sd' ? 'tab1-link-3' : 'tab1-link-4',
                click: Page.onClickRecommendPosition,
                focusChange: Tab1.onFocusIn,
                cNavId: 2,
                cPosition: 22
            }, {
                id: 'tab1-link-3',
                type: 'img',
                nextFocusLeft: RenderParam.platformType == 'sd' ? 'tab1-link-5' : 'tab1-link-2',
                nextFocusRight: 'hot-0',
                nextFocusUp: RenderParam.platformType == 'sd' ? 'tab1-link-2' : 'tab-1',
                nextFocusDown: RenderParam.platformType == 'sd' ? 'bottom-link-1' : 'tab1-link-5',
                click: Page.onClickRecommendPosition,
                focusChange: Tab1.onFocusIn,
                cNavId: 2,
                cPosition: 23
            }, {
                id: 'tab1-link-4',
                type: 'img',
                nextFocusLeft: RenderParam.platformType == 'sd' ? '' : 'tab1-link',
                nextFocusRight: 'tab1-link-5',
                nextFocusUp: RenderParam.platformType == 'sd' ? 'tab1-link' : 'tab1-link-2',
                nextFocusDown: 'bottom-link-0',
                click: Page.onClickRecommendPosition,
                focusChange: Tab1.onFocusIn,
                cNavId: 2,
                cPosition: 24
            }, {
                id: 'tab1-link-5',
                type: 'img',
                nextFocusLeft: 'tab1-link-4',
                nextFocusRight: RenderParam.platformType == 'sd' ? 'tab1-link-3' : 'hot-0',
                nextFocusUp: RenderParam.platformType == 'sd' ? 'tab1-link' : 'tab1-link-3',
                nextFocusDown: 'bottom-link-0',
                click: Page.onClickRecommendPosition,
                focusChange: Tab1.onFocusIn,
                cNavId: 2,
                cPosition: 25
            });
            // 热播榜
            var hot_length = 6;
            while (hot_length--) {
                var topFocus = hot_length == 0 ? 'tab-1' : 'hot-' + (hot_length - 1);
                var downFocus = hot_length == 5 ? 'bottom-link-3' : 'hot-' + (hot_length + 1);
                var bgItemImgPath = g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab1/hot_bg.png';
                var bgItemFImgPath = g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab1/hot_link.png';
                if (RenderParam.platformType == 'sd') {
                    bgItemImgPath = g_appRootPath + '/Public/img/sd/Unclassified/V13/hot_f.png';
                    bgItemFImgPath = g_appRootPath + +'/Public/img/hd/Home/V13/Home/Tab1/hot_link.png';
                }
                if (RenderParam.carrierId == '371092') {
                    bgItemImgPath = g_appRootPath + '/Public/img/hd/Unclassified/V13/hot_bg_371092.png';
                    bgItemFImgPath = g_appRootPath + '/Public/img/hd/Unclassified/V13/hot_f_371092.png';
                }
                buttons.push({
                    id: 'hot-' + hot_length,
                    type: 'div',
                    nextFocusLeft: 'tab1-link-3',
                    nextFocusUp: topFocus,
                    nextFocusDown: downFocus,
                    click: this.onClickHotVideo,
                    focusChange: Tab1.hotOnFocusIn,
                    backgroundImage: bgItemImgPath,
                    focusImage: bgItemFImgPath,
                    cNavId: 2
                });
            }
            // 跳转二级页面按钮
            var tabCount = 5; // 后台拉去的个数
            while (tabCount--) {
                var top1Focus = function () {
                    var id;
                    if (tabCount < 2) {
                        id = 'tab1-link-4';
                    } else if (tabCount == 2 || RenderParam.videoPlayRank.count == 0) {
                        id = 'tab1-link-5';
                    } else {
                        id = 'hot-5';
                    }
                    return id;
                }();
                buttons.push({
                    id: 'bottom-link-' + tabCount,
                    type: 'others',
                    nextFocusLeft: 'bottom-link-' + (tabCount - 1),
                    nextFocusRight: 'bottom-link-' + (tabCount + 1),
                    nextFocusUp: top1Focus,
                    click: Tab1.onClickJumpLevel2Page,
                    focusChange: Tab1.onFocusIn,
                    beforeMoveChange: Tab1.turnBottomPage,
                    cNavId: tabCount,
                    cIdx: (RenderParam.carrierId==='440001'?this.bottomData[tabCount].dataType:''),
                    cPosition: (RenderParam.carrierId==='440001'?this.bottomData[tabCount].position:''),
                    isButton: (RenderParam.carrierId==='440001'?'button':'')
                });
            }
        }
    };
</script>
    </div>
    <div id="content-2" class="content">
        <img id="tab2-prev-arrow" class="tab2-arrow" src="/Public/img/hd/Home/V13/Home/Common/left.png" alt="">
<img id="tab2-next-arrow" class="tab2-arrow" src="/Public/img/hd/Home/V13/Home/Common/right.png" alt="">
<div id="tab2-carousel-wrapper"></div>
<div id="tab2-help" class="tab-help-wrap">
    <img id="tab2-help0" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab2_help0.png">
</div>
<script type="text/javascript">
    var Tab2 = {
        isLoad: false,
        init: function () {
            this.data = [];
            this.linkAlbum = null;
            this.albumName = LMEPG.Func.getLocationString('albumName') || "";
            this.addItem();
            this.tab2KeepData();
            this.createBtns();
            this.renderImg();
            LMEPG.BM.getSelectedButton()

        },

        /**
         * 对tab2做专辑焦点数据保持
         */
        tab2KeepData: function () {
            var me = this;
            var data = me.data;
            var albumName = me.albumName;

            if (Page.tabId === 'tab-2' && albumName) {
                data.forEach(function (v, i) {
                    if (v.alias_name === albumName) {
                        me.data[i] = me.data[2];
                        me.data[2] = v;
                    }
                })
            }
        },

        /**
         * 专辑跳转
         */
        onClickAlbum: function (btn) {
            var album = Tab2.linkAlbum;
            if (!album) {
                LMEPG.UI.showToast('未配置该专辑哦 ~');
                return;
            }
            var albumAliasName = album.alias_name;
            PageJump.jumpAlbumPage(albumAliasName, btn);
        },
        /**
         * 对数据处理：
         * 始终保持渲染最大个数
         */
        addItem: function () {
            var data = RenderParam.albumList.list || [];
            if (!data || (data && data.length < 3)) {
                data.length = 5;
            }
            this.data = data;
        },

        /**
         * 对流操作
         */
        loop: function (direction) {
            Tab2.key = direction;
            Tab2.updateImageArray();
        },
        /**
         * 渲染当前专辑
         * Np：当前图片数组长度
         * linkAlbum: 跳转专辑对象
         */
        renderImg: function () {
            var data = this.data;
            var len = 5; // 一次渲染最大长度
            var wrap = G('tab2-carousel-wrapper');
            var htm = '';
            var src = '';
            var item = null;
            var img = null;
            var isLoaderImage = null;
            var placeHolderImage = g_appRootPath + '/Public/img/Common/default.png';
            while (len--) {
                item = data[len];
                if(typeof item.list_image_url == "string"){
                    item.list_image_url = JSON.parse(item.list_image_url);
                }
                src = item && item.list_image_url && RenderParam.fsUrl + item.list_image_url.large;

                isLoaderImage = !/.*\.(jpg|png)/.test(src) ? placeHolderImage : src;
                img = '<img '
                    + 'onerror="' + placeHolderImage + '"'
                    + 'id="sift-' + len + '" '
                    + 'class="lv-' + len + '" '
                    + 'src="' + isLoaderImage + '">';

                // 中间位置
                if (len === 2) {
                    img = '<div id="item-center">' + img + '</div>';
                    this.linkAlbum = item;
                }
                htm += img;
            }
            console.log("innerHTML = " + htm)
            // 渲染banner
            wrap.innerHTML = htm;
            // 空数据处理
            LMEPG.UI.isEmptyAddTip(data.length === 0, wrap, function () {
                H('tab2-prev-arrow');
                H('tab2-next-arrow');
            });
        },

        /**
         * 更新当前图片数组
         */
        updateImageArray: function () {
            if (this.key == 'left') {
                this.data.unshift(this.data.pop());
            } else {
                this.data.push(this.data.shift());
            }

            this.renderImg();
        },

        createBtns: function () {
            buttons.push({
                id: 'sift-2',
                type: 'others',
                nextFocusUp: 'tab-2',
                click: this.onClickAlbum,
                focusChange: this.onFocusIn,
                beforeMoveChange: this.onMoveChange
            });
        },

        onFocusIn: function (btn, hasFocus) {
            var focusElement = G('item-center');
            if (hasFocus) {
                focusElement.className = 'focus';
            } else {
                focusElement.className = '';
            }
        },

        onMoveChange: function (direction, btn) {
            if (direction == 'left' || direction == 'right') {
                Tab2.loop(direction);
                LMEPG.BM.requestFocus('sift-2');
                return false;
            }
        },

        /**
         * 自动轮播（已被CP丢掉）
         */
        carousel: function () {
            this.timer = setInterval(this.loop, 3222);
        }
    };
</script>

    </div>
    <div id="content-3" class="content">
        <div id="user-container">
    <?php if($carrierId == '371092'): ?><img id="user-pic" src="/Public/img/hd/Home/V13/Home/Tab3/unvip_371092.png">
        <?php else: ?>
        <img id="user-pic" src="/Public/img/hd/Home/V13/Home/Tab3/unvip.png"><?php endif; ?>

    <p id="user-account"></p>
    <img id="join-vip" src="/Public/img/hd/Home/V13/Home/Tab3/join_vip.png">
</div>
<div id="record-container">
    <img src="" id="tab3-link-1">
    <img src="" id="tab3-link-2">
    <img src="" id="tab3-link-3">
    <img src="" id="tab3-link-4">
    <img src="" id="tab3-link-5">
    <img src="" id="tab3-link-6">
</div>
<div id="tab3-help" class="tab-help-wrap">
    <img id="tab3-help0" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab3_help0.png">
    <img id="tab3-help1" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab3_help1.png">
    <img id="tab3-help2" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab3_help2.png">
    <img id="tab3-help3" src="/Public/img/<?php echo ($platformType); ?>/Help/V13/tab3_help3.png">
</div>
<script type="text/javascript">
    var Tab3 = {
        isLoad: false,
        init: function () {
            this.renderTab3();
            this.createBtns();

            if(RenderParam.carrierId === '430002'){
                G('record-container').style.top = '85px'
            }
        },

        /**
         * 点击跳转有页面
         */
        onClickJumpPage: function (btn) {
            var curObj = getCurPageObj();
            var jumpId = {
                'collect-record': 'collect',
                'play-record': 'historyPlay',
                'family-record': 'familyEdit',
                'order-record': 'expertRecordHome',
                'debook-record': 'debook'
            };
            if (RenderParam.platformType == 'sd' && btn.id == "order-record") {
                LMEPG.UI.showToast('不支持的盒子类型！', 1.5);
                return;
            }
            var dstObj = LMEPG.Intent.createIntent(jumpId[btn.id]);
            LMEPG.Intent.jump(dstObj, curObj);
        },

        /**
         * 渲染Tab3
         */
        renderTab3: function () {
            // 辽宁电信隐藏“我的”tab页面

            if (RenderParam.carrierId == '210092') {
                var el = G("content-3");
                el.parentNode.removeChild(el);
                el = G("tab-3");
                el.parentNode.removeChild(el);
                return;
            }
            var data = RenderParam.configInfo && RenderParam.configInfo.data;

            var indexStart = 0;
            var indexEnd = 0;
            // 部分地区需重新设置推荐位内容起始下标
            // if(resetIndexCarriers.indexOf(RenderParam.carrierId) > -1){
            // “我的”模块后台配置位置的position 从41开始
            for (var dataIndex = 0; dataIndex < data.entry_list.length; dataIndex++) {
                if (data.entry_list[dataIndex].position == 41) {
                    indexStart = dataIndex;
                    indexEnd = dataIndex + 6;
                    break;
                }
            }
            // }

            var configList = data && data.entry_list && data.entry_list.slice(indexStart, indexEnd);
            var tab3Data = [41, 42, 43, 44, 45, 46]; // “我的”模块后台配置位置的position
            var item = '';
            var htm = '';
            var index = '';

            for (var i = 0; i < configList.length; i++) {
                item = configList[i];
                index = tab3Data.indexOf(+item.position);
                if (index > -1) {
                    htm += '<img src="' + Page.getImg(item.item_data[0].img_url) + '"  id="tab3-link-' + (index + 1) + '">'
                }
            }

            // 如果是vip，隐藏加入会员按钮
            if (RenderParam.isVip == 1) {
                H('join-vip');
                var vipImagePath = g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab3/vip.png';
                if (RenderParam.carrierId == '371092') {
                    vipImagePath = g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab3/vip_371092.png';
                }
                G('user-pic').src = vipImagePath;
            }
            G('record-container').innerHTML = htm;
            G('user-account').innerHTML = '账户ID：' + RenderParam.accountId;
        },

        /**
         * 创建按钮
         */
        createBtns: function () {
            var orderImagePath = g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab3/join_vip.png';
            var orderImageFPath = g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab3/join_vip_f.png';
            if (RenderParam.carrierId == '371092') {
                orderImagePath = g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab3/join_vip_371092.png';
                orderImageFPath = g_appRootPath + '/Public/img/hd/Home/V13/Home/Tab3/join_vip_371092_f.png';
            }
            buttons.push({
                id: 'join-vip',
                type: 'img',
                name: '加入会员',
                nextFocusUp: 'tab-3',
                nextFocusRight: "tab3-link-1",
                backgroundImage: orderImagePath,
                focusImage: orderImageFPath,
                click: this.joinVip,
                focusChange: this.onFocusIn
            }, {
                id: 'tab3-link-1',
                type: 'img',
                name: '推荐位1',
                nextFocusUp: 'tab-3',
                nextFocusDown: isShow('tab3-link-4') ? 'tab3-link-4' : '',
                nextFocusLeft: RenderParam.isVip == 0 ? 'join-vip' : "",
                nextFocusRight: 'tab3-link-2',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cPosition: 41
            }, {
                id: 'tab3-link-2',
                type: 'img',
                name: '推荐位2',
                nextFocusUp: 'tab-3',
                nextFocusDown: isShow('tab3-link-5') ? 'tab3-link-5' : isShow('tab3-link-4') ? 'tab3-link-4' : '',
                nextFocusLeft: "tab3-link-1",
                nextFocusRight: 'tab3-link-3',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cPosition: 42
            }, {
                id: 'tab3-link-3',
                type: 'img',
                name: '推荐位3',
                nextFocusUp: 'tab-3',
                nextFocusDown: isShow('tab3-link-6') ? 'tab3-link-6' : isShow('tab3-link-4') ? 'tab3-link-4' : '',
                nextFocusLeft: 'tab3-link-2',
                nextFocusRight: '',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cPosition: 43
            }, {
                id: 'tab3-link-4',
                type: 'img',
                name: '推荐位4',
                nextFocusUp: 'tab3-link-1',
                nextFocusLeft: RenderParam.isVip == 0 ? 'join-vip' : "",
                nextFocusRight: isShow('tab3-link-5') ? 'tab3-link-5' : '',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cPosition: 44
            }, {
                id: 'tab3-link-5',
                type: 'img',
                name: '推荐位5',
                nextFocusUp: 'tab3-link-2',
                nextFocusLeft: 'tab3-link-4',
                nextFocusRight: 'tab3-link-6',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cPosition: 45
            }, {
                id: 'tab3-link-6',
                type: 'img',
                name: '推荐位6',
                nextFocusUp: 'tab3-link-3',
                nextFocusLeft: 'tab3-link-5',
                click: Page.onClickRecommendPosition,
                focusChange: this.onFocusIn,
                cPosition: 46
            });
        },
        joinVip: function () {
            if (RenderParam.carrierId == CARRIER_ID_SHANDONG_HICON || RenderParam.carrierId == "371002") {
                // 山东电信海看埋点上报推荐位点击事件
                var turnPageInfo = {
                    currentPage: location.href,   // 跳转前页面
                    turnPage: location.origin + "/index/Home/Pay/indexV1",
                    turnPageName: "订购详情页",
                    turnPageId: "",
                    clickId: '39JKWD-1-1'
                };
                ShanDongHaiKan.sendReportData('6', turnPageInfo);
            }
            PageJump.jumpBuyVip();
        },
        onFocusIn: function (btn, hasFocus) {
            var btnElement = G(btn.id);
            if (hasFocus) {
                btnElement.className = 'focus';
            } else {
                btnElement.className = '';
            }
        }
    };
</script>
    </div>
</div>
<!--滚动字体提示栏、服务电话栏-->
<div id="bottom-container">
    <!-- 修改：js异步加载 -->
    <div class="marquee-wrapper" id="scroll-wrapper"></div>
    <p id="service-tel" class="service-tel hide">客服电话：400-016-0700</p>
</div>
</body>
<script type="text/javascript">

    /**
     * 文档加载
     */
    /*window.onload = function () {
        LMEPG.Log.info('[v13 home.js]--->[window.onload]--->界面初始化: ');
        RenderParam.carrierId == '440004' && updateData440004();
        Page.init();
        LmOrderConf.init({getCurrentPage: getCurPageObj});
        RenderParam.carrierId == "410092" && backHander410092()
        RenderParam.carrierId == "450092" ? LMEPG.Func.execSpecialCode(RenderParam.specialCode) : lmInitGo();
        loadByCarrierId();
        LMEPG.Func.isErrorForceEventBack();
        setPageSize();
        get_focus();
    };*/


    /**
     * 更新数据，广东广电WEB-EPG-纯WEB版本
     */
    function updateData440004() {
        RenderParam.videoAuthUrl = '<?php echo ($VIDEO_AUTH_URL); ?>';
        RenderParam.requestPlay = '<?php echo ($REQUEST_PLAY); ?>';
        RenderParam.getVideoInfoUrl = '<?php echo ($GET_VIDEO_INFO); ?>';
        RenderParam.startPlayUrl = '<?php echo ($START_PLAY); ?>';
        RenderParam.pausePlayUrl = '<?php echo ($PAUSE_PLAY); ?>';
    }

    /**
     * 处理河南电信EPG的返回
     */
    function backHander410092() {
        LMEPG.Log.info('init HybirdCallBackInterface !!!!!');
        try {
            HybirdCallBackInterface.setCallFunction(function (param) {
                LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                    // 暖春活动进入首页，lmp=15，需要返回到活动首页
                    RenderParam.lmp == 15 ? LMEPG.Intent.back('IPTVPortal') : PageJump.jumpHoldPage();
                }
            });
        } catch (e) {
            LMEPG.UI.logPanel.show("e");
        }
    }

    /**
     * 统一的WebViewJavascriptBridge调用入口
     * @param tag 方法名
     * @param params  参数
     * @param callback 回调
     * @constructor
     */
    function Bridge(tag, params, callback) {
        if (window.WebViewJavascriptBridge) {
            LMEPG.Log.info('[home.html]--->[Bridge]--->tag:' + tag + " params:" + JSON.stringify(params));
            WebViewJavascriptBridge.callHandler(
                tag,
                params,
                callback
            );
        } else {
            LMEPG.Log.info('[home.html]--->[Bridge111]--->tag:' + tag + " params:" + JSON.stringify(params));
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function () {
                    WebViewJavascriptBridge.callHandler(
                        tag,
                        params,
                        callback
                    );
                },
                false
            );
        }
    }

    /**
     * 获取当前页面获取焦点
     * @param callback 回调函数
     */
    function get_focus() {
        var defaultId = window.document.getElementById('default_link');
        if (typeof defaultId !== "undefined" && typeof defaultId.focus !== "undefined") {
            defaultId.focus();
        }
        setTimeout(function () {
            get_focus();
        }, 1000);
    }

    /**
     * 设置页面大小
     */
    function setPageSize() {
        var meta = document.getElementsByTagName('meta');
        if (typeof meta !== "undefined" && meta["page-view-size"]) {
            if (RenderParam.platformType == "hd") {
                meta["page-view-size"].setAttribute('content', "1280*720");
            } else {
                meta["page-view-size"].setAttribute('content', "640*530");
            }
            var contentSize = meta["page-view-size"].getAttribute('content');
            if (contentSize !== '1280*720' || contentSize !== '640*530') {
                setTimeout(setPageSize, 500);
            }
        }

    }

    /**
     * 获取配置信息
     * @param callback 回调函数
     */
    function getEpgConfig(callback) {
        LMEPG.Log.info('[home.html]--->[getEpgConfig]--->');
        Bridge("GetConfig", {'param': ""}, callback);
    }

    window.onload = function () {
        LMEPG.Log.info('[v13 home.js]--->[window.onload]--->界面初始化: ');
        if (RenderParam.carrierId == '440004') {
            RenderParam.videoAuthUrl = '<?php echo ($VIDEO_AUTH_URL); ?>';
            RenderParam.requestPlay = '<?php echo ($REQUEST_PLAY); ?>';
            RenderParam.getVideoInfoUrl = '<?php echo ($GET_VIDEO_INFO); ?>';
            RenderParam.startPlayUrl = '<?php echo ($START_PLAY); ?>';
            RenderParam.pausePlayUrl = '<?php echo ($PAUSE_PLAY); ?>';
        }
        if(RenderParam.carrierId === '450004') { // 广西广电apk
            LMAndroid.JSCallAndroid.doUpdateDefaultBackground(function (param, notifyAndroidCallback) {});
        }
        Page.init();
        LmOrderConf.init({
            getCurrentPage: getCurPageObj
        });
        // 处理河南电信EPG的返回
        if (RenderParam.carrierId == "410092") {
            LMEPG.Log.info('init HybirdCallBackInterface !!!!!');
            try {
                HybirdCallBackInterface.setCallFunction(function (param) {
                    LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                    if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                        // 暖春活动进入首页，lmp=15，需要返回到活动首页
                        if (RenderParam.lmp == 15) {
                            LMEPG.Intent.back('IPTVPortal');
                        } else if (RenderParam.isJoinActivit == '1') {
                            LMEPG.Intent.back();
                        } else {
                            // HybirdCallBackInterface.quitActivity();
                            PageJump.jumpHoldPage();
                        }
                    }
                });
            } catch (e) {
                LMEPG.UI.logPanel.show("e");
            }
        }


        if (RenderParam.carrierId == "450092") {
            LMEPG.Func.execSpecialCode(RenderParam.specialCode);
        } else {
            lmInitGo();
        }
        loadByCarrierId();
        LMEPG.Func.isErrorForceEventBack();
        if(RenderParam.setPageSizeState === '1') {
            setPageSize();
        }
        get_focus();
        if(RenderParam.carrierId === "440001"){
            uploadVideoData();
        }
    };

    function uploadVideoData(){
        LMEPG.ajax.postAPI('Player/getRecommendVideoInfo', null, function (rsp) {
            if(rsp.result === 0){
                var val = JSON.parse(rsp.data[0].ftp_url);
                var data = {
                    startTime:getNowDate() ,
                    contentId:val.gq_ftp_url,
                    contentName:rsp.data[0].title,
                };
                LMEPG.Log.info("uploadData data:"+JSON.stringify(data));
                LMAndroid.jsCallAndroid('doExportContentDetail', JSON.stringify(data), '');
            }
        });
    }
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getNowDate() {
        var dateTime=new Date();
        dateTime=dateTime.setSeconds(dateTime.getSeconds()- getRandom(40,120));
        var date = new Date(dateTime);
        var year = date.getFullYear() // 年
        var month = date.getMonth() + 1; // 月
        var day  = date.getDate(); // 日
        var hour = date.getHours(); // 时
        var minutes = date.getMinutes(); // 分
        var seconds = date.getSeconds() //秒
        // 给一位数数据前面加 “0”
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }
        if (hour >= 0 && hour <= 9) {
            hour = "0" + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        var currentdate = year  + month  + day +  hour  + minutes  + seconds;
        return currentdate;
    }

</script>
<script type="text/javascript" src="/Public/js/Unclassified/ByCarrierIdSet.js?t=<?php echo ($time); ?>"></script>
</html>