<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/11/30
 * Time: 17:59
 */

namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Home\Model\Entry\MasterManager;

class UserAPI
{

    /**
     * 用户注册、登录、管理后台鉴权等操作
     * @param $userAccount string 用户账号
     * @param $vipState int 局方鉴权VIP状态·
     * @param $isSyncVipState int 是否同步LWS端鉴权接口
     * @return mixed
     */
    public static function authUser($userAccount, $vipState, $isSyncVipState)
    {
        // 获取盒子MAC地址
        $STBId = MasterManager::getSTBMac();
        // 盒子分辨率 1 -- 高清，0 -- 标清
        $resolution = MasterManager::getPlatformType() == 'hd' ? 1 : 0;
        // 局方入口对应进入模块
        $enterType = MasterManager::getUserFromType();
        $enterType = $enterType ? $enterType : 0;

        $password = $userAccount; // 为了避免用户的密码一致，使用业务帐号来当密码

        // 某些地区需要传递地区编码 -- 一级（中国联通）/二级分区
        $areaCode = MasterManager::getAreaCode();
        // 某些地区三级划分
        $subAreaCode = MasterManager::getSubAreaCode();

        $params = array(
            'user_account' => $userAccount,   // 用户账号
            'account_type' => ACCOUNT_TYPE,   //账号类型  - 1: 业务账号类型 0: 电话号码
            'combined_device_id' => $STBId,
            'platform_type' => $resolution,
            'entry_type' => $enterType,
            'passwd' => md5(md5($password)),// 双重md5加密
            'area_code' => $areaCode,
            'sub_area_code' => $subAreaCode,
            'sync_vip' => (int)$vipState,
            'is_sync_vip' => $isSyncVipState, // 是否需要同步CWS后端vip状态，is_sync_vip, 0 -- 不同步cws的vip状态；1 -- 需要同步CWS的vip状态
        );

        if (CARRIER_ID === CARRIER_ID_GUANGXIGD) { // 广西广电添加机顶盒号
            $stbId = MasterManager::getSTBId();
            if ($stbId) {
                $params['bind_account'] = MasterManager::getSTBId();;
            }
        } else if (CARRIER_ID === CARRIER_ID_GUANGDONGGD) { // 广东广电绑定智能卡号
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $cardId = $epgInfoMap["cardId"];
            if ($cardId) {
                $params['ca_no'] = $cardId;
            }
        } else if (CARRIER_ID === CARRIER_ID_GUANGDONGGD_NEW) { // 广东广电NEW绑定智能卡号
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $cardId = $epgInfoMap["client"];
            if ($cardId) {
                $params['ca_no'] = $cardId;
            }
        }

        $http = new HttpManager(HttpManager::PACK_ID_AUTH_USER);
        return $http->requestPost($params);

    }

    /**
     * 用户注册
     * @param $accountId
     * @param $accountType
     * @param $stbId
     * @return mixed
     */
    static public function userReg($accountId, $accountType, $stbId)
    {
        //封装请求参数
        $platformType = MasterManager::getPlatformType() === "hd" ? 1 : 0;
        $subAreaCode = MasterManager::getSubAreaCode() ? MasterManager::getSubAreaCode() : "";

        //设置请求参数
        $json = array(
            "user_account" => $accountId,
            "account_type" => $accountType,
            "combined_device_id" => $stbId,
            "platform_type" => $platformType,
            "passwd" => '123456',
            "msg_code" => '0000',
            "area_code" => MasterManager::getAreaCode(),
            "sub_area_code" => $subAreaCode,
        );
        //执行请求
        $http = new HttpManager(HttpManager::PACK_ID_REG);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * 用户登录
     * @param $userId  用户id
     * @return mixed  返回登录结果
     */
    static public function userLogin($userId, $sessionId, $accountType)
    {
        $platformType = MasterManager::getPlatformType() == "hd" ? 1 : 0;
        $entryType = MasterManager::getUserFromType() ? MasterManager::getUserFromType() : 0;
        $stbMac = MasterManager::getSTBMac() ? MasterManager::getSTBMac() : "";
        $subAreaCode = MasterManager::getSubAreaCode() ? MasterManager::getSubAreaCode() : "";

        $json = array(
            "account_type" => $accountType ? $accountType : 1,
            "combined_device_id" => $stbMac,
            "platform_type" => $platformType,
            "entry_type" => $entryType,
            "area_code" => MasterManager::getAreaCode(),
            "sub_area_code" => $subAreaCode,
        );

        if (CARRIER_ID === CARRIER_ID_GUANGXIGD) {
            // 广西广电添加机顶盒号
            $stbId = MasterManager::getSTBId();
            if ($stbId) {
                $json['bind_account'] = $stbId;
            }
        } else if (CARRIER_ID === CARRIER_ID_GUANGDONGGD) {
            // 广东广电绑定智能卡号
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $cardId = $epgInfoMap["cardId"];
            if ($cardId) {
                $json['ca_no'] = $cardId;
            }
        } else if (CARRIER_ID === CARRIER_ID_GUANGDONGGD_NEW) {
            // 广东广电NEW绑定智能卡号
            $epgInfoMap = MasterManager::getEPGInfoMap();
            $cardId = $epgInfoMap["client"];
            if ($cardId) {
                $json['ca_no'] = $cardId;
            }
        }

        //执行请求
        $http = new HttpManager(HttpManager::PACK_ID_LOGIN);
        $http->setUserId($userId);
        $http->setSessionId($sessionId);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * 校验用户VIP信息
     *
     * @param $userId
     * @param $accountType
     * @return mixed
     */
    static public function verifyVIP($userId, $accountType = 1)
    {
        $json = array(
            "account_type" => $accountType ? $accountType : 1,
            "user_id" => $userId,
            "carrier_id" => CARRIER_ID,
        );

        $http = new HttpManager(HttpManager::PACK_ID_IS_VIP);
        $result = $http->requestPost($json);
        return $result;
    }

    /**
     * 校验用户VIP信息
     *
     * @param $userId
     * @param $accountType
     * @return mixed
     */
    static public function getUserGroupTypeFun($userId)
    {
        $json = array(
            "user_account" => $userId,
        );

        $http = new HttpManager(HttpManager::PACK_ID_GET_USER_GROUP_TYPE);
        $result = $http->requestPost($json);
        return json_decode($result);
    }


    /**
     * 获取VIP的类型
     * @param $userId
     * @return mixed
     */
    static public function getVipType($userId)
    {
        $json = array();

        $http = new HttpManager(HttpManager::PACK_ID_IS_VIP);
        $http->setUserId($userId);

        $result = $http->requestPost($json);
        return json_decode($result);
    }

    /**
     * 获取VIP的类型
     * @param $userId
     * @return mixed
     */
    static public function queryVipInfo($userId)
    {
        $json = array();

        $http = new HttpManager(HttpManager::PACK_ID_QUERY_VIP_INFO);
        $http->setUserId($userId);

        $result = $http->requestPost($json);
        return json_decode($result);
    }


    /**
     *  购买vip套餐第三方支付成功后，添加联系电话
     * @param $tel  电话号码
     * @param $orderId 订单id
     * @return mixed
     */
    static public function orderSuccessToAddTel($tel, $orderId)
    {
        $json = array(
            "order_id" => $orderId,
            "user_tel" => $tel
        );
        $http = new HttpManager(HttpManager::PACK_ID_ORDER_SUCCESS_ADD_TEL);
        $result = $http->requestPost($json);
        return $result;
    }

    /**
     * 用户验证码校验
     * @param $userTel
     * @param $msgCode
     * @return mixed
     */
    static public function verifyUserCode($userTel, $msgCode, $msgType)
    {
        $json = array(
            "user_tel" => $userTel,
            "msg_code" => $msgCode,
            "type" => $msgType,
        );

        $http = new HttpManager(HttpManager::PACK_ID_VERIFY_USER_CODE);

        $result = $http->requestPost($json);
        return json_decode($result);
    }/**
     * H5获取验证码校验
     * @param  string $user_tel 用户电话号码
     * @param string $send_sms 是否下发验证码
     */
    static public function getIdentifyingCode($user_tel,$send_sms)
    {
        $json = array(
            "user_tel" => $user_tel,
            "send_sms"=>$send_sms
        );

        $http = new HttpManager(HttpManager::PACK_GET_IDENTIFYING_CODE);

        $result = $http->requestPost($json);
        return $result;
    }

    /**
     * 判断用户是否是测试用户
     * @param $userId
     * @return mixed
     */
    static public function isTestUser($userId)
    {
        $json = array(
            "type" => 1,
        );

        $http = new HttpManager(HttpManager::PACK_ID_IS_TESTUSER);
        $http->setUserId($userId);

        $result = $http->requestPost($json);
        return json_decode($result);
    }

    /**
     * 判断用户是否是黑名单用户
     * @param $verifyType
     * @return mixed
     */
    static public function isBlacklistUser($verifyType)
    {
        $json = array(
            "user_account" => MasterManager::getAccountId(),
            "forbid_type" => $verifyType
        );

        $http = new HttpManager(HttpManager::PACK_ID_QUERY_BLACKLIST_VERIFY);

        $result = $http->requestPost($json);
        return json_decode($result);
    }

    /**
     * 更新用户类型为vip
     * @param $userId
     * @return mixed
     */
    static public function updateUserVip($userId)
    {
        $json = array();

        $http = new HttpManager(HttpManager::PACK_ID_REG_VIP);
        $http->setUserId($userId);

        $result = $http->requestPost($json);
        return json_decode($result);
    }

    /**
     * @Brief:此函数用于绑定手机号码或宽带账号
     * @param: $phoneNumber 用户手机号码
     * @return: $result 绑定结果
     */
    public static function bindUserAccount($phoneNumber)
    {
        // account_type 绑定类型（0手机号 1宽带账号）
        $json = array(
            'bind_account' => $phoneNumber,
            'account_type' => 0
        );
        $http = new HttpManager(HttpManager::PACK_ID_BIND_USER_ACCOUNT);

        $result = $http->requestPost($json);
        return $result;
    }

    /**
     * @Brief:此函数用于查询绑定的手机号码或宽带账号
     * @return: $result 查询绑定结果
     */
    public static function queryBindUserAccount()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_QUERY_BIND_USER_ACCOUNT);

        $result = $http->requestPost($json);
        return $result;
    }

    /**
     * @Brief:获取vip信息
     */
    public static function  getVipInfo()
    {
        $json = array();
        $packId = HttpManager::PACK_ID_GET_VIP_INFO;
        if (MasterManager::getCarrierId() === CARRIER_ID_GUIZHOUGD) {
            $packId = HttpManager::PACK_ID_QUERY_VIP_INFO;
        }
        $http = new HttpManager($packId);

        $result = $http->requestPost($json);
        return $result;
    }

    /**
     * @Brief:此函数用于查询是否显示童锁状态 0-- 没有开启童锁，1-- 开启童锁
     */
    public static function queryShowPayLockStatus()
    {
        $status = 0;
        $areaCode = MasterManager::getAreaCode();
        $subAreaCode = MasterManager::getSubAreaCode();

        $json = array(
            'area_code' => $areaCode ? $areaCode : "",
            'sub_area_code' => $subAreaCode ? $subAreaCode : ""
        );
        $http = new HttpManager(HttpManager::PACK_ID_SHOW_PAY_LOCK);

        $result = $http->requestPost($json);
        $result = json_decode($result);
        if ($result->result == 0) {
            $data = $result->data;
            $status = $data->kids_lock;
        }
        return $status;
    }

    /**
     * @param $type
     * @param $value
     * @return mixed
     */
    public static function setUserStatus($type, $value)
    {
        $json = array(
            "status_type" => $type,
            "status_value" => $value
        );
        $http = new HttpManager(HttpManager::PACK_ID_SET_USER_STATUS);

        $result = $http->requestPost($json);
        return $result;
    }

    /**
     * 拉取我的收藏列表
     * @param $itemType //收藏对象类型（1 药品 2 疾病 3 症状 4健康自测项目）
     * @param $currentPage //当前页码，从1开始
     * @param $pageNum //拉取数据条数，大于0的整数。默认每页拉取6条数据。
     * @return mixed
     */
    public static function getCollectList($itemType, $currentPage, $pageNum = 6)
    {
        $json = array(
            'item_type' => $itemType,
            'current_page' => $currentPage,
            'page_num' => $pageNum,
        );
//        $http = new HttpManager(HttpManager::PACK_ID_USER_GET_MY_COLLECTION_LIST);
        $http = new HttpManager(HttpManager::PACK_ID_COLLECT_LIST);
        $result = $http->requestPost($json); //result: 0成功 其他失败
        return $result;
    }

    /**
     新疆电信查询用户预约挂号账号信息
     * @param $userId
     * @return mixed
     */
    static public function getUserAppointmentInfo()
    {
        $json = array();
        $http = new HttpManager(HttpManager::PACK_ID_APPOINTMENT_INTERFACE);
        $result = $http->requestPost($json);

        return $result;
    }

    /**
     * 存储用户通过验证的电话
     * @param $phone 用户电话（新增时该字段不能为空）
     * @param $measure_notify_phone 健康检测短信提示电话
     * @return mixed
     */
    public function setCheckedPhone($phone, $measureNotifyPhone)
    {
        $json = array(
            "carrierId"=>MasterManager::getCarrierId(),
            "userId"=>MasterManager::getUserId(),
            'phone' => $phone,
            'measure_notify_phone' => $measureNotifyPhone,
        );
        $http = new HttpManager(HttpManager::PACK_ID_SET_CHECKED_PHONE);
        return $http->requestPost($json);
    }

    /**
     * 存储用户通过验证的电话
     * @return mixed
     */
    public function getCheckedPhone()
    {
        $json = array(
            "carrierId"=>MasterManager::getCarrierId(),
            "userId"=>MasterManager::getUserId(),
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_CHECKED_PHONE);
        return $http->requestPost($json);
    }

    public static function boxInterDataCollect($type, $boxId,$userAccount,$userToken,$isVip,$backUrl,$priceUrl)
    {
        $json = array(
            "type" => $type, //1：盒子数据上报 2：获得盒子数据
            "boxId" => $boxId,
            "userAccount" => $userAccount,
            "userToken" => $userToken,
            "isVip" => $isVip,
            "backUrl" => $backUrl,
            "priceUrl" => $priceUrl,
        );
        $http = new HttpManager(HttpManager::PACK_ID_GET_BOX_INTER_DATA);

        $result = $http->requestPost($json);
        return $result;
    }
}