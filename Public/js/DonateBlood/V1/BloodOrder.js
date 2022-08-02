var DonateBlood = {
    marquee: marquee(),
    page: LMEPG.Func.getLocationString('page') || 1,        //当前页码
    pageCnt:6,      //每页数量
    maxPage:0,      //最大页码
    imgPath:g_appRootPath+ '/Public/img/hd/DonateBlood/V1/',   //图片路径
    hosArray:CommonData.hospitalArray,
    
    init: function () {
        DonateBlood.maxPage = Math.ceil(DonateBlood.hosArray.length / DonateBlood.pageCnt);
        DonateBlood.createListView(DonateBlood.page);
        DonateBlood.createBtns();
    },
    goBack: function () {
        LMEPG.Intent.back();
    },

    // 框选中效果
    focusChangeEvent: function (btn,hasFocus) {
        if (hasFocus) {
            G('btn_order_f_' + btn.cIdx).style.display = 'block';
        } else {
            G('btn_order_f_' + btn.cIdx).style.display = 'none';
        }
    },

    getCurrentPage: function () {
        var obj = LMEPG.Intent.createIntent('bloodOrder');
        var beClickId = LMEPG.BM.getCurrentButton().id;
        obj.setParam('focusId', beClickId);
        obj.setParam('page', DonateBlood.page);
        return obj;
    },
    // 跳转献血屋详情
    onClickHosPic: function (index) {
        var dom = G(LMEPG.BM.getCurrentButton().id);
        var arrIndex = (dom.getAttribute('data-hos-index'));

        var currObj = DonateBlood.getCurrentPage();
        var addrObj = LMEPG.Intent.createIntent('bloodRoomInfo');
        addrObj.setParam('userId', RenderParam.userId);
        addrObj.setParam('page', DonateBlood.page);
        addrObj.setParam('arrIndex', arrIndex);

        LMEPG.Intent.jump(addrObj, currObj);
    },


    jumpPage: function (btn) {
        DonateBlood.onClickHosPic(btn.cIdx);
    },

    createListView: function (page) {
        var pageIndex = (page-1) * DonateBlood.pageCnt;  //当前页起始序号
        var html1 = '';
        var html2 = '';
        var arrIndex=0;
        G('hos_list').innerHTML = "";
        //当前页条数
        var maxMenu = pageIndex+DonateBlood.pageCnt > DonateBlood.hosArray.length ?
        DonateBlood.hosArray.length - pageIndex : DonateBlood.pageCnt;
        for (var i = 1; i <= maxMenu; i++) {
            arrIndex = pageIndex+i-1;
            html1 += '<img id="hos_' + i +'" data-hos-index ="'+arrIndex
                + '" src="' + DonateBlood.imgPath + CommonData.hospitalArray[arrIndex].hospitalImgH+'">';

            html2 += '<div id="hos_name_' + i +'" class="hos_name">'+DonateBlood.hosArray[arrIndex].hospitalName+'</div>';

        }
        G('hos_list').innerHTML = html1;
        G('hos_name_list').innerHTML = html2;
        G('page_num').innerHTML = DonateBlood.page+'/'+DonateBlood.maxPage;
        this.toggleArrow();
    },
    cleanFrame:function () {
        for(var i=1;i<=6;i++){
            G('btn_order_f_' + i).style.display = 'none';
        }
    },

    turnList: function (key, btn) {
        var _this = DonateBlood;
        if (key === 'left' && btn.id === 'hos_1' && _this.page != 1) {
            console.log(_this.page, _this.maxPage);
            _this.prevList();
            return false;
        }
        if (key === 'right' && btn.id === 'hos_6' && _this.page != _this.maxPage) {
            _this.nextList();
            return false;
        }
    },
    prevList: function () {
        if (this.page != 1) {
            this.page--;
            DonateBlood.createBtns();
            this.createListView(this.page);
            DonateBlood.cleanFrame();
            LMEPG.BM.requestFocus('hos_6');
        }
    },
    nextList: function () {
        if (this.page != this.maxPage) {
            this.page++;
            DonateBlood.createBtns();
            this.createListView(this.page);
            DonateBlood.cleanFrame();
            LMEPG.BM.requestFocus('hos_1');
        }
    },
    toggleArrow: function () {
        this.page == 1 ? Hide('icon_prev'):Show('icon_prev');
        this.page == this.maxPage ? Hide('icon_next'):Show('icon_next');
    },

    createBtns: function () {
        var buttons = [];
        var arrIdx = (DonateBlood.page - 1 )*DonateBlood.pageCnt;
        var newArray = CommonData.hospitalArray.slice(arrIdx,arrIdx+DonateBlood.pageCnt);

        for (var i = 1; i <= newArray.length; i++) {
            buttons.push({
                id: 'hos_' + i,
                name: 'hos_' + i,
                type: 'img',
                nextFocusLeft: i>1? ('hos_' + (i - 1)):'',
                nextFocusRight: i<6 ?('hos_' + (i + 1)):'',
                nextFocusUp: i>3 ? 'hos_'+(i-3):'',
                nextFocusDown: i<4 ? 'hos_'+(i+3):'',
                backgroundImage: DonateBlood.imgPath + newArray[i-1].hospitalImgH,
                focusChange: DonateBlood.focusChangeEvent,
                beforeMoveChange: DonateBlood.turnList,
                click: this.jumpPage,
                cIdx: i,
            });
        }



        LMEPG.BM.init(LMEPG.Func.getLocationString('focusId') || 'hos_1', buttons, true);
        LMEPG.KeyEventManager.addKeyEvent({KEY_BACK: DonateBlood.goBack});
    }
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
            _option.el.innerHTML = _option.bol ? LMEPG.Func.substrByOmit(_option.txt, _option.len) : _option.txt;
            fn && fn.apply(null, arguments);
        }
    };
}