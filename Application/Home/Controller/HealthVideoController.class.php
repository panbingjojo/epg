<?php
/*
  +----------------------------------------------------------------------+
  | IPTV -健康视频栏目                                                                |
  +----------------------------------------------------------------------+
  |  健康视频栏目相关功能
  +----------------------------------------------------------------------+
  | Author: yzq                                                          |
  | Date: 2018/3/13 13:57                                                |
  +----------------------------------------------------------------------+
 */

namespace Home\Controller;


use Home\Model\Common\ServerAPI\CollectAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\Stats\StatManager;

class HealthVideoController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function videoListV10UI()
    {
        $renderParamsArray =$this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $areaCode = $renderParamsArray['areaCode'];
        $enterPosition = $renderParamsArray['enterPosition'];

        $pageConfigObj = MainHomeManager::getPageDataForModelV13($areaCode, 'hd', $enterPosition);
        $bgImageArray = $pageConfigObj->bgImageArray;
        $this->assign('themePicture', $bgImageArray[CLASSIFY_TAB_1]);

        // 获取健康视频分类
        $videoClass = VideoAPI::getVideoClass(null);
        $modelType = null;
        if ($videoClass->result == 0 && count($videoClass->data) > 0) {
            $modelType = isset($_GET['modelType']) && $_GET['modelType'] != "" ? $_GET['modelType'] : $videoClass->data[0]->model_type;
            // 获取健康视频列表
            $videoList = VideoAPI::getVideoList(1, PHP_INT_MAX, $modelType);
        }

        $this->assign("videoClass", $videoClass);
        $this->assign("videoList", $videoList);
        // 当前加载的数据的分类
        if (isset($modelType) && $modelType != null && $_GET['modelType'] != "") {
            $this->assign("modelType", $modelType);
        } else {
            $this->assign("modelType", "");
        }

        // 焦点保持相关
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        $pageCurrent = isset($_GET['pageCurrent']) ? $_GET['pageCurrent'] : 1;
        $this->assign("pageCurrent", $pageCurrent);
        $navFocusIndex = isset($_GET['navFocusIndex']) ? $_GET['navFocusIndex'] : "";
        $this->assign("navFocusIndex", $navFocusIndex);
        $navPageCurrent = isset($_GET['navPageCurrent']) ? $_GET['navPageCurrent'] : 0;
        $this->assign("navPageCurrent", $navPageCurrent);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 视频连续剧列表
     */
    public function videoSetV10UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        /*$modeType = $_GET['modeType'];
        $modeTitle = $_GET['modeTitle'];
        $pageCurrent = $_GET['pageCurrent'];
        $focusIndex = $_GET['focusIndex'];
        $videoChannel = VideoAPI::getVideoByClassifyId(MasterManager::getUserId(), $modeType, 1, 10000);

        $this->assign('videoChannel', json_decode($videoChannel));
        $this->assign('modeTitle', $modeTitle);
        $this->assign('modeType', $modeType);
        $this->assign('pageCurrent', $pageCurrent);
        $this->assign('focusIndex', $focusIndex);*/

        //专辑代码转换为专辑ID，拉取视频数据
        $albumData = AlbumAPI::getAlbumIdByAlias($_GET['subject_id']);
        if($albumData['result'] == 0 && MasterManager::getCarrierId() == CARRIER_ID_MANGOTV_LT){
            $albumDetail = VideoAPI::getAlbumDetail($albumData['album_id']);
        }else {
            // 获取专辑详情
            $albumDetail = VideoAPI::getAlbumDetail($_GET['subject_id']);
         }
        // 获取收藏列表（专辑）
        $collectList = CollectAPI::getCollectListNew(2);
        $isCollect = 0;
        if ($collectList['result'] == 0) {
            for ($i = 0; $i < count($collectList); $i++) {
                if ($collectList['list'][$i]['subject_id'] == $_GET['subject_id']) {
                    $isCollect = 1;
                    break;
                }
            }
        }

        $this->assign("isCollect", $isCollect);
        $this->assign("albumDetail", $albumDetail);

        // 焦点保持相关
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        $this->assign("focusIndex", $focusIndex);
        $pageCurrent = isset($_GET['pageCurrent']) ? $_GET['pageCurrent'] : -1;
        $this->assign("pageCurrent", $pageCurrent);
        $navFocusIndex = isset($_GET['navFocusIndex']) ? $_GET['navFocusIndex'] : "";
        $this->assign("navFocusIndex", $navFocusIndex);
        $navPageCurrent = isset($_GET['navPageCurrent']) ? $_GET['navPageCurrent'] : -1;
        $this->assign("navPageCurrent", $navPageCurrent);
        $subject_id = isset($_GET['subject_id']) ? $_GET['subject_id'] : "";
        $this->assign("subject_id", $subject_id);

        $this->displayEx(__FUNCTION__);
    }

}