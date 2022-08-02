/**
 * 返回
 */
function onBack() {
    LMEPG.Intent.back();
}

var buttons = [];
limitLength = 11;

var Focus = {
    initButton: function () {
        buttons.push(
            {
                id: 'submit',
                name: '提交',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'clear',
                nextFocusUp: 'phoneText',
                nextFocusDown: '',
                backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/Activity/ActivityDiscount/V2/bg_confirm.png',
                focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/Activity/ActivityDiscount/V2/f_confirm.png',
                click: Focus.goSetPhoneNumber,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            }
        );
        buttons.push(
            {
                id: 'clear',
                name: '取消',
                type: 'img',
                nextFocusLeft: 'submit',
                nextFocusRight: 'back',
                nextFocusUp: 'phoneText',
                nextFocusDown: '',
                backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/Activity/ActivityDiscount/V2/bg_cancel.png',
                focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/Activity/ActivityDiscount/V2/f_cancel.png',
                click: onBack,
                focusChange: '',
                beforeMoveChange: '',
                moveChange: ''
            }
        );
        buttons.push(
            {
                id: 'phoneText',
                name: '号码框',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'submit',
                backgroundImage: '',
                focusImage: '',
                focusChange: 'LMEPG.UI.keyboard.show(100, 200, "phoneText", "submit")',
                beforeMoveChange: 'onCommonMoveChange',
                moveChange: ''
            }
        );
    },
    /**
     * 去设置中奖电话号码
     */
    goSetPhoneNumber: function () {
        //获取用户填写的手机号
        var phoneTex = G('phoneText');
        var userTel = phoneTex.innerHTML;
        if (!LMEPG.Func.isTelPhoneMatched(userTel)) {
            LMEPG.UI.showToast('请输入有效的手机号码');
            return;
        }

        var reqData = {
            'tel': userTel,
            'orderId': orderId
        };
        LMEPG.ajax.postAPI('User/orderSuccessToAddTel', reqData,
            function (data) {
                try {
                    var result = data.result;
                    if (result == 0) {  // 设置号码成功
                        LMEPG.UI.showToast('提交成功');
                        onBack();
                    } else { // 设置号码失败
                        LMEPG.UI.showToast('提交失败，请重试！');
                    }
                } catch (e) {
                    LMEPG.UI.showToast('提交结果处理异常！');
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast('请求保存手机号发生错误！');
            }
        );
    },

    goPhoneDialog: function () {
        Show('dialog-phone');
        LMEPG.ButtonManager.requestFocus('submit');

    },

    init: function () {
        Focus.goPhoneDialog();
    }
};
