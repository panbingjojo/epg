<?php

namespace Home\Model\User;

use Home\Model\Common\CookieManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class AuthUser001006 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    private function _setEPGParams()
    {
        LogUtils::info("_setEPGParams -> deviceInfo ：" . $_POST['deviceInfo']);

        // {"accountInfo":"hw0245","authNode":"splash","isRunOnPC":"-1","deviceInfo":{"accessChannel":"12",
        //"videoControl":"huashu","returnCode":0,"systemTime":"20200345","isCert":false,"transformId":"220035302315",
        //"sessionId":"aaaaaaaaaaaaaaaaa","carrierId":"220","userId":"11111","code":0,"aidlToken":"ccacf5ae-8892-4626-925b-f019f7b26005"},
        //"accountId":"11111"}
        $accountId = $_POST['accountId'] ? $_POST['accountId'] : null;
        $deviceInfo = $_POST['deviceInfo'] ? $_POST['deviceInfo'] : '';
        if ($accountId && $deviceInfo) {
            $deviceInfo = json_decode($deviceInfo);
            MasterManager::setAccountId($accountId);
            MasterManager::setAreaCode(237);
//            MasterManager::setAreaCode($deviceInfo->carrierId);
            MasterManager::setUserToken($deviceInfo->aidlToken);
        }
    }

    public function checkVIPState()
    {
        // 从OrderManager中鉴权是否Vip
        $authInfo = $this->orderManager->authentication();
        $authVip = $authInfo && $authInfo->result == 0;

        return $authVip;
    }
}