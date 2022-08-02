<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 活动相关的API封装
// +----------------------------------------------------------------------
// | 功能：活动（包括联合活动）中常用的交互API封装，如：设置/获取手机号码、
// | 上报参与活动记录、参与抽奖活动、是否可玩（或是否可答题）等
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/8/22 11:34
// +----------------------------------------------------------------------


namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\Activity\ActivityConstant;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\ActivityAPI;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Entry\MasterManager;


class ActivityAPIController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }


    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     * 通用接口action:
     *         save->保存用户数据
     *         addScore->增加积分
     *         changeScore->执行兑换兑换的同时消耗积分
     *         exchange->执行兑换
     *         lottery->抽奖
     *         phone->设置电话号码
     */

    public function commonAjaxAction()
    {
        $param = $_POST;
        $elseKey = $param['elseKey'] ? $param['elseKey'] : '';
        // 通过活动名称和用户ID 查询、保存数据
        $key = MasterManager::getActivityName() . MasterManager::getUserId() . $elseKey;
        // 查询user数据
        $val = json_decode(json_decode(ActivityManager::queryStoreData($key))->val);
        switch ($param["action"]) {
            case "save":
                self::saveData($param, $key, $val);
                break;
            case "query":
                self::queryUserData($key);
                break;
            case "addScore":
                self::addScore($param);
                break;
            // 后台cws配置活动兑换路程
            case "bgExchange":
                self::bgExchange($param);
                break;
            // 不需要在后台配置兑换积分
            case "exchange":
                self::exchangePrize($param, $key, $val);
                break;
            case "lottery":
                self::lottery($param, $val);
                break;
            case "phone":
                self::setPhone($param);
                break;
            case "special":
                self::specialData($param);
                break;
            default:
                $this->ajaxReturn(json_encode(array("msg" => "请标明交互功能！", "result" => "request failed!")), 'EVAL');
                break;
        }
    }

    private function specialData($param)
    {
        $key = "times" . MasterManager::getActivityName() . MasterManager::getUserId();
        // 查询user数据
        $val = new \stdClass();
        $arr = json_decode($param["currentData"]);
        $localDay = date("d");
        $val->day = $localDay;
        if (count($arr) == 0) {
            $val->data[0] = "";
        } else {
            for ($i = 0; $i < count($arr); $i++) {
                $val->data[$i] = $arr[$i];
            }
        }
        json_encode($val);
        ActivityAPI::uploadPlayedRecord(0, "该用户积分为：" . $key);
        $result = ActivityManager::saveStoreData($key, json_encode($val), 1);
        $this->ajaxReturn($result, 'EVAL');
    }

    private function queryUserData($key)
    {
        $retStoreData = ActivityManager::queryStoreData($key);
        $this->ajaxReturn($retStoreData);
    }

    private function saveData($param, $key, $val)
    {
        // 客服端没有传过来数据或者未知原因，则使用之前保存的数据
        $scoreVal = isset($param["score"]) ? $param["score"] : $val;
        // 初始化首次参与该活动的用户之前的数据为0
        $initScore = isset($val) ? $val : 0;
        $totalScore = $initScore + $scoreVal;
        $result = ActivityManager::saveStoreData($key, $totalScore);
        $this->ajaxReturn($result, 'EVAL');
    }

    private
    function addScore($param)
    {
        $result = new \stdClass();
        $scoreVal = isset($param["score"]) ? $param["score"] : 0;
        $leftTimes = ActivityAPI::canAnswer();
        $msg = ActivityAPI::addUserScore($scoreVal);
        $result->result = json_decode($msg)->result;
        $result->leftTimes = json_decode($leftTimes)->leftTimes;
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    private function exchangePrize($param, $key, $val)
    {
        $goodsId = isset($param['goodsId']) ? $param['goodsId'] : "";
        $exchangeRecords = json_decode(ActivityManager::getActivityGoodsList())->data;

        $i = count($exchangeRecords);
        while ($i--) {
            foreach ($exchangeRecords[$i] as $k => $v) {
                if ($k == "goods_id" && $v == $goodsId) {
                    $exchangeScore = $exchangeRecords[$i]->consume_list[0]->consume_count;
                }
            }
        }
        // 是否满足兑换条件
        if ($val >= $exchangeScore) {
            $result = ActivityAPI::exchangePrize($goodsId);
            // 当且仅当兑换奖品成功才消耗用户积分
            if (json_decode($result)->result == 0) {
                $val -= $exchangeScore;
                ActivityManager::saveStoreData($key, $val);
            }
        }
        empty($result) && $result = json_encode(array("result" => -303, "msg" => "兑换失败"));
        $this->ajaxReturn($result);
    }


    private function bgExchange($param)
    {
        $scoreVal = isset($param["score"]) ? $param["score"] : 0;
        $goodsId = isset($param['goodsId']) ? $param['goodsId'] : "";
        $result = ActivityAPI::exchangePrize($goodsId);
        // 当且仅当兑换奖品成功才消耗用户积分
        json_decode($result)->result == 0 && ActivityAPI::addUserScore($scoreVal);
        $this->ajaxReturn($result, 'EVAL');
    }

    private function lottery($param, $val)
    {
        // 是否需要抽奖
        $lottery = isset($param['lottery']) ? $param['lottery'] : 0;
        $activityId = isset($param['activityId']) ? $param['activityId'] : '';
        // 查询抽奖次数
        $leaveTimes = ActivityAPI::canAnswer();
        // 抽奖轮数不传递则默认为第一轮
        $roundFlag = isset($param["roundFlag"]) ? $param["roundFlag"] : 1;
        // 指定特有抽奖的奖品ID
        $prizeId = isset($param["prizeId"]) ? $param["prizeId"] : 0;
        // 获取额外游戏次数
        $extraTimes = isset($param["extraTimes"]) ? $param["extraTimes"] : 0;
        if (empty($leaveTimes)) {
            $result = array("msg" => "次数不足！", "code" => 1);
        } else {
            if ($extraTimes == 1) {
                $upload = ActivityManager::subExtraActivityTimes();
            } else {
                $upload = ActivityAPI::uploadPlayedRecord(0, "上报参与记录" . $val);
            }
            if (empty($lottery)) {
                $result = $upload;
            } else {
                $result = ActivityAPI::participateActivity($roundFlag, $prizeId, $activityId);
            }
        }
        $this->ajaxReturn($result, 'EVAL');
    }

    private function setPhone($param)
    {
        $tel = isset($param['number']) ? $param['number'] : "";
        $result = ActivityAPI::setPhoneNumberForExchange($tel, "");
        $this->ajaxReturn($result, 'EVAL');
    }

    /**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


    /**
     * @brief: 我的兑换列表和活动所有的兑换记录
     * @return mixed
     */
    public function exchangePrizeRecordAction()
    {
        $data = ActivityManager::getExchangePrizeListRecord();
        $this->ajaxReturn($data);
    }

    /**
     *  应用内活动 && 联合活动：抽奖
     *
     *  网络请求参数；prizeIdx -- 需要抽奖的奖品编号；roundFlag -- 第几轮抽奖，默认第一轮
     */
    public function lotteryAction()
    {
        $prizeIdx = isset($_REQUEST['prizeIdx']) ? $_REQUEST['prizeIdx'] : -1;
        $roundFlag = isset($_REQUEST['roundFlag']) ? $_REQUEST['roundFlag'] : 1;
        $result = ActivityAPI::participateActivity($roundFlag, $prizeIdx);
        $this->ajaxReturn($result, 'EVAL');
    }

    /*该操作用于单页应用*/
    public function uploadUserJoinAction()
    {
        ActivityAPI::uploadPlayedRecord(0, "上报参与记录");
        $result = ActivityAPI::canAnswer();
        $this->ajaxReturn($result, 'EVAL');
    }


    public function queryBambooDataAction()
    {
        $key = MasterManager::getActivityName() . MasterManager::getUserId();
        $retStoreData = array('bambooShoots' => '0', 'bambooBranch' => '0', 'bambooLeaf' => '0');
        foreach ($retStoreData as $k => $v) {
            $repDat = json_decode(ActivityManager::queryStoreData($key . $k))->val;
            $materialName = json_decode($repDat)->$k;
            $retStoreData[$k] = $materialName ? $materialName : 0;
        }
        $this->ajaxReturn(json_encode($retStoreData), 'EVAL');
    }

    /**
     * 保存键值对数据
     */
    public function saveBambooDataAction()
    {
        $param = $_REQUEST;
        // 调取该接口则上报参与
        ActivityAPI::uploadPlayedRecord(0, "上报参与记录");
        // 回答错误不用继续执行
        $saveData = array();
        $bambooName = $param['bambooName'];
        // 获取定义的增加规则
        $addMaterialCount = ActivityConstant::refuseData(2);
        $key = MasterManager::getActivityName() . MasterManager::getUserId() . $bambooName;
        // 通过活动名称和用户ID 查询、保存数据
        $val = json_decode(json_decode(ActivityManager::queryStoreData($key))->val)->$bambooName;
        // 则使用之前保存的数据
        $addCount = $param['isRight'] == 'nothing' ? 0 : $addMaterialCount[$bambooName];
        $addVal = $param['isRight'] == 'false' ? 3 : $addCount;
        // 初始化首次参与该活动的用户之前的数据为0
        $initVal = isset($val) ? $val : 0;
        $saveData[$bambooName] = intval($initVal) + intval($addVal);;
        $result = ActivityManager::saveStoreData($key, json_encode($saveData));

        $this->ajaxReturn($result);
    }

    /**
     * 垃圾分类活动奖品兑换逻辑实现
     * @param $param
     */
    public function exchangeBambooPrizeAction()
    {
        $param = $_REQUEST;
        $goods_id = isset($param['goods_id']) ? $param['goods_id'] : "";
        $key = MasterManager::getActivityName() . MasterManager::getUserId();

        $bambooName = ['bambooShoots', 'bambooBranch', 'bambooLeaf'];
        $h = count($bambooName);
        $savedData = array();
        while ($h--) {
            // 材料键值
            $userKey = $bambooName[$h];
            // 查询保存的材料数据
            $savedData[$userKey] = json_decode(json_decode(ActivityManager::queryStoreData($key . $userKey))->val)->$userKey;

        }

        // 获取设置的兑奖规则
        $exchangeData = ActivityConstant::refuseData(1);

        $val = 0; // 需要消耗的材料数量
        $num = 0; // 抓取设置条件个数
        foreach ($exchangeData[$goods_id] as $k => $v) {
            if ($savedData[$k] >= $v) {
                $val = $v;
                $num++;
            }
        }

        // 材料数量全部满足兑换条件
        if ($num == 3) {
            $result = json_decode(ActivityAPI::exchangePrize($goods_id));
            // 当且仅当兑换奖品成功才消耗用户积分
            if ($result->result == 0) {
                foreach ($savedData as $x => $y) {
                    $storeVal[$x] = $y - $val;
                    // 重新保存消耗过后的材料
                    ActivityManager::saveStoreData($key . $x, json_encode($storeVal));
                }
            }
        } else {
            $result = array('result' => 303, 'msg' => '兑换材料数量不足！');
        }
        $this->ajaxReturn($result);
    }

    /**
     * 增加用户抽奖次数
     */
    public
    function addUserLotteryTimesAction()
    {
        $result = ActivityAPI::addUserLotteryTimes();
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 增加用户抽奖次数
     */
    public
    function subExtraActivityTimesAction()
    {
        $result = ActivityManager::subExtraActivityTimes();
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 健康测一测拉取题库
     */
    public
    function getActivitySubjectAction()
    {
        // 题库类型：1-趣味小常识 2-心理测试 3-亚健康测试
        $answersType = isset($_REQUEST["answersType"]) ? $_REQUEST["answersType"] : 1;
        $result = ActivityConstant::getHeathTestAnswersBy($answersType);
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 健康测一测拉取测试结果
     */
    public
    function getAnswersResultAction()
    {
        $answersType = isset($_REQUEST["answersType"]) ? $_REQUEST["answersType"] : null;
        $result = ActivityConstant::getHeathTestAnswersResultBy($answersType);
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 获取所有用户中奖记录列表
     */
    public function getAllPrizeListAction()
    {
        $result = ActivityManager::getAllUserPrizeList();
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 设置当前用户的中奖号码
     */
    public
    function setPhoneNumberAction()
    {
        $activityId = $_REQUEST['activityId'] === 'true' ? $_REQUEST['activityId'] : '';
        $isExchangeActivity = $_REQUEST['exchange'] === 'true' ? $_REQUEST['exchange'] : null;
        $phoneNumber = isset($_REQUEST['phoneNumber']) ? $_REQUEST['phoneNumber'] : null;
        if ($isExchangeActivity) { // 是兑换活动提交兑换电话接口
            $goodsId = isset($_REQUEST['goodsId']) ? $_REQUEST['goodsId'] : "";
            $result = ActivityAPI::setPhoneNumberForExchange($phoneNumber, $goodsId);
        } else {
            $prizeIdx = isset($_REQUEST['prizeIdx']) ? $_REQUEST['prizeIdx'] : -1;
            $result = ActivityAPI::setPhoneNumberForPrize($phoneNumber, $prizeIdx, $activityId);
        }
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 设置兑换物品的联系方式
     */
    public function setPhoneNumberForExchangeAction()
    {
        $phoneNumber = isset($_REQUEST['phoneNumber']) ? $_REQUEST['phoneNumber'] : null;
        $goodsId = isset($_REQUEST['goodsId']) ? $_REQUEST['goodsId'] : "";
        $result = ActivityAPI::setPhoneNumberForExchange($phoneNumber, $goodsId);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 获取领奖电话号码
     */
    public function getPhoneNumberAction()
    {
        $myPrizeList = ActivityAPI::inquirePrize();
        $this->ajaxReturn($myPrizeList, 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 中奖记录
     */
    public
    function inquirePrizeAction()
    {
        $myPrizeList = ActivityAPI::inquirePrize();
        $this->ajaxReturn($myPrizeList, 'EVAL');
    }

    /**
     * 查询活动或奖品中奖次数
     */
    public function getActivitySurplusNumAction()
    {
        $result = ActivityAPI::getActivitySurplusNum();
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 判断用户是否中过奖
     */
    public
    function getActivityHasWinningAction()
    {
        $arr = array(
            "result" => 1
        );
        $res = ActivityAPI::inquireRecord();
        $resArr = json_decode($res, true);
        if ($resArr["result"] == 0) {
            if (count($resArr["list"]) < 1) {
                $arr["result"] = 0;
            }
        }

        $this->ajaxReturn(json_encode($arr), 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 判断用户是否可以答题（或称试玩）
     */
    public function canAnswerAction()
    {
        $result = ActivityAPI::canAnswer();
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 参与活动
     */
    public function participateActivityAction()
    {
        $roundFlag = isset($_REQUEST['roundFlag']) ? $_REQUEST['roundFlag'] : 1;// 第几轮（默认为第一轮）
        $prizeIdx = isset($_REQUEST['prizeIdx']) ? $_REQUEST['prizeIdx'] : -1;  // 中奖奖品编号，没有默认传-1
        $result = ActivityAPI::participateActivity($roundFlag, $prizeIdx);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * <p>应用内活动 && 联合活动：统一入口 --> 上报参与记录结果</p>
     * <pre>注意：所有参与活动时必须上报参与活动记录，以记录次数。
     * 对于非答题类活动，也必须上报记录，只是上报记录时传参不一样（$answerResult，$playContent）。
     *      <li>答题类活动：$answerResult和$playContent按照API规范传参，并需要在子类重写该方法以组织不同的上报参数。</li>
     *      <li>非答题类活动：$answerResult=0，$playContent=约定用活动标识subId，如果非特殊活动可不必重写该方法，直接调用默认实现即可。</li>
     * </pre>
     */
    public
    function uploadPlayedRecordAction()
    {
        // 获取额外游戏次数
//        $extraTimes = isset($param["extraTimes"]) ? $param["extraTimes"] : 0;
        // 注意：
        //      例如：月饼欢乐送联合活动等没有答题环节，但必须上报以记录次数。
        //      故传默认参数，answer_result传0表示答题正确，1表示错误, answer_content附加内容默认传当前活动标识
        $answerResult = isset($_REQUEST['answerResult']) ? $_REQUEST['answerResult'] : 0;
        $extraTimes = isset($_REQUEST['extraTimes']) ? $_REQUEST['extraTimes'] : 0;
        $answerContent = isset($_REQUEST['answerContent']) ? $_REQUEST['answerContent'] : MasterManager::getActivityId(); //未提供则默认使用当前活动标识（activity_sub_id）
        if ($extraTimes == 1) {
            $result = ActivityManager::subExtraActivityTimes();
        } else {
            $result = ActivityAPI::uploadPlayedRecord($answerResult, $answerContent);
        }
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * <p>应用内活动 && 联合活动：“答题活动”统一入口 --> 上报参答题结果</p>
     */
    public function uploadAnswerResultAction()
    {
        $choose = isset($_REQUEST['choose']) ? $_REQUEST['choose'] : ''; // 用户选择的答案
        $answerResult = isset($_REQUEST['isAnswerRight']) ? ($_REQUEST['isAnswerRight'] ? 1 : 0) : 0;
        $answerContent = MasterManager::getAnswerInfo();
        $answerContent['chooseAnswer'] = $choose;
        $result = ActivityAPI::uploadPlayedRecord($answerResult, $answerContent);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 获取所有的兑换记录
     */
    public function getExchangePrizeListRecordAction()
    {
        $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
        $this->ajaxReturn($exchangeRecords);
    }

    /**
     * 获取用户积分
     */
    public function getUserScoreAction()
    {
        $result = ActivityAPI::getUserScore();
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 增加用户积分
     */
    public function addUserScoreAction()
    {
        $score = isset($_REQUEST['score']) ? $_REQUEST['score'] : 0;
        $remark = isset($_REQUEST['remark']) ? $_REQUEST['remark'] : "";
        $result = ActivityAPI::addUserScore($score, $remark);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 物品兑换奖品
     */
    public function exchangePrizeAction()
    {
        $goodsId = isset($_REQUEST['goodsId']) ? $_REQUEST['goodsId'] : -1;
        $result = ActivityAPI::exchangePrize($goodsId);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 幸运转转盘交互功能
     */
    public function luckyWheelAction()
    {

        $param = $_POST;
        switch ($param['action']) {

            case "lottery":
                $currentActivityName = MasterManager::getActivityName();
                $key = $currentActivityName . MasterManager::getUserId();
                ActivityManager::saveStoreData($key, 1);
                $result = ActivityAPI::participateActivity(1);
                ActivityAPI::uploadPlayedRecord(0, "上报参与次数！");
                $this->ajaxReturn($result, 'EVAL');
                break;
        }
    }

    /**
     * 该接口为活动“五福临门，欢乐随行”提供交互
     * action:
     * @param: collect收集福字接口
     * @param: open刮刮卡接口
     * @param: exchange兑换接口
     * @param: exchangeTel设置兑换电话号码接口
     *
     */
    public function luckCardAction()
    {
        $param = $_POST;
        $roundFlag = isset($param['roundFlag']) ? $param['roundFlag'] : "";

        $currentActivityName = MasterManager::getActivityName();
        $key = $currentActivityName . MasterManager::getUserId();
        $keyExchange = "exchange" . $currentActivityName . MasterManager::getUserId();

        //查询用户是否保存过福字，若没有则初始化为0，若存在则使用用户保存了的数据
        $n = ActivityManager::queryStoreData($key);
        $o = json_decode(json_decode($n)->val);
        // 查询兑换所需福字-不再与刮刮卡消耗关联
        $m = ActivityManager::queryStoreData($keyExchange);
        $p = json_decode(json_decode($m)->val);
        $i = 0;
        while ($i < 5) {
            $s[$i] = $o[$i] > 0 ? $o[$i] : 0;
            $g[$i] = $p[$i] > 0 ? $p[$i] : 0;
            $i++;
        }

        switch ($param['action']) {

            case "collect":

                $result = ActivityAPI::participateActivity($roundFlag);
                $number = json_decode($result)->prize_idx;
                if ($number) {
                    $s[$number - 1] += 1;
                    $g[$number - 1] += 1;
                    ActivityManager::saveStoreData($key, json_encode($s));
                    ActivityManager::saveStoreData($keyExchange, json_encode($g));
                }
                ActivityAPI::uploadPlayedRecord(0, "上报参与次数！");
                $this->ajaxReturn($result, 'EVAL');
                break;
            case "open":
                $number = isset($param['number']) ? $param['number'] : ""; //刮刮卡的序号
                if ($number >= 0) {
                    $s[$number] -= 1;
                    $result = ActivityAPI::participateActivity($roundFlag);
                    ActivityManager::saveStoreData($key, json_encode($s));
                    $this->ajaxReturn(array($result, "msg" => "刮卡成功!"));
                } else {
                    $this->ajaxReturn(array("msg" => "刮卡失败！", "result" => -11));
                }
                break;
            case "exchange":
                $goodsId = isset($param['goodsId']) ? $param['goodsId'] : "";
                $btnCount = isset($param['btnCount']) ? $param['btnCount'] : "";

                // 迭代收集福字是否满足兑换条件
                $t = array_filter($p, function ($p) use ($btnCount) {
                    return $btnCount <= $p;
                });
                if (count($t) == 5) {
                    $result = ActivityAPI::exchangePrize($goodsId);
                    // 当且仅当兑换奖品成功才消耗用户的福字
                    if (json_decode($result)->result == 0) {
                        $j = 0;
                        while ($j < 5) {
                            $t[$j] -= $btnCount;
                            $j++;
                        }
                        ActivityManager::saveStoreData($keyExchange, json_encode($t));
                    }
                }
                !$result && $result = array("result" => -303, "msg" => "兑换失败");
                $this->ajaxReturn($result);
                break;
            case "exchangeTel":
                $tel = isset($param['tel']) ? $param['tel'] : "";
                $result = ActivityAPI::setPhoneNumberForExchange($tel, "");
                $this->ajaxReturn($result, 'EVAL');
                break;
        }
    }


    /**
     * 保存用户收集的鱼
     */
    public function fishAction()
    {

        $param = $_POST;
        /*
         * 通过活动字段和用户Id查询、与保存
         * */
        $currentActivityName = MasterManager::getActivityName();
        $key = $currentActivityName . MasterManager::getUserId();
        $n = ActivityManager::queryStoreData($key);
        $o = json_decode(json_decode($n)->val);
        $a = is_numeric($o[0]) ? $o[0] : 0;
        $b = is_numeric($o[1]) ? $o[1] : 0;
        $c = is_numeric($o[2]) ? $o[2] : 0;
        $z = array(abs($a), abs($b), abs($c));
        switch ($param['action']) {
            case "collect":

                $fishNumber = isset($param['number']) ? $param['number'] : null;

                if ($fishNumber) {
                    switch ($fishNumber) {
                        case 1:
                            $z[0] += 1;
                            break;
                        case 2:
                            $z[1] += 1;
                            break;
                        case 3:
                            $z[2] += 1;
                            break;
                    }
                }
                ActivityManager::saveStoreData($key, json_encode($z));
                $upre = ActivityAPI::uploadPlayedRecord(0, "上报参与次数！");
                $this->ajaxReturn($upre, 'EVAL');
                break;
            case "lottery":
                $z[0] -= 1;
                $z[1] -= 1;
                $z[2] -= 1;
                ActivityManager::saveStoreData($key, json_encode($z));
                $result = ActivityAPI::participateActivity(1);
                $this->ajaxReturn($result, 'EVAL');
                break;
        }
    }

    /**
     * 本功能由参与活动与数据保持组成
     *
     * 返回值说明：
     *  1：根据概率本地获取拼图成功，数据保存服务异常
     * -1000:保存抽奖数据失败
     * -1001：参与抽奖异常
     * -1002:用户已经集齐过一次所有碎片
     * 0 未中奖 1 已中奖 -101 活动不存在 -102 只限会员用户参与
     * -103 只限VIP用户参与 -104 参与活动次数已满（整个活动期间或周期内参与活动次数已满）
     * -105 已经中过奖 -106 活动已过期 -107 活动已关闭
     * -108 VIP参与活动次数已满 -109 非VIP参与活动次数已满
     *
     */
    public function extractAndSavePuzzleAction()
    {

        //获取拼图结果
        $arrRet = array(
            "result" => -1000,
            "puzzleData" => "",
            "puzzlePic" => -1,
            "prizeName" => "",
            "leftTimes" => 0
        );

        $key = "Activity" . MasterManager::getUserId();
        $storeData = ActivityManager::queryStoreData($key);
        $storeDataArr = json_decode($storeData, true);

        $puzzleStoreArr = array(
            "pic1" => 0,
            "pic2" => 0,
            "pic3" => 0,
            "pic4" => 0,
        );

        if ($storeDataArr["result"] == 0 || !empty($storeDataArr["val"])) {
            $storeDataValArr = json_decode($storeDataArr["val"], true);
            $pic1 = (int)$storeDataValArr["pic1"];
            $pic2 = (int)$storeDataValArr["pic2"];
            $pic3 = (int)$storeDataValArr["pic3"];
            $pic4 = (int)$storeDataValArr["pic4"];
            if ($pic1 > 0 && $pic2 > 0 && $pic3 > 0 && $pic4 > 0) {
                $arrRet["result"] = -1002;
                LogUtils::info("puzzle user is already collect puzzle");
                $this->ajaxReturn($arrRet);
            } else {
                $puzzleStoreArr["pic1"] = $pic1;
                $puzzleStoreArr["pic2"] = $pic2;
                $puzzleStoreArr["pic3"] = $pic3;
                $puzzleStoreArr["pic4"] = $pic4;
            }

        }

        $participateRet = ActivityAPI::participateActivity(-1);
        LogUtils::info("puzzle participateRet=" . $participateRet);
        $participateArr = json_decode($participateRet, true);
        if (isset($participateArr["result"])) {
            if ($participateArr["result"] == 1) {
                $pic = (int)$participateArr["prize_idx"];
                switch ($pic) {
                    case 1:
                        $puzzleStoreArr["pic1"] = (int)$puzzleStoreArr["pic1"] + 1;
                        $arrRet["puzzleData"] = $puzzleStoreArr;
                        break;
                    case 2:
                        $puzzleStoreArr["pic2"] = (int)$puzzleStoreArr["pic2"] + 1;
                        $arrRet["puzzleData"] = $puzzleStoreArr;
                        break;
                    case 3:
                        $puzzleStoreArr["pic3"] = (int)$puzzleStoreArr["pic3"] + 1;
                        $arrRet["puzzleData"] = $puzzleStoreArr;
                        break;
                    case 4:
                        $puzzleStoreArr["pic4"] = (int)$puzzleStoreArr["pic4"] + 1;
                        $arrRet["puzzleData"] = $puzzleStoreArr;
                        break;
                    default:
                        LogUtils::info("puzzle admin config error");
                        break;
                }

                $retStoreData = ActivityManager::saveStoreData($key, json_encode($puzzleStoreArr));
                LogUtils::info("puzzle retStoreData=" . $retStoreData);
                $retStoreDataArr = json_decode($retStoreData, true);
                if (isset($retStoreDataArr["result"]) && $retStoreDataArr["result"] == 0) {
                    $arrRet["puzzleData"] = $puzzleStoreArr;
                    $arrRet["result"] = 1;
                    $arrRet["puzzlePic"] = $pic;
                    $arrRet["prizeName"] = $participateArr["prize_name"];
                    $arrRet["leftTimes"] = $participateArr["left_times"];
                } else {
                    $arrRet["result"] = -1000;
                }
            } else {
                $arrRet["result"] = $participateArr["result"];
            }
        } else {
            $arrRet["result"] = -1001;
        }
        $this->ajaxReturn($arrRet);
    }

    /**
     * 获取拼图数据
     */
    public function getPuzzleListAction()
    {
        $key = "Activity" . MasterManager::getUserId();
        $storeData = ActivityManager::queryStoreData($key);
        $this->ajaxReturn($storeData, 'EVAL');
    }

    /**
     * 获取当前时间
     * @return mixed
     */
    public function getCurrentTimeAction()
    {
        $year = date('Y', time());
        $month = date('m', time());
        $day = date('d', time());
        $hour = date('H', time());
        $minute = date('i', time());
        $second = date('s', time());
        $data = date("Y-m-d H:i:s", time());
        $reTime = array(
            "year" => $year,
            "month" => $month,
            "day" => $day,
            "hour" => $hour,
            "minute" => $minute,
            "second" => $second,
            "data" => $data
        );
        $this->ajaxReturn($reTime);
    }


    /**
     * 上报电话号码
     * @return mixed
     */
    public function setCurrentPhoneAction()
    {
        $result = array("result" => -1, "message" => "success");
        $userId = MasterManager::getUserId();
        $key = $userId . "_" . MasterManager::getActivityId();//号码存储的ID
        $userPhone = isset($_REQUEST['phoneNumber']) ? $_REQUEST['phoneNumber'] : '';//当前获取的号码
        $userPhoneBig = "," . $userPhone;//加逗号用于拼接的数据
        $storeData = json_decode(ActivityManager::queryStoreData($key));
        if ($storeData->result == 0 && !empty($storeData->val)) {
            if (!empty($userPhone)) {
                $strPhone = explode(',', $storeData->val);//用逗号分割截取电话号码
                foreach ($strPhone as $value) {
                    if ($value != $userPhone) {

                    } else {
                        $userPhoneBig = "";
                    }
                }

                $userPhone2 = $storeData->val . $userPhoneBig;//新拼接的好号码
            }
            $retStoreData = ActivityManager::saveStoreData($key, $userPhone2);
        } else {
            $retStoreData = ActivityManager::saveStoreData($key, $userPhone);
        }
        if ($retStoreData) {
            $result['result'] = 0;
        }
        $this->ajaxReturn($result);
    }


    /**
     * 上报集年货
     * @return mixed
     */
    public function setCollectGiftsAction()
    {
        $result = array("result" => -1, "message" => "success");
        $userId = MasterManager::getUserId();
        $key = $userId . "_" . MasterManager::getActivityId();//礼品存储的ID
        $userGift = isset($_REQUEST['giftName']) ? $_REQUEST['giftName'] : '';//当前获取的礼品
        $userGiftBig = "," . $userGift;//加逗号用于拼接的数据
        $storeData = json_decode(ActivityManager::queryStoreData($key));
        if ($storeData->result == 0 && !empty($storeData->val)) {
            if (!empty($userGift)) {
                $strGift = explode(',', $storeData->val);//用逗号分割截礼品
                foreach ($strGift as $value) {
                    if ($value != $userGift) {

                    } else {
                        $userGiftBig = "";
                    }
                }

                $userGift2 = $storeData->val . $userGiftBig;//新拼接的好礼品
            }
            $retStoreData = ActivityManager::saveStoreData($key, $userGift2);
        } else {
            $retStoreData = ActivityManager::saveStoreData($key, $userGift);
        }
        if ($retStoreData) {
            $result['result'] = 0;
        }
        $this->ajaxReturn($result);
    }


    /**
     * 上报参赛选手信息
     * @return mixed
     */
    public function setCurrentPlayerAction()
    {
        $result = array("result" => -1, "message" => "success");
        $userId = MasterManager::getUserId();
        $key = $userId . "_" . MasterManager::getActivityId();//号码存储的ID
        $userPhone = isset($_REQUEST['phoneNumber']) ? $_REQUEST['phoneNumber'] : '';//当前获取的号码
        $data = date("Y-m-d", time());
        $userData = $userPhone . "," . $data . "," . $userId;//加逗号用于拼接的数据
//        $storeData = json_decode(ActivityManager::queryStoreData($key));
        $retStoreData = ActivityManager::saveStoreData($key, $userData);
        if ($retStoreData) {
            $result['result'] = 0;
        }
        $this->ajaxReturn($result);
    }


    /**
     * 记录用户点赞情况
     *
     */
    public function setUserRoteAction()
    {
        $result = array("result" => -1, "message" => "success");
        $userId = MasterManager::getUserId();
        $data = date("Y-m-d", time());
        $key = $userId . "_" . $data;//号码存储的ID
        $storeData = json_decode(ActivityManager::queryStoreData($key));
        $accountId = MasterManager::getAccountId();
        $roteCount = 1;
        if ($storeData->result == 0 && !empty($storeData->val)) {
            $userData = intval($storeData->val) + $roteCount;
        } else {
            $userData = 1;
        }
        $isVip = MasterManager::getUserIsVip();
        if ($accountId == "itv0951085160") {
            $retStoreData = ActivityManager::saveStoreData($key, $userData);
            if ($retStoreData) {
                $result['result'] = 0;
            }
        } else if ($isVip == 0 && $userData > 2) {
            $result['result'] = 3;//非vip用户次数达到上线
        } else if ($isVip == 1 && $userData > 10) {
            $result['result'] = 4;//vip用户次数达到上线
        } else {
            $retStoreData = ActivityManager::saveStoreData($key, $userData);
            if ($retStoreData) {
                $result['result'] = 0;
            }
        }
        $this->ajaxReturn($result);
    }

    /**
     * 记录参赛人员点赞情况
     *
     */
    public function setPlayerRoteAction()
    {
        $result = array("result" => -1, "message" => "success");
        $userId = MasterManager::getUserId();
        $player = isset($_REQUEST['playerId']) ? $_REQUEST['playerId'] : '';//当前获取的礼品
        $playerId = $player;//号码存储的ID
//        $storeData = json_decode(ActivityManager::queryStoreData($key));
//        $roteCount = 1;
//        if ($storeData->result == 0 && !empty($storeData->val)) {
//            $userData = intval($storeData->val) + $roteCount;
//        } else {
//            $userData = 1;
//        }
        $retStoreData = ActivityManager::uploadPlayerVote($playerId);
        if ($retStoreData) {
            $result['result'] = 0;
        }
        $this->ajaxReturn($result);
    }

    /**
     * 获取参赛人员点赞情况
     *
     */
    public function getPlayerRoteAction()
    {
        $result = array("result" => -1, "message" => "success");
        $userId = MasterManager::getUserId();
        $player = isset($_REQUEST['playerId']) ? $_REQUEST['playerId'] : '';//当前获取的礼品
        $playerId = $player;//号码存储的ID
        $storeData = json_decode(ActivityManager::getPlayerVote($playerId));
        $this->ajaxReturn($storeData);
    }

    /**
     * 获取选手信息
     * @return mixed
     */
    public function getCurrentPlayerAction()
    {
        $result = array();
        $userId = MasterManager::getUserId();
        $key = $userId . "_" . MasterManager::getActivityId();//礼品存储的ID
        $storeData = json_decode(ActivityManager::queryStoreData($key));
        if ($storeData->result == 0 && !empty($storeData->val)) {
            $result = explode(',', $storeData->val);
        }
        $this->ajaxReturn($result);
    }


    /**
     * 获取收集年货
     * @return mixed
     */
    public function getCollectGiftsAction()
    {
        $result = array();
        $userId = MasterManager::getUserId();
        $key = $userId . "_" . MasterManager::getActivityId();//礼品存储的ID
        $storeData = json_decode(ActivityManager::queryStoreData($key));
        if ($storeData->result == 0 && !empty($storeData->val)) {
            $result = explode(',', $storeData->val);
        }
        $this->ajaxReturn($result);
    }


    /**
     * 清空收集年货
     * @return mixed
     */
    public function clearCollectGiftsAction()
    {
        $result = array("result" => -1, "message" => "success");
        $userId = MasterManager::getUserId();
        $key = $userId . "_" . MasterManager::getActivityId();//礼品存储的ID
        $userGift = "";
        $retStoreData = ActivityManager::saveStoreData($key, $userGift);
        if ($retStoreData) {
            $result['result'] = 0;
        }
        $this->ajaxReturn($result);
    }

    /**
     * 保存键值对数据
     */
    public function saveStoreDataAction()
    {
        $retStoreData = ActivityManager::saveStoreData($_REQUEST['key'], $_REQUEST['value']);
        $this->ajaxReturn($retStoreData);
    }

    /**
     * 获取键值对数据
     */
    public function queryStoreDataAction()
    {
        $retStoreData = ActivityManager::queryStoreData($_REQUEST['key']);
        $this->ajaxReturn($retStoreData);
    }

    /**
     * 拉取启动推荐配置
     * @throws \Think\Exception
     */
    public function getEntryRecommendInfoAction()
    {
        $lmp = $_REQUEST['lmp'];
        $ret = SystemAPI::getEntryRecommendInfoByLmp($lmp);

        if ($ret->result != 0) {
            $ret = json_encode(array(
                "result" => -1,
            ));
        }

        $this->ajaxReturn($ret, "EVAL");
    }

    /**
     * 增加额外活动次数
     */
    public function addExtraTimesAction()
    {
        $retData = ActivityManager::addExtraActivityTimes();
        $this->ajaxReturn($retData);
    }

    /**
     * 扣除额外活动次数
     */
    public function subExtraTimesAction()
    {
        $retData = ActivityManager::subExtraActivityTimes();
        $this->ajaxReturn($retData);
    }


    /**
     * 保存用户信息
     */
    public function saveUserInfoAction()
    {
        $userName = isset($_REQUEST['userName']) ? $_REQUEST['userName'] : null;
        $userTel = isset($_REQUEST['userTel']) ? $_REQUEST['userTel'] : "";
        $address = isset($_REQUEST['address']) ? $_REQUEST['address'] : "";
        $userAccount=MasterManager::getAccountId();
        $result = ActivityAPI::saveUserInfo($userAccount, $userName,$userTel,$address);
        $this->ajaxReturn($result, 'EVAL');
    }

    //获取用户数据排行（活动自定义）
    public function getUserRankAction(){
        $result = ActivityAPI::getUserRank();
        $this->ajaxReturn($result, 'EVAL');
    }

    //根据活动ID存取扩展数据
    public function activityDataEXAction(){
        $key = isset($_REQUEST['key']) ? $_REQUEST['key'] : "";
        $value = isset($_REQUEST['value']) ? $_REQUEST['value'] : "";
        $result = ActivityAPI::activityDataEX($key,$value);
        $this->ajaxReturn($result, 'EVAL');
    }
}