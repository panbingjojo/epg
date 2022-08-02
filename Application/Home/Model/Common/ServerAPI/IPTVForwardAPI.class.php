<?php


namespace Home\Model\Common\ServerAPI;



use Home\Model\IPTVForward\IPTVForwardManager;

class IPTVForwardAPI
{
    /**
     * 获取二维码
     */
    public static function getQRCode($id)
    {
        $arr = array(
            "id" => $id,
        );
        $res = IPTVForwardManager::queryIPTVForward(IPTVForwardManager::FUNC_GET_QRCODE, json_encode($arr));
        return json_decode($res, true);
    }


    /**
     * 查询数据
     */
    public static function queryData($user_id)
    {
        $arr = array(
            "user_id" => $user_id,
        );
        $res = IPTVForwardManager::queryIPTVForward(IPTVForwardManager::FUNC_QUERY_DATA, json_encode($arr));
        return json_decode($res, true);
    }

}