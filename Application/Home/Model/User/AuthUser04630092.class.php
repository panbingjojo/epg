<?php

namespace Home\Model\User;

use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\GameAPI;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Common\URLUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

class AuthUser04630092 extends BaseAuthUser
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
        $this->macLoginInfoReport();

        $this->cardsDataReport($result);

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
        LogUtils::info("_setEPGParams: " . json_encode($_POST));

        MasterManager::setSTBModel($_POST['stbModel']); // 设备型号
        MasterManager::setSTBMac($_POST['stbMac']); // 设备ID(Mac地址)
        MasterManager::setSTBId($_POST['stbId']);  // 设备ID(序列号)
        MasterManager::setEpgDomain($_POST['epgDomain']); // 域名
    }

    public function isReportUserInfo($userId)
    {
        if (CARRIER_ID == CARRIER_ID_XINJIANGDX_HOTLINE) {
            return 0;
        }else {
            return parent::isReportUserInfo($userId);
        }
    }

    public function macLoginInfoReport()
    {
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $orderUrl = urlencode($epgInfoMap['productUrl']);
        $result = GameAPI::setMacLoginInfo($orderUrl,0);
        LogUtils::info("anthReport result:" . json_encode($result));
    }

    public function cardsDataReport($data)
    {
        LogUtils::info("cardsDataReport data:" . json_encode($data));
        if($data['isNewUser'] == 1){
            return GameAPI::addUserGameCards(3,3,1);
        }
        $result = GameAPI::getUserGameCards();
        LogUtils::info("cardsDataReport result:" . json_encode($result));
        LogUtils::info("cardsDataReport code:" . $result->code);
        if($result->code == 1){
            $res = GameAPI::getUserExpireGameCards();
            LogUtils::info("cardsDataReport getUserExpireGameCards:" . json_encode($res));
            if($data['isVip'] && $result->data->wangCards < 20){
                GameAPI::addUserGameCards(2,100,1);
            }
            LogUtils::info("cardsDataReport wangCards:" . $result->data->wangCards);
            if(!$data['isVip'] && $result->data->wangCards > 0){
                if($res->data->notExCards - $result->data->wangCards < 0){
                    GameAPI::addUserGameCards(5,$res->data->notExCards - $result->data->wangCards,0);
                }
            }
        }
    }
}