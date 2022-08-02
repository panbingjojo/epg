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
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\ActivityAPI;
use Home\Model\Common\ServerAPI\NightMedicineAPI;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Entry\MasterManager;


class NewActivityAPIController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 获取所有用户中奖记录列表 (抽奖)
     *
     */
    public function getLotteryRecordListAction()
    {
        $result = ActivityManager::getAllUserPrizeList();
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     *  获取所有用户中奖记录列表 (兑换奖品)
     */
    public function getExchangeRecordListAction()
    {
        $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
        $this->ajaxReturn($exchangeRecords);
    }

    /**
     *  应用内活动 && 联合活动：统一入口 --> 设置抽奖的联系方式
     *
     *  网络请求参数：phoneNumber -- 电话号码；prizeIdx -- 已获奖的奖品Id
     */
    public function setPhoneForLotteryAction()
    {
        $phoneNumber = isset($_REQUEST['phoneNumber']) ? $_REQUEST['phoneNumber'] : null;
        $prizeId = isset($_REQUEST['prizeId']) ? $_REQUEST['prizeId'] : -1;
        if (isset($_REQUEST['uniqueName'])) { // 促订活动设置电话使用活动标识设置
            $uniqueName = $_REQUEST['uniqueName'];
            $activityId = ActivityManager::getActivityId($uniqueName);
            $result = ActivityAPI::setPhoneNumberForPrize($phoneNumber, $prizeId, $activityId);
        } else {
            $result = ActivityAPI::setPhoneNumberForPrize($phoneNumber, $prizeId);
        }
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     *  应用内活动 && 联合活动：统一入口 --> 设置兑换物品的联系方式
     *
     *  网络请求参数：phoneNumber -- 电话号码；prizeId -- 已获奖的奖品Id
     */
    public function setPhoneForExchangeAction()
    {
        $phoneNumber = isset($_REQUEST['phoneNumber']) ? $_REQUEST['phoneNumber'] : null;
        $prizeId = isset($_REQUEST['prizeId']) ? $_REQUEST['prizeId'] : "";
        $result = ActivityAPI::setPhoneNumberForExchange($phoneNumber, $prizeId);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     *  应用内活动 && 联合活动：统一入口 --> 查询当前用户中奖记录
     *
     */
    public function getUserPrizeListAction()
    {
        $myPrizeList = ActivityAPI::inquirePrize();
        $this->ajaxReturn($myPrizeList, 'EVAL');
    }

    /**
     *  查询活动或奖品中奖次数
     */
    public function getLotteryTimesAction()
    {
        $result = ActivityAPI::getActivitySurplusNum();
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     *  应用内活动 && 联合活动：统一入口：判断用户是否可以答题（或称试玩）
     */
    public function getActivityTimesAction()
    {
        $result = ActivityAPI::canAnswer();
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 获取所有用户中奖记录列表
     */
    public function getAllUserPrizeListByAjaxAction()
    {
        $result = ActivityManager::getAllUserPrizeList();
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }

    /**
     * 应用内活动 && 联合活动：统一入口 --> 获取所有用户中奖记录列表
     */
    public function getMyPrizeListByAjaxAction()
    {
        $result = ActivityManager::inquirePrize();
        $this->ajaxReturn(json_encode($result), 'EVAL');
    }
    /**
     *  判断用户是否中过奖
     */
    public function isUserWinningAction()
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

    /**
     *  应用内活动 && 联合活动：抽奖
     *
     *  网络请求参数；
     *  prizeIdx -- 需要抽奖的奖品编号；
     *  roundFlag -- 第几轮抽奖，默认第一轮 ;
     *  uniqueName -- 活动唯一标识
     */
    public function lotteryByNameAction()
    {
        $prizeIdx = isset($_REQUEST['prizeIdx']) ? $_REQUEST['prizeIdx'] : -1;
        $roundFlag = isset($_REQUEST['roundFlag']) ? $_REQUEST['roundFlag'] : 1;
        $uniqueName = $_REQUEST['uniqueName'];
        $activityId = ActivityManager::getActivityId($uniqueName);
        $result = ActivityAPI::participateActivity($roundFlag, $prizeIdx, $activityId);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     *  物品兑换奖品
     *
     *  网络请求参数：prizeId -- 奖品ID
     */
    public function exchangePrizeAction()
    {
        $prizeId = isset($_REQUEST['prizeId']) ? $_REQUEST['prizeId'] : -1;
        $result = ActivityAPI::exchangePrize($prizeId);
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
    public function uploadPlayedRecordAction()
    {
        $answerResult = isset($_REQUEST['answerResult']) ? $_REQUEST['answerResult'] : 0;
        $extraTimes = isset($_REQUEST['extraTimes']) ? $_REQUEST['extraTimes'] : 0;
        $answerContent = isset($_REQUEST['answerContent']) ? $_REQUEST['answerContent'] : MasterManager::getActivityId(); //未提供则默认使用当前活动标识（activity_sub_id）
        if ($extraTimes >= 1) {
            ActivityManager::subExtraActivityTimes();
        }
        $result = ActivityAPI::uploadPlayedRecord($answerResult, $answerContent);

        $this->ajaxReturn($result, 'EVAL');
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
     *
     * 网络请求参数：score -- 用户当次需要添加的分数 remark -- 积分备注
     */
    public function addUserScoreAction()
    {
        $score = isset($_REQUEST['score']) ? $_REQUEST['score'] : 0;
        $remark = isset($_REQUEST['remark']) ? $_REQUEST['remark'] : "";
        $result = ActivityAPI::addUserScore($score, $remark);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     * 请求区域药店
     */
    public function getCityOfAreaAction()
    {
        $cityCode = isset($_REQUEST['cityCode']) ? $_REQUEST['cityCode'] : 1;
        $areaCode = isset($_REQUEST['areaCode']) ? $_REQUEST['areaCode'] : 1;
        $curPage = isset($_REQUEST['curPage']) ? $_REQUEST['curPage'] : 1;
        $result = NightMedicineAPI::getCityOfArea($cityCode, $areaCode, $curPage);
        $this->ajaxReturn($result, 'EVAL');
    }

    /**
     *  用户点赞
     *
     *  网络请求参数：playerId -- 参与投票人员的ID
     */
    public function doRoteAction()
    {
        $result = array("result" => -1, "message" => "success");
        $player = isset($_REQUEST['playerId']) ? $_REQUEST['playerId'] : '';
        $playerId = $player;//号码存储的ID
        $retStoreData = ActivityManager::uploadPlayerVote($playerId);
        if ($retStoreData) {
            $result['result'] = 0;
        }
        $this->ajaxReturn($result);
    }

    /**
     *  获取参赛人员点赞情况
     *
     *  网络请求参数：playerId -- 参与投票人员的ID
     */
    public function getPlayerRoteAction()
    {
        $player = isset($_REQUEST['playerId']) ? $_REQUEST['playerId'] : '';//当前获取的礼品
        $playerId = $player;//号码存储的ID
        $storeData = json_decode(ActivityManager::getPlayerVote($playerId));
        $this->ajaxReturn($storeData);
    }


    /**
     *  拉取启动推荐配置
     *
     *  网络请求参数：lmp -- 管理后台配置的信息
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
        $this->ajaxReturn($retData, "EVAL");
    }

    /**
     * 扣除额外活动次数
     */
    public function subExtraTimesAction()
    {
        $retData = ActivityManager::subExtraActivityTimes();
        $this->ajaxReturn($retData, "EVAL");
    }

    public function getExtraTimesAction(){
        $extraTimesResult = ActivityManager::getExtraActivityTimes();
        if ($extraTimesResult['result'] == 0) {
            $extraTimes = $extraTimesResult['left_times'];
        } else {
            $extraTimes = 0;
        }
        $result = array(
            "code"=>0,
            "extraTimes" => $extraTimes,
        );
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    public function getCountdownResultAction(){
        $currentActivityName = $_REQUEST['activityName'];
        $keyCountdown = "countdown" . $currentActivityName . MasterManager::getUserId();
        $valueCountdownStr = ActivityManager::queryStoreData($keyCountdown);
        $valueCountdownJson = json_decode($valueCountdownStr);
        if ($valueCountdownJson->val == null) {
            $countArray = array("showDialog" => "1");
            $valueCountdown = json_encode($countArray);
        } else {
            $valueCountdown = $valueCountdownJson->val;
        }
        $result = array(
            "code"=>0,
            "valueCountdown" => $valueCountdown,
        );
        $this->ajaxReturn(json_encode($result), "EVAL");
    }

    /**
     * 设置倒计时信息
     */
    public function assignCountdownInfoAction()
    {
        $currentActivityName = MasterManager::getActivityName();
        $keyCountdown = "countdown" . $currentActivityName . MasterManager::getUserId();
        $valueCountdownStr = ActivityManager::queryStoreData($keyCountdown);
        $valueCountdownJson = json_decode($valueCountdownStr);
        if ($valueCountdownJson->val == null) {
            $countArray = array("showDialog" => "1");
            $valueCountdown = json_encode($countArray);
        } else {
            $valueCountdown = $valueCountdownJson->val;
        }
        $extraTimesResult = ActivityManager::getExtraActivityTimes();
        if ($extraTimesResult['result'] == 0) {
            $extraTimes = $extraTimesResult['left_times'];
        } else {
            $extraTimes = 0;
        }
        $CountdownData=array(
            "keyCountdown"=>$keyCountdown,
            "valueCountdown"=>$valueCountdown,
            "extraTimes"=>$extraTimes,
        );
        $this->ajaxReturn(json_encode($CountdownData), "EVAL");
//        $this->assign("keyCountdown", $keyCountdown);
//        $this->assign("valueCountdown", $valueCountdown);
//        $this->assign("extraTimes", $extraTimes);
    }

    public function updateLearnCoinVodAlbumAction()
    {
        $header = array(
            'Content-type: application/json;charset=utf-8',
        );
        $userIsVip = MasterManager::getUserIsVip();
        $postArray = array(
            "userid" => MasterManager::getUserId(),
            "areaCode" => "410000",
            "orderType" => $userIsVip == 1 ? "month" : "free",
            "source" => "henan_39jk"
        );
        if ($userIsVip == 1) {
            $postArray["productCode"] = PRODUCT_ID_25;
        }

        LogUtils::info("Activity410092::updateLearnCoinVodAlbum --->param:" . json_encode($postArray));
        $result = HttpManager::httpRequestByHeader("POST", UPDATE_LEARN_COIN_VOD_ALBUM_URL, $header, json_encode($postArray));
        LogUtils::info("Activity410092::updateLearnCoinVodAlbum ---> result:" . $result);
    }

    public function getActivityIdAction(){
        $activityName = $_REQUEST['activityName'];
        $activityId = MasterManager::getActivityId();
        if(!$activityId) {
            $activityId = ActivityManager::getActivityId($activityName);
        }
        $result = array(
            "code" => 0,
            "msg" => "success",
            "activityId" => $activityId,
        );
        $this->ajaxReturn(json_encode($result), "EVAL");
    }
}