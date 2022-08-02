<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/3/20
 * Time: 下午7:40
 */

namespace Home\Model\DoctorP2P;

use Home\Common\Tools\NetworkUtils;
use Home\Model\Common\ServerAPI\DoctorP2PAPI;
use Home\Model\Entry\MasterManager;

class DoctorP2PManager
{
    /**
     * 保存服务器问诊参数到服务器
     * @param $paramInfo
     * @return mixed
     */
    static public function saveInquiryParam($macAddr, $paramInfo)
    {
        $accountType = 1;   //用IP作为账号类型
        $userAccount = $macAddr;
        if ($macAddr == "") {
            //获取客户端IP地址作为账号
            $userAccount = NetworkUtils::getClientIp();
        }

        $result = DoctorP2PAPI::uploadInquiryParam($userAccount, $accountType, $paramInfo);

        return $result;
    }

    /**
     * 局方应用商城跳转参数
     * @return false|string 跳转参数的json对象
     */
    static public function getAppMarketIntentParam()
    {
        $intentParam = array();
        switch (CARRIER_ID) {
            case CARRIER_ID_SHANDONGDX:
            case CARRIER_ID_SHANDONGDX_HAIKAN:
                $intentParam = array(
                    "intentType" => 1,
                    "action" => "com.staryea.action.TripartiteApp",
                    "extra" => array(
                        array(
                            "name" => "TripartiteAppPackageName",
                            "value" => PLUGIN_VIDEO_APP_NAME
                        )
                    )
                );
                break;
            case CARRIER_ID_GUIZHOUDX:
                $intentParam = array(
                    "intentType" => 0,
                    "appName" => "com.dcyx.applicationstore",
                    "className" => "com.dcyx.applicationstore.activity.ApplicationActivity",
                    "extra" => array(
                        array(
                            "name" => "packageName",
                            "value" => PLUGIN_VIDEO_APP_NAME
                        )
                    )
                );
                break;
            case CARRIER_ID_QINGHAIDX:
                $intentParam = array(
                    "intentType" => 1,
                    "appName" => "com.amt.appstore",
                    "action" => "com.amt.appstore.action.LAUNCHER",
                    "extra" => array(
                        array(
                            "name" => "extraKey",
                            "value" => "jumpId=8&appPkg=" . PLUGIN_VIDEO_APP_NAME . "&appId=408"
                        )
                    )
                );
                break;
            case CARRIER_ID_XINJIANGDX:
            case CARRIER_ID_XINJIANGDX_HOTLINE:
                $contentId = 406;
                if (CARRIER_ID == CARRIER_ID_XINJIANGDX && MasterManager::getLocalInquiry() == 1) {
                    $contentId = 425;
                } else if (CARRIER_ID == CARRIER_ID_XINJIANGDX_HOTLINE) {
                    $contentId = 428;
                }
                $intentParam = array(
                    "appName" => "com.amt.appstore.tianyi",
                    "className" => "com.amt.appstore.tianyi.activity.InitActivity",
                    "extra" => array(
                        array(
                            "name" => "extraKey",
                            "value" => "abc=" . MasterManager::getAccountId() . "jumpId=8&appPkg=" . PLUGIN_VIDEO_APP_NAME . "&contentId=" . $contentId,

                        )
                    )
                );
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG:
                $intentParam = array(
                    "intentType" => 0,
                    "appName" => "com.huawei.dsm",
                    "className" => "com.huawei.dsm.activity.HomeActivity",
                    "extra" => array(
                        array(
                            "name" => "data",
                            "value" => array(
                                "showType" => 2,
                                "isFromLauncher" => true,
                                "appId" => "jkmfcj1",
                                "contentId" => "jkmfcj1"
                            )
                        )
                    )
                );
                break;
        }

        return json_encode($intentParam);
    }
}