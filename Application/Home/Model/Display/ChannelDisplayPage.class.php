<?php


namespace Home\Model\Display;

require "IDisplayPage.class.php";

class ChannelDisplayPage implements IDisplayPage
{
    public function getDisplayPageConf()
    {
        $pagePaths = array(
            CARRIER_ID_GUANGXIGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList",
                    "indexV1UI" => "Channel/V4/index",
                )
            ),
            CARRIER_ID_CHINAUNICOM => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V25/index",
                    "secondChannelIndexV13UI" => "Channel/V25/SecondIndex",
                    "videoListV13UI" => "Channel/V25/VideoList"
                )
            ),
            CARRIER_ID_GUIZHOUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V25/index",
                    "secondChannelIndexV13UI" => "Channel/V25/SecondIndex",
                    "videoListV13UI" => "Channel/V25/VideoList"
                )
            ),
            CARRIER_ID_NINGXIAGD => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_LIAONINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_SHANXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_HENANDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_HUBEIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_JIANGSUDX_OTT => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_SHANDONGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList",
                    "indexV1UI" => "Channel/V4/index"
                )
            ),
            CARRIER_ID_SHANDONGDX_HAIKAN => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList",
                    "indexV1UI" => "Channel/V4/index"
                )
            ),
            CARRIER_ID_JIANGSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_GUANGXIDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_GUANGDONGGD_NEW => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_CHONGQINGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_GANSUDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_CHINAUNICOM_MEETLIFE => array(
                self::DEFAULT_PAGE_CONF => array(
                    "indexV1UI" => "Channel/V22/index"
                )
            ),
            CARRIER_ID_XINJIANGDX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList",
                    "indexV1UI" => "Channel/V4/index",
                )
            ),
            CARRIER_ID_NINGXIADX_MOFANG => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V24/moreVideo",
                    "videoListV13UI" => "Channel/V24/collection",
                )
            ),
            CARRIER_ID_NINGXIADX => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            ),
            CARRIER_ID_LDLEGEND => array(
                self::DEFAULT_PAGE_CONF => array(
                    "videoListV13UI" => "Channel/V28/collection",
                )
            ),
            // --------APK版本从这里开始配置--------
            CARRIER_ID_CHINAUNICOM_APK => array(
                self::DEFAULT_PAGE_CONF => array(
                    "channelIndexV13UI" => "Channel/V25/index",
                    "secondChannelIndexV13UI" => "Channel/V25/SecondIndex",
                    "videoListV13UI" => "Channel/V25/VideoList"
                )
            ),
        );

        // V13模式页面路由配置
        $v13PagePathCarriers = [CARRIER_ID_DEMO7,// demo7 - 展厅显示版本7
            CARRIER_ID_HUNANDX,          // 湖南电信
            CARRIER_ID_CHINAUNICOM_OTT,  // 中国联通OTT
            CARRIER_ID_GUANGDONGYD,      // 广东移动
            CARRIER_ID_HAIKAN_APK,       // 山东电信 -- 海看APK项目
            CARRIER_ID_JILIN_YD,         // 吉林移动
            CARRIER_ID_JIANGSUDX_YUEME,  // 江苏电信apk -- 悦me
            CARRIER_ID_NEIMENGGU_DX,     // 内蒙古电信apk
            CARRIER_ID_NINGXIA_YD,       // 宁夏移动apk
            CARRIER_ID_GUANGXI_YD,       // 广西移动apk
            CARRIER_ID_ZHEJIANG_HUASHU,  // 浙江华数apk
            CARRIER_ID_GUANGXIGD_APK,    // 广西广电apk
            CARRIER_ID_HUNANYX,          // 湖南有线apk
            CARRIER_ID_HEILONGJIANG_YD,  // 黑龙江移动apk
            CARRIER_ID_QINGHAIDX
        ];
        if(in_array(CARRIER_ID,$v13PagePathCarriers)) {
            $pagePaths[CARRIER_ID] = array(
                self::DEFAULT_PAGE_CONF =>array(
                    "channelIndexV13UI" => "Channel/V13/index",
                    "secondChannelIndexV13UI" => "Channel/V13/SecondIndex",
                    "videoListV13UI" => "Channel/V13/VideoList"
                )
            );
        }

        return $pagePaths;
    }

    public function getDefaultPageConf() {
        return array(
            "indexV1UI" => "Channel/V1/index"
        );
    }
}