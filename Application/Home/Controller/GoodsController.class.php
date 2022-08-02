<?php

namespace Home\Controller;

//use Base\Controller\BaseController;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class GoodsController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        $carrierId = MasterManager::getCarrierId();
        switch ($carrierId) {
            default:
                return array(
                    "goodsHomeUI" => "Goods/V1/goodsHome",
                    "goodsDetailUI" => "Goods/V1/goodsDetail",
                    "goodsBuyUI" => "Goods/V1/goodsBuy",
                    "goodsRuleUI" => "Goods/V1/goodsRule",
                    "goodsPayUI" => "Goods/V1/goodsPay",
                    "goodsPayCompleteUI" => "Goods/V1/goodsPayComplete",
                    "goodsPayErrorUI" => "Goods/V1/goodsPayError",
                );
                break;
        }
    }

    /**
     * 问诊记录首页界面
     */
    function goodsHomeUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $focusId = parent::requestFilter("focusId", "device-1");
        $pageCurrent = parent::requestFilter("pageCurrent", 1);
        $this->assign("focusId", $focusId);
        $this->assign("pageCurrent", $pageCurrent);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 问诊记录首页界面
     */
    function goodsDetailUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $scrollTop = parent::getFilter("scrollTop", 0);
        $goodInfo = $_GET["goodInfo"];

        $arr = array(
            "goodInfo" => $goodInfo
        );

        $this->assign("scrollTop", $scrollTop);
        $this->assign($arr);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 问诊记录详情界面
     */
    function goodsBuyUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $goodInfo = $_GET["goodInfo"];
        $defaultFocus = parent::getFilter("defaultFocus", "telPhone");
        $telephone = parent::getFilter("telephone", "");
        $arr = array(
            "goodInfo" => $goodInfo
        );
        $this->assign("defaultFocus", $defaultFocus);
        $this->assign("telephone", $telephone);
        $this->assign($arr);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 问诊记录详情界面
     */
    function goodsRuleUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 问诊记录详情界面
     */
    function goodsPayUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $goodInfo = $_GET["goodInfo"];
        $orderId = $_GET["orderId"];
        $payUrl = $_GET["payUrl"];

        $arr = array(
            "goodInfo" => $goodInfo,
            "orderId" => $orderId,
            "payUrl" => $payUrl
        );
        $this->assign($arr);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 问诊记录详情界面
     */
    function goodsPayCompleteUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $goodInfo = $_GET["goodInfo"];

        $arr = array(
            "goodInfo" => $goodInfo
        );
        $this->assign($arr);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 问诊记录详情界面
     */
    function goodsPayErrorUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }


}