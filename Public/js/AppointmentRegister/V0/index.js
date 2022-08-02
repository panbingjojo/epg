/**
 * 预约挂号集成cws数据
 * */
var HospList = {
    Nc: 4,// 列表显示条数
    Np: 1,// 当前列表索引
    Nm: 1,// 最大列表索引
    data: [], // 总数据
    buttons: [],
    showDetail: false, // 显示医院详情参量
    fsUrl: RenderParam.fsUrl,// fs 地址
    imgPrefix: g_appRootPath + '/Public/img/' + RenderParam.platformType + '/AppointmentRegister/V0/',
    currentHosId: '',
    init: function () {
        this.addProperty();
        this.renderList();
        this.createButtons();
        LMEPG.BM.init('hos-0', this.buttons, '', true);
        LMEPG.KEM.addKeyEvent({KEY_BACK: this.goBack});
    },

    /**返回*/
    goBack: function () {
        if (HospList.showDetail) {
            HospList.renderList();
            HospList.showDetail = false;
            LMEPG.BM.requestFocus(HospList.currentHosId);
            HospList.currentHosId = '';
        } else {
            LMEPG.Intent.back();
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
        this.Nm = Math.ceil(data.length / this.Nc);
    },

    /**渲染医院列表*/
    renderList: function () {
        var self = HospList;
        var Ns = self.Nc * (self.Np - 1);
        self.listData = self.data.slice(Ns, Ns + 4);
        var htm = ['<img id="prev-arrow" src="' + self.imgPrefix + 'prev.png">', '<img id="next-arrow" src="' + self.imgPrefix + 'next.png">'];
        // 高/标清标题长度限制
        var nameLen = RenderParam.platformType === 'hd' ? 15 : 12;
        var i = self.listData.length;
        while (i--) {
            var txt = self.listData[i].hospital_name;
            htm.push('<div class="hos-item">' +
                '<img class="hos-icon" src="' + self.fsUrl + self.listData[i].img_url + '">' +
                '<p class="hos-title" title="' + txt + '" id="hos-' + i + '">' + LMEPG.Func.substrByOmit(txt, nameLen) + '</p></div>'
            );
        }
        G('right-wrap').innerHTML = htm.reverse().join(' ');
        self.toggleArrow();
    },

    /**列表翻页*/
    turnList: function (key, btn) {
        var self = HospList;
        if (HospList.showDetail) {
            return;
        }
        if (key === 'up' && btn.id === 'hos-0' && self.Np !== 1) {
            self.prevList();
            return false;
        }
        if (key === 'down' && btn.id === 'hos-' + (self.Nc - 1) && self.Np !== self.Nm) {
            self.nextList();
            return false;
        }
    },

    /**上一个列表*/
    prevList: function () {
        this.Np--;
        this.renderList();
        LMEPG.BM.requestFocus('hos-' + (this.Nc - 1));
    },

    /**下一个列表*/
    nextList: function () {
        this.Np++;
        this.renderList();
        LMEPG.BM.requestFocus('hos-0');
    },

    /**医院详情*/
    showHospDetail: function (btn) {
        var epg = LMEPG;
        var self = HospList;
        self.showDetail = true;
        self.currentHosId = LMEPG.BM.getCurrentButton().id;
        // 当前医院数据
        var introData = self.listData[btn.cIdx];
        // 医院标题限制长度
        var nameLen = RenderParam.platformType === 'hd' ? 13 : 15;
        // 医院地址限制长度
        var addrLen = RenderParam.platformType === 'hd' ? 25 : 16;
        // 医院介绍限制长度
        var intrLen = RenderParam.platformType === 'hd' ? 200 : 170;
        // 动态渲染医院详情
        G('right-wrap').innerHTML = '<div id="hos-intro">' +
            '<div id="hos-intro-gather">' +
            '<img class="hos-intro-icon" src=' + self.fsUrl + introData.img_url + '>' +
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

    /**箭头指示*/
    toggleArrow: function () {
        H('prev-arrow');
        H('next-arrow');
        this.Np !== 1 && S('prev-arrow');
        this.Np !== this.Nm && S('next-arrow');
    },

    /**事件驱动焦点得失展示效果*/
    toggleOnFocus: function (btn, hasFocus) {
        var btnElement = G(btn.id);
        // 得到标题
        var hosName = btnElement.getAttribute('title');
        // 高/标清标题长度限制
        var nameLen = RenderParam.platformType === 'hd' ? 15 : 12;
        if (hasFocus) {
            btnElement.setAttribute('class', 'hos-title focus');
            LMEPG.Func.marquee(btnElement,hosName ,nameLen);
        } else {
            btnElement.setAttribute('class', 'hos-title');
            LMEPG.Func.marquee(btnElement);
        }
    },

    /**创建虚拟焦点*/
    createButtons: function () {
        var len = this.Nc;
        while (len--) {
            this.buttons.push(
                {
                    id: 'hos-' + len,
                    name: '医院焦点',
                    type: 'div',
                    nextFocusUp: 'hos-' + (len - 1),
                    nextFocusDown: 'hos-' + (len + 1),
                    backgroundImage: HospList.imgPrefix + 'hos_name.png',
                    focusImage: HospList.imgPrefix + 'hos_name_f.png',
                    focusChange: this.toggleOnFocus,
                    click: this.showHospDetail,
                    beforeMoveChange: this.turnList,
                    cIdx: len
                }, {
                    id: 'scroll-bar',
                    type: 'others',
                    name: '滚动条',
                    beforeMoveChange: HospList.scrollContentDistance
                }
            );
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
        var backReturnLen = RenderParam.platformType == 'sd' ? 300 : 309;
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

window.onload = function (ev) {
    HospList.init();
};
