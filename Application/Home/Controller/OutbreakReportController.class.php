<?php
/**
 * Breif: 搜索控制器类，用于实现搜索功能的业务处理
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017-10-20
 * Time: 13:35
 */

namespace Home\Controller;

use Home\Model\Common\ServerAPI\CollectAPI;
use Home\Model\Common\ServerAPI\EpidemicAPI;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;
use Home\Model\Common\SystemManager;

/**
 * Brief: 挽留页控制器
 * Class HoldPageController
 * @package Home\Controller
 */
class OutbreakReportController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array());
    }

    private function jumpHistoryLength(){
        $splashHistory = MasterManager::getSplashHistoryLength();
        if ($splashHistory == null) {
            $splashHistory = 0;
        }
        $this->assign("historyLength", MasterManager::getSplashHistoryLength());
        $this->assign("splashHistory", $splashHistory); // 获取欢迎页在浏览器中的历史步长
    }

    public function nCoVTestUI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");
        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $this->displayEx(__FUNCTION__);
    }

    public function nCoVTestResultUI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $this->displayEx(__FUNCTION__);
    }

    public function nCoVSureAreaUI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        if (MasterManager::getCarrierId() === '000051'){
            $this->assign("areaCodes", json_encode(eval(CHINAUNICOM_AREACODE_MAP)));
        }else{
            $this->assign("areaCodes", '{}');
        }
        $this->displayEx(__FUNCTION__);
    }


    public function epidemicAreaUI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $epidemicDetails = EpidemicAPI::getEpidemicDetails();
        $this->assign("epidemicDetails", $epidemicDetails);
        $this->displayEx(__FUNCTION__);
    }
    //往返地区隔离情况
    public function goHomeIsolationUI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $epidemicDetails = EpidemicAPI::getEpidemicDetails();
        $this->assign("epidemicDetails", $epidemicDetails);
        //如果是
        $areaCode = MasterManager::getAreaCode();
        $carrierId = MasterManager::getCarrierId();

        if(preg_match("/(10000051|0000051)/", $carrierId) &&  isset($areaCode)){
            $areaCodeMap = eval(CHINAUNICOM_AREACODE_MAP);
            $this->assign("LIANTONG_AREAR_NAME", $areaCodeMap[$areaCode][1]);
        }


        $this->displayEx(__FUNCTION__);
    }

    public function nCoVHospitalDepartmentUI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $this->displayEx(__FUNCTION__);
    }

    public function indexV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染

        $isExitApp = parent::getFilter('isExitApp', "0"); // 从局方推荐位进入，然后退回局方

        if(CARRIER_ID == "630092"){
            $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "btn-box-video"; //1爱尔眼科，2第五医院；
        }else{
            $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "btn-1"; //1爱尔眼科，2第五医院；
        }
        $marqueeText = SystemManager::getMarqueeText();
        $indexUrl = MasterManager::getIndexURL();
        $epidemicDetails = EpidemicAPI::getEpidemicDetails();
        $this->assign("epidemicDetails", $epidemicDetails);
        $this->assign("focusIndex2", $focusIndex2);
        $this->assign("indexUrl", $indexUrl);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('mapTime', Date("YmdHi"));
        $this->assign('marqueeText',$marqueeText);
        $this->assign("lmp", MasterManager::getEnterPosition());
        $this->assign('isExitApp', $isExitApp);
        $this->displayEx(__FUNCTION__);
    }

    public function timeLineV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $epidemicRealSowing = EpidemicAPI::getEpidemicRealSowing($page = 1, $pageSize = 10);
        $this->assign("epidemicRealSowing", $epidemicRealSowing);

        $this->displayEx(__FUNCTION__);
    }
    public function areaDataV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染

        $detailTitle = $this->getFilter('detailTitle');
        $scrollIndex = $this->getFilter('scrollIndex','0');

        $epidemicStats = EpidemicAPI::getEpidemicStatistics();
        $this->assign("epidemicStats", $epidemicStats);
        $this->assign("detailTitle", $detailTitle);
        $this->assign("scrollIndex", $scrollIndex);
        $this->displayEx(__FUNCTION__);
    }
    public function areaDataPrevV1UI()
    {
        $isExitApp = parent::getFilter('isExitApp', "0"); // 从局方推荐位进入，然后退回局方
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染

        $detailTitle = $this->getFilter('detailTitle');
        if(CARRIER_ID === '0'){
            $epidemicDetails = EpidemicAPI::getEpidemicDetailsByDate();
        }else{
            $epidemicDetails = EpidemicAPI::getEpidemicDetails();
        }
        $this->assign("epidemicDetails", $epidemicDetails);

        $epidemicStats = EpidemicAPI::getEpidemicStatistics();
        $this->assign("epidemicStats", $epidemicStats);
        $this->assign("detailTitle", $detailTitle);
        $this->assign('isExitApp', $isExitApp);

        $this->displayEx(__FUNCTION__);
    }

    public function knowledgeV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "list-box-1"; //1爱尔眼科，2第五医院；
        $this->assign("focusIndex2", $focusIndex2);

        $pages = isset($_REQUEST['pages']) ? $_REQUEST['pages'] : "1";
        $this->assign("pages", $pages);

        $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : 0;
        $this->assign("type", $type);

        $this->displayEx(__FUNCTION__);
    }

    public function treatmentV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "list-box-1"; //1爱尔眼科，2第五医院；
        $this->assign("focusIndex2", $focusIndex2);

        $pages = isset($_REQUEST['pages']) ? $_REQUEST['pages'] : "1";
        $this->assign("pages", $pages);

        $this->displayEx(__FUNCTION__);
    }

    public function liveChannelHV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "list-box-1"; //1爱尔眼科，2第五医院；
        $this->assign("focusIndex2", $focusIndex2);

        $this->displayEx(__FUNCTION__);
    }
    public function retrogradeV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "list-box-1"; //1爱尔眼科，2第五医院；
        $this->assign("focusIndex2", $focusIndex2);

        $this->displayEx(__FUNCTION__);
    }

    public function liveChannelLV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        self::jumpHistoryLength();
        $this->initCommonRender();  // 初始化通用渲染
        $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "list-box-1"; //1爱尔眼科，2第五医院；
        $this->assign("focusIndex2", $focusIndex2);

        $this->displayEx(__FUNCTION__);
    }


    public function detectAgencyV1UI(){
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        $this->initCommonRender();  // 初始化通用渲染
        $areaCode = MasterManager::getAreaCode();
        $hospitalDataPath = 'V';
        if(CARRIER_ID == CARRIER_ID_CHINAUNICOM_MOFANG) {
            $hospitalDataPath .= $areaCode;
        }else if(CARRIER_ID == CARRIER_ID_SHANDONGDX || CARRIER_ID == CARRIER_ID_SHANDONGDX_APK) {
            $hospitalDataPath .= CARRIER_ID_SHANDONGDX_APK;
        } else if(CARRIER_ID == CARRIER_ID_GUANGXI_YD) {
            $hospitalDataPath .= CARRIER_ID_GUANGXIGD_APK;
        } else {
            $hospitalDataPath .= CARRIER_ID;
        }

        $this->assign("areaId",$areaCode);
        $this->assign("hospitalDataPath",$hospitalDataPath);
        $this->displayEx(__FUNCTION__);
    }

    public function nucleicAcidDetectV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        $this->initCommonRender();  // 初始化通用渲染
        $this->displayEx(__FUNCTION__);
    }

    public function hotlineV1UI()
    {
        //上报模块访问界面
        StatManager::uploadAccessModule("");

        $this->initCommonRender();  // 初始化通用渲染
        include_once("./Application/Config/Common/Conf000051.php");
        $this->assign("firstAreaId",MasterManager::getAreaCode());
        $priValue = eval(CHINAUNICOM_AREACODE_MAP);
        $priValue =$priValue[MasterManager::getAreaCode()][1].'省';
        $this->assign("provinceName",$priValue);

        $this->displayEx(__FUNCTION__);
    }

}