var gameFocId = ''
var isHideOrderFocus = false

var Page = {
    rankList: [],
    area: '',
    meInfo: null,
    checkTimer: null,
    isVerify: null,
    init: function () {
        LMEPG.UI.setBackGround()
        this.renderGame()
        if (RenderParam.isVip === 1) {
            G('func-bottom-5').src = g_appRootPath + '/Public/img/hd/Home/V32/has-pay.png'
        }

        this.initFixedBtn()
        LMEPG.BM.init('game-0', [])
        Network.getGameInfo(function (data) {
            Page.meInfo = data
            G('avatar').src = RenderParam.fsUrl + data.experData.handData.hand_url
            G('name').innerHTML = data.experData.handData.nick_name
            G('bean').innerHTML = data.goldData.data.beans
            G('card').innerHTML = data.goldData.data.wangCards
            G('diamond').innerHTML = data.experData.exper_val.diamond
            G('lever-num').innerHTML = data.experData.exper_val.grade_val
            G('cur-ex').innerHTML = data.experData.exper_val.exper_val
            G('max-ex').innerHTML = data.experData.grade_val.exper_max
            G('now-progress').style.width = data.experData.exper_val.exper_val / data.experData.grade_val.exper_max * 100 + 'px'

            Page.isVerify = data.experData.handData.isVerify
        })

        Network.getRankList(0, function (data) {
            Page.rankList = data.data.data
            Page.area = data.data.areaName
            Page.renderRankSimple()
        })
        LMEPG.Func.listenKey(3, [KEY_3, KEY_9, KEY_8, KEY_3], jumpTestPage);
        hideOrderFocus();
    },

    renderGame: function () {
        var html = ''
        var btnArr = []
        var position = RenderParam.homeConfigInfo.data.entry_list

        function direction(index) {
            switch (index) {
                case 0:
                case 1:
                    return 'head-avatar'
                case 2:
                    return 'recharge-btn'
                default:
                    return 'game-' + (index - 3)
            }
        }

        for (var index = 0; index < 6; index++) {
            var icon = JSON.parse(position[index].item_data[0].inner_parameters).cornermark.img_url

            html +=
                '<div class="game-item" id="game-' + index + '">' +
                (icon ? '<img src="' + RenderParam.fsUrl + icon + '" class="game-icon"/>' : '') +
                '<img src="' + RenderParam.fsUrl + position[index].item_data[0].img_url + '" />' +
                '</div>'

            btnArr.push({
                id: 'game-' + index,
                type: 'div',
                nextFocusDown: index > 2 ? 'func-bottom-4' : 'game-' + (index + 3),
                nextFocusUp: direction(index),
                nextFocusLeft: 'game-' + (index - 1),
                nextFocusRight: 'game-' + (index + 1),
                backgroundImage: " ",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V32/choose-border-1.png",
                click: Page.openGame,
                focusChange: '',
                beforeMoveChange: '',
                data: JSON.parse(position[index].item_data[0].parameters)[0].param,
                power: position[index].item_data[0].access_ctrl // 权限 2VIP 其他非VIP
            })
        }

        LMEPG.BM.addButtons(btnArr)
        G('game').innerHTML = html
    },

    openGame: function (btn) {
        var card = parseInt(G('card').innerHTML);
        if (btn.power === '2' && RenderParam.isVip !== 1 && card <= 0) {
            //LMEPG.UI.showToast('请开通VIP后才可开始游戏')
            var objCurrent = LMEPG.Intent.createIntent('home');
            var jumpObj = LMEPG.Intent.createIntent('orderHome');
            jumpObj.setParam("userId", RenderParam.userId);
            jumpObj.setParam("type", 1);//订购类型 1 包月订购，2 充值乐卡
            LMEPG.Intent.jump(jumpObj, objCurrent);
            return;
        }

        Network.getGameDetail(btn.data, function (data) {
            gameFocId = btn.id
            var div = document.createElement('div')
            div.className = 'game-detail'
            div.id = 'game-detail'

            div.innerHTML =
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/detail-logo.png" class="detail-logo"/>' +
                '<img src="' + RenderParam.fsUrl + data.data.img_url + '" class="detail-game-pic"/>' +
                '<div class="detail-game-name">' + data.data.game_name + '</div>' +
                '<div class="detail-game-size">游戏大小：' + data.version.game_size + '</div>' +
                '<div class="detail-game-v">游戏版本：' + data.version.game_version + '</div>' +
                '<div class="detail-info">游戏简介：' + data.data.remark + '</div>' +
                '<img class="detail-start" src="' + g_appRootPath + '/Public/img/hd/Home/V32/start-game-btn.png" id="detail-start"/>'

            LMEPG.BM.addButtons([{
                id: 'detail-start',
                type: 'img',
                nextFocusDown: '',
                nextFocusUp: '',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: " ",
                focusImage: g_appRootPath + '/Public/img/hd/Home/V32/start-game-btn.png',
                click: InterFaceEvent.startGame,
                focusChange: '',
                beforeMoveChange: '',
                signInfo: '',
                data: data
            }])

            document.body.appendChild(div)
            LMEPG.BM.requestFocus('detail-start')
        })

    },

    renderCheckPop: function (signData) {
        var div = document.createElement('div')
        div.className = 'sign'
        div.id = 'sign'

        var h = this.renderSignItem(signData)

        div.innerHTML =
            '<div class="btn-close" id="close-check-btn"><img src="' + g_appRootPath + '/Public/img/hd/Home/V32/close-btn.png"></div>' +
            '<div class="sign-content">' + h + '</div>' +
            '<img src="' + g_appRootPath + (signData.isTodaySign === 0 ? '/Public/img/hd/Home/V32/sign-btn.png' : '/Public/img/hd/Home/V32/today-has-sign.png') + '" class="sing-btn" id="sing-btn">' +
            '<div class="tip">连续签到，即可获得更多奖励</div>'

        document.body.appendChild(div)
        LMEPG.BM.addButtons([{
            id: 'sing-btn',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'close-check-btn',
            nextFocusLeft: '',
            nextFocusRight: '',
            backgroundImage: g_appRootPath + (signData.isTodaySign === 0 ? "/Public/img/hd/Home/V32/sign-btn-l.png" : '/Public/img/hd/Home/V32/today-has-sign-l.png'),
            focusImage: g_appRootPath + (signData.isTodaySign === 0 ? "/Public/img/hd/Home/V32/sign-btn.png" : '/Public/img/hd/Home/V32/today-has-sign.png'),
            click: Page.meSignIn,
            focusChange: '',
            beforeMoveChange: '',
            signInfo: signData
        },{
            id: 'close-check-btn',
            type: 'div',
            nextFocusDown: 'sing-btn',
            nextFocusUp: '',
            nextFocusLeft: '',
            nextFocusRight: '',
            backgroundImage:' ',
            focusImage: '/Public/img/hd/Home/V32/close-btn-border.png',
            click:onBack,
            focusChange: '',
            beforeMoveChange: ''
        }])

        LMEPG.BM.requestFocus('sing-btn')
    },

    singIn: function () {
        Network.signIn(0, '', 0, function (data) {
            Page.renderCheckPop(data)
        })
    },

    meSignIn: function (btn) {
        if (btn.signInfo.isTodaySign === 1) {
            LMEPG.UI.showToast('今天已签到，请明天再来')
            return
        }
        var signDay = btn.signInfo.day % 7
        var diamondNum = G('diamond-num-' + (signDay + 1)).innerHTML

        Network.signIn(1, parseInt(btn.signInfo.day) + 1, diamondNum, function (data) {
            if (data.result === 0) {
                G('has-sign-mask-' + (signDay + 1)).style.display = 'block'
                G('sing-btn').src = g_appRootPath + '/Public/img/hd/Home/V32/today-has-sign.png'
                var diamond = parseInt(G('diamond').innerHTML)
                G('diamond').innerHTML = parseInt(diamondNum) + diamond
                btn.signInfo.isTodaySign = 1
            }
        })
    },

    renderSignItem: function (signData) {
        var html = ''

        function getDayDiamond(day) {
            switch (day) {
                case 1:
                    return 50
                case 2:
                    return 100
                case 3:
                    return 150
                case 4:
                    return 200
                default:
                    return 300
            }
        }

        var dayCircle = Math.floor(signData.day / 7)

        for (var i = 1; i <= 7; i++) {
            var whatDay = dayCircle * 7 + i;

            html +=
                '<div class="day-item day-' + i + ' ' + (parseInt(signData.day) + 1 === whatDay ? 'now-day' : '') + '">' +
                '<div class="sign-day">第' + whatDay + '天</div>' +
                '<img  src="' + g_appRootPath + '/Public/img/hd/Home/V32/day-' + (i > 4 ? 'more' : i) + '.png"/>' +
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/has-sign.png" class="has-sign-mask" style="display:' + (whatDay <= signData.day ? 'block' : 'none') + '" id="has-sign-mask-' + i + '">' +
                '<div class="diamond-num">+<span id="diamond-num-' + i + '">' + getDayDiamond(i) + '</span></div>' +
                '</div>'
        }

        return html
    },

    renderRankSimple: function () {
        var html = ''
        var len = Page.rankList.length > 3 ? 3 : Page.rankList.length
        for (var i = 0; i < len; i++) {
            html +=
                '<div class="rank-user" style="margin-top:' + (i === 0 ? 130 : 0) + 'px">' +
                '   <img src="' + g_appRootPath + '/Public/img/hd/Home/V32/no-' + (i + 1) + '.png" class="flag">' +
                '   <img src="' + RenderParam.fsUrl + Page.rankList[i].hand_url + '" class="user-avatar">' +
                '</div>'
        }

        G('rank').innerHTML = html
    },

    initFixedBtn: function () {
        var btnArr = [{
            id: 'head-avatar',
            type: 'div',
            nextFocusDown: 'game-0',
            nextFocusUp: '',
            nextFocusLeft: '',
            nextFocusRight: 'recharge-btn',
            backgroundImage: " ",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/me-avatar-f.png",
            click: Page.renderChangeInfo,
            beforeMoveChange: ''
        }, {
            id: 'recharge-btn',
            type: 'div',
            nextFocusDown: 'game-2',
            nextFocusUp: '',
            nextFocusLeft: 'head-avatar',
            nextFocusRight: '',
            backgroundImage: " ",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/recharge-border.png",
            click: InterFaceEvent.recharge,
            beforeMoveChange: ''
        }, {
            id: 'func-bottom-1',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'game-5',
            nextFocusLeft: isHideOrderFocus?'func-bottom-4':'func-bottom-5',
            nextFocusRight: 'func-bottom-2',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/check.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/check-f.png",
            click: Page.singIn,
            focusChange: '',
            beforeMoveChange: ''
        }, {
            id: 'func-bottom-2',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'game-5',
            nextFocusLeft: 'func-bottom-1',
            nextFocusRight: 'func-bottom-3',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/city-rank.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/city-rank-f.png",
            click: Page.cityRank,
            focusChange: '',
            beforeMoveChange: ''
        }, {
            id: 'func-bottom-3',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'game-5',
            nextFocusLeft: 'func-bottom-2',
            nextFocusRight: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/grade-rank.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/grade-rank-f.png",
            click: Page.renderGradeRank,
            focusChange: '',
            beforeMoveChange: ''
        }, {
            id: 'func-bottom-4',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'game-5',
            nextFocusLeft: '',
            nextFocusRight: isHideOrderFocus?'func-bottom-1':'func-bottom-5',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/fast-began.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/fast-began-f.png",
            click: InterFaceEvent.fastBegan,
            focusChange: '',
            beforeMoveChange: '',
            flag: 3
        }, {
            id: 'func-bottom-5',
            type: 'img',
            nextFocusDown: '',
            nextFocusUp: 'game-5',
            nextFocusLeft: 'func-bottom-4',
            nextFocusRight: 'func-bottom-1',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/" + (RenderParam.isVip === 0 ? 'pay' : 'has-pay') + ".png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/" + (RenderParam.isVip === 0 ? 'pay-f' : 'has-pay-f') + ".png",
            click: InterFaceEvent.pay,
            focusChange: '',
            beforeMoveChange: '',
            flag: 4
        }]

        LMEPG.BM.addButtons(btnArr)
    },

    cityRank: function () {
        G('content').style.display = 'none'
        var div = document.createElement('div')
        div.className = 'rank-open'
        div.id = 'rank-open'
        var len = Page.rankList.length
        var meNo = '暂无'

        for (var i = 0; i < len; i++) {
            if (Page.rankList[i].user_account === Page.meInfo.experData.handData.user_account) {
                meNo = i + 1
                break
            }
        }

        var h = Page.renderRankListMain(Page.rankList)

        div.innerHTML =
            '<div class="rank-open-content">' +
            '<div class="head-open-area">' +
            '<div class="area-btn" style="background: url(/Public/img/hd/Home/V32/province-btn.png)" id="rank-province">青海省</div>' +
            '<div class="area-btn" style="background: url(/Public/img/hd/Home/V32/city-btn.png);" id="rank-city">' + Page.area + '</div>' +
            '</div>' +
            '<div class="rank-list-main" id="rank-list-main">' +
            h +
            '</div>' +
            '<div class="me-rank">' +
            '<div class="me-rank-no" id="me-rank-no">' + meNo + '</div>' +
            '<div class="me-rank-info">' +
            '<img src="' + RenderParam.fsUrl + Page.meInfo.experData.handData.hand_url + '" class="rank-main-avatar">' +
            '<div class="rank-main-info">' +
            '<div class="rank-main-nickname">' + Page.meInfo.experData.handData.nick_name + '</div>' +
            '<div  style="font-size: 24px">Lv.' + Page.meInfo.experData.exper_val.grade_val + ' ' + Page.meInfo.experData.exper_val.exper_val + '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'

        LMEPG.BM.addButtons([{
            id: 'rank-province',
            type: 'div',
            nextFocusDown: '',
            nextFocusUp: '',
            nextFocusLeft: '',
            nextFocusRight: 'rank-city',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/province-btn.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/province-btn-f.png",
            click: '',
            focusChange: '',
            moveChange: Page.changeRank,
            typeNo: 0
        }, {
            id: 'rank-city',
            type: 'div',
            nextFocusDown: '',
            nextFocusUp: '',
            nextFocusLeft: 'rank-province',
            nextFocusRight: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/city-btn.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/city-btn-f.png",
            click: '',
            focusChange: '',
            moveChange: Page.changeRank,
            typeNo: 1
        }])

        document.body.appendChild(div)
        LMEPG.BM.requestFocus('rank-province')
    },

    changeRank: function (pre, cur) {
        Network.getRankList(cur.typeNo, function (data) {
            var h = Page.renderRankListMain(data.data.data)
            var len = data.data.data.length
            var meNo = '暂无'

            for (var i = 0; i < len; i++) {
                if (data.data.data[i].user_account === Page.meInfo.experData.handData.user_account) {
                    meNo = i + 1
                    break
                }
            }

            G('rank-list-main').innerHTML = h
            G('me-rank-no').innerHTML = meNo
        })
    },

    renderRankListMain: function (list) {
        var html = ''
        var curList = list.slice(0, 4)

        for (var i = 0; i < curList.length; i++) {
            html +=
                '<div class="rank-main-item">' +
                '<div class="rank-main-no">' + (i + 1) + '</div>' +
                '<div class="rank-main-avatar-area">' +
                '<img src="' + RenderParam.fsUrl + curList[i].hand_url + '" class="rank-main-avatar"/>' +
                '</div>' +
                '<div class="rank-main-info">' +
                '<div class="rank-main-nickname">' + curList[i].nick_name + '</div>' +
                '<div  style="font-size: 24px">Lv.' + curList[i].grade_val + ' ' + curList[i].exper_val + '</div>' +
                '</div>' +
                ' <div class="rank-main-line"></div>' +
                '</div>'
        }

        return html
    },

    renderGradeRank: function () {
        var div = document.createElement('div')
        div.className = 'grade-rank'
        div.id = 'grade-rank'

        div.innerHTML =
            '<div class="grade-content">' +
            '<div id="pao" class="pai-pic"><img src="/Public/img/hd/Home/V32/paodekuai.png"/></div>' +
            '<div id="hong" class="pai-pic"><img src="/Public/img/hd/Home/V32/hong-majiang.png"/></div>' +
            '<div id="qing" class="pai-pic"><img src="/Public/img/hd/Home/V32/qing-majiang.png"/></div>' +
            '<div id="zhuang" class="pai-pic"><img src="/Public/img/hd/Home/V32/zhuang-majiang.png" /></div>' +
            '</div>' +
            '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/match.png" class="match-btn" id="match-btn">' +
            '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/free-btn.png" class="free-btn" id="free-btn">'

        LMEPG.BM.addButtons([{
            id: 'pao',
            type: 'div',
            nextFocusDown: 'match-btn',
            nextFocusLeft: '',
            nextFocusRight: 'hong',
            backgroundImage: " ",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/choose-border-2.png",
            click: '',
            focusChange: '',
            beforeMoveChange: Page.rankGradeChoose,
            gameId: '471'
        }, {
            id: 'hong',
            type: 'div',
            nextFocusDown: 'match-btn',
            nextFocusLeft: 'pao',
            nextFocusRight: 'qing',
            backgroundImage: " ",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/choose-border-2.png",
            click: '',
            focusChange: '',
            beforeMoveChange: Page.rankGradeChoose,
            gameId: '470'
        }, {
            id: 'qing',
            type: 'div',
            nextFocusDown: 'match-btn',
            nextFocusLeft: 'hong',
            nextFocusRight: 'zhuang',
            backgroundImage: " ",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/choose-border-2.png",
            click: '',
            focusChange: '',
            beforeMoveChange: Page.rankGradeChoose,
            gameId: '472'
        }, {
            id: 'zhuang',
            type: 'div',
            nextFocusDown: 'match-btn',
            nextFocusLeft: 'qing',
            nextFocusRight: '',
            backgroundImage: " ",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/choose-border-2.png",
            click: '',
            focusChange: '',
            beforeMoveChange: Page.rankGradeChoose,
            gameId: '473'
        }, {
            id: 'match-btn',
            type: 'img',
            nextFocusUp: '',
            nextFocusLeft: '',
            nextFocusRight: 'free-btn',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/match.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/match-f.png",
            click: InterFaceEvent.gradeRankClick,
            focusChange: '',
            beforeMoveChange: Page.upBtnDir,
            flag: 1
        }, {
            id: 'free-btn',
            type: 'img',
            nextFocusUp: '',
            nextFocusLeft: 'match-btn',
            nextFocusRight: '',
            backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/free-btn.png",
            focusImage: g_appRootPath + "/Public/img/hd/Home/V32/free-btn-f.png",
            click: InterFaceEvent.gradeRankClick,
            focusChange: '',
            beforeMoveChange: Page.upBtnDir,
            flag: 2
        }])

        document.body.appendChild(div)
        LMEPG.BM.requestFocus('pao')
    },

    rankGameInfo: [],
    rankGradeChoose: function (dir, btn) {
        if (dir === 'down') {
            console.log(445)
            Page.rankGameInfo[0] = btn.gameId
            Page.rankGameInfo[1] = btn.id
            setTimeout(function () {
                G(btn.id).style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/Home/V32/choose-border-2.png)'
            }, 50)

        }
    },

    upBtnDir: function (dir) {
        if (dir === 'up') {
            LMEPG.BM.requestFocus(Page.rankGameInfo[1])
        }
    },

    renderChangeInfo: function () {
        var div = document.createElement('div')
        div.className = 'info-setting'
        div.id = 'info-setting'

        Network.getGameHandQRCode(function (data) {
            var html = '<img src="' + data.imgUrl + '" class="info-qr"/>'

            if (Page.isVerify === 0) {
                Page.checkTimer = setInterval(function () {
                    Network.checkQRStatus(data.qrid, function (res) {
                        if (res.data.state === '1') {
                            G('qr-area').innerHTML =
                                '<img src="/Public/img/hd/Home/V32/qr-scan-success.png" class="scan-qr"/>' +
                                '<div class="scan-success-text">扫码成功</div>' +
                                '<div class="scan-success-text-1">请在5分钟内完成填写</div>'
                        } else if (res.data.state === '2') {
                            Page.isVerify = 1
                            G('check-mask').style.display = 'block'
                            G('index-check-mask').style.display = 'block'
                            G('qr-area').innerHTML =
                                '<img src="/Public/img/hd/Home/V32/qr-scan-success.png" class="scan-qr"/>' +
                                '<div class="scan-success-text">请等待……</div>' +
                                '<div class="scan-success-text-1">审核通过后立即生效</div>'
                        }
                    })
                }, 3000)
            } else {
                html =
                    '<img src="/Public/img/hd/Home/V32/qr-scan-success.png" class="scan-qr"/>' +
                    '<div class="scan-success-text">请等待……</div>' +
                    '<div class="scan-success-text-1">审核通过后立即生效</div>'
            }

            div.innerHTML =
                '<img src="' + RenderParam.fsUrl + Page.meInfo.experData.handData.hand_url + '" class="change-info-avatar"/>' +
                '<div class="check-mask" style="display: '+(Page.isVerify === 0?'none':'block')+'" id="check-mask">头像审核中</div>'+
                '<div class="change-info-account">ITV:<div class="account-content">' + RenderParam.accountId + '</div></div>' +
                '<div class="change-info-nickname">昵称:<div class="account-nickname">' + Page.meInfo.experData.handData.nick_name + '</div></div>' +
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/a-line.png" class="a-line"/>' +
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/' + (Page.isVerify === 0 ? 'change-avatar' : 'avatar-checking-icon') + '.png" class="change-avatar-btn" id="change-avatar-btn"/>' +
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/uninstall.png" class="change-free-btn" id="change-free-btn"/>' +
                '<div class="qr-tip">' + (Page.isVerify === 0 ? '扫码修改信息' : '信息审核中') + '</div>' +
                '<div id="qr-area">' +
                html +
                '</div>' +
                '<div class="bottom-tip">更改信息后重启游戏即可生效</div>'


            LMEPG.BM.addButtons([{
                id: 'change-free-btn',
                type: 'img',
                nextFocusLeft: Page.isVerify === 0?'change-avatar-btn':"",
                nextFocusRight: '',
                backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/uninstall.png",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V32/uninstall-f.png",
                click: Page.deleteGame,
                focusChange: '',
                beforeMoveChange: ''
            }])

            if (Page.isVerify === 0) {
                LMEPG.BM.addButtons([{
                    id: 'change-avatar-btn',
                    type: 'img',
                    nextFocusLeft: '',
                    nextFocusRight: 'change-free-btn',
                    backgroundImage: g_appRootPath + "/Public/img/hd/Home/V32/change-avatar.png",
                    focusImage: g_appRootPath + "/Public/img/hd/Home/V32/change-avatar-f.png",
                    click: Page.renderExchangeAvatar,
                    focusChange: '',
                    beforeMoveChange: ''
                }])
            }

            document.body.appendChild(div)
            LMEPG.BM.requestFocus(Page.isVerify === 0 ? 'change-avatar-btn' : 'change-free-btn')
        })


    },

    avatarPopMaxPage: 0,
    avatarPopCurPage: 1,
    avatarList: [],
    renderExchangeAvatar: function () {

        Network.getGameHandData(function (data) {
            delNode('info-setting')
            Page.avatarList = data.data
            Page.maxPage = Math.ceil(data.data.length / 8)

            var div = document.createElement('div')
            div.className = 'exchange-avatar'
            div.id = 'exchange-avatar'

            var cur = Page.avatarList.slice(0, 8)

            var h = Page.renderAvatarItem(cur)

            div.innerHTML =
                '<div class="exchange-avatar-list" id="exchange-avatar-list">' +
                h +
                '</div>'

            document.body.appendChild(div)
            LMEPG.BM.requestFocus('exchange-avatar-item-0')
        })

    },

    turnAvatarPage: function () {

    },

    renderAvatarItem: function (list) {
        var html = ''
        var btnArr = []

        list.forEach(function (item, index) {
            html +=
                '<div class="exchange-avatar-item" id="exchange-avatar-item-' + index + '">' +
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/avatar-lock.png" class="avatar-lock" style="display:' + (item.strategy === '0' ? 'none' : 'block') + '">' +
                '<img src="' + RenderParam.fsUrl + item.head_url + '" class="exchange-avatar-pic"/>' +
                '</div>'

            btnArr.push({
                id: 'exchange-avatar-item-' + index,
                type: 'div',
                nextFocusLeft: 'exchange-avatar-item-' + (index - 1),
                nextFocusRight: 'exchange-avatar-item-' + (index + 1),
                nextFocusUp: 'exchange-avatar-item-' + (index - 4),
                nextFocusDown: 'exchange-avatar-item-' + (index + 4),
                backgroundImage: " ",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V32/avatar-choose.png",
                click: Page.toSureExchangeAvatar,
                focusChange: '',
                beforeMoveChange: Page.avatarTurnPage,
                data: item
            })

        })

        LMEPG.BM.addButtons(btnArr)
        return html
    },

    toSureExchangeAvatar: function (btn) {
        if (btn.data.diamond === '0') {
            Network.gameDiamondConVertHand(btn.data.head_id, function (data) {
                Page.meInfo.experData.handData.hand_url = data.data.hand_url
                G('avatar').src = RenderParam.fsUrl + data.data.hand_url

                Util.toast('兑换头像成功', function () {
                    onBack();
                })
            })
            return
        }

        delNode('exchange-avatar')
        var div = document.createElement('div')
        div.className = 'pay-to-exchange'
        div.id = 'pay-to-exchange'

        div.innerHTML =
            '<img src="' + RenderParam.fsUrl + btn.data.head_url + '" class="pay-to-exchange-pic"/>' +
            '<div class="pay-pay-info">解锁此头像需要消耗您' + btn.data.diamond + '星卡</div>' +
            '<img class="pay-btn-sure" src="' + g_appRootPath + '/Public/img/hd/Home/V32/btn-sure.png" id="pay-btn-sure"/>'

        LMEPG.BM.addButtons([
            {
                id: 'pay-btn-sure',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: '',
                nextFocusDown: '',
                backgroundImage: "",
                focusImage: g_appRootPath + "/Public/img/hd/Home/V32/btn-sure.png",
                click: Page.payToExchangeAvatar,
                focusChange: '',
                beforeMoveChange: '',
                data: btn.data
            }
        ])
        document.body.appendChild(div)
        LMEPG.BM.requestFocus('pay-btn-sure')
    },

    avatarTurnPage: function (dir, btn) {
        if (dir === 'right') {

        }
    },

    payToExchangeAvatar: function (btn) {
        Network.gameDiamondConVertHand(btn.data.head_id, function (data) {
            if (data.result === 0) {
                Util.toast('兑换成功')
                Page.meInfo.experData.handData.hand_url = data.data.hand_url
                G('avatar').src = RenderParam.fsUrl + data.data.hand_url
                onBack();
            } else {
                Util.toast('星卡不足，兑换失败', function () {
                    onBack();
                })

            }
        })
    },

    deleteGame: function () {
        Network.getAllGame(function (data) {
            delNode('info-setting')
            var div = document.createElement('div')
            div.className = 'delete-game'
            div.id = 'delete-game'

            var h = Page.renderDeleteGameItem(data.data)

            div.innerHTML =
                '<div class="delete-title">卸载游戏</div>' +
                '<div class="delete-list">' +
                h +
                '</div>' +
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/delete-btn.png" class="delete-btn" id="delete-btn"/>' +
                '</div>'


            LMEPG.BM.addButtons({
                id: 'delete-btn',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                nextFocusUp: 'delete-border-area-0',
                nextFocusDown: '',
                backgroundImage: g_appRootPath + '/Public/img/hd/Home/V32/delete-btn.png',
                focusImage: g_appRootPath + '/Public/img/hd/Home/V32/delete-btn-f.png',
                click: InterFaceEvent.toDeleteGame,
            })

            document.body.appendChild(div)
            LMEPG.BM.requestFocus('delete-border-area-0')
        })
    },

    renderDeleteGameItem: function (gameData) {
        var html = ''
        var btnArr = []
        var gameList = []

        gameList = gameData
        gameData.forEach(function (item, index) {
            var install = LMEPG.ApkPlugin.isAppInstall(item.package_name);
            console.log(install)
            if (install && install !== "undefined") {
                gameList.push(item)
            }
        })


        for (var i = 0; i < gameList.length; i++) {
            html +=
                '<div class="delete-item">' +
                '<img src="' + RenderParam.fsUrl + gameData[i].img_url + '" class="delete-game-pic"/>' +
                '<div class="delete-border-area" id="delete-border-area-' + i + '">' +
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/sure-border.png"/>' +
                '<img src="' + g_appRootPath + '/Public/img/hd/Home/V32/sure-yes.png" id="border-' + i + '" class="choose-game" style="display: none"/>' +
                '</div>' +
                '</div>'

            btnArr.push({
                id: 'delete-border-area-' + i,
                type: 'div',
                nextFocusLeft: 'delete-border-area-' + (i - 1),
                nextFocusRight: 'delete-border-area-' + (i + 1),
                nextFocusUp: 'delete-border-area-' + (i - 3),
                nextFocusDown: i > 2 ? 'delete-btn' : 'delete-border-area-' + (i + 3),
                backgroundImage: "",
                focusImage: '',
                click: Page.chooseUninstallGame,
                focusChange: function (btn, hasFoc) {
                    if (hasFoc) {
                        G(btn.id).style.border = '5px solid #7E0607'
                    } else {
                        G(btn.id).style.border = '5px solid transparent'
                    }
                },
                beforeMoveChange: '',
                index: i,
                data: gameData[i]
            })
        }

        LMEPG.BM.addButtons(btnArr)
        return html
    },

    delGameList: null,
    preChoose: null,
    chooseUninstallGame: function (btn) {
        G('border-' + btn.index).style.display = !btn.flag ? 'block' : 'none'
        Page.delGameList = btn.data
        if (Page.preChoose) {
            G(Page.preChoose).style.display = 'none'
        }
        Page.preChoose = 'border-' + btn.index
    }
}


var Network = {
    getGameInfo: function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI('Notify/getGoldCoinData', {}, function (rsp) {
            console.log(rsp)
            LMEPG.UI.dismissWaitingDialog()
            if (rsp.result === 0) {
                cb && cb(rsp)
            } else {
                LMEPG.UI.showToast('数据请求失败');
            }
        })
    },

    getRankList: function (type, cb) {
        LMEPG.ajax.postAPI("Notify/getExperRankData", {
            type: type
        }, function (data) {
            console.log(data)
            cb && cb(data)
        })
    },

    signIn: function (type, day, diamond, cb) {
        LMEPG.ajax.postAPI("Notify/gameSignIn", {
            type: type,
            day: day,
            diamond: diamond
        }, function (data) {
            console.log(data)
            cb && cb(data)
        })
    },

    getGameDetail: function (gameId, cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI("Notify/getGameCodeDetails", {
            gameId: gameId
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog()
            console.log(data)
            cb && cb(data)
        })
    },

    getGameHandData: function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI("Notify/getGameHandData", {}, function (data) {
            LMEPG.UI.dismissWaitingDialog()
            console.log(data)
            cb && cb(data)
        })
    },

    gameDiamondConVertHand: function (handId, cb) {
        LMEPG.ajax.postAPI("Notify/gameDiamondConVertHand", {
            handId: handId
        }, function (data) {
            console.log(data)
            cb && cb(data)
        })
    },

    getGameHandQRCode: function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI("Notify/getGameHandQRCode", {}, function (data) {
            console.log(data)
            LMEPG.UI.dismissWaitingDialog()
            cb && cb(data)
        })
    },

    deleteGame: function (gameId, cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI("Notify/gameInstallReport", {
            gameId: gameId,
            action: 3
        }, function (data) {
            console.log(data)
            LMEPG.UI.dismissWaitingDialog()
            cb && cb(data)
        })
    },

    getAllGame: function (cb) {
        LMEPG.UI.showWaitingDialog()
        LMEPG.ajax.postAPI("Notify/getAllGameInfo", {}, function (data) {
            console.log(data)
            LMEPG.UI.dismissWaitingDialog()
            cb && cb(data)
        })
    },

    checkQRStatus: function (id, cb) {
        LMEPG.ajax.postAPI("Notify/qrCodeStateRev",
            {
                "qrid": id
            }, function (data) {
                console.log(data)
                cb && cb(data)
            })
    }

}

var gameXiuxianRanking = [{
    packageName: "com.runmo.mronehzmj",
    APPID: "470",
    CLASS_NAME: "org.cocos2dx.javascript.AppActivity",
    EXTAR: {"appId": "470", "hall": true, "lunchFrom": "epg", "asserId": "", "position": "", "open": "phb_xiuxian"}
},
    {
        packageName: "com.runmo.mronepdk",
        APPID: "471",
        CLASS_NAME: "org.cocos2dx.javascript.AppActivity",
        EXTAR: {"appId": "471", "hall": true, "lunchFrom": "epg", "asserId": "", "position": "", "open": "phb_xiuxian"}
    },
    {
        packageName: "com.runmo.mrone",
        APPID: "472",
        CLASS_NAME: "org.cocos2dx.javascript.AppActivity",
        EXTAR: {"appId": "472", "hall": true, "lunchFrom": "epg", "asserId": "", "position": "", "open": "phb_xiuxian"}
    },
    {
        packageName: "com.runmo.mronezzmj",
        APPID: "473",
        CLASS_NAME: "org.cocos2dx.javascript.AppActivity",
        EXTAR: {"appId": "473", "hall": true, "lunchFrom": "epg", "asserId": "", "position": "", "open": "phb_xiuxian"}
    }]

var gameMatchRanking = [{
    packageName: "com.runmo.mronehzmj",
    APPID: "470",
    CLASS_NAME: "org.cocos2dx.javascript.AppActivity",
    EXTAR: {"appId": "470", "hall": true, "lunchFrom": "epg", "asserId": "", "position": "", "open": "phb_match"}
},
    {
        packageName: "com.runmo.mronepdk",
        APPID: "471",
        CLASS_NAME: "org.cocos2dx.javascript.AppActivity",
        EXTAR: {"appId": "471", "hall": true, "lunchFrom": "epg", "asserId": "", "position": "", "open": "phb_match"}
    },
    {
        packageName: "com.runmo.mrone",
        APPID: "472",
        CLASS_NAME: "org.cocos2dx.javascript.AppActivity",
        EXTAR: {"appId": "472", "hall": true, "lunchFrom": "epg", "asserId": "", "position": "", "open": "phb_match"}
    },
    {
        packageName: "com.runmo.mronezzmj",
        APPID: "473",
        CLASS_NAME: "org.cocos2dx.javascript.AppActivity",
        EXTAR: {"appId": "473", "hall": true, "lunchFrom": "epg", "asserId": "", "position": "", "open": "phb_match"}
    }]


var InterFaceEvent = {
    recharge: function () {
        var objCurrent = LMEPG.Intent.createIntent('home');
        var jumpObj = LMEPG.Intent.createIntent('orderHome');
        jumpObj.setParam("userId", RenderParam.userId);
        jumpObj.setParam("type", 2);//订购类型 1 包月订购，2 充值乐卡
        LMEPG.Intent.jump(jumpObj, objCurrent);
    },

    pay: function () {
        if (!RenderParam.isVip) {
            var objCurrent = LMEPG.Intent.createIntent('home');
            var jumpObj = LMEPG.Intent.createIntent('orderHome');
            jumpObj.setParam("userId", RenderParam.userId);
            jumpObj.setParam("type", 1);//订购类型 1 包月订购，2 充值乐卡
            LMEPG.Intent.jump(jumpObj, objCurrent);
        }else {
            Util.toast('您已订购会员，不能重复订购')
        }
    },

    fastBegan: function (btn) {
        Network.getGameDetail('472', function (data) {
            var STBType = LMEPG.STBUtil.getSTBModel(); // 设备型号
            LMEPG.Log.info("STBType fastBegan:"+STBType);
            if((STBType === "B860AV1.1-T2" && false) && (data.version.package_name !== "com.yzkj.wuziqi" && data.version.package_name !== "com.yzkj.zhongguoxiangqi")){
                InterFaceEvent.specialInstallApp(data.version.package_name,data.version.apk_url);
                return;
            }
            if (data.version.is_appstore == '1' && data.version.in_path == '1') {
                InterFaceEvent.jumpGameRank('472', btn.flag);
            } else {
                InterFaceEvent.jumpPluginGame('472', btn.flag);
            }
        });
    },

    gradeRankClick: function (btn) {
        var rankType = btn.flag
        var gameId = Page.rankGameInfo[0]
        console.log(rankType, gameId, 8989)
        Network.getGameDetail(gameId, function (data) {
            var STBType = LMEPG.STBUtil.getSTBModel(); // 设备型号
            LMEPG.Log.info("STBType gradeRankClick:"+STBType);
            if((STBType === "B860AV1.1-T2" && false) && (data.version.package_name !== "com.yzkj.wuziqi" && data.version.package_name !== "com.yzkj.zhongguoxiangqi")){
                InterFaceEvent.specialInstallApp(data.version.package_name,data.version.apk_url);
                return;
            }
            if (data.version.is_appstore == '1' && data.version.in_path == '1') {
                InterFaceEvent.jumpGameRank(gameId, rankType);
            } else {
                InterFaceEvent.jumpPluginGame(gameId, rankType);
            }
            setTimeout(function () {
                onBack();
            }, 3000);
        });
    },

    startGame: function (btn) {
        var gameData = btn.data
        console.log(gameData, 990)

        var STBType = LMEPG.STBUtil.getSTBModel(); // 设备型号
        LMEPG.Log.info("STBType:"+STBType);
        if((STBType === "B860AV1.1-T2" && false) && (gameData.version.package_name !== "com.yzkj.wuziqi" && gameData.version.package_name !== "com.yzkj.zhongguoxiangqi")){
            InterFaceEvent.specialInstallApp(gameData.version.package_name,gameData.version.apk_url);
            return;
        }

        if ((gameData.version.is_appstore == '1' && gameData.version.in_path == '1')
            || gameData.version.package_name == "com.yzkj.wuziqi"
            || gameData.version.package_name == "com.yzkj.zhongguoxiangqi") {
            InterFaceEvent.startAppGame(gameData.version.package_name, gameData.version.game_id);
        } else {
            InterFaceEvent.startPluginGame(gameData.version.package_name, 1, gameData.version.game_id);
        }
        setTimeout(function () {
            onBack();
        }, 3000);
    },

    toDeleteGame: function (btn) {
        if (!Page.delGameList) {
            Util.toast('请选择要卸载的游戏')
            return
        }

        var install = LMEPG.ApkPlugin.isAppInstall(Page.delGameList.package_name);
        if (install && install != "undefined") {
            Network.deleteGame(Page.delGameList.game_id, function (data) {
                InterFaceEvent.startAppGame("com.visionall.LMGameActivity", 0);
            })
        } else {
            Util.toast(Page.delGameList.game_name + '游戏已卸载')
        }
    },

    startAppGame: function (packageName, appId) {
        var install = LMEPG.ApkPlugin.isAppInstall(packageName);
        if (install && install != "undefined") {
            LMEPG.ApkPlugin.startAppByName(packageName);
        } else {
            InterFaceEvent.installAppGame(packageName, appId);
        }
    },

    startPluginGame: function (packageName, action, gameId) {
        LMEPG.ajax.postAPI("Notify/gameInstallReport", {
            gameId: gameId,
            action: action
        }, function (data) {
            var appName = "com.visionall.LMGameActivity";
            var install = LMEPG.ApkPlugin.isAppInstall(appName);
            if (install && install != "undefined") {
                var version = LMEPG.ApkPlugin.getAppVersion(appName);
                LMEPG.Log.error("startAppShop version:" + version);
                if(!LMEPG.Func.isEmpty(version)){
                    Network.getGameDetail('7', function (data) {
                        if(data.result === 0 && version !== data.version.game_version){
                            InterFaceEvent.startAppShop("com.visionall.LMGameActivity", "478");
                            return 0;
                        }
                    });
                }
                LMEPG.ApkPlugin.startAppByName(appName);
            } else {
                InterFaceEvent.startAppShop("com.visionall.LMGameActivity", "478");
            }
        })
    },

    installAppGame: function (packageName, gameId) {
        LMEPG.ajax.postAPI("Notify/gameInstallReport", {
            gameId: gameId,
            action: 1
        }, function (data) {
            console.log(data)
            if (packageName == "com.yzkj.wuziqi") {
                gameId = "476";
            }
            if (packageName == "com.yzkj.zhongguoxiangqi") {
                gameId = "477";
            }
            InterFaceEvent.startAppShop(packageName, gameId);

            /*
            var appName = "com.visionall.LMGameActivity";
            var install = LMEPG.ApkPlugin.isAppInstall(appName);
            if (install && install != "undefined") {
                LMEPG.ApkPlugin.startAppByName(appName);
            }else{
                //var appDownloadUrl = 'http://223.221.36.146:10002/fs/imgs/4630092/game/20220412/qhdx_install.apk';
                //STBAppManager.installApp(appDownloadUrl);
                InterFaceEvent.startAppShop("com.visionall.LMGameActivity","475");
            }
            */
        })
    },

    //特定型号盒子适配问题，直接安装操作
    specialInstallApp:function(packageName,appUrl){
        LMEPG.Log.error("specialInstallApp packageName:" + packageName);
        var install = LMEPG.ApkPlugin.isAppInstall(packageName);
        if (install && install != "undefined") {
            LMEPG.ApkPlugin.startAppByName(packageName);
        }else{
            var apkUrl = "http://223.221.36.146:10002/fs"+appUrl
            LMEPG.Log.error("specialInstallApp appUrl:" + apkUrl);
            STBAppManager.installApp(apkUrl);
        }
    },

    startAppShop: function (packageName, appId) {
        var appName = "com.amt.appstore"; // 商城包名，根据具体版本而定，不一定是 “com.amt.appstore”
        var extraString = "jumpId=8&appPkg=" + packageName + "&appId=" + appId;
        var intentMessage = '{"intentType":1,' +
            '"appName":"' + appName + '",' +
            '"action":"' + "com.amt.appstore.action.LAUNCHER" + '",' +
            '"extra":[{"name":"extraKey","value":"' + extraString + '"}]}';

        LMEPG.Log.error("startAppShop intentMessage:" + intentMessage);
        console.log(intentMessage);
        STBAppManager.startAppByIntent(intentMessage);
    },

    jumpPluginGame: function (gameId, type) {
        var action = 5;
        if (type == 1) {
            action = 6;
        }
        if (type == 2) {
            action = 5;
        }
        if (type == 3) {
            action = 7;
        }
        InterFaceEvent.startPluginGame("", action, gameId);
    },

    jumpGameRank: function (gameId, type) {
        if (type == 1) {
            var data = gameMatchRanking;
        } else {
            var data = gameXiuxianRanking;
        }

        var appName = '';
        var className = '';
        var extraString = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].APPID == gameId) {
                appName = data[i].packageName;
                className = data[i].CLASS_NAME;
                extraString = data[i].EXTAR;
                break;
            }
        }

        if (type == 3) {
            extraString.open = 'match_leisure';
        }

        var extra = [{"name": "jsonData", "value": JSON.stringify(extraString)}];

        var intentMessage = '{"intentType":0,' +
            '"appName":"' + appName + '",' +
            '"className":"' + className + '",' +
            '"extra":' + JSON.stringify(extra) + '}';

        LMEPG.Log.error("jumpGameRank intentMessage:" + intentMessage);
        STBAppManager.startAppByIntent(intentMessage);
    }
}


function onBack() {
    if (G('sign')) {
        delNode('sign')
        LMEPG.BM.requestFocus('func-bottom-1')
    } else if (G('info-setting')) {
        clearInterval(Page.checkTimer)
        delNode('info-setting')
        LMEPG.BM.requestFocus('head-avatar')
    } else if (G('grade-rank')) {
        delNode('grade-rank')
        LMEPG.BM.requestFocus('func-bottom-3')
    } else if (G('rank-open')) {
        G('content').style.display = 'block'
        delNode('rank-open')
        LMEPG.BM.requestFocus('func-bottom-2')
    } else if (G('game-detail')) {
        delNode('game-detail')
        LMEPG.BM.requestFocus(gameFocId)
    } else if (G('exchange-avatar')) {
        delNode('exchange-avatar')
        Page.renderChangeInfo()
    } else if (G('pay-to-exchange')) {
        delNode('pay-to-exchange')
        Page.renderExchangeAvatar()
    } else if (G('delete-game')) {
        delNode('delete-game')
        Page.renderChangeInfo()
    } else {
        //LMEPG.Intent.back()
        var objHome = LMEPG.Intent.createIntent('home');
        var objHold = LMEPG.Intent.createIntent('hold');
        objHold.setParam("userId", RenderParam.userId);
        LMEPG.Intent.jump(objHold, objHome, LMEPG.Intent.INTENT_FLAG_NOT_STACK);
    }
}


var Util = {
    toast: function (text, cb) {
        var div = document.createElement('div')
        div.className = 'game-toast'
        div.id = 'game-toast'

        div.innerHTML = text

        document.body.appendChild(div)

        setTimeout(function () {
            delNode('game-toast')
            cb && cb()
        }, 2000)
    }
}

/**
 * 获取当前页
 */
function getCurPageObj() {
    var objCurrent = LMEPG.Intent.createIntent('home');
    objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
    return objCurrent;
}

function jumpTestPage() {
    var objHome = getCurPageObj();
    var objDst = LMEPG.Intent.createIntent('testEntrySet');
    objDst.setParam('userId', RenderParam.userId);
    LMEPG.Intent.jump(objDst, objHome);
}

function hideOrderFocus() {
    if(isHideOrderFocus){
        G('func-bottom-5').style.display = "none";
        G('func-bottom-4').style.left = "715px";
    }
}