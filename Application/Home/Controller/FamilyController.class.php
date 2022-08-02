<?php
/**
 * Created by longmaster.
 * Date: 2018-09-28
 * Time: 11:08
 * Brief: 此文件（或类）用于处理我的家模块的相关内容
 */

namespace Home\Controller;

use Home\Model\Common\ServerAPI\FamilyAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\MainHome\MainHomeManager;
use Home\Model\Stats\StatManager;

class FamilyController extends BaseController
{
    private static $MEMBER_ADD = 1;//添加家庭成员
    private static $MEMBER_EDIT = 2;//编辑家庭成员

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    /**
     * 我的家模块 - 主页
     */
    public function indexV11UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $focusIndex = isset($_GET['focusIndex']) && !empty($_GET['focusIndex']) ? $_GET['focusIndex'] : "";
        // 加载页面配置信息
        $configInfo = MainHomeManager::loadHomeClassifyInfo(2);
        $this->assign("pageInfo", $configInfo);
        $this->assign('focusIndex', $focusIndex);
        // 是否从主页跳入
        $isFromMyFamilyPage = isset($_GET['isFromMyFamilyPage']) ? $_GET['isFromMyFamilyPage'] : "";
        $this->assign("isFromMyFamilyPage", $isFromMyFamilyPage);
        $this->displayEx(__FUNCTION__);
    }


    function myHomeV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $myFamilyFocus = $_REQUEST["myFamilyFocus"];

        $this->assign("myFamilyFocus", $myFamilyFocus);
        // 用户是否是自动订购用户
        $this->assign('autoOrder', MasterManager::getAutoOrderFlag());
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

        $this->displayEx(__FUNCTION__);
    }

    public function myHomeV2UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $myFamilyFocus = $_REQUEST["focusId"];
        $memberID = $_REQUEST["memberID"];
        $isAddMember = parent::requestFilter('isAddMember');
        $comeFrom = parent::requestFilter('comeFrom','');
        $isFirst = parent::requestFilter('isFirst',true);
        $webMember = FamilyAPI::queryMember();
        $memberInfoRet = json_encode($webMember);
//        LogUtils::info("myHomeV2UI webMember=".$memberInfoRet);
        $this->assign("memberInfo", $memberInfoRet);
        $this->assign("focusId", $myFamilyFocus);
        $this->assign("memberID", $memberID);
        $this->assign("isAddMember", $isAddMember);
        $this->assign("comeFrom", $comeFrom);
        $this->assign("isFirst", $isFirst);


        $focusImageName2_3 = 'detect_record';
        if (CARRIER_ID == CARRIER_ID_SHANDONGDX_APK) {
            $focusImageName2_3 = 'order_vip';
        }
        $this->assign("focusImageName2_3", $focusImageName2_3);

        // 是否显示家庭档案中藏【检测记录】按钮
        $isShowTestRecord = 1;
        $hideTestRecordArr = [CARRIER_ID_JILINGDDX_MOFANG/* 吉林广电电信魔方EPG */,CARRIER_ID_HAINANDX, CARRIER_ID_SHIJICIHAI];
        if (in_array(MasterManager::getCarrierId(), $hideTestRecordArr)) {
            $isShowTestRecord = 0;
        }
        $this->assign('isShowTestRecord', $isShowTestRecord);

        // 是否显示家庭档案中藏【绑定小程序】按钮
        $isShowBindingApplet = 1;
        $hideBindingAppletArr = [CARRIER_ID_JILINGDDX_MOFANG/* 吉林广电电信魔方EPG */,CARRIER_ID_SHIJICIHAI];
        if (in_array(MasterManager::getCarrierId(), $hideBindingAppletArr)) {
            $isShowBindingApplet = 0;
        }
        $this->assign('isShowBindingApplet', $isShowBindingApplet);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

        $this->displayEx(__FUNCTION__);
    }

    public function indexV1UI()
    {
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $myFamilyFocus = $_REQUEST["focusId"];
        $memberID = $_REQUEST["memberID"];
        $memberArr = array();
        $webMember = FamilyAPI::queryMember();
        $this->assign("memberInfo", json_encode($webMember));
        $this->assign("focusId", $myFamilyFocus);
        $this->assign("memberID", $memberID);

        $this->displayEx(__FUNCTION__);
    }

    function aboutV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $returnHomeUrl = parent::requestFilter("returnHomeUrl");
        $returnFamilyHomeUrl = parent::requestFilter("returnFamilyHomeUrl");

        $telCarriers1 = [CARRIER_ID_JILINGD,CARRIER_ID_JILINGDDX,CARRIER_ID_XINJIANGDX];
        if(in_array(CARRIER_ID,$telCarriers1)) {
            $serviceTel = "400-016-0700";
        } else {
            $serviceTel = "400-063-3138";
        }

       if(CARRIER_ID == CARRIER_ID_JILINGD) {
           $version = "0. 0. 1";
       } else {
           $version = "0. 7. 9";
       }

       if(CARRIER_ID == CARRIER_ID_JILINGDDX) {
           $intro = "电视家庭医生以关注每位家庭成员的健康为己任，通过信息化手段，为用户提供优质的健康监护服务。为家庭成员的疾病预防、发现治疗提供全程、专业、个性的“家庭医生”式服务。并丰富电子健康档案的日常体征数据收集。目前支持在线检测血糖、血压、体脂等多项数据，还提供视频问诊、名医讲座、疑难重症二次诊断等功能";
       } else if (CARRIER_ID == CARRIER_ID_JILINGD) {
           $intro = "电视家庭医生以关注每位家庭成员的健康为己任，通过信息化手段，为用户提供优质的健康监护服务。为家庭成员的疾病预防、发现治疗提供全程、专业、个性的“家庭医生”式服务。并丰富电子健康档案的日常体征数据收集。目前支持在线检测血糖、胆固醇和尿酸这3项数据，还提供视频问诊、名医讲座、疑难重症二次诊断等功能。";
       } else {
           $intro = "39健康以关注每位家庭成员的健康为己任，通过信息化手段，为用户提供优质的健康监护服务。为家庭成员的疾病预防、发现治疗提供全程、专业、个性的“家庭医生”式服务。并丰富电子健康档案的日常体征数据收集。目前支持在线检测血糖、胆固醇和尿酸这3项数据，还提供视频问诊、名医讲座、疑难重症二次诊断等功能。";
       }

        $this->assign("serviceTel", $serviceTel);
        $this->assign("version", $version);
        $this->assign("intro", $intro);
        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("returnFamilyHomeUrl", $returnFamilyHomeUrl);

        $this->displayEx(__FUNCTION__);
    }

    function familyMembersAddV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $returnArchiveUrl = parent::requestFilter("returnArchiveUrl");
        $returnRecordDetailUrl = parent::requestFilter("returnRecordDetailUrl");
        $returnFamilyHomeUrl = parent::requestFilter("returnFamilyHomeUrl");
        $inquiryID = parent::requestFilter("inquiryID");
        $archiveMemberID = parent::requestFilter("archiveMemberID");
        $actionType = "";
        $memberID = "";
        if (!empty(parent::requestFilter("actionType"))) {
            $actionType = parent::requestFilter("actionType");
            $memberID = parent::requestFilter("memberID");
            switch ($actionType) {
                case self::$MEMBER_ADD:
                    break;
                case self::$MEMBER_EDIT:
                    break;
                default:
                    $this->error();
                    break;
            }
        } else {
            $this->error();
        }
        $member = $this->filterMember($actionType, $memberID);
        $returnHomeUrl = parent::requestFilter("returnHomeUrl");

        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("returnFamilyHomeUrl", $returnFamilyHomeUrl);
        $this->assign("inquiryID", $inquiryID);
        $this->assign("archiveMemberID", $archiveMemberID);
        $this->assign("returnArchiveUrl", $returnArchiveUrl);
        $this->assign("returnRecordDetailUrl", $returnRecordDetailUrl);
        $this->assign("memberID", $memberID);
        $this->assign("member", json_encode($member));

        $this->displayEx(__FUNCTION__);
    }

    function familyMembersEditorV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $memberId = isset($_REQUEST['memberID']) && !empty("memberID") ? $_REQUEST['memberID'] : "0";

        $memberArr = array();
        $webMember = FamilyAPI::queryMember($memberId);
        if ($webMember["result"] == 0) {
            if (count($webMember["list"]) > 0) {
                $memberArr = $webMember["list"];
            }
        }
        $returnHomeUrl = parent::requestFilter("returnHomeUrl");
        $returnFamilyHomeUrl = parent::requestFilter("returnFamilyHomeUrl");

        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("returnFamilyHomeUrl", $returnFamilyHomeUrl);
        $this->assign("member", json_encode($memberArr));

        $this->displayEx(__FUNCTION__);
    }

    function familyMembersAddEditV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $returnArchiveUrl = parent::requestFilter("returnArchiveUrl");
        $returnRecordDetailUrl = parent::requestFilter("returnRecordDetailUrl");
        $returnFamilyHomeUrl = parent::requestFilter("returnFamilyHomeUrl");
        $inquiryID = parent::requestFilter("inquiryID");
        $archiveMemberID = parent::requestFilter("archiveMemberID");
        $actionType = "";
        $memberID = "";
        if (!empty(parent::requestFilter("actionType"))) {
            $actionType = parent::requestFilter("actionType");
            $memberID = parent::requestFilter("memberID");
            switch ($actionType) {
                case self::$MEMBER_ADD:
                    break;
                case self::$MEMBER_EDIT:
                    break;
                default:
                    $this->error();
                    break;
            }
        } else {
            $this->error();
        }
        $member = $this->filterMember($actionType, $memberID);
        $returnHomeUrl = parent::requestFilter("returnHomeUrl");

        $this->assign("returnHomeUrl", $returnHomeUrl);
        $this->assign("returnFamilyHomeUrl", $returnFamilyHomeUrl);
        $this->assign("inquiryID", $inquiryID);
        $this->assign("archiveMemberID", $archiveMemberID);
        $this->assign("returnArchiveUrl", $returnArchiveUrl);
        $this->assign("returnRecordDetailUrl", $returnRecordDetailUrl);
        $this->assign("memberID", $memberID);
        $this->assign("member", json_encode($member));
        $this->assign("actionType", $actionType);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 过滤家庭成员信息
     * @param $actionType 0:添加家庭成员，1编辑家庭成员
     * @param $memberID     家庭成员ID
     * @return array        返回最后的家庭成员信息
     */
    private function filterMember($actionType, $memberID)
    {
        $initArr = array(
            array(
                "member_id" => 0,
                "member_name" => "爸爸",
                "member_age" => 40,
                "member_gender" => 0,
                "member_height" => 175,
                "member_weight" => 70,
                "member_image_id" => 1,
                "member_tel" => "",
            ),
            array(
                "member_id" => 0,
                "member_name" => "妈妈",
                "member_age" => 40,
                "member_gender" => 1,
                "member_height" => 165,
                "member_weight" => 60,
                "member_image_id" => 2,
                "member_tel" => "",
            ),
            array(
                "member_id" => 0,
                "member_name" => "爷爷",
                "member_age" => 70,
                "member_gender" => 0,
                "member_height" => 175,
                "member_weight" => 70,
                "member_image_id" => 3,
                "member_tel" => "",
            ),
            array(
                "member_id" => 0,
                "member_name" => "奶奶",
                "member_age" => 70,
                "member_gender" => 1,
                "member_height" => 165,
                "member_weight" => 60,
                "member_image_id" => 4,
                "member_tel" => "",
            ),
            array(
                "member_id" => 0,
                "member_name" => "儿子",
                "member_age" => 20,
                "member_gender" => 0,
                "member_height" => 175,
                "member_weight" => 70,
                "member_image_id" => 5,
                "member_tel" => "",
            ),
            array(
                "member_id" => 0,
                "member_name" => "女儿",
                "member_age" => 20,
                "member_gender" => 1,
                "member_height" => 165,
                "member_weight" => 60,
                "member_image_id" => 6,
                "member_tel" => "",
            ),
            array(
                "member_id" => 0,
                "member_name" => "男性",
                "member_age" => 30,
                "member_gender" => 0,
                "member_height" => 175,
                "member_weight" => 70,
                "member_image_id" => 7,
                "member_tel" => "",
            ),
            array(
                "member_id" => 0,
                "member_name" => "女性",
                "member_age" => 30,
                "member_gender" => 1,
                "member_height" => 165,
                "member_weight" => 60,
                "member_image_id" => 8,
                "member_tel" => "",
            ),
        );

        $webArr = FamilyAPI::queryMember();

        $waitArr = [];

        if ($webArr["result"] === 0) {
            $memberArr = $webArr["list"];
            if (count($memberArr) > 0) {
                foreach ($memberArr as $webKey => $webVal) {

                    if ($actionType == self::$MEMBER_EDIT) {
                        if ($memberID == $webVal["member_id"]) {
                            $waitArr = $webVal;
                        }
                    }

                    foreach ($initArr as $initKey => $initVal) {
                        if (trim($webVal["member_name"]) == $initVal["member_name"]) {
                            array_splice($initArr, $initKey, 1);
                        }
                    }

                }
            }
        }
        if (count($waitArr) > 0) {
            array_unshift($initArr, $waitArr);
        }
        return $initArr;
    }

}