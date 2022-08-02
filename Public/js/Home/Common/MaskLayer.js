// +----------------------------------------------------------------------
// | MoFang-EPG-LWS
// +----------------------------------------------------------------------
// | 新手指导蒙层通用操作
// +----------------------------------------------------------------------
// |    "39健康魔方"    |   ""
// +----------------------------------------------------------------------
// | 功能：
// |    39健康魔方：当有些页面有用户首次使用，需要显示新手指导蒙层引导。
// | 当某一step中存在多个sub step，且这些sub step根据业务需求，当阅读完一
// | sub step对应的“音频”后，再自动显示出下一个sub step并播放其对应的
// | “音频文件”，如此类推，直到显示完最后一个sub step结束为止。
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/11/27 16:10
// +----------------------------------------------------------------------

(function (w) {

    /**
     * 新手指导页面蒙层使用记录操作。
     */
    w.NewGuidanceUtil = {
        /**
         * 封装 [请求获取新手引导使用记录]（统一约定格式）
         *
         * @param currentPageNameIds [String|Array] 当前页面唯一标识。可变参数，支持同时获取单个和多个页面的新手指导使用记录。
         *      例如：["classify_tab_0", "classify_tab_1", "classify_tab_2", "classify_tab_3", classify_tab_4"]，获取5个导航栏目新手指导使用记录
         */
        packGetNewGuidanceReqParam: function (currentPageNameIds) {
            if (typeof currentPageNameIds === 'string') {
                currentPageNameIds = [currentPageNameIds];
            } else if (!is_array(currentPageNameIds)) {
                return;
            }
            var reqData = {'data': currentPageNameIds};
            return JSON.stringify(reqData);
        },

        /**
         * 封装 [设置新手引导使用记录]（统一约定格式）
         *
         * @param currentPageNameId 当前页面唯一标识。
         *      例如：{ "data": { "classify_tab_0": 1 } }，表示用户已操作完成导航栏目1(即首页)新手指导，设置1表示下次不会再弹出新手指导蒙层
         * @param flag 1-表示已使用过新手指导，下次不会再显示。0-表示下次还会显示新手指导。
         */
        packSetNewGuidanceReqParam: function (currentPageNameId, flag) {
            var reqData = {
                'data': [
                    {
                        'item_id': currentPageNameId,
                        'flag': flag
                    }
                ]
            };
            return JSON.stringify(reqData);
        },

        /**
         * 统一处理指定页面对应的新手指导使用记录并对需要显示蒙层新手引导回调处理。
         *
         * 其中，从Android端获取的数据jsonFromAndroid示例：
         *
         *      {
         *		    "data": {
         *		        "唯一标识item_id_1": "0或1",
         *			    "唯一标识item_id_2": "0或1",
         *			    "唯一标识item_id_3": "0或1",
         *		    }
         *	    }
         *
         * @param currentPageNameId 当前页面唯一标识。例如：page_home_navigation_tab1(首页导航栏目页1), page_self_test_1(自测页面), ...
         * @param jsonFromAndroid 来自Android端的json数据
         * @param showMaskLayerCallback 要显示蒙层新手引导的回调。
         * @param notMaskLayerCallback 未使用过或者异常，则不显示蒙层回调。
         */
        handleNewGuidanceCallback: function (currentPageNameId, jsonFromAndroid, showMaskLayerCallback, notMaskLayerCallback) {
            try {
                var response = JSON.parse(jsonFromAndroid);
                if (is_object(response)) {
                    var alreadyUsedNewGuidance = eval('response.data.' + currentPageNameId); // item_id对应的值
                    if (is_exist(alreadyUsedNewGuidance) && alreadyUsedNewGuidance != '1') {
                        LMEPG.call(showMaskLayerCallback); //开始显示新手指导
                        return;
                    } else {
                        // 已经使用过当前页的新手指导了，不需要弹出引导蒙层
                    }
                }
            } catch (e) {
                LMEPG.Log.error('[MaskLayer.js]--->[handleNewGuidanceCallback]--->handleNewGuidanceCallback: Occurred exception: ' + e.toString());
            }

            // 未使用过或者异常，则不显示蒙层回调
            LMEPG.call(notMaskLayerCallback);
        },

        /**
         * 一键调用检查“指定页面”是否使用“新手记录”。
         *
         * 当然，为了方便扩展，也可以分别调用：
         *      > NewGuidanceUtil.packGetNewGuidanceReqParam
         *      > NewGuidanceUtil.packSetNewGuidanceReqParam
         *      > NewGuidanceUtil.handleNewGuidanceCallback
         *
         * @param currentPageNameId 该页面唯一标识
         * @param firstTimeEntryCallback 首次访问该页面的回调
         * @param notFirstTimeEntryCallback 非首次访问该页面的回调
         */
        checkIsFirstTimeEntry: function (currentPageNameId, firstTimeEntryCallback, notFirstTimeEntryCallback) {
            console.log('currentPageNameId：' + currentPageNameId);
            // if (首次访问: 实现...) {
            //     LMEPG.call(firstTimeEntryCallback);
            // } else {
            //     LEMPG.call(notFirstTimeEntryCallback);
            // }
            LMEPG.call(firstTimeEntryCallback);
        },

        /**
         * 一键调用设定“指定页面”是否使用“新手记录”。
         *
         * @param currentPageNameId 该页面唯一标识
         * @param accessFlag 访问标记（0：未曾访问使用过 1：已经首次访问过）
         */
        markFirstTimeEntryFlag: function (currentPageNameId, accessFlag) {
            // 标记为已经首次访问过了：实现...
        }
    };

})(window);