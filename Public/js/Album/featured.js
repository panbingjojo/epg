var buttons = [{
    id: 'back',
    name: '返回',
    type: 'img',
    nextFocusDown: 'focus-1',
    click: onBack,
    backgroundImage:  g_appRootPath+ "/Public/img/hd/Menu/QHotherPages/back.png",
    focusImage:  g_appRootPath+ "/Public/img/hd/Menu/QHotherPages/back_f.png",
}, {
    id: 'debug',
    name: '脚手架ID',
    nextFocusUp: 'focus-8',
    nextFocusLeft: 'focus-8',
    nextFocusDown: "focus-1",
    nextFocusRight: "focus-1"
}];
/**
 * 渲染图文标题
 */
var currentData = null;

function renderList() {
    buttons.splice(2);
    var htm = '';
    currentData = dataList.slice(page * 8, page * 8 + 8);
    currentData.forEach(function (item, index) {
        htm += '<li id=focus-' + (index + 1) + '>' + item.title + '</li>';
        buttons.push({
            id: 'focus-' + (index + 1),
            name: '',
            type: 'img',
            nextFocusUp: 'focus-' + (index),
            nextFocusDown: 'focus-' + (index + 2),
            click: enterKey,
            focusChange: onFocusChangeBg,
            beforeMoveChange: turnPage,
            cIdx: index,
            item: item,
            itemType: item.content_type,
        })
    });
    arrow();
   if (currentData==""){
       page = -1;
       htm = "<span style='position: absolute;top: 50%;left: 40%;color: #fff;font-style: italic'>没有内容！</span>";
   }
    G("item-wrapper").innerHTML = htm;
    G("page-index").innerText = (page+1) + "/" +Math.ceil(dataList.length / 8);
}

/**
 * 切换箭头指示
 * @param imgCount
 * @param lastImgIndex
 */
function arrow(imgCount, lastImgIndex) {

    if (arguments.length > 0) {
        Show('left-arrow');
        Show('right-arrow');
        imgCount === 0 && Hide('left-arrow');
        imgCount === lastImgIndex && Hide('right-arrow');
    } else {
        Hide('prev-arrow');
        Hide('next-arrow');
        page > 0 && Show("prev-arrow");
        page < Math.ceil(dataList.length / 8) - 1 && Show("next-arrow");
    }
}

/**
 * 图文标题获得、失去焦点操作
 * @param btn
 * @param Focus
 */
function onFocusChangeBg(btn, Focus) {

    var currentDom = G(btn.id);
    var text = currentDom.innerText;
    if (Focus) {
        currentDom.className = "focus";
        text.length > 13 && (currentDom.innerHTML = "<marquee>" + text + "</marquee>");
    } else {
        currentDom.className = "";
        currentDom.innerHTML = text;
    }
}

/**
 * 翻页
 * @param key
 * @param btn
 */
function turnPage(key, btn) {
    var totalLastItem = dataList[dataList.length - 1];
    var curreLastItem = currentData[currentData.length - 1];
    switch (key) {
        case "up":
            btn.id == "focus-1" && prevPage(key, btn);
            break;
        case "down":
            totalLastItem != curreLastItem && btn.id == "focus-8" && nextPage();
            break;
        case "left":
            prevPage(key, btn);
            break;
        case "right":
            // 总条数的最后一条不等与当前渲染条数的最后一条即可翻页
            totalLastItem != curreLastItem && nextPage();
            break;
    }
}


/**
 * 上一页
 */
function prevPage(key, btn) {
    btn = btn ? btn : "";
    if (page == 0 && btn.id == "focus-1") {
        key == "up" && LMEPG.ButtonManager.requestFocus("back");
    } else if (page != 0) {
        page = Math.max(0, page -= 1);
        renderList();
        LMEPG.ButtonManager.init("debug", buttons, '', true);
    }
}

/**
 * 下一页
 */
function nextPage() {

    page = Math.min(Math.floor(dataList.length / 8), page += 1);
    renderList();
    LMEPG.ButtonManager.init("debug", buttons, '', true);
}

/**
 * enter键入操作
 */
var iframe = false;

function enterKey(btn) {
    saveCurrentId = btn.id;
    var itemType = btn.itemType;
    if (itemType == "1") {
        buttons.shift();
        buttons.unshift({
            id: 'img-container',
            name: '图文容器',
            click: onBack,
            beforeMoveChange: renderImg,
            cIdx: btn.cIdx
        });
        var httpImg = currentData[btn.cIdx].content_desc;
        createImg(httpImg);
        renderImg("", btn);
        LMEPG.ButtonManager.init("img-container", buttons, '', true);
        Show("iframe");
        iframe = true;
    } else {
        onClickVideoItem(btn.item) // 播放视频
    }
}

// 处理点击视频列表事件
function onClickVideoItem(videoInfo) {
    var ftp_url_json;
    if (videoInfo.ftp_url instanceof Object) {
        ftp_url_json = videoInfo.ftp_url;
    } else {
        ftp_url_json = JSON.parse(videoInfo.ftp_url);
    }
    // 视频ID
    var play_id = ftp_url_json.gq_ftp_url;


    var paramJson = {
        "sourceId": videoInfo.source_id,
        "videoUrl": play_id,
        "title": videoInfo.title,
        "type": 2,
        "entryType": 4,
        "entryTypeName": "39Featured",
        "userType": videoInfo.user_type,
        "freeSeconds": videoInfo.free_seconds,
        "focusIdx": saveCurrentId,
        'unionCode': videoInfo.union_code,
        'showStatus': videoInfo.show_status
    };

    jumpVideoPlay(paramJson);
}

function jumpVideoPlay(paramJson) {
    var objCurrent = getCurrentPage();

    var objPlayer = LMEPG.Intent.createIntent("player");
    objPlayer.setParam("userId", userId);
    objPlayer.setParam("videoInfo", JSON.stringify(paramJson));

    LMEPG.Intent.jump(objPlayer, objCurrent);
}

/**
 * 设置当前页参数
 */
function getCurrentPage() {
    var objCurrent = LMEPG.Intent.createIntent("album");
    objCurrent.setParam("userId", userId);
    objCurrent.setParam("albumName", "39Featured");
    objCurrent.setParam("focus_index", saveCurrentId);
    objCurrent.setParam("inner", 1);
    objCurrent.setParam("moveNum", page);
    return objCurrent;
}

/**
 * 渲染图文数据
 * @param key
 * @param btn
 */
var count = 0;
var loader = [];

function renderImg(key, btn) {
    if (key == "up" || key == "down") return;
    var imgWrap = G('img-container');
    var httpImg = currentData[btn.cIdx].content_desc;
    count = key === 'left' ? Math.max(1, count -= 1) : Math.min(httpImg.length, count += 1);
    imgWrap.replaceChild(loader[count - 1], imgWrap.firstElementChild);
    arrow(count - 1, httpImg.length - 1);
}

/**
 * 创建当前焦点对应标题的图片数组
 * @param httpImg
 */
function createImg(httpImg) {
    count = 0;
    loader = [];
    httpImg.forEach(function (item) {
        var img = new Image();
        img.src = resourcesUrl + item;
        loader.push(img);
    });
}

function onBack() {
    if (iframe) {
        Hide("iframe");
        iframe = false;
        LMEPG.ButtonManager.init(saveCurrentId, buttons, '', true);
    } else {
        LMEPG.Intent.back();
    }
}
