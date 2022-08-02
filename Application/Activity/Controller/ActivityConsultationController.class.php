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

class ActivityConsultationController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        // TODO: Implement config() method.
//        return array();

        $carrierId = MasterManager::getCarrierId();
        switch ($carrierId) {
            case CARRIER_ID_CHINAUNICOM:
                return array(
                    "guideUI" => "/ActivityConsultation/V1/index",
                    "ruleUI" => "ActivityConsultation/V1/rule",
                    "recordUI" => "ActivityConsultation/V1/record",
                    "detailUI" => "ActivityConsultation/V1/detail",
                    "codeUI" => "ActivityConsultation/V1/code",
                    "successUI" => "ActivityConsultation/V1/success",
                    "dialogUI" => "ActivityConsultation/V1/dialog",
                );
                break;
            case CARRIER_ID_NINGXIAGD:
                return array(
                    "guideUI" => "/ActivityConsultation/V1/index",
                    "ruleUI" => "ActivityConsultation/V1/rule",
                    "recordUI" => "ActivityConsultation/V1/record",
                    "detailUI" => "ActivityConsultation/V1/detail",
                    "codeUI" => "ActivityConsultation/V1/code",
                    "successUI" => "ActivityConsultation/V1/success",
                    "dialogUI" => "ActivityConsultation/V1/dialog",
                );
                break;
            default:
                return array(
                    "guideUI" => "ActivityConsultation/V2/index",
                    "ruleUI" => "ActivityConsultation/V2/rule",
                    "recordUI" => "ActivityConsultation/V2/record",
                    "detailUI" => "ActivityConsultation/V2/detail",
                    "codeUI" => "ActivityConsultation/V2/code",
                    "successUI" => "ActivityConsultation/V2/success",
                    "dialogUI" => "ActivityConsultation/V2/dailog",
                );
                break;

        }
    }

    //活动首页
    public function guideUI()
    {

        $this->initCommonRender();
        $pageCurrent = parent::getFilter("pageCurrent", 1);
        $focusId = parent::getFilter("focusId", null);
        $isVip = MasterManager::getUserIsVip();

//        $goHtml = "ActivityConsultation/" . COMMON_ACTIVITY_VIEW . "/index";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign("clinicArr", $this->getClinicArr());
        $this->assign("pageCurrent", $pageCurrent);
        $this->assign("isVip", $isVip);
        $this->assign("focusId", $focusId);
        $this->assign('platformType', $platformType);
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
//        $this->display($goHtml);
        $this->displayEx(__FUNCTION__);


//        $goHtml = "ActivityConsultation/" . COMMON_ACTIVITY_VIEW . "/test";
//        $platformType = MasterManager::getPlatformType();                 //平台类型
//        $this->assign('platformType', $platformType);
//        $this->assign('platformType', $platformType);
//        $this->display($goHtml);

    }

    //活动规则
    public function ruleUI()
    {
        $this->initCommonRender();
//        $goHtml = "ActivityConsultation/" . COMMON_ACTIVITY_VIEW . "/rule";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //约诊记录
    public function recordUI()
    {
        $this->initCommonRender();
//        $goHtml = "ActivityConsultation/" . COMMON_ACTIVITY_VIEW . "/record";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("cwsUrlOut", $this->getCwsOutUrl());
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //专家详情
    public function detailUI()
    {
        $this->initCommonRender();
        $clinicId = parent::getFilter("clinicId");
//        $goHtml = "ActivityConsultation/" . COMMON_ACTIVITY_VIEW . "/detail";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign('clinicId', $clinicId);
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //二维码扫码界面
    public function codeUI()
    {
        $this->initCommonRender();
        $clinicId = parent::getFilter("clinicId");
//        $goHtml = "ActivityConsultation/" . COMMON_ACTIVITY_VIEW . "/code";
        $platformType = MasterManager::getPlatformType();                 //平台类型

        $this->assign('clinicId', $clinicId);
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //约诊成功
    public function successUI()
    {
        $this->initCommonRender();
        $appointmentID = parent::getFilter("appointmentID");
        $this->assign("appointmentID", $appointmentID);
//        $goHtml = "ActivityConsultation/" . COMMON_ACTIVITY_VIEW . "/success";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    //约诊过程中产生的弹框
    public function dialogUI()
    {
        $this->initCommonRender();
        $flag = parent::getFilter("flag");

//        $goHtml = "ActivityConsultation/" . COMMON_ACTIVITY_VIEW . "/dialog";
        $platformType = MasterManager::getPlatformType();                 //平台类型
        $this->assign('flag', $flag);
        $this->assign('platformType', $platformType);
        $this->displayEx(__FUNCTION__);
    }

    private function getClinicArr()
    {
        $arr = array(
            "data" => array(
                1358
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
