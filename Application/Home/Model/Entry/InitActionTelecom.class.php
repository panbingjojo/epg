<?php

namespace Home\Model\Entry;

use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Think\Exception;

class InitActionTelecom implements InitAction {

    // 跳转的链接中获取到的INFO参数信息
    protected $infoValue;

    public function getEPGInfoMap() {
        LogUtils::info("====> client _SERVER INFO: " . json_encode($_SERVER));
        // 1、获取链接中参数
        $infoValue = $this->getEPGInfo();

        //将存储cookie内容-->存储到sisson中
        MasterManager::setEPGInfo(urlencode($infoValue));

        // 3、检测infoValue参数的有效性
        if (empty($infoValue)) {
            throw new \Exception("INFO参数为空！");
        }
        // 4、获取解析的参数
        $infoValue = $this->getDecodeEPGInfo($infoValue);
        // 5、替换xml中的& ---> &amp;解决特殊字符问题
        $infoValue = str_replace('&', "&amp;", $infoValue);
        // 6、解析xml字符串信息
        $xmlStr = "<?xml version='1.0'?><document>" . $infoValue . "</document>";
        $xmlJsonObj = simplexml_load_string($xmlStr);
        $xmlJsonStr = json_encode($xmlJsonObj);
        $xmlObj = json_decode($xmlJsonStr);
        $this->infoValue = $infoValue;
        // 7、从epgInfoMap中提取参数信息
        return $this->getInfoByXML($xmlObj);
    }

    public function handleEPGInfoMap($epgInfoMap) {
        // 1、检验参数有效性
        $this->checkParams($epgInfoMap["key"], $epgInfoMap["spid"]);
        // 2、解析用户的账号信息
        if ($epgInfoMap["key"] && $epgInfoMap["key"] != "null") {
            $epgInfoMap['userAccount'] = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);  //解密userId 作为业务账号
            // $epgInfoMap["userToken"] = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
        } else {
            $epgInfoMap['userAccount'] = $epgInfoMap["userId"];
        }
        MasterManager::setAccountId($epgInfoMap['userAccount']);
        // 3、解析局方大厅返回地址
        $IPTVPortalUrl = $this->getDecodeIPTVPortalUrl($epgInfoMap["IPTVPortalUrl"]);
        $infoString = urlencode($this->getInfoStrWithSPCodeTag($IPTVPortalUrl));
        if ($IPTVPortalUrl) {
            $check = strpos($IPTVPortalUrl, '?');
            if (!$check) { //如果不存在 ?
                $IPTVPortalUrl = $IPTVPortalUrl . "?INFO=" . $infoString;
            } else if (substr($IPTVPortalUrl, $check + 1) == '') {
                //如果 ? 后面没有参数，如 http://www.yitu.org/index.php?
                //可以直接加上附加参数
                $IPTVPortalUrl = $IPTVPortalUrl . "INFO=" . $infoString;
            } else {
                //如果有参数，如：http://www.yitu.org/index.php?ID=12
                $IPTVPortalUrl = $IPTVPortalUrl . "&INFO=" . $infoString;
            }
        }
        $epgInfoMap['backUrl'] = $IPTVPortalUrl;
        if (CARRIER_ID == CARRIER_ID_GANSUDX) {
            MasterManager::setIPTVPortalUrl(urldecode($epgInfoMap['back_epg_url']));
        }else if(CARRIER_ID==CARRIER_ID_SHANXIDX){
            MasterManager::setIPTVPortalUrl(urldecode($epgInfoMap['VAStoEPG']));
        }else{
            MasterManager::setIPTVPortalUrl($IPTVPortalUrl);
        }
        // 5、地区特殊处理函数
        $this->handelAreaSpecial($epgInfoMap);
        // 6、保存其他参数值
        MasterManager::setSTBId($epgInfoMap["stbId"]);

        return $epgInfoMap;
    }

    /**
     * 解析url中的INFO信息
     * @return mixed|null
     */
    protected function getEPGInfo() {
        return isset($_GET['INFO']) ? $_GET['INFO'] : null;
    }

    /**
     * 跳转链接中的参数，部分需要都URL解析
     * @param string $infoValue url链接中的参数
     * @return string 解析后的参数
     */
    protected function getDecodeEPGInfo($infoValue) {
        return urldecode($infoValue);
    }

    /**
     * 从xml字符串中提取的数据信息对象获取对应的参数
     * @param object $xmlObj xml字符串中提取的数据信息对象
     * @return array 获取的信息参数集合
     */
    protected function getInfoByXML($xmlObj) {
        // 解决key的标签，key首字母有的平台（bestv）大写（Key），有的平台小写(key)
        $epgInfoMap["key"] = $xmlObj->key ? $xmlObj->key : $xmlObj->Key;
        //解析参数
        $epgInfoMap["userId"] = $xmlObj->userId;
        $epgInfoMap["userToken"] = $xmlObj->userToken;
        $epgInfoMap["TokenExpiretime"] = $xmlObj->TokenExpiretime;
        $epgInfoMap["GroupId"] = $xmlObj->GroupId;
        $epgInfoMap["userIP"] = get_client_ip();
        $epgInfoMap["areaCode"] = $xmlObj->areaCode;
        $epgInfoMap["TradeId"] = $xmlObj->TradeId;
        $epgInfoMap["stbId"] = !empty($xmlObj->stbId) ? $xmlObj->stbId : "";

        $epgInfoMap["VAStoEPG"] = $xmlObj->VAStoEPG;
        $epgInfoMap["back_epg_url"] = $xmlObj->back_epg_url;
        $epgInfoMap["back_hall_url"] = $xmlObj->back_hall_url;
        $epgInfoMap["adContentId"] = $xmlObj->adContentId;
        $epgInfoMap["adContentName"] = $xmlObj->adContentName;
        $epgInfoMap["cdrtype"] = $xmlObj->cdrtype;
        $epgInfoMap["recSourceId"] = $xmlObj->recSourceId;
        $epgInfoMap["spid"] = $xmlObj->SPID ? $xmlObj->SPID : $xmlObj->spid;
        $epgInfoMap["IPTVPortalUrl"] = $xmlObj->back_hall_url && is_string($xmlObj->back_hall_url) ? $xmlObj->back_hall_url : $xmlObj->back_epg_url;

        return $epgInfoMap;
    }

    /**
     * 校验局方跳转参数的合法性
     * @param string $key 加密参数
     * @param string $spId 局方标识
     * @throws \Exception
     */
    protected function checkParams($key, $spId) {
        if (!$key || ($spId && $spId != SPID)) {
            throw new \Exception("非法INFO参数访问！");
        }
    }

    /**
     * 构建返回局方大厅地址
     * @param $backUrl
     * @return string
     */
    protected function getDecodeIPTVPortalUrl($backUrl) {
        return urldecode($backUrl);
    }

    /**
     * 构建返回局方大厅的xml标签
     * @param string $backUrl 局方大厅返回地址
     */
    protected function getInfoStrWithSPCodeTag($backUrl) {
        return urldecode($this->infoValue);
    }

    /**
     * 地区特殊处理函数
     * @param array $epgInfoMap 已经解析的信息参数
     */
    protected function handelAreaSpecial($epgInfoMap) {
    }
}