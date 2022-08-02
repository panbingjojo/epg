<?php

/**
 * 统计管理器
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/4
 * Time: 15:24
 */

namespace Home\Model\Stats;

use Api\APIController\DebugAPIController;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Common\ServerAPI\StatAPI;
use Home\Model\Entry\MasterManager;

/**
 * ？？？？？？？我也不知道这个类是干啥的
 * Class StatManager
 * @package Home\Model\Stats
 */
class StatManager {
    /**
     * 上报用户页面访问记录
     * @param $userId
     * @param null $aliasName
     * @param string $remark
     * @param string $prevNode
     * @return mixed|void
     */
    static public function uploadAccessModule($userId = "", $aliasName = null, $remark = "", $prevNode = "") {
        if ($remark == "pos") {
            $preNode = $prevNode;
            $currentNode = $aliasName;
        } else {
            $preNode = MasterManager::getAccessModule() ?
                MasterManager::getAccessModule() : "EPG - home";

            if ($aliasName != null) {
                $currentNode = CONTROLLER_NAME . " - " . ACTION_NAME . " - $aliasName"; // 当前控制器-方法-别名
            } else {
                $currentNode = CONTROLLER_NAME . " - " . ACTION_NAME; // 当前控制器-方法
            }
            MasterManager::setAccessModule($currentNode);
        }

        $epgVip = MasterManager::getUserIsVip();
        // Redis操作

        // 针对中国联通EPG，局方要求数据上报浏览数据类型6，对CarrierId做区分
        // 该操作类型表示只要发生页面类型跳转，就需要上报操作日志
        // 由于订购和播放器页面有其他操作类型表示，这里针对节点映射过滤
        $isReportData = CARRIER_ID == CARRIER_ID_CHINAUNICOM || CARRIER_ID == CARRIER_ID_CHINAUNICOM_MOFANG;
        if ($isReportData && CONTROLLER_NAME != "Player" && CONTROLLER_NAME != "Pay") {
            DebugAPIController::sendUserBehaviour000051(DebugAPIController::CHINAUNICOM_REPORT_DATA_TYPE["route"]);
        }

        $data = array(
            'user_id' => MasterManager::getUserId(),
            'user_account' => MasterManager::getAccountId(),
            'login_id' => MasterManager::getLoginId(),
            'is_vip' => $epgVip,
            "pre_node" => $preNode,
            "current_node" => $currentNode,
            "remark" => $remark,
            "log_dt" => date("Y-m-d H:i:s", time()),
        );

        if(MasterManager::getWaitTime() > 0){
            $second =  MasterManager::getWaitTime();
            $data['log_dt'] = date("Y-m-d H:i:s", strtotime("+ $second second"));
        }
        // 如果redis缓存里少于特定条数，则继续往里面写
        // 否则，就从redis里取出向cws发送

        // 特殊地区，不缓存，直接上报
        $specialCarrierIDList = [CARRIER_ID_HUNANDX];

        if (RedisManager::redisIsWorking() && !in_array(CARRIER_ID, $specialCarrierIDList)) {
            $key = RedisManager::buildKey(RedisManager::$REDIS_ACCESS_MODULE);
            $count = RedisManager::checkPushLen($key);
            if ($count < REDIS_CACHE_ACCESS_MODULE_COUNT) {
                RedisManager::pushPageConfig($key, $data);
                return;
            } else {
                LogUtils::info("### begin pop access module data! count = " . REDIS_CACHE_ACCESS_MODULE_COUNT);
                $dataList = RedisManager::popPageConfig($key, REDIS_CACHE_ACCESS_MODULE_COUNT);
                LogUtils::info("### finish pop access module data!!! count = " . count($dataList));
                LogUtils::info("### finish pop access module data!!! dataList = " . json_encode($dataList));
                array_push($dataList, json_decode(json_encode($data)));
                $data = array('data_list' => $dataList);
            }
        }

        return StatAPI::postAccessModule($data);
    }

    static public function uploadPayAccessModule($prevNode = "",$aliasName = null, $remark = "") {
        $preNode = $prevNode;
        $currentNode = $aliasName;

        $epgVip = MasterManager::getUserIsVip();

        $i = 1;
        $dataList = [];
        while ($i <= 4){
            switch ($i){
                case 1:
                    $numbers = rand(5,50);
                    $preNode = MasterManager::getAccessModule();
                    $currentNode = $prevNode;
                    $mk_remark = $remark;
                    MasterManager::setWaitTime(MasterManager::getWaitTime()+$numbers);
                    break;
                case 2:
                    $numbers = rand(10,30);
                    $preNode = $prevNode;
                    $currentNode = $aliasName;
                    $mk_remark = "";
                    MasterManager::setWaitTime(MasterManager::getWaitTime()+$numbers);
                    break;
                case 3:
                    $numbers = rand(10,30);
                    $preNode = $aliasName;
                    $currentNode = $prevNode;
                    $mk_remark = $remark;
                    MasterManager::setWaitTime(MasterManager::getWaitTime()+$numbers);
                    break;
                case 4:
                    $numbers = rand(5,50);
                    $preNode = $prevNode;
                    $currentNode = MasterManager::getAccessModule();
                    $mk_remark = "";
                    MasterManager::setWaitTime(MasterManager::getWaitTime()+$numbers);
                    break;
                default:
                    break;
            }

            $i++;
            $second =  MasterManager::getWaitTime();
            $data = array(
                'user_id' => MasterManager::getUserId(),
                'user_account' => MasterManager::getAccountId(),
                'login_id' => MasterManager::getLoginId(),
                'is_vip' => $epgVip,
                "pre_node" => $preNode,
                "current_node" => $currentNode,
                "remark" => $mk_remark,
                "log_dt" => date("Y-m-d H:i:s", strtotime("+ $second second")),
            );

            array_push($dataList, $data);
        }
        LogUtils::info("dataList:".json_encode($dataList));

        $dataarr = array('data_list' => $dataList);

        return StatAPI::postAccessModule($dataarr);
    }

    /**
     * 上传播放视频开始
     * @param $userId
     * @param $playInfo
     * @return bool
     * @throws \Think\Exception
     */
    static public function uploadPlayVideoStart($userId, $playInfo) {
        $isVip = MasterManager::getUserIsVip();
        $result = StatAPI::postPlayVideoStart($userId, $isVip, $playInfo);
        $result = json_decode($result);
        if ($result->result == 0) {
            // 保存播放记录到session，用于统计播放时长
//            $param = array(
//                "beginTime" => $playInfo["beginTime"],
//                "sourceId" => $playInfo['sourceId'],
//                "title" => $playInfo['title'],
//                "playId" => $result->play_id,
//                "isVip"=>$isVip);

            $playInfo['playId'] = $result->play_id;
            $playInfo['isVip'] = $isVip;

            MasterManager::setPlayParams($playInfo);
            return true;
        } else {
//            LogUtils::info("post user[".$userId. "] begin play video failed: ");
            return false;
        }
    }

    /**
     * 上传播放视频完成
     * @param $userId
     */
    static public function uploadPlayVideoFinish($userId, $playInfo) {
        if ($playInfo == null || empty($playInfo)) {
            $playInfo = MasterManager::getPlayParams();
        }

        StatAPI::postPlayVideoFinish($userId, $playInfo);
    }
}