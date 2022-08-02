<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  |                                                                        
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2017/12/1 14:14                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Model\Common\ServerAPI;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;

class SystemAPI
{

    /**
     * @param int $type 1:目前只定义了这个值，代表心跳
     * @return mixed
     */
    public static function sendHeart($type = 1)
    {

        $json = array(
            "combined_device_id" => MasterManager::getSTBMac(),
            "type" => $type,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_HEART);
        $result = $httpManager->requestPost($json);

        return json_decode($result, true);
    }

    /**
     * 获取导航栏信息
     * @return mixed
     */
    public static function getNavigationInfo()
    {
        /*$key = RedisManager::buildKeyByAreaCode(RedisManager::$REDIS_NAV_CONFIG);
        $navigateInfo = RedisManager::getPageConfig($key);
        if (!$navigateInfo) {
            $json = array();

            $httpManager = new HttpManager(HttpManager::PACK_ID_NAVIGATE);
            $navigateInfo = $httpManager->requestPost($json);
            RedisManager::setPageConfig($key, $navigateInfo);
        }*/

        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_NAVIGATE);
        $navigateInfo = $httpManager->requestPost($json);
        return json_decode($navigateInfo);
    }

    /**
     * 获取二级导航栏信息
     * @return mixed
     */
    public static function getNavigationModelInfo($classifyId)
    {
        $json = array("navigate_id" => $classifyId);

        $httpManager = new HttpManager(HttpManager::PACK_ID_NAVIGATE_MODLE);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 拉取宁夏便民药店区域一二级列表
     * @return mixed
     */
    public static function getAreaList()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_CITY_LIST);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * 获取主页配置信息
     *
     * @return \stdClass
     */
    static public function getHomeConfigInfo()
    {
        $key = RedisManager::buildKeyByAreaCode(RedisManager::$REDIS_HOME_CONFIG);
        $homeConfigInfo = RedisManager::getPageConfig($key);
        if (!$homeConfigInfo) {
            // $homeConfigInfo = self::getPageConfig();
            $json = array();
            $httpManager = new HttpManager(HttpManager::PACK_ID_SYS_CFG);
            $homeConfigInfo = $httpManager->requestPost($json);
            RedisManager::setPageConfig($key, $homeConfigInfo);
        }
        return json_decode($homeConfigInfo);
    }

    /**
     * 获取挽留页信息
     *
     * @return \stdClass
     */
    static public function getHoldPageInfo()
    {
        $key = RedisManager::buildKeyByAreaCode(RedisManager::$REDIS_HOLD_CONFIG);
        $homeConfigInfo = RedisManager::getPageConfig($key);
        if (!$homeConfigInfo) {
            // $homeConfigInfo = self::getPageConfig();
            $json = array();
            $httpManager = new HttpManager(HttpManager::PACK_ID_HOLD_PAGE);
            $homeConfigInfo = $httpManager->requestPost($json);
            RedisManager::setPageConfig($key, $homeConfigInfo);
        }
        return json_decode($homeConfigInfo);
    }

    static public function getPageConfig()
    {
        $json = array();
        $httpManager = new HttpManager(HttpManager::PACK_ID_SYS_CFG);
        $homeConfigInfo = $httpManager->requestPost($json);
        return json_decode($homeConfigInfo);
    }

    /**
     * 拉取测试入口配置
     * @return mixed
     */
    static public function getTestEntrySet()
    {
        $json = array();

        $httpManager = new HttpManager(HttpManager::PACK_ID_TEST_ENTRY_SET);
        $result = $httpManager->requestPost($json);

        return json_decode($result);
    }

    /**
     * @brief 请求epg主题信息
     * @param null $areaCode 地区编码
     * @param null $platformType 平台类型
     * @param null $enterPosition 局方大厅推荐位入口信息
     * @return mixed
     */
    static public function getEpgThemeInfo($areaCode = null, $platformType = null, $enterPosition = null)
    {
        $themePictureKey = RedisManager::buildKeyByAreaCode(RedisManager::$REDIS_EPG_THEME_PICTURE);
        if (empty($platformType)) {
            $platformType = MasterManager::getPlatformType();
        }
        $platformType = $platformType == STB_TYPE_HD ? SL_TYPE_HD : SL_TYPE_SD;
        $themePictureKey .= "_$platformType"; // 添加areaCode
        if (empty($enterPosition)) {
            $enterPosition = MasterManager::getEnterPosition();
        }
        if (!empty($enterPosition) && $enterPosition != "") {
            $themePictureKey .= "_$enterPosition"; // 添加areaCode
        }
        $epgThemeImg = RedisManager::getPageConfig($themePictureKey);
        if (!$epgThemeImg) { // 缓存无数据，从CWS获取
            /* 发送HTTP请求获取网络数据 */
            $json = array(
                'area_code' => $areaCode ? $areaCode : "",
                'platform_type' => $platformType
            );
            $httpManager = new HttpManager(HttpManager::PACK_ID_EPG_THEME_PICTURE);
            $httpResult = $httpManager->requestPost($json);
            /* CWS获取的网络数据格式需要遍历才能找到对应导航栏的信息，所以这里重组数据 */
            $themeObj = json_decode($httpResult);
            // 最后返回的JSON对象
            $epgThemeImg = new \stdClass();
            if ($themeObj->result == '0') { // 网络请求是否成功
                // 导航栏背景图片的对象，其中导航栏Id作为键，导航栏图片作为值 {'-1':'image_url','1':'image_url'}
                $themeImg = new \stdClass();
                // 启动页背景图，也做上一步的处理
                $posImg = new \stdClass();
                foreach ($themeObj->list as $value) { // 遍历处理list数组
                    $navId = $value->navigate_id;
                    $imgUrl = $value->img_url;
                    $themeImg->$navId = $imgUrl;
                }
                foreach ($themeObj->pos_list as $value) { // 遍历处理pos_list数组
                    $imgUrl = $value->img_url;
                    $posImg->navId = $imgUrl;
                }
                // 构建最后返回对象
                $epgThemeImg->themeImg = $themeImg;
                $epgThemeImg->posImg = $posImg;
                // 缓存处理后的数据到Redis中
                RedisManager::setPageConfig($themePictureKey, json_encode($epgThemeImg));
                return $epgThemeImg;
            }
        }

        return json_decode($epgThemeImg);
    }

    /**
     * @brief 拉取跑马灯配置
     * @return mixed
     */
    static public function getMarqueeInfo()
    {
        /*$key = RedisManager::buildKeyByAreaCode(RedisManager::$REDIS_MARQUEE_INFO);
        $marqueeInfo = RedisManager::getPageConfig($key);
        if (!$marqueeInfo) {
            $areaCode = MasterManager::getAreaCode();
            $json = array(
                'area_code' => $areaCode ? $areaCode : ""
            );
            $httpManager = new HttpManager(HttpManager::PACK_ID_MARQUEE_INFO);
            $marqueeInfo = $httpManager->requestPost($json);
            RedisManager::setPageConfig($key, $marqueeInfo);
        }*/
        $areaCode = MasterManager::getAreaCode();
        $json = array(
            'area_code' => $areaCode ? $areaCode : ""
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_MARQUEE_INFO);
        $marqueeInfo = $httpManager->requestPost($json);

        return json_decode($marqueeInfo);
    }

    /**
     * @brief 拉取启动推荐配置
     * @return mixed
     */
    static public function getEntryRecommendInfo()
    {
        $json = array();

        $httpManager = new HttpManager(HttpManager::PACK_ID_ENTRY_RECOMMEND_SET);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * @brief 拉取启动推荐配置---> 修改头部信息，再恢复
     * @return mixed
     */
    static public function getEntryRecommendInfoByLmp($lmp)
    {
        $json = array();

        $tmpLmp = MasterManager::getEnterPosition();
        MasterManager::setEnterPosition($lmp);
        $httpManager = new HttpManager(HttpManager::PACK_ID_ENTRY_RECOMMEND_SET);
        $result = $httpManager->requestPost($json);
        MasterManager::setEnterPosition($tmpLmp);
        return $result;
    }

    /**
     * @brief 查询配置在管理后台的apk插件版本号
     * @return mixed
     */
    static public function queryApkPluginVersion($appName, $version)
    {
        $json = array(
            'plugin_name' => $appName,
            'current_version' => $version
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_QUERY_APK_PLUGIN_VERSION);
        $result = $httpManager->requestPost($json);
        return $result;
    }

    /**
     * @Brief: 获取系统促订加时配置
     * @param: area_code    string    地区编码（省份：216）
     * @param: sub_area_code    string    子地区编码（地市：0531）
     * @param: type    int    策略类型（1促订 2加时），不传（或传的值不是1与2）将返回当前有效的促订和加时配置
     * @return mixed
     */
    static public function queryShowPayMethod()
    {
        $cacheData = MasterManager::getPayMethod();
        LogUtils::info("SystemAPI-->queryShowPayMethod-->cacheData-->" . $cacheData);
        if ($cacheData) {
            return json_decode($cacheData);
        }

        $json = array(
            'user_account' => MasterManager::getAccountId(),
            'area_code' => MasterManager::getAreaCode(),
            'sub_area_code' => MasterManager::getSubAreaCode(),
            'type' => 0
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_SHOW_PAY_METHOD);
        $result = $httpManager->requestPost($json);
        MasterManager::setPayMethod($result);
        return json_decode($result);
    }

    /**
     * @Brief:此函数用于获取全国省、市、区
     * @param int $proid 当值为0时，查询全国所有省份；当值为具体值时，就查询对应的省市区
     * @return mixed
     */
    static public function queryChineseDistrict($proid = 0)
    {
        $json = array(
            'proid' => $proid
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_PROVINCE_CITY_AREA);
        $result = $httpManager->requestPost($json);
        $data = json_decode($result);
        return $data;
    }

    /**
     * 拉取各模块的栏目配置信息
     * @param $type //模块类型（整型: 0药品查询 1疾病自查 2症状自查 3健康自测 4健康知识管理）
     * @return mixed
     */
    public static function getColumnsConfigInfo($type)
    {
        $json = array(
            'area_code' => MasterManager::getAreaCode(),
            'type' => $type,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_SYS_COLUMNS_CONFIG_INFO);
        $result = $httpManager->requestPost($json);

        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] >>> response data : ' . $result);

        return json_decode($result);
    }

    /**
     * 拉取详情页（左侧）导航列表
     * @param $type //模块类型（整型: 0药品查询 1疾病自查 2症状自查 3健康自测 4健康知识管理）
     * @return mixed
     */
    public static function getColumnDetailNavigation($type)
    {
        $json = array(
            'type' => $type,
        );

        $httpManager = new HttpManager(HttpManager::PACK_ID_SYS_COLUMN_DETAIL_NAVIGATION);
        $result = $httpManager->requestPost($json);

        LogUtils::info('[' . __CLASS__ . ']' . '--->[' . __FUNCTION__ . '] >>> response data : ' . $result);

        return json_decode($result);
    }

    /**
     * @Brief:中国联通获取跳转连接
     * @param int $proid 当值为0时，查询全国所有省份；当值为具体值时，就查询对应的省市区
     * @return mixed
     */
    static public function getJumpUrl()
    {
        $json = array(
            "area_code" => MasterManager::getAreaCode(),
        );
        $httpManager = new HttpManager(HttpManager::PACK_ID_CHINAUNICOM_AREA_URL);
        $result = $httpManager->requestPost($json);

        LogUtils::info("HttpManager getJumpUrl ---> return [URL-RESULT]:" . $result);
        return json_decode($result, true);
    }

    public static function clickContentInfo($action,$contentId){
        $header = array(
            'Content-type: application/json',
        );
        // 构建transactionID： sp编码(8位) +时间戳(yyyyMMddHHmmss 14位)+随机数（16位）
        $transactionID = SPID . date("YmdHis") . mt_rand(10000000, 99999999) . mt_rand(10000000, 99999999);
        // 获取userId
        $userID = MasterManager::getUserId();
        // 获取contentID
        $contentID = $contentId ;
        // 设置key
        $key = CLICK_CONTENT_INFO_KEY;
        LogUtils::info("clickContentInfo md5 info is {$transactionID}{$userID}{$contentID}{$action}{$key}");
        // 构建加密信息
        $sign = md5("{$transactionID}{$userID}{$contentID}{$action}{$key}");

        $request_params = array(
            "transactionID" => $transactionID,
            "userID" => $userID,
            "contentID" => $contentID,
            "action" => $action,
            "sign" => $sign
        );

        LogUtils::info("clickContentInfo request_params is " . json_encode($request_params));
        // 发起http请求
        $result = HttpManager::httpRequestByHeader("POST", CLICK_CONTENT_INFO_URL, $header,json_encode($request_params));
        // 字符编码转换，解决中文乱码问题
        $result = mb_convert_encoding($result, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5');
        LogUtils::info("clickContentInfo result is " . json_encode($result));
        return $result;
    }

    /**
     添加鉴权结果
     * @param $userId
     * @return mixed
     */
    static public function sendBillAuthRes($accountId,$orderId,$payDt,$payState,$isvip,$method)
    {
        $json = array(
            "accountId" => $accountId,
            "orderId" => $orderId,
            "payDt" => $payDt,
            "payState" => $payState,
            "isvip" => $isvip,
            "method"=> $method,
        );
        $http = new HttpManager(HttpManager::PACK_ID_ADD_AUTH_RES);
        $result = $http->requestPost($json);

        return json_decode($result);
    }

    /**
     * 获取定制模块配置数据
     * @param $moduleId 模块ID
     * @return mixed
     */
    public static function getCustomizeModuleConfig($moduleId)
    {
        $json = array(
            "module_id" => $moduleId,
        );
        $http = new HttpManager(HttpManager::PACK_ID_CUSTOMIZE_MODULE);
        $result = $http->requestPost($json);

        return json_decode($result);
    }
}