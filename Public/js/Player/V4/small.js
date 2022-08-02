function jumpNextSmallPlayer() {
    var tempNextVideoInfo;
    for (var index = 0; index < RenderParam.allVideoInfo.length; index++) {
        var tempVideoInfo = RenderParam.allVideoInfo[index];
        if (RenderParam.videoInfo.sourceId === tempVideoInfo.sourceId) {
            var tempIndex = index + 1;
            if (tempIndex >= RenderParam.allVideoInfo.length) {
                tempIndex = 0;
            }
            tempNextVideoInfo = RenderParam.allVideoInfo[tempIndex];
            break;
        }
    }
    var objCurrent = LMEPG.Intent.createIntent('smallPlayer');
    var objPlayer = LMEPG.Intent.createIntent('smallPlayer');
    objPlayer.setParam('videoInfo', JSON.stringify(tempNextVideoInfo));
    objPlayer.setParam('allVideoInfo', JSON.stringify(RenderParam.allVideoInfo));
    objPlayer.setParam('position', JSON.stringify(RenderParam.position));
    LMEPG.Intent.jump(objPlayer, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
}


/**
 * 提供给父页面销毁小窗口播放器,调用方式：G("smallPlayer").contentWindow.destorySmallPlayer();
 */
function destorySmallPlayer() {
    LMEPG.mp.destroy();
}
