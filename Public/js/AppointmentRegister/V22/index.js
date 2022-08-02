/**
 * 预约挂号集成cws数据
 * */
var HospList = {
    numArea: 6, //地市显示条数
    numHost: 5,// 列表显示条数
    hosListIndex: 1,// 当前列表索引
    maxIndex: 1,// 最大列表索引
    areaIndex: 1,// 地市当前索引
    pageMax: 1,
    data: [], // 总数据
    buttons: [],
    areaData: [],
    showDetail: false, // 显示医院详情参量
    HosList: [],
    fsUrl: RenderParam.fsUrl,// fs 地址
    imgPrefix: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V22/',
    currentHosId: '',
    groupId: '',
    areaNum: 0,

    init: function () {
        this.addProperty();
        this.renderArea();
        this.createButtons();
        LMEPG.BM.init('area-0', this.buttons, '', true);
        LMEPG.KEM.addKeyEvent({KEY_BACK: this.goBack});
        this.renderList(HospList.areaNum,0);

    },

    /**返回*/
    goBack: function () {
        if (HospList.showDetail) {
            HospList.showDetail = false;
            LMEPG.BM.requestFocus(HospList.currentHosId);
            HospList.currentHosId = '';
            Hide('hospital_details');
        } else {
            if (RenderParam.isExitApp === '1') { // apk2.0平台，且需要直接退出应用，只有问诊功能模块
                if ( RenderParam.isRunOnAndroid === '1') {
                    LMAndroid.JSCallAndroid.doExitApp(); // 直接退出应用
                } else {
                    LMEPG.Intent.back('IPTVPortal');
                }

            } else {
                LMEPG.Intent.back();
            }
        }
    },

    /**数据处理*/
    addProperty: function () {
        var data = RenderParam.data.list;
        var i = data.length;
        while (i--) {
            data[i].hospital_code === 'HI-more' && data.splice(i, 1);
        }
        this.data = data;
        HospList.areaClassification(data, 'zone_name',HospList.HosList);
        HospList.HosList.unshift(data);
        var province = HospList.data[0].province + '省';
        HospList.areaData.unshift(province);
    },

    /**将数据根据zone_name区域名称进行分类*/
    areaClassification: function (list, name,resultList) {
        var sameTypeList = [];
        var propVal = '';
        if (list.length > 0) {
            propVal = list[0][name];
            var tempList = [];
            // 将含有相同的name属性值的对象push到此次遍历的list中，
            // 将其他的对象放入到tempList中，下次遍历
            for (var item in list) {
                if (list[item][name] === propVal) {
                    sameTypeList.push(list[item]);
                } else {
                    tempList.push(list[item]);
                }
            }
            resultList.push(sameTypeList);
            HospList.areaData.push(propVal);
            list = tempList;
            return HospList.areaClassification(list, name, resultList);
        } else {
            return resultList;
        }
    },

    /**渲染地市医院区域*/
    renderArea: function () {
        var self = HospList;
        var Ns = self.numArea * (self.areaIndex - 1);
        self.areaList = self.areaData.slice(Ns, Ns + 6);
        this.pageMax = Math.ceil(self.areaData.length / this.numArea);
        var htm = ['<img id="area-prev-arrow" src="' + self.imgPrefix + 'up.png">', '<img id="area-next-arrow" src="' + self.imgPrefix + 'down.png">'];
        var i = self.areaList.length;
        var nameLen = RenderParam.platformType === 'hd' ? 15 : 12;
        while (i--) {
            var txt = self.areaList[i];
            htm.push('<div class="area-item">' +
                '<p class="area-title" title="' + txt + '" id="area-' + i + '">' + LMEPG.Func.substrByOmit(txt, nameLen) + '</p></div>'
            );
        }
        G('areaList').innerHTML = htm.reverse().join(' ');
        self.areaToggleArrow();
    },

    /**渲染医院列表*/
    renderList: function (data,groupId) {
        var hosImg= HospList.imgPrefix+'bg_hos.png'
        HospList.groupId = groupId
        var self = HospList;
        var Ns = self.numHost * (self.hosListIndex - 1);
        this.maxIndex = Math.ceil(HospList.HosList[data].length / this.numHost);
        self.listData = HospList.HosList[data].slice(Ns, Ns + 5);
        var htm = ['<img id="prev-arrow" src="' + self.imgPrefix + 'up.png">', '<img id="next-arrow" src="' + self.imgPrefix + 'down.png">'];
        // 高/标清标题长度限制
        var nameLen = RenderParam.platformType === 'hd' ? 20 : 12;
        var i = self.listData.length;
        while (i--) {
            var txt = self.listData[i].hospital_name;
            var img = (self.listData[i].img_url)?self.fsUrl + self.listData[i].img_url:hosImg
            htm.push('<div class="hos-item">' +
                '<img class="hos-icon" src="' + img + '" onerror="this.src=HospList.imgPrefix+\'bg_hos.png\'">' +
                '<p class="hos-title" title="' + txt + '" id="hos-' + i + '">' + LMEPG.Func.substrByOmit(txt, nameLen) + '</p></div>'
            );
        }
        var len = this.numHost;
        for (var i =0;i<len;i++) {
            this.buttons.push(
                {
                    id: 'hos-' + i,
                    name: '医院焦点',
                    type: 'div',
                    nextFocusUp: 'hos-' + (i - 1),
                    nextFocusDown: 'hos-' + (i + 1),
                    nextFocusLeft: 'area-' + groupId,
                    backgroundImage: HospList.imgPrefix + 'hos_name.png',
                    focusImage: HospList.imgPrefix + 'hos_name_f.png',
                    focusChange: this.toggleOnFocus,
                    click: this.showHospDetail,
                    beforeMoveChange: this.turnList,
                    cIdx: i,
                }
            );
        }
        LMEPG.BM.addButtons(this.buttons)
        G('right_side').innerHTML = htm.reverse().join(' ');
        self.toggleArrow();
    },

    changeHospital: function (data,btn){
        HospList.groupId = btn
        HospList.renderList(data,HospList.groupId)
    },

    /**区域列表翻页*/
    areaTurnList: function (dir, btn) {
        var lens = HospList.areaIndex*6 < HospList.areaData.length
        var self = HospList;
        if (HospList.showDetail) {
            return;
        }
        if (dir === 'up'  && HospList.areaNum!=0){
            self.hosListIndex = 1
            HospList.areaNum--;
            HospList.changeHospital(HospList.areaNum,(btn.groupId==0)?5:btn.groupId-1);
        }else if (dir === 'down' && HospList.areaNum<(HospList.areaData.length)-1){
            self.hosListIndex = 1
            HospList.areaNum++;
            HospList.changeHospital(HospList.areaNum,(btn.groupId==5)?0:btn.groupId+1);
        }
        if (dir === 'up' && btn.id === 'area-0' && self.areaIndex !== 1) {
            self.areaPrevList();
            return false;
        }

        if (dir === 'down' && btn.id === 'area-' + (self.numArea - 1) && lens) {
            self.areaNextList();
            return false;
        }
        if (dir === 'right') {
            setTimeout(function (){
                G(btn.id).style.backgroundImage = 'url(' + HospList.imgPrefix + 'select_f.png' + ')';
            },50)
        }
    },

    /**列表翻页*/
    turnList: function (key, btn) {
        var self = HospList;
        if (HospList.showDetail) {
            return;
        }
        if (key === 'up' && btn.id === 'hos-0' && self.hosListIndex !== 1) {
            self.prevList();
            return false;
        }
        if (key === 'down' && btn.id === 'hos-' + (self.numHost - 1) && self.hosListIndex !== self.maxIndex) {
            self.nextList();
            return false;
        }

    },

    /**上一个列表*/
    areaPrevList: function () {
        this.areaIndex--;
        this.renderArea();
        LMEPG.BM.requestFocus('area-' + (this.numArea - 1));
    },

    /**下一个列表*/
    areaNextList: function () {
        this.areaIndex++;
        this.renderArea();
        LMEPG.BM.requestFocus('area-0');
    },

    /**上一个列表*/
    prevList: function () {
        this.hosListIndex--;
        this.renderList(HospList.areaNum,HospList.groupId);
        LMEPG.BM.requestFocus('hos-' + (this.numHost - 1));
    },

    /**下一个列表*/
    nextList: function () {
        this.hosListIndex++;
        this.renderList(HospList.areaNum,HospList.groupId);
        LMEPG.BM.requestFocus('hos-0');
    },

    /**医院详情*/
    showHospDetail: function (btn) {
        var hosImg= HospList.imgPrefix+'bg_hos.png';
        var errImg = HospList.imgPrefix +'qr_code.png';
        G('hospital_details').style.display = 'block';
        var epg = LMEPG;
        var self = HospList;
        self.showDetail = true;
        self.currentHosId = LMEPG.BM.getCurrentButton().id;
        // 当前医院数据
        var introData = self.listData[btn.cIdx];
        var img = (self.listData[btn.cIdx].img_url)?self.fsUrl + introData.img_url:hosImg;
        var codeImg = (self.listData[btn.cIdx].qrcode_img_url)?self.fsUrl + introData.qrcode_img_url:errImg
        // 医院标题限制长度
        var nameLen = RenderParam.platformType === 'hd' ? 13 : 15;
        // 医院地址限制长度
        var addrLen = RenderParam.platformType === 'hd' ? 25 : 16;
        // 医院介绍限制长度
        var intrLen = RenderParam.platformType === 'hd' ? 200 : 170;
        // 动态渲染医院详情
        G('left-wrap').innerHTML = '<img id="qr_code" src="' + codeImg + '" onerror="this.src=HospList.imgPrefix+\'qr_code.png\'">' +
            '<p>微信扫描二维码<br/>进行预约挂号服务</p>';
        G('right-wrap').innerHTML = '<div id="hos-intro">' +
            '<div id="hos-intro-gather">' +
            '<img class="hos-intro-icon" src="' + img + '" onerror="this.src=HospList.imgPrefix+\'bg_hos.png\'">' +
            '<div class="hos-intro-name gather" id="hos-intro-name">' +
            introData.hospital_name +
            '</div>' +
            '<div class="hos-intro-addr gather" id="hos-intro-addr">' +
            introData.location +
            '</div>' +
            '</div>' +
            '<div class="hos-intro-txt">' +
            '<div id="content-details">' +
            introData.brief_intro +
            '</div>' +
            '   <div id="scroll-wrap">' +
            '     <p id="scroll-bar"></p>' +
            '  </div>' +
            '  </div>' +

            '</div>';
        LMEPG.BM.requestFocus('scroll-bar');
    },

    /**区域箭头指示*/
    areaToggleArrow: function () {
        H('area-prev-arrow');
        H('area-next-arrow');
        this.areaIndex !== 1 && S('area-prev-arrow');
        this.areaIndex !== this.pageMax && S('area-next-arrow');
    },

    /**箭头指示*/
    toggleArrow: function () {
        H('prev-arrow');
        H('next-arrow');
        this.hosListIndex !== 1 && S('prev-arrow');
        this.hosListIndex !== this.maxIndex && S('next-arrow');
    },

    /**事件驱动焦点得失展示效果*/
    toggleOnFocus: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        // 得到标题
        var hosName = btnElement.getAttribute('title');
        // 高/标清标题长度限制
        var nameLen = RenderParam.platformType === 'hd' ? 20 : 12;
        if (hasFocus) {
            btnElement.setAttribute('class', 'hos-title focus');
            LMEPG.Func.marquee(btnElement,hosName ,nameLen);
        } else {
            btnElement.setAttribute('class', 'hos-title');
            LMEPG.Func.marquee(btnElement);
        }
    },

    /**地级市焦点选中效果*/
    areaFocus: function (btn, hasFocus){
        var btnEle = G(btn.id);
        if (hasFocus) {
            btnEle.setAttribute('class', 'area-title focus');
            LMEPG.Func.marquee(btnEle);
        } else {
            btnEle.setAttribute('class', 'area-title');
            LMEPG.Func.marquee(btnEle);
        }
    },

    /**创建虚拟焦点*/
    createButtons: function () {
        var lenArea = this.numArea
        for (var i = 0;i<lenArea;i++) {
            this.buttons.push(
                {
                    id: 'area-' + i,
                    name: '地市焦点',
                    type: 'div',
                    nextFocusUp: 'area-' + (i - 1),
                    nextFocusDown: 'area-' + (i + 1),
                    nextFocusRight: 'hos-0',
                    backgroundImage: HospList.imgPrefix + 'select.png',
                    focusImage: HospList.imgPrefix + 'selectedArea.png',
                    focusChange: HospList.areaFocus,
                    click: '',
                    beforeMoveChange: this.areaTurnList,
                    cIdx: i,
                    groupId: i,
                }, {
                    id: 'scroll-bar',
                    type: 'others',
                    name: '滚动条',
                    beforeMoveChange: HospList.scrollContentDistance
                }
            )
        }

    },

    dis: 0,
    scrollContentDistance: function (key, btn) {
        if (!HospList.showDetail) {
            return false;
        }
        var scrollBarEl = G('scroll-bar');
        var detailsEl = G('content-details');
        var wordsCount = G('content-details').innerText.length;
        var backReturnLen = RenderParam.platformType == 'sd' ? 300 : 250;
        console.log(wordsCount, backReturnLen);
        if (key == 'left' || key == 'right' || wordsCount < backReturnLen) {
            Hide('scroll-wrap');
            return;
        }
        HospList.dis = parseInt(scrollBarEl.style.top) || 0;
        if (key == 'up' && HospList.dis > 0) {
            HospList.dis -= 1;
            uadateDis();
            return false;
        }
        if (key == 'down' && HospList.dis <= 237) {
            HospList.dis += 1;
            uadateDis();
            return false;
        }

        function uadateDis() {
            scrollBarEl.style.top = HospList.dis + 'px';
            detailsEl.style.marginTop = -(HospList.dis * 15) + 'px';
        }
    }
};