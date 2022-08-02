<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser520094 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    /**
     * 贵州电信应用业务参数保存
     */
    private function _setEPGParams()
    {
        if ($_POST['userAccount'] == null || $_POST['userToken'] == null) {
            throw new \Exception("参数异常！" . json_encode($_POST));
        }
        LogUtils::info("user INFO====> " . json_encode($_POST)); // 把INFO信息写入文档

        $epgInfoMap["userId"] = $_POST['userAccount'];
        $epgInfoMap["userToken"] = $_POST['userToken'];

        MasterManager::setSTBMac($_POST['MacId']);
        //将存储cookie内容-->存储到sisson中
        MasterManager::setEPGInfo(json_encode($_POST));
        MasterManager::setEPGInfoMap($epgInfoMap);
        if ($_POST['env'] == "other" || $_POST['env'] == "") {
            MasterManager::setPositionTwoConfig("1"); //设置首页二号位置配置为普通推荐位
        }
        MasterManager::setAccountId($_POST['userAccount']);
        $areaCode = $_POST['areaCode'] ? $_POST['areaCode'] : $_POST['qpqamAreaCode'];
        $areaCode = substr($areaCode, 0, 9);
        MasterManager::setAreaCode($areaCode);
    }

    public function checkVIPState()
    {
        return isset($_REQUEST['vipState']) ? $_REQUEST['vipState'] : 0;
    }

}