// +----------------------------------------------------------------------
// | EPG-LWS
// +----------------------------------------------------------------------
// | 功能：
// |    鉴权home/V7/menuTab{XXX}.js代码逻辑在不同地区有复用，但里面的部分资源与
// | 文本又是写死的，且不同地区的配置位置不一样，所以为了复用用兼容不同的应用地区，把
// | 相关的资源或其它数据抽取到指定数据结构里，通过不同地区判断。
// |
// | 例如：三级页面导航栏图片后台不可配置，但不同地区有变化，所以如下代码需要变通。
// |    // 渲染静态导航
//     navHtml: function () {
//         var currentThirdTabNavImgs = MenuTabDataSource.getThirdTabNavImgs()[RenderParam.homeTabIndex];//改变后
//         var htm = '';
//         for (var i = 0; i < 4; i++) {
//             //htm += '<img id=nav-' + i + ' src=__ROOT__/Public/img/hd/Menu/Tab' + RenderParam.homeTabIndex + '/nav' + i + '.png>';
//             htm += '<img id="nav-' + i + '" src="' + currentThirdTabNavImgs[i].normal + '" alt=""/>';//改变后
//         }
//         this.$.nav.innerHTML = htm;
//         //this.$.title.innerText = ["老年", "育儿", "女性", "男性", "保健"][RenderParam.homeTabIndex - 1];
//         this.$.title.innerText = RenderParam.homeTabNames[RenderParam.homeTabIndex];//改变后
//     },
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/7/1 16:10
// +----------------------------------------------------------------------

/**
 * 由于多级tab页面无法后台配置数据，且复用相同代码逻辑结构+不同地区+不同需求+不同显示图片等，本地化动态配置不同地区的数据源。
 */
var MenuTabDataSource = {

    createImgObj: function (normal, focused, selected) {
        return {
            normal: normal,
            focused: focused,
            selected: selected
        };
    },

    /**
     * 获取三级页面导航条目的不同状态图片。
     * @returns {Array} 二维数组。
     *      array[i]：第几个HomeNavTab（首页导航）对应的三级页面导航栏数据集合。
     *      array[i][i]：某个HomeNavTab（首页导航）对应的三级页面某个导航栏数据。
     */
    getThirdTabNavImgs: function () {
        var allHomeTabThirdImgs = [];
        var tabMenuFolders = [];  //三级页面导航图片父路径最后一级直接目录名（主要用于复用资源配置）
        var appRootPath = LMEPG.App.getAppRootPath();
        var parentPicPath = appRootPath + '/Public/img/hd/Menu'; //三级页面导航图片父路径（主要用于复用资源配置）

        switch (RenderParam.carrierId) {
            case '510094'://四川广电
                tabMenuFolders = [
                    'placeholder', //首页无2/3级页面，仅占位，简化后续代码索引判断（MenuTabDataSource.getThirdTabNavImgs()[RenderParam.homeTabIndex]）。
                    'tab2', //宝贝指南
                    'tab3', //女性宝典
                    'tab1', //老年健康
                    'tab5' //健康百科
                ];
                parentPicPath = appRootPath + '/Public/img/hd/Menu';
                break;
            default:
                tabMenuFolders = [
                    'placeholder', //首页无2/3级页面，仅占位，简化后续代码索引判断（MenuTabDataSource.getThirdTabNavImgs()[RenderParam.homeTabIndex]）。
                    'tab1', //老年
                    'tab2', //育儿
                    'tab3', //女性
                    'tab4', //男性
                    'tab5' //保健
                ];
                parentPicPath = appRootPath + '/Public/img/hd/Menu';
                break;
        }

        // push数据
        for (var i = 0, len = tabMenuFolders.length; i < len; i++) {
            var whichTab = tabMenuFolders[i];
            var finalPicPath = parentPicPath + '/' + whichTab; //e.g. "/Public/img/hd/Menu/Tab1"
            var navs = [];
            for (var j = 0; j < 4/*TODO 每个三级页面目前只有4个导航*/; j++) {
                navs.push(MenuTabDataSource.createImgObj(
                    finalPicPath + '/nav' + j + '.png',
                    finalPicPath + '/nav' + j + '_f.png',
                    finalPicPath + '/nav' + j + '_s.png'
                ));
            }
            allHomeTabThirdImgs.push(navs);
        }

        return allHomeTabThirdImgs;
    }
};