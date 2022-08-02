<?php
/**
 * Breif: 搜索控制器类，用于实现搜索功能的业务处理
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017-10-20
 * Time: 13:35
 */

namespace Home\Controller;

use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Common\TextUtils;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Intent\IntentManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\Stats\StatManager;

/**
 * Brief: 挽留页控制器
 * Class HoldPageController
 * @package Home\Controller
 */
class HoldController extends BaseController {
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config() {
        return DisplayManager::getDisplayPage(__FILE__, array(
            MasterManager::getAreaCode()
        ));
    }

    public function indexV1UI() {
        $render = $this->initCommonRender();  // 初始化通用渲染

        $userId = $render['userId'];
        $isVip = $render['isVip'];

        $areaCode = MasterManager::getAreaCode();
        if (CARRIER_ID_CHINAUNICOM_MOFANG == CARRIER_ID && $areaCode == "207") {
            IntentManager::back('IPTVPortal');
        }

        $fromId = parent::getFilter('fromId', 0); //是否返回

        // 获取挽留页面的推荐视频和按钮文字
        $holdPageConfig = MainHomeManager::loadHoldPageConfig();

        // 上报用户数据
        StatManager::uploadAccessModule($userId);

        $render["returnEpgUrl"] = MasterManager::getIPTVPortalUrl();
        $render["fromId"] = $fromId;
        $render["retentionText"] = $holdPageConfig->holdConfigTips;
        $render["dataList"] = $holdPageConfig->recommendVideoList;
        $render["tipsData"] = $holdPageConfig->holdConfigList;
        $render["epgInfo"] = MasterManager::getEPGInfo();
        $render["userFromType"] = MasterManager::getUserFromType();
        $render["historyLength"] = MasterManager::getSplashHistoryLength();
        $render["lmp"] = $render['enterPosition'];
        $render["userToken"] = MasterManager::getUserToken();
        $render["epgDomain"] = MasterManager::getEPGInfoMap()['epgDomain'];
        $render["fromLaunch"] = MasterManager::getCookieFromLaunch();
        $render["isRunOnAndroid"] = IS_RUN_ON_ANDROID;
        $this->assign("renderParam", $render);

        $this->displayEx(__FUNCTION__);
    }

    public function healthLiveV1UI() {
        // 山东挽留页推荐位跳转健康生活
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }
}