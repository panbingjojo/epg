var Const_Data = {
    hospitalQrInfo: {
        "12":"微信关注公众号“宁夏医科大学总院”-诊疗服务，选择“预约挂号”",
        "13":"微信关注公众号“宁夏医科大学总院”-诊疗服务，选择“预约挂号”",
        "14":"微信关注公众号“宁夏医科大学总院”-诊疗服务，选择“预约挂号”",
        "15":"微信关注公众号“宁夏医科大学总院”-诊疗服务，选择“预约挂号”",
        "16":"微信点击“发现”小程序搜索“银川健康广场”，进入“预约挂号”",
        "17":"微信点击“发现”小程序搜索“银川健康广场”，进入“预约挂号”",
        "18":"微信点击“发现”小程序搜索“银川健康广场”，进入“预约挂号”",
        "19":"微信关注公账号“银川市中医院”-预约挂号",
        "20":"微信点击“发现”小程序搜索“银川健康广场”，进入“预约挂号”",
        "21":"",
        "22":"微信关注公账号“银川市妇幼保健院”-点击“微首页”输入挂号手机号码验证通过后，选择“预约挂号”",
        "23":"微信关注公账号“宁夏区妇幼保健院宁夏儿童医院”-点击“预约挂号”",
        "24":"微信关注公众号“宁夏贺兰县人民医院”-点击“掌上医院”",
        "25":"微信关注公众号“宁夏第五人民医院”-点击“预约”",
        "26":"微信关注公众号“石嘴山市第二人民医院”-点击“患者服务”，选择“微医院”",
        "27":"微信关注公众号“青铜峡市人民医院”-点击“患者服务”选择“预约挂号”",
        "28":"微信关注公众号“宁夏回族自治区人民医院”-门诊服务，选择“挂号&预约”",
        "29":"微信关注公众号“宁夏固原市人民医院”-点击“就诊服务”选择“预约挂号”",
        "30":"微信关注公众号“宁夏中医医院暨中医研究院”-点击“预约挂号”",
    }
};
var keepLevel = 1;
var Level_1 = {
    /**
     * 初始参数
     * @param data
     */
    init: function (data) {
        keepLevel = 1;
        this.privatePagination = new Pagination({
            data: data,
            page: +LMEPG.Func.getLocationString('levelPage_1') || 0,
            pageSize: 6,
            navPageCountId: 'page-number',
            prevArrowId: 'prev-arrow',
            nextArrowId: 'next-arrow'
        });
        this.privatePagination.renderPage(this.renderHospitalList);
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusIndex') || 'focus-1', [], '', true);
    },

    /**
     * 异步拉取后台数据获取
     */
    getServerData: function () {
        var me = this;
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalListInfo", "", function (rsp) {
            try {
                if (rsp.result == 0) {
                    me.init(rsp.list);
                } else {
                    LMEPG.UI.showToast("数据拉取失败:" + rsp);
                }
            } catch (e) {
                LMEPG.UI.showToast("数据拉取失败:" + e);
            }
        });
    },

    /**
     * 渲染医院列表
     * @param sIdx
     * @param pageData
     * @param len
     */
    renderHospitalList: function (pageData, len) {
        var me = Level_1;
        var htm = '';
        var item;
        me.buttons = [{
            id: 'btn-go-inquiry-page',
            type: 'img',
            nextFocusDown: 'focus-1',
            click: Util.jumpInquiryPage,
            focusImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/go_inquiry_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/go_inquiry.png'
        }];

        while (len--) {
            item = pageData[len];
            item.QRInfo = Const_Data.hospitalQrInfo[item.hospital_id];
            htm = '<div class="hos-list"><img '
                + 'id=focus-' + (len + 1)
                + ' data-title=' + item.hospital_name
                + ' src =' + RenderParam.fsUrl + item.img_url + '>'
                + '<p id="title-' + (len + 1) + '">' + item.hospital_name + '</p></div>' + htm;

            if(carrierId == "07430093"){
                me.buttons.push({
                    id: 'focus-' + (len + 1),
                    idx: item.hospital_name,
                    code: item.hospital_code,
                    name: item.hospital_name,
                    type: 'div',
                    nextFocusUp: (len + 1) < 4 ? '' : 'focus-' + (len - 2),
                    nextFocusDown: 'focus-' + (len + 4),
                    nextFocusLeft: 'focus-' + (len),
                    nextFocusRight: 'focus-' + (len + 2),
                    click: me.enterKey,
                    focusChange: me.onFocusChange,
                    focusImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/register_bg.png',
                    backgroundImage: 'null',
                    beforeMoveChange: me.onMoveChange,
                    data: item
                });
            }else{
                me.buttons.push({
                    id: 'focus-' + (len + 1),
                    idx: item.hospital_name,
                    code: item.hospital_code,
                    name: item.hospital_name,
                    type: 'div',
                    nextFocusUp: (len + 1) < 4 ? 'btn-go-inquiry-page' : 'focus-' + (len - 2),
                    nextFocusDown: 'focus-' + (len + 4),
                    nextFocusLeft: 'focus-' + (len),
                    nextFocusRight: 'focus-' + (len + 2),
                    click: me.enterKey,
                    focusChange: me.onFocusChange,
                    focusImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/register_bg.png',
                    backgroundImage: 'null',
                    beforeMoveChange: me.onMoveChange,
                    data: item
                });
            }
        }

        LMEPG.BM.addButtons(me.buttons);
        G("hospital-wrapper").innerHTML = htm;
    },

    /**
     * 按钮被按下
     * @param btn
     */
    enterKey: function (btn) {
        Level_1.keepLevel1FocusId = btn.id; // 焦点保持

        // 青海--跳转独有医院界面
        if (btn.code === "QH001") {
            Util.jumpEye();
            return;
        }

        // 跳转二级界面
        Level_2.init(btn.data,false);
    },

    /**
     * 按钮获得焦点
     * @param btn
     * @param focus
     */
    onFocusChange: function (btn, focus) {
        var pElement = G('title-' + btn.id.slice(-1)); // 个位
        var txt = G(btn.id).getAttribute('data-title');
        if (focus) {
            pElement.innerHTML = Util.marquee(txt, 14);
        } else {
            pElement.innerHTML = txt;
        }
    },

    /**
     * 按钮移动焦点
     * @param key
     * @param btn
     */
    onMoveChange: function (key, btn) {
        var me = Level_1;
        if (key === 'left' && (btn.id === 'focus-1' || btn.id === 'focus-4')) {
            me.privatePagination.prevPage(function (sIdx, pageData, len) {
                me.renderHospitalList(sIdx, pageData, len);
                LMEPG.BM.requestFocus('focus-6');
            });
            return false;
        }

        if (key === 'right' && (btn.id === 'focus-3' || btn.id === 'focus-6')) {
            me.privatePagination.nextPage(function (sIdx, pageData, len) {
                me.renderHospitalList(sIdx, pageData, len);
                LMEPG.BM.requestFocus('focus-1');
            });
            return false;
        }

        if(key === 'down'){
            if(!G(btn.nextFocusDown)){
                var x = parseInt(btn.nextFocusDown.substr(6))
                LMEPG.BM.requestFocus('focus-'+(x-1))
            }
        }
    }
};

var Level_2 = {
    keepLevel2FocusId: 'btn-detail',
    init: function (data,isBack) {
        keepLevel = 2;
        this.buttons = [];
        this.data = data;
        this.hospitalName = data.hospital_name;
        this.renderSingleHospital(data);
        if(RenderParam.lmcid == '07430093' && !isBack){
            Level_2.keepLevel2FocusId = 'btn-detail';
        }
        LMEPG.BM.requestFocus(this.keepLevel2FocusId);
    },

    /**
     * 渲染二级界面
     * @param data
     */
    renderSingleHospital: function (data) {
        var htm = '';
        var level2Wrapper = document.createElement('div');
        htm += '</div><img class="hos-pic"  src=' + RenderParam.fsUrl + data.detail_img_url + '>';
        htm += '<div id="inner-wrapper">';
        if(RenderParam.lmcid == '640094'){
            htm += '<table class="QRInfo"><tr><td>' + data.QRInfo + '</td></tr></table>';
        }else {
            htm += '<img class="code"  src=' + RenderParam.fsUrl + data.qrcode_img_url + '>';
            htm += '<img class="code-text"  src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/code_text.png">';
        }

        htm += '<img src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/addr.png" class="icon-address">';
        htm += '<img src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/tel.png" class="icon-tel">';
        htm += '<p class="iframe-title">' + LMEPG.Func.marquee2({txt: data.hospital_name, len: 16}, true, true);
        htm += '<p class="iframe-address">' + LMEPG.Func.marquee2({txt: data.location, len: 30}, true, true);
        htm += '<p class="iframe-tel">' + data.tel + '</p>';
        htm += '<img class="level-2-btn" id="btn-detail" src="'+ g_appRootPath +'/Public/img/hd/Home/V15/Home/intro_detail.png">';
        htm += '<img class="level-2-btn" id="btn-department" src="'+ g_appRootPath +'/Public/img/hd/Home/V15/Home/intro_item.png">';
        htm += '<img class="level-2-btn" id="btn-expert" src="'+ g_appRootPath +'/Public/img/hd/Home/V15/Home/intro_experts.png">';

        this.buttons = [{
            id: 'btn-detail',
            type: "img",
            name: '医院详情',
            nextFocusUp: "",
            nextFocusDown: "btn-department",
            focusImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/intro_detail_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/intro_detail.png',
            click: this.enterKey,
            beforeMoveChange: "",
            data: data
        }, {
            id: 'btn-department',
            type: "img",
            name: '推荐科室',
            nextFocusUp: "btn-detail",
            nextFocusDown: "btn-expert",
            focusImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/intro_item_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/intro_item.png',
            click: this.enterKey,
            beforeMoveChange: "",
            data: data
        }, {
            id: 'btn-expert',
            type: "img",
            name: '推荐专家',
            nextFocusUp: "btn-department",
            nextFocusDown: "",
            focusImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/intro_experts_f.png',
            backgroundImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/intro_experts.png',
            click: this.enterKey,
            beforeMoveChange: "",
            data: data
        }];

        level2Wrapper.innerHTML = htm;
        level2Wrapper.id = 'level-2-container';
        document.body.appendChild(level2Wrapper);
        LMEPG.BM.addButtons(this.buttons);
    },
    enterKey: function (btn) {
        Level_2.keepLevel2FocusId = btn.id;
        switch (btn.id) {
            case 'btn-detail':
                Level_3.goDetail(btn);
                break;
            case 'btn-department':
                try {
                    Level_3.goDepartment(btn);
                }catch (e) {
                    LMEPG.Log.debug('Level_3.goDepartment error: ' + e);
                }

                break;
            case 'btn-expert':
                Util.getServerExpert(btn.data.hospital_id, function (data) {
                    Level_3.goIntroExperts(data);
                });
                break;
        }
    }
};

var Level_3 = {
    doctorFocusId: 'doctor-1',
    setLevel_3_focus: 'inner-wrapper',
    init: function (renderCallback) {
        keepLevel = 3;
        this.privatePagination = new Pagination({
            data: this.data,
            mode: this.mode,
            page: 0,
            pageSize: this.pageSize,
            navPageCountId: this.navPageCountId,
            prevArrowId: this.prevArrowId,
            nextArrowId: this.nextArrowId
        });

        this.privatePagination.renderPage(renderCallback);
        LMEPG.BM.requestFocus(this.setLevel_3_focus);
    },

    /**
     * 进入推荐科室
     */
    goDepartment: function (btn) {
        var me = Level_3;

        me.pageSize = 8;
        me.navPageCountId = 'hos-dep-page-number';
        me.prevArrowId = 'hos-dep-prevPage';
        me.nextArrowId = 'hos-dep-nextPage';
        me.resolvedDepartmentData(btn.data);
        me.init(me.renderDepartment);
        LMEPG.BM.addButtons(me.buttons);
        LMEPG.BM.requestFocus('inner-wrapper');
    },

    /**
     * 渲染科室
     * @param pageData
     * @param len
     */
    renderDepartment: function (pageData, len) {
        var me = Level_3;
        var htm = '';
        htm += '<p class="departments-hospital-title">' + Util.marquee(Level_2.hospitalName, 15) + '</p>';
        htm += '<p id="hos-dep-page-number"></p>';
        htm += '<img class="level-3-arrow" id="hos-dep-prevPage" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/up.png">';
        htm += '<img class="level-3-arrow" id="hos-dep-nextPage" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/down.png">';
        // 科室名称
        while (len--) {
            if(getLength(pageData[len])>21){
                htm += '<marquee direction="left" class="departments" style="position: static;display: inline-block;margin: 22px 40px 10px 70px;overflow: hidden;">' + pageData[len] + '</marquee>';
            }else{
                htm += '<p class="departments">' + pageData[len];
            }
        }
        // 翻页脚手架ID
        me.buttons = {
            id: 'inner-wrapper',
            useId: 'btn-department',
            data: me.data,
            callback: me.renderDepartment,
            name: '',
            type: "div",
            beforeMoveChange: me.onMoveChange
        };

        G("inner-wrapper").innerHTML = htm;
    },

    /**
     * 解析单个医院科室数据
     * @param data
     */
    resolvedDepartmentData: function (data) {
        var tempData = LMEPG.Func.string.replaceAll(data.recommend_dept);
        this.data = tempData.split(/[,\uff0c\u3001]/g);
        LMEPG.Func.array.fullAry(this.data);
    },

    /**
     * 按钮移动焦点
     * @param key
     * @param btn
     */
    onMoveChange: function (key, btn) {
        var me = Level_3;
        me.keepLevel3FocusId = btn.id;

        if (key === 'up') {
            me.privatePagination.prevPage(function (sIdx, pageData, len) {
                btn.callback(sIdx, pageData, len);
            });
        }

        if (key === 'down') {
            me.privatePagination.nextPage(function (sIdx, pageData, len) {
                btn.callback(sIdx, pageData, len);
            });
        }
    },

    /**
     * 进入医院详情
     */
    goDetail: function (btn) {

        var data = this.data = btn.data;
        var htm = '<div id="hos-title" >' + Level_2.hospitalName + '</div>';
        if(carrierId == "07430093"){
            htm += '<p id="hos-details" scrollamount="3" style="margin-top: 86px;">' + data.brief_intro + '</p>';
        }else{
            htm += '<marquee id="hos-details"  direction="up" scrollamount="3">' + data.brief_intro + '</marquee>';
        }
        //htm += '<img id="hos-details-prevPage" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/up.png">';
        //htm += '<img id="hos-details-nextPage" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/down.png">';

        this.buttons = {
            id: 'inner-wrapper',
            useId: 'btn-detail',
            data: this.data,
            name: '',
            type: "div"
        };

        G("inner-wrapper").innerHTML = htm;
        LMEPG.BM.addButtons(this.buttons);
        LMEPG.BM.requestFocus(this.setLevel_3_focus);
        this.setLevel_3_focus = btn.id;
        keepLevel = 3;
    },

    /**
     * 进入推荐专家
     */
    goIntroExperts: function (data) {
        var me = Level_3;
        me.mode = 1; // 每次滚动一个，即每次翻页一个
        me.pageSize = 3;
        me.navPageCountId = 'doc-page-index';
        me.prevArrowId = 'doctor-page-up';
        me.nextArrowId = 'doctor-page-down';
        me.resolveExpertData(data);
        me.init(me.renderExpert);
        LMEPG.BM.requestFocus(me.doctorFocusId || 'doctor-1');
    },

    /**
     * 渲染专家列表
     * @param pageData
     * @param len
     */
    renderExpert: function (pageData, len) {
        var htm = '';
        var me = Level_3;
        me.buttons = [];
        htm += '<p class="departments-hospital-title">' + Level_2.hospitalName + '</p>';
        htm += '<p id="doc-page-index">' + "0/0" + '</p>';
        htm += '<img class="level-3-arrow" id="doctor-page-up" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/up.png">';
        htm += '<img class="level-3-arrow" id="doctor-page-down" src="'+ g_appRootPath +'/Public/img/hd/Menu/QHotherPages/down.png">';
        pageData.forEach(function (item, index) {
            var className = "doctors doctor-" + index + " doctor-male";
            htm += '<div id="doctor-' + (index + 1) + '"  class="' + className + '">';
            htm += '<p class="doctor-name">' + item.doctor_name;
            if(carrierId != "7430093" && carrierId != "07430093")            {
                htm += '<span class="doctor-position">' + item.doctor_level;
            }
            htm += '<p class="doctor-subject-name">' + item.doctor_level;
            htm += '<span class="doctor-good-at">' + item.doctor_intro;
            htm += '</div>';

            me.buttons.push({
                id: 'doctor-' + (index + 1),
                name: 'doctor-' + (index + 1),
                type: 'div',
                nextFocusUp: 'doctor-' + index,
                nextFocusDown: 'doctor-' + (index + 2),
                focusImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/doctor_male_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V15/Home/doctor_male.png',
                click: Level_4.renderDoctorDetail,
                focusChange: "",
                beforeMoveChange: me.doctorListMoveFocusChange,
                cData: item,
                callback: me.renderExpert
            });
        });

        LMEPG.BM.addButtons(me.buttons);
        G("inner-wrapper").innerHTML = htm;
    },

    /**
     * 专家列表滚动
     * @param key
     * @param btn
     * @returns {boolean}
     */
    doctorListMoveFocusChange: function (key, btn) {
        var me = Level_3;
        me.keepLevel3FocusId = btn.id;

        if (key === 'up' && btn.id === 'doctor-1') {
            me.privatePagination.prevPage(function (sIdx, pageData, len) {
                btn.callback(sIdx, pageData, len);
                LMEPG.BM.requestFocus('doctor-1');
            });
            return false;
        }

        if (key === 'down' && btn.id === 'doctor-3') {
            me.privatePagination.nextPage(function (sIdx, pageData, len) {
                btn.callback(sIdx, pageData, len);
                LMEPG.BM.requestFocus('doctor-3');
            });
            return false;
        }
    },

    /**
     * 解析专家数据
     * @param data
     * @returns {*}
     */
    resolveExpertData: function (data) {
        var temp = [];
        if (LMEPG.Func.isObject(data)) {
            for (var k in data) {
                var item = data[k];
                for (var i = item.length; i--;) {
                    temp.push(item[i]);
                }
            }
            data = temp;
        }
        this.data = data;
    }
};

var Level_4 = {
    /**
     * 渲染单个专家详情界面
     * @param btn
     */
    renderDoctorDetail: function (btn) {
        Level_3.keepLevel3FocusId = btn.id;
        keepLevel = 4;
        var htm = '';
        var level4Wrapper = document.createElement("div");

        htm += ' <div class="hospital-detail">';
        htm += '<img id="photo" class="hospital-photo" src="' + '/Public/img/hd/Home/V15/Home/photo_male.png">';
        htm += '<div class="introduce">';
        htm += '<div id="name" class="doctor-word2">' + btn.cData.doctor_name + '</div>';
        htm += '<div id="hospital" class="doctor-word">' + Level_2.hospitalName + '</div>';
        htm += '<div id="position" class="doctor-word">科室：' + btn.cData.dept_name + '</div>';
        htm += '<div id="department" class="doctor-word">职称：' + btn.cData.doctor_level + '</div>';
        htm += '</div>';
        htm += '</div>';
        htm += '<div class="content border">';
        if(getLength(btn.cData.doctor_intro) > 793){
            htm += '<marquee scrolldelay="270" direction="up" class="content-detail" id = "content-detail">' + btn.cData.doctor_intro;
            htm += '</marquee>';
        }else {
            htm += '<div class="content-detail" id = "content-detail">' + btn.cData.doctor_intro;
            htm += '</div>';
        }
        htm += '</div>';
        //芒果TV联通:添加问诊方式选择
        htm += ' <div style="position: absolute;top: 30px;left: 70%;display: none;">';
        htm += '<p id="inquiry-text" style="left: 901px;font-size: 18px;color: #33ffdd;margin-left: 20px;">请选择问诊方式</p>';
        htm += '<img id="ask_doc_tv_video" style = "width:55%" src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V10/ask_doc_tv_video_offline.png" alt="" >';
        htm += '<img id="ask_doc_tv_phone" style = "width:55%"  src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V10/ask_doc_tv_phone_offline.png" alt="">\n';
        htm += '<img id="ask_doc_wechat_teletext" style = "width:55%"  src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V10/ask_doc_wechat_teletext_offline.png" alt="">';
        htm += '<img id="ask_doc_wechat_video" style = "width:55%"  src="'+ g_appRootPath +'/Public/img/hd/DoctorP2P/V10/ask_doc_wechat_video_offline.png" alt="">';
        htm += ' </div>';
        level4Wrapper.innerHTML = htm;
        level4Wrapper.id = "level4Wrapper";

        LMEPG.BM.addButtons({
            id: 'debug',
            type: 'other',
            click: onBack
        });

        document.body.appendChild(level4Wrapper);
        LMEPG.BM.requestFocus("debug");
    }
};

/**
 * IPTV分页组件
 * @param opts
 * @constructor
 */
function Pagination(opts) {
    // 初始化必要的分页参数
    this.mode = 0;
    this.page = 0;
    this.data = [];
    this.pageSize = 1;
    this.maxPage = 0;
    this.navPageCountId = '';
    this.prevArrowId = '';
    this.nextArrowId = '';
    LMEPG.Func.o_mix(this, opts);
    // mode=0，正常翻页；mode=1为视觉上的滚动效果；
    this.maxPage = this.mode ? this.data.length - this.pageSize : Math.ceil(this.data.length / this.pageSize);
}

/**
 * 上一页
 * @param callback
 */
Pagination.prototype.prevPage = function (callback) {
    if (this.page > 0) {
        this.page -= 1;
        this.renderPage(callback);
    }
};

/**
 * 下一页
 * @param callback
 */
Pagination.prototype.nextPage = function (callback) {

    if (this.page + 1 < this.maxPage) {
        this.page += 1;
        this.renderPage(callback);
    }
};

/**
 * 箭头指示图标隐藏/显示切换
 */
Pagination.prototype.pageArrow = function () {
    Show(this.prevArrowId);
    Show(this.nextArrowId);
    this.page === 0 && Hide(this.prevArrowId);
    this.page + 1 >= this.maxPage && Hide(this.nextArrowId);
};

/**
 * 渲染界面
 * @param privateRenderPageCallback
 */
Pagination.prototype.renderPage = function (privateRenderPageCallback) {
    var sIdx = this.mode ? this.page : this.page * this.pageSize;
    var pageData = this.data.slice(sIdx, sIdx + this.pageSize);
    var count = pageData.length;

    // 渲染列表项
    typeof privateRenderPageCallback === 'function' && privateRenderPageCallback(pageData, count);
    // 渲染指示箭头
    this.pageArrow();
    // 渲染页数导航
    this.setNavPageNumber();
};

/**
 * 渲染分页导航数字
 */
Pagination.prototype.setNavPageNumber = function () {
    if(this.maxPage==0){
        var totalPage=1;
    }else {
        var totalPage = this.maxPage;
    }
    //var totalPage = this.maxPage;
    var page = totalPage ? (this.page + 1) : 0;
    document.getElementById(this.navPageCountId).innerHTML = page + '/' + totalPage;
};

var Util = {
    marquee: function (str, len) {
        if (str.length >= len) {
            return '<marquee>' + str + '</marquee>'
        }
        return str;
    },

    /**
     * 获取专家数据
     * @param id
     * @param callback
     */
    getServerExpert: function (id, callback) {
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalExpertInfo", {"hospital_id": id}, function (rsp) {
            try {
                if (rsp.result == 0) {
                    typeof callback === "function" && callback(rsp.list);
                } else {

                }
            } catch (e) {
                LMEPG.UI.showToast("抱歉出错了，请联系管理员 ~:" + e);
            }
        });
    },

    /**
     * 获取当前页对象
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent("orderRegister");
        objCurrent.setParam("userId", RenderParam.userId);
        objCurrent.setParam("inner", RenderParam.inner);
        objCurrent.setParam("levelPage_1", Level_1.privatePagination.page);
        objCurrent.setParam("focusIndex", 'btn-go-inquiry-page'); // 当前模块只有这个地方涉及到跳转界面
        return objCurrent;
    },

    /**
     * 跳转到弹框页
     */
    jumpEye: function () {
        var objCurrent = Util.getCurrentPage();
        var objDialog = LMEPG.Intent.createIntent("eye-hospital");
        LMEPG.Intent.jump(objDialog, objCurrent);
    },
    jumpInquiryPage:function () {
        var objCurrent = Util.getCurrentPage();

        var objDoctorP2P = LMEPG.Intent.createIntent("doctorIndex");
        objDoctorP2P.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objDoctorP2P, objCurrent, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    }
};

/**
 * 返回确认
 */
function onBack() {
    var level2Obj = G("level-2-container");
    var level4Obj = G("level4Wrapper");

    switch (keepLevel) {
        case 1:
            LMEPG.Intent.back();
            break;
        case 2:
            document.body.removeChild(level2Obj);
            LMEPG.ButtonManager.requestFocus(Level_1.keepLevel1FocusId);
            break;
        case 3:
            document.body.removeChild(level2Obj);
            Level_3.page = 0;
            Level_3.mode = 0;
            Level_3.pageSize = 0;
            Level_2.init(Level_2.data,true);
            keepLevel = 3;
            break;
        case 4:
            document.body.removeChild(level4Obj);
            LMEPG.ButtonManager.requestFocus(Level_3.keepLevel3FocusId);
            break;
    }

    // 层级传递
    keepLevel = Math.max(1, keepLevel -= 1);
}

/**
 * 获得字符串长度
 */
function getLength(val) {
    var str = new String(val);
    var bytesCount = 0;
    for (var i = 0 ,n = str.length; i < n; i++) {
        var c = str.charCodeAt(i);
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            bytesCount += 1;
        } else {
            bytesCount += 2;
        }
    }
    return bytesCount;
}