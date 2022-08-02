(function (w, e, r) {
    var Activity = {
        init: function () {
            Activity.focusId = LMEPG.Func.getLocationString('focusId') || 'btn_album1';
            //跳转专辑数组
            Activity.albumArr = {
                btn_album1:'album222',
                btn_album2:'album152',
                btn_album3:'album232',
                btn_album4:'album227',
                btn_album5:'album247',
                btn_album6:'album169',
            };
            Activity.initButtons();
        },
        goBack:function () {
            LMEPG.Intent.back();
        },

        onFocus:function (btn,hasFocus) {
            if(hasFocus){
                G(btn.id+'_f').style.display = 'block';
            }else{
                G(btn.id+'_f').style.display = 'none';
            }
        },
        makeImageUrl: function (imageFile) {
            // r.imagePath -- 控制器构建当前活动图片服务器路径
            // imageFile -- 具体的活动文件名
            return r.imagePath + imageFile;
        },

        getCurrentPage: function () {
            return e.Intent.createIntent('activity-common-index');
        },

        /**
         * 跳转 -- 专辑页面
         * @param albumName
         */
        jumpAlbumPage: function (albumName) {
            var objHome = Activity.getCurrentPage();
            objHome.setParam('userId', RenderParam.userId);
            objHome.setParam('focusId', Activity.focusId);

            var objAlbum = LMEPG.Intent.createIntent('album');
            objAlbum.setParam('userId', RenderParam.userId);
            objAlbum.setParam('albumName', albumName);
            objAlbum.setParam('inner', 1);
            LMEPG.Intent.jump(objAlbum, objHome);
        },

        onClickAlbum: function (btn) {
            var albunName = Activity.albumArr[btn.id];
            Activity.focusId = btn.id;
            Activity.jumpAlbumPage(albunName);
        },

        initButtons:function () {
            LMEPG.BM.init(Activity.focusId,Activity.buttons,'',true);
        }
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_album3',
            nextFocusDown: 'btn_album3',
            backgroundImage: Activity.makeImageUrl('btn_back.png'),
            focusImage: Activity.makeImageUrl('btn_back_f.png'),
            click: Activity.goBack
        }, {
            id: 'btn_album1',
            name: '按钮-专辑1',
            type: 'img',
            nextFocusDown: 'btn_album4',
            nextFocusRight: 'btn_album2',
            focusChange: Activity.onFocus,
            click: Activity.onClickAlbum
        }, {
            id: 'btn_album2',
            name: '按钮-专辑2',
            type: 'img',
            nextFocusLeft: 'btn_album1',
            nextFocusRight: 'btn_album3',
            nextFocusDown: 'btn_album5',
            focusChange: Activity.onFocus,
            click: Activity.onClickAlbum
        }, {
            id: 'btn_album3',
            name: '按钮-专辑3',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusDown: 'btn_album6',
            nextFocusRight: 'btn_back',
            nextFocusLeft: 'btn_album2',
            focusChange: Activity.onFocus,
            click: Activity.onClickAlbum
        }, {
            id: 'btn_album4',
            name: '按钮-专辑4',
            type: 'img',
            nextFocusUp: 'btn_album1',
            nextFocusRight: 'btn_album5',
            focusChange: Activity.onFocus,
            click: Activity.onClickAlbum
        },{
            id: 'btn_album5',
            name: '按钮-专辑5',
            type: 'img',
            nextFocusLeft: 'btn_album4',
            nextFocusRight: 'btn_album6',
            nextFocusUp: 'btn_album2',
            focusChange: Activity.onFocus,
            click: Activity.onClickAlbum
        }, {
            id: 'btn_album6',
            name: '按钮-专辑6',
            type: 'img',
            nextFocusUp: 'btn_album3',
            nextFocusRight: 'btn_back',
            nextFocusLeft: 'btn_album5',
            focusChange: Activity.onFocus,
            click: Activity.onClickAlbum
        }
    ];

    w.Activity = Activity;
    w.onBack = Activity.goBack;
})(window, LMEPG, RenderParam);