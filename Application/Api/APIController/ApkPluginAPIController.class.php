<?php
/**
 * Created by longmaster.
 * User: Administrator
 * Date: 2019/8/25
 * Time: 14:29
 */

namespace Api\APIController;

use Home\Controller\BaseController;
use Home\Model\Common\ServerAPI\SystemAPI;

class ApkPluginAPIController extends BaseController
{
    /**
     * 页面配置，在子类中实现页面配置，返回页面配置的数组
     * @return array 返回页面配置数组
     */
    public function config()
    {
        // TODO: Implement config() method.
        return array();
    }

    /**
     *  通用接口获取APk插件版本号
     */
    public function queryApkPluginVersionAction() {
        // 调用CWS接口保存数据
        $appName = isset($_REQUEST['appName']) ? $_REQUEST['appName'] : PLUGIN_VIDEO_APP_NAME;
        $currentVersion = isset($_REQUEST['currentVersion']) ? $_REQUEST['currentVersion'] : '0.0.1';
        $result = SystemAPI::queryApkPluginVersion($appName, $currentVersion);
        $this->ajaxReturn($result, 'EVAL');
    }
}