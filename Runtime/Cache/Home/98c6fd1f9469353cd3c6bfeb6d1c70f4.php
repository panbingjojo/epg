<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>挽留页-V7</title>
    <meta charset="utf-8" name="page-view-size" content="<?php echo ($size); ?>">

    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/common.css?t=<?php echo ($time); ?>"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Hold/V7/hold.css?t=<?php echo ($time); ?>"/>

    <script>var carrierId = <?php echo ($carrierId); ?>;</script>
    <?php if($carrierId == '07430093' ): ?><!--湖南联通芒果TV 07430093js文件-->
        <script type="text/javascript" src="/Public/ThirdParty/js/mongoTV/webview.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
    <?php if($carrierId == '410092' ): ?><!--河南电信EPG js文件-->
        <script type="text/javascript" src="/Public/ThirdParty/js/410092/vod_utils.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
    <!--全局渲染变量-->
    <script type="text/javascript" >
        var RenderParam = <?php echo (json_encode($renderParam )); ?>; // 把控制器传过来的参数进行解析，并进行json编码
        var UserFromType = "<?php echo ($userFromType); ?>";
    </script>
    <!--第三方依赖库-->
    <script type="text/javascript" src="/Public/ThirdParty/js/json2.js?t=<?php echo ($time); ?>"></script>
    <!--公用库-->
    <script type="text/javascript" src="/Public/Common/js/lmcommon.js?t=<?php echo ($time); ?>"></script>
<?php if(($isRunOnAndroid) == "1"): ?><script type="text/javascript" src="/Public/Common/js/android.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
    <script type="text/javascript" src="/Public/Common/js/lmui.js?t=<?php echo ($time); ?>"></script>
    <!--当前模块js-->
    <script type="text/javascript" src="/Public/js/Hold/V7/hold.js?t=<?php echo ($time); ?>"></script>
</head>
<body>
<!--第一个是背景图，下面两个分别是按钮-->
<div class="splash_background">
    <img id="splash" src="/Public/img/Common/spacer.gif"/>
</div>
<!--推荐位-->
<div id="recommend_container">
</div>
<?php switch($renderParam[carrierId]): case "450094": ?><!--继续-->
        <img id="continue" class="btn_position_2" src="<?php echo $renderParam['fsUrl'].$renderParam['tipsData'][1]->onfocus_image_url?>"/>
        <!--退出-->
        <img id="back" class="btn_position_1" src="<?php echo $renderParam['fsUrl'].$renderParam['tipsData'][0]->onfocus_image_url?>"/><?php break;?>
    <?php default: ?>
        <!--继续-->
        <img id="continue" class="btn_position_1" src="<?php echo $renderParam['fsUrl'].$renderParam['tipsData'][1]->onfocus_image_url?>"/>
        <!--退出-->
        <img id="back" class="btn_position_2" src="<?php echo $renderParam['fsUrl'].$renderParam['tipsData'][0]->onfocus_image_url?>"/><?php endswitch;?>

<!--左右翻页-->
<img id="prev_page" class="page_icon" src="<?php echo $renderParam['fsUrl'].$renderParam['tipsData'][3]->onfocus_image_url?>"/>
<img id="next_page" class="page_icon" src="<?php echo $renderParam['fsUrl'].$renderParam['tipsData'][4]->onfocus_image_url?>"/>

<!-- 默认标签 -->
<a id="default_link" href="#"><img src="/Public/img/Common/spacer.gif"/></a>
<script type="text/javascript">
    window.onload = function () {
        Hold.init();
    }
</script>
</body>
</html>