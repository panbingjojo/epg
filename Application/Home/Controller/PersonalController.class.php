<?php
/**
 * Created by PhpStorm.
 * User: mcc
 * Date: 2018/10/17
 * Time: 下午4:12
 */

namespace Home\Controller;


use Home\Model\Entry\MasterManager;
use Home\Model\Stats\StatManager;
use Home\Model\User\UserManager;

class PersonalController extends BaseController
{

    private $inner = 1; // 是否外部模块直接启动， 默认为1，从应用推荐位进入

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        switch (MasterManager::getCarrierId()){
            case CARRIER_ID_GANSUYD:
                return array(
                    "personalV1UI" => "Personal/V620007/personal"
                );
                break;
            default:
                return array();
        }
    }

    /**
     * 解析session、get参数
     */
    protected function parseUrlParam()
    {
        // 是否从外部模块引入
        $this->inner = parent::requestFilter('inner', 1);

        $this->assign("inner", $this->inner);
    }

    public function personalV1UI()
    {
        $this->initCommonRender();
        $this->parseUrlParam();

        StatManager::uploadAccessModule(MasterManager::getUserId());

        //获取vip信息
        $vipInfo = UserManager::getVipInfo();

        $this->assign("vipInfo", $vipInfo);

        $this->displayEX(__FUNCTION__);
    }
}