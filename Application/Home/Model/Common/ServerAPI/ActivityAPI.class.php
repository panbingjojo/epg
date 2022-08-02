<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 活动相关的API封装
// +----------------------------------------------------------------------
// | 功能：活动（联合活动 && 应用活动）中常用的交互API封装，如：设置/获取
// | 手机号码、上报参与活动记录、参与抽奖活动、是否可玩（或是否可答题）等
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/8/22 11:53
// +----------------------------------------------------------------------


namespace Home\Model\Common\ServerAPI;

use Home\Model\Activity\ActivityConstant;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

class ActivityAPI
{

    /**
     * 增加用户抽奖次数
     * 0 成功增加次数
     * -112 仅限普通用户
     */
    public static function addUserLotteryTimes()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_ADD_USER_LOTTERY_TIMES);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 设置中奖手机号码
     *
     * @param $phoneNumber
     * @param $prizeIdx
     * @param $activityId
     * @return mixed
     */
    public static function setPhoneNumberForPrize($phoneNumber, $prizeIdx, $activityId = "")
    {
        if ($activityId == "") {
            $activityId = MasterManager::getActivityId();
        }

        $json = array(
            "activity_id" => $activityId,
            "prize_idx" => $prizeIdx, // 中奖奖项编号，-1表示所有奖品的统一号码
            "user_tel" => $phoneNumber
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_SUBMIT_TEL_URL);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 设置兑换物品的联系方式
     *
     * @param $phoneNumber
     * @param $goodsId
     * @return mixed
     */
    public static function setPhoneNumberForExchange($phoneNumber, $goodsId)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "goods_id" => $goodsId, // 物品id（可选），不传或为空，将设置该用户该活动下所有兑换物品的电话
            "user_tel" => $phoneNumber,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_SET_EXCHANGE_PRIZE_TEL);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 保存用户信息
     * @param $userAccount //业务账号
     * @param $userName //用户姓名
     * @param $userTel //手机号码
     * @param $address //地址
     * @return mixed
     */
    public static function saveUserInfo($userAccount, $userName, $userTel, $address)
    {
        $json = array(
            "user_account" => $userAccount,
            "user_name" => $userName,
            "phone_num" => $userTel,
            "address" => $address,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_SET_SAVE_USER_INFO);
        $result = $httpManager->requestPost($json);
        return $result;
    }


    /**
     * 查询当前活动中奖纪录
     */
    public static function inquirePrize()
    {
        $activityName = MasterManager::getActivityName();
        if ($activityName == 'ActivityTeachersDay20200818' || $activityName == 'ActivityRabbitMaze20200907' || $activityName == 'JointActivityApril20210318' || $activityName == 'ActivityApril20210318') {
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
     * 查询当前活动预约记录
     */
    public static function inquireRecord()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_HAS_WINNING);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 查询活动或奖品中奖次数
     */
    public static function getActivitySurplusNum()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "prize_idx" => "1"
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_SURPLUS);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 统一判断入口（包含：联合活动 && 应用内活动），判断用户是否可以答题（或玩游戏）
     */
    public static function canAnswer()
    {
        if (ActivityManager::isJointActivity()) {   // 联合活动判断规则
            return self::_canAnswerJointActivity();
        } else {                                    // 应用活动判断规则
            return self::_canAnswerInnerActivity();
        }
    }

    /**
     * 应用内活动，判断用户是否可以答题（或玩游戏）
     */
    private static function _canAnswerInnerActivity()
    {
        // 目前所有地区的应用活动，判断试玩次数规则一致！暂不分地区，如后续需要，可switch-case分发处理！
        return self::_canAnswerInnerActivityCommonly();
    }

    /**
     * 联合活动，判断用户是否可以答题（或玩游戏）默认的通用规则策略实现。
     * 1、先从cws服务器拉取已经答题的次数
     * 2、从session里获取鉴权时sp厂商的vip状态
     * 3、合并上面两个数组，并上传给页面
     * 5、剩余次数 = cws拉下来的次级 + 鉴权多出来的次数（也就是在订购之前，sp已经在局方是vip的状态）
     */
    private static function _canAnswerJointActivity()
    {
        // 目前所有地区的联合活动，判断试玩次数规则一致！暂不分地区，如后续需要，可switch-case分发处理！
        return self::_canAnswerJointActivityCommonly();
    }

    /**
     * 应用内活动：判断用户是否可以答题（或玩游戏）默认的通用规则策略实现。
     */
    private static function _canAnswerInnerActivityCommonly()
    {
        $answerTimesArray = self::getCanAnswerTimesInnerActivity();

        // 计算可玩次数
        if ($answerTimesArray["result"] == 0
            //活动ActivitySeaBattle20190619，碧水清波，海洋保卫战 规则调整，当天每玩3次送一次
            || MasterManager::getActivityName() == "ActivitySeaBattle20190619") {
            $leftTimes = $answerTimesArray["leftTimes"] < 0 ? 0 : $answerTimesArray["leftTimes"];
            $answeredTimes = $answerTimesArray["answeredTimes"] < 0 ? 0 : $answerTimesArray["answeredTimes"];// 用户每天试玩次数未超过{后台配置}次，则可继续使用。
        } else {
            $leftTimes = 0;// 当请求失败时，不可试玩
            $answeredTimes = 0;
        }

        $return = json_encode(array(
            'result' => 0,
            'leftTimes' => $leftTimes,
            'answeredTimes' => $answeredTimes,
            'demoTimes' => 0));
        return $return;
    }

    /**
     * 联合活动：判断用户是否可以答题（或玩游戏）默认的通用规则策略实现。
     * <pre>
     *      1、先从cws服务器拉取已经答题的次数
     *      2、从session里获取鉴权时sp厂商的vip状态
     *      3、合并上面两个数组，并上传给页面
     *      4、剩余次数 = cws拉下来的次级 + 鉴权多出来的次数（也就是在订购之前，sp已经在局方是vip的状态）
     * </pre>
     */
    private static function _canAnswerJointActivityCommonly()
    {

        $answerTimes = self::getCanAnswerTimesJointActivity();
        $authSPMap = self::getOrderSpInfo();

        $result = json_encode(array(
            'result' => 0,
            'leftTimes' => $answerTimes['leftTimes'],
            'demoTimes' => $answerTimes['demoTimes'],
            'spMap' => $authSPMap));
        return $result;
    }

    /**
     * 统一判断入口（联合活动 && 应用内活动）：判断用户可以答题（或玩游戏）次数
     * @return array 返回数组 [result:r, answeredTimes:a, totalAnsweredTimes:b, leftTimes:x, demoTimes:y]
     */
    public static function getCanAnswerTimes()
    {
        if (ActivityManager::isJointActivity()) {   // 联合活动判断规则
            return self::getCanAnswerTimesJointActivity();
        } else {                                    // 应用活动判断规则
            return self::getCanAnswerTimesInnerActivity();
        }
    }

    /**
     * 获取“应用内活动”可玩次数数组。
     * @return array 返回数组 [result:r, answeredTimes:a, totalAnsweredTimes:b, leftTimes:x, demoTimes:y]
     */
    private static function getCanAnswerTimesInnerActivity()
    {
        $activityId = MasterManager::getActivityId();
        $json = array(
            "activity_id" => $activityId,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_CAN_ANSWER);
        $result = $httpManager->requestPost($json);
        $result = json_decode($result);

        //活动ActivitySeaBattle20190619，碧水清波，海洋保卫战 规则调整，当天每玩3次送一次
        if (MasterManager::getActivityName() == "ActivitySeaBattle20190619" && $result->answered_times >= 3) {
            $result->result = 0;
        }

        // 请求失败时，默认返回0（加强保护，避免answered_times/total_answered_times/left_times这些值为null，从而导致其它使用引发错误）
        if ($result->result != 0) {
            return array(
                'result' => $result->result,
                'answeredTimes' => 0,           // 当天已参与次数
                'totalAnsweredTimes' => 0,      // 历史参与次数
                'leftTimes' => 0,               // 当天剩余次数
                'demoTimes' => 0);
        } else {
            return array(
                'result' => $result->result,
                'answeredTimes' => $result->answered_times,                 // 当天已参与次数
                'totalAnsweredTimes' => $result->total_answered_times,      // 历史参与次数
                'leftTimes' => $result->left_times,                         // 当天剩余次数
                'demoTimes' => 0);
        }
    }

    /**
     * 获取“联合活动”可玩次数数组。子类可重写，默认为联合活动的获取->计算次数规则。
     * @return array 返回数组 [result:r, answeredTimes:a, totalAnsweredTimes:b, leftTimes:x, demoTimes:y]
     */
    private static function getCanAnswerTimesJointActivity()
    {
        $activityName = MasterManager::getSubId();
        $demoTimes = 0; // 试玩次数
        $leftTimes = 0; // 剩余次数
        $Times = 0; // 此用户鉴权完成，可以玩的次数

        // 请求用户已经玩过的次数
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "guizhoult_flag" => 1, //中国联通EPG（贵州联通）联合活动专用,只要存在该参数即视为中国联通EPG（贵州联通）联合活动，返回结果就会返回total_answered_times。
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_CAN_ANSWER);
        $result = $httpManager->requestPost($json);
        $result = json_decode($result);

        $answerTimes = (int)($result->answered_times); // cws -- 返回
        $totalAnsweredTimes = (int)($result->total_answered_times); // 历史参与次数

        // 校验用户信息
        if (ActivityManager::isJointActivity()) {
            OrderManager::getInstance()->jointActivityAuthUserInfo();
        }

        // 从session里取出从局方鉴权时已经订购的vip的sp信息
        $spInfoList = MasterManager::getActivityOrderSPMap();
        $authSPMap = array();
        $i = 0;
        foreach ($spInfoList as $key => $value) {
            $authSPMap[$i] = json_encode(array('contentId' => $key, "status" => $value));
            $i++;
        }

        if ($activityName == ActivityConstant::SUB_ID_JOINT_ACTIVITY_FETCHFOOD20220524) {
            $Times = 3;
        }

        // 比较两个不同的订购关系（$spids、$authSPMap），避免用户在局方已经是vip，在我们这边还不是vip的情况
        foreach ($authSPMap as $key => $value) {
            $valueObj = json_decode($value);
            if ($valueObj->status == 1) {
                if (ActivityConstant::SUB_ID_JOINT_ACTIVITY_GROWING_UP20190517 || ActivityConstant::SUB_ID_JOINT_ACTIVITY_WOMENDAY20200225 || ActivityConstant::SUB_ID_JOINT_ACTIVITY_LABA_RACE20201228 || ActivityConstant::SUB_ID_JOINT_ACTIVITY_FETCHFOOD20220524) {
                    $Times += 1;
                } else {
                    $Times += 2;
                }

            }
        }

        if ($answerTimes > 0) {
            $demoTimes = 1;  //每天都有一次答题免费机会
        }

        switch ($activityName) {
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_FETCHFOOD20220524:
                $leftTimes = $Times - $answerTimes;
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_WORDSPUZZLE20190124:
                if ($totalAnsweredTimes == 0) {
                    // 首次进入活动，送一次免费试玩机会
                    $leftTimes = $Times - $answerTimes + 1;
                } else {
                    $leftTimes = $Times - $answerTimes;
                }
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_GROWING_UP20190517:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_LABA_RACE20201228:
                $leftTimes = $Times - $answerTimes + 1;
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITYHURDLE20191113:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_WOMENDAY20200225:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITYREFUSECLASSIFICATION20190808:
                $leftTimes = $Times - $answerTimes;
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_EXCLUSIVE_GARDEN20220124:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_SNACK_WARS20220608:
                $leftTimes = 0;
                break;
            default:
                $leftTimes = $Times - $answerTimes + 1;  //其他活动，每天都有一次答题免费机会
                break;
        }

        if ($leftTimes < 0) {
            $leftTimes = 0;
        }

        /*// 如果该用户没有参与过，则有一次免费体验的机会
        if ($totalAnsweredTimes == 0) {
            $demoTimes = 1;
        }

        // 先判断是否有玩过次数，如果是有玩过，就不能再有体验次数
        if ($totalAnsweredTimes > 0) {
            // 如果今天已经试玩过一次再订购，则把试玩次数不计算在剩余次数内
            if ($totalAnsweredTimes == $answerTimes && $answerTimes > 0) { // 当天试玩
                // 计算可以玩的次数
                $leftTimes = $Times - $answerTimes + 1;
                if ($leftTimes < 0) {
                    $leftTimes = 0;
                }
            } else {
                // 计算可以玩的次数
                $leftTimes = $Times - $answerTimes;
                if ($leftTimes <= 0) {
                    $leftTimes = 0;
                }
            }
        } else if ($totalAnsweredTimes == 0) { // 没有试玩过
            $leftTimes = $Times + 1;
        }*/
        return array(
            'result' => 0,
            'answeredTimes' => $answerTimes,                    // 当天已参与次数
            'totalAnsweredTimes' => $totalAnsweredTimes,        // 历史参与次数
            'leftTimes' => $leftTimes,                         // 当天剩余次数
            'spMap' => $authSPMap,
            'demoTimes' => $demoTimes);
    }

    /**
     * 参与抽奖活动
     * @param $prizeIdx
     * @return mixed
     * <pre>$httpManager->requestPost($json)返回字符串结果示例：
     *  {
     *      "result": 1,
     *      "msg": "中奖提示",
     *      "prize_idx": 1,
     *      "prize_name": "中奖奖品名",
     *      "left_times": -1,
     *      "is_vip": 1
     *  }
     * </pre>
     */
    public static function participateActivity($roundFlag, $prize_idx = "", $activityId = "")
    {
        if ($activityId == "") {
            $activityId = MasterManager::getActivityId();
        }

        $json = array(
            "activity_id" => $activityId,
            "round_flag" => $roundFlag,  // 第几轮（默认为第一轮）
            "prize_idx" => empty($prize_idx) ? 0 : $prize_idx,   // 抽第几等奖品
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_PRIZE_URL);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 当前活动信息
     * @param: activity_id
     * @return mixed
     */
    public static function activityInfo()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_REQUEST);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 上报每玩一次的记录
     * @param $playResult
     * @param $playContent
     * @return mixed : $result 上报结果
     */
    public static function uploadPlayedRecord($playResult, $playContent)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),    // 当前活动标识ID
            "answer_result" => $playResult,                                                     // 玩游戏的结果（0正确 1错误）
            "answer_content" => $playContent                                                    // 玩游戏的附加内容
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_UPLOAD_ANSWER_RESULT);
        $result = $httpManager->requestPost($json);
        return $result; // {"result":0}
    }

    /**
     * 上报每次拼图记录
     * @param $picNum 获取的拼图序号
     * @return mixed
     */
    public static function uploadPuzzleRecord($picNum)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),    // 当前活动标识ID
            "picNum" => $picNum,                                                     // 玩游戏的结果（0正确 1错误）
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_UPLOAD_ANSWER_RESULT);
        $result = $httpManager->requestPost($json);
        return $result; // {"result":0}
    }

    /**
     * 获取订购状态的sp信息（应用场景：联合活动）
     * @return mixed : $result 数组
     * <pre>例如：
     *  [
     *      {
     *          "contentId": "sjjklinux",
     *          "status": 1
     *      },
     *      {
     *          "contentId": "xcfcly",
     *          "status": 1
     *      },
     *      {
     *          "contentId": "zhxq",
     *          "status": 0
     *      },
     *      {
     *          "contentId": "drlxyy",
     *          "status": 0
     *      }
     *  ]
     * </pre>
     */
    public static final function getOrderSpInfo()
    {
        // 从session里取出从局方鉴权时已经订购的vip的sp信息
        $spInfoList = MasterManager::getActivityOrderSPMap();
        $authSPMap = array();
        $i = 0;

        foreach ($spInfoList as $key => $value) {
            $authSPMap[$i] = json_encode(array('contentId' => $key, "status" => $value));
            $i++;
        }

        return $authSPMap;
    }

    /**
     * 增加/减少用户积分
     * @param $score
     * @param string $remark
     * @return mixed
     */
    public static function addUserScore($score, $remark = "")
    {
        $data = array(
            "activity_id" => MasterManager::getActivityId(),    // 当前活动标识ID
            "add_score" => $score, // 增加或减少的积分（小于0表示减少积分）
            "remark" => $remark, // 备注信息：本次增加或减少积分的原因的描述
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_ADD_USER_SCORE);
        $result = $httpManager->requestPost($data);

        return $result;
    }

    /**
     * 得到用户每天的点播、签到、问诊信息
     * @return mixed
     */
    public static function getAllChannelScore()
    {

        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_EVERYDAY_SCORE);
        $result = $httpManager->requestPost(null);

        return $result;
    }

    /**
     * 得到用户积分
     * @return mixed
     */
    public static function getUserScore()
    {
        $data = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_USER_SCORE);
        $result = $httpManager->requestPost($data);
        $ret = json_decode($result);
        $score = $ret->result == 0 ? $ret->score : 0;

        return $score;
    }

    /**
     * 向服务器进行兑换物品
     *
     * @return mixed
     */
    public static function exchangePrize($goodsId)
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "goods_id" => $goodsId, // 要兑换的物品的id
            "exchg_count" => 1, // 要兑换的物品的数量
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_EXCHANGE_PRIZE);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * 兑换物品列表
     */
    public static function exchangeCondition()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_GOODS_LIST);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    //获取用户数据排行（活动自定义）
    public static function getUserRank(){
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_GET_USER_RANK);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    //根据活动ID存取扩展数据
    public static function activityDataEX($key, $value){
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "key" => $key,
            "value" => $value
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTITITY_DATA_EX);
        $result = $httpManager->requestPost($json);
        return $result;
    }
}