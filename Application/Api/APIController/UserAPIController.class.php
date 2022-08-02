<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/1
 * Time: 上午9:46
 */

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Activity\ActivityManager;
use Home\Model\Common\ServerAPI\StoreAPI;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\ServerAPI\UserAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\User\AuthUserBuilder;


class UserAPIController extends BaseController
{

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }


    /** 完成前端鉴权用户相关操作 */
    public function authUserAction(){
        $authUserInstance = AuthUserBuilder::buildAuthUser();
        $authResult = $authUserInstance->auth();
        $this->ajaxReturn(json_encode($authResult),'EVAL');
    }

    /**
     * 保存客服端的键值对数据（其他地方这个接口有时候渲染到页面userId会丢失）
     */
    public function saveStoreDataAction()
    {
        $retStoreData = ActivityManager::saveStoreData($_REQUEST['key'] . MasterManager::getUserId(), $_REQUEST['value']);
        $this->ajaxReturn($retStoreData);
    }

    /**
     * 更新各导航页面是否显示新手指导内容
     */
    public function updateNoviceGuideAction(){
        $navigationId = $_REQUEST['key'];
        $isShowGuide = $_REQUEST['value'];
        $userId = $_REQUEST['userId'];
        $noviceGuideInfo = json_decode(StoreAPI::queryStoreData(StoreAPI::$DATA_NOVICE_GUIDE . "_$userId"));
        $noviceGuideObj = json_decode($noviceGuideInfo->val,true);
        $noviceGuideObj[$navigationId] = $isShowGuide;
        StoreAPI::saveStoreData(StoreAPI::$DATA_NOVICE_GUIDE . "_$userId",json_encode($noviceGuideObj));
        $result = array(
            "result"=> 0,
            "message" => "update success!"
        );
        $this->ajaxReturn(json_encode($result));
    }



    //订购成功后，添加电话号码
    public function orderSuccessToAddTelAction()
    {
        $orderId = $_POST['orderId'];
        $tel = $_POST['tel'];
        $ret = UserAPI::orderSuccessToAddTel($tel, $orderId);
        $this->ajaxReturn($ret, "EVAL");
    }

    /**
     * @Brief:此函数用于查询用户是否为VIP
     * @return false|string : isvip （1--是vip, 0--不是vip）
     */
    public function queryUserIsVipAction()
    {
        $isVip = MasterManager::getUserIsVip();

        return json_encode(array(
            'isVip' => $isVip,
        ));
    }

    /**
     * 拉取启动推荐配置
     */
    public function getEntryRecommendInfoAction()
    {

        $ret = SystemAPI::getEntryRecommendInfo();

        if ($ret->result != 0) {
            $ret = json_encode(array(
                "result" => -1,
            ));
        }

        $this->ajaxReturn($ret, "EVAL");
    }

    /**
     * 拉取预约挂号账号信息
     */
    public function getUserAppointmentInfoAction()
    {
        $ret = UserAPI::getUserAppointmentInfo();
        $this->ajaxReturn($ret, "EVAL");
    }

    //    获取短信验证码
    public function getIdentifyingCodeAction()
    {
        $user_tel = $_REQUEST['user_tel'];
        $send_sms = $_REQUEST['send_sms'];
        $result = UserAPI::getIdentifyingCode($user_tel,$send_sms);
        $this->ajaxReturn($result, "EVAL");
    }

    /**
     * 保存安徽移动怡伴鉴权信息
     */
    public function saveStoreAuthCallbackParamAction()
    {
        $param = $_POST['param'];
        MasterManager::setAnhuiAuthCallbackParam($param);
        $ret = json_encode(array(
            "result" => 0,
        ));
        $this->ajaxReturn($ret, "EVAL");
    }

    /**
     * 存储用户通过验证的电话
     */
    public function setCheckedPhoneAction()
    {
        $phone = $_REQUEST['phone'];
        $measureNotifyPhone = $_REQUEST['measureNotifyPhone'];
        $ret = UserAPI::setCheckedPhone($phone, $measureNotifyPhone);
        $this->ajaxReturn($ret, "EVAL");
    }

    /**
     * 查询用户通过验证的电话
     */
    public function getCheckedPhoneAction()
    {
        $ret = UserAPI::getCheckedPhone();
        $this->ajaxReturn($ret, "EVAL");
    }

    //获取盒子相关数据
    public function getBoxInterDataAction()
    {
        $boxId = $_REQUEST['boxId'];
        $result = UserAPI::boxInterDataCollect(2,$boxId,"","",0,"","");
        $this->ajaxReturn($result, "EVAL");
    }
}
