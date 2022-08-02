<?php

/**
 * 主页管理器
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/2
 * Time: 20:04
 */

namespace Home\Model\MainHome;

use Home\Model\Common\HttpManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Common\ServerAPI\AlbumAPI;
use Home\Model\Common\ServerAPI\Expert;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\ServerAPI\VideoAPI;
use Home\Model\Common\SessionManager;
use Home\Model\Common\SystemManager;
use Home\Model\Entry\MasterManager;
use Home\Model\User\FirstManager;
use Think\Log;

class MainHomeManager {
    // 挽留页视频配置信息 -- 普通模式
    const HOLD_VIDEO_COMMON_POSITION_LIST = [101, 102, 103];
    // 挽留页配置信息 -- 普通模式
    const HOLD_CONFIG_COMMON_POSITION_LIST = [104, 105, 106];
    // 挽留页视频配置信息 -- V1模式
    const HOLD_VIDEO_V1_POSITION_LIST = [101, 102, 103, 104, 105, 106];
    // 挽留页配置信息 -- V1模式
    const HOLD_CONFIG_V1_POSITION_LIST = [107, 108, 109, 110, 111];

    static private $homePositionList = array(
        CLASSIFY_DEFAULT => [HOMEPAGE, "12", "13", "14", "15", "16", "17", "18", "19", "101", "102", "103"],                    //首页推荐位置
        CLASSIFY_VIDEO_1 => [CLASSIFY_1, "22", "23", "24", "25", "26", "27", "28", "29"],                 //视频分类1
        CLASSIFY_VIDEO_2 => [CLASSIFY_2, "32", "33", "34", "35", "36", "37", "38", "39"],           //视频分类2
        CLASSIFY_VIDEO_3 => [CLASSIFY_3, "42", "43", "44", "45", "46", "47", "48", "49"],                 //视频分类3
        CLASSIFY_VIDEO_4 => [CLASSIFY_4, "52", "53", "54", "55", "56", "57", "58", "59"],           //视频分类4
        CLASSIFY_VIDEO_5 => [CLASSIFY_5, "62", "63", "64", "65", "66", "67", "68", "69"], //视频分类5
        CLASSIFY_TAB_8 => [CLASSIFY_8, "82", "83", "84"]
    );

    static private $HOME_PAGE_NAVIGATION_ID = 0; // 首页导航栏ID
    static private $HOME_PAGE_RECOMMEND_POSITION_1 = 11; // 首页导航栏ID

    static public $CONFIG_MODEL_V3 = "config_model_v3";
    static public $CONFIG_MODEL_V7 = "config_model_v7";
    static public $CONFIG_MODEL_V10 = "config_model_v10";
    static public $CONFIG_MODEL_V13 = "config_model_v13";

    static public function getHomePageConfig($configModel, $classifyId) {
        $pageConfig = new \stdClass();
        // 导航栏信息
        $navigateInfo = SystemAPI::getNavigationInfo();
        if ($navigateInfo != null && is_object($navigateInfo)
            && !empty($navigateInfo->data) && is_array($navigateInfo->data)) {
            foreach ($navigateInfo->data as $item) {
                $pageConfig->navigationNames[] = $item->navigate_name;
                $imgUrl = new \stdClass();
                $imgUrl->img_url = json_decode($item->img_url);
                $pageConfig->navigationImgs[] = $imgUrl;
            }
        }
        $pageConfig->navigationBar = $navigateInfo;
        // 跑马灯信息
        $pageConfig->marquee = SystemManager::getMarqueeText();
        // 默认加载背景图片
        $pageConfig->bgImage = SystemManager::getEpgThemePicture(1);
        // 推荐位(80002接口数据)
        $recommendConfig = $pageConfig->originalRecommend = SystemAPI::getHomeConfigInfo();
        // 推荐位解析数据
        $pageConfig->recommend = self::parseRecommendInfo($recommendConfig, $configModel, $classifyId);

        return $pageConfig;
    }

    static public function loadNavRecommendConfig($navId, $entryList, $configModel) {
        $keyInfo = RedisManager::$REDIS_NAV_RECOMMEND_CONFIG . "_" . $navId;
        $key = RedisManager::buildKeyByAreaCode($keyInfo);
        $navRecommendConfig = RedisManager::getPageConfig($key);
        if (!$navRecommendConfig) {
            $navRecommendConfig = self::parseNavRecommendConfig($navId, $entryList, $configModel);
            RedisManager::setPageConfig($key, json_encode($navRecommendConfig));
            return $navRecommendConfig;
        }
        return json_decode($navRecommendConfig);
    }

    static public function loadHomePageConfig($configModel, $classifyId = 0) {
        $keyInfo = RedisManager::$REDIS_HOME_PAGE_CONFIG . '_' . $classifyId;
        $key = RedisManager::buildKeyByAreaCode($keyInfo);
        $homePageConfig = RedisManager::getPageConfig($key);
        if (!$homePageConfig) {
            $homePageConfig = self::getHomePageConfig($configModel, $classifyId);
            RedisManager::setPageConfig($key, json_encode($homePageConfig));
            return $homePageConfig;
        }
        return json_decode($homePageConfig);
    }

    /**
     * 加载导航栏信息
     * 80003接口
     */
    static public function loadNavigationInfo() {
        $navigateInfo = SystemAPI::getNavigationInfo();
        return $navigateInfo;
    }

    /**
     * 加载二级导航栏信息
     * 80012接口
     * @param $classifyId
     * @return |null
     */
    static public function loadNavigationModelInfo($classifyId) {
        $navigateModelInfo = SystemAPI::getNavigationModelInfo($classifyId);
        return $navigateModelInfo->list ? $navigateModelInfo->list : null;
    }

    /**
     * 加载导航栏 - 首页推荐 - 配置信息
     * @return \stdClass
     */
    static public function loadHomePageInfo() {
        //获取配置信息
        $homeConfigInfo = SystemAPI::getHomeConfigInfo();
        $configInfo = new \stdClass();
        //解析配置信息
        $videoList = MainHomeManager::parseVideoConfig($homeConfigInfo, CLASSIFY_DEFAULT);
        $homePollVideos = MainHomeManager::parsePollVideoConfig($homeConfigInfo);

        $configInfo->data = $videoList;
        $configInfo->homePollVideoList = $homePollVideos;

        $entryList = $homeConfigInfo->data->entry_list;
        $configInfo->entryList = $entryList;
        $configInfo->homeConfigInfo = array();

        foreach ($entryList as $key => $value) {
            if ($value->position == 11) {
                $parseArr = self::parseCarouse($value->item_data);
                $entryList[$key]->item_data = $parseArr;
                $configInfo->homeConfigInfo = $parseArr;
                break;
            }
        }
        return $configInfo;
    }

    /**
     * 加载导航栏 - 首页推荐 - 配置信息
     * @param $classifyId
     * @return \stdClass
     */
    static public function loadHomeClassifyInfo($classifyId) {
        //获取配置信息
        $homeConfigInfo = SystemAPI::getHomeConfigInfo();

        //解析配置信息 -- 推荐位配置信息
        $videoList = MainHomeManager::parseVideoConfig($homeConfigInfo, $classifyId);

        $configInfo = new \stdClass();
        $configInfo->data = $videoList;

        return $configInfo;
    }

    static public function loadHomePageInfoV7($classifyId){
        //获取配置信息
        $homeConfigInfo = SystemAPI::getHomeConfigInfo();

        //解析配置信息
        $videoList = MainHomeManager::parseRecommendConfig($homeConfigInfo, $classifyId);
        $homePollVideos = MainHomeManager::parsePollVedioConfigV7($homeConfigInfo);

        $configInfo = new \stdClass();
        $configInfo->data = $videoList;
        $configInfo->homePollVideoList = $homePollVideos;
        $configInfo->orignalData = $homeConfigInfo;

        return $configInfo;
    }

    static private function parseRecommendConfig($config, $classifyId)
    {
        $index = 0;
        $entryList = $config->data->entry_list;
        $configInfoList = array();
        $homePositionListItem = MainHomeManager::$homePositionList[$classifyId];
        foreach ($entryList as $value) {
            if (in_array($value->position, $homePositionListItem)) {
                //添加到数组中
                $configInfoList[$index++] = $value;  //添加到数组中
            }
        }

        return $configInfoList;
    }

    static private function parsePollVedioConfigV7($config)
    {
        $platformType = MasterManager::getPlatformType();

        $configVideos = $config->data->home_video;
        $pollVideoList = array();    //首页轮播视频数组
        foreach ($configVideos->list as $key => $value) {
            $videoInfo = new \stdClass();
            $videoInfo->sourceId = $value->source_id;
            $videoInfo->title = $value->title;
            $videoInfo->userType = $value->user_type;
            $videoInfo->modelType = $value->model_type;
            $videoInfo->freeSeconds = $value->free_seconds;
            $videoInfo->unionCode = $value->union_code;

            //获取视频地址
            $videoUrl = json_decode($value->ftp_url);
            $videoInfo->videoUrl = ($platformType == STB_TYPE_HD) ? $videoUrl->gq_ftp_url : $videoUrl->bq_ftp_url;

            $pollVideoList[$key] = $videoInfo;
        }

        $homePollVideos = new \stdClass();
        $homePollVideos->count = $configVideos->count;  //轮播条数
        $homePollVideos->list = $pollVideoList;

        return $homePollVideos;
    }

    /**
     * 加载所有推荐位的配置信息
     */
    static public function loadAllNavConfig() {
        //获取配置信息
        $homeConfigInfo = SystemAPI::getHomeConfigInfo();

        //解析配置信息
        $homePollVideos = MainHomeManager::parsePollVideoConfig($homeConfigInfo);

        $allNavConfig = new \stdClass();
        $allNavConfig->homePollVideoList = $homePollVideos;   //轮播视频

        $entryList = $homeConfigInfo->data->entry_list;
        $allNavConfig->allRecommondConfig = $entryList;
        return $allNavConfig;
    }

    /**
     * 解析轮播部分的参数->规则如下:
     * （1）没有待就诊的约诊记录，配置了约诊提醒轮播也不显示
     *     （用户没有待就诊记录，就要拉取第四条数据补位，如果没有第四条数据就只显示2条）；有待就诊的约诊记录，
     *      如果消息提醒后台配置是置顶的，只显示消息提醒；如果不是，则轮播显示消息提醒；
     *      消息提醒点击后大于20分钟，点了进入订单详情，小于20分钟，进候诊室
     * (2）只轮播前3条数据（3）所有跳转类型都需要支持
     * @param $itemDataArr
     * @return array
     */
    private static function parseCarouse($itemDataArr) {
        $tempK = "";
        foreach ($itemDataArr as $key => $itemObj) {
            //专家约诊记录提醒
            if ($itemObj->entry_type == 20 || $itemObj->entry_type == "20") {
                $recordList = json_decode(Expert::getInquiryRecordList("", "", 0, 99999999), true);

                if ($recordList["code"] == 0) {
                    $tempRecordList = array(
                        "op_type" => $recordList["op_type"],
                        "task_id" => $recordList["task_id"],
                        "code" => $recordList["code"],
                        "account_id" => $recordList["account_id"],
                        "count" => $recordList["count"],
                        "data" => "",
                    );

                    $tempDataArr = null;

                    //筛选离当前约诊最新的一条数据
                    foreach ($recordList["data"] as $k => $v) {
                        $bTime = $v["begin_dt"];
                        $eTime = $v["end_dt"];
                        $cTime = date("Y-m-d H:i:s");
                        if ($bTime >= $cTime) {

                            if ($tempDataArr != null) {
                                $tempBeginTime = $tempDataArr["begin_dt"];
                                if ($bTime < $tempBeginTime) {
                                    $tempDataArr = $v;
                                }
                            } else {
                                $tempDataArr = $v;
                            }
                        } else {
                            if ($eTime > $cTime) {
                                if ($tempDataArr != null) {
                                    $tempBeginTime = $tempDataArr["begin_dt"];
                                    if ($bTime < $tempBeginTime) {
                                        $tempDataArr = $v;
                                    }
                                } else {
                                    $tempDataArr = $v;
                                }
                            }
                        }
                    }

                    if ($tempDataArr == null) {
                        array_splice($itemDataArr, $key, 1);
                        return $itemDataArr;
                    }

                    $tempRecordList["data"] = array($tempDataArr);


                    if ($tempRecordList["code"] == 0) {
                        $itemArr = $tempRecordList["data"][0];
                        $isPay = $itemArr["clinic_is_pay"];//支付状态  0未支付 1已支付
                        $clinicState = $itemArr["clinic_state"];   //就诊状态 0：等待；1：进行；2：完成；3：关闭
                        if ($isPay == 1 && $clinicState == 0) {  //待就诊状态

                            $isOnlyShowArr = json_decode($itemObj->parameters, true);
                            if ($isOnlyShowArr[0]["param"] == 1) {
                                $itemDataArr[$key]->recordList = $tempRecordList;//增加专家约诊列表
                                $itemDataArr = array_splice($itemDataArr, $key, 1);
                                break;
                            }
                            $itemDataArr[$key]->recordList = $tempRecordList;//增加专家约诊列表
                        } else {
                            //如果不是待就诊的约诊记录，就删除管理网站配置的约诊记录提醒
                            array_splice($itemDataArr, $key, 1);
                        }
                    }
                } else {
                    $tempK = $key;
                }
            }
        }

        if ($tempK != "") {
            unset($itemDataArr[$tempK]);
            array_merge($itemDataArr, []);
        }
        return $itemDataArr;
    }

    /**
     * 加载挽留页配置数据
     * @return \stdClass
     */
    static public function loadHoldPageConfig() {
        // 挽留页V1模式地区列表

        $holdModelV1CarrierList = [CARRIER_ID_XINJIANGDX,// 新疆电信
            CARRIER_ID_GUANGDONGGD_NEW,      // 广东广电APK转EPG
            CARRIER_ID_JILINGD_MOFANG,       // 吉林广电魔方
            CARRIER_ID_JILINGDDX_MOFANG,       // 吉林广电魔方
            CARRIER_ID_NINGXIADX,            // 宁夏电信
            CARRIER_ID_QINGHAIDX,            // 青海电信
            CARRIER_ID_QINGHAIDX_GAME,       // 青海电信游戏
            CARRIER_ID_SHANDONGDX,           // 山东电信
            CARRIER_ID_SHANDONGDX_HAIKAN,    // 山东海看EPG
            CARRIER_ID_CHINAUNICOM_OTT,      // 中国联通 -- OTT
            CARRIER_ID_CHINAUNICOM_MOFANG,   // 中国联通 -- 启生魔方
            CARRIER_ID_LDLEGEND,             // 中国联通 -- 乐动传奇
            CARRIER_ID_MANGOTV_LT,           // 芒果联通
            CARRIER_ID_XINJIANGDX_TTJS,      // 新疆电信 -- 天天健身
            CARRIER_ID_CHINAUNICOM_MEETLIFE, // 中国联通 -- 遇见生活
            CARRIER_ID_HENANDX,              // 河南电信
            CARRIER_ID_NINGXIADX_MOFANG,     // 宁夏电信魔方
            CARRIER_ID_HUNANDX,              // 湖南电信apk
            CARRIER_ID_DEMO4,                // 展厅演示版本 -- demo4
            CARRIER_ID_DEMO7,                // 展厅演示版本 -- demo7
            CARRIER_ID_GUANGDONGYD,          // 广东移动apk
            CARRIER_ID_HAIKAN_APK,           // 山东海看apk
            CARRIER_ID_JILIN_YD,             // 吉林移动apk
            CARRIER_ID_SHANDONGDX_APK,       // 山东电信apk
            CARRIER_ID_NEIMENGGU_DX,         // 内蒙古电信apk
            CARRIER_ID_GUANGXIGD_APK,        // 广西广电apk
            CARRIER_ID_HEILONGJIANG_YD,      // 黑龙江移动apk
            CARRIER_ID_GUANGXI_YD,           // 广西移动apk
            CARRIER_ID_ZHEJIANG_HUASHU,      // 浙江华数apk
            CARRIER_ID_HUBEIDX,              // 湖北电信epg
            CARRIER_ID_JIANGSUDX_OTT,        // 江苏电信APK
            CARRIER_ID_GUANGXIGD,            // 广西广电EPG
            CARRIER_ID_HEBEIYD,              // 河北移动APK
            CARRIER_ID_CHINAUNICOM_MOFANG_APK, // 中国联通魔方APK
            CARRIER_ID_JILINGD,          // 吉林广电联通
            CARRIER_ID_JILINGDDX,        // 吉林广电电信
        ];
        // 管理后台配置图片为对象模式地区列表
        $imageObjCarrierList = [CARRIER_ID_CHINAUNICOM, CARRIER_ID_LDLEGEND, CARRIER_ID_CHINAUNICOM_APK];


        // 获取挽留页推荐位
        $holdVideoPositionList = self::HOLD_VIDEO_COMMON_POSITION_LIST;
        $holdConfigPositionList = self::HOLD_CONFIG_COMMON_POSITION_LIST;
        // V1模式地区的推荐位不一样
        if (in_array(CARRIER_ID, $holdModelV1CarrierList)) {
            $holdVideoPositionList = self::HOLD_VIDEO_V1_POSITION_LIST;
            $holdConfigPositionList = self::HOLD_CONFIG_V1_POSITION_LIST;
        }
        // 判断是否图片配置为对象模式
        $isImageObj = in_array(CARRIER_ID, $imageObjCarrierList);

        $pageConfig = SystemAPI::getHoldPageInfo();
        $pageConfigData = $pageConfig->data;
        $recommendPositionList = $pageConfigData->entry_list;
        // 解析管理后台配置挽留页相关信息
        $holdPageConfig = self::parseHoldPageConfig($recommendPositionList, $holdVideoPositionList, $holdConfigPositionList, $isImageObj);
        $holdPageConfig->holdConfigTips = $pageConfigData->exit_tips;

        return $holdPageConfig;
    }

    static private function parseHoldPageConfig($recommendPositionList, $holdVideoPositionList, $holdConfigPositionList, $isImageObj) {
        $holdPageConfig = new \stdClass();
        // 挽留页推荐视频信息 -- 数组
        $recommendVideoList = array();
        // 挽留页配置信息 -- 数组
        $holdConfigList = array();
        foreach ($recommendPositionList as $value) {
            // 解析推荐视频信息
            if (in_array($value->position, $holdVideoPositionList)) {
                // 将解析后的数据添加到数组中
                $recommendVideoList[] = self::parseVideoInfo($value, $isImageObj);
            }
            // 解析常用挽留页信息
            if (in_array($value->position, $holdConfigPositionList)) {
                // 将解析后的数据添加数组中
                $holdConfigList[] = self::parseHoldConfigInfo($value, $isImageObj);
            }
        }
        $holdPageConfig->recommendVideoList = $recommendVideoList;
        $holdPageConfig->holdConfigList = $holdConfigList;
        return $holdPageConfig;
    }

    /**
     * 解析管理后台配置挽留页信息
     * @param: $holdConfig 管理后台配置的挽留页信息
     * @param: $isImageObj 配置的图片信息是否为对象信息
     * @return \stdClass
     */
    static private function parseHoldConfigInfo($holdConfig, $isImageObj) {
        $holdConfigInfo = new \stdClass();

        $itemData1 = $holdConfig->item_data[FIRST_ELEMENT_INDEX];
        $itemData2 = $holdConfig->item_data[SECOND_ELEMENT_INDEX];
        $paramArr = json_decode($itemData2->parameters);

        // 填充图片对象
        if ($isImageObj) {
            $holdConfigInfo->onfocus_image_url = json_decode($itemData1->img_url)->normal;
            $holdConfigInfo->onblur_image_url = json_decode($itemData2->img_url)->normal;
        } else {
            $holdConfigInfo->onfocus_image_url = $itemData1->img_url;
            $holdConfigInfo->onblur_image_url = $itemData2->img_url;
        }

        // 填充更多精彩按钮的跳转信息(使用2号的数据，因为2号是选中的)
        $holdConfigInfo->entryType = $itemData2->entry_type;
        $holdConfigInfo->source_id = $paramArr[FIRST_ELEMENT_INDEX]->param;

        return $holdConfigInfo;
    }

    /**
     * 解析推荐位置视频配置
     * @param $navId
     * @param $entryList
     * @param $configModel
     * @return array
     */
    static private function parseNavRecommendConfig($navId, $entryList, $configModel) {
        $index = 0;
        $videoList = array();
        $homePositionListItem = MainHomeManager::$homePositionList[$navId];
        foreach ($entryList as $value) {
            if (in_array($value->position, $homePositionListItem)) {
                if ($configModel == self::$CONFIG_MODEL_V7) {
                    //添加到数组中
                    $videoList[$index++] = $value;  //添加到数组中
                } else {
                    //添加到数组中
                    $videoList[$index++] = self::parseVideoInfo($value);  //添加到数组中
                }

            }
        }

        return $videoList;
    }

    /**
     * @param $homeConfig
     * @param $configModel
     * @param $classifyId
     * @return \stdClass
     */
    static public function parseRecommendInfo($homeConfig, $configModel, $classifyId) {
        $configInfo = new \stdClass();
        // 解析配置信息 -- 推荐位配置信息
        $index = 0;
        $entryList = $homeConfig->data->entry_list;
        if ($configModel == self::$CONFIG_MODEL_V7 || $classifyId == 0) {
            $videoList = array();
            $configInfo->homeConfigInfo = array();
            $homePositionListItem = MainHomeManager::$homePositionList[$classifyId];
            foreach ($entryList as $key => $value) {
                if (in_array($value->position, $homePositionListItem)) {
                    if ($configModel == self::$CONFIG_MODEL_V7) {
                        $videoList[$index++] = $value;
                    } else {
                        //添加到数组中
                        $videoList[$index++] = self::parseVideoInfo($value);
                    }
                }

                if ($value->position == 11) {
                    $parseArr = self::parseCarouse($value->item_data);
                    $entryList[$key]->item_data = $parseArr;
                    $configInfo->homeConfigInfo = $parseArr;
                }
            }
            if ($configModel == self::$CONFIG_MODEL_V7) {
                $homePollVideos = MainHomeManager::parsePollVideoConfigV7($homeConfig);
            } else {
                // 解析配置信息 -- 轮播视频配置信息
                $homePollVideos = MainHomeManager::parsePollVideoConfig($homeConfig);
            }
            $configInfo->data = $videoList;
            $configInfo->homePollVideoList = $homePollVideos;
        }

        $configInfo->entryList = $entryList;
        return $configInfo;
    }

    /**
     * 获取渲染页面所需要的接口参数信息，如果redis缓存中存在，取缓存数据，否则通过网络接口获取参数并缓存数据
     * @param $areaCode
     * @param $platformType
     * @param $enterPosition
     * @return mixed|\stdClass
     */
    static public function getPageDataForModelV13($areaCode, $platformType, $enterPosition) {
        $pageConfigKey = RedisManager::$REDIS_HOME_CONFIG_V13 . "_" . CARRIER_ID;
        if ($areaCode) {
            $pageConfigKey .= "_$areaCode";
        }
        if ($platformType) {
            $pageConfigKey .= "_$platformType";
        }
        if ($enterPosition) {
            $pageConfigKey .= "_$enterPosition";
        }
        $pageConfig = RedisManager::getPageConfig($pageConfigKey);
        if ($pageConfig) {
            return json_decode($pageConfig);
        }
        $pageConfig = self::getPageDataForModelV13ByNetwork($areaCode, $platformType, $enterPosition);
        RedisManager::setPageConfig($pageConfigKey, json_encode($pageConfig));
        return $pageConfig;
    }

    /**
     * 网络接口获取页面配置所需数据
     * @param $areaCode
     * @param $platformType
     * @param $enterPosition
     * @return \stdClass
     */
    static private function getPageDataForModelV13ByNetwork($areaCode, $platformType, $enterPosition) {
        // 1、加载背景图信息
        $navigationIdArray = [CLASSIFY_TAB_1, CLASSIFY_TAB_2, CLASSIFY_TAB_3, CLASSIFY_TAB_4, CLASSIFY_TAB_5];
        $bgImageArray = SystemManager::getEpgThemePicture($navigationIdArray, $areaCode, $platformType, $enterPosition);
        // 2、加载导航栏信息并解析导航栏信息
        $navigationBarData = SystemAPI::getNavigationInfo();
        $navigationBar = self::parseNavigationBarData($navigationBarData);
        // 3、加载并解析首页配置信息
        $pageConfig = SystemAPI::getHomeConfigInfo();
        $recommendPositionList = $pageConfig->data->entry_list;
        $videoCarouseData = $pageConfig->data->home_video;
        $homePageConfig = self::parseHomePageConfig($recommendPositionList, $videoCarouseData, $platformType);
        // 4、获取视频点击播放旁行榜
        $rankDefaultCount = 30; // 默认获取30条数据
        if(CARRIER_ID == CARRIER_ID_JILIN_YD || CARRIER_ID == CARRIER_ID_GUANGDONGGD_NEW) {
            $rankDefaultCount = 6; // 吉林移动未限制获取条数会产生页面混乱问题
        }
        $videoPlayRank = VideoAPI::getVideoPlayRank(VideoAPI::$PLAY_VIDEO_RANK_OF_DAY, $rankDefaultCount);
        // 5、获取一级分类视频栏目
        $firstLevelClassVideo = VideoAPI::getVideoClass(null); // 传递null,默认获取一级分类
        // 6、获取所有专辑
        $allAlbum = AlbumAPI::getAllAlbum(AlbumAPI::$UI_ALBUM_TYPE, AlbumAPI::$ALL_VIDEO_PROGRAM_TYPE, FIRST_PAGE, PHP_INT_MAX, AlbumAPI::$ALBUM_ORDER_RULE_BY_TIME);
        // 7、加载首页跑马灯文案数据
        $marqueeContent = SystemManager::getMarqueeText();

        $pageData = new \stdClass();
        $pageData->bgImageArray = $bgImageArray;     // 所有栏目的背景图
        $pageData->navigationBar = $navigationBar;   // 导航栏配置信息
        $pageData->pageConfig = $pageConfig;
        $pageData->homePageConfig = $homePageConfig; // 首页配置信息
        $pageData->videoPlayRank = $videoPlayRank;   // 视频点击播放排行榜
        $pageData->firstLevelClassVideo = $firstLevelClassVideo; // 视频以及分类栏目
        $pageData->allAlbum = $allAlbum;             // 所有配置专辑信息
        $pageData->marqueeContent = $marqueeContent; // 跑马灯文案

        return $pageData; // 返回相关信息
    }

    /**
     * 解析CWS请求返回的导航页配置
     * @param: $navigationBarData 服务器的导航栏配置数据
     * @return \stdClass 解析之后的对象，包含导航栏名称数组和导航栏图片数组
     */
    static private function parseNavigationBarData($navigationBarData) {
        $navigationBar = new \stdClass();
        if ($navigationBarData && is_object($navigationBarData)
            && !empty($navigationBarData->data) && is_array($navigationBarData->data)) {
            foreach ($navigationBarData->data as $navigationBarItem) {
                $navigationBar->navigationNames[] = $navigationBarItem->navigate_name;
                $imgUrl = new \stdClass();
                $imgUrl->img_url = json_decode($navigationBarItem->img_url);
                $navigationBar->navigationImgs[] = $imgUrl;
            }
        }
        return $navigationBar;
    }

    /**
     * 解析首页配置数据
     * @param: $recommendPositionList 推荐位列表
     * @param: $videoCarouseData 轮播视频信息
     * @param: $platformType 高标清平台
     * @return \stdClass 首页配置
     */
    static public function parseHomePageConfig($recommendPositionList, $videoCarouseData, $platformType) {
        $homePageConfig = new \stdClass();
        $recommendVideoList = array(); // 配置的推荐视频列表
        $recommendVideoIndex = 0;
        $homePageRecommendPositionArray = MainHomeManager::$homePositionList[self::$HOME_PAGE_NAVIGATION_ID];
        foreach ($recommendVideoList as $key => $value) {
            if (in_array($value->position, $homePageRecommendPositionArray)) { // 从所有导航页的配置提取首页的配置信息
                //添加到数组中
                $recommendVideoList[$recommendVideoIndex++] = self::parseVideoInfo($value);
            }

            if ($value->position == self::$HOME_PAGE_RECOMMEND_POSITION_1) { // 解析首页一号推荐位配置信息
                $dataOfPosition1 = self::parseCarouse($value->item_data);
                $recommendPositionList[$key]->item_data = $dataOfPosition1;
                $homePageConfig->dataOfPosition1 = $dataOfPosition1;
            }
        }

        $videoCarouseObj = new \stdClass();
        $videoCarouseList = array();
        foreach ($videoCarouseData->list as $key => $value) {
            $videoCarouseList[$key] = self::parseVideoCarouse($value, $platformType);
        }

        $videoCarouseObj->count = $videoCarouseData->count;  //轮播条数
        $videoCarouseObj->list = $videoCarouseList;

        $homePageConfig->recommendVideoList = $recommendVideoList; // 推荐的视频列表
        $homePageConfig->videoCarouseObj = $videoCarouseObj; // 视频轮播对象
        $homePageConfig->recommendPositionList = $recommendPositionList; // 推荐位列表
        return $homePageConfig;
    }

    /**
     * 解析页面视频轮播数据
     * @param $videoObj
     * @param $platformType
     * @return \stdClass
     */
    static private function parseVideoCarouse($videoObj, $platformType) {
        $video = new \stdClass();
        $video->sourceId = $videoObj->source_id;
        $video->title = $videoObj->title;
        $video->userType = $videoObj->user_type;
        $video->modelType = $videoObj->model_type;
        $video->freeSeconds = $videoObj->free_seconds;
        $video->unionCode = $videoObj->union_code;
        $video->showStatus = $videoObj->show_status;

        //获取视频地址
        $videoUrl = json_decode($videoObj->ftp_url);
        $video->videoUrl = ($platformType == STB_TYPE_HD) ? $videoUrl->gq_ftp_url : $videoUrl->bq_ftp_url;
        return $video;
    }

    /**
     * 解析视频配置相关信息
     * @param: $videoConfig 原始视频信息
     * @param bool $isImageObj 管理后台配置视频封面图片有三种状态时需要解析对象
     * @return \stdClass
     */
    static private function parseVideoInfo($videoConfig, $isImageObj = false) {
        $videoInfo = new \stdClass();

        $videoInfo->position = $videoConfig->position;
        $itemData = $videoConfig->item_data[FIRST_ELEMENT_INDEX];
        if ($isImageObj) {
            $videoInfo->image_url = json_decode($itemData->img_url)->normal;
        } else {
            $videoInfo->image_url = $itemData->img_url;
        }
        $videoInfo->entryType = $itemData->entry_type;
        $videoInfo->order = $itemData->order;

        //解析视频ID
        $paramArr = json_decode($itemData->parameters);
        $videoInfo->source_id = $paramArr[FIRST_ELEMENT_INDEX]->param;

        // 解析视频内部参数
        $innerParams = json_decode($itemData->inner_parameters);
        $videoInfo->title = $innerParams->title;
        $videoInfo->model_type = $innerParams->model_type;
        $videoInfo->user_type = $innerParams->user_type;
        $videoInfo->play_url = $innerParams->ftp_url;
        $videoInfo->freeSeconds = $innerParams->free_seconds;
        $videoInfo->intro_image_url = $innerParams->intro_image_url;
        $videoInfo->intro_txt = $innerParams->intro_txt;
        $videoInfo->price = $innerParams->price;
        $videoInfo->valid_duration = $innerParams->valid_duration;
        $videoInfo->cornermark = $innerParams->cornermark;
        $videoInfo->union_code = $innerParams->union_code;
        $videoInfo->show_status = $innerParams->show_status;
        return $videoInfo;
    }

    /**
     * 解析推荐位置视频配置
     * @param $config
     * @return \stdClass
     */
    static private function parseVideoConfig($config, $classifyId) {
        $index = 0;
        $entryList = $config->data->entry_list;
        $videoList = array();
        $homePositionListItem = MainHomeManager::$homePositionList[$classifyId];
        foreach ($entryList as $value) {
            if (in_array($value->position, $homePositionListItem)) {
                $videoInfo = new \stdClass();

                $itemData = $value->item_data[0];
                $videoInfo->image_url = $itemData->img_url;
                $videoInfo->entryType = $itemData->entry_type;
                $videoInfo->order = $itemData->order;

                //解析视频ID
                $paramArr = json_decode($itemData->parameters);
                $videoInfo->source_id = $paramArr[0]->param;

                // 解析视频内部参数
                $innerParams = json_decode($itemData->inner_parameters);
                $videoInfo->title = $innerParams->title;
                $videoInfo->model_type = $innerParams->model_type;
                $videoInfo->user_type = $innerParams->user_type;
                $videoInfo->play_url = $innerParams->ftp_url;
                $videoInfo->freeSeconds = $innerParams->free_seconds;
                $videoInfo->position = $value->position;
                $videoInfo->intro_image_url = $innerParams->intro_image_url;
                $videoInfo->intro_txt = $innerParams->intro_txt;
                $videoInfo->price = $innerParams->price;
                $videoInfo->valid_duration = $innerParams->valid_duration;
                $videoInfo->cornermark = $innerParams->cornermark;
                $videoInfo->union_code = $innerParams->union_code;
                $videoInfo->show_status = $innerParams->show_status;
                //添加到数组中
                $videoList[$index++] = $videoInfo;  //添加到数组中

            }
        }

        return $videoList;
    }

    /**
     * 解析首页轮播数据
     * @param $config
     * @return \stdClass
     */
    static public function parsePollVideoConfig($config) {
        $platformType = MasterManager::getPlatformType();

        $configVideos = $config->data->home_video;
        $pollVideoList = array();    //首页轮播视频数组
        foreach ($configVideos->list as $key => $value) {
            $pollVideoList[$key] = self::parseVideoCarouse($value, $platformType);
        }

        $homePollVideos = new \stdClass();
        $homePollVideos->count = $configVideos->count;  //轮播条数
        $homePollVideos->list = $pollVideoList;

        return $homePollVideos;
    }

    /**
     * @Brief:此函数用于随机得到视频轮播里的一条contentId
     * @return: $contentId 内容ID
     */
    public static function getRandomContentIdByPollVideo() {
        $configInfo = MainHomeManager::loadHomePageInfo(); //加载首页推荐配置信息
        $data = $configInfo->homePollVideoList;
        if ($data->count <= 0) {
            return "";
        }

        $dataList = $data->list;
        $dataLength = count($dataList);
        if ($dataLength == 0) {
            return "";
        } else {
            // 随机抽取一个视频内容 得到的内容在[0---length-1之间],
            $idx = rand(0, $dataLength - 1);
        }

        // 得到随机索引对应的内容
        $item = $dataList[$idx];
        $contentId = $item->videoUrl;

        return $contentId;
    }

    /**
     * 解析首页轮播数据
     * @param $config
     * @return \stdClass
     */
    static private function parsePollVideoConfigV7($config) {
        $platformType = MasterManager::getPlatformType();

        $configVideos = $config->data->home_video;
        $pollVideoList = array();    //首页轮播视频数组
        foreach ($configVideos->list as $key => $value) {
            $videoInfo = new \stdClass();
            $videoInfo->sourceId = $value->source_id;
            $videoInfo->title = $value->title;
            $videoInfo->userType = $value->user_type;
            $videoInfo->modelType = $value->model_type;
            $videoInfo->freeSeconds = $value->free_seconds;
            $videoInfo->durationTime = $value->duration;
            $videoInfo->imgUrl = $value->image_url;
            $videoInfo->showStatus = $value->show_status;
            //获取视频地址
            $videoUrl = json_decode($value->ftp_url);
            $videoInfo->videoUrl = ($platformType == STB_TYPE_HD) ? $videoUrl->gq_ftp_url : $videoUrl->bq_ftp_url;

            $pollVideoList[$key] = $videoInfo;
        }

        $homePollVideos = new \stdClass();
        $homePollVideos->count = $configVideos->count;  //轮播条数
        $homePollVideos->list = $pollVideoList;

        return $homePollVideos;
    }

    /**
     * 拉取宁夏便民药店区域一二级列表
     * 13021接口
     */
    static public function loadAreaList() {
        $areaList = SystemAPI::getAreaList();
        return $areaList;
    }
}