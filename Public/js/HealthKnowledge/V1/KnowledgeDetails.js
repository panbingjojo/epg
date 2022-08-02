// [健康知识-详情]页面控制js

// 全局变量
var buttons = [];

function to_real_url(srcUrl) {
    if (LMEPG.Func.isObject(RenderParam) && !LMEPG.Func.isEmpty(RenderParam.fsUrl)
        && !LMEPG.Func.isEmpty(srcUrl)) {
        return RenderParam.fsUrl + srcUrl;
    } else {
        return srcUrl;
    }
}

/**
 * 健康知识模块
 */
var KnowledgeDetails = {
    isAutoMode: true, // 初始进来自动播放并切换的模式（除非按了左右键则关掉该自动切换播放模式）
    currentPage: 1, // 当前页码
    pageTotalCount: 0, // 总页数
    pageDataList: [], // 详情数据-数组

    initButtons: function () {
        buttons.push({
            id: 'content',
            name: "内容",
            type: 'img',
            focusable: true,
            beforeMoveChange: KnowledgeDetails.onBeforeMoveChange,
            click: KnowledgeDetails.onClick,
        });
    },

    // 更新分页显示
    updatePaginationUI: function () {
        this.updateArrows();
        this.updatePageNumUI();
    },

    // 更新翻页箭头
    updateArrows: function () {
        if (this.currentPage > 1) {
            Show('left_arrow');
        } else {
            Hide('left_arrow');
        }
        if (this.currentPage < this.pageTotalCount) {
            Show('right_arrow');
        } else {
            Hide('right_arrow');
        }
    },

    // 更新页码
    updatePageNumUI: function () {
        if (this.pageTotalCount > 0) {
            Show('page_num');
            var pageNum = G('page_num');
            pageNum.innerHTML = '<span class="highlight_page_num">' + this.currentPage + '</span>' +
                '<span class="highlight_page_total">/' + this.pageTotalCount + '</span>';
        } else {
            Hide('page_num');
        }
    },

    // 上翻页
    prevPage: function () {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateCurrentPageUI();
        }
    },

    // 下翻页
    nextPage: function () {
        if (this.currentPage < this.pageDataList.length) {
            this.currentPage++;
            this.updateCurrentPageUI();
        }
    },

    // 显示指定位置的页面图片
    updateCurrentPageUI: function () {
        var position = this.currentPage - 1;
        if (position >= 0 && position < this.pageDataList.length) {
            var page = this.pageDataList[position];
            if (LMEPG.Func.isObject(page)) {
                G('content').src = to_real_url(page.img_url);
                // this.playCurrentPageAudio(page.audio_url);
            }
        }
        this.updatePaginationUI();
    },

    // 焦点移动
    onBeforeMoveChange: function (dir, current) {
        switch (dir) {
            case 'left':
                KnowledgeDetails.isAutoMode = false;//按左右键，则关掉默认自动切换播放模式
                KnowledgeDetails.prevPage();
                break;
            case 'right':
                KnowledgeDetails.isAutoMode = false;//按左右键，则关掉默认自动切换播放模式
                KnowledgeDetails.nextPage();
                break;
        }
        return false;
    },

    // 按钮点击
    onClick: function (btn) {
        KnowledgeDetails.onBeforeMoveChange("right", btn);
    },

    // 播放当前页面的语音
    playCurrentPageAudio: function (audioUrl) {
        // 停止上一个播放音效
        if (window.playTimeout) {
            AudioPlayer.fgm.stop();
            clearTimeout(window.playTimeout);
        }

        var isAudioOnline = RenderParam.settingsInfo.is_online_audio_func; //TODO 处理语音下线功能（Added by Songhui on 2019-8-14）

        // 避免快速按键还处于页面切换时，不断的调用开启播放，稍微延迟再启动。
        if (!is_empty(audioUrl) && !is_run_on_PC() && isAudioOnline) {//加“is_run_on_PC()”判断，以在本机浏览器上可以左右键浏览
            window.playTimeout = setTimeout(function () {
                AudioPlayer.fgm.play(to_real_url(audioUrl), function () {
                    KnowledgeDetails.nextPage();
                }, KnowledgeDetails.isAutoMode === true);
            }, 20);
        }
    },

    // 初始化内部参数
    _initParam: function () {
        this.pageDataList = LMEPG.Func.isArray(RenderParam.knowledgeInfoList) ? RenderParam.knowledgeInfoList : [];
        this.pageTotalCount = this.pageDataList.length;
    },

    /**
     * 初始化页面
     */
    init: function () {
        this._initParam();
        this.initButtons();
        this.updateCurrentPageUI(); // 默认显示第1页
        LMEPG.BM.init('content', buttons, '', true);
    }

};
