<?php


namespace Home\Model\Entry;

use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\LogUtils;

class InitAction420092 extends InitActionTelecom
{

    private $isSetInfo = true;

    protected function getEPGInfo()
    {
        $infoValue = isset($_GET['INFO']) ? $_GET['INFO'] : null;
        if (empty($infoValue)) {
            $this->isSetInfo = false; // 设置其他解析方式
            $infoValue = isset($_GET['epg_info']) ? $_GET['epg_info'] : null;
        }
        return $infoValue;
    }

    protected function getDecodeEPGInfo($infoValue)
    {
        return $infoValue; // 不解析参数
    }

    protected function getInfoByXML($xmlObj)
    {
        if ($this->isSetInfo) {
            return parent::getInfoByXML($xmlObj);
        }else {
            return $this->getInfoByXMLSelf($xmlObj);
        }
    }

    /**
     * 获取参数的私有方式，区别于链接中获取INFO参数，这里获取的是epg_info中的参数
     * @param object $xmlObj url链接中解析xml得到得对象
     * @return array 获取的参数集合
     */
    private function getInfoByXMLSelf($xmlObj)
    {
        $epgInfoMap["userId"] = $xmlObj->oss_user_id;
        $epgInfoMap["userToken"] = "";
        $epgInfoMap["group_name"] = $xmlObj->group_name;
        $epgInfoMap["group_path"] = $xmlObj->group_path;
        $epgInfoMap["userIP"] = get_client_ip();
        $epgInfoMap["stbId"] = ($xmlObj->stbId != null && !empty($xmlObj->stbId)) ? $xmlObj->stbId : "";
        $epgInfoMap["partner"] = $xmlObj->partner;
        $epgInfoMap["areaCode"] = $xmlObj->area_id;
        $epgInfoMap["page_url"] = $xmlObj->page_url;
        $epgInfoMap["back_url"] = $xmlObj->back_url;
        $epgInfoMap["VAStoEPG"] = $xmlObj->page_url;

        return $epgInfoMap;
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        if ($this->isSetInfo) {
            // 针对Token值解析
            $userToken = Crypt3DES::decode($epgInfoMap['userToken'], $epgInfoMap["key"]);
            $epgInfoMap["userToken"] =  $userToken;
            return parent::handleEPGInfoMap($epgInfoMap);
        } else {
            return $this->handleEPGInfoMapSelf($epgInfoMap);
        }
    }

    protected function getInfoStrWithSPCodeTag($backUrl)
    {
        $XMLStr = "<?xml version='1.0'?>";
        $XMLStr .= "<document>";
        $XMLStr .= $this->infoValue;
        $XMLStr .= "</document>";

        $XMLParseRet = simplexml_load_string($XMLStr);

        $INFO = '';
        foreach ($XMLParseRet as $key=>$value){
            if($value  && $value != 'null') {
                $INFO .= "<$key>$value</$key>";
            }
        }
        LogUtils::info("getInfoStrWithSPCodeTag " . $INFO);
        return $INFO;

      /*
       $decodeEPGInfo = $this->infoValue;
       if (strpos($backUrl, "SPToAmsEducation")) {
            $decodeEPGInfo = $decodeEPGInfo . "<SPID>spaj0080</SPID>";
        }
        return urldecode($decodeEPGInfo);*/
    }

    /**
     * 私有的出信息参数解析方式
     * @param array $epgInfoMap URL链接中解析得到的参数
     * @return mixed 处理之后的参数
     */
    private function handleEPGInfoMapSelf($epgInfoMap)
    {
        MasterManager::setAccountId( $epgInfoMap["userId"]);
        // 局方要求在返回时，增加info参数信息
        $IPTVPortalUrl = isset($epgInfoMap["back_url"]) && !empty($epgInfoMap["back_url"]) ? $epgInfoMap["back_url"] : "";
        MasterManager::setIPTVPortalUrl(urldecode($IPTVPortalUrl));
        // 地区特殊解析
        $this->handelAreaSpecial($epgInfoMap);

        return $epgInfoMap;
    }

    protected function handelAreaSpecial($epgInfoMap)
    {

        // 处理areaCode
        $areaCode = "";
        if (defined("HUBEIDX_AREACODE_MAP")) {
            $areaCodeArray = eval(HUBEIDX_AREACODE_MAP);
            // 1、先判断是中兴平台还是华为平台
            $accountPrefix = substr($epgInfoMap['userAccount'], 0, 2);
            // 以hw开关的，是华为平台
            if ($accountPrefix == 'hw') {
                // 再提供后两位，字母分别代表地市
                $accountPrefix = substr($epgInfoMap['userAccount'], 2, 2);
            }

            // 中兴平台
            if(array_key_exists($accountPrefix, $areaCodeArray)) {
                $areaCode = $areaCodeArray[$accountPrefix];
            }
        }

        LogUtils::info("=====> get areaCode[ $areaCode ] from account= {$epgInfoMap['userAccount']}");
        MasterManager::setAreaCode($areaCode); //设置区域码

        $epgInfoMap['userToken'] = Crypt3DES::decode($epgInfoMap['userToken'], $epgInfoMap["key"]);
        MasterManager::setUserToken($epgInfoMap['userToken']);
        return $epgInfoMap;
    }

}