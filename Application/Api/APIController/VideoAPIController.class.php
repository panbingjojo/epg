<?php

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\ServerAPI\PlayerAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Entry\MasterManager;

class VideoAPIController extends BaseController
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
     * 获取对应分类的健康视频列表
     */
    public function getVideoListAction()
    {
        $model_type = $_REQUEST['model_type'];
        $resultData = VideoAPI::getVideoList(1, PHP_INT_MAX, $model_type);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取视频分类
     */
    public function getVideoClassAction()
    {
        $resultData = VideoAPI::getVideoClass(null); // 传递null,默认获取一级分类
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取视频播放历史
     */
    public function getHistoryPlayListAction()
    {
        $currentPage = $_REQUEST['currentPage'];
        $pageNum = $_REQUEST['pageNum'];
        $resultData = VideoAPI::getHistoryPlayList($currentPage, $pageNum);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 删除历史播放视频
     */
    public function deleteHistoryPlayAction()
    {
        $source_id = $_REQUEST['source_id'];
        $resultData = VideoAPI::deleteHistoryPlay($source_id);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 获取专辑视频列表
     */
    public function getAlbumVideoListAction()
    {
        $page = $_REQUEST['page'];
        $pageNum = $_REQUEST['pageNum'];
        $albumName = $_REQUEST['albumName'];
        $resultData = AlbumAPI::getAlbumList($page,  $pageNum, $albumName);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 根据视频播放地址获取视频信息
     */
    public function getVideoListByPlayUrlAction()
    {
        $file_url_list = $_REQUEST['data'];
        $file_url_list = json_decode($file_url_list, true);
        $resultData = VideoAPI::getVideoListByPlayUrl($file_url_list);
        $this->ajaxReturn(json_encode($resultData));
    }

    /**
     * 根据视频union_code获取视频信息
     */
    public function getVideoListByUnionCodeAction()
    {
        $unionCode = $_REQUEST['union_code'];
        $resultData = VideoAPI::getVideoListByUnionCode($unionCode);
        $this->ajaxReturn(json_encode($resultData));
    }

    public function getPlayUrlAction()
    {
        $programId = isset($_REQUEST["program_id"]) ? $_REQUEST["program_id"] : "";
        $ret = array(
            "result" => -1,
            "playUrl" => "",
        );
        if (CARRIER_ID == CARRIER_ID_SHANDONGDX_APK ||
            CARRIER_ID == CARRIER_ID_HAIKAN_APK
            /*|| $carrierId == CARRIER_ID_SHANXIYD*/) {
            // 山东电信、陕西电信获取真正的用户地址
            if (!empty($programId)) {
                $result = VideoAPI::getPlayUrl($programId);
                $result = json_decode($result);
                if ($result &&  $result->returncode == 0 && count($result->urls) > 0) {
                    LogUtils::info("PlayerAPIController::getPlayUrlAction real playurl:" . $result->urls[0]->playurl);
                    $ret['result'] = 0;
                    $ret['playUrl'] =  $result->urls[0]->playurl;
                } else {
                    LogUtils::info("PlayerAPIController::getPlayUrlAction get Real playurl failed:" . $result->returncode);
                }
            }
        }/*else if($carrierId == CARRIER_ID_HUNANYX){
            if (!empty($programId)) {
                $result = PlayerAPI::getPlayUrl430012($programId);
                LogUtils::info("getPlayUrlAction::result:" . $result);
                $result = json_decode($result);
                if ($result &&  $result->result.state == 0 ) {
                    $ret['result'] = 0;
                    $ret['playUrl']= $result->playAddress;
                    LogUtils::info("getPlayUrlAction::getPlayUrlAction real playurl:" . $result->playAddress);
                } else {
                    LogUtils::info("getPlayUrlAction::getPlayUrlAction get Real playurl failed:" . $result->result.state.reason);
                }
            }
        }*/
        $this->ajaxReturn(json_encode($ret),"EVAL");
    }
}
