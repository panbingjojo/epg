var buttons = [];
var focusId = "hos-0"; // 焦点保持
var Hospital = (function (doc, hospitalObj) {
    var MAX_COUNT_HOSPITAL = 8;
    // 构造客服端静态数据
    var data = (function () {
        var hospitalIntro = ["中山大学附属第一医院（简称中山一院）地处广东省省会广州市，是国家重点大学中山大学附属医院中规模最大、综合实力最强的附属医院，也是国内规模最大、综合实力最强的医院之一。医院始建于1910年，前身为广东公医医学专门学校附设公医院，历经百年沧桑磨砺，2001年更名为中山大学附属第一医院，现为国家三级甲等医院和国家爱婴医院，由院本部、东院组成（院本部位于广州市中心越秀区，东院位于广州市东部黄埔区中心地带），是华南地区医疗、教学、科研、预防保健和康复的重要基地，素以“技精德高”在我国和东南亚一带久负盛名。",
            "广东省中医院（广州中医药大学第二附属医院、广州中医药大学第二临床医学院、广东省中医药科学院、广东省中医药研修院）始建于1933年，是我国近代史上最早的中医医院之一，被誉为“南粤杏林第一家”。目前，医院已发展成为一家拥有大德路总院、二沙岛医院、芳村医院（广州市慈善医院）、珠海医院、大学城医院、琶洲医院（广州和睦家医院）六间医院及广州下塘、天河、罗冲围三个门诊部的大型综合性中医院。广东省中医药科学院、广东省中医药研修院、中国中医科学院广东分院落户我院。医院还是国家中医临床研究基地建设单位。",
            "暨南大学附属第一医院（又名广州华侨医院、暨南大学第一临床医学院），是国务院侨办直属的国家“211工程”重点大学——暨南大学的附属医院，是一所集医疗、教学、科研、预防、保健和康复于一体的综合性三级甲等医院。先后获评为“爱婴医院”、“国际SOS合作医院”、“广东省文明医院”、“全国侨办系统先进集体”、“广州市社会保险定点医疗机构信用等级AAA医院”和“全国优质护理服务考核优秀医院”。2010年起，医院连续被中国健康年度总评榜评选为“广州十佳三甲医院”。",
            "广州市妇女儿童医疗中心（以下简称“市妇儿医疗中心”）是华南地区规模最大的三级甲等妇女儿童医院，由原广州市儿童医院、广州市妇幼保健院（广州市妇婴医院）、广州市人口和计划生育技术服务指导所整合而成，为市副局级事业单位。目前开放床位数1500余张。2017年全年门急诊量470万人次，出院病人136071人次，分娩量33817人，在复旦最佳医院综合排名中连续6年进入百强。",
            "南方医科大学珠江医院是国家重点大学南方医科大学(原第一军医大学)的第二附属医院、第二临床医学院，坐落在广州市美丽的珠江南畔，是一所集医疗、教学、科研为一体的三甲综合性医院。医院现占地面积9.8万平方米，建筑面积31.5万平方米。编设专业科室54个，教研室30个，核定床位2000张，儿科分院即将建成。是全国首批“三级甲等”医院、国家“十二五”首批综合实力品牌医院、国家卫计委国际紧急救援中心网络医院、公立医院改革对口联系医院、国家“爱婴医院”、广东省首批社会医疗保险和社会工伤保险指定医疗机构、广州市医疗保险定点医疗机构最高信用等级评定“AAA”级单位，医院先后被评为全国百家改革创新医院、全国首批军民共建社会主义精神文明先进单位、全军“白求恩杯”优质服务先进单位、广东省用户满意工程先进单位、国家级“青年文明号”标兵示范单位，荣获全国“五一”劳动奖状。",
            "广州市第一人民医院（华南理工大学附属第二医院、广州消化疾病中心、广州医科大学附属市一人民医院）是广州市卫生和计划生育委员会下属大型综合性三级甲等医院，是广州地区医疗、教学、科研、干部保健的重要基地。始建于1899年（光绪25年），名为“城西方便所”，1953年与市立医院合并，解放后于1954年更名为“广州市第一人民医院”。医院由院本部、南沙医院和鹤洞分院三个院区组成。",
            "广州中医药大学第一附属医院是一所大型综合性中医医院，创建于1964年，是我国高等中医药临床教育、医疗、科研重要基地之一，为全国首批三级甲等中医医院、示范中医医院和首批广东省中医名院。2015年获批组建“广东省中医临床研究院”、设立“广州中医药大学岭南医学研究中心”。2016年2月成为广东省中医临床研究基地。先后荣获“全国‘五一’劳动奖状”、“全国卫生系统先进集体”、“全国职业道德先进单位”、“全国中医药应急工作先进集体”、“全国中医医院优质护理服务先进单位”、“广东省文明单位”等称号。1994年无偿救治身患股骨头坏死的好军嫂韩素云事迹饮誉全国，受到时任中央领导同志的赞扬和社会各界的好评。",
            "广东省第二人民医院(广东省应急医院)诞生于1947年，是一间集医疗、应急、教学、科研、预防、保健、康复为一体的综合性三级甲等医院，2004年被确定为广东省应急医院。医院建筑面积13.2万平方米;展开床位1500张，开设51个科室、51个专业，年门诊量100多万人次，住院收容3万多人次;现有博士后、博士、硕士研究生及高级职称人才400余人。"];
        var arr = [];
        var i = 0;
        while (i < MAX_COUNT_HOSPITAL) {
            arr.push({
                id: i,
                icon: g_appRootPath + "/Public/img/hd/HospitalDetails/icon-" + i + ".png",
                title: g_appRootPath + "/Public/img/hd/HospitalDetails/title-" + i + ".png",
                subjectTitle: g_appRootPath + "/Public/img/hd/HospitalDetails/subjectTitle-" + i + ".png",
                hospitalIntro: hospitalIntro[i],
            });
            i++;
        }
        return arr;
    }());

    hospitalObj = {
        title_move_N: 0, // 医院列表翻页参数
        details_move_N: 0, // 医院简介翻页参数（预留）
        init: function () {
            this.pageHtml();
        },
        // 渲染页面
        pageHtml: function () {
            var htm = '';
            var change_page_count = this.title_move_N;
            var cutLength = data.slice(change_page_count, change_page_count + 4);
            for (var i = 0; i < cutLength.length; i++) {
                htm += '<li>';
                htm += '<img  src=' + cutLength[i].icon + '>';
                htm += '<img id=hos-' + cutLength[i].id + '  src=' + cutLength[i].title + '>';
            }
            doc.getElementById("hospital-title-wrap").innerHTML = htm;
            this.createBtnObj(change_page_count, change_page_count + 4);
            this.toggleArrow(change_page_count);
        },
        // 动态创建虚拟按钮
        createBtnObj: function (start, end) {

            buttons = [{
                id: 'debug',
                name: '脚手架ID',
                type: 'img',
                nextFocusUp: '',
                nextFocusDown: 'hos-1',
                click: '',
                focusChange: "",
                beforeMoveChange: this.turnDetailsPage,
                moveChange: ""
            }];
            for (var j = start; j < end; j++) {
                buttons.push({
                    id: 'hos-' + j,
                    name: '医院焦点' + j,
                    type: 'img',
                    nextFocusUp: 'hos-' + (j - 1),
                    nextFocusDown: 'hos-' + (j + 1),
                    backgroundImage: g_appRootPath + '/Public/img/hd/HospitalDetails/title-' + j + '.png',
                    focusImage: g_appRootPath + '/Public/img/hd/HospitalDetails/title-' + j + '-f.png',
                    click: this.titleItemBeClick,
                    startFocus: start,
                    endFocus: (end - 1),
                    beforeMoveChange: this.turnPage,
                })
            }
            this.initButton(focusId);
        },
        // 移动元素
        turnPage: function (key, btn) {
            if (key == "up" && btn.startFocus == btn.id.slice(4)) hospitalObj.prevPage(btn);
            if (key == "down" && btn.endFocus == btn.id.slice(4)) hospitalObj.nextPage(btn);
        },
        // 上移动一个元素
        prevPage: function (btn) {
            focusId = btn.id;
            this.title_move_N = Math.max(0, this.title_move_N -= 1);
            this.pageHtml(btn.id);
        },
        // 下移动一个元素
        nextPage: function (btn) {
            focusId = btn.id;
            this.title_move_N = Math.min(data.length, this.title_move_N += 1);
            this.pageHtml(btn.id);
        },
        // 指示箭头切换
        toggleArrow: function (page) {
            H("prev-arrow");
            H("next-arrow");
            page != 0 && S("prev-arrow");
            page + 3 < data.length && S("next-arrow");
        },
        turnDetailsPage: function () {

        },
        // 医院标题被点击
        titleItemBeClick: function (btn) {
            focusId = btn.id;
            var cutId = btn.id.slice(4);
            hospitalObj.detailsPage(cutId)
        },
        // 医院详情界面
        detailsPage: function (cutId) {
            this.details_move_N = 1;
            var htm = '';
            var intro = data[parseInt(cutId)];
            doc.getElementById("hospital-title-wrap").innerHTML = (function () {
                var text = intro.hospitalIntro.slice(0, 235);
                var overflow = intro.hospitalIntro.length > 235 ? "……" : "";
                htm += '<li><img src=' + intro.subjectTitle + '></li>';
                htm += '<li id="details-wrap">' + text + overflow + '</li>';
                H("prev-arrow");
                H("next-arrow");
                return htm;
            }())
        },
        // 初始化选中焦点
        initButton: function (id) {
            LMEPG.ButtonManager.init(id, buttons, '', true)
        },
        onBack: function () {
            if (this.details_move_N) {
                this.details_move_N = 0;
                this.init();
            } else {
                LMEPG.Intent.back();
            }
        }
    };
    return hospitalObj;
}(document, Hospital || {}));

// 暴露框架全局返回函数
function onBack() {
    Hospital.onBack();
}

window.onload = function () {
    Hospital.init();
};