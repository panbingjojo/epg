<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    <title>39健康-主页V12</title>

    <meta charset="utf-8" name="page-view-size" content="<?php echo ($size); ?>">

    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/common.css?t=<?php echo ($time); ?>"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Home/V12/home.css?t=<?php echo ($time); ?>"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Player/V1/volume.css?t=<?php echo ($time); ?>"/>

    <!--全局渲染参数-->
    <script type="text/javascript" >
        var RenderParam = {
            //公共渲染
            carrierId: "<?php echo ($carrierId); ?>",          // 地区id
            areaCode: "<?php echo ($areaCode); ?>",            // 省份地区码
            platformType: "<?php echo ($platformType); ?>",    // 平台类型
            debug: "<?php echo ($debug); ?>",                  // 调试模式
            pageSize: "<?php echo ($pageSize); ?>",            // 页面尺寸
            stbModel: "<?php echo ($stbModel); ?>",            // 盒子的型号
            fsUrl: "<?php echo ($resourcesUrl); ?>",           // fs 地址
            time: "<?php echo ($time); ?>",                    // 开始渲染时间
            userId: "<?php echo ($userId); ?>",                // 用户Id

            checkTime : "<?php echo ($checkTime); ?>",
            commonImgsView: "<?php echo ($commonImgsView); ?>",                // 公用图片模式
            themeImage: "<?php echo ($themePicture); ?>",                      // 应用主题背景
            thirdPlayerUrl: "<?php echo ($domainUrl); ?>",                     // 第三方播放器根路径地址
            focusIndex: "<?php echo ($focusIndex); ?>",                        // 焦点ID
            isVip: <?php echo ($isVip); ?>,                                    // 用户是否是vip
            classifyId: "<?php echo ($classifyId); ?>",                        // 导航栏ID
            navConfig: <?php echo (json_encode($navigateInfo->data )); ?>,     // 导航栏配置
            initPositionList: <?php echo ($positionList); ?>,                  // 第一个推荐位数据
            homePollVideoList: <?php echo ($homePollVideoList); ?>,            // 首页轮播的视频列表
            recommendDataList: <?php echo (json_encode($dataList )); ?>,       // 推荐位数据列表
            accessInquiryInfo: <?php echo (json_encode($accessInquiryInfo )); ?>, // 是否能访问视频问诊,1--表示能访问
            toastPicUrl: "/Public/img/<?php echo ($platformType); ?>/Common/",
        }
    </script>

    <!--第三方依赖库-->
    <script type="text/javascript" src="/Public/ThirdParty/js/json2.js?t=<?php echo ($time); ?>"></script>
    <!--公共库-->
    <script type="text/javascript" src="/Public/Common/js/lmcommon.js?t=<?php echo ($time); ?>"></script>
<?php if(($isRunOnAndroid) == "1"): ?><script type="text/javascript" src="/Public/Common/js/android.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
    <script type="text/javascript" src="/Public/Common/js/lmui.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/Common/js/lmplayer.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/Common/js/lmauthEx.js?t=<?php echo ($time); ?>"></script>
    <!--当前模块js-->
    <script type="text/javascript" src="/Public/js/Home/V8/home.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/js/Pay/lmOrderConf.js?t=<?php echo ($time); ?>"></script>
</head>

<body>
<!-- 默认标签 -->
<a id="default_link" href="#"><img class="grubFocusImg" src="/Public/img/Common/spacer.gif" alt=""/></a>
<div id="home_container">
    <!--应用图标-->
    <img class="logo" id="logo" src="/Public/img/<?php echo ($platformType); ?>/Home/V8/icon_logo.png" alt=""/>
    <!--上方导航菜单-->
    <div class="navs">
        <div>
            <img id="nav_0" src="<?php echo $resourcesUrl.json_decode($navigateInfo->data[0]->img_url)->normal ?>"
                 alt=""/>
        </div>
        <div>
            <img id="nav_1" src="<?php echo $resourcesUrl.json_decode($navigateInfo->data[1]->img_url)->normal ?>"
                 alt=""/>
        </div>
        <div>
            <img id="nav_2" src="<?php echo $resourcesUrl.json_decode($navigateInfo->data[2]->img_url)->normal ?>"
                 alt=""/>
        </div>
        <div>
            <img id="nav_3" src="<?php echo $resourcesUrl.json_decode($navigateInfo->data[3]->img_url)->normal ?>"
                 alt=""/>
        </div>
        <div>
            <img id="nav_4" src="<?php echo $resourcesUrl.json_decode($navigateInfo->data[4]->img_url)->normal ?>"
                 alt=""/>
        </div>
    </div>

    <!--左侧菜单栏-->
    <div class="left_menu">
        <img id="menu_border_0" src="/Public/img/Common/spacer.gif" alt=""/>
        <div class="menu_parent_0">
            <img id="menu_0" src="/Public/img/<?php echo ($platformType); ?>/Home/V8/bg_buy_vip.png" alt=""/>
        </div>
        <img id="menu_border_1" src="/Public/img/Common/spacer.gif" alt=""/>
        <div class="menu_parent_1">
<!--            <?php if($carrierId == 220094): ?>-->
<!--                <img id="menu_1" src="/Public/img/<?php echo ($platformType); ?>/Home/V12/bg_register.png" alt=""/>-->
<!--            <?php else: ?>-->
<!--                <img id="menu_1" src="/Public/img/<?php echo ($platformType); ?>/Home/V12/bg_inquiry.png" alt=""/>-->
<!--<?php endif; ?>-->
            <img id="menu_1" src="/Public/img/<?php echo ($platformType); ?>/Home/V12/bg_inquiry.png" alt=""/>
        </div>
        <img id="menu_border_2" src="/Public/img/Common/spacer.gif" alt=""/>
        <div class="menu_parent_2">
<!--            <?php if($carrierId == 220094): ?>-->
<!--                <img id="menu_2" src="/Public/img/<?php echo ($platformType); ?>/Home/V12/bg_collect.png" alt=""/>-->
<!--            <?php else: ?>-->
<!--                <img id="menu_2" src="/Public/img/<?php echo ($platformType); ?>/Home/V8/bg_inspect.png" alt=""/>-->
<!--<?php endif; ?>-->
            <img id="menu_2" src="/Public/img/<?php echo ($platformType); ?>/Home/V8/bg_inspect.png" alt=""/>
        </div>
        <img id="menu_border_3" src="/Public/img/Common/spacer.gif" alt=""/>
        <div class="menu_parent_3">
            <img id="menu_3" src="/Public/img/<?php echo ($platformType); ?>/Home/V8/bg_search.png" alt=""/>
        </div>
        <img id="menu_border_4" src="/Public/img/Common/spacer.gif" alt=""/>
        <div class="menu_parent_4">
<!--            <?php if($carrierId == 220094): ?>-->
<!--                <img id="menu_4" src="/Public/img/<?php echo ($platformType); ?>/Home/V12/bg_about_us.png" alt=""/>-->
<!--            <?php else: ?>-->
<!--                <img id="menu_4" src="/Public/img/<?php echo ($platformType); ?>/Home/V8/bg_my_family.png" alt=""/>-->
<!--<?php endif; ?>-->
            <img id="menu_4" src="/Public/img/<?php echo ($platformType); ?>/Home/V8/bg_my_family.png" alt=""/>
        </div>
    </div>

    <!--推荐位-->
    <div id="recommends">
        <!--动态增加 推荐位样式-->
        <div class="recommends">
            <!--推荐位1 焦点框-->
            <img id="recommend_border_1" src="/Public/img/Common/spacer.gif" alt=""/>
            <!--推荐位内容-->
            <div class="recommend_parent_1">
                <!--背景图片-->
                <img id="recommend_1" src="/Public/img/Common/spacer.gif" alt=""/>
                <!--专家提示内容-->
                <div id="recommend_text_1">
                    <div id="expert_title">
                        问诊提示：
                    </div>
                    <div id="expert_tips"></div>
                </div>
                <!--指示器-->
                <div id="recommend_indicator_1" class="recommend_indicator_1">
                    <img id="indicator_0" class="indicator_0"
                         src="/Public/img/<?php echo ($platformType); ?>/Home/V8/icon_indicator_point.png" alt=""/>
                    <img id="indicator_1" class="indicator_1"
                         src="/Public/img/<?php echo ($platformType); ?>/Home/V8/icon_indicator_point.png" alt=""/>
                    <img id="indicator_2" class="indicator_2"
                         src="/Public/img/<?php echo ($platformType); ?>/Home/V8/icon_indicator_point.png" alt=""/>
                </div>
            </div>

            <!--推荐位2 焦点框-->
            <img id="recommend_border_2" src="/Public/img/Common/spacer.gif" alt=""/>
            <!--推荐位内容-->
            <div class="recommend_parent_2">
                <div class="small_screen_player">
                    <iframe id="iframe_small_screen" frameborder="0" scrolling="no"></iframe>
                </div>
            </div>

            <!--推荐位3 焦点框-->
            <img id="recommend_border_3" src="/Public/img/Common/spacer.gif" alt=""/>
            <div class="recommend_parent_3">
                <img id="recommend_3" src="/Public/img/Common/spacer.gif" alt=""/>
            </div>

            <!--推荐位4 焦点框-->
            <img id="recommend_border_4" src="/Public/img/Common/spacer.gif" alt=""/>
            <div class="recommend_parent_4">
                <img id="recommend_4" src="/Public/img/Common/spacer.gif" alt=""/>
            </div>

            <!--推荐位5 焦点框-->
            <img id="recommend_border_5" src="/Public/img/Common/spacer.gif" alt=""/>
            <div class="recommend_parent_5">
                <img id="recommend_5" src="/Public/img/Common/spacer.gif" alt=""/>
            </div>

            <!--推荐位6 焦点框-->
            <img id="recommend_border_6" src="/Public/img/Common/spacer.gif" alt=""/>
            <div class="recommend_parent_6">
                <img id="recommend_6" src="/Public/img/Common/spacer.gif" alt=""/>
            </div>

            <!--推荐位7 焦点框-->
            <img id="recommend_border_7" src="/Public/img/Common/spacer.gif" alt=""/>
            <div class="recommend_parent_7">
                <img id="recommend_7" src="/Public/img/Common/spacer.gif" alt=""/>
            </div>
        </div>
    </div>

    <!-- 字幕层 修改：JS异步加载 -->
    <div id="scroll_message"></div>

    <!--音量控制器容器-->
    <div id="volume_container"></div>
</div>

<div id="toast"></div>

<!--加载-->
<script type="text/javascript">
    window.onload = function () {
        Home.init();
        LmOrderConf.init({
            getCurrentPage: Page.getCurrentPage,
        });
        lmInitGo();
    }
</script>
</body>

</html>