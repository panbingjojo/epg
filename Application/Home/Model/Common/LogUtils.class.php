<?php
/*
  +----------------------------------------------------------------------+
  | IPTV                                                                 |
  +----------------------------------------------------------------------+
  | 日志工具类
  +----------------------------------------------------------------------+
  | Author: yzq                                                          |
  | Date: 2017/11/30 17:56                                                |
  +----------------------------------------------------------------------+
 */

namespace Home\Model\Common;

use Home\Model\Entry\MasterManager;
use Redis;
use Think\Log;

Vendor('log4php.Logger');

class LogUtils
{
    public static function debug($msg)
    {
        self::writeLog("debug", $msg);
    }

    public static function warn($msg)
    {
        self::writeLog("warn", $msg);
    }


    public static function info($msg)
    {
        self::writeLog("info", $msg);
    }

    public static function error($msg)
    {
        self::writeLog("error", $msg);
    }

    public static function fatal($msg)
    {
        self::writeLog("fatal", $msg);
    }

    /**
     * @param string $logLevel
     * @param string $msg
     */
    private static function writeLog($logLevel = "info", $msg = "")
    {
        $accountID = MasterManager::getAccountId();
        $userID = MasterManager::getUserId();
        $cid = MasterManager::getCarrierId();
        $time = date("Y-m-d H:i:s");
        $objName = CONTROLLER_NAME;
        $objFunName = ACTION_NAME;
        $line = __LINE__;

        $logStr = $time . "  [" . $cid . "][" . $logLevel . "][" . $objName . "][" . $objFunName . "][" . $line . "][" . $userID . "][" . $accountID . "]--->" . $msg;

        self::reportLog($logLevel, $objName, $objFunName, $line, $cid, $userID, $accountID, $logStr);

    }

    /**
     * 上报错误日志
     * @param $logLevel
     * @param $objName
     * @param $objFunName
     * @param $line
     * @param $cid
     * @param $userID
     * @param $accountID
     * @param $logStr
     * @param $log
     */
    private static function reportLog($logLevel, $objName, $objFunName, $line, $cid, $userID, $accountID, $logStr)
    {

        if (IS_REDIS_CACHE_LOG == 1 && defined("REDIS_LOCAL_IP")) {
            $localIP = REDIS_LOCAL_IP;
            $localPort = REDIS_LOCAL_PORT;
        } else {
            Log::write($logStr, Log::INFO);
            return;
        }

        $data = array(
            "logLevel" => $logLevel,
            "objName" => $objName,
            "objFunName" => $objFunName,
            "line" => $line,
            "cid" => $cid,
            "userID" => $userID,
            "userAccount" => $accountID,
            "logStr" => $logStr,
        );
        $dataStr = json_encode($data);

        $redis = new Redis();
        $redis->connect($localIP, $localPort);
        $redis->auth(REDIS_AUTH_PASSWORD);
        // 选择第二个库（库序号：0，1，2.....）
        $redis->select(1);
        $isWriteSuccess = $redis->rPush("lm_log", $dataStr);
        if (!$isWriteSuccess) {
            Log::write("[localDebug]--->写入redis失败");
        }
        $redis->close();
    }


}