<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  | cookie管理
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2017/11/30 17:56                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Model\Common;


class CookieManager
{
    public static $C_PLATFORM_TYPE = "c_platform_type";             //平台类型（hd-高清 sd-标清）
    public static $C_CARRIER_ID = "c_carrier_id";                   //区域id
    public static $C_AREA_CODE = "c_area_code";                     //运营商-省份（码）
    public static $C_SUB_AREA_CODE = "c_sub_area_code";             //运营商-省份-地区（码）

    // 缓存INFO 信息
    public static $C_APP_ROOT_PATH = "c_app_root_path";             //缓存应用根地址

    public static $C_ORDER_RESULT = "c_order_result";               //订购结果（是否成功）
    public static $C_IS_FORBIDDEN_ORDER = "c_is_forbidden_order";   //禁止订购

    public static $C_HISTORY_LENGTH = "c_history_length";           //历史记录长度
    public static $C_FROM_LAUNCH = "c_from_launch";                 //EPG从哪进入的标志参数（部分地区使用）

    public static $C_INNER_VALUE = "c_inner_value";                 //局方和应用进入标识

    public static $C_ACCOUNT_ID = "c_account_id";                   //用户业务账号

    public static $C_USER_FUNC_LIMIT = "c_user_func_limit";         //用户(普通/VIP)功能限制信息

    //key映射表
    private static $sMap = array(
        "c_is_run_on_pc" => "c_is_run_on_pc",
        "c_platform_type" => "c_platform_type",
        "c_carrier_id" => "c_carrier_id",
        "c_area_code" => "c_area_code",
        "c_sub_area_code" => "c_sub_area_code",
        "c_app_root_path" => "c_app_root_path",
        "c_order_result" => "c_order_result",
        "c_is_forbidden_order" => "c_is_forbidden_order",
        "c_is_forbided_order" => "c_is_forbided_order",
        "c_history_length" => "c_history_length",
        "c_from_launch" => "c_from_launch",
        "c_inner_value"=>"c_inner_value",
        "c_account_id"=>"c_account_id",
        "c_user_func_limit"=>"c_user_func_limit",
    );

    /**
     * 设置Cookie值
     * @param $key
     * @param $value
     * @param $expire
     */
    public static function setCookie($key, $value, $expire = COOKIE_EXPIRE_TIME)
    {
        cookie($key, $value, $expire);
    }

    /**
     * 获取Cookie值
     * @param $key
     * @return mixed
     */
    public static function getCookie($key)
    {
        return cookie($key);
    }

    /**
     * 清除Cookie
     */
    public static function clearCookie($key)
    {
        if ($key != null && !empty($key)) {
            setCookie($key, "", time() - 60);
        }
        foreach (CookieManager::$sMap as $key => $value) {
            setCookie($key, "", time() - 60);
        }
    }
}