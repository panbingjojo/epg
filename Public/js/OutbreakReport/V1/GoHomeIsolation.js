var buttons = [];
(function (w) {
    w.PaginationManager = function (element) {
        this.curPage = 0;
        this.containerId = element.containerId;
        this.data = element.data;
        this.pagesSize = element.pageSize || 0;
        this.btnId = element.btnId;
        this.type = element.type || "img";
    };
    PaginationManager.prototype.init = function () {
        this.createHtml();
    };
    PaginationManager.prototype.createHtml = function () {
        G(this.containerId).innerHTML = "";
        var sHtml = "";
        var curData = this.cut(this.data);
        var that = this;
        curData.forEach(function (item, i) {
            sHtml += '<li id="' + that.btnId + i + '">' + item.n + '</li>';
        });
        G(this.containerId).innerHTML = sHtml;
        for (var i = 0; i < curData.length; i++) {
            if (this.btnId == "prov-") {
                LMEPG.BM.getButtonById(this.btnId + i).cType = curData[i].c;
            } else {
                LMEPG.BM.getButtonById(this.btnId + i).cType = curData[i].n;
            }
        }
    };
    PaginationManager.prototype.cut = function () {
        return this.data.slice(this.curPage, this.pagesSize + this.curPage)
    };
    PaginationManager.prototype.prePage = function () {
        if (this.curPage > 0) {
            this.curPage--;
            this.createHtml();
            LMEPG.BM.requestFocus(this.btnId + "0");
        }
    };
    PaginationManager.prototype.nextPage = function () {
        // alert(JSON.stringify(this))
        if (this.curPage < (this.data.length - this.pagesSize)) {
            this.curPage++;
            this.createHtml();
            LMEPG.BM.requestFocus(this.btnId + (this.pagesSize - 1));
        }
    };
})(window)

var Page = {
    currentFocus: "btn-1",
    provData: "北京",
    cityData: "北京",

//页面初始化操作
    init: function () {
        Page.initButtons();                 // 初始化焦点按钮
        Page.defaultFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? "btn-1" : RenderParam.focusIndex;
        LMEPG.BM.init(Page.defaultFocusId, buttons, "", true);
        G("time").innerHTML = RenderParam.epidemicDetails.main[0].last_msg_dt;
        
        if(RegExp("^(10000051|0000051)").test(RenderParam.carrierId)){
            citys.forEach(function(item,index){
                if(item.n == RenderParam.liantongAreaName)
                {
                    Page.provData =item.n;
                    Page.cityData =item.c[0].n;
                    return ;
                }
            });
        }else{
            citys.forEach(function(item,index){
                if(item.carrierId !== "" && RegExp(item.carrierId).test(RenderParam.carrierId))
                {
                    Page.provData =item.n;
                    Page.cityData =item.c[0].n;
                    return ;
                }
            });
        }
        //根据地区码显示对应地区城市
        G("btn-1").innerHTML = Page.provData + "-" + Page.cityData;
        G("scroll").scrollTop = 0;
    },
    initButtons: function () {
        var len = 2;// 页面入口按钮数
        for (var i = 0; i < len; i++) {
            buttons.push({
                id: 'btn-' + (i + 1),
                name: '按钮',
                type: 'div',
                nextFocusLeft: 'btn-' + i,
                nextFocusRight: 'btn-' + (i + 2),
                nextFocusUp: 'btn-' + (i - 3),
                nextFocusDown: 'btn-' + (i + 5),
                backgroundImage: g_appRootPath + "/Public/img/hd/OutbreakReport/EAS/form_" + (i + 1) + ".png",
                focusImage: g_appRootPath + "/Public/img/hd/OutbreakReport/EAS/form_" + (i + 1) + "_f.png",
                focusChange: Page.onFocusBtn,
                click: Page.onClickJump,
                beforeMoveChange: Page.turnScroll,
            });
        }
        var focusNum = 8;
        while (focusNum--) {
            buttons.push({
                id: "prov-" + focusNum,
                type: "div",
                nextFocusUp: "prov-" + (focusNum - 1),
                nextFocusDown: "prov-" + (focusNum + 1),
                nextFocusRight: "city-0",
                backgroundImage: g_appRootPath + '/Public/img/hd/Search/V21/transparent.png',
                focusImage: g_appRootPath + '/Public/img/hd/OutbreakReport/EAS/city_box_f.png',
                selectedImage: g_appRootPath + '/Public/img/hd/OutbreakReport/EAS/city_box_select.png',
                groupId: "city",
                focusChange: Page.onFocus,
                beforeMoveChange: Page.turnPage,
                cType: "",

            });
            buttons.push({
                id: "city-" + focusNum,
                type: "div",
                nextFocusUp: "city-" + (focusNum - 1),
                nextFocusDown: "city-" + (focusNum + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Search/V21/transparent.png',
                focusImage: g_appRootPath + '/Public/img/hd/OutbreakReport/EAS/city_box_f.png',
                click: Page.onClickCity,
                focusChange: Page.onFocus,
                beforeMoveChange: Page.turnPage,
                cType: ""
            });
        }
        ;
    },
    turnScroll: function (dir, cur) {
        var el = document.getElementsByClassName("result-list-item");
        if (dir == "down") {
            var scrollHeight = -210;
            for (var i = 0; i < el.length; i++) {
                scrollHeight += parseInt(el[i].offsetHeight);
            }
            if ((parseInt(el[0].style.marginTop) >= -scrollHeight)) {
                el[0].style.marginTop = (parseInt(el[0].style.marginTop) - 30) + 'px';
            }
        } else if (dir == "up") {
            if ((parseInt(el[0].style.marginTop) < 20)) {
                el[0].style.marginTop = (parseInt(el[0].style.marginTop) + 30) + 'px';
            }
        }
    },
    turnPage: function (dir, cur) {
        if (cur.id.substring(0, 5) == "prov-") {
            var that = pagination;
        } else {
            var that = paginationCity;
        }
        if (dir == "up" && cur.id == that.btnId + "0") {
            that.prePage()
            return false
        } else if (dir == "down" && cur.id == that.btnId + (that.pagesSize - 1)) {
            that.nextPage()
            return false
        } else if (dir == "left" && cur.id.substring(0, 5) == "city-") {
            var curId = LMEPG.BM.getSelectedButton("city").id;
            LMEPG.BM.requestFocus(curId);
        }
    }

    ,
    onClickJump: function (btn) {
        switch (btn.id) {
            case "btn-1":
                G("drop").style.left = "173px";
                Page.provList(btn);
                G(btn.id).style.backgroundImage = 'url(' + btn.focusImage + ')'
                break;
            case "btn-2":
                G("drop").style.left = "681px";
                Page.provList(btn);
                G(btn.id).style.backgroundImage = 'url(' + btn.focusImage + ')'
                break;
        }
    }
    ,
    onFocus: function (btn, has) {
        if (has) {
            G(btn.id).style.color = "#001e43";
            if (btn.id.substring(0, 5) == "prov-") {
                LMEPG.BM.setSelected(btn.id, true);
                Page.cityList(btn);
            }
        } else {
            G(btn.id).style.color = "#fff";
        }
    }
    ,
    onFocusBtn: function (btn, has) {
        if (has) {
            G(btn.id).style.color = "#fff";
        } else {
            G(btn.id).style.color = "#001e43";
        }
    }
    ,
    onClickCity: function (btn) {
        var preData = G(LMEPG.BM.getSelectedButton("city").id).innerHTML;
        var nextData = G(btn.id).innerHTML;
        G(Page.currentFocus).innerHTML = preData + "-" + nextData;
        Hide("drop");
        G("scroll").focus();
        // G("scroll").style.overflow = "auto";
        LMEPG.BM.requestFocus(Page.currentFocus);
        var fromCity = G("btn-1").innerHTML.split("-")[1];
        var toCity = G("btn-2").innerHTML.split("-")[1];
        if (G("btn-2").innerHTML != "请选择目的地") {
            Page.getServerData(fromCity, toCity)
        }
    }
    ,
    provList: function (btn) {
        G("btn-1").focus();
        G("scroll").style.overflow = "hidden";
        var ele = {
            "containerId": "drop-prov-list",
            "data": citys,
            "pageSize": 8,
            "btnId": "prov-",
            "type": "div",
        }
        window.pagination = new PaginationManager(ele);
        pagination.init();
        Page.currentFocus = btn.id;
        Show("drop");
        LMEPG.ButtonManager.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'prov-0');
    }
    ,

    createResultInfo: function (data) {
        G("scroll").innerHTML = "";
        var sHtml = "";
        
        for(var idx=data.length-1;idx >= 0;idx --){
            var item = data[idx];
            sHtml += '<div class="result-list-item" style="margin-top: 20px">';
            sHtml += '<div class="title">' + item.fromCity + '>>' + item.toCity + '</div>';
            sHtml += '<div class="content">' + item.policy + '</div>';
            sHtml += '</div>';
        }
        sHtml += '<br/>温馨提示：<br/>\n' +
            '    本页面信息仅供参考，数据来源官方，具体防控措施以当地政策为准，建议前往街道社区或村镇了解最新动态';
        G("scroll").innerHTML = sHtml;
    }
    ,
    cityList: function (btn) {
        var eleCity = {
            "containerId": "drop-city-list",
            "data": btn.cType,
            "pageSize": 8,
            "btnId": "city-",
            "type": "div",
        }
        window.paginationCity = new PaginationManager(eleCity);
        paginationCity.init();
    }
    ,

    getServerData: function (fromCity, toCity) {
        LMEPG.UI.showWaitingDialog();
        var postData = {
            'fromCity': fromCity,
            'toCity': toCity,
        };
        // 存储视频信息
        LMEPG.ajax.postAPI('Epidemic/getIsolatedArea', postData, function (data) {
            data = data instanceof Object ? data : JSON.parse(data);
            console.log("data>>>" + JSON.stringify(data));
            LMEPG.UI.dismissWaitingDialog();
            if (data.code == 200) {
                Page.createResultInfo(data.list);
                // Page.createResultInfo([]);
            } else {
                LMEPG.UI.showToast('暂无数据！');
                Page.createResultInfo([]);
            }
        });
    }
    ,

// 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("epidemic-Area");
        currentPage.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        return currentPage;
    }
}


function onBack() {
    if (G("drop").style.display == "block") {
        Hide("drop");
        G("scroll").style.overflow = "auto";
        LMEPG.BM.requestFocus(Page.currentFocus);
        G("scroll").focus();
    } else {
        LMEPG.Intent.back();
    }

}