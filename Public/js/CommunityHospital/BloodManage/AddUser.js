var BloodManage = {
    pageName: 'BloodDataUp',
    init: function () {
        window.unPreventDefault = true;
        // this.getHospData();
        this.initBtns();
        Web.getCode();
        Web.queryDataHeart();
    },


    goBack: function () {
        // inner = 0 表示从EPG外面进来，直接返回EPG，不然返回到39健康应用
            if (RenderParam.inner == '0') {
                LMEPG.Intent.back('IPTVPortal');
            } else {
                LMEPG.Intent.back();
            }
        },

    swichAjaxData: function (postData) {
        LMEPG.ajax.postAPI('CommunityHospital/addUserInfo', postData,
            function (data) {
                try {
                    var res = JSON.parse(data);
                    if (res.result == 0) {
                        LMEPG.UI.showToast("成功! 即将跳转血压上传页面....", 3)
                        // 跳转血压上传页面
                        BloodManage.jumpBloodDataUP(res.member_id);
                    } else { // 校验失败
                        LMEPG.UI.showToast(res.message, 3, BloodManage.goBack);
                    }
                } catch (e) {
                    LMEPG.Log.error(e.toString());
                    LMEPG.UI.showToast("获取模板处理异常！", 3, BloodManage.goBack);
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("获取模板发生错误！");
            }
        );

    },


    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('add-user');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        currentPage.setParam('focusId', beClickId);
        return currentPage;
    },

    jumpBloodDataUP: function (member_id) {
        var currObj = BloodManage.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('blood-data-up');
        addrObj.setParam('member_id', RenderParam.member_id);

        LMEPG.Intent.jump(addrObj, currObj);
    },
    // 表格数据校验
    dataVerify: function (postData) {
        var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

        if (postData.memberName == '' || postData.memberName == 'undefined') {
            LMEPG.UI.showToast("姓名不能为空!");
            return;
        } else if (postData.idCard == '' || postData.idCard == 'undefined') {
            LMEPG.UI.showToast("身份证不能为空!");
            return;
        } else if (postData.phoneNum == '' || postData.phoneNum == 'undefined') {
            LMEPG.UI.showToast("号码不能为空!");
            return;
        } else {
            if (!regIdNo.test(postData.idCard)) {
                LMEPG.UI.showToast("请输入有效的身份证号码", 2);
                return;
            }
            //判断手机号是否正确
            if (!LMEPG.Func.isTelPhoneMatched(postData.phoneNum)) {
                LMEPG.UI.showToast('请输入有效的电话', 2);
                return;
            }
            // 提交数据
            LMEPG.UI.showWaitingDialog('', 2);
            BloodManage.swichAjaxData(postData);
        }
    },

    jumpPage: function (btn) {
        console.log(G('user-name').value);
        console.log(G('user-tel').value.length);

        if (btn.id === 'btn-confirm') {
            var postData = {
                "memberName": G('user-name').value,
                "idCard": G('id-card').value,
                "phoneNum": G('user-tel').value
            };
            BloodManage.dataVerify(postData);
        }
    },
    //获取焦点后添加焦点样式
    _onFocus: function (id) {
        var dom = document.getElementById(id);
        dom.disabled = false;
        dom.focus();

    },
    //失去焦点后还原焦点样式
    _onBlur: function (id) {
        var dom = document.getElementById(id);

        dom.disabled = true;
        dom.blur();
    },

    onInputClick: function (btn, has) {
        if (has) {
            BloodManage._onFocus(btn.id);
        } else {
            BloodManage._onBlur(btn.id);
        }
    },

    initBtns: function () {
        var buttons = [{
            id: 'user-name',
            type: 'div',
            name: '用户名',
            nextFocusDown: 'id-card',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: BloodManage.onInputClick,
            backFocusId: 'user-name',
        }, {
            id: 'id-card',
            type: 'div',
            name: '身份证',
            nextFocusUp: 'user-name',
            nextFocusDown: 'user-tel',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: BloodManage.onInputClick,
            backFocusId: 'id-card',
            // click: this.onInputClick
        }, {
            id: 'user-tel',
            type: 'div',
            name: '联系方式',
            nextFocusUp: 'id-card',
            nextFocusDown: 'btn-confirm',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: BloodManage.onInputClick,
            backFocusId: 'user-tel',

        }, {
            id: 'btn-confirm',
            type: 'img',
            name: '确认上传',
            nextFocusUp: 'user-tel',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_confirm.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_confirm_f.png',
            focusChange: '',
            click: this.jumpPage
        }];

        LMEPG.BM.init('user-name', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: BloodManage.goBack});
    },
};
var Web = {
    timerId: null,
    url: "http://10.254.30.100:8015/queryData?",//测试服务器地址

    getCode: function () {
        var data = {
            id: RenderParam.userId,
            router: "blood",
        };
//            var jsonStr  = window.btoa(data);

        var jsonStr = JSON.stringify(data)
        var postData = {
            "data": jsonStr,
        };
        LMEPG.ajax.postAPI('IPTVForward/getQRCode', postData, function (rsp) {
            console.log(RenderParam.SERVER_IPTVFORWARD_CWS_FS + rsp.file_url);
            G("erweima").src = RenderParam.SERVER_IPTVFORWARD_CWS_FS + rsp.file_url;
            console.log(rsp);
        });
    },

    /**
     请求服务端数据
     */
    getPhoneData: function () {
        var data2 = {
            user_id: RenderParam.userId,
            router: "blood",
        };
        var jsonStr2 = JSON.stringify(data2)
        var postData2 = {
            "data": jsonStr2,

        };
        LMEPG.ajax.postAPI('IPTVForward/queryData', postData2,
            function (data) {
                try {
                    var result = data.result;
                    if (result == 0 && data.list.length > 0) {
                        var list = data.list;
                        clearInterval(Web.timerId);
                        // console.log(list);
                        var postData = {
                            "memberName": list[0].user_name,
                            "idCard": list[0].card_id,
                            "phoneNum": list[0].user_tel
                        };
                        LMEPG.UI.showWaitingDialog('', 2);
                        // 调用接口保存数据
                        BloodManage.swichAjaxData(postData);

                    } else { // 设置号码失败
//                            LMEPG.UI.showToast("用户数据上传失败！");
                    }
                } catch (e) {
                    LMEPG.UI.showToast("数据为空！");
                    LMEPG.Log.error(e.toString());
                    BloodManage.goBack();
                }
            },
            function (data) {
                LMEPG.UI.showToast("获取模板发生错误！");
            }
        )
    },

    /**
     * 实时拉取手机端数据请求
     */
    queryDataHeart: function () {
        Web.timerId = setInterval(Web.getPhoneData, 1000);
    },
    //重写ajax请求
    postAPI2: function (url, data, onSuccess, onError) {
        LMEPG.ajax.post({
            url: url,
            requestType: "GET",
            dataType: "json",
            data: data,
            success: function (xmlHttp, rsp) {
                LMEPG.call(onSuccess, [rsp]);
            },
            error: onError || function () {
                console.error("Ajax request error!");
            }
        })
    }
}

