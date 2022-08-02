/**
 * 搜索功能对象
 */
var Search = {
    input: '',
    buttons: [],
    keepaliveId: 'key-0',
    isFirstSearch: true,
    isShowLetter: false,
    searchWord: '',
    isHD: true,
    imgPrefix: ROOT + '/Public/img/hd/Search/V13/',
    init: function () {
        this.fetchVal = "";
        this.isHD = RenderParam.platformType !== 'sd';
        this.imgPrefix = '/Public/img/' + RenderParam.platformType + '/Search/V13/';
        this.input = G(NCOV.inputId);
        this.createKeyHtml();
        this.createButtons();
        LMEPG.BM.addButtons(this.buttons);
        LMEPG.BM.requestFocus('key-0', this.buttons, '', true);
        G(NCOV.inputId).setAttribute('val', "");
    },
    createKeyHtml: function () {
        var htm = '';
        var len = 11;
        var key = document.createElement('div');
        key.id = 'key-container';
        while (len--) {
            htm = '<div><img id="key-' + len + '" src="' + ROOT + '/Public/img/hd/Search/V13/key' + len + '.png"></div>' + htm;
        }
        key.innerHTML = htm;
        this.toggle('key-container');
        !G('key-container') && document.body.appendChild(key);

    },
    toggle: function (id) {
        var el = G(id);
        var isShow = el && el.style.display && el.style.display === "block";
        if (el) el.style.display = isShow ? "none" : "block";
    },
    /**
     * 构建虚拟键盘
     */
    createButtons: function () {
        var self = this;
        var COUNT_KEYS = 11; // 键盘的键值个数
        var key_val = [
            ['A', 'B', 'C', '1'],
            ['D', 'E', 'F', '2'],
            ['G', 'H', 'I', '3'],
            ['J', 'K', 'L', '4'],
            ['M', '', 'N', '5'],
            ['O', 'P', 'Q', '6'],
            ['R', 'S', 'T', '7'],
            ['U', 'V', 'W', '8'],
            ['X', 'Y', 'Z', '9'],
            ['', '', '', '0'],
            ['', '', '', '']
        ];
        while (COUNT_KEYS--) {
            var ImageIndex = ROOT+'/Public/img/hd/Search/V13/key' + COUNT_KEYS;
            var click = self.click;

            self.buttons.push({
                id: 'key-' + COUNT_KEYS,
                name: '键-' + COUNT_KEYS,
                type: 'img',
                nextFocusLeft: COUNT_KEYS === 0 ? "key-10" : 'key-' + (COUNT_KEYS - 1),
                nextFocusRight: COUNT_KEYS === 10 ? "key-0" : 'key-' + (COUNT_KEYS + 1),
                backgroundImage: ImageIndex + '.png',
                focusImage: ImageIndex + '_f.png',
                clickImage: ImageIndex + '_k.png',
                click: COUNT_KEYS === 10 ? self.deleteText : self.click,
                focusChange: self.keyOnfocusIn,
                val: key_val[COUNT_KEYS],
                Obj: self
            });
        }
    },
    deleteText: function (btn) {
        var self = btn.Obj;
        var value = self.input.getAttribute('val');
        console.log(value)
        value && self.updateValue(btn, 0);
    },
    clear: function (btn) {
        var self = btn.Obj;
        self.updateValue(btn);
    },

    keyOnfocusIn: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.className = 'focus';
        } else {
            btnElement.className = '';
        }
    },
    click: function (btn) {
        var self = btn.Obj;
        self.isShowLetter = false;
        if (btn.id == 'key-9') {
            self.updateValue(btn, 3);
        } else {
            self.keepaliveId = btn.id;
            self.isShowLetter = self.showLetter(btn);
            G(btn.id).setAttribute('class', 'click');
        }
    },
    /**
     * 动态构建脚手架ID虚拟按钮（链接键值）
     */
    showLetter: function (btn) {
        // 更新创建虚拟脚手架
        if (this.buttons.length > 13) {
            (this.buttons.splice(this.buttons.length - 1));
        }
        LMEPG.BM.addButtons({
            id: 'key-container',
            name: '脚手架ID',
            type: 'img',
            toObj: btn,
            Obj: this,
            nextFocusUp: btn.id,
            nextFocusDown: btn.id,
            nextFocusLeft: btn.id,
            nextFocusRight: btn.id,
            click: this.letterClick,
            focusChange: this.letterFocus,
            beforeMoveChange: this.letterDirection,
            focusable: true
        });

        LMEPG.BM.requestFocus('key-container');
        return true;
    },
    /**
     * 字母键盘获得焦点(样式操作)
     */
    letterFocus: function (btn, hasFocus) {
        // 设置当前字母键值的样式
        var currentKey = btn.toObj;
        var btnEl = G(currentKey.id);
        if (hasFocus) {
            btnEl.src = currentKey.clickImage;
        }
    },
    /**
     * 字母键盘被点击取值
     */
    letterClick: function (btn) {
        LMEPG.BM.requestFocus(btn.toObj.id);
        G(btn.id).removeAttribute('class');
    },
    /**
     * 字母键盘被移动取值
     * index: 键值索引值（顺时针）
     */
    letterDirection: function (key, btn) {
        var self = btn.Obj;
        var currentKey = btn.toObj;
        var index;
        switch (key) {
            case 'left':
                index = 0;
                break;
            case 'up':
                index = 1;
                break;
            case 'right':
                index = 2;
                break;
            case 'down':
                index = 3;
                break;
        }
        self.updateValue(currentKey, index);
        self.isShowLetter = false; // 还原返回条件
    },
    /**
     * 实时更新关键字状态
     * currentKey：当前小键盘对象键
     * index：关键字索引
     * isAction：是否执行附加操作（如删除、清空）
     */
    updateValue: function (currentKey, index, callback) {
        var input = this.input;
        var thisID = currentKey.id === "key-10" ? 'delete' : currentKey.id;
        var fetchVal = input.getAttribute('val'); // 获取前一个输入值
        switch (thisID) {
            case 'delete':                                        // 退格（删除）功能
                fetchVal = fetchVal.slice(0, fetchVal.length - 1);
                break;
            case 'clear':                                         // 清空"功能
                fetchVal = '';
                break;
            default:
                fetchVal += currentKey.val[index];               // 抓取前一个和当前输入值
                break;
        }
        input.innerHTML = fetchVal || '<span> 输入关键信息，数字+字母组成 </span>';              // 输入框显示绑定值
        input.setAttribute('val', fetchVal);                      // 绑定当前抓取值
        // 保存搜索关键词
        Search.searchWord = fetchVal;
        this.searchAction(fetchVal, callback);                              // 执行Ajax搜索行为
    },
    /**
     * 执行ajax请求搜索获取视频列表信息
     * fetchVal：请求的关键字
     */
    searchAction: function (fetchVal, callback) {
        var self = this;
        var text = G('input-abbreviation').innerText;
        if (text !== '省简称') fetchVal = text + fetchVal;
        NCOV.searchData['no'] = fetchVal;
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Epidemic/getEpidemicSameTrip', NCOV.searchData, function (data) {
            data = data instanceof Object ? data : JSON.parse(data);
            if (data.code === 200) {
                self.fetchVal = fetchVal;
                NCOV.saveUseResult = data.list;
                NCOV.stageClickKewordInput(data);
                LMEPG.UI.dismissWaitingDialog();
                typeof callback === 'function' && callback();
            } else {
                LMEPG.UI.showToast('没有该结果哦~');
                LMEPG.UI.dismissWaitingDialog();
            }
        });
    },
    initButton: function (focusId) {
        LMEPG.ButtonManager.init(focusId, this.buttons, '', true);
    }
};
