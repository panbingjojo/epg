var Controller = {
    /**
     * 初始化方法
     */
    init: function () {
        //设置背景
        View.renderBackground();
        Model.initButtons();
        var focusId = RenderParam.focusIndex != '' ? RenderParam.focusIndex : 'tab-1';
        LMEPG.BM.init(focusId, Model.buttons)
    },

    onClickListener: function (btn) {
        console.log("onClickListener id = " + btn.id)
        switch (btn.id) {
            case 'tab-0':
                View.routerKnowledge(0);
                break
            case 'tab-1':
                View.routerKnowledge(1);
                break
            case 'tab-2':
                View.routerNucleicAcidDetectAgency();
                break
            case 'tab-3':
                View.routerHotline();
                break
        }
    },

    onFocusChange: function (btn, has) {
        if (has) {
            LMEPG.CssManager.addClass(btn.id, "focus");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "focus");
        }
    },

}

var View = {
    /**
     * 渲染背景
     */
    renderBackground: function () {
        G('indexBg').src = LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/bg.jpg';
    },


    //跳转->疫情知识
    routerKnowledge: function (type) {
        var focusId = type == 0 ? 'tab-0' : 'tab-1';
        var objCurrent = this.getCurrentPage(focusId);
        var objDst = LMEPG.Intent.createIntent("knowledge");
        objDst.setParam("type", type);
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    //跳转->健康码服务热线
    routerHotline: function () {
        var objCurrent = this.getCurrentPage('tab-3');
        var objDst = LMEPG.Intent.createIntent("hotline");
        LMEPG.Intent.jump(objDst, objCurrent);
    },
    initGButton: function () {
        LMEPG.BM.addButtons([{
            id: 'level-2-container',
            type: 'div',
            click: '',
            focusChange: '',
            beforeMoveChange: View.turnPageForG,
        }])
    },

    gNowPage: 1,
    maxPage: Math.ceil(hospitalListGuang.length / 10),
    //跳转->疾控机构咨询热线
    routerInformationHotline: function () {
        var div = document.createElement('div')
        div.id = 'level-2-container'

        var html = '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/guangxiGg.png">' +
            '<div class="g-text" style="left:234px">机构名称</div>' +
            '<div class="g-text" style="left:850px">联系电话</div>' + '' +
            '<div class="g-content-area" id="g-content"></div>' +
            '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/g-arrow-up.png" class="g-arrow" id="g-arrow-up" style="top: 20px;left: 660px;display: none">' +
            '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/g-arrow-down.png" class="g-arrow" id="g-arrow-down" style="top: 680px;left: 660px;display: none">' +
            '<div class="g-page"><span id="g-now-page">1</span>/' + Math.ceil(hospitalListGuang.length / 10) + '</div>'
        div.innerHTML = html

        document.body.appendChild(div)
        View.appendHospital()
        View.initGButton()
        View.showGArrow()
    },

    turnPageForG: function (dir) {
        if (dir === 'left' || dir === 'right')
            return;

        if (dir === 'up') {
            if (View.gNowPage === 1)
                return;
            View.gNowPage--

        } else if (dir === 'down') {
            if (View.gNowPage === View.maxPage)
                return;
            View.gNowPage++
        }

        G('g-now-page').innerHTML = View.gNowPage
        View.appendHospital()
        View.showGArrow()
    },


    showGArrow: function () {
        if (View.gNowPage === 1) {
            G('g-arrow-up').style.display = 'none'
            G('g-arrow-down').style.display = 'block'
        } else if (View.gNowPage === Math.ceil(hospitalListGuang.length / 10)) {
            G('g-arrow-up').style.display = 'block'
            G('g-arrow-down').style.display = 'none'
        } else {
            G('g-arrow-up').style.display = 'block'
            G('g-arrow-down').style.display = 'block'
        }
    },

    appendHospital: function () {
        var html = ''
        G('g-content').innerHTML = ''
        for (var i = (View.gNowPage - 1) * 10; i < View.gNowPage * 10; i++) {
            if (!hospitalListGuang[i])
                break
            html += '<div class="g-hospital">' +
                '<div class="g-item-text">' + (hospitalListGuang[i].hospital.length > 20 ? "<marquee scrollamount='10'  direction='left' behavior='scroll'>" + hospitalListGuang[i].hospital + "</marquee>" : hospitalListGuang[i].hospital) + '</div>' +
                '<div class="g-item-phone">' + hospitalListGuang[i].number + '</div>' +
                '<div class="g-item-phone">' + hospitalListGuang[i].number2 + '</div>' +
                '<div class="g-item-phone">' + hospitalListGuang[i].number3 + '</div>' +
                '<div class="g-item-phone">' + hospitalListGuang[i].number4 + '</div>' +
                '<div class="g-item-phone">' + hospitalListGuang[i].number5 + '</div>' +
                '</div>'
        }

        G('g-content').innerHTML = html
    },

    //跳转核酸检测机构
    routerNucleicAcidDetectAgency: function () {
        var moreInformationPageCarrieIds = ['440001', '420092', '320005'];
        if (moreInformationPageCarrieIds.indexOf(RenderParam.carrierId) >= 0) {
            View.showMoreInformationPageView()
        } else if (RenderParam.carrierId == '220094' || RenderParam.carrierId == '220095') {
            View.routerInformationHotline();
            LMEPG.BM.requestFocus('level-2-container');
            G('information').style.display = 'block';
        } else {
            var objCurrent = this.getCurrentPage('tab-2');
            var objGuaHao = LMEPG.Intent.createIntent("detectAgency");
            LMEPG.Intent.jump(objGuaHao, objCurrent);
        }
    },

    getCurrentPage: function (focusId) {
        var currentPage = LMEPG.Intent.createIntent("nucleicAcidDetect");
        currentPage.setParam("focusIndex", focusId);
        return currentPage;
    },

    showMoreInformationPageView: function () {
        var level4Wrapper = document.createElement("div");
        var htm = '' + '</div>';
        htm += '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/more_Information_bg.jpg">';
        level4Wrapper.id = "level-2-container";
        level4Wrapper.style = 'position: absolute;left:0;top:0;z-index:99'
        document.body.appendChild(level4Wrapper);
        G("level-2-container").innerHTML = htm;
    },

}

var Model = {
    buttons: [],
    initButtons: function () {
        this.buttons.push({
            id: 'tab-0',
            name: 'tab-0',
            type: 'img',
            nextFocusLeft: 'tab-2',
            nextFocusRight: 'tab-1',
            nextFocusUp: '',
            nextFocusDown: '',
            focusChange: Controller.onFocusChange,
            click: Controller.onClickListener
        }, {
            id: 'tab-1',
            name: 'tab-1',
            type: 'img',
            nextFocusLeft: 'tab-0',
            nextFocusRight: 'tab-2',
            nextFocusUp: '',
            nextFocusDown: '',
            focusChange: Controller.onFocusChange,
            click: Controller.onClickListener
        }, {
            id: 'tab-2',
            name: 'tab-2',
            type: 'img',
            nextFocusLeft: 'tab-1',
            nextFocusRight: 'tab-0',
            nextFocusUp: '',
            nextFocusDown: '',
            focusChange: Controller.onFocusChange,
            click: Controller.onClickListener
        }, {
            id: 'tab-3',
            name: 'tab-3',
            type: 'img',
            nextFocusLeft: 'tab-2',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            focusChange: Controller.onFocusChange,
            click: Controller.onClickListener
        });
    }
}

function onBack() {
    if (G('level-2-container')) {
        delNode('level-2-container')
        LMEPG.BM.requestFocus('tab-2');
        G('information').style.display = 'none';
    } else {
        LMEPG.Intent.back()
    }
}