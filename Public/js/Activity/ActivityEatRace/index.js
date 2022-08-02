var AllParam = {
    onFocusSuffix: 'png',
    moveFocusToStart: 'jump-start'
};

LMUtils.o_mix(AllParam, RenderParam);

var Activity = new SuperActivity(AllParam);
var onBack = Activity.jumpBack;

Activity.eventHandler = function (btn, hasFocus) {

    switch (btn.id) {
        // 退出活动
        case 'jump-back':
            Activity.jumpBack();
            break;
        // 模板消失
        case 'btn-rule-close':
        case 'btn-list-cancel':
        case 'btn-uncompleted-sure':
        case 'btn-accomplish-cancel':
            Activity.modal.hide();
            break;
        case 'btn-one':
        case 'btn-one0':
        case 'btn-one1':
            Activity.jumpBack();
            break;
        // 支付确认
        case 'btn-pay-sure':
            Activity.jumpBuyVip();
            break;
        // 校验游戏资格
        case 'btn-eat-0':
        case 'btn-eat-1':
        case 'btn-eat-2':
        case 'btn-eat-3':
            Activity.beClickId = btn.id;
            Activity.checkGameQualification(btn);
            break;
        case 'btn-list-submit':
        case 'btn-accomplish-submit':
            Activity.game.submitTel(btn);
            break;
        // 支付失败
        case 'pay-failed':
            Activity.setPayImageSrc('m_pay_failed');
            break;
        // 支付成功
        case 'pay-success':
            Activity.setPayImageSrc('m_pay_success');
            break;
        // 显示活动规则
        case 'jump-rule':
            Activity.beClickId = btn.id;
            Activity.modal.show('modal-rule', 'btn-rule-close');
            break;
        // 支付取消
        case 'btn-pay-cancel':
            clearTimeout(Activity.cdTimer);
            Activity.isSureAddExtraTimes() && Activity.modal.hide(true);
            break;
        // 显示中奖名单
        case 'jump-winner':
            Activity.beClickId = btn.id;
            Activity.game.renderRankList();
            break;
        // 启动数字小键盘
        case 'rewrite-tel':
        case 'accomplish-tel':
            if (hasFocus) Activity.showKeypad(btn, '150px');
            break;
    }
};

/*校验游戏资格*/
Activity.checkGameQualification = function (btn) {
    var me = this;
    if (me.verify.isPlayAllow()) {
        // 同步进行
        // LMEPG.BM.setKeyEventPause(true);
        LMUtils.dialog.showWaiting();
        me.uploadUserPlayGame(function () {
            me.game.start(btn);
        });
    } else {
        if (me.verify.isVip) {
            LMUtils.dialog.showToast('今天的次数已用完，记得明天再来哦 ~', 2);
        } else {
            me.isPayModal = true;
            me.modal.show('modal-pay-notimes', 'btn-pay-sure');
        }
    }
};

Activity.game = (function () {
    var me = Activity;
    var myFoodData = [0, 0, 0, 0];
    var index;

    //
    var rankList = function (data) {
        /*排名规则：
        *  1.筛选每个用户下的食物
        *  2.筛选相同食物
        *  3.不同食物数量降序排名
        * */
        var allUser = [];
        var listAry = {};
        var foodsName = ['烤火鸡', '南瓜饼', '长寿面', '饺子'];

        // 增加食物数量
        var addFoodsCount = function (num, user) {
            var count = listAry[user][num];
            // 叠加或初始化烤火鸡的数量
            typeof count === 'number' ? listAry[user][num] += 1 : listAry[user][num] = 1;
            me.listAry = listAry;
        };

        // 初始化存储类型
        var initStoreType = function (user) {
            // 第一次叠加判断是否初始化为数组存储
            if (!(listAry[user] instanceof Array)) {
                listAry[user] = [];
            }
        };

        // 获得分类型食物
        var getFoodsType = function (foodName, user) {
            initStoreType(user);
            switch (foodName) {
                case '烤火鸡':
                    addFoodsCount(0, user);
                    break;
                case '南瓜饼':
                    addFoodsCount(1, user);
                    break;
                case '长寿面':
                    addFoodsCount(2, user);
                    break;
                case '饺子':
                    addFoodsCount(3, user);
                    break;
            }
        };

        var renderList = function () {
            var data = listAry;
            var allUserMaxAry = [];
            var maxCount;
            var maxIndex;

            function getAllUserMax() {
                for (var user in data) {
                    // 取每个用户的最大数量的食物
                    var item = data[user];
                    var itemSub;

                    // 去除稀疏项
                    itemSub = item.filter(function (t) {
                        return true;
                    });

                    maxCount = Math.max.apply(null, itemSub);// 取最大项
                    maxIndex = item.indexOf(maxCount); // 取最大项索引
                    allUserMaxAry.push({userAccount: user, maxCount: maxCount, maxName: foodsName[maxIndex]});
                }
            }

            function sortAllUser() {
                allUserMaxAry.sort(function (a, b) {
                    return b.maxCount - a.maxCount;
                });
            }

            function renderAllUser() {
                var htm = '<marquee  id="all-marquee" scrollamount="5"  direction="up"><table id="all-table" class="marquee-table">';
                var account;
                var currentFood;

                for (var i = 0; i < allUserMaxAry.length; i++) {
                    currentFood = allUserMaxAry[i];
                    account = currentFood['userAccount'];
                    htm += '<tr>'
                        // 排名
                        + '<td class="winner-max-rank">' + (i + 1)
                        // 账户
                        + '<td class="winner-max-user">' + (account.slice(0, 3) + '****' + account.slice(-3))
                        // 食物名称
                        + '<td class="winner-max-name">' + currentFood['maxName']
                        // 食物数量
                        + '<td class="winner-max-count">' + currentFood['maxCount'];
                }

                htm += '</table></marquee>';
                G('total-list').innerHTML = htm;
            }


            // 获取我的所有食物的排名
            function renderMyRank() {
                var data = listAry;
                var kaohuoji = [];
                var nanguabing = [];
                var changshoumian = [];
                var jiaozi = [];
                var myData = {kaohuoji: {name: '烤火鸡'}, nanguabing: {name: '南瓜饼'}, changshoumian: {name: '长寿面'}, jiaozi: {name: '饺子'}};

                // 排序工具
                var sortClassfiedFood = function (ary) {
                    ary.sort(function (a, b) {
                        var aCount = a.count || 0;
                        var bCount = b.count || 0;
                        return bCount - aCount;
                    });
                };

                var resolveFoods = function () {
                    for (var o in data) {
                        var item = data[o];
                        for (var j = 0; j < item.length; j++) {

                            switch (j) {
                                case 0:
                                    kaohuoji.push({user: o, count: item[j]});
                                    break;
                                case 1:
                                    nanguabing.push({user: o, count: item[j]});
                                    break;
                                case 2:
                                    changshoumian.push({user: o, count: item[j]});
                                    break;
                                case 3:
                                    jiaozi.push({user: o, count: item[j]});
                                    break;
                            }
                        }
                    }
                };

                var getMyClassifiedFood = function (foodName, arg) {
                    sortClassfiedFood(arg); // 先按降序排列
                    arg.forEach(function (t, i) {
                        if (t.user === me.loginUserAccount) {
                            switch (foodName) {
                                case 'kaohuoji':
                                    t.name = '烤火鸡';
                                    break;
                                case 'nanguabing':
                                    t.name = '南瓜饼';
                                    break;
                                case 'changshoumian':
                                    t.name = '长寿面';
                                    break;
                                case 'jiaozi':
                                    t.name = '饺子';
                                    break;
                            }
                            t.rankIndex = t.count ? (i + 1) : '无'; // 起始当为1
                            // 存储渲染值
                            myData[foodName] = t;
                        }
                    });
                };

                // 渲染我的榜单列表
                function renderHtml() {
                    var data = myData;
                    var htm = '<marquee id="my-marquee" scrollamount="5"  direction="up"><table id="my-table" class="marquee-table">';
                    var account;
                    var currentFood;

                    for (var i in data) {
                        currentFood = data[i];
                        account = currentFood.user || me.loginUserAccount;
                        htm += '<tr>'
                            // 排名
                            + '<td class="winner-max-rank">' + (data[i].rankIndex || '无')
                            // 账户
                            + '<td class="winner-max-user">' + (account.slice(0, 3) + '****' + account.slice(-3))
                            // 食物名称
                            + '<td class="winner-max-name">' + currentFood.name
                            // 食物数量
                            + '<td class="winner-max-count">' + (currentFood.count || 0);
                    }

                    G('my-list').innerHTML = htm;
                }

                resolveFoods();
                getMyClassifiedFood('kaohuoji', kaohuoji);
                getMyClassifiedFood('nanguabing', nanguabing);
                getMyClassifiedFood('changshoumian', changshoumian);
                getMyClassifiedFood('jiaozi', jiaozi);
                renderHtml();
                console.log('khj==>', kaohuoji, '\nngb==>', nanguabing, '\ncsm==>', changshoumian, '\njz==>', jiaozi, '\nmyData==>', myData, 333);
            }

            function renderTelphone(tel) {
                G('rewrite-tel').innerHTML = tel || '请输入有效的电话';
            }

            getAllUserMax();
            sortAllUser();
            renderAllUser();
            renderMyRank();
            renderTelphone(me.userTel);
            me.modal.show('modal-list', 'btn-list-submit', LMUtils.dialog.hide);
        };

        // 总成列表
        data.forEach(function (t) {
            var user = t.user_account;

            // 若没有存储
            if (allUser.indexOf(user) === -1) {
                // 存储参与用户
                allUser.push(user);
            }
            getFoodsType(t.goods_name, user);
        });

        renderList();
        console.log('data==>', data, '\nallUser==>', allUser, '\nlistAry==>', listAry, 1111);
    };

    // 更新用户收集的数量
    var updateFoodsCount = function (btn) {
        index = btn.id.slice(-1);
        var foodCountEl = G('food-count-' + index);
        var count = parseInt(foodCountEl.innerText);
        foodCountEl.innerText = count + 1;
    };

    // 过滤我的食物数据
    var filterMyFoods = function () {
        var data = me.exchangeRecords.data.all_list;
        return data.filter(function (t) {
            return t.user_id === me.userId;
        });
    };

    // 增加食物分类数量
    var getMyFoodsCount = function () {
        var data = filterMyFoods();
        var i = data.length;

        while (i--) {
            switch (data[i].goods_name) {
                case '烤火鸡':
                    myFoodData[0] += 1;
                    break;
                case '南瓜饼':
                    myFoodData[1] += 1;
                    break;
                case '长寿面':
                    myFoodData[2] += 1;
                    break;
                case '饺子':
                    myFoodData[3] += 1;
                    break;
            }
        }
    };

    // 校验榜单前五名
    var cutRankFiveList = function () {
        var i = 0;
        var bol = false;

        for (var o in me.listAry) {
            if (i < 5) {
                if (o === me.loginUserAccount) {
                    bol = true;
                }
            }
            i++;
        }

        return bol;
    };

    return {
        start: function (btn) {
            me.ajax.requestExchangeAction(btn, function (ret) {
                console.log(ret);
                if (ret.result === 0) {
                    LMUtils.dialog.hide();
                    updateFoodsCount(btn);
                    G('times-count').innerText = Math.max(0, --me.leftTimes);
                    LMEPG.BM.setKeyEventPause(false);
                } else {
                    LMUtils.dialog.showToast('请稍等', 2);
                    // LMEPG.BM.setKeyEventPause(false);
                }
            });
        },

        renderFoodsCount: function () {
            getMyFoodsCount();
            G('food-count-0').innerText = myFoodData[0];
            G('food-count-1').innerText = myFoodData[1];
            G('food-count-2').innerText = myFoodData[2];
            G('food-count-3').innerText = myFoodData[3];
        },

        renderRankList: function () {
            me.ajax.getExchangePrizeListRecord(function (data) {
                rankList(data.data.all_list);
            });
        },

        // 前五名提交电话号码
        submitTel: function () {
            var userTel = G('rewrite-tel').innerText;

            //判断手机号是否正确
            if (!LMUtils.verify.isValidTel(userTel)) {
                LMUtils.dialog.showToast('请输入有效的电话 ~', 1);
                return me;
            }

            // 前五名是否存在当前登录的用户
            if (!cutRankFiveList()) {
                LMUtils.dialog.showToast('你还未进入前五名，不能提交电话哦~', 2);
                return;
            }

            // ajax提交电话号码
            me.ajax.submitUserTel(userTel, true, function () {
                me.userTel = userTel;
                LMUtils.dialog.showToast('提交电话成功！', 2, function () {
                    me.reloadPage();
                });
            });
        }
    };
}());

Activity.init = function () {
    this.initButtons();
    this.addButtons();
    this.checkPayState('', 'jpg');
    this.game.renderFoodsCount();
    this.render['times-count']();
    LMEPG.BM.init(this.beClickId, this.buttons, true);
    LMEPG.BM.getButtonById('jump-winner').nextFocusLeft = 'btn-eat-3';
    LMEPG.BM.getButtonById('jump-winner').nextFocusDown = 'btn-eat-3';
};

Activity.onFocusChange = function (btn, hasFocus) {
    var me = Activity;
    var index = btn.id.slice(-1);
    var foodImgEl = G('food-' + index);
    var imgPrefix = me.activityImg + 'food' + index;

    if (hasFocus) {
        foodImgEl.src = imgPrefix + '_f.gif';
    } else {
        foodImgEl.src = imgPrefix + '.png';
    }
};

Activity.addButtons = function () {
    this.buttons.push({
        id: 'btn-rule-close',
        name: '按钮-返回主界面',
        type: 'div',
        backgroundImage: this.activityImg + 'btn_close.png',
        focusImage: this.activityImg + 'btn_close_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-list-submit',
        name: '按钮-提交电话号码',
        type: 'img',
        nextFocusUp: '',
        nextFocusLeft: 'rewrite-tel',
        nextFocusRight: 'btn-list-cancel',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        isAction: 'isListSubmit',
        click: this.eventHandler
    }, {
        id: 'btn-list-cancel',
        name: '按钮-取消提交电话/关闭中奖名单',
        type: 'img',
        nextFocusLeft: 'btn-list-submit',
        backgroundImage: this.activityImg + 'btn_cancel.png',
        focusImage: this.activityImg + 'btn_cancel_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-uncompleted-sure',
        name: '按钮-没有完成游戏“确认”',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-accomplish-submit',
        name: '按钮-完成游戏提交',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusRight: 'btn-accomplish-cancel',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        isAction: '',
        click: this.eventHandler
    }, {
        id: 'btn-accomplish-cancel',
        name: '按钮-完成游戏取消',
        type: 'img',
        nextFocusUp: 'accomplish-tel',
        nextFocusLeft: 'btn-accomplish-submit',
        backgroundImage: this.activityImg + 'btn_cancel.png',
        focusImage: this.activityImg + 'btn_cancel_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-one',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-one0',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-one1',
        name: '',
        type: 'img',
        backgroundImage: this.activityImg + 'btn_sure.png',
        focusImage: this.activityImg + 'btn_sure_f.' + this.onFocusSuffix,
        click: this.eventHandler
    }, {
        id: 'btn-eat-0',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-eat-3',
        nextFocusRight: 'btn-eat-1',
        backgroundImage: this.activityImg + 'eat_it.png',
        focusImage: this.activityImg + 'eat_it_f.png',
        focusChange: this.onFocusChange,
        goods_id: this.setExchangeList.data[0].goods_id,
        click: this.eventHandler
    }, {
        id: 'btn-eat-1',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-eat-0',
        nextFocusRight: 'btn-eat-2',
        backgroundImage: this.activityImg + 'eat_it.png',
        focusImage: this.activityImg + 'eat_it_f.png',
        focusChange: this.onFocusChange,
        goods_id: this.setExchangeList.data[1].goods_id,
        click: this.eventHandler
    }, {
        id: 'btn-eat-2',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: 'btn-eat-1',
        nextFocusRight: 'btn-eat-3',
        backgroundImage: this.activityImg + 'eat_it.png',
        focusImage: this.activityImg + 'eat_it_f.png',
        focusChange: this.onFocusChange,
        goods_id: this.setExchangeList.data[2].goods_id,
        click: this.eventHandler
    }, {
        id: 'btn-eat-3',
        name: '',
        type: 'img',
        nextFocusUp: 'jump-winner',
        nextFocusDown: '',
        nextFocusLeft: 'btn-eat-2',
        nextFocusRight: 'jump-winner',
        backgroundImage: this.activityImg + 'eat_it.png',
        focusImage: this.activityImg + 'eat_it_f.png',
        focusChange: this.onFocusChange,
        goods_id: this.setExchangeList.data[3].goods_id,
        click: this.eventHandler
    }, {
        id: '',
        name: '',
        type: 'img',
        nextFocusUp: '',
        nextFocusDown: '',
        nextFocusLeft: '',
        nextFocusRight: '',
        backgroundImage: this.activityImg + '',
        focusImage: this.activityImg + '',
        click: this.eventHandler
    });
};
