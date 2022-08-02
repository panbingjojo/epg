var isNoVaccination = ['640092', '420092', '650092']; //疫苗接种关闭地区
var boolean = false;
var Controller = {
    pagination: null,
    init: function () {
        if (RenderParam.carrierId === '440004') {
            boolean = true;
        }

        if(RenderParam.areaId === '204' && RenderParam.carrierId === "10000051"){
            RenderParam.hospitalDataPath = 'V410092'
        }

        if (isNoVaccination.indexOf(RenderParam.carrierId) >= 0 || boolean) {
            var that = this;
            that.pagination = new Pagination(Model.getHospitalList(), 2, 3)
            this.pagination.setOnCreateItemHtmlCallback(Controller.onCreateItemHtmlCallback)
            this.pagination.setCurrentPage(0);
            this.pagination.setCurrentFocusPosition(0);
            LMEPG.BM.init('focus-0', Model.buttons);
            return
        }
        var that = this;
        that.pagination = new Pagination(Model.getHospitalList(), 2, 3)
        this.pagination.setOnPageChangeCallback(Controller.onPageChangeCallback)
        this.pagination.setOnCreateItemHtmlCallback(Controller.onCreateItemHtmlCallback)
        this.pagination.setOnFocusChangeCallback(Controller.onFocusChangeCallback)
        this.pagination.setCurrentPage(0);
        this.pagination.setCurrentFocusPosition(0);
        LMEPG.BM.init('focus-0', Model.buttons);
    },

    onClickMoreInformation: function () {
        if (Model.currentView < 1) {
            if(RenderParam.carrierId === '450094' || RenderParam.carrierId === '450092' || RenderParam.carrierId === '450001'){
                View.showGuangxiMoreHospital()
                LMEPG.BM.requestFocus('level-2-container')
            }else {
                View.showMoreInformationPageView();
            }
        }
    },

    /**
     * 按钮被按下
     * @param btn
     */
    onClickListener: function (btn) {
        switch (btn.id) {
            case 'btn-detail':
                View.showInfoPageView(btn.data)
                break;
            default:
                // 跳转二级界面
                Controller.showDetailPageView(btn.data)
                break;
        }
    },

    /**
     * 显示页面详情
     * @param data
     */
    showDetailPageView: function (data) {
        View.showDetailPageView(data);
        var btn = {
            id: 'btn-detail',
            type: "img",
            name: '相关流程',
            focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/btn_order_progress.png',
            backgroundImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/btn_order_progress.png',
            click: Controller.onClickListener,
            beforeMoveChange: "",
            data: data
        };
        LMEPG.BM.addButtons(btn);
        LMEPG.BM.requestFocus('btn-detail');
    },


    /**
     * 按钮移动焦点
     * @param key
     * @param btn
     */
    onMoveChange: function (key, btn) {
        var that = Controller;
        that.pagination.onMoveChange(key)
        return false
    },

    /**
     * 页面切换回调
     * @param currentPage 当前第几页
     * @param pageCount 总的页数
     * @param html 当前页面的html代码字符串
     */
    onPageChangeCallback: function (currentPage, pageCount, html) {
        View.setPageNumber(currentPage, pageCount);
        View.setHospatilListPage(html);
        LMEPG.BM.init('focus-0', Model.buttons);
    },

    onFocusChangeCallback: function (position) {
        LMEPG.BM.requestFocus('focus-' + position);
    },

    /**
     * 按钮获得焦点
     * @param btn
     * @param focus
     */
    onFocusChange: function (btn, focus) {
        //跑马灯效果
        View.setItemTitleOnFocusChange(btn, focus);
    },

    onCreateItemHtmlCallback: function (currentPage, pageCount, position, item, row, column, pagePosition) {
        if (isNoVaccination.indexOf(RenderParam.carrierId) >= 0) {
            return View.getItem(item, position);
        } else {
            return View.getItemHtml(item, position);
        }
    },


}

var View = {
    isCreate: false,    //  是否已经创建

    setPageNumber: function (currentPage, pageCount) {
        G('page-number').innerHTML = (currentPage + 1) + '/' + pageCount;
        S('prev-arrow')
        S('next-arrow')
        if (currentPage >= pageCount - 1) {
            H('next-arrow')
        }
        if (currentPage <= 0) {
            H('prev-arrow')
        }
    },

    setHospatilListPage: function (html) {
        G("hospital-wrapper").innerHTML = html;
        Model.currentView = 0;
    },

    setItemTitleOnFocusChange: function (btn, focus) {
        var pElement = G('title-' + btn.position); //截取最后的角标位置
        var txt = G(btn.id).getAttribute('data-title');
        if (txt == undefined) {
            if (focus) {
                pElement.innerHTML = Util.marquee(txt, 14);
            } else {
                pElement.innerHTML = txt;
            }
        }
    },

    getItem: function (item, position) {
        if (!this.isCreate) {
            var level4Wrapper = document.createElement("div");
            var htm = '' + '</div>';
            htm += '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/more_Information_bg.jpg">';
            level4Wrapper.id = "level-2-container";
            document.body.appendChild(level4Wrapper);
            G("level-2-container").innerHTML = htm;
            Model.currentView = 0;
            this.isCreate = true;
        }
    },

    getItemHtml: function (item, position) {

        var htm = '';
        var imageUrl = LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/default_cover.png'
        if (!LMEPG.Func.isEmpty(item.img_url)) {
            if (item.hosl_id) {
                imageUrl = LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/' + RenderParam.hospitalDataPath + '/hospital/cover/' + item.img_url + '.png'
            } else {
                imageUrl = LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/more_Information.png'
            }
        }
        if (item.hosl_id) {

            htm = '<div class="hos-list"><img '
                + 'id=focus-' + position
                + ' data-title=' + item.hospital_name
                + ' src =' + imageUrl + '>'
                + '<p id="title-' + position + '">' + item.hospital_name + '</p></div>' + htm;
            Model.buttons.push({
                id: 'focus-' + position,
                position: position,
                type: 'div',
                click: Controller.onClickListener,
                focusChange: Controller.onFocusChange,
                focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/register_bg.png',
                backgroundImage: 'null',
                beforeMoveChange: Controller.onMoveChange,
                data: item
            });
        } else {
            htm = '<div class="hos-list"><img '
                + 'id=focus-' + position
                + ' data-title=' + item.hospital_name
                + ' src =' + imageUrl + '>'
                + '</div>' + htm;
            Model.buttons.push({
                id: 'focus-' + position,
                position: position,
                type: 'div',
                click: Controller.onClickMoreInformation,
                focusChange: Controller.onFocusChange,
                focusImage: LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/register_bg.png',
                backgroundImage: 'null',
                beforeMoveChange: Controller.onMoveChange,
                data: item
            });

        }

        return htm;
    },

    showDetailPageView: function (data) {
        var htm = '';
        var level2Wrapper = document.createElement('div');
        var imageUrl = LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/default_cover.png'
        if (!LMEPG.Func.isEmpty(data.img_url)) {

            imageUrl = LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/' + RenderParam.hospitalDataPath + '/hospital/cover/' + data.img_url + '.png'

        }
        htm += '</div>'
            + '<div id="image-border">'
            + '<img class="hos-pic"  src=' + imageUrl + '>'
            + '</div>';
        htm += '<div id="inner-wrapper">';
        var title = null;
        if (data.hospital_name.length >= 16) {
            title = LMEPG.Func.marquee2({txt: data.hospital_name, position: 16}, true, true);
        } else {
            title = data.hospital_name;
        }
        htm += '<p class="iframe-title">' + title;
        if (!LMEPG.Func.isEmpty(data.tel)) {
            htm += '<p class="iframe-tel">' + '电话号码：' + data.tel + '</p>';
        }
        if (!LMEPG.Func.isEmpty(data.open_time)) {
            if (!LMEPG.Func.isEmpty(data.tips)) {
                htm += '<p class="iframe-location">' + '采集时间：' + data.open_time + '<br>' + data.tips + '</p>';
            } else {
                htm += '<p class="iframe-location">' + '采集时间：' + data.open_time + '</p>';
            }
        }
        if (!LMEPG.Func.isEmpty(data.address)) {
            htm += '<p class="iframe-address" >' + '采集地点：' + data.address + '</p>';
        }
        if (!LMEPG.Func.isEmpty(data.qrcode_img_url)) {

            htm += '<img class="code"  src=' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/' + RenderParam.hospitalDataPath + '/hospital/qrcode/' + data.qrcode_img_url + '.png>';

            htm += '<p class="code-text">' + '请用手机扫描二维码' + '</p>';
            htm += '<p class="code-text—01">' + '进行预约挂号缴费' + '</p>';

        } else {
            if (!LMEPG.Func.isEmpty(data.order_type) && data.order_type == "phone") {
                htm += '<img class="code"  src=' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/list_phone_order.png>';
            } else {
                htm += '<img class="code"  src=' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/img_no_order.png>';
            }
        }
        htm += '<img class="level-2-btn" id="btn-detail" src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/btn_order_progress.png">';
        level2Wrapper.innerHTML = htm;
        level2Wrapper.id = 'level-2-container';
        document.body.appendChild(level2Wrapper);
        Model.currentView = 1;
    },

    showInfoPageView: function (data) {
        var level4Wrapper = document.createElement("div");
        var htm = '' + '</div>';
        htm += '<div id="level4Wrapper-title">' + '相关流程' + '</div>'
        htm += '<img class="level4Wrapper-title-line"  src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/title_line.png">';
        htm += '<div class="level4Wrapper01">';
        htm += '<div class="iframe-order_mode">预约方式：' + data.order_mode + '</div>';
        htm += '<div class="iframe-cost">' + '费用：' + data.cost + '</div>';
        htm += '<div class="iframe-report_time">' + '报告时间：' + data.report_time + '</div>';
        level4Wrapper.id = "level4Wrapper";
        document.body.appendChild(level4Wrapper);
        G("level4Wrapper").innerHTML = htm;
        Model.currentView = 2;
    },

    showMoreInformationPageView: function () {
        var level4Wrapper = document.createElement("div");
        var htm = '' + '</div>';
        htm += '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/common/more_Information_bg.jpg">';
        level4Wrapper.id = "level-2-container";
        document.body.appendChild(level4Wrapper);
        G("level-2-container").innerHTML = htm;
        // G("indexBg").innerHTML=htm
        if (boolean) {
            Model.currentView = 0;
        } else {
            Model.currentView = 1;
        }

    },

    gNowPage:1,
    maxPage:Math.ceil(hospitalListGuang.length / 10),

    showGuangxiMoreHospital:function () {
        var div = document.createElement('div')
        div.id = 'level-2-container'

        var html = '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/guangxiGg.png">' +
            '<div class="g-text" style="left:234px">机构名称</div>'+
            '<div class="g-text" style="left:687px">详细地址</div>'+
            '<div class="g-text" style="left:1040px">联系电话</div>'+'' +
            '<div class="g-content-area" id="g-content"></div>' +
            '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/g-arrow-up.png" class="g-arrow" id="g-arrow-up" style="top: 640px;display: none">'+
            '<img src="' + LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/g-arrow-down.png" class="g-arrow" id="g-arrow-down" style="top: 680px;display: none">'+
            '<div class="g-page"><span id="g-now-page">1</span>/'+Math.ceil(hospitalListGuang.length / 10)+'</div>'
        div.innerHTML = html

        document.body.appendChild(div)
        View.appendHospital()
        View.initGButton()
        View.showGArrow()
        Model.currentView = 1;
    },

    initGButton:function(){
        LMEPG.BM.addButtons([{
            id: 'level-2-container',
            type: 'div',
            click: '',
            focusChange: '',
            beforeMoveChange: View.turnPageForG,
        }])
    },

    showGArrow:function(){
        if(View.gNowPage === 1){
            G('g-arrow-up').style.display = 'none'
            G('g-arrow-down').style.display = 'block'
        }else if(View.gNowPage === Math.ceil(hospitalListGuang.length / 10)){
            G('g-arrow-up').style.display = 'block'
            G('g-arrow-down').style.display = 'none'
        }else {
            G('g-arrow-up').style.display = 'block'
            G('g-arrow-down').style.display = 'block'
        }
    },

    turnPageForG:function(dir){
        if(dir === 'left' || dir === 'right')
            return;

        if(dir === 'up'){
            if(View.gNowPage === 1)
                return;
            View.gNowPage--

        }else if(dir === 'down') {
            if(View.gNowPage === View.maxPage)
                return;
            View.gNowPage++
        }

        G('g-now-page').innerHTML =  View.gNowPage
        View.appendHospital()
        View.showGArrow()
    },

    appendHospital:function () {
        var html = ''
        G('g-content').innerHTML = ''
        for(var i=(View.gNowPage-1)*10; i<View.gNowPage*10; i++){
            if(!hospitalListGuang[i])
                break
            html+='<div class="g-hospital">' +
                '<div class="g-item-text">'+(hospitalListGuang[i].name.length>20 ?"<marquee scrollamount='10'  direction='left' behavior='scroll'>"+hospitalListGuang[i].name+"</marquee>":hospitalListGuang[i].name)+'</div>' +
                '<div class="g-item-text">'+(hospitalListGuang[i].address.length>20 ?"<marquee scrollamount='10'  direction='left' behavior='scroll'>"+hospitalListGuang[i].address+"</marquee>":hospitalListGuang[i].address)+'</div>' +
                '<div class="g-item-phone">'+hospitalListGuang[i].telNum+'</div>' +
                '</div>'
        }

        G('g-content').innerHTML =html
    }

}

var Model = {
    buttons: [],
    currentView: 0,
    //获取检测机构列表
    getHospitalList: function () {

        if (boolean) {
            // console.log(boolean())
            View.showMoreInformationPageView();

        } else {
            try {

                return hospitalList;
            }catch (e) {
                var img = document.createElement('img')
                img.src =  LMEPG.App.getAppRootPath() + "/Public/img/hd/OutbreakReport/common/more_Information_bg.jpg"
                img.style = 'position: absolute;left: 0;top: 0;width: 1280px;height: 720px;'
                document.body.appendChild(img)

                return  []
            }

        }
    }
    // getHospitalList: function () {
    //     return hospitalList;
    // }
};
var Util = {
    marquee: function (str, position) {
        if (str.length >= position) {
            return '<marquee>' + str + '</marquee>'
        }
        return str;
    },
};

/**
 * 返回确认
 */
function onBack() {
    switch (Model.currentView) {
        case 0:
            LMEPG.Intent.back();
            break;
        case 1:
            var level2Obj = G("level-2-container");
            document.body.removeChild(level2Obj);
            Model.currentView = 0;
            Controller.pagination.setCurrentFocusPosition(Controller.pagination.getCurrentFocusPosition());
            break;
        case 2:
            var level4Obj = G("level4Wrapper");
            document.body.removeChild(level4Obj);
            LMEPG.ButtonManager.requestFocus('btn-detail');
            Model.currentView = 1;
            break;
    }
}
