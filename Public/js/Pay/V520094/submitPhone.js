var buttons = [];

var Pay = {
    //提交用户电话号码
    postTel: function (payBackUrl, orderId) {
        LMEPG.UI.commonEditDialog.show('尊敬的VIP用户，请留下手机号，工作人员将在3个工作日内与您取得联系并确认赠品发放方式。', ['确&nbsp;&nbsp;定', '取&nbsp;&nbsp;消'], function (btnIndex, inputValue) {
            if (btnIndex === 0) {
                if (LMEPG.Func.isTelPhoneMatched(inputValue)) {
                    var reqJsonObj = {
                        'tel': inputValue,
                        'orderId': orderId
                    };
                    LMEPG.ajax.postAPI('User/orderSuccessToAddTel', reqJsonObj, function (data) {
                        var tempDataObj = data instanceof Object ? data : JSON.parse(data);
                        if (tempDataObj.result == '0') {
                            LMEPG.UI.commonEditDialog.dismiss();
                            LMEPG.UI.showToast('提交成功');
                            window.location.href = payBackUrl;
                        } else {
                            LMEPG.UI.showToast('提交失败，请重新提交');
                        }
                    });
                    return true;
                } else {
                    LMEPG.UI.showToast('请输入正确的电话号码');
                    return true;
                }
            } else {
                window.location.href = payBackUrl;
            }
        }, ['联系方式：', '', '在此输入手机号码...', 'tel']);
    }
};
