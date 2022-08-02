<?php
/**
 * Date: 2017/11/30
 * Time: 17:05
 * @breif:管理器将用于活动相关的数据业务处理
 */

namespace Home\Model\Activity;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\ActivityAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;


class ActivityManager
{
    /**
     * 判断当前活动是否为联合活动。
     * @return bool true：是联合活动。false：应用内活动。
     */
    public static function isJointActivity()
    {
        // 约定的命名规范：
        //      应用活动标识 ---> Activity{活动别名}{日期时间}
        //      联合活动标识 ---> JointActivity{活动别名}{日期时间}
        $SUFFIX_JOINT_ACTIVITY = "JointActivity";
        $currentActivityName = MasterManager::getActivityName();
        if (isset($currentActivityName) && (strlen($currentActivityName) >= strlen($SUFFIX_JOINT_ACTIVITY))) {
            $currentActivitySuffix = substr($currentActivityName, 0, strlen($SUFFIX_JOINT_ACTIVITY));
            return $currentActivitySuffix == $SUFFIX_JOINT_ACTIVITY;
        } else {
            LogUtils::info('ActivityManager::isJointActivity() ---->Getting "currentActivityName" is not exit!!!');
            return false;
        }
    }

    /**
     * @brief : 根据标签符来得到活动id
     * @param string $uniqueName 活动唯一标识
     * @return int 活动id
     */
    public static function getActivityId($uniqueName)
    {
        $activityId = -1;

        $json = array(
            "unique_name" => $uniqueName,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTITITY_GET_ID);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        if ($data['result'] == 0) {
            $activityId = $data['activity_id'];
            MasterManager::setActivityId($activityId);
            MasterManager::setActivityName($uniqueName);
        } else {
            MasterManager::setActivityId("-1");
            MasterManager::setActivityName("");
        }

        return $activityId;
    }


    /**
     * @brief : 根据标签符来得到活动id
     * 上面的写死了活动ID，导致进入其他活动中无法正常执行活动
     * @param $uniqueName 活动唯一标识
     * @return int 活动id
     */
    public static function getOnceActivityId($uniqueName)
    {

        $json = array(
            "unique_name" => $uniqueName,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTITITY_GET_ID);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        if ($data['result'] == 0) {
            $activityId = $data['activity_id'];
        } else {
            exit('不存在的标识符！');
        }

        return $activityId;
    }


    /**
     * @brief: 获取正在进行活动的信息
     * @return json对象 正在进行的活动的信息
     */
    public static function getActivityInfo()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        if ($data['result'] == 0 && $data['list'] != null && $data['list'] != "" && !empty($data['list'])) {
            $activityId = $data['list']['activity_id'];
            $activityName = $data['list']['unique_name'];
            MasterManager::setActivityId($activityId);
            MasterManager::setActivityName($activityName);
            return $data['list'];
        } else {
            MasterManager::setActivityId("-1");
            MasterManager::setActivityName("");
        }

        return $json;
    }


    /**
     * @brief: 获取最新一条订单记录
     */
    public static function getLastDrawPrizeRecord()
    {
        // 自己的中奖信息
        $myPrizeList = ActivityManager::inquirePrize();

        // 提取最新一条记录
        $myPrizeArray = json_decode($myPrizeList);
        $item = $myPrizeArray->list[0];
        return $item;
    }

    /**
     * 查询中奖纪录
     */
    public static function inquirePrize()
    {
        if (MasterManager::getActivityName() == 'ActivityTeachersDay20200818') {
            $json = array(
                "activity_id" => MasterManager::getActivityId(),
                "round_flag" => "2",
            );
        } else {
            $json = array(
                "activity_id" => MasterManager::getActivityId(),
            );
        }

        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_INQUIRE_PRIZE_RECORD);
        $result = $httpManager->requestPost($json);
        return $result;

    }

    /**
     * 拉取所有用户的奖品记录
     */
    public static function getAllUserPrizeList()
    {
        if (MasterManager::getActivityName() == 'ActivityTeachersDay20200818') {
            $json = array(
                "activity_id" => MasterManager::getActivityId(),
                "round_flag" => "2",
            );
        } else {
            $json = array(
                "activity_id" => MasterManager::getActivityId(),
            );
        }

        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_WIN_PRIZE);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        return $data;
    }

//    /**
//     * ajax拉取所有用户的奖品记录
//     */
//    public static function getAllUserPrizeListByAjax()
//    {
//        $json = array(
//            "activity_id" => MasterManager::getActivityId(),
//        );
//        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_WIN_PRIZE);
//        $result = $httpManager->requestPost($json);
//        $data = json_decode($result, true);
//        return $data;
//    }

    /**
     * 获取最近订购列表
     */
    public static function getRecentOrderList()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_RECENT_ORDER_LIST);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        return $data;
    }

    /**
     * @brief:向服务器进行兑换物品
     * goods_id    要兑换的物品的id
     * exchg_count 要兑换的物品的数量
     * @return mixed
     */
    public static function exchangePrize($goodsId)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "goods_id" => $goodsId,
            "exchg_count" => 1,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_EXCHANGE_PRIZE);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * @brief: 我的兑换列表和活动所有的兑换记录
     * @return mixed
     */
    public static function getExchangePrizeListRecord()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_EXCHANGE_PRIZE_RECORD_LIST);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        return $data;
    }

    /**
     * @brief: 设置兑换物品的联系方式
     * goodsId    物品id（可选），不传或为空，将设置该用户该活动下所有兑换物品的电话
     * tel    电话号码
     * @return mixed
     */
    public static function setExchangePrizeTel($tel, $goodsId)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "user_tel" => $tel,
            "goods_id" => $goodsId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_SET_EXCHANGE_PRIZE_TEL);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * @Brief:此函数用于获取活动奖项设置
     */
    public static function getActivityPrizeConfig()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_PRIZE_CONFIGURATION);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * @Brief:此函数用于拉取活动兑换物品列表（包含物品及兑换所需消耗的列表）
     */
    public static function getActivityGoodsList()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_GOODS_LIST);
        $result = $httpManager->requestPost($json);
        return $result;
    }


    /**
     * 增加用户积分
     * @param $userId
     * @param $activityId
     * @param $score
     * @param string $remark
     * @return mixed
     */
    public static function addUserScore($userId, $activityId, $score, $remark = "")
    {
        $data = array(
            "user_id" => $userId,
            "activity_id" => $activityId,
            "add_score" => $score,
            "remark" => $remark,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_ADD_USER_SCORE);
        $result = $httpManager->requestPost($data);

        return $result;
    }

    /**
     * 得到用户积分
     * @param $userId
     * @param $activityId
     * @return mixed
     */
    public static function getUserScore($userId, $activityId)
    {
        $data = array(
            "user_id" => $userId,
            "activity_id" => $activityId
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_USER_SCORE);
        $result = $httpManager->requestPost($data);
        $ret = json_decode($result);
        $score = $ret->result == 0 ? $ret->score : 0;

        return $score;
    }

    /**
     * @Brief:此函数用于此函数用于上报每玩一次的记录
     * @param: $playResult 玩游戏的结果（0正确 1错误）
     * @param: $playContent 玩游戏的附加内容
     * @return: $result 上报结果
     */
    public static function uploadPlayedRecord($playResult, $playContent)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "answer_result" => $playResult,
            "answer_content" => $playContent
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_UPLOAD_ANSWER_RESULT);
        $result = $httpManager->requestPost($json);
        return $result; // {"result":0}
    }

    /**
     * 存储客户端数据
     * @param $key
     * @param $data
     * @param int $expireTime
     * @return mixed
     */
    public static function saveStoreData($key, $data, $expireTime = -1)
    {
        $jsonArr = array(
            "key" => $key,
            "val" => $data,
            "save_days" => $expireTime
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_SAVE_STORE_DATA);
        $res = $httpManager->requestPost($jsonArr);
        return $res;
    }


    /**
     * @Brief:此函数用于此函数用于上报用户点赞投票
     * @param: activity_id 活动id
     * @param: player_id 参赛者id
     * @return: $result 上报结果
     */
    public static function uploadPlayerVote($playId)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "player_id" => $playId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_SET_VOTE);
        $result = $httpManager->requestPost($json);
        return $result; // {"result":0}
    }

    /**
     * @Brief:此函数用于此函数用于获取用户点赞投票
     * @param: activity_id 活动id
     * @param: player_id 参赛者id
     * @return: $result 上报结果
     */
    public static function getPlayerVote($playId)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "player_id" => $playId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_VOTE);
        $result = $httpManager->requestPost($json);
        return $result; // {"result":0}
    }

    /**
     * 根据key值获取客户端的数据
     * @param $key
     * @return mixed
     */
    public static function queryStoreData($key)
    {
        $jsonArr = array(
            "key" => $key,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_QUERY_STORE_DATA);
        $res = $httpManager->requestPost($jsonArr);
        return $res;
    }

    /**
     * 获取活动信息
     * @return mixed
     */
    public static function getActivityList()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_REQUEST);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        return $data;
    }

    /**
     * @Brief:此函数用于判断活动是否有效
     * @param: $activityInfoData 活动信息
     * @return: true--表示有效，false--表示无效
     */
    public static function activityIsValid($activityInfoData)
    {
        $isValid = false;
        if (isset($activityInfoData->list->start_dt) && isset($activityInfoData->list->end_dt)) {
            $endDt = $activityInfoData->list->end_dt;
            $status = $activityInfoData->list->status; // 0-- 未开始，1--正在进行，2--已关闭
            $nowTime = intval(time());
            $endDt = strtotime($endDt);

            // 如果活动不在进行中，则返回false
            if ($status == 2) {
                $isValid = false;
            } else if ($nowTime >= $endDt) {
                // 如果当天时间不在活动期间的范围内，返回false
                $isValid = false;
            } else {
                $isValid = true;
            }
        }
        return $isValid;
    }

    /**
     * @Brief:此函数用于判断参数活动是否中奖，中奖就跳去活动页
     * @param $activityName 活动标识符
     * @return: true--表示中奖，false--表示没有中奖
     */
    public static function isDirectToDrawPrize($activityName)
    {
        // 根据活动标识，查询活动ID
        $activityId = ActivityManager::getActivityId($activityName);
        MasterManager::setActivityId($activityId);

        // 通过活动ID，来查询活动的信息
        $activityInfo = ActivityAPI::activityInfo();
        $activityInfo = json_decode($activityInfo);
        // 判断活动的有效性，如果当前时间大于活动的结束时间，就不能进行活动
        if ($activityInfo->result != 0
            || ActivityManager::activityIsValid($activityInfo) == false) {
            return false;
        }

        // 去抽奖
        $prizeInfo = ActivityAPI::participateActivity(1, null);
        $prizeInfo = json_decode($prizeInfo);

        // 判断是否中奖
        if ($prizeInfo->result == 1 && $prizeInfo->prize_idx != "") {
            // 表示已经中奖
            return true;
        }
        return false;
    }

    /**
     * 增加额外活动次数
     * @return mixed
     */
    public static function addExtraActivityTimes()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_ADD_EXTRA_TIMES);
        $result = $httpManager->requestPost($json);
        //$data = json_decode($result, true);
        return $result;
    }

    /**
     * 扣除额外活动次数
     * @return mixed
     */
    public static function subExtraActivityTimes()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_SUBTRACT_EXTRA_TIMES);
        $result = $httpManager->requestPost($json);
        //$data = json_decode($result, true);
        return $result;
    }

    /**
     * 查询额外活动次数
     * @return mixed
     */
    public static function getExtraActivityTimes()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_EXTRA_TIMES);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        return $data;
    }
}