var BloodManage = {
    pageName: 'BloodDataUp',
    dataList:'',
    pageNum:4,  // 每页分页数量
    pageNumber:1,   //当前页码
    pageTotal:'',
    ssyList:[1],
    ssyPageNumber:1,
    ssyPageTotal: '',
    szyList:[1],
    szyPageNumber:1,
    szyPageTotal: '',


    init: function () {
        this.initArray();
        this.initBtns();
        // 拉取用户名列表
        LMEPG.UI.showWaitingDialog('',1);
        BloodManage.AjaxDataDown();
    },
    //初始化 收缩压和舒张压下拉列表
    initArray:function () {
        for(i=1;i<=260;i++){
            BloodManage.ssyList[i]=BloodManage.ssyList[i-1]+1;
        };
        for(i=1;i<=200;i++){
            BloodManage.szyList[i]=BloodManage.szyList[i-1]+1;
        };
    },

    // 获取当前分页数据
    pageData:function (btn) {
        if(btn.id == 'user-name-display'||btn.id == 'name-1'||btn.id == 'name-4'){  //用户名下拉列表
            // pageNumber为当前页码，maxIndex当前页最大序号
            var maxIndex = BloodManage.pageNum * BloodManage.pageNumber ;
            // 当前页的起始序号= 最大序号 - 每页条数
            var i = maxIndex - BloodManage.pageNum;

            if (maxIndex > BloodManage.dataList.length) {
                maxIndex = BloodManage.dataList.length;
            };
            var htm = '';
            for (i; i < maxIndex; i++) {
                htm += '<div id="name-'+(i%4+1)+'" class="input" data-link="'+BloodManage.dataList[i].member_id+'">' + BloodManage.dataList[i].member_name+ '</div>';
            };
            // 渲染页面
            G('user-name-list').innerHTML =htm;
        }else if(btn.id == 'ssy-display'||btn.id == 'ssy-1'||btn.id == 'ssy-4'){    //收缩压下拉列表
            var maxIndex = BloodManage.pageNum * BloodManage.ssyPageNumber ;
            var i = maxIndex - BloodManage.pageNum;

            if (maxIndex > BloodManage.ssyList.length) {
                maxIndex = BloodManage.ssyList.length;
            };
            var htm = '';
            for (i; i < maxIndex; i++) {
                htm += '<div id="ssy-'+(i%4+1)+'" class="input" data-link="'+BloodManage.ssyList[i]+'">' + BloodManage.ssyList[i]+ '</div>';
            };
            // 渲染页面
            G('ssy-list').innerHTML =htm;
        }else if(btn.id == 'szy-display'||btn.id == 'szy-1'||btn.id == 'szy-4'){    //舒张压下拉列表
            console.log('ssy'+BloodManage.szyPageNumber);
            var maxIndex = BloodManage.pageNum * BloodManage.szyPageNumber ;
            var i = maxIndex - BloodManage.pageNum;

            if (maxIndex > BloodManage.szyList.length) {
                maxIndex = BloodManage.szyList.length;
            };
            var htm = '';
            for (i; i < maxIndex; i++) {
                htm += '<div id="szy-'+(i%4+1)+'" class="input" data-link="'+BloodManage.szyList[i]+'">' + BloodManage.szyList[i]+ '</div>';
            };
            // 渲染页面
            G('szy-list').innerHTML =htm;
        }
    },
    switchPage:function (dir,btn) {
        switch (dir){
            case 'up':
                if (btn.id == 'name-1'){
                    BloodManage.prevPage(btn);
                    LMEPG.BM.requestFocus('name-4');
                    return false;
                }else if(btn.id == 'ssy-1'){
                    BloodManage.prevPage(btn);
                    LMEPG.BM.requestFocus('ssy-4');
                    return false;
                }else if(btn.id == 'szy-1'){
                    BloodManage.prevPage(btn);
                    LMEPG.BM.requestFocus('szy-4');
                    return false;
                }
                break;
            case 'down':
                if (btn.id == 'name-4'){
                    BloodManage.nextPage(btn);
                    LMEPG.BM.requestFocus('name-1');
                    return false;
                }else if(btn.id == 'ssy-4'){
                    BloodManage.nextPage(btn);
                    LMEPG.BM.requestFocus('ssy-1');
                    return false;
                }else if(btn.id == 'szy-4'){
                    BloodManage.nextPage(btn);
                    LMEPG.BM.requestFocus('szy-1');
                    return false;
                }
                break;
        }
    },
    prevPage:function (btn) {
        if(btn.id == 'name-1'){
            if(BloodManage.pageNumber>1){
                BloodManage.pageNumber--;
                BloodManage.pageData(btn);
            }
        }else if(btn.id == 'ssy-1'){
            if(BloodManage.ssyPageNumber>1){
                BloodManage.ssyPageNumber--;
                BloodManage.pageData(btn);
            }
        }else if(btn.id == 'szy-1'){
            if(BloodManage.szyPageNumber>1){
                BloodManage.szyPageNumber--;
                BloodManage.pageData(btn);
            }
        }
    },
    nextPage:function (btn) {
        if (btn.id == 'name-4') {
            if (BloodManage.pageNumber < BloodManage.pageTotal) {
                BloodManage.pageNumber++;
                BloodManage.pageData(btn);
            }
        } else if (btn.id == 'ssy-4') {
            if (BloodManage.ssyPageNumber < BloodManage.ssyPageTotal) {
                BloodManage.ssyPageNumber++;
                BloodManage.pageData(btn);
            }
        } else if (btn.id == 'szy-4') {
            if (BloodManage.szyPageNumber < BloodManage.szyPageTotal) {
                BloodManage.szyPageNumber++;
                BloodManage.pageData(btn);
            }
        }

    },

    goBack: function () {
        // inner = 0 表示从EPG外面进来，直接返回EPG，不然返回到39健康应用
        if (G("ssy-list").style.display == "block") {
            G("ssy-list").style.display = "none";
            Show('ssy-display');
            // 变更角标
            G('ssy-icon').src = g_appRootPath+'/Public/img/hd/CommunityHospital/BloodManage/icon_next.png';
            LMEPG.BM.requestFocus('ssy-display');
        } else if (G("szy-list").style.display == "block") {
            G("szy-list").style.display = "none";
            Show('szy-display');
            // 变更角标
            G('szy-icon').src = g_appRootPath+'/Public/img/hd/CommunityHospital/BloodManage/icon_next.png';
            LMEPG.BM.requestFocus('szy-display');
        } else if (G("user-name-list").style.display == "block") {
            G("user-name-list").style.display = "none";
            Show('user-name-display');
            // 变更角标
            G('user-name-icon').src =g_appRootPath+ '/Public/img/hd/CommunityHospital/BloodManage/icon_next.png';
            LMEPG.BM.requestFocus('user-name-display');
        } else {
            if (RenderParam.inner == '0') {
                LMEPG.Intent.back('IPTVPortal');
            } else {
                LMEPG.Intent.back();
            }
        }

    },

    // 拉取用户列表
    AjaxDataDown: function () {
        LMEPG.ajax.postAPI('CommunityHospital/queryUserList','',
            function (data) {
                try {
                    if (data.result == 0) {
                        //返回拉取结果
                        BloodManage.dataList = data.list;
                        BloodManage.getHospData();

                    } else { // 校验失败
                        LMEPG.UI.showToast("暂无数据，请添加成员数据！",3);
                    }
                } catch (e) {
                    LMEPG.UI.showToast("数据拉取异常！");
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("获取数据异常！");
            }
        );
    },
    // 提交用户数据
    AjaxDataUp: function () {
        LMEPG.UI.showWaitingDialog('',2);
        var postData ={
            "memberId":G('user-name-display').getAttribute('data-link'),
            "highPressure":G('ssy-display').getAttribute('data-link'),
            "lowPressure":G('szy-display').getAttribute('data-link'),
        };

        LMEPG.ajax.postAPI('CommunityHospital/addBloodPressure',postData,
            function (data) {
                try {
                    if (data.result == 0) {
                        LMEPG.UI.showToast("数据上传成功",3);
                    } else { // 校验失败
                        LMEPG.UI.showToast("数据上传失败",3);
                    }
                } catch (e) {
                    LMEPG.UI.showToast("数据提交异常！",3);
                    LMEPG.Log.error(e.toString());
                }
            },
            function (rsp) {
                LMEPG.UI.showToast("提交数据发生错误！",3);
            }
        );
    },

    getHospData: function () {
        // BloodManage.swichAjaxData();
        BloodManage.pageTotal = Math.ceil(BloodManage.dataList.length / BloodManage.pageNum);
        BloodManage.ssyPageTotal = Math.ceil(BloodManage.ssyList.length / BloodManage.pageNum);
        BloodManage.szyPageTotal = Math.ceil(BloodManage.szyList.length / BloodManage.pageNum);
        //渲染页面
        if(RenderParam.memberId == ''||RenderParam.name == ''){
            G('user-name-display').innerHTML = BloodManage.dataList[0].member_name;
            G('user-name-display').setAttribute('data-link',BloodManage.dataList[0].member_id);
        }else{
            G('user-name-display').innerHTML = RenderParam.name;
            G('user-name-display').setAttribute('data-link',RenderParam.memberId);
        }
    },

    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('blood-data-up');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        currentPage.setParam('focusId', beClickId);
        return currentPage;
    },

    /**新增用户*/
    onClickAddUser: function () {
        var currObj = BloodManage.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('add-user');
        // addrObj.setParam('userId', RenderParam.userId);
        // addrObj.setParam('hospitalId', BloodManage.hospitalId);
        // addrObj.setParam('s_demo_id', 'superDemo');

        LMEPG.Intent.jump(addrObj, currObj);
    },


    jumpPage: function (btn) {
        switch (btn.id){
            case 'btn-add-user':
                BloodManage.onClickAddUser();
                break;
            case 'user-name-display':
            case 'ssy-display':
            case 'szy-display':
                BloodManage.onInputClick(btn);
                break;
            case 'btn-confirm':
                BloodManage.AjaxDataUp();
                break;
            case 'name-1':
            case 'name-2':
            case 'name-3':
            case 'name-4':
                // 变更选择条数据
                G('user-name-display').innerHTML=G(btn.id).innerHTML;
                G('user-name-display').setAttribute('data-link',G(btn.id).getAttribute('data-link'));
                // 变更角标
                G('user-name-icon').src = g_appRootPath+'/Public/img/hd/CommunityHospital/BloodManage/icon_next.png';
                // 隐藏下拉列表
                Hide('user-name-list');
                Show('user-name-display');
                LMEPG.BM.requestFocus('user-name-display');
                break;
            case 'ssy-1':
            case 'ssy-2':
            case 'ssy-3':
            case 'ssy-4':
                // 变更选择条数据
                G('ssy-display').innerHTML=G(btn.id).innerHTML;
                G('ssy-display').setAttribute('data-link',G(btn.id).getAttribute('data-link'));
                // 变更角标
                G('ssy-icon').src =g_appRootPath+ '/Public/img/hd/CommunityHospital/BloodManage/icon_next.png';
                // 隐藏下拉列表
                Hide('ssy-list');
                Show('ssy-display');
                LMEPG.BM.requestFocus('ssy-display');
                break;
            case 'szy-1':
            case 'szy-2':
            case 'szy-3':
            case 'szy-4':
                // 变更选择条数据
                G('szy-display').innerHTML=G(btn.id).innerHTML;
                G('szy-display').setAttribute('data-link',G(btn.id).getAttribute('data-link'));
                // 变更角标
                G('szy-icon').src = g_appRootPath+'/Public/img/hd/CommunityHospital/BloodManage/icon_next.png';
                // 隐藏下拉列表
                Hide('szy-list');
                Show('szy-display');
                LMEPG.BM.requestFocus('szy-display');
                break;
        }
    },

    onInputClick: function (btn) {
        switch (btn.id){
            case 'user-name-display':
                if(BloodManage.dataList.length == 0){
                    return;
                }else{
                    G('user-name-icon').src='__ROOT__/Public/img/hd/CommunityHospital/BloodManage/icon_prev.png';
                    //点击下拉选中框内的值
                    BloodManage.ssyPageNumber = Math.ceil(G('user-name-display').getAttribute('data-link') / 4);
                    var nameFocusId = 'name-' + (G('user-name-display').getAttribute('data-link') % 4 == 0 ? 4 : G('user-name-display').getAttribute('data-link') % 4);
                    BloodManage.pageData(btn);

                    Hide('user-name-display');
                    Show('user-name-list');
                    LMEPG.BM.requestFocus(nameFocusId);
                }
                break;
            case 'ssy-display':
                G('ssy-icon').src='__ROOT__/Public/img/hd/CommunityHospital/BloodManage/icon_prev.png';
                //点击下拉选中框内的值
                BloodManage.ssyPageNumber = Math.ceil(G('ssy-display').getAttribute('data-link') / 4);
                var ssyFocusId = 'ssy-' + (G('ssy-display').getAttribute('data-link') % 4 == 0 ? 4 : G('ssy-display').getAttribute('data-link') % 4);
                BloodManage.pageData(btn);
                Hide('ssy-display');
                Show('ssy-list');
                LMEPG.BM.requestFocus(ssyFocusId);
                break;
            case 'szy-display':
                G('szy-icon').src='__ROOT__/Public/img/hd/CommunityHospital/BloodManage/icon_prev.png';
                //点击下拉选中框内的值
                BloodManage.szyPageNumber = Math.ceil(G('szy-display').getAttribute('data-link') / 4);
                var szyFocusId = 'szy-' + (G('szy-display').getAttribute('data-link') % 4 == 0 ? 4 : G('szy-display').getAttribute('data-link') % 4);
                BloodManage.pageData(btn);
                Hide('szy-display');
                Show('szy-list');
                LMEPG.BM.requestFocus(szyFocusId);
                break;
        }

    },

    initBtns: function () {
        var buttons = [{
            id: 'btn-add-user',
            type: 'img',
            name: '新增用户',
            nextFocusLeft: 'user-name-display',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_add_user.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_add_user_f.png',
            focusChange: '',
            // backFocusId: 'id-card',
            click: this.jumpPage
        },{
            id: 'user-name-display',
            type: 'div',
            name: '用户名',
            nextFocusDown: 'ssy-display',
            nextFocusRight: 'btn-add-user',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            click: this.jumpPage
        },{
            id: 'name-1',
            type: 'div',
            name: '用户名-1',
            nextFocusDown: 'name-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:BloodManage.switchPage,
            click: this.jumpPage
        },{
            id: 'name-2',
            type: 'div',
            name: '用户名-2',
            nextFocusDown: 'name-3',
            nextFocusUp: 'name-1',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            click: this.jumpPage
        },{
            id: 'name-3',
            type: 'div',
            name: '用户名-3',
            nextFocusDown: 'name-4',
            nextFocusUp: 'name-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            click: this.jumpPage
        },{
            id: 'name-4',
            type: 'div',
            name: '用户名-4',
            nextFocusUp: 'name-3',
            // nextFocusDown: 'name-1',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:BloodManage.switchPage,
            click: this.jumpPage
        }, {
            id: 'ssy-display',
            type: 'div',
            name: '收缩压',
            nextFocusUp: 'user-name-display',
            nextFocusDown: 'szy-display',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            click: this.jumpPage
        },{
            id: 'ssy-1',
            type: 'div',
            name: '收缩压-1',
            nextFocusDown: 'ssy-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:BloodManage.switchPage,
            click: this.jumpPage
        },{
            id: 'ssy-2',
            type: 'div',
            name: '收缩压-2',
            nextFocusUp: 'ssy-1',
            nextFocusDown: 'ssy-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:'',
            click: this.jumpPage
        },{
            id: 'ssy-3',
            type: 'div',
            name: '收缩压-3',
            nextFocusUp: 'ssy-2',
            nextFocusDown: 'ssy-4',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:'',
            click: this.jumpPage
        },{
            id: 'ssy-4',
            type: 'div',
            name: '收缩压-4',
            nextFocusUp: 'ssy-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:BloodManage.switchPage,
            click: this.jumpPage
        },{
            id: 'szy-display',
            type: 'div',
            name: '舒张压',
            nextFocusUp: 'ssy-display',
            nextFocusDown: 'btn-confirm',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            click: this.jumpPage
        },{
            id: 'szy-1',
            type: 'div',
            name: '舒张压-1',
            nextFocusDown: 'szy-2',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:BloodManage.switchPage,
            click: this.jumpPage
        },{
            id: 'szy-2',
            type: 'div',
            name: '舒张压-2',
            nextFocusUp: 'szy-1',
            nextFocusDown: 'szy-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:'',
            click: this.jumpPage
        },{
            id: 'szy-3',
            type: 'div',
            name: '舒张压-3',
            nextFocusUp: 'szy-2',
            nextFocusDown: 'szy-4',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:'',
            click: this.jumpPage
        },{
            id: 'szy-4',
            type: 'div',
            name: '舒张压-4',
            nextFocusUp: 'szy-3',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/bg_input_f.png',
            focusChange: '',
            beforeMoveChange:BloodManage.switchPage,
            click: this.jumpPage
        },{
            id: 'btn-confirm',
            type: 'img',
            name: '确认上传',
            nextFocusUp: 'szy-display',
            backgroundImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_confirm.png',
            focusImage: g_appRootPath + '/Public/img/hd/CommunityHospital/BloodManage/btn_confirm_f.png',
            focusChange: '',
            click: this.jumpPage
        }];

        // LMEPG.BM.init('btn-confirm', buttons, true);
        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'user-name-display', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: BloodManage.goBack});
    },
};

