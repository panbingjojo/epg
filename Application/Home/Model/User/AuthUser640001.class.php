<?php

namespace Home\Model\User;

use Couchbase\MatchSearchQuery;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class AuthUser640001 extends BaseAuthUser
{
    public function auth()
    {
        $result = $this->getCommonAJAXResult();

        // 查询VIP相关信息并记录相关状态：续订、不同VIP套餐是否功能限制等
        if ($result['isVip']) {
            // 查询vip信息
            $vipInfo = UserManager::queryVipInfo($result['userId']);
            if ($vipInfo->result == 0 && ($vipInfo->auto_order == 1 || $vipInfo->last_order_trade_no == null || $vipInfo->last_order_trade_no == "")) {
                MasterManager::setAutoOrderFlag("1");
            } else {
                MasterManager::setAutoOrderFlag("0");
            }
        }

        UserManager::judgeAndCacheUserLimitInfo($result['isVip'], isset($vipInfo) ? $vipInfo : null);

        return $result;
    }

    public function checkVIPState()
    {
        // 存储鉴权结果
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $epgInfoMap['userTypeAuth'] = $_REQUEST['userTypeAuth'] ? $_REQUEST['userTypeAuth'] : 0;
        MasterManager::setUserTypeAuth($epgInfoMap['userTypeAuth']);
        MasterManager::setEPGInfoMap($epgInfoMap);
        return isset($_REQUEST['userTypeAuth']) && !empty($_REQUEST['userTypeAuth']) ? $_REQUEST['userTypeAuth'] : 0;
        //return $_REQUEST['vipState'] ? $_REQUEST['vipState'] : 0;
    }
}