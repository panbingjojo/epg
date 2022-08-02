<?php

namespace Home\Model\Entry;

use Home\Common\Tools\Crypt3DES;

class InitAction620092 extends InitActionTelecom{

    protected function getDecodeEPGInfo($infoValue)
    {
        return $infoValue;
    }

    public function handleEPGInfoMap($epgInfoMap)
    {
        // 针对Token值解析
        $userToken = Crypt3DES::decode($epgInfoMap['userToken'], $epgInfoMap["key"]);
        $epgInfoMap["userToken"] =  $userToken;
        return parent::handleEPGInfoMap($epgInfoMap);
    }
}