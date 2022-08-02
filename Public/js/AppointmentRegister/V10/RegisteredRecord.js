// 定义全局按钮
var buttons = [];

// 返回按键
function onBack() {
    Page.onBack();
}

// 页面跳转控制
var Page = {

    /**
     * 获取当前页面对象
     */
    getCurrentPage: function () {
        return LMEPG.Intent.createIntent("registeredRecord");
    },

    /**
     * 返回事件
     */
    onBack: function () {
        if (LMEPG.Func.isEmpty(RenderParam.isFromMyFamilyPage)) {
            // 跳转我的家
            var objSrc = null;
            // 贵州广电
            if (RenderParam.carrierId == "520094") {
                var objDst = LMEPG.Intent.createIntent("homeTab4");
                objDst.setParam("focusIndex", "recommended-2");
            }
            else if (RenderParam.carrierId == "520095") {
                var objDst = LMEPG.Intent.createIntent("appointmentRegister");
            }
            // 贵州电信
            else if (RenderParam.carrierId == "520092") {
                LMEPG.Intent.back();
                return;
            } else {
                LMEPG.Intent.back();
                return;
            }
            LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_CLEAR_TOP);
        } else {
            LMEPG.Intent.back();
        }
    },
    jumpTestPage: function () {
        var objCurrent = Page.getCurrentPage();

        var objHomeTab = LMEPG.Intent.createIntent('testEntrySet');
        objHomeTab.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objHomeTab, objCurrent);
    }
};

var Home = {
    defaultFocusId: "btn-detail-1",
    countDown:5,
    init: function () {
        RecordList.createHtml(RenderParam.records.list);
        Home.initButtons();
        var lastFocusId = LMEPG.Func.isEmpty(RenderParam.focusIndex) ? Home.defaultFocusId : RenderParam.focusIndex;
        LMEPG.BM.init(lastFocusId, buttons, "", true);

        for (var i = 0; i < RenderParam.page; i++) {
            RecordList.nextPage();
        }

        G('two-code').src = RenderParam.cwsGuaHaoUrl.replace('/lmzhjkpic','') + RenderParam.hospitalInfo.file_url

        var t = setInterval(function () {
            Home.countDown--
            if(Home.countDown === 0){
                clearInterval(t)
                G('pop-tip').style.display = 'none'
            }
        },1000)

        LMEPG.BM.requestFocus(lastFocusId);
    },

    initButtons: function () {
        buttons.push({
            id: 'default',
            name: '默认焦点',
            type: 'img',
            nextFocusLeft: '',
            nextFocusRight: '',
            nextFocusUp: '',
            nextFocusDown: '',
            backgroundImage: "",
            focusImage: "",
            click: "",
            focusChange: "",
            beforeMoveChange: "",
        });

        for (var i = 0; i < RecordList.count; i++) {
            buttons.push({
                id: 'btn-detail-' + (i + 1),
                name: '科室',
                type: 'div',
                nextFocusLeft: "",
                nextFocusRight: "",
                nextFocusUp: 'btn-detail-' + i,
                nextFocusDown: 'btn-detail-' + (i + 2),
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/bg_btn_1.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V10/HomeBox/f_btn_1.png",
                click: Home.goDetail,
                focusChange: Home.departFocus,
                beforeMoveChange: Home.onBeforeMoveChange,
            });
        }
    },

    departFocus: function (btn, hasFocus) {
        if (hasFocus) {
            LMEPG.CssManager.addClass(btn.id, "btn-hover");
        } else {
            LMEPG.CssManager.removeClass(btn.id, "btn-hover");
        }
    },

    // 获取文字订单状态
    getOrderStateDesc: function (orderState, payState) {
        var orderStateDesc;
        if (orderState == 2) orderStateDesc = "预约已取消";
        else if (orderState == 5) orderStateDesc = "已完成";
        else if (payState == 5) orderStateDesc = "退款中";
        else if (payState == 6) orderStateDesc = "已退款";
        else if (payState == 0) orderStateDesc = "已支付";
        else if (payState == 1 || payState == 9) orderStateDesc = "线下支付";
        else if (payState == 2 || payState == 4) orderStateDesc = "待支付";
        else if (payState == 3) orderStateDesc = "支付中";
        else if (payState == 7 || payState == 8) orderStateDesc = "退款失败";

        return orderStateDesc;
    },

    // 跳转详情
    goDetail: function (btn) {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("registrationDetails");
        var pos = parseInt(G(btn.id).getAttribute("pos"));
        objDst.setParam("order_id", RenderParam.records.list[pos].orderId);
        objDst.setParam('lastFocusIndex', LMEPG.BM.getCurrentButton().id);
        objDst.setParam("page", RecordList.page);
        LMEPG.Intent.jump(objDst, objSrc, LMEPG.Intent.INTENT_FLAG_DEFAULT);
    },

    // 焦点方向移动
    onBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'up':
                if (current.id == "btn-detail-1") {
                    RecordList.prevPage();
                    return false;
                }
                break;
            case 'down':
                if (current.id == "btn-detail-2") {
                    RecordList.nextPage();
                    return false;
                }
                break;
        }
    },
    onKeyDown: function (code) {
        switch (code) {
            case KEY_3:
                var keys = LMEPG.KeyEventManager.getKeyCodes();
                if (keys.length >= 4) {
                    if (keys[keys.length - 1] == KEY_3
                        && keys[keys.length - 2] == KEY_8
                        && keys[keys.length - 3] == KEY_9
                        && keys[keys.length - 4] == KEY_3) {
                        // 进入测试服
                        Page.jumpTestPage();
                    }
                }
                break;
        }
    }
}

var RecordList = {
    count: 2,
    page: 0,
    // 翻页数据截取
    cut: function (arr, atMove, count) {
        return arr.slice(atMove, atMove + count);
    },
    hospitalData: {
        "list": [{
            "name": "刘明",
            "price": "80元",
            "hospital_name": "第一人民医院",
            "img_url": Home.defaultUrl + "text_8.png",
            "status": "预约已取消",
            "department": "一号门诊部",
            "position": "主治医师",
            "time": "2018-11-16 周五 上午 10：45 16号"
        },
            {
                "name": "张欢",
                "price": "80元",
                "hospital_name": "儿童医院",
                "img_url": Home.defaultUrl + "text_8.png",
                "status": "预约已取消",
                "department": "外科",
                "position": "主治医师",
                "time": "2018-11-16 周五 上午 10：45 16号"
            }, {
                "name": "延安",
                "price": "80.00元",
                "hospital_name": "第儿人民医院",
                "img_url": Home.defaultUrl + "text_8.png",
                "status": "预约已取消",
                "department": "手术科",
                "position": "主治医师",
                "time": "2018-11-16 周五 上午 10：45 16号"
            }, {
                "name": "几环",
                "price": "80.00元",
                "hospital_name": "第一人民医院",
                "img_url": Home.defaultUrl + "text_8.png",
                "status": "预约已取消",
                "department": "监测科",
                "position": "主治医师",
                "time": "2018-11-16 周五 上午 10：45 16号"
            }, {
                "name": "张兵",
                "price": "80.00元",
                "hospital_name": "第一人民医院",
                "img_url": Home.defaultUrl + "text_8.png",
                "status": "1",
                "department": "男科",
                "position": "主治医师",
                "time": "2018-11-16 周五 上午 10：45 16号"
            }]
    },

    createHtml: function (data) {
        if (RenderParam.records.code != 0) {
            LMEPG.UI.showToast("数据加载失败");
            Home.defaultFocusId = "default";
            return;
        }
        if (data.length == 0) {
            G("null-data").style.display = "block";
        }

        var sHtml = "";
        data = RecordList.cut(data, this.page, this.count);
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var orderStateDesc = Home.getOrderStateDesc(data[i].orderState, data[i].payState);
            var time = item.shiftDate + " " + item.shiftWeek + " " + item.timeRangeName;
            if (item.igsBillNo != null && item.igsBillNo.length > 0 && item.igsOrder != null && item.igsOrder.length > 0)
                time += " " + item.timeSection + " " + item.igsOrder + "号";
            sHtml += '<div class="detail-info border">';
            sHtml += '<dl> <dt>' + data[i].hospitalName + '<div class="status">' + orderStateDesc + '</div></dt>';
            sHtml += '<dd>患者姓名：' + data[i].patientName + '</dd>';
            sHtml += '<dd>科室医生：' + data[i].hdeptName + ' <span>' + data[i].expertName + '</span></dd>';
            sHtml += '<dd>就诊时间：' + time + '</dd>';
            sHtml += '<dd>合计费用：' + data[i].orderPrice + '元</dd> </dl>';
            sHtml += '<div id="btn-detail-' + (i + 1) + '" class="btn-detail btn-bg" pos="' + (i + this.page) + '">查看详情</div>';
            sHtml += '</div>';
        }
        sHtml += '</div>';
        G("center").innerHTML = sHtml;

        // 最后一页，隐藏下箭头
        if (this.page >= RenderParam.records.list.length - this.count) {
            H("m-next");
        } else {
            S("m-next");
        }
    },

    /**
     * 下一页
     */
    nextPage: function () {
        if (this.page < RenderParam.records.list.length - this.count) {
            this.page++;
            this.createHtml(RenderParam.records.list);
            LMEPG.BM.requestFocus("btn-detail-2");
        }
    },

    /**
     * 上一页
     */
    prevPage: function () {
        if (this.page > 0) {
            this.page--;
            this.createHtml(RenderParam.records.list);
            LMEPG.BM.requestFocus("btn-detail-1");
        }
    }
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    Home.init();
};

LMEPG.KeyEventManager.addKeyEvent(
    {
        KEY_3: Home.onKeyDown
    }
);