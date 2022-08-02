/**
 * ---------------------------------------
 * 横向滚动控件
 * --------------------------------------
 * 只负责分配、管理页面数据,不支持回调接口
 * 使用的时候请设置回调
 * 设置必要的回调:
 * setOnCreateItemHtmlCallback
 * setOnPageChangeCallback
 * @param _data  数据源
 * @param _size  一行的个数
 * @constructor
 */
function HorizontalScroller(_data,_size) {
    this.data = _data;
    this.data = _size;
    this.count = 0;
    this.currentPosition = 0;
    this.focusPosition = 0;
}

/**
 * 初始化
 */
Pagination.prototype.init = function () {
    var that = this;
    that.count = that.data.length;
}

/**
 * 设置选中第几个
 */
Pagination.prototype.setCurrentPosition = function (_position) {
    var that = this;
    if(_position > -1 && _position < that.count){
        that.currentPosition = _position;
    }
}