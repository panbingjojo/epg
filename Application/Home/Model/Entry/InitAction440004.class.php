<?php

namespace Home\Model\Entry;

use Home\Model\Common\LogUtils;
use Home\Model\Common\URLUtils;

class InitAction440004 implements InitAction {

    public function getEPGInfoMap()
    {
        // 获取返回地址
        $backUrl = isset($_GET['back_url']) && !empty($_GET['back_url']) ? $_GET['back_url'] : '';

        return array(
            'backUrl' => $backUrl, // 返回局方大厅地址，局方添加跳转功能模块时添加
        );
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        // 存储返回局方大厅地址
        MasterManager::setIPTVPortalUrl($epgInfoMap['backUrl']);

        return $epgInfoMap;
    }
}