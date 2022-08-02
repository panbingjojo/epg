//当前文档用于通过手机控制远端业务操作实现方案
var mouseEventV = {
    onClick: function (elemEvent) {
        var pressBtn = LMEPG.ButtonManager.getButtonById(elemEvent.srcElement.id);
        if (pressBtn == null)
            return;
        LMEPG.ButtonManager.requestFocus(pressBtn.id);

        LMEPG.call(pressBtn.click, [pressBtn]);
    },
    onWheel: function (elemEvent) {
        // console.log("event--",elemEvent);
        var currBtn = null;
        var newBtn = null;

        var pressBtn = LMEPG.ButtonManager.getButtonById(elemEvent.srcElement.id);

        if (pressBtn == null)
            return;

        if (elemEvent.deltaY > 0) {
            currBtn = LMEPG.ButtonManager.getCurrentButton();
            newBtn = LMEPG.ButtonManager.getNearbyFocusButton("down", currBtn);
            LMEPG.ButtonManager._onMoveChange("down");
        } else if (elemEvent.deltaY < 0) {
            currBtn = LMEPG.ButtonManager.getCurrentButton();
            newBtn = LMEPG.ButtonManager.getNearbyFocusButton("up", currBtn);
            LMEPG.ButtonManager._onMoveChange("up");
        }
        if(!!newBtn)
            LMEPG.ButtonManager.requestFocus(newBtn.id);
        // LMEPG.call(pressBtn.click, [pressBtn]);
    },
    onMove: function (elemEvent) {
        var pressBtn = LMEPG.ButtonManager.getButtonById(elemEvent.srcElement.id);
        if (pressBtn == null)
            return;
        LMEPG.ButtonManager.requestFocus(pressBtn.id);
    },
};

var touchEventV = {
    onClick: function (elemEvent) {
        var pressBtn = LMEPG.ButtonManager.getButtonById(elemEvent.target.id);
        if (pressBtn == null)
            return;
        LMEPG.ButtonManager.requestFocus(pressBtn.id);

        LMEPG.call(pressBtn.click, [pressBtn]);
    },
    onWheel: function (deltaX,deltaY,id) {
        var currBtn = null;
        var newBtn = null;

        var pressBtn = LMEPG.ButtonManager.getButtonById(id);
        if (pressBtn == null)
            return;
        if (deltaY > 0) {
            currBtn = pressBtn;
            newBtn = LMEPG.ButtonManager.getNearbyFocusButton("down", currBtn.id);
            LMEPG.ButtonManager._onMoveChange("up");
        } else if (deltaY < 0) {
            currBtn = pressBtn;
            newBtn = LMEPG.ButtonManager.getNearbyFocusButton("up", currBtn.id);
            LMEPG.ButtonManager._onMoveChange("down");
        }
        if(!!newBtn)
            LMEPG.ButtonManager.requestFocus(newBtn.id);
        // LMEPG.call(pressBtn.click, [pressBtn]);
    },
    onMove: function (elemEvent) {
        var pressBtn = LMEPG.ButtonManager.getButtonById(elemEvent.target.id);
        if (pressBtn == null)
            return;
        LMEPG.ButtonManager.requestFocus(pressBtn.id);
    },
};
var touchSlider = {
    //判断设备是否支持touch事件
    touch:('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    docnt:document,
    //事件
    events:{
        index:0,     //显示元素的索引
        touchEvent:touchEventV,
        slider:document,
        isScrolling:0,
        endPos:null,
        startPos:null,
        curButton:null,
        handleEvent:function(event){
            var self = this;
            if(event.type == 'touchstart'){
                self.start(event);
            }else if(event.type == 'touchmove'){
                self.move(event);
            }else if(event.type == 'touchend'){
                self.end(event);
            }
        },
        //滑动开始
        start:function(event){
            var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
            //touch.target.id //需要移动的控件

            this.curButton = LMEPG.ButtonManager.getButtonById(touch.target.id);
            if (this.curButton !== null){
                LMEPG.ButtonManager.requestFocus(this.curButton.id);
            }

            this.startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    //取第一个touch的坐标值
            this.isScrolling = 'none';   //
            this.slider.addEventListener('touchmove',this,false);
            this.slider.addEventListener('touchend',this,false);
        },
        //移动
        move:function(event){
            //当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if(event.targetTouches.length > 1 || event.scale && event.scale !== 1)
                return;
            var touch = event.targetTouches[0];
            this.endPos = {deltaX:touch.pageX - this.startPos.x,deltaY:touch.pageY - this.startPos.y};
            this.isScrolling = Math.abs(this.endPos.deltaX) > Math.abs(this.endPos.deltaY) ? 'H':'V';    //isScrolling为1时，表示纵向滑动，0为横向滑动
            // event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
            switch (this.isScrolling) {
                case 'H'://横向滑动
                    if(this.endPos.deltaX < 0){
                        //向左移动
                    }else{
                        //向右移动
                    }
                    break;
                case 'V'://纵向滑动
                    //this.touchEvent.onWheel(this.endPos.deltaX,this.endPos.deltaY,touch.target.id);
                    if(this.endPos.deltaY < 0){
                        //向上移动
                    }else{
                        //向下移动
                    }
                    break;
            }
        },
        //滑动释放
        end:function(event){
            // console.log("touch_end:",event);
            // document.writeln("<p>end</p>>");
            var duration = new Date - this.startPos.time;    //滑动的持续时间
            if (this.isScrolling === 'none') {    //如果没有滚动，定义为点击事件
                this.touchEvent.onClick(event);
            }else if (this.isScrolling === 'V'){
                //纵向滚动
                if(!!this.curButton)
                    this.touchEvent.onWheel(this.endPos.deltaX,this.endPos.deltaY,this.curButton.id);
            }else if (this.isScrolling === 'H'){
                //横向滚动
            }
            //解绑事件
            this.slider.removeEventListener('touchmove',this,false);
            this.slider.removeEventListener('touchend',this,false);
        }
    },

    //初始化
    init:function(){
        var self = this;     //this指slider对象
        if(!!self.touch)
            self.docnt.addEventListener('touchstart',self.events,false);    //addEventListener第二个参数可以传一个对象，会调用该对象的handleEvent属性
    }
};




if(window.debug == false){
    touchSlider.init();
    document.onclick = mouseEventV.onClick;
    document.onmousewheel = mouseEventV.onWheel;
    document.onmousemove = mouseEventV.onMove;
}










