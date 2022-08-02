// var RenderParam.hospitalName = LMEPG.Func.getLocationString('RenderParam.hospitalName');
var CommunityHosp = {
    marquee: marquee(),
    pageName: 'communityIndex',
    hospitalId: '',
    hospitalImg: '',
    goBack: function () {
        // inner = 0 表示从EPG外面进来，直接返回EPG，不然返回到39健康应用
        if (G("show-code").style.display == "block") {
            G("show-code").style.display = "none";
            LMEPG.ButtonManager.setKeyEventPause(false);
        } else if (G("show-intro").style.display == "block") {
            G("show-intro").style.display = "none";
            // LMEPG.BM.requestFocus("experts-introduce");
        } else {
            if (RenderParam.inner == '0') {
                LMEPG.Intent.back('IPTVPortal');
            } else {
                LMEPG.Intent.back();
            }
        }

    },


    swichAjaxData: function () {
        var postData = {
            'hospId': HospitalArea.areaMap()
        }
        LMEPG.ajax.postAPI('Doctor/getHospitalList', postData,
            function (data) {
                try {
                    var result = data.code;
                    if (result == 0) {
                        var hospData = data.hospitalInfo[0];
                        LMEPG.UI.dismissWaitingDialog();
                        CommunityHosp.renderCws(hospData);
                        CommunityHosp.hospitalId = hospData.hosl_id;
                        // CommunityHosp.hospitalImg = hospData.hosp_image_url;
                    } else { // 设置号码失败
                        LMEPG.UI.showToast("没有拿到数据！" + data.result);
                    }
                } catch (e) {
                    LMEPG.UI.showToast("获取模板处理异常！");
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("获取模板发生错误！");
            }
        );

    },
    getHospData: function () {

        LMEPG.UI.showWaitingDialog();
        CommunityHosp.swichAjaxData();

    },
    renderCws: function (data) {
        // diff
        CommunityHosp.hospitalId = data.hosl_id;
        G('hosp-name').innerText = data.hosl_name;
        G('hosp-intro-title').innerText = data.hosl_name + '简介';
        G('marquee-wrap').innerHTML = CommunityHosp.marquee.start({
            txt: data.hosp_introduce,
            len: 200,
            dir: 'up',
            vel: 2
        });
        var hospitalUrl = resolveImgToLocal("http://120.70.237.86:10000/cws/39hospital/index.php", data.hosp_image_url, CommunityHosp.hospitalId);
        G("hosp-pic_1").src = hospitalUrl;
    },
    currentPage: function () {
        var obj;
        if (!!RenderParam.version == true) {
            obj = LMEPG.Intent.createIntent('hospital-index-version');
            obj.setParam('hospitalId', RenderParam.hospitalId);
            obj.setParam('version', RenderParam.version);
            obj.setParam('function', RenderParam.functions);
            obj.setParam('pageIndex', RenderParam.pageIndex);
        } else {
            obj = LMEPG.Intent.createIntent('hospital-index');
        }
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('hospitalName', RenderParam.hospitalName);
        obj.setParam('focusId', beClickId);
        return obj;
    },

    jumpPage: function (btn) {
        var currObj = CommunityHosp.currentPage();
        if (btn.id === 'online-case') {
            CommunityHosp.goInquiry();
        } else if(btn.id === 'booking_service' || (btn.id === 'order-register' && btn.isShowDialog) ) {
            G("show-intro-img").src = RenderParam.resourcesUrl + 'hospitalImg/' + RenderParam.hospitalId + "/appointment_dialog.png";
            G("show-intro").style.display = "block";
        }  else if (btn.id == 'blood-manage' || btn.id == 'community-doctor' || btn.id === 'order-register') {
            // var addrObj = LMEPG.Intent.createIntent('members-list');
            LMEPG.UI.showToast("该功能暂未开放！");
        } else if (btn.id == "health-education") {
            var curr = CommunityHosp.currentPage();
            var addr = LMEPG.Intent.createIntent('album');
            addr.setParam('albumName', '39Featured');
            addr.setParam('areaName', RenderParam.hospitalName);
            LMEPG.Intent.jump(addr, curr);
        } else if (btn.id === 'experts-introduce' && btn.isRouteVideo) {
            var videosIntent = LMEPG.Intent.createIntent('health-education');
            videosIntent.setParam('areaName', RenderParam.hospitalName);
            videosIntent.setParam('hospitalId', CommunityHosp.hospitalId);
            LMEPG.Intent.jump(videosIntent, currObj);
        } else {
            var addrObj = LMEPG.Intent.createIntent(btn.id);
            addrObj.setParam('areaName', RenderParam.hospitalName);
            addrObj.setParam('hospitalId', CommunityHosp.hospitalId);
            LMEPG.Intent.jump(addrObj, currObj);
        }
    },
    /**
     * 跳转 -- 活动页面
     * @param activityName
     */
    jumpActivityPage: function (activityName) {
        var objHome = CommunityHosp.currentPage();
        objHome.setParam("userId", RenderParam.userId);
        // objHome.setParam("classifyId", Home.classifyId);
        objHome.setParam("fromId", "2");

        var objActivity = LMEPG.Intent.createIntent("activity");
        objActivity.setParam("activityName", activityName);
        objActivity.setParam("inner", 1);
        LMEPG.Intent.jump(objActivity, objHome);
    },
    /**跳转视频问诊界面*/
    goInquiry: function () {
        // 允许进入问诊用户
        var accessAccount = [
            '18167854853HD', // todo 测试账户
            'lsxHD',
            'alytest03',
            'yxjtest6'
        ];

        var currObj = CommunityHosp.currentPage();
        var routeName = "";
        if (RenderParam.hospitalName == "wushixianahexiang")
            routeName = "serviceHotline";
        else
            routeName = "doctorList";
        var addrObj = LMEPG.Intent.createIntent(routeName);
        addrObj.setParam('userId', RenderParam.userId);
        addrObj.setParam('hospitalId', CommunityHosp.hospitalId);
        var hospitalName = G('hosp-name').innerText;
        addrObj.setParam('hospitalName', hospitalName);
        addrObj.setParam('s_demo_id', 'superDemo');

        LMEPG.Intent.jump(addrObj, currObj);
    },
};

function marquee() {

    var _option = {};
    return {
        start: function (obj, bol) {
            _option = obj;
            _option.bol = bol;
            // 得到焦点或失去焦点没有达到限制长度直接返回
            if (obj.txt.length < obj.len) return obj.txt;
            var htm = '<marquee ' +
                'style="float:left;width:100%;height:100%" ' +
                // 滚动速度
                'scrollamount="' + obj.vel + '" ' +
                // 滚动方式（如来回滚动、从左至右滚动）
                'behavior="' + obj.way + '" ' +
                // 滚动方向
                'direction="' + obj.dir + '">' +
                obj.txt +
                '</marquee>';
            if (bol) {
                obj.el.innerHTML = htm;
            } else {
                // 返回没有事件驱动文本滚动
                return htm;
            }
        },
        stop: function (fn) {
            if (!_option.el) return;
            _option.el.innerHTML = _option.bol ? substrByOmit(_option.txt, _option.len) : _option.txt;
            fn && fn.apply(null, arguments);
        }
    };
}

// 解析医生头像工具
function resolveImgToLocal(urlPrefix, avatarUrl, doctorId) {
    var head = {
        func: 'getDoctorHeadImage',
        carrierId: "630092",
        areaCode: ''
    };
    var json = {
        doctorId: doctorId,
        avatarUrl: avatarUrl
    };
    return urlPrefix + '?head=' + JSON.stringify(head) + '&json=' + JSON.stringify(json);
}

