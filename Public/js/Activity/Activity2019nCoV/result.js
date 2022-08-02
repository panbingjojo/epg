/**
 * 健康时播-评测结果
 * */
var Result = {
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
        if (data[0] >= 1 && data[0] >= 2) {
            index = 2;
            Result.setReplaceImg();
        }

        // 同时满足：第二题填写的是高危车次，第三题选择了2项及以上
        if (data[1] === 1 && data[2] >= 2) {
            index = 2;
            Result.setReplaceImg();
        }

        // 第三题选择了5项及以上
        if (data[2] >= 5) {
            index = 2;
            Result.setReplaceImg();
        }

        G('result-txt').innerHTML = Result.retTxt[index];
    },
    setReplaceImg: function () {
        G('btn-1').src = ROOT + '/Public/img/hd/Activity/Activity2019nCoV/btn_tihuan_f.png';
        Result.buttons[0].backgroundImage = ROOT + "/Public/img/hd/Activity/Activity2019nCoV/btn_tihuan.png";
        Result.buttons[0].focusImage = ROOT + "/Public/img/hd/Activity/Activity2019nCoV/btn_tihuan_f.png";
    },
    scrollUI: function (key, btn) {
        if (key === "up") {
            G('result-container').scrollTop += 30;
        }

        if (key === "down") {
            G('result-container').scrollTop -= 30;
        }
    },
    clickBtnJump: function (btn) {
        var targetPage = null;
        var currentPage = LMEPG.Intent.createIntent("activity-result");
        currentPage.setParam('result', LMEPG.Func.getLocationString('result'));

        switch (btn.id) {
            // 在线咨询
            case "btn-1":
                targetPage = LMEPG.Intent.createIntent("doctorList");
                targetPage.setParam("param", '');
                LMEPG.Intent.jump(currentPage);
                break;
            // 疫情动态
            case "btn-2":
                targetPage = LMEPG.Intent.createIntent("report-index");
                targetPage.setParam("param", '');
                LMEPG.Intent.jump(targetPage, currentPage);
                break;
            // 从新评估
            case "btn-3":
                onBack();
                break;
        }
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
                backgroundImage: ROOT + '/Public/img/hd/Activity/Activity2019nCoV/btn1.png',
                focusImage: ROOT + '/Public/img/hd/Activity/Activity2019nCoV/btn1_f.png',
                selectedImage: '',
                click: Result.clickBtnJump,
                focusChange: '',
                beforeMoveChange: Result.scrollUI,
                moveChange: '',
            }, {
                id: 'btn-2',
                name: '',
                type: 'img',
                nextFocusLeft: 'btn-1',
                nextFocusRight: 'btn-3',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: ROOT + '/Public/img/hd/Activity/Activity2019nCoV/btn2.png',
                focusImage: ROOT + '/Public/img/hd/Activity/Activity2019nCoV/btn2_f.png',
                selectedImage: '',
                click: Result.clickBtnJump,
                focusChange: '',
                beforeMoveChange: Result.scrollUI,
                moveChange: '',
            }, {
                id: 'btn-3',
                name: '',
                type: 'img',
                nextFocusLeft: 'btn-2',
                nextFocusRight: 'btn-1',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: ROOT + '/Public/img/hd/Activity/Activity2019nCoV/btn3.png',
                focusImage: ROOT + '/Public/img/hd/Activity/Activity2019nCoV/btn3_f.png',
                selectedImage: '',
                click: Result.clickBtnJump,
                focusChange: '',
                beforeMoveChange: Result.scrollUI,
                moveChange: '',
            },
        ]
    },
};

