<?php
/**
 * +----------------------------------------------------------------------+
 * | IPTV                                                                 |
 * +----------------------------------------------------------------------+
 * | 大专家相关请求
 * +----------------------------------------------------------------------+
 * | Author: yzq                                                         |
 * | Date:2018/4/2 10:43                                               |
 * +----------------------------------------------------------------------+
 */

namespace Home\Model\Common\ServerAPI;


use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class WXInquiry
{
    const APP_ID = "10013";
    const APP_KEY = "601536974AF6AF4C2126DB1A0F371485";

    /**
     * 获取问诊小程序码
     * @param $doctorId   医生id
     * @return mixed
     */
    public static function getInquiryQRCode($doctorId)
    {
        $jsonArr = array(
            "member_id" => -1,
            "member_name" => "",
            "doctor_id" => $doctorId,
            "entry_flag" => "IPTV二维码问诊",
            "entry_type" => 1,        // 1：在线问诊 2：视频问专家-诊前咨询 3：视频问专家-就诊 4：视频问专家-诊后咨询
                                      // 5：视频问专家-已约咨询 6：问诊记录 7：39互联网医院
            "is_order_vip" => 0,
            "app_id" => self::APP_ID,
            "app_key" => self::APP_KEY,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_GET_WX_INQUIRY_QRCODE);
        $result = $httpManager->requestPost($jsonArr);

        return $result;
    }

    /**
     * 获取问诊状态
     * @param $scene   小程序码标识
     * @return mixed
     */
    public static function getInquiryStatus($scene)
    {
        $jsonArr = array(
            "app_id" => self::APP_ID,
            "app_key" => self::APP_KEY,
            "scene" => $scene,
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_QUERY_WX_INQUIRY_STATUS);
        $result = $httpManager->requestPost($jsonArr);

        return $result;
    }
    
}