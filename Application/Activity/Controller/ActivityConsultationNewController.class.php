<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  | 0元免费问诊活动
  +----------------------------------------------------------------------+
  | Author: yzq                                                          |
  | Date: 2018/7/9 9:07                                                |
  +----------------------------------------------------------------------+
 */


namespace Activity\Controller;


use Home\Controller\BaseController;
use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class ActivityConsultationNewController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array(
            "guideUI" => "/ActivityConsultationNew/V1/index",
            "ruleUI" => "ActivityConsultationNew/V1/rule",
            "recordUI" => "ActivityConsultationNew/V1/record",
            "detailUI" => "ActivityConsultationNew/V1/detail",
            "codeUI" => "ActivityConsultationNew/V1/code",
            "successUI" => "ActivityConsultationNew/V1/success",
            "dialogUI" => "ActivityConsultationNew/V1/dialog",
        );
    }

    //活动首页
    public function guideUI()
    {

        // $this->initCommonRender();
        $pageCurrent = parent::getFilter("pageCurrent", 1);
        $focusId = parent::getFilter("focusId", null);
        $inner = parent::getFilter("inner", 1,false);
        $activityName = parent::getFilter('activityName', MasterManager::getSubId());
        $isVip = MasterManager::getUserIsVip();
        // 上报用户数据
        StatManager::uploadAccessModule("");

//        $goHtml = "ActivityConsultationNew/" . COMMON_ACTIVITY_VIEW . "/index";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        if(!isset($platformType))
            $platformType = 'hd';
        $this->assign("clinicArr", $this->getClinicArr());
        $this->assign("pageCurrent", $pageCurrent);
        $this->assign("inner", $inner);
        $this->assign("focusId", $focusId);

        $this->assign('platformType', $platformType);
        $this->assign('activityName', $activityName);
        $this->assign('inner', $inner);
        $this->assign('time', time()); // 当前时间
        $this->assign('userId', MasterManager::getUserId()); // 用户Id
        $this->assign('userAccount', MasterManager::getAccountId()); // 用户账号
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("isVip", $isVip);
//        $this->display($goHtml);
        $this->displayEx(__FUNCTION__);


//        $goHtml = "ActivityConsultationNew/" . COMMON_ACTIVITY_VIEW . "/test";
//        $platformType = MasterManager::getPlatformType();                 //平台类型
//        $this->assign('platformType', $platformType);
//        $this->assign('platformType', $platformType);
//        $this->display($goHtml);

    }

    //活动规则
    public function ruleUI()
    {
        // 上报用户数据
        StatManager::uploadAccessModule("");
        $this->initCommonRender();
//        $goHtml = "ActivityConsultationNew/" . COMMON_ACTIVITY_VIEW . "/rule";
        $platformType = MasterManager::getPlatformType();                 //平台类型\
        if(!isset($platformType))
            $platformType = "hd";
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //约诊记录
    public function recordUI()
    {
        // 上报用户数据
        StatManager::uploadAccessModule("");
        $this->initCommonRender();
        $clinicId = parent::getFilter("clinicId");
        $this->assign('clinicId', $clinicId);
//        $goHtml = "ActivityConsultationNew/" . COMMON_ACTIVITY_VIEW . "/record";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        if(!isset($platformType))
            $platformType = "hd";
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("cwsUrlOut", $this->getCwsOutUrl());
        $this->assign('platformType', $platformType);
        $page = parent::getFilter("page", 1);
        $this->assign('page', $page);
        $this->displayEx(__FUNCTION__);
    }

    //专家详情
    public function detailUI()
    {
        // 上报用户数据
        StatManager::uploadAccessModule("");
        $this->initCommonRender();
        $clinicId = parent::getFilter("clinicId");
//        $goHtml = "ActivityConsultationNew/" . COMMON_ACTIVITY_VIEW . "/detail";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign('clinicId', $clinicId);
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //二维码扫码界面
    public function codeUI()
    {
        // 上报用户数据
        StatManager::uploadAccessModule("");
        $this->initCommonRender();
        $clinicId = parent::getFilter("clinicId");
//        $goHtml = "ActivityConsultationNew/" . COMMON_ACTIVITY_VIEW . "/code";
        $platformType = MasterManager::getPlatformType();                 //平台类型

        $this->assign('clinicId', $clinicId);
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //约诊成功
    public function successUI()
    {
        // 上报用户数据
        StatManager::uploadAccessModule("");
        $this->initCommonRender();
        $appointmentID = parent::getFilter("appointmentID");
        $this->assign("appointmentID", $appointmentID);
//        $goHtml = "ActivityConsultationNew/" . COMMON_ACTIVITY_VIEW . "/success";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //约诊过程中产生的弹框
    public function dialogUI()
    {
        // 上报用户数据
        StatManager::uploadAccessModule("");
        $this->initCommonRender();
        $flag = parent::getFilter("flag");

//        $goHtml = "ActivityConsultationNew/" . COMMON_ACTIVITY_VIEW . "/dialog";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign('flag', $flag);
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    private function getClinicArr()
    {
        $arr = array(
            "data" => array(
                2026
            )
        );
        return json_encode($arr);
    }
    //获取cws外网访问地址
    private function getCwsOutUrl()
    {
        $needReplaceStr = trim(strrchr(CWS_EXPERT_URL_OUT, '/'), '/');
        $cwsUrlOut = str_replace(array($needReplaceStr), "", CWS_EXPERT_URL_OUT);
        LogUtils::info("cwsUrlOut=" . $cwsUrlOut);
        return $cwsUrlOut;
    }


}
