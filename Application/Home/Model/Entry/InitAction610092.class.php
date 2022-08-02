<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;

class InitAction610092 extends InitActionTelecom
{

    private $_isInfoValueEmpty = false;

    protected function getEPGInfo()
    {
        $infoValue = isset($_GET['INFO']) ? $_GET['INFO'] : null;
        if ($_GET["amp;returnurl"] || $_GET["returnurl"]) {
            $infoValue = $infoValue . "returnurl=" . $_GET["amp;returnurl"];
        }
        if (empty($infoValue)) {
            // 用户进入不通过聚精彩平台，通过电信平台直接进入，携带的参数内容通过epg_info获取
            $this->_isInfoValueEmpty = true;
            $infoValue = isset($_GET['epg_info']) ? $_GET['epg_info'] : null;
        }
        return $infoValue;
    }

    /**
     * 获取链接中INFO封装XML的内容
     * @param object $xmlObj xml解析后的数据对象
     * @return array 从XML内容里面提取的信息
     */
    protected function getInfoByXML($xmlObj)
    {
        $params = null;
        if ($this->_isInfoValueEmpty) {
            $params = $this->_parseXMLByEPGInfo($xmlObj);
        } else {
            $params = parent::getInfoByXML($xmlObj);
        }
        return $params;
    }


    /**
     * 获取链接中epg_info封装XML的内容
     * @param Object $xmlObj xml解析后的数据对象
     * @return array 从XML内容里面提取的信息
     */
    private function _parseXMLByEPGInfo($xmlObj)
    {
        $params = array();

        // 服务器地址
        $params['serverIP'] = $xmlObj->server_ip;
        // 客户端IP
        $epgInfoMap["userIP"] = get_client_ip();
        // 局方大厅返回地址
        $params['back_url'] = $xmlObj->back_url;
        // 用户分组路径
        $params['group_path'] = $xmlObj->group_path;
        // 用户分组标识
        $params['group_id'] = $xmlObj->group_id;
        // 页面路径
        $params['page_url'] = $xmlObj->page_url;
        // 盒子厂商
        $params['partner'] = $xmlObj->partner;
        // 用户token
        $params["userToken"] = $_GET['USERTOKEN'];
        // 用户名
        $params["user_name"] = $_GET['user_name'];
        // 用户账号
        $params["userId"] = $xmlObj->oss_user_id;
        // 获取fromLaunch参数
        $params['fromLaunch'] = isset($_GET['fromLaunch']) ? $_GET['fromLaunch'] == 'true' : 0;
        // 用户密码
        $params["password"] = isset($_GET['pwd']) ? substr($_GET['pwd'],12,strlen($_GET['pwd'])-15) : "null";
        LogUtils::info("task->pwd:".$_GET['pwd'].":password:".$params["password"]);

        if($params['fromLaunch'] && empty($params['userId'])){
            $params['userId'] = $_GET['USERID'];
        }

        return $params;
    }

    /**
     * 针对提取的业务参数做逻辑处理
     * @param array $epgInfoMap 已从链接获取的业务参数数组
     * @return array|mixed|null 调整后的业务参数数组
     */
    public function handleEPGInfoMap($epgInfoMap)
    {
        $result = null;
        if ($this->_isInfoValueEmpty) {
            // 缓存业务账号
            $epgInfoMap['userAccount'] = $epgInfoMap['userId'];
            MasterManager::setAccountId($epgInfoMap['userId']);
            // 缓存局方大厅返回地址
            if(empty($epgInfoMap['back_url'])){
                $epgInfoMap['back_url'] = $epgInfoMap['page_url'];
            }
            MasterManager::setIPTVPortalUrl($epgInfoMap['back_url']);
            // fromLaunch参数
            MasterManager::setCookieFromLaunch($epgInfoMap['fromLaunch']);
            $result = $epgInfoMap;
        } else {
            if(!empty($epgInfoMap['IPTVPortalUrl'])){
                $epgInfoMap['VAStoEPG'] = $epgInfoMap['IPTVPortalUrl'];
            }
            $result = parent::handleEPGInfoMap($epgInfoMap);
        }
        return $result;
    }

    protected function getInfoStrWithSPCodeTag($backUrl)
    {
        if (MasterManager::getSubId() != 2) {
            if (strpos($backUrl, "SPToAmsEducation") || strpos($backUrl, "SPToAmsHigh")) {
                return urldecode($this->infoValue . "<SPID>cpaj0038</SPID>");
            }
        }
        return urldecode($this->infoValue);
    }

    protected function handelAreaSpecial($epgInfoMap)
    {

        $epgInfoMap['fromLaunch'] = $epgInfoMap['IPTVPortalUrl'] == "launcher" ? 1 : 0;

        MasterManager::setCookieFromLaunch($epgInfoMap['fromLaunch']);
    }
}