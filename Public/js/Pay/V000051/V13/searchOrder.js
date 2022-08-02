var myProductList = []; // 39健康的商品信息
var curClickBtn; // 当前点击的btn
var Order = {
    page: 0,
    maxPage: 0,
    buttons: [],
    data: [],
    init: function () {
        Order.getOrderProductList(function (list) {
            Order.maxPage = Math.ceil(list.length / 6);
            Order.renderPage(list);
            Order.createBtns();
        });
    },
    onFocusIn: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        var btnElDateC = btnElement.getAttribute('data-c');
        var lastChildEl = G('order-' + btn.id.slice(btn.id.length - 1));
        if (hasFocus) {
            btnElement.className = 'focus';
            lastChildEl.className += ' focus';
        } else {
            btnElement.className = '';
            lastChildEl.className = 'btn-order ' + btnElDateC;
        }
    },
    onClick: function (btn) {
        curClickBtn = btn;
        var classStatus = G(btn.id).getAttribute('data-c');
        // 已退订不做任何操作
        if (classStatus == 'pay-debook') {
            modal.commonDialog({beClickBtnId: btn.id, onClick: modal.hide}, '', '已退订，不可操作', '');
        }
        // 终止退订操作
        else {
            modal.commonDialog({beClickBtnId: btn.id, onClick: Order.cancelOrderProduct}, '', '您确定要终止续订39健康？', '');
        }
    },
    onBeforeMoveChange: function (key, btn) {
        var Id = btn.id;
        var turnPage = {
            prev: key == 'left' && (Id == 'focus-0' || Id == 'focus-3'),
            next: key == 'right' && (Id == 'focus-2' || Id == 'focus-5')
        };
        if (turnPage.prev) {
            Order.turnPrevPage();
        }
        if (turnPage.next) {
            Order.turnNextPage();
        }
    },
    turnPrevPage: function () {
        if (this.page == 0) {
            return;
        }
        Math.max(0, this.page -= 1);
        this.renderPage();
        this.moveToFocus('debug');
    },
    turnNextPage: function () {
        if (this.page == this.maxPage) {
            return;
        }
        Math.min(this.maxPage, this.page += 1);
        this.renderPage();
        this.moveToFocus('debug');
    },
    toggleArrow: function () {
        S('prev-arrow');
        S('next-arrow');
        this.page == 0 && H('prev-arrow');
        (this.page + 1) == this.maxPage && H('next-arrow');
    },
    renderPage: function (list) {
        var htm = [];
        var plusPage = this.page * 6;
        var currentPageData = list.slice(plusPage, plusPage + 6);
        var i = currentPageData.length;
        while (i--) {
            var itemData = currentPageData[i];
            var payInfo = this.setPayBtnClassName(itemData);
            htm.push('<div>' +
                '<ul id=focus-' + i + ' data-c=' + payInfo.className + ' proId=' + itemData.productId + '>' +
                // 把商品名称由 “39健康10元” 转成 “39健康”
                '<li class=title>' + itemData.productName.substr(0, 4) + '</li>' +
                // 把时间 20171224163415 转成 2017.12.24
                '<li class=pay-time>订购时间：' + itemData.startTime.substr(0, 4) + '.' + itemData.startTime.substr(4, 2) + '.' + itemData.startTime.substr(6, 2) +
                '</li>' +
                // 把格式 1000分转成10元
                '<li class=pay-price>订购价格：' + itemData.fee / 100 + '</li>' +
                '<li class=keep-order-price>续订价格：' + itemData.fee / 100 + '</li>' +
                '<li id="order-' + i + '" class="btn-order ' + payInfo.className + '" >' + payInfo.text + '</li>' +
                '</ul></div>');
        }
        G('order-container').innerHTML = htm.reverse().join('');
        this.toggleArrow();
    },
    setPayBtnClassName: function (data) {
        // cancelOrderFlag退订标识 1：未退订 2：已退订  3：不可退订（比如营业厅订购，不允许在电视上退订，或者单次产品，不允许退订）
        var payInfo = {className: 'pay-continue', text: '终止续订'};
        if (data.cancelOrderFlag != '1') {
            payInfo = {className: 'pay-debook', text: '已退订'};
        }
        return payInfo;
    },
    initButtons: function (Id) {
        LMEPG.ButtonManager.init(Id, this.buttons, '', true);
    },
    moveToFocus: function (focusId) {
        LMEPG.ButtonManager.requestFocus(focusId);
    },
    createBtns: function () {
        this.buttons.push({
            id: 'focus-0',
            name: '焦点0',
            type: 'others',
            nextFocusLeft: '',
            nextFocusRight: 'focus-1',
            nextFocusDown: 'focus-3',
            nextFocusUp: '',
            click: this.onClick,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onBeforeMoveChange
        }, {
            id: 'focus-1',
            name: '焦点1',
            type: 'others',
            nextFocusLeft: 'focus-0',
            nextFocusRight: 'focus-2',
            nextFocusDown: 'focus-4',
            nextFocusUp: '',
            click: this.onClick,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onBeforeMoveChange

        }, {
            id: 'focus-2',
            name: '焦点2',
            type: 'others',
            nextFocusLeft: 'focus-1',
            nextFocusRight: 'focus-3',
            nextFocusDown: 'focus-5',
            nextFocusUp: '',
            click: this.onClick,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onBeforeMoveChange

        }, {
            id: 'focus-3',
            name: '焦点3',
            type: 'others',
            nextFocusLeft: 'focus-2',
            nextFocusRight: 'focus-4',
            nextFocusDown: '',
            nextFocusUp: 'focus-0',
            click: this.onClick,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onBeforeMoveChange

        }, {
            id: 'focus-4',
            name: '焦点4',
            type: 'others',
            nextFocusLeft: 'focus-3',
            nextFocusRight: 'focus-5',
            nextFocusDown: '',
            nextFocusUp: 'focus-1',
            click: this.onClick,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onBeforeMoveChange

        }, {
            id: 'focus-5',
            name: '焦点5',
            type: 'others',
            nextFocusLeft: 'focus-4',
            nextFocusRight: '',
            nextFocusDown: '',
            nextFocusUp: 'focus-2',
            click: this.onClick,
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onBeforeMoveChange

        }, {
            id: 'debug',
            name: '脚手架ID',
            type: 'others',
            nextFocusLeft: 'focus-5',
            nextFocusRight: 'focus-0',
            nextFocusDown: '',
            nextFocusUp: ''
        });
        this.initButtons('focus-0');
    },

    /**
     * 获取已订购产品列表接口
     * @param callback
     */
    getOrderProductList: function (callback) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Products/queryOrderProductList', null, function (data) {

            /*var tmp0 = {
                productName: "39健康10元",
                startTime: "20171224163415",
                fee: 1000,
                productId: 123456789,
                cancelOrderFlag: 1,
            };
            var tmp1 = {
                productName: "39健康10元",
                startTime: "20171224163415",
                fee: 1000,
                productId: 123456789,
                cancelOrderFlag: 2,
            };
      
            myProductList[0] = tmp0;
            myProductList[1] = tmp1;
            myProductList[2] = tmp1;
            myProductList[3] = tmp1;
            myProductList[4] = tmp1;
            callback(myProductList);
            LMEPG.UI.dismissWaitingDialog();
            return;*/


            if (data == undefined) {
                Order.showNullData();
                LMEPG.UI.dismissWaitingDialog();
                return;
            }
            // 把data转成json对象
            data = data instanceof Object ? data : JSON.parse(data);
            if (data.result == 0) {
                var productList = data.orders;

                // 过滤出39健康的数据
                var count = 0;
                for (var item = 0; item < productList.length; item++) {
                    var productId = productList[item].productId.substr(0, 4);
                    // domain 产品域 1：Linux 2：Android
                    if ((productId == '39jk' || productId == 'sjjk') && (productList[item].domain == 1)) {
                        myProductList[count++] = productList[item];
                    }
                }
                if (myProductList.length == 0)
                    Order.showNullData();
                else
                    callback(myProductList);
            } else {

                // 模拟数据
                /*var tmp0 = {
                              productName: "39健康10元",
                              startTime: "20171224163415",
                              fee: 1000,
                              productId: 123456789,
                              cancelOrderFlag: 1,
                          };
                          var tmp1 = {
                              productName: "39健康10元",
                              startTime: "20171224163415",
                              fee: 1000,
                              productId: 123456789,
                              cancelOrderFlag: 2,
                          };
        
                          myProductList[0] = tmp0;
                          myProductList[1] = tmp1;
                          myProductList[2] = tmp1;
                          myProductList[3] = tmp1;
                          myProductList[4] = tmp1;
                          callback(myProductList);*/
                ///////////


                Order.showNullData();
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     * 退订
     * @param btn
     */
    cancelOrderProduct: function (btn) {
        LMEPG.UI.showWaitingDialog();
        var productId = G(btn.beClickBtnId).getAttribute('proId');
        var postData = {'productId': productId};
        LMEPG.ajax.postAPI('Products/cancelOrderProduct', postData, function (data) {
            // 把data转成json对象
            data = data instanceof Object ? data : JSON.parse(data);
            // 退订成功
            if (data.result == 0) {
                modal.commonDialog({
                    beClickBtnId: curClickBtn.id,
                    onClick: Order.reload,
                    onCancel: Order.reload
                }, '', '恭喜您退订39健康成功', '');
            }
            // 退订失败
            else {
                modal.commonDialog({beClickBtnId: curClickBtn.id, onClick: modal.hide}, '', '退订失败，请重试', '');
            }
            LMEPG.UI.dismissWaitingDialog();
        });
    },

    /**
     *
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('searchOrder');
        return objCurrent;
    },

    /**
     * 重新加载页面
     */
    reload: function () {
        // 刷新页面，重新加载
        var objDst = LMEPG.Intent.createIntent('searchOrder');
        LMEPG.Intent.jump(objDst, null);
    },

    /**
     * 空数据显示页面
     */
    showNullData: function () {
        LMEPG.BM.init('', [], '', true);
        G('null-data-000051').style.display = 'block';
        H('prev-arrow');
        H('next-arrow');
    }
};
var onBack = function () {
    LMEPG.Intent.back();
};
Order.init();
