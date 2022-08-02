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

use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class GoodsRecordController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        $carrierId = MasterManager::getCarrierId();
        switch ($carrierId) {
            case CARRIER_ID_GANSUYD:
                // 甘肃移动
                return array(
                    "goodsRecordHomeUI" => "GoodsRecord/V7/goodsRecordHome",
                );
                break;
            default:
                return array(
                    "goodsRecordHomeUI" => "GoodsRecord/V8/goodsRecordHome",
                    "goodsDetailUI" => "Goods/V8/goodsDetail",
                    "goodsBuyUI" => "Goods/V8/goodsBuy",
                    "goodsRuleUI" => "Goods/V8/goodsRule",
                    "goodsPayUI" => "Goods/V8/goodsPay",
                    "goodsPayCompleteUI" => "Goods/V8/goodsPayComplete",
                    "goodsPayErrorUI" => "Goods/V8/goodsPayError",
                );
                break;
        }
    }

    /**
     * 问诊记录首页界面
     */
    function goodsRecordHomeUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $focusIndex = isset($_GET['focusIndex']) ? $_GET['focusIndex'] :"";
        $this->assign("focusIndex", $focusIndex);
        $scrollTop = isset($_GET['scrollTop']) ? $_GET['scrollTop'] :0;
        $this->assign("scrollTop", $scrollTop);
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
        $this->assign("scrollTop", $scrollTop);
        $this->displayEx(__FUNCTION__);
    }
    /**
     * 问诊记录详情界面
     */
    function goodsBuyUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
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
        $this->displayEx(__FUNCTION__);
    }
    /**
     * 问诊记录详情界面
     */
    function goodsPayCompleteUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
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