<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;
use Home\Model\Common\Utils;

class InitAction000051 implements InitAction
{

    // 河南瀑布流2号位
    const HENAN_ENTRY_POSITION_2 = 87;

    // 中国联通地区映射表
    private $CHINAUNICOM_AREA_CODE_TABLE;

    // 获取userId的地区列表
    private $GET_USER_ID_FROM_URL_AREAS;

    // epg信息
    private $epgInfoMap;

    public function __construct()
    {
        // 获取中国联通地区映射表
        $this->CHINAUNICOM_AREA_CODE_TABLE = $area_code_table = eval(CHINAUNICOM_AREA_CODE_TABLE);
        // 账户获取为空的地区列表的处理方案
        $this->GET_USER_ID_FROM_URL_AREAS = array($area_code_table["HENAN"], $area_code_table["SHANXI"], $area_code_table["TIANJIN"], $area_code_table["SHANDONG"],
             $area_code_table["HEILONGJIANG"], $area_code_table["HUNAN"], $area_code_table["LIAONING"], $area_code_table["GUIZHOU"],
            $area_code_table["HUBEI"], $area_code_table["INNER_MONGOLIA"], $area_code_table["BEIJING"]);
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        // 解析区域码
        $areaCode = $this->parseAreaCode($epgInfoMap);
        // 中国联通TV中心-山东联通入口参数
        if ($areaCode == $this->CHINAUNICOM_AREA_CODE_TABLE['SHANDONG'] && empty($epgInfoMap['UserID'])) {
            $ShanDongEPGInfoMap = $this->getShanDongEPGInfoMap();
            $IPTVValue = $ShanDongEPGInfoMap['backurl'];
            if(empty($IPTVValue)){
                $IPTVValue = $ShanDongEPGInfoMap['backUrl'];
            }
            if ($IPTVValue == "{userid}" || $IPTVValue == "{userId}") {
                LogUtils::info("InitAction000051 ---> init:  " . implode(',', $this->epgInfoMap));
                throw_exception("用户信息有误");
            }
            $epgInfoMap = array_merge($epgInfoMap, $ShanDongEPGInfoMap);
            $epgInfoMap['ReturnUrl'] = $IPTVValue;
        }

        // 对解析的UserID做判断
        if ($epgInfoMap['UserID']) {
            /**
             * 中国联通如果平台标识存在，已传入的平台标识为准
             * 内蒙省份EPG系统不能高清视频，不以他们的高清参数为准。
             */
            $resolution = $epgInfoMap['resolution'];
            if ($areaCode != $this->CHINAUNICOM_AREA_CODE_TABLE["INNER_MONGOLIA"] && $resolution) {
                MasterManager::setPlatformType($resolution);
            }
        } else {
            $epgInfoMap = $this->handleAccountEmpty($areaCode, $epgInfoMap);
        }

        // 保存参数
        $epgInfoMap['areaCode'] = $areaCode;

        // 设置局方大厅返回链接
        $epgInfoMap["ReturnUrl"] = $epgInfoMap["ReturnUrl"] ? $epgInfoMap["ReturnUrl"] : $epgInfoMap["HomeUrl"];
        if(CARRIER_ID == CARRIER_ID_CHINAUNICOM_MOFANG && empty($epgInfoMap["ReturnUrl"])){
            $epgInfoMap["ReturnUrl"] = $_GET['returnUrl'];
        }

        $this->saveParams($epgInfoMap);

        return $epgInfoMap;
    }

    /**
     * 通过链接参数提取相关信息参数
     */
    function getEPGInfoMap()
    {
        LogUtils::info("user INFO====> " . json_encode($_GET));
        $epgInfoMapParams = array(
            'lmacid' => '', 'carrierId' => '', 'CarrierID' => '', 'loginID' => '', 'tvPlatForm' => '',
            'type' => '', 'resolution' => '', 'feeAccoutCode' => '', 'UserToken' => '', 'StbVendor' => '',
            'BuyWebUrl' => '', 'BuyService' => '', 'RechargeUrl' => '', 'PlatformExt' => '', 'HomeUrl' => '',
            'ReturnUrl' => '', 'UserID' => '', 'lmp' => -1);
        $epgInfoMap = URLUtils::parseURLInfo($epgInfoMapParams);
        $epgInfoMap["userIP"] = get_client_ip(); // 由于客户端没有传ip过来，所以只能读取
        //传入参数UserID，大小写不一样
        if(empty($epgInfoMap["UserID"])){
            $epgInfoMap["UserID"] = $_GET['UserId'];
        }
        //防止注入攻击
        if (!is_numeric($epgInfoMap["lmp"])) {
            $epgInfoMap["lmp"] = "0";
        }
        if (strpos($epgInfoMap["lmacid"], '?') !== false) {
            $epgInfoMap["lmacid"] = str_replace("?","",$epgInfoMap["lmacid"]);;
        }
        return $epgInfoMap;
    }

    /**
     * 山东地区的EPG信息参数
     */
    private function getShanDongEPGInfoMap()
    {
        $SDParamsArray = array('iptv' => '', 'stbmodel' => '', 'platform' => '', 'backurl' => '', 'backUrl' => '');
        return URLUtils::parseURLInfo($SDParamsArray, URLUtils::GET_REQUEST_TYPE, false);
    }

    /**
     * 提取中国联通地区码
     * @param array $epgInfoMap 获取的EPG信息的参数
     */
    private function parseAreaCode($epgInfoMap)
    {
        // 切割地区码的字符串长度
        $areaCodeStrLength = 3;

        $carrierId = $epgInfoMap['carrierId'] ? $epgInfoMap['carrierId'] : $epgInfoMap['CarrierID'];
        $accountId = $epgInfoMap['UserID'];
        $areaCode = $carrierId;

        // 从业务帐号后面截取carrierId，如：0852133456_201 ===> 201
        if (!$areaCode && !empty($accountId)) {
            $idx = strripos($accountId, '_');
            if ($idx && ($idx > 0)) {  // 判断能读到业务帐号后面的内容
                $areaCode = substr($accountId, $idx + 1, $areaCodeStrLength);
                LogUtils::info("=====> get areaCode[ $areaCode ] from account= $accountId");
            }
        }

        if (!Utils::isTianJinSpecialEntry()) { // 非天津联通地区
            if ($epgInfoMap["lmp"] == self::HENAN_ENTRY_POSITION_2) {  // 河南瀑布流2号位
                $areaCode = $this->CHINAUNICOM_AREA_CODE_TABLE["HENAN"];
                $epgInfoMap['UserID'] = $_GET['userId'];
            }
        } else { // 天津地区，局方不传carrierId，在业务帐号也没有_xxx，由默认用户为天津地区用户，areaCode为201
            $areaCode = $areaCode ? $areaCode : $this->CHINAUNICOM_AREA_CODE_TABLE["TIANJIN"];
        }

        // 判断areaCode值，如果$areaCode为空，则取lmacid（lm area code id）的值
        $areaCode = ($areaCode ? $areaCode : $epgInfoMap["lmacid"]);

        return $areaCode;
    }

    /**
     * 处理EPG信息参数中不含account的情况
     * @param string $areaCode 地区码
     * @param array $epgInfoMap EPG信息参数
     */
    private function handleAccountEmpty($areaCode, $epgInfoMap)
    {
        if (in_array($areaCode, $this->GET_USER_ID_FROM_URL_AREAS)) {
            // 记录日志
            LogUtils::error("InitAction000051 ---> init 没有传递EPG用户信息:  " . implode(',', $epgInfoMap));
            //TV中心 - 山西地区新EPG平台
            $accountId = $_GET['userId'];
            $pushLMP = strstr($epgInfoMap['lmp'], '?');
            if ($pushLMP) {
                $epgInfoMap['lmp'] = '251';
                MasterManager::setEnterPosition('251');
                $accountId = substr(strstr($pushLMP, '='), 1);
            }

            // 山东地区业务账号保存
            if ($areaCode == $this->CHINAUNICOM_AREA_CODE_TABLE['SHANDONG']) {
                $accountId = $accountId ? $accountId : $_GET['iptv'];
            }

            // 对帐号进行保护
            if (!empty($accountId)) {
                $tail = "_" . $areaCode;
                if (substr_compare($accountId, $tail, -strlen($tail)) !== 0) {
                    $accountId = $accountId . $tail;
                }
            }

            $epgInfoMap['UserID'] = $accountId;
            $epgInfoMap['backurl'] = isset($_GET['backurl']) ? $_GET['backurl'] : "";
        } else if ($areaCode == '251') {
            $epgInfoMap['UserID'] = $_GET['userId'];
            $epgInfoMap['ReturnUrl'] = $epgInfoMap['ReturnUrl'] ? $epgInfoMap['ReturnUrl'] : $_GET['returnUrl'];
        } else {
            throw_exception("用户信息有误");
        }
        return $epgInfoMap;
    }

    function saveParams($epgInfoMap)
    {
        //将UserID 作为业务账号
        MasterManager::setAccountId($epgInfoMap['UserID']);
        //设置区域码
        MasterManager::setAreaCode($epgInfoMap['areaCode']);
        // 局方大厅返回链接
        MasterManager::setIPTVPortalUrl($epgInfoMap["ReturnUrl"]);

        // 判断局方的返回地址是否存在，如果不存在，则写入cookie，存在了就不再更新
        $tmpReturnUrl = MasterManager::getEPGHomeURL();
        if (!$tmpReturnUrl) {
            MasterManager::setEPGHomeURL($epgInfoMap["ReturnUrl"]);
        }

        MasterManager::setEPGInfoMap($epgInfoMap);
        MasterManager::setUserToken($epgInfoMap["UserToken"]);
    }
}