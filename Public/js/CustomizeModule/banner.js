;(function (win, doc, util) {
    win.Banner = function (data, imageId_1, imageId_2, dotIdPrefix) {
        this.data = data;
        this.showImage = document.getElementById(imageId_1);
        this.hideImage = document.getElementById(imageId_2);
        this.dotIdPrefix = dotIdPrefix;
        this.activeImageIdx = 0;
        this.timer = null;
        //this.$ = id => doc.getElementById(id);
    };

    Banner.prototype.start = function () {
        var _this = this;
        this.stop();
        this.timer = setInterval(function () {
            _this.update()
        }, RenderParam.carrierId != "440004" ? 4333 : 6000);
    };

    Banner.prototype.stop = function () {
        clearInterval(this.timer);
    };

    Banner.prototype.update = function () {
        if (this.data && this.data.length > 1) {
            this.changeElement();
            this.render();
            this.switchDot();
            this.data.push(this.data.shift());
            this.shuffle();
        }
    };

    Banner.prototype.changeElement = function () {
        var prevElement = this.showImage;
        this.showImage = this.hideImage;
        this.hideImage = prevElement;
    };

    Banner.prototype.render = function () {
        var _this = this;
        util.fade(_this.hideImage, 1, 50, function () {
            _this.hideImage.src = _this.data[1].src;
            _this.activeImageIdx = _this.data[0].id;
        });

        util.fade(_this.showImage, 0, 50);
    };

    Banner.prototype.switchDot = function () {
        document.getElementById(this.dotIdPrefix + this.data[0].id).removeAttribute('class');
        document.getElementById(this.dotIdPrefix + this.data[1].id).setAttribute('class', 'focus');
    };

    Banner.prototype.shuffle = function () {
        var data = this.data;
        var id = data[0].id;
        data.sort(function (a, b) {
            var sum = a.id - b.id;
            if (id === data.length - 1) {
                return -sum;
            } else if (id === 0) {
                return sum;
            }
        });
    };

    Banner.prototype.renderDots = function (dotsWrapId) {
        var htm = '';
        var len = this.data.length;

        while (len--) {
            var cls = len === 0 ? 'focus' : '';
            var occupy = '/Public/img/hd/Common/transparent.png';
            htm = '<img src="' + occupy + '" id="' + this.dotIdPrefix + len + '" class="' + cls + '">' + htm;
        }

        doc.getElementById(dotsWrapId).innerHTML = htm;
    };
}(window, document, LMEPG.Func));