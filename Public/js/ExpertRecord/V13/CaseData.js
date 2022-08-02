var dataCaseArray = null;
var Case = {
    buttons: [],
    page: 0,
    maxPage: 0,
    init: function () {
        getMaterialList(function () {
            Case.maxPage = Math.ceil(dataCaseArray.length / 4) - 1;
            Case.render();
            Case.createBtns();
        });
    },
    render: function () {
        var count = this.page * 4;
        var currentData = dataCaseArray.slice(count, count + 4);
        var htm = '';
        currentData.forEach(function (t, i) {
            var curTime = new Date(getStandardDt(t.insert_dt)).format("yyyy年MM月dd日");
            var imgUrl = LMEPG.Inquiry.expertApi.createCaseUrl(RenderParam.expertUrl, t.material_pic);
            htm += '<div>' +
                '<img id="focus-' + i + '" src=' + imgUrl + ' alt="">' +
                '<p>' + curTime + '</p>' +
                '</div>';
        });
        G('case-wrap').innerHTML = htm;
        G('page-count').innerHTML = (this.page + 1) + '/' + (this.maxPage + 1);
        this.toggleArrow();
    },
    prevPage: function () {
        if (this.page == 0) {
            return;
        }
        this.page--;
        this.render();
        LMEPG.BM.requestFocus('focus-3');
    },
    nextPage: function () {
        if (this.page == this.maxPage) {
            return;
        }
        this.page++;
        this.render();
        LMEPG.BM.requestFocus('focus-0');
    },
    toggleArrow: function () {
        S('prev-arrow');
        S('next-arrow');
        this.page == 0 && H('prev-arrow');
        this.page == this.maxPage && H('next-arrow');
    },
    onbeforeMoveTurnPage: function (key, btn) {
        if (key == 'left' && btn.id == 'focus-0') {
            Case.prevPage();
            return false;
        }
        if (key == 'right' && btn.id == 'focus-3') {
            Case.nextPage();
            return false;
        }
    },
    onFocusChangeAddUI: function (btn, hasFocus) {
        if (hasFocus) {
            G(btn.id).className = 'focus';
        } else {
            G(btn.id).className = '';
        }
    },
    createBtns: function () {
        var count = 4;// 4个焦点对象
        while (count--) {
            this.buttons.push({
                id: 'focus-' + count,
                name: '病历资料',
                type: 'div',
                nextFocusLeft: 'focus-' + (count - 1),
                nextFocusRight: 'focus-' + (count + 1),
                focusImage: g_appRootPath + '/Public/img/hd/Common/V13/case_item_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                click: '',
                focusChange: this.onFocusChangeAddUI,
                beforeMoveChange: this.onbeforeMoveTurnPage
            });
        }
        LMEPG.BM.init('focus-0', this.buttons, '', true);
    }
};

/**
 * 获取病历资料信息
 */
function getMaterialList(callback) {
    LMEPG.UI.showWaitingDialog("");
    LMEPG.Inquiry.expertApi.getMaterialList(RenderParam.initAppointmentID, function (materialList) {
        LMEPG.UI.dismissWaitingDialog();
        try {
            var tempJsonObj = materialList instanceof Object ? materialList : JSON.parse(materialList);
            if (tempJsonObj.code == 0) {
                dataCaseArray = tempJsonObj.data;
                callback();
            } else if (tempJsonObj.code == -102) {
                showNullData();
            } else {
                showNullData();
            }
        } catch (e) {
            LMEPG.UI.showToast("数据异常：" + e.toString());
            console.log("err=" + e);
            showNullData();
        }
    });
}

/**
 * 格式化时间
 */
function getStandardDt(dt) {
    var time = dt.replace(/-/g, ':').replace(' ', ':');
    time = time.split(':');
    var resultTime = new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5]);
    return resultTime;
}

/**
 * 空数据显示页面
 */
function showNullData() {
    LMEPG.BM.init('', [], '', true);
    G("null-data-000051").style.display = "block";
    H("content");
}


/**
 * 初始化
 */
var onBack = function () {
    LMEPG.Intent.back();
};