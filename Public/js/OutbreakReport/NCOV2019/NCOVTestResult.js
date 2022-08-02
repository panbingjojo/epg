/**
 * 健康时播-评测结果
 * */
var supportInquiry = ['650092', '640092', '630092', '000051', '520094', '450094','450092','370092', '220094', '220095',
    '460092', '410092', '520094']; // 支持视频问诊的地区

var NCOVTestResult = {
    retTxt: [
        '根据自查结果，您现有的症状不能列为疑似新型冠状病毒感染病例，请勿过度担心！保持正常生活规律，充分休息，保持良好心态，适当转移注意力，有助于您更快恢复健康。注意休息，观察病情。关注生活本身，享受悠闲的时光，在家适当活动，陪伴家人，也是不错的选择哦！冬季也是流感高发季节，应注意与新型冠状病毒肺炎区分，普通感染多在1周后恢复，也无须过度担心哦。您可在线咨询了解详细防护措施。',
        '根据自查结果，目前尚不考虑感染新型冠状病毒，请勿过度担心！但仍建议做好隔离，同时每天重复自测一次，直至体温恢复正常（≤37.3℃），咳嗽等呼吸道症状和（或）乏力、腹泻等消化道症状明显好转。冬季也是流感高发季节，应注意与新型冠状病毒肺炎区分，普通感染多在1周后恢复，也无须过度担心哦。您可在线咨询了解详细防护措施。',
        '根据自查结果，您出现了发热、咳嗽等症状，是否病毒感染需经过医生专业的诊断，请及时到医院挂号就诊，并做好隔离和防护。勿过度恐慌，此时出现紧张焦虑的情绪是正常的，接纳情绪、调整自己，保持良好的心态，有助于身体的恢复。积极配合医生检查和治疗，专业的医务人员将与您一起共渡难关。您也可先点击“发热就诊”进一步了解自己的身体状况及就医流程。'
    ],
    buttons: [],
    init: function () {
        this.createBtns();
        this.showRetTxt();
        LMEPG.BM.init("btn-1", this.buttons, '', true);

    },
    showRetTxt: function () {
        var index = 0;
        var retData = LMEPG.Func.getLocationString('result');
        var data = JSON.parse(retData);
        // 用户3题都未选
        if (data[0] === 0 && data[1] === 0 && data[2] === 0) {
            index = 0;
        }

        // 同时满足：用户第一题未选择，第二题未填写或填写的车次不是高危车次，第三题选项小于3项
        if (data[0] === 0 && data[1] === 0 && data[2] < 3) {
            index = 0;
        }

        // 任意满足：用户第一题选择了一项，第二题填了高危车次，第三题选项为3项或4项；
        if (data[0] === 1 || data[1] === 1 || data[2] === 3 || data[2] === 4) {
            index = 1;
        }

        // 同时满足：用户第一题选择了一项，第三题选择了2项及以上；
        if (data[0] >= 1 && data[2] >= 2) {
            index = 2;
            NCOVTestResult.setReplaceImg();
        }

        // 同时满足：第二题填写的是高危车次，第三题选择了2项及以上
        if (data[1] === 1 && data[2] >= 2) {
            index = 2;
            NCOVTestResult.setReplaceImg();
        }

        // 第三题选择了5项及以上
        if (data[2] >= 5) {
            index = 2;
            NCOVTestResult.setReplaceImg();
        }

        G('result-txt').innerHTML = NCOVTestResult.retTxt[index];
    },
    setReplaceImg: function () {
        G('btn-1').src = ROOT + '/Public/img/hd/OutbreakReport/NCOV/btn_tihuan_f.png';
        NCOVTestResult.buttons[0].backgroundImage = ROOT + "/Public/img/hd/OutbreakReport/NCOV/btn_tihuan.png";
        NCOVTestResult.buttons[0].focusImage = ROOT + "/Public/img/hd/OutbreakReport/NCOV/btn_tihuan_f.png";
        Hide('suggest-1');
        Hide('suggest-2');
        Hide('suggest-3');
        Show('suggest-4');
        Show('suggest-5');
    },
    scrollUI: function (key, btn) {
        if (G('result-container').scrollTop === 0) S('down-arrow');
        if (key === "up") {
            G('result-container').scrollTop -= 30;
        }

        if (key === "down") {
            H('down-arrow');
            G('result-container').scrollTop += 30;
        }
    },
    clickBtnJump: function (btn) {
        var targetPage = null;
        var currentPage = LMEPG.Intent.createIntent("nCoV-test-result");
        currentPage.setParam('result', LMEPG.Func.getLocationString('result'));

        switch (btn.id) {
            // 在线咨询
            case "btn-1":
                if (supportInquiry.indexOf(RenderParam.carrierId) != -1) {
                    NCOVTestResult.jumpInquiry(currentPage);
                } else {
                    // 不支持视频问诊，就走向一个提示页
                    Show('second-model');
                }
                break;
            // 疫情动态
            case "btn-2":
                targetPage = LMEPG.Intent.createIntent("report-index");
                targetPage.setParam("focusIndex2", 'btn-5');
                LMEPG.Intent.jump(targetPage, null);
                break;
            // 从新评估
            case "btn-3":
                LMEPG.Intent.back();
                break;
        }
    },

    // 点击视频问诊按钮
    jumpInquiry: function (currentPage) {
        var P2PIntent = "doctorList";
        if (RenderParam.carrierId == "000051" || RenderParam.carrierId == "370092"
            || RenderParam.carrierId == "630092") {
            P2PIntent = "doctorIndex";
        }
        if (RenderParam.carrierId == "520094") {
            P2PIntent = "homeTab3";
        }
        var objDoctorP2P = LMEPG.Intent.createIntent(P2PIntent);
        objDoctorP2P.setParam('userId', RenderParam.userId);

        LMEPG.Intent.jump(objDoctorP2P, currentPage);
    },

    createBtns: function () {
        this.buttons = [
            {
                id: 'btn-1',
                name: '',
                type: 'img',
                nextFocusLeft: 'btn-3',
                nextFocusRight: 'btn-2',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/btn1.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/btn1_f.png',
                selectedImage: '',
                click: NCOVTestResult.clickBtnJump,
                focusChange: '',
                beforeMoveChange: NCOVTestResult.scrollUI,
                moveChange: ''
            }, {
                id: 'btn-2',
                name: '',
                type: 'img',
                nextFocusLeft: 'btn-1',
                nextFocusRight: 'btn-3',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/btn2.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/btn2_f.png',
                selectedImage: '',
                click: NCOVTestResult.clickBtnJump,
                focusChange: '',
                beforeMoveChange: NCOVTestResult.scrollUI,
                moveChange: ''
            }, {
                id: 'btn-3',
                name: '',
                type: 'img',
                nextFocusLeft: 'btn-2',
                nextFocusRight: 'btn-1',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/btn3.png',
                focusImage: ROOT + '/Public/img/hd/OutbreakReport/NCOV/btn3_f.png',
                selectedImage: '',
                click: NCOVTestResult.clickBtnJump,
                focusChange: '',
                beforeMoveChange: NCOVTestResult.scrollUI,
                moveChange: ''
            }
        ]
    }
};

function onBack() {
    var judge = getComputedStyle(G('second-model'), null).display;
    if (judge == 'block') {
        // 如果当弹出框时，按返回，就把弹出框隐藏掉
        Hide('second-model');
    } else {
        NCOVTestResult.clickBtnJump({id: 'btn-2'});
    }
}

