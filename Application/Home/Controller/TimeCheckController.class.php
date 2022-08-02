<?php
/* 
  +----------------------------------------------------------------------+ 
  | IPTV                                                                 | 
  +----------------------------------------------------------------------+ 
  | 定时器时间校验
  +----------------------------------------------------------------------+ 
  | Author: yzq                                                          |
  | Date: 2018/3/20 13:51                                                |
  +----------------------------------------------------------------------+ 
 */


namespace Home\Controller;

class TimeCheckController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        return array();
    }

    public function getTimeUI()
    {
        $reTime = date("Y-m-d H:i:s", time());
        $this->ajaxReturn($reTime);
    }
}