var Controller = {

    pagination:null,
    adapter:null,
    /**
     * 初始化方法
     */
    init: function () {
        //设置背景
        View.renderBackground();
        Model.initButtons();
        LMEPG.BM.init('pre-page', Model.buttons)
        Model.sortPhone();
        this.pagination = new Pagination(Model.phoneList,3,3)
        this.pagination.setOnPageChangeCallback(View.onPageChangeCallback)
        this.pagination.setOnCreateItemHtmlCallback(View.onCreateItemHtmlCallback)
        this.pagination.setCurrentPage(0)
    },

    onClickListener: function (btn) {
        var that = Controller;
        switch (btn.id) {
            case 'pre-page':
                that.pagination.prevPage();
                break
            case 'next-page':
                that.pagination.nextPage();
                break
        }
    },
}

var View = {
    /**
     * 渲染背景
     */
    renderBackground: function () {
        G('indexBg').src = LMEPG.App.getAppRootPath()+'/Public/img/hd/OutbreakReport/V1/bg.jpg';
    },

    onPageChangeCallback: function (currentPage,pageCount,html) {
        G('page-number').innerHTML = (currentPage+1) + '/' + pageCount;
        G("tab-container").innerHTML = html;
    },

    onCreateItemHtmlCallback: function (currentPage,pageCount,position,item,row,column,pagePosition) {

        var left = column*370;
        var top = row*145;
        var phone = '';
        for (var i = 0; i < item.phone.length; i++) {
            var number = item.phone[i];
            phone += number;
            if(i+1 < item.phone.length){
                phone += '<br/>';
            }
        }
        var htm = '';
        htm = '<div id="phone-item '+pagePosition+'"+ class="phone-item" '
            + 'style="left: '+left+'px;top: '+top+'px;">'
            + '<p class="phone-item-title">'+item.name+'</p>'
            + '<div class="phone-item-content">'
            + '<div class="phone-item-left">热线<br/>电话</div>'
            + '<div class="phone-item-line"></div>'
            + '<div class="phone-item-right">'+phone+'</div>'
            + '</div>'
            + '</div>'
            + '</div>';
        return htm;
    },
}


var Model = {
    buttons: [],
    provinceName : '贵州省',

    phoneList:[{name:'北京市',phone:['01012345']},{name:'天津市',phone:['02288908890']},
        {name:'河北省',phone:['031112345']},{name:'山西省',phone:['035112320']},
        {name:'内蒙古自治区',phone:['4008089897转3']},{name:'辽宁省',phone:['02488900000']},
        {name:'吉林省',phone:['043112342']},{name:'黑龙江省',phone:['045112345']},
        {name:'上海市',phone:['02112345']},{name:'江苏省',phone:['02512345']},
        {name:'浙江省',phone:['057112345']},{name:'安徽省',phone:['055012345']},
        {name:'福建省',phone:['059162623959']},{name:'江西省',phone:['079188151622']},
        {name:'山东省',phone:['053167605180','053112345']},{name:'河南省',phone:['037112345']},
        {name:'湖北省',phone:['02712345转9']},{name:'湖南省',phone:['073112320']},
        {name:'广东省',phone:['02012345转9','省内区号+12345']},{name:'广西壮族自治区',phone:['077112345']},
        {name:'海南省',phone:['089812345']},{name:'重庆市',phone:['023114转7']},
        {name:'四川省',phone:['省内区号+12345']},{name:'贵州省',phone:['08519610096']},
        {name:'云南省',phone:['087164565224']},{name:'西藏自治区',phone:['08916598291']},
        {name:'陕西省',phone:['02912320','02987947208']},{name:'甘肃省',phone:['093112320']},
        {name:'青海省',phone:['097112345','09716102171']},{name:'宁夏回族自治区',phone:['09515112345','095112345']},
        {name:'新疆维吾尔自治区',phone:['099112320']},
        {name:'新疆生产建设兵团',phone:['099112320']},
    ],

    initButtons: function () {
        this.buttons.push({
            id: 'pre-page',
            name: 'pre-page',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: 'next-page',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage:LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/pre_page_normal.png',
            focusImage:LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/pre_page_focus.png',
            click: Controller.onClickListener
        }, {
            id: 'next-page',
            name: 'next-page',
            type: 'img',
            nextFocusLeft: 'pre-page',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage:LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/next_page_normal.png',
            focusImage:LMEPG.App.getAppRootPath() + '/Public/img/hd/OutbreakReport/V1/next_page_focus.png',
            click: Controller.onClickListener
        });
    },

    /**
     * 排序,当前省份的在首位
     */
    sortPhone:function () {
        if(RenderParam.carrierId === '440004' || RenderParam.carrierId === '440094'){
            Model.provinceName = '广东省';
        }else if(RenderParam.carrierId === '450094' || RenderParam.carrierId === '450092'){
            Model.provinceName = '广西壮族自治区';
        }else if(RenderParam.carrierId === '220094' || RenderParam.carrierId === '220095'){
            Model.provinceName = '辽宁省';
        }else if(RenderParam.carrierId === '370092' ){
            Model.provinceName = '山东省';
        }else if(RenderParam.carrierId === '630092'){
            Model.provinceName = '青海省';
        }else if(RenderParam.carrierId === '640092'){
            Model.provinceName = '宁夏回族自治区';
        }else if(RenderParam.carrierId === '220095' || RenderParam.carrierId === '220001'){
            Model.provinceName = '吉林省';
        }else if(RenderParam.carrierId === '320013' ){
            Model.provinceName = '浙江省';
        }else if(RenderParam.carrierId === '350092' ){
            Model.provinceName = '福建省';
        }else if(RenderParam.carrierId === '420092' ){
            Model.provinceName = '湖北省';
        }else if(RenderParam.carrierId === '460092' ){
            Model.provinceName = '海南省';
        }else if(RenderParam.carrierId === '651092' || RenderParam.carrierId === '650092' || RenderParam.carrierId === '12650092'){
            Model.provinceName = '新疆维吾尔自治区';
        }


        if(RenderParam.carrierId == '10000051' || RenderParam.carrierId == '0000051')
        {
            Model.provinceName = RenderParam.provinceName;
        }

        var that = this;
        var phone = null;
        for (var i = 0; i < that.phoneList.length; i++) {
            var item = that.phoneList[i];
            if(item.name == that.provinceName){
                that.phoneList.splice(i,1);
                phone = item;
                break;
            }
        }
        if(phone != null){
            that.phoneList.splice(0,0,phone);
        }
    }

}


function onBack() {
    LMEPG.Intent.back();
}