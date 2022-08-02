/**
 *desc: 通用数字小键盘
 *author: xiaofei.jian
 *@2019-05-13 14:24
 *@version: 2.0
 */
(function (epg, w, d) {
    var Key = {
        isCreate: false,
        numberValue: '',
        top: '100px',
        left: '88px',
        init: function (arg) {
            this.set(arg);
            this.createTable();
            this.keyPadStyle();
            this.createButtons();
            this.listenEventBack();
            epg.BM.requestFocus('k0');
            var initTel =this.numberWrap.innerHTML;
            this.numberValue = isFinite(initTel) ? initTel : '';
        },

        /**执行一次浅复制*/
        set: function (arg) {
            for (var o in arg) {
                if (arg.hasOwnProperty(o)) {
                    Key[o] = arg[o];
                }
            }
            this.numberWrap = d.getElementById(this.input);
            this.keyArray = ['k0', 'k1', 'k2', 'k3', 'k4', 'kdelete', 'k5', 'k6', 'k7', 'k8', 'k9', 'kback'];
        },

        /**添加监听返回截止事件回调函数*/
        listenEventBack: function () {
            if (!(typeof epg.BM._isKeyEventInterceptCallback === 'function')) {
                epg.BM._isKeyEventInterceptCallback = function (keyCode) {
                    if (keyCode == KEY_BACK && Key.isExist) {
                        Key.hideKeyPad();
                        return true;
                    } else {
                        return false;
                    }
                };
            }
            // 兼容新整合焦点框架
            epg.KEM.stopEventProcess = function (keyCode) {
                if (keyCode == KEY_BACK && Key.isExist) {
                    Key.hideKeyPad();
                    return true;
                } else {
                    return false;
                }
            };
        },

        /**创建数字键盘UI*/
        createTable: function () {
            var tableWrap = d.createElement('div');
            tableWrap.id = 'table-wrap';
            var htm = '<table id="key-table">';
            var getNeedArray = [this.keyArray.slice(0, 6), this.keyArray.slice(6)];
            for (var i = 0; i < 2; i++) { // 两行
                htm += '<tr>';
                for (var j = 0; j < 6; j++) { // 六列
                    var getIndex = getNeedArray[i][j];
                    var setText = getIndex === 'kdelete' ? '删除' : getIndex === 'kback' ? '返回' : getIndex.slice(1);
                    htm += '<td id=' + getIndex + '>' + setText;
                }
            }
            tableWrap.innerHTML = htm;
            this.numberWrap.parentNode.appendChild(tableWrap);
            this.addKeyWriteCode();
            this.isExist = true;
        },

        /**添加遥控器键盘输入数字*/
        addKeyWriteCode: function () {
            var i = 10;
            while (i--) {
                var obj = {};
                obj['KEY_' + i] = Key.onClick;
                epg.KeyEventManager.addKeyEvent(obj);
            }
        },

        /**创建虚拟焦点*/
        createButtons: function () {

            if (this.isCreate) return; // 避免重复创建
            var _this = this;
            var s = this.keyArray;
            var i = s.length;
            while (i--) {
                epg.BM.addButtons({
                    id: s[i],
                    type: 'others',
                    nextFocusUp: s[i - 6],
                    nextFocusDown: s[i + 6],
                    nextFocusLeft: s[i - 1],
                    nextFocusRight: s[i + 1],
                    click: _this.onClick,
                    focusChange: _this.changeColor,
                    focusable: true
                });
            }
            this.isCreate = true;
            this.msg = this.numberWrap.innerHTML || '';
        },

        /**逐个删除数字*/
        deleteWord: function () {
            // 是数字
            var value = this.numberValue;
            this.numberValue = value.slice(0, value.length - 1);
            this.validateNumber();
        },

        /**隐藏(删掉)数字小键盘*/
        hideKeyPad: function () {
            this.isExist = false;
            Key.numberWrap.parentNode.removeChild(d.getElementById('table-wrap'));
            epg.BM.requestFocus(this.backFocus);
            epg.KEM.delKeyEvent(['KEY_0', 'KEY_1', 'KEY_2', 'KEY_3', 'KEY_4', 'KEY_5', 'KEY_6', 'KEY_7', 'KEY_8', 'KEY_9']);
        },

        /**事件处理*/
        onClick: function (btn) {
            var _this = Key;
            switch (btn.id) {
                case 'kdelete':
                    _this.deleteWord();
                    break;
                case 'kback':
                    _this.hideKeyPad();
                    break;
                default:
                    _this.takeNumber(btn);
                    break;
            }
        },

        /**取值*/
        takeNumber: function (arg) {
            var str;
            if (typeof arg == 'number') {
                str = (arg += 2).toString();
            } else {
                str = arg.id;
            }
            var number = str.slice(str.length - 1);
            this.bgColor(d.getElementById('k' + number), '#4CAF50');
            epg.BM.requestFocus('k' + number);
            this.validateNumber(number);
        },

        /**校验取值*/
        validateNumber: function (count) {
            var reg = /^[0-9]*$/;
            if (!reg.test(this.numberValue)) { // 校验输入框值为数字
                this.numberValue = ''; // 不是数字清空输入框
            }
            if (this.action === 'tel' && this.numberValue.length > 10) { // 是输入电话号码且个数不大于11
                this.bgColor(d.getElementById('k' + count), '#f0ad4e');
                return;
            }
            this.numberValue += count || '';
            this.numberWrap.innerText = this.numberValue || this.msg;
        },

        /**工具函数设置背景颜色*/
        bgColor: function (el, val) {
            el.style.backgroundColor = val;
        },

        /**获得焦点改变颜色*/
        changeColor: function (btn, bol) {
            var btnEl = d.getElementById(btn.id);
            Key.bgColor(btnEl, bol ? '#8BC34A' : '#337ab7');
        },

        /**设置小键盘样式*/
        keyPadStyle: function () {
            var tableObj = d.getElementById('key-table');
            document.getElementById('key-table').style.position = 'absolute';
            var tdDelete = d.getElementById('kdelete');
            var tdBack = d.getElementById('kback');
            // table默认的样式
            var defaultStyle = {
                width: '580px',
                height: '150px',
                fontSize: '50px',
                position: 'absolute',
                top: this.top,
                left: this.left,
                color: '#fff',
                border: 'none',
                outline: 'none',
                borderCollapse: 'collapse',
                zIndex: '9999',
                textAlign: 'center'
            };
            var actionBtnFontSize = '40px';
            // 标清的样式
            if (this.resolution === 'sd') {
                defaultStyle.width = '288px';
                defaultStyle.height = '88px';
                defaultStyle.fontSize = '25px';
                actionBtnFontSize = '15px';
            }
            // 设置table的样式
            for (var o in defaultStyle) {
                tableObj.style[o] = defaultStyle[o];
            }
            // 设置td的样式
            var n = this.keyArray.length;
            while (n--) {
                var td = d.getElementById(this.keyArray[n]);
                td.style.border = '1px solid transparent';
                td.style.borderRadius = '5px';
                td.style.position = 'relative';
                td.style.backgroundColor = '#337ab7';
            }
            // 设置删除、返回的样式
            tdBack.style.width = '20%';
            tdBack.style.fontSize = actionBtnFontSize;
            tdDelete.style.fontSize = actionBtnFontSize;

        }
    };
    w.LMKey = w.JJKye = Key;

}(LMEPG, window, document));


