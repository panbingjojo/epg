// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | LongMaster IPTV EPG 自定义扩展通用js！
// +----------------------------------------------------------------------
// | 说明：
// |    1.  自定义扩展全局通用的js(lmcommon.js/lmui.js/..)里的某些方法，以解
// | 耦基类通用实现或者接口声明，尽量避免具体的业务逻辑代码。
// |    2.  同一接口方法名，但不同地区实现与表现不一样，可以lmuiEx.js里实现指定
// | 的扩展即可。不过，这种全局定制通用接口的场景不多。但存在，多见于通用UI交互
// | 组件。例如：
// |        通用弹窗 LMEPG.UI.showToast(msg, second, callback)，所有地区的
// | toast弹窗都一样，但贵州广电(520094)/贵州电信(520092)的该弹窗整体风格都变
// | 化了，则就需要在该当前文件里对指定地区判断来覆写。
// |
// | 注意：
// |    1.  由于，诸如 lm{XXX}.js 这些通用js的模板写法，是基于命名空间定义而非
// | 通过一个类及可派生写法(function SuperClass(){} SubClass.prototype=new SuperClass())，
// | 这主要是基于我们业务及开发者可快速清晰易懂、轻松调用而约定的。所以，在覆写
// | 的时候，“请按照函数顺序执行方式”指定覆写。
// |    示例：
// |    if (LMEPG.Func.array.contains(get_carrier_id(), ["520092", "520094"]) {
// |        LMEPG.UI.showToast = function (msg, second, callback) {
// |            // 在些覆写逻辑与样式替换...
// |            LMEPG.UI.showToastV3(msg, second, callback);//例如，直接调用通用的另一V3模式
// |        }
// |    }
// +----------------------------------------------------------------------
// | 使用：
// |    1. 请放置在lmcommon.js/lmui.js/等这些主要通用引用之后：
// |        e.g.
// |        <head>
// |            ...
// |            <script type="text/javascript" src="__ROOT__/Public/Common/js/lmcommon.js?t={$time}"></script>
// |            <script type="text/javascript" src="__ROOT__/Public/Common/js/lmui.js?t={$time}"></script>
// |            ...
// |        </head>
// +----------------------------------------------------------------------
// | 修改规则：
// |    1. 定义Object类名时，请按照“大驼峰命名法”；若为简短类名缩写，请按照“首字母”大写。
// |        e.g. LMEPG.UI
// |    2. 请统一按照功能及相关性，定义类/方法所在合适区域位置！！！
// +----------------------------------------------------------------------
// | 作者: Songhui
// | 日期: 2019/10/11
// +----------------------------------------------------------------------

var __hasImportLMUIJS = typeof LMEPG === "object" && typeof LMEPG.UI !== "undefined";
var lmcid = get_carrier_id(); //取出当前页面定义或系统的carrierId！

if (__hasImportLMUIJS) {

    // 覆写showToast
    if (LMEPG.Func.array.contains(lmcid, ["520092", "520094", "630092", "640092"])) {
        LMEPG.UI.showToast = function (msg, second, callback) {
            LMEPG.UI.showToastV3(msg, second, callback)
        };
    }

    // 覆写showToast
    if (LMEPG.Func.array.contains(lmcid, [""])) {
        LMEPG.UI.showToast = function (msg, second, callback) {
            LMEPG.UI.showToastV1(msg, second, callback)
        };
    }
    // 覆写showWaitingDialog
    if (LMEPG.Func.array.contains(lmcid, ["520094"])) {
        LMEPG.UI.showWaitingDialog = function (msg, second, callback) {
            var config = {
                msg: msg,
                delay: second,
                callback: callback,
                loadingImg: LMEPG.App.getAppRootPath() + "/Public/img/hd/Common/bg_waiting_dialog_v_2.gif",
            };
            LMEPG.UI.buildAndShowWaitingDialogBy(config);
        };
    }

    // 覆写commonDialog
    if (LMEPG.Func.array.contains(lmcid, ["520092", "520094", "630092", "640092"])) {
        LMEPG.UI.commonDialog.show = function (message, buttonText, onCallback, focusId,hint) {
            LMEPG.UI.commonDialog.showV1(message, buttonText, onCallback,hint);
        };
    }

}