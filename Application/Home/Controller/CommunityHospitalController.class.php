<?php


namespace Home\Controller;
use Home\Model\Common\CookieManager;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;

class CommunityHospitalController extends BaseController
{
    /**
     * 页面配置
     * @return array
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__,array(
          isset($_REQUEST['areaName']) ? $_REQUEST['areaName'] : "mingde"
        ));
    }

    public function communityIndexUI()
    {
        $this->initCommonRender();  // 初始化公共渲染
        $inner = parent::getFilter("inner", 1); // 是否为应用内进入 0--表示从外部进入  1--表示从应用内进入
        $areaName = isset($_REQUEST['areaName']) ? $_REQUEST['areaName'] : "mingde"; //1爱尔眼科，2第五医院；
        $pageIndex = isset($_REQUEST['pageIndex']) ? $_REQUEST['pageIndex'] : 0; //1爱尔眼科，2第五医院；
        $this->assign("pageIndex",$pageIndex);
        $this->assign("areaName",$areaName);
        $this->assign("inner", $inner);

        $this->displayEx(__FUNCTION__);
    }

    public function communityDoctorUI()
    {
        $this->initCommonRender();  // 初始化公共渲染
        $this->assign("expertUrl", CWS_HLWYY_URL_OUT);

        $this->displayEx(__FUNCTION__);
    }

    public function healthEducationListUI()
    {
        $this->initCommonRender();  // 初始化公共渲染
        $this->assign("userAccount", MasterManager::getAccountId());
        $areaName = isset($_REQUEST['areaName']) ? $_REQUEST['areaName'] : "midong"; //1爱尔眼科，2第五医院；
        $this->assign("areaName",$areaName);
        $this->assign("expertUrl", 'http://120.70.237.86:10000/cws/39hospital/index.php');
        $this->displayEx(__FUNCTION__);
    }

    public function expertListUI()
    {
        $channel = isset($_REQUEST['channel']) ? $_REQUEST['channel'] : 1; //1爱尔眼科，2第五医院；
        $this->assign("channel", $channel);
        $this->initCommonRender();  // 初始化公共渲染
        $this->assign("userAccount", MasterManager::getAccountId());
        $this->assign("expertUrl", 'http://120.70.237.86:10000/cws/39hospital/index.php');
        $areaName = isset($_REQUEST['areaName']) ? $_REQUEST['areaName'] : "mingde";
        $hospitalId = isset($_REQUEST['hospitalId']) ? $_REQUEST['hospitalId'] : "mingde";
        $this->assign("areaName",$areaName);
        $this->assign("hospitalId",$hospitalId);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->displayEx(__FUNCTION__);
    }

    public function expertDetailsUI()
    {
        $channel = isset($_REQUEST['channel']) ? $_REQUEST['channel'] : 1; //1爱尔眼科，2第五医院；
        $this->assign("channel", $channel);
        $this->initCommonRender();  // 初始化公共渲染
        $this->assign("userAccount", MasterManager::getAccountId());
        $this->assign("expertUrl", 'http://120.70.237.86:10000/cws/39hospital/index.php');
        $areaName = isset($_REQUEST['areaName']) ? $_REQUEST['areaName'] : "mingde";
        $hospitalId = isset($_REQUEST['hospitalId']) ? $_REQUEST['hospitalId'] : "mingde";
        $this->assign('areaName', $areaName);
        $this->assign('hospitalId', $hospitalId);
        //$this->assign('pluginVideoName', PLUGIN_VIDEO_APP_NAME);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->displayEx(__FUNCTION__);
    }

    public function departmentListUI()
    {
        $channel = isset($_REQUEST['channel']) ? $_REQUEST['channel'] : 1; //1爱尔眼科，2第五医院；
        $this->initCommonRender();  // 初始化公共渲染
        $areaName = isset($_REQUEST['areaName']) ? $_REQUEST['areaName'] : "mingde"; //1爱尔眼科，2第五医院；
        $this->assign("areaName",$areaName);
        $this->assign("userAccount", MasterManager::getAccountId());
        $this->assign("channel", $channel);
        $this->assign("expertUrl", 'http://120.70.237.86:10000/cws/39hospital/index.php');
        $this->displayEx(__FUNCTION__);
    }

    public function departmentDetailsUI()
    {
        $channel = isset($_REQUEST['channel']) ? $_REQUEST['channel'] : 1; //1爱尔眼科，2第五医院；
        $this->assign("channel", $channel);
        $this->initCommonRender();  // 初始化公共渲染
        $this->assign("userAccount", MasterManager::getAccountId());
        $this->assign("expertUrl", 'http://120.70.237.86:10000/cws/39hospital/index.php');
        $this->displayEx(__FUNCTION__);
    }

    public function eyeHospitalUI()
    {
        $this->initCommonRender();  // 初始化公共渲染
        $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "recommended-1"; //1爱尔眼科，2第五医院；
        $this->assign("focusIndex2", $focusIndex2);
        $this->assign("userAccount", MasterManager::getAccountId());
        $this->assign("expertUrl", 'http://120.70.237.86:10000/cws/39hospital/index.php');
        $this->displayEx(__FUNCTION__);
    }

    public function fifthHospitalUI()
    {
        $this->initCommonRender();  // 初始化公共渲染
        $epgInfoMap = MasterManager::getEPGInfoMap();
        $playUrl = $epgInfoMap["VAStoEPG"];
        $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "recommended-1"; //1爱尔眼科，2第五医院；
        $this->assign("domainUrl", $playUrl);
        $this->assign("userAccount", MasterManager::getAccountId());
        $this->assign("focusIndex2", $focusIndex2);
        $this->assign("expertUrl", 'http://120.70.237.86:10000/cws/39hospital/index.php');
        $this->displayEx(__FUNCTION__);
    }

    public function gymUI()
    {
        $this->initCommonRender();
        $this->displayEx(__FUNCTION__);
    }

    public function hospitalPackageUI()
    {
        $this->initCommonRender();
        $this->displayEx(__FUNCTION__);
    }

    public function bloodManageIndexUI()
    {
        $this->initCommonRender();
        $name = isset($_REQUEST['name']) ? $_REQUEST['name'] : "";
        $age = isset($_REQUEST['age']) ? $_REQUEST['age'] : "";
        $sex = isset($_REQUEST['sex']) ? $_REQUEST['sex'] : "";
        $member_id = isset($_REQUEST['member_id']) ? $_REQUEST['member_id'] : "";
        $this->assign("name", $name);
        $this->assign("age", $age);
        $this->assign("sex", $sex);
        $this->assign("member_id", $member_id);
        $this->displayEx(__FUNCTION__);
    }

    public function bloodDataUpUI()
    {
        $this->initCommonRender();
        $member_id = isset($_REQUEST['member_id']) ? $_REQUEST['member_id'] : "";
        $name = isset($_REQUEST['name']) ? $_REQUEST['name'] : "";
        $this->assign("member_id", $member_id);
        $this->assign("name", $name);
        $this->displayEx(__FUNCTION__);
    }

    public function addUserUI()
    {
        $this->initCommonRender();
        $this->assign('server_iptvforward_cws_fs',SERVER_IPTVFORWARD_CWS_FS);
        $this->displayEx(__FUNCTION__);
    }
    public function membersListUI()
    {
        $this->initCommonRender();
        $this->displayEx(__FUNCTION__);
    }

}