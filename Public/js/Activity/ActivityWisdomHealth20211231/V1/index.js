(function (w, e, r, a) {
        var Activity = {
            playStatus: false,
            fun : false,

            init: function () {
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();
                a.showOrderResult();

                RenderParam.lmcid == "410092" && Activity.onBack410092();

                var nowTime= new Date().getTime();
                var startDate =RenderParam.endDt;
                startDate= startDate.replace(new RegExp("-","gm"),"/");
                var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
                if(nowTime>=endDateM){ /*活动结束*/
                    LMActivity.showModal({
                        id: 'bg_game_over',
                        onDismissListener: function () {
                            LMEPG.Intent.back();
                        }
                    });
                }
            },

            onBack410092: function () {
                try {
                    HybirdCallBackInterface.setCallFunction(function (param) {
                        LMEPG.Log.info('HybirdCallBackInterface param : ' + JSON.stringify(param));
                        if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                            w.onBack();
                        }
                    });
                } catch (e) {
                    LMEPG.UI.logPanel.show("e");
                }
            },


            initRegional: function () {
                // 活动规则图片片路径
                var regionalImagePath = r.imagePath;
                $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_gift_1.png',
                    "2": regionalImagePath + '/icon_gift_2.png',
                    "3": regionalImagePath + '/icon_gift_3.png',
                    "4": regionalImagePath + '/icon_gift_4.png',
                    "5": regionalImagePath + '/icon_gift_5.png',
                    "6": regionalImagePath + '/icon_gift_6.png',
                    "7": regionalImagePath + '/icon_gift_7.png',
                    "8": regionalImagePath + '/icon_gift_8.png',
                    "9": regionalImagePath + '/icon_gift_9.png',
                };
            },
            isEmpt: function (id) {
                var temId = parseInt(id.substring(6, 7));
                if (unLightId.indexOf(temId) >= 0) {
                    return true;
                } else {
                    return false;
                }
            },

            initGameData: function () {
                LMActivity.playStatus = false;
            },

            eventHandler: function (btn) {
                switch (btn.id) {
                    case 'btn_back':  //返回按钮
                        LMActivity.innerBack();
                        break;
                    case 'btn_order_submit': //订购按钮
                    case 'btn_winner_list':
                        if (RenderParam.isVip == 1) {
                            LMEPG.UI.showToast("你已经订购过，不用再订购！");
                        } else {
                            LMActivity.Router.jumpBuyVip();
                        }
                        break;
                    case 'btn_order_cancel':
                    case 'btn_close':
                    case 'game_over_sure':
                        //LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        LMActivity.playStatus = false;
                        Activity.game.stopAllTimer();
                        // LMActivity.Router.reload();
                        break;
                    case 'btn_activity_rule':
                        LMActivity.triggerModalButton = 'btn_activity_rule';
                        LMActivity.showModal({
                            id: 'activity_rule',
                        });
                        break;
                    case 'btn_start':
                        if (a.hasLeftTime()){
                            a.AjaxHandler.uploadPlayRecord(function (){
                                G("activityTimes").innerHTML = (--r.leftTimes).toString();
                                LMActivity.triggerModalButton = btn.id;
                                LMActivity.doLottery()
                            });

                        }else {
                            LMActivity.triggerModalButton = btn.id;
                            a.showGameStatus('btn_game_over_sure');
                        }
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'do-cancel':
                        LMActivity.Router.reload();
                        break;
                    case 'btn_common_diseases':
                        LMActivity.triggerModalButton = btn.id;
                        LMActivity.showModal({
                            id: 'common_diseases',
                            focusId: 'btn_disease1',
                        });
                        break;
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('btn_start', Activity.buttons, true);
            },
            /**设置当前页参数*/
            getCurrentPage: function () {
                return e.Intent.createIntent('activity');
            },
            onInputFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(RenderParam.platformType==='hd'?30:215, RenderParam.platformType==='hd'?420:190, btn.id, btn.backFocusId, true);
                }

            },
            changeDisease: function (pre, cur, dir) {
                if (dir === 'up' || dir === 'down') {
                    switch (cur.id) {
                        case 'btn_disease1':
                            G('disease_content').innerHTML = '急性支气管炎:低热、畏寒、周身乏力、咽喉部发痒 <br><br>' +
                                '慢性支气管炎:长期、反复咳嗽、咳痰不易咯出、产生气喘、呼吸道感染<br><br>' +
                                '食疗:百合粥、芥菜粥、杏仁粥、梨粥、山药汤、川贝梨、三仙饮、川贝百合汤';
                            break
                        case 'btn_disease2':
                            G('disease_content').innerHTML = '原因：冬季衣物过于单薄、室外吹风时间长，刺激面部的血管神经痉挛 <br><br>' +
                                '症状：口不能闭、口眼歪斜、流口水 <br><br>' +
                                '预防：减肥、调整饮食结构、运动、戒烟酒、定期检查血压、血脂、血糖';
                            break
                        case 'btn_disease3':
                            G('disease_content').innerHTML = '原因：干燥多风，导致阴阳平衡失调、与体内气机变化有关 <br><br>' +
                                '人群：女性、性格内向敏感、遭遇心理应激事件、室内工作者 <br><br>' +
                                '预防：常晒太阳、适度运动、饮食调养、修身养性';
                            break
                        case 'btn_disease4':
                            G('disease_content').innerHTML = '原因：气温低心跳加快，血管收缩，血压高，心脏负荷大，血压波动大 <br><br>' +
                                '注意：注意饮食，注意保暖，减少外出 <br><br>' +
                                '食疗：葡萄、鸡蛋、牛排、马铃薯、全麦食品、鳄梨、核桃、洋葱、杨梅';
                            break
                        case 'btn_disease5':
                            G('disease_content').innerHTML = '治疗：萝卜叶、羊油、啤酒加水、冬瓜皮、辣椒气熏法 <br><br>' +
                                '预防：冷水洗脸、涂抹护肤品、生姜涂搽皮肤、温差水泡法、温水泡脚 <br><br>' +
                                '治疗误区：用热水泡，会加重冻疮、用偏方治疗、使劲搓受冻地方';
                            break
                        case 'btn_disease6':
                            G('disease_content').innerHTML ='症状：肩部疼痛、肩关节活动受限、怕冷、压痛、肌肉痉挛和萎缩 <br><br>' +
                                '治疗：涂抹镇痛药膏、口服镇痛药、拔火罐、药浴浸泡、仰泳法、热敷法 <br><br>' +
                                '预防：防止寒邪的侵袭、局部推拿、劳动和运动都要适当、中药辨证食疗、物理疗法';
                            break
                        case 'btn_disease7':
                            G('disease_content').innerHTML ='症状：累及膝、踝、肩、腕、肘等大关节，感觉疼痛、压痛、僵硬感、肿胀 <br><br>' +
                                '预防：心理状态不可乱、早期诊断、劳逸结合、避免风寒湿邪、预防控制感染 <br><br>' +
                                '食疗：鸡肉、兔肉、牛肉、羊肉，生姜当归补气血';
                            break
                        case 'btn_disease8':
                            G('disease_content').innerHTML ='膳食预防：多食水果、蔬菜等粗纤维饮食、限制钠盐、选用优质蛋白质食物、清晨起床后喝一杯清水 <br><br>' +
                                '药物治疗：按规定方法剂量服药，注意药物的耐受性，警惕体位性低血压，不能急于停药 <br><br>' +
                                '注意保暖：气温的过低会导致血压波动变快，多穿衣服，头上戴帽子，脚上穿厚靴子，保持温度不低';
                            break
                        case 'btn_disease9':
                            G('disease_content').innerHTML ='原因：寒冷使人体的血管处于收缩状态，诱发冠状动脉痉挛，上呼吸道感染和支气管肺炎 <br><br>' +
                                '预防：坚持服药治疗，控制血压血糖血脂，谨防感冒、适度锻炼、注意劳逸结合，戒烟，保持良好心态 <br><br>' +
                                '注意：不搬台过重物品、保持心境舒畅、每周三次体育锻炼、不要在饱餐或饥饿的情况下洗澡，注意气候变化';
                            break
                        case 'btn_disease10':
                            G('disease_content').innerHTML ='鼻子：干燥，鼻内有刺痒感或异物感 <br><br>' +
                                '眼睛：干涩，眼异物感、视疲劳、眼烧灼感 <br><br>' +
                                '耳朵：发热，预防冻疮，补肾，稳定情绪<br><br>' +
                                '嘴巴：干燥，去死皮，敷唇膜，不要舔嘴唇，按摩<br><br>' +
                                '手：脱皮，避免碱性皂品，控制饮食，补充维生素A<br><br>' +
                                '脚：出汗、脚痒，注意食补，穿合适的袜子，穿透气鞋子<br><br>' +
                                '后背：发凉，保暖，跑步运动，喝热水，保证睡眠';
                            break
                    }
                }
            }

        };



        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusDown: 'btn_common_diseases',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusUp: 'btn_common_diseases',
                nextFocusDown: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_close_rule',
                name: '按钮-活动规则-关闭',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: a.eventHandler
            },{
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'btn_start',
                nextFocusLeft: 'btn_start',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            },{
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusLeft: 'reset_tel',
                nextFocusRight: 'btn_list_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                listType: 'lottery',
                click: a.eventHandler
            }, {
                id: 'btn_common_diseases',
                name: '按钮-冬季常见病',
                type: 'img',
                nextFocusLeft: 'btn_start',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_common_diseases.png'),
                focusImage: a.makeImageUrl('btn_common_diseases_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_disease1',
                name: '支气管炎',
                type: 'img',
                nextFocusDown: 'btn_disease2',
                backgroundImage: a.makeImageUrl('btn_disease1.png'),
                focusImage: a.makeImageUrl('btn_disease1_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_disease2',
                name: '冬季面瘫',
                type: 'img',
                nextFocusUp: 'btn_disease1',
                nextFocusDown: 'btn_disease3',
                backgroundImage: a.makeImageUrl('btn_disease2.png'),
                focusImage: a.makeImageUrl('btn_disease2_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease

            }, {
                id: 'btn_disease3',
                name: '冬季抑郁症',
                type: 'img',
                nextFocusUp: 'btn_disease2',
                nextFocusDown: 'btn_disease4',
                backgroundImage: a.makeImageUrl('btn_disease3.png'),
                focusImage: a.makeImageUrl('btn_disease3_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_disease4',
                name: '冬季心脏病',
                type: 'img',
                nextFocusUp: 'btn_disease3',
                nextFocusDown: 'btn_disease5',
                backgroundImage: a.makeImageUrl('btn_disease4.png'),
                focusImage: a.makeImageUrl('btn_disease4_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_disease5',
                name: '冬季冻疮',
                type: 'img',
                nextFocusUp: 'btn_disease4',
                nextFocusDown: 'btn_disease6',
                backgroundImage: a.makeImageUrl('btn_disease5.png'),
                focusImage: a.makeImageUrl('btn_disease5_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_disease6',
                name: '冬季肩周炎',
                type: 'img',
                nextFocusUp: 'btn_disease5',
                nextFocusDown: 'btn_disease7',
                backgroundImage: a.makeImageUrl('btn_disease6.png'),
                focusImage: a.makeImageUrl('btn_disease6_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_disease7',
                name: '冬季风湿',
                type: 'img',
                nextFocusUp: 'btn_disease6',
                nextFocusDown: 'btn_disease8',
                backgroundImage: a.makeImageUrl('btn_disease7.png'),
                focusImage: a.makeImageUrl('btn_disease7_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_disease8',
                name: '冬季高血压',
                type: 'img',
                nextFocusUp: 'btn_disease7',
                nextFocusDown: 'btn_disease9',
                backgroundImage: a.makeImageUrl('btn_disease8.png'),
                focusImage: a.makeImageUrl('btn_disease8_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_disease9',
                name: '冬季心梗',
                type: 'img',
                nextFocusUp: 'btn_disease8',
                nextFocusDown: 'btn_disease10',
                backgroundImage: a.makeImageUrl('btn_disease9.png'),
                focusImage: a.makeImageUrl('btn_disease9_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_disease10',
                name: '秋冬常见病',
                type: 'img',
                nextFocusUp: 'btn_disease9',
                backgroundImage: a.makeImageUrl('btn_disease10.png'),
                focusImage: a.makeImageUrl('btn_disease10_f.png'),
                click: Activity.eventHandler,
                moveChange:Activity.changeDisease
            }, {
                id: 'btn_list_cancel',
                name: '按钮-中奖名单-取消',
                type: 'img',
                nextFocusLeft: 'btn_list_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'reset_tel',
                name: '输入框-中奖名单-重置电话号码',
                type: 'div',
                nextFocusRight: 'btn_list_submit',
                backFocusId: 'btn_list_submit',
                focusChange: Activity.onInputFocus,
                click: Activity.eventHandler
            }, {
                id: 'btn_lottery_submit',
                name: '按钮-中奖-确定',
                type: 'img',
                nextFocusUp: 'lottery_tel',
                nextFocusRight: 'btn_lottery_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_lottery_cancel',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: 'btn_lottery_submit',
                nextFocusUp: 'lottery_tel',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'lottery_tel',
                name: '输入框-抽奖-电话号码',
                type: 'div',
                nextFocusDown: 'btn_lottery_cancel',
                backFocusId: 'btn_lottery_submit',
                focusChange: Activity.onInputFocus
            }, {
                id: 'btn_lottery_fail',
                name: '按钮-抽奖失败-确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_game_over_sure',
                name: '按钮-结束游戏',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_order_submit',
                name: '按钮-订购VIP',
                type: 'img',
                nextFocusRight: 'btn_order_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_order_cancel',
                name: '按钮-取消订购VIP',
                type: 'img',
                nextFocusLeft: 'btn_order_submit',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_game_confirm',
                name: '按钮-中奖-确定',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: 'btn_game_cancel',
                backgroundImage: a.makeImageUrl('btn_lotter.png'),
                focusImage: a.makeImageUrl('btn_lotter_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_game_cancel',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: 'btn_game_confirm',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_no_score',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            },{
                id: 'game_over_sure',
                name: '游戏-失败',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: Activity.eventHandler
            },{
                id: 'do-lottery',
                name: '游戏-抽奖',
                type: 'img',
                nextFocusRight: 'do-cancel',
                backgroundImage: a.makeImageUrl('btn_draw.png'),
                focusImage: a.makeImageUrl('btn_draw_f.png'),
                click: Activity.eventHandler
            },{
                id: 'do-cancel',
                name: '游戏-放弃',
                type: 'img',
                nextFocusLeft: 'do-lottery',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_cancel.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_f.png'),
                click: Activity.eventHandler
            },{
                id: 'btn_start',
                name: '开始',
                type: 'img',
                nextFocusRight: 'btn_winner_list',
                nextFocusUp: 'btn_winner_list',
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                click: Activity.eventHandler
            }
        ];

        w.Activity = Activity;
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094', '220095', '410092','460092', '10220094'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);

}
