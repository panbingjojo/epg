(function (w) {

    function Carousel(data,id) {
        this.data = data;
        this.id = id
        this.max = data.length
        this.current = 0
        this.timer = null
    }

    Carousel.prototype.start = function(){
        var that = this
        var ele = G(this.id).children
        var point = ele[2].children

        this.timer = setInterval(function () {
            that.current++
            if(that.current>= that.max){
                that.current = 0
            }

            ele[0].src = RenderParam.fsUrl + that.data[that.current].img_url

            var mark =that.data[that.current].inner_parameters ? JSON.parse(that.data[that.current].inner_parameters).cornermark.img_url : ''
            G('carousel-icon').src =mark ? RenderParam.fsUrl+mark : ""

            for(var j=0;j<point.length;j++){
                point[j].src = '/Public/img/hd/Home/V29/carousel-circle.png'
            }

            point[that.current].src = '/Public/img/hd/Home/V29/carousel-circle-c.png'

        },2500)
    }

    Carousel.prototype.stop = function(){
        clearInterval(this.timer)
    }

    Carousel.prototype.getCurrentData = function(){
        return this.current
    }

    w.Carousel = Carousel
})(window)