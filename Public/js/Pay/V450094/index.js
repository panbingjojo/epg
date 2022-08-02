var isNewVersion = true;

var Pay = {
    buildPayUrlAndJump: function (payInfo) { //构建支付地址
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('Pay/buildPayUrl', payInfo, function (data) {
            LMEPG.UI.dismissWaitingDialog('');
            if (data.result == 0) {
                window.location.href = data.payUrl; // 得到支付地址并跳转
            } else {
                LMEPG.UI.showToast('获取订购参数异常：' + data.result);
            }
        });
    },

    /**
     * 点击订购项
     * @param btn
     */
    onPayItemClick: function (btn) {
        if (RenderParam.orderItems.length <= btn.cIndex) {
            LMEPG.Log.error('订购项不匹配!');
            return;
        }
        var PayInfo = {
            'vip_id': RenderParam.orderItems[btn.cIndex].vip_id,
            'product_id': btn.cIndex,//1包月订购，3包年订购
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'remark': RenderParam.remark,
            'returnUrl': '',
            'returnPageName': RenderParam.returnPageName
        };
        Pay.buildPayUrlAndJump(PayInfo);
    },

    /**
     * 跳转活动订购项
     * @param btn
     */
    activityPayItemClick: function () {
		//document.getElementsByTagName("body")[0].setAttribute("style","display: none");
		document.getElementsByTagName("body")[0].setAttribute("style","visibility: hidden");
        var PayInfo = {
            'vip_id': 3,//活动订购
            'product_id': 5,//1包月订购，3包年订购，5活动订购
            'userId': RenderParam.userId,
            'isPlaying': RenderParam.isPlaying,
            'orderReason': RenderParam.orderReason,
            'remark': RenderParam.remark,
            'returnUrl': '',
            'returnPageName': RenderParam.returnPageName
        };

        LMEPG.ajax.postAPI('Pay/buildPayUrl', PayInfo, function (data) {
            if (data.result == 0) {
                window.location.href = data.payUrl; // 得到支付地址并跳转
            } else {
                LMEPG.Intent.back();
            }
        });
    },

    /**
     * 初始化订购页
     */
    init: function () {
        if (LMEPG.Func.array.isEmpty(RenderParam.orderItems)) {
            onBack();
            return;
        }
        LMEPG.ButtonManager.init('focus-2-1', buttons, '', true);
    }
};

/**
 * [isDuringDate 比较当前时间是否在指定时间段内]
 * @DateTime 2020-07-23
 * @param    date   [beginDateStr] [开始时间]
 * @param    date   [endDateStr]   [结束时间]
 * @return   Boolean
 */
var date = {
    isDuringDate: function (beginDateStr, endDateStr) {
        var curDate = new Date(),
            beginDate = new Date(beginDateStr),
            endDate = new Date(endDateStr);
        if (curDate >= beginDate && curDate <= endDate) {
            return true;
        }
        return false;
    }
};

/**
 * 返回处理
 */
function onBack() {
    LMEPG.Intent.back();
}

function jumpHome() {
    LMEPG.Intent.back('IPTVPortal');
}

function jumpMain() {
    var currentPage = LMEPG.Intent.createIntent('');
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, currentPage, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
}


var buttons = [
    {
        id: 'focus-2-1',
        name: '包月',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'focus-2-2',
        nextFocusUp: '',
        nextFocusDown: isNewVersion?'':'focus-3-1',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V450094/month.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V450094/month_select.png',
        click: Pay.onPayItemClick,
        focusChange: '',
        beforeMoveChange: '',
        moveChange: '',
        cIndex: 0
    },
    {
        id: 'focus-2-2',
        name: '包年',
        type: 'img',
        nextFocusLeft: 'focus-2-1',
        nextFocusRight: '',
        nextFocusUp: '',
        nextFocusDown: isNewVersion?'':'focus-3-1',
        backgroundImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V450094/year.png',
        focusImage: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/Pay/V450094/year_select.png',
        click: Pay.onPayItemClick,
        focusChange: '',
        beforeMoveChange: '',
        moveChange: '',
        cIndex: 1
    },
    {
        id: 'focus-3-1',
        name: '首页',
        type: 'img',
        nextFocusLeft: '',
        nextFocusRight: 'focus-3-2',
        nextFocusUp: 'focus-2-1',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Home/V4/bg_home_btn.png',
        focusImage: g_appRootPath + '/Public/img/hd/Home/V4/f_home_btn.png',
        click: jumpHome,
        focusChange: '',
        beforeMoveChange: '',
        moveChange: ''
    },
    {
        id: 'focus-3-2',
        name: '主页',
        type: 'img',
        nextFocusLeft: 'focus-3-1',
        nextFocusRight: 'focus-3-3',
        nextFocusUp: 'focus-2-1',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Home/V4/bg_main_btn.png',
        focusImage: g_appRootPath + '/Public/img/hd/Home/V4/f_main_btn.png',
        click: jumpMain,
    },
    {
        id: 'focus-3-3',
        name: '返回',
        type: 'img',
        nextFocusLeft: 'focus-3-2',
        nextFocusRight: '',
        nextFocusUp: 'focus-2-1',
        nextFocusDown: '',
        backgroundImage: g_appRootPath + '/Public/img/hd/Home/V4/bg_back_btn.png',
        focusImage: g_appRootPath + '/Public/img/hd/Home/V4/f_back_btn.png',
        click: onBack,
    }
];

window.onload = function () {
	if(date.isDuringDate('2020/07/25', '2020/08/24')){
		Pay.activityPayItemClick();
	}else{
		LMEPG.KeyEventManager.addKeyEvent(
			{
				KEY_399: "LMEPG.Intent.back()", //广西广电返回键
				KEY_514: "LMEPG.Intent.back()", //广西广电退出键
			}
		);
		if(isNewVersion){
		    G('focus-3-1').style.display = "none";
            G('focus-3-2').style.display = "none";
            G('focus-3-3').style.display = "none";
        }
		Pay.init();
	}
};

