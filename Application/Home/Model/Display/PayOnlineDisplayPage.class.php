<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class PayOnlineDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "payOnlineV1UI" => "PayOnline/V1/payOnline",              // 在线购买首页
                    "productDetailV1UI" => "PayOnline/V1/productDetail",
                )
            ),
        );
    }

    public function getDefaultPageConf()
    {
        return array(
            "payOnlineV1UI" => "PayOnline/V1/payOnline",              // 在线购买首页
            "productDetailV1UI" => "PayOnline/V1/productDetail",
        );
    }
}