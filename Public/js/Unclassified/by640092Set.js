/*
by640092Set.js;
author: xiaofei.jian;
date: 2020 / 1 / 15 10:50;
desc: 移植青海电信EPG到宁夏电信EPG 版本更新差异调整js
*/
(function () {
    if (RenderParam.carrierId !== '640092') return;

    function cls(cls) {
        return document.getElementsByClassName(cls)[0];
    }

    function stopEventProcess(key, id, callback) {
        LMEPG.BM.setKeyEventInterceptCallback(function (keycode) {
            if (keycode === key && id.indexOf(LMEPG.BM._current.id) !== -1) {
                LMEPG.UI.showToast('该功能暂未开放，敬请期待!', 1);
                typeof callback === 'function' && callback();
                return true;
            } else {
                return false;
            }
        });
    }

    // 设置首页标题
    if (document.title === "首页carrierIdSet") {
        var navElement = cls('nav');
        var TitleElment = document.createElement('span');
        TitleElment.textContent = '大健康';
        TitleElment.className = 'logo-title';
        navElement.removeChild(cls('logo'));
        navElement.appendChild(TitleElment);
    }

    // 健康管家界面
    if (document.title === "健康管家carrierIdSet") {
        var recommend1 =  G('recommend-1-bg');
        var recommend2Div =  G('recommended-2');
        var recommend3 =  G('recommend-3-bg');
        var recommend4 =  G('recommend-4-bg');
        var recommend5 =  G('recommend-5-bg');
        LMEPG.CssManager.addClass(G('recommended-1'),'by640092');
        LMEPG.CssManager.addClass(G('recommended-3'),'by640092');
        LMEPG.CssManager.addClass(G('recommended-4'),'by640092');
        LMEPG.CssManager.addClass(G('recommended-5'),'by640092');
        recommend1.src = g_appRootPath+'/Public/img/hd/Home/V15/Home/MyHome/record_case.png';
        recommend3.src = g_appRootPath+'/Public/img/hd/Home/V15/Home/MyHome/family_menber.png';
        recommend4.src = g_appRootPath+'/Public/img/hd/Home/V15/Home/MyHome/my_collect.png';
        recommend5.src = g_appRootPath+'/Public/img/hd/Home/V15/Home/MyHome/about_us.png';
        recommend2Div.parentNode.removeChild(recommend2Div);
    }

    if (document.title ==="医生列表carrierIdSet"){
        // document.body.style.backgroundImage = 'url('+ROOT+'Public/img/hd/Home/V10/bg.png)'
    }

    if (document.title === "宝宝健康大测评carrierIdSet"){
        G('modal-bg').src = ROOT+'/Public/img/hd/Activity/ActivityBabyHealthTest/V1/640092/modal_bg.png';
        G('entry-btn').src = ROOT+'/Public/img/hd/Activity/ActivityBabyHealthTest/V1/640092/modal_btn.gif';
    }

    if (document.title==="支付信息carrierIdSet"){
        G('desc-info').innerHTML = (
            '<p> 包月产品订购后不限次数使用，账单支付默认次月以产品价格自动续订；</p>' +
            '<p>如需退订，请在“首页-我的-订购查询”中取消续订，取消续订后次月不再收取费用。</p>'
        )
    }

}());


