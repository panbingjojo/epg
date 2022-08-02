<?php
/**
 * Created by longmaster.
 * Date: 2018-09-08
 * Time: 10:27
 * Brief: 此文件（或类）用于做代理工作
 */

namespace Home\Controller;

use Api\APIController\ProductsAPIController;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;

class ProxyController extends BaseController
{
    private $proxyType; // 代理操作类型: 100 -- 查询订购记录
    private $userAccountId; // 业务帐号
    private $carrierId; // carrierId
    private $areaCode; // 运营商区域ID
    private $platType; // 平台类型 : 1--android， 2--linuxHD, 3--linuxSD
    private $activeWidth; // 分辨率-宽
    private $activeHeight; // 分辨率-高

    private $productId; // 商品id

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     * @Brief:此函数用于解析入口参数
     */
    private function parseParam()
    {


        // 1、解析extraParam里的参数
        if (isset($_GET['extraParam'])) {
            $extraParam = $_GET['extraParam']; // 扩展参数

            // 解析参数
            $extraParam = json_decode($extraParam);

            $this->proxyType = $extraParam->proxyType;

            // 运营商carrierId
            $this->carrierId = $extraParam->carrierId;
            MasterManager::setCarrierId($this->carrierId);
            // 运营商区域ID
            $this->areaCode = $extraParam->areaCode;
            MasterManager::setAreaCode($this->areaCode);

            // 业务帐号
            $accountId = $extraParam->userAccountId;
            // 判断能读到业务帐号后面的内容，如果没有，就加上
            $idx = strripos($accountId, '_');
            if ($idx === false) {
                $accountId .= "_$this->areaCode";
            }
            MasterManager::setAccountId($accountId);
            $this->userAccountId = $accountId;

            // 平台类型: 1--android， 2--linuxHD, 3--linuxSD
            $this->platType = $extraParam->platType;

            // 商品Id
            $this->productId = isset($extraParam->productId) ? $extraParam->productId : "";

            // 设置平台相关参数
            if ($this->platType == 1) {
                // 高清
                MasterManager::setPlatformTypeExt("hd_android");
                MasterManager::setPlatformType(STB_TYPE_HD);
            } else if ($this->platType == 2) {
                MasterManager::setPlatformType(STB_TYPE_HD);
            } else {
                // 标清
                MasterManager::setPlatformType(STB_TYPE_SD);
            }
        }

        // 2、解析head里的参数
        if (!empty(parent::getFilter('head'))) {
            $head = parent::getFilter('head'); // 头部信息

            // 分辨率
            $headInfo = json_decode($head);
            $this->activeWidth = $headInfo->active_height; // 分辨率-宽
            $this->activeHeight = $headInfo->active_height; // 分辨率-高
        }
    }

    /**
     * @Brief:此函数用于主入口
     */
    public function indexUI()
    {
        // 解析参数
        // extraParam={"userAccountId":"vern1008", "platType":"1", "proxyType":"102", "carrierId":"000051", "areaCode":"201", "productId":"39jk010cp@201"}
        $this->parseParam();

        switch ($this->proxyType) {
            case "100":
                // 订购查询页
                $this->goQueryOrderProductProxy();
                break;
            case "101":
                // 中国联通新退订接口，供外部使用
                $this->goCancelOrderProduct();
                break;
            case "102":
                // 中国联通退订接口 -- 使用原来的退订接口
                $this->goCancelOrderProductOld();
                break;
            default:
                LogUtils::error("ProxyController --> indexUI: cannot support type[$this->proxyType]");
        }
    }

    /**
     * @Brief:此函数用于代理启动订购信息展示页
     * @param: $extraParam 扩展参数
     */
    private function goQueryOrderProductProxy()
    {
        $targetObj = IntentManager::createIntent("orderProductList");
        $targetObj->setParam("userAccountId", $this->userAccountId);
        IntentManager::jump($targetObj);
    }

    /**
     * @Brief:此函数用于取消订购
     */
    private function goCancelOrderProduct()
    {
        // 地址
        $cancelUrl = ORDER_SERVICE_CANCEL_ORDER_URL;

        // 商品ID
        $productId = $this->productId;

        $info = ProductsAPIController::buildCancelOrderInfo($productId);

        $result = HttpManager::httpRequest("POST", $cancelUrl, json_encode($info));
        LogUtils::info("goCancelOrderProduct--> result: $result");
        echo $result;
    }

    /**
     * @Brief:此函数用于启用老的接口进行取消订购
     */
    private function goCancelOrderProductOld()
    {
        $targetObj = IntentManager::createIntent("secondUnsubscribeVip");
        $targetObj->setParam("userAccountId", $this->userAccountId);
        $targetObj->setParam("activeWidth", $this->activeWidth);
        $targetObj->setParam("activeHeight", $this->activeHeight);
        IntentManager::jump($targetObj);
    }
}