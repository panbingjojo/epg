LMEPG.BM.init('', [], '', true);

function onBack() {
    LMEPG.Intent.back();
}

window.onload = function () {
    var bgImg = g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Home/V13/Home/bg.png';
    if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
        bgImg = RenderParam.fsUrl + RenderParam.skin.cpbjt;
    }
    document.body.style.backgroundImage = 'url(' + bgImg + ')';

    // 更新二维码图片
    if (RenderParam.moreHospitalUrl) {
        G("qr-code-url").src = RenderParam.moreHospitalUrl;
    }
};