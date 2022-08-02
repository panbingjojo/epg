<?php


namespace Home\Model\Display;

use Home\Model\Entry\MasterManager;

require "IDisplayPage.class.php";

class PayDisplayPage implements IDisplayPage
{

    public function getDisplayPageConf()
    {
        return array(
            CARRIER_ID_CHINAUNICOM => array(
                '211' => array(
                    "tempPayPageUI" => "Pay/V000051/V7/Index30Day",
                    "indexV1UI" => "Pay/V000051/V1/index",
                ),
                '217' => array(
                    "indexV1UI" => "Pay/V000051/V5/index",
                ),
                '216' => array(
                    "indexV1UI" => "Pay/V000051/V8/index",
                ),
                self::DEFAULT_PAGE_CONF => array(
                    "searchOrderUI" => "Pay/V000051/V13/searchOrder",
                    "tempPayPageUI" => "Pay/V000051/V7/IndexTwo",
                    "indexV1UI" => "Pay/V000051/V4/index",
                    "fakeOrderV1UI" => "Pay/V000051/fakeOrder",
                    "hadOrderVipUI" => "Pay/V000051/HadOrderVip",
                    "unsubscribeVipUI" => "Pay/V000051/UnsubscribeVip",
                    "secondUnsubscribeVipUI" => "Pay/V000051/SecondUnsubscribe",
                    "unsubscribeResultUI" => "Pay/V000051/UnsubscribeResult",
                    "queryOrderProductListUI" => "Pay/V000051/QueryOrderProductList",
                    "payShowResultUI" => "Pay/V000051/V7/PayResult",
                )
            ),
            CARRIER_ID_NINGXIAGD => array(
                '211' => array(
                    "tempPayPageUI" => "Pay/V000051/V7/Index30Day",
                ),
                '217' => array(
                    "indexV1UI" => "Pay/V000051/V5/index",
                ),
                self::DEFAULT_PAGE_CONF => array(
                    "searchOrderUI" => "Pay/V000051/V13/searchOrder",
                    "tempPayPageUI" => "Pay/V000051/V7/IndexTwo",
                    "indexV1UI" => "Pay/V000051/V4/index",
                    "hadOrderVipUI" => "Pay/V000051/HadOrderVip",
                    "unsubscribeVipUI" => "Pay/V000051/UnsubscribeVip",
                    "secondUnsubscribeVipUI" => "Pay/V000051/SecondUnsubscribe",
                    "unsubscribeResultUI" => "Pay/V000051/UnsubscribeResult",
                    "queryOrderProductListUI" => "Pay/V000051/QueryOrderProductList",
                    "payShowResultUI" => "Pay/V000051/V7/PayResult",
                )
            ),
            CARRIER_ID_GUANGDONGGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V440094/index",
                    "directPayUI" => "Pay/V440094/directPay",
                    "payShowResultUI" => "Pay/V440094/payResult",
                )
            ),
            CARRIER_ID_JIANGSUDX_YUEME => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V000005/index",
                    "payShowResultUI" => "Pay/V000005/payResult",
                )
            ),
            CARRIER_ID_GUANGDONGGD_NEW => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V440004/index",
                    "directPayUI" => "Pay/V440004/directPay",
                    "payShowResultUI" => "Pay/V440004/payResult",
                )
            ),
            CARRIER_ID_SHANDONGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V370092/index",
                    "directPayUI" => "Pay/V370092/directPay",
                    "payShowResultUI" => "Pay/V370092/payResult",
                )
            ),
            CARRIER_ID_SHANDONGDX_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V370002/index",
                    "directPayUI" => "Pay/V370002/directPay",
                    "payShowResultUI" => "Pay/V370002/payResult",
                    "payInfoUI" => "Pay/V370002/index",
                )
            ),
            CARRIER_ID_SHANDONGDX_HAIKAN => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V371092/index",
                    "directPayUI" => "Pay/V371092/directPay",
                    "payShowResultUI" => "Pay/V371092/payResult",
                )
            ),
            CARRIER_ID_HAIKAN_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V371002/index",
                    "directPayUI" => "Pay/V371002/directPay",
                    "payShowResultUI" => "Pay/V371002/payResult",
                )
            ),
            CARRIER_ID_GUIZHOUGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V520094/index",
                    "directPayUI" => "Pay/V520094/directPay",
                    "submitPhoneUI" => "Pay/V520094/submitPhone",
                )
            ),
            CARRIER_ID_QINGHAIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "payInfoUI" => "Pay/V630092/payInfo",
                )
            ),
            CARRIER_ID_HUBEIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => in_array(MasterManager::getEnterPosition(), $this->getSpecialPosition())?"Pay/V420092/index":"Pay/V420092/V1/index",
                    "payInfoUI" => in_array(MasterManager::getEnterPosition(), $this->getSpecialPosition())?"Pay/V420092/index":"Pay/V420092/V1/index",
                )
            ),
            CARRIER_ID_JIANGSUDX_OTT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "payInfoUI" => "Pay/V320005/index",
                )
            ),
            CARRIER_ID_YBHEALTH => array(
                self::DEFAULT_PAGE_CONF => array(
                    "payInfoUI" => "Pay/V630092/payInfo"
                )
            ),

            CARRIER_ID_MANGOTV_LT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "payInfoUI" => "Pay/V07430093/index",
                    "indexV1UI" => "Pay/V07430093/index",
                )
            ),
            CARRIER_ID_MANGOTV_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "payInfoUI" => "Pay/V07430091/index",

                )
            ),
            CARRIER_ID_NINGXIADX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "payInfoUI" => "Pay/V630092/payInfo",
                )
            ),
            CARRIER_ID_SHANXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "payInfoUI" => "Pay/V610092/payInfo",
                )
            ),
            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V650092/index",
                    "directPayUI" => "Pay/V650092/directPay",
                )
            ),
            CARRIER_ID_XINJIANGDX_TTJS => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V12650092/index",
                    "directPayUI" => "Pay/V12650092/directPay",
                )
            ),
            CARRIER_ID_GUIZHOUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V520092/index",
                    "payShowResultUI" => "Pay/V520092/payResult",
                    "payInfoUI" => "Pay/V520092/payInfo",
                    "directPayUI" => "Pay/V520092/directPay",
                )
            ),

            CARRIER_ID_GUIZHOUGD_XMT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V520095/index",
                    "payShowResultUI" => "Pay/V520095/payResult",
                    "payInfoUI" => "Pay/V520095/payInfo",
                    "directPayUI" => "Pay/V520095/directPay",
                )
            ),

            CARRIER_ID_JILINGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V220094/index",
                    "tempPayPageUI" => "Pay/V220094/directPay",
                    "payShowResultUI" => "Pay/V220094/payResult",
                )
            ),
            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V500092/index",
                )
            ),
            CARRIER_ID_JILINGD_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "searchOrderUI" => "Pay/V10220094/V13/searchOrder",
                    "tempPayPageUI" => "Pay/V10220094/V7/IndexTwo",
                    "indexV1UI" => "Pay/V10220094/index",
                    "fakeOrderV1UI" => "Pay/V10220094/fakeOrder",
                    "hadOrderVipUI" => "Pay/V10220094/HadOrderVip",
                    "unsubscribeVipUI" => "Pay/V10220094/UnsubscribeVip",
                    "secondUnsubscribeVipUI" => "Pay/V10220094/SecondUnsubscribe",
                    "unsubscribeResultUI" => "Pay/V10220094/UnsubscribeResult",
                    "queryOrderProductListUI" => "Pay/V10220094/QueryOrderProductList",
                    "payShowResultUI" => "Pay/V10220094/payResult",
                )
            ),
            CARRIER_ID_JILINGDDX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "searchOrderUI" => "Pay/V10220094/V13/searchOrder",
                    "tempPayPageUI" => "Pay/V10220094/V7/IndexTwo",
                    "indexV1UI" => "Pay/V10220095/index",
                    "fakeOrderV1UI" => "Pay/V10220094/fakeOrder",
                    "hadOrderVipUI" => "Pay/V10220094/HadOrderVip",
                    "unsubscribeVipUI" => "Pay/V10220094/UnsubscribeVip",
                    "secondUnsubscribeVipUI" => "Pay/V10220094/SecondUnsubscribe",
                    "unsubscribeResultUI" => "Pay/V10220094/UnsubscribeResult",
                    "queryOrderProductListUI" => "Pay/V10220094/QueryOrderProductList",
                    "payShowResultUI" => "Pay/V10220094/payResult",
                )
            ),
            CARRIER_ID_NINGXIADX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V10640092/index",
                )
            ),
            CARRIER_ID_HEILONGJIANG_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V01230001/V1/index",
                )
            ),
            CARRIER_ID_HUNANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V430002/index",
                )
            ),
            CARRIER_ID_JILIN_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V220001/V2/index",
                )
            ),
            CARRIER_ID_GANSUYD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => MasterManager::getEnterFromYsten() == '1'?"Pay/V620007/V5/index":"Pay/V620007/V3/index",
                    "indexDiscountUI" => "Pay/V620007/V2/indexDiscount",
                    "payShowResultUI" => "Pay/V620007/payResult",
                )
            ),
            CARRIER_ID_QINGHAI_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V630001/V1/" . (true ? "indexV2" : "index_2"),
                    "payShowResultUI" => "Pay/V630001/payResult",
                )
            ),
            CARRIER_ID_XIZANG_YD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V540001/index2",
                    "payShowResultUI" => "Pay/V540001/payResult",
                )
            ),
            CARRIER_ID_JIANGXIYD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V360001/index",
                    "payShowResultUI" => "Pay/V360001/payResult",
                )
            ),
            CARRIER_ID_JIANGSUYD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V320001/index",
                    "payShowResultUI" => "Pay/V320001/payResult",
                )
            ),
            CARRIER_ID_ZHEJIANG_HUASHU => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V320013/index",
                    "payShowResultUI" => "Pay/V320013/payResult",
                )
            ),
            CARRIER_ID_GUANGXIGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V450094/index",
                    "payShowResultUI" => "Pay/V450004/payResult",
                )
            ),
            CARRIER_ID_HUNANYX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V430012/index",
                    "payShowResultUI" => "Pay/V430012/payResult",
                )
            ),
            CARRIER_ID_HENANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Pay/V410092/index",
                    "directPayUI" => "Pay/V410092/directPay",
                )
            ),
        );
    }


    public function getDefaultPageConf()
    {
        return array(
            "indexV1UI" => "Pay/V" . MasterManager::getCarrierId() . "/index",
            "payShowResultUI" => "Pay/V" . MasterManager::getCarrierId() . "/PayResult",
        );
    }

    public function getSpecialPosition(){
        switch (MasterManager::getCarrierId()) {
            case CARRIER_ID_HUBEIDX:
                $position = array(45,48,41,40,47,44,32,33);
                break;
            default:
                $position = array();
                break;
        }
        return $position;
    }
}