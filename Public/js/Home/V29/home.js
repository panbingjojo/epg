var contentList = RenderParam.homeConfigInfo.data.entry_list
console.log(contentList)
var tabIndex = parseInt(RenderParam.focusIndex) || 0
var focusId = RenderParam.focusId || 'position-1'

var tempHospitalInfo = null;

PageEvent.setCurrentPage =  function (){
    var objCurrent = LMEPG.Intent.createIntent('home');
    objCurrent.setParam('focusIndex',tabIndex)
    objCurrent.setParam('focusId',LMEPG.BM.getCurrentButton().id)
    objCurrent.setParam('scrollTop',Home.scroll)

    return objCurrent
}

var Home = {
    scroll:parseInt(RenderParam.scrollTop),
    scrollConfig:{
        'tab-1':[0,0,-525,-800,-1082],
        'tab-2':[0,-425],
        'tab-3':[0],
        'tab-4':[0,-375,-780,-1180,-1550],
        'tab-5':[0,-480,-765],
        'tab-6':[0],
        'tab-7':[0],
    },

    init:function () {
        lmInitGo()
        if(RenderParam.skin.sy){
            G('app').style.background = 'url('+RenderParam.fsUrl+RenderParam.skin.sy+')'
        }else {
            G('app').style.background = '#0F244C'
        }


        this.renderNav();
        this.renderContent(tabIndex);
        this.initBaseButton();
        this.getMarquee();

        G('main').style.marginTop = Home.scrollConfig['tab-'+ (tabIndex+1)][Home.scroll] +'px'
        G('tab-'+tabIndex).src =RenderParam.fsUrl+JSON.parse( RenderParam.navConfig[tabIndex].img_url).focus_out

        LMEPG.BM.init(focusId, []);
        LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], PageJump.jumpTestPage);
    },

    renderNav:function () {
        var html = ''
        var buttons = []
        RenderParam.navConfig.forEach(function (item,index) {
            var img = JSON.parse(item.img_url)
            html+='<img src="'+RenderParam.fsUrl+img.normal+'" class="tab" id="tab-'+index+'"/>'
            buttons.push({
                id:'tab-'+index,
                type: 'img',
                nextFocusLeft: 'tab-'+(index-1),
                nextFocusRight: 'tab-'+(index+1),
                nextFocusUp: 'search',
                backgroundImage: RenderParam.fsUrl+img.normal,
                focusImage: RenderParam.fsUrl+img.focus_in,
                selectImage:RenderParam.fsUrl+img.focus_out,
                click: '',
                focusChange: '',
                beforeMoveChange: function (dir,pre) {
                    if(dir === 'down' || dir === 'up'){
                        setTimeout(function () {
                            G(pre.id).src = pre.selectImage
                        },10)
                    }
                },
                moveChange:Home.navMove,
                nextFocusDown:'position-1',
                index:index
            })
        })


        LMEPG.BM.addButtons(buttons)
        G('nav-area').innerHTML = html
    },

    navMove:function(pre,cur,dir){
        tabIndex = cur.index
        if(Tab1.carousel){
            Tab1.carousel.stop()
        }
        if(dir === 'left' || dir === 'right'){
            Home.renderContent(cur.index)
            focusId = ''
        }
    },

    renderContent:function (index) {
        G('main').innerHTML = ''
        switch (index) {
            case 0:
                Tab1.renderContent()
                break
            case 1:
                Tab2.renderContent()
                break
            case 2:
                Tab3.renderContent()
                break
            case 3:
                Tab4.renderContent()
                break
            case 4:
                Tab5.renderContent()
                break
            case 5:
                Tab6.renderContent()
                break
            case 6:
                Tab7.renderContent()
                break
            default:
                console.log('info error')
        }
    },

    initBaseButton:function () {
        var buttons = [{
            id: 'vip',
            type: 'img',
            nextFocusLeft: 'search',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: "/Public/img/hd/Home/V29/vip.png",
            focusImage: "/Public/img/hd/Home/V29/vip-f.png",
            click: PageJump.jumpBuyVip,
            focusChange: '',
            beforeMoveChange: buttonLeave,
        },{
            id: 'search',
            type: 'img',
            nextFocusDown: '',
            nextFocusRight: 'vip',
            nextFocusUp: '',
            backgroundImage: "/Public/img/hd/Home/V29/search.png",
            focusImage: "/Public/img/hd/Home/V29/search-f.png",
            click: PageJump.jumpCommon,
            focusChange: '',
            beforeMoveChange: buttonLeave,
            page:'search',
        }]

        function buttonLeave(dir){
            if(dir === 'down'){
                LMEPG.BM.requestFocus('tab-'+tabIndex)
                return false
            }
        }

        LMEPG.BM.addButtons(buttons)
    },

    pageScroll:function (dir) {
        var key = 'tab-'+ (tabIndex+1)
        if(dir === 'down'){
            if(Home.scroll === Home.scrollConfig[key].length - 1)
                return;
            Home.scroll++
            G('main').style.marginTop = Home.scrollConfig[key][Home.scroll] +'px'
        }else if(dir === 'up'){
            if( Home.scroll === 0 )
                return
            Home.scroll--
            G('main').style.marginTop = Home.scrollConfig[key][Home.scroll] +'px'
        }
    },

    getMarquee:function () {
        LMEPG.ajax.postAPI('Common/getMarqueeContent', {}, function (data) {
            G('text').innerHTML = data.content
            LMEPG.UI.Marquee.start('text',5)
        });
    }
}

var Tab1 = {
    data:null,
    carousel:null,

    renderContent:function () {
        var html = ''
        html+=Tab1.renderCarousel()
        html+=Tab1.renderArea1()
        html+=Tab1.renderArea2()
        html+=Tab1.renderArea3()
        html+=Tab1.renderArea4()

        G('main').innerHTML = html

        if(Tab1.carousel){
            Tab1.carousel.start()
        }
    },

    renderCarousel:function () {
        var icon1 =contentList[0].item_data[0].inner_parameters?JSON.parse(contentList[0].item_data[0].inner_parameters).cornermark.img_url:''
        var icon2 =contentList[0].item_data[1].inner_parameters?JSON.parse(contentList[0].item_data[1].inner_parameters).cornermark.img_url:''

        var html = '<div><div class="carousel-area" id="position-1" style="float: left;">'
        html+='<img src="'+RenderParam.fsUrl+contentList[0].item_data[0].img_url+'" style="width: 570px;height: 230px"><img src="'+(icon1?RenderParam.fsUrl+icon1:'')+'" class="carousel-icon">'


        html+='</div>'

        html+='<div style="float: left;" class="carousel-area" id="position-spe-2">' +
            '<img src="'+RenderParam.fsUrl+contentList[0].item_data[1].img_url+' "style="width: 570px;height: 230px"><img src="'+(icon2?RenderParam.fsUrl+icon2:'')+'" class="carousel-icon">'



        html+= '</div><div style="clear: both"></div></div>'

        LMEPG.BM.addButtons([{
            id: 'position-1',
            type: 'div',
            nextFocusDown: 'position-2',
            nextFocusUp: 'tab-0',
            nextFocusRight: 'position-spe-2',
            backgroundImage: " ",
            focusImage: "/Public/img/hd/Home/V29/choose-3.png",
            click: Tab1.carouselClick,
            focusChange: '',
            beforeMoveChange: Home.pageScroll,
            index:0
        },{
            id: 'position-spe-2',
            type: 'div',
            nextFocusDown: 'position-2',
            nextFocusUp: 'tab-0',
            nextFocusLeft: 'position-1',
            backgroundImage: " ",
            focusImage: "/Public/img/hd/Home/V29/choose-3.png",
            click: Tab1.carouselClick,
            focusChange: '',
            beforeMoveChange: Home.pageScroll,
            index:1
        }])

        return html
    },

    carouselClick:function(btn){
        PageEvent.click({
            cPosition:11,
            cIndex:btn.index
        })
    },

    renderArea1:function () {
        var buttons = []
        var html = '<div class="func-area" style="margin-top: 13px">' +
            '<div class="area-heard">' +
                '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
                '<div class="area-title">就医服务</div>'+
            '</div>'+
            '<div style="margin-top: 20px">'

        contentList[1].item_data.forEach(function (item,index) {
            var icon =item.inner_parameters?JSON.parse(item.inner_parameters).cornermark.img_url:''

            html+='<div class="tab1-item" id="position-'+(2+index)+'">' +
                    '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%">'

            if(icon){
                html+='<img src="'+RenderParam.fsUrl+icon+'" class="pic-icon">'
            }

            html+='</div>'

            buttons.push({
                id: 'position-'+(2+index),
                type: 'div',
                nextFocusLeft:index === 0? '':'position-'+(1+index),
                nextFocusRight:index === contentList[1].item_data.length-1? '': 'position-'+(3+index),
                nextFocusDown: 'position-'+(5+index),
                nextFocusUp: 'position-1',
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Home/V29/choose-1.png",
                click:index===1?function () {
                   PageJump.jumpCommon('eye-hospital')
                }:PageEvent.click,
                focusChange: '',
                beforeMoveChange: Home.pageScroll,
                cPosition:12,
                cIndex:index
            })
        })

        html+='</div></div>'

        LMEPG.BM.addButtons(buttons)

        return html
    },

    renderArea2:function () {
        var buttons = []
        var html = '<div class="func-area" style="margin-top: 13px">' +
            '<div class="area-heard">' +
                '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
                '<div class="area-title">身体数据智能检测</div>'+
            '</div>'+
            '<div style="margin-top: 20px">'

        contentList[2].item_data.forEach(function (item,index) {
            var icon =item.inner_parameters?JSON.parse(item.inner_parameters).cornermark.img_url:'';

            html+='<div class="tab1-item" id="position-'+(5+index)+'">' +
                    '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%">'

            if(icon){
                html+='<img src="'+RenderParam.fsUrl+icon+'" class="pic-icon">'
            }

            html+='</div>'

            buttons.push({
                id: 'position-'+(5+index),
                type: 'div',
                nextFocusLeft:index === 0?'':'position-'+(4+index),
                nextFocusRight:index ===  contentList[2].item_data.length-1?'':'position-'+(6+index),
                nextFocusDown: 'position-'+(8+index),
                nextFocusUp: 'position-'+(2+index),
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Home/V29/choose-1.png",
                click: PageEvent.click,
                focusChange: '',
                beforeMoveChange: Home.pageScroll,
                cPosition:13,
                cIndex:index
            })
        })


        html+='</div></div>'
        LMEPG.BM.addButtons(buttons)

        return html
    },

    renderArea3:function () {
        var buttons = []
        var html = '<div class="func-area" style="margin-top: 13px">' +
            '<div class="area-heard">' +
                '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
                '<div class="area-title">中西医慢病管理中心</div>'+
            '</div>'+
            '<div style="margin-top: 20px">'

        contentList[3].item_data.forEach(function (item,index) {
            var icon = item.inner_parameters?JSON.parse(item.inner_parameters).cornermark.img_url:'';

            html+='<div class="tab1-item" id="position-'+(8+index)+'">' +
                    '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%">'

            if(icon){
                html+='<img src="'+RenderParam.fsUrl+icon+'" class="pic-icon">'
            }

            html+='</div>'

            buttons.push({
                id: 'position-'+(8+index),
                type: 'div',
                nextFocusLeft:index === 0?'':'position-'+(7+index),
                nextFocusRight:index === contentList[3].item_data.length-1?'':'position-'+(9+index),
                nextFocusDown: 'position-'+(11+index),
                nextFocusUp: 'position-'+(5+index),
                backgroundImage: " ",
                focusImage:index === 0? "/Public/img/hd/Home/V29/choose-1.png":"/Public/img/hd/Home/V29/choose-2.png",
                click: PageEvent.click,
                focusChange: '',
                beforeMoveChange: Home.pageScroll,
                cPosition:14,
                cIndex:index
            })
        })

        html+='</div></div>'
        LMEPG.BM.addButtons(buttons)

        return html
    },

    renderArea4:function () {
        var buttons = []
        var html = '<div class="func-area" style="margin-top: 13px">' +
            '<div class="area-heard">' +
                '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
                '<div class="area-title">健康资讯</div>'+
            '</div>'+
            '<div style="margin-top: 20px">'

        contentList[4].item_data.forEach(function (item,index) {

            var icon =item.inner_parameters?JSON.parse(item.inner_parameters).cornermark.img_url:'';

            html+='<div class="tab1-item" id="position-'+(11+index)+'">' +
                    '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%">'

            if(icon){
                html+='<img src="'+RenderParam.fsUrl+icon+'" class="pic-icon">'
            }

            html+='</div>'

            buttons.push({
                id: 'position-'+(11+index),
                type: 'div',
                nextFocusLeft:index === 0?'':'position-'+(10+index),
                nextFocusRight:index === contentList[4].item_data.length-1?'':'position-'+(12+index),
                nextFocusDown: index === contentList[4].item_data.length-1?'position-17':'position-'+(14+index),
                nextFocusUp: 'position-'+(8+index),
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Home/V29/choose-1.png",
                click: PageEvent.click,
                focusChange: '',
                beforeMoveChange: Home.pageScroll,
                cPosition:15,
                cIndex:index
            })
        })

        html+='<div style="margin-top: -5px">'
        contentList[5].item_data.forEach(function (item,index) {
            var icon = item.inner_parameters?JSON.parse(item.inner_parameters).cornermark.img_url:'';
            html+='<div class="'+(index === 0?"tab1-item":"tab1-item-spe")+'" id="position-'+(14+index)+'">' +
                    '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%">'

            if(icon){
                html+='<img src="'+RenderParam.fsUrl+icon+'" class="pic-icon">'
            }

            html+='</div>'

            buttons.push({
                id: 'position-'+(14+index),
                type: 'div',
                nextFocusLeft:index === 0?'':'position-'+(13+index),
                nextFocusRight:index === contentList[5].item_data.length-1?'':'position-'+(15+index),
                nextFocusDown: '',
                nextFocusUp: index === 0?'position-11':index>=1 && index<=2?'position-12':'position-13',
                backgroundImage: " ",
                focusImage: index ===0?"/Public/img/hd/Home/V29/choose-1.png":"/Public/img/hd/Home/V29/choose-2.png",
                click: PageEvent.click,
                focusChange: '',
                beforeMoveChange: '',
                cPosition:16,
                cIndex:index
            })

        })

        html+='</div></div></div>'

        html+='<div class="back-text">按“返回”键回到顶部</div>'
        LMEPG.BM.addButtons(buttons)

        return html
    }
}

var Tab2 = {
    docData:[],
    exData:[],

    renderContent:function () {
        var html = '';
        LMEPG.UI.showWaitingDialog();
        Tab2.getDoctorList(function (list) {
            Tab2.docData = list
            Tab2.getExList(function (data) {
                Tab2.exData = data
                LMEPG.UI.dismissWaitingDialog();
                html+= Tab2.renderDoc()
                html+= Tab2.renderEx()

                G('main').innerHTML = html

                LMEPG.BM.requestFocus(focusId)
            })

        })

    },

    renderDoc:function () {
        var buttons = [];
        var html = '<div class="func-area" style="margin-top: 0">' +
            '<div class="area-heard">' +
                '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
                '<div class="area-title">金牌医生推荐</div>'+
                '<img src="/Public/img/hd/Home/V29/more-doc.png" class="tab2-more" id="doc-more">'+
            '</div>'+
            '<div class="space">'

        buttons.push({
            id: "doc-more",
            type: 'img',
            nextFocusLeft:'',
            nextFocusRight:'',
            nextFocusDown: 'position-1',
            nextFocusUp: 'tab-1',
            backgroundImage:"/Public/img/hd/Home/V29/more-doc.png",
            focusImage: "/Public/img/hd/Home/V29/more-doc-f.png",
            click: PageJump.jumpVideoVisitHome,
            focusChange:'',
            beforeMoveChange: '',
        })
            Tab2.docData.forEach(function (item,index) {
                var obj = Tab2.transformStatus({
                    onlineState:item.online_state,
                    isFakeBusy:item.is_fake_busy,
                    isIMInquiry: item.is_im_inquiry,
                })

                html+='<div class="doc-item" id="position-'+(index+1)+'">' +
                    '<div class="doctor-status" style="background: '+obj.color+'">' +
                        '<div style="overflow: hidden;height: 170px">' +
                            '<img src='+Tab2.getDocAvatar(item.doc_id, item.avatar_url, RenderParam.carrierId)+' class="doc-avatar" onerror="this.src=\'/Public/img/Common/default.png\'">'+
                        '</div>'+
                        '<div class="statue-text">'+obj.text+'</div>'+
                    '</div>'+
                    '<div style="font-size: 28px;margin-top: 10px">'+item.doc_name+'</div>'+
                    '<div style="font-size: 20px">'+item.job_title+'</div>'+
                    '<div style="font-size: 20px">'+(item.department || '暂无科室')+'</div>'+
                    '<div style="font-size: 20px">问诊量：'+item.inquiry_num+'</div>'+
                    '</div>'

                buttons.push({
                    id: "position-"+(index+1),
                    type: 'div',
                    nextFocusLeft:index === 0?'':'position-'+(index),
                    nextFocusRight:index === Tab2.docData.length-1?'':'position-'+(2+index),
                    nextFocusDown: 'position-6',
                    nextFocusUp: 'doc-more',
                    backgroundImage:"/Public/img/hd/Home/V29/bg-doc.png",
                    focusImage: "/Public/img/hd/Home/V29/bg-doc-f.png",
                    click: Tab2.toDoctorDetail,
                    focusChange: Tab2.changeTextStyle,
                    beforeMoveChange: Home.pageScroll,
                    docId:item.doc_id
                })
            })


        html+='</div></div>'
        LMEPG.BM.addButtons(buttons)

        return html
    },

    transformStatus:function(type){
        var tempOnlineFlag = {
            color : '#808080',
            text :'离线'
        };//默认离线状态

        if(typeof type.isFakeBusy != 'undefined' && type.isFakeBusy === '1') {

            tempOnlineFlag.color = '#E55C73';
            tempOnlineFlag.text = '忙碌'
        } else {
            if (type.onlineState === "3" || (type.onlineState === "0" && type.isIMInquiry === "1")) { //在线
                tempOnlineFlag.color = '#59B377';
                tempOnlineFlag.text = '在线'

            } else if (type.onlineState === "2" || type.onlineState === "-1" || type.onlineState === "-2") {  //忙碌
                tempOnlineFlag.color = '#E55C73';
                tempOnlineFlag.text = '忙碌'

            } else if (type.onlineState === "0" || type.onlineState === "1") {  //离线
                tempOnlineFlag.color = '#808080';
                tempOnlineFlag.text = '离线'
            }
        }
        return tempOnlineFlag;
    },

    renderEx:function () {
        var buttons = []
        var html = '<div class="func-area">' +
            '<div class="area-heard">' +
                '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
                '<div class="area-title">权威专家预约</div>'+
                '<img src="/Public/img/hd/Home/V29/more-ex.png" class="tab2-more" id="ex-more" >'+
            '</div>'+
            '<div class="space">'

        buttons.push({
            id: "ex-more",
            type: 'img',
            nextFocusLeft:'',
            nextFocusRight:'',
            nextFocusDown: 'position-6',
            nextFocusUp: 'position-1',
            backgroundImage:"/Public/img/hd/Home/V29/more-ex.png",
            focusImage: "/Public/img/hd/Home/V29/more-ex-f.png",
            click: PageJump.jumpExpertConsultation,
            focusChange:'',
            beforeMoveChange: Home.pageScroll,
        })

        console.log( Tab2.exData)

        Tab2.exData.forEach(function (item,index) {
            html+='<div class="ex-item" id="position-'+(index+6)+'">' +
                '<img src='+Tab2.getDocAvatar(item.doctor_user_id, item.doctor_avatar, RenderParam.carrierId,true)+' class="ex-avatar" >'+
                '<div style="display: inline-block;margin-top: 25px;vertical-align: top">' +
                    '<div style="font-size: 28px">'+item.doctor_name+'</div>' +
                    '<div style="font-size: 20px;margin-top: 10px">'+item.doctor_hospital_name+'</div>'+
                    '<div style="font-size: 20px">'+item.doctor_department_name+'</div>'+
                    '<div style="font-size: 20px">3天内出诊</div>'+
                '</div>'+
                '</div>'

            buttons.push({
                id: "position-"+(index+6),
                type: 'div',
                nextFocusLeft:index === 0?'':'position-'+(index+5),
                nextFocusRight:'position-'+(7+index),
                nextFocusDown: 'position-'+(index+9),
                nextFocusUp: index<3? 'ex-more':'position-'+(index+3),
                backgroundImage:"/Public/img/hd/Home/V29/bg-ex.png",
                focusImage: "/Public/img/hd/Home/V29/bg-ex-f.png",
                click: Tab2.toExDetail,
                focusChange: Tab2.changeTextStyle,
                exCId:item.clinic_id,
                exId:item.doctor_user_id
            })
        })

        html+= '</div></div>'
        html+='<div class="back-text">按“返回”键回到顶部</div>'
        LMEPG.BM.addButtons(buttons)

        return html
    },

    getDocAvatar:function(doctorId, avatarUrl, carrierID,type){
        var head = {
            func: "getDoctorHeadImage",
            carrierId: carrierID,
            areaCode: "",
        };
        var json = {
            doctorId: doctorId,
            avatarUrl: avatarUrl
        };
        return (type?RenderParam.expertUrl:RenderParam.cwsHlwyyUrl) + '?head='+ JSON.stringify(head) + '&json=' + JSON.stringify(json);
    },

    toDoctorDetail:function(btn){
        var currentObj = PageEvent.setCurrentPage();
        var jumpAgreementObj = LMEPG.Intent.createIntent('doctorDetails');
        jumpAgreementObj.setParam('doctorIndex', btn.docId); // 传递点击具体那个医生的索引
        LMEPG.Intent.jump(jumpAgreementObj, currentObj);
    },

    toExDetail:function(btn){
        var currentObj = PageEvent.setCurrentPage();
        var jumpAgreementObj = LMEPG.Intent.createIntent('expertDetail');
        jumpAgreementObj.setParam('doctorIndex', btn.exId); // 传递点击具体那个医生的索引
        jumpAgreementObj.setParam('clinic', btn.exCId);
        LMEPG.Intent.jump(jumpAgreementObj, currentObj);
    },

    changeTextStyle:function(btn, hasFocus){
        if(hasFocus){
            G(btn.id).style.color = '#333'
        }else {
            G(btn.id).style.color = '#fff'
        }
    },

    getDoctorList:function (callback) {
        LMEPG.ajax.postAPI('Doctor/getDoctorList', {
            deptId: '',
            deptIndex: 0,
            page: 1,
            pageSize: 5
        }, function (data) {
            if (data.result && data.result.code === '0') {
                callback(data.result.list);
            }else {
                LMEPG.UI.showToast('获取医生列表失败！');
            }

        })
    },

    getExList:function (callback) {
        LMEPG.ajax.postAPI('Expert/getDoctorList', {
            'departmentID': '',
            'limitBegin': 0,
            'limitNum': 6
        }, function (rsp) {
            if (rsp.code === '0') {
                callback(rsp.data)
            }else {
                LMEPG.UI.showToast('拉取医生列表请求失败');
            }

        })
    }
}

var Tab3 = {
    hospitalList : [],
    showList:[],
    page:0,

    renderContent:function () {
        function getHtmlStr() {
            Tab3.showList = Tab3.hospitalList.slice(Tab3.page*6,(Tab3.page+1)*6)

            var canLeft = Tab3.page === 0? 'none':'block'
            var canRight = (Tab3.page+1)*6>=Tab3.hospitalList.length?'none':'block'

            var html =
                '<img src="/Public/img/hd/Home/V29/left-arrow.png" class="left-arrow" style="display:'+canLeft+'"/>' +
                '<img src="/Public/img/hd/Home/V29/right-arrow.png" class="right-arrow" style="display: '+canRight+'">';

            html+=Tab3.renderHospitalList()
            html+=Tab3.renderPage()

            return html
        }

        if(Tab3.hospitalList.length === 0){
            Tab3.getHospitalList(function (data) {
                Tab3.hospitalList = data
                G('main').innerHTML = getHtmlStr()
                LMEPG.BM.requestFocus(focusId)
            })
        }else {
            G('main').innerHTML = getHtmlStr()
        }

    },

    renderHospitalList:function () {
        var html = '<div class="hospital-area">';
        var buttons =[]

        Tab3.showList.forEach(function (item,index) {
            html+= '<div class="hospital-item" id="position-'+(index+1)+'">' +
                    '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 340px;height: 207px">' +
                    '<div class="hospital-name">'+item.hospital_name+'</div>'+
                '</div>'

            buttons.push({
                id: "position-"+(index+1),
                type: 'div',
                nextFocusLeft:'position-'+(index),
                nextFocusRight:'position-'+(2+index),
                nextFocusDown: 'position-'+(4+index),
                nextFocusUp: index<3?'tab-2':'position-'+(index-2),
                backgroundImage:" ",
                focusImage: "/Public/img/hd/Home/V29/hospital-f.png",
                click: Tab3.popHospitalInfo,
                focusChange: Tab3.changeStyle,
                beforeMoveChange: Tab3.turnPage,
                data:item
            })
        })

        html+= '</div>'
        LMEPG.BM.addButtons(buttons)

        return html
    },

    renderPage:function(){
        var total = Math.ceil(Tab3.hospitalList.length / 6)
        return  '<div class="page">'+(Tab3.page+1)+'/'+total+'</div>'
    },

    turnPage:function(dir,btn){
        if(dir === 'left'){
            if(Tab3.page === 0 ) return;
            if(btn.id === 'position-1' || btn.id === 'position-4'){
                Tab3.page--
                Tab3.renderContent()
                setTimeout(function () {
                    LMEPG.BM.requestFocus('position-3')
                })

            }
        }else if(dir === 'right'){
            if((Tab3.page+1)*6>=Tab3.hospitalList.length) return;
            if(btn.id === 'position-3' || btn.id === 'position-6'){
                Tab3.page ++
                Tab3.renderContent()
                setTimeout(function () {
                    LMEPG.BM.requestFocus('position-1')
                })

            }
        }else if(dir === 'down'){
            if(!G(btn.nextFocusDown) && Tab3.showList.length > 3){
                LMEPG.BM.requestFocus('position-'+Tab3.showList.length)
            }
        }
    },

    popHospitalInfo:function (btn) {
        var data = btn.data
        tempHospitalInfo = btn.data
        if(data.hospital_code === "QH001"){
            var objCurrent = PageEvent.setCurrentPage();
            var objDialog = LMEPG.Intent.createIntent("eye-hospital");
            LMEPG.Intent.jump(objDialog, objCurrent);
        }else if (data.hospital_code === 'QH013'){
            var objCurrents = PageEvent.setCurrentPage();
            var objAppoint = LMEPG.Intent.createIntent("qinghai-index");
            LMEPG.Intent.jump(objAppoint, objCurrents);
        }else {
            focusId = LMEPG.BM.getCurrentButton().id
            Level_2.init(data)
        }

    },
    
    changeStyle:function(btn,hasFocus){
        var ele = G(btn.id).children
        if(hasFocus){
            ele[1].style.background = '#0099E6'
        }else {
            ele[1].style.background = 'rgba(0,0,0,0.8)'
        }
    },

    getHospitalList:function (callback) {
        LMEPG.ajax.postAPI("AppointmentRegister/getHospitalListInfo", "", function (rsp) {
            try {
                if (rsp.result === 0) {
                    callback(rsp.list)
                } else {
                    LMEPG.UI.showToast("数据拉取失败:" + rsp);
                }
            } catch (e) {
                LMEPG.UI.showToast("数据拉取失败:" + e);
            }
        });
    },


}

var Tab4 = {
    titleListLocal: [
        {name:'现存确诊',color:'#E55C73'},
        {name:'新增本土',color:'#4CA6FF'},
        {name:'新增境外',color:'#4CA6FF'},
        {name:'现有确诊',color:'#E55C73'},
        {name:'累计确诊',color:'#E55C73'},
        {name:'累计治愈',color:'#FF7F00'},
    ],

    titleList : [
        {name:'现存确诊',color:'#E55C73'},
        {name:'无症状',color:'#4CA6FF'},
        {name:'现存疑似',color:'#4CA6FF'},
        {name:'现存重症',color:'#E55C73'},
        {name:'累计确诊',color:'#E55C73'},
        {name:'境外输入',color:'#FF7F00'},
        {name:'累计治愈',color:'#73E699'},
        {name:'累计死亡',color:'#999999'}
    ],

    titleList2 : [
        {name:'现存确诊',color:'#E55C73'},
        {name:'累计死亡',color:'#999999'},
        {name:'累计治愈',color:'#73E699'},
        {name:'累计确诊',color:'#E55C73'},
        {name:'病死率',color:'#999999'},
        {name:'治愈率',color:'#73E699'},
    ],
    data:null,
    reportData:null,
    localData:null,

    renderContent:function () {

        function getHtmlStr() {
            var html=''

            html+=Tab4.renderLocalSituation()
            html+=Tab4.renderInternalSituation()
            html+=Tab4.renderAbroadSituation()
            html+=Tab4.renderReport()
            html+=Tab4.renderKnowledgeArea()

            return html
        }

        if(!Tab4.data || !Tab4.reportData){
            LMEPG.UI.showWaitingDialog();
            Tab4.getSituationData(function (data) {
                Tab4.getLocalData(function (local) {
                    Tab4.data = data;
                    console.log(local)
                    Tab4.localData = local
                    Tab4.getReportData(function (res) {
                        Tab4.reportData = res.data[0]
                        LMEPG.UI.dismissWaitingDialog();
                        G('main').innerHTML = getHtmlStr()
                        LMEPG.BM.requestFocus(focusId)
                    })
                })

            })
        }else {
            G('main').innerHTML = getHtmlStr()
        }

    },

    renderLocalSituation:function(){
        var keyList = [
            {num:'confirm_add'},
            {num:'confirm_local'},
            {num:'confirm_overseas'},
            {num:'confirm_now'},
            {num:'confirm'},
            {num:'cure'},
        ]

        var date = new Date()
        var month = date.getMonth()+1
        var day = date.getDate()
        var time = date.getFullYear() + '-' + (month<10?('0'+ month) : month) + '-' + (day<10?('0'+ day) : day)

        var html = '<div class="func-area" style="margin-top: 0">' +
            '<div class="area-heard">' +
            '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
            '<div class="area-title">青海疫情<span class="now-time">数据更新至: '+time+'</span></div>'+
            '<img src="/Public/img/hd/Home/V29/more-info.png" class="tab2-more" id="position-1" >'+
            '</div>'+
            '<div style="margin-top: 10px">'
        html+='<div class="situation-left"><img style="width: 100%;height: 100%" src="'+g_appRootPath+'/Public/img/hd/Home/V29/qinghai-map.png"></div>'
        html+= '<div class="situation-right">'

        Tab4.titleListLocal.forEach(function (item,index) {
            html+=
                '<div class="situation-local-box">' +
                '<div>'+item.name+'</div>' +
                '<div style="font-size:45px;color: '+item.color+'">'+Tab4.localData[keyList[index].num]+'</div>'+
                '</div>'
        })

        html+='</div><div style="clear: both"></div></div></div>'

        LMEPG.BM.addButtons([{
            id: 'position-1',
            type: 'img',
            nextFocusDown: 'position-2',
            nextFocusUp: 'tab-3',
            backgroundImage: "/Public/img/hd/Home/V29/more-info.png",
            focusImage: "/Public/img/hd/Home/V29/more-info-f.png",
            click: Tab4.toLocalData,
            focusChange: '',
            beforeMoveChange: Home.pageScroll,
            index:'0'
        }])

        return html
    },

    renderInternalSituation:function () {
        var keyList = [
            {num:'confirm',float:'confirm_add'},
            {num:'asymptomatic',float:'asymptomatic_add'},
            {num:'suspect',float:'suspect_add'},
            {num:'severe',float:'severe_add'},
            {num:'confirm',float:'confirm_add'},
            {num:'overseas',float:'overseas_add'},
            {num:'cure',float:'cure_add'},
            {num:'died',float:'died_add'}
            ]

        var html = '<div class="func-area" style="margin-top: 10px">' +
            '<div class="area-heard">' +
            '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
            '<div class="area-title">国内疫情<span class="now-time">数据更新至: '+Tab4.data.main[0].last_msg_dt+'</span></div>'+
            '<img src="/Public/img/hd/Home/V29/more-info.png" class="tab2-more" id="position-2" >'+
            '</div>'+
            '<div style="margin-top: 10px">'

        html+='<div class="situation-left"><img style="width: 100%;height: 100%" src='+Tab4.buildMapAvatarUrl(RenderParam.mapTime,Tab4.data.map_url)+' ></div>'

        html+= '<div class="situation-right">'

        var data = Tab4.data.main[0]
        var dif = data.confirm - data.died - data.cure
        var difAdd = (((data.confirm_add) - (data.died_add) - (data.cure_add)) >= 0 ? ((data.confirm_add) - (data.died_add) - (data.cure_add)) : ((data.confirm_add) - (data.died_add) - (data.cure_add)));

            Tab4.titleList.forEach(function (item,index) {
                var num = index === 0? dif :Tab4.data.main[0][keyList[index].num]

                var float = index === 0? difAdd : Tab4.data.main[0][keyList[index].float]

                html+= '<div class="situation-box">' +
                        '<div>'+item.name+'</div>' +
                        '<div style="font-size:36px;color: '+item.color+'">'+num+'</div>'+
                        '<div>较上日<span style="color: '+item.color+'">'+(float>=0?'+':'')+float+'</span></div>'+
                    '</div>'
            })

        html+='</div><div style="clear: both"></div></div></div>'

        LMEPG.BM.addButtons([{
            id: 'position-2',
            type: 'img',
            nextFocusDown: 'position-3',
            nextFocusUp: 'position-1',
            backgroundImage: "/Public/img/hd/Home/V29/more-info.png",
            focusImage: "/Public/img/hd/Home/V29/more-info-f.png",
            click: Tab4.toAreaPage,
            focusChange: '',
            beforeMoveChange: Home.pageScroll,
            index:'0'
        }])

        return html
    },

    renderAbroadSituation:function () {
        var keyList = [
            {num:'confirm',float:'confirm_add'},
            {num:'died',float:'died_add'},
            {num:'cure',float:'cure_add'},
            {num:'confirm',float:'confirm_add'},
            {num:'confirm',float:'confirm_add'},
            {num:'confirm',float:'confirm_add'},
        ]

        var html = '<div class="func-area">' +
            '<div class="area-heard">' +
            '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
            '<div class="area-title">国外疫情<span class="now-time">数据更新至: '+Tab4.data.main[0].last_msg_dt+'</span></div>'+
            '<img src="/Public/img/hd/Home/V29/more-info.png" class="tab2-more" id="position-3">'+
            '</div>'+
            '<div style="margin-top: 10px">'

        html+='<div class="situation-left"><img style="width: 100%;height: 100%" src='+Tab4.buildMapAvatarUrl(RenderParam.mapTime+1,Tab4.data.overseas_url)+' >'

        html+= '</div><div class="situation-right">'

        Tab4.titleList2.forEach(function (item,index) {
            var num = 0;
            var float = 0;

            if(index === 0){
                num = Tab4.data.overseas[0].confirm-Tab4.data.overseas[0].cure
                float =Tab4.data.overseas[0].confirm_add -Tab4.data.overseas[0].cure_add
            }else if(index === 4){
                num = parseInt(Tab4.data.overseas[0].died / Tab4.data.overseas[0].confirm * 100)+'%'
                float = 0
            }else if(index === 5){
                num = parseInt(Tab4.data.overseas[0].cure / Tab4.data.overseas[0].confirm * 100)+'%'
                float = 0
            }else {
                num = Tab4.data.overseas[0][keyList[index].num]
                float = Tab4.data.overseas[0][keyList[index].float]
            }


            html+= '<div class="situation-box-1">' +
                '<div>'+item.name+'</div>' +
                '<div style="font-size:36px;color: '+item.color+'">'+num+'</div>'+
                '<div style="visibility:'+(index>3?"hidden":"visible")+'">较上日<span style="color: '+item.color+'">'+(float>=0?'+':'')+float+'</span></div>'+
                '</div>'
        })

        html+='</div><div style="clear: both"></div></div></div>'

        LMEPG.BM.addButtons([{
            id: 'position-3',
            type: 'img',
            nextFocusDown: 'position-4',
            nextFocusUp: 'position-2',
            backgroundImage: "/Public/img/hd/Home/V29/more-info.png",
            focusImage: "/Public/img/hd/Home/V29/more-info-f.png",
            click: Tab4.toAreaPage,
            focusChange: '',
            beforeMoveChange: Home.pageScroll,
            index:'1'
        }])

        return html

    },

    renderReport:function () {
        var html = '<div class="func-area">' +
            '<div class="area-heard">' +
            '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
            '<div class="area-title">实时资讯</div>'+
            '<img src="/Public/img/hd/Home/V29/more-news.png" class="tab2-more" id="position-4">'+
            '</div>'+
            '<div style="margin-top: 10px">'

        html+='<div class="news-box" id="news-box">' +
                '<div class="report-title">'+Tab4.reportData.title+'</div>' +
                '<div style="margin-top: 20px;line-height: 2;padding: 20px 0">'+Tab4.reportData.summarize+'</div>'+
                '<div class="comes">'+Tab4.reportData.comes+'</div>'
            '</div>'

        html+='</div>'

        LMEPG.BM.addButtons([{
            id: 'position-4',
            type: 'img',
            nextFocusDown: 'position-5',
            nextFocusUp: 'position-3',
            backgroundImage: "/Public/img/hd/Home/V29/more-news.png",
            focusImage: "/Public/img/hd/Home/V29/more-news-f.png",
            click: PageJump.jumpCommon,
            focusChange: '',
            beforeMoveChange: Home.pageScroll,
            page:'report-time-line'
        }])

        return html
    },

    renderKnowledgeArea:function () {
        var button = []
        var html = '<div class="func-area">' +
            '<div class="area-heard">' +
            '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
            '<div class="area-title">疫情防控</div>'+
            '</div>'+
            '<div style="margin-top: 10px">'

        contentList[10].item_data.forEach(function (item,index) {
            html+='<div class="knowledge-pic" id="position-'+(5+index)+'"><img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%;height: 100%"/></div>'


            button.push({
                id: 'position-'+(5+index),
                type: 'div',
                nextFocusDown:'position-'+(index+8),
                nextFocusUp: index<3?'position-4': 'position-'+(2+index),
                nextFocusLeft:index === 0?'':'position-'+(4+index),
                nextFocusRight:'position-'+(6+index),
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Home/V29/choose-1.png",
                click: Tab4.clickSwitch,
                focusChange: '',
                beforeMoveChange: index<3?Home.pageScroll:'',
            })
        })

        html+='</div>'
        html+='<div class="back-text">按“返回”键回到顶部</div>'

        LMEPG.BM.addButtons(button)

        return html
    },

    clickSwitch:function(btn){
        switch (btn.id) {
            case 'position-4':
                PageJump.jumpCommon("go-home-isolation")
                break
            case 'position-5':
                var objCurrent = PageEvent.setCurrentPage();
                var objDst = LMEPG.Intent.createIntent("knowledge");
                objDst.setParam("type",'1');
                LMEPG.Intent.jump(objDst, objCurrent);
                break
            case 'position-6':
                var objCurrent = PageEvent.setCurrentPage();
                var objDst = LMEPG.Intent.createIntent("knowledge");
                LMEPG.Intent.jump(objDst, objCurrent);
                break
            case 'position-7':
                PageJump.jumpActivityPage('ActivityGiveWarm20211108')
                break
            case 'position-8':
                PageJump.jumpCommon('detectAgency')
                break
            case 'position-9':
                PageJump.jumpCommon('retrograde')
                break
        }
    },

    toAreaPage:function (btn) {
        var objCurrent = PageEvent.setCurrentPage();
        var objDst = LMEPG.Intent.createIntent("area-data");
        objDst.setParam('scrollIndex',btn.index)
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    toLocalData:function(){
        var objCurrent = PageEvent.setCurrentPage();
        var objDst = LMEPG.Intent.createIntent("area-data-prev");
        LMEPG.Intent.jump(objDst, objCurrent);
    },

    getSituationData:function (callback) {
        LMEPG.ajax.postAPI('Epidemic/getEpidemicDetail', {}, function (rsp) {
            if (rsp.code === '0') {
                callback(rsp)
            }else {
                LMEPG.UI.showToast('拉取数据请求失败');
            }

        })
    },

    getReportData:function (callback) {
        LMEPG.ajax.postAPI('Epidemic/getEpidemicNews', {}, function (rsp) {
            if (rsp.code === '0') {
                callback(rsp)
            }else {
                LMEPG.UI.showToast('拉取数据请求失败');
            }

        })
    },

    getLocalData: function (cb) {
        LMEPG.ajax.postAPI('Epidemic/getDetailData', {
            'province': '青海',
        }, function (res) {
            cb(JSON.parse(res))
        })
    },

    buildMapAvatarUrl: function (time,avatarUrl) {
        var head = {
            func: "getDoctorHeadImage",
            areaCode: '',
        };
        var json = {
            doctorId: time,
            avatarUrl: avatarUrl
        };
        return RenderParam.CWS_HLWYY_URL + "?head=" + JSON.stringify(head) + "&json=" + JSON.stringify(json);
    },
}

var Tab5 = {
    renderContent:function () {
        var html=''

        html+=Tab5.renderArea1()
        html+=Tab5.renderArea2()
        html+=Tab5.renderArea3()

        G('main').innerHTML = html
    },

    renderArea1:function () {
        var buttons =[]
        var html = '<div class="func-area" style="margin-top: 0">' +
            '<div class="area-heard">' +
            '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
            '<div class="area-title">本地病的防治</div>'+
            '</div>'+
            '<div style="margin-top: 10px">'

        contentList[11].item_data.forEach(function (item,index) {
            var icon =item.inner_parameters?JSON.parse(item.inner_parameters).cornermark.img_url:''
            html+='<div class="tab5-item" id="position-'+(1+index)+'">' +
                '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%">'

            if(icon){
                html+='<img src="'+RenderParam.fsUrl+icon+'" class="pic-icon">'
            }

            html+='</div>'

            buttons.push({
                id: 'position-'+(1+index),
                type: 'div',
                nextFocusLeft:'position-'+(index),
                nextFocusRight:index === (contentList[11].item_data.length-1)?'':'position-'+(2+index),
                nextFocusDown: 'position-'+(4+index),
                nextFocusUp: index<3?'tab-4':'position-'+(index-2),
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Home/V29/choose-1.png",
                focusChange: '',
                beforeMoveChange: index>=3?Home.pageScroll:'',
                click: PageEvent.click,
                cPosition:51,
                cIndex:index
            })
        })

        html+='</div></div>'
        LMEPG.BM.addButtons(buttons)

        return html
    },

    renderArea2:function () {
        var buttons =[]
        var html = '<div class="func-area">' +
            '<div class="area-heard">' +
            '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
            '<div class="area-title">中医养生</div>'+
            '</div>'+
            '<div style="margin-top: 10px">'

        contentList[12].item_data.forEach(function (item,index) {
            var icon =item.inner_parameters?JSON.parse(item.inner_parameters).cornermark.img_url:''
            html+='<div class="tab1-item" id="position-'+(7+index)+'">' +
                '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%;height: 100%">'

            if(icon){
                html+='<img src="'+RenderParam.fsUrl+icon+'" class="pic-icon">'
            }

            html+='</div>'

            buttons.push({
                id: 'position-'+(7+index),
                type: 'div',
                nextFocusLeft:index ===0 ? '':'position-'+(6+index),
                nextFocusRight:index === (contentList[12].item_data.length-1)?'':'position-'+(8+index),
                nextFocusDown: 'position-'+(10+index),
                nextFocusUp: 'position-'+(4+index),
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Home/V29/choose-1.png",
                focusChange: '',
                beforeMoveChange:Home.pageScroll,
                click: PageEvent.click,
                cPosition:52,
                cIndex:index
            })

        })

        html+='</div></div>'
        LMEPG.BM.addButtons(buttons)

        return html
    },

    renderArea3:function () {
        var buttons = []
        var html = '<div class="func-area">' +
            '<div class="area-heard">' +
            '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
            '<div class="area-title">深度资讯</div>'+
            '</div>'+
            '<div style="margin-top: 10px">'

        contentList[13].item_data.forEach(function (item,index){
            var icon =item.inner_parameters?JSON.parse(item.inner_parameters).cornermark.img_url:''
            html+='<div class="'+(index === 0?"tab1-item":"tab1-item-spe")+'" id="position-'+(10+index)+'">' +
                '<img src="'+RenderParam.fsUrl+item.img_url+'" style="width: 100%;height: 100%">'

            if(icon){
                html+='<img src="'+RenderParam.fsUrl+icon+'" class="pic-icon">'
            }

            html+='</div>'

            buttons.push({
                id: 'position-'+(10+index),
                type: 'div',
                nextFocusLeft:index === 0?'':'position-'+(9+index),
                nextFocusRight:'position-'+(11+index),
                nextFocusDown: 'position-15',
                nextFocusUp: index === 0?'position-7':index>=1 && index<=2?'position-8':'position-9',
                backgroundImage: " ",
                focusImage: index ===0?"/Public/img/hd/Home/V29/choose-1.png":"/Public/img/hd/Home/V29/choose-2.png",
                focusChange: '',
                beforeMoveChange: Home.pageScroll,
                click: PageEvent.click,
                cPosition:53,
                cIndex:index
            })

        })
        html+='<div>'

        contentList[14].item_data.forEach(function (item,index){
            html+='<div class="tab5-spe-item" id="position-'+(15+index)+'">'+JSON.parse(item.inner_parameters).title+'</div>'

            buttons.push({
                id: 'position-'+(15+index),
                type: 'div',
                nextFocusLeft:index === 0?'':'position-'+(14+index),
                nextFocusRight:'position-'+(16+index),
                nextFocusDown: 'position-'+(21+index),
                nextFocusUp: index === 0?'position-10':index>=2 && index<=3?'position-11':'position-13',
                backgroundImage: "/Public/img/hd/Home/V29/bg-tab5-item.png",
                focusImage: "/Public/img/hd/Home/V29/bg-tab5-f.png",
                focusChange: Tab5.changeStyle,
                beforeMoveChange: function (dir,btn) {
                    if(dir === 'down'){
                        if(!G(btn.nextFocusDown)){
                            LMEPG.BM.requestFocus('position-'+(20+contentList[15].item_data.length))
                        }
                    }
                },
                click: PageEvent.click,
                cPosition:54,
                cIndex:index
            })
        })

        contentList[15].item_data.forEach(function (item,index){
            html+='<div class="tab5-spe-item" style="margin-top: 5px" id="position-'+(21+index)+'">'+JSON.parse(item.inner_parameters).title+'</div>'

            buttons.push({
                id: 'position-'+(21+index),
                type: 'div',
                nextFocusLeft:'position-'+(20+index),
                nextFocusRight:'position-'+(22+index),
                nextFocusDown: '',
                nextFocusUp: 'position-'+(21+index - 6) ,
                backgroundImage: "/Public/img/hd/Home/V29/bg-tab5-item.png",
                focusImage: "/Public/img/hd/Home/V29/bg-tab5-f.png",
                focusChange: Tab5.changeStyle,
                beforeMoveChange: '',
                click: PageEvent.click,
                cPosition:55,
                cIndex:index
            })
        })

        html+='</div></div></div>'

        html+='<div class="back-text">按“返回”键回到顶部</div>'

        LMEPG.BM.addButtons(buttons)

        return html
    },


    changeStyle:function(btn,hasFocus){
        var ele = G(btn.id)
        if(hasFocus){
            ele.style.color = '#fff'
        }else {
            ele.style.color = '#fff'
        }
    },
}

var Tab6 = {
    data:[{
            name: "西宁城西区佰世堂大药房",
            addr: "城西区金羚大街26号7号楼26—54号",
            tell: "0971-5316799"
        }, {
            name: "西宁城西区百瑞堂大药房",
            addr: "城西区文成路B16—104号（海湖星城东门）",
            tell: "0971-8185833"
        }, {
            name: "西宁城西区祥达大药房",
            addr: "城西区胜利路西交通巷2号",
            tell: "0971-5316799"
        }, {
            name: " 青海省新绿洲医药连锁有限公司新绿洲医药广场",
            addr: "城西区同仁路46号1号楼1单元46-2号",
            tell: "0971-8125743"
        }, {
            name: "青海省富康医药连锁有限公司源丰医药超市",
            addr: "城西区胜利路30号",
            tell: "0971-6266659"
        }, {
            name: "青海金珠药业连锁有限公司珍草堂大药房",
            addr: "城东区林安小区",
            tell: "0971-7614572"
        }, {
            name: "西宁锦瑞堂医药商店",
            addr: "城东区七一东路18号7号楼18-58室",
            tell: "暂无"
        }, {
            name: "青海富康医药连锁有限公司康仁堂大药房",
            addr: "城东区昆仑东路299号",
            tell: "暂无"
        }, {
            name: "青海春天医药连锁有限公司春天医药广场",
            addr: "城中区西大街6-4号",
            tell: "0971-8213303"
        }, {
            name: "西宁市城中区仁和大药房",
            addr: "城中区南山路8-10号",
            tell: "暂无"
        }, {
            name: "青海省新绿洲医药连锁有限公司山川大药房",
            addr: "城北区朝阳西路59号山川住宅区",
            tell: "暂无"
        }, {
            name: "青海省佳农医药连锁有限公司中心店",
            addr: "城北区小桥大街46号",
            tell: "暂无"
        }, {
            name: "西宁城北康弘医药超市",
            addr: "城北区小桥大街30-8号",
            tell: "暂无"
        }, {
            name: "青海天奕医药连锁有限公司晨翔药房",
            addr: "大通县园林路付8号花儿步行街13-93号",
            tell: "暂无"
        }, {
            name: "青海省康宁医药连锁有限公司湟源店",
            addr: "湟源县建设东路",
            tell: "暂无"
        }],
    hasScroll:false,
    page:0,

    renderContent:function () {
        var buttons = []
        var html ='<div>'
        Tab6.data.forEach(function (item,index) {
            html+='<div class="medicine-box" id="position-'+(1+index)+'">' +
                    '<img src="/Public/img/hd/Home/V29/me-pic.png" style="display:block;width: 375px;height: 310px">' +
                    '<div class="box-info" id="box-'+index+'">' +
                        '<div class="medicine-name" id="name-'+index+'">'+item.name+'</div>'+
                        '<div class="info-area">' +
                            '<img src="/Public/img/hd/Home/V29/addr.png" class="info-icon" id="addr-icon-'+index+'">'+
                            '<div class="some-info" id="addr-'+index+'" >'+item.addr+'</div>'+
                        '</div>'+
                        '<div class="info-area" style="margin-top: 10px">' +
                            '<img src="/Public/img/hd/Home/V29/tell.png" class="info-icon" id="tell-icon-'+index+'">'+
                            '<div class="some-info" id="tell-'+index+'">'+item.tell+'</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'

            buttons.push({
                id: 'position-'+(1+index),
                type: 'div',
                nextFocusLeft:index % 3 === 0? '':'position-'+(index),
                nextFocusRight:(index+1) % 3 === 0?'':'position-'+(2+index),
                nextFocusDown: 'position-'+(4+index),
                nextFocusUp:index<3?'tab-5':'position-'+(index-2),
                backgroundImage: " ",
                focusImage: "/Public/img/hd/Home/V29/box-f.png",
                click: '',
                focusChange: Tab6.changeStyle,
                beforeMoveChange: Tab6.turnPage,
                index:index,
                addr:item.addr
            })
        })

        html+='</div>'

        html+='<div class="back-text">按“返回”键回到顶部</div>'
        LMEPG.BM.addButtons(buttons)
        G('main').innerHTML = html
    },

    turnPage:function(dir){
        if(dir === 'down'){
            if(Tab6.page === 4) return
            Tab6.page++
            G('main').style.marginTop = -450*Tab6.page +'px'
            Tab6.hasScroll = true
        }else if(dir === 'up'){
            if(Tab6.page === 0) return;
            Tab6.page--
            G('main').style.marginTop = -450*Tab6.page +'px'
            Tab6.hasScroll = true
        }
    },

    changeStyle:function (btn,hasFocus) {
        var name = G('name-'+btn.index)
        var addr = G('addr-'+btn.index)
        var tell = G('tell-'+btn.index)
        var box = G('box-'+btn.index)
        var addrIcon = G("addr-icon-"+btn.index)
        var tellIcon = G("tell-icon-"+btn.index)


        if(hasFocus){
            name.style.color = '#fff'
            addr.style.color = '#fff'
            btn.addr.length > 20 ?addr.innerHTML = '<marquee>'+btn.addr+'</marquee>':''
            tell.style.color = '#fff'
            box.style.backgroundImage = 'url(/Public/img/hd/Home/V29/box-info-f.png)'
            addrIcon.src = '/Public/img/hd/Home/V29/addr-f.png'
            tellIcon.src = '/Public/img/hd/Home/V29/tell-f.png'
            console.log('name-'+btn.index,909)
            LMEPG.UI.Marquee.start('name-'+btn.index,15)

        }else {
            name.style.color = '#fff'
            addr.style.color = '#fff'
            addr.innerHTML = btn.addr;
            tell.style.color = '#fff'
            box.style.backgroundImage = 'url(/Public/img/hd/Home/V29/box-info.png)'
            addrIcon.src = '/Public/img/hd/Home/V29/addr.png'
            tellIcon.src = '/Public/img/hd/Home/V29/tell.png'
            LMEPG.UI.Marquee.stop()
        }
    }
}

var Tab7 = {
    renderContent:function () {
        var html = '<div class="func-area" style="margin-top: 0">' +
                '<div class="area-heard">' +
                '<img src="/Public/img/hd/Home/V29/title-line.png" style="display: inline-block"/>' +
                '<div class="area-title">ITV账号：'+RenderParam.accountId+'</div>'+
            '</div>'

        html+=Tab7.renderItem()


        G('main').innerHTML = html
    },

    renderItem:function () {
        var buttons = [];
        var html='<div style="margin-top: 20px">'

        html+='<div class="tab7-left">' +
                '<img src="'+RenderParam.fsUrl+contentList[22].item_data[0].img_url+'" id="position-1" style="width: 100%;height: 100%">' +
            '</div>'+
            '<div class="tab7-right">'

        buttons.push({
            id: 'position-1',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'tab-6',
            nextFocusLeft:'',
            nextFocusRight:'position-2',
            backgroundImage:RenderParam.fsUrl+contentList[22].item_data[0].img_url ,
            focusImage: "/Public/img/hd/Home/V29/tab7-icon-1.png",
            focusChange: '',
            beforeMoveChange:'',
            click: PageEvent.click,
            cPosition:71,
            cIndex:0
        })


        for(var i=23; i<=26; i++){
            html+='<img id ="position-'+(i-21)+'" src="'+RenderParam.fsUrl+contentList[i].item_data[0].img_url+'" style=" width:380px;height:203px;margin-left:'+(i%2===0?10:0)+'px;margin-top:'+(i>24?5:0)+'px">'

            buttons.push({
                id: 'position-'+(i-21),
                type: 'img',
                nextFocusDown: 'position-'+(i-19),
                nextFocusUp: i<25?'tab-6':'position-'+(i-23),
                nextFocusLeft:i===25?'position-1':'position-'+(i-22),
                nextFocusRight:'position-'+(i-20),
                backgroundImage:RenderParam.fsUrl+contentList[i].item_data[0].img_url ,
                focusImage: "/Public/img/hd/Home/V29/tab7-icon-"+(i-21)+".png",
                focusChange: '',
                beforeMoveChange:'',
                click: i !== 26?PageEvent.click : function () {
                    LMEPG.UI.showToast('暂未开放')
                },
                cPosition:71+(i-22),
                cIndex:0
            })
        }


        html+='</div></div>'

        html+='<div class="tab7-tip">加入我们，一起助力互联网医疗事业   咨询热线：4000633138</div>'

        LMEPG.BM.addButtons(buttons)

        return html
    },

}


function onBack() {
    if(G('level4Wrapper')){
        document.body.removeChild(G("level4Wrapper"));
        LMEPG.ButtonManager.requestFocus(Level_3.keepLevel3FocusId);
    }else if(G('level-2-container')){
        if(keepLevel ===3){
            document.body.removeChild(G('level-2-container'));
            Level_3.page = 0;
            Level_3.mode = 0;
            Level_3.pageSize = 0;
            Level_2.init(tempHospitalInfo,true);
            keepLevel = 3;
        }else {
            document.body.removeChild(G('level-2-container'));
            LMEPG.ButtonManager.requestFocus(focusId);
        }

    } else if(Home.scroll!==0 || Tab6.hasScroll){
        Home.scroll = 0
        Tab6.hasScroll = false
        Tab6.page = 0
        G('main').style.marginTop = '0px'
        LMEPG.BM.requestFocus('position-1')
    }else if(tabIndex!==0){
        Tab1.renderContent()
        G('tab-'+tabIndex).src = LMEPG.BM.getButtonById('tab-'+tabIndex).backgroundImage
        tabIndex = 0
        LMEPG.BM.requestFocus('tab-0')
    }else {
        PageJump.jumpHoldPage();
    }

    keepLevel = Math.max(1, keepLevel -= 1);
}




