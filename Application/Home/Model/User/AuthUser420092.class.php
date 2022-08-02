<?php

namespace Home\Model\User;

use Api\APIController\SystemAPIController;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser420092 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    private function _setEPGParams()
    {
        LogUtils::info("_setEPGParams：" . json_encode($_POST));

        // 如果不存在userToken，就更新$epgInfoMap['userToken']里的值
        $userToken = $_POST['userToken'];
        if (!$userToken) {
            MasterManager::setSTBModel($_POST['stbModel']); // 设备型号
            MasterManager::setSTBMac($_POST['stbMac']);     // 设备地址
            MasterManager::setSTBId($_POST['stbId']);       // 设备序列编号
            $epgInfoMap = MasterManager::getEPGInfoMap();
            if (!$epgInfoMap['userToken']) { // 跳转的链接参数未携带token信息，盒子里面能读取到
                $epgInfoMap['userToken'] = $userToken;
                MasterManager::setEPGInfoMap($epgInfoMap);
            }
        }

        $epgInfoMap = MasterManager::getEPGInfoMap();
        if(empty($epgInfoMap['userToken'])){
            MasterManager::setUserToken($userToken);
            $epgInfoMap['userToken'] = $userToken;
            MasterManager::setEPGInfoMap($epgInfoMap);
        }

        $areaCode = MasterManager::getAreaCode();
        if(empty($areaCode)){
            $areaCode = "";
            if (defined("HUBEIDX_AREACODE_MAP")) {
                $areaCodeArray = eval(HUBEIDX_AREACODE_MAP);
                // 1、先判断是中兴平台还是华为平台
                $accountPrefix = substr(MasterManager::getAccountId(), 0, 2);
                // 以hw开关的，是华为平台
                if ($accountPrefix == 'hw') {
                    // 再提供后两位，字母分别代表地市
                    $accountPrefix = substr(MasterManager::getAccountId(), 2, 2);
                }
                // 中兴平台
                if(array_key_exists($accountPrefix, $areaCodeArray)) {
                    $areaCode = $areaCodeArray[$accountPrefix];
                }
            }

            $AccountId = MasterManager::getAccountId();
            LogUtils::info("=====> _setEPGParams areaCode[ $areaCode ] from account= {$AccountId}");
            MasterManager::setAreaCode($areaCode); //设置区域码
        }

    }
}