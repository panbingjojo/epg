<?php

namespace Home\Model\Display;

use Home\Model\Common\LogUtils;
use Home\Model\Entry\MasterManager;

class DisplayManager {

    /**
     * @Brief: 通过控制器模块获取对应条件下所需要的页面配置信息
     *
     * @param: $filePath 控制器模块所在文件路径 __FILE__获取
     * @param: $seqCondition 需要页面对应的配置信息
     * @return array 页面配置信息
     */
    public static function getDisplayPage($filePath, $seqCondition) {
        $controllerName = basename($filePath);
        $modelName = substr($controllerName, 0, strpos($controllerName, 'Controller'));

        $displayPageName = 'Home\Model\Display\\' . $modelName . 'DisplayPage';
        $carrierId = MasterManager::getCarrierId();

        // 最终返回的页面配置信息
        $pageConf = array();
        try {
            // 反射获取对应模块的页面配置信息类
            $displayPage = new \ReflectionClass($displayPageName);
            $displayPageInstance = $displayPage->newInstance();

            // 默认页面配置信息
            $defaultPageConf = $displayPageInstance->getDefaultPageConf();
            // 所有地区对应的页面配置信息
            $displayPageConf = $displayPageInstance->getDisplayPageConf();

            if (array_key_exists($carrierId, $displayPageConf)) {
                // 获取区域对应的页面配置信息
                $carrierPageConf = $displayPageConf[$carrierId];
                $defaultCondPageConf = $carrierPageConf[IDisplayPage::DEFAULT_PAGE_CONF];
                $conditionPageConf = null;
                // 遍历找寻对应条件的页面配置信息
                foreach ($seqCondition as $condition) {
                    if (array_key_exists($condition, $carrierPageConf)) {
                        $conditionPageConf = $carrierPageConf[$condition];
                        break;
                    }
                }
                if ($conditionPageConf == null) {
                    // 没有条件对应，返回默认条件配置信息和默认区域配置信息的合并信息
                    $pageConf = array_merge($defaultPageConf, $defaultCondPageConf);
                } else {
                    // 有条件对应，
                    //返回条件配置信息、默认条件配置信息和默认区域配置信息的合并信息
                    $pageConf = array_merge($defaultPageConf, $defaultCondPageConf, $conditionPageConf);
                }
            } else {
                // 返回默认地区信息
                $pageConf = $defaultPageConf;
            }
        } catch (\ReflectionException $e) {
            LogUtils::error("获取页面配置信息出错 --> {$e}");
        }

        return $pageConf;
    }
}