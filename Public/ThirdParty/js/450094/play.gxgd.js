(function () {
    function STBPlay() {
        this.width = 1280;
        this.height = 720;
        this.returnKey = 399;
        this.exitKey = 514;
        this.success = 5002;
        this.fail_5004 = 5004;
        this.fail_5008 = 5008;
        this.id = null;
        this.ids = null;
        this.index = 0;
        this.len = 0;
        this.flag = 0;
    }

    STBPlay.prototype = {
        play: function (id, ids) {
            var self = this;
            var n = ids.indexOf(id);
            self.id = id;
            self.ids = ids;
            self.index = 0;
            self.len = ids.length;
            if (n > 0) {
                self.index = n;
            }
            self.pn();
        },
        pn: function () {
            var self = this;
            if (self.index < self.len) {
                var import_id = self.ids[self.index];
                videoUrl = import_id;
                self.index = self.index + 1;
                var geturl_params = {
                    nns_cp_id: "39JK",
                    nns_cp_video_id: import_id,
                    nns_video_type: "0"
                }
                starcorCom.apply_play(geturl_params, function (resp) {
                    //console.log(resp);
                    if ("0" == resp.result.state) {
                        var url = resp.video.index.media.url;
                        self.open(url);
                    } else {//错误提示
                        self.box(resp.result.reason);
                        setTimeout("window.history.go(-1);", 2000);
                    }
                });
            } else {
                window.history.go(-1);
            }
        },
        open: function (url) {
            var self = this;
            if (self.getVersion() >= 1) {
                iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", '1');
                iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", '1');
                iPanel.setGlobalVar("VOD_CTRL_LOCATION", "x=0&y=0&w=" + self.width + "&h=" + self.height + "");
                iPanel.setGlobalVar("VOD_CTRL_ENABLE_MENU", '1');
                iPanel.setGlobalVar("VOD_CTRL_IGNORE_MSG", '1');
                iPanel.setGlobalVar("VOD_CTRL_URL", '' + url + '');
                iPanel.setGlobalVar("VOD_CTRL_PLAY", '1');
            } else {
                window.location.href = url;
            }
        },
        box: function (txt) {
            var self = this;
            var title = "box";
            if (self.isEmpty(self.get(title))) {
                var dw = 250, dh = 24;
                var div = document.createElement("div");
                div.id = title;
                div.style.border = "1px blue solid";
                div.style.position = "absolute";
                div.style.zIndex = 9999;
                div.style.backgroundColor = "blue";
                div.style.fontSize = "21px";
                div.style.color = "#fff";
                div.style.height = dh + "px";
                div.style.left = 0 + (self.width / 2) - (dw / 2);
                div.style.top = 0 + (self.height / 2) - (dh / 2);
                div.innerHTML = txt;
                document.body.appendChild(div);
            } else {
                self.v(title, txt);
                self.s(title);
            }
        },
        monit: function () {
            var self = this;
            var pt = 0, st = 0, ft = 0;
            clearInterval(self.flag);
            self.flag = setInterval(function () {
                pt = 0, ft = 0;
                ft = iPanel.getGlobalVar("VOD_FILM_TIME");
                pt = iPanel.getGlobalVar("VOD_PLAY_TIME");
                st = self.timeTosec(pt);
                if (st >= (ft - 0) && self.validateNum(ft)) {
                    if (self.index < self.len) {
                        LMEPG.UI.showToast("即将播放下一集，请稍后.....");
                    } else if (self.index == self.len) {
                        iPanel.setGlobalVar('VOD_CTRL_STOP', '1');//设置视频停止播放
                        // self.box("节目播放结束");
                        window.playFinish();
                    }
                    clearInterval(self.flag);
                }
            }, 1000);
        },
        timeTosec: function (time) {
            var s = '';
            var hour = time.split(':')[0];
            var min = time.split(':')[1];
            var sec = time.split(':')[2];
            s = Number(hour * 3600) + Number(min * 60) + Number(sec);
            return s;
        },
        onunload: function () {
            var self = this;
            window.onunload = function () {
                iPanel.setGlobalVar("VOD_CTRL_STOP", "1");
                iPanel.setGlobalVar("VOD_CTRL_COMPLETED", "1");
                iPanel.setGlobalVar("SEND_RETURN_KEY_TO_PAGE", '0');
                iPanel.setGlobalVar("SEND_EXIT_KEY_TO_PAGE", '0');
            }
        },
        validateNum: function (num) {
            if ((/(^[1-9]\d*$)/.test(num))) return true;
            return false;
        },
        s: function (id) {
            var self = this;
            self.get(id).style.display = "";
        },
        h: function (id) {
            var self = this;
            self.get(id).style.display = "none";
        },
        v: function (id, txt) {
            var self = this;
            self.get(id).innerHTML = txt;
        },
        isEmpty: function (str) {
            if ("" == str || null == str || "null" == str || str == undefined || str == "undefined") {
                return true;
            } else {
                return false;
            }
        },
        getVersion: function () {
            return iPanel.getGlobalVar("VOD_EMBEDDED_VERSION");
        },
        print: function (txt) {
            return document.getElementById("info").innerHTML = txt;
        },
        get: function (id) {
            return document.getElementById(id);
        }
    }
    window.STBPlay = new STBPlay();
    window.STBPlay.onunload();
})();