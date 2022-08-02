var timer = null
var baseUrl = 'http://123.59.206.200:10027'

var Member = {
        buttons: [],
        init: function () {
            this.getReadeStatus(function (data) {
                Member.readeList = data?JSON.parse(data):[]
                Member.createBtns();
                Member.initData();
                if(RenderParam.comeFrom && (G('btn-jump-action').style.visibility !== 'hidden') && RenderParam.isFirst == '1'){
                    LMEPG.BM.requestFocus(RenderParam.comeFrom === 'doc'?'ask-doctor-record':'test-record')
                }else {
                    LMEPG.BM.requestFocus(!LMEPG.Func.isEmpty(RenderParam.focusId) ? RenderParam.focusId : 'focus-1');
                }


                if (RenderParam.isShowTestRecord === '0') {
                    G('new-ask-record').style.left = 170 + 'px';
                    G('new-ask-record').style.top = -15 + 'px';
                }
            })

        },
        /*最多8个成员*/
        data: [],
        /*移动切换成员*/
        onBeforeMoveSwitchMember: function (key, btn) {
            if (key == 'left' || key == 'right') {
                Member.updateMemberArray(key, btn);
                Member.updateMemberUI(key, btn);
                LMEPG.BM.requestFocus('focus-1');
            }
        },
        currentFocusMember: '',
    curMember:{},
        updateMemberUI: function () {
            var htm = '';
            if (RenderParam.memberInfo.list.length == 1) {
                RenderParam.memberInfo.list.push(
                    {member_id: 0, member_image_id: 0, member_name: '请添加家庭成员'},
                    {member_id: 0, member_image_id: 0, member_name: '请添加家庭成员'}
                );
            } else if (RenderParam.memberInfo.list.length == 2) {
                RenderParam.memberInfo.list.push(
                    {member_id: 0, member_image_id: 0, member_name: '请添加家庭成员'}
                );
            }

            var currData = RenderParam.memberInfo.list.slice(0, 3);
            currData.forEach(function (t, i) {
                    if (LMEPG.Func.isEmpty(t) || t.member_id == 0) {
                        htm += '<img id="focus-' + i + '" src="' + g_appRootPath + '/Public/img/hd/Family/V13/add_icon.png">';
                    } else {
                        htm += '<img id="focus-' + i + '" src="' + g_appRootPath + '/Public/img/hd/Family/V13/member_' + t.member_image_id + '.png">';
                    }
                    if (i == 1) Member.currentFocusMember = t;
                }
            );
            G('member-wrapper').innerHTML = htm;
            G('member-call').innerHTML = Member.currentFocusMember.member_name; // 称呼

            if(!Member.currentFocusMember.inquiry_no_read_total || Member.currentFocusMember.inquiry_no_read_total === '0'){
                G('new-ask-record').style.display = 'none'
            }else {
                G('new-ask-record').style.display = 'block'

            }

            G('new-record').style.display = 'none'
            G('new-record').innerHTML = ''

            Member.curMember = {}
            for(var i=0; i<Member.readeList.length;i++){
                if(Member.readeList[i].memberId == Member.currentFocusMember.member_id){
                    Member.curMember = Member.readeList[i]
                    break
                }
            }
            console.log(Member.curMember,90908)


            if(Member.curMember.newsCount > 0 && JSON.stringify(Member.curMember)!== '{}'){
                G('new-record').style.display = 'block'
                G('new-record').style.backgroundImage = 'url('+g_appRootPath+'/Public/img/hd/Family/V13/icon-new.png)'

            }else if(Member.curMember.abnormalCount > 0 && JSON.stringify(Member.curMember)!== '{}'){
                var nowTime = new Date().getTime()
                var interval = null

                if (Member.curMember.closeTime) {
                    interval = nowTime - new Date(Member.curMember.closeTime).getTime() >= 172800000 //120000
                }

                if ((!Member.curMember.closeTime || interval) && Member.curMember.abnormalCount > 0) {
                    G('new-record').style.display = 'none'
                    G('new-record').style.backgroundImage = 'url(' + g_appRootPath + '/Public/img/hd/Family/V13/icon-new-bg.png)'
                    G('new-record').innerHTML = Member.curMember.abnormalCount
                    G('new-record').style.display = Member.curMember.abnormalCount === 0 ? 'none' : 'block'
                } else {
                    G('new-record').style.display = 'none'
                }
            }

            Member.onFocusChangeUI();

        },

    getData: function (key, success) {
        var params = {
            postData: {
                "key": key,
            },
            path: 'Common/queryData'
        };

        LMEPG.ajax.postAPI(params.path, params.postData, function (res) {
            success(res.result === 0 ? res.val : 0)
        })
    },

    getReadeStatus:function(cb){
        LMEPG.ajax.postAPI('NewHealthDevice/getUserReadeTestStatus', {}, function (res) {
            Member.updateDataCount(function (count) {
                if((res.newData && res.newData >0) || count){
                    Show('data_count_tips')
                    if(count){
                        res.newData+=count
                    }
                    G('data_count').innerHTML =res.newData;
                }else {
                    Hide('data_count_tips');
                }
            })
          console.log(res,99090)
            if(res.code===200){
                cb(res.data)
            }
        })
    },

    /** 显示未归档数据条数 */
    updateDataCount: function (cb) {
        LMEPG.ajax.postAPI('Measure/queryRecordCnt', {}, function (data) {
            var dataCountObj = data instanceof Object ? data : JSON.parse(data);
            if (parseInt(dataCountObj.count) > 0) {
                cb(dataCountObj.count)
            } else {
               cb()
            }
        }, function (error) {
            LMEPG.Log.error("Family updateDataCount error::" + error);
            G('data_count').innerHTML = '0';
        })

    },

    creatPop:function(src){
        var pop=document.createElement('div');
        pop.className = 'pop';
        pop.id='pop';
        pop.innerHTML='<div class="pop-content">' +
            '<div class="pop-head">扫码绑定小程序</div>'+
            '<div class="pop-info">手机微信扫码绑定<span class="spe-info">"39健康私家医生"</span>小程序，您可以：</div>'+
            '<div class="pop-left">' +
            '<div class="item">' +
            '<img src="'+g_appRootPath+'/Public/img/hd/Family/V13/icon-1.png" style="width: 50px;height: 50px;vertical-align: bottom">' +
            '<span>共享电视用户权益</span>'+
            '</div>' +
            '<div class="item">' +
            '<img src="'+g_appRootPath+'/Public/img/hd/Family/V13/icon-2.png" style="width: 50px;height: 50px;vertical-align: bottom">' +
            '<span>随时随地在线问医</span>'+
            '</div>' +
            '<div class="item">' +
            '<img src="'+g_appRootPath+'/Public/img/hd/Family/V13/icon-3.png" style="width: 50px;height: 50px;vertical-align: bottom">' +
            '<span>快捷管理健康数据</span>'+
            '</div>' +
            '</div>'+
            '<div class="pop-right">' +
            '<img src="'+src+'" class="qr" id="qr-f" style="width: 200px;height: 200px">' +
            '</div>'+
            '</div>'
        document.body.appendChild(pop)
    },

    getQRCode:function(flag){
        LMEPG.UI.showWaitingDialog()
        var data =JSON.stringify({
            carrierId:RenderParam.carrierId,
            nikeName:RenderParam.accountId,
            userId:RenderParam.userId,
            QRCodeType:10000
        })

        LMEPG.ajax.postAPI('NewHealthDevice/getDeviceQR', {
            type:10002,
            payload:data
        }, function (data) {
            LMEPG.UI.dismissWaitingDialog()
            if(data.data.code === 200){
                if(flag){
                    G('qr-f').src = Member.filterUrl() + "cws/api/fs/index.php?img_url=" + data.data.qrUrl
                }else {
                    var url = Member.filterUrl() + "cws/api/fs/index.php?img_url=" + data.data.qrUrl
                    Member.creatPop(url)
                }

                timer = setInterval(function () {
                    Member.exchangeCode(data.data.scene)
                },5000)

            }
        })
    },

    filterUrl:function(){
        var urlIndex = RenderParam.cwsHlwyyUrl.indexOf('cws');
        return RenderParam.cwsHlwyyUrl.substr(0,urlIndex)
    },

    exchangeCode:function(scene){
        LMEPG.ajax.postAPI('NewHealthDevice/checkQRStatus', {
            'scene':scene
        },function (res) {
            if(res.data.code === 200){
                delNode('pop')
                clearInterval(timer)
            }else if(res.data.code===401 || res.data.code === 403){

                clearInterval(timer)
                Member.getQRCode(true)
            }
            console.log(res)
        })
    },
        onFocusChangeUI: function () {
            if (Member.currentFocusMember.member_image_id == 0) {
                H('btn-jump-action');// 隐藏添加按钮
                LMEPG.BM.getButtonById('focus-1').nextFocusDown = '';
            } else {
                S('btn-jump-action'); // 显示成员按钮
                if (RenderParam.isShowTestRecord === '1')
                    LMEPG.BM.getButtonById('focus-1').nextFocusDown = 'test-record';
                else
                    LMEPG.BM.getButtonById('focus-1').nextFocusDown = 'ask-doctor-record';
            }
        },
        /*更新成员数组*/
        updateMemberArray: function (key) {
            if (key == 'left') {
                RenderParam.memberInfo.list.unshift(RenderParam.memberInfo.list.pop());
            } else {
                RenderParam.memberInfo.list.push(RenderParam.memberInfo.list.shift());
            }
        }
        ,
        getCurPageObj: function () {
            var objCurrent = LMEPG.Intent.createIntent('familyEdit');
            objCurrent.setParam('focusId', LMEPG.BM.getCurrentButton().id);
            if (RenderParam.carrierId=='110052') {
                objCurrent.setParam('comeFrom',RenderParam.comeFrom);
            }
            objCurrent.setParam('isFirst',false);
            objCurrent.setParam('memberID', Member.currentFocusMember.member_id);
            return objCurrent;
        }
        ,
        /**
         * 跳转添加、编辑页面
         */
        jumpMemberEditPage: function (btn) {
            var curObj = Member.getCurPageObj();
            var dstObj = LMEPG.Intent.createIntent('familyMembersEdit');
            var memberId = Member.currentFocusMember.member_id;
            if (!+memberId) {
                dstObj.setParam('actionType', 1); // 添加
                curObj.setParam('isAddMember', true);
            } else {
                dstObj.setParam('actionType', 2); // 编辑
                dstObj.setParam('memberID', memberId);
            }
            if (RenderParam.carrierId=='110052') {
                dstObj.setParam('comeFrom',RenderParam.comeFrom);
            }
            LMEPG.Intent.jump(dstObj, curObj);
        }
        ,
        createBtns: function () {
            this.buttons.push({
                id: 'focus-1',
                name: '家庭成员',
                type: 'div',
                nextFocusUp: 'data-archiving',
                nextFocusDown: RenderParam.isShowTestRecord === '1' ? 'test-record' : "ask-doctor-record",
                focusImage: RenderParam.platformType == 'sd' ? g_appRootPath + '/Public/img/sd/Unclassified/V13/btn_member_f.png' : g_appRootPath + '/Public/img/hd/Family/V13/member_radius_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Common/transparent.png',
                click: this.jumpMemberEditPage,
                focusChange: this.onFocusChangeUI,
                beforeMoveChange: this.onBeforeMoveSwitchMember
            }, {
                id: 'data-archiving',
                name: '数据归档',
                type: 'img',
                nextFocusDown: 'focus-1',
                nextFocusLeft:'bind-code',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V13/data_archiving_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/data_archiving.png',
                click: this.jumpDataArchiving,
                focusChange: '',
                beforeMoveChange: ''
            }, {
                id: 'bind-code',
                name: '绑定二维码',
                type: 'img',
                nextFocusDown: 'focus-1',
                nextFocusRight:'data-archiving',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V13/bind-btn-f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/bind-btn.png',
                click: this.openQRCode,
                focusChange: '',
                beforeMoveChange: ''
            },{
                id: 'ask-doctor-record',
                name: '问医记录',
                type: 'img',
                nextFocusUp: RenderParam.isShowTestRecord === '1'? 'test-record' : 'focus-1',
                nextFocusDown: '',
                focusImage: RenderParam.carrierId==='110052'?g_appRootPath + '/Public/img/hd/Family/V13/ask_record_f_cihai.png':g_appRootPath + '/Public/img/hd/Family/V13/ask_record_f.png',
                backgroundImage: RenderParam.carrierId==='110052'?g_appRootPath + '/Public/img/hd/Family/V13/ask_record_cihai.png':g_appRootPath + '/Public/img/hd/Family/V13/ask_record.png',
                click: this.jumpDoctorRecord,
                focusChange: '',
                beforeMoveChange: this.onBeforeMoveSwitchMember
            }, {
                id: 'test-record',
                name: '检测记录',
                type: 'img',
                nextFocusUp: 'focus-1',
                nextFocusDown:'ask-doctor-record',
                focusImage: g_appRootPath + '/Public/img/hd/Family/V13/test_record_f.png',
                backgroundImage: g_appRootPath + '/Public/img/hd/Family/V13/test_record.png',
                click: this.jumpHealthTestRecord,
                focusChange: '',
                beforeMoveChange: this.onBeforeMoveSwitchMember
            });
            this.initButtons('');
        }
        ,
        initButtons: function (id) {
            LMEPG.ButtonManager.init(id, this.buttons, '', true);
        }
        ,
    moveToFocus: function (id) {
        LMEPG.ButtonManager.requestFocus(id);
    },

    openQRCode: function () {
        Member.getQRCode()
    },

        /**
         * 初始化数据，数据最多8条，不足5条时，用空数据补一条，代表添加+
         */
        initData: function () {
            if (RenderParam.memberInfo.result != 0) {
                LMEPG.UI.showToast('数据获取失败');
                return;
            }

            var curLen = RenderParam.memberInfo.list.length;
            if (curLen < 5) {
                RenderParam.memberInfo.list.unshift({member_id: 0, member_name: '请添加家庭成员', member_image_id: 0});
                if (curLen == 0) {
                    RenderParam.memberInfo.list.push({member_id: 0, member_name: '请添加家庭成员', member_image_id: 0});
                    RenderParam.memberInfo.list.push({member_id: 0, member_name: '请添加家庭成员', member_image_id: 0});
                } else if (curLen == 1) {
                    RenderParam.memberInfo.list.push({member_id: 0, member_name: '请添加家庭成员', member_image_id: 0});
                }
            } // 0代表空数据

            // 数据恢复
            var loopCount = RenderParam.memberInfo.list.length;
            if (!LMEPG.Func.isEmpty(RenderParam.memberID)) {
                while (loopCount--) {
                    if (RenderParam.memberInfo.list[1].member_id == RenderParam.memberID) {
                        break;
                    } else {
                        this.onBeforeMoveSwitchMember('right');
                    }
                }
                // 如果是从添加页面返回，焦点到最新添加成员上
                /*if (!LMEPG.Func.isEmpty(RenderParam.isAddMember)) {
                    this.onBeforeMoveSwitchMember('left');
                }*/
            }

             this.updateMemberUI(); // 显示数据
             //this.updateDataCount(); // 显示未归档数据条数
        }
        ,

        /**
         * 跳转到视频问诊记录详情
         */
        jumpDoctorRecord: function (btn) {
            var curObj = Member.getCurPageObj(btn);
            var dstObj = LMEPG.Intent.createIntent('doctorRecordDetail');
            dstObj.setParam('memberID', RenderParam.memberInfo.list[1].member_id);
            dstObj.setParam('memberName', RenderParam.memberInfo.list[1].member_name);
            dstObj.setParam('memberObj', JSON.stringify(RenderParam.memberInfo.list[1]));
            dstObj.setParam('isArchived', 1); // 1-已归档 0-未归档
            dstObj.setParam('comeFrom',RenderParam.comeFrom);
            LMEPG.Intent.jump(dstObj, curObj);
        }
        ,

        /**
         * 跳转数据归档页面
         */
        jumpDataArchiving: function (btn) {
            var curObj = Member.getCurPageObj(btn);
            var dstObj = LMEPG.Intent.createIntent('healthTestArchivingList');
            dstObj.setParam('showAskDoctorTab', 0); // 是否显示归档页面的问医记录Tab
            if (RenderParam.carrierId=='110052') {
                dstObj.setParam('comeFrom',RenderParam.comeFrom);
            }
            LMEPG.Intent.jump(dstObj, curObj);
        },

        /**
         * 跳转健康检测记录
         */
        jumpHealthTestRecord: function (btn) {
            var curObj = Member.getCurPageObj(btn);
            var dstObj = LMEPG.Intent.createIntent('testList');
            dstObj.setParam('member_id', RenderParam.memberInfo.list[1].member_id);
            dstObj.setParam('member_name', RenderParam.memberInfo.list[1].member_name);
            dstObj.setParam('member_image_id', RenderParam.memberInfo.list[1].member_image_id);
            dstObj.setParam('member_gender', RenderParam.memberInfo.list[1].member_gender);
            dstObj.setParam('testType', 5);
            dstObj.setParam('unusualItems', JSON.stringify(RenderParam.memberInfo.list[1]))
            LMEPG.Intent.jump(dstObj, curObj);
        },
    };
var onBack = function () {
    if(G('pop')){
        delNode('pop')
        clearInterval(timer)
    }else {
        LMEPG.Intent.back();
    }

};
