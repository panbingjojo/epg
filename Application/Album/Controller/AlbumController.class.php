<?php
/**
 * Created by PhpStorm.
 * User: yzq
 * Date: 2017-09-29
 * Time: 17:31
 * Brief: 专辑位控制器
 */

namespace Album\Controller;

use Api\APIController\UserAPIController;
use Home\Controller\BaseController;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\CookieManager;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;
use Home\Model\Page\PageManager;
use Home\Model\Stats\StatManager;
use Home\Model\Common\ServerAPI\StoreAPI;

class AlbumController extends BaseController
{
    private $userId;//用户id
    private $inner = 1;//是否从首页跳转过来，决定专辑按返回时回退到epg页面还是首页
    private $fromId = 0;
    private $focusIndex = "focus-1-1";
    private $videoTitle = "";
    private $focusPages = 1;
    private $moveNum = 0;
    private $moveAlbumNum = 0;
    private $position = 0;
    private $albumName = ""; // 专题名称
    private $graphicId = 0; // 图文id
    private $graphicCode = 0; // 图文code
    private $isVideoFree = 0;//是否可以免费观看视频
    private $atFreeTime = 0;//是否到达观看视频免费时长
    private $addScore = 0;//看视频加积分

    // 需要特殊处理的专辑
    private $specialAlbumArray = array("albumEpidemic");
    private $newAlbum = array("album360");

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        if (in_array($this->albumName, $this->newAlbum)) {
            return array("album" => "Album/album",);
        }
        // TODO: Implement config() method.
    }


    //    首页UI
    public function indexUI()
    {
        LogUtils::info("###############> welcome to album!!! param: " . json_encode($_GET));
        $this->initCommonRender();
        $this->parseUrlParam();

        if (in_array($this->albumName, $this->specialAlbumArray)) {
            $this->initSpecialAlbum();
        } else {
            $this->init();
        }


        if (strpos($this->albumName, 'album') !== false) {
            $albumNameLength = strlen($this->albumName);
            $albumCode = substr($this->albumName, 5, $albumNameLength);
            if ($albumCode >= 500) {
                $this->display("customizeAlbum");
            } else {
                $this->display($this->albumName);
            }
        } else {
            $this->display($this->albumName);
        }

    }

    private function saveUserLatestWatchAlbum($albumData, $templateData)
    {
        $key = 'EPG-LWS-LATEST-ALBUMINFO-' . MasterManager::getCarrierId() . '-' . MasterManager::getUserId();
        $val = json_decode($albumData)->data->subject_list[0];
        if ($val->alias_name === 'TemplateAlbum') { // 如果是模板专辑，则记录模板编码
            $val = json_decode($templateData)->data;
        } else {
            $val->title = $val->subject_name;
        }

        ActivityManager::saveStoreData($key, json_encode($val));

    }

    private function initSpecialAlbum()
    {
        if ($this->albumName == 'albumEpidemic') {
            $this->focusIndex = parent::getFilter("focus_index", 'btn_index_1');
            $this->assign("focus_index", $this->focusIndex);
        }
    }

    private function init()
    {
        $albumData = $this->getAlbumData($this->albumName);
        $templateData = $this->getTemplateData($this->graphicId, $this->graphicCode);
        $data = json_decode($albumData);

        // 如果返回失败，则跳转到应用首页
        if ($data->result != 0) {
            $homeUrl = PageManager::getBasePagePath('home') . "/" . '?userId=' . $this->userId;
            $this->error("访问的专辑[$this->albumName]正在维护中，我们将带您去看更精彩的内容，敬请期待！", $homeUrl, 3);
        }

        $this->saveUserLatestWatchAlbum($albumData, $templateData);
        $albumID = $data->data->subject_list[0]->subject_id;
        // 采集专辑访问量（每次进入专辑，告诉服务器进入了专辑，服务器记录用户判断专辑的热度）
        AlbumAPI::gatherAlbumAccess($albumID);;
        $platformType = MasterManager::getPlatformType();
        $size = ($platformType == STB_TYPE_HD) ? RES_1280_720 : RES_640_530;

        $isVip = MasterManager::getUserIsVip();
        StatManager::uploadAccessModule($this->userId, $this->albumName);

        // 采集专辑访问量（每次进入专辑，告诉服务器进入了专辑，服务器记录用户判断专辑的热度）
        $this->gatherAlbumAccess($this->albumName);

        // 通过专辑模板ID获取模板信息
        $templateID = $data->data->subject_list[0]->template_id;
        $cornerMarkUrl = $data->data->subject_list[0]->cornermark_img_url;
        $templateInfo = AlbumAPI::getTemplateInfo($templateID);
        $pageInfo = $templateInfo;
        if ($templateInfo["result"] == 0) {
            $templateImgInfo = json_encode($templateInfo["data"]["img_url"]);
        } else {
            $templateImgInfo = "";
        }


        $keyCountdown = "countdown" . $this->albumName . MasterManager::getUserId();
        $valueCountdownStr = StoreAPI::queryStoreData($keyCountdown);
        $valueCountdownJson = json_decode($valueCountdownStr);
        if ($valueCountdownJson->val == null) {
            $countArray = array("showDialog" => "1");
            $valueCountdown = json_encode($countArray);
        } else {
            $valueCountdown = $valueCountdownJson->val;
        }

        /** 当前时间，如：20181208 */
        $time = date('Ymd');

        $epgInfoMap = MasterManager::getEPGInfoMap();         //获取返回EPG地址
        $playUrl = $epgInfoMap["VAStoEPG"];
        $this->assign("domainUrl", $playUrl);

        // 促订规则 -- 暂时屏蔽，后其需要的时候异步调取接口  Common/getOrderConf
        // $payMethod = MasterManager::getPayMethod();
        // $this->assign("payMethod", json_encode($payMethod));
        $promoteOrderConfig = $this->getPromoteOrderConfig();
        $this->assign("payMethod", json_encode($promoteOrderConfig));

        $nowData = parent::getFilter("nowData", '');
        $this->assign("nowData", $nowData);

        $this->assign("commonImgsView", COMMON_IMGS_VIEW);
        $this->assign("carrierId", MasterManager::getCarrierId());
        $this->assign("focus_index", $this->focusIndex);
        $this->assign("focusPages", $this->focusPages);
        $this->assign("size", $size);
        $this->assign("areaCode", MasterManager::getAreaCode());
        $this->assign("moveNum", $this->moveNum);
        $this->assign("moveAlbumNum", $this->moveAlbumNum);
        $this->assign('isVip', $isVip);
        $this->assign('fromId', $this->fromId);
        $this->assign('vipType', $isVip);
        $this->assign('userId', $this->userId);
        $this->assign('data', $albumData); //专题节目
        $this->assign('resourceUrl', RESOURCES_URL); //专题节目
        $this->assign('templateInfo', $templateImgInfo); //专辑图片信息
        $this->assign('cornerMarkUrl', $cornerMarkUrl); //小窗播放角标图片链接
        $this->assign('time', $time); // 当前时间
        $this->assign('backEPGUrl', MasterManager::getIPTVPortalUrl());
        $this->assign("stylesheet", $this->getRenderCssStr($this->albumName));
        $this->assign("platformType", $platformType);
        $this->assign("inner", $this->inner);
        $this->assign("position", $this->position);
        $this->assign("albumName", $this->albumName); // 把专辑别名送到页面上使用
        $this->assign("addScore", $this->addScore); // 把专辑别名送到页面上使用
        $this->assign("templateData", $templateData); //
        $this->assign("templatePageInfo", json_encode($pageInfo['data']));
        $splashHistory = MasterManager::getSplashHistoryLength();
        if ($splashHistory == null) {
            $splashHistory = 0;
        }
        $this->assign("splashHistory", $splashHistory); // 获取欢迎页在浏览器中的历史步长
        $this->assign("userEnterType", MasterManager::getUserFromType()); // 获取用户进入专辑方式
        $this->assign("keyCountdown", $keyCountdown);
        $this->assign("valueCountdown", $valueCountdown);
        $this->assign("isVideoFree", $this->isVideoFree);
        $this->assign("videoTitle", $this->videoTitle);
        $this->assign("atFreeTime", $this->atFreeTime);
        $carrierId = MasterManager::getCarrierId();
    }

    /**
     * 解析session、get参数
     */
    private function parseUrlParam()
    {
        $this->userId = parent::getFilter("userId", MasterManager::getUserId()/*前端未传，从系统取*/);
        $this->focusPages = parent::getFilter("focusPages", $this->focusPages);
        $this->moveNum = parent::getFilter("moveNum", $this->moveNum);
        $this->moveAlbumNum = parent::getFilter("moveAlbumNum", $this->moveAlbumNum);
        $this->focusIndex = parent::getFilter("focus_index", $this->focusIndex);
        $this->videoTitle = parent::getFilter("videoTitle", $this->videoTitle);
        $this->fromId = parent::getFilter("fromId", $this->fromId);
        $this->inner = parent::getFilter("inner", $this->inner, false);
        $this->position = parent::getFilter("position", $this->position);
        $this->albumName = parent::getFilter("albumName", $this->albumName);  // 提取专题名称
        $this->graphicId = parent::getFilter("graphicId", $this->graphicId);  // 提取专题名称
        $this->graphicCode = parent::getFilter("graphicCode", $this->graphicCode);  // 提取专题Code
        $this->isVideoFree = parent::getFilter("isVideoFree", $this->isVideoFree);  // 提取是否可以免费观看视频
        $this->atFreeTime = parent::getFilter("atFreeTime", $this->atFreeTime);  // 提取是否到达免费观看视频时长
        $this->addScore = parent::getFilter("addScore", $this->addScore);  // 提取是否到达免费观看视频时长
    }

    /**
     * 根据专题名称来获取专辑数据
     * @return mixed
     */
    private function getAlbumData($albumName)
    {
        $data = AlbumAPI::getAlbumList(1, 100, $albumName);
        return json_encode($data);
    }

    /**
     * 根据专图文id来获取专辑数据
     * @return mixed
     */
    private function getTemplateData($graphicId, $graphicCode)
    {
        $data = AlbumAPI::getTemplateIdList($graphicId, $graphicCode);
        return json_encode($data);
    }

    /**
     * 根据盒子的版本来确认渲染高清还是标清的页面
     * @param $albumName
     * @return string
     */
    private function getRenderCssStr($albumName)
    {
        if (MasterManager::getPlatformType() == STB_TYPE_HD) {
            return ' <link rel="stylesheet" type="text/css" href="/Public/css/hd/Album/' . $albumName . '/album.css"/>
            <meta charset="utf-8" name="page-view-size" content="1280*720">';
        } else {
            return '<link rel="stylesheet" type="text/css" href="/Public/css/sd/Album/' . $albumName . '/album.css"/>
             <meta charset="utf-8" name="page-view-size" content="644*530">';
        }
    }

    /**
     * 采集专辑访问量
     * @param $albumName
     * @return false|string
     */
    private function gatherAlbumAccess($albumName)
    {
        $data = AlbumAPI::getAlbumIdByAlias($albumName);
        if ($data['result'] == 0) {
            $albumId = $data['album_id'];
            $res = AlbumAPI::gatherAlbumAccess($albumId);
            return json_encode($res);
        }
    }

}