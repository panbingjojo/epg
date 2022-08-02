<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\Pay220094;

class AuthUser450094 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        $result = $this->getCommonAJAXResult();

        $epgInfoMap = MasterManager::getEPGInfoMap();
        $result['packageId'] = $epgInfoMap['packageId'];

        return $result;
    }

    /**
     * 辽宁电信应用业务参数保存
     */
    private function _setEPGParams()
    {
        $stbModel = $_POST['stbModel'];                             //得到设备型号
        $stbMac = $_POST['stbMac'];                               // 得到设备地址

        $historyLength = isset($_POST["historyLength"]) ? $_POST["historyLength"] : "";
        LogUtils::info("historyLength: " . $historyLength);
        MasterManager::setSplashHistoryLength($historyLength);

        $accountId = MasterManager::getAccountId();
        // 广西广电，有的盒子进入时get参数带有用户信息，有的盒子只能通过js来读取，所以要做兼容保护
        if (!$accountId) {
            $userAccount = $_POST['userAccount'];                               // 得到设备地址
            $deviceId = $_POST['deviceId'];// 得到设备地址
            $areaCode = $_POST['areaCode'];
            MasterManager::setAccountId($userAccount);
            MasterManager::setAreaCode($areaCode);
            if (!empty($deviceId)) {
                MasterManager::setSTBId($deviceId);
            }
            LogUtils::info("_setEPGParams userAccount:" . $userAccount);
        }
        MasterManager::setSTBModel($stbModel);
        MasterManager::setSTBMac($stbMac);
    }

    /** 鉴权当前用户身份 -- 广西广电 1-vip 其它-非vip */
    public function checkVIPState()
    {
        return $_REQUEST['vipState'] == 0 ? 1 : 0;
    }

}