/**
 * Created by Administrator on 2018/12/28.
 */
// 定义全局按钮
var buttons = [];
var imgUrl = g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Family/V10/";

// 返回按键
function onBack() {
    Page.onBack();
}

//页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent("recordDetail");
        return currentPage;
    },


    /**
     * 返回事件
     */
    onBack: function () {
        LMEPG.Intent.back();
    }
};

var Home = {
    defaultFocusId: "btn-1",
    //页面初始化操作
    init: function () {
        Home.initButtons();  // 初始化焦点按钮
        Department.createHtml(RenderParam.recordDetail.list)
        // var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.ButtonManager.init(Home.defaultFocusId, buttons, "", true);
    },

    initButtons: function () {
        buttons.push({
            id: "center",
            name: '数据列表',
            type: 'div',
            nextFocusLeft: "",
            nextFocusRight: "",
            nextFocusUp: "",
            nextFocusDown: "",
            backgroundImage: "",
            focusImage: "",
            click: "",
            focusChange: Home.listFocus,
            beforeMoveChange: Home.onBeforeMoveChange,
            cType: "region",
        });
        for (var i = 0; i < Department.leftCount; i++) {
            buttons.push({
                id: 'btn-' + (i + 1),
                name: '测试类型',
                type: 'div',
                nextFocusLeft: "",
                nextFocusRight: "center",
                nextFocusUp: 'btn-' + i,
                nextFocusDown: 'btn-' + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V10/HomeBox/bg_btn_1.png",
                focusImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V10/HomeBox/f_btn_1.png",
                selectedImage: g_appRootPath + "/Public/img/" + RenderParam.platformType + "/Home/V10/HomeBox/select_btn_1.png",
                click: "",
                focusChange: Home.departFocus,
                beforeMoveChange: Home.onBeforeMoveChange,
                cType: "region",
                groupId: "department",
            });
        }
    },
    selectEnter: function (btn) {
        var currentId = LMEPG.ButtonManager.getSelectedButton("department").id;
        LMEPG.ButtonManager.requestFocus(btn.id);
    },
    // 推荐位按键移动
    onBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                if (current.id == "center") {
                    var currentId = LMEPG.ButtonManager.getSelectedButton("department").id;
                    LMEPG.ButtonManager.requestFocus(currentId);
                } else {
                }
                break;
            case 'right':
                if (current.id.substring(0, 3) == "btn") {
                    LMEPG.ButtonManager.setSelected(current.id, true);
                    LMEPG.CssManager.addClass(current.id, "btn-selected");
                }
                break;
            case 'up':
                if (current.id == 'center') {
                    Department.prevPage();
                    return false;
                }
                break;
            case 'down':
                if (current.id == 'center') {
                    Department.nextPage();
                    return false;
                }
                break;
        }
    },


    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            // LMEPG.CssManager.removeClass(btn.id, "btn-select");
            // LMEPG.CssManager.addClass(btn.id, "btn-hover");
            // LMEPG.CssManager.addClass("card", "border");
            // 创建对应的数据
            // Home.createHtml(data);

            LMEPG.BM.setSelected(btn.id, false);

            LMEPG.CssManager.removeClass(btn.id, "btn-selected");

            // “血糖”“胆固醇”“尿酸”按钮获取焦点，加载对应数据
            if (btn.id == "btn-1") {
                Department.getSpecifyRecordList(1);
            } else if (btn.id == "btn-2") {
                Department.getSpecifyRecordList(2);
            } else if (btn.id == "btn-3") {
                Department.getSpecifyRecordList(4);
            }
        } else {
            // LMEPG.CssManager.removeClass(btn.id, "btn-hover");
            // LMEPG.CssManager.removeClass("card", "border");
        }
    },

    listFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "border2");
            G(btn.id).style.overflow = "auto";
        } else {
            LMEPG.CssManager.removeClass(btn.id, "border2");
            G(btn.id).style.overflow = "hidden";
        }
    },

}

var Department = {
    leftCount: 3,
    page: 0,
    count: 8,
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    createHtml: function (data) {
        // 设置家庭成员信息
        G("photo").src = imgUrl + "icon_member_" + RenderParam.member_image_id + ".png";
        G("name").innerHTML = RenderParam.member_name;

        if (RenderParam.recordDetail.result != 0) {
            LMEPG.UI.showToast("数据加载失败！");
            return;
        }

        if (data.length == 0) {
            G("null-data").style.display = "block";
        } else {
            G("null-data").style.display = "none";
        }

        var htmlStr = "";
        htmlStr += '<table>';
        data = this.cut(data, this.page, this.count);
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            // 获取时段和就餐状态
            var momentStr = "";
            if (RenderParam.momentData != null) {
                var repast_id = item.repast_id;
                var timebucket_id = item.timebucket_id;
                if (repast_id != "-1") {
                    for (var j = 0; j < RenderParam.momentData.repast.length; j++) {
                        if (repast_id == RenderParam.momentData.repast[j].repast_id) {
                            momentStr = RenderParam.momentData.repast[j].repast_name;
                            break;
                        }
                    }
                }
                if (timebucket_id != "-1") {
                    for (var j = 0; j < RenderParam.momentData.timebuckets.length; j++) {
                        if (timebucket_id == RenderParam.momentData.timebuckets[j].timebucket_id) {
                            momentStr = RenderParam.momentData.timebuckets[j].timebucket_name;
                            break;
                        }
                    }
                }
            }
            // 返回测量数据的范围值以及文字颜色
            var metricalRange = this.getMetricalRange(item.paper_type, RenderParam.member_gender, item.repast_id, item.measure_data);
            var textColor = "";
            switch (metricalRange) {
                case "高":
                    textColor = "red";
                    break;
                case "偏高":
                    textColor = "brown";
                    break;
                case "正常":
                    textColor = "green";
                    break;
                case "低":
                    textColor = "yellow";
                    break;
            }

            htmlStr += " <tr>";
            htmlStr += '<td>' + item.measure_dt + '</td>';
            htmlStr += '<td>' + momentStr + '</td>';
            htmlStr += '  <td>' + item.measure_data + ' ' + Measure.getUnitText(item.paper_type) + '</td>';
            htmlStr += '  <td class="' + textColor + '">' + metricalRange + '</td>';//根据不同状态加载不同样式显示颜色：高red,偏高brown,正常green,低yellow
            htmlStr += '  </tr>';
        }
        htmlStr += '</table>';
        G("center").innerHTML = htmlStr;

        // 最后一页，隐藏下箭头
        if (this.page >= RenderParam.recordDetail.list.length - this.count) {
            H("m-next");
        } else {
            S("m-next");
        }
    },

    /**
     * 下一页
     */
    nextPage: function () {
        if (this.page < RenderParam.recordDetail.list.length - this.count) {
            this.page++;
            this.createHtml(RenderParam.recordDetail.list);
        }
    },

    /**
     * 上一页
     */
    prevPage: function () {
        if (this.page > 0) {
            this.page--;
            this.createHtml(RenderParam.recordDetail.list);
        }
    },

    /**
     * 返回测量数据的范围值
     * @param paperType
     * @param userSex
     * @param repastId
     * @param value
     * @returns {*}
     */
    getMetricalRange: function (paperType, userSex, repastId, value) {
        paperType = parseInt(paperType);
        userSex = parseInt(userSex);
        repastId = parseInt(repastId);
        value = parseFloat(value);

        var metricalRange = "正常";
        // 1.	空腹血糖（凌晨、空腹、午餐前、晚餐前、睡前）：3.9≤空腹≤6.1mmol/L为正常， 6.1＜空腹≤7.0 mmol/L为偏高，空腹＞7.0为高，空腹＜3.9为低；
        // 4.	非空腹血糖（早餐后、午餐后、晚餐后）：4.4≤非空腹≤7.8mmol/L为正常， 7.8＜非空腹≤11.1 mmol/L为偏高，非空腹＞11.1为高，非空腹＜4.4为低；
        if (paperType == 1) {
            //血糖标准 //1、凌晨、2、空腹、3、早餐后、4、午餐前、5、午餐后、6、晚餐前、7、晚餐后、8、睡前
            switch (repastId) {
                case 1:
                case 2:
                case 4:
                case 6:
                case 8:
                    //空腹血糖
                    if (value < 3.9) {
                        //低
                        metricalRange = "低";
                    } else if (value >= 3.9 && value <= 6.1) {
                        //正常
                        metricalRange = "正常";
                    } else if (6.1 < value && value <= 7.0) {
                        //偏高
                        metricalRange = "偏高";
                    } else if (value > 7.0) {
                        //高
                        metricalRange = "高";
                    }
                    break;
                case 3:
                case 5:
                case 7:
                    //非空腹血糖
                    if (value < 4.4) {
                        //低
                        metricalRange = "低";
                    } else if (value >= 4.4 && value <= 7.8) {
                        //正常
                        metricalRange = "正常";
                    } else if (7.8 < value && value <= 11.1) {
                        //偏高
                        metricalRange = "偏高";
                    } else if (value > 11.1) {
                        //高
                        metricalRange = "高";
                    }
                    break;
            }
        } else if (paperType == 2) {
            //胆固醇 1. 2.8≤胆固醇≤5.17mmol/L为正常，5.17＜胆固醇≤6.0mmol/L为偏高，6.0mmol/L＜胆固醇为高，胆固醇＜2.8mmol/L为低。
            if (value < 2.8) {
                metricalRange = "低";
            } else if (value >= 2.8 && value <= 5.17) {
                metricalRange = "正常";
            } else if (value > 5.17 && value <= 6.0) {
                metricalRange = "偏高";
            } else if (value > 6.0) {
                metricalRange = "高";
            }
        } else if (paperType == 3) {
            //甘油三酯// 0.56≤甘油三酯≤1.7mmol/L为正常；1.7＜甘油三酯≤2.2mmol/L为偏高，甘油三酯＞2.2mmol/L为高，甘油三酯＜0.56mmol/L为低。
            if (value < 0.56) {
                metricalRange = "低";
            } else if (value >= 0.56 && value <= 1.7) {
                metricalRange = "正常";
            } else if (value > 1.7 && value <= 2.2) {
                metricalRange = "偏高";
            } else if (value > 2.2) {
                metricalRange = "高";
            }
        } else if (paperType == 4) {
            //尿酸  男：149≤尿酸≤416 umol/L为正常。尿酸＜149 umol/L为低，416 umol/L＜尿酸为高。
            // 女：89≤尿酸≤357 umol/L为正常。尿酸＜89 umol/L为低，357 umol/L＜尿酸为高
            if (userSex == 0) {
                //男
                if (value < 149) {
                    metricalRange = "低";
                } else if (value >= 149 && value <= 416) {
                    metricalRange = "正常";
                } else if (value > 416) {
                    metricalRange = "高";
                }
            } else {
                //女
                if (value < 89) {
                    metricalRange = "低";
                } else if (value >= 89 && value <= 357) {
                    metricalRange = "正常";
                } else if (value > 357) {
                    metricalRange = "高";
                }
            }
        }
        return metricalRange;
    },

    /**
     * 获取指定类型的检测记录
     * @param paperType
     */
    getSpecifyRecordList: function (paperType) {
        LMEPG.UI.showWaitingDialog("");
        LMEPG.ajax.postAPI("Measure/queryMemberInspectRecord", {
            "paperType": paperType,
            "memberId": RenderParam.member_id
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            console.log(data);

            if (!(data instanceof Object)) {
                data = JSON.parse(data);
            }
            if (data.result == 0) {
                RenderParam.recordDetail.list = data.list;
                Department.page = 0;
                Department.createHtml(data.list)
            }
        });
    },
};

window.onload = function () {
    Home.init();
};