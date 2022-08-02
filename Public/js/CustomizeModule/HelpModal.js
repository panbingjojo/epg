/**
 * HelpModal
 * Author: xiaofei.jian
 * time: 2020/4/21 16:12
 */

/**
 * +++++++++++++++++++++++帮助图文处理逻辑+++++++++++++++++++++++++++++++++++++
 */
var HelpModal = {
    /**
     * 显示帮助
     * @returns {boolean}
     */
    count: 0,
    previousFocusIndex: '',
    showTabHelp: function () {
        var that = HelpModal;
        that.curTabEnter = that.getAccessString(true); // 得到当前tab对应的判断标识
        that.curTabPrefix = that.getAccessString(false); // 得到当前tab对应的图片ID前缀
        if (that.dismissHelp()) return; // 截流程序
        that.updateHelpImg(that.curTabPrefix); // 任意键更新下一个帮助图片
        that.isLastHelpModal(that.curTabPrefix, that.curTabEnter);
        return false;
    },
    /**
     * 根据导航个数
     * 设置帮助配置信息
     */
    setConfig: function () {
        var getAjaxHelpInfo = RenderParam.helpTabInfo;
        var configTabBarCount = RenderParam.navConfig.length;
        while (configTabBarCount--) {
            var currentIdx = configTabBarCount;
            var currentTabIdEnterName = 'tab' + currentIdx + 'FirstEnter';
            HelpModal[currentTabIdEnterName] = getAjaxHelpInfo['tab' + currentIdx] || 0;
        }
    },
    /**
     * 获取当前导航标识
     * 或获取当前帮助图文ID
     * @param sign
     * @returns {string}
     */
    getAccessString: function (sign) {
        //获取当前帮助图文ID
        return 'tab' + thisNavID.slice(-1) + (sign ? 'FirstEnter' : '-help');
    },
    /**
     * 不需要帮助图文提示
     * @returns {boolean}
     */
    dismissHelp: function () {
        var configs = [
            HelpModal[this.curTabEnter], // 是否首次进入当前模块
            RenderParam.carrierId === '210092', // 辽宁电信不显示新手引导页
        ];

        if(RenderParam.payMethod.data != null){
            configs.push(RenderParam.payMethod.data.list.length === 0);
        }else{
            configs.push(true);
        }

        return configs.some(function (v) {
            return !!v === true;
        })
    },
    /**
     * 更新帮助图文提示
     * @param curTabPrefix
     */
    updateHelpImg: function (curTabPrefix) {
        LMEPG.BM.requestFocus('debug'); // 焦点移到脚手架上
        H(curTabPrefix + this.previousFocusIndex); // 隐藏上一个tab对应的帮助图片
        S(curTabPrefix + this.count);// 显示当前索引帮助图片
        this.previousFocusIndex = this.count++;
    },
    /**
     * 是否已经更新完当前导航帮助图文提示
     * @param curTabPrefix
     * @param curTabEnter
     */
    isLastHelpModal: function (curTabPrefix, curTabEnter) {
        if (!G(curTabPrefix + (this.count - 1))) {
            LMEPG.UI.showWaitingDialog();
            this[curTabEnter] = 1; // 标记已经进入过了
            this.upLoadFirstEnter(); // 保存用户已经进入过的导航(确保下次不再弹出)
        }
    },
    /**
     * 异步上传标记当前tabbar图文提示
     */
    upLoadFirstEnter: function () {
        var that = this;
        var reqData = {
            'key': thisNavID,
            'value': thisNavID,
            'userId':RenderParam.userId,
        };
        LMEPG.ajax.postAPI('User/updateNoviceGuide', reqData, function (rsp) {
                try {
                    var data = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    var result = data.result;
                    LMEPG.UI.dismissWaitingDialog();
                    LMEPG.BM.requestFocus(thisNavID);// 没有了帮助图文且成功存储则焦点送回
                    console.info('tel ajax result:', reqData, result, thisNavID);
                } catch (e) {
                    that.errorShowHelp(e, rsp)
                }
            },
            function (rsp) {
                that.errorShowHelp(rsp)
            }
        );
    },
    /**
     * 处理错误信息
     * @param str
     * @param param
     */
    errorShowHelp: function (str, param) {
        param = LMEPG.Func.isObject(param) ? JSON.stringify(param) : param;
        console.error('上报首次进入错误！rsp:' + param + "errorString:" + str);
        LMEPG.Log.info('上报首次进入错误！rsp:' + param + "errorString:" + str);
    }
};

HelpModal.setConfig();
