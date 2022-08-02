<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/8/7
 * Time: 下午4:15
 */

namespace Home\Model\Order;


use Api\APIController\DebugAPIController;
use Home\Common\Tools\DES3Tool;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Common\ServerAPI\PayAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\User\AuthUserBuilder;

/**
 * 订购管理器
 * Class OrderManager
 * @package Home\Model\Order
 */
class OrderManager
{
    /**
     * @param string $carrierId
     * @return Pay000051|Pay220094|Pay220095|Pay320092|Pay440094|Pay450094|Pay440004|Pay10220094|null
     */
    public static function getInstance($carrierId = "")
    {
        $className = 'Home\Model\Order\Pay' . CARRIER_ID;
        if (class_exists($className)) {
            return new $className;
        }
        return null;
    }

    /**
     * 判断是否到局方直接支付
     * @param: $areaCode 地区编码
     * @param: $subAreaCode 子区域编码
     * @param: $orderPageRule 订购页面规则
     * @return bool 是否直接跳转局方订购页发起订购
     */
    public static function isDirectPay($orderPageRule)
    {
        // 直接订购的地区数组
        $direct_order_carrier_array = array(CARRIER_ID_ANHUIDX, CARRIER_ID_QINGHAIDX, CARRIER_ID_GUANGXIDX,CARRIER_ID_GUANGDONGGD_NEW,CARRIER_ID_GUANGDONGGD,CARRIER_ID_GUIZHOUGD_XMT,
            CARRIER_ID_QINGHAIDX_GAME,CARRIER_ID_GUIZHOUDX);
        // 应用内订购的地区数组
        $private_order_carrier_array = array(CARRIER_ID_JILINGD_MOFANG,CARRIER_ID_GUIZHOUGD, CARRIER_ID_GUANGDONGGD, CARRIER_ID_GUANGXIGD,
            CARRIER_ID_FUJIANDX, CARRIER_ID_JIANGXIDX, CARRIER_ID_JILINGD,CARRIER_ID_HUNANDX,CARRIER_ID_CHINAUNICOM_OTT,
            CARRIER_ID_JILINGDDX, CARRIER_ID_SICHUANGD, CARRIER_ID_SHANDONGDX,CARRIER_ID_SHANDONGDX_HAIKAN, CARRIER_ID_MANGOTV_LT,
            CARRIER_ID_CHONGQINGDX, CARRIER_ID_XINJIANGDX_TTJS, CARRIER_ID_GUANGDONGGD_NEW,CARRIER_ID_NINGXIADX,CARRIER_ID_NINGXIADX_MOFANG,
            CARRIER_ID_GUANGDONGYD,CARRIER_ID_HAIKAN_APK,CARRIER_ID_SHANDONGDX_APK,CARRIER_ID_JIANGSUDX_YUEME,CARRIER_ID_JILIN_YD,CARRIER_ID_GANSUYD,
            CARRIER_ID_QINGHAI_YD,CARRIER_ID_XIZANG_YD,CARRIER_ID_NINGXIA_YD,CARRIER_ID_NEIMENGGU_DX,CARRIER_ID_JIANGXIYD,CARRIER_ID_JIANGSUYD,
            CARRIER_ID_ANHUIYD_YIBAN,CARRIER_ID_GUANGXI_YD_YIBAN,CARRIER_ID_WEILAITV_TOUCH_DEVICE,CARRIER_ID_YB_HEALTH_UNIFIED,CARRIER_ID_GUANGXI_YD,
            CARRIER_ID_ZHEJIANG_HUASHU,CARRIER_ID_GUANGXIGD_APK,CARRIER_ID_HUNANYX,CARRIER_ID_HEILONGJIANG_YD,CARRIER_ID_JILINGDDX_MOFANG,
            CARRIER_ID_CHINAUNICOM_APK,CARRIER_ID_CHINAUNICOM_MOFANG_APK);
        //return true;
        // 安徽电信EPG，默认直接去局方订购页
        if (in_array(CARRIER_ID, $direct_order_carrier_array)) {
            return true;
        }

        if (in_array(CARRIER_ID, $private_order_carrier_array)) {
            return false;
        }

        //遇见生活天津、山东、山西、辽宁、河南、内蒙直接跳转计费，黑龙江跳转我方订购页选择
        if (CARRIER_ID == CARRIER_ID_CHINAUNICOM_MEETLIFE && MasterManager::getAreaCode() == "211") {
            return false;
        }

        // 用户页面指定方式 1、直接去局方支付页 0、进入我方支付页
        $directPay = isset($_GET['directPay']) ? $_GET['directPay'] : 0;
        if ($directPay == 1) {
            return true;
        }


        // 在加载用户信息时缓存显示规则
        // $showRule = MasterManager::getPayPageRule();
        // if ($orderPageRule) {
        // $orderPageRule = OrderManager::showPayPageRule($areaCode,$subAreaCode);
        // }

        $result = json_decode($orderPageRule);
        if ($result->result == 0) {
            $data = $result->data;
            /**
             * page_type：计费页类型（0:局方统一计费页 1:39健康计费页）
             * identify_flag：是否到局方统一认证，page_type为1时有意义（1是 0否）
             * cfg_data：页面配置数据（page_type=0时，cfg_data应为空数组；
             * page_type=1时，数组的第1个对象是第1次确认页的配置信息，第2个是第2次确认页的配置信息）
             * vcode：是否有验证码（0否 1是）
             * focus_pos：默认焦点位置（0确认按钮 1取消按钮 2验证码输入框）
             */
            $pageType = $data->page_type;
            if ($pageType == 0) {
                return true;
            } else {
                $configData = $data->cfg_data;
                MasterManager::setPayPageConfig($configData);
                MasterManager::setPayUnifyAuth($data->identify_flag);

                return false;
            }
        } else {
            // 默认是去局方订购页
            return true;
        }
    }

    /**
     * 创建订单号
     * @param $orderItemId //订购项ID
     * @param $orderReason //订购来源（100 开通vip  101 活动购买 102播放视频购买 103视频问诊购买 104问诊记录购买 105健康检测记录购买 106续费vip）
     * @param $remark //备注字段，补充说明reason。如订购是通过视频播放，则remark为视频名称；如是通过活动，则remark为活动名称。
     * @param null $contentId 联合活动，需要传递CP的contentId
     * @param int $orderType 通过webPagePay接口来的，透传，如果不是则传1
     * @return mixed $tradeResult 获得订购信息
     */
    public static function createPayTradeNo($orderItemId, $orderReason, $remark, $contentId = null, $orderType = 1)
    {
        //获取订单号
        $result = PayAPI::getOrderNo($orderItemId, $orderReason, $remark, $contentId, $orderType);
        $tradeResult = json_decode($result);
        return $tradeResult;
    }

    /**
     * 获取我方配置的订购项
     * @param $userId
     * @return array
     */
    public static function getOrderItem($userId = null)
    {
        $userId = $userId == null ? MasterManager::getUserId() : $userId;
        //获取订购项
        $result = PayAPI::getOrderItem($userId);
        $resultJson = json_decode($result);
        $orderItems = array();
        if ($resultJson->result == 0) {
            $orderItems = $resultJson->list;
        }
        return $orderItems;
    }

    /**
     * @breif: 根据用户账号以及区域编码，向服务器请求自定义订购页显示规则的配置
     * @param: $areaCode 地区编码
     * @param: $subAreaCode 子区域编码
     * @return int state : 0-- 表示正常显示计费页，1--表示按下面规则来显示计费页
     */
    public static function showPayPageRule($areaCode, $subAreaCode)
    {
        $orderPageRuleKey = RedisManager::$REDIS_ORDER_PAGE_RULE;
        if ($areaCode) {
            $orderPageRuleKey .= "_$areaCode";
        }
        if ($subAreaCode) {
            $orderPageRuleKey .= "_$subAreaCode";
        }
        $orderPageRule = RedisManager::getPageConfig($orderPageRuleKey);
        if (!$orderPageRule) {
            $orderPageRule = PayAPI::queryUserPayPageShowRuleEx($areaCode, $subAreaCode);
        }
        // 写入缓存值
        RedisManager::setPageConfig($orderPageRuleKey, $orderPageRule);
        return $orderPageRule;
    }

    /**
     * 加密
     * @param $data
     * @return string
     */
    public static function encrypt($data)
    {
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_CHINAUNICOM:
                $iv = "02452732";
                $key = "07r99z7h1bboka22waavibi6tnjk4ksw";
                break;
            case CARRIER_ID_JIANGSUDX:
                $iv = '06203943';
                $key = 'rziat2hioibj7kn43y0xks91dc77qx2v';
                break;
            case CARRIER_ID_ANHUIDX:
                $key = '7xwrjpd4m9hu2cf0l8gcg2kx0fkpax1d';
                $iv = '40730638';
                break;
            case CARRIER_ID_QINGHAIDX:
                $key = 'wqx0vrgblwz3xqp8utzeotp7d5f4it26';
                $iv = '14311669';
                break;
            case CARRIER_ID_GUANGXIDX:
                $key = '347xe4388bgna3r7o3l35a61mbpz8yja';
                $iv = '57489213';
                break;
            case CARRIER_ID_HUBEIDX:
                $key = 'ixcjch547g8o8jyufn207zjg67o7nm18';
                $iv = '15730700';
                break;
            case CARRIER_ID_NINGXIADX:
                $key = 'hvs84x8s93n225f0478gqle6195q2atb';
                $iv = '03408407';
                break;
            case CARRIER_ID_FUJIANDX:
                $key = 'iv83qg38mv6zf7emh39w7c02hn32a4ho';
                $iv = '13365750';
                break;
            case CARRIER_ID_HAINANDX:
                $key = '2agt981qzigsn913cixfqqv26p2eastp';
                $iv = '17386435';
                break;
            case CARRIER_ID_XINJIANGDX:
                $key = '3j5z9zxxyh23b2szoicuncthsduirz0o';
                $iv = '48926937';
                break;
            case CARRIER_ID_GUANGXIGD:
                $key = 'wtmlr3l1jvm0d97l9dga4652ql4uvbp9';
                $iv = '00828937';
                break;
            case CARRIER_ID_JIANGXIDX:
                $key = 'uvgm6qzlmr325w6t6jy7vv51aop35s1n';
                $iv = '70627896';
                break;
            case CARRIER_ID_GUIZHOUDX:
                $key = 'sye2bc8nsmub5eejawzow76glror7nmc';
                $iv = '52039035';
                break;
            case CARRIER_ID_GUIZHOUGD:
                $key = 'doj0q4v1bfkf8jlvrhnpnxronzdh840b';
                $iv = '70706657';
                break;
            case CARRIER_ID_GUANGDONGGD:
                $key = 'ichudu7ghyaqf6ulh7fs6ibtkrf3nipe';
                $iv = '47843820';
                break;
            case CARRIER_ID_JILINGD:
                $key = 'lf3ox7kwzh1b3sequnyzhhlfiu0ox833';
                $iv = '53788660';
                break;
            case CARRIER_ID_HENANDX:
                $key = 'bouwwb3qmcydpci25k8klyjlls1qu5oc';
                $iv = '66784147';
                break;
            case CARRIER_ID_SHANDONGDX:
                $key = '9801ekq9mrr7836sysw95vfhuhgrulu6';
                $iv = '41086158';
                break;
            case CARRIER_ID_JILINGDDX:
                $key = 'vpghyfllaje7yqd8w846xx5h4h334k3a';
                $iv = '29163110';
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG:
                $key = '1rpVnXc8vkqYtlif5KpjtTns4oAFvK29';
                $iv = '73601183';
                break;
            case CARRIER_ID_XINJIANGDX_TTJS:
                $key = 'Z3R5tnNcU0cXEjz1LB2bPtEEsqxm1DXr';
                $iv = '65041144';
                break;
            case CARRIER_ID_GANSUDX:
                $key = 'aoO4qwQQoFZEhdZRQ5x5uBZbFUcXS60F';
                $iv = '88773925';
                break;
            case CARRIER_ID_GUANGDONGGD_NEW:
                $iv = "92727806";
                $key = "2w9g51r5l5aw1lhjefpwgrmf5c6g6cl7";
                break;
            case CARRIER_ID_MANGOTV_LT:
                $iv = "18448119";
                $key = "coQnvRQOvTDqEQNuezxTcxtPkUFd9eHn";
                break;
            case CARRIER_ID_SHANDONGDX_HAIKAN:
                $iv = "78380626";
                $key = "PCc5AeUw6fWJjhkWakmfQX1f7ZRguD24";
                break;
            case CARRIER_ID_HUNANDX:
                $iv = "18149663";
                $key = "xr4y59afi8gco5kjchhph3utg6tvvp69";
                break;
            case CARRIER_ID_HAIKAN_APK:
                $iv = "98743028";
                $key = "iRMMtjiYTm5ErQNTADY2Khw72JRNPXam";
                break;
            case CARRIER_ID_JILIN_YD:
                $iv = "58854539";
                $key = "xkbmPXx50kYE5nvE9zuWIcu68BvwcQQB";
                break;
            case CARRIER_ID_GANSUYD:
                $iv = "99782538";
                $key = "n1ndxczkl5wxhlsb5avngjich13qs6rg";
                break;
            case CARRIER_ID_SHANDONGDX_APK:
                $iv = "83940797";
                $key = "ypojfh3iub03167ndft5x4hmszdsom1f";
                break;
            case CARRIER_ID_LDLEGEND:
                $iv = "90066516";
                $key = "mgANzeplnr4MpQg84F50OTWrkxTYJNzW";
                break;
            case CARRIER_ID_JILINGD_MOFANG:
                $iv = "95033379";
                $key = "LrdbFUQHIo1GDnUJd86T18xgk7xoW9F2";
                break;
            case CARRIER_ID_GUIZHOUGD_XMT:
                $iv = "93524958";
                $key = "MvR269YXApMFt7l8Jj1Qem3VWmuk6JMx";
                break;
            case CARRIER_ID_JILINGDDX_MOFANG:
                $iv = "17100604";
                $key = "X3cGBSynuu8sj5pMjd562jast85akeBg";
                break;
            case CARRIER_ID_NINGXIA_YD:
                $iv = "34411906";
                $key = "QbIOWr9Ec1frLkoMY6FKfhPAGbwSCZj4";
                break;
            case CARRIER_ID_SHANXIDX:
                $iv = "45969798";
                $key = "5mu389dyk5zql77bd0jiufvnmqc04fxf";
                break;
            case CARRIER_ID_CHINAUNICOM_APK:
                $iv = "66522405";
                $key = "CM3m64ryBb2J15n7CJpaNfeyzjQqVurM";
                break;
            case CARRIER_ID_QINGHAIDX_GAME:
                $iv = "21653256";
                $key = "6e82kCLenzYZkF3zZWaNwVAQ9mMz4SeD";
                break;
            case CARRIER_ID_CHINAUNICOM_MOFANG_APK:
                $iv = "41140608";
                $key = "nGkeZFj8Wjj2faMWNucwT9azadTSHbBS";
                break;
            default:
                LogUtils::error("OrderManager::encrypt  ---> is not support! carrierId:" . MasterManager::getCarrierId());
                return null;
        }

        $des3 = new DES3Tool(base64_encode($key), base64_encode($iv));
        return $des3->encrypt($data);
    }
}
