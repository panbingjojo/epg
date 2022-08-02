<?php
// 本类由系统自动生成，仅供测试用途
namespace Home\Controller;

use Home\Model\Common\ServerAPI\UnifiedPlayerAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Common\SystemManager;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;
use Home\Model\Video\VideoManager;

class IntroVideoController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__,array());
    }

    /**
     * 视频简介页 视图1
     */
    public function singleUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = parent::getFilter('userId', MasterManager::getUserId());
        $inner = parent::getFilter('inner', 1);
        $fromId = parent::getFilter('fromId', 0); // 进入来源
        $videoInfo = parent::getFilter("videoInfo", null,false);
        $isPlaying = parent::getFilter('isPlaying');
        //支付返回，取缓存的参数
        if ($isPlaying === "1") {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
            $videoInfo = json_encode($videoInfo);
        }
        $video = json_decode($videoInfo, true);
        $isAllow = VideoManager::getVideoAllow($userId, $video['sourceId']);
        $isAllow = json_decode($isAllow, true);
        // 滚动字幕
        $marqueeText = SystemManager::getMarqueeText();

        $this->assign('inner', $inner);
        $this->assign('fromId', $fromId);
        $this->assign('videoInfo', $videoInfo);
        $this->assign('price', $video['price']);
        $this->assign('isAllow', $isAllow["result"]);
        $this->assign('marqueeText', $marqueeText);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 视频简介页 视图1
     */
    public function listUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = parent::getFilter('userId', MasterManager::getUserId());
        $inner = parent::getFilter('inner', 1);
        $page = parent::getFilter('page', 1);
        $modeType = parent::getFilter('modeType');
        $introVideo = parent::getFilter('introVideo',"",false);
        $isPlaying = parent::getFilter('isPlaying');
        //支付返回，取缓存的参数
        if ($isPlaying === "1") {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
            $modeType = $videoInfo["modeType"];
            $introVideo = $videoInfo["introVideo"];
        }
        $fromId = parent::getFilter('fromId', 0);// 进入来源
        // 滚动字幕
        $marqueeText = SystemManager::getMarqueeText();

        $pageNum = 50; // 数量
        $data = VideoAPI::getVideoByClassifyId($userId, $modeType, $page, $pageNum);

        $this->assign('inner', $inner);
        $this->assign('page', $page);
        $this->assign('modeType', $modeType);
        $this->assign('videoInfoList', $data);
        $this->assign('introVideo', $introVideo);
        $this->assign('fromId', $fromId);
        $this->assign('marqueeText', $marqueeText);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 视频简介页 视图1
     */
    public function detailUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = parent::getFilter('userId');
        $inner = parent::getFilter('inner', 1);
        // 进入来源
        $fromId = parent::getFilter('fromId', 0);
        // 根据盒子的版本来确认渲染高清还是标清的页面
        $platformType = MasterManager::getPlatformType();
        // 滚动字幕
        $marqueeText = SystemManager::getMarqueeText();

        $packageId = parent::getFilter('packageId');
        $data = VideoAPI::getVideoByPackageId($userId, $packageId);
        $data = json_decode($data, true);
        $videoInfo['sourceId'] = $data['data']['source_id'];
        $videoUrl = json_decode($data['data']['ftp_url'], true);
        $videoInfo['videoUrl'] = $platformType == "hd" ? $videoUrl['gq_ftp_url'] : $videoUrl['bq_ftp_url'];
        $videoInfo['title'] = $data['data']['title'];
        $videoInfo['type'] = $data['data']['model_type'];
        $videoInfo['userType'] = $data['data']['user_type'];
        $videoInfo['freeSeconds'] = $data['data']['free_seconds'];
        $videoInfo['entryType'] = 7;
        $videoInfo['entryTypeName'] = '';
        $videoInfo['focusIdx'] = '';
        $videoInfo['introImageUrl'] = $data['data']['intro_image_url'];
        $videoInfo['introTxt'] = $data['data']['intro_txt'];
        $videoInfo['price'] = $data['data']['price'];
        $videoInfo['validDuration'] = $data['data']['valid_duration'];
        $isAllow = VideoManager::getVideoAllow($userId, $videoInfo['sourceId']);
        $isAllow = json_decode($isAllow, true);

        $this->assign('userId', $userId);
        $this->assign('inner', $inner);
        $this->assign('fromId', $fromId);
        $this->assign('videoInfo', json_encode($videoInfo));
        $this->assign('price', $videoInfo['price']);
        $this->assign('isAllow', $isAllow["result"]);
        $this->assign('marqueeText', $marqueeText);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 视频简介页 视图1
     */
    public function detailV2UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = parent::getFilter('userId');
        $inner = parent::getFilter('inner', 0);
        // 根据盒子的版本来确认渲染高清还是标清的页面
        $platformType = MasterManager::getPlatformType();
        // 滚动字幕
        $marqueeText = SystemManager::getMarqueeText();

        $unionCode = parent::getFilter('unionCode');
        $data = VideoAPI::getVideoListByUnionCode($unionCode);
        $data = json_decode(json_encode($data), true);
        $videoInfo['sourceId'] = $data['data']['source_id'];
        $videoUrl = json_decode($data['data']['ftp_url'], true);
        $videoInfo['videoUrl'] = $platformType == "hd" ? $videoUrl['gq_ftp_url'] : $videoUrl['bq_ftp_url'];
        $videoInfo['title'] = $data['data']['title'];
        $videoInfo['type'] = $data['data']['model_type'];
        $videoInfo['userType'] = $data['data']['user_type'];
        $videoInfo['freeSeconds'] = $data['data']['free_seconds'];
        $videoInfo['entryType'] = 7;
        $videoInfo['entryTypeName'] = '';
        $videoInfo['focusIdx'] = '';
        $videoInfo['introImageUrl'] = $data['data']['image_url'];
        $videoInfo['introTxt'] = $data['data']['intro_txt'];
        $videoInfo['price'] = $data['data']['price'];
        $videoInfo['validDuration'] = $data['data']['valid_duration'];

        $this->assign('userId', $userId);
        $this->assign('inner', $inner);
        $this->assign('videoInfo', json_encode($videoInfo));
        $this->assign('price', $videoInfo['price']);
        $this->assign('marqueeText', $marqueeText);
        $this->assign('unionCode', $unionCode);

        // 查询统一收藏状态
        $collectionStatusRes = UnifiedPlayerAPI::queryCollectionStatus($videoInfo['videoUrl']);
        $collectionStatusRes = json_decode($collectionStatusRes);
        if ($collectionStatusRes->code == -5) {
            $isCollected = 0;
        } else {
            $isCollected = 1;
        }
        $this->assign('isCollected', $isCollected);

        $this->displayEx(__FUNCTION__);
    }
}