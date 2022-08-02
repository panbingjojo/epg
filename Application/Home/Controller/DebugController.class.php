<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2017/12/25
 * Time: 11:28
 */

namespace Home\Controller;

use Home\Common\Tools\AesTool;
use Home\Common\Tools\Crypt3DES;
use Home\Model\Common\LogUtils;
use Home\Model\Common\Utils;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;
use Home\Model\User\UserManager;

class DebugController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    /** 显示盒子信息 */
    public function showSTBInfoUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = MasterManager::getUserId();
        $backEPGUrl = MasterManager::getIPTVPortalUrl();
        $returnUrl = parent::getFilter('returnUrl');
        $isVip = UserManager::isVip($userId);

        $this->assign('backEPGUrl', $backEPGUrl);
        $this->assign('returnUrl', $returnUrl);
        $this->assign('isVip', $isVip);

        $this->displayEx(__FUNCTION__);
    }

    /** APK调用测试页面 */
    public function callApkTestUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = MasterManager::getUserId();
        $backEPGUrl = MasterManager::getIPTVPortalUrl();
        $returnUrl = parent::getFilter('returnUrl');
        $isVip = UserManager::isVip($userId);
        $homeUrl = U('/Home/Main/homeV1', array("userId" => $userId));
        // 得到EPG缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();

        $this->assign('backEPGUrl', $backEPGUrl);
        $this->assign('returnUrl', $returnUrl);
        $this->assign('isVip', $isVip);

        $this->assign('userToken', $epgInfoMap["userToken"]);
        $this->assign("homeUrl", $homeUrl);

        $this->displayEx(__FUNCTION__);
    }

    /** 视频播放测试 */
    public function videoPlayTestUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }

    /** 音频播放测试 */
    public function audioPlayTestUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->displayEx(__FUNCTION__);
    }

    ////////////////////////////////////// 江苏电信EPG局方活动上报接口 ////////////////////////////////////////////
    // 活动访问信息接口
    public function postUserAccessToEPG320092UI()
    {
        LogUtils::info(">>>>>>>> postUserAccessToEPG>>>>>:");
        $userId = $_POST['userId'];
        //得到缓存信息
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $userAccount = Crypt3DES::decode($epgInfoMap["userId"], $epgInfoMap["key"]);
        $userToken = Crypt3DES::decode($epgInfoMap["userToken"], $epgInfoMap["key"]);
        $userIp = $epgInfoMap['userIP'];
        $areaCode = $epgInfoMap['areaCode'];
        $stbId = $epgInfoMap["stbId"];

        $platformType = MasterManager::getPlatformType();

        //局方地址
        $UserOrderUrl = "http://61.160.131.74:8082/CommonService/access/syncAccess?"; // 活动访问上报接口
        $param = array();
        //请求事务编号（sp编码(8位)+时间戳(yyyyMMddHHmmss 14位)+序号（18位自增））
        $transactionId = $this->makeTransactionID(SPID);
        $param["transactionID"] = rawurlencode($transactionId);
        $param["SPID"] = rawurlencode(SPID);

        // 回调接口
        $messageUrl = "http://" . $_SERVER['HTTP_HOST'] . U("home/activity/callback", array("userId" => $userId));
        $param["messageUrl"] = $messageUrl;

        LogUtils::info("pay--->param: " . json_encode($param));

        //获取INFO参数
        $info_param = array();
        $info_param["userID"] = $userAccount;
        $info_param["userToken"] = $userToken;
        $info_param["areaCode"] = $areaCode; // 用户地区编码
        $info_param["channel"] = strtoupper($platformType);// 判断盒子的版本lmsl（sd标清、hd高清
        $info_param["userIP"] = $userIp; // 用户登录IP地址
        $info_param["stbId"] = $stbId; // 用户机顶盒ID
        $info_param["actName"] = "ITV_20171122172815_654869"; // 活动唯一标识

        // {"userID":"huangtao01","userToken":"08191551631636681581730918101518","areaCode":"0001","channel":"HD","userIP":"10.132.102.77","stbId":"B21001990070119000014C09B4DF70DF","actName":"ITV_20171122172815_654869"}
//        $info_param["userID"] = "huangtao01";
//        $info_param["userToken"] = "08191551631636681581730918101518";
//        $info_param["areaCode"] = "0001"; // 用户地区编码
//        $info_param["channel"] = "HD";// 判断盒子的版本lmsl（sd标清、hd高清
//        $info_param["userIP"] = "10.132.102.77"; // 用户登录IP地址
//        $info_param["stbId"] = "B21001990070119000014C09B4DF70DF"; // 用户机顶盒ID
//        $info_param["actName"] = "ITV_20171122172815_654869"; // 活动唯一标识

        $infoJson = json_encode($info_param);

        $infoAES = AesTool::encrypt($infoJson, "orderServer09r18d5JsGx==");
//        $infoAES = $aes->encrypt($infoJson, $key);
//        $infoAES = AESEncryptController::encrypt($infoJson, $key);
        // 2v5bIiWtGAVx5HuTaVv3ElbfZFsTijmu6+cw60r18ggaXRbQ1FPkljRTx+Uae0m8JijA8b+awDXx+pC6SpAkfMriTqrVv/YsMwp46MJ0DK7kXAFFZe7aNi1AobHZKfFcQxDySWsBg8FKj+xs6l6NaWbdgMx487lGRx0qxHBawNW9q5GVdNR3Ycy2RgR5NsKSCFT9sM9EV0hk27tJm5kwY2DcvIltUGqNRrqEz/+TY8Ks5SiP8SvyZatjYXK/+NKEjYL3whwjDF5nOhoEkF8tkCuoqhiZvRJwucOV/gwXsNc=
        LogUtils::info("AESE info: " . $infoAES);
        $param["INFO"] = $infoAES;

        // 生成sign
        $infoMD5 = strtoupper(md5($infoJson));
        $param["sign"] = $infoMD5; //1C67899DD64E8AFA5DA69E46DC7BFCC7

        // 把整个param对象转为json对象，再进行url编码
        $paramJson = json_encode($param);
        $paramUrl = rawurlencode($paramJson);

        $goUrl = $UserOrderUrl . "request=" . $paramUrl;
        LogUtils::info(">>>>>>>> postUserAccessToEPG Url:" . $goUrl);

        echo json_encode(array(
            'result' => 0,
            'UserAccessUrl' => $goUrl
        ));

        exit();
    }

    // 反馈接口：当调用postUserAccessToEPG接口后，会通过此接口回调回来
    public function callback320092UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        LogUtils::info(">>>>>>>> postUserAccessToEPG callback result:" . json_encode($_GET));
    }

    // 请求事务编号（sp编码(8位)+时间戳(yyyyMMddHHmmss 14位)+序号（18位自增））
    public function makeTransactionID($spId)
    {
        $timestamp = Date('Ymdhms'); // 20171130121108
        $seq = $this->getMillisecond() . rand(10000, 99999); // 151204603762814235
        $transactionId = $spId . $timestamp . $seq;
        LogUtils::info(">>>>>>>>>>>> transactionId = " . $transactionId);
        return $transactionId;
    }

    private function getMillisecond()
    {
        list($t1, $t2) = explode(' ', microtime());
        return (float)sprintf('%.0f', (floatval($t1) + floatval($t2)) * 1000);
    }

    /**
     * @brief: 去测试入口集页面
     */
    public function goTestEntrySetUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('inner', 0);

        LogUtils::info(">>>>>>>>>>>> goTestEntrySetUI");
        $this->displayEx(__FUNCTION__);
    }

    /**
     * @brief： 根据carrierId来判断
     */
    public function goTestServerUI()
    {
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $defaultEpgInfo = "<userId>02epg{lkrxww</userId><userToken>02127214624424.74:/42833/6727426</userToken><TokenExpiretime>20170825090302</TokenExpiretime><GroupId>327</GroupId><userIP>61.155.239.205 </userIP><areaCode>0002</areaCode><TradeId>1</TradeId><key>5:2</key><stbId>ED100499007034400000D071C4224F98</stbId><VAStoEPG>http://58.223.228.196:8080/iptvepg/frame205/third_to_epg.jsp</VAStoEPG><back_epg_url>http://58.223.228.196:8080/iptvepg/frame205/back.jsp</back_epg_url><back_hall_url>http://58.223.228.196:8080/iptvepg/frame205/third_to_epg.jsp</back_hall_url><adContentId></adContentId><adContentName></adContentName><cdrtype></cdrtype><recSourceId></recSourceId>";
        $epgInfo = MasterManager::getEPGInfo();//getCookieEPGInfo
        $epgInfo = $epgInfo ? $epgInfo : $defaultEpgInfo;
        $platformTypeExt = MasterManager::getPlatformTypeExt();
        $carrierId = parent::getFilter('carrierId', MasterManager::getCarrierId());

        LogUtils::info("======================>carrierId :" . $carrierId);
        switch ($carrierId) {
            case CARRIER_ID_JIANGSUDX:
                $goUrl = "http://180.100.134.116:10013/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=320092&lmsid=0&INFO=" . $epgInfo;
                break;
            case CARRIER_ID_NINGXIADX:
                if (MasterManager::getCarrierId() == CARRIER_ID_NINGXIADX) {
                    $goUrl = "http://124.224.242.242:10404/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=640092&lmsid=0&lmp=1&INFO=" . $epgInfo;
                } else {
                    $epgInfo = "<userId>02epg{lkrxww</userId><userToken>02127214624424.74:/42833/6727426</userToken><TokenExpiretime>20170825090302</TokenExpiretime><GroupId>327</GroupId><userIP>61.155.239.205 </userIP><areaCode>0002</areaCode><TradeId>1</TradeId><key>5:2</key><stbId>ED100499007034400000D071C4224F98</stbId><VAStoEPG>http://58.223.228.196:8080/iptvepg/frame205/third_to_epg.jsp</VAStoEPG><back_epg_url>http://58.223.228.196:8080/iptvepg/frame205/back.jsp</back_epg_url><back_hall_url>http://58.223.228.196:8080/iptvepg/frame205/third_to_epg.jsp</back_hall_url><adContentId></adContentId><adContentName></adContentName><cdrtype></cdrtype><recSourceId></recSourceId>";
                    $goUrl = "http://222.85.144.70:30022/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=640092&lmsid=0&lmp=1&INFO=" . $epgInfo;
                }
                break;
            case CARRIER_ID_ANHUIDX:
                $goUrl = "http://222.85.144.70:8100/anhui/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=340092&lmsid=0";
                break;
            case CARRIER_ID_CHINAUNICOM:
                // 调整局方入口参数
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                $goUrl = "http://222.85.144.70:40020/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=000051&lmsid=0" . $info;
                break;
            case '10220094':
                // 调整局方入口参数-- 吉林广电魔方EPG 跳转测试服首页
                // $goUrl = "http://10.254.30.100:40016/index.php?lmuf=0&lmsl=hd&lmcid=10220094&lmsid=";
                $goUrl = "http://139.215.92.20:10018/index.php?lmuf=0&lmsl=hd&lmcid=10220094&lmsid=";
                break;
            case '10000051':
                // 调整局方入口参数
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                $goUrl = "http://202.99.114.152:30278/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=10000051&lmsid=0" . $info;
                break;
            case '13000051':
                // 调整局方入口参数
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                $goUrl = "http://202.99.114.152:30200/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=13000051&lmsid=0" . $info;
                break;
            case CARRIER_ID_GANSUDX:
                // 调整局方入口参数 -- 甘肃电信EPG 跳转测试服首页
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                // $goUrl = "http://118.180.22.57:10297/lws-cesi/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=620092&lmsid=0" . $info;
                $goUrl = "http://118.180.22.57:10297/lws-cesi/index.php?lmuf=0&lmsl=hd&lmcid=620092&lmsid=album56&lmp=0&INFO=<userId>02epg{lkrxww</userId><userToken>02127214624424.74:/42833/6727426</userToken><TokenExpiretime>20170825090302</TokenExpiretime><GroupId>327</GroupId><userIP>61.155.239.205</userIP><areaCode>0002</areaCode><TradeId>1</TradeId><key>5:2</key><stbId>ED100499007034400000D071C4224F98</stbId><VAStoEPG>http://58.223.228.196:8080/iptvepg/frame205/third_to_epg.jsp</VAStoEPG><back_epg_url>http://58.223.228.196:8080/iptvepg/frame205/back.jsp</back_epg_url><back_hall_url>http://58.223.228.196:8080/iptvepg/frame205/third_to_epg.jsp</back_hall_url><adContentId></adContentId><adContentName></adContentName><cdrtype></cdrtype><recSourceId></recSourceId>";
                break;
            case '11000051':
                // 调整局方入口参数  跳转乐动传奇正式服
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                $goUrl = "http://202.99.114.152:30281/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=11000051&lmsid=0" . $info;
                break;
            case CARRIER_ID_QINGHAIDX:
                $userId = MasterManager::getAccountId();
                $cityCode = MasterManager::getAreaCode();
                $backUrl = MasterManager::getIPTVPortalUrl();
                //$goUrl = "http://223.221.36.146:10004/index.php?lmuf=0&lmsl=hd&lmcid=630092&lmsid=0&userId=" . $userId . "&cityCode=" . $cityCode . "&backUrl=" . $backUrl;
                $goUrl = "http://222.85.144.70:40003/index.php?lmuf=0&lmsid=QHfreeVideo&lmsl=hd-1&lmcid=630092&lmp=37&userId=09715502148itv&cityCode=XXX&backUrl=XXX";
                break;
            case CARRIER_ID_SHANXIDX:
                $userId = MasterManager::getAccountId();
                $cityCode = MasterManager::getAreaCode();
                $backUrl = MasterManager::getIPTVPortalUrl();
                $goUrl = "http://10.254.30.100:60092/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=610092&lmsid=0&lmp=1&INFO=" . $epgInfo;
                break;

            case CARRIER_ID_GUANGXIDX:
                $userId = MasterManager::getAccountId();
                $cityCode = MasterManager::getAreaCode();
                $backUrl = MasterManager::getIPTVPortalUrl();
                $goUrl = "http://222.217.76.249:9136/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=450092&lmsid=0&lmp=1&INFO=" . $epgInfo;
//                $goUrl = "http://10.254.30.100:45092/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=450092&lmsid=0&lmp=1&INFO=" . $epgInfo;
                break;
            case CARRIER_ID_HENANDX:
//                $goUrl = "http://10.254.30.100:41092/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=410092&lmsid=0&lmp=1&INFO=" . $epgInfo;
                $goUrl = "http://222.85.91.211:10104/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=410092&lmsid=0&lmp=1&INFO=" . $epgInfo;
                break;
            case CARRIER_ID_HUBEIDX:
//                $goUrl = "http://10.254.30.100:42092/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=420092&lmsid=0&lmp=1&INFO=" . $epgInfo;
                $goUrl = "http://116.210.254.194:11014/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=420092&lmsid=0&lmp=1&INFO=" . $epgInfo;
                break;
            case CARRIER_ID_GUANGXIGD:
                $userId = MasterManager::getAccountId();
                $areaCode = MasterManager::getAreaCode();
                $deviceId = MasterManager::getSTBId();
//                $goUrl = "http://10.0.4.133:39004/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=450094&lmp=2&user_id=" . $userId . "&device_id=" . $deviceId . "&area_code=" . $areaCode;
                $goUrl = "http://10.0.4.170:39007/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=450094&lmp=2&user_id=" . $userId . "&device_id=" . $deviceId . "&area_code=" . $areaCode;
                break;
            case CARRIER_ID_FUJIANDX:
                $goUrl = "http://59.56.75.241:10004/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=350092&lmsid=0&INFO=" . $epgInfo;
                break;
            case CARRIER_ID_XINJIANGDX:
                $visBackUrl = MasterManager::getIPTVPortalUrl();
                $visBackUrl = urlencode($visBackUrl);
                $epgInfo = MasterManager::getEPGInfo();
                //120.70.237.86:10006
                $goUrl = "http://120.70.237.86:10001/index.php/Home/Index/index/lmuf/0/lmsid/xx/lmsl/hd-1/lmcid/650092/lmp/2?vis_back_url=http%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3FlastActiveId%3Da_TVOD_9%26lastCategoryId%3Da_TVOD%26lastContent%3DTVOD_div&epg_info=%3Cserver_ip%3E120.70.233.69%3C%2Fserver_ip%3E%3Cgroup_name%3E%3C%2Fgroup_name%3E%3Cgroup_path%3E%3C%2Fgroup_path%3E%3Coss_user_id%3Etestiptv2557%3C%2Foss_user_id%3E%3Cpage_url%3Ehttp%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3C%2Fpage_url%3E%3Cpartner%3EHUAWEI%3C%2Fpartner%3E";
//                $goUrl = "http://120.70.237.86:10006/index.php?lmuf=0&lmsl=hd&lmcid=650092&lmsid=''&lmp=1&vis_back_url=" . $visBackUrl . "&epg_info=" . $epgInfo;
//                $goUrl = "http://10.254.30.100:10098/index.php?lmuf=0&lmsid=ActivityCommunityHospital20190701&lmsl=hd-1&lmcid=650092&lmp=31&vis_back_url=http%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3FlastActiveId%3Da_TVOD_9%26lastCategoryId%3Da_TVOD%26lastContent%3DTVOD_div&epg_info=%3Cserver_ip%3E120.70.233.69%3C%2Fserver_ip%3E%3Cgroup_name%3E%3C%2Fgroup_name%3E%3Cgroup_path%3E%3C%2Fgroup_path%3E%3Coss_user_id%3Etestiptv2557%3C%2Foss_user_id%3E%3Cpage_url%3Ehttp%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3C%2Fpage_url%3E%3Cpartner%3EHUAWEI%3C%2Fpartner%3E";
                break;
            case CARRIER_ID_XINJIANGDX_TTJS:
                $visBackUrl = MasterManager::getIPTVPortalUrl();
                $visBackUrl = urlencode($visBackUrl);
                $epgInfo = MasterManager::getEPGInfo();
                $isTest = parent::getFilter('isTest', 1);
//                if ($isTest == 1) {
                $goUrl = "http://10.254.30.100:40001/index.php?lmuf=0&lmsid=ActivityCommunityHospital20190701&lmsl=hd-1&lmcid=12650092&lmp=31&vis_back_url=http%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3FlastActiveId%3Da_TVOD_9%26lastCategoryId%3Da_TVOD%26lastContent%3DTVOD_div&epg_info=%3Cserver_ip%3E120.70.233.69%3C%2Fserver_ip%3E%3Cgroup_name%3E%3C%2Fgroup_name%3E%3Cgroup_path%3E%3C%2Fgroup_path%3E%3Coss_user_id%3Etestiptv2557%3C%2Foss_user_id%3E%3Cpage_url%3Ehttp%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3C%2Fpage_url%3E%3Cpartner%3EHUAWEI%3C%2Fpartner%3E";
//                }else{
//                $goUrl = "http://218.31.231.14:10001/index.php?lmuf=0&lmsl=hd&lmcid=12650092&lmsid=''&lmp=1&vis_back_url=" . $visBackUrl . "&epg_info=" . $epgInfo;
//                }
                break;
            case CARRIER_ID_XINJIANGDX_HOTLINE:
                $isTest = parent::getFilter('isTest', 1);
                if ($isTest == 1) {
                    $goUrl = "http://10.254.30.100:10095/index.php?lmuf=1000&lmsid=eyJqdW1wX3R5cGUiOjMsImhvc3BpdGFsTmFtZSI6IndhbmF4aWFuZ3lpeXVhbiJ9&lmsl=hd-1&lmcid=651092&lmp=78&vis_back_url=http%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3FlastActiveId%3Da_TVOD_9%26lastCategoryId%3Da_TVOD%26lastContent%3DTVOD_div&epg_info=%3Cserver_ip%3E120.70.233.69%3C%2Fserver_ip%3E%3Cgroup_name%3E%3C%2Fgroup_name%3E%3Cgroup_path%3E%3C%2Fgroup_path%3E%3Coss_user_id%3Etyg02%3C%2Foss_user_id%3E%3Cpage_url%3Ehttp%3A%2F%2F202.100.183.2%3A8002%2Fepg%2Findex.jsp%3C%2Fpage_url%3E%3Cpartner%3EHUAWEI%3C%2Fpartner%3E";
                } else {
                    $goUrl = "http://218.31.231.118:10001/index.php?lmuf=1000&lmsid=eyJqdW1wX3R5cGUiOjMsImhvc3BpdGFsTmFtZSI6InNhaW1hY2hhbmdwaWFucXUiLCJob3NwaXRhbElkIjo0Mn0=&lmsl=hd-1&lmcid=651092&lmp=18&vis_back_url=http://202.100.183.2:8002/epg/index.jsp?lastActiveId=a_TVOD_9&lastCategoryId=a_TVOD&lastContent=TVOD_div&epg_info=%3Cserver_ip%3E120.70.233.69%3C/server_ip%3E%3Cgroup_name%3E%3C/group_name%3E%3Cgroup_path%3E%3C/group_path%3E%3Coss_user_id%3Etestiptv2556%3C/oss_user_id%3E%3Cpage_url%3Ehttp://202.100.183.2:8002/epg/index.jsp%3C/page_url%3E%3Cpartner%3EHUAWEI%3C/partner%3E";
                }
                break;
            case "04000051":
                //中国联通趣玩游戏平台测试；
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                $goUrl = "http://222.85.144.70:40010/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=04000051&lmsid=0" . $info;
                break;
            case CARRIER_ID_GUIZHOUDX:
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                $goUrl = "http://10.255.12.54:10003/index.php?lmuf=0&lmsl=hd&lmcid=520092&lmsid=0&cp_id=10072";
                //$goUrl = "http://222.85.144.70:40004/index.php?lmuf=0&lmsl=hd&lmcid=520092&lmsid=0&cp_id=10072";
                break;
            case CARRIER_ID_NINGXIAGD:
                $goUrl = "http://100.100.1.176:10002/index.php?lmuf=0&lmsid=album227&lmsl=hd&lmcid=640094&lmsid=0&userId=testUser&cityCode=&backUrl=";
                break;
            case CARRIER_ID_GUIZHOUGD:
                $goUrl = "http://10.69.46.209:10005/index.php?lmuf=0&lmsl=hd&lmcid=520094&cp_id=10072";
                break;
            case CARRIER_ID_JILINGD:
                $goUrl = "http://139.215.92.20:10004/index.php?lmuf=0&lmsl=hd&lmcid=220094&lmsid=";
                break;
            case CARRIER_ID_JILINGDDX:
                $goUrl = "http://10.254.30.100:40051/index.php?lmuf=0&lmsl=hd&lmcid=220095&lmsid=";
                break;
            case CARRIER_ID_JILINGDDX_MOFANG: // 吉林电信魔方EPG
                // $goUrl = "http://10.128.3.146:10008/index.php?lmuf=0&lmsl=hd&lmcid=10220095&lmsid=";
                $goUrl = "http://36.49.86.159:10008/index.php?lmuf=0&lmsl=hd&lmcid=10220095&lmsid=";
                break;
            case CARRIER_ID_SICHUANGD:
                $goUrl = "http://10.215.129.9:10003/index.php?lmuf=0&lmsl=hd&lmcid=510094&lmsid=";
                break;

            case CARRIER_ID_MANGOTV_LT:
                $goUrl = "http://116.129.244.18:10006/index.php?lmuf=0&lmsid=0&lmsl=hd-1&lmcid=07430093&lmp=0";
                break;
            case CARRIER_ID_MANGOTV_YD:
                $userId = MasterManager::getAccountId();
                $cityCode = MasterManager::getAreaCode();
                $backUrl = MasterManager::getIPTVPortalUrl();
                $goUrl = "http://222.85.144.70:40003/index.php?lmuf=0&lmsl=hd&lmcid=$carrierId&lmsid=0&userId=$userId&cityCode=$cityCode&backUrl=$backUrl";
                //$goUrl = "";//TODO 待调整3983替换之
                break;
            case CARRIER_ID_CHONGQINGDX:
                $goUrl = "http://172.23.51.86:10002/index.php?lmuf=0&lmsid=&lmsl=" . $platformTypeExt . "&lmcid=500092&lmp=1&INFO=" . urlencode($epgInfo);
                break;
            case CARRIER_ID_SHANDONGDX:
                $backUrl = MasterManager::getIPTVPortalUrl();
                $EPGInfo = MasterManager::getEPGInfo();//MasterManager::getCookieEPGInfo();
                $goUrl = "http://sddx.39health.visionall.cn:10004/index.php?lmuf=0&lmcid=370092&lmsl=hd&backurl=$backUrl&epg_info=$EPGInfo";
                break;
            case CARRIER_ID_GUANGDONGGD:
                $goUrl = "http://172.31.134.185:10005/index.php?lmuf=0&lmsid=&lmsl=hd&lmcid=440094&lmp=-1";
                break;
            case CARRIER_ID_GUANGDONGGD_NEW:
                $goUrl = "http://172.31.134.185:10014/index.php?lmuf=0&lmsid=&lmsl=hd&lmcid=440004&lmp=-1";
                break;
            case CARRIER_ID_HUNANDX: // 湖南电信apk
                $lmApkInfoStr = urlencode(MasterManager::getApkInfo());
                $entryUrl = "http://10.255.26.9:10000/epg-lws-for-apk-430002-cesi/index.php";
                $goUrl = "{$entryUrl}?lmuf=0&lmsl=hd&lmcid={$carrierId}&lmsid=&lmp=-1&userType=1&extraData=null&accountId={$lmApkInfoStr}&lmApkInfo={$lmApkInfoStr}";
                break;
            case CARRIER_ID_HAIKAN_APK: // 山东电信(海看)apk
                $lmApkInfo = MasterManager::getApkInfo();
                $lmApkInfoStr = null != $lmApkInfo && is_object($lmApkInfo) ? json_encode($lmApkInfo) : "";
                $lmApkInfoStr = urlencode($lmApkInfoStr); //url中复杂的json参数，Android端已做url_encode处理传递。故此，也做类同处理方可跳转。
                $goUrl = "http://sddx.39health.visionall.cn:10021/epg-lws-for-apk-cesi/index.php?lmuf=0&lmsl=hd&lmcid=" . CARRIER_ID . "&lmsid=&lmp=-1&userType=1&extraData=null&accountId=" . $lmApkInfoStr . "&lmApkInfo=" . $lmApkInfoStr;
                break;
            case CARRIER_ID_JIANGSUDX_YUEME: // 江苏电信(悦me)apk
                $lmApkInfo = MasterManager::getApkInfo();
                $lmApkInfoStr = null != $lmApkInfo && is_object($lmApkInfo) ? json_encode($lmApkInfo) : "";
                $lmApkInfoStr = urlencode($lmApkInfoStr); //url中复杂的json参数，Android端已做url_encode处理传递。故此，也做类同处理方可跳转。
                $goUrl = "http://123.59.206.200:10002/epg-lws-for-apk-000005-cesi/index.php?lmuf=0&lmsl=hd&lmcid=" . CARRIER_ID . "&lmsid=&lmp=-1&userType=1&extraData=null&accountId=" . $lmApkInfoStr . "&lmApkInfo=" . $lmApkInfoStr;
                break;
            default:
                $goUrl = "";
        }

        LogUtils::info("======================>go :" . $goUrl);

        header('Location:' . $goUrl);
    }

    /**
     * @Brief:此函数用于根据spid来跳转到其它sp厂商的应用
     * @param: $spid sp厂商编号
     * @return: void
     */
    public function jointActivityOtherSPUI()
    {
        $contentId = parent::getFilter('contentId');
        $isChangeReturnUrl = parent::getFilter('isChangeReturnUrl');
        StatManager::uploadAccessModule(MasterManager::getUserId());
        //$lmp = MasterManager::getEnterPosition();
        //$lmuf = MasterManager::getUserFromType();

        // 调整局方入口参数
        $epgInfoMap = MasterManager::getEPGInfoMap();

        // 判断是否要变更返回地址，如果不变更，当跳转其它SP应用再返回时，直接回局方
        // 如果变更了，则返回到指定的地址
        LogUtils::info("======================>isChangeReturnUrl :" . $isChangeReturnUrl);
        if ($isChangeReturnUrl == 1) {
            $tmpUrl = MasterManager::getIndexURL();
            $epgInfoMap["ReturnUrl"] = urlencode($tmpUrl);
        }
        if ($isChangeReturnUrl == 2) {
            $backUrl = parent::getFilter('backUrl');
            $epgInfoMap["ReturnUrl"] = urlencode($backUrl);
        }

        $info = "";
        foreach ($epgInfoMap as $key => $value) {
            $info .= "&$key=$value";
        }

        if($contentId === 'leisure_fishing' || $contentId === 'home_health'){
            $epgInfo = MasterManager::getEPGInfoMap();
            $info = '&PlatForm='.$epgInfo['TradeId'].'&UserToken='.MasterManager::getUserToken().'&UserId='.MasterManager::getAccountId();
            LogUtils::info("======================>getEPGInfoMap:" . $epgInfo);
            LogUtils::info("======================>getEPGInfoMap epgInfo['TradeId']:" . $epgInfo['TradeId']);
            LogUtils::info("======================>getEPGInfoMap MasterManager::getUserToken():" . MasterManager::getUserToken());
            LogUtils::info("======================>getEPGInfoMap MasterManager::getAccountId():" . MasterManager::getAccountId());
        }

        if($contentId === "akys"){
            $info = "&userId=".$epgInfoMap['UserID'].'&stbModel='.$epgInfoMap['stbModel']. '&userToken='.$epgInfoMap['userToken'].'&howBack=1&isBacktoIptv=1'.'&ReturnUrl='.$epgInfoMap["ReturnUrl"];
        }

        $spOrderInfo = Utils::getOrderInfo000051($contentId);

        $goUrl = $spOrderInfo['goHomeUrl'] . $info;
        LogUtils::info("======================>go :" . $goUrl);

        header('Location:' . $goUrl);
    }

    /**
     * @Brief:此函数用于根据spid来跳转到其它sp厂商的应用
     * @param: $spid sp厂商编号
     * @return: void
     */
    public function jumpThirdPartySPUI()
    {
        // 调整局方入口参数
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $platformTypeExt = MasterManager::getPlatformTypeExt();

        // 当进入其它应用时，把局方的返回url改为联合活动的url
        $tmpUrl = MasterManager::getIndexURL();
        $epgInfoMap["ReturnUrl"] = urlencode($epgInfoMap["ReturnUrl"]);
        $epgInfoMap["HomeUrl"] = urlencode($epgInfoMap["HomeUrl"]);
        $epgInfoMap["backurl"] = urlencode($epgInfoMap["backurl"]);
        $carrierId = parent::getFilter('carrierId', MasterManager::getCarrierId());

        switch ($carrierId) {
            case '10000051':
                // 调整局方入口参数
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
//                $spOrderInfo = Utils::getOrderInfo000051("sjjklinux");
//                $goUrl = $spOrderInfo['goHomeUrl'] . $info;
                $goUrl = "http://202.99.114.152:30278/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=10000051&lmsid=0" . $info;
                break;
            case CARRIER_ID_CHINAUNICOM:
                // 调整局方入口参数
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                $goUrl = "http://202.99.114.152:30214/index.php?lmuf=0&lmsl=" . $platformTypeExt . "&lmcid=000051&lmsid=0" . $info;
                break;
            case CARRIER_ID_GUANGXIDX:
                $thirdUrl = parent::getFilter('thirdUrl', "");
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
//                $epgInfoMap['back_epg_url'] = MasterManager::getIndexURL();
                $epgInfoMap['back_epg_url'] = "http://222.217.76.249:9133/index.php/Home/CustomizeModule/customizeModuleV1/?moduleId=xxx&modelId=&inner=0";
                $epgInfoMap['back_hall_url'] = "http://222.217.76.249:9133/index.php/Home/CustomizeModule/customizeModuleV1/?moduleId=xxx&modelId=&inner=0";
                $epgInfoMap['back_epg_url'] = urlencode(mb_convert_encoding($epgInfoMap['back_epg_url'], 'utf-8', 'gb2312'));
                $epgInfoMap['back_hall_url'] = urlencode(mb_convert_encoding($epgInfoMap['back_hall_url'], 'utf-8', 'gb2312'));
                foreach ($epgInfoMap as $key => $value) {
                    if ($key != "backUrl" && $key != "IPTVPortalUrl") {
                        $info .= "<$key>$value</$key>";
                    }
                }
                $goUrl = $thirdUrl . "?INFO=" . $info;
                break;
            case CARRIER_ID_HENANDX:
                $contentId = parent::getFilter('contentId');
                switch ($contentId){
                    case '39jk':
                        $thirdUrl='http://222.85.91.211:10101/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=410092&lmp=54&INFO=';
                        break;
                    case 'kingdom':
                        $thirdUrl='http://123.163.119.194:8400/edu/Default.aspx?INFO=';
                        break;
                    case 'love':
                        $thirdUrl='http://171.14.99.106:10372/iptvasy/iptv/UserSessionAction.do?method=login&loginPage=1&from=bk';
                        break;
                    case 'sweetBaby':
                        $thirdUrl='http://171.14.99.117:10390/epg_mbhbw_hd/login.jsp?AccessId=21hbH_4100000_gg_tvsy_01&INFO=';
                        break;
                    default:
                        $thirdUrl='http://222.85.91.211:10101/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=410092&lmp=54&INFO=';
                }

                $infoValue = urldecode(MasterManager::getEPGInfo());
                $xmlStr = "<?xml version='1.0'?><document>" . $infoValue . "</document>";
                $xmlJsonObj = simplexml_load_string($xmlStr);
                $xmlJsonStr = json_encode($xmlJsonObj);
                $xmlObj = json_decode($xmlJsonStr);

                $backUrl = urlencode("http://".$_SERVER['HTTP_HOST'].'/index.php/Activity/ActivityIndex/index/?userId='.MasterManager::getUserId().'&inner=0&activityId='.MasterManager::getActivityId().'&countDown=-1&description=&userGroupType=');

                if($contentId == "gift"){
                    $backUrl = urlencode("http://222.85.91.211:10101/index.php?lmuf=2&lmsid=JointActivityExclusiveGarden20220124&lmsl=hd-1&lmcid=410092&lmp=56&INFO=".MasterManager::getEPGInfo());
                }

                if($contentId == "love"){
                    $info = "&ReturnURL=&UserId=".MasterManager::getAccountId()."&UserToken=".MasterManager::getUserToken()."&PlatFrom=zx&backTab=hnxxCenter";
                    $goUrl = $thirdUrl . $info;
                }else{
                    $xmlObj->VAStoEPG = "null";
                    $xmlObj->back_epg_url= $backUrl;
                    $xmlObj->back_hall_url= $backUrl;
                    $info = "";
                    foreach ($xmlObj as $key => $value) {
                        $info .= "<$key>$value</$key>";
                    }
                    $goUrl = $thirdUrl . urlencode($info);
                }

                LogUtils::debug('goUrl参数'.$goUrl);
                break;

            default:
                $goUrl = "";
        }
        LogUtils::info("======================>go :" . $goUrl);

        header('Location:' . $goUrl);
    }


    public function goDeviceInformationUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = MasterManager::getUserId();
        $isVip = UserManager::isVip($userId);

        $epgInfoMap = MasterManager::getEPGInfoMap();//得到缓存信息
        $indexUrl = MasterManager::getIndexURL();//得到缓存信息
        $userIp = $epgInfoMap['userIP'];
        $isTest = MasterManager::getIsTestUser();

        $this->assign('isTest', $isTest);
        $this->assign('isVip', $isVip);
        $this->assign('userIp', $userIp);
        $this->assign('indexUrl', $indexUrl);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * J2ME 游戏测试
     */
    public function callTestByJ2MEUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $userId = MasterManager::getUserId();
        $isVip = UserManager::isVip($userId);

        $epgInfoMap = MasterManager::getEPGInfoMap();//得到缓存信息
        $userIp = $epgInfoMap['userIP'];

        $this->assign('isVip', $isVip);
        $this->assign('userIp', $userIp);

        $this->displayEx(__FUNCTION__);
    }

    public function jumpToPayUI()
    {
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $this->displayEx(__FUNCTION__);
    }

    /**
     * @brief: 去服务器测试入口
     */
    public function goServerResponseTestUI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign('inner', 0);

        LogUtils::info(">>>>>>>>>>>> goServerResponseTestUI");
        $this->displayEx(__FUNCTION__);
    }
}