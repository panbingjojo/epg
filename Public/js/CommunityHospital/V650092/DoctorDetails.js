var CommunityHosp = {
    marquee: marquee(),
    init: function () {
        this.getDoctorList();
    },
    goBack: function () {
        LMEPG.onEvent = '';
        LMEPG.Intent.back();
    },
    /**
     * 拉取医生list
     * @param data
     */
    hospitalId: LMEPG.Func.getLocationString('hospitalId') ,
    getDoctorList: function () {
        var postData = {};
        postData.deptId = '';
        postData.page = 1;
        postData.pageSize = 1;
        postData.hospId = CommunityHosp.hospitalId;
        // 超时返回

        LMEPG.UI.showWaitingDialog('', '', function () {
            LMEPG.UI.showToast('请求超时即将返回！', 2, CommunityHosp.goBack);
        });
        LMEPG.ajax.postAPI(
            'Doctor/getDoctorListByHospId',
            postData,
            CommunityHosp.renderDoctor,
            function () {
                LMEPG.UI.showToast('获取医生列表失败！即将返回', 3, CommunityHosp.goBack);
            });
    },
    /**转换互联网医生头像图片工具函数*/
    createDoctorUrl: function (urlPrefix, doctorId, avatarUrl, carrierID) {
        var head = {
            func: 'getDoctorHeadImage',
            carrierId: carrierID,
            areaCode: ''
        };
        var json = {
            doctorId: doctorId,
            avatarUrl: avatarUrl
        };
        return urlPrefix + '?head=' + JSON.stringify(head) + '&json=' + JSON.stringify(json);
    },
    /**输出社区医生信息*/
    renderDoctor: function (data) {
        var _this = CommunityHosp;
        LMEPG.UI.dismissWaitingDialog('');
        // 数据为空退出
        if (data.result.code != 0 || !data.result.list.length) {
            LMEPG.UI.showToast(data.result.message + '，即将返回！', 2, _this.goBack);
            return;
        }
        var doctorData = data.result.list[0];
        // 互联网医生头像转换
        var expertUrl = CommunityHosp.createDoctorUrl(RenderParam.expertUrl, doctorData.doc_id, doctorData.avatar_url_new, '650092');
        G('div-wrapper').innerHTML = '<img class="doctor-pic" src=' + expertUrl + '>'
            + '<ul id="doctor-wrapper">'
            + '<li class="doctor-name">' + doctorData.doc_name
            + '<li class="doctor-department">' + doctorData.department
            + '<li class="doctor-position">' + doctorData.job_title
            + '<li class="doctor-skillful">' +
            CommunityHosp.marquee.start({
                txt: doctorData.good_disease,
                len: 6,
                dir: 'left',
                vel: 2
            });
        _this.renderHospital(doctorData);
        _this.renderTitle(doctorData);
        _this.createBtns();
    },
    /**输出社区医院*/
    renderHospital: function (data) {
        G('curr-hospital').innerHTML = ''
            + '<p class="hosp-name">' + data.hospital + '</p>'
            + '<img id="hosp-pic" src="__ROOT__/Public/img/hd/CommunityHospital/hosp-pic.png" alt="">'
            + '<div class="hosp-intro-wrap">'
            + '<p class="hosp-intro-title">' + data.hospital + '简介</p>'
            + '<p class="hosp-intro-text">' +
            CommunityHosp.marquee.start({
                txt: '东瑞北路社区卫生成立于2010年9月，坐落于米东区东瑞北路，辖区范围东起芦草沟乡人民庄子村铁路，西至东瑞北路，南起东山街，北至东山供水公司，辖区面积0.5平方公里，辖区有幼儿园1所，现有物业管理的小区2个。居民楼17栋，1076套住房，目前主要管理瑞禾园小区和康居苑小区市属廉租房管理中心所建廉租房小区，瑞禾园小区市属城建工程公司所建的经济适用房小区。社区卫生服务是党和政府的惠民行动，从源头上解决居民“看病难、看病贵”问题。我服务站是以人的健康为中心、以家庭为单位、需求为导向、社区为范围、家庭为单位的连续综合卫生服务。推行“小病进社区，大病进医院，康复回社区”的理念。常见病、多发病、慢性病在社区，得到家庭医生式的跟踪服务。真正做到“尊重生命，居民本位”，全心全意为社区居民的健康服务。我们将用最大的热情和努力为居民服务，愿我们在健康路上携手同行。',
                len: 100,
                dir: 'up',
                vel: 2
            }) + '</p>';
    },
    /**社区标题组装*/
    renderTitle: function (data) {
        var getIndex = data.hospital.indexOf('社区');
        var preFixName = data.hospital.slice(0, getIndex);
        G('title').innerHTML = preFixName + '社区';
    },
    /**获取当前也没地址参数*/
    currentPage: function () {
        var obj = LMEPG.Intent.createIntent('community-doctor');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        obj.setParam('page', CommunityHosp.page);
        return obj;
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

        if (accessAccount.indexOf(RenderParam.accountId) == -1) {
            LMEPG.UI.showToast('您的社区医生暂未开放!', 3);
            return;
        }
        var currObj = CommunityHosp.currentPage();
        var addrObj = LMEPG.Intent.createIntent('doctorList');
        addrObj.setParam('userId', RenderParam.userId);
        addrObj.setParam('hospitalId', CommunityHosp.hospitalId);
        addrObj.setParam("s_demo_id", 'superDemo');

        LMEPG.Intent.jump(addrObj, currObj);
    },
    /**创建虚拟按钮*/
    createBtns: function () {
        var buttons = [{
            id: 'one-key-advice',
            type: 'img',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/one-key-advice.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/one-key-advice-f.png',
            click: this.goInquiry
        }];
        LMEPG.BM.init('one-key-advice', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
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
CommunityHosp.init();
