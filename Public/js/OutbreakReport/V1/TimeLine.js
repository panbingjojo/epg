var buttons = [];
var Page = {
    defaultFocusId: "news-1",
    num: 20,
    topKey: 0,
    contentMax:0,
    isScroll:true,
    //页面初始化操作
    init: function () {
        Page.creatHtml();
        LMEPG.BM.init(Page.defaultFocusId, buttons, "", true);
        Page.contentMax = G('scroll').offsetHeight - 560
    },

    onFocus: function (btn, has) {
        if (has) {
            // G(btn.id).style.background = "#ea5858";
            // G(btn.id).style.color = "#fff";
        } else {
            // G(btn.id).style.background = "#fff";
            // G(btn.id).style.color = "#0e3462";
        }
    },

    creatHtml: function () {
        if (RenderParam.epidemicRealSowing.code != 0) {
            LMEPG.UI.showToastV1("获取数据失败！");
            return;
        }

        var dataList = RenderParam.epidemicRealSowing.data;

        var dom = G("news-list");
        dom.innerHTML = "";
        var strHtml = "";
        var item = "";
        strHtml += '<marquee id="scroll" style="position: absolute;top: 0;height: 550px;width: 100%" direction="up" scrollamount="4" behavior="scroll">';
        for (var i = 0; i < dataList.length; i++) {
            item = dataList[i];

            // 分割时间 2020-01-29 16:56:00 ---> 2020-01-29与16:56:00
            var times = item.news_dt.split(" ");
            strHtml += '<div id="news-' + (i + 1) + '" class="news-box">';
            strHtml += '<div class="time">' + times[0] + '<br/><span class="date-time">' + times[1] + '</span></div>'; // 时间
            strHtml += '<img class="icon-dian" src=' + g_appRootPath+ '/Public/img/hd/OutbreakReport/V1/dian.png  />';
            strHtml += '<div class="line"></div>';
            strHtml += ' <div class="news-title">';
            if (i == 0) {
                // 最新的图标
                strHtml += ' <img class="icon-news" src=' + g_appRootPath + '/Public/img/hd/OutbreakReport/V1/new.png  />';
            }
            strHtml += item.title; // 标题
            strHtml += ' </div>';
            strHtml += ' <div class="news-content">' + item.summarize + '</div>'; // 内容
            strHtml += ' <div class="resource" style="text-align: right">' + item.comes + '</div> </div>'; // 信息来源

            buttons.push({
                id: 'news-' + (i + 1),
                name: '按钮',
                type: 'img',
                nextFocusLeft: "",
                nextFocusRight: "",
                nextFocusUp: 'news-' + i,
                nextFocusDown: 'news-' + (i + 2),
                focusChange: Page.onFocus,
                beforeMoveChange: '',
                click: Page.stopAndBegin
            });
        }
        strHtml += '</marquee>';
        dom.innerHTML = strHtml;
    },

    stopAndBegin:function(){
        if(Page.isScroll){
            G('scroll').stop()
            Page.isScroll = false
        }else {
            G('scroll').start()
            Page.isScroll = true
        }

    },

    switchPage: function (dir, current) {
        switch (dir) {
            case "up":
                if (parseInt(G("scroll").style.top) < 0) {
                    Page.topKey = Page.topKey + Page.num;
                    G("scroll").style.top = Page.topKey + "px"
                }
                break;
            case "down":
                if (parseInt(G("scroll").style.top) > -(Page.contentMax)){
                    Page.topKey = Page.topKey - Page.num;
                    G("scroll").style.top = Page.topKey + "px";
                }
                break;
        }
    }

}

function onBack() {
    LMEPG.Intent.back()
}