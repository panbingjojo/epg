<?php
namespace Home\Model\Display;

require "IDisplayPage.class.php";

/**
 * 前端路由
 * Display 目录下配置的是前端路由，控制器路由在~/Config/Router目录下
 * Class IndexDisplayPage
 * @package Home\Model\Display
 */
class IndexDisplayPage implements IDisplayPage {
    public function getDisplayPageConf() {
        return array();
    }

    public function getDefaultPageConf() {
        return array(
            "exitAppUI" => "exitApp",
        );
    }
}