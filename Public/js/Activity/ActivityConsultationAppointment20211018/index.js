(function (w, e, r, a) {
        var Activity = {
            data: [1, 2, 3, 5, 6, 7],
            score: 0,
            pos: [],
            playStatus: false,
            cutTime: 10,
            timerId: "",
            currentSkin: 1,
            clearTimer:"",

            init: function () {
                console.log('json test: ' + JSON.stringify(JSON.parse('{"name":"test"}')))
                if(RenderParam.lmcid === '000051'){
                    a.setPageSize()
                }
                Activity.initRegional();
                Activity.initGameData();
                Activity.initButtons();

                Activity.initExtraTimes();

                a.showOrderResult();
                RenderParam.carrierId == "410092" && Activity.onBack410092();

                var nowTime= new Date().getTime();
                var startDate =RenderParam.endDt;
                startDate= startDate.replace(new RegExp("-","gm"),"/");
                var endDateM = (new Date(startDate)).getTime(); //得到毫秒数
                if(nowTime>=endDateM){
                    LMActivity.showModal({
                        id: 'bg_game_over',
                        onDismissListener: function () {
                            LMEPG.Intent.back()
                        }
                    });
                }
            },

            /**
             * 处理河南地区返回
             */
            onBack410092: function () {
                try {
                    HybirdCallBackInterface.setCallFunction(function (param) {
                        if (param.tag == HybirdCallBackInterface.EVENT_KEYBOARD_BACK) {
                            Activity.onBack();
                        }
                    });
                } catch (e) {
                    LMEPG.UI.logPanel.show("e");
                }
            },

            initRegional: function () {
                // 活动规则图片片路径
                var regionalImagePath = r.imagePath + 'V' + r.lmcid;
                $('bg_activity_rule').src = regionalImagePath + '/bg_activity_rule.png';
                a.prizeImage = {
                    "1": regionalImagePath + '/icon_prize_1.png',
                    "2": regionalImagePath + '/icon_prize_2.png',
                    "3": regionalImagePath + '/icon_prize_3.png',
                    "4": regionalImagePath + '/icon_prize_4.png',
                    "5": regionalImagePath + '/icon_prize_5.png',
                    "6": regionalImagePath + '/icon_prize_6.png',
                    "7": regionalImagePath + '/icon_prize_7.png',
                    "8": regionalImagePath + '/icon_prize_8.png',
                    "9": regionalImagePath + '/icon_prize_9.png',
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
                    case 'btn_back':
                        LMActivity.innerBack();
                        break;
                    case 'btn_activity_rule':
                        G('recommend_video').style.display = 'none';
                        LMActivity.triggerModalButton = btn.id;
                        LMActivity.showModal({
                            id: 'activity_rule',
                            focusId: 'btn_close_rule',
                            onDismissListener: function () {
                                G('recommend_video').style.display = 'block';
                            }
                        });
                        break;
                    case 'btn_winner_list':
                        G('recommend_video').style.display = 'none';
                        switch (btn.listType) {
                            case 'exchange':
                                LMActivity.renderExchangeRecordList(r.exchangeRecordList.data.all_list,
                                    r.exchangeRecordList.data.list);
                                break;
                            case 'lottery':
                                LMActivity.renderLotteryRecordList(r.lotteryRecordList.list,
                                    r.myLotteryRecord.list);
                                break;
                        }
                        LMActivity.triggerModalButton = btn.id;
                        LMActivity.showModal({
                            id: 'winner_list',
                            focusId: 'btn_list_submit',
                            onDismissListener: function () {
                                G('recommend_video').style.display = 'block';
                            }
                        });
                        break;
                    case 'btn_consult_doctor':
                    case 'btn_consult_doctor_order':
                        var HealthTestRecordIntent = LMEPG.Intent.createIntent("doctorIndex");
                        LMEPG.Intent.jump(HealthTestRecordIntent, LMActivity.Router.getCurrentPage(), LMEPG.Intent.INTENT_FLAG_DEFAULT);
                        break;
                    case 'btn_make_appointment':
                    case 'btn_make_appointment_order':
                        Activity.isCompleteRegister(function (flag) {
                            var guaHaoIntent = LMEPG.Intent.createIntent("appointmentRegister");
                            guaHaoIntent.setParam('focusIndex', '');
                            if (!flag) {
                                Activity.putData(RenderParam.userId + 'register', new Date(new Date().toLocaleDateString()).getTime());
                                a.AjaxHandler.addExtraTimes(function () {
                                    LMEPG.Intent.jump(guaHaoIntent, LMActivity.Router.getCurrentPage(), LMEPG.Intent.INTENT_FLAG_DEFAULT);
                                });
                            } else {
                                LMEPG.Intent.jump(guaHaoIntent, LMActivity.Router.getCurrentPage(), LMEPG.Intent.INTENT_FLAG_DEFAULT);
                            }
                        });
                        break;
                    case 'btn_winter_disease':
                        G('recommend_video').style.display = 'none';
                        LMActivity.triggerModalButton = btn.id;
                        LMActivity.showModal({ //展示模板页面
                            id: 'winter_disease',
                            focusId: 'btn_bronchitis',
                            onDismissListener: function () {
                                G('recommend_video').style.display = 'block';
                            }
                        });
                        break;
                    case 'btn_bronchitis':
                        G('disease_content').innerHTML = '急性支气管炎:低热、畏寒、周身乏力、咽喉部发痒 <br> <br>' +
                            '        慢性支气管炎:长期、反复咳嗽、咳痰不易咯出、产生气喘、呼吸道感染 <br> <br>' +
                            '        食疗:百合粥、芥菜粥、杏仁粥、梨粥、山药汤、川贝梨、三仙饮、川贝百合汤';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_facial_paralysis':
                        G('disease_content').innerHTML = '原因：冬季衣物过于单薄、室外吹风时间长，刺激面部的血管神经痉挛 <br> <br>' +
                            '        症状：口不能闭、口眼歪斜、流口水 <br> <br>' +
                            '        预防：减肥、调整饮食结构、运动、戒烟酒、定期检查血压、血脂、血糖';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_depressed':
                        G('disease_content').innerHTML = '原因：干燥多风，导致阴阳平衡失调、与体内气机变化有关 <br> <br>' +
                            '        人群：女性、性格内向敏感、遭遇心理应激事件、室内工作者 <br> <br>' +
                            '        预防：常晒太阳、适度运动、饮食调养、修身养性';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_heart_disease':
                        G('disease_content').innerHTML = '原因：气温低心跳加快，血管收缩，血压高，心脏负荷大，血压波动大 <br> <br>' +
                            '        注意：注意饮食，注意保暖，减少外出 <br> <br>' +
                            '        食疗：葡萄、鸡蛋、牛排、马铃薯、全麦食品、鳄梨、核桃、洋葱、杨梅';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_chilblains':
                        G('disease_content').innerHTML = '治疗：萝卜叶、羊油、啤酒加水、冬瓜皮、辣椒气熏法 <br> <br>' +
                            '        预防：冷水洗脸、涂抹护肤品、生姜涂搽皮肤、温差水泡法、温水泡脚 <br> <br>' +
                            '        治疗误区：用热水泡，会加重冻疮、用偏方治疗、使劲搓受冻地方';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_scapulohumeral':
                        G('disease_content').innerHTML = '症状：肩部疼痛、肩关节活动受限、怕冷、压痛、肌肉痉挛和萎缩 <br> <br>' +
                            '        治疗：涂抹镇痛药膏、口服镇痛药、拔火罐、药浴浸泡、仰泳法、热敷法 <br> <br>' +
                            '        预防：防止寒邪的侵袭、局部推拿、劳动和运动都要适当、中药辨证食疗、物理疗法';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_rheumatism':
                        G('disease_content').innerHTML = '症状：累及膝、踝、肩、腕、肘等大关节，感觉疼痛、压痛、僵硬感、肿胀 <br> <br>' +
                            '        预防：心理状态不可乱、早期诊断、劳逸结合、避免风寒湿邪、预防控制感染 <br> <br>' +
                            '        食疗：鸡肉、兔肉、牛肉、羊肉，生姜当归补气血';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_hypertension':
                        G('disease_content').innerHTML = '膳食预防：多食水果、蔬菜等粗纤维饮食、限制钠盐、选用优质蛋白质食物清晨起床后喝一杯清水 <br> <br>' +
                            '        药物治疗：按规定方法剂量服药，注意药物的耐受性，警惕体位性低血压，不能急于停药 <br> <br>' +
                            '        注意保暖：气温的过低会导致血压波动变快，多穿衣服，头上戴帽子，脚上穿厚靴子，保持温度不低';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_myocardial_infarction':
                        G('disease_content').innerHTML = '原因：寒冷使人体的血管处于收缩状态，诱发冠状动脉痉挛，上呼吸道感染和支气管肺炎 <br> <br>' +
                            '        预防：坚持服药治疗，控制血压血糖血脂，谨防感冒、适度锻炼、注意劳逸结合，戒烟，保持良好心态 <br> <br>' +
                            '        注意：不搬台过重物品、保持心境舒畅、每周三次体育锻炼、不要在饱餐或饥饿的情况下洗澡，注意气候变化';
                        G('disease_content').style.top = '251px';
                        break;
                    case 'btn_common_diseases':
                        G('disease_content').innerHTML = '<p>鼻子：干燥，鼻内有刺痒感或异物感</p>' +
                            '        <p id="context_disease">眼睛：干涩，眼异物感、视疲劳、眼烧灼感</p>' +
                            '        <p id="context_disease">耳朵：发热，预防冻疮，补肾，稳定情绪</p>' +
                            '        <p id="context_disease">嘴巴：干燥，去死皮，敷唇膜，不要舔嘴唇，按摩</p>' +
                            '        <p id="context_disease">手：脱皮，避免碱性皂品，控制饮食，补充维生素A</p>' +
                            '        <p id="context_disease">脚：出汗、脚痒，注意食补，穿合适的袜子，穿透气鞋子</p>' +
                            '        <p id="context_disease">后背：发凉，保暖，跑步运动，喝热水，保证睡眠';
                        G('disease_content').style.top = '230px';
                        break;
                    case 'bg_recommend_1':
                        // 创建视频信息
                        var videoInfo = {
                            'videoUrl': 'http%3A%2F%2F10.255.0.44%3A8089%2F00000000%2F00030000000000000000000000054206' +
                                '%2Findex.m3u8%3FAuthInfo%3Dxxx%26version%3Dxxx%26sss%3Dxxx',
                            'sourceId': '184',
                            'title': '小孩三岁半 冬天胸口脖子爱出汗怎么办',
                            'type': 4,
                            'userType': '2',
                            'freeSeconds': '30',
                            'entryType': 2,
                            'entryTypeName': '预约、问诊活动',
                            'unionCode': 'gylm184'
                        };
                        Activity.jumpPlayVideo(videoInfo);
                        return;
                    case 'bg_recommend_2':
                        // 创建视频信息
                        var videoInfo = {
                            'videoUrl': 'http%3A%2F%2F10.255.0.44%3A8089%2F00000000%2F00030000000000000000000000054832' +
                                '%2Findex.m3u8%3FAuthInfo%3Dxxx%26version%3Dxxx%26sss%3Dxxx',
                            'sourceId': '810',
                            'title': '老年冠心病有哪些明显的症状？什么情况下该及时就医？',
                            'type': 4,
                            'userType': '2',
                            'freeSeconds': '30',
                            'entryType': 2,
                            'entryTypeName': '预约、问诊活动',
                            'unionCode': 'gylm848'
                        };
                        Activity.jumpPlayVideo(videoInfo);
                        return;
                    case 'bg_recommend_3':
                        // 创建视频信息
                        var videoInfo = {
                            'videoUrl': 'http%3A%2F%2F10.255.0.44%3A8089%2F00000000%2F00030000000000000000000000054911' +
                                '%2Findex.m3u8%3FAuthInfo%3Dxxx%26version%3Dxxx%26sss%3Dxxx',
                            'sourceId': '967',
                            'title': '孩子秋冬进补要注意',
                            'type': 4,
                            'userType': '2',
                            'freeSeconds': '30',
                            'entryType': 2,
                            'entryTypeName': '预约、问诊活动',
                            'unionCode': 'lmzz007'
                        };
                        Activity.jumpPlayVideo(videoInfo);
                        return;
                    case 'bg_recommend_4':
                        // 创建视频信息
                        var videoInfo = {
                            'videoUrl': 'http%3A%2F%2F10.255.0.44%3A8089%2F00000000%2F00030000000000000000000000054199' +
                                '%2Findex.m3u8%3FAuthInfo%3Dxxx%26version%3Dxxx%26sss%3Dxxx',
                            'sourceId': '177',
                            'title': '孩子秋冬进补 健脾助消化是关键',
                            'type': 4,
                            'userType': '2',
                            'freeSeconds': '30',
                            'entryType': 2,
                            'entryTypeName': '预约、问诊活动',
                            'unionCode': 'gylm177'
                        };
                        Activity.jumpPlayVideo(videoInfo);
                        return;
                    case 'bg_recommend_5':
                        // 创建视频信息
                        var videoInfo = {
                            'videoUrl': 'http%3A%2F%2F10.255.0.44%3A8089%2F00000000%2F00030000000000000000000000054396' +
                                '%2Findex.m3u8%3FAuthInfo%3Dxxx%26version%3Dxxx%26sss%3Dxxx',
                            'sourceId': '374',
                            'title': '麦冬',
                            'type': 4,
                            'userType': '2',
                            'freeSeconds': '30',
                            'entryType': 2,
                            'entryTypeName': '预约、问诊活动',
                            'unionCode': 'gylm408'
                        };
                        Activity.jumpPlayVideo(videoInfo);
                        return;
                    case 'btn_tomorrow_fail':
                    case 'btn_order_cancel':
                    case 'btn_close_exchange':
                    case 'btn_close':
                        //LMActivity.triggerModalButton = 'btn_start';
                        // 隐藏当前正在显示的模板
                        a.hideModal(a.shownModal);
                        G('recommend_video').style.display = 'block';
                        LMActivity.playStatus = false;
                        break;
                    case 'lipstick1':
                        LMActivity.triggerModalButton = btn.id;
                        G('recommend_video').style.display = 'none';
                        if (a.hasLeftTime()) {
                            a.AjaxHandler.uploadPlayRecord(function (){
                                r.leftTimes = r.leftTimes - 1;
                                G("left_times").innerHTML = r.leftTimes;
                                LMActivity.playStatus = true;
                                a.doLottery();
                            })
                        } else {
                            Activity.isCompleteInquiry(function (flag) {
                                if (!flag) {
                                    LMActivity.showModal({ //展示模板页面
                                        id: 'complete_task',
                                        focusId: 'btn_consult_doctor_order',
                                        onDismissListener: function () {
                                            G('recommend_video').style.display = 'block';
                                        }
                                    });
                                } else {
                                    Activity.isCompleteRegister(function (flag) {
                                        if (!flag) {
                                            LMActivity.showModal({ //展示模板页面
                                                id: 'complete_task',
                                                focusId: 'btn_make_appointment_order',
                                                onDismissListener: function () {
                                                    G('recommend_video').style.display = 'block';
                                                }
                                            });
                                        } else {
                                            LMActivity.showModal({ //展示模板页面
                                                id: 'tomorrow',
                                                focusId: 'btn_tomorrow_fail',
                                                onDismissListener: function () {
                                                    G('recommend_video').style.display = 'block';
                                                }
                                            });
                                        }
                                    })
                                }
                            })
                        }
                        break;
                    case 'btn_lottery_submit':
                    case 'btn_no_score':
                    case 'btn_game_cancel':
                    case 'do-cancel':
                        LMActivity.Router.reload();
                }
            },
            // 初始页面首页默认焦点
            initButtons: function () {
                e.BM.init('lipstick1', Activity.buttons, true);
            },

            onInputFocus: function (btn, hasFocus) {
                if (hasFocus) {
                    LMEPG.UI.keyboard.show(RenderParam.platformType === 'hd' ? 235 : 215, RenderParam.platformType === 'hd' ? 420 : 190, btn.id, btn.backFocusId, true);
                }
            },
            canDown:function (dir) {
                if (G('card-content').src.lastIndexOf('.png') != -1 &&
                    G('blessing-content').src.lastIndexOf('.png') != -1 &&
                    dir === 'down') {
                    LMEPG.BM.requestFocus('btn_send');
                }
            },

            initExtraTimes: function () {
                Activity.isInquiry(function (flag) {
                    if (flag) {
                        Activity.putData(RenderParam.userId + 'inquiry', '', function (result) {
                            var rs = result instanceof Object ? result : JSON.parse(result);
                            if (rs.result === 0 && (rs.data === null || rs.data.value !== new Date(new Date().toLocaleDateString()).getTime().toString())) {
                                Activity.putData(RenderParam.userId + 'inquiry', new Date(new Date().toLocaleDateString()).getTime());
                                a.AjaxHandler.addExtraTimes(function (result) {
                                    var rs = result instanceof Object ? result : JSON.parse(result);
                                    if (rs.result === 0) {
                                        G('left_times').innerHTML++;
                                    }
                                });
                            }
                        });
                    }
                })
            },

            isInquiry: function (callback) {
                Activity.getInquiryTimes(function (result) {
                    if (parseInt(result.count) > 0) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                })
            },

            /*isRegister: function () {
                Activity.getRecordListInfo(function (result) {
                    if (result.data.list.len > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }, function () {
                    LMEPG.UI.showToast('获取数据失败');
                })
            },*/

            isCompleteInquiry: function (callback) {
                Activity.putData(RenderParam.userId + 'inquiry', '', function (result) {
                    var rs = result instanceof Object ? result : JSON.parse(result);
                    if (rs.result === 0 && rs.data !== null && rs.data.value === new Date(new Date().toLocaleDateString()).getTime().toString()) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            },

            isCompleteRegister: function (callback) {
                Activity.putData(RenderParam.userId + 'register', '', function (result) {
                    var rs = result instanceof Object ? result : JSON.parse(result);
                    if (rs.result === 0 && rs.data !== null && rs.data.value === new Date(new Date().toLocaleDateString()).getTime().toString()) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                }, function () {
                });
            },

            getInquiryTimes: function (successFn, errorFn) {
                var params = {
                    postData: {
                        'duration_flag': 1
                    },
                    path: 'Doctor/getInquiryTimesNew'
                };
                params.successCallback = successFn;
                params.errorCallback = errorFn;
                LMActivity.ajaxPost(params);
            },

            /*getRecordListInfo: function (successFn, errorFn) {
                var params = {
                    postData: {
                        'time_stamp': new Date(new Date().toLocaleDateString()).getTime(),
                        'duration_flag': 1,
                    },
                    path: 'AppointmentRegister/getRecordListInfo'
                };
                params.successCallback = successFn;
                params.errorCallback = errorFn;
                LMActivity.ajaxPost(params);
            },*/

            putData: function (key, value, successFn, errorFn) {
                var params = {
                    postData: {
                        "key": key,
                        "value": value
                    },
                    path: 'Activity/activityDataEX'
                };
                params.successCallback = successFn;
                params.errorCallback = errorFn;
                LMActivity.ajaxPost(params);
            },

            /**
             * 跳转到视频播放页，播放结束时返回到首页
             * @param data 视频信息
             */
            jumpPlayVideo: function (videoInfo) {
                LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
                    var objCurrent = LMActivity.Router.getCurrentPage(); //得到当前页
                    var objPlayer = LMEPG.Intent.createIntent('player');
                    objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));
                    LMEPG.Intent.jump(objPlayer, objCurrent);
                }, function () {
                    LMEPG.UI.showToast("视频参数错误");
                });
            },

            beforeMoveChange: function (dir, current) {
                switch (dir) {
                    case "up":
                        switch (current.id) {
                            case 'bg_recommend_1':
                            case 'bg_recommend_2':
                            case 'bg_recommend_3':
                            case 'bg_recommend_4':
                            case 'bg_recommend_5':
                                Activity.scrollTop(0);
                                break;
                        }
                        break;
                    case "down":
                        switch (current.id) {
                            case 'lipstick1':
                            case 'btn_winner_list':
                                Activity.scrollTop(-191);
                                break;
                        }
                        break;
                }
            },

            scrollTop: function (distance) {
                G("scroll").style.top = distance + "px";
            },
        };


        Activity.buttons = [
            {
                id: 'btn_back',
                name: '按钮-返回',
                type: 'img',
                nextFocusLeft: 'lipstick1',
                nextFocusDown: 'btn_consult_doctor',
                backgroundImage: a.makeImageUrl('btn_back.png'),
                focusImage: a.makeImageUrl('btn_back_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_consult_doctor',
                name: '按钮-咨询医生',
                type: 'img',
                nextFocusLeft: 'lipstick1',
                nextFocusUp: 'btn_back',
                nextFocusDown: 'btn_make_appointment',
                backgroundImage: a.makeImageUrl('btn_consult_doctor.png'),
                focusImage: a.makeImageUrl('btn_consult_doctor_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_make_appointment',
                name: '按钮-预约挂号',
                type: 'img',
                nextFocusLeft: 'lipstick1',
                nextFocusUp: 'btn_consult_doctor',
                nextFocusDown: 'btn_winter_disease',
                backgroundImage: a.makeImageUrl('btn_make_appointment.png'),
                focusImage: a.makeImageUrl('btn_make_appointment_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_winter_disease',
                name: '按钮-冬季常见病',
                type: 'img',
                nextFocusLeft: 'lipstick1',
                nextFocusUp: 'btn_make_appointment',
                nextFocusDown: 'btn_activity_rule',
                backgroundImage: a.makeImageUrl('btn_winter_disease.png'),
                focusImage: a.makeImageUrl('btn_winter_disease_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_activity_rule',
                name: '按钮-活动规则',
                type: 'img',
                nextFocusLeft: 'lipstick1',
                nextFocusUp: 'btn_winter_disease',
                nextFocusDown: 'btn_winner_list',
                nextFocusRight:'',
                backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
                focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_winner_list',
                name: '按钮-中奖名单',
                type: 'img',
                nextFocusLeft: 'lipstick1',
                nextFocusUp: 'btn_activity_rule',
                nextFocusDown: 'bg_recommend_1',
                backgroundImage: a.makeImageUrl('btn_winner_list.png'),
                focusImage: a.makeImageUrl('btn_winner_list_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                listType: 'lottery',
                click: Activity.eventHandler
            }, {
                id: 'lipstick1',
                name: '立即抽奖',
                type: 'img',
                nextFocusRight:"btn_winner_list",
                nextFocusUp:"btn_back",
                nextFocusDown:"bg_recommend_1",
                backgroundImage: a.makeImageUrl('btn_start.png'),
                focusImage: a.makeImageUrl('btn_start_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                click: Activity.eventHandler
            }, {
                id: 'bg_recommend_1',
                name: '推荐视频-1',
                type: 'div',
                nextFocusUp: 'lipstick1',
                nextFocusRight: 'bg_recommend_2',
                backgroundImage: ' ',
                focusImage: a.makeImageUrl('bg_recommend_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                click: Activity.eventHandler
            }, {
                id: 'bg_recommend_2',
                name: '推荐视频-2',
                type: 'div',
                nextFocusUp: 'lipstick1',
                nextFocusLeft: 'bg_recommend_1',
                nextFocusRight: 'bg_recommend_3',
                backgroundImage: ' ',
                focusImage: a.makeImageUrl('bg_recommend_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                click: Activity.eventHandler
            }, {
                id: 'bg_recommend_3',
                name: '推荐视频-3',
                type: 'div',
                nextFocusUp: 'lipstick1',
                nextFocusLeft: 'bg_recommend_2',
                nextFocusRight: 'bg_recommend_4',
                backgroundImage: ' ',
                focusImage: a.makeImageUrl('bg_recommend_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                click: Activity.eventHandler
            }, {
                id: 'bg_recommend_4',
                name: '推荐视频-4',
                type: 'div',
                nextFocusUp: 'lipstick1',
                nextFocusLeft: 'bg_recommend_3',
                nextFocusRight: 'bg_recommend_5',
                backgroundImage: ' ',
                focusImage: a.makeImageUrl('bg_recommend_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                click: Activity.eventHandler
            }, {
                id: 'bg_recommend_5',
                name: '推荐视频-5',
                type: 'div',
                nextFocusUp: 'lipstick1',
                nextFocusLeft: 'bg_recommend_4',
                backgroundImage: ' ',
                focusImage: a.makeImageUrl('bg_recommend_f.png'),
                beforeMoveChange: Activity.beforeMoveChange,
                click: Activity.eventHandler
            }, {
                id: 'btn_list_submit',
                name: '按钮-中奖名单-确定',
                type: 'img',
                nextFocusRight: 'btn_list_cancel',
                nextFocusLeft: 'reset_tel',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                listType: 'lottery',
                click: a.eventHandler
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
                backFocusId: 'btn_list_submit',
                focusChange: Activity.onInputFocus,
                click: Activity.eventHandler
            }, {
                id: 'btn_lottery_submit',
                name: '按钮-中奖-确定',
                type: 'img',
                nextFocusUp: 'lottery_tel',
                nextFocusRight: 'btn_lottery_cancel',
                backgroundImage: a.makeImageUrl('btn_common_sure_b.png'),
                focusImage: a.makeImageUrl('btn_common_sure_b_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_lottery_cancel',
                name: '按钮-中奖-取消',
                type: 'img',
                nextFocusLeft: 'btn_lottery_submit',
                nextFocusUp: 'lottery_tel',
                backgroundImage: a.makeImageUrl('btn_common_cancel_b.png'),
                focusImage: a.makeImageUrl('btn_common_cancel_b_f.png'),
                click: a.eventHandler
            }, {
                id: 'lottery_tel',
                name: '输入框-抽奖-电话号码',
                type: 'div',
                backFocusId: 'btn_lottery_submit',
                focusChange: Activity.onInputFocus
            }, {
                id: 'btn_lottery_fail',
                name: '按钮-抽奖失败-确定',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure_b.png'),
                focusImage: a.makeImageUrl('btn_common_sure_b_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_close_exchange',
                name: '按钮-兑换页-返回',
                type: 'img',
                nextFocusDown: 'exchange_prize_1',
                backgroundImage: a.makeImageUrl('btn_close.png'),
                focusImage: a.makeImageUrl('btn_close_f.png'),
                click: Activity.eventHandler
            },  {
                id: 'exchange_tel',
                name: '输入框-兑换-电话号码',
                type: 'div',
                nextFocusDown: 'btn_exchange_submit',
                backFocusId: 'btn_exchange_submit',
                focusChange: a.onInputFocus
            }, {
                id: 'btn_game_over_sure',
                name: '按钮-结束游戏',
                type: 'img',
                backgroundImage: a.makeImageUrl('btn_common_sure.png'),
                focusImage: a.makeImageUrl('btn_common_sure_f.png'),
                click: a.eventHandler
            }, {
                id: 'btn_order_submit',
                name: '按钮-咨询医生',
                type: 'img',
                nextFocusDown: 'btn_order_cancel',
                backgroundImage: a.makeImageUrl('btn_consult_doctor_order.png'),
                focusImage: a.makeImageUrl('btn_consult_doctor_order_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_order_cancel',
                name: '按钮-预约挂号',
                type: 'img',
                nextFocusUp: 'btn_order_submit',
                backgroundImage: a.makeImageUrl('btn_make_appointment_order.png'),
                focusImage: a.makeImageUrl('btn_make_appointment_order_f.png'),
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
            }, {
                id: 'btn_tomorrow_fail',
                name: '按钮-次数用完-确定',
                type: 'img',
                nextFocusLeft: '',
                nextFocusRight: '',
                backgroundImage: a.makeImageUrl('btn_common_sure_b.png'),
                focusImage: a.makeImageUrl('btn_common_sure_b_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_bronchitis',
                name: '支气管炎',
                type: 'img',
                nextFocusDown: 'btn_facial_paralysis',
                backgroundImage: a.makeImageUrl('btn_bronchitis.png'),
                focusImage: a.makeImageUrl('btn_bronchitis_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_facial_paralysis',
                name: '冬季面瘫',
                type: 'img',
                nextFocusUp: 'btn_bronchitis',
                nextFocusDown: 'btn_depressed',
                backgroundImage: a.makeImageUrl('btn_facial_paralysis.png'),
                focusImage: a.makeImageUrl('btn_facial_paralysis_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_depressed',
                name: '冬季抑郁症',
                type: 'img',
                nextFocusUp: 'btn_facial_paralysis',
                nextFocusDown: 'btn_heart_disease',
                backgroundImage: a.makeImageUrl('btn_depressed.png'),
                focusImage: a.makeImageUrl('btn_depressed_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_heart_disease',
                name: '冬季心脏病',
                type: 'img',
                nextFocusUp: 'btn_depressed',
                nextFocusDown: 'btn_chilblains',
                backgroundImage: a.makeImageUrl('btn_heart_disease.png'),
                focusImage: a.makeImageUrl('btn_heart_disease_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_chilblains',
                name: '冬季冻疮',
                type: 'img',
                nextFocusUp: 'btn_heart_disease',
                nextFocusDown: 'btn_scapulohumeral',
                backgroundImage: a.makeImageUrl('btn_chilblains.png'),
                focusImage: a.makeImageUrl('btn_chilblains_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_scapulohumeral',
                name: '冬季肩周炎',
                type: 'img',
                nextFocusUp: 'btn_chilblains',
                nextFocusDown: 'btn_rheumatism',
                backgroundImage: a.makeImageUrl('btn_scapulohumeral.png'),
                focusImage: a.makeImageUrl('btn_scapulohumeral_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_rheumatism',
                name: '冬季风湿',
                type: 'img',
                nextFocusUp: 'btn_scapulohumeral',
                nextFocusDown: 'btn_hypertension',
                backgroundImage: a.makeImageUrl('btn_rheumatism.png'),
                focusImage: a.makeImageUrl('btn_rheumatism_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_hypertension',
                name: '冬季高血压',
                type: 'img',
                nextFocusUp: 'btn_rheumatism',
                nextFocusDown: 'btn_myocardial_infarction',
                backgroundImage: a.makeImageUrl('btn_hypertension.png'),
                focusImage: a.makeImageUrl('btn_hypertension_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_myocardial_infarction',
                name: '冬季心梗',
                type: 'img',
                nextFocusUp: 'btn_hypertension',
                nextFocusDown: 'btn_common_diseases',
                backgroundImage: a.makeImageUrl('btn_myocardial_infarction.png'),
                focusImage: a.makeImageUrl('btn_myocardial_infarction_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_common_diseases',
                name: '秋冬常见病',
                type: 'img',
                nextFocusUp: 'btn_myocardial_infarction',
                backgroundImage: a.makeImageUrl('btn_common_diseases.png'),
                focusImage: a.makeImageUrl('btn_common_diseases_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_consult_doctor_order',
                name: '按钮-咨询医生',
                type: 'img',
                nextFocusDown: 'btn_make_appointment_order',
                backgroundImage: a.makeImageUrl('btn_consult_doctor_order.png'),
                focusImage: a.makeImageUrl('btn_consult_doctor_order_f.png'),
                click: Activity.eventHandler
            }, {
                id: 'btn_make_appointment_order',
                name: '按钮-预约挂号',
                type: 'img',
                nextFocusUp: 'btn_consult_doctor_order',
                backgroundImage: a.makeImageUrl('btn_make_appointment_order.png'),
                focusImage: a.makeImageUrl('btn_make_appointment_order_f.png'),
                click: Activity.eventHandler
            }
        ];

        w.Activity = Activity;

        w.onBack = function () {
            if (LMActivity.shownModal) {
                LMActivity.hideModal(LMActivity.shownModal);
            } else {
                LMEPG.Intent.back();
            }
        }
    }

)
(window, LMEPG, RenderParam, LMActivity);

var specialBackArea = ['220094', '220095', '410092'];
function outBack() {
    var objSrc = LMActivity.Router.getCurrentPage();
    var objHome = LMEPG.Intent.createIntent('home');
    LMEPG.Intent.jump(objHome, objSrc);
}
