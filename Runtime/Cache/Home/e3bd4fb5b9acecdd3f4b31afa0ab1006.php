<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-cn">
<head>
    <title>导航页</title>
    <meta charset="utf-8" name="page-view-size" content="<?php echo ($size); ?>">

    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Splash/splash.css"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/common.css"/>

    <!--全局渲染参数-->
    <script type="text/javascript">
        var RenderParam = {
            //公共渲染
            isRunOnAndroid: "<?php echo ($isRunOnAndroid); ?>",// 是否运行在apk平台
            carrierId: "<?php echo ($carrierId); ?>",          // 地区id
            lmp: '<?php echo ($lmp); ?>',                      // 入口
            areaCode: "<?php echo ($areaCode); ?>",            // 省份地区码
            subAreaCode: "<?php echo ($subAreaCode); ?>",      // 省份下的子区域
            platformType: "<?php echo ($platformType); ?>",    // 平台类型
            debug: "<?php echo ($debug); ?>",                  // 调试模式
            pageSize: "<?php echo ($size); ?>",                // 页面尺寸
            stbModel: "<?php echo ($stbModel); ?>",            // 盒子的型号
            fsUrl: "<?php echo ($resourcesUrl); ?>",           // fs 地址
            time: "<?php echo ($time); ?>",                    // 开始渲染时间
            userId: "",                         // 用户Id
            isVip: "",                          // 用户等级
            accountId: '<?php echo ($accountId); ?>',          // 局方用户标识
            carrierIdTable: <?php echo ($carrierIdTable); ?>,  // 地区编码映射表

            //当前页渲染
            userfromType: "<?php echo ($userfromType); ?>",
            subId: <?php echo ($subId); ?>,
            fromId: "<?php echo ($fromId); ?>",
            epgSplashPictureUrl: '<?php echo ($epgSplashPictureUrl); ?>',
            intentType: "<?php echo ($intentType); ?>",
            START_DURATION_TIME: 3000,          // 设置初始化时间
            productId: "<?php echo ($productId); ?>",          // 39健康计费套餐id，用于鉴权等操作
            spid: "<?php echo ($spid); ?>",                    // 第三方标识
            payMethod: "",
            reportData: 0,
            enterAppTime: <?php echo ($enterAppTime); ?>,                // 进入应用的时间戳
            enterSplashTime: <?php echo ($time); ?>,                     // 进入启动页面的时间戳
            serverPath: "<?php echo ($serverPath); ?>",                  // 重庆电信EPG 局方计费地址
            authCode: "<?php echo ($authCode); ?>",                      // 海看(山东电信)EPG -- 鉴权Code
            isNewTVPlatform: "<?php echo ($isNewTVPlatform); ?>",        // 是否运行在未来电视平台
            isAuthByAndroidSDK: "<?php echo ($isAuthByAndroidSDK); ?>",  // 安卓平台鉴权是否使用底层SDK
            version: '<?php echo ($version); ?>',                        // 安卓平台当前使用的客户端版本号
            isEnterFromYsten: '<?php echo ($isEnterFromYsten); ?>',      // 是否从使用易视腾鉴权计费接口的入口进入（广东移动APK融合包）
        };
        //清除cookie-->c_carrier_id
        document.cookie = "c_carrier_id"+"=;expires="+(new Date(0)).toGMTString();
    </script>
</head>

<body>
<!--背景-->
<img id="splash"/>
<img id="splash_icon" class="splash_icon" src="/Public/img/Common/spacer.gif" alt="" style="display: none;"/>
<!-- 默认标签 -->
<a id="default_link" href="#"><img class="grubFocusImg" src="/Public/img/Common/spacer.gif"/></a>

<!-- 开屏广告信息展示 -->
<div id="ad_container_div" style="display: none;">
    <img id="ad_image" src="/Public/img/Common/spacer.gif" alt=""/>
    <div class="ad_showTime_bg">广告剩余&nbsp;<span id="ad_showTime"></span>&nbsp;秒</div>
</div>

<?php if($carrierId == '07430093' ): ?><!--湖南联通芒果TV 07430093js文件-->
    <script type="text/javascript" src="/Public/ThirdParty/js/mongoTV/webview.js"></script><?php endif; ?>

<!--第三方依赖库-->
<script type="text/javascript" src="/Public/ThirdParty/js/json2.js"></script>

<!--公用库-->
<script type="text/javascript" src="/Public/Common/js/lmcommon.js"></script>
<?php if(($isRunOnAndroid) == "1"): ?><script type="text/javascript" src="/Public/Common/js/android.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
<script type="text/javascript" src="/Public/Common/js/lmui.js"></script>
<script type="text/javascript" src="/Public/js/Splash/lmSplash.js?t=<?php echo ($time); ?>"></script>

<?php switch($carrierId): case CARRIER_ID_GUANGXIGD: ?><!--广西广电视频鉴权地址-->
        <script type="text/javascript" src="http://10.1.15.25/webJS/starcorCom.js?t=<?php echo ($time); ?>"></script><?php break;?>
    <?php case CARRIER_ID_GUIZHOUGD: ?><!--贵州广电js文件-->
        <script type="text/javascript"
                src="http://epg.interface.gzgd/nn_cms/data/webapp/common/gzgd.config.js"></script>
        <script type="text/javascript" src="/Public/ThirdParty/js/520094/starcorCom.js"></script>
        <script type="text/javascript" src="http://epg.interface.gzgd/nn_cms/data/webapp/common/zf_v2/pay.js"></script>
        <script type="text/javascript" src="/Public/ThirdParty/js/520094/gzgdPay.js"></script><?php break;?>
    <?php case CARRIER_ID_MANGOTV_YD: ?><!--芒果TV（移动）-->
        <script type="text/javascript" src="/Public/ThirdParty/js/mongoTV/mylib.js"></script><?php break;?>
    <?php case CARRIER_ID_MANGOTV_LT: ?><!--芒果TV（联通）-->
        <script type="text/javascript" src="/Public/ThirdParty/js/mongoTV/mylib.js"></script><?php break;?>
    <?php case CARRIER_ID_GUANGDONGGD_NEW: ?><!--广东广电-纯WEB版本-->
        <script type="text/javascript" src="/Public/ThirdParty/js/440004/WebViewJavascriptBridge.js"></script><?php break; endswitch;?>

<?php if(($carrierId) == "640001"): ?><!--宁夏移动js文件-->
    <script type="text/javascript" src="/Public/js/Pay/V640001/pay_sdk_util.js"></script><?php endif; ?>

<?php if(($carrierId) == "620007"): ?><!--甘肃移动js文件-->
    <script type="text/javascript" src="/Public/js/Pay/V620007/V5/pay_sdk_util.js"></script><?php endif; ?>

<?php if(($carrierId) == "450001"): ?><!--广西移动js文件-->
    <script type="text/javascript" src="/Public/js/Pay/V450001/pay_sdk_util.js"></script><?php endif; ?>

<?php if(($carrierId) == "01230001"): ?><!--黑龙江移动js文件-->
    <script type="text/javascript" src="/Public/js/Pay/V01230001/pay_sdk_util.js"></script><?php endif; ?>

<?php if(($carrierId) == "09000001"): ?><!--未来电视怡伴健康统一机接口js文件-->
    <script type="text/javascript" src="/Public/js/Pay/V09000001/pay_sdk_util.js"></script><?php endif; ?>

<?php if(($carrierId) == "09450001"): ?><!--未来电视触摸设备js文件-->
    <script type="text/javascript" src="/Public/js/Pay/V09450001/pay_sdk_util.js"></script><?php endif; ?>

<?php if(defined("HANDLE_SPLASH_SELF")): ?><!--欢迎页面鉴权逻辑，部分地区单独路由外部功能模块或者需要特殊处理的逻辑-->
    <script type="text/javascript" src="/Public/js/Splash/splash<?php echo ($carrierId); ?>.js?t=<?php echo ($time); ?>"></script><?php endif; ?>

<?php if(defined("AUTH_USER_WITH_WEB")): ?><!--欢迎页面鉴权逻辑，部分地区需要前端使用js逻辑获取用户参数并进行用户鉴权，这部分逻辑单独生成js文件控制-->
    <script type="text/javascript" src="/Public/js/User/auth<?php echo ($carrierId); ?>.js?t=<?php echo ($time); ?>"></script><?php endif; ?>

<?php if(($carrierId == CARRIER_ID_JIANGSUDX) OR ($carrierId == CARRIER_ID_FUJIANDX) OR ($carrierId == CARRIER_ID_HUBEIDX) OR ($carrierId == CARRIER_ID_JIANGSUDX_OTT) OR ($carrierId == CARRIER_ID_GUANGDONGGD) OR ($carrierId == CARRIER_ID_GUANGXIDX) OR ($carrierId == CARRIER_ID_CHONGQINGDX)): ?><script type="text/javascript" src="/Public/js/Splash/splashRouterTelecom.js?t=<?php echo ($time); ?>"></script><?php endif; ?>

<!--页面加载完成-->
<script type="text/javascript">

    window.onload = function () {
        LMSplashController.init();
    };

    // 页面错误
    window.onerror = function (message, filename, lineno) {
        var errorLog = '[splash.js]::error --->' + '\nmessage:' + message + '\nfile_name:' + filename + '\nline_NO:' + lineno;
        LMEPG.Log.error('window.onerror:' + errorLog);
        LMEPG.UI.showToast(errorLog, 100);
    };
</script>
</body>
</html>