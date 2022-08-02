<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/2
 * Time: 15:42
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

/**
 * Class PayAPI
 * 支付相关的接口
 *
 * @package Home\Model\ServerAPI
 */
class GameAPI
{
    /**
    设置mac地址获得登录数据信息
     * @param $userId
     * @return mixed
     */
    static public function setMacLoginInfo($orderUrl,$orderState)
    {
        $json = array(
            "mac" => MasterManager::getSTBMac(),
            "userAccount" => MasterManager::getAccountId(),
            "isVip" => MasterManager::getUserIsVip(),
            "orderUrl" => $orderUrl,
            "orderState" => $orderState,
        );
        $http = new HttpManager(HttpManager::PACK_ID_SET_MAC_LOGIN_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    获得mac地址登录数据信息
     * @param $userId
     * @return mixed
     */
    static public function getMacLoginInfo($mac)
    {
        $json = array(
            "mac" => $mac,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_MAC_LOGIN_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    设置跳转
     * @param $userId
     * @return mixed
     */
    static public function setMacJumpInfo($mac,$gameId)
    {
        $json = array(
            "mac" => $mac,
            "gameId" => $gameId,
        );
        $http = new HttpManager(HttpManager::PACK_ID_SET_MAC_JUMP_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    获得mac地址登录数据信息
     * @param $userId
     * @return mixed
     */
    static public function getMacJumpInfo($mac)
    {
        $json = array(
            "mac" => $mac,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_MAC_JUMP_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    修改mac地址登录数据渠道号
     * @param $userId
     * @return mixed
     */
    static public function modifyMacLoginInfo($loginId,$channelId,$isVip,$orderUrl,$orderState,$orderType=0)
    {
        $json = array(
            "loginId" => $loginId,
            "channelId" => $channelId,
            "isVip" => $isVip,
            "orderUrl" => $orderUrl,
            "orderState" => $orderState,//0 已登录 //1 已订购申请 //2 生成处理
            "orderType" => $orderType,
        );
        $http = new HttpManager(HttpManager::PACK_ID_MODIFY_MAC_LOGIN_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     青海游戏获得经验等级砖石
     * @param $userId
     * @return mixed
     */
    static public function getExperGradeInfo()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_GET_EXPER_GRADE_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏获得经验等级砖石
     * @param $userId
     * @return mixed
     */
    static public function getExperRankData($type)
    {
        $json = array(
            "type"=>$type,//0 全省排行， 1 市排行
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_EXPER_GRADE_DATA);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏修改头像昵称
     * @param $userId
     * @return mixed
     */
    static public function modifyHandNickNameInfo($type)
    {
        $json = array(
            "type"=>$type,//1 修改昵称 2 修改头像
        );
        $http = new HttpManager(HttpManager::PACK_ID_MODIFY_HAND_NAME_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏分数上报
     * @param $userId
     * @return mixed
     */
    static public function gameScreReport($mac,$gemeId,$userId,$score)
    {
        $json = array(
            "mac"=>$mac,
            "gemeId"=>$gemeId,
            "userId"=>$userId,
            "score"=>$score,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GAME_SCORE_REPORT);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏游戏安装上报
     * @param $userId
     * @return mixed
     */
    static public function gameInstallReport($gemeId,$action)
    {
        $json = array(
            "mac"=>MasterManager::getSTBMac(),
            "userAccount"=>MasterManager::getAccountId(),
            "gemeId"=>$gemeId,
            "action"=>$action,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GAME_INSTALL_REPORT);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏获得安装游戏
     * @param $userId
     * @return mixed
     */
    static public function getGameInstallInfo($mac)
    {
        $json = array(
            "mac"=>$mac,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_GAME_INSTALL_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏获得安装游戏
     * @param $userId
     * @return mixed
     */
    static public function gameHandImgUpload($userId,$nickName,$handUrl)
    {
        $json = array(
            "userId"=>$userId,
            "nickName"=>$nickName,
            "handUrl"=>$handUrl,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GAME_HAND_IMG_UPLOAD);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏签到
     * @param $userId
     * @return mixed
     */
    static public function gameSignInInfo($type,$day,$diamond)
    {
        $json = array(
            "type"=>$type, //0 获得签到天数 1 签到
            "day"=>$day,
            "diamond"=>$diamond,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GAME_SIGN_IN);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏 获得游戏详情数据
     * @param $userId
     * @return mixed
     */
    static public function getGameCodeDetails($gameId)
    {
        $json = array(
            "gameId"=>$gameId,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_GAME_CODE_DETAILS);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏 获得头像数据
     * @param $userId
     * @return mixed
     */
    static public function getGameHandData()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_GET_GAME_HAND_DATA);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏 头像兑换
     * @param $userId
     * @return mixed
     */
    static public function gameDiamondConVertHand($handId)
    {
        $json = array(
            "handId"=>$handId,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GAME_DIAMOND_CONVERT_HAND);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏 游戏升级
     * @param $userId
     * @return mixed
     */
    static public function gameVersionUpgrade($type,$mac,$gameId,$version)
    {
        $json = array(
            "type"=>$type,//1 版本数据上报 2 校验版本是否是最新版本
            "mac"=>$mac,
            "gameId"=>$gameId,
            "version"=>$version,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GAME_VERSION_UPGRADE);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏 游戏二维码
     * @param $userId
     * @return mixed
     */
    static public function getGameHandQRCode()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_GET_GAME_HAND_QRCODE);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏 游戏二维码
     * @param $userId
     * @return mixed
     */
    static public function getAllGameInfo()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_GET_ALL_GAME_INFO);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏 添加乐卡
     * @param $userId
     * @return mixed
     */
    static public function addUserGameCards($type,$cards,$month)
    {
        $description = "";
        switch ($type) {
            case 1:
                $description = "充值";
                break;
            case 2:
                $description = "包月赠送";
                break;
            case 3:
                $description = "新用户试玩赠送";
                break;
            case 4:
                $description = "活动赠送";
                break;
            case 5:
                $description = "卡片回收";
                break;
        }
        $header = array('Content-type: application/json;charset=utf-8',);
        $data = array("userId"=>MasterManager::getUserId(), "cards"=>$cards, "description"=>$description);
        $result = HttpManager::httpRequestByHeader("POST", GOLD_COIN_CARDS_ADD, $header, json_encode($data));
        LogUtils::info("addUserGameCards-->data:" . json_encode($data));
        LogUtils::info("addUserGameCards-->result:" . $result);

        $result = gettype($result) == "string"?json_decode($result):$result;

        $json = array(
            "type"=>$type,//1 充值 2、包月赠送 3、新用户试玩赠送 4、活动赠送 5、卡片回收,6 测试账号赠送
            "cards"=>$cards,//充值数量
            "month"=>$month,//有效期
            "code"=>$result->code,//有效期
            "remark"=>json_encode($result),//有效期
        );
        $http = new HttpManager(HttpManager::PACK_ID_GAME_CARD_ADD);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    static public function getUserGameCards()
    {
        $url = GOLD_COIN_QUERY_INTERFACE."userId=".MasterManager::getUserId();//MasterManager::getAccountId();
        $result = HttpManager::httpRequestByHeader("GET",$url,"","");
        return json_decode($result);
    }

    /**
    青海游戏 游戏二维码
     * @param $userId
     * @return mixed
     */
    static public function getUserExpireGameCards()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_GET_GAME_CARD);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
    青海游戏 游戏二维码
     * @param $userId
     * @return mixed
     */
    static public function userGameQrCodeStateRev($type,$qrid)
    {
        $json = array(
            "type"=>$type,//type 1 更新状态 0 获得状态
            "qrid"=>$qrid,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GAME_QR_CODE_REV);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     * 请求订单,第三方支付下单
     */
    static public function httpJsonPost($url, $jsonStr){
        try{
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonStr);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Content-Type: application/json; charset=utf-8',
                    'Content-Length: ' . strlen($jsonStr)
                )
            );
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            return $response;
        }catch (Exception $e){
            LogUtils::info("httpJsonPost error, ,error=" . $e);
        }
    }
}