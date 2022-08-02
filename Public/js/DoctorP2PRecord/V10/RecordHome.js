function onBack() {   // 返回按键
    LMEPG.Intent.back();
}

//前端开发处理部分
var UIHandle = {
    count: 3,   //每页显示多少条
    pageCurrent: 1,//当前页码
    pageTotal: 0, //总共多少页
    isNextTurnPage: true,//是否翻下一页,
    isFirstLoad: true, //是否是第一次加載
    eleList: {
        noData: G("no_data"),   //没有数据
        waitArchive: G("archiveNum"),//归档的条数
        arrowNext: G("right"),   //上一页箭头
        arrowPre: G("left")      //下一页箭头
    },
    cut: function () {   // 翻页数据截取
        var arr = DataHandle.InitData.memberArray;
        var atMove = (this.pageCurrent - 1) * this.count;
        return arr.slice(atMove, atMove + this.count);
    },
    initFirstButton: function () {
        buttons = [
            {
                id: 'arching-btn',
                name: '数据归档',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: 'card-1',
                backgroundImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V10/bg_btn_archive.png",
                focusImage: g_appRootPath + "/Public/img/hd/DoctorP2P/V10/f_btn_archive.png",
                click: UIHandle.onClick,
                focusChange: "",
                beforeMoveChange: ""
            }
        ];
    },
    createHtml: function (data) {   //创建html元素
        var htmlStr = "";
        UIHandle.pageTotal = Math.ceil(data.length / this.count);
        UIHandle.initFirstButton();

        var dataList = UIHandle.cut();
        for (var i = 0; i < dataList.length; i++) {
            htmlStr += '  <div id="card-' + (i + 1) + '" class="card"><img class="photo" src="' + imgUrl + "icon_member_" + dataList[i].member_image_id + '.png"/>';
            htmlStr += '  <div class="intro-info">' + dataList[i].member_name + '<br/><span class="font-s">问诊记录</span></div>';
            htmlStr += '   </div>';

            buttons.push({
                id: 'card-' + (i + 1),
                name: '数据归档',
                type: 'div',
                nextFocusLeft: 'card-' + i,
                nextFocusRight: 'card-' + (i + 2),
                nextFocusUp: 'arching-btn',
                nextFocusDown: '',
                backgroundImage: imgUrl + "bg_card.png",
                focusImage: imgUrl + "f_card.png",
                click: this.onClick,
                focusChange: "",
                beforeMoveChange: UIHandle.onBeforeMoveChange,
                cMemberObj: dataList[i]
            });

        }
        G("center").innerHTML = htmlStr;
        UIHandle.updateMenuArrows();
        if (this.isFirstLoad) {
            this.isFirstLoad = false;
            LMEPG.ButtonManager.init(DataHandle.InitData.focusId, buttons, '', true);
        } else {
            if (this.isNextTurnPage) {
                LMEPG.ButtonManager.init('card-1', buttons, '', true);
            } else {
                LMEPG.ButtonManager.init('card-3', buttons, '', true);
            }
        }
    },
    nextPage: function () {
        if (UIHandle.pageCurrent < UIHandle.pageTotal) {
            UIHandle.pageCurrent++;
            this.isNextTurnPage = true;
            UIHandle.createHtml(DataHandle.InitData.memberArray);
        }
    },
    prevPage: function () {
        if (UIHandle.pageCurrent > 1) {
            UIHandle.pageCurrent--;
            this.isNextTurnPage = false;
            UIHandle.createHtml(DataHandle.InitData.memberArray);
        } else {
            return false;
        }
    },

    updateMenuArrows: function () {
        this.eleList.arrowNext.style.display = "none";
        this.eleList.arrowPre.style.display = "none";
        if (UIHandle.pageCurrent > 1) {
            this.eleList.arrowPre.style.display = "block";
        }
        if (UIHandle.pageCurrent < UIHandle.pageTotal) {
            this.eleList.arrowNext.style.display = "block";
        }
    },
    onBeforeMoveChange: function (dir, current) {  // 推荐位按键移动
        switch (dir) {
            case 'left':
                if (current.id == "card-1") {
                    UIHandle.prevPage();
                    return false;
                } else {
                }
                break;
            case 'right':
                if (current.id == "card-3") {
                    UIHandle.nextPage();
                    return false;
                }
                break;
        }
    },
    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },
    onClick: function (btn) {
        if (btn.id === 'arching-btn') { // 待归档
            if (DataHandle.InitData.waitArchiveCount > 0) {
                JumpHandle.jumpDoctorRecordDetail(-1, "");
            } else {
                LMEPG.UI.showToast("暂无可归档的数据");
            }
        } else {
            var tempMember = btn.cMemberObj;
            JumpHandle.jumpDoctorRecordDetail(tempMember.member_id, tempMember);
        }
    }
};
var buttons = [];
var imgUrl = g_appRootPath + "/Public/img/hd/Family/V10/";


//后台数据绑定部分
var DataHandle = {
    InitData: {
        memberJsonStr: RenderParam.memberJsonStr,
        waitArchiveCount: RenderParam.waitArchiveCount,
        memberId: RenderParam.memberId,
        focusId: RenderParam.focusId,
        memberArray: [],
    },
    init: function () {
        UIHandle.eleList.waitArchive.innerHTML = DataHandle.InitData.waitArchiveCount;
        try {
            var memberJson = JSON.parse(this.InitData.memberJsonStr);
            if (memberJson.result == 0) {
                this.InitData.memberArray = memberJson.list;
                if (!LMEPG.Func.isEmpty(this.InitData.memberId)) {
                    for (var i = 0; i < this.InitData.memberArray.length; i++) {
                        if (this.InitData.memberId == this.InitData.memberArray[i].member_id) {
                            console.log("index::" + i);
                            UIHandle.pageCurrent = Math.ceil((i + 1) / UIHandle.count);
                            break;
                        }
                    }
                }
                if (this.InitData.memberArray.length > 0) {
                    UIHandle.eleList.noData.style.display = "none";
                    UIHandle.createHtml(this.InitData.memberArray);
                } else {
                    UIHandle.eleList.noData.style.display = "block";
                    UIHandle.initFirstButton();
                    LMEPG.ButtonManager.init('arching-btn', buttons, '', true);
                }
            }
        } catch (e) {
        }
    }
};

var JumpHandle = {
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent("doctorRecordHome");
        objCurrent.setParam("focusId", LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },
    jumpDoctorRecordDetail: function (memberId, memberObj) { //医生记录详情页
        var objCurrent = this.getCurrentPage();
        objCurrent.setParam("memberId", memberId);
        var objDoctorRecordDetail = LMEPG.Intent.createIntent("doctorRecordDetail");
        objDoctorRecordDetail.setParam("memberID", memberId);
        objDoctorRecordDetail.setParam("memberObj", JSON.stringify(memberObj));
        LMEPG.Intent.jump(objDoctorRecordDetail, objCurrent);
    },
};

window.onload = function () {
    DataHandle.init();
};
