<?php

namespace Home\Model\User;

use Exception;
use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;

class AuthUser210092 extends BaseAuthUser
{
    public function auth()
    {
        // 保存EPG相关参数
        $this->_setEPGParams();
        return $this->getCommonAJAXResult();
    }

    /**
     * 辽宁电信应用业务参数保存
     * @throws Exception
     */
    private function _setEPGParams()
    {
        $requestKeys = array(
            "userAccount" => "",
            "UserToken" => "",
            "EPGDomain" => "",
            "STBType" => "",
            "STBId" => "",
        );
        $epgInfoMap = URLUtils::parseURLInfo($requestKeys, URLUtils::POST_REQUEST_TYPE);
        //记录日志
        LogUtils::info("_setEPGParams: " . implode(',', $epgInfoMap));

        $epgInfo = json_encode($_POST);
        if ($epgInfoMap['userAccount'] == null) {
            throw new Exception("参数异常！" . $epgInfo);
        }
        LogUtils::info("user INFO====> " . $epgInfo); // 把INFO信息写入文档
        //将存储cookie内容-->存储到sisson中
        MasterManager::setEPGInfo($epgInfo);

        //--------------------------- 对参数进一步保存 ---------------------------

        // 由于客户端没有传ip过来，所以只能读取
        $epgInfoMap["userIP"] = get_client_ip();
        MasterManager::setEPGInfoMap($epgInfoMap);

        MasterManager::setAccountId($epgInfoMap['userAccount']);
        MasterManager::setSTBModel($epgInfoMap['STBType']);
        MasterManager::setSTBId($epgInfoMap['STBId']);

        if ($epgInfoMap['EPGDomain']) { // 由于backUrl是入口传递的，如果js获取的返回地址为空，获取session中的入口获取的地址
            MasterManager::setIPTVPortalUrl($epgInfoMap['EPGDomain']);
        }
        //设置首页二号位置配置为普通推荐位
        MasterManager::setPositionTwoConfig("1");
    }

}