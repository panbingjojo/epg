<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/10
 * Time: 0:43
 */

namespace Home\Controller;

use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\CollectAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Common\TextUtils;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\Stats\StatManager;
use Home\Common\Tools\Crypt3DES;

class PlayerController extends BaseController
{
    private $channel = ""; // 直播通道

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {

        return DisplayManager::getDisplayPage(__FILE__, array(
            $this->isDirectToEpgPlayer() ? 'direct' : 'default',
            $this->isNoProgressBarPlayer() ? 'noProgressBar' : 'default'
        ));
    }

    /**
     * 视频播放页面
     */
    public function indexV1UI()
    {
        $this->initCommonRender();

        $array['commonImgsView'] = COMMON_IMGS_VIEW;
        $array['userId'] = MasterManager::getUserId();
        $array['returnUrl'] = !empty(parent::getFilter('returnUrl')) ? parent::getFilter('returnUrl') : MasterManager::getIPTVPortalUrl();
        if (CARRIER_ID == CARRIER_ID_QINGHAIDX) {
            $array['playerCallbackUrl'] = "http://" . $_SERVER['HTTP_HOST'] . IntentManager::getBackPageUrl();
        } else {
            $array['playerCallbackUrl'] = $this->buildPlayerCallbackURL();
        }
        $array['platformType'] = MasterManager::getPlatformType();  //平台类型
        $array['size'] = $array['platformType'] == STB_TYPE_HD ? RES_1280_720 : RES_640_530;
        $array['styleName'] = $array['platformType'] == STB_TYPE_HD ? 720 : 644;
        $array['playerPlatForm'] = MasterManager::getPlayerPlatform();

        $epgInfoMap = MasterManager::getEPGInfoMap();         //获取返回EPG地址
        $playUrl = $epgInfoMap["VAStoEPG"];
        $array["domainUrl"] = $playUrl;
        $array["portalURL"] = $epgInfoMap["portalURL"];
        $array["cardId"] = $epgInfoMap["cardId"];
        $array["userToken"] = $epgInfoMap['userToken'];

        $isPlaying = parent::getFilter('isPlaying') != "" ? parent::getFilter('isPlaying') : 0;
        if ($isPlaying == 1) {
            $videoInfo = MasterManager::getPlayParams() ? MasterManager::getPlayParams() : null;
        } else {
            $videoInfo = parent::getFilter("videoInfo", null, false);
        }
        if (CARRIER_ID == CARRIER_ID_SHANDONGDX_HAIKAN || CARRIER_ID == CARRIER_ID_HAIKAN_APK) {
            //将坑位ID传递到播控页
            $clickId = parent::getFilter("clickId", null, false);
            $this->assign("clickId", $clickId);
        }
        $allVideoInfo = parent::getFilter("allVideoInfo", '[]', false);
        $albumName = parent::getFilter("albumName", '', false);
        $array['albumName'] = $albumName;
        $array['allVideoInfo'] = $allVideoInfo;

        if (is_array($videoInfo)) {
            $array["videoInfo"] = json_encode($videoInfo);
        } else {
            $array["videoInfo"] = $videoInfo;
            $videoInfo = json_decode($videoInfo, true);
        }

        //上报模块访问界面(remark = 视频编码-视频标题)
        $unionCode = $videoInfo['unionCode'];
        $remark = $unionCode . "-" . $videoInfo['title'];
        $this->channel = $videoInfo['videoType']; // 直播通道
        StatManager::uploadAccessModule(MasterManager::getUserId(), null, $remark);

        if ($videoInfo != null) {
            $array['sourceId'] = isset($videoInfo['sourceId']) && !empty($videoInfo['sourceId']) ? $videoInfo['sourceId'] : -1;
            $initUrl = isset($videoInfo['videoUrl']) && !empty($videoInfo['videoUrl']) ? $videoInfo['videoUrl'] : "";
            $array['videoUrl'] = $initUrl;
            $array['title'] = isset($videoInfo['title']) && !empty($videoInfo['title']) ? $videoInfo['title'] : 0;
            $array['freeSeconds'] = isset($videoInfo['freeSeconds']) && !empty($videoInfo['freeSeconds']) ? $videoInfo['freeSeconds'] : 0;
            $array['durationTime'] = isset($videoInfo['durationTime']) && !empty($videoInfo['durationTime']) ? $videoInfo['durationTime'] : "00:00:00";
            $array['userType'] = isset($videoInfo['userType']) && !empty($videoInfo['userType']) ? $videoInfo['userType'] : 0;
        } else {
            $array['videoUrl'] = "";
            $array['sourceId'] = "";
            $array["videoInfo"] = "{}";
            $array['freeSeconds'] = 0;
            $array['durationTime'] = "00:00:00";
            $array['userType'] = 2;
        }

        $array['resourcesUrl'] = RESOURCES_URL;
        $array['isVip'] = MasterManager::getUserIsVip();

        //筛选收藏列表, 如果收藏isCollect = 0, 否则 等于1
        $data = CollectAPI::getCollectList();
        $rt = $data['list'];
        $array['collectStatus'] = 1; //默认未收藏
        foreach ($rt as $v) {
            if ($array['sourceId'] == $v['source_id']) {
                $array['collectStatus'] = 0;
                break;
            }
        }

        $subjectId = parent::getFilter("subjectId", '');
        $retainMode = "";
        $carrierId = MasterManager::getCarrierId();
        if ($carrierId == CARRIER_ID_NINGXIADX
            && MasterManager::isEnterHospitalModule() == 1) { // 针对宁夏电信做特殊判断
            // 判断是否从区议医院进入决定挽留页模式
            $retainMode = "v2";
        }
        $array['albumArr'] = $this->parseAlbum($subjectId);
        $array["subjectId"] = $subjectId;
        $array["retainMode"] = $retainMode;
        //added by zds 2020-06-15 begin
        $albumDetail = VideoAPI::getAlbumDetail($subjectId);
        $array["albumDetail"] = $albumDetail;
        //added by zds 2020-06-15 end
        $this->assign($array);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
        // 第三方标识
        $this->assign("spid", SPID);
        $EPGInfoMap = MasterManager::getEPGInfoMap();
        if ($carrierId == CARRIER_ID_CHONGQINGDX) {
            $this->assign("partner", $EPGInfoMap['partner']);
            $this->assign("serverPath", $EPGInfoMap['serverPath']);
        }

        if ($carrierId == CARRIER_ID_GUANGDONGGD_NEW) {
            $this->assign("client", $EPGInfoMap['client']);
            $this->assign("regionCode", $EPGInfoMap['caRegionCode']);
            $this->assign("serviceType", $EPGInfoMap['serviceType']);
        }

        if ($carrierId == CARRIER_ID_GUANGDONGYD) {
            $isEnterFromYsten = MasterManager::getEnterFromYsten();
            if($isEnterFromYsten){
                $this->assign("productId", PRODUCT_ID);
            }else{
                $this->assign("productId", PRODUCT_ID_FOR_YST);
            }
            $this->assign("isEnterFromYsten", MasterManager::getEnterFromYsten());
        }

        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('userToken', $userToken);
        $this->assign('cwsWXServerUrl', CWS_WXSERVER_URL_OUT);
        $this->assign('lmp', MasterManager::getEnterPosition());
        $this->assign('stbId', MasterManager::getSTBId());

        // 获取inner参数 (0 -- 从局方的推荐位点击直接进入应用的具体模块；1 -- 应用内部其他推荐位点击进入)
        $inner = isset($_GET['inner']) ? $_GET['inner'] : 1;
        LogUtils::info("playerController::inner-->" . $inner . " Get inner-->" . $_GET['inner']);
        $this->assign('inner', $inner);

        $this->displayEx(__FUNCTION__);
    }

    public function smallV1UI()
    {
        $this->initCommonRender();
        //统计 - 上报页面访问
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $assignArr = array();
        $assignArr["position"] = parent::getFilter("position", "{}", false);
        $assignArr["videoInfo"] = parent::getFilter("videoInfo", null, false);
        $assignArr["allVideoInfo"] = parent::getFilter("allVideoInfo", '[]', false);
        $this->assign($assignArr);
        $this->displayEx(__FUNCTION__);
    }


    public function APKPlayUI()
    {
        $this->initCommonRender();
        $this->displayEx(__FUNCTION__);
    }


    /**
     * 将专辑转换为videoInfo数据对象
     * @param $subjectId 专辑id
     * @return string
     */
    public function parseAlbum($subjectId)
    {
        $albumArr = array();
        if (empty($subjectId)) {
            LogUtils::error("subjectId is empty");
            return json_encode($albumArr);
        }
        $result = VideoAPI::getAlbumDetail($subjectId);
        if ($result->result === 0) {
            $videoListArr = $result->data->video_list;
            $subjectList = $result->data->subject_list[0];
            foreach ($videoListArr as $v) {
                if (MasterManager::getPlatformType() == "hd") {
                    $videoUrl = $v->ftp_url->gq_ftp_url;
                } else {
                    $videoUrl = $v->ftp_url->bq_ftp_url;
                }

                $tempVideoInfo = array(
                    "sourceId" => $v->source_id,
                    "videoUrl" => $videoUrl,
                    "title" => $v->title,
                    "type" => $subjectList->model_type,
                    "userType" => $v->user_type,
                    "freeSeconds" => $v->free_seconds,
                    "entryType" => "1",
                    "entryTypeName" => "play",
                    "showStatus" => $v->show_status
                );
                array_push($albumArr, $tempVideoInfo);
            }
        }
        return json_encode($albumArr);
    }

    /**
     * @Brief:此函数用于接收播放器 结束播放视频时的返回
     */
    public function playerCallbackUI()
    {
        LogUtils::info("playerCallbackUI !!!!!!!!!");
        IntentManager::back();
    }

    /**
     * @Brief:此函数用于构建播放器返回URL
     */
    private function buildPlayerCallbackURL()
    {
        $intent = IntentManager::createIntent("playerCallback");

        $url = IntentManager::intentToURL($intent);
        if (!TextUtils::isBeginHead($url, "http://")) {
            $url = "http://" . $_SERVER['HTTP_HOST'] . $url;  // 回调地址需要加上全局路径
        }
        LogUtils::info("Player::buildPlayerCallbackURL() Url: " . $url);
        return $url;
    }

    /**
     * @Brief:此函数用于判断是否直接跳转到局方的播放器页
     * @return: true--  直接跳转去局方播放器， false -- 不去局方播放器
     */
    private function isDirectToEpgPlayer()
    {
        // 海南电信EPG，高清盒子，走局方统一播放器
        if (MasterManager::getCarrierId() == CARRIER_ID_QINGHAIDX) {
            if ($this->channel == "channel") {
                return false;
            }
            return true;
        }

        $stbModel = MasterManager::getSTBModel();
        if (defined("DIRECT_GO_EPG_PLAYER")) {
            $modelList = eval(DIRECT_GO_EPG_PLAYER);
            // 遍历得到禁止访问的映射表
            foreach ($modelList as $key => $value) {
                if (preg_match("/($value)/", "$stbModel")) {
                    LogUtils::info("[$modelList] is go epg player!!!");
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @Brief:此函数用于判断是否因为播放器原因，无法获取当前进度条以及视频总时长
     *          如果是，则去专门的播放器；否则就去原来该使用的播放器
     * @return: true -- 是， false -- 否
     */
    private function isNoProgressBarPlayer()
    {
        $stbModel = MasterManager::getSTBModel();
        if (defined("DIRECT_GO_SPECIAL_PLAYER")) {
            $modelList = eval(DIRECT_GO_SPECIAL_PLAYER);
            // 遍历得到禁止访问的映射表
            foreach ($modelList as $key => $value) {
                if (preg_match("/($value)/", "$stbModel")) {
                    LogUtils::info("[$modelList] is go special player!!!");
                    return true;
                }
            }
        }
        return false;
    }
}