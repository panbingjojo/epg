(function (w, e, r, a) {
    var Activity = {
        playStatus: false,
        score: 0,
        init: function () {
            Activity.initButtons();
            // a.showOrderResult();
            this.createHtml();
        },

        initButtons: function () {
            e.BM.init('btn_activity_rule', Activity.buttons, true);
        },
        eventHandler: function (btn) {
            switch (btn.id) {
                case 'btn_appointment':

                    break;
            }
        },
        createHtml: function (innerPageCurrent, LoadPageFlag) {
            var start = (innerPageCurrent - 1);//数组截取起始位置
            var end = innerPageCurrent;//数组截取终止位置\
            var singleArr = r.initClinicArr.data.slice(start, end);
            var clinicId = singleArr[0];
            LMEPG.ajax.postAPI("Expert/getExpertDetail", {"clinicID": clinicId}, function (rsp) {
                LMEPG.UI.dismissWaitingDialog();
                try {
                    var tempData = rsp instanceof Object ? rsp : JSON.parse(rsp);
                    var code = parseInt(tempData.code);
                    if (code === 0) {
                        var expertObj = tempData["data"][0];
                        G("photo_img").src = Expert.createDoctorUrl(expertUrl, expertObj.doctor_user_id, expertObj.doctor_avatar, lmcid);
                        G("doctor").innerHTML = expertObj.doctor_name;
                        G("job_name").innerHTML = expertObj.doctor_level;
                        G("hospital").innerHTML = expertObj.doctor_hospital_name;
                        G("content").innerHTML = expertObj.doctor_skill;
                        LMEPG.Log.info("goodAt>>>>>" + expertObj.doctor_skill);
                        console.log(expertObj.doctor_skill);
                        G("page").innerHTML = pageCurrent + "/" + pageNum;
                    } else {
                        LMEPG.UI.showToast("加载失败:" + code);
                    }
                } catch (e) {
                    LMEPG.UI.showToast("获取专家详情数据解析异常！");
                }
            }, function (rsp) {
                LMEPG.UI.dismissWaitingDialog();
                LMEPG.UI.showToast("获取专家详情请求失败");
            });
        },

        /**设置当前页参数*/
        getCurrentPage: function () {
            return e.Intent.createIntent('activity');
        },

        /**
         * 跳转到视频播放页，播放结束时返回到首页
         * @param data 视频信息
         */
        jumpPlayVideo: function () {
            // 创建视频信息
            var videoInfo = {
                'videoUrl': RenderParam.platformType == 'hd' ? '99100000012019122711314806850706' : '99100000012019122711455806855998',
                'sourceId': '889',
                'title': RenderParam.platformType == 'hd' ? '居家马甲线系列' : '扁鹊三兄弟',
                'type': 4,
                'userType': RenderParam.isVip != 1 ? 2 : 1,
                'freeSeconds': 0,
                'entryType': 1,
                'entryTypeName': 'epg-home',
                'unionCode': 'd5yy001',
                'showStatus': 1
            };

            LMEPG.ajax.postAPI("Player/storeVideoInfo", {"videoInfo": JSON.stringify(videoInfo)}, function () {
                var objCurrent = Activity.getCurrentPage(); //得到当前页
                var objPlayer = LMEPG.Intent.createIntent('player');
                objPlayer.setParam('videoInfo', JSON.stringify(videoInfo));

                LMEPG.Intent.jump(objPlayer, objCurrent);
            }, function () {
                LMEPG.UI.showToast("视频参数错误");
            });
        }
    };

    Activity.buttons = [
        {
            id: 'btn_back',
            name: '按钮-返回',
            type: 'img',
            nextFocusLeft: 'btn_appointment',
            nextFocusDown: 'btn_appointment',
            backgroundImage: a.makeImageUrl('btn_back.png'),
            focusImage: a.makeImageUrl('btn_back_f.png'),
            click: a.eventHandler,
            moveChange: function(e){console.log('end',e)},
            focusChange: function(e){console.log('begin',e)},
        }, {
            id: 'btn_appointment',
            name: '按钮-预约',
            type: 'img',
            nextFocusUp: 'btn_back',
            nextFocusRight: 'btn_back',
            nextFocusLeft: 'btn_appointment_record',
            backgroundImage: a.makeImageUrl('doctor_box.png'),
            focusImage: a.makeImageUrl('doctor_box.png'),
            click: Activity.eventHandler
        }, {
            id: 'btn_appointment_record',
            name: '按钮-预约记录',
            type: 'img',
            nextFocusLeft: 'btn_activity_rule',
            nextFocusRight: 'btn_appointment',
            backgroundImage: a.makeImageUrl('btn_appointment.png'),
            focusImage: a.makeImageUrl('btn_appointment_f.png'),
            click: a.eventHandler
        }, {
            id: 'btn_activity_rule',
            name: '按钮-活动规则',
            type: 'img',
            nextFocusRight: 'btn_appointment_record',
            backgroundImage: a.makeImageUrl('btn_activity_rule.png'),
            focusImage: a.makeImageUrl('btn_activity_rule_f.png'),
            click: a.eventHandler
        },
    ];

    w.Activity = Activity;
})(window, LMEPG, RenderParam, LMActivity);