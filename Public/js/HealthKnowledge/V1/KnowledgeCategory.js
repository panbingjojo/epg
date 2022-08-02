// [健康知识-首页]页面控制js

// 当前页默认有焦点的按钮ID、及导航栏默认选中的按钮ID
var defaultFocusId = 'category_0'; //可用于判断加载数据列表后，决定焦点是否落在数据列表项还是其它地方
var defaultNavFocusId = 'category_0';

function to_real_url(srcUrl) {
    if (LMEPG.Func.isObject(RenderParam) && !LMEPG.Func.isEmpty(RenderParam.fsUrl)
        && !LMEPG.Func.isEmpty(srcUrl)) {
        return RenderParam.fsUrl + srcUrl;
    } else {
        return srcUrl;
    }
}

/**
 * 页面跳转控制
 */
var Page = {
    // 获取当前页面对象
    getCurrentPage: function () {
        var currentPage = LMEPG.Intent.createIntent('healthKnowledgeList');
        currentPage.setParam('focusIndex', LMEPG.BM.getCurrentButton().id);
        currentPage.setParam('currentPage', List.currentPage);
        currentPage.setParam('currentClassId', List.currentClassId);
        return currentPage;
    },

    // 跳转->订购页
    jumBuyVipPage: function () {
        var objSrc = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent("orderHome");
        LMEPG.Intent.jump(objDst, objSrc);
    },

    // 跳转->搜索
    // jumpSearch: function (btn) {
    //     var objCurrent = Page.getCurrentPage();
    //     var objDst = LMEPG.Intent.createIntent('search');
    //     objDst.setParam('searchType', 4); // type: 0药品查询 1疾病自查 2症状自查 3健康自测 4健康知识管理
    //     LMEPG.Intent.jump(objDst, objCurrent);
    // },

    // 跳转->知识详情
    jumpDetails: function (knowledgeId) {
        var objCurrent = Page.getCurrentPage();
        var objDst = LMEPG.Intent.createIntent('healthKnowledgeDetails');
        objDst.setParam('knowledgeId', knowledgeId);
        LMEPG.Intent.jump(objDst, objCurrent);
    },
};

/**
 * 分类列表 - 左侧栏目导航
 */
var KnowledgeCategory = {
    GROUP_NAME: 'knowledge_category',   // 左侧分类导航按钮group
    pageNum: 7,                         // 每页最大的子项
    pageCurrent: 1,                     // 当前页码
    dataList: [],                       // 健康知识-左侧栏目导航数据

    /**
     * 初始化列表
     * @param navDataList 左侧栏目导航数据（可选）。如果是首次初始化或重新刷新数据，需要提供该参数。否则使用之前提供过的数据源
     */
    init: function (navDataList) {
        if (LMEPG.Func.isArray(navDataList)) {
            this.dataList = navDataList;
        }

        this.createCategoryListUI();
        this.updateArrows();
        LMEPG.BM.refresh();
    },

    // 得到当前页数据
    getCurrentPageDataList: function () {
        var data = [];
        if (this.dataList.length > 0) {
            var start = this.pageCurrent - 1; //数组截取起始位置
            var end = start + this.pageNum; //数组截取终止位置
            data = this.dataList.slice(start, end);
        }
        return data;
    },

    // 向上翻页
    prevPage: function () {
        if (this.hasPrev()) {
            this.pageCurrent--;
            this.init();
            LMEPG.BM.requestFocus('category_0');

            // [刷新新位置数据列表]：上/下翻页后（移动1个），亦复用当前第1个/最后1个元素位置（buttonId）。由于KnowledgeCategory.onFocusChange
            // 中处理了，若上一次selected的和当前focused还是同一个的话，不再重新load数据。所以，翻页的时候，需要重新刷新！
            this.refreshCurrentNavDataListUI();
        }
    },

    // 向下翻页
    nextPage: function () {
        if (this.hasMore()) {
            this.pageCurrent++;
            this.init();
            LMEPG.BM.requestFocus('category_6');

            // [刷新新位置数据列表]：上/下翻页后（移动1个），亦复用当前第1个/最后1个元素位置（buttonId）。由于KnowledgeCategory.onFocusChange
            // 中处理了，若上一次selected的和当前focused还是同一个的话，不再重新load数据。所以，翻页的时候，需要重新刷新！
            this.refreshCurrentNavDataListUI();
        }
    },

    // 判断是否还可上翻页
    hasPrev: function () {
        return this.pageCurrent > 1;
    },

    // 判断是否还可下翻页-更多数据
    hasMore: function () {
        var curPageEndPos = this.pageCurrent - 1 + this.pageNum;
        return curPageEndPos < this.dataList.length;
    },

    // 更新翻页箭头
    updateArrows: function () {
        if (this.hasPrev()) {
            Show('category_arrows_up');
        } else {
            Hide('category_arrows_up');
        }

        if (this.hasMore()) {
            Show('category_arrows_down');
        } else {
            Hide('category_arrows_down');
        }
    },

    // 创建分类列表html
    createCategoryListUI: function () {
        var categoryContent = G('category_content');
        var data = this.getCurrentPageDataList();
        if (!LMEPG.Func.isArray(data) || data.length === 0) {
            categoryContent.innerHTML = '';
            return;
        }

        var html = '';
        var buttonList = [];
        for (var i = 0; i < data.length; i++) {
            var navData = data[i]; //导航栏数据（对象）
            if (!LMEPG.Func.isObject(navData)) continue;
            var classId = navData.link_class_id;
            var className = navData.column_name;

            // 检验数据，避免无效对象出错中断
            !LMEPG.Func.isObject(navData.img_url) ? navData.img_url = {} : navData.img_url;

            // 检验数据，避免无效对象出错中断
            var imgNormal = is_exist(navData.img_url.normal) ? to_real_url(navData.img_url.normal) : 'undefined';
            var imgFocused = is_exist(navData.img_url.focus_in) ? to_real_url(navData.img_url.focus_in) : 'undefined';
            var imgSelected = is_exist(navData.img_url.focus_out) ? to_real_url(navData.img_url.focus_out) : 'undefined';

            var buttonId = 'category_' + i;

            // 记录当前哪个导航按钮为默认选中状态
            if (classId == List.currentClassId) defaultNavFocusId = buttonId;

            html += '<img id="' + buttonId + '" class-id="' + classId + '" class-name="' + className + '" ' +
                'img-normal="' + imgNormal + '" img-focused="' + imgFocused + '" img-selected="' + imgSelected + '" ' +
                ' src="' + (classId == List.currentClassId ? imgSelected : imgNormal) + '"/>';
            // 初始button
            buttonList.push({
                id: buttonId,
                name: data[i].name,
                type: 'img',
                focusable: true,
                nextFocusUp: i > 0 ? 'category_' + (i - 1) : 0,
                nextFocusDown: i < KnowledgeCategory.pageNum - 1 && i < data.length - 1 ? 'category_' + (i + 1) : '',
                backgroundImage: imgNormal,
                focusImage: imgFocused,
                selectedImage: imgSelected,
                click: KnowledgeCategory.onClick,
                focusChange: KnowledgeCategory.onFocusChange,
                beforeMoveChange: KnowledgeCategory.onBeforeMoveChange,
                groupId: KnowledgeCategory.GROUP_NAME,
                classId: data[i].link_class_id, // 分类id
                navData: navData,
            });
        }
        LMEPG.BM.addButtons(buttonList);
        categoryContent.innerHTML = '';
        categoryContent.innerHTML = html;
    },

    // 分类导航-焦点改变
    onFocusChange: function (btn, hasFocus) {
        if (hasFocus) {
            // 必须添加！记录当前focus状态的最新按钮id
            defaultFocusId = btn.id;

            G('title').innerHTML = btn.navData.column_name;
            var curSelectedNavBtn = LMEPG.BM.getSelectedButton(KnowledgeCategory.GROUP_NAME);
            if (curSelectedNavBtn && curSelectedNavBtn.id !== btn.id) {
                // 如果当前分类导航从刚选中，则加载其下的数据列表。否则，focused状态不重新加载，除非点击它！
                List.loadDataList(btn.classId, 1);
            }

            LMEPG.BM.setSelected(btn.id, true);
        } else {
        }
    },

    // 单独处理搜索按钮的焦点/播放语音
    // onFocusChangeOfSearchBtn: function (btn, hasFocus) {
    //     if (hasFocus) {
    //         AudioPlayer.fgm.play(get_audio_url(btn.navData));
    //     } else {
    //         AudioPlayer.fgm.stop();
    //     }
    // },

    // 分类导航-点击事件
    onClick: function (btn) {
        List.loadDataList(btn.classId, 1);
    },

    // 分类导航-焦点移动前
    onBeforeMoveChange: function (dir, btn) {
        switch (dir) {
            case 'down':
                if (btn.id === 'category_6') {
                    KnowledgeCategory.nextPage();
                }
                break;
            case 'up':
                if (btn.id === 'category_0') {
                    KnowledgeCategory.prevPage();
                }
                break;
            case 'right':
                // 判断如果有内容跳到第一个内容，如果没有，跳到搜索按钮
                LMEPG.BM.setSelected(btn.id, true);
                if (List.pageTotalCount > 0) {
                    LMEPG.BM.requestFocus('recommended_1');
                } else {
                    LMEPG.BM.requestFocus('search');
                }
                return false;
        }
    },

    // 刷新当前选中分类导航的数据列表并更新UI
    refreshCurrentNavDataListUI: function () {
        var selectedNavBtn = LMEPG.BM.getSelectedButton(KnowledgeCategory.GROUP_NAME);
        if (is_exist(selectedNavBtn) && !is_empty(selectedNavBtn.classId)) {
            List.loadDataList(selectedNavBtn.classId, 1);
        }
    }
};

/**
 * 健康知识列表
 */
var List = {
    // 当前分类id: -1表示全部分类
    currentClassId: is_empty(RenderParam.currentClassId) ? -1 : RenderParam.currentClassId,
    currentPage: 1, // 当前页
    pageNum: 6, // 每页数量
    pageTotalCount: 0, // 总页数
    pageDataList: [], // 当前页显示数据
    expectedNextPageFocusId: 'recommended_1', // 上/下翻页后，期待翻页后焦点默认显示在第几个。默认1，即"recommended_1"

    // 拉取指定分类下的 [健康知识]
    loadDataList: function (classId, currentPage, asyncCallback) {
        if (!is_exist(classId) || classId === '') {
            LMEPG.UI.showToast('查询出错，无效的分类id<br/><br/>class_id = [' + classId + ']');
            return;
        }

        this.expectedNextPageFocusId = this.currentClassId != classId ? 'recommended_1' : this.expectedNextPageFocusId; // 如果是重新加载新分类下数据，重置该值
        this.currentClassId = classId;
        this.currentPage = currentPage;
        this.pageTotalCount = 0; // 重置数据
        this.pageDataList = []; // 重置数据
        var postData = {
            'class_id': classId,
            'current_page': currentPage,
            'page_num': this.pageNum
        };
        G('knowledge_list').innerHTML = '';
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('HealthKnowledge/getKnowledgeList', postData, function (data) {
            LMEPG.UI.dismissWaitingDialog();
            if (data.result == 0) {
                var dataList = data.list;
                if (LMEPG.Func.isArray(dataList)) {
                    List.updateDataListUI(data.count, data.list);
                } else {
                    console.error('[{0}]--->[{1}]: 查询数据列表出错！data：{2}'+JSON.stringify(data));
                    LMEPG.Log.error('[{0}]--->[{1}]: 查询数据列表出错！data：{2}'+JSON.stringify(data));
                }
            } else {
                console.error('[{0}]--->[{1}]: 查询数据列表出错！data：{2}'+JSON.stringify(data));
                LMEPG.Log.error('[{0}]--->[{1}]: 查询数据列表出错！data：{2}'+JSON.stringify(data));
            }

            // 校验是否有数据，没有则显示占位提示
            List.checkToShowEmptyDataUI();
            LMEPG.call(asyncCallback);
        }, function (data) {
            // ERROR! Ajax请求异常，异步回调给上层。
            LMEPG.call(asyncCallback);
        });
    },

    // 更新当前页数据列表
    updateDataListUI: function (pageTotalCount, pageDataList) {
        this.pageTotalCount = pageTotalCount;
        this.pageDataList = pageDataList;
        if (pageDataList.length > 0) {
            this.createHtml();
            //若下一页数据不足以显示第2行，即2行1列，则默认显示第1行1列
            if (defaultFocusId.startWith('recommended_')) {
                LMEPG.BM.requestFocus(is_element_exist(this.expectedNextPageFocusId) ? this.expectedNextPageFocusId : 'recommended_1');
            }
        }
    },

    // 更新药品列表
    createHtml: function () {
        // LMEPG.Marquee.stop(); //防止翻页后相同位置的文本内容仍记录为相同位置上一次的滚动文本

        var htmlStr = '';
        var displayDataList = this.pageDataList.slice(0, this.pageNum);//截取打印数据
        var defImg = "'" + LMEPG.App.getAppRootPath() + "/Public/hd/img/HealthKnowledge/default_img_knowledge.png'";
        var dataItem;
        for (var i = 0; i < displayDataList.length; i++) {
            dataItem = displayDataList[i];

            var itemId = dataItem.knowledge_id;
            var accessCtrl = dataItem.access_ctrl; //访问控制（0不限 1普通用户 2VIP）
            var audioUrl = dataItem.audio_url;
            var imgUrl = to_real_url(dataItem.img_url);
            var defVipImgUrl = getItemDefVipImgBy(accessCtrl);
            var showVIPCorner = accessCtrl == 2 ? 'display: block' : 'display: none';//默认是否显示VIP角标

            htmlStr += '<div id="recommended_' + (i + 1) + '" item-data-id="' + itemId + '" access-ctrl="' + accessCtrl + '" audio-url="' + audioUrl + '">';
            htmlStr += '<img id="recommended_' + (i + 1) + '_img" class="recommended_img" src="' + imgUrl + '" onerror="this.src=' + defImg + '"/>';
            htmlStr += '<p id="recommended_' + (i + 1) + '_title" class="recommended_title">' + dataItem.title + '</p>';
            htmlStr += '<img class="vip_corner" src="' + defVipImgUrl + '" style="' + showVIPCorner + '"/>';
            htmlStr += '</div>';
        }
        G('knowledge_list').innerHTML = htmlStr;
        List.updatePaginationUI();
    },

    // 遥控器按键-上翻页
    loadPrevPage: function (btn) {
        if (this.currentPage > 1) {
            var index = Math.ceil(parseInt(btn.id.split('_')[1])); //当前按钮id编号：1或4
            this.expectedNextPageFocusId = 'recommended_' + (index + 3);
            this.loadDataList(this.currentClassId, --this.currentPage);
        }
    },

    // 遥控器按键-下翻页
    loadNextPage: function (btn) {
        if (Math.ceil(this.pageTotalCount / this.pageNum) > this.currentPage) {
            var index = Math.ceil(parseInt(btn.id.split('_')[1])); //当前按钮id编号：3或6
            this.expectedNextPageFocusId = 'recommended_' + (index - 3);
            this.loadDataList(this.currentClassId, ++this.currentPage);
        }
    },

    // 校验加载第一页时，拉取空数据列表时，显示占位符提示
    checkToShowEmptyDataUI: function () {
        var hasNoData = this.isEmptyPage();
        if (this.currentPage === 1 && hasNoData) {
            Show('empty_data');
            Hide('up_content_arrows');
            Hide('down_content_arrows');
            Hide('page_num');
        } else {
            Hide('empty_data');
        }
    },

    isEmptyPage: function () {
        return LMEPG.Func.isArray(this.pageDataList) && this.pageDataList.length === 0;
    },

    // 更新分页显示
    updatePaginationUI: function () {
        var totalPages = Math.ceil(this.pageTotalCount / this.pageNum);
        if (totalPages > this.currentPage) {
            Show('down_content_arrows');
        } else {
            Hide('down_content_arrows');
        }
        if (this.currentPage > 1) {
            Show('up_content_arrows');
        } else {
            Hide('up_content_arrows');
        }

        Show('page_num');
        G('page_num').innerHTML = this.currentPage + '/' + totalPages;
    },

    // 列表项焦点效果
    onFocusChange: function (btn, hasFocus) {
        if (hasFocus) {
            // 必须添加！记录当前focus状态的最新按钮id
            defaultFocusId = btn.id;
            LMEPG.CssManager.addClass(G(btn.id),"knowledge_zoom_out");
            // LMEPG.Marquee.stop();
            // LMEPG.Marquee.start(btn.id + "_title", 12, 4, 50, "left", "scroll");
            LMEPG.Func.marquee(G(btn.id + "_title"));
            LMEPG.Func.marquee(G(btn.id + "_title"),G(btn.id + "_title").innerText,12);
        } else {
            LMEPG.Func.marquee(G(btn.id + "_title"));
            LMEPG.CssManager.removeClass(G(btn.id),"knowledge_zoom_out");
        }
    },

    // 列表项焦点移动操作
    onBeforeMoveChange: function (dir, current) {
        var curBtnIndex = parseInt(current.id.split('_')[1]); //当前按钮id编号：1~6
        switch (dir) {
            case 'left':
                if (current.id === 'search' || (curBtnIndex === 1 || curBtnIndex === 4)) {
                    // 若为“搜索”或者“1~3号列表项”
                    var curSelectedNavBtn = LMEPG.BM.getSelectedButton(KnowledgeCategory.GROUP_NAME);
                    if (curSelectedNavBtn) LMEPG.BM.requestFocus(curSelectedNavBtn.id);
                } else {
                    LMEPG.BM.requestFocus('recommended_' + (curBtnIndex - 1)); // 左移一个
                }
                return false;
            case 'right':
                LMEPG.BM.requestFocus('recommended_' + (curBtnIndex + 1)); // 右移一个
                return false;
            case 'up':
                if (curBtnIndex >= 1 && curBtnIndex <= 3) {
                    if (List.currentPage === 1) {
                        LMEPG.BM.requestFocus('search'); // 上移到search按钮
                    } else {
                        List.loadPrevPage(current);
                    }
                } else {
                    LMEPG.BM.requestFocus('recommended_' + (curBtnIndex - 3)); // 上移一个
                }
                return false;
            case 'down':
                if (current.id === 'search') {
                    // 当前按钮为“搜索”
                    LMEPG.BM.requestFocus('recommended_1'); // 下移一个
                } else {
                    // 当前按钮为“1~6号列表项”
                    if (curBtnIndex >= 4 && curBtnIndex <= 6) {
                        List.loadNextPage(current);
                    } else {
                        if (curBtnIndex >= 1 && curBtnIndex <= 3) {
                            for (var i = curBtnIndex + 3; i >= 4; i--) {
                                if (is_element_exist('recommended_' + i)) {
                                    LMEPG.BM.requestFocus('recommended_' + i); // 下移一个
                                    break;
                                }
                            }
                        }
                    }
                }
                return false;
        }
    },

    // 列表项点击
    onClicked: function (btn) {
        var knowledgeId = G(btn.id).getAttribute('item-data-id');
        var knowledgeTitle = G(btn.id).getAttribute('item-data-title');
        if (is_empty(knowledgeId)) {
            LMEPG.UI.showToast('出错!<br/><br/>无效的知识id');
        } else {
            var accessCtrl = G(btn.id).getAttribute('access-ctrl'); //访问控制（0不限 1普通用户 2VIP）
            if (accessCtrl == 2 ) {
                LMEPG.UI.commonDialog.show('您还不是VIP哦！', ['成为VIP', '取消'], function (index) {
                    if (index === 0) Page.jumBuyVipPage();
                });
            } else {
                Page.jumpDetails(knowledgeId);
            }
        }
    },

    // 初始化列表
    initButtons: function () {
        buttons.push({
            id: 'recommended_1',
            name: '推荐1',
            type: 'img',
            nextFocusUp: 'search',
            nextFocusDown: 'recommended_4',
            click: List.onClicked,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
        });
        buttons.push({
            id: 'recommended_2',
            name: '推荐2',
            type: 'img',
            nextFocusUp: 'search',
            nextFocusDown: 'recommended_5',
            click: List.onClicked,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
        });
        buttons.push({
            id: 'recommended_3',
            name: '推荐3',
            type: 'img',
            nextFocusUp: 'search',
            nextFocusDown: 'recommended_6',
            click: List.onClicked,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
        });
        buttons.push({
            id: 'recommended_4',
            name: '推荐4',
            type: 'img',
            nextFocusUp: 'recommended_1',
            click: List.onClicked,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
        });
        buttons.push({
            id: 'recommended_5',
            name: '推荐5',
            type: 'img',
            nextFocusUp: 'recommended_2',
            click: List.onClicked,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
        });
        buttons.push({
            id: 'recommended_6',
            name: '推荐6',
            type: 'img',
            nextFocusUp: 'recommended_3',
            click: List.onClicked,
            focusChange: List.onFocusChange,
            beforeMoveChange: List.onBeforeMoveChange,
        });

        // 设置搜索
        var searchImgNormal = LMEPG.App.getAppRootPath() + '/Public/hd/img/Common/bg_search.png';
        var searchImgFocused = LMEPG.App.getAppRootPath() + '/Public/hd/img/Common/f_search.gif';
        if (LMEPG.Func.isObject(mSearchDataObj) && LMEPG.Func.isObject(mSearchDataObj.img_url)) {
            searchImgNormal = is_exist(mSearchDataObj.img_url.normal) ? to_real_url(mSearchDataObj.img_url.normal) : searchImgNormal;
            searchImgFocused = is_exist(mSearchDataObj.img_url.focus_in) ? to_real_url(mSearchDataObj.img_url.focus_in) : searchImgNormal;
        }

        // buttons.push({
        //     id: 'search',
        //     name: '搜索',
        //     type: 'img',
        //     backgroundImage: is_exist(searchImgNormal) ? searchImgNormal : '',
        //     focusImage: is_exist(searchImgFocused) ? searchImgFocused : '',
        //     click: Page.jumpSearch,
        //     focusChange: '', //KnowledgeCategory.onFocusChangeOfSearchBtn,
        //     beforeMoveChange: List.onBeforeMoveChange,
        //     navData: mSearchDataObj,
        // });
    },
};

/**
 * 列表上默认图片，主要用于<img>标签的onerror，注意生成的url有引号""！
 * @param accessCtrl //访问控制（0不限 1普通用户 2VIP）
 */
function getItemDefVipImgBy(accessCtrl) {
    return LMEPG.App.getAppRootPath() + '/Public/img/Common/corner.png';
}

// 全局变量
var buttons = [];

// 搜索按钮、导航分类数据列表（数组）
var mSearchDataObj = {};
var mNavClassDataList = [];

/**
 * 健康知识模块-启动入口
 */
var HealthKnowledge = {
    isInitFirst: true, // 首次加载页面标志，用于记录焦点保持

    // 找到左侧导航栏对应当前选中分类所在的位置，并定位焦点及分页
    indexOfNavClass: function () {
        for (var i = 0; i < mNavClassDataList.length; i++) {
            if (mNavClassDataList[i].link_class_id === List.currentClassId) {
                if (i >= KnowledgeCategory.pageNum) {
                    KnowledgeCategory.pageCurrent = i - KnowledgeCategory.pageNum + 2;
                    console.log('[KnowledgeCategory.js]---[indexOfNavClass]--->Recovery last saved page: ' + KnowledgeCategory.pageCurrent);
                }
                break;
            }
        }
    },

    initData: function () {
        // 解析当前默认的分类id、焦点记录
        List.currentClassId = is_empty(RenderParam.currentClassId) ? -1 : RenderParam.currentClassId;
        List.expectedNextPageFocusId = !is_empty(RenderParam.focusIndex) && RenderParam.focusIndex.startWith('recommended_') ? RenderParam.focusIndex : 'recommended_1';
        defaultFocusId = is_empty(RenderParam.focusIndex) ? defaultFocusId : RenderParam.focusIndex;

        // 解析获取分类信息
        for (var i = 0; i < RenderParam.navClassDataList.length; i++) {
            var classItem = RenderParam.navClassDataList[i];
            if (classItem.link_class_id === '-1') {
                if (i === 0) { //注意：==> 约定好，后台配置权重最大（排序第1个）的为搜索图标！
                    mSearchDataObj = classItem;
                    // continue;
                }
            }
            mNavClassDataList.push(classItem);
        }

        // 初始化定位左侧导航栏分类并聚焦锁定
        this.indexOfNavClass();
    },

    // 初始化页面-唯一入口
    init: function () {
        this.initData(); // 初始化本地数据结构
        KnowledgeCategory.init(mNavClassDataList); // 初始化 [知识分类-导航栏目]按钮

        List.initButtons(); // 初始化 [健康知识列表] 按钮
        List.loadDataList(List.currentClassId, RenderParam.currentPage, function () { // 默认拉取所有分类下的 [健康知识]
            // 初次加载完当前分类的第1页：
            //      1.若有数据或者上一次焦点保持在search，则默认焦点归置到第1个列表项或者search按钮上！
            //      2.若无数据且无左侧分类导航（后台运营未添加分配），则默认焦点归置到search按钮上！
            if (!List.isEmptyPage() || defaultFocusId === "search") {
                if (defaultFocusId === "search") LMEPG.BM.requestFocus("search");
                else LMEPG.BM.requestFocus(List.expectedNextPageFocusId);
            } else if (List.isEmptyPage() && !is_element_exist(defaultFocusId)) {
                LMEPG.BM.requestFocus("search");
            }
        });

        LMEPG.BM.init(defaultFocusId, buttons, '', true);
        LMEPG.BM.setSelected(defaultNavFocusId, true);
        this.isInitFirst = false;
    }
};

function onBack() {
    LMEPG.Intent.back();
}
