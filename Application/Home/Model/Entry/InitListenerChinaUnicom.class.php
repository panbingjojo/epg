<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\ServerAPI\SystemAPI;
use Home\Model\Common\Utils;

/**
 * ???????????????
 * Class InitListenerChinaUnicom
 * @package Home\Model\Entry
 */
class InitListenerChinaUnicom implements OnApplicationInitListener {

    public function onApplicationInit() {
        $this->doBeforeWithIndexUrl();

        // 中国联通EPG-天津地区，跳入到天津精品商城
        if (Utils::isTianJinSpecialEntry()) {
            $this->doBeforeForTIANJIN();
        }
    }

    /**
     * 解析URL链接
     */
    private function doBeforeWithIndexUrl() {
        $getUrlHand = SystemAPI::getJumpUrl();
        $indexUrl = MasterManager::getIndexURL();

        if (strpos($indexUrl, "lmacid") !== false) {
            $pos = strpos($indexUrl, "lmacid");
            $dataUrl = substr($indexUrl, $pos, strlen($indexUrl));
            $pos = strpos($dataUrl, "&");
            $dataUrl = substr($dataUrl, $pos, strlen($dataUrl));
            LogUtils::info("go lmacid!!!!!!!!!!!!! ----->: " . $dataUrl);
        } elseif (strpos($indexUrl, "lmp") !== false) {
            $pos = strpos($indexUrl, "lmp");
            $dataUrl = substr($indexUrl, $pos, strlen($indexUrl));
            $pos = strpos($dataUrl, "&");
            $dataUrl = substr($dataUrl, $pos, strlen($dataUrl));
            LogUtils::info("go lmp!!!!!!!!!!!!! ----->: " . $dataUrl);
        } elseif (strpos($indexUrl, "lmsid") !== false) {
            $pos = strpos($indexUrl, "lmsid");
            $dataUrl = substr($indexUrl, $pos, strlen($indexUrl));
            $pos = strpos($dataUrl, "&");
            $dataUrl = substr($dataUrl, $pos, strlen($dataUrl));
            LogUtils::info("go lmsid!!!!!!!!!!!!! ----->: " . $dataUrl);
        } else {
            $pos = strpos($indexUrl, "lmcid");
            $dataUrl = substr($indexUrl, $pos, strlen($indexUrl));
            $pos = strpos($dataUrl, "&");
            $dataUrl = substr($dataUrl, $pos, strlen($dataUrl));
            LogUtils::info("go lmcid!!!!!!!!!!!!! ----->: " . $dataUrl);
        }

        if ($getUrlHand['result'] == 0) {
            $goUrl = $getUrlHand['map_url'] . $dataUrl;
            LogUtils::info("go!!!!!!!!!!!!! ----->: " . $goUrl);
            header("Location:" . $goUrl);
            exit();
        }
    }

    private function doBeforeForTIANJIN() {
        // 如果是在时间段时，就进行调转
        $duration = ["142859", "142859"];
        $nowT = Date('His');

        if ($nowT > $duration[0] && $nowT < $duration[1]) {
            $isGoMoFang = false;
            if ($isGoMoFang) {
                $url = "http://202.99.114.152:30200/index.php?lmuf=0&lmsid=&lmsl=hd-1&lmcid=1000051&lmp=6";
                $epgInfoMap = MasterManager::getEPGInfoMap();
                $info = "";
                foreach ($epgInfoMap as $key => $value) {
                    $info .= "&$key=$value";
                }
                $goUrl = $url . $info;
                header("Location:" . $goUrl);
                exit();
            } else {
                $url = "http://202.99.114.27:35806/epg_uc/home.action?&entranceType=1"
                    . "&UserId=" . MasterManager::getAccountId()
                    . "&CarrierId=201&menuType=7"
                    . "&ReturnUrl=" . urlencode(MasterManager::getIPTVPortalUrl());
                header("Location:" . $url);
                exit();
            }

        }
    }
}