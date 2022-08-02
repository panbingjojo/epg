var AddMemberMask = {
    imgUrl: g_appRootPath + "/Public/img/hd/Family/V13/",
    currentMemberId: '',
    memberList: '',
    hidId: "",
    isCreate: false,
    isBack: false,
    onClickFun: "",
    editType:"add",
    hidden: function () {
        if (this.isBack) {
            LMEPG.Intent.back()
        } else {
            G("shadeDiv").style.display = "none";
            LMEPG.BM.requestFocus(this.hidId);
            LMEPG.KEM.addKeyEvent("KEY_BACK", "onBack()");
        }
    },
    show: function (id, asynBack) {
        AddMemberMask.onClickFun = asynBack;
        if (this.isCreate) {
            G("shadeDiv").style.display = "block";
            LMEPG.BM.requestFocus("member-0");
        } else {
            this.hidId = id;
            this.createShade(this.editType);
            this.createList();
            this.isCreate = true;
        }
        // 设置默认按back键关闭对话框操作
        LMEPG.KEM.addKeyEvent("KEY_BACK", this.onInnerBack);
    },
    onInnerBack: function () {
        AddMemberMask.hidden();
    },
    createShade: function (type) {
        var doc = document;
        var Div = doc.createElement("div");
        Div.id = "shadeDiv";
        doc.body.appendChild(Div);
        var title = doc.createElement("div");
        var list = doc.createElement("div");
        // var submit = doc.createElement("img");
        var leftAr = doc.createElement("img");
        var rightAr = doc.createElement("img");
        var intro = doc.createElement("div");
        leftAr.id = "arrow_left";
        rightAr.id = "arrow_right";
        leftAr.src = g_appRootPath+"/Public/img/hd/Common/V13/left.png";
        rightAr.src = g_appRootPath+"/Public/img/hd/Common/V13/right.png";
        // submit.src =g_appRootPath+ "/Public/img/hd/HealthTest/V8/Wristband/submit.png";
        title.className = "shade-title";
        intro.className = "shade-intro";
        var temp = type == "add" ? "选择" : "更换";
        title.innerText = "请"+temp+"手环设备的家庭使用成员";
        intro.innerText = '温馨提示：'+temp+'成员后，此手环的所有数据将自动上传到这次选择的家庭成员的手环记录中！';
        list.id = "member-list";
        // submit.id = "submit";
        Div.appendChild(title);
        Div.appendChild(list);
        Div.appendChild(leftAr);
        Div.appendChild(rightAr);
        Div.appendChild(intro);
        // Div.appendChild(submit);
    },
    createList: function () {
        RenderParam.memberInfo = JSON.parse(RenderParam.memberInfo);
        console.log(RenderParam.memberInfo)
        if (RenderParam.memberInfo.list.length < 8) {
            RenderParam.memberInfo.list.push({
                'member_image_id': "add_icon",
                'member_name': "添加"
            })
        }

        var ele = {
            "containerId": "member-list",
            "data": RenderParam.memberInfo.list,
            "pageSize": 4,
            "btnId": "member-",
            "type": "img",
            "onFocus": function (btn, has) {
                if (has) {
                    AddMemberMask.currentMemberId = btn.cType;
                    LMEPG.CssManager.addClass(btn.id, "focus")
                } else {
                    LMEPG.CssManager.removeClass(btn.id, "focus")
                }
            },
            "onClick2": function (btn) {
                if (btn.cType != undefined) {
                    AddMemberMask.onClickFun(btn)
                } else {
                    AddMemberMask.jumpMemberEditPage(btn)
                    // AddMemberMask.hidden();
                }
            },
        }
        Pagination.init(ele)
    },
    /**
     * 跳转添加、编辑页面
     */
    jumpMemberEditPage: function (btn) {
        var curObj = Page.getCurrentPage();
        var dstObj = LMEPG.Intent.createIntent('familyMembersEdit');
        dstObj.setParam('actionType', 1); // 添加
        curObj.setParam('isAddMember', true);
        LMEPG.Intent.jump(dstObj, curObj);
    },
}

var Pagination = {
    isCreateBtn: false,
    containerId: "",//分页容器,
    curPage: 0,
    type: "img",
    data: "",
    pagesSize: 0,
    btnId: "",
    callBack: "",
    onFocusBack: "",
    init: function (element) {
        this.containerId = element.containerId;
        this.data = element.data;
        this.pagesSize = element.pageSize;
        this.btnId = element.btnId;
        this.type = element.type;
        this.onFocusBack = element.onFocus;
        this.callBack = element.onClick2;
        if (!this.isCreateBtn) {
            this.isCreateBtn = true;
            this.createBtn(this.pagesSize);
        }
        this.createHtml();
    },
    createHtml: function () {
        G(this.containerId).innerHTML = "";
        var sHtml = "";
        var curDataLength = this.data.length;
        // console.log("ddd>>>" + this.data);
        var curData = this.cut(this.data);
        var that = this;
        curData.forEach(function (item, i) {
            if (item.member_image_id == "add_icon") {
                var imgUrl = AddMemberMask.imgUrl + item.member_image_id + ".png";
            } else {
                var imgUrl = AddMemberMask.imgUrl + "member_" + item.member_image_id + ".png";
            }
            sHtml += '<div class="member-box">';
            sHtml += '<img id="' + that.btnId + i + '" src="' + imgUrl + '">';
            sHtml += '<div class="member-title">' + item.member_name + '</div>';
            sHtml += '</div>'
        });
        G(this.containerId).innerHTML = sHtml;
        for (var i = 0; i < curData.length; i++) {
            LMEPG.BM.getButtonById(Pagination.btnId + i).cType = curData[i].member_id;
        }
        this.upDateArroww();
        LMEPG.ButtonManager.requestFocus(Pagination.btnId + '0');
    },
    cut: function () {
        return this.data.slice(this.curPage, this.pagesSize + this.curPage)
    },
    turnPage: function (dir, cur) {
        if (dir == "left" && cur.id == Pagination.btnId + "0") {
            Pagination.prePage()
            return false
        } else if (dir == "right" && cur.id == Pagination.btnId + (Pagination.pagesSize - 1)) {
            Pagination.nextPage()
            return false
        }
    },
    onClick: function (btn) {
        LMEPG.call(Pagination.callBack, btn);
        AddMemberMask.hidden();
    },
    onFocus: function (btn, has) {
        LMEPG.call(Pagination.onFocusBack, btn, has)
    },

    createBtn: function (page) {
        var focusNum = page;
        while (focusNum--) {
            buttons.push({
                id: Pagination.btnId + focusNum,
                type: Pagination.type,
                nextFocusLeft: Pagination.btnId + (focusNum - 1),
                nextFocusRight: Pagination.btnId + (focusNum + 1),
                nextFocusDown: "submit",
                click: Pagination.callBack,
                focusChange: Pagination.onFocus,
                beforeMoveChange: Pagination.turnPage,
                cType: ""
            });
        }
        LMEPG.ButtonManager.init(Pagination.btnId + '0', buttons, '', true);
    },

    prePage: function () {
        if (this.curPage > 0) {
            this.curPage--;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + "0");
        }
    },
    nextPage: function () {
        if (this.curPage < (this.data.length - this.pagesSize)) {
            this.curPage++;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + (Pagination.pagesSize - 1));
        }
    },

    upDateArroww: function () {
        var page_right = document.getElementById("arrow_right");
        var page_left = document.getElementById("arrow_left");
        page_right.style.display = "none";
        page_left.style.display = "none";

        if (this.curPage < (this.data.length - this.pagesSize)) {
            page_right.style.display = "block";
        }
        if (this.curPage > 0) {
            page_left.style.display = "block";
        }
    }
}

