<?php

/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |  专辑数据相关接口
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2017/12/1 9:37                                                |
  +----------------------------------------------------------------------+ 
 */
namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;

class AlbumAPI
{
    // UI专辑类型
    static public $UI_ALBUM_TYPE = 0;
    // 所有视频栏目类型
    static public $ALL_VIDEO_PROGRAM_TYPE = -1;
    // 专辑排序规则按时间
    static public $ALBUM_ORDER_RULE_BY_TIME = 0;
    // 专辑排序规则按访问量
    static public $ALBUM_ORDER_RULE_BU_PV = 1;

    /**
     * @param $currentPage //当前页码
     * @param $pageNum //每页显示条数
     * @param $albumName //专辑名称
     * @return mixed      专辑数据
     */
    public static function getAlbumList($currentPage, $pageNum, $albumName)
    {
        $json = array(
            "current_page" => $currentPage,
            "page_num" => $pageNum,
            "alias_name" => $albumName,
        );
        LogUtils::info("HttpManager getAlbumList ---> album: " . $albumName);
        $httpManager = new HttpManager(HttpManager::PACK_ID_ALBUM);
        $result = $httpManager->requestPost($json);

        LogUtils::info("HttpManager getAlbumList ---> return [URL-RESULT]");
        return json_decode($result, true);
    }
    /**
     * 此函数用于获取用户进入专辑限定参数
     * @param $albumName //专辑名称
     * @return mixed      专辑数据
     */
    public static function getAlbumUserLimit($albumName)
    {
        $json = array(
            "current_page" => 1,
            "page_num" => 1,
            "alias_name" => $albumName,
        );
        LogUtils::info("HttpManager getAlbumList ---> album: " . $albumName);
        $httpManager = new HttpManager(HttpManager::PACK_ID_ALBUM);
        $result = $httpManager->requestPost($json);

        LogUtils::info("HttpManager getAlbumList ---> return [URL-RESULT]");
        return json_decode($result, true);
    }

    /**
     * @param $albumName //专辑名称
     * @param $graphicId // 图文专辑Id
     * @param $graphicCode // 图文专辑编码
     * @return mixed      专辑数据
     */
    public static function getTemplateIdList($graphicId, $graphicCode)
    {
        $param = empty($graphicId) ? $graphicCode : $graphicId;
        $packId = empty($graphicId) ? HttpManager::PACK_ID_TEMPLATECODE : HttpManager::PACK_ID_TEMPLATEID;
        $json = is_numeric($param) ? ["tuwen_id" => $param] : ["union_code" => $param];
        LogUtils::info("HttpManager getAlbumList ---> album: " . $graphicId . "图文code" . $graphicCode);
        $httpManager = new HttpManager($packId);
        $result = $httpManager->requestPost($json);

        LogUtils::info("HttpManager templateId ---> return [URL-RESULT]");
        return json_decode($result, true);
    }

    /**
     * @Brief:此函数用于随机得到专辑里的一条contentId
     * @param $platformType
     * @param $albumName
     * @return mixed|string : $contentId 内容ID
     */
    public static function getRandomContentIdByAlbum($platformType, $albumName)
    {
        $data = self::getAlbumList(1, 100, $albumName); // 服务器暂时不关心前面两个参数
        if ($data['result'] != 0) {
            return "";
        }

        $albumData = $data['data']['video_list'];
        $albumDataLength = count($albumData);
        if ($albumDataLength == 0) {
            return "";
        } else if ($albumDataLength == 1) {
            // 如果只有一条数据，就取这一条
            $idx = 0;
        } else {
            // 随机抽取一个视频内容 得到的内容在[1---length-1之间],
            $idx = rand(1, $albumDataLength - 1);
        }

        // 得到随机索引对应的内容
        $item = $albumData[$idx];

        // 取出视频内容ID
        $contentIdItem = $item['ftp_url'];

        if ($platformType == STB_TYPE_HD) {
            $contentId = $contentIdItem['gq_ftp_url'];
        } else {
            $contentId = $contentIdItem['bq_ftp_url'];
        }
        return $contentId;
    }

    /**
     * 获取专辑列表
     * @param: $albumType 专辑类型（-1 不区分 0 UI专辑1视频集）
     * @param: $modelType 视频栏目ID（-1 不区分栏目）
     * @param: $currentPage 当前页
     * @param: $pageNum 每页显示多少条数据
     * @param: $orderRule 排序规则（0按添加时间倒序 1按访问量倒序）
     * @return mixed
     */
    public static function getAllAlbum($albumType, $modelType, $currentPage, $pageNum, $orderRule)
    {
        $areaCode = MasterManager::getAreaCode();
        $carrierId = MasterManager::getCarrierId();
        $json = array(
            "album_type" => $areaCode =='205'|| $carrierId =='620092' ? 2 : $albumType,
            "model_type" => $modelType,
            "current_page" => $currentPage,
            "page_num" => $pageNum,
            "order_rule" => $orderRule,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_ALL_ALBUM);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 通过专题别名获取专题id
     * @param $alias_name
     * @return mixed 返回album_id 专题id
     */
    public static function getAlbumIdByAlias($alias_name)
    {

        $json = array(
            "alias_name" => $alias_name
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_GET_ALBUM_ID_BY_ALIAS);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 采集专辑访问量
     * @param $subject_id
     * @return mixed
     */
    public static function gatherAlbumAccess($subject_id)
    {

        $json = array(
            "subject_id" => $subject_id
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_GATHER_ALBUM_ACCESS);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取专辑模板信息
     * @param $templateID
     * @return mixed
     */
    public static function getTemplateInfo($templateID)
    {

        $json = array(
            "template_id" => $templateID
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_TEMPLATE_ALBUM);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }
}