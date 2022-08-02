<?php
// +----------------------------------------------------------------------
// | IPTV-EPG-LWS
// +----------------------------------------------------------------------
// | 调试测试相关的API封装
// +----------------------------------------------------------------------
// | Author: Songhui
// | Date: 2018/9/14 16:55
// +----------------------------------------------------------------------


namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class DebugAPI
{

    /**
     * 获取测试启动apk需要的参数
     */
    public static function getTestAPKInfo()
    {
        $userInfoArr = array(
            "name" => "user_info",
            "value" =>
                json_encode(
                    array(
                        "user_id" => MasterManager::getUserId(),
                        "session_id" => MasterManager::getCwsSessionId(),
                        "channel_id" => "000000",
                        "client_type" => CLIENT_TYPE,
                        "client_version" => CLIENT_VERSION,
                        "carrier_id" => MasterManager::getCarrierId(),
                        "platform_type" => MasterManager::getPlatformType(),
                        "login_id" => MasterManager::getLoginId(),
                        "user_account" => MasterManager::getAccountId(),
                        "account_type" => ACCOUNT_TYPE,
                        "area_code" => MasterManager::getAreaCode(),
                        "is_vip" => 1,
                        "account_id"=> MasterManager::getAccountId(),
                    )
                )
        );

        $moduleInfoArr = array(
            "name" => "module_info",
            "value" =>
                json_encode(
                    array(
                        "module_id" => 10001,
                        "module_name" => "p2p video inquiry"
                    )
                )
        );

        $serverInfoArr = array(
            "name" => "server_info",
            "value" =>
                json_encode(
                    array(
                        "server_entry_addr" => SERVER_ENTRY_ADDR,
                        "token" => 100000, //更新配置文件的token值，apk对比更新文件
                    )
                )
        );

        $doctorInfoArr = array(
            "name" => "doctor_info",
            "value" =>
                json_encode(
                    array(
                        "area" => "贵阳市",
                        "avatar_url_new" => "http://113.31.133.202/3016/5/1499410034777983/png/o/2",
                        "department" => "内科",
                        "doc_id" => "1092049",
                        "doc_name" => "任莉(Test)",
                        "gender" => 0,
                        "good_disease" => "",
                        "hospital" => "互联网医院",
                        "inquiry_num" => "",
                        "intro_desc" => "",
                        "job_title" => "副主任药师",
                        "online_state" => 3,
                        "realImageUrl" => "",
                    )
                )
        );

        $memberInfoArr = array(
            "name" => "member_info",
            "value" =>
                json_encode(
                    array(
                        "member_id" => "2",
                        "member_name" => "my",
                        "member_age" => "20",
                        "member_gender" => "0",
                    )
                )

        );

        $paramInfo = array(
            "intentType" => 0,
            "appName" => PLUGIN_VIDEO_APP_NAME,
            "className" => "com.longmaster.iptv.healthplugin.router.ProxyActivity",
            "action" => "",
            "extra" => array(
                $userInfoArr,
                $moduleInfoArr,
                $serverInfoArr,
                $doctorInfoArr,
                $memberInfoArr,
            )
        );

        $result = array(
            'param_info' => json_encode($paramInfo),
        );

        return $result;
    }

    public static function recordLog($logContent)
    {
        $json = array(
            "content" => $logContent,
        );
        LogUtils::info("DebugAPI recordLog ---> content: " . $logContent);
        $httpManager = new HttpManager(HttpManager::PACK_ID_LOG_CONTENT);
        $result = $httpManager->requestPost($json);

        // LogUtils::info("DebugAPI recordLog ---> return [URL-RESULT]");
        return json_decode($result, true);
    }
}