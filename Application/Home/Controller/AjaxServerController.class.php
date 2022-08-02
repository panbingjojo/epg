<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/4/3
 * Time: 上午11:25
 */

namespace Home\Controller;


use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Entry\MasterManager;
use Home\Model\Page\PageManager;
use Home\Model\Stats\StatManager;

/**
 * 所有页面的ajax请求都到该页面进行统一操作
 * Class AjaxServerController
 * @package Home\Controller
 */
class AjaxServerController extends BaseController
{

    /**
     * 页面配置方法
     * @return mixed
     */
    public function config()
    {
        return array();
    }

    /**
     * 获取页面的路径
     */
    public function getBasePagePathUI()
    {
        $pageName = (isset($_POST['page_name']) ? $_POST['page_name'] : "");   //页面名称

        $basePagePath = PageManager::getBasePagePath($pageName);

        $this->ajaxReturn($basePagePath);
    }

    /**
     * @brief:当用户点击播放视频时，调用此函数来上报用户的播放视频信息 PTV->CWS(11012) 上报视频播放记录（开始播放）
     */
    public function statPlayUI()
    {
        $statFlag = parent::getFilter("statFlag");
        switch ($statFlag) {
            case 1:
                $userId = $_POST['userId']; // userId 是用户在EPG上的账号，不是在CWS服务器上的账号

                $beginTime = date("Y-m-d H:i:s", time());
                // 上报用户播放统计数据 // 获取视频参数
                $playInfo = array(
                    "beginTime" => $beginTime,
                    "title" => $_POST['title'],
                    "type" => $_POST['type'],
                    "sourceId" => $_POST['sourceId'],
                    "entryType" => $_POST['entryType'],
                    "entryTypeName" => $_POST['entryTypeName'],
                    "search_condition" => $_POST['searchCondition'],
                    "freeSeconds" => $_POST['freeSeconds'],
                    "userType" => $_POST['userType'],
                    "videoUrl" => $_POST['videoUrl']
                );

                //上报结果开始播放
                $result = StatManager::uploadPlayVideoStart($userId, $playInfo);
                if ($result) {
                    echo json_encode(array('result' => 0));
                } else {
                    echo json_encode(array('result' => -1));
                }
                break;
            case 2:
                $userID = MasterManager::getUserId();
                StatManager::uploadPlayVideoFinish($userID, null);
                break;
            default:
                echo json_encode(array('result' => -1));
                break;
        }

        exit();
    }

    /**
     * 心跳包，保持页面的session_id在线状态
     */
    public function heartbeatUI()
    {
        $resultData = SystemAPI::sendHeart();
        // {"result":0,"ret_msg":"success","server_dt":"2019-03-16 10:59:57","free_flag":"0"}

        // 把用户权限与vip状态相与，得到最终的权限
        $freeFlag = isset($resultData['free_flag']) ? $resultData['free_flag'] : 0; // 这个是管理后台配置的
        $authFreeFlag = MasterManager::getFreeExperience(); // 这个是局方鉴权回来 ---新疆电信EPG
        $freeFlag = $freeFlag || $authFreeFlag;
        $isVip = MasterManager::getUserIsVip();
        // 合并权限
        if (!empty($freeFlag) && ($freeFlag != null) && ($freeFlag != $isVip)) {
            $type = $freeFlag || $isVip;
            if ($type) {
                LogUtils::info("===> set user access type is : $type");
                MasterManager::setUserIsVip(1);
            } else {
                LogUtils::info("===> set user access type is : $type");
                MasterManager::setUserIsVip(0);
            }
        }
        $this->ajaxReturn($resultData, 'JSON');
    }

    /**
     * 日志记录
     */
    public function logUI()
    {
        $logLevel = parent::postFilter("logLevel");
        $msg = $_POST['msg'];

        $logLevelList = ["debug", "warn", "info", "error", "fatal"];
        if (!in_array($logLevel, $logLevelList) || $msg == "") {
            return false;
        }

        switch ($logLevel) {
            case "debug":
                LogUtils::debug($msg);
                break;
            case "warn":
                LogUtils::warn($msg);
                break;
            case "info":
                LogUtils::info($msg);
                break;
            case "error":
                LogUtils::error($msg);
                break;
            case "fatal":
                LogUtils::fatal($msg);
                break;
            default:
                LogUtils::debug($msg);
                break;
        }
        $this->ajaxReturn("true");
    }
}