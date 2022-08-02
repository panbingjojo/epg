// var RenderParam.hospitalName = LMEPG.Func.getLocationString('RenderParam.hospitalName');
var HospitalArea = {

    functionList: [], // 具体功能列表

    showFunctionNum: 4, // 最大允许显示的功能数量

    firstRowFuncDownFocusId: '',

    init: function () {
        CommunityHosp.getHospData();
        this.createBtns();
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: CommunityHosp.goBack});
    },

    closeLayer: function () {
        G("show-intro").style.display = "none";
        LMEPG.BM.requestFocus("experts-introduce");
    },
    areaMap: function () {
        return RenderParam.hospitalId;
    },
    functionsType: {
        'zxzx': 'online-case',       // 在线咨询
        'zjjs': 'experts-introduce', // 专家介绍
        'yyfw': 'booking_service',   // 预约服务
        'jkjy': 'health-education',  // 健康教育
        'xygl': 'blood-manage',      // 血压管理
        'yygh': 'order-register',    // 预约挂号
        'sqys': 'community-doctor',   // 社区医生
        'tsks': 'especially-department', // 特色科室
    },

    //获取左边焦点ID
    getLeftFocus: function (functions, fun) {
        var index = functions.indexOf(fun);
        if (index == -1)
            return '';
        if (index == 0)
            return this.functionsType[functions[functions.length - 1]];
        else
            return this.functionsType[functions[index - 1]];
    },
    //获取右边焦点
    getRightFocus: function (functions, fun) {
        var index = functions.indexOf(fun);
        if (index == -1)
            return '';
        if (index == functions.length - 1)
            return this.functionsType[functions[0]];
        else
            return this.functionsType[functions[index + 1]];
    },

    showFunctionList: function (pageIndex) {
        //最多加载4个导航图片
        var maxLenth = parseInt(pageIndex) + Math.min(this.showFunctionNum, this.functionList.length);
        var strHtml = '';
        for (pageIndex; pageIndex < maxLenth; pageIndex++) {
            var functionName = this.functionsType[this.functionList[pageIndex]]
            strHtml += '<img id="' + functionName + '" src="' + g_appRootPath + '/Public/img/hd/CommunityHospital/' + functionName + '.png" alt="">'
        }
        G('hospital-nav').innerHTML = strHtml;


        if (RenderParam.pageIndex == 1) {
            var fourFunctionName = this.functionsType[this.functionList[3]];
            var fiveFunctionName = this.functionsType[this.functionList[4]];
            //G(fourFunctionName).style.marginRight = '27px';
            //G(fiveFunctionName).style.marginRight = '0';
            G('hospital-nav').style.left = '70px';
            Hide('next');
            Show('prev');
        } else {
            Hide('prev');
            if (this.functionList.length > this.showFunctionNum) Show('next');
            G('hospital-nav').style.left = '0px';
        }
    },

    changeList: function (key, btn) {
        var _this = HospitalArea;

        if(_this.functionList.length <= _this.showFunctionNum) return;

        var secondFunctionName = _this.functionsType[_this.functionList[1]];
        var fourFunctionName = _this.functionsType[_this.functionList[3]];

        if (key === 'left' && btn.id === secondFunctionName) {
            RenderParam.pageIndex = 0;
            _this.showFunctionList(RenderParam.pageIndex);

            var firstFunctionName = _this.functionsType[_this.functionList[0]];
            LMEPG.BM.requestFocus(firstFunctionName)

            return false;
        }
        if (key === 'right' && btn.id === fourFunctionName) {
            RenderParam.pageIndex = 1;
            //传入起始导航模块下标
            _this.showFunctionList(RenderParam.pageIndex);

            var fiveFunctionName = _this.functionsType[_this.functionList[4]];
            LMEPG.BM.requestFocus(fiveFunctionName);

            return false;
        }
    },

    createBtns: function () {
        var self = this;
        var functionsAll = ['zxzx', 'zjjs', 'yyfw', 'jkjy', 'xygl', 'sqys', 'yygh'];
        var functionsAll2 = ['tsks'];
        var functionsArr = RenderParam.functions.split(',');
        var functions = [];
        var functions2 = [];
        //确保按钮顺序为 在线咨询，专家介绍，健康教育，血压管理
        functionsAll.map(function (v) {
            if (functionsArr.indexOf(v) > -1)
                functions.push(v);
        });

        self.functionList = functions;

        functionsAll2.map(function (v) {
            if (functionsArr.indexOf(v) > -1)
                functions2.push(v);
        });

        self.showFunctionList(RenderParam.pageIndex); // 展示页面
        var buttons = [];
        functions.map(function (v) {
            switch (v) {
                case 'zxzx':
                    buttons.push({
                        id: 'online-case',
                        type: 'img',
                        name: '在线咨询',
                        nextFocusUp: functions2.length === 0 ? '' : self.functionsType[functions2[0]],
                        nextFocusLeft: self.getLeftFocus(functions, v),
                        nextFocusRight: self.getRightFocus(functions, v),
                        backgroundImage: '/Public/img/hd/CommunityHospital/online-case.png',
                        focusImage: '/Public/img/hd/CommunityHospital/online-case-f.png',
                        focusChange: '',
                        beforeMoveChange: self.changeList,
                        click: CommunityHosp.jumpPage
                    });
                    break;
                case 'zjjs':
                    buttons.push({
                        id: 'experts-introduce',
                        type: 'img',
                        name: '专家介绍',
                        nextFocusUp: functions2.length === 0 ? '' : self.functionsType[functions2[0]],
                        nextFocusDown: '',
                        nextFocusLeft: self.getLeftFocus(functions, v),
                        nextFocusRight: self.getRightFocus(functions, v),
                        backgroundImage: '/Public/img/hd/CommunityHospital/experts-introduce.png',
                        focusImage: '/Public/img/hd/CommunityHospital/experts-introduce-f.png',
                        focusChange: '',
                        beforeMoveChange: self.changeList,
                        isRouteVideo: functionsArr.indexOf("zjjs2jkjy") > -1,
                        click: CommunityHosp.jumpPage
                    });
                    break;
                case 'yyfw':
                    buttons.push({
                        id: 'booking_service',
                        type: 'img',
                        name: '预约服务',
                        nextFocusUp: functions2.length === 0 ? '' : self.functionsType[functions2[0]],
                        nextFocusDown: '',
                        nextFocusLeft: self.getLeftFocus(functions, v),
                        nextFocusRight: self.getRightFocus(functions, v),
                        backgroundImage: '/Public/img/hd/CommunityHospital/tongren/server.png',
                        focusImage: '/Public/img/hd/CommunityHospital/tongren/server_f.png',
                        focusChange: '',
                        beforeMoveChange: self.changeList,
                        click: CommunityHosp.jumpPage
                    });
                    break;
                case 'jkjy':
                    buttons.push({
                        id: 'health-education',
                        type: 'img',
                        name: '健康教育',
                        nextFocusUp: functions2.length === 0 ? '' : self.functionsType[functions2[0]],
                        nextFocusDown: '',
                        nextFocusLeft: self.getLeftFocus(functions, v),
                        nextFocusRight: self.getRightFocus(functions, v),
                        backgroundImage: '/Public/img/hd/CommunityHospital/health-education.png',
                        focusImage: '/Public/img/hd/CommunityHospital/health-education-f.png',
                        focusChange: '',
                        beforeMoveChange: self.changeList,
                        click: CommunityHosp.jumpPage
                    });
                    break;
                case 'xygl':
                    buttons.push({
                        id: 'blood-manage',
                        type: 'img',
                        name: '血压管理',
                        nextFocusUp: functions2.length === 0 ? '' : self.functionsType[functions2[0]],
                        nextFocusDown: '',
                        nextFocusLeft: self.getLeftFocus(functions, v),
                        nextFocusRight: self.getRightFocus(functions, v),
                        backgroundImage: '/Public/img/hd/CommunityHospital/blood-manage.png',
                        focusImage: '/Public/img/hd/CommunityHospital/blood-manage-f.png',
                        focusChange: '',
                        beforeMoveChange: self.changeList,
                        click: CommunityHosp.jumpPage
                    });
                    break;
                case 'sqys':
                    buttons.push({
                        id: 'community-doctor',
                        type: 'img',
                        name: '社区医生',
                        nextFocusUp: functions2.length === 0 ? '' : self.functionsType[functions2[0]],
                        nextFocusDown: '',
                        nextFocusLeft: self.getLeftFocus(functions, v),
                        nextFocusRight: self.getRightFocus(functions, v),
                        backgroundImage: '/Public/img/hd/CommunityHospital/community-doctor.png',
                        focusImage: '/Public/img/hd/CommunityHospital/community-doctor-f.png',
                        focusChange: '',
                        beforeMoveChange: self.changeList,
                        click: CommunityHosp.jumpPage
                    });
                    break;
                case 'yygh':
                    buttons.push({
                        id: 'order-register',
                        type: 'img',
                        name: '预约挂号',
                        nextFocusUp: functions2.length === 0 ? '' : self.functionsType[functions2[0]],
                        nextFocusDown: '',
                        nextFocusLeft: self.getLeftFocus(functions, v),
                        nextFocusRight: self.getRightFocus(functions, v),
                        backgroundImage: '/Public/img/hd/CommunityHospital/order-register.png',
                        focusImage: '/Public/img/hd/CommunityHospital/order-register-f.png',
                        focusChange: '',
                        isShowDialog: functionsArr.indexOf("yygh2dialog") > -1,
                        beforeMoveChange: self.changeList,
                        click: CommunityHosp.jumpPage
                    });
                    break;
            }
        });

        functions2.map(function (v) {
            G(self.functionsType[v]).style.display = "inline";
            switch (v) {
                case "tsks":
                    buttons.push({
                        id: 'especially-department',
                        type: 'img',
                        name: '特色科室',
                        nextFocusUp: '',
                        nextFocusDown: functions.length > self.showFunctionNum ? self.functionsType[functions[functions.length - 2]] : self.functionsType[functions[functions.length - 1]],
                        nextFocusLeft: '',
                        nextFocusRight: '',
                        backgroundImage: '/Public/img/hd/CommunityHospital/especially-department.png',
                        focusImage: '/Public/img/hd/CommunityHospital/especially-department-f.png',
                        focusChange: '',
                        click: CommunityHosp.jumpPage
                    });
                    break;
            }
        });

        var focusId = LMEPG.Func.getLocationString('focusId') || (this.functionsType[functions[0]] || 'online-case');
        LMEPG.BM.init(focusId, buttons, true);
    },
};
