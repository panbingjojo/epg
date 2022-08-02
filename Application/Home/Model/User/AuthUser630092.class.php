<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

class AuthUser630092 extends BaseAuthUser
{
    public function auth()
    {

        $this->_setEPGParams(); // 保存EPG相关参数
        $result = $this->getCommonAJAXResult(); // 获取相关通用参数
        $routeFlag = MasterManager::getUserFromType(); // 局方链接路由标识
        if ($routeFlag == 1000) { // 路由指定模块标识
            $routeParam = MasterManager::getSubId();       // 局方链接路由携带参数
            $base64DecodeParam = base64_decode($routeParam);     // 参数需要进行base64解码
            $routeParamObj = json_decode($base64DecodeParam);    // 参数还需要进一步json解析
            if($routeParamObj->jump_type == 4) { // 路由振兴乡村模块,标识
                LogUtils::info("auth630092 set vipState 1");
                MasterManager::setVIPUser(1); // 振兴乡村模块，所有模块免费
            }
        }
        if(!MasterManager::getUserIsVip()){
            $this->setDirectPayUrl();
        }
        return $result;
    }

    public function setDirectPayUrl(){
        $hour=date( "H");
        if($hour<9){
            return -1;
        }
        if(MasterManager::isReportUserInfo() == 1){
            $result = UserManager::queryReportUserInfo(2);
            LogUtils::info("setDirectPayUrl result:" . json_encode($result));
            if (!empty($result) && $result->result == 0) {
                OrderManager::getInstance()->buildDirectPayUrl();
            }
        }
    }

    /** 鉴权用户身份 */
    public function checkVIPState()
    {
        $isExperienced = MasterManager::getFreeExperience();
        if($isExperienced == 1) {
            return $isExperienced;
        }else {
            return parent::checkVIPState();
        }
    }

    /** 保存EPG相关参数 */
    private function _setEPGParams()
    {
        if(CARRIER_ID == CARRIER_ID_QINGHAIDX) { // 青海电信振兴乡村模块，因局方不携带相关参数到链接，需要从前端获取
            $accountId = MasterManager::getAccountId();       // 当前用户账号
            $EPGHallUrl = MasterManager::getIPTVPortalUrl();  // 局方大厅返回地址
            if(!$accountId) { // 振兴乡村模块此时获取是未设置状态
                $accountIdParam = $_REQUEST['epgUserId'];     // 从请求中获取相关参数
                MasterManager::setAccountId($accountIdParam); // 更新服务器缓存
            }
            if (!$EPGHallUrl) { // 振兴乡村模块此时获取是未设置状态
                $EPGHallUrlParam = $_REQUEST['epgDomain'];    // 从请求中获取相关参数
                MasterManager::setIPTVPortalUrl($EPGHallUrlParam);  // 更新服务器缓存
            }
        }
    }

    public function isReportUserInfo($userId)
    {
        if (CARRIER_ID == CARRIER_ID_XINJIANGDX_HOTLINE) {
            return 0;
        }else {
            return parent::isReportUserInfo($userId);
        }
    }

}