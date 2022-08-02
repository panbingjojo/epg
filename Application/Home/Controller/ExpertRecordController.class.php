<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * | 大专家相关功能
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                          |
 * | Date: 2018/4/2 10:35                                                 |
 * +----------------------------------------------------------------------+
 */

namespace Home\Controller;


use Home\Model\Common\LogUtils;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class ExpertRecordController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {

        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    public function waitingRoomForCaseUI()
    {

        $this->displayEx(__FUNCTION__);
    }

    public function expertRecordIndexUI()
    {

        $this->displayEx(__FUNCTION__);
    }

    public function caseDataUI()
    {

        $this->displayEx(__FUNCTION__);
    }

    public function doctorAdviseUI()
    {

        $this->displayEx(__FUNCTION__);
    }

    public function expertRecordHomeUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $limitBegin = parent::requestFilter("limitBegin", 0);
        $pageCurrent = parent::requestFilter("pageCurrent", 1);
        $focusId = parent::requestFilter("focusId", "btn-consult");

        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("cwsUrlOut", $this->getCwsOutUrl());
        $this->assign("limitBegin", $limitBegin);
        $this->assign("pageCurrent", $pageCurrent);
        $this->assign("focusId", $focusId);

        $this->displayEx(__FUNCTION__);
    }

    public function expertRecordHomeV13UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $limitBegin = parent::requestFilter("limitBegin", 0);
        $page = parent::requestFilter("page", 0);
        $focusId = parent::requestFilter("focusId", "");

        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("cwsUrlOut", $this->getCwsOutUrl());
        $this->assign("limitBegin", $limitBegin);
        $this->assign("page", $page);
        $this->assign("focusId", $focusId);

        $this->displayEx(__FUNCTION__);
    }

    public function expertRecordBridgeUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $returnHomeUrl = parent::requestFilter("returnUrl");
        $appointmentId = parent::requestFilter("appointmentId");

        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("cwsUrlOut", $this->getCwsOutUrl());
        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("appointmentId", $appointmentId);

        $this->displayEx(__FUNCTION__);
    }

    public function expertAdviceUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $returnExpertRecordHomeUrl = parent::requestFilter("returnExpertRecordHomeUrl");
        $returnHomeUrl = parent::requestFilter("returnHomeUrl");
        $returnFamilyHomeUrl = parent::requestFilter("returnFamilyHomeUrl");
        $appointmentID = parent::requestFilter("appointmentID");

        $this->assign("returnExpertRecordHomeUrl", $returnExpertRecordHomeUrl);
        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("returnFamilyHomeUrl", $returnFamilyHomeUrl);
        $this->assign("appointmentID", $appointmentID);

        $this->displayEx(__FUNCTION__);
    }

    public function expertCaseUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $returnExpertRecordHomeUrl = parent::requestFilter("returnExpertRecordHomeUrl");
        $returnHomeUrl = parent::requestFilter("returnHomeUrl");
        $returnFamilyHomeUrl = parent::requestFilter("returnFamilyHomeUrl");
        $appointmentID = parent::requestFilter("appointmentID");

        $this->assign("returnExpertRecordHomeUrl", $returnExpertRecordHomeUrl);
        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("returnFamilyHomeUrl", $returnFamilyHomeUrl);
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("appointmentID", $appointmentID);

        $this->displayEx(__FUNCTION__);
    }

    public function expertRecordSuccessUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $returnExpertRecordHomeUrl = parent::requestFilter("returnExpertRecordHomeUrl");
        $returnHomeUrl = parent::requestFilter("returnHomeUrl");
        $returnFamilyHomeUrl = parent::requestFilter("returnFamilyHomeUrl");
        $appointmentID = parent::requestFilter("appointmentID");

        $this->assign("returnExpertRecordHomeUrl", $returnExpertRecordHomeUrl);
        $this->assign("cwsUrlOut", $this->getCwsOutUrl());
        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("returnFamilyHomeUrl", $returnFamilyHomeUrl);
        $this->assign("appointmentID", $appointmentID);

        $this->displayEx(__FUNCTION__);
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