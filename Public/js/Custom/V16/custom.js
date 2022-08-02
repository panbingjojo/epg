var Custom = {
    buttons: [],
    curData: [], // 当前页数据
    page: 1,
    maxPage: 0,
    keepFocusId: 'tab-bg-0', // 左侧导航被选中的焦点
    init: function() {
        Custom.page = parseInt(RenderParam.page);
        Network.getSkinList(function() {
            Custom.renderPage();
            Custom.createBtns();
            Custom.initSwitchButton();
        });
    },
    renderPage: function() {
        G('my-score').innerText = '我的积分为：' + RenderParam.totalScore;
        /*var imgCurrent = new Image();
         imgCurrent.id = 'current-icon';
         imgCurrent.src = '/Public/img/hd/Custom/current_s.png';
         G('tab-bg-' + this.currentImageIndex).appendChild(imgCurrent);*/

        var htm = '';
        Custom.curData = sysSkinList.slice(3 * (Custom.page - 1), 3 * Custom.page);
        for (var i = 0; i < Custom.curData.length; i++) {
            // 判断当前是否是正在使用的，如果是正在使用，则html增加使用的标签图
            var labelHtml = '';
            for (var k = 0; k < userSkinList.length; k++) {
                if (Custom.curData[i].skin_id == userSkinList[k].skin_id && userSkinList[k].in_use == 1) {
                    labelHtml = '<img id ="current-icon" src="' + g_appRootPath + '/Public/img/hd/Custom/V16/current_s.png" alt=""/>';
                    break;
                }
            }

            // 第一个默认皮肤单独处理
            if (Custom.curData[i].skin_id == -1) {
                var img = g_appRootPath + '/Public/img/hd/Custom/V16/default_bg_left.png';
            } else{
                var img = RenderParam.fsUrl + Custom.curData[i].list_img_url;
            }
            htm += '<div id="tab-bg-' + i + '"><img id="tab-' + i + '" src=' + img + ' alt="">' + labelHtml + '</div>';
        }
        G('small-tab-bg-wrap').innerHTML = htm;
        Custom.toggleArrow();
    },

    /**
     * 获取焦点
     */
    onFocusIn: function(btn, hasFocus) {
        var index = parseInt(btn.id.substr(7));
        if (hasFocus) {
            // 保存导航选中焦点
            Custom.keepFocusId = btn.id;

            // 设置右边效果图（第一个默认皮肤单独处理）
            if (Custom.curData[index].skin_id == -1) {
                if (RenderParam.carrierId == '320092'
                    || RenderParam.carrierId == '500092') {
                    G('big-bg-preview').src =g_appRootPath+ '/Public/img/hd/Custom/default_bg_right_320092.png';
                } else {
                    G('big-bg-preview').src = g_appRootPath+'/Public/img/hd/Custom/V16/default_bg_right.png';
                }
            } else{
                G('big-bg-preview').src = RenderParam.fsUrl + JSON.parse(Custom.curData[index].bk_img_urls).homepage;
            }

            // 设置皮肤名称
            G('skin-name').innerHTML = Custom.curData[index].skin_name;

            // 根据当前获取焦点的背景图，判断不同状态，显示兑换或者使用按钮
            var index = parseInt(btn.id.substr(7));
            curSkinId = Custom.curData[index].skin_id;
            isHasSkin = false; // 是否拥有当前皮肤
            for (var k = 0; k < userSkinList.length; k++) {
                if (curSkinId == userSkinList[k].skin_id) {
                    isHasSkin = true;
                    break;
                }
            }
            // 使用
            if (isHasSkin) {
                Custom.buttons[4].backgroundImage =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_use.png';
                Custom.buttons[4].focusImage =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_use_f.png';
                G(Custom.buttons[4].id).src = g_appRootPath+'/Public/img/hd/Custom/V16/btn_use.png';
                G('cost').innerHTML = '';
            }
            // 兑换
            else{
                Custom.buttons[4].backgroundImage =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_exchange.png';
                Custom.buttons[4].focusImage =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_exchange_f.png';
                G(Custom.buttons[4].id).src =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_exchange.png';
                G('cost').innerHTML = '需要' + Custom.curData[index].price + '积分';
            }
        }
    },

    /**
     * 翻页箭头设置
     */
    toggleArrow: function() {
        S('prev-arrow');
        S('next-arrow');
        if (Custom.page == 1) H('prev-arrow');
        if (Custom.maxPage == Custom.page) H('next-arrow');
    },

    /**
     * 上下翻页
     */
    onBeforeMoveChange: function(dir, btn) {
        // 上一页
        if (dir == 'up' && btn.id == 'tab-bg-0') {
            Custom.prevPage();
            return false;
        }
        // 下一页
        else if (dir == 'down' && btn.id == 'tab-bg-2') {
            Custom.nextPage();
            return false;
        }

        // 焦点移动到选中的tab
        if (btn.id == 'exchange' && dir == 'left') {
            LMEPG.BM.requestFocus(Custom.keepFocusId);
            return false;
        }
    },

    /**
     * 上一页
     */
    prevPage: function() {
        if (Custom.page == 1) {
            return;
        }
        Custom.page--;
        Custom.renderPage();
        LMEPG.BM.requestFocus('tab-bg-2');
    },

    /**
     * 下一页
     */
    nextPage: function() {
        if (Custom.page == Custom.maxPage) {
            return;
        }
        Custom.page++;
        Custom.renderPage();
        LMEPG.BM.requestFocus('tab-bg-0');
    },

    /**
     * 初始化切换按钮的状态
     */
    initSwitchButton: function() {
        var state = parseInt(RenderParam.state);
        var btn = LMEPG.BM.getButtonById('switch');
        if (state == 0) { // 未开启状态，显示开启的按钮
            btn.backgroundImage =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_auto_update_open.png';
            btn.focusImage =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_auto_update_open_f.png';
            if (LMEPG.BM.getCurrentButton() && LMEPG.BM.getCurrentButton().id == btn.id) {
                G(btn.id).src =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_auto_update_open_f.png';
            } else{
                G(btn.id).src = g_appRootPath+'/Public/img/hd/Custom/V16/btn_auto_update_open.png';
            }
        } else{ // 开启状态，显示关闭的按钮
            btn.backgroundImage =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_auto_update_close.png';
            btn.focusImage =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_auto_update_close_f.png';
            if (LMEPG.BM.getCurrentButton() && LMEPG.BM.getCurrentButton().id == btn.id) {
                G(btn.id).src = g_appRootPath+'/Public/img/hd/Custom/V16/btn_auto_update_close_f.png';
            } else{
                G(btn.id).src =g_appRootPath+ '/Public/img/hd/Custom/V16/btn_auto_update_close.png';
            }
        }
    },

    /**
     * 创建按钮
     */
    createBtns: function() {
        this.buttons = [];
        this.buttons.push({
            id: 'tab-bg-0',
            name: '切换背景0',
            type: 'div',
            nextFocusRight: 'exchange',
            nextFocusUp: 'switch',
            nextFocusDown: 'tab-bg-1',
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ?g_appRootPath+'/Public/img/sd/Unclassified/V16/bg_s_f.png': g_appRootPath+'/Public/img/hd/Custom/V16/bg_s_f.png',
            click: '',
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onBeforeMoveChange
        }, {
            id: 'tab-bg-1',
            name: '切换背景1',
            type: 'div',
            nextFocusUp: 'tab-bg-0',
            nextFocusDown: 'tab-bg-2',
            nextFocusRight: 'exchange',
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ?g_appRootPath+'/Public/img/sd/Unclassified/V16/bg_s_f.png': g_appRootPath+'/Public/img/hd/Custom/V16/bg_s_f.png',
            click: '',
            focusChange: this.onFocusIn
        }, {
            id: 'tab-bg-2',
            name: '切换背景2',
            type: 'div',
            nextFocusRight: 'exchange',
            nextFocusUp: 'tab-bg-1',
            backgroundImage: g_appRootPath+'/Public/img/hd/Common/transparent.png',
            focusImage: RenderParam.platformType == 'sd' ?g_appRootPath+'/Public/img/sd/Unclassified/V16/bg_s_f.png': g_appRootPath+'/Public/img/hd/Custom/V16/bg_s_f.png',
            click: '',
            focusChange: this.onFocusIn,
            beforeMoveChange: this.onBeforeMoveChange
        }, {
            id: 'switch',
            name: '',
            type: 'img',
            nextFocusLeft: 'exchange',
            nextFocusDown: 'exchange',
            click: Network.switchAutoUpdateState,
            onBgType: g_appRootPath+'/Public/img/hd/Custom/on.png',
            offBgType: g_appRootPath+'/Public/img/hd/Custom/off.png',
            backgroundImage:g_appRootPath+ '/Public/img/hd/Custom/V16/btn_auto_update_open.png',
            focusImage: g_appRootPath+'/Public/img/hd/Custom/V16/btn_auto_update_open_f.png',
            focusChange: ''
        }, {
            id: 'exchange',
            name: '兑换/使用',
            type: 'img',
            nextFocusLeft: 'tab-bg-0',
            nextFocusRight: 'switch',
            nextFocusUp: 'switch',
            backgroundImage: g_appRootPath+'/Public/img/hd/Custom/V16/btn_exchange.png',
            focusImage:g_appRootPath+ '/Public/img/hd/Custom/V16/btn_exchange_f.png',
            click: Network.onExchangeOrUse,
            beforeMoveChange: this.onBeforeMoveChange
        });
        LMEPG.ButtonManager.init(!LMEPG.Func.isEmpty(RenderParam.keepFocusId) ? RenderParam.keepFocusId : 'tab-bg-0', this.buttons, '', true);
    }
};

/**
 * 网络请求
 */
var sysSkinList = []; // 系统皮肤列表
var userSkinList = []; // 用户已兑换皮肤列表
var isHasSkin; // 是否拥有当前焦点皮肤
var curSkinId; // 当前焦点皮肤id
var Network = {
    /**
     * 开启/关闭 自动更新
     */
    switchAutoUpdateState: function() {
        LMEPG.UI.showWaitingDialog();
        var value;
        if (RenderParam.state == 0) {
            value = 1;
        } else{
            value = 0;
        }
        var postData = {
            'key': 'EPG-LWS-AUTO-UPDATE-BG-' + RenderParam.carrierId + '-' + RenderParam.userId,
            'value': value
        };
        LMEPG.ajax.postAPI('Activity/saveStoreData', postData,
            function(rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                var result = data.result;
                console.log(data);
                if (result == 0) {
                    RenderParam.state = value;
                    Custom.initSwitchButton();
                } else{
                    LMEPG.UI.showToast('操作失败！');
                }
                LMEPG.UI.dismissWaitingDialog();
            }
        );
    },

    /**
     * 获取自定义皮肤列表
     */
    getSkinList: function(callback) {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Skin/getSkinList', {}, function(rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                var result = data.result;
                console.log(data);
                if (result == 0) {
                    // 模拟多条数据翻页
                    // data.sys_list.push(data.sys_list[0]);

                    sysSkinList = data.sys_list;
                    userSkinList = data.user_list;

                    // 由于系统自带了一个默认皮肤，需要把皮肤加入到列表中，统一管理
                    console.log(sysSkinList);
                    console.log(userSkinList);
                    var defaultSysSkin = {
                        skin_id: '-1',
                        skin_name: '默认皮肤'
                    };
                    sysSkinList.unshift(defaultSysSkin);
                    var defaultUserSkin = {
                        skin_id: '-1',
                        in_use: '0'
                    };
                    // 循环遍历用户皮肤列表，判断是否有正在使用的皮肤，如果没有，则把默认皮肤设置为正在使用
                    var isHasDefault = false;
                    for (var i = 0; i < userSkinList.length; i++) {
                        if (+userSkinList[i].in_use == 1) {
                            isHasDefault = true;
                            break;
                        }
                    }
                    if (!isHasDefault) {
                        defaultUserSkin.in_use = '1';
                    }
                    userSkinList.unshift(defaultUserSkin);

                    Custom.maxPage = Math.ceil(sysSkinList.length / 3);
                    callback();
                } else{
                    LMEPG.UI.showToast('皮肤列表获取失败！');
                }
                LMEPG.UI.dismissWaitingDialog();
            }
        );
    },

    /**
     * 兑换皮肤
     */
    exchangeSkin: function() {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Skin/exchangeSkin', {skin_id: curSkinId}, function(rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                var result = data.result;
                console.log(data);
                if (result == 0) {
                    // 重载当前页面
                    var objDst = LMEPG.Intent.createIntent('custom');
                    objDst.setParam('page', Custom.page);
                    objDst.setParam('keepFocusId', Custom.keepFocusId);
                    LMEPG.Intent.jump(objDst, null);
                } else{
                    if (result == -114) {
                        LMEPG.UI.showToast('皮肤不存在！');
                    } else if (result == -109) {
                        LMEPG.UI.showToast('积分不足！');
                    } else if (result == -115) {
                        LMEPG.UI.showToast('已兑换过！');
                    } else{
                        LMEPG.UI.showToast('兑换失败！');
                    }
                }
                LMEPG.UI.dismissWaitingDialog();
            }
        );
    },

    /**
     * 使用皮肤(传-1表示停用已使用的皮肤，代表用户目前没有使用自定义皮肤，使用的是默认皮肤)
     */
    useSkin: function() {
        LMEPG.UI.showWaitingDialog();
        LMEPG.ajax.postAPI('Skin/useSkin', {skin_id: curSkinId}, function(rsp) {
                var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                var result = data.result;
                console.log(data);
                if (result == 0) {
                    // 重载当前页面
                    var objDst = LMEPG.Intent.createIntent('custom');
                    LMEPG.Intent.jump(objDst, null);
                    objDst.setParam('page', Custom.page);
                    objDst.setParam('keepFocusId', Custom.keepFocusId);
                } else{
                    LMEPG.UI.showToast('设置皮肤失败！');
                }
                LMEPG.UI.dismissWaitingDialog();
            }
        );
    },

    /**
     * 兑换/使用皮肤
     */
    onExchangeOrUse: function() {
        if (isHasSkin) {
            Network.useSkin();
        } else{
            Network.exchangeSkin();
        }
    }
};

// 公用返回函数（全局、键值对象）
var onBack = function() {
    LMEPG.Intent.back();
};