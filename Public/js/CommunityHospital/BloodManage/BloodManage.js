var BloodManage = {
    // marquee: marquee(),
    pageName: 'BloodManageIndex',
    hospitalId: '',
    pageNumber : 1, // 历史数据当前页码
    weekData:'',
    hisData:'',
    pageNum : 4,    // 每页显示条数
    pageTotal :1 ,  // 总页数

    init: function () {
        this.initBloodData();
        this.initBtns();
    },
    initBloodData: function () {
        // 拉取本周数据
        var str_end = new Date().getTime();
        var str_begin = str_end - 7 * 24 * 60 * 60 * 1000;
        var postData1 = {
            "memberId": RenderParam.memberId,
            "beginDt": BloodManage.formatDate(str_begin) + ' 00:00:00',
            "endDt": BloodManage.formatDate(str_end) + ' 23:59:59',
        };
        BloodManage.swichAjaxData(postData1);
    },

    goBack: function () {
        // inner = 0 表示从EPG外面进来，直接返回EPG，不然返回到39健康应用
        if (G("show-code").style.display == "block") {
            G("show-code").style.display = "none";
            LMEPG.ButtonManager.setKeyEventPause(false);
        } else if (G("show-intro").style.display == "block") {
            G("show-intro").style.display = "none";
            LMEPG.BM.requestFocus("experts-introduce");
        } else {
            if (RenderParam.inner == '0') {
                LMEPG.Intent.back('IPTVPortal');
            } else {
                LMEPG.Intent.back();
            }
        }

    },
    formatDate:function (date) {
        var date = new Date(date);
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        // var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        // var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        // var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        // return YY + MM + DD +" "+hh + mm + ss;
        return YY + MM + DD ;
    },

    swichAjaxData: function (postData) {
        LMEPG.UI.showWaitingDialog('',1);
        LMEPG.ajax.postAPI('CommunityHospital/queryBloodPressure', postData,
            function (data) {
                try {
                    // console.log(data);
                    if (data.result == 0) {
                        if(postData.beginDt){
                            BloodManage.weekData = data.data;
                            BloodManage.getHospData();
                            // 拉取周数据后再拉取历史数据
                            var postData2 = {
                                "memberId": RenderParam.memberId,
                            };
                            BloodManage.swichAjaxData(postData2);
                        }else {
                            BloodManage.hisData = data.data;
                        }
                    } else { // 校验失败
                        LMEPG.UI.showToast(data.message);
                        BloodManage.getHospData();
                    }
                } catch (e) {
                    LMEPG.UI.showToast("数据拉取失败！");
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("获取模板发生错误！");
            }
        );
    },

    getHospData: function () {
        console.log(BloodManage.weekData);
        // console.log(BloodManage.hisData);
        G('member-name').innerHTML = RenderParam.name;
        G('member-age').innerHTML = RenderParam.age;
        G('member-sex').innerHTML = RenderParam.sex;

        if (BloodManage.weekData.length > 0){
            for (i = 0; i < BloodManage.weekData.length; i++) {
                var date = new Date(BloodManage.weekData[i].create_dt);
                week = date.getDay();

                // 变更高度
                BloodManage.changePointTop(i,week);
            }
        }
    },

    changePointTop: function (i,week) {
        // 收缩压、舒张压初始高度
        var ssyTop = 170;
        var szyTop = 230;

        var ssyValue = BloodManage.weekData[i].pressure_high;
        var szyValue = BloodManage.weekData[i].pressure_low;

        // 收缩压
        if (ssyValue > 90) {
            G('height-point-' + week).style.top = (ssyTop - (ssyValue - 90) * 2) + 'px';
        } else {
            G('height-point-' + week).style.top = (ssyTop + (ssyValue - 90) * 2) + 'px';
        }
        // 舒张压
        if (szyValue > 60) {
            G('low-point-' + week).style.top = (szyTop - (szyValue - 60) * 2) + 'px';
        } else {
            G('low-point-' + week).style.top = (szyTop + (szyValue - 60) * 2) + 'px';
        }

        G('height-point-' + week).style.visibility = 'visible';
        G('low-point-' + week).style.visibility = 'visible';
    },

    // 渲染历史数据表格
    assignHistoryDataForm:function () {
        BloodManage.pageTotal = Math.ceil(BloodManage.hisData.length / BloodManage.pageNum);    //总页数
        BloodManage.pageData(BloodManage.pageNumber);
    },

    // 历史数据实现分页
    pageData: function (pageNumber) {
        // pageNumber为当前页码，maxIndex当前页最大序号
        var maxIndex = BloodManage.pageNum * pageNumber ;
        // 当前页的起始序号= 最大序号 - 每页条数
        var i = maxIndex - BloodManage.pageNum;

        if (maxIndex > BloodManage.hisData.length) {
            maxIndex = BloodManage.hisData.length;
        };
        var htm = '';
        for (i; i < maxIndex; i++) {
            htm += '<tr>'
            htm += '<td>' + BloodManage.hisData[i].create_dt.slice(0,16) + '</td>';
            // htm += '<td>' + BloodManage.weekData[i].dt_type + '</td>';
            htm += '<td>' + BloodManage.hisData[i].pressure_high+'/'+BloodManage.hisData[i].pressure_low+'mmHg</td>';
            htm += '<td>' + (BloodManage.hisData[i].pressure_flag == 0 ? '正常':'异常') + '</td>';
            htm += '</tr>'
        };
        // 渲染页面
        G('history-data-form').innerHTML =htm;
        G('page-num').innerHTML =BloodManage.pageNumber+'/'+BloodManage.pageTotal;
    },
    // 表更焦点切换历史数据和本周情况
    changeImage: function (btn, hasFocus) {
        switch (btn.id) {
            case 'week-detail':
                if (hasFocus) {
                    Show('week-detail-content');
                } else {
                    if(LMEPG.BM.getCurrentButton().id == 'history-data'){
                        Hide('tip');
                        Hide('week-detail-content');
                        Show('page-num');
                        G('week-detail').src =g_appRootPath+ '/Public/img/hd/CommunityHospital/BloodManage/btn_week_detail_b.png';
                    }else {
                        Show('week-detail-content');
                    }
                };
                break;
            case 'history-data':
                if (hasFocus) {
                    Show('history-data-content');
                    BloodManage.assignHistoryDataForm();
                } else {
                    // 增加判断焦点丢失后 获取焦点的目标 隐藏还是改变按钮颜色
                    if(LMEPG.BM.getCurrentButton().id == 'week-detail'){
                        Show('tip');
                        Hide('history-data-content');
                        Hide('page-num');
                        G('history-data').src =g_appRootPath+ '/Public/img/hd/CommunityHospital/BloodManage/btn_history_data_b.png';
                    }else {
                        Show('history-data-content');
                    }
                };
                break;
            case 'ask-doctor':
            case 'blood-data-up':
                if(LMEPG.BM.getCurrentButton().id == 'week-detail'){
                    G('history-data').src = g_appRootPath+'/Public/img/hd/CommunityHospital/BloodManage/btn_history_data_b.png';
                    Hide('history-data-content');
                }
                break;
        };

    },


    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('blood-manage-index');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        currentPage.setParam('focusId', beClickId);
        currentPage.setParam('name', RenderParam.name);
        currentPage.setParam('age', RenderParam.age);
        currentPage.setParam('sex', RenderParam.sex);
        currentPage.setParam('member_id', RenderParam.memberId);
        return currentPage;
    },

    jumpPage: function (btn) {
        switch (btn.id){
            case 'ask-doctor':
                BloodManage.onClickAskDoctor();
                break;
            case 'blood-data-up':
                BloodManage.onClickBloodDataUp();
                break;
            case 'his-prev':
                if(BloodManage.pageNumber != 1){
                    // 前一页
                    BloodManage.pageNumber = BloodManage.pageNumber - 1;
                    BloodManage.pageData(BloodManage.pageNumber);
                };
                break;
            case 'his-next':
                if(BloodManage.pageNumber <BloodManage.pageTotal){
                    // 下一页
                    BloodManage.pageNumber = BloodManage.pageNumber + 1;
                    BloodManage.pageData(BloodManage.pageNumber);
                };
                break;
        }

    },

    /**跳转视频问诊界面*/
    onClickAskDoctor: function () {
        var currObj = BloodManage.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('doctorList');
        addrObj.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(addrObj, currObj);
    },
    /**血压数据上传*/
    onClickBloodDataUp: function () {
        var currObj = BloodManage.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('blood-data-up');
        addrObj.setParam('member_id', RenderParam.memberId);
        addrObj.setParam('name', RenderParam.name);
        LMEPG.Intent.jump(addrObj, currObj);
    },
    closeLayer: function () {
        G("show-intro").style.display = "none";
        LMEPG.BM.requestFocus("experts-introduce");
    },

    initBtns: function () {
        var buttons = [{
            id: 'ask-doctor',
            type: 'img',
            name: '咨询医生',
            nextFocusDown: 'week-detail',
            nextFocusLeft: 'week-detail',
            nextFocusRight: 'blood-data-up',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_ask_doctor.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_ask_doctor_f.png',
            focusChange: BloodManage.changeImage,
            click: this.jumpPage
        }, {
            id: 'blood-data-up',
            type: 'img',
            name: '血压数据上传',
            nextFocusDown: 'week-detail',
            nextFocusLeft: 'ask-doctor',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_blood_data_up.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_blood_data_up_f.png',
            focusChange: BloodManage.changeImage,
            click: this.jumpPage
        }, {
            id: 'week-detail',
            type: 'img',
            name: '本周情况',
            nextFocusUp: 'ask-doctor',
            nextFocusRight: 'history-data',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_week_detail.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_week_detail_f.png',
            focusChange: BloodManage.changeImage,
            click: this.jumpPage
        }, {
            id: 'history-data',
            type: 'img',
            name: '历史数据',
            nextFocusUp: 'ask-doctor',
            nextFocusLeft: 'week-detail',
            nextFocusDown: 'his-next',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_history_data.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_history_data_f.png',
            focusChange: BloodManage.changeImage,
            click: this.jumpPage
        },{
            id: 'his-prev',
            type: 'img',
            name: '历史数据-上翻页',
            nextFocusUp: 'history-data',
            nextFocusRight: 'his-next',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_prev.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_prev_f.png',
            focusChange: '',
            click: this.jumpPage
        }, {
            id: 'his-next',
            type: 'img',
            name: '历史数据-下翻页',
            nextFocusUp: 'history-data',
            nextFocusLeft: 'his-prev',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_next.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_next_f.png',
            focusChange: '',
            click: this.jumpPage
        }];

        // LMEPG.BM.init('ask-doctor', buttons, true);
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'ask-doctor', buttons, true);
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

