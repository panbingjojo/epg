<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/4/13
 * Time: 上午11:10
 */

namespace Home\Model\Resource;

use Home\Model\Resource\R000051\ConstString000051;
use Home\Model\Resource\R320092\ConstString320092;
use Home\Model\Resource\R340092\ConstString340092;
use Home\Model\Resource\R370093\ConstString370093;
use Home\Model\Resource\R450092\ConstString450092;
use Home\Model\Resource\R450094\ConstString450094;
use Home\Model\Resource\R520094\ConstString520094;

class ResManager
{
    public static function getConstStringByAreaCode($areaCode, $name)
    {
        return ResManager::getConstStringByCarrierId(CARRIER_ID, $areaCode, $name);
    }

    /** 获取常量字符串
     * @param $name
     * @return string
     */
    public static function getConstString($name)
    {
        return ResManager::getConstStringByCarrierId(CARRIER_ID, "", $name);
    }

    /** 获取常量字符串
     * @param $carrierId
     * @param $areaCode
     * @param $name
     * @return string
     */
    public static function getConstStringByCarrierId($carrierId, $areaCode, $name)
    {
        $value = "";
        $tail = ($areaCode !== null && !empty($areaCode) ? "_" . $areaCode : "");
        switch ($carrierId) {
            case CARRIER_ID_CHINAUNICOM:
                $value = ConstString000051::$RES_STRING[$name . $tail];
                break;
            case CARRIER_ID_JIANGSUDX:
                $value = ConstString320092::$RES_STRING[$name . $tail];
                break;
            case CARRIER_ID_SHANDONGLT:
                $value = ConstString370093::$RES_STRING[$name . $tail];
                break;
            case CARRIER_ID_ANHUIDX:
                $value = ConstString340092::$RES_STRING[$name . $tail];
                break;
            case CARRIER_ID_GUANGXIDX:
                $value = ConstString450092::$RES_STRING[$name . $tail];
                break;
            case CARRIER_ID_GUIZHOUGD:
                $value = ConstString520094::$RES_STRING[$name . $tail];
                break;
            case CARRIER_ID_GUANGXIGD:
                $value=ConstString450094::$RES_STRING[$name . $tail];
                break;
        }
        return $value;
    }
}