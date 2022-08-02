// +----------------------------------------------------------------------
// | 我的收藏页V1（V1/collect.js）页面的js控制封装
// +----------------------------------------------------------------------
// | 使用该V1/collect.js特别之处：
// |    1. 目前仅支持1行4列数据展示。
// |    2. 工具栏右上角有一个按钮（例如：清空收藏）
// |    3. 底部栏左下角可能其它可选按钮（例如：广西电信EPG有"首页/主页/返回"）
// +----------------------------------------------------------------------
// | 目前应用地区：
// |     大部分默认地区
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/07/10
// +----------------------------------------------------------------------

var LOG_TAG = "[V1/collect.js]";
var IS_DEBUG = true;
var IS_LOG_ON_SCREEN = false;

var defaultFocusIndex = "toolbar-btn-1"; //当前页发生任何意外时，使用的默认焦点元素id。不要改变！！！
var firstRecommendId = "focus-1-1-border"; //第一个视频位元素id
var lastFocusListBtnId = ""; //隶属列表按钮（"视频位"或"收藏按钮"）且最后获得焦点的元素id。
var lastFocusIndex = firstRecommendId; //大多数情况下为"视频位"或"视频位下方按钮"焦点默认元素id（中间可能会改为指向其它按钮：例如没有数据默认指向工具栏按钮），用于LMEPG.BM.requestFocus()定位
var buttons = []; //存放全局按钮
var rsPathPrefix = g_appRootPath + "/Public/img/" + RenderParam.platformType + ""; //资源路径前缀


/*****************************************************************
 * 页面跳转控制
 *****************************************************************/
function onBack() {
    LMEPG.Intent.back();
}

function isHD() {
    return RenderParam.platformType === 'hd';
}

function printLog(funcName, msg, errorLevel) {
    var lineLog = LOG_TAG + "--->[" + funcName + "]--->" + msg;
    if (IS_DEBUG) {
        if (errorLevel) console.error(lineLog);
        else console.log(lineLog);
    }
    LMEPG.Log.info(lineLog);
}

var Page = {
    /**
     * 得到当前页对象
     * @param fromId 1-??? 2-播放视频
     */
    getCurrentPage: function (fromId) {
        var objCurrent = LMEPG.Intent.createIntent("collect");
        objCurrent.setParam("fromId", fromId);
        objCurrent.setParam("focusIndex", LMEPG.BM.getCurrentButton().id);
        objCurrent.setParam("page", List.pageCurrent);
        objCurrent.setParam("pageCurrent", List.pageCurrent);
        return objCurrent;
    },

    /** 跳转->收藏页 */
    jumpCollectPage: function () {
        var srcObj = Page.getCurrentPage("1");
        var dstObj = LMEPG.Intent.createIntent("collect");
        LMEPG.Intent.jump(dstObj, srcObj, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    },

    /**
     * 跳转->购买VIP
     *
     * @param focusId 当前页的焦点位置
     * @param remark 备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
     * @returns {boolean}
     */
    jumpBuyVip: function (focusId, remark) {
        var srcObj = Page.getCurrentPage("1");
        var dstObj = LMEPG.Intent.createIntent("orderHome");
        dstObj.setParam("isPlaying", "1");
        dstObj.setParam("remark", remark);
        LMEPG.Intent.jump(dstObj, srcObj);
    },

    /** 跳转->播放视频 */
    jumpPlayVideo: function (focusIdName, videoInfo) {
        var srcObj = Page.getCurrentPage("2");
        var dstObj = LMEPG.Intent.createIntent("player");
        dstObj.setParam("videoInfo", JSON.stringify(videoInfo));
        LMEPG.Intent.jump(dstObj, srcObj);
    },
};


/*****************************************************************
 * View元素/资源
 *****************************************************************/
var Resources = (function () {
    // 收藏按钮背景图（选中/未选中）
    var bgCollectFocused = "";
    var bgCollectUnFocused = "";

    // 取消收藏按钮背景图（选中/未选中）
    var bgUnCollectFocused = "";
    var bgUnCollectUnfocused = "";

    // 视频位背景图（选中/未选中）
    var bgBoxFocused = "";
    var bgBoxUnfocused = "";

    switch (RenderParam.carrierId) {
        default:
            // 设置"收藏按钮背景图"
            bgCollectUnFocused = rsPathPrefix + "/Collect/V1/confirm-unselect.png";
            bgCollectFocused = rsPathPrefix + "/Collect/V1/confirm.png";

            // 设置"取消收藏按钮背景图"
            bgUnCollectFocused = rsPathPrefix + "/Collect/V1/cancel.png";
            bgUnCollectUnfocused = rsPathPrefix + "/Collect/V1/cancel-unselect.png";

            // 设置"视频位背景图"
            bgBoxFocused = rsPathPrefix + "/Collect/V1/imgbox.png";
            bgBoxUnfocused = rsPathPrefix + "/Collect/V1/transparent.png";
            break;
    }

    return {
        img_url_collect: {
            focused: bgCollectFocused,
            unfocused: bgCollectUnFocused,
        },
        img_url_cancel_collect: {
            focused: bgUnCollectFocused,
            unfocused: bgUnCollectUnfocused,
        },
        img_url_box: {
            focused: bgBoxFocused,
            unfocused: bgBoxUnfocused,
        },
    }
})();

/*****************************************************************
 * 操作控制
 *****************************************************************/
var BtnAction = {

    // 判断某一操作按钮是否为：视频位下方的"收藏/取消收藏"按钮
    isMatchCollectBtn: function (btnId) {
        // 匹配形如"focus-2-4-btn"。为了兼容某些标清IPTV盒子，放弃字面量表达式
        return new RegExp("^focus-(\\d)+-(\\d)+-btn$").test(btnId);
    },

    // 判断某一操作按钮是否为：视频位按钮
    isMatchRecommendBtn: function (btnId) {
        // 匹配形如"focus-1-4-border"。为了兼容某些标清IPTV盒子，放弃字面量表达式
        return new RegExp("^focus-(\\d)+-(\\d)+-border$").test(btnId);
    },

    // 判断某一操作按钮是否为：内容列表中最左侧一个，用于统一判断上翻页
    isLeftMostBtnOfListPanel: function (btnId) {
        // 匹配形如"focus-1-1-border"或"focus-2-1-btn"。为了兼容某些标清IPTV盒子，放弃字面量表达式
        return new RegExp("^(focus-1-1-border)|(focus-2-1-btn)$").test(btnId);
    },

    // 判断某一操作按钮是否为：内容列表中最右侧一个，用于统一判断下翻页
    isRightMostBtnOfListPanel: function (btnId) {
        // 匹配形如"focus-1-4-border"或"focus-2-4-btn"。为了兼容某些标清IPTV盒子，放弃字面量表达式
        return new RegExp("^(focus-1-4-border)|(focus-2-4-btn)$").test(btnId);
    },

    // 获取内容列表左侧一个按钮id，用于翻页后下一焦点按钮和当前处于同一类型上（要么是视频位，要么是收藏按钮）。例如：[focus-1-1-border|focus-2-1-btn]
    getLeftMostBtnOfListPanel: function (isNeedMatchSimilar) {
        if (isNeedMatchSimilar) { //对应同类按钮 "[focus-1-1-border|focus-2-1-btn]"
            var curFocusBtnId = lastFocusListBtnId;
            if (curFocusBtnId && (BtnAction.isMatchRecommendBtn(curFocusBtnId) || BtnAction.isMatchCollectBtn(curFocusBtnId))) {
                var splitStr = curFocusBtnId.split("-");
                return splitStr[0] + "-" + splitStr[1] + "-1-" + splitStr[3];
            }

        }
        return "focus-1-4-border";
    },

    // 获取内容列表右侧一个按钮id，用于翻页后下一焦点按钮和当前处于同一类型上（要么是视频位，要么是收藏按钮）。例如：[focus-1-4-border|focus-2-4-btn]
    getRightMostBtnOfListPanel: function (isNeedMatchSimilar) {
        if (isNeedMatchSimilar) { //对应同类按钮 "[focus-1-1-border|focus-2-1-btn]"
            var curFocusBtnId = lastFocusListBtnId;
            if (curFocusBtnId && (BtnAction.isMatchRecommendBtn(curFocusBtnId) || BtnAction.isMatchCollectBtn(curFocusBtnId))) {
                var splitStr = curFocusBtnId.split("-");
                return splitStr[0] + "-" + splitStr[1] + "-4-" + splitStr[3];
            }

        }
        return "focus-1-4-border";
    },

    // 获取上一个列表焦点按钮（仅视频位或下方收藏按钮）所处的UI排序序号。-1表示没有找到对应的上次记忆中的列表焦点按钮（可能一开始就没获取到数据的情况才会发生）
    indexOfLastFocusListBtnId: function () {
        var index = -1; //首次加载到空数据列表，则lastFocusIndex不存在
        if (BtnAction.isMatchCollectBtn(lastFocusListBtnId) || BtnAction.isMatchRecommendBtn(lastFocusListBtnId)) {
            // "[focus-1-1-border|focus-2-1-btn]"
            index = parseInt(lastFocusListBtnId.split("-")[2]);
        }
        return index;
    },

    // 启动文字滚动
    marqueeStart: function (marqueeViewId) {
        LMEPG.UI.Marquee.stop();
        LMEPG.UI.Marquee.start(marqueeViewId, 4, 2, 50, "left", "scroll");
    },

    // 停止文字滚动
    marqueeStop: function () {
        LMEPG.UI.Marquee.stop();
    },

    // 清空所有收藏
    clearAllCollection: function () {
        LMEPG.ajax.postAPI("Collect/clearCollectRecord", null, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                if (data.result == 0) {
                    List.resetParams(); //重置参数及当前拉取数据为初始状态。
                    G("content").innerHTML = "";
                    G("page-num").innerHTML = "";
                    Hide("arrow-left");
                    Hide("arrow-right");
                    Show("empty-data");
                } else {
                    LMEPG.UI.showToast("清空失败:" + data.result);
                }
            } catch (e) {
                LMEPG.UI.showToast("清空异常");
            }
        });
    },

    /**
     * 收藏/取消收藏
     * @param collectBtnId 当前按钮id
     * @param sourceId 收藏按钮元素id
     * @param status 收藏状态：0-收藏 1-取消收藏
     */
    setCollectStatus: function (collectBtnId, sourceId, status) {
        var postData = {
            "source_id": sourceId,
            "status": status,
        };
        var pageCurrentTemp = List.pageCurrent; //当前页码副本拷贝，用于异步"收藏/取消收藏"返回后，最新的焦点状态图片选择判断！
        LMEPG.ajax.postAPI("Collect/setCollectStatus", postData, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                var isCollectBehavior = status == 0;
                if (data.result == 0) {
                    var collectStatus = isCollectBehavior ? "1" : "0"; //0-未收藏 1-已收藏
                    var domBtn = G(collectBtnId);
                    if (domBtn) domBtn.setAttribute("status", collectStatus); //绑定收藏状态到view。"判断domBtn"的理由是可能快速切换到另一页的不存在同一id的view元素上！！！

                    // 异步操作新焦点检查：若收藏/取消收藏HTTP异步请求返回前，当前焦点已经切换移动，则显示的聚焦图片除了更改为最新收藏状态还需要考虑焦点选中状态
                    var curBtn = LMEPG.BM.getCurrentButton();
                    if (curBtn && curBtn.id === collectBtnId && pageCurrentTemp === List.pageCurrent) {
                        //focused state
                        if (domBtn) domBtn.style.background = 'url("' + (isCollectBehavior ? Resources.img_url_cancel_collect.focused : Resources.img_url_collect.focused) + '") no-repeat'; //立即反选收藏状态UI
                    } else {
                        //unfocused state
                        if (domBtn) domBtn.style.background = 'url("' + (isCollectBehavior ? Resources.img_url_cancel_collect.unfocused : Resources.img_url_collect.unfocused) + '") no-repeat'; //立即反选收藏状态UI
                    }
                } else {
                    LMEPG.UI.showToast((isCollectBehavior ? "收藏" : "取消收藏") + "失败！[" + data.result + "]");
                }
            } catch (e) {
                LMEPG.UI.showToast("操作发生异常");
                printLog("setCollectStatus()", "An exception occurred: " + e.toLocaleString(), true);
            }
        });
    },

    // 转换收藏状态
    toggleCollectStatus: function (collectBtnId) {
        var domBtn = G(collectBtnId);
        var sid = domBtn.getAttribute("sid");
        var status = domBtn.getAttribute("status");//当前收藏状态 0-未收藏 1-收藏
        // var modelType = domBtn.getAttribute("modelType");
        BtnAction.setCollectStatus(collectBtnId, sid, status == 1 ? 1 : 0); //反选行为：0-进行收藏 1-取消收藏
    },

    // 点击触发尝试跳转到视频播放页面或订购VIP
    tryJumpVideoPlay: function (recommendBtnId) {
        var focusElement = G(recommendBtnId.substring(0, 9));
        var sid = focusElement.getAttribute("sid");
        var userType = focusElement.getAttribute("usertype");
        var videoUrl = "";
        var ftp = focusElement.getAttribute("ftp");
        var title = focusElement.getAttribute("title");
        var modelType = focusElement.getAttribute("modelType");
        var freeSeconds = focusElement.getAttribute("freeSeconds");
        var unionCode = focusElement.getAttribute("unionCode");
        var show_status = focusElement.getAttribute("show_status");

        try {
            var ftpJson = ftp instanceof Object ? ftp : JSON.parse(ftp);
            videoUrl = isHD() ? ftpJson.gq_ftp_url : videoUrl = ftpJson.bq_ftp_url;

            var videoInfo = {
                "sourceId": sid,
                "videoUrl": videoUrl,
                "title": title,
                "type": modelType,
                "freeSeconds": freeSeconds,
                "userType": userType,
                "unionCode": unionCode,
                "entryType": 5,
                "entryTypeName": "collect",
                "focusIdx": recommendBtnId,
                'show_status': show_status,
            };

            //视频专辑下线处理
            if(videoInfo.show_status == "3") {
                LMEPG.UI.showToast('该节目已下线');
                return;
            }
            // 先判断userType：2需要会员才能观看，其他可以直接观看
            if (LMEPG.Func.isAllowAccess(RenderParam.isVip, ACCESS_PLAY_VIDEO_TYPE, videoInfo)) {
                Page.jumpPlayVideo(videoInfo.focusIdx, videoInfo);
            } else {
                var postData = {"videoInfo": JSON.stringify(videoInfo)};
                LMEPG.ajax.postAPI("Player/storeVideoInfo", postData, function (data) {
                    if (data.result == 0) {
                        Page.jumpBuyVip(videoInfo.focusIdx, videoInfo.title);
                    } else {
                        LMEPG.UI.showToast("系统报错");
                    }
                });
            }

        } catch (e) {

        }
    },
};

/*****************************************************************
 * 顶部工具栏
 *****************************************************************/
var ToolBar = {

    initButtons: function () {
        buttons.push({
            id: "toolbar-btn-1",
            name: "清空",
            type: 'img',
            nextFocusDown: 'focus-1-1-border',
            focusable: true,
            backgroundImage: rsPathPrefix + "/Collect/V1/clear_out.png",
            focusImage: rsPathPrefix + "/Collect/V1/clear_in.png",
            focusChange: ToolBar.onFocusChanged,
            click: ToolBar.onClicked,
        });
    },

    onFocusChanged: function (btn, hasFocus) {
        if (hasFocus) {
            lastFocusIndex = btn.id; //记录最后一次的聚焦按钮id
            G(btn.id).style.background = "url(" + btn.focusImage + ") no-repeat";
        } else {
            G(btn.id).style.background = "url(" + btn.backgroundImage + ") no-repeat";
        }
    },

    onClicked: function (btn) {
        if (List.isEmptyDataList()) {
            LMEPG.UI.showToast("没有更多数据了~");
        } else {
            LMEPG.UI.commonDialog.show("你确定要清空所有收藏吗？", ["确定", "放弃"], function (btnIndex) {
                if (btnIndex === 0) {
                    BtnAction.clearAllCollection();
                }
            });
        }
    },

};

/*****************************************************************
 * 中间列表面板
 *****************************************************************/
var List = {
    PAGE_NUM: 4, //每页显示条数
    pageCurrent: 1, // 当前页码，从1开始
    pageTotalCount: 0, // 数据总量
    pageDataList: [], // 当前页显示数据

    /**
     * 重置所有参数为默认初始状态
     */
    resetParams: function () {
        List.PAGE_NUM = 4;
        List.pageCurrent = 1;
        List.pageTotalCount = 0;
        List.pageDataList = [];
    },

    /**
     * 拉取当前指定类型且指定页码的收藏列表
     */
    loadDataListFirstOnce: function () {
        List.resetParams(); //重置数据到初始状态
        List.pageCurrent = isNaN(parseInt(RenderParam.pageCurrent)) ? 1 : parseInt(RenderParam.pageCurrent); //页码记忆
        List.getCollectList();
    },

    /**
     * 请求HTTP拉取指定类型的收藏列表
     */
    getCollectList: function () {
        // 暂无分页拉取，一次性（后台最多返200条）
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI("Collect/getCollectList", null, function (rsp) {
            try {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                LMEPG.UI.dismissWaitingDialog();
                if (LMEPG.Func.isObject(data) && data.result === 0) {
                    if (LMEPG.Func.isArray(data.list)) {
                        List.updateCollectDataListUI(data.count, data.list);
                    } else {
                        printLog("getCollectList()", "加载收藏列表失败！[" + data.result + "]", true);
                    }
                } else {
                    printLog("getCollectList()", "加载收藏列表失败！", true);
                }

                // 校验是否有数据，没有则显示占位提示
                List.checkToShowEmptyDataUI();
            } catch (e) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("视频加载异常！");
                printLog("getCollectList()", "数据解析异常：" + e.toLocaleString(), true);
            }
        });
    },

    isEmptyDataList: function () {
        return !LMEPG.Func.isArray(List.pageDataList) || List.pageDataList.length === 0;
    },

    // 校验加载第一页时，拉取空数据列表时，显示占位符提示
    checkToShowEmptyDataUI: function () {
        var hasNoData = List.isEmptyDataList();
        if (List.pageCurrent === 1 && hasNoData) {
            // 第1页，即空数据列表，显示占位提示
            G('content').innerHTML = '';
            G('empty-data').innerHTML = "暂无收藏视频";
            Show('empty-data');
            Hide('arrow-left');
            Hide('arrow-right');
            Hide('page-num');
        } else if (List.pageCurrent > 1 && hasNoData) {
            // 自第2页起，若从详情页 [取消收藏] 并返回当前页，且 [当前页无数据]，则默认自动向前翻一页，保证体验！
            Hide('empty-data');
        } else {
            Hide('empty-data');
        }
    },

    // 检测并根据焦点保持等状态寻找到合适的位置放置最新焦点。
    // 存在可能：
    //    1. 例如最后一页第4个，当前已经取消收藏，此时点击进入播放再返回来时，若对应页码没有对应位置的数据，则需要向前移动一位。
    //    2. 例如最后一页只有第1个，当前已经取收藏，此时点击进入播放再返回来时，则无对应页码，则需要向前翻一页并移动到最后一位。
    checkToAutoFocusOptimalPos: function () {
        if (List.isEmptyDataList()) {
            lastFocusIndex = defaultFocusIndex; //将渲染UI后即显示焦点的按钮id（与默认焦点一致）赋值给lastFocusIndex，用于LMEPG.BM.requestFocus()定位
            List.pageCurrent = 1;//强制归为第一页，便于后续的分页等逻辑及表现合乎情理
        } else {
            var pos = BtnAction.indexOfLastFocusListBtnId();
            if (pos > 0) {
                var start = (List.pageCurrent - 1) * List.PAGE_NUM;
                var end = start + List.PAGE_NUM;
                var realPageDataList = List.pageDataList.slice(start, end);//截取打印数据
                var realSize = realPageDataList.length;
                printLog("checkToAutoFocusOptimalPos()", "page[" + List.pageCurrent + "]-->realSize：" + realSize + ", pos: " + pos + ", lastFocusListBtnId: " + lastFocusListBtnId, true);

                if (realSize === pos) {
                    printLog("checkToAutoFocusOptimalPos()", "恰好保持当前位置焦点", true);
                } else if (realSize > 0 && realSize < pos) {
                    // 1、当前记录页码对应数据，最大长度小于上次记忆焦点的索引号（"focus-1-4-border"中的第2个数字）。
                    // ----> 处理策略1：自动向前移动N个焦点，即当前页实际最大长度的最后一个。
                    var splitStr = lastFocusListBtnId.split("-"); // "focus-1-4-border"
                    lastFocusListBtnId = splitStr[0] + "-" + splitStr[1] + "-" + realSize + "-" + splitStr[3];
                    printLog("checkToAutoFocusOptimalPos()", "处理策略1：自动向前移动N个焦点，即当前页实际最大长度的最后一个。", true);
                } else if (realSize === 0) {
                    // 2、当前记录页码对应数据为空（例如：第2页有且仅1条数据，取消收藏，点击视频播放返回后重新刷新当前页则没有数据）。
                    // ----> 处理策略2：页码向前移动一位，同时焦点移动到上一页最后一位。
                    if (List.pageCurrent > 1) {
                        List.pageCurrent--;
                        var splitStr = lastFocusListBtnId.split("-"); // "focus-1-4-border"
                        var lastFocusListBtnIdTemp = splitStr[0] + "-" + splitStr[1] + "-" + realSize + "-" + splitStr[3];
                        if (LMEPG.Func.isElementExist(lastFocusListBtnIdTemp)) {
                            lastFocusListBtnId = lastFocusListBtnIdTemp; //将副本转正，否则影响else的递归操作里BtnAction.indexOfLastFocusListBtnId()判断！！
                            printLog("checkToAutoFocusOptimalPos()", "处理策略2：页码向前移动一位，同时焦点移动到上一页最后一位。", true);
                        } else {
                            // 此种情况发生场景：
                            //    假如有2页，且当前在page=1页最后一个"取消收藏"按钮上，点击取消则快速右翻下一页，"取消收藏"异步请求回来找不对应的显示按钮（先不管，记录已取消收藏1个）。
                            // 此时新焦点在第2页第1个"取消收藏按钮"，把第2页（亦即最后一页）所有都取消收藏，任意点击一个视频进入播放，然后返回当前收藏页。此时，合乎用户体验的行为应该
                            // 是返回到上一页（或者最后一个页码）的最后一个"有效"按钮上！！！
                            printLog("checkToAutoFocusOptimalPos()", "处理策略2：页码向前移动一位但前一页无数据，则递归重新向前移动一页！", true);
                            List.checkToAutoFocusOptimalPos();
                        }
                    }
                }
            } else {
                printLog("BtnAction.indexOfLastFocusListBtnId()", "pos: " + pos, true);
                lastFocusListBtnId = firstRecommendId; //首次进入收藏页面，没有任何记录焦点保持，有列表则默认显示第1个视频位
            }

            lastFocusIndex = lastFocusListBtnId; //将渲染UI后即显示焦点的按钮id赋值给lastFocusIndex，用于LMEPG.BM.requestFocus()定位
            printLog("checkToAutoFocusOptimalPos()", "lastFocusIndex: " + lastFocusIndex);
        }
    },


    // 更新当前页收藏列表
    updateCollectDataListUI: function (pageTotalCount, pageDataList) {
        List.pageTotalCount = pageTotalCount;
        List.pageDataList = pageDataList;
        printLog("updateCollectDataListUI()", "渲染前lastFocusIndex: " + lastFocusIndex + ", lastFocusListBtnId: " + lastFocusListBtnId, true);
        List.checkToAutoFocusOptimalPos();
        if (pageDataList.length > 0) {
            List.createHtml();
        }
        printLog("updateCollectDataListUI()", "渲染后lastFocusIndex: " + lastFocusIndex + ", lastFocusListBtnId: " + lastFocusListBtnId, true);
        LMEPG.BM.requestFocus(lastFocusIndex); //渲染完UI，立即定位显示焦点按钮！！！
    },

    // 渲染当前收藏列表html页面
    createHtml: function () {
        BtnAction.marqueeStop(); //防止翻页后相同位置的文本内容仍记录为相同位置上一次的滚动文本

        var start = (List.pageCurrent - 1) * List.PAGE_NUM;
        var end = start + List.PAGE_NUM;
        var displayDataList = List.pageDataList.slice(start, end);//截取打印数据

        var htmlStr = '';
        for (var i = 1; i <= displayDataList.length; i++) {
            var itemData = displayDataList[i - 1];
            // 检验数据，避免无效对象出错中断
            if (!LMEPG.Func.isObject(itemData)) continue;

            var duration = itemData.duration; //视频观看时长
            var freeSeconds = itemData.free_seconds; //免费观看时长
            var ftpUrl = itemData.ftp_url; //视频下载地址
            var imageUrl = RenderParam.fsUrl + itemData.image_url; //图片地址
            var insertDt = itemData.insert_dt; //视频添加时间
            var modelType = itemData.model_type;//
            var sourceId = itemData.source_id; //视频源id
            var title = itemData.title; //标题
            var userType = itemData.user_type; //用户类型
            var unionCode = itemData.union_code; //统一编码
            var collectStatus = 1; //当前收藏状态 0-未收藏 1-已收藏
            var show_status = itemData.show_status;

            htmlStr += '<div id="focus-1-' + i + '" sid="' + sourceId + '" usertype="' + userType + '" ftp=\'' + ftpUrl + '\' title="' + title + '" modelType="' + modelType + '" freeSeconds="' + freeSeconds + '" unionCode="' + unionCode + '" show_status="'+ show_status + '">';
            htmlStr += '<img id="focus-1-' + i + '-border" src="' + Resources.img_url_box.unfocused + '"/>';
            htmlStr += '<img id="focus-1-' + i + '-src" src="' + imageUrl + '" />';
            htmlStr += '<div id="focus-1-' + i + '-title">' + title + '</div>';
            htmlStr += '<div id="focus-2-' + i + '-btn" status="' + collectStatus + '" sid="' + sourceId + '" style="background: url(' + Resources.img_url_cancel_collect.unfocused + ') no-repeat;"></div>';
            htmlStr += '</div>';
        }

        G('content').innerHTML = htmlStr;
        List.updatePaginationUI();
    },

    // 当列表项有焦点时，浮动“查看详情”和“收藏/取消收藏”按钮
    createBtn: function (id, collected) {
        // itemBtnStatus = 0; //默认焦点在“查看详情”
        // var html = '';
        // html += '<div class="detail_btn"><img id="detail_btn" class="btn_bg" src="' + itemBtnBgFocused + '"/>'; //默认焦点图片
        // html += '<div class="btn_title">查看详情</div></div>';
        // html += '<div class="cancel_btn"><img id="cancel_btn" class="btn_bg" src="' + itemBtnBgNormal + '"/>';
        // html += '<div class="btn_title">' + (collected == 1 ? '取消收藏' : '收藏') + '</div></div>';
        // G(id).innerHTML = html;
    },

    // 遥控器左键-上翻页
    loadPrevPage: function (obj) {
        console.log("loadPrevPage", obj)//TODO
        if (List.pageCurrent > 1) {
            List.pageCurrent--;
            List.createHtml();
            LMEPG.BM.requestFocus(BtnAction.getRightMostBtnOfListPanel(true));
        }
    },

    // 遥控器右键-下翻页
    loadNextPage: function (obj) {
        console.log("loadNextPage", obj)//TODO
        if (Math.ceil(List.pageTotalCount / List.PAGE_NUM) > List.pageCurrent) {
            List.pageCurrent++;
            List.createHtml();
            LMEPG.BM.requestFocus(BtnAction.getLeftMostBtnOfListPanel(true));
        }
    },

    // 更新分页显示
    updatePaginationUI: function () {
        var totalPages = Math.ceil(List.pageTotalCount / List.PAGE_NUM);
        if (totalPages > List.pageCurrent) {
            Show('arrow-right');
        } else {
            Hide('arrow-right');
        }
        if (List.pageCurrent > 1) {
            Show('arrow-left');
        } else {
            Hide('arrow-left');
        }

        Show('page-num');
        G('page-num').innerHTML = List.pageCurrent + '/' + totalPages;
    },

    // 推荐位焦点效果
    onFocusChanged: function (btn, hasFocus) {
        if (hasFocus) {
            lastFocusIndex = btn.id; //记录最后一次的聚焦按钮id
            lastFocusListBtnId = btn.id; //记录上一次最后获得焦点的"视频位或收藏按钮"
        }
        if (BtnAction.isMatchCollectBtn(btn.id)) {
            // 操作对象是否是"收藏/取消收藏"按钮
            var domBtn = G(btn.id);
            var isCollected = domBtn.getAttribute("status") == 1;//1-表示已收藏
            if (hasFocus) {
                domBtn.style.background = 'url("' + (isCollected ? Resources.img_url_cancel_collect.focused : Resources.img_url_collect.focused) + '") no-repeat';
            } else {
                domBtn.style.background = 'url("' + (isCollected ? Resources.img_url_cancel_collect.unfocused : Resources.img_url_collect.unfocused) + '") no-repeat';
            }
        } else if (BtnAction.isMatchRecommendBtn(btn.id)) {
            // 操作对象是否是"视频位"按钮
            if (hasFocus) {
                BtnAction.marqueeStart(btn.cTitle);
            } else {
                BtnAction.marqueeStop();
            }
        }
    },

    // 点击事件
    onClicked: function (btn) {
        if (BtnAction.isMatchCollectBtn(btn.id)) {
            // 收藏/取消收藏
            BtnAction.toggleCollectStatus(btn.id);
        } else if (BtnAction.isMatchRecommendBtn(btn.id)) {
            // 点击视频位
            BtnAction.tryJumpVideoPlay(btn.id);
        }
    },

    // 列表焦点移动操作
    onBeforeMoveChanged: function (dir, current) {
        switch (dir) {
            case "left":
                if (BtnAction.isLeftMostBtnOfListPanel(current.id)) {
                    List.loadPrevPage(current);
                    return false;
                }
                break;
            case "right":
                if (BtnAction.isRightMostBtnOfListPanel(current.id)) {
                    List.loadNextPage(current);
                    return false;
                }
                break;
        }
    },

    // 初始化列表
    initButtons: function () {
        // focus-{1,4}-1-border：视频位
        buttons.push({
            id: "focus-1-1-border",
            name: "视频1号位",
            type: 'img',
            focusable: true,
            cIndexId: 'focus-1-1',
            cTitle: 'focus-1-1-title',
            nextFocusLeft: '',
            nextFocusRight: 'focus-1-2-border',
            nextFocusUp: 'toolbar-btn-1',
            nextFocusDown: 'focus-2-1-btn',
            backgroundImage: Resources.img_url_box.unfocused,
            focusImage: Resources.img_url_box.focused,
            click: List.onClicked,
            focusChange: List.onFocusChanged,
            beforeMoveChange: List.onBeforeMoveChanged,
            cIndex: 1, // 序号
        });
        buttons.push({
            id: "focus-1-2-border",
            name: "视频2号位",
            type: 'img',
            focusable: true,
            cIndexId: 'focus-1-2',
            cTitle: 'focus-1-2-title',
            nextFocusLeft: 'focus-1-1-border',
            nextFocusRight: 'focus-1-3-border',
            nextFocusUp: 'toolbar-btn-1',
            nextFocusDown: 'focus-2-2-btn',
            backgroundImage: Resources.img_url_box.unfocused,
            focusImage: Resources.img_url_box.focused,
            click: List.onClicked,
            focusChange: List.onFocusChanged,
            beforeMoveChange: List.onBeforeMoveChanged,
            cIndex: 2, // 序号
        });
        buttons.push({
            id: "focus-1-3-border",
            name: "视频3号位",
            type: 'img',
            focusable: true,
            cIndexId: 'focus-1-3',
            cTitle: 'focus-1-3-title',
            nextFocusLeft: 'focus-1-2-border',
            nextFocusRight: 'focus-1-4-border',
            nextFocusUp: 'toolbar-btn-1',
            nextFocusDown: 'focus-2-3-btn',
            backgroundImage: Resources.img_url_box.unfocused,
            focusImage: Resources.img_url_box.focused,
            click: List.onClicked,
            focusChange: List.onFocusChanged,
            beforeMoveChange: List.onBeforeMoveChanged,
            cIndex: 3, // 序号
        });
        buttons.push({
            id: "focus-1-4-border",
            name: "视频4号位",
            type: 'img',
            focusable: true,
            cIndexId: 'focus-1-4',
            cTitle: 'focus-1-4-title',
            nextFocusLeft: 'focus-1-3-border',
            nextFocusRight: '',
            nextFocusUp: 'toolbar-btn-1',
            nextFocusDown: 'focus-2-4-btn',
            backgroundImage: Resources.img_url_box.unfocused,
            focusImage: Resources.img_url_box.focused,
            click: List.onClicked,
            focusChange: List.onFocusChanged,
            beforeMoveChange: List.onBeforeMoveChanged,
            cIndex: 4, // 序号
        });
        // focus-2-{1,4}-btn：收藏按钮
        buttons.push({
            id: "focus-2-1-btn",
            name: "按钮1号位",
            type: 'img',
            focusable: true,
            cIndexId: 'focus-1-1',
            cTitle: 'focus-1-1-title',
            nextFocusLeft: '',
            nextFocusRight: 'focus-2-2-btn',
            nextFocusUp: 'focus-1-1-border',
            nextFocusDown: '',
            backgroundImage: Resources.img_url_collect.unfocused,
            focusImage: Resources.img_url_collect.focused,
            click: List.onClicked,
            focusChange: List.onFocusChanged,
            beforeMoveChange: List.onBeforeMoveChanged,
            cIndex: 1, // 序号
        });
        buttons.push({
            id: "focus-2-2-btn",
            name: "按钮2号位",
            type: 'img',
            focusable: true,
            cIndexId: 'focus-1-2',
            cTitle: 'focus-1-2-title',
            nextFocusLeft: 'focus-2-1-btn',
            nextFocusRight: 'focus-2-3-btn',
            nextFocusUp: 'focus-1-2-border',
            nextFocusDown: '',
            backgroundImage: Resources.img_url_collect.unfocused,
            focusImage: Resources.img_url_collect.focused,
            click: List.onClicked,
            focusChange: List.onFocusChanged,
            beforeMoveChange: List.onBeforeMoveChanged,
            cIndex: 2, // 序号
        });
        buttons.push({
            id: "focus-2-3-btn",
            name: "按钮3号位",
            type: 'img',
            focusable: true,
            cIndexId: 'focus-1-3',
            cTitle: 'focus-1-3-title',
            nextFocusLeft: 'focus-2-2-btn',
            nextFocusRight: 'focus-2-4-btn',
            nextFocusUp: 'focus-1-3-border',
            nextFocusDown: '',
            backgroundImage: Resources.img_url_collect.unfocused,
            focusImage: Resources.img_url_collect.focused,
            click: List.onClicked,
            focusChange: List.onFocusChanged,
            beforeMoveChange: List.onBeforeMoveChanged,
            cIndex: 3, // 序号
        });
        buttons.push({
            id: "focus-2-4-btn",
            name: "按钮3号位",
            type: 'img',
            focusable: true,
            cIndexId: 'focus-1-4',
            cTitle: 'focus-1-4-title',
            nextFocusLeft: 'focus-2-3-btn',
            nextFocusRight: '',
            nextFocusUp: 'focus-1-4-border',
            nextFocusDown: '',
            backgroundImage: Resources.img_url_collect.unfocused,
            focusImage: Resources.img_url_collect.focused,
            click: List.onClicked,
            focusChange: List.onFocusChanged,
            beforeMoveChange: List.onBeforeMoveChanged,
            cIndex: 4, // 序号
        });
    },

};

/*****************************************************************
 * 底部工具栏
 *****************************************************************/
var FooterBar = {
    initButtons: function () {
    },
};

/*****************************************************************
 * 收藏页面-启动入口
 *****************************************************************/
var MyCollection = {

    // 初始化所有按钮
    initAllButtons: function () {
        ToolBar.initButtons();
        FooterBar.initButtons();
        List.initButtons();
        LMEPG.BM.init("", buttons, "", true);
        LMEPG.KEM.addKeyEvent(
            {
                KEY_PAGE_UP: List.loadPrevPage,             //上一页事件
                KEY_PAGE_DOWN: List.loadNextPage,	        //下一页事件
            });
    },

    // 初始化参数变量
    initDataFirst: function () {
        // 页码记忆
        List.pageCurrent = isNaN(parseInt(RenderParam.pageCurrent)) ? 1 : parseInt(RenderParam.pageCurrent);

        // 按钮焦点记忆
        if (!LMEPG.Func.isEmpty(RenderParam.focusIndex)) {
            lastFocusIndex = RenderParam.focusIndex; //记录上次跳转前的聚焦按钮id
            if (BtnAction.isMatchRecommendBtn(lastFocusIndex) || BtnAction.isMatchCollectBtn(lastFocusIndex)) {
                lastFocusListBtnId = lastFocusIndex; //记录上次跳转前的列表按钮（视频位/收藏操作）
            }
        }

        printLog("initDataFirst()", "List.pageCurrent: " + List.pageCurrent + ", RenderParam.focusIndex: " + RenderParam.focusIndex);
    },

    // 初始化唯一入口
    init: function () {
        this.initDataFirst();
        this.initAllButtons();
        List.loadDataListFirstOnce();
    }
};

window.onload = function () {
    LMEPG.UI.setBackGround();
    MyCollection.init();
};
