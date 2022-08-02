<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class AuthUser430002 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    private function _setEPGParams()
    {

        $accountInfo = isset($_POST['accountInfo']) && !empty($_POST['accountInfo']) ? $_POST['accountInfo'] : null;
        if($accountInfo) {
            // -----解析账号信息-----
            // 解析Json数据，获取账号
            $accountInfoObj = json_decode($accountInfo);
            $accountId = $accountInfoObj->user_id;
            // 存取账号信息
            MasterManager::setAccountId($accountId);

            // -----解析区域信息-----
            $areaCodeArray = eval(HUNANDX_AREACODE_MAP);
            // 提取平台信息 -- 判断华为平台或者中心平台
            $accountPrefix = substr($accountId, 0, 2);
            $areaCode = $areaCodeArray[$accountPrefix];
            LogUtils::info("_setEPGParams areaCode = ".$areaCode);
            if(isset($areaCode)){
                // 存取区域信息
                MasterManager::setAreaCode($areaCode);
            }
            MasterManager::setEPGInfoMap($accountInfo);
        }
        LogUtils::info("_setEPGParams：" . json_encode($_POST));
    }
}