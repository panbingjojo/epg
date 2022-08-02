var scroll = "scroll";
var departNum = 0;
var direct = 92;
var defaultLength = 0;
// 定义全局按钮
var buttons = [];

var InitData = {
    departmentId: RenderParam.departmentId,
    departmentName: RenderParam.departmentName,
    scrollTop: RenderParam.scrollTop
};


function jumpDoctorList(btn) { //选择完科室后，跳转到医生页
    var tempDepartment = btn.cDepartmentObj;
    var departmentId = tempDepartment.dept_id;
    var departmentName = tempDepartment.dept_name;
    var departmentIndex = btn.cDepartmentIndex; // 该字段需要同其他地区保持统一，以下标0开始
    var objCurrent = LMEPG.Intent.createIntent("doctorDepartment");
    var objDoctorList;
    if (RenderParam.carrierId == "440004"
        || RenderParam.carrierId == "10220094"
        || RenderParam.carrierId == "10220095"
        || RenderParam.carrierId == "520092"
        || RenderParam.carrierId == "630092"
        || RenderParam.carrierId == "10000051"
        || RenderParam.carrierId == "640092") {
        objDoctorList = LMEPG.Intent.createIntent("doctorIndex");
    } else {
        objDoctorList = LMEPG.Intent.createIntent("homeTab3");
    }
    objDoctorList.setParam("departmentId", departmentId);
    objDoctorList.setParam("departmentName", departmentName);
    objDoctorList.setParam("departmentIndex", departmentIndex);
//        alert(parseInt(G("list").style.top));
    objDoctorList.setParam("scrollTop", G("list").style.top);
    LMEPG.Intent.jump(objDoctorList, objCurrent, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
}


function onBack() {   // 返回按键
    LMEPG.Intent.back();
}

var UIManagerWithDepartment = {
    defaultFocusId: "btn-1",
    createHtml: function (data) {
        var sHtml = "";
        sHtml += '<div id="list"  class="list" style="top: 0px">';
        var btnLength = ((data.length / 4) + 1) * 4;
        var tempIsLast = true;
        for (var i = 0; i < btnLength; i++) {
            if (i >= 0 && i < data.length) {
                sHtml += '<div id="btn-' + (i + 1) + '"  indexDepart="' + (i + 1) + '" class="subject-btn btn-bg">' + data[i].dept_name + '</div>';

                if (data[i].dept_id && data[i].dept_id == InitData.departmentId) {
                    UIManagerWithDepartment.defaultFocusId = 'btn-' + (i + 1);
                }

                var tempNextDownId = i + 1 + 4;//4指列数，1是由于数组从0开始
                var tempNextRightId = (i + 2);
                var tempNextLeftId = i;

                if (i % 4 === 0) {
                    tempNextLeftId = "";
                }

                if ((i + 1) % 4 === 0) {
                    tempNextRightId = "";
                }

                if (tempIsLast) {
                    if ((i + 1 + 4) > data.length) {
                        tempNextDownId = data.length;
                        tempIsLast = false;
                    }
                }

                buttons.push({
                    id: 'btn-' + (i + 1),
                    name: '科室',
                    type: 'div',
                    nextFocusLeft: 'btn-' + tempNextLeftId,
                    nextFocusRight: 'btn-' + tempNextRightId,
                    nextFocusUp: 'btn-' + ((i + 1) - 4),
                    nextFocusDown: 'btn-' + tempNextDownId,
                    backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
                    focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
                    click: jumpDoctorList,
                    focusChange: UIManagerWithDepartment.departFocus,
                    beforeMoveChange: UIManagerWithDepartment.onRecommendBeforeMoveChange,
                    cDepartmentObj: data[i],
                    cDepartmentIndex: i, // 记录当前科室ID，获取医生列表的时候需要该字段，后端数据接口缓存优化时调整
                });

            }

        }
        sHtml += '</div>';
        G("scroll").innerHTML = sHtml + G("scroll").innerHTML;
//            alert(InitData.scrollTop);
        G("list").style.top = InitData.scrollTop;
        defaultLength = parseInt(InitData.scrollTop);
        LMEPG.ButtonManager.init(UIManagerWithDepartment.defaultFocusId, buttons, "", true);

    }, departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.UI.Marquee.stop();
            LMEPG.UI.Marquee.start(btn.id, 5, 5, 50, "left", "scroll");
//                LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
//                LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },
    // 推荐位按键移动
    onRecommendBeforeMoveChange: function (dir, current) {
        var indexDepart = G(current.id).getAttribute("indexDepart");
        switch (dir) {
            case 'down':
//                    LMEPG.UI.scrollVertically(current.id, scroll,"down", -10);
                if(RenderParam.carrierId !== '10220094'){
                    if (parseInt(indexDepart) >= 5 && parseInt(indexDepart) <= parseInt(departNum - 3)) {
                        defaultLength = defaultLength - direct;
                        //G("list").style.top = defaultLength + "px";
                    }
                }
                var nextFocusDownId = LMEPG.Func.gridBtnUtil.getNextFocusDownId(current);
                if (!LMEPG.Func.isEmpty(nextFocusDownId)) {
                    LMEPG.BM.requestFocus(nextFocusDownId);
                }
                return false;
            case 'up':
                var listEl = G("list");
                var isMinTop = listEl.style.top !== '0px';
                if(RenderParam.carrierId !== '10220094') {
                    if (parseInt(indexDepart) >= 9 || isMinTop) {
                        defaultLength = defaultLength + direct;
                       // listEl.style.top = defaultLength + "px";
                    }
                }
//                    LMEPG.UI.scrollVertically(current.id, scroll,"up", -10);
        }
    }

};

window.onload = function (ev) {
    LMEPG.UI.setBackGround();
    LMEPG.UI.showWaitingDialog();
    LMEPG.Inquiry.p2pApi.getDepartment(function (data) {
        LMEPG.UI.dismissWaitingDialog();
        var departmentList = [];
        if (data.code == "0") {
            departmentList = data.list;
        }
        departmentList.unshift({"dept_id": "", "dept_name": "全部科室"});
        departNum = departmentList.length;
        UIManagerWithDepartment.createHtml(departmentList);
    });
};
