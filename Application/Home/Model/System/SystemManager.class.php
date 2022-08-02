<?php

/**
 * 系统文件
 */

namespace Home\Model\System;

use Home\Model\Entry\MasterManager;

class SystemManager
{
    /**
     * 创建系统对象
     * @param $carrierId
     * @return System650092|null
     */
    public static function getInstance($carrierId = "")
    {
        $carrierId = !empty($carrierId) ? $carrierId : MasterManager::getCarrierId();
        $instance = null;
        switch ($carrierId) {
            case CARRIER_ID_XINJIANGDX:
            case CARRIER_ID_XINJIANGDX_TTJS:
                //新疆电信EPG
                $instance = new System650092();
                break;
            case CARRIER_ID_QINGHAIDX:
                //青海电信EPG
                $instance = new System630092();
                break;
            case CARRIER_ID_GUIZHOUGD:
                // 贵州广电
                $instance = new System520094();
                break;
            case CARRIER_ID_GUANGXIGD:
                // 广西广电
                $instance = new System450094();
                break;
            case CARRIER_ID_JILINGD:
                // 吉林广电
                $instance = new System220094();
                break;
            case CARRIER_ID_CHINAUNICOM:
                // 中国联通
                $instance = new System000051();
                break;
            case CARRIER_ID_NINGXIAGD:
                // 中国联通
                $instance = new System000051();
                break;
            case CARRIER_ID_GUANGXIDX:
                // 广西电信
                $instance = new System450092();
                break;
            case CARRIER_ID_GUIZHOUDX:
                // 贵州电信
                $instance = new System520092();
                break;
            case CARRIER_ID_NINGXIADX:
                // 宁夏电信
                $instance = new System640092();
                break;
            case CARRIER_ID_SHANXIDX:
                // 陕西电信
                $instance = new System610092();
                break;
            case CARRIER_ID_HUBEIDX:
                // 湖北电信
                $instance = new System420092();
                break;
            case CARRIER_ID_HAINANDX:
                // 海南电信
                $instance = new System460092();
                break;
            case CARRIER_ID_HENANDX:
                $instance = new System410092();
                break;
            case CARRIER_ID_JIANGSUDX:
                $instance = new System320092();
                break;
            case CARRIER_ID_GUANGDONGGD:
                $instance = new System440094();
                break;
            case CARRIER_ID_GUANGDONGGD_NEW:
                $instance = new System440004();
                break;
            case CARRIER_ID_CHONGQINGDX:
                $instance = new System500092();
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG:
                $instance = new System10000051();
                break;
            case CARRIER_ID_GANSUDX:
                $instance = new System620092();
                break;
            case CARRIER_ID_MANGOTV_LT:
                $instance = new System07430093();
                break;
            case CARRIER_ID_SHANDONGDX_HAIKAN:
                $instance = new System371092();
                break;
            case CARRIER_ID_SHANDONGDX:
                $instance = new System370092();
                break;
            case CARRIER_ID_HUNANDX:
                $instance = new System430002();
                break;
            case CARRIER_ID_HAIKAN_APK:
                $instance = new System371002();
                break;
            case CARRIER_ID_SHANDONGDX_APK:
                $instance = new System370002();
                break;
            case CARRIER_ID_GANSUYD:
                $instance = new System620007();
                break;
            case CARRIER_ID_JILIN_YD:
                $instance = new System220001();
                break;
            case CARRIER_ID_LDLEGEND:
                $instance = new System11000051();
                break;
            case CARRIER_ID_JILINGD_MOFANG:
                $instance = new System10220094();
                break;
            case CARRIER_ID_GUIZHOUGD_XMT:
                $instance = new System520095();
                break;
            case CARRIER_ID_JILINGDDX_MOFANG:
                $instance = new System10220095();
                break;
            case CARRIER_ID_NINGXIA_YD:
                $instance = new System640001();
                break;
            case CARRIER_ID_CHINAUNICOM_APK:
                $instance = new System000006();
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG_APK:
                $instance = new System10000006();
                break;
        }
        return $instance;
    }
}