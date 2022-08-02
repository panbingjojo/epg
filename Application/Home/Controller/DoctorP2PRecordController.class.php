<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |                                                                        
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2018/3/13 13:57                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Controller;

use Home\Model\Common\ServerAPI\DoctorP2PRecordAPI;
use Home\Model\Common\ServerAPI\FamilyAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class DoctorP2PRecordController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    /**
     * 问诊记录首页界面
     */
    function recordHomeV2UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $returnHomeUrl = parent::requestFilter("returnHomeUrl");
        $phone = MasterManager::getP2PPhone();

        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('phone', $phone);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 问诊记录归档界面
     */
    function recordArchiveV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $inquiryID = parent::requestFilter("inquiryID");
        $memberID = parent::requestFilter("memberID");
        $returnUrl = parent::requestFilter("returnRecordDetailUrl");
        $webArr = FamilyAPI::queryMember();
        $returnHomeUrl = parent::requestFilter("returnHomeUrl");
        $focusId = parent::requestFilter("focusId");
        $page = parent::requestFilter("page", 0);
        $comeFrom = parent::requestFilter('comeFrom', '');

        $this->assign('comeFrom', $comeFrom);
        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("returnRecordDetailUrl", $returnUrl);
        $this->assign("inquiryID", $inquiryID);
        $this->assign("memberID", $memberID);
        $this->assign("member", json_encode($webArr));
        $this->assign("focusId", $focusId);
        $this->assign("page", $page);
        $this->displayEx(__FUNCTION__);
    }


    /**
     * 问诊记录首页界面
     */
    function recordHomeV10UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $count = DoctorP2PRecordAPI::getWaitArchiveCount();
        $memberId = parent::requestFilter("memberId");
        $focusId = parent::requestFilter("focusId", "card-1");
        $res = DoctorP2PRecordAPI::getMemberDataWithInquiry();
        $this->assign("focusId", $focusId);
        $this->assign("memberId", $memberId);
        $this->assign("waitArchiveCount", $count);
        $this->assign("memberWithInquiry", json_encode($res));
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 问诊记录详情界面
     */
    function recordDetailV10UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        if (!empty(parent::requestFilter("memberID"))) {
            $pageCurrent = parent::getFilter("pageCurrent","1");
            $memberID = parent::requestFilter("memberID");
            $memberObj = parent::requestFilter("memberObj");
            $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
            $this->assign("pageCurrent", $pageCurrent);
            $this->assign("memberID", $memberID);
            $this->assign("memberObj", $memberObj);
            $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

            $this->displayEx(__FUNCTION__);
        } else {
            $this->error();
        }
    }

    /**
     * 问诊记录归档界面
     */
    function recordArchiveV10UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $inquiryID = parent::requestFilter("inquiryID");
        $memberID = parent::requestFilter("memberId");
        $webArr = FamilyAPI::queryMember();
        $comeFrom = parent::requestFilter('comeFrom', '');

        $this->assign('comeFrom', $comeFrom);
        $this->assign("inquiryID", $inquiryID);
        $this->assign("memberID", $memberID);
        $this->assign("member", json_encode($webArr));
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 视频问诊记录详情界面（新版联通）
     */
    function recordDetailV13UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        if (!empty(parent::requestFilter("memberID"))) {
            $pageCurrent = parent::getFilter("pageCurrent","1");
            $memberID = parent::requestFilter("memberID");
            $memberObj = parent::requestFilter("memberObj","{}",false);
            $memberName = parent::requestFilter("memberName");
            $isArchived = parent::requestFilter("isArchived");
            $comeFrom = parent::requestFilter('comeFrom', '');
            $initPage = isset($_GET['initPage']) ? $_GET['initPage'] : 1;
            $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
            $this->assign("pageCurrent", $pageCurrent);
            $this->assign("memberID", $memberID);
            $this->assign("memberObj", $memberObj);
            $this->assign("memberName", $memberName);
            $this->assign("isArchived", $isArchived);
            $this->assign("initPage", $initPage);
            $this->assign('comeFrom', $comeFrom);
            $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

            $this->displayEx(__FUNCTION__);
        } else {
            $this->error();
        }
    }

}