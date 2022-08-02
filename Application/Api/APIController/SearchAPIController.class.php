<?php

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\ServerAPI\Expert;
use Home\Model\Common\ServerAPI\SearchAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Inquiry\InquiryManager;

class SearchAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /** 通过热搜词搜索视频文件 */
    public function searchVideoByHotWordAction()
    {
        $words = isset($_REQUEST['textvalue']) ? $_REQUEST['textvalue'] : '';

        if ($words == "") {
            $resultData = SearchAPI::getHotSearchVideo();
            $this->ajaxReturn($resultData);
        } else {
            $resultData = SearchAPI::getSearchData($words);
            $this->ajaxReturn($resultData);
        }
    }

    /**
     * 通过搜索热词获取各类（视频、专辑、视频集、专家、医生）结果
     */
    public function searchByHotWordAction()
    {
        $words = isset($_REQUEST['textvalue']) ? $_REQUEST['textvalue'] : '';
        $isSearchDoctor = isset($_REQUEST['isSearchDoctor']) ? $_REQUEST['isSearchDoctor'] : '1';

        if ($words == "") {
            // 视频
            $resultData = SearchAPI::getHotSearchVideo();
            if ($resultData->result == 0) {
                $tmp = $resultData->list;
                $resultData->list = new \stdClass();
                $resultData->list->list = $tmp;
            }
            // 专辑
            $album = AlbumAPI::getAllAlbum(0, -1, 1, 20, 1);
            if ($album['result'] == 0)
                $resultData->list->album_list = $album['list'];
            else
                $resultData->list->album_list = array();
            // 视频集
            $series = AlbumAPI::getAllAlbum(1, -1, 1, 20, 1);
            if ($series['result'] == 0)
                $resultData->list->series_list = $series['list'];
            else
                $resultData->list->series_list = array();
            // 医生
            if ($isSearchDoctor == '1') {
                $userId = MasterManager::getUserId();
                $deptId = "0";   // 默认拉取全部
                $page = "1";
                $pageSize = "20";
                $isTestUser = MasterManager::getIsTestUser(); // 白名单测试用户  0、正常用户  1、是测试用户
                $param = array('deptId' => $deptId, 'iptvUserId' => $userId, 'isTest' => $isTestUser, 'page' => $page, 'pageSize' => $pageSize,"area_code" => MasterManager::getAreaCode());
                $doctor = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_DOCTOR_LIST, $param);
                $doctor = json_decode($doctor);
                if ($doctor->code == "0")
                    $resultData->list->doctor_list = $doctor->list;
                else
                    $resultData->list->doctor_list = array();
                // 专家
                $expert = Expert::getExpertList("", 1, 20);
                $expert = json_decode($expert);
                if ($expert->code == "0")
                    $resultData->list->expert_list = $expert->data;
                else
                    $resultData->list->expert_list = array();
            }else {
                $resultData->list->doctor_list = array();
                $resultData->list->expert_list = array();
            }

            $this->ajaxReturn($resultData);
        } else {
            $resultData = SearchAPI::getSearchData($words);
            $this->ajaxReturn($resultData);
        }
    }
}
