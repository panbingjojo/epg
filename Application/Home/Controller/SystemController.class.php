<?php
/**
 * Breif: 系统控制器类，用于实现系统的业务处理
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018-12-21
 * Time: 13:35
 */

namespace Home\Controller;

use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class SystemController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__,array());
    }

    /**
     * 提示用户升级页面
     */
    public function updateUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 提示用户页面报错
     */
    public function errorUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 用户等待页
     */
    public function waitUI () {
        $this->initCommonRender();  // 初始化通用渲染
        LogUtils::info("=================> wait!");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 计费回调鉴权页
     */
    public function authOrderUI () {
        $this->initCommonRender();  // 初始化通用渲染
        $this->renderPrivateSplash(); //初始化私有渲染
        LogUtils::info("=================> AuthOrder!");
        $this->displayEx(__FUNCTION__);
    }

    private function renderPrivateSplash()
    {
        $orderInfo = SystemAPI::sendBillAuthRes("","","","","","0");
        LogUtils::info("=================> orderInfo:".json_encode($orderInfo));
        LogUtils::info("=================> orderInfo:".$orderInfo->result->order_id);
        $this->assign("orderId", $orderInfo->result->order_id);
        $this->assign("payDt", $orderInfo->result->pay_dt);
        $this->assign("payState", $orderInfo->result->pay_state);
        $this->assign("accountId", MasterManager::getAccountId());

        switch (CARRIER_ID) {
            case CARRIER_ID_CHONGQINGDX:
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $serverPath = $epgInfoMap['serverPath'];
                $this->assign("serverPath", $serverPath);
                break;
            case CARRIER_ID_JILINGD:
            case CARRIER_ID_JILINGD_MOFANG:
                if (defined("PRODUCT_ID")) $this->assign("productId", PRODUCT_ID); // 传递计费套餐id，用于前端鉴权。例如：吉林广电
                break;
            case CARRIER_ID_HAIKAN_APK:
            case CARRIER_ID_SHANDONGDX_HAIKAN:
                $this->assign('authCode', CONTENT_CODE);
                break;
            default:
                break;
        }
    }
}