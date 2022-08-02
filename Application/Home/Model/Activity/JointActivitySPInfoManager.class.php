<?php
/**
 * @brief: 此类用于生成联合活动第三方SP的信息
 */

namespace Home\Model\Activity;

use Home\Model\Common\LogUtils;
use Home\Model\Common\SessionManager;
use Home\Model\Entry\MasterManager;

class JointActivitySPInfoManager
{
    /**
     * @brief: 根据活动标识来选择哪个活动的sp信息
     * @param $subId
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed|null
     */
    public static function getSPInfoJointActivity($subId, $platformTypeExt)
    {
        switch ($subId) {
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_ANSWER20180514:
                $info = self::getSPInfoJointActivityAnswer20180514($platformTypeExt);
                break;

            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_SURFING20180627:
                $info = self::getSPInfoJointActivitySurfing20180627($platformTypeExt);
                break;

            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_SEA20180712:
                $info = self::getSPInfoJointActivitySea20180712($platformTypeExt);
                break;

            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_CLEANING20180716:
                $info = self::getSPInfoJointActivityCleaning20180716($platformTypeExt);
                break;

            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_VISIT20180716:
                $info = self::getSPInfoJointActivityVisit20180716($platformTypeExt);
                break;

            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_JUMPING20180719:
                $info = self::getSPInfoJointActivityJumping20180719($platformTypeExt);
                break;

            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_MID_AUTUMN20180815:
                $info = self::getSPInfoJointActivityMidAutumn20180815($platformTypeExt);
                break;

            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_MONEY_TREE20180917:
                $info = self::getSPInfoJointActivityMoneyTree20180917($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_WORDSPUZZLE20190124:
                $info = self::getSPInfoJointActivityWordsPuzzle20190124($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_GROWING_UP20190517:
                $info = self::getSPInfoJJointActivityGrowingUp20190517($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITYREFUSECLASSIFICATION20190808:
                $info = self::getSPInfoJJointActivityRefuseClassification20190808($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITYHURDLE20191113:
                $info = self::getSPInfoJointActivityHurdle20191113($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_WOMENDAY20200225:
                $info = self::getSPInfoJointActivityWomenDay20200225($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_FEED_CATS_ON_VACATION20200727:
                $info = self::getSPInfoJointActivityFeedCatsOnVacation20200727($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_LABA_RACE20201228:
                $info = self::getSPInfoJointActivityLaBaRace20201228($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_APRIL_RACE20210318:
                $info = self::getSPInfoJointActivityApril20210318($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_JOINT_ACTIVITY_HEALTHY_RACE20210318:
                $info = self::JointActivityHealthyLife20211228($platformTypeExt);
                break;
            case ActivityConstant::SUB_ID_ACTIVITY_SUMMER_REFRESH_NEW:
                $info = self::JointActivitySummerUpUp20220523($platformTypeExt);
                break;
            default:
                $info = null;
        }

        return $info;
    }

    /**
     * @brief: 跨栏运动-山西（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJointActivityHurdle20191113($platformTypeExt)
    {
        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://" . $_SERVER['HTTP_HOST'] . "/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");
        // 亲子乐园
        $info['qzlyx'] = array('spid' => SPID, 'productId' => "cartooncitybyli025@207",
            'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
            'goHomeUrl' => "http://202.99.114.63:35807/cartoonCity/homePage.html?");

        // 欢乐歌房
        $info['hlgf'] = array('spid' => SPID, 'productId' => "hlgfby020@207",
            'contentId' => "hlgf", 'serviceId' => "hlgfby020", 'desc' => "欢乐歌房",
            'goHomeUrl' => "http://202.99.114.152:26800/joymusic_bs_tjlt/?payType=1");

        // 沃家教育
        $info['hnjyzq'] = array('spid' => SPID, 'productId' => "lwjjyby029@207",
            'contentId' => "hnjyzq", 'serviceId' => "hlgfby020", 'desc' => "沃家教育",
            'goHomeUrl' => "http://202.99.114.152:29400/frontend/welcome/home.htm?welcome=1");

        // 快乐星球
        $info['klxq'] = array('spid' => SPID, 'productId' => "msyhklxqliby020@207",
            'contentId' => "klxq", 'serviceId' => "msyhklxqliby020", 'desc' => "快乐星球",
            'goHomeUrl' => "http://202.99.114.152:31400/kidbus/welcome/home.htm?welcome=shouye");

        return $info;
    }

    /**
     * @brief: 垃圾分类-山西/贵州（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJJointActivityRefuseClassification20190808($platformTypeExt)
    {

        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://" . $_SERVER['HTTP_HOST'] . "/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // 橙子动漫
        $info['czdm'] = array('spid' => SPID, 'productId' => "cshdczdmliby025@207",
            'contentId' => "czdm", 'serviceId' => "czdmbyfw", 'desc' => "橙子动漫",
            'goHomeUrl' => "http://202.99.114.74:58104/czdm_hd/iptv/BookActionTJ.do?method=login&bid=1");

        // 涂涂乐园
        $info['yqdsnly'] = array('spid' => SPID, 'productId' => "yqdsnlyby020@207",
            'contentId' => "yqdsnly", 'serviceId' => "", 'desc' => "涂涂乐园",
            'goHomeUrl' => "http://202.99.114.74:56350/DisneyTown/SubscriptionService?plas=s");

        // 麦唱
        $info['yymc'] = array('spid' => SPID, 'productId' => "yymcby020@207",
            'contentId' => "yymc", 'serviceId' => "yymcby020", 'desc' => "麦唱",
            'goHomeUrl' => "http://202.99.114.152:22400/mctv-v20/login.html?plas=void");


        // 欢乐歌房
        $info['hlgf'] = array('spid' => SPID, 'productId' => "hlgfby020@223",
            'contentId' => "hlgf", 'serviceId' => "hlgfby020", 'desc' => "欢乐歌房",
            'goHomeUrl' => "http://202.99.114.74:58733/TJ_HappySong/iptv/index.do?");

        // 悟空乐园
        $info['wkly'] = array('spid' => SPID, 'productId' => "swwklyby020@223",
            'contentId' => "wkly", 'serviceId' => "wklyby020", 'desc' => "悟空乐园",
            'goHomeUrl' => "http://202.99.114.74:54006/IptvOdyGame/jsp/login_lt.jsp?plas=s");

        // 乐宝卡通
        $info['lbkt'] = array('spid' => SPID, 'productId' => "cbhdlbktby025@223",
            'contentId' => "lbkt", 'serviceId' => "cbhdlbktby", 'desc' => "乐宝卡通",
            'goHomeUrl' => "http://202.99.114.152:22400/happyBaby/login.html?plas=s");

        return $info;
    }

    /**
     * @brief: 冲浪大作战-内蒙（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJointActivitySurfing20180627($platformTypeExt)
    {
        //如果是冲浪联合活动

        // 橙子动漫
        $info['czdm'] = array('spid' => SPID, 'productId' => "cshdczdmliby025@208",
            'contentId' => "czdm", 'serviceId' => "czdmbyfw", 'desc' => "橙子动漫",
            'goHomeUrl' => "http://202.99.114.74:58104/czdm_hd/iptv/BookActionTJ.do?method=login&bid=1");

        // 悦享生活
        $info['yxsh'] = array('spid' => SPID, 'productId' => "yxshby024@208",
            'contentId' => "yxsh", 'serviceId' => "yxshby024", 'desc' => "悦享生活",
            'goHomeUrl' => "http://202.99.114.28:8300/app_redirect/life/life/?zsj_from=1?");

        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // 优宝乐园
        $info['ybly'] = array('spid' => SPID, 'productId' => "tjlhyblybyl020@208",
            'contentId' => "ybly", 'serviceId' => "tjlhyblybyl020", 'desc' => "优宝乐园",
            'goHomeUrl' => "http://202.99.114.74:52116/hyperion.chimera/index.jsp?");

        return $info;
    }

    /**
     * @brief: 伍月感恩季，答题赢好礼-贵州（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJointActivityAnswer20180514($platformTypeExt)
    {
        $platformTypeExt = MasterManager::getPlatformTypeExt();
        // 玩具秀
        $info['jrwjx'] = array('spid' => SPID, 'productId' => "jrwjxby@223",
            'contentId' => "jrwjx", 'serviceId' => "jrwjxby020", 'desc' => "玩具秀",
            'goHomeUrl' => "http://202.99.114.74:17011/toyshow/tv/Epgwelcome.jsp?entrance=8");

        // 天天电竞
        $info['ttdjhd'] = array('spid' => SPID, 'productId' => "ttdjby015@223",
            'contentId' => "ttdjhd", 'serviceId' => "ttdjbyfw", 'desc' => "天天电竞",
            'goHomeUrl' => "http://202.99.114.63:30223/demo-hd/login_epg.jsp?");

        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // 乐享音乐
        $info['drlxyy'] = array('spid' => SPID, 'productId' => "lxyyby020@223",
            'contentId' => "drlxyy", 'serviceId' => "drlxyy020", 'desc' => "乐享音乐",
            'goHomeUrl' => "http://202.99.114.28:25603/epg_lx_hd/login.jsp?AccessId=02lxH_1000000_gg_yysc_00");

        return $info;
    }

    /**
     * @brief: 海洋世界探险记
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJointActivitySea20180712($platformTypeExt)
    {
        return self::getSPInfoJointActivitySurfing20180627($platformTypeExt);
    }

    /**
     * 米奇之家
     * @param $platformTypeExt
     * @return mixed
     */
    private static function getSPInfoJointActivityCleaning20180716($platformTypeExt)
    {
        // 涂涂乐园
        $info['yqdsnly'] = array('spid' => SPID, 'productId' => "yqdsnlyby020@208",
            'contentId' => "yqdsnly", 'serviceId' => "", 'desc' => "涂涂乐园",
            'goHomeUrl' => "http://202.99.114.74:56350/DisneyTown/SubscriptionService?");

        // 乐游王国
        $info['lywg'] = array('spid' => SPID, 'productId' => "%23oylywg%40208",
            'contentId' => "lywg", 'serviceId' => "", 'desc' => "乐游王国",
            'goHomeUrl' => "http://202.99.114.28:8083/oytjby/user/hall?");

        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // 优宝乐园
        $info['ybly'] = array('spid' => SPID, 'productId' => "tjlhyblybyl020@208",
            'contentId' => "ybly", 'serviceId' => "tjlhyblybyl020", 'desc' => "优宝乐园",
            'goHomeUrl' => "http://202.99.114.74:52116/hyperion.chimera/index.jsp?");

        return $info;
    }

    /**
     * 弹跳床
     * @param $platformTypeExt
     * @return mixed
     */
    private static function getSPInfoJointActivityJumping20180719($platformTypeExt)
    {
        // 橙子动漫
        $info['czdm'] = array('spid' => SPID, 'productId' => "cshdczdmliby025@208",
            'contentId' => "czdm", 'serviceId' => "czdmbyfw", 'desc' => "橙子动漫",
            'goHomeUrl' => "http://202.99.114.74:58104/czdm_hd/iptv/BookActionTJ.do?method=login&bid=1");

        // 悦享生活
        $info['yxsh'] = array('spid' => SPID, 'productId' => "yxshby024@208",
            'contentId' => "yxsh", 'serviceId' => "yxshby024", 'desc' => "悦享生活",
            'goHomeUrl' => "http://202.99.114.28:8300/app_redirect/life/life/?zsj_from=1?");

        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // 优宝乐园
        $info['ybly'] = array('spid' => SPID, 'productId' => "tjlhyblybyl020@208",
            'contentId' => "ybly", 'serviceId' => "tjlhyblybyl020", 'desc' => "优宝乐园",
            'goHomeUrl' => "http://202.99.114.74:52116/hyperion.chimera/index.jsp?");

        return $info;
    }

    /**
     * @brief: 天下名医，服务基层
     * @param $platformTypeExt
     * @return mixed
     */
    private static function getSPInfoJointActivityVisit20180716($platformTypeExt)
    {
        // 风车乐园
        $info['xcfcly'] = array('spid' => SPID, 'productId' => "xcfclyby025@207",
            'contentId' => "xcfcly", 'serviceId' => "xcyx1", 'desc' => "风车乐园",
            'goHomeUrl' => "http://202.99.114.28:9080/IPTV_Advance/tianjinLT/jumpFengChe.jsp?InType=0&gameid=72");

        // 智慧星球
        $info['zhxq'] = array('spid' => SPID, 'productId' => "zhxqby025@207",
            'contentId' => "zhxq", 'serviceId' => "zhxq025", 'desc' => "智慧星球",
            'goHomeUrl' => "http://202.99.114.28:9696/tqjy-epg/index.jsp?");

        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // 乐享音乐
        $info['drlxyy'] = array('spid' => SPID, 'productId' => "lxyyby020@207",
            'contentId' => "drlxyy", 'serviceId' => "drlxyy020", 'desc' => "乐享音乐",
            'goHomeUrl' => "http://202.99.114.28:25603/epg_lx_sd/login.jsp?AccessId=02lxS_1000000_gg_yysc_00");

        return $info;
    }

    /**
     * @brief: 月饼欢乐送
     * @param $platformTypeExt
     * @return mixed
     */
    private static function getSPInfoJointActivityMidAutumn20180815($platformTypeExt)
    {
        // TODO 风车乐园
        $info['xcfcly'] = array('spid' => SPID, 'productId' => "xcfclyby025@207",
            'contentId' => "xcfcly", 'serviceId' => "xcyx1", 'desc' => "风车乐园",
            'goHomeUrl' => "http://202.99.114.28:9080/IPTV_Advance/tianjinLT/jumpFengChe.jsp?InType=0&gameid=72");

        // TODO 智慧星球
        $info['zhxq'] = array('spid' => SPID, 'productId' => "zhxqby025@207",
            'contentId' => "zhxq", 'serviceId' => "zhxq025", 'desc' => "智慧星球",
            'goHomeUrl' => "http://202.99.114.28:9696/tqjy-epg/index.jsp?");

        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // TODO 乐享音乐
        $info['drlxyy'] = array('spid' => SPID, 'productId' => "lxyyby020@207",
            'contentId' => "drlxyy", 'serviceId' => "drlxyy020", 'desc' => "乐享音乐",
            'goHomeUrl' => "http://202.99.114.28:25603/epg_lx_sd/login.jsp?AccessId=02lxS_1000000_gg_yysc_00");

        return $info;
    }

    /**
     * @brief: 月饼欢乐送
     * @param $platformTypeExt
     * @return mixed
     */
    private static function getSPInfoJointActivityMoneyTree20180917($platformTypeExt)
    {
        // TODO 风车乐园
        $info['xcfcly'] = array('spid' => SPID, 'productId' => "xcfclyby025@207",
            'contentId' => "xcfcly", 'serviceId' => "xcyx1", 'desc' => "风车乐园",
            'goHomeUrl' => "http://202.99.114.28:9080/IPTV_Advance/tianjinLT/jumpFengChe.jsp?InType=0&gameid=72");

        // TODO 智慧星球
        $info['zhxq'] = array('spid' => SPID, 'productId' => "zhxqby025@207",
            'contentId' => "zhxq", 'serviceId' => "zhxq025", 'desc' => "智慧星球",
            'goHomeUrl' => "http://202.99.114.28:9696/tqjy-epg/index.jsp?");

        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // TODO 乐享音乐
        $info['drlxyy'] = array('spid' => SPID, 'productId' => "lxyyby020@207",
            'contentId' => "drlxyy", 'serviceId' => "drlxyy020", 'desc' => "乐享音乐",
            'goHomeUrl' => "http://202.99.114.28:25603/epg_lx_sd/login.jsp?AccessId=02lxS_1000000_gg_yysc_00");

        return $info;
    }

    /**
     * @brief: 猜字谜
     * @param $platformTypeExt
     * @return mixed
     */
    private static function getSPInfoJointActivityWordsPuzzle20190124($platformTypeExt)
    {
        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        // TODO 百映
        $info['byysh'] = array('spid' => SPID, 'productId' => "byysh30t34Linux@211",
            'contentId' => "byysh", 'serviceId' => "byysh30t29Linux", 'desc' => "百映",
            'goHomeUrl' => "http://202.99.114.28:43001/index.jsp?lcn=sy&");

        // TODO 欢乐歌房
        $info['hlgf'] = array('spid' => SPID, 'productId' => "hlgfby020@201",
            'contentId' => "hlgf", 'serviceId' => "hlgfby020", 'desc' => "欢乐歌房",
            'goHomeUrl' => "http://202.99.114.74:58733/TJ_HappySong/iptv/hdhome/index.do?");

        return $info;
    }

    /**
     * @brief: 女神计划，打造靓丽的你主页（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJointActivityWomenDay20200225($platformTypeExt)
    {
        $areaCode = MasterManager::getAreaCode();
        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        if ($areaCode == '216') {
            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "car乐享tooncitybyli025@216",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.63:35807/cartoonCity/homePage.html?");


            // TODO 乐享音乐
            $info['drlxyy'] = array('spid' => SPID, 'productId' => "lxyyby020@216",
                'contentId' => "drlxyy", 'serviceId' => "drlxyy020", 'desc' => "欢乐歌房",
                'goHomeUrl' => "http://202.99.114.152:29800/epg_lx_sd/login.jsp?AccessId=02lxS_1000000_gg_yysc_01");

            // TODO 掌厨
            $info['zc'] = array('spid' => SPID, 'productId' => "zcby25@204",
                'contentId' => "zc", 'serviceId' => "zcby25", 'desc' => "魔法图书馆",
                'goHomeUrl' => "http://202.99.114.152:32209/html/welcome.html?");
        } else if ($areaCode == '207') {
            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "car乐享tooncitybyli025@207",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.63:35807/cartoonCity/homePage.html?");

            // TODO 萌宝星空
            $info['yyly'] = array('spid' => SPID, 'productId' => "drmbxk19@207",
                'contentId' => "yyly", 'serviceId' => "drby25y", 'desc' => "萌宝星空",
                'goHomeUrl' => "http://202.99.114.152:29800/epg_mbxk_sd/login.jsp?AccessId=02xkS_1000000_gg_yysc_00");

            // TODO 乐享音乐
            $info['drlxyy'] = array('spid' => SPID, 'productId' => "lxyyby020@207",
                'contentId' => "drlxyy", 'serviceId' => "drlxyy020", 'desc' => "欢乐歌房",
                'goHomeUrl' => "http://202.99.114.152:29800/epg_lx_sd/login.jsp?AccessId=02lxS_1000000_gg_yysc_00");
        } else if ($areaCode == '209') {
            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "car乐享tooncitybyli025@209",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.63:35807/cartoonCity/homePage.html?");

            // TODO 萌宝星空
            $info['yyly'] = array('spid' => SPID, 'productId' => "drmbxk19@209",
                'contentId' => "yyly", 'serviceId' => "drby25y", 'desc' => "萌宝星空",
                'goHomeUrl' => "http://202.99.114.152:29800/epg_mbxk_sd/login.jsp?AccessId=02xkS_1000000_gg_yysc_00");

            // TODO 乐享音乐
            $info['drlxyy'] = array('spid' => SPID, 'productId' => "lxyyby020@209",
                'contentId' => "drlxyy", 'serviceId' => "drlxyy020", 'desc' => "欢乐歌房",
                'goHomeUrl' => "http://202.99.114.152:29800/epg_lx_sd/login.jsp?AccessId=02lxS_1000000_gg_yysc_00");
        }
        return $info;
    }


    /**
     * @brief: 猜字谜
     * @param $platformTypeExt
     * @return mixed
     */
    private static function getSPInfoJJointActivityGrowingUp20190517($platformTypeExt)
    {
        $areaCode = MasterManager::getAreaCode();
        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        if ($areaCode == '209') {
            // TODO 宝宝卡通
            $info['lbkt'] = array('spid' => SPID, 'productId' => "cbhdlbktby025@209",
                'contentId' => "lbkt", 'serviceId' => "cbhdlbktby", 'desc' => "宝宝卡通",
                'goHomeUrl' => "http://202.99.114.74:58215/happyBaby/login.html?");

            // TODO 欢乐歌房
            $info['hlgf'] = array('spid' => SPID, 'productId' => "hlgfby020",
                'contentId' => "hlgf", 'serviceId' => "hlgfby020", 'desc' => "欢乐歌房",
                'goHomeUrl' => "http://202.99.114.74:52502/mftsg/index?");

            // TODO 魔法图书馆
            $info['yysjmftsg'] = array('spid' => SPID, 'productId' => "yysjmftsgby020@209",
                'contentId' => "yysjmftsg", 'serviceId' => "yysjmftsgby020", 'desc' => "魔法图书馆",
                'goHomeUrl' => "http://202.99.114.74:52502/mftsg/index?");
        } else {
            // TODO 沃家教育
            $info['hnjyzq'] = array('spid' => SPID, 'productId' => "lhnjyzq029@216",
                'contentId' => "hnjyzq", 'serviceId' => "hnjyzq", 'desc' => "沃家教育",
                'goHomeUrl' => "http://202.99.114.74:58391/tjlt_linux/stage/index/index.html?");

            // TODO 炫佳乐园
            $info['xjktHD'] = array('spid' => SPID, 'productId' => "xjkt025@216",
                'contentId' => "xjktHD", 'serviceId' => "njxjby025", 'desc' => "炫佳乐园",
                'goHomeUrl' => "http://202.99.114.74:58906/xjcartoon_FrontEndWeb/index.jsp?");

            // TODO 魔法图书馆
            $info['yysjmftsg'] = array('spid' => SPID, 'productId' => "yysjmftsgby020@216",
                'contentId' => "yysjmftsg", 'serviceId' => "yysjmftsgby020", 'desc' => "魔法图书馆",
                'goHomeUrl' => "http://202.99.114.74:52502/mftsg/index?");
        }

        return $info;
    }

    /**
     * @brief: 暑期计划，喂饱喵小肥（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJointActivityFeedCatsOnVacation20200727($platformTypeExt)
    {
        $areaCode = MasterManager::getAreaCode();
        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        if ($areaCode == '208') {   //内蒙
            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "cartooncitybyli025@208",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.27:35810/cartoonCity/homePage.html?");

            // TODO 沃家健身
            $info['wjjs'] = array('spid' => SPID, 'productId' => "wjjsby029@208",
                'contentId' => "wjjs", 'serviceId' => "wjjsby029", 'desc' => "沃家健身",
                'goHomeUrl' => "http://202.99.114.152:44603/index?");

            // TODO 舞动空间
            $info['zyatb'] = array('spid' => SPID, 'productId' => "atbby025linux@208",
                'contentId' => "zyatb", 'serviceId' => "atbby025linux", 'desc' => "舞动空间",
                'goHomeUrl' => "http://202.99.114.152:30801/atb_cucc_tj/index.jsp?ac=login");
        } else if ($areaCode == '209') {    //辽宁
            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "cartooncitybyli025@209",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.27:35810/cartoonCity/homePage.html?");

            // TODO 沃家健身
            $info['wjjs'] = array('spid' => SPID, 'productId' => "drmbxk19@207",
                'contentId' => "wjjs", 'serviceId' => "wjjsby029", 'desc' => "沃家健身",
                'goHomeUrl' => "http://202.99.114.152:44603/index?");

            // TODO 米卡乐园
            $info['bsmkly'] = array('spid' => SPID, 'productId' => "bsmklyliby020@209",
                'contentId' => "bsmkly", 'serviceId' => "bsmklyliby", 'desc' => "米卡乐园",
                'goHomeUrl' => "http://202.99.114.152:21605/mika_tjlt/index.htm?");
        } else if ($areaCode == '204') {     //河南
            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "cartooncitybyli025@204",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.27:35810/cartoonCity/homePage.html?");

            // TODO 米卡乐园
            $info['bsmkly'] = array('spid' => SPID, 'productId' => "bsmklyliby020@204",
                'contentId' => "bsmkly", 'serviceId' => "bsmklyliby", 'desc' => "米卡乐园",
                'goHomeUrl' => "http://202.99.114.152:21605/mika_tjlt/index.htm?");

            // TODO 沃家音乐
            $info['hlgf'] = array('spid' => SPID, 'productId' => "hlgfby020@204",
                'contentId' => "hlgf", 'serviceId' => "wjyyby", 'desc' => "沃家音乐",
                'goHomeUrl' => "http://202.99.114.152:26800/joymusic_bs_tjlt/?");
        } else if ($areaCode == '216') {     //山东
            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "cartooncitybyli025@216",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.27:35810/cartoonCity/homePage.html?");

            // TODO 悟空乐园
            $info['wkly'] = array('spid' => SPID, 'productId' => "swwklyby020@216",
                'contentId' => "wkly", 'serviceId' => "wklyby020", 'desc' => "悟空乐园",
                'goHomeUrl' => "http://202.99.114.152:21400/IptvOdyGame/jsp/login_lt.jsp?");

            // TODO 米卡乐园
            $info['bsmkly'] = array('spid' => SPID, 'productId' => "bsmklyliby020@216",
                'contentId' => "bsmkly", 'serviceId' => "bsmklyliby", 'desc' => "米卡乐园",
                'goHomeUrl' => "http://202.99.114.152:21605/mika_tjlt/index.htm?");
        } else if ($areaCode == '207') {     //山西
            //获取相关入口参数
            $epgInfoMap = MasterManager::getEPGInfoMap();
            // TODO 健康魔方
            $info['jkmf'] = array('spid' => SPID, 'productId' => "jkmfby25@207",
                'contentId' => "jkmf", 'serviceId' => "jkmfby25", 'desc' => "健康魔方",
                'goHomeUrl' => "http://202.99.114.152:30278/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=10000051&lmp=2");

            // TODO 嗨少儿
            $info['sxgdyseby'] = array('spid' => SPID, 'productId' => "2400032603@207",
                'contentId' => "sxgdyseby", 'serviceId' => "sxgdyseby", 'desc' => "嗨少儿",
                'goHomeUrl' => "http://202.99.114.60:5138/activeLinkExRedirect?userId=" . $epgInfoMap['UserID'] . "&carrierid=207&entranceType=020&tvplat=hw");

            // TODO 开心乐园
            $info['czly'] = array('spid' => SPID, 'productId' => "jrkxly25@207",
                'contentId' => "czly", 'serviceId' => "jrczly029", 'desc' => "开心乐园",
                'goHomeUrl' => "http://202.99.114.152:27812/educationhd/tv/login.action?ent=6");


            $arr = parse_url($epgInfoMap['epgDomain']);
            $epgDomain = $arr['scheme'] . "://" . $arr['host'] . ":" . $arr['port'];
            $stbModel = MasterManager::getSTBModel();
            LogUtils::info("Activity epgDomain :" . $epgDomain . ">>>>  Activity stbModel :" . $stbModel);

            // 中兴盒子B 字母开头，其他为华为盒子
            if (substr($stbModel, 0, 1) == 'B') {
                $hysUrl = $epgDomain . "/iptvepg/frame65/launcher/index.html?shp_focus_area=shp_flow_box_3_0&shp_focus_idx=0&shp_instance_id=5f539c4615f48f329ff4f3cb875429ab&shp_scroll_top=0";
            } else {
                $hysUrl = $epgDomain . "/EPG/jsp/yst2/en/launcher/index.html?shp_focus_area=shp_flow_box_3_0&shp_focus_idx=0&shp_instance_id=5f539c4615f48f329ff4f3cb875429ab&shp_scroll_top=0";
            };
            // TODO 嗨影视
            $info['sxgdysrhyb'] = array('spid' => SPID, 'productId' => "2400032632@207",
                'contentId' => "sxgdysrhyb", 'serviceId' => "sxgdysrhyb", 'desc' => "嗨影视",
                'goHomeUrl' => $hysUrl);
        }
        return $info;
    }

    /**
     * @brief: 腊八粥（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJointActivityLaBaRace20201228($platformTypeExt)
    {
        $areaCode = MasterManager::getAreaCode();
        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        if ($areaCode == '208') {   //内蒙
            //TODO  沃家教育
            $info['hnjyzq'] = array('spid' => SPID, 'productId' => "lwjjyby029@207",
                'contentId' => "hnjyzq", 'serviceId' => "hlgfby020", 'desc' => "沃家教育",
                'goHomeUrl' => "http://202.99.114.152:29400/ylkj_jy_80/welcome/home.htm?welcome=1");

            // TODO 战地总动员
            $info['hxlm'] = array('spid' => SPID, 'productId' => "hxlmby020@208",
                'contentId' => "hxlm", 'serviceId' => "hxlm", 'desc' => "战地总动员",
                'goHomeUrl' => "http://202.99.114.152:20600/ft_web_game/cf_league/index.jsp?");
            // TODO 悟空乐园
            $info['wkly'] = array('spid' => SPID, 'productId' => "swwklyby020@208",
                'contentId' => "wkly", 'serviceId' => "wklyby020", 'desc' => "悟空乐园",
                'goHomeUrl' => "http://202.99.114.152:21400/IptvOdyGame/jsp/login_lt.jsp?");
        } else if ($areaCode == '216') {     //山东
            //获取相关入口参数
            //TODO 乐享音乐
            $info['drlxyy'] = array('spid' => SPID, 'productId' => "lxyyby020@216",
                'contentId' => "drlxyy", 'serviceId' => "drlxyy020", 'desc' => "乐享音乐",
                'goHomeUrl' => "http://202.99.114.152:29800/epg_lx_hd/login.jsp?AccessId=02lxH100202011161109348");

            // TODO 快乐星球
            $info['klxq'] = array('spid' => SPID, 'productId' => "msyhklxqliby020@207",
                'contentId' => "klxq", 'serviceId' => "msyhklxqliby020", 'desc' => "快乐星球",
                'goHomeUrl' => "http://202.99.114.152:31400/kidbus/welcome/home.htm?welcome=shouye");

            // TODO M电音
            $info['mdy'] = array('spid' => SPID, 'productId' => "mdyby@216",
                'contentId' => "mdy", 'serviceId' => "mdyby25", 'desc' => "M电音",
                'goHomeUrl' => "http://202.99.114.152:43205/Dianyin/jsp/loginTJLT.jsp?enterType=zs");
        } else if ($areaCode == '207') {     //山西

            // TODO 沃家音乐
            $info['hlgf'] = array('spid' => SPID, 'productId' => "hlgfby020@207",
                'contentId' => "hlgf", 'serviceId' => "hlgfby020", 'desc' => "沃家音乐",
                'goHomeUrl' => "http://202.99.114.152:26800/joymusic_bs_tjlt/?");

            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "cartooncitybyli025@207",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.27:35810/cartoonCity/homePage.html?");

            // TODO 沃家健身
            $info['wjjs'] = array('spid' => SPID, 'productId' => "wjjsby029@207",
                'contentId' => "wjjs", 'serviceId' => "wjjsby029", 'desc' => "沃家健身",
                'goHomeUrl' => "http://202.99.114.152:44603/static/shanxi_lhhd.html?");


        }
        return $info;
    }
    /**
     * @brief: 愚翻天（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function getSPInfoJointActivityApril20210318($platformTypeExt)
    {
        $areaCode = MasterManager::getAreaCode();
        // 39健康
        $info[CONTENT_ID] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "39健康",
            'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=$platformTypeExt&lmcid=000051&lmsid=0");

        if ($areaCode == '208') {   //内蒙
            //TODO  亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "cartooncitybyli025@208",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.27:35810/cartoonCity/homePage.html?");
            // TODO 绘本立体阅读	 							25
            $info['hbltyd'] = array('spid' => SPID, 'productId' => "sxhlhbltydliby025@208",
                'contentId' => "hbltyd", 'serviceId' => "ltyd", 'desc' => "绘本立体阅读",
                'goHomeUrl' => "http://202.99.114.152:32212/html/index.html?");
            // TODO 沃家音乐				20
            $info['wjyybs'] = array('spid' => SPID, 'productId' => "xwjyyby020@208",
                'contentId' => "wjyybs", 'serviceId' => "wjyyby", 'desc' => "沃家音乐",
                'goHomeUrl' => "http://202.99.114.152:26800/joymusic_bs_tjlt/?");
        } else if ($areaCode == '216') {     //山东
            //获取相关入口参数
            //TODO 食乐汇  define('SPID', "96596");
            //define('SERVICE_ID', "jkmfby25");          // 服务ID
            //define('CONTENT_ID', "jkmf");          // 内容ID
            //define('PRODUCT_ID', "jkmfby25");
            $info['jkmf'] = array('spid' => SPID, 'productId' => "jkmfby25linux@216",
                'contentId' => "jkmf", 'serviceId' => "jkmfby25", 'desc' => "魔方",
                'goHomeUrl' => "http://202.99.114.152:30278/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=10000051&lmp=108&lmacid=216?");
            // TODO M电音
            $info['mdy'] = array('spid' => SPID, 'productId' => "mdyby@216",
                'contentId' => "mdy", 'serviceId' => "mdyby25", 'desc' => "M电音",
                'goHomeUrl' => "http://202.99.114.152:43205/Dianyin/jsp/loginTJLT.jsp?enterType=zs?");
            // TODO 老年大学
            $info['lndx'] = array('spid' => SPID, 'productId' => "lndxby25@216",
                'contentId' => "lndx", 'serviceId' => "lndxby25", 'desc' => "老年大学",
                'goHomeUrl' => "http://202.99.114.152:26001/lndx/home/index.html?");
             // TODO 快乐星球
            $info['klxq'] = array('spid' => SPID, 'productId' => "msyhklxqlibyx025@216",
                'contentId' => "klxq", 'serviceId' => "msyhklxqliby020", 'desc' => "快乐星球",
                'goHomeUrl' => "http://202.99.114.152:31400/kidbus/welcome/home.htm?welcome=shouye");
        } else if ($areaCode == '207') {     //山西
            // TODO 食乐汇
            $info['sjjklinux'] = array('spid' => SPID, 'productId' => "sjjkby25linux@207",
                'contentId' => "sjjklinux", 'serviceId' => "sjjkby015", 'desc' => "食乐汇",
                'goHomeUrl' => "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=hd&lmcid=000051&lmsid=0&lmp=0?");
            // TODO 亲子乐园
            $info['qzlyx'] = array('spid' => SPID, 'productId' => "cartooncitybyli025@207",
                'contentId' => "qzlyx", 'serviceId' => "cartoonCityby020", 'desc' => "亲子乐园",
                'goHomeUrl' => "http://202.99.114.27:35810/cartoonCity/homePage.html?");
            // TODO 沃家音乐
            $info['wjyybs'] = array('spid' => SPID, 'productId' => "xwjyyby020@207",
                'contentId' => "wjyybs", 'serviceId' => "wjyyby", 'desc' => "沃家音乐",
                'goHomeUrl' => "http://202.99.114.152:26800/joymusic_bs_tjlt/?");
            // TODO 沃家电竞
            $info['jqcs'] = array('spid' => SPID, 'productId' => "djdtdby029@207",
                'contentId' => "jqcs", 'serviceId' => "yllddjdt0", 'desc' => "沃家电竞",
                'goHomeUrl' => "http://202.99.114.152:33007/epg_dj_hd_cucc_tj/index.html?entrance=lqdg&carrierId=207");
        }
        return $info;
    }

    /**
     * @brief: 畅享健康给生活加点料（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function JointActivityHealthyLife20211228($platformTypeExt)
    {
        // 39健康
        $info['health_39'] = array('spid' => SPID, 'desc' => "39健康",
            'goHomeUrl' => "http://222.85.91.211:10101/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=410092&lmp=27");

        // 休闲钓鱼
        $info['leisure_fishing'] = array('spid' => SPID, 'desc' => "休闲钓鱼",
            'goHomeUrl' => "http://171.14.99.117:10396/iptvdy/iptv/UserSessionAction.do?method=login&loginPage=1&from=1&ReturnURL=");

        // QQ音乐
        $info['qq_music'] = array('spid' => SPID, 'desc' => "QQ音乐",
            'goHomeUrl' => "http://222.85.91.211:12088/hendx/show/welcome.htm?positionCode=third");

        // 爱家健康
        $info['home_health'] = array('spid' => SPID, 'desc' => "爱家健康",
            'goHomeUrl' => "http://171.14.99.106:10382/iptvjk/iptv/UserSessionAction.do?method=login&loginPage=1&from=xcrk&ReturnURL=");

        return $info;
    }

    /**
     * @brief: 畅享健康给生活加点料（联合）
     * @param $platformTypeExt （平台类型 hd/sd）
     * @return mixed
     */
    private static function JointActivitySummerUpUp20220523($platformTypeExt)
    {
        // 食乐汇
        $info['slh'] = array('spid' => SPID, 'productId' => PRODUCT_ID,
            'contentId' => CONTENT_ID, 'serviceId' => SERVICE_ID, 'desc' => "食乐汇",
            'goHomeUrl' => " http://202.99.114.152:30214/index.php?lmuf=0&lmsid=&lmsl=hd_1&lmcid=000051&lmp=".MasterManager::getEnterPosition()."&lmacid=".MasterManager::getAreaCode());

        // 健康魔方
        $info['jkmf'] = array('spid' => SPID, 'productId' => "jkmfby25",
            'contentId' => "jkmf", 'serviceId' => "jkmfby25", 'desc' => "健康魔方",
            'goHomeUrl' => "http://202.99.114.152:30278/index.php?lmuf=0&lmsid=&lmsl=hd_1&lmcid=10000051&lmp=".MasterManager::getEnterPosition()."&lmacid=".MasterManager::getAreaCode());

        // 爱看影视
        $info['akys'] = array('spid' => SPID, 'productId' => "akwys01084@204",
            'contentId' => "", 'serviceId' => "aishangVIP", 'desc' => "爱看影视",
            'goHomeUrl' => "http://202.99.114.60:5138/activeLinkExRedirect?carrierid=204&entranceType=117&tvplat=hw2");

        return $info;
    }
}