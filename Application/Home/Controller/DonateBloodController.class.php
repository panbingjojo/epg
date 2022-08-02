<?php
/**
 * Brief: 献血模块控制器
 */

namespace Home\Controller;

use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class DonateBloodController extends BaseController {
    private $userId;//用户id
    private $inner = 1;//是否从首页跳转过来，决定专辑按返回时回退到epg页面还是首页
    private $focusIndex = "";
    private $hospitalName = ""; // 医院名称


    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config() {
        $carrierId = MasterManager::getCarrierId();
        switch ($carrierId) {
            case CARRIER_ID_NINGXIADX:
            case CARRIER_ID_NINGXIAGD:
                return array(
                    "indexV1UI" => "NingXiaQvHospital/index",
                    "commonwealV1UI" => "DonateBlood/V1/Commonweal",
                    "bloodStepV1UI" => "DonateBlood/V1/BloodStep",
                    "bloodOrderV1UI" => "DonateBlood/V1/BloodOrder",
                    "bloodKnowV1UI" => "DonateBlood/V1/BloodKnow",
                    "bloodRoomInfoV1UI" => "DonateBlood/V1/BloodRoomInfo",
                    "personalV1UI" => "DonateBlood/V1/Personal",
                    "bloodNavV1UI" => "DonateBlood/V1/BloodNav",
                    "qrCodeV1UI" => "DonateBlood/V1/QrCode",
                );

            default:
                LogUtils::info("###############> no support: " . $carrierId);
                return null;
        }
    }


    /**
     * 公益模块，版本001
     */
    public function commonwealV1UI() {
        // 初始化
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        // 日志输出
        LogUtils::info("###############> welcome to DonateBlood!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function bloodStepV1UI() {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        LogUtils::info("###############> welcome to DonateBlood!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function bloodOrderV1UI() {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        LogUtils::info("###############> welcome to DonateBlood!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function bloodKnowV1UI() {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        LogUtils::info("###############> welcome to DonateBlood!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function bloodRoomInfoV1UI() {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        LogUtils::info("###############> welcome to DonateBlood!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function personalV1UI() {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        LogUtils::info("###############> welcome to DonateBlood!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function bloodNavV1UI() {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        LogUtils::info("###############> welcome to DonateBlood!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function qrCodeV1UI() {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        LogUtils::info("###############> welcome to DonateBlood!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }


    private function init() {
        $this->hospitalName = parent::getFilter("hospitalName");
        $this->focusIndex = parent::getFilter("focusIndex");
    }

}