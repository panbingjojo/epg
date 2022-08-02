<?php
/**
 * Created by PhpStorm.
 * User: ASUS
 * Date: 2017/12/4
 * Time: 18:16
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Entry\MasterManager;

class VideoAPI
{
    // 视频点击播放排行榜 -- 日点击播放排行
    static public $PLAY_VIDEO_RANK_OF_DAY = 0;

    /**
     * 通过分类ID获取视频列表
     * @param $userId
     * @param $classifyId
     * @param $page
     * @return mixed
     */
    static function getVideoByClassifyId($userId, $classifyId, $page, $pageNum)
    {
        $json = array(
            "current_page" => $page,
            "page_num" => $pageNum,
            "type" => $classifyId,
        );

        $http = new HttpManager(HttpManager::PACK_ID_CHANNEL);
        $http->setUserId($userId);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * 向CWS获取播放挽留随机4个推荐视频
     * @param $userId
     * @param $videoUserType (0--不限，1--普通用户，2--vip，3--付费)
     * @return mixed
     */
    static function getVideoRecommend($userId, $videoUserType = 0)
    {
        $json = array(
            "current_page" => 1,
            "page_num" => 4,
            // "user_type" => $videoUserType,
            "user_type" => 2, // 全平台暂时修改为默认推荐vip视频
        );

        if (CARRIER_ID == '430002') {
            $json['user_type'] = 1;
        }

        $http = new HttpManager(HttpManager::PACK_ID_PLAY_END_VIDEO_RECOMMEND);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * 向CWS获取播放挽留随机4个推荐视频-- 山东电信 拉取小包推荐视频
     * @param $userId
     * @param $modelType    山东电信 小包推荐视频类型 56：中老年健康，57：宝贝天地
     * @return mixed
     */
    static function getPacketVideoRecommend($userId, $modelType)
    {
        $json = array(
            "current_page" => 1,
            "page_num" => 4,
            "user_type" => 2, // 全平台暂时修改为默认推荐vip视频
            "model_type" => $modelType,
        );

        $http = new HttpManager(HttpManager::PACK_ID_PLAY_END_VIDEO_RECOMMEND);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * 向CWS获取相关视频是否允许插入
     * @param $userId
     * @return mixed
     */
    static function getVideoAllow($userId, $sourceId)
    {
        $json = array(
            "source_id" => $sourceId,
        );
        $http = new HttpManager(HttpManager::PACK_ID_INTROVIDEO_ALLOW);
        $http->setUserId($userId);
        $result = $http->requestPost($json);
        return $result;
    }

    /**
     * 向CWS获取相关视频是否允许插入
     * @param $userId
     * @return mixed
     */
    static function getVideoByPackageId($userId, $file_url)
    {
        $json = array(
            "file_url" => $file_url,
        );
        $http = new HttpManager(HttpManager::PACK_ID_INTROVIDEO_DETAIL);
        $result = $http->requestPost($json);
        return $result;
    }


    /**
     * 获取健康视频分类
     * @param: $model_type 分类id（默认为0,0表示拉取一级分类列表，否则拉取该分类下的子分类）
     * @return mixed
     */
    public static function getVideoClass($model_type,$is_new=0)
    {
        if (!isset($model_type))
            $model_type = 0;
        $json = array(
            "model_type" => $model_type,
            "is_new" => $is_new,//1 新栏目，0 旧栏目
        );

        $key = RedisManager::$REDIS_VIDEO_CLASSIFY . "_$model_type" . CARRIER_ID;
        $result = RedisManager::getPageConfig($key);
        if (!$result) {
            $httpManager = new HttpManager(HttpManager::PACK_ID_CLASSIFY);
            $result = $httpManager->requestPost($json);
            RedisManager::setPageConfig($key, $result);
        }
        return json_decode($result);
    }

    /**
     * 获取健康视频列表
     * @param: $current_page 当前页
     * @param: $page_num 每页显示多少条数据
     * @param: $type 模块类型
     * @return mixed
     */
    public static function getVideoList($current_page, $page_num, $type)
    {
        $json = array(
            "current_page" => $current_page,
            "page_num" => $page_num,
            "type" => $type,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_CHANNEL);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 获取专辑详情
     * @param $subject_id
     * @return mixed
     */
    public static function getAlbumDetail($subject_id)
    {
        $json = array(
            "subject_id" => $subject_id,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ALBUM_DETAIL);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 获取视频点播排行榜
     * @param: $type 排行榜类型（0日排行 1周排行 2月排行 3年排行 4累计排行）
     * @param $count
     * @return mixed
     */
    public static function getVideoPlayRank($type, $count)
    {
        $json = array(
            "type" => $type,
            "count" => $count,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_VIDEO_PLAY_RANK);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 获取视频播放历史
     * @param $currentPage
     * @param $pageNum
     * @return mixed
     */
    public static function getHistoryPlayList($currentPage, $pageNum)
    {
        $json = array(
            "current_page" => $currentPage,
            "page_num" => $pageNum,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_HISTORY_PLAY_LIST);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 删除历史播放视频
     * @param $source_id -1表示清空历史播放记录
     * @return mixed
     */
    public static function deleteHistoryPlay($source_id)
    {
        $json = array(
            "source_id" => $source_id,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_DELETE_HISTORY_PLAY);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 根据视频播放地址获取视频信息
     * @param $file_url_list
     * @return mixed
     */
    public static function getVideoListByPlayUrl($file_url_list)
    {
        $json = $file_url_list;
        $httpManager = new HttpManager(HttpManager::PACK_ID_GET_VIDEO_LIST_BY_PLAY_URL);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 根据视频union_code获取视频信息
     * @param $unionCode
     * @return mixed
     */
    public static function getVideoListByUnionCode($unionCode)
    {
        $json = array(
            "union_code" => $unionCode,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GET_VIDEO_LIST_BY_UNION_CODE);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    static public function getPlayUrl($programId)
    {
        $apkInfo = json_decode(MasterManager::getApkInfo());             // 获取apkInfo
        $userToken = /*$carrierId == CARRIER_ID_SHANXIYD ? $apkInfo->stbUserToken :*/
            MasterManager::getUserToken();         // 用户Token
        // LogUtils::info("Player::getPlayUrlAction ---> apkInfo:" . json_encode($apkInfo));

        // 组装参数
        $param = array(
            "cid" => $programId,
            "tid" => "",
            "supercid" => "",
            "playType" => "1",
            "contentType" => "10",
            "businessType" => "1",
            "idflag" => "1",
        );
        $paramLen = strlen(json_encode($param));
        $header = array(
            'Content-type: application/json;charset=utf-8',
            'Authorization:' . $userToken,
            'Content-Length:' . $paramLen,
        );
        /* if ($carrierId == CARRIER_ID_SHANXIYD){
             $rootUrl = $apkInfo->stbEpgServer;
         }else{*/
        // }
        $stbEpgUrl = $apkInfo->stbEpgUrl;
        $position = strpos($stbEpgUrl, '/EPG');
        $rootUrl = substr($stbEpgUrl, 0, $position);
        LogUtils::info("Player::getPlayUrlAction ---> stbEpgUrl:" . $stbEpgUrl);
        LogUtils::info("Player::getPlayUrlAction ---> position:" . $position);
        LogUtils::info("Player::getPlayUrlAction ---> rootUrl:" . $rootUrl);
        $url = $rootUrl . "/EPG/interEpg/user/default/authorize";

        LogUtils::info("Player::getPlayUrlAction ---> request:" . $url . " --->param:" . json_encode($param) . " ---> userToken:" . $userToken . " ---> len:" . $paramLen);
        $result = HttpManager::httpRequestByHeader("POST", $url, $header, json_encode($param));
        LogUtils::info("Player::getPlayUrlAction ---> result:" . $result);

        return $result;
    }
}