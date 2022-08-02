/**
 * 该文件重新改版吉林电信EPG我的家块时构建
 * @type {{}}
 */
var Family = {
    initButtons: function () {
        var buttons = [
            {
                id: 'family-archives',
                name: '家庭档案',
                type: 'img',
                focusable: true,
                nextFocusLeft: '',
                nextFocusUp: '',
                nextFocusRight: 'my-collection',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V220095/family_archives.png',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V220095/family_archives.png',
                focusChange: Family.onFocusChange,
                click: Family.onClick
            },
            {
                id: 'my-collection',
                name: '我的收藏',
                type: 'img',
                focusable: true,
                nextFocusLeft: 'family-archives',
                nextFocusUp: '',
                nextFocusRight: 'expert-appointment-record',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V220095/my_collection.png',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V220095/my_collection.png',
                focusChange: Family.onFocusChange,
                click: Family.onClick
            },
            {
                id: 'expert-appointment-record',
                name: '专家约诊记录',
                type: 'img',
                focusable: true,
                nextFocusLeft: 'my-collection',
                nextFocusUp: '',
                nextFocusRight: '',
                nextFocusDown: 'about-us',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V220095/expert_appointment_record.png',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V220095/expert_appointment_record.png',
                focusChange: Family.onFocusChange,
                click: Family.onClick
            },
            {
                id: 'about-us',
                name: '关于我们',
                type: 'img',
                focusable: true,
                nextFocusLeft: 'my-collection',
                nextFocusUp: 'expert-appointment-record',
                nextFocusRight: '',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V220095/about_us.png',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V220095/about_us.png',
                focusChange: Family.onFocusChange,
                click: Family.onClick
            },
        ];
        var focusButton = RenderParam.focusButton === "" ? "family-archives" : RenderParam.focusButton;
        LMEPG.ButtonManager.init(focusButton, buttons, null, true);
    },

    currentPageIntent: function (buttonId) {
        var currentPageIntent = LMEPG.Intent.createIntent('familyHome');
        currentPageIntent.setParam("focusIndex", buttonId);
        return currentPageIntent;
    },

    onFocusChange: function (button, hasFocus) {
        var borderImage;
        if (button.id === 'family-archives' || button.id === 'my-collection') {
            borderImage = g_appRootPath + '/Public/img/hd/Family/V220095/border_1.png';
        } else {
            borderImage = g_appRootPath + '/Public/img/hd/Family/V220095/border_2.png';
        }
        var boxElement = G(button.id + '-box');
        if (hasFocus) {
            boxElement.style.backgroundImage = 'url("' + borderImage + '")';
        } else {
            boxElement.style.backgroundImage = '';
        }
    },

    onClick: function (button) {
        var routePageIntent;
        switch (button.id) {
            case 'family-archives':
                routePageIntent = LMEPG.Intent.createIntent('familyEdit');
                break;
            case 'my-collection':
                routePageIntent = LMEPG.Intent.createIntent('collect');
                break;
            case 'expert-appointment-record':
                routePageIntent = LMEPG.Intent.createIntent('expertRecordHome');
                break;
            case 'about-us':
                routePageIntent = LMEPG.Intent.createIntent('familyAbout');
                break;
        }
        var currentPageIntent = Family.currentPageIntent(button.id);
        LMEPG.Intent.jump(routePageIntent, currentPageIntent);
    }
}