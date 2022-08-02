<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>江苏电信-播放器页面V7</title>
    <meta charset="utf-8" name="page-view-size" content="<?php echo ($size); ?>">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/common.css?t=<?php echo ($time); ?>"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Player/V7/video.css?t=<?php echo ($time); ?>"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Player/V7/volume.css?t=<?php echo ($time); ?>"/>

    <!--全局渲染参数-->
    <script type="text/javascript">
        var RenderParam = {
            carrierId: "<?php echo ($carrierId); ?>",                      // 地区id
            areaCode: "<?php echo ($areaCode); ?>",                        // 省份地区码
            platformType: "<?php echo ($platformType); ?>",                // 平台类型（hd--高清 sd--标清）
            debug: "<?php echo ($debug); ?>",                              // 调试模式
            pageSize: "<?php echo ($pageSize); ?>",                        // 页面尺寸
            collectStatus: "<?php echo ($collectStatus); ?>",              // 判断是否收藏 0表示收藏 1表示未收藏
            sourceId: "<?php echo ($sourceId); ?>",                        // 视频ID
            returnUrl: "<?php echo ($returnUrl); ?>",                      // 返回地址
            userId: "<?php echo ($userId); ?>",                            // 用户ID
            accountId: "<?php echo ($accountId); ?>",                      // 用户账号
            imgHost: "<?php echo ($resourcesUrl); ?>",                     // 图片host
            isVip: <?php echo ($isVip); ?>,                                // 用户是不是vip，1 -- 是vip
            freeSeconds: <?php echo ($freeSeconds); ?>,                    // 免费观看时长
            currentPlayTimes: 0,                            // 记录当前播放的时间进度
            userType: <?php echo ($userType); ?>,                          // 视频的播放策略（0-不限，1-普通用户可看, 2-vip可看）
            videoInfo: <?php echo ($videoInfo); ?>,                        // 视频信息
            domainUrl: "<?php echo ($domainUrl); ?>",                      // 江苏电信需要使用的第三方播放器前缀地址
            videoUrl: "<?php echo ($videoUrl); ?>",                        // 视频url：中国联通的高清视频地址http 转换成为rtsp进行播放。
            recommendVideoUrl: '',                           // 推荐视频播放地址
            isForbidOrder: "<?php echo (cookie('c_is_forbided_order')); ?>", // 是否禁止订购 1--表示禁止订购
            albumName: "<?php echo ($albumName); ?>", //专辑跳转传入专辑别名参数
            partner: '<?php echo ($partner); ?>', // 用户是否是续订vip
            serverPath: '<?php echo ($serverPath); ?>', // 用户是否是续订vip
        };
    </script>

    <!--第三方依赖库-->
    <script type="text/javascript" src="/Public/ThirdParty/js/json2.js?t=<?php echo ($time); ?>"></script>
    <!--公用库-->
    <script type="text/javascript" src="/Public/Common/js/lmcommon.js?t=<?php echo ($time); ?>"></script>
<?php if(($isRunOnAndroid) == "1"): ?><script type="text/javascript" src="/Public/Common/js/android.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
    <script type="text/javascript" src="/Public/Common/js/lmui.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/Common/js/lmplayer.js?t=<?php echo ($time); ?>"></script>
    <script type="text/javascript" src="/Public/Common/js/lmauthEx.js?t=<?php echo ($time); ?>"></script>
    <!--当前模块js-->
    <?php switch($carrierId): case "510094": ?><!--四川广电所需js文件-->
            <script type="text/javascript"
                    src="/Public/ThirdParty/js/510094/scgd_player_util.js?t=<?php echo ($time); ?>"></script><?php break; endswitch;?>
    <script type="text/javascript" src="/Public/js/Player/V3/PlayerV2.js?t=<?php echo ($time); ?>"></script>

</head>

<body bgcolor="transparent" style="margin:0; padding:0;">

<div id="backg">
    <!--调试代码-->
    <div id="debug1"></div>
    <div id="debug2"></div>

    <!--iframe形式播放需要-->
    <div id="smallvod">
        <iframe id="smallscreen" name="smallscreen" frameborder="0" scrolling="no"></iframe>
    </div>

    <!--播放挽留页面-->
    <div id="detain-page" style="display:none;">
        <!--视频推荐位-->
        <div id="recommend-video-container">
            <!--四个推荐位-->
            <div id="recommend-video-1" class="recommend-video-container">
                <img id="recommend-video-1-img" class="recommend-video-img" src="" alt="">
                <div id="recommend-video-1-title" class="recommend-video-title"></div>
            </div>
            <div id="recommend-video-2" class="recommend-video-container">
                <img id="recommend-video-2-img" class="recommend-video-img" src="" alt="">
                <div id="recommend-video-2-title" class="recommend-video-title"></div>
            </div>
            <div id="recommend-video-3" class="recommend-video-container">
                <img id="recommend-video-3-img" class="recommend-video-img" src="" alt="">
                <div id="recommend-video-3-title" class="recommend-video-title"></div>
            </div>
            <div id="recommend-video-4" class="recommend-video-container">
                <img id="recommend-video-4-img" class="recommend-video-img" src="" alt="">
                <div id="recommend-video-4-title" class="recommend-video-title"></div>
            </div>
        </div>

        <!--操作按钮-->
        <div id="operate-btn-container">
            <!-- operate-btn-1：结束播放按钮，事先在html中创建，不需要动态创建了！！ -->
            <img id="operate-btn-1" class="operate-btn-img" src="" alt="">
            <!--js代码中动态追加类似的img：focus-2-2, focus-2-3 -->
        </div>
    </div>

    <!-- 暂停、倍速播放显示 -->
    <div id="play-indicator-container">
        <img id="play-indicator-bg" src="/Public/img/<?php echo ($platformType); ?>/Player/V7/play_indicator_forward_bg.png"
             alt="">
        <div id="play-indicator-text"></div>
    </div>

    <!--底部UI条-->
    <div id="playUI">
        <img id="video-progress-bottom-background"
             src="/Public/img/<?php echo ($platformType); ?>/Player/V7/bottom_bg_playing.png" alt=""/>
        <div id="video-current-play-time">00:00</div>
        <div id="play-progressbar-container">
            <div id="play-progressbar" style="width:0;">
                <img id="play-progressbar-ball" src="/Public/img/<?php echo ($platformType); ?>/Player/V7/ball.png" alt=""/>
            </div>
        </div>
        <div id="video-total-time">00:00</div>
        <div id="video-title"></div>
        <div id="floating-play-time-container">
            <img class="floating-playing-time-bg"
                 src="/Public/img/<?php echo ($platformType); ?>/Player/V7/floating_playing_time_bg.png" alt="">
            <div id="floating-play-time-text">00:00</div>
        </div>
    </div>

    <!--音量调节UI-->
    <div id="volumeUI" style="visibility:hidden;">
        <img id="volume-background" src="/Public/img/<?php echo ($platformType); ?>/Player/V7/volume_container_bg.png" alt=""/>
        <img id="volume-switch" src="/Public/img/<?php echo ($platformType); ?>/Player/V7/volume_on.png" alt=""/>
        <div id="volume-value"></div>
        <div id="volume-progressbar-container">
            <!-- +/-音量时动态增加如下img -->
            <!--<img class="volume-progress" src="/Public/img/<?php echo ($platformType); ?>/Player/V7/volume_progress.png"/>-->
        </div>
    </div>

    <!-- 默认标签：防止焦点丢失 -->
    <a id="default_link" href="#"><img class="grubFocusImg" src="/Public/img/Common/spacer.gif" alt=""/></a>

</div>
</body>
</html>