/**
 * Created by Administrator on 2019/8/16.
 */
/**
 * 界面部分
 */
var Pages = {
    page: 0,
    maxPage: 0,
    buttons: [],
    status: 1,//文本
    init: function () {
        var templateData =RenderParam.templateData || '';
        var content =templateData.content || '';
        if (!templateData || !content && content.length === 0) {
            LMEPG.UI.showToast('图文信息为空，即将返回',2,function () {
                LMEPG.Intent.back();
            });
            return;
        }
        this.createBtns();
        this.maxPage = RenderParam.templateData.content.length - 1;
        if (RenderParam.templateData.content[0].txt == "") {
            Pages.createImgAblum();//拉取图片专辑
            this.status = 0;
        } else {
            this.renderImg();//拉取文字专辑
            Template.getTemplate_id();
        }

        LMEPG.ButtonManager.init('img-current', this.buttons, '', true);
        if(RenderParam.carrierId == "371092" || RenderParam.carrierId == "371002"){
            this.HanKanHoleStat();
        }
    },
    HanKanHoleStat:function(){
        var turnPageInfo = {
            currentPage : "index.php/Album/Album/index/?userId=0&albumName=GraphicAlbum&inner=1",
            turnPage : window.location.href,
            turnPageName : RenderParam.templateData.title,
            turnPageId: RenderParam.templateData.union_code
        };
        ShanDongHaiKan.sendReportData('6', turnPageInfo);
    },
    createBtns: function () {
        this.buttons = [
            {
                id: 'back',
                name: '返回',
                type: 'img',
                nextFocusDown: 'focus-1',
                click: onBack,
                backgroundImage: g_appRootPath + '/Public/img/hd/Menu/QHotherPages/back.png',
                focusImage: g_appRootPath + '/Public/img/hd/Menu/QHotherPages/back_f.png'
            }, {
                id: 'img-current',
                name: '图文容器',
                type: 'img',
                nextFocusDown: 'focus-1',
                beforeMoveChange: this.onBeforeMoveChange
            }];
    },
    onBeforeMoveChange: function (key, btn) {

        if (key == 'left') {
            Pages.prevPage();
        }
        if (key == 'right') {
            Pages.nextPage();
        }
    },
    createImgAblum: function () {
        var img = RenderParam.templateData.content[Pages.page].img;
        G('img-current').src = RenderParam.ftpUrl + img;
        this.toggleArrow();
        G("pages").innerHTML = parseInt(this.page + 1) + "/" + parseInt(this.maxPage + 1);
    },
    renderImg: function () {
        var str = '';
        str = Template.HTMLDecode(RenderParam.templateData.content[this.page].txt);
        if (RenderParam.platformType == "hd") {
            G("content").innerHTML = str;
        } else {
            G("content").innerHTML = LMUtils.marquee.start({txt: str, len: 100, dir: 'up', vel: 4});
        }
        this.toggleArrow();
        G("pages").innerHTML = parseInt(this.page + 1) + "/" + parseInt(this.maxPage + 1);
    },
    prevPage: function () {
        this.page = Math.max(0, this.page -= 1);
        if (this.status == 1) {
            this.renderImg();
        } else {
            this.createImgAblum();
        }
    },
    nextPage: function () {
        this.page = Math.min(this.maxPage, this.page += 1);
        if (this.status == 1) {
            this.renderImg();
        } else {
            this.createImgAblum();
        }
    },
    toggleArrow: function () {
        S('left-arrow');
        S('right-arrow');
        this.page == 0 && H('left-arrow');
        this.page == this.maxPage && H('right-arrow');
        console.log(this.page, this.maxPage)
    },

}
/**
 * 模板部分
 */
var Template = {
    createTemplateType: function (data) {
        var positionParam = [];
        if (RenderParam.platformType == "hd") {
            G('img-current').src = RenderParam.ftpUrl + data.img_url.gq.bg;
            positionParam.push(data.location.gq.top);
            positionParam.push(data.location.gq.left);
            positionParam.push(data.location.gq.width);
            positionParam.push(data.location.gq.height);
        } else {
            G('img-current').src = RenderParam.ftpUrl + data.img_url.bq.bg;
            positionParam.push(data.location.bq.top);
            positionParam.push(data.location.bq.left);
            positionParam.push(data.location.bq.width);
            positionParam.push(data.location.bq.height);
        }
        Template.setClass(positionParam);

    },
    /**
     * 获取模板背景
     */
    getTemplate_id: function () {
        var reqData = {
            "template_id": RenderParam.templateData.template_id
        };
        LMEPG.ajax.postAPI('Common/queryAlbumTemplate', reqData,
            function (data) {
                try {
                    var result = data.result;
                    if (result == 0) {
                        Template.createTemplateType(data.data)
                    } else { // 设置号码失败
                        LMEPG.UI.showToast("没有拿到模板！" + data.result);
                    }
                } catch (e) {
                    LMEPG.UI.showToast("获取模板处理异常！");
                    LMEPG.Log.error(e.toString());

                }
            },
            function (rsp) {
                LMEPG.UI.showToast("获取模板发生错误！");
            }
        );
    },

    setClass: function (positionParam) {
        G("content").style.top = positionParam[0] + "px";
        G("content").style.left = positionParam[1] + "px";
        G("content").style.width = positionParam[2] + "px";
        G("content").style.height = positionParam[3] + "px";
        G("content").style.overflow = "hidden";
    },
    HTMLEncode: function (html) {
        var temp = document.createElement("div");
        (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
        var output = temp.innerHTML;
        temp = null;
        return output;
    },
    HTMLDecode: function (text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    }
};
function onBack() {
    LMEPG.Intent.back();
}
