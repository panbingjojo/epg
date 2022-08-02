<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  | 此主要用于接收来自html页面、js日志记录，并写文档与上报到日志服务器
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2018/1/18 10:29                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Controller;

use Home\Model\Common\LogUtils;

class LogController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    public function logUI()
    {
        $logLevel = parent::requestFilter("logLevel");
        $msg = parent::requestFilter("msg");

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