<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>吉林广电EPG-订购页</title>

    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/common.css?t=<?php echo ($time); ?>"/>
    <link rel="stylesheet" type="text/css" href="/Public/css/<?php echo ($platformType); ?>/Pay/V220095/pay.css?t=<?php echo ($time); ?>"/>

    <!--全局渲染参数-->
    <script type="text/javascript">
        var RenderParam = {
            //公共渲染
            carrierId: "<?php echo ($carrierId); ?>",          // 地区id
            areaCode: "<?php echo ($areaCode); ?>",            // 省份地区码
            platformType: "<?php echo ($platformType); ?>",    // 平台类型
            debug: "<?php echo ($debug); ?>",                  // 调试模式
            pageSize: "<?php echo ($size); ?>",                // 页面尺寸
            stbModel: "<?php echo ($stbModel); ?>",            // 盒子的型号
            fsUrl: "<?php echo ($resourcesUrl); ?>",           // fs 地址
            time: "<?php echo ($time); ?>",                    // 开始渲染时间
            userId: "<?php echo ($userId); ?>",                // 用户Id
            accountId: "<?php echo ($accountId); ?>",          // 用户账号

            //当前页渲染
            productId: "<?php echo ($productId); ?>",          //39健康计费套餐id，用于鉴权等操作
            orderItems: <?php echo ($orderItems); ?>,
            returnPageName: "<?php echo ($returnPageName); ?>",
            isPlaying: "<?php echo ($isPlaying); ?>",
            orderReason: "<?php echo ($orderReason); ?>",
            remark: "<?php echo ($remark); ?>",
            lmReason: 0,
            orderType: 1,
            isDirectPay: 0,                     // 当前“内部订购展示页”（0-先到内部订购展示页 1-直接跳转局方订购页）
        };
    </script>
    <!--第三方依赖库-->
    <script type="text/javascript" src="/Public/ThirdParty/js/json2.js?t=<?php echo ($time); ?>"></script>
    <!--公用库-->
    <script type="text/javascript" src="/Public/Common/js/lmcommon.js?t=<?php echo ($time); ?>"></script>
<?php if(($isRunOnAndroid) == "1"): ?><script type="text/javascript" src="/Public/Common/js/android.js?t=<?php echo ($time); ?>"></script><?php endif; ?>
    <script type="text/javascript" src="/Public/Common/js/lmui.js?t=<?php echo ($time); ?>"></script>
    <!--当前模块js-->
    <script type="text/javascript" src="/Public/js/Pay/V220095/pay.js?t=<?php echo ($time); ?>"></script>

    <script type="text/javascript ">
        // 页面载完执行
        window.onload = function () {
            try {
                // 展示我方订购页
                JLPay.init();
            }catch (e) {
                console.log(e);
            }

        }
    </script>
</head>

<body>
<div id="default_tip"></div>

<!--套餐类型-->
<div id="order_items_container">
    <img id="order_item_1" src="/Public/img/hd/Pay/V220095/order_item_1.png"/>
    <img id="order_item_2" src="/Public/img/hd/Pay/V220095/order_item_2.png"/>
    <img id="order_item_3" src="/Public/img/hd/Pay/V220095/order_item_3.png"/>
</div>

<!--支付类型-->
<div id="pay_type_container" class="dismiss">

    <!--    支付导航-->
    <div id="pay_type_nav">
        <img src="" id="pay_item_1"><img src="" id="pay_item_2"><img src="" id="pay_item_3">
    </div>

    <!--    支付类型详情-->
    <div id="pay_type_detail">
        <div class="row">产品名称：<span id="pay_type_name">电视家庭医生</span></div>
        <div class="row">产品类型：<span id="pay_type">包月</span></div>
        <div class="row">资费信息：<span id="pay_price"></span></div>

        <!--        支付二维码-->
        <img src="" id="pay_qr_code" class="dismiss">

        <!--        手机验证码输入框-->
        <div id="check_code_container" class="dismiss">
            <div id="user_phone">输入手机号</div>
            <div id="check_code">输入验证码</div>
            <div id="btn_check_code">
                <span id="countdown"></span>
            </div>
        </div>

        <!--账单支付验证码输入框-->
        <div id="bill_pay_check" class="dismiss">
            <!--            随机数验证码-->
            <div id="verify_code">8888</div>
            <input type="tel" id="input_verify" disabled="true" oninput="onInputChange(event)"
                   onporpertychange="maxLength(event)">
            <img src="/Public/img/hd/Pay/V220095/delete_code.png" id="delete_verify_code" alt="">
        </div>
    </div>

    <!--支付按钮 确定-->
    <img src="/Public/img/hd/Pay/V220095/pay_sure.png" id="btn_pay_sure">

    <!--支付按钮 取消-->
    <img src="/Public/img/hd/Pay/V220095/pay_cancel.png" id="btn_pay_cancel">
</div>

<!--账单支付二次确认页面-->
<!--<div id="bill_pay_check" >-->
<!--    &lt;!&ndash;    自定义随机数&ndash;&gt;-->
<!--    <div id="verify_code">8888</div>-->
<!--    &lt;!&ndash;    随机数输入框&ndash;&gt;-->
<!--    <input type="tel" id="input_verify" disabled="true" oninput="onInputChange(event)"-->
<!--           onporpertychange="maxLength(event)">-->
<!--    &lt;!&ndash;    验证确认按钮&ndash;&gt;-->
<!--    <img id="verify_confirm" src="/Public/img/hd/Pay/V220095/verify_confirm.png"/>-->
<!--    &lt;!&ndash;    验证取消按钮&ndash;&gt;-->
<!--    <img id="verify_cancel" src="/Public/img/hd/Pay/V220095/verify_cancel.png"/>-->
<!--</div>-->
</body>
</html>