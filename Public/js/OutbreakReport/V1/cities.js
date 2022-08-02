var citys = [{
    "carrierId":"",
    "n": "北京",
    "c": [
        {"n": "北京"}
    ]
}, {
    "carrierId":"^(000051)",
    "n": "天津",
    "c": [
        {"n": "天津"}
    ]
}, {
    "carrierId":"",
    "n": "河北",
    "c": [
        {"n": "石家庄"}, {"n": "唐山"}, {"n": "秦皇岛"}, {"n": "邯郸"}, {"n": "邢台"}, {"n": "保定"}, {"n": "张家口"}, {"n": "承德"}, {"n": "沧州"}, {"n": "廊坊"}, {"n": "衡水"}
    ]
}, {
    "carrierId":"",
    "n": "山西",
    "c": [
        {"n": "太原"}, {"n": "大同"}, {"n": "阳泉"}, {"n": "长治"}, {"n": "晋城"}, {"n": "朔州"}, {"n": "晋中"}, {"n": "运城"}, {"n": "忻州"}, {"n": "临汾"}, {"n": "吕梁"}
    ]
}, {
    "carrierId":"",
    "n": "内蒙古",
    "c": [
        {"n": "呼和浩特"}, {"n": "包头"}, {"n": "乌海"}, {"n": "赤峰"}, {"n": "通辽"}, {"n": "鄂尔多斯"}, {"n": "呼伦贝尔"}, {"n": "巴彦淖尔"}, {"n": "乌兰察布"}, {"n": "兴安"}, {"n": "锡林郭勒"}, {"n": "阿拉善"}
    ]
}, {
    "carrierId":"^(210092)",
    "n": "辽宁",
    "c": [
        {"n": "沈阳"}, {"n": "大连"}, {"n": "鞍山"}, {"n": "抚顺"}, {"n": "本溪"}, {"n": "丹东"}, {"n": "锦州"}, {"n": "营口"}, {"n": "阜新"}, {"n": "辽阳"}, {"n": "盘锦"}, {"n": "铁岭"}, {"n": "朝阳"}, {"n": "葫芦岛"}
    ]
}, {
    "carrierId":"^(220094|220095|220001)",
    "n": "吉林",
    "c": [
        {"n": "长春"}, {"n": "吉林"}, {"n": "四平"}, {"n": "辽源"}, {"n": "通化"}, {"n": "白山"}, {"n": "松原"}, {"n": "白城"}, {"n": "延边"}
    ]
}, {
    "carrierId":"^(01230001)",
    "n": "黑龙江",
    "c": [
        {"n": "哈尔滨"}, {"n": "齐齐哈尔"}, {"n": "鸡西"}, {"n": "鹤岗"}, {"n": "双鸭山"}, {"n": "大庆"}, {"n": "伊春"}, {"n": "佳木斯"}, {"n": "七台河"}, {"n": "牡丹江"}, {"n": "黑河"}, {"n": "绥化"}, {"n": "大兴安岭"}
    ]
}, {
    "carrierId":"",
    "n": "上海",
    "c": [
        {"n": "上海"}
    ]
}, {
    "carrierId":"^(320092|000005|320001)",
    "n": "江苏",
    "c": [
        {"n": "南京"}, {"n": "无锡"}, {"n": "徐州"}, {"n": "常州"}, {"n": "苏州"}, {"n": "南通"}, {"n": "连云港"}, {"n": "淮安"}, {"n": "盐城"}, {"n": "扬州"}, {"n": "镇江"}, {"n": "泰州"}, {"n": "宿迁"}
    ]
}, {
    "carrierId":"^(320013)",
    "n": "浙江",
    "c": [
        {"n": "杭州"}, {"n": "宁波"}, {"n": "温州"}, {"n": "嘉兴"}, {"n": "湖州"}, {"n": "绍兴"}, {"n": "金华"}, {"n": "衢州"}, {"n": "舟山"}, {"n": "台州"}, {"n": "丽水"}
    ]
}, {
    "carrierId":"^(09340001)",
    "n": "安徽",
    "c": [
        {"n": "合肥"}, {"n": "芜湖"}, {"n": "蚌埠"}, {"n": "淮南"}, {"n": "马鞍山"}, {"n": "淮北"}, {"n": "铜陵"}, {"n": "安庆"}, {"n": "黄山"}, {"n": "滁州"}, {"n": "阜阳"}, {"n": "宿州"}, {"n": "六安"}, {"n": "亳州"}, {"n": "池州"}, {"n": "宣城"}
    ]
}, {
    "carrierId":"^(350092)",
    "n": "福建",
    "c": [
        {"n": "福州"}, {"n": "厦门"}, {"n": "莆田"}, {"n": "三明"}, {"n": "泉州"}, {"n": "漳州"}, {"n": "南平"}, {"n": "龙岩"}, {"n": "宁德"}
    ]
}, {
    "carrierId":"^(360092|360001)",
    "n": "江西",
    "c": [
        {"n": "南昌"}, {"n": "景德镇"}, {"n": "萍乡"}, {"n": "九江"}, {"n": "新余"}, {"n": "鹰潭"}, {"n": "赣州"}, {"n": "吉安"}, {"n": "宜春"}, {"n": "抚州"}, {"n": "上饶"}
    ]
}, {
    "carrierId":"^(370092|370002|216|371092)",
    "n": "山东",
    "c": [
        {"n": "济南"}, {"n": "青岛"}, {"n": "淄博"}, {"n": "枣庄"}, {"n": "东营"}, {"n": "烟台"}, {"n": "潍坊"}, {"n": "济宁"}, {"n": "泰安"}, {"n": "威海"}, {"n": "日照"}, {"n": "临沂"}, {"n": "德州"}, {"n": "聊城"}, {"n": "滨州"}, {"n": "菏泽"}
    ]
}, {
    "carrierId":"^(410092)",
    "n": "河南",
    "c": [
        {"n": "郑州"}, {"n": "开封"}, {"n": "洛阳"}, {"n": "平顶山"}, {"n": "安阳"}, {"n": "鹤壁"}, {"n": "新乡"}, {"n": "焦作"}, {"n": "濮阳"}, {"n": "许昌"}, {"n": "漯河"}, {"n": "三门峡"}, {"n": "南阳"}, {"n": "商丘"}, {"n": "信阳"}, {"n": "周口"}, {"n": "驻马店"}
    ]
}, {
    "carrierId":"^(420092)",
    "n": "湖北",
    "c": [
        {"n": "武汉"}, {"n": "黄石"}, {"n": "十堰"}, {"n": "宜昌"}, {"n": "襄阳"}, {"n": "鄂州"}, {"n": "荆门"}, {"n": "孝感"}, {"n": "荆州"}, {"n": "黄冈"}, {"n": "咸宁"}, {"n": "随州"}, {"n": "恩施"}
    ]
}, {
    "carrierId":"^(430012|07430093|430002)",
    "n": "湖南",
    "c": [
        {"n": "长沙"}, {"n": "株洲"}, {"n": "湘潭"}, {"n": "衡阳"}, {"n": "邵阳"}, {"n": "岳阳"}, {"n": "常德"}, {"n": "张家界"}, {"n": "益阳"}, {"n": "郴州"}, {"n": "永州"}, {"n": "怀化"}, {"n": "娄底"}, {"n": "湘西"}
    ]
}, {
    "carrierId":"^(440094|440004|440001)",
    "n": "广东",
    "c": [
        {"n": "广州"}, {"n": "韶关"}, {"n": "深圳"}, {"n": "珠海"}, {"n": "汕头"}, {"n": "佛山"}, {"n": "江门"}, {"n": "湛江"}, {"n": "茂名"}, {"n": "肇庆"}, {"n": "惠州"}, {"n": "梅州"}, {"n": "汕尾"}, {"n": "河源"}, {"n": "阳江"}, {"n": "清远"}, {"n": "东莞"}, {"n": "中山"}, {"n": "潮州"}, {"n": "揭阳"}, {"n": "云浮"}
    ]
}, {
    "carrierId":"^(450092|09450001|450094|450004|450001)",
    "n": "广西",
    "c": [
        {"n": "南宁"}, {"n": "柳州"}, {"n": "桂林"}, {"n": "梧州"}, {"n": "北海"}, {"n": "防城港"}, {"n": "钦州"}, {"n": "贵港"}, {"n": "玉林"}, {"n": "百色"}, {"n": "贺州"}, {"n": "河池"}, {"n": "来宾"}, {"n": "崇左"}
    ]
}, {
    "carrierId":"^(460092)",
    "n": "海南",
    "c": [
        {"n": "海口"}, {"n": "三亚"}, {"n": "三沙"}, {"n": "儋州"}
    ]
}, {
    "carrierId":"^(500092)",
    "n": "重庆",
    "c": [
        {"n": "重庆"}
    ]
}, {
    "carrierId":"",
    "n": "四川",
    "c": [
        {"n": "成都"}, {"n": "自贡"}, {"n": "攀枝花"}, {"n": "泸州"}, {"n": "德阳"}, {"n": "绵阳"}, {"n": "广元"}, {"n": "遂宁"}, {"n": "内江"}, {"n": "乐山"}, {"n": "南充"}, {"n": "眉山"}, {"n": "宜宾"}, {"n": "广安"}, {"n": "达州"}, {"n": "雅安"}, {"n": "巴中"}, {"n": "资阳"}, {"n": "阿坝"}, {"n": "甘孜"}, {"n": "凉山"}
    ]
}, {
    "carrierId":"^(520004|520094|520092|520094|223)",
    "n": "贵州",
    "c": [
        {"n": "贵阳"}, {"n": "六盘水"}, {"n": "遵义"}, {"n": "安顺"}, {"n": "毕节"}, {"n": "铜仁"}, {"n": "黔西南"}, {"n": "黔东南"}, {"n": "黔南"}
    ]
}, {
    "carrierId":"",
    "n": "云南",
    "c": [
        {"n": "昆明"}, {"n": "曲靖"}, {"n": "玉溪"}, {"n": "保山"}, {"n": "昭通"}, {"n": "丽江"}, {"n": "普洱"}, {"n": "临沧"}, {"n": "楚雄"}, {"n": "红河"}, {"n": "文山"}, {"n": "西双版纳"}, {"n": "大理"}, {"n": "德宏"}, {"n": "怒江"}, {"n": "迪庆"}
    ]
}, {
    "carrierId":"",
    "n": "西藏",
    "c": [
        {"n": "拉萨"}, {"n": "日喀则"}, {"n": "昌都"}, {"n": "林芝"}, {"n": "山南"}, {"n": "那曲"}, {"n": "阿里"}
    ]
}, {
    "carrierId":"",
    "n": "陕西",
    "c": [
        {"n": "西安"}, {"n": "铜川"}, {"n": "宝鸡"}, {"n": "咸阳"}, {"n": "渭南"}, {"n": "延安"}, {"n": "汉中"}, {"n": "榆林"}, {"n": "安康"}, {"n": "商洛"}
    ]
}, {
    "carrierId":"^(620092|620007)",
    "n": "甘肃",
    "c": [
        {"n": "兰州"}, {"n": "嘉峪关"}, {"n": "金昌"}, {"n": "白银"}, {"n": "天水"}, {"n": "武威"}, {"n": "张掖"}, {"n": "平凉"}, {"n": "酒泉"}, {"n": "庆阳"}, {"n": "定西"}, {"n": "陇南"}, {"n": "临夏"}, {"n": "甘南"}
    ]
}, {
    "carrierId":"^(630092|630001)",
    "n": "青海",
    "c": [
        {"n": "西宁"}, {"n": "海东"}, {"n": "海北"}, {"n": "黄南"}, {"n": "海南"}, {"n": "果洛"}, {"n": "玉树"}, {"n": "海西"}
    ]
}, {
    "carrierId":"^(640092)",
    "n": "宁夏",
    "c": [
        {"n": "银川"}, {"n": "石嘴山"}, {"n": "吴忠"}, {"n": "固原"}, {"n": "中卫"}
    ]
}, {
    "carrierId":"^(650092|12650092|651092)",
    "n": "新疆",
    "c": [
        {"n": "乌鲁木齐"}, {"n": "克拉玛依"}, {"n": "吐鲁番"}, {"n": "哈密"}, {"n": "昌吉"}, {"n": "博尔塔拉"}, {"n": "巴音郭楞"}, {"n": "阿克苏"}, {"n": "克孜勒苏"}, {"n": "喀什"}, {"n": "和田"}, {"n": "伊犁"}, {"n": "塔城"}, {"n": "阿勒泰"}
    ]
}, {
    "carrierId":"",
    "n": "香港",
    "c": [
        {"n": "香港"}
    ]
}, {
    "carrierId":"",
    "n": "澳门",
    "c": [
        {"n": "澳门"}
    ]
}, {
    "carrierId":"",
    "n": "台湾",
    "c": [
        {"n": "台湾"}
    ]
}];
var Pagination = {
    isCreateBtn: false,
    containerId: "",//分页容器,
    curPage: 0,
    type: "img",
    data: "",
    pagesSize: 0,
    btnId: "",
    callBack: "",
    onFocusBack: "",
    init: function (element) {
        this.containerId = element.containerId;
        this.data = element.data;
        this.pagesSize = element.pageSize;
        this.btnId = element.btnId;
        this.type = element.type;
        this.callBack = element.callBack;
        this.onFocusBack = element.onFocus;
        if (!this.isCreateBtn) {
            this.isCreateBtn = true;
            this.createBtn(this.pagesSize);
        }
        // this.isCreateBtn = element.isCreateBtn || false;
        // this.containerId = element.containerId;
        // this.curPage = 0;
        // this.type = element.type || "img";
        // this.data = element.data;
        // this.pagesSize = element.pagesSize || 0;
        // this.btnId = element.btnId;
        // this.callBack = element.callBack;
        // this.onFocusBack = element.onFocusBack;
        this.createHtml();
    },
    createHtml: function () {
        G(this.containerId).innerHTML = "";
        var sHtml = "";
        var curData = this.cut(this.data);
        var that = this;
        curData.forEach(function (item, i) {
            sHtml += '<li id="' + that.btnId + i + '">' + item.n + '</li>';
        });
        G(this.containerId).innerHTML = sHtml;
        for (var i = 0; i < curData.length; i++) {
            LMEPG.BM.getButtonById(Pagination.btnId + i).cType = curData[i].c;
        }
        LMEPG.ButtonManager.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : Pagination.btnId + '0');
    },
    cut: function () {
        return this.data.slice(this.curPage, this.pagesSize + this.curPage)
    },
    turnPage: function (dir, cur) {
        if (dir == "up" && cur.id == Pagination.btnId + "0") {
            Pagination.prePage()
            return false
        } else if (dir == "down" && cur.id == Pagination.btnId + (Pagination.pagesSize - 1)) {
            Pagination.nextPage()
            return false
        }
    },
    onClick: function (btn) {
        LMEPG.call(Pagination.callBack, btn)
    },
    onFocus: function (btn, has) {
        LMEPG.call(Pagination.onFocusBack, btn, has)
    },

    createBtn: function (page) {
        var focusNum = page;
        while (focusNum--) {
            buttons.push({
                id: Pagination.btnId + focusNum,
                type: Pagination.type,
                nextFocusUp: Pagination.btnId + (focusNum - 1),
                nextFocusDown: Pagination.btnId + (focusNum + 1),
                backgroundImage: g_appRootPath + '/Public/img/hd/Search/V21/transparent.png',
                focusImage: g_appRootPath + '/Public/img/hd/OutbreakReport/EAS/city_box_f.png',
                click: Pagination.onClick,
                focusChange: Pagination.onFocus,
                beforeMoveChange: Pagination.turnPage,
                cType: ""
            });
        }
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : Pagination.btnId + '0', buttons, '', true);
    },

    prePage: function () {
        if (this.curPage > 0) {
            this.curPage--;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + "0");
        }
    },
    nextPage: function () {

        if (this.curPage < (this.data.length - this.pagesSize)) {
            this.curPage++;
            this.createHtml();
            LMEPG.BM.requestFocus(Pagination.btnId + (Pagination.pagesSize - 1));
        }
    },
}