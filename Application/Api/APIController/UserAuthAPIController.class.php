<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Brief: 此接口用于提供外部调用鉴权接口
 * Date: 2019/11/19
 * Time: 18:34
 */

namespace Api\APIController;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Order\OrderManager;

class UserAuthAPIController
{
    /**
     * @Brief:此函数用于访问鉴权接口
     */
    public function userAuthAction() {
        $isVip = 0;
        $result = array("result"=> -1, "message"=> "param carrierId is null");
        LogUtils::info("userAuth param: " . $_REQUEST['userInfo']);
        $userInfo = json_decode($_REQUEST['userInfo']);

        $lmcid = $userInfo->lmcid  ? $userInfo->lmcid : CARRIER_ID;
        if (empty($lmcid)) {
            echo json_encode($result);
            exit(0);
        }

        $instance = OrderManager::getInstance($lmcid);
        if (!$instance) {
            $result['message'] =  "not support auth";
            echo json_encode($result);
            exit(0);
        }

        switch ($lmcid) {
            case CARRIER_ID_CHINAUNICOM:
                $isVip = $this->authentication000051($userInfo, $instance);
                break;
            case CARRIER_ID_CHINAUNICOM_APK:
                $isVip = $this->authentication000006($userInfo, $instance);
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG:
                $isVip = $this->authentication10000051($userInfo, $instance);
                break;
            case CARRIER_ID_NINGXIAGD:
                $isVip = $this->authentication000051($userInfo, $instance);
                break;
            case CARRIER_ID_XINJIANGDX:
                $isVip = $this->authentication650092($userInfo, $instance);
                break;
            case CARRIER_ID_QINGHAIDX:
                $isVip = $this->authentication630092($userInfo, $instance);
                break;
            case CARRIER_ID_JIANGSUDX:
                $isVip = $this->authentication320092($userInfo, $instance);
                break;
            case CARRIER_ID_HUBEIDX:
                $isVip = $this->authentication420092($userInfo, $instance);
                break;
            case CARRIER_ID_HENANDX:
                $isVip = $this->authentication410092($userInfo, $instance);
                break;
            case CARRIER_ID_GUANGXIDX:
                $isVip = $this->authentication450092($userInfo, $instance);
                break;
            case CARRIER_ID_NINGXIADX:
                $isVip = $this->authentication640092($userInfo, $instance);
                break;
            case CARRIER_ID_JIANGXIDX:
                $isVip = $this->authentication360092($userInfo, $instance);
                break;
            case CARRIER_ID_HAINANDX:
                $isVip = $this->authentication460092($userInfo, $instance);
                break;
            case CARRIER_ID_SHANDONGDX:
                $isVip = $this->authentication370092($userInfo, $instance);
                break;
            case CARRIER_ID_GUIZHOUDX:
                $isVip = $this->authentication520092($userInfo, $instance);
                break;
            case CARRIER_ID_GUIZHOUGD_XMT:
                $isVip = $this->authentication520095($userInfo, $instance);
                break;
            case CARRIER_ID_JILINGDDX:
                $isVip = $this->authentication220095($userInfo, $instance);
                break;
            case CARRIER_ID_XINJIANGDX_TTJS:
                $isVip = $this->authentication12650092($userInfo, $instance);
                break;
            case CARRIER_ID_JILINGD_MOFANG:
                $isVip = $this->authentication10220094($userInfo, $instance);
                break;
            case CARRIER_ID_GUANGDONGGD:
            case CARRIER_ID_GUANGDONGGD_NEW:
                $isVip = $this->authentication440094($userInfo, $instance);
                break;
            case CARRIER_ID_GANSUDX:
                $isVip = $this->authentication620092($userInfo, $instance);
                break;
            case CARRIER_ID_MANGOTV_LT:
                $isVip = $this->authentication07430093($userInfo, $instance);
                break;
            case CARRIER_ID_HUNANDX:
                $isVip = $this->authentication430002($userInfo, $instance);
                break;
            case CARRIER_ID_SHANDONGDX_APK:
                $isVip = $this->authentication370002($userInfo, $instance);
                break;
            case CARRIER_ID_XIZANG_YD:
                $isVip = $this->authentication540001($userInfo, $instance);
                break;
            case CARRIER_ID_GANSUYD:
                $isVip = $this->authentication620007($userInfo, $instance);
                break;
            case CARRIER_ID_QINGHAI_YD:
                $isVip = $this->authentication630001($userInfo, $instance);
                break;
            case CARRIER_ID_JILIN_YD:
                $isVip = $this->authentication220001($userInfo, $instance);
                break;
            case CARRIER_ID_JILINGD:
                $isVip = $this->VipStateVerif220094($userInfo, $instance);
                break;
            case CARRIER_ID_SHANXIDX:
                $isVip = $this->authentication610092($userInfo, $instance);
                break;
        }

        $result['result'] = $isVip;
        $result['message'] = $isVip == 1 ? "user is vip" : "user is not vip";
        $resultJson = json_encode($result);
        LogUtils::info("userAuth result: " . $resultJson);
        echo $resultJson;
    }


    /**
     * @brief: 中国联通
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication000051($userInfo, $instance) {
        $isVip = 0;
        $areaCode = $userInfo->areaCode;
        $accountId = $userInfo->accountId;
        $entryPos = $userInfo->entryPos;
        MasterManager::setAreaCode($areaCode);
        MasterManager::setAccountId($accountId);
        MasterManager::setUserToken($accountId);
        MasterManager::setEnterPosition($entryPos);

        $authInfo = $instance->authentication();
        if ($authInfo != null && $authInfo->result == 0) {
            //鉴权成功，表示用户是订购过的
            $isVip = 1;
        }

        if ($isVip != 1 && $areaCode == 201) {
            MasterManager::setPlatformTypeExt("hd-5");
            $authInfo = $instance->authentication();
            if ($authInfo != null && $authInfo->result == 0) {
                //鉴权成功，表示用户是订购过的
                $isVip = 1;
            }
        }

        return $isVip;
    }

    /**
     * @brief: 中国联通
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication000006($userInfo, $instance) {
        $isVip = 0;
        $areaCode = $userInfo->areaCode;
        $accountId = $userInfo->accountId;
        $entryPos = $userInfo->entryPos;
        MasterManager::setAreaCode($areaCode);
        MasterManager::setAccountId($accountId);
        MasterManager::setUserToken($accountId);
        MasterManager::setEnterPosition($entryPos);

        $authInfo = $instance->authentication();
        if ($authInfo != null && $authInfo->result == 0) {
            //鉴权成功，表示用户是订购过的
            $isVip = 1;
        }

        if ($isVip != 1 && $areaCode == 201) {
            MasterManager::setPlatformTypeExt("hd-5");
            $authInfo = $instance->authentication();
            if ($authInfo != null && $authInfo->result == 0) {
                //鉴权成功，表示用户是订购过的
                $isVip = 1;
            }
        }

        return $isVip;
    }


    /**
     * @brief: 中国联通
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication10000051($userInfo, $instance) {
        $isVip = 0;
        $areaCode = $userInfo->areaCode;
        $accountId = $userInfo->accountId;
        $entryPos = $userInfo->entryPos;
        MasterManager::setAreaCode($areaCode);
        MasterManager::setAccountId($accountId);
        MasterManager::setUserToken($accountId);
        MasterManager::setEnterPosition($entryPos);

        $authInfo = $instance->authentication();
        if ($authInfo != null && $authInfo->result == 0) {
            //鉴权成功，表示用户是订购过的
            $isVip = 1;
        }

        if ($isVip != 1 && $areaCode == 201) {
            MasterManager::setPlatformTypeExt("hd-5");
            $authInfo = $instance->authentication();
            if ($authInfo != null && $authInfo->result == 0) {
                //鉴权成功，表示用户是订购过的
                $isVip = 1;
            }
        }

        return $isVip;
    }

    /**
     * @brief: 新疆电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication650092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $isVip = $instance->authentication();

        return $isVip;
    }

    /**
     * @brief: 新疆电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication12650092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $isVip = $instance->authentication();

        return $isVip;
    }

    /**
     * @brief: 青海电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication630092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        // 用视频信息去鉴权
        $videoInfo = new \stdClass();
        $videoInfo->videoUrl = "Program1004308";
        $videoInfo->title = "多发性骨髓瘤不化疗可以吗";
        $videoInfo->imageUrl = RESOURCES_URL . "/imgs/630092/video/20190709/zsjl4308.png";

        $isVip = $instance->authenticationEx($videoInfo);
        return $isVip;
    }

    /**
     * @brief: 江苏电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication320092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $epgInfoMap["key"] = "0:2";
        $epgInfoMap["userToken"] = $accountId;
        MasterManager::setEPGInfoMap($epgInfoMap);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 湖北电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication420092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $epgInfoMap["userToken"] = $accountId;
        MasterManager::setEPGInfoMap($epgInfoMap);
        MasterManager::setUserToken($accountId);
        $isVip = $instance->authentication();
        if($userInfo->source == "ksd" && $isVip == 0){
            $isVip = $instance->performAuthIdentity($userInfo->productId);
            if($isVip == 0){
                $res = PayAPI::getExtActivityVerif();
                LogUtils::info("authentication420092->res:".json_encode($res));
                $isVip = $res->result;
            }
        }
        return $isVip;
    }

    /**
     * @brief: 河南电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication410092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $epgInfoMap["key"] = "0:2";
        $epgInfoMap["userToken"] = $accountId;
        MasterManager::setEPGInfoMap($epgInfoMap);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 广西电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication450092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);
        MasterManager::setUserToken($accountId);

        // 广西电信要两次鉴权，先鉴权小包，再鉴权大包
        $isVip = $instance->authentication(array("SPID" => SPID_SMALL), PRODUCT_ID_18);
        if ($isVip != 1) {
            $isVip = $instance->authentication(array("SPID" => SPID_LARGE), PRODUCT_ID_LIFE);
        }

        return $isVip;
    }

    /**
     * @brief: 宁夏电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication640092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $epgInfoMap["key"] = "0:2";
        $epgInfoMap["userToken"] = $accountId;
        MasterManager::setEPGInfoMap($epgInfoMap);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 江西电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication360092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $epgInfoMap["key"] = "0:2";
        $epgInfoMap["userToken"] = $accountId;
        MasterManager::setEPGInfoMap($epgInfoMap);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 海南电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication460092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 山东电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication370092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);
        MasterManager::setUserToken($accountId);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 贵州电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication520092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 贵州电信新媒体
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication520095($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 吉林广电（电信）
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication220095($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $isVip = $instance->authentication();
        return $isVip;
    }
    /**
     * @brief: 吉林广电（联通）
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication10220094($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 广东广电
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication440094($userInfo, $instance) {
        $isVip = 0;
        $payInfo = new \stdClass();
        $payInfo->authUrl = USER_ORDER_URL . QUERY_ORDER_FUNC;//鉴权地址
        $payInfo->providerId = providerId;
        $payInfo->devNo = $userInfo->accountId;
        $payInfo->productId = productId_month;
        $payInfo->timeStamp = date("YmdHis");
        $payInfo->key = key;
        $text = "devNo=" . $payInfo->devNo . "&providerId=" . $payInfo->providerId . "&productId=" . $payInfo->productId . "&timeStamp=" . $payInfo->timeStamp . "&key=" . $payInfo->key;
        LogUtils::info("_buildPayUrl authentication ---> sign text : " . $text);
        $payInfo->sign = strtoupper(md5($text));

        $isVip = $instance->authentication($payInfo);
        return $isVip;
    }

    /**
     * @brief: 甘肃电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication620092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $epgInfoMap["key"] = "0:2";
        $epgInfoMap["userToken"] = $accountId;
        MasterManager::setEPGInfoMap($epgInfoMap);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 芒果联通
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication07430093($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        $userId = $userInfo->userId;
        $userToken = $userInfo->userToken;
        $mac = $userInfo->mac;
        MasterManager::setAccountId($accountId);
        MasterManager::setUserId($userId);
        MasterManager::setUserToken($userToken);
        MasterManager::setSTBMac($mac);

        $epgInfoMap["systemVersion"] = "4.4.2";
        MasterManager::setEPGInfoMap($epgInfoMap);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 湖南电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication430002($userInfo, $instance) {
        $isVip = 0;
        LogUtils::info("authentication430002:".json_encode($userInfo));
        MasterManager::setEPGInfoMap(json_encode($userInfo));
        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 山东电信
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication370002($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        $userToken = $userInfo->userToken;
        MasterManager::setAccountId($accountId);
        MasterManager::setUserToken($userToken);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 西藏移动
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication540001($userInfo, $instance) {
        $isVip = 0;
        $userInfo->loginAccount = $userInfo->accountId;
        $userInfo->snNum = $userInfo->snNum;
        $userToken = $userInfo->userToken;
        MasterManager::setApkInfo($userInfo);
        MasterManager::setUserToken($userToken);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 甘肃移动
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication620007($userInfo, $instance) {
        $isVip = 0;
        LogUtils::info("userInfo:".json_encode($userInfo));
        $info['accountIdentity'] = $userInfo->accountId;
        $info['stbid'] = $userInfo->stbid;
        $info['token'] = $userInfo->userToken;

        LogUtils::info("userInfo:".json_encode($info));
        $isVip = $instance->authentication($info);
        return $isVip;
    }

    /**
     * @brief: 青海移动
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication630001($userInfo, $instance) {
        $isVip = 0;
        $userInfo->loginAccount = $userInfo->accountId;
        $userInfo->snNum = $userInfo->snNum;
        $userToken = $userInfo->userToken;
        MasterManager::setApkInfo($userInfo);
        MasterManager::setUserToken($userToken);

        $isVip = $instance->authentication();
        return $isVip;
    }

    /**
     * @brief: 吉林广电移动
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function authentication220001($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        $isVip = $instance->authentication();
        return $isVip;
    }

    private function authentication610092($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);
        MasterManager::setUserToken($accountId);

        $isVip = $instance->authentication();

        return $isVip;
    }

    /**
     * @brief: 吉林广电联通用户校验
     * @param $userInfo 用户信息
     * @param $instance pay接口
     * @return int
     */
    private function VipStateVerif220094($userInfo, $instance) {
        $isVip = 0;
        $accountId = $userInfo->accountId;
        MasterManager::setAccountId($accountId);

        if($userInfo->source == "auth"){
            $isVip = $instance->authentication();
        }else{
            $res = PayAPI::getExtVipVerif();
            LogUtils::info("VipStateVerif220094->res:".json_encode($res));
            $isVip = $res->result;
        }

        return $isVip;
    }
}