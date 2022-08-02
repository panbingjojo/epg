<?php
/**
 * Created by PhpStorm.
 * User: yzq
 * Date: 2017-09-29
 * Time: 17:31
 * Brief: 专辑位控制器
 */

namespace Activity\Controller;

use Home\Controller\BaseController;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\HttpManager;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;


class ActivityZhuawawaController extends BaseController
{
    private $userId;//用户id
    private $inner = 1;//是否从首页跳转过来，决定专辑按返回时回退到epg页面还是首页
    private $platformType = "";

    /**
     * 页面配置
     * @return array
     */
    public function config()
    {
        switch (MasterManager::getCarrierId()) {
            default:
                return array(
                    "indexUI" => "ActivityZhuawawa/V1/index",
                    "showPriceInfoUI" => "ActivityZhuawawa/V1/showPriceInfo",
                );
        }
    }

    public function indexUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        $this->parseUrlParam();

        if ($this->platformType == STB_TYPE_HD) {
            $this->assign('unitTop', 20);
            $this->assign('unitLeft', 30);
            $this->assign('unitBack', 20);
            $this->assign('lastTop', 240);
            $this->assign('lastLeft', 730);
            $this->assign('handLeft', -32);
            $this->assign('priceTop', 70);
        } else {
            $this->assign('unitTop', 10);
            $this->assign('unitLeft', 20);
            $this->assign('unitBack', 10);
            $this->assign('lastTop', 140);
            $this->assign('lastLeft', 490);
            $this->assign('handLeft', -25);
            $this->assign('priceTop', 40);
        }

        //奖品数据
        $prizeList1 = ActivityManager::getAllUserPrizeList();
        $count = count($prizeList1);
        if ($prizeList1 != null && $count > 0) {
            $prizeList = json_encode($prizeList1);
        } else {
            $prizeList = $this->setPrizeData();
        }
        // 返回局方EPG大厅的地址
        $backEPGUrl = MasterManager::getIPTVPortalUrl();
        $this->assign('backEPGUrl', $backEPGUrl);

        //上报模块访问界面
        StatManager::uploadAccessModule($this->userId);
        $listVideo = $this->getRecommendVideo();

        $this->assign("commonImgsView", COMMON_IMGS_VIEW);
        $this->assign('listVideo', json_encode($listVideo));
        $this->assign('prizeList', $prizeList);
        $this->assign("inner", $this->inner);
        $this->assign("focusIndex", $_GET['focusIndex']);
        $this->assign("activityName", MasterManager::getActivityName());


        $this->displayEx(__FUNCTION__);
    }

    /**
     * 显示奖品信息页面
     */
    public function showPriceInfoUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 解析session、get参数
     */
    private function parseUrlParam()
    {
        $this->userId = parent::getFilter('userId', MasterManager::getUserId());
        $this->platformType = MasterManager::getPlatformType();                 //平台类型
        if (isset($_GET["inner"])) {
            $this->inner = $_GET["inner"];
        }

    }

    /**
     * 设置领奖电话号码
     */
    public function setPhoneNumberUI()
    {
        $json = array(
            "activity_id" => MasterManager::getActivityId(),
            "prize_idx" => parent::postFilter("prizeIdx"),
            "user_tel" => parent::postFilter('userTel')
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_ACTIVITY_SUBMIT_TEL_URL);
        $result = $httpManager->requestPost($json);
        echo $result;
        exit();
    }

    /**
     * 拉取推荐视频
     */
    public function getRecommendVideo()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_RECOMMEND);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result, true);
        if ($data['result'] == 0) {
            return $data['data'][0];
        } else {
            return null;
        }

    }

    /**设置假数据
     * @return array
     */
    public function setPrizeData()
    {
        $one = array(
            "user_account" => "0518451640",
            "prize_dt" => "2018-01-05",
            "prize_name" => "5元话费"
        );
        $two = array(
            "user_account" => "0585541134",
            "prize_dt" => "2018-01-05",
            "prize_name" => "158元坚果大礼包"
        );
        $three = array(
            "user_account" => "05125441273",
            "prize_dt" => "2018-01-05",
            "prize_name" => "158元坚果大礼包"
        );
        $four = array(
            "user_account" => "0516544203",
            "prize_dt" => "2018-01-05",
            "prize_name" => "10元话费"
        );
        $five = array(
            "user_account" => "051***113",
            "prize_dt" => "2018-01-05",
            "prize_name" => "158元坚果大礼包"
        );
        $six = array(
            "user_account" => " 051654419",
            "prize_dt" => "2018-01-05",
            "prize_name" => "5元话费"
        );
        $seven = array(
            "user_account" => "05198541069",
            "prize_dt" => "2018-01-05",
            "prize_name" => "10元话费"
        );
        $eight = array(
            "user_account" => "051965711",
            "prize_dt" => "2018-01-05",
            "prize_name" => "10元话费"
        );
        $nine = array(
            "user_account" => "051987851",
            "prize_dt" => "2018-01-05",
            "prize_name" => "10元话费"
        );
        $ten = array(
            "user_account" => "0516654542",
            "prize_dt" => "2018-01-05",
            "prize_name" => "10元话费"
        );
        $prizeList = array($one, $two, $three, $four, $five, $six, $seven, $eight, $nine, $ten);
        return json_encode($prizeList);
    }


}