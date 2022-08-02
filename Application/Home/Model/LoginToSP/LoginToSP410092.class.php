<?php
/**
 * Created by PhpStorm.
 * 河南电信EPG
 */

namespace Home\Model\LoginToSP;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class LoginToSP410092
{
    public static function loginToSP() {
        // http://xxxxxxxxxxx/UserLoginToSP?SuperEPG=frame224&platform=zte1&preframe=frame224&INFO=<userId>kehz_l</userId><userToken>4744-5-5/4,80/7/=3;170:16.9,7-7</userToken><TokenExpiretime>20110315150838</TokenExpiretime><GroupId>200</GroupId><userIP>xxx.xxx.xxx.xxx</userIP><areaCode>00</areaCode><TradeId></TradeId><key>4:2</key><stbId>xxxxxxxxxxxxx</stbId><VAStoEPG></VAStoEPG><back_epg_url>http://xxx.xxx.xxx.xxx:8080/iptvepg/frame81/portal.jsp</back_epg_url><back_epg_url_par></back_epg_url_par><optFlag>GAME</optFlag><contentID></contentID><epgDefinition></epgDefinition>

        // 对业务帐号以及userToken
        $accountId = LoginToSP410092::encodeInfo(MasterManager::getAccountId(), "5:2");
        $userToken = LoginToSP410092::encodeInfo(MasterManager::getUserToken(), "5:2");
        $TokenExpireTime = Date('Ymdhms',strtotime("+1 day"));
        $loginContentId = MasterManager::getLoginContentId();
        if ($loginContentId == "") {
            $loginContentId = "content0000000000000000000008878"; // 默认大厅地址编码id
        }
        $areaCode = isset($_GET['areaCode']) ? $_GET['areaCode'] : ''; // 地区码
        if(empty($areaCode)){
            $areaCode = '0'.substr($accountId,1,3);
        }
        LogUtils::info("loginToSP-->areaCode : $areaCode");

        $info = "<userId>" . $accountId . "</userId>"
               . "<userToken>" . $userToken . "</userToken><TokenExpiretime>" . $TokenExpireTime . "</TokenExpiretime>"
               . "<GroupId></GroupId><userIP>" . get_client_ip() . "</userIP><petName></petName>"
               . "<areaCode>" .$areaCode. "</areaCode><TradeId>" .MasterManager::getPlayerPlatform(). "</TradeId>"
               . "<key>5:2</key><stbId>test</stbId><VAStoEPG></VAStoEPG>"
               . "<back_epg_url></back_epg_url><back_hall_url></back_hall_url>"
               . "<optFlag>READING</optFlag><contentID>" . $loginContentId . "</contentID>";
        $loginUrl = USER_LOGIN_TO_SP . "?INFO=" . urlencode($info);
        LogUtils::info("loginToSP--> : $loginUrl");

        // 解析数据
        return $loginUrl;
    }

    public static function encodeInfo($message, $key) {
        // 判断key和userId是否为空
        if ($key == null) {
            return $message;
        }

        if ($message == null) {
            return $message;
        }

        // 解密的密钥型如key1:key2，以 : 分割
        $keyArray = explode(':', $key);
        if (count($keyArray) <= 1){
            return $message;
        }

        $key1 = $keyArray[0];
        $key2 = $keyArray[1];
        //根据key1拆分字符串
        $u1 = mb_substr($message, 0, $key1);
        $u2 = mb_substr($message, $key1, strlen($message));

        $start = 0;
        $end = strlen($u2) - 1;
        while ($start < $end) {
            $temp = $u2[$end];
            $u2[$end] = $u2[$start];
            $u2[$start] = $temp;
            $start++;
            $end--;
        }

        $m2 = '';
        for ($a = 0; $a < strlen($u2); $a++) {
            $m2 .= $u2[$a];
        }

        $message = $m2 . $u1;

        $asc_arr = array();
        //判断字符位置的奇偶对acsll码加减$key2
        for ($i = 0; $i < strlen($message); $i++) {
            //echo $message[$i];
            if (($i + 1) % 2 == 1) {
                $asc_arr[$i] = chr(ord($message[$i]) - $key2);
            } else {
                $asc_arr[$i] = chr(ord($message[$i]) + $key2);
            }
        }
        $message_tem = "";
        foreach ($asc_arr as $k => $v) {
            $message_tem .= $v;
        }
        return $message_tem;
    }
}