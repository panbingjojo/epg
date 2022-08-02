var Product = {
    buttons: [],
    goodsId: LMEPG.Func.getLocationString('goodsId'),
    playUrl:'',
    init: function () {
        this.createBtns();
        this.getGoodsInfo()
    },

    getGoodsInfo: function () {
        var postData = {
            "pageCurrent": 1,
            "pageNum": 99
        };
        LMEPG.ajax.postAPI("Goods/getGoodsInfo", postData, function (rsp) {
            if(rsp.result == '0'){
                var data = rsp.list;
                console.log(data);
                for(i=0;i<data.length;i++){
                    if(data[i].goods_id == Product.goodsId){
                        Product.initData(data[i]);
                    }else{
                        console.log("暂无商品信息");
                    }
                }
            }

        });
    },

    initData: function (data) {
        Product.playUrl = data.video_introduce;

        // 渲染页面
        G('goods-name').innerHTML = data.goods_name;
        G('goods-model').innerHTML = data.goods_model;
        G('price').innerHTML = (data.goods_price/100).toFixed(2);
        // G('price').innerHTML = parseInt(data.goods_price/100);
        G('goos-qrCode').src = RenderParam.fsUrl+data.goods_code_img;
        G('container').style.backgroundImage = 'url('+RenderParam.fsUrl + JSON.parse(data.goods_detail_img).url+')';
        if(data.goods_services){
            Show('goods-services');
            G('services-name').innerHTML = data.goods_services;
        }else{
            Hide('goods-services');
        }
    },

    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('productDetail');
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        return objCurrent;
    },

    /**
     * 跳转 - 使用说明
     */
    onClickExplain: function () {
        var videoInfo = {
            'sourceId': '650092-111',
            'videoUrl': Product.playUrl,
            'title': '使用说明',
            'type': '1',
            'userType': '0',
            'freeSeconds': '30',
            'entryType': 1,
            'entryTypeName': 'payOnline',
            'focusIdx': 'explain',
            'unionCode': ''
        };

        var objCurrent = Product.getCurrentPage();
        objCurrent.setParam('goodsId', Product.goodsId);

        var objPlayer = LMEPG.Intent.createIntent('player');
        objPlayer.setParam('userId', RenderParam.userId);
        objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));
        LMEPG.Intent.jump(objPlayer, objCurrent);
    },

    /**
     * 跳转 - 售后服务
     */
    onClickServices: function () {
        Hide('content-detail');
        Show('content-services');
    },

    createBtns: function () {
        if (RenderParam.carrierId == '420092') {
            G('explain').style.display = 'none';
            this.buttons.push({
                    id: 'services',
                    type: 'img',
                    backgroundImage: g_appRootPath + '/Public/img/hd/PayOnline/V1/btn_services.png',
                    focusImage: g_appRootPath + '/Public/img/hd/PayOnline/V1/btn_services_f.png',
                    click: this.onClickServices,
                }
            );
            LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'services', this.buttons, '', true);
        }else {
            this.buttons.push({
                    id: 'explain',
                    type: 'img',
                    nextFocusLeft: 'services',
                    nextFocusRight: 'services',
                    backgroundImage: g_appRootPath + '/Public/img/hd/PayOnline/V1/btn_explain.png',
                    focusImage: g_appRootPath + '/Public/img/hd/PayOnline/V1/btn_explain_f.png',
                    click: this.onClickExplain,
                },{
                    id: 'services',
                    type: 'img',
                    nextFocusLeft: 'explain',
                    nextFocusRight: 'explain',
                    backgroundImage: g_appRootPath + '/Public/img/hd/PayOnline/V1/btn_services.png',
                    focusImage: g_appRootPath + '/Public/img/hd/PayOnline/V1/btn_services_f.png',
                    click: this.onClickServices,
                }
            );


            LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'explain', this.buttons, '', true);
        }
    }
};

var onBack = function () {
    if(G('content-services').style.display == 'block'){
        Hide('content-services');
        Show('content-detail');
    }else{
        LMEPG.Intent.back();
    }
};