<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

/**
 * 启动页配置类
 * Class SplashDisplayPage
 * @package Home\Model\Display
 */
class SplashDisplayPage implements IDisplayPage {
    public function getDisplayPageConf() {
        return array();
    }

    public function getDefaultPageConf() {
        return array(
            "indexV1UI" => "Splash/splash"
        );
    }
}