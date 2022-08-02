<?php
/**
 * Brief: 医院控制器
 */

namespace Hospital\Controller;

use Home\Controller\BaseController;
use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;

class HospitalController extends BaseController
{
    private $userId;//用户id
    private $inner = 1;//是否从首页跳转过来，决定专辑按返回时回退到epg页面还是首页
    private $focusIndex = "focus-1-1";
    private $hospitalName = ""; // 医院名称
    private $hospitalId = ""; // 医院ID
    private $version = ""; // 版本ID，1.0白色版本，2.0蓝色版本
    private $function = ""; // 功能ID，jkzx健康咨询，yygh预约挂号，jksp健康视频

    const UNION_HOSPITAL_V1 = 'beicaoyaunzhongyiyuan'; // 联合医院模式v1 -- 百草园医院
    const UNION_HOSPITAL_V2 = 'kuerleheawati';         // 联合医院模式v1 -- 库尔勒市中医医院（第三人民医院）
    const UNION_HOSPITAL_V3 = 'huanweiluyuheijiashan';         // 联合医院模式v3 -- 库尔勒市中医医院（第三人民医院）
    const UNION_HOSPITAL_V4 = 'shufuxianyingjishaxianlianhe';          // 联合医院模式v4 -- 疏附县吾库萨克镇卫生院
    const UNION_HOSPITAL_V5 = 'sanjiufuyunxianrenminyiyuanhebinglianjie';       // 联合医院模式V5 -- 互联网医疗服务，富蕴县人民医院
    const UNION_HOSPITAL_V6 = 'sanjiualetaidiqufuyouhebinglianjie';       // 联合医院模式V6 -- 39健康+阿勒泰地区妇幼保健院
    const UNION_HOSPITAL_V7 = 'hebaxiangyushenglilulianhe';     // 联合医院模式V7 -- 河坝巷社区卫生服务站，胜利路社区卫生服务中心

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        $carrierId = MasterManager::getCarrierId();
        switch ($carrierId) {
            case CARRIER_ID_NINGXIADX:
                return array(
                    "indexV1UI" => "NingXiaQvHospital/index",
                    "hospitalIntroduceV1UI" => "NingXiaQvHospital/HospitalIntroduce",
                    "doctorIntroduceV1UI" => "NingXiaQvHospital/DoctorIntroduce",
                    "diseaseControlV1UI" => "NingXiaQvHospital/DiseaseControl",
                    "doctorListV1UI" => "NingXiaQvHospital/DoctorList",
                );
                break;
            case CARRIER_ID_XINJIANGDX:
                //版本号控制
                if (!empty($this->version)) {
                    switch ($this->version) {
                        case '1.0':
                            return array(
                                "indexV2UI" => "CommunityHospital/V6/index",//社区医院V6模式，白色版本
                            );
                        case '2.0':
                            return array(
                                "indexV2UI" => "CommunityHospital/V7/index",//社区医院V7模式，蓝色版本
                            );
                    }
                }
                if ($this->getMapModel()) {
                    return array(
                        "indexV1UI" => "CommunityHospital/V2/index",//社区医院V2模式，之前是以活动的形式展现
                    );
                } else if ($this->hospitalName == "wanaxiangfuwuzhan" || $this->hospitalName == "wulumuqierdaoqiaoyiyuan") {
                    return array(
                        "indexV1UI" => "CommunityHospital/V3/index",//社区医院V4模式，之前是以活动的形式展现
                    );
                } else if ($this->hospitalName == self::UNION_HOSPITAL_V1 || $this->hospitalName == self::UNION_HOSPITAL_V2 ||
                    $this->hospitalName == self::UNION_HOSPITAL_V3 ||$this->hospitalName == self::UNION_HOSPITAL_V4 ||
                    $this->hospitalName == self::UNION_HOSPITAL_V5 ||$this->hospitalName == self::UNION_HOSPITAL_V6 ||
                    $this->hospitalName == self::UNION_HOSPITAL_V7) {
                    return array(
                        "indexV1UI" => "CommunityHospital/V4/index",//社区医院V4模式，之前是以活动的形式展现
                    );
                } else if ($this->hospitalName == "saimachangpianqu") {
                    return array(
                        "indexV1UI" => "CommunityHospital/V5/index",//社区医院V5模式
                    );
                } else if ($this->hospitalName == "aletaidiqurenminyiyuan") {// 阿勒泰地区人民医院
                    return array(
                        "indexV1UI" => "CommunityHospital/V8/index",// 社区医院V8模式
                    );
                } else {
                    return array(
                        "indexV1UI" => "CommunityHospital/V1/index",//社区医院V1模式
                    );
                }
                break;
            case CARRIER_ID_XINJIANGDX_HOTLINE:
                return array(
                    "indexV1UI" => "Hotline/V1/index",
                );
            default:
                LogUtils::info("###############> no support: " . $carrierId);
                return null;
        }
    }

    /**
     *查找V2，模式下的社区医院
     */
    public function getMapModel()
    {
        $activityHospital = false;
        $areaName = array(
            "huimingjikunyiyuan", "dabanchengyiyuan",
            "huixuanyuanshequfuwuzhan", "wulumuqimaliyiyuan", "shanshanyiyuan", "kuerleshi", "akeshunancheng", "hongxingerchang", "165tuan", "wujiaqushihui", "beijingbaicao", "wulumuqiyalan", "diyishialaer", "saimachang", "saimachanghonhqishequ", "huyangshirenmingyiyuan", "huixiangshequfuwuzhan", "shaquyangzijiangshequweishengfuwuzhongxin",
            "shuixigouzhenpingxiliangcunweishengshi", "hongyangshequweisehngfuwuzhan", "yiningxianzhongyiyiyuan", "baichengxianrenminyiyuan", "aketaoxianrenminyiyuan"
        );
        foreach ($areaName as $val) {
            if ($val == $this->hospitalName) {
                $activityHospital = true;
            }
        }
        return $activityHospital;
    }


    public function hospitalIntroduceV1UI()
    {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        $this->assign("hospitalName", $this->hospitalName); // 医院名称
        $this->assign("hospitalId", $this->hospitalId); // 医院名称
        LogUtils::info("###############> welcome to hospital!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function diseaseControlV1UI()
    {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        $this->assign("hospitalName", $this->hospitalName); // 医院名称
        $this->assign("hospitalId", $this->hospitalId); // 医院名称
        LogUtils::info("###############> welcome to hospital!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function doctorIntroduceV1UI()
    {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("");

        $this->assign("hospitalName", $this->hospitalName); // 医院名称
        $this->assign("hospitalId", $this->hospitalId); // 医院名称
        $this->assign("focusIndex", $this->focusIndex); // 医院名称
        $this->assign('resourcesUrl', RESOURCES_URL);
        LogUtils::info("###############> welcome to hospital!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    public function indexV1UI()
    {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("", $this->hospitalName);

        // 设置进入区医院模块
        MasterManager::setEnterHospitalModule(1);

        $this->assign("hospitalName", $this->hospitalName); // 医院名称
        $this->assign("hospitalId", $this->hospitalId); // 医院Id
        $this->assign("platformType", MasterManager::getPlatformType()); // 医院名称
        $this->assign("unionHospitalVersion", $this->_getUnionHospitalVersion($this->hospitalName)); // 联合医院版本（两个医院同时显示）
        LogUtils::info("###############> welcome to hospital!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }

    private function _getUnionHospitalVersion($hospitalName){
        $version = '';
        switch ($hospitalName) {
            case self::UNION_HOSPITAL_V1:
                $version = 'v1';
                break;
            case self::UNION_HOSPITAL_V2:
                $version = 'v2';
                break;
            case self::UNION_HOSPITAL_V3:
                $version = 'v3';
                break;
            case self::UNION_HOSPITAL_V4:
                $version = 'v4';
                break;
            case self::UNION_HOSPITAL_V5:
                $version = 'v5';
                break;
            case self::UNION_HOSPITAL_V6:
                $version = 'v6';
                break;
            case self::UNION_HOSPITAL_V7:
                $version = 'v7';
                break;
        }
        return $version;
    }

    public function indexV2UI()
    {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染

        //上报模块访问界面
        StatManager::uploadAccessModule("", $this->hospitalName);

        // 设置进入区医院模块
        MasterManager::setEnterHospitalModule(1);

        $this->assign("hospitalName", $this->hospitalName); // 医院名称
        $this->assign("hospitalId", $this->hospitalId); // 医院Id
        $this->assign("function", $this->function); // 功能Id
        $this->assign("version", $this->version); // 功能Id
        $this->assign("platformType", MasterManager::getPlatformType()); // 医院名称
        $pageIndex = isset($_REQUEST['pageIndex']) ? $_REQUEST['pageIndex'] : 0; //1爱尔眼科，2第五医院；
        $focusId = isset($_REQUEST['focusId']) ? $_REQUEST['focusId'] : ""; // 当前页面焦点
        $this->assign("pageIndex",$pageIndex);
        $this->assign("focusId",$focusId);
        LogUtils::info("###############> welcome to hospital!!! param: " . json_encode($_GET));
        $this->displayEx(__FUNCTION__);
    }


    public function doctorListV1UI()
    {
        $this->init();
        $this->initCommonRender();  // 初始化公共渲染
        StatManager::uploadAccessModule("");
        $this->assign("hospitalName", $this->hospitalName); // 医院名称
        $this->assign("hospitalId", $this->hospitalId); // 医院名称
        $this->initCommonRender();  // 初始化通用渲染
        $focusIndex2 = isset($_REQUEST['focusIndex2']) ? $_REQUEST['focusIndex2'] : "list-box-1"; //1爱尔眼科，2第五医院；
        $pages = isset($_REQUEST['pages']) ? $_REQUEST['pages'] : "1";
        $this->assign("focusIndex2", $focusIndex2);
        $this->assign("pages", $pages);
        $this->displayEx(__FUNCTION__);
    }


    private function init()
    {
        $this->hospitalName = parent::getFilter("hospitalName");
        $this->hospitalId = parent::getFilter("hospitalId");
        $this->focusIndex = parent::getFilter("focusIndex");
        $this->version = parent::getFilter("version");
        $this->function = parent::getFilter("function");
    }

}