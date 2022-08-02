<?php
/*
  +----------------------------------------------------------------------+
  | IPTV                                                                 |
  +----------------------------------------------------------------------+
  | 新手指导相关api
  +----------------------------------------------------------------------+
  | Author: yzq                                                          |
  | Date: 2017/11/30 17:56                                                |
  +----------------------------------------------------------------------+
 */

namespace Api\APIController;


use Home\Controller\BaseController;
use Home\Model\User\FirstManager;


class GuideAPIController extends BaseController
{
    public static $F_HOME = "f_home"; //首页
    public static $F_APPOINTMENT = "f_appointment"; //预约挂号
    public static $F_HEALTH_VIDEO = "f_health_video"; //健康视频
    public static $F_P2P = "f_p2p";           //在线问诊
    public static $F_FAMILY = "f_family";    //我的家

    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return null;
    }

    /**
     * 根据模块，设置是否第一次访问，将信息保存到session
     *
     */
    public function setIsFirstHandleAction()
    {
        $ret = array(
            "result" => 0
        );
        $firstHandle = $this->postFilter("firstHandleName", "");
        switch ($firstHandle) {
            case FirstManager::$F_HOME:
                FirstManager::setFHandle(FirstManager::$F_HOME);
                break;
            case FirstManager::$F_APPOINTMENT:
                FirstManager::setFHandle(FirstManager::$F_APPOINTMENT);
                break;
            case FirstManager::$F_HEALTH_VIDEO:
                FirstManager::setFHandle(FirstManager::$F_HEALTH_VIDEO);
                break;
            case FirstManager::$F_P2P:
                FirstManager::setFHandle(FirstManager::$F_P2P);
                break;
            case FirstManager::$F_FAMILY:
                FirstManager::setFHandle(FirstManager::$F_FAMILY);
                break;
            default:
                $ret["result"] = -1;
                break;
        }

        $this->ajaxReturn(json_encode($ret), "EVAL");
    }


}