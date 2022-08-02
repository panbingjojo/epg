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
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\ActivityAPI;
use Home\Model\Common\ServerAPI\DateMarkAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\Utils;
use Home\Model\Entry\MasterManager;
use Home\Model\Page\PageManager;
use Home\Model\Stats\StatManager;
use Think\Exception;

class ActivityCommonController extends BaseController
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

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array(
            "guideUI" => $this->goHtmlPrefix . "/guide",
            "resultUI" => $this->goHtmlPrefix . "/result",
            "indexUI" => $this->goHtmlPrefix . "/index",
            "dialogUI" => $this->goHtmlPrefix . "/dialogue",
            "winListUI" => $this->goHtmlPrefix . "/winners",
            "exchangePrizeUI" => $this->goHtmlPrefix . "/exchange",
            "healthTestListUI" => $this->goHtmlPrefix . "/healthTestList",
            "completedUI" => $this->goHtmlPrefix . "/completed",
            "signUpUI" => $this->goHtmlPrefix . "/signUp",//宁夏减肥大赛线下
            "likeUI" => $this->goHtmlPrefix . "/like",//宁夏减肥大赛线下
            "introduceUI" => $this->goHtmlPrefix . "/introduce",//宁夏减肥大赛线下
            "pictureUI" => $this->goHtmlPrefix . "/picture",//宁夏减肥大赛线下
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
        $this->goHtmlPrefix = ActivityConstant::getActivityFolder(MasterManager::getSubId());
        if (empty($this->goHtmlPrefix)) {
            $goUrl = PageManager::getBasePagePath('home') . '/' . '?userId=' . MasterManager::getUserId();
            $this->error('区域 [' . MasterManager::getCarrierId() . '] 没有别名为 "' . MasterManager::getSubId() . '"的活动相应的模式！', $goUrl, 5);
            exit();
        }
    }

    /**
     * 游戏页面
     */
    public function indexUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
        $this->setPrivateParams_indexUI();
        $this->getStaticData();

        $this->displayEx(__FUNCTION__);
    }
    /**
     * 健康时播-自测评估
     */
    public function resultUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
        $this->setPrivateParams_indexUI();
        $this->getStaticData();

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 活动首页
     * @throws Exception
     */
    public function guideUI()
    {
        LogUtils::info("[" . $this->carrierId . "]" . $this->goHtmlPrefix . " ---> guideUI url : " . 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);

        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();
        
        //新疆电信健康测一测活动优化，不请求多余接口
        if ($this->activityName==ActivityConstant::SUB_ID_ACTIVITY_HEALTH_TEST20200717&&$this->carrierId==CARRIER_ID_XINJIANGDX){
            $this->displayEx(__FUNCTION__);
            return "";
        }else{
            // 上报模块访问界面
            StatManager::uploadAccessModule($this->userId);

            // 清掉记录焦点的session
            SessionManager::setUserSession(SessionManager::$S_ACTIVITY_CHOOSE_ITEM, "-1");

            // 设置不同的私有数据
            $this->setPrivateParams_guideUI();
            $this->displayEx(__FUNCTION__);
        }
    }


    /**
     * 中奖信息界面
     */
    public function winListUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
        $this->setPrivateParams_winListUI();

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 中奖信息界面
     */
    public function signUpUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
        $this->setPrivateParams_winListUI();

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 中奖信息界面
     */
    public function likeUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
//        $this->setPrivateParams_winListUI();
        $this->assign("pageCurrent", parent::getFilter("pageCurrent"));
        $this->assign("lastFocusId", parent::getFilter("lastFocusId"));
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 中奖信息界面
     */
    public function introduceUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
//        $this->setPrivateParams_winListUI();
        $this->assign("rote", parent::getFilter("rote"));
        $this->assign("index", parent::getFilter("index"));

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 中奖信息界面
     */
    public function pictureUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);
        $this->assign("index", parent::getFilter("index"));
        // 设置不同的私有数据
//        $this->setPrivateParams_winListUI();

        $this->displayEx(__FUNCTION__);
    }

    /*
     * 二级测试话题列表页面
     * */
    public function healthTestListUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
        $this->getStaticData();

        $this->displayEx(__FUNCTION__);
    }

    /*
     * 完成测试页面
     * */
    public function completedUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
        $this->getStaticData();

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 弹窗界面
     */
    public function dialogUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();

        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);

        // 设置不同的私有数据
        $this->setPrivateParams_dialogUI();

        $this->displayEx(__FUNCTION__);
    }


    /**
     * 奖品兑换界面
     */
    public function exchangePrizeUI()
    {
        // 初始化参数渲染
        $this->initCommonRender();
        $this->parseUrlParam();
        $this->initCommonActivityRender();
        // 上报模块访问界面
        StatManager::uploadAccessModule($this->userId);
        $setExchangeList = ActivityAPI::exchangeCondition();
        $this->assign("setExchangeList", $setExchangeList);
        // 设置不同的私有数据
        $this->setPrivateParams_exchangePrizeUI();

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 解析session、get参数
     */
    protected function parseUrlParam()
    {
        $this->carrierId = MasterManager::getCarrierId();
        $this->userId = parent::requestFilter('userId', MasterManager::getUserId());
        $this->activityName = parent::requestFilter('activityName', MasterManager::getSubId());
        $this->activityFsImg = RESOURCES_URL . '/activityImg/' . $this->activityName . '/';
        $this->activityFsImg = RESOURCES_URL . '/activityImg/' . $this->activityName . '/';
        $this->isVip = MasterManager::getUserIsVip();
        $this->backEPGUrl = $this->isJointActivity ? MasterManager::getIPTVPortalUrl() : MasterManager::getEPGHomeURL();

        $this->inner = parent::requestFilter('inner', $this->inner);
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

        // 最后一行，打印用户主要信息...
        LogUtils::info("[" . $this->carrierId . "]>>>>>>>>>>>>>>>>>>>>>>>>>>##user [" . $this->userId . "] isVip= " . $this->isVip);
    }

    /**
     * 初始化通用渲染活动参数
     */
    protected function initCommonActivityRender()
    {
        $this->assign("isVip", $this->isVip);
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
        $this->assign("returnEpgUrl", MasterManager::getIPTVPortalUrl());

        if($this->activityName == ActivityConstant::SUB_ID_ACTIVITY_SUMMER_REFRESH_NEW){
            MasterManager::setAppRootPath(APP_ROOT_PATH);
            if(MasterManager::getActivityId() == -1){
                MasterManager::setActivityId(10073);
            }
        }
        // 促订规则 -- 暂时屏蔽，后其需要的时候异步调取接口  Common/getOrderConf
        // $payMethod = MasterManager::getPayMethod();
        // $this->assign("payMethod", json_encode($payMethod));
        $promoteOrderConfig = $this->getPromoteOrderConfig();
        $this->assign("payMethod", json_encode($promoteOrderConfig));

        // 广西广电EPG返回按键处理时需要
        $splashHistory = MasterManager::getSplashHistoryLength();
        if ($splashHistory == null) {
            $splashHistory = 0;
        }
        $this->assign("splashHistory", $splashHistory); // 获取欢迎页在浏览器中的历史步长

        // 鉴权极其慢且该活动为联合活动需要sp信息。故该活动不需要该接口
        if ($this->activityName != ActivityConstant::SUB_ID_JOINT_ACTIVITYREFUSECLASSIFICATION20190808) {
            $answerTimes = ActivityAPI::getCanAnswerTimes();
            $this->assign("leftTimes", $answerTimes['leftTimes']);
        }

        if ($this->activityName == ActivityConstant::SUB_ID_JOINT_ACTIVITYHURDLE20191113) {
            $currentActivityName = MasterManager::getActivityName();
            $key = $currentActivityName . MasterManager::getUserId();
            $btn0FirstClick = ActivityManager::queryStoreData($key . '0');
            $btn1FirstClick = ActivityManager::queryStoreData($key . '1');
            $btn2FirstClick = ActivityManager::queryStoreData($key . '2');
            $btn3FirstClick = ActivityManager::queryStoreData($key . '3');

            $this->assign("btn0FirstClick", json_decode($btn0FirstClick)->val);
            $this->assign("btn1FirstClick", json_decode($btn1FirstClick)->val);
            $this->assign("btn2FirstClick", json_decode($btn2FirstClick)->val);
            $this->assign("btn3FirstClick", json_decode($btn3FirstClick)->val);
        }

        // 渲染前端倒计时相关信息
        $this->assignCountdownInfo();

        switch ($this->activityName) {

            // 单纯抽奖活动
            case ActivityConstant::ACTIVITYDOUBLETWELVE20191121:
            case ActivityConstant::ACTIVITYLUCKYWHEEL20191106:
            case ActivityConstant::ACTIVITYDEMOLITIONEXPRESS20191022:
            case ActivityConstant::ACTIVITYDEMOLITIONEXPRESS20191121:
            case ActivityConstant::ACTIVITYSHAKETHETREE20190910:
            case ActivityConstant::ACTIVITYTURKEY20191008:
                $activityInfo = ActivityAPI::activityInfo();
                $AllUserPrizeList = ActivityManager::getAllUserPrizeList();
                // 我中奖信息
                $myPrizeList = ActivityAPI::inquirePrize();
                $userPrizeList = json_decode($myPrizeList)->list;
                $userTel = '';
                foreach ($userPrizeList as $item) {
                    if (!empty($item->user_tel)) {
                        $userTel = $item->user_tel;
                    }
                }

                $currentActivityName = MasterManager::getActivityName();
                $key = $currentActivityName . MasterManager::getUserId();
                $storeData = ActivityManager::queryStoreData($key);
                $this->assign("praviteUserValue", $storeData);
                $this->assign("cdCount", json_decode($storeData)->val);
                $this->assign("activityInfo", $activityInfo);
                $this->assign("myPrizeList", $myPrizeList);
                $this->assign("userTel", $userTel);
                $this->assign("AllUserPrizeList", json_encode($AllUserPrizeList));
                break;

            // 积分兑换奖品活动
            case ActivityConstant::ACTIVITYCHRISTMASDAY20191126:
            case ActivityConstant::ACTIVITYSOUTHNORTHRACE20191118:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITYHURDLE20191113:
            case ActivityConstant::ACTIVITYEATRACE20191107:
            case ActivityConstant::ACTIVITYGUESSWORDS20191104:
            case ActivityConstant::ACTIVITYOPENPACKAGE20191023:
            case ActivityConstant::ACTIVITYHEALTHKNOWLEDGERACE20191015:
            case ActivityConstant::ACTIVITYBACKTOSCHOOL20190819:
            case ActivityConstant::ACTIVITYSTACKMOONCAKE20190826:
            case ActivityConstant::ACTIVITYREPEATEDLYREAD20190917:
            case ActivityConstant::ACTIVITYTHANKSGIVING20190923:
            case ActivityConstant::ACTIVITYBACKTOSCHOOL20200629:
                // 活动信息
                $activityInfo = ActivityAPI::activityInfo();
                $allChannelScore = ActivityAPI::getAllChannelScore();
                $totalScore = DateMarkAPI::queryMark('2019-09-20', '2020-09-25');
                $prizeConfigItems = ActivityManager::getActivityPrizeConfig();
                // 配置的兑换设置的列表
                $setExchangeList = ActivityAPI::exchangeCondition();
                // ; // 所有的兑换记录
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                $scopeExchange = $exchangeRecords["data"]["list"];
                $userTel = array_filter($scopeExchange, function ($item) use ($scopeExchange) {
                    return !empty($item['user_tel']) ? $item['user_tel'] : '';
                });

                // 获取用户积分
                $score = ActivityAPI::getUserScore();
                $currentActivityName = MasterManager::getActivityName();
                $key = $currentActivityName . MasterManager::getUserId();
                $storeData = ActivityManager::queryStoreData($key);

                $this->assign("totalScore", json_encode($totalScore));
                $this->assign("allChannelScore", $allChannelScore);
                $this->assign("cdCount", json_decode($storeData)->val);
                $this->assign("score", $score);
                $this->assign("activityInfo", $activityInfo);
                $this->assign("prizeConfigItems", $prizeConfigItems);
                $this->assign('exchangeRecords', json_encode($exchangeRecords));
                $this->assign("userTel", $userTel[0]['user_tel']);
                $this->assign("userAccount", MasterManager::getAccountId());
                $this->assign("setExchangeList", $setExchangeList);

                // 处理单独活动私有数据
                if (ActivityConstant::ACTIVITYCHRISTMASDAY20191126 == $currentActivityName) {
                    $flyValue1 = json_decode(ActivityManager::queryStoreData($key . 'fly'.'1'))->val;
                    $flyValue2 = json_decode(ActivityManager::queryStoreData($key . 'fly'.'2'))->val;
                    $flyValue3 = json_decode(ActivityManager::queryStoreData($key . 'fly'.'3'))->val;
                    $flyValue4 = json_decode(ActivityManager::queryStoreData($key . 'fly'.'4'))->val;
                    $flyValue5 = json_decode(ActivityManager::queryStoreData($key . 'fly'.'5'))->val;
                    $flyValue6 = json_decode(ActivityManager::queryStoreData($key . 'fly'.'6'))->val;
                    $this->assign("flyValue1", empty($flyValue1) ? '0' : $flyValue1);
                    $this->assign("flyValue2", empty($flyValue2) ? '0' : $flyValue2);
                    $this->assign("flyValue3", empty($flyValue3) ? '0' : $flyValue3);
                    $this->assign("flyValue4", empty($flyValue4) ? '0' : $flyValue4);
                    $this->assign("flyValue5", empty($flyValue5) ? '0' : $flyValue5);
                    $this->assign("flyValue6", empty($flyValue6) ? '0' : $flyValue6);
                }
                break;
            case ActivityConstant::ACTIVITYREFUSECLASSIFICATION20190808:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITYREFUSECLASSIFICATION20190808:
                $exchangeRule = ActivityConstant::refuseData(1);
                $addMaterialCount = ActivityConstant::refuseData(2);
                $refuseClassifiedData = ActivityConstant::refuseData(0);

                // 活动信息
                $activityInfo = ActivityAPI::activityInfo();
                $prizeConfigItems = ActivityManager::getActivityPrizeConfig();
                // 配置的兑换设置的列表
                $setExchangeList = ActivityAPI::exchangeCondition();
                // 兑换信息
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                $scopeExchange = $exchangeRecords["data"]["list"];
                $userTel = array_filter($scopeExchange, function ($item) use ($scopeExchange) {
                    return !empty($item['user_tel']) ? $item['user_tel'] : '';
                });
                $extraTimes = 0;
                $extraTimesResult = ActivityManager::getExtraActivityTimes();
                if ($extraTimesResult['result'] == 0) {
                    $extraTimes = $extraTimesResult['left_times'];
                }

                $currentActivityName = MasterManager::getActivityName();
                $key = $currentActivityName . MasterManager::getUserId();
                $storeData = ActivityManager::queryStoreData($key);
                $btn0FirstClick = ActivityManager::queryStoreData($key . '0');
                $btn1FirstClick = ActivityManager::queryStoreData($key . '1');
                $btn2FirstClick = ActivityManager::queryStoreData($key . '2');
                $btn3FirstClick = ActivityManager::queryStoreData($key . '3');

                $this->assign("extraTimes", $extraTimes);
                $this->assign("btn0FirstClick", json_decode($btn0FirstClick)->val);
                $this->assign("btn1FirstClick", json_decode($btn1FirstClick)->val);
                $this->assign("btn2FirstClick", json_decode($btn2FirstClick)->val);
                $this->assign("btn3FirstClick", json_decode($btn3FirstClick)->val);
                $this->assign("cdCount", json_decode($storeData)->val);
                $this->assign("activityInfo", $activityInfo);
                $this->assign("prizeConfigItems", $prizeConfigItems);
                $this->assign('exchangeRecords', json_encode($exchangeRecords)); // 所有的兑换记录
                $this->assign("userTel", $userTel[0]['user_tel']);
                $this->assign("userAccount", MasterManager::getAccountId());
                $this->assign("setExchangeList", $setExchangeList);
                $this->assign("exchangeRule", json_encode($exchangeRule));
                $this->assign("addMaterialCount", json_encode($addMaterialCount));
                $this->assign("refuseClassifiedData", json_encode($refuseClassifiedData));
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_TELEGRAPHY_HEALTH20190627:
            case ActivityConstant::SUB_ID_ACTIVITYSEABATTLE20190619:
            case ActivityConstant::SUB_ID_ACTIVITY_SUMMER_REFRESH20190612:
            case ActivityConstant::SUB_ID_ACTIVITYJOYTOURISM20190325:
            case ActivityConstant::SUB_ID_ACTIVITYAPRILFOOLDAY20190319:
            case ActivityConstant::SUB_ID_ACTIVITYSCISSORS20190315:
            case ActivityConstant::SUB_ID_ACTIVITYHEALTHAEROBIC20190225:
            case ActivityConstant::SUB_ID_ACTIVITYFISHJUMPING20190218:
            case ActivityConstant::SUB_ID_ACTIVITYHOTPOT20190115:
            case ActivityConstant::SUB_ID_ACTIVITYDIGPRIZE20190114:
            case ActivityConstant::SUB_ID_ACTIVITY_LUCKYWHEEL20190107:
            case ActivityConstant::SUB_ID_ACTIVITY_LUCKYWHEEL20190329:
            case ActivityConstant::SUB_ID_ACTIVITY_LUCKCARD20181224:
            case ActivityConstant::SUB_ID_ACTIVITYSCISSORS20190709:
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_TEST20190820:
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_TEST20200717:
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_TEST20200812:
            case ActivityConstant::SUB_ID_ACTIVITY_SUMMER_REFRESH_NEW:

                // 获取用户积分
                $this->score = ActivityAPI::getUserScore();
                /*
                 * 07：00~18：00为白天场景；-> day
                 * 18：00~07：00为夜晚场景。-> night
                 * */
                $localHour = date("H");
                $currentTime = "0";
                if ($localHour >= 18 || $localHour < 7) {
                    $currentTime = "1";
                }
                // 执行一次数据检查更新
                self::specialData();
                $key0 = "times" . MasterManager::getActivityName() . MasterManager::getUserId();
                $specialData = ActivityManager::queryStoreData($key0);
                // 活动信息
                $activityInfo = ActivityAPI::activityInfo();
                $prizeConfigItems = ActivityManager::getActivityPrizeConfig();
                // 我中奖信息
                $myPrizeList = ActivityAPI::inquirePrize();
                $userPrizeList = json_decode($myPrizeList)->list;

                foreach ($userPrizeList as $item) {
                    if (!empty($item->user_tel)) {
                        $userTel = $item->user_tel;
                    }
                    if (!empty($item->prize_idx)) {
                        $prize_idx = $item->prize_idx;
                    }
                }
                // 剩余次数
                $leftTimes = ActivityAPI::canAnswer();
                // 配置的兑换设置的列表
                $setExchangeList = ActivityAPI::exchangeCondition();
                // 获取用户积分
                $getUserScore = ActivityAPI::getUserScore();
                //  所用中奖用户信息
                $AllUserPrizeLis = ActivityManager::getAllUserPrizeList();
                // 兑换信息
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                if (empty($userTel)) {
                    $userTel = $exchangeRecords["data"]["list"][0]["user_tel"];
                }
                // 模拟数据
                $vipList = ActivityConstant::getHealthExaminationBy(3);
                $currentActivityName = MasterManager::getActivityName();
                $key = $currentActivityName . MasterManager::getUserId();
                $storeData = ActivityManager::queryStoreData($key);
                $keyExchange = "exchange" . $key;
                $storeAllBless = ActivityManager::queryStoreData($keyExchange);
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
                $this->assign("activityInfo", $activityInfo);
                $this->assign("activityName", MasterManager::getActivityName());
                $this->assign("prizeConfigItems", $prizeConfigItems);
                $this->assign("storeFish", $storeData);
                $this->assign("specialData", $specialData);
                $this->assign("storeAllBless", $storeAllBless);
                $this->assign('ExchangeRecord', json_encode($exchangeRecords)); // 所有的兑换记录
                $this->assign("myPrizeList", $myPrizeList);
                $this->assign("userTel", $userTel);
                $this->assign("getUserScore", $getUserScore);
                $this->assign("prize_idx", $prize_idx);
                $this->assign("leftTimes", $leftTimes);
                $this->assign("leftTimes", $leftTimes);
                $this->assign("AllUserPrizeLis", json_encode($AllUserPrizeLis));
                $this->assign("userAccount", MasterManager::getAccountId());
                $this->assign("setExchangeList", $setExchangeList);
                $this->assign("vipList", json_encode($vipList));
                $this->assign("cdCount", json_decode($storeData)->val);
                $this->assign("currentTime", $currentTime);
                $this->assign("keyCountdown", $keyCountdown);
                $this->assign("valueCountdown", $valueCountdown);
                $this->assign("extraTimes", $extraTimes);
                break;
            default:
                break;
        }
    }


    /**
     *  “悦动自然，健康有氧计划”活动特殊数据问题
     * 逻辑实现以天为记：
     *          a.用户首次进入活动 data为空则初始化数据
     *          b.用户第二天进入活动 当天时间戳不等与保存的时间戳则更新数据
     *          c.当天用户已经玩过一次或已经进入过一次该活动则使用前一个保存的数据
     */
    private function specialData()
    {
        $key = "times" . MasterManager::getActivityName() . MasterManager::getUserId();
        $localDay = date("d");
        $val = json_decode(json_decode(ActivityManager::queryStoreData($key))->val);
        if ($val->day != $localDay || $val->data == null) {
            $arr = array("water", "bug", "weeding");
            $rand = rand(0, 2);
            $val->day = $localDay;
            for ($i = 0; $i <= floor($rand); $i++) {
                $val->data[$i] = $arr[$i];
            }
        }
        ActivityManager::saveStoreData($key, json_encode($val), 1);
    }

    /**
     * 设置不同的私有数据（indexUI）
     */
    protected function setPrivateParams_indexUI()
    {
        // 不同assign数据
        switch ($this->activityName) {
            case ActivityConstant::SUB_ID_ACTIVITY_SEA20180728:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_SEA20180712:
            case ActivityConstant::SUB_ID_ACTIVITY_MONEY_TREE20180917:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_MONEY_TREE20180917:
                $prizeConfigItems = ActivityManager::getActivityPrizeConfig();
                $this->assign("prizeConfigItems", $prizeConfigItems);
                break;

            // 答题活动：
            case ActivityConstant::SUB_ID_ACTIVITY_ANSWER20180503:
            case ActivityConstant::SUB_ID_ACTIVITY_ANSWER20180710:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_ANSWER20180514:
                if ($this->activityName == ActivityConstant::SUB_ID_ACTIVITY_ANSWER20180710) {
                    $this->assign("answer", ActivityConstant::getAnswer2());
                } else {
                    $this->assign("answer", ActivityConstant::getAnswer());
                }
                break;

            // 健康测一测答题活动：
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_TEST20181215:
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_TEST20180927:
                $answersType = isset($_REQUEST["answersType"]) ? $_REQUEST["answersType"] : 1; // 题库类型：1-趣味小常识 2-心理测试 3-亚健康测试
                $answers = ActivityConstant::getHeathTestAnswersBy($answersType); // 题库数组
                $answersSubType = 1;  // 题目具体类型
                $answersSubjectDesc = ''; // 题目主题描述-即大标题下内容
                if (is_array($answers) && count($answers) > 0 && !empty($answers[0])) {
                    $answersSubType = $answers[0]['type'];
                    $answersSubjectDesc = $answers[0]['subjectDesc'];
                }
                $testResultReferArray = ActivityConstant::getHeathTestAnswersResultBy($answersSubType);// 当前题目对应的评测参考

                $this->assign("answersType", $answersType);
                $this->assign("answersSubType", $answersSubType);
                $this->assign("answersSubjectDesc", $answersSubjectDesc);
                $this->assign("answers", json_encode($answers));
                $this->assign("testResultRefer", json_encode($testResultReferArray));
                break;


            // 饮酒与健康一测答题活动：
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_EXAMINATION:
                $answersType = isset($_REQUEST["answersType"]) ? $_REQUEST["answersType"] : 1; // 题库类型：1-饮酒小常识 2-肝病检测
                $answers = ActivityConstant::getHealthExaminationBy($answersType); // 题库数组
                $answersSubType = 1;  // 题目具体类型
                $answersSubjectDesc = ''; // 题目主题描述-即大标题下内容
                if (is_array($answers) && count($answers) > 0 && !empty($answers[0])) {
                    $answersSubType = $answers[0]['type'];
                    $answersSubjectDesc = $answers[0]['subjectDesc'];
                }
                $testResultReferArray = ActivityConstant::getHeathTestAnswersResultBy($answersSubType);// 当前题目对应的评测参考

                $this->assign("answersType", $answersType);
                $this->assign("answersSubType", $answersSubType);
                $this->assign("answersSubjectDesc", $answersSubjectDesc);
                $this->assign("answers", json_encode($answers));
                $this->assign("testResultRefer", json_encode($testResultReferArray));
                break;
            // 猜字谜
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_WORDSPUZZLE20190124:
            case ActivityConstant::SUB_ID_ACTIVITY_WORDS_PUZZLE20190114:
                $pages = isset($_REQUEST["pages"]) ? $_REQUEST["pages"] : 0;  // 话题页数
                $answers = ActivityConstant::getWordsPuzzle(); // 题库数组
                $this->assign("answers", json_encode($answers));
                $this->assign("pages", $pages);
                break;
            // 宝宝健康大测评
            case ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20190725:
            case ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20181212:
                // 测评题目
                $this->assign("problems", ActivityConstant::getBabyHealthTestProblems(ActivityConstant::getBabyHealthTestPhase()));
                // 期数
                $this->assign("phase", ActivityConstant::getBabyHealthTestPhase());
                // 日期
                $this->assign("date", date("Ym"));
                break;
            // 宝宝健康大测评
            default:
                break;
        }

        // 默认assign数据
        $this->assign("chooseItem", SessionManager::getUserSession(SessionManager::$S_ACTIVITY_CHOOSE_ITEM));
    }

    /*
     * 健康测一测（中国联通EPG-山东省独立活动）
     * */
    protected function getStaticData()
    {
        if ($this->activityName == ActivityStaticData::SUB_ID_ACTIVITY_HEALTH_TEST20181210) {
            $answersType = isset($_REQUEST["answersType"]) ? $_REQUEST["answersType"] : 0;  // 问题类型
            $page = isset($_REQUEST["page"]) ? $_REQUEST["page"] : 0;  // 话题页数
            $topicIndex = isset($_REQUEST["topicIndex"]) ? $_REQUEST["topicIndex"] : 0;
            $topic = ActivityStaticData::getSDhealthTopic($topicIndex); // 话题数组
            $answers = ActivityStaticData::getSDAnswer($topicIndex, $answersType); // 题库数组


            $this->assign("topicIndex", $topicIndex);
            $this->assign("topic", json_encode($topic));
            $this->assign("page", $page);
            $this->assign("answersType", $answersType);
            $this->assign("answers", json_encode($answers));
        }

    }

    /**
     * 设置不同的私有数据（guideUI）
     */
    protected function setPrivateParams_guideUI()
    {
        // 不同assign数据
        switch ($this->activityName) {
            // 宝宝健康大测评
            case ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20190725:
                // 获取测评结果
                $storeData = ActivityManager::queryStoreData(ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20190725.
                    "-" . MasterManager::getUserId() . "-" . date("Ym") . "-" . ActivityConstant::getBabyHealthTestPhase());
                $storeData = json_decode($storeData);
                if ($storeData->result == 0) {
                    $this->assign("isTested", 1);
                    $this->assign("testVal", $storeData->val);
                } else {
                    $this->assign("isTested", 0);
                }
                // 是否需要跳转引导页主页面
                $this->assign("isNeedJumpMain", isset($_REQUEST['isNeedJumpMain']) ? $_REQUEST['isNeedJumpMain'] : "");
                // 期数
                $this->assign("phase", ActivityConstant::getBabyHealthTestPhase());
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_SEA20180728:
            case ActivityConstant::SUB_ID_ACTIVITY_FESTIVE_SPIKE20181119:
                $prizeConfigItems = ActivityManager::getActivityPrizeConfig();

                // 默认assign数据
                // 其他用户中奖信息
                $prizeList1 = ActivityManager::getAllUserPrizeList();
                $list = $prizeList1['list'];
                if (count($list) < 12) {
                    $prizeList = $list;
                } else {
                    $prizeList = array_slice($list, 0, 12);
                }
                $count = count($prizeList);

                // 自己的中奖信息
                $myPrizeList = ActivityAPI::inquirePrize();
                $this->assign("prizeListCount", $count);
                $this->assign('prizeList', $prizeList);
                $this->assign('myPrizeList', json_decode($myPrizeList));
                $this->assign("prizeConfigItems", $prizeConfigItems);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_SEA20180712:
                $prizeRecordItems = ActivityManager::inquirePrize(); // 所有的抽奖记录
                $this->assign("prizeRecordItems", $prizeRecordItems);
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_PUZZLE201801101:
                $activityListData = ActivityManager::getActivityList();
                $leftTimes = $activityListData["left_times"];

                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();

                $key = "Activity" . MasterManager::getUserId();
                $storeData = ActivityManager::queryStoreData($key);

                $goodsItems = ActivityManager::getActivityGoodsList();

                LogUtils::info("puzzle goodsItem=" . $goodsItems);
                $this->assign("storePuzzle", $storeData);
                $this->assign('ExchangeRecord', json_encode($exchangeRecords)); // 所有的兑换记录
                $this->assign("goodsItem", $goodsItems);
                $this->assign("leftTimes", $leftTimes);
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_CHRISTMAS20181211:
                $prizeConfigItems = ActivityManager::getActivityPrizeConfig();
                $this->assign("prizeConfigItems", $prizeConfigItems);
                $this->assign("userAccount", MasterManager::getAccountId());
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_FISH20190221:
            case ActivityConstant::SUB_ID_ACTIVITY_FISH20181217:

                // 我中奖信息
                $myPrizeList = ActivityAPI::inquirePrize();
                $userPrizeList = json_decode($myPrizeList)->list;
                foreach ($userPrizeList as $item) {
                    $userTel = $item->user_tel;
                    $prize_idx = $item->prize_idx;
                }
                // 剩余次数
                $leftTimes = ActivityAPI::canAnswer();
                //  所用中奖用户信息
                $AllUserPrizeLis = ActivityManager::getAllUserPrizeList();

                // 兑换信息
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                // 模拟数据
                $vipList = ActivityConstant::getHealthExaminationBy(3);
                // 查询抽鱼个数
                $currentActivityName = MasterManager::getActivityName();
                $key = $currentActivityName . MasterManager::getUserId();
                $storeData = ActivityManager::queryStoreData($key);
                $this->assign("storeFish", $storeData);
                $this->assign('ExchangeRecord', json_encode($exchangeRecords)); // 所有的兑换记录
                $this->assign("myPrizeList", $myPrizeList);
                $this->assign("userTel", $userTel);
                $this->assign("prize_idx", $prize_idx);
                $this->assign("leftTimes", $leftTimes);
                $this->assign("AllUserPrizeLis", json_encode($AllUserPrizeLis));
                $this->assign("userAccount", MasterManager::getAccountId());
                $this->assign("vipList", json_encode($vipList));
                break;
            // 宝宝健康大测评（每个人每月均有一次测评机会）
            case ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20181212:
                // 获取测评结果
                $storeData = ActivityManager::queryStoreData(ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20181212 .
                    "-" . MasterManager::getUserId() . "-" . date("Ym") . "-" . ActivityConstant::getBabyHealthTestPhase());
                $storeData = json_decode($storeData);
                if ($storeData->result == 0) {
                    $this->assign("isTested", 1);
                    $this->assign("testVal", $storeData->val);
                } else {
                    $this->assign("isTested", 0);
                }
                // 是否需要跳转引导页主页面
                $this->assign("isNeedJumpMain", isset($_REQUEST['isNeedJumpMain']) ? $_REQUEST['isNeedJumpMain'] : "");
                // 期数
                $this->assign("phase", ActivityConstant::getBabyHealthTestPhase());
                break;
            // 宝宝健康大测评（每个人每月均有一次测评机会）
            case ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20190725:
                // 获取测评结果
                $storeData = ActivityManager::queryStoreData('ActivityBabyHealthTest20190725' .
                    "-" . MasterManager::getUserId() . "-" . date("Ym") . "-" . ActivityConstant::getBabyHealthTestPhase());
                $storeData = json_decode($storeData);
                if ($storeData->result == 0) {
                    $this->assign("isTested", 1);
                    $this->assign("testVal", $storeData->val);
                } else {
                    $this->assign("isTested", 0);
                }
                // 是否需要跳转引导页主页面
                $this->assign("isNeedJumpMain", isset($_REQUEST['isNeedJumpMain']) ? $_REQUEST['isNeedJumpMain'] : "");
                // 期数
                $this->assign("phase", ActivityConstant::getBabyHealthTestPhase());
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_TELEGRAPHY_HEALTH20190627:
                $voteJson = ActivityManager::getPlayerVote(null);
                $this->assign("voteDetail", $voteJson);
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_HOLIDAY_FISH20190715:
                // 获取兑换奖品信息
                $prizeConfigItems = ActivityAPI::exchangeCondition();
                $this->assign("prizeConfigItems", $prizeConfigItems);
                // 获取已兑换奖品信息（中奖名单）
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                $this->assign("exchangeRecords", json_encode($exchangeRecords));
            case ActivityConstant::SUB_ID_ACTIVITY_GALAXY_GALLERY20190715:
                // 活动信息
                $activityInfoJson = ActivityAPI::activityInfo();
                $activityInfo = json_decode($activityInfoJson);
                $activityRemainTimes = 0;
                if ($activityInfo->result == 0) {
                    $activityRemainTimes = $activityInfo->left_times;
                }
                $this->assign("remainTimes", $activityRemainTimes);
                // 获取兑换奖品信息
                $prizeConfigItems = ActivityAPI::exchangeCondition();
                $this->assign("prizeConfigItems", $prizeConfigItems);
                // 获取已兑换奖品信息（中奖名单）
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                $this->assign("exchangeRecords", json_encode($exchangeRecords));
                // 保存是否完成状态
                $currentActivityName = MasterManager::getActivityName();
                $keyArrive = "arrive" . $currentActivityName . MasterManager::getUserId();
                $valueArriveStr = ActivityManager::queryStoreData($keyArrive);
                $valueArriveJson = json_decode($valueArriveStr);
                if ($valueArriveJson->val == null) {
                    $arriveArray = array("arrive" => "0");
                    $valueArrive = json_encode($arriveArray);
                } else {
                    $valueArrive = $valueArriveJson->val;
                }
                $this->assign("keyArrive", $keyArrive);
                $this->assign("valueArrive", $valueArrive);
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_DELIVER_MOON_CAKE20190715:
                // 获取积分信息
                $this->assignScoreInfo();
                // 获取中奖名单信息
                $this->assignLotteryInfo();
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_TEST20190820:
                $this->assignSplashHistory();
                break;
            default:
                break;
        }

        // 默认assign数据
        if ($this->prizeIdx == 0 || $this->prizeName) {
            $item = ActivityManager::getLastDrawPrizeRecord();
            $this->prizeIdx = $item->prize_idx;
            $this->prizeName = $item->prize_name;
        }
        $this->assign("prizeName", $this->prizeName);
        $this->assign("prizeIdx", $this->prizeIdx);
        $this->assign("userAccount", MasterManager::getAccountId());
    }

    /**
     * 设置不同的私有数据（winListUI）
     */
    protected function setPrivateParams_winListUI()
    {
        // 不同assign数据
        switch ($this->activityName) {
            case ActivityConstant::SUB_ID_ACTIVITY_COLLECTING_GIFTS20181212:
            case ActivityConstant::SUB_ID_ACTIVITY_SEA20180728:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_SEA20180712:
            case ActivityConstant::SUB_ID_ACTIVITY_COLLECTING_HONEY20190408:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_GROWING_UP20190517:
            case ActivityConstant::SUB_ID_ACTIVITY_SUMMER_REFRESH20190612:
                // 查询用户的兑换记录
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                $allList = $exchangeRecords['data']['all_list'];
                $myPrizeList = $exchangeRecords['data']['list'];
                foreach ($allList as $value) {
                    if ($value[user_account] == MasterManager::getAccountId()) {
                        $myPrizeListTime = $value["log_dt"];
                    }
                };
                $goodsList = $exchangeRecords['data']['goods_list'];

                $this->assign('prizeList', $allList); // 所有的兑换记录
                $this->assign('myPrizeList2', json_encode($myPrizeList)); // 自己的兑换记录
                $this->assign('myPrizeList', $myPrizeList); // 自己的兑换记录
                $this->assign('goodsList', json_encode($goodsList));
                $this->assign('myPrizeListTime', $myPrizeListTime);
                break;

            // 饮酒与健康一测答题活动：
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_EXAMINATION:
                // 饮酒与健康一测答题活动：
                // 默认assign数据
                // 其他用户中奖信息
                $vipList1 = ActivityConstant::getHealthExaminationBy(3);
//                $list = $vipList1['$list'];
                if (count($vipList1) < 12) {
                    $vipList = $vipList1;
                } else {
                    $vipList = array_slice($vipList1, 0, 12);
                }
                $count = count($vipList);

                $this->assign("prizeListCount", $count);
                $this->assign('prizeList', $vipList);
                break;
//            case ActivityConstant::SUB_ID_ACTIVITY_COLLECTING_HONEY20190408:
//                //  所用中奖用户信息
//                $AllUserPrizeLis = ActivityManager::getAllUserPrizeList();
//                // 兑换信息
//                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
//                $this->assign("AllUserPrizeLis", json_encode($AllUserPrizeLis));
//                $this->assign('exchangeRecords', json_encode($exchangeRecords));
            case ActivityConstant::SUB_ID_ACTIVITY_ACTIVITY_LOSE_WEIGHT20190408:
//                $this->assign("index", parent::getFilter("index"));
//                $this->assign("focusId", parent::getFilter("focusId"));
                $player = ActivityConstant::getPlayerInfo();
                $this->assign('prizeList2', $player);
                $prizeList1 = ActivityManager::getAllUserPrizeList();
                $list = $prizeList1['list'];
                if (count($list) < 12) {
                    $prizeList = $list;
                } else {
                    $prizeList = array_slice($list, 0, 12);
                }
                $count = count($prizeList);

                // 自己的中奖信息
                $myPrizeList = ActivityAPI::inquirePrize();

                $this->assign("prizeListCount", $count);
                $this->assign('prizeList', $prizeList);
                $this->assign('myPrizeList', json_decode($myPrizeList));
                break;
            default:
                // 默认assign数据
                // 其他用户中奖信息
                $prizeList1 = ActivityManager::getAllUserPrizeList();
                $list = $prizeList1['list'];
                if (count($list) < 12) {
                    $prizeList = $list;
                } else {
                    $prizeList = array_slice($list, 0, 12);
                }
                $count = count($prizeList);

                // 自己的中奖信息
                $myPrizeList = ActivityAPI::inquirePrize();

                $this->assign("prizeListCount", $count);
                $this->assign('prizeList', $prizeList);
                $this->assign('myPrizeList', json_decode($myPrizeList));
                break;
        }

    }

    /**
     * 设置不同的私有数据（dialogUI）
     */
    protected
    function setPrivateParams_dialogUI()
    {
        // 不同assign数据
        switch ($this->activityName) {
            // 饮酒与健康一测答题活动：
            case ActivityConstant::SUB_ID_ACTIVITY_HEALTH_EXAMINATION:
                $this->answersType = isset($_REQUEST['answersType']) ? $_REQUEST['answersType'] : $this->answersType;
                $this->resultContent = isset($_REQUEST['resultContent']) ? $_REQUEST['resultContent'] : $this->resultContent;
                $this->assign("answersType", $this->answersType);
                $this->assign("resultContent", $this->resultContent);
                break;
            // 宝宝健康大测评
            case ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20181212:
                // 题目答案
                $answers = ActivityConstant::getBabyHealthTestAnswers();
                $this->assign("answers", $answers);
                // 用户答案
                $storeData = ActivityManager::queryStoreData(ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20181212 .
                    "-" . MasterManager::getUserId() . "-" . date("Ym") . "-" . ActivityConstant::getBabyHealthTestPhase());
                $storeData = json_decode($storeData);
                $this->assign("testVal", $storeData->val);
                // 推荐专辑
                $this->assign("albumList", ActivityConstant::getBabyHealthTestRecommendAlbum(ActivityConstant::getBabyHealthTestPhase()));
                break;
            // 宝宝健康大测评
            case ActivityConstant::SUB_ID_ACTIVITY_BABY_HEALTH_TEST20190725:
                // 题目答案
                $answers = ActivityConstant::getBabyHealthTestAnswers();
                $this->assign("answers", $answers);
                // 用户答案
                $storeData = ActivityManager::queryStoreData('ActivityBabyHealthTest20190725' .
                    "-" . MasterManager::getUserId() . "-" . date("Ym") . "-" . ActivityConstant::getBabyHealthTestPhase());
                $storeData = json_decode($storeData);
                $this->assign("testVal", $storeData->val);
                // 推荐专辑
                $this->assign("albumList", ActivityConstant::getBabyHealthTestRecommendAlbum(ActivityConstant::getBabyHealthTestPhase()));
                break;
            default:
                // 默认assign数据
                if (ActivityManager::isJointActivity()) {
                    $spInfo = Utils::getOrderInfo000051($this->contentId);
                    $authSPMap = ActivityAPI::getOrderSpInfo();
                    $this->assign("spDesc", $spInfo['desc']);
                    $this->assign("spMap", $authSPMap);
                }
                break;
        }
    }

    /**
     * 设置不同的私有数据（exchangePrizeUI）
     */
    protected
    function setPrivateParams_exchangePrizeUI()
    {
        // 不同assign数据
        switch ($this->activityName) {
            case ActivityConstant::SUB_ID_ACTIVITY_COLLECTING_GIFTS20181212:
            case ActivityConstant::SUB_ID_ACTIVITY_SEA20180728:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_SEA20180712:
            case ActivityConstant::SUB_ID_ACTIVITY_COLLECTING_HONEY20190408:
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_GROWING_UP20190517:
            case ActivityConstant::SUB_ID_ACTIVITY_SUMMER_REFRESH20190612:
                // 查询用户的兑换记录
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                $allList = $exchangeRecords['data']['all_list'];
                $myPrizeList = $exchangeRecords['data']['list'];
                // 说明：海洋活动比较特殊，采用抽中奖品（水母、金鱼等）再去兑换真正的物品（即最终的奖品）
                // 我抽中的动物（积分）---也就是我的中奖记录
                $prizeRecordItems = ActivityAPI::inquirePrize(); // 所有的抽中奖记录

                // 查询用户的兑换记录
                $exchangeRecords = ActivityManager::getExchangePrizeListRecord();
                $goodsList = $exchangeRecords['data']['goods_list'];

                // 拉取兑换物品时的数据
                $goodsItems = ActivityManager::getActivityGoodsList();

                $this->assign("prizeRecordItems", $prizeRecordItems); // 我抽中的动物（积分）
                $this->assign("exchangeRecords", json_encode($goodsList)); // 我的兑换记录
                $this->assign("myRecords", json_encode($exchangeRecords)); // 我的兑换记录
                $this->assign("goodsItems", $goodsItems); // 可兑换的商品列表信息
                break;
            default:
                // 默认assign数据
                $prizeConfigItems = ActivityManager::getActivityPrizeConfig();
                $this->assign("prizeConfigItems", json_encode($prizeConfigItems));   // 奖品列表
                break;
        }
    }

    /**
     * 跳去局方退订页（中国联通活动使用）
     */
    public
    function goCancelOrderPageUI()
    {
        // 调整局方入口参数
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $areaCode = MasterManager::getAreaCode();
        $accountId = MasterManager::getAccountId();

        // 当进入其它应用时，把局方的返回url改为联合活动的url
        $tmpInfo = "";
        foreach ($epgInfoMap as $key => $value) {
            if ($key != "ReturnUrl") {
                $tmpInfo .= "&$key=$value";
            }
        }

        $subId = MasterManager::getSubId();
        $tmpUrl = "http://202.99.114.74:56015/index.php?lmcid=000051&lmsl=hd&lmuf=2&lmsid=" . $subId . "&lmp=0" . $tmpInfo;

        $goUrl = "http://202.99.114.27:35806/epg_uc/home.action?UserID=$accountId&CarrierId=$areaCode&entranceType=1&menuType=9&myExpensesSwitch=1&ReturnUrl=" . urlencode($tmpUrl);

        LogUtils::info("======================>go :" . $goUrl);

        header('Location:' . $goUrl);
    }

    /**
     *  获取中奖名单信息，提供前端渲染中奖名单页显示
     */
    private function assignLotteryInfo()
    {
        // 所用中奖用户信息
        $allLotteryList = ActivityManager::getAllUserPrizeList();
        $this->assign('allLotteryList', json_encode($allLotteryList));
        // 当前用户中奖信息
        $myLotteryInfo = ActivityAPI::inquirePrize();
        $this->assign('myLotteryInfo', $myLotteryInfo);
    }

    /**
     *  获取用户积分，提供前端渲染中奖名单页显示
     */
    private function assignScoreInfo()
    {
        // 所用中奖用户信息
        $score = ActivityAPI::getUserScore();;
        $this->assign('score', $score);
    }

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

    private function assignSplashHistory()
    {
        $splashHistory = MasterManager::getSplashHistoryLength();
        if ($splashHistory == null) {
            if ($splashHistory == null) {
                $splashHistory = 0;
            }
            $this->assign("splashHistory", $splashHistory); // 获取欢迎页在浏览器中的历史步长
        }
    }


}

