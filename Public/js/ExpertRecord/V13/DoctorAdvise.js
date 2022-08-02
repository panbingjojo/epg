var Advise = {
    buttons: [],
    init: function () {
        this.render();
        this.createBtns();
        this.isOverflowWrap();
    },
    render: function () {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.Inquiry.expertApi.getPatientList(RenderParam.initAppointmentID, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            try {
                var resObj = data instanceof Object ? data : JSON.parse(data);
                if (resObj.data.suggest == '') {
                    LMEPG.BM.init('', [], '', true);
                    G('null-data-000051').style.display = 'block';
                    H('scroll-wrap');
                } else {
                    G('doctor-advise').innerHTML = resObj.data.suggest;//专家建议
                }
            } catch (e) {
                LMEPG.UI.showToast('解析数据异常：' + e.toString());
            }
        });
    },
    onFocusChange: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.style.backgroundColor = '#ef0b2c';
        } else {
            btnElement.style.backgroundColor = '#32cfe0';

        }
    },
    innerEl: G('desc-wrap'),
    elHeight: 0,
    isOverflowWrap: function () {
        if (this.innerEl !== null && typeof this.innerEl != 'undefined') {
            this.elHeight = parseInt(this.getInnerHeight(this.innerEl, 'height'));
            this.elHeight < 710 && G('doctor-desc').removeChild(G('scroll-wrap'));  // 如果没有溢出内容则不显示滚动条
        }
    },
    getInnerHeight: function (el, attr) {
        var val;
        if (el.currentStyle) {
            val = el.currentStyle[attr];
        } else {
            val = getComputedStyle(el, null)[attr];
        }
        return val;
    },
    Nc: 20,
    onBeforeMoveChangeScrollDistance: function (key, btn) {
        if (key == 'left' || key == 'right') {
            return;
        }
        var _this = Advise;
        var scrollElement = G(btn.id);
        var scrollBtnObj = LMEPG.ButtonManager.getButtonById('scroll-bar');
        var changeUp = function () {
            _this.Nc = Math.max(0, _this.Nc -= 20);
        };
        var changeDown = function () {
            _this.Nc = Math.min(350, _this.Nc += 20);
        };
        var updateDis = function () {
            scrollElement.style.top = _this.Nc + 'px';
            G('doctor-advise').style.top = -_this.Nc + 'px';
        };
        if (key == 'down') {
            changeDown();
        } else {
            changeUp();
        }
        updateDis();
    },
    createBtns: function () {
        this.buttons.push({
            id: 'scroll-bar',
            name: '病历资料',
            type: 'div',
            click: '',
            focusChange: this.onFocusChange,
            beforeMoveChange: this.onBeforeMoveChangeScrollDistance
        });
        LMEPG.BM.init('scroll-bar', this.buttons, '', true);
    }
};

var onBack = function () {
    LMEPG.Intent.back();
};
