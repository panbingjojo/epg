/**
 * ---------------------------------------
 * 分页组件
 * --------------------------------------
 * 只负责分配、管理页面数据,不支持回调接口
 * 使用的时候请设置回调
 * 设置必要的回调:
 * setOnCreateItemHtmlCallback
 * setOnPageChangeCallback
 * @param data  数据源
 * @param _row  每一行的个数
 * @param _column 每一列的个数
 * @constructor
 */
function Pagination(_data,_row,_column) {
    this.data = _data;
    this.row = _row;
    this.column = _column;
    this.currentPage = 0;
    this.currentFocusPosition = 0;
    this.currentPageFocusPosition = 0;
    this.currentPageFocusRow = 0;
    this.currentPageFocusColumn = 0;
    this.pageCount = 0;
    this.count = 0;
    this.onPageChangeCallback = null;
    this.createItemHtmlCallback = null;
    this.onFocusChangeCallback = null;
    this.init();
}

/**
 * 初始化,确定总的有多少页
 */
Pagination.prototype.init = function () {
    var that = this;
    that.pageCount = that.getPageCount();
}

/**
 * 设置显示第几页
 */
Pagination.prototype.setCurrentPage = function (_pageIndex) {
    var that = this;
    that.currentPage = _pageIndex;
    that.renderPage(that.currentPage)
}

/**
 * 设置第几个获得焦点，及选中第几个元素
 */
Pagination.prototype.setCurrentFocusPosition = function (_position) {
    var that = this;
    if(_position >= 0 && _position < this.getCount()){
        that.currentFocusPosition = _position;
        that.currentPageFocusPosition = _position-(this.currentPage * that.getPageSize());
        that.currentPageFocusRow = Math.floor(that.currentPageFocusPosition/that.column);
        that.currentPageFocusColumn = Math.floor(that.currentPageFocusPosition%that.column);
        if(that.onFocusChangeCallback != null && typeof that.onFocusChangeCallback == 'function'){
            that.onFocusChangeCallback(that.currentFocusPosition)
        }
    }
}

//获取当前选中第几个元素
Pagination.prototype.getCurrentFocusPosition = function () {
    return this.currentFocusPosition;
}

/**
 * 上一页
 */
Pagination.prototype.prevPage = function () {
    var that = this;
    if(that.currentPage - 1 >= 0){
        that.currentPage -= 1;
        that.renderPage(that.currentPage)
    }
}
/**
 * 下一页
 */
Pagination.prototype.nextPage = function () {
    var that = this;
    if(that.currentPage + 1 < that.pageCount){
        that.currentPage += 1;
        that.renderPage(that.currentPage)
    }
}

/**
 * 设置页面切换回调
 * @param _onPageChangeCallback
 */
Pagination.prototype.setOnPageChangeCallback = function (_onPageChangeCallback) {
    this.onPageChangeCallback = _onPageChangeCallback;
}

/**
 * 设置页面切换回调
 * @param _onPageChangeCallback
 */
Pagination.prototype.setOnFocusChangeCallback = function (_onFocusChangeCallback) {
    this.onFocusChangeCallback = _onFocusChangeCallback;
}

/**
 * 设置页面渲染回调
 * @param _createItemHtmlCallback
 */
Pagination.prototype.setOnCreateItemHtmlCallback = function (_createItemHtmlCallback) {
    this.createItemHtmlCallback = _createItemHtmlCallback;
}

/**
 * 渲染某一个页面
 * @param _pageIndex
 */
Pagination.prototype.renderPage = function (_pageIndex) {
    var that = this;
    if(_pageIndex < 0 || _pageIndex >= that.pageCount)
        return;
    var html = '';
    if(that.createItemHtmlCallback != null && typeof that.createItemHtmlCallback == 'function'){
        var index = _pageIndex * that.getPageSize()
        var length = (_pageIndex + 1) * that.getPageSize() <= that.getCount() ? (_pageIndex + 1) * that.getPageSize() : (_pageIndex * that.getPageSize() + that.getCount()%that.getPageSize());
        for (var i = index; i < length; i++) {
            var item = that.getItem(i);
            var pagePosition = i-(_pageIndex * that.getPageSize());
            var rowIndex = Math.floor(pagePosition/that.column);
            var columnIndex = Math.floor(pagePosition%that.column);
            html += that.createItemHtmlCallback(that.currentPage,that.pageCount,i,item,rowIndex,columnIndex,pagePosition);
        }
    }
    if(that.onPageChangeCallback != null && typeof that.onPageChangeCallback == 'function'){
        that.onPageChangeCallback(that.currentPage,that.pageCount,html)
    }
}

/**
 * 获取一页总的个数
 * @returns {number} 一页总的个数
 */
Pagination.prototype.getPageSize = function () {
    return this.row*this.column;
}

/**
 * 获取总的页数
 * @returns {number} 总页数
 */
Pagination.prototype.getPageCount = function () {
    var that = this;
    if(that.data == null){
        return 0;
    }
    var count = that.getCount();
    var pageCount = Math.ceil(count/(that.row*that.column));
    return pageCount;
}

/**
 * 获取当前的数据源
 * @returns {number}
 */
Pagination.prototype.getItem = function (index) {
    return this.data[index];
}

/**
 * 获取总的个数
 * @returns {number}
 */
Pagination.prototype.getCount = function () {
    if(this.data instanceof Array){
        return this.data.length;
    }
    return 0;
}

//键盘移动-焦点移动方案
Pagination.prototype.onMoveChange = function (key) {
    var position = -1;
    if(key === 'up'){
        position = this.getNextFocusUpPostion(this.currentFocusPosition,this.currentPageFocusRow,this.currentPageFocusColumn);
    }else if(key === 'down'){
        position = this.getNextFocusDownPostion(this.currentFocusPosition,this.currentPageFocusRow,this.currentPageFocusColumn);
    }else if(key === 'left'){
        position = this.getNextFocusLeftPostion(this.currentFocusPosition,this.currentPageFocusRow,this.currentPageFocusColumn);
    }else if(key === 'right'){
        position = this.getNextFocusRightPostion(this.currentFocusPosition,this.currentPageFocusRow,this.currentPageFocusColumn);
    }
    if(position > -1 && position < this.getCount()){
        this.setCurrentFocusPosition(position);
        return true
    }
    return false;
}

Pagination.prototype.getNextFocusUpPostion = function (position,row,column) {
    if(row > 0 && row < this.row){
        //不在第一行,则返回在上一行的同一列的元素
        return position - this.column;
    }
    return -1;
}

Pagination.prototype.getNextFocusDownPostion = function (position,row,column) {
    if(row > -1 && row < this.getCurrentPageRowCount() - 1){
        //不在最后一行,则返回在下一行的同一列的元素
        var count = (this.currentPage) * this.getPageSize()
        count += ((row+1)*this.column + column);
        if(count <= this.getCount()){
            return position + this.column;
        }
    }
    return -1;
}

//向左的时候涉及到翻页需要考虑进去
Pagination.prototype.getNextFocusLeftPostion = function (position,row,column) {
    if(column == 0){
        if(this.currentPage > 0){
            //第一列，并且不是第一页,则翻页,到上一页的同一行的最后一个
            this.prevPage();
            return position - this.column * (this.row - 1) - 1;
        }
    }else{
        return position - 1;
    }
    return -1;
}

//向右的时候涉及到翻页需要考虑进去
Pagination.prototype.getNextFocusRightPostion = function (position,row,column) {
    if(column == (this.getCurrentRowColumnCount(position,row,column) -1)){
        if(this.currentPage < this.getPageCount() - 1){
            //最后一列，并且不是最后一页,则翻页,到下一页的同一行的第一个
            var nextPageRowCount = this.getPageRowCount(this.currentPage + 1)
            this.nextPage();
            if(nextPageRowCount >= row + 1){
                return position + this.column * (this.row - 1) + 1
            }else{
                //默认去到最后一行的第一个
                return position + this.column * (this.row - row - 1 + nextPageRowCount - 1) + + 1
            }
        }
    }else{
        return position + 1;
    }
    return -1;
}

Pagination.prototype.getPageRowCount = function (_pageIndex) {
    if(this.isFullPage(_pageIndex)){
        return this.row;
    }else{
        var count = this.getCount() - (_pageIndex) * this.getPageSize()
        return Math.ceil(count/this.column) ;
    }
}

//获取当前页面有多少行
Pagination.prototype.getCurrentPageRowCount = function () {
    return this.getPageRowCount(this.currentPage);
}

//获取当前行的列个数
Pagination.prototype.getCurrentRowColumnCount = function (position,row,column) {
    if(this.isFullRow(position,row,column)){
        return this.column;
    }else{
        var count = this.getCount() - (this.currentPage) * this.getPageSize()
        return count%this.column ;
    }
}

//判断当前页是否撑满
Pagination.prototype.isFullPage = function (_pageIndex) {
    var count = (_pageIndex+1) * this.getPageSize();
    return count <= this.getCount();
}

//判断当前行是否撑满
Pagination.prototype.isFullRow = function (position,row,column) {
    if(this.isFullPage(this.currentPage)){
        return true;
    }else{
        var count = (this.currentPage) * this.getPageSize();
        count += (row+1)*this.column;
        return count <= this.getCount();
    }
}







