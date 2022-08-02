<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/1
 * Time: 上午9:46
 */

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\CollectAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Video\VideoManager;

class PlayerAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     * @brief: 保存视频信息，目前主要用来处理当用于点击视频时，在去局方订购之前，
     *  先保存视频信息，待订购成功回来，再取出视频数据，然后去播放器页进行播放
     * @throws \Think\Exception
     */
    public function storeVideoInfoAction()
    {
        $videoInfo = isset($_POST["videoInfo"]) ? $_POST["videoInfo"] : null;
        LogUtils::info("user[" . MasterManager::getUserId() . "] storeVideoInfo videoInfo >>> ". $videoInfo);
        $videoInfo = json_decode($videoInfo, true);
        MasterManager::setPlayParams($videoInfo);
        LogUtils::info("user[" . MasterManager::getUserId() . "] storeVideoInfo ok");
        $ret = array('result' => 0);
        $this->ajaxReturn($ret);
    }

    /**
     * 播放视频结束后，向CWS获取播放挽留随机4个推荐视频
     */
    public function getRecommendVideoInfoAction()
    {
        $userId = isset($_REQUEST["userId"]) && !empty($_REQUEST["userId"]) ? $_REQUEST["userId"] : MasterManager::getUserId();
        $videoUserType = isset($_REQUEST["videoUserType"]) && !empty($_REQUEST["videoUserType"]) ? $_REQUEST["videoUserType"] : 0;
        // 山东电信 拉取挽留页小包推荐视频
        // $modelType = $_REQUEST["modelType"] ? $_REQUEST["modelType"] : '';
        if((MasterManager::getCarrierId() == '370092' || MasterManager::getCarrierId() == '000051') && $_REQUEST["modelType"]){
            $videoInfo = VideoAPI::getPacketVideoRecommend($userId, $_REQUEST["modelType"]);
        }else{
            $videoInfo = VideoManager::getRecommennd($userId, $videoUserType);
        }
        self::appendCollectFlagToRecommendVideos($videoInfo);
        $this->ajaxReturn($videoInfo);
    }

    /**
     * 对每个推荐视频追加收藏标志，以供全屏大窗挽留推荐页前端方便使用！
     * @param $randomVideoData //随机推荐视频数据
     * @author Songhui on 2019-12-17
     */
    private static function appendCollectFlagToRecommendVideos(&$randomVideoData)
    {
        // 检验“随机视频列表”合法性
        if (is_null($randomVideoData) || !is_object($randomVideoData) || !is_array($randomVideoData->data) || count($randomVideoData->data) == 0) {
            return;
        }
        // 检验“收藏数据列表”合法性
        $collectData = CollectAPI::getCollectList();
        if (is_null($collectData) || !is_array($collectData) || !is_array($collectData["list"]) || count($collectData["list"]) == 0) {
            return;
        }

        $randomList = $randomVideoData->data; //随机推荐视频列表（目前cws返回4个）
        $collectList = $collectData["list"]; //收藏数据列表
        foreach ($collectList as $itemCollect) {
            $sourceId = $itemCollect["source_id"];
            foreach ($randomList as $itemVideo) {
                $isCollected = $sourceId == $itemVideo->source_id;
                $itemVideo->collect_status = $isCollected ? 0 : 1;//[增加]::定义收藏状态（0-已收藏 1-未收藏）
            }
        }
    }

    public function savePlayParamAction()
    {
        $assetId = $_REQUEST["assetId"];
        $time = $_REQUEST["time"];
        $paramInfo = array(
            "assetId" => $assetId,
            "time" => $time,
        );
        $json = array(
            "user_account" => MasterManager::getAccountId(),
            "account_type" => 1,
            "param_info" => json_encode($paramInfo)
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_UPLOAD_INQUIRY_PARAM);
        $result = $httpManager->requestPost($json);
        $this->ajaxReturn($result, 'EVAL');
    }

    public function getPlayParamAction()
    {
        $json = array(
            "user_account" => MasterManager::getAccountId(),
            "account_type" => 1,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_INQUIRY_GET_INQUIRY_PARAM);
        $result = $httpManager->requestPost($json);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * @brief: 读取用户地址，
     */
    public function getUserServerPathAction()
    {
        if (MasterManager::getCarrierId() == CARRIER_ID_CHONGQINGDX) {
            $EPGInfoMap = MasterManager::getEPGInfoMap();
            $this->assign("partner", $EPGInfoMap['partner']);
            $this->assign("serverPath", $EPGInfoMap['serverPath']);
            $ret = array('result' => 0,'serverPath'=>$EPGInfoMap['serverPath'],'partner'=>$EPGInfoMap['partner']);
            $this->ajaxReturn($ret);
        }
    }
}
