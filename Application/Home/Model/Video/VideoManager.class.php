<?php

namespace Home\Model\Video;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Entry\MasterManager;

/**
 * 点播视频管理器
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/4
 * Time: 18:22
 */
class VideoManager
{
    /**
     * @param $userId
     * @param $videoUserType (0--不限，1--普通用户，2--vip，3--付费)
     * @return mixed
     */
    public static function getRecommennd($userId, $videoUserType)
    {
        $result = VideoAPI::getVideoRecommend($userId, $videoUserType);
        return json_decode($result);
    }
    /**
     * 是否允许播放
     */
    static public function getVideoAllow($userId, $sourceId)
    {
        $allowInfo = VideoAPI::getVideoAllow($userId, $sourceId);
        return $allowInfo;
    }

    /**
     * @Brief:此函数用于截取视频列表
     * @param $videoList //原始视频列表
     * @param $start //起始值，从0开始
     * @param $num //要几个
     * @return \stdClass
     */
    public static function sliceVideoList($videoList, $start, $num) {
        $videoInfo = new \stdClass();
        $videoInfo->count = 0;
        $videoInfo->list = [];

        // 不在取值范围内，返回空
        if ($videoList->count <= 0 || ($start < 0 || $start >= $videoList->count)) {
            if ($videoList->count <= 0) {
                LogUtils::warn('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] : There is no any videos!!!');
            } else {
                LogUtils::error('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] : Out of bound["' . $start . '" is beyond "0~' . $videoList->count . '"]!!!');
            }
            return $videoInfo;
        }

        // 计算实际能够截取的条数
        $length = ($videoList->count >= $start + $num) ? $num : $videoList->count - $start;
        for ($i = 0; $i < $length; $i++) {
            $videoInfo->count = $i + 1;
            $videoInfo->list[$i] = $videoList->list[$i + $start];
        }

        return $videoInfo;
    }
}