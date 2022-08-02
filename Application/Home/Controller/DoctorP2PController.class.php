<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/3/14
 * Time: 11:01
 */

namespace Home\Controller;

use Home\Model\Activity\ActivityManager;
use Home\Model\Common\LogUtils;
use Home\Model\Common\RedisManager;
use Home\Model\Common\Utils;
use Home\Model\Display\DisplayManager;
use Home\Model\Entry\MasterManager;
use Home\Model\Inquiry\InquiryManager;
use Home\Model\Stats\StatManager;

class DoctorP2PController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return DisplayManager::getDisplayPage(__FILE__, array(
            MasterManager::getEnterPosition() == '266' || MasterManager::getEnterPosition() == '290' ? 'smallPack' : 'default',
        ));
    }

    /**
     * 视频问诊 - 医生列表页
     */
    public function doctorListV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $deptId = parent::getFilter('deptId', "全部科室");
        $deptIndex = parent::getFilter('deptIndex', "0");
        $currentPage = parent::getFilter('currentPage', 1);
        $focusId = parent::getFilter('focusId', "all_depart");
        $returnUrl = parent::getFilter('returnUrl');
        $parentPage = parent::getFilter('parentPage');
        $hospitalId = parent::getFilter('hospitalId', "");
        $inner = parent::getFilter('inner', 1);
        $phone = MasterManager::getP2PPhone();

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("hospitalId", $hospitalId); // 医院ID
        $this->assign("deptId", $deptId);
        $this->assign("deptIndex", $deptIndex);
        $this->assign("currentPage", $currentPage);
        $this->assign("focusId", $focusId);
        $this->assign('returnUrl', $returnUrl);
        $this->assign('parentPage', $parentPage);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('phone', $phone);
        $this->assign('inner', $inner);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 在线问医模块(V1) -- 医生所属科室选择页面
     */
    public function doctorDepartmentV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $returnUrl = parent::getFilter('returnUrl');
        $parentPage = parent::getFilter('parentPage');
        $deptId = parent::getFilter('deptId', "全部科室");

        $result = InquiryManager::queryHLWYY(InquiryManager::FUNC_GET_DEPARTMENT_LIST, "");

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("departmentData", $result);
        $this->assign("returnUrl", $returnUrl);
        $this->assign("parentPage", $parentPage);
        $this->assign("deptId", $deptId);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 在线问医模块(V1) -- 医生详情页面
     */
    public function doctorDetailsV1UI()
    {
        // 上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());
        // 初始化通用渲染
        $this->initCommonRender();

        $hospitalId = parent::getFilter('hospitalId', "");
        $this->assign("hospitalId", $hospitalId); // 医院ID

        $phone = MasterManager::getP2PPhone();
        $this->assign('phone', $phone);

        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('cwsWXServerUrl', CWS_WXSERVER_URL_OUT);

        // 医生信息渲染
        $this->_assignDoctorInfo();

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 在线问医模块(V10) -- 医生列表页面
     */
    public function doctorIndexV11UI()
    {
        // 初始化通用渲染
        $this->initCommonRender();
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $deptID = parent::requestFilter("departmentId", "");
        $deptIndex = parent::requestFilter("departmentIndex", "0");
        $deptName = parent::requestFilter("departmentName", "请选择科室");
        $scrollTop = parent::requestFilter("scrollTop", "0");
        $P2PScrollTop = parent::requestFilter("P2PScrollTop", "0");
        $pageCurrent = parent::requestFilter("pageCurrent", "1");
        $focusIndex = parent::requestFilter("focusIndex", "department");

        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);

        $this->assign("scrollTop", $scrollTop);
        $this->assign("P2PScrollTop", $P2PScrollTop);
        $this->assign("pageCurrent", $pageCurrent);
        $this->assign("focusIndex", $focusIndex);
        $this->assign("departmentId", $deptID);
        $this->assign("departmentIndex", $deptIndex);
        $this->assign("departmentName", $deptName);
        $this->assign("lmp", MasterManager::getEnterPosition());

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 在线问医模块（V10） -- 医生所属科室列表页面
     */
    public function doctorDepartmentV10UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $deptId = parent::getFilter('departmentId', "");
        $deptName = parent::getFilter('departmentName', "全部科室");
        $scrollTop = parent::requestFilter("scrollTop", "0");
        $this->assign('departmentId', $deptId);
        $this->assign('departmentName', $deptName);
        $this->assign('scrollTop', $scrollTop);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 在线问医模块(V10) -- 医生详情页面
     */
    public function doctorDetailsV10UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $docId = isset($_GET['doc_id']) ? $_GET['doc_id'] : "";

        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign("docId", $docId);

        $this->displayEx(__FUNCTION__);
    }

    public function doctorDetailsV28UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());
        $docId = isset($_GET['doc_id']) ? $_GET['doc_id'] : "";
        $this->assign('pluginVideoName', PLUGIN_VIDEO_APP_NAME);
        $this->assign('pluginVideoDownloadUrl', PLUGIN_VIDEO_DOWNLOAD_URL);
        $this->assign("expertUrl", CWS_EXPERT_URL_OUT);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign("docId", $docId);
        $this->displayEx(__FUNCTION__);
    }

    // 中国联通新版
    public function doctorCommentV13UI()
    {
        $this->initCommonRender();
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 在线问医模块(V13) -- 医生列表页面
     */
    public function doctorIndexV13UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $deptId = parent::getFilter('deptId', "");
        $deptIndex = parent::getFilter('deptIndex', "0");
        $page = parent::getFilter('page', 1);

        $returnUrl = parent::getFilter('returnUrl');
        $parentPage = parent::getFilter('parentPage');
        $isExitApp = parent::getFilter('isExitApp', "0"); // 从局方推荐位进入，然后退回局方
        $isHeartAsk = parent::getFilter('isHeartAsk',false);
        $phone = MasterManager::getP2PPhone();

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("deptId", $deptId);
        $this->assign("deptIndex", $deptIndex);
        $this->assign("page", $page);
        $this->assign('returnUrl', $returnUrl);
        $this->assign('parentPage', $parentPage);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('cwsWXServerUrl', CWS_WXSERVER_URL_OUT);
        $this->assign('phone', $phone);

        /** apk平台配置访问进入的时候只有问诊的功能，返回的时候直接退出当前应用 */
        $onlyInquiryCarriers = [CARRIER_ID_JIANGXIYD/* 江西移动apk */, CARRIER_ID_JIANGSUYD/* 江苏移动apk */, CARRIER_ID_ANHUIYD_YIBAN/* 安徽移动（怡伴）apk */,
            CARRIER_ID_GUANGXI_YD_YIBAN/* 广西移动(怡伴)apk */, CARRIER_ID_WEILAITV_TOUCH_DEVICE /* 未来电视触摸设备 */, CARRIER_ID_YB_HEALTH_UNIFIED /* 未来电视统一接口 */,
            CARRIER_ID_SHIJICIHAI/* 世纪慈海在线问诊APK */];
        if (in_array(CARRIER_ID, $onlyInquiryCarriers)) {
            $isExitApp = 1;
        }
        $this->assign('isExitApp', $isExitApp);

        // 判断是否新疆电信EPG社区医院
        $isXIN_JIANGCommunityHospitals = CARRIER_ID == CARRIER_ID_XINJIANGDX && isset($_GET['s_demo_id']) && !empty($_GET['s_demo_id']);
        $defaultFocusId = 'one-key-inquiry';
        // 页面显示标题
        $title = "在线问医";
        // 是否显示底部提示文案
        $isShowFooter = 1;
        if ($isXIN_JIANGCommunityHospitals || CARRIER_ID == CARRIER_ID_XINJIANGDX_HOTLINE) {
            // 新疆电信EGP社区医院和民生热线不显示头部
            $headerFunctions = '';
            // 新疆电信EGP社区医院和民生热线标题显示医院名称
            $title = $hospitalName =  $_GET['hospitalName'];
            // 新疆电信EGP社区医院和民生热线不显示底部提示语
            $isShowFooter = 0;
            // 新疆电信EGP社区医院和民生热线分配前端当前显示的医院ID和跳转标识
            $this->assign('hospitalId', $_GET['hospitalId']);
            $this->assign('sDemoId', $_GET['s_demo_id']);
            // 新疆电信EGP社区医院保存社区医院名称用作问医记录用户访问来源 （局方上报要求）
            $usrSrcKey = MasterManager::getUserId() . "_inquiry";
            RedisManager::setPageConfig($usrSrcKey, $hospitalName, 2 * 60 * 60);
            // 修改默认焦点
            $defaultFocusId = 'doctor-item-0';
        } else if (CARRIER_ID == CARRIER_ID_WEILAITV_TOUCH_DEVICE) {
            // 未来电视触摸平台显示【选择部门】【医生排班】
            $headerFunctions = 'select-department,doctor-schedule';
        } else if (CARRIER_ID == CARRIER_ID_SHIJICIHAI) {
            $headerFunctions = 'one-key-inquiry,ask-record';
        } else if (CARRIER_ID == CARRIER_ID_GUANGDONGYD) {
            $headerFunctions = 'one-key-inquiry,select-department,ask-record';
        } else {
            // 其他平台默认显示【选择部门】【一键问医】
            $headerFunctions = 'select-department,one-key-inquiry';
        }
        $this->assign('headerFunctions', $headerFunctions);
        $this->assign('title', $title);
        $this->assign('isShowFooter', $isShowFooter);
        $this->assign('isHeartAsk', $isHeartAsk);


        // 传递前端默认焦点
        $focusId = parent::getFilter('focusId', $defaultFocusId);
        $this->assign("focusId", $focusId);


        $this->displayEx(__FUNCTION__);
    }

    /**
     * 在线问医模块（V13） -- 医生详情页面
     */
    public function doctorDetailsV13UI()
    {
        $this->initCommonRender();  // 初始化通用渲染
        StatManager::uploadAccessModule(MasterManager::getUserId()); //上报模块访问界面

        $doctorIndex = parent::getFilter('doctorIndex');
        $this->assign("doctorIndex", $doctorIndex);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('cwsWXServerUrl', CWS_WXSERVER_URL_OUT);
        $this->assign('pluginVideoName', PLUGIN_VIDEO_APP_NAME);


        $isShowCollect = 1; // 是否展示收藏按钮
        $hideCollectCarriers = [CARRIER_ID_SHANDONGDX_APK/* 山东电信apk */, CARRIER_ID_GANSUYD/* 甘肃移动apk */,
            CARRIER_ID_DEMO4/* 展厅演示版本4 */, CARRIER_ID_JILINGDDX/* 吉林电信EPG */,
            CARRIER_ID_HUBEIDX/*湖北电信*/,CARRIER_ID_HAINANDX, CARRIER_ID_SHIJICIHAI/* 世纪慈海在线问诊APK */,
            CARRIER_ID_HEBEIYD/*河北移动*/];
        $isXJCommunityHospitals = CARRIER_ID == CARRIER_ID_XINJIANGDX && isset($_GET['s_demo_id']);
        if (in_array(CARRIER_ID, $hideCollectCarriers) || $isXJCommunityHospitals) { // 需要隐藏收藏按钮的地区
            $isShowCollect = 0; // 隐藏收藏按钮
            $this->assign('sDemoId', $_GET['s_demo_id']);
        }
        $this->assign('isShowCollect', $isShowCollect);

        $this->displayEx(__FUNCTION__);
    }

    /**
     * 新疆电信epg -- 天翼问诊页面
     */
    public function DoctorEntrUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $this->displayEx(__FUNCTION__);//进行页面的加载显示
    }

    /**
     * 中国联通健康魔方epg -- 小程序二维码
     */
    public function AppletsQrCodeUI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $this->displayEx(__FUNCTION__);//进行页面的加载显示
    }

    /**
     * 电视电话/小程序问诊页面
     */
    public function inquiryCallV1UI()
    {
        $this->initCommonRender();  // 初始化通用渲染

        $avatarUrl = parent::getFilter('avatar_url');
        $avatarUrlNew = parent::getFilter('avatar_url_new');
        $department = parent::getFilter('department');
        $docId = parent::getFilter('doc_id');
        $docName = parent::getFilter('doc_name');
        $gender = parent::getFilter('gender');
        $goodDisease = parent::getFilter('good_disease');
        $hospital = parent::getFilter('hospital');
        $inquiryNum = parent::getFilter('inquiry_num');
        $introDesc = parent::getFilter('intro_desc');
        $jobTitle = parent::getFilter('job_title');
        $onlineState = parent::getFilter('online_state');
        $realImageUrl = parent::getFilter('realImageUrl');
        $entryType = parent::getFilter('entryType');
        $returnUrl = parent::getFilter('returnUrl');
        $scene = parent::getFilter('scene');
        $displayIndex = parent::getFilter('displayIndex');
        $phone = parent::getFilter('phone');
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('cwsWXServerUrl', CWS_WXSERVER_URL_OUT);

        //上报模块访问界面
        StatManager::uploadAccessModule(MasterManager::getUserId());

        $this->assign("avatarUrl", $avatarUrl);
        $this->assign("avatarUrlNew", $avatarUrlNew);
        $this->assign("department", $department);
        $this->assign("docId", $docId);
        $this->assign("docName", $docName);
        $this->assign("gender", $gender);
        $this->assign("goodDisease", $goodDisease);
        $this->assign("hospital", $hospital);
        $this->assign("inquiryNum", $inquiryNum);
        $this->assign("introDesc", $introDesc);
        $this->assign("jobTitle", $jobTitle);
        $this->assign("onlineState", $onlineState);
        $this->assign("realImageUrl", $realImageUrl);
        $this->assign('scene', $scene);
        $this->assign('displayIndex', $displayIndex);
        $this->assign('pluginVideoName', PLUGIN_VIDEO_APP_NAME);
        $this->assign('pluginVideoDownloadUrl', PLUGIN_VIDEO_DOWNLOAD_URL);
        $this->assign('cwsHlwyyUrl', CWS_HLWYY_URL_OUT);
        $this->assign('entryType', $entryType);
        $this->assign('phone', $phone);
        $this->displayEx(__FUNCTION__);
    }

    /**
     * 从url链接中获取医生信息参数
     */
    private function _assignDoctorInfo() {
        // 从链接中读取传递的医生信息
        $avatarUrl = parent::getFilter('avatar_url');
        $avatarUrlNew = parent::getFilter('avatar_url_new');
        $department = parent::getFilter('department');
        $docId = parent::getFilter('doc_id');
        $docName = parent::getFilter('doc_name');
        $gender = parent::getFilter('gender');
        $goodDisease = parent::getFilter('good_disease');
        $hospital = parent::getFilter('hospital');
        $inquiryNum = parent::getFilter('inquiry_num');
        $introDesc = parent::getFilter('intro_desc', '', true);
        $jobTitle = parent::getFilter('job_title');
        $onlineState = parent::getFilter('online_state', 0, false);
        $isFakeBusy = parent::getFilter('is_fake_busy', 0, false);
        $entryType = parent::getFilter('entryType');
        $returnUrl = parent::getFilter('returnUrl');
        $parentPage = parent::getFilter('parentPage');
        $realImageUrl = parent::getFilter('realImageUrl');

        // 传递参数到前端页面
        $this->assign("avatarUrl", $avatarUrl);
        $this->assign("avatarUrlNew", $avatarUrlNew);
        $this->assign("department", $department);
        $this->assign("docId", $docId);
        $this->assign("docName", $docName);
        $this->assign("gender", $gender);
        $this->assign("goodDisease", $goodDisease);
        $this->assign("goodDiseaseUrlEncoded", urlencode($goodDisease));
        $this->assign("hospital", $hospital);
        $this->assign("inquiryNum", $inquiryNum);
        $this->assign("introDesc", $introDesc);
        $this->assign("introDescUrlEncoded", urlencode($introDesc));
        $this->assign("jobTitle", $jobTitle);
        $this->assign("onlineState", $onlineState);
        $this->assign("isFakeBusy", $isFakeBusy);
        $this->assign("realImageUrl", $realImageUrl);
        $this->assign("returnUrl", $returnUrl);
        $this->assign("parentPage", $parentPage);
        $this->assign("entryType", $entryType);
    }

}