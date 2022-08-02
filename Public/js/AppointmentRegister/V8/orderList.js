var buttons = []

var Home = {
    init:function (){
        this.getList(function (res){
            var html = ''
            if(res.length === 0){
                G('tips').style.display = 'block';
                LMEPG.BM.init('',buttons,true)
            }else {
                for (var i = 0;i<res.length;i++){
                    html+=' <div class="order-item" id="order-'+i+'">\n' +
                        '       <div class="info">预约专家：'+res[i].doctorName+'</div>\n' +
                        '       <div class="info">预约医院：'+res[i].hospitalName+'</div>\n' +
                        '       <div class="info">就诊时间：'+res[i].time+'</div>\n' +
                        '       <div class="info">当前状态：'+(res[i].order_state ==="0"?'已取消':'预约成功')+'</div>\n' +
                        '   </div>'

                    buttons.push({
                        id: 'order-'+i,
                        type: 'div',
                        nextFocusLeft: '',
                        nextFocusRight: '',
                        nextFocusUp: 'order-'+(i-1),
                        nextFocusDown: 'order-'+(i+1),
                        backgroundImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/order-list-no-choose.png',
                        focusImage: g_appRootPath + '/Public/img/hd/AppointmentRegister/V8/order-list-choose.png',
                        click: Home.chooseOrder,
                        focusChange:'',
                        beforeMoveChange: '',
                        moveChange:Home.turnPage,
                        info:JSON.stringify(res[i]),
                        backIndex:i
                    })
                }

                if(res.length % 2 !==0){
                    html+='<div style="height: 240px"></div>'
                }

                G('list').innerHTML = html;
                G('list').style.display = 'block';

                var scrollIndex = RenderParam.backIndex<2?0:parseInt(RenderParam.backIndex / 2)
                G('list').scrollTop = 500*scrollIndex

                LMEPG.BM.init('order-'+RenderParam.backIndex,buttons,true)
            }

        })
    },


    getList:function (success){
        LMEPG.UI.showWaitingDialog()
        var data = {
            "functionid":"20001",
            "data":{},
        };

        LMEPG.ajax.postAPI('Expert/appointmentInterface',data,function (res){
            LMEPG.UI.dismissWaitingDialog()
            success(res.data)
        });

    },

    chooseOrder:function (btn){
        var curPage = LMEPG.Intent.createIntent("xinjiang-order-list");
        var toPage = LMEPG.Intent.createIntent("xinjiang-order-cancel");

        toPage.setParam('info',btn.info)
        curPage.setParam('backIndex',btn.backIndex)

        LMEPG.Intent.jump(toPage,curPage);
    },

    turnPage:function (pre,cur,dir){
        if(dir === 'down'){
            if(Home.getX(cur.id) % 2 === 0){
                G('list').scrollTop += 500
            }

        }else if(dir === 'up'){
            if(Home.getX(pre.id) % 2 === 0){
                G('list').scrollTop -= 500
            }
        }
    },

    getX:function (x){
        var num = x.indexOf('-')
        return parseInt(x.substring(num+1))
    },

}


