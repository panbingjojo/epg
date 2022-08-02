<?php
/**
 * Created by PhpStorm.
 * User: caijun
 * Date: 2018/4/2
 * Time: 下午4:27
 */

namespace Home\Model\Page;

use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class PageManager
{
    public static $pas;

    /**
     * 获取页面地址
     * @param $pageName
     * @return bool|mixed|string
     */
    static public function getBasePagePath($pageName)
    {
        $basePath = "";
        if (defined("ROUTER_CONFIG")) {
            $array = PageManager::getRouterConfig();
            $path = $array[$pageName];
            LogUtils::debug("getBasePagePath: path---> " . $path);
            if (!empty($path)) {
                $basePath = U($path);
            }

            LogUtils::debug("getBasePagePath: basePath--->" . $basePath);
        } else {
            LogUtils::debug("ALL_VIEW_PAGES  undefined");
        }
        if ($basePath == null && empty($basePath) && $pageName == "IPTVPortal") {
            //IPTV 大厅地址
            $basePath = MasterManager::getIPTVPortalUrl();
        } elseif (defined('APP_ROOT_PATH') && !self::isContainsSubDomain($basePath)) {
            $basePath = APP_ROOT_PATH . $basePath;
        }

        return $basePath;
    }

    /**
     * 判断路由路径是否与定于的根路径有二级域名的重合
     * @param $basePath string 系统返回的路由路径
     * @return bool true 有包含 false 不包含
     */
    private static function isContainsSubDomain($basePath)
    {
        $result = false;
        $rootPathArr = explode('/', APP_ROOT_PATH);
        if (sizeof($rootPathArr) > 3) {
            $subDomain = $rootPathArr[3];
            $result = strpos($basePath, $subDomain) !== false;
        }
        return $result;
    }

    /**
     * 得到Ajax服务地址的路径
     * @param $funcName
     * @return string
     */
    static public function getAjaxServerPagePath($funcName)
    {
        $ajaxServerUrl = '/index.php/Home/AjaxServer/';
        if (defined('APP_ROOT_PATH')) {
            $ajaxServerPath = APP_ROOT_PATH . $ajaxServerUrl . $funcName;
        } else {
            $ajaxServerPath = $ajaxServerUrl . $funcName;
        }
        return $ajaxServerPath;
    }

    /**
     * @Brief:此函数用于生成路由配置表，并保存在缓冲文件中 Runtime/Data/
     */
    public static function initRouterConfig()
    {
        $default = eval(DEFAULT_VIEW_PAGES); // 统一默认配置
        $activity = eval(ACTIVITY_VIEW_PAGES); // 活动配置
        $special = eval(SPECIAL_VIEW_PAGES); // 特殊配置
        // 合并配置表，写入文件缓存
        $allConfig = array_merge($default, $activity, $special);
        F(ROUTER_CONFIG, $allConfig);
    }

    private static function getRouterConfig()
    {
        // 如果配置表没有存在，则生成配置表
        if (!F(ROUTER_CONFIG)) {
            PageManager::initRouterConfig();
        }

        return F(ROUTER_CONFIG);
    }
}