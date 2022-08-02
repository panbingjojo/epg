<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;

class InitAction630092 implements InitAction
{

    public function getEPGInfoMap()
    {
        $initParams = array(
            "userId" => "",
            "cityCode" => "",
            "platForm" => "",
            "backUrl" => "",
            "fromLaunch" => 0,// 当fromLaunch=1时，要通过Utility.setValueByName("exitIptvApp");返回局方
        );

        $epgInfoMap = URLUtils::parseURLInfo($initParams);
        $epgInfoMap["userIP"] = get_client_ip(); // 由于客户端没有传ip过来，所以只能读取
        $epgInfoMap["VAStoEPG"] = $epgInfoMap["backUrl"]; // 局方大厅返回地址

        LogUtils::info("====> client _SERVER INFO: " . json_encode($_SERVER));

        return $epgInfoMap;
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        $areaCode = $this->parseAreaCode($epgInfoMap);
        MasterManager::setAreaCode($areaCode);

        //将UserID 作为业务账号
        MasterManager::setAccountId($epgInfoMap['userId']);
        MasterManager::setIPTVPortalUrl($epgInfoMap['VAStoEPG']);
        MasterManager::setCookieFromLaunch($epgInfoMap['fromLaunch']);

        return $epgInfoMap;
    }

    /**
     * 解析地区编码
     * @param array $epgInfoMap epg信息参数
     */
    private function parseAreaCode($epgInfoMap){
        // 解析局方carrierId
        // 判断能读到业务帐号后面的内容
        $areaCode = "";
        $accountId = $epgInfoMap['userId'];
        // 读取前\后3个字符，如果是097与itv，则读前4位
        // （1）当$accountId=097866666itv时，$areaCode为0978 （2）当$accountId="97866666itv"时，$areaCode=0978
        $flag = substr($accountId, 0, 3);
        $flagTopTwo = substr($accountId, 0, 2);//截取账号前两位
        $enfFlag = substr($accountId, strlen($accountId) - 3, 3);
        if ($enfFlag == "itv") {
            if ($flag == "097") {
                $areaCode = substr($accountId, 0, 4);
            } elseif ($flag == "098") {
                $areaCode = substr($accountId, 0, 5);
            } elseif ($flagTopTwo == "97") {
                $areaCode = "0" . substr($accountId, 0, 3);
            } elseif ($flagTopTwo == "98") {
                $areaCode = "0" . substr($accountId, 0, 4);
            }
        } else {
            $areaCode = $epgInfoMap['cityCode'];
        }
        LogUtils::info("=====> get areaCode[ $areaCode ] from account= $accountId");

        return $areaCode;
    }
}