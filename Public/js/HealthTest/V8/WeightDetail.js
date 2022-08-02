/**
 * 数据归档js
 */
var isFirstEnter = true; // 第一次进入加载数据
var TestRecord = {
    buttons: [],
    maxPage: 0,
    keepFocusId: 'write-data', // 当前选中的tab
    scollType: [0, -300, -800, -1000,-1110],
    totalData: 0,
    data:null,
    init: function () {
        this.keepFocusId = RenderParam.keepFocusId;
        this.createButtons();

        this.getWeightDetail(function (data) {
            TestRecord.createHtml(data);
        })
    },

    getWeightDetail:function(cb){
        var json = {
            "age":RenderParam.age,
            "sex":RenderParam.sex,
            "weightUnit":1,
            "weight":RenderParam.weight,
            "height":RenderParam.height/100,
            "resistance":RenderParam.resistance
        }


        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('NewHealthDevice/getWeightDetail',{
           json:JSON.stringify(json)
        },function (res) {
            console.log(res)
            LMEPG.UI.dismissWaitingDialog();
            if(res.code === 200){
                TestRecord.data = res
                cb&&cb(res)
            }
        })
    },


    typeMap: function (name) {
        switch (name) {
            case "偏瘦":
                return 1;
            case "偏低":
                return 1;
                break;
            case "理想":
                return 2;
                break;
            case "偏胖":
                return 3;
            case "偏高":
                return 3;
            case "健美型":
                return 1;
                break;
            case "肥胖":
                return 4;
                break;
            case "标准":
                return 3;
                break;
            default:
                return 2;
                break

        }
    },

    createHtml: function (data) {
        G("time").innerHTML = RenderParam.time;
        G("weight-num").innerHTML = RenderParam.weight;
        G("fat-num").innerHTML =(data.data && (RenderParam.resistance !== 'null' && RenderParam.resistance !== '0.0'))?(data.data.pbf + '%') : "未测体脂率";
        G("fat-type").innerHTML = data.data?data.data.bodyStyle :'暂无';
        G("weight-type-icon").src = g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/fat_' + (this.typeMap(data.bodyStyle)) + '.png';
        G("fat-cont").innerHTML = data.dataAnalysis?data.dataAnalysis.bodyAdviceText : '暂无建议';

        G("BMI-icon").innerHTML = 'BMI';
        G("BMI").innerHTML =data.dataAnalysis? data.dataAnalysis.labelList[0].labelValue : 0;

        var strHtml = "";
        var temp = 0;
        TestRecord.totalData = data.data;
        if (RenderParam.resistance === 'null' || RenderParam.resistance === '0.0') {
            var item = G("weight-type");
            G("warm").style.display = "block";
            item.parentNode.removeChild(item);
            G("BMI-type").style.top = "40px";
            G("fat-list").style.height = "0px";

            LMEPG.BM.getButtonById('delete').nextFocusUp = 'BMI-bg'
        }
        // Decimal round
        if (!Math.round10) {
            Math.round10 = function (value, exp) {
                return TestRecord.decimalAdjust('round', value, exp);
            };
        }
        if( RenderParam.resistance !== 'null' && RenderParam.resistance !== '0.0'){
            for (var i = 0; i < data.dataAnalysis.labelList.length; i++) {
                if (temp == 4 || temp == 9) {
                    temp = 1;
                } else {
                    temp++
                }

                var bgImg2 = g_appRootPath + "/Public/img/hd/HealthTest/V8/weight/fat_h_" +TestRecord.typeMap(data.dataAnalysis.labelList[i].labelLevelName) + ".png";
                strHtml += '<div class="fat-box">';
                strHtml += '<img id="fat-' + i + '" class="fat-bg" src="' + g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/type_bg_' + temp + '.png" alt="" data-link="' + i + '">';
                strHtml += '<div class="fat-content">';
                strHtml += '<div class="fat-list-name">' + data.dataAnalysis.labelList[i].label + '</div>';
                strHtml += ' <div class="quantity">' + Math.round10(data.dataAnalysis.labelList[i].labelValue, -2) + data.dataAnalysis.labelList[i].labelUnit + '</div>';
                strHtml += ' <div class="fat-icon" style="background: url(' + bgImg2 + ')" >' + data.dataAnalysis.labelList[i].labelLevelName + '</div>';
                strHtml += ' </div></div>';
            }
            G("fat-list").innerHTML = strHtml;

            G('delete').style.left = '250px'
        }

        G("scroll").style.top = parseInt(RenderParam.scroll) + "px";
        LMEPG.BM.requestFocus(TestRecord.keepFocusId);
    },
    decimalAdjust: function (type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    },


    /**
     * 删除一条已归档数据
     * @param measureId
     */
    deleteArchiveRecord: function () {
        LMEPG.UI.showWaitingDialog('');
        LMEPG.ajax.postAPI('NewHealthDevice/deleteTestRecord', {
            memberId:RenderParam.member_id,
            paperType:'4',
            dataUuid:JSON.stringify([RenderParam.id]),
            abnormalCount:0
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if(data.code === 200){
                LMEPG.UI.showToast('删除成功！');
                onBack();
            } else {
                LMEPG.UI.showToast('删除失败！');
            }
        });
    },

    onFocusChange: function (btn, has) {
        if (has) {
            LMEPG.CssManager.addClass(btn.id, "focus");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "focus");
        }
    },

    onBeforeMoveChangeScrollDistance: function (key, btn) {
        switch (true) {
            case key == 'down' && btn.id == 'BMI-bg':
                if ( RenderParam.resistance !== 'null' && RenderParam.resistance !== '0.0') {//
                    G("scroll").style.top = TestRecord.scollType[2] + "px";
                    LMEPG.BM.requestFocus("fat-0");
                } else {
                    LMEPG.BM.requestFocus("delete");
                }
                return false;
                break;
            case key == 'up' && (btn.id == 'fat-0' || btn.id == 'fat-1' || btn.id == 'fat-2' || btn.id == 'fat-3'):
                G("scroll").style.top = TestRecord.scollType[1] + "px";
                LMEPG.BM.requestFocus("BMI-bg");
                return false
                break;
            case key == 'down' && (btn.id == 'write-data' || btn.id == 'fat-test'):
                G("scroll").style.top = TestRecord.scollType[1] + "px";
                break;
            case key == 'up' && btn.id == 'BMI-bg':
                G("scroll").style.top = TestRecord.scollType[0] + "px";
                return
                break;
            case key == 'down' && (btn.id == 'fat-4' || btn.id == 'fat-5' || btn.id == 'fat-6' || btn.id == 'fat-7'):
                G("scroll").style.top = TestRecord.scollType[3] + "px";
                break
            case key == 'down' && (btn.id == 'fat-8' || btn.id == 'fat-9' || btn.id == 'fat-10' || btn.id == 'fat-11'):
                LMEPG.BM.requestFocus("fat-12");
                G("scroll").style.top = TestRecord.scollType[4] + "px";
                return false
                break
            case key == 'up' && btn.id == 'fat-12':
                G("scroll").style.top = TestRecord.scollType[3] + "px";
                break;
            case key == 'down' && btn.id == 'fat-12':
                LMEPG.BM.requestFocus("delete");
                break
            case key == 'up' && (btn.id == 'fat-4' || btn.id == 'fat-5' || btn.id == 'fat-6' || btn.id == 'fat-7'):
                G("scroll").style.top = TestRecord.scollType[2] + "px";
                break;


        }
    },
    createButtons: function () {
        this.buttons.push({
                id: 'write-data',
                name: '体脂数据输入',
                type: 'img',
                nextFocusRight: 'fat-test',
                nextFocusDown: 'BMI-bg',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/fat_input.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/fat_input_f.png',
                click: PageJump.jumpTest,
                beforeMoveChange: this.onBeforeMoveChangeScrollDistance,
                cName: 'inputTest'
            }, {
                id: 'fat-test',
                name: '体脂检测',
                type: 'img',
                nextFocusLeft: 'write-data',
                nextFocusDown: 'BMI-bg',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/fat_test.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/fat_test_f.png',
                click: PageJump.jumpTest,
                beforeMoveChange: this.onBeforeMoveChangeScrollDistance,
                cName: 'testIndex'
            }, {
                id: 'BMI-bg',
                name: '体脂检测',
                type: 'img',
                nextFocusUp: 'write-data',
                nextFocusDown: 'fat-0',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/bmi.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/bmi_f.png',
                click: PageJump.jumpIntroduce,
                beforeMoveChange: this.onBeforeMoveChangeScrollDistance
            },
            {
                id: 'delete',
                name: '滚动条',
                type: 'img',
                nextFocusUp: 'fat-12',
                backgroundImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/delete.png',
                focusImage: g_appRootPath + '/Public/img/hd/HealthTest/V8/weight/delete_f.png',
                click: this.deleteArchiveRecord,
                beforeMoveChange: this.onBeforeMoveChangeScrollDistance
            }
        );
        var count = 13;
        while (count--) {
            this.buttons.push({
                id: 'fat-' + count,
                name: '列表删除焦点',
                type: 'img',
                nextFocusUp: 'fat-' + (count - 4),
                nextFocusDown: 'fat-' + (count + 4),
                nextFocusRight: 'fat-' + (count + 1),
                nextFocusLeft: 'fat-' + (count - 1),
                click: PageJump.jumpIntroduce,
                focusChange: this.onFocusChange,
                beforeMoveChange: this.onBeforeMoveChangeScrollDistance
            });
        }
        LMEPG.BM.init(TestRecord.keepFocusId, this.buttons, '', true);
    },

};

/**
 * ============================================健康检测相关===============================================
 */

/**
 * ===========================================页面跳转==============================================
 */
var PageJump = {
    /**
     * 获取当前页面
     * @returns {*|{name, param, setPageName, setParam}}
     */
    getCurrentPage: function () {
        var objCurrent = LMEPG.Intent.createIntent('weight-detail');
        objCurrent.setParam("measureId", RenderParam.measureId);
        objCurrent.setParam("weight", RenderParam.weight);
        objCurrent.setParam('keepFocusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('page', TestRecord.page);
        objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam('member_id', RenderParam.member_id);
        objCurrent.setParam('member_image_id', RenderParam.member_image_id);
        objCurrent.setParam('member_name', RenderParam.member_name);
        objCurrent.setParam('scroll', parseInt(G("scroll").style.top));
        objCurrent.setParam('time', RenderParam.time);
        objCurrent.setParam('fat', G("fat-num").innerHTML);

        objCurrent.setParam('height', RenderParam.height);
        objCurrent.setParam('age', RenderParam.age);
        objCurrent.setParam('sex', RenderParam.sex);
        objCurrent.setParam('id', RenderParam.id);
        objCurrent.setParam('resistance', RenderParam.resistance)
        return objCurrent;
    },
    /**
     * 删除一条已归档数据
     * @param measureId
     */
    jumpRecordDetail: function (btn) {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent('weight-introduce');
        var measureId = G(btn.id).getAttribute("data-link");
        dstPage.setParam("measureId", measureId);
        dstPage.setParam('member_id', RenderParam.member_id);
        dstPage.setParam('member_image_id', RenderParam.member_image_id);
        dstPage.setParam('member_name', RenderParam.member_name);
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 删除一条已归档数据
     * @param measureId
     */
    jumpTest: function (btn) {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent(btn.cName);
        dstPage.setParam('type', "体脂");
        LMEPG.Intent.jump(dstPage, curPage);
    },

    /**
     * 删除一条已归档数据
     * @param measureId
     */
    jumpIntroduce: function (btn) {
        var curPage = PageJump.getCurrentPage();
        var dstPage = LMEPG.Intent.createIntent("weight-introduce");
        dstPage.setParam("measureId", RenderParam.measureId);
        dstPage.setParam('member_id', RenderParam.member_id);
        dstPage.setParam("weight", RenderParam.weight);
        if (btn.id == "BMI-bg") {
            if(!TestRecord.data.dataAnalysis)
                return
            dstPage.setParam("fatType", JSON.stringify(TestRecord.data.dataAnalysis.labelList[0]));
        } else {
            dstPage.setParam("fatType", JSON.stringify(TestRecord.data.dataAnalysis.labelList[G(btn.id).getAttribute("data-link")]));
        }
        LMEPG.Intent.jump(dstPage, curPage);
    },
};

var onBack = function () {
    LMEPG.Intent.back();
};