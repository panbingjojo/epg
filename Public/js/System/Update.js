// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 系统维护升级中
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/10/30
// +----------------------------------------------------------------------

function onBack() {
    switch (RenderParam.carrierId) {
        case "220094"://吉林广电
            try {
                window.top.jk39.back();
            } catch (e) {
                LMEPG.Log.error("[220094][update.html]--->[onBack()]--->Exception: " + e.toString());
                LMEPG.Intent.back("IPTVPortal");
            }
            break;
        default:
            LMEPG.Intent.back("IPTVPortal");
            break;
    }
}

window.onload = function () {
    setTimeout("onBack()", 3000); // duration秒后跳转
};

