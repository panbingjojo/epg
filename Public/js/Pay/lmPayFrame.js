/**
 * Created by Administrator on 2019/9/23.
 * 用于启动iframe来加载局方的计费页，使得应用不用再跳转到局方的系统里。
 * 1、先创建iframe对象，并插入到body容器里，设置大小为0像素
 * 2、使用document.getElementById("ifr").setAttribute("src", payUrl);方法加载计费页
 * 3、当加载完成，通过document.getElementById("ifr").onload方法回调出来
 * 4、设置iframe的大小为当前页面的大小（1280*720或640*530）
 * 5、设置iframe获取焦点document.getElementById('ifr').focus();
 * 6、释放iframe资源：releaseFrame()
 */
LMEPG.PayFrame = (function () {
    return {
		objIframe: null,
		isInit: false,
        isHd: "hd",
		
        /**
         * 显示局方计费页
         * @param payUrl 能出界面的订购URL
         * @param isHd 是否为高清（hd -- 高清，sd -- 标清）
         * @param:isHidden 是否隐藏
         */
        goLMPay: function (payUrl, isHd, isHidden, reloadIntent) {
            if (reloadIntent){
                LMEPG.PayFrame.reloadIntent = reloadIntent;
            }

            // 关闭播放器
            if (LMEPG.mp) {
                LMEPG.mp.destroy();
            }

            LMEPG.PayFrame.buildFrameObject(isHd);
            LMEPG.PayFrame.objIframe.setAttribute("src", payUrl);
            LMEPG.PayFrame.isInit = true;
            LMEPG.PayFrame.isHd = isHd;
            LMEPG.Log.info("lmPayFrame::carrierId = " + RenderParam.carrierId);
            LMEPG.PayFrame.objIframe.onload=function(){
                LMEPG.Log.info("lmPayFrame::load payurl ok!!!!!!!!!!!!!");
				if (!isHidden) {
				    if (RenderParam.carrierId == "000051") {
				        LMEPG.PayFrame.setPageSize("sd");
                    }
					LMEPG.PayFrame.showIFrame(isHd);
				}
            };
        },

        showIFrame: function (isHd) {
			if (!LMEPG.PayFrame.isInit) {
				return;
			}

			// 显示页面
			S("lm-pay-ifr");

            // 延时获得焦点
            var buttons = [];
            LMEPG.ButtonManager.init("", buttons, "", true);
            setTimeout(function () {
                LMEPG.PayFrame.objIframe.focus();
                LMEPG.ButtonManager.setKeyEventPause(true);
            },100);
        },

        /**
         * 构建iframe对象，并插入到body容器里，设置大小为0像素
         */
        buildFrameObject: function (isHd) {
            var item = document.createElement("iframe");
            item.name = "lm-pay-ifr";
            item.id = "lm-pay-ifr";
            //设置iframe的样式
            item.style.overflow = "hidden";
            item.style.border = "none";
            item.style.zIndex = "999";
            item.style.position = "fixed";
            item.style.top = "0px";
            item.style.left = "0px";

            item.scrolling = "no";
            item.frameborder = "0";

			if (isHd == 'hd') {
				item.height = "720px";
				item.width = "1280px";
			} else {
				item.height = "530px";
				item.width = "640px";
			}
			LMEPG.PayFrame.objIframe = item;
            document.body.appendChild(item);
			
			H("lm-pay-ifr");
        },

        /**
         * 重新设置分辨率，有盒子会出现页面放大情况，原因是高清盒子使用了标清页面
         */
        setPageSize: function(isHd){
            var meta = document.getElementsByTagName('meta');
            if (typeof meta !== "undefined"){
                if (isHd == "hd") {
                    meta["page-view-size"].setAttribute('content',"1280*720");
                } else {
                    meta["page-view-size"].setAttribute('content',"640*530");
                }
            }

            LMEPG.Log.info("lmPayFrame::setPageSize = " + isHd);
        },

        /**
         * 释放iframe资源
         */
        releaseFrame: function () {
            LMEPG.Log.info("lmPayFrame::releaseFrame!!!!!!!!!!!!!");
			LMEPG.PayFrame.isInit = false;
            try {
                var item = parent.document.getElementById('lm-pay-ifr');
                item.blur();
                parent.document.body.removeChild(item); // 移除标签
                LMEPG.Log.info("lmPayFrame::releaseFrame remove iframe");
                if (LMEPG.PayFrame.reloadIntent){
                    LMEPG.Intent.jump(LMEPG.PayFrame.reloadIntent);
                }else {
                    window.location.reload();
                }
            } catch (e) {
                LMEPG.Log.info("异常：" + e.toString());
            }
            LMEPG.ButtonManager.setKeyEventPause(false);
        },

    };
})();