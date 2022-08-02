<?php

/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |  session管理类
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2017/6/21 9:43                                                |
  +----------------------------------------------------------------------+ 
 */

namespace Home\Model\Common;

use Think\Exception;

class SessionManager {
    public static $sessionMaps;

    //需要缓存的Session字段。 需要提前在该管理器中定义，自定义的字段需要放到map中
    // 页面配置数据
    public static $S_MARQUEE_INFO = "s_marquee_info";                    // 跑马灯信息

    // 用户数据
    public static $S_STB_ID = "s_stb_id";                               //机顶盒ID
    public static $S_EPG_DOMAIN = "s_epg_domain";                       //机顶盒 epg domain
    public static $S_STB_MAC = "s_stb_mac";                               //机顶盒mac
    public static $S_CARRIER_ID = "s_carrier_id";                               //运营商ID
    public static $S_AREA_CODE = "s_area_code";                               //运营商,上架到的省份区域码
    public static $S_SUB_AREA_CODE = "s_sub_area_code";                     // 运营商-省份-地区
    public static $S_STB_VERSION = "s_stb_version";                               //机顶盒版本号
    public static $S_STB_MODEL = "s_stb_model";                               //机顶盒型号
    public static $S_IPTV_PORTAL_URL = "s_iptv_portal_url";                               //epg门户地址
    public static $S_ACCOUNT_ID = "s_account_id";                       //用户业务账号
    public static $S_USERFROM_TYPE = "s_userfrom_type";                 //用户来源（进入类型）
    public static $S_SUB_ID = "s_sub_id";                      //专题ID
    public static $S_PLATFORM_TYPE = "s_platform_type";                 //用户来源（进入类型）
    public static $S_PLATFORM_TYPE_EXT = "s_platform_type_ext";  //扩展：1 -- hd高清，0 -- sd标清 3 --EPG5.0+（4K）、4 --百视通高清、5 --百视通标清、6 --省台高清、7 --省台标清
    public static $S_LOGIN_ID = "s_login_id";                           //用户登陆id
    public static $S_CWS_SESSION_ID = "s_cws_session_id";               //服务器的session_id
    public static $S_ACCESS_MODULE = "s_access_module";                 //用户访问的模块
    public static $S_PLAY_PARAM = "s_play_param";
    public static $S_ORDER_ITEM = "s_order_item";
    public static $S_ENTER_POSITION = "s_enter_position";                //访问入口地址的位置
    public static $S_ENTER_FROM_YSTEN = "s_enter_from_ysten";                //是否使用易视腾鉴权计费接口的入口（广东移动APK融合包）
    public static $S_ANSWER_INFO = "s_answer_info";                //答题活动题目信息
    public static $S_CLIENT_VERSION = "s_client_version";           // 客户端版本号
    public static $S_USER_TOKEN = "s_user_token";
    public static $S_FREE_EXPERIENCE = "s_free_experience";         // 免费体验
    public static $S_SHOW_PAY_LOCK = "s_show_pay_lock";                // 显示童锁
    public static $S_IS_PAY_UNIFY_AUTH = "s_is_pay_unify_auth";       // 统一认证

    public static $S_USER_ID = "s_user_id"; // 会员ID
    public static $S_IS_TEST_USER = "s_is_test_user";                   //用户是否是白名单用户
    public static $S_IS_NEW_USER = "s_is_new_user";                     //用户是否新注册用户
    public static $S_IS_VIP_USER = "s_is_vip_user";                     //用户是否是VIP用户
    public static $S_AUTO_ORDER_FLAG = "s_auto_order_flag";             //是否是续订用户
    public static $S_SHOW_PAY_PAGE_RULE = "s_show_pay_page_rule";      //显示计费页面的规则
    public static $S_QUREY_PAY_METHOD = "s_query_pay_method";          // 获取系统促订加时配置

    public static $S_ACTIVITY_ID = "s_activity_id";             // 活动ID
    public static $S_ACTIVITY_NAME = "s_activity_name";         // 活动名称
    public static $S_ACTIVITY_CHOOSE_ITEM = "s_activity_choose_item";   // 活动选择了那个宝箱
    public static $S_POSITON_TWO_CONFIG = "s_position_two_config";   // 是否使用首页二号位
    public static $S_ACTIVITY_ORDER_SP_MAP = "s_activity_order_sp_map"; // 联合活动，已经订购vip的sp厂商

    public static $S_EPG_THEME_INFO = "s_epg_theme_info";              // 主题信息
    public static $S_PAY_CALLBACK_PARAM = "s_pay_callback_param";      // 订购回调参数

    public static $S_INDEX_URL = "s_index_url";      // 入口参数
    //新疆电信来源信息
    public static $FROM_PAGE = "from_page";
    public static $S_EPG_LOCAL_INQUIRY = "local_inquiry";

    //江苏电信缓存INFO
    public static $S_EPG_INFO = "s_epg_info";                           //缓存IPTV传入的EPG INFO信息。
    public static $S_EPG_INFO_MAP = "s_epg_info_map";                   //缓存IPTV的EPG INFO的数组。

    public static $S_ROUTER_STACK = "s_router_stack";                   //路由堆栈
    public static $S_CURRENT_PAGE = "s_current_page";                   //当前页面

    public static $S_PAY_PAGE_CONFIG = "s_pay_page_config";             // 计费页配置

    public static $S_GJK_UID = "s_gjk_uid";                             // 本平台对应贵健康平台的贵健康用户id
    public static $S_LAYA_DEVICE_ID = "s_laya_device_id";               // 拉雅健康仪设备id
    public static $S_P2P_PHONE = "s_p2p_phone";                         // 视频问诊电话号码


    public static $S_IS_REPORT_USER_INFO = "s_is_report_user_info";      // 上报用户信息
    public static $S_PLAYER_PLATFORM = "s_player_platform";  // 播放器平台（中兴平台播放器、华为平台播放器）
    public static $S_EPG_USER_SKIN_INFO = "s_epg_user_skin_info";                // 用户皮肤

    public static $S_INSPIRE_ORDER_TIMES = "s_inspire_order_times";

    public static $S_LOGIN_TO_SP = "s_login_to_sp"; // 是否要向平台注册
    public static $S_LOGIN_CONTENT_ID = "s_login_content_id"; // 向平台注册时，链接的编码id

    public static $S_ENTER_APP_TIME = "s_enter_app_time"; // 首页初次显示时间

    public static $S_SHOW_ORDER_TIMES = "s_show_order_times"; // 促订跳转订购页面显示次数

    public static $S_ENTER_HOSPITAL_MODULE = "s_enter_hospital_module"; // 进入去医院模块表示 1 -- 进入 0 -- 未进入

    public static $S_USER_GROUP_TYPE = "s_user_group_type"; // 用户分组类型
    public static $S_USER_GROUP_FOUR_FIRST_ENTRY = "s_user_group_four_first_enter"; // 用户分组4是否第一次进来

    public static $S_IS_JIFEN_EXCHANGE = "s_is_jifen_exchange"; // 是否可以积分兑换（1-- 可以，0--不可以；默认是1）

    public static $S_ORDER_PACKET_TYPE = "s_order_packet_type"; // 判断当前用户订购的套餐类型，仅为山东电信使用

    public static $S_APK_INFO = "s_apk_info";                   // apk信息。存储格式：对象

    public static $S_USER_TYPE_AUTH = "s_user_type_auth";       // 用户鉴权结果
    public static $S_USER_FUNC_LIMIT = "s_user_func_limit";     // 用户(普通/VIP)功能限制信息
    public static $S_ANHUI_AUTH_CALLBACK_PARAM = "s_anhui_auth_callback_param";   //安徽移动怡伴鉴权回调参数
    public static $S_AUTH_TYPE = "s_auth_type";                 // 广西移动apk(怡伴)鉴权方式

    public static $S_LOOP_PAY_RESULT = "s_loop_pay_result";                  // 当前是否轮询支付结果
    public static $S_PAY_PARAM_INFO = "s_pay_param_info";                  // 用户(普通/VIP)功能限制信息
    public static $S_PRODUCT_INFO = "s_product_info";                  // 用户(普通/VIP)功能限制信息
    public static $S_PAY_TYPE = "s_pay_type";                  // 用户(普通/VIP)功能限制信息
    public static $S_QUERY_INFO = "s_query_info";                  // 用户(普通/VIP)功能限制信息
    public static $S_USER_ORDER_ID = "s_user_order_id";         // 用户订购ID

    public static $S_IS_ORDER_BLACKLIST_USER = "s_is_order_blacklist_user";      // 是否订购黑名单用户

    public static $S_IS_REPORT_OPERATE_TRACE = "s_is_report_operate_trace";      // 中国联通相关业务（食乐汇、健康魔方）检测是否上报局方用户操作轨迹（操作标识7）

    public static $S_USER_AGENT_INFO = "s_user_agent";              //保存客户端的user agent
    public static $S_X_REQUESTED_WITH = "s_x_requested_with";       //保存客户端的x-requested-with
    public static $S_EPG_HOME_URL = "s_epg_home_url";               //缓存局方EPG大厅的url
    public static $S_EPG_SERVER_URL = "s_epg_server_url";           //缓存局方EPG服务器地址

    public static $S_WAIT_TIME = "s_wait_time";                      //等待时长

    //key映射表
    private static $sMap = array(
        "s_marquee_info" => "s_marquee_info",
        "s_stb_id" => "s_stb_id",
        "s_epg_domain" => "s_epg_domain",
        "s_stb_mac" => "s_stb_mac",
        "s_stb_model" => "s_stb_model",
        "s_stb_version" => "s_stb_version",
        "s_iptv_portal_url" => "s_iptv_portal_url",
        "s_user_id" => "s_user_id",
        "s_account_id" => "s_account_id",
        "s_userfrom_type" => "s_userfrom_type",
        "s_platform_type" => "s_platform_type",
        "s_login_id" => "s_login_id",
        "s_cws_session_id" => "s_cws_session_id",
        "s_epg_info" => "s_epg_info",
        "s_epg_info_map" => "s_epg_info_map",
        "s_access_module" => "s_access_module",
        "s_play_param" => "s_play_param",
        "s_carrier_id" => "s_carrier_id",
        "s_area_code" => "s_area_code",
        "s_sub_area_code" => "s_sub_area_code",
        "s_sub_id" => "s_sub_id",
        "s_order_item" => "s_order_item",
        "s_is_test_user" => "s_is_test_user",
        "s_is_new_user" => "s_is_new_user",
        "s_is_vip_user" => "s_is_vip_user",
        "s_auto_order_flag" => "s_auto_order_flag",
        "s_show_pay_page_rule" => "s_show_pay_page_rule",
        "s_activity_id" => "s_activity_id",
        "s_activity_name" => "s_activity_name",
        "s_platform_type_ext" => "s_platform_type_ext",
        "s_activity_choose_item" => "s_activity_choose_item",
        "s_position_two_config" => "s_position_two_config",
        "s_enter_position" => "s_enter_position",
        "s_enter_from_ysten" => "s_enter_from_ysten",
        "s_answer_info" => "s_answer_info",
        "s_router_stack" => "s_router_stack",
        "s_current_page" => "s_current_page",
        "s_activity_order_sp_map" => "s_activity_order_sp_map",
        "s_epg_theme_info" => "s_epg_theme_info",
        "s_pay_callback_param" => "s_pay_callback_param",
        "s_pay_page_config" => "s_pay_page_config",
        "s_gjk_uid" => "s_gjk_uid",
        "s_laya_device_id" => "s_laya_device_id",
        "s_p2p_phone" => "s_p2p_phone",
        "s_client_version" => "s_client_version",
        "s_user_token" => "s_user_token",
        "s_free_experience" => "s_free_experience",
        "s_show_pay_lock" => "s_show_pay_lock",
        "s_is_pay_unify_auth" => "s_is_pay_unify_auth",
        "s_is_report_user_info" => "s_is_report_user_info",
        "s_epg_user_skin_info" => "s_epg_user_skin_info",
        "s_index_url" => "s_index_url",
        "s_player_platform" => "s_player_platform",
        "s_query_pay_method" => "s_query_pay_method",
        "s_inspire_order_times" => "s_inspire_order_times",
        "s_login_to_sp" => "s_login_to_sp",
        "s_login_content_id" => "s_login_content_id",
        "s_enter_app_time" => "s_enter_app_time",
        "s_show_order_times" => "s_show_order_times",
        "s_enter_hospital_module" => "s_enter_hospital_module",
        "s_user_group_type" => "s_user_group_type",
        "s_user_group_four_first_enter" => "s_user_group_four_first_enter",
        "s_is_jifen_exchange" => "s_is_jifen_exchange",
        "from_page" => "from_page",
        "s_order_packet_type" => "s_order_packet_type",
        "local_inquiry" => "local_inquiry",
        "s_apk_info" => "s_apk_info",
        "s_user_type_auth" => "s_user_type_auth",
        "s_user_func_limit" => "s_user_func_limit",
        "s_anhui_auth_callback_param" => "s_anhui_auth_callback_param",
        "s_auth_type" => "s_auth_type",
        "s_user_order_id" => "s_user_order_id",
        "s_loop_pay_result" => "s_loop_pay_result",
        "s_pay_param_info" => "s_pay_param_info",
        "s_product_info" => "s_product_info",
        "s_pay_type" => "s_pay_type",
        "s_query_info" => "s_query_info",
        "s_is_order_blacklist_user" => "s_is_order_blacklist_user",
        "s_is_report_operate_trace" => "s_is_report_operate_trace",
        "s_user_agent" => "s_user_agent",
        "s_x_requested_with" => "s_x_requested_with",
        "s_epg_home_url" => "s_epg_home_url",
        "s_epg_server_url" => "s_epg_server_url",
        "s_wait_time" => "s_wait_time",
    );

    /**
     * 启动session，用于缓存数据
     * 如果IS_REDIS_CACHE_SESSION宏有定义，就进行redis缓存，如果没有，就写文件
     */
    public static function startSession() {if (!isset($_SESSION)) {
            // 配置session
            if (defined("IS_REDIS_CACHE_SESSION") && (IS_REDIS_CACHE_SESSION == 1) && defined("REDIS_LOCAL_IP")) {
                $ip = REDIS_LOCAL_IP;
                $port = REDIS_LOCAL_PORT;
                ini_set('session.save_handler', 'redis');
                ini_set('session.save_path', "tcp://$ip:$port?auth=" . REDIS_AUTH_PASSWORD);
                ini_set('session.gc_maxlifetime', SESSION_EXPIRE_TIME); // 单位是秒
                ini_set('session.cache_expire', SESSION_EXPIRE_TIME / 60); // 单位是分钟
            } else {
                session(array('path' => DIR . DIRECTORY_SEPARATOR . "Session" . DIRECTORY_SEPARATOR, 'name' => 'session_id', 'expire' => SESSION_EXPIRE_TIME));
            }
            session_start();
        }
    }

    /**
     * 设置session值保存
     * @param $key
     * @param $value
     * @throws Exception
     */
    public static function setUserSession($key, $value) {
        if (self::verifyKey($key) === false) {
            throw new Exception("illegal key");
        }
        // 启动session，用于缓存数据
        SessionManager::startSession();

        session($key, $value);

        SessionManager::$sessionMaps = $_SESSION;
    }

    /**
     * 获取session值
     *
     * @param $key
     * @return mixed
     */
    public static function getUserSession($key) {
        if (is_null($key)) {
            LogUtils::info("get user session[.$key.] failed! because key is null!!!!");
            return null;
        }

        if (SessionManager::$sessionMaps) {
            return SessionManager::$sessionMaps[$key];
        }

        // 启动session，用于缓存数据
        SessionManager::startSession();

        $value = session($key);
        return $value;
    }

    /**
     *  清除用户session
     * @param $key
     * @throws Exception
     */
    public static function clearUserSession($key) {
        if ($key != null && !empty($key)) {
            SessionManager::setUserSession($key, null);
        } else {
            foreach (SessionManager::$sMap as $key1 => $value) {
                SessionManager::setUserSession($key1, null);
            }
            SessionManager::$sessionMaps = null;
        }
    }

    /**
     * 校验key是否存在
     * @param $key
     * @return bool
     */
    private static function verifyKey($key) {
        return array_key_exists($key, SessionManager::$sMap);
    }
}