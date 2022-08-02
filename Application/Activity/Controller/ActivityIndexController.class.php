<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 活动（联合活动 && 应用内活动 ）统一控制器
// +----------------------------------------------------------------------
// | 通用使用说明：
// |    1. 在\Home\Model\Activity\ActivityConstant::getAllActivityFolders()
// | 中配置活动标识与文件所在根目录对应的数组。
// |    2. 若联合活动（"JointActivity"约定规范命名开头），则具体的文件二级
// | 目录名为"union"，
// |        如：Activity/ActivityMidAutumn/union/
// |    3. 若应用活动（非"JointActivity"约定规范命名开头），则具体的文件二
// | 级目录名为配置COMMON_ACTIVITY_VIEW，（同一活动名在不同地区）
// |        如：Activity/ActivityMidAutumn/{COMMON_ACTIVITY_VIEW}/
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/8/21 15:24:41
// +----------------------------------------------------------------------


namespace Activity\Controller;

use Home\Controller\BaseController;
use Home\Model\Activity\ActivityConstant;
use Home\Model\Activity\ActivityStaticData;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\CookieManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\ActivityAPI;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;
use Home\Model\Page\PageManager;
use Home\Model\Stats\StatManager;
use Think\Exception;

class ActivityIndexController extends BaseController
{
    protected $userId;                          // 用户id
    protected $carrierId;                       // 地区编码id
    protected $isVip;                           // 是否为VIP用户 1-VIP 0-非VIP
    protected $inner = 1;                       // inner = 1,表示应用内跳转，inner = 0,表示应用外进来
    protected $context = "";                    // 弹框内容（rule--> 活动规则）
    protected $prizeName = "";                  // 奖品名称
    protected $prizeIdx = 0;                    // 奖品id
    protected $bg = "";                         // 背景来源，dialog使用
    protected $contentId = CONTENT_ID;          // 订购VIP产品content_id
    protected $productId = 0;                   // 产品ID
    protected $productName = "";                // 产品名称
    protected $leftTimes = 0;                   // 剩余次数
    protected $demoTimes = 0;                   // 试玩次数
    protected $score = 0;                       // 用户活动积分
    protected $isOrderBack = 0;                 // 是否为订购返回（1--是订购返回， 0--不是订购返回）
    protected $backEPGUrl = "";                 // 返回地址（联合活动：返回大厅首页，应用活动：返回首页）
    protected $focusedId = "";                  // 上一个页面的控件焦点保持
    protected $free = "0";                        // 是否为免费玩的 1--是， 0--不是

    protected $isJointActivity = false;         // 当前活动是否为联合活动，使用规范使命判断：ActivityManager::isJointActivity()
    protected $activityName = "";               // 活动标识名称（例如：ActivityMidAutumn20180815）
    protected $activityFsImg = "";               // 活动图片fs
    protected $goHtmlPrefix = "";               // 同一活动，不同地区对应的统一的跳转前缀（例如：/ActivityMidAutumn/union/, /ActivityMidAutumn/V1/, etc.）
    protected $resultContent = "";              // 测试结果
    protected $answersType = "";                // 答题类型
    protected $page = 0;                        // 答题话题页数
    protected $pages = 0;                        // 答题话题页数
    protected $homeFocusId = "";                 // 答题话题页数
    protected $pageCurrent = 1;                 // 默认当前页数
    protected $userGroupType = "";     // 中国联通送优惠券活动用戶分组，有4个组，1，2，3，4组

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array(
            "indexUI" => $this->goHtmlPrefix . "/index"
        );
    }

    /**
     * 当前活动控制器构造函数，初始化一些必要参数
     */
    public function __construct()
    {
        parent::__construct();
        $this->initParams();
    }

    /**
     * 构造函数中初始化默认参数
     */
    protected function initParams()
    {
        // 是否为联合活动
        $this->isJointActivity = ActivityManager::isJointActivity();

        // 加强判断：某些地区没有标清平台，若执意跑SD平台活动，给予相关错误页提示然后自动返回
        if (MasterManager::getPlatformType() == STB_TYPE_SD) {
            $disabledSDAreas = eval(SD_PLATFORM_DISABLED_AREAS);
            if (!empty($disabledSDAreas) && is_array($disabledSDAreas) && in_array(MasterManager::getCarrierId(), $disabledSDAreas)) {
                $goUrl = PageManager::getBasePagePath('home') . '/' . '?userId=' . MasterManager::getUserId();
                $this->error('区域 [' . MasterManager::getCarrierId() . '] 不存在 [标清(sd)平台] 对应的活动 "' . MasterManager::getSubId() . '" ！', $goUrl, 5);
                exit();
            }
        }

        // 当前活动所属地区目录模式和跳转前缀
        $this->goHtmlPrefix = ActivityConstant::getNewActivityFolder(MasterManager::getSubId());
        if (empty($this->goHtmlPrefix)) {
            $goUrl = PageManager::getBasePagePath('home') . '/' . '?userId=' . MasterManager::getUserId();
            $this->error('区域 [' . MasterManager::getCarrierId() . '] 没有别名为 "' . MasterManager::getSubId() . '"的活动相应的模式！', $goUrl, 5);
            exit();
        }
    }

    /**
     * 活动主界面
     */
    public function indexUI()
    {
        $this->activityName = parent::requestFilter('activityName', MasterManager::getSubId());
        if($this->activityName == 'ActivityRedEnvelope20201109'){
            $this->activityFsImg = RESOURCES_URL . '/activityImg/' . $this->activityName . '/';
            $this->assign("activityFsImg", $this->activityFsImg);
            $this->assign('platformType', 'hd');
        }else if($this->activityName == 'ActivityRedEnvelope20201109'){

        }else{
            $json = array(
                "activity_id" => MasterManager::getActivityId(),
            );
            $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_REQUEST);
            $result = $httpManager->requestPost($json);
            $activityInfoData = json_decode($result);
            $startDt = $activityInfoData->list->start_dt;
            $endDt = $activityInfoData->list->end_dt;
            $this->assign("startDt", $startDt);
            $this->assign("endDt", $endDt);

            // 页面公用参数数据渲染
            $this->initCommonRender();
            // url参数解析
            $this->parseUrlParam();
            // 活动公用参数设置
            $this->initCommonActivityRender();

            if ($this->isConfigActivity()) { // 判断是否配置类活动
                // 上报模块访问界面
                StatManager::uploadAccessModule($this->userId);
                // 设置不同的私有数据
                $this->setPrivateParams_indexUI();
            }
        }
        // 渲染页面
        $this->displayEx(__FUNCTION__);
    }


    /**
     * 是否管理后台运营类Activity,区别于直接显示的活动类
     * @return bool true -- 管理后台配置Activity  false -- 非管理后台配置Activity
     */
    private function isConfigActivity(){
        $isConfigActivity = true;
        if(CARRIER_ID == CARRIER_ID_XINJIANGDX
            && $this->activityName == ActivityConstant::SUB_ID_ACTIVITYCONSULTATIONNEW20200603){
            //新疆电信大专家义诊活动优化，不请求多余接口
            $isConfigActivity = false;
        }

        return $isConfigActivity;
    }

    /**
     * 解析session、get参数
     */
    protected function parseUrlParam()
    {
        $this->userId = parent::requestFilter('userId', MasterManager::getUserId());
        $this->activityName = parent::requestFilter('activityName', MasterManager::getSubId());
        $this->activityFsImg = RESOURCES_URL . '/activityImg/' . $this->activityName . '/';
        $this->backEPGUrl = $this->isJointActivity ? MasterManager::getIPTVPortalUrl() : MasterManager::getEPGHomeURL();

        $this->inner = parent::requestFilter('inner', $this->inner,false);
        $this->context = parent::requestFilter('context', $this->context);
        $this->prizeName = parent::requestFilter('prizeName', $this->prizeName);
        $this->prizeIdx = parent::requestFilter('prizeIdx', $this->prizeIdx);
        $this->leftTimes = parent::requestFilter('leftTimes', $this->leftTimes);
        $this->demoTimes = parent::requestFilter('demoTimes', $this->demoTimes);
        $this->score = parent::requestFilter('score', $this->score);
        $this->bg = parent::requestFilter('bg', $this->bg);
        $this->contentId = parent::requestFilter('contentId', $this->contentId);
        $this->productId = parent::requestFilter('productId', $this->productId);
        $this->productName = parent::requestFilter('productName', $this->productId);
        $this->isOrderBack = parent::requestFilter('isOrderBack', $this->isOrderBack);
        $this->focusedId = parent::requestFilter('focusedId', $this->focusedId);
        $this->homeFocusId = parent::requestFilter('homeFocusId', $this->homeFocusId);
        $this->free = parent::requestFilter('free', 0);
        $this->pageCurrent = parent::getFilter("pageCurrent", 1);
        $this->userGroupType = MasterManager::getUserGroupType();
        // 最后一行，打印用户主要信息...
        LogUtils::info("[" . $this->carrierId . "]>>>>>>>>>>>>>>>>>>>>>>>>>>##user [" . $this->userId . "] isVip= " . $this->isVip);
    }

    /**
     * 初始化通用渲染活动参数
     */
    protected function initCommonActivityRender()
    {
        $this->assign("userId", $this->userId);
        $this->assign("inner", $this->inner);
        $this->assign("bg", $this->bg);
        $this->assign("activityName", $this->activityName);
        $this->assign("activityFsImg", $this->activityFsImg);
        $this->assign("activityId", $this->activityName);
        $this->assign("backEPGUrl", $this->backEPGUrl); // 返回地址
        $this->assign("context", $this->context); // 弹框内容
        $this->assign("contentId", $this->contentId);
        $this->assign("productId", $this->productId);
        $this->assign("productName", $this->productName);
        $this->assign('isOrderBack', $this->isOrderBack); // 是否订购返回
        $this->assign("demoTimes", $this->demoTimes);
        $this->assign("leftTimes", $this->leftTimes); // 具体UI跳转前会通过算法计算，重新assign剩余次数
        $this->assign("score", $this->score); // 当前用户的活动积分
        $this->assign("prizeName", $this->prizeName);
        $this->assign("prizeIdx", $this->prizeIdx);
        $this->assign("focusedId", $this->focusedId);
        $this->assign("homeFocusId", $this->homeFocusId);
        $this->assign("free", $this->free);
        $this->assign("userAccount", MasterManager::getAccountId());
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign("pageCurrent", $this->pageCurrent);
        $this->assign("isReportUser",MasterManager::isReportUserInfo());    //判断是否是正常用户，0：非正常用户，1：正常用户
        // 促订规则 -- 暂时屏蔽，后其需要的时候异步调取接口  Common/getOrderConf
        // $payMethod = MasterManager::getPayMethod();
        // $this->assign("payMethod", json_encode($payMethod));
        $promoteOrderConfig = $this->getPromoteOrderConfig();
        $this->assign("payMethod", json_encode($promoteOrderConfig));

        // 渲染前端倒计时相关信息
        $this->assignCountdownInfo();
    }

    /**
     * 设置不同的私有数据（indexUI）
     */
    protected function setPrivateParams_indexUI()
    {
        $this->assignUserScore(); //用户积分
        $this->assignActivityTimes(); // 游戏次数
        $this->assignExchangeRecord(); //中奖纪录
        $this->assignExchangePrize(); //兑换奖品配置
        $this->assignActivityTimes(); // 游戏次数
        $this->assignLotteryRecord(); //获取抽奖记录
        $this->setPrivateParams();//设置活动私有属性
    }

    /**
     *  设置活动配置 -- 设置活动私有参数
     */
    private function setPrivateParams()
    {
        switch ($this->activityName) {
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_WOMENDAY20200225:
                $keyStar = "1008013";
                $valueStarStr = ActivityManager::queryStoreData($keyStar);
                $valueStarJson = json_decode($valueStarStr);
                $areaCode = MasterManager::getAreaCode();
                if($areaCode=="216"){
                    $pathCode="216";
                } else{
                    $pathCode="209";
                }
                $this->assign("pathCode", $pathCode);
                if ($valueStarJson->val == null) {
                    $valueStar = 0;
                } else {
                    $valueStar = $valueStarJson->val;
                }
                $this->assign("valueStar", $valueStar);
                break;
            case ActivityConstant::ACTIVITYDEMOLITIONEXPRESS20200312:
                $payInfo = UserAPI::queryVipInfo(MasterManager::getUserId());
                $packageInfo = OrderManager::getOrderItem(MasterManager::getUserId());

                $currentActivityName = MasterManager::getActivityName();
                $keyHasGift = "gift".$currentActivityName.MasterManager::getUserId();
                $valueHasGift = ActivityManager::queryStoreData($keyHasGift);
                $valueHasGiftJson = json_decode($valueHasGift);
                if ($valueHasGiftJson->val == null) {
                    $valueHasGift = "0";
                } else {
                    $valueHasGift = $valueHasGiftJson->val;
                }
                $this->assign("keyHasGift", $keyHasGift);
                $this->assign("valueHasGift", $valueHasGift);
                $this->assign("payInfo", json_encode($payInfo));
                $this->assign("packageInfo", json_encode($packageInfo));
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_LANTER_BLESS20191225:
                $currentActivityName = MasterManager::getActivityName();
                $enterDay = "day" . $currentActivityName . MasterManager::getUserId();
                $valueEnterDayStr = ActivityManager::queryStoreData($enterDay);
                $valueEnterDayJson = json_decode($valueEnterDayStr);
                if ($valueEnterDayJson->val == null) {
                    $valueEnterDay = "1990-01-01";
                } else {
                    $valueEnterDay = $valueEnterDayJson->val;
                }
                $this->assign("enterDay", $enterDay);
                $this->assign("valueEnterDay", $valueEnterDay);
                break;
            case ActivityConstant::ACTIVITY_SKY_20191225:
                $currentActivityName = MasterManager::getActivityName();
                $keyStar = "star" . $currentActivityName . MasterManager::getUserId();
                $valueStarStr = ActivityManager::queryStoreData($keyStar);
                $valueStarJson = json_decode($valueStarStr);
                if ($valueStarJson->val == null) {
                    $starArr = array("0", "0", "0", "0", "0", "0", "0");
                    $countArray = array("starArr" => $starArr);
                    $valueStar = json_encode($countArray);
                } else {
                    $valueStar = $valueStarJson->val;
                }
                $this->assign("keyStar", $keyStar);
                $this->assign("valueStar", $valueStar);
                break;
            case ActivityConstant::ACTIVITYNATIONALTRAVEL20190912:
                $currentActivityName = MasterManager::getActivityName();
                $keyTraffic = "traffic" . $currentActivityName . MasterManager::getUserId();
                $valueTrafficStr = ActivityManager::queryStoreData($keyTraffic);
                $valueTrafficJson = json_decode($valueTrafficStr);
                if ($valueTrafficJson->val == null) {
                    $trafficArr = array("0", "0", "0", "0", "0", "0");
                    $countArray = array("trafficArr" => $trafficArr);
                    $valueTraffic = json_encode($countArray);
                } else {
                    $valueTraffic = $valueTrafficJson->val;
                }
                $this->assign("keyTraffic", $keyTraffic);
                $this->assign("valueTraffic", $valueTraffic);
                break;
            case ActivityConstant::ACTIVITYQINGMINGWILLOWS20200225:
                $lmcid = MasterManager::getCarrierId();
                if($lmcid == '000051'|| $lmcid == '630092'){
                    $keyPicture = array(10281001, 10281002, 10281003);
                }else{
                    $keyPicture = array(10281001, 10281002, 10281003, 10281004, 10281005, 10281006, 10281007);
                }
                $dataArray = Array();
                foreach ($keyPicture as $key=>$value){
                    $res = ActivityManager::getPlayerVote($value);
                    $res = json_decode($res);
                    if ($res->total_point == null||$res->total_point==0) {
                        array_push($dataArray, 0);
                    } else {
                        array_push($dataArray, $res->total_point);
                    }
                }
                $this->assign("valuePicture", json_encode($dataArray));
                break;
            case ActivityConstant::ACTIVITYGETCAMERA20200208:
                $this->assign('server_iptvforward_cws_fs',SERVER_IPTVFORWARD_CWS_FS);
                 break;
            case ActivityConstant::SUB_ID_ACTIVITYCOUPON20200722:
                $this->assign("userGroupType", $this->userGroupType);
                break;
        }
    }

    /**
     *  设置活动配置 -- 对应管理后台活动配置页
     */
    private function assignActivityConfig()
    {
        // 活动配置
        $activityConfig = ActivityAPI::activityInfo();
        $this->assign('activityConfig', $activityConfig);
    }


    /**
     *  设置抽奖结果信息
     */
    private function assignLotteryRecord()
    {
        // 所用中奖用户信息
        $lotteryRecordList = ActivityManager::getAllUserPrizeList();
        $this->assign('lotteryRecordList', json_encode($lotteryRecordList));
        // 当前用户中奖信息
        $myLotteryRecord = ActivityAPI::inquirePrize();
        $this->assign('myLotteryRecord', $myLotteryRecord);
    }

    /**
     *  设置兑奖结果
     */
    private function assignExchangeRecord()
    {
        // 兑换信息
        $exchangeRecordList = ActivityManager::getExchangePrizeListRecord();
        $this->assign('exchangeRecordList', json_encode($exchangeRecordList));
    }

    /**
     *  设置抽奖奖品配置
     */
    private function assignLotteryPrize()
    {
        $lotteryPrizeList = ActivityManager::getActivityPrizeConfig();
        $this->assign('lotteryPrizeList', $lotteryPrizeList);
    }

    /**
     *  设置兑奖奖品配置
     */
    private function assignExchangePrize()
    {
        $exchangePrizeList = ActivityAPI::exchangeCondition();
        $this->assign('exchangePrizeList', $exchangePrizeList);
    }

    /**
     *  设置用户积分
     */
    private function assignUserScore()
    {
        // 所用中奖用户信息
        $score = ActivityAPI::getUserScore();;
        $this->assign('score', $score);
    }

    /**
     * 设置倒计时信息
     */
    private function assignCountdownInfo()
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
        $this->assign("keyCountdown", $keyCountdown);
        $this->assign("valueCountdown", $valueCountdown);
        $this->assign("extraTimes", $extraTimes);
    }

    /**
     *  设置欢迎页历史步长记录 -- 广西广电退出活动时使用
     */
    private function assignSplashHistory()
    {
        $splashHistory = MasterManager::getSplashHistoryLength();
        if ($splashHistory == null) {
            $splashHistory = 0;
        }
        $this->assign("splashHistory", $splashHistory); // 获取欢迎页在浏览器中的历史步长
    }

    /**
     *  设置活动次数 -- 答题次数
     */
    private function assignActivityTimes()
    {
        $answerTimes = ActivityAPI::getCanAnswerTimes();
        $this->assign("activityTimes", $answerTimes['leftTimes']);
        $this->assign("spMap", json_encode($answerTimes['spMap']));
        $this->assign("demoTimes", json_encode($answerTimes['demoTimes']));
    }
}