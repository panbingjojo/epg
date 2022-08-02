<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | [图文专辑] 模块API：提供给第三方
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2019/4/30 15:30
// +----------------------------------------------------------------------


namespace Provider\Model\Common\ServerAPI;


use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\AlbumAPI;

class MyAlbumApi
{
    /**
     * 拉取指定专辑关联的图文专辑列表
     *
     * @param $albumName //专辑名
     * @param int $page //当前页数
     * @param int $pageNum //当前页拉取的条数。
     * @return \stdClass
     */
    public static function getAlbumContentList($albumName, $page = 1, $pageNum = 10000)
    {
        $ret = new \stdClass();
        $ret->code = 0;
        $ret->msg = 'success';

        $retArray = AlbumAPI::getAlbumList($page, $pageNum, $albumName);
        $retJsonObj = json_decode(json_encode($retArray));
        if (is_null($retJsonObj) || $retJsonObj->result != 0) {
            $ret->code = $retJsonObj->result;
            $ret->msg = 'failed';
            LogUtils::error('[' . __CLASS__ . '][' . __FUNCTION__ . '] ---> failed! result: ' . json_encode($retJsonObj));
        } else {
            $ret->page = $page;
            $ret->page_size = $pageNum;
            $ret->total_count = $retJsonObj->data->content_cnt;

            $list = array();

            $video_list = $retJsonObj->data->video_list;
            foreach ($video_list as $item) {
                if ($item->content_type == 1) { // content_type: 0-视频 1-图文专辑
                    // 只过滤出"图文专辑"给第三方，不提供视频专辑！
                    $list[] = self::simplifyAlbumItem($albumName, $item);
                }
            }

            $ret->list = $list;
        }

        return $ret;
    }

    /**
     * 精简化并加工处理提供给第三方的图文专辑返回数据。e.g. 把图片相对地址转为绝对地址返回。
     *
     * @param $albumName //当前专辑名
     * @param $albumVideoListItem //一个video_list条目，有效的json对象！
     * @return \stdClass
     */
    private static function simplifyAlbumItem($albumName, $albumVideoListItem)
    {
        $retItem = new \stdClass();
        $retItem->type = $albumVideoListItem->content_type;
        $retItem->album_name = $albumName;
        $retItem->subject_id = $albumVideoListItem->subject_id;
        $retItem->subject_name = $albumVideoListItem->subject_name;
        $retItem->content_title = $albumVideoListItem->title;

        $srcImgList = $albumVideoListItem->content_desc;
        $dstImgList = array();
        foreach ($srcImgList as $imgUrl) {
            $dstImgList[] = empty($imgUrl) ? $imgUrl : (RESOURCES_URL . $imgUrl);
        }

        $retItem->content_list = $dstImgList;
        return $retItem;
    }
}