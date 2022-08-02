/**
 * 跳转 - 播放器
 */
function jumpPlayVideo(videoInfo) {
    var objPlayer = LMEPG.Intent.createIntent("player");
    objPlayer.setParam("userId", RenderParam.userId);
    objPlayer.setParam("videoInfo", videoInfo);
    LMEPG.Intent.jump(objPlayer, null);
}

/**
 * 返回
 */
function onBack() {
    LMEPG.Intent.back();
}

window.onload = function () {
    if (RenderParam.payResult.result == 0 || RenderParam.payResult.result == 10030003) {
        LMEPG.UI.showToast("订购成功", 3, function () {
            if (RenderParam.orderParam.isPlaying == 1) {
                jumpPlayVideo(RenderParam.orderParam.videoInfo)
            } else {
                LMEPG.Intent.back(RenderParam.orderParam.returnPageName);
            }
        });

    } else {
        LMEPG.UI.showToast("订购失败:[" + RenderParam.payResult.result + "]", 3, function () {
            onBack();
        });
    }
};