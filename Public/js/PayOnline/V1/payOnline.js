var buttons = [];
var Product = {
    // productType: ["lx-xyj", "aal-xty", "39-sxt","aal-xtsz"],
    imgSrc: g_appRootPath + "/Public/img/hd/PayOnline/V1/",
    init: function () {
        if (!LMEPG.Func.isEmpty(RenderParam.skin.cpbjt)) {
            document.body.style.backgroundImage = 'url(' + RenderParam.fsUrl + RenderParam.skin.cpbjt + ')';
        }
        Product.getGoodsInfo();
    },

    getGoodsInfo: function () {
        // LMEPG.UI.showWaitingDialog();
        var postData = {
            "pageCurrent": 1,
            "pageNum": 99
        };
        LMEPG.ajax.postAPI("Goods/getGoodsInfo", postData, function (rsp) {;
            if(rsp.result == '0'){
                var data = rsp.list;
                console.log(data);
                Pagination.init(data);
            }

        });
    },

    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('payOnline');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('page', Pagination.curPage);
        return objCurrent;
    },
    onClick: function (btn) {
        var goodsId = G(btn.id).getAttribute('goods_id');
        Product.jumpProductDetail(goodsId);
    },

    /**
     * 跳转 - 商品详情页
     */
    jumpProductDetail: function (goodsId) {
        var objCurrent = Product.getCurrentPage();
        var objHomeTab = LMEPG.Intent.createIntent('productDetail');
        objHomeTab.setParam('goodsId', goodsId);
        LMEPG.Intent.jump(objHomeTab, objCurrent);
    },

};

var Pagination = {
    curPage: 1,
    data: "",
    pagesSize: 3,
    btnId: "link-",
    maxPage: 1,
    init: function (data) {
        this.data = data;
        this.maxPage += this.data.length-3
        this.curPage = parseInt(RenderParam.page) ? parseInt(RenderParam.page):this.curPage;
        this.createBtn();
        this.createHtml();
    },
    createHtml: function () {
        G('container').innerHTML = '';
        var sHtml = "";
        var curData = this.cut(this.data);
        var that = this;
        curData.forEach(function (item, i) {
            sHtml += '<img id="' + that.btnId + i + '" goods_id = "' + item.goods_id + '"src="' + RenderParam.fsUrl + item.goods_img_url+'"/>';
        });
        G('container').innerHTML = sHtml;
        // for (var i = 0; i < curData.length; i++) {
        //     LMEPG.BM.getButtonById(Pagination.btnId + i).cType = Product.productType[Pagination.curPage+i];
        // }
        this.toggleArrow();
        LMEPG.ButtonManager.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'link-0');
    },
    cut: function () {
        return this.data.slice(this.curPage-1, this.pagesSize + this.curPage-1)
    },
    turnPage: function (dir, cur) {
        if (dir == "left" && cur.id == "link-0") {
            Pagination.prePage();
            return false
        } else if (dir == "right" && cur.id == "link-2") {
            Pagination.nextPage();
            return false
        }
    },
    onFocus:function (btn, hasFocus) {
        var btnElement = G(btn.id);
        if (hasFocus) {
            btnElement.setAttribute('class', 'focus');
        } else {
            btnElement.removeAttribute('class');
        }
    },

    createBtn: function () {
        var focusNum = 3;
        while (focusNum--) {
            buttons.push({
                id: this.btnId + focusNum,
                type: 'img',
                nextFocusUp: 'input',
                nextFocusLeft: this.btnId + (focusNum - 1),
                nextFocusRight: this.btnId + (focusNum + 1),
                // backgroundImage: g_appRootPath + '/Public/img/hd/PayOnline/V1/link_1.png',
                // focusImage: g_appRootPath + '/Public/img/hd/PayOnline/V1/link_1.png',
                focusChange: this.onFocus,
                click: Product.onClick,
                beforeMoveChange: this.turnPage,
                // cType: ""
            });
        }
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'link-0', buttons, '', true);
    },

    prePage: function () {
        if (this.curPage > 1) {
            this.curPage--;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + "0");
        }
    },
    nextPage: function () {
        if (this.curPage < this.maxPage) {
            this.curPage++;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + (Pagination.pagesSize - 1));
        }
    },
    toggleArrow: function () {
        S('left-arrow');
        S('right-arrow');
        this.curPage == 1 && H('left-arrow');
        this.curPage == Math.ceil(this.data.length / this.pagesSize) && H('right-arrow');
    }

};

var onBack = function () {
    LMEPG.Intent.back();
};