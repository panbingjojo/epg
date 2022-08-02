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


use Home\Model\Activity\ActivityManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\Expert;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class ExpertController extends BaseController
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
     * 专家约诊 - 首页，展示专家列表
     */
    public function expertIndexV13UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $focusId = parent::requestFilter("focusId");
        $deptId = parent::requestFilter("deptId");
        $deptName = parent::requestFilter("deptName", "");
        $returnUrl = parent::requestFilter("returnUrl");
        $initID = parent::requestFilter("initID");
        $page = parent::requestFilter("page", 1);
        $isFirstEnter = ActivityManager::queryStoreData('expertIndexV13UI' . MasterManager::getUserId());

        $this->assign("focusId", $focusId);
        $this->assign("isFirstEnter", json_decode($isFirstEnter)->val);
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("cwsUrlOut", $this->getCwsOutUrl());
        $this->assign("deptId", $deptId);
        $this->assign("deptName", $deptName);
        $this->assign("initID", $initID);
        $this->assign("page", $page);
        $this->assign("returnUrl", $returnUrl);

        $isShowCollect = 1; // 是否显示收藏按钮
        $hideCollectCarriers = [CARRIER_ID_SHANDONGDX_APK/* 山东电信apk */, CARRIER_ID_SHANDONGDX/* 山东电信EPG */,
            CARRIER_ID_CHINAUNICOM_MOFANG/* 中国联通启生魔方epg */,CARRIER_ID_GANSUYD/* 甘肃移动apk */,
            CARRIER_ID_DEMO4/* 展厅演示版本4 */, CARRIER_ID_HUBEIDX/* 湖北电信 */, CARRIER_ID_QINGHAIDX/* 青海电信EPG */,
            CARRIER_ID_HEBEIYD/*河北移动*/];
        if(in_array(CARRIER_ID,$hideCollectCarriers)) {
            $isShowCollect = 0;
        }
        $this->assign('isShowCollect', $isShowCollect);

        $isShowDoctorCode = 1; // 是否显示预约二维码
        $hideDoctorCodeCarriers = [CARRIER_ID_HUBEIDX/* 湖北电信 */];
        if(in_array(CARRIER_ID,$hideDoctorCodeCarriers)) {
            $isShowDoctorCode = 0;
        }
        $this->assign('isShowDoctorCode', $isShowDoctorCode);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 专家约诊 - 专家详情介绍
     */
    public function expertDetailV13UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $returnUrl = parent::requestFilter("returnUrl");
        $returnExpertHomeUrl = parent::requestFilter("returnExpertHomeUrl");
        $clinic = parent::requestFilter("clinic");

        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("returnUrl", $returnUrl);
        $this->assign("returnExpertHomeUrl", $returnExpertHomeUrl);
        $this->assign("clinic", $clinic);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 专家约诊 - 约诊成功提示页面
     */
    public function expertSuccessV13UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $returnUrl = parent::requestFilter("returnUrl");
        $returnExpertHomeUrl = parent::requestFilter("returnExpertHomeUrl");
        $appointmentID = parent::requestFilter("appointmentID");
        $this->assign("returnUrl", $returnUrl);
        $this->assign("returnExpertHomeUrl", $returnExpertHomeUrl);
        $this->assign("appointmentID", $appointmentID);
        $this->assign("cwsUrlOut", $this->getCwsOutUrl());

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 获取cws互联网医院模块公网访问地址
     *
     * @return string|string[] cws互联网医院模块公网访问地址
     */
    private function getCwsOutUrl()
    {
        $needReplaceStr = trim(strrchr(CWS_EXPERT_URL_OUT, '/'), '/');
        $cwsUrlOut = str_replace(array($needReplaceStr), "", CWS_EXPERT_URL_OUT);
        LogUtils::info("cwsUrlOut=" . $cwsUrlOut);
        return $cwsUrlOut;
    }

}