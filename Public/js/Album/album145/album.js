(function () {
    var albumOptions = {};
    albumOptions.imgPrefixIndex = TP.imgPrefixIndex;

    var showVideoLength = 5;  // 单页视频显示数量
    var videoArrayLength = 10; // 视频数量
    var videoItemMoveUp; // 视频向上移动焦点
    var moreAndBackDown; // 更多和返回向下焦点
    var videoTvItemMoveUp = 'more'; // 小窗向上移动焦点
    var backItemLeft = 'more'; // 返回按钮
    /**
     *  设置小窗播放
     */
    if (TP.platformType == 'hd') {
        videoItemMoveUp = 'videoTv';
        moreAndBackDown = 'videoTv';
        if (TP.lmcid == '450094'){
            moreAndBackDown = 'focus-'+showVideoLength;
            videoItemMoveUp = 'more';
            albumOptions.bgImage = 'bg_album_gx.png';
        }
        if (TP.lmcid == '320092'){
            videoTvItemMoveUp = 'back';
            backItemLeft = 'videoTv';
            albumOptions.bgImage = 'bg_album_js.png';
        }


        albumOptions.smallVideoOption = {
            // 小窗视频放置位置
            videoPosition: {
                top: 94,    // 小窗播放距离上
                left: 532,   // 距离左
                width: 284,  // 宽
                height: 157  // 高
            },
            // 小窗视频焦点移动方向
            videoTvItemMove: {
                up: videoTvItemMoveUp,
                down: 'focus-'+showVideoLength,
                left: '',
                right: videoTvItemMoveUp
            }
        };
    } else {
        showVideoLength = 4;
        videoItemMoveUp = 'more';
        moreAndBackDown = 'focus-'+showVideoLength;
        if (TP.lmcid == '320092'){
            videoItemMoveUp = 'back';
            backItemLeft = 'focus-'+showVideoLength;
            albumOptions.bgImage = 'bg_album_js_sd.png';
        }
    }

    if (TP.lmcid == '000051' || TP.lmcid == '220094' || TP.lmcid == '450094' || TP.lmcid == '650092') {
        videoArrayLength = 7;
    }
    /**
     * 设置视频列表
     */
    var totalVideoArray = [];
    for (var index = 0; index < videoArrayLength; index++) {
        totalVideoArray.push(
            {
                imageIndex: index + 1,
                videoIndex: index
            }
        );
    }
    if (TP.lmcid == '460092') {
        totalVideoArray = [
            {
                imageIndex: 7,
                videoIndex: 0
            }, {
                imageIndex: 8,
                videoIndex: 1
            }, {
                imageIndex: 9,
                videoIndex: 2
            }, {
                imageIndex: 10,
                videoIndex: 3
            }, {
                imageIndex: 11,
                videoIndex: 4
            }, {
                imageIndex: 12,
                videoIndex: 5
            }
        ]
    }

    if (TP.lmcid == '320092'){
        albumOptions.albumListOptions = {
            showItemLength: 4,
            moveDirection: 'right',
            totalAlbumArray: [
                {index: 131, album: 'album131'},
                {index: 134, album: 'album134'},
                {index: 139, album: 'album139'},
                {index: 'more', album: 'more'}
            ],
            moveOption: {
                prev: '',
                next: '',
                up: '',
                down: '',
                left: '',
                right: ''
            }
        };
    }
    albumOptions.totalVideoArray = totalVideoArray;
    albumOptions.videoListOptions = {
        showItemLength: showVideoLength,
        moveDirection: 'right',
        moveOption: {
            prev: '',
            next: '',
            up: videoItemMoveUp,
            down: 'moreAlbum',
            left: '',
            right: ''
        }
    };
    albumOptions.backItemMove = {
        up: '',
        down: moreAndBackDown,
        left: backItemLeft,
        right: 'more'
    };
    albumOptions.moreItemMove = {
        up: '',
        down: moreAndBackDown,
        left: 'back',
        right: 'back'
    };
    albumOptions.moreAlbumItemMove = {
        up: 'focus-'+showVideoLength,
        down: '',
        left: '',
        right: ''
    };

    if(TP.lmcid == '320092'){
        new JSAlbum(albumOptions);
    }else {
        new LMAlbum(albumOptions);
    }
})();
