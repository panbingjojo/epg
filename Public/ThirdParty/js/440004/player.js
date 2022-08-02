function VideoPlayer(_width, _height, _left, _top) {
    this.width = _width;
    this.height = _height;
    this.left = _left;
    this.top = _top;
    this._playUrl = "";
    this._sessionId = "";
    this._viewId = "";
    this.range = "0.0-";
    this.scale = "1.0";
    this.loop = false;
    this._selectionStart = "";
    this.showType = false;

}

VideoPlayer.prototype._createPlayer = function () {
    var that = this;
    Bridge("CreatePlayer",
        {"showType": this.showType, "width": this.width, "height": this.height, "left": this.left, "top": this.top},
        function (_jsonText) {
            try {
                LMEPG.Log.info('[440004][player.js]---[create play]--->_json: ' + _jsonText);
                var result = JSON.parse(_jsonText);
                that._viewId = result.message;
                that._setVideoUrl();
                that._registerOnPlayComplete();
            } catch (e) {
                alert(e.stack);
                //TODO handle the exception
            }

        }
    );
};

VideoPlayer.prototype._registerOnPlayComplete = function () {
    var that = this;
    Bridge("OnPlayComplete",
        {"viewId": this._viewId},
        function (_jsonText) {
            LMEPG.Log.info('[440004][player.js]---[onPlayComplete result]--->_json: ' + _jsonText);
            var result = JSON.parse(_jsonText);
            if (result.code == 1) {

                if (that.loop) {
                    console.log("loop play skip to begin!!");
                    that.play(that._selectionStart);
                }
            } else {
                console.log("onPlayComplete error code = " + result.code + " msg=" + result.message);
            }
        }
    );
};


VideoPlayer.prototype._setVideoUrl = function () {
    var that = this;
    Bridge("SetVideoUrl",
        {"viewId": this._viewId, "playUrl": this._playUrl, "clientSessionId": this._sessionId},
        function (_jsonText) {
            that._videoViewPlay();
            console.log("setVideoUrl result:" + _jsonText);
            LMEPG.Log.info('[440004][player.js]---[setVideoUrl result]--->_json: ' + _jsonText);
        }
    );
};

VideoPlayer.prototype._videoViewPlay = function () {
    var that = this;
    Bridge("PlayVideo",
        {
            "viewId": this._viewId,
            "clientSessionId": this._sessionId,
            "range": this.range,
            "scale": this.scale,
            "isLoop": this.loop
        },
        function (_jsonText) {
            console.log("playVideo result:"+_jsonText);
            LMEPG.Log.info('[440004][player.js]---[playVideo result]--->_json: ' + _jsonText);
            that._setVideoViewBottom();
        }
    );
};

VideoPlayer.prototype._setVideoViewBottom = function () {
    Bridge(
        "SetVideoOnBottom",
        {"onBottom": true},
        function (_json) {
            LMEPG.Log.info('[440004][player.js]---[_setVideoViewBottom]--->_json: ' +_json);
        }
    );
};

VideoPlayer.prototype.pause = function () {
    Bridge(
        "PauseVideo",
        {
            "viewId": this._viewId, "clientSessionId": this._sessionId
        },
        function (_jsonText) {
            console.log("pauseVideo result:" + _jsonText);
        }
    );
};

VideoPlayer.prototype.getPlayPosition = function (callbackH) {
    var _viewId = this._viewId;
    Bridge(
        "GetPlayCurrentPosition",
        {
            "viewId": _viewId
        },
        function (_jsonText) {
            LMEPG.Log.info('[440004][player.js]---[getPlayPosition]--->_viewId: ' + _viewId);
            LMEPG.Log.info('[440004][player.js]---[getPlayPosition]--->_jsonText: ' +_jsonText);
            var result = JSON.parse(_jsonText);
            if (result.code == 1) {
                if (typeof result.message === 'string') {
                    var durationTemp = parseInt(result.message + "");
                    if (!isNaN(durationTemp)) result.message = durationTemp;
                }
                callbackH(result.message);
            } else {
                callbackH(-1);
            }
        }
    );
};


VideoPlayer.prototype.resume = function () {
    Bridge(
        "ResumeVideo",
        {
            "viewId": this._viewId, "clientSessionId": this._sessionId
        },
        function (_jsonText) {
            console.log("resumeVideo result:" + _jsonText);
        }
    );
};


VideoPlayer.prototype.tearDown = function () {
    Bridge(
        "TearDownVideo",
        {
            "viewId": this._viewId, "clientSessionId": this._sessionId
        },
        function (_jsonText) {
            console.log("pauseVideo result:" + _jsonText);
        }
    );
};

VideoPlayer.prototype.fullScreen = function (showtype) {
    var that = this;
    Bridge(
        "ResizeVideo",
        {
            "viewId": this._viewId,
            "showType": showtype,
            "width": this.width,
            "height": this.height,
            "left": this.left,
            "top": this.top
        },
        function (_jsonText) {
            that.showType = showtype;
            console.log("resizeVideo result:" + _jsonText);
        }
    );
};

VideoPlayer.prototype.playIP = function (surl) {
    var that = this;
    LMEPG.Log.info('[440004][player.js]---[play]--->surl: ' + surl);
    this._getPlayUrl(surl, function (playUrl) {
        if (playUrl != undefined && playUrl != null) {
            LMEPG.Log.info('[440004][player.js]---[play]--->playUrl: ' + playUrl);
            try {
                // playUrl = "http://172.16.149.220:8070/vod/11064_MOVE2019122615120934_4500.m3u8?sig=d568011ee40013069339543f233ae49a&expires=1627570292&c=1524001202800080849&volume=Suma&";
                that._playUrl = playUrl;
                that._createPlayer();
                //location.href = "play_video.html?playUrl=" + encodeURIComponent(curPlayUrl)+"&clientSessionId="+curPlaySessionId;
            } catch (ex) {
                LMEPG.Log.info("exception message:" + ex.message + " || lineNo:" + ex.lineNumber + " || stack:" + ex.stack);
            }
        } else {
            throw "获取purchaseToken失败！";
        }
    });
};

VideoPlayer.prototype.playDVB = function (surl) {
    var that = this;
    this._getToken(surl, function (purchaseToken) {
        if (purchaseToken != undefined && purchaseToken != null) {
            Bridge(
                "RequestPlay",
                {"purchaseToken": purchaseToken},
                function (_json) {
                    LMEPG.Log.info('[440004][player.js]---[play]--->_json: ' + _json);
                    LMEPG.Log.info("RequestPlay result: " + _json);
                    try {
                        LMEPG.Log.info("RequestPlay callback data : " + _json);
                        var result = JSON.parse(_json);
                        that._playUrl = result["-playUrl"];
                        that._selectionStart = surl;
                        that._sessionId = result["-clientSessionId"];
                        that._createPlayer();
                    } catch (ex) {
                        LMEPG.Log.info("expception message:" + ex.message + " || lineNo:" + ex.lineNumber + " || stack:" + ex.stack);
                    }
                }
            );
        } else {
            throw "获取purchaseToken失败！";
        }
    });
};

VideoPlayer.prototype.getDuration = function (url,callback) {
    $.ajax({
        url: url, async: true, context: document.body, success: function (_jsondata) {
            LMEPG.Log.info('[440004][player.js]---[getDuration]--->_jsondata: ' + JSON.stringify(_jsondata));
            callback(_jsondata)
        }
    });
};

VideoPlayer.prototype._getToken = function (_surl, callback) {
    LMEPG.Log.info('[440004][player.js]---[_getToken]--->_surl: ' + _surl);
    $.ajax({
        url: _surl, async: true, context: document.body, success: function (_jsondata) {
            LMEPG.Log.info('[440004][player.js]---[_getToken]--->_jsondata: ' + JSON.stringify(_jsondata));
            if (_jsondata != undefined) {
                try {
                    token = _jsondata["purchaseToken"];

                    if (token == "") {
                        token = _jsondata["url"]
                    }
                    callback(token)
                } catch (e) {
                    alert(e.stack);
                }

            }
        }
    });
}

VideoPlayer.prototype._getPlayUrl = function (_surl, callback) {
    LMEPG.Log.info('[440004][player.js]---[_getPlayUrl]--->_surl: ' + _surl);
    console.log("_getPlayUrl _surl :" + _surl);
    $.ajax({
        url: _surl, async: true, context: document.body, success: function (_jsondata) {
            console.log("_getPlayUrl return :" + JSON.stringify(_jsondata));
            LMEPG.Log.info('[440004][player.js]---[_getPlayUrl]--->_jsondata: ' + JSON.stringify(_jsondata));
            if (_jsondata != undefined) {
                try {
                    var playUrl = _jsondata["playUrls"];
                    callback(playUrl)
                } catch (e) {
                    alert(e.stack);
                }

            }
        }
    });
}



